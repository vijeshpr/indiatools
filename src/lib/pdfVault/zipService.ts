/**
 * In-Browser ZIP Packaging Service using JSZip
 * Packages successfully processed PDFs with duplicate filename resolution,
 * progress reporting, and sanitized summary manifest.
 */

import JSZip from 'jszip'
import { PdfQueueItem } from './types'

export interface ZipProgressCallback {
  (percentage: number): void
}

/**
 * Sanitize a filename for safe ZIP packaging
 */
export function sanitizeFileName(name: string): string {
  return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').trim() || 'document.pdf'
}

/**
 * Generate a ZIP containing all successfully processed PDFs
 */
export async function createBatchPdfZip(
  items: PdfQueueItem[],
  mode: 'encrypt' | 'unlock',
  onProgress?: ZipProgressCallback
): Promise<Blob> {
  const successfulItems = items.filter(
    (item) => item.status === 'success' && item.outputBytes && item.outputBytes.length > 0
  )

  if (successfulItems.length === 0) {
    throw new Error('No successfully processed PDF documents available to package.')
  }

  const zip = new JSZip()
  const usedNames = new Set<string>()

  // Add each processed PDF
  for (const item of successfulItems) {
    let baseName = sanitizeFileName(item.outputName || item.name)
    if (!baseName.toLowerCase().endsWith('.pdf')) {
      baseName += '.pdf'
    }

    // Resolve duplicate filenames
    let finalName = baseName
    let counter = 1
    const nameWithoutExt = baseName.replace(/\.pdf$/i, '')

    while (usedNames.has(finalName.toLowerCase())) {
      finalName = `${nameWithoutExt}_(${counter}).pdf`
      counter++
    }
    usedNames.add(finalName.toLowerCase())

    zip.file(finalName, item.outputBytes!)
  }

  // Add safe plain-text summary report (NO passwords exposed!)
  const timestamp = new Date().toISOString()
  const summaryContent = [
    '====================================================',
    'Batch PDF Password Vault & Permissions Manager Report',
    '====================================================',
    `Timestamp: ${timestamp}`,
    `Operation Mode: ${mode === 'encrypt' ? 'Document Protection & Encryption' : 'Password Removal / Decryption'}`,
    `Total Files Processed Successfully: ${successfulItems.length}`,
    '',
    'Files Included in this Archive:',
    ...successfulItems.map(
      (item, i) => `${i + 1}. ${item.outputName || item.name} (${(item.sizeBytes / 1024).toFixed(1)} KB)`
    ),
    '',
    'Security Notice:',
    'This archive was generated 100% locally in your web browser.',
    'No document contents or passwords were ever transmitted to any server.',
    '====================================================',
  ].join('\n')

  zip.file('processing-summary.txt', summaryContent)

  // Generate ZIP Blob with compression and progress tracking
  const zipBlob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      if (onProgress) {
        onProgress(Math.round(metadata.percent))
      }
    }
  )

  return zipBlob
}

export const createBatchZipBundle = createBatchPdfZip

/**
 * Trigger browser file download and safely clean up object URL after delay
 */
export function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = sanitizeFileName(filename)
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)

  // Reliable lifecycle cleanup strategy
  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 10000)
}
