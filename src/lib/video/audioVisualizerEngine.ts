import {
  AudioBands,
  BackgroundMode,
  ColorTheme,
  THEME_PALETTES,
  ThemeColors,
  TrackMetadata,
  VisualizerConfig,
} from './audioVisualizerTypes'

/**
 * Extract audio energy across Bass, Mid, Treble, and Overall bands
 */
export function calculateAudioBands(freqData: Uint8Array): AudioBands {
  const len = freqData.length
  if (len === 0) {
    return { bass: 0, mid: 0, treble: 0, overall: 0 }
  }

  // Bass: roughly first 8-12% of bins (20 Hz - 250 Hz)
  const bassEnd = Math.max(2, Math.floor(len * 0.1))
  // Mid: 10% to 45% (250 Hz - 4000 Hz)
  const midEnd = Math.max(bassEnd + 1, Math.floor(len * 0.45))

  let bassSum = 0
  for (let i = 0; i < bassEnd; i++) {
    bassSum += freqData[i]
  }
  const bass = bassSum / (bassEnd * 255)

  let midSum = 0
  for (let i = bassEnd; i < midEnd; i++) {
    midSum += freqData[i]
  }
  const mid = midSum / ((midEnd - bassEnd) * 255)

  let trebleSum = 0
  for (let i = midEnd; i < len; i++) {
    trebleSum += freqData[i]
  }
  const treble = trebleSum / ((len - midEnd) * 255)

  const overall = (bass * 0.5 + mid * 0.3 + treble * 0.2)

  return {
    bass: Math.min(1, Math.max(0, bass)),
    mid: Math.min(1, Math.max(0, mid)),
    treble: Math.min(1, Math.max(0, treble)),
    overall: Math.min(1, Math.max(0, overall)),
  }
}

/**
 * Ambient reactive particle for visualizer background
 */
export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  baseAlpha: number
  colorIndex: number
}

export class VisualizerParticleSystem {
  particles: Particle[] = []
  private maxParticles: number = 75

  constructor(count = 75) {
    this.maxParticles = count
    this.init(1920, 1080)
  }

  init(width: number, height: number) {
    this.particles = []
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8 - 0.3,
        size: Math.random() * 3 + 1.2,
        alpha: Math.random() * 0.6 + 0.2,
        baseAlpha: Math.random() * 0.6 + 0.2,
        colorIndex: Math.floor(Math.random() * 3),
      })
    }
  }

  updateAndDraw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    bassEnergy: number,
    palette: ThemeColors
  ) {
    const colors = [palette.primary, palette.secondary, palette.accent]
    const speedBoost = 1 + bassEnergy * 3.5

    ctx.save()
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i]

      p.x += p.vx * speedBoost
      p.y += p.vy * speedBoost

      // Wrap boundaries
      if (p.x < 0) p.x = width
      if (p.x > width) p.x = 0
      if (p.y < 0) p.y = height
      if (p.y > height) p.y = 0

      // Pulse alpha and size with bass
      const currentAlpha = Math.min(1, p.baseAlpha + bassEnergy * 0.5)
      const currentSize = p.size * (1 + bassEnergy * 0.8)

      ctx.beginPath()
      ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2)
      ctx.fillStyle = colors[p.colorIndex]
      ctx.globalAlpha = currentAlpha
      ctx.shadowBlur = 10 * bassEnergy
      ctx.shadowColor = colors[p.colorIndex]
      ctx.fill()
    }
    ctx.restore()
  }
}

/**
 * Peak caps manager for linear frequency bars
 */
export class PeakHoldManager {
  peaks: number[] = []
  velocities: number[] = []
  gravity = 0.85

  update(currentValues: number[]): number[] {
    if (this.peaks.length !== currentValues.length) {
      this.peaks = new Array(currentValues.length).fill(0)
      this.velocities = new Array(currentValues.length).fill(0)
    }

    for (let i = 0; i < currentValues.length; i++) {
      const target = currentValues[i]
      if (target >= this.peaks[i]) {
        this.peaks[i] = target
        this.velocities[i] = 0
      } else {
        this.velocities[i] += this.gravity
        this.peaks[i] = Math.max(0, this.peaks[i] - this.velocities[i])
      }
    }

    return this.peaks
  }

  reset() {
    this.peaks = []
    this.velocities = []
  }
}

/**
 * Render Background based on selected background mode
 */
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  bgMode: BackgroundMode,
  coverImage: HTMLImageElement | null,
  bassEnergy: number,
  palette: ThemeColors,
  timeSec: number
) {
  ctx.save()

  // Base background fill
  ctx.fillStyle = '#05070f'
  ctx.fillRect(0, 0, width, height)

  if (bgMode === 'blurred-cover' && coverImage && coverImage.complete && coverImage.naturalWidth > 0) {
    // Zoomed cover art with bass breathing and blur
    ctx.save()
    const scale = 1.15 + bassEnergy * 0.08
    const scaledW = width * scale
    const scaledH = height * scale
    const offsetX = (width - scaledW) / 2
    const offsetY = (height - scaledH) / 2

    ctx.globalAlpha = 0.35
    ctx.filter = 'blur(40px)'
    ctx.drawImage(coverImage, offsetX, offsetY, scaledW, scaledH)
    ctx.restore()

    // Vignette overlay
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.3,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.75
    )
    gradient.addColorStop(0, 'rgba(5, 7, 15, 0.4)')
    gradient.addColorStop(1, 'rgba(5, 7, 15, 0.95)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  } else if (bgMode === 'cyber-grid') {
    // 3D Perspective Retro Grid
    const horizonY = height * 0.65
    const gridGrad = ctx.createLinearGradient(0, horizonY, 0, height)
    gridGrad.addColorStop(0, 'rgba(6, 182, 212, 0.0)')
    gridGrad.addColorStop(0.3, 'rgba(6, 182, 212, 0.25)')
    gridGrad.addColorStop(1, 'rgba(139, 92, 246, 0.4)')

    ctx.strokeStyle = gridGrad
    ctx.lineWidth = 1.5

    // Horizontal grid lines with perspective spacing
    const numLines = 14
    for (let i = 0; i < numLines; i++) {
      const p = Math.pow((i + (timeSec * 0.8) % 1) / numLines, 2.2)
      const y = horizonY + p * (height - horizonY)
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Perspective vanishing lines
    const numVLines = 18
    const centerX = width / 2
    for (let i = -numVLines; i <= numVLines; i++) {
      ctx.beginPath()
      ctx.moveTo(centerX, horizonY)
      const bottomX = centerX + i * (width / (numVLines * 1.2))
      ctx.lineTo(bottomX, height)
      ctx.stroke()
    }

    // Horizon glowing sun / light
    const sunGrad = ctx.createRadialGradient(centerX, horizonY, 10, centerX, horizonY, 350)
    sunGrad.addColorStop(0, palette.glow)
    sunGrad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = sunGrad
    ctx.fillRect(0, 0, width, height)
  } else if (bgMode === 'deep-space') {
    // Cosmic Nebula
    const cx = width * 0.5
    const cy = height * 0.45
    const nebula = ctx.createRadialGradient(
      cx,
      cy,
      50,
      cx,
      cy,
      Math.max(width, height) * 0.6
    )
    nebula.addColorStop(0, `${palette.primary}33`)
    nebula.addColorStop(0.5, `${palette.secondary}22`)
    nebula.addColorStop(1, 'rgba(5, 7, 15, 0.98)')
    ctx.fillStyle = nebula
    ctx.fillRect(0, 0, width, height)
  } else {
    // Dark Studio Ambient Glow
    const cx = width / 2
    const cy = height / 2
    const studio = ctx.createRadialGradient(
      cx,
      cy,
      100,
      cx,
      cy,
      Math.max(width, height) * 0.7
    )
    studio.addColorStop(0, 'rgba(23, 29, 50, 0.8)')
    studio.addColorStop(0.6, 'rgba(10, 14, 26, 0.95)')
    studio.addColorStop(1, '#05070f')
    ctx.fillStyle = studio
    ctx.fillRect(0, 0, width, height)
  }

  ctx.restore()
}

/**
 * PRESET 1: Circular Pulse Visualizer (Vinyl / Halo)
 */
export function drawCircularPulse(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  freqData: Uint8Array,
  timeData: Uint8Array,
  bassEnergy: number,
  coverImage: HTMLImageElement | null,
  config: VisualizerConfig,
  palette: ThemeColors,
  rotationAngle: number
) {
  ctx.save()

  const centerX = width / 2
  // Position slightly higher in portrait mode to give room for metadata
  const centerY = config.aspectRatio === '9:16' ? height * 0.42 : height * 0.48
  const baseRadius = Math.min(width, height) * 0.22
  const pulseRadius = baseRadius * (1 + bassEnergy * 0.12 * config.bassReactivity)

  // 1. Concentric Bass Shockwave Rings
  if (bassEnergy > 0.2) {
    ctx.save()
    const numRings = 3
    for (let r = 1; r <= numRings; r++) {
      const ringRadius = pulseRadius + r * 45 * bassEnergy
      const ringAlpha = Math.max(0, (0.5 - r * 0.15) * bassEnergy)
      ctx.beginPath()
      ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2)
      ctx.strokeStyle = palette.primary
      ctx.globalAlpha = ringAlpha
      ctx.lineWidth = 3
      ctx.shadowBlur = 20
      ctx.shadowColor = palette.glow
      ctx.stroke()
    }
    ctx.restore()
  }

  // 2. Radial Frequency Bars around the Circle
  const barCount = Math.min(180, Math.max(48, config.barCount))
  const stepAngle = (Math.PI * 2) / barCount
  const maxBarLength = Math.min(width, height) * 0.22 * config.sensitivity

  ctx.save()
  for (let i = 0; i < barCount; i++) {
    // Symmetrical spectrum mapping: low frequencies on both sides
    const half = barCount / 2
    const idx = i < half ? i : barCount - i
    const freqIndex = Math.floor((idx / half) * (freqData.length * 0.6))
    const rawVal = freqData[freqIndex] || 0
    const normalized = Math.min(1, (rawVal / 255) * config.sensitivity)
    const barHeight = Math.max(6, normalized * maxBarLength)

    const angle = i * stepAngle + rotationAngle * 0.3
    const xStart = centerX + Math.cos(angle) * (pulseRadius + 8)
    const yStart = centerY + Math.sin(angle) * (pulseRadius + 8)
    const xEnd = centerX + Math.cos(angle) * (pulseRadius + 8 + barHeight)
    const yEnd = centerY + Math.sin(angle) * (pulseRadius + 8 + barHeight)

    // Gradient along bar
    const barGrad = ctx.createLinearGradient(xStart, yStart, xEnd, yEnd)
    barGrad.addColorStop(0, palette.primary)
    barGrad.addColorStop(0.5, palette.secondary)
    barGrad.addColorStop(1, palette.accent)

    ctx.beginPath()
    ctx.moveTo(xStart, yStart)
    ctx.lineTo(xEnd, yEnd)
    ctx.strokeStyle = barGrad
    ctx.lineWidth = Math.max(3, (Math.PI * 2 * pulseRadius) / barCount * 0.7)
    ctx.lineCap = 'round'
    ctx.shadowBlur = 12 * config.glowStrength
    ctx.shadowColor = palette.glow
    ctx.stroke()
  }
  ctx.restore()

  // 3. Central Album Art / Procedural Vinyl Disc
  ctx.save()
  ctx.beginPath()
  ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()

  if (coverImage && coverImage.complete && coverImage.naturalWidth > 0) {
    // Render user uploaded artwork centered
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(rotationAngle)
    const imgSize = pulseRadius * 2
    ctx.drawImage(coverImage, -pulseRadius, -pulseRadius, imgSize, imgSize)
    ctx.restore()
  } else {
    // Procedural Vinyl Hologram Record
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(rotationAngle)

    // Dark Vinyl Surface
    const vinylGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, pulseRadius)
    vinylGrad.addColorStop(0, '#111827')
    vinylGrad.addColorStop(0.4, '#1f2937')
    vinylGrad.addColorStop(0.7, '#111827')
    vinylGrad.addColorStop(1, '#0f172a')
    ctx.fillStyle = vinylGrad
    ctx.fillRect(-pulseRadius, -pulseRadius, pulseRadius * 2, pulseRadius * 2)

    // Vinyl grooves
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)'
    ctx.lineWidth = 1
    for (let r = 25; r < pulseRadius - 10; r += 12) {
      ctx.beginPath()
      ctx.arc(0, 0, r, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Center Holographic Label
    const centerRadius = pulseRadius * 0.38
    const labelGrad = ctx.createLinearGradient(-centerRadius, -centerRadius, centerRadius, centerRadius)
    labelGrad.addColorStop(0, palette.primary)
    labelGrad.addColorStop(0.5, palette.secondary)
    labelGrad.addColorStop(1, palette.accent)
    ctx.beginPath()
    ctx.arc(0, 0, centerRadius, 0, Math.PI * 2)
    ctx.fillStyle = labelGrad
    ctx.fill()

    // Center Spindle Hole
    ctx.beginPath()
    ctx.arc(0, 0, 14, 0, Math.PI * 2)
    ctx.fillStyle = '#05070f'
    ctx.fill()

    ctx.restore()
  }
  ctx.restore()

  // 4. Outer Rim Glow
  ctx.beginPath()
  ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2)
  ctx.strokeStyle = palette.primary
  ctx.lineWidth = 4
  ctx.shadowBlur = 24 * config.glowStrength
  ctx.shadowColor = palette.glow
  ctx.stroke()

  ctx.restore()
}

/**
 * PRESET 2: Linear Bar Spectrum Visualizer (Studio Equalizer)
 */
export function drawLinearBars(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  freqData: Uint8Array,
  peakCaps: number[],
  bassEnergy: number,
  config: VisualizerConfig,
  palette: ThemeColors
) {
  ctx.save()

  const barCount = Math.min(128, Math.max(32, config.barCount))
  const marginX = width * 0.08
  const availableWidth = width - marginX * 2
  const barGap = Math.max(3, availableWidth / barCount * 0.22)
  const barWidth = (availableWidth - barGap * (barCount - 1)) / barCount

  // Baseline Y position
  const isPortrait = config.aspectRatio === '9:16'
  const baseY = isPortrait ? height * 0.72 : height * 0.78
  const maxBarHeight = height * (isPortrait ? 0.35 : 0.42) * config.sensitivity

  const currentBarHeights: number[] = []

  // Pre-calculate heights
  for (let i = 0; i < barCount; i++) {
    // Logarithmic frequency scale distribution
    const freqIdx = Math.floor(
      Math.pow(i / (barCount - 1), 1.6) * (freqData.length * 0.75)
    )
    const rawVal = freqData[freqIdx] || 0
    const normalized = Math.min(1, (rawVal / 255) * config.sensitivity)
    const h = Math.max(8, normalized * maxBarHeight)
    currentBarHeights.push(h)
  }

  // Draw Bars & Mirrored Reflections
  for (let i = 0; i < barCount; i++) {
    const x = marginX + i * (barWidth + barGap)
    const barHeight = currentBarHeights[i]
    const yTop = baseY - barHeight

    // Color gradient for main bar
    const barGrad = ctx.createLinearGradient(x, baseY, x, yTop)
    barGrad.addColorStop(0, palette.primary)
    barGrad.addColorStop(0.6, palette.secondary)
    barGrad.addColorStop(1, palette.accent)

    // Main Upward Bar with rounded top
    ctx.save()
    ctx.fillStyle = barGrad
    ctx.shadowBlur = 14 * config.glowStrength
    ctx.shadowColor = palette.glow
    roundRect(ctx, x, yTop, barWidth, barHeight, Math.min(barWidth / 2, 6))
    ctx.fill()
    ctx.restore()

    // Mirrored Reflection (downwards with fading gradient)
    const reflectHeight = barHeight * 0.45
    const reflectGrad = ctx.createLinearGradient(x, baseY, x, baseY + reflectHeight)
    reflectGrad.addColorStop(0, `${palette.primary}66`)
    reflectGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.save()
    ctx.fillStyle = reflectGrad
    roundRect(ctx, x, baseY + 4, barWidth, reflectHeight, Math.min(barWidth / 2, 4))
    ctx.fill()
    ctx.restore()

    // Floating Peak-Hold Cap
    const peakY = baseY - Math.max(barHeight + 2, peakCaps[i] || barHeight)
    ctx.save()
    ctx.fillStyle = '#ffffff'
    ctx.shadowBlur = 10
    ctx.shadowColor = palette.accent
    roundRect(ctx, x, peakY - 4, barWidth, 4, 2)
    ctx.fill()
    ctx.restore()
  }

  // Base dividing neon wire
  ctx.beginPath()
  ctx.moveTo(marginX - 20, baseY)
  ctx.lineTo(width - marginX + 20, baseY)
  ctx.strokeStyle = palette.primary
  ctx.lineWidth = 2
  ctx.shadowBlur = 16
  ctx.shadowColor = palette.glow
  ctx.stroke()

  ctx.restore()
}

/**
 * PRESET 3: Glowing Smooth Waveform (Neon Ribbon)
 */
export function drawSmoothWaveform(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  timeData: Uint8Array,
  freqData: Uint8Array,
  bassEnergy: number,
  config: VisualizerConfig,
  palette: ThemeColors
) {
  ctx.save()

  const centerY = config.aspectRatio === '9:16' ? height * 0.5 : height * 0.55
  const marginX = width * 0.05
  const waveWidth = width - marginX * 2
  const step = waveWidth / (timeData.length - 1)
  const amplitude = height * 0.28 * config.sensitivity * (1 + bassEnergy * 0.3)

  // Gradient ribbon
  const waveGrad = ctx.createLinearGradient(marginX, centerY, width - marginX, centerY)
  waveGrad.addColorStop(0, palette.primary)
  waveGrad.addColorStop(0.35, palette.secondary)
  waveGrad.addColorStop(0.7, palette.accent)
  waveGrad.addColorStop(1, palette.primary)

  // 1. Mirrored bottom glow fill
  ctx.beginPath()
  ctx.moveTo(marginX, centerY)
  for (let i = 0; i < timeData.length; i++) {
    const v = (timeData[i] - 128) / 128
    const x = marginX + i * step
    const y = centerY + v * amplitude
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.lineTo(width - marginX, centerY)
  ctx.closePath()

  const fillGrad = ctx.createLinearGradient(0, centerY - amplitude, 0, centerY + amplitude)
  fillGrad.addColorStop(0, `${palette.primary}33`)
  fillGrad.addColorStop(0.5, `${palette.secondary}1a`)
  fillGrad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = fillGrad
  ctx.fill()

  // 2. Wide Bloom Glow Pass
  ctx.beginPath()
  for (let i = 0; i < timeData.length; i++) {
    const v = (timeData[i] - 128) / 128
    const x = marginX + i * step
    const y = centerY + v * amplitude
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.strokeStyle = palette.glow
  ctx.lineWidth = (config.waveformThickness || 4) + 6
  ctx.shadowBlur = 32 * config.glowStrength
  ctx.shadowColor = palette.glow
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.stroke()

  // 3. Sharp Vibrant Core Pass
  ctx.beginPath()
  for (let i = 0; i < timeData.length; i++) {
    const v = (timeData[i] - 128) / 128
    const x = marginX + i * step
    const y = centerY + v * amplitude
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.strokeStyle = waveGrad
  ctx.lineWidth = Math.max(3, config.waveformThickness || 4)
  ctx.shadowBlur = 10
  ctx.shadowColor = '#ffffff'
  ctx.stroke()

  // 4. Dynamic frequency energy pillars below
  const numPillars = 48
  const pillarStep = waveWidth / numPillars
  const pillarBaseY = centerY + amplitude * 1.15
  ctx.save()
  for (let p = 0; p < numPillars; p++) {
    const fIdx = Math.floor((p / numPillars) * (freqData.length * 0.7))
    const pVal = (freqData[fIdx] || 0) / 255
    const pH = pVal * 40 * config.sensitivity
    const px = marginX + p * pillarStep
    ctx.beginPath()
    ctx.moveTo(px, pillarBaseY)
    ctx.lineTo(px, pillarBaseY + pH)
    ctx.strokeStyle = `${palette.secondary}88`
    ctx.lineWidth = 2.5
    ctx.stroke()
  }
  ctx.restore()

  ctx.restore()
}

/**
 * PRESET 4: Retro Cyberpunk Oscilloscope & CRT HUD
 */
export function drawCyberpunkOscilloscope(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  timeData: Uint8Array,
  freqData: Uint8Array,
  bassEnergy: number,
  config: VisualizerConfig,
  palette: ThemeColors,
  timeSec: number
) {
  ctx.save()

  const cx = width / 2
  const cy = config.aspectRatio === '9:16' ? height * 0.46 : height * 0.5
  const scopeW = Math.min(width * 0.86, 1200)
  const scopeH = Math.min(height * 0.48, 600)
  const leftX = cx - scopeW / 2
  const topY = cy - scopeH / 2

  // 1. Oscilloscope Frame & Background CRT bezel
  ctx.save()
  ctx.fillStyle = 'rgba(2, 6, 23, 0.88)'
  ctx.strokeStyle = palette.primary
  ctx.lineWidth = 2.5
  ctx.shadowBlur = 16
  ctx.shadowColor = palette.glow
  roundRect(ctx, leftX, topY, scopeW, scopeH, 12)
  ctx.fill()
  ctx.stroke()
  ctx.restore()

  // Clip within scope screen
  ctx.save()
  roundRect(ctx, leftX, topY, scopeW, scopeH, 12)
  ctx.clip()

  // 2. Oscilloscope Grid lines (reticle)
  ctx.save()
  ctx.strokeStyle = `${palette.primary}26`
  ctx.lineWidth = 1
  const cols = 12
  const rows = 8
  const colStep = scopeW / cols
  const rowStep = scopeH / rows

  for (let c = 1; c < cols; c++) {
    ctx.beginPath()
    ctx.moveTo(leftX + c * colStep, topY)
    ctx.lineTo(leftX + c * colStep, topY + scopeH)
    ctx.stroke()
  }
  for (let r = 1; r < rows; r++) {
    ctx.beginPath()
    ctx.moveTo(leftX, topY + r * rowStep)
    ctx.lineTo(leftX + scopeW, topY + r * rowStep)
    ctx.stroke()
  }

  // Center crosshairs
  ctx.strokeStyle = `${palette.primary}55`
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(cx, topY)
  ctx.lineTo(cx, topY + scopeH)
  ctx.moveTo(leftX, cy)
  ctx.lineTo(leftX + scopeW, cy)
  ctx.stroke()
  ctx.restore()

  // 3. Phosphor Trace (Oscilloscope audio wave)
  const step = scopeW / (timeData.length - 1)
  const amp = (scopeH * 0.38) * config.sensitivity * (1 + bassEnergy * 0.25)

  // Outer phosphor glow
  ctx.save()
  ctx.beginPath()
  for (let i = 0; i < timeData.length; i++) {
    const v = (timeData[i] - 128) / 128
    const x = leftX + i * step
    const y = cy + v * amp
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.strokeStyle = palette.glow
  ctx.lineWidth = 6
  ctx.shadowBlur = 24
  ctx.shadowColor = palette.glow
  ctx.stroke()

  // Sharp beam core
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2.5
  ctx.stroke()
  ctx.restore()

  // 4. CRT Horizontal Scanlines
  ctx.save()
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)'
  for (let y = topY; y < topY + scopeH; y += 4) {
    ctx.fillRect(leftX, y, scopeW, 2)
  }
  ctx.restore()

  // 5. Tech HUD Readouts & Telemetry
  ctx.save()
  ctx.font = 'bold 13px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
  ctx.fillStyle = palette.accent
  ctx.fillText('OSC-FREQ: CH1 [48kHz]', leftX + 16, topY + 28)
  ctx.fillText(`PEAK BASS: ${(bassEnergy * 100).toFixed(0)}%`, leftX + 16, topY + 48)

  const dbLevel = (-36 + bassEnergy * 34).toFixed(1)
  ctx.fillStyle = palette.primary
  ctx.textAlign = 'right'
  ctx.fillText(`GAIN: ${dbLevel} dB`, leftX + scopeW - 16, topY + 28)
  ctx.fillText(`FPS: 60 [SYNC]`, leftX + scopeW - 16, topY + 48)
  ctx.restore()

  ctx.restore() // End clip
  ctx.restore()
}

/**
 * Track Metadata Typography Overlay (Title, Artist, Channel Handle)
 */
export function drawMetadataOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  metadata: TrackMetadata,
  palette: ThemeColors,
  config: VisualizerConfig
) {
  if (!metadata.showMetadata) return
  if (!metadata.title && !metadata.artist && !metadata.handle) return

  ctx.save()

  const isPortrait = config.aspectRatio === '9:16'
  const isSquare = config.aspectRatio === '1:1'

  // Text layout positioning
  let titleY = isPortrait ? height * 0.82 : isSquare ? height * 0.85 : height * 0.86
  let titleFontSize = Math.round(Math.min(width, height) * (isPortrait ? 0.046 : 0.04))
  let subtitleFontSize = Math.round(titleFontSize * 0.58)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // 1. Song Title
  if (metadata.title) {
    ctx.save()
    ctx.font = `800 ${titleFontSize}px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
    ctx.fillStyle = '#ffffff'
    ctx.shadowBlur = 20
    ctx.shadowColor = palette.glow
    ctx.fillText(metadata.title, width / 2, titleY)
    ctx.restore()
  }

  // 2. Artist Subtitle
  if (metadata.artist) {
    const artistY = titleY + titleFontSize * 0.95
    ctx.save()
    ctx.font = `600 ${subtitleFontSize}px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
    ctx.fillStyle = 'rgba(255, 255, 255, 0.78)'
    ctx.shadowBlur = 10
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
    ctx.fillText(metadata.artist, width / 2, artistY)
    ctx.restore()
  }

  // 3. Social Handle / Watermark Pill Badge
  if (metadata.handle) {
    const handleY = isPortrait ? height * 0.93 : height * 0.94
    const handleFontSize = Math.round(subtitleFontSize * 0.85)

    ctx.save()
    ctx.font = `600 ${handleFontSize}px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
    const textMetrics = ctx.measureText(metadata.handle)
    const badgeW = textMetrics.width + 36
    const badgeH = handleFontSize * 1.9
    const badgeX = width / 2 - badgeW / 2
    const badgeY = handleY - badgeH / 2

    // Pill background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)'
    ctx.strokeStyle = `${palette.primary}66`
    ctx.lineWidth = 1.5
    roundRect(ctx, badgeX, badgeY, badgeW, badgeH, badgeH / 2)
    ctx.fill()
    ctx.stroke()

    // Text inside pill
    ctx.fillStyle = palette.primary
    ctx.shadowBlur = 8
    ctx.shadowColor = palette.glow
    ctx.fillText(metadata.handle, width / 2, handleY)
    ctx.restore()
  }

  ctx.restore()
}

/**
 * Utility helper to draw rounded rectangle on canvas
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  const r = Math.min(radius, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}
