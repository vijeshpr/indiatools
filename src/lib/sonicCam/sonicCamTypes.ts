/**
 * IndiaTools — SonicCam
 * Beat-Synced Multi-Region Cinematic Photo Effect
 * Type Definitions & Configuration Interfaces
 */

export type { NormalizedAudioBands } from '../audioToVideo/types'

export interface ImageRegion {
  id: string
  label: string
  // Normalized coordinates in [0, 1] relative to source image dimensions
  x: number // 0.0 to 1.0 (left)
  y: number // 0.0 to 1.0 (top)
  width: number // 0.05 to 1.0
  height: number // 0.05 to 1.0
  color: string // Hex accent for editor outline
}

export type RegionLayoutMode =
  | 'uniform-grid'
  | 'cinematic-grid'
  | 'random-rectangles'
  | 'manual'

export type SequencerMode =
  | 'beat-driven'
  | 'every-n-beats'
  | 'sequential'
  | 'random'
  | 'energy-driven'
  | 'manual'
  | 'full-image-interlude'

export type NoBeatBehavior =
  | 'show-full-image'
  | 'hold-current-region'
  | 'return-full-smooth'

export type SonicTransitionType =
  | 'instant-cut'
  | 'snap-zoom'
  | 'smooth-zoom-cut'
  | 'whip-pan'
  | 'vertical-drop'
  | 'directional-slide'
  | 'flash-cut'
  | 'crossfade'
  | 'glitch-rgb'
  | 'spin-twist'
  | 'bass-shockwave'
  | 'film-burn'
  | 'zoom-through'
  | 'strobe-shutter'
  | 'prism-split'
  | 'anamorphic-flare'
  | 'rgb-shake'
  | 'kaleidoscope'
  | 'pixelate-dissolve'
  | 'invert-negative'
  | 'tunnel-warp'
  | 'vignette-pulse'
  | 'radial-smear'
  | 'heartbeat-pulse'
  | 'auto-cycle'
  | 'full-image-return'

export interface BeatMarker {
  id: string
  timeSec: number
  strength: number // 0.0 to 1.0
  isManual?: boolean
}

export interface BeatDetectionConfig {
  sensitivity: number // 10 to 100 (threshold for transient peak)
  minIntervalSec: number // 0.20 to 1.5s (minimum spacing between detected beats)
  autoSnapToBeat: boolean
  isAnalyzing?: boolean
}

export interface BassShakeConfig {
  enabled: boolean
  intensity: number // 1 to 100
  bassSensitivity: number // 10 to 100
  maxDisplacementPx: number // 2 to 35 px
  maxRotationDeg: number // 0.2 to 2.5 deg
  recoverySpeed: number // 0.6 to 0.95 (decay back to zero)
  zoomImpulseEnabled: boolean
}

export type InnerMotionMode = 'subtle-push' | 'subtle-drift' | 'handheld' | 'none'

export interface InnerMotionConfig {
  enabled: boolean
  mode: InnerMotionMode
  intensity: number // 1 to 100
  speed: number // 0.1 to 2.0
}

export interface ShotSequenceEntry {
  id: string
  regionId: string // specific region id, or '__full_image__'
  startTimeSec: number
  durationSec: number
  transition: SonicTransitionType
  zoomBoost?: number
}

export type SonicCamPresetId =
  | 'cinematic-discovery'
  | 'beat-snap'
  | 'bass-impact'
  | 'rapid-cuts'
  | 'slow-emotional'
  | 'landscape-explorer'
  | 'object-focus'
  | 'minimal-clean'
  | 'custom-sequence'

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
  regions: ImageRegion[]
  selectedRegionId: string | null
  showRegionBoundsInPreview: boolean // Editor overlay (never exported)
  regionCount: number // 4, 6, 9, 12, 16, 25
  layoutMode: RegionLayoutMode
  sequencerMode: SequencerMode
  beatInterval: number // 1, 2, 4, 8 beats
  noBeatBehavior: NoBeatBehavior
  minShotDurationSec: number // minimum hold duration (e.g. 0.35s)
  maxShotDurationSec: number // maximum hold duration (e.g. 3.0s)
  fullImageEveryNShots: number // 0 = disabled, 1-8 = every N shots
  fullImageIntroOutro: boolean
  transition: SonicTransitionType
  transitionDurationSec: number // 0.0 (instant) to 0.6s
  autoCycleTransitions: boolean // Automatic beat-synced dynamic transition rotation
  autoCycleMode: 'sequential' | 'random' | 'energy-reactive' // Strategy for beat-to-beat transition cycling
  bassShake: BassShakeConfig
  innerMotion: InnerMotionConfig
  beatDetection: BeatDetectionConfig
  beatMarkers: BeatMarker[]
  customSequence: ShotSequenceEntry[]
}

/**
 * Complete Library of Concrete Cinematic Shot Transitions (Excluding meta-modes)
 */
export const CONCRETE_TRANSITIONS: SonicTransitionType[] = [
  'instant-cut',
  'snap-zoom',
  'smooth-zoom-cut',
  'whip-pan',
  'vertical-drop',
  'directional-slide',
  'flash-cut',
  'crossfade',
  'glitch-rgb',
  'spin-twist',
  'bass-shockwave',
  'film-burn',
  'zoom-through',
  'strobe-shutter',
  'prism-split',
  'anamorphic-flare',
  'rgb-shake',
  'kaleidoscope',
  'pixelate-dissolve',
  'invert-negative',
  'tunnel-warp',
  'vignette-pulse',
  'radial-smear',
  'heartbeat-pulse',
]

/**
 * Default Palette for Visual Region Identification
 */
export const REGION_COLORS = [
  '#00F0FF', // Cyan
  '#A855F7', // Violet
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#3B82F6', // Blue
  '#F43F5E', // Rose
  '#8B5CF6', // Purple
  '#14B8A6', // Teal
  '#EAB308', // Yellow
  '#6366F1', // Indigo
  '#D946EF', // Fuchsia
  '#06B6D4', // Sky Cyan
  '#84CC16', // Lime
  '#FB923C', // Orange
  '#4ADE80', // Mint
]

/**
 * STRICT REQUIREMENT: ALL EFFECTS OFF BY DEFAULT
 */
export const DEFAULT_SONIC_CAM_CONFIG: SonicCamStudioConfig = {
  enabled: false,
  isBeforeActive: false,
  sourceImageUrl: null,
  regions: [],
  selectedRegionId: null,
  showRegionBoundsInPreview: false,
  regionCount: 6,
  layoutMode: 'cinematic-grid',
  sequencerMode: 'beat-driven',
  beatInterval: 2,
  noBeatBehavior: 'show-full-image',
  minShotDurationSec: 0.4,
  maxShotDurationSec: 3.5,
  fullImageEveryNShots: 4,
  fullImageIntroOutro: true,
  transition: 'snap-zoom',
  transitionDurationSec: 0.22,
  autoCycleTransitions: false,
  autoCycleMode: 'energy-reactive',
  bassShake: {
    enabled: false,
    intensity: 45,
    bassSensitivity: 65,
    maxDisplacementPx: 12,
    maxRotationDeg: 0.8,
    recoverySpeed: 0.85,
    zoomImpulseEnabled: true,
  },
  innerMotion: {
    enabled: false,
    mode: 'subtle-push',
    intensity: 30,
    speed: 0.6,
  },
  beatDetection: {
    sensitivity: 65,
    minIntervalSec: 0.35,
    autoSnapToBeat: true,
    isAnalyzing: false,
  },
  beatMarkers: [],
  customSequence: [],
}
