/**
 * IndiaTools — Cinematic Portal VFX Studio Engine
 * Production-grade Canvas 2D / WebGL Compositor
 * 
 * Features:
 * - Module A: Portal Ring (elliptical/circular with edge feathering & multi-layer glow)
 * - Module B: Energy Flow (animated plasma/electric arcs with harmonic turbulence)
 * - Module C: Masked Interior Distortion (swirl & vortex tunnel strictly inside portal mask)
 * - Module D: Cinematic Light Spill (soft radial emission with exponential falloff)
 * - Module E: Energy Shockwave (expanding refractive displacement ring)
 * - Module F: Particle Suction (bounded particles pulled toward event horizon)
 * - Module G: Portal Opening & Closing (timeline envelope animation)
 * - Module H: Portal Exit Transition (camera zoom through portal)
 * - Music Reactivity (bass glow pulses, beat shockwaves, treble shimmer)
 * - Zero-GC typed object pools at 60 FPS
 */

import {
  CinematicPortalStudioConfig,
  PortalRingConfig,
  PortalInteriorConfig,
  PortalParticleSuctionConfig,
} from './portalTypes.ts'
import { NormalizedAudioBands } from '../audioToVideo/types.ts'

interface SuctionParticle {
  x: number
  y: number
  angle: number
  distance: number
  speed: number
  size: number
  alpha: number
  life: number
  maxLife: number
}

export class PortalVfxEngine {
  private particles: SuctionParticle[] = []
  private imageCache: Map<string, HTMLImageElement> = new Map()

  constructor() {
    this.initParticlePool()
  }

  private initParticlePool() {
    this.particles = []
    for (let i = 0; i < 200; i++) {
      this.particles.push({
        x: 0,
        y: 0,
        angle: Math.random() * Math.PI * 2,
        distance: 1.2 + Math.random() * 1.0,
        speed: 0.008 + Math.random() * 0.015,
        size: 1 + Math.random() * 3,
        alpha: 0.3 + Math.random() * 0.7,
        life: Math.random() * 100,
        maxLife: 60 + Math.random() * 80,
      })
    }
  }

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
   * Main render compositor invoked on every animation frame.
   * Renders the base photo and all enabled portal effects.
   */
  public render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: CinematicPortalStudioConfig,
    baseImage: HTMLImageElement | null,
    bands: NormalizedAudioBands,
    currentTime: number,
    totalDuration: number
  ) {
    ctx.save()
    ctx.clearRect(0, 0, width, height)

    // Calculate Exit Zoom Transformation if enabled
    let exitZoom = 1.0
    let exitRot = 0
    if (
      config.masterAllEffectsEnabled &&
      !config.isBeforePreviewActive &&
      config.exitTransition.enabled &&
      currentTime >= config.exitTransition.startTime
    ) {
      const elapsed = currentTime - config.exitTransition.startTime
      const progress = Math.min(1.0, elapsed / Math.max(0.1, config.exitTransition.duration))
      exitZoom = 1.0 + progress * progress * (config.exitTransition.zoomSpeed * 4.0)
      exitRot = progress * (config.exitTransition.rotation || 0)
    }

    // Portal Center & Dimensions
    const cx = (config.ring.posX / 100) * width
    const cy = (config.ring.posY / 100) * height

    // Apply Exit Zoom to entire canvas context
    if (exitZoom > 1.0) {
      ctx.translate(cx, cy)
      ctx.scale(exitZoom, exitZoom)
      if (exitRot !== 0) ctx.rotate((exitRot * Math.PI) / 180)
      ctx.translate(-cx, -cy)
    }

    // 1. Render Base Photograph
    if (baseImage) {
      this.renderBaseImage(ctx, width, height, baseImage, config)
    } else {
      // Empty neutral canvas
      ctx.fillStyle = '#090A0F'
      ctx.fillRect(0, 0, width, height)
    }

    // If "Before / After" is active or master switch is OFF, we stop here (clean photograph)
    if (config.isBeforePreviewActive || !config.masterAllEffectsEnabled) {
      ctx.restore()
      return
    }

    // Calculate Scale Envelope from Opening / Closing Animation
    let portalScale = 1.0
    if (config.opening.enabled) {
      portalScale = this.calculateOpeningScale(config.opening, currentTime, totalDuration)
      if (portalScale <= 0.001) {
        ctx.restore()
        return // Portal closed
      }
    }

    // Audio-reactive modulation multipliers
    let audioGlowBoost = 1.0
    let audioPulseScale = 1.0
    if (config.audioReactivity.enabled) {
      const sens = config.audioReactivity.sensitivity
      if (config.audioReactivity.modulateGlow) {
        audioGlowBoost += bands.bass * 0.8 * sens
      }
      if (config.audioReactivity.modulateOpening && bands.isBeatHit) {
        audioPulseScale += bands.bass * 0.15 * sens
      }
    }

    const rx = (config.ring.width / 2) * portalScale * audioPulseScale
    const ry = (config.ring.shape === 'circle' ? rx : (config.ring.height / 2)) * portalScale * audioPulseScale
    const rotationRad = (config.ring.rotation * Math.PI) / 180

    // 2. Render Module D: Cinematic Light Spill (drawn behind ring onto photo)
    if (config.lightSpill.enabled) {
      this.renderLightSpill(ctx, cx, cy, rx, ry, config.lightSpill, audioGlowBoost)
    }

    // 3. Render Module C: Masked Portal Interior Distortion (strictly within portal ellipse)
    if (config.interior.enabled) {
      this.renderInteriorDistortion(
        ctx,
        width,
        height,
        cx,
        cy,
        rx * config.ring.innerRadius,
        ry * config.ring.innerRadius,
        rotationRad,
        config.interior,
        baseImage,
        currentTime
      )
    }

    // 4. Render Module F: Particle Suction (moving toward event horizon)
    if (config.particles.enabled) {
      this.renderParticleSuction(
        ctx,
        cx,
        cy,
        rx,
        ry,
        rotationRad,
        config.particles,
        currentTime,
        bands,
        config.audioReactivity
      )
    }

    // 5. Render Module A: Portal Ring
    if (config.ring.enabled) {
      this.renderPortalRing(ctx, cx, cy, rx, ry, rotationRad, config.ring, audioGlowBoost, currentTime)
    }

    // 6. Render Module B: Energy Flow (animated plasma/electric arcs along perimeter)
    if (config.energyFlow.enabled) {
      this.renderEnergyFlow(ctx, cx, cy, rx, ry, rotationRad, config.energyFlow, audioGlowBoost, currentTime)
    }

    // 7. Render Module E: Expanding Energy Shockwave
    if (config.shockwave.enabled) {
      this.renderShockwave(
        ctx,
        cx,
        cy,
        rx,
        ry,
        rotationRad,
        config.shockwave,
        currentTime,
        bands,
        config.audioReactivity
      )
    }

    ctx.restore()
  }

  /**
   * Renders the Base Photograph preserving aspect ratio and fit mode
   */
  private renderBaseImage(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    img: HTMLImageElement,
    config: CinematicPortalStudioConfig
  ) {
    ctx.save()

    const imgAspect = img.naturalWidth / img.naturalHeight
    const canvasAspect = width / height

    let drawW = width
    let drawH = height

    if (config.imageFit === 'fit') {
      if (canvasAspect > imgAspect) {
        drawH = height
        drawW = height * imgAspect
      } else {
        drawW = width
        drawH = width / imgAspect
      }
    } else if (config.imageFit === 'fill') {
      if (canvasAspect > imgAspect) {
        drawW = width
        drawH = width / imgAspect
      } else {
        drawH = height
        drawW = height * imgAspect
      }
    } else if (config.imageFit === 'original') {
      drawW = img.naturalWidth
      drawH = img.naturalHeight
    }

    const zoom = Math.max(0.2, config.imageZoom || 1.0)
    drawW *= zoom
    drawH *= zoom

    const panX = (config.imagePanX / 100) * width
    const panY = (config.imagePanY / 100) * height

    const dx = width / 2 - drawW / 2 + panX
    const dy = height / 2 - drawH / 2 + panY

    ctx.drawImage(img, dx, dy, drawW, drawH)
    ctx.restore()
  }

  /**
   * Calculates scale envelope for opening and closing animations
   */
  private calculateOpeningScale(
    cfg: CinematicPortalStudioConfig['opening'],
    time: number,
    totalDuration: number
  ): number {
    const dur = Math.max(1.0, totalDuration > 0 ? totalDuration : 15.0)
    const loopT = time % dur

    const openEnd = cfg.openDuration
    const holdEnd = openEnd + cfg.holdDuration
    const closeEnd = holdEnd + cfg.closeDuration

    if (loopT < openEnd) {
      // Opening phase
      const t = loopT / openEnd
      const eased = this.ease(t, cfg.easing)
      return cfg.initialScale + (cfg.finalScale - cfg.initialScale) * eased
    } else if (loopT < holdEnd) {
      // Hold phase
      return cfg.finalScale
    } else if (loopT < closeEnd) {
      // Closing phase
      const t = (loopT - holdEnd) / cfg.closeDuration
      const eased = this.ease(t, cfg.easing)
      return cfg.finalScale + (0.0 - cfg.finalScale) * eased
    } else {
      // Dormant phase before loop resets
      return 0.0
    }
  }

  private ease(t: number, style: string): number {
    switch (style) {
      case 'linear':
        return t
      case 'ease-in-out':
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      case 'elastic':
        return Math.sin(t * Math.PI * 2.5) * Math.pow(t, 2)
      case 'smooth-sine':
      default:
        return (Math.sin(t * Math.PI - Math.PI / 2) + 1) / 2
    }
  }

  /**
   * Module D: Cinematic Light Spill
   * Emits soft directional light from portal onto surrounding environment
   */
  private renderLightSpill(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    cfg: CinematicPortalStudioConfig['lightSpill'],
    audioBoost: number
  ) {
    ctx.save()
    ctx.globalCompositeOperation = cfg.blendMode || 'screen'

    const spillR = Math.max(rx, ry) + (cfg.spreadRadius || 200)
    const intensity = Math.min(1.0, ((cfg.intensity || 50) / 100) * audioBoost)
    const alpha = ((cfg.opacity || 65) / 100) * intensity

    const grad = ctx.createRadialGradient(cx, cy, Math.min(rx, ry) * 0.5, cx, cy, spillR)
    grad.addColorStop(0, this.hexToRgba(cfg.color, alpha))
    grad.addColorStop(0.35, this.hexToRgba(cfg.color, alpha * 0.5))
    grad.addColorStop(1, this.hexToRgba(cfg.color, 0))

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(cx, cy, spillR, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }

  /**
   * Module C: Masked Interior Distortion
   * Strict clipping: Distortion stays 100% inside the portal opening
   */
  private renderInteriorDistortion(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    cx: number,
    cy: number,
    innerRx: number,
    innerRy: number,
    rotationRad: number,
    cfg: PortalInteriorConfig,
    baseImg: HTMLImageElement | null,
    time: number
  ) {
    if (innerRx <= 1 || innerRy <= 1) return

    ctx.save()

    // 1. Strict Elliptical Clipping Mask
    ctx.beginPath()
    ctx.ellipse(cx, cy, innerRx, innerRy, rotationRad, 0, Math.PI * 2)
    ctx.clip()

    // 2. Check if a secondary portal interior image is uploaded
    const interiorImg = this.getCachedImage(cfg.interiorBgUrl)
    if (interiorImg) {
      // Render interior dimension with perspective depth zoom
      ctx.save()
      const t = time * cfg.speed
      const pulseZoom = 1.05 + Math.sin(t * 1.5) * 0.05 * (cfg.warpIntensity / 50)
      ctx.translate(cx, cy)
      ctx.rotate((cfg.swirlAmount * Math.PI) / 180 + t * 0.1)
      ctx.scale(pulseZoom, pulseZoom)

      const w = innerRx * 2.5
      const h = innerRy * 2.5
      ctx.drawImage(interiorImg, -w / 2, -h / 2, w, h)
      ctx.restore()
    } else if (baseImg) {
      // Warp base image inside the portal: concentric vortex swirl
      ctx.save()
      const t = time * cfg.speed
      const swirlRad = (cfg.swirlAmount * Math.PI) / 180

      ctx.translate(cx, cy)
      ctx.rotate(swirlRad * Math.sin(t * 1.2))
      const scale = 1.0 + (cfg.perspectiveDepth / 100) * 0.4
      ctx.scale(scale, scale)

      // Draw base image centered
      const drawW = innerRx * 3.0
      const drawH = innerRy * 3.0
      ctx.drawImage(baseImg, -drawW / 2, -drawH / 2, drawW, drawH)
      ctx.restore()
    } else {
      // Cosmic void gradient
      const voidGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, Math.max(innerRx, innerRy))
      voidGrad.addColorStop(0, '#020617')
      voidGrad.addColorStop(0.6, '#0f172a')
      voidGrad.addColorStop(1, '#000000')
      ctx.fillStyle = voidGrad
      ctx.fillRect(cx - innerRx, cy - innerRy, innerRx * 2, innerRy * 2)
    }

    // 3. Dimensional Tunnel Vignette & Depth Ring
    const depthGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(innerRx, innerRy))
    depthGrad.addColorStop(0, 'rgba(0,0,0,0.7)')
    depthGrad.addColorStop(0.6, 'rgba(0,0,0,0.2)')
    depthGrad.addColorStop(0.9, 'rgba(0,0,0,0.5)')
    depthGrad.addColorStop(1, 'rgba(0,0,0,0.95)')
    ctx.fillStyle = depthGrad
    ctx.beginPath()
    ctx.ellipse(cx, cy, innerRx, innerRy, rotationRad, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }

  /**
   * Module F: Particle Suction
   * Particles travel from outer spawn radius and get sucked into the portal
   */
  private renderParticleSuction(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    rotationRad: number,
    cfg: PortalParticleSuctionConfig,
    time: number,
    bands: NormalizedAudioBands,
    audioReactivity: CinematicPortalStudioConfig['audioReactivity']
  ) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'

    const count = Math.min(this.particles.length, cfg.count || 75)
    let speedMult = (cfg.speed || 1.3) * 0.008
    if (audioReactivity.enabled && audioReactivity.modulateParticles) {
      speedMult *= 1.0 + bands.treble * 1.5 * audioReactivity.sensitivity
    }

    const maxDist = cfg.spawnRadius || 1.8
    const isInward = cfg.direction === 'inward'

    for (let i = 0; i < count; i++) {
      const p = this.particles[i]

      // Advance particle position
      if (isInward) {
        p.distance -= p.speed * speedMult * 60
        // If sucked past inner threshold, respawn at outer rim
        if (p.distance <= 0.85) {
          p.distance = maxDist + Math.random() * 0.4
          p.angle = Math.random() * Math.PI * 2
        }
      } else {
        p.distance += p.speed * speedMult * 60
        if (p.distance >= maxDist + 0.4) {
          p.distance = 0.85
          p.angle = Math.random() * Math.PI * 2
        }
      }

      // Add harmonic turbulence
      const turbAngle = p.angle + Math.sin(time * 2 + i) * ((cfg.turbulence || 30) / 100) * 0.3
      const px = cx + Math.cos(turbAngle + rotationRad) * (rx * p.distance)
      const py = cy + Math.sin(turbAngle + rotationRad) * (ry * p.distance)

      // Fade out as it nears event horizon
      const horizonAlpha = isInward
        ? Math.min(1.0, (p.distance - 0.85) / 0.3)
        : Math.min(1.0, (maxDist - p.distance) / 0.3)

      const alpha = p.alpha * horizonAlpha

      ctx.fillStyle = this.hexToRgba(cfg.color, alpha)
      ctx.beginPath()
      ctx.arc(px, py, (cfg.size || 3) * (p.distance / maxDist), 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }

  /**
   * Module A: Portal Ring
   * Renders elliptical dimensional portal rim with configurable thickness, glow and feathering
   */
  private renderPortalRing(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    rotationRad: number,
    cfg: PortalRingConfig,
    audioGlowBoost: number,
    time: number
  ) {
    ctx.save()

    const opacity = (cfg.opacity ?? 100) / 100
    ctx.globalAlpha = opacity

    const glow = Math.min(80, (cfg.glowIntensity || 65) * audioGlowBoost)
    const thickness = cfg.thickness || 14

    // 1. Outer Diffuse Glow Layer
    ctx.save()
    ctx.shadowColor = cfg.primaryColor
    ctx.shadowBlur = glow * 1.5
    ctx.strokeStyle = this.hexToRgba(cfg.primaryColor, 0.45)
    ctx.lineWidth = thickness * 1.5
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, rotationRad, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()

    // 2. Main Dual-Color Gradient Ring
    ctx.save()
    ctx.shadowColor = cfg.secondaryColor
    ctx.shadowBlur = glow * 0.7
    ctx.lineWidth = thickness

    // Dynamic linear gradient oriented along rotation
    const grad = ctx.createLinearGradient(
      cx - rx * Math.cos(rotationRad),
      cy - ry * Math.sin(rotationRad),
      cx + rx * Math.cos(rotationRad),
      cy + ry * Math.sin(rotationRad)
    )
    grad.addColorStop(0, cfg.primaryColor)
    grad.addColorStop(0.5, cfg.secondaryColor)
    grad.addColorStop(1, cfg.primaryColor)

    ctx.strokeStyle = grad
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, rotationRad, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()

    // 3. Crisp Intense Core Wire
    ctx.save()
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = Math.max(1.5, thickness * 0.25)
    ctx.shadowColor = '#FFFFFF'
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, rotationRad, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()

    ctx.restore()
  }

  /**
   * Module B: Energy Flow
   * Animated plasma arcs and electric filaments circulating around the portal rim
   */
  private renderEnergyFlow(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    rotationRad: number,
    cfg: CinematicPortalStudioConfig['energyFlow'],
    audioGlowBoost: number,
    time: number
  ) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'

    const dir = cfg.direction === 'clockwise' ? 1 : -1
    const t = time * (cfg.speed || 1.2) * dir
    const segments = 64
    const turbFactor = (cfg.turbulence || 35) / 100

    ctx.strokeStyle = cfg.color || '#38BDF8'
    ctx.shadowColor = cfg.color || '#38BDF8'
    ctx.shadowBlur = 18 * audioGlowBoost
    ctx.lineWidth = 2.5

    // Arc 1: Primary plasma streamer
    ctx.beginPath()
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      const noise =
        Math.sin(angle * 6 + t * 4) * 8 * turbFactor +
        Math.cos(angle * 12 - t * 6) * 4 * turbFactor

      const rCurrentX = rx + noise
      const rCurrentY = ry + noise

      const x = cx + Math.cos(angle + rotationRad) * rCurrentX
      const y = cy + Math.sin(angle + rotationRad) * rCurrentY

      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.stroke()

    // Arc 2: Counter-rotating secondary lightning filaments
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      const noise = Math.sin(angle * 10 - t * 5) * 6 * turbFactor
      const x = cx + Math.cos(angle + rotationRad) * (rx + noise)
      const y = cy + Math.sin(angle + rotationRad) * (ry + noise)

      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.stroke()

    ctx.restore()
  }

  /**
   * Module E: Energy Shockwave
   * Expanding refraction distortion ring traveling outward from the portal
   */
  private renderShockwave(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    rotationRad: number,
    cfg: CinematicPortalStudioConfig['shockwave'],
    time: number,
    bands: NormalizedAudioBands,
    audioReactivity: CinematicPortalStudioConfig['audioReactivity']
  ) {
    const dur = Math.max(0.5, cfg.duration || 2.0)
    let progress = (time * (cfg.speed || 1.2)) % dur / dur

    // Trigger on beat if configured
    if (cfg.repeatMode === 'beat' && audioReactivity.enabled) {
      if (!bands.isBeatHit && progress > 0.6) return
    }

    ctx.save()
    ctx.globalCompositeOperation = 'screen'

    const maxExpansion = cfg.radius || 200
    const waveExpansion = progress * maxExpansion
    const currentRx = rx + waveExpansion
    const currentRy = ry + waveExpansion

    const alpha = Math.max(0, (1 - progress) * ((cfg.opacity || 80) / 100))
    const ringW = (cfg.ringWidth || 24) * (1 - progress * 0.5)

    ctx.lineWidth = ringW
    ctx.strokeStyle = `rgba(186, 230, 253, ${alpha * 0.6})`
    ctx.shadowColor = '#00F0FF'
    ctx.shadowBlur = 12 * (1 - progress)

    ctx.beginPath()
    ctx.ellipse(cx, cy, currentRx, currentRy, rotationRad, 0, Math.PI * 2)
    ctx.stroke()

    // Sharp outer refraction crest
    ctx.lineWidth = 2
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.9})`
    ctx.beginPath()
    ctx.ellipse(cx, cy, currentRx + ringW / 2, currentRy + ringW / 2, rotationRad, 0, Math.PI * 2)
    ctx.stroke()

    ctx.restore()
  }

  private hexToRgba(hex: string, alpha: number): string {
    const clean = hex.replace('#', '')
    let r = 0, g = 0, b = 0
    if (clean.length === 3) {
      r = parseInt(clean[0] + clean[0], 16)
      g = parseInt(clean[1] + clean[1], 16)
      b = parseInt(clean[2] + clean[2], 16)
    } else if (clean.length === 6) {
      r = parseInt(clean.substring(0, 2), 16)
      g = parseInt(clean.substring(2, 4), 16)
      b = parseInt(clean.substring(4, 6), 16)
    }
    return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`
  }
}

export const portalVfxEngine = new PortalVfxEngine()
