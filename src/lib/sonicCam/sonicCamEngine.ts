/**
 * IndiaTools — SonicCam
 * Beat-Synced Multi-Region Cinematic Photo Effect Render Engine
 * 60 FPS Canvas-based Region Cutting, Transitions & Bass Shake
 */

import { NormalizedAudioBands } from '../audioToVideo/types.ts'
import {
  SonicCamStudioConfig,
  ImageRegion,
  DEFAULT_SONIC_CAM_CONFIG,
} from './sonicCamTypes.ts'
import { sonicCamSequencer, SequencerFrameState } from './sonicCamSequencer.ts'

export class SonicCamEngine {
  private imageCache: Map<string, HTMLImageElement> = new Map()

  /**
   * Preload or get cached HTMLImageElement safely
   */
  public getCachedImage(url: string | null): HTMLImageElement | null {
    if (!url) return null
    if (this.imageCache.has(url)) {
      const cached = this.imageCache.get(url)!
      if (cached.complete && cached.naturalWidth > 0) return cached
      return cached
    }

    if (typeof window === 'undefined') return null

    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = url
      this.imageCache.set(url, img)
      return img
    } catch {
      return null
    }
  }

  /**
   * Clear image cache to free memory
   */
  public clearCache(): void {
    this.imageCache.clear()
  }

  /**
   * Reset engine state
   */
  public reset(): void {
    sonicCamSequencer.reset()
  }

  /**
   * Main Render Pipeline
   */
  public render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: SonicCamStudioConfig,
    bands: NormalizedAudioBands,
    currentTime: number,
    duration: number,
    isExporting = false
  ): void {
    const sourceUrl = config.sourceImageUrl
    const img = this.getCachedImage(sourceUrl)

    // Fallback if image not yet loaded or missing: draw subtle dark cinematic background
    if (!img || !img.complete || img.naturalWidth === 0) {
      this.renderFallbackBackground(ctx, width, height)
      return
    }

    const imgW = img.naturalWidth || img.width
    const imgH = img.naturalHeight || img.height

    // 1. Before / After Comparison Check
    // If Before/After mode is active or studio is disabled, render clean neutral original image
    if (config.isBeforeActive || !config.enabled) {
      this.renderStaticFullImage(ctx, img, width, height)
      return
    }

    // 2. Evaluate Sequencer Frame State
    const frameState = sonicCamSequencer.evaluateFrame(
      config,
      currentTime,
      duration,
      imgW,
      imgH,
      width,
      height,
      bands
    )

    ctx.save()
    ctx.clearRect(0, 0, width, height)

    // 3. Apply Bass Micro-Shake Displacement & Zoom Punch
    const cx = width / 2
    const cy = height / 2

    ctx.translate(cx, cy)
    if (frameState.shakeX !== 0 || frameState.shakeY !== 0) {
      ctx.translate(frameState.shakeX, frameState.shakeY)
    }
    if (frameState.shakeRotationRad !== 0) {
      ctx.rotate(frameState.shakeRotationRad)
    }
    if (frameState.zoomBoost !== 0) {
      const scale = 1.0 + frameState.zoomBoost
      ctx.scale(scale, scale)
    }
    ctx.translate(-cx, -cy)

    // 4. Render Active Shot & Transitions
    this.renderShotWithTransition(ctx, img, width, height, frameState)

    // 5. Flash Cut Effect
    if (frameState.flashBrightness > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${frameState.flashBrightness})`
      ctx.fillRect(0, 0, width, height)
    }

    ctx.restore()

    // 6. Editor-only Region Bounds Overlay (never drawn during export)
    if (!isExporting && config.showRegionBoundsInPreview && config.regions.length > 0) {
      this.renderRegionBoundsOverlay(ctx, width, height, config.regions, frameState.currentRegion?.id || null)
    }
  }

  /**
   * Renders the active region crop or transition blend
   */
  private renderShotWithTransition(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    canvasW: number,
    canvasH: number,
    state: SequencerFrameState
  ): void {
    const cur = state.cropRect
    const prev = state.previousCropRect
    const progress = state.transitionProgress

    // If fully transitioned or instant cut, draw single crop directly
    if (progress >= 1 || !prev || state.transitionType === 'instant-cut' || state.transitionType === 'snap-zoom') {
      ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, 0, 0, canvasW, canvasH)
      return
    }

    // Smooth Zoom Cut: Interpolate crop coordinates
    if (state.transitionType === 'smooth-zoom-cut') {
      const t = this.easeInOutQuad(progress)
      const sx = prev.sx + (cur.sx - prev.sx) * t
      const sy = prev.sy + (cur.sy - prev.sy) * t
      const sw = prev.sw + (cur.sw - prev.sw) * t
      const sh = prev.sh + (cur.sh - prev.sh) * t

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvasW, canvasH)
      return
    }

    // Crossfade Transition: Blend alpha
    if (state.transitionType === 'crossfade') {
      ctx.save()
      ctx.globalAlpha = 1 - progress
      ctx.drawImage(img, prev.sx, prev.sy, prev.sw, prev.sh, 0, 0, canvasW, canvasH)
      ctx.globalAlpha = progress
      ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, 0, 0, canvasW, canvasH)
      ctx.restore()
      return
    }

    // Whip Pan or Directional Slide
    if (state.transitionType === 'whip-pan' || state.transitionType === 'directional-slide') {
      const t = this.easeInOutCubic(progress)
      const slideOffset = (1 - t) * canvasW

      ctx.save()
      // Outgoing shot slides left
      ctx.drawImage(img, prev.sx, prev.sy, prev.sw, prev.sh, -slideOffset * 0.5, 0, canvasW, canvasH)
      // Incoming shot slides in from right
      ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, canvasW - slideOffset, 0, canvasW, canvasH)
      ctx.restore()
      return
    }

    // Default fallback
    ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, 0, 0, canvasW, canvasH)
  }

  /**
   * Clean full image rendering for Before/After preview
   */
  public renderStaticFullImage(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    canvasW: number,
    canvasH: number
  ): void {
    ctx.clearRect(0, 0, canvasW, canvasH)

    const imgW = img.naturalWidth || img.width
    const imgH = img.naturalHeight || img.height

    if (imgW <= 0 || imgH <= 0) return

    const targetAspect = canvasW / canvasH
    const imgAspect = imgW / imgH

    let cropW = imgW
    let cropH = imgH

    if (imgAspect > targetAspect) {
      cropW = imgH * targetAspect
    } else {
      cropH = imgW / targetAspect
    }

    const sx = (imgW - cropW) / 2
    const sy = (imgH - cropH) / 2

    ctx.drawImage(img, sx, sy, cropW, cropH, 0, 0, canvasW, canvasH)
  }

  /**
   * Editor-only Region Bounds Overlay
   */
  private renderRegionBoundsOverlay(
    ctx: CanvasRenderingContext2D,
    canvasW: number,
    canvasH: number,
    regions: ImageRegion[],
    activeRegionId: string | null
  ): void {
    ctx.save()

    for (const r of regions) {
      const rx = r.x * canvasW
      const ry = r.y * canvasH
      const rw = r.width * canvasW
      const rh = r.height * canvasH

      const isActive = r.id === activeRegionId

      ctx.strokeStyle = isActive ? '#00F0FF' : r.color
      ctx.lineWidth = isActive ? 3 : 1.5
      ctx.setLineDash(isActive ? [] : [6, 4])
      ctx.strokeRect(rx, ry, rw, rh)

      // Translucent fill for active region
      if (isActive) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.15)'
        ctx.fillRect(rx, ry, rw, rh)
      }

      // Label badge
      ctx.fillStyle = 'rgba(9, 10, 15, 0.85)'
      ctx.fillRect(rx + 4, ry + 4, Math.min(rw - 8, 80), 18)
      ctx.fillStyle = isActive ? '#00F0FF' : '#E2E8F0'
      ctx.font = 'bold 10px monospace'
      ctx.fillText(r.label.slice(0, 12), rx + 8, ry + 16)
    }

    ctx.restore()
  }

  /**
   * Fallback dark background when no image is loaded
   */
  private renderFallbackBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    const grad = ctx.createRadialGradient(
      width / 2,
      height / 2,
      50,
      width / 2,
      height / 2,
      Math.max(width, height) / 1.2
    )
    grad.addColorStop(0, '#0f172a')
    grad.addColorStop(1, '#020617')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)
  }

  private easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  }
}

export const sonicCamEngine = new SonicCamEngine()
