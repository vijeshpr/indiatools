/**
 * IndiaTools — SonicCam
 * Beat-Synced Multi-Region Cinematic Sequencer & Crop Calculator
 */

import {
  ImageRegion,
  SonicCamStudioConfig,
  BeatMarker,
  SonicTransitionType,
  NormalizedAudioBands,
} from './sonicCamTypes.ts'

export interface CropRect {
  sx: number
  sy: number
  sw: number
  sh: number
}

export interface SequencerFrameState {
  currentRegion: ImageRegion | null // null means full image
  previousRegion: ImageRegion | null
  transitionProgress: number // 0 (start of transition) to 1 (transition complete)
  transitionType: SonicTransitionType
  isFullImage: boolean
  cropRect: CropRect
  previousCropRect: CropRect | null
  shakeX: number
  shakeY: number
  shakeRotationRad: number
  zoomBoost: number
  flashBrightness: number // 0 to 1
}

export class SonicCamSequencer {
  private smoothBass = 0
  private bassShakeDecay = 0

  /**
   * Resets audio smoothing state
   */
  public reset(): void {
    this.smoothBass = 0
    this.bassShakeDecay = 0
  }

  /**
   * Primary Sequencer Evaluation:
   * Maps current playback time to active region, transition state, crop rect, and bass shake.
   */
  public evaluateFrame(
    config: SonicCamStudioConfig,
    currentTime: number,
    duration: number,
    imgWidth: number,
    imgHeight: number,
    canvasWidth: number,
    canvasHeight: number,
    bands: NormalizedAudioBands
  ): SequencerFrameState {
    const regions = config.regions
    const dur = duration > 0 ? duration : 30
    const markers = config.beatMarkers

    // Update bass shake accumulator
    this.updateBassShake(config, bands)

    // Full image fallback if no regions defined
    if (!regions || regions.length === 0) {
      const fullCrop = this.calculateFitCrop(
        0,
        0,
        imgWidth,
        imgHeight,
        imgWidth,
        imgHeight,
        canvasWidth,
        canvasHeight
      )
      return {
        currentRegion: null,
        previousRegion: null,
        transitionProgress: 1,
        transitionType: config.transition,
        isFullImage: true,
        cropRect: fullCrop,
        previousCropRect: null,
        shakeX: this.bassShakeDecay * (config.bassShake.maxDisplacementPx || 12),
        shakeY: this.bassShakeDecay * (config.bassShake.maxDisplacementPx * 0.7),
        shakeRotationRad:
          (this.bassShakeDecay * (config.bassShake.maxRotationDeg || 0.8) * Math.PI) / 180,
        zoomBoost: config.bassShake.zoomImpulseEnabled ? this.bassShakeDecay * 0.05 : 0,
        flashBrightness: 0,
      }
    }

    // 1. Determine Schedule of Shot Segments along Timeline
    const schedule = this.buildTimelineSchedule(config, dur, regions, markers)

    // 2. Find active shot segment for currentTime
    let activeIdx = 0
    while (
      activeIdx < schedule.length - 1 &&
      schedule[activeIdx + 1].startTime <= currentTime
    ) {
      activeIdx++
    }

    const currentShot = schedule[activeIdx]
    const prevShot = activeIdx > 0 ? schedule[activeIdx - 1] : null

    // Time elapsed inside current shot
    const timeInShot = Math.max(0, currentTime - currentShot.startTime)
    const transDur = config.transitionDurationSec || 0.22

    let transitionProgress = transDur > 0 ? Math.min(1, timeInShot / transDur) : 1
    if (config.transition === 'instant-cut') {
      transitionProgress = 1
    }

    // Calculate crop for active region (or full image)
    const currentRegion = currentShot.region
    const isFullImage = currentShot.isFullImage

    let targetCrop: CropRect
    if (isFullImage || !currentRegion) {
      targetCrop = this.calculateFitCrop(
        0,
        0,
        imgWidth,
        imgHeight,
        imgWidth,
        imgHeight,
        canvasWidth,
        canvasHeight
      )
    } else {
      const regPxX = currentRegion.x * imgWidth
      const regPxY = currentRegion.y * imgHeight
      const regPxW = currentRegion.width * imgWidth
      const regPxH = currentRegion.height * imgHeight

      targetCrop = this.calculateFitCrop(
        regPxX,
        regPxY,
        regPxW,
        regPxH,
        imgWidth,
        imgHeight,
        canvasWidth,
        canvasHeight
      )
    }

    // Calculate crop for previous shot if transitioning
    let prevCrop: CropRect | null = null
    if (prevShot && transitionProgress < 1) {
      if (prevShot.isFullImage || !prevShot.region) {
        prevCrop = this.calculateFitCrop(
          0,
          0,
          imgWidth,
          imgHeight,
          imgWidth,
          imgHeight,
          canvasWidth,
          canvasHeight
        )
      } else {
        const pr = prevShot.region
        prevCrop = this.calculateFitCrop(
          pr.x * imgWidth,
          pr.y * imgHeight,
          pr.width * imgWidth,
          pr.height * imgHeight,
          imgWidth,
          imgHeight,
          canvasWidth,
          canvasHeight
        )
      }
    }

    // Additional inner camera movement (subtle push or drift within shot)
    let innerZoom = 1.0
    if (config.innerMotion.enabled) {
      const motionProgress = Math.min(1, timeInShot / Math.max(0.5, currentShot.duration))
      if (config.innerMotion.mode === 'subtle-push') {
        innerZoom = 1.0 + motionProgress * (config.innerMotion.intensity / 100) * 0.08
      } else if (config.innerMotion.mode === 'handheld') {
        innerZoom = 1.0 + Math.sin(currentTime * 3) * 0.015
      }
    }

    // Snap-zoom punch on cut
    let zoomBoost = 0
    if (config.transition === 'snap-zoom' && transitionProgress < 1) {
      // Punch up at start of transition then settle
      zoomBoost = (1 - transitionProgress) * 0.12
    }
    if (config.bassShake.zoomImpulseEnabled) {
      zoomBoost += this.bassShakeDecay * 0.04
    }

    // Flash cut brightness
    let flashBrightness = 0
    if (config.transition === 'flash-cut' && transitionProgress < 0.6) {
      flashBrightness = (1 - transitionProgress / 0.6) * 0.35
    }

    const shakeDisp = config.bassShake.enabled ? config.bassShake.maxDisplacementPx || 12 : 0
    const shakeRot = config.bassShake.enabled ? config.bassShake.maxRotationDeg || 0.8 : 0

    return {
      currentRegion,
      previousRegion: prevShot?.region || null,
      transitionProgress,
      transitionType: config.transition,
      isFullImage,
      cropRect: targetCrop,
      previousCropRect: prevCrop,
      shakeX: (Math.sin(currentTime * 45) * this.bassShakeDecay * shakeDisp),
      shakeY: (Math.cos(currentTime * 38) * this.bassShakeDecay * shakeDisp * 0.75),
      shakeRotationRad:
        (Math.sin(currentTime * 32) * this.bassShakeDecay * shakeRot * Math.PI) / 180,
      zoomBoost: (innerZoom - 1.0) + zoomBoost,
      flashBrightness,
    }
  }

  /**
   * Generates a deterministic sequence of shots across song duration
   */
  private buildTimelineSchedule(
    config: SonicCamStudioConfig,
    durationSec: number,
    regions: ImageRegion[],
    beatMarkers: BeatMarker[]
  ): {
    startTime: number
    duration: number
    region: ImageRegion | null
    isFullImage: boolean
  }[] {
    const schedule: {
      startTime: number
      duration: number
      region: ImageRegion | null
      isFullImage: boolean
    }[] = []

    const minDur = Math.max(0.3, config.minShotDurationSec || 0.4)
    const maxDur = Math.max(minDur + 0.5, config.maxShotDurationSec || 3.5)

    // Opening shot (optional full image intro)
    let t = 0
    if (config.fullImageIntroOutro) {
      const introDur = Math.min(2.5, durationSec * 0.1)
      schedule.push({
        startTime: 0,
        duration: introDur,
        region: null,
        isFullImage: true,
      })
      t += introDur
    }

    // If beat-driven mode and beat markers exist
    if (
      beatMarkers.length > 0 &&
      config.sequencerMode !== 'manual'
    ) {
      const validBeats = beatMarkers
        .map((b) => b.timeSec)
        .filter((bt) => bt >= t && bt < durationSec - (config.fullImageIntroOutro ? 2.0 : 0.5))
        .sort((a, b) => a - b)

      const beatStep = (config.sequencerMode as string) === 'every-n-beats' ? Math.max(1, config.beatInterval) : 1
      let shotCount = 0

      for (let i = 0; i < validBeats.length; i += beatStep) {
        const beatTime = validBeats[i]
        const nextBeatTime = i + beatStep < validBeats.length ? validBeats[i + beatStep] : durationSec
        let shotDur = Math.max(minDur, nextBeatTime - beatTime)

        // Interleave full image every N shots if configured
        const isInterlude =
          config.fullImageEveryNShots > 0 &&
          shotCount > 0 &&
          shotCount % config.fullImageEveryNShots === 0

        const regIndex =
          config.sequencerMode === 'random'
            ? Math.floor((Math.sin(shotCount * 9301 + 49297) * 0.5 + 0.5) * regions.length)
            : shotCount % regions.length

        schedule.push({
          startTime: beatTime,
          duration: shotDur,
          region: isInterlude ? null : regions[regIndex],
          isFullImage: isInterlude,
        })

        shotCount++
      }
    } else {
      // Periodic rhythmic interval schedule
      let shotCount = 0
      const interval = Math.max(minDur, Math.min(maxDur, (config.beatInterval || 2) * 0.5))

      while (t < durationSec - (config.fullImageIntroOutro ? 2.0 : 0.2)) {
        const isInterlude =
          config.fullImageEveryNShots > 0 &&
          shotCount > 0 &&
          shotCount % config.fullImageEveryNShots === 0

        const regIndex =
          config.sequencerMode === 'random'
            ? Math.floor((Math.sin(shotCount * 9301 + 49297) * 0.5 + 0.5) * regions.length)
            : shotCount % regions.length

        const nextT = Math.min(durationSec, t + interval)
        schedule.push({
          startTime: t,
          duration: nextT - t,
          region: isInterlude ? null : regions[regIndex],
          isFullImage: isInterlude,
        })

        t = nextT
        shotCount++
      }
    }

    // Ending shot (optional full image outro)
    if (config.fullImageIntroOutro && schedule.length > 0) {
      const last = schedule[schedule.length - 1]
      const outroStart = Math.max(last.startTime + last.duration, durationSec - 2.5)
      if (outroStart < durationSec) {
        schedule.push({
          startTime: outroStart,
          duration: durationSec - outroStart,
          region: null,
          isFullImage: true,
        })
      }
    }

    // Fallback if empty
    if (schedule.length === 0) {
      schedule.push({
        startTime: 0,
        duration: durationSec,
        region: regions[0] || null,
        isFullImage: false,
      })
    }

    return schedule
  }

  /**
   * Calculates proper full-screen crop rectangle from source region to output canvas
   * Guarantees ZERO disproportionate stretching and ZERO exposed borders.
   */
  public calculateFitCrop(
    rx: number,
    ry: number,
    rw: number,
    rh: number,
    imgWidth: number,
    imgHeight: number,
    canvasWidth: number,
    canvasHeight: number
  ): CropRect {
    const targetAspect = canvasWidth / canvasHeight
    const regionAspect = rw / rh

    let cropW = rw
    let cropH = rh

    if (regionAspect > targetAspect) {
      // Region is wider than canvas -> crop width to match target aspect ratio
      cropW = rh * targetAspect
    } else {
      // Region is taller than canvas -> crop height to match target aspect ratio
      cropH = rw / targetAspect
    }

    // Center crop on region center
    const rcx = rx + rw / 2
    const rcy = ry + rh / 2

    let sx = rcx - cropW / 2
    let sy = rcy - cropH / 2

    // Clamp strictly within source image dimensions
    if (sx < 0) sx = 0
    if (sy < 0) sy = 0
    if (sx + cropW > imgWidth) {
      sx = Math.max(0, imgWidth - cropW)
    }
    if (sy + cropH > imgHeight) {
      sy = Math.max(0, imgHeight - cropH)
    }

    return {
      sx,
      sy,
      sw: cropW,
      sh: cropH,
    }
  }

  /**
   * Updates bass micro-shake energy and smooth decay
   */
  private updateBassShake(config: SonicCamStudioConfig, bands: NormalizedAudioBands): void {
    if (!config.bassShake.enabled) {
      this.bassShakeDecay = 0
      return
    }

    const sens = config.bassShake.bassSensitivity / 100
    const intensity = config.bassShake.intensity / 100

    // Trigger impulse on bass beat hit
    if (bands.isBeatHit && bands.bass > 0.45 * (1 - sens * 0.5)) {
      this.bassShakeDecay = Math.min(1.0, this.bassShakeDecay + bands.bass * intensity * 0.8)
    } else {
      // Smooth decay back to neutral
      const rec = Math.max(0.6, Math.min(0.95, config.bassShake.recoverySpeed || 0.85))
      this.bassShakeDecay *= rec
    }
  }
}

export const sonicCamSequencer = new SonicCamSequencer()
