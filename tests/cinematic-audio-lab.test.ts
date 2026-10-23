import { describe, it } from 'node:test'
import assert from 'node:assert'
import { TOOLS, getToolBySlug, CATEGORIES } from '../src/data/tools'
import { REVERB_PRESETS, MATERIAL_PROPERTIES } from '../src/lib/audio/reverbEngine'
import {
  DEFAULT_SURROUND_OPTIONS,
  SURROUND_CHANNELS,
} from '../src/lib/audio/surroundEngine'
import { encodeMultiChannelWav, SPEAKER_MASKS } from '../src/lib/audio/encoders/multiChannelWavEncoder'

describe('IndiaTools Cinematic Audio Lab Test Suite', () => {
  it('should register both DTS Cinema Reverb and Surround Upmixer tools in registry', () => {
    assert.strictEqual(TOOLS.length, 71, 'Tools count should be exactly 71')
    assert.strictEqual(CATEGORIES.create.toolCount, 30, 'Create category count should be 30')

    // Tool 1: DTS Cinema Reverb
    const reverbTool = getToolBySlug('dts-cinema-theater-reverb')
    assert.ok(reverbTool, 'DTS Cinema Reverb tool must be found by slug')
    assert.strictEqual(reverbTool.category, 'create')
    assert.strictEqual(reverbTool.type, 'image-tool')
    assert.strictEqual(reverbTool.seo.canonicalPath, '/tools/dts-cinema-theater-reverb')
    assert.ok(reverbTool.seo.title.endsWith('| IndiaTools'), 'Reverb SEO title must end with | IndiaTools')
    assert.ok(reverbTool.faqs.length >= 4, 'Must provide detailed FAQs')

    // Tool 2: Virtual Surround Upmixer
    const surroundTool = getToolBySlug('virtual-surround-upmixer')
    assert.ok(surroundTool, 'Surround Upmixer tool must be found by slug')
    assert.strictEqual(surroundTool.category, 'create')
    assert.strictEqual(surroundTool.type, 'image-tool')
    assert.strictEqual(surroundTool.seo.canonicalPath, '/tools/virtual-surround-upmixer')
    assert.ok(surroundTool.seo.title.endsWith('| IndiaTools'), 'Surround SEO title must end with | IndiaTools')
    assert.ok(surroundTool.faqs.length >= 4, 'Must provide detailed FAQs')
  })

  it('should contain all 5 DTS cinema reverb presets with realistic physical dimensions', () => {
    const presets = Object.keys(REVERB_PRESETS)
    assert.strictEqual(presets.length, 5)
    assert.ok(presets.includes('imax-dome'))
    assert.ok(presets.includes('modern-cinema'))
    assert.ok(presets.includes('vintage-theater'))
    assert.ok(presets.includes('vip-screening'))
    assert.ok(presets.includes('symphony-hall'))

    // Verify IMAX Dome
    const imax = REVERB_PRESETS['imax-dome']
    assert.ok(imax.defaultOptions.rt60 >= 2.5 && imax.defaultOptions.rt60 <= 3.2)
    assert.ok(imax.defaultOptions.roomLength > 30)

    // Verify VIP Screening
    const vip = REVERB_PRESETS['vip-screening']
    assert.ok(vip.defaultOptions.rt60 < 1.0)
    assert.ok(vip.defaultOptions.roomLength < 15)

    // Verify materials
    assert.ok(MATERIAL_PROPERTIES['velvet-curtains'].hfAbsorption > 0.5)
    assert.ok(MATERIAL_PROPERTIES['concrete'].hfAbsorption < 0.15)
  })

  it('should configure 5.1 and 7.1 surround channels with correct azimuth angles', () => {
    assert.strictEqual(SURROUND_CHANNELS.C.azimuthDeg, 0)
    assert.strictEqual(SURROUND_CHANNELS.FL.azimuthDeg, -30)
    assert.strictEqual(SURROUND_CHANNELS.FR.azimuthDeg, 30)
    assert.strictEqual(SURROUND_CHANNELS.SL.azimuthDeg, -100)
    assert.strictEqual(SURROUND_CHANNELS.SR.azimuthDeg, 100)
    assert.strictEqual(SURROUND_CHANNELS.RL.azimuthDeg, -145)
    assert.strictEqual(SURROUND_CHANNELS.RR.azimuthDeg, 145)

    assert.ok(DEFAULT_SURROUND_OPTIONS.subCrossoverHz >= 60 && DEFAULT_SURROUND_OPTIONS.subCrossoverHz <= 140)
  })

  it('should generate valid multi-channel WAV blobs for 5.1 and 7.1 audio', async () => {
    const sampleRate = 44100
    const sampleCount = 1000

    // Test 6 channels (5.1 surround)
    const ch51 = [
      new Float32Array(sampleCount).fill(0.1),
      new Float32Array(sampleCount).fill(-0.1),
      new Float32Array(sampleCount).fill(0.2),
      new Float32Array(sampleCount).fill(0.5),
      new Float32Array(sampleCount).fill(0.05),
      new Float32Array(sampleCount).fill(-0.05),
    ]

    const blob51_16 = await encodeMultiChannelWav(ch51, sampleRate, {
      bitDepth: 16,
      channelMask: SPEAKER_MASKS.SURROUND_5_1,
    })
    assert.strictEqual(blob51_16.type, 'audio/wav')
    // Header size 68 (WAVEFORMATEXTENSIBLE) + data size 1000 * 6 * 2 = 12068 bytes
    assert.strictEqual(blob51_16.size, 68 + sampleCount * 6 * 2)

    // Test 8 channels 24-bit (7.1 surround master)
    const ch71 = [
      ...ch51,
      new Float32Array(sampleCount).fill(0.02),
      new Float32Array(sampleCount).fill(-0.02),
    ]

    const blob71_24 = await encodeMultiChannelWav(ch71, sampleRate, {
      bitDepth: 24,
      channelMask: SPEAKER_MASKS.SURROUND_7_1,
    })
    assert.strictEqual(blob71_24.type, 'audio/wav')
    // Header size 68 + data size 1000 * 8 * 3 = 24068 bytes
    assert.strictEqual(blob71_24.size, 68 + sampleCount * 8 * 3)
  })
})
