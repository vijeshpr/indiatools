/**
 * IndiaTools — Vintage Cassette Visualizer
 * Type Definitions & Default Configuration
 */

export type CassetteStyle =
  | 'smoked-black'      // 1990s translucent tinted smoked polycarbonate
  | 'classic-retro'     // Ivory/warm beige 1980s studio cassette
  | 'transparent-clear' // Crystal-clear transparent shell with visible mechanics
  | 'golden-edition'    // Premium collectors metallic gold-accented shell

export type CassetteLabelTemplate =
  | 'classic'     // Authentic ruled lines, handwritten "Side A", index grid
  | 'transparent' // Minimalist clear window showing spools and photo watermark
  | 'neon'        // Electric synthwave glowing border and neon accents
  | 'grunge'      // Distressed analog wear, tape scuffs, aged paper texture

export type MagneticTapeStyle =
  | 'loose-flowing'       // Natural loose S-curves looping organically below cassette
  | 'symmetrical-ribbon'  // Twin audio-reactive ribbon loops flowing left and right
  | 'cinematic-trail'     // Wide billowing waveform ribbon extending across bottom frame

export type CassetteBackgroundPreset =
  | 'midnight-studio'   // Deep midnight navy and charcoal with soft amber spotlight
  | 'warm-nostalgia'    // Warm golden-hour sunset amber glow with soft sepia tint
  | 'neon-cyberpunk'    // Subtle magenta and cyan retro synthwave atmosphere
  | 'deep-charcoal'     // Minimalist dark slate aesthetic with vinyl studio vibe

export interface VintageCassetteStudioConfig {
  enabled: boolean

  // 1. Shell & Visual Style
  cassetteStyle: CassetteStyle
  shellOpacity: number // 30 to 100 (%)
  metallicAccent: number // 0 to 100 (%)

  // 2. Custom Photo Label
  labelPhotoUrl?: string
  labelTemplate: CassetteLabelTemplate
  labelPhotoFit: 'cover' | 'contain'
  labelPhotoOffsetX: number // -100 to 100 (px)
  labelPhotoOffsetY: number // -100 to 100 (px)
  labelPhotoZoom: number // 80 to 200 (%)
  labelTitle: string
  labelArtist: string
  labelSideText: 'SIDE A' | 'SIDE B' | 'AUTO REVERSE'

  // 3. Audio-Reactive Spinning Reels
  reelSpeed: number // 0.2 to 2.5 (base angular velocity multiplier)
  bassReactivity: number // 0 to 100 (%) — temporary speed boost on bass kicks
  reelSpoolProgress: number // 0 to 100 (%) — left vs right tape spool thickness (simulate playback position)
  autoSpoolProgress: boolean // Automatically wind tape from left to right as playback progresses

  // 4. Unraveling Magnetic Tape Ribbon
  tapeRibbonStyle: MagneticTapeStyle
  tapeRibbonEnabled: boolean
  waveformIntensity: number // 0 to 100 (%) — amplitude response of magnetic ribbon
  ribbonThickness: number // 2 to 24 (px)
  ribbonGlow: number // 0 to 100 (%)
  ribbonColor: string // '#2B1B17' or accent

  // 5. Retro Atmosphere & Background
  backgroundPreset: CassetteBackgroundPreset
  customBackgroundUrl?: string
  analogGrain: boolean
  grainIntensity: number // 5 to 60 (%)
  vhsScanlines: boolean
  scanlineIntensity: number // 5 to 50 (%)

  // 6. The Tape Glitch (Musical Climax Event)
  climaxGlitchEnabled: boolean
  glitchIntensity: number // 10 to 100 (%)
  glitchThreshold: number // 0.60 to 0.95 (energy trigger sensitivity)
  glitchCooldownSec: number // 2.0 to 10.0 seconds
}

export const DEFAULT_VINTAGE_CASSETTE_CONFIG: VintageCassetteStudioConfig = {
  enabled: false, // Safety First — starts disabled

  // 1. Shell & Visual Style
  cassetteStyle: 'smoked-black',
  shellOpacity: 88,
  metallicAccent: 45,

  // 2. Custom Photo Label
  labelPhotoUrl: undefined,
  labelTemplate: 'classic',
  labelPhotoFit: 'cover',
  labelPhotoOffsetX: 0,
  labelPhotoOffsetY: 0,
  labelPhotoZoom: 100,
  labelTitle: 'MIXTAPE VOL. 1',
  labelArtist: 'ORIGINAL RECORDING',
  labelSideText: 'SIDE A',

  // 3. Audio-Reactive Spinning Reels
  reelSpeed: 1.0,
  bassReactivity: 65,
  reelSpoolProgress: 35,
  autoSpoolProgress: true,

  // 4. Unraveling Magnetic Tape Ribbon
  tapeRibbonStyle: 'loose-flowing',
  tapeRibbonEnabled: true,
  waveformIntensity: 65,
  ribbonThickness: 8,
  ribbonGlow: 40,
  ribbonColor: '#3A281E',

  // 5. Retro Atmosphere & Background
  backgroundPreset: 'midnight-studio',
  customBackgroundUrl: undefined,
  analogGrain: true,
  grainIntensity: 22,
  vhsScanlines: false, // subtle scanlines off by default
  scanlineIntensity: 18,

  // 6. The Tape Glitch (Climax Triggered)
  climaxGlitchEnabled: true,
  glitchIntensity: 50,
  glitchThreshold: 0.82,
  glitchCooldownSec: 4.0,
}
