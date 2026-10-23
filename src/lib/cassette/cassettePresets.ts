/**
 * IndiaTools — Vintage Cassette Visualizer
 * Curated Style Presets
 */

import { VintageCassetteStudioConfig, DEFAULT_VINTAGE_CASSETTE_CONFIG } from './cassetteTypes.ts'

export interface CassettePreset {
  id: string
  name: string
  subtitle: string
  description: string
  badge: string
  config: Partial<VintageCassetteStudioConfig>
}

export const CASSETTE_PRESETS: CassettePreset[] = [
  {
    id: 'nostalgic-1994',
    name: 'Nostalgic Mixtape 1994',
    subtitle: 'Warm 90s Smoked Polycarbonate & Ruled Label',
    description: 'Authentic 90s translucent smoked-black tape with handwritten label styling and gentle magnetic ribbon sway.',
    badge: 'SIGNATURE',
    config: {
      cassetteStyle: 'smoked-black',
      shellOpacity: 88,
      labelTemplate: 'classic',
      backgroundPreset: 'midnight-studio',
      tapeRibbonStyle: 'loose-flowing',
      reelSpeed: 1.0,
      bassReactivity: 65,
      analogGrain: true,
      grainIntensity: 22,
      vhsScanlines: false,
      climaxGlitchEnabled: true,
    },
  },
  {
    id: 'cyberpunk-neon-drive',
    name: 'Cyberpunk Neon Drive',
    subtitle: 'Outrun Synthwave Glow & Electric Waveform',
    description: 'Vibrant magenta and cyan neon accents with dynamic audio-reactive magnetic ribbon and VHS tracking.',
    badge: 'POPULAR',
    config: {
      cassetteStyle: 'transparent-clear',
      shellOpacity: 75,
      labelTemplate: 'neon',
      backgroundPreset: 'neon-cyberpunk',
      tapeRibbonStyle: 'cinematic-trail',
      reelSpeed: 1.25,
      bassReactivity: 85,
      ribbonGlow: 75,
      ribbonColor: '#EC4899',
      analogGrain: true,
      grainIntensity: 28,
      vhsScanlines: true,
      scanlineIntensity: 24,
      climaxGlitchEnabled: true,
      glitchIntensity: 65,
    },
  },
  {
    id: 'golden-master-tape',
    name: 'Golden Master Tape',
    subtitle: 'Audiophile Collectors Gold Edition',
    description: 'Luxurious metallic gold reel hubs, warm ambient studio lighting, and smooth symmetrical ribbon audio flow.',
    badge: 'PREMIUM',
    config: {
      cassetteStyle: 'golden-edition',
      shellOpacity: 92,
      metallicAccent: 80,
      labelTemplate: 'transparent',
      backgroundPreset: 'warm-nostalgia',
      tapeRibbonStyle: 'symmetrical-ribbon',
      reelSpeed: 0.95,
      bassReactivity: 55,
      ribbonGlow: 50,
      ribbonColor: '#B45309',
      analogGrain: false,
      vhsScanlines: false,
      climaxGlitchEnabled: false,
    },
  },
  {
    id: 'raw-grunge-analog',
    name: 'Raw Grunge Analog',
    subtitle: 'Distressed Underground Cassette Culture',
    description: 'Worn aged paper label with authentic scuffs, gritty tape grain, and dynamic climax tracking glitches.',
    badge: 'RETRO',
    config: {
      cassetteStyle: 'classic-retro',
      shellOpacity: 95,
      labelTemplate: 'grunge',
      backgroundPreset: 'deep-charcoal',
      tapeRibbonStyle: 'loose-flowing',
      reelSpeed: 1.1,
      bassReactivity: 70,
      analogGrain: true,
      grainIntensity: 42,
      vhsScanlines: true,
      scanlineIntensity: 28,
      climaxGlitchEnabled: true,
      glitchIntensity: 75,
    },
  },
  {
    id: 'clean-transparent-studio',
    name: 'Crystal Clear Studio',
    subtitle: 'Pure Visible Mechanics & Floating Spools',
    description: 'Clean transparent shell showcasing the inner rotating wheels and magnetic tape without heavy filters.',
    badge: 'CLEAN',
    config: {
      cassetteStyle: 'transparent-clear',
      shellOpacity: 55,
      metallicAccent: 30,
      labelTemplate: 'transparent',
      backgroundPreset: 'midnight-studio',
      tapeRibbonStyle: 'symmetrical-ribbon',
      reelSpeed: 1.0,
      bassReactivity: 50,
      analogGrain: false,
      vhsScanlines: false,
      climaxGlitchEnabled: false,
    },
  },
]

export function applyCassettePreset(
  current: VintageCassetteStudioConfig,
  presetId: string
): VintageCassetteStudioConfig {
  const preset = CASSETTE_PRESETS.find((p) => p.id === presetId)
  if (!preset) return current

  return {
    ...current,
    ...preset.config,
    // Preserve user photo and personal metadata
    labelPhotoUrl: current.labelPhotoUrl,
    labelTitle: current.labelTitle,
    labelArtist: current.labelArtist,
    labelSideText: current.labelSideText,
    enabled: true,
  }
}
