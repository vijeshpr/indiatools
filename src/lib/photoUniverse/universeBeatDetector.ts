/**
 * IndiaTools — Floating Photo Universe 2.0
 * Web Audio Signal Processor & Music Reactive Impulse Engine
 * Refined Damped Bass Impacts with Protected Focus Hold Windows
 */

import { NormalizedAudioBands } from '../audioToVideo/types.ts'
import { BassShakeLevel } from './photoUniverseTypes.ts'

export interface UniverseAudioState {
  isBassImpact: boolean
  bassImpactStrength: number // 0 to 1
  smoothedEnergy: number // 0 to 1
  speedMultiplier: number // Dynamic speed scale (clamped 0.85 to 1.22)
  particleSpeedScale: number // 0.8 to 1.8
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
    level: BassShakeLevel = 'subtle',
    sensitivity: number = 50, // 0 to 100
    shakeIntensity: number = 30, // 0 to 100
    shakeDurationSec: number = 0.14,
    maxDisplacementPx: number = 8,
    musicReactive: boolean = true,
    shakeAllowed: boolean = true
  ): UniverseAudioState {
    if (!bands || level === 'off') {
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

    const dt = Math.max(0.001, Math.min(0.2, currentTime - this.lastTime))
    this.lastTime = currentTime

    // 1. Bass Energy Calculation (Combined subBass + bass)
    const rawBass = (bands.subBass || 0) * 0.7 + (bands.bass || 0) * 0.3

    // 2. Adaptive Exponential Moving Average (EMA)
    const emaAlpha = 0.08
    this.bassEma = this.bassEma * (1 - emaAlpha) + rawBass * emaAlpha

    // 3. Overall Energy Smoothing
    const rawOverall = bands.overall || 0
    const energyAlpha = 0.10
    this.overallEma = this.overallEma * (1 - energyAlpha) + rawOverall * energyAlpha

    // 4. Bass Transient / Impact Detection
    const sensNorm = Math.max(0, Math.min(100, sensitivity)) / 100
    const thresholdMultiplier = 1.70 - sensNorm * 0.50
    const minThreshold = 0.20 - sensNorm * 0.08

    const isImpactCandidate =
      rawBass > this.bassEma * thresholdMultiplier &&
      rawBass > minThreshold &&
      currentTime - this.lastImpactTime > 0.14 // 140ms debounce to prevent continuous vibration

    let isBassImpact = false
    let impactStrength = 0

    if (isImpactCandidate) {
      isBassImpact = true
      this.lastImpactTime = currentTime
      impactStrength = Math.min(1.0, (rawBass - this.bassEma * thresholdMultiplier) / 0.45 + 0.25)
      this.currentShakeStrength = Math.max(this.currentShakeStrength, impactStrength)
    }

    // 5. Exponential Decay of Bass Shake Impulse
    const decayRate = 1.0 / Math.max(0.06, shakeDurationSec)
    this.currentShakeStrength = Math.max(0, this.currentShakeStrength - dt * decayRate)

    // 6. Shake Level Multiplier
    const levelMult =
      level === 'strong' ? 1.2 : level === 'balanced' ? 0.8 : level === 'subtle' ? 0.45 : 0

    // Suppress or heavily dampen shake during protected focus hold
    const holdDampening = shakeAllowed ? 1.0 : 0.15

    const shakeScale = (shakeIntensity / 100) * this.currentShakeStrength * levelMult * holdDampening
    const maxDisp = Math.max(2, Math.min(20, maxDisplacementPx))

    const oscFreq = 26 // 26 Hz fast damped micro-oscillation
    const oscPhase = currentTime * oscFreq
    const shakeX = Math.sin(oscPhase) * maxDisp * shakeScale * 0.75
    const shakeY = Math.cos(oscPhase * 1.3) * maxDisp * shakeScale * 0.55
    const shakeZ = Math.sin(oscPhase * 0.7) * (maxDisp * 0.4) * shakeScale
    const shakePitch = Math.sin(oscPhase * 1.1) * 0.010 * shakeScale
    const shakeRoll = Math.cos(oscPhase * 0.9) * 0.008 * shakeScale

    // 7. Dynamic Musical Speed Scaling (Clamped strictly within 0.85 to 1.22)
    let speedMultiplier = 1.0
    if (musicReactive) {
      speedMultiplier = 0.88 + this.overallEma * 0.32
    }

    // 8. Particle & Light Streaks Reaction
    const midHigh = ((bands.mid || 0) + (bands.treble || 0)) / 2
    const particleSpeedScale = 0.8 + midHigh * 0.8
    const streakIntensity = Math.min(1.0, (bands.treble || 0) * 0.6 + impactStrength * 0.4)

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
