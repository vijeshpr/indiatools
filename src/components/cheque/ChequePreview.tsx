import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChequeFormData, PaymentMode, SupportedLanguage } from '../../lib/cheque/types'
import { getBankById } from '../../lib/cheque/banks'
import { convertAmountToWords, formatInr } from '../../lib/cheque/amountToWords'
import { getTranslations } from '../../lib/cheque/languages'

interface ChequePreviewProps {
  data: ChequeFormData
  bankId: string
  paymentMode: PaymentMode
  lang: SupportedLanguage
  zoomLevel?: number
  isPrint?: boolean
}

export const ChequePreview: React.FC<ChequePreviewProps> = ({
  data,
  bankId,
  paymentMode,
  lang,
  zoomLevel = 1,
  isPrint = false,
}) => {
  const bank = getBankById(bankId)
  const t = getTranslations(lang)
  const isRtl = lang === 'ur'
  const amountWords = convertAmountToWords(data.amountRupees, data.amountPaise, lang)

  // Parse Date into individual characters: DD MM YYYY
  let d1 = 'D', d2 = 'D', m1 = 'M', m2 = 'M', y1 = 'Y', y2 = 'Y', y3 = 'Y', y4 = 'Y'
  if (data.date) {
    const parts = data.date.split('-') // [YYYY, MM, DD]
    if (parts.length === 3) {
      const year = parts[0]
      const month = parts[1]
      const day = parts[2]
      d1 = day[0] || '0'
      d2 = day[1] || '1'
      m1 = month[0] || '0'
      m2 = month[1] || '1'
      y1 = year[0] || '2'
      y2 = year[1] || '0'
      y3 = year[2] || '2'
      y4 = year[3] || '6'
    }
  }

  // Format numeric amount string for the ₹ box
  const numRupees = typeof data.amountRupees === 'string' ? parseFloat(data.amountRupees) || 0 : data.amountRupees
  const numPaise = typeof data.amountPaise === 'string' ? parseInt(data.amountPaise, 10) || 0 : data.amountPaise
  const formattedFigures = numRupees > 0
    ? numPaise > 0
      ? `${numRupees.toLocaleString('en-IN')}.${numPaise.toString().padStart(2, '0')} /-`
      : `${numRupees.toLocaleString('en-IN')} /-`
    : '— /-'

  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState<number>(780)

  useEffect(() => {
    if (isPrint || !containerRef.current) return
    const updateWidth = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth
        if (w > 0) {
          setContainerWidth((prev) => (Math.abs(prev - w) > 2 ? w : prev))
        }
      }
    }
    updateWidth()

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(updateWidth)
      ro.observe(containerRef.current)
      return () => ro.disconnect()
    } else {
      window.addEventListener('resize', updateWidth)
      return () => window.removeEventListener('resize', updateWidth)
    }
  }, [isPrint])

  // Auto-fit scale factor based on container width (with padding allowance)
  const fitScale = isPrint ? 680 / 780 : Math.min(1, Math.max(0.35, (containerWidth - 8) / 780))
  // Effective scale combines auto container fit with user-specified zoom multiplier
  const effectiveScale = isPrint ? Number((680 / 780).toFixed(4)) : Number((fitScale * (zoomLevel || 1)).toFixed(3))
  const renderedWidth = isPrint ? 680 : Math.round(780 * effectiveScale)
  const renderedHeight = isPrint ? 296 : Math.round(340 * effectiveScale)

  return (
    <div
      ref={containerRef}
      className={isPrint ? 'w-full flex justify-center items-center py-0' : 'w-full flex justify-center items-center overflow-x-auto py-1'}
    >
      <div
        style={{
          width: `${renderedWidth}px`,
          height: `${renderedHeight}px`,
          minWidth: `${renderedWidth}px`,
        }}
        className={isPrint ? 'relative shrink-0 cheque-print-canvas' : 'relative shrink-0 transition-[width,height] duration-200 ease-out'}
      >
        {/* ================= ACTUAL CHEQUE CANVAS ================= */}
        <div
          id={isPrint ? 'cheque-printable-area-print' : 'cheque-printable-area'}
          className={`absolute top-0 left-0 rounded-lg border-2 border-slate-400/80 bg-[#F4F9F9] text-slate-900 shadow-xl overflow-hidden font-serif select-none ${
            isPrint ? 'print-exact' : 'transition-transform duration-200'
          }`}
          style={{
            width: '780px',
            height: '340px',
            transform: `scale(${effectiveScale})`,
            transformOrigin: 'top left',
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact',
            // Authentic security micro-pattern background
            backgroundImage: `
              radial-gradient(#d5e8ea 1px, transparent 1px),
              linear-gradient(to right, rgba(0,0,0,0.015) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.015) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px, 12px 12px, 12px 12px',
          }}
        >
          {/* Bank Top Branding Bar */}
          <div
            className="h-2 w-full print-exact"
            style={{
              backgroundColor: bank.themeColor,
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact',
            }}
          />

          {/* ================= WATERMARK LAYER (Prominent & Unmissable) ================= */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-[0.14] select-none z-20">
            <div className="text-5xl font-black font-sans uppercase tracking-[0.25em] -rotate-12 text-slate-800 text-center leading-tight">
              DEMO — NOT A VALID CHEQUE
              <span className="block text-2xl font-bold tracking-[0.3em] mt-2 text-slate-700">
                FOR EDUCATIONAL USE ONLY • SAMPLE
              </span>
            </div>
          </div>

          {/* CTS-2010 Compliance Left Vertical Security String */}
          <div className="absolute left-2 top-8 bottom-12 w-4 flex flex-col justify-between items-center text-[8px] font-mono text-slate-400 rotate-180 uppercase tracking-widest z-10">
            <span>CTS-2010 COMPLIANT EDUCATIONAL FORMAT • INDIA PRACTICAL TOOLS</span>
          </div>

          {/* ================= ACCOUNT PAYEE CROSSING (TOP LEFT) ================= */}
          {paymentMode === 'account-payee' && (
            <div className="absolute -top-3 -left-3 w-36 h-36 pointer-events-none z-30 print-exact">
              {/* Parallel line 1 */}
              <div
                className="absolute w-44 h-[2px] bg-slate-900 -rotate-45 top-10 -left-4 print-exact"
                style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
              />
              {/* Text inside crossing */}
              <div
                className="absolute -rotate-45 top-[46px] -left-1 text-[9px] font-sans font-black tracking-widest text-slate-900 uppercase bg-[#F4F9F9]/80 px-1 print-exact"
                style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
              >
                A/C PAYEE ONLY
              </div>
              {/* Parallel line 2 */}
              <div
                className="absolute w-44 h-[2px] bg-slate-900 -rotate-45 top-16 -left-4 print-exact"
                style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
              />
            </div>
          )}

          {/* Cash / Self / Bearer Corner Indicator Badge */}
          {paymentMode !== 'account-payee' && (
            <div className="absolute top-3 left-4 z-20 print-exact">
              <span
                className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border print-exact ${
                  paymentMode === 'cash'
                    ? 'bg-blue-100 text-blue-900 border-blue-400'
                    : paymentMode === 'self'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                    : 'bg-amber-100 text-amber-900 border-amber-400'
                }`}
                style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
              >
                {paymentMode === 'cash' && 'OPEN CHEQUE (CASH)'}
                {paymentMode === 'self' && 'SELF WITHDRAWAL'}
                {paymentMode === 'bearer' && 'BEARER CHEQUE'}
              </span>
            </div>
          )}

          {/* ================= CHEQUE HEADER: BANK & DATE ================= */}
          <div className="pt-3 px-8 flex items-start justify-between">
            {/* Left Bank Details */}
            <div className="pl-6">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0 print-exact"
                  style={{ backgroundColor: bank.themeColor, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
                />
                <h3
                  className="text-lg font-black tracking-tight uppercase font-sans print-exact"
                  style={{ color: bank.themeColor, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
                >
                  {bank.name}
                </h3>
              </div>
              <p className="text-[10px] text-slate-600 font-sans mt-0.5 tracking-tight">
                {bank.branchPlaceholder} • IFSC: {bank.ifscPrefix}
              </p>
            </div>

            {/* Right Date Grid */}
            <div className="text-right">
              <div className="text-[9px] font-sans font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
                <span>DATE / दिनांक</span>
              </div>

              {/* 8 Individual Square Digits */}
              <div className="flex items-center gap-0.5 font-mono text-sm font-bold text-slate-900">
                <div className="w-5 h-6 border border-slate-600 flex items-center justify-center bg-white/90 shadow-sm print-exact" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>{d1}</div>
                <div className="w-5 h-6 border border-slate-600 flex items-center justify-center bg-white/90 shadow-sm print-exact" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>{d2}</div>
                <span className="w-1 text-center font-sans text-slate-400"></span>
                <div className="w-5 h-6 border border-slate-600 flex items-center justify-center bg-white/90 shadow-sm print-exact" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>{m1}</div>
                <div className="w-5 h-6 border border-slate-600 flex items-center justify-center bg-white/90 shadow-sm print-exact" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>{m2}</div>
                <span className="w-1 text-center font-sans text-slate-400"></span>
                <div className="w-5 h-6 border border-slate-600 flex items-center justify-center bg-white/90 shadow-sm print-exact" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>{y1}</div>
                <div className="w-5 h-6 border border-slate-600 flex items-center justify-center bg-white/90 shadow-sm print-exact" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>{y2}</div>
                <div className="w-5 h-6 border border-slate-600 flex items-center justify-center bg-white/90 shadow-sm print-exact" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>{y3}</div>
                <div className="w-5 h-6 border border-slate-600 flex items-center justify-center bg-white/90 shadow-sm print-exact" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>{y4}</div>
              </div>

              <span className="text-[8px] font-sans text-slate-500 block mt-1 tracking-tighter">
                VALID FOR 3 MONTHS ONLY
              </span>
            </div>
          </div>

          {/* ================= CHEQUE BODY ================= */}
          <div className="px-10 mt-3 space-y-3 font-sans">
            {/* Payee Line */}
            <div className="flex items-end gap-2 text-xs">
              <span className="font-bold text-slate-700 whitespace-nowrap text-[11px] font-serif">
                PAY / अदा करें :
              </span>
              <div className="flex-1 border-b-2 border-dotted border-slate-600 pb-0.5 px-2 font-bold text-sm text-slate-950 font-serif min-h-[22px] truncate overflow-hidden">
                {data.payeeName || <span className="text-slate-300 font-sans italic">Name of Payee or Beneficiary</span>}
              </div>
              <div className="relative text-[11px] font-bold text-slate-700 whitespace-nowrap pl-2">
                <span>OR BEARER / या धारक को</span>
                {paymentMode === 'account-payee' && (
                  <div className="absolute inset-x-1 top-1/2 -translate-y-1/2 h-[2px] bg-slate-900" />
                )}
              </div>
            </div>

            {/* Rupees in Words Line 1 & Line 2 */}
            <div className="space-y-1">
              <div className="flex items-end gap-2 text-xs">
                <span className="font-bold text-slate-700 whitespace-nowrap text-[11px] font-serif">
                  RUPEES / रुपये :
                </span>
                <div className="flex-1 border-b-2 border-dotted border-slate-600 pb-0.5 px-2 font-semibold text-xs text-slate-950 font-serif min-h-[20px] leading-tight">
                  {amountWords.words} {amountWords.words !== 'Zero Rupees Only' && '//'}
                </div>
              </div>

              {/* Second continuation line for long words */}
              <div className="flex items-end gap-2 text-xs">
                <div className="flex-1 border-b-2 border-dotted border-slate-600 pb-0.5 px-2 text-[10px] text-slate-600 font-sans italic min-h-[18px]">
                  {lang !== 'en' && (
                    <span>[ English: {amountWords.wordsInEnglish} // ]</span>
                  )}
                </div>
              </div>
            </div>

            {/* Account Box & Amount in Figures Box */}
            <div className="flex items-center justify-between pt-1">
              {/* Account Number Placeholder */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase font-mono">
                  A/c No.
                </span>
                <div className="border border-slate-700 bg-white px-3 py-1 font-mono font-bold text-xs tracking-widest text-slate-900 shadow-inner">
                  1 0 4 9 8 7 6 5 4 3 2 1
                </div>
              </div>

              {/* Rupee Amount Box */}
              <div className="flex items-center">
                <div
                  className="flex items-center border-2 border-slate-800 bg-white/95 rounded px-3 py-1.5 shadow-md print-exact"
                  style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
                >
                  <span className="text-lg font-black text-slate-900 font-sans mr-2">
                    ₹
                  </span>
                  <span className="text-base font-black font-mono tracking-tight text-slate-950 min-w-[130px] text-right">
                    {formattedFigures}
                  </span>
                </div>
              </div>
            </div>

            {/* Signatory Section (Bottom Right) */}
            <div className="flex items-end justify-between pt-2">
              {/* Memo Note */}
              <div className="text-[10px] text-slate-500 font-mono">
                {data.memo ? `Ref: ${data.memo}` : ''}
              </div>

              {/* Signature Box */}
              <div className="text-right pr-2">
                <div className="text-[10px] font-bold text-slate-800 font-sans uppercase">
                  {data.accountHolderName ? `For ${data.accountHolderName}` : 'AUTHORISED SIGNATORY'}
                </div>
                <div className="h-6 flex items-center justify-end text-[9px] text-slate-400 font-sans italic pt-2">
                  Please sign above this line
                </div>
              </div>
            </div>
          </div>

          {/* ================= BOTTOM EDUCATIONAL MICR BAND ================= */}
          <div
            className="absolute bottom-0 inset-x-0 h-9 bg-white border-t border-slate-300 flex items-center justify-center font-mono text-[11px] tracking-[0.2em] text-slate-800 px-4 print-exact"
            style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
          >
            <span className="text-slate-400 mr-2 text-[9px] font-sans font-bold">
              CTS SPECIMEN:
            </span>
            <span className="font-bold">
              ⑈ 123456 ⑈  560002015 ⑆  000123 ⑈  10
            </span>
            <span className="text-slate-400 ml-3 text-[8px] font-sans uppercase hidden sm:inline">
              NON-NEGOTIABLE EDUCATIONAL REFERENCE
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
