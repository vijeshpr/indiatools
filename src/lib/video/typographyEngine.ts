/**
 * IndiaTools — Audio Spectrum Video Studio 2.0
 * Indic & Latin Typography Engine: Intl.Segmenter Grapheme Clustering,
 * Multi-Language Font Loading, and 10 Canvas Text Animation Styles.
 */

import { SupportedLanguage, TypographyLayer } from './audioVisualizerTypes.ts'

// Google Web Fonts definition for our 5 languages
const GOOGLE_FONTS_STYLESHEET =
  'https://fonts.googleapis.com/css2?' +
  'family=Cinzel:wght@600;700;900&' +
  'family=Inter:wght@400;600;700;800&' +
  'family=Manjari:wght@400;700&' +
  'family=Chilanka&' +
  'family=Montserrat:wght@500;700;800&' +
  'family=Noto+Sans+Kannada:wght@400;600;700&' +
  'family=Noto+Sans+Malayalam:wght@400;600;700;800&' +
  'family=Noto+Sans+Tamil:wght@400;600;700&' +
  'family=Noto+Sans+Telugu:wght@400;600;700&' +
  'family=Noto+Serif+Kannada:wght@400;700&' +
  'family=Noto+Serif+Malayalam:wght@400;700&' +
  'family=Noto+Serif+Tamil:wght@400;700&' +
  'family=Noto+Serif+Telugu:wght@400;700&' +
  'family=Space+Grotesk:wght@500;700&display=swap'

let fontsLoaded = false
let fontLoadingPromise: Promise<boolean> | null = null

/**
 * Ensures Google fonts for all 5 languages are loaded and ready in the browser.
 */
export async function ensureFontsLoaded(): Promise<boolean> {
  if (fontsLoaded) return true
  if (typeof window === 'undefined') return false

  if (!fontLoadingPromise) {
    fontLoadingPromise = (async () => {
      try {
        // Inject font stylesheet if not already present
        if (!document.getElementById('indiatools-typography-fonts')) {
          const link = document.createElement('link')
          link.id = 'indiatools-typography-fonts'
          link.rel = 'stylesheet'
          link.href = GOOGLE_FONTS_STYLESHEET
          document.head.appendChild(link)
        }

        if (document.fonts && typeof document.fonts.ready !== 'undefined') {
          await document.fonts.ready
        }
        fontsLoaded = true
        return true
      } catch (err) {
        console.warn('Font loading fallback triggered:', err)
        fontsLoaded = true // proceed with system fallbacks
        return false
      }
    })()
  }

  return fontLoadingPromise
}

/**
 * Split an Indic or Latin string into true Unicode grapheme clusters.
 * NEVER use str.split('') for Indic scripts as it breaks vowel signs,
 * conjuncts (കൂട്ടക്ഷരങ്ങൾ), and chillus (ൽ, ൻ, ർ, ൾ, ക്).
 */
export function getGraphemeClusters(text: string, lang: SupportedLanguage = 'en'): string[] {
  if (!text) return []

  // Check if Intl.Segmenter is supported
  if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
    try {
      const segmenter = new (Intl as any).Segmenter(lang, { granularity: 'grapheme' })
      return Array.from(segmenter.segment(text)).map((s: any) => s.segment)
    } catch {
      // Fallback below
    }
  }

  // Fallback regex preserving common Indic combining marks and viramas
  return text.match(/[\u0D00-\u0D7F][\u0D3E-\u0D4D\u0D57]*|[\u0C00-\u0C7F][\u0C3E-\u0C4D\u0C55\u0C56]*|[\u0C80-\u0CFF][\u0CBE-\u0CCD\u0CD5\u0CD6]*|[\u0B80-\u0BFF][\u0BBE-\u0BCD\u0BD7]*|./gu) || text.split('')
}

/**
 * Split an Indic or Latin text into true word segments for word-by-word lyric sync.
 */
export function getWordSegments(text: string, lang: SupportedLanguage = 'en'): string[] {
  if (!text) return []

  if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
    try {
      const segmenter = new (Intl as any).Segmenter(lang, { granularity: 'word' })
      return Array.from(segmenter.segment(text))
        .filter((s: any) => s.isWordLike)
        .map((s: any) => s.segment)
    } catch {
      // Fallback
    }
  }

  return text.trim().split(/\s+/)
}

/**
 * Render a single typography layer onto the Canvas with full Indic shaping,
 * vertical ascender/descender padding, and 10 dynamic motion presets.
 */
export function drawTypographyLayer(
  ctx: CanvasRenderingContext2D,
  layer: TypographyLayer,
  canvasWidth: number,
  canvasHeight: number,
  currentTime: number,
  midVocalEnergy = 0,
  isBeatHit = false
) {
  if (!layer.visible || !layer.text.trim()) return

  // Time boundaries
  if (currentTime < layer.startTime || currentTime > layer.endTime) return

  const elapsed = currentTime - layer.startTime
  const progress = Math.min(1, Math.max(0, elapsed / Math.max(0.1, layer.animationDuration)))

  ctx.save()

  // Base canvas scaling factor (relative to 1080p reference width)
  const scale = canvasWidth / 1080
  const fontSize = layer.fontSize * scale

  // Position mapping
  const posX = (layer.xPercent / 100) * canvasWidth
  const posY = (layer.yPercent / 100) * canvasHeight

  ctx.translate(posX, posY)

  // Rotation
  if (layer.rotation !== 0) {
    ctx.rotate((layer.rotation * Math.PI) / 180)
  }

  // Audio-reactive scale pulse (e.g. vocal/mid punch)
  let reactiveScale = 1
  if (layer.audioReactiveScale) {
    reactiveScale += midVocalEnergy * 0.12
    if (isBeatHit) reactiveScale += 0.05
  }
  ctx.scale(reactiveScale, reactiveScale)

  // Configure typography font string
  ctx.font = `${layer.fontWeight} ${fontSize}px ${layer.fontFamily}`
  ctx.textAlign = layer.align
  ctx.textBaseline = 'middle'

  // Apply layer opacity
  let alpha = layer.opacity

  // Process text based on animation style
  const style = layer.animationStyle

  if (style === 'cinematic-reveal') {
    // Smooth fade in + gentle tracking expansion
    alpha *= Math.min(1, progress * 1.5)
    const letterSpacing = layer.letterSpacing * (1 + (1 - progress) * 2.5) * scale
    drawStyledTextWithTracking(ctx, layer.text, 0, 0, letterSpacing, layer, alpha)
  } else if (style === 'grapheme-reveal') {
    // Indic-safe character-by-character reveal (Intl.Segmenter)
    const clusters = getGraphemeClusters(layer.text, layer.language)
    const visibleCount = Math.floor(clusters.length * progress)
    const revealedText = clusters.slice(0, visibleCount).join('')
    drawStyledText(ctx, revealedText, 0, 0, layer, alpha)
  } else if (style === 'word-by-word') {
    // Word-by-word lyric reveal (Intl.Segmenter word mode)
    const words = getWordSegments(layer.text, layer.language)
    const activeWordIndex = Math.min(words.length - 1, Math.floor(words.length * progress))
    drawWordByWordHighlighted(ctx, words, activeWordIndex, layer, alpha, scale)
  } else if (style === 'masked-slide') {
    // Slide up from bottom with alpha ramp
    alpha *= progress
    const slideOffset = (1 - Math.sin((progress * Math.PI) / 2)) * (fontSize * 0.8)
    drawStyledText(ctx, layer.text, 0, slideOffset, layer, alpha)
  } else if (style === 'glitch-title') {
    // Chromatic split on beat transient
    if (isBeatHit || (progress < 0.3 && Math.random() > 0.6)) {
      ctx.save()
      ctx.fillStyle = 'rgba(236, 72, 153, 0.8)' // Pink
      ctx.fillText(layer.text, -4 * scale, 0)
      ctx.fillStyle = 'rgba(6, 182, 212, 0.8)' // Cyan
      ctx.fillText(layer.text, 4 * scale, 0)
      ctx.restore()
    }
    drawStyledText(ctx, layer.text, 0, 0, layer, alpha)
  } else if (style === 'blur-to-sharp') {
    alpha *= progress
    if (progress < 1) {
      ctx.filter = `blur(${Math.max(0, (1 - progress) * 16 * scale)}px)`
    }
    drawStyledText(ctx, layer.text, 0, 0, layer, alpha)
    ctx.filter = 'none'
  } else if (style === 'neon-glow' || style === 'gold-luxury' || style === 'beat-pulse' || style === 'lower-third') {
    if (style === 'beat-pulse') {
      const pulseScale = 1 + midVocalEnergy * 0.15
      ctx.scale(pulseScale, pulseScale)
    }

    if (style === 'lower-third') {
      // Draw subtitle backdrop banner
      drawLowerThirdBackdrop(ctx, layer, canvasWidth, fontSize)
    }

    drawStyledText(ctx, layer.text, 0, 0, layer, alpha)
  } else {
    // Default fallback
    drawStyledText(ctx, layer.text, 0, 0, layer, alpha)
  }

  ctx.restore()
}

/**
 * Draw text with outline, shadow, and neon glow effects
 */
function drawStyledText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  layer: TypographyLayer,
  alpha: number
) {
  if (!text) return

  ctx.globalAlpha = Math.max(0, Math.min(1, alpha))

  // 1. Neon Glow
  if (layer.hasGlow) {
    ctx.save()
    ctx.shadowColor = layer.glowColor || layer.color
    ctx.shadowBlur = layer.glowIntensity * 24
    ctx.fillStyle = layer.color
    ctx.fillText(text, x, y)
    ctx.restore()
  }

  // 2. Drop Shadow
  if (layer.hasShadow) {
    ctx.save()
    ctx.shadowColor = layer.shadowColor
    ctx.shadowBlur = layer.shadowBlur
    ctx.shadowOffsetX = 3
    ctx.shadowOffsetY = 4
    ctx.fillStyle = layer.color
    ctx.fillText(text, x, y)
    ctx.restore()
  }

  // 3. Outline / Stroke
  if (layer.hasOutline && layer.outlineWidth > 0) {
    ctx.save()
    ctx.strokeStyle = layer.outlineColor
    ctx.lineWidth = layer.outlineWidth * 2
    ctx.lineJoin = 'round'
    ctx.miterLimit = 2
    ctx.strokeText(text, x, y)
    ctx.restore()
  }

  // 4. Fill text
  ctx.fillStyle = layer.color
  ctx.fillText(text, x, y)
}

/**
 * Draw text with custom inter-letter tracking (spacing)
 */
function drawStyledTextWithTracking(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number,
  layer: TypographyLayer,
  alpha: number
) {
  if (tracking <= 0.5) {
    drawStyledText(ctx, text, x, y, layer, alpha)
    return
  }

  const clusters = getGraphemeClusters(text, layer.language)
  let totalWidth = 0
  const widths: number[] = []

  for (const c of clusters) {
    const w = ctx.measureText(c).width
    widths.push(w)
    totalWidth += w + tracking
  }
  totalWidth -= tracking

  let startX = x
  if (layer.align === 'center') {
    startX = x - totalWidth / 2
  } else if (layer.align === 'right') {
    startX = x - totalWidth
  }

  const prevAlign = ctx.textAlign
  ctx.textAlign = 'left'

  let currentX = startX
  for (let i = 0; i < clusters.length; i++) {
    drawStyledText(ctx, clusters[i], currentX, y, layer, alpha)
    currentX += widths[i] + tracking
  }

  ctx.textAlign = prevAlign
}

/**
 * Word-by-word lyric presentation with active word highlighted
 */
function drawWordByWordHighlighted(
  ctx: CanvasRenderingContext2D,
  words: string[],
  activeWordIndex: number,
  layer: TypographyLayer,
  alpha: number,
  scale: number
) {
  const spaceWidth = ctx.measureText(' ').width
  const wordWidths = words.map(w => ctx.measureText(w).width)
  const totalWidth = wordWidths.reduce((a, b) => a + b, 0) + (words.length - 1) * spaceWidth

  let startX = 0
  if (layer.align === 'center') {
    startX = -totalWidth / 2
  } else if (layer.align === 'right') {
    startX = -totalWidth
  }

  const prevAlign = ctx.textAlign
  ctx.textAlign = 'left'

  let currentX = startX
  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const isActive = i === activeWordIndex
    const isPast = i < activeWordIndex

    ctx.save()
    if (isActive) {
      ctx.fillStyle = layer.accentColor || '#38bdf8'
      ctx.shadowColor = layer.accentColor || '#38bdf8'
      ctx.shadowBlur = 16 * scale
      ctx.globalAlpha = Math.min(1, alpha * 1.2)
    } else if (isPast) {
      ctx.fillStyle = layer.color
      ctx.globalAlpha = alpha
    } else {
      ctx.fillStyle = layer.color
      ctx.globalAlpha = alpha * 0.35 // Upcoming words dimmed
    }

    ctx.fillText(word, currentX, 0)
    ctx.restore()

    currentX += wordWidths[i] + spaceWidth
  }

  ctx.textAlign = prevAlign
}

/**
 * Lower-third broadcast subtitle semi-transparent backdrop
 */
function drawLowerThirdBackdrop(
  ctx: CanvasRenderingContext2D,
  layer: TypographyLayer,
  canvasWidth: number,
  fontSize: number
) {
  ctx.save()
  const bannerHeight = fontSize * 1.8
  const bannerWidth = canvasWidth * 0.88

  ctx.fillStyle = 'rgba(9, 10, 15, 0.72)'
  ctx.beginPath()
  ctx.roundRect(-bannerWidth / 2, -bannerHeight / 2, bannerWidth, bannerHeight, 8)
  ctx.fill()

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.restore()
}
