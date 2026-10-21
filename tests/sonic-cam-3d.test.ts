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
  SonicCamEngine,
  sonicCamEngine,
} from '../src/lib/sonicCam/sonicCamEngine.ts'
import { AudioToVideoRenderEngine } from '../src/lib/audioToVideo/audioToVideoRenderEngine.ts'
import {
  DEFAULT_STUDIO_COMPOSITION,
  StudioCompositionConfig,
  NormalizedAudioBands,
} from '../src/lib/audioToVideo/types.ts'

describe('SonicCam 3D — Music-Reactive Cinematic Camera Studio Suite', () => {
  it('should enforce STRICT requirement: ALL effects OFF by default on initial launch', () => {
    assert.strictEqual(
      DEFAULT_SONIC_CAM_CONFIG.enabled,
      false,
      'Master studio toggle must be OFF by default'
    )
    assert.strictEqual(
      DEFAULT_SONIC_CAM_CONFIG.orbit.enabled,
      false,
      'Orbit module must be OFF by default'
    )
    assert.strictEqual(
      DEFAULT_SONIC_CAM_CONFIG.pushPull.enabled,
      false,
      'Push-Pull dolly module must be OFF by default'
    )
    assert.strictEqual(
      DEFAULT_SONIC_CAM_CONFIG.drift.enabled,
      false,
      'Drift module must be OFF by default'
    )
    assert.strictEqual(
      DEFAULT_SONIC_CAM_CONFIG.depth.enabled,
      false,
      'Depth parallax module must be OFF by default'
    )
    assert.strictEqual(
      DEFAULT_SONIC_CAM_CONFIG.tiltRise.enabled,
      false,
      'Tilt and rise module must be OFF by default'
    )
    assert.strictEqual(
      DEFAULT_SONIC_CAM_CONFIG.musicReactive.enabled,
      false,
      'Music reactivity must be OFF by default'
    )
    assert.strictEqual(
      DEFAULT_SONIC_CAM_CONFIG.cameraPath.enabled,
      false,
      'Dynamic camera path must be OFF by default'
    )
    assert.strictEqual(
      DEFAULT_SONIC_CAM_CONFIG.isBeforeActive,
      false,
      'Before/After comparison must start inactive'
    )
  })

  it('should register exactly 9 curated cinematic camera presets with valid configurations', () => {
    assert.strictEqual(
      SONIC_CAM_PRESETS.length,
      9,
      'Must provide exactly 9 curated camera presets'
    )

    const expectedPresetIds: SonicCamPresetId[] = [
      'epic-cinematic',
      'dreamy-floating',
      'bass-motion',
      'emotional-slow-motion',
      'cinematic-reveal',
      'orbit-experience',
      'music-video-dynamic',
      'minimal-natural',
      'custom-camera-path',
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

      // Verify getter function
      const fetched = getSonicCamPreset(preset.id)
      assert.strictEqual(fetched.id, preset.id)
    }
  })

  it('should calculate camera transform matrices safely with overscan and boundary protection', () => {
    const engine = new SonicCamEngine()

    const mockConfig: SonicCamStudioConfig = {
      ...DEFAULT_SONIC_CAM_CONFIG,
      enabled: true,
      orbit: {
        ...DEFAULT_SONIC_CAM_CONFIG.orbit,
        enabled: true,
        rangeDeg: 15,
        speed: 1.0,
      },
      pushPull: {
        ...DEFAULT_SONIC_CAM_CONFIG.pushPull,
        enabled: true,
        mode: 'push-in',
        startZoom: 1.05,
        endZoom: 1.35,
        overscan: 1.20,
      },
      drift: {
        ...DEFAULT_SONIC_CAM_CONFIG.drift,
        enabled: true,
        amplitude: 30,
      },
    }

    // Test at start, middle, and end of 30s track
    for (const time of [0, 5, 15, 29.5]) {
      const transform = engine.calculateCameraTransform(mockConfig, time, 30.0, 1920, 1080)

      assert.ok(!isNaN(transform.x), `Transform x must not be NaN at t=${time}`)
      assert.ok(!isNaN(transform.y), `Transform y must not be NaN at t=${time}`)
      assert.ok(!isNaN(transform.zoom), `Transform zoom must not be NaN at t=${time}`)
      assert.ok(!isNaN(transform.rotation), `Transform rotation must not be NaN at t=${time}`)
      assert.ok(!isNaN(transform.tilt), `Transform tilt must not be NaN at t=${time}`)
      assert.ok(transform.overscan >= 1.05, `Overscan must be >= 1.05 to guarantee zero black borders, got ${transform.overscan}`)
      assert.ok(transform.zoom >= 1.0 && transform.zoom <= 2.5, `Zoom must be bounded in [1.0, 2.5], got ${transform.zoom}`)
    }
  })

  it('should interpolate multi-keyframe camera paths smoothly without numerical instability', () => {
    const engine = new SonicCamEngine()

    const pathConfig: SonicCamStudioConfig = {
      ...DEFAULT_SONIC_CAM_CONFIG,
      enabled: true,
      cameraPath: {
        enabled: true,
        pathPreset: 'custom',
        autoInterpolate: true,
        keyframes: [
          {
            id: 'kf-1',
            timeSec: 0,
            xOffset: 0,
            yOffset: 0,
            zoom: 1.05,
            tiltDeg: 0,
            orbitDeg: 0,
            intensity: 50,
            easing: 'ease-in-out',
          },
          {
            id: 'kf-2',
            timeSec: 10,
            xOffset: 40,
            yOffset: -20,
            zoom: 1.40,
            tiltDeg: 5,
            orbitDeg: 12,
            intensity: 80,
            easing: 'cinematic-bezier',
          },
          {
            id: 'kf-3',
            timeSec: 20,
            xOffset: -30,
            yOffset: 15,
            zoom: 1.15,
            tiltDeg: -3,
            orbitDeg: -8,
            intensity: 60,
            easing: 'ease-out',
          },
        ],
      },
    }

    // Sample across timeline
    for (let t = 0; t <= 20; t += 2) {
      const transform = engine.calculateCameraTransform(pathConfig, t, 20, 1920, 1080)
      assert.ok(Number.isFinite(transform.x), `Interpolated x at t=${t} must be finite`)
      assert.ok(Number.isFinite(transform.y), `Interpolated y at t=${t} must be finite`)
      assert.ok(Number.isFinite(transform.zoom), `Interpolated zoom at t=${t} must be finite`)
      assert.ok(transform.zoom >= 1.0, `Zoom must stay >= 1.0, got ${transform.zoom}`)
    }
  })

  it('should execute SonicCamEngine rendering pipeline across all 9 presets without throwing', () => {
    // Mock 2D Canvas context
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

    // Mock Image in Node.js test environment
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
        }

        assert.doesNotThrow(() => {
          testEngine.render(mockCtx, 1920, 1080, fullConfig, mockBands, 6.5, 30.0)
        }, `SonicCamEngine must render preset ${preset.id} without throwing`)
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
          orbit: { ...DEFAULT_SONIC_CAM_CONFIG.orbit, enabled: true },
        },
      }

      const mockFreq = new Uint8Array(1024).fill(128)
      const mockTime = new Uint8Array(1024).fill(128)

      assert.doesNotThrow(() => {
        renderEngine.render(mockCtx, 1920, 1080, studioConfig, mockBands, mockFreq, mockTime, 5.0, 30.0)
      }, 'Main AudioToVideoRenderEngine must execute SonicCam 3D composition branch without throwing')
    } finally {
      ;(globalThis as any).Image = originalImage
    }
  })
})
