import React, { useRef, useEffect, useState } from 'react'
import { X, ZoomIn, Eye, Sparkles, Sliders } from 'lucide-react'
import { generateForensicDifferenceMap } from '../../lib/watermarker/imageWatermarkEngine'

interface ForensicDifferenceModalProps {
  isOpen: boolean
  onClose: () => void
  originalImageData: ImageData | null
  watermarkedImageData: ImageData | null
}

export const ForensicDifferenceModal: React.FC<ForensicDifferenceModalProps> = ({
  isOpen,
  onClose,
  originalImageData,
  watermarkedImageData,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [amplification, setAmplification] = useState<number>(64)
  const [viewMode, setViewMode] = useState<'diff' | 'watermarked' | 'original'>('diff')

  useEffect(() => {
    if (!isOpen || !canvasRef.current || !originalImageData || !watermarkedImageData) return

    const canvas = canvasRef.current
    canvas.width = originalImageData.width
    canvas.height = originalImageData.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (viewMode === 'original') {
      ctx.putImageData(originalImageData, 0, 0)
    } else if (viewMode === 'watermarked') {
      ctx.putImageData(watermarkedImageData, 0, 0)
    } else {
      const diffData = generateForensicDifferenceMap(
        originalImageData,
        watermarkedImageData,
        amplification
      )
      ctx.putImageData(diffData, 0, 0)
    }
  }, [isOpen, viewMode, amplification, originalImageData, watermarkedImageData])

  if (!isOpen || !originalImageData || !watermarkedImageData) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Forensic Bitplane Difference Visualizer
              </h3>
              <p className="text-xs text-slate-400">
                Amplifies Least Significant Bit (LSB) modifications to prove steganographic presence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Controls & Sliders */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-slate-800/80 shrink-0 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('diff')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'diff'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Forensic Glow Map
            </button>
            <button
              onClick={() => setViewMode('watermarked')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'watermarked'
                  ? 'bg-slate-700 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Watermarked (Normal View)
            </button>
            <button
              onClick={() => setViewMode('original')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'original'
                  ? 'bg-slate-700 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Original Source
            </button>
          </div>

          {viewMode === 'diff' && (
            <div className="flex items-center gap-2 text-slate-400">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Amplification:</span>
              <input
                type="range"
                min="16"
                max="256"
                step="16"
                value={amplification}
                onChange={(e) => setAmplification(Number(e.target.value))}
                className="w-24 accent-cyan-400 cursor-pointer"
              />
              <span className="font-mono text-cyan-300 font-bold">{amplification}x</span>
            </div>
          )}
        </div>

        {/* Canvas Display Viewport */}
        <div className="flex-1 my-4 flex items-center justify-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800 overflow-auto min-h-[300px]">
          <canvas
            ref={canvasRef}
            className="max-h-[50vh] max-w-full rounded-lg object-contain border border-slate-800 shadow-lg"
          />
        </div>

        {/* Forensic Description Footer */}
        <div className="shrink-0 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>
              {viewMode === 'diff'
                ? 'Bright cyan pixels indicate mathematically altered LSB bits containing the watermark frame.'
                : 'Notice how human vision cannot perceive the subtle blue channel alterations under normal viewing.'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  )
}
