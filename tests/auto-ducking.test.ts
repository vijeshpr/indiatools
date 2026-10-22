import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  computeDuckingEnvelope,
  getDuckingGainAtTime,
  isVoiceActiveAtTime,
  AUTO_DUCKING_PRESETS,
} from '../src/lib/hybridVideo/autoDuckingEngine.ts'
import {
  DEFAULT_AUTO_DUCKING,
  type AutoDuckingConfig,
  type TimelineClip,
  type Track,
  DEFAULT_TRANSFORM,
  DEFAULT_EFFECTS,
  DEFAULT_AUDIO_PROPS,
} from '../src/lib/hybridVideo/types.ts'

describe('Auto-Ducking (Smart Audio Mix) Engine Suite', () => {
  const sampleTracks: Track[] = [
    {
      id: 'track-voice-1',
      name: 'Voiceover',
      type: 'audio',
      volume: 1.0,
      muted: false,
      locked: false,
      hidden: false,
    },
    {
      id: 'track-music-1',
      name: 'Background Music',
      type: 'audio',
      volume: 1.0,
      muted: false,
      locked: false,
      hidden: false,
    },
  ]

  const createVoiceClip = (
    id: string,
    startSec: number,
    durationSec: number,
    volume = 1.0,
    muted = false
  ): TimelineClip => ({
    id,
    trackId: 'track-voice-1',
    name: `Voice Clip ${id}`,
    assetId: `asset-voice-${id}`,
    type: 'audio',
    startSec,
    durationSec,
    trimStartSec: 0,
    trimEndSec: 0,
    speed: 1.0,
    keyframes: [],
    transitionIn: { type: 'none', durationSec: 0 },
    transitionOut: { type: 'none', durationSec: 0 },
    transform: { ...DEFAULT_TRANSFORM },
    effects: { ...DEFAULT_EFFECTS },
    audioProps: { ...DEFAULT_AUDIO_PROPS, volume, muted },
  })

  it('provides all 4 predefined presets with valid, musically sound parameters', () => {
    assert.strictEqual(AUTO_DUCKING_PRESETS.length, 4)

    const presetIds = AUTO_DUCKING_PRESETS.map((p) => p.id)
    assert.ok(presetIds.includes('podcast'))
    assert.ok(presetIds.includes('voice-priority'))
    assert.ok(presetIds.includes('cinematic-dialogue'))
    assert.ok(presetIds.includes('subtle-background'))

    for (const preset of AUTO_DUCKING_PRESETS) {
      assert.ok(preset.config.duckAmountDb! <= -3, 'Duck amount should be at least -3dB')
      assert.ok(preset.config.duckAmountDb! >= -30, 'Duck amount should not exceed -30dB')
      assert.ok(preset.config.thresholdDb! <= -10, 'Threshold should be -10dB or lower')
      assert.ok(preset.config.attackSec! >= 0.02, 'Attack should be at least 20ms')
      assert.ok(preset.config.holdSec! >= 0.2, 'Hold should bridge pauses >= 200ms')
      assert.ok(preset.config.releaseSec! >= 0.2, 'Release should be smooth >= 200ms')
      assert.ok(preset.config.minMusicVolume! >= 0.05, 'Min volume should be above 0')
    }
  })

  it('returns a neutral 1.0 gain envelope when auto-ducking is disabled', () => {
    const config: AutoDuckingConfig = {
      ...DEFAULT_AUTO_DUCKING,
      enabled: false,
      voiceTrackId: 'track-voice-1',
      targetTrackIds: ['track-music-1'],
    }

    const clips = [createVoiceClip('v1', 1.0, 3.0)]
    const envelope = computeDuckingEnvelope(config, clips, sampleTracks, [], new Map(), 5.0, 50)

    assert.strictEqual(envelope.length, 250)
    for (const val of envelope) {
      assert.strictEqual(val, 1.0)
    }
  })

  it('bypasses ducking (neutral 1.0 gain) when the voice track is muted', () => {
    const config: AutoDuckingConfig = {
      ...DEFAULT_AUTO_DUCKING,
      enabled: true,
      voiceTrackId: 'track-voice-1',
      targetTrackIds: ['track-music-1'],
    }

    const mutedTracks: Track[] = [
      { ...sampleTracks[0], muted: true },
      sampleTracks[1],
    ]

    const clips = [createVoiceClip('v1', 1.0, 3.0)]
    const envelope = computeDuckingEnvelope(config, clips, mutedTracks, [], new Map(), 5.0, 50)

    for (const val of envelope) {
      assert.strictEqual(val, 1.0)
    }
  })

  it('bypasses ducking when voice clips are muted or zero volume', () => {
    const config: AutoDuckingConfig = {
      ...DEFAULT_AUTO_DUCKING,
      enabled: true,
      voiceTrackId: 'track-voice-1',
      targetTrackIds: ['track-music-1'],
    }

    const clips = [createVoiceClip('v1', 1.0, 3.0, 0, true)]
    const envelope = computeDuckingEnvelope(config, clips, sampleTracks, [], new Map(), 5.0, 50)

    for (const val of envelope) {
      assert.strictEqual(val, 1.0)
    }
  })

  it('reduces gain smoothly when speech begins and holds at target duck level', () => {
    const config: AutoDuckingConfig = {
      ...DEFAULT_AUTO_DUCKING,
      enabled: true,
      voiceTrackId: 'track-voice-1',
      targetTrackIds: ['track-music-1'],
      duckAmountDb: -12, // ~0.25 linear gain
      attackSec: 0.05,
      holdSec: 0.5,
      releaseSec: 0.4,
      minMusicVolume: 0.1,
    }

    // Voice speaking between 1.0s and 3.0s
    const clips = [createVoiceClip('v1', 1.0, 2.0)]
    const sampleRate = 100 // 100 samples per sec for precise testing
    const envelope = computeDuckingEnvelope(config, clips, sampleTracks, [], new Map(), 5.0, sampleRate)

    // Before speech (at 0.5s): music volume should be 1.0
    const gainBefore = getDuckingGainAtTime(envelope, 0.5, sampleRate)
    assert.strictEqual(gainBefore, 1.0)

    // During speech (at 2.0s): music volume should be ducked significantly
    const gainDuring = getDuckingGainAtTime(envelope, 2.0, sampleRate)
    assert.ok(gainDuring < 0.35, `Gain during speech should be ducked, got ${gainDuring}`)
    assert.ok(gainDuring >= 0.1, `Gain during speech should respect min floor, got ${gainDuring}`)

    // Immediately after speech within hold window (at 3.2s, speech ended at 3.0s, hold is 0.5s):
    // Gain should still be held low
    const gainHold = getDuckingGainAtTime(envelope, 3.2, sampleRate)
    assert.ok(gainHold < 0.4, `Gain should remain held during hold time, got ${gainHold}`)

    // Well after speech and release (at 4.8s):
    // Gain should be fully restored to 1.0
    const gainAfter = getDuckingGainAtTime(envelope, 4.8, sampleRate)
    assert.ok(gainAfter > 0.95, `Gain should recover to near 1.0 after release, got ${gainAfter}`)
  })

  it('bridges short pauses between dialogue sentences without volume pumping', () => {
    const config: AutoDuckingConfig = {
      ...DEFAULT_AUTO_DUCKING,
      enabled: true,
      voiceTrackId: 'track-voice-1',
      targetTrackIds: ['track-music-1'],
      duckAmountDb: -14,
      attackSec: 0.04,
      holdSec: 0.8, // 800ms hold bridges short gap
      releaseSec: 0.4,
    }

    // Two sentences: 1.0s to 2.0s, pause from 2.0s to 2.4s (400ms gap < 800ms hold), then 2.4s to 3.5s
    const clips = [
      createVoiceClip('v1', 1.0, 1.0),
      createVoiceClip('v2', 2.4, 1.1),
    ]

    const envelope = computeDuckingEnvelope(config, clips, sampleTracks, [], new Map(), 5.0, 100)

    // During pause at 2.2s (200ms into the 400ms pause):
    // The hold time should prevent music from jumping back up
    const gainInPause = getDuckingGainAtTime(envelope, 2.2, 100)
    assert.ok(
      gainInPause < 0.35,
      `Gain during pause should stay ducked thanks to hold time, got ${gainInPause}`
    )
  })

  it('respects minMusicVolume floor limit even with extreme ducking', () => {
    const config: AutoDuckingConfig = {
      ...DEFAULT_AUTO_DUCKING,
      enabled: true,
      voiceTrackId: 'track-voice-1',
      targetTrackIds: ['track-music-1'],
      duckAmountDb: -40, // Extreme -40 dB
      minMusicVolume: 0.2, // Floor is 20%
    }

    const clips = [createVoiceClip('v1', 0.5, 2.0)]
    const envelope = computeDuckingEnvelope(config, clips, sampleTracks, [], new Map(), 3.0, 100)

    const gainDuring = getDuckingGainAtTime(envelope, 1.5, 100)
    assert.ok(
      gainDuring >= 0.199,
      `Gain should never drop below minMusicVolume floor (0.2), got ${gainDuring}`
    )
  })

  it('isVoiceActiveAtTime accurately identifies speech windows', () => {
    const clips = [createVoiceClip('v1', 1.5, 2.0)]
    // Active between 1.5s and 3.5s
    assert.strictEqual(isVoiceActiveAtTime(clips, new Map(), new Map(), 1.0, -28), false)
    assert.strictEqual(isVoiceActiveAtTime(clips, new Map(), new Map(), 2.0, -28), true)
    assert.strictEqual(isVoiceActiveAtTime(clips, new Map(), new Map(), 3.4, -28), true)
    assert.strictEqual(isVoiceActiveAtTime(clips, new Map(), new Map(), 3.6, -28), false)
  })

  it('clamps getDuckingGainAtTime outside envelope boundaries safely', () => {
    const envelope = new Float32Array([0.5, 0.6, 0.7, 0.8])
    assert.ok(Math.abs(getDuckingGainAtTime(envelope, -1.0, 4) - 0.5) < 1e-5)
    assert.ok(Math.abs(getDuckingGainAtTime(envelope, 10.0, 4) - 0.8) < 1e-5)
    assert.strictEqual(getDuckingGainAtTime(new Float32Array(0), 1.0, 4), 1.0)
  })
})
