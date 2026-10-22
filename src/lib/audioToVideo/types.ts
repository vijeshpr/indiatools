import {
  PhotoMotionStudioConfig,
  DEFAULT_PHOTO_MOTION_CONFIG,
} from './photoMotionTypes.ts'
export * from './photoMotionTypes.ts'

import {
  CinematicPortalStudioConfig,
  DEFAULT_PORTAL_VFX_CONFIG,
} from '../portalVfx/portalTypes.ts'
export * from '../portalVfx/portalTypes.ts'

import {
  MusicGrownGardenConfig,
  DEFAULT_GARDEN_CONFIG,
} from '../garden/gardenTypes.ts'
export * from '../garden/gardenTypes.ts'

import {
  SonicCamStudioConfig,
  DEFAULT_SONIC_CAM_CONFIG,
} from '../sonicCam/sonicCamTypes.ts'
export * from '../sonicCam/sonicCamTypes.ts'
export * from '../sonicCam/sonicCamPresets.ts'

import {
  MemoryBurstStudioConfig,
  DEFAULT_MEMORY_BURST_CONFIG,
} from '../memoryBurst/memoryBurstTypes.ts'
export * from '../memoryBurst/memoryBurstTypes.ts'
export * from '../memoryBurst/memoryBurstPresets.ts'

import {
  PhotoUniverseStudioConfig,
  DEFAULT_PHOTO_UNIVERSE_CONFIG,
} from '../photoUniverse/photoUniverseTypes.ts'
export * from '../photoUniverse/photoUniverseTypes.ts'
export * from '../photoUniverse/photoUniversePresets.ts'

export type AspectRatio = '16:9' | '9:16' | '1:1'
export type VideoResolution = '1080p' | '720p'

export interface ResolutionConfig {
  width: number
  height: number
  label: string
}

export const ASPECT_RATIO_RESOLUTIONS: Record<AspectRatio, Record<VideoResolution, ResolutionConfig>> = {
  '16:9': {
    '1080p': { width: 1920, height: 1080, label: '1080p Full HD (1920×1080)' },
    '720p': { width: 1280, height: 720, label: '720p Fast HD (1280×720)' },
  },
  '9:16': {
    '1080p': { width: 1080, height: 1920, label: '1080p Vertical HD (1080×1920)' },
    '720p': { width: 720, height: 1280, label: '720p Fast Vertical (720×1280)' },
  },
  '1:1': {
    '1080p': { width: 1080, height: 1080, label: '1080p Square (1080×1080)' },
    '720p': { width: 720, height: 720, label: '720p Fast Square (720×720)' },
  },
}

export type BackgroundCategory =
  | 'romantic-rain'
  | 'rainy-window'
  | 'night-city'
  | 'ocean-waves'
  | 'mountain-landscapes'
  | 'forest-nature'
  | 'galaxy-stars'
  | 'sunset-sunrise'
  | 'abstract-neon'
  | 'minimal-dark'
  | 'dreamy-bokeh'
  | 'cinematic-light'

export interface BackgroundPreset {
  id: BackgroundCategory
  name: string
  subtitle: string
  category: string
  accentColor: string
  description: string
  gradient: [string, string, string]
}

export type MotionStyle = 'none' | 'slow-zoom-in' | 'slow-zoom-out' | 'pan-left-right' | 'ken-burns'

export interface SlideshowImage {
  id: string
  url: string
  name: string
  durationSec: number
  aspectRatio?: number
}

export type BackgroundSourceMode = 'preset' | 'single-image' | 'slideshow'

export interface BackgroundState {
  mode: BackgroundSourceMode
  presetId: BackgroundCategory
  singleImageUrl: string | null
  singleImageName?: string
  motionStyle: MotionStyle
  motionIntensity: number // 1 to 10
  slideshow: SlideshowImage[]
  slideshowTransitionDuration: number // 0.5 to 2.5s
  slideshowAutoSyncToAudio: boolean
  brightness: number // 20 to 120 (%)
  blur: number // 0 to 20 (px)
  filmGrain: number // 0 to 100 (%)
  vignette: number // 0 to 100 (%)
}

export type SpectrumStyle = 'bars' | 'mirrored' | 'circular' | 'bottom-equalizer' | 'none'
export type WaveformStyle = 'oscilloscope' | 'smooth-center' | 'dual-sided' | 'none'

export interface VisualizerConfig {
  spectrumStyle: SpectrumStyle
  waveformStyle: WaveformStyle
  barCount: number // 32 to 128
  barWidth: number // 2 to 16 px
  barGap: number // 1 to 8 px
  barMaxHeight: number // 50 to 400 px
  spectrumRadius: number // 80 to 280 px
  waveformHeight: number // 20 to 160 px
  waveformStrokeWidth: number // 1 to 8 px
  colorMode: 'gradient' | 'neon' | 'monochrome'
  primaryColor: string
  secondaryColor: string
  accentColor: string
  glowStrength: number // 0 to 100 (%)
  centerArtworkCircle: boolean
  centerArtworkRadius: number // 40 to 160 px
  showPeakIndicators: boolean
}

export interface CinematicEffectsConfig {
  rainEnabled: boolean
  rainDensity: number // 10 to 100 (%)
  rainSpeed: number // 0.5 to 2.5
  rainWind: number // -30 to 30 deg
  floatingParticlesEnabled: boolean
  particleCount: number // 20 to 200
  lightRaysEnabled: boolean
  lightRayIntensity: number // 10 to 100 (%)
  dreamyBokehEnabled: boolean
  bokehDensity: number // 5 to 50
  bassScaleEnabled: boolean
  bassScaleStrength: number // 1 to 10
  beatLightPulseEnabled: boolean
  beatPulseIntensity: number // 10 to 100 (%)
  cameraShakeOnBeat: boolean
}

export interface TextOverlayConfig {
  title: string
  artist: string
  subtitle: string
  customNotes: string
  fontFamily: 'Inter' | 'Montserrat' | 'Cinzel' | 'Plus Jakarta Sans' | 'Noto Sans Indic'
  titleSize: number // 24 to 80 px
  artistSize: number // 16 to 48 px
  subtitleSize: number // 14 to 36 px
  textColor: string
  textOutlineColor: string
  hasShadow: boolean
  position: 'top' | 'middle' | 'bottom'
  alignment: 'left' | 'center' | 'right'
  fadeInDuration: number // 0 to 5s
  fadeOutDuration: number // 0 to 5s
}

export interface AudioTrackMetadata {
  file: File | null
  url: string | null
  name: string
  duration: number
  sizeBytes: number
  type: string
  fadeInSec: number
  fadeOutSec: number
}

export interface NormalizedAudioBands {
  bass: number
  mid: number
  treble: number
  subBass: number
  overall: number
  isBeatHit: boolean
}

export interface StudioCompositionConfig {
  aspectRatio: AspectRatio
  resolution: VideoResolution
  background: BackgroundState
  visualizer: VisualizerConfig
  cinematicFx: CinematicEffectsConfig
  textOverlay: TextOverlayConfig
  photoMotion?: PhotoMotionStudioConfig
  portalVfx?: CinematicPortalStudioConfig
  gardenStudio?: MusicGrownGardenConfig
  sonicCam3d?: SonicCamStudioConfig
  memoryBurst?: MemoryBurstStudioConfig
  photoUniverse?: PhotoUniverseStudioConfig
  performanceMode: boolean
}

export const DEFAULT_STUDIO_COMPOSITION: StudioCompositionConfig = {
  aspectRatio: '16:9',
  resolution: '1080p',
  background: {
    mode: 'preset',
    presetId: 'night-city',
    singleImageUrl: null,
    motionStyle: 'slow-zoom-in',
    motionIntensity: 5,
    slideshow: [],
    slideshowTransitionDuration: 1.2,
    slideshowAutoSyncToAudio: true,
    brightness: 85,
    blur: 0,
    filmGrain: 15,
    vignette: 40,
  },
  visualizer: {
    spectrumStyle: 'bottom-equalizer',
    waveformStyle: 'none',
    barCount: 64,
    barWidth: 4,
    barGap: 3,
    barMaxHeight: 180,
    spectrumRadius: 160,
    waveformHeight: 60,
    waveformStrokeWidth: 3,
    colorMode: 'gradient',
    primaryColor: '#00F0FF',
    secondaryColor: '#A855F7',
    accentColor: '#FF007F',
    glowStrength: 60,
    centerArtworkCircle: true,
    centerArtworkRadius: 100,
    showPeakIndicators: true,
  },
  cinematicFx: {
    rainEnabled: false,
    rainDensity: 50,
    rainSpeed: 1.2,
    rainWind: 5,
    floatingParticlesEnabled: false,
    particleCount: 60,
    lightRaysEnabled: false,
    lightRayIntensity: 40,
    dreamyBokehEnabled: false,
    bokehDensity: 15,
    bassScaleEnabled: true,
    bassScaleStrength: 5,
    beatLightPulseEnabled: false,
    beatPulseIntensity: 50,
    cameraShakeOnBeat: false,
  },
  textOverlay: {
    title: '',
    artist: '',
    subtitle: '',
    customNotes: '',
    fontFamily: 'Inter',
    titleSize: 48,
    artistSize: 26,
    subtitleSize: 18,
    textColor: '#FFFFFF',
    textOutlineColor: 'rgba(0,0,0,0.8)',
    hasShadow: true,
    position: 'bottom',
    alignment: 'center',
    fadeInDuration: 1.5,
    fadeOutDuration: 1.5,
  },
  photoMotion: DEFAULT_PHOTO_MOTION_CONFIG,
  portalVfx: DEFAULT_PORTAL_VFX_CONFIG,
  gardenStudio: DEFAULT_GARDEN_CONFIG,
  sonicCam3d: DEFAULT_SONIC_CAM_CONFIG,
  memoryBurst: DEFAULT_MEMORY_BURST_CONFIG,
  photoUniverse: DEFAULT_PHOTO_UNIVERSE_CONFIG,
  performanceMode: false,
}
