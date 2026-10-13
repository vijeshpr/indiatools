/**
 * Batch PDF Password Vault & Permissions Manager — Type Definitions
 * Strict TypeScript types for client-side cryptographic operations,
 * queue management, permissions, and batch processing.
 */

export type VaultMode = 'encrypt' | 'unlock'

export type AesKeyLength = 256 | 128

export interface PdfPermissionsConfig {
  /** Printing capability: none, low-resolution, or full */
  allowPrinting: 'none' | 'low' | 'full'
  /** Allow copying text and graphics out of document */
  allowCopying: boolean
  /** Allow modifying document content */
  allowModifying: 'none' | 'all' | 'annotate'
  /** Allow adding annotations, comments and form fill */
  allowAnnotations: boolean
}

export const DEFAULT_PERMISSIONS: PdfPermissionsConfig = {
  allowPrinting: 'low',
  allowCopying: false,
  allowModifying: 'none',
  allowAnnotations: true,
}

export interface EncryptOptions {
  userPassword: string
  ownerPassword?: string
  keyLength: AesKeyLength
  permissions: PdfPermissionsConfig
}

export interface UnlockOptions {
  password: string
}

export type QueueItemStatus =
  | 'pending'
  | 'validating'
  | 'processing'
  | 'verifying'
  | 'success'
  | 'error'
  | 'cancelled'

export interface PdfQueueItem {
  id: string
  file: File
  name: string
  sizeBytes: number
  pageCount?: number
  status: QueueItemStatus
  progress: number
  errorMessage?: string
  outputBytes?: Uint8Array
  outputBlob?: Blob
  outputUrl?: string
  outputName?: string
  isEncryptedInput?: boolean
  inputEncryptionMethod?: string
}

export interface BatchProcessingSummary {
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
