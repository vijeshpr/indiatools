/**
 * IndiaTools — Memory Burst Studio
 * 60 FPS Canvas 2D Photo Cutting & Cinematic Transition Render Pipeline
 */

import {
  MemoryBurstStudioConfig,
  MemoryBurstPhoto,
} from './memoryBurstTypes'
import { memoryBurstSequencer, MemoryBurstFrameState } from './memoryBurstSequencer'
import { NormalizedAudioBands } from '../audioToVideo/types'

export class MemoryBurstEngine {
  private imageCache = new Map<string, HTMLImageElement>()

  /**
   * Main render method invoked per frame in 60 FPS animation loop
   */
  public render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: MemoryBurstStudioConfig,
    bands: NormalizedAudioBands,
    currentTime: number,
    durationSec: number
  ): void {
    if (!config || width <= 0 || height <= 0) return

    const photos = config.photos || []
    if (photos.length === 0) {
      this.renderEmptyPlaceholder(ctx, width, height)
      return
    }

    // 1. Before/After original preview
    if (config.isBeforeActive) {
      const firstPhoto = photos[0]
      const img = this.getCachedImage(firstPhoto.url)
      if (img && img.complete) {
        ctx.clearRect(0, 0, width, height)
        this.drawPhotoCover(ctx, img, width, height)
      } else {
        this.renderLoadingPlaceholder(ctx, width, height, firstPhoto.name)
      }
      return
    }

    // 2. Evaluate Sequencer frame state
    const frameState = memoryBurstSequencer.evaluateAtTime(
      config,
      currentTime,
      durationSec,
      bands
    )

    if (!frameState.currentPhoto) {
      this.renderEmptyPlaceholder(ctx, width, height)
      return
    }

    const curImg = this.getCachedImage(frameState.currentPhoto.url)
    const prevImg = frameState.previousPhoto
      ? this.getCachedImage(frameState.previousPhoto.url)
      : null

    if (!curImg || !curImg.complete) {
      this.renderLoadingPlaceholder(ctx, width, height, frameState.currentPhoto.name)
      return
    }

    ctx.save()

    // 3. Apply Bass Micro-Shake Translation
    if (frameState.bassShakeX !== 0 || frameState.bassShakeY !== 0) {
      ctx.translate(frameState.bassShakeX, frameState.bassShakeY)
    }

    // 4. Apply Rhythm-Synced Cinematic Zoom & Scale Punch (Centered)
    const scale = frameState.totalZoom || frameState.scalePunch || 1.0
    if (scale !== 1.0) {
      ctx.translate(width / 2, height / 2)
      ctx.scale(scale, scale)
      ctx.translate(-width / 2, -height / 2)
    }

    // 5. Render Transition between Photos
    this.renderPhotoTransition(ctx, curImg, prevImg, width, height, frameState)

    // 6. Flash Effect Overlay
    if (frameState.flashOpacity > 0.01) {
      ctx.save()
      if (frameState.flashType === 'warm') {
        ctx.fillStyle = `rgba(255, 230, 180, ${frameState.flashOpacity})`
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${frameState.flashOpacity})`
      }
      ctx.fillRect(0, 0, width, height)
      ctx.restore()
    }

    ctx.restore()
  }

  /**
   * Renders the transition between previous and current photo
   */
  private renderPhotoTransition(
    ctx: CanvasRenderingContext2D,
    curImg: HTMLImageElement,
    prevImg: HTMLImageElement | null,
    width: number,
    height: number,
    state: MemoryBurstFrameState
  ): void {
    const progress = state.transitionProgress
    const style = state.transitionStyle

    // Instant Cut or settled state
    if (progress >= 1.0 || !prevImg || !prevImg.complete || style === 'instant-cut' || style === 'scale-punch') {
      this.drawPhotoCover(ctx, curImg, width, height)
      return
    }

    // Smooth Crossfade
    if (style === 'smooth-crossfade') {
      ctx.save()
      ctx.globalAlpha = 1.0 - progress
      this.drawPhotoCover(ctx, prevImg, width, height)
      ctx.globalAlpha = progress
      this.drawPhotoCover(ctx, curImg, width, height)
      ctx.restore()
      return
    }

    // Short Flash
    if (style === 'short-flash') {
      if (progress < 0.5) {
        this.drawPhotoCover(ctx, prevImg, width, height)
      } else {
        this.drawPhotoCover(ctx, curImg, width, height)
      }
      const flashAlpha = Math.sin(progress * Math.PI) * 0.75
      ctx.save()
      ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`
      ctx.fillRect(0, 0, width, height)
      ctx.restore()
      return
    }

    // Whip Pan
    if (style === 'whip-pan') {
      const t = this.easeInOutCubic(progress)
      const offset = (1.0 - t) * width

      ctx.save()
      // Outgoing slides left
      ctx.translate(-offset * 0.6, 0)
      this.drawPhotoCover(ctx, prevImg, width, height)
      ctx.restore()

      ctx.save()
      // Incoming slides in from right
      ctx.translate(width - offset, 0)
      this.drawPhotoCover(ctx, curImg, width, height)
      ctx.restore()
      return
    }

    // Fade Wipe (Directional feathered wipe for seamless memory montage flow)
    if (style === 'fade-wipe') {
      this.drawPhotoCover(ctx, prevImg, width, height)

      ctx.save()
      const wipeX = progress * (width + 120) - 60
      ctx.beginPath()
      ctx.rect(0, 0, Math.min(width, Math.max(0, wipeX)), height)
      ctx.clip()
      this.drawPhotoCover(ctx, curImg, width, height)
      ctx.restore()

      if (progress > 0.02 && progress < 0.98) {
        ctx.save()
        const featherGrad = ctx.createLinearGradient(wipeX - 40, 0, wipeX + 20, 0)
        featherGrad.addColorStop(0, 'rgba(255, 255, 255, 0)')
        featherGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.22)')
        featherGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = featherGrad
        ctx.fillRect(wipeX - 40, 0, 60, height)
        ctx.restore()
      }
      return
    }

    // Glitch Split
    if (style === 'glitch-split') {
      const peak = Math.sin(progress * Math.PI)
      const slices = 10
      const sliceH = height / slices
      const maxShift = 28 * peak

      for (let i = 0; i < slices; i++) {
        const sy = i * sliceH
        const jitter = (Math.sin(i * 127.1 + progress * 53.7) * 43758.5453) % 1
        const shiftX = (jitter - 0.5) * maxShift * 2
        const useCur = (i + Math.floor(progress * 8)) % 2 === 0
        const targetImg = useCur ? curImg : prevImg

        ctx.save()
        ctx.beginPath()
        ctx.rect(0, sy, width, sliceH)
        ctx.clip()
        ctx.translate(shiftX, 0)
        this.drawPhotoCover(ctx, targetImg, width, height)
        ctx.restore()
      }

      if (peak > 0.1) {
        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        ctx.fillStyle = `rgba(0, 240, 255, ${peak * 0.35})`
        ctx.fillRect(maxShift * 0.5, 0, width, height)
        ctx.fillStyle = `rgba(255, 0, 100, ${peak * 0.35})`
        ctx.fillRect(-maxShift * 0.5, 0, width, height)
        ctx.restore()
      }
      return
    }

    // Film Burn / Light Leak
    if (style === 'film-burn') {
      ctx.save()
      ctx.globalAlpha = 1.0 - progress
      this.drawPhotoCover(ctx, prevImg, width, height)
      ctx.globalAlpha = progress
      this.drawPhotoCover(ctx, curImg, width, height)
      ctx.restore()

      const peak = Math.sin(progress * Math.PI)
      if (peak > 0.02) {
        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        const leakX = (progress * 1.5 - 0.25) * width
        const grad = ctx.createRadialGradient(
          leakX,
          height * 0.35,
          10,
          leakX,
          height * 0.5,
          width * 0.75
        )
        grad.addColorStop(0, `rgba(255, 248, 220, ${peak * 0.95})`)
        grad.addColorStop(0.25, `rgba(255, 130, 20, ${peak * 0.85})`)
        grad.addColorStop(0.55, `rgba(244, 63, 94, ${peak * 0.65})`)
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, width, height)
        ctx.restore()
      }
      return
    }

    // Fallback: draw current photo
    this.drawPhotoCover(ctx, curImg, width, height)
  }

  /**
   * Draws an image with aspect-ratio preserving cover crop
   */
  public drawPhotoCover(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    canvasW: number,
    canvasH: number
  ): void {
    const imgW = img.naturalWidth || img.width || 1920
    const imgH = img.naturalHeight || img.height || 1080

    const crop = memoryBurstSequencer.calculateCoverCrop(imgW, imgH, canvasW, canvasH)
    ctx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, canvasW, canvasH)
  }

  /**
   * Retrieves or instantiates a cached Image element
   */
  public getCachedImage(url: string): HTMLImageElement | null {
    if (!url) return null
    if (this.imageCache.has(url)) {
      return this.imageCache.get(url)!
    }

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = url
    this.imageCache.set(url, img)
    return img
  }

  /**
   * Cleans up revoked URLs from cache to free memory
   */
  public revokeUrl(url: string): void {
    if (this.imageCache.has(url)) {
      this.imageCache.delete(url)
    }
    if (url.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(url)
      } catch {
        // Safe ignore
      }
    }
  }

  /**
   * Clears entire image cache
   */
  public clearCache(): void {
    for (const [url] of this.imageCache) {
      if (url.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(url)
        } catch {
          // Safe ignore
        }
      }
    }
    this.imageCache.clear()
  }

  private renderEmptyPlaceholder(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.fillStyle = '#090A0F'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Memory Burst Studio — Upload photos to begin', w / 2, h / 2)
  }

  private renderLoadingPlaceholder(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    name: string
  ): void {
    ctx.fillStyle = '#090A0F'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`Loading ${name}...`, w / 2, h / 2)
  }

  private easeInOutCubic(x: number): number {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
  }
}

export const memoryBurstEngine = new MemoryBurstEngine()
