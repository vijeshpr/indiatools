import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  DEFAULT_SONIC_CAM_CONFIG,
  SonicCamStudioConfig,
  SonicCamPresetId,
} from '../src/lib/sonicCam/sonicCamTypes.ts'
import {
  SONIC_CAM_PRESETS,
  getSonicCamPreset,
} from '../src/lib/sonicCam/sonicCamPresets.ts'
import {
  generateUniformGrid,
  generateCinematicGrid,
  generateRandomRectangles,
  generateAutoRegions,
} from '../src/lib/sonicCam/sonicCamRegionGenerator.ts'
import {
  sonicCamBeatDetector,
  SonicCamBeatDetector,
} from '../src/lib/sonicCam/sonicCamBeatDetector.ts'
import {
  sonicCamSequencer,
  SonicCamSequencer,
} from '../src/lib/sonicCam/sonicCamSequencer.ts'
import {
  SonicCamEngine,
  sonicCamEngine,
} from '../src/lib/sonicCam/sonicCamEngine.ts'
import { AudioToVideoRenderEngine } from '../src/lib/audioToVideo/audioToVideoRenderEngine.ts'
import {
  DEFAULT_STUDIO_COMPOSITION,
  StudioCompositionConfig,
  NormalizedAudioBands,
} from '../src/lib/audioToVideo/types.ts'

describe('SonicCam — Beat-Synced Multi-Region Cinematic Studio Suite', () => {
  it('should enforce STRICT requirement: ALL effects OFF by default on initial launch', () => {
    assert.strictEqual(
      DEFAULT_SONIC_CAM_CONFIG.enabled,
      false,
      'Master studio toggle must be OFF by default'
    )
    assert.strictEqual(
      DEFAULT_SONIC_CAM_CONFIG.isBeforeActive,
      false,
      'Before/After comparison must start inactive'
    )
    assert.strictEqual(
      DEFAULT_SONIC_CAM_CONFIG.bassShake.enabled,
      false,
      'Bass shake must be OFF by default'
    )
    assert.strictEqual(
      DEFAULT_SONIC_CAM_CONFIG.innerMotion.enabled,
      false,
      'Inner camera motion must be OFF by default'
    )
    assert.strictEqual(
      DEFAULT_SONIC_CAM_CONFIG.showRegionBoundsInPreview,
      false,
      'Region bounds overlay must be OFF by default'
    )
  })

  it('should register exactly 9 curated beat-synced presets with valid configurations', () => {
    assert.strictEqual(
      SONIC_CAM_PRESETS.length,
      9,
      'Must provide exactly 9 curated presets'
    )

    const expectedPresetIds: SonicCamPresetId[] = [
      'cinematic-discovery',
      'beat-snap',
      'bass-impact',
      'rapid-cuts',
      'slow-emotional',
      'landscape-explorer',
      'object-focus',
      'minimal-clean',
      'custom-sequence',
    ]

    const actualIds = SONIC_CAM_PRESETS.map((p) => p.id)
    assert.deepStrictEqual(actualIds, expectedPresetIds)

    for (const preset of SONIC_CAM_PRESETS) {
      assert.ok(preset.name.length > 0, `Preset ${preset.id} must have a name`)
      assert.ok(preset.subtitle.length > 0, `Preset ${preset.id} must have a subtitle`)
      assert.ok(preset.description.length > 0, `Preset ${preset.id} must have a description`)
      assert.ok(preset.accentColor.startsWith('#'), `Preset ${preset.id} must have a valid hex accent`)
      assert.ok(preset.enabledModules.length > 0, `Preset ${preset.id} must specify enabled modules`)
      assert.ok(preset.config, `Preset ${preset.id} must provide functioning config`)

      const fetched = getSonicCamPreset(preset.id)
      assert.strictEqual(fetched.id, preset.id)
    }
  })

  it('should generate valid normalized image regions across all layout modes', () => {
    // 1. Uniform Grid
    for (const count of [4, 6, 9, 12, 16, 25]) {
      const uniform = generateUniformGrid(count)
      assert.strictEqual(uniform.length, count, `Uniform grid must generate exactly ${count} regions`)
      for (const r of uniform) {
        assert.ok(r.x >= 0 && r.x <= 1, 'Region x must be in [0, 1]')
        assert.ok(r.y >= 0 && r.y <= 1, 'Region y must be in [0, 1]')
        assert.ok(r.width > 0 && r.x + r.width <= 1.001, 'Region width must fit inside [0, 1]')
        assert.ok(r.height > 0 && r.y + r.height <= 1.001, 'Region height must fit inside [0, 1]')
      }
    }

    // 2. Cinematic Grid
    const cinematic = generateCinematicGrid(8)
    assert.strictEqual(cinematic.length, 8)
    for (const r of cinematic) {
      assert.ok(r.x >= 0 && r.x + r.width <= 1.001)
      assert.ok(r.y >= 0 && r.y + r.height <= 1.001)
    }

    // 3. Random Rectangles
    const random = generateRandomRectangles(10)
    assert.strictEqual(random.length, 10)
    for (const r of random) {
      assert.ok(r.x >= 0 && r.x + r.width <= 1.001)
      assert.ok(r.y >= 0 && r.y + r.height <= 1.001)
    }
  })

  it('should calculate full-screen crop rectangles without disproportionate stretching', () => {
    const sequencer = new SonicCamSequencer()

    const imgW = 1920
    const imgH = 1080
    const canvasW = 1920
    const canvasH = 1080
    const targetAspect = canvasW / canvasH

    // Test a wide region
    const wideCrop = sequencer.calculateFitCrop(100, 100, 1200, 400, imgW, imgH, canvasW, canvasH)
    const cropAspect = wideCrop.sw / wideCrop.sh
    assert.ok(
      Math.abs(cropAspect - targetAspect) < 0.001,
      `Crop aspect ratio must match canvas aspect ratio, got ${cropAspect} vs ${targetAspect}`
    )
    assert.ok(wideCrop.sx >= 0 && wideCrop.sx + wideCrop.sw <= imgW, 'Crop sx must stay within source image')
    assert.ok(wideCrop.sy >= 0 && wideCrop.sy + wideCrop.sh <= imgH, 'Crop sy must stay within source image')

    // Test a tall vertical region (e.g. portrait detail on 16:9 canvas)
    const tallCrop = sequencer.calculateFitCrop(200, 50, 400, 900, imgW, imgH, canvasW, canvasH)
    const tallAspect = tallCrop.sw / tallCrop.sh
    assert.ok(
      Math.abs(tallAspect - targetAspect) < 0.001,
      `Tall region crop must adapt to match canvas aspect ratio without distortion`
    )
    assert.ok(tallCrop.sx >= 0 && tallCrop.sx + tallCrop.sw <= imgW)
    assert.ok(tallCrop.sy >= 0 && tallCrop.sy + tallCrop.sh <= imgH)
  })

  it('should evaluate beat-synced sequence and bass micro-shake safely across playback', () => {
    const sequencer = new SonicCamSequencer()

    const regions = generateCinematicGrid(6)
    const beatMarkers = [
      { id: 'b1', timeSec: 1.0, strength: 0.9 },
      { id: 'b2', timeSec: 2.5, strength: 0.8 },
      { id: 'b3', timeSec: 4.0, strength: 0.95 },
      { id: 'b4', timeSec: 5.5, strength: 0.85 },
    ]

    const config: SonicCamStudioConfig = {
      ...DEFAULT_SONIC_CAM_CONFIG,
      enabled: true,
      regions,
      beatMarkers,
      sequencerMode: 'beat-driven',
      beatInterval: 1,
      noBeatBehavior: 'show-full-image',
      bassShake: {
        ...DEFAULT_SONIC_CAM_CONFIG.bassShake,
        enabled: true,
        intensity: 50,
      },
    }

    const mockBands: NormalizedAudioBands = {
      bass: 0.8,
      mid: 0.4,
      treble: 0.3,
      subBass: 0.85,
      overall: 0.6,
      isBeatHit: true,
    }

    // Evaluate at multiple timestamps
    for (const t of [0.5, 1.1, 2.6, 4.1, 5.6]) {
      const state = sequencer.evaluateFrame(config, t, 30.0, 1920, 1080, 1920, 1080, mockBands)
      assert.ok(Number.isFinite(state.shakeX), `Shake x must be finite at t=${t}`)
      assert.ok(Number.isFinite(state.shakeY), `Shake y must be finite at t=${t}`)
      assert.ok(Number.isFinite(state.shakeRotationRad), `Shake rotation must be finite at t=${t}`)
      assert.ok(state.cropRect.sw > 0 && state.cropRect.sh > 0, `Crop sw and sh must be positive`)
    }
  })

  it('should execute SonicCamEngine rendering pipeline across all 9 presets without throwing', () => {
    const mockCtx = {
      save: () => {},
      restore: () => {},
      clearRect: () => {},
      fillRect: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
      drawImage: () => {},
      translate: () => {},
      rotate: () => {},
      scale: () => {},
      transform: () => {},
      strokeRect: () => {},
      fillText: () => {},
      setLineDash: () => {},
      createRadialGradient: () => ({
        addColorStop: () => {},
      }),
      createLinearGradient: () => ({
        addColorStop: () => {},
      }),
    } as unknown as CanvasRenderingContext2D

    const mockBands: NormalizedAudioBands = {
      bass: 0.65,
      mid: 0.42,
      treble: 0.38,
      subBass: 0.70,
      overall: 0.55,
      isBeatHit: true,
    }

    const originalImage = (globalThis as any).Image
    try {
      class MockImage {
        public complete = true
        public naturalWidth = 1920
        public naturalHeight = 1080
        public width = 1920
        public height = 1080
        public crossOrigin = ''
        public src = ''
      }
      ;(globalThis as any).Image = MockImage

      const testEngine = new SonicCamEngine()

      for (const preset of SONIC_CAM_PRESETS) {
        const fullConfig: SonicCamStudioConfig = {
          ...DEFAULT_SONIC_CAM_CONFIG,
          ...preset.config,
          sourceImageUrl: 'data:image/png;base64,mock',
          enabled: true,
          regions: preset.config.regions || generateCinematicGrid(6),
        }

        assert.doesNotThrow(() => {
          testEngine.render(mockCtx, 1920, 1080, fullConfig, mockBands, 2.5, 30.0)
        }, `SonicCamEngine must render preset ${preset.id} without throwing`)
      }

      // Test all 15 cinematic transitions in active transition state (progress = 0.5)
      const allTransitions: SonicTransitionType[] = [
        'instant-cut',
        'snap-zoom',
        'smooth-zoom-cut',
        'whip-pan',
        'vertical-drop',
        'directional-slide',
        'flash-cut',
        'crossfade',
        'glitch-rgb',
        'spin-twist',
        'bass-shockwave',
        'film-burn',
        'zoom-through',
        'strobe-shutter',
        'prism-split',
      ]

      for (const tr of allTransitions) {
        const transConfig: SonicCamStudioConfig = {
          ...DEFAULT_SONIC_CAM_CONFIG,
          sourceImageUrl: 'data:image/png;base64,mock',
          enabled: true,
          transition: tr,
          transitionDurationSec: 0.5,
          regions: generateCinematicGrid(6),
        }

        assert.doesNotThrow(() => {
          testEngine.render(mockCtx, 1920, 1080, transConfig, mockBands, 1.25, 30.0)
        }, `SonicCamEngine must render transition style '${tr}' without throwing`)
      }

      // Test Before/After comparison mode
      const beforeConfig: SonicCamStudioConfig = {
        ...DEFAULT_SONIC_CAM_CONFIG,
        sourceImageUrl: 'data:image/png;base64,mock',
        enabled: true,
        isBeforeActive: true,
      }
      assert.doesNotThrow(() => {
        testEngine.render(mockCtx, 1920, 1080, beforeConfig, mockBands, 5.0, 30.0)
      }, 'SonicCamEngine must render in Before/After comparison mode without throwing')

      // Test integration with main AudioToVideoRenderEngine
      const renderEngine = new AudioToVideoRenderEngine()
      const studioConfig: StudioCompositionConfig = {
        ...DEFAULT_STUDIO_COMPOSITION,
        sonicCam3d: {
          ...DEFAULT_SONIC_CAM_CONFIG,
          sourceImageUrl: 'data:image/png;base64,mock',
          enabled: true,
          regions: generateCinematicGrid(6),
        },
      }

      const mockFreq = new Uint8Array(1024).fill(128)
      const mockTime = new Uint8Array(1024).fill(128)

      assert.doesNotThrow(() => {
        renderEngine.render(mockCtx, 1920, 1080, studioConfig, mockBands, mockFreq, mockTime, 5.0, 30.0)
      }, 'Main AudioToVideoRenderEngine must execute SonicCam composition branch without throwing')
    } finally {
      ;(globalThis as any).Image = originalImage
    }
  })
})
