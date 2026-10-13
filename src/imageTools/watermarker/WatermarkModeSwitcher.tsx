import React from 'react'
import { WatermarkMode } from '../../lib/watermarker/types'
import { WatermarkTranslation } from '../../lib/watermarker/i18n/translations'
import { Image, FileText, Sparkles } from 'lucide-react'

interface WatermarkModeSwitcherProps {
  mode: WatermarkMode
  onModeChange: (mode: WatermarkMode) => void
  t: WatermarkTranslation
}

export const WatermarkModeSwitcher: React.FC<WatermarkModeSwitcherProps> = ({
  mode,
  onModeChange,
  t,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-1.5 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md max-w-2xl mx-auto shadow-xl">
      <button
        type="button"
        onClick={() => onModeChange('image')}
        className={`w-full sm:w-1/2 flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          mode === 'image'
            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        }`}
      >
        <Image className={`w-4 h-4 ${mode === 'image' ? 'text-cyan-400' : 'text-slate-400'}`} />
        <span>{t.modeImage}</span>
        {mode === 'image' && (
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse ml-0.5" />
        )}
      </button>

      <button
        type="button"
        onClick={() => onModeChange('text')}
        className={`w-full sm:w-1/2 flex items-center justify-center gap-2.5 py-3 px-5 rounded-xl text-sm font-semibold transition-all duration-200 ${
          mode === 'text'
            ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        }`}
      >
        <FileText className={`w-4 h-4 ${mode === 'text' ? 'text-emerald-400' : 'text-slate-400'}`} />
        <span>{t.modeText}</span>
        {mode === 'text' && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
        )}
      </button>
    </div>
  )
}
