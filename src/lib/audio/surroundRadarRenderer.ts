/**
 * Interactive 5.1 & 7.1 Surround Sound Speaker Radar Visualizer
 * Renders an ITU-R BS.775 circular listening soundstage with active speaker beams,
 * per-channel VU meter rings, subwoofer bass pulses, and listener sweet spot.
 */

import { ChannelId, SURROUND_CHANNELS, SurroundMode } from './surroundEngine'

export interface SpeakerRadarTelemetry {
  channelLevels: Record<ChannelId, number> // 0.0 to 1.0 normalized RMS energy
  isPlaying: boolean
  isBypassed: boolean
  selectedChannel?: ChannelId | null
}

export function renderSurroundRadar(
  canvas: HTMLCanvasElement,
  mode: SurroundMode,
  telemetry: SpeakerRadarTelemetry,
  timeSec: number,
  onSelectSpeaker?: (ch: ChannelId) => void
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const width = canvas.width / dpr
  const height = canvas.height / dpr

  ctx.save()
  ctx.scale(dpr, dpr)

  // 1. Midnight Slate Background
  ctx.fillStyle = '#060a12'
  ctx.fillRect(0, 0, width, height)

  const centerX = width * 0.5
  const centerY = height * 0.5
  const radius = Math.min(width, height) * 0.38

  // Concentric Radar Distance Rings
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)' // Cyan tint
  ctx.lineWidth = 1
  for (const rFrac of [0.35, 0.65, 1.0]) {
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * rFrac, 0, Math.PI * 2)
    ctx.stroke()
  }

  // Crosshair Guide Lines
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)'
  ctx.beginPath()
  ctx.moveTo(centerX - radius * 1.1, centerY)
  ctx.lineTo(centerX + radius * 1.1, centerY)
  ctx.moveTo(centerX, centerY - radius * 1.1)
  ctx.lineTo(centerX, centerY + radius * 1.1)
  ctx.stroke()

  // 2. Central Listener Sweet Spot
  ctx.save()
  const headRadius = 16
  const listenerLevel = telemetry.isPlaying && !telemetry.isBypassed
    ? Object.values(telemetry.channelLevels).reduce((a, b) => a + b, 0) / 8
    : 0

  // Listener outer pulse halo
  ctx.beginPath()
  ctx.arc(centerX, centerY, headRadius + (telemetry.isPlaying ? listenerLevel * 14 : 0), 0, Math.PI * 2)
  ctx.strokeStyle = telemetry.isBypassed ? 'rgba(148, 163, 184, 0.4)' : 'rgba(6, 182, 212, 0.5)'
  ctx.lineWidth = 2
  ctx.stroke()

  // Head circle
  ctx.beginPath()
  ctx.arc(centerX, centerY, headRadius, 0, Math.PI * 2)
  ctx.fillStyle = telemetry.isBypassed ? '#1e293b' : '#083344'
  ctx.fill()
  ctx.strokeStyle = telemetry.isBypassed ? '#64748b' : '#06b6d4'
  ctx.lineWidth = 2
  ctx.stroke()

  // Nose triangle pointing UP towards screen (0 degrees)
  ctx.beginPath()
  ctx.moveTo(centerX - 4, centerY - headRadius + 2)
  ctx.lineTo(centerX, centerY - headRadius - 6)
  ctx.lineTo(centerX + 4, centerY - headRadius + 2)
  ctx.fillStyle = telemetry.isBypassed ? '#64748b' : '#06b6d4'
  ctx.fill()

  // Ears
  ctx.beginPath()
  ctx.ellipse(centerX - headRadius, centerY, 3, 6, 0, 0, Math.PI * 2)
  ctx.ellipse(centerX + headRadius, centerY, 3, 6, 0, 0, Math.PI * 2)
  ctx.fillStyle = telemetry.isBypassed ? '#64748b' : '#06b6d4'
  ctx.fill()
  ctx.restore()

  // 3. Render Virtual Speakers
  const is71 = mode === 'surround-7-1'
  const isBinaural = mode === 'binaural-headphones'
  const channelList: ChannelId[] = is71
    ? ['FL', 'FR', 'C', 'LFE', 'SL', 'SR', 'RL', 'RR']
    : ['FL', 'FR', 'C', 'LFE', 'SL', 'SR']

  for (const chId of channelList) {
    const chInfo = SURROUND_CHANNELS[chId]
    const level = telemetry.channelLevels[chId] || 0
    const isSelected = telemetry.selectedChannel === chId

    // Convert azimuth to canvas angle: 0 deg = top (-PI/2)
    // Azimuth: clockwise positive, counter-clockwise negative
    const angleRad = (chInfo.azimuthDeg - 90) * (Math.PI / 180)
    // LFE placed slightly inside the perimeter
    const rDist = chId === 'LFE' ? radius * 0.72 : radius

    const spkX = centerX + Math.cos(angleRad) * rDist
    const spkY = centerY + Math.sin(angleRad) * rDist

    // 3a. Animated Signal Beam from Speaker to Listener
    if (telemetry.isPlaying && !telemetry.isBypassed && level > 0.05) {
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(spkX, spkY)
      ctx.lineTo(centerX, centerY)

      const beamAlpha = Math.min(0.85, level * 0.95 + 0.1)
      const beamColor = chId === 'LFE'
        ? `rgba(236, 72, 153, ${beamAlpha})` // Pink for Subwoofer
        : chId === 'C'
        ? `rgba(16, 185, 129, ${beamAlpha})` // Emerald for Dialogue
        : `rgba(6, 182, 212, ${beamAlpha})` // Cyan for Surrounds/Fronts

      ctx.strokeStyle = beamColor
      ctx.lineWidth = Math.max(1.5, level * 4)
      ctx.setLineDash([4, 6])
      ctx.lineDashOffset = -timeSec * 35
      ctx.stroke()
      ctx.restore()
    }

    // 3b. Subwoofer Expanding Bass Rings
    if (chId === 'LFE' && telemetry.isPlaying && level > 0.2) {
      ctx.save()
      const numSubRings = 2
      for (let s = 1; s <= numSubRings; s++) {
        const ringR = 14 + s * 16 * level
        ctx.beginPath()
        ctx.arc(spkX, spkY, ringR, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(236, 72, 153, ${0.4 - s * 0.15})`
        ctx.lineWidth = 2
        ctx.stroke()
      }
      ctx.restore()
    }

    // 3c. Speaker Circular VU Meter Ring
    ctx.save()
    const spkRadius = 14
    const meterRadius = spkRadius + 4

    // Background meter track
    ctx.beginPath()
    ctx.arc(spkX, spkY, meterRadius, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 3
    ctx.stroke()

    // Active VU Level Arc
    if (telemetry.isPlaying && !telemetry.isBypassed && level > 0.01) {
      const startAngle = -Math.PI / 2
      const endAngle = startAngle + level * Math.PI * 2
      ctx.beginPath()
      ctx.arc(spkX, spkY, meterRadius, startAngle, endAngle)
      ctx.strokeStyle = chId === 'LFE' ? '#ec4899' : chId === 'C' ? '#10b981' : '#06b6d4'
      ctx.lineWidth = 3.5
      ctx.stroke()
    }

    // 3d. Speaker Housing Circle
    ctx.beginPath()
    ctx.arc(spkX, spkY, spkRadius, 0, Math.PI * 2)
    ctx.fillStyle = isSelected
      ? '#0369a1'
      : telemetry.isPlaying && level > 0.15
      ? '#0f172a'
      : '#090d16'
    ctx.fill()
    ctx.strokeStyle = isSelected
      ? '#38bdf8'
      : chId === 'LFE'
      ? '#ec4899'
      : chId === 'C'
      ? '#10b981'
      : '#06b6d4'
    ctx.lineWidth = isSelected ? 2.5 : 1.5
    ctx.stroke()

    // 3e. Speaker Channel Label (e.g., FL, C, LFE)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 9px ui-monospace, monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(chId, spkX, spkY)

    // Decibel readout pill below speaker
    const dbValue = telemetry.isPlaying && !telemetry.isBypassed
      ? (-48 + level * 46).toFixed(0) + ' dB'
      : 'OFF'

    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)'
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)'
    ctx.lineWidth = 1
    const pillW = 38
    const pillH = 14
    const pillX = spkX - pillW * 0.5
    const pillY = spkY + spkRadius + 8
    ctx.fillRect(pillX, pillY, pillW, pillH)
    ctx.strokeRect(pillX, pillY, pillW, pillH)

    ctx.fillStyle = '#67e8f9'
    ctx.font = '8px ui-monospace, monospace'
    ctx.fillText(dbValue, spkX, pillY + pillH * 0.55)

    ctx.restore()
  }

  // 4. Headphone Mode Banner Indicator (if Binaural mode active)
  if (isBinaural) {
    ctx.save()
    const bannerW = 200
    const bannerH = 26
    const bannerX = centerX - bannerW * 0.5
    const bannerY = height - 38

    ctx.fillStyle = 'rgba(8, 51, 68, 0.85)'
    ctx.strokeStyle = '#06b6d4'
    ctx.lineWidth = 1.5
    ctx.fillRect(bannerX, bannerY, bannerW, bannerH)
    ctx.strokeRect(bannerX, bannerY, bannerW, bannerH)

    ctx.fillStyle = '#a5f3fc'
    ctx.font = 'bold 9.5px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('HEADPHONE 3D BINAURAL HRTF', centerX, bannerY + 16)
    ctx.restore()
  }

  ctx.restore()
}
