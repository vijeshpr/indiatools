/**
 * IndiaTools — Audio Spectrum Video Studio 2.0
 * Cinematic Concert Lighting & Beat Light Show Engine
 * Provides audio-reactive concert stage beams, rotating neon club spotlights,
 * bass drop blackouts, ambient lens flares, and side concert blasters.
 */

import { DetailedAudioBands, ThemeColors } from './audioVisualizerTypes.ts'

export type LightShowMode =
  | 'concert-stage'
  | 'neon-club'
  | 'cinematic-spotlight'
  | 'dark-bass-drop'
  | 'rainbow-pulse'
  | 'minimal-light-bars'
  | 'none'

export interface LightShowConfig {
  enabled: boolean
  mode: LightShowMode
  intensity: number // 0 - 100%
  beamCount: number // 4 - 16
  reduceFlashing: boolean
  blackoutOnDrop: boolean
  ambientGlow: number // 0 - 100%
}

export class CinematicLightingEngine {
  private sweeperAngle = 0
  private lastBeatTime = 0
  private strobeOpacity = 0
  private blackoutIntensity = 0

  public updateAndDraw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    bands: DetailedAudioBands,
    palette: ThemeColors,
    currentTime: number,
    config: LightShowConfig,
    centerX: number,
    centerY: number
  ) {
    if (!config.enabled || config.mode === 'none' || config.intensity <= 0) return

    const intensityFactor = config.intensity / 100
    const bass = bands.bass
    const isBeat = bands.isBeatHit

    // Update sweep rotation
    this.sweeperAngle += 0.02 * (1 + bass * 1.5)

    // Handle beat strobe
    if (isBeat && !config.reduceFlashing) {
      this.strobeOpacity = 0.55 * intensityFactor
      this.lastBeatTime = currentTime
      if (config.blackoutOnDrop && bass > 0.75) {
        this.blackoutIntensity = 0.8
      }
    } else {
      this.strobeOpacity = Math.max(0, this.strobeOpacity - 0.08)
      this.blackoutIntensity = Math.max(0, this.blackoutIntensity - 0.06)
    }

    ctx.save()

    // Render mode-specific lights
    switch (config.mode) {
      case 'concert-stage':
        this.drawConcertStageBeams(ctx, width, height, bands, palette, intensityFactor, config.beamCount)
        break
      case 'neon-club':
        this.drawNeonClubSweepers(ctx, width, height, bands, palette, intensityFactor, centerX, centerY)
        break
      case 'cinematic-spotlight':
        this.drawCinematicSpotlight(ctx, width, height, bands, palette, intensityFactor, centerX, centerY)
        break
      case 'dark-bass-drop':
        this.drawDarkBassDrop(ctx, width, height, bands, palette, intensityFactor, centerX, centerY)
        break
      case 'rainbow-pulse':
        this.drawRainbowPulse(ctx, width, height, bands, currentTime, intensityFactor)
        break
      case 'minimal-light-bars':
        this.drawMinimalLightBars(ctx, width, height, bands, palette, intensityFactor)
        break
    }

    // Optional Blackout Flash Layer
    if (this.blackoutIntensity > 0.05) {
      ctx.fillStyle = `rgba(5, 6, 10, ${this.blackoutIntensity})`
      ctx.fillRect(0, 0, width, height)
    }

    // Transient Strobe Pulse
    if (this.strobeOpacity > 0.02 && !config.reduceFlashing) {
      ctx.fillStyle = palette.primary
      ctx.globalAlpha = this.strobeOpacity * 0.4
      ctx.fillRect(0, 0, width, height)
    }

    ctx.restore()
  }

  /**
   * Mode 1: Concert Stage Beams radiating from top and bottom corners
   */
  private drawConcertStageBeams(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    bands: DetailedAudioBands,
    palette: ThemeColors,
    intensity: number,
    beamCount: number
  ) {
    const beams = Math.min(Math.max(4, beamCount), 16)
    const sweep = Math.sin(this.sweeperAngle) * (width * 0.25)
    const beamAlpha = (0.2 + bands.bass * 0.6) * intensity

    // Left Top Fixture
    for (let i = 0; i < beams / 2; i++) {
      const spread = (i / (beams / 2)) * (width * 0.8)
      const targetX = width * 0.3 + spread + sweep
      const targetY = height

      const grad = ctx.createLinearGradient(0, 0, targetX, targetY)
      grad.addColorStop(0, palette.primary)
      grad.addColorStop(0.4, palette.secondary)
      grad.addColorStop(1, 'rgba(0,0,0,0)')

      ctx.save()
      ctx.globalAlpha = beamAlpha
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(targetX - 35, targetY)
      ctx.lineTo(targetX + 35, targetY)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    // Right Top Fixture
    for (let i = 0; i < beams / 2; i++) {
      const spread = (i / (beams / 2)) * (width * 0.8)
      const targetX = width * 0.7 - spread - sweep
      const targetY = height

      const grad = ctx.createLinearGradient(width, 0, targetX, targetY)
      grad.addColorStop(0, palette.accent)
      grad.addColorStop(0.4, palette.primary)
      grad.addColorStop(1, 'rgba(0,0,0,0)')

      ctx.save()
      ctx.globalAlpha = beamAlpha
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.moveTo(width, 0)
      ctx.lineTo(targetX - 35, targetY)
      ctx.lineTo(targetX + 35, targetY)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }
  }

  /**
   * Mode 2: Neon Club Rotating Sweepers from Center
   */
  private drawNeonClubSweepers(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    bands: DetailedAudioBands,
    palette: ThemeColors,
    intensity: number,
    centerX: number,
    centerY: number
  ) {
    const rayCount = 8
    const rayLength = Math.max(width, height) * 0.9
    const baseAlpha = (0.25 + bands.bass * 0.55) * intensity

    ctx.save()
    ctx.translate(centerX, centerY)

    for (let i = 0; i < rayCount; i++) {
      const angle = (i * (Math.PI * 2)) / rayCount + this.sweeperAngle
      const beamWidth = 0.12 + bands.mids * 0.08

      const grad = ctx.createRadialGradient(0, 0, 20, 0, 0, rayLength)
      grad.addColorStop(0, i % 2 === 0 ? palette.primary : palette.accent)
      grad.addColorStop(0.6, i % 2 === 0 ? palette.secondary : palette.primary)
      grad.addColorStop(1, 'rgba(0,0,0,0)')

      ctx.fillStyle = grad
      ctx.globalAlpha = baseAlpha
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, rayLength, angle - beamWidth, angle + beamWidth)
      ctx.closePath()
      ctx.fill()
    }

    ctx.restore()
  }

  /**
   * Mode 3: Cinematic Dual Spotlight
   */
  private drawCinematicSpotlight(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    bands: DetailedAudioBands,
    palette: ThemeColors,
    intensity: number,
    centerX: number,
    centerY: number
  ) {
    const radius = (180 + bands.bass * 120) * intensity
    const grad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, radius * 1.8)
    grad.addColorStop(0, palette.glow)
    grad.addColorStop(0.5, 'rgba(255,255,255,0.08)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')

    ctx.save()
    ctx.globalAlpha = 0.65 * intensity
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 1.8, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  /**
   * Mode 4: Dark Bass Drop Pulse
   */
  private drawDarkBassDrop(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    bands: DetailedAudioBands,
    palette: ThemeColors,
    intensity: number,
    centerX: number,
    centerY: number
  ) {
    if (bands.bass < 0.3) return

    const dropRadius = (width * 0.45) * bands.bass * intensity
    const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, dropRadius)
    grad.addColorStop(0, 'rgba(0,0,0,0)')
    grad.addColorStop(0.7, palette.accent)
    grad.addColorStop(1, 'rgba(0,0,0,0)')

    ctx.save()
    ctx.globalAlpha = Math.min(0.75, bands.bass * intensity)
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(centerX, centerY, dropRadius, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  /**
   * Mode 5: Dynamic Rainbow Hue Light Pulse
   */
  private drawRainbowPulse(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    bands: DetailedAudioBands,
    currentTime: number,
    intensity: number
  ) {
    const hue = (currentTime * 45 + bands.bass * 120) % 360
    const alpha = (0.15 + bands.bass * 0.4) * intensity

    const grad = ctx.createLinearGradient(0, 0, width, height)
    grad.addColorStop(0, `hsla(${hue}, 90%, 60%, ${alpha})`)
    grad.addColorStop(0.5, `hsla(${(hue + 60) % 360}, 90%, 55%, ${alpha * 0.5})`)
    grad.addColorStop(1, `hsla(${(hue + 120) % 360}, 90%, 50%, 0)`)

    ctx.save()
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  }

  /**
   * Mode 6: Minimal Concert Stage Light Bars
   */
  private drawMinimalLightBars(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    bands: DetailedAudioBands,
    palette: ThemeColors,
    intensity: number
  ) {
    const barCount = 6
    const barHeight = 8
    const spacing = 18
    const startY = height * 0.08
    const alpha = (0.3 + bands.bass * 0.6) * intensity

    ctx.save()
    for (let i = 0; i < barCount; i++) {
      const y = startY + i * spacing
      const activeWidth = width * (0.3 + bands.overall * 0.6)
      const x = (width - activeWidth) / 2

      ctx.fillStyle = i % 2 === 0 ? palette.primary : palette.accent
      ctx.globalAlpha = alpha
      ctx.shadowColor = palette.glow
      ctx.shadowBlur = 14
      ctx.fillRect(x, y, activeWidth, barHeight)
    }
    ctx.restore()
  }
}
