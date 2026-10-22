/**
 * IndiaTools — Floating Photo Universe
 * Cinematic Camera Director & Smooth 3D Flight Interpolator
 * Approach, Focus, Fly-by, Transition & Music-Directed Routing
 */

import {
  CameraMovementStyle,
  DirectorMode,
} from './photoUniverseTypes.ts'
import { PhotoSpatialNode, Position3D } from './universeLayout.ts'

export interface CameraFrameState {
  position: Position3D
  lookAt: Position3D
  targetNodeIndex: number
  focusDistance: number // Distance from camera to currently focused plane
  focusWeight: number // 0 (transitioning) to 1 (fully locked on focus)
  travelPhase: 'approach' | 'focus' | 'fly-by' | 'transition'
  phaseProgress: number // 0 to 1 within current phase
}

// Cubic Hermite smoothstep interpolation
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

// Ease In-Out Sine
function easeInOutSine(x: number): number {
  return -(Math.cos(Math.PI * x) - 1) / 2
}

// 3D vector lerp
function lerp3D(a: Position3D, b: Position3D, t: number): Position3D {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  }
}

// Catmull-Rom spline point calculation in 3D
function catmullRom(
  p0: Position3D,
  p1: Position3D,
  p2: Position3D,
  p3: Position3D,
  t: number
): Position3D {
  const t2 = t * t
  const t3 = t2 * t

  const interpolate = (v0: number, v1: number, v2: number, v3: number) => {
    return (
      0.5 *
      (2 * v1 +
        (-v0 + v2) * t +
        (2 * v0 - 5 * v1 + 4 * v2 - v3) * t2 +
        (-v0 + 3 * v1 - 3 * v2 + v3) * t3)
    )
  }

  return {
    x: interpolate(p0.x, p1.x, p2.x, p3.x),
    y: interpolate(p0.y, p1.y, p2.y, p3.y),
    z: interpolate(p0.z, p1.z, p2.z, p3.z),
  }
}

export class UniverseCameraDirector {
  private visitedHistory: number[] = []

  /**
   * Reset director routing history
   */
  public reset(): void {
    this.visitedHistory = []
  }

  /**
   * Compute ordered list of node indices to visit based on director mode
   */
  public getTargetOrder(
    nodes: PhotoSpatialNode[],
    directorMode: DirectorMode,
    manualOrder?: string[]
  ): number[] {
    if (!nodes || nodes.length === 0) return []
    const total = nodes.length

    if (directorMode === 'manual' && manualOrder && manualOrder.length > 0) {
      const orderIndices: number[] = []
      for (const id of manualOrder) {
        const found = nodes.findIndex((n) => n.photo.id === id)
        if (found !== -1 && !orderIndices.includes(found)) {
          orderIndices.push(found)
        }
      }
      // Fill in any remaining nodes
      for (let i = 0; i < total; i++) {
        if (!orderIndices.includes(i)) orderIndices.push(i)
      }
      return orderIndices.length > 0 ? orderIndices : nodes.map((_, i) => i)
    }

    // Automatic Director: Smooth progressive forward flight with varied distances
    // Generates a sequence of node indices: [0, 1, 2, ..., total - 1]
    return nodes.map((_, i) => i)
  }

  /**
   * Calculate exact camera position, orientation lookAt, and focus distance for currentTime
   */
  public evaluateCamera(
    nodes: PhotoSpatialNode[],
    currentTime: number,
    cameraStyle: CameraMovementStyle = 'smooth-cinematic',
    cameraSpeed: number = 1.0,
    photoFocusDuration: number = 3.2,
    transitionSmoothness: number = 80,
    speedMultiplier: number = 1.0,
    directorMode: DirectorMode = 'auto',
    manualOrder?: string[]
  ): CameraFrameState {
    // Fallback for empty photo collection
    if (!nodes || nodes.length === 0) {
      return {
        position: { x: 0, y: 15, z: 450 },
        lookAt: { x: 0, y: 0, z: 0 },
        targetNodeIndex: -1,
        focusDistance: 450,
        focusWeight: 1,
        travelPhase: 'focus',
        phaseProgress: 1,
      }
    }

    const order = this.getTargetOrder(nodes, directorMode, manualOrder)
    const targetCount = order.length

    // Duration allocated per photo stop (scaled by cameraSpeed and dynamic music speedMultiplier)
    const effectiveSpeed = Math.max(0.3, cameraSpeed * speedMultiplier)
    const cycleDurationPerPhoto = Math.max(1.8, photoFocusDuration / effectiveSpeed)
    const totalLoopDuration = cycleDurationPerPhoto * targetCount

    // Current loop time (loops seamlessly through the universe)
    const loopTime = currentTime % totalLoopDuration
    const rawStep = loopTime / cycleDurationPerPhoto
    const currentStepIndex = Math.floor(rawStep) % targetCount
    const nextStepIndex = (currentStepIndex + 1) % targetCount
    const prevStepIndex = (currentStepIndex - 1 + targetCount) % targetCount
    const futureStepIndex = (currentStepIndex + 2) % targetCount

    const targetNodeIdx = order[currentStepIndex]
    const nextNodeIdx = order[nextStepIndex]
    const prevNodeIdx = order[prevStepIndex]
    const futureNodeIdx = order[futureStepIndex]

    const currentNode = nodes[targetNodeIdx]
    const nextNode = nodes[nextNodeIdx]
    const prevNode = nodes[prevNodeIdx]
    const futureNode = nodes[futureNodeIdx]

    // Normalized progress within current photo cycle [0, 1]
    const u = rawStep - Math.floor(rawStep)

    // Phase division within the photo stop:
    // 0.00 to 0.30: Approach (gliding inward)
    // 0.30 to 0.70: Focus (sharp lingering framing, gentle cinematic drift)
    // 0.70 to 0.85: Fly-by (panning slightly past)
    // 0.85 to 1.00: Transition curve toward next photo approach
    let phase: 'approach' | 'focus' | 'fly-by' | 'transition' = 'focus'
    let phaseProgress = 0
    let focusWeight = 0

    let basePos: Position3D
    let baseLookAt: Position3D = currentNode.lookAtPoint

    if (u < 0.30) {
      // Approach Phase
      phase = 'approach'
      phaseProgress = u / 0.30
      const smoothT = easeInOutSine(phaseProgress)
      basePos = lerp3D(currentNode.cameraApproachPos, currentNode.cameraFocusPos, smoothT)
      focusWeight = smoothstep(0.3, 1.0, phaseProgress)
    } else if (u < 0.70) {
      // Focus Phase (Linger & Cinematic Drift)
      phase = 'focus'
      phaseProgress = (u - 0.30) / 0.40
      focusWeight = 1.0

      // Cinematic style specific drift
      let driftX = 0
      let driftY = 0
      let driftZ = 0

      if (cameraStyle === 'smooth-cinematic') {
        driftX = Math.sin(phaseProgress * Math.PI) * 22
        driftY = Math.cos(phaseProgress * Math.PI) * 8
        driftZ = -phaseProgress * 18
      } else if (cameraStyle === 'rhythmic-flight') {
        driftX = Math.sin(phaseProgress * Math.PI * 2) * 14
        driftY = Math.sin(phaseProgress * Math.PI) * 12
        driftZ = -phaseProgress * 30
      } else if (cameraStyle === 'energetic-orbit') {
        const orbitAngle = phaseProgress * 1.2
        driftX = Math.sin(orbitAngle) * 45
        driftY = Math.cos(orbitAngle) * 15
        driftZ = -phaseProgress * 25
      } else if (cameraStyle === 'slow-dream') {
        driftX = Math.sin(phaseProgress * Math.PI * 0.7) * 18
        driftY = Math.sin(phaseProgress * Math.PI) * 18
        driftZ = -phaseProgress * 8
      }

      basePos = {
        x: currentNode.cameraFocusPos.x + driftX,
        y: currentNode.cameraFocusPos.y + driftY,
        z: currentNode.cameraFocusPos.z + driftZ,
      }
    } else if (u < 0.85) {
      // Fly-by Phase
      phase = 'fly-by'
      phaseProgress = (u - 0.70) / 0.15
      const smoothT = easeInOutSine(phaseProgress)
      basePos = lerp3D(currentNode.cameraFocusPos, currentNode.cameraFlyByPos, smoothT)
      focusWeight = 1.0 - smoothstep(0.4, 1.0, phaseProgress) * 0.6
    } else {
      // Transition Phase toward next photo
      phase = 'transition'
      phaseProgress = (u - 0.85) / 0.15
      const smoothT = easeInOutSine(phaseProgress)

      // Spline curve between fly-by and next approach
      const p0 = currentNode.cameraFocusPos
      const p1 = currentNode.cameraFlyByPos
      const p2 = nextNode.cameraApproachPos
      const p3 = nextNode.cameraFocusPos

      basePos = catmullRom(p0, p1, p2, p3, smoothT)

      // Smoothly transition lookAt from current photo to next photo
      baseLookAt = lerp3D(currentNode.lookAtPoint, nextNode.lookAtPoint, smoothT)
      focusWeight = (1.0 - smoothT) * 0.4
    }

    // Calculate exact focal distance from camera to focused photo center
    const dx = currentNode.position.x - basePos.x
    const dy = currentNode.position.y - basePos.y
    const dz = currentNode.position.z - basePos.z
    const focusDistance = Math.sqrt(dx * dx + dy * dy + dz * dz)

    return {
      position: basePos,
      lookAt: baseLookAt,
      targetNodeIndex: targetNodeIdx,
      focusDistance,
      focusWeight,
      travelPhase: phase,
      phaseProgress,
    }
  }
}

export const universeCameraDirector = new UniverseCameraDirector()
