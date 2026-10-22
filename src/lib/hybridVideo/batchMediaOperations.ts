/**
 * IndiaTools — Hybrid Video Studio Batch Media Insertion Engine
 * Inserts all eligible media items cleanly into primary video track without gaps or duplicates
 */

import type {
  HybridVideoProject,
  MediaAsset,
  TimelineClip,
  Track,
} from './types.ts'
import {
  DEFAULT_TRANSFORM,
  DEFAULT_EFFECTS,
  DEFAULT_AUDIO_PROPS,
} from './types.ts'
import { calculateTotalProjectDuration } from './timelineEngine.ts'

export interface BatchInsertOptions {
  mediaFilter: 'all' | 'images-only' | 'videos-only'
  order: 'library' | 'shuffle'
  stillImageDurationSec: number // default 3.0s
  placement: 'timeline-start' | 'playhead'
  mode: 'replace-primary-track' | 'append'
  primaryTrackId?: string
}

export function filterAndOrderMedia(
  assets: MediaAsset[],
  filter: 'all' | 'images-only' | 'videos-only',
  order: 'library' | 'shuffle'
): MediaAsset[] {
  let filtered = assets.filter((a) => {
    if (filter === 'images-only') return a.type === 'image'
    if (filter === 'videos-only') return a.type === 'video'
    return a.type === 'image' || a.type === 'video'
  })

  if (order === 'shuffle') {
    // Fisher-Yates shuffle copy
    const shuffled = [...filtered]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  return [...filtered]
}

export function batchInsertMediaToTimeline(
  project: HybridVideoProject,
  options: BatchInsertOptions,
  currentPlayheadSec = 0
): { updatedProject: HybridVideoProject; insertedCount: number; summary: string } {
  // 1. Identify primary video track (usually V1)
  const primaryTrack =
    project.tracks.find((t) => t.id === options.primaryTrackId) ||
    project.tracks.find((t) => t.type === 'video') ||
    project.tracks.find((t) => t.type === 'image') ||
    project.tracks[0]

  if (!primaryTrack) {
    throw new Error('No compatible video track found on timeline')
  }

  // 2. Filter & order assets
  const eligibleAssets = filterAndOrderMedia(
    project.mediaAssets,
    options.mediaFilter,
    options.order
  )

  if (eligibleAssets.length === 0) {
    return {
      updatedProject: project,
      insertedCount: 0,
      summary: 'No eligible media items found in library to insert.',
    }
  }

  // 3. Determine base starting time
  let startOffsetSec = 0
  let retainedClips: TimelineClip[] = []

  if (options.mode === 'replace-primary-track') {
    // Keep clips from all OTHER tracks (audio, text, overlays), clear primary track
    retainedClips = project.clips.filter((c) => c.trackId !== primaryTrack.id)
    startOffsetSec = options.placement === 'playhead' ? Math.max(0, currentPlayheadSec) : 0
  } else {
    // Append mode: keep all existing clips
    retainedClips = [...project.clips]
    if (options.placement === 'playhead') {
      startOffsetSec = Math.max(0, currentPlayheadSec)
    } else {
      // Find the end of the last clip on the primary track
      const existingTrackClips = retainedClips.filter((c) => c.trackId === primaryTrack.id)
      for (const c of existingTrackClips) {
        const end = c.startSec + c.durationSec
        if (end > startOffsetSec) startOffsetSec = end
      }
    }
  }

  // 4. Construct contiguous sequential clips
  let cursorSec = startOffsetSec
  const newClips: TimelineClip[] = []
  const defaultStillSec = Math.max(0.5, options.stillImageDurationSec || 3.0)

  for (let i = 0; i < eligibleAssets.length; i++) {
    const asset = eligibleAssets[i]
    // Use actual duration for video, configurable still duration for images
    const clipDuration = asset.type === 'video' ? Math.max(0.5, asset.durationSec) : defaultStillSec

    const clip: TimelineClip = {
      id: `clip-batch-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
      trackId: primaryTrack.id,
      assetId: asset.id,
      name: asset.name,
      type: asset.type,
      startSec: Number(cursorSec.toFixed(3)),
      durationSec: Number(clipDuration.toFixed(3)),
      trimStartSec: 0,
      trimEndSec: 0,
      speed: 1.0,
      transform: { ...DEFAULT_TRANSFORM, fitMode: 'fit' },
      keyframes: [],
      effects: {
        ...DEFAULT_EFFECTS,
        colorGrading: { ...DEFAULT_EFFECTS.colorGrading },
        filters: { ...DEFAULT_EFFECTS.filters },
      },
      transitionIn: { type: 'none', durationSec: 0 },
      transitionOut: { type: 'none', durationSec: 0 },
      audioProps: { ...DEFAULT_AUDIO_PROPS },
    }

    newClips.push(clip)
    cursorSec += clipDuration
  }

  const combinedClips = [...retainedClips, ...newClips]
  const newTotalDuration = calculateTotalProjectDuration(combinedClips, project.settings.durationSec)

  const imagesCount = eligibleAssets.filter((a) => a.type === 'image').length
  const videosCount = eligibleAssets.filter((a) => a.type === 'video').length
  const summary = `Added ${imagesCount > 0 ? `${imagesCount} photo${imagesCount > 1 ? 's' : ''}` : ''}${
    imagesCount > 0 && videosCount > 0 ? ' and ' : ''
  }${videosCount > 0 ? `${videosCount} video${videosCount > 1 ? 's' : ''}` : ''} to ${primaryTrack.name}.`

  return {
    updatedProject: {
      ...project,
      settings: {
        ...project.settings,
        durationSec: newTotalDuration,
      },
      clips: combinedClips,
    },
    insertedCount: newClips.length,
    summary,
  }
}
