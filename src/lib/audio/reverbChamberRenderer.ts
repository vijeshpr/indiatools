/**
 * Interactive 2D Acoustic Cinema Chamber Visualizer
 * Renders an isometric cinema auditorium with dynamic sound ray bounces,
 * listener sweet spot, reflection envelopes, and real-time audio reactivity.
 */

import { ReverbOptions, MATERIAL_PROPERTIES } from './reverbEngine'

export interface ChamberRenderData {
  audioEnergy: number // 0.0 to 1.0 from AnalyserNode
  isPlaying: boolean
  isBypassed: boolean
}

export function renderAcousticChamber(
  canvas: HTMLCanvasElement,
  options: ReverbOptions,
  data: ChamberRenderData,
  timeSec: number
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const width = canvas.width / dpr
  const height = canvas.height / dpr

  ctx.save()
  ctx.scale(dpr, dpr)

  // 1. Dark Cinematic Background
  ctx.fillStyle = '#06080e'
  ctx.fillRect(0, 0, width, height)

  // Subtle radial ambient light from the screen
  const screenGrad = ctx.createRadialGradient(
    width * 0.5,
    height * 0.18,
    20,
    width * 0.5,
    height * 0.45,
    width * 0.6
  )
  screenGrad.addColorStop(0, 'rgba(234, 179, 8, 0.18)') // Warm Cinema Amber
  screenGrad.addColorStop(0.5, 'rgba(180, 83, 9, 0.08)')
  screenGrad.addColorStop(1, 'rgba(6, 8, 14, 0)')
  ctx.fillStyle = screenGrad
  ctx.fillRect(0, 0, width, height)

  // 2. Isometric Auditorium Boundaries
  const roomScale = Math.min(width / 60, height / 35) * 0.75
  const L = options.roomLength * roomScale
  const W = options.roomWidth * roomScale
  const H = options.roomHeight * roomScale * 0.65

  const centerX = width * 0.5
  const centerY = height * 0.55

  // Isometric projection points
  // Screen Wall (Front):
  const fTopL = { x: centerX - W * 0.55, y: centerY - L * 0.35 - H }
  const fTopR = { x: centerX + W * 0.55, y: centerY - L * 0.35 - H }
  const fBotL = { x: centerX - W * 0.5, y: centerY - L * 0.35 }
  const fBotR = { x: centerX + W * 0.5, y: centerY - L * 0.35 }

  // Rear Wall (Back):
  const bTopL = { x: centerX - W * 0.85, y: centerY + L * 0.45 - H }
  const bTopR = { x: centerX + W * 0.85, y: centerY + L * 0.45 - H }
  const bBotL = { x: centerX - W * 0.75, y: centerY + L * 0.45 }
  const bBotR = { x: centerX + W * 0.75, y: centerY + L * 0.45 }

  // Draw Auditorium Floor
  ctx.beginPath()
  ctx.moveTo(fBotL.x, fBotL.y)
  ctx.lineTo(fBotR.x, fBotR.y)
  ctx.lineTo(bBotR.x, bBotR.y)
  ctx.lineTo(bBotL.x, bBotL.y)
  ctx.closePath()

  const floorGrad = ctx.createLinearGradient(0, fBotL.y, 0, bBotL.y)
  floorGrad.addColorStop(0, '#0c101d')
  floorGrad.addColorStop(1, '#080a14')
  ctx.fillStyle = floorGrad
  ctx.fill()

  ctx.strokeStyle = 'rgba(234, 179, 8, 0.25)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Seating Tiers Grid Lines on Floor
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
  ctx.lineWidth = 1
  const numRows = 7
  for (let r = 1; r < numRows; r++) {
    const frac = r / numRows
    const yL = fBotL.y + (bBotL.y - fBotL.y) * frac
    const xL = fBotL.x + (bBotL.x - fBotL.x) * frac
    const yR = fBotR.y + (bBotR.y - fBotR.y) * frac
    const xR = fBotR.x + (bBotR.x - fBotR.x) * frac

    ctx.beginPath()
    ctx.moveTo(xL, yL)
    ctx.lineTo(xR, yR)
    ctx.stroke()
  }

  // Draw Left Acoustic Wall
  ctx.beginPath()
  ctx.moveTo(fBotL.x, fBotL.y)
  ctx.lineTo(fTopL.x, fTopL.y)
  ctx.lineTo(bTopL.x, bTopL.y)
  ctx.lineTo(bBotL.x, bBotL.y)
  ctx.closePath()
  ctx.fillStyle = 'rgba(15, 23, 42, 0.65)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(234, 179, 8, 0.15)'
  ctx.stroke()

  // Draw Right Acoustic Wall
  ctx.beginPath()
  ctx.moveTo(fBotR.x, fBotR.y)
  ctx.lineTo(fTopR.x, fTopR.y)
  ctx.lineTo(bTopR.x, bTopR.y)
  ctx.lineTo(bBotR.x, bBotR.y)
  ctx.closePath()
  ctx.fillStyle = 'rgba(15, 23, 42, 0.65)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(234, 179, 8, 0.15)'
  ctx.stroke()

  // 3. Front Cinema Screen
  const screenW = (fBotR.x - fBotL.x) * 0.75
  const screenH = H * 0.65
  const screenX = centerX - screenW * 0.5
  const screenY = fBotL.y - screenH - 10

  // Screen outer bezel
  ctx.fillStyle = '#0f172a'
  ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)'
  ctx.lineWidth = 2
  ctx.fillRect(screenX - 4, screenY - 4, screenW + 8, screenH + 8)
  ctx.strokeRect(screenX - 4, screenY - 4, screenW + 8, screenH + 8)

  // Screen canvas surface with movie projector glow
  const projGrad = ctx.createLinearGradient(screenX, screenY, screenX + screenW, screenY + screenH)
  projGrad.addColorStop(0, '#fef08a')
  projGrad.addColorStop(0.5, '#eab308')
  projGrad.addColorStop(1, '#ca8a04')
  ctx.fillStyle = projGrad
  ctx.shadowColor = '#eab308'
  ctx.shadowBlur = data.isPlaying ? 20 * (1 + data.audioEnergy) : 10
  ctx.fillRect(screenX, screenY, screenW, screenH)
  ctx.shadowBlur = 0 // Reset shadow

  // DTS Cinema Title on Screen
  ctx.fillStyle = '#020617'
  ctx.font = 'bold 10px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('DTS CINEMA ACOUSTICS', centerX, screenY + screenH * 0.55)

  // 4. Center Listener Position (Sweet Spot)
  const listenerX = centerX
  const listenerY = centerY + (bBotL.y - fBotL.y) * 0.45

  // Listener pulse ring
  const pulseRadius = 14 + (data.isPlaying ? data.audioEnergy * 18 : Math.sin(timeSec * 3) * 3)
  ctx.beginPath()
  ctx.arc(listenerX, listenerY, pulseRadius, 0, Math.PI * 2)
  ctx.strokeStyle = data.isBypassed ? 'rgba(148, 163, 184, 0.4)' : 'rgba(234, 179, 8, 0.6)'
  ctx.lineWidth = 2
  ctx.stroke()

  // Listener dot
  ctx.beginPath()
  ctx.arc(listenerX, listenerY, 6, 0, Math.PI * 2)
  ctx.fillStyle = data.isBypassed ? '#94a3b8' : '#eab308'
  ctx.fill()

  // 5. Dynamic Acoustic Reflection Ray Bounces
  if (data.isPlaying && !data.isBypassed) {
    const numRays = 8
    const rayCycle = (timeSec * 1.8) % 1.0

    ctx.save()
    for (let i = 0; i < numRays; i++) {
      const angle = (i / numRays) * Math.PI * 2
      const spread = 0.8 + (i % 3) * 0.3

      // Wall bounce target
      const bounceX = centerX + Math.cos(angle) * (W * 0.65 * spread)
      const bounceY = centerY + Math.sin(angle) * (L * 0.45 * spread)

      // Animate ray travelling Screen -> Wall -> Listener
      const p1 = { x: centerX, y: screenY + screenH }
      const p2 = { x: bounceX, y: bounceY }
      const p3 = { x: listenerX, y: listenerY }

      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.lineTo(p3.x, p3.y)

      const rayAlpha = Math.max(0.05, (1.0 - (i / numRays) * 0.8) * options.earlyReflectionLevel * (0.3 + data.audioEnergy * 0.7))
      ctx.strokeStyle = `rgba(250, 204, 21, ${rayAlpha})`
      ctx.lineWidth = 1.5
      ctx.setLineDash([4, 6])
      ctx.lineDashOffset = -timeSec * 25
      ctx.stroke()
    }
    ctx.restore()
  }

  // 6. RT60 Decay Envelope & Acoustic Telemetry Card (Bottom Left Overlay)
  const hudX = 16
  const hudY = height - 76
  const hudW = Math.min(220, width * 0.4)
  const hudH = 60

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
  ctx.strokeStyle = 'rgba(234, 179, 8, 0.3)'
  ctx.lineWidth = 1
  ctx.fillRect(hudX, hudY, hudW, hudH)
  ctx.strokeRect(hudX, hudY, hudW, hudH)

  // Draw exponential RT60 curve inside HUD
  ctx.beginPath()
  const curveStartX = hudX + 8
  const curveEndX = hudX + hudW - 8
  const curveStartY = hudY + 14
  const curveH = 34

  ctx.moveTo(curveStartX, curveStartY)
  for (let x = curveStartX; x <= curveEndX; x++) {
    const frac = (x - curveStartX) / (curveEndX - curveStartX)
    const decay = Math.exp(-frac * (options.rt60 / 0.8))
    const y = curveStartY + (1 - decay) * curveH
    ctx.lineTo(x, y)
  }
  ctx.strokeStyle = '#eab308'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = '#fef08a'
  ctx.font = 'bold 9px ui-monospace, monospace'
  ctx.textAlign = 'left'
  ctx.fillText(`RT60: ${options.rt60.toFixed(2)}s • Pre-Delay: ${options.preDelayMs}ms`, hudX + 8, hudY + hudH - 6)

  // 7. Material badge (Top Right)
  const matInfo = MATERIAL_PROPERTIES[options.wallMaterial]
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
  ctx.strokeStyle = 'rgba(234, 179, 8, 0.3)'
  const badgeW = 160
  const badgeH = 28
  const badgeX = width - badgeW - 16
  const badgeY = 16
  ctx.fillRect(badgeX, badgeY, badgeW, badgeH)
  ctx.strokeRect(badgeX, badgeY, badgeW, badgeH)

  ctx.fillStyle = '#fbbf24'
  ctx.font = 'bold 9.5px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`Acoustic: ${matInfo.label}`, badgeX + badgeW * 0.5, badgeY + 18)

  ctx.restore()
}
