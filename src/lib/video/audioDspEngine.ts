/**
 * IndiaTools — Audio Spectrum Video Studio 2.0
 * DSP Audio Analysis Engine: FFT Multi-Band Isolation, Envelope Follower,
 * Peak Tracking & Transient Beat Detection.
 */

import { AudioBands, DetailedAudioBands } from './audioVisualizerTypes.ts'

/**
 * Backward-compatible 4-band audio energy calculation
 */
export function calculateAudioBands(freqData: Uint8Array): AudioBands {
  const len = freqData.length
  if (len === 0) {
    return { bass: 0, mid: 0, treble: 0, overall: 0 }
  }

  // Bass: roughly first 10% of bins
  const bassEnd = Math.max(2, Math.floor(len * 0.1))
  // Mid: 10% to 45%
  const midEnd = Math.max(bassEnd + 1, Math.floor(len * 0.45))

  let bassSum = 0
  for (let i = 0; i < bassEnd; i++) {
    bassSum += freqData[i]
  }
  const bass = bassSum / (bassEnd * 255)

  let midSum = 0
  for (let i = bassEnd; i < midEnd; i++) {
    midSum += freqData[i]
  }
  const mid = midSum / ((midEnd - bassEnd) * 255)

  let trebleSum = 0
  for (let i = midEnd; i < len; i++) {
    trebleSum += freqData[i]
  }
  const treble = trebleSum / ((len - midEnd) * 255)

  const overall = bass * 0.5 + mid * 0.3 + treble * 0.2

  return {
    bass: Math.min(1, Math.max(0, bass)),
    mid: Math.min(1, Math.max(0, mid)),
    treble: Math.min(1, Math.max(0, treble)),
    overall: Math.min(1, Math.max(0, overall)),
  }
}

/**
 * Advanced 6-band logarithmic DSP analysis with transient beat detection
 */
export class AudioDspAnalyzer {
  private energyHistory: number[] = []
  private historySize = 43 // ~0.7 seconds at 60 FPS
  private smoothedBass = 0
  private smoothedMids = 0
  private smoothedTreble = 0
  private smoothedOverall = 0
  private lastBeatTime = 0

  /**
   * Asymmetric attack & release envelope follower:
   * Snaps up rapidly on transient hits, decays smoothly to avoid visual jitter.
   */
  private followEnvelope(current: number, target: number, attack = 0.75, release = 0.18): number {
    if (target > current) {
      return current + (target - current) * attack
    }
    return current + (target - current) * release
  }

  public analyze(freqData: Uint8Array, currentTime = 0): DetailedAudioBands {
    const len = freqData.length
    if (len === 0) {
      return {
        subBass: 0,
        bass: 0,
        lowMids: 0,
        mids: 0,
        highMids: 0,
        treble: 0,
        overall: 0,
        isBeatHit: false,
        energyDelta: 0,
      }
    }

    // Bin range boundaries mapped approximately to standard 44.1kHz / 2048 FFT
    // bin bandwidth = 44100 / 2048 ≈ 21.5 Hz per bin
    const subBassEnd = Math.max(2, Math.floor(len * 0.03)) // 20 - 60 Hz
    const bassEnd = Math.max(subBassEnd + 1, Math.floor(len * 0.12)) // 60 - 250 Hz
    const lowMidsEnd = Math.max(bassEnd + 1, Math.floor(len * 0.24)) // 250 - 500 Hz
    const midsEnd = Math.max(lowMidsEnd + 1, Math.floor(len * 0.50)) // 500 - 2000 Hz
    const highMidsEnd = Math.max(midsEnd + 1, Math.floor(len * 0.75)) // 2000 - 6000 Hz
    const trebleEnd = len // 6000 - 20000 Hz

    const getAverage = (start: number, end: number): number => {
      let sum = 0
      const count = Math.max(1, end - start)
      for (let i = start; i < end; i++) {
        sum += freqData[i] || 0
      }
      return sum / (count * 255)
    }

    const rawSubBass = getAverage(0, subBassEnd)
    const rawBass = getAverage(subBassEnd, bassEnd)
    const rawLowMids = getAverage(bassEnd, lowMidsEnd)
    const rawMids = getAverage(lowMidsEnd, midsEnd)
    const rawHighMids = getAverage(midsEnd, highMidsEnd)
    const rawTreble = getAverage(highMidsEnd, trebleEnd)

    // Aggregate overall energy with perceptual weighting
    const rawOverall = (rawSubBass * 0.2 + rawBass * 0.35 + rawLowMids * 0.2 + rawMids * 0.15 + rawTreble * 0.1)

    // Smooth via envelope follower
    this.smoothedBass = this.followEnvelope(this.smoothedBass, rawBass, 0.8, 0.16)
    this.smoothedMids = this.followEnvelope(this.smoothedMids, rawMids, 0.7, 0.20)
    this.smoothedTreble = this.followEnvelope(this.smoothedTreble, rawTreble, 0.65, 0.25)
    this.smoothedOverall = this.followEnvelope(this.smoothedOverall, rawOverall, 0.75, 0.15)

    // Transient beat detection via moving average variance
    this.energyHistory.push(rawOverall)
    if (this.energyHistory.length > this.historySize) {
      this.energyHistory.shift()
    }

    let avgHistory = 0
    for (const val of this.energyHistory) {
      avgHistory += val
    }
    avgHistory /= Math.max(1, this.energyHistory.length)

    let variance = 0
    for (const val of this.energyHistory) {
      const diff = val - avgHistory
      variance += diff * diff
    }
    variance /= Math.max(1, this.energyHistory.length)

    // Dynamic threshold: beat sensitivity adjusts based on recent variance
    const threshold = -15 * variance + 1.45
    const isInstantaneousPeak = rawOverall > avgHistory * threshold && rawBass > 0.45
    const canTriggerBeat = currentTime - this.lastBeatTime > 0.22 // Max ~4.5 beats/sec to avoid flicker

    const isBeatHit = Boolean(isInstantaneousPeak && canTriggerBeat)
    if (isBeatHit) {
      this.lastBeatTime = currentTime
    }

    const energyDelta = Math.max(0, rawOverall - avgHistory)

    return {
      subBass: Math.min(1, Math.max(0, rawSubBass)),
      bass: Math.min(1, Math.max(0, this.smoothedBass)),
      lowMids: Math.min(1, Math.max(0, rawLowMids)),
      mids: Math.min(1, Math.max(0, this.smoothedMids)),
      highMids: Math.min(1, Math.max(0, rawHighMids)),
      treble: Math.min(1, Math.max(0, this.smoothedTreble)),
      overall: Math.min(1, Math.max(0, this.smoothedOverall)),
      isBeatHit,
      energyDelta,
    }
  }

  public reset() {
    this.energyHistory = []
    this.smoothedBass = 0
    this.smoothedMids = 0
    this.smoothedTreble = 0
    this.smoothedOverall = 0
    this.lastBeatTime = 0
  }
}

/**
 * Peak-Hold manager with gravity acceleration for frequency bars
 */
export class PeakHoldManager {
  private peaks: number[] = []
  private velocities: number[] = []
  private gravity = 1.45
  private decayRate = 0.96

  constructor(count = 64) {
    this.init(count)
  }

  public init(count: number) {
    this.peaks = new Array(count).fill(0)
    this.velocities = new Array(count).fill(0)
  }

  public update(currentValues: number[]): number[] {
    const len = currentValues.length
    if (this.peaks.length !== len) {
      this.init(len)
    }

    for (let i = 0; i < len; i++) {
      const cur = currentValues[i]
      if (cur >= this.peaks[i]) {
        this.peaks[i] = cur
        this.velocities[i] = 0 // Reset downward velocity
      } else {
        // Accelerate downward via gravity
        this.velocities[i] = (this.velocities[i] + this.gravity) * this.decayRate
        this.peaks[i] = Math.max(0, this.peaks[i] - this.velocities[i])
      }
    }

    return this.peaks
  }

  public reset() {
    this.peaks.fill(0)
    this.velocities.fill(0)
  }
}
