import { describe, it } from 'node:test'
import assert from 'node:assert'
import { TOOLS, getToolBySlug, CATEGORIES } from '../src/data/tools.ts'
import {
  ASPECT_RATIO_RESOLUTIONS,
  DEFAULT_STUDIO_COMPOSITION,
  StudioCompositionConfig,
} from '../src/lib/audioToVideo/types.ts'
import {
  BACKGROUND_PRESETS,
  drawProceduralBackground,
} from '../src/lib/audioToVideo/backgroundPresets.ts'
import { AudioToVideoAudioEngine } from '../src/lib/audioToVideo/audioToVideoAudioEngine.ts'
import { AudioToVideoRenderEngine } from '../src/lib/audioToVideo/audioToVideoRenderEngine.ts'
import { AudioToVideoExportEngine } from '../src/lib/audioToVideo/audioToVideoExportEngine.ts'
import {
  DEFAULT_PHOTO_MOTION_CONFIG,
  CINEMATIC_COLOR_PRESETS,
  CameraMotionPreset,
  CameraEasing,
  AtmosphericParticleType,
} from '../src/lib/audioToVideo/photoMotionTypes.ts'
import {
  PhotoMotionStudioEngine,
  studioPhotoMotionEngine,
} from '../src/lib/audioToVideo/photoMotionEngine.ts'

describe('IndiaTools Audio to Video Studio Suite', () => {
  it('should be correctly registered as Tool #69 in TOOLS registry', () => {
    assert.strictEqual(TOOLS.length, 69, 'Total tool count should be exactly 69')
    assert.strictEqual(CATEGORIES.create.toolCount, 28, 'Create category tool count should be 28')

    const tool = getToolBySlug('audio-to-video-studio')
    assert.ok(tool, 'Tool must be found by slug audio-to-video-studio')
    assert.strictEqual(tool.id, 'audio-to-video-studio')
    assert.strictEqual(tool.category, 'create')
    assert.strictEqual(tool.type, 'image-tool')
    assert.strictEqual(tool.badge, 'Flagship')
    assert.strictEqual(tool.color, '#8B5CF6')
    assert.strictEqual(tool.seo.canonicalPath, '/tools/audio-to-video-studio')
    assert.strictEqual(tool.seo.title, 'Audio to Video Converter Online Free | IndiaTools')
    assert.ok(
      tool.seo.metaDescription.includes('Convert audio into cinematic music videos'),
      'Meta description must match requirements'
    )
    assert.ok(tool.faqs.length >= 4, 'Must provide comprehensive FAQs')
    assert.ok(tool.searchKeywords.length >= 6, 'Must provide search keywords')
    assert.ok(tool.tags.length >= 5, 'Must provide category tags')
  })

  it('should provide complete aspect ratios and resolutions', () => {
    // 16:9 Landscape
    assert.strictEqual(ASPECT_RATIO_RESOLUTIONS['16:9']['1080p'].width, 1920)
    assert.strictEqual(ASPECT_RATIO_RESOLUTIONS['16:9']['1080p'].height, 1080)
    assert.strictEqual(ASPECT_RATIO_RESOLUTIONS['16:9']['720p'].width, 1280)
    assert.strictEqual(ASPECT_RATIO_RESOLUTIONS['16:9']['720p'].height, 720)

    // 9:16 Vertical
    assert.strictEqual(ASPECT_RATIO_RESOLUTIONS['9:16']['1080p'].width, 1080)
    assert.strictEqual(ASPECT_RATIO_RESOLUTIONS['9:16']['1080p'].height, 1920)
    assert.strictEqual(ASPECT_RATIO_RESOLUTIONS['9:16']['720p'].width, 720)
    assert.strictEqual(ASPECT_RATIO_RESOLUTIONS['9:16']['720p'].height, 1280)

    // 1:1 Square
    assert.strictEqual(ASPECT_RATIO_RESOLUTIONS['1:1']['1080p'].width, 1080)
    assert.strictEqual(ASPECT_RATIO_RESOLUTIONS['1:1']['1080p'].height, 1080)
    assert.strictEqual(ASPECT_RATIO_RESOLUTIONS['1:1']['720p'].width, 720)
    assert.strictEqual(ASPECT_RATIO_RESOLUTIONS['1:1']['720p'].height, 720)
  })

  it('should register exactly 12 curated cinematic background presets', () => {
    assert.strictEqual(BACKGROUND_PRESETS.length, 12)

    const expectedPresets = [
      'night-city',
      'romantic-rain',
      'rainy-window',
      'ocean-waves',
      'mountain-landscapes',
      'forest-nature',
      'galaxy-stars',
      'sunset-sunrise',
      'abstract-neon',
      'minimal-dark',
      'dreamy-bokeh',
      'cinematic-light',
    ]

    const presetIds = BACKGROUND_PRESETS.map((p) => p.id)
    assert.deepStrictEqual(presetIds, expectedPresets)

    for (const p of BACKGROUND_PRESETS) {
      assert.ok(p.name.length > 0, `Preset ${p.id} must have a name`)
      assert.ok(p.subtitle.length > 0, `Preset ${p.id} must have a subtitle`)
      assert.ok(p.category.length > 0, `Preset ${p.id} must have a category`)
      assert.ok(p.accentColor.startsWith('#'), `Preset ${p.id} accent color must be hex`)
      assert.strictEqual(p.gradient.length, 3, `Preset ${p.id} gradient must have 3 stops`)
    }
  })

  it('should initialize AudioToVideoAudioEngine with safe DSP fallback analysis', () => {
    const audioEngine = new AudioToVideoAudioEngine()
    assert.ok(audioEngine)

    const analysis = audioEngine.analyze()
    assert.strictEqual(analysis.bands.bass, 0)
    assert.strictEqual(analysis.bands.mid, 0)
    assert.strictEqual(analysis.bands.treble, 0)
    assert.strictEqual(analysis.bands.subBass, 0)
    assert.strictEqual(analysis.bands.isBeatHit, false)

    audioEngine.destroy()
  })

  it('should render all 12 procedural background presets without throwing errors', () => {
    const createMockCtx = () => {
      const gradMock = { addColorStop: () => {} }
      return {
        save: () => {},
        restore: () => {},
        fillRect: () => {},
        beginPath: () => {},
        closePath: () => {},
        arc: () => {},
        moveTo: () => {},
        lineTo: () => {},
        stroke: () => {},
        fill: () => {},
        createLinearGradient: () => gradMock,
        createRadialGradient: () => gradMock,
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        globalAlpha: 1,
      } as any
    }

    const mockCtx = createMockCtx()

    for (const preset of BACKGROUND_PRESETS) {
      assert.doesNotThrow(() => {
        drawProceduralBackground(mockCtx, 1920, 1080, preset.id, 2.5, 0.7, 100)
      }, `Preset ${preset.id} must render without error`)
    }
  })

  it('should initialize AudioToVideoRenderEngine and execute 60 FPS visualizer composition pipeline', () => {
    const renderEngine = new AudioToVideoRenderEngine()
    assert.ok(renderEngine)

    const gradMock = { addColorStop: () => {} }
    const mockCtx = {
      canvas: { width: 1920, height: 1080 },
      save: () => {},
      restore: () => {},
      clearRect: () => {},
      fillRect: () => {},
      beginPath: () => {},
      closePath: () => {},
      arc: () => {},
      moveTo: () => {},
      lineTo: () => {},
      quadraticCurveTo: () => {},
      stroke: () => {},
      fill: () => {},
      translate: () => {},
      scale: () => {},
      fillText: () => {},
      measureText: () => ({ width: 100 }),
      createLinearGradient: () => gradMock,
      createRadialGradient: () => gradMock,
      drawImage: () => {},
      fillStyle: '',
      strokeStyle: '',
      shadowColor: '',
      shadowBlur: 0,
      lineWidth: 1,
      lineCap: 'round',
      globalAlpha: 1,
      font: '',
      textAlign: 'center',
    } as any

    const mockBands = {
      bass: 0.85,
      mid: 0.45,
      treble: 0.35,
      subBass: 0.9,
      overall: 0.65,
      isBeatHit: true,
    }

    const mockFreq = new Uint8Array(1024).fill(120)
    const mockTime = new Uint8Array(1024).fill(128)

    // Test across all visualizer styles
    const spectrumStyles = ['circular', 'bars', 'mirrored', 'bottom-equalizer'] as const
    const waveformStyles = ['smooth-center', 'oscilloscope', 'dual-sided', 'none'] as const

    for (const spec of spectrumStyles) {
      for (const wave of waveformStyles) {
        const config: StudioCompositionConfig = {
          ...DEFAULT_STUDIO_COMPOSITION,
          visualizer: {
            ...DEFAULT_STUDIO_COMPOSITION.visualizer,
            spectrumStyle: spec,
            waveformStyle: wave,
          },
        }

        assert.doesNotThrow(() => {
          renderEngine.render(mockCtx, 1920, 1080, config, mockBands, mockFreq, mockTime, 5.0, 30.0)
        }, `Render combination ${spec} + ${wave} must not throw`)
      }
    }
  })

  it('should support multi-language typography including Malayalam, Tamil, Hindi, and English', () => {
    const renderEngine = new AudioToVideoRenderEngine()

    const gradMock = { addColorStop: () => {} }
    let renderedTexts: string[] = []
    const mockCtx = {
      canvas: { width: 1920, height: 1080 },
      save: () => {},
      restore: () => {},
      clearRect: () => {},
      fillRect: () => {},
      beginPath: () => {},
      closePath: () => {},
      arc: () => {},
      moveTo: () => {},
      lineTo: () => {},
      quadraticCurveTo: () => {},
      stroke: () => {},
      fill: () => {},
      translate: () => {},
      scale: () => {},
      fillText: (text: string) => {
        renderedTexts.push(text)
      },
      createLinearGradient: () => gradMock,
      createRadialGradient: () => gradMock,
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      globalAlpha: 1,
      font: '',
      textAlign: 'center',
    } as any

    const testLanguages = [
      { lang: 'ml', title: 'മഴത്തുള്ളികൾ - ആൽബം ഗാനം' },
      { lang: 'ta', title: 'மழைத்துளிகள் - பாடல்' },
      { lang: 'te', title: 'వర్షపు బిందువులు - పాట' },
      { lang: 'hi', title: 'बारिश की बूँदें - संगीत' },
      { lang: 'en', title: 'Midnight Raindrops - Official Visualizer' },
    ]

    for (const test of testLanguages) {
      renderedTexts = []
      const config: StudioCompositionConfig = {
        ...DEFAULT_STUDIO_COMPOSITION,
        textOverlay: {
          ...DEFAULT_STUDIO_COMPOSITION.textOverlay,
          title: test.title,
        },
      }

      assert.doesNotThrow(() => {
        renderEngine.render(
          mockCtx,
          1920,
          1080,
          config,
          { bass: 0.5, mid: 0.5, treble: 0.5, subBass: 0.5, overall: 0.5, isBeatHit: false },
          new Uint8Array(1024),
          new Uint8Array(1024),
          2.0,
          30.0
        )
      })
      assert.ok(renderedTexts.includes(test.title), `Text overlay should render authentic ${test.lang} string: ${test.title}`)
    }
  })

  it('should verify export engine MIME type detection and cancellation support', () => {
    const mime = AudioToVideoExportEngine.getSupportedMimeType()
    assert.ok(mime.startsWith('video/webm'), 'Must resolve to a standard WebM format')

    const exporter = new AudioToVideoExportEngine()
    assert.strictEqual(exporter.isBusy(), false)
    assert.doesNotThrow(() => exporter.cancel())
  })

  it('should calculate camera trajectories across all 10 presets and easings', () => {
    const engine = new PhotoMotionStudioEngine()
    assert.ok(engine, 'PhotoMotionStudioEngine must instantiate successfully')

    const presets: CameraMotionPreset[] = [
      'slow-push-in',
      'slow-pull-back',
      'pan-left',
      'pan-right',
      'pan-up',
      'pan-down',
      'diagonal-drift',
      'ken-burns',
      'gentle-float',
      'orbit-perspective',
      'custom',
    ]

    const easings: CameraEasing[] = ['linear', 'ease-in-out', 'smooth-sine', 'pendulum-loop']

    const mockBands = { bass: 0.8, mid: 0.5, treble: 0.4, subBass: 0.9, overall: 0.65, isBeatHit: true }

    for (const preset of presets) {
      for (const easing of easings) {
        const camConfig = {
          ...DEFAULT_PHOTO_MOTION_CONFIG.camera,
          preset,
          easing,
        }

        // Test at t=0, t=0.5, and t=1.0
        for (const t of [0, 0.5, 1.0]) {
          const state = engine.calculateCameraState(camConfig, t, mockBands, {
            enabled: true,
            sensitivity: 1.2,
            modulateLight: true,
            modulateFog: true,
            modulateParticles: true,
            modulateCameraPunch: true,
          })

          assert.ok(state.zoom >= 1.0, `Preset ${preset} zoom must be >= 1.0`)
          assert.ok(typeof state.panX === 'number' && !isNaN(state.panX), `Preset ${preset} panX must be a valid number`)
          assert.ok(typeof state.panY === 'number' && !isNaN(state.panY), `Preset ${preset} panY must be a valid number`)
          assert.ok(typeof state.perspectiveX === 'number', `Preset ${preset} perspectiveX must be a number`)
          assert.ok(typeof state.perspectiveY === 'number', `Preset ${preset} perspectiveY must be a number`)
        }
      }
    }
  })

  it('should verify all 8 Cinematic Color Grading presets and defaults', () => {
    assert.strictEqual(CINEMATIC_COLOR_PRESETS.length, 9, 'Should include none + 8 color grade presets')

    const expectedIds = [
      'none',
      'romantic-rain',
      'dreamy-night',
      'golden-hour',
      'moonlight',
      'dark-cinema',
      'soft-morning',
      'blue-hour',
      'vintage-film',
    ]

    const actualIds = CINEMATIC_COLOR_PRESETS.map((p) => p.id)
    assert.deepStrictEqual(actualIds, expectedIds)

    for (const preset of CINEMATIC_COLOR_PRESETS) {
      assert.ok(preset.name.length > 0, `Preset ${preset.id} must have a name`)
      assert.ok(preset.accentColor.startsWith('#'), `Preset ${preset.id} accent color must be hex`)
      assert.ok(typeof preset.settings.vignette === 'number', `Preset ${preset.id} must define vignette`)
    }
  })

  it('should execute 2.5D Photo Motion render pipeline on Canvas context without throwing errors', () => {
    const originalImage = (globalThis as any).Image
    ;(globalThis as any).Image = class MockImage {
      complete = true
      naturalWidth = 1920
      naturalHeight = 1080
      src = ''
    }

    const gradMock = { addColorStop: () => {} }
    const mockCtx = {
      canvas: { width: 1920, height: 1080 },
      save: () => {},
      restore: () => {},
      clearRect: () => {},
      fillRect: () => {},
      beginPath: () => {},
      closePath: () => {},
      arc: () => {},
      moveTo: () => {},
      lineTo: () => {},
      quadraticCurveTo: () => {},
      stroke: () => {},
      fill: () => {},
      translate: () => {},
      scale: () => {},
      transform: () => {},
      drawImage: () => {},
      createLinearGradient: () => gradMock,
      createRadialGradient: () => gradMock,
      getImageData: () => ({ data: new Uint8ClampedArray(100) }),
      putImageData: () => {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      globalAlpha: 1,
      globalCompositeOperation: 'source-over',
      shadowBlur: 0,
      shadowColor: '',
    } as any

    const mockBands = { bass: 0.6, mid: 0.5, treble: 0.4, subBass: 0.7, overall: 0.55, isBeatHit: false }

    const particleTypes: AtmosphericParticleType[] = ['dust', 'snow', 'fireflies', 'stars', 'bokeh']

    try {
      for (const pType of particleTypes) {
        const config = {
          ...DEFAULT_PHOTO_MOTION_CONFIG,
          enabled: true,
          sourceImageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          atmosphere: {
            ...DEFAULT_PHOTO_MOTION_CONFIG.atmosphere,
            particleType: pType,
            rainEnabled: true,
            windowDropletsOverlay: true,
            fogEnabled: true,
            lightRaysEnabled: true,
            filmGrainIntensity: 15,
          },
        }

        assert.doesNotThrow(() => {
          studioPhotoMotionEngine.render(mockCtx, 1920, 1080, config, mockBands, 2.5, 30.0)
        }, `Photo motion rendering with particle type ${pType} must not throw`)
      }
    } finally {
      ;(globalThis as any).Image = originalImage
    }
  })

  it('should verify 2.5D depth modes and overscan safeguards', () => {
    const depthConfig = DEFAULT_PHOTO_MOTION_CONFIG.depth

    // Single-Image 2.5D mode
    assert.strictEqual(depthConfig.mode, 'single-2.5d')
    assert.ok(depthConfig.bgOverscanScale >= 1.05 && depthConfig.bgOverscanScale <= 1.3, 'Overscan scale must be safe (1.05-1.30)')
    assert.ok(depthConfig.parallaxRatio >= 0.5 && depthConfig.parallaxRatio <= 2.5, 'Parallax ratio must be within range')
  })
})
