/**
 * IndiaTools — Music-Grown Garden Studio
 * Type Definitions & Configuration Interfaces
 */

export type GardenSceneId =
  | 'moonlit-rose'
  | 'golden-hour-meadow'
  | 'white-jasmine-night'
  | 'rain-kissed-botanical'
  | 'dreamlike-glowing'
  | 'calm-garden-dawn'
  | 'custom-photo'

export interface GardenSceneMetadata {
  id: GardenSceneId
  name: string
  subtitle: string
  description: string
  imagePath: string
  thumbnailPath: string
  fallbackTheme: {
    skyTop: string
    skyBottom: string
    groundColor: string
    mistColor: string
    fireflyColor: string
    pollenColor: string
    lightRayColor: string
    primaryFlowerColor: string
    secondaryFlowerColor: string
    centerColor: string
    foliageColor: string
  }
}

export interface GardenBloomConfig {
  enabled: boolean
  intensity: number // 0 to 100
  responseSpeed: number // 0.1 to 1.0 (interpolation factor)
  beatBloomPulse: boolean
  gradualSongBloom: boolean
  bloomStartTimeSec: number
  maxBloomLevel: number // 0.2 to 1.0
  flowerCount: number // 4 to 12 main botanical bloom centers
  petalLayers: number // 2 to 4 layered petal rings
}

export interface GardenAudioMappingConfig {
  bassToBloom: number // 0 to 100
  bassToGardenPulse: number // 0 to 100
  midToLeafSway: number // 0 to 100
  trebleToFireflies: number // 0 to 100
  trebleToPollenSparkle: number // 0 to 100
  energyToAmbientLighting: number // 0 to 100
  beatToPetalAccents: number // 0 to 100
  smoothingFactor: number // 0.1 (fast) to 0.95 (ultra-smooth)
}

export interface GardenAtmosphereConfig {
  firefliesEnabled: boolean
  fireflyCount: number // 10 to 80
  fireflySize: number // 1.5 to 5.0
  pollenEnabled: boolean
  pollenDensity: number // 15 to 100
  pollenSize: number // 1.0 to 4.0
  mistEnabled: boolean
  mistDensity: number // 10 to 100
  lightRaysEnabled: boolean
  lightRayIntensity: number // 10 to 100
  windEnabled: boolean
  windSpeed: number // 1 to 10
  windDirectionDeg: number // -45 to 45
  dewHighlightsEnabled: boolean
  parallaxEnabled: boolean
  parallaxDepth: number // 2 to 20
}

export interface GardenCustomPhotoConfig {
  customImageUrl: string | null
  customImageFit: 'cover' | 'contain' | '100%'
  brightness: number // 20 to 150
  overlayOpacity: number // 0 to 100
}

export interface MusicGrownGardenConfig {
  enabled: boolean // Master Garden Mode switch (must start OFF)
  sceneId: GardenSceneId
  bloom: GardenBloomConfig
  audioMapping: GardenAudioMappingConfig
  atmosphere: GardenAtmosphereConfig
  customPhoto: GardenCustomPhotoConfig
  isBeforeActive: boolean // Before / After comparison
}

export const DEFAULT_GARDEN_CONFIG: MusicGrownGardenConfig = {
  enabled: false, // Starts OFF per requirements
  sceneId: 'moonlit-rose',
  bloom: {
    enabled: false, // Starts OFF
    intensity: 65,
    responseSpeed: 0.35,
    beatBloomPulse: false,
    gradualSongBloom: false,
    bloomStartTimeSec: 0,
    maxBloomLevel: 0.95,
    flowerCount: 7,
    petalLayers: 3,
  },
  audioMapping: {
    bassToBloom: 75,
    bassToGardenPulse: 40,
    midToLeafSway: 60,
    trebleToFireflies: 80,
    trebleToPollenSparkle: 70,
    energyToAmbientLighting: 50,
    beatToPetalAccents: 45,
    smoothingFactor: 0.8,
  },
  atmosphere: {
    firefliesEnabled: false, // Starts OFF
    fireflyCount: 35,
    fireflySize: 2.8,
    pollenEnabled: false, // Starts OFF
    pollenDensity: 40,
    pollenSize: 2.0,
    mistEnabled: false, // Starts OFF
    mistDensity: 35,
    lightRaysEnabled: false, // Starts OFF
    lightRayIntensity: 45,
    windEnabled: false, // Starts OFF
    windSpeed: 4,
    windDirectionDeg: 15,
    dewHighlightsEnabled: false, // Starts OFF
    parallaxEnabled: false, // Starts OFF
    parallaxDepth: 8,
  },
  customPhoto: {
    customImageUrl: null,
    customImageFit: 'cover',
    brightness: 100,
    overlayOpacity: 70,
  },
  isBeforeActive: false,
}
