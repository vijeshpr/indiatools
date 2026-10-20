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

  it('should manage VideoRecorderSession lifecycle with Triple-Guard finalization', () => {
    // Mock MediaStreamTrack
    class MockTrack {
      stopped = false
      stop() {
        this.stopped = true
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
      const mockCanvas = {
        captureStream: () => new MockMediaStream([new MockTrack()]),
      } as any

      const mockDest = {
        stream: new MockMediaStream([new MockTrack()]),
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

      assert.strictEqual(session.getState(), 'completed')
      assert.ok(completedResult !== null, 'onComplete should have been called')
      assert.strictEqual(completedResult.durationSec, 10)
      assert.strictEqual(completedResult.fps, 60)
      assert.ok(completedResult.formattedSize.includes('KB') || completedResult.formattedSize.includes('MB'))

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
    } finally {
      ;(globalThis as any).MediaRecorder = origMediaRecorder
      ;(globalThis as any).MediaStream = origMediaStream
    }
  })
})
