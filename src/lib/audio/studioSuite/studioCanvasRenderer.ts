/**
 * Studio Master Console - High-Performance Canvas 2D Spectrum & Vectorscope Analyzer
 */

export interface StudioTelemetry {
  freqData: Uint8Array
  timeData: Uint8Array
  isPlaying: boolean
  isBypassed: boolean
  lowGrDb: number
  midGrDb: number
  highGrDb: number
  peakLevelDb: number
  panPosition: number // -1.0 to +1.0
}

export function renderStudioMasterAnalyzer(
  canvas: HTMLCanvasElement,
  telemetry: StudioTelemetry,
  peakHoldArray: Float32Array,
  timeSec: number
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const width = canvas.width / dpr
  const height = canvas.height / dpr

  ctx.save()
  ctx.scale(dpr, dpr)

  // 1. Dark Brushed Obsidian Background
  ctx.fillStyle = '#06090f'
  ctx.fillRect(0, 0, width, height)

  // Technical Studio Frequency Grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
  ctx.lineWidth = 1

  // Horizontal dB grid lines
  const dbLines = [-6, -12, -24, -36, -48]
  for (const db of dbLines) {
    const y = height * (1 - (db + 48) / 48) * 0.75 + 10
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width - 140, y)
    ctx.stroke()

    ctx.fillStyle = 'rgba(148, 163, 184, 0.4)'
    ctx.font = '8px ui-monospace, monospace'
    ctx.fillText(`${db}dB`, 6, y - 2)
  }

  // Vertical frequency markings
  const freqMarkers = [
    { label: '60Hz', frac: 0.12 },
    { label: '250Hz', frac: 0.28 },
    { label: '1kHz', frac: 0.48 },
    { label: '4kHz', frac: 0.68 },
    { label: '12kHz', frac: 0.88 },
  ]

  for (const m of freqMarkers) {
    const x = m.frac * (width - 140)
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()

    ctx.fillStyle = 'rgba(148, 163, 184, 0.35)'
    ctx.font = '8px ui-monospace, monospace'
    ctx.fillText(m.label, x + 2, height - 6)
  }

  // 2. Frequency Spectrum Curves (FFT)
  const spectrumWidth = width - 140
  const binCount = telemetry.freqData.length
  const step = spectrumWidth / Math.min(128, binCount)

  // Gradient for spectrum
  const specGrad = ctx.createLinearGradient(0, 0, spectrumWidth, 0)
  specGrad.addColorStop(0, '#f59e0b') // Amber (Bass)
  specGrad.addColorStop(0.45, '#10b981') // Emerald (Mids)
  specGrad.addColorStop(1, '#a855f7') // Violet (High Air)

  ctx.beginPath()
  ctx.moveTo(0, height * 0.85)

  for (let i = 0; i < Math.min(128, binCount); i++) {
    const x = i * step
    // Logarithmic curve distribution
    const freqIdx = Math.floor(Math.pow(i / 128, 1.4) * (binCount * 0.75))
    const rawVal = telemetry.isPlaying ? telemetry.freqData[freqIdx] || 0 : Math.sin(timeSec * 2 + i * 0.1) * 8 + 12
    const normalized = rawVal / 255
    const y = height * 0.85 - normalized * (height * 0.75)

    // Update peak hold decay
    if (y < peakHoldArray[i] || isNaN(peakHoldArray[i])) {
      peakHoldArray[i] = y
    } else {
      peakHoldArray[i] = Math.min(height * 0.85, peakHoldArray[i] + 0.35)
    }

    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }

  ctx.lineTo(spectrumWidth, height * 0.85)
  ctx.closePath()

  // Spectrum fill with glow
  ctx.save()
  ctx.globalAlpha = 0.22
  ctx.fillStyle = specGrad
  ctx.fill()
  ctx.restore()

  // Sharp top line
  ctx.save()
  ctx.strokeStyle = specGrad
  ctx.lineWidth = 2
  ctx.shadowColor = '#10b981'
  ctx.shadowBlur = telemetry.isPlaying ? 8 : 2
  ctx.stroke()
  ctx.restore()

  // 3. Peak-Hold Decay Trace
  ctx.save()
  ctx.beginPath()
  for (let i = 0; i < Math.min(128, binCount); i++) {
    const x = i * step
    const y = peakHoldArray[i] || height * 0.85
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
  ctx.lineWidth = 1
  ctx.setLineDash([2, 4])
  ctx.stroke()
  ctx.restore()

  // 4. Stereo Vectorscope & Phase Meter (Right Panel: 140px width)
  const scopeX = width - 70
  const scopeY = height * 0.45
  const scopeRadius = 45

  ctx.save()
  // Scope bezel
  ctx.beginPath()
  ctx.arc(scopeX, scopeY, scopeRadius, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Axis crosshair (Lissajous X=L, Y=R)
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)'
  ctx.beginPath()
  ctx.moveTo(scopeX - scopeRadius, scopeY)
  ctx.lineTo(scopeX + scopeRadius, scopeY)
  ctx.moveTo(scopeX, scopeY - scopeRadius)
  ctx.lineTo(scopeX, scopeY + scopeRadius)
  ctx.stroke()

  // Phase lissajous ellipse / cloud
  const panOffset = telemetry.panPosition * (scopeRadius * 0.7)
  const spreadScale = telemetry.isPlaying ? 24 : 12

  ctx.beginPath()
  ctx.ellipse(scopeX + panOffset, scopeY, spreadScale, spreadScale * 0.7, Math.PI / 4, 0, Math.PI * 2)
  ctx.strokeStyle = '#06b6d4'
  ctx.lineWidth = 1.8
  ctx.shadowColor = '#06b6d4'
  ctx.shadowBlur = 10
  ctx.stroke()

  ctx.fillStyle = '#a5f3fc'
  ctx.font = 'bold 8.5px ui-monospace, monospace'
  ctx.textAlign = 'center'
  ctx.fillText('STEREO VECTORSCOPE', scopeX, scopeY + scopeRadius + 14)
  ctx.fillText(`PAN: ${(telemetry.panPosition * 100).toFixed(0)}%`, scopeX, scopeY + scopeRadius + 26)
  ctx.restore()

  // 5. Gain Reduction (GR) Indicators on Far Right
  const grX = width - 132
  const grY = 12
  const grH = height * 0.75

  ctx.save()
  ctx.fillStyle = 'rgba(15, 23, 42, 0.6)'
  ctx.fillRect(grX, grY, 18, grH)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.strokeRect(grX, grY, 18, grH)

  // Draw active gain reduction downward
  const grValue = Math.min(1.0, Math.max(0, -telemetry.midGrDb / 18))
  const grFillH = grValue * grH
  ctx.fillStyle = '#ef4444' // Red GR meter
  ctx.fillRect(grX + 2, grY + 2, 14, grFillH)

  ctx.fillStyle = '#94a3b8'
  ctx.font = '7.5px ui-monospace, monospace'
  ctx.textAlign = 'center'
  ctx.fillText('GR', grX + 9, grY + grH + 10)
  ctx.restore()

  ctx.restore()
}
