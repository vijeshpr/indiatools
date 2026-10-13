/**
 * React Hook: useVaultQueue
 * Manages the file queue, mode switching, concurrency-controlled processing,
 * live progress updates, throughput measurement, cancellation, and object URL lifecycles.
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import JSZip from 'jszip'
import {
  VaultMode,
  VaultQueueItem,
  EncryptConfig,
  DecryptConfig,
  BatchVaultSummary,
  VaultProgressUpdate,
} from './types'
import { encryptFileToVault, decryptVaultToFile } from './streamProcessor'

export function useVaultQueue() {
  const [queue, setQueue] = useState<VaultQueueItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentProgress, setCurrentProgress] = useState<VaultProgressUpdate | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)
  const activeUrlsRef = useRef<Set<string>>(new Set())

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      activeUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
      activeUrlsRef.current.clear()
    }
  }, [])

  // Add files to queue
  const addFiles = useCallback((files: File[]) => {
    const newItems: VaultQueueItem[] = files.map((file) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      return {
        id,
        file,
        name: file.name,
        sizeBytes: file.size,
        status: 'idle',
        progress: 0,
        chunksProcessed: 0,
        totalChunks: Math.max(1, Math.ceil(file.size / (4 * 1024 * 1024))),
        currentChunkThroughput: 0,
        bytesProcessed: 0,
        elapsedTimeMs: 0,
      }
    })

    setQueue((prev) => [...prev, ...newItems])
  }, [])

  // Remove single item
  const removeItem = useCallback((id: string) => {
    setQueue((prev) => {
      const target = prev.find((item) => item.id === id)
      if (target?.outputUrl) {
        URL.revokeObjectURL(target.outputUrl)
        activeUrlsRef.current.delete(target.outputUrl)
      }
      return prev.filter((item) => item.id !== id)
    })
  }, [])

  // Clear entire queue
  const clearQueue = useCallback(() => {
    activeUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    activeUrlsRef.current.clear()
    setQueue([])
    setCurrentProgress(null)
  }, [])

  // Cancel active batch
  const cancelProcessing = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsProcessing(false)
    setQueue((prev) =>
      prev.map((item) =>
        item.status === 'processing' || item.status === 'deriving-key'
          ? { ...item, status: 'cancelled', errorMessage: 'Operation cancelled by user.' }
          : item
      )
    )
  }, [])

  // Trigger file download
  const downloadItem = useCallback((item: VaultQueueItem) => {
    if (!item.outputBlob || !item.outputName) return

    const url = URL.createObjectURL(item.outputBlob)
    activeUrlsRef.current.add(url)

    const a = document.createElement('a')
    a.href = url
    a.download = item.outputName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    setTimeout(() => {
      URL.revokeObjectURL(url)
      activeUrlsRef.current.delete(url)
    }, 15000)
  }, [])

  // Download all successful files as ZIP
  const downloadAllZip = useCallback(async (mode: VaultMode) => {
    const completed = queue.filter(
      (item) => item.status === 'success' && item.outputBlob && item.outputName
    )
    if (completed.length === 0) return

    const zip = new JSZip()
    const usedNames = new Set<string>()

    for (const item of completed) {
      let fileName = item.outputName!
      let counter = 1
      while (usedNames.has(fileName)) {
        const parts = fileName.split('.')
        const ext = parts.length > 1 ? `.${parts.pop()}` : ''
        const base = parts.join('.')
        fileName = `${base}_(${counter})${ext}`
        counter++
      }
      usedNames.add(fileName)
      zip.file(fileName, item.outputBlob!)
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const zipName =
      mode === 'encrypt'
        ? `IndiaTools_Encrypted_Vault_${Date.now()}.zip`
        : `IndiaTools_Decrypted_Files_${Date.now()}.zip`

    const a = document.createElement('a')
    const zipUrl = URL.createObjectURL(zipBlob)
    a.href = zipUrl
    a.download = zipName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    setTimeout(() => URL.revokeObjectURL(zipUrl), 15000)
  }, [queue])

  // Run batch process sequentially to avoid RAM exhaustion
  const startBatch = useCallback(
    async (mode: VaultMode, config: EncryptConfig | DecryptConfig) => {
      setIsProcessing(true)
      const controller = new AbortController()
      abortControllerRef.current = controller

      const itemsToProcess = queue.filter(
        (it) => it.status === 'idle' || it.status === 'error' || it.status === 'cancelled'
      )

      for (const item of itemsToProcess) {
        if (controller.signal.aborted) break

        setQueue((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? { ...it, status: 'processing', progress: 5, errorMessage: undefined }
              : it
          )
        )

        try {
          const handleProgress = (update: VaultProgressUpdate) => {
            setCurrentProgress(update)
            setQueue((prev) =>
              prev.map((it) =>
                it.id === item.id
                  ? {
                      ...it,
                      status: update.status,
                      progress:
                        update.totalBytes > 0
                          ? Math.min(100, Math.round((update.bytesProcessed / update.totalBytes) * 100))
                          : 100,
                      bytesProcessed: update.bytesProcessed,
                      chunksProcessed: update.chunksProcessed,
                      totalChunks: update.totalChunks,
                      currentChunkThroughput: update.throughputMBps,
                      elapsedTimeMs: update.elapsedMs,
                    }
                  : it
              )
            )
          }

          if (mode === 'encrypt') {
            const res = await encryptFileToVault(
              item.file,
              config as EncryptConfig,
              handleProgress,
              controller.signal
            )

            const outputUrl = URL.createObjectURL(res.outputBlob)
            activeUrlsRef.current.add(outputUrl)

            setQueue((prev) =>
              prev.map((it) =>
                it.id === item.id
                  ? {
                      ...it,
                      status: 'success',
                      progress: 100,
                      outputBlob: res.outputBlob,
                      outputName: res.outputName,
                      outputUrl,
                    }
                  : it
              )
            )
          } else {
            const res = await decryptVaultToFile(
              item.file,
              config as DecryptConfig,
              handleProgress,
              controller.signal
            )

            const outputUrl = URL.createObjectURL(res.outputBlob)
            activeUrlsRef.current.add(outputUrl)

            setQueue((prev) =>
              prev.map((it) =>
                it.id === item.id
                  ? {
                      ...it,
                      status: 'success',
                      progress: 100,
                      outputBlob: res.outputBlob,
                      outputName: res.outputName,
                      outputUrl,
                      metadata: res.header.metadata,
                    }
                  : it
              )
            )
          }
        } catch (err: any) {
          if (controller.signal.aborted) {
            setQueue((prev) =>
              prev.map((it) =>
                it.id === item.id
                  ? { ...it, status: 'cancelled', errorMessage: 'Operation cancelled.' }
                  : it
              )
            )
            break
          } else {
            setQueue((prev) =>
              prev.map((it) =>
                it.id === item.id
                  ? { ...it, status: 'error', errorMessage: err?.message || 'Processing failed.' }
                  : it
              )
            )
          }
        }
      }

      setIsProcessing(false)
      setCurrentProgress(null)
      abortControllerRef.current = null
    },
    [queue]
  )

  // Calculate summary metrics
  const summary: BatchVaultSummary = {
    total: queue.length,
    pending: queue.filter((it) => it.status === 'idle').length,
    processing: queue.filter((it) => it.status === 'processing' || it.status === 'deriving-key')
      .length,
    success: queue.filter((it) => it.status === 'success').length,
    failed: queue.filter((it) => it.status === 'error').length,
    overallProgress:
      queue.length > 0
        ? Math.round(
            (queue.filter((it) => it.status === 'success' || it.status === 'error').length /
              queue.length) *
              100
          )
        : 0,
    currentFileName: currentProgress?.itemId,
    isComplete:
      queue.length > 0 &&
      queue.every(
        (it) => it.status === 'success' || it.status === 'error' || it.status === 'cancelled'
      ),
    isCancelled: Boolean(abortControllerRef.current?.signal.aborted),
  }

  return {
    queue,
    isProcessing,
    currentProgress,
    summary,
    addFiles,
    removeItem,
    clearQueue,
    startBatch,
    cancelProcessing,
    downloadItem,
    downloadAllZip,
  }
}
