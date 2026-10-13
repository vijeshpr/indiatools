/**
 * Custom React Hook: usePdfBatch
 * Manages the PDF queue, validation, concurrency-controlled Promise pool,
 * cancellation, status tracking, and object URL lifecycle cleanup.
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import {
  PdfQueueItem,
  VaultMode,
  EncryptOptions,
  UnlockOptions,
  BatchProcessingSummary,
} from './types'
import {
  encryptPdfDocument,
  unlockPdfDocument,
  inspectPdfFile,
  validatePdfMagicHeader,
} from './pdfSecurityEngine'
import { triggerFileDownload } from './zipService'

export function usePdfBatch() {
  const [queue, setQueue] = useState<PdfQueueItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentProcessingName, setCurrentProcessingName] = useState<string>('')
  const isCancelledRef = useRef(false)
  const activeUrlsRef = useRef<Set<string>>(new Set())

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      activeUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
      activeUrlsRef.current.clear()
    }
  }, [])

  // Add files to queue with header validation
  const addFiles = useCallback(async (files: File[]) => {
    const newItems: PdfQueueItem[] = []

    for (const file of files) {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      const item: PdfQueueItem = {
        id,
        file,
        name: file.name,
        sizeBytes: file.size,
        status: 'validating',
        progress: 0,
      }
      newItems.push(item)
    }

    setQueue((prev) => [...prev, ...newItems])

    // Validate headers asynchronously
    for (const item of newItems) {
      try {
        const slice = await item.file.slice(0, 4096).arrayBuffer()
        const isValid = validatePdfMagicHeader(new Uint8Array(slice))

        if (!isValid) {
          setQueue((prev) =>
            prev.map((it) =>
              it.id === item.id
                ? { ...it, status: 'error', errorMessage: 'Invalid PDF: Missing %PDF- header magic bytes.' }
                : it
            )
          )
          continue
        }

        // Try inspecting page count and initial encryption
        try {
          const fullBuf = await item.file.arrayBuffer()
          const inspection = await inspectPdfFile(new Uint8Array(fullBuf))
          setQueue((prev) =>
            prev.map((it) =>
              it.id === item.id
                ? {
                    ...it,
                    status: 'pending',
                    pageCount: inspection.pageCount,
                    isEncryptedInput: inspection.isEncrypted,
                    inputEncryptionMethod: inspection.encryptionDetails?.method,
                  }
                : it
            )
          )
        } catch {
          // If inspection fails due to encryption, mark as pending with encrypted input
          setQueue((prev) =>
            prev.map((it) =>
              it.id === item.id ? { ...it, status: 'pending', isEncryptedInput: true } : it
            )
          )
        }
      } catch (err: any) {
        setQueue((prev) =>
          prev.map((it) =>
            it.id === item.id ? { ...it, status: 'error', errorMessage: 'Could not read file data.' } : it
          )
        )
      }
    }
  }, [])

  // Remove individual item from queue and revoke URL
  const removeItem = useCallback((id: string) => {
    setQueue((prev) => {
      const target = prev.find((it) => it.id === id)
      if (target?.outputUrl) {
        URL.revokeObjectURL(target.outputUrl)
        activeUrlsRef.current.delete(target.outputUrl)
      }
      return prev.filter((it) => it.id !== id)
    })
  }, [])

  // Clear entire queue and revoke all URLs
  const clearQueue = useCallback(() => {
    activeUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    activeUrlsRef.current.clear()
    setQueue([])
  }, [])

  // Cancel processing
  const cancelProcessing = useCallback(() => {
    isCancelledRef.current = true
    setIsProcessing(false)
    setQueue((prev) =>
      prev.map((it) => (it.status === 'processing' || it.status === 'pending' ? { ...it, status: 'cancelled' } : it))
    )
  }, [])

  // Process single item
  const processItem = async (
    item: PdfQueueItem,
    mode: VaultMode,
    encryptOpts?: EncryptOptions,
    unlockOpts?: UnlockOptions
  ): Promise<void> => {
    if (isCancelledRef.current) {
      setQueue((prev) => prev.map((it) => (it.id === item.id ? { ...it, status: 'cancelled' } : it)))
      return
    }

    setQueue((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, status: 'processing', progress: 20 } : it))
    )
    setCurrentProcessingName(item.name)

    try {
      const buffer = await item.file.arrayBuffer()
      const bytes = new Uint8Array(buffer)

      let outputBytes: Uint8Array
      let outputName: string

      if (mode === 'encrypt') {
        if (!encryptOpts) throw new Error('Missing encryption options.')
        setQueue((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, status: 'processing', progress: 50 } : it))
        )
        outputBytes = await encryptPdfDocument(bytes, encryptOpts)

        const baseName = item.name.replace(/\.pdf$/i, '')
        outputName = `${baseName}_protected.pdf`
      } else {
        if (!unlockOpts) throw new Error('Missing unlock password.')
        setQueue((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, status: 'processing', progress: 50 } : it))
        )
        outputBytes = await unlockPdfDocument(bytes, unlockOpts)

        const baseName = item.name.replace(/\.pdf$/i, '')
        outputName = `${baseName}_unlocked.pdf`
      }

      setQueue((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, status: 'verifying', progress: 85 } : it))
      )

      // Convert to downloadable Blob and create object URL
      const blob = new Blob([outputBytes as unknown as ArrayBuffer], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      activeUrlsRef.current.add(url)

      setQueue((prev) =>
        prev.map((it) =>
          it.id === item.id
            ? {
                ...it,
                status: 'success',
                progress: 100,
                outputBytes,
                outputBlob: blob,
                outputUrl: url,
                outputName,
                errorMessage: undefined,
              }
            : it
        )
      )
    } catch (err: any) {
      setQueue((prev) =>
        prev.map((it) =>
          it.id === item.id
            ? {
                ...it,
                status: 'error',
                progress: 0,
                errorMessage: err.message || 'Operation failed.',
              }
            : it
        )
      )
    }
  }

  // Start batch processing with concurrency limit (2 concurrent tasks)
  const startBatch = useCallback(
    async (
      mode: VaultMode,
      optsOrEncrypt?: EncryptOptions | UnlockOptions,
      unlockOpts?: UnlockOptions
    ) => {
      isCancelledRef.current = false
      setIsProcessing(true)

      const encryptOpts = mode === 'encrypt' ? (optsOrEncrypt as EncryptOptions) : undefined
      const resolvedUnlockOpts =
        mode === 'unlock' ? (optsOrEncrypt as UnlockOptions) || unlockOpts : unlockOpts

      const pendingItems = queue.filter(
        (it) => it.status === 'pending' || it.status === 'error' || it.status === 'cancelled'
      )

      const concurrency = 2
      let index = 0

      const worker = async () => {
        while (index < pendingItems.length && !isCancelledRef.current) {
          const currentItem = pendingItems[index++]
          await processItem(currentItem, mode, encryptOpts, resolvedUnlockOpts)
        }
      }

      const workers = Array.from({ length: Math.min(concurrency, pendingItems.length) }, () =>
        worker()
      )
      await Promise.all(workers)

      setIsProcessing(false)
      setCurrentProcessingName('')
    },
    [queue]
  )

  // Download single item output
  const downloadSingle = useCallback((item: PdfQueueItem) => {
    if (item.outputBlob && item.outputName) {
      triggerFileDownload(item.outputBlob, item.outputName)
    }
  }, [])

  // Calculate batch summary metrics
  const summary: BatchProcessingSummary = {
    total: queue.length,
    pending: queue.filter((it) => it.status === 'pending').length,
    processing: queue.filter((it) => it.status === 'processing' || it.status === 'verifying').length,
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
    currentFileName: currentProcessingName,
    isComplete:
      queue.length > 0 &&
      queue.every((it) => it.status === 'success' || it.status === 'error' || it.status === 'cancelled'),
    isCancelled: isCancelledRef.current,
  }

  return {
    queue,
    isProcessing,
    summary,
    addFiles,
    removeItem,
    clearQueue,
    startBatch,
    cancelProcessing,
    downloadSingle,
  }
}
