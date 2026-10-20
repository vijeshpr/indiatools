/**
 * IndiaTools — Audio Spectrum Video Studio 2.0
 * Cinematic Audio-Reactive Particle Universe Engine
 * Supports 12 distinct particle systems with physics simulation,
 * beat bursts, orbital momentum, and frequency reactivity.
 */

import { DetailedAudioBands, ThemeColors } from './audioVisualizerTypes.ts'

export type ParticleUniverseMode =
  | 'galaxy'
  | 'starfield'
  | 'neon-dust'
  | 'fireflies'
  | 'energy-sparks'
  | 'particle-explosion'
  | 'orbiting-particles'
  | 'rainbow-confetti'
  | 'cosmic-nebula'
  | 'bass-shockwave'
  | 'light-trails'
  | 'flow-field'
  | 'none'

export interface ParticleUniverseConfig {
  enabled: boolean
  mode: ParticleUniverseMode
  count: number // 30 - 200
  size: number // 1 - 10px
  speed: number // 0.5 - 3.0
  glow: number // 0 - 30px
  burstIntensity: number // 0 - 100%
}

interface UniverseParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  baseSize: number
  alpha: number
  baseAlpha: number
  colorIndex: number
  angle: number
  orbitRadius: number
  orbitSpeed: number
  life: number
  maxLife: number
  tail: Array<{ x: number; y: number }>
}

export class ParticleUniverseEngine {
  private particles: UniverseParticle[] = []
  private currentMode: ParticleUniverseMode = 'starfield'
  private width = 1080
  private height = 1920

  public setMode(mode: ParticleUniverseMode, count = 80, width = 1080, height = 1920) {
    this.currentMode = mode
    this.width = width
    this.height = height
    this.particles = []

    if (mode === 'none') return

    const actualCount = Math.min(Math.max(25, count), 220)
    for (let i = 0; i < actualCount; i++) {
      this.particles.push(this.createParticle(mode, width, height, true))
    }
  }

  private createParticle(
    mode: ParticleUniverseMode,
    width: number,
    height: number,
    randomStart = false
  ): UniverseParticle {
    const centerX = width / 2
    const centerY = height * 0.45

    let x = Math.random() * width
    let y = Math.random() * height
    let vx = (Math.random() - 0.5) * 1.5
    let vy = (Math.random() - 0.5) * 1.5
    let orbitRadius = 100 + Math.random() * 250
    let orbitSpeed = (Math.random() > 0.5 ? 1 : -1) * (0.015 + Math.random() * 0.02)
    let angle = Math.random() * Math.PI * 2

    if (mode === 'galaxy' || mode === 'orbiting-particles') {
      orbitRadius = 80 + Math.random() * 300
      x = centerX + Math.cos(angle) * orbitRadius
      y = centerY + Math.sin(angle) * orbitRadius
    } else if (mode === 'starfield') {
      x = (Math.random() - 0.5) * width
      y = (Math.random() - 0.5) * height
      vx = (Math.random() - 0.5) * 0.4
      vy = (Math.random() - 0.5) * 0.4
    } else if (mode === 'fireflies') {
      vx = (Math.random() - 0.5) * 0.8
      vy = -(0.2 + Math.random() * 0.6)
    } else if (mode === 'energy-sparks' || mode === 'particle-explosion') {
      const speed = 2 + Math.random() * 6
      const dir = Math.random() * Math.PI * 2
      x = centerX
      y = centerY
      vx = Math.cos(dir) * speed
      vy = Math.sin(dir) * speed
    }

    const baseSize = 2 + Math.random() * 3.5
    const maxLife = 100 + Math.random() * 120

    return {
      x,
      y,
      vx,
      vy,
      size: baseSize,
      baseSize,
      alpha: randomStart ? Math.random() * 0.7 + 0.3 : 0,
      baseAlpha: Math.random() * 0.7 + 0.3,
      colorIndex: Math.floor(Math.random() * 3),
      angle,
      orbitRadius,
      orbitSpeed,
      life: randomStart ? Math.floor(Math.random() * maxLife) : 0,
      maxLife,
      tail: [],
    }
  }

  public updateAndDraw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    bands: DetailedAudioBands,
    palette: ThemeColors,
    currentTime: number,
    config: ParticleUniverseConfig,
    centerX: number,
    centerY: number
  ) {
    if (!config.enabled || config.mode === 'none') return

    if (this.currentMode !== config.mode || this.particles.length === 0) {
      this.setMode(config.mode, config.count, width, height)
    }

    const colors = [palette.primary, palette.secondary, palette.accent]
    const bass = bands.bass
    const beatHit = bands.isBeatHit
    const speedMult = config.speed * (1 + bass * 2.2)

    ctx.save()

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i]
      p.life++

      // Audio-reactive sizing
      p.size = (p.baseSize * (config.size / 3)) * (1 + bass * 0.8)
      p.alpha = Math.min(1, p.baseAlpha + bass * 0.35)

      // Physics based on mode
      if (config.mode === 'galaxy' || config.mode === 'orbiting-particles') {
        p.angle += p.orbitSpeed * (1 + bands.mids * 2.5)
        const currentR = p.orbitRadius * (1 + bass * 0.25)
        p.x = centerX + Math.cos(p.angle) * currentR
        p.y = centerY + Math.sin(p.angle) * currentR
      } else if (config.mode === 'starfield') {
        p.x += p.vx * speedMult
        p.y += p.vy * speedMult
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0
      } else if (config.mode === 'light-trails') {
        p.x += p.vx * speedMult
        p.y += p.vy * speedMult
        p.tail.unshift({ x: p.x, y: p.y })
        if (p.tail.length > 8) p.tail.pop()

        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
          p.x = Math.random() * width
          p.y = Math.random() * height
          p.tail = []
        }

        // Draw light trail
        ctx.strokeStyle = colors[p.colorIndex] || palette.primary
        ctx.lineWidth = p.size * 0.7
        ctx.beginPath()
        for (let t = 0; t < p.tail.length; t++) {
          if (t === 0) ctx.moveTo(p.tail[t].x, p.tail[t].y)
          else ctx.lineTo(p.tail[t].x, p.tail[t].y)
        }
        ctx.stroke()
      } else {
        p.x += p.vx * speedMult
        p.y += p.vy * speedMult

        if (p.life >= p.maxLife || p.x < -30 || p.x > width + 30 || p.y < -30 || p.y > height + 30) {
          this.particles[i] = this.createParticle(config.mode, width, height, false)
          continue
        }
      }

      // Beat burst reaction
      if (beatHit && Math.random() > 0.6) {
        p.x += (Math.random() - 0.5) * 35 * (config.burstIntensity / 100)
        p.y += (Math.random() - 0.5) * 35 * (config.burstIntensity / 100)
      }

      // Render Particle
      ctx.fillStyle = colors[p.colorIndex] || palette.primary
      ctx.globalAlpha = p.alpha

      if (config.glow > 0) {
        ctx.shadowColor = palette.glow
        ctx.shadowBlur = config.glow
      }

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }
}
