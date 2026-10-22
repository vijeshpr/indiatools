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

    // Segment pacing breakdown
    const approachDur = 2.4
    const settleDur = 1.0
    const holdDur = baseHold
    const departureDur = 1.8
    const transitionDur = 2.0
    const nominalSegmentDuration = approachDur + settleDur + holdDur + departureDur + transitionDur

    const segments: CameraScoreSegment[] = []
    let currentTime = 0
    let step = 0

    while (currentTime < duration + nominalSegmentDuration) {
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

      // Slightly extend holds during calm/quiet moments
      const dynamicHold = localEnergy < 0.3 ? holdDur * 1.2 : holdDur
      const segDuration = approachDur + settleDur + dynamicHold + departureDur + transitionDur

      segments.push({
        segmentIndex: step,
        startTime: currentTime,
        endTime: currentTime + segDuration,
        duration: segDuration,
        photoIndex: photoIdx,
        photoId: photo.id,
        approachDuration: approachDur,
        settleDuration: settleDur,
        holdDuration: dynamicHold,
        departureDuration: departureDur,
        transitionDuration: transitionDur,
        framingOffset,
        targetEnergy: localEnergy,
        shakeAllowed: true, // evaluated by sub-phase during camera evaluation
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
