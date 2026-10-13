import React, { useState, useRef, useEffect } from 'react'
import confetti from 'canvas-confetti'
import {
  DocumentCorners,
  Point,
  CornerKey,
  ScanFilter,
  ExportFormat,
} from '../../lib/scanner/types'
import {
  computeTargetDimensions,
  warpPerspective,
} from '../../lib/scanner/homography'
import {
  detectDocumentCorners,
  createDefaultCorners,
} from '../../lib/scanner/cornerDetector'
import { applyScanFilter } from '../../lib/scanner/filterEngine'
import { canvasToPdfBlob } from '../../lib/scanner/pdfExport'
import { ScannerTranslation } from '../../lib/scanner/i18n'
import { CornerOverlay } from './CornerOverlay'
import { LoupeLens } from './LoupeLens'
import { FilterSelector } from './FilterSelector'
import { CameraCaptureModal } from './CameraCaptureModal'
import {
  Upload,
  Camera,
  Sparkles,
  RotateCcw,
  Crop,
  Download,
  FileText,
  Check,
  Zap,
  Sliders,
  Eye,
  FileCheck2,
} from 'lucide-react'

interface ScannerWorkspaceProps {
  t: ScannerTranslation
}

export const ScannerWorkspace: React.FC<ScannerWorkspaceProps> = ({ t }) => {
  // Image & Canvas state
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [imageDims, setImageDims] = useState<{ width: number; height: number } | null>(null)

  // Interactive Viewport Scaling
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: 600,
    height: 400,
  })

  // Corners state
  const [corners, setCorners] = useState<DocumentCorners | null>(null)
  const [isDetecting, setIsDetecting] = useState(false)

  // Loupe Lens state
  const [loupeVisible, setLoupeVisible] = useState(false)
  const [loupePoint, setLoupePoint] = useState<Point>({ x: 0, y: 0 })
  const [loupeClientPos, setLoupeClientPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  // Warped Result state
  const [isWarping, setIsWarping] = useState(false)
  const [warpedRawData, setWarpedRawData] = useState<ImageData | null>(null)
  const [filteredImageData, setFilteredImageData] = useState<ImageData | null>(null)
  const [activeFilter, setActiveFilter] = useState<ScanFilter>('magic-bw')
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf')
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  // Camera Modal state
  const [isCameraOpen, setIsCameraOpen] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const warpedCanvasRef = useRef<HTMLCanvasElement>(null)

  // Resize observer to scale viewport accurately
  useEffect(() => {
    if (!containerRef.current || !imageDims) return

    const updateSize = () => {
      if (!containerRef.current || !imageDims) return
      const maxW = containerRef.current.clientWidth || 600
      const maxH = 500 // bounded height for clean UI

      const aspect = imageDims.width / imageDims.height
      let targetW = maxW
      let targetH = maxW / aspect

      if (targetH > maxH) {
        targetH = maxH
        targetW = maxH * aspect
      }

      setContainerSize({
        width: Math.round(targetW),
        height: Math.round(targetH),
      })
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [imageDims])

  // Process chosen file
  const handleFileChosen = (file: File) => {
    setImageFile(file)
    setWarpedRawData(null)
    setFilteredImageData(null)
    setDownloadUrl(null)

    const url = URL.createObjectURL(file)
    setImageSrc(url)

    const img = new Image()
    img.onload = () => {
      setImageElement(img)
      setImageDims({ width: img.naturalWidth, height: img.naturalHeight })

      // Create initial corner boundaries
      const initial = createDefaultCorners(img.naturalWidth, img.naturalHeight)
      setCorners(initial)

      // Trigger automatic edge detection in background
      autoDetectPaper(img)
    }
    img.src = url
  }

  // Load realistic sample receipt or certificate photo
  const loadSampleDocument = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 900
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw dark wood table background
    ctx.fillStyle = '#1e1b18'
    ctx.fillRect(0, 0, 1200, 900)

    // Save and transform to draw an angled skewed white invoice
    ctx.save()
    ctx.translate(600, 450)
    ctx.rotate(-0.09) // slight angle
    ctx.translate(-600, -450)

    // Drop shadow
    ctx.fillStyle = 'rgba(0,0,0,0.5)'
    ctx.fillRect(260, 130, 680, 680)

    // White paper sheet with lighting gradient
    const paperGrad = ctx.createLinearGradient(250, 120, 930, 800)
    paperGrad.addColorStop(0, '#f8fafc')
    paperGrad.addColorStop(1, '#e2e8f0')
    ctx.fillStyle = paperGrad
    ctx.fillRect(250, 120, 680, 660)

    // Invoice Header
    ctx.fillStyle = '#0f172a'
    ctx.font = 'bold 30px system-ui'
    ctx.fillText('TAX INVOICE / RECEIPT', 300, 200)

    ctx.fillStyle = '#64748b'
    ctx.font = '16px monospace'
    ctx.fillText('INVOICE NO: INV-2026-984210', 300, 240)
    ctx.fillText('DATE: 14 OCTOBER 2026', 300, 270)

    // Items table
    ctx.fillStyle = '#334155'
    ctx.fillRect(300, 310, 580, 2)

    ctx.font = 'bold 15px system-ui'
    ctx.fillText('DESCRIPTION', 300, 340)
    ctx.fillText('QTY', 650, 340)
    ctx.fillText('TOTAL (INR)', 770, 340)

    ctx.fillRect(300, 360, 580, 1)

    ctx.font = '14px system-ui'
    ctx.fillText('Civil Engineering Consultation', 300, 400)
    ctx.fillText('1', 660, 400)
    ctx.fillText('Rs. 18,500.00', 770, 400)

    ctx.fillText('Structural Site Inspection Fee', 300, 440)
    ctx.fillText('2', 660, 440)
    ctx.fillText('Rs. 9,000.00', 770, 440)

    ctx.fillRect(300, 500, 580, 2)
    ctx.font = 'bold 18px system-ui'
    ctx.fillText('GRAND TOTAL: Rs. 27,500.00', 570, 540)

    // Stamp mark
    ctx.strokeStyle = '#0284c7'
    ctx.lineWidth = 3
    ctx.strokeRect(320, 590, 180, 70)
    ctx.fillStyle = '#0284c7'
    ctx.font = 'bold 16px monospace'
    ctx.fillText('VERIFIED PAID', 345, 632)

    ctx.restore()

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'sample_angled_receipt.jpg', {
          type: 'image/jpeg',
        })
        handleFileChosen(file)
      }
    })
  }

  // Automatic Edge Detection
  const autoDetectPaper = (img: HTMLImageElement) => {
    setIsDetecting(true)

    setTimeout(() => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.drawImage(img, 0, 0)
        const imgData = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight)

        const detected = detectDocumentCorners(imgData, 450)
        setCorners(detected)

        // Confetti burst on successful corner identification
        try {
          confetti({
            particleCount: 25,
            spread: 50,
            origin: { y: 0.6 },
            colors: ['#10B981', '#06B6D4', '#34D399'],
          })
        } catch {}
      } catch (err) {
        console.error('Detection error', err)
      } finally {
        setIsDetecting(false)
      }
    }, 120)
  }

  // Reset corners to default inset margin
  const handleResetCorners = () => {
    if (!imageDims) return
    setCorners(createDefaultCorners(imageDims.width, imageDims.height))
  }

  // Perform Homography Perspective Warp
  const handleProcessWarp = () => {
    if (!imageElement || !corners) return
    setIsWarping(true)

    setTimeout(() => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = imageElement.naturalWidth
        canvas.height = imageElement.naturalHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.drawImage(imageElement, 0, 0)
        const srcData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        const targetDims = computeTargetDimensions(corners)
        const warped = warpPerspective(
          srcData,
          corners,
          targetDims.width,
          targetDims.height
        )

        setWarpedRawData(warped)

        // Apply active filter
        const filtered = applyScanFilter(warped, activeFilter)
        setFilteredImageData(filtered)
        renderWarpedToCanvas(filtered)
      } catch (err) {
        console.error('Warp error', err)
        alert('Could not compute perspective warp for this quadrilateral.')
      } finally {
        setIsWarping(false)
      }
    }, 80)
  }

  // Render warped image data to visible canvas
  const renderWarpedToCanvas = (data: ImageData) => {
    if (!warpedCanvasRef.current) return
    const canvas = warpedCanvasRef.current
    canvas.width = data.width
    canvas.height = data.height
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.putImageData(data, 0, 0)
    }
  }

  // Handle filter change
  const handleFilterChange = (filter: ScanFilter) => {
    setActiveFilter(filter)
    if (!warpedRawData) return

    const filtered = applyScanFilter(warpedRawData, filter)
    setFilteredImageData(filtered)
    renderWarpedToCanvas(filtered)
  }

  // Handle Export / Download
  const handleDownload = async () => {
    if (!warpedCanvasRef.current) return

    const canvas = warpedCanvasRef.current
    const filename = `scanned_doc_${Date.now()}`

    if (exportFormat === 'pdf') {
      const blob = await canvasToPdfBlob(canvas)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}.pdf`
      a.click()
    } else {
      const mime = exportFormat === 'png' ? 'image/png' : 'image/jpeg'
      const ext = exportFormat === 'png' ? 'png' : 'jpg'
      const url = canvas.toDataURL(mime, 0.95)
      const a = document.createElement('a')
      a.href = url
      a.download = `${filename}.${ext}`
      a.click()
    }

    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 2500)
  }

  return (
    <div className="space-y-6">
      {/* Upload Drop Zone if no image is loaded */}
      {!imageSrc ? (
        <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-3xl p-8 sm:p-12 text-center transition-all bg-slate-950/60 backdrop-blur-xl group">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileChosen(e.target.files[0])
            }}
          />

          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/20 transition-all">
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white mb-2">
            {t.dropTitle}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
            {t.dropHint}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              Browse Photo
            </button>

            <button
              onClick={() => setIsCameraOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 font-semibold text-xs transition-colors"
            >
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>{t.openCamera}</span>
            </button>

            <button
              onClick={loadSampleDocument}
              className="px-4 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors"
            >
              Try Sample Receipt
            </button>
          </div>
        </div>
      ) : (
        /* Workspace Active: 2-Column Responsive Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Left/Center Viewport */}
          <div className="lg:col-span-8 space-y-3">
            <div className="relative rounded-3xl bg-black border border-slate-800/90 shadow-2xl overflow-hidden flex items-center justify-center min-h-[380px] p-2">
              {/* Scanline laser animation during detection or warping */}
              {(isDetecting || isWarping) && (
                <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] animate-pulse absolute top-0 left-0 transition-all duration-300 transform translate-y-[200px]" />
                </div>
              )}

              {!warpedRawData ? (
                /* Step 1: Corner Pin Adjustment Viewport */
                <div
                  ref={containerRef}
                  style={{
                    width: containerSize.width,
                    height: containerSize.height,
                  }}
                  className="relative select-none"
                >
                  <img
                    src={imageSrc}
                    alt="Document preview"
                    className="w-full h-full object-contain pointer-events-none rounded-xl"
                  />

                  {corners && imageDims && (
                    <CornerOverlay
                      corners={corners}
                      imageWidth={imageDims.width}
                      imageHeight={imageDims.height}
                      containerWidth={containerSize.width}
                      containerHeight={containerSize.height}
                      onCornersChange={setCorners}
                      onDragStart={(key, screenPos, imgPos) => {
                        setLoupePoint(imgPos)
                        setLoupeClientPos(screenPos)
                        setLoupeVisible(true)
                      }}
                      onDragMove={(key, screenPos, imgPos) => {
                        setLoupePoint(imgPos)
                        setLoupeClientPos(screenPos)
                      }}
                      onDragEnd={() => setLoupeVisible(false)}
                    />
                  )}

                  {/* Magnified Loupe Lens */}
                  <LoupeLens
                    isVisible={loupeVisible}
                    centerPoint={loupePoint}
                    sourceImage={imageElement}
                    viewportPos={loupeClientPos}
                    zoom={2.5}
                    size={110}
                  />
                </div>
              ) : (
                /* Step 2: Warped Rectangular Document Canvas */
                <div className="p-3 flex items-center justify-center max-w-full max-h-[520px] overflow-auto">
                  <canvas
                    ref={warpedCanvasRef}
                    className="max-h-[480px] max-w-full rounded-lg shadow-2xl object-contain border border-slate-800"
                  />
                </div>
              )}
            </div>

            {/* Viewport Subtitle & Instruction */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 px-2">
              <span>
                {!warpedRawData
                  ? t.adjustCorners
                  : `Straightened Document: ${filteredImageData?.width} × ${filteredImageData?.height} px`}
              </span>

              {imageDims && !warpedRawData && (
                <span className="font-mono text-slate-500">
                  Original: {imageDims.width} × {imageDims.height} px
                </span>
              )}
            </div>
          </div>

          {/* Right Controls Panel */}
          <div className="lg:col-span-4 space-y-5 bg-slate-900/60 border border-slate-800 rounded-3xl p-5 backdrop-blur-sm">
            {!warpedRawData ? (
              /* Corner Pin Controls */
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    <Crop className="w-4 h-4 text-emerald-400" />
                    <span>Boundary Adjuster</span>
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Homography Ready
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => imageElement && autoDetectPaper(imageElement)}
                  disabled={isDetecting}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-500/10 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>{isDetecting ? t.detecting : t.autoDetect}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetCorners}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.resetCorners}</span>
                </button>

                {/* Perspective Warp Action Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleProcessWarp}
                    disabled={isWarping || !corners}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4" />
                    <span>{isWarping ? t.warping : t.processWarp}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Warped Output & Filter Enhancement Controls */
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    <span>{t.exportOptions}</span>
                  </h4>
                  <button
                    onClick={() => {
                      setWarpedRawData(null)
                      setFilteredImageData(null)
                    }}
                    className="text-[11px] text-emerald-400 hover:underline"
                  >
                    Adjust Corners
                  </button>
                </div>

                {/* Filter Selector */}
                <FilterSelector
                  activeFilter={activeFilter}
                  onFilterChange={handleFilterChange}
                  t={t}
                />

                {/* Export Format Selector */}
                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    File Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['pdf', 'png', 'jpeg'] as ExportFormat[]).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setExportFormat(fmt)}
                        className={`py-2 px-3 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                          exportFormat === fmt
                            ? 'bg-emerald-500 text-slate-950 shadow'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {fmt === 'jpeg' ? 'JPG' : fmt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Download Button */}
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {downloadSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Downloaded Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>
                        {exportFormat === 'pdf' ? t.downloadPdf : t.downloadImage}
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null)
                    setImageSrc(null)
                    setImageElement(null)
                    setWarpedRawData(null)
                    setFilteredImageData(null)
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{t.retake}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleFileChosen}
      />
    </div>
  )
}
