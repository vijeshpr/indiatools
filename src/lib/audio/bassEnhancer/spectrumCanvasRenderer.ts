/**
 * Ultra-Modern 20–300 Hz Sub-Bass Spectrum Canvas Renderer
 * High-performance 60fps visualizer with glowing energy curves, harmonic overtone zones,
 * peak-hold decay, and floating energy peak particle emitters.
 */

import { BassTelemetryMetrics } from './types'

export interface VisualizerParticle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  color: string
}

const PARTICLES: VisualizerParticle[] = []
const MAX_PARTICLES = 65

/**
 * Render 20–300 Hz focused sub-bass spectrum frame
 */
export function renderSubBassSpectrum(
  canvas: HTMLCanvasElement,
  analyser: AnalyserNode,
  peakHoldArray: Float32Array,
  crossoverHz: number,
  subLevelPct: number,
  monoLock: boolean,
  isBypassed: boolean
): BassTelemetryMetrics {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return {
      subEnergyDb: -70,
      fundamentalHz: 0,
      subOctaveEnergyDb: -70,
      harmonicEnergyDb: -70,
      peakLimitingDb: 0,
      isLimiting: false,
    }
  }

  const width = canvas.width
  const height = canvas.height
  const sampleRate = analyser.context.sampleRate
  const binCount = analyser.frequencyBinCount // 2048 for fftSize 4096
  const binWidthHz = sampleRate / analyser.fftSize // ~10.76 Hz per bin at 44.1k

  // Frequency array
  const freqData = new Uint8Array(binCount)
  analyser.getByteFrequencyData(freqData)

  // 1. Dark matte obsidian canvas background
  ctx.fillStyle = '#0a0a0b'
  ctx.fillRect(0, 0, width, height)

  // Subtle grid background lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)'
  ctx.lineWidth = 1

  // Frequency markers across 20–300 Hz
  const markers = [20, 40, 60, 80, 100, 120, 160, 200, 240, 300]
  const minFreq = 20
  const maxFreq = 300
  const logMin = Math.log10(minFreq)
  const logMax = Math.log10(maxFreq)
  const logRange = logMax - logMin

  const freqToX = (f: number): number => {
    const clamped = Math.max(minFreq, Math.min(maxFreq, f))
    return ((Math.log10(clamped) - logMin) / logRange) * width
  }

  // Draw vertical frequency grid
  ctx.font = '9px monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'bottom'

  for (const f of markers) {
    const x = freqToX(f)
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height - 16)
    ctx.stroke()

    ctx.fillStyle = f === crossoverHz ? '#ffb800' : 'rgba(255, 255, 255, 0.35)'
    ctx.fillText(`${f}Hz`, x, height - 4)
  }

  // Draw Horizontal dB grid lines (-12, -24, -36, -48 dB)
  const dbLines = [
    { db: 0, y: height * 0.1 },
    { db: -12, y: height * 0.3 },
    { db: -24, y: height * 0.5 },
    { db: -36, y: height * 0.7 },
    { db: -48, y: height * 0.88 },
  ]

  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  for (const line of dbLines) {
    ctx.beginPath()
    ctx.moveTo(0, line.y)
    ctx.lineTo(width, line.y)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
    ctx.stroke()

    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.fillText(`${line.db}dB`, width - 6, line.y)
  }

  // 2. Highlight Crossover Frequency Zone & Sub-Harmonic Octave Zone
  const crossX = freqToX(crossoverHz)
  const subOctaveCutoff = crossoverHz * 0.5
  const subOctaveX = freqToX(subOctaveCutoff)

  // Sub-Harmonic Octave Zone (Neon Crimson glow background)
  const subGrad = ctx.createLinearGradient(0, 0, subOctaveX, 0)
  subGrad.addColorStop(0, 'rgba(255, 45, 85, 0.12)')
  subGrad.addColorStop(1, 'rgba(255, 45, 85, 0.01)')
  ctx.fillStyle = subGrad
  ctx.fillRect(0, 0, subOctaveX, height - 16)

  // Fundamental Crossover Zone (Amber glow background)
  const fundGrad = ctx.createLinearGradient(subOctaveX, 0, crossX, 0)
  fundGrad.addColorStop(0, 'rgba(255, 184, 0, 0.08)')
  fundGrad.addColorStop(1, 'rgba(255, 184, 0, 0.02)')
  ctx.fillStyle = fundGrad
  ctx.fillRect(subOctaveX, 0, crossX - subOctaveX, height - 16)

  // Draw Crossover Cutoff Needle
  ctx.strokeStyle = '#ffb800'
  ctx.lineWidth = 1.5
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(crossX, 0)
  ctx.lineTo(crossX, height - 16)
  ctx.stroke()
  ctx.setLineDash([])

  // 3. Interpolate Frequency Curve across 20–300 Hz
  const numPlotPoints = 140
  const points: { x: number; y: number; valNorm: number; freq: number }[] = []

  let maxSubVal = 0
  let maxSubFreq = 0
  let totalSubEnergy = 0
  let totalSubOctaveEnergy = 0
  let totalHarmonicEnergy = 0

  for (let i = 0; i < numPlotPoints; i++) {
    const fraction = i / (numPlotPoints - 1)
    const freq = Math.pow(10, logMin + fraction * logRange)
    const binIdx = Math.min(binCount - 1, Math.max(1, Math.round(freq / binWidthHz)))

    const rawVal = freqData[binIdx] / 255 // 0.0 to 1.0
    const x = fraction * width
    const y = height - 16 - rawVal * (height - 30)

    points.push({ x, y, valNorm: rawVal, freq })

    if (rawVal > maxSubVal && freq <= crossoverHz) {
      maxSubVal = rawVal
      maxSubFreq = Math.round(freq)
    }

    if (freq <= subOctaveCutoff) {
      totalSubOctaveEnergy += rawVal
    } else if (freq <= crossoverHz) {
      totalSubEnergy += rawVal
    } else {
      totalHarmonicEnergy += rawVal
    }

    // Peak hold update
    if (i < peakHoldArray.length) {
      if (rawVal > peakHoldArray[i]) {
        peakHoldArray[i] = rawVal
      } else {
        peakHoldArray[i] *= 0.965 // Slow smooth decay
      }
    }
  }

  // 4. Draw Peak Hold Trail Line
  ctx.beginPath()
  ctx.strokeStyle = isBypassed ? 'rgba(148, 163, 184, 0.35)' : 'rgba(255, 184, 0, 0.45)'
  ctx.lineWidth = 1.5
  for (let i = 0; i < numPlotPoints; i++) {
    const p = points[i]
    const peakVal = i < peakHoldArray.length ? peakHoldArray[i] : p.valNorm
    const peakY = height - 16 - peakVal * (height - 30)
    if (i === 0) ctx.moveTo(p.x, peakY)
    else ctx.lineTo(p.x, peakY)
  }
  ctx.stroke()

  // 5. Draw Glowing Spectrum Energy Curve with Multi-Gradient
  if (points.length > 1) {
    // Fill Gradient under curve
    const areaGrad = ctx.createLinearGradient(0, 0, width, 0)
    if (isBypassed) {
      areaGrad.addColorStop(0, 'rgba(100, 116, 139, 0.25)')
      areaGrad.addColorStop(1, 'rgba(100, 116, 139, 0.05)')
    } else {
      areaGrad.addColorStop(0, 'rgba(255, 45, 85, 0.35)') // Crimson Sub-Harmonics
      areaGrad.addColorStop(0.35, 'rgba(255, 184, 0, 0.28)') // Amber Sub-Bass
      areaGrad.addColorStop(0.7, 'rgba(0, 240, 255, 0.20)') // Cyan Harmonics
      areaGrad.addColorStop(1, 'rgba(0, 240, 255, 0.05)')
    }

    ctx.beginPath()
    ctx.moveTo(points[0].x, height - 16)
    ctx.lineTo(points[0].x, points[0].y)

    // Smooth Bezier curve through points
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const midX = (prev.x + curr.x) / 2
      const midY = (prev.y + curr.y) / 2
      ctx.quadraticCurveTo(prev.x, prev.y, midX, midY)
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y)
    ctx.lineTo(points[points.length - 1].x, height - 16)
    ctx.closePath()
    ctx.fillStyle = areaGrad
    ctx.fill()

    // Stroke Neon Edge
    const strokeGrad = ctx.createLinearGradient(0, 0, width, 0)
    if (isBypassed) {
      strokeGrad.addColorStop(0, '#94a3b8')
      strokeGrad.addColorStop(1, '#64748b')
    } else {
      strokeGrad.addColorStop(0, '#ff2d55') // Neon Crimson
      strokeGrad.addColorStop(0.35, '#ffb800') // Bright Amber
      strokeGrad.addColorStop(0.75, '#00f0ff') // Electric Cyan
      strokeGrad.addColorStop(1, '#3b82f6')
    }

    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const midX = (prev.x + curr.x) / 2
      const midY = (prev.y + curr.y) / 2
      ctx.quadraticCurveTo(prev.x, prev.y, midX, midY)
    }
    ctx.strokeStyle = strokeGrad
    ctx.lineWidth = 2.5
    ctx.shadowColor = isBypassed ? '#94a3b8' : '#ff2d55'
    ctx.shadowBlur = isBypassed ? 2 : 12
    ctx.stroke()
    ctx.shadowBlur = 0 // Reset shadow
  }

  // 6. Particle Emitters on Sub Energy Peaks
  if (!isBypassed && maxSubVal > 0.45 && PARTICLES.length < MAX_PARTICLES) {
    const emitX = freqToX(maxSubFreq)
    PARTICLES.push({
      x: emitX + (Math.random() - 0.5) * 16,
      y: height - 20 - maxSubVal * (height - 30),
      vx: (Math.random() - 0.5) * 1.2,
      vy: -1.5 - Math.random() * 2.5,
      radius: 1.5 + Math.random() * 2.5,
      alpha: 0.9,
      color: maxSubFreq < subOctaveCutoff ? '#ff2d55' : '#ffb800',
    })
  }

  // Update & Draw Particles
  for (let i = PARTICLES.length - 1; i >= 0; i--) {
    const p = PARTICLES[i]
    p.x += p.vx
    p.y += p.vy
    p.alpha -= 0.024

    if (p.alpha <= 0 || p.y < 0) {
      PARTICLES.splice(i, 1)
      continue
    }

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.globalAlpha = p.alpha
    ctx.shadowColor = p.color
    ctx.shadowBlur = 8
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.globalAlpha = 1.0
  }

  // 7. Telemetry & Indicator HUD inside visualizer
  const subDb = maxSubVal > 0 ? 20 * Math.log10(maxSubVal) : -70
  const subOctaveDb = totalSubOctaveEnergy > 0 ? 20 * Math.log10(totalSubOctaveEnergy / 20) : -70
  const harmonicDb = totalHarmonicEnergy > 0 ? 20 * Math.log10(totalHarmonicEnergy / 50) : -70

  // Draw Status Badge inside Canvas (Top Right)
  ctx.textAlign = 'right'
  ctx.textBaseline = 'top'
  ctx.fillStyle = '#ff2d55'
  ctx.font = '10px monospace'
  if (!isBypassed) {
    ctx.fillText(`SUB -1 OCTAVE: ${subLevelPct}%`, width - 12, 10)
    ctx.fillStyle = monoLock ? '#00f0ff' : '#94a3b8'
    ctx.fillText(`MONO LOCK: ${monoLock ? 'ON (<120Hz)' : 'OFF'}`, width - 12, 24)
    ctx.fillStyle = '#ffb800'
    ctx.fillText(`CROSSOVER: ${crossoverHz}Hz`, width - 12, 38)
  } else {
    ctx.fillStyle = '#f43f5e'
    ctx.fillText('A/B BYPASS: DRY DIRECT', width - 12, 10)
  }

  // Draw Fundamental indicator (Top Left)
  ctx.textAlign = 'left'
  if (maxSubFreq > 0 && maxSubVal > 0.15) {
    ctx.fillStyle = '#ffb800'
    ctx.font = 'bold 11px monospace'
    ctx.fillText(`FUNDAMENTAL: ${maxSubFreq} Hz (${subDb.toFixed(1)} dB)`, 12, 10)
  }

  return {
    subEnergyDb: parseFloat(subDb.toFixed(1)),
    fundamentalHz: maxSubFreq,
    subOctaveEnergyDb: parseFloat(subOctaveDb.toFixed(1)),
    harmonicEnergyDb: parseFloat(harmonicDb.toFixed(1)),
    peakLimitingDb: maxSubVal > 0.95 ? parseFloat(((maxSubVal - 0.95) * 12).toFixed(1)) : 0,
    isLimiting: maxSubVal > 0.95,
  }
}
