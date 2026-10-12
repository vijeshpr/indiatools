import React, { useState, useRef, useEffect } from 'react'
import {
  Upload,
  Download,
  Scissors,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  Palette,
  Loader2,
  Sliders,
  Grid,
} from 'lucide-react'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useToast } from '../components/common/Toast'
import { removeBackground } from '@imgly/background-removal'

// Preview background modes for inspecting edge accuracy
type PreviewBgMode = 'checkerboard' | 'white' | 'black' | 'custom'

// Background color preset
interface ColorPreset {
  id: string
  label: string
  value: string
  border?: string
}

const COLOR_PRESETS: ColorPreset[] = [
  { id: 'transparent', label: 'Transparent', value: 'transparent' },
  { id: 'white', label: 'Pure White', value: '#FFFFFF', border: 'border-slate-300' },
  { id: 'offwhite', label: 'Off White', value: '#F8FAFC' },
  { id: 'black', label: 'Jet Black', value: '#000000' },
  { id: 'navy', label: 'Midnight Navy', value: '#0F172A' },
  { id: 'blue', label: 'Studio Blue', value: '#0284C7' },
  { id: 'cyan', label: 'Cyan Glow', value: '#06B6D4' },
  { id: 'emerald', label: 'Emerald Green', value: '#059669' },
  { id: 'purple', label: 'Vibrant Purple', value: '#7C3AED' },
  { id: 'amber', label: 'Warm Amber', value: '#D97706' },
]

export const ClearCutTool: React.FC = () => {
  const tool = getToolBySlug('clearcut-ai')!
  const { showToast } = useToast()

  // Source image
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null)
  const [sourceFile, setSourceFile] = useState<File | Blob | null>(null)
  const [sourceFileName, setSourceFileName] = useState<string>('')
  const [sourceSizeKb, setSourceSizeKb] = useState<number>(0)

  // AI Pipeline states
  const [progress, setProgress] = useState<number>(0)
  const [statusStep, setStatusStep] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [hasProcessed, setHasProcessed] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Output image
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null)
  const [outputImageUrl, setOutputImageUrl] = useState<string | null>(null)
  const [cutoutImage, setCutoutImage] = useState<HTMLImageElement | null>(null)

  // Edge Inspection Preview Mode
  const [previewBgMode, setPreviewBgMode] = useState<PreviewBgMode>('checkerboard')

  // Background color customization
  const [selectedBgColor, setSelectedBgColor] = useState<string>('transparent')
  const [customColor, setCustomColor] = useState<string>('#FFFFFF')

  // UI Interactive Comparison Slider
  const [sliderPosition, setSliderPosition] = useState<number>(50) // percentage 0 to 100
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false)
  const [isDraggingUpload, setIsDraggingUpload] = useState<boolean>(false)

  // Canvas display ref
  const compositeCanvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sample portrait demo generator
  const handleLoadSample = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 1000
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 800, 1000)
    bgGrad.addColorStop(0, '#E2E8F0')
    bgGrad.addColorStop(1, '#94A3B8')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, 800, 1000)

    // Draw silhouette portrait figure with detailed hair strands for testing edge accuracy
    ctx.fillStyle = '#0F172A'
    // Head
    ctx.beginPath()
    ctx.arc(400, 380, 140, 0, Math.PI * 2)
    ctx.fill()
    // Shoulders
    ctx.beginPath()
    ctx.ellipse(400, 780, 280, 260, 0, 0, Math.PI * 2)
    ctx.fill()

    // Studio label
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 36px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Portrait Specimen', 400, 390)

    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], 'Portrait_Specimen_Demo.jpg', { type: 'image/jpeg' })
      const img = new Image()
      img.onload = () => {
        setSourceImage(img)
        setSourceFile(file)
        setSourceFileName('Portrait_Specimen_Demo.jpg')
        setSourceSizeKb(92)
        setHasProcessed(false)
        setOutputBlob(null)
        setOutputImageUrl(null)
        setCutoutImage(null)
        setErrorMessage(null)
      }
      img.src = canvas.toDataURL('image/jpeg', 0.95)
    }, 'image/jpeg', 0.95)
  }

  // Handle file select
  const handleFileChange = (file: File) => {
    setErrorMessage(null)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/bmp']
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Unsupported format. Please select a JPG, PNG, or WebP photo.')
      showToast('Unsupported format. Please select a JPG, PNG, or WebP photo.', 'error')
      return
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds 25 MB limit. Please choose a smaller photo.')
      showToast('File size exceeds 25 MB limit.', 'error')
      return
    }

    setSourceFile(file)
    setSourceFileName(file.name)
    setSourceSizeKb(Math.round(file.size / 1024))
    setHasProcessed(false)
    setOutputBlob(null)
    setOutputImageUrl(null)
    setCutoutImage(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setSourceImage(img)
      }
      img.onerror = () => {
        setErrorMessage('Failed to decode image data.')
        showToast('Failed to decode image.', 'error')
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  // AI Inference: Run State-of-the-art In-Browser Background Removal via @imgly/background-removal
  const handleRemoveBackground = async () => {
    if (!sourceFile && !sourceImage) return

    setIsProcessing(true)
    setProgress(15)
    setStatusStep('Loading AI model in browser...')
    setErrorMessage(null)

    try {
      // Determine image payload: file, blob, or sourceImage
      let imageInput: File | Blob | string
      if (sourceFile) {
        imageInput = sourceFile
      } else if (sourceImage) {
        imageInput = sourceImage.src
      } else {
        throw new Error('No valid source image provided.')
      }

      const blob = await removeBackground(imageInput, {
        progress: (key: string, current: number, total: number) => {
          // Provide real-time download and processing feedback with status steps
          const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 50
          setProgress(percent)

          if (key.includes('fetch')) {
            setStatusStep(`Loading AI model in browser... (${percent}%)`)
          } else if (key.includes('decode') || key.includes('inference')) {
            setStatusStep('Analyzing subject boundaries...')
          } else if (key.includes('mask') || key.includes('encode')) {
            setStatusStep('Generating transparent cutout...')
          } else {
            setStatusStep('Analyzing subject boundaries...')
          }
        },
        model: ('medium' as any), // 'isnet_fp16' (medium: balanced between precision and load speed)
        output: {
          format: 'image/png',
          quality: 1.0,
        },
      })

      setOutputBlob(blob)
      const resultUrl = URL.createObjectURL(blob)
      setOutputImageUrl(resultUrl)

      // Load resulting cutout image into an HTMLImageElement for canvas compositing
      const cutImg = new Image()
      cutImg.onload = () => {
        setCutoutImage(cutImg)
        setHasProcessed(true)
        showToast('Background removed successfully with state-of-the-art precision!', 'success')
      }
      cutImg.onerror = () => {
        throw new Error('Failed to render cutout PNG output.')
      }
      cutImg.src = resultUrl
    } catch (error: any) {
      console.error('BG Removal Error:', error)
      const msg = error?.message || 'Failed to remove background. Please try again.'
      setErrorMessage(msg)
      showToast('Background removal failed. Please check your network or image format.', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Composite compositeCanvas with chosen preview background or color replacement & comparison slider
  useEffect(() => {
    if (!compositeCanvasRef.current || !sourceImage) return

    const canvas = compositeCanvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = sourceImage.naturalWidth
    const h = sourceImage.naturalHeight

    canvas.width = w
    canvas.height = h

    ctx.clearRect(0, 0, w, h)

    if (hasProcessed && cutoutImage) {
      // Determine background fill for the processed side
      const activeColor =
        previewBgMode === 'white'
          ? '#FFFFFF'
          : previewBgMode === 'black'
          ? '#000000'
          : previewBgMode === 'custom'
          ? selectedBgColor === 'custom'
            ? customColor
            : selectedBgColor
          : 'transparent'

      // Draw background on processed portion (Right or Left side depending on split)
      // Here: Left side = original image (0 to splitX), Right side = processed cutout (splitX to w)
      const splitX = Math.round((w * sliderPosition) / 100)

      // Draw original on the entire canvas first
      ctx.drawImage(sourceImage, 0, 0, w, h)

      // Draw processed cutout on the right side with clipping
      ctx.save()
      ctx.beginPath()
      ctx.rect(splitX, 0, w - splitX, h)
      ctx.clip()

      // Fill background under cutout if not transparent
      if (activeColor !== 'transparent') {
        ctx.fillStyle = activeColor
        ctx.fillRect(splitX, 0, w - splitX, h)
      } else if (previewBgMode === 'checkerboard') {
        // Draw subtle checkerboard pattern in canvas clip
        const squareSize = 24
        for (let x = splitX; x < w; x += squareSize) {
          for (let y = 0; y < h; y += squareSize) {
            const isDark = (Math.floor(x / squareSize) + Math.floor(y / squareSize)) % 2 === 0
            ctx.fillStyle = isDark ? '#E2E8F0' : '#FFFFFF'
            ctx.fillRect(x, y, Math.min(squareSize, w - x), Math.min(squareSize, h - y))
          }
        }
      }

      ctx.drawImage(cutoutImage, 0, 0, w, h)
      ctx.restore()
    } else {
      ctx.drawImage(sourceImage, 0, 0, w, h)
    }
  }, [
    sourceImage,
    cutoutImage,
    hasProcessed,
    sliderPosition,
    previewBgMode,
    selectedBgColor,
    customColor,
  ])

  // Mouse / Touch handler for comparison slider
  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(pct)
  }

  // Download High-Res PNG (either pristine transparent cutout or composited custom background)
  const handleDownloadHighResPng = () => {
    if (!cutoutImage || !outputBlob) {
      showToast('Please remove background first.', 'info')
      return
    }

    const baseName = (sourceFileName || 'photo').replace(/\.[^/.]+$/, '')

    // If transparent or checkerboard, download the exact raw high-res cutout blob directly
    if (
      previewBgMode === 'checkerboard' ||
      (previewBgMode === 'custom' && selectedBgColor === 'transparent')
    ) {
      const url = URL.createObjectURL(outputBlob)
      const a = document.createElement('a')
      a.download = `${baseName}_ClearCut_Transparent.png`
      a.href = url
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showToast('High-Res Transparent PNG downloaded!', 'success')
      return
    }

    // Otherwise render full resolution onto a high-res canvas with the selected background
    const exportCanvas = document.createElement('canvas')
    exportCanvas.width = cutoutImage.naturalWidth || cutoutImage.width
    exportCanvas.height = cutoutImage.naturalHeight || cutoutImage.height
    const expCtx = exportCanvas.getContext('2d')
    if (!expCtx) return

    const activeColor =
      previewBgMode === 'white'
        ? '#FFFFFF'
        : previewBgMode === 'black'
        ? '#000000'
        : selectedBgColor === 'custom'
        ? customColor
        : selectedBgColor

    if (activeColor !== 'transparent') {
      expCtx.fillStyle = activeColor
      expCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
    }

    expCtx.drawImage(cutoutImage, 0, 0, exportCanvas.width, exportCanvas.height)

    exportCanvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.download = `${baseName}_ClearCut_HighRes.png`
      a.href = url
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showToast('High-Res PNG downloaded successfully!', 'success')
    }, 'image/png', 1.0)
  }

  return (
    <ToolPageLayout tool={tool} maxWidthClass="max-w-7xl">
      <div className="space-y-8">
        {/* Hero Atmospheric Header */}
        <div className="relative rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold tracking-wider uppercase">
                <Cpu className="w-3.5 h-3.5" />
                <span>WebAssembly & WebWorker AI</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                ClearCut AI — Background Remover
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                State-of-the-art neural background removal in your browser via WebAssembly.
                Smooth edge matting for portraits, hair, vehicles, and products with 100% client-side privacy.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {sourceImage ? (
                <button
                  type="button"
                  onClick={() => {
                    setSourceImage(null)
                    setSourceFile(null)
                    setOutputBlob(null)
                    setOutputImageUrl(null)
                    setCutoutImage(null)
                    setHasProcessed(false)
                    setProgress(0)
                    setStatusStep('')
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Upload New Photo</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-300 text-xs font-bold border border-cyan-500/40 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Try Sample Portrait Demo</span>
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

        {/* Upload Dropzone */}
        {!sourceImage ? (
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDraggingUpload(true)
            }}
            onDragLeave={() => setIsDraggingUpload(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDraggingUpload(false)
              const f = e.dataTransfer.files?.[0]
              if (f) handleFileChange(f)
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-10 sm:p-16 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-4 bg-slate-900/40 dark:bg-slate-950/40 ${
              isDraggingUpload
                ? 'border-cyan-500 bg-cyan-500/10 scale-[1.01]'
                : 'border-slate-300 dark:border-slate-800 hover:border-cyan-500/60 hover:bg-slate-900/60'
            }`}
          >
            <div className="w-18 h-18 rounded-3xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center shadow-lg border border-cyan-500/20">
              <Scissors className="w-9 h-9" />
            </div>

            <div className="space-y-1.5 max-w-md">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Drag & drop your photo to remove background
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Or click to browse from your device. Portraits, products, vehicles, and profile photos up to 25 MB.
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                100% In-Browser WASM • Zero Server Upload
              </span>
              <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                State-of-the-Art Neural Matting
              </span>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 w-full max-w-xs mt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleLoadSample()
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                <span>Load Sample Portrait Specimen</span>
              </button>
            </div>
          </div>
        ) : (
          /* Processing Stage & Results */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols: Interactive Visual Stage */}
            <div className="lg:col-span-8 space-y-4">
              {/* Stage Header */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                    {sourceFileName}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {sourceImage.naturalWidth} × {sourceImage.naturalHeight} px
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
                    {sourceSizeKb} KB
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {hasProcessed && (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Cutout Generated</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Toggle Preview Background Bar (Checkerboard, Solid White, Solid Black) */}
              {hasProcessed && (
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <Eye className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Inspect Edge Accuracy:</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewBgMode('checkerboard')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        previewBgMode === 'checkerboard'
                          ? 'bg-cyan-500 text-slate-950 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <span>Checkerboard</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewBgMode('white')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        previewBgMode === 'white'
                          ? 'bg-white text-slate-900 border-cyan-500 ring-2 ring-cyan-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full bg-white border border-slate-400 inline-block" />
                      <span>Solid White</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewBgMode('black')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                        previewBgMode === 'black'
                          ? 'bg-slate-950 text-white border-cyan-500 ring-2 ring-cyan-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full bg-slate-950 border border-slate-600 inline-block" />
                      <span>Solid Black</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Main Viewport Container */}
              <div
                ref={containerRef}
                onMouseDown={() => setIsDraggingSlider(true)}
                onMouseUp={() => setIsDraggingSlider(false)}
                onMouseMove={(e) => {
                  if (isDraggingSlider) handleSliderMove(e.clientX)
                }}
                onTouchMove={(e) => {
                  if (e.touches[0]) handleSliderMove(e.touches[0].clientX)
                }}
                className={`relative rounded-3xl border border-slate-200 dark:border-slate-800 min-h-[380px] sm:min-h-[500px] flex items-center justify-center p-4 overflow-hidden shadow-inner select-none cursor-ew-resize ${
                  previewBgMode === 'checkerboard'
                    ? 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] bg-slate-100 dark:bg-slate-950/80'
                    : previewBgMode === 'white'
                    ? 'bg-white'
                    : previewBgMode === 'black'
                    ? 'bg-black'
                    : 'bg-slate-900'
                }`}
              >
                {/* AI Loading State Overlay with Progress Steps */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-in fade-in">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center shadow-lg border border-cyan-500/30">
                      <Loader2 className="w-8 h-8 animate-spin" />
                    </div>

                    <div className="space-y-1.5 max-w-sm">
                      <h4 className="text-base font-bold text-white">
                        Client-Side Neural Matting
                      </h4>
                      <p className="text-xs text-cyan-400 font-medium">
                        {statusStep || 'Loading AI model in browser...'}
                      </p>
                    </div>

                    {/* Progress Bar & Status Feedback */}
                    <div className="w-full max-w-xs space-y-1.5">
                      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(5, progress)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>{statusStep}</span>
                        <span className="font-bold text-cyan-400">{progress}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Render Result Canvas */}
                <div className="relative max-h-[460px] flex items-center justify-center">
                  <canvas
                    ref={compositeCanvasRef}
                    className="max-h-[460px] max-w-full object-contain rounded-2xl shadow-xl"
                  />

                  {/* Interactive Before/After Split Line when processed */}
                  {hasProcessed && (
                    <div
                      className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] pointer-events-none z-20"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center text-xs font-black border border-slate-200">
                        ↔
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Slider instruction banner */}
              {hasProcessed && (
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2 font-mono">
                  <span>← Drag slider: Left = Original photo | Right = Clean Cutout</span>
                  <span>100% In-Browser Matting</span>
                </div>
              )}
            </div>

            {/* Right 4 Cols: Control Deck */}
            <div className="lg:col-span-4 space-y-4">
              {/* Primary AI Trigger Card */}
              {!hasProcessed ? (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                      Neural AI Background Removal
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      State-of-the-Art In-Browser Cutout
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Powered by the high-precision <span className="font-mono text-cyan-600 dark:text-cyan-400">@imgly/background-removal</span> neural network.
                      Produces ultra-smooth, clean masks without jagged edges or pixelated fringes.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveBackground}
                    disabled={isProcessing}
                    className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-300 hover:from-cyan-300 hover:to-indigo-200 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
                  >
                    <Scissors className="w-4 h-4" />
                    <span>Remove Background Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Post-Processing Background Customizer & Download */
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                  <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Background Color Replacement
                    </span>
                  </div>

                  {/* Preset Colors Grid */}
                  <div className="grid grid-cols-5 gap-2">
                    {COLOR_PRESETS.map((preset) => {
                      const isSelected = previewBgMode === 'custom' && selectedBgColor === preset.value
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setPreviewBgMode('custom')
                            setSelectedBgColor(preset.value)
                          }}
                          className={`h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                            preset.value === 'transparent'
                              ? 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:6px_6px] bg-slate-100 dark:bg-slate-800'
                              : ''
                          } ${isSelected ? 'ring-2 ring-cyan-500 ring-offset-2 dark:ring-offset-slate-900 scale-105' : 'hover:scale-102'} ${preset.border || 'border border-slate-200 dark:border-slate-700'}`}
                          style={preset.value !== 'transparent' ? { backgroundColor: preset.value } : {}}
                          title={preset.label}
                        >
                          {isSelected && (
                            <CheckCircle2
                              className={`w-4 h-4 ${
                                preset.value === '#FFFFFF' || preset.value === '#F8FAFC'
                                  ? 'text-slate-900'
                                  : 'text-white'
                              }`}
                            />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Custom Hex Color Picker */}
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Custom Color</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => {
                          setCustomColor(e.target.value)
                          setSelectedBgColor('custom')
                          setPreviewBgMode('custom')
                        }}
                        className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer"
                      />
                      <span className="font-mono text-slate-500 uppercase">{customColor}</span>
                    </div>
                  </div>

                  {/* Download High-Res PNG Button */}
                  <div className="pt-3 space-y-2">
                    <button
                      type="button"
                      onClick={handleDownloadHighResPng}
                      className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-300 hover:from-cyan-300 hover:to-indigo-200 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download High-Res PNG</span>
                    </button>
                    <p className="text-[11px] text-center text-slate-400 font-mono">
                      Export original resolution with lossless alpha transparency
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  )
}
