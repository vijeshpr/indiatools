/**
 * IndiaTools — Music-Grown Garden Studio
 * Garden World Scene Library & Botanical Presets
 */

import { GardenSceneMetadata, GardenSceneId } from './gardenTypes.ts'

export const GARDEN_SCENES: GardenSceneMetadata[] = [
  {
    id: 'moonlit-rose',
    name: 'Moonlit Rose Garden',
    subtitle: 'Deep Twilight & Dewy Velvety Roses',
    description:
      'Lush blooming roses in deep blue moonlight, soft drifting mist, and shimmering night fireflies designed for slow, emotional melodies.',
    imagePath: '/images/garden/moonlit-rose-garden.webp',
    thumbnailPath: '/images/garden/moonlit-rose-garden_thumb.webp',
    fallbackTheme: {
      skyTop: '#060B19',
      skyBottom: '#111D38',
      groundColor: '#091322',
      mistColor: 'rgba(88, 130, 190, 0.12)',
      fireflyColor: 'rgba(147, 197, 253, 0.85)',
      pollenColor: 'rgba(219, 234, 254, 0.7)',
      lightRayColor: 'rgba(125, 175, 255, 0.18)',
      primaryFlowerColor: '#E11D48',
      secondaryFlowerColor: '#881337',
      centerColor: '#FDE047',
      foliageColor: '#064E3B',
    },
  },
  {
    id: 'golden-hour-meadow',
    name: 'Golden Hour Flower Meadow',
    subtitle: 'Sun-Drenched Wildflowers & Warm Backlight',
    description:
      'Radiant wildflowers bathed in warm late-afternoon sunlight, golden haze, and swaying grasses responding to acoustic and uplift tracks.',
    imagePath: '/images/garden/golden-hour-meadow.webp',
    thumbnailPath: '/images/garden/golden-hour-meadow_thumb.webp',
    fallbackTheme: {
      skyTop: '#451A03',
      skyBottom: '#9A3412',
      groundColor: '#2D1606',
      mistColor: 'rgba(251, 191, 36, 0.14)',
      fireflyColor: 'rgba(253, 224, 71, 0.9)',
      pollenColor: 'rgba(254, 240, 138, 0.8)',
      lightRayColor: 'rgba(251, 146, 60, 0.22)',
      primaryFlowerColor: '#F59E0B',
      secondaryFlowerColor: '#DC2626',
      centerColor: '#78350F',
      foliageColor: '#365314',
    },
  },
  {
    id: 'white-jasmine-night',
    name: 'White Jasmine Night Garden',
    subtitle: 'Fragrant Starry Night & Delicate White Petals',
    description:
      'Pure white star jasmine and dark emerald leaves illuminated by gentle moonlight, with high-frequency sparkling fireflies.',
    imagePath: '/images/garden/white-jasmine-night.webp',
    thumbnailPath: '/images/garden/white-jasmine-night_thumb.webp',
    fallbackTheme: {
      skyTop: '#050A0E',
      skyBottom: '#0D212F',
      groundColor: '#061318',
      mistColor: 'rgba(165, 243, 252, 0.1)',
      fireflyColor: 'rgba(207, 250, 254, 0.9)',
      pollenColor: 'rgba(255, 255, 255, 0.75)',
      lightRayColor: 'rgba(186, 230, 253, 0.16)',
      primaryFlowerColor: '#F8FAFC',
      secondaryFlowerColor: '#CBD5E1',
      centerColor: '#FEF08A',
      foliageColor: '#065F46',
    },
  },
  {
    id: 'rain-kissed-botanical',
    name: 'Rain-Kissed Botanical Garden',
    subtitle: 'Dew-Drenched Tropical Foliage & Water Droplets',
    description:
      'Atmospheric rainy day garden with glistening wet petals, glossy jungle leaves, soft reflections, and moody cinematic lighting.',
    imagePath: '/images/garden/rain-kissed-botanical.webp',
    thumbnailPath: '/images/garden/rain-kissed-botanical_thumb.webp',
    fallbackTheme: {
      skyTop: '#09151B',
      skyBottom: '#162C36',
      groundColor: '#0B1A20',
      mistColor: 'rgba(148, 163, 184, 0.18)',
      fireflyColor: 'rgba(56, 189, 248, 0.85)',
      pollenColor: 'rgba(186, 230, 253, 0.65)',
      lightRayColor: 'rgba(203, 213, 225, 0.14)',
      primaryFlowerColor: '#EC4899',
      secondaryFlowerColor: '#9D174D',
      centerColor: '#FDE047',
      foliageColor: '#044E3B',
    },
  },
  {
    id: 'dreamlike-glowing',
    name: 'Dreamlike Glowing Garden',
    subtitle: 'Luminescent Night Flora & Ethereal Spores',
    description:
      'Photorealistic bioluminescent botanical paradise with subtle glowing petal veins, floating stardust spores, and ethereal evening aura.',
    imagePath: '/images/garden/dreamlike-glowing-garden.webp',
    thumbnailPath: '/images/garden/dreamlike-glowing-garden_thumb.webp',
    fallbackTheme: {
      skyTop: '#130424',
      skyBottom: '#2E1065',
      groundColor: '#1A0B2E',
      mistColor: 'rgba(192, 132, 252, 0.14)',
      fireflyColor: 'rgba(167, 139, 250, 0.95)',
      pollenColor: 'rgba(232, 121, 249, 0.85)',
      lightRayColor: 'rgba(168, 85, 247, 0.2)',
      primaryFlowerColor: '#A855F7',
      secondaryFlowerColor: '#6B21A8',
      centerColor: '#38BDF8',
      foliageColor: '#1E293B',
    },
  },
  {
    id: 'calm-garden-dawn',
    name: 'Calm Garden at Dawn',
    subtitle: 'Awakening Flower Buds & Pastel Morning Sunrise',
    description:
      'Fresh flower buds gradually opening with the rising sun, soft morning mist, pastel skies, and serene growth symbolizing new beginnings.',
    imagePath: '/images/garden/calm-garden-dawn.webp',
    thumbnailPath: '/images/garden/calm-garden-dawn_thumb.webp',
    fallbackTheme: {
      skyTop: '#2E1065',
      skyBottom: '#F472B6',
      groundColor: '#1C1917',
      mistColor: 'rgba(253, 186, 116, 0.16)',
      fireflyColor: 'rgba(254, 215, 170, 0.9)',
      pollenColor: 'rgba(255, 237, 213, 0.75)',
      lightRayColor: 'rgba(251, 146, 60, 0.25)',
      primaryFlowerColor: '#FB7185',
      secondaryFlowerColor: '#BE123C',
      centerColor: '#FDE047',
      foliageColor: '#15803D',
    },
  },
]

export function getGardenScene(sceneId: GardenSceneId): GardenSceneMetadata {
  return (
    GARDEN_SCENES.find((s) => s.id === sceneId) ||
    GARDEN_SCENES[0]
  )
}
