/**
 * IndiaTools — Audio to Video Studio
 * 60 FPS Modular Canvas Rendering Engine
 */

import {
  StudioCompositionConfig,
  NormalizedAudioBands,
  SlideshowImage,
} from './types.ts'
import { drawProceduralBackground } from './backgroundPresets.ts'
import { studioPhotoMotionEngine } from './photoMotionEngine.ts'
import { portalVfxEngine } from '../portalVfx/portalVfxEngine.ts'
import { musicGrownGardenEngine } from '../garden/gardenEngine.ts'
import { sonicCamEngine } from '../sonicCam/sonicCamEngine.ts'
import { memoryBurstEngine } from '../memoryBurst/memoryBurstEngine.ts'
import { photoUniverseEngine } from '../photoUniverse/universeEngine.ts'
import { vintageCassetteEngine } from '../cassette/cassetteEngine.ts'
import { neonEnergyEngine } from '../neonEnergy/neonEnergyEngine.ts'

interface Particle {
  x: number
  y: number
  radius: number
  speedX: number
  speedY: number
  alpha: number
  color: string
}

interface RainStreak {
  x: number
  y: number
  length: number
  speed: number
  alpha: number
}

export class AudioToVideoRenderEngine {
  private particles: Particle[] = []
  private rainStreaks: RainStreak[] = []
  private peakHoldValues: number[] = new Array(128).fill(0)
  private peakHoldDecay: number[] = new Array(128).fill(0)

  // Image cache
  private imageCache: Map<string, HTMLImageElement> = new Map()

  constructor() {
    this.initPools()
  }

  private initPools() {
    this.particles = []
    for (let i = 0; i < 200; i++) {
      this.particles.push({
        x: Math.random() * 2000,
        y: Math.random() * 2000,
        radius: 1 + Math.random() * 3,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: -0.3 - Math.random() * 0.8,
        alpha: 0.2 + Math.random() * 0.6,
        color: Math.random() < 0.5 ? '#38BDF8' : '#EC4899',
      })
    }

    this.rainStreaks = []
    for (let i = 0; i < 400; i++) {
      this.rainStreaks.push({
        x: Math.random() * 2400 - 200,
        y: Math.random() * 2400 - 200,
        length: 20 + Math.random() * 35,
        speed: 15 + Math.random() * 20,
        alpha: 0.3 + Math.random() * 0.4,
      })
    }
  }

  public getCachedImage(url: string): HTMLImageElement | null {
    if (!url) return null
    let img = this.imageCache.get(url)
    if (!img) {
      img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = url
      this.imageCache.set(url, img)
    }
    return img.complete && img.naturalWidth > 0 ? img : null
  }

  /**
   * Main render method invoked on every animation frame
   */
  public render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: StudioCompositionConfig,
    bands: NormalizedAudioBands,
    freqData: Uint8Array,
    timeData: Uint8Array,
    currentTime: number,
    duration: number
  ) {
    ctx.save()
    ctx.clearRect(0, 0, width, height)

    // 1. Camera Scale on Bass Kick
    let scaleFactor = 1.0
    if (config.cinematicFx.bassScaleEnabled) {
      const strength = (config.cinematicFx.bassScaleStrength / 10) * 0.05
      scaleFactor += bands.bass * strength
    }
    if (config.cinematicFx.cameraShakeOnBeat && bands.isBeatHit) {
      const shakeX = (Math.random() - 0.5) * 6
      const shakeY = (Math.random() - 0.5) * 6
      ctx.translate(shakeX, shakeY)
    }

    if (scaleFactor !== 1.0) {
      ctx.translate(width / 2, height / 2)
      ctx.scale(scaleFactor, scaleFactor)
      ctx.translate(-width / 2, -height / 2)
    }

    // 2. Scene Layer: Garden Studio OR Portal VFX OR 2.5D Photo Motion Studio OR Standard Background + Cinematic FX
    const portalPhotoUrl = config.portalVfx?.sourceImageUrl || config.background.singleImageUrl
    const hasPortalActive =
      config.portalVfx &&
      (config.portalVfx.ring.enabled ||
        config.portalVfx.energyFlow.enabled ||
        config.portalVfx.interior.enabled ||
        config.portalVfx.lightSpill.enabled ||
        config.portalVfx.shockwave.enabled ||
        config.portalVfx.particles.enabled ||
        config.portalVfx.opening.enabled ||
        config.portalVfx.exitTransition.enabled ||
        config.portalVfx.isBeforePreviewActive)

    // 2. Scene Layer: Photo Universe 3D OR Memory Burst Studio OR SonicCam 3D OR Garden Studio OR Portal VFX OR 2.5D Photo Motion Studio OR Standard Background + Cinematic FX
    const sonicCamPhotoUrl =
      config.sonicCam3d?.sourceImageUrl ||
      config.portalVfx?.sourceImageUrl ||
      config.background.singleImageUrl

    if (config.neonEnergy?.enabled) {
      neonEnergyEngine.render(ctx, width, height, config.neonEnergy, bands, currentTime, duration)
    } else if (config.vintageCassette?.enabled) {
      vintageCassetteEngine.render(ctx, width, height, config.vintageCassette, bands, timeData, currentTime, duration)
    } else if (config.photoUniverse?.enabled) {
      photoUniverseEngine.render(ctx, width, height, config.photoUniverse, bands, currentTime, duration)
    } else if (config.memoryBurst?.enabled) {
      memoryBurstEngine.render(ctx, width, height, config.memoryBurst, bands, currentTime, duration)
    } else if (config.sonicCam3d?.enabled) {
      const activeSonicCamConfig = {
        ...config.sonicCam3d,
        sourceImageUrl: config.sonicCam3d.sourceImageUrl || sonicCamPhotoUrl,
      }
      sonicCamEngine.render(ctx, width, height, activeSonicCamConfig, bands, currentTime, duration)
    } else if (config.gardenStudio?.enabled) {
      musicGrownGardenEngine.render(ctx, width, height, config.gardenStudio, bands, currentTime, duration)
    } else if (config.portalVfx && (hasPortalActive || (portalPhotoUrl && !config.photoMotion?.enabled && config.background.mode === 'single-image'))) {
      const baseImg = portalPhotoUrl ? portalVfxEngine.getCachedImage(portalPhotoUrl) : null
      portalVfxEngine.render(ctx, width, height, config.portalVfx, baseImg, bands, currentTime, duration)
    } else if (config.photoMotion?.enabled) {
      const motionImageUrl =
        config.photoMotion.sourceImageUrl ||
        config.background.singleImageUrl ||
        '/images/garden/golden-hour-meadow.jpg'
      const activePhotoMotionConfig = {
        ...config.photoMotion,
        sourceImageUrl: motionImageUrl,
      }
      studioPhotoMotionEngine.render(ctx, width, height, activePhotoMotionConfig, bands, currentTime, duration)
    } else {
      this.renderBackground(ctx, width, height, config, bands, currentTime, duration)
      this.renderCinematicEffects(ctx, width, height, config, bands, currentTime)
    }

    // 4. Visualizer Layer
    if (!config.neonEnergy?.enabled) {
      this.renderVisualizer(ctx, width, height, config, bands, freqData, timeData, currentTime)
    }

    // 5. Typography & Title Overlay Layer
    if (!config.neonEnergy?.enabled) {
      this.renderTypography(ctx, width, height, config, currentTime, duration)
    }

    ctx.restore()
  }

  private renderBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: StudioCompositionConfig,
    bands: NormalizedAudioBands,
    currentTime: number,
    duration: number
  ) {
    const bg = config.background

    if (bg.mode === 'preset') {
      drawProceduralBackground(ctx, width, height, bg.presetId, currentTime, bands.bass, bg.brightness)
    } else if (bg.mode === 'single-image' && bg.singleImageUrl) {
      const img = this.getCachedImage(bg.singleImageUrl)
      if (img) {
        this.renderImageWithMotion(ctx, img, width, height, bg.motionStyle, bg.motionIntensity, currentTime, 1.0)
      } else {
        drawProceduralBackground(ctx, width, height, 'minimal-dark', currentTime, bands.bass, bg.brightness)
      }
    } else if (bg.mode === 'slideshow' && bg.slideshow.length > 0) {
      this.renderSlideshow(ctx, width, height, bg.slideshow, bg.slideshowTransitionDuration, currentTime, duration, bg.motionStyle, bg.motionIntensity)
    } else {
      drawProceduralBackground(ctx, width, height, 'minimal-dark', currentTime, bands.bass, bg.brightness)
    }

    // Vignette
    if (bg.vignette > 0) {
      const maxR = Math.hypot(width / 2, height / 2)
      const vigGrad = ctx.createRadialGradient(width / 2, height / 2, maxR * 0.4, width / 2, height / 2, maxR)
      vigGrad.addColorStop(0, 'transparent')
      vigGrad.addColorStop(1, `rgba(0, 0, 0, ${bg.vignette / 100})`)
      ctx.fillStyle = vigGrad
      ctx.fillRect(0, 0, width, height)
    }

    // Film Grain
    if (bg.filmGrain > 0 && !config.performanceMode) {
      this.renderFilmGrain(ctx, width, height, bg.filmGrain)
    }
  }

  private renderImageWithMotion(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    width: number,
    height: number,
    motionStyle: string,
    intensity: number,
    time: number,
    alpha: number
  ) {
    ctx.save()
    ctx.globalAlpha = alpha

    let zoom = 1.05
    let panX = 0
    let panY = 0
    const factor = (intensity / 10) * 0.08

    if (motionStyle === 'slow-zoom-in') {
      zoom = 1.0 + (time * factor * 0.2) % 0.15
    } else if (motionStyle === 'slow-zoom-out') {
      zoom = 1.15 - (time * factor * 0.2) % 0.15
    } else if (motionStyle === 'pan-left-right') {
      panX = Math.sin(time * factor) * 40
    } else if (motionStyle === 'ken-burns') {
      zoom = 1.05 + Math.sin(time * 0.2) * factor
      panX = Math.sin(time * 0.15) * 30
      panY = Math.cos(time * 0.12) * 20
    }

    const imgAspect = img.naturalWidth / img.naturalHeight
    const canvasAspect = width / height

    let drawW = width * zoom
    let drawH = height * zoom

    if (canvasAspect > imgAspect) {
      drawW = width * zoom
      drawH = (width / imgAspect) * zoom
    } else {
      drawH = height * zoom
      drawW = (height * imgAspect) * zoom
    }

    const offsetX = (width - drawW) / 2 + panX
    const offsetY = (height - drawH) / 2 + panY

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH)
    ctx.restore()
  }

  private renderSlideshow(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    slides: SlideshowImage[],
    transitionDuration: number,
    currentTime: number,
    totalDuration: number,
    motionStyle: string,
    motionIntensity: number
  ) {
    if (slides.length === 0) return

    // Calculate duration per slide
    const slideDuration = totalDuration > 0 ? totalDuration / slides.length : 5.0
    const currentIndex = Math.floor(currentTime / slideDuration) % slides.length
    const nextIndex = (currentIndex + 1) % slides.length

    const timeInCurrentSlide = currentTime % slideDuration
    const isTransitioning = timeInCurrentSlide > slideDuration - transitionDuration

    const currentSlide = slides[currentIndex]
    const currentImg = this.getCachedImage(currentSlide.url)

    if (currentImg) {
      this.renderImageWithMotion(ctx, currentImg, width, height, motionStyle, motionIntensity, currentTime, 1.0)
    }

    if (isTransitioning) {
      const nextSlide = slides[nextIndex]
      const nextImg = this.getCachedImage(nextSlide.url)
      const progress = (timeInCurrentSlide - (slideDuration - transitionDuration)) / transitionDuration
      if (nextImg) {
        this.renderImageWithMotion(ctx, nextImg, width, height, motionStyle, motionIntensity, currentTime, progress)
      }
    }
  }

  private renderFilmGrain(ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number) {
    ctx.save()
    ctx.fillStyle = `rgba(255, 255, 255, ${(intensity / 100) * 0.05})`
    const grainCount = Math.floor((width * height) / 1200)
    for (let i = 0; i < grainCount; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      ctx.fillRect(x, y, 1.2, 1.2)
    }
    ctx.restore()
  }

  private renderCinematicEffects(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: StudioCompositionConfig,
    bands: NormalizedAudioBands,
    currentTime: number
  ) {
    const fx = config.cinematicFx

    // 1. Floating Particles
    if (fx.floatingParticlesEnabled) {
      ctx.save()
      const count = config.performanceMode ? Math.floor(fx.particleCount * 0.5) : fx.particleCount
      for (let i = 0; i < count; i++) {
        const p = this.particles[i]
        p.x += p.speedX
        p.y += p.speedY
        if (p.y < 0) {
          p.y = height + 10
          p.x = Math.random() * width
        }
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0

        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha * (0.8 + bands.treble * 0.4)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    }

    // 2. Rain Overlay
    if (fx.rainEnabled) {
      ctx.save()
      ctx.strokeStyle = 'rgba(203, 228, 249, 0.45)'
      ctx.lineWidth = 1.2
      const angleRad = (fx.rainWind * Math.PI) / 180
      const sinA = Math.sin(angleRad)
      const cosA = Math.cos(angleRad)
      const count = Math.floor(this.rainStreaks.length * (fx.rainDensity / 100))

      for (let i = 0; i < count; i++) {
        const drop = this.rainStreaks[i]
        drop.y += drop.speed * fx.rainSpeed * cosA
        drop.x += drop.speed * fx.rainSpeed * sinA

        if (drop.y > height + 50) {
          drop.y = -50
          drop.x = Math.random() * (width + 300) - 150
        }
        ctx.beginPath()
        ctx.moveTo(drop.x, drop.y)
        ctx.lineTo(drop.x - drop.length * sinA, drop.y - drop.length * cosA)
        ctx.stroke()
      }
      ctx.restore()
    }

    // 3. Beat Light Pulse
    if (fx.beatLightPulseEnabled && bands.isBeatHit) {
      ctx.save()
      const pulseAlpha = (fx.beatPulseIntensity / 100) * 0.25
      ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha})`
      ctx.fillRect(0, 0, width, height)
      ctx.restore()
    }

    // 4. Light Rays (Anamorphic God-Rays)
    if (fx.lightRaysEnabled) {
      ctx.save()
      const rayAlpha = (fx.lightRayIntensity / 100) * 0.15
      ctx.globalAlpha = rayAlpha * (1 + bands.mid * 0.5)
      const g = ctx.createLinearGradient(0, 0, width, height)
      g.addColorStop(0, 'rgba(56, 189, 248, 0.4)')
      g.addColorStop(0.5, 'transparent')
      g.addColorStop(1, 'rgba(168, 85, 247, 0.3)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, width, height)
      ctx.restore()
    }
  }

  private renderVisualizer(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: StudioCompositionConfig,
    bands: NormalizedAudioBands,
    freqData: Uint8Array,
    timeData: Uint8Array,
    currentTime: number
  ) {
    if (config.vintageCassette?.enabled) return
    const viz = config.visualizer

    // 1. Audio Spectrum Styles
    if (viz.spectrumStyle === 'circular') {
      this.renderCircularSpectrum(ctx, width, height, viz, freqData, bands)
    } else if (viz.spectrumStyle === 'bars') {
      this.renderVerticalBars(ctx, width, height, viz, freqData, false)
    } else if (viz.spectrumStyle === 'mirrored') {
      this.renderVerticalBars(ctx, width, height, viz, freqData, true)
    } else if (viz.spectrumStyle === 'bottom-equalizer') {
      this.renderBottomEqualizer(ctx, width, height, viz, freqData)
    }

    // 2. Waveform Styles
    if (viz.waveformStyle === 'oscilloscope') {
      this.renderOscilloscope(ctx, width, height, viz, timeData)
    } else if (viz.waveformStyle === 'smooth-center') {
      this.renderSmoothWaveform(ctx, width, height, viz, timeData, false)
    } else if (viz.waveformStyle === 'dual-sided') {
      this.renderSmoothWaveform(ctx, width, height, viz, timeData, true)
    }
  }

  private renderCircularSpectrum(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    viz: StudioCompositionConfig['visualizer'],
    freqData: Uint8Array,
    bands: NormalizedAudioBands
  ) {
    ctx.save()
    const cx = width / 2
    const cy = height / 2
    const baseRadius = viz.spectrumRadius * (1.0 + bands.bass * 0.12)
    const barCount = Math.min(128, viz.barCount)

    // Central circular artwork backing
    if (viz.centerArtworkCircle) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, viz.centerArtworkRadius, 0, Math.PI * 2)
      ctx.fillStyle = '#090A0F'
      ctx.fill()
      ctx.lineWidth = 3
      ctx.strokeStyle = viz.primaryColor
      ctx.stroke()
      ctx.restore()
    }

    const angleStep = (Math.PI * 2) / barCount

    for (let i = 0; i < barCount; i++) {
      const angle = i * angleStep
      const binIdx = Math.floor((i / barCount) * 180)
      const value = (freqData[binIdx] || 0) / 255
      const barHeight = Math.max(4, value * viz.barMaxHeight)

      const x1 = cx + Math.cos(angle) * baseRadius
      const y1 = cy + Math.sin(angle) * baseRadius
      const x2 = cx + Math.cos(angle) * (baseRadius + barHeight)
      const y2 = cy + Math.sin(angle) * (baseRadius + barHeight)

      ctx.strokeStyle = i % 2 === 0 ? viz.primaryColor : viz.secondaryColor
      ctx.lineWidth = viz.barWidth
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    ctx.restore()
  }

  private renderVerticalBars(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    viz: StudioCompositionConfig['visualizer'],
    freqData: Uint8Array,
    mirrored: boolean
  ) {
    ctx.save()
    const barCount = Math.min(128, viz.barCount)
    const totalW = barCount * (viz.barWidth + viz.barGap)
    const startX = (width - totalW) / 2
    const baseY = height * 0.75

    for (let i = 0; i < barCount; i++) {
      const binIdx = Math.floor((i / barCount) * 160)
      const val = (freqData[binIdx] || 0) / 255
      const barH = val * viz.barMaxHeight
      const x = startX + i * (viz.barWidth + viz.barGap)

      const grad = ctx.createLinearGradient(x, baseY, x, baseY - barH)
      grad.addColorStop(0, viz.primaryColor)
      grad.addColorStop(1, viz.secondaryColor)
      ctx.fillStyle = grad

      if (mirrored) {
        ctx.fillRect(x, baseY - barH / 2, viz.barWidth, barH)
      } else {
        ctx.fillRect(x, baseY - barH, viz.barWidth, barH)
      }

      // Peak indicators
      if (viz.showPeakIndicators) {
        if (barH > this.peakHoldValues[i]) {
          this.peakHoldValues[i] = barH
          this.peakHoldDecay[i] = 0
        } else {
          this.peakHoldDecay[i] += 0.8
          this.peakHoldValues[i] = Math.max(0, this.peakHoldValues[i] - this.peakHoldDecay[i])
        }
        ctx.fillStyle = viz.accentColor
        const peakY = mirrored ? baseY - this.peakHoldValues[i] / 2 - 4 : baseY - this.peakHoldValues[i] - 4
        ctx.fillRect(x, peakY, viz.barWidth, 3)
      }
    }

    ctx.restore()
  }

  private renderBottomEqualizer(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    viz: StudioCompositionConfig['visualizer'],
    freqData: Uint8Array
  ) {
    ctx.save()
    const barCount = Math.min(96, viz.barCount)
    const barW = width / barCount
    const baseY = height - 10

    for (let i = 0; i < barCount; i++) {
      const binIdx = Math.floor((i / barCount) * 160)
      const val = (freqData[binIdx] || 0) / 255
      const barH = val * (viz.barMaxHeight * 0.8)

      const x = i * barW
      const g = ctx.createLinearGradient(x, baseY, x, baseY - barH)
      g.addColorStop(0, viz.secondaryColor)
      g.addColorStop(1, viz.primaryColor)

      ctx.fillStyle = g
      ctx.fillRect(x + 1, baseY - barH, barW - 2, barH)
    }
    ctx.restore()
  }

  private renderOscilloscope(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    viz: StudioCompositionConfig['visualizer'],
    timeData: Uint8Array
  ) {
    ctx.save()
    ctx.lineWidth = viz.waveformStrokeWidth
    ctx.strokeStyle = viz.primaryColor
    ctx.shadowColor = viz.primaryColor
    ctx.shadowBlur = 10

    const sliceW = width / timeData.length
    const centerY = height * 0.5
    ctx.beginPath()

    for (let i = 0; i < timeData.length; i++) {
      const v = (timeData[i] - 128) / 128
      const y = centerY + v * viz.waveformHeight
      const x = i * sliceW
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.restore()
  }

  private renderSmoothWaveform(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    viz: StudioCompositionConfig['visualizer'],
    timeData: Uint8Array,
    dualSided: boolean
  ) {
    ctx.save()
    const centerY = height * 0.65
    const step = 8
    const points: Array<{ x: number; y: number }> = []

    for (let i = 0; i < timeData.length; i += step) {
      const v = (timeData[i] - 128) / 128
      const x = (i / timeData.length) * width
      const y = centerY + v * viz.waveformHeight
      points.push({ x, y })
    }

    ctx.strokeStyle = viz.primaryColor
    ctx.lineWidth = viz.waveformStrokeWidth
    ctx.beginPath()

    for (let i = 0; i < points.length; i++) {
      if (i === 0) ctx.moveTo(points[i].x, points[i].y)
      else {
        const xc = (points[i].x + points[i - 1].x) / 2
        const yc = (points[i].y + points[i - 1].y) / 2
        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc)
      }
    }
    ctx.stroke()

    if (dualSided) {
      ctx.beginPath()
      for (let i = 0; i < points.length; i++) {
        const mirrorY = centerY - (points[i].y - centerY)
        if (i === 0) ctx.moveTo(points[i].x, mirrorY)
        else {
          const xc = (points[i].x + points[i - 1].x) / 2
          const yc = centerY - ((points[i].y + points[i - 1].y) / 2 - centerY)
          ctx.quadraticCurveTo(points[i - 1].x, centerY - (points[i - 1].y - centerY), xc, yc)
        }
      }
      ctx.strokeStyle = viz.secondaryColor
      ctx.stroke()
    }

    ctx.restore()
  }

  private renderTypography(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: StudioCompositionConfig,
    currentTime: number,
    duration: number
  ) {
    const text = config.textOverlay
    if (!text.title && !text.artist && !text.subtitle) return

    ctx.save()

    // Calculate fade alpha
    let alpha = 1.0
    if (text.fadeInDuration > 0 && currentTime < text.fadeInDuration) {
      alpha = currentTime / text.fadeInDuration
    } else if (text.fadeOutDuration > 0 && duration > 0 && currentTime > duration - text.fadeOutDuration) {
      alpha = Math.max(0, (duration - currentTime) / text.fadeOutDuration)
    }

    ctx.globalAlpha = Math.max(0, Math.min(1, alpha))

    // Position Y
    let startY = height * 0.82
    if (text.position === 'top') startY = height * 0.15
    else if (text.position === 'middle') startY = height * 0.45

    // Alignment X
    let posX = width / 2
    ctx.textAlign = 'center'
    if (text.alignment === 'left') {
      posX = width * 0.08
      ctx.textAlign = 'left'
    } else if (text.alignment === 'right') {
      posX = width * 0.92
      ctx.textAlign = 'right'
    }

    if (text.hasShadow) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)'
      ctx.shadowBlur = 12
    }

    // Title
    if (text.title) {
      ctx.font = `700 ${text.titleSize}px "${text.fontFamily}", system-ui, -apple-system, sans-serif`
      ctx.fillStyle = text.textColor
      ctx.fillText(text.title, posX, startY)
    }

    // Artist
    if (text.artist) {
      ctx.font = `500 ${text.artistSize}px "${text.fontFamily}", system-ui, -apple-system, sans-serif`
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
      ctx.fillText(text.artist, posX, startY + text.titleSize * 0.75)
    }

    // Subtitle
    if (text.subtitle) {
      ctx.font = `400 ${text.subtitleSize}px "${text.fontFamily}", system-ui, -apple-system, sans-serif`
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'
      ctx.fillText(text.subtitle, posX, startY + text.titleSize * 0.75 + text.artistSize * 0.8)
    }

    ctx.restore()
  }
}
