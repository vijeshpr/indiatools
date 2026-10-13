/**
 * High-Speed Offline DSP Rendering Engine for Studio Bass Enhancer
 * Processes full-resolution audio buffers with Linkwitz-Riley 4th-order crossovers,
 * authentic -1 octave sub-harmonic synthesis, waveshaping, and mono bass locking.
 */

import { BassEnhancerParams, BassExportProgress } from './types'
import { processSampleSaturation, applySoftClipLimiter } from './waveshaperMath'
import { LINKWITZ_RILEY_Q } from './subHarmonicEngine'

export interface OfflineRenderOptions {
  onProgress?: (progress: BassExportProgress) => void
  isCancelled?: () => boolean
}

/**
 * Render AudioBuffer with full Studio Bass Enhancer DSP chain
 */
export async function renderOfflineBassEnhancedBuffer(
  sourceBuffer: AudioBuffer,
  params: BassEnhancerParams,
  options?: OfflineRenderOptions
): Promise<AudioBuffer> {
  const sampleRate = sourceBuffer.sampleRate
  const length = sourceBuffer.length
  const numChannels = sourceBuffer.numberOfChannels

  if (options?.isCancelled?.()) {
    throw new Error('Export cancelled by user.')
  }

  // Stage 1: Analyzing Spectrum
  options?.onProgress?.({
    stage: 'analyzing',
    percentage: 10,
    stageMessage: 'Analyzing Spectrum…',
  })

  // 1. Linkwitz-Riley Crossover Split using OfflineAudioContext
  // We use OfflineAudioContext to perform pristine 4th-order IIR filtering
  const splitCtx = new (window.OfflineAudioContext || (window as any).webkitOfflineAudioContext)(
    numChannels,
    length,
    sampleRate
  )

  const splitSource = splitCtx.createBufferSource()
  splitSource.buffer = sourceBuffer

  // High-Pass Path (Clean Mids & Highs)
  const hp1 = splitCtx.createBiquadFilter()
  hp1.type = 'highpass'
  hp1.frequency.value = params.crossoverHz
  hp1.Q.value = LINKWITZ_RILEY_Q

  const hp2 = splitCtx.createBiquadFilter()
  hp2.type = 'highpass'
  hp2.frequency.value = params.crossoverHz
  hp2.Q.value = LINKWITZ_RILEY_Q

  splitSource.connect(hp1)
  hp1.connect(hp2)
  hp2.connect(splitCtx.destination)

  splitSource.start(0)
  const highPassBuffer = await splitCtx.startRendering()

  if (options?.isCancelled?.()) {
    throw new Error('Export cancelled by user.')
  }

  // Now isolate Low-Pass Path
  const lpCtx = new (window.OfflineAudioContext || (window as any).webkitOfflineAudioContext)(
    numChannels,
    length,
    sampleRate
  )

  const lpSource = lpCtx.createBufferSource()
  lpSource.buffer = sourceBuffer

  const lp1 = lpCtx.createBiquadFilter()
  lp1.type = 'lowpass'
  lp1.frequency.value = params.crossoverHz
  lp1.Q.value = LINKWITZ_RILEY_Q

  const lp2 = lpCtx.createBiquadFilter()
  lp2.type = 'lowpass'
  lp2.frequency.value = params.crossoverHz
  lp2.Q.value = LINKWITZ_RILEY_Q

  lpSource.connect(lp1)
  lp1.connect(lp2)
  lp2.connect(lpCtx.destination)

  lpSource.start(0)
  const lowPassBuffer = await lpCtx.startRendering()

  if (options?.isCancelled?.()) {
    throw new Error('Export cancelled by user.')
  }

  // Stage 2: Synthesizing Sub-Harmonics
  options?.onProgress?.({
    stage: 'synthesizing',
    percentage: 30,
    stageMessage: 'Synthesizing Sub-Harmonics…',
  })

  // 2. Perform Sub-Harmonic Synthesis & Envelope Tracking
  const subLevel = params.subLevel / 100
  const drive = params.drive
  const punch = params.punch / 100
  const monoLock = params.monoLock
  const mixNorm = Math.max(0, Math.min(1, params.mix / 100))
  const dryGain = Math.cos(mixNorm * 0.5 * Math.PI)
  const wetGain = Math.sin(mixNorm * 0.5 * Math.PI)

  // Output buffer allocation
  const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  const outputBuffer = outCtx.createBuffer(numChannels, length, sampleRate)
  outCtx.close()

  const lpLeft = lowPassBuffer.getChannelData(0)
  const lpRight = numChannels > 1 ? lowPassBuffer.getChannelData(1) : lpLeft
  const hpLeft = highPassBuffer.getChannelData(0)
  const hpRight = numChannels > 1 ? highPassBuffer.getChannelData(1) : hpLeft
  const dryLeft = sourceBuffer.getChannelData(0)
  const dryRight = numChannels > 1 ? sourceBuffer.getChannelData(1) : dryLeft

  const outLeft = outputBuffer.getChannelData(0)
  const outRight = numChannels > 1 ? outputBuffer.getChannelData(1) : outLeft

  // DSP State Variables
  let flipFlop = 1.0
  let lastSample = 0.0
  let envelope = 0.0
  let smoothSub = 0.0
  const hysteresis = 0.015
  const attackCoeff = 0.08
  const releaseCoeff = 0.003
  const filterAlpha = 0.08

  const chunkSize = 16384
  const totalChunks = Math.ceil(length / chunkSize)

  // Process chunked execution to report progress and allow cancelation
  for (let c = 0; c < totalChunks; c++) {
    if (options?.isCancelled?.()) {
      throw new Error('Export cancelled by user.')
    }

    const startIdx = c * chunkSize
    const endIdx = Math.min(length, startIdx + chunkSize)

    // Progress updates
    const progressPct = 30 + Math.round((c / totalChunks) * 50)
    let currentStage: BassExportProgress['stage'] = 'synthesizing'
    let currentMsg = 'Synthesizing Sub-Harmonics…'

    if (progressPct >= 65) {
      currentStage = 'limiting'
      currentMsg = 'Limiting & Mono Lock…'
    } else if (progressPct >= 45) {
      currentStage = 'waveshaping'
      currentMsg = 'Applying WaveShaper…'
    }

    if (c % 10 === 0) {
      options?.onProgress?.({
        stage: currentStage,
        percentage: progressPct,
        stageMessage: currentMsg,
      })
      // Micro-yield to prevent browser UI freezing
      await new Promise((resolve) => setTimeout(resolve, 0))
    }

    for (let i = startIdx; i < endIdx; i++) {
      const inL = lpLeft[i]
      const inR = lpRight[i]
      const monoIn = 0.5 * (inL + inR)
      const absVal = Math.abs(monoIn)

      // Dynamic envelope follower
      if (absVal > envelope) {
        envelope += attackCoeff * (absVal - envelope)
      } else {
        envelope -= releaseCoeff * envelope
      }

      // Zero-Crossing Frequency Divider for -1 Octave Synthesis
      if (lastSample <= 0 && monoIn > hysteresis) {
        flipFlop = -flipFlop
      }
      lastSample = monoIn

      // Smooth square wave into fundamental sine sub-octave
      const targetSub = flipFlop * envelope
      smoothSub += filterAlpha * (targetSub - smoothSub)

      // Transient punch boost
      const punchGain = 1.0 + punch * 1.5 * Math.min(1.0, absVal * 3.0)
      const synthSub = smoothSub * subLevel * 1.4 * punchGain

      // Sub path combined (Fundamental + Sub-Octave)
      let subL = inL + synthSub
      let subR = inR + synthSub

      // Saturation WaveShaper
      if (drive > 0) {
        subL = processSampleSaturation(subL, drive)
        subR = processSampleSaturation(subR, drive)
      }

      // Mono Bass Lock (<120Hz)
      if (monoLock) {
        const monoSum = 0.5 * (subL + subR)
        subL = monoSum
        subR = monoSum
      }

      // Soft-Clip Bass Limiter
      subL = applySoftClipLimiter(subL)
      subR = applySoftClipLimiter(subR)

      // Sum Wet Path (Processed Sub + Pristine High-Pass)
      const wetL = subL + hpLeft[i]
      const wetR = subR + hpRight[i]

      // Wet/Dry Mix
      const finalL = dryGain * dryLeft[i] + wetGain * wetL
      const finalR = dryGain * dryRight[i] + wetGain * wetR

      // Clamp output to master digital ceiling (-0.1 dBFS ~ 0.99)
      outLeft[i] = Math.max(-0.995, Math.min(0.995, finalL))
      if (numChannels > 1) {
        outRight[i] = Math.max(-0.995, Math.min(0.995, finalR))
      }
    }
  }

  options?.onProgress?.({
    stage: 'encoding',
    percentage: 85,
    stageMessage: 'Encoding…',
  })

  return outputBuffer
}
