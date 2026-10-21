/**
 * IndiaTools — SonicCam 3D
 * 9 Curated Cinematic Camera Presets
 */

import {
  SonicCamPresetMetadata,
  DEFAULT_SONIC_CAM_CONFIG,
  SonicCamPresetId,
} from './sonicCamTypes.ts'

export const SONIC_CAM_PRESETS: SonicCamPresetMetadata[] = [
  {
    id: 'epic-cinematic',
    name: 'Epic Cinematic',
    subtitle: 'Slow push-in, subtle orbit & restrained depth parallax',
    description:
      'A timeless Hollywood-style camera push with gentle orbital curvature and natural depth separation, tuned for dramatic music.',
    accentColor: '#38BDF8', // Sky Blue
    enabledModules: ['Push-Pull', 'Smooth Orbit', 'Depth Parallax', 'Music Reactivity'],
    config: {
      enabled: true,
      orbit: {
        ...DEFAULT_SONIC_CAM_CONFIG.orbit,
        enabled: true,
        direction: 'oscillate',
        intensity: 38,
        speed: 0.6,
        rangeDeg: 10,
        depthParallaxBoost: 40,
      },
      pushPull: {
        ...DEFAULT_SONIC_CAM_CONFIG.pushPull,
        enabled: true,
        mode: 'push-in',
        startZoom: 1.05,
        endZoom: 1.30,
        speed: 0.7,
        easing: 'cubic',
        overscan: 1.18,
      },
      depth: {
        ...DEFAULT_SONIC_CAM_CONFIG.depth,
        enabled: true,
        intensity: 35,
        foregroundSpeed: 1.3,
        midgroundSpeed: 1.0,
        backgroundSpeed: 0.7,
      },
      musicReactive: {
        ...DEFAULT_SONIC_CAM_CONFIG.musicReactive,
        enabled: true,
        masterReactivity: 85,
        smoothness: 0.92,
        bassMapping: {
          enabled: true,
          target: 'push-pull',
          sensitivity: 55,
          intensity: 35,
          minLimit: 0,
          maxLimit: 100,
        },
      },
    },
  },
  {
    id: 'dreamy-floating',
    name: 'Dreamy Floating Camera',
    subtitle: 'Lissajous drift with gentle multi-plane movement',
    description:
      'Floating aesthetic camera glide using harmonic Lissajous motion that creates a weightless, ethereal cinematic atmosphere.',
    accentColor: '#A855F7', // Violet
    enabledModules: ['Camera Drift', 'Depth Parallax', 'Music Reactivity'],
    config: {
      enabled: true,
      drift: {
        ...DEFAULT_SONIC_CAM_CONFIG.drift,
        enabled: true,
        horizontalEnabled: true,
        verticalEnabled: true,
        tiltEnabled: true,
        amplitude: 36,
        speed: 0.65,
        direction: 'lissajous',
      },
      depth: {
        ...DEFAULT_SONIC_CAM_CONFIG.depth,
        enabled: true,
        intensity: 45,
        foregroundSpeed: 1.5,
        midgroundSpeed: 1.0,
        backgroundSpeed: 0.6,
      },
      tiltRise: {
        ...DEFAULT_SONIC_CAM_CONFIG.tiltRise,
        enabled: true,
        mode: 'diagonal-pan',
        angleDeg: 4,
        craneHeight: 25,
        speed: 0.5,
      },
      musicReactive: {
        ...DEFAULT_SONIC_CAM_CONFIG.musicReactive,
        enabled: true,
        masterReactivity: 75,
        smoothness: 0.90,
        midMapping: {
          enabled: true,
          target: 'horizontal-drift',
          sensitivity: 65,
          intensity: 40,
          minLimit: 0,
          maxLimit: 100,
        },
      },
    },
  },
  {
    id: 'bass-motion',
    name: 'Bass Motion',
    subtitle: 'Low-frequency rhythmic push & orbital energy response',
    description:
      'Dynamically links bass drops and 808 kicks to restrained camera approach and orbital rotation, filtered with exponential anti-jitter smoothing.',
    accentColor: '#EC4899', // Pink
    enabledModules: ['Push-Pull', 'Smooth Orbit', 'Music Reactivity (Bass Focus)'],
    config: {
      enabled: true,
      orbit: {
        ...DEFAULT_SONIC_CAM_CONFIG.orbit,
        enabled: true,
        direction: 'oscillate',
        intensity: 55,
        speed: 1.1,
        rangeDeg: 14,
        depthParallaxBoost: 50,
      },
      pushPull: {
        ...DEFAULT_SONIC_CAM_CONFIG.pushPull,
        enabled: true,
        mode: 'push-then-pull',
        startZoom: 1.08,
        endZoom: 1.32,
        speed: 1.2,
        easing: 'ease-in-out',
        overscan: 1.20,
      },
      musicReactive: {
        ...DEFAULT_SONIC_CAM_CONFIG.musicReactive,
        enabled: true,
        masterReactivity: 120,
        smoothness: 0.85,
        bassMapping: {
          enabled: true,
          target: 'zoom-pulse',
          sensitivity: 80,
          intensity: 65,
          minLimit: 0,
          maxLimit: 100,
        },
        transientMapping: {
          enabled: true,
          target: 'accent-kick',
          sensitivity: 70,
          intensity: 45,
        },
      },
    },
  },
  {
    id: 'emotional-slow-motion',
    name: 'Emotional Slow Motion',
    subtitle: 'Ultra-slow push-in and gradual pull-back with high smoothing',
    description:
      'Designed for intimate acoustic, vocal, or ambient compositions. Moves so smoothly that the viewer perceives depth without distraction.',
    accentColor: '#10B981', // Emerald
    enabledModules: ['Push-Pull', 'Camera Drift', 'High Smoothness'],
    config: {
      enabled: true,
      pushPull: {
        ...DEFAULT_SONIC_CAM_CONFIG.pushPull,
        enabled: true,
        mode: 'slow-approach',
        startZoom: 1.02,
        endZoom: 1.22,
        speed: 0.35,
        easing: 'dramatic',
        overscan: 1.12,
      },
      drift: {
        ...DEFAULT_SONIC_CAM_CONFIG.drift,
        enabled: true,
        horizontalEnabled: true,
        verticalEnabled: false,
        tiltEnabled: false,
        amplitude: 16,
        speed: 0.4,
        direction: 'horizontal',
      },
      musicReactive: {
        ...DEFAULT_SONIC_CAM_CONFIG.musicReactive,
        enabled: true,
        masterReactivity: 50,
        smoothness: 0.96,
        bassMapping: {
          enabled: true,
          target: 'push-pull',
          sensitivity: 40,
          intensity: 20,
          minLimit: 0,
          maxLimit: 100,
        },
      },
    },
  },
  {
    id: 'cinematic-reveal',
    name: 'Cinematic Reveal',
    subtitle: 'Starts close & reveals the broader scene over time',
    description:
      'Begins with a focused macro perspective of the subject and slowly cranes back to establish the entire visual story.',
    accentColor: '#F59E0B', // Amber
    enabledModules: ['Push-Pull', 'Crane Tilt & Rise', 'Depth Parallax'],
    config: {
      enabled: true,
      pushPull: {
        ...DEFAULT_SONIC_CAM_CONFIG.pushPull,
        enabled: true,
        mode: 'pull-out',
        startZoom: 1.55,
        endZoom: 1.05,
        speed: 0.5,
        easing: 'cubic',
        overscan: 1.25,
      },
      tiltRise: {
        ...DEFAULT_SONIC_CAM_CONFIG.tiltRise,
        enabled: true,
        mode: 'crane-rise-settle',
        angleDeg: 8,
        craneHeight: 45,
        speed: 0.6,
      },
      depth: {
        ...DEFAULT_SONIC_CAM_CONFIG.depth,
        enabled: true,
        intensity: 50,
        foregroundSpeed: 1.6,
        midgroundSpeed: 1.0,
        backgroundSpeed: 0.5,
      },
      musicReactive: {
        ...DEFAULT_SONIC_CAM_CONFIG.musicReactive,
        enabled: true,
        masterReactivity: 70,
        smoothness: 0.91,
      },
    },
  },
  {
    id: 'orbit-experience',
    name: 'Orbit Experience',
    subtitle: 'Controlled left/right camera arc around the visual focal point',
    description:
      'Continuous 3-dimensional camera arc simulating a stabilized jib arm orbiting around the photograph subject.',
    accentColor: '#06B6D4', // Cyan
    enabledModules: ['Smooth Orbit', 'Depth Parallax', 'Tilt'],
    config: {
      enabled: true,
      orbit: {
        ...DEFAULT_SONIC_CAM_CONFIG.orbit,
        enabled: true,
        direction: 'oscillate',
        intensity: 65,
        speed: 0.9,
        rangeDeg: 20,
        depthParallaxBoost: 55,
      },
      tiltRise: {
        ...DEFAULT_SONIC_CAM_CONFIG.tiltRise,
        enabled: true,
        mode: 'tilt-up',
        angleDeg: 5,
        craneHeight: 20,
        speed: 0.7,
      },
      depth: {
        ...DEFAULT_SONIC_CAM_CONFIG.depth,
        enabled: true,
        intensity: 55,
        foregroundSpeed: 1.5,
        midgroundSpeed: 1.0,
        backgroundSpeed: 0.6,
      },
      musicReactive: {
        ...DEFAULT_SONIC_CAM_CONFIG.musicReactive,
        enabled: true,
        masterReactivity: 90,
        smoothness: 0.88,
        bassMapping: {
          enabled: true,
          target: 'orbit',
          sensitivity: 65,
          intensity: 45,
          minLimit: 0,
          maxLimit: 100,
        },
      },
    },
  },
  {
    id: 'music-video-dynamic',
    name: 'Music Video Dynamic',
    subtitle: 'Punchy multi-band audio reactivity with energetic camera motion',
    description:
      'High-energy music video feel where bass pulses zoom, mid frequencies sway the camera, and treble adds subtle cinematic micro-shimmers.',
    accentColor: '#8B5CF6', // Purple
    enabledModules: ['Push-Pull', 'Smooth Orbit', 'Camera Drift', 'Multi-band Audio Reactivity'],
    config: {
      enabled: true,
      orbit: {
        ...DEFAULT_SONIC_CAM_CONFIG.orbit,
        enabled: true,
        direction: 'oscillate',
        intensity: 60,
        speed: 1.2,
        rangeDeg: 16,
        depthParallaxBoost: 45,
      },
      pushPull: {
        ...DEFAULT_SONIC_CAM_CONFIG.pushPull,
        enabled: true,
        mode: 'push-then-pull',
        startZoom: 1.10,
        endZoom: 1.38,
        speed: 1.4,
        easing: 'ease-in-out',
        overscan: 1.25,
      },
      drift: {
        ...DEFAULT_SONIC_CAM_CONFIG.drift,
        enabled: true,
        horizontalEnabled: true,
        verticalEnabled: true,
        tiltEnabled: true,
        amplitude: 38,
        speed: 1.1,
        direction: 'diagonal-up',
      },
      musicReactive: {
        ...DEFAULT_SONIC_CAM_CONFIG.musicReactive,
        enabled: true,
        masterReactivity: 135,
        smoothness: 0.82,
        bassMapping: {
          enabled: true,
          target: 'zoom-pulse',
          sensitivity: 85,
          intensity: 65,
          minLimit: 0,
          maxLimit: 100,
        },
        midMapping: {
          enabled: true,
          target: 'horizontal-drift',
          sensitivity: 70,
          intensity: 55,
          minLimit: 0,
          maxLimit: 100,
        },
        trebleMapping: {
          enabled: true,
          target: 'micro-tilt',
          sensitivity: 55,
          intensity: 40,
          minLimit: 0,
          maxLimit: 100,
        },
        transientMapping: {
          enabled: true,
          target: 'accent-kick',
          sensitivity: 75,
          intensity: 50,
        },
      },
    },
  },
  {
    id: 'minimal-natural',
    name: 'Minimal Natural',
    subtitle: 'Understated handheld cinema float with zero distortion',
    description:
      'Subtle breathing camera motion replicating a master cinematographer operating a weighted steady-rig. Natural, elegant, and non-intrusive.',
    accentColor: '#94A3B8', // Slate
    enabledModules: ['Gentle Drift', 'Natural Micro-Motion'],
    config: {
      enabled: true,
      pushPull: {
        ...DEFAULT_SONIC_CAM_CONFIG.pushPull,
        enabled: true,
        mode: 'push-in',
        startZoom: 1.02,
        endZoom: 1.10,
        speed: 0.4,
        easing: 'linear',
        overscan: 1.08,
      },
      drift: {
        ...DEFAULT_SONIC_CAM_CONFIG.drift,
        enabled: true,
        horizontalEnabled: true,
        verticalEnabled: true,
        tiltEnabled: false,
        amplitude: 14,
        speed: 0.5,
        direction: 'lissajous',
      },
      musicReactive: {
        ...DEFAULT_SONIC_CAM_CONFIG.musicReactive,
        enabled: true,
        masterReactivity: 40,
        smoothness: 0.95,
      },
    },
  },
  {
    id: 'custom-camera-path',
    name: 'Custom Camera Path',
    subtitle: 'Multi-keyframe timeline path evolving across the full track',
    description:
      'Full director-level control with custom keyframes along the song duration: dramatic intro push, lateral drift, and gentle finale settle.',
    accentColor: '#14B8A6', // Teal
    enabledModules: ['Keyframe Path', 'Push-Pull', 'Smooth Orbit', 'Depth Parallax'],
    config: {
      enabled: true,
      cameraPath: {
        ...DEFAULT_SONIC_CAM_CONFIG.cameraPath,
        enabled: true,
        pathPreset: 'custom',
        autoInterpolate: true,
      },
      depth: {
        ...DEFAULT_SONIC_CAM_CONFIG.depth,
        enabled: true,
        intensity: 40,
      },
      musicReactive: {
        ...DEFAULT_SONIC_CAM_CONFIG.musicReactive,
        enabled: true,
        masterReactivity: 80,
        smoothness: 0.90,
      },
    },
  },
]

export function getSonicCamPreset(id: SonicCamPresetId): SonicCamPresetMetadata {
  const found = SONIC_CAM_PRESETS.find((p) => p.id === id)
  return found || SONIC_CAM_PRESETS[0]
}
