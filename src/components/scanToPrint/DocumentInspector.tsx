import React, { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
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
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
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
  const [currentPage, setCurrentPage] = useState(1)
  const [isPurging, setIsPurging] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const isPdf = document.type.includes('pdf')
  const isImage = document.type.startsWith('image/')
  const isBw = document.preferences.colorMode === 'bw'
  const totalPages = Math.max(1, document.pageCount || 1)

  const springPhysics = {
    type: 'spring' as const,
    stiffness: 380,
    damping: 28,
  }

  const toggleOrientation = () => {
    setOrientation((prev) => (prev === 'portrait' ? 'landscape' : 'portrait'))
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((p) => p + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1)
    }
  }

  const handlePurgeWithFeedback = () => {
    setIsPurging(true)
    setTimeout(() => {
      onPurge()
    }, 320)
  }

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={springPhysics}
      className="relative p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-xl shadow-2xl space-y-5 overflow-hidden"
    >
      {/* Memory Shredding Purge Feedback Overlay */}
      <AnimatePresence>
        {isPurging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center space-y-3"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, ease: 'linear', repeat: Infinity }}
              className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400"
            >
              <ShieldAlert className="w-8 h-8" />
            </motion.div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-white">Shredding Ephemeral RAM Buffers...</p>
              <p className="text-xs text-slate-400 font-mono">Zero traces retained • Blob URLs revoked</p>
            </div>
            {/* Shredder Laser Line */}
            <motion.div
              animate={{ x: [-120, 120] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-24 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Title & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 no-print">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md">
              {document.name}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {(document.size / (1024 * 1024)).toFixed(2)} MB • {totalPages} page(s)
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-white/5 no-print">
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
      <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-white/10 flex flex-col items-center justify-center min-h-[360px]">
        {/* Top Controls Toolbar */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2 no-print">
          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            onClick={toggleOrientation}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 hover:text-white border border-white/10 shadow-md transition-colors cursor-pointer"
            title="Rotate layout orientation"
          >
            <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="capitalize">{orientation}</span>
          </motion.button>

          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            onClick={() => setPreviewZoom(!previewZoom)}
            className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 hover:text-white border border-white/10 shadow-md transition-colors cursor-pointer"
            title="Toggle Zoom View"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* In-Memory Document Render wrapped in printable-area */}
        <div
          id="printable-area"
          className={`w-full flex items-center justify-center p-4 transition-all duration-300 ${
            previewZoom ? 'min-h-[580px]' : 'min-h-[440px]'
          }`}
        >
          {isPdf ? (
            <object
              key={`pdf-obj-${document.id}-${currentPage}`}
              data={`${document.blobUrl}#page=${currentPage}&toolbar=0&navpanes=0`}
              type="application/pdf"
              className={`w-full rounded-lg border border-white/10 transition-all ${
                previewZoom ? 'h-[620px]' : 'h-[550px]'
              } ${orientation === 'landscape' ? 'max-w-4xl' : 'max-w-3xl'} ${
                isBw ? 'grayscale' : ''
              }`}
            >
              <div className="flex flex-col items-center justify-center p-8 bg-slate-900 border border-white/10 rounded-lg text-center space-y-3">
                <FileText className="w-10 h-10 text-cyan-400 mx-auto" />
                <p className="text-white font-medium text-sm">
                  Native PDF preview unavailable in your browser
                </p>
                <a
                  href={document.blobUrl}
                  download={document.name}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-xs font-semibold transition-colors inline-block"
                >
                  Download & Print
                </a>
              </div>
            </object>
          ) : isImage ? (
            <motion.img
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={springPhysics}
              src={document.blobUrl}
              alt="Customer Upload"
              className={`scan-to-print-image object-contain rounded-lg border border-white/10 shadow-lg transition-all ${
                previewZoom ? 'max-h-[580px]' : 'max-h-[480px]'
              } ${
                orientation === 'landscape' ? 'max-w-3xl' : 'max-w-xl'
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

        {/* Multi-Page Carousel Navigation Bar */}
        {totalPages > 1 && (
          <div className="w-full px-4 py-2 bg-slate-900/90 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 no-print">
            <div className="flex items-center gap-1.5">
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                disabled={currentPage <= 1}
                onClick={handlePrevPage}
                className="p-1 rounded-md bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 text-white cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </motion.button>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-950 border border-white/5">
                Page {currentPage} of {totalPages}
              </span>
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                disabled={currentPage >= totalPages}
                onClick={handleNextPage}
                className="p-1 rounded-md bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 text-white cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            {/* Thumbnail dots */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-[200px] py-1">
              {Array.from({ length: Math.min(totalPages, 8) }).map((_, idx) => {
                const pageNum = idx + 1
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                      currentPage === pageNum ? 'w-5 bg-cyan-400' : 'bg-slate-700 hover:bg-slate-500'
                    }`}
                    title={`Go to page ${pageNum}`}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Control Actions Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 no-print">
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
          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            transition={springPhysics}
            onClick={handlePurgeWithFeedback}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 transition-colors cursor-pointer"
            title="Immediately shred file from RAM"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{i18n.cta.purge}</span>
          </motion.button>

          {/* Big Print Button */}
          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            transition={springPhysics}
            onClick={onPrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{i18n.cta.printDoc}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
