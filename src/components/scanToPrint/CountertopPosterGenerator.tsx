import React, { useEffect, useRef, useState } from 'react'
import QRCodeStyling from 'qr-code-styling'
import { Printer, X, ShieldCheck, Sparkles } from 'lucide-react'
import { I18nContent } from './scanToPrintI18n'
import { PosterConfig } from '../../types/p2pPrint'

interface CountertopPosterGeneratorProps {
  isOpen: boolean
  onClose: () => void
  sessionUrl: string
  i18n: I18nContent
}

export const CountertopPosterGenerator: React.FC<CountertopPosterGeneratorProps> = ({
  isOpen,
  onClose,
  sessionUrl,
  i18n,
}) => {
  const [config, setConfig] = useState<PosterConfig>({
    shopName: 'City Xerox & DTP Centre',
    tagline: 'Scan to Print Instantly — No WhatsApp Needed!',
    size: 'a4',
    theme: 'clean-white', // Default clean white for ink saving
    showSteps: true,
    phoneContact: '',
  })

  const posterQrRef = useRef<HTMLDivElement>(null)
  const qrInstanceRef = useRef<QRCodeStyling | null>(null)

  useEffect(() => {
    if (!isOpen || !posterQrRef.current) return

    const isDark = config.theme === 'obsidian'
    const qrOptions = {
      width: config.size === 'a4' ? 240 : 190,
      height: config.size === 'a4' ? 240 : 190,
      type: 'canvas' as const,
      data: sessionUrl,
      margin: 8,
      qrOptions: {
        errorCorrectionLevel: 'H' as const,
      },
      dotsOptions: {
        type: 'rounded' as const,
        color: isDark ? '#06B6D4' : '#0F172A',
      },
      cornersSquareOptions: {
        type: 'extra-rounded' as const,
        color: isDark ? '#10B981' : '#059669',
      },
      cornersDotOptions: {
        type: 'dot' as const,
        color: isDark ? '#10B981' : '#059669',
      },
      backgroundOptions: {
        color: isDark ? '#0A0F1D' : '#FFFFFF',
      },
    }

    if (!qrInstanceRef.current) {
      qrInstanceRef.current = new QRCodeStyling(qrOptions)
      posterQrRef.current.innerHTML = ''
      qrInstanceRef.current.append(posterQrRef.current)
    } else {
      qrInstanceRef.current.update(qrOptions)
    }
  }, [isOpen, sessionUrl, config.theme, config.size])

  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  const isDark = config.theme === 'obsidian'

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-transparent print:backdrop-blur-none">
      {/* Editor Modal Container */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row print:shadow-none print:border-none print:w-full print:max-w-none print:rounded-none">
        
        {/* Controls Sidebar (Hidden in Print) */}
        <div className="no-print w-full lg:w-80 p-5 bg-slate-950/90 border-b lg:border-b-0 lg:border-r border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>{i18n.poster.modalTitle}</span>
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Shop Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">{i18n.poster.shopNameLabel}</label>
            <input
              type="text"
              value={config.shopName}
              onChange={(e) => setConfig({ ...config, shopName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
              placeholder="e.g. Akshaya Centre / Sai Xerox"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">{i18n.poster.taglineLabel}</label>
            <input
              type="text"
              value={config.tagline}
              onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Paper Size */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">{i18n.poster.sizeLabel}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConfig({ ...config, size: 'a4' })}
                className={`py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  config.size === 'a4'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-900 border-white/10 text-slate-400'
                }`}
              >
                Standard A4
              </button>
              <button
                type="button"
                onClick={() => setConfig({ ...config, size: 'a5' })}
                className={`py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  config.size === 'a5'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-900 border-white/10 text-slate-400'
                }`}
              >
                Compact A5
              </button>
            </div>
          </div>

          {/* Theme */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">{i18n.poster.themeLabel}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConfig({ ...config, theme: 'clean-white' })}
                className={`py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  config.theme === 'clean-white'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-slate-900 border-white/10 text-slate-400'
                }`}
              >
                Clean White (Ink Saver)
              </button>
              <button
                type="button"
                onClick={() => setConfig({ ...config, theme: 'obsidian' })}
                className={`py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  config.theme === 'obsidian'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-slate-900 border-white/10 text-slate-400'
                }`}
              >
                Obsidian Dark
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 space-y-2">
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{i18n.poster.printButton}</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {i18n.poster.closeButton}
            </button>
          </div>
        </div>

        {/* Printable Standee Preview Viewport */}
        <div className="flex-1 p-4 sm:p-8 flex items-center justify-center bg-slate-950/60 overflow-y-auto">
          <div
            id="countertop-poster-sheet"
            className={`w-full max-w-md p-6 sm:p-8 rounded-2xl border transition-colors shadow-2xl flex flex-col items-center justify-between text-center relative print:border-none print:shadow-none print:max-w-none print:w-full print:p-8 ${
              isDark
                ? 'bg-[#0A0F1D] text-white border-cyan-500/30'
                : 'bg-white text-slate-900 border-slate-300'
            }`}
          >
            {/* Top Header Badge */}
            <div className="space-y-1 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero-WhatsApp Instant Print</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                {config.shopName || 'Print Station'}
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {config.tagline}
              </p>
            </div>

            {/* Big Standee QR Code Frame */}
            <div
              className={`p-4 rounded-2xl border-2 flex items-center justify-center my-3 ${
                isDark
                  ? 'bg-slate-900 border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-50 border-slate-300 shadow-md'
              }`}
            >
              <div ref={posterQrRef} className="rounded-xl overflow-hidden" />
            </div>

            {/* Instruction Steps */}
            <div
              className={`w-full p-3.5 rounded-xl border text-left text-xs space-y-2 my-4 ${
                isDark ? 'bg-slate-900/60 border-white/10 text-slate-300' : 'bg-slate-100/80 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[10px]">1</span>
                <span className="font-medium">{i18n.poster.step1}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-white font-bold flex items-center justify-center text-[10px]">2</span>
                <span className="font-medium">{i18n.poster.step2}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[10px]">3</span>
                <span className="font-medium">{i18n.poster.step3}</span>
              </div>
            </div>

            {/* Security Guarantee Badges */}
            <div className="flex items-center justify-center gap-3 text-[11px] font-semibold text-emerald-600">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{i18n.poster.privacyBadge}</span>
              </span>
              <span>•</span>
              <span>{i18n.poster.noWhatsAppBadge}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
