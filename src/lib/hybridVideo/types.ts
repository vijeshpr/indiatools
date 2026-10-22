/**
 * IndiaTools — Hybrid Video Studio
 * Core TypeScript Definitions & Interfaces
 * 100% Client-Side Pro Browser Video Editor
 */

export type AspectRatioId = '16:9' | '9:16' | '1:1' | '4:5' | 'custom'

export interface CanvasDimensions {
  width: number
  height: number
  label: string
  aspectRatioId: AspectRatioId
}

export const ASPECT_RATIO_PRESETS: Record<AspectRatioId, CanvasDimensions> = {
  '16:9': { width: 1920, height: 1080, label: '16:9 Landscape (YouTube, Desktop)', aspectRatioId: '16:9' },
  '9:16': { width: 1080, height: 1920, label: '9:16 Portrait (Reels, Shorts, TikTok)', aspectRatioId: '9:16' },
  '1:1': { width: 1080, height: 1080, label: '1:1 Square (Instagram Posts)', aspectRatioId: '1:1' },
  '4:5': { width: 1080, height: 1350, label: '4:5 Portrait (Instagram Feed)', aspectRatioId: '4:5' },
  'custom': { width: 1280, height: 720, label: 'Custom Canvas Size', aspectRatioId: 'custom' },
}

export type MediaType = 'video' | 'image' | 'audio'

export interface MediaAsset {
  id: string
  name: string
  type: MediaType
  url: string // object URL or data URL
  file?: File
  durationSec: number // for video/audio; default 5.0s for image
  naturalWidth: number
  naturalHeight: number
  thumbnailUrl?: string
  waveformPoints?: number[] // normalized 0-1 for audio
  sizeBytes: number
  mimeType: string
  createdAt: number
}

export type TrackType = 'video' | 'image' | 'text' | 'audio'

export interface Track {
  id: string
  name: string
  type: TrackType
  locked: boolean
  muted: boolean
  hidden: boolean
  volume: number // 0 to 1
  heightPx?: number
}

export type FitMode = 'fit' | 'fill' | 'stretch' | 'original'

export interface ClipTransform {
  x: number // canvas relative offset in pixels (0 = center)
  y: number // canvas relative offset in pixels (0 = center)
  scale: number // 1.0 = 100%
  rotationDeg: number // 0 to 360
  opacity: number // 0 to 1
  fitMode: FitMode
}

export interface Keyframe {
  id: string
  timeSec: number // clip-relative timestamp in seconds
  transform: Partial<ClipTransform>
}

export type TransitionType =
  // Clean
  | 'none'
  | 'crossfade'
  | 'fade-black'
  | 'fade-white'
  // Cinematic
  | 'smooth-zoom'
  | 'push-in'
  | 'pull-out'
  | 'pan-left'
  | 'pan-right'
  | 'tilt-up'
  | 'tilt-down'
  | 'blur-dissolve'
  | 'light-leak'
  // Dynamic
  | 'scale-punch'
  | 'whip-pan-left'
  | 'whip-pan-right'
  | 'motion-blur-swipe'
  | 'zoom-blur'
  | 'fade-wipe-left'
  | 'fade-wipe-right'
  | 'radial-wipe'
  | 'glitch-split'
  | 'rgb-split-trans'
  | 'flash-cut'
  // Stylized
  | 'film-burn'
  | 'prism-split'
  | 'ripple-distort'
  | 'digital-glitch'
  | 'light-sweep'

export type TransitionSyncMode =
  | 'manual'
  | 'on-beat'
  | 'beat-to-beat'
  | 'phrase-boundary'
  | 'energy-peak'

export type TransitionAlignment = 'start' | 'midpoint' | 'completion'

export interface ClipTransition {
  type: TransitionType
  durationSec: number
  syncMode?: TransitionSyncMode
  alignment?: TransitionAlignment
}

export type ReactivityMode = 'beat-sync' | 'bass-pulse' | 'melody-flow' | 'balanced'
export type ReactivityScope = 'global' | 'selected' | 'all'

export interface MusicReactivityConfig {
  enabled: boolean
  mode: ReactivityMode
  scope: ReactivityScope
  beatShake: {
    enabled: boolean
    intensity: number // 0 to 100 (default 25)
    durationSec: number // 0.05 to 0.4 (default 0.15)
    decay: 'sharp' | 'medium' | 'smooth'
    type: 'horizontal' | 'vertical' | 'rotational' | 'combined'
    trigger: 'all-beats' | 'strong-beats-only'
  }
  zoomPunch: {
    enabled: boolean
    amount: number // 1.0 to 1.5 (default 1.15)
    durationSec: number // 0.08 to 0.5 (default 0.2)
    direction: 'in' | 'out'
    recovery: 'fast' | 'normal' | 'slow'
    trigger: 'all-beats' | 'strong-beats-only'
  }
  bassImpact: {
    enabled: boolean
    sensitivity: number // 0.5 to 2.0 (default 1.0)
    intensity: number // 0 to 100 (default 30)
    attackSec: number // 0.02 to 0.1
    releaseSec: number // 0.05 to 0.3
    threshold: number // 0.1 to 0.8
  }
  melodyMotion: {
    enabled: boolean
    amount: number // 0 to 100 (default 20)
    smoothness: number // 0.2 to 2.0 (default 1.0)
    direction: 'forward' | 'reverse' | 'alternating'
    resetPerClip: boolean
  }
  beatFlash: {
    enabled: boolean
    intensity: number // 0 to 100 (default 30)
    durationSec: number // 0.05 to 0.35 (default 0.15)
    color: 'neutral-white' | 'warm-amber' | 'cool-cyan' | 'neon-pink'
    trigger: 'all-beats' | 'strong-beats-only'
  }
  chromaticAberration: {
    enabled: boolean
    intensity: number // 0 to 100 (default 25)
  }
  radialGlow: {
    enabled: boolean
    intensity: number // 0 to 100 (default 20)
  }
  vignettePulse: {
    enabled: boolean
    intensity: number // 0 to 100 (default 30)
  }
}

export const DEFAULT_MUSIC_REACTIVITY: MusicReactivityConfig = {
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

export interface ColorGrading {
  exposure: number // -100 to +100 (0 default)
  contrast: number // -100 to +100 (0 default)
  saturation: number // -100 to +100 (0 default)
  temperature: number // -100 (cool/blue) to +100 (warm/orange) (0 default)
  tint: number // -100 to +100 (0 default)
  lutPreset: 'none' | 'teal-orange' | 'cyberpunk-neon' | 'vintage-film' | 'bw-contrast' | 'golden-hour' | 'clean-studio'
}

export interface CinematicFilters {
  blurPx: number // 0 to 30 (0 = off)
  vignette: number // 0 to 100 (0 = off)
  filmGrain: number // 0 to 100 (0 = off)
  glow: number // 0 to 100 (0 = off)
  sharpen: number // 0 to 100 (0 = off)
}

export interface ClipEffects {
  enabled: boolean
  colorGrading: ColorGrading
  filters: CinematicFilters
}

export type TextTitleStyle =
  | 'cinematic-title'
  | 'minimal-subtitle'
  | 'bold-social-caption'
  | 'lower-third'
  | 'end-card'
  | 'neon-cyber'

export type TextAnimation =
  | 'none'
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'pop-scale'
  | 'typewriter'

export interface ClipTextProperties {
  text: string
  fontFamily: string
  fontSize: number // in canvas logical pixels
  fontWeight: string // '400', '600', '700', '900'
  color: string // hex
  textAlign: 'left' | 'center' | 'right'
  outlineColor: string
  outlineWidth: number // in px
  shadowColor: string
  shadowBlur: number
  shadowOffsetX: number
  shadowOffsetY: number
  backgroundColor?: string
  backgroundPadding?: number
  backgroundRadius?: number
  animation: TextAnimation
  titleStyle: TextTitleStyle
}

export interface ClipAudioProperties {
  volume: number // 0 to 1
  fadeInSec: number
  fadeOutSec: number
  muted: boolean
}

export type PipPresetPosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center'
  | 'custom'

export type PipFitMode = 'cover' | 'contain'

export interface CircularPipConfig {
  enabled: boolean
  sizePercent: number // Diameter as percentage of canvas shorter side (10% to 60%, default 28%)
  radiusPx?: number // Explicit custom radius in canvas pixels
  positionPreset: PipPresetPosition
  offsetX: number // Custom X position offset in pixels from preset anchor
  offsetY: number // Custom Y position offset in pixels from preset anchor
  borderWidth: number // 0 to 20px (default 3.5px)
  borderColor: string // Hex or rgba (default '#FFFFFF')
  shadowIntensity: number // 0 to 1 (default 0.45)
  shadowBlur: number // 0 to 40px (default 16)
  shadowOffsetX: number // -30 to +30 (default 0)
  shadowOffsetY: number // -30 to +30 (default 8)
  opacity: number // 0 to 1 (default 1.0)
  fitMode: PipFitMode // 'cover' (default) | 'contain'
  marginPx?: number // Distance from canvas edge for preset positions (default 48px)
}

export const DEFAULT_CIRCULAR_PIP: CircularPipConfig = {
  enabled: false,
  sizePercent: 28,
  positionPreset: 'bottom-right',
  offsetX: 0,
  offsetY: 0,
  borderWidth: 3.5,
  borderColor: '#FFFFFF',
  shadowIntensity: 0.45,
  shadowBlur: 16,
  shadowOffsetX: 0,
  shadowOffsetY: 8,
  opacity: 1.0,
  fitMode: 'cover',
  marginPx: 48,
}

export interface TimelineClip {
  id: string
  trackId: string
  assetId?: string // undefined for pure text clips
  name: string
  type: MediaType | 'text'
  startSec: number // position on timeline
  durationSec: number // visible duration on timeline
  trimStartSec: number // offset into source media
  trimEndSec: number // offset from end of source media
  speed: number // 0.25 to 4.0 (default 1.0)
  transform: ClipTransform
  keyframes: Keyframe[]
  effects: ClipEffects
  transitionIn: ClipTransition
  transitionOut: ClipTransition
  textProps?: ClipTextProperties
  audioProps: ClipAudioProperties
  circularPip?: CircularPipConfig // Circular PiP / Reaction Video Mode
  musicReactivity?: MusicReactivityConfig // Clip-specific music reactive VFX stack
  cutReason?: string // Diagnostic explanation of why cut was placed at this timestamp
}

export interface ProjectSettings {
  version: number
  id: string
  name: string
  fps: number // 30 or 60
  dimensions: CanvasDimensions
  durationSec: number
  backgroundColor: string
  musicReactivity?: MusicReactivityConfig // Global composition reactivity
}

export interface HybridVideoProject {
  settings: ProjectSettings
  tracks: Track[]
  clips: TimelineClip[]
  mediaAssets: MediaAsset[]
  musicReactivity?: MusicReactivityConfig
}

export interface ExportConfig {
  format: 'webm' | 'mp4'
  resolution: '720p' | '1080p' | '4k' | 'custom'
  width: number
  height: number
  fps: number
  bitrateBps: number
  includeAudio: boolean
}

export const DEFAULT_TRANSFORM: ClipTransform = {
  x: 0,
  y: 0,
  scale: 1,
  rotationDeg: 0,
  opacity: 1,
  fitMode: 'fit',
}

export const DEFAULT_COLOR_GRADING: ColorGrading = {
  exposure: 0,
  contrast: 0,
  saturation: 0,
  temperature: 0,
  tint: 0,
  lutPreset: 'none',
}

export const DEFAULT_CINEMATIC_FILTERS: CinematicFilters = {
  blurPx: 0,
  vignette: 0,
  filmGrain: 0,
  glow: 0,
  sharpen: 0,
}

export const DEFAULT_EFFECTS: ClipEffects = {
  enabled: false,
  colorGrading: { ...DEFAULT_COLOR_GRADING },
  filters: { ...DEFAULT_CINEMATIC_FILTERS },
}

export const DEFAULT_AUDIO_PROPS: ClipAudioProperties = {
  volume: 1,
  fadeInSec: 0,
  fadeOutSec: 0,
  muted: false,
}

export const DEFAULT_TEXT_PROPS: ClipTextProperties = {
  text: 'CINEMATIC TITLE',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 64,
  fontWeight: '800',
  color: '#FFFFFF',
  textAlign: 'center',
  outlineColor: '#000000',
  outlineWidth: 2,
  shadowColor: 'rgba(0,0,0,0.8)',
  shadowBlur: 12,
  shadowOffsetX: 0,
  shadowOffsetY: 4,
  animation: 'fade',
  titleStyle: 'cinematic-title',
}
