/**
 * IndiaTools Audio Spectrum & Waveform Video Generator 2.0
 * SPECIAL FX #1: Audio-Reactive Particle Pixel Dispersion ("Sand / Ember Dissolve")
 *
 * High-performance offscreen pixel sampling (zero frame lag, pre-sampled once on image load/change).
 * Object-pooled physics engine with zero per-frame memory allocation or garbage collection.
 * Particles detach and dissolve from photo edges/bright regions into glowing embers or drifting sand grains.
 */

import {
  DetailedAudioBands,
  ThemeColors,
  PixelDispersionConfig,
  DEFAULT_PIXEL_DISPERSION_CONFIG,
  ImageLayoutMode,
  AspectRatio,
} from './audioVisualizerTypes.ts'

export interface DispersionParticle {
  active: boolean
  x: number
  y: number
  originX: number
  originY: number
  vx: number
  vy: number
  size: number
  r: number
  g: number
  b: number
  alpha: number
  life: number
  maxLife: number
  turbulenceOffset: number
}

export interface CandidateSpawnPoint {
  normX: number // 0 to 1 relative to photo bounds
  normY: number // 0 to 1 relative to photo bounds
  r: number
  g: number
  b: number
  luminance: number
  edgeStrength: number
  weight: number
}

export class ParticlePixelDispersionEngine {
  private particles: DispersionParticle[] = []
  private maxParticles = 2000
  private candidates: CandidateSpawnPoint[] = []

  // Image Cache
  private cachedImage: HTMLImageElement | null = null
  private cachedImageSrc = ''
  private offscreenCanvas: HTMLCanvasElement | null = null
  private offscreenCtx: CanvasRenderingContext2D | null = null

  // Timing
  private lastTime = 0

  constructor(maxParticles: number = 2000) {
    this.maxParticles = maxParticles
    this.initPool()
  }

  /**
   * Pre-allocate fixed-size particle object pool (zero GC in render loop)
   */
  private initPool() {
    this.particles = new Array(this.maxParticles)
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles[i] = {
        active: false,
        x: 0,
        y: 0,
        originX: 0,
        originY: 0,
        vx: 0,
        vy: 0,
        size: 2.5,
        r: 255,
        g: 140,
        b: 20,
        alpha: 1,
        life: 0,
        maxLife: 1.5,
        turbulenceOffset: i * 0.37,
      }
    }
  }

  /**
   * Reset all particles and clears sample cache
   */
  public reset() {
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles[i].active = false
    }
    this.candidates = []
    this.cachedImage = null
    this.cachedImageSrc = ''
    this.lastTime = 0
  }

  /**
   * Pre-sample uploaded photo ONCE into candidate pool.
   * NEVER runs getImageData in 60 FPS animation loop!
   */
  public preSampleImageOnce(image: HTMLImageElement | null) {
    if (typeof document === 'undefined') {
      this.generateProceduralCandidates()
      return
    }

    const hasImage = image && image.complete && (image.naturalWidth || image.width) > 0
    const imageSrc = hasImage ? image.src : ''

    if (hasImage && image === this.cachedImage && imageSrc === this.cachedImageSrc && this.candidates.length > 0) {
      return // Cache is fresh
    }

    if (!hasImage) {
      this.cachedImage = null
      this.cachedImageSrc = ''
      this.generateProceduralCandidates()
      return
    }

    this.cachedImage = image
    this.cachedImageSrc = imageSrc

    // Create or reuse offscreen sampling canvas (180x180 = optimal balance of fidelity and speed)
    const sampleSize = 180
    if (!this.offscreenCanvas) {
      this.offscreenCanvas = document.createElement('canvas')
      this.offscreenCanvas.width = sampleSize
      this.offscreenCanvas.height = sampleSize
      this.offscreenCtx = this.offscreenCanvas.getContext('2d', { willReadFrequently: true })
    }

    if (!this.offscreenCtx) {
      this.generateProceduralCandidates()
      return
    }

    try {
      this.offscreenCtx.clearRect(0, 0, sampleSize, sampleSize)
      this.offscreenCtx.drawImage(image, 0, 0, sampleSize, sampleSize)

      const imgData = this.offscreenCtx.getImageData(0, 0, sampleSize, sampleSize).data
      const newCandidates: CandidateSpawnPoint[] = []

      // Extract candidate points, prioritizing high luminance and contrast edges
      for (let y = 1; y < sampleSize - 1; y += 2) {
        for (let x = 1; x < sampleSize - 1; x += 2) {
          const idx = (y * sampleSize + x) * 4
          const r = imgData[idx] || 0
          const g = imgData[idx + 1] || 0
          const b = imgData[idx + 2] || 0
          const a = imgData[idx + 3] || 0

          if (a < 35) continue

          // Perceived luminance (Rec. 709)
          const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255

          // Edge contrast via 4-neighbor delta
          const rightIdx = (y * sampleSize + (x + 1)) * 4
          const downIdx = ((y + 1) * sampleSize + x) * 4
          const dx = Math.abs(r - (imgData[rightIdx] || 0)) + Math.abs(g - (imgData[rightIdx + 1] || 0))
          const dy = Math.abs(r - (imgData[downIdx] || 0)) + Math.abs(g - (imgData[downIdx + 1] || 0))
          const edge = Math.min(1.0, (dx + dy) / 220)

          // Candidates with either high luminance or strong edge
          const weight = lum * 0.55 + edge * 0.45
          if (weight > 0.16) {
            newCandidates.push({
              normX: x / sampleSize,
              normY: y / sampleSize,
              r,
              g,
              b,
              luminance: lum,
              edgeStrength: edge,
              weight,
            })
          }
        }
      }

      if (newCandidates.length > 50) {
        // Sort by weight so prominent facial/edge features have priority
        newCandidates.sort((a, b) => b.weight - a.weight)
        // Keep top candidate pool
        this.candidates = newCandidates.slice(0, 3500)
      } else {
        this.generateProceduralCandidates()
      }
    } catch {
      this.generateProceduralCandidates()
    }
  }

  /**
   * Procedural harmonic candidates when no custom photo is uploaded yet
   */
  private generateProceduralCandidates() {
    this.candidates = []
    const count = 1200
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 0.22 + Math.random() * 0.26
      const normX = 0.5 + Math.cos(angle) * radius
      const normY = 0.5 + Math.sin(angle) * radius
      const lum = 0.45 + Math.random() * 0.55

      this.candidates.push({
        normX,
        normY,
        r: 255,
        g: 130 + Math.floor(Math.random() * 100),
        b: 30 + Math.floor(Math.random() * 60),
        luminance: lum,
        edgeStrength: 0.8,
        weight: lum,
      })
    }
  }

  /**
   * Main simulation and render loop
   */
  public updateAndDraw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    currentPhoto: HTMLImageElement | null,
    bands: DetailedAudioBands,
    palette: ThemeColors,
    currentTime: number,
    config: PixelDispersionConfig = DEFAULT_PIXEL_DISPERSION_CONFIG,
    imageLayoutMode: ImageLayoutMode = 'portrait-frame',
    aspectRatio: AspectRatio = '9:16'
  ) {
    if (!config.enabled) return

    // 1. Ensure sample cache is ready
    this.preSampleImageOnce(currentPhoto)
    if (this.candidates.length === 0) return

    // 2. Compute delta time
    const dt = this.lastTime > 0 ? Math.min(0.05, Math.max(0.001, currentTime - this.lastTime)) : 0.016
    this.lastTime = currentTime

    // 3. Compute Photo Screen Space Transform
    const photoBounds = this.computePhotoScreenBounds(width, height, imageLayoutMode, aspectRatio)

    // 4. Spawn new particles based on density, music transients and bass burst
    this.spawnParticles(dt, config, bands, photoBounds, palette)

    // 5. Update particle physics (velocity, air drag, turbulence curl, lifetime)
    this.updatePhysics(dt, currentTime, config, bands)

    // 6. Draw particles with selected blend mode and glowing styles
    this.draw(ctx, config, bands, currentTime, palette)
  }

  /**
   * Compute actual on-screen bounding box / circular dimensions of the photo
   */
  private computePhotoScreenBounds(
    width: number,
    height: number,
    mode: ImageLayoutMode,
    aspectRatio: AspectRatio
  ): {
    x: number
    y: number
    w: number
    h: number
    isCircle: boolean
    radius: number
    centerX: number
    centerY: number
  } {
    const centerX = width / 2
    const centerY = aspectRatio === '9:16' ? height * 0.45 : height / 2
    const primaryRadius = Math.min(width, height) * (aspectRatio === '9:16' ? 0.22 : 0.26)

    if (mode === 'album-disc') {
      return {
        x: centerX - primaryRadius,
        y: centerY - primaryRadius,
        w: primaryRadius * 2,
        h: primaryRadius * 2,
        isCircle: true,
        radius: primaryRadius * 0.98,
        centerX,
        centerY,
      }
    } else if (mode === 'portrait-frame') {
      const cardW = primaryRadius * 1.45
      const cardH = primaryRadius * 2.1
      return {
        x: centerX - cardW / 2,
        y: centerY - cardH / 2,
        w: cardW,
        h: cardH,
        isCircle: false,
        radius: primaryRadius,
        centerX,
        centerY,
      }
    } else if (mode === 'floating-card') {
      const cardSize = primaryRadius * 1.8
      return {
        x: centerX - cardSize / 2,
        y: centerY - cardSize / 2,
        w: cardSize,
        h: cardSize,
        isCircle: false,
        radius: primaryRadius,
        centerX,
        centerY,
      }
    } else {
      // Fullscreen or cover
      return {
        x: 0,
        y: 0,
        w: width,
        h: height,
        isCircle: false,
        radius: Math.min(width, height) * 0.5,
        centerX,
        centerY,
      }
    }
  }

  /**
   * Activate inactive particles from pool based on density and audio bursts
   */
  private spawnParticles(
    dt: number,
    config: PixelDispersionConfig,
    bands: DetailedAudioBands,
    bounds: ReturnType<typeof this.computePhotoScreenBounds>,
    palette: ThemeColors
  ) {
    const bassReactivity = (config.bassBurstReactivity ?? 80) / 100
    const densityScale = (config.density ?? 65) / 100

    // Base spawn count per frame
    let spawnCount = Math.round(18 * densityScale * (dt * 60))

    // Bass transient burst: spawn a massive spray on kick drums
    const isBassKick = bands.isBeatHit || bands.bass > 0.68 || bands.subBass > 0.72
    if (isBassKick) {
      spawnCount += Math.round((28 + bands.bass * 42) * bassReactivity * densityScale)
    }

    const candidateLen = this.candidates.length
    if (candidateLen === 0) return

    let spawned = 0
    const speedMult = config.speed ?? 1.2
    const burstImpulse = isBassKick ? 1.0 + bands.bass * 1.6 * bassReactivity : 1.0

    for (let i = 0; i < this.maxParticles && spawned < spawnCount; i++) {
      const p = this.particles[i]
      if (p.active) continue

      // Pick weighted candidate
      const candIdx = Math.floor(Math.random() * Math.min(candidateLen, 1200))
      const cand = this.candidates[candIdx]
      if (!cand) continue

      // Map normalized coordinates into actual screen coordinates
      let posX = 0
      let posY = 0

      if (bounds.isCircle) {
        const u = (cand.normX - 0.5) * 2
        const v = (cand.normY - 0.5) * 2
        const dist = Math.hypot(u, v)
        if (dist > 1.0) continue // Outside circle
        posX = bounds.centerX + u * bounds.radius
        posY = bounds.centerY + v * bounds.radius
      } else {
        posX = bounds.x + cand.normX * bounds.w
        posY = bounds.y + cand.normY * bounds.h
      }

      // Assign particle color based on selected mode
      let r = cand.r
      let g = cand.g
      let b = cand.b

      if (config.colorMode === 'ember-fire') {
        // Blazing fire gradient with luminance modulation
        if (cand.luminance > 0.7) {
          r = 255
          g = 230 + Math.floor(Math.random() * 25)
          b = 90 + Math.floor(Math.random() * 40)
        } else if (cand.luminance > 0.35) {
          r = 255
          g = 120 + Math.floor(Math.random() * 60)
          b = 10
        } else {
          r = 220 + Math.floor(Math.random() * 35)
          g = 35 + Math.floor(Math.random() * 30)
          b = 5
        }
      } else if (config.colorMode === 'golden-sand') {
        // Warm desert sand / molten gold
        r = 245 + Math.floor(Math.random() * 10)
        g = 170 + Math.floor(Math.random() * 45)
        b = 20 + Math.floor(Math.random() * 30)
      } else if (config.colorMode === 'palette-tint') {
        // Theme palette harmonic interpolation
        const isAccent = Math.random() > 0.6
        const hex = isAccent ? palette.accent : palette.primary
        const parsed = this.parseColorFast(hex)
        r = parsed.r
        g = parsed.g
        b = parsed.b
      }

      // Initial velocity by direction
      let vx = 0
      let vy = 0
      const spread = (config.dissolveSpread ?? 50) / 100

      switch (config.direction) {
        case 'up-right':
          vx = (25 + Math.random() * 55) * speedMult * burstImpulse
          vy = -(45 + Math.random() * 75) * speedMult * burstImpulse
          break
        case 'outward': {
          const dx = posX - bounds.centerX
          const dy = posY - bounds.centerY
          const dist = Math.max(1, Math.hypot(dx, dy))
          const nx = dx / dist
          const ny = dy / dist
          vx = nx * (55 + Math.random() * 85) * speedMult * burstImpulse
          vy = ny * (55 + Math.random() * 85) * speedMult * burstImpulse
          break
        }
        case 'vortex': {
          const dx = posX - bounds.centerX
          const dy = posY - bounds.centerY
          const dist = Math.max(1, Math.hypot(dx, dy))
          const nx = dx / dist
          const ny = dy / dist
          // Tangential swirl + slight outward drift
          vx = (-ny * 80 + nx * 25) * speedMult * burstImpulse
          vy = (nx * 80 + ny * 25) * speedMult * burstImpulse
          break
        }
        case 'down':
          vx = (Math.random() - 0.5) * 40 * spread * speedMult
          vy = (45 + Math.random() * 80) * speedMult * burstImpulse
          break
        case 'up':
        default:
          vx = (Math.random() - 0.5) * 50 * spread * speedMult
          vy = -(55 + Math.random() * 95) * speedMult * burstImpulse
          break
      }

      p.active = true
      p.x = posX
      p.y = posY
      p.originX = posX
      p.originY = posY
      p.vx = vx
      p.vy = vy
      p.r = r
      p.g = g
      p.b = b
      p.size = Math.max(1.0, (config.particleSize ?? 2.8) * (0.65 + Math.random() * 0.7))
      p.alpha = 0.85 + Math.random() * 0.15
      p.life = 0
      p.maxLife = 0.9 + Math.random() * 1.6
      p.turbulenceOffset = Math.random() * 100

      spawned++
    }
  }

  /**
   * Integrate particle movement, atmospheric drag, curl noise, and lifetime decay
   */
  private updatePhysics(
    dt: number,
    currentTime: number,
    config: PixelDispersionConfig,
    bands: DetailedAudioBands
  ) {
    const normalizedDrag = Math.pow(0.965, dt * 60)
    const turbulenceScale = 38 * (config.speed ?? 1.2)

    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.particles[i]
      if (!p.active) continue

      p.life += dt
      if (p.life >= p.maxLife) {
        p.active = false
        continue
      }

      // Sinusoidal curl turbulence (perlin-like organic eddy motion)
      const curl = Math.sin(p.turbulenceOffset + currentTime * 3.6) * turbulenceScale
      p.vx += curl * dt

      // Natural upward thermal buoyancy for rising embers
      if (config.direction === 'up' || config.direction === 'up-right') {
        p.vy -= 14 * dt
      }

      // Air resistance damping
      p.vx *= normalizedDrag
      p.vy *= normalizedDrag

      // Integrate position
      p.x += p.vx * dt
      p.y += p.vy * dt
    }
  }

  /**
   * Render active particles onto main canvas with selected blend mode
   */
  private draw(
    ctx: CanvasRenderingContext2D,
    config: PixelDispersionConfig,
    bands: DetailedAudioBands,
    currentTime: number,
    palette: ThemeColors
  ) {
    ctx.save()

    // Composite blend mode for radiant ember glow or matte sand
    ctx.globalCompositeOperation = config.blendMode || 'lighter'

    const trebleShimmerScale = (config.trebleShimmer ?? 70) / 100
    const isEmber = config.mode === 'ember-glow'

    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.particles[i]
      if (!p.active) continue

      const lifeRatio = Math.max(0, 1 - p.life / p.maxLife)

      // Treble-reactive sparkle / shimmer modulation
      const shimmer =
        trebleShimmerScale > 0
          ? 1.0 + Math.sin(p.turbulenceOffset * 7.7 + currentTime * 14) * bands.treble * 0.55 * trebleShimmerScale
          : 1.0

      const currentAlpha = Math.max(0.01, Math.min(1.0, p.alpha * lifeRatio * shimmer))
      const currentSize = Math.max(0.5, p.size * (0.35 + 0.65 * lifeRatio))

      // 1. Soft glowing halo for embers or stardust
      if (isEmber && currentAlpha > 0.15 && currentSize > 1.2) {
        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${currentAlpha * 0.32})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, currentSize * 2.2, 0, Math.PI * 2)
        ctx.fill()
      }

      // 2. High-intensity particle core
      if (isEmber && lifeRatio > 0.5) {
        // Hot incandescent core
        ctx.fillStyle = `rgba(255, 255, 220, ${currentAlpha})`
      } else {
        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${currentAlpha})`
      }

      ctx.beginPath()
      ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }

  /**
   * Fast hex/rgb color parser
   */
  private parseColorFast(color: string): { r: number; g: number; b: number } {
    if (!color) return { r: 255, g: 140, b: 20 }
    if (color.startsWith('#')) {
      let hex = color.slice(1)
      if (hex.length === 3) {
        hex = hex.split('').map((c) => c + c).join('')
      }
      const num = parseInt(hex, 16)
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255,
      }
    }
    const match = color.match(/\d+/g)
    if (match && match.length >= 3) {
      return {
        r: parseInt(match[0], 10),
        g: parseInt(match[1], 10),
        b: parseInt(match[2], 10),
      }
    }
    return { r: 255, g: 140, b: 20 }
  }
}
