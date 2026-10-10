import React from 'react'
import { ZoomIn, ZoomOut, RotateCcw, Printer, Copy, Edit3, ShieldAlert } from 'lucide-react'
import { SupportedLanguage } from '../../lib/cheque/types'
import { getTranslations } from '../../lib/cheque/languages'
import { useToast } from '../common/Toast'

interface PreviewToolbarProps {
  zoomLevel: number
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomReset: () => void
  onEditDetails: () => void
  onPrint: () => void
  onCopySummary: () => void
  lang: SupportedLanguage
}

export const PreviewToolbar: React.FC<PreviewToolbarProps> = ({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onEditDetails,
  onPrint,
  onCopySummary,
  lang,
}) => {
  const t = getTranslations(lang)
  const isRtl = lang === 'ur'

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-2 p-2 sm:p-2.5 rounded-xl bg-neutral-900/90 light:bg-slate-100 border border-neutral-800 light:border-slate-300 shadow-sm no-print"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Zoom Controls */}
      <div className="flex items-center gap-0.5 bg-neutral-950/80 light:bg-white rounded-lg p-0.5 border border-neutral-800 light:border-slate-200">
        <button
          type="button"
          onClick={onZoomOut}
          disabled={zoomLevel <= 0.6}
          className="p-1 rounded-md text-neutral-400 hover:text-white disabled:opacity-40 disabled:hover:text-neutral-400 transition-colors cursor-pointer"
          title={t.zoomOut}
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <span className="text-[11px] font-mono text-neutral-300 light:text-slate-700 px-1.5 min-w-[38px] text-center font-bold">
          {Math.round(zoomLevel * 100)}%
        </span>

        <button
          type="button"
          onClick={onZoomIn}
          disabled={zoomLevel >= 1.5}
          className="p-1 rounded-md text-neutral-400 hover:text-white disabled:opacity-40 disabled:hover:text-neutral-400 transition-colors cursor-pointer"
          title={t.zoomIn}
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onZoomReset}
          className="p-1 rounded-md text-neutral-400 hover:text-white transition-colors border-l border-neutral-800 light:border-slate-200 ml-0.5 cursor-pointer"
          title={t.zoomReset}
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* Action Buttons: Edit, Copy, Print */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={onEditDetails}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 light:bg-white light:hover:bg-slate-50 light:text-slate-800 border border-neutral-700 light:border-slate-300 transition-colors cursor-pointer shadow-sm"
        >
          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.editDetailsBtn}</span>
        </button>

        <button
          type="button"
          onClick={onCopySummary}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 light:bg-white light:hover:bg-slate-50 light:text-slate-800 border border-neutral-700 light:border-slate-300 transition-colors cursor-pointer shadow-sm"
        >
          <Copy className="w-3.5 h-3.5 text-blue-400" />
          <span>Copy</span>
        </button>

        <button
          type="button"
          onClick={onPrint}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-950 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>{t.printBtn}</span>
        </button>
      </div>
    </div>
  )
}
