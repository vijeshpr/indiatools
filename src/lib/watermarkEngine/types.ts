export type PositionAnchor =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'center'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export type WatermarkMode = 'text' | 'logo' | 'dual'

export type BlendMode =
  | 'source-over'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'soft-light'
  | 'hard-light'
  | 'luminosity'
  | 'difference'

export interface TextWatermarkConfig {
  text: string
  fontFamily: string
  fontSizePercent: number // 1% to 20% of min(width, height)
  color: string // Hex color string
  opacity: number // 0.1 to 1.0
  rotation: number // -180 to 180 degrees
  bold: boolean
  italic: boolean
  allCaps: boolean
  hasShadow: boolean
  shadowColor: string
  shadowBlur: number
  tiling: boolean
  tileSpacingX: number // px spacing
  tileSpacingY: number
  anchor: PositionAnchor
  paddingXPercent: number // 0 to 40% of width
  paddingYPercent: number // 0 to 40% of height
}

export interface LogoWatermarkConfig {
  logoUrl: string | null
  logoImage: HTMLImageElement | ImageBitmap | null
  logoWidth: number
  logoHeight: number
  scalePercent: number // 5% to 80% of image width
  opacity: number // 0.1 to 1.0
  rotation: number // -180 to 180 degrees
  blendMode: BlendMode
  tiling: boolean
  tileSpacingX: number
  tileSpacingY: number
  anchor: PositionAnchor
  paddingXPercent: number // 0 to 40% of width
  paddingYPercent: number // 0 to 40% of height
}

export type BatchItemStatus = 'queued' | 'processing' | 'done' | 'error'

export interface BatchItem {
  id: string
  file: File
  name: string
  size: number
  type: string
  width: number
  height: number
  previewUrl: string
  status: BatchItemStatus
  progress: number // 0 to 100
  errorMessage?: string
  processedBlob?: Blob
  processedUrl?: string
}

export type ExportFormat = 'original' | 'image/jpeg' | 'image/png' | 'image/webp'

export interface ExportConfig {
  format: ExportFormat
  quality: number // 0.5 to 1.0
  filenamePrefix: string
  filenameSuffix: string
}

export type BatchWatermarkLocale = 'en' | 'ml' | 'hi' | 'ta' | 'te' | 'kn' | 'bn'

export interface PositionCalculation {
  x: number
  y: number
  contentWidth: number
  contentHeight: number
}
