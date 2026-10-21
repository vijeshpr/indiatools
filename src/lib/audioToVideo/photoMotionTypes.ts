/**
 * IndiaTools — 2.5D Photo Motion Studio
 * Core Type Definitions & Configuration
 */

export type CameraMotionPreset =
  | 'slow-push-in'
  | 'slow-pull-back'
  | 'pan-left'
  | 'pan-right'
  | 'pan-up'
  | 'pan-down'
  | 'diagonal-drift'
  | 'ken-burns'
  | 'gentle-float'
  | 'orbit-perspective'
  | 'custom'

export type CameraEasing = 'linear' | 'ease-in-out' | 'smooth-sine' | 'pendulum-loop'

export interface CameraMotionConfig {
  preset: CameraMotionPreset
  zoomStart: number // 1.0 to 1.5
  zoomEnd: number // 1.0 to 1.5
  panStartX: number // -30 to +30 (%)
  panEndX: number // -30 to +30 (%)
  panStartY: number // -30 to +30 (%)
  panEndY: number // -30 to +30 (%)
  speed: number // 0.2 to 2.5 (multiplier)
  intensity: number // 1 to 10
  easing: CameraEasing
  orbitPerspective: number // 0 to 15 (degrees)
  loopPreview: boolean
}

export type DepthMode = 'single-2.5d' | 'manual-layers' | 'brush-mask'

export interface ParallaxLayersConfig {
  mode: DepthMode
  foregroundUrl: string | null
  backgroundUrl: string | null
  maskDataUrl: string | null // Base64 png of user-painted mask
  parallaxRatio: number // 0.5 to 2.5 (fg speed relative to bg)
  bgOverscanScale: number // 1.05 to 1.3 (prevents empty edges)
  edgeFeatherPx: number // 0 to 20 px
  fgOpacity: number // 0 to 100 (%)
  bgBlurPx: number // 0 to 15 px (depth-of-field separation)
}

export type AtmosphericParticleType = 'dust' | 'snow' | 'fireflies' | 'stars' | 'bokeh'

export interface AtmosphericFxConfig {
  // Rain
  rainEnabled: boolean
  rainLayers: 1 | 2 | 3 // distant, mid, foreground
  rainIntensity: number // 10 to 100 (%)
  rainSpeed: number // 0.5 to 2.5
  rainWindAngle: number // -45 to 45 deg
  windowDropletsOverlay: boolean

  // Fog & Mist
  fogEnabled: boolean
  fogDensity: number // 10 to 100 (%)
  fogSpeed: number // 0.2 to 2.0
  fogColor: string

  // Particles
  particlesEnabled: boolean
  particleType: AtmosphericParticleType
  particleCount: number // 20 to 150
  particleSpeed: number // 0.5 to 2.0

  // Volumetric Lighting & Overlays
  lightRaysEnabled: boolean
  lightRayIntensity: number // 10 to 100 (%)
  ambientGlowEnabled: boolean
  lensFlareEnabled: boolean
  filmGrainIntensity: number // 0 to 50 (%)
}

export type CinematicColorPreset =
  | 'none'
  | 'romantic-rain'
  | 'dreamy-night'
  | 'golden-hour'
  | 'moonlight'
  | 'dark-cinema'
  | 'soft-morning'
  | 'blue-hour'
  | 'vintage-film'

export interface LightingColorConfig {
  preset: CinematicColorPreset
  brightness: number // 50 to 150 (%)
  contrast: number // 50 to 150 (%)
  saturation: number // 0 to 200 (%)
  temperature: number // -50 (cool blue) to +50 (warm amber)
  vignette: number // 0 to 100 (%)
  ambientGlow: number // 0 to 100 (%)
}

export interface AudioReactivityConfig {
  enabled: boolean
  sensitivity: number // 0.5 to 2.5
  modulateLight: boolean
  modulateFog: boolean
  modulateParticles: boolean
  modulateCameraPunch: boolean
}

export interface PhotoMotionStudioConfig {
  enabled: boolean
  sourceImageUrl: string | null
  sourceImageName?: string
  camera: CameraMotionConfig
  depth: ParallaxLayersConfig
  atmosphere: AtmosphericFxConfig
  lighting: LightingColorConfig
  audioReactivity: AudioReactivityConfig
  qualityPreset: 'performance' | 'balanced' | 'quality'
}

export const DEFAULT_PHOTO_MOTION_CONFIG: PhotoMotionStudioConfig = {
  enabled: false,
  sourceImageUrl: null,
  camera: {
    preset: 'slow-push-in',
    zoomStart: 1.05,
    zoomEnd: 1.25,
    panStartX: 0,
    panEndX: 0,
    panStartY: 0,
    panEndY: 0,
    speed: 1.0,
    intensity: 5,
    easing: 'smooth-sine',
    orbitPerspective: 3,
    loopPreview: true,
  },
  depth: {
    mode: 'single-2.5d',
    foregroundUrl: null,
    backgroundUrl: null,
    maskDataUrl: null,
    parallaxRatio: 1.35,
    bgOverscanScale: 1.15,
    edgeFeatherPx: 6,
    fgOpacity: 100,
    bgBlurPx: 2,
  },
  atmosphere: {
    rainEnabled: true,
    rainLayers: 2,
    rainIntensity: 65,
    rainSpeed: 1.2,
    rainWindAngle: 8,
    windowDropletsOverlay: true,
    fogEnabled: true,
    fogDensity: 40,
    fogSpeed: 0.8,
    fogColor: 'rgba(186, 230, 253, 0.25)',
    particlesEnabled: true,
    particleType: 'dust',
    particleCount: 60,
    particleSpeed: 1.0,
    lightRaysEnabled: true,
    lightRayIntensity: 35,
    ambientGlowEnabled: true,
    lensFlareEnabled: false,
    filmGrainIntensity: 12,
  },
  lighting: {
    preset: 'romantic-rain',
    brightness: 90,
    contrast: 105,
    saturation: 110,
    temperature: 10,
    vignette: 45,
    ambientGlow: 35,
  },
  audioReactivity: {
    enabled: true,
    sensitivity: 1.2,
    modulateLight: true,
    modulateFog: true,
    modulateParticles: true,
    modulateCameraPunch: false,
  },
  qualityPreset: 'balanced',
}

export const CINEMATIC_COLOR_PRESETS: Array<{
  id: CinematicColorPreset
  name: string
  subtitle: string
  accentColor: string
  settings: Partial<LightingColorConfig>
}> = [
  {
    id: 'none',
    name: 'Natural Neutral',
    subtitle: 'Original photographic colors with zero color grade',
    accentColor: '#94A3B8',
    settings: { brightness: 100, contrast: 100, saturation: 100, temperature: 0, vignette: 20 },
  },
  {
    id: 'romantic-rain',
    name: 'Romantic Rain',
    subtitle: 'Warm golden streetlight bokeh on deep midnight teal',
    accentColor: '#F59E0B',
    settings: { brightness: 90, contrast: 110, saturation: 115, temperature: 18, vignette: 45 },
  },
  {
    id: 'dreamy-night',
    name: 'Dreamy Night',
    subtitle: 'Deep indigo dusk shadows with electric violet ambient glow',
    accentColor: '#818CF8',
    settings: { brightness: 80, contrast: 115, saturation: 125, temperature: -25, vignette: 55 },
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    subtitle: 'Radiant sunset glow with sun-drenched amber highlights',
    accentColor: '#F97316',
    settings: { brightness: 105, contrast: 110, saturation: 130, temperature: 35, vignette: 30 },
  },
  {
    id: 'moonlight',
    name: 'Moonlight Mist',
    subtitle: 'Cool cyan-blue nocturnal illumination and soft contrast',
    accentColor: '#22D3EE',
    settings: { brightness: 85, contrast: 105, saturation: 85, temperature: -35, vignette: 50 },
  },
  {
    id: 'dark-cinema',
    name: 'Dark Cinema Noir',
    subtitle: 'High contrast film shadows with silver highlights and crushed blacks',
    accentColor: '#E2E8F0',
    settings: { brightness: 85, contrast: 135, saturation: 70, temperature: -10, vignette: 65 },
  },
  {
    id: 'soft-morning',
    name: 'Soft Morning Dawn',
    subtitle: 'Pastel morning lavender and peach with gentle highlight rolloff',
    accentColor: '#F472B6',
    settings: { brightness: 105, contrast: 92, saturation: 95, temperature: 12, vignette: 25 },
  },
  {
    id: 'blue-hour',
    name: 'Blue Hour City',
    subtitle: 'Atmospheric twilight cobalt sky with vivid neon city accents',
    accentColor: '#38BDF8',
    settings: { brightness: 92, contrast: 120, saturation: 135, temperature: -28, vignette: 40 },
  },
  {
    id: 'vintage-film',
    name: 'Vintage 35mm',
    subtitle: 'Warm nostalgic 1970s film stock fade with organic grain',
    accentColor: '#D97706',
    settings: { brightness: 95, contrast: 100, saturation: 90, temperature: 22, vignette: 40 },
  },
]
