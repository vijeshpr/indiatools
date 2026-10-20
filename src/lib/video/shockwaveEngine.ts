/**
 * IndiaTools — Audio Spectrum Video Studio 2.0
 * Bass Shockwave & Concentric Energy Rings Engine
 * Triggers cinematic expanding neon ripples, distortion shockwaves,
 * and radial energy pulses synchronized to sub-bass hits and beat drops.
 */

import { DetailedAudioBands, ThemeColors } from './audioVisualizerTypes.ts'

export interface ShockwaveConfig {
  enabled: boolean
  ringCount: number // 1 - 5
  thickness: number // 2 - 12px
  glow: number // 0 - 30px
  expansionSpeed: number // 1.0 - 4.0
  color: string
}

interface ActiveRing {
  radius: number
  maxRadius: number
  alpha: number
  thickness: number
  speed: number
  color: string
}

export class ShockwaveEngine {
  private activeRings: ActiveRing[] = []
  private lastTriggerTime = 0

  public triggerShockwave(
    initialRadius: number,
    maxRadius: number,
    color: string,
    speed = 2.5,
    thickness = 4
  ) {
    this.activeRings.push({
      radius: initialRadius,
      maxRadius,
      alpha: 0.85,
      thickness,
      speed,
      color,
    })
  }

  public updateAndDraw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    bands: DetailedAudioBands,
    palette: ThemeColors,
    currentTime: number,
    config: ShockwaveConfig,
    centerX: number,
    centerY: number,
    primaryRadius: number
  ) {
    if (!config.enabled) return

    // Auto-trigger on strong beat transient
    if (bands.isBeatHit && currentTime - this.lastTriggerTime > 0.2) {
      this.lastTriggerTime = currentTime
      const maxR = Math.max(width, height) * 0.75
      const ringCol = config.color || palette.accent

      for (let i = 0; i < Math.min(config.ringCount, 3); i++) {
        this.triggerShockwave(
          primaryRadius + i * 20,
          maxR,
          ringCol,
          config.expansionSpeed * (1 + i * 0.25),
          config.thickness
        )
      }
    }

    if (this.activeRings.length === 0) return

    ctx.save()

    for (let i = this.activeRings.length - 1; i >= 0; i--) {
      const ring = this.activeRings[i]
      ring.radius += ring.speed * 8
      const progress = ring.radius / ring.maxRadius
      ring.alpha = Math.max(0, (1 - progress) * 0.8)

      if (ring.alpha <= 0.02 || ring.radius >= ring.maxRadius) {
        this.activeRings.splice(i, 1)
        continue
      }

      ctx.strokeStyle = ring.color
      ctx.lineWidth = ring.thickness
      ctx.globalAlpha = ring.alpha

      if (config.glow > 0) {
        ctx.shadowColor = palette.glow
        ctx.shadowBlur = config.glow
      }

      ctx.beginPath()
      ctx.arc(centerX, centerY, ring.radius, 0, Math.PI * 2)
      ctx.stroke()
    }

    ctx.restore()
  }
}
