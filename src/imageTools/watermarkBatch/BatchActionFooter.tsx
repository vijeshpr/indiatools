import React from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  Download,
  Play,
  Loader2,
  FileArchive,
  Settings2,
} from 'lucide-react'
import {
  ExportConfig,
  ExportFormat,
} from '../../lib/watermarkEngine/types'
import { BatchWatermarkTranslation } from '../../lib/watermarkEngine/i18n'

interface Props {
  totalItems: number
  completedItems: number
  isProcessing: boolean
  isZipping: boolean
  overallProgress: number
  exportConfig: ExportConfig
  onChangeExportConfig: (updated: Partial<ExportConfig>) => void
  onStartProcessBatch: () => void
  onDownloadZip: () => void
  t: BatchWatermarkTranslation
}

export const BatchActionFooter: React.FC<Props> = ({
  totalItems,
  completedItems,
  isProcessing,
  isZipping,
  overallProgress,
  exportConfig,
  onChangeExportConfig,
  onStartProcessBatch,
  onDownloadZip,
  t,
}) => {
  const triggerConfettiBurst = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#22d3ee', '#10b981', '#ffffff'],
      })
    } catch {
      // Ignore if canvas-confetti is not loaded
    }
  }

  const handleProcessClick = () => {
    triggerConfettiBurst()
    onStartProcessBatch()
  }

  const handleZipClick = () => {
    triggerConfettiBurst()
    onDownloadZip()
  }

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 p-4 shadow-2xl backdrop-blur-xl space-y-3.5">
      {/* Export Format & Quality Options */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
            {t.format}
          </span>
          <select
            value={exportConfig.format}
            onChange={(e) =>
              onChangeExportConfig({ format: e.target.value as ExportFormat })
            }
            disabled={isProcessing}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-medium"
          >
            <option value="original">Original Format</option>
            <option value="image/jpeg">JPG (Compact)</option>
            <option value="image/png">PNG (Lossless)</option>
            <option value="image/webp">WebP (Modern)</option>
          </select>
        </div>

        {exportConfig.format !== 'image/png' && (
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-slate-400">{t.quality}</span>
            <input
              type="range"
              min={0.6}
              max={1.0}
              step={0.05}
              value={exportConfig.quality}
              onChange={(e) =>
                onChangeExportConfig({ quality: Number(e.target.value) })
              }
              disabled={isProcessing}
              className="w-24 h-1.5 rounded-lg bg-slate-800 accent-cyan-400 cursor-pointer"
            />
            <span className="text-cyan-400 font-semibold min-w-[32px]">
              {Math.round(exportConfig.quality * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar (Visible while batch processing) */}
      {isProcessing && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400 flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{t.processing}</span>
            </span>
            <span className="text-emerald-400 font-semibold">
              {overallProgress}% ({completedItems}/{totalItems})
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons: Process Batch & Download ZIP */}
      <div className="flex flex-wrap items-center gap-3">
        <motion.button
          type="button"
          whileHover={{ scale: totalItems > 0 && !isProcessing ? 1.02 : 1 }}
          whileTap={{ scale: totalItems > 0 && !isProcessing ? 0.98 : 1 }}
          onClick={handleProcessClick}
          disabled={totalItems === 0 || isProcessing}
          className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs tracking-wide transition-all shadow-lg ${
            totalItems > 0 && !isProcessing
              ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-bold border border-cyan-300/40 shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer'
              : 'bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>{t.processing}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-slate-950" />
              <span>
                {t.processBatch} ({totalItems})
              </span>
            </>
          )}
        </motion.button>

        {completedItems > 0 && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: !isZipping ? 1.02 : 1 }}
            whileTap={{ scale: !isZipping ? 0.98 : 1 }}
            onClick={handleZipClick}
            disabled={isZipping}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs tracking-wide bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold border border-emerald-300/40 shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer transition-all"
          >
            {isZipping ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Creating ZIP...</span>
              </>
            ) : (
              <>
                <FileArchive className="w-4 h-4" />
                <Download className="w-3.5 h-3.5" />
                <span>
                  {t.downloadZip} ({completedItems})
                </span>
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  )
}
