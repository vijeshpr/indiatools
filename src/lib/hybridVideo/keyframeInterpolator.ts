/**
 * IndiaTools — Keyframe Interpolation Engine
 * Smooth linear & cubic interpolation between keyframes
 */

import type { ClipTransform, Keyframe } from './types.ts'

export function interpolateKeyframes(
  baseTransform: ClipTransform,
  keyframes: Keyframe[],
  clipRelativeTimeSec: number
): ClipTransform {
  if (!keyframes || keyframes.length === 0) {
    return { ...baseTransform }
  }

  // Sort keyframes chronologically
  const sorted = [...keyframes].sort((a, b) => a.timeSec - b.timeSec)

  // Before first keyframe: use first keyframe values merged on base
  if (clipRelativeTimeSec <= sorted[0].timeSec) {
    return {
      ...baseTransform,
      ...sorted[0].transform,
    }
  }

  // After last keyframe: use last keyframe values merged on base
  const lastKf = sorted[sorted.length - 1]
  if (clipRelativeTimeSec >= lastKf.timeSec) {
    return {
      ...baseTransform,
      ...lastKf.transform,
    }
  }

  // Find surrounding pair [k0, k1]
  let k0 = sorted[0]
  let k1 = sorted[1]
  for (let i = 0; i < sorted.length - 1; i++) {
    if (clipRelativeTimeSec >= sorted[i].timeSec && clipRelativeTimeSec <= sorted[i + 1].timeSec) {
      k0 = sorted[i]
      k1 = sorted[i + 1]
      break
    }
  }

  const span = k1.timeSec - k0.timeSec
  const t = span > 0 ? (clipRelativeTimeSec - k0.timeSec) / span : 0

  // Smooth ease-in-out cosine curve for organic motion
  const smoothT = 0.5 * (1 - Math.cos(Math.PI * t))

  // Interpolate numerical properties
  const x0 = k0.transform.x ?? baseTransform.x
  const x1 = k1.transform.x ?? baseTransform.x
  const y0 = k0.transform.y ?? baseTransform.y
  const y1 = k1.transform.y ?? baseTransform.y
  const scale0 = k0.transform.scale ?? baseTransform.scale
  const scale1 = k1.transform.scale ?? baseTransform.scale
  const rot0 = k0.transform.rotationDeg ?? baseTransform.rotationDeg
  const rot1 = k1.transform.rotationDeg ?? baseTransform.rotationDeg
  const op0 = k0.transform.opacity ?? baseTransform.opacity
  const op1 = k1.transform.opacity ?? baseTransform.opacity

  return {
    ...baseTransform,
    x: x0 + (x1 - x0) * smoothT,
    y: y0 + (y1 - y0) * smoothT,
    scale: scale0 + (scale1 - scale0) * smoothT,
    rotationDeg: rot0 + (rot1 - rot0) * smoothT,
    opacity: Math.max(0, Math.min(1, op0 + (op1 - op0) * smoothT)),
    fitMode: k1.transform.fitMode || baseTransform.fitMode,
  }
}
