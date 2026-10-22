/**
 * IndiaTools — Floating Photo Universe
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

export type DepthOfFieldMode = 'off' | 'subtle' | 'cinematic' | 'strong'

export type DirectorMode = 'auto' | 'manual'

export interface UniverseBassShakeConfig {
  enabled: boolean
  bassSensitivity: number // 0 to 100
  shakeIntensity: number // 0 to 100
  durationSec: number // 0.08 to 0.35s
  nearbyPhotoReaction: boolean // Nearby floating photos physically vibrate/tilt
  maxDisplacementPx: number // 2 to 24px
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

export interface PhotoUniverseStudioConfig {
  enabled: boolean
  photos: UniversePhoto[]
  
  // 3D Space Spread & Photo Distribution
  spaceSpread: number // 50 to 200 (scale factor for distance between photos)
  photoScale: number // 0.6 to 2.0
  depthRange: number // 600 to 3000
  
  // Signature Camera Flight
  cameraStyle: CameraMovementStyle
  cameraSpeed: number // 0.5 to 2.5 (1.0 = standard)
  photoFocusDuration: number // 1.5 to 7.0 seconds lingering at each photo
  transitionSmoothness: number // 20 to 100
  musicReactive: boolean // Music tempo & energy adjusts travel velocity
  
  // Depth of Field
  depthOfField: DepthOfFieldMode
  focusTransitionSpeed: number // 0.5 to 2.5
  backgroundBlurIntensity: number // 10 to 100
  focusDepth: number // 0 to 100
  
  // Bass Shake
  bassShake: UniverseBassShakeConfig
  
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
  bassSensitivity: 60,
  shakeIntensity: 45,
  durationSec: 0.18,
  nearbyPhotoReaction: true,
  maxDisplacementPx: 12,
}

export const DEFAULT_UNIVERSE_VISUAL_DETAILS: UniverseVisualDetails = {
  particlesEnabled: true,
  particleIntensity: 50,
  particleCount: 80,
  lightStreaksEnabled: true,
  edgeLightingEnabled: true,
  edgeGlowColor: '#00F0FF',
  vignetteEnabled: true,
  vignetteStrength: 45,
  environmentalGradientEnabled: true,
  spaceTheme: 'deep-cosmos',
}

export const DEFAULT_PHOTO_UNIVERSE_CONFIG: PhotoUniverseStudioConfig = {
  enabled: false,
  photos: [],
  spaceSpread: 100,
  photoScale: 1.0,
  depthRange: 1600,
  cameraStyle: 'smooth-cinematic',
  cameraSpeed: 1.0,
  photoFocusDuration: 3.2,
  transitionSmoothness: 80,
  musicReactive: true,
  depthOfField: 'cinematic',
  focusTransitionSpeed: 1.2,
  backgroundBlurIntensity: 55,
  focusDepth: 50,
  bassShake: DEFAULT_UNIVERSE_BASS_SHAKE,
  directorMode: 'auto',
  manualOrder: [],
  visualDetails: DEFAULT_UNIVERSE_VISUAL_DETAILS,
  previewQuality: 'high',
}
