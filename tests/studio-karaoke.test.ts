import { describe, it } from 'node:test'
import assert from 'node:assert'
import { TOOLS, getToolBySlug } from '../src/data/tools.ts'
import { applyKaraokeDsp } from '../src/lib/audio/karaokeDsp.ts'
import { extractWaveformData } from '../src/lib/audio/waveformRenderer.ts'
import { encodeAudioBufferToWav } from '../src/lib/audio/encoders/wavEncoder.ts'
import { encodeAudioBufferToMp3 } from '../src/lib/audio/encoders/mp3Encoder.ts'

// Mock minimal AudioBuffer for headless node test environment
function createMockAudioBuffer(
  numberOfChannels: number,
  sampleRate: number,
  duration: number,
  generator?: (channel: number, index: number, sampleRate: number) => number
): AudioBuffer {
  const length = Math.floor(sampleRate * duration)
  const channels: Float32Array[] = []
  for (let ch = 0; ch < numberOfChannels; ch++) {
    const data = new Float32Array(length)
    for (let i = 0; i < length; i++) {
      data[i] = generator ? generator(ch, i, sampleRate) : Math.sin((2 * Math.PI * 440 * i) / sampleRate) * 0.5
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

// Mock minimal BaseAudioContext
function createMockAudioContext(sampleRate = 44100): BaseAudioContext {
  return {
    sampleRate,
    createBuffer(channels: number, length: number, rate: number) {
      const channelArrays: Float32Array[] = []
      for (let c = 0; c < channels; c++) {
        channelArrays.push(new Float32Array(length))
      }
      return {
        numberOfChannels: channels,
        length,
        sampleRate: rate,
        duration: length / rate,
        getChannelData(c: number) {
          return channelArrays[c]
        },
      } as unknown as AudioBuffer
    },
  } as unknown as BaseAudioContext
}

describe('Studio Karaoke & Vocal Remover Test Suite', () => {
  it('should be correctly registered in tools.ts with required metadata', () => {
    const tool = getToolBySlug('studio-karaoke-vocal-remover')
    assert.ok(tool, 'studio-karaoke-vocal-remover must be registered in TOOLS')
    assert.strictEqual(tool.category, 'create')
    assert.strictEqual(tool.type, 'image-tool')
    assert.strictEqual(tool.seo.canonicalPath, '/tools/studio-karaoke-vocal-remover')
    assert.ok(tool.seo.title.endsWith('| IndiaTools'), 'SEO title must end with | IndiaTools')
    assert.ok(tool.seo.metaDescription.length > 50, 'Meta description must be informative')
    assert.ok(tool.tags.includes('karaoke'), 'Tags must include karaoke')
    assert.ok(tool.faqs.length >= 5, 'Must have at least 5 FAQs')
    assert.strictEqual(TOOLS.length, 52, 'TOOLS must contain exactly 52 items')
  })

  it('should mathematically cancel centered audio signals in stereo', async () => {
    const sampleRate = 44100
    const duration = 0.5
    const mockCtx = createMockAudioContext(sampleRate)

    // Stereo buffer: Left and Right both have the exact same centered vocal tone (1000 Hz)
    const centeredBuffer = createMockAudioBuffer(2, sampleRate, duration, (_ch, i, sr) => {
      return Math.sin((2 * Math.PI * 1000 * i) / sr) * 0.8
    })

    const { buffer: processed } = await applyKaraokeDsp(
      centeredBuffer,
      {
        vocalReduction: 1.0, // 100% reduction
        bassPreservation: 0.0,
        outputGain: 1.0,
        semitones: 0,
        speed: 1.0,
      },
      mockCtx
    )

    const left = processed.getChannelData(0)
    const right = processed.getChannelData(1)

    // Verify center channel was cancelled (amplitude near zero)
    let maxAmp = 0
    for (let i = 100; i < left.length - 100; i++) {
      maxAmp = Math.max(maxAmp, Math.abs(left[i]), Math.abs(right[i]))
    }

    assert.ok(maxAmp < 0.001, `Centered signal should be completely cancelled, got max amplitude: ${maxAmp}`)
  })

  it('should preserve wide stereo signals when center cancellation is applied', async () => {
    const sampleRate = 44100
    const duration = 0.5
    const mockCtx = createMockAudioContext(sampleRate)

    // Stereo buffer: Left has 300 Hz, Right has -300 Hz (pure anti-phase stereo instrument)
    const wideBuffer = createMockAudioBuffer(2, sampleRate, duration, (ch, i, sr) => {
      const tone = Math.sin((2 * Math.PI * 300 * i) / sr) * 0.7
      return ch === 0 ? tone : -tone
    })

    const { buffer: processed } = await applyKaraokeDsp(
      wideBuffer,
      {
        vocalReduction: 1.0,
        bassPreservation: 0.0,
        outputGain: 1.0,
        semitones: 0,
        speed: 1.0,
      },
      mockCtx
    )

    const left = processed.getChannelData(0)
    let maxAmp = 0
    for (let i = 100; i < left.length - 100; i++) {
      maxAmp = Math.max(maxAmp, Math.abs(left[i]))
    }

    // Wide stereo instruments should survive center subtraction
    assert.ok(maxAmp > 0.5, `Stereo signals should remain strong, got max amplitude: ${maxAmp}`)
  })

  it('should preserve low-frequency bass with low-pass filter enabled', async () => {
    const sampleRate = 44100
    const duration = 0.5
    const mockCtx = createMockAudioContext(sampleRate)

    // Centered sub-bass tone at 60 Hz (typical kick drum / bassline)
    const bassBuffer = createMockAudioBuffer(2, sampleRate, duration, (_ch, i, sr) => {
      return Math.sin((2 * Math.PI * 60 * i) / sr) * 0.7
    })

    const { buffer: processedWithBass } = await applyKaraokeDsp(
      bassBuffer,
      {
        vocalReduction: 1.0,
        bassPreservation: 1.0, // 100% preservation
        outputGain: 1.0,
        semitones: 0,
        speed: 1.0,
      },
      mockCtx
    )

    const left = processedWithBass.getChannelData(0)
    let maxAmpWithBass = 0
    for (let i = 200; i < left.length - 200; i++) {
      maxAmpWithBass = Math.max(maxAmpWithBass, Math.abs(left[i]))
    }

    assert.ok(maxAmpWithBass > 0.3, `Bass signal should be preserved by low-pass filter, got: ${maxAmpWithBass}`)
  })

  it('should extract waveform peak data accurately', () => {
    const sampleRate = 44100
    const duration = 1.0
    const mockBuffer = createMockAudioBuffer(2, sampleRate, duration)

    const waveform = extractWaveformData(mockBuffer, 200)
    assert.ok(waveform.peaks.length > 0, 'Peaks array must be populated')
    assert.strictEqual(waveform.length, 200, 'Length must match requested points')
  })

  it('should encode processed audio buffer into WAV and MP3 blobs', async () => {
    const sampleRate = 44100
    const duration = 0.25
    const mockBuffer = createMockAudioBuffer(2, sampleRate, duration)

    const wavBlob = await encodeAudioBufferToWav(mockBuffer)
    assert.ok(wavBlob, 'WAV blob must be generated')
    assert.strictEqual(wavBlob.type, 'audio/wav')
    assert.ok(wavBlob.size > 1000, 'WAV blob size must be greater than header size')

    const mp3Blob = await encodeAudioBufferToMp3(mockBuffer, { kbps: 192 })
    assert.ok(mp3Blob, 'MP3 blob must be generated')
    assert.strictEqual(mp3Blob.type, 'audio/mp3')
    assert.ok(mp3Blob.size > 500, 'MP3 blob size must be non-empty')
  })
})
