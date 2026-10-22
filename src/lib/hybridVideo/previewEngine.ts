/**
 * IndiaTools — Multi-Layer Canvas 2D Preview & Composition Engine
 * Synchronously or asynchronously draws active clips, video frames, transforms, text, and effects
 */

import type {
  TimelineClip,
  Track,
  MediaAsset,
  ProjectSettings,
  FitMode,
} from './types.ts'
import { interpolateKeyframes } from './keyframeInterpolator.ts'
import { buildCssFilterString, applyProceduralEffects } from './effectsEngine.ts'
import { computeClipTransition } from './transitionsEngine.ts'
import { renderTextOverlay } from './textOverlayEngine.ts'

export interface RenderContext {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  settings: ProjectSettings
  tracks: Track[]
  clips: TimelineClip[]
  mediaAssets: Map<string, MediaAsset>
  videoElements: Map<string, HTMLVideoElement>
  imageElements: Map<string, HTMLImageElement>
}

export function drawCompositionFrame(
  renderCtx: RenderContext,
  playheadSec: number
): void {
  const { canvas, ctx, settings, tracks, clips, mediaAssets, videoElements, imageElements } = renderCtx
  const { width, height } = settings.dimensions

  // Ensure canvas internal buffer matches project dimensions
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
  }

  // Clear background
  ctx.save()
  ctx.fillStyle = settings.backgroundColor || '#090A0F'
  ctx.fillRect(0, 0, width, height)
  ctx.restore()

  // Track visibility filter
  const hiddenTrackIds = new Set(tracks.filter((t) => t.hidden).map((t) => t.id))

  // Find active clips at current playhead
  const activeClips = clips
    .filter((c) => {
      if (hiddenTrackIds.has(c.trackId)) return false
      return playheadSec >= c.startSec && playheadSec < c.startSec + c.durationSec
    })
    .sort((a, b) => {
      // Draw in order of tracks array (bottom track first, top overlay last)
      const aIndex = tracks.findIndex((t) => t.id === a.trackId)
      const bIndex = tracks.findIndex((t) => t.id === b.trackId)
      return aIndex - bIndex
    })

  if (activeClips.length === 0) {
    // Empty state: render subtle dark cinematic framing guidelines
    drawEmptyStateFrame(ctx, width, height)
    return
  }

  // Render each active clip
  for (const clip of activeClips) {
    const relTimeSec = playheadSec - clip.startSec

    // 1. Compute Keyframe Transform
    const interpolatedTransform = interpolateKeyframes(clip.transform, clip.keyframes, relTimeSec)

    // 2. Compute Transition state (in/out)
    const transitionState = computeClipTransition(
      clip.transitionIn,
      clip.transitionOut,
      relTimeSec,
      clip.durationSec,
      width
    )

    const finalOpacity = Math.max(0, Math.min(1, interpolatedTransform.opacity * transitionState.opacityMultiplier))
    if (finalOpacity <= 0.001) continue

    const finalScale = interpolatedTransform.scale * transitionState.scaleMultiplier
    const finalPosX = interpolatedTransform.x + transitionState.offsetX
    const finalPosY = interpolatedTransform.y + transitionState.offsetY

    // Render based on clip type
    if (clip.type === 'text' && clip.textProps) {
      renderTextOverlay(
        ctx,
        width,
        height,
        clip.textProps,
        relTimeSec,
        clip.durationSec,
        finalPosX,
        finalPosY,
        finalScale,
        interpolatedTransform.rotationDeg,
        finalOpacity
      )
    } else if ((clip.type === 'image' || clip.type === 'video') && clip.assetId) {
      const asset = mediaAssets.get(clip.assetId)
      if (!asset) continue

      let sourceDrawable: CanvasImageSource | null = null

      if (clip.type === 'image') {
        let img = imageElements.get(asset.id)
        if (!img) {
          img = new Image()
          img.crossOrigin = 'anonymous'
          img.src = asset.url
          imageElements.set(asset.id, img)
        }
        if (img.complete && img.naturalWidth > 0) {
          sourceDrawable = img
        }
      } else if (clip.type === 'video') {
        const vid = videoElements.get(clip.assetId)
        if (vid && vid.readyState >= 2) {
          // Sync video currentTime to clip's source offset
          const sourceTime = clip.trimStartSec + relTimeSec * clip.speed
          if (Math.abs(vid.currentTime - sourceTime) > 0.15) {
            vid.currentTime = Math.min(vid.duration || 9999, Math.max(0, sourceTime))
          }
          sourceDrawable = vid
        }
      }

      if (sourceDrawable) {
        drawMediaLayer(
          ctx,
          sourceDrawable,
          asset.naturalWidth,
          asset.naturalHeight,
          width,
          height,
          interpolatedTransform.fitMode,
          finalPosX,
          finalPosY,
          finalScale,
          interpolatedTransform.rotationDeg,
          finalOpacity,
          clip.effects,
          playheadSec
        )
      }
    }
  }
}

function drawMediaLayer(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  fitMode: FitMode,
  posX: number,
  posY: number,
  scale: number,
  rotationDeg: number,
  opacity: number,
  effects: import('./types.ts').ClipEffects,
  playheadSec: number
): void {
  ctx.save()

  // Apply CSS filters (exposure, contrast, saturation, temperature, LUT, blur)
  const filterStr = buildCssFilterString(effects)
  if (filterStr !== 'none') {
    ctx.filter = filterStr
  }

  ctx.globalAlpha = opacity

  // Determine source to destination mapping based on fitMode
  let drawW = canvasWidth
  let drawH = canvasHeight

  const sourceAspect = (sourceWidth || 16) / (sourceHeight || 9)
  const canvasAspect = canvasWidth / canvasHeight

  switch (fitMode) {
    case 'fit':
      if (sourceAspect > canvasAspect) {
        drawW = canvasWidth
        drawH = canvasWidth / sourceAspect
      } else {
        drawH = canvasHeight
        drawW = canvasHeight * sourceAspect
      }
      break

    case 'fill':
      if (sourceAspect > canvasAspect) {
        drawH = canvasHeight
        drawW = canvasHeight * sourceAspect
      } else {
        drawW = canvasWidth
        drawH = canvasWidth / sourceAspect
      }
      break

    case 'original':
      drawW = sourceWidth
      drawH = sourceHeight
      break

    case 'stretch':
      drawW = canvasWidth
      drawH = canvasHeight
      break
  }

  // Translate to center + custom offset
  const centerX = canvasWidth / 2 + posX
  const centerY = canvasHeight / 2 + posY

  ctx.translate(centerX, centerY)
  if (rotationDeg !== 0) {
    ctx.rotate((rotationDeg * Math.PI) / 180)
  }
  if (scale !== 1) {
    ctx.scale(scale, scale)
  }

  // Draw centered
  ctx.drawImage(source, -drawW / 2, -drawH / 2, drawW, drawH)

  // Reset transform & filter before procedural overlays
  ctx.restore()

  // Apply procedural vignette, film grain, or glow if enabled
  if (effects.enabled) {
    applyProceduralEffects(ctx, canvasWidth, canvasHeight, effects, playheadSec * 60)
  }
}

function drawEmptyStateFrame(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.save()

  // Cinematic dashed safe-area rectangle
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
  ctx.lineWidth = 1
  ctx.setLineDash([8, 8])
  ctx.strokeRect(width * 0.08, height * 0.08, width * 0.84, height * 0.84)
  ctx.setLineDash([])

  // Center subtle crosshair
  const cx = width / 2
  const cy = height / 2
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)'
  ctx.beginPath()
  ctx.moveTo(cx - 20, cy)
  ctx.lineTo(cx + 20, cy)
  ctx.moveTo(cx, cy - 20)
  ctx.lineTo(cx, cy + 20)
  ctx.stroke()

  ctx.restore()
}
