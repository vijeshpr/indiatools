/**
 * IndiaTools — Floating Photo Universe
 * Curated Cinematic Presets
 */

import {
  PhotoUniverseStudioConfig,
  DEFAULT_PHOTO_UNIVERSE_CONFIG,
} from './photoUniverseTypes.ts'

export interface UniversePreset {
  id: string
  name: string
  subtitle: string
  description: string
  accentColor: string
  iconName: string
  config: Partial<PhotoUniverseStudioConfig>
}

export const UNIVERSE_PRESETS: UniversePreset[] = [
  {
    id: 'cosmic-gallery',
    name: 'Cosmic Gallery',
    subtitle: 'Vast Atmospheric Space',
    description: 'Cinematic sweeping curves through deep space with luminous blue rim highlights and smooth focus pulls.',
    accentColor: '#00F0FF',
    iconName: 'Sparkles',
    config: {
      cameraStyle: 'smooth-cinematic',
      cameraSpeed: 1.0,
      photoFocusDuration: 3.5,
      transitionSmoothness: 85,
      depthOfField: 'cinematic',
      spaceSpread: 110,
      visualDetails: {
        ...DEFAULT_PHOTO_UNIVERSE_CONFIG.visualDetails,
        spaceTheme: 'deep-cosmos',
        edgeGlowColor: '#00F0FF',
        particlesEnabled: true,
        particleIntensity: 60,
      },
      bassShake: {
        ...DEFAULT_PHOTO_UNIVERSE_CONFIG.bassShake,
        enabled: true,
        shakeIntensity: 40,
      },
    },
  },
  {
    id: 'rhythmic-beat-odyssey',
    name: 'Rhythmic Beat Odyssey',
    subtitle: 'Punchy Beat-Timed Flight',
    description: 'Dynamic banking camera turns and bass-reactive acceleration designed for energetic rhythm and pop tracks.',
    accentColor: '#FF007F',
    iconName: 'Zap',
    config: {
      cameraStyle: 'rhythmic-flight',
      cameraSpeed: 1.3,
      photoFocusDuration: 2.4,
      transitionSmoothness: 70,
      depthOfField: 'cinematic',
      spaceSpread: 95,
      visualDetails: {
        ...DEFAULT_PHOTO_UNIVERSE_CONFIG.visualDetails,
        spaceTheme: 'electric-neon',
        edgeGlowColor: '#FF007F',
        lightStreaksEnabled: true,
        particlesEnabled: true,
        particleIntensity: 75,
      },
      bassShake: {
        ...DEFAULT_PHOTO_UNIVERSE_CONFIG.bassShake,
        enabled: true,
        shakeIntensity: 65,
        bassSensitivity: 70,
      },
    },
  },
  {
    id: 'dreamy-memory-drift',
    name: 'Dreamy Memory Drift',
    subtitle: 'Golden Hour Floating Memories',
    description: 'Slow, ethereal drifting motion with warm amber ambient tones, gentle vertical breathing, and soft floating stardust.',
    accentColor: '#F59E0B',
    iconName: 'Flame',
    config: {
      cameraStyle: 'slow-dream',
      cameraSpeed: 0.75,
      photoFocusDuration: 4.5,
      transitionSmoothness: 95,
      depthOfField: 'strong',
      spaceSpread: 125,
      visualDetails: {
        ...DEFAULT_PHOTO_UNIVERSE_CONFIG.visualDetails,
        spaceTheme: 'warm-amber',
        edgeGlowColor: '#FBBF24',
        particlesEnabled: true,
        particleIntensity: 50,
      },
      bassShake: {
        ...DEFAULT_PHOTO_UNIVERSE_CONFIG.bassShake,
        enabled: false,
      },
    },
  },
  {
    id: 'kinetic-helix-orbit',
    name: 'Kinetic Helix Orbit',
    subtitle: '3D Spiral Camera Arcs',
    description: 'Curved orbital fly-bys revealing true dimensional depth and photograph orientation with energetic transitions.',
    accentColor: '#A855F7',
    iconName: 'Activity',
    config: {
      cameraStyle: 'energetic-orbit',
      cameraSpeed: 1.15,
      photoFocusDuration: 2.8,
      transitionSmoothness: 75,
      depthOfField: 'cinematic',
      spaceSpread: 100,
      visualDetails: {
        ...DEFAULT_PHOTO_UNIVERSE_CONFIG.visualDetails,
        spaceTheme: 'deep-cosmos',
        edgeGlowColor: '#A855F7',
        lightStreaksEnabled: true,
      },
      bassShake: {
        ...DEFAULT_PHOTO_UNIVERSE_CONFIG.bassShake,
        enabled: true,
        shakeIntensity: 50,
      },
    },
  },
  {
    id: 'clean-minimalist-showcase',
    name: 'Clean Minimalist Showcase',
    subtitle: 'Pure Photography Focus',
    description: 'Subtle, modern art-gallery flight on a deep dark canvas with neutral borders and distraction-free viewing.',
    accentColor: '#10B981',
    iconName: 'Camera',
    config: {
      cameraStyle: 'smooth-cinematic',
      cameraSpeed: 0.9,
      photoFocusDuration: 3.8,
      transitionSmoothness: 90,
      depthOfField: 'subtle',
      spaceSpread: 110,
      visualDetails: {
        ...DEFAULT_PHOTO_UNIVERSE_CONFIG.visualDetails,
        spaceTheme: 'midnight-abyss',
        edgeGlowColor: '#FFFFFF',
        particlesEnabled: false,
        lightStreaksEnabled: false,
      },
      bassShake: {
        ...DEFAULT_PHOTO_UNIVERSE_CONFIG.bassShake,
        enabled: false,
      },
    },
  },
]

export function applyUniversePreset(
  current: PhotoUniverseStudioConfig,
  presetId: string
): PhotoUniverseStudioConfig {
  const found = UNIVERSE_PRESETS.find((p) => p.id === presetId)
  if (!found) return current

  return {
    ...current,
    ...found.config,
    // Preserve user photos and manual orders
    photos: current.photos,
    manualOrder: current.manualOrder,
    enabled: current.enabled,
    visualDetails: {
      ...current.visualDetails,
      ...(found.config.visualDetails || {}),
    },
    bassShake: {
      ...current.bassShake,
      ...(found.config.bassShake || {}),
    },
  }
}
