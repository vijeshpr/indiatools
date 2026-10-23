/**
 * IndiaTools — Vintage Cassette Visualizer
 * Deterministic Canvas 2D Rendering Engine
 */

import {
  VintageCassetteStudioConfig,
  DEFAULT_VINTAGE_CASSETTE_CONFIG,
} from './cassetteTypes.ts'
import { NormalizedAudioBands } from '../audioToVideo/types.ts'

interface GlitchState {
  active: boolean
  triggerTime: number
  duration: number
  intensity: number
  lastTriggerTime: number
  jitterX: number
  jitterY: number
}

export class VintageCassetteEngine {
  private imageCache: Map<string, HTMLImageElement> = new Map()

  // Deterministic rotation physics
  private lastTime: number = 0
  private leftAngle: number = 0
  private rightAngle: number = 0
  private smoothedBass: number = 0
  private currentSpoolRatio: number = 0.35

  // Climax tape glitch state machine
  private glitch: GlitchState = {
    active: false,
    triggerTime: -999,
    duration: 0.38,
    intensity: 0,
    lastTriggerTime: -999,
    jitterX: 0,
    jitterY: 0,
  }

  // Pre-computed grain pattern for deterministic 60fps performance
  private grainCanvas: HTMLCanvasElement | null = null
  private grainCanvases: HTMLCanvasElement[] = []

  constructor() {
    this.initGrainPattern()
  }

  private initGrainPattern() {
    if (typeof document === 'undefined') return
    const size = 128
    this.grainCanvases = []
    for (let c = 0; c < 3; c++) {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      if (!ctx) continue
      const imgData = ctx.createImageData(size, size)
      const data = imgData.data
      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() > 0.42) {
          const v = Math.floor(Math.random() * 200 + 55)
          data[i] = v
          data[i + 1] = v
          data[i + 2] = v
          data[i + 3] = Math.floor(Math.random() * 190 + 65)
        } else {
          data[i + 3] = 0
        }
      }
      ctx.putImageData(imgData, 0, 0)
      this.grainCanvases.push(canvas)
    }
    if (this.grainCanvases.length > 0) {
      this.grainCanvas = this.grainCanvases[0]
    }
  }

  public getCachedImage(url?: string): HTMLImageElement | null {
    if (!url || typeof Image === 'undefined') return null
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
   * Resets simulation state (e.g. on seek or new track)
   */
  public reset(currentTime: number = 0) {
    this.lastTime = currentTime
    this.leftAngle = 0
    this.rightAngle = 0
    this.smoothedBass = 0
    this.currentSpoolRatio = 0.35
    this.glitch.active = false
    this.glitch.lastTriggerTime = -999
  }

  /**
   * Master Render Function
   */
  public render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: VintageCassetteStudioConfig = DEFAULT_VINTAGE_CASSETTE_CONFIG,
    bands?: NormalizedAudioBands,
    timeData?: Uint8Array,
    currentTime: number = 0,
    duration: number = 30
  ) {
    if (!config.enabled) return

    // 1. Advance Physics Integration (stops when audio is paused/ended)
    this.updatePhysics(currentTime, duration, bands, config)

    // 2. Glitch State Evaluation
    this.updateGlitch(currentTime, bands, config)

    ctx.save()

    // Apply glitch camera displacement if active
    if (this.glitch.active && config.climaxGlitchEnabled) {
      ctx.translate(this.glitch.jitterX, this.glitch.jitterY)
    }

    // 3. Render Order:
    // (1) Background and subtle atmosphere preset
    this.renderBackground(ctx, width, height, config, bands, currentTime)

    // Calculate Cassette Geometry (Standard 16:10 / 1.56 aspect ratio with user scale option)
    const scale = (config.cassetteScale ?? 100) / 100
    const baseW = Math.min(width * 0.70, height * 1.08)
    const cassetteW = baseW * scale
    const cassetteH = cassetteW * 0.63
    const cassetteX = (width - cassetteW) / 2
    // Position cassette comfortably high to allow generous room for magnetic tape ribbon below
    const cassetteY = (height - cassetteH) * 0.40

    // (2) Cassette Body Chassis
    this.renderCassetteBody(ctx, cassetteX, cassetteY, cassetteW, cassetteH, config)

    // (3) User photo mapped into central label area
    this.renderCassetteLabel(ctx, cassetteX, cassetteY, cassetteW, cassetteH, config)

    // (4) Independently rotating left and right reel hubs & tape spools
    this.renderReelHubs(ctx, cassetteX, cassetteY, cassetteW, cassetteH, config)

    // (5) Front Faceplate Overlay, Screws, and Glass Sheen
    this.renderFaceplateAndGlass(ctx, cassetteX, cassetteY, cassetteW, cassetteH, config)

    // (6) Audio-Reactive Magnetic Tape Ribbon (Rendered in front of chassis for 100% visibility)
    if (config.tapeRibbonEnabled) {
      this.renderMagneticRibbon(ctx, width, height, cassetteX, cassetteY, cassetteW, cassetteH, config, timeData, currentTime, bands)
    }

    // (7) Finishing Overlays: Analog Film Grain, VHS Scanlines & Climax Glitch
    this.renderAnalogOverlays(ctx, width, height, config, currentTime)

    ctx.restore()
  }

  /**
   * Deterministic Time-Based Physics Integration
   */
  private updatePhysics(
    currentTime: number,
    duration: number,
    bands: NormalizedAudioBands | undefined,
    config: VintageCassetteStudioConfig
  ) {
    const rawDt = currentTime - this.lastTime
    const isPlaying = rawDt > 0.0001
    const dt = isPlaying ? Math.min(0.08, rawDt) : 0
    this.lastTime = currentTime

    if (!isPlaying) {
      // Audio paused or stopped: reels immediately freeze!
      this.smoothedBass *= 0.85
      return
    }

    // Smooth bass energy using exponential decay filter
    const bass = bands?.bass ?? 0
    this.smoothedBass += (bass - this.smoothedBass) * 0.22

    // Angular velocity with bass transient boost
    const baseSpeed = 2.4 * Math.max(0.2, config.reelSpeed)
    const bassFactor = 1.0 + (config.bassReactivity / 100) * this.smoothedBass * 2.8

    // Spool progression (tape moves from left spool to right spool)
    if (config.autoSpoolProgress && duration > 0) {
      this.currentSpoolRatio = Math.max(0.05, Math.min(0.95, currentTime / duration))
    } else {
      this.currentSpoolRatio = config.reelSpoolProgress / 100
    }

    // Left spool unwinds (smaller radius -> faster angular velocity)
    // Right spool winds (larger radius -> slower angular velocity)
    const leftRadiusNorm = Math.max(0.4, 1.0 - this.currentSpoolRatio * 0.6)
    const rightRadiusNorm = Math.max(0.4, 0.4 + this.currentSpoolRatio * 0.6)

    const leftVel = (baseSpeed * bassFactor) / leftRadiusNorm
    const rightVel = (baseSpeed * bassFactor) / rightRadiusNorm

    this.leftAngle = (this.leftAngle + leftVel * dt) % (Math.PI * 2)
    this.rightAngle = (this.rightAngle + rightVel * dt) % (Math.PI * 2)
  }

  /**
   * Climax Tape Glitch Detector
   */
  private updateGlitch(
    currentTime: number,
    bands: NormalizedAudioBands | undefined,
    config: VintageCassetteStudioConfig
  ) {
    if (!config.climaxGlitchEnabled || !bands) {
      this.glitch.active = false
      return
    }

    const energy = bands.overall || (bands.bass * 0.6 + (bands.mid || 0) * 0.4)
    const isClimaxHit = energy >= config.glitchThreshold && bands.isBeatHit

    // Trigger condition: energy above threshold and cooldown elapsed
    if (isClimaxHit && currentTime - this.glitch.lastTriggerTime >= config.glitchCooldownSec) {
      this.glitch.active = true
      this.glitch.triggerTime = currentTime
      this.glitch.lastTriggerTime = currentTime
      this.glitch.intensity = config.glitchIntensity / 100
    }

    // Check if active glitch expired
    if (this.glitch.active) {
      const elapsed = currentTime - this.glitch.triggerTime
      if (elapsed > this.glitch.duration) {
        this.glitch.active = false
        this.glitch.jitterX = 0
        this.glitch.jitterY = 0
      } else {
        const decay = 1.0 - elapsed / this.glitch.duration
        const maxOffset = 18 * this.glitch.intensity * decay
        this.glitch.jitterX = (Math.random() - 0.5) * maxOffset
        this.glitch.jitterY = (Math.random() - 0.5) * (maxOffset * 0.5)
      }
    }
  }

  /**
   * 1. Background & Atmosphere
   */
  private renderBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: VintageCassetteStudioConfig,
    bands: NormalizedAudioBands | undefined,
    currentTime: number
  ) {
    // Check if user uploaded a custom background image
    const customBg = this.getCachedImage(config.customBackgroundUrl)
    if (customBg) {
      ctx.drawImage(customBg, 0, 0, width, height)
      // Subtle dark vignette over custom image for cassette focus
      const vignette = ctx.createRadialGradient(
        width * 0.5, height * 0.5, Math.min(width, height) * 0.25,
        width * 0.5, height * 0.5, Math.max(width, height) * 0.8
      )
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0.12)')
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.75)')
      ctx.fillStyle = vignette
      ctx.fillRect(0, 0, width, height)
      return
    }

    const bassPulse = (bands?.bass ?? 0) * 0.2
    const preset = config.backgroundPreset || 'midnight-studio'

    switch (preset) {
      case 'warm-nostalgia': {
        // Warm Nostalgia — Golden Hour Sunset
        const bgGrad = ctx.createRadialGradient(
          width * 0.55, height * 0.35, Math.min(width, height) * 0.08,
          width * 0.5, height * 0.5, Math.max(width, height) * 0.85
        )
        bgGrad.addColorStop(0, `rgba(${Math.round(75 + bassPulse * 40)}, 36, 16, 1)`)
        bgGrad.addColorStop(0.35, 'rgba(42, 18, 8, 1)')
        bgGrad.addColorStop(0.7, 'rgba(20, 8, 4, 1)')
        bgGrad.addColorStop(1, 'rgba(7, 3, 2, 1)')
        ctx.fillStyle = bgGrad
        ctx.fillRect(0, 0, width, height)

        // Warm golden directional sunset beam from top-right
        const beam = ctx.createLinearGradient(width * 0.85, 0, width * 0.2, height)
        beam.addColorStop(0, 'rgba(255, 170, 70, 0.16)')
        beam.addColorStop(0.5, 'rgba(230, 110, 30, 0.06)')
        beam.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = beam
        ctx.fillRect(0, 0, width, height)

        // Warm central spotlight
        const spot = ctx.createRadialGradient(
          width * 0.5, height * 0.40, 15,
          width * 0.5, height * 0.40, width * 0.45
        )
        spot.addColorStop(0, `rgba(255, 195, 120, ${0.15 + bassPulse * 0.08})`)
        spot.addColorStop(0.55, 'rgba(210, 120, 40, 0.04)')
        spot.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = spot
        ctx.fillRect(0, 0, width, height)
        break
      }

      case 'neon-cyberpunk': {
        // Neon Synthwave — Magenta & Cyan Dark
        const bgGrad = ctx.createRadialGradient(
          width * 0.5, height * 0.42, Math.min(width, height) * 0.1,
          width * 0.5, height * 0.5, Math.max(width, height) * 0.85
        )
        bgGrad.addColorStop(0, `rgba(${Math.round(32 + bassPulse * 25)}, 12, 44, 1)`)
        bgGrad.addColorStop(0.4, 'rgba(14, 8, 26, 1)')
        bgGrad.addColorStop(0.75, 'rgba(7, 5, 15, 1)')
        bgGrad.addColorStop(1, 'rgba(2, 2, 6, 1)')
        ctx.fillStyle = bgGrad
        ctx.fillRect(0, 0, width, height)

        // Left electric magenta spotlight
        const magentaSpot = ctx.createRadialGradient(
          width * 0.22, height * 0.35, 10,
          width * 0.22, height * 0.35, width * 0.45
        )
        magentaSpot.addColorStop(0, `rgba(236, 72, 153, ${0.18 + bassPulse * 0.1})`)
        magentaSpot.addColorStop(0.6, 'rgba(219, 39, 119, 0.03)')
        magentaSpot.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = magentaSpot
        ctx.fillRect(0, 0, width, height)

        // Right electric cyan spotlight
        const cyanSpot = ctx.createRadialGradient(
          width * 0.78, height * 0.35, 10,
          width * 0.78, height * 0.35, width * 0.45
        )
        cyanSpot.addColorStop(0, `rgba(6, 182, 212, ${0.18 + bassPulse * 0.1})`)
        cyanSpot.addColorStop(0.6, 'rgba(8, 145, 178, 0.03)')
        cyanSpot.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = cyanSpot
        ctx.fillRect(0, 0, width, height)

        // Subtle synthwave horizon glow line across lower third
        const horizonY = height * 0.82
        const horizonGrad = ctx.createLinearGradient(0, horizonY, 0, height)
        horizonGrad.addColorStop(0, 'rgba(168, 85, 247, 0.12)')
        horizonGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.04)')
        horizonGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = horizonGrad
        ctx.fillRect(0, horizonY, width, height - horizonY)
        break
      }

      case 'deep-charcoal': {
        // Deep Charcoal — Vinyl Studio Slate
        const bgGrad = ctx.createRadialGradient(
          width * 0.5, height * 0.40, Math.min(width, height) * 0.1,
          width * 0.5, height * 0.5, Math.max(width, height) * 0.85
        )
        bgGrad.addColorStop(0, `rgba(${Math.round(26 + bassPulse * 15)}, 28, 33, 1)`)
        bgGrad.addColorStop(0.45, 'rgba(16, 18, 22, 1)')
        bgGrad.addColorStop(0.8, 'rgba(9, 10, 13, 1)')
        bgGrad.addColorStop(1, 'rgba(4, 5, 7, 1)')
        ctx.fillStyle = bgGrad
        ctx.fillRect(0, 0, width, height)

        // Precision cool-silver overhead key spotlight
        const silverSpot = ctx.createRadialGradient(
          width * 0.5, height * 0.38, 20,
          width * 0.5, height * 0.38, width * 0.42
        )
        silverSpot.addColorStop(0, `rgba(220, 230, 245, ${0.12 + bassPulse * 0.06})`)
        silverSpot.addColorStop(0.6, 'rgba(148, 163, 184, 0.02)')
        silverSpot.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = silverSpot
        ctx.fillRect(0, 0, width, height)
        break
      }

      case 'midnight-studio':
      default: {
        // Midnight Studio — Navy & Amber Spotlight
        const bgGrad = ctx.createRadialGradient(
          width * 0.5, height * 0.40, Math.min(width, height) * 0.08,
          width * 0.5, height * 0.5, Math.max(width, height) * 0.85
        )
        bgGrad.addColorStop(0, `rgba(${Math.round(22 + bassPulse * 20)}, 30, 56, 1)`)
        bgGrad.addColorStop(0.4, 'rgba(10, 14, 30, 1)')
        bgGrad.addColorStop(0.75, 'rgba(5, 7, 18, 1)')
        bgGrad.addColorStop(1, 'rgba(2, 3, 8, 1)')
        ctx.fillStyle = bgGrad
        ctx.fillRect(0, 0, width, height)

        // Focused warm amber studio spotlight over cassette center
        const amberSpot = ctx.createRadialGradient(
          width * 0.5, height * 0.40, 10,
          width * 0.5, height * 0.40, width * 0.46
        )
        amberSpot.addColorStop(0, `rgba(255, 185, 95, ${0.16 + bassPulse * 0.08})`)
        amberSpot.addColorStop(0.5, 'rgba(245, 158, 11, 0.04)')
        amberSpot.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = amberSpot
        ctx.fillRect(0, 0, width, height)
        break
      }
    }
  }

  /**
   * 2. Unraveling Magnetic Tape Ribbon (Audio-Reactive Flow)
   */
  private renderMagneticRibbon(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    cX: number,
    cY: number,
    cW: number,
    cH: number,
    config: VintageCassetteStudioConfig,
    timeData: Uint8Array | undefined,
    currentTime: number,
    bands?: NormalizedAudioBands
  ) {
    ctx.save()

    // Tape guide rollers on bottom trapezoid of the cassette
    const leftGuideX = cX + cW * 0.285
    const rightGuideX = cX + cW * 0.715
    const exitY = cY + cH * 0.94
    const bottomRoom = Math.max(70, height - exitY - 20)

    const sensitivity = (config.waveformIntensity / 100)
    const thickness = Math.max(3, config.ribbonThickness)
    const style = config.tapeRibbonStyle

    const bass = bands?.bass ?? 0
    const mid = bands?.mid ?? 0
    const treble = bands?.treble ?? 0
    const hasAudio = (bands && (bands.overall > 0.015 || bass > 0.04))

    // Waveform modulation amplitude
    const amp = sensitivity * Math.min(bottomRoom * 0.45, 55)
    const bassDrape = bass * bottomRoom * 0.22 * sensitivity

    // Sample time domain data (64 samples)
    const sampleCount = 64
    const waveOffsets: number[] = []
    if (timeData && timeData.length > 0 && hasAudio) {
      const step = Math.floor(timeData.length / sampleCount)
      for (let i = 0; i < sampleCount; i++) {
        const val = (timeData[i * step] - 128) / 128
        waveOffsets.push(val * amp)
      }
    } else {
      // Gentle calm resting physics when audio is paused or silent
      for (let i = 0; i < sampleCount; i++) {
        waveOffsets.push(Math.sin(currentTime * 0.8 + i * 0.12) * 2)
      }
    }

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const ribbonColor = config.ribbonColor || '#3A281E'

    if (style === 'loose-flowing') {
      // Natural loose S-curves looping organically below the cassette
      const cp1X = leftGuideX - cW * 0.10 + (waveOffsets[8] || 0)
      const cp1Y = exitY + bottomRoom * 0.55 + bassDrape + (waveOffsets[12] || 0) * 0.6

      const cp2X = cX + cW * 0.48 + Math.sin(currentTime * 1.2) * 35 * (hasAudio ? 1 : 0.2) + (waveOffsets[28] || 0)
      const cp2Y = exitY + bottomRoom * 0.82 + bassDrape + (waveOffsets[32] || 0)

      const cp3X = rightGuideX + cW * 0.10 + (waveOffsets[48] || 0)
      const cp3Y = exitY + bottomRoom * 0.52 + bassDrape + (waveOffsets[52] || 0) * 0.6

      // 1. Soft Ambient Drop Shadow onto backdrop
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.65)'
      ctx.lineWidth = thickness + 4
      ctx.beginPath()
      ctx.moveTo(leftGuideX, exitY + 4)
      ctx.bezierCurveTo(cp1X, cp1Y + 8, cp2X, cp2Y + 8, rightGuideX, exitY + 4)
      ctx.stroke()

      // 2. Atmospheric Audio Glow
      if (config.ribbonGlow > 0) {
        ctx.strokeStyle = ribbonColor === '#3A281E' ? 'rgba(217, 119, 6, 0.35)' : ribbonColor
        ctx.lineWidth = thickness + 8
        ctx.shadowColor = ribbonColor
        ctx.shadowBlur = config.ribbonGlow * 0.3
        ctx.beginPath()
        ctx.moveTo(leftGuideX, exitY)
        ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, rightGuideX, exitY)
        ctx.stroke()
        ctx.shadowBlur = 0
      }

      // 3. Main Magnetic Oxide Ribbon Core
      const ribbonGrad = ctx.createLinearGradient(leftGuideX, exitY, rightGuideX, exitY + bottomRoom)
      ribbonGrad.addColorStop(0, '#1E120B')
      ribbonGrad.addColorStop(0.5, ribbonColor)
      ribbonGrad.addColorStop(1, '#24140D')
      ctx.strokeStyle = ribbonGrad
      ctx.lineWidth = thickness
      ctx.beginPath()
      ctx.moveTo(leftGuideX, exitY)
      ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, rightGuideX, exitY)
      ctx.stroke()

      // 4. Glossy Specular Ridge along upper edge
      ctx.strokeStyle = 'rgba(255, 235, 205, 0.70)'
      ctx.lineWidth = Math.max(1.2, thickness * 0.18)
      ctx.beginPath()
      ctx.moveTo(leftGuideX, exitY)
      ctx.bezierCurveTo(cp1X - 2, cp1Y - 2, cp2X - 2, cp2Y - 2, rightGuideX, exitY)
      ctx.stroke()

      // 5. Secondary inner dangling tape loop (classic loose mixtape loop)
      const innerCp1X = leftGuideX + cW * 0.08 + (waveOffsets[16] || 0) * 0.4
      const innerCp1Y = exitY + bottomRoom * 0.28 + bassDrape * 0.5 + (waveOffsets[20] || 0) * 0.4
      const innerCp2X = rightGuideX - cW * 0.08 + (waveOffsets[40] || 0) * 0.4
      const innerCp2Y = exitY + bottomRoom * 0.30 + bassDrape * 0.5 + (waveOffsets[44] || 0) * 0.4

      ctx.strokeStyle = 'rgba(38, 22, 14, 0.85)'
      ctx.lineWidth = Math.max(2, thickness * 0.65)
      ctx.beginPath()
      ctx.moveTo(leftGuideX + cW * 0.06, exitY)
      ctx.bezierCurveTo(innerCp1X, innerCp1Y, innerCp2X, innerCp2Y, rightGuideX - cW * 0.06, exitY)
      ctx.stroke()

      ctx.strokeStyle = 'rgba(255, 215, 175, 0.45)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(leftGuideX + cW * 0.06, exitY)
      ctx.bezierCurveTo(innerCp1X - 1, innerCp1Y - 1, innerCp2X - 1, innerCp2Y - 1, rightGuideX - cW * 0.06, exitY)
      ctx.stroke()

    } else if (style === 'symmetrical-ribbon') {
      // Twin looping ribbons branching left and right
      const midY = exitY + bottomRoom * 0.45 + bassDrape

      // Left branch loop
      ctx.strokeStyle = ribbonColor
      ctx.lineWidth = thickness
      ctx.beginPath()
      ctx.moveTo(leftGuideX, exitY)
      ctx.bezierCurveTo(
        leftGuideX - cW * 0.20 + (waveOffsets[10] || 0),
        midY + (waveOffsets[14] || 0),
        cX + cW * 0.35 + (waveOffsets[20] || 0),
        midY + bottomRoom * 0.35,
        cX + cW * 0.5,
        exitY + bottomRoom * 0.5
      )
      ctx.stroke()

      // Left specular
      ctx.strokeStyle = 'rgba(255, 235, 205, 0.65)'
      ctx.lineWidth = Math.max(1, thickness * 0.16)
      ctx.beginPath()
      ctx.moveTo(leftGuideX, exitY)
      ctx.bezierCurveTo(
        leftGuideX - cW * 0.20 + (waveOffsets[10] || 0) - 2,
        midY + (waveOffsets[14] || 0) - 2,
        cX + cW * 0.35 + (waveOffsets[20] || 0) - 2,
        midY + bottomRoom * 0.35 - 2,
        cX + cW * 0.5,
        exitY + bottomRoom * 0.5
      )
      ctx.stroke()

      // Right branch loop
      ctx.beginPath()
      ctx.moveTo(rightGuideX, exitY)
      ctx.bezierCurveTo(
        rightGuideX + cW * 0.20 - (waveOffsets[30] || 0),
        midY + (waveOffsets[34] || 0),
        cX + cW * 0.65 - (waveOffsets[40] || 0),
        midY + bottomRoom * 0.35,
        cX + cW * 0.5,
        exitY + bottomRoom * 0.5
      )
      ctx.stroke()

      // Right specular
      ctx.strokeStyle = 'rgba(255, 235, 205, 0.65)'
      ctx.lineWidth = Math.max(1, thickness * 0.16)
      ctx.beginPath()
      ctx.moveTo(rightGuideX, exitY)
      ctx.bezierCurveTo(
        rightGuideX + cW * 0.20 - (waveOffsets[30] || 0) - 2,
        midY + (waveOffsets[34] || 0) - 2,
        cX + cW * 0.65 - (waveOffsets[40] || 0) - 2,
        midY + bottomRoom * 0.35 - 2,
        cX + cW * 0.5,
        exitY + bottomRoom * 0.5
      )
      ctx.stroke()

    } else {
      // Cinematic Trail: Continuous wave undulating across bottom frame
      const startX = width * 0.06
      const endX = width * 0.94
      const baseWaveY = exitY + bottomRoom * 0.45 + bassDrape * 0.4

      ctx.strokeStyle = ribbonColor
      ctx.lineWidth = thickness
      ctx.beginPath()
      ctx.moveTo(startX, baseWaveY + (waveOffsets[0] || 0))
      for (let i = 1; i < sampleCount; i++) {
        const x = startX + (i / (sampleCount - 1)) * (endX - startX)
        const y = baseWaveY + (waveOffsets[i] || 0)
        ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Specular highlight line along trail
      ctx.strokeStyle = 'rgba(255, 235, 205, 0.70)'
      ctx.lineWidth = Math.max(1.2, thickness * 0.18)
      ctx.beginPath()
      ctx.moveTo(startX, baseWaveY + (waveOffsets[0] || 0) - 1.5)
      for (let i = 1; i < sampleCount; i++) {
        const x = startX + (i / (sampleCount - 1)) * (endX - startX)
        const y = baseWaveY + (waveOffsets[i] || 0) - 1.5
        ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Feed lines from cassette guide holes to waveform trail
      ctx.strokeStyle = ribbonColor
      ctx.lineWidth = thickness * 0.8
      ctx.beginPath()
      ctx.moveTo(leftGuideX, exitY)
      ctx.lineTo(startX + (endX - startX) * 0.25, baseWaveY + (waveOffsets[16] || 0))
      ctx.moveTo(rightGuideX, exitY)
      ctx.lineTo(startX + (endX - startX) * 0.75, baseWaveY + (waveOffsets[48] || 0))
      ctx.stroke()
    }

    // 6. Draw Brass Capstan Guide Pins at Tape Exit Points
    this.drawTapeGuidePin(ctx, leftGuideX, exitY)
    this.drawTapeGuidePin(ctx, rightGuideX, exitY)

    ctx.restore()
  }

  private drawTapeGuidePin(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y - 2, 4.5, 0, Math.PI * 2)
    ctx.fillStyle = '#B45309'
    ctx.fill()
    ctx.strokeStyle = '#FDE68A'
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.restore()
  }

  /**
   * 3. Cassette Body Chassis
   */
  private renderCassetteBody(
    ctx: CanvasRenderingContext2D,
    cX: number,
    cY: number,
    cW: number,
    cH: number,
    config: VintageCassetteStudioConfig
  ) {
    ctx.save()

    const cornerRadius = cW * 0.024
    const opacity = config.shellOpacity / 100

    // Try rendering photo-realistic body asset if available
    const bodyImg = this.getCachedImage('/images/cassette/cassette-body.png')
    if (bodyImg) {
      ctx.globalAlpha = opacity
      ctx.drawImage(bodyImg, cX, cY, cW, cH)
      ctx.globalAlpha = 1.0
      ctx.restore()
      return
    }

    // Procedural Vector Cassette Shell (Crisp, High-Detail 1990s Polycarbonate)
    // 1. Soft Drop Shadow behind the cassette
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)'
    ctx.shadowBlur = 35
    ctx.shadowOffsetY = 16

    // 2. Outer Chassis Bevel
    this.drawRoundedRect(ctx, cX, cY, cW, cH, cornerRadius)

    switch (config.cassetteStyle) {
      case 'classic-retro':
        // Vintage 1980s Ivory / Warm Beige Studio Plastic
        ctx.fillStyle = `rgba(224, 216, 198, ${opacity})`
        break
      case 'golden-edition':
        // Metallic Gold Anodized Chassis
        const goldGrad = ctx.createLinearGradient(cX, cY, cX + cW, cY + cH)
        goldGrad.addColorStop(0, `rgba(180, 130, 45, ${opacity})`)
        goldGrad.addColorStop(0.5, `rgba(240, 200, 110, ${opacity})`)
        goldGrad.addColorStop(1, `rgba(140, 95, 30, ${opacity})`)
        ctx.fillStyle = goldGrad
        break
      case 'transparent-clear':
        // High-clarity clear acrylic shell
        ctx.fillStyle = `rgba(240, 245, 255, ${opacity * 0.32})`
        break
      case 'smoked-black':
      default:
        // Authentic 1990s Smoked-Black Translucent Polycarbonate
        const smokeGrad = ctx.createLinearGradient(cX, cY, cX, cY + cH)
        smokeGrad.addColorStop(0, `rgba(32, 34, 40, ${opacity})`)
        smokeGrad.addColorStop(0.5, `rgba(18, 20, 24, ${opacity})`)
        smokeGrad.addColorStop(1, `rgba(10, 12, 15, ${opacity})`)
        ctx.fillStyle = smokeGrad
        break
    }
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.shadowOffsetY = 0

    // 3. Subtle Outer Border Stroke
    ctx.strokeStyle = config.cassetteStyle === 'golden-edition'
      ? 'rgba(255, 220, 140, 0.45)'
      : 'rgba(255, 255, 255, 0.16)'
    ctx.lineWidth = Math.max(1.5, cW * 0.003)
    ctx.stroke()

    // 4. Authentic lower trapezoid head-access notch
    const trapW = cW * 0.62
    const trapH = cH * 0.22
    const trapX = cX + (cW - trapW) / 2
    const trapY = cY + cH - trapH

    ctx.beginPath()
    ctx.moveTo(trapX + trapW * 0.06, trapY)
    ctx.lineTo(trapX + trapW * 0.94, trapY)
    ctx.lineTo(trapX + trapW, trapY + trapH)
    ctx.lineTo(trapX, trapY + trapH)
    ctx.closePath()

    ctx.fillStyle = config.cassetteStyle === 'classic-retro'
      ? 'rgba(200, 192, 175, 0.95)'
      : 'rgba(12, 13, 16, 0.85)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
    ctx.stroke()

    // 5. Tape head access window holes (guide rollers and capstan holes)
    const holeRadius = cW * 0.016
    const holeY = trapY + trapH * 0.55
    const holePositions = [
      trapX + trapW * 0.18,
      trapX + trapW * 0.38,
      trapX + trapW * 0.62,
      trapX + trapW * 0.82,
    ]
    ctx.fillStyle = 'rgba(4, 5, 6, 0.95)'
    for (const hX of holePositions) {
      ctx.beginPath()
      ctx.arc(hX, holeY, holeRadius, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.stroke()
    }

    // 6. Corner Assembly Screws (4 corners + 1 top center)
    const screwRadius = cW * 0.010
    const screwMargin = cW * 0.035
    const screwPositions = [
      { x: cX + screwMargin, y: cY + screwMargin },
      { x: cX + cW - screwMargin, y: cY + screwMargin },
      { x: cX + screwMargin, y: cY + cH - screwMargin },
      { x: cX + cW - screwMargin, y: cY + cH - screwMargin },
      { x: cX + cW * 0.5, y: cY + screwMargin * 0.85 },
    ]

    for (const s of screwPositions) {
      this.drawScrew(ctx, s.x, s.y, screwRadius, config.cassetteStyle === 'golden-edition')
    }

    ctx.restore()
  }

  /**
   * 4. Custom Photo Label with Templates
   */
  private renderCassetteLabel(
    ctx: CanvasRenderingContext2D,
    cX: number,
    cY: number,
    cW: number,
    cH: number,
    config: VintageCassetteStudioConfig
  ) {
    ctx.save()

    // Outer Label Bounds (occupies top central portion of cassette)
    const labelW = cW * 0.82
    const labelH = cH * 0.56
    const labelX = cX + (cW - labelW) / 2
    const labelY = cY + cH * 0.11
    const cornerRadius = cW * 0.018

    // Spool Window Cutout Dimensions (center hole where spools peek through)
    const winW = cW * 0.48
    const winH = cH * 0.28
    const winX = cX + (cW - winW) / 2
    const winY = labelY + (labelH - winH) / 2 + cH * 0.03
    const winR = winH * 0.5 // Pill shape

    // 1. Clip to Outer Label Rectangle
    ctx.beginPath()
    this.drawRoundedRectPath(ctx, labelX, labelY, labelW, labelH, cornerRadius)
    ctx.clip()

    // 2. Base Label Paper Background based on template
    this.renderLabelBackground(ctx, labelX, labelY, labelW, labelH, config.labelTemplate)

    // 3. User Photo Mapped into Label
    const photoImg = this.getCachedImage(config.labelPhotoUrl)
    if (photoImg) {
      ctx.save()
      // Optional subtle photo opacity when transparent template selected
      ctx.globalAlpha = config.labelTemplate === 'transparent' ? 0.45 : 0.88

      // Apply crop math preserving aspect ratio
      const zoom = config.labelPhotoZoom / 100
      const imgAspect = photoImg.naturalWidth / photoImg.naturalHeight
      const labelAspect = labelW / labelH

      let drawW = labelW
      let drawH = labelH
      if (config.labelPhotoFit === 'cover') {
        if (imgAspect > labelAspect) {
          drawH = labelH * zoom
          drawW = drawH * imgAspect
        } else {
          drawW = labelW * zoom
          drawH = drawW / imgAspect
        }
      } else {
        // Contain
        if (imgAspect > labelAspect) {
          drawW = labelW * zoom
          drawH = drawW / imgAspect
        } else {
          drawH = labelH * zoom
          drawW = drawH * imgAspect
        }
      }

      const drawX = labelX + (labelW - drawW) / 2 + config.labelPhotoOffsetX
      const drawY = labelY + (labelH - drawH) / 2 + config.labelPhotoOffsetY

      ctx.drawImage(photoImg, drawX, drawY, drawW, drawH)
      ctx.restore()
    }

    // 4. Punch out the central transparent tape window from the label
    // Using destination-out composite mode so spools underneath are 100% visible!
    ctx.save()
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    this.drawRoundedRectPath(ctx, winX, winY, winW, winH, winR)
    ctx.fill()
    ctx.restore()

    // 5. Label Typography & Template Overlays
    this.renderLabelGraphics(ctx, labelX, labelY, labelW, labelH, winX, winY, winW, winH, config)

    ctx.restore()
  }

  private renderLabelBackground(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    template: VintageCassetteStudioConfig['labelTemplate']
  ) {
    switch (template) {
      case 'transparent':
        // Minimalist clear label with frosted border
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
        ctx.fillRect(x, y, w, h)
        break
      case 'neon':
        // Synthwave dark gradient with glowing grid
        const neonGrad = ctx.createLinearGradient(x, y, x, y + h)
        neonGrad.addColorStop(0, 'rgba(26, 12, 44, 0.95)')
        neonGrad.addColorStop(1, 'rgba(8, 6, 20, 0.98)')
        ctx.fillStyle = neonGrad
        ctx.fillRect(x, y, w, h)
        break
      case 'grunge':
        // Worn aged yellowed paper
        ctx.fillStyle = 'rgba(235, 222, 198, 0.95)'
        ctx.fillRect(x, y, w, h)
        break
      case 'classic':
      default:
        // Authentic 1990s white/off-white coated paper label
        const paperGrad = ctx.createLinearGradient(x, y, x, y + h)
        paperGrad.addColorStop(0, 'rgba(248, 248, 250, 0.96)')
        paperGrad.addColorStop(1, 'rgba(235, 236, 240, 0.96)')
        ctx.fillStyle = paperGrad
        ctx.fillRect(x, y, w, h)
        break
    }
  }

  private renderLabelGraphics(
    ctx: CanvasRenderingContext2D,
    lx: number,
    ly: number,
    lw: number,
    lh: number,
    wx: number,
    wy: number,
    ww: number,
    wh: number,
    config: VintageCassetteStudioConfig
  ) {
    const isDark = config.labelTemplate === 'neon' || config.labelTemplate === 'transparent'
    const textColor = isDark ? '#FFFFFF' : '#1F2937'
    const subColor = isDark ? '#A5B4FC' : '#6B7280'
    const accentLine = config.labelTemplate === 'neon' ? '#EC4899' : '#DC2626'

    ctx.save()

    // 1. Top Header Bar & Side Tag ("SIDE A" / "SIDE B")
    const sideBoxW = lw * 0.16
    const sideBoxH = lh * 0.18
    const sideBoxX = lx + lw * 0.05
    const sideBoxY = ly + lh * 0.08

    ctx.fillStyle = config.labelTemplate === 'neon' ? '#8B5CF6' : accentLine
    ctx.fillRect(sideBoxX, sideBoxY, sideBoxW, sideBoxH)

    ctx.fillStyle = '#FFFFFF'
    ctx.font = `bold ${Math.round(lh * 0.10)}px monospace, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(config.labelSideText, sideBoxX + sideBoxW / 2, sideBoxY + sideBoxH / 2)

    // 2. Ruled Write-in Lines (Classic / Grunge template)
    if (config.labelTemplate === 'classic' || config.labelTemplate === 'grunge') {
      ctx.strokeStyle = config.labelTemplate === 'grunge' ? 'rgba(120, 80, 50, 0.25)' : 'rgba(200, 205, 215, 0.6)'
      ctx.lineWidth = 1
      const lineY1 = ly + lh * 0.16
      const lineY2 = ly + lh * 0.28
      ctx.beginPath()
      ctx.moveTo(sideBoxX + sideBoxW + lw * 0.04, lineY1)
      ctx.lineTo(lx + lw * 0.94, lineY1)
      ctx.moveTo(sideBoxX + sideBoxW + lw * 0.04, lineY2)
      ctx.lineTo(lx + lw * 0.94, lineY2)
      ctx.stroke()
    }

    // 3. Custom Mixtape Title & Artist Name
    if (config.labelTitle) {
      ctx.fillStyle = textColor
      ctx.font = `600 ${Math.round(lh * 0.11)}px sans-serif`
      ctx.textAlign = 'left'
      ctx.textBaseline = 'bottom'
      ctx.fillText(config.labelTitle.toUpperCase(), sideBoxX + sideBoxW + lw * 0.05, ly + lh * 0.15, lw * 0.68)
    }

    if (config.labelArtist) {
      ctx.fillStyle = subColor
      ctx.font = `400 ${Math.round(lh * 0.085)}px sans-serif`
      ctx.textAlign = 'left'
      ctx.textBaseline = 'bottom'
      ctx.fillText(config.labelArtist.toUpperCase(), sideBoxX + sideBoxW + lw * 0.05, ly + lh * 0.27, lw * 0.68)
    }

    // 4. Border outline around window cutout
    ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.2)'
    ctx.lineWidth = Math.max(1, lw * 0.003)
    this.drawRoundedRect(ctx, wx - 1, wy - 1, ww + 2, wh + 2, wh * 0.5)

    // 5. Tape Length Marks (100 | 50 | 0) along window
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.5)'
    ctx.font = `${Math.round(lh * 0.065)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText('100', wx + ww * 0.25, wy + wh + lh * 0.065)
    ctx.fillText('50', wx + ww * 0.5, wy + wh + lh * 0.065)
    ctx.fillText('0', wx + ww * 0.75, wy + wh + lh * 0.065)

    ctx.restore()
  }

  /**
   * 5. Independently Rotating Reel Hubs & Tape Spool Cakes
   */
  private renderReelHubs(
    ctx: CanvasRenderingContext2D,
    cX: number,
    cY: number,
    cW: number,
    cH: number,
    config: VintageCassetteStudioConfig
  ) {
    ctx.save()

    // Hub centers
    const leftCenterX = cX + cW * 0.355
    const rightCenterX = cX + cW * 0.645
    const hubCenterY = cY + cH * 0.44

    const maxSpoolRadius = cW * 0.115
    const minSpoolRadius = cW * 0.062
    const hubRadius = cW * 0.048

    // Left spool unwinds (smaller), right spool winds (larger)
    const leftSpoolRadius = minSpoolRadius + (1.0 - this.currentSpoolRatio) * (maxSpoolRadius - minSpoolRadius)
    const rightSpoolRadius = minSpoolRadius + this.currentSpoolRatio * (maxSpoolRadius - minSpoolRadius)

    // A. Draw Wound Magnetic Tape Cakes (Dark Brown Oxide Rings)
    this.drawTapeSpoolCake(ctx, leftCenterX, hubCenterY, leftSpoolRadius, hubRadius)
    this.drawTapeSpoolCake(ctx, rightCenterX, hubCenterY, rightSpoolRadius, hubRadius)

    // B. Draw Left and Right 3-Tooth Drive Hubs
    const reelImg = this.getCachedImage('/images/cassette/cassette-reel.png')

    // Left Reel
    ctx.save()
    ctx.translate(leftCenterX, hubCenterY)
    ctx.rotate(this.leftAngle)
    if (reelImg) {
      ctx.drawImage(reelImg, -hubRadius, -hubRadius, hubRadius * 2, hubRadius * 2)
    } else {
      this.drawProceduralReelHub(ctx, hubRadius, config.cassetteStyle === 'golden-edition')
    }
    ctx.restore()

    // Right Reel
    ctx.save()
    ctx.translate(rightCenterX, hubCenterY)
    ctx.rotate(this.rightAngle)
    if (reelImg) {
      ctx.drawImage(reelImg, -hubRadius, -hubRadius, hubRadius * 2, hubRadius * 2)
    } else {
      this.drawProceduralReelHub(ctx, hubRadius, config.cassetteStyle === 'golden-edition')
    }
    ctx.restore()

    ctx.restore()
  }

  private drawTapeSpoolCake(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    outerR: number,
    innerR: number
  ) {
    if (outerR <= innerR + 1) return

    ctx.save()
    // Tape Cake Body
    const grad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR)
    grad.addColorStop(0, '#261812')
    grad.addColorStop(0.7, '#3A281E')
    grad.addColorStop(1, '#1A100C')
    ctx.fillStyle = grad

    ctx.beginPath()
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2)
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true)
    ctx.fill()

    // Concentric winding lines
    ctx.strokeStyle = 'rgba(255, 230, 200, 0.08)'
    ctx.lineWidth = 1
    const steps = 4
    for (let s = 1; s <= steps; s++) {
      const r = innerR + (outerR - innerR) * (s / (steps + 1))
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.stroke()
    }

    ctx.restore()
  }

  /**
   * Procedural Authentic 3-Tooth Compact Cassette Reel Hub
   */
  private drawProceduralReelHub(
    ctx: CanvasRenderingContext2D,
    radius: number,
    isGold: boolean
  ) {
    // 1. Hub Outer Ring
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.fillStyle = isGold ? '#D97706' : '#F3F4F6'
    ctx.fill()
    ctx.strokeStyle = isGold ? '#92400E' : '#9CA3AF'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // 2. Central Drive Axle Hole
    const innerHoleRadius = radius * 0.44
    ctx.beginPath()
    ctx.arc(0, 0, innerHoleRadius, 0, Math.PI * 2)
    ctx.fillStyle = '#090A0F'
    ctx.fill()
    ctx.strokeStyle = isGold ? '#B45309' : '#D1D5DB'
    ctx.lineWidth = 1
    ctx.stroke()

    // 3. Three Triangular Teeth / Drive Spokes
    const toothCount = 3
    ctx.fillStyle = isGold ? '#F59E0B' : '#E5E7EB'
    ctx.strokeStyle = isGold ? '#78350F' : '#6B7280'
    ctx.lineWidth = 1

    for (let i = 0; i < toothCount; i++) {
      const angle = (i * (Math.PI * 2)) / toothCount
      ctx.save()
      ctx.rotate(angle)

      ctx.beginPath()
      ctx.moveTo(innerHoleRadius * 0.95, -radius * 0.14)
      ctx.lineTo(radius * 0.88, 0)
      ctx.lineTo(innerHoleRadius * 0.95, radius * 0.14)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      ctx.restore()
    }
  }

  /**
   * 6. Faceplate Overlays, Screws, and Plastic Glass Sheen
   */
  private renderFaceplateAndGlass(
    ctx: CanvasRenderingContext2D,
    cX: number,
    cY: number,
    cW: number,
    cH: number,
    config: VintageCassetteStudioConfig
  ) {
    ctx.save()

    // Diagonal Glass Specular Sheen across entire cassette
    const sheenGrad = ctx.createLinearGradient(cX, cY, cX + cW, cY + cH)
    sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.10)')
    sheenGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.03)')
    sheenGrad.addColorStop(0.48, 'rgba(255, 255, 255, 0.14)')
    sheenGrad.addColorStop(0.52, 'rgba(255, 255, 255, 0.02)')
    sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0.05)')

    ctx.fillStyle = sheenGrad
    this.drawRoundedRect(ctx, cX, cY, cW, cH, cW * 0.024)
    ctx.fill()

    ctx.restore()
  }

  /**
   * 7. Analog Finishing Overlays: Film Grain, VHS Scanlines & Climax Glitch
   */
  private renderAnalogOverlays(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: VintageCassetteStudioConfig,
    currentTime: number
  ) {
    ctx.save()

    // A. VHS Scanlines Overlay
    if (config.vhsScanlines) {
      const intensity = (config.scanlineIntensity || 18) / 100
      const scanStep = 4
      const crawl = Math.floor((currentTime * 24) % scanStep)
      const shadowAlpha = intensity * 0.45
      const phosphorAlpha = intensity * 0.08

      // 1. Alternating CRT shadow lines
      ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`
      for (let y = crawl; y < height; y += scanStep) {
        ctx.fillRect(0, y, width, 1.8)
      }

      // 2. Faint CRT phosphor glow lines between shadows
      ctx.fillStyle = `rgba(255, 255, 255, ${phosphorAlpha})`
      for (let y = crawl + 2; y < height; y += scanStep * 2) {
        ctx.fillRect(0, y, width, 0.8)
      }

      // 3. Subtle slow-moving VHS tracking beam bar
      const beamY = ((currentTime * 50) % (height + 250)) - 100
      const beamH = Math.min(60, height * 0.08)
      const beamGrad = ctx.createLinearGradient(0, beamY, 0, beamY + beamH)
      beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0)')
      beamGrad.addColorStop(0.5, `rgba(255, 255, 255, ${0.05 * intensity})`)
      beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = beamGrad
      ctx.fillRect(0, beamY, width, beamH)
    }

    // B. Living Analog Film Grain (Dynamically animated frame-to-frame noise)
    if (config.analogGrain) {
      const grainIntensity = (config.grainIntensity || 22) / 100
      this.renderDynamicGrain(ctx, width, height, grainIntensity, currentTime)
    }

    // C. Climax Glitch RGB Chromatic Aberration & Scan Tracking Line
    if (this.glitch.active && config.climaxGlitchEnabled) {
      const intensity = this.glitch.intensity
      const bandY = ((currentTime * 180) % height)
      const bandH = Math.min(120, height * 0.15)

      ctx.fillStyle = `rgba(255, 255, 255, ${0.12 * intensity})`
      ctx.fillRect(0, bandY, width, bandH)

      ctx.fillStyle = `rgba(0, 240, 255, ${0.18 * intensity})`
      ctx.fillRect(0, bandY + 4, width, 3)
      ctx.fillStyle = `rgba(255, 0, 128, ${0.18 * intensity})`
      ctx.fillRect(0, bandY + bandH - 4, width, 3)
    }

    ctx.restore()
  }

  private renderDynamicGrain(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    intensity: number,
    currentTime: number
  ) {
    if (!this.grainCanvases || this.grainCanvases.length === 0) return
    ctx.save()
    const frameIdx = Math.floor(currentTime * 24) % this.grainCanvases.length
    const canvas = this.grainCanvases[frameIdx]
    const offsetX = Math.floor((Math.sin(currentTime * 91) * 300) % 128)
    const offsetY = Math.floor((Math.cos(currentTime * 73) * 300) % 128)

    ctx.translate(offsetX, offsetY)
    ctx.globalAlpha = intensity * 0.28
    ctx.globalCompositeOperation = 'screen'
    const pattern = ctx.createPattern(canvas, 'repeat')
    if (pattern) {
      ctx.fillStyle = pattern
      ctx.fillRect(-offsetX, -offsetY, width, height)
    }
    ctx.restore()
  }

  /**
   * Utility: Draw Corner Screw with Slot
   */
  private drawScrew(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    isGold: boolean
  ) {
    ctx.save()
    // Screw Head
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fillStyle = isGold ? '#D97706' : '#4B5563'
    ctx.fill()
    ctx.strokeStyle = isGold ? '#78350F' : '#1F2937'
    ctx.lineWidth = 1
    ctx.stroke()

    // Cross / Phillips Slot
    ctx.strokeStyle = isGold ? '#92400E' : '#111827'
    ctx.lineWidth = Math.max(1, radius * 0.3)
    ctx.beginPath()
    ctx.moveTo(x - radius * 0.55, y)
    ctx.lineTo(x + radius * 0.55, y)
    ctx.moveTo(x, y - radius * 0.55)
    ctx.lineTo(x, y + radius * 0.55)
    ctx.stroke()
    ctx.restore()
  }

  /**
   * Utility: Rounded Rect Helpers
   */
  private drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) {
    ctx.beginPath()
    this.drawRoundedRectPath(ctx, x, y, w, h, r)
  }

  private drawRoundedRectPath(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) {
    const radius = Math.min(r, w / 2, h / 2)
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + w - radius, y)
    ctx.arcTo(x + w, y, x + w, y + radius, radius)
    ctx.lineTo(x + w, y + h - radius)
    ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius)
    ctx.lineTo(x + radius, y + h)
    ctx.arcTo(x, y + h, x, y + h - radius, radius)
    ctx.lineTo(x, y + radius)
    ctx.arcTo(x, y, x + radius, y, radius)
    ctx.closePath()
  }
}

export const vintageCassetteEngine = new VintageCassetteEngine()
