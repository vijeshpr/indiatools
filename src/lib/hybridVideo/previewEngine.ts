/**
 * IndiaTools — Multi-Layer Canvas 2D Preview & Composition Engine
 * Synchronously or asynchronously draws active clips, video frames, transforms, text, and effects
 * Full parity with Export Engine + Deterministic Music Reactivity + 24 Transitions
 */

import type {
  TimelineClip,
  Track,
  MediaAsset,
  ProjectSettings,
  FitMode,
  MusicReactivityConfig,
} from './types.ts'
import { interpolateKeyframes } from './keyframeInterpolator.ts'
import { buildCssFilterString, applyProceduralEffects } from './effectsEngine.ts'
import { computeClipTransition, type TransitionState } from './transitionsEngine.ts'
import { renderTextOverlay } from './textOverlayEngine.ts'
import type { MusicAnalysisResult } from './musicIntelligence.ts'
import {
  computeMusicReactivityFrame,
  renderReactivityOverlays,
  type MusicReactivityResult,
} from './musicReactivityEngine.ts'
import {
  drawCircularVideo,
  calculatePipCenter,
} from './circularPipEngine.ts'

export { drawCircularVideo, calculatePipCenter } from './circularPipEngine.ts'

export interface RenderContext {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  settings: ProjectSettings
  tracks: Track[]
  clips: TimelineClip[]
  mediaAssets: Map<string, MediaAsset>
  videoElements: Map<string, HTMLVideoElement>
  imageElements: Map<string, HTMLImageElement>
  musicAnalysis?: MusicAnalysisResult | null
  musicReactivity?: MusicReactivityConfig | null
  selectedClipId?: string | null
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
      // 1. Text overlays always render on the very top
      if (a.type === 'text' && b.type !== 'text') return 1
      if (b.type === 'text' && a.type !== 'text') return -1

      // 2. PiP reaction clips render on top of non-PiP background media
      const aIsPip = !!(a.circularPip && a.circularPip.enabled)
      const bIsPip = !!(b.circularPip && b.circularPip.enabled)
      if (aIsPip !== bIsPip) {
        return aIsPip ? 1 : -1
      }

      // 3. Track order (bottom track first, overlay track last)
      const aIndex = tracks.findIndex((t) => t.id === a.trackId)
      const bIndex = tracks.findIndex((t) => t.id === b.trackId)
      return aIndex - bIndex
    })

  if (activeClips.length === 0) {
    // Empty state: render subtle dark cinematic framing guidelines
    drawEmptyStateFrame(ctx, width, height)
    return
  }

  let activeReactivityResult: MusicReactivityResult | null = null
  let activeTransitionFlash: { alpha: number; color: string } | null = null
  let activeFilmBurnAlpha = 0

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
      width,
      height
    )

    if (transitionState.flashAlpha > 0.02) {
      activeTransitionFlash = {
        alpha: transitionState.flashAlpha,
        color: transitionState.flashColor || '#ffffff',
      }
    }
    if (transitionState.filmBurnAlpha > 0.02) {
      activeFilmBurnAlpha = Math.max(activeFilmBurnAlpha, transitionState.filmBurnAlpha)
    }

    // 3. Compute Music Reactivity
    const globalReactivity = renderCtx.musicReactivity || settings.musicReactivity
    let clipReactivityConfig: MusicReactivityConfig | null | undefined = clip.musicReactivity
    if (!clipReactivityConfig || !clipReactivityConfig.enabled) {
      if (globalReactivity && globalReactivity.enabled) {
        if (globalReactivity.scope === 'selected') {
          clipReactivityConfig = clip.id === renderCtx.selectedClipId ? globalReactivity : null
        } else {
          clipReactivityConfig = globalReactivity
        }
      }
    }

    const reactivityResult = computeMusicReactivityFrame(
      clipReactivityConfig,
      playheadSec,
      relTimeSec,
      renderCtx.musicAnalysis,
      width,
      height
    )

    if (reactivityResult.hasActiveReaction) {
      activeReactivityResult = reactivityResult
    }

    const finalOpacity = Math.max(
      0,
      Math.min(1, interpolatedTransform.opacity * transitionState.opacityMultiplier)
    )
    if (finalOpacity <= 0.001) continue

    const finalScale =
      interpolatedTransform.scale * transitionState.scaleMultiplier * reactivityResult.deltaScale
    const finalPosX =
      interpolatedTransform.x + transitionState.offsetX + reactivityResult.deltaX
    const finalPosY =
      interpolatedTransform.y + transitionState.offsetY + reactivityResult.deltaY
    const finalRotation =
      interpolatedTransform.rotationDeg +
      transitionState.rotationDeg +
      reactivityResult.deltaRotationDeg

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
        finalRotation,
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
        if (clip.circularPip && clip.circularPip.enabled) {
          const shorterSide = Math.min(width, height)
          const pipSizePercent = clip.circularPip.sizePercent || 28
          const baseDiameter = shorterSide * (pipSizePercent / 100)
          const radius = Math.max(10, (baseDiameter / 2) * finalScale)

          const pipCenter = calculatePipCenter(
            width,
            height,
            radius,
            clip.circularPip.positionPreset || 'bottom-right',
            (clip.circularPip.offsetX || 0) + finalPosX,
            (clip.circularPip.offsetY || 0) + finalPosY,
            clip.circularPip.marginPx ?? 48
          )

          drawCircularVideo(ctx, sourceDrawable, pipCenter.x, pipCenter.y, radius, {
            borderWidth: clip.circularPip.borderWidth ?? 3.5,
            borderColor: clip.circularPip.borderColor || '#FFFFFF',
            shadowIntensity: clip.circularPip.shadowIntensity ?? 0.45,
            shadowBlur: clip.circularPip.shadowBlur ?? 16,
            shadowOffsetX: clip.circularPip.shadowOffsetX ?? 0,
            shadowOffsetY: clip.circularPip.shadowOffsetY ?? 8,
            opacity: finalOpacity * (clip.circularPip.opacity ?? 1.0),
            fitMode: clip.circularPip.fitMode || 'cover',
            rotationDeg: finalRotation,
          })
        } else {
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
            finalRotation,
            finalOpacity,
            clip.effects,
            playheadSec,
            transitionState,
            reactivityResult
          )
        }
      }
    }
  }

  // 4. Composition-level overlays: Film burn, Transition Flash, and Music Reactivity Overlays
  if (activeFilmBurnAlpha > 0.02) {
    ctx.save()
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, `rgba(249, 115, 22, ${(activeFilmBurnAlpha * 0.4).toFixed(3)})`)
    gradient.addColorStop(0.5, `rgba(234, 88, 12, ${(activeFilmBurnAlpha * 0.25).toFixed(3)})`)
    gradient.addColorStop(1, `rgba(245, 158, 11, ${(activeFilmBurnAlpha * 0.5).toFixed(3)})`)
    ctx.globalCompositeOperation = 'screen'
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  }

  if (activeTransitionFlash && activeTransitionFlash.alpha > 0.02) {
    ctx.save()
    ctx.fillStyle = activeTransitionFlash.color
    ctx.globalAlpha = Math.min(1, activeTransitionFlash.alpha)
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  }

  if (activeReactivityResult) {
    renderReactivityOverlays(ctx, width, height, activeReactivityResult)
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
  playheadSec: number,
  transitionState?: TransitionState,
  reactivityResult?: MusicReactivityResult
): void {
  ctx.save()

  // Apply CSS filters (exposure, contrast, saturation, temperature, LUT, blur)
  let filterStr = buildCssFilterString(effects)
  if (transitionState && transitionState.blurPx > 0.5) {
    const blurAddition = `blur(${transitionState.blurPx.toFixed(1)}px)`
    filterStr = filterStr === 'none' ? blurAddition : `${filterStr} ${blurAddition}`
  }

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

  // Linear Wipe Clipping if applicable
  if (transitionState && transitionState.wipeType) {
    ctx.save()
    ctx.beginPath()
    if (transitionState.wipeType === 'horizontal-left') {
      const visibleW = canvasWidth * transitionState.wipeProgress
      ctx.rect(canvasWidth - visibleW, 0, visibleW, canvasHeight)
    } else if (transitionState.wipeType === 'horizontal-right') {
      const visibleW = canvasWidth * transitionState.wipeProgress
      ctx.rect(0, 0, visibleW, canvasHeight)
    } else if (transitionState.wipeType === 'radial') {
      const maxR = Math.max(canvasWidth, canvasHeight) * 0.75
      const currentR = maxR * transitionState.wipeProgress
      ctx.arc(canvasWidth / 2, canvasHeight / 2, currentR, 0, Math.PI * 2)
    }
    ctx.clip()
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

  // Check for Chromatic Aberration / RGB Split effect
  const totalRgbSplit = Math.max(
    reactivityResult?.chromaticOffsetPx || 0,
    transitionState?.rgbSplitPx || 0
  )

  if (totalRgbSplit > 1.0) {
    // Authentically draw cyan-red channel displacement
    ctx.save()
    ctx.globalAlpha = opacity * 0.8
    ctx.drawImage(source, -drawW / 2 - totalRgbSplit, -drawH / 2, drawW, drawH)
    ctx.restore()

    ctx.save()
    ctx.globalAlpha = opacity * 0.8
    ctx.drawImage(source, -drawW / 2 + totalRgbSplit, -drawH / 2, drawW, drawH)
    ctx.restore()
  }

  // Draw main image centered
  ctx.drawImage(source, -drawW / 2, -drawH / 2, drawW, drawH)

  if (transitionState && transitionState.wipeType) {
    ctx.restore() // restore wipe clip
  }

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
