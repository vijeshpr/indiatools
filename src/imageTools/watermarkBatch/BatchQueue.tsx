import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Eye,
  Layers,
} from 'lucide-react'
import { BatchItem } from '../../lib/watermarkEngine/types'
import { BatchWatermarkTranslation } from '../../lib/watermarkEngine/i18n'

interface Props {
  items: BatchItem[]
  activeItemId: string | null
  onSelectItem: (id: string) => void
  onRemoveItem: (id: string) => void
  onClearAll: () => void
  onAddFiles: (files: FileList | File[]) => void
  t: BatchWatermarkTranslation
  isProcessing: boolean
}

export const BatchQueue: React.FC<Props> = ({
  items,
  activeItemId,
  onSelectItem,
  onRemoveItem,
  onClearAll,
  onAddFiles,
  t,
  isProcessing,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const completedCount = items.filter((i) => i.status === 'done').length

  return (
    <div className="flex flex-col h-full rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-xl overflow-hidden backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            {t.queueTitle}
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/20">
            {items.length}
          </span>
          {completedCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/20">
              {completedCount} done
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                onAddFiles(e.target.files)
                e.target.value = ''
              }
            }}
            multiple
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors disabled:opacity-50"
            title="Add more photos"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Add</span>
          </button>

          {items.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              disabled={isProcessing}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium border border-rose-500/20 transition-colors disabled:opacity-50"
              title={t.clearAll}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Queue Item List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[340px] md:max-h-[460px]">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-44 text-center text-slate-500 p-4">
            <p className="text-xs">{t.emptyQueue}</p>
          </div>
        ) : (
          <AnimatePresence>
            {items.map((item, index) => {
              const isActive = item.id === activeItemId
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.15, delay: Math.min(index * 0.02, 0.2) }}
                  onClick={() => onSelectItem(item.id)}
                  className={`group relative flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all duration-150 border ${
                    isActive
                      ? 'bg-cyan-500/10 border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                      : 'bg-slate-950/50 hover:bg-slate-800/60 border-slate-800/80'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                        <Eye className="w-4 h-4 text-cyan-300 drop-shadow" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pr-1">
                    <p className="text-xs font-medium text-slate-200 truncate group-hover:text-cyan-300 transition-colors">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-0.5">
                      <span>{formatFileSize(item.size)}</span>
                      <span>•</span>
                      <span>
                        {item.width}×{item.height}
                      </span>
                    </div>

                    {/* Progress bar when processing */}
                    {item.status === 'processing' && (
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="bg-cyan-400 h-full rounded-full transition-all duration-200 shadow-[0_0_8px_#22d3ee]"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {item.status === 'done' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    {item.status === 'processing' && (
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                    )}
                    {item.status === 'error' && (
                      <span title={item.errorMessage}>
                        <AlertCircle className="w-4 h-4 text-rose-400" />
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemoveItem(item.id)
                      }}
                      disabled={isProcessing}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-all disabled:opacity-0"
                      title="Remove from batch"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
