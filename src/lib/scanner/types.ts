export interface Point {
  x: number
  y: number
}

export type CornerKey = 'tl' | 'tr' | 'br' | 'bl'

export interface DocumentCorners {
  tl: Point // Top-Left
  tr: Point // Top-Right
  br: Point // Bottom-Right
  bl: Point // Bottom-Left
}

export type ScanFilter = 'color' | 'magic-bw' | 'grayscale' | 'original'

export type ExportFormat = 'pdf' | 'png' | 'jpeg'

export type ScannerLocale = 'en' | 'ml' | 'hi' | 'ta' | 'te' | 'kn' | 'bn'

export interface WarpDimensions {
  width: number
  height: number
}

export interface ScannerState {
  imageFile: File | null
  imageSrc: string | null
  imageDimensions: { width: number; height: number } | null
  corners: DocumentCorners | null
  isDetecting: boolean
  isWarping: boolean
  warpedCanvas: HTMLCanvasElement | null
  warpedImageData: ImageData | null
  activeFilter: ScanFilter
  exportFormat: ExportFormat
  isCameraOpen: boolean
}
