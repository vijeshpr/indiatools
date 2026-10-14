import Peer, { DataConnection } from 'peerjs'
import { PDFDocument } from 'pdf-lib'
import {
  P2PConnectionState,
  P2PMessage,
  PrintPreferences,
  ReceivedDocument,
  TransferMetadata,
  TransferProgress,
} from '../../types/p2pPrint'

const CHUNK_SIZE = 64 * 1024 // 64KB chunks for optimal WebRTC DataChannel throughput

export interface P2PEngineCallbacks {
  onStateChange: (state: P2PConnectionState, detail?: string) => void
  onProgress?: (progress: TransferProgress) => void
  onDocumentReceived?: (doc: ReceivedDocument) => void
  onPeerConnected?: () => void
  onPeerDisconnected?: () => void
  onError?: (err: string) => void
}

export class P2PPrintEngine {
  private role: 'receiver' | 'sender'
  private sessionId: string
  private peer: Peer | null = null
  private connection: DataConnection | null = null
  private broadcastChannel: BroadcastChannel | null = null
  private callbacks: P2PEngineCallbacks
  private state: P2PConnectionState = 'idle'

  // Transfer state
  private incomingMetadata: TransferMetadata | null = null
  private incomingChunks: Map<number, Uint8Array> = new Map()
  private bytesReceived = 0
  private transferStartTime = 0

  // Created URLs to revoke on purge
  private objectUrlsToRevoke: string[] = []

  constructor(role: 'receiver' | 'sender', sessionId: string, callbacks: P2PEngineCallbacks) {
    this.role = role
    this.sessionId = sessionId
    this.callbacks = callbacks

    this.initBroadcastChannel()
    this.initPeer()
  }

  private updateState(newState: P2PConnectionState, detail?: string) {
    this.state = newState
    this.callbacks.onStateChange(newState, detail)
  }

  private initBroadcastChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel(`ipt_p2p_print_${this.sessionId}`)
        this.broadcastChannel.onmessage = (event) => {
          this.handleIncomingMessage(event.data)
        }
      } catch (e) {
        // BroadcastChannel optional fallback
      }
    }
  }

  private initPeer() {
    this.updateState('generating_session')

    const peerId = this.role === 'receiver' ? `ipt-recv-${this.sessionId}` : `ipt-send-${this.sessionId}-${Math.random().toString(36).slice(2, 6)}`

    try {
      this.peer = new Peer(peerId, {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
          ],
        },
      })

      this.peer.on('open', () => {
        if (this.role === 'receiver') {
          this.updateState('waiting')
        } else {
          this.updateState('connecting')
          this.connectToReceiver()
        }
      })

      this.peer.on('connection', (conn) => {
        this.setupConnection(conn)
      })

      this.peer.on('error', (err) => {
        // If peer ID already taken or server unavailable, fallback to BroadcastChannel seamlessly
        if (err.type === 'unavailable-id') {
          // Already generated or active in local session
        } else {
          this.callbacks.onError?.(err.message)
        }
      })
    } catch (err: any) {
      this.callbacks.onError?.(err?.message || 'WebRTC Peer initialization failed')
    }
  }

  private connectToReceiver() {
    if (!this.peer) return
    const targetPeerId = `ipt-recv-${this.sessionId}`
    const conn = this.peer.connect(targetPeerId, {
      reliable: true,
    })
    this.setupConnection(conn)

    // Also broadcast handshake via BroadcastChannel for immediate same-device pairing
    this.broadcastMessage({
      type: 'HANDSHAKE',
      sessionId: this.sessionId,
      payload: { role: 'sender' },
    })
  }

  private setupConnection(conn: DataConnection) {
    this.connection = conn

    conn.on('open', () => {
      this.updateState('connected')
      this.callbacks.onPeerConnected?.()

      this.sendMessage({
        type: 'HANDSHAKE',
        sessionId: this.sessionId,
        payload: { role: this.role },
      })
    })

    conn.on('data', (data: any) => {
      this.handleIncomingMessage(data)
    })

    conn.on('close', () => {
      this.callbacks.onPeerDisconnected?.()
      if (this.state === 'connected' || this.state === 'transferring') {
        this.updateState(this.role === 'receiver' ? 'waiting' : 'disconnected')
      }
    })

    conn.on('error', () => {
      if (this.state !== 'complete') {
        this.updateState('error', 'Connection error occurred')
      }
    })
  }

  private sendMessage(msg: P2PMessage) {
    if (this.connection && this.connection.open) {
      try {
        this.connection.send(msg)
      } catch (e) {
        // Fallback
      }
    }
    this.broadcastMessage(msg)
  }

  private broadcastMessage(msg: P2PMessage) {
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(msg)
      } catch (e) {
        // Fallback
      }
    }
  }

  private handleIncomingMessage(msg: P2PMessage) {
    if (!msg || msg.sessionId !== this.sessionId) return

    switch (msg.type) {
      case 'HANDSHAKE':
        if (this.state !== 'connected' && this.state !== 'transferring') {
          this.updateState('connected')
          this.callbacks.onPeerConnected?.()
        }
        break

      case 'METADATA':
        if (this.role === 'receiver') {
          this.incomingMetadata = msg.payload as TransferMetadata
          this.incomingChunks.clear()
          this.bytesReceived = 0
          this.transferStartTime = Date.now()
          this.updateState('transferring')
        }
        break

      case 'CHUNK':
        if (this.role === 'receiver' && msg.chunkIndex !== undefined && msg.payload) {
          const rawChunk = msg.payload
          let chunkBytes: Uint8Array
          if (rawChunk instanceof ArrayBuffer) {
            chunkBytes = new Uint8Array(rawChunk)
          } else if (rawChunk instanceof Uint8Array) {
            chunkBytes = rawChunk
          } else if (Array.isArray(rawChunk)) {
            chunkBytes = new Uint8Array(rawChunk)
          } else if (typeof rawChunk === 'string') {
            // Base64 fallback
            const binStr = atob(rawChunk)
            chunkBytes = new Uint8Array(binStr.length)
            for (let i = 0; i < binStr.length; i++) {
              chunkBytes[i] = binStr.charCodeAt(i)
            }
          } else {
            chunkBytes = new Uint8Array(0)
          }

          this.incomingChunks.set(msg.chunkIndex, chunkBytes)
          this.bytesReceived += chunkBytes.byteLength

          const totalBytes = this.incomingMetadata?.fileSize || 1
          const totalChunks = msg.totalChunks || 1
          const durationSec = Math.max(0.1, (Date.now() - this.transferStartTime) / 1000)
          const speedBps = Math.round(this.bytesReceived / durationSec)

          this.callbacks.onProgress?.({
            bytesReceived: this.bytesReceived,
            totalBytes,
            percentage: Math.min(100, Math.round((this.bytesReceived / totalBytes) * 100)),
            speedBps,
            chunkIndex: msg.chunkIndex + 1,
            totalChunks,
          })
        }
        break

      case 'COMPLETE':
        if (this.role === 'receiver') {
          this.finalizeIncomingDocument()
        }
        break

      case 'PURGE':
        this.purgeMemory()
        break
    }
  }

  private async finalizeIncomingDocument() {
    if (!this.incomingMetadata) return

    const meta = this.incomingMetadata
    const totalChunks = this.incomingChunks.size

    // Assemble unified buffer
    const merged = new Uint8Array(this.bytesReceived)
    let offset = 0
    for (let i = 0; i < totalChunks; i++) {
      const chunk = this.incomingChunks.get(i)
      if (chunk) {
        merged.set(chunk, offset)
        offset += chunk.byteLength
      }
    }

    const blob = new Blob([merged.buffer], { type: meta.fileType || 'application/octet-stream' })
    const blobUrl = URL.createObjectURL(blob)
    this.objectUrlsToRevoke.push(blobUrl)

    let pageCount = 1
    const thumbnails: string[] = []

    if (meta.fileType.includes('pdf')) {
      try {
        const pdfDoc = await PDFDocument.load(merged.buffer, { ignoreEncryption: true })
        pageCount = pdfDoc.getPageCount()
      } catch (err) {
        pageCount = meta.totalPages || 1
      }
    } else if (meta.fileType.startsWith('image/')) {
      thumbnails.push(blobUrl)
      pageCount = 1
    }

    const doc: ReceivedDocument = {
      id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: meta.fileName,
      type: meta.fileType,
      size: meta.fileSize,
      blob,
      blobUrl,
      pageCount,
      thumbnails,
      preferences: meta.preferences,
      receivedAt: new Date(),
      orientation: meta.preferences.orientation || 'portrait',
    }

    this.updateState('complete')
    this.callbacks.onDocumentReceived?.(doc)
  }

  /**
   * Sender API: Send a selected file to the receiver with streaming chunks
   */
  public async sendFile(file: File, preferences: PrintPreferences): Promise<void> {
    if (this.state !== 'connected') {
      this.updateState('connecting')
      this.connectToReceiver()
      // Wait briefly for channel opening
      await new Promise((r) => setTimeout(r, 600))
    }

    this.updateState('transferring')

    const fileBuffer = await file.arrayBuffer()
    const totalBytes = fileBuffer.byteLength
    const totalChunks = Math.ceil(totalBytes / CHUNK_SIZE)

    let totalPages = 1
    if (file.type.includes('pdf')) {
      try {
        const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true })
        totalPages = pdfDoc.getPageCount()
      } catch (e) {
        totalPages = 1
      }
    }

    const meta: TransferMetadata = {
      fileName: file.name,
      fileType: file.type || 'application/octet-stream',
      fileSize: totalBytes,
      totalPages,
      preferences,
      sentAt: Date.now(),
    }

    // 1. Send METADATA
    this.sendMessage({
      type: 'METADATA',
      sessionId: this.sessionId,
      payload: meta,
    })

    // 2. Stream CHUNKS
    const startTime = Date.now()
    let bytesSent = 0

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, totalBytes)
      const chunkSlice = fileBuffer.slice(start, end)
      const chunkArray = new Uint8Array(chunkSlice)

      this.sendMessage({
        type: 'CHUNK',
        sessionId: this.sessionId,
        chunkIndex: i,
        totalChunks,
        payload: Array.from(chunkArray),
      })

      bytesSent += chunkArray.byteLength
      const elapsed = Math.max(0.1, (Date.now() - startTime) / 1000)
      const speedBps = Math.round(bytesSent / elapsed)

      this.callbacks.onProgress?.({
        bytesReceived: bytesSent,
        totalBytes,
        percentage: Math.min(100, Math.round((bytesSent / totalBytes) * 100)),
        speedBps,
        chunkIndex: i + 1,
        totalChunks,
      })

      // Brief delay to allow buffer drain without overwhelming the peer
      if (i % 8 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 8))
      }
    }

    // 3. Send COMPLETE
    this.sendMessage({
      type: 'COMPLETE',
      sessionId: this.sessionId,
    })

    this.updateState('complete')
  }

  /**
   * Immediately shred all file buffers from RAM, revoke object URLs, and reset session
   */
  public purgeMemory() {
    // Revoke all created URLs
    for (const url of this.objectUrlsToRevoke) {
      try {
        URL.revokeObjectURL(url)
      } catch (e) {
        // Ignore
      }
    }
    this.objectUrlsToRevoke = []

    // Wipe chunks map
    this.incomingChunks.clear()
    this.incomingMetadata = null
    this.bytesReceived = 0

    // Send purge signal to peer
    this.sendMessage({
      type: 'PURGE',
      sessionId: this.sessionId,
    })

    if (this.role === 'receiver') {
      this.updateState('waiting')
    } else {
      this.updateState('connected')
    }
  }

  /**
   * Complete destruction on unmount / navigation
   */
  public destroy() {
    this.purgeMemory()

    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.close()
      } catch (e) {
        // Ignore
      }
      this.broadcastChannel = null
    }

    if (this.connection) {
      try {
        this.connection.close()
      } catch (e) {
        // Ignore
      }
      this.connection = null
    }

    if (this.peer) {
      try {
        this.peer.destroy()
      } catch (e) {
        // Ignore
      }
      this.peer = null
    }

    this.state = 'idle'
  }
}
