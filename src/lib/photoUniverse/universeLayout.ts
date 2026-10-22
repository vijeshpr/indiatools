/**
 * IndiaTools — Floating Photo Universe 2.0
 * 3D Spatial Layout Generator
 * Three spatial layers (Foreground, Midground, Background), stable orientations & collision-free line-of-sight
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
  layer: 'foreground' | 'midground' | 'background'
  position: Position3D
  rotation: Rotation3D // Stable, initial orientation (no continuous spin)
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
  spaceSpread: number = 120,
  depthRange: number = 2200,
  photoScale: number = 1.0
): PhotoSpatialNode[] {
  if (!photos || photos.length === 0) return []

  const count = photos.length
  const nodes: PhotoSpatialNode[] = []

  // Spread multiplier (base 1.0 at spaceSpread=100)
  const spreadFactor = Math.max(0.5, spaceSpread / 100)
  const zStep = (depthRange / Math.max(1, count)) * spreadFactor

  // Base dimension for 3D photo frames
  const baseDim = 280 * photoScale

  for (let i = 0; i < count; i++) {
    const photo = photos[i]
    const seed = i + 1

    // Aspect ratio calculation with bounds check
    const aspect =
      photo.aspectRatio && photo.aspectRatio > 0.1 && photo.aspectRatio < 10
        ? photo.aspectRatio
        : 16 / 9

    let w = baseDim
    let h = baseDim / aspect

    // Constrain extreme aspect ratios so tall portrait or ultra-wide aren't disproportionate
    if (aspect < 0.8) {
      // Portrait photo (e.g. 9:16)
      h = baseDim * 1.25
      w = h * aspect
    } else if (aspect > 2.2) {
      // Panoramic/ultrawide
      w = baseDim * 1.35
      h = w / aspect
    }

    // Midground Spatial Corridor:
    // Flowing ribbon with wide horizontal clearance and gentle elevation
    const ribbonAngle = i * 0.75 + seededRandom(seed * 11) * 0.3
    const horizontalSpread = (380 + seededRandom(seed * 17) * 260) * spreadFactor
    const verticalSpread = (160 + seededRandom(seed * 23) * 140) * spreadFactor

    // Alternating left/right positioning to ensure clear sightlines
    const sideSign = i % 2 === 0 ? 1 : -1
    const x = Math.sin(ribbonAngle) * horizontalSpread * sideSign + (seededRandom(seed * 31) - 0.5) * 60
    const y = Math.cos(ribbonAngle * 0.8) * verticalSpread + (seededRandom(seed * 37) - 0.5) * 50
    const z = -i * zStep - 150 - (seededRandom(seed * 41) * 90)

    // STABLE Orientation (calculated once, fixed, no continuous spinning)
    // Subtle inward tilt toward camera path
    const yaw = -Math.atan2(x * 0.45, Math.abs(z || 1)) + (seededRandom(seed * 43) - 0.5) * 0.12
    const pitch = (seededRandom(seed * 47) - 0.5) * 0.08
    const roll = (seededRandom(seed * 53) - 0.5) * 0.04

    const cosY = Math.cos(yaw)
    const sinY = Math.sin(yaw)

    // Comfortable stand-off viewing distance
    const framingDistance = Math.max(w, h) * 1.65

    // Camera Focus Position (facing photo at optimal stand-off distance)
    const cameraFocusPos: Position3D = {
      x: x + sinY * framingDistance,
      y: y + 8,
      z: z + cosY * framingDistance,
    }

    // Camera Approach Position (further back, gliding in)
    const approachDistance = framingDistance * 2.5
    const cameraApproachPos: Position3D = {
      x: x + sinY * approachDistance + sideSign * 110,
      y: y + 40,
      z: z + cosY * approachDistance + 80,
    }

    // Camera Fly-By Position (smooth curved departure beside photo)
    const flyByOffset = Math.max(w, h) * 1.1
    const cameraFlyByPos: Position3D = {
      x: x - sideSign * flyByOffset,
      y: y - 15,
      z: z - cosY * 90, // Passes slightly past the photo plane
    }

    nodes.push({
      photo,
      index: i,
      layer: 'midground',
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

  // Obstruction & Collision Prevention:
  // Ensure no photograph blocks another photo's line of sight to the camera
  for (let i = 0; i < nodes.length; i++) {
    const targetNode = nodes[i]
    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue
      const otherNode = nodes[j]

      // Vector from cameraFocusPos to target position
      const cam = targetNode.cameraFocusPos
      const tgt = targetNode.position
      const lineLen = Math.sqrt(
        Math.pow(tgt.x - cam.x, 2) + Math.pow(tgt.y - cam.y, 2) + Math.pow(tgt.z - cam.z, 2)
      )

      if (lineLen < 0.1) continue

      // Point-to-line segment distance from otherNode to the camera sightline
      const u =
        ((otherNode.position.x - cam.x) * (tgt.x - cam.x) +
          (otherNode.position.y - cam.y) * (tgt.y - cam.y) +
          (otherNode.position.z - cam.z) * (tgt.z - cam.z)) /
        (lineLen * lineLen)

      // If otherNode lies along the viewing cone in front of target
      if (u > 0.05 && u < 0.95) {
        const projX = cam.x + u * (tgt.x - cam.x)
        const projY = cam.y + u * (tgt.y - cam.y)
        const projZ = cam.z + u * (tgt.z - cam.z)
        const distToSightline = Math.sqrt(
          Math.pow(otherNode.position.x - projX, 2) +
            Math.pow(otherNode.position.y - projY, 2) +
            Math.pow(otherNode.position.z - projZ, 2)
        )

        const minClearance = Math.max(otherNode.worldWidth, otherNode.worldHeight) * 0.9
        if (distToSightline < minClearance) {
          // Push otherNode laterally away from sightline to eliminate obstruction
          const pushDir = otherNode.position.x >= projX ? 1 : -1
          otherNode.position.x += pushDir * (minClearance - distToSightline + 40)
        }
      }
    }
  }

  return nodes
}
