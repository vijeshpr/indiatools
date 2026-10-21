/**
 * IndiaTools — SonicCam 3D
 * Music-Reactive Cinematic Camera Studio Engine
 * 60 FPS Canvas-based Virtual Film Camera & Parallax Renderer
 */

import { NormalizedAudioBands } from '../audioToVideo/types.ts'
import {
  SonicCamStudioConfig,
  CameraKeyframe,
  DEFAULT_SONIC_CAM_CONFIG,
} from './sonicCamTypes.ts'

export class SonicCamEngine {
  private imageCache: Map<string, HTMLImageElement> = new Map()

  // Exponential Moving Average (EMA) smoothed audio bands for jitter-free cinematic motion
  private smoothBass = 0
  private smoothMid = 0
  private smoothTreble = 0
  private smoothEnergy = 0

  // Transient pulse decay accumulator
  private transientPulse = 0

  // Frame timing
  private lastRenderTime = 0

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
   * Reset audio smoothing state
   */
  public resetSmoothing(): void {
    this.smoothBass = 0
    this.smoothMid = 0
    this.smoothTreble = 0
    this.smoothEnergy = 0
    this.transientPulse = 0
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
    duration: number
  ): void {
    // 1. Guard against unconfigured states
    const sourceUrl = config.sourceImageUrl
    const img = this.getCachedImage(sourceUrl)

    // Fallback if image not yet loaded or missing: draw subtle dark cinematic canvas
    if (!img || !img.complete || img.naturalWidth === 0) {
      this.renderFallbackBackground(ctx, width, height)
      return
    }

    // 2. Before / After Comparison Check
    // If Before/After mode is active or studio is disabled, render clean neutral original image
    if (config.isBeforeActive || !config.enabled) {
      this.renderStaticImage(ctx, img, width, height, config.sourceImageFit)
      return
    }

    // 3. Update Audio Smoothing with Exponential Moving Average (EMA)
    const smoothFactor = Math.max(0.5, Math.min(0.98, config.musicReactive.smoothness))
    this.smoothBass = this.smoothBass * smoothFactor + bands.bass * (1 - smoothFactor)
    this.smoothMid = this.smoothMid * smoothFactor + bands.mid * (1 - smoothFactor)
    this.smoothTreble = this.smoothTreble * smoothFactor + bands.treble * (1 - smoothFactor)
    this.smoothEnergy = this.smoothEnergy * smoothFactor + bands.overall * (1 - smoothFactor)

    // Transient impulse decay
    if (bands.isBeatHit && config.musicReactive.transientMapping.enabled) {
      const hitIntensity = (config.musicReactive.transientMapping.intensity / 100) * 0.08
      this.transientPulse = Math.min(0.2, this.transientPulse + hitIntensity)
    } else {
      this.transientPulse *= 0.85
    }

    // 4. Calculate Master Camera Transform Matrix
    const transform = this.calculateCameraTransform(
      config,
      currentTime,
      duration,
      width,
      height
    )

    // 5. Render Scene with Calculated Virtual Camera
    ctx.save()

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Check if Depth-Aware Parallax with custom background is active
    const hasCustomBg =
      config.depth.enabled &&
      config.depth.customBackgroundUrl &&
      config.depth.customBackgroundUrl !== config.sourceImageUrl
    const bgImg = hasCustomBg ? this.getCachedImage(config.depth.customBackgroundUrl) : null

    if (hasCustomBg && bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
      // Draw background plane with slower motion parallax (0.6x)
      ctx.save()
      this.applyCameraTransform(
        ctx,
        width,
        height,
        transform.x * config.depth.backgroundSpeed,
        transform.y * config.depth.backgroundSpeed,
        transform.zoom * 0.95,
        transform.rotation * 0.5,
        transform.tilt * 0.5,
        transform.overscan
      )
      this.renderImageLayer(ctx, bgImg, width, height, config.sourceImageFit)
      ctx.restore()

      // Draw foreground subject plane with standard/boosted motion
      ctx.save()
      this.applyCameraTransform(
        ctx,
        width,
        height,
        transform.x * config.depth.foregroundSpeed,
        transform.y * config.depth.foregroundSpeed,
        transform.zoom,
        transform.rotation,
        transform.tilt,
        transform.overscan
      )
      this.renderImageLayer(ctx, img, width, height, config.sourceImageFit)
      ctx.restore()
    } else if (config.depth.enabled && config.depth.intensity > 0) {
      // Single-image multi-plane stereoscopic simulation
      // Render subtle soft ambient background glow/shadow
      ctx.save()
      this.applyCameraTransform(
        ctx,
        width,
        height,
        transform.x * 0.65,
        transform.y * 0.65,
        transform.zoom * 1.02,
        transform.rotation * 0.7,
        transform.tilt * 0.7,
        transform.overscan
      )
      ctx.filter = 'blur(12px) brightness(0.7)'
      this.renderImageLayer(ctx, img, width, height, config.sourceImageFit)
      ctx.restore()

      // Render primary subject plane
      ctx.save()
      this.applyCameraTransform(
        ctx,
        width,
        height,
        transform.x,
        transform.y,
        transform.zoom,
        transform.rotation,
        transform.tilt,
        transform.overscan
      )
      this.renderImageLayer(ctx, img, width, height, config.sourceImageFit)
      ctx.restore()
    } else {
      // Standard Cinematic Camera rendering
      this.applyCameraTransform(
        ctx,
        width,
        height,
        transform.x,
        transform.y,
        transform.zoom,
        transform.rotation,
        transform.tilt,
        transform.overscan
      )
      this.renderImageLayer(ctx, img, width, height, config.sourceImageFit)
    }

    ctx.restore()
  }

  /**
   * Calculates comprehensive virtual camera coordinates across all active modules
   */
  public calculateCameraTransform(
    config: SonicCamStudioConfig,
    currentTime: number,
    duration: number,
    width: number,
    height: number
  ): {
    x: number
    y: number
    zoom: number
    rotation: number // in radians
    tilt: number // perspective skew in degrees
    overscan: number
  } {
    const dur = duration > 0 ? duration : 30
    const progress = Math.max(0, Math.min(1, currentTime / dur))

    let offsetX = 0
    let offsetY = 0
    let zoom = 1.05
    let rotationDeg = 0
    let tiltDeg = 0
    let overscan = 1.15

    const reactive = config.musicReactive
    const masterReactivity = reactive.enabled ? reactive.masterReactivity / 100 : 0

    // =========================================================
    // 1. PUSH-PULL / DOLLY ZOOM
    // =========================================================
    if (config.pushPull.enabled) {
      const pp = config.pushPull
      overscan = Math.max(overscan, pp.overscan)

      let tProgress = (currentTime * pp.speed * 0.1) % 1
      if (pp.mode === 'push-in') {
        tProgress = Math.min(1, (currentTime * pp.speed) / dur)
      } else if (pp.mode === 'pull-out') {
        tProgress = 1 - Math.min(1, (currentTime * pp.speed) / dur)
      } else if (pp.mode === 'push-then-pull') {
        const cycle = ((currentTime * pp.speed) / dur) * 2
        tProgress = cycle <= 1 ? cycle : 2 - cycle
      } else if (pp.mode === 'slow-approach') {
        tProgress = Math.pow(Math.min(1, (currentTime * pp.speed) / dur), 1.5)
      } else if (pp.mode === 'wide-establishing') {
        tProgress = Math.sin(Math.min(1, (currentTime * pp.speed) / dur) * Math.PI)
      }

      // Easing curve
      let eased = tProgress
      if (pp.easing === 'ease-in-out') {
        eased = tProgress < 0.5 ? 2 * tProgress * tProgress : -1 + (4 - 2 * tProgress) * tProgress
      } else if (pp.easing === 'cubic') {
        eased = Math.pow(tProgress, 3)
      } else if (pp.easing === 'dramatic') {
        eased = 1 - Math.cos((tProgress * Math.PI) / 2)
      }

      zoom = pp.startZoom + (pp.endZoom - pp.startZoom) * eased
    }

    // Audio-reactive Zoom Pulse (Bass)
    if (reactive.enabled && reactive.bassMapping.enabled && masterReactivity > 0) {
      const bTarget = reactive.bassMapping.target
      if (bTarget === 'push-pull' || bTarget === 'zoom-pulse' || bTarget === 'all') {
        const bassBoost =
          this.smoothBass *
          (reactive.bassMapping.intensity / 100) *
          (reactive.bassMapping.sensitivity / 100) *
          0.14 *
          masterReactivity
        zoom += bassBoost + this.transientPulse
      }
    }

    // =========================================================
    // 2. SMOOTH ORBIT
    // =========================================================
    if (config.orbit.enabled) {
      const orb = config.orbit
      const range = orb.rangeDeg
      const speed = orb.speed * 0.4
      const intensityScale = orb.intensity / 100

      let arc = Math.sin(currentTime * speed)
      if (orb.direction === 'left') {
        arc = -Math.abs(arc)
      } else if (orb.direction === 'right') {
        arc = Math.abs(arc)
      }

      // Audio-reactive orbit boost
      let audioOrbitBoost = 0
      if (reactive.enabled && reactive.bassMapping.enabled && masterReactivity > 0) {
        if (reactive.bassMapping.target === 'orbit' || reactive.bassMapping.target === 'all') {
          audioOrbitBoost =
            this.smoothBass *
            (reactive.bassMapping.intensity / 100) *
            8.0 *
            masterReactivity
        }
      }

      rotationDeg += (arc * range + audioOrbitBoost) * intensityScale
      offsetX += Math.sin((rotationDeg * Math.PI) / 180) * 45 * intensityScale
    }

    // =========================================================
    // 3. CAMERA DRIFT
    // =========================================================
    if (config.drift.enabled) {
      const d = config.drift
      const speed = d.speed * 0.6
      const amp = d.amplitude

      if (d.horizontalEnabled) {
        let driftX = Math.sin(currentTime * speed) * amp
        // Audio reactive mid-frequency drift
        if (reactive.enabled && reactive.midMapping.enabled && masterReactivity > 0) {
          const midBoost =
            this.smoothMid *
            (reactive.midMapping.intensity / 100) *
            25 *
            masterReactivity
          driftX += Math.sin(currentTime * speed * 2) * midBoost
        }
        offsetX += driftX
      }

      if (d.verticalEnabled) {
        const driftY = Math.cos(currentTime * speed * 0.75) * (amp * 0.65)
        offsetY += driftY
      }

      if (d.tiltEnabled) {
        let driftTilt = Math.sin(currentTime * speed * 0.5) * 2.5
        if (reactive.enabled && reactive.trebleMapping.enabled && masterReactivity > 0) {
          driftTilt +=
            this.smoothTreble *
            (reactive.trebleMapping.intensity / 100) *
            2.0 *
            masterReactivity
        }
        tiltDeg += driftTilt
      }
    }

    // =========================================================
    // 4. TILT & CRANE RISE
    // =========================================================
    if (config.tiltRise.enabled) {
      const tr = config.tiltRise
      const speed = tr.speed * 0.5

      if (tr.mode === 'tilt-up') {
        tiltDeg += Math.sin(currentTime * speed) * tr.angleDeg
        offsetY -= Math.abs(Math.sin(currentTime * speed)) * (tr.craneHeight * 0.5)
      } else if (tr.mode === 'tilt-down') {
        tiltDeg -= Math.sin(currentTime * speed) * tr.angleDeg
        offsetY += Math.abs(Math.sin(currentTime * speed)) * (tr.craneHeight * 0.5)
      } else if (tr.mode === 'crane-rise-settle') {
        const craneCycle = Math.sin(currentTime * speed * 0.8)
        offsetY -= craneCycle * tr.craneHeight
        tiltDeg += craneCycle * (tr.angleDeg * 0.6)
      } else if (tr.mode === 'diagonal-pan') {
        offsetX += Math.sin(currentTime * speed) * (tr.craneHeight * 0.8)
        offsetY += Math.cos(currentTime * speed) * (tr.craneHeight * 0.4)
      }
    }

    // =========================================================
    // 5. DYNAMIC KEYFRAME CAMERA PATH
    // =========================================================
    if (config.cameraPath.enabled && config.cameraPath.keyframes.length > 0) {
      const kfTransform = this.interpolateKeyframes(
        config.cameraPath.keyframes,
        currentTime
      )
      if (kfTransform) {
        offsetX += kfTransform.xOffset
        offsetY += kfTransform.yOffset
        zoom *= kfTransform.zoom
        rotationDeg += kfTransform.orbitDeg
        tiltDeg += kfTransform.tiltDeg
      }
    }

    // Safe bounds and overscan guarantee
    const maxOffset = 140
    offsetX = Math.max(-maxOffset, Math.min(maxOffset, offsetX))
    offsetY = Math.max(-maxOffset, Math.min(maxOffset, offsetY))
    zoom = Math.max(1.0, Math.min(2.5, zoom))

    return {
      x: offsetX,
      y: offsetY,
      zoom,
      rotation: (rotationDeg * Math.PI) / 180,
      tilt: tiltDeg,
      overscan: Math.max(1.12, overscan),
    }
  }

  /**
   * Smooth Hermite / Catmull-Rom Keyframe Interpolation
   */
  private interpolateKeyframes(
    keyframes: CameraKeyframe[],
    currentTime: number
  ): CameraKeyframe | null {
    if (keyframes.length === 0) return null
    if (keyframes.length === 1) return keyframes[0]

    // Sort by time
    const sorted = [...keyframes].sort((a, b) => a.timeSec - b.timeSec)

    if (currentTime <= sorted[0].timeSec) return sorted[0]
    if (currentTime >= sorted[sorted.length - 1].timeSec) {
      return sorted[sorted.length - 1]
    }

    // Find bounding keyframe indices
    let idx = 0
    while (idx < sorted.length - 1 && sorted[idx + 1].timeSec < currentTime) {
      idx++
    }

    const kfA = sorted[idx]
    const kfB = sorted[idx + 1]

    const timeDelta = kfB.timeSec - kfA.timeSec
    if (timeDelta <= 0) return kfA

    const localT = (currentTime - kfA.timeSec) / timeDelta

    // Apply easing
    let easedT = localT
    if (kfA.easing === 'ease-in-out') {
      easedT = localT < 0.5 ? 2 * localT * localT : -1 + (4 - 2 * localT) * localT
    } else if (kfA.easing === 'ease-in') {
      easedT = localT * localT
    } else if (kfA.easing === 'ease-out') {
      easedT = localT * (2 - localT)
    } else if (kfA.easing === 'cinematic-bezier') {
      // Smooth cubic bezier (0.25, 0.1, 0.25, 1.0)
      easedT = localT * localT * (3 - 2 * localT)
    }

    const lerp = (v0: number, v1: number) => v0 + (v1 - v0) * easedT

    return {
      id: 'interpolated',
      timeSec: currentTime,
      xOffset: lerp(kfA.xOffset, kfB.xOffset),
      yOffset: lerp(kfA.yOffset, kfB.yOffset),
      zoom: lerp(kfA.zoom, kfB.zoom),
      tiltDeg: lerp(kfA.tiltDeg, kfB.tiltDeg),
      orbitDeg: lerp(kfA.orbitDeg, kfB.orbitDeg),
      intensity: lerp(kfA.intensity, kfB.intensity),
      easing: kfA.easing,
    }
  }

  /**
   * Applies the virtual camera affine matrix with overscan centering
   */
  private applyCameraTransform(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    x: number,
    y: number,
    zoom: number,
    rotationRad: number,
    tiltDeg: number,
    overscan: number
  ): void {
    const cx = width / 2
    const cy = height / 2

    // 1. Move to canvas center
    ctx.translate(cx, cy)

    // 2. Apply camera translation (pan)
    ctx.translate(x, y)

    // 3. Apply camera rotation (orbit arc)
    if (rotationRad !== 0) {
      ctx.rotate(rotationRad)
    }

    // 4. Apply perspective tilt skew
    if (tiltDeg !== 0) {
      const skew = Math.tan((tiltDeg * Math.PI) / 180) * 0.15
      ctx.transform(1, 0, skew, 1, 0, 0)
    }

    // 5. Apply zoom scaled with overscan to ensure ZERO empty black canvas edges
    const totalScale = zoom * overscan
    ctx.scale(totalScale, totalScale)

    // 6. Return origin back from center
    ctx.translate(-cx, -cy)
  }

  /**
   * Renders image layer according to fit mode
   */
  private renderImageLayer(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    canvasW: number,
    canvasH: number,
    fitMode: string
  ): void {
    const imgW = img.naturalWidth || img.width
    const imgH = img.naturalHeight || img.height

    if (imgW <= 0 || imgH <= 0) return

    let drawX = 0
    let drawY = 0
    let drawW = canvasW
    let drawH = canvasH

    const imgAspect = imgW / imgH
    const canvasAspect = canvasW / canvasH

    if (fitMode === 'contain') {
      if (imgAspect > canvasAspect) {
        drawW = canvasW
        drawH = canvasW / imgAspect
        drawX = 0
        drawY = (canvasH - drawH) / 2
      } else {
        drawH = canvasH
        drawW = canvasH * imgAspect
        drawX = (canvasW - drawW) / 2
        drawY = 0
      }
    } else if (fitMode === 'cover') {
      if (imgAspect > canvasAspect) {
        drawH = canvasH
        drawW = canvasH * imgAspect
        drawX = (canvasW - drawW) / 2
        drawY = 0
      } else {
        drawW = canvasW
        drawH = canvasW / imgAspect
        drawX = 0
        drawY = (canvasH - drawH) / 2
      }
    }
    // 'fill' uses full canvasW & canvasH directly

    ctx.drawImage(img, drawX, drawY, drawW, drawH)
  }

  /**
   * Clean static image rendering for Before/After preview
   */
  public renderStaticImage(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    canvasW: number,
    canvasH: number,
    fitMode: string
  ): void {
    ctx.clearRect(0, 0, canvasW, canvasH)
    this.renderImageLayer(ctx, img, canvasW, canvasH, fitMode)
  }

  /**
   * Fallback dark cinematic background when no photo is loaded
   */
  private renderFallbackBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    const grad = ctx.createRadialGradient(
      width / 2,
      height / 2,
      100,
      width / 2,
      height / 2,
      Math.max(width, height) / 1.2
    )
    grad.addColorStop(0, '#0f172a')
    grad.addColorStop(1, '#020617')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)
  }
}

export const sonicCamEngine = new SonicCamEngine()
