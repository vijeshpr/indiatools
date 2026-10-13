import { InpaintingProgress } from './types'

// Pixel states for Telea inpainting
const STATE_KNOWN = 0
const STATE_BAND = 1
const STATE_INSIDE = 2

/**
 * Priority queue item for Fast Marching Method.
 */
interface HeapItem {
  x: number
  y: number
  dist: number
}

class FastMinHeap {
  private data: HeapItem[] = []

  push(item: HeapItem): void {
    this.data.push(item)
    this.bubbleUp(this.data.length - 1)
  }

  pop(): HeapItem | undefined {
    if (this.data.length === 0) return undefined
    const top = this.data[0]
    const bottom = this.data.pop()!
    if (this.data.length > 0) {
      this.data[0] = bottom
      this.sinkDown(0)
    }
    return top
  }

  get size(): number {
    return this.data.length
  }

  private bubbleUp(index: number): void {
    let current = index
    while (current > 0) {
      const parent = (current - 1) >> 1
      if (this.data[current].dist < this.data[parent].dist) {
        const tmp = this.data[current]
        this.data[current] = this.data[parent]
        this.data[parent] = tmp
        current = parent
      } else {
        break
      }
    }
  }

  private sinkDown(index: number): void {
    const len = this.data.length
    let current = index
    while (true) {
      const left = (current << 1) + 1
      const right = left + 1
      let smallest = current

      if (left < len && this.data[left].dist < this.data[smallest].dist) {
        smallest = left
      }
      if (right < len && this.data[right].dist < this.data[smallest].dist) {
        smallest = right
      }

      if (smallest !== current) {
        const tmp = this.data[current]
        this.data[current] = this.data[smallest]
        this.data[smallest] = tmp
        current = smallest
      } else {
        break
      }
    }
  }
}

/**
 * Computes gradient for a given channel using only KNOWN pixels.
 */
function computeGradient(
  pixels: Uint8ClampedArray,
  state: Uint8Array,
  width: number,
  height: number,
  x: number,
  y: number,
  channel: number
): { gx: number; gy: number } {
  let gx = 0
  let gy = 0

  const idxCurrent = (y * width + x) * 4 + channel

  // Horizontal gradient
  const hasRight = x + 1 < width && state[y * width + (x + 1)] === STATE_KNOWN
  const hasLeft = x - 1 >= 0 && state[y * width + (x - 1)] === STATE_KNOWN

  if (hasRight && hasLeft) {
    gx = (pixels[(y * width + (x + 1)) * 4 + channel] - pixels[(y * width + (x - 1)) * 4 + channel]) / 2
  } else if (hasRight) {
    gx = pixels[(y * width + (x + 1)) * 4 + channel] - pixels[idxCurrent]
  } else if (hasLeft) {
    gx = pixels[idxCurrent] - pixels[(y * width + (x - 1)) * 4 + channel]
  }

  // Vertical gradient
  const hasBottom = y + 1 < height && state[(y + 1) * width + x] === STATE_KNOWN
  const hasTop = y - 1 >= 0 && state[(y - 1) * width + x] === STATE_KNOWN

  if (hasBottom && hasTop) {
    gy = (pixels[((y + 1) * width + x) * 4 + channel] - pixels[((y - 1) * width + x) * 4 + channel]) / 2
  } else if (hasBottom) {
    gy = pixels[((y + 1) * width + x) * 4 + channel] - pixels[idxCurrent]
  } else if (hasTop) {
    gy = pixels[idxCurrent] - pixels[((y - 1) * width + x) * 4 + channel]
  }

  return { gx, gy }
}

/**
 * Computes gradient of distance map T at (x, y).
 */
function computeDistanceGradient(
  distMap: Float32Array,
  width: number,
  height: number,
  x: number,
  y: number
): { nx: number; ny: number } {
  const x1 = Math.max(0, x - 1)
  const x2 = Math.min(width - 1, x + 1)
  const y1 = Math.max(0, y - 1)
  const y2 = Math.min(height - 1, y + 1)

  const tLeft = distMap[y * width + x1]
  const tRight = distMap[y * width + x2]
  const tTop = distMap[y1 * width + x]
  const tBottom = distMap[y2 * width + x]

  let nx = tRight - tLeft
  let ny = tBottom - tTop
  const len = Math.sqrt(nx * nx + ny * ny)

  if (len > 1e-4) {
    nx /= len
    ny /= len
  } else {
    nx = 0
    ny = 0
  }

  return { nx, ny }
}

/**
 * Alexandru Telea (2004) Inpainting Algorithm.
 * Propagates surrounding pixel values and gradients into masked regions using the Fast Marching Method.
 */
export async function runTeleaInpainting(
  sourceImage: ImageData,
  maskImage: ImageData,
  radius: number = 4,
  onProgress?: (progress: InpaintingProgress) => void
): Promise<ImageData> {
  const width = sourceImage.width
  const height = sourceImage.height
  const totalPixels = width * height

  // Output image data copy
  const outputData = new Uint8ClampedArray(sourceImage.data)
  const maskData = maskImage.data

  // Data structures
  const state = new Uint8Array(totalPixels)
  const dist = new Float32Array(totalPixels)
  const heap = new FastMinHeap()

  onProgress?.({
    percent: 10,
    stage: 'analyzing',
    message: 'Analyzing boundary contours and edge gradients...',
  })

  // 1. Initialize pixel states: KNOWN vs INSIDE
  let maskPixelCount = 0
  for (let i = 0; i < totalPixels; i++) {
    // Mask is active if red or alpha channel > 16
    const isMasked = maskData[i * 4] > 16 || maskData[i * 4 + 3] > 16
    if (isMasked) {
      state[i] = STATE_INSIDE
      dist[i] = 1e9
      maskPixelCount++
    } else {
      state[i] = STATE_KNOWN
      dist[i] = 0
    }
  }

  if (maskPixelCount === 0) {
    onProgress?.({
      percent: 100,
      stage: 'done',
      message: 'No masked region detected.',
    })
    return new ImageData(outputData, width, height)
  }

  // 2. Identify initial narrow-band boundary pixels (BAND)
  const dx = [-1, 1, 0, 0]
  const dy = [0, 0, -1, 1]

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x
      if (state[idx] === STATE_INSIDE) {
        let hasKnownNeighbor = false
        for (let k = 0; k < 4; k++) {
          const nx = x + dx[k]
          const ny = y + dy[k]
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            if (state[ny * width + nx] === STATE_KNOWN) {
              hasKnownNeighbor = true
              break
            }
          }
        }
        if (hasKnownNeighbor) {
          state[idx] = STATE_BAND
          dist[idx] = 0
          heap.push({ x, y, dist: 0 })
        }
      }
    }
  }

  onProgress?.({
    percent: 25,
    stage: 'propagating',
    message: 'Propagating boundary colors and texture gradients...',
  })

  // 3. Fast Marching Propagation loop
  let processedPixels = 0
  const maxToProcess = maskPixelCount
  let lastProgressYield = Date.now()

  while (heap.size > 0) {
    const current = heap.pop()!
    const { x: px, y: py } = current
    const pIdx = py * width + px

    // Mark as KNOWN
    state[pIdx] = STATE_KNOWN
    processedPixels++

    // Reconstruct color for pixel p from known neighborhood B_radius(p)
    let sumR = 0
    let sumG = 0
    let sumB = 0
    let sumWeight = 0

    const { nx, ny } = computeDistanceGradient(dist, width, height, px, py)

    const startX = Math.max(0, px - radius)
    const endX = Math.min(width - 1, px + radius)
    const startY = Math.max(0, py - radius)
    const endY = Math.min(height - 1, py + radius)

    for (let qy = startY; qy <= endY; qy++) {
      for (let qx = startX; qx <= endX; qx++) {
        const qIdx = qy * width + qx
        if (state[qIdx] !== STATE_KNOWN) continue

        const rx = px - qx
        const ry = py - qy
        const distSq = rx * rx + ry * ry
        if (distSq > radius * radius || distSq === 0) continue

        const dst = Math.sqrt(distSq)

        // Direction factor (normal propagation)
        let dir = Math.abs(rx * nx + ry * ny) / dst
        if (dir < 0.01) dir = 0.01

        // Geometric distance factor
        const dstWeight = 1.0 / (dst * dst)

        // Level-set distance factor
        const levWeight = 1.0 / (1.0 + Math.abs(dist[pIdx] - dist[qIdx]))

        const w = dir * dstWeight * levWeight

        const qByteIdx = qIdx * 4
        const qR = outputData[qByteIdx]
        const qG = outputData[qByteIdx + 1]
        const qB = outputData[qByteIdx + 2]

        // First-order gradient propagation
        const gradR = computeGradient(outputData, state, width, height, qx, qy, 0)
        const gradG = computeGradient(outputData, state, width, height, qx, qy, 1)
        const gradB = computeGradient(outputData, state, width, height, qx, qy, 2)

        const dR = Math.max(-25, Math.min(25, gradR.gx * rx + gradR.gy * ry))
        const dG = Math.max(-25, Math.min(25, gradG.gx * rx + gradG.gy * ry))
        const dB = Math.max(-25, Math.min(25, gradB.gx * rx + gradB.gy * ry))

        const estR = Math.max(0, Math.min(255, qR + dR))
        const estG = Math.max(0, Math.min(255, qG + dG))
        const estB = Math.max(0, Math.min(255, qB + dB))

        sumR += w * estR
        sumG += w * estG
        sumB += w * estB
        sumWeight += w
      }
    }

    if (sumWeight > 0) {
      const pByteIdx = pIdx * 4
      outputData[pByteIdx] = Math.min(255, Math.max(0, Math.round(sumR / sumWeight)))
      outputData[pByteIdx + 1] = Math.min(255, Math.max(0, Math.round(sumG / sumWeight)))
      outputData[pByteIdx + 2] = Math.min(255, Math.max(0, Math.round(sumB / sumWeight)))
      outputData[pByteIdx + 3] = 255
    }

    // Propagate to 4-connected neighbors
    for (let k = 0; k < 4; k++) {
      const nx = px + dx[k]
      const ny = py + dy[k]
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx
        if (state[nIdx] === STATE_INSIDE) {
          state[nIdx] = STATE_BAND
          dist[nIdx] = dist[pIdx] + 1.0
          heap.push({ x: nx, y: ny, dist: dist[nIdx] })
        }
      }
    }

    // Yield periodically to allow UI update
    if (Date.now() - lastProgressYield > 35) {
      const progressPercent = Math.min(
        92,
        25 + Math.round((processedPixels / maxToProcess) * 65)
      )
      onProgress?.({
        percent: progressPercent,
        stage: 'propagating',
        message: `Inpainting pixels... ${progressPercent}%`,
      })
      await new Promise((r) => setTimeout(r, 0))
      lastProgressYield = Date.now()
    }
  }

  onProgress?.({
    percent: 98,
    stage: 'finalizing',
    message: 'Harmonizing pixel continuity and blending edges...',
  })

  // Small breath before completing
  await new Promise((r) => setTimeout(r, 20))

  onProgress?.({
    percent: 100,
    stage: 'done',
    message: 'Inpainting completed successfully!',
  })

  return new ImageData(outputData, width, height)
}
