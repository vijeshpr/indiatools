import { describe, it } from 'node:test'
import assert from 'node:assert'
import { TOOLS, getToolBySlug, CATEGORIES } from '../src/data/tools'
import { DEFAULT_BASS_PARAMS } from '../src/lib/audio/bassEnhancer/types'
import {
  createSubBassWaveShaperCurve,
  processSampleSaturation,
  applySoftClipLimiter,
} from '../src/lib/audio/bassEnhancer/waveshaperMath'
import { LINKWITZ_RILEY_Q } from '../src/lib/audio/bassEnhancer/subHarmonicEngine'
import { encodeMultiChannelWav } from '../src/lib/audio/encoders/multiChannelWavEncoder'
import { encodeAudioBufferToMp3 } from '../src/lib/audio/encoders/mp3Encoder'

describe('IndiaTools Studio Bass Enhancer & Sub-Harmonic Generator Test Suite', () => {
  it('should register Studio Bass Enhancer in tools registry with full SEO metadata', () => {
    assert.strictEqual(TOOLS.length, 70, 'Tools count should be exactly 70')
    assert.strictEqual(CATEGORIES.create.toolCount, 29, 'Create category count should be 29')

    const tool = getToolBySlug('studio-bass-enhancer')
    assert.ok(tool, 'Studio Bass Enhancer tool must be found by slug')
    assert.strictEqual(tool.category, 'create')
    assert.strictEqual(tool.type, 'image-tool')
    assert.strictEqual(tool.seo.canonicalPath, '/tools/studio-bass-enhancer')
    assert.ok(tool.seo.title.endsWith('| IndiaTools'), 'SEO title must end with | IndiaTools')
    assert.ok(tool.seo.metaDescription.length > 50, 'Meta description must be descriptive')
    assert.ok(tool.faqs.length >= 5, 'Must provide at least 5 FAQs')
    assert.ok(tool.tags.includes('Bass Enhancer'), 'Must include Bass Enhancer tag')
    assert.ok(tool.tags.includes('Sub-Harmonic Generator'), 'Must include Sub-Harmonic Generator tag')
  })

  it('should verify default parameters and Linkwitz-Riley Q configuration', () => {
    assert.strictEqual(DEFAULT_BASS_PARAMS.subLevel, 55)
    assert.strictEqual(DEFAULT_BASS_PARAMS.crossoverHz, 85)
    assert.strictEqual(DEFAULT_BASS_PARAMS.drive, 40)
    assert.strictEqual(DEFAULT_BASS_PARAMS.punch, 45)
    assert.strictEqual(DEFAULT_BASS_PARAMS.monoLock, true)
    assert.strictEqual(DEFAULT_BASS_PARAMS.mix, 85)
    assert.strictEqual(DEFAULT_BASS_PARAMS.bypassed, false)

    // Linkwitz-Riley Butterworth Q
    assert.ok(
      Math.abs(LINKWITZ_RILEY_Q - 0.70710678) < 0.0001,
      'Linkwitz-Riley Q must be 1 / sqrt(2)'
    )
  })

  it('should generate mathematically valid asymmetric waveshaper curves and limiter functions', () => {
    const curve = createSubBassWaveShaperCurve(50, 4096)
    assert.strictEqual(curve.length, 4096)

    // Center point (0 input should produce ~0 output)
    const midIdx = 2048
    assert.ok(Math.abs(curve[midIdx]) < 0.05, `Center should be close to 0, got ${curve[midIdx]}`)

    // Check bounds strictly within [-1.0, 1.0]
    for (let i = 0; i < curve.length; i++) {
      assert.ok(curve[i] >= -1.0 && curve[i] <= 1.0, `Index ${i} out of bounds: ${curve[i]}`)
    }

    // Extremes
    assert.ok(curve[0] < -0.85, 'Negative extreme should saturate near -1')
    assert.ok(curve[4095] > 0.85, 'Positive extreme should saturate near +1')

    // Test soft clip limiter
    assert.strictEqual(applySoftClipLimiter(0.5), 0.5, 'Signals below 0.94 should pass untouched')
    assert.strictEqual(applySoftClipLimiter(-0.5), -0.5)

    const loudClip = applySoftClipLimiter(2.5)
    assert.ok(loudClip > 0.94 && loudClip < 1.0, `Loud signals must be smoothly soft-clipped below 1.0, got ${loudClip}`)
  })

  it('should encode processed audio to true 24-bit PCM WAV and 16-bit PCM WAV', async () => {
    const sampleRate = 48000
    const sampleCount = 600

    const channelData = [
      new Float32Array(sampleCount).fill(0.35),
      new Float32Array(sampleCount).fill(-0.35),
    ]

    // 24-bit PCM WAV export (68 bytes WAVEFORMATEXTENSIBLE header + 6 bytes per stereo frame)
    const blob24 = await encodeMultiChannelWav(channelData, sampleRate, { bitDepth: 24 })
    assert.strictEqual(blob24.type, 'audio/wav')
    assert.strictEqual(blob24.size, 68 + sampleCount * 2 * 3)

    // 16-bit PCM WAV export (44 bytes standard RIFF header + 4 bytes per stereo frame)
    const blob16 = await encodeMultiChannelWav(channelData, sampleRate, { bitDepth: 16 })
    assert.strictEqual(blob16.type, 'audio/wav')
    assert.strictEqual(blob16.size, 44 + sampleCount * 2 * 2)
  })

  it('should encode 320 kbps MP3 with custom bitrate options', async () => {
    const sampleRate = 44100
    const sampleCount = 44100 // 1 second

    const left = new Float32Array(sampleCount)
    const right = new Float32Array(sampleCount)
    for (let i = 0; i < sampleCount; i++) {
      left[i] = Math.sin((2 * Math.PI * 60 * i) / sampleRate) * 0.7
      right[i] = Math.sin((2 * Math.PI * 60 * i) / sampleRate) * 0.7
    }

    const testBuffer = {
      length: sampleCount,
      sampleRate,
      numberOfChannels: 2,
      getChannelData: (ch: number) => (ch === 0 ? left : right),
    } as unknown as AudioBuffer

    const mp3Blob = await encodeAudioBufferToMp3(testBuffer, { kbps: 320 })
    assert.strictEqual(mp3Blob.type, 'audio/mp3')
    assert.ok(mp3Blob.size > 1000, `MP3 Blob size should be valid, got ${mp3Blob.size}`)
  })
})
