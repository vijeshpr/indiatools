/**
 * Orbit Audio Studio — Spatial Radar Visualizer
 * High-performance 2D/3D Canvas rendering for spatial acoustic trajectories,
 * listener orientation, orbital trails, and real-time sound source tracking.
 */

import { SpatialCoordinate, SpatialOptions } from './spatialEngine'

export interface RadarPoint {
  x: number // -meters to +meters
  z: number // -meters (front) to +meters (back)
  y: number // elevation
  alpha: number // 0 to 1 decay
}

export function renderSpatialRadar(
  canvas: HTMLCanvasElement,
  currentCoord: SpatialCoordinate,
  options: SpatialOptions,
  trails: RadarPoint[],
  maxMeters = 5.0
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const width = canvas.width / dpr
  const height = canvas.height / dpr

  ctx.save()
  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, width, height)

  const cx = width / 2
  const cy = height / 2
  const radarRadius = Math.min(cx, cy) * 0.88
  const scale = radarRadius / maxMeters // pixels per meter

  // 1. Radar Circular Background
  const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radarRadius)
  bgGrad.addColorStop(0, '#0f172a')
  bgGrad.addColorStop(0.7, '#090d16')
  bgGrad.addColorStop(1, '#030712')

  ctx.fillStyle = bgGrad
  ctx.beginPath()
  ctx.arc(cx, cy, radarRadius, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // 2. Concentric Distance Grid Rings (1m, 2m, 3m, 4m)
  ctx.lineWidth = 1
  for (let m = 1; m <= 4; m++) {
    const rPix = m * scale
    if (rPix < radarRadius) {
      ctx.strokeStyle = m % 2 === 0 ? '#334155' : '#1e293b'
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.arc(cx, cy, rPix, 0, Math.PI * 2)
      ctx.stroke()

      // Distance labels
      ctx.setLineDash([])
      ctx.fillStyle = '#64748b'
      ctx.font = '10px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(`${m}m`, cx + rPix - 4, cy - 4)
    }
  }

  // 3. Crosshairs & Angle Rays (Front, Back, Left, Right)
  ctx.setLineDash([])
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 1
  ctx.beginPath()
  // Horizontal (L - R)
  ctx.moveTo(cx - radarRadius, cy)
  ctx.lineTo(cx + radarRadius, cy)
  // Vertical (F - B)
  ctx.moveTo(cx, cy - radarRadius)
  ctx.lineTo(cx, cy + radarRadius)
  ctx.stroke()

  // Cardinal Direction Labels
  ctx.font = 'bold 11px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // Front (Top)
  ctx.fillStyle = '#06B6D4' // Electric Cyan
  ctx.fillText('FRONT (0°)', cx, cy - radarRadius + 14)

  // Back (Bottom)
  ctx.fillStyle = '#94a3b8'
  ctx.fillText('BACK (180°)', cx, cy + radarRadius - 14)

  // Left
  ctx.fillStyle = '#94a3b8'
  ctx.fillText('L (270°)', cx - radarRadius + 26, cy)

  // Right
  ctx.fillStyle = '#94a3b8'
  ctx.fillText('R (90°)', cx + radarRadius - 24, cy)

  // 4. Guide Orbit Path (Thin glowing silhouette of current trajectory)
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.18)' // Faint Cyan
  ctx.lineWidth = 1.5
  ctx.setLineDash([3, 3])
  ctx.beginPath()

  const numSamplePoints = 64
  for (let i = 0; i <= numSamplePoints; i++) {
    const sampleTime = (i / numSamplePoints) * options.speedSec
    // calculate sample coordinate
    const speed = Math.max(1.0, options.speedSec)
    const dir = options.direction === -1 ? -1 : 1
    const omega = ((2 * Math.PI) / speed) * dir
    const th = omega * sampleTime
    const r = Math.max(0.5, options.radius)
    const w = options.widthRatio
    const d = options.depthRatio

    let gx = r * Math.sin(th) * w
    let gz = -r * Math.cos(th) * d

    if (options.preset === 'figure-eight') {
      gx = r * Math.sin(th) * w
      gz = -(r * 0.75) * Math.sin(2 * th) * d
    } else if (options.preset === 'pendulum') {
      const phi = Math.sin(th)
      gx = r * phi * w
      gz = -r * Math.sqrt(Math.max(0.1, 1 - 0.5 * phi * phi)) * d
    }

    const px = cx + gx * scale
    const py = cy + gz * scale

    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // 5. Motion Trails (Recent decaying path)
  if (trails.length > 1) {
    for (let i = 0; i < trails.length; i++) {
      const pt = trails[i]
      const tx = cx + pt.x * scale
      const ty = cy + pt.z * scale
      const alpha = pt.alpha * 0.65

      ctx.fillStyle = `rgba(139, 92, 246, ${alpha})` // Studio Purple trail
      ctx.beginPath()
      ctx.arc(tx, ty, Math.max(1.5, 3 * pt.alpha), 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // 6. Central Listener Icon at (0, 0)
  // Listener Head (Circle with facing nose & stereo ears)
  const headRadius = 14

  // Outer headphone band
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(cx, cy, headRadius + 3, Math.PI * 0.8, Math.PI * 2.2)
  ctx.stroke()

  // Head circle
  ctx.fillStyle = '#1e293b'
  ctx.beginPath()
  ctx.arc(cx, cy, headRadius, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = 2
  ctx.stroke()

  // Stereo Ear Cups (Left & Right)
  ctx.fillStyle = '#818cf8'
  // Left ear
  ctx.fillRect(cx - headRadius - 5, cy - 5, 4, 10)
  // Right ear
  ctx.fillRect(cx + headRadius + 1, cy - 5, 4, 10)

  // Facing Nose Pointer (pointing UP towards FRONT -Z)
  ctx.fillStyle = '#38bdf8'
  ctx.beginPath()
  ctx.moveTo(cx, cy - headRadius - 4)
  ctx.lineTo(cx - 4, cy - headRadius + 2)
  ctx.lineTo(cx + 4, cy - headRadius + 2)
  ctx.closePath()
  ctx.fill()

  // 7. Active Sound Source Orb at (currentCoord.x, currentCoord.z)
  const soundX = cx + currentCoord.x * scale
  const soundY = cy + currentCoord.z * scale

  // Elevation aura scaling (higher elevation makes orb appear slightly elevated)
  const elevNorm = Math.max(-1, Math.min(1, currentCoord.y / 2))
  const baseOrbSize = 9 + elevNorm * 3

  // Ray line connecting listener to sound source
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(soundX, soundY)
  ctx.stroke()

  // Glowing Outer Halo
  const haloGrad = ctx.createRadialGradient(soundX, soundY, 2, soundX, soundY, baseOrbSize * 3)
  haloGrad.addColorStop(0, 'rgba(6, 182, 212, 0.95)') // Bright Cyan core
  haloGrad.addColorStop(0.4, 'rgba(139, 92, 246, 0.55)') // Purple aura
  haloGrad.addColorStop(1, 'rgba(139, 92, 246, 0)')

  ctx.fillStyle = haloGrad
  ctx.beginPath()
  ctx.arc(soundX, soundY, baseOrbSize * 3, 0, Math.PI * 2)
  ctx.fill()

  // Core Solid Orb
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(soundX, soundY, baseOrbSize, 0, Math.PI * 2)
  ctx.fill()

  // Elevation indicator ring around sound source
  ctx.strokeStyle = currentCoord.y >= 0 ? '#38bdf8' : '#a855f7'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(soundX, soundY, baseOrbSize + 4, 0, Math.PI * 2)
  ctx.stroke()

  // 8. Live HUD Coordinate Overlay (Top Left & Top Right)
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 11px monospace'
  ctx.textAlign = 'left'
  ctx.fillText(`AZIMUTH: ${currentCoord.azimuthDeg}°`, 16, 22)
  ctx.fillText(`DIST: ${currentCoord.distance.toFixed(2)}m`, 16, 38)

  ctx.textAlign = 'right'
  ctx.fillStyle = currentCoord.y >= 0 ? '#38bdf8' : '#c084fc'
  ctx.fillText(`ELEV: ${currentCoord.y > 0 ? '+' : ''}${currentCoord.y.toFixed(2)}m`, width - 16, 22)
  ctx.fillStyle = '#94a3b8'
  ctx.fillText(`X:${currentCoord.x > 0 ? '+' : ''}${currentCoord.x.toFixed(1)}m Z:${currentCoord.z > 0 ? '+' : ''}${currentCoord.z.toFixed(1)}m`, width - 16, 38)

  ctx.restore()
}
