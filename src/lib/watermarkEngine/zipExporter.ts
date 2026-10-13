import JSZip from 'jszip'
import { BatchItem, ExportConfig } from './types'

/**
 * Strips file extension from a filename.
 */
export function getBaseFileName(filename: string): string {
  const lastDot = filename.lastIndexOf('.')
  if (lastDot === -1) return filename
  return filename.substring(0, lastDot)
}

/**
 * Returns appropriate extension based on export config or original name.
 */
export function getExportExtension(
  filename: string,
  exportConfig: ExportConfig
): string {
  if (exportConfig.format === 'image/jpeg') return 'jpg'
  if (exportConfig.format === 'image/png') return 'png'
  if (exportConfig.format === 'image/webp') return 'webp'

  // If original format requested, extract original extension
  const lastDot = filename.lastIndexOf('.')
  if (lastDot !== -1) {
    return filename.substring(lastDot + 1).toLowerCase()
  }
  return 'jpg'
}

/**
 * Packages all completed batch items into a ZIP file and triggers instant download.
 */
export async function exportBatchToZip(
  items: BatchItem[],
  exportConfig: ExportConfig,
  onZipProgress?: (percent: number) => void
): Promise<Blob> {
  const zip = new JSZip()
  const completedItems = items.filter((item) => item.status === 'done' && item.processedBlob)

  if (completedItems.length === 0) {
    throw new Error('No completed images to export')
  }

  // Deduplicate file names inside the zip archive
  const usedNames = new Set<string>()

  for (let i = 0; i < completedItems.length; i++) {
    const item = completedItems[i]
    if (!item.processedBlob) continue

    const baseName = getBaseFileName(item.name)
    const ext = getExportExtension(item.name, exportConfig)
    const prefix = exportConfig.filenamePrefix || ''
    const suffix = exportConfig.filenameSuffix || '_watermarked'

    let finalName = `${prefix}${baseName}${suffix}.${ext}`
    let counter = 1

    while (usedNames.has(finalName)) {
      finalName = `${prefix}${baseName}${suffix}_(${counter}).${ext}`
      counter++
    }
    usedNames.add(finalName)

    zip.file(finalName, item.processedBlob)
  }

  const zipBlob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 4 },
    },
    (metadata) => {
      onZipProgress?.(Math.round(metadata.percent))
    }
  )

  return zipBlob
}

/**
 * Triggers a download prompt in the browser for any Blob.
 */
export function triggerBlobDownload(blob: Blob, filename: string): void {
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
