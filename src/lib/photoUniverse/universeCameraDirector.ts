/**
 * IndiaTools — Floating Photo Universe 2.0
 * Cinematic Camera Director & Smooth Flight Interpolator
 * Deterministic Planned Camera Choreography, Single-Subject Focus & Sub-Phase Pacing
 */

import {
  CameraMovementStyle,
  DirectorMode,
  TimestampedCameraScore,
} from './photoUniverseTypes.ts'
import { PhotoSpatialNode, Position3D } from './universeLayout.ts'
import { universeCameraScoreGenerator } from './universeCameraScore.ts'

export interface CameraFrameState {
  position: Position3D
  lookAt: Position3D
  targetNodeIndex: number
  focusDistance: number // Physical distance to active focused photo
  focusWeight: number // 1.0 = sharp, locked focus; 0.0 = transitioning
  travelPhase: 'approach' | 'settle' | 'hold' | 'departure' | 'transition' | 'focus' | 'fly-by'
  phaseProgress: number
  shakeAllowed: boolean
}

// Cubic Hermite smoothstep
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

// Ease In-Out Sine
function easeInOutSine(x: number): number {
  return -(Math.cos(Math.PI * x) - 1) / 2
}

// 3D vector linear interpolation
function lerp3D(a: Position3D, b: Position3D, t: number): Position3D {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  }
}

// Catmull-Rom cubic spline interpolation in 3D
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
  /**
   * Determine target visit order for photos
   */
  public getTargetOrder(
    nodes: PhotoSpatialNode[],
    directorMode: DirectorMode = 'auto',
    manualOrder: string[] = []
  ): number[] {
    if (!nodes || nodes.length === 0) return []
    if (directorMode === 'manual' && manualOrder.length > 0) {
      const indices: number[] = []
      manualOrder.forEach((id) => {
        const idx = nodes.findIndex((n) => n.photo.id === id)
        if (idx !== -1 && !indices.includes(idx)) indices.push(idx)
      })
      for (let i = 0; i < nodes.length; i++) {
        if (!indices.includes(i)) indices.push(i)
      }
      return indices
    }
    return nodes.map((_, i) => i)
  }

  /**
   * Evaluates exact camera position, lookAt, focus distance and sub-phase for currentTime
   * Supports both planned TimestampedCameraScore and legacy signature fallback.
   */
  public evaluateCamera(
    nodes: PhotoSpatialNode[],
    currentTime: number,
    scoreOrStyle?: TimestampedCameraScore | CameraMovementStyle | null,
    cameraStyleOrSpeed: CameraMovementStyle | number = 'smooth-cinematic',
    cameraSpeedOrDuration: number = 0.85,
    focusDurationOrMultiplier: number = 4.0,
    directorModeOrManual: DirectorMode = 'auto',
    manualOrder: string[] = [],
    speedMultiplier: number = 1.0
  ): CameraFrameState {
    if (!nodes || nodes.length === 0) {
      const idleFloatX = Math.sin(currentTime * 0.15) * 35
      const idleFloatY = Math.cos(currentTime * 0.12) * 20
      return {
        position: { x: idleFloatX, y: 15 + idleFloatY, z: 500 },
        lookAt: { x: 0, y: 0, z: 0 },
        targetNodeIndex: -1,
        focusDistance: 500,
        focusWeight: 1,
        travelPhase: 'hold',
        phaseProgress: 1,
        shakeAllowed: false,
      }
    }

    let score: TimestampedCameraScore | null = null
    let cameraStyle: CameraMovementStyle = 'smooth-cinematic'
    let cameraSpeed = 0.85
    let focusDuration = 4.0
    let effectiveMultiplier = 1.0

    if (
      scoreOrStyle &&
      typeof scoreOrStyle === 'object' &&
      Array.isArray((scoreOrStyle as unknown as { segments: unknown[] }).segments)
    ) {
      score = scoreOrStyle as TimestampedCameraScore
      if (typeof cameraStyleOrSpeed === 'string') {
        cameraStyle = cameraStyleOrSpeed
      }
      if (typeof cameraSpeedOrDuration === 'number') {
        cameraSpeed = cameraSpeedOrDuration
      }
      if (typeof focusDurationOrMultiplier === 'number') {
        effectiveMultiplier = focusDurationOrMultiplier
      }
    } else {
      // Legacy style-first call: (nodes, currentTime, style, speed, focusDuration, ...)
      if (typeof scoreOrStyle === 'string') {
        cameraStyle = scoreOrStyle as CameraMovementStyle
      }
      if (typeof cameraStyleOrSpeed === 'number') {
        cameraSpeed = cameraStyleOrSpeed
      }
      if (typeof cameraSpeedOrDuration === 'number') {
        focusDuration = cameraSpeedOrDuration
      }
      if (typeof speedMultiplier === 'number') {
        effectiveMultiplier = speedMultiplier
      }
    }

    // If score is present, evaluate against the planned score
    if (score && Array.isArray(score.segments) && score.segments.length > 0) {
      const active = universeCameraScoreGenerator.getSegmentAtTime(score, currentTime)
      if (active) {
        const seg = active.segment
        const nodeIdx = seg.photoIndex < nodes.length ? seg.photoIndex : 0
        const currentNode = nodes[nodeIdx]
        const nextIdx = (nodeIdx + 1) % nodes.length
        const nextNode = nodes[nextIdx]

        const subPhase = active.subPhase
        const subP = active.subProgress

        let basePos: Position3D
        let baseLookAt: Position3D = currentNode.lookAtPoint
        let focusWeight = 1.0
        let shakeAllowed = false

        if (subPhase === 'approach') {
          const smoothT = easeInOutSine(subP)
          basePos = lerp3D(currentNode.cameraApproachPos, currentNode.cameraFocusPos, smoothT)
          focusWeight = smoothstep(0.4, 1.0, subP)
          shakeAllowed = true
        } else if (subPhase === 'settle') {
          // Decelerate into optimal framing distance with subtle rule of thirds framing
          const smoothT = smoothstep(0, 1, subP)
          const targetWithOffset: Position3D = {
            x: currentNode.cameraFocusPos.x + seg.framingOffset.x * currentNode.worldWidth,
            y: currentNode.cameraFocusPos.y + seg.framingOffset.y * currentNode.worldHeight,
            z: currentNode.cameraFocusPos.z,
          }
          basePos = lerp3D(currentNode.cameraFocusPos, targetWithOffset, smoothT)
          focusWeight = 1.0
          shakeAllowed = false // strictly no shake while settling
        } else if (subPhase === 'hold') {
          // Central Focus Hold: Photograph stays prominently visible and sharp for 2.5–5.0 seconds
          // Gentle, elegant breathing drift (controlled, non-distracting)
          let driftX = 0
          let driftY = 0
          let driftZ = 0

          if (cameraStyle === 'smooth-cinematic' || cameraStyle === 'slow-dream') {
            driftX = Math.sin(subP * Math.PI) * 10
            driftY = Math.cos(subP * Math.PI) * 5
            driftZ = -subP * 8
          } else if (cameraStyle === 'rhythmic-flight') {
            driftX = Math.sin(subP * Math.PI * 2) * 8
            driftY = Math.sin(subP * Math.PI) * 6
            driftZ = -subP * 14
          } else if (cameraStyle === 'energetic-orbit') {
            const orbit = subP * 0.8
            driftX = Math.sin(orbit) * 22
            driftY = Math.cos(orbit) * 8
            driftZ = -subP * 12
          }

          basePos = {
            x: currentNode.cameraFocusPos.x + seg.framingOffset.x * currentNode.worldWidth + driftX,
            y: currentNode.cameraFocusPos.y + seg.framingOffset.y * currentNode.worldHeight + driftY,
            z: currentNode.cameraFocusPos.z + driftZ,
          }
          focusWeight = 1.0
          shakeAllowed = false // Protected hold: photo remains readable and stable
        } else if (subPhase === 'departure') {
          // Smooth curved departure away from photo
          const smoothT = easeInOutSine(subP)
          basePos = lerp3D(currentNode.cameraFocusPos, currentNode.cameraFlyByPos, smoothT)
          focusWeight = 1.0 - smoothstep(0.4, 1.0, subP) * 0.5
          shakeAllowed = true
        } else {
          // Transition toward next photo
          const smoothT = easeInOutSine(subP)
          basePos = catmullRom(
            currentNode.cameraFocusPos,
            currentNode.cameraFlyByPos,
            nextNode.cameraApproachPos,
            nextNode.cameraFocusPos,
            smoothT
          )
          baseLookAt = lerp3D(currentNode.lookAtPoint, nextNode.lookAtPoint, smoothT)
          focusWeight = (1.0 - smoothT) * 0.4
          shakeAllowed = true
        }

        const dx = currentNode.position.x - basePos.x
        const dy = currentNode.position.y - basePos.y
        const dz = currentNode.position.z - basePos.z
        const focusDistance = Math.sqrt(dx * dx + dy * dy + dz * dz)

        return {
          position: basePos,
          lookAt: baseLookAt,
          targetNodeIndex: nodeIdx,
          focusDistance,
          focusWeight,
          travelPhase: subPhase,
          phaseProgress: subP,
          shakeAllowed,
        }
      }
    }

    // Fallback if score is not generated: smooth progressive flight
    const effectiveSpeed = Math.max(0.4, cameraSpeed * effectiveMultiplier)
    const holdDuration = Math.max(1.5, focusDuration / effectiveSpeed)
    const targetCount = nodes.length
    const totalLoop = holdDuration * targetCount

    const loopTime = currentTime % totalLoop
    const step = Math.floor(loopTime / holdDuration) % targetCount
    const nextStep = (step + 1) % targetCount
    const u = (loopTime % holdDuration) / holdDuration

    const currentNode = nodes[step]
    const nextNode = nodes[nextStep]

    let basePos: Position3D
    let baseLookAt: Position3D = currentNode.lookAtPoint
    let focusWeight = 1.0
    let travelPhase: 'approach' | 'settle' | 'hold' | 'departure' | 'transition' | 'focus' | 'fly-by' = 'hold'
    let shakeAllowed = false

    // Distinct movement styles in fallback
    let styleOffsetX = 0
    let styleOffsetY = 0
    let styleOffsetZ = 0
    if (cameraStyle === 'energetic-orbit') {
      const angle = (currentTime * 0.8) % (Math.PI * 2)
      styleOffsetX = Math.sin(angle) * 35
      styleOffsetY = Math.cos(angle) * 15
      styleOffsetZ = Math.cos(angle * 0.5) * 20
    } else if (cameraStyle === 'slow-dream') {
      styleOffsetX = Math.sin(currentTime * 0.3) * 12
      styleOffsetY = Math.sin(currentTime * 0.4) * 8
      styleOffsetZ = Math.cos(currentTime * 0.25) * 15
    }

    if (u < 0.25) {
      travelPhase = 'approach'
      const t = easeInOutSine(u / 0.25)
      basePos = lerp3D(currentNode.cameraApproachPos, currentNode.cameraFocusPos, t)
      focusWeight = smoothstep(0.3, 1.0, t)
      shakeAllowed = true
    } else if (u < 0.70) {
      travelPhase = 'focus'
      const t = (u - 0.25) / 0.45
      basePos = {
        x: currentNode.cameraFocusPos.x + Math.sin(t * Math.PI) * 10 + styleOffsetX,
        y: currentNode.cameraFocusPos.y + Math.cos(t * Math.PI) * 5 + styleOffsetY,
        z: currentNode.cameraFocusPos.z - t * 8 + styleOffsetZ,
      }
      focusWeight = 1.0
      shakeAllowed = false
    } else if (u < 0.85) {
      travelPhase = 'fly-by'
      const t = easeInOutSine((u - 0.70) / 0.15)
      basePos = lerp3D(currentNode.cameraFocusPos, currentNode.cameraFlyByPos, t)
      basePos.x += styleOffsetX * 0.5
      basePos.y += styleOffsetY * 0.5
      focusWeight = 1.0 - t * 0.4
      shakeAllowed = true
    } else {
      travelPhase = 'transition'
      const t = easeInOutSine((u - 0.85) / 0.15)
      basePos = catmullRom(
        currentNode.cameraFocusPos,
        currentNode.cameraFlyByPos,
        nextNode.cameraApproachPos,
        nextNode.cameraFocusPos,
        t
      )
      baseLookAt = lerp3D(currentNode.lookAtPoint, nextNode.lookAtPoint, t)
      focusWeight = (1.0 - t) * 0.4
      shakeAllowed = true
    }

    const dx = currentNode.position.x - basePos.x
    const dy = currentNode.position.y - basePos.y
    const dz = currentNode.position.z - basePos.z
    const focusDistance = Math.sqrt(dx * dx + dy * dy + dz * dz)

    return {
      position: basePos,
      lookAt: baseLookAt,
      targetNodeIndex: step,
      focusDistance,
      focusWeight,
      travelPhase,
      phaseProgress: u,
      shakeAllowed,
    }
  }
}

export const universeCameraDirector = new UniverseCameraDirector()
