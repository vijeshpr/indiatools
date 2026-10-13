import {
  WatermarkPayload,
  ImageEmbeddingConfig,
  ImageExtractionResult,
} from './types'
import { computeCRC32 } from './crc'

// Sync preamble: 'WMKR'
const PREAMBLE_BYTES = [0x57, 0x4d, 0x4b, 0x52] // 4 bytes
const FORMAT_VERSION = 0x01

export function serializeImagePayload(payload: WatermarkPayload): Uint8Array {
  const jsonStr = JSON.stringify(payload)
  const encoder = new TextEncoder()
  const payloadBytes = encoder.encode(jsonStr)

  if (payloadBytes.length > 65535) {
    throw new Error('Image watermark payload exceeds maximum limit of 64KB')
  }

  const crc = computeCRC32(payloadBytes)

  // Total frame: Preamble (4) + Version (1) + Length (2) + Payload (N) + CRC32 (4)
  const frame = new Uint8Array(11 + payloadBytes.length)
  frame.set(PREAMBLE_BYTES, 0)
  frame[4] = FORMAT_VERSION
  frame[5] = (payloadBytes.length >> 8) & 0xff
  frame[6] = payloadBytes.length & 0xff
  frame.set(payloadBytes, 7)

  // CRC32 big-endian
  frame[7 + payloadBytes.length] = (crc >>> 24) & 0xff
  frame[8 + payloadBytes.length] = (crc >>> 16) & 0xff
  frame[9 + payloadBytes.length] = (crc >>> 8) & 0xff
  frame[10 + payloadBytes.length] = crc & 0xff

  return frame
}

export function embedImageWatermark(
  imageData: ImageData,
  payload: WatermarkPayload,
  config: ImageEmbeddingConfig = { bitsPerChannel: 1, redundancyFactor: 1 }
): ImageData {
  const frame = serializeImagePayload(payload)
  const totalFrameBits = frame.length * 8
  const totalPixels = imageData.width * imageData.height

  if (totalFrameBits > totalPixels) {
    throw new Error(
      `Image resolution (${imageData.width}x${imageData.height} = ${totalPixels} px) is too small to embed payload (${totalFrameBits} bits needed).`
    )
  }

  const outputData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  )
  const data = outputData.data

  // Calculate how many times we can repeat the tile
  const maxTiles = Math.floor(totalPixels / totalFrameBits)
  const tileCount = Math.max(1, Math.min(config.redundancyFactor, maxTiles))

  let bitIdx = 0
  for (let t = 0; t < tileCount; t++) {
    for (let f = 0; f < totalFrameBits; f++) {
      const byteIdx = Math.floor(f / 8)
      const bitInByte = 7 - (f % 8)
      const bitVal = (frame[byteIdx] >> bitInByte) & 1

      const pixelIdx = bitIdx
      const blueIdx = pixelIdx * 4 + 2

      // Embed bit into LSB of Blue channel
      data[blueIdx] = (data[blueIdx] & ~1) | bitVal
      bitIdx++
    }
  }

  return outputData
}

export function extractImageWatermark(imageData: ImageData): ImageExtractionResult {
  const data = imageData.data
  const totalPixels = imageData.width * imageData.height
  const result: ImageExtractionResult = {
    success: false,
    confidenceScore: 0,
    crcValid: false,
    rawBytesExtracted: 0,
    totalPixelsExamined: totalPixels,
  }

  if (totalPixels < 88) {
    result.error = 'Image dimensions too small for watermarking analysis'
    return result
  }

  // Extract blue channel LSBs
  const rawBits = new Uint8Array(totalPixels)
  for (let i = 0; i < totalPixels; i++) {
    rawBits[i] = data[i * 4 + 2] & 1
  }

  function readByteAt(bitOffset: number): number {
    if (bitOffset + 8 > rawBits.length) return -1
    let b = 0
    for (let k = 0; k < 8; k++) {
      b = (b << 1) | rawBits[bitOffset + k]
    }
    return b
  }

  // Scan across the bitstream looking for the 4-byte sync preamble 'WMKR'
  // 0x57, 0x4D, 0x4B, 0x52
  const limit = rawBits.length - 88 // at least 11 bytes

  for (let offset = 0; offset <= limit; offset += 8) {
    const b0 = readByteAt(offset)
    if (b0 !== PREAMBLE_BYTES[0]) continue

    const b1 = readByteAt(offset + 8)
    if (b1 !== PREAMBLE_BYTES[1]) continue

    const b2 = readByteAt(offset + 16)
    if (b2 !== PREAMBLE_BYTES[2]) continue

    const b3 = readByteAt(offset + 24)
    if (b3 !== PREAMBLE_BYTES[3]) continue

    // Preamble found!
    const version = readByteAt(offset + 32)
    if (version !== FORMAT_VERSION) continue

    const lenHi = readByteAt(offset + 40)
    const lenLo = readByteAt(offset + 48)
    if (lenHi === -1 || lenLo === -1) continue

    const payloadLen = (lenHi << 8) | lenLo
    if (payloadLen <= 0 || payloadLen > 30000) continue

    const totalFrameBits = (11 + payloadLen) * 8
    if (offset + totalFrameBits > rawBits.length) continue

    // Read payload bytes
    const payloadBytes = new Uint8Array(payloadLen)
    let err = false
    for (let p = 0; p < payloadLen; p++) {
      const pb = readByteAt(offset + 56 + p * 8)
      if (pb === -1) {
        err = true
        break
      }
      payloadBytes[p] = pb
    }
    if (err) continue

    // Read CRC32
    const crcOffset = offset + 56 + payloadLen * 8
    const c0 = readByteAt(crcOffset)
    const c1 = readByteAt(crcOffset + 8)
    const c2 = readByteAt(crcOffset + 16)
    const c3 = readByteAt(crcOffset + 24)
    if (c0 === -1 || c1 === -1 || c2 === -1 || c3 === -1) continue

    const storedCrc = ((c0 << 24) | (c1 << 16) | (c2 << 8) | c3) >>> 0
    const computedCrc = computeCRC32(payloadBytes)

    if (storedCrc === computedCrc) {
      try {
        const decoder = new TextDecoder()
        const jsonStr = decoder.decode(payloadBytes)
        const parsed = JSON.parse(jsonStr) as WatermarkPayload

        result.success = true
        result.payload = parsed
        result.crcValid = true
        result.confidenceScore = 100
        result.rawBytesExtracted = payloadLen
        return result
      } catch {
        // Continue search
      }
    }
  }

  result.error = 'No valid digital watermark preamble or checksum found'
  result.confidenceScore = 0
  return result
}

export function generateForensicDifferenceMap(
  originalData: ImageData,
  watermarkedData: ImageData,
  amplification: number = 64
): ImageData {
  const width = originalData.width
  const height = originalData.height
  const diff = new ImageData(width, height)
  const oData = originalData.data
  const wData = watermarkedData.data
  const dData = diff.data

  for (let i = 0; i < oData.length; i += 4) {
    const diffR = Math.abs(oData[i] - wData[i]) * amplification
    const diffG = Math.abs(oData[i + 1] - wData[i + 1]) * amplification
    const diffB = Math.abs(oData[i + 2] - wData[i + 2]) * amplification

    const isDifferent = diffR > 0 || diffG > 0 || diffB > 0

    if (isDifferent) {
      dData[i] = 0
      dData[i + 1] = Math.min(255, 200 + diffB)
      dData[i + 2] = 255
      dData[i + 3] = 255
    } else {
      dData[i] = 10
      dData[i + 1] = 12
      dData[i + 2] = 16
      dData[i + 3] = 255
    }
  }

  return diff
}

export function generateBitplaneVisualizer(imageData: ImageData): ImageData {
  const width = imageData.width
  const height = imageData.height
  const viz = new ImageData(width, height)
  const src = imageData.data
  const dst = viz.data

  for (let i = 0; i < src.length; i += 4) {
    const lsb = (src[i + 2] & 1) * 255
    dst[i] = lsb > 0 ? 0 : 15
    dst[i + 1] = lsb > 0 ? 240 : 18
    dst[i + 2] = lsb > 0 ? 255 : 24
    dst[i + 3] = 255
  }

  return viz
}
