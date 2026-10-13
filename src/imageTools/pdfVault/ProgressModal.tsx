import React from 'react'
import {
  Loader2,
  CheckCircle2,
  AlertTriangle,
  X,
  FileArchive,
  StopCircle,
  Shield,
  Unlock,
} from 'lucide-react'
import { BatchProcessingSummary, VaultMode } from '../../lib/pdfVault/types'

interface ProgressModalProps {
  isOpen: boolean
  mode: VaultMode
  summary: BatchProcessingSummary
  onCancel: () => void
  onClose: () => void
  onDownloadZip: () => void
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  mode,
  summary,
  onCancel,
  onClose,
  onDownloadZip,
}) => {
  if (!isOpen) return null

  const isCompleted = summary.isComplete
  const isEncrypt = mode === 'encrypt'
  const progressPercent = Math.min(100, Math.max(0, summary.overallProgress))

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="progress-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 p-6 shadow-2xl">
        {/* Close button if completed */}
        {isCompleted && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <div className="text-center space-y-4">
          {/* Header Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700 shadow-inner">
            {isCompleted ? (
              summary.failed === 0 ? (
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-amber-400" />
              )
            ) : isEncrypt ? (
              <Shield className="h-8 w-8 text-amber-400 animate-pulse" />
            ) : (
              <Unlock className="h-8 w-8 text-emerald-400 animate-pulse" />
            )}
          </div>

          <div>
            <h2 id="progress-modal-title" className="text-lg font-bold text-slate-100">
              {isCompleted
                ? isEncrypt
                  ? 'Batch PDF Encryption Complete'
                  : 'Batch PDF Decryption Complete'
                : isEncrypt
                ? 'Encrypting PDF Documents...'
                : 'Decrypting PDF Documents...'}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {isCompleted
                ? `Processed ${summary.total} document${summary.total > 1 ? 's' : ''}`
                : summary.currentFileName
                ? `Currently processing: ${summary.currentFileName}`
                : 'Initialising WebAssembly cryptographic engine...'}
            </p>
          </div>

          {/* Progress Bar & Percentage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Overall Progress</span>
              <span className={isEncrypt ? 'text-amber-400' : 'text-emerald-400'}>
                {progressPercent}%
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800 border border-slate-700/50">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isEncrypt
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-center">
            <div>
              <div className="text-[11px] text-slate-400">Total</div>
              <div className="text-sm font-bold text-slate-200">{summary.total}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Succeeded</div>
              <div className="text-sm font-bold text-emerald-400">{summary.success}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Errors</div>
              <div className={`text-sm font-bold ${summary.failed > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                {summary.failed}
              </div>
            </div>
          </div>

          {/* Active processing animation spinner */}
          {!isCompleted && (
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-1">
              <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
              <span>Executing native in-browser QPDF cipher...</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2">
            {isCompleted ? (
              <>
                {summary.success > 0 && (
                  <button
                    type="button"
                    onClick={onDownloadZip}
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-semibold text-slate-950 shadow-lg transition-all active:scale-[0.98] ${
                      isEncrypt
                        ? 'bg-amber-400 hover:bg-amber-300 shadow-amber-500/20'
                        : 'bg-emerald-400 hover:bg-emerald-300 shadow-emerald-500/20'
                    }`}
                  >
                    <FileArchive className="h-4 w-4" />
                    Download All as ZIP Bundle ({summary.success} files)
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 px-4 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  Close & View Queue Items
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 py-2.5 px-4 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors"
              >
                <StopCircle className="h-4 w-4" />
                Cancel Batch Processing
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
