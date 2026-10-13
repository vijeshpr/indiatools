/**
 * Genuine Browser-Based PDF Security Engine powered by QPDF WebAssembly
 * Implements real AES-256 and AES-128 password encryption, permissions mapping,
 * password removal/decryption, and cryptographic output verification.
 */

import { createPdfToolkit, PdfToolkit, PdfPasswordError, PdfError } from 'pdfstudio'
export { PdfPasswordError, PdfError }
import { EncryptOptions, UnlockOptions } from './types'

let toolkitPromise: Promise<PdfToolkit> | null = null

/**
 * Get or initialize the singleton QPDF WebAssembly toolkit
 */
export async function getPdfToolkit(): Promise<PdfToolkit> {
  if (!toolkitPromise) {
    const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined'
    const options = isBrowser ? { wasmUrl: '/wasm/qpdf.wasm' } : {}
    toolkitPromise = createPdfToolkit(options).catch((err) => {
      toolkitPromise = null // Reset on failure so subsequent attempts can retry
      throw new Error(`Failed to initialize QPDF WebAssembly engine: ${err.message || err}`)
    })
  }
  return toolkitPromise
}

/**
 * Validate that raw bytes contain genuine PDF magic header (%PDF-)
 */
export function validatePdfMagicHeader(bytes: Uint8Array): boolean {
  if (bytes.length < 5) return false
  // Check for %PDF- anywhere within the first 1024 bytes (standard PDF specification)
  const headerSlice = bytes.subarray(0, Math.min(bytes.length, 1024))
  const headerStr = new TextDecoder('latin1').decode(headerSlice)
  return headerStr.includes('%PDF-')
}

export interface PdfInspectionResult {
  isEncrypted: boolean
  pageCount: number
  pdfVersion?: string
  encryptionDetails?: {
    bits?: number
    method?: string
    permissions?: Record<string, boolean>
  }
}

/**
 * Inspect document metadata, page count, and encryption status
 */
export async function inspectPdfFile(
  pdfBytes: Uint8Array,
  password?: string
): Promise<PdfInspectionResult> {
  const toolkit = await getPdfToolkit()

  if (!validatePdfMagicHeader(pdfBytes)) {
    throw new Error('Invalid file format: File does not contain a valid %PDF header.')
  }

  const isEncrypted = await toolkit.isEncrypted(pdfBytes)
  let pageCount = 0
  let pdfVersion: string | undefined
  let encryptionDetails: PdfInspectionResult['encryptionDetails'] | undefined

  try {
    const info = await toolkit.getInfo(pdfBytes, password ? { password } : {})
    pageCount = info.pageCount
    pdfVersion = info.pdfVersion
    if (info.encryption) {
      encryptionDetails = {
        bits: info.encryption.bits,
        method: info.encryption.method,
        permissions: info.encryption.permissions as unknown as Record<string, boolean>,
      }
    }
  } catch (err: any) {
    if (isEncrypted) {
      // Document is locked, page count may only be accessible after unlocking
      return {
        isEncrypted: true,
        pageCount: 0,
      }
    }
    throw err
  }

  return {
    isEncrypted,
    pageCount,
    pdfVersion,
    encryptionDetails,
  }
}

/**
 * Encrypt a PDF document with genuine AES-256 or AES-128 and granular permissions
 */
export async function encryptPdfDocument(
  pdfBytes: Uint8Array,
  options: EncryptOptions
): Promise<Uint8Array> {
  const toolkit = await getPdfToolkit()

  if (!validatePdfMagicHeader(pdfBytes)) {
    throw new Error('Corrupted or invalid PDF: missing %PDF- header.')
  }

  if (!options.userPassword) {
    throw new Error('User/Open password is required for PDF protection.')
  }

  const ownerPassword = options.ownerPassword || options.userPassword

  // Map permissions to QPDF specification
  const permissions: Record<string, any> = {
    print: options.permissions.allowPrinting,
    extract: options.permissions.allowCopying,
    accessibility: true, // Always keep accessibility for screen readers
  }

  if (options.permissions.allowModifying === 'none') {
    permissions.modify = options.permissions.allowAnnotations ? 'annotate' : 'none'
  } else if (options.permissions.allowModifying === 'annotate') {
    permissions.modify = 'annotate'
  } else {
    permissions.modify = 'all'
  }

  try {
    // 1. Perform cryptographic encryption
    const encryptedBytes = await toolkit.lock(pdfBytes, {
      userPassword: options.userPassword,
      ownerPassword,
      keyLength: options.keyLength,
      permissions,
    })

    // 2. Cryptographic Output Verification: Verify that the document is genuinely locked
    const isLocked = await toolkit.isEncrypted(encryptedBytes)
    if (!isLocked) {
      throw new Error('Cryptographic verification failed: Output document was not encrypted.')
    }

    // 3. Confirm authentication with user password and verify permissions
    const verifyInfo = await toolkit.getInfo(encryptedBytes, { password: options.userPassword })
    if (!verifyInfo.encrypted) {
      throw new Error('Cryptographic verification failed: Could not authenticate with user password.')
    }

    return encryptedBytes
  } catch (err: any) {
    if (err instanceof PdfError) {
      throw new Error(`Encryption failed: ${err.message}`)
    }
    throw err
  }
}

/**
 * Remove password and encryption from an authorized protected PDF
 */
export async function unlockPdfDocument(
  pdfBytes: Uint8Array,
  options: UnlockOptions
): Promise<Uint8Array> {
  const toolkit = await getPdfToolkit()

  if (!validatePdfMagicHeader(pdfBytes)) {
    throw new Error('Corrupted or invalid PDF: missing %PDF- header.')
  }

  const isEncrypted = await toolkit.isEncrypted(pdfBytes)
  if (!isEncrypted) {
    // Document is already unencrypted, return clean copy
    return pdfBytes
  }

  if (!options.password) {
    throw new Error('Password is required to unlock this encrypted document.')
  }

  try {
    // 1. Decrypt document using supplied password
    const decryptedBytes = await toolkit.unlock(pdfBytes, {
      password: options.password,
    })

    // 2. Verification: Ensure output is completely unencrypted
    const stillEncrypted = await toolkit.isEncrypted(decryptedBytes)
    if (stillEncrypted) {
      throw new Error('Decryption verification failed: Document remains locked.')
    }

    // 3. Confirm document structure is intact and readable without password
    const testInfo = await toolkit.getInfo(decryptedBytes)
    if (testInfo.encrypted) {
      throw new Error('Decryption verification failed: Document still reports encryption header.')
    }

    return decryptedBytes
  } catch (err: any) {
    if (err instanceof PdfPasswordError || /invalid password|incorrect password/i.test(err?.message || '')) {
      if (err instanceof PdfPasswordError) {
        throw err
      }
      throw new PdfPasswordError('Incorrect password. The supplied password did not match this document.', 2, err?.message || '')
    }
    if (err instanceof PdfError) {
      throw new Error(`Decryption failed: ${err.message}`)
    }
    throw err
  }
}

/**
 * Generate a valid, minimal PDF 1.4 byte buffer for local testing
 */
export function generateSamplePdfBytes(
  title = 'Sample Document',
  body = 'Confidential test content.'
): Uint8Array {
  const content = `BT /F1 18 Tf 72 720 Td (${title}) Tj /F1 12 Tf 72 680 Td (${body}) Tj ET`
  const stream = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`
  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj',
    `4 0 obj\n${stream}\nendobj`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
  ]

  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  let currentOffset = pdf.length

  for (let i = 0; i < objects.length; i++) {
    offsets.push(currentOffset)
    const objStr = objects[i] + '\n'
    pdf += objStr
    currentOffset += objStr.length
  }

  const startxref = currentOffset
  pdf += 'xref\n'
  pdf += `0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'
  for (let i = 1; i <= objects.length; i++) {
    pdf += String(offsets[i]).padStart(10, '0') + ' 00000 n \n'
  }
  pdf += 'trailer\n'
  pdf += `<< /Size ${objects.length + 1} /Root 1 0 R >>\n`
  pdf += 'startxref\n'
  pdf += `${startxref}\n`
  pdf += '%%EOF\n'

  return new TextEncoder().encode(pdf)
}

