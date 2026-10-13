import React, { useState, useRef, useEffect } from 'react'
import {
  WatermarkPayload,
  ImageExtractionResult,
} from '../../lib/watermarker/types'
import {
  embedImageWatermark,
  extractImageWatermark,
} from '../../lib/watermarker/imageWatermarkEngine'
import { WatermarkTranslation } from '../../lib/watermarker/i18n/translations'
import { ForensicDifferenceModal } from './ForensicDifferenceModal'
import {
  Image as ImageIcon,
  Upload,
  Download,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Eye,
  Sliders,
  Clock,
  Building,
  Key,
  User,
  Check,
} from 'lucide-react'

interface ImageWatermarkPanelProps {
  t: WatermarkTranslation
}

export const ImageWatermarkPanel: React.FC<ImageWatermarkPanelProps> = ({ t }) => {
  const [activeTab, setActiveTab] = useState<'embed' | 'extract'>('embed')

  // Form Metadata
  const [ownerId, setOwnerId] = useState('OFFICER-4402')
  const [organization, setOrganization] = useState('Govt Quality Assurance Cell')
  const [referenceKey, setReferenceKey] = useState('CERT-APPR-2026')
  const [customNote, setCustomNote] = useState('Original cryptographic proof')
  const [timestamp, setTimestamp] = useState<number>(Date.now())
  const [redundancyFactor, setRedundancyFactor] = useState<number>(2)

  // Image data references for embedding
  const [loadedImageSrc, setLoadedImageSrc] = useState<string | null>(null)
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(null)
  const [watermarkedImageData, setWatermarkedImageData] = useState<ImageData | null>(null)
  const [watermarkedUrl, setWatermarkedUrl] = useState<string | null>(null)
  const [imageMeta, setImageMeta] = useState<{ width: number; height: number } | null>(null)

  // Forensic modal
  const [diffModalOpen, setDiffModalOpen] = useState(false)

  // Extraction state
  const [extractImageSrc, setExtractImageSrc] = useState<string | null>(null)
  const [extractionResult, setExtractionResult] = useState<ImageExtractionResult | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const extractInputRef = useRef<HTMLInputElement>(null)
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  // Helper to load image into ImageData
  const processImageFile = (file: File, isForExtraction = false) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(img, 0, 0)
        const imgData = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight)

        if (isForExtraction) {
          setExtractImageSrc(src)
          setExtractionResult(null)
          // Run extraction immediately or on button press
        } else {
          setLoadedImageSrc(src)
          setOriginalImageData(imgData)
          setWatermarkedImageData(null)
          setWatermarkedUrl(null)
          setImageMeta({ width: img.naturalWidth, height: img.naturalHeight })
        }
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  }

  // Generate Sample Document Certificate on Canvas
  const loadSampleDocument = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 400
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 600, 400)
    grad.addColorStop(0, '#0f172a')
    grad.addColorStop(1, '#1e293b')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 600, 400)

    // Border
    ctx.strokeStyle = '#38bdf8'
    ctx.lineWidth = 4
    ctx.strokeRect(20, 20, 560, 360)

    // Certificate text
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 22px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText('OFFICIAL CLEARANCE CERTIFICATE', 300, 80)

    ctx.fillStyle = '#94a3b8'
    ctx.font = '14px system-ui'
    ctx.fillText('GOVERNMENT OF INDIA — DIGITAL IDENTITY CELL', 300, 115)

    ctx.fillStyle = '#38bdf8'
    ctx.font = 'bold 16px monospace'
    ctx.fillText('DOCUMENT SERIAL: IN-2026-99402-A', 300, 160)

    ctx.fillStyle = '#cbd5e1'
    ctx.font = '13px system-ui'
    ctx.fillText('This document certifies authentic verification of digital records.', 300, 210)
    ctx.fillText('Issued under statutory regulatory authorities of India.', 300, 235)

    ctx.fillStyle = '#10b981'
    ctx.font = 'bold 13px monospace'
    ctx.fillText('VERIFIED AUTHENTIC — ZERO TAMPERING DETECTED', 300, 300)

    const imgData = ctx.getImageData(0, 0, 600, 400)
    setLoadedImageSrc(canvas.toDataURL('image/png'))
    setOriginalImageData(imgData)
    setWatermarkedImageData(null)
    setWatermarkedUrl(null)
    setImageMeta({ width: 600, height: 400 })
  }

  // Handle Embed Action
  const handleEmbedImage = () => {
    if (!originalImageData) return

    try {
      const payload: WatermarkPayload = {
        ownerId: ownerId.trim() || 'ANONYMOUS',
        organization: organization.trim() || 'GENERAL',
        referenceKey: referenceKey.trim() || 'REF-DEFAULT',
        timestamp: timestamp || Date.now(),
        customNote: customNote.trim() || undefined,
      }

      const watermarked = embedImageWatermark(originalImageData, payload, {
        bitsPerChannel: 1,
        redundancyFactor,
      })
      setWatermarkedImageData(watermarked)

      // Convert to blob URL for lossless download
      const canvas = document.createElement('canvas')
      canvas.width = watermarked.width
      canvas.height = watermarked.height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.putImageData(watermarked, 0, 0)
        setWatermarkedUrl(canvas.toDataURL('image/png'))
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to embed image watermark')
    }
  }

  // Handle Extraction Action
  const handleExtractImage = () => {
    if (!extractImageSrc) return
    setIsScanning(true)

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        setIsScanning(false)
        return
      }
      ctx.drawImage(img, 0, 0)
      const data = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight)
      const result = extractImageWatermark(data)
      setExtractionResult(result)
      setIsScanning(false)
    }
    img.src = extractImageSrc
  }

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex border-b border-slate-800 pb-3 gap-3">
        <button
          onClick={() => setActiveTab('embed')}
          className={`flex items-center gap-2 pb-2 px-3 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'embed'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{t.embedTab}</span>
        </button>

        <button
          onClick={() => setActiveTab('extract')}
          className={`flex items-center gap-2 pb-2 px-3 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'extract'
              ? 'border-emerald-400 text-emerald-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{t.extractTab}</span>
        </button>
      </div>

      {activeTab === 'embed' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Metadata Controls */}
          <div className="lg:col-span-5 space-y-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                <span>Document Image Attribution</span>
              </h3>
              <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                CRC32 Guarded
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.ownerId}</span>
              </label>
              <input
                type="text"
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                placeholder={t.ownerIdPlaceholder}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.org}</span>
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder={t.orgPlaceholder}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.refKey}</span>
              </label>
              <input
                type="text"
                value={referenceKey}
                onChange={(e) => setReferenceKey(e.target.value)}
                placeholder={t.refKeyPlaceholder}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.timestamp}</span>
                </label>
                <button
                  onClick={() => setTimestamp(Date.now())}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono underline"
                >
                  {t.useCurrentTime}
                </button>
              </div>
              <input
                type="text"
                value={new Date(timestamp).toUTCString()}
                readOnly
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.customNote}
              </label>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder={t.customNotePlaceholder}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            {/* Redundancy Factor Slider */}
            <div>
              <div className="flex items-center justify-between mb-1 text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Redundancy Tile Factor
                </span>
                <span className="font-mono text-cyan-300 font-bold">{redundancyFactor}x Tiles</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={redundancyFactor}
                onChange={(e) => setRedundancyFactor(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                Repeats the payload frame across the image raster to survive partial cropping
              </span>
            </div>

            <button
              onClick={handleEmbedImage}
              disabled={!originalImageData}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 ${
                originalImageData
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/20 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.embedBtn}</span>
            </button>
          </div>

          {/* Right Area: Image Canvas & Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 backdrop-blur-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 mb-4">
                <span className="text-xs font-bold text-slate-200">{t.uploadImage}</span>
                <button
                  onClick={loadSampleDocument}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium transition-colors"
                >
                  Load Sample Certificate
                </button>
              </div>

              {/* Upload Dropzone */}
              {!loadedImageSrc ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-8 text-center cursor-pointer transition-all bg-slate-950/50 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/tiff"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) processImageFile(e.target.files[0])
                    }}
                  />
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Click or drop image to watermark
                  </h4>
                  <p className="text-xs text-slate-500">{t.uploadHint}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-2 max-h-72">
                    <img
                      src={watermarkedUrl || loadedImageSrc}
                      alt="Watermarked preview"
                      className="max-h-64 max-w-full object-contain rounded-lg shadow"
                    />
                    {watermarkedUrl && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-cyan-500/90 text-slate-950 text-[10px] font-bold uppercase tracking-wider shadow">
                        LSB Watermarked
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 px-1">
                    {imageMeta && (
                      <span>
                        Dimensions: {imageMeta.width} × {imageMeta.height} px (
                        {(imageMeta.width * imageMeta.height).toLocaleString()} px capacity)
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setLoadedImageSrc(null)
                        setOriginalImageData(null)
                        setWatermarkedImageData(null)
                        setWatermarkedUrl(null)
                      }}
                      className="text-rose-400 hover:underline"
                    >
                      Change Image
                    </button>
                  </div>
                </div>
              )}

              {/* Watermarked Actions */}
              {watermarkedUrl && (
                <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={watermarkedUrl}
                    download={`watermarked_${ownerId.toLowerCase().replace(/\s+/g, '_')}.png`}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t.downloadPng}</span>
                  </a>

                  <button
                    onClick={() => setDiffModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs flex items-center gap-2 transition-colors border border-slate-700"
                  >
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span>{t.forensicDiagnostics}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Extraction View */
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Image Forensics & Digital Watermark Scanner</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Upload an image to scan pixel LSB bitplanes for sync preambles and verified cryptographic checksums
                </p>
              </div>
            </div>

            {!extractImageSrc ? (
              <div
                onClick={() => extractInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-8 text-center cursor-pointer transition-all bg-slate-950/50 group mb-4"
              >
                <input
                  ref={extractInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/tiff"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) processImageFile(e.target.files[0], true)
                  }}
                />
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  Upload image to trace copyright & signatory
                </h4>
                <p className="text-xs text-slate-500">
                  Lossless PNG images provide 100% extraction accuracy
                </p>
              </div>
            ) : (
              <div className="mb-4">
                <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-2 max-h-60 mb-3">
                  <img
                    src={extractImageSrc}
                    alt="Inspection image"
                    className="max-h-56 max-w-full object-contain rounded-lg shadow"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      setExtractImageSrc(null)
                      setExtractionResult(null)
                    }}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Select different image
                  </button>

                  <button
                    onClick={handleExtractImage}
                    disabled={isScanning}
                    className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>{isScanning ? 'Scanning Raster...' : t.extractBtn}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Extraction Result Card */}
          {extractionResult && (
            <div
              className={`p-6 rounded-3xl border animate-in fade-in duration-200 ${
                extractionResult.success
                  ? 'bg-emerald-950/20 border-emerald-500/40 shadow-xl shadow-emerald-500/5'
                  : 'bg-rose-950/20 border-rose-500/40 shadow-xl shadow-rose-500/5'
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-2xl border ${
                      extractionResult.success
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    }`}
                  >
                    {extractionResult.success ? (
                      <ShieldCheck className="w-6 h-6" />
                    ) : (
                      <AlertTriangle className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      {extractionResult.success ? t.verifiedBadge : t.tamperedBadge}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {extractionResult.success
                        ? 'Authenticated watermark bitstream recovered with 100% CRC32 integrity match'
                        : extractionResult.error || t.noWatermark}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Confidence Score</span>
                  <span
                    className={`font-mono text-lg font-bold ${
                      extractionResult.confidenceScore === 100
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {extractionResult.confidenceScore}%
                  </span>
                </div>
              </div>

              {extractionResult.payload && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">
                      {t.ownerId}
                    </span>
                    <span className="text-sm font-bold text-white font-mono break-all">
                      {extractionResult.payload.ownerId}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">
                      {t.org}
                    </span>
                    <span className="text-sm font-semibold text-slate-200 truncate block">
                      {extractionResult.payload.organization}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">
                      {t.refKey}
                    </span>
                    <span className="text-sm font-bold text-cyan-300 font-mono break-all">
                      {extractionResult.payload.referenceKey}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">
                      {t.timestamp}
                    </span>
                    <span className="text-xs font-mono text-slate-300">
                      {new Date(extractionResult.payload.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {extractionResult.payload?.customNote && (
                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-300 mb-3">
                  <span className="font-semibold text-slate-400 mr-2">Custom Audit Note:</span>
                  {extractionResult.payload.customNote}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/60">
                <div className="flex items-center gap-4">
                  <span>
                    Examined Pixels:{' '}
                    <strong className="text-slate-200">
                      {extractionResult.totalPixelsExamined.toLocaleString()}
                    </strong>
                  </span>
                  <span>
                    CRC32 Status:{' '}
                    <strong
                      className={
                        extractionResult.crcValid ? 'text-emerald-400' : 'text-rose-400'
                      }
                    >
                      {extractionResult.crcValid ? 'VERIFIED MATCH' : 'FAILED'}
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Forensic Difference Map Modal */}
      <ForensicDifferenceModal
        isOpen={diffModalOpen}
        onClose={() => setDiffModalOpen(false)}
        originalImageData={originalImageData}
        watermarkedImageData={watermarkedImageData}
      />
    </div>
  )
}
