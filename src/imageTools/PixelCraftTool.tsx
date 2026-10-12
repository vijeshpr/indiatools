import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  Download,
  RotateCw,
  RotateCcw,
  Sliders,
  Crop as CropIcon,
  Maximize2,
  Minimize2,
  RefreshCw,
  Undo2,
  Sun,
  Contrast,
  Sparkles,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileImage,
  ArrowRight,
  ShieldCheck,
  Scale,
} from 'lucide-react'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

type SupportedFormat = 'image/jpeg' | 'image/png' | 'image/webp'

interface ImageFilterState {
  brightness: number // -100 to 100
  contrast: number // -100 to 100
  saturation: number // -100 to 100
  grayscale: number // 0 to 100
}

interface CropBox {
  x: number // percentage 0-100
  y: number // percentage 0-100
  width: number // percentage 0-100
  height: number // percentage 0-100
}

const DEFAULT_FILTERS: ImageFilterState = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  grayscale: 0,
}

export const PixelCraftTool: React.FC = () => {
  const tool = getToolBySlug('pixelcraft')!

  // Source image state
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null)
  const [sourceFileName, setSourceFileName] = useState<string>('')
  const [sourceFileSizeKb, setSourceFileSizeKb] = useState<number>(0)
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 })

  // Active transforms
  const [rotation, setRotation] = useState<number>(0) // 0, 90, 180, 270
  const [filters, setFilters] = useState<ImageFilterState>(DEFAULT_FILTERS)
  const [targetWidth, setTargetWidth] = useState<number>(0)
  const [targetHeight, setTargetHeight] = useState<number>(0)
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true)
  const [aspectRatio, setAspectRatio] = useState<number>(1)
  const [resizePercent, setResizePercent] = useState<number>(100)

  // Export settings
  const [exportFormat, setExportFormat] = useState<SupportedFormat>('image/jpeg')
  const [exportQuality, setExportQuality] = useState<number>(90) // 1 to 100
  const [estimatedSizeKb, setEstimatedSizeKb] = useState<number>(0)

  // UI / Comparison states
  const [activeTab, setActiveTab] = useState<'adjust' | 'crop' | 'resize' | 'export'>('adjust')
  const [isComparing, setIsComparing] = useState<boolean>(false)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  // Crop Box state
  const [isCropping, setIsCropping] = useState<boolean>(false)
  const [cropBox, setCropBox] = useState<CropBox>({ x: 10, y: 10, width: 80, height: 80 })

  // Canvas refs
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load sample image
  const handleLoadSample = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 800
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Create a beautiful studio gradient demo
    const grad = ctx.createLinearGradient(0, 0, 1200, 800)
    grad.addColorStop(0, '#1E1B4B')
    grad.addColorStop(0.5, '#4338CA')
    grad.addColorStop(1, '#065F46')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 1200, 800)

    // Geometric studio patterns
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.beginPath()
    ctx.arc(600, 400, 320, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 54px system-ui, -apple-system, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('PixelCraft Studio Specimen', 600, 380)

    ctx.fillStyle = '#A5B4FC'
    ctx.font = '500 24px system-ui, -apple-system, sans-serif'
    ctx.fillText('1200 × 800 px • 100% Client-Side Canvas Test', 600, 430)

    const img = new Image()
    img.onload = () => {
      setSourceImage(img)
      setSourceFileName('PixelCraft_Studio_Demo.jpg')
      setSourceFileSizeKb(185)
      setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight })
      setTargetWidth(img.naturalWidth)
      setTargetHeight(img.naturalHeight)
      setAspectRatio(img.naturalWidth / img.naturalHeight)
      setRotation(0)
      setFilters(DEFAULT_FILTERS)
      setResizePercent(100)
    }
    img.src = canvas.toDataURL('image/jpeg', 0.95)
  }

  // Handle file upload
  const handleFileChange = (file: File) => {
    setErrorMessage(null)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/bmp']
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Unsupported format. Please select a JPG, PNG, WebP, or BMP image file.')
      return
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds 25 MB limit. Please select an image under 25 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setSourceImage(img)
        setSourceFileName(file.name)
        setSourceFileSizeKb(Math.round(file.size / 1024))
        setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight })
        setTargetWidth(img.naturalWidth)
        setTargetHeight(img.naturalHeight)
        setAspectRatio(img.naturalWidth / img.naturalHeight)
        setRotation(0)
        setFilters(DEFAULT_FILTERS)
        setResizePercent(100)
        setIsCropping(false)

        // Default export format matching file type if supported
        if (file.type === 'image/png' || file.type === 'image/webp') {
          setExportFormat(file.type as SupportedFormat)
        } else {
          setExportFormat('image/jpeg')
        }
      }
      img.onerror = () => {
        setErrorMessage('Failed to decode image data. The file may be corrupt or formatted improperly.')
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  // Width change handler with aspect ratio lock
  const handleWidthChange = (w: number) => {
    const cleanW = Math.max(1, Math.min(10000, Math.round(w)))
    setTargetWidth(cleanW)
    if (lockAspectRatio && aspectRatio > 0) {
      setTargetHeight(Math.max(1, Math.round(cleanW / aspectRatio)))
    }
    if (originalDimensions.width > 0) {
      setResizePercent(Math.round((cleanW / originalDimensions.width) * 100))
    }
  }

  // Height change handler with aspect ratio lock
  const handleHeightChange = (h: number) => {
    const cleanH = Math.max(1, Math.min(10000, Math.round(h)))
    setTargetHeight(cleanH)
    if (lockAspectRatio && aspectRatio > 0) {
      setTargetWidth(Math.max(1, Math.round(cleanH * aspectRatio)))
    }
    if (originalDimensions.height > 0) {
      setResizePercent(Math.round((cleanH / originalDimensions.height) * 100))
    }
  }

  // Percentage resize
  const handlePercentChange = (pct: number) => {
    const cleanPct = Math.max(5, Math.min(500, pct))
    setResizePercent(cleanPct)
    if (originalDimensions.width > 0 && originalDimensions.height > 0) {
      const nw = Math.max(1, Math.round((originalDimensions.width * cleanPct) / 100))
      const nh = Math.max(1, Math.round((originalDimensions.height * cleanPct) / 100))
      setTargetWidth(nw)
      setTargetHeight(nh)
    }
  }

  // Rotate 90 degrees
  const handleRotate = (dir: 'cw' | 'ccw') => {
    setRotation((prev) => {
      const next = dir === 'cw' ? (prev + 90) % 360 : (prev - 90 + 360) % 360
      return next
    })
  }

  // Apply Crop to current working image
  const handleApplyCrop = () => {
    if (!sourceImage) return

    const canvas = document.createElement('canvas')
    const naturalW = sourceImage.naturalWidth
    const naturalH = sourceImage.naturalHeight

    const cropX = Math.round((cropBox.x / 100) * naturalW)
    const cropY = Math.round((cropBox.y / 100) * naturalH)
    const cropW = Math.max(1, Math.round((cropBox.width / 100) * naturalW))
    const cropH = Math.max(1, Math.round((cropBox.height / 100) * naturalH))

    canvas.width = cropW
    canvas.height = cropH
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(sourceImage, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH)

    const croppedImg = new Image()
    croppedImg.onload = () => {
      setSourceImage(croppedImg)
      setOriginalDimensions({ width: cropW, height: cropH })
      setTargetWidth(cropW)
      setTargetHeight(cropH)
      setAspectRatio(cropW / cropH)
      setIsCropping(false)
      setCropBox({ x: 10, y: 10, width: 80, height: 80 })
    }
    croppedImg.src = canvas.toDataURL('image/png')
  }

  // Reset to original state
  const handleReset = () => {
    setRotation(0)
    setFilters(DEFAULT_FILTERS)
    if (sourceImage) {
      setTargetWidth(sourceImage.naturalWidth)
      setTargetHeight(sourceImage.naturalHeight)
      setResizePercent(100)
    }
    setIsCropping(false)
  }

  // Render pipeline on canvas
  const renderCanvas = useCallback(
    (canvas: HTMLCanvasElement, forExport = false) => {
      if (!sourceImage) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const isRotatedQuarter = rotation === 90 || rotation === 270
      const baseW = targetWidth || sourceImage.naturalWidth
      const baseH = targetHeight || sourceImage.naturalHeight

      // Width and height after rotation
      const renderW = isRotatedQuarter ? baseH : baseW
      const renderH = isRotatedQuarter ? baseW : baseH

      canvas.width = renderW
      canvas.height = renderH

      ctx.clearRect(0, 0, renderW, renderH)

      // CSS-style Canvas Filter String
      const bVal = 100 + filters.brightness
      const cVal = 100 + filters.contrast
      const sVal = 100 + filters.saturation
      const gVal = filters.grayscale

      ctx.filter = `brightness(${bVal}%) contrast(${cVal}%) saturate(${sVal}%) grayscale(${gVal}%)`

      ctx.save()
      // Center transformation
      ctx.translate(renderW / 2, renderH / 2)
      ctx.rotate((rotation * Math.PI) / 180)

      ctx.drawImage(
        sourceImage,
        -baseW / 2,
        -baseH / 2,
        baseW,
        baseH
      )

      ctx.restore()
    },
    [sourceImage, rotation, filters, targetWidth, targetHeight]
  )

  // Keep live preview updated
  useEffect(() => {
    if (previewCanvasRef.current && sourceImage) {
      renderCanvas(previewCanvasRef.current)

      // Update estimated size calculation
      const canvas = previewCanvasRef.current
      try {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setEstimatedSizeKb(Math.round(blob.size / 1024))
            }
          },
          exportFormat,
          exportQuality / 100
        )
      } catch {
        // Fallback
      }
    }
  }, [renderCanvas, sourceImage, exportFormat, exportQuality])

  // Download exported image
  const handleDownload = () => {
    if (!sourceImage) return

    setIsProcessing(true)
    const exportCanvas = document.createElement('canvas')
    renderCanvas(exportCanvas, true)

    exportCanvas.toBlob(
      (blob) => {
        setIsProcessing(false)
        if (!blob) return

        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        const ext = exportFormat === 'image/jpeg' ? 'jpg' : exportFormat === 'image/png' ? 'png' : 'webp'
        const baseName = sourceFileName.replace(/\.[^/.]+$/, '')
        a.download = `${baseName}_PixelCraft.${ext}`
        a.href = url
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      },
      exportFormat,
      exportQuality / 100
    )
  }

  return (
    <ToolPageLayout tool={tool} maxWidthClass="max-w-7xl">
      <div className="space-y-8">
        {/* Studio Atmospheric Header */}
        <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-mono font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Client-Side Canvas Studio</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                PixelCraft — Mini Photo Studio
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Crop, resize, rotate, filter, and convert images 100% locally on your device.
                High-precision HTML5 Canvas processing with zero server uploads and zero quality compromise.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {sourceImage ? (
                <>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Undo2 className="w-4 h-4" />
                    <span>Reset Edits</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Open New Image</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 text-xs font-bold border border-indigo-500/40 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Try Sample Studio Image</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/bmp"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFileChange(f)
          }}
          className="hidden"
        />

        {/* Main Workspace */}
        {!sourceImage ? (
          /* Empty / Upload Dropzone State */
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              const f = e.dataTransfer.files?.[0]
              if (f) handleFileChange(f)
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-10 sm:p-16 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-4 bg-slate-900/40 dark:bg-slate-950/40 ${
              isDragging
                ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
                : 'border-slate-300 dark:border-slate-800 hover:border-indigo-500/60 hover:bg-slate-900/60'
            }`}
          >
            <div className="w-18 h-18 rounded-3xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center shadow-lg border border-indigo-500/20">
              <Upload className="w-9 h-9" />
            </div>

            <div className="space-y-1.5 max-w-md">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Drag & drop your photo into the studio
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Or click to browse from your device. Supports JPG, PNG, WebP, AVIF & BMP up to 25 MB.
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Crop • Resize • Rotate • Filters
              </span>
              <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% In-Browser Privacy
              </span>
            </div>

            {/* Demo Button */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 w-full max-w-xs mt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleLoadSample()
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Load Sample Specimen Image</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Creative Studio Workbench */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols: Large Canvas Stage */}
            <div className="lg:col-span-8 space-y-4">
              {/* Canvas Toolbar Header */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                    {sourceFileName}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {targetWidth} × {targetHeight} px
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                    ~{estimatedSizeKb || sourceFileSizeKb} KB
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleRotate('ccw')}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    title="Rotate 90° Counter-Clockwise"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRotate('cw')}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    title="Rotate 90° Clockwise"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onMouseDown={() => setIsComparing(true)}
                    onMouseUp={() => setIsComparing(false)}
                    onTouchStart={() => setIsComparing(true)}
                    onTouchEnd={() => setIsComparing(false)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isComparing
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    }`}
                    title="Hold to view original unedited image"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Hold for Original</span>
                  </button>
                </div>
              </div>

              {/* Checkerboard Viewport */}
              <div className="relative rounded-3xl bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 min-h-[380px] sm:min-h-[500px] flex items-center justify-center p-4 overflow-hidden shadow-inner">
                {/* Hold to Compare View */}
                {isComparing ? (
                  <div className="relative max-h-[460px] flex items-center justify-center animate-in fade-in duration-100">
                    <img
                      src={sourceImage.src}
                      alt="Original"
                      className="max-h-[460px] max-w-full object-contain rounded-2xl shadow-xl"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-xs shadow-md">
                      ORIGINAL UNTOUCHED
                    </div>
                  </div>
                ) : (
                  /* Live Rendered Canvas */
                  <div className="relative max-h-[460px] flex items-center justify-center">
                    <canvas
                      ref={previewCanvasRef}
                      className="max-h-[460px] max-w-full object-contain rounded-2xl shadow-xl"
                    />

                    {/* Interactive Crop Overlay */}
                    {isCropping && (
                      <div
                        className="absolute inset-0 border-2 border-dashed border-indigo-400 bg-indigo-500/10 pointer-events-none rounded-xl"
                        style={{
                          left: `${cropBox.x}%`,
                          top: `${cropBox.y}%`,
                          width: `${cropBox.width}%`,
                          height: `${cropBox.height}%`,
                        }}
                      >
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-indigo-600 text-white font-mono text-[10px] font-bold">
                          Crop Region
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Crop Mode Controls Bar */}
              {isCropping && (
                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-indigo-900 dark:text-indigo-200 block">
                      Crop Framing Mode
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                      Select preset framing box to crop edges.
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCropBox({ x: 0, y: 0, width: 100, height: 100 })}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      Reset Frame
                    </button>
                    <button
                      type="button"
                      onClick={() => setCropBox({ x: 12.5, y: 12.5, width: 75, height: 75 })}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      1:1 Square
                    </button>
                    <button
                      type="button"
                      onClick={() => setCropBox({ x: 10, y: 15, width: 80, height: 60 })}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      4:3 Landscape
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyCrop}
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer shadow-sm"
                    >
                      Confirm Crop
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right 4 Cols: Creative Controls Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              {/* Studio Tabs Navigation */}
              <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('adjust')
                    setIsCropping(false)
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'adjust'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Adjust</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('resize')
                    setIsCropping(false)
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'resize'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Resize</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('crop')
                    setIsCropping(true)
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'crop'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <CropIcon className="w-3.5 h-3.5" />
                  <span>Crop</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('export')
                    setIsCropping(false)
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'export'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>

              {/* Tab Panel Content */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                {activeTab === 'adjust' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        Color & Tone Controls
                      </span>
                      <button
                        type="button"
                        onClick={() => setFilters(DEFAULT_FILTERS)}
                        className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        Reset Sliders
                      </button>
                    </div>

                    {/* Brightness */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                          <Sun className="w-3.5 h-3.5 text-amber-500" /> Brightness
                        </span>
                        <span className="font-mono text-slate-500">{filters.brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={filters.brightness}
                        onChange={(e) => setFilters({ ...filters, brightness: parseInt(e.target.value, 10) })}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                    </div>

                    {/* Contrast */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                          <Contrast className="w-3.5 h-3.5 text-indigo-500" /> Contrast
                        </span>
                        <span className="font-mono text-slate-500">{filters.contrast}%</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={filters.contrast}
                        onChange={(e) => setFilters({ ...filters, contrast: parseInt(e.target.value, 10) })}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                    </div>

                    {/* Saturation */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Saturation
                        </span>
                        <span className="font-mono text-slate-500">{filters.saturation}%</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={filters.saturation}
                        onChange={(e) => setFilters({ ...filters, saturation: parseInt(e.target.value, 10) })}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                    </div>

                    {/* Grayscale */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-slate-400" /> Grayscale B&W
                        </span>
                        <span className="font-mono text-slate-500">{filters.grayscale}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.grayscale}
                        onChange={(e) => setFilters({ ...filters, grayscale: parseInt(e.target.value, 10) })}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'resize' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        Dimensions & Scaling
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Original: {originalDimensions.width}×{originalDimensions.height}
                      </span>
                    </div>

                    {/* Pixel Dimensions Inputs */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Width (px)
                        </label>
                        <input
                          type="number"
                          value={targetWidth}
                          onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 0)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Height (px)
                        </label>
                        <input
                          type="number"
                          value={targetHeight}
                          onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 0)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Lock Aspect Ratio Toggle */}
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={lockAspectRatio}
                        onChange={(e) => setLockAspectRatio(e.target.checked)}
                        className="rounded accent-indigo-600 cursor-pointer"
                      />
                      <span>Lock Aspect Ratio (Maintain Proportions)</span>
                    </label>

                    {/* Percentage Scaling Slider */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 dark:text-slate-400">Scale Percentage</span>
                        <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{resizePercent}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="200"
                        value={resizePercent}
                        onChange={(e) => handlePercentChange(parseInt(e.target.value, 10))}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'crop' && (
                  <div className="space-y-4">
                    <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        Cropping & Framing
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Use the overlay handles on the stage to frame your image, or apply standard social/document presets below:
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setCropBox({ x: 10, y: 10, width: 80, height: 80 })}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-left cursor-pointer"
                      >
                        <span className="font-bold block text-slate-900 dark:text-white">1:1 Square</span>
                        <span className="text-[10px] text-slate-400 font-mono">Instagram & Avatars</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCropBox({ x: 15, y: 5, width: 70, height: 90 })}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-left cursor-pointer"
                      >
                        <span className="font-bold block text-slate-900 dark:text-white">3.5 × 4.5 cm</span>
                        <span className="text-[10px] text-slate-400 font-mono">Passport Ratio</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCropBox({ x: 5, y: 15, width: 90, height: 50 })}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-left cursor-pointer"
                      >
                        <span className="font-bold block text-slate-900 dark:text-white">16:9 Banner</span>
                        <span className="text-[10px] text-slate-400 font-mono">Widescreen</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCropBox({ x: 0, y: 0, width: 100, height: 100 })}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-left cursor-pointer"
                      >
                        <span className="font-bold block text-slate-900 dark:text-white">Full Frame</span>
                        <span className="text-[10px] text-slate-400 font-mono">Reset Boundary</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleApplyCrop}
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <CropIcon className="w-4 h-4" />
                      <span>Execute Crop</span>
                    </button>
                  </div>
                )}

                {activeTab === 'export' && (
                  <div className="space-y-4">
                    <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        Format & Compression
                      </span>
                    </div>

                    {/* Format Selector */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                        Target Export Format
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['image/jpeg', 'image/png', 'image/webp'] as SupportedFormat[]).map((fmt) => (
                          <button
                            key={fmt}
                            type="button"
                            onClick={() => setExportFormat(fmt)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              exportFormat === fmt
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {fmt === 'image/jpeg' ? 'JPG' : fmt === 'image/png' ? 'PNG' : 'WebP'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Compression Quality Slider (JPG / WebP only) */}
                    {exportFormat !== 'image/png' && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">Compression Quality</span>
                          <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{exportQuality}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={exportQuality}
                          onChange={(e) => setExportQuality(parseInt(e.target.value, 10))}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                          <span>Smaller Size</span>
                          <span>Maximum Quality</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Primary Action Button: Download Image */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isProcessing}
                    className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Processed Image</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  )
}
