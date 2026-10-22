/**
 * IndiaTools — Floating Photo Universe 2.0
 * Procedural Deep Space Starfield, Nebula Galaxy & Custom Background Engine
 * Three.js Procedural Cosmos with Parallax & Texture Support
 */

import * as THREE from 'three'
import {
  UniverseBackgroundConfig,
  UniverseCustomBackground,
} from './photoUniverseTypes.ts'

export class UniverseBackgroundRenderer {
  private isClient: boolean
  private bgGroup: THREE.Group | null = null
  private starsMesh: THREE.Points | null = null
  private softStarsMesh: THREE.Points | null = null
  private nebulaGroup: THREE.Group | null = null
  private customBgMesh: THREE.Mesh | null = null
  private customTexture: THREE.Texture | null = null
  private lastCustomUrl: string | null = null

  constructor() {
    this.isClient = typeof window !== 'undefined'
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

    const bgType = config.type || 'deep-space'

    if (bgType === 'solid-dark') {
      // Solid/Dark minimalist background
      scene.background = new THREE.Color(0x04060d)
      scene.add(this.bgGroup)
      return
    }

    scene.background = new THREE.Color(0x02040a)

    // 1. Procedural Starfield (Thousands of subtle pinprick stars)
    if (bgType === 'deep-space' || bgType === 'minimal-starfield' || bgType === 'nebula-galaxy') {
      const starCount = bgType === 'minimal-starfield' ? 1000 : config.starCount || 2200
      const starGeo = new THREE.BufferGeometry()
      const starPos = new Float32Array(starCount * 3)
      const starColors = new Float32Array(starCount * 3)

      for (let i = 0; i < starCount; i++) {
        // Distribute on vast background dome
        starPos[i * 3] = (Math.random() - 0.5) * 6000
        starPos[i * 3 + 1] = (Math.random() - 0.5) * 4500
        starPos[i * 3 + 2] = -Math.random() * 3500 - 3000

        // Subtly varied star color temperatures (white, pale cyan, subtle amber)
        const temp = Math.random()
        if (temp > 0.8) {
          // Pale cyan
          starColors[i * 3] = 0.75
          starColors[i * 3 + 1] = 0.9
          starColors[i * 3 + 2] = 1.0
        } else if (temp < 0.15) {
          // Pale amber
          starColors[i * 3] = 1.0
          starColors[i * 3 + 1] = 0.88
          starColors[i * 3 + 2] = 0.7
        } else {
          // Pure white/silver
          starColors[i * 3] = 0.9
          starColors[i * 3 + 1] = 0.92
          starColors[i * 3 + 2] = 0.95
        }
      }

      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
      starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3))

      const starMat = new THREE.PointsMaterial({
        size: bgType === 'minimal-starfield' ? 2.5 : 3.0,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      })

      this.starsMesh = new THREE.Points(starGeo, starMat)
      this.bgGroup.add(this.starsMesh)

      // 2. Larger, softer glowing stars
      const softCount = 60
      const softGeo = new THREE.BufferGeometry()
      const softPos = new Float32Array(softCount * 3)
      for (let i = 0; i < softCount; i++) {
        softPos[i * 3] = (Math.random() - 0.5) * 5500
        softPos[i * 3 + 1] = (Math.random() - 0.5) * 3800
        softPos[i * 3 + 2] = -Math.random() * 3200 - 2800
      }
      softGeo.setAttribute('position', new THREE.BufferAttribute(softPos, 3))
      const softMat = new THREE.PointsMaterial({
        size: 7.0,
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
      })
      this.softStarsMesh = new THREE.Points(softGeo, softMat)
      this.bgGroup.add(this.softStarsMesh)
    }

    // 3. Procedural Nebula Clouds (Distant celestial gas gradients)
    if (bgType === 'deep-space' || bgType === 'nebula-galaxy') {
      this.nebulaGroup = new THREE.Group()

      const cloudColors =
        config.galaxyTint === 'mystic-violet'
          ? [0x3b0764, 0x1e1b4b, 0x4c1d95]
          : config.galaxyTint === 'amber-nebula'
          ? [0x78350f, 0x451a03, 0xb45309]
          : config.galaxyTint === 'emerald-deep'
          ? [0x064e3b, 0x022c22, 0x047857]
          : [0x0c2142, 0x1e1b4b, 0x172554] // default cosmic blue

      const cloudCount = bgType === 'nebula-galaxy' ? 6 : 4
      const glowScale = (config.nebulaGlow || 50) / 100

      for (let i = 0; i < cloudCount; i++) {
        const cloudGeo = new THREE.PlaneGeometry(2800, 2000)
        const cloudMat = new THREE.MeshBasicMaterial({
          color: cloudColors[i % cloudColors.length],
          transparent: true,
          opacity: (0.18 + (i % 2) * 0.08) * glowScale,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
        const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat)
        cloudMesh.position.set(
          (i - 1.5) * 1100,
          ((i % 2) - 0.5) * 700,
          -4800 - i * 150
        )
        cloudMesh.rotation.z = i * 0.45
        this.nebulaGroup.add(cloudMesh)
      }

      this.bgGroup.add(this.nebulaGroup)
    }

    // 4. Custom Background Image Plane
    if (bgType === 'custom-image' && config.customImage?.url) {
      this.setupCustomImagePlane(config.customImage)
    }

    scene.add(this.bgGroup)
  }

  /**
   * Set up custom user-uploaded background image quad
   */
  private setupCustomImagePlane(custom: UniverseCustomBackground): void {
    if (!this.bgGroup || !custom.url) return

    if (this.lastCustomUrl !== custom.url) {
      this.lastCustomUrl = custom.url
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        this.customTexture = new THREE.Texture(img)
        this.customTexture.needsUpdate = true
        this.customTexture.colorSpace = THREE.SRGBColorSpace

        const aspect = img.naturalWidth / img.naturalHeight
        let w = 7000
        let h = w / aspect
        if (custom.fitMode === 'contain') {
          h = 4200
          w = h * aspect
        }

        if (this.customBgMesh) {
          this.bgGroup?.remove(this.customBgMesh)
          this.customBgMesh.geometry.dispose()
          ;(this.customBgMesh.material as THREE.Material).dispose()
        }

        const geo = new THREE.PlaneGeometry(w, h)
        const brightness = (custom.brightness || 100) / 100
        const mat = new THREE.MeshBasicMaterial({
          map: this.customTexture,
          transparent: true,
          opacity: Math.min(1.0, brightness),
          depthWrite: false,
        })
        this.customBgMesh = new THREE.Mesh(geo, mat)
        this.customBgMesh.position.set(0, 0, -5200)
        this.bgGroup?.add(this.customBgMesh)
      }
      img.src = custom.url
    }
  }

  /**
   * Animate subtle background parallax drift
   */
  public update(cameraX: number, cameraY: number, currentTime: number): void {
    if (!this.bgGroup) return

    // Subtle gentle celestial drift
    if (this.starsMesh) {
      this.starsMesh.rotation.z = currentTime * 0.0012
      // Parallax follow
      this.starsMesh.position.x = cameraX * 0.08
      this.starsMesh.position.y = cameraY * 0.08
    }

    if (this.softStarsMesh) {
      this.softStarsMesh.rotation.z = -currentTime * 0.0008
      this.softStarsMesh.position.x = cameraX * 0.12
      this.softStarsMesh.position.y = cameraY * 0.12
    }

    if (this.nebulaGroup) {
      this.nebulaGroup.position.x = cameraX * 0.04
      this.nebulaGroup.position.y = cameraY * 0.04
    }

    if (this.customBgMesh) {
      this.customBgMesh.position.x = cameraX * 0.05
      this.customBgMesh.position.y = cameraY * 0.05
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

    if (this.nebulaGroup) {
      this.nebulaGroup.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose()
          ;(obj.material as THREE.Material)?.dispose()
        }
      })
      this.nebulaGroup = null
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
