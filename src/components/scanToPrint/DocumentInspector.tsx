import React, { useState } from 'react'
import {
  Printer,
  Trash2,
  FileText,
  RotateCw,
  CheckCircle,
  Palette,
  Copy,
  Layers,
  ZoomIn,
} from 'lucide-react'
import { ReceivedDocument } from '../../types/p2pPrint'
import { I18nContent } from './scanToPrintI18n'

interface DocumentInspectorProps {
  document: ReceivedDocument
  autoPrintEnabled: boolean
  onToggleAutoPrint: () => void
  onPrint: () => void
  onPurge: () => void
  i18n: I18nContent
}

export const DocumentInspector: React.FC<DocumentInspectorProps> = ({
  document,
  autoPrintEnabled,
  onToggleAutoPrint,
  onPrint,
  onPurge,
  i18n,
}) => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [previewZoom, setPreviewZoom] = useState(false)

  const isPdf = document.type.includes('pdf')
  const isImage = document.type.startsWith('image/')
  const isBw = document.preferences.colorMode === 'bw'

  const toggleOrientation = () => {
    setOrientation((prev) => (prev === 'portrait' ? 'landscape' : 'portrait'))
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-xl shadow-2xl space-y-5 animate-in fade-in duration-300">
      {/* Header with Title & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md">
              {document.name}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {(document.size / (1024 * 1024)).toFixed(2)} MB • {document.pageCount} page(s)
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{i18n.terminal.readyToPrint}</span>
        </div>
      </div>

      {/* Pre-Print Preferences Chips (Sent by Customer) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-white/5">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-white/5">
          <Palette className={`w-4 h-4 ${isBw ? 'text-slate-400' : 'text-cyan-400'}`} />
          <div>
            <p className="text-[10px] text-slate-400 font-medium">{i18n.terminal.colorMode}</p>
            <p className="text-xs font-bold text-slate-200">
              {isBw ? i18n.terminal.bw : i18n.terminal.color}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-white/5">
          <Copy className="w-4 h-4 text-emerald-400" />
          <div>
            <p className="text-[10px] text-slate-400 font-medium">{i18n.terminal.copies}</p>
            <p className="text-xs font-bold text-emerald-300">{document.preferences.copies} Copy</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-white/5">
          <Layers className="w-4 h-4 text-amber-400" />
          <div>
            <p className="text-[10px] text-slate-400 font-medium">{i18n.terminal.pageRange}</p>
            <p className="text-xs font-bold text-slate-200">
              {document.preferences.pageRange || 'All Pages'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-white/5">
          <RotateCw className="w-4 h-4 text-cyan-400" />
          <div>
            <p className="text-[10px] text-slate-400 font-medium">{i18n.terminal.orientation}</p>
            <p className="text-xs font-bold text-slate-200 capitalize">{orientation}</p>
          </div>
        </div>
      </div>

      {/* Preview Viewport Container */}
      <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-white/10 flex items-center justify-center min-h-[300px] max-h-[460px]">
        {/* Orientation Toggle Button */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
          <button
            onClick={toggleOrientation}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 hover:text-white border border-white/10 shadow-md transition-colors cursor-pointer"
            title="Rotate layout orientation"
          >
            <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="capitalize">{orientation}</span>
          </button>

          <button
            onClick={() => setPreviewZoom(!previewZoom)}
            className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 hover:text-white border border-white/10 shadow-md transition-colors cursor-pointer"
            title="Toggle Zoom View"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* In-Memory Document Render */}
        <div
          className={`w-full h-full flex items-center justify-center p-4 transition-all duration-300 ${
            orientation === 'landscape' ? 'rotate-0' : ''
          }`}
        >
          {isPdf ? (
            <iframe
              src={`${document.blobUrl}#toolbar=0&navpanes=0`}
              title="PDF Print Preview"
              className={`w-full rounded-lg border border-white/10 transition-all ${
                orientation === 'landscape' ? 'h-[280px] max-w-2xl' : 'h-[380px] max-w-md'
              } ${isBw ? 'grayscale' : ''}`}
            />
          ) : isImage ? (
            <img
              src={document.blobUrl}
              alt="Customer Upload"
              className={`max-h-[380px] object-contain rounded-lg border border-white/10 shadow-lg transition-all ${
                orientation === 'landscape' ? 'max-w-xl' : 'max-w-md'
              } ${isBw ? 'grayscale contrast-125' : ''}`}
            />
          ) : (
            <div className="text-center p-8 space-y-2">
              <FileText className="w-12 h-12 text-cyan-400 mx-auto" />
              <p className="text-sm font-semibold text-white">{document.name}</p>
              <p className="text-xs text-slate-400">Ready to output via system printer</p>
            </div>
          )}
        </div>
      </div>

      {/* Control Actions Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {/* Auto-Print Toggle Switch */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoPrintEnabled}
            onChange={onToggleAutoPrint}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 relative" />
          <span className="text-xs font-medium text-slate-300">{i18n.cta.autoPrint}</span>
        </label>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Done & Purge Button */}
          <button
            onClick={onPurge}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 transition-colors cursor-pointer"
            title="Immediately shred file from RAM"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{i18n.cta.purge}</span>
          </button>

          {/* Big Print Button */}
          <button
            onClick={onPrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Printer className="w-4 h-4" />
            <span>{i18n.cta.printDoc}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
