/**
 * IndiaTools — SonicCam
 * Multi-Region Algorithmic Layout Generator
 */

import { type ImageRegion, type RegionLayoutMode, REGION_COLORS } from './sonicCamTypes.ts'

export function generateAutoRegions(
  mode: RegionLayoutMode,
  count: number,
  imgWidth = 1920,
  imgHeight = 1080
): ImageRegion[] {
  const boundedCount = Math.max(2, Math.min(25, count))

  switch (mode) {
    case 'uniform-grid':
      return generateUniformGrid(boundedCount)
    case 'cinematic-grid':
      return generateCinematicGrid(boundedCount)
    case 'random-rectangles':
      return generateRandomRectangles(boundedCount)
    case 'manual':
    default:
      return generateCinematicGrid(boundedCount)
  }
}

/**
 * A. Uniform Grid: Even rectangular divisions
 */
export function generateUniformGrid(count: number): ImageRegion[] {
  let cols = 2
  let rows = 2

  if (count <= 4) {
    cols = 2
    rows = 2
  } else if (count <= 6) {
    cols = 3
    rows = 2
  } else if (count <= 9) {
    cols = 3
    rows = 3
  } else if (count <= 12) {
    cols = 4
    rows = 3
  } else if (count <= 16) {
    cols = 4
    rows = 4
  } else {
    cols = 5
    rows = 5
  }

  const regions: ImageRegion[] = []
  const w = 1.0 / cols
  const h = 1.0 / rows

  let idx = 0
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (idx >= count) break
      regions.push({
        id: `reg-${idx + 1}`,
        label: `Region ${idx + 1} (${cols}x${rows})`,
        x: Math.round(c * w * 1000) / 1000,
        y: Math.round(r * h * 1000) / 1000,
        width: Math.round(w * 1000) / 1000,
        height: Math.round(h * 1000) / 1000,
        color: REGION_COLORS[idx % REGION_COLORS.length],
      })
      idx++
    }
  }

  return regions
}

/**
 * B. Cinematic Grid: Mix of wide hero shots, vertical details, and corner macro crops
 */
export function generateCinematicGrid(count: number): ImageRegion[] {
  const regions: ImageRegion[] = []

  // Pre-configured curated cinematic layout archetypes (normalized [0, 1])
  const archetypes: { label: string; x: number; y: number; w: number; h: number }[] = [
    // 1. Center Hero Wide Shot
    { label: 'Center Focal Hero', x: 0.18, y: 0.18, w: 0.64, h: 0.64 },
    // 2. Upper Panoramic Detail (e.g. mountain peaks / sky / architecture skyline)
    { label: 'Skyline Panorama', x: 0.05, y: 0.04, w: 0.75, h: 0.42 },
    // 3. Lower Foreground Anchor (e.g. flowers, lake, road, foreground texture)
    { label: 'Lower Ground Texture', x: 0.15, y: 0.54, w: 0.70, h: 0.42 },
    // 4. Left Rule-of-Thirds Vertical
    { label: 'Left Subject Crop', x: 0.06, y: 0.15, w: 0.44, h: 0.70 },
    // 5. Right Rule-of-Thirds Vertical
    { label: 'Right Subject Crop', x: 0.50, y: 0.15, w: 0.44, h: 0.70 },
    // 6. Tight Focal Close-up
    { label: 'Macro Center Focus', x: 0.32, y: 0.30, w: 0.36, h: 0.40 },
    // 7. Top-Left Detail
    { label: 'Top-Left Corner Detail', x: 0.05, y: 0.05, w: 0.42, h: 0.42 },
    // 8. Bottom-Right Detail
    { label: 'Bottom-Right Foreground', x: 0.52, y: 0.52, w: 0.43, h: 0.43 },
    // 9. Full Widescreen Sweep
    { label: 'Cinematic Widescreen', x: 0.02, y: 0.25, w: 0.96, h: 0.50 },
    // 10. Top-Right Angle
    { label: 'Top-Right Atmospheric', x: 0.54, y: 0.05, w: 0.41, h: 0.42 },
    // 11. Bottom-Left Anchor
    { label: 'Bottom-Left Anchor', x: 0.05, y: 0.52, w: 0.42, h: 0.43 },
    // 12. Ultra Tight Macro
    { label: 'Ultra Macro Element', x: 0.40, y: 0.38, w: 0.22, h: 0.25 },
  ]

  for (let i = 0; i < count; i++) {
    const arch = archetypes[i % archetypes.length]
    regions.push({
      id: `reg-${i + 1}`,
      label: arch.label,
      x: arch.x,
      y: arch.y,
      width: arch.w,
      height: arch.h,
      color: REGION_COLORS[i % REGION_COLORS.length],
    })
  }

  return regions
}

/**
 * C. Random Rectangles: Varied, reproducible non-trivial crops
 */
export function generateRandomRectangles(count: number): ImageRegion[] {
  const regions: ImageRegion[] = []

  // Deterministic pseudo-random distribution based on golden ratio
  const phi = 0.618033988749895

  for (let i = 0; i < count; i++) {
    const rand1 = ((i + 1) * phi) % 1
    const rand2 = ((i + 1) * phi * 1.618) % 1
    const rand3 = ((i + 1) * phi * 2.618) % 1
    const rand4 = ((i + 1) * phi * 3.618) % 1

    // Width between 0.30 and 0.65
    const w = 0.30 + rand3 * 0.35
    // Height between 0.30 and 0.65
    const h = 0.30 + rand4 * 0.35

    // Position clamped inside [0, 1]
    const x = Math.max(0, Math.min(1 - w, rand1 * (1 - w)))
    const y = Math.max(0, Math.min(1 - h, rand2 * (1 - h)))

    regions.push({
      id: `reg-${i + 1}`,
      label: `Crop Shot ${i + 1}`,
      x: Math.round(x * 1000) / 1000,
      y: Math.round(y * 1000) / 1000,
      width: Math.round(w * 1000) / 1000,
      height: Math.round(h * 1000) / 1000,
      color: REGION_COLORS[i % REGION_COLORS.length],
    })
  }

  return regions
}
