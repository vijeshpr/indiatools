export type P2PConnectionState =
  | 'idle'
  | 'generating_session'
  | 'waiting'
  | 'connecting'
  | 'connected'
  | 'transferring'
  | 'complete'
  | 'disconnected'
  | 'error'

export type PrintColorMode = 'color' | 'bw'

export interface PrintPreferences {
  colorMode: PrintColorMode
  copies: number
  pageRange: string
  orientation: 'portrait' | 'landscape'
  paperSize: 'a4' | 'legal' | 'a5'
}

export interface TransferMetadata {
  fileName: string
  fileType: string
  fileSize: number
  totalChunks?: number
  totalPages?: number
  preferences: PrintPreferences
  sentAt: number
}

export interface TransferProgress {
  bytesReceived: number
  totalBytes: number
  percentage: number
  speedBps: number
  chunkIndex: number
  totalChunks: number
}

export interface ReceivedDocument {
  id: string
  name: string
  type: string
  size: number
  blob: Blob
  blobUrl: string
  pageCount: number
  thumbnails: string[]
  preferences: PrintPreferences
  receivedAt: Date
  orientation: 'portrait' | 'landscape'
}

export interface PosterConfig {
  shopName: string
  tagline: string
  size: 'a4' | 'a5'
  theme: 'obsidian' | 'clean-white' | 'electric-cyan'
  showSteps: boolean
  phoneContact?: string
}

export type SupportedLanguage = 'en' | 'ml' | 'hi' | 'ta' | 'te'

export interface P2PMessage {
  type: 'HANDSHAKE' | 'METADATA' | 'CHUNK' | 'COMPLETE' | 'ACK' | 'STATUS' | 'PURGE' | 'TRANSFER_START' | 'TRANSFER_END'
  sessionId: string
  payload?: any
  chunkIndex?: number
  totalChunks?: number
  fileName?: string
  fileType?: string
  fileSize?: number
  preferences?: PrintPreferences
}
