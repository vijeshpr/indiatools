/**
 * Zero-Knowledge Military File Encrypter & Decrypter — Type Definitions
 * Strict TypeScript types for client-side authenticated AES-256-GCM chunked file container,
 * queue state machine, and real-time processing telemetry.
 */

export type VaultMode = 'encrypt' | 'decrypt'

export type VaultItemStatus =
  | 'idle'
  | 'deriving-key'
  | 'processing'
  | 'authenticating'
  | 'verifying'
  | 'success'
  | 'error'
  | 'cancelled'

export interface VaultContainerMetadata {
  /** Original filename before encryption */
  originalName: string
  /** Original file size in bytes */
  originalSize: number
  /** Inferred or original MIME type */
  mimeType: string
  /** Unix timestamp in milliseconds when vault was created */
  createdAt: number
  /** Optional public password hint */
  hint?: string
}

export interface VaultHeader {
  magic: string
  version: number
  kdfAlgorithm: number
  kdfIterations: number
  cipherAlgorithm: number
  salt: Uint8Array
  noncePrefix: Uint8Array
  chunkSize: number
  metadataLength: number
  metadata: VaultContainerMetadata
  rawHeaderBytes: Uint8Array
  headerHash: Uint8Array
}

export interface EncryptConfig {
  password: string
  confirmPassword?: string
  hint?: string
  chunkSize?: number
  kdfIterations?: number
}

export interface DecryptConfig {
  password: string
}

export interface VaultQueueItem {
  id: string
  file: File
  name: string
  sizeBytes: number
  status: VaultItemStatus
  progress: number
  chunksProcessed: number
  totalChunks: number
  currentChunkThroughput: number // MB/s
  bytesProcessed: number
  elapsedTimeMs: number
  estimatedRemainingMs?: number
  errorMessage?: string
  outputBlob?: Blob
  outputUrl?: string
  outputName?: string
  metadata?: VaultContainerMetadata
}

export interface VaultProgressUpdate {
  itemId: string
  bytesProcessed: number
  totalBytes: number
  chunksProcessed: number
  totalChunks: number
  throughputMBps: number
  elapsedMs: number
  status: VaultItemStatus
  statusMessage?: string
}

export interface BatchVaultSummary {
  total: number
  pending: number
  processing: number
  success: number
  failed: number
  overallProgress: number
  currentFileName?: string
  isComplete: boolean
  isCancelled: boolean
}

// Custom Typed Cryptographic Errors
export class VaultError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'VaultError'
  }
}

export class VaultAuthenticationError extends VaultError {
  constructor(message = 'Authentication failed: Incorrect password or corrupted encrypted data.') {
    super(message)
    this.name = 'VaultAuthenticationError'
  }
}

export class VaultHeaderError extends VaultError {
  constructor(message = 'Invalid container header: File is not a valid or supported .vault archive.') {
    super(message)
    this.name = 'VaultHeaderError'
  }
}

export class VaultTamperedError extends VaultError {
  constructor(message = 'Security alert: Container integrity check failed. The file has been modified or corrupted.') {
    super(message)
    this.name = 'VaultTamperedError'
  }
}

// Binary Container Format Constants
export const VAULT_FORMAT = {
  MAGIC: 'ZKVAULT1', // 8 ASCII bytes
  MAGIC_BYTES: new Uint8Array([0x5a, 0x4b, 0x56, 0x41, 0x55, 0x4c, 0x54, 0x31]),
  VERSION: 1, // uint16
  KDF_PBKDF2_SHA256: 1, // uint8
  DEFAULT_KDF_ITERATIONS: 250000, // uint32 (250,000 rounds)
  MIN_KDF_ITERATIONS: 100000,
  MAX_KDF_ITERATIONS: 2000000,
  CIPHER_AES256_GCM: 1, // uint8
  SALT_LENGTH: 16, // 16 bytes
  NONCE_PREFIX_LENGTH: 8, // 8 bytes
  NONCE_TOTAL_LENGTH: 12, // 12 bytes (8 bytes prefix + 4 bytes big-endian counter)
  GCM_TAG_LENGTH: 16, // 16 bytes authentication tag
  DEFAULT_CHUNK_SIZE: 4 * 1024 * 1024, // 4 MiB (4,194,304 bytes)
  MIN_CHUNK_SIZE: 64 * 1024, // 64 KiB
  MAX_CHUNK_SIZE: 16 * 1024 * 1024, // 16 MiB
  FINAL_RECORD_MARKER: 0xffffffff, // uint32 chunk index marker for final manifest
  RECORD_TYPE_CHUNK: 0x01,
  RECORD_TYPE_FINAL: 0xff,
} as const
