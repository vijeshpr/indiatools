import React, { useEffect, useRef } from 'react'
import QRCodeStyling, { Options } from 'qr-code-styling'
import {
  Printer,
  Download,
  Scissors,
  CheckCircle2,
  Smartphone,
  ShieldCheck,
  Building2,
  Phone,
  Sparkles,
} from 'lucide-react'
import { UpiFormData, QrStylingConfig, PosterConfig } from './QrCodeTypes'

interface QrCodeStandPosterProps {
  payload: string
  upiData: UpiFormData
  config: QrStylingConfig
  posterConfig: PosterConfig
  setPosterConfig: React.Dispatch<React.SetStateAction<PosterConfig>>
}

export const QrCodeStandPoster: React.FC<QrCodeStandPosterProps> = ({
  payload,
  upiData,
  config,
  posterConfig,
  setPosterConfig,
}) => {
  const qrPosterRef = useRef<HTMLDivElement>(null)
  const qrInstanceRef = useRef<QRCodeStyling | null>(null)

  const isA5 = posterConfig.size === 'a5'
  const qrSize = isA5 ? 220 : 280

  useEffect(() => {
    if (!qrPosterRef.current) return

    const isGradient = config.colorMode === 'gradient'
    const qrOptions: Partial<Options> = {
      width: qrSize,
      height: qrSize,
      type: 'canvas',
      data: payload || 'upi://pay?pa=merchant@upi',
      margin: config.qrMargin > 15 ? 12 : config.qrMargin,
      image: config.logoUrl || undefined,
      qrOptions: {
        errorCorrectionLevel: config.errorCorrection,
      },
      imageOptions: {
        hideBackgroundDots: config.hideBackgroundDots,
        imageSize: config.logoSize,
        margin: config.logoMargin,
        crossOrigin: 'anonymous',
      },
      dotsOptions: {
        type: config.dotType,
        color: !isGradient ? config.fgColor : undefined,
        gradient: isGradient
          ? {
              type: config.gradientType,
              rotation: (config.gradientRotation * Math.PI) / 180,
              colorStops: [
                { offset: 0, color: config.gradientColor1 },
                { offset: 1, color: config.gradientColor2 },
              ],
            }
          : undefined,
      },
      cornersSquareOptions: {
        type: config.cornerSquareType,
        color: config.customCornerColors
          ? config.cornerSquareColor
          : !isGradient
          ? config.fgColor
          : config.gradientColor1,
      },
      cornersDotOptions: {
        type: config.cornerDotType,
        color: config.customCornerColors
          ? config.cornerDotColor
          : !isGradient
          ? config.fgColor
          : config.gradientColor2,
      },
      backgroundOptions: {
        color: config.bgTransparent ? '#FFFFFF' : config.bgColor,
      },
    }

    if (!qrInstanceRef.current) {
      qrInstanceRef.current = new QRCodeStyling(qrOptions)
      qrPosterRef.current.innerHTML = ''
      qrInstanceRef.current.append(qrPosterRef.current)
    } else {
      qrInstanceRef.current.update(qrOptions)
    }
  }, [payload, config, qrSize])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Configuration Controls Bar */}
      <div className="no-print p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/70 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        {/* Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
            Print Format:
          </span>
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl">
            <button
              type="button"
              onClick={() => setPosterConfig((prev) => ({ ...prev, size: 'a5' }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                posterConfig.size === 'a5'
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400'
              }`}
            >
              A5 Counter Stand (Half A4)
            </button>
            <button
              type="button"
              onClick={() => setPosterConfig((prev) => ({ ...prev, size: 'a4' }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                posterConfig.size === 'a4'
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400'
              }`}
            >
              Full A4 Wall Poster
            </button>
          </div>
        </div>

        {/* Print Button CTA */}
        <button
          type="button"
          onClick={handlePrint}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4 text-slate-950" />
          <span>Print Standee Poster</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* THE PRINTABLE MERCHANT STAND POSTER (A5 / A4) */}
      {/* Designed to match authentic Indian merchant acrylic counter standees */}
      {/* ========================================================================= */}
      <div className="flex flex-col items-center justify-center p-2 sm:p-6 bg-slate-100/50 dark:bg-black/40 rounded-3xl border border-slate-200/60 dark:border-zinc-800">
        {/* A5 Cutting Guide Wrapper (for printing on A4 standard paper) */}
        <div
          className={`relative bg-white text-slate-950 print-exact shadow-2xl transition-all duration-300 ${
            isA5
              ? 'w-full max-w-[420px] rounded-2xl border-2 border-dashed border-slate-300 p-2 sm:p-3'
              : 'w-full max-w-[560px] rounded-3xl border border-slate-200 p-4 sm:p-6'
          }`}
        >
          {isA5 && (
            <div className="no-print mb-2 flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 border-b border-dashed border-slate-300 pb-1">
              <span className="flex items-center gap-1">
                <Scissors className="w-3 h-3 text-slate-500" />
                CUT HERE FOR A5 STAND (148 × 210 mm)
              </span>
              <span>HALF A4 SHEET</span>
            </div>
          )}

          {/* Standee Body Card */}
          <div className="rounded-2xl border-2 border-slate-900/10 overflow-hidden bg-white text-center flex flex-col items-center select-none">
            {/* Top Brand Header Bar */}
            <div className="w-full bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-4 sm:p-5 flex flex-col items-center relative overflow-hidden">
              {/* NPCI / UPI Top Emblem Pill */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono font-black tracking-widest text-emerald-400 uppercase">
                  BHIM UPI • INSTANT SETTLEMENT
                </span>
              </div>

              {/* Bold Merchant Business Name */}
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white leading-tight max-w-[90%] truncate">
                {upiData.payeeName.trim() || 'SHARMA GENERAL STORE'}
              </h1>

              {/* Tagline */}
              <p className="text-xs sm:text-sm font-semibold text-slate-300 mt-1 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>{posterConfig.tagline}</span>
              </p>
            </div>

            {/* Central QR Code Display Frame */}
            <div className="p-4 sm:p-6 flex flex-col items-center">
              <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center">
                <div ref={qrPosterRef} className="flex items-center justify-center" />
              </div>

              {/* Amount Notice if fixed */}
              {upiData.amount && (
                <div className="mt-3 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold font-mono">
                  Fixed Amount: ₹{Number(upiData.amount).toFixed(2)}
                </div>
              )}

              {/* UPI ID & Mobile Details */}
              <div className="mt-3 space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-900">
                  <span className="text-slate-400 font-sans font-normal">UPI ID:</span>
                  <span>{upiData.upiId || 'merchant@okaxis'}</span>
                </div>

                {upiData.merchantPhone && (
                  <div className="text-[11px] font-medium text-slate-500 flex items-center justify-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>Registered Mobile: {upiData.merchantPhone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment App Logos Accepted Ribbon */}
            <div className="w-full bg-slate-50 border-t border-slate-200 p-3.5 sm:p-4 flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                ACCEPTED HERE WITH ANY UPI APPLICATION
              </span>

              {/* 4 Brand Pillars for Indian Shoppers */}
              <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3">
                {/* GPay Badge */}
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="text-[11px] font-bold text-slate-800">GPay</span>
                </div>

                {/* PhonePe Badge */}
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#5F259F] text-white flex items-center justify-center text-[9px] font-bold">
                    पे
                  </span>
                  <span className="text-[11px] font-bold text-[#5F259F]">PhonePe</span>
                </div>

                {/* Paytm Badge */}
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-black text-[#002970]">
                    Pay<span className="text-[#00BAF2]">tm</span>
                  </span>
                </div>

                {/* BHIM UPI Badge */}
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                  <div className="w-3.5 h-3.5 flex items-center justify-center">
                    <span className="text-[9px] font-black text-emerald-700">UPI</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-800">BHIM</span>
                </div>
              </div>

              {/* Bottom Guarantee */}
              <div className="text-[9px] text-slate-400 flex items-center gap-2 mt-1">
                <span>Zero Convenience Fee</span>
                <span>•</span>
                <span>Direct Bank Transfer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
