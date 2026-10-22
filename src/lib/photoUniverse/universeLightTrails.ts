/**
 * IndiaTools — Floating Photo Universe 2.0
 * Audio-Reactive Cosmic Light Trails Engine
 * 3D Tapered Additive Ribbon Trails, Catmull-Rom Smoothing & High-Frequency Treble Reactivity
 */

import * as THREE from 'three'
import {
  UniverseLightTrailsConfig,
  TrailColorPalette,
  DEFAULT_UNIVERSE_LIGHT_TRAILS,
  MusicMovementProfile,
} from './photoUniverseTypes.ts'
import { NormalizedAudioBands } from '../audioToVideo/types.ts'

export interface TrailPoint {
  x: number
  y: number
  z: number
  time: number
  speed: number
}

interface PaletteColors {
  head: THREE.Color
  body: THREE.Color
  tail: THREE.Color
}

interface SparkParticle {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  life: number // 0 to 1
  decay: number
  color: THREE.Color
}

export class UniverseLightTrailsRenderer {
  private isClient: boolean
  private trailsGroup: THREE.Group | null = null

  // Per-photo position history ring buffer
  private trailHistory: Map<string, TrailPoint[]> = new Map()

  // Mesh cache for ribbons
  private ribbonMeshMap: Map<string, {
    coreMesh: THREE.Mesh
    glowMesh: THREE.Mesh
    coreGeo: THREE.BufferGeometry
    glowGeo: THREE.BufferGeometry
  }> = new Map()

  // Sparkle particle system
  private sparksMesh: THREE.Points | null = null
  private sparksGeo: THREE.BufferGeometry | null = null
  private sparksPool: SparkParticle[] = []
  private maxSparks = 80

  // Treble audio smoothing filter
  private smoothedTreble: number = 0
  private lastTime: number = 0

  constructor() {
    this.isClient = typeof window !== 'undefined'
    if (this.isClient) {
      this.initSparksPool()
    }
  }

  /**
   * Pre-allocate fixed pool for sparkle particles (zero GC overhead)
   */
  private initSparksPool(): void {
    this.sparksPool = []
    for (let i = 0; i < this.maxSparks; i++) {
      this.sparksPool.push({
        x: 0,
        y: 0,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        life: 0,
        decay: 1.5,
        color: new THREE.Color(0xffffff),
      })
    }
  }

  /**
   * Resolve 3-tier color palette for light trail ribbons
   */
  public resolvePalette(palette: TrailColorPalette, customHex?: string): PaletteColors {
    if (palette === 'aurora-violet') {
      return {
        head: new THREE.Color(0xffffff),
        body: new THREE.Color(0xc084fc), // Luminous Violet
        tail: new THREE.Color(0x7e22ce), // Deep Orchid
      }
    }
    if (palette === 'sunset-nebula') {
      return {
        head: new THREE.Color(0xfffbeb),
        body: new THREE.Color(0xf59e0b), // Amber Solar Gold
        tail: new THREE.Color(0xe11d48), // Rose Crimson
      }
    }
    if (palette === 'ice-white') {
      return {
        head: new THREE.Color(0xffffff),
        body: new THREE.Color(0xe0f2fe), // Glacial White
        tail: new THREE.Color(0x94a3b8), // Silver Mist
      }
    }
    if (palette === 'custom' && customHex) {
      const base = new THREE.Color(customHex)
      const head = new THREE.Color(customHex).lerp(new THREE.Color(0xffffff), 0.7)
      const tail = new THREE.Color(customHex).multiplyScalar(0.4)
      return { head, body: base, tail }
    }
    // Default: Cosmic Blue
    return {
      head: new THREE.Color(0xffffff),
      body: new THREE.Color(0x00f0ff), // Electric Cyan
      tail: new THREE.Color(0x1d4ed8), // Royal Sapphire
    }
  }

  /**
   * Initialize or attach trails container to Three.js scene
   */
  public attachToScene(scene: THREE.Scene): void {
    if (!this.isClient || !scene) return

    if (this.trailsGroup) {
      scene.remove(this.trailsGroup)
      this.dispose()
    }

    this.trailsGroup = new THREE.Group()
    this.trailsGroup.name = 'universeLightTrails'

    // Initialize 3D sparkle particle mesh
    this.sparksGeo = new THREE.BufferGeometry()
    const pos = new Float32Array(this.maxSparks * 3)
    const col = new Float32Array(this.maxSparks * 3)

    this.sparksGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    this.sparksGeo.setAttribute('color', new THREE.BufferAttribute(col, 3))

    const sparksMat = new THREE.PointsMaterial({
      size: 5.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    })

    this.sparksMesh = new THREE.Points(this.sparksGeo, sparksMat)
    this.trailsGroup.add(this.sparksMesh)

    scene.add(this.trailsGroup)
  }

  /**
   * Reset all trail history (called on seeking, track reset, or route regeneration)
   */
  public resetTrails(): void {
    this.trailHistory.clear()
    for (const spark of this.sparksPool) {
      spark.life = 0
    }
    this.smoothedTreble = 0
  }

  /**
   * Update audio treble smoothing with attack/release filter
   */
  public updateTrebleFilter(
    bands: NormalizedAudioBands | undefined,
    profile: MusicMovementProfile = 'balanced-cinematic'
  ): number {
    const rawTreble = bands && bands.treble !== undefined ? bands.treble : 0

    // Melody/Ambient profile: softer attack, lingering release for dreamy trails
    // Energetic/Rhythm profile: snappier attack, energetic peaks
    let attack = 0.28
    let release = 0.08

    if (profile === 'melody-ambient' || profile === 'soft-vocal') {
      attack = 0.16
      release = 0.04
    } else if (profile === 'steady-rhythm' || profile === 'bass-heavy') {
      attack = 0.36
      release = 0.12
    }

    if (rawTreble > this.smoothedTreble) {
      this.smoothedTreble += (rawTreble - this.smoothedTreble) * attack
    } else {
      this.smoothedTreble += (rawTreble - this.smoothedTreble) * release
    }

    return this.smoothedTreble
  }

  /**
   * Record current photo positions and update ribbons in Three.js scene
   */
  public update(
    photoPositions: { id: string; x: number; y: number; z: number }[],
    camera: THREE.Camera,
    config: UniverseLightTrailsConfig = DEFAULT_UNIVERSE_LIGHT_TRAILS,
    bands: NormalizedAudioBands | undefined,
    currentTime: number,
    profile: MusicMovementProfile = 'balanced-cinematic'
  ): void {
    if (!this.isClient || !this.trailsGroup || !config.enabled) {
      if (this.trailsGroup) this.trailsGroup.visible = false
      return
    }

    this.trailsGroup.visible = true

    // Check for timeline seeking or track restarts
    if (currentTime < this.lastTime || Math.abs(currentTime - this.lastTime) > 0.6) {
      this.resetTrails()
    }
    const dt = Math.max(0.001, Math.min(0.1, currentTime - this.lastTime))
    this.lastTime = currentTime

    // 1. Process Treble Audio Reactivity
    const smoothTreble = this.updateTrebleFilter(bands, profile)
    const reactivityLevel = config.musicReactivity || 'balanced'
    const reactFactor =
      reactivityLevel === 'off'
        ? 0
        : reactivityLevel === 'subtle'
        ? 0.25
        : reactivityLevel === 'strong'
        ? 0.95
        : 0.55 // balanced

    const sensitivity = (config.trebleSensitivity ?? 60) / 100
    const trebleMod = smoothTreble * sensitivity * reactFactor

    // Modulated parameters
    const glowScale = Math.min(1.8, ((config.glowIntensity ?? 65) / 100) * (1.0 + trebleMod * 0.9))
    const baseLength = config.trailLength ?? 28
    const activeLength = Math.max(8, Math.min(48, Math.round(baseLength * (0.75 + trebleMod * 0.5))))
    const fadeDuration = config.fadeDuration ?? 1.4
    const baseWidth = (config.trailWidth ?? 14) * (1.0 + trebleMod * 0.3)
    const palette = this.resolvePalette(config.colorPalette, config.customColor)

    // 2. Record Photo Positions into Ring Buffer
    const activeIds = new Set<string>()

    for (const photo of photoPositions) {
      activeIds.add(photo.id)
      let history = this.trailHistory.get(photo.id)
      if (!history) {
        history = []
        this.trailHistory.set(photo.id, history)
      }

      // Check distance from last point (avoid point clustering when stationary)
      let dist = 999
      if (history.length > 0) {
        const last = history[history.length - 1]
        const dx = photo.x - last.x
        const dy = photo.y - last.y
        const dz = photo.z - last.z
        dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      }

      if (dist > 3.0 || history.length === 0) {
        const speed = history.length > 0 ? dist / Math.max(0.01, dt) : 0
        history.push({
          x: photo.x,
          y: photo.y,
          z: photo.z,
          time: currentTime,
          speed,
        })

        // Bounded capacity ring buffer
        if (history.length > activeLength) {
          history.shift()
        }

        // Trigger sparkling particles on strong treble hits
        if (config.particleAccents && trebleMod > 0.22 && Math.random() < 0.6) {
          this.emitSpark(photo.x, photo.y, photo.z, palette.body)
        }
      }

      // Expire points older than fadeDuration
      while (history.length > 2 && currentTime - history[0].time > fadeDuration) {
        history.shift()
      }

      // 3. Generate or Update 3D Tapered Ribbon Geometry
      this.updatePhotoRibbon(
        photo.id,
        history,
        camera,
        baseWidth,
        glowScale,
        palette,
        fadeDuration,
        currentTime
      )
    }

    // Clean up meshes for removed photos
    for (const [id, meshes] of this.ribbonMeshMap.entries()) {
      if (!activeIds.has(id)) {
        this.trailsGroup.remove(meshes.coreMesh)
        this.trailsGroup.remove(meshes.glowMesh)
        meshes.coreGeo.dispose()
        meshes.glowGeo.dispose()
        ;(meshes.coreMesh.material as THREE.Material).dispose()
        ;(meshes.glowMesh.material as THREE.Material).dispose()
        this.ribbonMeshMap.delete(id)
        this.trailHistory.delete(id)
      }
    }

    // 4. Animate and Update Sparkle Particles
    if (config.particleAccents && this.sparksMesh && this.sparksGeo) {
      this.updateSparks(dt)
    } else if (this.sparksMesh) {
      this.sparksMesh.visible = false
    }
  }

  /**
   * Construct smooth Catmull-Rom spline points from raw history
   */
  private generateSmoothSpline(points: TrailPoint[], samplesPerSegment: number = 3): THREE.Vector3[] {
    if (points.length < 2) return []
    if (points.length === 2) {
      return [
        new THREE.Vector3(points[0].x, points[0].y, points[0].z),
        new THREE.Vector3(points[1].x, points[1].y, points[1].z),
      ]
    }

    const vPoints = points.map((p) => new THREE.Vector3(p.x, p.y, p.z))
    const curve = new THREE.CatmullRomCurve3(vPoints, false, 'centripetal', 0.5)
    const totalSamples = Math.max(6, Math.min(36, points.length * samplesPerSegment))
    return curve.getPoints(totalSamples)
  }

  /**
   * Update ribbon geometry for a single photo trail
   */
  private updatePhotoRibbon(
    photoId: string,
    history: TrailPoint[],
    camera: THREE.Camera,
    baseWidth: number,
    glowScale: number,
    palette: PaletteColors,
    fadeDuration: number,
    currentTime: number
  ): void {
    let meshes = this.ribbonMeshMap.get(photoId)

    if (!meshes) {
      // Allocate dual-layer ribbon: Core Spine (narrow, intense) + Outer Glow (wide, soft)
      const coreGeo = new THREE.BufferGeometry()
      const glowGeo = new THREE.BufferGeometry()

      const coreMat = new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
        side: THREE.DoubleSide,
      })

      const glowMat = new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
        side: THREE.DoubleSide,
      })

      const coreMesh = new THREE.Mesh(coreGeo, coreMat)
      const glowMesh = new THREE.Mesh(glowGeo, glowMat)

      coreMesh.frustumCulled = false
      glowMesh.frustumCulled = false

      this.trailsGroup?.add(glowMesh)
      this.trailsGroup?.add(coreMesh)

      meshes = { coreMesh, glowMesh, coreGeo, glowGeo }
      this.ribbonMeshMap.set(photoId, meshes)
    }

    if (history.length < 2) {
      meshes.coreMesh.visible = false
      meshes.glowMesh.visible = false
      return
    }

    meshes.coreMesh.visible = true
    meshes.glowMesh.visible = true

    // Generate smooth spline curve
    const spline = this.generateSmoothSpline(history)
    const n = spline.length
    if (n < 2) return

    const vertexCount = n * 2
    const corePositions = new Float32Array(vertexCount * 3)
    const coreColors = new Float32Array(vertexCount * 3)
    const glowPositions = new Float32Array(vertexCount * 3)
    const glowColors = new Float32Array(vertexCount * 3)
    const indices: number[] = []

    const camPos = camera.position
    const tangent = new THREE.Vector3()
    const normal = new THREE.Vector3()
    const toCam = new THREE.Vector3()

    for (let i = 0; i < n; i++) {
      const p = spline[i]
      // Progress along trail: 0.0 at tail (oldest), 1.0 at head (newest)
      const u = i / (n - 1)

      // Calculate tangent along curve
      if (i < n - 1) {
        tangent.subVectors(spline[i + 1], p).normalize()
      } else {
        tangent.subVectors(p, spline[i - 1]).normalize()
      }

      // Billboard normal perpendicular to tangent and camera line of sight
      toCam.subVectors(camPos, p).normalize()
      normal.crossVectors(tangent, toCam).normalize()

      // Taper width: wide at head, tapering down to tail
      const taper = Math.pow(u, 0.75) // Gentle taper curve
      const halfWidthCore = (baseWidth * 0.45 * taper + 0.5)
      const halfWidthGlow = (baseWidth * 1.35 * taper + 1.2)

      // Alpha and color interpolation
      const alpha = Math.min(1.0, Math.pow(u, 1.2) * glowScale)
      const coreCol = palette.head.clone().lerp(palette.body, 1.0 - u).multiplyScalar(alpha * 0.95)
      const glowCol = palette.body.clone().lerp(palette.tail, 1.0 - u).multiplyScalar(alpha * 0.55)

      // Left and right vertices for Core
      const i0 = i * 2
      const i1 = i * 2 + 1

      corePositions[i0 * 3] = p.x - normal.x * halfWidthCore
      corePositions[i0 * 3 + 1] = p.y - normal.y * halfWidthCore
      corePositions[i0 * 3 + 2] = p.z - normal.z * halfWidthCore

      corePositions[i1 * 3] = p.x + normal.x * halfWidthCore
      corePositions[i1 * 3 + 1] = p.y + normal.y * halfWidthCore
      corePositions[i1 * 3 + 2] = p.z + normal.z * halfWidthCore

      coreColors[i0 * 3] = coreCol.r
      coreColors[i0 * 3 + 1] = coreCol.g
      coreColors[i0 * 3 + 2] = coreCol.b

      coreColors[i1 * 3] = coreCol.r
      coreColors[i1 * 3 + 1] = coreCol.g
      coreColors[i1 * 3 + 2] = coreCol.b

      // Left and right vertices for Outer Glow
      glowPositions[i0 * 3] = p.x - normal.x * halfWidthGlow
      glowPositions[i0 * 3 + 1] = p.y - normal.y * halfWidthGlow
      glowPositions[i0 * 3 + 2] = p.z - normal.z * halfWidthGlow

      glowPositions[i1 * 3] = p.x + normal.x * halfWidthGlow
      glowPositions[i1 * 3 + 1] = p.y + normal.y * halfWidthGlow
      glowPositions[i1 * 3 + 2] = p.z + normal.z * halfWidthGlow

      glowColors[i0 * 3] = glowCol.r
      glowColors[i0 * 3 + 1] = glowCol.g
      glowColors[i0 * 3 + 2] = glowCol.b

      glowColors[i1 * 3] = glowCol.r
      glowColors[i1 * 3 + 1] = glowCol.g
      glowColors[i1 * 3 + 2] = glowCol.b

      // Quad strip indices
      if (i < n - 1) {
        indices.push(i0, i1, i0 + 2)
        indices.push(i1, i1 + 2, i0 + 2)
      }
    }

    // Update Core Geometry
    meshes.coreGeo.setAttribute('position', new THREE.BufferAttribute(corePositions, 3))
    meshes.coreGeo.setAttribute('color', new THREE.BufferAttribute(coreColors, 3))
    meshes.coreGeo.setIndex(indices)
    meshes.coreGeo.attributes.position.needsUpdate = true
    meshes.coreGeo.attributes.color.needsUpdate = true

    // Update Glow Geometry
    meshes.glowGeo.setAttribute('position', new THREE.BufferAttribute(glowPositions, 3))
    meshes.glowGeo.setAttribute('color', new THREE.BufferAttribute(glowColors, 3))
    meshes.glowGeo.setIndex(indices)
    meshes.glowGeo.attributes.position.needsUpdate = true
    meshes.glowGeo.attributes.color.needsUpdate = true
  }

  /**
   * Emit micro sparkle particles along trail
   */
  private emitSpark(x: number, y: number, z: number, color: THREE.Color): void {
    // Find inactive spark in pool
    for (const spark of this.sparksPool) {
      if (spark.life <= 0) {
        spark.x = x + (Math.random() - 0.5) * 16
        spark.y = y + (Math.random() - 0.5) * 16
        spark.z = z + (Math.random() - 0.5) * 16
        spark.vx = (Math.random() - 0.5) * 25
        spark.vy = (Math.random() - 0.5) * 25
        spark.vz = (Math.random() - 0.5) * 25
        spark.life = 1.0
        spark.decay = 1.8 + Math.random() * 1.2
        spark.color.copy(color).lerp(new THREE.Color(0xffffff), Math.random() * 0.5)
        break
      }
    }
  }

  /**
   * Update particle positions and fade life
   */
  private updateSparks(dt: number): void {
    if (!this.sparksGeo || !this.sparksMesh) return

    const pos = this.sparksGeo.attributes.position.array as Float32Array
    const col = this.sparksGeo.attributes.color.array as Float32Array
    let activeCount = 0

    for (let i = 0; i < this.maxSparks; i++) {
      const spark = this.sparksPool[i]
      if (spark.life > 0) {
        spark.x += spark.vx * dt
        spark.y += spark.vy * dt
        spark.z += spark.vz * dt
        spark.life -= spark.decay * dt

        const alpha = Math.max(0, spark.life)
        pos[i * 3] = spark.x
        pos[i * 3 + 1] = spark.y
        pos[i * 3 + 2] = spark.z

        col[i * 3] = spark.color.r * alpha
        col[i * 3 + 1] = spark.color.g * alpha
        col[i * 3 + 2] = spark.color.b * alpha
        activeCount++
      } else {
        // Place inactive sparks outside view
        pos[i * 3] = 0
        pos[i * 3 + 1] = 0
        pos[i * 3 + 2] = -9999
        col[i * 3] = 0
        col[i * 3 + 1] = 0
        col[i * 3 + 2] = 0
      }
    }

    this.sparksGeo.attributes.position.needsUpdate = true
    this.sparksGeo.attributes.color.needsUpdate = true
    this.sparksMesh.visible = activeCount > 0
  }

  /**
   * Dispose all geometries, materials and buffers cleanly
   */
  public dispose(): void {
    for (const meshes of this.ribbonMeshMap.values()) {
      meshes.coreGeo.dispose()
      meshes.glowGeo.dispose()
      ;(meshes.coreMesh.material as THREE.Material).dispose()
      ;(meshes.glowMesh.material as THREE.Material).dispose()
    }
    this.ribbonMeshMap.clear()
    this.trailHistory.clear()

    if (this.sparksGeo) {
      this.sparksGeo.dispose()
      this.sparksGeo = null
    }

    if (this.sparksMesh) {
      ;(this.sparksMesh.material as THREE.Material).dispose()
      this.sparksMesh = null
    }

    this.trailsGroup = null
  }
}

export const universeLightTrailsRenderer = new UniverseLightTrailsRenderer()
