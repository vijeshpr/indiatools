/**
 * IndiaTools — Multi-Track Timeline Computation Engine
 * Fast timeline arithmetic, snapping, trimming, splitting, and boundaries
 */

import type { TimelineClip, Track } from './types.ts'

export const SNAP_THRESHOLD_PX = 12

export interface SnapTarget {
  timeSec: number
  label: string
}

export function findSnapTime(
  proposedTimeSec: number,
  pxPerSec: number,
  allClips: TimelineClip[],
  playheadSec: number,
  excludeClipId?: string
): { snappedTimeSec: number; didSnap: boolean } {
  const thresholdSec = SNAP_THRESHOLD_PX / Math.max(1, pxPerSec)

  const targets: number[] = [0, playheadSec]

  for (const c of allClips) {
    if (c.id === excludeClipId) continue
    targets.push(c.startSec)
    targets.push(c.startSec + c.durationSec)
  }

  let closestDist = Infinity
  let snappedTime = proposedTimeSec
  let didSnap = false

  for (const t of targets) {
    const dist = Math.abs(proposedTimeSec - t)
    if (dist <= thresholdSec && dist < closestDist) {
      closestDist = dist
      snappedTime = t
      didSnap = true
    }
  }

  return { snappedTimeSec: snappedTime, didSnap }
}

export function splitClipAtTime(
  clip: TimelineClip,
  splitTimeSec: number
): [TimelineClip, TimelineClip] | null {
  // Check if split point is strictly inside visible clip duration (minimum 0.1s slices)
  const relTime = splitTimeSec - clip.startSec
  if (relTime <= 0.1 || relTime >= clip.durationSec - 0.1) {
    return null
  }

  const firstClipDuration = relTime
  const secondClipDuration = clip.durationSec - relTime

  const firstClip: TimelineClip = {
    ...clip,
    id: `clip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    durationSec: firstClipDuration,
    transitionOut: { type: 'none', durationSec: 0 },
  }

  const secondClip: TimelineClip = {
    ...clip,
    id: `clip-${Date.now() + 1}-${Math.random().toString(36).substring(2, 7)}`,
    startSec: splitTimeSec,
    durationSec: secondClipDuration,
    trimStartSec: clip.trimStartSec + relTime * clip.speed,
    transitionIn: { type: 'none', durationSec: 0 },
  }

  return [firstClip, secondClip]
}

export function trimClipStart(
  clip: TimelineClip,
  newStartSec: number,
  minDurationSec = 0.2
): TimelineClip {
  const oldEnd = clip.startSec + clip.durationSec
  const clampedStart = Math.min(newStartSec, oldEnd - minDurationSec)
  const delta = clampedStart - clip.startSec

  return {
    ...clip,
    startSec: Math.max(0, clampedStart),
    durationSec: Math.max(minDurationSec, clip.durationSec - delta),
    trimStartSec: Math.max(0, clip.trimStartSec + delta * clip.speed),
  }
}

export function trimClipEnd(
  clip: TimelineClip,
  newEndSec: number,
  minDurationSec = 0.2
): TimelineClip {
  const clampedEnd = Math.max(clip.startSec + minDurationSec, newEndSec)
  const newDuration = clampedEnd - clip.startSec

  return {
    ...clip,
    durationSec: newDuration,
  }
}

export function calculateTotalProjectDuration(
  clips: TimelineClip[],
  minSec = 10
): number {
  let maxEnd = 0
  for (const c of clips) {
    const end = c.startSec + c.durationSec
    if (end > maxEnd) maxEnd = end
  }
  return Math.max(minSec, Math.ceil(maxEnd))
}

export function getActiveClipsAtTime(
  clips: TimelineClip[],
  tracks: Track[],
  timeSec: number
): TimelineClip[] {
  // Only include clips whose track is NOT hidden
  const hiddenTrackIds = new Set(tracks.filter((t) => t.hidden).map((t) => t.id))

  return clips
    .filter((c) => {
      if (hiddenTrackIds.has(c.trackId)) return false
      return timeSec >= c.startSec && timeSec < c.startSec + c.durationSec
    })
    .sort((a, b) => {
      // Audio tracks play together, visual tracks respect track order
      const trackAIndex = tracks.findIndex((t) => t.id === a.trackId)
      const trackBIndex = tracks.findIndex((t) => t.id === b.trackId)
      return trackAIndex - trackBIndex
    })
}
