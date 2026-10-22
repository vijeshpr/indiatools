/**
 * IndiaTools — Memory Burst Studio
 * Multi-Photo Music Beat-Synchronized Photo Cut Experience
 * Type Definitions & Configuration
 */

export interface MemoryBurstPhoto {
  id: string
  url: string
  name: string
  durationSec?: number
  width?: number
  height?: number
  aspectRatio?: number
}

export type MemoryBurstMode =
  | 'beat-sync'
  | 'fast-cut'
  | 'memory-burst'
  | 'memory-rewind'
  | 'every-2-beats'
  | 'every-4-beats'
  | 'manual-timing'
  | 'auto-rhythm'

export type MemoryBurstTransitionStyle =
  | 'instant-cut'
  | 'smooth-crossfade'
  | 'short-flash'
  | 'scale-punch'
  | 'whip-pan'
  | 'fade-wipe'
  | 'glitch-split'
  | 'film-burn'
  | 'random-shuffle'

export type MemoryBurstPhotoOrder = 'forward' | 'reverse' | 'shuffle' | 'custom'

export interface MemoryBurstScalePunchConfig {
  enabled: boolean
  startScale: number // e.g. 1.05 = 105%
  intensity: number // 0 to 100
}

export interface MemoryBurstBassShakeConfig {
  enabled: boolean
  intensity: number // 0 to 100
  bassSensitivity: number // 0 to 100
  maxDisplacementPx: number // 4 to 25px
}

export interface MemoryBurstFlashConfig {
  enabled: boolean
  type: 'white' | 'warm'
  opacity: number // 0.05 to 0.6
  durationSec: number // 0.05 to 0.25s
}

export type MemoryBurstRhythmZoomStyle = 'rhythm-pulse' | 'slow-push' | 'beat-kick'

export interface MemoryBurstRhythmZoomConfig {
  enabled: boolean // Toggle On/Off (user option: "vendenkil off aakanulla optuinum")
  style: MemoryBurstRhythmZoomStyle
  intensity: number // 10 to 100 (%)
  maxZoom: number // 1.02 to 1.15
}

export interface MemoryBurstClimaxConfig {
  enabled: boolean
  startSec: number
  endSec: number
  burstDurationSec: number // 8–10s default, customizable
  cutSpeedMultiplier: number // 0.5 to 2.5 (1.0 = standard rapid cut ~0.18s)
  photoOrder: MemoryBurstPhotoOrder
  zoomPunchEnabled: boolean
  flashEnabled: boolean
  fadeWipeEnabled: boolean
  crossfadeEnabled: boolean
  accelerationEnabled: boolean
  accelerationStrength: number // 1 to 5 (rate of cut interval shrink)
  startHoldSec: number // hold duration before burst (e.g. 2s)
  endingHoldEnabled: boolean
  endHoldSec: number // hold duration on final emotional frame (e.g. 3s)
}

export interface MemoryBurstBeatMarker {
  id: string
  timeSec: number
  strength?: number
}

export interface MemoryBurstManualTiming {
  photoId: string
  startSec: number
  durationSec: number
}

export interface MemoryBurstStudioConfig {
  enabled: boolean // Master studio toggle (STRICT: OFF by default)
  isBeforeActive: boolean // Before/After preview toggle (STRICT: false)
  photos: MemoryBurstPhoto[]
  activePhotoIndex: number
  mode: MemoryBurstMode
  transitionStyle: MemoryBurstTransitionStyle
  transitionDurationSec: number // 0.0 to 0.5s
  defaultPhotoDurationSec: number // When beat sync is disabled (e.g. 1.5s)
  beatSensitivity: number // 10 to 100
  minCutIntervalSec: number // 0.15 to 0.8s debounce
  scalePunch: MemoryBurstScalePunchConfig
  bassShake: MemoryBurstBassShakeConfig
  flash: MemoryBurstFlashConfig
  rhythmZoom: MemoryBurstRhythmZoomConfig
  climax: MemoryBurstClimaxConfig
  randomShuffle: boolean
  fullImageInterludes: boolean
  fullImageEveryNShots: number // 0 = disabled, 1-8 = every N shots
  beatMarkers: MemoryBurstBeatMarker[]
  manualTimings: MemoryBurstManualTiming[]
}

/**
 * STRICT REQUIREMENT: ALL VISUAL EFFECTS OFF BY DEFAULT
 */
export const DEFAULT_MEMORY_BURST_CONFIG: MemoryBurstStudioConfig = {
  enabled: false,
  isBeforeActive: false,
  photos: [],
  activePhotoIndex: 0,
  mode: 'beat-sync',
  transitionStyle: 'instant-cut',
  transitionDurationSec: 0.18,
  defaultPhotoDurationSec: 1.5,
  beatSensitivity: 65,
  minCutIntervalSec: 0.25,
  scalePunch: {
    enabled: false,
    startScale: 1.05,
    intensity: 50,
  },
  bassShake: {
    enabled: false,
    intensity: 40,
    bassSensitivity: 60,
    maxDisplacementPx: 10,
  },
  flash: {
    enabled: false,
    type: 'white',
    opacity: 0.25,
    durationSec: 0.12,
  },
  rhythmZoom: {
    enabled: true, // Enabled so rhythm cinematic zoom is active when tool is used, but has toggle to turn OFF
    style: 'rhythm-pulse',
    intensity: 65,
    maxZoom: 1.08,
  },
  climax: {
    enabled: false,
    startSec: 12.0,
    endSec: 22.0,
    burstDurationSec: 8.0,
    cutSpeedMultiplier: 1.0,
    photoOrder: 'reverse',
    zoomPunchEnabled: false,
    flashEnabled: false,
    fadeWipeEnabled: false,
    crossfadeEnabled: false,
    accelerationEnabled: false,
    accelerationStrength: 3,
    startHoldSec: 2.0,
    endingHoldEnabled: false,
    endHoldSec: 3.0,
  },
  randomShuffle: false,
  fullImageInterludes: false,
  fullImageEveryNShots: 0,
  beatMarkers: [],
  manualTimings: [],
}
