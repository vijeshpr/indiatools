import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Image as ImageIcon,
  Sparkles,
  Eye,
} from 'lucide-react'
import { BrushToolMode } from '../../lib/inpainting/types'
import { InpaintingTranslation } from '../../lib/inpainting/i18n'

interface Props {
  sourceImage: HTMLImageElement | null
  inpaintedImageData: ImageData | null
  maskCanvasRef: React.RefObject<HTMLCanvasElement | null>
  baseCanvasRef: React.RefObject<HTMLCanvasElement | null>
  toolMode: BrushToolMode
  brushRadius: number
  isShowingBefore: boolean
  isProcessing: boolean
  onStrokeComplete: () => void
  t: InpaintingTranslation
}

export const InpaintingCanvasViewport: React.FC<Props> = ({
  sourceImage,
  inpaintedImageData,
  maskCanvasRef,
  baseCanvasRef,
  toolMode,
  brushRadius,
  isShowingBefore,
  isProcessing,
  onStrokeComplete,
  t,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)

  // Initialize and render base canvas
  useEffect(() => {
    const baseCanvas = baseCanvasRef.current
    if (!baseCanvas || !sourceImage) return

    const width = sourceImage.naturalWidth
    const height = sourceImage.naturalHeight

    baseCanvas.width = width
    baseCanvas.height = height

    const ctx = baseCanvas.getContext('2d')
    if (!ctx) return

    if (inpaintedImageData && !isShowingBefore) {
      ctx.putImageData(inpaintedImageData, 0, 0)
    } else {
      ctx.drawImage(sourceImage, 0, 0, width, height)
    }
  }, [sourceImage, inpaintedImageData, isShowingBefore, baseCanvasRef])

  // Initialize mask canvas when source image changes
  useEffect(() => {
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas || !sourceImage) return

    // Only resize if dimensions differ to preserve current strokes
    if (
      maskCanvas.width !== sourceImage.naturalWidth ||
      maskCanvas.height !== sourceImage.naturalHeight
    ) {
      maskCanvas.width = sourceImage.naturalWidth
      maskCanvas.height = sourceImage.naturalHeight
      const ctx = maskCanvas.getContext('2d')
      if (ctx) ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height)
    }
  }, [sourceImage, maskCanvasRef])

  // Coordinate helper: translates viewport client coordinates to canvas pixel space
  const getCanvasCoordinates = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const maskCanvas = maskCanvasRef.current
      if (!maskCanvas) return { x: 0, y: 0 }

      const rect = maskCanvas.getBoundingClientRect()
      const scaleX = maskCanvas.width / rect.width
      const scaleY = maskCanvas.height / rect.height

      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top) * scaleY

      return { x, y }
    },
    [maskCanvasRef]
  )

  // Pointer Down
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isProcessing || !sourceImage) return
    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas) return

    maskCanvas.setPointerCapture(e.pointerId)
    setIsDrawing(true)

    const pt = getCanvasCoordinates(e)
    lastPointRef.current = pt

    const ctx = maskCanvas.getContext('2d')
    if (!ctx) return

    ctx.save()
    if (toolMode === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0,0,0,1)'
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'rgba(244, 63, 94, 0.55)'
    }

    ctx.beginPath()
    ctx.arc(pt.x, pt.y, brushRadius, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Update visual brush cursor position
    const container = containerRef.current
    if (container) {
      const cRect = container.getBoundingClientRect()
      setCursorPos({
        x: e.clientX - cRect.left,
        y: e.clientY - cRect.top,
      })
    }

    if (!isDrawing || isProcessing) return

    const maskCanvas = maskCanvasRef.current
    if (!maskCanvas) return

    const pt = getCanvasCoordinates(e)
    const last = lastPointRef.current || pt

    const ctx = maskCanvas.getContext('2d')
    if (!ctx) return

    ctx.save()
    if (toolMode === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.strokeStyle = 'rgba(0,0,0,1)'
      ctx.fillStyle = 'rgba(0,0,0,1)'
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.55)'
      ctx.fillStyle = 'rgba(244, 63, 94, 0.55)'
    }

    ctx.lineWidth = brushRadius * 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    ctx.moveTo(last.x, last.y)
    ctx.lineTo(pt.x, pt.y)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(pt.x, pt.y, brushRadius, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()

    lastPointRef.current = pt
  }

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    setIsDrawing(false)
    lastPointRef.current = null

    try {
      maskCanvasRef.current?.releasePointerCapture(e.pointerId)
    } catch {
      // Ignore pointer release error
    }

    onStrokeComplete()
  }

  // Pointer Leave
  const handlePointerLeave = () => {
    setCursorPos(null)
    if (isDrawing) {
      setIsDrawing(false)
      lastPointRef.current = null
      onStrokeComplete()
    }
  }

  return (
    <div className="flex flex-col h-full rounded-2xl bg-slate-950 border border-slate-800/80 shadow-2xl overflow-hidden select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-rose-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Inpainting Canvas</span>
          </div>

          {sourceImage && (
            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400 font-semibold">
                {sourceImage.naturalWidth} × {sourceImage.naturalHeight} px
              </span>
              {isShowingBefore ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 animate-pulse">
                  {t.showingBefore}
                </span>
              ) : inpaintedImageData ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  {t.showingAfter}
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* Viewport Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(0.4, Number((z - 0.15).toFixed(2))))}
            title="Zoom Out"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-slate-400 px-1.5 min-w-[36px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(2.5, Number((z + 0.15).toFixed(2))))}
            title="Zoom In"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(1)}
            title="Reset Zoom"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport with Brush Cursor Overlay */}
      <div
        ref={containerRef}
        onPointerLeave={handlePointerLeave}
        className="relative flex-1 min-h-[380px] md:min-h-[500px] max-h-[640px] bg-black flex items-center justify-center p-4 overflow-hidden relative cursor-none"
      >
        {/* Ambient Dark Grid Pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #f43f5e 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {sourceImage ? (
          <div
            className="relative transition-transform duration-100 ease-out origin-center shadow-2xl border border-slate-800/80 rounded-sm overflow-hidden"
            style={{
              transform: `scale(${zoomLevel})`,
            }}
          >
            {/* Base Layer: Original Image or Inpainted Result */}
            <canvas
              ref={baseCanvasRef}
              className="max-h-[560px] w-auto h-auto object-contain block mx-auto transition-opacity duration-300 ease-out"
            />

            {/* Overlay Layer: Interactive Mask Strokes */}
            <canvas
              ref={maskCanvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className={`absolute inset-0 w-full h-full object-contain touch-none ${
                isShowingBefore ? 'opacity-0 pointer-events-none' : 'opacity-100'
              } transition-opacity duration-200`}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 max-w-sm text-slate-500 z-10 cursor-default">
            <div className="w-16 h-16 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center mb-3 shadow-inner">
              <ImageIcon className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-sm font-medium text-slate-300 mb-1">
              {t.dropTitle}
            </p>
            <p className="text-xs text-slate-500">
              {t.dropSubtitle}
            </p>
          </div>
        )}

        {/* Custom Glowing Brush Cursor */}
        <AnimatePresence>
          {cursorPos && sourceImage && !isShowingBefore && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.08 }}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 z-50 flex items-center justify-center"
              style={{
                left: cursorPos.x,
                top: cursorPos.y,
                width: brushRadius * 2 * zoomLevel,
                height: brushRadius * 2 * zoomLevel,
              }}
            >
              {/* Outer soft glowing circle */}
              <div
                className={`w-full h-full rounded-full border-2 transition-colors ${
                  toolMode === 'eraser'
                    ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_12px_rgba(34,211,238,0.5)]'
                    : 'border-rose-400 bg-rose-500/25 shadow-[0_0_16px_rgba(244,63,94,0.6)]'
                }`}
              />
              {/* Center reticle dot */}
              <div
                className={`w-1.5 h-1.5 rounded-full absolute ${
                  toolMode === 'eraser' ? 'bg-cyan-300' : 'bg-rose-300'
                }`}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Soft Cross-fade white flash feedback when toggling Before/After */}
        {isShowingBefore && (
          <div className="pointer-events-none absolute top-4 left-4 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-amber-300 border border-amber-500/30 text-xs font-semibold backdrop-blur shadow-lg">
            <Eye className="w-3.5 h-3.5" />
            <span>{t.showingBefore}</span>
          </div>
        )}
      </div>
    </div>
  )
}
