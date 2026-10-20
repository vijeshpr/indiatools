/**
 * IndiaTools — Audio Spectrum Video Studio 2.0
 * Cinematic Motion Effects & Particle Engines: 2.5D Camera Drift,
 * Atmospheric Particles, Film Grain, Chromatic Aberration & Color Grading.
 */

import {
  CinematicFxConfig,
  DetailedAudioBands,
  ParticlePresetType,
  ThemeColors,
} from './audioVisualizerTypes.ts'

export interface VisualizerParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  baseAlpha: number
  colorIndex: number
  rotation?: number
  vRot?: number
}

/**
 * Backward-compatible particle system used by previous tests and basic scenes
 */
export class VisualizerParticleSystem {
  particles: VisualizerParticle[] = []
  private maxParticles = 75

  constructor(count = 75) {
    this.maxParticles = count
    this.init(1920, 1080)
  }

  public init(width: number, height: number) {
    this.particles = []
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8 - 0.3,
        size: Math.random() * 3 + 1.2,
        alpha: Math.random() * 0.6 + 0.2,
        baseAlpha: Math.random() * 0.6 + 0.2,
        colorIndex: Math.floor(Math.random() * 3),
      })
    }
  }

  public updateAndDraw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    bassEnergy: number,
    palette: ThemeColors
  ) {
    const colors = [palette.primary, palette.secondary, palette.accent]
    const speedBoost = 1 + bassEnergy * 3.5

    for (const p of this.particles) {
      p.x += p.vx * speedBoost
      p.y += p.vy * speedBoost

      // Wrap around bounds
      if (p.x < 0) p.x = width
      if (p.x > width) p.x = 0
      if (p.y < 0) p.y = height
      if (p.y > height) p.y = 0

      p.alpha = Math.min(1, p.baseAlpha + bassEnergy * 0.45)

      ctx.save()
      ctx.fillStyle = colors[p.colorIndex] || palette.primary
      ctx.globalAlpha = p.alpha
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * (1 + bassEnergy * 0.8), 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }
}

/**
 * Advanced Atmospheric Particle Manager supporting 5 distinct nature/cosmic presets
 */
export class AtmosphericParticleManager {
  private particles: VisualizerParticle[] = []
  private preset: ParticlePresetType = 'floating-dust'
  private width = 1920
  private height = 1080

  constructor(preset: ParticlePresetType = 'floating-dust', width = 1920, height = 1080) {
    this.preset = preset
    this.width = width
    this.height = height
    this.init(preset, width, height)
  }

  public setPreset(preset: ParticlePresetType, width?: number, height?: number) {
    this.init(preset, width || this.width, height || this.height)
  }

  public init(preset: ParticlePresetType, width: number, height: number) {
    this.preset = preset
    this.width = width
    this.height = height
    this.particles = []

    if (preset === 'none') return

    const count = preset === 'monsoon-rain' ? 120 : preset === 'cosmic-stardust' ? 90 : 65

    for (let i = 0; i < count; i++) {
      if (preset === 'monsoon-rain') {
        this.particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: -1.5 + Math.random() * 0.6,
          vy: 16 + Math.random() * 12, // Fast falling streaks
          size: Math.random() * 1.8 + 1,
          alpha: Math.random() * 0.4 + 0.2,
          baseAlpha: Math.random() * 0.4 + 0.2,
          colorIndex: 0,
        })
      } else if (preset === 'rising-embers') {
        this.particles.push({
          x: Math.random() * width,
          y: height + Math.random() * 100,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(Math.random() * 2.5 + 1.2), // Rising up
          size: Math.random() * 3.5 + 1.5,
          alpha: Math.random() * 0.7 + 0.3,
          baseAlpha: Math.random() * 0.7 + 0.3,
          colorIndex: Math.random() > 0.4 ? 1 : 2, // Amber/Red
        })
      } else if (preset === 'sakura-petals') {
        this.particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 1.2 + Math.random() * 1.2,
          vy: 1.0 + Math.random() * 1.4,
          size: Math.random() * 6 + 4,
          alpha: Math.random() * 0.6 + 0.25,
          baseAlpha: Math.random() * 0.6 + 0.25,
          colorIndex: 0,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.05,
        })
      } else {
        // floating-dust / cosmic-stardust
        this.particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6 - 0.2,
          size: Math.random() * 3 + 1,
          alpha: Math.random() * 0.6 + 0.15,
          baseAlpha: Math.random() * 0.6 + 0.15,
          colorIndex: Math.floor(Math.random() * 3),
        })
      }
    }
  }

  public updateAndDraw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    bands: DetailedAudioBands,
    palette: ThemeColors
  ) {
    if (this.preset === 'none' || this.particles.length === 0) return

    const colors = [palette.primary, palette.secondary, palette.accent]
    const bassFactor = 1 + bands.bass * 1.8

    for (const p of this.particles) {
      p.x += p.vx * bassFactor
      p.y += p.vy * bassFactor

      // Boundary handling
      if (this.preset === 'monsoon-rain') {
        if (p.y > height) {
          p.y = -20
          p.x = Math.random() * width
        }
      } else if (this.preset === 'rising-embers') {
        if (p.y < -30) {
          p.y = height + 20
          p.x = Math.random() * width
        }
      } else {
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0
      }

      ctx.save()
      ctx.globalAlpha = Math.min(1, p.baseAlpha + bands.bass * 0.3)

      if (this.preset === 'monsoon-rain') {
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.45)'
        ctx.lineWidth = p.size
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x + p.vx * 3, p.y + p.vy * 1.8)
        ctx.stroke()
      } else if (this.preset === 'sakura-petals') {
        p.rotation = (p.rotation || 0) + (p.vRot || 0.02)
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = '#fbcfe8'
        ctx.beginPath()
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.fillStyle = colors[p.colorIndex] || palette.primary
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * (1 + bands.bass * 0.5), 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }
  }
}

/**
 * Apply 2.5D Camera Drift (slow Ken Burns pan & zoom)
 */
export function applyCameraMotion(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  currentTime: number,
  bands: DetailedAudioBands,
  fx: CinematicFxConfig
) {
  if (fx.cameraDrift <= 0 && fx.cameraBassShake <= 0) return

  const driftStrength = (fx.cameraDrift / 100) * 0.06
  const zoom = 1 + Math.sin(currentTime * 0.12) * driftStrength
  const panX = Math.cos(currentTime * 0.15) * (width * 0.012) * (fx.cameraDrift / 100)
  const panY = Math.sin(currentTime * 0.18) * (height * 0.012) * (fx.cameraDrift / 100)

  // Bass shake on transient hits
  let shakeX = 0
  let shakeY = 0
  if (bands.isBeatHit && fx.cameraBassShake > 0) {
    const shakeIntensity = (fx.cameraBassShake / 100) * 14
    shakeX = (Math.random() - 0.5) * shakeIntensity
    shakeY = (Math.random() - 0.5) * shakeIntensity
  }

  ctx.translate(width / 2 + panX + shakeX, height / 2 + panY + shakeY)
  ctx.scale(zoom, zoom)
  ctx.translate(-width / 2, -height / 2)
}

/**
 * Apply Post-Processing Effects (Film Grain, Scanlines, Vignette, Color Grading)
 */
export function applyPostProcessingEffects(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  currentTime: number,
  bands: DetailedAudioBands,
  fx: CinematicFxConfig
) {
  // 1. Transient Chromatic Aberration on Beat Drops
  if (fx.chromaticAberration > 0 && bands.isBeatHit) {
    ctx.save()
    ctx.globalCompositeOperation = 'screen'
    ctx.fillStyle = 'rgba(239, 68, 68, 0.12)' // Red channel
    ctx.fillRect(-6, 0, width + 12, height)
    ctx.fillStyle = 'rgba(6, 182, 212, 0.12)' // Cyan channel
    ctx.fillRect(6, 0, width + 12, height)
    ctx.restore()
  }

  // 2. CRT Scanlines
  if (fx.scanlines > 0) {
    ctx.save()
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
    ctx.globalAlpha = (fx.scanlines / 100) * 0.6
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 1.5)
    }
    ctx.restore()
  }

  // 3. Vignette
  if (fx.vignette > 0) {
    ctx.save()
    const vignetteStrength = (fx.vignette / 100) * 0.75
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.42,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.75
    )
    gradient.addColorStop(0, 'rgba(0,0,0,0)')
    gradient.addColorStop(1, `rgba(0,0,0,${vignetteStrength})`)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  }

  // 4. Color Grading LUT Approximation
  if (fx.colorGrading && fx.colorGrading !== 'neutral') {
    ctx.save()
    if (fx.colorGrading === 'teal-orange') {
      ctx.globalCompositeOperation = 'overlay'
      ctx.fillStyle = 'rgba(15, 118, 110, 0.18)' // Teal shadows
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = 'rgba(249, 115, 22, 0.14)' // Orange highlights
      ctx.fillRect(0, 0, width, height)
    } else if (fx.colorGrading === 'vintage-warm') {
      ctx.globalCompositeOperation = 'soft-light'
      ctx.fillStyle = 'rgba(217, 119, 6, 0.25)' // Warm sepia amber
      ctx.fillRect(0, 0, width, height)
    } else if (fx.colorGrading === 'cyber-cool') {
      ctx.globalCompositeOperation = 'hard-light'
      ctx.fillStyle = 'rgba(59, 130, 246, 0.16)' // Deep cyber blue
      ctx.fillRect(0, 0, width, height)
    } else if (fx.colorGrading === 'noir') {
      ctx.globalCompositeOperation = 'color'
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 0, width, height)
    }
    ctx.restore()
  }

  // 5. Procedural Film Grain Overlay
  if (fx.filmGrain > 0) {
    ctx.save()
    const grainAlpha = (fx.filmGrain / 100) * 0.08
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)'
    ctx.globalAlpha = grainAlpha

    // Fast pseudo-random stippling
    const step = 8
    const seed = Math.floor(currentTime * 30) % 10
    for (let x = seed; x < width; x += step * 2) {
      for (let y = seed; y < height; y += step * 2) {
        if (Math.random() > 0.5) {
          ctx.fillRect(x, y, 2, 2)
        }
      }
    }
    ctx.restore()
  }
}
