/**
 * IndiaTools — Neon Energy / Electric Glow Visualizer Engine
 * 60 FPS HTML5 Canvas 2D Cinematic Audio-Reactive Multi-Colour Neon Renderer
 */

import {
  DEFAULT_NEON_ENERGY_CONFIG,
  type NeonEnergyStudioConfig,
  type NeonTheme,
} from './neonEnergyTypes.ts'
import type { NormalizedAudioBands } from '../audioToVideo/types.ts'

export class NeonEnergyEngine {
  private imageCache = new Map<string, HTMLImageElement>()
  private currentScale = 1.0
  private lastBeatTime = 0
  private prevBass = 0
  private currentHueOffset = 0
  private lastRenderTimestamp = 0

  /**
   * Preload / retrieve image from cache with load checking
   */
  public getCachedImage(url: string | null): HTMLImageElement | null {
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
   * Reset transient states
   */
  public reset(): void {
    this.currentScale = 1.0
    this.lastBeatTime = 0
    this.prevBass = 0
    this.currentHueOffset = 0
    this.lastRenderTimestamp = 0
  }

  /**
   * Main 60 FPS Render pipeline invoked per frame
   */
  public render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: NeonEnergyStudioConfig = DEFAULT_NEON_ENERGY_CONFIG,
    bands: NormalizedAudioBands | undefined,
    currentTime: number,
    duration: number = 30
  ): void {
    if (!config.enabled || !ctx) return

    ctx.save()

    // 1. Calculate Frame Delta & Audio Reactivity
    const now = typeof performance !== 'undefined' ? performance.now() / 1000 : currentTime
    const dt = this.lastRenderTimestamp > 0 ? Math.min(0.1, Math.max(0.001, now - this.lastRenderTimestamp)) : 0.016
    this.lastRenderTimestamp = now

    const safeBands = bands || {
      bass: 0,
      mid: 0,
      treble: 0,
      subBass: 0,
      overall: 0,
      isBeatHit: false,
    }

    // 2. Audio-Reactive Beat Bump Physics
    this.updateBeatScale(safeBands, config.audio, currentTime, dt)

    // 3. Dynamic Hue Offset Calculation
    this.updateHueOffset(config.glow, safeBands, dt)

    // 4. Resolve Active Theme Palette
    const palette = this.resolvePalette(config.glow.theme, this.currentHueOffset, config.glow.customColors)

    // 5. Render Dark Cinematic Background & Floor Horizon
    this.renderCinematicBackground(ctx, width, height, config, safeBands, palette)

    // 6. Object Transforms (Anchor at posX, posY)
    const centerX = (config.posX / 100) * width
    const centerY = (config.posY / 100) * height
    const scale = this.currentScale
    const horizonY = (config.reflection.floorHorizonY / 100) * height

    // 7. Render Glossy Floor Reflection (Vertically flipped under horizon)
    if (config.reflection.enabled) {
      this.renderFloorReflection(
        ctx,
        width,
        height,
        config,
        centerX,
        centerY,
        horizonY,
        scale,
        palette
      )
    }

    // 8. Render Primary Multi-Pass Neon Glow & Core Object
    this.renderNeonObject(
      ctx,
      width,
      height,
      config,
      centerX,
      centerY,
      scale,
      palette,
      false
    )

    ctx.restore()
  }

  /**
   * Transient Beat Detection with Damped Spring Recovery ("The Bump")
   */
  private updateBeatScale(
    bands: NormalizedAudioBands,
    audioCfg: NeonEnergyStudioConfig['audio'],
    currentTime: number,
    dt: number
  ): void {
    const rawBass = Math.max(bands.bass, bands.subBass) * audioCfg.bassSensitivity
    const bassDelta = rawBass - this.prevBass
    this.prevBass = rawBass

    const beatCooldownSec = 0.12 // Minimum time between trigger bumps to eliminate flutter
    const isKickTransient =
      (bands.isBeatHit || (rawBass > 0.45 && bassDelta > 0.18)) &&
      currentTime - this.lastBeatTime > beatCooldownSec

    if (isKickTransient) {
      // Trigger smooth scale bump up to bumpStrength
      this.currentScale = audioCfg.bumpStrength
      this.lastBeatTime = currentTime
    } else {
      // Exponential decay back to 1.0x with configurable speed
      const decayRate = audioCfg.decaySpeed * 30 * dt
      this.currentScale += (1.0 - this.currentScale) * Math.min(1.0, decayRate)
    }
  }

  /**
   * Smooth Hue Shift Calculation
   */
  private updateHueOffset(
    glowCfg: NeonEnergyStudioConfig['glow'],
    bands: NormalizedAudioBands,
    dt: number
  ): void {
    if (!glowCfg.hueCyclingEnabled) {
      this.currentHueOffset = 0
      return
    }

    const audioSpeedBoost = 1.0 + bands.overall * 1.5
    const step = glowCfg.hueCycleSpeed * 45 * audioSpeedBoost * dt
    this.currentHueOffset = (this.currentHueOffset + step) % 360
  }

  /**
   * Resolves vibrant neon colour palette with rotation & themes
   */
  public resolvePalette(
    theme: NeonTheme,
    hueOffset: number,
    customColors?: NeonEnergyStudioConfig['glow']['customColors']
  ): { primary: string; secondary: string; tertiary: string; highlight: string; core: string } {
    if (theme === 'custom' && customColors) {
      return {
        primary: customColors.primary,
        secondary: customColors.secondary,
        tertiary: customColors.tertiary,
        highlight: customColors.highlight,
        core: '#FFFFFF',
      }
    }

    // Helper: HSL with shift
    const hsl = (h: number, s: number = 100, l: number = 55) =>
      `hsl(${(h + hueOffset) % 360}, ${s}%, ${l}%)`

    switch (theme) {
      case 'electric-cyan':
        return {
          primary: hsl(186, 100, 52), // Intense Cyan
          secondary: hsl(205, 100, 58), // Azure Blue
          tertiary: hsl(170, 100, 50), // Aquamarine
          highlight: hsl(190, 100, 75), // Ice Blue
          core: '#FFFFFF',
        }
      case 'hot-magenta':
        return {
          primary: hsl(325, 100, 55), // Hot Pink
          secondary: hsl(285, 100, 60), // Neon Purple
          tertiary: hsl(345, 100, 60), // Electric Crimson
          highlight: hsl(315, 100, 80), // Radiant Rose
          core: '#FFFFFF',
        }
      case 'acid-lime':
        return {
          primary: hsl(115, 100, 54), // Lime Green
          secondary: hsl(80, 100, 50), // Chartreuse
          tertiary: hsl(150, 100, 50), // Electric Emerald
          highlight: hsl(100, 100, 75), // Luminous Lime
          core: '#FFFFFF',
        }
      case 'electric-gold':
        return {
          primary: hsl(45, 100, 52), // Vivid Gold
          secondary: hsl(32, 100, 55), // Warm Amber
          tertiary: hsl(55, 100, 55), // Radiant Lemon
          highlight: hsl(48, 100, 80), // Golden Shimmer
          core: '#FFFFFF',
        }
      case 'tokyo-midnight':
        return {
          primary: hsl(270, 100, 62), // Electric Violet
          secondary: hsl(320, 100, 56), // Magenta
          tertiary: hsl(195, 100, 52), // Deep Cyan
          highlight: hsl(290, 100, 80), // Twilight Pink
          core: '#FFFFFF',
        }
      case 'cyber-rainbow':
      default:
        // Authentic quad-colour neon sign: Cyan, Magenta, Yellow, Lime
        return {
          primary: hsl(185, 100, 52), // Cyan
          secondary: hsl(325, 100, 55), // Magenta
          tertiary: hsl(50, 100, 52), // Yellow
          highlight: hsl(120, 100, 54), // Lime
          core: '#FFFFFF',
        }
    }
  }

  /**
   * Dark Cinematic Background with Mid-Frequency Reactive Radial Glow
   */
  private renderCinematicBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: NeonEnergyStudioConfig,
    bands: NormalizedAudioBands,
    palette: ReturnType<typeof this.resolvePalette>
  ): void {
    ctx.save()

    const horizonY = (config.reflection.floorHorizonY / 100) * height

    // 1. Deep Space Atmospheric Gradient (Wall)
    const wallGrad = ctx.createLinearGradient(0, 0, 0, horizonY)
    switch (config.backgroundStyle) {
      case 'charcoal-abyss':
        wallGrad.addColorStop(0, '#020305')
        wallGrad.addColorStop(0.7, '#07090D')
        wallGrad.addColorStop(1, '#0C0F17')
        break
      case 'cyber-dark':
        wallGrad.addColorStop(0, '#02060B')
        wallGrad.addColorStop(0.7, '#05111B')
        wallGrad.addColorStop(1, '#0A1C29')
        break
      case 'midnight-studio':
        wallGrad.addColorStop(0, '#06040A')
        wallGrad.addColorStop(0.7, '#0E0916')
        wallGrad.addColorStop(1, '#150E22')
        break
      case 'dark-navy-slate':
      default:
        wallGrad.addColorStop(0, '#020409')
        wallGrad.addColorStop(0.65, '#060B16')
        wallGrad.addColorStop(1, '#0C1527')
        break
    }
    ctx.fillStyle = wallGrad
    ctx.fillRect(0, 0, width, horizonY)

    // 2. Glossy Dark Floor Base
    const floorGrad = ctx.createLinearGradient(0, horizonY, 0, height)
    floorGrad.addColorStop(0, '#0B101E')
    floorGrad.addColorStop(0.3, '#060A13')
    floorGrad.addColorStop(1, '#020307')
    ctx.fillStyle = floorGrad
    ctx.fillRect(0, horizonY, width, height - horizonY)

    // 3. Mid-Frequency Reactive Ambient Radial Glow
    const midPulse = config.audio.midFreqPulseEnabled
      ? (bands.mid * (config.audio.midFreqPulseIntensity / 100))
      : 0
    const radialRadius = Math.max(width, height) * (0.42 + midPulse * 0.18)
    const centerX = (config.posX / 100) * width
    const centerY = (config.posY / 100) * height

    const ambientGrad = ctx.createRadialGradient(
      centerX,
      centerY,
      radialRadius * 0.05,
      centerX,
      centerY,
      radialRadius
    )
    ambientGrad.addColorStop(0, palette.primary)
    ambientGrad.addColorStop(0.4, palette.secondary)
    ambientGrad.addColorStop(0.8, 'transparent')
    ambientGrad.addColorStop(1, 'transparent')

    ctx.save()
    ctx.globalAlpha = Math.min(0.35, 0.08 + midPulse * 0.22)
    ctx.globalCompositeOperation = 'screen'
    ctx.fillStyle = ambientGrad
    ctx.fillRect(0, 0, width, height)
    ctx.restore()

    // 4. Subtle Horizon Line & Floor Grid
    if (config.reflection.floorGridEnabled) {
      ctx.save()
      // Horizon Gleam
      const horizonGleam = ctx.createLinearGradient(0, 0, width, 0)
      horizonGleam.addColorStop(0, 'transparent')
      horizonGleam.addColorStop(0.2, 'rgba(255, 255, 255, 0.04)')
      horizonGleam.addColorStop(0.5, 'rgba(255, 255, 255, 0.16)')
      horizonGleam.addColorStop(0.8, 'rgba(255, 255, 255, 0.04)')
      horizonGleam.addColorStop(1, 'transparent')
      ctx.strokeStyle = horizonGleam
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.moveTo(0, horizonY)
      ctx.lineTo(width, horizonY)
      ctx.stroke()

      // Perspective Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)'
      ctx.lineWidth = 1
      const vanishingX = width * 0.5
      for (let x = -width * 0.5; x <= width * 1.5; x += width * 0.1) {
        ctx.beginPath()
        ctx.moveTo(vanishingX, horizonY)
        ctx.lineTo(x, height)
        ctx.stroke()
      }

      // Horizontal floor depth lines
      const floorH = height - horizonY
      for (let f = 1; f <= 5; f++) {
        const lineY = horizonY + Math.pow(f / 5, 2) * floorH
        ctx.beginPath()
        ctx.moveTo(0, lineY)
        ctx.lineTo(width, lineY)
        ctx.stroke()
      }
      ctx.restore()
    }

    ctx.restore()
  }

  /**
   * Glossy Floor Reflection with Vertical Inversion & Gradient Falloff
   */
  private renderFloorReflection(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: NeonEnergyStudioConfig,
    centerX: number,
    centerY: number,
    horizonY: number,
    scale: number,
    palette: ReturnType<typeof this.resolvePalette>
  ): void {
    const reflectionCfg = config.reflection
    const distToHorizon = horizonY - centerY

    // Reflection anchor is mirrored across the horizon
    const reflectedCenterY = horizonY + distToHorizon

    ctx.save()

    // Clip strictly to floor region below horizon
    ctx.beginPath()
    ctx.rect(0, horizonY, width, height - horizonY)
    ctx.clip()

    // Vertical linear gradient mask for natural glossy reflection dissipation
    const fadeDistance = (height - horizonY) * (reflectionCfg.reflectionFalloff / 100)
    const fadeGrad = ctx.createLinearGradient(0, horizonY, 0, horizonY + fadeDistance)
    const baseAlpha = (reflectionCfg.opacity / 100) * 0.55
    fadeGrad.addColorStop(0, `rgba(0, 0, 0, ${baseAlpha})`)
    fadeGrad.addColorStop(0.3, `rgba(0, 0, 0, ${baseAlpha * 0.6})`)
    fadeGrad.addColorStop(0.7, `rgba(0, 0, 0, ${baseAlpha * 0.2})`)
    fadeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

    // Draw vertically inverted reflection with slight blur
    ctx.save()
    ctx.globalAlpha = baseAlpha
    ctx.translate(centerX, reflectedCenterY)
    ctx.scale(1, -1) // Vertical flip
    ctx.translate(-centerX, -reflectedCenterY)

    if (reflectionCfg.blurPx > 0 && typeof ctx.filter !== 'undefined') {
      ctx.filter = `blur(${reflectionCfg.blurPx}px)`
    }

    this.renderNeonObject(
      ctx,
      width,
      height,
      config,
      centerX,
      reflectedCenterY,
      scale * 0.98,
      palette,
      true
    )
    ctx.restore()

    // Apply linear gradient fade-out mask using destination-in
    ctx.save()
    ctx.globalCompositeOperation = 'destination-in'
    ctx.fillStyle = fadeGrad
    ctx.fillRect(0, horizonY, width, height - horizonY)
    ctx.restore()

    ctx.restore()
  }

  /**
   * Multi-Pass Layered Neon Glow Renderer
   */
  private renderNeonObject(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: NeonEnergyStudioConfig,
    cx: number,
    cy: number,
    scale: number,
    palette: ReturnType<typeof this.resolvePalette>,
    isReflection: boolean
  ): void {
    ctx.save()

    const glow = config.glow
    const intensity = (glow.glowIntensity / 100) * (isReflection ? 0.6 : 1.0)
    const auraR = glow.auraRadius

    ctx.translate(cx, cy)
    ctx.scale(scale, scale)

    if (config.mode === 'image' && config.image.logoUrl) {
      const img = this.getCachedImage(config.image.logoUrl)
      if (img) {
        this.renderImageNeonPasses(ctx, img, config.image.logoScale / 100, intensity, auraR, palette, isReflection)
      } else {
        // Fallback to text while image is loading or invalid
        this.renderTextNeonPasses(ctx, config.text, intensity, auraR, palette, isReflection)
      }
    } else {
      this.renderTextNeonPasses(ctx, config.text, intensity, auraR, palette, isReflection)
    }

    ctx.restore()
  }

  /**
   * Neon Image Pass Compositor (Preserves Alpha, Creates Multi-Colour Aura)
   */
  private renderImageNeonPasses(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    scaleMultiplier: number,
    intensity: number,
    auraR: number,
    palette: ReturnType<typeof this.resolvePalette>,
    isReflection: boolean
  ): void {
    const baseW = 480 * scaleMultiplier
    const aspect = img.naturalWidth / img.naturalHeight
    const drawW = baseW
    const drawH = baseW / aspect
    const x = -drawW / 2
    const y = -drawH / 2

    ctx.save()

    // Pass 1: Broad Multicolour Outer Aura (Additive)
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.shadowColor = palette.secondary
    ctx.shadowBlur = auraR * 1.6
    ctx.globalAlpha = 0.45 * intensity
    ctx.drawImage(img, x, y, drawW, drawH)
    ctx.restore()

    // Pass 2: Secondary Chromatic Shift (Tertiary Color - Subtle Offset)
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.shadowColor = palette.tertiary
    ctx.shadowBlur = auraR * 1.1
    ctx.globalAlpha = 0.55 * intensity
    ctx.drawImage(img, x - 1.5, y + 1, drawW, drawH)
    ctx.restore()

    // Pass 3: Primary Intense Neon Glow (Cyan / Theme Primary)
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.shadowColor = palette.primary
    ctx.shadowBlur = auraR * 0.65
    ctx.globalAlpha = 0.75 * intensity
    ctx.drawImage(img, x + 1, y - 1, drawW, drawH)
    ctx.restore()

    // Pass 4: Inner Core Highlight
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.shadowColor = palette.highlight
    ctx.shadowBlur = auraR * 0.25
    ctx.globalAlpha = 0.85 * intensity
    ctx.drawImage(img, x, y, drawW, drawH)
    ctx.restore()

    // Pass 5: Crisp Original Logo Layer
    ctx.save()
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = isReflection ? 0.7 : 0.95
    ctx.drawImage(img, x, y, drawW, drawH)
    ctx.restore()

    ctx.restore()
  }

  /**
   * Neon Text Pass Compositor (Authentic White-Tube Core + Multi-Colour Glows)
   */
  private renderTextNeonPasses(
    ctx: CanvasRenderingContext2D,
    textCfg: NeonEnergyStudioConfig['text'],
    intensity: number,
    auraR: number,
    palette: ReturnType<typeof this.resolvePalette>,
    isReflection: boolean
  ): void {
    const rawText = textCfg.customText || 'INDIA TOOLS'
    const lines = rawText.split('\n')
    const fontSize = textCfg.fontSize || 76
    const lineHeight = fontSize * 1.2
    const totalHeight = lines.length * lineHeight

    ctx.save()

    // Configure Font
    ctx.font = `${textCfg.fontWeight} ${fontSize}px ${textCfg.fontFamily || 'Inter'}, system-ui, sans-serif`
    ctx.textAlign = textCfg.textAlign || 'center'
    ctx.textBaseline = 'middle'

    // Letter Spacing (Canvas API standard where supported)
    if ('letterSpacing' in ctx && typeof textCfg.letterSpacing === 'number') {
      ;(ctx as any).letterSpacing = `${textCfg.letterSpacing}px`
    }

    const drawLines = (yOffset: number = 0) => {
      lines.forEach((line, idx) => {
        const lineY = -totalHeight / 2 + idx * lineHeight + lineHeight / 2 + yOffset
        ctx.fillText(line, 0, lineY)
      })
    }

    const strokeLines = (lineWidth: number, yOffset: number = 0) => {
      ctx.lineWidth = lineWidth
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      lines.forEach((line, idx) => {
        const lineY = -totalHeight / 2 + idx * lineHeight + lineHeight / 2 + yOffset
        ctx.strokeText(line, 0, lineY)
      })
    }

    // Pass 1: Broad Outer Aura (Magenta / Secondary)
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.shadowColor = palette.secondary
    ctx.shadowBlur = auraR * 1.8
    ctx.fillStyle = palette.secondary
    ctx.globalAlpha = 0.5 * intensity
    drawLines()
    ctx.restore()

    // Pass 2: Chromatic Fringe Glow (Yellow / Tertiary)
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.shadowColor = palette.tertiary
    ctx.shadowBlur = auraR * 1.2
    ctx.fillStyle = palette.tertiary
    ctx.globalAlpha = 0.6 * intensity
    drawLines(1.5)
    ctx.restore()

    // Pass 3: Primary High-Intensity Neon Glow (Cyan / Lime)
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.shadowColor = palette.primary
    ctx.shadowBlur = auraR * 0.7
    ctx.fillStyle = palette.primary
    ctx.globalAlpha = 0.8 * intensity
    drawLines(-1.0)
    ctx.restore()

    // Pass 4: Neon Tube Outer Wall Stroke
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.strokeStyle = palette.highlight
    ctx.shadowColor = palette.primary
    ctx.shadowBlur = auraR * 0.35
    ctx.globalAlpha = 0.9 * intensity
    strokeLines(Math.max(3, fontSize * 0.06))
    ctx.restore()

    // Pass 5: Bright White Neon Gas Core (Authentic Tube Look)
    ctx.save()
    ctx.globalCompositeOperation = 'source-over'
    if (textCfg.whiteCore) {
      ctx.shadowColor = '#FFFFFF'
      ctx.shadowBlur = 6
      ctx.fillStyle = '#FFFFFF'
      ctx.globalAlpha = isReflection ? 0.75 : 0.98
      drawLines()

      // Ultra-crisp thin center stroke
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = Math.max(1.5, fontSize * 0.025)
      strokeLines(Math.max(1.5, fontSize * 0.025))
    } else {
      ctx.shadowColor = palette.primary
      ctx.shadowBlur = 8
      ctx.fillStyle = textCfg.textColor || palette.primary
      ctx.globalAlpha = isReflection ? 0.8 : 1.0
      drawLines()
    }
    ctx.restore()

    ctx.restore()
  }
}

export const neonEnergyEngine = new NeonEnergyEngine()
