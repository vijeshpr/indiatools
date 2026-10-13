import { DocumentCorners, Point, WarpDimensions } from './types'

export function distance(p1: Point, p2: Point): number {
  const dx = p1.x - p2.x
  const dy = p1.y - p2.y
  return Math.sqrt(dx * dx + dy * dy)
}

export function computeTargetDimensions(corners: DocumentCorners): WarpDimensions {
  const { tl, tr, br, bl } = corners

  const widthTop = distance(tl, tr)
  const widthBottom = distance(bl, br)
  const targetWidth = Math.max(10, Math.round(Math.max(widthTop, widthBottom)))

  const heightLeft = distance(tl, bl)
  const heightRight = distance(tr, br)
  const targetHeight = Math.max(10, Math.round(Math.max(heightLeft, heightRight)))

  return { width: targetWidth, height: targetHeight }
}

/**
 * Solves an 8x8 linear system A * m = b using Gaussian elimination with partial pivoting.
 */
function solve8x8(A: number[][], b: number[]): number[] {
  const n = 8
  // Augment matrix
  const M: number[][] = A.map((row, i) => [...row, b[i]])

  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i
    let maxVal = Math.abs(M[i][i])
    for (let r = i + 1; r < n; r++) {
      if (Math.abs(M[r][i]) > maxVal) {
        maxVal = Math.abs(M[r][i])
        maxRow = r
      }
    }

    if (maxVal < 1e-12) {
      throw new Error('Singular matrix in homography calculation')
    }

    // Swap rows
    if (maxRow !== i) {
      const temp = M[i]
      M[i] = M[maxRow]
      M[maxRow] = temp
    }

    // Eliminate below
    for (let r = i + 1; r < n; r++) {
      const factor = M[r][i] / M[i][i]
      for (let c = i; c <= n; c++) {
        M[r][c] -= factor * M[i][c]
      }
    }
  }

  // Back substitution
  const x = new Array(n).fill(0)
  for (let i = n - 1; i >= 0; i--) {
    let sum = M[i][n]
    for (let c = i + 1; c < n; c++) {
      sum -= M[i][c] * x[c]
    }
    x[i] = sum / M[i][i]
  }

  return x
}

/**
 * Computes backward mapping homography coefficients mapping (u, v) in destination
 * to (x, y) in source:
 * x = (m0*u + m1*v + m2) / (m6*u + m7*v + 1)
 * y = (m3*u + m4*v + m5) / (m6*u + m7*v + 1)
 */
export function computeBackwardHomographyMatrix(
  corners: DocumentCorners,
  targetWidth: number,
  targetHeight: number
): number[] {
  const { tl, tr, br, bl } = corners

  // Source points (x, y)
  const src = [tl, tr, br, bl]
  // Destination points (u, v)
  const dst = [
    { x: 0, y: 0 },
    { x: targetWidth, y: 0 },
    { x: targetWidth, y: targetHeight },
    { x: 0, y: targetHeight },
  ]

  const A: number[][] = []
  const b: number[] = []

  for (let i = 0; i < 4; i++) {
    const u = dst[i].x
    const v = dst[i].y
    const x = src[i].x
    const y = src[i].y

    // Equation for x: u*m0 + v*m1 + m2 - u*x*m6 - v*x*m7 = x
    A.push([u, v, 1, 0, 0, 0, -u * x, -v * x])
    b.push(x)

    // Equation for y: u*m3 + v*m4 + m5 - u*y*m6 - v*y*m7 = y
    A.push([0, 0, 0, u, v, 1, -u * y, -v * y])
    b.push(y)
  }

  return solve8x8(A, b)
}

/**
 * Performs 4-point perspective warp with bilinear interpolation on an ImageData buffer.
 */
export function warpPerspective(
  srcData: ImageData,
  corners: DocumentCorners,
  targetWidth: number,
  targetHeight: number
): ImageData {
  const m = computeBackwardHomographyMatrix(corners, targetWidth, targetHeight)
  const [m0, m1, m2, m3, m4, m5, m6, m7] = m

  const dstData = new ImageData(targetWidth, targetHeight)
  const src = srcData.data
  const dst = dstData.data
  const sw = srcData.width
  const sh = srcData.height

  for (let v = 0; v < targetHeight; v++) {
    for (let u = 0; u < targetWidth; u++) {
      const denom = m6 * u + m7 * v + 1
      if (Math.abs(denom) < 1e-12) continue

      const sx = (m0 * u + m1 * v + m2) / denom
      const sy = (m3 * u + m4 * v + m5) / denom

      // Check bounds
      if (sx < 0 || sx >= sw - 1 || sy < 0 || sy >= sh - 1) {
        // Pixel outside bounds - fallback nearest clamp
        const cx = Math.max(0, Math.min(sw - 1, Math.round(sx)))
        const cy = Math.max(0, Math.min(sh - 1, Math.round(sy)))
        const sIdx = (cy * sw + cx) * 4
        const dIdx = (v * targetWidth + u) * 4

        dst[dIdx] = src[sIdx]
        dst[dIdx + 1] = src[sIdx + 1]
        dst[dIdx + 2] = src[sIdx + 2]
        dst[dIdx + 3] = src[sIdx + 3]
        continue
      }

      // Bilinear interpolation
      const x0 = Math.floor(sx)
      const y0 = Math.floor(sy)
      const x1 = x0 + 1
      const y1 = y0 + 1

      const dx = sx - x0
      const dy = sy - y0
      const w00 = (1 - dx) * (1 - dy)
      const w10 = dx * (1 - dy)
      const w01 = (1 - dx) * dy
      const w11 = dx * dy

      const idx00 = (y0 * sw + x0) * 4
      const idx10 = (y0 * sw + x1) * 4
      const idx01 = (y1 * sw + x0) * 4
      const idx11 = (y1 * sw + x1) * 4

      const dIdx = (v * targetWidth + u) * 4

      dst[dIdx] = Math.round(
        w00 * src[idx00] + w10 * src[idx10] + w01 * src[idx01] + w11 * src[idx11]
      )
      dst[dIdx + 1] = Math.round(
        w00 * src[idx00 + 1] + w10 * src[idx10 + 1] + w01 * src[idx01 + 1] + w11 * src[idx11 + 1]
      )
      dst[dIdx + 2] = Math.round(
        w00 * src[idx00 + 2] + w10 * src[idx10 + 2] + w01 * src[idx01 + 2] + w11 * src[idx11 + 2]
      )
      dst[dIdx + 3] = 255
    }
  }

  return dstData
}
