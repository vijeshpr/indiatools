/**
 * Waveform visualizer helper for canvas rendering
 * Efficient peak downsampling and drawing
 */

export interface WaveformData {
  peaks: Float32Array // Min/max peak pairs [min0, max0, min1, max1, ...]
  length: number
}

/**
 * Precompute downsampled peak data from an AudioBuffer for fast canvas drawing
 */
export function extractWaveformData(buffer: AudioBuffer, numPoints = 600): WaveformData {
  const channelData = buffer.getChannelData(0)
  const totalSamples = channelData.length
  const step = Math.max(1, Math.floor(totalSamples / numPoints))
  const actualPoints = Math.min(numPoints, Math.ceil(totalSamples / step))

  const peaks = new Float32Array(actualPoints * 2)

  for (let i = 0; i < actualPoints; i++) {
    const start = i * step
    const end = Math.min(start + step, totalSamples)
    let min = 1.0
    let max = -1.0

    for (let j = start; j < end; j++) {
      const val = channelData[j]
      if (val < min) min = val
      if (val > max) max = val
    }

    if (min > max) {
      min = 0
      max = 0
    }

    peaks[i * 2] = min
    peaks[i * 2 + 1] = max
  }

  return { peaks, length: actualPoints }
}

/**
 * Draw waveform onto an HTML Canvas
 */
export function renderWaveformOnCanvas(
  canvas: HTMLCanvasElement,
  waveformData: WaveformData | null,
  progress = 0, // 0.0 to 1.0
  isProcessed = false
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const width = canvas.width / dpr
  const height = canvas.height / dpr

  ctx.save()
  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, width, height)

  const centerY = height / 2

  if (!waveformData || waveformData.length === 0) {
    // Draw idle background line
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(width, centerY)
    ctx.stroke()
    ctx.restore()
    return
  }

  const { peaks, length } = waveformData
  const barWidth = width / length
  const progressX = progress * width

  // Colors
  const activeColor = isProcessed ? '#06B6D4' : '#8B5CF6' // Electric Cyan or Studio Purple
  const inactiveColor = '#334155'

  for (let i = 0; i < length; i++) {
    const x = i * barWidth
    const min = peaks[i * 2]
    const max = peaks[i * 2 + 1]

    const yTop = centerY + min * (height * 0.44)
    const yBottom = centerY + max * (height * 0.44)
    const barHeight = Math.max(2, yBottom - yTop)

    ctx.fillStyle = x <= progressX ? activeColor : inactiveColor
    ctx.fillRect(x, yTop, Math.max(1, barWidth - 1), barHeight)
  }

  // Draw playhead cursor line
  if (progress > 0 && progress <= 1) {
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 2
    ctx.shadowColor = activeColor
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.moveTo(progressX, 0)
    ctx.lineTo(progressX, height)
    ctx.stroke()

    // Playhead head marker
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(progressX, 6, 4, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}
