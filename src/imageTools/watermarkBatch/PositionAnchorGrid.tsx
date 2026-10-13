import React from 'react'
import { motion } from 'framer-motion'
import { PositionAnchor } from '../../lib/watermarkEngine/types'
import { BatchWatermarkTranslation } from '../../lib/watermarkEngine/i18n'

interface Props {
  anchor: PositionAnchor
  onChangeAnchor: (anchor: PositionAnchor) => void
  paddingX: number
  onChangePaddingX: (val: number) => void
  paddingY: number
  onChangePaddingY: (val: number) => void
  t: BatchWatermarkTranslation
  disabled?: boolean
}

const ANCHORS: PositionAnchor[] = [
  'top-left',
  'top-center',
  'top-right',
  'middle-left',
  'center',
  'middle-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]

export const PositionAnchorGrid: React.FC<Props> = ({
  anchor,
  onChangeAnchor,
  paddingX,
  onChangePaddingX,
  paddingY,
  onChangePaddingY,
  t,
  disabled = false,
}) => {
  return (
    <div className={`space-y-3.5 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
          {t.positionAnchor}
        </label>
        <span className="text-[11px] font-mono text-cyan-400 font-medium">
          {anchor.replace('-', ' ').toUpperCase()}
        </span>
      </div>

      <div className="flex items-center justify-center p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-inner">
        <div className="grid grid-cols-3 gap-2 w-36 h-36 p-1.5 rounded-lg bg-slate-900 border border-slate-800">
          {ANCHORS.map((pos) => {
            const isSelected = anchor === pos
            return (
              <motion.button
                key={pos}
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={() => onChangeAnchor(pos)}
                title={t.anchors[
                  pos === 'top-left' ? 'topLeft' :
                  pos === 'top-center' ? 'topCenter' :
                  pos === 'top-right' ? 'topRight' :
                  pos === 'middle-left' ? 'midLeft' :
                  pos === 'center' ? 'center' :
                  pos === 'middle-right' ? 'midRight' :
                  pos === 'bottom-left' ? 'botLeft' :
                  pos === 'bottom-center' ? 'botCenter' : 'botRight'
                ]}
                className={`relative rounded-md flex items-center justify-center transition-all duration-150 ${
                  isSelected
                    ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-150 ${
                    isSelected
                      ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                      : 'bg-slate-500 group-hover:bg-slate-400'
                  }`}
                />
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Margins / Padding Sliders */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div>
          <div className="flex justify-between text-[11px] mb-1 font-mono">
            <span className="text-slate-400">{t.paddingX}</span>
            <span className="text-cyan-400 font-semibold">{paddingX}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={paddingX}
            onChange={(e) => onChangePaddingX(Number(e.target.value))}
            className="w-full h-1.5 rounded-lg bg-slate-800 accent-cyan-400 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1 font-mono">
            <span className="text-slate-400">{t.paddingY}</span>
            <span className="text-cyan-400 font-semibold">{paddingY}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={paddingY}
            onChange={(e) => onChangePaddingY(Number(e.target.value))}
            className="w-full h-1.5 rounded-lg bg-slate-800 accent-cyan-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}
