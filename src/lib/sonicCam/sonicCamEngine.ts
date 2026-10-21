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

    // Vertical Drop Whip
    if (state.transitionType === 'vertical-drop') {
      const t = this.easeInOutCubic(progress)
      const dropOffset = (1 - t) * canvasH

      ctx.save()
      // Outgoing shot drops downward
      ctx.drawImage(img, prev.sx, prev.sy, prev.sw, prev.sh, 0, t * canvasH * 0.5, canvasW, canvasH)
      // Incoming shot drops in from top
      ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, 0, -dropOffset, canvasW, canvasH)
      ctx.restore()
      return
    }

    // Glitch RGB Split
    if (state.transitionType === 'glitch-rgb') {
      const peak = Math.sin(progress * Math.PI)
      const slices = 12
      const sliceH = canvasH / slices
      const maxShift = 32 * peak

      for (let i = 0; i < slices; i++) {
        const sy = i * sliceH
        const seed = Math.sin(i * 91.3 + progress * 43.7) * 10000
        const jitter = (seed - Math.floor(seed)) - 0.5
        const shiftX = jitter * maxShift * 2
        const useCur = (i + Math.floor(progress * 12)) % 3 !== 0
        const crop = useCur ? cur : prev
        const imgSy = crop.sy + (sy / canvasH) * crop.sh
        const imgSh = (sliceH / canvasH) * crop.sh
        ctx.drawImage(img, crop.sx, imgSy, crop.sw, imgSh, shiftX, sy, canvasW, sliceH)
      }

      if (peak > 0.08) {
        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        ctx.fillStyle = `rgba(0, 240, 255, ${peak * 0.4})`
        ctx.fillRect(maxShift * 0.6, 0, canvasW, canvasH)
        ctx.fillStyle = `rgba(255, 0, 110, ${peak * 0.4})`
        ctx.fillRect(-maxShift * 0.6, 0, canvasW, canvasH)
        ctx.restore()
      }
      return
    }

    // Spin Twist / Vortex
    if (state.transitionType === 'spin-twist') {
      const t = this.easeInOutCubic(progress)
      const angle = t * Math.PI * 0.4

      ctx.save()
      ctx.translate(canvasW / 2, canvasH / 2)

      if (t < 0.6) {
        const scaleOut = 1.0 - t * 0.4
        ctx.save()
        ctx.rotate(angle)
        ctx.scale(scaleOut, scaleOut)
        ctx.globalAlpha = Math.max(0, 1 - t / 0.6)
        ctx.drawImage(img, prev.sx, prev.sy, prev.sw, prev.sh, -canvasW / 2, -canvasH / 2, canvasW, canvasH)
        ctx.restore()
      }

      const scaleIn = 1.4 - (1 - t) * 0.4
      ctx.save()
      ctx.rotate(-(1 - t) * Math.PI * 0.4)
      ctx.scale(scaleIn, scaleIn)
      ctx.globalAlpha = Math.min(1, t / 0.6)
      ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, -canvasW / 2, -canvasH / 2, canvasW, canvasH)
      ctx.restore()

      ctx.restore()
      return
    }

    // Bass Shockwave
    if (state.transitionType === 'bass-shockwave') {
      const t = progress
      const punch = 1.0 + (1 - t) * 0.16

      ctx.save()
      ctx.translate(canvasW / 2, canvasH / 2)
      ctx.scale(punch, punch)
      ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, -canvasW / 2, -canvasH / 2, canvasW, canvasH)
      ctx.restore()

      const maxR = Math.hypot(canvasW, canvasH) * 0.65
      const r = t * maxR
      const alpha = (1 - t) * 0.85

      if (alpha > 0.02) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(canvasW / 2, canvasH / 2, r, 0, Math.PI * 2)
        ctx.lineWidth = Math.max(2, (1 - t) * 14)
        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(canvasW / 2, canvasH / 2, Math.max(0, r - 18), 0, Math.PI * 2)
        ctx.lineWidth = Math.max(1.5, (1 - t) * 8)
        ctx.strokeStyle = `rgba(236, 72, 153, ${alpha * 0.75})`
        ctx.stroke()
        ctx.restore()
      }
      return
    }

    // Light Leak Film Burn
    if (state.transitionType === 'film-burn') {
      const t = progress

      ctx.save()
      ctx.globalAlpha = 1 - t
      ctx.drawImage(img, prev.sx, prev.sy, prev.sw, prev.sh, 0, 0, canvasW, canvasH)
      ctx.globalAlpha = t
      ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, 0, 0, canvasW, canvasH)
      ctx.restore()

      const peak = Math.sin(t * Math.PI)
      if (peak > 0.02) {
        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        const leakX = (t * 1.5 - 0.25) * canvasW
        const grad = ctx.createRadialGradient(
          leakX,
          canvasH * 0.35,
          10,
          leakX,
          canvasH * 0.5,
          canvasW * 0.75
        )
        grad.addColorStop(0, `rgba(255, 248, 220, ${peak * 0.95})`)
        grad.addColorStop(0.25, `rgba(255, 130, 20, ${peak * 0.85})`)
        grad.addColorStop(0.55, `rgba(244, 63, 94, ${peak * 0.65})`)
        grad.addColorStop(0.85, `rgba(168, 85, 247, ${peak * 0.35})`)
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, canvasW, canvasH)
        ctx.restore()
      }
      return
    }

    // Hyper Zoom Dive (Crash Zoom Through)
    if (state.transitionType === 'zoom-through') {
      const t = this.easeInOutQuad(progress)

      ctx.save()
      ctx.translate(canvasW / 2, canvasH / 2)

      if (t < 0.5) {
        const p = t * 2
        const s = 1.0 + p * 2.5
        ctx.scale(s, s)
        ctx.globalAlpha = Math.max(0, 1 - p * 0.8)
        ctx.drawImage(img, prev.sx, prev.sy, prev.sw, prev.sh, -canvasW / 2, -canvasH / 2, canvasW, canvasH)
      } else {
        const p = (t - 0.5) * 2
        const s = 0.35 + p * 0.65
        ctx.scale(s, s)
        ctx.globalAlpha = p
        ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, -canvasW / 2, -canvasH / 2, canvasW, canvasH)
      }
      ctx.restore()

      const peak = Math.sin(t * Math.PI)
      if (peak > 0.35) {
        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        ctx.strokeStyle = `rgba(255, 255, 255, ${(peak - 0.35) * 0.6})`
        ctx.lineWidth = 1.5
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
          const x1 = canvasW / 2 + Math.cos(a) * (canvasW * 0.12)
          const y1 = canvasH / 2 + Math.sin(a) * (canvasH * 0.12)
          const x2 = canvasW / 2 + Math.cos(a) * (canvasW * 0.72)
          const y2 = canvasH / 2 + Math.sin(a) * (canvasH * 0.72)
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
        ctx.restore()
      }
      return
    }

    // Strobe Shutter
    if (state.transitionType === 'strobe-shutter') {
      const t = progress
      const cycle = Math.floor(t * 10)

      if (t < 0.25) {
        ctx.drawImage(img, prev.sx, prev.sy, prev.sw, prev.sh, 0, 0, canvasW, canvasH)
      } else if (cycle % 2 === 0 && t < 0.7) {
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, canvasW, canvasH)
      } else {
        ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, 0, 0, canvasW, canvasH)
        if (t < 0.5) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
          ctx.fillRect(0, 0, canvasW, canvasH)
        }
      }
      return
    }

    // Prism Glass Split
    if (state.transitionType === 'prism-split') {
      const t = this.easeInOutQuad(progress)
      const splitDist = (1 - t) * 36
      const alpha = Math.min(1, t * 1.5)

      ctx.save()
      if (t < 0.45) {
        ctx.globalAlpha = 1 - t * 2
        ctx.drawImage(img, prev.sx, prev.sy, prev.sw, prev.sh, 0, 0, canvasW, canvasH)
      }

      ctx.globalCompositeOperation = 'screen'

      ctx.globalAlpha = alpha * 0.45
      ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, -splitDist, -splitDist * 0.4, canvasW, canvasH)

      ctx.globalAlpha = alpha * 0.45
      ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, splitDist, splitDist * 0.4, canvasW, canvasH)

      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = alpha
      ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, 0, 0, canvasW, canvasH)
      ctx.restore()
      return
    }

    // Anamorphic Blue Streak / Lens Flare
    if (state.transitionType === 'anamorphic-flare') {
      const t = progress
      ctx.save()
      ctx.globalAlpha = 1 - t
      ctx.drawImage(img, prev.sx, prev.sy, prev.sw, prev.sh, 0, 0, canvasW, canvasH)
      ctx.globalAlpha = t
      ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, 0, 0, canvasW, canvasH)
      ctx.restore()

      const peak = Math.sin(t * Math.PI)
      if (peak > 0.02) {
        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        const streakY = canvasH * 0.5
        const streakH = Math.max(6, peak * 36)

        const grad = ctx.createLinearGradient(0, streakY, canvasW, streakY)
        grad.addColorStop(0, 'rgba(0, 150, 255, 0)')
        grad.addColorStop(0.3, `rgba(0, 210, 255, ${peak * 0.7})`)
        grad.addColorStop(0.5, `rgba(255, 255, 255, ${peak * 0.95})`)
        grad.addColorStop(0.7, `rgba(0, 210, 255, ${peak * 0.7})`)
        grad.addColorStop(1, 'rgba(0, 150, 255, 0)')

        ctx.fillStyle = grad
        ctx.fillRect(0, streakY - streakH / 2, canvasW, streakH)

        const rGrad = ctx.createRadialGradient(canvasW / 2, streakY, 0, canvasW / 2, streakY, canvasW * 0.3)
        rGrad.addColorStop(0, `rgba(255, 255, 255, ${peak * 0.8})`)
        rGrad.addColorStop(0.4, `rgba(0, 200, 255, ${peak * 0.4})`)
        rGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = rGrad
        ctx.fillRect(0, 0, canvasW, canvasH)
        ctx.restore()
      }
      return
    }

    // RGB Chromatic Seismic Shake
    if (state.transitionType === 'rgb-shake') {
      const t = progress
      const decay = 1 - t
      const shakeAmt = decay * 36

      ctx.save()
      if (t < 0.4) {
        ctx.drawImage(img, prev.sx, prev.sy, prev.sw, prev.sh, 0, 0, canvasW, canvasH)
      } else {
        ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, 0, 0, canvasW, canvasH)
      }

      if (shakeAmt > 1) {
        ctx.globalCompositeOperation = 'screen'
        const ox = Math.sin(t * 70) * shakeAmt
        const oy = Math.cos(t * 60) * (shakeAmt * 0.5)

        ctx.globalAlpha = decay * 0.5
        ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, ox, oy, canvasW, canvasH)
        ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, -ox, -oy, canvasW, canvasH)
      }
      ctx.restore()
      return
    }

    // Kaleidoscope Mirror Refraction
    if (state.transitionType === 'kaleidoscope') {
      const t = this.easeInOutQuad(progress)
      if (t > 0.85) {
        ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, 0, 0, canvasW, canvasH)
        return
      }

      const hw = canvasW / 2
      const hh = canvasH / 2
      const crop = t < 0.5 ? prev : cur

      ctx.save()
      ctx.translate(hw, hh)
      const rot = t * Math.PI * 0.5
      ctx.rotate(rot)

      for (let sx = -1; sx <= 1; sx += 2) {
        for (let sy = -1; sy <= 1; sy += 2) {
          ctx.save()
          ctx.scale(sx, sy)
          ctx.drawImage(
            img,
            crop.sx,
            crop.sy,
            crop.sw * 0.5,
            crop.sh * 0.5,
            0,
            0,
            hw,
            hh
          )
          ctx.restore()
        }
      }
      ctx.restore()

      if (t > 0.4) {
        ctx.save()
        ctx.globalAlpha = (t - 0.4) / 0.6
        ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, 0, 0, canvasW, canvasH)
        ctx.restore()
      }
      return
    }

    // Digital Matrix / Pixel Grid Dissolve
    if (state.transitionType === 'pixelate-dissolve') {
      const t = progress
      if (t < 0.5) {
        const p = t * 2
        const blockSize = Math.max(2, Math.floor(p * 32))
        const cols = Math.ceil(canvasW / blockSize)
        const rows = Math.ceil(canvasH / blockSize)

        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            const bx = c * blockSize
            const by = r * blockSize
            const imgX = prev.sx + (bx / canvasW) * prev.sw
            const imgY = prev.sy + (by / canvasH) * prev.sh
            ctx.drawImage(img, imgX, imgY, 1, 1, bx, by, blockSize, blockSize)
          }
        }
      } else {
        const p = (t - 0.5) * 2
        const blockSize = Math.max(1, Math.floor((1 - p) * 32))
        const cols = Math.ceil(canvasW / blockSize)
        const rows = Math.ceil(canvasH / blockSize)

        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            const bx = c * blockSize
            const by = r * blockSize
            const imgX = cur.sx + (bx / canvasW) * cur.sw
            const imgY = cur.sy + (by / canvasH) * cur.sh
            ctx.drawImage(img, imgX, imgY, 1, 1, bx, by, blockSize, blockSize)
          }
        }
      }
      return
    }

    // Inverted Negative Film Flash
    if (state.transitionType === 'invert-negative') {
      const t = progress
      if (t < 0.4) {
        ctx.drawImage(img, prev.sx, prev.sy, prev.sw, prev.sh, 0, 0, canvasW, canvasH)
      } else {
        ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, 0, 0, canvasW, canvasH)
      }

      const peak = Math.sin(t * Math.PI)
      if (peak > 0.1) {
        ctx.save()
        ctx.globalCompositeOperation = 'difference'
        ctx.fillStyle = `rgba(255, 255, 255, ${peak * 0.95})`
        ctx.fillRect(0, 0, canvasW, canvasH)
        ctx.restore()
      }
      return
    }

    // Infinite Radial Tunnel Warp
    if (state.transitionType === 'tunnel-warp') {
      const t = this.easeInOutQuad(progress)
      const rings = 6
      const hw = canvasW / 2
      const hh = canvasH / 2

      ctx.save()
      ctx.translate(hw, hh)

      for (let i = rings; i >= 1; i--) {
        const p = (i / rings) * (1 - t * 0.6)
        const s = 1.0 + (1 - p) * 1.5
        const crop = t < 0.5 ? prev : cur
        ctx.save()
        ctx.scale(s, s)
        ctx.globalAlpha = Math.max(0.15, 1 - (i / rings) * 0.8)
        ctx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, -hw, -hh, canvasW, canvasH)
        ctx.restore()
      }
      ctx.restore()

      if (t > 0.4) {
        ctx.save()
        ctx.globalAlpha = (t - 0.4) / 0.6
        ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, 0, 0, canvasW, canvasH)
        ctx.restore()
      }
      return
    }

    // Dark Vignette Punch / Cinematic Iris
    if (state.transitionType === 'vignette-pulse') {
      const t = progress
      if (t < 0.5) {
        ctx.drawImage(img, prev.sx, prev.sy, prev.sw, prev.sh, 0, 0, canvasW, canvasH)
      } else {
        ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, 0, 0, canvasW, canvasH)
      }

      const peak = Math.sin(t * Math.PI)
      if (peak > 0.05) {
        ctx.save()
        const maxR = Math.hypot(canvasW, canvasH) * 0.7
        const innerR = maxR * (1 - peak * 0.75)
        const grad = ctx.createRadialGradient(
          canvasW / 2,
          canvasH / 2,
          innerR,
          canvasW / 2,
          canvasH / 2,
          maxR
        )
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)')
        grad.addColorStop(1, `rgba(0, 0, 0, ${peak * 0.95})`)
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, canvasW, canvasH)
        ctx.restore()
      }
      return
    }

    // Centrifugal Radial Blur Smear
    if (state.transitionType === 'radial-smear') {
      const t = progress
      const peak = Math.sin(t * Math.PI)
      const hw = canvasW / 2
      const hh = canvasH / 2

      ctx.save()
      ctx.translate(hw, hh)

      const passes = 5
      const maxRot = peak * 0.12
      const crop = t < 0.5 ? prev : cur

      for (let p = -passes; p <= passes; p++) {
        const a = (p / passes) * maxRot
        ctx.save()
        ctx.rotate(a)
        ctx.globalAlpha = 1 / (passes * 2 + 1)
        ctx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, -hw, -hh, canvasW, canvasH)
        ctx.restore()
      }
      ctx.restore()

      if (t > 0.45) {
        ctx.save()
        ctx.globalAlpha = (t - 0.45) / 0.55
        ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, 0, 0, canvasW, canvasH)
        ctx.restore()
      }
      return
    }

    // Double Thump Heartbeat Bass Pump
    if (state.transitionType === 'heartbeat-pulse') {
      const t = progress
      const thump1 = Math.sin(Math.min(1, t * 2.5) * Math.PI) * 0.16
      const thump2 = t > 0.4 ? Math.sin(Math.min(1, (t - 0.4) * 2.5) * Math.PI) * 0.22 : 0
      const s = 1.0 + thump1 + thump2

      ctx.save()
      ctx.translate(canvasW / 2, canvasH / 2)
      ctx.scale(s, s)
      ctx.drawImage(img, cur.sx, cur.sy, cur.sw, cur.sh, -canvasW / 2, -canvasH / 2, canvasW, canvasH)
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
