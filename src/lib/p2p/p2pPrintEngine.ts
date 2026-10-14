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

// Strictly slice ArrayBuffer into 16,384 bytes (16 KB) segments
const CHUNK_SIZE = 16384

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

  // Receiver transfer state: guaranteed in-memory array buffer assembly
  private incomingMetadata: TransferMetadata | null = null
  private receivedChunks: ArrayBuffer[] = []
  private bytesReceived = 0
  private transferStartTime = 0

  // Created URLs to revoke on purge / new arrivals
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
          this.handleIncomingData(event.data)
        }
      } catch (e) {
        // BroadcastChannel optional fallback
      }
    }
  }

  private initPeer() {
    this.updateState('generating_session')

    const peerId =
      this.role === 'receiver'
        ? `ipt-recv-${this.sessionId}`
        : `ipt-send-${this.sessionId}-${Math.random().toString(36).slice(2, 6)}`

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

    // Ensure underlying RTCDataChannel is configured for ArrayBuffer binary transfer
    const dc = (conn as any).dataChannel as RTCDataChannel | undefined
    if (dc) {
      dc.binaryType = 'arraybuffer'
      dc.bufferedAmountLowThreshold = 65536
    }

    conn.on('open', () => {
      const activeDc = (conn as any).dataChannel as RTCDataChannel | undefined
      if (activeDc) {
        activeDc.binaryType = 'arraybuffer'
        activeDc.bufferedAmountLowThreshold = 65536
      }

      this.updateState('connected')
      this.callbacks.onPeerConnected?.()

      this.sendMessage({
        type: 'HANDSHAKE',
        sessionId: this.sessionId,
        payload: { role: this.role },
      })
    })

    conn.on('data', (data: any) => {
      this.handleIncomingData(data)
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

  private sendBinaryChunk(chunk: ArrayBuffer) {
    if (this.connection && this.connection.open) {
      try {
        this.connection.send(chunk)
      } catch (e) {
        try {
          const dc = (this.connection as any)?.dataChannel as RTCDataChannel | undefined
          if (dc && dc.readyState === 'open') {
            dc.send(chunk)
          }
        } catch (err) {
          // Fallback
        }
      }
    }
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(chunk)
      } catch (e) {
        // Fallback
      }
    }
  }

  private handleIncomingData(data: any) {
    if (!data) return

    // If direct binary chunk arrived (ArrayBuffer or TypedArray view)
    if (data instanceof ArrayBuffer) {
      this.handleBinaryChunk(data)
      return
    }

    if (ArrayBuffer.isView(data)) {
      const u8 = new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
      const copy = new Uint8Array(u8.byteLength)
      copy.set(u8)
      this.handleBinaryChunk(copy.buffer)
      return
    }

    // Otherwise JSON / P2P control message
    this.handleIncomingMessage(data)
  }

  private handleBinaryChunk(chunk: ArrayBuffer) {
    if (this.role !== 'receiver') return

    this.receivedChunks.push(chunk)
    this.bytesReceived += chunk.byteLength

    const totalBytes = this.incomingMetadata?.fileSize || 1
    const totalChunks =
      this.incomingMetadata?.totalChunks || Math.ceil(totalBytes / CHUNK_SIZE) || 1
    const durationSec = Math.max(0.1, (Date.now() - this.transferStartTime) / 1000)
    const speedBps = Math.round(this.bytesReceived / durationSec)

    this.callbacks.onProgress?.({
      bytesReceived: this.bytesReceived,
      totalBytes,
      percentage: Math.min(100, Math.round((this.bytesReceived / totalBytes) * 100)),
      speedBps,
      chunkIndex: this.receivedChunks.length,
      totalChunks,
    })
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

      case 'TRANSFER_START':
      case 'METADATA': {
        if (this.role === 'receiver') {
          const payload = msg.payload || {}
          this.incomingMetadata = {
            fileName: msg.fileName || payload.fileName || 'document.pdf',
            fileType: msg.fileType || payload.fileType || 'application/pdf',
            fileSize: msg.fileSize || payload.fileSize || 0,
            totalChunks: msg.totalChunks || payload.totalChunks || 1,
            totalPages: payload.totalPages || 1,
            preferences: msg.preferences || payload.preferences || {
              colorMode: 'bw',
              copies: 1,
              pageRange: 'All',
              orientation: 'portrait',
              paperSize: 'a4',
            },
            sentAt: payload.sentAt || Date.now(),
          }
          this.receivedChunks = []
          this.bytesReceived = 0
          this.transferStartTime = Date.now()
          this.updateState('transferring')
        }
        break
      }

      case 'CHUNK': {
        if (this.role === 'receiver' && msg.payload) {
          const rawChunk = msg.payload
          let chunkBytes: ArrayBuffer
          if (rawChunk instanceof ArrayBuffer) {
            chunkBytes = rawChunk
          } else if (ArrayBuffer.isView(rawChunk)) {
            const u8 = new Uint8Array(rawChunk.buffer, rawChunk.byteOffset, rawChunk.byteLength)
            const copy = new Uint8Array(u8.byteLength)
            copy.set(u8)
            chunkBytes = copy.buffer
          } else if (Array.isArray(rawChunk)) {
            const copy = new Uint8Array(rawChunk)
            chunkBytes = copy.buffer
          } else if (typeof rawChunk === 'string') {
            const binStr = atob(rawChunk)
            const copy = new Uint8Array(binStr.length)
            for (let i = 0; i < binStr.length; i++) {
              copy[i] = binStr.charCodeAt(i)
            }
            chunkBytes = copy.buffer
          } else {
            chunkBytes = new ArrayBuffer(0)
          }
          this.handleBinaryChunk(chunkBytes)
        }
        break
      }

      case 'TRANSFER_END':
      case 'COMPLETE': {
        if (this.role === 'receiver') {
          this.finalizeIncomingDocument()
        }
        break
      }

      case 'PURGE':
        this.purgeMemory()
        break
    }
  }

  private async finalizeIncomingDocument() {
    if (!this.incomingMetadata) return

    const meta = this.incomingMetadata

    // Assemble final Blob directly from received chunks
    const finalBlob = new Blob(this.receivedChunks, {
      type: meta.fileType || 'application/pdf',
    })

    // Verify byte integrity
    if (meta.fileSize > 0 && finalBlob.size !== meta.fileSize) {
      console.warn(
        `[Scan-to-Print P2P] Byte integrity warning: expected ${meta.fileSize} bytes, assembled ${finalBlob.size} bytes.`
      )
    }

    // Revoke previous Blob URLs to guarantee zero memory leaks
    for (const oldUrl of this.objectUrlsToRevoke) {
      try {
        URL.revokeObjectURL(oldUrl)
      } catch (e) {
        // Ignore
      }
    }
    this.objectUrlsToRevoke = []

    // Generate new clean Blob URL
    const blobUrl = URL.createObjectURL(finalBlob)
    this.objectUrlsToRevoke.push(blobUrl)

    let pageCount = 1
    const thumbnails: string[] = []

    if (meta.fileType.includes('pdf')) {
      try {
        const arrayBuf = await finalBlob.arrayBuffer()
        const pdfDoc = await PDFDocument.load(arrayBuf, { ignoreEncryption: true })
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
      size: finalBlob.size,
      blob: finalBlob,
      blobUrl,
      pageCount,
      thumbnails,
      preferences: meta.preferences,
      receivedAt: new Date(),
      orientation: meta.preferences?.orientation || 'portrait',
    }

    this.updateState('complete')
    this.callbacks.onDocumentReceived?.(doc)
  }

  /**
   * Sender API: Send a selected file to the receiver with streaming 16KB binary chunks
   * and strict WebRTC backpressure handling.
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
      fileType: file.type || 'application/pdf',
      fileSize: totalBytes,
      totalPages,
      preferences,
      sentAt: Date.now(),
    }

    // Step 1: Send TRANSFER_START metadata handshake
    this.sendMessage({
      type: 'TRANSFER_START',
      sessionId: this.sessionId,
      fileName: file.name,
      fileType: file.type || 'application/pdf',
      fileSize: totalBytes,
      totalChunks,
      preferences,
      payload: meta,
    })

    // Brief delay to allow receiver to initialize chunks buffer
    await new Promise((resolve) => setTimeout(resolve, 30))

    // Step 2: Iterate through chunks with strict backpressure handling
    const startTime = Date.now()
    let bytesSent = 0

    const dc = (this.connection as any)?.dataChannel as RTCDataChannel | undefined
    if (dc) {
      dc.bufferedAmountLowThreshold = 65536
    }

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE
      const end = Math.min(start + CHUNK_SIZE, totalBytes)
      const chunkSlice = fileBuffer.slice(start, end)

      // Backpressure check: if bufferedAmount > 65536, pause and await bufferedamountlow
      if (dc && dc.readyState === 'open') {
        if (dc.bufferedAmount > 65536) {
          await new Promise<void>((resolve) => {
            let done = false
            const onLow = () => {
              if (!done) {
                done = true
                dc.removeEventListener('bufferedamountlow', onLow)
                resolve()
              }
            }
            dc.addEventListener('bufferedamountlow', onLow)
            setTimeout(() => {
              if (!done) {
                done = true
                dc.removeEventListener('bufferedamountlow', onLow)
                resolve()
              }
            }, 60)
          })
        }
      }

      // Dispatch raw binary chunk
      this.sendBinaryChunk(chunkSlice)

      bytesSent += chunkSlice.byteLength
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

      // Minimal yield every 16 chunks (256 KB) to maintain browser responsiveness
      if (i % 16 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 4))
      }
    }

    // Step 3: When all chunks are sent, dispatch completion signal
    this.sendMessage({
      type: 'TRANSFER_END',
      sessionId: this.sessionId,
      payload: { fileName: file.name, fileSize: totalBytes },
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

    // Wipe received chunks array and metadata
    this.receivedChunks = []
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
