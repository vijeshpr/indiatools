export type AspectRatio = '16:9' | '9:16' | '1:1'

export type VisualizerPreset =
  | 'circular-pulse'
  | 'linear-bars'
  | 'smooth-waveform'
  | 'cyberpunk-oscilloscope'

export type ColorTheme =
  | 'neon-cyber'
  | 'electric-violet'
  | 'sunset-ember'
  | 'aurora-emerald'
  | 'matrix-glow'

export type BackgroundMode = 'blurred-cover' | 'cyber-grid' | 'deep-space' | 'dark-studio'

export interface VisualizerDimensions {
  width: number
  height: number
  aspectRatio: AspectRatio
  label: string
}

export const ASPECT_RATIOS: Record<AspectRatio, VisualizerDimensions> = {
  '16:9': { width: 1920, height: 1080, aspectRatio: '16:9', label: '16:9 YouTube / Landscape' },
  '9:16': { width: 1080, height: 1920, aspectRatio: '9:16', label: '9:16 Reels / Shorts / TikTok' },
  '1:1': { width: 1080, height: 1080, aspectRatio: '1:1', label: '1:1 Square / Instagram Feed' },
}

export interface TrackMetadata {
  title: string
  artist: string
  handle: string
  showMetadata: boolean
}

export interface VisualizerConfig {
  preset: VisualizerPreset
  aspectRatio: AspectRatio
  theme: ColorTheme
  bgMode: BackgroundMode
  barCount: number // e.g. 64, 96, 128
  fftSize: number // 512, 1024, 2048, 4096
  smoothing: number // 0.1 - 0.95
  sensitivity: number // 0.5 - 2.5
  bassReactivity: number // 0.0 - 2.0 (pulse strength)
  showParticles: boolean
  glowStrength: number // 0.0 - 2.0
  waveformThickness: number
  spinSpeed: number // For circular preset
}

export interface AudioBands {
  bass: number // 0.0 - 1.0 normalized
  mid: number // 0.0 - 1.0 normalized
  treble: number // 0.0 - 1.0 normalized
  overall: number // 0.0 - 1.0 normalized
}

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  glow: string
  gradient: [string, string, string]
}

export const THEME_PALETTES: Record<ColorTheme, ThemeColors> = {
  'neon-cyber': {
    primary: '#06b6d4', // Cyan
    secondary: '#8b5cf6', // Violet
    accent: '#ec4899', // Pink
    glow: 'rgba(6, 182, 212, 0.7)',
    gradient: ['#06b6d4', '#8b5cf6', '#ec4899'],
  },
  'electric-violet': {
    primary: '#8b5cf6', // Violet
    secondary: '#a855f7', // Purple
    accent: '#3b82f6', // Blue
    glow: 'rgba(139, 92, 246, 0.7)',
    gradient: ['#6366f1', '#8b5cf6', '#d946ef'],
  },
  'sunset-ember': {
    primary: '#f97316', // Orange
    secondary: '#ef4444', // Red
    accent: '#eab308', // Amber
    glow: 'rgba(249, 115, 22, 0.7)',
    gradient: ['#eab308', '#f97316', '#ef4444'],
  },
  'aurora-emerald': {
    primary: '#10b981', // Emerald
    secondary: '#06b6d4', // Cyan
    accent: '#84cc16', // Lime
    glow: 'rgba(16, 185, 129, 0.7)',
    gradient: ['#84cc16', '#10b981', '#06b6d4'],
  },
  'matrix-glow': {
    primary: '#22c55e', // Green
    secondary: '#15803d', // Dark Green
    accent: '#4ade80', // Light Green
    glow: 'rgba(34, 197, 94, 0.8)',
    gradient: ['#16a34a', '#22c55e', '#86efac'],
  },
}
