/**
 * IndiaTools — Cinematic Portal VFX Studio
 * Core Type Definitions & Configuration
 * 
 * Every effect module starts strictly OFF by default.
 * No automatic effects on tool initialization.
 */

export type PortalShape = 'circle' | 'ellipse' | 'oval'

export interface PortalRingConfig {
  enabled: boolean // OFF by default
  shape: PortalShape
  posX: number // 0 to 100 (%)
  posY: number // 0 to 100 (%)
  width: number // 100 to 1200 px
  height: number // 100 to 1200 px
  rotation: number // -180 to +180 deg
  innerRadius: number // 0.6 to 0.95
  softness: number // 0 to 40 px edge feather
  thickness: number // 2 to 40 px
  primaryColor: string
  secondaryColor: string
  glowIntensity: number // 0 to 100 (%)
  opacity: number // 0 to 100 (%)
  animationSpeed: number // 0.2 to 3.0
}

export type EnergyFlowStyle = 'electric' | 'plasma' | 'ember'

export interface PortalEnergyFlowConfig {
  enabled: boolean // OFF by default
  direction: 'clockwise' | 'counter-clockwise'
  style: EnergyFlowStyle
  color: string
  speed: number // 0.2 to 3.0
  turbulence: number // 0 to 100
  intensity: number // 0 to 100
  detail: number // 1 to 5
}

export interface PortalInteriorConfig {
  enabled: boolean // OFF by default
  swirlAmount: number // -180 to 180 deg
  distortionRadius: number // 20 to 150 (%)
  perspectiveDepth: number // 0 to 100 (%)
  warpIntensity: number // 0 to 100 (%)
  speed: number // 0.2 to 2.5
  interiorBgUrl: string | null // Optional secondary interior background image
  interiorBgName?: string
}

export interface PortalLightSpillConfig {
  enabled: boolean // OFF by default
  color: string
  intensity: number // 0 to 100 (%)
  spreadRadius: number // 50 to 500 px
  direction: number // 0 to 360 deg
  falloff: number // 20 to 100 (%)
  blendMode: 'screen' | 'lighter' | 'soft-light'
  opacity: number // 0 to 100 (%)
}

export interface PortalShockwaveConfig {
  enabled: boolean // OFF by default
  radius: number // 50 to 800 px
  speed: number // 0.5 to 3.0
  distortionStrength: number // 5 to 60 px
  ringWidth: number // 5 to 60 px
  opacity: number // 0 to 100 (%)
  duration: number // 0.5 to 4.0 sec
  repeatMode: 'loop' | 'one-shot' | 'beat'
}

export interface PortalParticleSuctionConfig {
  enabled: boolean // OFF by default
  count: number // 20 to 200 bounded pool
  size: number // 1 to 8 px
  color: string
  speed: number // 0.5 to 3.0
  attractionStrength: number // 10 to 100 (%)
  turbulence: number // 0 to 100 (%)
  spawnRadius: number // 1.2 to 2.5x of portal radius
  direction: 'inward' | 'outward'
}

export interface PortalOpeningConfig {
  enabled: boolean // OFF by default
  openDuration: number // 0.5 to 5.0 sec
  holdDuration: number // 1.0 to 15.0 sec
  closeDuration: number // 0.5 to 5.0 sec
  easing: 'smooth-sine' | 'ease-in-out' | 'elastic' | 'linear'
  initialScale: number // 0.0 to 0.5
  finalScale: number // 1.0 to 1.5
  energyBurst: boolean
}

export interface PortalExitTransitionConfig {
  enabled: boolean // OFF by default
  startTime: number // sec
  duration: number // sec
  zoomSpeed: number // 1.0 to 3.0
  rotation: number // deg
  blurIntensity: number // 0 to 30 px
}

export interface PortalAudioReactivityConfig {
  enabled: boolean // OFF by default
  sensitivity: number // 0.5 to 2.5
  modulateGlow: boolean
  triggerShockwaveOnBeat: boolean
  modulateParticles: boolean
  modulateOpening: boolean
}

export type PortalModuleId =
  | 'ring'
  | 'energy'
  | 'interior'
  | 'lightSpill'
  | 'shockwave'
  | 'particles'
  | 'opening'
  | 'exit'

export interface CinematicPortalStudioConfig {
  // Master switch to temporarily bypass all effects without losing user settings
  masterAllEffectsEnabled: boolean // Default true (effects can run when individually enabled)
  isBeforePreviewActive: boolean // When true, shows 100% clean original image
  sourceImageUrl: string | null
  sourceImageName?: string
  imageFit: 'fit' | 'fill' | 'original' | 'screen'
  imagePanX: number // -50 to +50 (%)
  imagePanY: number // -50 to +50 (%)
  imageZoom: number // 0.5 to 3.0
  
  // Independent Effect Modules (ALL OFF BY DEFAULT)
  ring: PortalRingConfig
  energyFlow: PortalEnergyFlowConfig
  interior: PortalInteriorConfig
  lightSpill: PortalLightSpillConfig
  shockwave: PortalShockwaveConfig
  particles: PortalParticleSuctionConfig
  opening: PortalOpeningConfig
  exitTransition: PortalExitTransitionConfig
  audioReactivity: PortalAudioReactivityConfig

  // UI state
  activeModuleId: PortalModuleId
}

/**
 * DEFAULT PORTAL VFX CONFIG
 * Strictly neutral: Every effect starts OFF.
 */
export const DEFAULT_PORTAL_VFX_CONFIG: CinematicPortalStudioConfig = {
  masterAllEffectsEnabled: true,
  isBeforePreviewActive: false,
  sourceImageUrl: null,
  sourceImageName: undefined,
  imageFit: 'fit',
  imagePanX: 0,
  imagePanY: 0,
  imageZoom: 1.0,

  ring: {
    enabled: false, // OFF by default
    shape: 'ellipse',
    posX: 50,
    posY: 50,
    width: 360,
    height: 360,
    rotation: 0,
    innerRadius: 0.84,
    softness: 12,
    thickness: 14,
    primaryColor: '#00F0FF',
    secondaryColor: '#A855F7',
    glowIntensity: 65,
    opacity: 100,
    animationSpeed: 1.0,
  },

  energyFlow: {
    enabled: false, // OFF by default
    direction: 'clockwise',
    style: 'plasma',
    color: '#38BDF8',
    speed: 1.2,
    turbulence: 35,
    intensity: 70,
    detail: 3,
  },

  interior: {
    enabled: false, // OFF by default
    swirlAmount: 45,
    distortionRadius: 100,
    perspectiveDepth: 55,
    warpIntensity: 45,
    speed: 1.0,
    interiorBgUrl: null,
    interiorBgName: undefined,
  },

  lightSpill: {
    enabled: false, // OFF by default
    color: '#06B6D4',
    intensity: 50,
    spreadRadius: 220,
    direction: 0,
    falloff: 65,
    blendMode: 'screen',
    opacity: 65,
  },

  shockwave: {
    enabled: false, // OFF by default
    radius: 200,
    speed: 1.2,
    distortionStrength: 25,
    ringWidth: 24,
    opacity: 80,
    duration: 2.0,
    repeatMode: 'loop',
  },

  particles: {
    enabled: false, // OFF by default
    count: 75,
    size: 3,
    color: '#BAE6FD',
    speed: 1.3,
    attractionStrength: 65,
    turbulence: 30,
    spawnRadius: 1.8,
    direction: 'inward',
  },

  opening: {
    enabled: false, // OFF by default
    openDuration: 1.5,
    holdDuration: 5.0,
    closeDuration: 1.5,
    easing: 'smooth-sine',
    initialScale: 0.0,
    finalScale: 1.0,
    energyBurst: true,
  },

  exitTransition: {
    enabled: false, // OFF by default
    startTime: 6.0,
    duration: 2.0,
    zoomSpeed: 1.6,
    rotation: 25,
    blurIntensity: 15,
  },

  audioReactivity: {
    enabled: false, // OFF by default
    sensitivity: 1.2,
    modulateGlow: true,
    triggerShockwaveOnBeat: true,
    modulateParticles: true,
    modulateOpening: false,
  },

  activeModuleId: 'ring',
}

/**
 * Curated VFX Presets
 * Presets must only be applied upon explicit user confirmation.
 */
export interface PortalPreset {
  id: string
  name: string
  subtitle: string
  accentColor: string
  enabledModules: string[]
  apply: (base: CinematicPortalStudioConfig) => CinematicPortalStudioConfig
}

export const PORTAL_VFX_PRESETS: PortalPreset[] = [
  {
    id: 'dimensional-gateway',
    name: 'Dimensional Gateway',
    subtitle: 'Classic electric-cyan stargate with inward particle suction and soft rim spill',
    accentColor: '#00F0FF',
    enabledModules: ['Portal Ring', 'Energy Flow', 'Light Spill', 'Particle Suction'],
    apply: (base) => ({
      ...base,
      ring: {
        ...base.ring,
        enabled: true,
        primaryColor: '#00F0FF',
        secondaryColor: '#3B82F6',
        glowIntensity: 75,
        thickness: 16,
      },
      energyFlow: {
        ...base.energyFlow,
        enabled: true,
        color: '#38BDF8',
        speed: 1.4,
        style: 'plasma',
      },
      lightSpill: {
        ...base.lightSpill,
        enabled: true,
        color: '#0284C7',
        intensity: 55,
        spreadRadius: 260,
      },
      particles: {
        ...base.particles,
        enabled: true,
        direction: 'inward',
        color: '#E0F2FE',
        count: 80,
      },
      interior: { ...base.interior, enabled: true, swirlAmount: 35 },
      shockwave: { ...base.shockwave, enabled: false },
    }),
  },
  {
    id: 'electric-rift',
    name: 'Electric Rift',
    subtitle: 'High-voltage violet tear in spacetime with lightning arc turbulence',
    accentColor: '#A855F7',
    enabledModules: ['Portal Ring', 'Energy Flow', 'Shockwave'],
    apply: (base) => ({
      ...base,
      ring: {
        ...base.ring,
        enabled: true,
        shape: 'oval',
        primaryColor: '#C084FC',
        secondaryColor: '#7C3AED',
        glowIntensity: 85,
        thickness: 12,
      },
      energyFlow: {
        ...base.energyFlow,
        enabled: true,
        color: '#E879F9',
        style: 'electric',
        speed: 2.0,
        turbulence: 60,
      },
      shockwave: {
        ...base.shockwave,
        enabled: true,
        speed: 1.8,
        repeatMode: 'loop',
      },
      lightSpill: { ...base.lightSpill, enabled: false },
      particles: { ...base.particles, enabled: false },
      interior: { ...base.interior, enabled: false },
    }),
  },
  {
    id: 'cosmic-vortex',
    name: 'Cosmic Vortex',
    subtitle: 'Deep celestial wormhole with gravitational vortex tunnel and swirling matter',
    accentColor: '#6366F1',
    enabledModules: ['Portal Ring', 'Interior Distortion', 'Particle Suction', 'Light Spill'],
    apply: (base) => ({
      ...base,
      ring: {
        ...base.ring,
        enabled: true,
        shape: 'circle',
        primaryColor: '#818CF8',
        secondaryColor: '#4338CA',
        glowIntensity: 70,
        thickness: 14,
      },
      interior: {
        ...base.interior,
        enabled: true,
        swirlAmount: 85,
        perspectiveDepth: 80,
        warpIntensity: 65,
      },
      particles: {
        ...base.particles,
        enabled: true,
        direction: 'inward',
        color: '#C7D2FE',
        count: 110,
        speed: 1.6,
      },
      lightSpill: {
        ...base.lightSpill,
        enabled: true,
        color: '#4F46E5',
        intensity: 60,
        spreadRadius: 300,
      },
      energyFlow: { ...base.energyFlow, enabled: false },
      shockwave: { ...base.shockwave, enabled: false },
    }),
  },
  {
    id: 'ancient-magic',
    name: 'Ancient Magical Portal',
    subtitle: 'Warm golden runic portal emitting floating embers and mystical light spill',
    accentColor: '#F59E0B',
    enabledModules: ['Portal Ring', 'Energy Flow', 'Light Spill', 'Particle Suction'],
    apply: (base) => ({
      ...base,
      ring: {
        ...base.ring,
        enabled: true,
        primaryColor: '#FBBF24',
        secondaryColor: '#D97706',
        glowIntensity: 80,
        thickness: 18,
      },
      energyFlow: {
        ...base.energyFlow,
        enabled: true,
        color: '#FDE68A',
        style: 'ember',
        speed: 0.9,
      },
      lightSpill: {
        ...base.lightSpill,
        enabled: true,
        color: '#F59E0B',
        intensity: 65,
        spreadRadius: 280,
      },
      particles: {
        ...base.particles,
        enabled: true,
        color: '#FCD34D',
        count: 65,
        direction: 'outward',
      },
      interior: { ...base.interior, enabled: false },
      shockwave: { ...base.shockwave, enabled: false },
    }),
  },
  {
    id: 'minimal-cinematic',
    name: 'Minimal Cinematic Portal',
    subtitle: 'Restrained, sleek sci-fi rim with soft edge roll-off and subtle light emission',
    accentColor: '#38BDF8',
    enabledModules: ['Portal Ring', 'Light Spill'],
    apply: (base) => ({
      ...base,
      ring: {
        ...base.ring,
        enabled: true,
        shape: 'ellipse',
        primaryColor: '#38BDF8',
        secondaryColor: '#0284C7',
        glowIntensity: 50,
        thickness: 8,
        softness: 20,
      },
      lightSpill: {
        ...base.lightSpill,
        enabled: true,
        color: '#0EA5E9',
        intensity: 35,
        spreadRadius: 180,
      },
      energyFlow: { ...base.energyFlow, enabled: false },
      interior: { ...base.interior, enabled: false },
      shockwave: { ...base.shockwave, enabled: false },
      particles: { ...base.particles, enabled: false },
    }),
  },
]
