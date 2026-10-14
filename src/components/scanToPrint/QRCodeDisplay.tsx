import React, { useEffect, useRef, useState } from 'react'
import QRCodeStyling from 'qr-code-styling'
import { Copy, Check, ExternalLink, Maximize2, Minimize2, Smartphone } from 'lucide-react'

interface QRCodeDisplayProps {
  sessionId: string
  sessionUrl: string
  sessionLabel: string
  instructionText: string
  onOpenMobileTest: () => void
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  sessionId,
  sessionUrl,
  sessionLabel,
  instructionText,
  onOpenMobileTest,
}) => {
  const qrRef = useRef<HTMLDivElement>(null)
  const qrInstanceRef = useRef<QRCodeStyling | null>(null)
  const [copied, setCopied] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (!qrRef.current) return

    const qrOptions = {
      width: 210,
      height: 210,
      type: 'svg' as const,
      data: sessionUrl,
      margin: 6,
      qrOptions: {
        errorCorrectionLevel: 'M' as const,
      },
      dotsOptions: {
        type: 'rounded' as const,
        color: '#06B6D4', // Electric Cyan
      },
      cornersSquareOptions: {
        type: 'extra-rounded' as const,
        color: '#10B981', // Emerald
      },
      cornersDotOptions: {
        type: 'dot' as const,
        color: '#10B981',
      },
      backgroundOptions: {
        color: '#0A0F1D', // Deep obsidian
      },
    }

    if (!qrInstanceRef.current) {
      qrInstanceRef.current = new QRCodeStyling(qrOptions)
      qrRef.current.innerHTML = ''
      qrInstanceRef.current.append(qrRef.current)
    } else {
      qrInstanceRef.current.update(qrOptions)
    }
  }, [sessionUrl])

  const copySessionLink = async () => {
    try {
      await navigator.clipboard.writeText(sessionUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      // Fallback
    }
  }

  return (
    <div
      className={`relative p-5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col items-center transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950/98 p-8 flex items-center justify-center'
          : ''
      }`}
    >
      {/* Header with Session ID & Kiosk Toggle */}
      <div className="w-full flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">{sessionLabel}:</span>
          <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs font-bold">
            {sessionId}
          </span>
        </div>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title={isFullscreen ? 'Exit Kiosk View' : 'Kiosk Fullscreen View'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Styled QR Code Box with Glowing Bevel */}
      <div className="relative p-3 rounded-2xl bg-[#0A0F1D] border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] flex items-center justify-center group">
        <div ref={qrRef} className="rounded-xl overflow-hidden" />

        {/* Ambient Corner Accents */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400 rounded-tl-sm pointer-events-none" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400 rounded-tr-sm pointer-events-none" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-emerald-400 rounded-bl-sm pointer-events-none" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-emerald-400 rounded-br-sm pointer-events-none" />
      </div>

      <p className="text-xs text-center text-slate-400 max-w-xs mt-3 leading-relaxed">
        {instructionText}
      </p>

      {/* Action Buttons */}
      <div className="w-full grid grid-cols-2 gap-2 mt-4">
        <button
          onClick={copySessionLink}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700/90 border border-white/10 text-slate-200 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
          <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
        </button>

        <button
          onClick={onOpenMobileTest}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/30 text-emerald-300 transition-colors cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Test in Tab</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </button>
      </div>
    </div>
  )
}
