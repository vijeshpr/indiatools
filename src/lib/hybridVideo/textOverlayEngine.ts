/**
 * IndiaTools — Motion Titles & Typography Engine
 * Canvas 2D Text Layout, Shadow, Outline, and Dynamic Animations
 */

import type { ClipTextProperties, TextTitleStyle } from './types.ts'

export interface TextTitlePresetDef {
  id: TextTitleStyle
  name: string
  description: string
  props: ClipTextProperties
}

export const TITLE_STYLE_PRESETS: TextTitlePresetDef[] = [
  {
    id: 'cinematic-title',
    name: 'Cinematic Title',
    description: 'Bold, elegant center movie title with dramatic shadow',
    props: {
      text: 'THE JOURNEY',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 72,
      fontWeight: '800',
      color: '#FFFFFF',
      textAlign: 'center',
      outlineColor: '#000000',
      outlineWidth: 2,
      shadowColor: 'rgba(0,0,0,0.85)',
      shadowBlur: 16,
      shadowOffsetX: 0,
      shadowOffsetY: 6,
      animation: 'fade',
      titleStyle: 'cinematic-title',
    },
  },
  {
    id: 'minimal-subtitle',
    name: 'Minimal Subtitle',
    description: 'Clean subtitle caption with subtle dark backing pill',
    props: {
      text: 'Exploring the breathtaking hills of Wayanad',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 34,
      fontWeight: '500',
      color: '#FFFFFF',
      textAlign: 'center',
      outlineColor: '#000000',
      outlineWidth: 1,
      shadowColor: 'rgba(0,0,0,0.5)',
      shadowBlur: 4,
      shadowOffsetX: 0,
      shadowOffsetY: 2,
      backgroundColor: 'rgba(0,0,0,0.65)',
      backgroundPadding: 12,
      backgroundRadius: 8,
      animation: 'slide-up',
      titleStyle: 'minimal-subtitle',
    },
  },
  {
    id: 'bold-social-caption',
    name: 'Bold Social Caption',
    description: 'Viral Reels/Shorts typography with high-contrast yellow & stroke',
    props: {
      text: 'WAIT FOR THE DROP! 🔥',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: 56,
      fontWeight: '900',
      color: '#FACC15',
      textAlign: 'center',
      outlineColor: '#000000',
      outlineWidth: 5,
      shadowColor: 'rgba(0,0,0,0.9)',
      shadowBlur: 12,
      shadowOffsetX: 0,
      shadowOffsetY: 4,
      animation: 'pop-scale',
      titleStyle: 'bold-social-caption',
    },
  },
  {
    id: 'lower-third',
    name: 'Lower Third',
    description: 'Broadcast documentary lower-third badge with dark cyan card',
    props: {
      text: 'RAHUL SHARMA | Chief Cinematographer',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 32,
      fontWeight: '600',
      color: '#E0F2FE',
      textAlign: 'left',
      outlineColor: '#000000',
      outlineWidth: 0,
      shadowColor: 'rgba(0,0,0,0.6)',
      shadowBlur: 8,
      shadowOffsetX: 0,
      shadowOffsetY: 2,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      backgroundPadding: 16,
      backgroundRadius: 6,
      animation: 'slide-up',
      titleStyle: 'lower-third',
    },
  },
  {
    id: 'end-card',
    name: 'End Card',
    description: 'Cinematic concluding title with delicate letter-spacing vibe',
    props: {
      text: 'THANK YOU FOR WATCHING',
      fontFamily: 'Georgia, serif',
      fontSize: 48,
      fontWeight: '400',
      color: '#FDFBF7',
      textAlign: 'center',
      outlineColor: '#000000',
      outlineWidth: 1,
      shadowColor: 'rgba(0,0,0,0.7)',
      shadowBlur: 10,
      shadowOffsetX: 0,
      shadowOffsetY: 4,
      animation: 'fade',
      titleStyle: 'end-card',
    },
  },
  {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    description: 'Vibrant cyan glowing synthwave title',
    props: {
      text: 'CYBER METROPOLIS',
      fontFamily: 'Courier New, monospace',
      fontSize: 58,
      fontWeight: '700',
      color: '#00F0FF',
      textAlign: 'center',
      outlineColor: '#0891B2',
      outlineWidth: 2,
      shadowColor: '#00F0FF',
      shadowBlur: 24,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      animation: 'pop-scale',
      titleStyle: 'neon-cyber',
    },
  },
]

export function renderTextOverlay(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  props: ClipTextProperties,
  clipRelTimeSec: number,
  clipDurationSec: number,
  offsetX = 0,
  offsetY = 0,
  scale = 1,
  rotationDeg = 0,
  clipOpacity = 1
): void {
  if (!props.text.trim()) return

  ctx.save()

  // Animation calculation (intro during first 0.5s, outro during last 0.5s)
  let animOpacity = 1
  let animOffsetY = 0
  let animScale = 1
  let displayText = props.text

  const introSpan = Math.min(0.5, clipDurationSec * 0.25)
  const outroSpan = Math.min(0.5, clipDurationSec * 0.25)
  const outroStart = clipDurationSec - outroSpan

  if (clipRelTimeSec < introSpan) {
    const t = clipRelTimeSec / introSpan // 0 to 1
    switch (props.animation) {
      case 'fade':
        animOpacity = t
        break
      case 'slide-up':
        animOpacity = t
        animOffsetY = (1 - t) * 40
        break
      case 'slide-down':
        animOpacity = t
        animOffsetY = -(1 - t) * 40
        break
      case 'pop-scale':
        animOpacity = t
        animScale = 0.5 + 0.5 * Math.sin(t * (Math.PI / 2))
        break
      case 'typewriter':
        const charCount = Math.floor(t * props.text.length)
        displayText = props.text.substring(0, charCount)
        break
    }
  } else if (clipRelTimeSec > outroStart) {
    const t = (clipDurationSec - clipRelTimeSec) / outroSpan // 1 down to 0
    switch (props.animation) {
      case 'fade':
      case 'slide-up':
      case 'slide-down':
      case 'pop-scale':
        animOpacity = Math.max(0, t)
        break
      case 'typewriter':
        // Stay full text during outro fade
        animOpacity = Math.max(0, t)
        break
    }
  }

  const finalOpacity = Math.max(0, Math.min(1, clipOpacity * animOpacity))
  if (finalOpacity <= 0.01) {
    ctx.restore()
    return
  }

  ctx.globalAlpha = finalOpacity

  // Translate to target coordinate
  const centerX = canvasWidth / 2 + offsetX
  const centerY = canvasHeight / 2 + offsetY + animOffsetY

  ctx.translate(centerX, centerY)
  if (rotationDeg !== 0) {
    ctx.rotate((rotationDeg * Math.PI) / 180)
  }
  const totalScale = scale * animScale
  if (totalScale !== 1) {
    ctx.scale(totalScale, totalScale)
  }

  ctx.font = `${props.fontWeight} ${props.fontSize}px ${props.fontFamily}`
  ctx.textAlign = props.textAlign
  ctx.textBaseline = 'middle'

  const lines = displayText.split('\n')
  const lineHeight = props.fontSize * 1.25
  const totalHeight = lines.length * lineHeight
  const startY = -(totalHeight / 2) + lineHeight / 2

  // Background Box / Pill if configured
  if (props.backgroundColor) {
    let maxWidth = 0
    for (const line of lines) {
      const w = ctx.measureText(line).width
      if (w > maxWidth) maxWidth = w
    }
    const pad = props.backgroundPadding ?? 12
    const radius = props.backgroundRadius ?? 8
    const boxW = maxWidth + pad * 2
    const boxH = totalHeight + pad * 2
    const boxX = props.textAlign === 'center' ? -boxW / 2 : props.textAlign === 'right' ? -boxW + pad : -pad
    const boxY = -(totalHeight / 2) - pad

    ctx.save()
    ctx.fillStyle = props.backgroundColor
    ctx.beginPath()
    ctx.roundRect(boxX, boxY, boxW, boxH, radius)
    ctx.fill()
    ctx.restore()
  }

  // Draw each line with Shadow, Outline, and Fill
  lines.forEach((line, index) => {
    const lineY = startY + index * lineHeight

    // Drop shadow
    if (props.shadowBlur > 0) {
      ctx.shadowColor = props.shadowColor
      ctx.shadowBlur = props.shadowBlur
      ctx.shadowOffsetX = props.shadowOffsetX
      ctx.shadowOffsetY = props.shadowOffsetY
    }

    // Outline / Stroke
    if (props.outlineWidth > 0) {
      ctx.strokeStyle = props.outlineColor
      ctx.lineWidth = props.outlineWidth * 2
      ctx.lineJoin = 'round'
      ctx.strokeText(line, 0, lineY)
    }

    // Reset shadow before fill so stroke has shadow, fill is crisp
    ctx.shadowBlur = 0
    ctx.fillStyle = props.color
    ctx.fillText(line, 0, lineY)
  })

  ctx.restore()
}
