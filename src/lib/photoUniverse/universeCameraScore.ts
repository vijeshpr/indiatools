/**
 * IndiaTools — Floating Photo Universe 2.0
 * Timestamped Camera Score Generator & Segment Interpolator
 * Deterministic planned route through the entire audio track
 */

import {
  UniversePhoto,
  PhotoUniverseStudioConfig,
  UniverseAudioAnalysisResult,
  CameraScoreSegment,
  TimestampedCameraScore,
  MusicMovementProfile,
  CinematicShotType,
  MusicalMotivation,
} from './photoUniverseTypes.ts'

export class UniverseCameraScoreGenerator {
  /**
   * Builds the timestamped camera score across the entire audio track
   */
  public generateScore(
    photos: UniversePhoto[],
    config: PhotoUniverseStudioConfig,
    analysis: UniverseAudioAnalysisResult,
    totalDurationSec?: number
  ): TimestampedCameraScore {
    const duration = Math.max(10, totalDurationSec || analysis.durationSec || 30)
    const photoCount = photos.length

    if (photoCount === 0) {
      return {
        totalDuration: duration,
        segments: [],
        profile: analysis.detectedProfile,
        generatedAt: Date.now(),
      }
    }

    // Determine target order
    let order: number[] = []
    if (config.directorMode === 'manual' && config.manualOrder.length > 0) {
      for (const id of config.manualOrder) {
        const idx = photos.findIndex((p) => p.id === id)
        if (idx !== -1 && !order.includes(idx)) order.push(idx)
      }
      for (let i = 0; i < photoCount; i++) {
        if (!order.includes(i)) order.push(i)
      }
    } else {
      // Automatic director: progressive sequence [0, 1, ..., N-1]
      order = photos.map((_, i) => i)
    }

    // Determine profile and hold duration
    const profile: MusicMovementProfile =
      !config.autoProfileEnabled && config.profileOverride !== 'auto'
        ? config.profileOverride
        : analysis.detectedProfile

    // Base hold duration modulated by profile and user photoFocusDuration setting
    let baseHold = config.photoFocusDuration || 4.0
    if (profile === 'melody-ambient') {
      baseHold = Math.max(baseHold, 4.6)
    } else if (profile === 'soft-vocal') {
      baseHold = Math.max(baseHold, 4.0)
    } else if (profile === 'bass-heavy') {
      baseHold = Math.min(baseHold, 3.2)
    }

    // Segment pacing breakdown modulated by transition frequency
    const isRelaxed = config.transitionFrequency === 'relaxed'
    const isDynamic = config.transitionFrequency === 'dynamic'

    const approachDur = isRelaxed ? 2.8 : isDynamic ? 1.8 : 2.4
    const settleDur = 1.0
    const holdDur = baseHold
    const departureDur = isRelaxed ? 2.0 : isDynamic ? 1.4 : 1.8
    const transitionDur = isRelaxed ? 2.4 : isDynamic ? 1.4 : 2.0

    const segments: CameraScoreSegment[] = []
    let currentTime = 0
    let step = 0

    while (currentTime < duration) {
      const photoIdx = order[step % order.length]
      const photo = photos[photoIdx]

      // Determine segment duration and subtle variations based on local timeline energy
      const localEnergyPoint = analysis.timelinePoints.find(
        (tp) => tp.timestamp >= currentTime
      )
      const localEnergy = localEnergyPoint ? localEnergyPoint.energy : analysis.averageEnergy

      // Alternate subtle framing offset: -0.08 to +0.08 of screen width (rule of thirds elegance)
      const side = step % 2 === 0 ? 1 : -1
      const framingOffset = {
        x: side * (0.04 + (step % 3) * 0.02),
        y: ((step % 4) - 1.5) * 0.02,
      }

      // Musical Motivation & Shot Type Selection
      let motivation: MusicalMotivation = 'phrase-boundary'
      let shotType: CinematicShotType = 'cinematic-approach'

      const isIntro = currentTime < 4.5 && localEnergy < 0.48
      const isOutro = currentTime > duration - 6.0
      const isNearClimax = analysis.climaxTimestamps?.some(
        (ct) => ct >= currentTime + 1.2 && ct <= currentTime + 6.0
      )

      if (isIntro) {
        shotType = 'hero-reveal'
        motivation = 'intro-emergence'
      } else if (isOutro) {
        shotType = 'emotional-hold'
        motivation = 'outro-linger'
      } else if (isNearClimax) {
        shotType = 'climax-reveal'
        motivation = 'drop-climax'
      } else if (profile === 'melody-ambient' || profile === 'soft-vocal') {
        const cycle = step % 3
        shotType = cycle === 0 ? 'orbital-drift' : cycle === 1 ? 'emotional-hold' : 'cinematic-approach'
        motivation = 'melody-swell'
      } else if (profile === 'steady-rhythm' || profile === 'bass-heavy') {
        const cycle = step % 3
        shotType = cycle === 0 ? 'focus-handoff' : cycle === 1 ? 'cinematic-approach' : 'orbital-drift'
        motivation = 'rhythm-cadence'
      } else {
        const cycle = step % 4
        shotType =
          cycle === 0
            ? 'cinematic-approach'
            : cycle === 1
            ? 'orbital-drift'
            : cycle === 2
            ? 'hero-reveal'
            : 'focus-handoff'
        motivation = 'phrase-boundary'
      }

      // Dynamic Hold Modulation based on musical phrasing
      let dynamicHold = holdDur
      if (motivation === 'intro-emergence') {
        dynamicHold = Math.max(holdDur, 4.8)
      } else if (motivation === 'outro-linger') {
        dynamicHold = Math.max(holdDur, 5.0)
      } else if (motivation === 'melody-swell') {
        dynamicHold = holdDur * 1.15
      } else if (motivation === 'rhythm-cadence') {
        dynamicHold = Math.max(2.4, holdDur * 0.88)
      }

      // Transition Frequency modifier
      if (isRelaxed) {
        dynamicHold *= 1.3
      } else if (isDynamic) {
        dynamicHold *= 0.72
      }

      const segDuration = approachDur + settleDur + dynamicHold + departureDur + transitionDur

      segments.push({
        segmentIndex: step,
        startTime: currentTime,
        endTime: currentTime + segDuration,
        duration: segDuration,
        photoIndex: photoIdx,
        photoId: photo.id,
        shotType,
        motivation,
        approachDuration: approachDur,
        settleDuration: settleDur,
        holdDuration: dynamicHold,
        departureDuration: departureDur,
        transitionDuration: transitionDur,
        framingOffset,
        targetEnergy: localEnergy,
        shakeAllowed: true, // evaluated by sub-phase during camera evaluation
        visualEntrance: {
          startOpacity: shotType === 'hero-reveal' ? 0.25 : 0.45,
          startScale: shotType === 'hero-reveal' ? 0.88 : 0.94,
          targetOpacity: 1.0,
          targetScale: 1.0,
        },
      })

      currentTime += segDuration
      step++
    }

    return {
      totalDuration: duration,
      segments,
      profile,
      generatedAt: Date.now(),
    }
  }

  /**
   * Find active score segment for given timestamp
   */
  public getSegmentAtTime(
    score: TimestampedCameraScore,
    currentTime: number
  ): { segment: CameraScoreSegment; progress: number; subPhase: 'approach' | 'settle' | 'hold' | 'departure' | 'transition'; subProgress: number } | null {
    if (!score || score.segments.length === 0) return null

    // Wrap around for seamless looping if past duration
    const clampedTime = currentTime % score.totalDuration
    const segment = score.segments.find(
      (s) => clampedTime >= s.startTime && clampedTime < s.endTime
    ) || score.segments[score.segments.length - 1]

    const elapsed = Math.max(0, clampedTime - segment.startTime)
    const progress = Math.min(1.0, elapsed / segment.duration)

    // Evaluate sub-phase
    const tApproach = segment.approachDuration
    const tSettle = tApproach + segment.settleDuration
    const tHold = tSettle + segment.holdDuration
    const tDeparture = tHold + segment.departureDuration

    let subPhase: 'approach' | 'settle' | 'hold' | 'departure' | 'transition' = 'hold'
    let subProgress = 0

    if (elapsed < tApproach) {
      subPhase = 'approach'
      subProgress = elapsed / tApproach
    } else if (elapsed < tSettle) {
      subPhase = 'settle'
      subProgress = (elapsed - tApproach) / segment.settleDuration
    } else if (elapsed < tHold) {
      subPhase = 'hold'
      subProgress = (elapsed - tSettle) / segment.holdDuration
    } else if (elapsed < tDeparture) {
      subPhase = 'departure'
      subProgress = (elapsed - tHold) / segment.departureDuration
    } else {
      subPhase = 'transition'
      subProgress = (elapsed - tDeparture) / segment.transitionDuration
    }

    return { segment, progress, subPhase, subProgress }
  }
}

export const universeCameraScoreGenerator = new UniverseCameraScoreGenerator()
