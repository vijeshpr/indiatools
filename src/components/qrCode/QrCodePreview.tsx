import React, { useEffect, useRef, useState } from 'react'
import QRCodeStyling, { Options } from 'qr-code-styling'
import {
  Download,
  Copy,
  Check,
  Sparkles,
  Smartphone,
  Eye,
  ShieldCheck,
  Maximize2,
  FileCode,
  Info,
  ChevronDown,
} from 'lucide-react'
import { QrStylingConfig, QrType, ExportResolution } from './QrCodeTypes'
import { useToast } from '../common/Toast'

interface QrCodePreviewProps {
  payload: string
  config: QrStylingConfig
  qrType: QrType
}

export const QrCodePreview: React.FC<QrCodePreviewProps> = ({
  payload,
  config,
  qrType,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const qrCodeRef = useRef<QRCodeStyling | null>(null)
  const toast = useToast()

  const [copied, setCopied] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [resolution, setResolution] = useState<ExportResolution>(1024)
  const [showPayloadModal, setShowPayloadModal] = useState(false)
  const [showResolutionMenu, setShowResolutionMenu] = useState(false)

  // Construct options for qr-code-styling
  const buildOptions = (size: number, drawType: 'canvas' | 'svg' = 'canvas'): Partial<Options> => {
    const isGradient = config.colorMode === 'gradient'

    return {
      width: size,
      height: size,
      type: drawType,
      data: payload || 'https://indiatools-rho.vercel.app',
      margin: config.qrMargin,
      image: config.logoUrl ? config.logoUrl : undefined,
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
        color: config.bgTransparent ? 'transparent' : config.bgColor,
      },
    }
  }

  // Initialize and update preview QR
  useEffect(() => {
    if (!containerRef.current) return

    const previewOptions = buildOptions(260, 'canvas')

    if (!qrCodeRef.current) {
      qrCodeRef.current = new QRCodeStyling(previewOptions)
      containerRef.current.innerHTML = ''
      qrCodeRef.current.append(containerRef.current)
    } else {
      qrCodeRef.current.update(previewOptions)
    }
  }, [payload, config])

  // Download high-resolution PNG or vector SVG
  const handleDownload = async (format: 'png' | 'svg', chosenResolution: ExportResolution = resolution) => {
    setIsExporting(true)
    setShowResolutionMenu(false)
    try {
      const exportOptions = buildOptions(
        format === 'svg' ? 1024 : chosenResolution,
        format === 'svg' ? 'svg' : 'canvas'
      )

      const exportInstance = new QRCodeStyling(exportOptions)
      const filename = `indiatools-qr-${qrType}-${chosenResolution}px`
      await exportInstance.download({
        name: filename,
        extension: format,
      })
      toast.showToast(`Downloaded QR Code (${format.toUpperCase()}) successfully!`, 'success')
    } catch (err) {
      console.error('QR Export error:', err)
      toast.showToast('Failed to export QR code. Please try again.', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  // Copy image directly to user clipboard
  const handleCopyImage = async () => {
    if (typeof ClipboardItem === 'undefined' || !navigator.clipboard) {
      toast.showToast('Clipboard image copy not supported in this browser.', 'error')
      return
    }

    setIsExporting(true)
    try {
      const exportOptions = buildOptions(1024, 'canvas')
      const exportInstance = new QRCodeStyling(exportOptions)
      const rawBlob = await exportInstance.getRawData('png')

      if (rawBlob && rawBlob instanceof Blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': rawBlob }),
        ])
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
        toast.showToast('QR Code image copied to clipboard!', 'success')
      } else {
        throw new Error('Blob conversion failed')
      }
    } catch (err) {
      console.error('Clipboard copy failed:', err)
      toast.showToast('Could not copy image to clipboard. Try downloading PNG.', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  // Copy raw payload text
  const handleCopyPayload = async () => {
    try {
      await navigator.clipboard.writeText(payload)
      toast.showToast('Raw QR payload string copied!', 'success')
    } catch {
      toast.showToast('Failed to copy string', 'error')
    }
  }

  // Scanability health assessment
  const isHighContrast = config.bgColor !== config.fgColor
  const hasLogo = Boolean(config.logoUrl)
  const isErrorCorrectionSafe = !hasLogo || ['Q', 'H'].includes(config.errorCorrection)

  return (
    <div className="sticky top-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/40">
      {/* Header with live badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
            Live Preview
          </span>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold uppercase">
          {qrType}
        </span>
      </div>

      {/* QR Canvas Presentation Container */}
      <div className="relative group mx-auto flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-zinc-950 dark:to-zinc-900 border border-slate-200/80 dark:border-zinc-800 transition-all duration-300">
        {/* Corner Targeting Brackets for aesthetic scan look */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-indigo-500/40 rounded-tl pointer-events-none" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-indigo-500/40 rounded-tr pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-indigo-500/40 rounded-bl pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-indigo-500/40 rounded-br pointer-events-none" />

        {/* The mounted Canvas container */}
        <div
          ref={containerRef}
          className="flex items-center justify-center rounded-xl overflow-hidden shadow-sm"
          style={{
            maxWidth: '100%',
            backgroundColor: config.bgTransparent ? 'transparent' : config.bgColor,
          }}
        />

        {/* Scanability notice indicator */}
        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>
            {isErrorCorrectionSafe
              ? '100% Client-side • High Scan Reliability'
              : 'Tip: Use Q or H error correction when using a logo'}
          </span>
        </div>
      </div>

      {/* Primary Actions: Download PNG & SVG */}
      <div className="mt-5 space-y-2.5">
        <div className="relative">
          <div className="grid grid-cols-[1fr_auto] gap-1.5">
            <button
              type="button"
              onClick={() => handleDownload('png', resolution)}
              disabled={isExporting}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG ({resolution}px)</span>
            </button>

            {/* Resolution Switcher Dropdown Trigger */}
            <button
              type="button"
              onClick={() => setShowResolutionMenu(!showResolutionMenu)}
              className="px-3 rounded-xl bg-indigo-50 dark:bg-zinc-800 border border-indigo-200 dark:border-zinc-700 text-indigo-700 dark:text-zinc-200 hover:bg-indigo-100 dark:hover:bg-zinc-700 flex items-center justify-center cursor-pointer transition-colors"
              title="Change Resolution"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showResolutionMenu ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Resolution Dropdown Menu */}
          {showResolutionMenu && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl shadow-2xl p-1.5 z-50">
              <span className="block px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                PNG Resolution
              </span>
              {([512, 1024, 2048] as ExportResolution[]).map((res) => (
                <button
                  key={res}
                  type="button"
                  onClick={() => {
                    setResolution(res)
                    setShowResolutionMenu(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg font-medium flex items-center justify-between transition-colors ${
                    resolution === res
                      ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-700/50'
                  }`}
                >
                  <span>{res} × {res} px</span>
                  {res === 2048 ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold">
                      Ultra HD
                    </span>
                  ) : res === 1024 ? (
                    <span className="text-[10px] text-slate-400">Standard</span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Web</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Secondary Action Row: Vector SVG & Copy to Clipboard */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDownload('svg')}
            disabled={isExporting}
            className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-zinc-800/80 hover:bg-slate-200 dark:hover:bg-zinc-700/80 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Download vector graphic for large print banners & shop boards"
          >
            <FileCode className="w-3.5 h-3.5 text-pink-500" />
            <span>Download SVG</span>
          </button>

          <button
            type="button"
            onClick={handleCopyImage}
            disabled={isExporting}
            className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-zinc-800/80 hover:bg-slate-200 dark:hover:bg-zinc-700/80 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-indigo-500" />
                <span>Copy Image</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Payload Inspection Drawer */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
          <button
            type="button"
            onClick={() => setShowPayloadModal(!showPayloadModal)}
            className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showPayloadModal ? 'Hide Encoded Text' : 'View Encoded Payload'}</span>
          </button>
          <button
            type="button"
            onClick={handleCopyPayload}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 text-[11px] font-mono underline"
          >
            Copy Text
          </button>
        </div>

        {showPayloadModal && (
          <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-zinc-800">
            <pre className="text-[11px] font-mono text-slate-700 dark:text-zinc-300 break-all whitespace-pre-wrap select-all">
              {payload}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
