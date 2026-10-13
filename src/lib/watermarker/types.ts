export interface WatermarkPayload {
  ownerId: string
  organization: string
  referenceKey: string
  timestamp: number
  customNote?: string
}

export type WatermarkMode = 'image' | 'text'

export interface ImageEmbeddingConfig {
  bitsPerChannel: 1 | 2
  redundancyFactor: number
  passphrase?: string
}

export interface ImageExtractionResult {
  success: boolean
  payload?: WatermarkPayload
  confidenceScore: number
  crcValid: boolean
  rawBytesExtracted: number
  totalPixelsExamined: number
  error?: string
}

export interface TextEmbeddingConfig {
  strategy: 'word-boundary' | 'line-boundary'
  passphrase?: string
}

export interface TextExtractionResult {
  success: boolean
  payload?: WatermarkPayload
  rawZeroWidthCharsFound: number
  codepointCounts: Record<string, number>
  crcValid: boolean
  confidenceScore: number
  error?: string
}

export interface CodepointBreakdown {
  char: string
  name: string
  codePoint: string
  count: number
}

export interface TextDiagnostics {
  totalChars: number
  visibleChars: number
  zeroWidthChars: number
  breakdown: CodepointBreakdown[]
  hasSteganography: boolean
}
