/**
 * Smart Auto-Master DSP Pipeline & Saturation Curve Generator
 */

import { AutoMasterConfig, MasteringPresetId } from './types'

export interface PresetParamDetails {
  id: MasteringPresetId
  name: string
  subtitle: string
  description: string
  subsonicCutHz: number
  lowMidFreqHz: number
  lowMidGainDb: number
  highAirFreqHz: number
  highAirGainDb: number
  compThresholdDb: number
  compRatio: number
  compAttackMs: number
  compReleaseMs: number
  saturationDrive: number
}

export const MASTERING_PRESET_SPECS: Record<MasteringPresetId, PresetParamDetails> = {
  'streaming-clean': {
    id: 'streaming-clean',
    name: 'Streaming Clean (-14 LUFS)',
    subtitle: 'Transparent & Balanced • Spotify & Apple Music Spec',
    description: 'Polished broadcast clarity with subsonic low-end clean-up, subtle 300Hz boxiness reduction, and airy top-end sheen.',
    subsonicCutHz: 30,
    lowMidFreqHz: 320,
    lowMidGainDb: -1.2,
    highAirFreqHz: 12000,
    highAirGainDb: 1.8,
    compThresholdDb: -18,
    compRatio: 2.4,
    compAttackMs: 25,
    compReleaseMs: 120,
    saturationDrive: 0.15,
  },
  'warm-analog': {
    id: 'warm-analog',
    name: 'Warm Analog Tape',
    subtitle: 'Vintage Reel-to-Reel Saturation • Rich Harmonics',
    description: 'Rich low-end warmth, second-order harmonic tube/tape saturation, and silky high-frequency rounding.',
    subsonicCutHz: 28,
    lowMidFreqHz: 180,
    lowMidGainDb: 1.6,
    highAirFreqHz: 10000,
    highAirGainDb: 0.8,
    compThresholdDb: -20,
    compRatio: 3.2,
    compAttackMs: 35,
    compReleaseMs: 160,
    saturationDrive: 0.42,
  },
  'club-punch': {
    id: 'club-punch',
    name: 'Heavy Bass & Club Punch',
    subtitle: 'EDM, Trap & Hip-Hop • Maximum Low Impact',
    description: 'Aggressive sub-bass enhancement around 60Hz, controlled vocal transients, and punchy dancefloor-ready loudness.',
    subsonicCutHz: 26,
    lowMidFreqHz: 65,
    lowMidGainDb: 3.2,
    highAirFreqHz: 11000,
    highAirGainDb: 1.5,
    compThresholdDb: -22,
    compRatio: 4.5,
    compAttackMs: 14,
    compReleaseMs: 85,
    saturationDrive: 0.35,
  },
  'punchy-vocal': {
    id: 'punchy-vocal',
    name: 'Punchy Acoustic / Vocal',
    subtitle: 'Presence & Articulation • Forward Vocal Clarity',
    description: 'Brings vocals and acoustic instruments to the front of the mix with dedicated 3.2kHz presence boost and dynamic control.',
    subsonicCutHz: 35,
    lowMidFreqHz: 3200,
    lowMidGainDb: 2.4,
    highAirFreqHz: 12500,
    highAirGainDb: 2.2,
    compThresholdDb: -19,
    compRatio: 2.8,
    compAttackMs: 12,
    compReleaseMs: 70,
    saturationDrive: 0.22,
  },
}

/**
 * Generate smooth analog tape/tube polynomial saturation wave-shaping curve
 */
export function createSaturationCurve(drive: number): Float32Array {
  const n = 4096
  const curve = new Float32Array(n)
  const k = Math.max(0.01, drive * 3)

  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1
    // Soft hyperbolic saturation transfer function
    curve[i] = ((1 + k) * x) / (1 + k * Math.abs(x))
  }
  return curve
}

export interface AutoMasterNodes {
  inputGain: GainNode
  subsonicFilter: BiquadFilterNode
  lowMidFilter: BiquadFilterNode
  highAirFilter: BiquadFilterNode
  compressor: DynamicsCompressorNode
  waveShaper: WaveShaperNode
  outputGain: GainNode
  dryGain: GainNode
  wetGain: GainNode
  outputSum: GainNode
}

/**
 * Build Audio Nodes for Auto Master Chain in AudioContext or OfflineAudioContext
 */
export function buildAutoMasterNodes(
  ctx: BaseAudioContext,
  config: AutoMasterConfig
): AutoMasterNodes {
  const spec = MASTERING_PRESET_SPECS[config.preset]

  const inputGain = ctx.createGain()
  inputGain.gain.value = Math.pow(10, config.inputGainDb / 20)

  // 1. Subsonic High-Pass Filter (30 Hz)
  const subsonicFilter = ctx.createBiquadFilter()
  subsonicFilter.type = 'highpass'
  subsonicFilter.frequency.value = config.subsonicCut ? spec.subsonicCutHz : 10
  subsonicFilter.Q.value = 0.7071

  // 2. Low-Mid Parametric EQ
  const lowMidFilter = ctx.createBiquadFilter()
  lowMidFilter.type = 'peaking'
  lowMidFilter.frequency.value = spec.lowMidFreqHz
  lowMidFilter.gain.value = spec.lowMidGainDb
  lowMidFilter.Q.value = 1.0

  // 3. High-Air Shelf Filter (12 kHz)
  const highAirFilter = ctx.createBiquadFilter()
  highAirFilter.type = 'highshelf'
  highAirFilter.frequency.value = spec.highAirFreqHz
  highAirFilter.gain.value = config.highAirBoost ? spec.highAirGainDb : 0.0

  // 4. Dynamics Compressor
  const compressor = ctx.createDynamicsCompressor()
  compressor.threshold.value = spec.compThresholdDb
  compressor.ratio.value = spec.compRatio
  compressor.attack.value = spec.compAttackMs / 1000
  compressor.release.value = spec.compReleaseMs / 1000
  compressor.knee.value = 6.0

  // 5. Analog Tape Saturation WaveShaper
  const waveShaper = ctx.createWaveShaper()
  const drive = config.warmSaturation ? spec.saturationDrive : 0.01
  waveShaper.curve = createSaturationCurve(drive) as unknown as Float32Array<ArrayBuffer>
  waveShaper.oversample = '2x'

  // 6. Output Gain & Equal-Power Intensity Crossfader
  const outputGain = ctx.createGain()
  outputGain.gain.value = Math.pow(10, config.outputGainDb / 20)

  const dryGain = ctx.createGain()
  const wetGain = ctx.createGain()
  const outputSum = ctx.createGain()

  // Equal power dry/wet crossfade based on intensity
  const intensity = config.enabled ? Math.max(0, Math.min(1, config.intensity)) : 0
  dryGain.gain.value = Math.cos(intensity * 0.5 * Math.PI)
  wetGain.gain.value = Math.sin(intensity * 0.5 * Math.PI)

  // Connect Wet Chain
  inputGain.connect(subsonicFilter)
  subsonicFilter.connect(lowMidFilter)
  lowMidFilter.connect(highAirFilter)
  highAirFilter.connect(compressor)
  compressor.connect(waveShaper)
  waveShaper.connect(outputGain)
  outputGain.connect(wetGain)
  wetGain.connect(outputSum)

  // Connect Dry Parallel Path
  inputGain.connect(dryGain)
  dryGain.connect(outputSum)

  return {
    inputGain,
    subsonicFilter,
    lowMidFilter,
    highAirFilter,
    compressor,
    waveShaper,
    outputGain,
    dryGain,
    wetGain,
    outputSum,
  }
}
