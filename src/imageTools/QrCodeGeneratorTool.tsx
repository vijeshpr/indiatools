import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  QrCode,
  ShieldCheck,
  Zap,
  Printer,
  Sparkles,
  Smartphone,
  CheckCircle2,
  Lock,
  Layers,
  Palette,
} from 'lucide-react'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import {
  QrType,
  UpiFormData,
  UrlFormData,
  WhatsAppFormData,
  WifiFormData,
  TextFormData,
  VCardFormData,
  QrStylingConfig,
  PosterConfig,
  DEFAULT_UPI_FORM,
  DEFAULT_URL_FORM,
  DEFAULT_WHATSAPP_FORM,
  DEFAULT_WIFI_FORM,
  DEFAULT_TEXT_FORM,
  DEFAULT_VCARD_FORM,
  DEFAULT_STYLING,
  DEFAULT_POSTER_CONFIG,
  buildQrPayload,
} from '../components/qrCode/QrCodeTypes'
import { QrCodeForm } from '../components/qrCode/QrCodeForm'
import { QrCodePreview } from '../components/qrCode/QrCodePreview'
import { QrCodeStandPoster } from '../components/qrCode/QrCodeStandPoster'

export const QrCodeGeneratorTool: React.FC = () => {
  const tool = getToolBySlug('qr-code-generator')!

  const [qrType, setQrType] = useState<QrType>('upi')
  const [upiData, setUpiData] = useState<UpiFormData>(DEFAULT_UPI_FORM)
  const [urlData, setUrlData] = useState<UrlFormData>(DEFAULT_URL_FORM)
  const [whatsappData, setWhatsappData] = useState<WhatsAppFormData>(DEFAULT_WHATSAPP_FORM)
  const [wifiData, setWifiData] = useState<WifiFormData>(DEFAULT_WIFI_FORM)
  const [textData, setTextData] = useState<TextFormData>(DEFAULT_TEXT_FORM)
  const [vcardData, setVcardData] = useState<VCardFormData>(DEFAULT_VCARD_FORM)
  const [config, setConfig] = useState<QrStylingConfig>(DEFAULT_STYLING)
  const [posterConfig, setPosterConfig] = useState<PosterConfig>(DEFAULT_POSTER_CONFIG)
  const [viewMode, setViewMode] = useState<'standard' | 'standee'>('standard')

  // Compute live standardized payload string
  const payload = useMemo(() => {
    return buildQrPayload(qrType, {
      upi: upiData,
      url: urlData,
      whatsapp: whatsappData,
      wifi: wifiData,
      text: textData,
      vcard: vcardData,
    })
  }, [qrType, upiData, urlData, whatsappData, wifiData, textData, vcardData])

  // Reset to default
  const handleReset = () => {
    setQrType('upi')
    setUpiData(DEFAULT_UPI_FORM)
    setUrlData(DEFAULT_URL_FORM)
    setWhatsappData(DEFAULT_WHATSAPP_FORM)
    setWifiData(DEFAULT_WIFI_FORM)
    setTextData(DEFAULT_TEXT_FORM)
    setVcardData(DEFAULT_VCARD_FORM)
    setConfig(DEFAULT_STYLING)
    setPosterConfig(DEFAULT_POSTER_CONFIG)
    setViewMode('standard')
  }

  return (
    <ToolPageLayout
      tool={tool}
      onReset={handleReset}
      maxWidthClass="max-w-6xl"
      customResultSummary={`Active QR Code Type: ${qrType.toUpperCase()} | Length: ${payload.length} chars`}
    >
      <div className="space-y-8">
        {/* Top Mode Switcher Bar */}
        <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-4 p-2 sm:p-2.5 rounded-2xl bg-white/80 dark:bg-zinc-900/70 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shadow-xs">
          <div className="flex items-center gap-2 p-1 bg-slate-100/80 dark:bg-zinc-800/80 rounded-xl w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setViewMode('standard')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                viewMode === 'standard'
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Standard QR Code Studio</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setViewMode('standee')
                if (qrType !== 'upi') setQrType('upi')
              }}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                viewMode === 'standee'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Merchant Counter Standee (A5 / A4)</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-600 text-white font-bold uppercase">
                Print
              </span>
            </button>
          </div>

          <div className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-2 pr-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% Client-Side • Zero Data Stored</span>
          </div>
        </div>

        {/* Feature Highlights Strip */}
        <div className="no-print grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/70 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-md">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">100% Client-Side</p>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">Zero backend storage or tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/70 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-md">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">NPCI UPI Compliant</p>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">Works with GPay, PhonePe, Paytm</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/70 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-white/10 backdrop-blur-md">
            <div className="w-9 h-9 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">Print-Ready Vector SVG & Standee</p>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">A5 Counter Stand + Full A4 Poster</p>
            </div>
          </div>
        </div>

        {/* View 1: Standard QR Studio Layout (Split View) */}
        {viewMode === 'standard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Form Section (7 cols) */}
            <div className="lg:col-span-7">
              <QrCodeForm
                qrType={qrType}
                setQrType={setQrType}
                upiData={upiData}
                setUpiData={setUpiData}
                urlData={urlData}
                setUrlData={setUrlData}
                whatsappData={whatsappData}
                setWhatsappData={setWhatsappData}
                wifiData={wifiData}
                setWifiData={setWifiData}
                textData={textData}
                setTextData={setTextData}
                vcardData={vcardData}
                setVcardData={setVcardData}
                config={config}
                setConfig={setConfig}
                onReset={handleReset}
              />
            </div>

            {/* Right Live Preview & Export Section (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <QrCodePreview
                payload={payload}
                config={config}
                qrType={qrType}
              />

              {qrType === 'upi' && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2">
                  <p className="text-xs font-bold text-amber-800 dark:text-amber-400">
                    Need an acrylic standee for your shop counter?
                  </p>
                  <button
                    type="button"
                    onClick={() => setViewMode('standee')}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Open Printable Merchant Standee Mode (A5 / A4)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* View 2: Dedicated Merchant Standee Poster View */}
        {viewMode === 'standee' && (
          <div className="space-y-6">
            <div className="no-print grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 bg-white/70 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                  <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-700 dark:text-zinc-300">
                    Standee Header Details
                  </h3>
                  <button
                    type="button"
                    onClick={() => setViewMode('standard')}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                  >
                    Back to QR Studio
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Shop / Merchant Name
                  </label>
                  <input
                    type="text"
                    value={upiData.payeeName}
                    onChange={(e) => setUpiData({ ...upiData, payeeName: e.target.value })}
                    placeholder="e.g. Sharma General Store"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    UPI ID (VPA)
                  </label>
                  <input
                    type="text"
                    value={upiData.upiId}
                    onChange={(e) => setUpiData({ ...upiData, upiId: e.target.value })}
                    placeholder="e.g. merchant@okaxis"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Registered Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={upiData.merchantPhone || ''}
                    onChange={(e) => setUpiData({ ...upiData, merchantPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Poster Subtitle / Tagline
                  </label>
                  <input
                    type="text"
                    value={posterConfig.tagline}
                    onChange={(e) => setPosterConfig({ ...posterConfig, tagline: e.target.value })}
                    placeholder="Scan & Pay with Any UPI App"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-xs"
                  />
                </div>
              </div>

              <div className="lg:col-span-7">
                <QrCodeStandPoster
                  payload={payload}
                  upiData={upiData}
                  config={config}
                  posterConfig={posterConfig}
                  setPosterConfig={setPosterConfig}
                />
              </div>
            </div>

            {/* In Print Mode, this is the only section rendered */}
            <div className="hidden print:block">
              <QrCodeStandPoster
                payload={payload}
                upiData={upiData}
                config={config}
                posterConfig={posterConfig}
                setPosterConfig={setPosterConfig}
              />
            </div>
          </div>
        )}

        {/* Best Practice & Technical Guidance Section */}
        <div className="mt-12 p-6 rounded-2xl bg-white/60 dark:bg-zinc-900/50 border border-slate-200/80 dark:border-zinc-800 backdrop-blur-sm space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                Indian Merchant & Print Guidelines for QR Codes
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Recommended practices for shop counters, table stands, and visiting cards
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-zinc-950/50 border border-slate-200/70 dark:border-zinc-800 space-y-2">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                1. High Contrast is Critical
              </span>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                Ensure dark dots against a light background. Reverse QR codes (light dots on black background) can be difficult for budget smartphone cameras to scan under harsh Indian sunlight.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-zinc-950/50 border border-slate-200/70 dark:border-zinc-800 space-y-2">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                2. Use Vector SVG for Flex Boards
              </span>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                If printing banners, acrylic stands, or sun-board cutouts, download the <strong>SVG format</strong>. Unlike bitmap PNGs, SVG scales infinitely without blurriness or pixelation.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-zinc-950/50 border border-slate-200/70 dark:border-zinc-800 space-y-2">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                3. Logo Error Correction
              </span>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                When adding your shop logo or brand icon, IndiaTools automatically sets the error correction to <strong>Level Q (25%)</strong> or <strong>H (30%)</strong>, allowing the code to be read even with parts covered.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
export default QrCodeGeneratorTool
