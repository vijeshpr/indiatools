/**
 * IndiaTools — Floating Photo Universe 2.0
 * Film Reel Journey: Continuous 35mm Celluloid Film Strip & Vintage Projector Studio
 * Continuous 3D Ribbon Geometry, Sprocket Perforations, Volumetric Light & Smooth Camera Travel
 */

import * as THREE from 'three'
import {
  FilmStripPathStyle,
  UniverseFilmReelConfig,
  DEFAULT_UNIVERSE_FILM_REEL_CONFIG,
  UniversePhoto,
} from './photoUniverseTypes.ts'
import { PhotoSpatialNode, Position3D } from './universeLayout.ts'
import { CameraFrameState } from './universeCameraDirector.ts'
import { NormalizedAudioBands } from '../audioToVideo/types.ts'

export interface FilmStripStation {
  photoIndex: number
  photoId: string
  t: number // [0, 1] parameter along spline
  position: THREE.Vector3
  tangent: THREE.Vector3
  normal: THREE.Vector3
  binormal: THREE.Vector3
  rotation: THREE.Euler
}

export class UniverseFilmReelManager {
  private isClient: boolean
  private ribbonMesh: THREE.Mesh | null = null
  private ribbonGeometry: THREE.BufferGeometry | null = null
  private ribbonMaterial: THREE.MeshBasicMaterial | null = null
  private celluloidTexture: THREE.CanvasTexture | null = null

  // Projector Volumetric Cone
  private projectorConeMesh: THREE.Mesh | null = null
  private projectorLight: THREE.PointLight | null = null

  // Dust motes inside projector beam
  private dustPointsMesh: THREE.Points | null = null

  // Cache & Spline Curves
  private splineCurve: THREE.CatmullRomCurve3 | null = null
  private stations: FilmStripStation[] = []
  private cachedNodeCount: number = 0
  private cachedPathStyle: FilmStripPathStyle = 's-curve'
  private lastTextureKey: string = ''

  // Film Grain Noise Cache for 2D Canvas Post-Processing
  private grainCanvas: HTMLCanvasElement | null = null
  private grainCtx: CanvasRenderingContext2D | null = null

  constructor() {
    this.isClient = typeof window !== 'undefined'
  }

  /**
   * Generates or retrieves the procedural 35mm celluloid film strip texture
   * with authentic sprocket perforations, frame lines, and edge markings.
   */
  public getOrCreateCelluloidTexture(
    warmth: number = 70,
    translucency: number = 85,
    sprocketDetail: 'classic-35mm' | 'wide-cinema' = 'classic-35mm',
    colorGrade: string = 'warm-amber',
    sprocketGlow: number = 50,
    frameDividersEnabled: boolean = true
  ): THREE.CanvasTexture | null {
    if (!this.isClient || typeof document === 'undefined') return null

    const key = `${warmth}_${translucency}_${sprocketDetail}_${colorGrade}_${sprocketGlow}_${frameDividersEnabled}`
    if (this.celluloidTexture && this.lastTextureKey === key) {
      return this.celluloidTexture
    }

    try {
      const W = 1024
      const H = 256
      const canvas = document.createElement('canvas')
      canvas.width = W
      canvas.height = H
      const ctx = canvas.getContext('2d')
      if (!ctx) return null

      // Clear transparent
      ctx.clearRect(0, 0, W, H)

      // 1. Vintage Translucent Celluloid Body
      const warmthNorm = warmth / 100
      let r = Math.round(18 + warmthNorm * 22)
      let g = Math.round(14 + warmthNorm * 12)
      let b = Math.round(10 + warmthNorm * 4)

      if (colorGrade === 'noir-monochrome') {
        r = 18
        g = 18
        b = 20
      } else if (colorGrade === 'vintage-sepia') {
        r = Math.round(26 + warmthNorm * 18)
        g = Math.round(17 + warmthNorm * 10)
        b = 10
      } else if (colorGrade === 'classic-technicolor') {
        r = Math.round(24 + warmthNorm * 20)
        g = Math.round(12 + warmthNorm * 14)
        b = Math.round(14 + warmthNorm * 6)
      }

      const alpha = Math.min(0.96, Math.max(0.65, translucency / 100))

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
      ctx.fillRect(0, 0, W, H)

      // Celluloid subtle horizontal sheen
      const sheenGrad = ctx.createLinearGradient(0, 0, 0, H)
      const sheenHighlight = colorGrade === 'noir-monochrome' ? 'rgba(220, 230, 245, 0.12)' : 'rgba(255, 230, 180, 0.12)'
      sheenGrad.addColorStop(0, sheenHighlight)
      sheenGrad.addColorStop(0.12, 'rgba(0, 0, 0, 0.15)')
      sheenGrad.addColorStop(0.5, colorGrade === 'noir-monochrome' ? 'rgba(200, 210, 230, 0.04)' : 'rgba(255, 215, 120, 0.04)')
      sheenGrad.addColorStop(0.88, 'rgba(0, 0, 0, 0.15)')
      sheenGrad.addColorStop(1, sheenHighlight)
      ctx.fillStyle = sheenGrad
      ctx.fillRect(0, 0, W, H)

      // 2. Margins and Sprocket Hole Perforations
      const marginH = 44
      const holeW = 18
      const holeH = 24
      const holeRadius = 4
      const holePitch = sprocketDetail === 'wide-cinema' ? 48 : 32
      const numHoles = Math.floor(W / holePitch)

      // Helper to draw rounded rectangle perforation
      const drawRoundedPerforation = (x: number, y: number) => {
        ctx.beginPath()
        ctx.moveTo(x + holeRadius, y)
        ctx.lineTo(x + holeW - holeRadius, y)
        ctx.quadraticCurveTo(x + holeW, y, x + holeW, y + holeRadius)
        ctx.lineTo(x + holeW, y + holeH - holeRadius)
        ctx.quadraticCurveTo(x + holeW, y + holeH, x + holeW - holeRadius, y + holeH)
        ctx.lineTo(x + holeRadius, y + holeH)
        ctx.quadraticCurveTo(x, y + holeH, x, y + holeH - holeRadius)
        ctx.lineTo(x, y + holeRadius)
        ctx.quadraticCurveTo(x, y, x + holeRadius, y)
        ctx.closePath()
      }

      // Draw sprocket holes on Top & Bottom Margins
      const glowFactor = (sprocketGlow / 100)
      const glowColor = colorGrade === 'noir-monochrome'
        ? `rgba(200, 215, 240, ${0.3 + glowFactor * 0.4})`
        : `rgba(245, 180, 80, ${0.35 + warmthNorm * 0.25 * glowFactor})`

      for (let i = 0; i < numHoles; i++) {
        const x = i * holePitch + 8
        const yTop = (marginH - holeH) / 2
        const yBottom = H - marginH + (marginH - holeH) / 2

        ctx.save()
        ctx.globalCompositeOperation = 'destination-out'
        drawRoundedPerforation(x, yTop)
        ctx.fill()
        drawRoundedPerforation(x, yBottom)
        ctx.fill()
        ctx.restore()

        if (sprocketGlow > 5) {
          ctx.save()
          ctx.strokeStyle = glowColor
          ctx.lineWidth = 1.2
          drawRoundedPerforation(x, yTop)
          ctx.stroke()
          drawRoundedPerforation(x, yBottom)
          ctx.stroke()
          ctx.restore()
        }
      }

      // 3. Margin Dividing Guideline Tracks
      ctx.strokeStyle = colorGrade === 'noir-monochrome'
        ? 'rgba(160, 175, 200, 0.4)'
        : 'rgba(217, 119, 6, 0.45)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(0, marginH)
      ctx.lineTo(W, marginH)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, H - marginH)
      ctx.lineTo(W, H - marginH)
      ctx.stroke()

      // 4. Vintage 35mm Edge Markings
      if (frameDividersEnabled) {
        ctx.save()
        ctx.font = 'bold 9px monospace'
        ctx.fillStyle = colorGrade === 'noir-monochrome'
          ? 'rgba(220, 230, 245, 0.65)'
          : `rgba(251, 191, 36, ${0.55 + warmthNorm * 0.3})`
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'

        const frameCycle = 256
        for (let x = 0; x < W; x += frameCycle) {
          const frameNum = 18 + Math.floor(x / frameCycle)
          ctx.fillText(`EASTMAN 35MM • SAFETY FILM`, x + 12, marginH / 2)
          ctx.fillText(`▶ ${frameNum}A • ◄`, x + 16, H - marginH / 2)

          ctx.strokeStyle = colorGrade === 'noir-monochrome'
            ? 'rgba(200, 215, 240, 0.35)'
            : 'rgba(251, 191, 36, 0.35)'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, H)
          ctx.stroke()
        }
        ctx.restore()
      }

      const texture = new THREE.CanvasTexture(canvas)
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.ClampToEdgeWrapping
      texture.colorSpace = THREE.SRGBColorSpace
      texture.generateMipmaps = true
      texture.needsUpdate = true

      if (this.celluloidTexture) {
        this.celluloidTexture.dispose()
      }

      this.celluloidTexture = texture
      this.lastTextureKey = key
      return this.celluloidTexture
    } catch {
      return null
    }
  }

  /**
   * Builds the 3D continuous spline path for the film strip based on the pathStyle
   */
  public generateSplinePath(
    nodes: PhotoSpatialNode[],
    pathStyle: FilmStripPathStyle,
    spaceSpread: number = 115
  ): THREE.CatmullRomCurve3 {
    const count = Math.max(2, nodes.length)
    const points: THREE.Vector3[] = []
    const spread = spaceSpread / 100

    if (pathStyle === 'spiral') {
      // Helical ascending/descending spiral
      const baseRadius = 420 * spread
      const heightStep = 180 * spread
      const totalTurns = Math.max(1.5, count * 0.45)

      // Lead-in point before first frame
      points.push(new THREE.Vector3(baseRadius * 1.3, -heightStep * 1.5, 700))

      for (let i = 0; i < count; i++) {
        const u = i / (count - 1 || 1)
        const angle = u * totalTurns * Math.PI * 2
        const r = baseRadius * (1.0 + 0.15 * Math.sin(u * Math.PI))
        const x = Math.cos(angle) * r
        const y = (u - 0.5) * heightStep * count * 0.75 + Math.sin(angle * 0.5) * 40
        const z = Math.sin(angle) * r * 0.85 - u * 350
        points.push(new THREE.Vector3(x, y, z))
      }

      // Lead-out point after last frame
      const last = points[points.length - 1]
      points.push(new THREE.Vector3(last.x * 0.8, last.y + 220, last.z - 650))
    } else if (pathStyle === 'infinite-tunnel') {
      // Perspective corridor flowing into depth with subtle serpentine waves
      const depthStep = 550 * spread

      // Lead-in
      points.push(new THREE.Vector3(0, 60, 600))

      for (let i = 0; i < count; i++) {
        const u = i / (count - 1 || 1)
        const wave = Math.sin(u * Math.PI * 2.2)
        const x = wave * 280 * spread
        const y = Math.cos(u * Math.PI * 1.8) * 140 * spread
        const z = 200 - i * depthStep
        points.push(new THREE.Vector3(x, y, z))
      }

      // Lead-out into cosmic distance
      const last = points[points.length - 1]
      points.push(new THREE.Vector3(last.x * 0.5, last.y - 40, last.z - 900))
    } else {
      // Default: 's-curve' (Majestic serpentine 3D ribbon)
      const xSpread = 480 * spread
      const zSpread = 420 * spread

      // Lead-in
      points.push(new THREE.Vector3(-xSpread * 1.2, -140, 500))

      for (let i = 0; i < count; i++) {
        const u = i / (count - 1 || 1)
        const s = Math.sin(u * Math.PI * 2.4)
        const c = Math.cos(u * Math.PI * 1.6)

        const x = s * xSpread
        const y = c * 160 * spread + (u - 0.5) * 80
        const z = (0.5 - u) * zSpread * count * 0.8
        points.push(new THREE.Vector3(x, y, z))
      }

      // Lead-out
      const last = points[points.length - 1]
      points.push(new THREE.Vector3(last.x + 200, last.y + 160, last.z - 700))
    }

    const curve = new THREE.CatmullRomCurve3(points)
    curve.curveType = 'centripetal'
    curve.tension = 0.5
    this.splineCurve = curve
    return curve
  }

  /**
   * Computes exact station positions, tangents, and orientations along the film ribbon for all photos
   */
  public computeStations(
    nodes: PhotoSpatialNode[],
    curve: THREE.CatmullRomCurve3
  ): FilmStripStation[] {
    const count = nodes.length
    if (count === 0) return []

    const stations: FilmStripStation[] = []
    // Reserve lead-in and lead-out margins along the normalized curve parameter
    const tStart = 0.12
    const tEnd = 0.88
    const tRange = tEnd - tStart

    for (let i = 0; i < count; i++) {
      const u = count === 1 ? 0.5 : tStart + (i / (count - 1)) * tRange
      const pos = curve.getPointAt(u)
      const tangent = curve.getTangentAt(u).normalize()

      // Approximate up vector, then orthogonalize binormal and normal
      const worldUp = new THREE.Vector3(0, 1, 0)
      let binormal = new THREE.Vector3().crossVectors(tangent, worldUp)
      if (binormal.lengthSq() < 0.001) {
        binormal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 0, 1))
      }
      binormal.normalize()
      const normal = new THREE.Vector3().crossVectors(binormal, tangent).normalize()

      // Build rotation matrix from basis (binormal = X, normal = Y, -tangent = Z)
      const rotMatrix = new THREE.Matrix4().makeBasis(binormal, normal, tangent.clone().negate())
      const rotation = new THREE.Euler().setFromRotationMatrix(rotMatrix, 'YXZ')

      stations.push({
        photoIndex: i,
        photoId: nodes[i].photo.id,
        t: u,
        position: pos,
        tangent,
        normal,
        binormal,
        rotation,
      })
    }

    this.stations = stations
    return stations
  }

  /**
   * Constructs the continuous 3D quad-strip mesh for the 35mm film strip ribbon
   */
  public buildRibbonMesh(
    curve: THREE.CatmullRomCurve3,
    config: UniverseFilmReelConfig,
    photoCount: number
  ): THREE.Mesh {
    const numSegments = Math.max(160, photoCount * 60)
    const ribbonWidth = 240 * (config.ribbonWidthScale ?? 1.0) // Physical height/width of 35mm strip in 3D scene units

    const points = curve.getSpacedPoints(numSegments)
    const vertexCount = (numSegments + 1) * 2
    const faceCount = numSegments * 2

    const positions = new Float32Array(vertexCount * 3)
    const normals = new Float32Array(vertexCount * 3)
    const uvs = new Float32Array(vertexCount * 2)
    const indices = new Uint16Array(faceCount * 3)

    // Repeat texture along curve length: roughly 3 frame repeats per photo
    const textureRepeats = Math.max(4, photoCount * 2.8)

    for (let i = 0; i <= numSegments; i++) {
      const u = i / numSegments
      const point = points[i]
      const tangent = curve.getTangentAt(u).normalize()

      let binormal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0))
      if (binormal.lengthSq() < 0.001) {
        binormal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 0, 1))
      }
      binormal.normalize()
      const normal = new THREE.Vector3().crossVectors(binormal, tangent).normalize()

      // Left and right ribbon edges
      const leftEdge = point.clone().addScaledVector(normal, ribbonWidth * 0.5)
      const rightEdge = point.clone().addScaledVector(normal, -ribbonWidth * 0.5)

      const vLeft = i * 2
      const vRight = i * 2 + 1

      // Left vertex
      positions[vLeft * 3] = leftEdge.x
      positions[vLeft * 3 + 1] = leftEdge.y
      positions[vLeft * 3 + 2] = leftEdge.z

      normals[vLeft * 3] = binormal.x
      normals[vLeft * 3 + 1] = binormal.y
      normals[vLeft * 3 + 2] = binormal.z

      uvs[vLeft * 2] = u * textureRepeats
      uvs[vLeft * 2 + 1] = 0 // Top margin

      // Right vertex
      positions[vRight * 3] = rightEdge.x
      positions[vRight * 3 + 1] = rightEdge.y
      positions[vRight * 3 + 2] = rightEdge.z

      normals[vRight * 3] = binormal.x
      normals[vRight * 3 + 1] = binormal.y
      normals[vRight * 3 + 2] = binormal.z

      uvs[vRight * 2] = u * textureRepeats
      uvs[vRight * 2 + 1] = 1 // Bottom margin

      // Quad indices
      if (i < numSegments) {
        const f = i * 6
        indices[f] = vLeft
        indices[f + 1] = vLeft + 2
        indices[f + 2] = vRight

        indices[f + 3] = vRight
        indices[f + 4] = vLeft + 2
        indices[f + 5] = vRight + 2
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    geometry.setIndex(new THREE.BufferAttribute(indices, 1))

    const texture = this.getOrCreateCelluloidTexture(
      config.warmth,
      config.celluloidTranslucency,
      config.sprocketHoleDetail,
      config.colorGrade ?? 'warm-amber',
      config.sprocketGlow ?? 50,
      config.frameDividersEnabled ?? true
    )

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: Math.min(1.0, Math.max(0.6, config.celluloidTranslucency / 100)),
      depthWrite: true,
    })

    if (this.ribbonGeometry) this.ribbonGeometry.dispose()
    if (this.ribbonMaterial) this.ribbonMaterial.dispose()

    this.ribbonGeometry = geometry
    this.ribbonMaterial = material

    if (this.ribbonMesh) {
      this.ribbonMesh.geometry = geometry
      this.ribbonMesh.material = material
    } else {
      this.ribbonMesh = new THREE.Mesh(geometry, material)
      this.ribbonMesh.name = 'filmStripRibbon'
      this.ribbonMesh.renderOrder = 2
    }

    return this.ribbonMesh
  }

  /**
   * Initializes or updates the volumetric vintage projector light cone
   */
  public ensureProjectorBeam(scene: THREE.Scene, config: UniverseFilmReelConfig): void {
    if (!this.isClient || !scene) return

    const beamHex = config.projectorBeamColor === 'tungsten-warm'
      ? 0xffb74d
      : config.projectorBeamColor === 'soft-white'
      ? 0xf8fafc
      : config.projectorBeamColor === 'sepia-glow'
      ? 0xd97706
      : 0xf59e0b

    if (!this.projectorConeMesh) {
      // Open-ended cylinder cone geometry representing the volumetric beam
      const coneGeo = new THREE.CylinderGeometry(18, 220, 750, 24, 1, true)
      coneGeo.translate(0, -375, 0) // Anchor at tip
      coneGeo.rotateX(Math.PI / 2) // Orient along +Z axis

      // Projector beam warm golden glow material
      const coneMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(beamHex),
        transparent: true,
        opacity: (config.projectorLightIntensity / 100) * 0.32,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      })

      this.projectorConeMesh = new THREE.Mesh(coneGeo, coneMat)
      this.projectorConeMesh.name = 'projectorVolumetricBeam'
      this.projectorConeMesh.renderOrder = 8
      scene.add(this.projectorConeMesh)
    } else {
      const mat = this.projectorConeMesh.material as THREE.MeshBasicMaterial
      mat.color.setHex(beamHex)
    }

    if (!this.projectorLight) {
      this.projectorLight = new THREE.PointLight(beamHex, 2.5, 1200)
      this.projectorLight.name = 'projectorPointLight'
      scene.add(this.projectorLight)
    } else {
      this.projectorLight.color.setHex(beamHex)
    }

    // Atmospheric dust motes within the projector cone
    const dustCount = config.dustCount ?? 80
    if (!this.dustPointsMesh && config.dustMotesEnabled) {
      const dustGeo = new THREE.BufferGeometry()
      const posArray = new Float32Array(dustCount * 3)

      for (let i = 0; i < dustCount; i++) {
        posArray[i * 3] = (Math.random() - 0.5) * 160
        posArray[i * 3 + 1] = (Math.random() - 0.5) * 160
        posArray[i * 3 + 2] = Math.random() * 600 - 300
      }

      dustGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
      const dustMat = new THREE.PointsMaterial({
        color: beamHex,
        size: 3.5,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })

      this.dustPointsMesh = new THREE.Points(dustGeo, dustMat)
      this.dustPointsMesh.name = 'filmDustMotes'
      this.dustPointsMesh.renderOrder = 9
      scene.add(this.dustPointsMesh)
    }
  }

  /**
   * Updates volumetric projector beam position, orientation, and audio pulse
   */
  public updateProjector(
    focusedPosition: THREE.Vector3,
    cameraPos: THREE.Vector3,
    bands: NormalizedAudioBands | undefined,
    currentTime: number,
    config: UniverseFilmReelConfig
  ): void {
    if (!this.projectorConeMesh || !this.projectorLight) return

    // Position projector slightly behind and above camera looking toward focused photo
    const beamOrigin = cameraPos.clone().add(new THREE.Vector3(-120, 160, 240))
    this.projectorConeMesh.position.copy(beamOrigin)
    this.projectorConeMesh.lookAt(focusedPosition)

    this.projectorLight.position.copy(beamOrigin)

    // Audio reactivity on projector beam brightness
    const bass = bands?.bass ?? 0.3
    const overall = bands?.overall ?? 0.25
    const audioBoost = config.musicReactive ? 1.0 + bass * 0.45 : 1.0

    // Analog shutter lamp flicker
    const flicker = ((config.flickerIntensity ?? 15) / 100) * 0.10 * Math.sin(currentTime * 48.0) * Math.cos(currentTime * 32.0)
    const baseOpacity = (config.projectorLightIntensity / 100) * 0.30
    const mat = this.projectorConeMesh.material as THREE.MeshBasicMaterial
    mat.opacity = THREE.MathUtils.clamp((baseOpacity + flicker) * audioBoost, 0.06, 0.75)

    this.projectorLight.intensity = (config.projectorLightIntensity / 100) * 2.8 * audioBoost

    // Animate dust motes gently drifting in the beam
    if (this.dustPointsMesh) {
      this.dustPointsMesh.position.copy(focusedPosition)
      this.dustPointsMesh.rotation.y = currentTime * 0.08
      this.dustPointsMesh.rotation.x = Math.sin(currentTime * 0.12) * 0.05
    }
  }

  /**
   * Builds or synchronizes the photo aperture mounting onto the film strip
   * Ensures the photo quad sits seamlessly inside the 35mm frame aperture
   * with authentic vintage border and translucent celluloid backing.
   */
  public mountPhotoToStation(
    group: THREE.Group,
    node: PhotoSpatialNode,
    station: FilmStripStation,
    asset: { texture: THREE.Texture; aspectRatio: number; loaded: boolean } | null,
    config: UniverseFilmReelConfig
  ): void {
    // Position group directly at the station coordinates on the film strip
    group.position.copy(station.position)
    group.rotation.copy(station.rotation)

    // Clear non-film children if switching styles
    while (group.children.length > 0) {
      const child = group.children[0]
      group.remove(child)
      if ('geometry' in child) (child as THREE.Mesh).geometry.dispose()
    }

    // Frame Aperture Dimensions (fits neatly within the 240-unit ribbon height)
    const apertureHeight = 150
    const rawAspect = asset?.aspectRatio || node.photo.aspectRatio || 16 / 9
    const apertureWidth = Math.min(260, Math.max(140, apertureHeight * rawAspect))

    // 1. Photo Surface Quad (seated 0.5 units above film ribbon along normal)
    const photoGeo = new THREE.PlaneGeometry(apertureWidth, apertureHeight)
    const photoMat = new THREE.MeshBasicMaterial({
      map: asset?.texture || null,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1.0,
      depthWrite: true,
    })
    const photoMesh = new THREE.Mesh(photoGeo, photoMat)
    photoMesh.name = 'photoMesh'
    photoMesh.position.set(0, 0, 0.6)
    photoMesh.renderOrder = 3
    group.add(photoMesh)

    // 2. Celluloid Backing Face (warm dark amber celluloid so the back is NEVER pitch black)
    const backGeo = new THREE.PlaneGeometry(apertureWidth + 4, apertureHeight + 4)
    const warmthNorm = config.warmth / 100
    const backMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0.12 + warmthNorm * 0.08, 0.08 + warmthNorm * 0.04, 0.05),
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
    })
    const backMesh = new THREE.Mesh(backGeo, backMat)
    backMesh.name = 'cardBackMesh'
    backMesh.position.set(0, 0, -0.2)
    backMesh.renderOrder = 2
    group.add(backMesh)

    // 3. Vintage Amber Frame Border Outline
    const borderGeo = new THREE.EdgesGeometry(photoGeo)
    const borderMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(0xf59e0b),
      transparent: true,
      opacity: 0.65,
    })
    const borderLine = new THREE.LineSegments(borderGeo, borderMat)
    borderLine.name = 'borderLine'
    borderLine.position.set(0, 0, 0.8)
    borderLine.renderOrder = 4
    group.add(borderLine)

    // 4. Subtle Projector Glint / Focus Highlight Rim
    const rimGeo = new THREE.PlaneGeometry(apertureWidth + 12, apertureHeight + 12)
    const rimMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xffb74d),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const rimMesh = new THREE.Mesh(rimGeo, rimMat)
    rimMesh.name = 'rimMesh'
    rimMesh.position.set(0, 0, 0.3)
    rimMesh.renderOrder = 4
    group.add(rimMesh)
  }

  /**
   * Continuous Film Reel Camera Choreography
   * Generates smooth camera coordinates gliding along the 35mm film strip ribbon:
   * 1. Intro Reveal: Camera looks across illuminated ribbon head.
   * 2. Approach: Glide along ribbon curve toward active frame.
   * 3. Hold: Settle into majestic cinematic framing illuminated by projector.
   * 4. Departure: Fly past along the celluloid ribbon edge toward next photo.
   * 5. Climax / Grand Finale: Wide panoramic sweep revealing the complete spiral/S-curve in space!
   */
  public evaluateFilmReelCamera(
    currentTime: number,
    totalDuration: number,
    config: UniverseFilmReelConfig,
    bands?: NormalizedAudioBands
  ): CameraFrameState | null {
    if (!this.splineCurve || this.stations.length === 0) return null

    const stations = this.stations
    const count = stations.length
    const duration = Math.max(10, totalDuration)
    const speed = Math.max(0.5, Math.min(2.0, config.cameraSpeed))

    // Check for Grand Finale (last 12% of duration if cinematicEnding enabled)
    const finaleThreshold = duration * 0.88
    if (config.cinematicEnding && currentTime >= finaleThreshold) {
      const finaleProgress = Math.min(1.0, (currentTime - finaleThreshold) / (duration - finaleThreshold))
      // Pull camera back into a grand wide shot of the entire film strip spiral/curve
      const midPoint = this.splineCurve.getPointAt(0.5)
      const wideCamPos = new THREE.Vector3(
        midPoint.x + Math.sin(finaleProgress * 0.6) * 600,
        midPoint.y + 350 + finaleProgress * 120,
        midPoint.z + 1100 + finaleProgress * 300
      )

      return {
        position: { x: wideCamPos.x, y: wideCamPos.y, z: wideCamPos.z },
        lookAt: { x: midPoint.x, y: midPoint.y, z: midPoint.z },
        targetNodeIndex: count - 1,
        focusDistance: wideCamPos.distanceTo(midPoint),
        focusWeight: 0.7,
        travelPhase: 'fly-by',
        phaseProgress: finaleProgress,
        shakeAllowed: false,
      }
    }

    // Calculate progression across photo stations
    const activeDuration = config.cinematicEnding ? finaleThreshold : duration
    const stationDuration = activeDuration / count
    const rawIndex = (currentTime * speed) / stationDuration
    const currentIndex = Math.floor(rawIndex) % count
    const nextIndex = (currentIndex + 1) % count
    const progress = (rawIndex % 1)

    const currStation = stations[currentIndex]
    const nextStation = stations[nextIndex]

    // Sub-phases:
    // 0.00 - 0.35: Approach (glide along ribbon curve toward frame)
    // 0.35 - 0.75: Hold (stable cinematic viewing with projector light)
    // 0.75 - 1.00: Departure (fly past edge toward next station)
    let phase: CameraFrameState['travelPhase'] = 'hold'
    let focusWeight = 1.0
    let camPos = new THREE.Vector3()
    let lookTarget = currStation.position.clone()

    // Stand-off distance in front of photo for ideal 16:9 cinematic framing
    const framingDistance = 280

    if (progress < 0.35) {
      // Approach
      phase = 'approach'
      const subT = progress / 0.35
      const smoothT = THREE.MathUtils.smoothstep(subT, 0, 1)

      // Interpolate from outgoing travel position toward hero framing position
      const targetPos = currStation.position
        .clone()
        .addScaledVector(currStation.binormal, framingDistance)
        .add(new THREE.Vector3(20, 15, 0))

      const approachStart = currStation.position
        .clone()
        .addScaledVector(currStation.tangent, -240)
        .addScaledVector(currStation.binormal, framingDistance * 1.35)
        .add(new THREE.Vector3(-40, 50, 0))

      camPos.lerpVectors(approachStart, targetPos, smoothT)
      lookTarget.copy(currStation.position)
      focusWeight = 0.5 + smoothT * 0.5
    } else if (progress < 0.75) {
      // Hold: Lingering focus with gentle breathing drift
      phase = 'hold'
      const subT = (progress - 0.35) / 0.40
      const driftAngle = currentTime * 0.28
      const driftX = Math.sin(driftAngle) * 14
      const driftY = Math.cos(driftAngle * 0.8) * 8

      camPos = currStation.position
        .clone()
        .addScaledVector(currStation.binormal, framingDistance - subT * 18)
        .add(new THREE.Vector3(driftX, driftY, 0))

      lookTarget.copy(currStation.position)
      focusWeight = 1.0
    } else {
      // Departure: Glide along ribbon curve past the photo toward next station
      phase = 'departure'
      const subT = (progress - 0.75) / 0.25
      const smoothT = THREE.MathUtils.smoothstep(subT, 0, 1)

      const departureStart = currStation.position
        .clone()
        .addScaledVector(currStation.binormal, framingDistance - 18)

      const flybyTarget = currStation.position
        .clone()
        .addScaledVector(currStation.tangent, 260)
        .addScaledVector(currStation.binormal, framingDistance * 1.25)
        .add(new THREE.Vector3(60, -30, 0))

      camPos.lerpVectors(departureStart, flybyTarget, smoothT)

      // LookAt blends between current photo and next photo along the ribbon
      lookTarget.lerpVectors(currStation.position, nextStation.position, smoothT * 0.5)
      focusWeight = 1.0 - smoothT * 0.6
    }

    // Analog projector gate weave (subtle frame jitter)
    if ((config.gateWeaveIntensity ?? 20) > 0) {
      const gateWeave = ((config.gateWeaveIntensity ?? 20) / 100) * 1.5
      const weaveX = Math.sin(currentTime * 32.0) * gateWeave
      const weaveY = Math.cos(currentTime * 24.0) * gateWeave * 0.75
      lookTarget.x += weaveX
      lookTarget.y += weaveY
    }

    return {
      position: { x: camPos.x, y: camPos.y, z: camPos.z },
      lookAt: { x: lookTarget.x, y: lookTarget.y, z: lookTarget.z },
      targetNodeIndex: currentIndex,
      focusDistance: camPos.distanceTo(lookTarget),
      focusWeight,
      travelPhase: phase,
      phaseProgress: progress,
      shakeAllowed: phase === 'departure',
    }
  }

  /**
   * 2D Canvas Post-Processing: Subtle Vintage Film Grain & Warm Projector Vignette
   */
  public renderCanvasOverlay(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    config: UniverseFilmReelConfig,
    bands?: NormalizedAudioBands
  ): void {
    if (!this.isClient || !ctx) return

    ctx.save()

    // 1. Warm Amber / Sepia / Monochrome Projector Vignette
    const warmthNorm = config.warmth / 100
    const grad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      Math.min(width, height) * 0.35,
      width * 0.5,
      height * 0.5,
      Math.max(width, height) * 0.75
    )

    if (config.colorGrade === 'noir-monochrome') {
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)')
      grad.addColorStop(0.7, 'rgba(20, 24, 30, 0.28)')
      grad.addColorStop(1, 'rgba(4, 5, 8, 0.82)')
    } else {
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)')
      grad.addColorStop(0.7, `rgba(${Math.round(20 + warmthNorm * 20)}, 10, 4, 0.25)`)
      grad.addColorStop(1, 'rgba(6, 4, 2, 0.72)')
    }
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)

    // 2. Vintage Procedural Film Grain Overlay
    const grainIntensity = (config.filmGrainIntensity ?? 35) / 100
    if (grainIntensity > 0.05) {
      if (!this.grainCanvas || this.grainCanvas.width !== 256 || this.grainCanvas.height !== 256) {
        this.grainCanvas = document.createElement('canvas')
        this.grainCanvas.width = 256
        this.grainCanvas.height = 256
        this.grainCtx = this.grainCanvas.getContext('2d')
      }

      if (this.grainCtx) {
        const imgData = this.grainCtx.createImageData(256, 256)
        const data = imgData.data
        const len = data.length
        for (let i = 0; i < len; i += 4) {
          const val = (Math.random() * 255) | 0
          data[i] = val
          data[i + 1] = val
          data[i + 2] = val
          data[i + 3] = (Math.random() * 45) | 0
        }
        this.grainCtx.putImageData(imgData, 0, 0)

        ctx.globalAlpha = THREE.MathUtils.clamp(grainIntensity * 0.45, 0.05, 0.45)
        ctx.globalCompositeOperation = 'screen'

        const pattern = ctx.createPattern(this.grainCanvas, 'repeat')
        if (pattern) {
          ctx.fillStyle = pattern
          ctx.fillRect(0, 0, width, height)
        }
      }
    }

    // 3. Subtle Anamorphic Projector Lens Streak
    if (config.lensStreakEnabled) {
      const beamY = height * 0.48
      const streakGrad = ctx.createLinearGradient(0, beamY, width, beamY)
      streakGrad.addColorStop(0, 'rgba(0,0,0,0)')
      streakGrad.addColorStop(0.35, 'rgba(245, 158, 11, 0.03)')
      streakGrad.addColorStop(0.5, 'rgba(255, 230, 160, 0.16)')
      streakGrad.addColorStop(0.65, 'rgba(245, 158, 11, 0.03)')
      streakGrad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = streakGrad
      ctx.fillRect(0, beamY - 10, width, 20)
    }

    ctx.restore()
  }

  /**
   * Release Three.js geometries, textures, materials, and canvas resources
   */
  public dispose(): void {
    if (this.ribbonGeometry) {
      this.ribbonGeometry.dispose()
      this.ribbonGeometry = null
    }
    if (this.ribbonMaterial) {
      this.ribbonMaterial.dispose()
      this.ribbonMaterial = null
    }
    if (this.celluloidTexture) {
      this.celluloidTexture.dispose()
      this.celluloidTexture = null
    }
    if (this.projectorConeMesh) {
      this.projectorConeMesh.geometry?.dispose()
      ;(this.projectorConeMesh.material as THREE.Material)?.dispose()
      this.projectorConeMesh.parent?.remove(this.projectorConeMesh)
      this.projectorConeMesh = null
    }
    if (this.projectorLight) {
      this.projectorLight.parent?.remove(this.projectorLight)
      this.projectorLight = null
    }
    if (this.dustPointsMesh) {
      this.dustPointsMesh.geometry?.dispose()
      ;(this.dustPointsMesh.material as THREE.Material)?.dispose()
      this.dustPointsMesh.parent?.remove(this.dustPointsMesh)
      this.dustPointsMesh = null
    }
    this.stations = []
    this.splineCurve = null
    this.grainCanvas = null
    this.grainCtx = null
  }
}

export const universeFilmReelManager = new UniverseFilmReelManager()
export const universeFilmReel = universeFilmReelManager
