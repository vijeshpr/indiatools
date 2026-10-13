import { describe, it } from 'node:test'
import assert from 'node:assert'
import { TOOLS, getToolBySlug, CATEGORIES } from '../src/data/tools'
import {
  calculateAudioBands,
  PeakHoldManager,
  VisualizerParticleSystem,
} from '../src/lib/video/audioVisualizerEngine'
import {
  formatTimeDisplay,
  getSupportedVideoMimeType,
} from '../src/lib/video/videoExportEngine'
import { ASPECT_RATIOS, THEME_PALETTES } from '../src/lib/video/audioVisualizerTypes'

describe('Audio Spectrum & Waveform Video Generator Suite', () => {
  it('should be correctly registered in TOOLS registry', () => {
    assert.ok(TOOLS.length >= 53, 'Total tool count should be at least 53')
    assert.ok(CATEGORIES.create.toolCount >= 14, 'Create category tool count should be at least 14')

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

  it('should format timestamps into clean MM:SS strings', () => {
    assert.strictEqual(formatTimeDisplay(0), '0:00')
    assert.strictEqual(formatTimeDisplay(9), '0:09')
    assert.strictEqual(formatTimeDisplay(65), '1:05')
    assert.strictEqual(formatTimeDisplay(180), '3:00')
    assert.strictEqual(formatTimeDisplay(214.7), '3:34')
    assert.strictEqual(formatTimeDisplay(-5), '0:00')
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
    assert.ok(THEME_PALETTES['electric-violet'])
    assert.ok(THEME_PALETTES['sunset-ember'])
    assert.ok(THEME_PALETTES['aurora-emerald'])
    assert.ok(THEME_PALETTES['matrix-glow'])
  })
})
