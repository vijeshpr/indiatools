/**
 * IndiaTools — Memory Burst Studio
 * Multi-Photo Timeline Sequencer & Frame State Evaluator
 */

import {
  MemoryBurstPhoto,
  MemoryBurstStudioConfig,
  MemoryBurstTransitionStyle,
  MemoryBurstBeatMarker,
} from './memoryBurstTypes'
import { NormalizedAudioBands } from '../audioToVideo/types'

export interface MemoryBurstCropRect {
  sx: number
  sy: number
  sw: number
  sh: number
}

export interface MemoryBurstFrameState {
  currentPhoto: MemoryBurstPhoto | null
  previousPhoto: MemoryBurstPhoto | null
  currentPhotoIndex: number
  totalPhotos: number
  transitionProgress: number // 0.0 (cut onset) to 1.0 (settled)
  transitionStyle: MemoryBurstTransitionStyle
  scalePunch: number // 1.05 to 1.0
  bassShakeX: number
  bassShakeY: number
  flashOpacity: number
  flashType: 'white' | 'warm'
  isInterlude: boolean
}

export interface PhotoScheduleEntry {
  startTime: number
  duration: number
  photoIndex: number
  isInterlude: boolean
}

export class MemoryBurstSequencer {
  private bassShakeDecay = 0
  private lastUpdateTime = 0

  /**
   * Evaluates the active photo and effect state at a given playback time
   */
  public evaluateAtTime(
    config: MemoryBurstStudioConfig,
    currentTime: number,
    durationSec: number,
    bands: NormalizedAudioBands
  ): MemoryBurstFrameState {
    const photos = config.photos || []
    const totalPhotos = photos.length

    if (totalPhotos === 0) {
      return {
        currentPhoto: null,
        previousPhoto: null,
        currentPhotoIndex: -1,
        totalPhotos: 0,
        transitionProgress: 1,
        transitionStyle: config.transitionStyle,
        scalePunch: 1.0,
        bassShakeX: 0,
        bassShakeY: 0,
        flashOpacity: 0,
        flashType: config.flash?.type || 'white',
        isInterlude: false,
      }
    }

    // Update bass transient impulse & decay
    this.updateBassDecay(config, bands, currentTime)

    // Build timeline schedule
    const schedule = this.buildSchedule(config, durationSec, totalPhotos)
    if (schedule.length === 0) {
      return {
        currentPhoto: photos[0],
        previousPhoto: null,
        currentPhotoIndex: 0,
        totalPhotos,
        transitionProgress: 1,
        transitionStyle: config.transitionStyle,
        scalePunch: 1.0,
        bassShakeX: 0,
        bassShakeY: 0,
        flashOpacity: 0,
        flashType: config.flash?.type || 'white',
        isInterlude: false,
      }
    }

    // Locate active shot in timeline
    let activeIdx = 0
    while (
      activeIdx < schedule.length - 1 &&
      schedule[activeIdx + 1].startTime <= currentTime
    ) {
      activeIdx++
    }

    const currentEntry = schedule[activeIdx]
    const prevEntry = activeIdx > 0 ? schedule[activeIdx - 1] : null

    const currentPhoto = photos[currentEntry.photoIndex % totalPhotos]
    const previousPhoto = prevEntry ? photos[prevEntry.photoIndex % totalPhotos] : null

    // Time into current shot
    const timeInShot = Math.max(0, currentTime - currentEntry.startTime)
    const transDur = Math.max(0.01, config.transitionDurationSec || 0.18)

    // Calculate transition progress (0 to 1)
    let transitionProgress = transDur > 0 ? Math.min(1.0, timeInShot / transDur) : 1.0
    if (config.transitionStyle === 'instant-cut') {
      transitionProgress = 1.0
    }

    // Check Climax / Memory Rewind window
    const isClimaxMode = config.mode === 'memory-rewind' || config.climax?.enabled
    const climaxStart = config.climax?.startSec ?? 10.0
    const climaxEnd = climaxStart + (config.climax?.burstDurationSec ?? 8.0)
    const isInsideClimax = isClimaxMode && currentTime >= climaxStart && currentTime < climaxEnd

    // Resolve transition style (supports BKU Climax fade wipe / crossfade / random-shuffle)
    let transitionStyle =
      config.transitionStyle === 'random-shuffle'
        ? this.resolveShuffledTransition(activeIdx)
        : config.transitionStyle

    if (isInsideClimax) {
      if (config.climax?.fadeWipeEnabled) {
        transitionStyle = 'fade-wipe'
      } else if (config.climax?.crossfadeEnabled) {
        transitionStyle = 'smooth-crossfade'
      }
    }

    // Calculate cinematic scale punch (start ~105-107%, ease back to 100%)
    let scalePunch = 1.0
    const isPunchActive = config.scalePunch?.enabled || (isInsideClimax && config.climax?.zoomPunchEnabled)
    if (isPunchActive) {
      const punchMax = config.scalePunch?.startScale || 1.07
      const intensityNorm = (config.scalePunch?.intensity || 70) / 100
      const punchDelta = (punchMax - 1.0) * intensityNorm
      // Smooth decay across first 0.28s of shot
      const punchProg = Math.min(1.0, timeInShot / 0.28)
      const easePunch = Math.pow(1.0 - punchProg, 2)
      scalePunch = 1.0 + punchDelta * easePunch
    }

    // Flash effect on cut
    let flashOpacity = 0
    const isFlashActive = config.flash?.enabled || (isInsideClimax && config.climax?.flashEnabled)
    if (isFlashActive) {
      const flashDur = config.flash?.durationSec || 0.12
      if (timeInShot < flashDur) {
        const flashProg = timeInShot / flashDur
        const baseOpacity = config.flash?.opacity || 0.3
        flashOpacity = (1.0 - flashProg) * baseOpacity
      }
    }

    // Bass micro-shake displacement
    let shakeX = 0
    let shakeY = 0
    if (config.bassShake?.enabled && this.bassShakeDecay > 0.01) {
      const maxDisp = config.bassShake.maxDisplacementPx || 10
      const intensity = (config.bassShake.intensity || 40) / 100
      const effectiveDisp = maxDisp * intensity * this.bassShakeDecay
      shakeX = Math.sin(currentTime * 50) * effectiveDisp
      shakeY = Math.cos(currentTime * 42) * (effectiveDisp * 0.7)
    }

    return {
      currentPhoto,
      previousPhoto,
      currentPhotoIndex: currentEntry.photoIndex % totalPhotos,
      totalPhotos,
      transitionProgress,
      transitionStyle,
      scalePunch,
      bassShakeX: shakeX,
      bassShakeY: shakeY,
      flashOpacity,
      flashType: config.flash?.type || 'white',
      isInterlude: currentEntry.isInterlude,
    }
  }

  /**
   * Builds the complete timeline schedule mapping start times to photo indices
   */
  public buildSchedule(
    config: MemoryBurstStudioConfig,
    durationSec: number,
    totalPhotos: number
  ): PhotoScheduleEntry[] {
    if (totalPhotos === 0) return []
    const dur = Math.max(1.0, durationSec)
    const schedule: PhotoScheduleEntry[] = []

    const mode = config.mode || 'beat-sync'
    const markers = (config.beatMarkers || []).filter((b) => b.timeSec >= 0 && b.timeSec <= dur)

    // Manual Timings Mode
    if (mode === 'manual-timing' && config.manualTimings && config.manualTimings.length > 0) {
      for (let i = 0; i < config.manualTimings.length; i++) {
        const mt = config.manualTimings[i]
        const pIdx = config.photos.findIndex((p) => p.id === mt.photoId)
        schedule.push({
          startTime: mt.startSec,
          duration: mt.durationSec,
          photoIndex: pIdx >= 0 ? pIdx : i % totalPhotos,
          isInterlude: false,
        })
      }
      return schedule.sort((a, b) => a.startTime - b.startTime)
    }

    // BKU Climax / Memory Rewind Mode
    if (mode === 'memory-rewind' || config.climax?.enabled) {
      return this.buildClimaxSchedule(config, dur, totalPhotos)
    }

    // Beat-Sync & Beat-Interval Modes
    if (
      (mode === 'beat-sync' || mode === 'every-2-beats' || mode === 'every-4-beats') &&
      markers.length > 0
    ) {
      const step = mode === 'every-4-beats' ? 4 : mode === 'every-2-beats' ? 2 : 1
      let shotCount = 0

      for (let i = 0; i < markers.length; i += step) {
        const marker = markers[i]
        const nextTime =
          i + step < markers.length ? markers[i + step].timeSec : dur
        const shotDur = Math.max(0.15, nextTime - marker.timeSec)

        const isInterlude =
          config.fullImageInterludes &&
          config.fullImageEveryNShots > 0 &&
          shotCount > 0 &&
          shotCount % config.fullImageEveryNShots === 0

        const photoIdx = config.randomShuffle
          ? this.getShuffledIndex(shotCount, totalPhotos)
          : shotCount % totalPhotos

        schedule.push({
          startTime: marker.timeSec,
          duration: shotDur,
          photoIndex: photoIdx,
          isInterlude,
        })
        shotCount++
      }

      // Ensure 0s has an entry if first marker > 0
      if (schedule.length > 0 && schedule[0].startTime > 0) {
        schedule.unshift({
          startTime: 0,
          duration: schedule[0].startTime,
          photoIndex: 0,
          isInterlude: false,
        })
      }
      return schedule
    }

    // Fast-Cut Mode (~0.35s per cut)
    if (mode === 'fast-cut') {
      const interval = 0.35
      let t = 0
      let shotCount = 0
      while (t < dur) {
        const shotDur = Math.min(dur - t, interval)
        const photoIdx = config.randomShuffle
          ? this.getShuffledIndex(shotCount, totalPhotos)
          : shotCount % totalPhotos

        schedule.push({
          startTime: t,
          duration: shotDur,
          photoIndex: photoIdx,
          isInterlude: false,
        })
        t += shotDur
        shotCount++
      }
      return schedule
    }

    // Memory Burst Mode (burst of 4 fast 0.2s cuts, then 1.2s pause)
    if (mode === 'memory-burst') {
      let t = 0
      let shotCount = 0
      while (t < dur) {
        // Rapid burst: 4 shots of 0.2s
        for (let b = 0; b < 4 && t < dur; b++) {
          const shotDur = Math.min(dur - t, 0.2)
          schedule.push({
            startTime: t,
            duration: shotDur,
            photoIndex: config.randomShuffle
              ? this.getShuffledIndex(shotCount, totalPhotos)
              : shotCount % totalPhotos,
            isInterlude: false,
          })
          t += shotDur
          shotCount++
        }
        // Rest period: 1.2s hold
        if (t < dur) {
          const holdDur = Math.min(dur - t, 1.2)
          schedule.push({
            startTime: t,
            duration: holdDur,
            photoIndex: config.randomShuffle
              ? this.getShuffledIndex(shotCount, totalPhotos)
              : shotCount % totalPhotos,
            isInterlude: true,
          })
          t += holdDur
          shotCount++
        }
      }
      return schedule
    }

    // Default Fixed Duration Interval (or Auto Rhythm)
    const interval = Math.max(0.2, config.defaultPhotoDurationSec || 1.5)
    let t = 0
    let shotCount = 0
    while (t < dur) {
      const shotDur = Math.min(dur - t, interval)
      const photoIdx = config.randomShuffle
        ? this.getShuffledIndex(shotCount, totalPhotos)
        : shotCount % totalPhotos

      schedule.push({
        startTime: t,
        duration: shotDur,
        photoIndex: photoIdx,
        isInterlude: false,
      })
      t += shotDur
      shotCount++
    }

    return schedule
  }

  /**
   * Builds an accelerating climax montage schedule with customizable photo ordering,
   * hold frames, and flashback rewind flow (inspired by dramatic cinema climax memory montages).
   */
  public buildClimaxSchedule(
    config: MemoryBurstStudioConfig,
    dur: number,
    totalPhotos: number
  ): PhotoScheduleEntry[] {
    const schedule: PhotoScheduleEntry[] = []
    const climaxCfg = config.climax
    const climaxStart = Math.min(dur - 1.0, Math.max(0, climaxCfg?.startSec ?? 10.0))
    const burstDuration = Math.max(2.0, Math.min(dur - climaxStart, climaxCfg?.burstDurationSec ?? 8.0))
    const climaxEnd = climaxStart + burstDuration
    const order = climaxCfg?.photoOrder || (config.randomShuffle ? 'shuffle' : 'reverse')

    const getOrderedIndex = (step: number) => {
      if (order === 'reverse') {
        const rev = (totalPhotos - 1 - (step % totalPhotos)) % totalPhotos
        return rev < 0 ? rev + totalPhotos : rev
      }
      if (order === 'shuffle') {
        return this.getShuffledIndex(step, totalPhotos)
      }
      return step % totalPhotos
    }

    // 1. Pre-Climax Phase: Hold intro photo or calm transitions
    if (climaxStart > 0) {
      const holdTime = climaxCfg?.startHoldSec ? Math.min(climaxStart, climaxCfg.startHoldSec) : 0
      let t = 0

      // If initial hold is requested
      if (holdTime > 0) {
        schedule.push({
          startTime: 0,
          duration: holdTime,
          photoIndex: 0,
          isInterlude: false,
        })
        t = holdTime
      }

      // Calm pacing until climax starts
      const calmInterval = 2.0
      let calmStep = 1
      while (t < climaxStart) {
        const shotDur = Math.min(climaxStart - t, calmInterval)
        schedule.push({
          startTime: t,
          duration: shotDur,
          photoIndex: getOrderedIndex(calmStep),
          isInterlude: false,
        })
        t += shotDur
        calmStep++
      }
    }

    // 2. Climax Burst Phase: Accelerating or high-tempo montage cuts
    let t = climaxStart
    let burstStep = 0
    const speedMult = Math.max(0.4, Math.min(3.0, climaxCfg?.cutSpeedMultiplier ?? 1.0))
    const accelEnabled = climaxCfg?.accelerationEnabled ?? false
    const accelStrength = climaxCfg?.accelerationStrength ?? 3

    while (t < climaxEnd) {
      // Calculate progressive acceleration curve: cut intervals shrink as t approaches climax peak
      const progress = Math.min(1.0, Math.max(0, (t - climaxStart) / burstDuration))
      let shotDur = 0.18 / speedMult

      if (accelEnabled) {
        // Starts at ~0.36s, smoothly shrinks down to ~0.08s
        const minCut = 0.08 / speedMult
        const maxCut = 0.36 / speedMult
        const curve = Math.pow(progress, accelStrength * 0.4)
        shotDur = Math.max(0.06, maxCut - (maxCut - minCut) * curve)
      }

      shotDur = Math.min(climaxEnd - t, shotDur)
      if (shotDur < 0.04) break

      schedule.push({
        startTime: t,
        duration: shotDur,
        photoIndex: getOrderedIndex(burstStep),
        isInterlude: false,
      })

      t += shotDur
      burstStep++
    }

    // 3. Post-Climax Phase: Emotional Hold Frame
    if (t < dur) {
      const lastBurstEntry = schedule[schedule.length - 1]
      const emotionalHoldPhotoIdx = lastBurstEntry ? lastBurstEntry.photoIndex : 0
      const holdDuration = climaxCfg?.endingHoldEnabled
        ? Math.min(dur - t, climaxCfg.endHoldSec || 3.0)
        : Math.min(dur - t, 3.0)

      schedule.push({
        startTime: t,
        duration: holdDuration,
        photoIndex: emotionalHoldPhotoIdx,
        isInterlude: false,
      })
      t += holdDuration

      // Any remaining tail duration
      let tailStep = 0
      while (t < dur) {
        const tailDur = Math.min(dur - t, 2.5)
        schedule.push({
          startTime: t,
          duration: tailDur,
          photoIndex: (emotionalHoldPhotoIdx + tailStep) % totalPhotos,
          isInterlude: false,
        })
        t += tailDur
        tailStep++
      }
    }

    return schedule
  }

  /**
   * Deterministic shuffle index to prevent frame flickering during playback
   */
  private getShuffledIndex(shotIndex: number, total: number): number {
    if (total <= 1) return 0
    const seed = Math.sin(shotIndex * 9301 + 49297) * 233280
    return Math.floor(Math.abs(seed) % total)
  }

  /**
   * Resolves dynamic transition style when random-shuffle is active
   */
  private resolveShuffledTransition(shotIndex: number): MemoryBurstTransitionStyle {
    const list: MemoryBurstTransitionStyle[] = [
      'instant-cut',
      'smooth-crossfade',
      'short-flash',
      'scale-punch',
      'whip-pan',
      'glitch-split',
      'film-burn',
    ]
    return list[shotIndex % list.length]
  }

  /**
   * Updates bass decay impulse for micro-shake
   */
  private updateBassDecay(
    config: MemoryBurstStudioConfig,
    bands: NormalizedAudioBands,
    currentTime: number
  ): void {
    const dt = Math.max(0.001, Math.min(0.1, currentTime - this.lastUpdateTime))
    this.lastUpdateTime = currentTime

    if (!config.bassShake?.enabled) {
      this.bassShakeDecay = 0
      return
    }

    const bass = bands?.bass || 0
    const subBass = bands?.subBass || 0
    const sensNorm = (config.bassShake.bassSensitivity || 60) / 100
    const threshold = 0.85 - sensNorm * 0.45

    if (bass > threshold || subBass > threshold || bands?.isBeatHit) {
      this.bassShakeDecay = 1.0
    } else {
      this.bassShakeDecay = Math.max(0, this.bassShakeDecay - dt * 4.5)
    }
  }

  /**
   * Aspect-ratio preserving cover crop calculation
   */
  public calculateCoverCrop(
    imgW: number,
    imgH: number,
    canvasW: number,
    canvasH: number
  ): MemoryBurstCropRect {
    if (imgW <= 0 || imgH <= 0 || canvasW <= 0 || canvasH <= 0) {
      return { sx: 0, sy: 0, sw: Math.max(1, imgW), sh: Math.max(1, imgH) }
    }

    const imgAspect = imgW / imgH
    const canvasAspect = canvasW / canvasH

    let sw = imgW
    let sh = imgH

    if (imgAspect > canvasAspect) {
      sw = imgH * canvasAspect
    } else {
      sh = imgW / canvasAspect
    }

    const sx = Math.max(0, (imgW - sw) / 2)
    const sy = Math.max(0, (imgH - sh) / 2)

    return { sx, sy, sw, sh }
  }
}

export const memoryBurstSequencer = new MemoryBurstSequencer()
