import { DocumentCorners, Point } from './types'

export function createDefaultCorners(width: number, height: number): DocumentCorners {
  const padX = Math.round(width * 0.08)
  const padY = Math.round(height * 0.08)

  return {
    tl: { x: padX, y: padY },
    tr: { x: width - padX, y: padY },
    br: { x: width - padX, y: height - padY },
    bl: { x: padX, y: height - padY },
  }
}

/**
 * Automatically detects paper document corners in an ImageData object using
 * Sobel gradient magnitude and convex quadrilateral boundary estimation.
 */
export function detectDocumentCorners(
  srcData: ImageData,
  maxDetectDim: number = 400
): DocumentCorners {
  const origW = srcData.width
  const origH = srcData.height

  if (origW < 20 || origH < 20) {
    return createDefaultCorners(origW, origH)
  }

  // Calculate downsample scale for high-speed edge analysis
  const scale = Math.min(1, maxDetectDim / Math.max(origW, origH))
  const dw = Math.max(20, Math.round(origW * scale))
  const dh = Math.max(20, Math.round(origH * scale))

  // Downsample to grayscale array
  const gray = new Uint8Array(dw * dh)
  const src = srcData.data

  for (let dy = 0; dy < dh; dy++) {
    const sy = Math.min(origH - 1, Math.floor(dy / scale))
    for (let dx = 0; dx < dw; dx++) {
      const sx = Math.min(origW - 1, Math.floor(dx / scale))
      const idx = (sy * origW + sx) * 4
      // Luminance Y = 0.299R + 0.587G + 0.114B
      gray[dy * dw + dx] = Math.round(
        0.299 * src[idx] + 0.587 * src[idx + 1] + 0.114 * src[idx + 2]
      )
    }
  }

  // 3x3 Gaussian blur to attenuate noise
  const blurred = new Uint8Array(dw * dh)
  const kernel = [1, 2, 1, 2, 4, 2, 1, 2, 1] // sum = 16

  for (let y = 1; y < dh - 1; y++) {
    for (let x = 1; x < dw - 1; x++) {
      let sum = 0
      let k = 0
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          sum += gray[(y + ky) * dw + (x + kx)] * kernel[k++]
        }
      }
      blurred[y * dw + x] = sum >> 4
    }
  }

  // Sobel Gradient Magnitude: G = sqrt(Gx^2 + Gy^2)
  const grad = new Float32Array(dw * dh)
  let maxGrad = 0

  for (let y = 1; y < dh - 1; y++) {
    for (let x = 1; x < dw - 1; x++) {
      const gx =
        -blurred[(y - 1) * dw + (x - 1)] +
        blurred[(y - 1) * dw + (x + 1)] -
        2 * blurred[y * dw + (x - 1)] +
        2 * blurred[y * dw + (x + 1)] -
        blurred[(y + 1) * dw + (x - 1)] +
        blurred[(y + 1) * dw + (x + 1)]

      const gy =
        -blurred[(y - 1) * dw + (x - 1)] -
        2 * blurred[(y - 1) * dw + x] -
        blurred[(y - 1) * dw + (x + 1)] +
        blurred[(y + 1) * dw + (x - 1)] +
        2 * blurred[(y + 1) * dw + x] +
        blurred[(y + 1) * dw + (x + 1)]

      const mag = Math.sqrt(gx * gx + gy * gy)
      grad[y * dw + x] = mag
      if (mag > maxGrad) maxGrad = mag
    }
  }

  // Adaptive thresholding: retain strong edge points
  const threshold = Math.max(30, maxGrad * 0.28)
  const edgePoints: Point[] = []

  // Skip border pixels
  const insetX = Math.round(dw * 0.03)
  const insetY = Math.round(dh * 0.03)

  for (let y = insetY; y < dh - insetY; y++) {
    for (let x = insetX; x < dw - insetX; x++) {
      if (grad[y * dw + x] >= threshold) {
        edgePoints.push({ x, y })
      }
    }
  }

  // If too few edge points were detected, use default margins
  if (edgePoints.length < 50) {
    return createDefaultCorners(origW, origH)
  }

  // Find 4 extreme corner candidates
  // tl: min(x + y)
  // tr: max(x - y)
  // br: max(x + y)
  // bl: min(x - y)
  let minSum = Infinity
  let maxSum = -Infinity
  let minDiff = Infinity
  let maxDiff = -Infinity

  let bestTL: Point = { x: dw * 0.1, y: dh * 0.1 }
  let bestTR: Point = { x: dw * 0.9, y: dh * 0.1 }
  let bestBR: Point = { x: dw * 0.9, y: dh * 0.9 }
  let bestBL: Point = { x: dw * 0.1, y: dh * 0.9 }

  for (const p of edgePoints) {
    const sum = p.x + p.y
    const diff = p.x - p.y

    if (sum < minSum) {
      minSum = sum
      bestTL = p
    }
    if (sum > maxSum) {
      maxSum = sum
      bestBR = p
    }
    if (diff > maxDiff) {
      maxDiff = diff
      bestTR = p
    }
    if (diff < minDiff) {
      minDiff = diff
      bestBL = p
    }
  }

  // Verify quadrilateral plausibility (convexity & area)
  // Area using shoelace formula
  const area = Math.abs(
    (bestTL.x * (bestTR.y - bestBL.y) +
      bestTR.x * (bestBR.y - bestTL.y) +
      bestBR.x * (bestBL.y - bestTR.y) +
      bestBL.x * (bestTL.y - bestBR.y)) /
      2
  )

  const totalArea = dw * dh
  if (area < totalArea * 0.15 || area > totalArea * 0.98) {
    // Unrealistic quad, use default
    return createDefaultCorners(origW, origH)
  }

  // Scale back to full resolution
  const invScale = 1 / scale
  return {
    tl: {
      x: Math.max(0, Math.min(origW, Math.round(bestTL.x * invScale))),
      y: Math.max(0, Math.min(origH, Math.round(bestTL.y * invScale))),
    },
    tr: {
      x: Math.max(0, Math.min(origW, Math.round(bestTR.x * invScale))),
      y: Math.max(0, Math.min(origH, Math.round(bestTR.y * invScale))),
    },
    br: {
      x: Math.max(0, Math.min(origW, Math.round(bestBR.x * invScale))),
      y: Math.max(0, Math.min(origH, Math.round(bestBR.y * invScale))),
    },
    bl: {
      x: Math.max(0, Math.min(origW, Math.round(bestBL.x * invScale))),
      y: Math.max(0, Math.min(origH, Math.round(bestBL.y * invScale))),
    },
  }
}
