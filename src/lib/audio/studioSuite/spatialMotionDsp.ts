/**
 * Orbit Motion Rack - LFO Auto-Panner, Tremolo & Sub-Bass Center Lock
 * Provides rhythmic spatial movement with Linkwitz-Riley sub-bass lock.
 */

import { OrbitMotionConfig, LfoShape } from './types'

export interface OrbitMotionNodes {
  inputNode: GainNode
  // Sub-Bass Center Lock Split (LR4 low-pass at subLockCrossoverHz)
  subLp1: BiquadFilterNode
  subLp2: BiquadFilterNode
  subSumGain: GainNode

  // Mid/High Panned Path (LR4 high-pass at subLockCrossoverHz)
  highHp1: BiquadFilterNode
  highHp2: BiquadFilterNode
  pannerNode: StereoPannerNode
  tremoloGain: GainNode

  outputSum: GainNode
  dryGain: GainNode
  wetGain: GainNode
  finalOutput: GainNode
}

/**
 * Calculate effective LFO frequency in Hz
 */
export function calculateEffectiveLfoRate(config: OrbitMotionConfig): number {
  if (!config.tempoSync) {
    return Math.max(0.05, Math.min(15, config.rateHz))
  }
  // Tempo-sync: beat duration in seconds = 60 / BPM
  const beatSec = 60 / Math.max(40, config.bpm)
  switch (config.subdivision) {
    case '1/4':
      return 1 / (beatSec * 1) // 1 beat
    case '1/8':
      return 1 / (beatSec * 0.5) // 1/2 beat
    case '1/16':
      return 1 / (beatSec * 0.25) // 1/4 beat
    default:
      return 1 / beatSec
  }
}

/**
 * Generate LFO waveform sample at time t (normalized between -1 and 1)
 */
export function getLfoSample(shape: LfoShape, timeSec: number, freqHz: number): number {
  const phase = (timeSec * freqHz) % 1.0 // 0 to 1

  switch (shape) {
    case 'sine':
      return Math.sin(phase * 2 * Math.PI)
    case 'triangle':
      return phase < 0.5 ? 4 * phase - 1 : 3 - 4 * phase
    case 'square':
      return phase < 0.5 ? 1 : -1
    case 'random': {
      // Sample & hold: pseudo-random step per cycle
      const stepIndex = Math.floor(timeSec * freqHz)
      const x = Math.sin(stepIndex * 1234.567) * 43758.5453
      return (x - Math.floor(x)) * 2 - 1
    }
    default:
      return Math.sin(phase * 2 * Math.PI)
  }
}

/**
 * Build Web Audio nodes for Orbit Motion
 */
export function buildOrbitMotionNodes(
  ctx: BaseAudioContext,
  config: OrbitMotionConfig
): OrbitMotionNodes {
  const inputNode = ctx.createGain()
  const outputSum = ctx.createGain()
  const dryGain = ctx.createGain()
  const wetGain = ctx.createGain()
  const finalOutput = ctx.createGain()

  const subFc = config.subLockCrossoverHz
  const Q = 0.7071

  // 1. Sub-Bass Center Path (keeps kick & sub centered)
  const subLp1 = ctx.createBiquadFilter()
  subLp1.type = 'lowpass'
  subLp1.frequency.value = subFc
  subLp1.Q.value = Q

  const subLp2 = ctx.createBiquadFilter()
  subLp2.type = 'lowpass'
  subLp2.frequency.value = subFc
  subLp2.Q.value = Q

  const subSumGain = ctx.createGain()
  subSumGain.gain.value = config.subLock ? 1.0 : 0.0

  inputNode.connect(subLp1)
  subLp1.connect(subLp2)
  subLp2.connect(subSumGain)
  subSumGain.connect(outputSum)

  // 2. Mid/High Upper Frequency Panned Path
  const highHp1 = ctx.createBiquadFilter()
  highHp1.type = config.subLock ? 'highpass' : 'allpass'
  highHp1.frequency.value = subFc
  highHp1.Q.value = Q

  const highHp2 = ctx.createBiquadFilter()
  highHp2.type = config.subLock ? 'highpass' : 'allpass'
  highHp2.frequency.value = subFc
  highHp2.Q.value = Q

  // Stereo Panner
  const pannerNode = ctx.createStereoPanner()
  pannerNode.pan.value = 0

  // Tremolo Gain Modulation
  const tremoloGain = ctx.createGain()
  tremoloGain.gain.value = 1.0

  inputNode.connect(highHp1)
  highHp1.connect(highHp2)
  highHp2.connect(pannerNode)
  pannerNode.connect(tremoloGain)
  tremoloGain.connect(outputSum)

  // Module Bypass Crossfade
  if (config.enabled) {
    dryGain.gain.value = 0.0
    wetGain.gain.value = 1.0
  } else {
    dryGain.gain.value = 1.0
    wetGain.gain.value = 0.0
  }

  inputNode.connect(dryGain)
  dryGain.connect(finalOutput)

  outputSum.connect(wetGain)
  wetGain.connect(finalOutput)

  return {
    inputNode,
    subLp1,
    subLp2,
    subSumGain,
    highHp1,
    highHp2,
    pannerNode,
    tremoloGain,
    outputSum,
    dryGain,
    wetGain,
    finalOutput,
  }
}
