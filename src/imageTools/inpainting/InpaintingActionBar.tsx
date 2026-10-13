import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  Wand2,
  Eye,
  Download,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { InpaintingProgress } from '../../lib/inpainting/types'
import { InpaintingTranslation } from '../../lib/inpainting/i18n'

interface Props {
  hasImage: boolean
  hasInpainted: boolean
  isProcessing: boolean
  progress: InpaintingProgress | null
  isShowingBefore: boolean
  onToggleBeforeAfter: () => void
  onStartInpaint: () => void
  onDownload: (format: 'png' | 'jpeg') => void
  t: InpaintingTranslation
}

export const InpaintingActionBar: React.FC<Props> = ({
  hasImage,
  hasInpainted,
  isProcessing,
  progress,
  isShowingBefore,
  onToggleBeforeAfter,
  onStartInpaint,
  onDownload,
  t,
}) => {
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpeg'>('png')

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f43f5e', '#22d3ee', '#10b981'],
      })
    } catch {
      // Ignore confetti error
    }
  }

  const handleInpaintClick = () => {
    triggerConfetti()
    onStartInpaint()
  }

  const handleDownloadClick = () => {
    triggerConfetti()
    onDownload(downloadFormat)
  }

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 p-4 shadow-xl backdrop-blur-xl space-y-3.5">
      {/* Processing Status Banner with Progress Ring */}
      <AnimatePresence>
        {isProcessing && progress && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3 rounded-xl bg-slate-950/80 border border-rose-500/30 shadow-inner space-y-2"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{progress.message}</span>
              </span>
              <span className="text-cyan-400 font-mono font-bold">
                {progress.percent}%
              </span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-400 shadow-[0_0_10px_#f43f5e]"
                initial={{ width: 0 }}
                animate={{ width: `${progress.percent}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Inpaint Trigger Button */}
        <motion.button
          type="button"
          whileHover={{ scale: hasImage && !isProcessing ? 1.02 : 1 }}
          whileTap={{ scale: hasImage && !isProcessing ? 0.98 : 1 }}
          onClick={handleInpaintClick}
          disabled={!hasImage || isProcessing}
          className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs tracking-wide transition-all shadow-lg ${
            hasImage && !isProcessing
              ? 'bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white border border-rose-300/40 shadow-[0_0_20px_rgba(244,63,94,0.4)] cursor-pointer'
              : 'bg-slate-800/60 text-slate-500 border border-slate-800 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>{t.inpainting}</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 text-white" />
              <span>{t.inpaintAction}</span>
            </>
          )}
        </motion.button>

        {/* Before / After Toggle (Available after inpainting) */}
        {hasInpainted && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: !isProcessing ? 1.03 : 1 }}
            whileTap={{ scale: !isProcessing ? 0.97 : 1 }}
            onClick={onToggleBeforeAfter}
            disabled={isProcessing}
            className={`flex items-center gap-1.5 px-3.5 py-3 rounded-xl text-xs font-semibold border transition-all ${
              isShowingBefore
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title={t.beforeAfterToggle}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isShowingBefore ? 'Showing Original' : 'Compare Before'}</span>
          </motion.button>
        )}

        {/* Download Button */}
        {hasInpainted && (
          <div className="flex items-center gap-1.5">
            <select
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value as 'png' | 'jpeg')}
              disabled={isProcessing}
              className="px-2 py-3 rounded-xl bg-slate-950 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono"
            >
              <option value="png">PNG</option>
              <option value="jpeg">JPG</option>
            </select>

            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: !isProcessing ? 1.02 : 1 }}
              whileTap={{ scale: !isProcessing ? 0.98 : 1 }}
              onClick={handleDownloadClick}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 border border-cyan-300/40 shadow-[0_0_20px_rgba(6,182,212,0.35)] cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{t.downloadImage}</span>
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}
