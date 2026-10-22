/**
 * IndiaTools — Floating Photo Universe
 * 3D WebGL / Three.js Cinematic Rendering Engine
 * Floating Photo Windows, Realistic Depth-of-Field Blur, Signature Camera Flight & Bass Shake
 */

import * as THREE from 'three'
import { NormalizedAudioBands } from '../audioToVideo/types.ts'
import {
  PhotoUniverseStudioConfig,
  DEFAULT_PHOTO_UNIVERSE_CONFIG,
} from './photoUniverseTypes.ts'
import {
  generateUniverseSpatialNodes,
  PhotoSpatialNode,
} from './universeLayout.ts'
import { universeBeatDetector } from './universeBeatDetector.ts'
import { universeCameraDirector } from './universeCameraDirector.ts'

interface CachedPhotoAssets {
  texture: THREE.Texture
  blurredTexture: THREE.Texture
  img: HTMLImageElement
  aspectRatio: number
}

export class PhotoUniverseEngine {
  private isClient: boolean
  private renderer: THREE.WebGLRenderer | null = null
  private scene: THREE.Scene | null = null
  private camera: THREE.PerspectiveCamera | null = null
  private particlesMesh: THREE.Points | null = null
  private lightStreaksMesh: THREE.LineSegments | null = null

  // Mesh maps & Node cache
  private photoMeshMap: Map<string, THREE.Group> = new Map()
  private assetCache: Map<string, CachedPhotoAssets> = new Map()
  private currentNodes: PhotoSpatialNode[] = []
  private lastPhotoConfigKey: string = ''

  // Offscreen auxiliary canvas for Three.js WebGL context
  private webglCanvas: HTMLCanvasElement | null = null

  constructor() {
    this.isClient = typeof window !== 'undefined'
    if (this.isClient) {
      this.initThree()
    }
  }

  /**
   * Initialize Three.js scene, camera, lights, and WebGL renderer
   */
  private initThree(): void {
    if (!this.isClient || this.scene) return

    try {
      this.webglCanvas = document.createElement('canvas')
      this.webglCanvas.width = 1280
      this.webglCanvas.height = 720

      this.scene = new THREE.Scene()
      this.scene.fog = new THREE.FogExp2(0x050814, 0.00045)

      // Cinematic camera with standard 50° vertical FOV
      this.camera = new THREE.PerspectiveCamera(50, 16 / 9, 1, 8000)
      this.camera.position.set(0, 20, 600)

      // Ambient illumination
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.95)
      this.scene.add(ambientLight)

      // Directional key light with cinematic cyan tint
      const keyLight = new THREE.DirectionalLight(0x00f0ff, 1.2)
      keyLight.position.set(400, 600, 800)
      this.scene.add(keyLight)

      // Warm rim fill light
      const fillLight = new THREE.DirectionalLight(0xffa060, 0.7)
      fillLight.position.set(-500, -300, -600)
      this.scene.add(fillLight)

      // WebGL Renderer with alpha and antialiasing
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.webglCanvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true,
      })
      this.renderer.setSize(1280, 720, false)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      this.renderer.outputColorSpace = THREE.SRGBColorSpace

      // Initialize ambient particles
      this.initParticles()
    } catch (e) {
      console.warn('WebGL initialization failed in PhotoUniverseEngine:', e)
    }
  }

  /**
   * Create atmospheric dust / stardust particles
   */
  private initParticles(): void {
    if (!this.scene) return

    const particleCount = 140
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const scales = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2600
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1600
      positions[i * 3 + 2] = -Math.random() * 3200 + 400
      scales[i] = Math.random() * 4 + 2
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1))

    const material = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 4,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    })

    this.particlesMesh = new THREE.Points(geometry, material)
    this.scene.add(this.particlesMesh)
  }

  /**
   * Generate high-res crisp and softened blurred textures for Realistic Depth-of-Field
   */
  private generateTextures(
    img: HTMLImageElement,
    url: string
  ): { texture: THREE.Texture; blurredTexture: THREE.Texture; aspectRatio: number } {
    const aspect =
      img.naturalWidth > 0 && img.naturalHeight > 0
        ? img.naturalWidth / img.naturalHeight
        : 16 / 9

    // Crisp standard texture
    const texture = new THREE.Texture(img)
    texture.needsUpdate = true
    texture.colorSpace = THREE.SRGBColorSpace
    texture.generateMipmaps = true
    texture.minFilter = THREE.LinearMipmapLinearFilter

    // Blurred texture for realistic optical depth of field
    let blurredTexture: THREE.Texture = texture
    if (this.isClient && typeof document !== 'undefined') {
      try {
        const blurCanvas = document.createElement('canvas')
        const maxW = 512
        const maxH = Math.round(maxW / aspect)
        blurCanvas.width = maxW
        blurCanvas.height = maxH
        const bCtx = blurCanvas.getContext('2d')
        if (bCtx) {
          bCtx.filter = 'blur(10px)'
          bCtx.drawImage(img, 0, 0, maxW, maxH)
          bCtx.filter = 'none'
          blurredTexture = new THREE.CanvasTexture(blurCanvas)
          blurredTexture.colorSpace = THREE.SRGBColorSpace
          blurredTexture.generateMipmaps = true
        }
      } catch {
        blurredTexture = texture
      }
    }

    return { texture, blurredTexture, aspectRatio: aspect }
  }

  /**
   * Preload photo asset or retrieve from cache
   */
  public getOrLoadAsset(url: string): CachedPhotoAssets | null {
    if (!this.isClient || !url) return null
    if (this.assetCache.has(url)) {
      return this.assetCache.get(url)!
    }

    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = url
      img.onload = () => {
        const { texture, blurredTexture, aspectRatio } = this.generateTextures(img, url)
        this.assetCache.set(url, { texture, blurredTexture, img, aspectRatio })
      }
      return null
    } catch {
      return null
    }
  }

  /**
   * Synchronize 3D meshes in the scene with current spatial nodes
   */
  private syncPhotoMeshes(
    nodes: PhotoSpatialNode[],
    config: PhotoUniverseStudioConfig
  ): void {
    if (!this.scene) return

    const activeIds = new Set<string>()

    for (const node of nodes) {
      const photo = node.photo
      activeIds.add(photo.id)

      let group = this.photoMeshMap.get(photo.id)

      // Create new group if not present
      if (!group) {
        group = new THREE.Group()

        // 1. Backplane frame (elegant matte dark border)
        const frameGeo = new THREE.PlaneGeometry(node.worldWidth + 14, node.worldHeight + 14)
        const frameMat = new THREE.MeshBasicMaterial({
          color: 0x090d16,
          side: THREE.DoubleSide,
        })
        const frameMesh = new THREE.Mesh(frameGeo, frameMat)
        frameMesh.position.z = -0.5
        group.add(frameMesh)

        // 2. Photo Surface Quad
        const photoGeo = new THREE.PlaneGeometry(node.worldWidth, node.worldHeight)
        const asset = this.getOrLoadAsset(photo.url)
        const photoMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          map: asset?.texture || null,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 1.0,
        })
        const photoMesh = new THREE.Mesh(photoGeo, photoMat)
        photoMesh.name = 'photoMesh'
        group.add(photoMesh)

        // 3. Glowing focus rim border (lights up when approaching focus)
        const rimGeo = new THREE.PlaneGeometry(node.worldWidth + 8, node.worldHeight + 8)
        const rimMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(config.visualDetails.edgeGlowColor || '#00F0FF'),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0,
        })
        const rimMesh = new THREE.Mesh(rimGeo, rimMat)
        rimMesh.name = 'rimMesh'
        rimMesh.position.z = -0.2
        group.add(rimMesh)

        this.scene.add(group)
        this.photoMeshMap.set(photo.id, group)
      }

      // Update position and base rotation
      group.position.set(node.position.x, node.position.y, node.position.z)
      group.rotation.set(node.rotation.x, node.rotation.y, node.rotation.z)

      // Ensure texture is applied once loaded
      const photoMesh = group.getObjectByName('photoMesh') as THREE.Mesh | undefined
      if (photoMesh) {
        const mat = photoMesh.material as THREE.MeshBasicMaterial
        if (!mat.map) {
          const asset = this.getOrLoadAsset(photo.url)
          if (asset?.texture) {
            mat.map = asset.texture
            mat.needsUpdate = true
          }
        }
      }
    }

    // Remove meshes for photos no longer in collection
    for (const [id, group] of this.photoMeshMap.entries()) {
      if (!activeIds.has(id)) {
        this.scene.remove(group)
        this.photoMeshMap.delete(id)
      }
    }
  }

  /**
   * Master Render Loop
   * Called on every animation frame by audioToVideoRenderEngine
   */
  public render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: PhotoUniverseStudioConfig = DEFAULT_PHOTO_UNIVERSE_CONFIG,
    bands: NormalizedAudioBands | undefined,
    currentTime: number,
    _duration: number
  ): void {
    if (!this.isClient || !ctx) return

    // 1. Ensure WebGL Renderer matches output canvas dimensions
    if (
      this.renderer &&
      this.webglCanvas &&
      (this.webglCanvas.width !== width || this.webglCanvas.height !== height)
    ) {
      this.webglCanvas.width = width
      this.webglCanvas.height = height
      this.renderer.setSize(width, height, false)
      if (this.camera) {
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
      }
    }

    // 2. Spatial Node Generation (cached or updated when photos/spread changes)
    const configKey = `${config.photos.length}_${config.spaceSpread}_${config.depthRange}_${config.photoScale}`
    if (configKey !== this.lastPhotoConfigKey || this.currentNodes.length !== config.photos.length) {
      this.currentNodes = generateUniverseSpatialNodes(
        config.photos,
        config.spaceSpread,
        config.depthRange,
        config.photoScale
      )
      this.lastPhotoConfigKey = configKey
    }

    // Synchronize 3D meshes
    this.syncPhotoMeshes(this.currentNodes, config)

    // 3. Audio Signal Processing & Transient Impulses
    const audioState = universeBeatDetector.process(
      bands,
      currentTime,
      config.bassShake.bassSensitivity,
      config.bassShake.shakeIntensity,
      config.bassShake.durationSec,
      config.bassShake.maxDisplacementPx,
      config.musicReactive
    )

    // 4. Cinematic Camera Director Evaluation
    const cameraState = universeCameraDirector.evaluateCamera(
      this.currentNodes,
      currentTime,
      config.cameraStyle,
      config.cameraSpeed,
      config.photoFocusDuration,
      config.transitionSmoothness,
      audioState.speedMultiplier,
      config.directorMode,
      config.manualOrder
    )

    // 5. Apply Camera Position + LookAt + Bass Shake
    if (this.camera) {
      const shake = config.bassShake.enabled ? audioState.shakeOffset : { x: 0, y: 0, z: 0, pitch: 0, roll: 0 }

      this.camera.position.set(
        cameraState.position.x + shake.x,
        cameraState.position.y + shake.y,
        cameraState.position.z + shake.z
      )

      this.camera.lookAt(
        cameraState.lookAt.x + shake.x * 0.4,
        cameraState.lookAt.y + shake.y * 0.4,
        cameraState.lookAt.z
      )

      // Subtle camera roll / pitch micro-accent from bass
      this.camera.rotation.z += shake.roll
      this.camera.rotation.x += shake.pitch
    }

    // 6. Realistic Depth-of-Field Blur & Physical Photo Impulses
    const focusPlane = cameraState.focusDistance
    const dofMode = config.depthOfField
    const dofSpread = dofMode === 'strong' ? 280 : dofMode === 'cinematic' ? 440 : dofMode === 'subtle' ? 800 : 99999

    for (let i = 0; i < this.currentNodes.length; i++) {
      const node = this.currentNodes[i]
      const group = this.photoMeshMap.get(node.photo.id)
      if (!group || !this.camera) continue

      // Physical distance from camera
      const dx = node.position.x - this.camera.position.x
      const dy = node.position.y - this.camera.position.y
      const dz = node.position.z - this.camera.position.z
      const distToCamera = Math.sqrt(dx * dx + dy * dy + dz * dz)

      // Distance difference from focus plane
      const deltaFocus = Math.abs(distToCamera - focusPlane)
      const blurFactor = dofMode === 'off' ? 0 : Math.min(1.0, deltaFocus / dofSpread)

      // Physical reaction on nearby photos during strong bass hits
      if (config.bassShake.enabled && config.bassShake.nearbyPhotoReaction && audioState.isBassImpact) {
        const proximity = Math.max(0, 1.0 - distToCamera / 900)
        const impulseTilt = audioState.bassImpactStrength * proximity * 0.08
        group.rotation.x = node.rotation.x + Math.sin(currentTime * 24) * impulseTilt
        group.rotation.y = node.rotation.y + Math.cos(currentTime * 24) * impulseTilt
      } else {
        // Smoothly settle back to base orientation
        group.rotation.x += (node.rotation.x - group.rotation.x) * 0.15
        group.rotation.y += (node.rotation.y - group.rotation.y) * 0.15
      }

      // Material Depth-of-Field texture swapping & focus rim highlight
      const photoMesh = group.getObjectByName('photoMesh') as THREE.Mesh | undefined
      const rimMesh = group.getObjectByName('rimMesh') as THREE.Mesh | undefined
      const asset = this.getOrLoadAsset(node.photo.url)

      if (photoMesh && asset) {
        const mat = photoMesh.material as THREE.MeshBasicMaterial
        // Swap to blurred texture when substantially out of focus
        if (blurFactor > 0.45 && asset.blurredTexture) {
          if (mat.map !== asset.blurredTexture) {
            mat.map = asset.blurredTexture
            mat.needsUpdate = true
          }
        } else {
          if (mat.map !== asset.texture) {
            mat.map = asset.texture
            mat.needsUpdate = true
          }
        }

        // Slight atmospheric opacity drop for deep background photos
        mat.opacity = 1.0 - Math.min(0.4, blurFactor * 0.45)
      }

      // Focus rim light
      if (rimMesh) {
        const rimMat = rimMesh.material as THREE.MeshBasicMaterial
        const isCurrentTarget = i === cameraState.targetNodeIndex
        const targetOpacity =
          isCurrentTarget && config.visualDetails.edgeLightingEnabled
            ? cameraState.focusWeight * 0.85
            : 0
        rimMat.opacity += (targetOpacity - rimMat.opacity) * 0.18
      }
    }

    // 7. Ambient Particle Movement
    if (this.particlesMesh && config.visualDetails.particlesEnabled) {
      this.particlesMesh.visible = true
      const positions = this.particlesMesh.geometry.attributes.position.array as Float32Array
      const count = positions.length / 3
      const speed = 0.5 * audioState.particleSpeedScale

      for (let i = 0; i < count; i++) {
        // Drift forward slightly toward camera
        positions[i * 3 + 2] += speed
        if (positions[i * 3 + 2] > 600) {
          positions[i * 3 + 2] = -2600
        }
      }
      this.particlesMesh.geometry.attributes.position.needsUpdate = true
    } else if (this.particlesMesh) {
      this.particlesMesh.visible = false
    }

    // 8. Render Three.js Scene into WebGL Canvas
    if (this.renderer && this.scene && this.camera && this.webglCanvas) {
      this.renderer.render(this.scene, this.camera)

      // 9. Composite WebGL scene onto 2D Studio Canvas
      ctx.save()
      ctx.drawImage(this.webglCanvas, 0, 0, width, height)

      // 10. Optional Cinematic Vignette Overlay
      if (config.visualDetails.vignetteEnabled) {
        const strength = (config.visualDetails.vignetteStrength || 45) / 100
        const radius = Math.max(width, height) * 0.72
        const grad = ctx.createRadialGradient(
          width / 2,
          height / 2,
          radius * 0.35,
          width / 2,
          height / 2,
          radius
        )
        grad.addColorStop(0, 'rgba(0,0,0,0)')
        grad.addColorStop(1, `rgba(0,0,0,${0.65 * strength})`)
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, width, height)
      }

      ctx.restore()
    }
  }

  /**
   * Release WebGL contexts, geometries, textures and memory
   */
  public dispose(): void {
    if (!this.isClient) return

    for (const group of this.photoMeshMap.values()) {
      group.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose()
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose())
          } else {
            obj.material?.dispose()
          }
        }
      })
      this.scene?.remove(group)
    }
    this.photoMeshMap.clear()

    for (const asset of this.assetCache.values()) {
      asset.texture.dispose()
      if (asset.blurredTexture !== asset.texture) {
        asset.blurredTexture.dispose()
      }
    }
    this.assetCache.clear()

    if (this.particlesMesh) {
      this.particlesMesh.geometry.dispose()
      ;(this.particlesMesh.material as THREE.Material).dispose()
      this.scene?.remove(this.particlesMesh)
      this.particlesMesh = null
    }

    this.renderer?.dispose()
    this.renderer = null
    this.scene = null
    this.camera = null
    this.webglCanvas = null
  }
}

export const photoUniverseEngine = new PhotoUniverseEngine()
