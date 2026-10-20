/**
 * IndiaTools — Audio Spectrum Waveform Video Generator 2.0
 * Comprehensive Type Definitions for DSP Engine, 20 Visualizers, 20 Templates,
 * 5-Language Typography Studio, and MediaRecorder Export.
 */

export type AspectRatio = '16:9' | '9:16' | '1:1'

export interface VisualizerDimensions {
  width: number
  height: number
  aspectRatio: AspectRatio
  label: string
}

export const ASPECT_RATIOS: Record<AspectRatio, VisualizerDimensions> = {
  '9:16': { width: 1080, height: 1920, aspectRatio: '9:16', label: '9:16 Reels / Shorts / TikTok / Status' },
  '1:1': { width: 1080, height: 1080, aspectRatio: '1:1', label: '1:1 Square / Instagram Post' },
  '16:9': { width: 1920, height: 1080, aspectRatio: '16:9', label: '16:9 YouTube / Landscape' },
}

export type SupportedLanguage = 'en' | 'ml' | 'te' | 'kn' | 'ta'

export interface LanguageMeta {
  code: SupportedLanguage
  name: string
  nativeName: string
  defaultFont: string
  availableFonts: Array<{ id: string; name: string; family: string; category: 'sans' | 'serif' | 'display' }>
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageMeta> = {
  ml: {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    defaultFont: "'Noto Sans Malayalam', sans-serif",
    availableFonts: [
      { id: 'noto-sans-ml', name: 'Noto Sans Malayalam', family: "'Noto Sans Malayalam', sans-serif", category: 'sans' },
      { id: 'noto-serif-ml', name: 'Noto Serif Malayalam', family: "'Noto Serif Malayalam', serif", category: 'serif' },
      { id: 'manjari', name: 'Manjari', family: "'Manjari', sans-serif", category: 'sans' },
      { id: 'chilanka', name: 'Chilanka (Cursive)', family: "'Chilanka', cursive", category: 'display' },
    ],
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    defaultFont: "'Inter', sans-serif",
    availableFonts: [
      { id: 'inter', name: 'Inter Clean', family: "'Inter', sans-serif", category: 'sans' },
      { id: 'cinzel', name: 'Cinzel Cinematic', family: "'Cinzel', serif", category: 'serif' },
      { id: 'montserrat', name: 'Montserrat Bold', family: "'Montserrat', sans-serif", category: 'sans' },
      { id: 'space-grotesk', name: 'Space Grotesk Tech', family: "'Space Grotesk', sans-serif", category: 'display' },
    ],
  },
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    defaultFont: "'Noto Sans Telugu', sans-serif",
    availableFonts: [
      { id: 'noto-sans-te', name: 'Noto Sans Telugu', family: "'Noto Sans Telugu', sans-serif", category: 'sans' },
      { id: 'noto-serif-te', name: 'Noto Serif Telugu', family: "'Noto Serif Telugu', serif", category: 'serif' },
    ],
  },
  kn: {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    defaultFont: "'Noto Sans Kannada', sans-serif",
    availableFonts: [
      { id: 'noto-sans-kn', name: 'Noto Sans Kannada', family: "'Noto Sans Kannada', sans-serif", category: 'sans' },
      { id: 'noto-serif-kn', name: 'Noto Serif Kannada', family: "'Noto Serif Kannada', serif", category: 'serif' },
    ],
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    defaultFont: "'Noto Sans Tamil', sans-serif",
    availableFonts: [
      { id: 'noto-sans-ta', name: 'Noto Sans Tamil', family: "'Noto Sans Tamil', sans-serif", category: 'sans' },
      { id: 'noto-serif-ta', name: 'Noto Serif Tamil', family: "'Noto Serif Tamil', serif", category: 'serif' },
    ],
  },
}

/**
 * 20 Distinct Visualizer Engines
 */
export type VisualizerPreset =
  | 'circular-harmonic-spectrum'
  | 'dual-ring-counter-rotating'
  | 'radial-3d-perspective'
  | 'minimalist-oscilloscope'
  | 'symmetrical-mirror-waveform'
  | 'neon-segmented-equalizer'
  | 'galaxy-vortex-spectrum'
  | 'orbital-energy-rings'
  | 'album-cover-reactive-halo'
  | 'futuristic-hud-telemetry'
  | 'liquid-metawave-surface'
  | 'perspective-spectrum-tunnel'
  | 'glowing-ribbon-trails'
  | 'dotted-harmonic-matrix'
  | 'cinematic-topographic-landscape'
  | 'bottom-edge-broadcast-bars'
  | 'portrait-edge-spectrum'
  | 'kinetic-audio-typography'
  | 'luxury-minimal-line'
  | 'multilayer-symphonic-composite'
  // Backward-compatibility aliases
  | 'circular-pulse'
  | 'linear-bars'
  | 'smooth-waveform'
  | 'cyberpunk-oscilloscope'

export interface VisualizerEngineMeta {
  id: VisualizerPreset
  name: string
  description: string
  category: 'radial' | 'linear' | 'particle' | 'cinematic' | 'hud' | 'minimal'
  iconName: string
}

export const VISUALIZER_ENGINES: VisualizerEngineMeta[] = [
  { id: 'circular-harmonic-spectrum', name: 'Circular Harmonic Spectrum', description: 'Radial FFT bars wrapped around album art with smoothed bezier tips', category: 'radial', iconName: 'Disc' },
  { id: 'dual-ring-counter-rotating', name: 'Dual-Ring Counter Rotating', description: 'Inner bass ring and outer treble ring rotating in opposite directions', category: 'radial', iconName: 'Orbit' },
  { id: 'radial-3d-perspective', name: '3D Projected Radial Bars', description: 'Perspective foreshortened radial frequency bars with dynamic drop shadow', category: 'radial', iconName: 'Box' },
  { id: 'minimalist-oscilloscope', name: 'Minimalist Oscilloscope', description: 'Ultra-clean time-domain waveform line with soft luminous bloom', category: 'minimal', iconName: 'Activity' },
  { id: 'symmetrical-mirror-waveform', name: 'Symmetrical Mirror Waveform', description: 'Dual-axis filled frequency curve with vertical gradient reflection', category: 'linear', iconName: 'FlipVertical' },
  { id: 'neon-segmented-equalizer', name: 'Neon Segmented Equalizer', description: 'LED-matrix style block bars with gravity-decay peak-hold indicators', category: 'linear', iconName: 'BarChart3' },
  { id: 'galaxy-vortex-spectrum', name: 'Galaxy Vortex Spectrum', description: 'Cosmic spiral particle emitter with audio-reactive velocity and radius', category: 'particle', iconName: 'Sparkles' },
  { id: 'orbital-energy-rings', name: 'Orbital Energy Rings', description: 'Concentric sine-modulated rings deforming on vocal and synth frequencies', category: 'radial', iconName: 'CircleDot' },
  { id: 'album-cover-reactive-halo', name: 'Album-Cover Reactive Halo', description: 'Glowing aura and shockwave ripples expanding from artwork borders on bass kicks', category: 'radial', iconName: 'Sun' },
  { id: 'futuristic-hud-telemetry', name: 'Futuristic Sci-Fi HUD', description: 'Telemetry rings, rotating target reticles, dB readouts, and frequency arcs', category: 'hud', iconName: 'Crosshair' },
  { id: 'liquid-metawave-surface', name: 'Liquid Metawave Surface', description: 'Layered harmonic sine waves blending with organic water-like motion', category: 'cinematic', iconName: 'Waves' },
  { id: 'perspective-spectrum-tunnel', name: 'Perspective Spectrum Tunnel', description: 'Concentric geometric portals scaling outward on beat transients', category: 'cinematic', iconName: 'Maximize2' },
  { id: 'glowing-ribbon-trails', name: 'Glowing Ribbon Trails', description: 'Motion-blurred harmonic ribbons with luminous alpha persistence', category: 'particle', iconName: 'Flame' },
  { id: 'dotted-harmonic-matrix', name: 'Dotted Harmonic Matrix', description: '2D grid of dots scaling in radius and brightness across audio spectrum', category: 'linear', iconName: 'Grid' },
  { id: 'cinematic-topographic-landscape', name: 'Topographic Landscape', description: 'Wireframe 3D terrain mesh scrolling forward with bass-driven peaks', category: 'cinematic', iconName: 'Mountain' },
  { id: 'bottom-edge-broadcast-bars', name: 'Bottom-Edge Broadcast Bars', description: 'Clean lower-third spectrum bars designed specifically for lyric videos', category: 'linear', iconName: 'AlignBottom' },
  { id: 'portrait-edge-spectrum', name: 'Portrait Edge-Hugging Spectrum', description: 'Rounded-rectangle contour spectrum wrapping around vertical photo frames', category: 'radial', iconName: 'Smartphone' },
  { id: 'kinetic-audio-typography', name: 'Kinetic Audio Typography', description: 'Text scale, letter tracking, and outer glow pulsing to vocal energy', category: 'minimal', iconName: 'Type' },
  { id: 'luxury-minimal-line', name: 'Luxury Ultra-Minimal Line', description: 'Gold hairline acoustic thread reflecting micro-transients with elegance', category: 'minimal', iconName: 'Minus' },
  { id: 'multilayer-symphonic-composite', name: 'Multilayer Symphonic Composite', description: 'Composite sub-bass pulse ring, midrange spline wave, and treble stardust', category: 'cinematic', iconName: 'Layers' },
]

/**
 * 20 One-Click Studio Templates
 */
export type StudioTemplateId =
  | 'cinematic-portrait'
  | 'neon-night'
  | 'romantic-dream'
  | 'sad-song-rain'
  | 'retro-film'
  | 'dark-phonk'
  | 'bass-boost'
  | 'galaxy-cosmic'
  | 'gold-luxury'
  | 'minimal-aesthetic'
  | 'devotional-music'
  | 'indian-classical'
  | 'lofi-night'
  | 'futuristic-cyber'
  | 'album-cover-pro'
  | 'lyrics-quotes'
  | 'monsoon-cinema'
  | 'festival-energy'
  | 'audio-reactive-photo'
  | 'neon-malayalam-music'

export interface StudioTemplate {
  id: StudioTemplateId
  name: string
  subtitle: string
  category: 'Cinematic' | 'Electronic' | 'Mood' | 'Indian Traditional' | 'Minimal'
  preset: VisualizerPreset
  theme: ColorTheme
  backgroundMode: BackgroundMode
  particlePreset: ParticlePresetType
  fx: CinematicFxConfig
  defaultLanguage: SupportedLanguage
  sampleTitle: Record<SupportedLanguage, string>
  sampleArtist: Record<SupportedLanguage, string>
}

export type ColorTheme =
  | 'neon-cyber'
  | 'electric-violet'
  | 'sunset-ember'
  | 'aurora-emerald'
  | 'matrix-glow'
  | 'gold-luxury'
  | 'monochrome-silver'
  | 'crimson-cinema'
  | 'ocean-sapphire'
  | 'cherry-blossom'

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  glow: string
  gradient: [string, string, string]
}

export const THEME_PALETTES: Record<ColorTheme, ThemeColors> = {
  'neon-cyber': {
    primary: '#06b6d4',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    glow: 'rgba(6, 182, 212, 0.75)',
    gradient: ['#06b6d4', '#8b5cf6', '#ec4899'],
  },
  'electric-violet': {
    primary: '#8b5cf6',
    secondary: '#a855f7',
    accent: '#3b82f6',
    glow: 'rgba(139, 92, 246, 0.75)',
    gradient: ['#6366f1', '#8b5cf6', '#d946ef'],
  },
  'sunset-ember': {
    primary: '#f97316',
    secondary: '#ef4444',
    accent: '#eab308',
    glow: 'rgba(249, 115, 22, 0.75)',
    gradient: ['#eab308', '#f97316', '#ef4444'],
  },
  'aurora-emerald': {
    primary: '#10b981',
    secondary: '#06b6d4',
    accent: '#84cc16',
    glow: 'rgba(16, 185, 129, 0.75)',
    gradient: ['#84cc16', '#10b981', '#06b6d4'],
  },
  'matrix-glow': {
    primary: '#22c55e',
    secondary: '#15803d',
    accent: '#86efac',
    glow: 'rgba(34, 197, 94, 0.8)',
    gradient: ['#166534', '#22c55e', '#86efac'],
  },
  'gold-luxury': {
    primary: '#eab308',
    secondary: '#ca8a04',
    accent: '#fef08a',
    glow: 'rgba(234, 179, 8, 0.75)',
    gradient: ['#ca8a04', '#eab308', '#fef08a'],
  },
  'monochrome-silver': {
    primary: '#e2e8f0',
    secondary: '#94a3b8',
    accent: '#ffffff',
    glow: 'rgba(226, 232, 240, 0.6)',
    gradient: ['#64748b', '#cbd5e1', '#ffffff'],
  },
  'crimson-cinema': {
    primary: '#ef4444',
    secondary: '#991b1b',
    accent: '#f87171',
    glow: 'rgba(239, 68, 68, 0.75)',
    gradient: ['#7f1d1d', '#dc2626', '#fca5a5'],
  },
  'ocean-sapphire': {
    primary: '#2563eb',
    secondary: '#0284c7',
    accent: '#38bdf8',
    glow: 'rgba(37, 99, 235, 0.75)',
    gradient: ['#1e40af', '#0284c7', '#7dd3fc'],
  },
  'cherry-blossom': {
    primary: '#f472b6',
    secondary: '#fb7185',
    accent: '#fbcfe8',
    glow: 'rgba(244, 114, 182, 0.75)',
    gradient: ['#db2777', '#f472b6', '#fdf2f8'],
  },
}

export type BackgroundMode =
  | 'blurred-cover'
  | 'cyber-grid'
  | 'deep-space'
  | 'dark-studio'
  | 'gradient-pulse'
  | 'vignette-solid'

export type ParticlePresetType =
  | 'floating-dust'
  | 'rising-embers'
  | 'monsoon-rain'
  | 'cosmic-stardust'
  | 'sakura-petals'
  | 'none'

export interface CinematicFxConfig {
  cameraDrift: number // 0 - 100% (Subtle 2.5D Ken Burns zoom & pan)
  cameraBassShake: number // 0 - 100%
  bloomGlow: number // 0 - 100%
  filmGrain: number // 0 - 100%
  chromaticAberration: number // 0 - 100% (Transient RGB split)
  vignette: number // 0 - 100%
  scanlines: number // 0 - 100%
  lightLeaks: number // 0 - 100%
  colorGrading: 'neutral' | 'teal-orange' | 'vintage-warm' | 'cyber-cool' | 'noir'
}

export interface DetailedAudioBands {
  subBass: number // 20 - 60 Hz
  bass: number // 60 - 250 Hz
  lowMids: number // 250 - 500 Hz
  mids: number // 500 - 2000 Hz
  highMids: number // 2000 - 6000 Hz
  treble: number // 6000 - 20000 Hz
  overall: number // Weighted aggregate
  isBeatHit: boolean // Transient beat trigger
  energyDelta: number // Transient change rate
}

// Backward-compatible interface
export interface AudioBands {
  bass: number
  mid: number
  treble: number
  overall: number
}

export type TextAnimationStyle =
  | 'cinematic-reveal'
  | 'neon-glow'
  | 'gold-luxury'
  | 'grapheme-reveal'
  | 'word-by-word'
  | 'masked-slide'
  | 'glitch-title'
  | 'blur-to-sharp'
  | 'beat-pulse'
  | 'lower-third'

export interface TypographyLayer {
  id: string
  name: string
  text: string
  language: SupportedLanguage
  fontFamily: string
  fontSize: number // Base px (scaled to 1080 canvas)
  fontWeight: number // 400, 600, 700, 800
  color: string
  accentColor?: string
  align: 'left' | 'center' | 'right'
  xPercent: number // 0 - 100%
  yPercent: number // 0 - 100%
  letterSpacing: number // px
  lineHeight: number // multiplier e.g. 1.2
  opacity: number // 0 - 1
  rotation: number // degrees -180 to 180
  hasOutline: boolean
  outlineColor: string
  outlineWidth: number
  hasShadow: boolean
  shadowColor: string
  shadowBlur: number
  hasGlow: boolean
  glowColor: string
  glowIntensity: number
  animationStyle: TextAnimationStyle
  animationDuration: number // seconds
  startTime: number // seconds in composition
  endTime: number // seconds in composition
  visible: boolean
  locked: boolean
  // Audio reactivity
  audioReactiveScale: boolean
  audioReactiveGlow: boolean
}

export type ImageLayoutMode =
  | 'album-disc'
  | 'fullscreen-cinematic'
  | 'portrait-frame'
  | 'floating-card'
  | 'split-screen'
  | 'photo-bottom-wave'

export interface PhotoAsset {
  id: string
  file?: File
  url: string
  name: string
  width: number
  height: number
  duration: number // for slideshow
  crop: { x: number; y: number; zoom: number; rotation: number }
  filters: {
    brightness: number // 50 - 150
    contrast: number // 50 - 150
    saturation: number // 0 - 200
    warmth: number // -50 to 50
    vignette: number // 0 - 100
  }
}

export type LightShowMode =
  | 'concert-stage'
  | 'neon-club'
  | 'cinematic-spotlight'
  | 'dark-bass-drop'
  | 'rainbow-pulse'
  | 'minimal-light-bars'
  | 'none'

export interface LightShowConfig {
  enabled: boolean
  mode: LightShowMode
  intensity: number
  beamCount: number
  reduceFlashing: boolean
  blackoutOnDrop: boolean
  ambientGlow: number
}

export type SmokePalette =
  | 'purple'
  | 'cyan'
  | 'magenta'
  | 'electric-blue'
  | 'orange'
  | 'red'
  | 'rainbow'

export type SmokePosition =
  | 'bottom-rise'
  | 'side-flow'
  | 'center-burst'
  | 'background-ambient'

export interface SmokeConfig {
  enabled: boolean
  palette: SmokePalette
  position: SmokePosition
  density: number
  speed: number
  opacity: number
  turbulence: number
}

export type ParticleUniverseMode =
  | 'galaxy'
  | 'starfield'
  | 'neon-dust'
  | 'fireflies'
  | 'energy-sparks'
  | 'particle-explosion'
  | 'orbiting-particles'
  | 'rainbow-confetti'
  | 'cosmic-nebula'
  | 'bass-shockwave'
  | 'light-trails'
  | 'flow-field'
  | 'none'

export interface ParticleUniverseConfig {
  enabled: boolean
  mode: ParticleUniverseMode
  count: number
  size: number
  speed: number
  glow: number
  burstIntensity: number
}

export interface ShockwaveConfig {
  enabled: boolean
  ringCount: number
  thickness: number
  glow: number
  expansionSpeed: number
  color: string
}

export type DottedMatrixDensity = 'fine' | 'balanced' | 'bold'
export type DottedMatrixHalftoneMode = 'photo-dots' | 'luminance-size' | 'neon-tint'
export type DottedMatrixRecoverySpeed = 'slow' | 'balanced' | 'fast'

export interface DottedMatrixConfig {
  density: DottedMatrixDensity
  halftoneMode: DottedMatrixHalftoneMode
  liquidSpreadIntensity: number // 0 - 100
  bassWaveReactivity: number // 0 - 100 (%) Concentric wave displacement on bass hits
  recoverySpeed: DottedMatrixRecoverySpeed
  dotSizeScale: number // 50 - 200 (%)
  glowIntensity: number // 0 - 100 (%)
  ambientFlowIntensity: number // 0 - 100 (%)
  backgroundDarkness: number // 0 - 100 (%)
}

// -------------------------------------------------------------
// SPECIAL FX #1: PARTICLE PIXEL DISPERSION ("Sand / Ember Dissolve")
// -------------------------------------------------------------
export type PixelDispersionMode = 'ember-glow' | 'sand-drift' | 'cosmic-stardust' | 'neon-shards'
export type PixelDispersionDirection = 'up' | 'up-right' | 'outward' | 'vortex' | 'down'
export type PixelDispersionColorMode = 'photo-rgb' | 'ember-fire' | 'golden-sand' | 'palette-tint'

export interface PixelDispersionConfig {
  enabled: boolean
  mode: PixelDispersionMode
  direction: PixelDispersionDirection
  colorMode: PixelDispersionColorMode
  density: number // 10 - 100 (%) spawn rate
  particleSize: number // 1 - 8 (px)
  speed: number // 0.5 - 3.0
  bassBurstReactivity: number // 0 - 100 (%)
  trebleShimmer: number // 0 - 100 (%)
  blendMode: 'lighter' | 'screen' | 'source-over'
  dissolveSpread: number // 10 - 100 (%)
}

export const DEFAULT_PIXEL_DISPERSION_CONFIG: PixelDispersionConfig = {
  enabled: false,
  mode: 'ember-glow',
  direction: 'up',
  colorMode: 'photo-rgb',
  density: 65,
  particleSize: 2.8,
  speed: 1.2,
  bassBurstReactivity: 80,
  trebleShimmer: 70,
  blendMode: 'lighter',
  dissolveSpread: 50,
}

export interface CompositionState {
  version: 2
  aspectRatio: AspectRatio
  fps: 24 | 30 | 60
  duration: number
  currentTime: number
  trimStart: number
  trimEnd: number
  isPlaying: boolean
  isLooping: boolean
  volume: number
  isMuted: boolean

  // Template & Preset
  activeTemplateId: StudioTemplateId
  activePreset: VisualizerPreset
  theme: ColorTheme
  backgroundMode: BackgroundMode

  // DSP & FFT Config
  fftSize: 1024 | 2048 | 4096
  smoothing: number // 0.1 - 0.95
  sensitivity: number // 0.5 - 2.5
  bassSensitivity: number // 0.5 - 2.5
  trebleSensitivity: number // 0.5 - 2.5
  barCount: number // 32 - 180

  // Photo & Slideshow
  photos: PhotoAsset[]
  activePhotoIndex: number
  photoVisible?: boolean
  imageLayoutMode: ImageLayoutMode
  slideshowTransition: 'crossfade' | 'zoom' | 'slide' | 'none'
  slideshowSpeed: number // seconds per slide
  enableVinylRotation: boolean

  // Particles & Effects
  visualizerEnabled?: boolean
  particlePreset: ParticlePresetType
  fx: CinematicFxConfig

  // Advanced Visual FX (Lights, Smoke, Particle Universe, Shockwaves, Dotted Matrix, Pixel Dispersion)
  lighting?: LightShowConfig
  smoke?: SmokeConfig
  particleUniverse?: ParticleUniverseConfig
  shockwaves?: ShockwaveConfig
  dottedMatrix?: DottedMatrixConfig
  pixelDispersion?: PixelDispersionConfig

  // Typography Layers
  textLayers: TypographyLayer[]
  selectedLayerId: string | null

  // Branding / Watermark Outro
  branding: {
    enabled: boolean
    text: string
    subtext: string
    showToolUrl: boolean
    position: 'bottom-center' | 'bottom-right' | 'top-right'
  }
}

export interface VisualizerConfig {
  preset: VisualizerPreset
  aspectRatio: AspectRatio
  theme: ColorTheme
  bgMode: BackgroundMode
  barCount: number
  fftSize: number
  smoothing: number
  sensitivity: number
  bassReactivity: number
  showParticles: boolean
  glowStrength: number
  waveformThickness: number
  spinSpeed: number
}

export interface TrackMetadata {
  title: string
  artist: string
  handle: string
  showMetadata: boolean
}
