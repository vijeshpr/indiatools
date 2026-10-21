/**
 * IndiaTools — Music-Grown Garden Studio
 * Real-Time Canvas Botanical Animation & Audio-Reactive Garden Engine
 */

import {
  MusicGrownGardenConfig,
  GardenSceneMetadata,
} from './gardenTypes.ts'
import { getGardenScene } from './gardenPresets.ts'
import { NormalizedAudioBands } from '../audioToVideo/types.ts'

interface FireflyParticle {
  x: number
  y: number
  baseX: number
  baseY: number
  speedX: number
  speedY: number
  freq: number
  phase: number
  size: number
  orbitRadiusX: number
  orbitRadiusY: number
}

interface PollenParticle {
  x: number
  y: number
  speedX: number
  speedY: number
  size: number
  alpha: number
  phase: number
}

interface BotanicalFlower {
  relX: number // 0 to 1 across canvas width
  relY: number // 0 to 1 across canvas height
  baseScale: number
  angle: number
  swayPhase: number
  swaySpeed: number
  petalCount: number
  layers: number
  type: 'rose' | 'wildflower' | 'jasmine' | 'lotus'
  depth: number // 0.6 (midground) to 1.3 (foreground)
}

export class MusicGrownGardenEngine {
  private imageCache: Map<string, HTMLImageElement> = new Map()
  private fireflies: FireflyParticle[] = []
  private pollen: PollenParticle[] = []
  private flowers: BotanicalFlower[] = []

  // Audio smoothing memory
  private smoothedBass = 0
  private smoothedMid = 0
  private smoothedTreble = 0
  private smoothedEnergy = 0
  private smoothedBloom = 0
  private beatPulse = 0

  constructor() {
    this.initPools()
  }

  private initPools() {
    // 1. Initialize persistent fireflies
    this.fireflies = []
    for (let i = 0; i < 90; i++) {
      const bx = Math.random()
      const by = 0.2 + Math.random() * 0.75
      this.fireflies.push({
        x: bx,
        y: by,
        baseX: bx,
        baseY: by,
        speedX: 0.15 + Math.random() * 0.35,
        speedY: 0.12 + Math.random() * 0.28,
        freq: 1.5 + Math.random() * 3.5,
        phase: Math.random() * Math.PI * 2,
        size: 1.5 + Math.random() * 2.5,
        orbitRadiusX: 0.04 + Math.random() * 0.08,
        orbitRadiusY: 0.03 + Math.random() * 0.06,
      })
    }

    // 2. Initialize pollen spores
    this.pollen = []
    for (let i = 0; i < 120; i++) {
      this.pollen.push({
        x: Math.random(),
        y: Math.random(),
        speedX: (Math.random() - 0.5) * 0.015,
        speedY: -0.01 - Math.random() * 0.025,
        size: 1.0 + Math.random() * 2.0,
        alpha: 0.3 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
      })
    }

    // 3. Initialize natural botanical flower arrangements
    this.flowers = [
      { relX: 0.15, relY: 0.88, baseScale: 1.15, angle: -0.15, swayPhase: 0.2, swaySpeed: 1.1, petalCount: 10, layers: 3, type: 'rose', depth: 1.25 },
      { relX: 0.28, relY: 0.92, baseScale: 0.95, angle: 0.12, swayPhase: 1.5, swaySpeed: 1.3, petalCount: 8, layers: 3, type: 'wildflower', depth: 1.1 },
      { relX: 0.45, relY: 0.85, baseScale: 0.85, angle: -0.05, swayPhase: 2.8, swaySpeed: 0.9, petalCount: 12, layers: 3, type: 'lotus', depth: 0.9 },
      { relX: 0.62, relY: 0.90, baseScale: 1.05, angle: 0.18, swayPhase: 3.9, swaySpeed: 1.2, petalCount: 6, layers: 2, type: 'jasmine', depth: 1.15 },
      { relX: 0.78, relY: 0.86, baseScale: 1.25, angle: -0.12, swayPhase: 4.8, swaySpeed: 1.0, petalCount: 10, layers: 3, type: 'rose', depth: 1.35 },
      { relX: 0.90, relY: 0.93, baseScale: 0.9, angle: 0.22, swayPhase: 5.7, swaySpeed: 1.4, petalCount: 8, layers: 3, type: 'wildflower', depth: 1.05 },
      { relX: 0.38, relY: 0.76, baseScale: 0.7, angle: -0.08, swayPhase: 0.9, swaySpeed: 0.85, petalCount: 8, layers: 2, type: 'wildflower', depth: 0.75 },
      { relX: 0.70, relY: 0.78, baseScale: 0.65, angle: 0.14, swayPhase: 2.3, swaySpeed: 0.95, petalCount: 6, layers: 2, type: 'jasmine', depth: 0.7 },
    ]
  }

  public getCachedImage(url: string): HTMLImageElement | null {
    if (!url) return null
    if (typeof Image === 'undefined') return null
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
   * Main render invocation for Garden Studio
   */
  public render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: MusicGrownGardenConfig,
    bands: NormalizedAudioBands,
    currentTime: number,
    totalDuration: number
  ) {
    if (!config.enabled) return

    const scene = getGardenScene(config.sceneId)

    // 1. Audio Analysis Smoothing (Exponential Moving Average)
    const smooth = config.audioMapping.smoothingFactor
    const invSmooth = 1 - smooth

    this.smoothedBass = this.smoothedBass * smooth + bands.bass * invSmooth
    this.smoothedMid = this.smoothedMid * smooth + bands.mid * invSmooth
    this.smoothedTreble = this.smoothedTreble * smooth + bands.treble * invSmooth
    this.smoothedEnergy = this.smoothedEnergy * smooth + bands.overall * invSmooth

    // Beat pulse decay
    if (bands.isBeatHit) {
      this.beatPulse = 1.0
    } else {
      this.beatPulse = Math.max(0, this.beatPulse - 0.08)
    }

    // Parallax camera displacement
    let parallaxX = 0
    let parallaxY = 0
    if (config.atmosphere.parallaxEnabled && !config.isBeforeActive) {
      const depthAmount = (config.atmosphere.parallaxDepth / 10) * 12
      parallaxX = Math.sin(currentTime * 0.4) * depthAmount
      parallaxY = Math.cos(currentTime * 0.3) * (depthAmount * 0.6)
    }

    ctx.save()
    if (parallaxX !== 0 || parallaxY !== 0) {
      ctx.translate(parallaxX, parallaxY)
    }

    // 2. Render Scene Background (Photo, Custom Image, or Procedural Garden Landscape)
    this.renderBackgroundLayer(ctx, width, height, config, scene)

    // If "Before" preview is active, render background only for clean comparison
    if (config.isBeforeActive) {
      ctx.restore()
      return
    }

    // 3. Atmospheric Light Rays (God-Rays)
    if (config.atmosphere.lightRaysEnabled) {
      this.renderLightRays(ctx, width, height, config, scene, currentTime)
    }

    // 4. Botanical Flower Blooming & Stem Sway Layer
    if (config.bloom.enabled) {
      this.renderBotanicalBloom(ctx, width, height, config, scene, currentTime, totalDuration)
    }

    // 5. Atmospheric Mist
    if (config.atmosphere.mistEnabled) {
      this.renderMist(ctx, width, height, config, scene, currentTime)
    }

    // 6. Floating Pollen Spores
    if (config.atmosphere.pollenEnabled) {
      this.renderPollen(ctx, width, height, config, scene, currentTime)
    }

    // 7. Firefly Drift & Glow
    if (config.atmosphere.firefliesEnabled) {
      this.renderFireflies(ctx, width, height, config, scene, currentTime)
    }

    ctx.restore()
  }

  /**
   * Background Layer: Loads local photorealistic image, custom uploaded photo, or procedural fallback
   */
  private renderBackgroundLayer(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: MusicGrownGardenConfig,
    scene: GardenSceneMetadata
  ) {
    let img: HTMLImageElement | null = null

    if (config.sceneId === 'custom-photo' && config.customPhoto.customImageUrl) {
      img = this.getCachedImage(config.customPhoto.customImageUrl)
    } else {
      img = this.getCachedImage(scene.imagePath)
    }

    const brightnessVal =
      config.sceneId === 'custom-photo' ? config.customPhoto.brightness / 100 : 1.0

    // Ambient energy brightness breathing
    const energyBoost =
      (config.audioMapping.energyToAmbientLighting / 100) * this.smoothedEnergy * 0.25
    const totalBrightness = brightnessVal * (1.0 + energyBoost)

    if (img) {
      ctx.save()
      ctx.filter = `brightness(${totalBrightness})`
      this.drawImageAspect(ctx, img, width, height, config.customPhoto.customImageFit || 'cover')
      ctx.restore()
    } else {
      // Procedural Fallback Landscape
      this.renderProceduralGardenBackdrop(ctx, width, height, scene, totalBrightness)
    }
  }

  /**
   * High-Aesthetic Procedural Garden Backdrop when asset is loading or offline
   */
  private renderProceduralGardenBackdrop(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    scene: GardenSceneMetadata,
    brightness: number
  ) {
    ctx.save()
    const theme = scene.fallbackTheme

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, height * 0.7)
    sky.addColorStop(0, theme.skyTop)
    sky.addColorStop(1, theme.skyBottom)
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, width, height)

    // Distant soft hill silhouettes
    ctx.fillStyle = theme.groundColor
    ctx.beginPath()
    ctx.moveTo(0, height * 0.65)
    ctx.bezierCurveTo(width * 0.3, height * 0.58, width * 0.7, height * 0.72, width, height * 0.62)
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()
    ctx.fill()

    // Foreground organic earth mound
    const earthGrad = ctx.createLinearGradient(0, height * 0.75, 0, height)
    earthGrad.addColorStop(0, theme.foliageColor)
    earthGrad.addColorStop(1, '#020617')
    ctx.fillStyle = earthGrad
    ctx.beginPath()
    ctx.moveTo(0, height * 0.8)
    ctx.bezierCurveTo(width * 0.25, height * 0.74, width * 0.65, height * 0.85, width, height * 0.78)
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()
    ctx.fill()

    // Atmospheric horizon glow
    const glow = ctx.createRadialGradient(width * 0.5, height * 0.6, 50, width * 0.5, height * 0.6, width * 0.7)
    glow.addColorStop(0, theme.mistColor)
    glow.addColorStop(1, 'transparent')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, width, height)

    ctx.restore()
  }

  /**
   * Musical Bloom Engine: Layered geometric flower opening, petal uncurling, and stem sway
   */
  private renderBotanicalBloom(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: MusicGrownGardenConfig,
    scene: GardenSceneMetadata,
    currentTime: number,
    totalDuration: number
  ) {
    const bloomCfg = config.bloom
    const audioMap = config.audioMapping
    const theme = scene.fallbackTheme

    // 1. Calculate Target Bloom Factor B in [0, 1]
    let targetBloom = (bloomCfg.intensity / 100) * 0.4 // Base resting bloom

    // Bass reactivity mapping
    const bassFactor = (audioMap.bassToBloom / 100) * this.smoothedBass * 0.65
    targetBloom += bassFactor

    // Beat transient petal pulse
    if (bloomCfg.beatBloomPulse) {
      const beatFactor = (audioMap.beatToPetalAccents / 100) * this.beatPulse * 0.35
      targetBloom += beatFactor
    }

    // Gradual song progression
    if (bloomCfg.gradualSongBloom && totalDuration > 0) {
      const elapsed = Math.max(0, currentTime - bloomCfg.bloomStartTimeSec)
      const prog = Math.min(1.0, elapsed / (totalDuration - bloomCfg.bloomStartTimeSec || 1))
      targetBloom += prog * 0.4
    }

    // Clamp to max bloom level
    targetBloom = Math.min(bloomCfg.maxBloomLevel, Math.max(0.05, targetBloom))

    // Smooth bloom interpolation
    const speed = bloomCfg.responseSpeed * 0.5
    this.smoothedBloom = this.smoothedBloom * (1 - speed) + targetBloom * speed

    const activeBloom = this.smoothedBloom

    // 2. Render each botanical flower
    const count = Math.min(this.flowers.length, bloomCfg.flowerCount)

    for (let i = 0; i < count; i++) {
      const flower = this.flowers[i]
      const fx = flower.relX * width
      const fy = flower.relY * height

      // Mid-frequency stem & leaf sway
      const swayStrength = (audioMap.midToLeafSway / 100) * (0.05 + this.smoothedMid * 0.1)
      const sway = Math.sin(currentTime * flower.swaySpeed + flower.swayPhase) * swayStrength

      ctx.save()
      ctx.translate(fx, fy)
      ctx.rotate(flower.angle + sway)

      const scale = flower.baseScale * flower.depth
      ctx.scale(scale, scale)

      // A. Render Stem and Leaves
      this.renderStemAndLeaves(ctx, theme.foliageColor, sway)

      // B. Render Dew Drop Highlights
      if (config.atmosphere.dewHighlightsEnabled) {
        this.renderDewHighlight(ctx, activeBloom)
      }

      // C. Render Blooming Petal Layers
      this.renderLayeredFlowerHead(
        ctx,
        flower,
        activeBloom,
        theme.primaryFlowerColor,
        theme.secondaryFlowerColor,
        theme.centerColor,
        bloomCfg.petalLayers
      )

      ctx.restore()
    }
  }

  /**
   * Renders natural curved stem and organic swaying foliage leaves
   */
  private renderStemAndLeaves(ctx: CanvasRenderingContext2D, foliageColor: string, sway: number) {
    ctx.save()

    // Curved stem anchoring to ground
    ctx.strokeStyle = foliageColor
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(-15 * sway * 20, 70, 0, 160)
    ctx.stroke()

    // Left Leaf
    ctx.fillStyle = foliageColor
    ctx.beginPath()
    ctx.moveTo(-4, 50)
    ctx.quadraticCurveTo(-45 - sway * 30, 40, -60, 65)
    ctx.quadraticCurveTo(-35, 75, -4, 60)
    ctx.fill()

    // Right Leaf
    ctx.beginPath()
    ctx.moveTo(4, 85)
    ctx.quadraticCurveTo(40 + sway * 25, 75, 55, 95)
    ctx.quadraticCurveTo(30, 110, 4, 95)
    ctx.fill()

    ctx.restore()
  }

  /**
   * Renders concentric blooming petal layers with uncurling geometry
   */
  private renderLayeredFlowerHead(
    ctx: CanvasRenderingContext2D,
    flower: BotanicalFlower,
    bloom: number,
    primaryColor: string,
    secondaryColor: string,
    centerColor: string,
    maxLayers: number
  ) {
    ctx.save()

    // Outer Petals Layer (Uncurls widest as bloom increases)
    const petalSpread = 0.25 + bloom * 0.75
    const outerRadius = 45 * petalSpread
    const petalCount = flower.petalCount

    for (let layer = maxLayers; layer >= 1; layer--) {
      const layerScale = 0.45 + (layer / maxLayers) * 0.55
      const layerRadius = outerRadius * layerScale
      const count = layer === 1 ? Math.floor(petalCount * 0.7) : petalCount
      const angleStep = (Math.PI * 2) / count
      const layerOffset = (layer * Math.PI) / count

      const g = ctx.createRadialGradient(0, 0, 5, 0, 0, layerRadius)
      if (layer % 2 === 0) {
        g.addColorStop(0, primaryColor)
        g.addColorStop(1, secondaryColor)
      } else {
        g.addColorStop(0, secondaryColor)
        g.addColorStop(1, primaryColor)
      }

      ctx.fillStyle = g
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
      ctx.shadowBlur = 4

      for (let p = 0; p < count; p++) {
        const theta = p * angleStep + layerOffset
        ctx.save()
        ctx.rotate(theta)

        // Draw individual curved petal
        ctx.beginPath()
        ctx.moveTo(0, 0)
        // Petal shape expands outward
        const petalW = (layerRadius * 0.45) * petalSpread
        const petalL = layerRadius
        ctx.bezierCurveTo(-petalW, -petalL * 0.4, -petalW * 0.8, -petalL, 0, -petalL * 1.05)
        ctx.bezierCurveTo(petalW * 0.8, -petalL, petalW, -petalL * 0.4, 0, 0)
        ctx.closePath()
        ctx.fill()

        ctx.restore()
      }
    }

    // Flower Center: Pollen Stamens / Floral Core
    const coreR = Math.max(6, 14 * petalSpread)
    const coreGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, coreR)
    coreGrad.addColorStop(0, centerColor)
    coreGrad.addColorStop(0.7, '#CA8A04')
    coreGrad.addColorStop(1, '#713F12')

    ctx.fillStyle = coreGrad
    ctx.shadowBlur = 6
    ctx.shadowColor = centerColor
    ctx.beginPath()
    ctx.arc(0, 0, coreR, 0, Math.PI * 2)
    ctx.fill()

    // Fine stamen dots around center
    if (bloom > 0.4) {
      ctx.fillStyle = '#FEF08A'
      const stamenCount = 10
      for (let s = 0; s < stamenCount; s++) {
        const sa = (s / stamenCount) * Math.PI * 2
        const sr = coreR * 0.75
        ctx.beginPath()
        ctx.arc(Math.cos(sa) * sr, Math.sin(sa) * sr, 1.2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    ctx.restore()
  }

  /**
   * Delicate dew drop glints on flower petals
   */
  private renderDewHighlight(ctx: CanvasRenderingContext2D, bloom: number) {
    ctx.save()
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
    ctx.shadowColor = '#FFFFFF'
    ctx.shadowBlur = 5

    const dropPositions = [
      { x: -18, y: -25, r: 2.2 },
      { x: 22, y: -15, r: 1.8 },
      { x: -10, y: 15, r: 1.5 },
    ]

    for (const drop of dropPositions) {
      ctx.beginPath()
      ctx.arc(drop.x * bloom, drop.y * bloom, drop.r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }

  /**
   * Atmospheric Drifting Fireflies reacting smoothly to treble energy
   */
  private renderFireflies(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: MusicGrownGardenConfig,
    scene: GardenSceneMetadata,
    currentTime: number
  ) {
    const count = Math.min(this.fireflies.length, config.atmosphere.fireflyCount)
    const baseSize = config.atmosphere.fireflySize
    const trebleReact =
      (config.audioMapping.trebleToFireflies / 100) * this.smoothedTreble * 1.5
    const theme = scene.fallbackTheme

    ctx.save()

    for (let i = 0; i < count; i++) {
      const fly = this.fireflies[i]

      // Organic orbit movement
      const curX =
        (fly.baseX + Math.sin(currentTime * fly.speedX + fly.phase) * fly.orbitRadiusX) * width
      const curY =
        (fly.baseY + Math.cos(currentTime * fly.speedY + fly.phase) * fly.orbitRadiusY) * height

      // Natural luminous pulsation modulated by treble
      const naturalPulse = Math.pow(Math.sin(currentTime * fly.freq + fly.phase), 2)
      const alpha = Math.min(1.0, naturalPulse * 0.7 + trebleReact * 0.45)
      const size = baseSize * fly.size * (0.8 + trebleReact * 0.5)

      if (alpha > 0.05) {
        // Outer soft halo
        const halo = ctx.createRadialGradient(curX, curY, 0, curX, curY, size * 4)
        halo.addColorStop(0, theme.fireflyColor)
        halo.addColorStop(0.3, theme.fireflyColor)
        halo.addColorStop(1, 'transparent')

        ctx.fillStyle = halo
        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.arc(curX, curY, size * 4, 0, Math.PI * 2)
        ctx.fill()

        // Bright white-hot center core
        ctx.fillStyle = '#FFFFFF'
        ctx.globalAlpha = Math.min(1.0, alpha * 1.3)
        ctx.beginPath()
        ctx.arc(curX, curY, size * 0.6, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    ctx.restore()
  }

  /**
   * Floating Pollen Spores with gentle buoyant drift and wind orientation
   */
  private renderPollen(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: MusicGrownGardenConfig,
    scene: GardenSceneMetadata,
    currentTime: number
  ) {
    const density = Math.min(this.pollen.length, config.atmosphere.pollenDensity)
    const windRad = (config.atmosphere.windDirectionDeg * Math.PI) / 180
    const windSpeed = config.atmosphere.windSpeed * 0.0008
    const windX = Math.sin(windRad) * windSpeed
    const windY = -Math.cos(windRad) * windSpeed

    const sparkle =
      (config.audioMapping.trebleToPollenSparkle / 100) * this.smoothedTreble * 0.8
    const theme = scene.fallbackTheme

    ctx.save()

    for (let i = 0; i < density; i++) {
      const p = this.pollen[i]

      // Wind drift accumulation
      p.x += p.speedX + windX
      p.y += p.speedY + windY

      // Screen wrapping
      if (p.y < -0.05) {
        p.y = 1.05
        p.x = Math.random()
      }
      if (p.x < -0.05) p.x = 1.05
      if (p.x > 1.05) p.x = -0.05

      const px = p.x * width
      const py = p.y * height
      const shimmer = Math.sin(currentTime * 4 + p.phase) * 0.3 + 0.7
      const alpha = Math.min(1.0, p.alpha * shimmer + sparkle * 0.4)

      ctx.fillStyle = theme.pollenColor
      ctx.globalAlpha = alpha
      ctx.beginPath()
      ctx.arc(px, py, p.size * config.atmosphere.pollenSize * 0.6, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }

  /**
   * Multi-Layered Atmospheric Drifting Mist
   */
  private renderMist(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: MusicGrownGardenConfig,
    scene: GardenSceneMetadata,
    currentTime: number
  ) {
    const density = (config.atmosphere.mistDensity / 100) * 0.35
    const theme = scene.fallbackTheme

    ctx.save()
    ctx.fillStyle = theme.mistColor
    ctx.globalAlpha = density

    // Lower mist band
    const wave1 = Math.sin(currentTime * 0.25) * 25
    ctx.beginPath()
    ctx.moveTo(0, height * 0.78 + wave1)
    ctx.bezierCurveTo(width * 0.35, height * 0.72, width * 0.65, height * 0.84, width, height * 0.76 + wave1)
    ctx.lineTo(width, height)
    ctx.lineTo(0, height)
    ctx.closePath()
    ctx.fill()

    // Upper delicate mist band
    const wave2 = Math.cos(currentTime * 0.18) * 20
    ctx.globalAlpha = density * 0.65
    ctx.beginPath()
    ctx.moveTo(0, height * 0.55 + wave2)
    ctx.bezierCurveTo(width * 0.4, height * 0.50, width * 0.7, height * 0.60, width, height * 0.52 + wave2)
    ctx.lineTo(width, height * 0.8)
    ctx.lineTo(0, height * 0.8)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
  }

  /**
   * Cinematic Volumetric God-Rays
   */
  private renderLightRays(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: MusicGrownGardenConfig,
    scene: GardenSceneMetadata,
    currentTime: number
  ) {
    const intensity = (config.atmosphere.lightRayIntensity / 100) * 0.3
    const energyMod = (config.audioMapping.energyToAmbientLighting / 100) * this.smoothedEnergy * 0.2
    const totalAlpha = Math.min(0.6, intensity + energyMod)
    const theme = scene.fallbackTheme

    ctx.save()
    ctx.globalAlpha = totalAlpha

    const rayAngleRad = (config.atmosphere.windDirectionDeg * Math.PI) / 180
    const rayCenterOffset = Math.sin(currentTime * 0.15) * 40

    const grad = ctx.createLinearGradient(
      width * 0.3 + rayCenterOffset,
      0,
      width * 0.7 + Math.sin(rayAngleRad) * 200,
      height
    )
    grad.addColorStop(0, theme.lightRayColor)
    grad.addColorStop(0.4, 'transparent')
    grad.addColorStop(0.7, theme.lightRayColor)
    grad.addColorStop(1, 'transparent')

    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)

    ctx.restore()
  }

  /**
   * Helper for aspect-ratio preserved image drawing
   */
  private drawImageAspect(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    width: number,
    height: number,
    fit: 'cover' | 'contain' | '100%'
  ) {
    if (fit === '100%') {
      ctx.drawImage(img, 0, 0, width, height)
      return
    }

    const imgAspect = img.naturalWidth / img.naturalHeight
    const canvasAspect = width / height

    let dw = width
    let dh = height
    let dx = 0
    let dy = 0

    if (fit === 'contain') {
      if (imgAspect > canvasAspect) {
        dh = width / imgAspect
        dy = (height - dh) / 2
      } else {
        dw = height * imgAspect
        dx = (width - dw) / 2
      }
    } else {
      // Cover
      if (imgAspect > canvasAspect) {
        dw = height * imgAspect
        dx = (width - dw) / 2
      } else {
        dh = width / imgAspect
        dy = (height - dh) / 2
      }
    }

    ctx.drawImage(img, dx, dy, dw, dh)
  }
}

export const musicGrownGardenEngine = new MusicGrownGardenEngine()
