/**
 * IndiaTools — Memory Burst Studio Presets
 * Curated cinematic rhythm and transition presets
 */

import { MemoryBurstStudioConfig, DEFAULT_MEMORY_BURST_CONFIG } from './memoryBurstTypes.ts'

export interface MemoryBurstPreset {
  id: string
  name: string
  description: string
  icon: string
  config: Partial<MemoryBurstStudioConfig>
}

export const MEMORY_BURST_PRESETS: MemoryBurstPreset[] = [
  {
    id: 'memory-rewind-climax',
    name: 'Memory Rewind',
    description: 'BKU-inspired viral climax memory montage with accelerating cuts & flashback rewind.',
    icon: '⏪',
    config: {
      mode: 'memory-rewind',
      transitionStyle: 'scale-punch',
      transitionDurationSec: 0.15,
      scalePunch: { enabled: true, startScale: 1.07, intensity: 75 },
      bassShake: { enabled: false, intensity: 25, bassSensitivity: 40, maxDisplacementPx: 6 },
      flash: { enabled: true, type: 'white', opacity: 0.28, durationSec: 0.1 },
      climax: {
        enabled: true,
        startSec: 10.0,
        endSec: 20.0,
        burstDurationSec: 8.0,
        cutSpeedMultiplier: 1.2,
        photoOrder: 'reverse',
        zoomPunchEnabled: true,
        flashEnabled: true,
        fadeWipeEnabled: false,
        crossfadeEnabled: false,
        accelerationEnabled: true,
        accelerationStrength: 3,
        startHoldSec: 2.0,
        endingHoldEnabled: true,
        endHoldSec: 3.0,
      },
    },
  },
  {
    id: 'pure-neutral',
    name: 'Pure Neutral',
    description: 'Clean instant photo cutting on beats without decorative flashes or shakes.',
    icon: '✨',
    config: {
      mode: 'beat-sync',
      transitionStyle: 'instant-cut',
      transitionDurationSec: 0.1,
      scalePunch: { enabled: false, startScale: 1.05, intensity: 50 },
      bassShake: { enabled: false, intensity: 40, bassSensitivity: 60, maxDisplacementPx: 10 },
      flash: { enabled: false, type: 'white', opacity: 0.2, durationSec: 0.1 },
    },
  },
  {
    id: 'kinetic-memory-rush',
    name: 'Kinetic Rush',
    description: 'Energetic rhythm cuts with 105% punch zoom and subtle white flash.',
    icon: '⚡',
    config: {
      mode: 'beat-sync',
      transitionStyle: 'scale-punch',
      transitionDurationSec: 0.2,
      scalePunch: { enabled: true, startScale: 1.06, intensity: 70 },
      bassShake: { enabled: false, intensity: 30, bassSensitivity: 50, maxDisplacementPx: 8 },
      flash: { enabled: true, type: 'white', opacity: 0.2, durationSec: 0.12 },
    },
  },
  {
    id: 'nostalgic-film-burn',
    name: 'Nostalgic Film',
    description: 'Warm atmospheric crossfades with warm-toned film glow every 2 beats.',
    icon: '🎞️',
    config: {
      mode: 'every-2-beats',
      transitionStyle: 'film-burn',
      transitionDurationSec: 0.35,
      scalePunch: { enabled: false, startScale: 1.03, intensity: 35 },
      bassShake: { enabled: false, intensity: 20, bassSensitivity: 40, maxDisplacementPx: 6 },
      flash: { enabled: true, type: 'warm', opacity: 0.28, durationSec: 0.18 },
    },
  },
  {
    id: 'heavy-bass-strobe',
    name: 'Heavy Bass Strobe',
    description: 'High-impact bass reactive micro-shakes and synchronized strobe flashes.',
    icon: '💥',
    config: {
      mode: 'beat-sync',
      transitionStyle: 'instant-cut',
      transitionDurationSec: 0.15,
      scalePunch: { enabled: true, startScale: 1.08, intensity: 85 },
      bassShake: { enabled: true, intensity: 65, bassSensitivity: 75, maxDisplacementPx: 14 },
      flash: { enabled: true, type: 'white', opacity: 0.35, durationSec: 0.1 },
    },
  },
  {
    id: 'chill-mood-slide',
    name: 'Chill Mood Slide',
    description: 'Relaxed directional whip pan transitions timed to gentle rhythm bars.',
    icon: '🌊',
    config: {
      mode: 'auto-rhythm',
      transitionStyle: 'whip-pan',
      transitionDurationSec: 0.4,
      scalePunch: { enabled: true, startScale: 1.03, intensity: 30 },
      bassShake: { enabled: false, intensity: 20, bassSensitivity: 35, maxDisplacementPx: 5 },
      flash: { enabled: false, type: 'white', opacity: 0.15, durationSec: 0.1 },
    },
  },
  {
    id: 'rapid-burst-pulse',
    name: 'Rapid Burst Pulse',
    description: 'Ultra-fast memory cuts and glitch transitions across quick musical intervals.',
    icon: '🔥',
    config: {
      mode: 'fast-cut',
      transitionStyle: 'glitch-split',
      transitionDurationSec: 0.18,
      minCutIntervalSec: 0.18,
      scalePunch: { enabled: true, startScale: 1.07, intensity: 75 },
      bassShake: { enabled: false, intensity: 35, bassSensitivity: 50, maxDisplacementPx: 8 },
      flash: { enabled: true, type: 'white', opacity: 0.25, durationSec: 0.08 },
    },
  },
]

export function applyMemoryBurstPreset(
  currentConfig: MemoryBurstStudioConfig,
  presetId: string
): MemoryBurstStudioConfig {
  const preset = MEMORY_BURST_PRESETS.find((p) => p.id === presetId)
  if (!preset) return currentConfig

  return {
    ...currentConfig,
    ...preset.config,
    scalePunch: {
      ...currentConfig.scalePunch,
      ...(preset.config.scalePunch || {}),
    },
    bassShake: {
      ...currentConfig.bassShake,
      ...(preset.config.bassShake || {}),
    },
    flash: {
      ...currentConfig.flash,
      ...(preset.config.flash || {}),
    },
    rhythmZoom: {
      ...currentConfig.rhythmZoom,
      ...(preset.config.rhythmZoom || {}),
    },
    climax: {
      ...currentConfig.climax,
      ...(preset.config.climax || {}),
    },
  }
}
