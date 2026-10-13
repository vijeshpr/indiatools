/**
 * PdfQueueItemCard Component
 * Displays individual PDF file card with status badges, size, page count, and download/remove actions.
 */

import React from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
  Unlock,
} from 'lucide-react'
import { PdfQueueItem } from '../../lib/pdfVault/types'

interface PdfQueueItemCardProps {
  item: PdfQueueItem
  onRemove: (id: string) => void
  onDownload: (item: PdfQueueItem) => void
  isProcessing: boolean
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export const PdfQueueItemCard: React.FC<PdfQueueItemCardProps> = ({
  item,
  onRemove,
  onDownload,
  isProcessing,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      className={`relative w-full rounded-xl p-3.5 border transition-all flex items-center justify-between gap-3 ${
        item.status === 'success'
          ? 'bg-emerald-950/20 border-emerald-500/30'
          : item.status === 'error'
          ? 'bg-rose-950/20 border-rose-500/30'
          : item.status === 'processing' || item.status === 'verifying'
          ? 'bg-amber-950/20 border-amber-500/40 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
          : 'bg-slate-900/70 border-white/5 hover:border-white/10'
      }`}
    >
      {/* Left: Icon & File Meta */}
      <div className="flex items-center gap-3 overflow-hidden min-w-0 flex-1">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            item.status === 'success'
              ? 'bg-emerald-500/20 text-emerald-400'
              : item.status === 'error'
              ? 'bg-rose-500/20 text-rose-400'
              : 'bg-slate-800 text-slate-300'
          }`}
        >
          {item.isEncryptedInput ? (
            <Lock className="w-4 h-4 text-amber-400" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold text-white truncate max-w-xs md:max-w-md block"
              title={item.name}
            >
              {item.name}
            </span>
            {item.isEncryptedInput && (
              <span className="shrink-0 px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono border border-amber-500/30">
                LOCKED
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
            <span>{formatBytes(item.sizeBytes)}</span>
            {item.pageCount !== undefined && item.pageCount > 0 && (
              <>
                <span>•</span>
                <span>{item.pageCount} {item.pageCount === 1 ? 'Page' : 'Pages'}</span>
              </>
            )}
          </div>

          {/* Error Message Tooltip */}
          {item.status === 'error' && item.errorMessage && (
            <div className="text-[11px] text-rose-400 flex items-center gap-1 mt-1 font-mono">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span className="truncate">{item.errorMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Status Pill & Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Status Badge */}
        {item.status === 'processing' && (
          <span className="px-2 py-1 rounded-md text-[10px] font-mono bg-amber-500/20 text-amber-300 flex items-center gap-1.5 border border-amber-500/30 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Processing</span>
          </span>
        )}

        {item.status === 'verifying' && (
          <span className="px-2 py-1 rounded-md text-[10px] font-mono bg-cyan-500/20 text-cyan-300 flex items-center gap-1.5 border border-cyan-500/30">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Verifying</span>
          </span>
        )}

        {item.status === 'success' && (
          <button
            type="button"
            onClick={() => onDownload(item)}
            className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-3 h-3" />
            <span>Download</span>
          </button>
        )}

        {/* Remove Button */}
        {item.status !== 'processing' && item.status !== 'verifying' && !isProcessing && (
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Remove from queue"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  )
}
