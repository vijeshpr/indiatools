/**
 * IndiaTools — SonicCam
 * Local Browser Web Audio Beat & Transient Detector
 */

import { BeatMarker, BeatDetectionConfig } from './sonicCamTypes.ts'

export class SonicCamBeatDetector {
  /**
   * Analyzes an Audio File or URL locally in browser to detect musical beats
   */
  public async analyzeAudio(
    fileOrUrl: File | string,
    config: BeatDetectionConfig
  ): Promise<BeatMarker[]> {
    if (typeof window === 'undefined') {
      return this.generateFallbackBeats(30, config)
    }

    try {
      let arrayBuffer: ArrayBuffer

      if (fileOrUrl instanceof File) {
        arrayBuffer = await fileOrUrl.arrayBuffer()
      } else {
        const res = await fetch(fileOrUrl)
        arrayBuffer = await res.arrayBuffer()
      }

      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioCtxClass()
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0))
      ctx.close()

      return this.detectBeatsFromAudioBuffer(audioBuffer, config)
    } catch {
      // Fallback if browser audio decoding fails (e.g. CORS or offline)
      return this.generateFallbackBeats(30, config)
    }
  }

  /**
   * Detects rhythmic transients from decoded PCM audio channels
   */
  public detectBeatsFromAudioBuffer(
    buffer: AudioBuffer,
    config: BeatDetectionConfig
  ): BeatMarker[] {
    const sampleRate = buffer.sampleRate
    const channelData = buffer.getChannelData(0)
    const duration = buffer.duration

    // Process audio in 20ms analysis frames (~50 FPS resolution)
    const frameSize = Math.floor(sampleRate * 0.02)
    const totalFrames = Math.floor(channelData.length / frameSize)
    const energies: number[] = new Array(totalFrames)

    let maxEnergy = 0.0001
    for (let f = 0; f < totalFrames; f++) {
      let sum = 0
      const start = f * frameSize
      for (let i = 0; i < frameSize; i++) {
        const val = channelData[start + i]
        sum += val * val
      }
      const rms = Math.sqrt(sum / frameSize)
      energies[f] = rms
      if (rms > maxEnergy) maxEnergy = rms
    }

    // Normalize energies [0, 1]
    for (let f = 0; f < totalFrames; f++) {
      energies[f] /= maxEnergy
    }

    // Dynamic threshold based on user sensitivity (10 to 100)
    // High sensitivity = lower threshold (more beats detected)
    const sensitivityNorm = config.sensitivity / 100
    const threshold = 0.25 + (1 - sensitivityNorm) * 0.45
    const minSpacingFrames = Math.floor((config.minIntervalSec || 0.35) / 0.02)

    const beatMarkers: BeatMarker[] = []
    let lastBeatFrame = -minSpacingFrames

    for (let f = 1; f < totalFrames - 1; f++) {
      const e = energies[f]
      const prevE = energies[f - 1]
      const nextE = energies[f + 1]

      // Local energy peak check + threshold check
      if (e > threshold && e > prevE && e >= nextE) {
        if (f - lastBeatFrame >= minSpacingFrames) {
          const timeSec = Math.round(f * 0.02 * 100) / 100
          beatMarkers.push({
            id: `beat-${beatMarkers.length + 1}`,
            timeSec,
            strength: Math.min(1.0, e * 1.2),
            isManual: false,
          })
          lastBeatFrame = f
        }
      }
    }

    // If music is very ambient and no peaks exceeded threshold, generate fallback rhythm
    if (beatMarkers.length === 0) {
      return this.generateFallbackBeats(duration || 30, config)
    }

    return beatMarkers
  }

  /**
   * Generates rhythmic tempo intervals (120 BPM: every 0.5s or 0.75s)
   */
  public generateFallbackBeats(
    durationSec: number,
    config: BeatDetectionConfig
  ): BeatMarker[] {
    const markers: BeatMarker[] = []
    const interval = Math.max(0.35, config.minIntervalSec || 0.5)
    const totalBeats = Math.floor(durationSec / interval)

    for (let i = 0; i < totalBeats; i++) {
      markers.push({
        id: `beat-auto-${i + 1}`,
        timeSec: Math.round(i * interval * 100) / 100,
        strength: i % 2 === 0 ? 0.9 : 0.65,
        isManual: false,
      })
    }

    return markers
  }

  /**
   * Snap timestamp to nearest beat marker within tolerance
   */
  public snapToNearestBeat(
    markers: BeatMarker[],
    timeSec: number,
    toleranceSec = 0.2
  ): number {
    if (markers.length === 0) return timeSec
    let closestTime = timeSec
    let minDiff = toleranceSec

    for (const b of markers) {
      const diff = Math.abs(b.timeSec - timeSec)
      if (diff < minDiff) {
        minDiff = diff
        closestTime = b.timeSec
      }
    }

    return closestTime
  }
}

export const sonicCamBeatDetector = new SonicCamBeatDetector()
