/**
 * IndiaTools — Floating Photo Universe 2.0
 * Supernova Shockwave: Cinematic Music Climax Engine
 * Blackhole Attraction, High-Energy Flash, Radial Explosion & Graceful Kinetic Recovery
 */

import {
  UniverseSupernovaConfig,
  DEFAULT_UNIVERSE_SUPERNOVA,
  SupernovaPhase,
  MusicMovementProfile,
} from './photoUniverseTypes.ts'
import { NormalizedAudioBands } from '../audioToVideo/types.ts'

export interface SupernovaFrameState {
  phase: SupernovaPhase
  progress: number // 0 to 1 within current phase
  overallIntensity: number // 0 to 1 shared climax intensity
  flashAlpha: number // 0 to 1
  shockwaveRadius: number // current pixel radius
  shockwaveAlpha: number // 0 to 1
  shockwaveThickness: number
  cameraImpulse: {
    x: number
    y: number
    z: number
    pitch: number
    roll: number
  }
  photoDisplacements: Map<string, { x: number; y: number; z: number }>
}

interface ActiveClimaxEvent {
  climaxTime: number // Timestamp of the exact explosion flash
  attractionStartTime: number
  flashStartTime: number
  expansionStartTime: number
  recoveryStartTime: number
  endTime: number
  attractionDuration: number
  flashDuration: number
  expansionDuration: number
  recoveryDuration: number
}

export class UniverseSupernovaManager {
  private isClient: boolean
  private activeEvent: ActiveClimaxEvent | null = null
  private manualTriggerTimestamp: number | null = null
  private triggeredHistory: Set<number> = new Set()
  private lastTime: number = 0

  // Real-time audio energy trackers (for live playback when pre-analysis is omitted)
  private shortTermEma: number = 0.3
  private longTermEma: number = 0.3
  private lastAutoClimaxTime: number = -999
  private totalEventsTriggered: number = 0

  constructor() {
    this.isClient = typeof window !== 'undefined'
  }

  /**
   * Reset active climax state and history (on seek, scrub, track change)
   */
  public reset(): void {
    this.activeEvent = null
    this.manualTriggerTimestamp = null
    this.triggeredHistory.clear()
    this.shortTermEma = 0.3
    this.longTermEma = 0.3
    this.lastAutoClimaxTime = -999
    this.totalEventsTriggered = 0
  }

  /**
   * Manually trigger a preview supernova immediately at current timestamp
   */
  public triggerManual(currentTime: number, config: UniverseSupernovaConfig = DEFAULT_UNIVERSE_SUPERNOVA): void {
    const attractionDuration = 1.35
    const flashDuration = 0.32
    const expansionDuration = 1.15
    const recoveryDuration = Math.max(1.0, config.recoveryDuration || 2.5)

    const climaxTime = currentTime + attractionDuration

    this.activeEvent = {
      climaxTime,
      attractionStartTime: currentTime,
      flashStartTime: climaxTime,
      expansionStartTime: climaxTime + flashDuration,
      recoveryStartTime: climaxTime + flashDuration + expansionDuration,
      endTime: climaxTime + flashDuration + expansionDuration + recoveryDuration,
      attractionDuration,
      flashDuration,
      expansionDuration,
      recoveryDuration,
    }

    this.manualTriggerTimestamp = currentTime
  }

  /**
   * Determine if a climax should trigger at this moment
   */
  private checkClimaxTrigger(
    currentTime: number,
    climaxTimestamps: number[] | undefined,
    bands: NormalizedAudioBands | undefined,
    config: UniverseSupernovaConfig,
    profile: MusicMovementProfile = 'balanced-cinematic'
  ): boolean {
    if (!config.enabled) return false

    // Check maximum events per track limit
    const maxEvents = config.maxEventsPerTrack || 3
    if (this.totalEventsTriggered >= maxEvents) return false

    // Cooldown verification
    const cooldown = config.cooldownDuration || 12.0
    if (currentTime - this.lastAutoClimaxTime < cooldown) return false

    const attractionDuration = 1.45
    const flashDuration = 0.32
    const expansionDuration = 1.18
    const recoveryDuration = Math.max(1.0, config.recoveryDuration || 2.5)

    // 1. Check Pre-Analyzed Deterministic Climax Timestamps (Priority for Perfect Synchronization)
    if (climaxTimestamps && climaxTimestamps.length > 0) {
      for (const targetClimax of climaxTimestamps) {
        // Climax anticipated within attraction window
        const leadTime = targetClimax - currentTime
        if (leadTime > 0 && leadTime <= attractionDuration && !this.triggeredHistory.has(targetClimax)) {
          this.triggeredHistory.add(targetClimax)
          this.totalEventsTriggered++
          this.lastAutoClimaxTime = targetClimax

          this.activeEvent = {
            climaxTime: targetClimax,
            attractionStartTime: targetClimax - attractionDuration,
            flashStartTime: targetClimax,
            expansionStartTime: targetClimax + flashDuration,
            recoveryStartTime: targetClimax + flashDuration + expansionDuration,
            endTime: targetClimax + flashDuration + expansionDuration + recoveryDuration,
            attractionDuration,
            flashDuration,
            expansionDuration,
            recoveryDuration,
          }
          return true
        }
      }
    }

    // 2. Real-Time Audio Signal Climax Detector (Fallback or Live Playback)
    if (bands) {
      const bass = bands.bass || 0
      const subBass = bands.subBass || 0
      const mid = bands.mid || 0
      const currentEnergy =
        bands.overall !== undefined ? bands.overall : bass * 0.45 + subBass * 0.35 + mid * 0.2

      // Profile sensitivity multiplier
      let sensitivityMult = 1.55 // balanced
      if (config.triggerSensitivity === 'low') sensitivityMult = 1.85
      if (config.triggerSensitivity === 'high') sensitivityMult = 1.35
      if (profile === 'melody-ambient') sensitivityMult += 0.25 // More conservative on calm tracks

      this.shortTermEma = this.shortTermEma * 0.88 + currentEnergy * 0.12
      this.longTermEma = this.longTermEma * 0.985 + currentEnergy * 0.015

      const isSubstantialSurge = this.shortTermEma > this.longTermEma * sensitivityMult
      const isStrongBass = bass > 0.62

      if (isSubstantialSurge && isStrongBass && currentTime > 5.0) {
        const climaxTime = currentTime + attractionDuration
        this.totalEventsTriggered++
        this.lastAutoClimaxTime = climaxTime

        this.activeEvent = {
          climaxTime,
          attractionStartTime: currentTime,
          flashStartTime: climaxTime,
          expansionStartTime: climaxTime + flashDuration,
          recoveryStartTime: climaxTime + flashDuration + expansionDuration,
          endTime: climaxTime + flashDuration + expansionDuration + recoveryDuration,
          attractionDuration,
          flashDuration,
          expansionDuration,
          recoveryDuration,
        }
        return true
      }
    }

    return false
  }

  /**
   * Evaluate the complete Supernova State Machine for current frame
   */
  public evaluate(
    currentTime: number,
    photos: { id: string; x: number; y: number; z: number }[],
    config: UniverseSupernovaConfig = DEFAULT_UNIVERSE_SUPERNOVA,
    climaxTimestamps?: number[],
    bands?: NormalizedAudioBands,
    profile: MusicMovementProfile = 'balanced-cinematic'
  ): SupernovaFrameState {
    const defaultState: SupernovaFrameState = {
      phase: 'idle',
      progress: 0,
      overallIntensity: 0,
      flashAlpha: 0,
      shockwaveRadius: 0,
      shockwaveAlpha: 0,
      shockwaveThickness: 0,
      cameraImpulse: { x: 0, y: 0, z: 0, pitch: 0, roll: 0 },
      photoDisplacements: new Map(),
    }

    if (!config.enabled) {
      this.activeEvent = null
      return defaultState
    }

    // Scrub / Seek detection
    if (currentTime < this.lastTime || Math.abs(currentTime - this.lastTime) > 0.8) {
      if (this.activeEvent && (currentTime < this.activeEvent.attractionStartTime || currentTime > this.activeEvent.endTime)) {
        this.activeEvent = null
      }
    }
    this.lastTime = currentTime

    // Check trigger if idle
    if (!this.activeEvent || currentTime > this.activeEvent.endTime) {
      this.activeEvent = null
      this.checkClimaxTrigger(currentTime, climaxTimestamps, bands, config, profile)
    }

    if (!this.activeEvent) {
      return defaultState
    }

    const evt = this.activeEvent
    const intensity = (config.explosionIntensity || 75) / 100
    const attractionStrength = (config.attractionStrength || 60) / 100
    const maxRadius = config.shockwaveRadius || 750
    const flashMax = (config.flashBrightness || 80) / 100
    const cameraImpact = (config.cameraImpact || 65) / 100

    // Center coordinates in 3D universe
    const centerPoint = { x: 0, y: 0, z: -400 }

    const displacements = new Map<string, { x: number; y: number; z: number }>()
    const cameraImpulse = { x: 0, y: 0, z: 0, pitch: 0, roll: 0 }

    let phase: SupernovaPhase = 'idle'
    let progress = 0
    let flashAlpha = 0
    let shockwaveRadius = 0
    let shockwaveAlpha = 0
    let shockwaveThickness = 0
    let overallIntensity = 0

    // ==========================================
    // PHASE A: BLACKHOLE ATTRACTION
    // ==========================================
    if (currentTime >= evt.attractionStartTime && currentTime < evt.flashStartTime) {
      phase = 'attraction'
      progress = Math.min(1.0, Math.max(0, (currentTime - evt.attractionStartTime) / evt.attractionDuration))
      overallIntensity = progress * 0.45 * intensity

      // Controlled acceleration toward central point
      const pullFactor = Math.pow(progress, 2.0) * attractionStrength * 0.82

      // Camera eases slightly inward toward the vortex
      cameraImpulse.z = 130 * pullFactor * cameraImpact
      cameraImpulse.pitch = Math.sin(progress * Math.PI) * 0.015 * cameraImpact

      for (let i = 0; i < photos.length; i++) {
        const p = photos[i]
        const dx = centerPoint.x - p.x
        const dy = centerPoint.y - p.y
        const dz = centerPoint.z - p.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        // Preserve photo identity: never compress completely into a single zero point (minimum radius 75px)
        const safePull = Math.min(pullFactor, Math.max(0, (dist - 75) / Math.max(1, dist)))

        displacements.set(p.id, {
          x: dx * safePull,
          y: dy * safePull,
          z: dz * safePull,
        })
      }
    }

    // ==========================================
    // PHASE B: SUPERNOVA FLASH
    // ==========================================
    else if (currentTime >= evt.flashStartTime && currentTime < evt.expansionStartTime) {
      phase = 'supernova'
      progress = Math.min(1.0, Math.max(0, (currentTime - evt.flashStartTime) / evt.flashDuration))
      overallIntensity = 1.0 * intensity

      // Explosive flash: Rapid rise peaking at progress=0.15, fast decay (no whiteout)
      const flashEnvelope = Math.sin(progress * Math.PI)
      flashAlpha = Math.min(0.88, flashEnvelope * flashMax)

      // Shockwave ring starts expanding rapidly
      shockwaveRadius = Math.max(20, progress * maxRadius * 0.35)
      shockwaveAlpha = (1.0 - progress * 0.4) * flashMax
      shockwaveThickness = Math.max(4, 18 * (1.0 - progress))

      // Direct camera impulse kick
      const kick = Math.sin(progress * Math.PI) * cameraImpact
      cameraImpulse.z = -180 * kick
      cameraImpulse.pitch = (Math.sin(currentTime * 36) * 0.04) * kick
      cameraImpulse.roll = (Math.cos(currentTime * 32) * 0.025) * kick

      // Photos initiate explosive breakout from contracted positions
      for (let i = 0; i < photos.length; i++) {
        const p = photos[i]
        const angle = (i / Math.max(1, photos.length)) * Math.PI * 2 + (i % 2 === 0 ? 0.4 : -0.4)
        const elevation = Math.sin(i * 1.8) * 0.55
        const burstSpeed = (0.75 + (i % 3) * 0.2) * intensity * 380 * progress

        const bx = Math.cos(angle) * Math.cos(elevation) * burstSpeed
        const by = Math.sin(angle) * Math.cos(elevation) * burstSpeed
        const bz = Math.sin(elevation) * burstSpeed * 0.7

        displacements.set(p.id, { x: bx, y: by, z: bz })
      }
    }

    // ==========================================
    // PHASE C: RADIAL EXPANSION
    // ==========================================
    else if (currentTime >= evt.expansionStartTime && currentTime < evt.recoveryStartTime) {
      phase = 'expansion'
      progress = Math.min(1.0, Math.max(0, (currentTime - evt.expansionStartTime) / evt.expansionDuration))
      overallIntensity = (1.0 - progress * 0.5) * intensity

      // Lingering subtle flash glow decaying to 0
      flashAlpha = Math.max(0, (1.0 - progress * 2.2) * 0.35 * flashMax)

      // Shockwave sweeps completely across the frame with cubic deceleration
      const easeRadius = 1 - Math.pow(1 - progress, 2.5)
      shockwaveRadius = maxRadius * 0.35 + easeRadius * (maxRadius * 0.65)
      shockwaveAlpha = (1.0 - progress) * flashMax * 0.85
      shockwaveThickness = Math.max(2, 10 * (1.0 - progress))

      // Residual camera impulse decaying
      const easeCam = (1.0 - progress) * cameraImpact
      cameraImpulse.z = -60 * easeCam
      cameraImpulse.pitch = Math.sin(currentTime * 18) * 0.015 * easeCam

      // Photos propelled along radial 3D trajectories
      const easeExplosion = 1 - Math.pow(1 - progress, 2.6)
      for (let i = 0; i < photos.length; i++) {
        const p = photos[i]
        const angle = (i / Math.max(1, photos.length)) * Math.PI * 2 + (i % 2 === 0 ? 0.4 : -0.4)
        const elevation = Math.sin(i * 1.8) * 0.55
        const maxDist = (0.75 + (i % 3) * 0.25) * intensity * 560

        const ex = Math.cos(angle) * Math.cos(elevation) * maxDist * easeExplosion
        const ey = Math.sin(angle) * Math.cos(elevation) * maxDist * easeExplosion
        const ez = Math.sin(elevation) * maxDist * 0.7 * easeExplosion

        displacements.set(p.id, { x: ex, y: ey, z: ez })
      }
    }

    // ==========================================
    // PHASE D: RECOVERY & RETURN TO NORMAL FLIGHT
    // ==========================================
    else if (currentTime >= evt.recoveryStartTime && currentTime <= evt.endTime) {
      phase = 'recovery'
      progress = Math.min(1.0, Math.max(0, (currentTime - evt.recoveryStartTime) / evt.recoveryDuration))
      overallIntensity = (1.0 - progress) * 0.25 * intensity

      // Smooth cosine ease returning smoothly to normal planned spatial coordinates
      const decay = Math.cos(progress * (Math.PI / 2))

      for (let i = 0; i < photos.length; i++) {
        const p = photos[i]
        const angle = (i / Math.max(1, photos.length)) * Math.PI * 2 + (i % 2 === 0 ? 0.4 : -0.4)
        const elevation = Math.sin(i * 1.8) * 0.55
        const maxDist = (0.75 + (i % 3) * 0.25) * intensity * 560

        const rx = Math.cos(angle) * Math.cos(elevation) * maxDist * decay
        const ry = Math.sin(angle) * Math.cos(elevation) * maxDist * decay
        const rz = Math.sin(elevation) * maxDist * 0.7 * decay

        displacements.set(p.id, { x: rx, y: ry, z: rz })
      }
    }

    return {
      phase,
      progress,
      overallIntensity,
      flashAlpha,
      shockwaveRadius,
      shockwaveAlpha,
      shockwaveThickness,
      cameraImpulse,
      photoDisplacements: displacements,
    }
  }

  /**
   * Render Canvas 2D Supernova shockwave, radial rays, and luminous core flash
   */
  public renderCanvasEffects(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    state: SupernovaFrameState,
    config: UniverseSupernovaConfig = DEFAULT_UNIVERSE_SUPERNOVA
  ): void {
    if (!this.isClient || !ctx || !config.enabled || state.phase === 'idle') return

    const cx = width / 2
    const cy = height / 2

    ctx.save()

    // 1. Expanding Circular Shockwave Dual-Ring
    if (state.shockwaveAlpha > 0.01 && state.shockwaveRadius > 5) {
      ctx.globalCompositeOperation = 'lighter'

      // A. Outer Chromatic Violet / Magenta Glow Ring
      ctx.beginPath()
      ctx.arc(cx, cy, state.shockwaveRadius + 4, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(192, 132, 252, ${Math.min(0.75, state.shockwaveAlpha * 0.85)})` // Radiant Orchid
      ctx.lineWidth = Math.max(2, state.shockwaveThickness * 1.6)
      ctx.stroke()

      // B. Inner Electric Cyan / Pure Core Ring
      ctx.beginPath()
      ctx.arc(cx, cy, state.shockwaveRadius, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(0, 240, 255, ${Math.min(0.95, state.shockwaveAlpha)})` // Electric Cyan
      ctx.lineWidth = Math.max(1.5, state.shockwaveThickness)
      ctx.stroke()
    }

    // 2. Luminous Radial Light Flash & Cosmic Core Burst
    if (state.flashAlpha > 0.01) {
      ctx.globalCompositeOperation = 'screen'

      const maxCoreRadius = Math.max(width, height) * 0.65
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxCoreRadius)

      const alpha = Math.min(0.9, state.flashAlpha)
      // Core: Brilliant white-blue
      grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`)
      // Mid 1: Luminous Electric Cyan
      grad.addColorStop(0.18, `rgba(0, 240, 255, ${alpha * 0.75})`)
      // Mid 2: Cosmic Violet
      grad.addColorStop(0.45, `rgba(168, 85, 247, ${alpha * 0.45})`)
      // Outer: Deep Indigo fade
      grad.addColorStop(0.85, `rgba(59, 130, 246, ${alpha * 0.15})`)
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)')

      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)
    }

    // 3. Blackhole Attraction Gravitational Distortion Hint
    if (state.phase === 'attraction' && state.progress > 0.3) {
      ctx.globalCompositeOperation = 'lighter'
      const vortexRadius = Math.max(80, (1.0 - state.progress * 0.5) * 220)
      const vGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, vortexRadius)
      const vAlpha = state.progress * 0.35 * (config.attractionStrength / 100)

      vGrad.addColorStop(0, `rgba(0, 240, 255, ${vAlpha})`)
      vGrad.addColorStop(0.6, `rgba(147, 51, 234, ${vAlpha * 0.5})`)
      vGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

      ctx.fillStyle = vGrad
      ctx.beginPath()
      ctx.arc(cx, cy, vortexRadius, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }
}

export const universeSupernovaManager = new UniverseSupernovaManager()
