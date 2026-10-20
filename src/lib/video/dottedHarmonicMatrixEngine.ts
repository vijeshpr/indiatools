/**
 * IndiaTools — Audio Spectrum Video Studio 2.0
 * Dotted Harmonic Matrix Engine
 * Full-Screen Photo Halftone + Audio-Reactive Liquid Dispersion Studio
 *
 * Implements:
 * 1. Full-screen responsive dot matrix from (0,0) to (width, height)
 * 2. Real photo-mapped halftone sampling with 3 rendering modes:
 *    - Photo Inside Dots
 *    - Luminance Size Mapping
 *    - Neon Tint Overlay
 * 3. Audio-reactive dot geometry (FFT energy, center bass radial expansion, treble sparkles)
 * 4. Scattered liquid ripple physics (spring restoration, tangential swirl, Gaussian falloff)
 * 5. Velocity-based droplet elongation & ambient sine flow field
 * 6. High-performance cached sampling (zero per-frame getImageData calls)
 */

import {
  DetailedAudioBands,
  ThemeColors,
  DottedMatrixConfig,
  DottedMatrixDensity,
} from './audioVisualizerTypes'
import { VisualizerRenderContext } from './visualizerEngines'

export interface LiquidDot {
  baseX: number
  baseY: number
  currentX: number
  currentY: number
  vx: number
  vy: number
  radius: number
  targetRadius: number
  luminance: number
  r: number
  g: number
  b: number
}

export interface RippleEpicenter {
  x: number
  y: number
  strength: number
  radius: number
  maxRadius: number
  age: number
  lifespan: number
  swirlDir: number
}

export const DEFAULT_DOTTED_MATRIX_CONFIG: DottedMatrixConfig = {
  density: 'fine',
  halftoneMode: 'photo-dots',
  liquidSpreadIntensity: 65,
  recoverySpeed: 'balanced',
  dotSizeScale: 100,
  glowIntensity: 40,
  ambientFlowIntensity: 30,
  backgroundDarkness: 95,
}

/**
 * Calculate grid spacing based on density mode and reference canvas dimensions.
 * Ensures consistent visual fidelity across 1080p, 4K, and mobile screens.
 */
export function getSpacingFromDensity(density: DottedMatrixDensity, width: number, height: number): number {
  const minDim = Math.min(width, height)
  const norm = minDim / 1080

  switch (density) {
    case 'fine':
      // Denser grid for photographic portrait clarity (~75-100 cols on Full HD)
      return Math.max(12, Math.round(15 * norm))
    case 'bold':
      // Sparse, bold dots for concert LED stadium walls (~28-36 cols on Full HD)
      return Math.max(30, Math.round(38 * norm))
    case 'balanced':
    default:
      // Balanced aesthetic (~45-55 cols on Full HD)
      return Math.max(18, Math.round(24 * norm))
  }
}

/**
 * Fast RGB color parser for hex and rgb strings
 */
export function parseColor(color: string): { r: number; g: number; b: number } {
  if (!color) return { r: 0, g: 229, b: 255 }
  if (color.startsWith('#')) {
    let hex = color.slice(1)
    if (hex.length === 3) {
      hex = hex.split('').map((c) => c + c).join('')
    }
    const num = parseInt(hex, 16)
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    }
  }
  const match = color.match(/\d+/g)
  if (match && match.length >= 3) {
    return {
      r: parseInt(match[0], 10),
      g: parseInt(match[1], 10),
      b: parseInt(match[2], 10),
    }
  }
  return { r: 0, g: 229, b: 255 }
}

export class DottedHarmonicMatrixEngine {
  private dots: LiquidDot[] = []
  private ripples: RippleEpicenter[] = []
  private sampleCanvas: HTMLCanvasElement | null = null
  private sampleCtx: CanvasRenderingContext2D | null = null

  // Sampling Cache
  private cachedCols = 0
  private cachedRows = 0
  private cachedSpacing = 0
  private cachedDensity: DottedMatrixDensity = 'balanced'
  private cachedImage: HTMLImageElement | null = null
  private cachedImageSrc = ''
  private cachedPalettePrimary = ''
  private cachedPaletteAccent = ''

  // Simulation timing
  private lastTime = 0
  private lastBeatTime = 0

  /**
   * Reset simulation state and clear cached images
   */
  public reset() {
    this.dots = []
    this.ripples = []
    this.cachedCols = 0
    this.cachedRows = 0
    this.cachedImage = null
    this.cachedImageSrc = ''
    this.lastTime = 0
    this.lastBeatTime = 0
  }

  /**
   * Main render method invoked on every composition frame
   */
  public render(rc: VisualizerRenderContext) {
    const {
      ctx,
      width,
      height,
      freqData,
      bands,
      palette,
      currentTime,
      sensitivity,
      currentPhoto,
      dottedMatrixConfig = DEFAULT_DOTTED_MATRIX_CONFIG,
    } = rc

    const config = dottedMatrixConfig

    // 1. Maintain Grid allocation & Sample Cache
    this.ensureGrid(width, height, config.density, currentPhoto || null, palette)

    if (this.dots.length === 0) return

    // 2. Compute delta time (clamped between 1ms and 50ms to prevent explosion)
    const dt = this.lastTime > 0 ? Math.min(0.05, Math.max(0.001, currentTime - this.lastTime)) : 0.016
    this.lastTime = currentTime

    // 3. Beat-triggered ripple epicenters (Scattered Liquid Dispersion)
    if (config.liquidSpreadIntensity > 0) {
      const isTransientBeat = bands.isBeatHit || (bands.subBass > 0.72 && currentTime - this.lastBeatTime > 0.2)
      if (isTransientBeat && currentTime - this.lastBeatTime > 0.16) {
        this.lastBeatTime = currentTime
        this.spawnBeatRipples(width, height, bands, config.liquidSpreadIntensity)
      }
    } else {
      this.ripples = []
    }

    // 4. Update liquid physics simulation (Spring restoration, swirl, damping)
    this.updatePhysics(dt, currentTime, config)

    // 5. Update audio-reactive geometry (FFT mapping, bass expansion, luminance sizing)
    this.updateGeometry(freqData, bands, currentTime, sensitivity, config, width, height)

    // 6. Draw dots onto canvas
    this.draw(ctx, width, height, palette, config, bands)
  }

  /**
   * Ensure the persistent dot grid matches current canvas size and density.
   * Rebuilds pixel sample cache only when image or dimensions change.
   */
  private ensureGrid(
    width: number,
    height: number,
    density: DottedMatrixDensity,
    currentPhoto: HTMLImageElement | null,
    palette: ThemeColors
  ) {
    const spacing = getSpacingFromDensity(density, width, height)
    const cols = Math.ceil(width / spacing) + 1
    const rows = Math.ceil(height / spacing) + 1

    const hasImage = currentPhoto && currentPhoto.complete && (currentPhoto.naturalWidth || currentPhoto.width) > 0
    const imageSrc = hasImage ? currentPhoto.src : ''
    const imageChanged = currentPhoto !== this.cachedImage || imageSrc !== this.cachedImageSrc
    const sizeChanged =
      cols !== this.cachedCols ||
      rows !== this.cachedRows ||
      density !== this.cachedDensity ||
      spacing !== this.cachedSpacing
    const paletteChanged =
      palette.primary !== this.cachedPalettePrimary || palette.accent !== this.cachedPaletteAccent

    if (sizeChanged || this.dots.length === 0) {
      this.cachedCols = cols
      this.cachedRows = rows
      this.cachedSpacing = spacing
      this.cachedDensity = density

      this.dots = []
      for (let r = 0; r < rows; r++) {
        const y = r * spacing
        for (let c = 0; c < cols; c++) {
          const x = c * spacing
          this.dots.push({
            baseX: x,
            baseY: y,
            currentX: x,
            currentY: y,
            vx: 0,
            vy: 0,
            radius: spacing * 0.25,
            targetRadius: spacing * 0.25,
            luminance: 0.5,
            r: 120,
            g: 200,
            b: 255,
          })
        }
      }

      this.rebuildSampleCache(hasImage ? currentPhoto : null, cols, rows, palette)
    } else if (imageChanged || paletteChanged) {
      this.rebuildSampleCache(hasImage ? currentPhoto : null, cols, rows, palette)
    }
  }

  /**
   * Sample image colors and luminance into the grid.
   * Caches sampled pixels; never executes per-frame getImageData calls!
   */
  private rebuildSampleCache(
    image: HTMLImageElement | null,
    cols: number,
    rows: number,
    palette: ThemeColors
  ) {
    if (typeof document === 'undefined') return

    if (!this.sampleCanvas) {
      this.sampleCanvas = document.createElement('canvas')
      this.sampleCtx = this.sampleCanvas.getContext('2d', { willReadFrequently: true })
    }

    if (!this.sampleCtx) return

    if (image && image.complete && (image.naturalWidth || image.width) > 0) {
      this.sampleCanvas.width = cols
      this.sampleCanvas.height = rows
      this.sampleCtx.clearRect(0, 0, cols, rows)

      const imgW = image.naturalWidth || image.width
      const imgH = image.naturalHeight || image.height
      const targetRatio = cols / rows
      const imgRatio = imgW / imgH

      let sX = 0,
        sY = 0,
        sW = imgW,
        sH = imgH
      // Center-crop (cover mode)
      if (imgRatio > targetRatio) {
        sW = imgH * targetRatio
        sX = (imgW - sW) / 2
      } else {
        sH = imgW / targetRatio
        sY = (imgH - sH) / 2
      }

      try {
        this.sampleCtx.drawImage(image, sX, sY, sW, sH, 0, 0, cols, rows)
        const imgData = this.sampleCtx.getImageData(0, 0, cols, rows).data

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const dotIdx = r * cols + c
            const dot = this.dots[dotIdx]
            if (!dot) continue

            const pIdx = dotIdx * 4
            const red = imgData[pIdx] || 0
            const green = imgData[pIdx + 1] || 0
            const blue = imgData[pIdx + 2] || 0
            // Perceived luminance formula (Rec. 709)
            const lum = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255

            dot.r = red
            dot.g = green
            dot.b = blue
            dot.luminance = lum
          }
        }
        this.cachedImage = image
        this.cachedImageSrc = image.src
      } catch {
        // Fallback in case of tainted canvas
        this.synthesizeHarmonicGradient(cols, rows, palette)
      }
    } else {
      // No photo uploaded: generate harmonic color gradient across the grid
      this.synthesizeHarmonicGradient(cols, rows, palette)
    }

    this.cachedPalettePrimary = palette.primary
    this.cachedPaletteAccent = palette.accent
  }

  /**
   * Full-screen harmonic gradient fallback when no photo is uploaded
   */
  private synthesizeHarmonicGradient(cols: number, rows: number, palette: ThemeColors) {
    const prim = parseColor(palette.primary)
    const acc = parseColor(palette.accent)

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const dotIdx = r * cols + c
        const dot = this.dots[dotIdx]
        if (!dot) continue

        const u = c / Math.max(1, cols - 1)
        const v = r / Math.max(1, rows - 1)
        const distCenter = Math.hypot(u - 0.5, v - 0.5) * 2
        const harmonic = Math.sin(distCenter * 6 + u * 3.5) * 0.5 + 0.5

        dot.r = Math.round(prim.r * (1 - harmonic) + acc.r * harmonic)
        dot.g = Math.round(prim.g * (1 - harmonic) + acc.g * harmonic)
        dot.b = Math.round(prim.b * (1 - harmonic) + acc.b * harmonic)
        dot.luminance = Math.max(0.12, Math.min(0.95, (1 - distCenter * 0.35) * (0.6 + harmonic * 0.4)))
      }
    }
    this.cachedImage = null
    this.cachedImageSrc = ''
  }

  /**
   * Spawn 2 to 4 localized ripple epicenters across the screen on genuine beat transients
   */
  private spawnBeatRipples(
    width: number,
    height: number,
    bands: DetailedAudioBands,
    spreadIntensity: number
  ) {
    const mult = spreadIntensity / 100
    const count = bands.subBass > 0.65 ? 3 : 2

    // Epicenter 1: Center or Portrait Face area
    this.ripples.push({
      x: width * 0.5 + (Math.random() - 0.5) * width * 0.25,
      y: height * 0.45 + (Math.random() - 0.5) * height * 0.2,
      strength: (160 + bands.bass * 260) * mult,
      radius: 35,
      maxRadius: Math.max(width, height) * 0.48,
      age: 0,
      lifespan: 0.85,
      swirlDir: Math.random() > 0.5 ? 1 : -1,
    })

    // Epicenters 2 & 3: Off-center musical bursts
    for (let i = 1; i < count; i++) {
      this.ripples.push({
        x: width * (0.15 + 0.7 * Math.random()),
        y: height * (0.15 + 0.7 * Math.random()),
        strength: (120 + bands.subBass * 200) * mult,
        radius: 25,
        maxRadius: Math.max(width, height) * 0.42,
        age: 0,
        lifespan: 0.75,
        swirlDir: Math.random() > 0.5 ? 1 : -1,
      })
    }
  }

  /**
   * Spring restoration physics, ripple displacement, fluid damping, and ambient flow
   */
  private updatePhysics(dt: number, currentTime: number, config: DottedMatrixConfig) {
    // Physical spring parameters
    let stiffness = 42
    let baseDamping = 0.88
    if (config.recoverySpeed === 'fast') {
      stiffness = 68
      baseDamping = 0.82
    } else if (config.recoverySpeed === 'slow') {
      stiffness = 22
      baseDamping = 0.92
    }

    const normalizedDamping = Math.pow(baseDamping, dt * 60)
    const ambientAmt = (config.ambientFlowIntensity / 100) * 1.6

    // Advance ripples
    for (const rip of this.ripples) {
      rip.age += dt
      rip.radius += (rip.maxRadius / rip.lifespan) * dt
    }

    const activeRipples = this.ripples.filter((r) => r.age < r.lifespan)
    this.ripples = activeRipples

    const dotCount = this.dots.length
    for (let i = 0; i < dotCount; i++) {
      const dot = this.dots[i]

      // 1. Ripple displacement & swirl force
      if (activeRipples.length > 0) {
        for (const rip of activeRipples) {
          const dx = dot.currentX - rip.x
          const dy = dot.currentY - rip.y
          const dist = Math.hypot(dx, dy)
          const diff = Math.abs(dist - rip.radius)

          // Gaussian falloff band along expanding wavefront
          if (diff < 120) {
            const currentStrength = rip.strength * (1 - rip.age / rip.lifespan)
            const falloff = Math.exp(-(diff * diff) / (2 * 45 * 45))
            const radialForce = currentStrength * falloff * 0.04
            const swirlForce = radialForce * 0.38 * rip.swirlDir

            const nx = dx / Math.max(1, dist)
            const ny = dy / Math.max(1, dist)

            dot.vx += nx * radialForce - ny * swirlForce
            dot.vy += ny * radialForce + nx * swirlForce
          }
        }
      }

      // 2. Spring restoration toward original grid position (Hooke's Law)
      dot.vx += (dot.baseX - dot.currentX) * stiffness * dt
      dot.vy += (dot.baseY - dot.currentY) * stiffness * dt

      // 3. Subtle ambient sine flow field (preserves portrait clarity while adding life)
      if (ambientAmt > 0) {
        const flowX = Math.sin(dot.baseY * 0.012 + currentTime * 2.0) * ambientAmt
        const flowY = Math.cos(dot.baseX * 0.012 + currentTime * 2.0) * ambientAmt
        dot.vx += flowX * 0.22
        dot.vy += flowY * 0.22
      }

      // 4. Fluid damping and velocity integration
      dot.vx = Math.max(-650, Math.min(650, dot.vx * normalizedDamping))
      dot.vy = Math.max(-650, Math.min(650, dot.vy * normalizedDamping))

      dot.currentX += dot.vx * dt
      dot.currentY += dot.vy * dt
    }
  }

  /**
   * Audio-reactive dot geometry (radius, brightness, local frequency expansion)
   */
  private updateGeometry(
    freqData: Uint8Array,
    bands: DetailedAudioBands,
    currentTime: number,
    sensitivity: number,
    config: DottedMatrixConfig,
    width: number,
    height: number
  ) {
    const spacing = this.cachedSpacing
    const minRadius = Math.max(1.2, spacing * 0.06)
    const maxRadius = spacing * (0.46 * (config.dotSizeScale / 100))

    const cols = this.cachedCols
    const rows = this.cachedRows
    const centerX = width / 2
    const centerY = height / 2

    const dotCount = this.dots.length
    for (let i = 0; i < dotCount; i++) {
      const dot = this.dots[i]

      const c = i % cols
      const r = Math.floor(i / cols)

      // Contrast curve for facial features
      const lumCurve = Math.pow(dot.luminance, 1.25)
      const baseRadius = minRadius + lumCurve * (maxRadius - minRadius)

      // Local frequency mapping
      const normX = c / Math.max(1, cols - 1)
      const binIdx = Math.floor(Math.abs(Math.sin(normX * Math.PI)) * (freqData.length * 0.55))
      const localMag = (freqData[binIdx] || 0) / 255

      // Sub-bass & Bass center-out expanding ripple
      const distCenter = Math.hypot(dot.baseX - centerX, dot.baseY - centerY) / Math.max(1, width * 0.5)
      const bassWave = Math.sin(distCenter * 4.5 - currentTime * 3.8) * bands.bass

      // High-frequency shimmer
      const trebleSparkle = bands.treble * (Math.sin(i * 13.7 + currentTime * 8) * 0.15)

      const audioScale =
        1 +
        (bands.bass * 0.4 + localMag * 0.45 + Math.max(0, bassWave) * 0.25 + trebleSparkle) *
          (sensitivity / 1.5)

      dot.targetRadius = Math.max(minRadius, Math.min(maxRadius * 1.35, baseRadius * audioScale))
      // Smooth interpolation prevents jitter
      dot.radius += (dot.targetRadius - dot.radius) * 0.38
    }
  }

  /**
   * Draw the halftone dot matrix with dark space in between
   */
  private draw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    palette: ThemeColors,
    config: DottedMatrixConfig,
    bands: DetailedAudioBands
  ) {
    ctx.save()

    // Dark canvas background ensures spaces between dots remain crisp and deep
    ctx.fillStyle = '#0a0a0b'
    ctx.fillRect(0, 0, width, height)

    const primRgb = parseColor(palette.primary)
    const accRgb = parseColor(palette.accent)
    const cols = this.cachedCols
    const mode = config.halftoneMode
    const glowEnabled = config.glowIntensity > 0
    const dotCount = this.dots.length

    for (let i = 0; i < dotCount; i++) {
      const dot = this.dots[i]
      if (dot.radius < 0.6) continue

      // Out of bounds check
      if (dot.currentX < -dot.radius || dot.currentX > width + dot.radius || dot.currentY < -dot.radius || dot.currentY > height + dot.radius) {
        continue
      }

      // Halftone Coloring Mode
      if (mode === 'photo-dots') {
        // Mode 1: Photo Inside Dots (Full-screen LED photographic portrait)
        const alpha = Math.min(1, 0.75 + dot.luminance * 0.25)
        ctx.fillStyle = `rgba(${dot.r}, ${dot.g}, ${dot.b}, ${alpha})`
      } else if (mode === 'luminance-size') {
        // Mode 2: Luminance Size Mapping (Monochrome/High-contrast portrait)
        const b = Math.round(180 + dot.luminance * 75)
        ctx.fillStyle = `rgb(${b}, ${b}, ${b})`
      } else {
        // Mode 3: Neon Tint Overlay (Preserves facial detail + theme gradient)
        const c = i % cols
        const progress = c / Math.max(1, cols - 1)
        const tr = Math.round(primRgb.r * (1 - progress) + accRgb.r * progress)
        const tg = Math.round(primRgb.g * (1 - progress) + accRgb.g * progress)
        const tb = Math.round(primRgb.b * (1 - progress) + accRgb.b * progress)
        const alpha = Math.min(1, 0.35 + dot.luminance * 0.65)
        ctx.fillStyle = `rgba(${tr}, ${tg}, ${tb}, ${alpha})`
      }

      // Subtle glow on high-luminance highlights or beat hits
      if (glowEnabled && (dot.luminance > 0.72 || bands.isBeatHit)) {
        ctx.shadowColor = palette.accent
        ctx.shadowBlur = (config.glowIntensity / 100) * 8
      } else {
        ctx.shadowBlur = 0
      }

      // Velocity elongation: stretch moving dots along motion vector into liquid droplets
      const speed = Math.hypot(dot.vx, dot.vy)
      ctx.beginPath()
      if (speed > 16) {
        const angle = Math.atan2(dot.vy, dot.vx)
        const stretch = Math.min(2.2, 1 + speed * 0.012)
        ctx.ellipse(
          dot.currentX,
          dot.currentY,
          dot.radius * stretch,
          Math.max(0.5, dot.radius / Math.sqrt(stretch)),
          angle,
          0,
          Math.PI * 2
        )
      } else {
        ctx.arc(dot.currentX, dot.currentY, dot.radius, 0, Math.PI * 2)
      }
      ctx.fill()
    }

    ctx.restore()
  }
}

// Global Singleton for Visualizer Engine dispatch
export const studioDottedMatrixEngine = new DottedHarmonicMatrixEngine()
