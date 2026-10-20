/**
 * IndiaTools — Audio Spectrum Video Studio 2.0
 * 20 Distinct Visualizer Rendering Engines with Specialized Mathematics,
 * Geometry, Particle Dynamics, and DSP Frequency Mapping.
 */

import {
  DetailedAudioBands,
  ThemeColors,
  VisualizerPreset,
  DottedMatrixConfig,
} from './audioVisualizerTypes.ts'
import { PeakHoldManager } from './audioDspEngine.ts'
import { studioDottedMatrixEngine } from './dottedHarmonicMatrixEngine.ts'

export interface VisualizerRenderContext {
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  freqData: Uint8Array
  timeData: Uint8Array
  bands: DetailedAudioBands
  palette: ThemeColors
  currentTime: number
  peakManager: PeakHoldManager
  barCount: number
  sensitivity: number
  bassReactivity: number
  glowStrength: number
  spinSpeed: number
  centerX: number
  centerY: number
  primaryRadius: number
  enableVinylRotation?: boolean
  currentPhoto?: HTMLImageElement | null
  dottedMatrixConfig?: DottedMatrixConfig
}

/**
 * Main Dispatcher: renders one of the 20 visualizer engines based on preset
 */
export function renderVisualizerEngine(
  preset: VisualizerPreset,
  rc: VisualizerRenderContext
) {
  switch (preset) {
    case 'circular-harmonic-spectrum':
    case 'circular-pulse':
      drawCircularHarmonicSpectrum(rc)
      break
    case 'dual-ring-counter-rotating':
      drawDualRingCounterRotating(rc)
      break
    case 'radial-3d-perspective':
      drawRadial3dPerspective(rc)
      break
    case 'minimalist-oscilloscope':
    case 'smooth-waveform':
      drawMinimalistOscilloscope(rc)
      break
    case 'symmetrical-mirror-waveform':
      drawSymmetricalMirrorWaveform(rc)
      break
    case 'neon-segmented-equalizer':
    case 'linear-bars':
      drawNeonSegmentedEqualizer(rc)
      break
    case 'galaxy-vortex-spectrum':
      drawGalaxyVortexSpectrum(rc)
      break
    case 'orbital-energy-rings':
      drawOrbitalEnergyRings(rc)
      break
    case 'album-cover-reactive-halo':
      drawAlbumCoverReactiveHalo(rc)
      break
    case 'futuristic-hud-telemetry':
    case 'cyberpunk-oscilloscope':
      drawFuturisticHudTelemetry(rc)
      break
    case 'liquid-metawave-surface':
      drawLiquidMetawaveSurface(rc)
      break
    case 'perspective-spectrum-tunnel':
      drawPerspectiveSpectrumTunnel(rc)
      break
    case 'glowing-ribbon-trails':
      drawGlowingRibbonTrails(rc)
      break
    case 'dotted-harmonic-matrix':
      drawDottedHarmonicMatrix(rc)
      break
    case 'cinematic-topographic-landscape':
      drawCinematicTopographicLandscape(rc)
      break
    case 'bottom-edge-broadcast-bars':
      drawBottomEdgeBroadcastBars(rc)
      break
    case 'portrait-edge-spectrum':
      drawPortraitEdgeSpectrum(rc)
      break
    case 'kinetic-audio-typography':
      drawKineticAudioTypographyWave(rc)
      break
    case 'luxury-minimal-line':
      drawLuxuryMinimalLine(rc)
      break
    case 'multilayer-symphonic-composite':
      drawMultilayerSymphonicComposite(rc)
      break
    default:
      drawCircularHarmonicSpectrum(rc)
      break
  }
}

// -------------------------------------------------------------
// 1. Circular Harmonic Spectrum
// -------------------------------------------------------------
export function drawCircularHarmonicSpectrum(rc: VisualizerRenderContext) {
  const { ctx, freqData, palette, centerX, centerY, primaryRadius, barCount, sensitivity, bassReactivity, currentTime, spinSpeed } = rc

  ctx.save()
  const rotAngle = currentTime * (spinSpeed || 0.4)
  ctx.translate(centerX, centerY)
  ctx.rotate(rotAngle)

  const bars = Math.min(barCount, 120)
  const angleStep = (Math.PI * 2) / bars
  const pulseRadius = primaryRadius * (1 + rc.bands.bass * 0.15 * bassReactivity)

  ctx.lineCap = 'round'

  for (let i = 0; i < bars; i++) {
    const angle = i * angleStep
    // Symmetrical frequency sampling
    const halfIndex = i < bars / 2 ? i : bars - 1 - i
    const sampleIdx = Math.floor((halfIndex / (bars / 2)) * (freqData.length * 0.7))
    const rawVal = freqData[sampleIdx] || 0
    const magnitude = (rawVal / 255) * 160 * sensitivity

    const x1 = Math.cos(angle) * pulseRadius
    const y1 = Math.sin(angle) * pulseRadius
    const x2 = Math.cos(angle) * (pulseRadius + magnitude)
    const y2 = Math.sin(angle) * (pulseRadius + magnitude)

    const grad = ctx.createLinearGradient(x1, y1, x2, y2)
    grad.addColorStop(0, palette.primary)
    grad.addColorStop(0.65, palette.secondary)
    grad.addColorStop(1, palette.accent)

    ctx.strokeStyle = grad
    ctx.lineWidth = Math.max(2, (pulseRadius * Math.PI) / bars - 1.5)
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  ctx.restore()
}

// -------------------------------------------------------------
// 2. Dual-Ring Counter-Rotating Spectrum
// -------------------------------------------------------------
export function drawDualRingCounterRotating(rc: VisualizerRenderContext) {
  const { ctx, freqData, palette, centerX, centerY, primaryRadius, barCount, sensitivity, currentTime } = rc

  ctx.save()
  ctx.translate(centerX, centerY)

  const bars = Math.min(barCount, 96)
  const angleStep = (Math.PI * 2) / bars

  // Inner Ring (Bass / Clockwise)
  ctx.save()
  ctx.rotate(currentTime * 0.5)
  const innerRadius = primaryRadius * 0.82
  for (let i = 0; i < bars; i++) {
    const angle = i * angleStep
    const sampleIdx = Math.floor((i / bars) * (freqData.length * 0.25))
    const mag = ((freqData[sampleIdx] || 0) / 255) * 90 * sensitivity

    const x1 = Math.cos(angle) * innerRadius
    const y1 = Math.sin(angle) * innerRadius
    const x2 = Math.cos(angle) * (innerRadius - mag)
    const y2 = Math.sin(angle) * (innerRadius - mag)

    ctx.strokeStyle = palette.primary
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }
  ctx.restore()

  // Outer Ring (Treble / Counter-Clockwise)
  ctx.save()
  ctx.rotate(-currentTime * 0.35)
  const outerRadius = primaryRadius * 1.15
  for (let i = 0; i < bars; i++) {
    const angle = i * angleStep
    const sampleIdx = Math.floor(freqData.length * 0.35 + (i / bars) * (freqData.length * 0.55))
    const mag = ((freqData[sampleIdx] || 0) / 255) * 120 * sensitivity

    const x1 = Math.cos(angle) * outerRadius
    const y1 = Math.sin(angle) * outerRadius
    const x2 = Math.cos(angle) * (outerRadius + mag)
    const y2 = Math.sin(angle) * (outerRadius + mag)

    ctx.strokeStyle = palette.accent
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }
  ctx.restore()

  ctx.restore()
}

// -------------------------------------------------------------
// 3. 3D-Projected Radial Bars
// -------------------------------------------------------------
export function drawRadial3dPerspective(rc: VisualizerRenderContext) {
  const { ctx, freqData, palette, centerX, centerY, primaryRadius, barCount, sensitivity, currentTime } = rc

  ctx.save()
  ctx.translate(centerX, centerY)

  const bars = Math.min(barCount, 84)
  const angleStep = (Math.PI * 2) / bars
  const tilt = 0.55 // pseudo-3D tilt aspect

  for (let i = 0; i < bars; i++) {
    const angle = i * angleStep + currentTime * 0.25
    const sampleIdx = Math.floor((i / bars) * (freqData.length * 0.7))
    const height = ((freqData[sampleIdx] || 0) / 255) * 140 * sensitivity

    const cosA = Math.cos(angle)
    const sinA = Math.sin(angle)

    // Shadow projection
    ctx.fillStyle = 'rgba(0,0,0,0.45)'
    ctx.beginPath()
    ctx.arc(cosA * primaryRadius + 8, (sinA * primaryRadius) * tilt + 12, Math.max(1, height * 0.12), 0, Math.PI * 2)
    ctx.fill()

    // 3D pillar projection
    const px1 = cosA * primaryRadius
    const py1 = (sinA * primaryRadius) * tilt
    const px2 = cosA * (primaryRadius + height)
    const py2 = (sinA * (primaryRadius + height)) * tilt

    const grad = ctx.createLinearGradient(px1, py1, px2, py2)
    grad.addColorStop(0, palette.secondary)
    grad.addColorStop(1, palette.accent)

    ctx.strokeStyle = grad
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(px1, py1)
    ctx.lineTo(px2, py2)
    ctx.stroke()
  }

  ctx.restore()
}

// -------------------------------------------------------------
// 4. Minimalist Oscilloscope Waveform
// -------------------------------------------------------------
export function drawMinimalistOscilloscope(rc: VisualizerRenderContext) {
  const { ctx, width, height, timeData, palette, centerY, sensitivity } = rc

  ctx.save()
  ctx.lineWidth = 3
  ctx.strokeStyle = palette.primary
  ctx.shadowColor = palette.glow
  ctx.shadowBlur = 18

  ctx.beginPath()
  const sliceWidth = width / (timeData.length - 1)
  let x = 0

  for (let i = 0; i < timeData.length; i++) {
    const v = (timeData[i] - 128) / 128 // -1.0 to 1.0
    const y = centerY + v * (height * 0.22) * sensitivity

    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
    x += sliceWidth
  }

  ctx.stroke()
  ctx.restore()
}

// -------------------------------------------------------------
// 5. Symmetrical Mirror Waveform
// -------------------------------------------------------------
export function drawSymmetricalMirrorWaveform(rc: VisualizerRenderContext) {
  const { ctx, width, freqData, palette, centerY, barCount, sensitivity } = rc

  ctx.save()
  const bars = Math.min(barCount, 128)
  const barWidth = width / bars

  for (let i = 0; i < bars; i++) {
    const sampleIdx = Math.floor((i / bars) * (freqData.length * 0.75))
    const mag = ((freqData[sampleIdx] || 0) / 255) * 220 * sensitivity
    const x = i * barWidth

    const grad = ctx.createLinearGradient(x, centerY - mag, x, centerY + mag)
    grad.addColorStop(0, palette.accent)
    grad.addColorStop(0.5, palette.primary)
    grad.addColorStop(1, palette.accent)

    ctx.fillStyle = grad
    // Top half
    ctx.fillRect(x, centerY - mag, barWidth - 1.5, mag)
    // Bottom reflected half (slightly more transparent)
    ctx.fillStyle = palette.secondary
    ctx.globalAlpha = 0.55
    ctx.fillRect(x, centerY, barWidth - 1.5, mag * 0.85)
    ctx.globalAlpha = 1.0
  }

  ctx.restore()
}

// -------------------------------------------------------------
// 6. Neon Segmented Equalizer (with Peak Hold)
// -------------------------------------------------------------
export function drawNeonSegmentedEqualizer(rc: VisualizerRenderContext) {
  const { ctx, width, height, freqData, palette, peakManager, barCount, sensitivity } = rc

  ctx.save()
  const bars = Math.min(barCount, 64)
  const marginX = width * 0.08
  const availWidth = width - marginX * 2
  const barWidth = (availWidth / bars) * 0.72
  const barGap = (availWidth / bars) * 0.28
  const baseY = height * 0.78
  const maxBarHeight = height * 0.36

  const currentMagnitudes: number[] = []

  for (let i = 0; i < bars; i++) {
    const sampleIdx = Math.floor((i / bars) * (freqData.length * 0.65))
    const mag = ((freqData[sampleIdx] || 0) / 255) * maxBarHeight * sensitivity
    currentMagnitudes.push(mag)

    const x = marginX + i * (barWidth + barGap)
    const blockCount = Math.floor(mag / 9)

    for (let b = 0; b < blockCount; b++) {
      const y = baseY - b * 9
      const ratio = b / (maxBarHeight / 9)
      ctx.fillStyle = ratio > 0.8 ? palette.accent : ratio > 0.5 ? palette.secondary : palette.primary
      ctx.fillRect(x, y - 6, barWidth, 6)
    }
  }

  // Draw gravity-falling peak holds
  const peaks = peakManager.update(currentMagnitudes)
  ctx.fillStyle = '#ffffff'
  for (let i = 0; i < bars; i++) {
    const x = marginX + i * (barWidth + barGap)
    const peakY = baseY - peaks[i]
    ctx.fillRect(x, peakY - 3, barWidth, 3)
  }

  ctx.restore()
}

// -------------------------------------------------------------
// 7. Galaxy Vortex Particle Spectrum
// -------------------------------------------------------------
export function drawGalaxyVortexSpectrum(rc: VisualizerRenderContext) {
  const { ctx, freqData, palette, centerX, centerY, primaryRadius, sensitivity, currentTime } = rc

  ctx.save()
  ctx.translate(centerX, centerY)

  const spiralCount = 4
  const particlesPerArm = 55
  const baseRotation = currentTime * 0.6

  for (let arm = 0; arm < spiralCount; arm++) {
    const armAngle = (arm * (Math.PI * 2)) / spiralCount + baseRotation

    for (let p = 0; p < particlesPerArm; p++) {
      const frac = p / particlesPerArm
      const sampleIdx = Math.floor(frac * (freqData.length * 0.6))
      const reactive = ((freqData[sampleIdx] || 0) / 255) * sensitivity

      const dist = primaryRadius * 0.3 + frac * primaryRadius * 1.6 + reactive * 60
      const theta = armAngle + frac * 4.2

      const px = Math.cos(theta) * dist
      const py = Math.sin(theta) * dist
      const size = Math.max(1.5, frac * 5 + reactive * 4)

      ctx.fillStyle = frac > 0.65 ? palette.accent : frac > 0.3 ? palette.secondary : palette.primary
      ctx.shadowColor = palette.glow
      ctx.shadowBlur = 10

      ctx.beginPath()
      ctx.arc(px, py, size, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  ctx.restore()
}

// -------------------------------------------------------------
// 8. Orbital Energy Rings
// -------------------------------------------------------------
export function drawOrbitalEnergyRings(rc: VisualizerRenderContext) {
  const { ctx, bands, palette, centerX, centerY, primaryRadius, currentTime } = rc

  ctx.save()
  ctx.translate(centerX, centerY)

  const ringCount = 5
  ctx.lineWidth = 2.5

  for (let r = 0; r < ringCount; r++) {
    const baseR = primaryRadius * (0.6 + r * 0.22)
    const speed = (r % 2 === 0 ? 1 : -1) * (0.4 + r * 0.15)
    const segments = 60

    ctx.strokeStyle = r % 2 === 0 ? palette.primary : palette.accent
    ctx.shadowColor = palette.glow
    ctx.shadowBlur = 12

    ctx.beginPath()
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2
      const sineWave = Math.sin(theta * (3 + r) + currentTime * speed) * (bands.bass * 28 + bands.mids * 15)
      const radius = baseR + sineWave
      const px = Math.cos(theta) * radius
      const py = Math.sin(theta) * radius

      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.stroke()
  }

  ctx.restore()
}

// -------------------------------------------------------------
// 9. Album-Cover Reactive Halo
// -------------------------------------------------------------
export function drawAlbumCoverReactiveHalo(rc: VisualizerRenderContext) {
  const { ctx, bands, palette, centerX, centerY, primaryRadius, currentTime } = rc

  ctx.save()
  const haloScale = 1 + bands.bass * 0.35
  const pulseR = primaryRadius * haloScale

  // Outer ambient shockwaves
  for (let s = 1; s <= 3; s++) {
    const waveProgress = ((currentTime * 1.5 + s * 0.33) % 1)
    const waveRadius = primaryRadius + waveProgress * 120
    const waveAlpha = (1 - waveProgress) * 0.45 * bands.bass

    ctx.strokeStyle = palette.accent
    ctx.globalAlpha = Math.max(0, waveAlpha)
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2)
    ctx.stroke()
  }

  ctx.globalAlpha = 1.0

  // Inner multi-gradient neon halo
  const grad = ctx.createRadialGradient(centerX, centerY, primaryRadius * 0.85, centerX, centerY, pulseR * 1.3)
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(0.5, palette.glow)
  grad.addColorStop(1, 'rgba(0,0,0,0)')

  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(centerX, centerY, pulseR * 1.3, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

// -------------------------------------------------------------
// 10. Futuristic Sci-Fi HUD Visualizer
// -------------------------------------------------------------
export function drawFuturisticHudTelemetry(rc: VisualizerRenderContext) {
  const { ctx, bands, freqData, palette, centerX, centerY, primaryRadius, currentTime } = rc

  ctx.save()
  ctx.translate(centerX, centerY)

  // Rotating outer reticle
  ctx.save()
  ctx.rotate(currentTime * 0.25)
  ctx.strokeStyle = palette.primary
  ctx.lineWidth = 1.5
  ctx.setLineDash([12, 8, 4, 8])
  ctx.beginPath()
  ctx.arc(0, 0, primaryRadius * 1.25, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  // Counter-rotating tech brackets
  ctx.save()
  ctx.rotate(-currentTime * 0.4)
  ctx.strokeStyle = palette.accent
  ctx.lineWidth = 3
  ctx.setLineDash([Math.PI * 20, Math.PI * 40])
  ctx.beginPath()
  ctx.arc(0, 0, primaryRadius * 1.4, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  // Real-time telemetry dB dial
  const arcLength = Math.PI * (0.5 + bands.overall * 1.2)
  ctx.strokeStyle = palette.secondary
  ctx.lineWidth = 5
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.arc(0, 0, primaryRadius * 1.1, -Math.PI / 2, -Math.PI / 2 + arcLength)
  ctx.stroke()

  // Frequency arc indicators
  ctx.font = '10px monospace'
  ctx.fillStyle = '#94a3b8'
  ctx.fillText(`DSP_FREQ_HZ: ${Math.floor(bands.overall * 18000)}`, primaryRadius * 0.9, -primaryRadius * 1.2)
  ctx.fillText(`BASS_ENVELOPE: ${(bands.bass * 100).toFixed(1)}%`, primaryRadius * 0.9, -primaryRadius * 1.2 + 14)

  ctx.restore()
}

// -------------------------------------------------------------
// 11. Liquid Metawave Surface
// -------------------------------------------------------------
export function drawLiquidMetawaveSurface(rc: VisualizerRenderContext) {
  const { ctx, width, height, bands, palette, currentTime } = rc

  ctx.save()
  const waveLayers = 3

  for (let l = 0; l < waveLayers; l++) {
    const baseY = height * (0.65 + l * 0.08)
    const speed = currentTime * (1.2 + l * 0.4)
    const amp = 30 + bands.bass * 45 + bands.mids * 25

    ctx.fillStyle = l === 0 ? palette.primary : l === 1 ? palette.secondary : palette.accent
    ctx.globalAlpha = 0.35 + l * 0.15

    ctx.beginPath()
    ctx.moveTo(0, height)
    ctx.lineTo(0, baseY)

    for (let x = 0; x <= width; x += 12) {
      const y = baseY + Math.sin(x * 0.008 + speed) * amp + Math.cos(x * 0.015 - speed * 0.7) * (amp * 0.5)
      ctx.lineTo(x, y)
    }

    ctx.lineTo(width, height)
    ctx.closePath()
    ctx.fill()
  }

  ctx.restore()
}

// -------------------------------------------------------------
// 12. Perspective Spectrum Tunnel
// -------------------------------------------------------------
export function drawPerspectiveSpectrumTunnel(rc: VisualizerRenderContext) {
  const { ctx, bands, palette, centerX, centerY, currentTime } = rc

  ctx.save()
  ctx.translate(centerX, centerY)

  const portalCount = 8
  const baseScale = (currentTime * 0.6) % 1

  for (let p = 0; p < portalCount; p++) {
    const progress = ((baseScale + p / portalCount) % 1)
    const scale = Math.pow(progress, 2.2) * 800 + bands.bass * 60
    const alpha = Math.sin(progress * Math.PI) * 0.75

    ctx.strokeStyle = p % 2 === 0 ? palette.primary : palette.accent
    ctx.lineWidth = Math.max(1, progress * 4)
    ctx.globalAlpha = Math.max(0, alpha)

    ctx.strokeRect(-scale / 2, -scale / 2, scale, scale)
  }

  ctx.restore()
}

// -------------------------------------------------------------
// 13. Glowing Ribbon Light Trails
// -------------------------------------------------------------
export function drawGlowingRibbonTrails(rc: VisualizerRenderContext) {
  const { ctx, width, height, timeData, palette, centerY, sensitivity, currentTime } = rc

  ctx.save()
  const ribbonCount = 3

  for (let r = 0; r < ribbonCount; r++) {
    ctx.strokeStyle = r === 0 ? palette.primary : r === 1 ? palette.secondary : palette.accent
    ctx.lineWidth = 4 - r
    ctx.shadowColor = palette.glow
    ctx.shadowBlur = 14
    ctx.globalAlpha = 0.85 - r * 0.2

    ctx.beginPath()
    const slice = width / (timeData.length - 1)
    for (let i = 0; i < timeData.length; i++) {
      const v = (timeData[i] - 128) / 128
      const waveShift = Math.sin(i * 0.04 + currentTime * 2 + r * 1.5) * 20
      const y = centerY + v * (height * 0.18) * sensitivity + waveShift
      const x = i * slice

      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  ctx.restore()
}

// -------------------------------------------------------------
// 14. Dotted Harmonic Matrix (Full-Screen Photo Halftone + Liquid Dispersion)
// -------------------------------------------------------------
export function drawDottedHarmonicMatrix(rc: VisualizerRenderContext) {
  studioDottedMatrixEngine.render(rc)
}

// -------------------------------------------------------------
// 15. Cinematic Topographic Landscape
// -------------------------------------------------------------
export function drawCinematicTopographicLandscape(rc: VisualizerRenderContext) {
  const { ctx, width, height, freqData, palette, sensitivity, currentTime } = rc

  ctx.save()
  const lineCount = 10
  const baseY = height * 0.85
  const stepZ = (height * 0.35) / lineCount

  for (let l = 0; l < lineCount; l++) {
    const y = baseY - l * stepZ
    const progress = l / lineCount
    const sampleOffset = Math.floor(progress * 100)

    ctx.strokeStyle = l === 0 ? palette.accent : palette.primary
    ctx.globalAlpha = 0.25 + progress * 0.7
    ctx.lineWidth = 1.5

    ctx.beginPath()
    for (let x = 0; x <= width; x += 16) {
      const normX = x / width
      const sampleIdx = Math.floor((normX * (freqData.length * 0.4) + sampleOffset) % freqData.length)
      const peak = ((freqData[sampleIdx] || 0) / 255) * 80 * sensitivity * Math.sin(normX * Math.PI)
      const wave = Math.sin(normX * 12 + currentTime * 1.5 + l) * 8

      const py = y - peak - wave
      if (x === 0) ctx.moveTo(x, py)
      else ctx.lineTo(x, py)
    }
    ctx.stroke()
  }

  ctx.restore()
}

// -------------------------------------------------------------
// 16. Bottom-Edge Broadcast Bars
// -------------------------------------------------------------
export function drawBottomEdgeBroadcastBars(rc: VisualizerRenderContext) {
  const { ctx, width, height, freqData, palette, barCount, sensitivity } = rc

  ctx.save()
  const bars = Math.min(barCount, 96)
  const barWidth = width / bars
  const baseY = height

  for (let i = 0; i < bars; i++) {
    const sampleIdx = Math.floor((i / bars) * (freqData.length * 0.75))
    const mag = ((freqData[sampleIdx] || 0) / 255) * (height * 0.22) * sensitivity
    const x = i * barWidth

    const grad = ctx.createLinearGradient(x, baseY, x, baseY - mag)
    grad.addColorStop(0, palette.primary)
    grad.addColorStop(0.7, palette.secondary)
    grad.addColorStop(1, palette.accent)

    ctx.fillStyle = grad
    ctx.fillRect(x, baseY - mag, barWidth - 1, mag)
  }

  ctx.restore()
}

// -------------------------------------------------------------
// 17. Portrait Edge-Hugging Spectrum
// -------------------------------------------------------------
export function drawPortraitEdgeSpectrum(rc: VisualizerRenderContext) {
  const { ctx, freqData, palette, centerX, centerY, primaryRadius, sensitivity, currentTime } = rc

  ctx.save()
  ctx.translate(centerX, centerY)

  const cardW = primaryRadius * 1.45
  const cardH = primaryRadius * 2.1
  const cornerR = 24

  // Draw reactive contour around rounded rectangle
  ctx.strokeStyle = palette.primary
  ctx.lineWidth = 3
  ctx.shadowColor = palette.glow
  ctx.shadowBlur = 16

  ctx.beginPath()
  ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, cornerR)
  ctx.stroke()

  // Spikes radiating outward along the perimeter
  const segments = 48
  for (let s = 0; s < segments; s++) {
    const frac = s / segments
    const sampleIdx = Math.floor(frac * (freqData.length * 0.55))
    const mag = ((freqData[sampleIdx] || 0) / 255) * 45 * sensitivity

    const theta = frac * Math.PI * 2 + currentTime * 0.1
    const px = Math.cos(theta) * (cardW / 2)
    const py = Math.sin(theta) * (cardH / 2)
    const nx = Math.cos(theta) * (cardW / 2 + mag)
    const ny = Math.sin(theta) * (cardH / 2 + mag)

    ctx.strokeStyle = palette.accent
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(px, py)
    ctx.lineTo(nx, ny)
    ctx.stroke()
  }

  ctx.restore()
}

// -------------------------------------------------------------
// 18. Kinetic Audio Typography Wave
// -------------------------------------------------------------
export function drawKineticAudioTypographyWave(rc: VisualizerRenderContext) {
  const { ctx, bands, palette, centerX, centerY, currentTime } = rc

  ctx.save()
  ctx.translate(centerX, centerY)

  // Floating acoustic soundwave particles reacting to vocal punch
  const rings = 4
  for (let r = 0; r < rings; r++) {
    const radius = 90 + r * 50 + bands.mids * 40
    ctx.strokeStyle = r % 2 === 0 ? palette.accent : palette.primary
    ctx.lineWidth = 2
    ctx.globalAlpha = Math.max(0, 0.8 - r * 0.18)

    ctx.beginPath()
    for (let theta = 0; theta <= Math.PI * 2; theta += 0.1) {
      const deform = Math.sin(theta * 8 + currentTime * 3) * (bands.bass * 18)
      const x = Math.cos(theta) * (radius + deform)
      const y = Math.sin(theta) * (radius + deform)
      if (theta === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.stroke()
  }

  ctx.restore()
}

// -------------------------------------------------------------
// 19. Luxury Ultra-Minimal Line
// -------------------------------------------------------------
export function drawLuxuryMinimalLine(rc: VisualizerRenderContext) {
  const { ctx, width, timeData, palette, centerY, sensitivity } = rc

  ctx.save()
  ctx.lineWidth = 1.5
  ctx.strokeStyle = palette.primary // Gold or silver hairline
  ctx.shadowColor = palette.glow
  ctx.shadowBlur = 8

  ctx.beginPath()
  const slice = width / (timeData.length - 1)
  for (let i = 0; i < timeData.length; i++) {
    const v = (timeData[i] - 128) / 128
    const y = centerY + v * 48 * sensitivity
    const x = i * slice

    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  ctx.restore()
}

// -------------------------------------------------------------
// 20. Multilayer Symphonic Composite
// -------------------------------------------------------------
export function drawMultilayerSymphonicComposite(rc: VisualizerRenderContext) {
  const { ctx, bands, freqData, palette, centerX, centerY, primaryRadius, sensitivity, currentTime } = rc

  ctx.save()

  // Layer 1: Sub-bass pulse halo
  const subBassScale = 1 + bands.subBass * 0.4
  ctx.strokeStyle = palette.primary
  ctx.lineWidth = 4
  ctx.shadowColor = palette.glow
  ctx.shadowBlur = 18
  ctx.beginPath()
  ctx.arc(centerX, centerY, primaryRadius * subBassScale, 0, Math.PI * 2)
  ctx.stroke()

  // Layer 2: Midrange circular wave spline
  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate(currentTime * 0.3)
  ctx.strokeStyle = palette.secondary
  ctx.lineWidth = 2.5
  ctx.beginPath()
  const pts = 72
  for (let i = 0; i <= pts; i++) {
    const theta = (i / pts) * Math.PI * 2
    const sampleIdx = Math.floor((i / pts) * (freqData.length * 0.5))
    const mag = ((freqData[sampleIdx] || 0) / 255) * 55 * sensitivity
    const r = primaryRadius * 1.15 + mag
    const px = Math.cos(theta) * r
    const py = Math.sin(theta) * r
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.stroke()
  ctx.restore()

  // Layer 3: Treble stardust sparklers
  ctx.fillStyle = palette.accent
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2 - currentTime * 0.5
    const trebleSample = freqData[Math.floor(freqData.length * 0.6 + (i / 24) * 200)] || 0
    const sparkDist = primaryRadius * 1.35 + (trebleSample / 255) * 60
    const sx = centerX + Math.cos(angle) * sparkDist
    const sy = centerY + Math.sin(angle) * sparkDist

    ctx.beginPath()
    ctx.arc(sx, sy, 2 + (trebleSample / 255) * 3, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}
