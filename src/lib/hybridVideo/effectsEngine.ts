/**
 * IndiaTools — Hybrid Video Studio Cinematic Effects Engine
 * 100% Client-Side Real-Time Color Grading, LUT Presets, Vignette, Film Grain, and Filters
 */

import type { ClipEffects, ColorGrading, CinematicFilters } from './types.ts'

export function buildCssFilterString(effects: ClipEffects): string {
  if (!effects.enabled) return 'none'

  const { colorGrading, filters } = effects
  const filtersList: string[] = []

  // Exposure (-100 to +100 -> brightness 0.2 to 2.0)
  if (colorGrading.exposure !== 0) {
    const brightness = 1 + colorGrading.exposure / 100
    filtersList.push(`brightness(${brightness.toFixed(2)})`)
  }

  // Contrast (-100 to +100 -> contrast 0.2 to 2.2)
  if (colorGrading.contrast !== 0) {
    const contrast = 1 + (colorGrading.contrast / 100) * 1.2
    filtersList.push(`contrast(${contrast.toFixed(2)})`)
  }

  // Saturation (-100 to +100 -> saturate 0 to 2.5)
  if (colorGrading.saturation !== 0) {
    const saturate = Math.max(0, 1 + (colorGrading.saturation / 100) * 1.5)
    filtersList.push(`saturate(${saturate.toFixed(2)})`)
  }

  // Temperature / Tint via hue-rotate / sepia
  if (colorGrading.temperature > 0) {
    // Warm / Golden
    const sepiaVal = (colorGrading.temperature / 100) * 0.45
    filtersList.push(`sepia(${sepiaVal.toFixed(2)})`)
  } else if (colorGrading.temperature < 0) {
    // Cool / Blueish
    const hueVal = (Math.abs(colorGrading.temperature) / 100) * 180
    filtersList.push(`hue-rotate(${hueVal.toFixed(0)}deg)`)
  }

  // LUT Presets mapped to CSS filter blends
  switch (colorGrading.lutPreset) {
    case 'teal-orange':
      filtersList.push('contrast(1.15) saturate(1.25) hue-rotate(-8deg)')
      break
    case 'cyberpunk-neon':
      filtersList.push('contrast(1.28) saturate(1.7) hue-rotate(25deg)')
      break
    case 'vintage-film':
      filtersList.push('sepia(0.35) contrast(0.92) brightness(1.05) saturate(0.85)')
      break
    case 'bw-contrast':
      filtersList.push('grayscale(100%) contrast(1.4) brightness(0.95)')
      break
    case 'golden-hour':
      filtersList.push('sepia(0.28) saturate(1.3) brightness(1.08)')
      break
    case 'clean-studio':
      filtersList.push('contrast(1.08) brightness(1.02) saturate(1.05)')
      break
  }

  // Blur
  if (filters.blurPx > 0) {
    filtersList.push(`blur(${filters.blurPx}px)`)
  }

  return filtersList.length > 0 ? filtersList.join(' ') : 'none'
}

/**
 * Render procedural overlays (Vignette, Film Grain, Glow) onto the canvas for a clip or whole scene.
 */
export function applyProceduralEffects(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  effects: ClipEffects,
  seed = 0
): void {
  if (!effects.enabled) return

  const { filters } = effects

  // 1. Cinematic Vignette
  if (filters.vignette > 0) {
    ctx.save()
    const radius = Math.hypot(width, height) / 2
    const grad = ctx.createRadialGradient(
      width / 2,
      height / 2,
      radius * (1 - filters.vignette / 120),
      width / 2,
      height / 2,
      radius
    )
    const alpha = (filters.vignette / 100) * 0.85
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)')
    grad.addColorStop(1, `rgba(0, 0, 0, ${alpha.toFixed(2)})`)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  }

  // 2. Film Grain
  if (filters.filmGrain > 0) {
    ctx.save()
    ctx.globalAlpha = (filters.filmGrain / 100) * 0.12
    ctx.fillStyle = '#FFFFFF'

    const particleCount = Math.floor((width * height) / 1200)
    for (let i = 0; i < particleCount; i++) {
      const rx = (Math.sin(seed + i * 997.3) * 0.5 + 0.5) * width
      const ry = (Math.cos(seed + i * 533.1) * 0.5 + 0.5) * height
      const size = 1 + (i % 2)
      ctx.fillRect(rx, ry, size, size)
    }
    ctx.restore()
  }

  // 3. Cinematic Glow / Bloom overlay
  if (filters.glow > 0) {
    ctx.save()
    ctx.globalCompositeOperation = 'screen'
    ctx.globalAlpha = (filters.glow / 100) * 0.25
    ctx.fillStyle = 'rgba(255, 235, 200, 0.4)'
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  }
}
