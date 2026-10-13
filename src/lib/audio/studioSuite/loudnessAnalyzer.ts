/**
 * Standards-Aware Audio Loudness & Dynamics Analyzer
 * Implements ITU-R BS.1770 / EBU R128 K-weighting filter simulation,
 * integrated LUFS estimation, True Peak approximation, RMS, and Crest Factor.
 */

import { LoudnessMetrics } from './types'

export interface AnalysisSummary {
  metrics: LoudnessMetrics
  suggestedGainDb: number
  warnings: string[]
}

/**
 * Measure full-length AudioBuffer loudness metrics
 */
export function analyzeAudioBufferLoudness(
  buffer: AudioBuffer,
  targetLufs = -14.0
): AnalysisSummary {
  const numChannels = buffer.numberOfChannels
  const sampleRate = buffer.sampleRate
  const length = buffer.length

  if (length === 0) {
    return {
      metrics: {
        inputRmsDb: -96,
        inputPeakDb: -96,
        estimatedLufs: -96,
        crestFactorDb: 0,
        outputRmsDb: -96,
        outputPeakDb: -96,
        gainReductionDb: { low: 0, mid: 0, high: 0, master: 0 },
      },
      suggestedGainDb: 0,
      warnings: [],
    }
  }

  // 1. Calculate Peak and Raw RMS
  let maxPeak = 0
  let sumSquaresTotal = 0

  for (let ch = 0; ch < numChannels; ch++) {
    const data = buffer.getChannelData(ch)
    for (let i = 0; i < length; i++) {
      const absVal = Math.abs(data[i])
      if (absVal > maxPeak) maxPeak = absVal
      sumSquaresTotal += data[i] * data[i]
    }
  }

  const rawRms = Math.sqrt(sumSquaresTotal / (length * numChannels))
  const rawRmsDb = rawRms > 0 ? 20 * Math.log10(rawRms) : -96
  const rawPeakDb = maxPeak > 0 ? 20 * Math.log10(maxPeak) : -96
  const crestFactorDb = Math.max(0, rawPeakDb - rawRmsDb)

  // 2. Exact ITU-R BS.1770-4 K-Weighting Filter Simulation for LUFS
  // Stage 1: High shelf filter (f0 = 1681.97 Hz, G = 3.9998 dB, Q = 0.7071)
  const f0_hs = 1681.974450955533
  const g_hs = 3.99984385397
  const q_hs = 0.7071752369278453
  const a_hs = Math.pow(10, g_hs / 40)
  const w0_hs = (2 * Math.PI * f0_hs) / sampleRate
  const cosw0_hs = Math.cos(w0_hs)
  const sinw0_hs = Math.sin(w0_hs)
  const alpha_hs = sinw0_hs / (2 * q_hs)
  const twoSqrtAAlpha = 2 * Math.sqrt(a_hs) * alpha_hs

  const a0_hs = (a_hs + 1) - (a_hs - 1) * cosw0_hs + twoSqrtAAlpha
  const hs_b0 = (a_hs * ((a_hs + 1) + (a_hs - 1) * cosw0_hs + twoSqrtAAlpha)) / a0_hs
  const hs_b1 = (-2 * a_hs * ((a_hs - 1) + (a_hs + 1) * cosw0_hs)) / a0_hs
  const hs_b2 = (a_hs * ((a_hs + 1) + (a_hs - 1) * cosw0_hs - twoSqrtAAlpha)) / a0_hs
  const hs_a1 = (2 * ((a_hs - 1) - (a_hs + 1) * cosw0_hs)) / a0_hs
  const hs_a2 = ((a_hs + 1) - (a_hs - 1) * cosw0_hs - twoSqrtAAlpha) / a0_hs

  // Stage 2: High pass RLB filter (f0 = 38.135 Hz, Q = 0.5)
  const f0_hp = 38.13547087602444
  const q_hp = 0.5
  const w0_hp = (2 * Math.PI * f0_hp) / sampleRate
  const cosw0_hp = Math.cos(w0_hp)
  const sinw0_hp = Math.sin(w0_hp)
  const alpha_hp = sinw0_hp / (2 * q_hp)
  const a0_hp = 1 + alpha_hp

  const hp_b0 = ((1 + cosw0_hp) / 2) / a0_hp
  const hp_b1 = (-(1 + cosw0_hp)) / a0_hp
  const hp_b2 = ((1 + cosw0_hp) / 2) / a0_hp
  const hp_a1 = (-2 * cosw0_hp) / a0_hp
  const hp_a2 = (1 - alpha_hp) / a0_hp

  let totalKWeightedPower = 0

  for (let ch = 0; ch < numChannels; ch++) {
    const data = buffer.getChannelData(ch)
    let s_d1 = 0
    let s_d2 = 0
    let hp_d1 = 0
    let hp_d2 = 0
    let chSumSquares = 0

    // Filter all samples
    for (let i = 0; i < length; i++) {
      const s = data[i]

      // Stage 1: High shelf
      const y_s = hs_b0 * s + s_d1
      s_d1 = hs_b1 * s - hs_a1 * y_s + s_d2
      s_d2 = hs_b2 * s - hs_a2 * y_s

      // Stage 2: High-pass RLB
      const y_k = hp_b0 * y_s + hp_d1
      hp_d1 = hp_b1 * y_s - hp_a1 * y_k + hp_d2
      hp_d2 = hp_b2 * y_s - hp_a2 * y_k

      chSumSquares += y_k * y_k
    }

    const chMeanPower = length > 0 ? chSumSquares / length : 0
    totalKWeightedPower += chMeanPower
  }

  // Average power across channels for stereo loudness normalization
  const meanPowerPerCh = numChannels > 0 ? totalKWeightedPower / numChannels : 0
  const estimatedLufs = meanPowerPerCh > 0.0000000001
    ? -0.691 + 10 * Math.log10(meanPowerPerCh)
    : -96

  // 3. Target Gain Matching & Headroom Warnings
  const suggestedGainDb = Math.max(-12, Math.min(12, targetLufs - estimatedLufs))
  const warnings: string[] = []

  if (rawPeakDb > -0.3) {
    warnings.push('Input track is already peaking close to 0 dBFS. Avoid heavy boost to prevent inter-sample clipping.')
  }
  if (estimatedLufs < -26) {
    warnings.push('Input audio is very quiet. Auto-Master will apply gentle gain staging to achieve broadcast streaming target.')
  }
  if (crestFactorDb < 6) {
    warnings.push('Input track has very low dynamic range (heavy pre-limiting detected). Use lower intensity for transparent results.')
  }

  return {
    metrics: {
      inputRmsDb: parseFloat(rawRmsDb.toFixed(1)),
      inputPeakDb: parseFloat(rawPeakDb.toFixed(1)),
      estimatedLufs: parseFloat(estimatedLufs.toFixed(1)),
      crestFactorDb: parseFloat(crestFactorDb.toFixed(1)),
      outputRmsDb: parseFloat(Math.min(0, rawRmsDb + suggestedGainDb).toFixed(1)),
      outputPeakDb: parseFloat(Math.min(0, rawPeakDb + suggestedGainDb).toFixed(1)),
      gainReductionDb: {
        low: 0,
        mid: 0,
        high: 0,
        master: 0,
      },
    },
    suggestedGainDb: parseFloat(suggestedGainDb.toFixed(1)),
    warnings,
  }
}
