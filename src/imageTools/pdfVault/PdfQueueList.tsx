/**
 * PdfQueueList Component
 * Renders batch list of queued PDF cards, queue summary, and bulk actions.
 */

import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { Trash2, Download, Archive, CheckCircle2 } from 'lucide-react'
import { PdfQueueItem } from '../../lib/pdfVault/types'
import { PdfQueueItemCard } from './PdfQueueItemCard'

interface PdfQueueListProps {
  queue: PdfQueueItem[]
  onRemove: (id: string) => void
  onClear: () => void
  onDownloadSingle: (item: PdfQueueItem) => void
  onDownloadZip: () => void
  isProcessing: boolean
  isPackagingZip?: boolean
}

export const PdfQueueList: React.FC<PdfQueueListProps> = ({
  queue,
  onRemove,
  onClear,
  onDownloadSingle,
  onDownloadZip,
  isProcessing,
  isPackagingZip = false,
}) => {
  if (queue.length === 0) return null

  const totalBytes = queue.reduce((sum, item) => sum + item.sizeBytes, 0)
  const totalFormatted =
    totalBytes < 1024 * 1024
      ? `${(totalBytes / 1024).toFixed(1)} KB`
      : `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`

  const successCount = queue.filter((it) => it.status === 'success').length

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Queue Header Summary */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-300 pb-1 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white uppercase tracking-wider">
            Document Queue ({queue.length})
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">{totalFormatted}</span>
        </div>

        <div className="flex items-center gap-3">
          {successCount > 1 && (
            <button
              type="button"
              disabled={isPackagingZip}
              onClick={onDownloadZip}
              className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{isPackagingZip ? 'Packaging ZIP…' : `Download All (${successCount}) as ZIP`}</span>
            </button>
          )}

          {!isProcessing && (
            <button
              type="button"
              onClick={onClear}
              className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Queue</span>
            </button>
          )}
        </div>
      </div>

      {/* Queue Cards */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        <AnimatePresence>
          {queue.map((item) => (
            <PdfQueueItemCard
              key={item.id}
              item={item}
              onRemove={onRemove}
              onDownload={onDownloadSingle}
              isProcessing={isProcessing}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
