import React, { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Point } from '../../lib/scanner/types'

interface LoupeLensProps {
  isVisible: boolean
  centerPoint: Point // Point on the original full-res image
  sourceImage: HTMLImageElement | null
  viewportPos: { x: number; y: number } // CSS position in container
  zoom?: number
  size?: number
}

export const LoupeLens: React.FC<LoupeLensProps> = ({
  isVisible,
  centerPoint,
  sourceImage,
  viewportPos,
  zoom = 2.5,
  size = 120,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isVisible || !sourceImage || !canvasRef.current) return

    const canvas = canvasRef.current
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, size, size)

    // Save and clip to circle
    ctx.save()
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    ctx.clip()

    // Draw magnified image segment
    // Target coordinate (size/2, size/2) should map to centerPoint
    const sw = size / zoom
    const sh = size / zoom
    const sx = centerPoint.x - sw / 2
    const sy = centerPoint.y - sh / 2

    ctx.drawImage(
      sourceImage,
      sx,
      sy,
      sw,
      sh,
      0,
      0,
      size,
      size
    )

    // Draw crosshair reticle
    ctx.strokeStyle = '#10B981' // emerald-500
    ctx.lineWidth = 1.5
    ctx.beginPath()
    // Horizontal crosshair
    ctx.moveTo(0, size / 2)
    ctx.lineTo(size, size / 2)
    // Vertical crosshair
    ctx.moveTo(size / 2, 0)
    ctx.lineTo(size / 2, size)
    ctx.stroke()

    // Small center dot
    ctx.fillStyle = '#34D399'
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, 3, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }, [isVisible, centerPoint, sourceImage, zoom, size])

  if (!isVisible) return null

  // Position loupe offset slightly above pointer so user's finger/mouse does not cover it
  const offsetDistance = size * 0.75
  const top = viewportPos.y - offsetDistance - size / 2
  const left = viewportPos.x - size / 2

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.6 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        style={{
          position: 'absolute',
          top: Math.max(10, top),
          left: Math.max(10, left),
          width: size,
          height: size,
          pointerEvents: 'none',
          zIndex: 40,
        }}
        className="rounded-full shadow-2xl shadow-emerald-950/60 ring-2 ring-emerald-400 bg-slate-950 overflow-hidden flex flex-col items-center justify-center"
      >
        <canvas ref={canvasRef} className="w-full h-full rounded-full" />
        {/* Subpixel coordinate badge */}
        <div className="absolute bottom-1 px-2 py-0.5 rounded-full bg-slate-950/90 border border-emerald-500/40 text-[9px] font-mono text-emerald-300 font-bold shadow">
          {Math.round(centerPoint.x)}, {Math.round(centerPoint.y)}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
