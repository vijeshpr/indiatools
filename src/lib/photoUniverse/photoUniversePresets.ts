/**
 * IndiaTools — Floating Photo Universe
 * Curated Cinematic Presets
 */

import {
  PhotoUniverseStudioConfig,
  DEFAULT_PHOTO_UNIVERSE_CONFIG,
  DEFAULT_UNIVERSE_BACKGROUND,
  DEFAULT_UNIVERSE_BASS_SHAKE,
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
      motionPreset: 'dream-cinema',
      cameraStyle: 'smooth-cinematic',
      cameraSpeed: 0.85,
      photoFocusDuration: 4.0,
      photoMotion: 'static',
      enableRotation: false,
      transitionSmoothness: 85,
      depthOfField: 'cinematic',
      spaceSpread: 110,
      background: {
        ...DEFAULT_UNIVERSE_BACKGROUND,
        type: 'deep-space',
        galaxyTint: 'cosmic-blue',
        starCount: 2200,
        nebulaGlow: 50,
      },
      visualDetails: {
        ...DEFAULT_PHOTO_UNIVERSE_CONFIG.visualDetails,
        spaceTheme: 'deep-cosmos',
        edgeGlowColor: '#00F0FF',
        particlesEnabled: true,
        particleIntensity: 45,
      },
      bassShake: {
        ...DEFAULT_UNIVERSE_BASS_SHAKE,
        enabled: true,
        level: 'subtle',
        shakeIntensity: 25,
        bassSensitivity: 45,
      },
    },
  },
  {
    id: 'rhythmic-beat-odyssey',
    name: 'Rhythmic Beat Odyssey',
    subtitle: 'Punchy Beat-Timed Flight',
    description: 'Dynamic banking camera turns and controlled rhythm acceleration designed for energetic rhythm and pop tracks.',
    accentColor: '#FF007F',
    iconName: 'Zap',
    config: {
      motionPreset: 'energetic-flight',
      cameraStyle: 'rhythmic-flight',
      cameraSpeed: 1.15,
      photoFocusDuration: 2.8,
      photoMotion: 'static',
      enableRotation: false,
      transitionSmoothness: 75,
      depthOfField: 'cinematic',
      spaceSpread: 100,
      background: {
        ...DEFAULT_UNIVERSE_BACKGROUND,
        type: 'nebula-galaxy',
        galaxyTint: 'mystic-violet',
        starCount: 2600,
        nebulaGlow: 65,
      },
      visualDetails: {
        ...DEFAULT_PHOTO_UNIVERSE_CONFIG.visualDetails,
        spaceTheme: 'electric-neon',
        edgeGlowColor: '#FF007F',
        lightStreaksEnabled: true,
        particlesEnabled: true,
        particleIntensity: 65,
      },
      bassShake: {
        ...DEFAULT_UNIVERSE_BASS_SHAKE,
        enabled: true,
        level: 'balanced',
        shakeIntensity: 50,
        bassSensitivity: 60,
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
      motionPreset: 'dream-cinema',
      cameraStyle: 'slow-dream',
      cameraSpeed: 0.72,
      photoFocusDuration: 4.8,
      photoMotion: 'static',
      enableRotation: false,
      transitionSmoothness: 92,
      depthOfField: 'strong',
      spaceSpread: 125,
      background: {
        ...DEFAULT_UNIVERSE_BACKGROUND,
        type: 'deep-space',
        galaxyTint: 'amber-nebula',
        starCount: 1900,
        nebulaGlow: 55,
      },
      visualDetails: {
        ...DEFAULT_PHOTO_UNIVERSE_CONFIG.visualDetails,
        spaceTheme: 'warm-amber',
        edgeGlowColor: '#FBBF24',
        particlesEnabled: true,
        particleIntensity: 40,
      },
      bassShake: {
        ...DEFAULT_UNIVERSE_BASS_SHAKE,
        enabled: false,
        level: 'off',
        shakeIntensity: 0,
      },
    },
  },
  {
    id: 'kinetic-helix-orbit',
    name: 'Kinetic Helix Orbit',
    subtitle: '3D Balanced Video Arcs',
    description: 'Curved orbital fly-bys revealing true dimensional depth and photograph orientation with elegant transitions.',
    accentColor: '#A855F7',
    iconName: 'Activity',
    config: {
      motionPreset: 'balanced-music-video',
      cameraStyle: 'energetic-orbit',
      cameraSpeed: 0.95,
      photoFocusDuration: 3.2,
      photoMotion: 'static',
      enableRotation: false,
      transitionSmoothness: 80,
      depthOfField: 'cinematic',
      spaceSpread: 105,
      background: {
        ...DEFAULT_UNIVERSE_BACKGROUND,
        type: 'deep-space',
        galaxyTint: 'mystic-violet',
        starCount: 2200,
        nebulaGlow: 45,
      },
      visualDetails: {
        ...DEFAULT_PHOTO_UNIVERSE_CONFIG.visualDetails,
        spaceTheme: 'deep-cosmos',
        edgeGlowColor: '#A855F7',
        lightStreaksEnabled: true,
      },
      bassShake: {
        ...DEFAULT_UNIVERSE_BASS_SHAKE,
        enabled: true,
        level: 'subtle',
        shakeIntensity: 30,
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
      motionPreset: 'dream-cinema',
      cameraStyle: 'smooth-cinematic',
      cameraSpeed: 0.8,
      photoFocusDuration: 4.2,
      photoMotion: 'static',
      enableRotation: false,
      transitionSmoothness: 90,
      depthOfField: 'subtle',
      spaceSpread: 110,
      background: {
        ...DEFAULT_UNIVERSE_BACKGROUND,
        type: 'minimal-starfield',
        galaxyTint: 'cosmic-blue',
        starCount: 800,
        nebulaGlow: 15,
      },
      visualDetails: {
        ...DEFAULT_PHOTO_UNIVERSE_CONFIG.visualDetails,
        spaceTheme: 'midnight-abyss',
        edgeGlowColor: '#FFFFFF',
        particlesEnabled: false,
        lightStreaksEnabled: false,
      },
      bassShake: {
        ...DEFAULT_UNIVERSE_BASS_SHAKE,
        enabled: false,
        level: 'off',
        shakeIntensity: 0,
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
    motionPreset: found.config.motionPreset || current.motionPreset,
    photoMotion: found.config.photoMotion || current.photoMotion,
    background: {
      ...current.background,
      ...(found.config.background || {}),
    },
    visualDetails: {
      ...current.visualDetails,
      ...(found.config.visualDetails || {}),
    },
    bassShake: {
      ...current.bassShake,
      ...(found.config.bassShake || {}),
    },
    lightTrails: {
      ...current.lightTrails,
      ...(found.config.lightTrails || {}),
    },
  }
}
