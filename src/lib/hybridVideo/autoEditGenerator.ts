/**
 * IndiaTools — Hybrid Video Studio Auto-Edit Generator
 * Constructs a fully editable, music-synchronized multi-track timeline
 * based on signal analysis, melody dominance, and curated editing styles.
 */

import type {
  HybridVideoProject,
  MediaAsset,
  TimelineClip,
  ClipTransition,
  ClipTransform,
} from './types.ts'
import {
  DEFAULT_TRANSFORM,
  DEFAULT_EFFECTS,
  DEFAULT_AUDIO_PROPS,
} from './types.ts'
import type { MusicAnalysisResult, MusicSection } from './musicIntelligence.ts'
import { calculateTotalProjectDuration } from './timelineEngine.ts'

export type AutoEditStyle =
  | 'melody-emotion'
  | 'cinematic-story'
  | 'beat-sync'
  | 'climax-rewind'
  | 'fast-energetic'
  | 'travel-film'
  | 'minimal-clean'
  | 'custom'

export interface AutoEditStyleDef {
  id: AutoEditStyle
  name: string
  description: string
  iconName: string
  baseShotDurationSec: number
  melodyMultiplier: number // multiplier for melody passages (e.g. 1.5x longer)
  climaxMultiplier: number // multiplier for climax passages (e.g. 0.3x shorter)
  defaultTransition: ClipTransition['type']
  transitionDurationSec: number
  enableSlowZoomDrift: boolean
  enableClimaxScalePunch: boolean
  endingHoldSec: number
}

export const AUTO_EDIT_STYLES: Record<AutoEditStyle, AutoEditStyleDef> = {
  'melody-emotion': {
    id: 'melody-emotion',
    name: 'Melody & Emotion',
    description: 'Longer holds, gentle crossfades, slow zoom drift, and breathing room for soulful tracks.',
    iconName: 'Heart',
    baseShotDurationSec: 4.2,
    melodyMultiplier: 1.6,
    climaxMultiplier: 0.5,
    defaultTransition: 'crossfade',
    transitionDurationSec: 0.8,
    enableSlowZoomDrift: true,
    enableClimaxScalePunch: false,
    endingHoldSec: 3.5,
  },
  'cinematic-story': {
    id: 'cinematic-story',
    name: 'Cinematic Story',
    description: 'Balanced pacing, deliberate transitions, narrative build-up, and an emotional climax.',
    iconName: 'Film',
    baseShotDurationSec: 3.0,
    melodyMultiplier: 1.3,
    climaxMultiplier: 0.4,
    defaultTransition: 'crossfade',
    transitionDurationSec: 0.5,
    enableSlowZoomDrift: true,
    enableClimaxScalePunch: false,
    endingHoldSec: 3.0,
  },
  'beat-sync': {
    id: 'beat-sync',
    name: 'Beat Sync',
    description: 'Rhythmic cuts aligned to musical beats, transient accents, and kick pulses.',
    iconName: 'Zap',
    baseShotDurationSec: 1.4,
    melodyMultiplier: 1.1,
    climaxMultiplier: 0.35,
    defaultTransition: 'scale-punch',
    transitionDurationSec: 0.3,
    enableSlowZoomDrift: false,
    enableClimaxScalePunch: true,
    endingHoldSec: 2.0,
  },
  'climax-rewind': {
    id: 'climax-rewind',
    name: 'Climax Memory Rewind',
    description: 'Viral Indian cinema memory flashback with rapid cuts accelerating during peak climax.',
    iconName: 'Rewind',
    baseShotDurationSec: 2.8,
    melodyMultiplier: 1.4,
    climaxMultiplier: 0.18, // rapid cuts down to ~0.25s during climax
    defaultTransition: 'crossfade',
    transitionDurationSec: 0.4,
    enableSlowZoomDrift: true,
    enableClimaxScalePunch: true,
    endingHoldSec: 3.5,
  },
  'fast-energetic': {
    id: 'fast-energetic',
    name: 'Fast & Energetic',
    description: 'High-tempo cuts, dynamic whip pans, and vigorous momentum for reels and gym edits.',
    iconName: 'Flame',
    baseShotDurationSec: 1.2,
    melodyMultiplier: 1.1,
    climaxMultiplier: 0.25,
    defaultTransition: 'whip-pan-left',
    transitionDurationSec: 0.25,
    enableSlowZoomDrift: false,
    enableClimaxScalePunch: true,
    endingHoldSec: 1.5,
  },
  'travel-film': {
    id: 'travel-film',
    name: 'Travel Film',
    description: 'Scenic holds for landscapes, gradual directional wipes, and ambient pacing.',
    iconName: 'Compass',
    baseShotDurationSec: 3.6,
    melodyMultiplier: 1.35,
    climaxMultiplier: 0.5,
    defaultTransition: 'fade-wipe-left',
    transitionDurationSec: 0.6,
    enableSlowZoomDrift: true,
    enableClimaxScalePunch: false,
    endingHoldSec: 3.0,
  },
  'minimal-clean': {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Pure cuts with zero decorative filters or distractions, letting photos speak for themselves.',
    iconName: 'Square',
    baseShotDurationSec: 2.5,
    melodyMultiplier: 1.2,
    climaxMultiplier: 0.6,
    defaultTransition: 'none',
    transitionDurationSec: 0,
    enableSlowZoomDrift: false,
    enableClimaxScalePunch: false,
    endingHoldSec: 2.0,
  },
  'custom': {
    id: 'custom',
    name: 'Custom Studio Style',
    description: 'Fully customized shot durations, transition choices, and acceleration curves.',
    iconName: 'Sliders',
    baseShotDurationSec: 2.5,
    melodyMultiplier: 1.3,
    climaxMultiplier: 0.35,
    defaultTransition: 'crossfade',
    transitionDurationSec: 0.4,
    enableSlowZoomDrift: true,
    enableClimaxScalePunch: false,
    endingHoldSec: 2.5,
  },
}

export function recommendStyleForMusic(analysis: MusicAnalysisResult): {
  recommendedStyle: AutoEditStyle
  reason: string
} {
  if (analysis.overallMelodyScore > 0.65 || analysis.dominantMood === 'romantic' || analysis.dominantMood === 'calm') {
    return {
      recommendedStyle: 'melody-emotion',
      reason: `Estimated as high-melody (${Math.round(analysis.overallMelodyScore * 100)}%) with a ${analysis.dominantMood} emotional profile. Melody & Emotion will keep shots graceful.`,
    }
  }

  if (analysis.dominantMood === 'intense' || analysis.bpm > 130) {
    return {
      recommendedStyle: 'fast-energetic',
      reason: `Detected fast tempo (~${analysis.bpm} BPM) and high energy. Fast & Energetic fits the vibrant rhythm.`,
    }
  }

  if (analysis.beats.length > 20 && analysis.bpmConfidence > 0.7) {
    return {
      recommendedStyle: 'beat-sync',
      reason: `Clear rhythm with high beat detection confidence (${Math.round(analysis.bpmConfidence * 100)}%). Beat Sync will align cuts tightly to musical accents.`,
    }
  }

  return {
    recommendedStyle: 'cinematic-story',
    reason: `Balanced musical profile (~${analysis.bpm} BPM). Cinematic Story offers an authentic opening, development, and climax.`,
  }
}

export interface AutoEditGeneratorOptions {
  style: AutoEditStyle
  assetOrder: 'original' | 'shuffle'
  mediaFilter: 'all' | 'images-only' | 'videos-only'
  customBaseDurationSec?: number
  pacingOffsetMultiplier?: number // 0.8 for faster, 1.25 for slower
  keepMelodyCalm?: boolean
  endingHoldFrame?: boolean
}

export function generateAutoEditTimeline(
  project: HybridVideoProject,
  musicAsset: MediaAsset,
  musicAnalysis: MusicAnalysisResult,
  availableMedia: MediaAsset[],
  options: AutoEditGeneratorOptions
): { updatedProject: HybridVideoProject; clipCount: number; summary: string } {
  // 1. Filter and order visual media
  let pool = availableMedia.filter((a) => {
    if (a.id === musicAsset.id) return false // don't add music asset as visual clip
    if (options.mediaFilter === 'images-only') return a.type === 'image'
    if (options.mediaFilter === 'videos-only') return a.type === 'video'
    return a.type === 'image' || a.type === 'video'
  })

  if (pool.length === 0) {
    throw new Error('No photos or video clips available in library for automatic editing.')
  }

  if (options.assetOrder === 'shuffle') {
    const shuffled = [...pool]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    pool = shuffled
  }

  const styleDef = AUTO_EDIT_STYLES[options.style] || AUTO_EDIT_STYLES['cinematic-story']
  const pacingMultiplier = options.pacingOffsetMultiplier || 1.0
  const baseShotSec = (options.customBaseDurationSec || styleDef.baseShotDurationSec) * pacingMultiplier

  const totalDuration = musicAsset.durationSec || musicAnalysis.durationSec || 30.0

  // 2. Identify primary tracks (V1 for visual clips, A1 for music)
  const videoTrack = project.tracks.find((t) => t.type === 'video') || project.tracks[2] || project.tracks[0]
  const audioTrack = project.tracks.find((t) => t.type === 'audio') || project.tracks[3] || project.tracks[0]

  // 3. Generate visual shot boundaries based on sections and beats
  const shotTimestamps: { startSec: number; durationSec: number; section: MusicSection }[] = []
  let cursorSec = 0

  for (const section of musicAnalysis.sections) {
    if (cursorSec >= totalDuration - 0.5) break

    // Calculate section-specific shot duration
    let sectionShotSec = baseShotSec

    if (section.type === 'climax') {
      sectionShotSec = Math.max(0.25, baseShotSec * styleDef.climaxMultiplier)
    } else if (section.type === 'buildup') {
      sectionShotSec = Math.max(0.6, baseShotSec * 0.65)
    } else if (section.isMelodyDominant || section.type === 'calm') {
      const calmBonus = options.keepMelodyCalm ? 1.8 : styleDef.melodyMultiplier
      sectionShotSec = baseShotSec * calmBonus
    } else if (section.type === 'intro' || section.type === 'outro') {
      sectionShotSec = baseShotSec * 1.25
    }

    let sectionCursor = Math.max(cursorSec, section.startSec)
    const sectionEnd = Math.min(totalDuration, section.endSec)

    while (sectionCursor < sectionEnd - 0.2) {
      let shotDur = sectionShotSec

      // If in climax memory rewind, progressively accelerate cuts
      if (options.style === 'climax-rewind' && section.type === 'climax') {
        const progressInClimax = (sectionCursor - section.startSec) / Math.max(1, section.endSec - section.startSec)
        shotDur = Math.max(0.18, 0.5 * (1 - progressInClimax * 0.6))
      }

      const remainingInSec = sectionEnd - sectionCursor
      if (remainingInSec < shotDur * 1.3) {
        shotDur = remainingInSec
      }

      shotTimestamps.push({
        startSec: Number(sectionCursor.toFixed(3)),
        durationSec: Number(shotDur.toFixed(3)),
        section,
      })

      sectionCursor += shotDur
      cursorSec = sectionCursor
    }
  }

  // 4. Distribute pool assets across the shot slots without immediate repetition
  const generatedClips: TimelineClip[] = []
  let poolIndex = 0
  let lastAssetId = ''

  for (let s = 0; s < shotTimestamps.length; s++) {
    const slot = shotTimestamps[s]
    const isEndingShot = s === shotTimestamps.length - 1

    // Pick next asset avoiding immediate repetition
    let asset = pool[poolIndex % pool.length]
    if (asset.id === lastAssetId && pool.length > 1) {
      poolIndex++
      asset = pool[poolIndex % pool.length]
    }
    lastAssetId = asset.id
    poolIndex++

    // Determine transition based on section and style
    let transIn: ClipTransition = { type: 'none', durationSec: 0 }
    let transOut: ClipTransition = { type: 'none', durationSec: 0 }

    if (slot.section.type === 'climax' && styleDef.enableClimaxScalePunch) {
      transIn = { type: 'scale-punch', durationSec: Math.min(0.3, slot.durationSec * 0.4) }
    } else if (slot.section.isMelodyDominant) {
      transIn = { type: 'crossfade', durationSec: Math.min(0.6, slot.durationSec * 0.3) }
    } else if (styleDef.defaultTransition !== 'none') {
      transIn = {
        type: styleDef.defaultTransition,
        durationSec: Math.min(styleDef.transitionDurationSec, slot.durationSec * 0.3),
      }
    }

    // Ending shot hold / fade
    let shotDuration = slot.durationSec
    if (isEndingShot && (options.endingHoldFrame ?? true)) {
      shotDuration = Math.max(shotDuration, styleDef.endingHoldSec)
      transOut = { type: 'fade-black', durationSec: 1.0 }
    }

    // Keyframe subtle Ken Burns zoom drift if enabled for melody / story
    const keyframes = []
    if (styleDef.enableSlowZoomDrift && slot.section.isMelodyDominant) {
      const zoomDir = s % 2 === 0 ? 1.06 : 0.96
      keyframes.push(
        { id: `kf-${s}-0`, timeSec: 0, transform: { scale: 1.0 } },
        { id: `kf-${s}-1`, timeSec: shotDuration, transform: { scale: zoomDir } }
      )
    }

    // For video clips, ensure trimStartSec doesn't exceed source duration
    let trimStartSec = 0
    if (asset.type === 'video') {
      const maxPossibleTrim = Math.max(0, asset.durationSec - shotDuration)
      trimStartSec = Number(((s * 2.5) % Math.max(1, maxPossibleTrim)).toFixed(2))
    }

    const clip: TimelineClip = {
      id: `clip-auto-${Date.now()}-${s}`,
      trackId: videoTrack.id,
      assetId: asset.id,
      name: asset.name,
      type: asset.type,
      startSec: slot.startSec,
      durationSec: shotDuration,
      trimStartSec,
      trimEndSec: 0,
      speed: 1.0,
      transform: { ...DEFAULT_TRANSFORM, fitMode: 'fit' },
      keyframes,
      effects: {
        ...DEFAULT_EFFECTS,
        colorGrading: { ...DEFAULT_EFFECTS.colorGrading },
        filters: { ...DEFAULT_EFFECTS.filters },
      },
      transitionIn: transIn,
      transitionOut: transOut,
      audioProps: { ...DEFAULT_AUDIO_PROPS },
    }

    generatedClips.push(clip)
  }

  // 5. Add/Update music track on timeline (A1)
  const musicClip: TimelineClip = {
    id: `clip-music-${Date.now()}`,
    trackId: audioTrack.id,
    assetId: musicAsset.id,
    name: musicAsset.name,
    type: 'audio',
    startSec: 0,
    durationSec: totalDuration,
    trimStartSec: 0,
    trimEndSec: 0,
    speed: 1.0,
    transform: { ...DEFAULT_TRANSFORM },
    keyframes: [],
    effects: { ...DEFAULT_EFFECTS },
    transitionIn: { type: 'none', durationSec: 0 },
    transitionOut: { type: 'none', durationSec: 0 },
    audioProps: { volume: 1.0, fadeInSec: 0.5, fadeOutSec: 2.0, muted: false },
  }

  // Retain non-primary tracks (e.g. text/overlays), replace V1 and A1
  const existingOtherClips = project.clips.filter(
    (c) => c.trackId !== videoTrack.id && c.trackId !== audioTrack.id
  )

  const finalClips = [...existingOtherClips, ...generatedClips, musicClip]
  const finalProjectDuration = calculateTotalProjectDuration(finalClips, totalDuration)

  const summary = `Auto-created ${generatedClips.length} cuts in "${styleDef.name}" style (${finalProjectDuration.toFixed(1)}s total).`

  return {
    updatedProject: {
      ...project,
      settings: {
        ...project.settings,
        durationSec: finalProjectDuration,
      },
      clips: finalClips,
    },
    clipCount: generatedClips.length,
    summary,
  }
}
