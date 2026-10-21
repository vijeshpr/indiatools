/**
 * IndiaTools — SonicCam 3D
 * Music-Reactive Cinematic Camera Studio
 * Type Definitions & Configuration Interfaces
 */

export type CameraFitMode = 'cover' | 'contain' | 'fill'

export type OrbitDirection = 'left' | 'right' | 'oscillate'

export interface SmoothOrbitConfig {
  enabled: boolean
  direction: OrbitDirection
  intensity: number // 1 to 100
  speed: number // 0.1 to 3.0
  rangeDeg: number // 3 to 35 degrees
  depthParallaxBoost: number // 0 to 100
}

export type PushPullMode =
  | 'push-in'
  | 'pull-out'
  | 'push-then-pull'
  | 'slow-approach'
  | 'wide-establishing'

export type SonicCamEasing = 'ease-in-out' | 'linear' | 'cubic' | 'dramatic'

export interface PushPullConfig {
  enabled: boolean
  mode: PushPullMode
  startZoom: number // 1.0 to 2.2
  endZoom: number // 1.0 to 2.2
  speed: number // 0.1 to 3.0
  easing: SonicCamEasing
  overscan: number // 1.05 to 1.35 (guarantees zero empty canvas borders)
}

export type DriftDirection =
  | 'horizontal'
  | 'vertical'
  | 'diagonal-up'
  | 'diagonal-down'
  | 'lissajous'

export interface CameraDriftConfig {
  enabled: boolean
  horizontalEnabled: boolean
  verticalEnabled: boolean
  tiltEnabled: boolean
  amplitude: number // 5 to 100 px
  speed: number // 0.1 to 2.5
  direction: DriftDirection
}

export type ParallaxSeparationMode = 'perspective-warp' | 'layered-3d' | 'depth-gradient'

export interface DepthParallaxConfig {
  enabled: boolean
  intensity: number // 1 to 100
  foregroundSpeed: number // 0.5 to 2.5
  midgroundSpeed: number // 0.5 to 2.0
  backgroundSpeed: number // 0.2 to 1.5
  edgeFeather: number // 0 to 40 px
  separationMode: ParallaxSeparationMode
  customForegroundUrl: string | null
  customBackgroundUrl: string | null
}

export type TiltRiseMode =
  | 'tilt-up'
  | 'tilt-down'
  | 'crane-rise-settle'
  | 'diagonal-pan'

export interface TiltRiseConfig {
  enabled: boolean
  mode: TiltRiseMode
  angleDeg: number // -25 to 25 deg
  craneHeight: number // 0 to 120 px
  speed: number // 0.1 to 2.5
}

export interface ReactiveBandMapping {
  enabled: boolean
  target: string
  sensitivity: number // 0 to 100
  intensity: number // 0 to 100
  minLimit: number
  maxLimit: number
}

export interface MusicReactiveConfig {
  enabled: boolean
  masterReactivity: number // 0 to 200 (%)
  smoothness: number // 0.5 to 0.98 (exponential smoothing factor)
  bassMapping: ReactiveBandMapping & {
    target: 'push-pull' | 'orbit' | 'zoom-pulse' | 'all'
  }
  midMapping: ReactiveBandMapping & {
    target: 'horizontal-drift' | 'tilt' | 'orbit'
  }
  trebleMapping: ReactiveBandMapping & {
    target: 'micro-tilt' | 'high-frequency-shimmer' | 'vertical-drift'
  }
  transientMapping: {
    enabled: boolean
    target: 'accent-kick' | 'none'
    sensitivity: number // 0 to 100
    intensity: number // 0 to 100
  }
  energyMapping: {
    enabled: boolean
    target: 'master-intensity' | 'speed'
    sensitivity: number // 0 to 100
    intensity: number // 0 to 100
  }
}

export type KeyframeEasing = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'cinematic-bezier'

export interface CameraKeyframe {
  id: string
  timeSec: number
  xOffset: number // -100 to 100 px
  yOffset: number // -100 to 100 px
  zoom: number // 1.0 to 2.2
  tiltDeg: number // -20 to 20 deg
  orbitDeg: number // -30 to 30 deg
  intensity: number // 0 to 100
  easing: KeyframeEasing
}

export type CameraPathPresetId =
  | 'custom'
  | 'epic-journey'
  | 'crescendo'
  | 'ambient-float'
  | 'cinematic-reveal'

export interface CameraPathConfig {
  enabled: boolean
  pathPreset: CameraPathPresetId
  keyframes: CameraKeyframe[]
  autoInterpolate: boolean
}

export type SonicCamPresetId =
  | 'epic-cinematic'
  | 'dreamy-floating'
  | 'bass-motion'
  | 'emotional-slow-motion'
  | 'cinematic-reveal'
  | 'orbit-experience'
  | 'music-video-dynamic'
  | 'minimal-natural'
  | 'custom-camera-path'

export interface SonicCamPresetMetadata {
  id: SonicCamPresetId
  name: string
  subtitle: string
  description: string
  accentColor: string
  enabledModules: string[]
  config: Partial<SonicCamStudioConfig>
}

export interface SonicCamStudioConfig {
  enabled: boolean // Master studio toggle (OFF by default)
  isBeforeActive: boolean // Before/After original comparison toggle
  sourceImageUrl: string | null
  sourceImageFit: CameraFitMode
  orbit: SmoothOrbitConfig
  pushPull: PushPullConfig
  drift: CameraDriftConfig
  depth: DepthParallaxConfig
  tiltRise: TiltRiseConfig
  musicReactive: MusicReactiveConfig
  cameraPath: CameraPathConfig
}

/**
 * STRICT REQUIREMENT: ALL EFFECTS OFF BY DEFAULT
 */
export const DEFAULT_SONIC_CAM_CONFIG: SonicCamStudioConfig = {
  enabled: false,
  isBeforeActive: false,
  sourceImageUrl: null,
  sourceImageFit: 'cover',
  orbit: {
    enabled: false,
    direction: 'left',
    intensity: 45,
    speed: 1.0,
    rangeDeg: 14,
    depthParallaxBoost: 35,
  },
  pushPull: {
    enabled: false,
    mode: 'push-in',
    startZoom: 1.05,
    endZoom: 1.35,
    speed: 1.0,
    easing: 'ease-in-out',
    overscan: 1.15,
  },
  drift: {
    enabled: false,
    horizontalEnabled: true,
    verticalEnabled: true,
    tiltEnabled: false,
    amplitude: 28,
    speed: 0.8,
    direction: 'lissajous',
  },
  depth: {
    enabled: false,
    intensity: 40,
    foregroundSpeed: 1.4,
    midgroundSpeed: 1.0,
    backgroundSpeed: 0.6,
    edgeFeather: 16,
    separationMode: 'perspective-warp',
    customForegroundUrl: null,
    customBackgroundUrl: null,
  },
  tiltRise: {
    enabled: false,
    mode: 'crane-rise-settle',
    angleDeg: 6,
    craneHeight: 35,
    speed: 0.8,
  },
  musicReactive: {
    enabled: false,
    masterReactivity: 100,
    smoothness: 0.88,
    bassMapping: {
      enabled: true,
      target: 'push-pull',
      sensitivity: 65,
      intensity: 50,
      minLimit: 0,
      maxLimit: 100,
    },
    midMapping: {
      enabled: true,
      target: 'horizontal-drift',
      sensitivity: 55,
      intensity: 45,
      minLimit: 0,
      maxLimit: 100,
    },
    trebleMapping: {
      enabled: true,
      target: 'micro-tilt',
      sensitivity: 40,
      intensity: 30,
      minLimit: 0,
      maxLimit: 100,
    },
    transientMapping: {
      enabled: true,
      target: 'accent-kick',
      sensitivity: 60,
      intensity: 35,
    },
    energyMapping: {
      enabled: true,
      target: 'master-intensity',
      sensitivity: 50,
      intensity: 40,
    },
  },
  cameraPath: {
    enabled: false,
    pathPreset: 'ambient-float',
    keyframes: [
      {
        id: 'kf-1',
        timeSec: 0,
        xOffset: 0,
        yOffset: 0,
        zoom: 1.05,
        tiltDeg: 0,
        orbitDeg: 0,
        intensity: 50,
        easing: 'ease-in-out',
      },
      {
        id: 'kf-2',
        timeSec: 15,
        xOffset: 25,
        yOffset: -15,
        zoom: 1.25,
        tiltDeg: 4,
        orbitDeg: 8,
        intensity: 75,
        easing: 'ease-in-out',
      },
      {
        id: 'kf-3',
        timeSec: 30,
        xOffset: -20,
        yOffset: 10,
        zoom: 1.15,
        tiltDeg: -3,
        orbitDeg: -6,
        intensity: 60,
        easing: 'ease-in-out',
      },
    ],
    autoInterpolate: true,
  },
}
