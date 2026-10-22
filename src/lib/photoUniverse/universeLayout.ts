/**
 * IndiaTools — Floating Photo Universe
 * 3D Spatial Layout Generator
 * Generates organic, non-overlapping 3D coordinates & orientations for floating photos
 */

import { UniversePhoto } from './photoUniverseTypes.ts'

export interface Position3D {
  x: number
  y: number
  z: number
}

export interface Rotation3D {
  x: number // Pitch (radians)
  y: number // Yaw (radians)
  z: number // Roll (radians)
}

export interface PhotoSpatialNode {
  photo: UniversePhoto
  index: number
  position: Position3D
  rotation: Rotation3D
  worldWidth: number
  worldHeight: number
  lookAtPoint: Position3D
  cameraApproachPos: Position3D
  cameraFocusPos: Position3D
  cameraFlyByPos: Position3D
}

/**
 * Deterministic pseudo-random number generator for consistent beautiful layouts
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

export function generateUniverseSpatialNodes(
  photos: UniversePhoto[],
  spaceSpread: number = 100,
  depthRange: number = 1600,
  photoScale: number = 1.0
): PhotoSpatialNode[] {
  if (!photos || photos.length === 0) return []

  const count = photos.length
  const nodes: PhotoSpatialNode[] = []

  // Spread multiplier (base 1.0 at spaceSpread=100)
  const spreadFactor = Math.max(0.4, spaceSpread / 100)
  const zStep = (depthRange / Math.max(1, count)) * spreadFactor

  // Base dimension for 3D photo frames
  const baseDim = 280 * photoScale

  for (let i = 0; i < count; i++) {
    const photo = photos[i]
    const seed = i + 1

    // Aspect ratio calculation
    const aspect = photo.aspectRatio && photo.aspectRatio > 0.1 ? photo.aspectRatio : 16 / 9
    let w = baseDim
    let h = baseDim / aspect

    // Constrain extreme aspect ratios so tall portrait or ultra-wide aren't disproportionate
    if (aspect < 0.8) {
      // Portrait photo: constrain height
      h = baseDim * 1.3
      w = h * aspect
    } else if (aspect > 2.2) {
      // Panoramic/ultrawide
      w = baseDim * 1.4
      h = w / aspect
    }

    // Galactic winding corridor pattern
    // Ribbon angle progression
    const angle = i * 0.85 + seededRandom(seed * 11) * 0.4
    const horizontalSpread = (320 + seededRandom(seed * 17) * 220) * spreadFactor
    const verticalSpread = (180 + seededRandom(seed * 23) * 160) * spreadFactor

    // Alternating left/right bias with natural drift
    const sideSign = i % 2 === 0 ? 1 : -1
    const x = Math.sin(angle) * horizontalSpread * sideSign + (seededRandom(seed * 31) - 0.5) * 80
    const y = Math.cos(angle * 0.7) * verticalSpread + (seededRandom(seed * 37) - 0.5) * 60
    const z = -i * zStep - (seededRandom(seed * 41) * 80)

    // Subtle natural orientation: tilts slightly inward toward central camera flight path
    const yaw = -Math.atan2(x * 0.6, Math.abs(z || 1)) + (seededRandom(seed * 43) - 0.5) * 0.2
    const pitch = (seededRandom(seed * 47) - 0.5) * 0.15
    const roll = (seededRandom(seed * 53) - 0.5) * 0.08

    // Precise camera keyframe positions relative to this photo
    // Photo center is at (x, y, z)
    // Photo normal vector
    const cosY = Math.cos(yaw)
    const sinY = Math.sin(yaw)

    // Distance in front of photo to frame it crisply
    // Stand-off distance based on photo size to achieve perfect framing
    const framingDistance = Math.max(w, h) * 1.55

    // Camera Focus Position (directly facing photo at framing distance)
    const cameraFocusPos: Position3D = {
      x: x + sinY * framingDistance,
      y: y + 10,
      z: z + cosY * framingDistance,
    }

    // Camera Approach Position (further back, gliding in)
    const approachDistance = framingDistance * 2.4
    const cameraApproachPos: Position3D = {
      x: x + sinY * approachDistance + (sideSign * 80),
      y: y + 50,
      z: z + cosY * approachDistance,
    }

    // Camera Fly-By Position (moves slightly beside & past the photo to reveal 3D depth)
    const flyByOffset = Math.max(w, h) * 0.95
    const cameraFlyByPos: Position3D = {
      x: x - (sideSign * flyByOffset),
      y: y - 20,
      z: z - (cosY * 60), // Past the photo plane
    }

    nodes.push({
      photo,
      index: i,
      position: { x, y, z },
      rotation: { x: pitch, y: yaw, z: roll },
      worldWidth: w,
      worldHeight: h,
      lookAtPoint: { x, y, z },
      cameraApproachPos,
      cameraFocusPos,
      cameraFlyByPos,
    })
  }

  // Prevent excessive collision / overlapping between adjacent nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const n1 = nodes[i]
      const n2 = nodes[j]
      const dx = n2.position.x - n1.position.x
      const dy = n2.position.y - n1.position.y
      const dz = n2.position.z - n1.position.z
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      const minDist = Math.max(n1.worldWidth, n1.worldHeight) * 0.85

      if (dist < minDist && dist > 0.001) {
        // Push n2 slightly outward
        const push = (minDist - dist) * 0.6
        n2.position.x += (dx / dist) * push
        n2.position.y += (dy / dist) * push
      }
    }
  }

  return nodes
}
