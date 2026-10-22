/**
 * IndiaTools — Floating Photo Universe 2.0
 * Procedural Deep Space Starfield, Glowing Nebula Galaxy & Custom Background Engine
 * High-performance Dual-Layer Architecture:
 * 1. 2D Canvas Celestial Compositor (Guaranteed 100% visibility, non-black gradients, glowing nebulae, parallax stars)
 * 2. Three.js Transparent Overlay (3D physical photo frames, cyan rims, depth particles)
 */

import * as THREE from 'three'
import {
  UniverseBackgroundConfig,
  UniverseCustomBackground,
} from './photoUniverseTypes.ts'
import { NormalizedAudioBands } from '../audioToVideo/types.ts'

interface CelestialStar {
  x: number // 0 to 1 normalized
  y: number // 0 to 1 normalized
  baseRadius: number // 0.6 to 3.2px
  depth: number // 0.1 to 1.0 (determines parallax factor)
  baseAlpha: number // 0.25 to 0.95
  color: string // color hex
  twinkleSpeed: number // 1.2 to 4.5
  phase: number // 0 to 2*PI
  hasHalo: boolean
  hasSpikes: boolean
}

interface NebulaCloudSpec {
  relX: number
  relY: number
  radiusRatio: number
  colorStop0: string
  colorStop1: string
  colorStop2: string
  parallaxFactor: number
  driftSpeedX: number
  driftSpeedY: number
  phaseOffset: number
}

export class UniverseBackgroundRenderer {
  private isClient: boolean
  private bgGroup: THREE.Group | null = null
  private starsMesh: THREE.Points | null = null
  private softStarsMesh: THREE.Points | null = null
  private customBgMesh: THREE.Mesh | null = null
  private customTexture: THREE.Texture | null = null
  private lastCustomUrl: string | null = null

  // 2D Canvas Starfield Cache
  private cachedStars: CelestialStar[] = []
  private customImageCache: Map<string, HTMLImageElement> = new Map()
  private customImageLoadFailed: Set<string> = new Set()

  constructor() {
    this.isClient = typeof window !== 'undefined'
    this.generateStarfieldPool(2600)
  }

  /**
   * Precompute deterministic celestial star distribution
   */
  private generateStarfieldPool(count: number): void {
    this.cachedStars = []
    // Deterministic pseudo-random generator (LCG)
    let seed = 42891
    const nextRand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296
      return seed / 4294967296
    }

    const starPalette = [
      '#ffffff', // Pure Diamond White
      '#bae6fd', // Pale Cyan
      '#e0e7ff', // Soft Indigo
      '#ddd6fe', // Lavender
      '#fef08a', // Warm Amber
      '#fbcfe8', // Pale Rose
    ]

    for (let i = 0; i < count; i++) {
      // Spread with overflow margin (-0.2 to 1.2) so stars don't pop during camera panning
      const x = -0.2 + nextRand() * 1.4
      const y = -0.2 + nextRand() * 1.4
      const depth = 0.15 + nextRand() * 0.85
      const isMajor = nextRand() < 0.04
      const isMedium = !isMajor && nextRand() < 0.22

      let baseRadius = 0.6 + nextRand() * 0.7
      let baseAlpha = 0.3 + nextRand() * 0.45
      let hasHalo = false
      let hasSpikes = false

      if (isMajor) {
        baseRadius = 2.0 + nextRand() * 1.2
        baseAlpha = 0.85 + nextRand() * 0.15
        hasHalo = true
        hasSpikes = nextRand() < 0.6
      } else if (isMedium) {
        baseRadius = 1.1 + nextRand() * 0.8
        baseAlpha = 0.55 + nextRand() * 0.35
        hasHalo = nextRand() < 0.2
      }

      const colorIdx = Math.floor(nextRand() * starPalette.length)
      const color = starPalette[colorIdx]

      this.cachedStars.push({
        x,
        y,
        baseRadius,
        depth,
        baseAlpha,
        color,
        twinkleSpeed: 1.2 + nextRand() * 3.2,
        phase: nextRand() * Math.PI * 2,
        hasHalo,
        hasSpikes,
      })
    }
  }

  /**
   * Render visually rich space environment directly to 2D canvas context.
   * Runs before 3D WebGL compositing. Guaranteed visible on every frame.
   */
  public renderToCanvas(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: UniverseBackgroundConfig,
    cameraX: number = 0,
    cameraY: number = 0,
    currentTime: number = 0,
    bands?: NormalizedAudioBands
  ): void {
    if (!ctx || width <= 0 || height <= 0) return

    const bgType = config.type || 'deep-space'

    // 1. Handle Custom User-Uploaded Background Image
    if (bgType === 'custom-image' && config.customImage?.url) {
      const renderedCustom = this.renderCustomImage(
        ctx,
        width,
        height,
        config.customImage,
        cameraX,
        cameraY
      )
      if (renderedCustom) return
      // If custom image failed or is still loading, smoothly fall through to default space galaxy!
    }

    // 2. Handle Solid Dark Minimalist Studio
    if (bgType === 'solid-dark') {
      const darkGrad = ctx.createLinearGradient(0, 0, 0, height)
      darkGrad.addColorStop(0, '#060812')
      darkGrad.addColorStop(1, '#090d1c')
      ctx.fillStyle = darkGrad
      ctx.fillRect(0, 0, width, height)
      return
    }

    // 3. Render Deep Navy and Purple Space Foundation Gradient (NOT PURE BLACK)
    ctx.save()
    const maxDim = Math.max(width, height)
    const centerX = width * 0.5 + cameraX * 0.02
    const centerY = height * 0.5 + cameraY * 0.02

    const spaceGradient = ctx.createRadialGradient(
      centerX - width * 0.08,
      centerY - height * 0.06,
      maxDim * 0.08,
      centerX,
      centerY,
      maxDim * 0.88
    )

    // Palette variants by galaxy tint
    const tint = config.galaxyTint || 'cosmic-blue'
    if (tint === 'mystic-violet') {
      spaceGradient.addColorStop(0.0, '#150d30') // Luminous cosmic purple core
      spaceGradient.addColorStop(0.35, '#1e1142') // Deep violet nebula space
      spaceGradient.addColorStop(0.7, '#0f0a24') // Indigo space void
      spaceGradient.addColorStop(1.0, '#050410') // Deep space boundary
    } else if (tint === 'amber-nebula') {
      spaceGradient.addColorStop(0.0, '#1f130a') // Warm amber celestial core
      spaceGradient.addColorStop(0.35, '#231224') // Golden twilight purple
      spaceGradient.addColorStop(0.7, '#110a1c') // Deep astral dusk
      spaceGradient.addColorStop(1.0, '#06030c') // Deep space boundary
    } else if (tint === 'emerald-deep') {
      spaceGradient.addColorStop(0.0, '#071b18') // Deep emerald core
      spaceGradient.addColorStop(0.35, '#0b162a') // Teal-navy twilight
      spaceGradient.addColorStop(0.7, '#070f1e') // Oceanic cosmic void
      spaceGradient.addColorStop(1.0, '#02060e') // Deep space boundary
    } else {
      // Default: Cosmic Blue & Royal Navy
      spaceGradient.addColorStop(0.0, '#0a1033') // Deep cosmic royal navy core
      spaceGradient.addColorStop(0.32, '#120f38') // Mystic indigo-purple
      spaceGradient.addColorStop(0.68, '#080c24') // Dark starry ocean
      spaceGradient.addColorStop(1.0, '#030511') // Deep space boundary
    }

    ctx.fillStyle = spaceGradient
    ctx.fillRect(0, 0, width, height)

    // 4. Render Soft Glowing Nebula Clouds & Cosmic Dust (Screen Blending)
    ctx.globalCompositeOperation = 'screen'
    this.renderNebulaClouds(ctx, width, height, config, cameraX, cameraY, currentTime, bands)

    // 5. Render Thousands of Stars at Varied Depths & Sizes
    ctx.globalCompositeOperation = 'source-over'
    this.renderStarfield(ctx, width, height, config, cameraX, cameraY, currentTime, bands)

    ctx.restore()
  }

  /**
   * Render luminous organic cosmic nebula gas clouds
   */
  private renderNebulaClouds(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: UniverseBackgroundConfig,
    cameraX: number,
    cameraY: number,
    currentTime: number,
    bands?: NormalizedAudioBands
  ): void {
    const tint = config.galaxyTint || 'cosmic-blue'
    const bgType = config.type || 'deep-space'
    const maxDim = Math.max(width, height)

    // Nebula intensity scaling
    const glowScale = Math.max(0.2, (config.nebulaGlow ?? 50) / 100)
    const typeScale = bgType === 'nebula-galaxy' ? 1.35 : bgType === 'minimal-starfield' ? 0.35 : 1.0
    const masterOpacity = glowScale * typeScale

    // Subtle bass pulse expansion
    const bassPulse = bands && bands.bass ? bands.bass * 0.08 : 0

    // Cloud specifications tailored to color theme
    let clouds: NebulaCloudSpec[] = []

    if (tint === 'mystic-violet') {
      clouds = [
        {
          relX: 0.32,
          relY: 0.28,
          radiusRatio: 0.55 + bassPulse,
          colorStop0: `rgba(217, 70, 239, ${0.28 * masterOpacity})`, // Electric magenta
          colorStop1: `rgba(147, 51, 234, ${0.16 * masterOpacity})`, // Deep purple
          colorStop2: 'rgba(15, 10, 36, 0)',
          parallaxFactor: 0.04,
          driftSpeedX: 0.02,
          driftSpeedY: 0.015,
          phaseOffset: 0,
        },
        {
          relX: 0.74,
          relY: 0.48,
          radiusRatio: 0.62 + bassPulse * 1.2,
          colorStop0: `rgba(168, 85, 247, ${0.24 * masterOpacity})`, // Violet glow
          colorStop1: `rgba(59, 130, 246, ${0.14 * masterOpacity})`, // Blue fringe
          colorStop2: 'rgba(10, 10, 30, 0)',
          parallaxFactor: 0.06,
          driftSpeedX: -0.018,
          driftSpeedY: 0.025,
          phaseOffset: 1.8,
        },
        {
          relX: 0.48,
          relY: 0.72,
          radiusRatio: 0.7 + bassPulse,
          colorStop0: `rgba(99, 102, 241, ${0.22 * masterOpacity})`, // Indigo spine
          colorStop1: `rgba(236, 72, 153, ${0.12 * masterOpacity})`, // Pink accent
          colorStop2: 'rgba(6, 6, 20, 0)',
          parallaxFactor: 0.03,
          driftSpeedX: 0.015,
          driftSpeedY: -0.02,
          phaseOffset: 3.2,
        },
      ]
    } else if (tint === 'amber-nebula') {
      clouds = [
        {
          relX: 0.38,
          relY: 0.32,
          radiusRatio: 0.58 + bassPulse,
          colorStop0: `rgba(245, 158, 11, ${0.26 * masterOpacity})`, // Amber solar gold
          colorStop1: `rgba(220, 38, 38, ${0.14 * masterOpacity})`, // Crimson accent
          colorStop2: 'rgba(20, 10, 10, 0)',
          parallaxFactor: 0.045,
          driftSpeedX: 0.02,
          driftSpeedY: 0.015,
          phaseOffset: 0,
        },
        {
          relX: 0.72,
          relY: 0.55,
          radiusRatio: 0.65 + bassPulse * 1.2,
          colorStop0: `rgba(217, 119, 6, ${0.22 * masterOpacity})`, // Golden dust
          colorStop1: `rgba(168, 85, 247, ${0.12 * masterOpacity})`, // Violet rim
          colorStop2: 'rgba(15, 8, 15, 0)',
          parallaxFactor: 0.06,
          driftSpeedX: -0.02,
          driftSpeedY: 0.02,
          phaseOffset: 2.1,
        },
      ]
    } else if (tint === 'emerald-deep') {
      clouds = [
        {
          relX: 0.35,
          relY: 0.35,
          radiusRatio: 0.6 + bassPulse,
          colorStop0: `rgba(16, 185, 129, ${0.25 * masterOpacity})`, // Aurora emerald
          colorStop1: `rgba(14, 165, 233, ${0.15 * masterOpacity})`, // Cyan fringe
          colorStop2: 'rgba(5, 15, 20, 0)',
          parallaxFactor: 0.04,
          driftSpeedX: 0.018,
          driftSpeedY: 0.012,
          phaseOffset: 0,
        },
        {
          relX: 0.7,
          relY: 0.6,
          radiusRatio: 0.68 + bassPulse * 1.2,
          colorStop0: `rgba(20, 184, 166, ${0.22 * masterOpacity})`, // Teal glow
          colorStop1: `rgba(59, 130, 246, ${0.14 * masterOpacity})`, // Deep royal blue
          colorStop2: 'rgba(4, 10, 22, 0)',
          parallaxFactor: 0.055,
          driftSpeedX: -0.015,
          driftSpeedY: 0.022,
          phaseOffset: 2.5,
        },
      ]
    } else {
      // Default: Cosmic Blue & Radiant Galactic Stardust
      clouds = [
        {
          relX: 0.28,
          relY: 0.3,
          radiusRatio: 0.58 + bassPulse,
          colorStop0: `rgba(14, 165, 233, ${0.28 * masterOpacity})`, // Vibrant electric cyan
          colorStop1: `rgba(37, 99, 235, ${0.18 * masterOpacity})`, // Royal sapphire blue
          colorStop2: 'rgba(10, 15, 45, 0)',
          parallaxFactor: 0.045,
          driftSpeedX: 0.02,
          driftSpeedY: 0.014,
          phaseOffset: 0,
        },
        {
          relX: 0.72,
          relY: 0.42,
          radiusRatio: 0.65 + bassPulse * 1.2,
          colorStop0: `rgba(168, 85, 247, ${0.24 * masterOpacity})`, // Mystic violet galaxy
          colorStop1: `rgba(217, 70, 239, ${0.15 * masterOpacity})`, // Magenta stardust
          colorStop2: 'rgba(15, 10, 40, 0)',
          parallaxFactor: 0.065,
          driftSpeedX: -0.018,
          driftSpeedY: 0.02,
          phaseOffset: 1.5,
        },
        {
          relX: 0.5,
          relY: 0.7,
          radiusRatio: 0.72 + bassPulse,
          colorStop0: `rgba(79, 70, 229, ${0.2 * masterOpacity})`, // Indigo core
          colorStop1: `rgba(6, 182, 212, ${0.12 * masterOpacity})`, // Soft cyan tail
          colorStop2: 'rgba(5, 8, 30, 0)',
          parallaxFactor: 0.035,
          driftSpeedX: 0.012,
          driftSpeedY: -0.015,
          phaseOffset: 3.0,
        },
        {
          relX: 0.58,
          relY: 0.26,
          radiusRatio: 0.38 + bassPulse * 0.8,
          colorStop0: `rgba(192, 132, 252, ${0.2 * masterOpacity})`, // Bright stellar core
          colorStop1: `rgba(147, 197, 253, ${0.12 * masterOpacity})`,
          colorStop2: 'rgba(10, 15, 40, 0)',
          parallaxFactor: 0.05,
          driftSpeedX: -0.01,
          driftSpeedY: -0.01,
          phaseOffset: 4.2,
        },
      ]
    }

    // Draw each nebula cloud with smooth radial gradients
    for (let i = 0; i < clouds.length; i++) {
      const c = clouds[i]
      const driftX = Math.sin(currentTime * c.driftSpeedX + c.phaseOffset) * 25
      const driftY = Math.cos(currentTime * c.driftSpeedY + c.phaseOffset) * 20
      const cx = c.relX * width + driftX - cameraX * c.parallaxFactor
      const cy = c.relY * height + driftY - cameraY * c.parallaxFactor
      const rad = c.radiusRatio * maxDim

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad)
      grad.addColorStop(0.0, c.colorStop0)
      grad.addColorStop(0.45, c.colorStop1)
      grad.addColorStop(1.0, c.colorStop2)

      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(cx, cy, rad, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  /**
   * Render thousands of stars at multiple depth planes with delicate twinkle & flares
   */
  private renderStarfield(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: UniverseBackgroundConfig,
    cameraX: number,
    cameraY: number,
    currentTime: number,
    bands?: NormalizedAudioBands
  ): void {
    const starCount = Math.min(
      this.cachedStars.length,
      config.type === 'minimal-starfield' ? 1200 : config.starCount || 2400
    )

    // Treble audio sparkle modulation
    const trebleSparkle = bands && bands.treble ? bands.treble * 0.25 : 0

    for (let i = 0; i < starCount; i++) {
      const s = this.cachedStars[i]
      const parallaxFactor = 0.02 + s.depth * 0.07
      const sx = s.x * width - cameraX * parallaxFactor
      const sy = s.y * height - cameraY * parallaxFactor

      // Skip stars outside visible screen + small margin
      if (sx < -20 || sx > width + 20 || sy < -20 || sy > height + 20) {
        continue
      }

      // Smooth organic twinkle
      const twinkle = Math.sin(currentTime * s.twinkleSpeed + s.phase)
      const alpha = Math.max(
        0.15,
        Math.min(1.0, s.baseAlpha * (0.8 + 0.25 * twinkle) + trebleSparkle * s.depth)
      )

      ctx.save()
      ctx.globalAlpha = alpha

      // Major celestial beacons: soft glowing halo + subtle diamond flares
      if (s.hasHalo) {
        const haloGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.baseRadius * 5.0)
        haloGrad.addColorStop(0.0, s.color)
        haloGrad.addColorStop(0.3, s.color)
        haloGrad.addColorStop(1.0, 'rgba(255,255,255,0)')
        ctx.fillStyle = haloGrad
        ctx.beginPath()
        ctx.arc(sx, sy, s.baseRadius * 5.0, 0, Math.PI * 2)
        ctx.fill()

        if (s.hasSpikes) {
          ctx.strokeStyle = s.color
          ctx.lineWidth = 0.75
          const spikeLen = s.baseRadius * 3.8
          ctx.beginPath()
          ctx.moveTo(sx - spikeLen, sy)
          ctx.lineTo(sx + spikeLen, sy)
          ctx.moveTo(sx, sy - spikeLen)
          ctx.lineTo(sx, sy + spikeLen)
          ctx.stroke()
        }
      }

      // Solid star core
      ctx.fillStyle = s.color
      ctx.beginPath()
      ctx.arc(sx, sy, s.baseRadius, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }
  }

  /**
   * Render custom user-uploaded background image quad
   */
  private renderCustomImage(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    custom: UniverseCustomBackground,
    cameraX: number,
    cameraY: number
  ): boolean {
    if (!custom.url || this.customImageLoadFailed.has(custom.url)) {
      return false
    }

    let img = this.customImageCache.get(custom.url)
    if (!img) {
      img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        // Cached and ready for next frame
      }
      img.onerror = () => {
        this.customImageLoadFailed.add(custom.url)
      }
      img.src = custom.url
      this.customImageCache.set(custom.url, img)
      return false // Wait until loaded, fall through to default space
    }

    if (!img.complete || img.naturalWidth === 0) {
      return false
    }

    ctx.save()

    // Parallax displacement
    const parallaxFactor = custom.parallaxEnabled ? 0.04 : 0
    const offsetX = -cameraX * parallaxFactor
    const offsetY = -cameraY * parallaxFactor

    // Object-fit cover calculations
    const imgAspect = img.naturalWidth / img.naturalHeight
    const canvasAspect = width / height

    let dw = width
    let dh = height

    if (custom.fitMode === 'contain') {
      if (imgAspect > canvasAspect) {
        dw = width
        dh = width / imgAspect
      } else {
        dh = height
        dw = height * imgAspect
      }
    } else {
      // Cover (default)
      if (imgAspect > canvasAspect) {
        dh = height
        dw = height * imgAspect
      } else {
        dw = width
        dh = width / imgAspect
      }
    }

    const dx = (width - dw) / 2 + offsetX
    const dy = (height - dh) / 2 + offsetY

    // Apply user brightness and blur filters
    const brightnessPct = custom.brightness ?? 100
    const blurPx = custom.blur ?? 0
    if (ctx.filter !== undefined) {
      ctx.filter = `brightness(${brightnessPct}%) blur(${blurPx}px)`
    }

    ctx.drawImage(img, dx, dy, dw, dh)

    if (ctx.filter !== undefined) {
      ctx.filter = 'none'
    }

    ctx.restore()
    return true
  }

  /**
   * Initialize or attach background objects to Three.js scene
   */
  public attachToScene(scene: THREE.Scene, config: UniverseBackgroundConfig): void {
    if (!this.isClient || !scene) return

    // Clean up previous background group if any
    if (this.bgGroup) {
      scene.remove(this.bgGroup)
      this.dispose()
    }

    this.bgGroup = new THREE.Group()
    this.bgGroup.name = 'universeBackground'

    // STRICT FIX: Never clear scene to opaque black!
    scene.background = null

    const bgType = config.type || 'deep-space'
    if (bgType === 'solid-dark') {
      scene.add(this.bgGroup)
      return
    }

    // 1. Procedural 3D Starfield Points in Three.js (with fog: false)
    if (bgType === 'deep-space' || bgType === 'minimal-starfield' || bgType === 'nebula-galaxy') {
      const starCount = bgType === 'minimal-starfield' ? 800 : Math.min(2000, config.starCount || 1800)
      const starGeo = new THREE.BufferGeometry()
      const starPos = new Float32Array(starCount * 3)
      const starColors = new Float32Array(starCount * 3)

      for (let i = 0; i < starCount; i++) {
        starPos[i * 3] = (Math.random() - 0.5) * 5000
        starPos[i * 3 + 1] = (Math.random() - 0.5) * 3600
        starPos[i * 3 + 2] = -Math.random() * 2500 - 1500

        const temp = Math.random()
        if (temp > 0.75) {
          starColors[i * 3] = 0.75
          starColors[i * 3 + 1] = 0.92
          starColors[i * 3 + 2] = 1.0 // Pale cyan
        } else if (temp < 0.2) {
          starColors[i * 3] = 1.0
          starColors[i * 3 + 1] = 0.9
          starColors[i * 3 + 2] = 0.75 // Soft amber
        } else {
          starColors[i * 3] = 0.95
          starColors[i * 3 + 1] = 0.95
          starColors[i * 3 + 2] = 1.0 // Silver white
        }
      }

      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
      starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3))

      const starMat = new THREE.PointsMaterial({
        size: 3.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false, // CRITICAL: Never let fog extinguish background stars!
      })

      this.starsMesh = new THREE.Points(starGeo, starMat)
      this.bgGroup.add(this.starsMesh)

      // 2. Larger, softer 3D glowing stars
      const softCount = 50
      const softGeo = new THREE.BufferGeometry()
      const softPos = new Float32Array(softCount * 3)
      for (let i = 0; i < softCount; i++) {
        softPos[i * 3] = (Math.random() - 0.5) * 4500
        softPos[i * 3 + 1] = (Math.random() - 0.5) * 3000
        softPos[i * 3 + 2] = -Math.random() * 2200 - 1200
      }
      softGeo.setAttribute('position', new THREE.BufferAttribute(softPos, 3))
      const softMat = new THREE.PointsMaterial({
        size: 8.0,
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false, // CRITICAL: fog disabled
      })
      this.softStarsMesh = new THREE.Points(softGeo, softMat)
      this.bgGroup.add(this.softStarsMesh)
    }

    scene.add(this.bgGroup)
  }

  /**
   * Animate subtle background parallax drift
   */
  public update(cameraX: number, cameraY: number, currentTime: number): void {
    if (!this.bgGroup) return

    if (this.starsMesh) {
      this.starsMesh.rotation.z = currentTime * 0.001
      this.starsMesh.position.x = cameraX * 0.05
      this.starsMesh.position.y = cameraY * 0.05
    }

    if (this.softStarsMesh) {
      this.softStarsMesh.rotation.z = -currentTime * 0.0006
      this.softStarsMesh.position.x = cameraX * 0.08
      this.softStarsMesh.position.y = cameraY * 0.08
    }
  }

  /**
   * Dispose background geometries and textures
   */
  public dispose(): void {
    if (this.starsMesh) {
      this.starsMesh.geometry.dispose()
      ;(this.starsMesh.material as THREE.Material).dispose()
      this.starsMesh = null
    }

    if (this.softStarsMesh) {
      this.softStarsMesh.geometry.dispose()
      ;(this.softStarsMesh.material as THREE.Material).dispose()
      this.softStarsMesh = null
    }

    if (this.customBgMesh) {
      this.customBgMesh.geometry.dispose()
      ;(this.customBgMesh.material as THREE.Material).dispose()
      this.customBgMesh = null
    }

    if (this.customTexture) {
      this.customTexture.dispose()
      this.customTexture = null
      this.lastCustomUrl = null
    }

    this.bgGroup = null
  }
}

export const universeBackgroundRenderer = new UniverseBackgroundRenderer()
