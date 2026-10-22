/**
 * IndiaTools — Floating Photo Universe 2.0
 * Liquid Light Transformation: Luminous Molten Metal Flowing Edge Ribbon
 * GPU-Accelerated Perimeter Fluid Dynamics, Camera-Responsive Highlights & Transition Bridges
 */

import * as THREE from 'three'
import {
  UniverseLiquidLightConfig,
  LiquidLightMaterial,
  DEFAULT_UNIVERSE_LIQUID_LIGHT_CONFIG,
} from './photoUniverseTypes.ts'
import { PhotoSpatialNode } from './universeLayout.ts'
import { CameraFrameState } from './universeCameraDirector.ts'
import { NormalizedAudioBands } from '../audioToVideo/types.ts'

/**
 * Generates an arc-length parameterized closed quad-strip ribbon geometry
 * surrounding the outer perimeter of a rounded rectangle.
 * 
 * - Inner vertices hug the exact outer perimeter of the photo/card (0 photo obstruction).
 * - Outer vertices expand outward along the normal by edgeWidth.
 * - UV.x parameterizes continuous distance [0, 1] around the perimeter.
 * - UV.y parameterizes cross-sectional ribbon depth from inner edge (0) to outer halo (1).
 */
export function createLiquidRibbonGeometry(
  width: number,
  height: number,
  edgeWidth: number,
  cornerRadius: number,
  samples: number = 144
): THREE.BufferGeometry {
  const r = Math.max(0, Math.min(cornerRadius, width / 2 - 2, height / 2 - 2))
  const straightW = Math.max(0, width - 2 * r)
  const straightH = Math.max(0, height - 2 * r)
  const arcLength = 0.5 * Math.PI * r
  const totalLength = 2 * straightW + 2 * straightH + 4 * arcLength

  // Define 8 path sections around perimeter starting at bottom center
  interface PerimeterSection {
    type: 'line' | 'arc'
    length: number
    // For line:
    x0?: number
    y0?: number
    x1?: number
    y1?: number
    nx?: number
    ny?: number
    // For arc:
    cx?: number
    cy?: number
    startAngle?: number
    endAngle?: number
  }

  const sections: PerimeterSection[] = []

  // 1. Bottom right half-straight: (0, -height/2) -> (straightW/2, -height/2)
  if (straightW > 0) {
    sections.push({
      type: 'line',
      length: straightW / 2,
      x0: 0,
      y0: -height / 2,
      x1: straightW / 2,
      y1: -height / 2,
      nx: 0,
      ny: -1,
    })
  }

  // 2. Bottom-Right corner arc: -pi/2 -> 0
  if (r > 0) {
    sections.push({
      type: 'arc',
      length: arcLength,
      cx: width / 2 - r,
      cy: -height / 2 + r,
      startAngle: -Math.PI / 2,
      endAngle: 0,
    })
  }

  // 3. Right straight: (width/2, -straightH/2) -> (width/2, straightH/2)
  if (straightH > 0) {
    sections.push({
      type: 'line',
      length: straightH,
      x0: width / 2,
      y0: -straightH / 2,
      x1: width / 2,
      y1: straightH / 2,
      nx: 1,
      ny: 0,
    })
  }

  // 4. Top-Right corner arc: 0 -> pi/2
  if (r > 0) {
    sections.push({
      type: 'arc',
      length: arcLength,
      cx: width / 2 - r,
      cy: height / 2 - r,
      startAngle: 0,
      endAngle: Math.PI / 2,
    })
  }

  // 5. Top straight: (straightW/2, height/2) -> (-straightW/2, height/2)
  if (straightW > 0) {
    sections.push({
      type: 'line',
      length: straightW,
      x0: straightW / 2,
      y0: height / 2,
      x1: -straightW / 2,
      y1: height / 2,
      nx: 0,
      ny: 1,
    })
  }

  // 6. Top-Left corner arc: pi/2 -> pi
  if (r > 0) {
    sections.push({
      type: 'arc',
      length: arcLength,
      cx: -width / 2 + r,
      cy: height / 2 - r,
      startAngle: Math.PI / 2,
      endAngle: Math.PI,
    })
  }

  // 7. Left straight: (-width/2, straightH/2) -> (-width/2, -straightH/2)
  if (straightH > 0) {
    sections.push({
      type: 'line',
      length: straightH,
      x0: -width / 2,
      y0: straightH / 2,
      x1: -width / 2,
      y1: -straightH / 2,
      nx: -1,
      ny: 0,
    })
  }

  // 8. Bottom-Left corner arc: pi -> 3pi/2
  if (r > 0) {
    sections.push({
      type: 'arc',
      length: arcLength,
      cx: -width / 2 + r,
      cy: -height / 2 + r,
      startAngle: Math.PI,
      endAngle: (3 * Math.PI) / 2,
    })
  }

  // 9. Bottom left half-straight: (-straightW/2, -height/2) -> (0, -height/2)
  if (straightW > 0) {
    sections.push({
      type: 'line',
      length: straightW / 2,
      x0: -straightW / 2,
      y0: -height / 2,
      x1: 0,
      y1: -height / 2,
      nx: 0,
      ny: -1,
    })
  }

  // Evaluate point and normal at distance d along perimeter
  const evaluatePerimeter = (d: number): { px: number; ny: number; py: number; nx: number } => {
    let accumulated = 0
    // Wrap d within totalLength
    const curD = ((d % totalLength) + totalLength) % totalLength

    for (const sec of sections) {
      if (curD <= accumulated + sec.length || sec === sections[sections.length - 1]) {
        const segDist = Math.max(0, Math.min(sec.length, curD - accumulated))
        const t = sec.length > 0 ? segDist / sec.length : 0

        if (sec.type === 'line') {
          return {
            px: sec.x0! + (sec.x1! - sec.x0!) * t,
            py: sec.y0! + (sec.y1! - sec.y0!) * t,
            nx: sec.nx!,
            ny: sec.ny!,
          }
        } else {
          const angle = sec.startAngle! + (sec.endAngle! - sec.startAngle!) * t
          const cosA = Math.cos(angle)
          const sinA = Math.sin(angle)
          return {
            px: sec.cx! + cosA * r,
            py: sec.cy! + sinA * r,
            nx: cosA,
            ny: sinA,
          }
        }
      }
      accumulated += sec.length
    }

    return { px: 0, py: -height / 2, nx: 0, ny: -1 }
  }

  // Discretize into (samples + 1) rings of [inner, outer] pairs
  const vertexCount = (samples + 1) * 2
  const positions = new Float32Array(vertexCount * 3)
  const normals = new Float32Array(vertexCount * 3)
  const uvs = new Float32Array(vertexCount * 2)
  const indices: number[] = []

  const zOffset = 1.34 // Positioned on front perimeter of 3D glass card

  for (let i = 0; i <= samples; i++) {
    const s = i / samples // [0, 1] along perimeter
    const dist = s * totalLength
    const { px, py, nx, ny } = evaluatePerimeter(dist)

    const innerIdx = i * 2
    const outerIdx = i * 2 + 1

    // Inner vertex: sits exactly on the photo border
    positions[innerIdx * 3] = px
    positions[innerIdx * 3 + 1] = py
    positions[innerIdx * 3 + 2] = zOffset

    normals[innerIdx * 3] = 0
    normals[innerIdx * 3 + 1] = 0
    normals[innerIdx * 3 + 2] = 1

    uvs[innerIdx * 2] = s
    uvs[innerIdx * 2 + 1] = 0.0

    // Outer vertex: extends outward by edgeWidth
    positions[outerIdx * 3] = px + nx * edgeWidth
    positions[outerIdx * 3 + 1] = py + ny * edgeWidth
    positions[outerIdx * 3 + 2] = zOffset

    normals[outerIdx * 3] = 0
    normals[outerIdx * 3 + 1] = 0
    normals[outerIdx * 3 + 2] = 1

    uvs[outerIdx * 2] = s
    uvs[outerIdx * 2 + 1] = 1.0

    // Build quad indices
    if (i < samples) {
      const v0 = innerIdx
      const v1 = outerIdx
      const v2 = (i + 1) * 2
      const v3 = (i + 1) * 2 + 1

      indices.push(v0, v1, v3)
      indices.push(v0, v3, v2)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geometry.setIndex(indices)

  return geometry
}

/**
 * GPU Liquid Light Vertex & Fragment Shaders
 */
const LIQUID_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const LIQUID_FRAGMENT_SHADER = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform int uMaterial;          // 0: Gold, 1: Silver, 2: Iridescent
  uniform float uIntensity;       // 0.0 to 1.0
  uniform float uFlowSpeed;       // Flow velocity scale
  uniform float uApproachFactor;  // Camera proximity & focus weight [0, 1]
  uniform float uSweepProgress;   // Position of highlight sweep [0, 1]
  uniform float uClimaxBoost;     // Musical climax flash [0, 1]
  uniform float uAudioEnergy;     // Real-time audio ripple excitation [0, 1]
  uniform float uTransitionBridge;// Visual handover boost between photos [0, 1]

  void main() {
    // 1. Continuous Viscous Fluid Flow along Perimeter (vUv.x is perimeter progress [0, 1])
    float uRep = 4.0;
    float flowU = vUv.x * uRep - uTime * uFlowSpeed * 0.42;

    // Multi-frequency harmonic wave formulation for organic molten texture
    float wave1 = sin(flowU * 6.2831853);
    float wave2 = sin(flowU * 12.5663706 + 1.35) * 0.48;
    float wave3 = sin(flowU * 25.1327412 - uTime * 2.1) * 0.24;
    float fluid = (wave1 + wave2 + wave3) / 1.72; // [-1.0, 1.0]

    // Audio-reactive ripple perturbation
    fluid += sin(vUv.x * 28.0 + uTime * 4.5) * uAudioEnergy * 0.28;

    // 2. Liquid Droplet / Bead Cross-Section across ribbon thickness (vUv.y from 0 to 1)
    // Convex parabolic liquid bead profile
    float bead = sin(vUv.y * 3.14159265);
    // Specular crown crest centered around vUv.y = 0.38
    float crest = exp(-pow((vUv.y - 0.38) * 5.2, 2.0));

    // Specular glint along molten wave crests
    float glint = pow(max(0.0, fluid * 0.5 + 0.5), 5.5) * crest;

    // 3. Camera-Responsive Approach Highlight Sweep
    float sweepDist = abs(fract(vUv.x - uSweepProgress + 0.5) - 0.5);
    float sweepPulse = smoothstep(0.18, 0.0, sweepDist);
    float sweepTail = smoothstep(0.38, 0.0, abs(fract(vUv.x - uSweepProgress + 0.32 + 0.5) - 0.5)) * 0.45;
    float sweepTotal = (sweepPulse + sweepTail) * (0.65 + 0.75 * uApproachFactor);

    // 4. Color Palettes
    vec3 colBase;
    vec3 colMid;
    vec3 colHigh;

    if (uMaterial == 0) {
      // Liquid Gold: molten 24k gold, deep amber depth, white-gold specular
      colBase = vec3(0.55, 0.32, 0.04);
      colMid = vec3(1.0, 0.82, 0.22);
      colHigh = vec3(1.0, 0.98, 0.88);
    } else if (uMaterial == 1) {
      // Liquid Silver / Chrome: mirror platinum shadow, liquid mercury core, chrome glint
      colBase = vec3(0.42, 0.50, 0.62);
      colMid = vec3(0.86, 0.91, 0.98);
      colHigh = vec3(1.0, 1.0, 1.0);
    } else {
      // Subtle Iridescent: pearlescent opal, cycling smoothly through cyan, rose, violet & gold
      vec3 opal = 0.5 + 0.5 * cos(6.2831853 * (vUv.x * 2.0 + uTime * 0.25 + vec3(0.0, 0.33, 0.67)));
      colBase = mix(vec3(0.35, 0.38, 0.52), opal * 0.72, 0.5);
      colMid = mix(vec3(0.82, 0.86, 0.95), opal, 0.65);
      colHigh = vec3(1.0, 0.98, 0.95);
    }

    // 5. Composite Luminous Liquid Metal
    float liquidBody = clamp(bead * 0.7 + fluid * 0.3, 0.0, 1.0);
    vec3 color = mix(colBase, colMid, liquidBody);
    color = mix(color, colHigh, clamp(glint * 1.45 + sweepTotal * 0.95, 0.0, 1.0));

    // Musical Climax & Transition Bridge Surge
    color += colHigh * (uClimaxBoost * 0.75 + uTransitionBridge * 0.65);

    // 6. Alpha Calculation (soft outer bloom, solid inner contact)
    float alpha = bead * 0.82 + glint * 0.65 + sweepTotal * 0.8;
    // Smooth fade at the outer perimeter boundary into cosmic space
    alpha *= smoothstep(1.0, 0.72, vUv.y);
    // Modulate by user intensity & camera approach
    alpha *= uIntensity * (0.45 + 0.55 * uApproachFactor + uClimaxBoost * 0.45 + uTransitionBridge * 0.4);
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(color, alpha);
  }
`

export class UniverseLiquidLightManager {
  private geometryCache: Map<string, THREE.BufferGeometry> = new Map()
  private materialCache: Map<string, THREE.ShaderMaterial> = new Map()

  /**
   * Builds or retrieves cached ribbon geometry for given dimensions
   */
  public getOrCreateGeometry(
    width: number,
    height: number,
    edgeWidth: number,
    cornerRadius: number
  ): THREE.BufferGeometry {
    const key = `${Math.round(width)}_${Math.round(height)}_${Math.round(edgeWidth)}_${Math.round(cornerRadius)}`
    let geo = this.geometryCache.get(key)
    if (!geo) {
      geo = createLiquidRibbonGeometry(width, height, edgeWidth, cornerRadius)
      this.geometryCache.set(key, geo)
    }
    return geo
  }

  /**
   * Creates a dedicated GPU ShaderMaterial for liquid ribbon
   */
  public createMaterial(
    config: UniverseLiquidLightConfig
  ): THREE.ShaderMaterial {
    const materialCode =
      config.material === 'liquid-gold' ? 0 : config.material === 'liquid-silver' ? 1 : 2

    return new THREE.ShaderMaterial({
      vertexShader: LIQUID_VERTEX_SHADER,
      fragmentShader: LIQUID_FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uMaterial: { value: materialCode },
        uIntensity: { value: config.intensity / 100 },
        uFlowSpeed: { value: config.flowSpeed / 50 },
        uApproachFactor: { value: 0 },
        uSweepProgress: { value: 0 },
        uClimaxBoost: { value: 0 },
        uAudioEnergy: { value: 0 },
        uTransitionBridge: { value: 0 },
      },
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }

  /**
   * Synchronizes or builds liquid ribbon mesh inside a photo's Three.js group
   */
  public buildOrUpdateLiquidRibbon(
    group: THREE.Group,
    node: PhotoSpatialNode,
    config: UniverseLiquidLightConfig,
    cornerRadius: number = 16
  ): THREE.Mesh {
    let ribbonMesh = group.getObjectByName('liquidRibbonMesh') as THREE.Mesh | undefined

    const geo = this.getOrCreateGeometry(
      node.worldWidth,
      node.worldHeight,
      config.edgeWidth,
      cornerRadius
    )

    if (!ribbonMesh) {
      const mat = this.createMaterial(config)
      ribbonMesh = new THREE.Mesh(geo, mat)
      ribbonMesh.name = 'liquidRibbonMesh'
      ribbonMesh.renderOrder = 6
      group.add(ribbonMesh)
    } else {
      ribbonMesh.renderOrder = 6
      if (ribbonMesh.geometry !== geo) {
        ribbonMesh.geometry = geo
      }
      const mat = ribbonMesh.material as THREE.ShaderMaterial
      if (mat.uniforms) {
        mat.uniforms.uMaterial.value =
          config.material === 'liquid-gold' ? 0 : config.material === 'liquid-silver' ? 1 : 2
        mat.uniforms.uIntensity.value = config.intensity / 100
        mat.uniforms.uFlowSpeed.value = config.flowSpeed / 50
      }
    }

    return ribbonMesh
  }

  /**
   * Removes liquid ribbon mesh from a photo group and disposes it safely
   */
  public removeRibbonFromGroup(group: THREE.Group): void {
    const ribbonMesh = group.getObjectByName('liquidRibbonMesh') as THREE.Mesh | undefined
    if (ribbonMesh) {
      group.remove(ribbonMesh)
      if (ribbonMesh.material) {
        if (Array.isArray(ribbonMesh.material)) {
          ribbonMesh.material.forEach((m) => m.dispose())
        } else {
          ribbonMesh.material.dispose()
        }
      }
    }
  }

  /**
   * Per-Frame Dynamic Animation Update:
   * Drives continuous fluid flow, camera approach detection, highlight sweep & transition bridging.
   */
  public updatePhoto(
    group: THREE.Group,
    node: PhotoSpatialNode,
    config: UniverseLiquidLightConfig,
    camera: THREE.Camera,
    bands: NormalizedAudioBands | undefined,
    currentTime: number,
    isCurrentTarget: boolean,
    cameraState: CameraFrameState,
    supernovaState: { phase?: string; flashOpacity?: number } | undefined,
    nodeIndex: number,
    totalNodes: number
  ): void {
    const ribbonMesh = group.getObjectByName('liquidRibbonMesh') as THREE.Mesh | undefined
    if (!ribbonMesh) return

    const mat = ribbonMesh.material as THREE.ShaderMaterial
    if (!mat.uniforms) return

    // 1. Time & Flow Speed Modulation
    mat.uniforms.uTime.value = currentTime

    let effectiveFlowSpeed = config.flowSpeed / 50
    let audioEnergy = 0

    if (config.musicReactivity && bands) {
      audioEnergy = bands.bass * 0.6 + bands.overall * 0.4
      // Melodic and energetic passages gently accelerate fluid flow
      effectiveFlowSpeed *= 0.8 + 0.45 * (bands.mid + bands.treble)
    }
    mat.uniforms.uFlowSpeed.value = effectiveFlowSpeed
    mat.uniforms.uAudioEnergy.value = audioEnergy

    // 2. Camera Approach & Proximity Factor
    const camDist = camera.position.distanceTo(group.position)
    let approachFactor = 0

    if (isCurrentTarget) {
      // Current focused hero photo has high intensity matching camera phase
      approachFactor = cameraState.focusWeight
    } else {
      // Corridor photos react gradually to spatial camera proximity
      approachFactor = Math.max(0, 1.0 - camDist / 950) * 0.35
    }
    mat.uniforms.uApproachFactor.value = approachFactor

    // 3. Highlight Sweep Around Perimeter
    let sweepProgress = 0
    if (isCurrentTarget && cameraState.travelPhase === 'approach') {
      // Synchronized light sweep that races around the perimeter as camera approaches
      sweepProgress = (currentTime * 0.85 + cameraState.phaseProgress * 1.6) % 1.0
    } else if (isCurrentTarget) {
      // Gentle orbital perimeter sweep during hold
      sweepProgress = (currentTime * 0.32) % 1.0
    } else {
      // Ambient slow drift for non-focused photos
      sweepProgress = (currentTime * 0.18 + nodeIndex * 0.25) % 1.0
    }
    mat.uniforms.uSweepProgress.value = sweepProgress

    // 4. Musical Climax & Supernova Reactivity
    let climaxBoost = 0
    if (supernovaState && supernovaState.phase === 'supernova') {
      climaxBoost = Math.max(0.6, supernovaState.flashOpacity || 0.8)
    } else if (config.musicReactivity && bands?.isBeatHit && bands.bass > 0.88) {
      climaxBoost = 0.5
    }
    mat.uniforms.uClimaxBoost.value = climaxBoost

    // 5. Cinematic Image Transition Bridge
    let transitionBridge = 0
    if (config.cinematicTransition && totalNodes > 1) {
      const isOutgoing = isCurrentTarget && (cameraState.travelPhase === 'departure' || cameraState.travelPhase === 'transition')
      const nextTargetIdx = (cameraState.targetNodeIndex + 1) % totalNodes
      const isIncoming = nodeIndex === nextTargetIdx && cameraState.travelPhase === 'transition'

      if (isOutgoing) {
        // Outgoing photo's liquid light ribbon surges during departure handover
        transitionBridge = Math.sin(cameraState.phaseProgress * Math.PI) * 0.85
      } else if (isIncoming) {
        // Incoming photo's liquid light ribbon begins illuminating to guide viewer into the new frame
        transitionBridge = Math.sin(cameraState.phaseProgress * Math.PI) * 0.95
      }
    }
    mat.uniforms.uTransitionBridge.value = transitionBridge
  }

  /**
   * Release cached geometries, materials and GPU resources
   */
  public dispose(): void {
    for (const geo of this.geometryCache.values()) {
      geo.dispose()
    }
    this.geometryCache.clear()

    for (const mat of this.materialCache.values()) {
      mat.dispose()
    }
    this.materialCache.clear()
  }
}

export const universeLiquidLight = new UniverseLiquidLightManager()
