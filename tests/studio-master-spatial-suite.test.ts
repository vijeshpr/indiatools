import { describe, it } from 'node:test'
import assert from 'node:assert'
import { TOOLS, getToolBySlug, CATEGORIES } from '../src/data/tools'
import {
  DEFAULT_AUTO_MASTER,
  DEFAULT_MULTIBAND,
  DEFAULT_ORBIT_MOTION,
} from '../src/lib/audio/studioSuite/types'
import { MASTERING_PRESET_SPECS } from '../src/lib/audio/studioSuite/masteringDsp'
import { analyzeAudioBufferLoudness } from '../src/lib/audio/studioSuite/loudnessAnalyzer'
import { encodeMultiChannelWav } from '../src/lib/audio/encoders/multiChannelWavEncoder'
import { encodeAudioBufferToMp3 } from '../src/lib/audio/encoders/mp3Encoder'

describe('IndiaTools Studio Master & Spatial Suite Test Suite', () => {
  it('should register Studio Master & Spatial Suite in tools registry with complete SEO', () => {
    assert.strictEqual(TOOLS.length, 68, 'Tools count should be exactly 66')
    assert.strictEqual(CATEGORIES.create.toolCount, 27, 'Create category count should be 25')

    const tool = getToolBySlug('studio-master-spatial-suite')
    assert.ok(tool, 'Studio Master & Spatial Suite tool must be found by slug')
    assert.strictEqual(tool.category, 'create')
    assert.strictEqual(tool.type, 'image-tool')
    assert.strictEqual(tool.seo.canonicalPath, '/tools/studio-master-spatial-suite')
    assert.ok(tool.seo.title.endsWith('| IndiaTools'), 'SEO title must end with | IndiaTools')
    assert.ok(tool.seo.metaDescription.length > 50, 'Meta description must be descriptive')
    assert.ok(tool.faqs.length >= 5, 'Must provide at least 5 FAQs')
    assert.ok(tool.tags.includes('Audio Mastering'), 'Must include Audio Mastering tag')
    assert.ok(tool.tags.includes('Multiband Compressor'), 'Must include Multiband Compressor tag')
    assert.ok(tool.tags.includes('LUFS Meter'), 'Must include LUFS Meter tag')
  })

  it('should verify all 4 auto master presets and default state configuration', () => {
    const presets = Object.keys(MASTERING_PRESET_SPECS)
    assert.strictEqual(presets.length, 4, 'Should have exactly 4 master presets')
    assert.ok(presets.includes('streaming-clean'))
    assert.ok(presets.includes('warm-analog'))
    assert.ok(presets.includes('club-punch'))
    assert.ok(presets.includes('punchy-vocal'))

    // Streaming Clean
    const clean = MASTERING_PRESET_SPECS['streaming-clean']
    assert.strictEqual(clean.subsonicCutHz, 30)
    assert.ok(clean.highAirGainDb > 0)

    // Warm Analog
    const warm = MASTERING_PRESET_SPECS['warm-analog']
    assert.strictEqual(warm.saturationDrive, 0.42)
    assert.ok(warm.lowMidGainDb > 0)

    // Club Punch
    const club = MASTERING_PRESET_SPECS['club-punch']
    assert.strictEqual(club.compRatio, 4.5)
    assert.ok(club.subsonicCutHz <= 30)

    // Default state sanity
    assert.strictEqual(DEFAULT_MULTIBAND.lowCrossoverHz, 200)
    assert.strictEqual(DEFAULT_MULTIBAND.highCrossoverHz, 3500)
    assert.strictEqual(DEFAULT_ORBIT_MOTION.subLock, true)
    assert.strictEqual(DEFAULT_ORBIT_MOTION.subLockCrossoverHz, 120)
  })

  it('should accurately calculate BS.1770 K-weighted loudness metrics', () => {
    const sampleRate = 44100
    const durationSec = 1.0
    const length = sampleRate * durationSec

    // Test 1: Absolute silence
    const silenceBuffer = {
      length,
      sampleRate,
      numberOfChannels: 2,
      getChannelData: () => new Float32Array(length),
    } as unknown as AudioBuffer

    const silenceResult = analyzeAudioBufferLoudness(silenceBuffer)
    assert.strictEqual(silenceResult.metrics.estimatedLufs, -96.0, 'Silence should floor at -96 LUFS')
    assert.strictEqual(silenceResult.metrics.inputPeakDb, -96.0, 'Silence true peak should be -96 dBFS')
    assert.strictEqual(silenceResult.metrics.inputRmsDb, -96.0, 'Silence RMS should be -96 dBFS')

    // Test 2: 1kHz Stereo Sine Wave at 0 dBFS amplitude (peak = 1.0)
    const sineLeft = new Float32Array(length)
    const sineRight = new Float32Array(length)
    const freq = 1000
    for (let i = 0; i < length; i++) {
      const val = Math.sin((2 * Math.PI * freq * i) / sampleRate)
      sineLeft[i] = val
      sineRight[i] = val
    }

    const sineBuffer = {
      length,
      sampleRate,
      numberOfChannels: 2,
      getChannelData: (ch: number) => (ch === 0 ? sineLeft : sineRight),
    } as unknown as AudioBuffer

    const sineResult = analyzeAudioBufferLoudness(sineBuffer)
    // Sine RMS is 1/sqrt(2) = -3.01 dBFS
    assert.ok(
      Math.abs(sineResult.metrics.inputRmsDb - -3.0) < 0.5,
      `RMS of full scale sine should be ~-3.0 dBFS, got ${sineResult.metrics.inputRmsDb}`
    )
    assert.ok(
      Math.abs(sineResult.metrics.inputPeakDb - 0.0) < 0.1,
      `True peak of full scale sine should be ~0.0 dBFS, got ${sineResult.metrics.inputPeakDb}`
    )
    assert.ok(
      sineResult.metrics.estimatedLufs > -6.0 && sineResult.metrics.estimatedLufs < 1.0,
      `Sine LUFS should be within reasonable bounds, got ${sineResult.metrics.estimatedLufs}`
    )
    assert.ok(sineResult.metrics.crestFactorDb > 2.5, 'Crest factor of sine wave is ~3 dB')
  })

  it('should correctly encode true 24-bit PCM WAV and 16-bit PCM WAV files', async () => {
    const sampleRate = 48000
    const sampleCount = 500

    const channelData = [
      new Float32Array(sampleCount).fill(0.25),
      new Float32Array(sampleCount).fill(-0.25),
    ]

    // 24-bit PCM WAV export
    const blob24 = await encodeMultiChannelWav(channelData, sampleRate, { bitDepth: 24 })
    assert.strictEqual(blob24.type, 'audio/wav')
    // WAVEFORMATEXTENSIBLE header is 68 bytes, each sample is 3 bytes * 2 channels = 6 bytes
    assert.strictEqual(blob24.size, 68 + sampleCount * 2 * 3)

    // 16-bit PCM WAV export (standard 44-byte RIFF header for stereo 16-bit)
    const blob16 = await encodeMultiChannelWav(channelData, sampleRate, { bitDepth: 16 })
    assert.strictEqual(blob16.type, 'audio/wav')
    assert.strictEqual(blob16.size, 44 + sampleCount * 2 * 2)
  })

  it('should encode 320 kbps MP3 from AudioBuffer', async () => {
    const sampleRate = 44100
    const sampleCount = 44100 // 1 sec

    const left = new Float32Array(sampleCount)
    const right = new Float32Array(sampleCount)
    for (let i = 0; i < sampleCount; i++) {
      left[i] = Math.sin((2 * Math.PI * 440 * i) / sampleRate) * 0.5
      right[i] = Math.cos((2 * Math.PI * 440 * i) / sampleRate) * 0.5
    }

    const testBuffer = {
      length: sampleCount,
      sampleRate,
      numberOfChannels: 2,
      getChannelData: (ch: number) => (ch === 0 ? left : right),
    } as unknown as AudioBuffer

    const mp3Blob = await encodeAudioBufferToMp3(testBuffer, 320)
    assert.strictEqual(mp3Blob.type, 'audio/mp3')
    assert.ok(mp3Blob.size > 1000, `MP3 Blob size should be valid, got ${mp3Blob.size}`)
  })
})
