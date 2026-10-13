import { ScanFilter } from './types'

export function applyScanFilter(srcData: ImageData, filter: ScanFilter): ImageData {
  const width = srcData.width
  const height = srcData.height
  const output = new ImageData(
    new Uint8ClampedArray(srcData.data),
    width,
    height
  )
  const data = output.data
  const len = data.length

  if (filter === 'original') {
    return output
  }

  if (filter === 'grayscale') {
    // High-contrast clean photocopy grayscale
    for (let i = 0; i < len; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const gray = 0.299 * r + 0.587 * g + 0.114 * b

      // Gamma curve boost for crisp text photocopy
      const adjusted = Math.max(0, Math.min(255, (gray - 128) * 1.35 + 140))
      data[i] = adjusted
      data[i + 1] = adjusted
      data[i + 2] = adjusted
    }
    return output
  }

  if (filter === 'color') {
    // Color Document: Enhance vibrancy, clean background, sharpen text
    // 1. Estimate background white point
    let maxLuminance = 200
    for (let i = 0; i < len; i += 32) {
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
      if (lum > maxLuminance) maxLuminance = lum
    }

    const scaleFactor = 255 / Math.max(200, maxLuminance)

    for (let i = 0; i < len; i += 4) {
      let r = data[i] * scaleFactor
      let g = data[i + 1] * scaleFactor
      let b = data[i + 2] * scaleFactor

      // Contrast boost
      r = (r - 128) * 1.22 + 132
      g = (g - 128) * 1.22 + 132
      b = (b - 128) * 1.22 + 132

      data[i] = Math.max(0, Math.min(255, r))
      data[i + 1] = Math.max(0, Math.min(255, g))
      data[i + 2] = Math.max(0, Math.min(255, b))
    }
    return output
  }

  if (filter === 'magic-bw') {
    // B&W Magic Filter: Adaptive shadow removal & high-contrast ink binarization
    // Step 1: Compute grayscale luminance buffer
    const gray = new Uint8Array(width * height)
    for (let i = 0; i < width * height; i++) {
      const idx = i * 4
      gray[i] = Math.round(
        0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]
      )
    }

    // Step 2: Compute Integral Image for O(1) box filtering of local background
    // Integral image has dimensions (width + 1) * (height + 1)
    const intW = width + 1
    const integral = new Float64Array(intW * (height + 1))

    for (let y = 0; y < height; y++) {
      let rowSum = 0
      for (let x = 0; x < width; x++) {
        rowSum += gray[y * width + x]
        integral[(y + 1) * intW + (x + 1)] =
          integral[y * intW + (x + 1)] + rowSum
      }
    }

    // Local window radius (proportional to document size, approx 2.5% of width)
    const radius = Math.max(8, Math.min(40, Math.round(width * 0.025)))
    const C = 10 // Threshold bias for ink vs background

    for (let y = 0; y < height; y++) {
      const y0 = Math.max(0, y - radius)
      const y1 = Math.min(height, y + radius + 1)

      for (let x = 0; x < width; x++) {
        const x0 = Math.max(0, x - radius)
        const x1 = Math.min(width, x + radius + 1)

        const count = (x1 - x0) * (y1 - y0)
        const sum =
          integral[y1 * intW + x1] -
          integral[y0 * intW + x1] -
          integral[y1 * intW + x0] +
          integral[y0 * intW + x0]

        const localMean = sum / count
        const currentVal = gray[y * width + x]

        const pixelIdx = (y * width + x) * 4

        // If pixel is darker than local neighborhood mean by C -> Ink
        if (currentVal < localMean - C) {
          // Deep sharp black ink with smooth edge gradient
          const inkIntensity = Math.max(
            0,
            Math.min(45, (currentVal / localMean) * 45)
          )
          data[pixelIdx] = inkIntensity
          data[pixelIdx + 1] = inkIntensity
          data[pixelIdx + 2] = inkIntensity
        } else {
          // Pure bleached white paper
          data[pixelIdx] = 255
          data[pixelIdx + 1] = 255
          data[pixelIdx + 2] = 255
        }
      }
    }

    return output
  }

  return output
}
