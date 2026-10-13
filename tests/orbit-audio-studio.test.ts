import { describe, it } from 'node:test'
import assert from 'node:assert'
import { TOOLS, getToolBySlug } from '../src/data/tools.ts'
import {
  getSpatialCoordinates,
  createSyntheticImpulseResponse,
  PRESET_CONFIGS,
  SpatialOptions,
} from '../src/lib/audio/spatialEngine.ts'
import { encodeAudioBufferToWav } from '../src/lib/audio/encoders/wavEncoder.ts'
import { encodeAudioBufferToMp3 } from '../src/lib/audio/encoders/mp3Encoder.ts'

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
    for (let i = 0; i < length; i++) {
      data[i] = Math.sin((2 * Math.PI * 440 * i) / sampleRate) * 0.5
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

describe('Orbit Audio Studio — 8D & 16D Spatial Audio Test Suite', () => {
  it('should be correctly registered in tools.ts with required metadata', () => {
    const tool = getToolBySlug('orbit-audio-studio')
    assert.ok(tool, 'orbit-audio-studio must be registered in TOOLS')
    assert.strictEqual(tool.category, 'create')
    assert.strictEqual(tool.type, 'image-tool')
    assert.strictEqual(tool.seo.canonicalPath, '/tools/orbit-audio-studio')
    assert.ok(tool.seo.title.endsWith('| IndiaTools'), 'SEO title must end with | IndiaTools')
    assert.ok(tool.seo.metaDescription.length > 50, 'Meta description must be descriptive')
    assert.ok(tool.tags.includes('8D Audio'), 'Tags must include 8D Audio')
    assert.ok(tool.tags.includes('16D Audio'), 'Tags must include 16D Audio')
    assert.ok(tool.faqs.length >= 5, 'Must have at least 5 FAQs')
    assert.strictEqual(TOOLS.length, 52, 'TOOLS registry must contain exactly 52 items')
  })

  it('should calculate 8D circular horizontal trajectory with constant radius and zero elevation', () => {
    const options: SpatialOptions = {
      mode: '8d',
      preset: 'gentle-8d',
      speedSec: 8.0,
      radius: 3.0,
      direction: 1,
      elevation: 1.0,
      depthRatio: 1.0,
      widthRatio: 1.0,
      reverbPreset: 'studio',
      reverbWet: 0.15,
      bassPreservation: 0.75,
      outputGain: 1.0,
    }

    // At t = 0s: front (Z = -3, X = 0)
    const t0 = getSpatialCoordinates(0, options)
    assert.strictEqual(t0.x, 0)
    assert.strictEqual(t0.y, 0, '8D orbit must have 0 elevation')
    assert.strictEqual(t0.z, -3.0)
    assert.strictEqual(t0.azimuthDeg, 0)

    // At t = 2s (quarter turn, 90 deg): right (X = 3, Z = 0)
    const t2 = getSpatialCoordinates(2.0, options)
    assert.strictEqual(Math.round(t2.x), 3)
    assert.strictEqual(Math.round(t2.z), 0)
    assert.strictEqual(t2.azimuthDeg, 90)

    // At t = 4s (half turn, 180 deg): back (Z = 3, X = 0)
    const t4 = getSpatialCoordinates(4.0, options)
    assert.strictEqual(Math.round(t4.x), 0)
    assert.strictEqual(Math.round(t4.z), 3)
    assert.strictEqual(t4.azimuthDeg, 180)

    // At t = 6s (three-quarters turn, 270 deg): left (X = -3, Z = 0)
    const t6 = getSpatialCoordinates(6.0, options)
    assert.strictEqual(Math.round(t6.x), -3)
    assert.strictEqual(Math.round(t6.z), 0)
    assert.strictEqual(t6.azimuthDeg, 270)
  })

  it('should calculate 16D multi-axis trajectory with elevation modulation', () => {
    const options: SpatialOptions = {
      mode: '16d',
      preset: 'cosmic-orbit',
      speedSec: 10.0,
      radius: 3.5,
      direction: 1,
      elevation: 1.2,
      depthRatio: 1.0,
      widthRatio: 1.0,
      reverbPreset: 'cosmic',
      reverbWet: 0.2,
      bassPreservation: 0.75,
      outputGain: 1.0,
    }

    let minElevation = 0
    let maxElevation = 0

    // Sample across one full orbit
    for (let t = 0; t < 10.0; t += 0.5) {
      const coord = getSpatialCoordinates(t, options)
      if (coord.y < minElevation) minElevation = coord.y
      if (coord.y > maxElevation) maxElevation = coord.y
      assert.ok(coord.distance > 0, 'Distance must always be positive')
    }

    assert.ok(maxElevation > 0.5, '16D must have positive elevation excursions')
    assert.ok(minElevation < -0.5, '16D must have negative elevation excursions')
  })

  it('should verify all preset configurations produce valid trajectories', () => {
    const presetKeys = Object.keys(PRESET_CONFIGS) as Array<keyof typeof PRESET_CONFIGS>

    for (const p of presetKeys) {
      const config = PRESET_CONFIGS[p]
      const opts: SpatialOptions = {
        mode: 'preset',
        preset: p,
        speedSec: config.speedSec || 8.0,
        radius: config.radius || 3.0,
        direction: config.direction || 1,
        elevation: config.elevation || 0.8,
        depthRatio: config.depthRatio || 1.0,
        widthRatio: config.widthRatio || 1.0,
        reverbPreset: config.reverbPreset || 'studio',
        reverbWet: config.reverbWet || 0.15,
        bassPreservation: config.bassPreservation || 0.75,
        outputGain: 1.0,
      }

      const coord = getSpatialCoordinates(1.5, opts)
      assert.ok(!isNaN(coord.x), `Preset ${p} X coordinate must be a valid number`)
      assert.ok(!isNaN(coord.y), `Preset ${p} Y coordinate must be a valid number`)
      assert.ok(!isNaN(coord.z), `Preset ${p} Z coordinate must be a valid number`)
      assert.ok(coord.distance >= 0.5, `Preset ${p} distance must be >= 0.5m`)
    }
  })

  it('should synthesize algorithmic room impulse responses locally without network requests', () => {
    const mockCtx = createMockAudioContext(44100)

    const studioIR = createSyntheticImpulseResponse(mockCtx, 'studio')
    assert.strictEqual(studioIR.numberOfChannels, 2)
    assert.ok(studioIR.length > 40000, 'Studio IR buffer must be populated')

    const hallIR = createSyntheticImpulseResponse(mockCtx, 'hall')
    assert.strictEqual(hallIR.numberOfChannels, 2)
    assert.ok(hallIR.length > 80000, 'Hall IR buffer must be longer than Studio')

    const cosmicIR = createSyntheticImpulseResponse(mockCtx, 'cosmic')
    assert.strictEqual(cosmicIR.numberOfChannels, 2)
    assert.ok(cosmicIR.length > 120000, 'Cosmic IR buffer must be longest')
  })

  it('should encode processed spatial audio into valid WAV and MP3 blobs', async () => {
    const mockBuffer = createMockAudioBuffer(2, 44100, 0.25)

    const wavBlob = await encodeAudioBufferToWav(mockBuffer)
    assert.ok(wavBlob, 'WAV blob must exist')
    assert.strictEqual(wavBlob.type, 'audio/wav')
    assert.ok(wavBlob.size > 1000)

    const mp3Blob = await encodeAudioBufferToMp3(mockBuffer, { kbps: 256 })
    assert.ok(mp3Blob, 'MP3 blob must exist')
    assert.strictEqual(mp3Blob.type, 'audio/mp3')
    assert.ok(mp3Blob.size > 500)
  })
})
