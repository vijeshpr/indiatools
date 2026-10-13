import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { UploadCloud } from 'lucide-react'
import {
  BrushToolMode,
  InpaintingProgress,
} from '../../lib/inpainting/types'
import { runTeleaInpainting } from '../../lib/inpainting/teleaInpainter'
import { MaskHistoryManager } from '../../lib/inpainting/historyStack'
import { InpaintingCanvasViewport } from './InpaintingCanvasViewport'
import { InpaintingToolbar } from './InpaintingToolbar'
import { InpaintingActionBar } from './InpaintingActionBar'
import { InpaintingTranslation } from '../../lib/inpainting/i18n'

interface Props {
  t: InpaintingTranslation
}

export const InpaintingWorkspace: React.FC<Props> = ({ t }) => {
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null)
  const [originalFileName, setOriginalFileName] = useState<string>('photo')
  const [inpaintedImageData, setInpaintedImageData] = useState<ImageData | null>(null)

  const [toolMode, setToolMode] = useState<BrushToolMode>('brush')
  const [brushRadius, setBrushRadius] = useState<number>(24)

  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [progress, setProgress] = useState<InpaintingProgress | null>(null)
  const [isShowingBefore, setIsShowingBefore] = useState<boolean>(false)
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false)

  // Undo / Redo History Stack
  const historyManagerRef = useRef<MaskHistoryManager>(new MaskHistoryManager(20))
  const [historyVersion, setHistoryVersion] = useState<number>(0)

  // Canvases
  const baseCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const objectUrlRef = useRef<string | null>(null)

  // Memory cleanup
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }
    }
  }, [])

  // Handle image load
  const handleLoadImageFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
    }

    const url = URL.createObjectURL(file)
    objectUrlRef.current = url

    const img = new Image()
    img.onload = () => {
      setSourceImage(img)
      setOriginalFileName(file.name.replace(/\.[^/.]+$/, ''))
      setInpaintedImageData(null)
      setIsShowingBefore(false)
      historyManagerRef.current.clear()
      setHistoryVersion((v) => v + 1)
    }
    img.src = url
  }, [])

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLoadImageFile(e.dataTransfer.files[0])
    }
  }

  // Stroke completed -> snapshot into history stack
  const handleStrokeComplete = () => {
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas) return
    const ctx = maskCanvas.getContext('2d')
    if (!ctx) return

    const currentMask = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)
    historyManagerRef.current.push(currentMask)
    setHistoryVersion((v) => v + 1)
  }

  // Undo
  const handleUndo = () => {
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas) return
    const ctx = maskCanvas.getContext('2d')
    if (!ctx) return

    const currentMask = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)
    const prevMask = historyManagerRef.current.undo(currentMask)
    if (prevMask) {
      ctx.putImageData(prevMask, 0, 0)
      setHistoryVersion((v) => v + 1)
    }
  }

  // Redo
  const handleRedo = () => {
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas) return
    const ctx = maskCanvas.getContext('2d')
    if (!ctx) return

    const currentMask = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)
    const nextMask = historyManagerRef.current.redo(currentMask)
    if (nextMask) {
      ctx.putImageData(nextMask, 0, 0)
      setHistoryVersion((v) => v + 1)
    }
  }

  // Clear Mask
  const handleClearMask = () => {
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas) return
    const ctx = maskCanvas.getContext('2d')
    if (!ctx) return

    handleStrokeComplete() // save current state before clearing
    ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height)
    setHistoryVersion((v) => v + 1)
  }

  // Reset Photo
  const handleResetImage = () => {
    setSourceImage(null)
    setInpaintedImageData(null)
    setIsShowingBefore(false)
    historyManagerRef.current.clear()
    setHistoryVersion((v) => v + 1)
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }

  // Inpaint Trigger
  const handleStartInpaint = async () => {
    const baseCanvas = baseCanvasRef.current
    const maskCanvas = maskCanvasRef.current
    if (!baseCanvas || !maskCanvas || !sourceImage || isProcessing) return

    const baseCtx = baseCanvas.getContext('2d')
    const maskCtx = maskCanvas.getContext('2d')
    if (!baseCtx || !maskCtx) return

    try {
      setIsProcessing(true)
      setProgress({
        percent: 5,
        stage: 'analyzing',
        message: t.analyzingStatus,
      })

      // Extract current base image pixels and mask pixels
      const baseImageData = baseCtx.getImageData(0, 0, baseCanvas.width, baseCanvas.height)
      const maskImageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)

      const result = await runTeleaInpainting(
        baseImageData,
        maskImageData,
        4, // neighborhood radius
        (prog) => setProgress(prog)
      )

      setInpaintedImageData(result)
      setIsShowingBefore(false)

      // Clear the mask after successful inpainting
      maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height)
      historyManagerRef.current.clear()
      setHistoryVersion((v) => v + 1)

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#f43f5e', '#22d3ee', '#10b981'],
        })
      } catch {
        // Ignore confetti error
      }
    } finally {
      setIsProcessing(false)
      setProgress(null)
    }
  }

  // Download Trigger
  const handleDownload = (format: 'png' | 'jpeg') => {
    const baseCanvas = baseCanvasRef.current
    if (!baseCanvas) return

    const mime = format === 'png' ? 'image/png' : 'image/jpeg'
    const quality = format === 'jpeg' ? 0.95 : undefined
    const ext = format === 'png' ? 'png' : 'jpg'

    baseCanvas.toBlob(
      (blob) => {
        if (!blob) return
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.href = url
        link.download = `${originalFileName}_clean.${ext}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      },
      mime,
      quality
    )
  }

  const canUndo = historyManagerRef.current.canUndo
  const canRedo = historyManagerRef.current.canRedo
  const undoCount = historyManagerRef.current.undoCount

  return (
    <div className="space-y-6">
      {/* Upload Drop Zone (Shown when no image loaded) */}
      {!sourceImage && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-3xl p-8 md:p-12 text-center cursor-pointer transition-all duration-200 border-2 border-dashed ${
            isDraggingOver
              ? 'border-rose-400 bg-rose-500/10 shadow-[0_0_30px_rgba(244,63,94,0.25)] scale-[1.01]'
              : 'border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900/80 shadow-xl'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleLoadImageFile(e.target.files[0])
                e.target.value = ''
              }
            }}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center mb-4 shadow-inner border border-slate-800">
              <UploadCloud className="w-8 h-8 text-rose-400" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-1">
              {t.dropTitle}
            </h3>
            <p className="text-xs text-slate-400 mb-4 max-w-md">
              {t.dropSubtitle}
            </p>
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-bold text-xs border border-rose-500/30 transition-all shadow-sm"
            >
              {t.dropBrowse}
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Layout (When Image is Loaded) */}
      {sourceImage && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Viewport Column (8 Cols on Desktop) */}
          <div className="lg:col-span-8">
            <InpaintingCanvasViewport
              sourceImage={sourceImage}
              inpaintedImageData={inpaintedImageData}
              maskCanvasRef={maskCanvasRef}
              baseCanvasRef={baseCanvasRef}
              toolMode={toolMode}
              brushRadius={brushRadius}
              isShowingBefore={isShowingBefore}
              isProcessing={isProcessing}
              onStrokeComplete={handleStrokeComplete}
              t={t}
            />
          </div>

          {/* Tools & Actions Column (4 Cols on Desktop) */}
          <div className="lg:col-span-4 space-y-5">
            <InpaintingToolbar
              toolMode={toolMode}
              onChangeToolMode={setToolMode}
              brushRadius={brushRadius}
              onChangeBrushRadius={setBrushRadius}
              canUndo={canUndo}
              canRedo={canRedo}
              undoCount={undoCount}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onClearMask={handleClearMask}
              onResetImage={handleResetImage}
              isProcessing={isProcessing}
              hasImage={!!sourceImage}
              t={t}
            />

            <InpaintingActionBar
              hasImage={!!sourceImage}
              hasInpainted={!!inpaintedImageData}
              isProcessing={isProcessing}
              progress={progress}
              isShowingBefore={isShowingBefore}
              onToggleBeforeAfter={() => setIsShowingBefore((prev) => !prev)}
              onStartInpaint={handleStartInpaint}
              onDownload={handleDownload}
              t={t}
            />
          </div>
        </div>
      )}
    </div>
  )
}
