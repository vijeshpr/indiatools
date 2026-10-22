/**
 * IndiaTools — Hybrid Video Transitions Engine
 * Comprehensive Transition Library: Clean, Cinematic, Dynamic, Stylized
 * Computes opacity, key transforms, wipes, and music-synchronized alignments
 */

import type {
  ClipTransition,
  TransitionType,
  TransitionSyncMode,
  TransitionAlignment,
  TimelineClip,
} from './types.ts'
import type { MusicAnalysisResult } from './musicIntelligence.ts'

export interface TransitionState {
  opacityMultiplier: number
  scaleMultiplier: number
  offsetX: number
  offsetY: number
  rotationDeg: number
  wipeProgress: number // 0 (hidden) to 1 (fully revealed)
  wipeType?: 'horizontal-left' | 'horizontal-right' | 'radial'
  blurPx: number
  flashAlpha: number
  flashColor?: string
  rgbSplitPx: number
  isGlitch: boolean
  filmBurnAlpha: number
}

export type TransitionCategory = 'clean' | 'cinematic' | 'dynamic' | 'stylized'

export interface TransitionMetadata {
  id: TransitionType
  name: string
  category: TransitionCategory
  description: string
  defaultDurationSec: number
}

export const TRANSITION_LIBRARY: TransitionMetadata[] = [
  // Clean Transitions
  { id: 'none', name: 'Instant Cut', category: 'clean', description: 'Immediate direct cut with no transition', defaultDurationSec: 0 },
  { id: 'crossfade', name: 'Smooth Crossfade', category: 'clean', description: 'Gentle, balanced dissolve between layers', defaultDurationSec: 0.5 },
  { id: 'fade-black', name: 'Fade to Black', category: 'clean', description: 'Cinematic blackout between scenes', defaultDurationSec: 0.6 },
  { id: 'fade-white', name: 'Flash to White', category: 'clean', description: 'High-exposure white flash cut', defaultDurationSec: 0.4 },

  // Cinematic Transitions
  { id: 'smooth-zoom', name: 'Smooth Zoom', category: 'cinematic', description: 'Continuous optical camera zoom dissolve', defaultDurationSec: 0.6 },
  { id: 'push-in', name: 'Push In', category: 'cinematic', description: 'Smooth forward camera push into the frame', defaultDurationSec: 0.55 },
  { id: 'pull-out', name: 'Pull Out', category: 'cinematic', description: 'Cinematic wide reveal zooming backwards', defaultDurationSec: 0.55 },
  { id: 'pan-left', name: 'Pan Left', category: 'cinematic', description: 'Camera tracks horizontally from right to left', defaultDurationSec: 0.5 },
  { id: 'pan-right', name: 'Pan Right', category: 'cinematic', description: 'Camera tracks horizontally from left to right', defaultDurationSec: 0.5 },
  { id: 'tilt-up', name: 'Tilt Up', category: 'cinematic', description: 'Camera tilts vertically upwards into frame', defaultDurationSec: 0.5 },
  { id: 'tilt-down', name: 'Tilt Down', category: 'cinematic', description: 'Camera tilts vertically downwards into frame', defaultDurationSec: 0.5 },
  { id: 'blur-dissolve', name: 'Blur Dissolve', category: 'cinematic', description: 'Dreamy optical defocus blur transition', defaultDurationSec: 0.5 },
  { id: 'light-leak', name: 'Light Leak', category: 'cinematic', description: 'Warm amber lens flare wash over the cut', defaultDurationSec: 0.6 },

  // Dynamic Transitions
  { id: 'scale-punch', name: 'Scale Punch', category: 'dynamic', description: 'Fast rhythmic scale bounce on the beat', defaultDurationSec: 0.3 },
  { id: 'whip-pan-left', name: 'Whip Pan Left', category: 'dynamic', description: 'High-speed directional blur pan to the left', defaultDurationSec: 0.35 },
  { id: 'whip-pan-right', name: 'Whip Pan Right', category: 'dynamic', description: 'High-speed directional blur pan to the right', defaultDurationSec: 0.35 },
  { id: 'motion-blur-swipe', name: 'Motion Swipe', category: 'dynamic', description: 'Fast vertical motion swipe with motion blur', defaultDurationSec: 0.35 },
  { id: 'zoom-blur', name: 'Zoom Blur', category: 'dynamic', description: 'Explosive radial push with zoom streaks', defaultDurationSec: 0.35 },
  { id: 'fade-wipe-left', name: 'Linear Wipe Left', category: 'dynamic', description: 'Sharp horizontal edge wipe sliding left', defaultDurationSec: 0.45 },
  { id: 'fade-wipe-right', name: 'Linear Wipe Right', category: 'dynamic', description: 'Sharp horizontal edge wipe sliding right', defaultDurationSec: 0.45 },
  { id: 'radial-wipe', name: 'Clock Iris Wipe', category: 'dynamic', description: 'Circular expanding clock/iris wipe', defaultDurationSec: 0.5 },
  { id: 'glitch-split', name: 'Glitch Split', category: 'dynamic', description: 'Digital RGB displacement twitch across cut', defaultDurationSec: 0.25 },
  { id: 'rgb-split-trans', name: 'RGB Split Swipe', category: 'dynamic', description: 'Chromatic color separation lateral swipe', defaultDurationSec: 0.3 },
  { id: 'flash-cut', name: '2-Frame Flash Cut', category: 'dynamic', description: 'Ultra-fast 2-frame strobe cut on beat hits', defaultDurationSec: 0.15 },

  // Stylized Transitions
  { id: 'film-burn', name: 'Film Burn', category: 'stylized', description: 'Vintage 35mm film reel burn and exposure edge', defaultDurationSec: 0.55 },
  { id: 'prism-split', name: 'Prism Split', category: 'stylized', description: 'Refractive rainbow glass prism dispersion', defaultDurationSec: 0.45 },
  { id: 'ripple-distort', name: 'Ripple Distort', category: 'stylized', description: 'Liquid glass ripple wave outward', defaultDurationSec: 0.45 },
  { id: 'digital-glitch', name: 'Digital Glitch', category: 'stylized', description: 'Blocky pixel corruption and sync drop', defaultDurationSec: 0.25 },
  { id: 'light-sweep', name: 'Light Sweep', category: 'stylized', description: 'Anamorphic horizontal streak laser sweep', defaultDurationSec: 0.4 },
]

export function computeClipTransition(
  transitionIn: ClipTransition,
  transitionOut: ClipTransition,
  relTimeSec: number,
  durationSec: number,
  canvasWidth: number,
  canvasHeight = 1080
): TransitionState {
  const result: TransitionState = {
    opacityMultiplier: 1,
    scaleMultiplier: 1,
    offsetX: 0,
    offsetY: 0,
    rotationDeg: 0,
    wipeProgress: 1,
    blurPx: 0,
    flashAlpha: 0,
    flashColor: '#ffffff',
    rgbSplitPx: 0,
    isGlitch: false,
    filmBurnAlpha: 0,
  }

  // 1. In-Transition (Entrance)
  if (transitionIn.type !== 'none' && transitionIn.durationSec > 0 && relTimeSec < transitionIn.durationSec) {
    const t = Math.max(0, Math.min(1, relTimeSec / transitionIn.durationSec))
    applyTransitionType(transitionIn.type, t, true, result, canvasWidth, canvasHeight)
  }

  // 2. Out-Transition (Exit)
  const outStart = durationSec - transitionOut.durationSec
  if (transitionOut.type !== 'none' && transitionOut.durationSec > 0 && relTimeSec > outStart) {
    const t = Math.max(0, Math.min(1, (durationSec - relTimeSec) / transitionOut.durationSec))
    applyTransitionType(transitionOut.type, t, false, result, canvasWidth, canvasHeight)
  }

  return result
}

function applyTransitionType(
  type: TransitionType,
  progress: number, // 0 = start of intro / end of outro; 1 = fully settled
  isIntro: boolean,
  state: TransitionState,
  canvasWidth: number,
  canvasHeight: number
): void {
  // Common smooth easing
  const easeProgress = 0.5 - 0.5 * Math.cos(Math.PI * progress)

  switch (type) {
    // === CLEAN ===
    case 'none':
      break

    case 'crossfade':
      state.opacityMultiplier *= easeProgress
      break

    case 'fade-black':
      state.opacityMultiplier *= progress < 0.5 ? progress * 2 : 1
      break

    case 'fade-white':
      state.opacityMultiplier *= progress
      state.flashAlpha = Math.max(state.flashAlpha, (1 - progress) * 0.8)
      state.flashColor = '#ffffff'
      break

    // === CINEMATIC ===
    case 'smooth-zoom':
      state.opacityMultiplier *= easeProgress
      state.scaleMultiplier *= isIntro ? 1 + (1 - easeProgress) * 0.25 : 1 - (1 - easeProgress) * 0.2
      break

    case 'push-in':
      state.opacityMultiplier *= easeProgress
      state.scaleMultiplier *= 1 + (1 - easeProgress) * 0.3
      break

    case 'pull-out':
      state.opacityMultiplier *= easeProgress
      state.scaleMultiplier *= Math.max(0.7, 1 - (1 - easeProgress) * 0.25)
      break

    case 'pan-left': {
      const offset = (1 - easeProgress) * canvasWidth
      state.offsetX += isIntro ? offset : -offset
      state.opacityMultiplier *= Math.min(1, easeProgress * 1.5)
      break
    }

    case 'pan-right': {
      const offset = (1 - easeProgress) * canvasWidth
      state.offsetX += isIntro ? -offset : offset
      state.opacityMultiplier *= Math.min(1, easeProgress * 1.5)
      break
    }

    case 'tilt-up': {
      const offset = (1 - easeProgress) * canvasHeight
      state.offsetY += isIntro ? offset : -offset
      state.opacityMultiplier *= Math.min(1, easeProgress * 1.5)
      break
    }

    case 'tilt-down': {
      const offset = (1 - easeProgress) * canvasHeight
      state.offsetY += isIntro ? -offset : offset
      state.opacityMultiplier *= Math.min(1, easeProgress * 1.5)
      break
    }

    case 'blur-dissolve':
      state.opacityMultiplier *= easeProgress
      state.blurPx = Math.max(state.blurPx, (1 - easeProgress) * 16)
      break

    case 'light-leak':
      state.opacityMultiplier *= easeProgress
      state.flashAlpha = Math.max(state.flashAlpha, (1 - easeProgress) * 0.65)
      state.flashColor = '#f59e0b' // warm amber
      break

    // === DYNAMIC ===
    case 'scale-punch':
      state.scaleMultiplier *= 1 + (1 - progress) * 0.22
      state.opacityMultiplier *= progress
      break

    case 'whip-pan-left': {
      const panOffset = (1 - progress) * canvasWidth
      state.offsetX += isIntro ? panOffset : -panOffset
      state.blurPx = Math.max(state.blurPx, (1 - progress) * 8)
      state.opacityMultiplier *= Math.min(1, progress * 1.5)
      break
    }

    case 'whip-pan-right': {
      const panOffsetR = (1 - progress) * canvasWidth
      state.offsetX += isIntro ? -panOffsetR : panOffsetR
      state.blurPx = Math.max(state.blurPx, (1 - progress) * 8)
      state.opacityMultiplier *= Math.min(1, progress * 1.5)
      break
    }

    case 'motion-blur-swipe': {
      const swipeOffset = (1 - progress) * canvasHeight
      state.offsetY += isIntro ? swipeOffset : -swipeOffset
      state.blurPx = Math.max(state.blurPx, (1 - progress) * 10)
      state.opacityMultiplier *= Math.min(1, progress * 1.5)
      break
    }

    case 'zoom-blur':
      state.scaleMultiplier *= 1 + (1 - progress) * 0.35
      state.blurPx = Math.max(state.blurPx, (1 - progress) * 12)
      state.opacityMultiplier *= easeProgress
      break

    case 'fade-wipe-left':
      state.wipeProgress = progress
      state.wipeType = 'horizontal-left'
      state.opacityMultiplier *= progress
      break

    case 'fade-wipe-right':
      state.wipeProgress = progress
      state.wipeType = 'horizontal-right'
      state.opacityMultiplier *= progress
      break

    case 'radial-wipe':
      state.wipeProgress = progress
      state.wipeType = 'radial'
      state.opacityMultiplier *= progress
      break

    case 'glitch-split':
      if (progress < 0.85) {
        state.isGlitch = true
        state.offsetX += (Math.sin(progress * 40) - 0.5) * 20 * (1 - progress)
        state.rgbSplitPx = Math.max(state.rgbSplitPx, (1 - progress) * 18)
      }
      break

    case 'rgb-split-trans':
      state.opacityMultiplier *= easeProgress
      state.rgbSplitPx = Math.max(state.rgbSplitPx, (1 - progress) * 24)
      state.offsetX += isIntro ? (1 - progress) * 40 : -(1 - progress) * 40
      break

    case 'flash-cut':
      state.opacityMultiplier *= progress
      if (progress < 0.4) {
        state.flashAlpha = Math.max(state.flashAlpha, (1 - progress / 0.4) * 0.95)
        state.flashColor = '#ffffff'
      }
      break

    // === STYLIZED ===
    case 'film-burn':
      state.opacityMultiplier *= easeProgress
      state.filmBurnAlpha = Math.max(state.filmBurnAlpha, (1 - progress) * 0.75)
      state.flashAlpha = Math.max(state.flashAlpha, (1 - progress) * 0.4)
      state.flashColor = '#f97316'
      break

    case 'prism-split':
      state.opacityMultiplier *= easeProgress
      state.rgbSplitPx = Math.max(state.rgbSplitPx, (1 - progress) * 20)
      state.rotationDeg += (1 - progress) * (isIntro ? 2.5 : -2.5)
      break

    case 'ripple-distort':
      state.opacityMultiplier *= easeProgress
      state.scaleMultiplier *= 1 + Math.sin(progress * 18) * 0.04 * (1 - progress)
      break

    case 'digital-glitch':
      if (progress < 0.85) {
        state.isGlitch = true
        state.offsetX += (Math.cos(progress * 60) - 0.5) * 25 * (1 - progress)
        state.offsetY += (Math.sin(progress * 45) - 0.5) * 15 * (1 - progress)
        state.rgbSplitPx = Math.max(state.rgbSplitPx, (1 - progress) * 16)
      }
      break

    case 'light-sweep':
      state.opacityMultiplier *= easeProgress
      state.flashAlpha = Math.max(state.flashAlpha, Math.sin(progress * Math.PI) * 0.5)
      state.flashColor = '#38bdf8' // neon cyan
      state.offsetX += (1 - easeProgress) * (isIntro ? 60 : -60)
      break
  }
}

/**
 * Align transition duration & boundary to musical beats, phrase boundaries, or downbeats.
 */
export function alignTransitionToMusic(
  transition: ClipTransition,
  clip: TimelineClip,
  musicAnalysis: MusicAnalysisResult | null | undefined,
  target: 'in' | 'out'
): ClipTransition {
  if (!musicAnalysis || !transition.syncMode || transition.syncMode === 'manual') {
    return transition
  }

  const clipCutTimestamp = target === 'in' ? clip.startSec : clip.startSec + clip.durationSec

  let closestEventTime: number | null = null
  switch (transition.syncMode) {
    case 'phrase-boundary':
      closestEventTime = findClosestEvent(musicAnalysis.phraseBoundaries, clipCutTimestamp)
      break
    case 'energy-peak':
    case 'on-beat':
    case 'beat-to-beat':
    default:
      closestEventTime = findClosestEvent(
        musicAnalysis.downbeats && musicAnalysis.downbeats.length > 0
          ? musicAnalysis.downbeats
          : musicAnalysis.beats,
        clipCutTimestamp
      )
      break
  }

  if (closestEventTime === null) {
    return transition
  }

  // Calculate beat interval for beat-to-beat sync
  const bpm = musicAnalysis.bpm > 40 && musicAnalysis.bpm < 240 ? musicAnalysis.bpm : 120
  const singleBeatDuration = 60 / bpm

  let newDuration = transition.durationSec
  if (transition.syncMode === 'beat-to-beat') {
    newDuration = Number((singleBeatDuration * 2).toFixed(2)) // 2 beats
  } else if (transition.syncMode === 'on-beat') {
    newDuration = Number(singleBeatDuration.toFixed(2)) // 1 beat
  } else if (transition.syncMode === 'phrase-boundary') {
    newDuration = Number((singleBeatDuration * 4).toFixed(2)) // 1 full bar (4 beats)
  }

  // Ensure duration doesn't exceed clip boundary
  const maxSafeDuration = Math.max(0.1, clip.durationSec * 0.45)
  newDuration = Math.min(newDuration, maxSafeDuration)

  return {
    ...transition,
    durationSec: Number(newDuration.toFixed(2)),
  }
}

function findClosestEvent(timestamps: number[], target: number): number | null {
  if (!timestamps || timestamps.length === 0) return null
  let closest = timestamps[0]
  let minDiff = Math.abs(target - timestamps[0])

  for (const t of timestamps) {
    const diff = Math.abs(target - t)
    if (diff < minDiff) {
      minDiff = diff
      closest = t
    }
  }

  return closest
}

/**
 * Apply a transition to all cuts on video/image tracks.
 */
export function applyTransitionToAllCuts(
  clips: TimelineClip[],
  transition: ClipTransition,
  target: 'in' | 'out' | 'both'
): TimelineClip[] {
  return clips.map((c) => {
    if (c.type !== 'image' && c.type !== 'video') return c
    const updated: TimelineClip = { ...c }
    if (target === 'in' || target === 'both') {
      updated.transitionIn = { ...transition }
    }
    if (target === 'out' || target === 'both') {
      updated.transitionOut = { ...transition }
    }
    return updated
  })
}
