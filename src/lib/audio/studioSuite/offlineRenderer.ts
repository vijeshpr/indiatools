/**
 * Studio Master & Spatial Suite - Offline Processing & Rendering Pipeline
 * Executes the complete mastering, multiband, and spatial chain via OfflineAudioContext
 */

import { StudioMasterState } from './types'
import { buildAutoMasterNodes } from './masteringDsp'
import { buildMultibandNodes } from './multibandDsp'
import {
  buildOrbitMotionNodes,
  calculateEffectiveLfoRate,
  getLfoSample,
} from './spatialMotionDsp'

export interface RenderOptions {
  onProgress?: (percent: number) => void
  isCancelled?: () => boolean
}

/**
 * Render the full master chain offline
 */
export async function renderOfflineStudioMaster(
  sourceBuffer: AudioBuffer,
  state: StudioMasterState,
  options?: RenderOptions
): Promise<AudioBuffer> {
  const sampleRate = sourceBuffer.sampleRate
  const numSamples = sourceBuffer.length
  const durationSec = sourceBuffer.duration

  const offlineCtx = new (window.OfflineAudioContext || (window as any).webkitOfflineAudioContext)(
    2,
    numSamples,
    sampleRate
  )

  options?.onProgress?.(5)

  // 1. Audio Source
  const sourceNode = offlineCtx.createBufferSource()
  sourceNode.buffer = sourceBuffer

  // Master Limiter & Safety Ceiling
  const masterLimiter = offlineCtx.createDynamicsCompressor()
  masterLimiter.threshold.value = -0.5
  masterLimiter.knee.value = 2.0
  masterLimiter.ratio.value = 20.0
  masterLimiter.attack.value = 0.002
  masterLimiter.release.value = 0.1

  const masterGain = offlineCtx.createGain()
  masterGain.gain.value = state.masterVolume

  // If bypassed: route source directly to master limiter
  if (state.isBypassed) {
    sourceNode.connect(masterGain)
    masterGain.connect(masterLimiter)
    masterLimiter.connect(offlineCtx.destination)
    sourceNode.start(0)

    const rendered = await offlineCtx.startRendering()
    options?.onProgress?.(100)
    return rendered
  }

  // 2. Build Module 1: Smart Auto Master
  const autoMaster = buildAutoMasterNodes(offlineCtx, state.autoMaster)

  // 3. Build Module 2: Tri-Band Multiband Compressor
  const multiband = buildMultibandNodes(offlineCtx, state.multiband)

  // 4. Build Module 3: Orbit Motion Auto-Panner
  const orbitMotion = buildOrbitMotionNodes(offlineCtx, state.orbitMotion)

  // Schedule LFO modulation on Orbit Motion if enabled
  if (state.orbitMotion.enabled) {
    const rate = calculateEffectiveLfoRate(state.orbitMotion)
    const depth = Math.min(1.0, state.orbitMotion.depth)
    const tremolo = state.orbitMotion.tremoloDepth

    // Schedule pan curve values (60 points per second)
    const curvePoints = Math.min(20000, Math.ceil(durationSec * 60))
    const panCurve = new Float32Array(curvePoints)
    const tremoloCurve = new Float32Array(curvePoints)

    for (let i = 0; i < curvePoints; i++) {
      const t = (i / curvePoints) * durationSec
      const panVal = getLfoSample(state.orbitMotion.shape, t, rate) * depth
      panCurve[i] = Math.max(-1, Math.min(1, panVal))

      // Tremolo gain oscillation
      const tremVal = 1 - tremolo * 0.5 * (1 + Math.sin(t * state.orbitMotion.tremoloRateHz * 2 * Math.PI))
      tremoloCurve[i] = Math.max(0, Math.min(1, tremVal))
    }

    try {
      orbitMotion.pannerNode.pan.setValueCurveAtTime(panCurve, 0, durationSec)
      orbitMotion.tremoloGain.gain.setValueCurveAtTime(tremoloCurve, 0, durationSec)
    } catch (e) {
      // Fallback
    }
  }

  // Chain Signal Flow:
  // Source -> Auto Master -> Multiband -> Orbit Motion -> Master Gain -> Limiter -> Output
  sourceNode.connect(autoMaster.inputGain)
  autoMaster.outputSum.connect(multiband.inputNode)
  multiband.finalOutput.connect(orbitMotion.inputNode)
  orbitMotion.finalOutput.connect(masterGain)
  masterGain.connect(masterLimiter)
  masterLimiter.connect(offlineCtx.destination)

  sourceNode.start(0)

  options?.onProgress?.(25)

  // Interval progress simulation
  let currentPct = 25
  const progressTimer = setInterval(() => {
    if (options?.isCancelled?.()) {
      clearInterval(progressTimer)
      throw new Error('Export cancelled by user.')
    }
    if (currentPct < 85) {
      currentPct += 5
      options?.onProgress?.(currentPct)
    }
  }, 120)

  try {
    const rendered = await offlineCtx.startRendering()
    clearInterval(progressTimer)
    options?.onProgress?.(95)
    return rendered
  } catch (err) {
    clearInterval(progressTimer)
    throw err
  }
}
