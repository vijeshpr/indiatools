/**
 * IndiaTools — Floating Photo Universe
 * Web Audio Signal Processor & Music Reactive Impulse Engine
 * 100% Client-Side Sub-band Energy Transient & Envelope Follower
 */

import { NormalizedAudioBands } from '../audioToVideo/types.ts'

export interface UniverseAudioState {
  isBassImpact: boolean
  bassImpactStrength: number // 0 to 1
  smoothedEnergy: number // 0 to 1
  speedMultiplier: number // Dynamic speed scale (e.g. 0.85 to 1.35)
  particleSpeedScale: number // 0.8 to 2.2
  streakIntensity: number // 0 to 1
  shakeOffset: { x: number; y: number; z: number; pitch: number; roll: number }
}

export class UniverseBeatDetector {
  private bassEma: number = 0.2
  private overallEma: number = 0.2
  private lastImpactTime: number = -1
  private currentShakeStrength: number = 0
  private lastTime: number = 0

  /**
   * Reset detector internal filters
   */
  public reset(): void {
    this.bassEma = 0.2
    this.overallEma = 0.2
    this.lastImpactTime = -1
    this.currentShakeStrength = 0
    this.lastTime = 0
  }

  /**
   * Process frame audio bands and compute reactive camera and physical impulses
   */
  public process(
    bands: NormalizedAudioBands | undefined,
    currentTime: number,
    sensitivity: number = 60, // 0 to 100
    shakeIntensity: number = 45, // 0 to 100
    shakeDurationSec: number = 0.18,
    maxDisplacementPx: number = 12,
    musicReactive: boolean = true
  ): UniverseAudioState {
    // Default neutral state when audio is silent or uninitialized
    if (!bands) {
      return {
        isBassImpact: false,
        bassImpactStrength: 0,
        smoothedEnergy: 0.3,
        speedMultiplier: 1.0,
        particleSpeedScale: 1.0,
        streakIntensity: 0,
        shakeOffset: { x: 0, y: 0, z: 0, pitch: 0, roll: 0 },
      }
    }

    // Handle time jumps (seeking or restart)
    const dt = Math.max(0.001, Math.min(0.2, currentTime - this.lastTime))
    this.lastTime = currentTime

    // 1. Bass Energy Calculation (Combined subBass + bass)
    const rawBass = (bands.subBass || 0) * 0.65 + (bands.bass || 0) * 0.35

    // 2. Adaptive Exponential Moving Average (EMA)
    const emaAlpha = 0.08
    this.bassEma = this.bassEma * (1 - emaAlpha) + rawBass * emaAlpha

    // 3. Overall Energy Smoothing
    const rawOverall = bands.overall || 0
    const energyAlpha = 0.12
    this.overallEma = this.overallEma * (1 - energyAlpha) + rawOverall * energyAlpha

    // 4. Bass Transient / Impact Detection
    // Sensitivity scale: 0 => high threshold 1.8x EMA, 100 => low threshold 1.15x EMA
    const sensNorm = Math.max(0, Math.min(100, sensitivity)) / 100
    const thresholdMultiplier = 1.75 - sensNorm * 0.55 // range [1.20, 1.75]
    const minThreshold = 0.18 - sensNorm * 0.08

    const isImpactCandidate =
      rawBass > this.bassEma * thresholdMultiplier &&
      rawBass > minThreshold &&
      currentTime - this.lastImpactTime > 0.11 // 110ms debounce to avoid continuous jitter

    let isBassImpact = false
    let impactStrength = 0

    if (isImpactCandidate) {
      isBassImpact = true
      this.lastImpactTime = currentTime
      impactStrength = Math.min(1.0, (rawBass - this.bassEma * thresholdMultiplier) / 0.4 + 0.3)
      this.currentShakeStrength = Math.max(this.currentShakeStrength, impactStrength)
    }

    // 5. Exponential Decay of Bass Shake Impulse
    const decayRate = 1.0 / Math.max(0.05, shakeDurationSec)
    this.currentShakeStrength = Math.max(0, this.currentShakeStrength - dt * decayRate)

    // 6. Shake Offset Calculation (High frequency damped micro-displacement)
    const shakeScale = (shakeIntensity / 100) * (this.currentShakeStrength)
    const maxDisp = Math.max(2, Math.min(30, maxDisplacementPx))

    const oscFreq = 28 // 28 Hz quick micro-oscillation
    const oscPhase = currentTime * oscFreq
    const shakeX = Math.sin(oscPhase) * maxDisp * shakeScale * 0.8
    const shakeY = Math.cos(oscPhase * 1.3) * maxDisp * shakeScale * 0.6
    const shakeZ = Math.sin(oscPhase * 0.7) * (maxDisp * 0.5) * shakeScale
    const shakePitch = Math.sin(oscPhase * 1.1) * 0.015 * shakeScale
    const shakeRoll = Math.cos(oscPhase * 0.9) * 0.012 * shakeScale

    // 7. Dynamic Musical Speed Scaling (Music Reactive)
    let speedMultiplier = 1.0
    if (musicReactive) {
      // Scale from 0.82 (quiet moments) to 1.38 (energetic drops)
      speedMultiplier = 0.85 + this.overallEma * 0.45
    }

    // 8. Particle & Light Streaks Reaction
    const midHigh = ((bands.mid || 0) + (bands.treble || 0)) / 2
    const particleSpeedScale = 0.8 + midHigh * 1.2
    const streakIntensity = Math.min(1.0, (bands.treble || 0) * 0.7 + impactStrength * 0.5)

    return {
      isBassImpact,
      bassImpactStrength: impactStrength,
      smoothedEnergy: this.overallEma,
      speedMultiplier,
      particleSpeedScale,
      streakIntensity,
      shakeOffset: {
        x: shakeX,
        y: shakeY,
        z: shakeZ,
        pitch: shakePitch,
        roll: shakeRoll,
      },
    }
  }
}

export const universeBeatDetector = new UniverseBeatDetector()
