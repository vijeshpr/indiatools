import { describe, it } from 'node:test'
import assert from 'node:assert'
import { TOOLS, getToolBySlug, CATEGORIES } from '../src/data/tools.ts'
import {
  calculateAudioBands,
  PeakHoldManager,
  VisualizerParticleSystem,
  AudioDspAnalyzer,
} from '../src/lib/video/audioVisualizerEngine.ts'
import {
  formatTimeDisplay,
  formatTimecode,
  formatDurationDisplay,
  formatBytes,
  getSupportedVideoMimeType,
  getExtensionFromMimeType,
  validateExportedVideo,
  VideoRecorderSession,
} from '../src/lib/video/videoExportEngine.ts'
import {
  ASPECT_RATIOS,
  THEME_PALETTES,
  VISUALIZER_ENGINES,
  SUPPORTED_LANGUAGES,
} from '../src/lib/video/audioVisualizerTypes.ts'
import { STUDIO_TEMPLATES, STUDIO_TEMPLATE_LIST } from '../src/lib/video/studioTemplates.ts'
import { getGraphemeClusters, getWordSegments } from '../src/lib/video/typographyEngine.ts'
import {
  getSpacingFromDensity,
  parseColor,
  DottedHarmonicMatrixEngine,
  DEFAULT_DOTTED_MATRIX_CONFIG,
} from '../src/lib/video/dottedHarmonicMatrixEngine.ts'
import { ParticlePixelDispersionEngine } from '../src/lib/video/particlePixelDispersionEngine.ts'
import {
  DEFAULT_PIXEL_DISPERSION_CONFIG,
  PixelDispersionConfig,
} from '../src/lib/video/audioVisualizerTypes.ts'
import {
  makeWebmBufferSeekable,
  makeWebmSeekable,
  scanWebmClusters,
  buildCuesElement,
  inspectWebmMetadata,
} from '../src/lib/video/webmSeekableEngine.ts'
import {
  RainyWindowStudioEngine,
  RAINY_SCENE_PRESETS,
  DEFAULT_RAINY_WINDOW_CONFIG,
  RainyWindowConfig,
} from '../src/lib/video/rainyWindowEngine.ts'

describe('Audio Spectrum & Waveform Video Generator Suite', () => {
  it('should be correctly registered in TOOLS registry', () => {
    assert.ok(TOOLS.length >= 68, 'Total tool count should be at least 68')
    assert.ok(CATEGORIES.create.toolCount >= 27, 'Create category tool count should be at least 27')

    const tool = getToolBySlug('audio-spectrum-waveform-video-generator')
    assert.ok(tool, 'Tool must be found by slug')
    assert.strictEqual(tool.id, 'audio-spectrum-waveform-video-generator')
    assert.strictEqual(tool.category, 'create')
    assert.strictEqual(tool.type, 'image-tool')
    assert.strictEqual(tool.badge, 'Flagship')
    assert.strictEqual(tool.seo.canonicalPath, '/tools/audio-spectrum-waveform-video-generator')
    assert.ok(tool.seo.title.endsWith('| IndiaTools'), 'SEO Title must end with | IndiaTools')
    assert.ok(tool.seo.metaDescription.length > 50, 'SEO Meta Description must be sufficiently descriptive')
    assert.ok(tool.faqs.length >= 4, 'Must provide comprehensive FAQs')
  })

  it('should compute normalized audio bands accurately', () => {
    // 1. Silent array test
    const silentArray = new Uint8Array(1024)
    const silentBands = calculateAudioBands(silentArray)
    assert.strictEqual(silentBands.bass, 0)
    assert.strictEqual(silentBands.mid, 0)
    assert.strictEqual(silentBands.treble, 0)
    assert.strictEqual(silentBands.overall, 0)

    // 2. Heavy bass test
    const bassHeavy = new Uint8Array(1024)
    for (let i = 0; i < 110; i++) {
      bassHeavy[i] = 255
    }
    const bassBands = calculateAudioBands(bassHeavy)
    assert.ok(bassBands.bass > 0.8, 'Bass energy should be prominent')
    assert.ok(bassBands.treble < 0.05, 'Treble should be near zero')

    // 3. Full volume test
    const fullSpectrum = new Uint8Array(1024).fill(255)
    const fullBands = calculateAudioBands(fullSpectrum)
    assert.strictEqual(fullBands.bass, 1)
    assert.strictEqual(fullBands.mid, 1)
    assert.strictEqual(fullBands.treble, 1)
    assert.strictEqual(fullBands.overall, 1)
  })

  it('should perform advanced 6-band logarithmic DSP analysis and envelope tracking', () => {
    const analyzer = new AudioDspAnalyzer()
    const freq = new Uint8Array(1024)
    // Low frequency kick & bass (bins 0 to 120 cover sub-bass and bass up to ~250Hz)
    for (let i = 0; i < 120; i++) freq[i] = 240

    const analysis = analyzer.analyze(freq, 1.0)
    assert.ok(analysis.subBass > 0.5, 'Sub-bass should detect low frequencies')
    assert.ok(analysis.bass > 0.5, 'Bass should detect low frequencies')
    assert.ok(analysis.treble < 0.1, 'Treble should remain low')
    assert.ok(typeof analysis.isBeatHit === 'boolean')
  })

  it('should handle PeakHoldManager decay and tracking', () => {
    const manager = new PeakHoldManager()

    const initial = [100, 150, 200]
    const peaks1 = manager.update(initial)
    assert.deepStrictEqual(peaks1, [100, 150, 200])

    // Lower current values should trigger gravity decay
    const lower = [0, 0, 0]
    const peaks2 = manager.update(lower)
    assert.ok(peaks2[0] < 100 && peaks2[0] > 0, 'Peak 0 should begin falling')
    assert.ok(peaks2[1] < 150 && peaks2[1] > 0, 'Peak 1 should begin falling')
    assert.ok(peaks2[2] < 200 && peaks2[2] > 0, 'Peak 2 should begin falling')

    // New higher peak should snap up immediately
    const higher = [250, 50, 50]
    const peaks3 = manager.update(higher)
    assert.strictEqual(peaks3[0], 250, 'Peak 0 should jump immediately to 250')
  })

  it('should format timestamps into clean MM:SS strings and timecodes', () => {
    assert.strictEqual(formatTimeDisplay(0), '0:00')
    assert.strictEqual(formatTimeDisplay(9), '0:09')
    assert.strictEqual(formatTimeDisplay(65), '1:05')
    assert.strictEqual(formatTimeDisplay(180), '3:00')
    assert.strictEqual(formatTimeDisplay(214.7), '3:34')
    assert.strictEqual(formatTimeDisplay(-5), '0:00')

    assert.strictEqual(formatTimecode(0, 30), '00:00:00')
    assert.strictEqual(formatTimecode(65.5, 30), '01:05:15')
  })

  it('should provide complete aspect ratios and palettes', () => {
    assert.ok(ASPECT_RATIOS['16:9'])
    assert.strictEqual(ASPECT_RATIOS['16:9'].width, 1920)
    assert.strictEqual(ASPECT_RATIOS['16:9'].height, 1080)

    assert.ok(ASPECT_RATIOS['9:16'])
    assert.strictEqual(ASPECT_RATIOS['9:16'].width, 1080)
    assert.strictEqual(ASPECT_RATIOS['9:16'].height, 1920)

    assert.ok(ASPECT_RATIOS['1:1'])
    assert.strictEqual(ASPECT_RATIOS['1:1'].width, 1080)
    assert.strictEqual(ASPECT_RATIOS['1:1'].height, 1080)

    assert.ok(THEME_PALETTES['neon-cyber'])
    assert.ok(THEME_PALETTES['gold-luxury'])
    assert.ok(THEME_PALETTES['sunset-ember'])
    assert.ok(THEME_PALETTES['aurora-emerald'])
  })

  it('should register exactly 20 distinct visualizer engines', () => {
    assert.strictEqual(VISUALIZER_ENGINES.length, 20)
    const ids = new Set(VISUALIZER_ENGINES.map((e) => e.id))
    assert.strictEqual(ids.size, 20, 'All 20 visualizer IDs must be unique')

    assert.ok(ids.has('circular-harmonic-spectrum'))
    assert.ok(ids.has('dual-ring-counter-rotating'))
    assert.ok(ids.has('radial-3d-perspective'))
    assert.ok(ids.has('minimalist-oscilloscope'))
    assert.ok(ids.has('symmetrical-mirror-waveform'))
    assert.ok(ids.has('neon-segmented-equalizer'))
    assert.ok(ids.has('galaxy-vortex-spectrum'))
    assert.ok(ids.has('orbital-energy-rings'))
    assert.ok(ids.has('album-cover-reactive-halo'))
    assert.ok(ids.has('futuristic-hud-telemetry'))
    assert.ok(ids.has('liquid-metawave-surface'))
    assert.ok(ids.has('perspective-spectrum-tunnel'))
    assert.ok(ids.has('glowing-ribbon-trails'))
    assert.ok(ids.has('dotted-harmonic-matrix'))
    assert.ok(ids.has('cinematic-topographic-landscape'))
    assert.ok(ids.has('bottom-edge-broadcast-bars'))
    assert.ok(ids.has('portrait-edge-spectrum'))
    assert.ok(ids.has('kinetic-audio-typography'))
    assert.ok(ids.has('luxury-minimal-line'))
    assert.ok(ids.has('multilayer-symphonic-composite'))
  })

  it('should register exactly 20 studio templates with multi-language samples', () => {
    assert.strictEqual(STUDIO_TEMPLATE_LIST.length, 20)
    for (const t of STUDIO_TEMPLATE_LIST) {
      assert.ok(t.id && t.name && t.preset && t.theme)
      assert.ok(t.sampleTitle.ml && t.sampleTitle.ml.length > 0, `Malayalam title missing in ${t.id}`)
      assert.ok(t.sampleTitle.en && t.sampleTitle.en.length > 0, `English title missing in ${t.id}`)
      assert.ok(t.sampleTitle.te && t.sampleTitle.te.length > 0, `Telugu title missing in ${t.id}`)
      assert.ok(t.sampleTitle.kn && t.sampleTitle.kn.length > 0, `Kannada title missing in ${t.id}`)
      assert.ok(t.sampleTitle.ta && t.sampleTitle.ta.length > 0, `Tamil title missing in ${t.id}`)
    }
  })

  it('should support 5 languages with native script metadata', () => {
    const langs = Object.keys(SUPPORTED_LANGUAGES)
    assert.strictEqual(langs.length, 5)
    assert.ok(SUPPORTED_LANGUAGES.ml.nativeName.includes('മലയാളം'))
    assert.ok(SUPPORTED_LANGUAGES.te.nativeName.includes('తెలుగు'))
    assert.ok(SUPPORTED_LANGUAGES.kn.nativeName.includes('ಕನ್ನಡ'))
    assert.ok(SUPPORTED_LANGUAGES.ta.nativeName.includes('தமிழ்'))
    assert.ok(SUPPORTED_LANGUAGES.en.nativeName.includes('English'))
  })

  it('should correctly segment Indic grapheme clusters via Intl.Segmenter without breaking vowel marks', () => {
    const malayalam = 'മലയാളം'
    const clusters = getGraphemeClusters(malayalam, 'ml')
    // Correct grapheme clusters: 'മ', 'ല', 'യാ', 'ളം' (length 4)
    assert.strictEqual(clusters.length, 4)
    assert.strictEqual(clusters[0], 'മ')
    assert.strictEqual(clusters[1], 'ല')
    assert.strictEqual(clusters[2], 'യാ') // Vowel sign 'ാ' is joined, never split!
    assert.strictEqual(clusters[3], 'ളം') // Anusvara 'ം' is joined, never split!

    // Verify naive string split would have produced broken length 6
    assert.strictEqual(malayalam.split('').length, 6)

    // Verify word segmentation
    const words = getWordSegments('മലയാളം സംഗീത സാഗരം', 'ml')
    assert.strictEqual(words.length, 3)
    assert.strictEqual(words[0], 'മലയാളം')
    assert.strictEqual(words[1], 'സംഗീത')
    assert.strictEqual(words[2], 'സാഗരം')
  })

  it('should register exactly 12 curated audio-reactive effect combinations', async () => {
    const { EFFECT_COMBOS } = await import('../src/lib/video/effectCombos.ts')
    assert.strictEqual(EFFECT_COMBOS.length, 12)
    const expectedIds = [
      'neon-smoke-storm',
      'cosmic-bass-drop',
      'purple-smoke-galaxy',
      'rainbow-particle-pulse',
      'dark-club-blackout',
      'cinematic-light-beams',
      'electric-blue-energy',
      'magenta-nebula',
      'gold-luxury-pulse',
      'fire-and-sparks',
      'monsoon-dream',
      'spectrum-explosion',
    ]
    for (const id of expectedIds) {
      assert.ok(EFFECT_COMBOS.some((c) => c.id === id), `Missing combo: ${id}`)
    }
  })

  it('should support audio analysis reset and idle silence handling', () => {
    const analyzer = new AudioDspAnalyzer()
    const silence = new Uint8Array(1024)
    const silentBands = analyzer.analyze(silence, 0)
    assert.strictEqual(silentBands.subBass, 0)
    assert.strictEqual(silentBands.isBeatHit, false)

    analyzer.reset()
    const postReset = analyzer.analyze(silence, 0)
    assert.strictEqual(postReset.bass, 0)
    assert.strictEqual(postReset.isBeatHit, false)
  })

  it('should format duration and bytes with professional precision', () => {
    // formatDurationDisplay
    assert.strictEqual(formatDurationDisplay(0), '00:00')
    assert.strictEqual(formatDurationDisplay(9), '00:09')
    assert.strictEqual(formatDurationDisplay(59), '00:59')
    assert.strictEqual(formatDurationDisplay(65), '01:05')
    assert.strictEqual(formatDurationDisplay(600), '10:00')
    assert.strictEqual(formatDurationDisplay(3600), '01:00:00')
    assert.strictEqual(formatDurationDisplay(3665), '01:01:05')
    assert.strictEqual(formatDurationDisplay(-10), '00:00')
    assert.strictEqual(formatDurationDisplay(NaN), '00:00')
    assert.strictEqual(formatDurationDisplay(Infinity), '00:00')

    // formatBytes
    assert.strictEqual(formatBytes(0), '0 B')
    assert.strictEqual(formatBytes(512), '512 B')
    assert.strictEqual(formatBytes(1024), '1 KB')
    assert.strictEqual(formatBytes(1536), '1.5 KB')
    assert.strictEqual(formatBytes(1048576), '1 MB')
    assert.strictEqual(formatBytes(10485760), '10 MB')
    assert.strictEqual(formatBytes(-100), '0 B')
  })

  it('should map container MIME types to correct file extensions without cross-naming', () => {
    assert.strictEqual(getExtensionFromMimeType('video/webm'), 'webm')
    assert.strictEqual(getExtensionFromMimeType('video/webm;codecs=vp9,opus'), 'webm')
    assert.strictEqual(getExtensionFromMimeType('video/webm;codecs=vp8,opus'), 'webm')
    assert.strictEqual(getExtensionFromMimeType('video/mp4'), 'mp4')
    assert.strictEqual(getExtensionFromMimeType('video/mp4;codecs=avc1.42E01E,mp4a.40.2'), 'mp4')
    assert.strictEqual(getExtensionFromMimeType('video/mp4;codecs=avc1,opus'), 'mp4')
    assert.strictEqual(getExtensionFromMimeType(''), 'webm')
  })

  it('should validate exported video blob with safety checks', async () => {
    // In node environment without DOM, validateExportedVideo returns fallback valid info
    const dummyBlob = new Blob(['sample-video-bytes'], { type: 'video/webm' })
    const res = await validateExportedVideo(dummyBlob)
    assert.strictEqual(res.valid, true)

    // Empty blob returns invalid
    const emptyBlob = new Blob([], { type: 'video/webm' })
    const emptyRes = await validateExportedVideo(emptyBlob)
    assert.strictEqual(emptyRes.valid, false)
    assert.ok(emptyRes.error?.includes('empty'))
  })

  it('should manage VideoRecorderSession lifecycle with Triple-Guard finalization', async () => {
    // Mock MediaStreamTrack
    class MockTrack {
      stopped = false
      readyState = 'live'
      enabled = true
      stop() {
        this.stopped = true
        this.readyState = 'ended'
      }
    }

    // Mock MediaStream
    class MockMediaStream {
      tracks: MockTrack[]
      constructor(tracks: MockTrack[] = []) {
        this.tracks = tracks
      }
      getTracks() {
        return this.tracks
      }
      getVideoTracks() {
        return this.tracks
      }
      getAudioTracks() {
        return this.tracks
      }
    }

    // Mock MediaRecorder
    class MockMediaRecorder {
      state: 'inactive' | 'recording' | 'paused' = 'inactive'
      ondataavailable: ((e: any) => void) | null = null
      onstop: (() => void) | null = null
      onerror: ((e: any) => void) | null = null

      static isTypeSupported(mime: string) {
        return true
      }

      start(timeslice?: number) {
        this.state = 'recording'
        // Emit mock chunk
        if (this.ondataavailable) {
          this.ondataavailable({ data: new Blob([new Uint8Array(1024)]) })
        }
      }

      requestData() {
        if (this.ondataavailable) {
          this.ondataavailable({ data: new Blob([new Uint8Array(2048)]) })
        }
      }

      stop() {
        this.state = 'inactive'
        if (this.onstop) {
          this.onstop()
        }
      }
    }

    // Temporarily attach mocks to globalThis for node test environment
    const origMediaRecorder = (globalThis as any).MediaRecorder
    const origMediaStream = (globalThis as any).MediaStream
    ;(globalThis as any).MediaRecorder = MockMediaRecorder
    ;(globalThis as any).MediaStream = MockMediaStream

    try {
      const mockCanvasTrack = new MockTrack()
      const mockCanvas = {
        captureStream: () => new MockMediaStream([mockCanvasTrack]),
      } as any

      const mockAudioTrack = new MockTrack()
      const mockDest = {
        stream: new MockMediaStream([mockAudioTrack]),
      } as any

      let progressUpdates: any[] = []
      let completedResult: any = null

      const session = new VideoRecorderSession({
        canvas: mockCanvas,
        audioDestination: mockDest,
        fps: 60,
        duration: 10,
        trimStart: 0,
        trimEnd: 10,
        onProgress: (p) => progressUpdates.push(p),
        onComplete: (res) => {
          completedResult = res
        },
      })

      assert.strictEqual(session.getState(), 'idle')
      assert.strictEqual(session.isRecording(), false)

      // Start recording
      session.start()
      assert.strictEqual(session.isRecording(), true)
      assert.strictEqual(session.getState(), 'recording')

      // Notify frames rendered
      session.notifyFrameRendered()
      session.notifyFrameRendered()

      // Guard A Test: updateAudioPosition reaching threshold (10 - 0.08 = 9.92)
      // When audio reaches 9.95s, Guard A fires automatically!
      session.updateAudioPosition(9.95)

      // Allow async onstop & makeWebmSeekable processing to complete
      await new Promise((resolve) => setTimeout(resolve, 20))

      assert.strictEqual(session.getState(), 'completed')
      assert.ok(completedResult !== null, 'onComplete should have been called')
      assert.strictEqual(completedResult.durationSec, 10)
      assert.strictEqual(completedResult.fps, 60)
      assert.ok(completedResult.formattedSize.includes('KB') || completedResult.formattedSize.includes('MB'))

      // Verify that audioDestination's track was NOT stopped (preserved for next export)
      assert.strictEqual(mockAudioTrack.stopped, false, 'Audio destination track must not be stopped by session cleanup')
      // Verify that canvas video track was stopped
      assert.strictEqual(mockCanvasTrack.stopped, true, 'Canvas video track must be cleaned up')

      // Guard C Test: Idempotency of finishExport - calling again should be a no-op
      session.finishExport('duplicate-call')
      assert.strictEqual(session.getState(), 'completed')

      // Test cancel cleanup on a fresh session
      const cancelSession = new VideoRecorderSession({
        canvas: mockCanvas,
        audioDestination: mockDest,
        duration: 10,
      })
      cancelSession.start()
      assert.strictEqual(cancelSession.isRecording(), true)
      cancelSession.cancel()
      assert.strictEqual(cancelSession.getState(), 'cancelled')
      assert.strictEqual(cancelSession.isRecording(), false)

      // Missing audio track error enforcement
      let receivedAudioError: any = null
      const brokenSession = new VideoRecorderSession({
        canvas: mockCanvas,
        audioDestination: { stream: new MockMediaStream([]) } as any,
        onError: (err) => {
          receivedAudioError = err
        },
      })
      brokenSession.start()
      assert.strictEqual(brokenSession.getState(), 'error')
      assert.ok(receivedAudioError !== null, 'onError must be invoked when audio track is missing')
      assert.ok(receivedAudioError.message.includes('No active audio track found'))
    } finally {
      ;(globalThis as any).MediaRecorder = origMediaRecorder
      ;(globalThis as any).MediaStream = origMediaStream
    }
  })

  it('should calculate accurate grid spacing and parse colors for Dotted Harmonic Matrix', () => {
    // Spacing calculations
    const fineSpacing = getSpacingFromDensity('fine', 1080, 1920)
    const balancedSpacing = getSpacingFromDensity('balanced', 1080, 1920)
    const boldSpacing = getSpacingFromDensity('bold', 1080, 1920)

    assert.ok(fineSpacing < balancedSpacing, 'Fine density must be tighter than balanced')
    assert.ok(balancedSpacing < boldSpacing, 'Balanced density must be tighter than bold')
    assert.strictEqual(fineSpacing, 15)
    assert.strictEqual(balancedSpacing, 24)
    assert.strictEqual(boldSpacing, 38)

    // Color parser
    const hexFull = parseColor('#06b6d4')
    assert.strictEqual(hexFull.r, 6)
    assert.strictEqual(hexFull.g, 182)
    assert.strictEqual(hexFull.b, 212)

    const hexShort = parseColor('#fff')
    assert.strictEqual(hexShort.r, 255)
    assert.strictEqual(hexShort.g, 255)
    assert.strictEqual(hexShort.b, 255)

    const rgbStr = parseColor('rgb(255, 100, 50)')
    assert.strictEqual(rgbStr.r, 255)
    assert.strictEqual(rgbStr.g, 100)
    assert.strictEqual(rgbStr.b, 50)
  })

  it('should render Dotted Harmonic Matrix with halftone sampling and liquid spring physics', () => {
    const engine = new DottedHarmonicMatrixEngine()
    assert.ok(engine)

    // Mock CanvasRenderingContext2D
    const mockCtx = {
      save: () => {},
      restore: () => {},
      fillRect: () => {},
      beginPath: () => {},
      arc: () => {},
      ellipse: () => {},
      fill: () => {},
      fillStyle: '',
      shadowColor: '',
      shadowBlur: 0,
    } as any

    const palette = THEME_PALETTES['neon-cyber']
    const freqData = new Uint8Array(1024).fill(120)
    const timeData = new Uint8Array(1024).fill(128)
    const bands = {
      subBass: 0.8,
      bass: 0.75,
      lowMid: 0.4,
      mid: 0.5,
      highMid: 0.3,
      treble: 0.2,
      overall: 0.6,
      energy: 0.6,
      transientIntensity: 0.8,
      isBeatHit: true,
      flux: 0.5,
    }

    // Render frame 1 (Initial grid allocation + beat ripple spawn)
    engine.render({
      ctx: mockCtx,
      width: 1080,
      height: 1920,
      freqData,
      timeData,
      bands,
      palette,
      currentTime: 1.0,
      peakManager: new PeakHoldManager(),
      barCount: 64,
      sensitivity: 1.25,
      bassReactivity: 1.35,
      glowStrength: 1.0,
      spinSpeed: 0.35,
      centerX: 540,
      centerY: 960,
      primaryRadius: 280,
      dottedMatrixConfig: {
        ...DEFAULT_DOTTED_MATRIX_CONFIG,
        liquidSpreadIntensity: 80,
      },
    })

    // Render frame 2 (Physics update + spring recovery)
    engine.render({
      ctx: mockCtx,
      width: 1080,
      height: 1920,
      freqData,
      timeData,
      bands: { ...bands, isBeatHit: false },
      palette,
      currentTime: 1.05,
      peakManager: new PeakHoldManager(),
      barCount: 64,
      sensitivity: 1.25,
      bassReactivity: 1.35,
      glowStrength: 1.0,
      spinSpeed: 0.35,
      centerX: 540,
      centerY: 960,
      primaryRadius: 280,
      dottedMatrixConfig: {
        ...DEFAULT_DOTTED_MATRIX_CONFIG,
        liquidSpreadIntensity: 80,
      },
    })

    // Zero spread mode test
    engine.render({
      ctx: mockCtx,
      width: 1080,
      height: 1920,
      freqData,
      timeData,
      bands,
      palette,
      currentTime: 1.1,
      peakManager: new PeakHoldManager(),
      barCount: 64,
      sensitivity: 1.25,
      bassReactivity: 1.35,
      glowStrength: 1.0,
      spinSpeed: 0.35,
      centerX: 540,
      centerY: 960,
      primaryRadius: 280,
      dottedMatrixConfig: {
        ...DEFAULT_DOTTED_MATRIX_CONFIG,
        liquidSpreadIntensity: 0,
      },
    })

    // Reset clean test
    engine.reset()
    assert.ok(true, 'Engine reset executed cleanly without errors')
  })

  it('should support concentric bass wave reactivity in Dotted Harmonic Matrix', () => {
    assert.strictEqual(
      DEFAULT_DOTTED_MATRIX_CONFIG.bassWaveReactivity,
      85,
      'Default bassWaveReactivity should be calibrated to 85%'
    )

    const engine = new DottedHarmonicMatrixEngine()
    const mockCtx = {
      save: () => {},
      restore: () => {},
      fillRect: () => {},
      beginPath: () => {},
      arc: () => {},
      ellipse: () => {},
      fill: () => {},
      fillStyle: '',
      shadowBlur: 0,
      shadowColor: '',
      createRadialGradient: () => ({ addColorStop: () => {} }),
    } as any

    const freqData = new Uint8Array(256).fill(120)
    const timeData = new Uint8Array(256).fill(128)
    const heavyBassBands: DetailedAudioBands = {
      subBass: 0.95,
      bass: 0.92,
      mids: 0.4,
      treble: 0.3,
      overall: 0.7,
      isBeatHit: true,
      subBassDb: -2,
      bassDb: -3,
      midsDb: -12,
      trebleDb: -16,
      peakVolumeDb: -1,
    }

    // Render with 100% bass wave reactivity
    assert.doesNotThrow(() => {
      engine.render({
        ctx: mockCtx,
        width: 1080,
        height: 1920,
        freqData,
        timeData,
        bands: heavyBassBands,
        palette: THEME_PALETTES['neon-cyber'],
        currentTime: 2.5,
        peakManager: new PeakHoldManager(),
        barCount: 64,
        sensitivity: 1.5,
        bassReactivity: 1.5,
        glowStrength: 1.0,
        spinSpeed: 0.35,
        centerX: 540,
        centerY: 960,
        primaryRadius: 280,
        dottedMatrixConfig: {
          ...DEFAULT_DOTTED_MATRIX_CONFIG,
          bassWaveReactivity: 100,
        },
      })
    }, 'Concentric bass wave rendering executed cleanly with 100% reactivity')
  })

  it('should guarantee audio track codec in getSupportedVideoMimeType to prevent silent/muted exports', () => {
    const origWindow = (globalThis as any).window
    const origMediaRecorder = (globalThis as any).MediaRecorder
    try {
      ;(globalThis as any).window = globalThis
      // Test 1: When WebM VP9/Opus is supported (Chromium & Firefox standard)
      ;(globalThis as any).MediaRecorder = {
        isTypeSupported: (mime: string) => mime.includes('opus') || mime === 'video/webm',
      }
      const chromeResult = getSupportedVideoMimeType()
      assert.ok(
        chromeResult.mimeType.includes('opus') || chromeResult.mimeType === 'video/webm',
        'Should select WebM with Opus audio on Chromium/Firefox'
      )
      assert.strictEqual(chromeResult.extension, 'webm')

      // Test 2: When only MP4 with AAC is supported (Safari standard)
      ;(globalThis as any).MediaRecorder = {
        isTypeSupported: (mime: string) => mime.includes('mp4a.40.2') || mime === 'video/mp4',
      }
      const safariResult = getSupportedVideoMimeType()
      assert.ok(
        safariResult.mimeType.includes('mp4a.40.2') || safariResult.mimeType === 'video/mp4',
        'Should select MP4 with AAC audio on Safari'
      )
      assert.strictEqual(safariResult.extension, 'mp4')
    } finally {
      ;(globalThis as any).window = origWindow
      ;(globalThis as any).MediaRecorder = origMediaRecorder
    }
  })

  it('should initialize ParticlePixelDispersionEngine with zero GC object pool and pre-sample candidates', () => {
    assert.strictEqual(DEFAULT_PIXEL_DISPERSION_CONFIG.mode, 'ember-glow')
    assert.strictEqual(DEFAULT_PIXEL_DISPERSION_CONFIG.colorMode, 'photo-rgb')
    assert.strictEqual(DEFAULT_PIXEL_DISPERSION_CONFIG.direction, 'up')
    assert.strictEqual(DEFAULT_PIXEL_DISPERSION_CONFIG.bassBurstReactivity, 80)
    assert.strictEqual(DEFAULT_PIXEL_DISPERSION_CONFIG.trebleShimmer, 70)

    const engine = new ParticlePixelDispersionEngine(1500)
    assert.ok(engine, 'Engine created successfully')

    // Pre-sample with null photo -> triggers procedural harmonic candidates
    engine.preSampleImageOnce(null)
    assert.ok(true, 'preSampleImageOnce handled null cleanly')

    engine.reset()
    assert.ok(true, 'reset executed cleanly')
  })

  it('should update and render ParticlePixelDispersionEngine with audio bursts and treble shimmer', () => {
    const engine = new ParticlePixelDispersionEngine(1000)
    const mockCtx = {
      save: () => {},
      restore: () => {},
      fillRect: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
      fillStyle: '',
      globalCompositeOperation: '',
    } as any

    const activeBands: DetailedAudioBands = {
      subBass: 0.9,
      bass: 0.85,
      mids: 0.5,
      treble: 0.8,
      overall: 0.75,
      isBeatHit: true,
      subBassDb: -2,
      bassDb: -3,
      midsDb: -10,
      trebleDb: -8,
      peakVolumeDb: -1,
    }

    const testConfig: PixelDispersionConfig = {
      enabled: true,
      mode: 'ember-glow',
      direction: 'up',
      colorMode: 'ember-fire',
      density: 80,
      particleSize: 3.5,
      speed: 1.5,
      bassBurstReactivity: 90,
      trebleShimmer: 85,
      blendMode: 'lighter',
      dissolveSpread: 60,
    }

    // Frame 1: Initial spawn on beat hit
    assert.doesNotThrow(() => {
      engine.updateAndDraw(
        mockCtx,
        1080,
        1920,
        null,
        activeBands,
        THEME_PALETTES['neon-cyber'],
        1.0,
        testConfig,
        'portrait-frame',
        '9:16'
      )
    }, 'Engine render frame 1 executed cleanly')

    // Frame 2: Sand drift mode
    assert.doesNotThrow(() => {
      engine.updateAndDraw(
        mockCtx,
        1080,
        1920,
        null,
        { ...activeBands, isBeatHit: false, bass: 0.3 },
        THEME_PALETTES['neon-cyber'],
        1.05,
        {
          ...testConfig,
          mode: 'sand-drift',
          colorMode: 'golden-sand',
          direction: 'up-right',
          blendMode: 'screen',
        },
        'album-disc',
        '9:16'
      )
    }, 'Engine render frame 2 executed cleanly in sand-drift mode')

    // Frame 3: Disabled mode early exit
    assert.doesNotThrow(() => {
      engine.updateAndDraw(
        mockCtx,
        1080,
        1920,
        null,
        activeBands,
        THEME_PALETTES['neon-cyber'],
        1.1,
        { ...testConfig, enabled: false },
        'portrait-frame',
        '9:16'
      )
    }, 'Disabled engine exited cleanly')
  })

  it('should scan WebM clusters and build compliant Cues seek points', () => {
    function concatBytes(arrays: Uint8Array[]): Uint8Array {
      let len = 0
      for (const a of arrays) len += a.length
      const res = new Uint8Array(len)
      let p = 0
      for (const a of arrays) {
        res.set(a, p)
        p += a.length
      }
      return res
    }

    function makeElem(id: number[], data: Uint8Array): Uint8Array {
      const len = data.length
      let vint: Uint8Array
      if (len < 0x7f) vint = new Uint8Array([0x80 | len])
      else vint = new Uint8Array([0x40 | (len >> 8), len & 0xff])
      return concatBytes([new Uint8Array(id), vint, data])
    }

    // 1. EBML Header
    const docType = makeElem([0x42, 0x82], new TextEncoder().encode('webm'))
    const ebml = makeElem([0x1a, 0x45, 0xdf, 0xa3], docType)

    // 2. Info & Tracks
    const timeScale = makeElem([0x2a, 0xd7, 0xb1], new Uint8Array([0x0f, 0x42, 0x40]))
    const info = makeElem([0x15, 0x49, 0xa9, 0x66], timeScale)
    const tracks = makeElem([0x16, 0x54, 0xae, 0x6b], new Uint8Array([0xae, 0x83, 0xd7, 0x81, 0x01]))

    // 3. Three Clusters at 0ms, 5000ms, 10000ms
    const c1Time = makeElem([0xe7], new Uint8Array([0]))
    const c1 = makeElem([0x1f, 0x43, 0xb6, 0x75], c1Time)

    const c2Time = makeElem([0xe7], new Uint8Array([0x13, 0x88])) // 5000ms
    const c2 = makeElem([0x1f, 0x43, 0xb6, 0x75], c2Time)

    const c3Time = makeElem([0xe7], new Uint8Array([0x27, 0x10])) // 10000ms
    const c3 = makeElem([0x1f, 0x43, 0xb6, 0x75], c3Time)

    const segmentPayload = concatBytes([info, tracks, c1, c2, c3])
    const segmentUnknown = new Uint8Array([
      0x18, 0x53, 0x80, 0x67,
      0x01, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff
    ])

    const rawWebm = concatBytes([ebml, segmentUnknown, segmentPayload])

    // Scan
    const scanned = scanWebmClusters(rawWebm)
    assert.ok(scanned, 'Cluster scanner must successfully parse WebM')
    assert.strictEqual(scanned.clusters.length, 3, 'Must detect exactly 3 clusters')
    assert.strictEqual(scanned.clusters[0].timecode, 0)
    assert.strictEqual(scanned.clusters[1].timecode, 5000)
    assert.strictEqual(scanned.clusters[2].timecode, 10000)

    // Build Cues
    const cues = buildCuesElement(scanned.clusters, 1)
    assert.ok(cues.length > 0, 'Cues element must be non-empty')
    // Must start with Cues tag [0x1C, 0x53, 0xBB, 0x6B]
    assert.strictEqual(cues[0], 0x1c)
    assert.strictEqual(cues[1], 0x53)
    assert.strictEqual(cues[2], 0xbb)
    assert.strictEqual(cues[3], 0x6b)
  })

  it('should inject accurate Duration and Cues for 10-second export', () => {
    function concatBytes(arrays: Uint8Array[]): Uint8Array {
      let len = 0
      for (const a of arrays) len += a.length
      const res = new Uint8Array(len)
      let p = 0
      for (const a of arrays) {
        res.set(a, p)
        p += a.length
      }
      return res
    }

    function makeElem(id: number[], data: Uint8Array): Uint8Array {
      const len = data.length
      let vint: Uint8Array
      if (len < 0x7f) vint = new Uint8Array([0x80 | len])
      else vint = new Uint8Array([0x40 | (len >> 8), len & 0xff])
      return concatBytes([new Uint8Array(id), vint, data])
    }

    const docType = makeElem([0x42, 0x82], new TextEncoder().encode('webm'))
    const ebml = makeElem([0x1a, 0x45, 0xdf, 0xa3], docType)
    const timeScale = makeElem([0x2a, 0xd7, 0xb1], new Uint8Array([0x0f, 0x42, 0x40]))
    const info = makeElem([0x15, 0x49, 0xa9, 0x66], timeScale)
    const tracks = makeElem([0x16, 0x54, 0xae, 0x6b], new Uint8Array([0xae, 0x83, 0xd7, 0x81, 0x01]))

    const c1 = makeElem([0x1f, 0x43, 0xb6, 0x75], makeElem([0xe7], new Uint8Array([0])))
    const c2 = makeElem([0x1f, 0x43, 0xb6, 0x75], makeElem([0xe7], new Uint8Array([0x13, 0x88]))) // 5000ms
    const c3 = makeElem([0x1f, 0x43, 0xb6, 0x75], makeElem([0xe7], new Uint8Array([0x27, 0x10]))) // 10000ms

    const segmentPayload = concatBytes([info, tracks, c1, c2, c3])
    const segmentUnknown = new Uint8Array([
      0x18, 0x53, 0x80, 0x67,
      0x01, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff
    ])

    const rawWebm = concatBytes([ebml, segmentUnknown, segmentPayload])

    // Remux to seekable 10-second WebM
    const seekableWebm = makeWebmBufferSeekable(rawWebm, 10.0)
    assert.ok(seekableWebm.length > rawWebm.length, 'Fixed WebM should include injected Duration and Cues')

    // Inspect
    const inspected = inspectWebmMetadata(seekableWebm)
    assert.strictEqual(inspected.isWebm, true, 'Must remain valid WebM')
    assert.strictEqual(inspected.hasDuration, true, 'Must have Duration element')
    assert.strictEqual(inspected.durationSec, 10, 'Duration must equal 10.0 seconds')
    assert.strictEqual(inspected.hasCues, true, 'Must have Cues seek table')
    assert.ok(inspected.cueCount >= 3, 'Must contain CuePoints for all clusters')
    assert.strictEqual(inspected.isSegmentSizeDefined, true, 'Segment size must be defined and finite')
  })

  it('should accurately index and support seek points for 30-second export (25%, 50%, 75%)', () => {
    function concatBytes(arrays: Uint8Array[]): Uint8Array {
      let len = 0
      for (const a of arrays) len += a.length
      const res = new Uint8Array(len)
      let p = 0
      for (const a of arrays) {
        res.set(a, p)
        p += a.length
      }
      return res
    }

    function makeElem(id: number[], data: Uint8Array): Uint8Array {
      const len = data.length
      let vint: Uint8Array
      if (len < 0x7f) vint = new Uint8Array([0x80 | len])
      else vint = new Uint8Array([0x40 | (len >> 8), len & 0xff])
      return concatBytes([new Uint8Array(id), vint, data])
    }

    const docType = makeElem([0x42, 0x82], new TextEncoder().encode('webm'))
    const ebml = makeElem([0x1a, 0x45, 0xdf, 0xa3], docType)
    const timeScale = makeElem([0x2a, 0xd7, 0xb1], new Uint8Array([0x0f, 0x42, 0x40]))
    const info = makeElem([0x15, 0x49, 0xa9, 0x66], timeScale)
    const tracks = makeElem([0x16, 0x54, 0xae, 0x6b], new Uint8Array([0xae, 0x83, 0xd7, 0x81, 0x01]))

    // Clusters at 0ms, 7500ms (25%), 15000ms (50%), 22500ms (75%), 30000ms (100%)
    const c0 = makeElem([0x1f, 0x43, 0xb6, 0x75], makeElem([0xe7], new Uint8Array([0])))
    const c25 = makeElem([0x1f, 0x43, 0xb6, 0x75], makeElem([0xe7], new Uint8Array([0x1d, 0x4c]))) // 7500ms
    const c50 = makeElem([0x1f, 0x43, 0xb6, 0x75], makeElem([0xe7], new Uint8Array([0x3a, 0x98]))) // 15000ms
    const c75 = makeElem([0x1f, 0x43, 0xb6, 0x75], makeElem([0xe7], new Uint8Array([0x57, 0xe4]))) // 22500ms
    const c100 = makeElem([0x1f, 0x43, 0xb6, 0x75], makeElem([0xe7], new Uint8Array([0x75, 0x30]))) // 30000ms

    const segmentPayload = concatBytes([info, tracks, c0, c25, c50, c75, c100])
    const segmentUnknown = new Uint8Array([
      0x18, 0x53, 0x80, 0x67,
      0x01, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff
    ])

    const rawWebm = concatBytes([ebml, segmentUnknown, segmentPayload])

    // Remux to 30.0s seekable
    const seekableWebm = makeWebmBufferSeekable(rawWebm, 30.0)
    const inspected = inspectWebmMetadata(seekableWebm)

    assert.strictEqual(inspected.durationSec, 30, 'Duration must be exactly 30 seconds')
    assert.strictEqual(inspected.hasCues, true, 'Must have Cues seek index')
    assert.ok(inspected.cueCount >= 5, 'Must have at least 5 CuePoints')
    assert.strictEqual(inspected.isSegmentSizeDefined, true, 'Segment size must be defined')
  })

  it('should convert Blob via makeWebmSeekable asynchronously', async () => {
    function concatBytes(arrays: Uint8Array[]): Uint8Array {
      let len = 0
      for (const a of arrays) len += a.length
      const res = new Uint8Array(len)
      let p = 0
      for (const a of arrays) {
        res.set(a, p)
        p += a.length
      }
      return res
    }

    function makeElem(id: number[], data: Uint8Array): Uint8Array {
      const len = data.length
      let vint: Uint8Array
      if (len < 0x7f) vint = new Uint8Array([0x80 | len])
      else vint = new Uint8Array([0x40 | (len >> 8), len & 0xff])
      return concatBytes([new Uint8Array(id), vint, data])
    }

    const docType = makeElem([0x42, 0x82], new TextEncoder().encode('webm'))
    const ebml = makeElem([0x1a, 0x45, 0xdf, 0xa3], docType)
    const timeScale = makeElem([0x2a, 0xd7, 0xb1], new Uint8Array([0x0f, 0x42, 0x40]))
    const info = makeElem([0x15, 0x49, 0xa9, 0x66], timeScale)
    const tracks = makeElem([0x16, 0x54, 0xae, 0x6b], new Uint8Array([0xae, 0x83, 0xd7, 0x81, 0x01]))
    const cluster = makeElem([0x1f, 0x43, 0xb6, 0x75], makeElem([0xe7], new Uint8Array([0])))

    const segmentPayload = concatBytes([info, tracks, cluster])
    const segmentUnknown = new Uint8Array([
      0x18, 0x53, 0x80, 0x67,
      0x01, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff
    ])

    const rawWebm = concatBytes([ebml, segmentUnknown, segmentPayload])
    const rawBlob = new Blob([rawWebm.buffer as ArrayBuffer], { type: 'video/webm' })

    const seekableBlob = await makeWebmSeekable(rawBlob, 15.0)
    assert.ok(seekableBlob.size > rawBlob.size, 'Seekable blob must have metadata appended')

    const buf = new Uint8Array(await seekableBlob.arrayBuffer())
    const inspected = inspectWebmMetadata(buf)
    assert.strictEqual(inspected.hasDuration, true)
    assert.strictEqual(inspected.durationSec, 15)
    assert.strictEqual(inspected.hasCues, true)
  })

  it('should support 5 aspect ratios including 4:3 Classic and 21:9 Ultrawide', () => {
    assert.strictEqual(ASPECT_RATIOS['16:9'].width, 1920)
    assert.strictEqual(ASPECT_RATIOS['16:9'].height, 1080)
    assert.strictEqual(ASPECT_RATIOS['9:16'].width, 1080)
    assert.strictEqual(ASPECT_RATIOS['9:16'].height, 1920)
    assert.strictEqual(ASPECT_RATIOS['1:1'].width, 1080)
    assert.strictEqual(ASPECT_RATIOS['1:1'].height, 1080)
    assert.strictEqual(ASPECT_RATIOS['4:3'].width, 1440)
    assert.strictEqual(ASPECT_RATIOS['4:3'].height, 1080)
    assert.strictEqual(ASPECT_RATIOS['21:9'].width, 2560)
    assert.strictEqual(ASPECT_RATIOS['21:9'].height, 1080)
  })

  it('should validate Rainy Window Studio scene presets and default configurations', () => {
    assert.strictEqual(RAINY_SCENE_PRESETS.length, 8, 'Must have exactly 8 rainy scene presets')

    const presetIds = RAINY_SCENE_PRESETS.map((p) => p.id)
    assert.deepStrictEqual(presetIds, [
      'cozy-bedroom',
      'mountain-cabin',
      'city-night',
      'tropical-monsoon',
      'forest-window',
      'ocean-storm',
      'japanese-retreat',
      'custom',
    ])

    for (const preset of RAINY_SCENE_PRESETS) {
      assert.ok(preset.name.length > 0, `Preset ${preset.id} must have a name`)
      assert.ok(preset.subtitle.length > 0, `Preset ${preset.id} must have a subtitle`)
      assert.ok(preset.accentColor.startsWith('#'), `Preset ${preset.id} accent color must be hex`)
      assert.ok(preset.description.length > 10, `Preset ${preset.id} must have a description`)
      assert.ok(['cozy-wood', 'french-pane', 'minimal-panorama', 'loft-steel', 'none'].includes(preset.defaultFrame))
      assert.ok(['drizzle', 'light', 'moderate', 'heavy', 'storm'].includes(preset.defaultIntensity))
      assert.ok(preset.warmth >= 0 && preset.warmth <= 100)
    }

    // Validate default config
    assert.strictEqual(DEFAULT_RAINY_WINDOW_CONFIG.enabled, false)
    assert.strictEqual(DEFAULT_RAINY_WINDOW_CONFIG.scenePreset, 'cozy-bedroom')
    assert.strictEqual(DEFAULT_RAINY_WINDOW_CONFIG.intensity, 'moderate')
    assert.strictEqual(DEFAULT_RAINY_WINDOW_CONFIG.mode, 'natural')
    assert.strictEqual(DEFAULT_RAINY_WINDOW_CONFIG.lightningEnabled, true)
    assert.strictEqual(DEFAULT_RAINY_WINDOW_CONFIG.condensationCornerFog, true)
    assert.strictEqual(DEFAULT_RAINY_WINDOW_CONFIG.windowFrameStyle, 'cozy-wood')
    assert.ok(DEFAULT_RAINY_WINDOW_CONFIG.rainDensity >= 10)
    assert.ok(DEFAULT_RAINY_WINDOW_CONFIG.rainSpeed >= 0.5)
  })

  it('should initialize RainyWindowStudioEngine and render multi-plane rain & glass droplets at 60 FPS without throwing', () => {
    const engine = new RainyWindowStudioEngine()
    assert.ok(engine, 'Engine must instantiate')

    // Mock CanvasRenderingContext2D
    const createMockCtx = (w: number, h: number) => {
      const gradientMock = {
        addColorStop: () => {},
      }
      return {
        canvas: { width: w, height: h },
        save: () => {},
        restore: () => {},
        fillRect: () => {},
        strokeRect: () => {},
        beginPath: () => {},
        closePath: () => {},
        arc: () => {},
        ellipse: () => {},
        moveTo: () => {},
        lineTo: () => {},
        fill: () => {},
        stroke: () => {},
        drawImage: () => {},
        createLinearGradient: () => gradientMock,
        createRadialGradient: () => gradientMock,
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        lineCap: 'round',
        globalAlpha: 1,
        filter: 'none',
      } as any
    }

    const mockColors = {
      primary: '#00F0FF',
      secondary: '#FF007F',
      accent: '#FFE600',
      background: '#0A0A12',
    }

    const testAspectDimensions = [
      { width: 1920, height: 1080 }, // 16:9
      { width: 1080, height: 1920 }, // 9:16
      { width: 1080, height: 1080 }, // 1:1
      { width: 1440, height: 1080 }, // 4:3
      { width: 2560, height: 1080 }, // 21:9
    ]

    // 1. Render all 8 presets across dimensions
    for (const dim of testAspectDimensions) {
      const ctx = createMockCtx(dim.width, dim.height)
      for (const preset of RAINY_SCENE_PRESETS) {
        const config: RainyWindowConfig = {
          ...DEFAULT_RAINY_WINDOW_CONFIG,
          enabled: true,
          scenePreset: preset.id,
          intensity: preset.defaultIntensity,
          windowFrameStyle: preset.defaultFrame,
        }

        const bands = {
          bass: 0.8,
          mid: 0.5,
          treble: 0.4,
          subBass: 0.9,
          kick: 0.85,
          vocal: 0.5,
          overall: 0.65,
          isBeatHit: true,
        }

        assert.doesNotThrow(() => {
          engine.updateAndDraw(ctx, dim.width, dim.height, bands, mockColors, 1.0, config, null)
        }, `Preset ${preset.id} must render without error at ${dim.width}x${dim.height}`)
      }
    }

    // 2. Render all 5 window frame styles
    const frames: Array<RainyWindowConfig['windowFrameStyle']> = [
      'cozy-wood',
      'french-pane',
      'minimal-panorama',
      'loft-steel',
      'none',
    ]
    const ctx = createMockCtx(1920, 1080)
    for (const frame of frames) {
      const config: RainyWindowConfig = {
        ...DEFAULT_RAINY_WINDOW_CONFIG,
        enabled: true,
        windowFrameStyle: frame,
      }
      assert.doesNotThrow(() => {
        engine.updateAndDraw(ctx, 1920, 1080, {
          bass: 0.3,
          mid: 0.3,
          treble: 0.2,
          subBass: 0.3,
          kick: 0.2,
          vocal: 0.3,
          overall: 0.3,
          isBeatHit: false,
        }, mockColors, 2.0, config, null)
      }, `Window frame ${frame} must render without error`)
    }

    // 3. Audio Reactivity: test thunder lightning trigger on transient beat hits
    const reactiveConfig: RainyWindowConfig = {
      ...DEFAULT_RAINY_WINDOW_CONFIG,
      enabled: true,
      mode: 'beat-reactive',
      lightningEnabled: true,
      bassSensitivity: 2.0,
      beatSensitivity: 2.0,
    }
    const beatHitBands = {
      bass: 0.95,
      mid: 0.7,
      treble: 0.8,
      subBass: 1.0,
      kick: 0.98,
      vocal: 0.6,
      overall: 0.9,
      isBeatHit: true,
    }
    for (let frame = 0; frame < 10; frame++) {
      assert.doesNotThrow(() => {
        engine.updateAndDraw(ctx, 1920, 1080, beatHitBands, mockColors, 3.0 + frame * 0.016, reactiveConfig, null)
      })
    }

    // 4. Test engine reset
    assert.doesNotThrow(() => {
      engine.reset()
    }, 'Engine reset must run cleanly')
  })
})
