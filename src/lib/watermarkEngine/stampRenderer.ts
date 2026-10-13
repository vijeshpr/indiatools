import {
  PositionAnchor,
  TextWatermarkConfig,
  LogoWatermarkConfig,
  ExportConfig,
  PositionCalculation,
} from './types'

export const DEFAULT_TEXT_CONFIG: TextWatermarkConfig = {
  text: '© IndiaTools Studio',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSizePercent: 4.5, // 4.5% of min(W, H)
  color: '#ffffff',
  opacity: 0.85,
  rotation: 0,
  bold: true,
  italic: false,
  allCaps: false,
  hasShadow: true,
  shadowColor: 'rgba(0,0,0,0.65)',
  shadowBlur: 6,
  tiling: false,
  tileSpacingX: 180,
  tileSpacingY: 140,
  anchor: 'bottom-right',
  paddingXPercent: 4,
  paddingYPercent: 4,
}

export const DEFAULT_LOGO_CONFIG: LogoWatermarkConfig = {
  logoUrl: null,
  logoImage: null,
  logoWidth: 0,
  logoHeight: 0,
  scalePercent: 18, // 18% of image width
  opacity: 0.85,
  rotation: 0,
  blendMode: 'source-over',
  tiling: false,
  tileSpacingX: 200,
  tileSpacingY: 200,
  anchor: 'bottom-right',
  paddingXPercent: 4,
  paddingYPercent: 4,
}

export const DEFAULT_EXPORT_CONFIG: ExportConfig = {
  format: 'original',
  quality: 0.92,
  filenamePrefix: '',
  filenameSuffix: '_watermarked',
}

/**
 * Calculates (x, y) coordinates for a bounding box within a canvas based on a 9-point anchor.
 */
export function calculateAnchorPosition(
  canvasWidth: number,
  canvasHeight: number,
  contentWidth: number,
  contentHeight: number,
  anchor: PositionAnchor,
  paddingX: number,
  paddingY: number
): PositionCalculation {
  let x = 0
  let y = 0

  switch (anchor) {
    case 'top-left':
      x = paddingX
      y = paddingY
      break
    case 'top-center':
      x = (canvasWidth - contentWidth) / 2
      y = paddingY
      break
    case 'top-right':
      x = canvasWidth - contentWidth - paddingX
      y = paddingY
      break
    case 'middle-left':
      x = paddingX
      y = (canvasHeight - contentHeight) / 2
      break
    case 'center':
      x = (canvasWidth - contentWidth) / 2
      y = (canvasHeight - contentHeight) / 2
      break
    case 'middle-right':
      x = canvasWidth - contentHeight - paddingX
      y = (canvasHeight - contentHeight) / 2
      break
    case 'bottom-left':
      x = paddingX
      y = canvasHeight - contentHeight - paddingY
      break
    case 'bottom-center':
      x = (canvasWidth - contentWidth) / 2
      y = canvasHeight - contentHeight - paddingY
      break
    case 'bottom-right':
      x = canvasWidth - contentWidth - paddingX
      y = canvasHeight - contentHeight - paddingY
      break
  }

  return {
    x,
    y,
    contentWidth,
    contentHeight,
  }
}

/**
 * Measures text bounding box on a 2D canvas context.
 */
export function measureTextDimensions(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontSpec: string
): { width: number; height: number; ascent: number } {
  ctx.save()
  ctx.font = fontSpec
  const metrics = ctx.measureText(text)
  const width = metrics.width
  const ascent = metrics.actualBoundingBoxAscent || 16
  const descent = metrics.actualBoundingBoxDescent || 4
  const height = ascent + descent
  ctx.restore()
  return { width, height, ascent }
}

/**
 * Renders text watermark onto the canvas context.
 */
export function renderTextWatermark(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  config: TextWatermarkConfig
): void {
  if (!config.text.trim()) return

  ctx.save()

  // Responsive font size relative to image resolution
  const minDim = Math.min(canvasWidth, canvasHeight)
  const computedFontSize = Math.max(
    14,
    Math.round((minDim * config.fontSizePercent) / 100)
  )

  const fontStyle = `${config.italic ? 'italic ' : ''}${
    config.bold ? 'bold ' : ''
  }${computedFontSize}px ${config.fontFamily}`

  const displayText = config.allCaps
    ? config.text.toUpperCase()
    : config.text

  ctx.font = fontStyle
  ctx.fillStyle = config.color
  ctx.globalAlpha = Math.min(1, Math.max(0.05, config.opacity))

  if (config.hasShadow) {
    ctx.shadowColor = config.shadowColor
    ctx.shadowBlur = config.shadowBlur
    ctx.shadowOffsetX = Math.max(1, Math.round(computedFontSize * 0.08))
    ctx.shadowOffsetY = Math.max(1, Math.round(computedFontSize * 0.08))
  } else {
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0
  }

  // Tiling Anti-Theft Pattern
  if (config.tiling) {
    const textMetrics = measureTextDimensions(ctx, displayText, fontStyle)
    const stepX = textMetrics.width + Math.max(40, config.tileSpacingX)
    const stepY = textMetrics.height + Math.max(30, config.tileSpacingY)

    const diag = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight)
    const rotationRad = (config.rotation * Math.PI) / 180

    ctx.save()
    ctx.translate(canvasWidth / 2, canvasHeight / 2)
    ctx.rotate(rotationRad)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const startX = -diag
    const endX = diag
    const startY = -diag
    const endY = diag

    let row = 0
    for (let y = startY; y <= endY; y += stepY) {
      // Stagger alternating rows for natural pattern
      const rowOffsetX = (row % 2) * (stepX / 2)
      for (let x = startX + rowOffsetX; x <= endX; x += stepX) {
        ctx.fillText(displayText, x, y)
      }
      row++
    }
    ctx.restore()
  } else {
    // Single Anchored Watermark
    const textMetrics = measureTextDimensions(ctx, displayText, fontStyle)
    const padX = (canvasWidth * config.paddingXPercent) / 100
    const padY = (canvasHeight * config.paddingYPercent) / 100

    const pos = calculateAnchorPosition(
      canvasWidth,
      canvasHeight,
      textMetrics.width,
      textMetrics.height,
      config.anchor,
      padX,
      padY
    )

    const centerX = pos.x + textMetrics.width / 2
    const centerY = pos.y + textMetrics.height / 2
    const rotationRad = (config.rotation * Math.PI) / 180

    ctx.save()
    ctx.translate(centerX, centerY)
    if (rotationRad !== 0) {
      ctx.rotate(rotationRad)
    }

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(displayText, 0, 0)
    ctx.restore()
  }

  ctx.restore()
}

/**
 * Renders logo graphic watermark onto the canvas context.
 */
export function renderLogoWatermark(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  config: LogoWatermarkConfig,
  logoImage: CanvasImageSource | null
): void {
  if (!logoImage) return

  ctx.save()

  // Calculate target dimensions
  const targetWidth = Math.max(20, (canvasWidth * config.scalePercent) / 100)
  const naturalW = config.logoWidth || 100
  const naturalH = config.logoHeight || 100
  const aspectRatio = naturalH / naturalW
  const targetHeight = targetWidth * aspectRatio

  ctx.globalAlpha = Math.min(1, Math.max(0.05, config.opacity))
  ctx.globalCompositeOperation = config.blendMode || 'source-over'

  if (config.tiling) {
    const stepX = targetWidth + Math.max(40, config.tileSpacingX)
    const stepY = targetHeight + Math.max(40, config.tileSpacingY)

    const diag = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight)
    const rotationRad = (config.rotation * Math.PI) / 180

    ctx.save()
    ctx.translate(canvasWidth / 2, canvasHeight / 2)
    ctx.rotate(rotationRad)

    const startX = -diag
    const endX = diag
    const startY = -diag
    const endY = diag

    let row = 0
    for (let y = startY; y <= endY; y += stepY) {
      const rowOffsetX = (row % 2) * (stepX / 2)
      for (let x = startX + rowOffsetX; x <= endX; x += stepX) {
        ctx.drawImage(
          logoImage,
          x - targetWidth / 2,
          y - targetHeight / 2,
          targetWidth,
          targetHeight
        )
      }
      row++
    }
    ctx.restore()
  } else {
    const padX = (canvasWidth * config.paddingXPercent) / 100
    const padY = (canvasHeight * config.paddingYPercent) / 100

    const pos = calculateAnchorPosition(
      canvasWidth,
      canvasHeight,
      targetWidth,
      targetHeight,
      config.anchor,
      padX,
      padY
    )

    const centerX = pos.x + targetWidth / 2
    const centerY = pos.y + targetHeight / 2
    const rotationRad = (config.rotation * Math.PI) / 180

    ctx.save()
    ctx.translate(centerX, centerY)
    if (rotationRad !== 0) {
      ctx.rotate(rotationRad)
    }

    ctx.drawImage(
      logoImage,
      -targetWidth / 2,
      -targetHeight / 2,
      targetWidth,
      targetHeight
    )
    ctx.restore()
  }

  ctx.restore()
}

/**
 * Composite full watermark layers onto a canvas.
 */
export function stampCanvas(
  targetCanvas: HTMLCanvasElement,
  sourceImage: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  mode: 'text' | 'logo' | 'dual',
  textConfig: TextWatermarkConfig,
  logoConfig: LogoWatermarkConfig,
  logoElement: CanvasImageSource | null
): void {
  targetCanvas.width = sourceWidth
  targetCanvas.height = sourceHeight

  const ctx = targetCanvas.getContext('2d')
  if (!ctx) throw new Error('Could not get 2D canvas context')

  // Draw original base image
  ctx.drawImage(sourceImage, 0, 0, sourceWidth, sourceHeight)

  // Apply watermark layers
  if (mode === 'text' || mode === 'dual') {
    renderTextWatermark(ctx, sourceWidth, sourceHeight, textConfig)
  }

  if ((mode === 'logo' || mode === 'dual') && logoElement) {
    renderLogoWatermark(ctx, sourceWidth, sourceHeight, logoConfig, logoElement)
  }
}

/**
 * Converts canvas to Blob with specified format and quality.
 */
export function exportCanvasToBlob(
  canvas: HTMLCanvasElement,
  format: 'original' | 'image/jpeg' | 'image/png' | 'image/webp',
  originalMimeType: string,
  quality: number
): Promise<Blob> {
  let targetMime = format === 'original' ? originalMimeType : format
  if (!targetMime || targetMime === 'original') {
    targetMime = 'image/jpeg'
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Canvas export to blob failed'))
      },
      targetMime,
      quality
    )
  })
}
