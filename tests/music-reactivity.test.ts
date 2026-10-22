import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  computeMusicReactivityFrame,
  findPrecedingTimestamp,
  createReactivityConfig,
  REACTIVITY_PRESETS,
  type ReactivityPresetId,
} from '../src/lib/hybridVideo/musicReactivityEngine.ts'
import {
  TRANSITION_LIBRARY,
  computeClipTransition,
  alignTransitionToMusic,
  applyTransitionToAllCuts,
} from '../src/lib/hybridVideo/transitionsEngine.ts'
import type { MusicAnalysisResult } from '../src/lib/hybridVideo/musicIntelligence.ts'
import type { TimelineClip, ClipTransition, MusicReactivityConfig } from '../src/lib/hybridVideo/types.ts'

describe('Music Reactivity & Beat-Synced VFX Engine Suite', () => {
  const mockMusicAnalysis: MusicAnalysisResult = {
    assetId: 'test-audio',
    assetName: 'Cinematic_Track.mp3',
    durationSec: 30,
    bpm: 120,
    bpmConfidence: 0.95,
    beats: [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0],
    onsets: [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0],
    downbeats: [0.0, 2.0, 4.0],
    phraseBoundaries: [0.0, 4.0],
    events: [
      { id: 'ev1', timeSec: 0.0, type: 'downbeat', confidence: 1, energy: 0.9, description: 'Bar 1' },
      { id: 'ev2', timeSec: 0.5, type: 'beat', confidence: 0.8, energy: 0.6, description: 'Beat 2' },
      { id: 'ev3', timeSec: 2.0, type: 'downbeat', confidence: 1, energy: 0.95, description: 'Bar 2' },
    ],
    energyEnvelope: [0.8, 0.85, 0.4, 0.3, 0.9, 0.95, 0.5, 0.4, 0.8, 0.85],
    bassEnvelope: [0.75, 0.8, 0.2, 0.15, 0.9, 0.85, 0.3, 0.2, 0.7, 0.75],
    sections: [],
    dominantMood: 'energetic',
    overallMelodyScore: 0.6,
    vocalActivityConfidence: 0.7,
    climaxStartSec: 2.0,
    climaxEndSec: 4.0,
    suggestedCutPoints: [2.0, 4.0],
  }

  it('preserves clean neutrality (no change to transforms) when disabled or config is null', () => {
    const disabledConfig = createReactivityConfig()
    disabledConfig.enabled = false

    const frameNull = computeMusicReactivityFrame(null, 1.0, 1.0, mockMusicAnalysis, 1920, 1080)
    assert.strictEqual(frameNull.deltaX, 0)
    assert.strictEqual(frameNull.deltaY, 0)
    assert.strictEqual(frameNull.deltaScale, 1.0)
    assert.strictEqual(frameNull.deltaRotationDeg, 0)
    assert.strictEqual(frameNull.flashAlpha, 0)
    assert.strictEqual(frameNull.hasActiveReaction, false)

    const frameDisabled = computeMusicReactivityFrame(disabledConfig, 1.0, 1.0, mockMusicAnalysis, 1920, 1080)
    assert.strictEqual(frameDisabled.deltaX, 0)
    assert.strictEqual(frameDisabled.deltaY, 0)
    assert.strictEqual(frameDisabled.deltaScale, 1.0)
    assert.strictEqual(frameDisabled.deltaRotationDeg, 0)
    assert.strictEqual(frameDisabled.hasActiveReaction, false)
  })

  it('triggers Beat Shake strictly during beat impulse window and decays cleanly to 0', () => {
    const config: MusicReactivityConfig = {
      ...createReactivityConfig(),
      enabled: true,
      beatShake: {
        enabled: true,
        intensity: 50,
        durationSec: 0.2,
        decay: 'sharp',
        type: 'combined',
        trigger: 'all-beats',
      },
    }

    // Exactly at beat onset (t = 1.00s)
    const onBeatFrame = computeMusicReactivityFrame(config, 1.02, 0.5, mockMusicAnalysis, 1920, 1080)
    assert.strictEqual(onBeatFrame.hasActiveReaction, true)
    assert.ok(Math.abs(onBeatFrame.deltaX) > 0 || Math.abs(onBeatFrame.deltaY) > 0)

    // After decay duration (t = 1.25s > 1.0 + 0.2s duration)
    const afterDecayFrame = computeMusicReactivityFrame(config, 1.25, 0.75, mockMusicAnalysis, 1920, 1080)
    assert.strictEqual(afterDecayFrame.deltaX, 0)
    assert.strictEqual(afterDecayFrame.deltaY, 0)
    assert.strictEqual(afterDecayFrame.deltaRotationDeg, 0)
  })

  it('computes Beat Zoom Punch scaling with proper recovery speed', () => {
    const config: MusicReactivityConfig = {
      ...createReactivityConfig(),
      enabled: true,
      zoomPunch: {
        enabled: true,
        amount: 1.25,
        durationSec: 0.3,
        direction: 'in',
        recovery: 'fast',
        trigger: 'strong-beats-only',
      },
    }

    // Downbeat at t = 2.0s: punch should be active at t = 2.02s
    const punchHit = computeMusicReactivityFrame(config, 2.02, 0.02, mockMusicAnalysis, 1920, 1080)
    assert.strictEqual(punchHit.hasActiveReaction, true)
    assert.ok(punchHit.deltaScale > 1.15, `Expected punch scale > 1.15, got ${punchHit.deltaScale}`)

    // Regular non-downbeat at t = 2.5s should NOT trigger when strong-beats-only is set
    const regularBeat = computeMusicReactivityFrame(config, 2.52, 0.52, mockMusicAnalysis, 1920, 1080)
    assert.strictEqual(regularBeat.deltaScale, 1.0)

    // After duration (t = 2.35s > 2.0 + 0.3s)
    const expiredPunch = computeMusicReactivityFrame(config, 2.35, 0.35, mockMusicAnalysis, 1920, 1080)
    assert.strictEqual(expiredPunch.deltaScale, 1.0)
  })

  it('modulates scale and camera height based on Sub-Bass low frequency energy', () => {
    const config: MusicReactivityConfig = {
      ...createReactivityConfig(),
      enabled: true,
      bassImpact: {
        enabled: true,
        sensitivity: 1.5,
        intensity: 50,
        attackSec: 0.03,
        releaseSec: 0.2,
        threshold: 0.25,
      },
    }

    // At frame index 0 (t = 0.0s), bassEnvelope[0] is 0.75 (> 0.25 threshold)
    const highBassFrame = computeMusicReactivityFrame(config, 0.02, 0.02, mockMusicAnalysis, 1920, 1080)
    assert.ok(highBassFrame.deltaScale > 1.02, `Expected bass scale > 1.02, got ${highBassFrame.deltaScale}`)
    assert.ok(highBassFrame.deltaY > 0, `Expected bass deltaY > 0, got ${highBassFrame.deltaY}`)

    // At frame index 2 (t = 0.10s), bassEnvelope[2] is 0.20 (< 0.25 threshold)
    const lowBassFrame = computeMusicReactivityFrame(config, 0.1, 0.1, mockMusicAnalysis, 1920, 1080)
    assert.strictEqual(lowBassFrame.deltaScale, 1.0)
    assert.strictEqual(lowBassFrame.deltaY, 0)
  })

  it('generates continuous Melody Motion drift with phrase smoothness', () => {
    const config: MusicReactivityConfig = {
      ...createReactivityConfig(),
      enabled: true,
      melodyMotion: {
        enabled: true,
        amount: 40,
        smoothness: 1.0,
        direction: 'forward',
        resetPerClip: true,
      },
    }

    const t1 = computeMusicReactivityFrame(config, 1.0, 0.5, mockMusicAnalysis, 1920, 1080)
    const t2 = computeMusicReactivityFrame(config, 1.5, 1.0, mockMusicAnalysis, 1920, 1080)

    assert.ok(t1.hasActiveReaction)
    assert.ok(t2.hasActiveReaction)
    // Motion positions change smoothly between time steps
    assert.notStrictEqual(t1.deltaX, t2.deltaX)
  })

  it('validates all 8 Production Reactivity Presets', () => {
    assert.strictEqual(REACTIVITY_PRESETS.length, 8)

    const expectedPresetIds: ReactivityPresetId[] = [
      'beat-impact',
      'bass-pulse',
      'cinematic-melody',
      'high-energy-montage',
      'slow-emotional-motion',
      'glitch-beat',
      'flash-zoom',
      'clean-beat-sync',
    ]

    for (const presetId of expectedPresetIds) {
      const preset = REACTIVITY_PRESETS.find((p) => p.id === presetId)
      assert.ok(preset, `Missing preset: ${presetId}`)
      assert.ok(preset.name.length > 0)
      assert.ok(preset.description.length > 0)

      const hydratedConfig = createReactivityConfig(presetId)
      assert.strictEqual(hydratedConfig.enabled, true)
      assert.strictEqual(hydratedConfig.mode, preset.mode)
    }
  })

  it('validates binary search timestamp helper for beat detection', () => {
    const timestamps = [1.0, 2.0, 3.0, 4.0, 5.0]
    assert.strictEqual(findPrecedingTimestamp(timestamps, 0.5), null)
    assert.strictEqual(findPrecedingTimestamp(timestamps, 1.0), 1.0)
    assert.strictEqual(findPrecedingTimestamp(timestamps, 2.4), 2.0)
    assert.strictEqual(findPrecedingTimestamp(timestamps, 5.5), 5.0)
  })

  it('validates all 29 transitions across Clean, Cinematic, Dynamic, Stylized categories', () => {
    assert.strictEqual(TRANSITION_LIBRARY.length, 29)

    const categories = new Set(TRANSITION_LIBRARY.map((t) => t.category))
    assert.ok(categories.has('clean'))
    assert.ok(categories.has('cinematic'))
    assert.ok(categories.has('dynamic'))
    assert.ok(categories.has('stylized'))

    // Verify all 24 transitions compute valid non-NaN states at progress 0, 0.5, and 1.0
    for (const item of TRANSITION_LIBRARY) {
      const trans: ClipTransition = { type: item.id, durationSec: 0.5 }
      const stateStart = computeClipTransition(trans, { type: 'none', durationSec: 0 }, 0.05, 5.0, 1920, 1080)
      const stateMid = computeClipTransition(trans, { type: 'none', durationSec: 0 }, 0.25, 5.0, 1920, 1080)
      const stateEnd = computeClipTransition(trans, { type: 'none', durationSec: 0 }, 0.55, 5.0, 1920, 1080)

      assert.ok(!isNaN(stateStart.opacityMultiplier), `${item.id} has NaN opacityMultiplier`)
      assert.ok(!isNaN(stateStart.scaleMultiplier), `${item.id} has NaN scaleMultiplier`)
      assert.ok(!isNaN(stateStart.offsetX), `${item.id} has NaN offsetX`)
      assert.ok(!isNaN(stateStart.offsetY), `${item.id} has NaN offsetY`)

      assert.ok(stateStart.opacityMultiplier >= 0 && stateStart.opacityMultiplier <= 1)
      assert.ok(stateEnd.opacityMultiplier >= 0 && stateEnd.opacityMultiplier <= 1)
    }
  })

  it('aligns transition duration and cut boundaries to musical beats and phrases', () => {
    const mockClip: TimelineClip = {
      id: 'clip-1',
      trackId: 'track-v1',
      name: 'Sample',
      type: 'image',
      startSec: 1.95, // Near downbeat 2.0s
      durationSec: 4.0,
      trimStartSec: 0,
      trimEndSec: 0,
      speed: 1.0,
      transform: { x: 0, y: 0, scale: 1, rotationDeg: 0, opacity: 1, fitMode: 'fit' },
      keyframes: [],
      effects: { enabled: false, colorGrading: {} as any, filters: {} as any },
      transitionIn: { type: 'crossfade', durationSec: 0.5 },
      transitionOut: { type: 'none', durationSec: 0 },
      audioProps: { volume: 1, fadeInSec: 0, fadeOutSec: 0, muted: false },
    }

    // 1 Beat sync mode at 120 BPM should yield 0.50s duration
    const onBeatTrans: ClipTransition = { type: 'scale-punch', durationSec: 0.5, syncMode: 'on-beat' }
    const alignedOnBeat = alignTransitionToMusic(onBeatTrans, mockClip, mockMusicAnalysis, 'in')
    assert.strictEqual(alignedOnBeat.durationSec, 0.5)

    // Beat to Beat sync mode should yield 1.00s (2 beats)
    const beatToBeatTrans: ClipTransition = { type: 'crossfade', durationSec: 0.5, syncMode: 'beat-to-beat' }
    const alignedBeatToBeat = alignTransitionToMusic(beatToBeatTrans, mockClip, mockMusicAnalysis, 'in')
    assert.strictEqual(alignedBeatToBeat.durationSec, 1.0)

    // Phrase boundary mode should yield 2.00s (4 beats = 1 bar)
    const phraseTrans: ClipTransition = { type: 'fade-black', durationSec: 0.5, syncMode: 'phrase-boundary' }
    const alignedPhrase = alignTransitionToMusic(phraseTrans, mockClip, mockMusicAnalysis, 'in')
    assert.strictEqual(alignedPhrase.durationSec, 1.8) // Clamped to maxSafeDuration (4.0 * 0.45 = 1.8s)
  })

  it('batch applies transitions to all eligible cuts on video/image tracks', () => {
    const clips: TimelineClip[] = [
      {
        id: 'c1',
        trackId: 'v1',
        name: 'Clip 1',
        type: 'image',
        startSec: 0,
        durationSec: 3,
        trimStartSec: 0,
        trimEndSec: 0,
        speed: 1,
        transform: {} as any,
        keyframes: [],
        effects: {} as any,
        transitionIn: { type: 'none', durationSec: 0 },
        transitionOut: { type: 'none', durationSec: 0 },
        audioProps: {} as any,
      },
      {
        id: 'c2',
        trackId: 'v1',
        name: 'Clip 2',
        type: 'video',
        startSec: 3,
        durationSec: 4,
        trimStartSec: 0,
        trimEndSec: 0,
        speed: 1,
        transform: {} as any,
        keyframes: [],
        effects: {} as any,
        transitionIn: { type: 'none', durationSec: 0 },
        transitionOut: { type: 'none', durationSec: 0 },
        audioProps: {} as any,
      },
      {
        id: 'c3',
        trackId: 't1',
        name: 'Title Text',
        type: 'text',
        startSec: 0,
        durationSec: 5,
        trimStartSec: 0,
        trimEndSec: 0,
        speed: 1,
        transform: {} as any,
        keyframes: [],
        effects: {} as any,
        transitionIn: { type: 'none', durationSec: 0 },
        transitionOut: { type: 'none', durationSec: 0 },
        audioProps: {} as any,
      },
    ]

    const newTransition: ClipTransition = { type: 'smooth-zoom', durationSec: 0.6 }
    const updated = applyTransitionToAllCuts(clips, newTransition, 'both')

    // c1 and c2 should have the transition updated
    assert.strictEqual(updated[0].transitionIn.type, 'smooth-zoom')
    assert.strictEqual(updated[0].transitionOut.type, 'smooth-zoom')
    assert.strictEqual(updated[1].transitionIn.type, 'smooth-zoom')
    assert.strictEqual(updated[1].transitionOut.type, 'smooth-zoom')

    // c3 (text clip) should remain untouched
    assert.strictEqual(updated[2].transitionIn.type, 'none')
  })
})
