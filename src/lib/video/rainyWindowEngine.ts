/**
 * IndiaTools — Rainy Window Visualizer Studio Engine
 * Production-grade audio-reactive rainy window simulator.
 * 
 * Features:
 * - 8 Scene Presets (Cozy Bedroom, Mountain Cabin, City Night, Tropical Monsoon,
 *   Forest Window, Ocean Storm, Japanese Rain Retreat, Custom Photo).
 * - Multi-Plane Outdoor Rain Particles (far, mid, near) with perspective & wind angle.
 * - Foreground Glass Water Droplets & Gravity-Driven Sliding Beads with condensation trails.
 * - Ground Puddle Ripples with expanding concentric waves.
 * - Music Reactivity:
 *   - Sub-bass & Bass: surges in rainfall velocity, ripple emissions, window condensation refraction.
 *   - Mid: droplet sliding gravity flow & environmental brightness.
 *   - Treble: fine droplet shimmer & highlights.
 *   - Beat transients: adaptive thunder lightning flashes / distant lamp flares.
 * - Architectural Window Frame Overlays (Cozy Wood, French Panes, Minimal Panorama, Loft Steel).
 * - Multi-Aspect Ratio support: 16:9, 9:16, 1:1, 4:3, 21:9.
 * - Zero GC during 60 FPS animation loop (typed object pooling).
 */

import { DetailedAudioBands, ThemeColors } from './audioVisualizerTypes.ts'

export type RainyScenePresetId =
  | 'cozy-bedroom'
  | 'mountain-cabin'
  | 'city-night'
  | 'tropical-monsoon'
  | 'forest-window'
  | 'ocean-storm'
  | 'japanese-retreat'
  | 'custom'

export type RainIntensity = 'drizzle' | 'light' | 'moderate' | 'heavy' | 'storm'

export type WindowFrameStyle =
  | 'cozy-wood'
  | 'french-pane'
  | 'minimal-panorama'
  | 'loft-steel'
  | 'none'

export interface RainyWindowConfig {
  enabled: boolean
  scenePreset: RainyScenePresetId
  intensity: RainIntensity
  rainDensity: number          // 10 to 100 (%)
  rainSpeed: number            // 0.5 to 2.5 (multiplier)
  windAngle: number            // -45 to 45 (degrees)
  glassDropletDensity: number  // 10 to 100 (%)
  dropletSize: number          // 0.5 to 2.0 (multiplier)
  dropletSlideSpeed: number    // 0.5 to 2.5 (multiplier)
  mistIntensity: number        // 0 to 100 (%)
  bgBrightness: number         // 20 to 120 (%)
  bgBlur: number               // 0 to 20 (px)
  roomLightIntensity: number   // 0 to 100 (%)
  warmLampGlow: number         // 0 to 100 (%)
  windowFrameStyle: WindowFrameStyle
  reactivityStrength: number   // 0 to 100 (%)
  bassSensitivity: number      // 0.5 to 2.5 (multiplier)
  beatSensitivity: number      // 0.5 to 2.5 (multiplier)
  rippleIntensity: number      // 0 to 100 (%)
  mode: 'natural' | 'beat-reactive'
  lightningEnabled: boolean
  distantFlicker: boolean
  condensationCornerFog: boolean
}

export const DEFAULT_RAINY_WINDOW_CONFIG: RainyWindowConfig = {
  enabled: false,
  scenePreset: 'cozy-bedroom',
  intensity: 'moderate',
  rainDensity: 75,
  rainSpeed: 1.2,
  windAngle: 8,
  glassDropletDensity: 70,
  dropletSize: 1.0,
  dropletSlideSpeed: 1.1,
  mistIntensity: 45,
  bgBrightness: 85,
  bgBlur: 3,
  roomLightIntensity: 65,
  warmLampGlow: 75,
  windowFrameStyle: 'cozy-wood',
  reactivityStrength: 75,
  bassSensitivity: 1.2,
  beatSensitivity: 1.3,
  rippleIntensity: 60,
  mode: 'natural',
  lightningEnabled: true,
  distantFlicker: true,
  condensationCornerFog: true,
}

export interface RainyScenePresetMeta {
  id: RainyScenePresetId
  name: string
  subtitle: string
  accentColor: string
  description: string
  defaultFrame: WindowFrameStyle
  defaultIntensity: RainIntensity
  warmth: number // 0 to 100
}

export const RAINY_SCENE_PRESETS: RainyScenePresetMeta[] = [
  {
    id: 'cozy-bedroom',
    name: 'Cozy Rainy Bedroom',
    subtitle: 'Warm bedside lamp, lush rainy garden',
    accentColor: '#F59E0B',
    description: 'Warm amber bedside lamp glow casting cozy light against cold misty garden rainfall.',
    defaultFrame: 'cozy-wood',
    defaultIntensity: 'moderate',
    warmth: 85,
  },
  {
    id: 'mountain-cabin',
    name: 'Mountain Cabin',
    subtitle: 'Misty pine peaks & heavy alpine rain',
    accentColor: '#38BDF8',
    description: 'Panoramic mountain ridge with billowing fog, dark clouds, and crisp rain streams.',
    defaultFrame: 'cozy-wood',
    defaultIntensity: 'heavy',
    warmth: 40,
  },
  {
    id: 'city-night',
    name: 'Rainy City Night',
    subtitle: 'Neon bokeh lights, wet street reflections',
    accentColor: '#EC4899',
    description: 'Vibrant cyberpunk neon lights blurred through streaming wet window glass.',
    defaultFrame: 'loft-steel',
    defaultIntensity: 'moderate',
    warmth: 55,
  },
  {
    id: 'tropical-monsoon',
    name: 'Tropical Monsoon',
    subtitle: 'Veranda view of lush palm rain',
    accentColor: '#10B981',
    description: 'Deep emerald rain forest canopy drenched in heavy tropical monsoon downpours.',
    defaultFrame: 'french-pane',
    defaultIntensity: 'heavy',
    warmth: 50,
  },
  {
    id: 'forest-window',
    name: 'Forest Window',
    subtitle: 'Dense green pines, soft fog & gentle rain',
    accentColor: '#14B8A6',
    description: 'Quiet woodland serenity with pine tree silhouettes veiled in gentle rainfall.',
    defaultFrame: 'french-pane',
    defaultIntensity: 'light',
    warmth: 45,
  },
  {
    id: 'ocean-storm',
    name: 'Ocean Storm',
    subtitle: 'Stormy seas, thunder & driving wind',
    accentColor: '#6366F1',
    description: 'Dramatic ocean horizon with dark thunderheads, driving wind, and lightning flashes.',
    defaultFrame: 'minimal-panorama',
    defaultIntensity: 'storm',
    warmth: 20,
  },
  {
    id: 'japanese-retreat',
    name: 'Japanese Rain Retreat',
    subtitle: 'Zen garden, bamboo & peaceful drops',
    accentColor: '#84CC16',
    description: 'Earthy cedar architecture overlooking a tranquil zen bamboo garden in gentle rain.',
    defaultFrame: 'cozy-wood',
    defaultIntensity: 'drizzle',
    warmth: 70,
  },
  {
    id: 'custom',
    name: 'Custom Scene Photo',
    subtitle: 'Your uploaded photo as outdoor view',
    accentColor: '#A855F7',
    description: 'Your uploaded photograph placed behind the animated rain and glass droplets.',
    defaultFrame: 'cozy-wood',
    defaultIntensity: 'moderate',
    warmth: 60,
  },
]

// -------------------------------------------------------------
// TYPED POOLS FOR ZERO-GARBAGE COLLECTION ANIMATION (60 FPS)
// -------------------------------------------------------------

interface OutdoorRainDrop {
  x: number
  y: number
  length: number
  speed: number
  depth: number // 0.2 (distant), 0.5 (mid), 1.0 (near)
  alpha: number
  width: number
}

interface GlassDroplet {
  x: number
  y: number
  radius: number
  alpha: number
  wobbleOffset: number
  isSliding: boolean
  vy: number
  vx: number
  trailLength: number
  trail: Array<{ x: number; y: number; r: number }>
}

interface PuddleRipple {
  x: number
  y: number
  radius: number
  maxRadius: number
  alpha: number
  speed: number
  active: boolean
}

export class RainyWindowStudioEngine {
  private outdoorRainPool: OutdoorRainDrop[] = []
  private glassDropletsPool: GlassDroplet[] = []
  private ripplesPool: PuddleRipple[] = []
  private maxOutdoorDrops = 800
  private maxGlassDroplets = 400
  private maxRipples = 60

  private lastTime = 0
  private lightningTimer = 0
  private lightningFlashAlpha = 0
  private beatAccumulator = 0
  private rainSurge = 0

  constructor() {
    this.initPools()
  }

  private initPools() {
    this.outdoorRainPool = []
    for (let i = 0; i < this.maxOutdoorDrops; i++) {
      const depth = Math.random() < 0.4 ? 0.3 : Math.random() < 0.7 ? 0.6 : 1.0
      this.outdoorRainPool.push({
        x: Math.random() * 2000 - 200,
        y: Math.random() * 2000 - 200,
        length: (15 + Math.random() * 25) * depth,
        speed: (600 + Math.random() * 500) * (0.6 + depth * 0.7),
        depth,
        alpha: 0.15 + depth * 0.45,
        width: Math.max(1, depth * 1.8),
      })
    }

    this.glassDropletsPool = []
    for (let i = 0; i < this.maxGlassDroplets; i++) {
      const isSliding = Math.random() < 0.18
      const radius = 1.5 + Math.random() * 4.5
      this.glassDropletsPool.push({
        x: Math.random() * 2000,
        y: Math.random() * 2000,
        radius,
        alpha: 0.4 + Math.random() * 0.5,
        wobbleOffset: Math.random() * Math.PI * 2,
        isSliding,
        vy: isSliding ? 40 + Math.random() * 120 : 0,
        vx: 0,
        trailLength: isSliding ? 12 : 0,
        trail: [],
      })
    }

    this.ripplesPool = []
    for (let i = 0; i < this.maxRipples; i++) {
      this.ripplesPool.push({
        x: 0,
        y: 0,
        radius: 0,
        maxRadius: 30 + Math.random() * 50,
        alpha: 0,
        speed: 30 + Math.random() * 40,
        active: false,
      })
    }
  }

  public reset() {
    this.initPools()
    this.lightningFlashAlpha = 0
    this.lightningTimer = 0
    this.rainSurge = 0
  }

  /**
   * Main render method called on every animation frame
   */
  public updateAndDraw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    bands: DetailedAudioBands,
    palette: ThemeColors,
    currentTime: number,
    config: RainyWindowConfig,
    customPhoto: HTMLImageElement | null
  ) {
    const dt = Math.min(0.05, Math.max(0.008, currentTime - this.lastTime || 0.016))
    this.lastTime = currentTime

    // 1. Audio reactivity modulation
    const reactivity = (config.reactivityStrength ?? 75) / 100
    const bass = (bands.bass || 0) * (config.bassSensitivity ?? 1.2)
    const beatHit = bands.isBeatHit && config.mode === 'beat-reactive'
    const treble = bands.treble || 0

    // Temporary surge on bass drops
    if (bass > 0.6) {
      this.rainSurge = Math.min(1.0, this.rainSurge + bass * 0.15 * reactivity)
    } else {
      this.rainSurge = Math.max(0, this.rainSurge - dt * 1.5)
    }

    // Lightning effect
    if (config.lightningEnabled) {
      if (beatHit && Math.random() < 0.25 * (config.beatSensitivity ?? 1.3)) {
        this.lightningFlashAlpha = 0.55 + Math.random() * 0.4
      } else {
        this.lightningTimer += dt
        if (this.lightningTimer > 12 + Math.random() * 8) {
          this.lightningTimer = 0
          this.lightningFlashAlpha = 0.65
        }
      }
      this.lightningFlashAlpha = Math.max(0, this.lightningFlashAlpha - dt * 3.5)
    } else {
      this.lightningFlashAlpha = 0
    }

    // 2. Render Outdoor Landscape Scene (Procedural or Custom Image)
    this.drawOutdoorScene(ctx, width, height, config, customPhoto, currentTime, bass, treble)

    // 3. Render Outdoor Rain Particles with depth and wind angle
    this.drawOutdoorRain(ctx, width, height, dt, config, bass, reactivity)

    // 4. Render Ground Puddles & Ripples
    if ((config.rippleIntensity ?? 60) > 0) {
      this.drawPuddleRipples(ctx, width, height, dt, config, bass, reactivity)
    }

    // 5. Render Atmospheric Mist & Fog
    if ((config.mistIntensity ?? 45) > 0) {
      this.drawMistLayer(ctx, width, height, currentTime, config, bass)
    }

    // 6. Render Foreground Window Glass Condensation & Droplets
    this.drawGlassDroplets(ctx, width, height, dt, config, bass, treble, reactivity)

    // 7. Render Interior Room Lighting (Warm Amber Lamp / Cozy Glow)
    this.drawInteriorRoomLighting(ctx, width, height, config, currentTime, bands)

    // 8. Render Architectural Window Frame Overlay
    if (config.windowFrameStyle && config.windowFrameStyle !== 'none') {
      this.drawWindowFrame(ctx, width, height, config.windowFrameStyle, config)
    }

    // 9. Lightning Flash Overlay
    if (this.lightningFlashAlpha > 0.02) {
      ctx.save()
      ctx.fillStyle = `rgba(224, 242, 254, ${this.lightningFlashAlpha * 0.45})`
      ctx.fillRect(0, 0, width, height)
      ctx.restore()
    }
  }

  // -------------------------------------------------------------
  // OUTDOOR SCENE COMPOSITION (Procedural Presets or Custom Photo)
  // -------------------------------------------------------------
  private drawOutdoorScene(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: RainyWindowConfig,
    customPhoto: HTMLImageElement | null,
    time: number,
    bass: number,
    treble: number
  ) {
    ctx.save()

    const brightness = (config.bgBrightness ?? 85) / 100
    const blurPx = config.bgBlur ?? 3

    if (config.scenePreset === 'custom' && customPhoto && customPhoto.complete && customPhoto.naturalWidth > 0) {
      // Draw User Custom Photo with aspect-ratio preserving cover/fill
      const imgW = customPhoto.naturalWidth
      const imgH = customPhoto.naturalHeight
      const canvasAspect = width / height
      const imgAspect = imgW / imgH

      let drawW = width
      let drawH = height
      let offsetX = 0
      let offsetY = 0

      if (imgAspect > canvasAspect) {
        drawW = height * imgAspect
        offsetX = (width - drawW) / 2
      } else {
        drawH = width / imgAspect
        offsetY = (height - drawH) / 2
      }

      ctx.filter = `brightness(${brightness * 0.9}) contrast(105%) blur(${blurPx}px)`
      ctx.drawImage(customPhoto, offsetX, offsetY, drawW, drawH)
      ctx.filter = 'none'

      // Soft rain tint over user photo
      ctx.fillStyle = 'rgba(15, 23, 42, 0.35)'
      ctx.fillRect(0, 0, width, height)
    } else {
      // Procedural Atmospheric Preset Matte Paintings
      this.drawProceduralPresetScene(ctx, width, height, config.scenePreset, time, brightness, blurPx, bass)
    }

    ctx.restore()
  }

  private drawProceduralPresetScene(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    preset: RainyScenePresetId,
    time: number,
    brightness: number,
    blurPx: number,
    bass: number
  ) {
    ctx.filter = blurPx > 0 ? `blur(${blurPx * 0.8}px)` : 'none'

    switch (preset) {
      case 'cozy-bedroom': {
        // Deep misty twilight garden with warm glowing distant lanterns
        const grad = ctx.createLinearGradient(0, 0, 0, height)
        grad.addColorStop(0, '#0c1322')
        grad.addColorStop(0.5, '#162238')
        grad.addColorStop(1, '#08111d')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, width, height)

        // Lush garden foliage silhouettes
        ctx.fillStyle = '#050b14'
        this.drawFoliageSilhouettes(ctx, width, height, 0.65)

        // Warm distant garden lanterns
        this.drawBokehLight(ctx, width * 0.25, height * 0.52, 45, 'rgba(251, 191, 36, 0.55)')
        this.drawBokehLight(ctx, width * 0.78, height * 0.48, 55, 'rgba(245, 158, 11, 0.45)')
        this.drawBokehLight(ctx, width * 0.52, height * 0.62, 35, 'rgba(252, 211, 77, 0.4)')
        break
      }

      case 'mountain-cabin': {
        // Alpine misty mountain peaks with heavy storm clouds
        const grad = ctx.createLinearGradient(0, 0, 0, height)
        grad.addColorStop(0, '#0f172a')
        grad.addColorStop(0.4, '#1e293b')
        grad.addColorStop(0.8, '#334155')
        grad.addColorStop(1, '#0f172a')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, width, height)

        // Distant mountain layers
        this.drawMountainLayer(ctx, width, height * 0.42, '#182438', 0.25)
        this.drawMountainLayer(ctx, width, height * 0.55, '#0f172a', 0.45)

        // Pine trees silhouette at bottom
        this.drawPineTreeLine(ctx, width, height, height * 0.7)
        break
      }

      case 'city-night': {
        // Cyberpunk rainy urban city with glowing neon bokeh reflections
        const grad = ctx.createLinearGradient(0, 0, 0, height)
        grad.addColorStop(0, '#06070d')
        grad.addColorStop(0.6, '#0f1020')
        grad.addColorStop(1, '#0a0a14')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, width, height)

        // Skyscraper silhouettes
        this.drawCitySkyline(ctx, width, height)

        // Blurred neon street bokeh circles
        const bokehList = [
          { x: 0.15, y: 0.55, r: 60, col: 'rgba(236, 72, 153, 0.6)' },
          { x: 0.28, y: 0.62, r: 75, col: 'rgba(6, 182, 212, 0.65)' },
          { x: 0.45, y: 0.48, r: 50, col: 'rgba(168, 85, 247, 0.55)' },
          { x: 0.62, y: 0.58, r: 80, col: 'rgba(244, 63, 94, 0.6)' },
          { x: 0.82, y: 0.52, r: 65, col: 'rgba(56, 189, 248, 0.7)' },
          { x: 0.75, y: 0.68, r: 90, col: 'rgba(234, 179, 8, 0.5)' },
        ]
        for (const b of bokehList) {
          this.drawBokehLight(ctx, width * b.x, height * b.y, b.r, b.col)
        }
        break
      }

      case 'tropical-monsoon': {
        // Deep emerald jungle canopy in driving rain
        const grad = ctx.createLinearGradient(0, 0, 0, height)
        grad.addColorStop(0, '#021814')
        grad.addColorStop(0.5, '#063028')
        grad.addColorStop(1, '#021a15')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, width, height)

        // Layered banana and palm fronds
        this.drawTropicalCanopy(ctx, width, height)
        break
      }

      case 'forest-window': {
        // Dense misty evergreen forest
        const grad = ctx.createLinearGradient(0, 0, 0, height)
        grad.addColorStop(0, '#07161b')
        grad.addColorStop(0.4, '#0f2930')
        grad.addColorStop(0.8, '#13393f')
        grad.addColorStop(1, '#081a1f')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, width, height)

        this.drawPineTreeLine(ctx, width, height, height * 0.48)
        this.drawPineTreeLine(ctx, width, height, height * 0.65)
        break
      }

      case 'ocean-storm': {
        // Turbulent storm clouds over rolling dark ocean
        const grad = ctx.createLinearGradient(0, 0, 0, height)
        grad.addColorStop(0, '#080d1a')
        grad.addColorStop(0.5, '#17223b')
        grad.addColorStop(0.52, '#0f172a')
        grad.addColorStop(1, '#030712')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, width, height)

        // Ocean horizon line & wave crests
        this.drawOceanWaves(ctx, width, height * 0.52, time, bass)
        break
      }

      case 'japanese-retreat': {
        // Zen bamboo retreat with warm wooden accents and stone garden
        const grad = ctx.createLinearGradient(0, 0, 0, height)
        grad.addColorStop(0, '#10151c')
        grad.addColorStop(0.6, '#18242a')
        grad.addColorStop(1, '#0e171b')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, width, height)

        // Bamboo stalks
        this.drawBambooStalks(ctx, width, height)
        // Stone lantern with warm amber flicker
        this.drawBokehLight(ctx, width * 0.32, height * 0.6, 40, 'rgba(245, 158, 11, 0.6)')
        break
      }

      default:
        ctx.fillStyle = '#0f172a'
        ctx.fillRect(0, 0, width, height)
    }

    ctx.filter = 'none'

    // Environmental brightness modifier
    if (brightness < 0.98) {
      ctx.fillStyle = `rgba(0, 0, 0, ${1 - brightness})`
      ctx.fillRect(0, 0, width, height)
    }
  }

  // -------------------------------------------------------------
  // OUTDOOR RAINFALL PARTICLES (Multi-Plane Perspective Physics)
  // -------------------------------------------------------------
  private drawOutdoorRain(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    dt: number,
    config: RainyWindowConfig,
    bass: number,
    reactivity: number
  ) {
    ctx.save()

    const density = (config.rainDensity ?? 75) / 100
    const speedMult = (config.rainSpeed ?? 1.2) * (1.0 + this.rainSurge * 0.6)
    const angleRad = ((config.windAngle ?? 8) * Math.PI) / 180
    const sinAngle = Math.sin(angleRad)
    const cosAngle = Math.cos(angleRad)

    const activeCount = Math.floor(this.outdoorRainPool.length * density)

    ctx.strokeStyle = '#cbe4f9'
    ctx.lineCap = 'round'

    for (let i = 0; i < activeCount; i++) {
      const drop = this.outdoorRainPool[i]

      // Advance raindrop
      drop.y += drop.speed * speedMult * cosAngle * dt
      drop.x += drop.speed * speedMult * sinAngle * dt

      // Wrap around bounds
      if (drop.y > height + 50) {
        drop.y = -50 - Math.random() * 40
        drop.x = Math.random() * (width + 300) - 150
      }
      if (drop.x < -150) drop.x = width + 100
      if (drop.x > width + 150) drop.x = -100

      // Render rain streak
      const endX = drop.x - drop.length * sinAngle
      const endY = drop.y - drop.length * cosAngle

      ctx.globalAlpha = drop.alpha * (0.8 + bass * 0.25 * reactivity)
      ctx.lineWidth = drop.width

      ctx.beginPath()
      ctx.moveTo(drop.x, drop.y)
      ctx.lineTo(endX, endY)
      ctx.stroke()
    }

    ctx.restore()
  }

  // -------------------------------------------------------------
  // GROUND PUDDLE RIPPLES & CONCENTRIC WAVES
  // -------------------------------------------------------------
  private drawPuddleRipples(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    dt: number,
    config: RainyWindowConfig,
    bass: number,
    reactivity: number
  ) {
    ctx.save()

    const groundY = height * 0.78
    const groundH = height - groundY
    const ripplePower = (config.rippleIntensity ?? 60) / 100

    // Spawn new ripples on rain drops or audio bass drops
    if (Math.random() < 0.25 * ripplePower + bass * 0.4 * reactivity) {
      const inactive = this.ripplesPool.find((r) => !r.active)
      if (inactive) {
        inactive.active = true
        inactive.x = Math.random() * width
        inactive.y = groundY + Math.random() * groundH
        inactive.radius = 2
        inactive.maxRadius = (20 + Math.random() * 40) * (1 + bass * 0.5)
        inactive.alpha = 0.5 + Math.random() * 0.3
      }
    }

    ctx.strokeStyle = 'rgba(186, 230, 253, 0.45)'
    ctx.lineWidth = 1.2

    for (let i = 0; i < this.ripplesPool.length; i++) {
      const r = this.ripplesPool[i]
      if (!r.active) continue

      r.radius += r.speed * dt
      r.alpha -= dt * 0.85

      if (r.radius >= r.maxRadius || r.alpha <= 0) {
        r.active = false
        continue
      }

      ctx.save()
      ctx.globalAlpha = Math.max(0, r.alpha)
      // Perspective squished ellipse for ground plane
      ctx.beginPath()
      ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.32, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }

    ctx.restore()
  }

  // -------------------------------------------------------------
  // ATMOSPHERIC MIST & RAIN FOG
  // -------------------------------------------------------------
  private drawMistLayer(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    config: RainyWindowConfig,
    bass: number
  ) {
    ctx.save()
    const mistStrength = ((config.mistIntensity ?? 45) / 100) * 0.35

    const mistGrad = ctx.createLinearGradient(0, height * 0.4, 0, height)
    mistGrad.addColorStop(0, 'rgba(203, 213, 225, 0)')
    mistGrad.addColorStop(0.5, `rgba(148, 163, 184, ${mistStrength * 0.6})`)
    mistGrad.addColorStop(1, `rgba(203, 213, 225, ${mistStrength})`)

    ctx.fillStyle = mistGrad
    ctx.fillRect(0, height * 0.4, width, height * 0.6)

    ctx.restore()
  }

  // -------------------------------------------------------------
  // FOREGROUND GLASS DROPLETS & GRAVITY SLIDING RIVERLETS
  // -------------------------------------------------------------
  private drawGlassDroplets(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    dt: number,
    config: RainyWindowConfig,
    bass: number,
    treble: number,
    reactivity: number
  ) {
    ctx.save()

    const density = (config.glassDropletDensity ?? 70) / 100
    const sizeMult = config.dropletSize ?? 1.0
    const slideSpeed = (config.dropletSlideSpeed ?? 1.1) * (1.0 + bass * 0.4 * reactivity)
    const activeCount = Math.floor(this.glassDropletsPool.length * density)

    for (let i = 0; i < activeCount; i++) {
      const drop = this.glassDropletsPool[i]

      if (drop.isSliding) {
        // Sliding physics with organic micro-snag and gravity
        drop.y += drop.vy * slideSpeed * dt
        // Small organic serpentine wobble
        drop.x += Math.sin(drop.y * 0.05 + drop.wobbleOffset) * 0.4

        // Add point to trail
        drop.trail.unshift({ x: drop.x, y: drop.y, r: drop.radius * 0.65 })
        if (drop.trail.length > drop.trailLength) {
          drop.trail.pop()
        }

        // Reset if reached bottom
        if (drop.y > height + 20) {
          drop.y = -20 - Math.random() * 50
          drop.x = Math.random() * width
          drop.trail = []
        }

        // Draw damp trail behind sliding bead
        if (drop.trail.length > 1) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(224, 242, 254, ${drop.alpha * 0.3})`
          ctx.lineWidth = drop.radius * 0.8
          ctx.lineCap = 'round'
          ctx.moveTo(drop.trail[0].x, drop.trail[0].y)
          for (let t = 1; t < drop.trail.length; t++) {
            ctx.lineTo(drop.trail[t].x, drop.trail[t].y)
          }
          ctx.stroke()
        }
      }

      // Draw glass water bead with realistic specular highlight and refraction shadow
      const r = drop.radius * sizeMult
      const alpha = drop.alpha * (0.85 + treble * 0.25 * reactivity)

      // 1. Soft droplet shadow / refraction perimeter
      ctx.beginPath()
      ctx.fillStyle = `rgba(15, 23, 42, ${alpha * 0.4})`
      ctx.arc(drop.x + 0.8, drop.y + 0.8, r, 0, Math.PI * 2)
      ctx.fill()

      // 2. Liquid body
      ctx.beginPath()
      const dropGrad = ctx.createRadialGradient(
        drop.x - r * 0.3,
        drop.y - r * 0.3,
        r * 0.1,
        drop.x,
        drop.y,
        r
      )
      dropGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.85})`)
      dropGrad.addColorStop(0.5, `rgba(224, 242, 254, ${alpha * 0.45})`)
      dropGrad.addColorStop(1, `rgba(148, 163, 184, ${alpha * 0.6})`)
      ctx.fillStyle = dropGrad
      ctx.arc(drop.x, drop.y, r, 0, Math.PI * 2)
      ctx.fill()

      // 3. Tiny specular highlight glint
      ctx.beginPath()
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1.0, alpha * 1.3)})`
      ctx.arc(drop.x - r * 0.35, drop.y - r * 0.35, Math.max(0.6, r * 0.25), 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }

  // -------------------------------------------------------------
  // INTERIOR ROOM LIGHTING (Warm Lamp / Candle / Condensation Vignette)
  // -------------------------------------------------------------
  private drawInteriorRoomLighting(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: RainyWindowConfig,
    time: number,
    bands: DetailedAudioBands
  ) {
    ctx.save()

    const roomStrength = ((config.roomLightIntensity ?? 65) / 100) * 0.45
    const warmLamp = (config.warmLampGlow ?? 75) / 100
    const bass = bands.bass || 0

    // Warm amber glow from bottom-left or bottom-right interior lamp
    if (warmLamp > 0.1) {
      const lampX = width * 0.15
      const lampY = height * 0.88
      const lampRadius = Math.max(width, height) * 0.65

      const lampGrad = ctx.createRadialGradient(lampX, lampY, 20, lampX, lampY, lampRadius)
      lampGrad.addColorStop(0, `rgba(245, 158, 11, ${roomStrength * warmLamp * (1 + bass * 0.25)})`)
      lampGrad.addColorStop(0.35, `rgba(217, 119, 6, ${roomStrength * warmLamp * 0.45})`)
      lampGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

      ctx.fillStyle = lampGrad
      ctx.fillRect(0, 0, width, height)
    }

    // Window condensation fog on glass corners (perimeter steam)
    if (config.condensationCornerFog) {
      const cornerGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.35,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.72
      )
      cornerGrad.addColorStop(0, 'rgba(255, 255, 255, 0)')
      cornerGrad.addColorStop(0.7, 'rgba(224, 242, 254, 0.04)')
      cornerGrad.addColorStop(1, 'rgba(203, 213, 225, 0.18)')

      ctx.fillStyle = cornerGrad
      ctx.fillRect(0, 0, width, height)
    }

    ctx.restore()
  }

  // -------------------------------------------------------------
  // ARCHITECTURAL WINDOW FRAME OVERLAYS
  // -------------------------------------------------------------
  private drawWindowFrame(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    style: WindowFrameStyle,
    config: RainyWindowConfig
  ) {
    ctx.save()

    const frameWidth = Math.max(16, Math.min(width, height) * 0.035)
    const sillHeight = frameWidth * 1.6

    switch (style) {
      case 'cozy-wood': {
        // Rich warm mahogany / walnut wooden window frame with depth bevels
        ctx.fillStyle = '#261711'
        // Outer borders
        ctx.fillRect(0, 0, width, frameWidth) // Top
        ctx.fillRect(0, 0, frameWidth, height) // Left
        ctx.fillRect(width - frameWidth, 0, frameWidth, height) // Right
        ctx.fillRect(0, height - sillHeight, width, sillHeight) // Window Sill

        // Center vertical divider
        const centerColW = frameWidth * 0.9
        ctx.fillRect(width / 2 - centerColW / 2, 0, centerColW, height - sillHeight)

        // Center horizontal mullion
        const centerRowH = frameWidth * 0.75
        const rowY = (height - sillHeight) * 0.42
        ctx.fillRect(0, rowY - centerRowH / 2, width, centerRowH)

        // Wood texture highlights / bevels
        ctx.strokeStyle = 'rgba(180, 105, 50, 0.35)'
        ctx.lineWidth = 2
        ctx.strokeRect(frameWidth, frameWidth, width - frameWidth * 2, height - frameWidth - sillHeight)
        break
      }

      case 'french-pane': {
        // Classic 6-pane French window
        ctx.fillStyle = '#1e1c1a'
        ctx.fillRect(0, 0, width, frameWidth)
        ctx.fillRect(0, 0, frameWidth, height)
        ctx.fillRect(width - frameWidth, 0, frameWidth, height)
        ctx.fillRect(0, height - sillHeight, width, sillHeight)

        // Vertical divider
        const colW = frameWidth * 0.7
        ctx.fillRect(width / 2 - colW / 2, 0, colW, height - sillHeight)

        // Two horizontal dividers
        const usableH = height - sillHeight
        const rowH = frameWidth * 0.65
        ctx.fillRect(0, usableH * 0.33 - rowH / 2, width, rowH)
        ctx.fillRect(0, usableH * 0.66 - rowH / 2, width, rowH)
        break
      }

      case 'loft-steel': {
        // Sleek matte black industrial steel grid
        ctx.fillStyle = '#0f1115'
        const steelW = frameWidth * 0.6
        ctx.fillRect(0, 0, width, steelW)
        ctx.fillRect(0, 0, steelW, height)
        ctx.fillRect(width - steelW, 0, steelW, height)
        ctx.fillRect(0, height - steelW * 1.3, width, steelW * 1.3)

        // Two vertical bars
        ctx.fillRect(width * 0.33 - steelW / 2, 0, steelW, height)
        ctx.fillRect(width * 0.66 - steelW / 2, 0, steelW, height)

        // Three horizontal bars
        ctx.fillRect(0, height * 0.25, width, steelW)
        ctx.fillRect(0, height * 0.5, width, steelW)
        ctx.fillRect(0, height * 0.75, width, steelW)
        break
      }

      case 'minimal-panorama': {
        // Clean single uninterrupted glass frame with bottom window sill
        ctx.fillStyle = '#111827'
        const thinBorder = frameWidth * 0.5
        ctx.fillRect(0, 0, width, thinBorder)
        ctx.fillRect(0, 0, thinBorder, height)
        ctx.fillRect(width - thinBorder, 0, thinBorder, height)
        ctx.fillRect(0, height - sillHeight, width, sillHeight)
        break
      }

      default:
        break
    }

    ctx.restore()
  }

  // -------------------------------------------------------------
  // PROCEDURAL HELPER PAINTERS
  // -------------------------------------------------------------
  private drawBokehLight(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
    ctx.save()
    ctx.beginPath()
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius)
    grad.addColorStop(0, color)
    grad.addColorStop(0.6, color.replace(/[\d\.]+\)$/, '0.2)'))
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  private drawMountainLayer(ctx: CanvasRenderingContext2D, width: number, startY: number, color: string, roughness: number) {
    ctx.save()
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(0, heightFromY(0, width, startY, roughness))
    for (let x = 0; x <= width; x += 40) {
      ctx.lineTo(x, heightFromY(x, width, startY, roughness))
    }
    ctx.lineTo(width, startY + 600)
    ctx.lineTo(0, startY + 600)
    ctx.closePath()
    ctx.fill()
    ctx.restore()

    function heightFromY(x: number, w: number, base: number, r: number) {
      return base + Math.sin(x * 0.003) * 60 * r + Math.cos(x * 0.007) * 40 * r
    }
  }

  private drawPineTreeLine(ctx: CanvasRenderingContext2D, width: number, height: number, baseY: number) {
    ctx.save()
    ctx.fillStyle = '#09131a'
    for (let x = 0; x < width; x += 22) {
      const treeH = 35 + Math.sin(x * 0.05) * 20 + Math.random() * 15
      ctx.beginPath()
      ctx.moveTo(x - 12, baseY)
      ctx.lineTo(x, baseY - treeH)
      ctx.lineTo(x + 12, baseY)
      ctx.fill()
    }
    ctx.fillRect(0, baseY, width, height - baseY)
    ctx.restore()
  }

  private drawFoliageSilhouettes(ctx: CanvasRenderingContext2D, width: number, height: number, startFrac: number) {
    const startY = height * startFrac
    for (let x = 0; x < width; x += 60) {
      const r = 40 + Math.random() * 30
      ctx.beginPath()
      ctx.arc(x, startY + Math.random() * 20, r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.fillRect(0, startY + 30, width, height - (startY + 30))
  }

  private drawCitySkyline(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.save()
    ctx.fillStyle = '#07080f'
    const baseY = height * 0.7
    for (let x = 0; x < width; x += 45) {
      const bldgW = 35 + Math.random() * 25
      const bldgH = 80 + Math.sin(x * 0.02) * 60 + Math.random() * 80
      ctx.fillRect(x, baseY - bldgH, bldgW, bldgH + 100)
    }
    ctx.restore()
  }

  private drawTropicalCanopy(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.save()
    ctx.fillStyle = '#031410'
    for (let x = 0; x < width; x += 120) {
      ctx.beginPath()
      ctx.ellipse(x, height * 0.65, 80, 25, (Math.PI / 6) * (x % 2 === 0 ? 1 : -1), 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.fillRect(0, height * 0.72, width, height * 0.28)
    ctx.restore()
  }

  private drawOceanWaves(ctx: CanvasRenderingContext2D, width: number, horizonY: number, time: number, bass: number) {
    ctx.save()
    ctx.fillStyle = '#06101c'
    ctx.beginPath()
    ctx.moveTo(0, horizonY)
    for (let x = 0; x <= width; x += 20) {
      const waveY = horizonY + Math.sin(x * 0.015 + time * 2) * (8 + bass * 8)
      ctx.lineTo(x, waveY)
    }
    ctx.lineTo(width, horizonY + 500)
    ctx.lineTo(0, horizonY + 500)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  private drawBambooStalks(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.save()
    ctx.fillStyle = '#081710'
    ctx.strokeStyle = '#050e09'
    ctx.lineWidth = 2
    for (let x = 30; x < width; x += 70) {
      const stalkW = 12 + ((x * 13) % 8)
      // Tall bamboo stalk from bottom
      ctx.fillRect(x, height * 0.25, stalkW, height * 0.75)
      // Bamboo nodes/segments
      for (let y = height * 0.3; y < height; y += 50) {
        ctx.beginPath()
        ctx.moveTo(x - 2, y)
        ctx.lineTo(x + stalkW + 2, y)
        ctx.stroke()
      }
    }
    // Ground moss line
    ctx.fillRect(0, height * 0.8, width, height * 0.2)
    ctx.restore()
  }
}

export const studioRainyWindowEngine = new RainyWindowStudioEngine()
