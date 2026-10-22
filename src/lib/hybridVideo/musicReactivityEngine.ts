/**
 * IndiaTools — Hybrid Video Studio Music Reactivity Engine
 * 100% Client-Side Pure Deterministic Audio-Visual Reactivity
 *
 * Provides:
 * - Real-time camera shake, beat zoom punch, bass low-frequency impact, melody drift
 * - Beat flash burst, chromatic aberration twitch, radial glow, vignette pulse
 * - 8 editable production presets
 * - 100% preview & export parity with zero frame drift
 */

import type {
  MusicReactivityConfig,
  ReactivityMode,
  ReactivityScope,
} from './types.ts'
import type { MusicAnalysisResult } from './musicIntelligence.ts'

export interface MusicReactivityResult {
  deltaX: number
  deltaY: number
  deltaScale: number // Multiplicative scale factor (1.0 = normal)
  deltaRotationDeg: number
  flashAlpha: number
  flashColor: string
  chromaticOffsetPx: number
  radialGlowAlpha: number
  vignetteAlpha: number
  hasActiveReaction: boolean
  activeMode: ReactivityMode
}

export type ReactivityPresetId =
  | 'beat-impact'
  | 'bass-pulse'
  | 'cinematic-melody'
  | 'high-energy-montage'
  | 'slow-emotional-motion'
  | 'glitch-beat'
  | 'flash-zoom'
  | 'clean-beat-sync'

export interface ReactivityPreset {
  id: ReactivityPresetId
  name: string
  tagline: string
  description: string
  mode: ReactivityMode
  config: Partial<MusicReactivityConfig>
}

export const REACTIVITY_PRESETS: ReactivityPreset[] = [
  {
    id: 'beat-impact',
    name: 'Beat Impact',
    tagline: 'Punchy Rhythmic Hits',
    description: 'Crisp camera shake and fast inward zoom punch aligned directly to musical beats.',
    mode: 'beat-sync',
    config: {
      mode: 'beat-sync',
      beatShake: {
        enabled: true,
        intensity: 35,
        durationSec: 0.16,
        decay: 'sharp',
        type: 'combined',
        trigger: 'strong-beats-only',
      },
      zoomPunch: {
        enabled: true,
        amount: 1.18,
        durationSec: 0.22,
        direction: 'in',
        recovery: 'fast',
        trigger: 'strong-beats-only',
      },
      bassImpact: { enabled: false, sensitivity: 1.0, intensity: 30, attackSec: 0.04, releaseSec: 0.15, threshold: 0.3 },
      melodyMotion: { enabled: false, amount: 20, smoothness: 1.0, direction: 'forward', resetPerClip: true },
      beatFlash: { enabled: false, intensity: 20, durationSec: 0.1, color: 'neutral-white', trigger: 'strong-beats-only' },
      chromaticAberration: { enabled: false, intensity: 20 },
      radialGlow: { enabled: false, intensity: 0 },
      vignettePulse: { enabled: true, intensity: 25 },
    },
  },
  {
    id: 'bass-pulse',
    name: 'Bass Pulse',
    tagline: 'Sub-Bass Energy Impact',
    description: 'Camera pushes and vignette breathe dynamically with low-frequency 40-120Hz bass energy.',
    mode: 'bass-pulse',
    config: {
      mode: 'bass-pulse',
      beatShake: { enabled: false, intensity: 15, durationSec: 0.12, decay: 'medium', type: 'vertical', trigger: 'all-beats' },
      zoomPunch: { enabled: false, amount: 1.1, durationSec: 0.25, direction: 'in', recovery: 'normal', trigger: 'all-beats' },
      bassImpact: {
        enabled: true,
        sensitivity: 1.25,
        intensity: 45,
        attackSec: 0.03,
        releaseSec: 0.2,
        threshold: 0.25,
      },
      melodyMotion: { enabled: false, amount: 15, smoothness: 1.0, direction: 'forward', resetPerClip: true },
      beatFlash: { enabled: false, intensity: 15, durationSec: 0.1, color: 'cool-cyan', trigger: 'strong-beats-only' },
      chromaticAberration: { enabled: false, intensity: 15 },
      radialGlow: { enabled: false, intensity: 10 },
      vignettePulse: { enabled: true, intensity: 40 },
    },
  },
  {
    id: 'cinematic-melody',
    name: 'Cinematic Melody',
    tagline: 'Smooth Floating Motion',
    description: 'Graceful continuous camera drift and gentle warm radial glow following musical phrases.',
    mode: 'melody-flow',
    config: {
      mode: 'melody-flow',
      beatShake: { enabled: false, intensity: 10, durationSec: 0.2, decay: 'smooth', type: 'horizontal', trigger: 'strong-beats-only' },
      zoomPunch: { enabled: false, amount: 1.08, durationSec: 0.35, direction: 'in', recovery: 'slow', trigger: 'strong-beats-only' },
      bassImpact: { enabled: false, sensitivity: 0.8, intensity: 20, attackSec: 0.05, releaseSec: 0.25, threshold: 0.4 },
      melodyMotion: {
        enabled: true,
        amount: 32,
        smoothness: 1.2,
        direction: 'forward',
        resetPerClip: true,
      },
      beatFlash: { enabled: false, intensity: 15, durationSec: 0.15, color: 'warm-amber', trigger: 'strong-beats-only' },
      chromaticAberration: { enabled: false, intensity: 10 },
      radialGlow: { enabled: true, intensity: 30 },
      vignettePulse: { enabled: false, intensity: 15 },
    },
  },
  {
    id: 'high-energy-montage',
    name: 'High-Energy Montage',
    tagline: 'Aggressive Festival Impact',
    description: 'Dynamic combination of camera shake, zoom punch, bright beat flash, and chromatic twitch.',
    mode: 'balanced',
    config: {
      mode: 'balanced',
      beatShake: {
        enabled: true,
        intensity: 45,
        durationSec: 0.18,
        decay: 'sharp',
        type: 'combined',
        trigger: 'all-beats',
      },
      zoomPunch: {
        enabled: true,
        amount: 1.24,
        durationSec: 0.22,
        direction: 'in',
        recovery: 'fast',
        trigger: 'all-beats',
      },
      bassImpact: {
        enabled: true,
        sensitivity: 1.2,
        intensity: 35,
        attackSec: 0.03,
        releaseSec: 0.15,
        threshold: 0.3,
      },
      melodyMotion: { enabled: false, amount: 15, smoothness: 1.0, direction: 'forward', resetPerClip: true },
      beatFlash: {
        enabled: true,
        intensity: 40,
        durationSec: 0.15,
        color: 'neutral-white',
        trigger: 'strong-beats-only',
      },
      chromaticAberration: { enabled: true, intensity: 35 },
      radialGlow: { enabled: true, intensity: 20 },
      vignettePulse: { enabled: true, intensity: 35 },
    },
  },
  {
    id: 'slow-emotional-motion',
    name: 'Slow Emotional Motion',
    tagline: 'Gentle Breathe & Hold',
    description: 'Slow-recovery breathing zoom and warm amber radiance for ballads, piano, and emotional cuts.',
    mode: 'melody-flow',
    config: {
      mode: 'melody-flow',
      beatShake: { enabled: false, intensity: 8, durationSec: 0.25, decay: 'smooth', type: 'vertical', trigger: 'strong-beats-only' },
      zoomPunch: {
        enabled: true,
        amount: 1.09,
        durationSec: 0.45,
        direction: 'in',
        recovery: 'slow',
        trigger: 'strong-beats-only',
      },
      bassImpact: { enabled: false, sensitivity: 0.7, intensity: 15, attackSec: 0.08, releaseSec: 0.3, threshold: 0.45 },
      melodyMotion: {
        enabled: true,
        amount: 25,
        smoothness: 0.8,
        direction: 'alternating',
        resetPerClip: true,
      },
      beatFlash: { enabled: false, intensity: 15, durationSec: 0.2, color: 'warm-amber', trigger: 'strong-beats-only' },
      chromaticAberration: { enabled: false, intensity: 0 },
      radialGlow: { enabled: true, intensity: 25 },
      vignettePulse: { enabled: false, intensity: 10 },
    },
  },
  {
    id: 'glitch-beat',
    name: 'Glitch Beat',
    tagline: 'Digital Twitch & RGB Split',
    description: 'Sharp rotational jitter and prominent chromatic aberration spikes synced to percussion hits.',
    mode: 'beat-sync',
    config: {
      mode: 'beat-sync',
      beatShake: {
        enabled: true,
        intensity: 50,
        durationSec: 0.12,
        decay: 'sharp',
        type: 'rotational',
        trigger: 'all-beats',
      },
      zoomPunch: {
        enabled: true,
        amount: 1.15,
        durationSec: 0.15,
        direction: 'out',
        recovery: 'fast',
        trigger: 'all-beats',
      },
      bassImpact: { enabled: false, sensitivity: 1.0, intensity: 20, attackSec: 0.04, releaseSec: 0.15, threshold: 0.3 },
      melodyMotion: { enabled: false, amount: 10, smoothness: 1.0, direction: 'forward', resetPerClip: true },
      beatFlash: {
        enabled: true,
        intensity: 30,
        durationSec: 0.1,
        color: 'neon-pink',
        trigger: 'strong-beats-only',
      },
      chromaticAberration: { enabled: true, intensity: 55 },
      radialGlow: { enabled: false, intensity: 0 },
      vignettePulse: { enabled: true, intensity: 30 },
    },
  },
  {
    id: 'flash-zoom',
    name: 'Flash & Zoom',
    tagline: 'Bright Cinematic Downbeats',
    description: 'Clean bright light bursts and immediate scale punch focused strictly on primary downbeats.',
    mode: 'beat-sync',
    config: {
      mode: 'beat-sync',
      beatShake: { enabled: false, intensity: 15, durationSec: 0.12, decay: 'medium', type: 'combined', trigger: 'strong-beats-only' },
      zoomPunch: {
        enabled: true,
        amount: 1.2,
        durationSec: 0.25,
        direction: 'in',
        recovery: 'fast',
        trigger: 'strong-beats-only',
      },
      bassImpact: { enabled: false, sensitivity: 1.0, intensity: 25, attackSec: 0.04, releaseSec: 0.15, threshold: 0.3 },
      melodyMotion: { enabled: false, amount: 15, smoothness: 1.0, direction: 'forward', resetPerClip: true },
      beatFlash: {
        enabled: true,
        intensity: 50,
        durationSec: 0.16,
        color: 'neutral-white',
        trigger: 'strong-beats-only',
      },
      chromaticAberration: { enabled: false, intensity: 15 },
      radialGlow: { enabled: true, intensity: 15 },
      vignettePulse: { enabled: false, intensity: 15 },
    },
  },
  {
    id: 'clean-beat-sync',
    name: 'Clean Beat Sync',
    tagline: 'Minimalist Micro-Punch',
    description: 'Subtle and elegant scale bounce on downbeats without camera distortion or color shift.',
    mode: 'balanced',
    config: {
      mode: 'balanced',
      beatShake: { enabled: false, intensity: 10, durationSec: 0.1, decay: 'sharp', type: 'combined', trigger: 'strong-beats-only' },
      zoomPunch: {
        enabled: true,
        amount: 1.07,
        durationSec: 0.18,
        direction: 'in',
        recovery: 'normal',
        trigger: 'strong-beats-only',
      },
      bassImpact: { enabled: false, sensitivity: 0.9, intensity: 20, attackSec: 0.04, releaseSec: 0.12, threshold: 0.35 },
      melodyMotion: { enabled: false, amount: 10, smoothness: 1.0, direction: 'forward', resetPerClip: true },
      beatFlash: { enabled: false, intensity: 10, durationSec: 0.08, color: 'neutral-white', trigger: 'strong-beats-only' },
      chromaticAberration: { enabled: false, intensity: 0 },
      radialGlow: { enabled: false, intensity: 0 },
      vignettePulse: { enabled: false, intensity: 0 },
    },
  },
]

/**
 * Creates default MusicReactivityConfig, optionally hydrated by a preset.
 */
export function createReactivityConfig(presetId?: ReactivityPresetId): MusicReactivityConfig {
  const base: MusicReactivityConfig = {
    enabled: false,
    mode: 'balanced',
    scope: 'global',
    beatShake: {
      enabled: false,
      intensity: 25,
      durationSec: 0.15,
      decay: 'medium',
      type: 'combined',
      trigger: 'strong-beats-only',
    },
    zoomPunch: {
      enabled: false,
      amount: 1.15,
      durationSec: 0.2,
      direction: 'in',
      recovery: 'normal',
      trigger: 'strong-beats-only',
    },
    bassImpact: {
      enabled: false,
      sensitivity: 1.0,
      intensity: 30,
      attackSec: 0.04,
      releaseSec: 0.15,
      threshold: 0.3,
    },
    melodyMotion: {
      enabled: false,
      amount: 20,
      smoothness: 1.0,
      direction: 'forward',
      resetPerClip: true,
    },
    beatFlash: {
      enabled: false,
      intensity: 25,
      durationSec: 0.12,
      color: 'neutral-white',
      trigger: 'strong-beats-only',
    },
    chromaticAberration: {
      enabled: false,
      intensity: 25,
    },
    radialGlow: {
      enabled: false,
      intensity: 20,
    },
    vignettePulse: {
      enabled: false,
      intensity: 30,
    },
  }

  if (presetId) {
    const preset = REACTIVITY_PRESETS.find((p) => p.id === presetId)
    if (preset) {
      return {
        ...base,
        enabled: true,
        mode: preset.mode,
        ...preset.config,
      } as MusicReactivityConfig
    }
  }

  return base
}

/**
 * Deterministically compute the music-reactive visual state for a single frame.
 * Pure function: Given the exact same inputs, always returns the exact same numbers.
 */
export function computeMusicReactivityFrame(
  config: MusicReactivityConfig | null | undefined,
  playheadSec: number,
  relTimeSec: number,
  musicAnalysis: MusicAnalysisResult | null | undefined,
  canvasWidth: number,
  _canvasHeight: number
): MusicReactivityResult {
  const neutralResult: MusicReactivityResult = {
    deltaX: 0,
    deltaY: 0,
    deltaScale: 1.0,
    deltaRotationDeg: 0,
    flashAlpha: 0,
    flashColor: '#ffffff',
    chromaticOffsetPx: 0,
    radialGlowAlpha: 0,
    vignetteAlpha: 0,
    hasActiveReaction: false,
    activeMode: config?.mode || 'balanced',
  }

  if (!config || !config.enabled) {
    return neutralResult
  }

  let deltaX = 0
  let deltaY = 0
  let deltaScale = 1.0
  let deltaRotationDeg = 0
  let flashAlpha = 0
  let flashColor = '#ffffff'
  let chromaticOffsetPx = 0
  let radialGlowAlpha = 0
  let vignetteAlpha = 0
  let hasActiveReaction = false

  // Determine beat source timestamps
  const hasAnalysis = !!musicAnalysis && musicAnalysis.beats.length > 0
  const allBeats = hasAnalysis ? musicAnalysis.beats : generateSyntheticBeats(playheadSec, 120)
  const strongBeats =
    hasAnalysis && musicAnalysis.downbeats.length > 0
      ? musicAnalysis.downbeats
      : hasAnalysis
      ? musicAnalysis.beats.filter((_, i) => i % 4 === 0)
      : generateSyntheticBeats(playheadSec, 30) // 1 downbeat per 2 seconds

  // 1. BEAT SHAKE
  if (config.beatShake.enabled && config.beatShake.intensity > 0) {
    const candidateBeats = config.beatShake.trigger === 'strong-beats-only' ? strongBeats : allBeats
    const lastBeat = findPrecedingTimestamp(candidateBeats, playheadSec)
    if (lastBeat !== null) {
      const dt = playheadSec - lastBeat
      const duration = Math.max(0.04, config.beatShake.durationSec)
      if (dt >= 0 && dt <= duration) {
        hasActiveReaction = true
        const p = dt / duration
        const decay = evaluateDecay(config.beatShake.decay, p)
        const intensityFactor = (config.beatShake.intensity / 100) * (canvasWidth * 0.018)

        // Multi-frequency damped sine oscillation (~40-60 Hz)
        const shakePhase = dt * 52
        const sX = Math.sin(shakePhase) * decay * intensityFactor
        const sY = Math.cos(shakePhase * 1.15) * decay * intensityFactor
        const sRot = Math.sin(shakePhase * 0.75) * decay * (config.beatShake.intensity / 100) * 2.8

        switch (config.beatShake.type) {
          case 'horizontal':
            deltaX += sX
            break
          case 'vertical':
            deltaY += sY
            break
          case 'rotational':
            deltaRotationDeg += sRot
            break
          case 'combined':
          default:
            deltaX += sX * 0.8
            deltaY += sY * 0.8
            deltaRotationDeg += sRot * 0.7
            break
        }
      }
    }
  }

  // 2. BEAT ZOOM PUNCH
  if (config.zoomPunch.enabled && config.zoomPunch.amount > 1.0) {
    const candidateBeats = config.zoomPunch.trigger === 'strong-beats-only' ? strongBeats : allBeats
    const lastBeat = findPrecedingTimestamp(candidateBeats, playheadSec)
    if (lastBeat !== null) {
      const dt = playheadSec - lastBeat
      const duration = Math.max(0.05, config.zoomPunch.durationSec)
      if (dt >= 0 && dt <= duration) {
        hasActiveReaction = true
        const p = dt / duration
        const decay =
          config.zoomPunch.recovery === 'fast'
            ? Math.pow(1 - p, 3)
            : config.zoomPunch.recovery === 'slow'
            ? Math.pow(1 - p, 1.2)
            : Math.pow(1 - p, 2)

        const maxExtra = config.zoomPunch.amount - 1.0
        if (config.zoomPunch.direction === 'in') {
          deltaScale *= 1.0 + maxExtra * decay
        } else {
          // Punch out (shrink) then return to 1.0
          deltaScale *= Math.max(0.5, 1.0 - (maxExtra / config.zoomPunch.amount) * decay)
        }
      }
    }
  }

  // 3. BASS IMPACT
  if (config.bassImpact.enabled && config.bassImpact.intensity > 0) {
    let bassLevel = 0
    if (musicAnalysis?.bassEnvelope && musicAnalysis.bassEnvelope.length > 0) {
      const frameIdx = Math.min(
        musicAnalysis.bassEnvelope.length - 1,
        Math.max(0, Math.floor(playheadSec * 20))
      )
      bassLevel = musicAnalysis.bassEnvelope[frameIdx] || 0
    } else {
      // Synthetic low-frequency pulse at 120 BPM
      bassLevel = 0.5 + 0.5 * Math.sin(playheadSec * Math.PI * 4)
    }

    const threshold = config.bassImpact.threshold
    if (bassLevel > threshold) {
      hasActiveReaction = true
      const excess = (bassLevel - threshold) / Math.max(0.01, 1 - threshold)
      const impactFactor =
        excess * (config.bassImpact.intensity / 100) * 0.16 * config.bassImpact.sensitivity
      deltaScale *= 1.0 + impactFactor
      deltaY += impactFactor * 12
    }
  }

  // 4. MELODY MOTION
  if (config.melodyMotion.enabled && config.melodyMotion.amount > 0) {
    hasActiveReaction = true
    const t = config.melodyMotion.resetPerClip ? relTimeSec : playheadSec
    const speed = 0.65 * config.melodyMotion.smoothness
    const dir = config.melodyMotion.direction === 'reverse' ? -1 : 1
    const amp = (config.melodyMotion.amount / 100) * (canvasWidth * 0.02)

    deltaX += Math.sin(t * speed * dir) * amp
    deltaY += Math.cos(t * speed * 0.8 * dir) * (amp * 0.5)
    deltaRotationDeg += Math.sin(t * speed * 0.5 * dir) * (config.melodyMotion.amount / 100) * 1.5
    deltaScale *= 1.0 + Math.sin(t * speed * 0.35) * (config.melodyMotion.amount / 100) * 0.035
  }

  // 5. BEAT FLASH
  if (config.beatFlash.enabled && config.beatFlash.intensity > 0) {
    const candidateBeats = config.beatFlash.trigger === 'strong-beats-only' ? strongBeats : allBeats
    const lastBeat = findPrecedingTimestamp(candidateBeats, playheadSec)
    if (lastBeat !== null) {
      const dt = playheadSec - lastBeat
      const duration = Math.max(0.04, config.beatFlash.durationSec)
      if (dt >= 0 && dt <= duration) {
        hasActiveReaction = true
        const p = dt / duration
        const decay = Math.pow(1 - p, 2)
        flashAlpha = (config.beatFlash.intensity / 100) * 0.75 * decay
        flashColor = getFlashColorCode(config.beatFlash.color)
      }
    }
  }

  // 6. CHROMATIC ABERRATION
  if (config.chromaticAberration.enabled && config.chromaticAberration.intensity > 0) {
    const lastBeat = findPrecedingTimestamp(allBeats, playheadSec)
    if (lastBeat !== null) {
      const dt = playheadSec - lastBeat
      const duration = 0.2
      if (dt >= 0 && dt <= duration) {
        const decay = Math.pow(1 - dt / duration, 2)
        chromaticOffsetPx = (config.chromaticAberration.intensity / 100) * 22 * decay
        if (chromaticOffsetPx > 0.5) hasActiveReaction = true
      }
    }
  }

  // 7. RADIAL GLOW
  if (config.radialGlow.enabled && config.radialGlow.intensity > 0) {
    hasActiveReaction = true
    const energy = musicAnalysis ? getEnergyAtTime(musicAnalysis, playheadSec) : 0.6
    radialGlowAlpha = (config.radialGlow.intensity / 100) * 0.45 * (0.6 + 0.4 * energy)
  }

  // 8. VIGNETTE PULSE
  if (config.vignettePulse.enabled && config.vignettePulse.intensity > 0) {
    const lastBeat = findPrecedingTimestamp(allBeats, playheadSec)
    let beatDecay = 0
    if (lastBeat !== null) {
      const dt = playheadSec - lastBeat
      if (dt >= 0 && dt <= 0.25) {
        beatDecay = Math.pow(1 - dt / 0.25, 2)
      }
    }
    const baseEnergy = musicAnalysis ? getEnergyAtTime(musicAnalysis, playheadSec) : 0.5
    vignetteAlpha = (config.vignettePulse.intensity / 100) * 0.55 * (0.3 * baseEnergy + 0.7 * beatDecay)
    if (vignetteAlpha > 0.05) hasActiveReaction = true
  }

  return {
    deltaX,
    deltaY,
    deltaScale,
    deltaRotationDeg,
    flashAlpha,
    flashColor,
    chromaticOffsetPx,
    radialGlowAlpha,
    vignetteAlpha,
    hasActiveReaction,
    activeMode: config.mode,
  }
}

/**
 * Binary search to find the closest preceding timestamp in a sorted array.
 */
export function findPrecedingTimestamp(timestamps: number[], targetSec: number): number | null {
  if (timestamps.length === 0 || targetSec < timestamps[0]) return null
  let low = 0
  let high = timestamps.length - 1
  let best = timestamps[0]

  while (low <= high) {
    const mid = (low + high) >> 1
    const val = timestamps[mid]
    if (val <= targetSec) {
      best = val
      low = mid + 1
    } else {
      high = mid - 1
    }
  }

  return best
}

/**
 * Generate synthetic beat markers if no audio is analyzed yet.
 */
function generateSyntheticBeats(playheadSec: number, bpm: number): number[] {
  const interval = 60 / bpm
  const countBefore = 6
  const countAfter = 2
  const currentIdx = Math.floor(playheadSec / interval)
  const result: number[] = []

  for (let i = Math.max(0, currentIdx - countBefore); i <= currentIdx + countAfter; i++) {
    result.push(Number((i * interval).toFixed(3)))
  }

  return result
}

function evaluateDecay(decayType: 'sharp' | 'medium' | 'smooth', progress: number): number {
  const p = Math.max(0, Math.min(1, progress))
  switch (decayType) {
    case 'sharp':
      return Math.pow(1 - p, 3)
    case 'smooth':
      return 0.5 * (1 + Math.cos(Math.PI * p))
    case 'medium':
    default:
      return Math.pow(1 - p, 2)
  }
}

function getFlashColorCode(color: string): string {
  switch (color) {
    case 'warm-amber':
      return 'rgba(255, 200, 110,'
    case 'cool-cyan':
      return 'rgba(0, 240, 255,'
    case 'neon-pink':
      return 'rgba(255, 45, 160,'
    case 'neutral-white':
    default:
      return 'rgba(255, 255, 255,'
  }
}

function getEnergyAtTime(analysis: MusicAnalysisResult, timeSec: number): number {
  if (!analysis.energyEnvelope || analysis.energyEnvelope.length === 0) return 0.5
  const idx = Math.min(
    analysis.energyEnvelope.length - 1,
    Math.max(0, Math.floor(timeSec * 20))
  )
  return analysis.energyEnvelope[idx] || 0.5
}

/**
 * Renders procedural overlays (beat flash, radial glow, vignette pulse) on top of the composition.
 */
export function renderReactivityOverlays(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  reactivity: MusicReactivityResult
): void {
  // 1. Beat Flash Overlay
  if (reactivity.flashAlpha > 0.005) {
    ctx.save()
    ctx.fillStyle = `${reactivity.flashColor}${reactivity.flashAlpha.toFixed(3)})`
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  }

  // 2. Radial Glow Overlay
  if (reactivity.radialGlowAlpha > 0.005) {
    ctx.save()
    const cx = width / 2
    const cy = height / 2
    const radius = Math.max(width, height) * 0.65
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
    gradient.addColorStop(0, `rgba(0, 240, 255, ${(reactivity.radialGlowAlpha * 0.35).toFixed(3)})`)
    gradient.addColorStop(0.5, `rgba(168, 85, 247, ${(reactivity.radialGlowAlpha * 0.15).toFixed(3)})`)
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.globalCompositeOperation = 'screen'
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  }

  // 3. Vignette Pulse Overlay
  if (reactivity.vignetteAlpha > 0.005) {
    ctx.save()
    const cx = width / 2
    const cy = height / 2
    const radius = Math.max(width, height) * 0.72
    const gradient = ctx.createRadialGradient(cx, cy, radius * 0.35, cx, cy, radius)
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
    gradient.addColorStop(1, `rgba(0, 0, 0, ${reactivity.vignetteAlpha.toFixed(3)})`)

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  }
}
