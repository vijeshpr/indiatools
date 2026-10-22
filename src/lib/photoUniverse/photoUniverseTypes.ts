/**
 * IndiaTools — Floating Photo Universe 2.0
 * 3D Music-Driven Cinematic Floating Photo Experience
 * Type Definitions & Configuration Model
 */

export interface UniversePhoto {
  id: string
  url: string
  name: string
  width?: number
  height?: number
  aspectRatio?: number // natural width / height (e.g. 1.77 for 16:9, 0.56 for 9:16, 1.0 for 1:1)
  customTitle?: string
}

export type CameraMovementStyle =
  | 'smooth-cinematic'
  | 'rhythmic-flight'
  | 'energetic-orbit'
  | 'slow-dream'

export type GlobalMotionPreset =
  | 'dream-cinema'
  | 'balanced-music-video'
  | 'energetic-flight'
  | 'custom'

export type MusicMovementProfile =
  | 'melody-ambient'
  | 'soft-vocal'
  | 'steady-rhythm'
  | 'bass-heavy'
  | 'balanced-cinematic'

export type DepthOfFieldMode = 'off' | 'subtle' | 'cinematic' | 'strong'

export type DirectorMode = 'auto' | 'manual'

export type PhotoMotionBehavior = 'static' | 'subtle-float' | 'music-micro'

export type BassShakeLevel = 'off' | 'subtle' | 'balanced' | 'strong'

export interface UniverseBassShakeConfig {
  enabled: boolean
  level: BassShakeLevel // default: 'subtle'
  bassSensitivity: number // 0 to 100
  shakeIntensity: number // 0 to 100
  durationSec: number // 0.08 to 0.25s
  nearbyPhotoReaction: boolean // Nearby floating photos physically vibrate slightly
  maxDisplacementPx: number // 2 to 16px (strictly bounded)
}

export type UniverseBackgroundType =
  | 'deep-space'
  | 'minimal-starfield'
  | 'nebula-galaxy'
  | 'custom-image'
  | 'solid-dark'

export interface UniverseCustomBackground {
  url: string
  name: string
  fitMode: 'cover' | 'contain'
  brightness: number // 0 to 150 (%)
  blur: number // 0 to 30 (px)
  parallaxEnabled: boolean
}

export interface UniverseBackgroundConfig {
  type: UniverseBackgroundType
  customImage: UniverseCustomBackground | null
  starCount: number // 800 to 4000
  galaxyTint: 'cosmic-blue' | 'mystic-violet' | 'amber-nebula' | 'emerald-deep'
  nebulaGlow: number // 0 to 100
}

export type TrailColorPalette =
  | 'cosmic-blue'
  | 'aurora-violet'
  | 'sunset-nebula'
  | 'ice-white'
  | 'custom'

export type TrailReactivityLevel = 'off' | 'subtle' | 'balanced' | 'strong'

export interface UniverseLightTrailsConfig {
  enabled: boolean
  trailLength: number // 8 to 48 points (default: 28)
  glowIntensity: number // 20 to 100% (default: 65%)
  trebleSensitivity: number // 10 to 100% (default: 60%)
  fadeDuration: number // 0.5 to 3.0s (default: 1.4s)
  trailWidth: number // 4 to 32px (default: 14px)
  colorPalette: TrailColorPalette // default: 'cosmic-blue'
  customColor?: string // hex string, default: '#00F0FF'
  particleAccents: boolean // default: true
  musicReactivity: TrailReactivityLevel // default: 'balanced'
}

export const DEFAULT_UNIVERSE_LIGHT_TRAILS: UniverseLightTrailsConfig = {
  enabled: true,
  trailLength: 28,
  glowIntensity: 65,
  trebleSensitivity: 60,
  fadeDuration: 1.4,
  trailWidth: 14,
  colorPalette: 'cosmic-blue',
  customColor: '#00F0FF',
  particleAccents: true,
  musicReactivity: 'balanced',
}

export type SupernovaTriggerSensitivity = 'low' | 'balanced' | 'high'

export type SupernovaPhase = 'idle' | 'attraction' | 'supernova' | 'expansion' | 'recovery'

export interface UniverseSupernovaConfig {
  enabled: boolean
  triggerSensitivity: SupernovaTriggerSensitivity // default: 'balanced'
  explosionIntensity: number // 20 to 100% (default: 75%)
  attractionStrength: number // 20 to 100% (default: 60%)
  shockwaveRadius: number // 200 to 1200px (default: 750px)
  flashBrightness: number // 10 to 100% (default: 80%)
  cameraImpact: number // 0 to 100% (default: 65%)
  recoveryDuration: number // 1.0 to 5.0s (default: 2.5s)
  cooldownDuration: number // 5 to 30s (default: 12s)
  maxEventsPerTrack: number // 1 to 6 (default: 3)
}

export const DEFAULT_UNIVERSE_SUPERNOVA: UniverseSupernovaConfig = {
  enabled: true,
  triggerSensitivity: 'balanced',
  explosionIntensity: 75,
  attractionStrength: 60,
  shockwaveRadius: 750,
  flashBrightness: 80,
  cameraImpact: 65,
  recoveryDuration: 2.5,
  cooldownDuration: 12,
  maxEventsPerTrack: 3,
}

export interface UniverseVisualDetails {
  particlesEnabled: boolean
  particleIntensity: number // 10 to 100
  particleCount: number // 30 to 200
  lightStreaksEnabled: boolean
  edgeLightingEnabled: boolean
  edgeGlowColor: string
  vignetteEnabled: boolean
  vignetteStrength: number // 10 to 80
  environmentalGradientEnabled: boolean
  spaceTheme: 'deep-cosmos' | 'warm-amber' | 'emerald-fog' | 'electric-neon' | 'midnight-abyss'
}

export interface TimelineEnergyPoint {
  timestamp: number
  energy: number // 0 to 1
  isBeat: boolean
  isPhraseStart: boolean
}

export interface UniverseAudioAnalysisResult {
  durationSec: number
  detectedProfile: MusicMovementProfile
  confidence: number // 0 to 1
  averageEnergy: number
  dynamicRange: number
  transientCount: number
  phraseCount: number
  timelinePoints: TimelineEnergyPoint[]
  recommendedHoldDuration: number // seconds
  recommendedBaseSpeed: number
  climaxTimestamps?: number[]
}

export interface CameraScoreSegment {
  segmentIndex: number
  startTime: number
  endTime: number
  duration: number
  photoIndex: number
  photoId: string
  approachDuration: number // ~2.0s to 3.5s
  settleDuration: number // ~0.8s to 1.5s
  holdDuration: number // ~2.5s to 5.0s
  departureDuration: number // ~1.5s to 2.5s
  transitionDuration: number // ~1.5s to 3.0s
  framingOffset: { x: number; y: number } // rule of thirds off-center framing
  targetEnergy: number
  shakeAllowed: boolean // disabled during focus hold
}

export interface TimestampedCameraScore {
  totalDuration: number
  segments: CameraScoreSegment[]
  profile: MusicMovementProfile
  generatedAt: number
}

export interface PhotoUniverseStudioConfig {
  enabled: boolean
  photos: UniversePhoto[]
  
  // Motion Preset & Profile
  motionPreset: GlobalMotionPreset
  autoProfileEnabled: boolean
  profileOverride: MusicMovementProfile | 'auto'

  // Photo Behavior
  photoMotion: PhotoMotionBehavior // Default: 'static' (stop unnecessary photo rotation)
  enableRotation: boolean // Default: false (stable, non-spinning)
  
  // 3D Space Spread & Photo Distribution
  spaceSpread: number // 50 to 200 (scale factor for distance between photos)
  photoScale: number // 0.6 to 2.0
  depthRange: number // 800 to 3500
  
  // Signature Camera Flight & Pacing
  cameraStyle: CameraMovementStyle
  cameraSpeed: number // 0.5 to 2.5 (1.0 = standard)
  photoFocusDuration: number // 2.5 to 6.5 seconds lingering at each photo
  transitionSmoothness: number // 40 to 100
  musicReactive: boolean // Music tempo & energy adjusts travel velocity within clamped bounds
  calmnessVsEnergy: number // 0 (ultra calm) to 100 (energetic)
  
  // Depth of Field
  depthOfField: DepthOfFieldMode
  focusTransitionSpeed: number // 0.5 to 2.5
  backgroundBlurIntensity: number // 10 to 100
  focusDepth: number // 0 to 100
  
  // Bass Shake
  bassShake: UniverseBassShakeConfig
  
  // Background
  background: UniverseBackgroundConfig

  // Audio-Reactive Cosmic Light Trails
  lightTrails: UniverseLightTrailsConfig

  // Supernova Shockwave: Cinematic Music Climax
  supernova: UniverseSupernovaConfig

  // Director
  directorMode: DirectorMode
  manualOrder: string[] // Ordered array of photo IDs
  
  // Visual Details
  visualDetails: UniverseVisualDetails
  
  // Performance
  previewQuality: 'high' | 'medium' | 'fast'
}

export const DEFAULT_UNIVERSE_BASS_SHAKE: UniverseBassShakeConfig = {
  enabled: true,
  level: 'subtle', // Subtle by default
  bassSensitivity: 50,
  shakeIntensity: 30, // Low, restrained amplitude
  durationSec: 0.14,
  nearbyPhotoReaction: false,
  maxDisplacementPx: 8, // Strictly bounded
}

export const DEFAULT_UNIVERSE_BACKGROUND: UniverseBackgroundConfig = {
  type: 'deep-space', // Default: Deep Space
  customImage: null,
  starCount: 2200,
  galaxyTint: 'cosmic-blue',
  nebulaGlow: 50,
}

export const DEFAULT_UNIVERSE_VISUAL_DETAILS: UniverseVisualDetails = {
  particlesEnabled: true,
  particleIntensity: 35,
  particleCount: 70,
  lightStreaksEnabled: false,
  edgeLightingEnabled: true,
  edgeGlowColor: '#00F0FF',
  vignetteEnabled: true,
  vignetteStrength: 40,
  environmentalGradientEnabled: true,
  spaceTheme: 'deep-cosmos',
}

export const DEFAULT_PHOTO_UNIVERSE_CONFIG: PhotoUniverseStudioConfig = {
  enabled: false,
  photos: [],
  motionPreset: 'dream-cinema', // Calm, controlled motion as default
  autoProfileEnabled: true,
  profileOverride: 'auto',
  photoMotion: 'static', // Default: Static (no continuous rotation)
  enableRotation: false, // Default: False
  spaceSpread: 120, // Spacious
  photoScale: 1.0,
  depthRange: 2200,
  cameraStyle: 'smooth-cinematic',
  cameraSpeed: 0.85, // Slower, calmer default
  photoFocusDuration: 4.0, // Substantial 4.0s focus hold
  transitionSmoothness: 85,
  musicReactive: true,
  calmnessVsEnergy: 35,
  depthOfField: 'cinematic',
  focusTransitionSpeed: 1.0,
  backgroundBlurIntensity: 50,
  focusDepth: 50,
  bassShake: DEFAULT_UNIVERSE_BASS_SHAKE,
  background: DEFAULT_UNIVERSE_BACKGROUND,
  lightTrails: DEFAULT_UNIVERSE_LIGHT_TRAILS,
  supernova: DEFAULT_UNIVERSE_SUPERNOVA,
  directorMode: 'auto',
  manualOrder: [],
  visualDetails: DEFAULT_UNIVERSE_VISUAL_DETAILS,
  previewQuality: 'high',
}
