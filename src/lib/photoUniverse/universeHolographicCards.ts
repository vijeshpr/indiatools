/**
 * IndiaTools — Floating Photo Universe
 * Holographic Memory Cards: Premium 3D Crystal-Glass Display Cards
 * View-Angle-Responsive Rainbow Edge Reflections & Specular Glass Sheens
 */

import * as THREE from 'three'
import {
  UniverseHolographicCardConfig,
  HolographicCardStyle,
  DEFAULT_UNIVERSE_HOLOGRAPHIC_CONFIG,
} from './photoUniverseTypes.ts'
import { PhotoSpatialNode } from './universeLayout.ts'
import { NormalizedAudioBands } from '../audioToVideo/types.ts'

export interface CachedPhotoAssets {
  texture: THREE.Texture
  blurredTexture: THREE.Texture
  img: HTMLImageElement
  aspectRatio: number
}

/**
 * Generates a smooth rounded rectangle 2D shape with exact corner radii
 */
export function createRoundedRectShape(
  width: number,
  height: number,
  radius: number
): THREE.Shape {
  const shape = new THREE.Shape()
  const r = Math.max(0, Math.min(radius, width / 2 - 1, height / 2 - 1))
  const x = -width / 2
  const y = -height / 2

  if (r <= 0.5) {
    shape.moveTo(x, y)
    shape.lineTo(x + width, y)
    shape.lineTo(x + width, y + height)
    shape.lineTo(x, y + height)
    shape.closePath()
    return shape
  }

  shape.moveTo(x + r, y)
  shape.lineTo(x + width - r, y)
  shape.quadraticCurveTo(x + width, y, x + width, y + r)
  shape.lineTo(x + width, y + height - r)
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  shape.lineTo(x + r, y + height)
  shape.quadraticCurveTo(x, y + height, x, y + height - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)
  shape.closePath()
  return shape
}

/**
 * Procedural Glass Sheen Specular Texture
 * Diagonal light falloff that glides across the crystal glass surface as angle changes
 */
let sharedSheenTexture: THREE.CanvasTexture | null = null

export function getSharedSheenTexture(): THREE.CanvasTexture {
  if (sharedSheenTexture) return sharedSheenTexture

  if (typeof document === 'undefined') {
    // SSR / Node test fallback
    return new THREE.Texture() as THREE.CanvasTexture
  }

  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 256, 256)
    grad.addColorStop(0.0, 'rgba(255, 255, 255, 0)')
    grad.addColorStop(0.38, 'rgba(255, 255, 255, 0.02)')
    grad.addColorStop(0.48, 'rgba(255, 255, 255, 0.45)')
    grad.addColorStop(0.52, 'rgba(255, 255, 255, 0.55)')
    grad.addColorStop(0.62, 'rgba(255, 255, 255, 0.03)')
    grad.addColorStop(1.0, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 256, 256)
  }

  sharedSheenTexture = new THREE.CanvasTexture(canvas)
  sharedSheenTexture.wrapS = THREE.ClampToEdgeWrapping
  sharedSheenTexture.wrapT = THREE.ClampToEdgeWrapping
  return sharedSheenTexture
}

/**
 * Calculates spectral rainbow colors modulated by relative viewing angle & card style
 */
export function calculateHoloSpectralColor(
  style: HolographicCardStyle,
  viewAngleYaw: number,
  currentTime: number,
  spectrumIntensity: number
): {
  glassBaseColor: number
  outerBevelColor: THREE.Color
  innerBevelColor: THREE.Color
  sheenTint: THREE.Color
} {
  const intensity = Math.max(0, Math.min(1.0, spectrumIntensity / 100))
  // Cycle spectral hue between 0 and 1 based on viewing angle & slow atmospheric drift
  const angleShift = (viewAngleYaw / (Math.PI * 1.5)) * 0.4
  const timeShift = (currentTime * 0.05) % 1.0
  const phase = (Math.abs(angleShift + timeShift) * 1.0) % 1.0

  if (style === 'aurora-glass') {
    // Ethereal Emerald, Teal, Violet & Rose pink
    const auroraGreen = new THREE.Color(0x10b981)
    const auroraTeal = new THREE.Color(0x06b6d4)
    const auroraViolet = new THREE.Color(0xa855f7)
    const auroraRose = new THREE.Color(0xf43f5e)

    let bevel = new THREE.Color()
    if (phase < 0.33) {
      bevel.copy(auroraGreen).lerp(auroraTeal, phase / 0.33)
    } else if (phase < 0.66) {
      bevel.copy(auroraTeal).lerp(auroraViolet, (phase - 0.33) / 0.33)
    } else {
      bevel.copy(auroraViolet).lerp(auroraRose, (phase - 0.66) / 0.34)
    }

    // Blend with default base aurora color based on spectrum intensity
    bevel.lerp(auroraViolet, 1.0 - intensity * 0.7)

    return {
      glassBaseColor: 0x120822, // Deep amethyst glass tint
      outerBevelColor: bevel,
      innerBevelColor: new THREE.Color(0xc084fc),
      sheenTint: new THREE.Color(0xf5d0fe),
    }
  }

  if (style === 'silver-prism') {
    // Platinum silver, pale gold & cool diamond steel
    const platWhite = new THREE.Color(0xffffff)
    const paleGold = new THREE.Color(0xfef08a)
    const diamondSteel = new THREE.Color(0x94a3b8)
    const prismCyan = new THREE.Color(0x38bdf8)

    let bevel = new THREE.Color()
    if (phase < 0.5) {
      bevel.copy(diamondSteel).lerp(platWhite, phase / 0.5)
    } else {
      bevel.copy(platWhite).lerp(paleGold, (phase - 0.5) / 0.5)
    }

    if (intensity > 0.4) {
      bevel.lerp(prismCyan, (intensity - 0.4) * 0.5)
    }

    return {
      glassBaseColor: 0x0f172a, // Platinum tinted dark glass
      outerBevelColor: bevel,
      innerBevelColor: new THREE.Color(0xe2e8f0),
      sheenTint: new THREE.Color(0xffffff),
    }
  }

  if (style === 'minimal-glass') {
    // Clean transparent frosted glass with subtle optical highlight
    return {
      glassBaseColor: 0x090d16,
      outerBevelColor: new THREE.Color(0xe0f2fe),
      innerBevelColor: new THREE.Color(0x94a3b8),
      sheenTint: new THREE.Color(0xffffff),
    }
  }

  // Default: 'crystal-glass' — Cosmic Diamond Cyan & Violet Prism
  const cyan = new THREE.Color(0x00f0ff)
  const azure = new THREE.Color(0x38bdf8)
  const violet = new THREE.Color(0x818cf8)
  const magenta = new THREE.Color(0xd946ef)

  let bevel = new THREE.Color()
  if (phase < 0.33) {
    bevel.copy(cyan).lerp(azure, phase / 0.33)
  } else if (phase < 0.66) {
    bevel.copy(azure).lerp(violet, (phase - 0.33) / 0.33)
  } else {
    bevel.copy(violet).lerp(magenta, (phase - 0.66) / 0.34)
  }

  bevel.lerp(cyan, 1.0 - intensity * 0.75)

  return {
    glassBaseColor: 0x061526, // Deep sapphire cyan crystal tint
    outerBevelColor: bevel,
    innerBevelColor: new THREE.Color(0x38bdf8),
    sheenTint: new THREE.Color(0xe0f2fe),
  }
}

export class UniverseHolographicCardsManager {
  /**
   * Builds the complete 3D Holographic Card assembly inside a photo group
   */
  public buildCardHierarchy(
    group: THREE.Group,
    node: PhotoSpatialNode,
    config: UniverseHolographicCardConfig = DEFAULT_UNIVERSE_HOLOGRAPHIC_CONFIG,
    asset: CachedPhotoAssets | null
  ): void {
    // Clear any previous child meshes
    while (group.children.length > 0) {
      const child = group.children[0]
      group.remove(child)
      if ('geometry' in child) (child as THREE.Mesh).geometry.dispose()
      if ('material' in child) {
        const mat = (child as THREE.Mesh).material
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
        else mat.dispose()
      }
    }

    const margin = Math.round(Math.max(14, Math.min(26, node.worldWidth * 0.055)))
    const chassisWidth = node.worldWidth + margin * 2
    const chassisHeight = node.worldHeight + margin * 2
    const cornerRadius = Math.max(0, Math.min(config.cornerRadius, margin * 1.4, 32))

    // 1. Transparent Crystal Glass Chassis (Outer Body)
    const chassisShape = createRoundedRectShape(chassisWidth, chassisHeight, cornerRadius)
    const chassisGeo = new THREE.ShapeGeometry(chassisShape, 16)
    const chassisMat = new THREE.MeshBasicMaterial({
      color: 0x061526,
      transparent: true,
      opacity: (100 - config.glassTransparency) / 100 * 0.45 + 0.12,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    const glassChassisMesh = new THREE.Mesh(chassisGeo, chassisMat)
    glassChassisMesh.name = 'glassChassisMesh'
    glassChassisMesh.position.z = -0.06
    group.add(glassChassisMesh)

    // 2. Outer Luminous Holographic Bevel Rim (Perimeter Line Loop)
    const outerPoints = chassisShape.getPoints(28)
    const outerBevelGeo = new THREE.BufferGeometry().setFromPoints(outerPoints)
    const outerBevelMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: (config.edgeReflectionIntensity / 100) * 0.75 + 0.2,
      linewidth: 1,
    })
    const outerBevelLine = new THREE.LineLoop(outerBevelGeo, outerBevelMat)
    outerBevelLine.name = 'outerBevelLine'
    outerBevelLine.position.z = -0.02
    group.add(outerBevelLine)

    // 3. Central Photo Quad (Contain or Cover)
    let photoW = node.worldWidth
    let photoH = node.worldHeight

    if (config.photoFit === 'contain' && node.photo.aspectRatio) {
      const targetAspect = node.photo.aspectRatio
      const apertureAspect = node.worldWidth / node.worldHeight
      if (targetAspect > apertureAspect) {
        photoW = node.worldWidth
        photoH = node.worldWidth / targetAspect
      } else {
        photoH = node.worldHeight
        photoW = node.worldHeight * targetAspect
      }
    }

    const photoRadius = Math.max(0, cornerRadius - 4)
    const photoShape = createRoundedRectShape(photoW, photoH, photoRadius)
    const photoGeo = new THREE.ShapeGeometry(photoShape, 16)
    const photoMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: asset?.texture || null,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1.0,
      depthWrite: true,
    })
    const photoMesh = new THREE.Mesh(photoGeo, photoMat)
    photoMesh.name = 'photoMesh'
    photoMesh.position.z = 0.0
    group.add(photoMesh)

    // 4. Inner Glass Bevel Frame (Seam around the photo aperture)
    const innerPoints = photoShape.getPoints(24)
    const innerBevelGeo = new THREE.BufferGeometry().setFromPoints(innerPoints)
    const innerBevelMat = new THREE.LineLoop(
      innerBevelGeo,
      new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.45,
      })
    )
    innerBevelMat.name = 'innerBevelLine'
    innerBevelMat.position.z = 0.02
    group.add(innerBevelMat)

    // 5. Specular Glass Sheen Overlay (Angle-Responsive Highlight)
    const sheenTexture = getSharedSheenTexture()
    const sheenMat = new THREE.MeshBasicMaterial({
      map: sheenTexture,
      color: 0xffffff,
      transparent: true,
      opacity: (config.edgeReflectionIntensity / 100) * 0.18 + 0.05,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    const glassSheenMesh = new THREE.Mesh(chassisGeo, sheenMat)
    glassSheenMesh.name = 'glassSheenMesh'
    glassSheenMesh.position.z = 0.04
    group.add(glassSheenMesh)

    // 6. Glowing Focus Rim Mesh (Highlights smoothly only when photo is active subject)
    const focusRimGeo = new THREE.ShapeGeometry(
      createRoundedRectShape(chassisWidth + 6, chassisHeight + 6, cornerRadius + 3),
      16
    )
    const focusRimMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const rimMesh = new THREE.Mesh(focusRimGeo, focusRimMat)
    rimMesh.name = 'rimMesh'
    rimMesh.position.z = -0.07
    group.add(rimMesh)
  }

  /**
   * Updates card reflections, view-angle specular sheen, and audio reactivity per frame
   */
  public updateCard(
    group: THREE.Group,
    node: PhotoSpatialNode,
    config: UniverseHolographicCardConfig,
    camera: THREE.PerspectiveCamera,
    bands: NormalizedAudioBands | undefined,
    currentTime: number,
    isCurrentTarget: boolean,
    focusWeight: number
  ): void {
    const glassChassisMesh = group.getObjectByName('glassChassisMesh') as THREE.Mesh | undefined
    const outerBevelLine = group.getObjectByName('outerBevelLine') as THREE.LineLoop | undefined
    const innerBevelLine = group.getObjectByName('innerBevelLine') as THREE.LineLoop | undefined
    const glassSheenMesh = group.getObjectByName('glassSheenMesh') as THREE.Mesh | undefined
    const rimMesh = group.getObjectByName('rimMesh') as THREE.Mesh | undefined

    if (!config.enabled) {
      // If holographic cards disabled, hide glass chassis, sheen & inner bevels
      if (glassChassisMesh) glassChassisMesh.visible = false
      if (glassSheenMesh) glassSheenMesh.visible = false
      if (innerBevelLine) innerBevelLine.visible = false
      return
    }

    if (glassChassisMesh) glassChassisMesh.visible = true
    if (glassSheenMesh) glassSheenMesh.visible = true
    if (innerBevelLine) innerBevelLine.visible = true

    // 1. Calculate relative viewing angle between camera & this card
    const cardPos = group.position
    const dx = camera.position.x - cardPos.x
    const dy = camera.position.y - cardPos.y
    const dz = camera.position.z - cardPos.z
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

    const viewAngleYaw = config.angleResponsive ? Math.atan2(dx, Math.max(1, dz)) : 0
    const viewAnglePitch = config.angleResponsive ? Math.atan2(dy, Math.max(1, dist)) : 0

    // 2. Audio Treble & Beat Reactivity (Subtle & Tasteful)
    let audioBoost = 0
    if (bands && config.musicReactivity !== 'off') {
      const scale = config.musicReactivity === 'balanced' ? 0.28 : 0.14
      audioBoost = (bands.treble || 0) * scale + (bands.isBeatHit ? scale * 0.45 : 0)
    }

    // 3. Spectral Rainbow & Style Colors
    const colors = calculateHoloSpectralColor(
      config.cardStyle,
      viewAngleYaw,
      currentTime,
      config.rainbowSpectrumIntensity
    )

    // 4. Update Glass Chassis Material
    if (glassChassisMesh) {
      const chassisMat = glassChassisMesh.material as THREE.MeshBasicMaterial
      chassisMat.color.setHex(colors.glassBaseColor)
      const baseGlassOpacity =
        (100 - config.glassTransparency) / 100 * 0.45 + 0.10
      chassisMat.opacity = Math.max(0.06, Math.min(0.70, baseGlassOpacity + audioBoost * 0.1))
    }

    // 5. Update Outer Bevel Rainbow Line
    if (outerBevelLine) {
      const bevelMat = outerBevelLine.material as THREE.LineBasicMaterial
      bevelMat.color.copy(colors.outerBevelColor)
      const baseBevel = (config.edgeReflectionIntensity / 100) * 0.70 + 0.20
      bevelMat.opacity = Math.max(0.15, Math.min(1.0, baseBevel + audioBoost))
    }

    // 6. Update Inner Bevel Frame
    if (innerBevelLine) {
      const innerMat = innerBevelLine.material as THREE.LineBasicMaterial
      innerMat.color.copy(colors.innerBevelColor)
      innerMat.opacity = Math.max(0.2, Math.min(0.85, 0.45 + audioBoost * 0.5))
    }

    // 7. Update View-Angle Specular Sheen (Glides across card face as camera moves)
    if (glassSheenMesh) {
      const sheenMat = glassSheenMesh.material as THREE.MeshBasicMaterial
      sheenMat.color.copy(colors.sheenTint)

      // Horizontal and vertical shift according to viewing angle
      const margin = Math.round(Math.max(14, Math.min(26, node.worldWidth * 0.055)))
      const chassisWidth = node.worldWidth + margin * 2
      const chassisHeight = node.worldHeight + margin * 2

      if (config.angleResponsive) {
        glassSheenMesh.position.x = Math.sin(viewAngleYaw * 1.6) * (chassisWidth * 0.14)
        glassSheenMesh.position.y = -Math.sin(viewAnglePitch * 1.6) * (chassisHeight * 0.12)
      } else {
        glassSheenMesh.position.x = 0
        glassSheenMesh.position.y = 0
      }

      const baseSheen = (config.edgeReflectionIntensity / 100) * 0.18 + 0.04
      sheenMat.opacity = Math.max(0.03, Math.min(0.40, baseSheen + audioBoost * 0.2))
    }

    // 8. Focus Hero Rim Highlight (Pulsates smoothly on the focused subject)
    if (rimMesh) {
      const rimMat = rimMesh.material as THREE.MeshBasicMaterial
      rimMat.color.copy(colors.outerBevelColor)
      const targetOpacity = isCurrentTarget ? focusWeight * 0.85 : 0
      rimMat.opacity += (targetOpacity - rimMat.opacity) * 0.2
    }
  }

  /**
   * Cleans up allocated textures and geometries
   */
  public dispose(): void {
    if (sharedSheenTexture) {
      sharedSheenTexture.dispose()
      sharedSheenTexture = null
    }
  }
}

export const universeHolographicCards = new UniverseHolographicCardsManager()
