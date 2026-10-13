export async function canvasToPdfBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  // Convert canvas to JPEG data URL
  const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
  const base64Data = dataUrl.split(',')[1]
  const binaryString = atob(base64Data)
  const imageBytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    imageBytes[i] = binaryString.charCodeAt(i)
  }

  const imgW = canvas.width
  const imgH = canvas.height

  // Standard A4 dimensions in points: 595.28 x 841.89
  const isLandscape = imgW > imgH
  const pageWidth = isLandscape ? 841.89 : 595.28
  const pageHeight = isLandscape ? 595.28 : 841.89

  // Calculate scaled image size preserving aspect ratio with 24pt margins
  const margin = 24
  const availW = pageWidth - margin * 2
  const availH = pageHeight - margin * 2

  const scale = Math.min(availW / imgW, availH / imgH)
  const renderW = imgW * scale
  const renderH = imgH * scale
  const offsetX = margin + (availW - renderW) / 2
  const offsetY = margin + (availH - renderH) / 2

  // Build minimal valid standard PDF-1.4 file
  const chunks: BlobPart[] = []
  const xref: number[] = []
  let byteOffset = 0

  function addChunk(str: string) {
    chunks.push(str)
    byteOffset += str.length
  }

  function addBinaryChunk(bytes: Uint8Array) {
    chunks.push(bytes.buffer as ArrayBuffer)
    byteOffset += bytes.length
  }

  addChunk('%PDF-1.4\n')

  // Object 1: Catalog
  xref[1] = byteOffset
  addChunk('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n')

  // Object 2: Pages
  xref[2] = byteOffset
  addChunk('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n')

  // Object 3: Page
  xref[3] = byteOffset
  addChunk(
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth.toFixed(2)} ${pageHeight.toFixed(2)}] /Contents 4 0 R /Resources << /XObject << /Im1 5 0 R >> >> >>\nendobj\n`
  )

  // Object 4: Contents (stream positioning image)
  const contentStream = `q\n${renderW.toFixed(2)} 0 0 ${renderH.toFixed(2)} ${offsetX.toFixed(2)} ${offsetY.toFixed(2)} cm\n/Im1 Do\nQ\n`
  xref[4] = byteOffset
  addChunk(
    `4 0 obj\n<< /Length ${contentStream.length} >>\nstream\n${contentStream}endstream\nendobj\n`
  )

  // Object 5: Image XObject
  xref[5] = byteOffset
  addChunk(
    `5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imgW} /Height ${imgH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n`
  )
  addBinaryChunk(imageBytes)
  addChunk('\nendstream\nendobj\n')

  // Xref table
  const startXref = byteOffset
  addChunk(`xref\n0 6\n0000000000 65535 f \n`)
  for (let i = 1; i <= 5; i++) {
    addChunk(`${xref[i].toString().padStart(10, '0')} 00000 n \n`)
  }

  // Trailer
  addChunk(
    `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`
  )

  return new Blob(chunks, { type: 'application/pdf' })
}
