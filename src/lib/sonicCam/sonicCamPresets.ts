/**
 * IndiaTools — SonicCam
 * 9 Curated Beat-Synced Multi-Region Presets
 */

import {
  SonicCamPresetMetadata,
  DEFAULT_SONIC_CAM_CONFIG,
  SonicCamPresetId,
} from './sonicCamTypes.ts'
import { generateCinematicGrid, generateUniformGrid, generateRandomRectangles } from './sonicCamRegionGenerator.ts'

export const SONIC_CAM_PRESETS: SonicCamPresetMetadata[] = [
  {
    id: 'cinematic-discovery',
    name: 'Cinematic Discovery',
    subtitle: 'Full image establishing shot, then slow cinematic region reveals',
    description:
      'Begins with the full photograph to establish context, then smoothly cuts between primary visual regions with interludes returning to the full frame.',
    accentColor: '#38BDF8', // Sky Blue
    enabledModules: ['Full Image Interlude', 'Cinematic Grid', 'Smooth Zoom Cut'],
    config: {
      enabled: true,
      layoutMode: 'cinematic-grid',
      regionCount: 6,
      regions: generateCinematicGrid(6),
      sequencerMode: 'beat-driven',
      beatInterval: 4,
      noBeatBehavior: 'show-full-image',
      fullImageEveryNShots: 3,
      fullImageIntroOutro: true,
      transition: 'smooth-zoom-cut',
      transitionDurationSec: 0.35,
      minShotDurationSec: 0.8,
      maxShotDurationSec: 4.0,
      bassShake: {
        ...DEFAULT_SONIC_CAM_CONFIG.bassShake,
        enabled: false,
      },
    },
  },
  {
    id: 'beat-snap',
    name: 'Beat Snap',
    subtitle: 'Crisp, rhythmically precise cuts locked to detected musical beats',
    description:
      'Every 2 beats trigger an instant cut to a different region of the photograph with snap-zoom punch, perfectly synchronized to the rhythm.',
    accentColor: '#00F0FF', // Cyan
    enabledModules: ['Beat-Driven Cuts', 'Snap-Zoom Punch', 'Uniform Grid'],
    config: {
      enabled: true,
      layoutMode: 'uniform-grid',
      regionCount: 9,
      regions: generateUniformGrid(9),
      sequencerMode: 'every-n-beats',
      beatInterval: 2,
      noBeatBehavior: 'hold-current-region',
      fullImageEveryNShots: 6,
      fullImageIntroOutro: true,
      transition: 'snap-zoom',
      transitionDurationSec: 0.18,
      minShotDurationSec: 0.35,
      bassShake: {
        ...DEFAULT_SONIC_CAM_CONFIG.bassShake,
        enabled: true,
        intensity: 35,
        bassSensitivity: 60,
      },
    },
  },
  {
    id: 'bass-impact',
    name: 'Bass Impact',
    subtitle: 'Beat-driven region cuts with controlled bass micro-shake',
    description:
      'High-energy cuts matched to percussion, featuring controlled camera displacement and rotation on heavy 808 and kick hits with smooth recovery.',
    accentColor: '#EC4899', // Pink
    enabledModules: ['Beat Cuts', 'Bass Micro-Shake', 'Flash Cut'],
    config: {
      enabled: true,
      layoutMode: 'cinematic-grid',
      regionCount: 8,
      regions: generateCinematicGrid(8),
      sequencerMode: 'beat-driven',
      beatInterval: 2,
      noBeatBehavior: 'show-full-image',
      fullImageEveryNShots: 4,
      transition: 'flash-cut',
      transitionDurationSec: 0.20,
      bassShake: {
        ...DEFAULT_SONIC_CAM_CONFIG.bassShake,
        enabled: true,
        intensity: 70,
        bassSensitivity: 75,
        maxDisplacementPx: 18,
        maxRotationDeg: 1.2,
        recoverySpeed: 0.82,
        zoomImpulseEnabled: true,
      },
    },
  },
  {
    id: 'rapid-cuts',
    name: 'Rapid Cuts',
    subtitle: 'High-tempo music video cuts with minimum-hold safety guard',
    description:
      'Fast-paced rhythmic editing switching across varied image quadrants on every beat, bounded by a safe hold interval to prevent eye fatigue.',
    accentColor: '#F59E0B', // Amber
    enabledModules: ['Fast Rhythmic Cuts', 'Random Rectangles', 'Snap Zoom'],
    config: {
      enabled: true,
      layoutMode: 'random-rectangles',
      regionCount: 12,
      regions: generateRandomRectangles(12),
      sequencerMode: 'beat-driven',
      beatInterval: 1,
      minShotDurationSec: 0.30,
      maxShotDurationSec: 1.8,
      noBeatBehavior: 'hold-current-region',
      transition: 'snap-zoom',
      transitionDurationSec: 0.15,
      bassShake: {
        ...DEFAULT_SONIC_CAM_CONFIG.bassShake,
        enabled: true,
        intensity: 40,
        bassSensitivity: 60,
      },
    },
  },
  {
    id: 'slow-emotional',
    name: 'Slow Emotional',
    subtitle: 'Longer contemplation holds and gentle smooth zoom dissolves',
    description:
      'Tailored for acoustic, piano, ambient, or slow vocal compositions. Holds each visual region for 3 to 5 seconds with soft crossfades.',
    accentColor: '#10B981', // Emerald
    enabledModules: ['Long Holds', 'Crossfade Dissolve', 'Subtle Inner Drift'],
    config: {
      enabled: true,
      layoutMode: 'cinematic-grid',
      regionCount: 6,
      regions: generateCinematicGrid(6),
      sequencerMode: 'every-n-beats',
      beatInterval: 8,
      minShotDurationSec: 1.5,
      maxShotDurationSec: 6.0,
      noBeatBehavior: 'return-full-smooth',
      fullImageEveryNShots: 2,
      transition: 'crossfade',
      transitionDurationSec: 0.45,
      bassShake: {
        ...DEFAULT_SONIC_CAM_CONFIG.bassShake,
        enabled: false,
      },
      innerMotion: {
        enabled: true,
        mode: 'subtle-drift',
        intensity: 25,
        speed: 0.4,
      },
    },
  },
  {
    id: 'landscape-explorer',
    name: 'Landscape Explorer',
    subtitle: 'Varied panoramic and foreground crops with directional whip pans',
    description:
      'Cuts from mountains to valleys, rivers, and ground textures, using directional whip pan transitions that make a still photo feel like a multi-camera shoot.',
    accentColor: '#A855F7', // Violet
    enabledModules: ['Cinematic Panorama', 'Whip Pan Transition', 'Rule of Thirds'],
    config: {
      enabled: true,
      layoutMode: 'cinematic-grid',
      regionCount: 8,
      regions: generateCinematicGrid(8),
      sequencerMode: 'beat-driven',
      beatInterval: 4,
      noBeatBehavior: 'show-full-image',
      fullImageEveryNShots: 3,
      transition: 'whip-pan',
      transitionDurationSec: 0.30,
      bassShake: {
        ...DEFAULT_SONIC_CAM_CONFIG.bassShake,
        enabled: true,
        intensity: 30,
        bassSensitivity: 50,
      },
    },
  },
  {
    id: 'object-focus',
    name: 'Object Focus',
    subtitle: 'Macro detail close-ups jumping between focal points on vehicles & products',
    description:
      'Highlights key details of cars, watches, bikes, products, or portraits (wheels, emblems, eyes, textures) with crisp rhythmic cuts.',
    accentColor: '#6366F1', // Indigo
    enabledModules: ['Macro Detail Crops', 'Snap Zoom', 'Subject Focus'],
    config: {
      enabled: true,
      layoutMode: 'cinematic-grid',
      regionCount: 6,
      regions: generateCinematicGrid(6),
      sequencerMode: 'beat-driven',
      beatInterval: 2,
      noBeatBehavior: 'show-full-image',
      fullImageEveryNShots: 4,
      transition: 'snap-zoom',
      transitionDurationSec: 0.20,
      bassShake: {
        ...DEFAULT_SONIC_CAM_CONFIG.bassShake,
        enabled: true,
        intensity: 45,
      },
    },
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    subtitle: 'Pure instant cuts without camera shake or heavy transitions',
    description:
      'Crisp, unadorned film cuts between rectangular crops. No motion blur, no screen shake—just clean rhythmic visual editing.',
    accentColor: '#94A3B8', // Slate
    enabledModules: ['Instant Clean Cut', 'Uniform Grid', 'Zero Distortion'],
    config: {
      enabled: true,
      layoutMode: 'uniform-grid',
      regionCount: 4,
      regions: generateUniformGrid(4),
      sequencerMode: 'beat-driven',
      beatInterval: 2,
      noBeatBehavior: 'show-full-image',
      transition: 'instant-cut',
      transitionDurationSec: 0.0,
      bassShake: {
        ...DEFAULT_SONIC_CAM_CONFIG.bassShake,
        enabled: false,
      },
    },
  },
  {
    id: 'custom-sequence',
    name: 'Custom Sequence',
    subtitle: 'User-defined region order, beat triggers, and timeline arrangement',
    description:
      'Full creative freedom to draw custom regions, adjust crop placement, and select preferred transition types for each beat.',
    accentColor: '#14B8A6', // Teal
    enabledModules: ['Manual Regions', 'Custom Sequencer', 'Editable Timeline'],
    config: {
      enabled: true,
      layoutMode: 'manual',
      regionCount: 6,
      regions: generateCinematicGrid(6),
      sequencerMode: 'beat-driven',
      beatInterval: 2,
      noBeatBehavior: 'show-full-image',
      transition: 'smooth-zoom-cut',
      transitionDurationSec: 0.25,
      bassShake: {
        ...DEFAULT_SONIC_CAM_CONFIG.bassShake,
        enabled: true,
        intensity: 40,
      },
    },
  },
]

export function getSonicCamPreset(id: SonicCamPresetId): SonicCamPresetMetadata {
  const found = SONIC_CAM_PRESETS.find((p) => p.id === id)
  return found || SONIC_CAM_PRESETS[0]
}
