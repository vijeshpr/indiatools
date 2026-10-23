/**
 * IndiaTools — Neon Energy / Electric Glow Presets
 * Curated cinematic visualizer styles
 */

import {
  DEFAULT_NEON_ENERGY_CONFIG,
  type NeonEnergyStudioConfig,
} from './neonEnergyTypes.ts'

export interface NeonPreset {
  id: string
  name: string
  description: string
  icon: string
  config: Partial<NeonEnergyStudioConfig>
}

export const NEON_PRESETS: NeonPreset[] = [
  {
    id: 'cyber-rainbow',
    name: 'Cyberpunk Rainbow',
    description: 'Multicoloured Cyan, Magenta, Yellow & Lime electric aura',
    icon: '🌈',
    config: {
      glow: {
        theme: 'cyber-rainbow',
        glowIntensity: 85,
        auraRadius: 52,
        innerGlowIntensity: 75,
        hueCyclingEnabled: true,
        hueCycleSpeed: 0.9,
      },
      audio: {
        bassSensitivity: 1.25,
        bumpStrength: 1.16,
        decaySpeed: 0.14,
        midFreqPulseEnabled: true,
        midFreqPulseIntensity: 70,
      },
      reflection: {
        enabled: true,
        opacity: 60,
        blurPx: 4,
        floorHorizonY: 66,
        reflectionFalloff: 75,
        floorGridEnabled: true,
      },
      backgroundStyle: 'dark-navy-slate',
    },
  },
  {
    id: 'electric-cyan',
    name: 'Electric Azure',
    description: 'Ultra-bright high-voltage cyan glow on deep navy floor',
    icon: '⚡',
    config: {
      glow: {
        theme: 'electric-cyan',
        glowIntensity: 90,
        auraRadius: 50,
        innerGlowIntensity: 80,
        hueCyclingEnabled: false,
        hueCycleSpeed: 0.5,
      },
      audio: {
        bassSensitivity: 1.2,
        bumpStrength: 1.15,
        decaySpeed: 0.13,
        midFreqPulseEnabled: true,
        midFreqPulseIntensity: 60,
      },
      reflection: {
        enabled: true,
        opacity: 65,
        blurPx: 3,
        floorHorizonY: 65,
        reflectionFalloff: 70,
        floorGridEnabled: true,
      },
      backgroundStyle: 'dark-navy-slate',
    },
  },
  {
    id: 'hot-magenta',
    name: 'Hot Pink Club',
    description: 'Vibrant hot magenta neon glow with deep charcoal horizon',
    icon: '💖',
    config: {
      glow: {
        theme: 'hot-magenta',
        glowIntensity: 85,
        auraRadius: 46,
        innerGlowIntensity: 75,
        hueCyclingEnabled: false,
        hueCycleSpeed: 0.6,
      },
      audio: {
        bassSensitivity: 1.3,
        bumpStrength: 1.18,
        decaySpeed: 0.15,
        midFreqPulseEnabled: true,
        midFreqPulseIntensity: 65,
      },
      reflection: {
        enabled: true,
        opacity: 55,
        blurPx: 5,
        floorHorizonY: 67,
        reflectionFalloff: 75,
        floorGridEnabled: true,
      },
      backgroundStyle: 'charcoal-abyss',
    },
  },
  {
    id: 'acid-lime',
    name: 'Acid Lime Synth',
    description: 'High-energy chartreuse & electric green radioactive punch',
    icon: '🔋',
    config: {
      glow: {
        theme: 'acid-lime',
        glowIntensity: 90,
        auraRadius: 48,
        innerGlowIntensity: 80,
        hueCyclingEnabled: false,
        hueCycleSpeed: 0.7,
      },
      audio: {
        bassSensitivity: 1.2,
        bumpStrength: 1.15,
        decaySpeed: 0.14,
        midFreqPulseEnabled: true,
        midFreqPulseIntensity: 70,
      },
      reflection: {
        enabled: true,
        opacity: 50,
        blurPx: 4,
        floorHorizonY: 66,
        reflectionFalloff: 70,
        floorGridEnabled: true,
      },
      backgroundStyle: 'cyber-dark',
    },
  },
  {
    id: 'electric-gold',
    name: 'Golden Luxury Neon',
    description: 'Warm amber and liquid gold luminescence with glossy reflection',
    icon: '👑',
    config: {
      glow: {
        theme: 'electric-gold',
        glowIntensity: 80,
        auraRadius: 44,
        innerGlowIntensity: 70,
        hueCyclingEnabled: false,
        hueCycleSpeed: 0.4,
      },
      audio: {
        bassSensitivity: 1.1,
        bumpStrength: 1.12,
        decaySpeed: 0.12,
        midFreqPulseEnabled: true,
        midFreqPulseIntensity: 50,
      },
      reflection: {
        enabled: true,
        opacity: 60,
        blurPx: 4,
        floorHorizonY: 66,
        reflectionFalloff: 80,
        floorGridEnabled: true,
      },
      backgroundStyle: 'midnight-studio',
    },
  },
  {
    id: 'tokyo-midnight',
    name: 'Tokyo Midnight',
    description: 'Violet, magenta, and cyan dreamy drift with subtle floor sheen',
    icon: '🌆',
    config: {
      glow: {
        theme: 'tokyo-midnight',
        glowIntensity: 85,
        auraRadius: 54,
        innerGlowIntensity: 75,
        hueCyclingEnabled: true,
        hueCycleSpeed: 0.6,
      },
      audio: {
        bassSensitivity: 1.2,
        bumpStrength: 1.14,
        decaySpeed: 0.13,
        midFreqPulseEnabled: true,
        midFreqPulseIntensity: 65,
      },
      reflection: {
        enabled: true,
        opacity: 55,
        blurPx: 5,
        floorHorizonY: 67,
        reflectionFalloff: 75,
        floorGridEnabled: true,
      },
      backgroundStyle: 'dark-navy-slate',
    },
  },
  {
    id: 'minimal-tube',
    name: 'Pure White Tube',
    description: 'Crisp white central neon tube with subtle electric blue halo',
    icon: '💡',
    config: {
      glow: {
        theme: 'electric-cyan',
        glowIntensity: 65,
        auraRadius: 36,
        innerGlowIntensity: 60,
        hueCyclingEnabled: false,
        hueCycleSpeed: 0.3,
      },
      audio: {
        bassSensitivity: 1.0,
        bumpStrength: 1.10,
        decaySpeed: 0.16,
        midFreqPulseEnabled: false,
        midFreqPulseIntensity: 40,
      },
      reflection: {
        enabled: true,
        opacity: 40,
        blurPx: 3,
        floorHorizonY: 66,
        reflectionFalloff: 65,
        floorGridEnabled: false,
      },
      backgroundStyle: 'charcoal-abyss',
    },
  },
  {
    id: 'bass-overdrive',
    name: 'Bassline Overdrive',
    description: 'Maximum bass kick responsiveness with dramatic scale punch',
    icon: '🔥',
    config: {
      glow: {
        theme: 'cyber-rainbow',
        glowIntensity: 95,
        auraRadius: 60,
        innerGlowIntensity: 85,
        hueCyclingEnabled: true,
        hueCycleSpeed: 1.2,
      },
      audio: {
        bassSensitivity: 1.6,
        bumpStrength: 1.25,
        decaySpeed: 0.18,
        midFreqPulseEnabled: true,
        midFreqPulseIntensity: 85,
      },
      reflection: {
        enabled: true,
        opacity: 75,
        blurPx: 5,
        floorHorizonY: 66,
        reflectionFalloff: 85,
        floorGridEnabled: true,
      },
      backgroundStyle: 'cyber-dark',
    },
  },
]

export function applyNeonPreset(
  current: NeonEnergyStudioConfig,
  presetId: string
): NeonEnergyStudioConfig {
  const found = NEON_PRESETS.find((p) => p.id === presetId)
  if (!found) return current

  return {
    ...current,
    ...found.config,
    audio: {
      ...current.audio,
      ...(found.config.audio || {}),
    },
    glow: {
      ...current.glow,
      ...(found.config.glow || {}),
    },
    reflection: {
      ...current.reflection,
      ...(found.config.reflection || {}),
    },
  }
}
