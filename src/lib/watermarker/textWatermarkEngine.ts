import {
  WatermarkPayload,
  TextEmbeddingConfig,
  TextExtractionResult,
  TextDiagnostics,
  CodepointBreakdown,
} from './types'
import { computeCRC16 } from './crc'

// Zero-width alphabet mapping (2 bits per code point)
const SYMBOL_TO_CHAR = ['\u200B', '\u200C', '\u200D', '\uFEFF'] as const
const CHAR_TO_SYMBOL: Record<string, number> = {
  '\u200B': 0, // Zero Width Space
  '\u200C': 1, // Zero Width Non-Joiner
  '\u200D': 2, // Zero Width Joiner
  '\uFEFF': 3, // Zero Width No-Break Space (BOM)
}

const MAGIC_HEADER = 'IDW1' // 4 bytes

function byteToSymbols(b: number): string {
  return (
    SYMBOL_TO_CHAR[(b >> 6) & 0x03] +
    SYMBOL_TO_CHAR[(b >> 4) & 0x03] +
    SYMBOL_TO_CHAR[(b >> 2) & 0x03] +
    SYMBOL_TO_CHAR[b & 0x03]
  )
}

function symbolsToByte(s0: number, s1: number, s2: number, s3: number): number {
  return (s0 << 6) | (s1 << 4) | (s2 << 2) | s3
}

export function encodePayloadToZeroWidth(payload: WatermarkPayload): string {
  const jsonStr = JSON.stringify(payload)
  const encoder = new TextEncoder()
  const payloadBytes = encoder.encode(jsonStr)

  if (payloadBytes.length > 65535) {
    throw new Error('Watermark payload exceeds maximum allowed size (64KB)')
  }

  const magicBytes = encoder.encode(MAGIC_HEADER)
  const lenBytes = new Uint8Array([
    (payloadBytes.length >> 8) & 0xff,
    payloadBytes.length & 0xff,
  ])
  const crc = computeCRC16(payloadBytes)
  const crcBytes = new Uint8Array([(crc >> 8) & 0xff, crc & 0xff])

  // Total frame: magic (4) + length (2) + payload (N) + crc (2)
  const totalFrame = new Uint8Array(4 + 2 + payloadBytes.length + 2)
  totalFrame.set(magicBytes, 0)
  totalFrame.set(lenBytes, 4)
  totalFrame.set(payloadBytes, 6)
  totalFrame.set(crcBytes, 6 + payloadBytes.length)

  let zeroWidthSeq = ''
  for (let i = 0; i < totalFrame.length; i++) {
    zeroWidthSeq += byteToSymbols(totalFrame[i])
  }

  return zeroWidthSeq
}

export function embedTextWatermark(
  coverText: string,
  payload: WatermarkPayload,
  config: TextEmbeddingConfig = { strategy: 'word-boundary' }
): string {
  if (!coverText || coverText.trim().length === 0) {
    throw new Error('Cover text cannot be empty')
  }

  // Strip any existing zero-width watermark first
  const cleanCover = stripTextWatermark(coverText)
  const watermarkSequence = encodePayloadToZeroWidth(payload)

  if (config.strategy === 'line-boundary') {
    const firstNewline = cleanCover.indexOf('\n')
    if (firstNewline !== -1) {
      return (
        cleanCover.slice(0, firstNewline) +
        watermarkSequence +
        cleanCover.slice(firstNewline)
      )
    }
  }

  // Word-boundary strategy: safe for Indic and RTL scripts
  const spaceMatch = cleanCover.search(/\s/)
  if (spaceMatch !== -1) {
    return (
      cleanCover.slice(0, spaceMatch + 1) +
      watermarkSequence +
      cleanCover.slice(spaceMatch + 1)
    )
  }

  // Fallback: append to end
  return cleanCover + watermarkSequence
}

export function extractTextWatermark(text: string): TextExtractionResult {
  const result: TextExtractionResult = {
    success: false,
    rawZeroWidthCharsFound: 0,
    codepointCounts: {
      'U+200B': 0,
      'U+200C': 0,
      'U+200D': 0,
      'U+FEFF': 0,
    },
    crcValid: false,
    confidenceScore: 0,
  }

  if (!text) {
    result.error = 'No text provided for analysis'
    return result
  }

  // Count zero-width characters in document
  for (const char of text) {
    if (char === '\u200B') result.codepointCounts['U+200B']++
    else if (char === '\u200C') result.codepointCounts['U+200C']++
    else if (char === '\u200D') result.codepointCounts['U+200D']++
    else if (char === '\uFEFF') result.codepointCounts['U+FEFF']++
  }

  result.rawZeroWidthCharsFound =
    result.codepointCounts['U+200B'] +
    result.codepointCounts['U+200C'] +
    result.codepointCounts['U+200D'] +
    result.codepointCounts['U+FEFF']

  if (result.rawZeroWidthCharsFound < 32) {
    result.error = 'Insufficient zero-width characters for a valid watermark'
    return result
  }

  // Collect all zero-width characters from the text
  const zeroChars: string[] = []
  for (const char of text) {
    if (char in CHAR_TO_SYMBOL) {
      zeroChars.push(char)
    }
  }

  // Compute magic header symbols for 'IDW1'
  const encoder = new TextEncoder()
  const magicBytes = encoder.encode(MAGIC_HEADER)
  const magicSymbols: number[] = []
  for (const b of magicBytes) {
    magicSymbols.push(
      (b >> 6) & 0x03,
      (b >> 4) & 0x03,
      (b >> 2) & 0x03,
      b & 0x03
    )
  }

  // Search for the magic sequence (16 symbols)
  const symbols = zeroChars.map((c) => CHAR_TO_SYMBOL[c])
  let magicIdx = -1

  for (let i = 0; i <= symbols.length - 16; i++) {
    let match = true
    for (let m = 0; m < 16; m++) {
      if (symbols[i + m] !== magicSymbols[m]) {
        match = false
        break
      }
    }
    if (match) {
      magicIdx = i
      break
    }
  }

  if (magicIdx === -1) {
    result.error = 'Unrecognized watermark signature or corrupted framing'
    result.confidenceScore = 20
    return result
  }

  // Symbols from magicIdx onwards
  const payloadSymbols = symbols.slice(magicIdx)
  const totalBytes = Math.floor(payloadSymbols.length / 4)

  if (totalBytes < 8) {
    result.error = 'Truncated payload: header is incomplete'
    result.confidenceScore = 30
    return result
  }

  const frameBytes = new Uint8Array(totalBytes)
  for (let i = 0; i < totalBytes; i++) {
    frameBytes[i] = symbolsToByte(
      payloadSymbols[i * 4],
      payloadSymbols[i * 4 + 1],
      payloadSymbols[i * 4 + 2],
      payloadSymbols[i * 4 + 3]
    )
  }

  const payloadLen = (frameBytes[4] << 8) | frameBytes[5]
  const requiredTotalBytes = 6 + payloadLen + 2

  if (frameBytes.length < requiredTotalBytes) {
    result.error = `Watermark truncated: expected ${requiredTotalBytes} bytes, found ${frameBytes.length}`
    result.confidenceScore = 40
    return result
  }

  const payloadSlice = frameBytes.slice(6, 6 + payloadLen)
  const storedCrc =
    (frameBytes[6 + payloadLen] << 8) | frameBytes[6 + payloadLen + 1]
  const computedCrc = computeCRC16(payloadSlice)

  if (storedCrc !== computedCrc) {
    result.error = 'CRC16 checksum failed: payload data was modified or damaged'
    result.crcValid = false
    result.confidenceScore = 50
    return result
  }

  result.crcValid = true

  try {
    const decoder = new TextDecoder()
    const jsonStr = decoder.decode(payloadSlice)
    const parsedPayload = JSON.parse(jsonStr) as WatermarkPayload
    result.payload = parsedPayload
    result.success = true
    result.confidenceScore = 100
  } catch {
    result.error = 'Failed to deserialize watermark payload JSON'
    result.confidenceScore = 60
  }

  return result
}

export function stripTextWatermark(text: string): string {
  if (!text) return ''
  return text.replace(/[\u200B\u200C\u200D\uFEFF\u2060\u180E]/g, '')
}

export function inspectTextDiagnostics(text: string): TextDiagnostics {
  const breakdown: CodepointBreakdown[] = [
    {
      char: '\u200B',
      name: 'Zero Width Space (ZWSP)',
      codePoint: 'U+200B',
      count: 0,
    },
    {
      char: '\u200C',
      name: 'Zero Width Non-Joiner (ZWNJ)',
      codePoint: 'U+200C',
      count: 0,
    },
    {
      char: '\u200D',
      name: 'Zero Width Joiner (ZWJ)',
      codePoint: 'U+200D',
      count: 0,
    },
    {
      char: '\uFEFF',
      name: 'Zero Width No-Break Space (ZWNBSP/BOM)',
      codePoint: 'U+FEFF',
      count: 0,
    },
    {
      char: '\u2060',
      name: 'Word Joiner (WJ)',
      codePoint: 'U+2060',
      count: 0,
    },
  ]

  let zeroWidthTotal = 0
  for (const char of text) {
    const match = breakdown.find((b) => b.char === char)
    if (match) {
      match.count++
      zeroWidthTotal++
    }
  }

  const totalChars = Array.from(text).length
  const visibleChars = totalChars - zeroWidthTotal

  return {
    totalChars,
    visibleChars,
    zeroWidthChars: zeroWidthTotal,
    breakdown,
    hasSteganography: zeroWidthTotal >= 8,
  }
}
