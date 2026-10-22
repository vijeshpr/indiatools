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
  | 'none'
  | 'crossfade'
  | 'fade-black'
  | 'fade-white'
  | 'fade-wipe-left'
  | 'fade-wipe-right'
  | 'scale-punch'
  | 'whip-pan-left'
  | 'whip-pan-right'
  | 'glitch-split'

export interface ClipTransition {
  type: TransitionType
  durationSec: number
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
}

export interface HybridVideoProject {
  settings: ProjectSettings
  tracks: Track[]
  clips: TimelineClip[]
  mediaAssets: MediaAsset[]
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
