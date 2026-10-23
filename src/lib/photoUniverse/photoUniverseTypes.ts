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

export type HolographicCardStyle =
  | 'crystal-glass'
  | 'aurora-glass'
  | 'silver-prism'
  | 'minimal-glass'

export type HoloMusicReactivity = 'off' | 'subtle' | 'balanced'

export type HoloPhotoFit = 'contain' | 'cover'

export interface UniverseHolographicCardConfig {
  enabled: boolean // default: true
  cardStyle: HolographicCardStyle // default: 'crystal-glass'
  edgeReflectionIntensity: number // 0 to 100, default: 65
  rainbowSpectrumIntensity: number // 0 to 100, default: 50
  glassTransparency: number // 10 to 100, default: 75
  cornerRadius: number // 0 to 32, default: 16
  angleResponsive: boolean // default: true
  musicReactivity: HoloMusicReactivity // default: 'subtle'
  photoFit: HoloPhotoFit // default: 'cover'
}

export const DEFAULT_UNIVERSE_HOLOGRAPHIC_CONFIG: UniverseHolographicCardConfig = {
  enabled: true,
  cardStyle: 'crystal-glass',
  edgeReflectionIntensity: 65,
  rainbowSpectrumIntensity: 50,
  glassTransparency: 75,
  cornerRadius: 16,
  angleResponsive: true,
  musicReactivity: 'subtle',
  photoFit: 'cover',
}

export type LiquidLightMaterial = 'liquid-gold' | 'liquid-silver' | 'iridescent'

export interface UniverseLiquidLightConfig {
  enabled: boolean // default: false (Safety first: disabled by default)
  material: LiquidLightMaterial // default: 'liquid-gold'
  intensity: number // 0 to 100, default: 75
  flowSpeed: number // 10 to 100, default: 50
  edgeWidth: number // 4 to 32, default: 14
  musicReactivity: boolean // default: true
  cinematicTransition: boolean // default: true
}

export const DEFAULT_UNIVERSE_LIQUID_LIGHT_CONFIG: UniverseLiquidLightConfig = {
  enabled: false,
  material: 'liquid-gold',
  intensity: 75,
  flowSpeed: 50,
  edgeWidth: 14,
  musicReactivity: true,
  cinematicTransition: true,
}

export type FilmStripPathStyle = 's-curve' | 'spiral' | 'infinite-tunnel'

export type FilmReelColorGrade =
  | 'warm-amber'
  | 'vintage-sepia'
  | 'noir-monochrome'
  | 'classic-technicolor'

export type ProjectorBeamColor =
  | 'amber-gold'
  | 'tungsten-warm'
  | 'soft-white'
  | 'sepia-glow'

export interface UniverseFilmReelConfig {
  enabled: boolean // default: false (Safety first: disabled by default)
  pathStyle: FilmStripPathStyle // default: 's-curve'
  colorGrade: FilmReelColorGrade // default: 'warm-amber'
  projectorBeamColor: ProjectorBeamColor // default: 'amber-gold'
  warmth: number // 0 to 100, default: 70
  filmGrainIntensity: number // 0 to 100, default: 35
  projectorLightIntensity: number // 0 to 100, default: 75
  cameraSpeed: number // 0.5 to 2.5, default: 0.9
  focusHoldDuration: number // 2.0 to 8.0s, default: 4.2s
  musicReactive: boolean // default: true
  cinematicEnding: boolean // default: true
  sprocketHoleDetail: 'classic-35mm' | 'wide-cinema' // default: 'classic-35mm'
  sprocketGlow: number // 0 to 100, default: 50
  celluloidTranslucency: number // 10 to 100, default: 85
  dustMotesEnabled: boolean // default: true
  dustCount: number // 20 to 150, default: 80
  volumetricRaysEnabled: boolean // default: true
  gateWeaveIntensity: number // 0 to 100, default: 20
  flickerIntensity: number // 0 to 100, default: 15
  frameDividersEnabled: boolean // default: true
  lensStreakEnabled: boolean // default: true
  ribbonWidthScale: number // 0.7 to 1.5, default: 1.0
}

export const DEFAULT_UNIVERSE_FILM_REEL_CONFIG: UniverseFilmReelConfig = {
  enabled: false,
  pathStyle: 's-curve',
  colorGrade: 'warm-amber',
  projectorBeamColor: 'amber-gold',
  warmth: 70,
  filmGrainIntensity: 35,
  projectorLightIntensity: 75,
  cameraSpeed: 0.9,
  focusHoldDuration: 4.2,
  musicReactive: true,
  cinematicEnding: true,
  sprocketHoleDetail: 'classic-35mm',
  sprocketGlow: 50,
  celluloidTranslucency: 85,
  dustMotesEnabled: true,
  dustCount: 80,
  volumetricRaysEnabled: true,
  gateWeaveIntensity: 20,
  flickerIntensity: 15,
  frameDividersEnabled: true,
  lensStreakEnabled: true,
  ribbonWidthScale: 1.0,
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

export type CinematicShotType =
  | 'cinematic-approach'
  | 'hero-reveal'
  | 'emotional-hold'
  | 'focus-handoff'
  | 'orbital-drift'
  | 'deep-space-journey'
  | 'climax-reveal'

export type MusicalMotivation =
  | 'intro-emergence'
  | 'phrase-boundary'
  | 'melody-swell'
  | 'rhythm-cadence'
  | 'drop-climax'
  | 'energy-transition'
  | 'outro-linger'

export type TransitionFrequency = 'relaxed' | 'balanced' | 'dynamic'

export interface CameraScoreSegment {
  segmentIndex: number
  startTime: number
  endTime: number
  duration: number
  photoIndex: number
  photoId: string
  shotType: CinematicShotType
  motivation: MusicalMotivation
  approachDuration: number // ~2.0s to 3.5s
  settleDuration: number // ~0.8s to 1.5s
  holdDuration: number // ~2.5s to 5.0s
  departureDuration: number // ~1.5s to 2.5s
  transitionDuration: number // ~1.5s to 3.0s
  framingOffset: { x: number; y: number } // rule of thirds off-center framing
  targetEnergy: number
  shakeAllowed: boolean // disabled during focus hold
  visualEntrance?: {
    startOpacity: number
    startScale: number
    targetOpacity: number
    targetScale: number
  }
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
  transitionFrequency: TransitionFrequency // 'relaxed' | 'balanced' | 'dynamic'
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

  // Holographic Memory Cards: 3D Crystal-Glass Display Cards
  holographicCards: UniverseHolographicCardConfig

  // Liquid Light Transformation: Luminous Molten Edge Ribbon & Camera-Responsive Sweep
  liquidLight: UniverseLiquidLightConfig

  // Film Reel Journey: Continuous 35mm Celluloid Film Strip & Projector Light
  filmReel?: UniverseFilmReelConfig

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
  transitionFrequency: 'balanced',
  musicReactive: true,
  calmnessVsEnergy: 35,
  depthOfField: 'cinematic',
  focusTransitionSpeed: 1.0,
  backgroundBlurIntensity: 50,
  focusDepth: 50,
  bassShake: DEFAULT_UNIVERSE_BASS_SHAKE,
  background: DEFAULT_UNIVERSE_BACKGROUND,
  holographicCards: DEFAULT_UNIVERSE_HOLOGRAPHIC_CONFIG,
  liquidLight: DEFAULT_UNIVERSE_LIQUID_LIGHT_CONFIG,
  filmReel: DEFAULT_UNIVERSE_FILM_REEL_CONFIG,
  supernova: DEFAULT_UNIVERSE_SUPERNOVA,
  directorMode: 'auto',
  manualOrder: [],
  visualDetails: DEFAULT_UNIVERSE_VISUAL_DETAILS,
  previewQuality: 'high',
}
