/**
 * Modern High-Speed Export Progress Modal
 * Features animated circular gradient progress ring, staggered status text fade-in, and cancelation.
 */

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'
import { BassExportProgress } from '../../lib/audio/bassEnhancer/types'

interface BassExportModalProps {
  isOpen: boolean
  progress: BassExportProgress
  onCancel: () => void
}

export const BassExportModal: React.FC<BassExportModalProps> = ({
  isOpen,
  progress,
  onCancel,
}) => {
  if (!isOpen) return null

  // Circular progress math (radius 48)
  const r = 48
  const circumference = 2 * Math.PI * r
  const strokeDashoffset = circumference * (1 - progress.percentage / 100)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md bg-[#0e0e11] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden flex flex-col items-center text-center"
        >
          {/* Subtle Background Radial Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#ff2d55]/15 blur-3xl pointer-events-none rounded-full" />

          {/* Header */}
          <div className="w-full flex items-center justify-between mb-6 z-10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ff2d55]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Sub-Harmonic DSP Render
              </h3>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Animated Circular Progress Ring */}
          <div className="relative w-32 h-32 flex items-center justify-center mb-6">
            <svg className="w-32 h-32 -rotate-90 transform" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="exportGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff2d55" />
                  <stop offset="50%" stopColor="#ffb800" />
                  <stop offset="100%" stopColor="#00f0ff" />
                </linearGradient>
              </defs>

              {/* Base Track */}
              <circle
                cx="60"
                cy="60"
                r={r}
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="6"
              />

              {/* Animated Progress Bar */}
              <circle
                cx="60"
                cy="60"
                r={r}
                fill="none"
                stroke="url(#exportGradient)"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 0.15s ease-out',
                  filter: 'drop-shadow(0 0 8px rgba(255, 45, 85, 0.45))',
                }}
              />
            </svg>

            {/* Center Percentage Display */}
            <div className="absolute flex flex-col items-center">
              <span className="font-mono text-2xl font-black text-white">
                {progress.percentage}%
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                RENDER
              </span>
            </div>
          </div>

          {/* Sequential Status Message with AnimatePresence */}
          <div className="h-8 flex items-center justify-center mb-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={progress.stageMessage}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="text-xs font-mono font-bold text-slate-200 tracking-wider flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff2d55] animate-ping" />
                <span>{progress.stageMessage}</span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Sequence Checklist */}
          <div className="w-full bg-slate-950/70 border border-white/5 rounded-xl p-3 mb-6 text-left space-y-1.5 text-[11px] font-mono">
            <div
              className={`flex items-center gap-2 ${
                progress.percentage >= 15 ? 'text-emerald-400' : 'text-slate-500'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Linkwitz-Riley 4th-Order Crossover Split</span>
            </div>
            <div
              className={`flex items-center gap-2 ${
                progress.percentage >= 40 ? 'text-emerald-400' : 'text-slate-500'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Sub-Harmonic -1 Octave Tracking Synthesizer</span>
            </div>
            <div
              className={`flex items-center gap-2 ${
                progress.percentage >= 65 ? 'text-emerald-400' : 'text-slate-500'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Hyperbolic Tanh Saturation WaveShaping</span>
            </div>
            <div
              className={`flex items-center gap-2 ${
                progress.percentage >= 85 ? 'text-emerald-400' : 'text-slate-500'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Mono Bass Lock (&lt;120Hz) & Soft-Clip Limiter</span>
            </div>
          </div>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-white/5 transition-colors cursor-pointer"
          >
            Cancel Export
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
