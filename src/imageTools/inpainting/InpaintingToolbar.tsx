import React from 'react'
import { motion } from 'framer-motion'
import {
  Paintbrush,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  Sliders,
  RotateCcw,
} from 'lucide-react'
import { BrushToolMode } from '../../lib/inpainting/types'
import { InpaintingTranslation } from '../../lib/inpainting/i18n'

interface Props {
  toolMode: BrushToolMode
  onChangeToolMode: (mode: BrushToolMode) => void
  brushRadius: number
  onChangeBrushRadius: (radius: number) => void
  canUndo: boolean
  canRedo: boolean
  undoCount: number
  onUndo: () => void
  onRedo: () => void
  onClearMask: () => void
  onResetImage: () => void
  isProcessing: boolean
  hasImage: boolean
  t: InpaintingTranslation
}

export const InpaintingToolbar: React.FC<Props> = ({
  toolMode,
  onChangeToolMode,
  brushRadius,
  onChangeBrushRadius,
  canUndo,
  canRedo,
  undoCount,
  onUndo,
  onRedo,
  onClearMask,
  onResetImage,
  isProcessing,
  hasImage,
  t,
}) => {
  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 p-4 shadow-xl backdrop-blur-xl space-y-4">
      {/* Tool Mode Switcher: Brush vs Eraser */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
            Tool Selection
          </span>
          <span className="text-[11px] font-mono text-rose-400 font-semibold">
            {toolMode === 'brush' ? 'MASK BRUSH' : 'MASK ERASER'}
          </span>
        </div>

        <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChangeToolMode('brush')}
            disabled={!hasImage || isProcessing}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
              toolMode === 'brush'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            } disabled:opacity-40`}
          >
            <Paintbrush className="w-3.5 h-3.5" />
            <span>{t.brushTool}</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChangeToolMode('eraser')}
            disabled={!hasImage || isProcessing}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
              toolMode === 'eraser'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                : 'text-slate-400 hover:text-slate-200'
            } disabled:opacity-40`}
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>{t.eraserTool}</span>
          </motion.button>
        </div>
      </div>

      {/* Brush Radius Slider with Quick Presets */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
          <span className="text-slate-400 flex items-center gap-1.5 text-[11px]">
            <Sliders className="w-3 h-3 text-rose-400" />
            <span>{t.brushRadius}</span>
          </span>
          <motion.span
            key={brushRadius}
            initial={{ scale: 1.2, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-rose-400 font-bold text-xs"
          >
            {brushRadius} px
          </motion.span>
        </div>

        <input
          type="range"
          min={5}
          max={100}
          step={2}
          value={brushRadius}
          onChange={(e) => onChangeBrushRadius(Number(e.target.value))}
          disabled={!hasImage || isProcessing}
          className="w-full h-1.5 rounded-lg bg-slate-800 accent-rose-500 cursor-pointer disabled:opacity-40"
        />

        {/* Quick Size Preset Pills */}
        <div className="flex items-center gap-1.5 mt-2">
          {[10, 20, 35, 55, 80].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onChangeBrushRadius(size)}
              disabled={!hasImage || isProcessing}
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono border transition-all ${
                brushRadius === size
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
              } disabled:opacity-40`}
            >
              {size}px
            </button>
          ))}
        </div>
      </div>

      {/* History Actions: Undo / Redo / Clear Mask */}
      <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
        <motion.button
          type="button"
          whileHover={{ scale: canUndo && !isProcessing ? 1.06 : 1 }}
          whileTap={{ scale: canUndo && !isProcessing ? 0.94 : 1 }}
          onClick={onUndo}
          disabled={!canUndo || isProcessing}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium transition-colors disabled:opacity-35 disabled:cursor-not-allowed shadow-sm"
          title={t.undo}
        >
          <Undo2 className="w-3.5 h-3.5 text-rose-400" />
          <span>{t.undo}</span>
          {undoCount > 0 && (
            <span className="text-[10px] font-mono text-slate-400 ml-0.5">
              ({undoCount})
            </span>
          )}
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: canRedo && !isProcessing ? 1.06 : 1 }}
          whileTap={{ scale: canRedo && !isProcessing ? 0.94 : 1 }}
          onClick={onRedo}
          disabled={!canRedo || isProcessing}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium transition-colors disabled:opacity-35 disabled:cursor-not-allowed shadow-sm"
          title={t.redo}
        >
          <Redo2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.redo}</span>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: hasImage && !isProcessing ? 1.06 : 1 }}
          whileTap={{ scale: hasImage && !isProcessing ? 0.94 : 1 }}
          onClick={onClearMask}
          disabled={!hasImage || isProcessing}
          className="p-2 rounded-xl bg-slate-950 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors disabled:opacity-35"
          title={t.clearMask}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: hasImage && !isProcessing ? 1.06 : 1 }}
          whileTap={{ scale: hasImage && !isProcessing ? 0.94 : 1 }}
          onClick={onResetImage}
          disabled={!hasImage || isProcessing}
          className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors disabled:opacity-35"
          title={t.resetImage}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </div>
  )
}
