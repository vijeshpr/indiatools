/**
 * IndiaTools — Hybrid Video Studio Auto-Edit Generator
 * Event-Driven Music Synchronization & Timeline Automation Engine
 *
 * Anchors visual cuts strictly to analyzed audio events:
 * - Downbeats & Rhythmic Beats
 * - Musical Phrase Boundaries & Vocal Envelopes
 * - Structural Sections (Intro, Melody, Buildup, Climax, Outro)
 * - Produces human-readable diagnostic explanations for every cut
 */

import type {
  HybridVideoProject,
  MediaAsset,
  TimelineClip,
  ClipTransition,
} from './types.ts'
import {
  DEFAULT_TRANSFORM,
  DEFAULT_EFFECTS,
  DEFAULT_AUDIO_PROPS,
} from './types.ts'
import type { MusicAnalysisResult, MusicSection, MusicEvent } from './musicIntelligence.ts'
import { calculateTotalProjectDuration } from './timelineEngine.ts'

export type SyncMode = 'beat-sync' | 'melody-vocal' | 'balanced'
export type CutIntensity = 'slow' | 'balanced' | 'fast'
export type BeatSensitivity = 'low' | 'medium' | 'high'
export type TransitionAmount = 'minimal' | 'balanced' | 'cinematic'
export type VisualMotion = 'off' | 'subtle' | 'dynamic'
export type SyncStrength = 'gentle' | 'strong'

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
  syncMode: SyncMode
  cutIntensity: CutIntensity
  transitionAmount: TransitionAmount
  visualMotion: VisualMotion
  syncStrength: SyncStrength
  baseShotDurationSec: number
  melodyMultiplier: number
  climaxMultiplier: number
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
    syncMode: 'melody-vocal',
    cutIntensity: 'slow',
    transitionAmount: 'cinematic',
    visualMotion: 'subtle',
    syncStrength: 'gentle',
    baseShotDurationSec: 4.5,
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
    syncMode: 'balanced',
    cutIntensity: 'balanced',
    transitionAmount: 'balanced',
    visualMotion: 'subtle',
    syncStrength: 'gentle',
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
    syncMode: 'beat-sync',
    cutIntensity: 'fast',
    transitionAmount: 'minimal',
    visualMotion: 'dynamic',
    syncStrength: 'strong',
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
    syncMode: 'balanced',
    cutIntensity: 'fast',
    transitionAmount: 'balanced',
    visualMotion: 'dynamic',
    syncStrength: 'strong',
    baseShotDurationSec: 2.8,
    melodyMultiplier: 1.4,
    climaxMultiplier: 0.18,
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
    syncMode: 'beat-sync',
    cutIntensity: 'fast',
    transitionAmount: 'minimal',
    visualMotion: 'dynamic',
    syncStrength: 'strong',
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
    syncMode: 'melody-vocal',
    cutIntensity: 'slow',
    transitionAmount: 'cinematic',
    visualMotion: 'subtle',
    syncStrength: 'gentle',
    baseShotDurationSec: 3.8,
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
    syncMode: 'balanced',
    cutIntensity: 'balanced',
    transitionAmount: 'minimal',
    visualMotion: 'off',
    syncStrength: 'strong',
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
    syncMode: 'balanced',
    cutIntensity: 'balanced',
    transitionAmount: 'balanced',
    visualMotion: 'subtle',
    syncStrength: 'gentle',
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
  if (
    analysis.overallMelodyScore > 0.65 ||
    analysis.dominantMood === 'romantic' ||
    analysis.dominantMood === 'calm'
  ) {
    return {
      recommendedStyle: 'melody-emotion',
      reason: `Estimated as high-melody (${Math.round(
        analysis.overallMelodyScore * 100
      )}%) with a ${analysis.dominantMood} emotional profile. Melody & Emotion will keep shots graceful with phrase holds.`,
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
      reason: `Clear rhythm with high beat detection confidence (${Math.round(
        analysis.bpmConfidence * 100
      )}%). Beat Sync will align cuts tightly to musical accents.`,
    }
  }

  return {
    recommendedStyle: 'cinematic-story',
    reason: `Balanced musical profile (~${analysis.bpm} BPM). Cinematic Story offers an authentic opening, development, and climax.`,
  }
}

export interface AutoEditGeneratorOptions {
  style?: AutoEditStyle
  syncMode?: SyncMode
  cutIntensity?: CutIntensity
  transitionAmount?: TransitionAmount
  visualMotion?: VisualMotion
  syncStrength?: SyncStrength
  usePhraseBoundaries?: boolean
  assetOrder?: 'original' | 'shuffle'
  mediaFilter?: 'all' | 'images-only' | 'videos-only'
  customBaseDurationSec?: number
  pacingOffsetMultiplier?: number
  keepMelodyCalm?: boolean
  endingHoldFrame?: boolean
}

interface PlannedCutPoint {
  timeSec: number
  reason: string
  isDownbeat: boolean
  isPhraseBoundary: boolean
  isClimax: boolean
  isMelodyHold: boolean
}

export function generateAutoEditTimeline(
  project: HybridVideoProject,
  musicAsset: MediaAsset,
  musicAnalysis: MusicAnalysisResult,
  availableMedia: MediaAsset[],
  options: AutoEditGeneratorOptions
): { updatedProject: HybridVideoProject; clipCount: number; summary: string } {
  // 1. Resolve style and effective options
  const styleKey: AutoEditStyle = options.style || 'cinematic-story'
  const styleDef = AUTO_EDIT_STYLES[styleKey] || AUTO_EDIT_STYLES['cinematic-story']

  const syncMode: SyncMode = options.syncMode || styleDef.syncMode
  const cutIntensity: CutIntensity = options.cutIntensity || styleDef.cutIntensity
  const transitionAmount: TransitionAmount = options.transitionAmount || styleDef.transitionAmount
  const visualMotion: VisualMotion = options.visualMotion || styleDef.visualMotion
  const syncStrength: SyncStrength = options.syncStrength || styleDef.syncStrength
  const usePhraseBoundaries = options.usePhraseBoundaries ?? true
  const endingHold = options.endingHoldFrame ?? true
  const pacingMultiplier = options.pacingOffsetMultiplier || 1.0

  // 2. Filter and order visual media pool
  const filterType = options.mediaFilter || 'all'
  let pool = availableMedia.filter((a) => {
    if (a.id === musicAsset.id) return false // omit audio track from visuals
    if (filterType === 'images-only') return a.type === 'image'
    if (filterType === 'videos-only') return a.type === 'video'
    return a.type === 'image' || a.type === 'video'
  })

  if (pool.length === 0) {
    throw new Error('No photos or video clips available in library for automatic editing.')
  }

  if (options.assetOrder === 'shuffle') {
    pool = [...pool].sort(() => Math.random() - 0.5)
  }

  // 3. Target track identification
  const videoTrack =
    project.tracks.find((t) => t.type === 'video') ||
    project.tracks.find((t) => t.type === 'image') ||
    project.tracks[0]

  const audioTrack =
    project.tracks.find((t) => t.type === 'audio') ||
    project.tracks[project.tracks.length - 1]

  if (!videoTrack || !audioTrack) {
    throw new Error('Missing primary video or audio track on timeline.')
  }

  const totalDuration = Math.max(3.0, musicAsset.durationSec || 30.0)

  // 4. PLAN REAL CUT POINTS ANCHORED TO ANALYZED MUSIC EVENTS
  const plannedCuts: PlannedCutPoint[] = []

  // Always start with cut at 0.000s
  plannedCuts.push({
    timeSec: 0,
    reason: `Image begins at 00:00.000 — intro exposition, initial sequence hold`,
    isDownbeat: false,
    isPhraseBoundary: true,
    isClimax: false,
    isMelodyHold: true,
  })

  // Determine nominal shot interval parameters based on Cut Intensity
  let nominalMinSec = 1.6 * pacingMultiplier
  let nominalTargetSec = 2.8 * pacingMultiplier
  let nominalMaxSec = 4.8 * pacingMultiplier

  if (cutIntensity === 'slow') {
    nominalMinSec = 3.2 * pacingMultiplier
    nominalTargetSec = 4.8 * pacingMultiplier
    nominalMaxSec = 7.5 * pacingMultiplier
  } else if (cutIntensity === 'fast') {
    nominalMinSec = 0.6 * pacingMultiplier
    nominalTargetSec = 1.3 * pacingMultiplier
    nominalMaxSec = 2.4 * pacingMultiplier
  }

  // Active pool of analyzed events
  const analyzedBeats = musicAnalysis.beats || []
  const analyzedDownbeats = musicAnalysis.downbeats || []
  const analyzedPhrases = musicAnalysis.phraseBoundaries || []
  const climaxStart = musicAnalysis.climaxStartSec || totalDuration * 0.75
  const climaxEnd = musicAnalysis.climaxEndSec || totalDuration * 0.95

  let cursorSec = 0

  while (cursorSec < totalDuration - 0.8) {
    // Current section lookup
    const currentSection = musicAnalysis.sections.find(
      (s) => cursorSec >= s.startSec && cursorSec < s.endSec
    ) || {
      id: 'sec-active',
      name: 'Main Flow',
      startSec: cursorSec,
      endSec: totalDuration,
      type: 'melody' as const,
      energyLevel: 0.5,
      isMelodyDominant: true,
      melodyProfile: 'soft-melody' as const,
    }

    const inClimax = cursorSec >= climaxStart - 0.2 && cursorSec <= climaxEnd
    const inMelody = currentSection.isMelodyDominant || currentSection.type === 'calm'

    // Adjust target duration by section and sync mode
    let targetMin = nominalMinSec
    let targetNominal = nominalTargetSec
    let targetMax = nominalMaxSec

    if (inClimax) {
      if (cutIntensity === 'fast' || styleKey === 'climax-rewind') {
        targetMin = 0.22
        targetNominal = 0.5
        targetMax = 1.0
      } else {
        targetMin = 0.6
        targetNominal = 1.2
        targetMax = 2.0
      }
    } else if (inMelody && (syncMode === 'melody-vocal' || options.keepMelodyCalm)) {
      targetMin = Math.max(nominalMinSec, 3.2)
      targetNominal = Math.max(nominalTargetSec, 5.0)
      targetMax = Math.max(nominalMaxSec, 8.0)
    }

    const windowStart = cursorSec + targetMin
    const windowEnd = Math.min(totalDuration - 0.5, cursorSec + targetMax)

    if (windowStart >= totalDuration - 0.5) break

    // Find candidate analyzed events in window [windowStart, windowEnd]
    let chosenTimeSec: number | null = null
    let cutReason = ''
    let isDownbeat = false
    let isPhraseBoundary = false
    let isClimaxCut = inClimax
    let isMelodyHold = inMelody && targetNominal >= 3.5

    if (syncMode === 'beat-sync' || inClimax) {
      // Prioritize downbeats first, then beats
      const candDownbeat = analyzedDownbeats.find((db) => db >= windowStart && db <= windowEnd)
      const candBeat = analyzedBeats.find((b) => b >= windowStart && b <= windowEnd)

      if (candDownbeat) {
        chosenTimeSec = candDownbeat
        isDownbeat = true
        cutReason = `Image begins at ${formatTimecode(candDownbeat)} — strong bar downbeat in ${currentSection.name}`
      } else if (candBeat) {
        chosenTimeSec = candBeat
        cutReason = `Image begins at ${formatTimecode(candBeat)} — rhythmic beat pulse in ${currentSection.name}`
      }
    } else if (syncMode === 'melody-vocal' && usePhraseBoundaries) {
      // Prioritize phrase boundaries & section transitions
      const candPhrase = analyzedPhrases.find((p) => p >= windowStart && p <= windowEnd)
      const candSection = musicAnalysis.sections.find(
        (s) => s.startSec >= windowStart && s.startSec <= windowEnd
      )

      if (candSection) {
        chosenTimeSec = candSection.startSec
        isPhraseBoundary = true
        cutReason = `Image begins at ${formatTimecode(candSection.startSec)} — transition into ${candSection.name} (${candSection.melodyProfile})`
      } else if (candPhrase) {
        chosenTimeSec = candPhrase
        isPhraseBoundary = true
        cutReason = `Image begins at ${formatTimecode(candPhrase)} — musical phrase boundary (vocal/melody line)`
      } else {
        const candDownbeat = analyzedDownbeats.find((db) => db >= windowStart && db <= windowEnd)
        if (candDownbeat) {
          chosenTimeSec = candDownbeat
          isDownbeat = true
          cutReason = `Image begins at ${formatTimecode(candDownbeat)} — downbeat accent in melodic passage`
        }
      }
    } else {
      // Balanced mode: hybrid of phrase boundaries and downbeats
      const candPhrase = usePhraseBoundaries
        ? analyzedPhrases.find((p) => p >= windowStart && p <= windowEnd)
        : null
      const candDownbeat = analyzedDownbeats.find((db) => db >= windowStart && db <= windowEnd)
      const candBeat = analyzedBeats.find((b) => b >= windowStart && b <= windowEnd)

      if (candPhrase && inMelody) {
        chosenTimeSec = candPhrase
        isPhraseBoundary = true
        cutReason = `Image begins at ${formatTimecode(candPhrase)} — phrase boundary in ${currentSection.name}`
      } else if (candDownbeat) {
        chosenTimeSec = candDownbeat
        isDownbeat = true
        cutReason = `Image begins at ${formatTimecode(candDownbeat)} — downbeat in ${currentSection.name}`
      } else if (candBeat) {
        chosenTimeSec = candBeat
        cutReason = `Image begins at ${formatTimecode(candBeat)} — rhythmic beat in ${currentSection.name}`
      }
    }

    // Fallback: If no event within window, snap to nominal beat spacing or nominal target
    if (chosenTimeSec === null) {
      const beatSec = 60 / Math.max(60, musicAnalysis.bpm || 120)
      const beatsCount = Math.round(targetNominal / beatSec)
      chosenTimeSec = Number((cursorSec + Math.max(1, beatsCount) * beatSec).toFixed(3))
      cutReason = `Image begins at ${formatTimecode(chosenTimeSec)} — ${beatsCount}-beat bar interval timing`
    }

    // Strong sync enforcement: snap within ±80ms to the nearest beat if close
    if (syncStrength === 'strong') {
      const nearestBeat = analyzedBeats.find((b) => Math.abs(b - chosenTimeSec!) <= 0.09)
      if (nearestBeat) {
        chosenTimeSec = nearestBeat
      }
    }

    // Ensure strictly advancing cursor
    if (chosenTimeSec <= cursorSec + 0.18) {
      chosenTimeSec = cursorSec + 0.25
    }

    plannedCuts.push({
      timeSec: Number(chosenTimeSec.toFixed(3)),
      reason: cutReason,
      isDownbeat,
      isPhraseBoundary,
      isClimax: isClimaxCut,
      isMelodyHold,
    })

    cursorSec = chosenTimeSec
  }

  // 5. DISTRIBUTE MEDIA ASSETS ACROSS PLANNED CUT SLOTS
  const generatedClips: TimelineClip[] = []
  let poolIndex = 0
  let lastAssetId = ''

  for (let s = 0; s < plannedCuts.length; s++) {
    const currentCut = plannedCuts[s]
    const nextCutTime = s < plannedCuts.length - 1 ? plannedCuts[s + 1].timeSec : totalDuration
    let shotDuration = Number(Math.max(0.18, nextCutTime - currentCut.timeSec).toFixed(3))

    const isEndingShot = s === plannedCuts.length - 1
    if (isEndingShot && endingHold) {
      shotDuration = Math.max(shotDuration, styleDef.endingHoldSec)
    }

    // Pick next asset without immediate repetition
    let asset = pool[poolIndex % pool.length]
    if (asset.id === lastAssetId && pool.length > 1) {
      poolIndex++
      asset = pool[poolIndex % pool.length]
    }
    lastAssetId = asset.id
    poolIndex++

    // Determine transition based on section, cut type and transitionAmount
    let transIn: ClipTransition = { type: 'none', durationSec: 0 }
    let transOut: ClipTransition = { type: 'none', durationSec: 0 }

    if (transitionAmount === 'minimal') {
      transIn = { type: 'none', durationSec: 0 }
    } else if (currentCut.isClimax && styleDef.enableClimaxScalePunch) {
      transIn = { type: 'scale-punch', durationSec: Math.min(0.25, shotDuration * 0.35) }
    } else if (currentCut.isPhraseBoundary || currentCut.isMelodyHold) {
      const transDur = transitionAmount === 'cinematic' ? 0.75 : 0.4
      transIn = { type: 'crossfade', durationSec: Math.min(transDur, shotDuration * 0.3) }
    } else if (styleDef.defaultTransition !== 'none') {
      transIn = {
        type: styleDef.defaultTransition,
        durationSec: Math.min(styleDef.transitionDurationSec, shotDuration * 0.3),
      }
    }

    if (isEndingShot) {
      transOut = { type: 'fade-black', durationSec: 1.0 }
    }

    // Ken Burns slow zoom drift for visualMotion
    const keyframes = []
    if (visualMotion !== 'off' && (currentCut.isMelodyHold || styleDef.enableSlowZoomDrift)) {
      const zoomTarget = s % 2 === 0 ? 1.06 : 0.95
      keyframes.push(
        { id: `kf-${s}-0`, timeSec: 0, transform: { scale: 1.0 } },
        { id: `kf-${s}-1`, timeSec: shotDuration, transform: { scale: zoomTarget } }
      )
    }

    // Trim offset calculation for videos
    let trimStartSec = 0
    if (asset.type === 'video') {
      const maxPossibleTrim = Math.max(0, asset.durationSec - shotDuration)
      trimStartSec = Number(((s * 2.5) % Math.max(1, maxPossibleTrim)).toFixed(2))
    }

    const clip: TimelineClip = {
      id: `clip-auto-${Date.now()}-${s}-${Math.random().toString(36).substring(2, 6)}`,
      trackId: videoTrack.id,
      assetId: asset.id,
      name: asset.name,
      type: asset.type,
      startSec: currentCut.timeSec,
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
      cutReason: currentCut.reason,
    }

    generatedClips.push(clip)
  }

  // 6. Synchronized Music Track on Timeline (Audio Track A1)
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
    cutReason: 'Master music audio synchronized across entire video timeline',
  }

  // Retain non-primary tracks (e.g. text/overlays), replace V1 and A1
  const existingOtherClips = project.clips.filter(
    (c) => c.trackId !== videoTrack.id && c.trackId !== audioTrack.id
  )

  const finalClips = [...existingOtherClips, ...generatedClips, musicClip]
  const finalProjectDuration = calculateTotalProjectDuration(finalClips, totalDuration)

  // 7. HONEST DYNAMIC SUMMARY CALCULATED FROM GENERATED TIMELINE
  let beatAlignedCount = 0
  let phraseBoundaryCount = 0
  let melodyHoldCount = 0
  let climaxCutsCount = 0

  for (const c of plannedCuts) {
    if (c.isDownbeat || analyzedBeats.some((b) => Math.abs(b - c.timeSec) < 0.06)) {
      beatAlignedCount++
    }
    if (c.isPhraseBoundary) {
      phraseBoundaryCount++
    }
    if (c.isMelodyHold) {
      melodyHoldCount++
    }
    if (c.isClimax) {
      climaxCutsCount++
    }
  }

  const summary = `Auto-created ${generatedClips.length} cuts in "${styleDef.name}" style (${finalProjectDuration.toFixed(1)}s total): ${beatAlignedCount} cuts aligned to detected beats • ${phraseBoundaryCount} phrase-boundary cuts • ${melodyHoldCount} melody holds${
    climaxCutsCount > 0 ? ` • ${climaxCutsCount} cuts in climax burst` : ''
  }.`

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

function formatTimecode(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = (sec % 60).toFixed(2)
  return `${m.toString().padStart(2, '0')}:${parseFloat(s) < 10 ? '0' : ''}${s}`
}
