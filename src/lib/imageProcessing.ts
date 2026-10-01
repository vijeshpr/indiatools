// Client-side 100% private browser image processing engine
// Uses HTML5 Canvas and native Blob APIs - no server roundtrips

export interface ImageProcessingResult {
  blob: Blob
  dataUrl: string
  sizeBytes: number
  sizeKb: number
  width: number
  height: number
  format: string
}

export function readFileAsImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Failed to load image file.'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('Failed to read file.'))
    reader.readAsDataURL(file)
  })
}

/**
 * Compresses an image to fit below a max target KB (e.g., 50KB or 100KB)
 */
export async function compressToMaxKb(
  file: File,
  maxKb: number = 50,
  targetWidth?: number,
  targetHeight?: number
): Promise<ImageProcessingResult> {
  const img = await readFileAsImage(file)
  const maxBytes = maxKb * 1024

  let curWidth = targetWidth || img.width
  let curHeight = targetHeight || img.height

  // If source is huge (> 1800px), downscale initially to keep quality high and processing fast
  if (!targetWidth && !targetHeight) {
    const maxDim = 1200
    if (curWidth > maxDim || curHeight > maxDim) {
      if (curWidth > curHeight) {
        curHeight = Math.round((curHeight * maxDim) / curWidth)
        curWidth = maxDim
      } else {
        curWidth = Math.round((curWidth * maxDim) / curHeight)
        curHeight = maxDim
      }
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = curWidth
  canvas.height = curHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unsupported')

  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, curWidth, curHeight)
  ctx.drawImage(img, 0, 0, curWidth, curHeight)

  // Iteratively reduce quality or scale down if needed
  let quality = 0.92
  let blob: Blob | null = null
  let attempts = 0

  while (attempts < 10) {
    attempts++
    blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', quality)
    })

    if (!blob) break
    if (blob.size <= maxBytes) {
      break
    }

    if (quality > 0.3) {
      quality -= 0.12
    } else {
      // Downscale canvas dimensions by 15%
      curWidth = Math.round(curWidth * 0.85)
      curHeight = Math.round(curHeight * 0.85)
      canvas.width = curWidth
      canvas.height = curHeight
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, curWidth, curHeight)
      ctx.drawImage(img, 0, 0, curWidth, curHeight)
      quality = 0.75
    }
  }

  if (!blob) throw new Error('Failed to compress image')

  const dataUrl = URL.createObjectURL(blob)
  return {
    blob,
    dataUrl,
    sizeBytes: blob.size,
    sizeKb: Number((blob.size / 1024).toFixed(1)),
    width: curWidth,
    height: curHeight,
    format: 'image/jpeg',
  }
}

/**
 * Compresses an image to an exact target KB within a tight ±5% window
 */
export async function compressToExactKb(
  file: File,
  targetKb: number
): Promise<ImageProcessingResult> {
  const img = await readFileAsImage(file)
  const targetBytes = targetKb * 1024

  let curWidth = img.width
  let curHeight = img.height

  // If initial file is smaller than target, we can re-export at high quality or keep as is
  const maxDim = 1600
  if (curWidth > maxDim || curHeight > maxDim) {
    const ratio = curWidth / curHeight
    if (ratio > 1) {
      curWidth = maxDim
      curHeight = Math.round(maxDim / ratio)
    } else {
      curHeight = maxDim
      curWidth = Math.round(maxDim * ratio)
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = curWidth
  canvas.height = curHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context unsupported')

  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, curWidth, curHeight)
  ctx.drawImage(img, 0, 0, curWidth, curHeight)

  // Binary search for optimal JPEG quality
  let minQ = 0.05
  let maxQ = 0.98
  let bestBlob: Blob | null = null
  let bestDiff = Infinity

  for (let step = 0; step < 8; step++) {
    const testQ = (minQ + maxQ) / 2
    const currentBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', testQ)
    })

    if (!currentBlob) continue
    const diff = Math.abs(currentBlob.size - targetBytes)

    if (diff < bestDiff) {
      bestDiff = diff
      bestBlob = currentBlob
    }

    if (currentBlob.size > targetBytes) {
      maxQ = testQ
    } else {
      minQ = testQ
    }
  }

  // If even at minimum quality it's still bigger than target, scale down dimensions
  if (bestBlob && bestBlob.size > targetBytes * 1.08) {
    const scaleFactor = Math.sqrt(targetBytes / bestBlob.size)
    curWidth = Math.max(100, Math.round(curWidth * scaleFactor * 0.95))
    curHeight = Math.max(100, Math.round(curHeight * scaleFactor * 0.95))
    canvas.width = curWidth
    canvas.height = curHeight
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, curWidth, curHeight)
    ctx.drawImage(img, 0, 0, curWidth, curHeight)

    bestBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.75)
    })
  }

  if (!bestBlob) throw new Error('Could not achieve target file size')

  const dataUrl = URL.createObjectURL(bestBlob)
  return {
    blob: bestBlob,
    dataUrl,
    sizeBytes: bestBlob.size,
    sizeKb: Number((bestBlob.size / 1024).toFixed(1)),
    width: curWidth,
    height: curHeight,
    format: 'image/jpeg',
  }
}

/**
 * Signature Resizer with background whitening and contrast enhancement
 */
export async function processSignature(
  file: File,
  targetMaxKb: number = 20,
  contrast: number = 1.4,
  threshold: number = 210
): Promise<ImageProcessingResult> {
  const img = await readFileAsImage(file)
  const canvas = document.createElement('canvas')
  // Standard Indian exam signature aspect ratio: roughly 140x60 px or 280x120 px
  const targetW = 350
  const targetH = Math.round((targetW * img.height) / img.width)

  canvas.width = targetW
  canvas.height = targetH
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  ctx.drawImage(img, 0, 0, targetW, targetH)

  // Pixel manipulation for paper whitening & crisp ink
  const imgData = ctx.getImageData(0, 0, targetW, targetH)
  const data = imgData.data

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    // Luminance
    const lum = 0.299 * r + 0.587 * g + 0.114 * b

    if (lum >= threshold) {
      // Paper background turned pure white
      data[i] = 255
      data[i + 1] = 255
      data[i + 2] = 255
    } else {
      // Deepen signature ink with contrast
      const inkVal = Math.max(0, Math.min(255, lum * (1 / contrast)))
      data[i] = inkVal
      data[i + 1] = inkVal
      data[i + 2] = inkVal
    }
  }

  ctx.putImageData(imgData, 0, 0)

  // Compress to target KB
  const maxBytes = targetMaxKb * 1024
  let quality = 0.85
  let blob: Blob | null = null

  for (let i = 0; i < 6; i++) {
    blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', quality)
    })
    if (!blob) break
    if (blob.size <= maxBytes || quality <= 0.3) break
    quality -= 0.12
  }

  if (!blob) throw new Error('Signature processing failed')

  return {
    blob,
    dataUrl: URL.createObjectURL(blob),
    sizeBytes: blob.size,
    sizeKb: Number((blob.size / 1024).toFixed(1)),
    width: targetW,
    height: targetH,
    format: 'image/jpeg',
  }
}

/**
 * Passport Photo Maker (3.5cm x 4.5cm Indian standard, single photo and 8-photo 4x6 sheet)
 */
export async function generatePassportPhoto(
  file: File,
  bgColor: string = '#FFFFFF',
  zoom: number = 1.0,
  offsetX: number = 0,
  offsetY: number = 0
): Promise<{ single: ImageProcessingResult; printableSheetUrl: string }> {
  const img = await readFileAsImage(file)

  // Standard Indian passport photo spec: 3.5cm x 4.5cm (approx 413 x 531 px @ 300 DPI)
  const pWidth = 413
  const pHeight = 531

  const canvas = document.createElement('canvas')
  canvas.width = pWidth
  canvas.height = pHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  // Background
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, pWidth, pHeight)

  // Draw image with zoom and offset
  const aspect = img.width / img.height
  let drawW = pWidth * zoom
  let drawH = (pWidth / aspect) * zoom
  if (drawH < pHeight * zoom) {
    drawH = pHeight * zoom
    drawW = pHeight * aspect * zoom
  }

  const posX = (pWidth - drawW) / 2 + offsetX
  const posY = (pHeight - drawH) / 2 + offsetY

  ctx.drawImage(img, posX, posY, drawW, drawH)

  // 1px subtle boundary border
  ctx.strokeStyle = '#E2E8F0'
  ctx.lineWidth = 1
  ctx.strokeRect(0, 0, pWidth, pHeight)

  // Export single photo
  const singleBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.95)
  })
  if (!singleBlob) throw new Error('Failed to create passport photo')

  // Generate 8-photo 4x6 inch studio sheet (1200 x 1800 px @ 300 DPI)
  const sheetCanvas = document.createElement('canvas')
  sheetCanvas.width = 1800
  sheetCanvas.height = 1200
  const sCtx = sheetCanvas.getContext('2d')
  if (!sCtx) throw new Error('Sheet canvas not supported')

  sCtx.fillStyle = '#FFFFFF'
  sCtx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height)

  // Draw 2 rows of 4 photos with cutting guide margins
  const photoW = 390
  const photoH = 500
  const marginX = (1800 - 4 * photoW) / 5
  const marginY = (1200 - 2 * photoH) / 3

  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 4; c++) {
      const x = marginX + c * (photoW + marginX)
      const y = marginY + r * (photoH + marginY)
      sCtx.drawImage(canvas, x, y, photoW, photoH)
      // Cutting dotted guides
      sCtx.strokeStyle = '#CCCCCC'
      sCtx.setLineDash([4, 4])
      sCtx.strokeRect(x - 2, y - 2, photoW + 4, photoH + 4)
    }
  }

  const sheetBlob = await new Promise<Blob | null>((resolve) => {
    sheetCanvas.toBlob((b) => resolve(b), 'image/jpeg', 0.95)
  })

  return {
    single: {
      blob: singleBlob,
      dataUrl: URL.createObjectURL(singleBlob),
      sizeBytes: singleBlob.size,
      sizeKb: Number((singleBlob.size / 1024).toFixed(1)),
      width: pWidth,
      height: pHeight,
      format: 'image/jpeg',
    },
    printableSheetUrl: sheetBlob ? URL.createObjectURL(sheetBlob) : '',
  }
}
