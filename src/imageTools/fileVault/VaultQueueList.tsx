import React from 'react'
import {
  FileText,
  Lock,
  Unlock,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileArchive,
  RefreshCw,
  HardDrive,
  ShieldCheck,
  X,
} from 'lucide-react'
import { VaultQueueItem, VaultMode } from '../../lib/fileVault/types'

interface VaultQueueListProps {
  queue: VaultQueueItem[]
  mode: VaultMode
  onRemoveItem: (id: string) => void
  onClearQueue: () => void
  onDownloadItem: (item: VaultQueueItem) => void
  onDownloadAllZip: (mode: VaultMode) => void
  isProcessing: boolean
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export const VaultQueueList: React.FC<VaultQueueListProps> = ({
  queue,
  mode,
  onRemoveItem,
  onClearQueue,
  onDownloadItem,
  onDownloadAllZip,
  isProcessing,
}) => {
  if (queue.length === 0) return null

  const isEncrypt = mode === 'encrypt'
  const successfulCount = queue.filter((it) => it.status === 'success').length
  const totalBytes = queue.reduce((sum, it) => sum + it.sizeBytes, 0)

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-cyan-400" />
            <span>File Queue ({queue.length} file{queue.length === 1 ? '' : 's'})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Total batch volume: <strong className="font-mono text-slate-200">{formatBytes(totalBytes)}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {successfulCount > 1 && (
            <button
              type="button"
              onClick={() => onDownloadAllZip(mode)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-slate-950 shadow-md transition-all active:scale-95 cursor-pointer ${
                isEncrypt
                  ? 'bg-cyan-400 hover:bg-cyan-300 shadow-cyan-500/20'
                  : 'bg-emerald-400 hover:bg-emerald-300 shadow-emerald-500/20'
              }`}
            >
              <FileArchive className="h-3.5 w-3.5" />
              <span>Download All as ZIP ({successfulCount})</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClearQueue}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-40 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5 text-slate-400" />
            <span>Clear Queue</span>
          </button>
        </div>
      </div>

      {/* Cards Grid / List */}
      <div className="space-y-3">
        {queue.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 transition-all hover:border-slate-700"
          >
            {/* File Info */}
            <div className="flex items-center gap-3.5 min-w-[200px] flex-1">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                  item.status === 'success'
                    ? isEncrypt
                      ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
                      : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                    : item.status === 'error'
                    ? 'border-rose-500/40 bg-rose-500/10 text-rose-400'
                    : 'border-slate-800 bg-slate-900 text-slate-400'
                }`}
              >
                {item.status === 'success' ? (
                  isEncrypt ? <Lock className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />
                ) : (
                  <FileText className="h-5 w-5" />
                )}
              </div>

              <div className="space-y-0.5 truncate max-w-sm sm:max-w-md">
                <div className="text-xs font-semibold text-slate-100 truncate">
                  {item.name}
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <span>{formatBytes(item.sizeBytes)}</span>
                  {item.outputName && (
                    <>
                      <span>→</span>
                      <span className={isEncrypt ? 'text-cyan-300' : 'text-emerald-300'}>
                        {item.outputName}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center gap-3">
              {/* Status Pills */}
              {item.status === 'idle' && (
                <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-400">
                  Ready
                </span>
              )}

              {(item.status === 'processing' || item.status === 'deriving-key') && (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full transition-all duration-200 ${
                        isEncrypt ? 'bg-cyan-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-300">
                    {item.progress}%
                  </span>
                </div>
              )}

              {item.status === 'success' && (
                <button
                  type="button"
                  onClick={() => onDownloadItem(item)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-md transition-all active:scale-95 cursor-pointer ${
                    isEncrypt
                      ? 'bg-cyan-400 hover:bg-cyan-300 shadow-cyan-500/20'
                      : 'bg-emerald-400 hover:bg-emerald-300 shadow-emerald-500/20'
                  }`}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </button>
              )}

              {item.status === 'error' && (
                <div className="flex items-center gap-1 text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate max-w-[200px]" title={item.errorMessage}>
                    {item.errorMessage || 'Failed'}
                  </span>
                </div>
              )}

              {item.status === 'cancelled' && (
                <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                  Cancelled
                </span>
              )}

              {/* Remove Action */}
              {!isProcessing && (
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
                  aria-label="Remove file from queue"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
