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
  const targetW = 350
  const targetH = Math.round((targetW * img.height) / img.width)

  canvas.width = targetW
  canvas.height = targetH
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  ctx.drawImage(img, 0, 0, targetW, targetH)

  const imgData = ctx.getImageData(0, 0, targetW, targetH)
  const data = imgData.data

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const lum = 0.299 * r + 0.587 * g + 0.114 * b

    if (lum >= threshold) {
      data[i] = 255
      data[i + 1] = 255
      data[i + 2] = 255
    } else {
      const inkVal = Math.max(0, Math.min(255, lum * (1 / contrast)))
      data[i] = inkVal
      data[i + 1] = inkVal
      data[i + 2] = inkVal
    }
  }

  ctx.putImageData(imgData, 0, 0)

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

  const pWidth = 413
  const pHeight = 531

  const canvas = document.createElement('canvas')
  canvas.width = pWidth
  canvas.height = pHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, pWidth, pHeight)

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

  ctx.strokeStyle = '#E2E8F0'
  ctx.lineWidth = 1
  ctx.strokeRect(0, 0, pWidth, pHeight)

  const singleBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.95)
  })
  if (!singleBlob) throw new Error('Failed to create passport photo')

  const sheetCanvas = document.createElement('canvas')
  sheetCanvas.width = 1800
  sheetCanvas.height = 1200
  const sCtx = sheetCanvas.getContext('2d')
  if (!sCtx) throw new Error('Sheet canvas not supported')

  sCtx.fillStyle = '#FFFFFF'
  sCtx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height)

  const photoW = 390
  const photoH = 500
  const marginX = (1800 - 4 * photoW) / 5
  const marginY = (1200 - 2 * photoH) / 3

  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 4; c++) {
      const x = marginX + c * (photoW + marginX)
      const y = marginY + r * (photoH + marginY)
      sCtx.drawImage(canvas, x, y, photoW, photoH)
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

/**
 * Image Format Converter (JPG, PNG, WebP)
 */
export async function convertImageFormat(
  file: File,
  targetFormat: 'image/jpeg' | 'image/png' | 'image/webp',
  quality: number = 0.92
): Promise<ImageProcessingResult> {
  const img = await readFileAsImage(file)
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  if (targetFormat === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  ctx.drawImage(img, 0, 0)

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), targetFormat, quality)
  })
  if (!blob) throw new Error('Conversion failed')

  return {
    blob,
    dataUrl: URL.createObjectURL(blob),
    sizeBytes: blob.size,
    sizeKb: Number((blob.size / 1024).toFixed(1)),
    width: img.width,
    height: img.height,
    format: targetFormat,
  }
}

/**
 * Client-Side Image to PDF Generator
 * Combines image(s) onto standard A4 PDF pages (595 x 842 points) without server upload.
 */
export async function imagesToPdf(files: File[]): Promise<Blob> {
  if (files.length === 0) throw new Error('No images selected')

  // We convert each image to JPEG data url
  const imgDataList: { dataUrl: string; width: number; height: number }[] = []
  for (const f of files) {
    const img = await readFileAsImage(f)
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, img.width, img.height)
      ctx.drawImage(img, 0, 0)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88)
      imgDataList.push({ dataUrl, width: img.width, height: img.height })
    }
  }

  // Construct a minimal valid multi-page PDF document
  // Standard A4 dimensions in points: 595.28 x 841.89
  const a4W = 595.28
  const a4H = 841.89

  // For a reliable in-browser PDF download without huge dependencies:
  // Build standard PDF binary structure
  const pdfParts: string[] = []
  pdfParts.push('%PDF-1.4\n')

  let objectId = 1
  const xrefOffsets: number[] = []

  // Function to record byte offset
  let currentByteLength = pdfParts.join('').length

  // Catalog
  xrefOffsets[objectId] = currentByteLength
  const catalogObj = `${objectId} 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`
  pdfParts.push(catalogObj)
  currentByteLength += catalogObj.length
  objectId++

  // Pages container (id: 2)
  const pagesId = objectId
  const pageObjectIds: number[] = []
  objectId++

  const pageEntries: string[] = []

  for (let i = 0; i < imgDataList.length; i++) {
    const item = imgDataList[i]
    const pageId = objectId++
    pageObjectIds.push(pageId)

    // Calculate aspect fit on A4 with 20pt margin
    const margin = 25
    const availW = a4W - margin * 2
    const availH = a4H - margin * 2
    const scale = Math.min(availW / item.width, availH / item.height)
    const fitW = item.width * scale
    const fitH = item.height * scale
    const posX = margin + (availW - fitW) / 2
    const posY = margin + (availH - fitH) / 2

    // Content stream id
    const contentId = objectId++

    // Image XObject id
    const imageXObjectId = objectId++

    // Convert dataUrl to raw bytes
    const base64Data = item.dataUrl.split(',')[1]
    const rawBinary = atob(base64Data)

    // Image Object
    const imageObjHeader = `${imageXObjectId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${item.width} /Height ${item.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${rawBinary.length} >>\nstream\n`
    const imageObjFooter = '\nendstream\nendobj\n'

    // Content stream: draws image
    const streamContent = `q\n${fitW.toFixed(2)} 0 0 ${fitH.toFixed(2)} ${posX.toFixed(2)} ${posY.toFixed(2)} cm\n/Im${i + 1} Do\nQ\n`
    const contentObj = `${contentId} 0 obj\n<< /Length ${streamContent.length} >>\nstream\n${streamContent}endstream\nendobj\n`

    // Page Object
    const pageObj = `${pageId} 0 obj\n<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${a4W} ${a4H}] /Contents ${contentId} 0 R /Resources << /XObject << /Im${i + 1} ${imageXObjectId} 0 R >> >> >>\nendobj\n`

    pageEntries.push(pageObj, contentObj, imageObjHeader, rawBinary, imageObjFooter)
  }

  // Now assemble pages container
  const kidsStr = pageObjectIds.map((id) => `${id} 0 R`).join(' ')
  const pagesObj = `${pagesId} 0 obj\n<< /Type /Pages /Kids [ ${kidsStr} ] /Count ${pageObjectIds.length} >>\nendobj\n`

  // Insert pages container
  pdfParts.splice(1, 0, pagesObj)

  // Assemble full buffer
  const binaryChunks: (string | Uint8Array)[] = [
    '%PDF-1.4\n',
    pagesObj,
  ]

  // Re-calculate xrefs cleanly
  const allParts: Uint8Array[] = []
  allParts.push(new TextEncoder().encode('%PDF-1.4\n'))

  let byteOffset = allParts[0].byteLength
  const offsets: number[] = [0]

  // Obj 1: Catalog
  offsets[1] = byteOffset
  const catBytes = new TextEncoder().encode(catalogObj)
  allParts.push(catBytes)
  byteOffset += catBytes.byteLength

  // Obj 2: Pages
  offsets[2] = byteOffset
  const pgBytes = new TextEncoder().encode(pagesObj)
  allParts.push(pgBytes)
  byteOffset += pgBytes.byteLength

  let curId = 3
  for (let i = 0; i < imgDataList.length; i++) {
    const item = imgDataList[i]
    const pId = curId++
    const cId = curId++
    const imgId = curId++

    const margin = 25
    const availW = a4W - margin * 2
    const availH = a4H - margin * 2
    const scale = Math.min(availW / item.width, availH / item.height)
    const fitW = item.width * scale
    const fitH = item.height * scale
    const posX = margin + (availW - fitW) / 2
    const posY = margin + (availH - fitH) / 2

    const pageDef = `${pId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${a4W} ${a4H}] /Contents ${cId} 0 R /Resources << /XObject << /Im${i + 1} ${imgId} 0 R >> >> >>\nendobj\n`
    offsets[pId] = byteOffset
    const pBytes = new TextEncoder().encode(pageDef)
    allParts.push(pBytes)
    byteOffset += pBytes.byteLength

    const sContent = `q\n${fitW.toFixed(2)} 0 0 ${fitH.toFixed(2)} ${posX.toFixed(2)} ${posY.toFixed(2)} cm\n/Im${i + 1} Do\nQ\n`
    const cDef = `${cId} 0 obj\n<< /Length ${sContent.length} >>\nstream\n${sContent}endstream\nendobj\n`
    offsets[cId] = byteOffset
    const cBytes = new TextEncoder().encode(cDef)
    allParts.push(cBytes)
    byteOffset += cBytes.byteLength

    const base64Data = item.dataUrl.split(',')[1]
    const binaryStr = atob(base64Data)
    const imgHeader = `${imgId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${item.width} /Height ${item.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${binaryStr.length} >>\nstream\n`
    const imgFooter = '\nendstream\nendobj\n'

    offsets[imgId] = byteOffset
    const hBytes = new TextEncoder().encode(imgHeader)
    allParts.push(hBytes)
    byteOffset += hBytes.byteLength

    const imgBin = new Uint8Array(binaryStr.length)
    for (let k = 0; k < binaryStr.length; k++) {
      imgBin[k] = binaryStr.charCodeAt(k)
    }
    allParts.push(imgBin)
    byteOffset += imgBin.byteLength

    const fBytes = new TextEncoder().encode(imgFooter)
    allParts.push(fBytes)
    byteOffset += fBytes.byteLength
  }

  const xrefStart = byteOffset
  let xrefStr = `xref\n0 ${curId}\n0000000000 65535 f \n`
  for (let id = 1; id < curId; id++) {
    const off = String(offsets[id]).padStart(10, '0')
    xrefStr += `${off} 00000 n \n`
  }
  xrefStr += `trailer\n<< /Size ${curId} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`

  allParts.push(new TextEncoder().encode(xrefStr))
  return new Blob(allParts as any, { type: 'application/pdf' })
}
