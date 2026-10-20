/**
 * IndiaTools — Audio Spectrum Video Studio 2.0
 * Master Audio Visualizer Orchestration Engine
 * Bridges DSP analysis, 20 Visualizer Engines, 2.5D Photo Compositing,
 * Indic Typography, Atmospheric Particles & Post-Processing FX.
 */

import {
  CompositionState,
  DetailedAudioBands,
  ThemeColors,
  THEME_PALETTES,
  VisualizerConfig,
  VisualizerPreset,
  TrackMetadata,
} from './audioVisualizerTypes.ts'
import {
  AudioDspAnalyzer,
  calculateAudioBands,
  PeakHoldManager,
} from './audioDspEngine.ts'
import {
  AtmosphericParticleManager,
  applyCameraMotion,
  applyPostProcessingEffects,
  VisualizerParticleSystem,
  VisualizerParticle,
} from './cinematicEffectsEngine.ts'
import {
  renderVisualizerEngine,
  drawCircularHarmonicSpectrum,
  drawNeonSegmentedEqualizer,
  drawMinimalistOscilloscope,
  drawFuturisticHudTelemetry,
} from './visualizerEngines.ts'
import { drawTypographyLayer } from './typographyEngine.ts'
import { CinematicLightingEngine } from './cinematicLightingEngine.ts'
import { AudioReactiveSmokeEngine } from './audioReactiveSmokeEngine.ts'
import { ParticleUniverseEngine } from './particleUniverseEngine.ts'
import { ShockwaveEngine } from './shockwaveEngine.ts'

// Re-export core DSP & effects for backward compatibility and test suites
export {
  calculateAudioBands,
  PeakHoldManager,
  VisualizerParticleSystem,
  AtmosphericParticleManager,
  AudioDspAnalyzer,
  CinematicLightingEngine,
  AudioReactiveSmokeEngine,
  ParticleUniverseEngine,
  ShockwaveEngine,
}
export type { VisualizerParticle }

// Shared singletons for audio-reactive cinematic effects
export const studioLightingEngine = new CinematicLightingEngine()
export const studioSmokeEngine = new AudioReactiveSmokeEngine()
export const studioUniverseEngine = new ParticleUniverseEngine()
export const studioShockwaveEngine = new ShockwaveEngine()

// Backward-compatible individual preset drawer aliases
export const drawCircularPulse = (ctx: CanvasRenderingContext2D, width: number, height: number, freqData: Uint8Array, config: VisualizerConfig, palette: ThemeColors, bands: any, time: number, albumImage: HTMLImageElement | null) => {
  const peakManager = new PeakHoldManager()
  renderVisualizerEngine('circular-harmonic-spectrum', {
    ctx, width, height, freqData, timeData: freqData, bands: { ...bands, subBass: bands.bass, lowMids: bands.mid, mids: bands.mid, highMids: bands.treble, isBeatHit: false, energyDelta: 0 },
    palette, currentTime: time, peakManager, barCount: config.barCount, sensitivity: config.sensitivity, bassReactivity: config.bassReactivity,
    glowStrength: config.glowStrength, spinSpeed: config.spinSpeed, centerX: width / 2, centerY: height / 2, primaryRadius: Math.min(width, height) * 0.22,
  })
}

export const drawLinearBars = (ctx: CanvasRenderingContext2D, width: number, height: number, freqData: Uint8Array, config: VisualizerConfig, palette: ThemeColors, peakManager: PeakHoldManager, bands: any) => {
  renderVisualizerEngine('neon-segmented-equalizer', {
    ctx, width, height, freqData, timeData: freqData, bands: { ...bands, subBass: bands.bass, lowMids: bands.mid, mids: bands.mid, highMids: bands.treble, isBeatHit: false, energyDelta: 0 },
    palette, currentTime: 0, peakManager, barCount: config.barCount, sensitivity: config.sensitivity, bassReactivity: config.bassReactivity,
    glowStrength: config.glowStrength, spinSpeed: config.spinSpeed, centerX: width / 2, centerY: height / 2, primaryRadius: Math.min(width, height) * 0.22,
  })
}

export const drawSmoothWaveform = (ctx: CanvasRenderingContext2D, width: number, height: number, timeData: Uint8Array, config: VisualizerConfig, palette: ThemeColors, bands: any) => {
  const peakManager = new PeakHoldManager()
  renderVisualizerEngine('minimalist-oscilloscope', {
    ctx, width, height, freqData: timeData, timeData, bands: { ...bands, subBass: bands.bass, lowMids: bands.mid, mids: bands.mid, highMids: bands.treble, isBeatHit: false, energyDelta: 0 },
    palette, currentTime: 0, peakManager, barCount: config.barCount, sensitivity: config.sensitivity, bassReactivity: config.bassReactivity,
    glowStrength: config.glowStrength, spinSpeed: config.spinSpeed, centerX: width / 2, centerY: height / 2, primaryRadius: Math.min(width, height) * 0.22,
  })
}

export const drawCyberpunkOscilloscope = (ctx: CanvasRenderingContext2D, width: number, height: number, freqData: Uint8Array, timeData: Uint8Array, config: VisualizerConfig, palette: ThemeColors, bands: any, time: number) => {
  const peakManager = new PeakHoldManager()
  renderVisualizerEngine('futuristic-hud-telemetry', {
    ctx, width, height, freqData, timeData, bands: { ...bands, subBass: bands.bass, lowMids: bands.mid, mids: bands.mid, highMids: bands.treble, isBeatHit: false, energyDelta: 0 },
    palette, currentTime: time, peakManager, barCount: config.barCount, sensitivity: config.sensitivity, bassReactivity: config.bassReactivity,
    glowStrength: config.glowStrength, spinSpeed: config.spinSpeed, centerX: width / 2, centerY: height / 2, primaryRadius: Math.min(width, height) * 0.22,
  })
}

export const drawMetadataOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number, metadata: TrackMetadata, palette: ThemeColors, bands: any, aspectRatio: any) => {
  if (!metadata.showMetadata) return
  ctx.save()
  const isVertical = aspectRatio === '9:16'
  const startY = isVertical ? height * 0.82 : height * 0.88
  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 32px sans-serif'
  ctx.fillText(metadata.title || 'Untitled Track', width / 2, startY)
  ctx.font = '20px sans-serif'
  ctx.fillStyle = palette.primary
  ctx.fillText(metadata.artist || 'IndiaTools Studio', width / 2, startY + 32)
  ctx.restore()
}

/**
 * Master Studio Composition Frame Renderer
 */
export function renderStudioComposition(
  ctx: CanvasRenderingContext2D,
  state: CompositionState,
  freqData: Uint8Array,
  timeData: Uint8Array,
  bands: DetailedAudioBands,
  peakManager: PeakHoldManager,
  particleManager: AtmosphericParticleManager,
  photoImages: HTMLImageElement[],
  width: number,
  height: number
) {
  const palette = THEME_PALETTES[state.theme] || THEME_PALETTES['neon-cyber']
  const currentTime = state.currentTime

  ctx.save()

  // 1. Clear Canvas with deep charcoal obsidian base
  ctx.fillStyle = '#090A0F'
  ctx.fillRect(0, 0, width, height)

  // 2. Camera Motion (2.5D Parallax Ken Burns Drift & Beat Shake)
  ctx.save()
  applyCameraMotion(ctx, width, height, currentTime, bands, state.fx)

  const centerX = width / 2
  const centerY = state.aspectRatio === '9:16' ? height * 0.45 : height / 2
  const primaryRadius = Math.min(width, height) * (state.aspectRatio === '9:16' ? 0.22 : 0.26)

  // 3. Layer 1: Render Background Layer
  drawBackgroundLayer(ctx, state, photoImages, width, height, palette, bands, currentTime)

  // 4. Layer 2: Audio-Reactive Volumetric Smoke & Mist (Behind photo)
  if (state.smoke && state.smoke.enabled) {
    studioSmokeEngine.updateAndDraw(ctx, width, height, bands, currentTime, state.smoke)
  }

  // 5. Layer 3: Render Photo / Album Artwork Composition Layer
  drawPhotoCompositionLayer(ctx, state, photoImages, width, height, palette, bands, currentTime)

  // 6. Layer 4: Concert Stage Lights & Beat Light Show
  if (state.lighting && state.lighting.enabled) {
    studioLightingEngine.updateAndDraw(ctx, width, height, bands, palette, currentTime, state.lighting, centerX, centerY)
  }

  // 7. Layer 5: Render One of the 20 Visualizer Engines
  const currentPhotoForVisualizer = photoImages[state.activePhotoIndex] || photoImages[0] || null
  renderVisualizerEngine(state.activePreset, {
    ctx,
    width,
    height,
    freqData,
    timeData,
    bands,
    palette,
    currentTime,
    peakManager,
    barCount: state.barCount,
    sensitivity: state.sensitivity,
    bassReactivity: state.bassSensitivity,
    glowStrength: 1.2,
    spinSpeed: 0.35,
    centerX,
    centerY,
    primaryRadius,
    enableVinylRotation: state.enableVinylRotation,
    currentPhoto: currentPhotoForVisualizer,
    dottedMatrixConfig: state.dottedMatrix,
  })

  // 8. Layer 6: Bass Shockwaves & Concentric Energy Rings
  if (state.shockwaves && state.shockwaves.enabled) {
    studioShockwaveEngine.updateAndDraw(
      ctx,
      width,
      height,
      bands,
      palette,
      currentTime,
      state.shockwaves,
      centerX,
      centerY,
      primaryRadius
    )
  }

  // 9. Layer 7: Particle Universe / Atmospheric Foreground Particles
  if (state.particleUniverse && state.particleUniverse.enabled) {
    studioUniverseEngine.updateAndDraw(
      ctx,
      width,
      height,
      bands,
      palette,
      currentTime,
      state.particleUniverse,
      centerX,
      centerY
    )
  } else {
    particleManager.updateAndDraw(ctx, width, height, bands, palette)
  }

  // Restore Camera Motion transform before rendering static UI overlays
  ctx.restore()

  // 7. Render 5-Language Typography Layers
  for (const layer of state.textLayers) {
    drawTypographyLayer(ctx, layer, width, height, currentTime, bands.mids, bands.isBeatHit)
  }

  // 8. Render Optional "Made with IndiaTools" Branding / Watermark Outro
  if (state.branding && state.branding.enabled) {
    drawBrandingBadge(ctx, state.branding, width, height, palette)
  }

  // 9. Post-Processing Shader-Like FX (Chromatic Aberration, Grain, Scanlines, Vignette, Color Grading)
  applyPostProcessingEffects(ctx, width, height, currentTime, bands, state.fx)

  ctx.restore()
}

/**
 * Draw Background Layer (Blurred Album Backdrop, Cyber Grid, Deep Space, Gradient Pulse, Vignette Solid)
 */
export function drawBackgroundLayer(
  ctx: CanvasRenderingContext2D,
  state: CompositionState,
  photoImages: HTMLImageElement[],
  width: number,
  height: number,
  palette: ThemeColors,
  bands: DetailedAudioBands,
  currentTime: number
) {
  const currentPhoto = photoImages[state.activePhotoIndex] || photoImages[0]

  if (state.backgroundMode === 'blurred-cover' && currentPhoto && currentPhoto.complete) {
    ctx.save()
    ctx.filter = 'blur(45px) brightness(0.42)'
    // Scale image to fill background
    const scale = Math.max(width / currentPhoto.width, height / currentPhoto.height) * 1.15
    const drawW = currentPhoto.width * scale
    const drawH = currentPhoto.height * scale
    ctx.drawImage(currentPhoto, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH)
    ctx.restore()

    // Subtle dark vignette gradient over blurred cover
    const grad = ctx.createRadialGradient(width / 2, height / 2, width * 0.25, width / 2, height / 2, width * 0.75)
    grad.addColorStop(0, 'rgba(9, 10, 15, 0.25)')
    grad.addColorStop(1, 'rgba(9, 10, 15, 0.75)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)
  } else if (state.backgroundMode === 'cyber-grid') {
    // Cyberpunk Perspective Grid
    ctx.fillStyle = '#07080D'
    ctx.fillRect(0, 0, width, height)

    ctx.save()
    ctx.strokeStyle = palette.primary
    ctx.globalAlpha = 0.15
    ctx.lineWidth = 1

    const horizonY = height * 0.6
    const gridCols = 24
    const speed = (currentTime * 40) % 40

    // Horizontal receding lines
    for (let y = horizonY; y <= height; y += (y - horizonY + 12) * 0.22) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Perspective vanishing lines
    for (let i = -gridCols / 2; i <= gridCols / 2; i++) {
      ctx.beginPath()
      ctx.moveTo(width / 2, horizonY)
      ctx.lineTo(width / 2 + i * (width / 6), height)
      ctx.stroke()
    }
    ctx.restore()
  } else if (state.backgroundMode === 'deep-space') {
    // Deep cosmic gradient
    const grad = ctx.createRadialGradient(width / 2, height * 0.45, 50, width / 2, height / 2, width * 0.8)
    grad.addColorStop(0, '#16192b')
    grad.addColorStop(0.5, '#0b0d17')
    grad.addColorStop(1, '#05060a')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)
  } else if (state.backgroundMode === 'gradient-pulse') {
    const pulseStrength = 0.25 + bands.bass * 0.25
    const grad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width * 0.85)
    grad.addColorStop(0, palette.secondary)
    grad.addColorStop(1, '#090A0F')
    ctx.save()
    ctx.globalAlpha = pulseStrength
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  } else {
    // Dark studio base
    const grad = ctx.createLinearGradient(0, 0, 0, height)
    grad.addColorStop(0, '#10121a')
    grad.addColorStop(1, '#08090d')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)
  }
}

/**
 * Draw Photo Composition Layer (Circular Vinyl, Fullscreen, Portrait Frame, Floating Card)
 */
function drawPhotoCompositionLayer(
  ctx: CanvasRenderingContext2D,
  state: CompositionState,
  photoImages: HTMLImageElement[],
  width: number,
  height: number,
  palette: ThemeColors,
  bands: DetailedAudioBands,
  currentTime: number
) {
  // Dotted Harmonic Matrix renders the photo directly through the full-screen halftone dots
  if (state.activePreset === 'dotted-harmonic-matrix') {
    return
  }

  const currentPhoto = photoImages[state.activePhotoIndex] || photoImages[0]
  const centerX = width / 2
  const centerY = state.aspectRatio === '9:16' ? height * 0.45 : height / 2
  const primaryRadius = Math.min(width, height) * (state.aspectRatio === '9:16' ? 0.22 : 0.26)

  ctx.save()

  // Graceful placeholder when no photo is uploaded yet
  if (!currentPhoto || !currentPhoto.complete) {
    if (state.imageLayoutMode === 'album-disc') {
      ctx.translate(centerX, centerY)
      if (state.enableVinylRotation) {
        ctx.rotate(currentTime * 0.4)
      }
      // Outer Vinyl Record Lip
      ctx.fillStyle = '#0d0e12'
      ctx.beginPath()
      ctx.arc(0, 0, primaryRadius * 1.04, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = palette.primary
      ctx.lineWidth = 2
      ctx.stroke()

      // Vinyl groove circles
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'
      ctx.lineWidth = 1
      for (let r = primaryRadius * 0.35; r < primaryRadius * 0.95; r += 14) {
        ctx.beginPath()
        ctx.arc(0, 0, r, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Center Spindle Hole with Musical Note
      ctx.fillStyle = palette.primary
      ctx.beginPath()
      ctx.arc(0, 0, primaryRadius * 0.22, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#090A0F'
      ctx.font = `bold ${Math.round(primaryRadius * 0.2)}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('♫', 0, 0)
    }
    ctx.restore()
    return
  }

  if (state.imageLayoutMode === 'album-disc') {
    // Circular Vinyl Record with Groove Rings & Rotation
    ctx.translate(centerX, centerY)
    if (state.enableVinylRotation) {
      ctx.rotate(currentTime * 0.4)
    }

    // Outer Vinyl Record Lip
    ctx.fillStyle = '#0d0e12'
    ctx.beginPath()
    ctx.arc(0, 0, primaryRadius * 1.04, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 1
    ctx.stroke()

    // Inner Circular Album Art
    ctx.save()
    ctx.beginPath()
    ctx.arc(0, 0, primaryRadius * 0.98, 0, Math.PI * 2)
    ctx.clip()

    const size = primaryRadius * 2
    ctx.drawImage(currentPhoto, -size / 2, -size / 2, size, size)
    ctx.restore()

    // Center Spindle Hole
    ctx.fillStyle = '#090A0F'
    ctx.beginPath()
    ctx.arc(0, 0, primaryRadius * 0.14, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = palette.primary
    ctx.lineWidth = 2
    ctx.stroke()
  } else if (state.imageLayoutMode === 'portrait-frame') {
    // Rounded Portrait Card with Soft Drop Shadow
    const cardW = primaryRadius * 1.45
    const cardH = primaryRadius * 2.1
    const cornerR = 24

    ctx.translate(centerX, centerY)

    // Shadow
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.65)'
    ctx.shadowBlur = 32
    ctx.shadowOffsetY = 14
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, cornerR)
    ctx.fill()
    ctx.restore()

    // Image Clip
    ctx.save()
    ctx.beginPath()
    ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, cornerR)
    ctx.clip()

    const s = Math.max(cardW / currentPhoto.width, cardH / currentPhoto.height)
    const dw = currentPhoto.width * s
    const dh = currentPhoto.height * s
    ctx.drawImage(currentPhoto, -dw / 2, -dh / 2, dw, dh)
    ctx.restore()

    // Border Frame
    ctx.strokeStyle = 'rgba(255,255,255,0.18)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, cornerR)
    ctx.stroke()
  } else if (state.imageLayoutMode === 'floating-card') {
    // Floating Card with 2.5D Tilt
    const tiltAngle = Math.sin(currentTime * 0.8) * 0.04
    ctx.translate(centerX, centerY)
    ctx.rotate(tiltAngle)

    const size = primaryRadius * 1.8
    ctx.save()
    ctx.shadowColor = palette.glow
    ctx.shadowBlur = 24
    ctx.beginPath()
    ctx.roundRect(-size / 2, -size / 2, size, size, 18)
    ctx.clip()
    ctx.drawImage(currentPhoto, -size / 2, -size / 2, size, size)
    ctx.restore()

    ctx.strokeStyle = palette.primary
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.roundRect(-size / 2, -size / 2, size, size, 18)
    ctx.stroke()
  } else if (state.imageLayoutMode === 'fullscreen-cinematic') {
    // Fullscreen Image with subtle zoom and user adjustments
    const userCrop = state.photos[state.activePhotoIndex]?.crop || { zoom: 1, y: 0, rotation: 35 }
    const zoom = (1 + Math.sin(currentTime * 0.15) * 0.02) * (userCrop.zoom || 1.0)
    const offsetY = userCrop.y || 0
    ctx.translate(width / 2, height / 2 + offsetY)
    ctx.scale(zoom, zoom)
    const s = Math.max(width / currentPhoto.width, height / currentPhoto.height)
    const dw = currentPhoto.width * s
    const dh = currentPhoto.height * s
    ctx.drawImage(currentPhoto, -dw / 2, -dh / 2, dw, dh)

    // Contrast overlay so visualizer and lyrics are crisp and readable
    const darkness = (userCrop.rotation ?? 35) / 100
    ctx.fillStyle = `rgba(9, 10, 15, ${darkness})`
    ctx.fillRect(-dw / 2, -dh / 2, dw, dh)
  }

  ctx.restore()
}

/**
 * Draw "Made with IndiaTools" Optional Outro / Branding Badge
 */
function drawBrandingBadge(
  ctx: CanvasRenderingContext2D,
  branding: CompositionState['branding'],
  width: number,
  height: number,
  palette: ThemeColors
) {
  ctx.save()
  const paddingX = 14
  const paddingY = 8
  const posX = width / 2
  const posY = height - 44

  ctx.font = '600 13px sans-serif'
  const text = branding.text || 'Made with IndiaTools'
  const textW = ctx.measureText(text).width
  const boxW = textW + paddingX * 2
  const boxH = 30

  // Pill backdrop
  ctx.fillStyle = 'rgba(9, 10, 15, 0.75)'
  ctx.beginPath()
  ctx.roundRect(posX - boxW / 2, posY - boxH / 2, boxW, boxH, 15)
  ctx.fill()

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#f3f0e5'
  ctx.fillText(text, posX, posY)

  ctx.restore()
}

// Backward-compatible export alias for drawBackground
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  bgMode: any,
  albumImage: HTMLImageElement | null,
  palette: ThemeColors,
  time: number
) {
  drawBackgroundLayer(ctx, { backgroundMode: bgMode, activePhotoIndex: 0 } as any, albumImage ? [albumImage] : [], width, height, palette, { bass: 0.5, subBass: 0.5, lowMids: 0.5, mids: 0.5, highMids: 0.5, treble: 0.5, overall: 0.5, isBeatHit: false, energyDelta: 0 }, time)
}
