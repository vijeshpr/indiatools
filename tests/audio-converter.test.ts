import { describe, it } from 'node:test'
import assert from 'node:assert'
import { TOOLS, getToolBySlug } from '../src/data/tools.ts'
import { encodeAudioBufferToWav } from '../src/lib/audio/encoders/wavEncoder.ts'
import { encodeAudioBufferToMp3 } from '../src/lib/audio/encoders/mp3Encoder.ts'
import {
  detectAudioFormat,
  getAvailableFormatCapabilities,
  estimateOutputSize,
} from '../src/lib/audio/formatCapabilities.ts'

// Mock minimal AudioBuffer for headless node test environment
function createMockAudioBuffer(
  numberOfChannels: number,
  sampleRate: number,
  duration: number
): AudioBuffer {
  const length = Math.floor(sampleRate * duration)
  const channels: Float32Array[] = []
  for (let ch = 0; ch < numberOfChannels; ch++) {
    const data = new Float32Array(length)
    // Generate 440 Hz sine tone
    for (let i = 0; i < length; i++) {
      data[i] = Math.sin((2 * Math.PI * 440 * i) / sampleRate) * 0.8
    }
    channels.push(data)
  }

  return {
    numberOfChannels,
    sampleRate,
    duration,
    length,
    getChannelData(channel: number) {
      return channels[channel]
    },
    copyFromChannel() {},
    copyToChannel() {},
  } as unknown as AudioBuffer
}

describe('Audio Converter Tool Suite', () => {
  it('should be correctly registered in tools.ts with required metadata', () => {
    const tool = getToolBySlug('audio-converter')
    assert.ok(tool, 'audio-converter must be registered')
    assert.strictEqual(tool.category, 'create')
    assert.strictEqual(tool.type, 'image-tool')
    assert.strictEqual(tool.seo.canonicalPath, '/tools/audio-converter')
    assert.ok(tool.seo.title.endsWith('| IndiaTools'), 'SEO title must end with brand')
    assert.ok(tool.tags.includes('Zero Upload'), 'Tags must highlight Zero Upload')
    assert.ok(tool.faqs.length >= 8, 'Must have at least 8 FAQs')
  })

  it('should detect audio format by extension and mime type', () => {
    assert.strictEqual(detectAudioFormat({ name: 'song.mp3', type: 'audio/mpeg' } as File), 'mp3')
    assert.strictEqual(detectAudioFormat({ name: 'voice.wav', type: 'audio/wav' } as File), 'wav')
    assert.strictEqual(detectAudioFormat({ name: 'track.m4a', type: 'audio/x-m4a' } as File), 'm4a')
    assert.strictEqual(detectAudioFormat({ name: 'audio.ogg', type: 'audio/ogg' } as File), 'ogg')
    assert.strictEqual(detectAudioFormat({ name: 'audio.flac', type: 'audio/flac' } as File), 'flac')
    assert.strictEqual(detectAudioFormat({ name: 'stream.webm', type: 'audio/webm' } as File), 'webm')
  })

  it('should estimate output file size accurately', () => {
    // 10 seconds of 44100 Hz stereo 16-bit WAV = 44 + 44100 * 2 * 2 * 10 = 1,764,044 bytes (~1.76 MB)
    const wavSize = estimateOutputSize(10, 'wav', 44100, 2, 192)
    assert.strictEqual(wavSize, 44 + 44100 * 2 * 2 * 10)

    // 10 seconds of 192 kbps MP3 = (192,000 / 8) * 10 = 240,000 bytes (~240 KB)
    const mp3Size = estimateOutputSize(10, 'mp3', 44100, 2, 192)
    assert.strictEqual(mp3Size, 240000)
  })

  it('should encode mock AudioBuffer into a valid 16-bit PCM RIFF WAV blob', async () => {
    const mockBuffer = createMockAudioBuffer(2, 44100, 1.0)
    let progressChecked = false

    const wavBlob = await encodeAudioBufferToWav(mockBuffer, {
      onProgress: (p) => {
        if (p > 0) progressChecked = true
      },
    })

    assert.ok(wavBlob instanceof Blob)
    assert.strictEqual(wavBlob.type, 'audio/wav')

    // Read header bytes
    const ab = await wavBlob.arrayBuffer()
    const view = new DataView(ab)
    const riff = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3))
    const wave = String.fromCharCode(view.getUint8(8), view.getUint8(9), view.getUint8(10), view.getUint8(11))
    const numChannels = view.getUint16(22, true)
    const sampleRate = view.getUint32(24, true)
    const bitsPerSample = view.getUint16(34, true)

    assert.strictEqual(riff, 'RIFF')
    assert.strictEqual(wave, 'WAVE')
    assert.strictEqual(numChannels, 2)
    assert.strictEqual(sampleRate, 44100)
    assert.strictEqual(bitsPerSample, 16)
    assert.ok(progressChecked, 'WAV progress callback was called')
  })

  it('should encode mock AudioBuffer into a valid MP3 blob via LameJS', async () => {
    const mockBuffer = createMockAudioBuffer(2, 44100, 0.5)
    let progressChecked = false

    const mp3Blob = await encodeAudioBufferToMp3(mockBuffer, {
      kbps: 192,
      onProgress: (p) => {
        if (p > 0) progressChecked = true
      },
    })

    assert.ok(mp3Blob instanceof Blob)
    assert.strictEqual(mp3Blob.type, 'audio/mp3')
    assert.ok(mp3Blob.size > 1000, `MP3 size should be substantial (got ${mp3Blob.size} bytes)`)
    assert.ok(progressChecked, 'MP3 progress callback was called')
  })

  it('should verify format capabilities include MP3 and WAV', () => {
    const caps = getAvailableFormatCapabilities()
    const mp3Cap = caps.find((c) => c.format === 'mp3')
    const wavCap = caps.find((c) => c.format === 'wav')

    assert.ok(mp3Cap && mp3Cap.canEncode, 'MP3 must be encodable')
    assert.ok(wavCap && wavCap.canEncode, 'WAV must be encodable')
  })
})
