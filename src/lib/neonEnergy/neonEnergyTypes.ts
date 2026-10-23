/**
 * IndiaTools — Neon Energy / Electric Glow Visualizer
 * Type definitions & configuration interfaces
 */

export type NeonInputMode = 'image' | 'text'

export type NeonTheme =
  | 'cyber-rainbow' // Multi-colour: Cyan, Magenta, Yellow, Lime
  | 'electric-cyan' // Intense Cyan & Azure Blue
  | 'hot-magenta'   // Vibrant Hot Pink & Magenta
  | 'acid-lime'     // Electric Lime Green & Chartreuse
  | 'electric-gold' // Warm Amber & Golden Yellow
  | 'tokyo-midnight'// Violet, Magenta & Deep Cyan
  | 'custom'

export type NeonBackgroundStyle =
  | 'dark-navy-slate'
  | 'charcoal-abyss'
  | 'cyber-dark'
  | 'midnight-studio'

export interface NeonTextConfig {
  customText: string
  fontFamily: string
  fontSize: number // 24 to 160 px
  fontWeight: 'bold' | '900' | '600' | 'normal'
  letterSpacing: number // 0 to 30 px
  textAlign: 'center' | 'left' | 'right'
  whiteCore: boolean // Authentic bright neon tube core
  textColor: string
}

export interface NeonImageConfig {
  logoUrl: string | null
  logoName?: string
  logoScale: number // 30% to 200% (default 100)
}

export interface NeonAudioReactiveConfig {
  bassSensitivity: number // 0.2 to 2.5
  bumpStrength: number // 1.05 to 1.35
  decaySpeed: number // 0.05 to 0.35
  midFreqPulseEnabled: boolean
  midFreqPulseIntensity: number // 0 to 100%
}

export interface NeonGlowConfig {
  theme: NeonTheme
  glowIntensity: number // 10 to 100%
  auraRadius: number // 10 to 100 px
  innerGlowIntensity: number // 10 to 100%
  hueCyclingEnabled: boolean
  hueCycleSpeed: number // 0.1 to 3.0
  customColors?: {
    primary: string
    secondary: string
    tertiary: string
    highlight: string
  }
}

export interface NeonReflectionConfig {
  enabled: boolean
  opacity: number // 10 to 100%
  blurPx: number // 0 to 20 px
  floorHorizonY: number // 50 to 85% of canvas height
  reflectionFalloff: number // 20 to 100%
  floorGridEnabled: boolean
}

export interface NeonEnergyStudioConfig {
  enabled: boolean
  mode: NeonInputMode
  posX: number // 10 to 90% (default 50%)
  posY: number // 20 to 80% (default 44%)
  image: NeonImageConfig
  text: NeonTextConfig
  audio: NeonAudioReactiveConfig
  glow: NeonGlowConfig
  reflection: NeonReflectionConfig
  backgroundStyle: NeonBackgroundStyle
}

export const DEFAULT_NEON_ENERGY_CONFIG: NeonEnergyStudioConfig = {
  enabled: false,
  mode: 'text',
  posX: 50,
  posY: 44,
  image: {
    logoUrl: null,
    logoName: undefined,
    logoScale: 100,
  },
  text: {
    customText: 'INDIA TOOLS',
    fontFamily: 'Inter',
    fontSize: 76,
    fontWeight: '900',
    letterSpacing: 10,
    textAlign: 'center',
    whiteCore: true,
    textColor: '#FFFFFF',
  },
  audio: {
    bassSensitivity: 1.2,
    bumpStrength: 1.15,
    decaySpeed: 0.14,
    midFreqPulseEnabled: true,
    midFreqPulseIntensity: 65,
  },
  glow: {
    theme: 'cyber-rainbow',
    glowIntensity: 80,
    auraRadius: 48,
    innerGlowIntensity: 70,
    hueCyclingEnabled: true,
    hueCycleSpeed: 0.8,
    customColors: {
      primary: '#00F0FF',
      secondary: '#FF007F',
      tertiary: '#FFE600',
      highlight: '#39FF14',
    },
  },
  reflection: {
    enabled: true,
    opacity: 55,
    blurPx: 4,
    floorHorizonY: 66,
    reflectionFalloff: 75,
    floorGridEnabled: true,
  },
  backgroundStyle: 'dark-navy-slate',
}
