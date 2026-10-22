/**
 * IndiaTools — Floating Photo Universe 2.0
 * Comprehensive Web Audio Signal Analysis & Movement Character Classifier
 * 100% Client-Side Local Audio Decoding & Feature Extraction
 */

import {
  UniverseAudioAnalysisResult,
  MusicMovementProfile,
  TimelineEnergyPoint,
} from './photoUniverseTypes.ts'

export class UniverseAudioAnalyzer {
  private cachedAnalysis: Map<string, UniverseAudioAnalysisResult> = new Map()

  /**
   * Analyze an audio track completely before camera score planning
   */
  public async analyzeAudioTrack(
    audioUrl: string,
    onProgress?: (percent: number) => void
  ): Promise<UniverseAudioAnalysisResult> {
    if (!audioUrl) {
      return this.generateFallbackAnalysis(30.0, 'balanced-cinematic')
    }

    if (this.cachedAnalysis.has(audioUrl)) {
      onProgress?.(100)
      return this.cachedAnalysis.get(audioUrl)!
    }

    try {
      if (typeof window === 'undefined') {
        return this.generateFallbackAnalysis(30.0, 'balanced-cinematic')
      }

      onProgress?.(10)
      const response = await fetch(audioUrl)
      const arrayBuffer = await response.arrayBuffer()
      onProgress?.(35)

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtx) {
        return this.generateFallbackAnalysis(30.0, 'balanced-cinematic')
      }

      const audioCtx = new AudioCtx()
      let audioBuffer: AudioBuffer

      try {
        onProgress?.(50)
        audioBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0))
        onProgress?.(70)
      } finally {
        if (audioCtx.state !== 'closed') {
          await audioCtx.close()
        }
      }

      const result = this.processAudioBuffer(audioBuffer, onProgress)
      this.cachedAnalysis.set(audioUrl, result)
      onProgress?.(100)
      return result
    } catch (err) {
      console.warn('PhotoUniverse: Audio analysis decoding error, using conservative fallback', err)
      return this.generateFallbackAnalysis(30.0, 'balanced-cinematic')
    }
  }

  /**
   * Process decoded AudioBuffer samples
   */
  public processAudioBuffer(
    buffer: AudioBuffer,
    onProgress?: (percent: number) => void
  ): UniverseAudioAnalysisResult {
    const channelData = buffer.getChannelData(0)
    const sampleRate = buffer.sampleRate
    const durationSec = buffer.duration

    // Step size for ~50 energy timeline frames per second (20ms resolution)
    const stepSize = Math.max(256, Math.floor(sampleRate / 50))
    const totalFrames = Math.floor(channelData.length / stepSize)

    const energies = new Float32Array(totalFrames)
    const bassEnergies = new Float32Array(totalFrames)

    let totalSum = 0
    let maxEnergy = 0.001
    let minEnergy = 1.0

    // Downsampling window for frequency estimation
    const bassRatio = Math.min(1.0, 400 / sampleRate)
    const bassSamplesStep = Math.max(1, Math.floor(1 / bassRatio))

    for (let f = 0; f < totalFrames; f++) {
      const start = f * stepSize
      const end = Math.min(channelData.length, start + stepSize)
      let sumSq = 0
      let bassSumSq = 0
      let count = 0

      for (let i = start; i < end; i++) {
        const val = channelData[i]
        sumSq += val * val
        if (i % bassSamplesStep === 0) {
          bassSumSq += val * val
        }
        count++
      }

      const rms = Math.sqrt(sumSq / Math.max(1, count))
      const bassRms = Math.sqrt(bassSumSq / Math.max(1, Math.floor(count / bassSamplesStep)))

      energies[f] = rms
      bassEnergies[f] = bassRms

      totalSum += rms
      if (rms > maxEnergy) maxEnergy = rms
      if (rms < minEnergy) minEnergy = rms

      if (f % 500 === 0 && onProgress) {
        onProgress(70 + Math.floor((f / totalFrames) * 25))
      }
    }

    const averageEnergy = totalSum / Math.max(1, totalFrames)
    const dynamicRange = Math.min(1.0, (maxEnergy - minEnergy) / maxEnergy)

    // Detect Transients & Beat Candidates
    const timelinePoints: TimelineEnergyPoint[] = []
    let transientCount = 0
    let lastTransientTime = -0.3
    const emaWindow = 40 // ~0.8s
    let runningEma = averageEnergy

    for (let f = 0; f < totalFrames; f++) {
      const timeSec = (f * stepSize) / sampleRate
      const currentEnergy = energies[f]
      const currentBass = bassEnergies[f]
      runningEma = runningEma * 0.94 + currentEnergy * 0.06

      const isBassPeak = currentBass > runningEma * 1.5 && currentBass > 0.12
      let isBeat = false

      if (isBassPeak && timeSec - lastTransientTime > 0.28) {
        isBeat = true
        lastTransientTime = timeSec
        transientCount++
      }

      // Sample down timeline points to 1 point every ~0.5s for UI display
      if (f % 25 === 0 || f === totalFrames - 1) {
        timelinePoints.push({
          timestamp: timeSec,
          energy: Math.min(1.0, currentEnergy / maxEnergy),
          isBeat,
          isPhraseStart: false,
        })
      }
    }

    // Estimate phrase boundaries (step changes in energy every ~8-16s)
    let phraseCount = Math.max(1, Math.round(durationSec / 12))
    for (let p = 0; p < timelinePoints.length; p++) {
      if (p % 24 === 0) {
        timelinePoints[p].isPhraseStart = true
      }
    }

    // Classify Movement Profile
    const transientDensity = transientCount / Math.max(1, durationSec) // transients per second
    let detectedProfile: MusicMovementProfile = 'balanced-cinematic'
    let confidence = 0.65
    let recommendedHoldDuration = 3.8
    let recommendedBaseSpeed = 0.85

    if (transientDensity < 0.8 && averageEnergy < maxEnergy * 0.35) {
      detectedProfile = 'melody-ambient'
      confidence = 0.85
      recommendedHoldDuration = 4.8
      recommendedBaseSpeed = 0.65
    } else if (transientDensity < 1.4 && dynamicRange > 0.45) {
      detectedProfile = 'soft-vocal'
      confidence = 0.78
      recommendedHoldDuration = 4.2
      recommendedBaseSpeed = 0.75
    } else if (transientDensity >= 1.4 && transientDensity < 2.8) {
      detectedProfile = 'steady-rhythm'
      confidence = 0.82
      recommendedHoldDuration = 3.4
      recommendedBaseSpeed = 1.05
    } else if (transientDensity >= 2.8 || averageEnergy > maxEnergy * 0.6) {
      detectedProfile = 'bass-heavy'
      confidence = 0.88
      recommendedHoldDuration = 2.8
      recommendedBaseSpeed = 1.25
    }

    // Detect Genuine Musical Climaxes / Drops
    const climaxTimestamps: number[] = []
    let lastClimaxTime = -12.0
    const minClimaxInterval = 10.0 // At least 10s cooldown
    const maxClimaxes = 4
    const windowFrames = Math.max(10, Math.floor((sampleRate * 2.0) / stepSize))

    for (let f = windowFrames; f < totalFrames - 20; f++) {
      const timeSec = (f * stepSize) / sampleRate
      if (timeSec - lastClimaxTime < minClimaxInterval) continue
      if (timeSec < 4.0 || timeSec > durationSec - 3.0) continue // Skip extreme intro/outro

      // Recent baseline before this moment (1.5s to 2s prior)
      let baselineSum = 0
      const baselineStart = Math.max(0, f - windowFrames)
      const baselineEnd = Math.max(1, f - 10)
      for (let b = baselineStart; b < baselineEnd; b++) {
        baselineSum += energies[b]
      }
      const baselineAvg = baselineSum / Math.max(1, baselineEnd - baselineStart)

      const currentEng = energies[f]
      const currentBass = bassEnergies[f]

      // Climax condition:
      // 1. Current energy is at least 1.55x the preceding baseline
      // 2. High bass energy (kick/drop impact)
      // 3. Significant absolute energy (> 55% of max energy)
      const isSurge = currentEng > baselineAvg * 1.55 && currentEng > maxEnergy * 0.55
      const isBassDrop = currentBass > averageEnergy * 1.4

      if (isSurge && isBassDrop) {
        climaxTimestamps.push(Number(timeSec.toFixed(2)))
        lastClimaxTime = timeSec
        if (climaxTimestamps.length >= maxClimaxes) break
      }
    }

    // Fallback climax if none passed threshold on calm or steady track
    if (climaxTimestamps.length === 0 && durationSec >= 15.0) {
      let highestEnergy = 0
      let peakTime = durationSec * 0.5
      for (let f = windowFrames; f < totalFrames - windowFrames; f++) {
        if (energies[f] > highestEnergy) {
          highestEnergy = energies[f]
          peakTime = (f * stepSize) / sampleRate
        }
      }
      if (highestEnergy > averageEnergy * 1.3) {
        climaxTimestamps.push(Number(peakTime.toFixed(2)))
      }
    }

    return {
      durationSec,
      detectedProfile,
      confidence,
      averageEnergy,
      dynamicRange,
      transientCount,
      phraseCount,
      timelinePoints,
      recommendedHoldDuration,
      recommendedBaseSpeed,
      climaxTimestamps,
    }
  }

  /**
   * Deterministic fallback when decoding is unavailable
   */
  public generateFallbackAnalysis(
    durationSec: number = 30.0,
    profile: MusicMovementProfile = 'balanced-cinematic'
  ): UniverseAudioAnalysisResult {
    const timelinePoints: TimelineEnergyPoint[] = []
    const count = Math.floor(durationSec * 2)

    for (let i = 0; i < count; i++) {
      const time = i * 0.5
      const energy = 0.4 + Math.sin(time * 0.5) * 0.25
      timelinePoints.push({
        timestamp: time,
        energy: Math.max(0.1, Math.min(1.0, energy)),
        isBeat: i % 4 === 0,
        isPhraseStart: i % 20 === 0,
      })
    }

    const holdDuration =
      profile === 'melody-ambient'
        ? 4.8
        : profile === 'soft-vocal'
        ? 4.2
        : profile === 'bass-heavy'
        ? 2.8
        : 3.8
    const baseSpeed =
      profile === 'melody-ambient'
        ? 0.65
        : profile === 'soft-vocal'
        ? 0.75
        : profile === 'bass-heavy'
        ? 1.25
        : 0.95

    const climaxTimestamps: number[] = []
    if (durationSec >= 16.0) {
      climaxTimestamps.push(Number((durationSec * 0.38).toFixed(2)))
      if (durationSec >= 28.0) {
        climaxTimestamps.push(Number((durationSec * 0.72).toFixed(2)))
      }
    } else {
      climaxTimestamps.push(Number((durationSec * 0.5).toFixed(2)))
    }

    return {
      durationSec,
      detectedProfile: profile,
      confidence: 0.7,
      averageEnergy: 0.45,
      dynamicRange: 0.5,
      transientCount: Math.round(durationSec * 1.5),
      phraseCount: Math.max(1, Math.round(durationSec / 12)),
      timelinePoints,
      recommendedHoldDuration: holdDuration,
      recommendedBaseSpeed: baseSpeed,
      climaxTimestamps,
    }
  }

  /**
   * Clear cached analysis
   */
  public clearCache(): void {
    this.cachedAnalysis.clear()
  }
}

export const universeAudioAnalyzer = new UniverseAudioAnalyzer()
