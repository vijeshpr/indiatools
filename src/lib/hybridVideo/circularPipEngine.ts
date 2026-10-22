/**
 * IndiaTools — Hybrid Video Studio Circular PiP / Reaction Video Engine
 * High-performance browser-native HTML5 Canvas 2D Circular Masking & Compositing
 * 100% Client-Side with 0 external dependencies
 */

import type { PipPresetPosition, PipFitMode, CircularPipConfig } from './types.ts'

export interface DrawCircularVideoOptions {
  borderWidth?: number
  borderColor?: string
  shadowIntensity?: number
  shadowBlur?: number
  shadowOffsetX?: number
  shadowOffsetY?: number
  opacity?: number
  fitMode?: PipFitMode
  backgroundColor?: string
  scale?: number
  rotationDeg?: number
}

/**
 * Renders a video or image element inside a circular mask with clean aspect-ratio cover crop,
 * smooth external drop shadow, and anti-aliased border.
 * Guarantees zero leakage into subsequent Canvas operations.
 */
export function drawCircularVideo(
  ctx: CanvasRenderingContext2D,
  videoElement: HTMLVideoElement | HTMLImageElement | CanvasImageSource,
  x: number,
  y: number,
  radius: number,
  options: DrawCircularVideoOptions = {}
): void {
  if (!ctx || !videoElement || radius <= 0) return

  // Verify readyState for video elements to prevent canvas draw errors
  if ('readyState' in videoElement) {
    const vid = videoElement as HTMLVideoElement
    if (typeof vid.readyState === 'number' && vid.readyState < 1) {
      // Draw placeholder circle if video not ready
      drawCircularPlaceholder(ctx, x, y, radius, options)
      return
    }
  }

  // Extract source dimensions
  const sourceWidth =
    (videoElement as any).videoWidth ||
    (videoElement as any).naturalWidth ||
    (videoElement as any).width ||
    0
  const sourceHeight =
    (videoElement as any).videoHeight ||
    (videoElement as any).naturalHeight ||
    (videoElement as any).height ||
    0

  if (sourceWidth <= 0 || sourceHeight <= 0) {
    drawCircularPlaceholder(ctx, x, y, radius, options)
    return
  }

  // Save base canvas state
  ctx.save()

  // Apply master opacity
  const opacity = Math.max(0, Math.min(1, options.opacity ?? 1.0))
  ctx.globalAlpha *= opacity

  // 1. Draw smooth external drop shadow (drawn outside circular clip)
  const shadowIntensity = Math.max(0, Math.min(1, options.shadowIntensity ?? 0.45))
  if (shadowIntensity > 0) {
    ctx.save()
    ctx.shadowColor = `rgba(0, 0, 0, ${shadowIntensity.toFixed(3)})`
    ctx.shadowBlur = options.shadowBlur ?? 16
    ctx.shadowOffsetX = options.shadowOffsetX ?? 0
    ctx.shadowOffsetY = options.shadowOffsetY ?? 8
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fillStyle = options.backgroundColor || '#090A0F'
    ctx.fill()
    ctx.restore()
  }

  // 2. Circular Mask & Media Rendering
  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.clip()

  // Optional rotation around circle center
  if (options.rotationDeg && options.rotationDeg !== 0) {
    ctx.translate(x, y)
    ctx.rotate((options.rotationDeg * Math.PI) / 180)
    ctx.translate(-x, -y)
  }

  const fitMode = options.fitMode || 'cover'
  const diameter = radius * 2

  if (fitMode === 'cover') {
    // Aspect-ratio safe cover crop: Extract center square from landscape or portrait source
    const crop = calculateSourceCrop(sourceWidth, sourceHeight, 'cover')
    ctx.drawImage(
      videoElement,
      crop.sx,
      crop.sy,
      crop.sWidth,
      crop.sHeight,
      x - radius,
      y - radius,
      diameter,
      diameter
    )
  } else {
    // Contain mode: whole video visible inside circle with background letterbox
    ctx.fillStyle = options.backgroundColor || '#090A0F'
    ctx.fillRect(x - radius, y - radius, diameter, diameter)

    const sourceAspect = sourceWidth / sourceHeight
    let drawW = diameter
    let drawH = diameter

    if (sourceAspect > 1.0) {
      drawH = diameter / sourceAspect
    } else {
      drawW = diameter * sourceAspect
    }

    const dx = x - drawW / 2
    const dy = y - drawH / 2

    ctx.drawImage(videoElement, 0, 0, sourceWidth, sourceHeight, dx, dy, drawW, drawH)
  }

  // Restore clipping state so other canvas layers are not affected
  ctx.restore()

  // 3. Clean border overlay on top of masked circle
  const borderWidth = options.borderWidth ?? 3.5
  if (borderWidth > 0) {
    ctx.save()
    ctx.strokeStyle = options.borderColor || '#FFFFFF'
    ctx.lineWidth = borderWidth
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }

  // Restore outer canvas state
  ctx.restore()
}

/**
 * Draw placeholder circle if video element is still loading
 */
function drawCircularPlaceholder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  options: DrawCircularVideoOptions
): void {
  ctx.save()
  const opacity = Math.max(0, Math.min(1, options.opacity ?? 1.0))
  ctx.globalAlpha *= opacity

  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = options.backgroundColor || '#111827'
  ctx.fill()

  const borderWidth = options.borderWidth ?? 3.5
  if (borderWidth > 0) {
    ctx.strokeStyle = options.borderColor || '#FFFFFF'
    ctx.lineWidth = borderWidth
    ctx.stroke()
  }
  ctx.restore()
}

/**
 * Calculates 1:1 square source crop coordinates for cover fit mode
 */
export function calculateSourceCrop(
  sourceWidth: number,
  sourceHeight: number,
  fitMode: PipFitMode = 'cover'
): { sx: number; sy: number; sWidth: number; sHeight: number } {
  if (fitMode === 'contain' || sourceWidth === sourceHeight) {
    return { sx: 0, sy: 0, sWidth: sourceWidth, sHeight: sourceHeight }
  }

  const sourceAspect = sourceWidth / sourceHeight
  let sx = 0
  let sy = 0
  let sWidth = sourceWidth
  let sHeight = sourceHeight

  if (sourceAspect > 1.0) {
    // Landscape source (e.g. 1920x1080): Crop left and right sides
    sWidth = sourceHeight
    sHeight = sourceHeight
    sx = (sourceWidth - sWidth) / 2
    sy = 0
  } else {
    // Portrait source (e.g. 1080x1920): Crop top and bottom
    sWidth = sourceWidth
    sHeight = sourceWidth
    sx = 0
    sy = (sourceHeight - sHeight) / 2
  }

  return { sx, sy, sWidth, sHeight }
}

/**
 * Calculates center (x, y) coordinates for preset and custom PiP positions
 */
export function calculatePipCenter(
  canvasWidth: number,
  canvasHeight: number,
  radius: number,
  preset: PipPresetPosition,
  offsetX = 0,
  offsetY = 0,
  margin = 48
): { x: number; y: number } {
  let cx = canvasWidth / 2
  let cy = canvasHeight / 2

  switch (preset) {
    case 'top-left':
      cx = margin + radius
      cy = margin + radius
      break

    case 'top-right':
      cx = canvasWidth - margin - radius
      cy = margin + radius
      break

    case 'bottom-left':
      cx = margin + radius
      cy = canvasHeight - margin - radius
      break

    case 'bottom-right':
      cx = canvasWidth - margin - radius
      cy = canvasHeight - margin - radius
      break

    case 'center':
    case 'custom':
    default:
      cx = canvasWidth / 2
      cy = canvasHeight / 2
      break
  }

  return {
    x: cx + offsetX,
    y: cy + offsetY,
  }
}
