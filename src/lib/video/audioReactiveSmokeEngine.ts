/**
 * IndiaTools — Audio Spectrum Video Studio 2.0
 * Procedural Audio-Reactive Volumetric Smoke & Mist Engine
 * Simulates flowing cinematic coloured ink, rising stage fog, and beat-triggered smoke bursts.
 */

import { DetailedAudioBands } from './audioVisualizerTypes.ts'

export type SmokePalette =
  | 'purple'
  | 'cyan'
  | 'magenta'
  | 'electric-blue'
  | 'orange'
  | 'red'
  | 'rainbow'

export type SmokePosition =
  | 'bottom-rise'
  | 'side-flow'
  | 'center-burst'
  | 'background-ambient'

export interface SmokeConfig {
  enabled: boolean
  palette: SmokePalette
  position: SmokePosition
  density: number // 15 - 50 particles
  speed: number // 0.5 - 2.5
  opacity: number // 0 - 100%
  turbulence: number // 0 - 100%
}

interface SmokePlume {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  baseRadius: number
  alpha: number
  baseAlpha: number
  hue: number
  swirlAngle: number
  swirlSpeed: number
  life: number
  maxLife: number
}

const SMOKE_COLOR_MAP: Record<SmokePalette, string[]> = {
  purple: ['#a855f7', '#7c3aed', '#c084fc', '#4c1d95'],
  cyan: ['#06b6d4', '#0891b2', '#22d3ee', '#164e63'],
  magenta: ['#ec4899', '#db2777', '#f472b6', '#831843'],
  'electric-blue': ['#3b82f6', '#2563eb', '#60a5fa', '#1e3a8a'],
  orange: ['#f97316', '#ea580c', '#fb923c', '#7c2d12'],
  red: ['#ef4444', '#dc2626', '#f87171', '#7f1d1d'],
  rainbow: ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'],
}

export class AudioReactiveSmokeEngine {
  private plumes: SmokePlume[] = []
  private maxPlumes = 40

  constructor(maxPlumes = 35) {
    this.maxPlumes = maxPlumes
  }

  public init(width: number, height: number, config: SmokeConfig) {
    this.plumes = []
    const count = Math.min(Math.max(12, config.density), 50)
    for (let i = 0; i < count; i++) {
      this.plumes.push(this.createPlume(width, height, config, true))
    }
  }

  private createPlume(
    width: number,
    height: number,
    config: SmokeConfig,
    randomStart = false
  ): SmokePlume {
    let x = width / 2
    let y = height

    if (config.position === 'bottom-rise') {
      x = Math.random() * width
      y = randomStart ? Math.random() * height : height + Math.random() * 40
    } else if (config.position === 'side-flow') {
      const fromLeft = Math.random() > 0.5
      x = fromLeft ? -40 : width + 40
      y = Math.random() * height
    } else if (config.position === 'center-burst') {
      x = width / 2 + (Math.random() - 0.5) * 80
      y = height * 0.45 + (Math.random() - 0.5) * 80
    } else {
      // background-ambient
      x = Math.random() * width
      y = Math.random() * height
    }

    const baseRadius = 80 + Math.random() * 120
    const maxLife = 120 + Math.random() * 100

    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 1.2,
      vy: config.position === 'bottom-rise' ? -(0.8 + Math.random() * 1.5) : (Math.random() - 0.5) * 1.0,
      radius: baseRadius,
      baseRadius,
      alpha: 0,
      baseAlpha: 0.12 + Math.random() * 0.2,
      hue: Math.floor(Math.random() * 3),
      swirlAngle: Math.random() * Math.PI * 2,
      swirlSpeed: (Math.random() - 0.5) * 0.03,
      life: randomStart ? Math.floor(Math.random() * maxLife) : 0,
      maxLife,
    }
  }

  public updateAndDraw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    bands: DetailedAudioBands,
    currentTime: number,
    config: SmokeConfig
  ) {
    if (!config.enabled || config.opacity <= 0) return

    if (this.plumes.length === 0) {
      this.init(width, height, config)
    }

    const paletteColors = SMOKE_COLOR_MAP[config.palette] || SMOKE_COLOR_MAP.purple
    const bassFactor = 1 + bands.bass * 1.8
    const beatBurst = bands.isBeatHit ? 1.5 : 1.0
    const overallOpacity = (config.opacity / 100) * (0.6 + bands.overall * 0.4)

    ctx.save()

    for (let i = 0; i < this.plumes.length; i++) {
      const p = this.plumes[i]
      p.life++

      // Life fade progression
      const lifeRatio = p.life / p.maxLife
      if (lifeRatio < 0.25) {
        p.alpha = (lifeRatio / 0.25) * p.baseAlpha
      } else if (lifeRatio > 0.75) {
        p.alpha = ((1 - lifeRatio) / 0.25) * p.baseAlpha
      } else {
        p.alpha = p.baseAlpha
      }

      // Audio-reactive expansion
      p.radius = p.baseRadius * (1 + (bands.subBass * 0.5 + bands.bass * 0.4)) * beatBurst

      // Swirl turbulence
      p.swirlAngle += p.swirlSpeed * (1 + bands.mids * 2)
      p.x += (p.vx + Math.sin(p.swirlAngle) * 0.8) * config.speed * bassFactor
      p.y += (p.vy + Math.cos(p.swirlAngle) * 0.5) * config.speed * bassFactor

      // Respawn when life expires or leaves viewport
      if (
        p.life >= p.maxLife ||
        p.y < -p.radius * 2 ||
        p.y > height + p.radius * 2 ||
        p.x < -p.radius * 2 ||
        p.x > width + p.radius * 2
      ) {
        this.plumes[i] = this.createPlume(width, height, config, false)
        continue
      }

      // Draw soft volumetric radial gradient plume
      const color = paletteColors[p.hue % paletteColors.length]
      const grad = ctx.createRadialGradient(p.x, p.y, p.radius * 0.1, p.x, p.y, p.radius)
      grad.addColorStop(0, color)
      grad.addColorStop(0.5, color)
      grad.addColorStop(1, 'rgba(0,0,0,0)')

      ctx.fillStyle = grad
      ctx.globalAlpha = Math.min(1, p.alpha * overallOpacity)
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }
}
