export type BrushToolMode = 'brush' | 'eraser'

export interface BrushConfig {
  mode: BrushToolMode
  radius: number // 5px to 100px
}

export interface InpaintingProgress {
  percent: number // 0 to 100
  stage: 'analyzing' | 'propagating' | 'finalizing' | 'done'
  message: string
}

export type InpaintingLocale = 'en' | 'ml' | 'hi' | 'ta' | 'te' | 'kn' | 'bn'

export interface HistorySnapshot {
  maskImageData: ImageData
}

export interface InpaintingResult {
  inpaintedImageData: ImageData
  inpaintedDataUrl: string
}
