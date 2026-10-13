/**
 * Three-Band Multiband Dynamics Processor
 * Implements 4th-order Linkwitz-Riley phase-aligned crossovers (-24 dB/octave),
 * per-band dynamics compression, make-up gain, solo/mute routing, and real-time metering.
 */

import { MultibandConfig, BandDynamicsConfig } from './types'

export interface MultibandNodes {
  inputNode: GainNode
  // Low Band Crossover (Cascaded Butterworth LP pair = LR4)
  lowLp1: BiquadFilterNode
  lowLp2: BiquadFilterNode
  lowCompressor: DynamicsCompressorNode
  lowGain: GainNode
  lowMeterAnalyser: AnalyserNode

  // Mid Band Path (High-pass at lowCrossover, then Low-pass at highCrossover)
  midHp1: BiquadFilterNode
  midHp2: BiquadFilterNode
  midLp1: BiquadFilterNode
  midLp2: BiquadFilterNode
  midCompressor: DynamicsCompressorNode
  midGain: GainNode
  midMeterAnalyser: AnalyserNode

  // High Band Path (Cascaded Butterworth HP pair = LR4)
  highHp1: BiquadFilterNode
  highHp2: BiquadFilterNode
  highCompressor: DynamicsCompressorNode
  highGain: GainNode
  highMeterAnalyser: AnalyserNode

  outputSum: GainNode
  dryGain: GainNode
  wetGain: GainNode
  finalOutput: GainNode
}

/**
 * Configure Linkwitz-Riley 4th-Order (LR4) Cascaded Filters & Compressors
 */
export function buildMultibandNodes(
  ctx: BaseAudioContext,
  config: MultibandConfig
): MultibandNodes {
  const inputNode = ctx.createGain()
  const outputSum = ctx.createGain()
  const dryGain = ctx.createGain()
  const wetGain = ctx.createGain()
  const finalOutput = ctx.createGain()

  const fLow = config.lowCrossoverHz
  const fHigh = config.highCrossoverHz
  const Q = 0.7071 // Butterworth alignment for LR4 when cascaded

  // Helper to create filter
  const makeFilter = (type: BiquadFilterType, freq: number) => {
    const f = ctx.createBiquadFilter()
    f.type = type
    f.frequency.value = freq
    f.Q.value = Q
    return f
  }

  // Helper to configure dynamics compressor
  const makeCompressor = (band: BandDynamicsConfig) => {
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = band.threshold
    comp.ratio.value = band.ratio
    comp.attack.value = Math.max(0.001, band.attackMs / 1000)
    comp.release.value = Math.max(0.01, band.releaseMs / 1000)
    comp.knee.value = 4.0
    return comp
  }

  // Helper to create band analyser for metering
  const makeAnalyser = () => {
    const a = ctx.createAnalyser()
    a.fftSize = 256
    a.smoothingTimeConstant = 0.8
    return a
  }

  // 1. LOW BAND: 0 to fLow Hz (LR4 Low-Pass)
  const lowLp1 = makeFilter('lowpass', fLow)
  const lowLp2 = makeFilter('lowpass', fLow)
  const lowCompressor = makeCompressor(config.low)
  const lowGain = ctx.createGain()
  lowGain.gain.value = Math.pow(10, config.low.gainDb / 20)
  const lowMeterAnalyser = makeAnalyser()

  inputNode.connect(lowLp1)
  lowLp1.connect(lowLp2)
  lowLp2.connect(lowCompressor)
  lowCompressor.connect(lowGain)
  lowGain.connect(lowMeterAnalyser)
  lowMeterAnalyser.connect(outputSum)

  // 2. MID BAND: fLow to fHigh Hz (HP at fLow + LP at fHigh)
  const midHp1 = makeFilter('highpass', fLow)
  const midHp2 = makeFilter('highpass', fLow)
  const midLp1 = makeFilter('lowpass', fHigh)
  const midLp2 = makeFilter('lowpass', fHigh)
  const midCompressor = makeCompressor(config.mid)
  const midGain = ctx.createGain()
  midGain.gain.value = Math.pow(10, config.mid.gainDb / 20)
  const midMeterAnalyser = makeAnalyser()

  inputNode.connect(midHp1)
  midHp1.connect(midHp2)
  midHp2.connect(midLp1)
  midLp1.connect(midLp2)
  midLp2.connect(midCompressor)
  midCompressor.connect(midGain)
  midGain.connect(midMeterAnalyser)
  midMeterAnalyser.connect(outputSum)

  // 3. HIGH BAND: fHigh to 20kHz (LR4 High-Pass)
  const highHp1 = makeFilter('highpass', fHigh)
  const highHp2 = makeFilter('highpass', fHigh)
  const highCompressor = makeCompressor(config.high)
  const highGain = ctx.createGain()
  highGain.gain.value = Math.pow(10, config.high.gainDb / 20)
  const highMeterAnalyser = makeAnalyser()

  inputNode.connect(highHp1)
  highHp1.connect(highHp2)
  highHp2.connect(highCompressor)
  highCompressor.connect(highGain)
  highGain.connect(highMeterAnalyser)
  highMeterAnalyser.connect(outputSum)

  // Apply Solo & Mute logic
  applySoloMuteRouting(config, lowGain, midGain, highGain)

  // Wet / Dry module bypass crossfade
  if (config.enabled) {
    dryGain.gain.value = 0.0
    wetGain.gain.value = 1.0
  } else {
    dryGain.gain.value = 1.0
    wetGain.gain.value = 0.0
  }

  inputNode.connect(dryGain)
  dryGain.connect(finalOutput)

  outputSum.connect(wetGain)
  wetGain.connect(finalOutput)

  return {
    inputNode,
    lowLp1,
    lowLp2,
    lowCompressor,
    lowGain,
    lowMeterAnalyser,
    midHp1,
    midHp2,
    midLp1,
    midLp2,
    midCompressor,
    midGain,
    midMeterAnalyser,
    highHp1,
    highHp2,
    highCompressor,
    highGain,
    highMeterAnalyser,
    outputSum,
    dryGain,
    wetGain,
    finalOutput,
  }
}

/**
 * Update band solo/mute gains predictably
 */
export function applySoloMuteRouting(
  config: MultibandConfig,
  lowGain: GainNode,
  midGain: GainNode,
  highGain: GainNode
) {
  const isAnySolo = config.low.solo || config.mid.solo || config.high.solo

  const calcBandGain = (band: BandDynamicsConfig) => {
    if (band.mute) return 0
    if (isAnySolo) {
      return band.solo ? Math.pow(10, band.gainDb / 20) : 0
    }
    return Math.pow(10, band.gainDb / 20)
  }

  lowGain.gain.value = calcBandGain(config.low)
  midGain.gain.value = calcBandGain(config.mid)
  highGain.gain.value = calcBandGain(config.high)
}
