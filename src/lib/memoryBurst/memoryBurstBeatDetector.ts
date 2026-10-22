/**
 * IndiaTools — Memory Burst Studio
 * Web Audio API Transient & Beat Detector
 * Low/Low-Mid Spectral Energy & Adaptive Baseline Detector
 */

import { MemoryBurstBeatMarker } from './memoryBurstTypes'

export class MemoryBurstBeatDetector {
  /**
   * Analyzes an audio buffer or audio URL and detects rhythm onsets
   */
  public async analyzeAudio(
    audioUrl: string,
    sensitivity: number = 65,
    minIntervalSec: number = 0.25
  ): Promise<MemoryBurstBeatMarker[]> {
    if (!audioUrl) return []

    try {
      const response = await fetch(audioUrl)
      const arrayBuffer = await response.arrayBuffer()

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const audioCtx = new AudioCtx()

      try {
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
        return this.detectBeatsFromBuffer(audioBuffer, sensitivity, minIntervalSec)
      } finally {
        if (audioCtx.state !== 'closed') {
          await audioCtx.close()
        }
      }
    } catch (err) {
      console.warn('MemoryBurst: Audio decoding failed, using algorithmic fallback rhythm', err)
      return this.generateFallbackBeats(30.0, minIntervalSec)
    }
  }

  /**
   * Performs sub-band energy analysis over decoded AudioBuffer samples
   */
  public detectBeatsFromBuffer(
    buffer: AudioBuffer,
    sensitivity: number = 65,
    minIntervalSec: number = 0.25
  ): MemoryBurstBeatMarker[] {
    const channelData = buffer.getChannelData(0)
    const sampleRate = buffer.sampleRate
    const durationSec = buffer.duration

    // Step size for ~100 energy frames per second (10ms resolution)
    const stepSize = Math.max(256, Math.floor(sampleRate / 100))
    const totalFrames = Math.floor(channelData.length / stepSize)

    // Compute low-frequency (bass) energy envelopes
    const energies = new Float32Array(totalFrames)

    for (let f = 0; f < totalFrames; f++) {
      const start = f * stepSize
      const end = Math.min(channelData.length, start + stepSize)
      let sumSq = 0
      for (let i = start; i < end; i++) {
        const val = channelData[i]
        sumSq += val * val
      }
      energies[f] = Math.sqrt(sumSq / (end - start))
    }

    // Adaptive moving average window (~1.0s window: 100 frames)
    const winSize = 100
    const markers: MemoryBurstBeatMarker[] = []

    // Map sensitivity (0 - 100) to threshold factor (higher sensitivity = lower threshold factor)
    const sensNorm = Math.max(0.1, Math.min(1.0, sensitivity / 100))
    const threshMultiplier = 1.65 - sensNorm * 0.75 // 1.65 down to 0.90

    let lastBeatTime = -minIntervalSec

    for (let f = 0; f < totalFrames; f++) {
      const timeSec = (f * stepSize) / sampleRate
      if (timeSec < lastBeatTime + minIntervalSec) continue

      // Compute local mean & variance
      const wStart = Math.max(0, f - Math.floor(winSize / 2))
      const wEnd = Math.min(totalFrames, f + Math.floor(winSize / 2))
      let mean = 0
      for (let w = wStart; w < wEnd; w++) {
        mean += energies[w]
      }
      mean /= Math.max(1, wEnd - wStart)

      const currentEnergy = energies[f]
      const threshold = mean * threshMultiplier

      // Local peak check
      const prevEnergy = f > 0 ? energies[f - 1] : 0
      const nextEnergy = f < totalFrames - 1 ? energies[f + 1] : 0

      if (
        currentEnergy > threshold &&
        currentEnergy > prevEnergy &&
        currentEnergy >= nextEnergy &&
        currentEnergy > 0.02
      ) {
        const strength = Math.min(1.0, (currentEnergy - mean) / (mean + 0.01))
        markers.push({
          id: `beat-${markers.length}-${timeSec.toFixed(3)}`,
          timeSec: Math.round(timeSec * 1000) / 1000,
          strength,
        })
        lastBeatTime = timeSec
      }
    }

    // If detector found too few beats (< 3), provide fallback rhythm
    if (markers.length < 3) {
      return this.generateFallbackBeats(durationSec, minIntervalSec)
    }

    return markers
  }

  /**
   * Generates rhythmic musical tempo beat markers when audio has no clear transient onsets
   */
  public generateFallbackBeats(
    durationSec: number = 30.0,
    intervalSec: number = 0.5
  ): MemoryBurstBeatMarker[] {
    const markers: MemoryBurstBeatMarker[] = []
    const step = Math.max(0.2, intervalSec)
    let t = step

    while (t < durationSec - 0.2) {
      markers.push({
        id: `fb-beat-${markers.length}-${t.toFixed(2)}`,
        timeSec: Math.round(t * 100) / 100,
        strength: 0.7,
      })
      t += step
    }

    return markers
  }
}

export const memoryBurstBeatDetector = new MemoryBurstBeatDetector()
