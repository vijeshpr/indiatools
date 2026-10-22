import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  DEFAULT_MEMORY_BURST_CONFIG,
  MemoryBurstStudioConfig,
  MemoryBurstPhoto,
} from '../src/lib/memoryBurst/memoryBurstTypes.ts'
import {
  MEMORY_BURST_PRESETS,
  applyMemoryBurstPreset,
} from '../src/lib/memoryBurst/memoryBurstPresets.ts'
import {
  memoryBurstBeatDetector,
  MemoryBurstBeatDetector,
} from '../src/lib/memoryBurst/memoryBurstBeatDetector.ts'
import {
  memoryBurstSequencer,
  MemoryBurstSequencer,
} from '../src/lib/memoryBurst/memoryBurstSequencer.ts'
import {
  memoryBurstEngine,
  MemoryBurstEngine,
} from '../src/lib/memoryBurst/memoryBurstEngine.ts'
import {
  DEFAULT_STUDIO_COMPOSITION,
  NormalizedAudioBands,
} from '../src/lib/audioToVideo/types.ts'

describe('Memory Burst Studio — Music-Reactive Multi-Photo Cinematic Suite', () => {
  it('should enforce STRICT requirement: ALL visual effects OFF by default on initial launch', () => {
    assert.strictEqual(
      DEFAULT_MEMORY_BURST_CONFIG.enabled,
      false,
      'Master studio toggle must be OFF by default'
    )
    assert.strictEqual(
      DEFAULT_MEMORY_BURST_CONFIG.isBeforeActive,
      false,
      'Before/After comparison must start in After (dynamic) mode'
    )
    assert.strictEqual(
      DEFAULT_MEMORY_BURST_CONFIG.scalePunch.enabled,
      false,
      'Scale punch must be OFF by default'
    )
    assert.strictEqual(
      DEFAULT_MEMORY_BURST_CONFIG.bassShake.enabled,
      false,
      'Bass micro-shake must be OFF by default'
    )
    assert.strictEqual(
      DEFAULT_MEMORY_BURST_CONFIG.flash.enabled,
      false,
      'Flash cut must be OFF by default'
    )
    assert.strictEqual(
      DEFAULT_MEMORY_BURST_CONFIG.photos.length,
      0,
      'Photos list must start empty'
    )
    assert.strictEqual(
      DEFAULT_MEMORY_BURST_CONFIG.climax.enabled,
      false,
      'Climax mode must be OFF by default'
    )
    assert.strictEqual(
      DEFAULT_MEMORY_BURST_CONFIG.climax.zoomPunchEnabled,
      false,
      'Climax zoom punch must be OFF by default'
    )
    assert.strictEqual(
      DEFAULT_MEMORY_BURST_CONFIG.climax.flashEnabled,
      false,
      'Climax flash must be OFF by default'
    )
    assert.strictEqual(
      DEFAULT_MEMORY_BURST_CONFIG.climax.accelerationEnabled,
      false,
      'Climax acceleration must be OFF by default'
    )
    assert.strictEqual(
      DEFAULT_STUDIO_COMPOSITION.memoryBurst?.enabled,
      false,
      'StudioCompositionConfig default must have memoryBurst disabled'
    )
  })

  it('should register curated rhythm presets with distinct configurations', () => {
    assert.ok(MEMORY_BURST_PRESETS.length >= 6, 'Must provide at least 6 curated presets')

    const neutral = MEMORY_BURST_PRESETS.find((p) => p.id === 'pure-neutral')
    assert.ok(neutral, 'Must provide Pure Neutral preset')
    assert.strictEqual(neutral?.config.scalePunch?.enabled, false)
    assert.strictEqual(neutral?.config.bassShake?.enabled, false)
    assert.strictEqual(neutral?.config.flash?.enabled, false)

    const kinetic = MEMORY_BURST_PRESETS.find((p) => p.id === 'kinetic-memory-rush')
    assert.ok(kinetic, 'Must provide Kinetic Memory Rush preset')
    assert.strictEqual(kinetic?.config.scalePunch?.enabled, true)

    const bass = MEMORY_BURST_PRESETS.find((p) => p.id === 'heavy-bass-strobe')
    assert.ok(bass, 'Must provide Heavy Bass Strobe preset')
    assert.strictEqual(bass?.config.bassShake?.enabled, true)

    const rewind = MEMORY_BURST_PRESETS.find((p) => p.id === 'memory-rewind-climax')
    assert.ok(rewind, 'Must provide Memory Rewind (Climax) preset')
    assert.strictEqual(rewind?.config.mode, 'memory-rewind')
    assert.strictEqual(rewind?.config.climax?.enabled, true)
    assert.strictEqual(rewind?.config.climax?.photoOrder, 'reverse')
    assert.strictEqual(rewind?.config.climax?.accelerationEnabled, true)

    // Test applyMemoryBurstPreset
    const applied = applyMemoryBurstPreset(DEFAULT_MEMORY_BURST_CONFIG, 'kinetic-memory-rush')
    assert.strictEqual(applied.scalePunch.enabled, true)
    assert.strictEqual(applied.mode, 'beat-sync')
  })

  it('should compute exact cover crops preserving image aspect ratio across resolutions', () => {
    // 16:9 canvas with 4:3 photo (wider crop top/bottom)
    const crop1 = memoryBurstSequencer.calculateCoverCrop(1600, 1200, 1920, 1080)
    assert.strictEqual(crop1.sw, 1600)
    assert.strictEqual(Math.round(crop1.sh), 900)
    assert.strictEqual(crop1.sx, 0)
    assert.strictEqual(Math.round(crop1.sy), 150)

    // 16:9 canvas with 21:9 photo (wider crop left/right)
    const crop2 = memoryBurstSequencer.calculateCoverCrop(2100, 900, 1920, 1080)
    assert.strictEqual(crop2.sh, 900)
    assert.strictEqual(Math.round(crop2.sw), 1600)
    assert.strictEqual(Math.round(crop2.sx), 250)
    assert.strictEqual(crop2.sy, 0)

    // 9:16 vertical canvas with square photo
    const crop3 = memoryBurstSequencer.calculateCoverCrop(1000, 1000, 1080, 1920)
    assert.strictEqual(crop3.sh, 1000)
    assert.strictEqual(Math.round(crop3.sw), 563)
    assert.ok(crop3.sx > 0)
  })

  it('should safely handle empty photo lists without throwing exceptions', () => {
    const emptyConfig: MemoryBurstStudioConfig = {
      ...DEFAULT_MEMORY_BURST_CONFIG,
      photos: [],
    }
    const bands: NormalizedAudioBands = {
      bass: 0.5,
      mid: 0.5,
      treble: 0.5,
      subBass: 0.5,
      overall: 0.5,
      isBeatHit: true,
    }

    const state = memoryBurstSequencer.evaluateAtTime(emptyConfig, 2.5, 30, bands)
    assert.strictEqual(state.currentPhoto, null, 'Current photo should be null for empty list')
    assert.strictEqual(state.previousPhoto, null, 'Previous photo should be null for empty list')
    assert.strictEqual(state.transitionProgress, 1)
  })

  it('should calculate sequential photo progression across musical timeline', () => {
    const samplePhotos: MemoryBurstPhoto[] = [
      { id: 'p1', url: 'https://indiatools-rho.vercel.app/images/1.jpg', name: 'Photo 1', durationSec: 2 },
      { id: 'p2', url: 'https://indiatools-rho.vercel.app/images/2.jpg', name: 'Photo 2', durationSec: 2 },
      { id: 'p3', url: 'https://indiatools-rho.vercel.app/images/3.jpg', name: 'Photo 3', durationSec: 2 },
    ]

    const config: MemoryBurstStudioConfig = {
      ...DEFAULT_MEMORY_BURST_CONFIG,
      photos: samplePhotos,
      mode: 'manual-timing',
      defaultPhotoDurationSec: 2.0,
      transitionDurationSec: 0.2,
    }

    const bands: NormalizedAudioBands = {
      bass: 0.1,
      mid: 0.1,
      treble: 0.1,
      subBass: 0.1,
      overall: 0.1,
      isBeatHit: false,
    }

    // At t = 0.5s: Photo 1 is active
    const stateAt0_5 = memoryBurstSequencer.evaluateAtTime(config, 0.5, 10, bands)
    assert.strictEqual(stateAt0_5.currentPhoto?.id, 'p1')

    // At t = 2.5s: Photo 2 is active
    const stateAt2_5 = memoryBurstSequencer.evaluateAtTime(config, 2.5, 10, bands)
    assert.strictEqual(stateAt2_5.currentPhoto?.id, 'p2')

    // At t = 4.5s: Photo 3 is active
    const stateAt4_5 = memoryBurstSequencer.evaluateAtTime(config, 4.5, 10, bands)
    assert.strictEqual(stateAt4_5.currentPhoto?.id, 'p3')
  })

  it('should calculate scale punch, bass micro-shake, and flash decay correctly', () => {
    const samplePhotos: MemoryBurstPhoto[] = [
      { id: 'p1', url: 'https://indiatools-rho.vercel.app/images/sample1.jpg', name: 'Photo 1' },
      { id: 'p2', url: 'https://indiatools-rho.vercel.app/images/sample2.jpg', name: 'Photo 2' },
    ]

    const config: MemoryBurstStudioConfig = {
      ...DEFAULT_MEMORY_BURST_CONFIG,
      photos: samplePhotos,
      mode: 'beat-sync',
      scalePunch: { enabled: true, startScale: 1.08, intensity: 80 },
      bassShake: { enabled: true, intensity: 50, bassSensitivity: 60, maxDisplacementPx: 12 },
      flash: { enabled: true, type: 'white', opacity: 0.4, durationSec: 0.15 },
    }

    const bands: NormalizedAudioBands = {
      bass: 0.8,
      mid: 0.5,
      treble: 0.3,
      subBass: 0.9,
      overall: 0.7,
      isBeatHit: true,
    }

    // On beat hit onset (t = 1.0s, beat event triggered)
    const state = memoryBurstSequencer.evaluateAtTime(config, 1.0, 20, bands)
    assert.ok(state.scalePunch >= 1.0, 'Scale punch should be >= 1.0')
    assert.ok(state.scalePunch <= 1.15, 'Scale punch should not exceed maximum bounded punch')
    assert.ok(state.bassShakeX !== undefined)
    assert.ok(state.bassShakeY !== undefined)
    assert.ok(state.flashOpacity >= 0)
    assert.ok(state.flashOpacity <= 0.6)
  })

  it('should generate fallback musical rhythm beats when audio has no clear transient onsets', () => {
    const detector = new MemoryBurstBeatDetector()
    const beats = detector.generateFallbackBeats(10, 0.25)
    assert.ok(beats.length > 5, 'Fallback generator must produce beats for full duration')
    assert.ok(beats[0].timeSec > 0 && beats[0].timeSec < 1.0)
    assert.strictEqual(beats[0].strength, 0.7)
  })

  it('should generate accelerating BKU climax memory rewind montage with flashback sequence & hold frames', () => {
    const photos: MemoryBurstPhoto[] = [
      { id: 'p0', url: 'https://indiatools-rho.vercel.app/images/sample0.jpg', name: 'Photo 0' },
      { id: 'p1', url: 'https://indiatools-rho.vercel.app/images/sample1.jpg', name: 'Photo 1' },
      { id: 'p2', url: 'https://indiatools-rho.vercel.app/images/sample2.jpg', name: 'Photo 2' },
      { id: 'p3', url: 'https://indiatools-rho.vercel.app/images/sample3.jpg', name: 'Photo 3' },
      { id: 'p4', url: 'https://indiatools-rho.vercel.app/images/sample4.jpg', name: 'Photo 4' },
    ]

    const config: MemoryBurstStudioConfig = {
      ...DEFAULT_MEMORY_BURST_CONFIG,
      photos,
      mode: 'memory-rewind',
      climax: {
        enabled: true,
        startSec: 4.0,
        endSec: 12.0,
        burstDurationSec: 8.0,
        cutSpeedMultiplier: 1.0,
        photoOrder: 'reverse',
        zoomPunchEnabled: true,
        flashEnabled: true,
        fadeWipeEnabled: true,
        crossfadeEnabled: false,
        accelerationEnabled: true,
        accelerationStrength: 3,
        startHoldSec: 2.0,
        endingHoldEnabled: true,
        endHoldSec: 3.0,
      },
    }

    const schedule = memoryBurstSequencer.buildClimaxSchedule(config, 20.0, photos.length)
    assert.ok(schedule.length > 5, 'Schedule must generate shots across timeline')

    // Start Hold Frame
    assert.strictEqual(schedule[0].startTime, 0)
    assert.strictEqual(schedule[0].duration, 2.0)
    assert.strictEqual(schedule[0].photoIndex, 0)

    // Climax burst entries (start at 4.0s)
    const climaxEntries = schedule.filter((s) => s.startTime >= 4.0 && s.startTime < 12.0)
    assert.ok(climaxEntries.length >= 10, 'Climax burst must generate fast rapid cuts')

    // Check acceleration: early cuts in climax should have longer duration than peak climax cuts
    const firstClimaxCut = climaxEntries[0]
    const lateClimaxCut = climaxEntries[climaxEntries.length - 1]
    assert.ok(
      firstClimaxCut.duration > lateClimaxCut.duration,
      `Early cut duration (${firstClimaxCut.duration}s) must be longer than late cut duration (${lateClimaxCut.duration}s)`
    )

    // Check Reverse (Rewind) Order progression: p4 (index 4) should appear first, followed by p3, p2, p1, p0
    assert.strictEqual(climaxEntries[0].photoIndex, 4)
    assert.strictEqual(climaxEntries[1].photoIndex, 3)
    assert.strictEqual(climaxEntries[2].photoIndex, 2)

    // Check Ending Emotional Hold Frame at t = 12.0s
    const postClimaxEntry = schedule.find((s) => s.startTime >= 12.0)
    assert.ok(postClimaxEntry, 'Ending hold frame entry must exist')
    assert.strictEqual(postClimaxEntry?.duration, 3.0, 'Ending hold duration must be 3.0s')

    // Test evaluateAtTime inside climax window
    const bands: NormalizedAudioBands = {
      bass: 0.7,
      mid: 0.5,
      treble: 0.4,
      subBass: 0.8,
      overall: 0.6,
      isBeatHit: true,
    }
    const stateAtPeak = memoryBurstSequencer.evaluateAtTime(config, 8.0, 20.0, bands)
    assert.strictEqual(stateAtPeak.transitionStyle, 'fade-wipe')
    assert.ok(stateAtPeak.scalePunch >= 1.0)
  })

  it('should support rhythm-synced cinematic zoom with bass pulse and toggle control', () => {
    const photos: MemoryBurstPhoto[] = [
      { id: 'p1', url: 'https://indiatools-rho.vercel.app/images/sample1.jpg', name: 'Photo 1' },
      { id: 'p2', url: 'https://indiatools-rho.vercel.app/images/sample2.jpg', name: 'Photo 2' },
    ]

    const configZoomOn: MemoryBurstStudioConfig = {
      ...DEFAULT_MEMORY_BURST_CONFIG,
      photos,
      rhythmZoom: {
        enabled: true,
        style: 'rhythm-pulse',
        intensity: 80,
        maxZoom: 1.10,
      },
    }

    const highBassBands: NormalizedAudioBands = {
      bass: 0.9,
      mid: 0.4,
      treble: 0.2,
      subBass: 0.95,
      overall: 0.8,
      isBeatHit: true,
    }

    const stateZoomOn = memoryBurstSequencer.evaluateAtTime(configZoomOn, 1.0, 20, highBassBands)
    assert.ok(stateZoomOn.rhythmZoom > 1.0, 'Rhythm zoom should react and increase on high bass')
    assert.ok(stateZoomOn.totalZoom >= stateZoomOn.rhythmZoom)

    // When toggled OFF ("vendenkil off aakanulla option")
    const configZoomOff: MemoryBurstStudioConfig = {
      ...configZoomOn,
      rhythmZoom: {
        ...configZoomOn.rhythmZoom,
        enabled: false,
      },
    }

    const stateZoomOff = memoryBurstSequencer.evaluateAtTime(configZoomOff, 1.0, 20, highBassBands)
    assert.strictEqual(stateZoomOff.rhythmZoom, 1.0, 'Rhythm zoom must be 1.0 when disabled')
    assert.strictEqual(stateZoomOff.totalZoom, 1.0, 'Total zoom must be 1.0 when zoom is disabled')
  })

  it('should guarantee that photos in beat-sync mode transition strictly according to beat rhythm', () => {
    const photos: MemoryBurstPhoto[] = [
      { id: 'p1', url: 'https://indiatools-rho.vercel.app/images/sample1.jpg', name: 'Photo 1' },
      { id: 'p2', url: 'https://indiatools-rho.vercel.app/images/sample2.jpg', name: 'Photo 2' },
      { id: 'p3', url: 'https://indiatools-rho.vercel.app/images/sample3.jpg', name: 'Photo 3' },
    ]

    // Empty markers in beat-sync should automatically generate rhythm-synced beats, never a static 1.5s timer!
    const config: MemoryBurstStudioConfig = {
      ...DEFAULT_MEMORY_BURST_CONFIG,
      photos,
      mode: 'beat-sync',
      beatMarkers: [],
      minCutIntervalSec: 0.4,
    }

    const schedule = memoryBurstSequencer.buildSchedule(config, 10.0, photos.length)
    assert.ok(schedule.length > 5, 'Must generate rhythm beat schedule')
    assert.ok(schedule[1].startTime > 0 && schedule[1].startTime <= 0.6)
  })

  it('should safely manage object URLs and canvas caches in MemoryBurstEngine', () => {
    const engine = new MemoryBurstEngine()
    assert.doesNotThrow(() => {
      engine.revokeUrl('blob:https://indiatools-rho.vercel.app/test-uuid')
    })
    assert.strictEqual(engine.getCachedImage(''), null)
  })
})
