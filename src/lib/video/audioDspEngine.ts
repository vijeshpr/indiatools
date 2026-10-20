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

export interface AudioDspTuning {
  sensitivity?: number
  bassSensitivity?: number
  midsSensitivity?: number
  trebleSensitivity?: number
  smoothing?: number
  attack?: number
  release?: number
  beatThreshold?: number
  minTriggerInterval?: number
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
   * Reset all accumulated energy history and smoothed states
   */
  public reset() {
    this.energyHistory = []
    this.smoothedBass = 0
    this.smoothedMids = 0
    this.smoothedTreble = 0
    this.smoothedOverall = 0
    this.lastBeatTime = 0
  }

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

  public analyze(
    freqData: Uint8Array,
    currentTime = 0,
    tuning?: AudioDspTuning,
    timeData?: Uint8Array
  ): DetailedAudioBands {
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

    const sens = tuning?.sensitivity ?? 1.0
    const bassSens = tuning?.bassSensitivity ?? 1.0
    const midsSens = tuning?.midsSensitivity ?? 1.0
    const trebleSens = tuning?.trebleSensitivity ?? 1.0
    const attack = tuning?.attack ?? 0.75
    const release = tuning?.release ?? 0.18
    const beatThresholdMult = tuning?.beatThreshold ?? 1.45
    const minInterval = tuning?.minTriggerInterval ?? 0.22

    // Check for complete silence
    let isSilent = true
    for (let i = 0; i < Math.min(len, 64); i++) {
      if (freqData[i] > 2) {
        isSilent = false
        break
      }
    }

    if (isSilent) {
      this.smoothedBass *= 0.85
      this.smoothedMids *= 0.85
      this.smoothedTreble *= 0.85
      this.smoothedOverall *= 0.85
      return {
        subBass: 0,
        bass: Math.max(0, this.smoothedBass),
        lowMids: 0,
        mids: Math.max(0, this.smoothedMids),
        highMids: 0,
        treble: Math.max(0, this.smoothedTreble),
        overall: Math.max(0, this.smoothedOverall),
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

    const rawSubBass = Math.min(1, getAverage(0, subBassEnd) * sens * bassSens)
    const rawBass = Math.min(1, getAverage(subBassEnd, bassEnd) * sens * bassSens)
    const rawLowMids = Math.min(1, getAverage(bassEnd, lowMidsEnd) * sens * midsSens)
    const rawMids = Math.min(1, getAverage(lowMidsEnd, midsEnd) * sens * midsSens)
    const rawHighMids = Math.min(1, getAverage(midsEnd, highMidsEnd) * sens * trebleSens)
    const rawTreble = Math.min(1, getAverage(highMidsEnd, trebleEnd) * sens * trebleSens)

    // Aggregate overall energy with perceptual weighting
    const rawOverall = Math.min(
      1,
      rawSubBass * 0.2 + rawBass * 0.35 + rawLowMids * 0.2 + rawMids * 0.15 + rawTreble * 0.1
    )

    // Smooth via envelope follower
    this.smoothedBass = this.followEnvelope(this.smoothedBass, rawBass, attack, release)
    this.smoothedMids = this.followEnvelope(this.smoothedMids, rawMids, attack, release * 1.1)
    this.smoothedTreble = this.followEnvelope(this.smoothedTreble, rawTreble, attack * 0.9, release * 1.2)
    this.smoothedOverall = this.followEnvelope(this.smoothedOverall, rawOverall, attack, release)

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
    const threshold = -15 * variance + beatThresholdMult
    const isInstantaneousPeak = rawOverall > avgHistory * threshold && rawBass > 0.45
    const canTriggerBeat = currentTime - this.lastBeatTime > minInterval

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
}

/**
 * Peak Hold Indicator Manager for Neon Segmented Equalizers
 */
export class PeakHoldManager {
  private peaks: number[] = []
  private decayRate = 2.4 // pixels per frame

  public update(currentValues: number[]): number[] {
    const len = currentValues.length
    if (this.peaks.length !== len) {
      this.peaks = new Array(len).fill(0)
    }

    for (let i = 0; i < len; i++) {
      const current = currentValues[i] || 0
      if (current >= this.peaks[i]) {
        this.peaks[i] = current
      } else {
        this.peaks[i] = Math.max(0, this.peaks[i] - this.decayRate)
      }
    }

    return [...this.peaks]
  }

  public reset() {
    this.peaks = []
  }
}

/**
 * Format timestamps into clean MM:SS strings
 */
export function formatTimeDisplay(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Precise Timecode (MM:SS:FF)
 */
export function formatTimecode(seconds: number, fps = 60): string {
  if (isNaN(seconds) || seconds < 0) return '00:00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  const frames = Math.floor((seconds % 1) * fps)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`
}
