import {
  BatchItem,
  TextWatermarkConfig,
  LogoWatermarkConfig,
  ExportConfig,
  WatermarkMode,
} from './types'
import { stampCanvas, exportCanvasToBlob } from './stampRenderer'

export interface BatchProcessingCallbacks {
  onItemProgress?: (id: string, progress: number) => void
  onItemComplete?: (id: string, processedBlob: Blob, processedUrl: string) => void
  onItemError?: (id: string, error: string) => void
  onOverallProgress?: (completedCount: number, totalCount: number, percent: number) => void
}

/**
 * Loads an image File into an HTMLImageElement asynchronously.
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(img)
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error(`Failed to decode image file "${file.name}"`))
    }

    img.src = objectUrl
  })
}

/**
 * Loads a logo from an URL or DataURL into an HTMLImageElement.
 */
export function loadLogoImage(logoUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load logo image'))
    img.src = logoUrl
  })
}

/**
 * Processes a single batch item using HTML5 Canvas.
 */
export async function processSingleItem(
  item: BatchItem,
  mode: WatermarkMode,
  textConfig: TextWatermarkConfig,
  logoConfig: LogoWatermarkConfig,
  logoElement: CanvasImageSource | null,
  exportConfig: ExportConfig
): Promise<{ blob: Blob; url: string }> {
  const img = await loadImageFromFile(item.file)
  const canvas = document.createElement('canvas')

  stampCanvas(
    canvas,
    img,
    img.naturalWidth || item.width,
    img.naturalHeight || item.height,
    mode,
    textConfig,
    logoConfig,
    logoElement
  )

  const blob = await exportCanvasToBlob(
    canvas,
    exportConfig.format,
    item.type || 'image/jpeg',
    exportConfig.quality
  )

  const url = URL.createObjectURL(blob)

  // Memory cleanup
  canvas.width = 0
  canvas.height = 0

  return { blob, url }
}

/**
 * Executes high-speed batch processing across multiple files with controlled concurrency.
 */
export async function runBatchProcessor(
  items: BatchItem[],
  mode: WatermarkMode,
  textConfig: TextWatermarkConfig,
  logoConfig: LogoWatermarkConfig,
  logoElement: CanvasImageSource | null,
  exportConfig: ExportConfig,
  callbacks: BatchProcessingCallbacks,
  abortSignal?: { aborted: boolean }
): Promise<BatchItem[]> {
  const total = items.length
  if (total === 0) return []

  let completedCount = 0
  const updatedItems: BatchItem[] = [...items]

  // Concurrency level based on hardware or fallback to 4
  const concurrency = typeof navigator !== 'undefined' && navigator.hardwareConcurrency
    ? Math.min(8, Math.max(2, navigator.hardwareConcurrency))
    : 4

  let currentIndex = 0

  async function worker(): Promise<void> {
    while (currentIndex < total) {
      if (abortSignal?.aborted) return

      const idx = currentIndex++
      const currentItem = updatedItems[idx]

      try {
        callbacks.onItemProgress?.(currentItem.id, 25)

        // Yield to browser event loop
        await new Promise((r) => setTimeout(r, 0))

        const { blob, url } = await processSingleItem(
          currentItem,
          mode,
          textConfig,
          logoConfig,
          logoElement,
          exportConfig
        )

        if (abortSignal?.aborted) {
          URL.revokeObjectURL(url)
          return
        }

        // Clean previous processed URL if exists
        if (currentItem.processedUrl) {
          URL.revokeObjectURL(currentItem.processedUrl)
        }

        updatedItems[idx] = {
          ...currentItem,
          status: 'done',
          progress: 100,
          processedBlob: blob,
          processedUrl: url,
        }

        callbacks.onItemProgress?.(currentItem.id, 100)
        callbacks.onItemComplete?.(currentItem.id, blob, url)
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Processing failed'
        updatedItems[idx] = {
          ...currentItem,
          status: 'error',
          progress: 0,
          errorMessage: errorMsg,
        }
        callbacks.onItemError?.(currentItem.id, errorMsg)
      } finally {
        completedCount++
        const percent = Math.round((completedCount / total) * 100)
        callbacks.onOverallProgress?.(completedCount, total, percent)
      }
    }
  }

  // Spawn concurrent workers
  const workers = Array.from(
    { length: Math.min(concurrency, total) },
    () => worker()
  )

  await Promise.all(workers)

  return updatedItems
}
