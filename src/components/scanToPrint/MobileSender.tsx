import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Send,
  Plus,
  Minus,
  Palette,
  Copy,
  ShieldCheck,
  RefreshCw,
  X,
} from 'lucide-react'
import { P2PConnectionState, PrintColorMode, PrintPreferences, TransferProgress } from '../../types/p2pPrint'
import { I18nContent } from './scanToPrintI18n'

interface MobileSenderProps {
  sessionId: string
  connectionState: P2PConnectionState
  progress: TransferProgress | null
  onSendFile: (file: File, preferences: PrintPreferences) => Promise<void>
  i18n: I18nContent
}

export const MobileSender: React.FC<MobileSenderProps> = ({
  sessionId,
  connectionState,
  progress,
  onSendFile,
  i18n,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [colorMode, setColorMode] = useState<PrintColorMode>('bw')
  const [copies, setCopies] = useState<number>(1)
  const [pageRange, setPageRange] = useState<string>('All')
  const [isSent, setIsSent] = useState<boolean>(false)
  const [isSending, setIsSending] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const springPhysics = {
    type: 'spring' as const,
    stiffness: 380,
    damping: 26,
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setIsSent(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
      setIsSent(false)
    }
  }

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#06B6D4', '#F59E0B', '#3B82F6'],
      })
    } catch (e) {
      // Fallback
    }
  }

  const handleSend = async () => {
    if (!selectedFile) return
    setIsSending(true)

    const preferences: PrintPreferences = {
      colorMode,
      copies,
      pageRange: pageRange.trim() || 'All',
      orientation: 'portrait',
      paperSize: 'a4',
    }

    try {
      await onSendFile(selectedFile, preferences)
      setIsSending(false)
      setIsSent(true)
      triggerConfetti()
    } catch (err) {
      setIsSending(false)
    }
  }

  const handleSendAnother = () => {
    setSelectedFile(null)
    setIsSent(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const isConnected = connectionState === 'connected' || connectionState === 'transferring'

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 rounded-2xl bg-slate-900/95 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6 no-print">
      {/* Top Station Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <h2 className="text-sm font-bold text-white">{i18n.mobile.senderTitle}</h2>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
          Station: {sessionId}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Success Screen after Transfer */}
        {isSent ? (
          <motion.div
            key="success-screen"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={springPhysics}
            className="text-center py-8 space-y-4"
          >
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              {!shouldReduceMotion && (
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75" />
              )}
              <motion.div
                initial={shouldReduceMotion ? false : { scale: 0 }}
                animate={{ scale: [0, 1.15, 1] }}
                transition={{ type: 'spring', stiffness: 420, damping: 20 }}
                className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">{i18n.mobile.successTitle}</h3>
              <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                {i18n.mobile.successDesc}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{i18n.mobile.instantShopArrival}</span>
            </div>

            <button
              onClick={handleSendAnother}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{i18n.cta.sendAnother}</span>
            </button>
          </motion.div>
        ) : (
          /* Main Upload & Preferences Form */
          <motion.div
            key="upload-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* File Picker Zone */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="mobile-file-input"
            />

            {!selectedFile ? (
              <label
                htmlFor="mobile-file-input"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 bg-slate-950/60 hover:bg-slate-950/80 transition-all cursor-pointer text-center space-y-3 group"
              >
                <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">{i18n.mobile.tapToUpload}</p>
                  <p className="text-[11px] text-slate-400">{i18n.mobile.supportedFormats}</p>
                </div>
              </label>
            ) : (
              /* Selected File Preview Box */
              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{selectedFile.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'Document'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Pre-Print Preferences Form */}
            {selectedFile && (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{i18n.mobile.preferencesTitle}</span>
                </h4>

                {/* Color Mode Toggle */}
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400">{i18n.mobile.colorLabel}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setColorMode('bw')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        colorMode === 'bw'
                          ? 'bg-slate-800 border-white/30 text-white shadow-sm'
                          : 'bg-slate-900/60 border-white/5 text-slate-400'
                      }`}
                    >
                      Black & White (B&W)
                    </button>
                    <button
                      type="button"
                      onClick={() => setColorMode('color')}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        colorMode === 'color'
                          ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                          : 'bg-slate-900/60 border-white/5 text-slate-400'
                      }`}
                    >
                      Color Print
                    </button>
                  </div>
                </div>

                {/* Copies Counter */}
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Copy className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{i18n.mobile.copiesLabel}:</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCopies(Math.max(1, copies - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold font-mono text-white">
                      {copies}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCopies(Math.min(10, copies + 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Page Range Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span>{i18n.mobile.pagesLabel}</span>
                    <button
                      type="button"
                      onClick={() => setPageRange('All')}
                      className="text-cyan-400 hover:underline cursor-pointer"
                    >
                      {i18n.mobile.allPages}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    placeholder={i18n.mobile.pagesPlaceholder}
                    className="w-full px-3 py-2 rounded-lg text-xs bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>
            )}

            {/* Progress Bar (While Sending) */}
            {isSending && progress && (
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-cyan-500/30">
                <p className="text-[11px] text-cyan-400 font-medium">
                  {i18n.mobile.sendingProgress} ({progress.percentage}%)
                </p>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-150"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Big Glowing Send to Printer CTA */}
            {selectedFile && (
              <motion.button
                type="button"
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                transition={springPhysics}
                disabled={isSending}
                onClick={handleSend}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-white shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Streaming to Counter...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{i18n.cta.sendToPrinter}</span>
                  </>
                )}
              </motion.button>
            )}

            {/* Zero WhatsApp privacy badge */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero WhatsApp • Zero Cloud Storage</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
