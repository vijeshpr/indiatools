/**
 * Sub-Harmonic Octave Synthesizer & Linkwitz-Riley Crossover Engine
 * Full Web Audio API graph + AudioWorklet processor for zero-latency real-time preview.
 */

import { BassEnhancerParams } from './types'
import { createSubBassWaveShaperCurve } from './waveshaperMath'

export const LINKWITZ_RILEY_Q = 0.7071067811865475 // Butterworth Q for 4th-order Linkwitz-Riley

/**
 * Inline AudioWorklet code for authentic -1 octave sub-harmonic frequency division,
 * envelope tracking, transient punch, and mono bass locking.
 */
export const SUB_HARMONIC_WORKLET_CODE = `
class SubHarmonicProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.flipFlop = 1.0;
    this.lastSample = 0.0;
    this.envelope = 0.0;
    this.smoothSub = 0.0;
    this.prevZeroTime = 0;
    this.sampleCount = 0;
    this.hysteresis = 0.015;
  }

  static get parameterDescriptors() {
    return [
      { name: 'subLevel', defaultValue: 0.55, minValue: 0.0, maxValue: 1.0 },
      { name: 'drive', defaultValue: 0.40, minValue: 0.0, maxValue: 1.0 },
      { name: 'punch', defaultValue: 0.45, minValue: 0.0, maxValue: 1.0 },
      { name: 'monoLock', defaultValue: 1.0, minValue: 0.0, maxValue: 1.0 },
    ];
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    if (!input || input.length === 0) return true;

    const numChannels = input.length;
    const blockSize = input[0].length;
    const subLevel = parameters.subLevel.length > 1 ? parameters.subLevel[0] : parameters.subLevel[0];
    const drive = parameters.drive.length > 1 ? parameters.drive[0] : parameters.drive[0];
    const punch = parameters.punch.length > 1 ? parameters.punch[0] : parameters.punch[0];
    const monoLock = (parameters.monoLock.length > 1 ? parameters.monoLock[0] : parameters.monoLock[0]) > 0.5;

    const leftIn = input[0];
    const rightIn = numChannels > 1 ? input[1] : input[0];
    const leftOut = output[0];
    const rightOut = output.length > 1 ? output[1] : output[0];

    // Envelope attack/release smoothing factors (44.1k/48k sample rates)
    const attackCoeff = 0.08;
    const releaseCoeff = 0.003;
    const filterAlpha = 0.08; // Low-pass filter for sub-octave tone smoothing (~60Hz)

    for (let i = 0; i < blockSize; i++) {
      this.sampleCount++;
      const inL = leftIn[i];
      const inR = rightIn[i];

      // 1. Mono fundamental sum for tracking
      const monoIn = 0.5 * (inL + inR);
      const absVal = Math.abs(monoIn);

      // 2. Dynamic envelope follower
      if (absVal > this.envelope) {
        this.envelope += attackCoeff * (absVal - this.envelope);
      } else {
        this.envelope -= releaseCoeff * this.envelope;
      }

      // 3. Zero-Crossing Frequency Divider for -1 Octave Synthesis
      if (this.lastSample <= 0 && monoIn > this.hysteresis) {
        this.flipFlop = -this.flipFlop; // Toggle state at half-frequency
      }
      this.lastSample = monoIn;

      // 4. Smooth square wave into fundamental sine sub-octave
      const targetSub = this.flipFlop * this.envelope;
      this.smoothSub += filterAlpha * (targetSub - this.smoothSub);

      // 5. Transient punch boost based on instantaneous attack
      const punchGain = 1.0 + punch * 1.5 * Math.min(1.0, absVal * 3.0);
      const synthSub = this.smoothSub * subLevel * 1.4 * punchGain;

      // 6. Combine fundamental sub + synthesized sub-octave
      let processedL = (inL + synthSub);
      let processedR = (inR + synthSub);

      // 7. Saturation wave-shaper
      if (drive > 0.01) {
        const k = 1.0 + drive * 4.0;
        processedL = Math.tanh(k * processedL) / Math.tanh(k);
        processedR = Math.tanh(k * processedR) / Math.tanh(k);
      }

      // 8. Mono Bass Lock: force low-end to pure mono
      if (monoLock) {
        const monoSum = 0.5 * (processedL + processedR);
        processedL = monoSum;
        processedR = monoSum;
      }

      leftOut[i] = processedL;
      if (output.length > 1) {
        rightOut[i] = processedR;
      }
    }

    return true;
  }
}

registerProcessor('sub-harmonic-processor', SubHarmonicProcessor);
`

export interface BassEnhancerNodes {
  inputNode: GainNode
  outputNode: GainNode
  dryGainNode: GainNode
  wetGainNode: GainNode
  bypassDryNode: GainNode
  bypassMasterNode: GainNode

  // 4th-Order Linkwitz-Riley Crossover Nodes
  lp1: BiquadFilterNode
  lp2: BiquadFilterNode
  hp1: BiquadFilterNode
  hp2: BiquadFilterNode

  // Sub Processing Nodes
  subHarmonicNode?: AudioNode
  waveShaperNode: WaveShaperNode
  subLimiter: DynamicsCompressorNode
  monoMerger?: ChannelMergerNode

  // Analyser
  analyserNode: AnalyserNode
  subAnalyserNode: AnalyserNode
}

let workletModuleRegistered = false

/**
 * Register SubHarmonic AudioWorkletProcessor once in the audio context
 */
export async function registerSubHarmonicWorklet(ctx: AudioContext): Promise<boolean> {
  if (workletModuleRegistered) return true
  if (!ctx.audioWorklet) return false

  try {
    const blob = new Blob([SUB_HARMONIC_WORKLET_CODE], { type: 'application/javascript' })
    const workletUrl = URL.createObjectURL(blob)
    await ctx.audioWorklet.addModule(workletUrl)
    URL.revokeObjectURL(workletUrl)
    workletModuleRegistered = true
    return true
  } catch (err) {
    console.warn('AudioWorklet registration fallback to standard nodes:', err)
    return false
  }
}

/**
 * Construct the complete Web Audio DSP graph for Studio Bass Enhancer
 */
export function buildBassEnhancerGraph(
  ctx: AudioContext,
  params: BassEnhancerParams,
  hasWorklet = false
): BassEnhancerNodes {
  const inputNode = ctx.createGain()
  const outputNode = ctx.createGain()

  // Analysers
  const analyserNode = ctx.createAnalyser()
  analyserNode.fftSize = 4096
  analyserNode.smoothingTimeConstant = 0.85

  const subAnalyserNode = ctx.createAnalyser()
  subAnalyserNode.fftSize = 4096
  subAnalyserNode.smoothingTimeConstant = 0.82

  // 1. Linkwitz-Riley 4th-order crossover
  // High-Pass Path (mid/high passthrough)
  const hp1 = ctx.createBiquadFilter()
  hp1.type = 'highpass'
  hp1.frequency.value = params.crossoverHz
  hp1.Q.value = LINKWITZ_RILEY_Q

  const hp2 = ctx.createBiquadFilter()
  hp2.type = 'highpass'
  hp2.frequency.value = params.crossoverHz
  hp2.Q.value = LINKWITZ_RILEY_Q

  // Low-Pass Path (isolated sub-bass)
  const lp1 = ctx.createBiquadFilter()
  lp1.type = 'lowpass'
  lp1.frequency.value = params.crossoverHz
  lp1.Q.value = LINKWITZ_RILEY_Q

  const lp2 = ctx.createBiquadFilter()
  lp2.type = 'lowpass'
  lp2.frequency.value = params.crossoverHz
  lp2.Q.value = LINKWITZ_RILEY_Q

  // 2. WaveShaper for harmonics
  const waveShaperNode = ctx.createWaveShaper()
  waveShaperNode.curve = createSubBassWaveShaperCurve(params.drive)
  waveShaperNode.oversample = '2x'

  // 3. Sub-Bass Brickwall Limiter
  const subLimiter = ctx.createDynamicsCompressor()
  subLimiter.threshold.value = -1.0
  subLimiter.knee.value = 0.0
  subLimiter.ratio.value = 20.0
  subLimiter.attack.value = 0.001
  subLimiter.release.value = 0.04

  // 4. Parallel Wet / Dry Gains & Master A/B Bypass
  const dryGainNode = ctx.createGain()
  const wetGainNode = ctx.createGain()
  const wetMixSum = ctx.createGain()
  const bypassDryNode = ctx.createGain()
  const bypassMasterNode = ctx.createGain()

  // Calculate initial gains
  const mixNorm = Math.max(0, Math.min(1, params.mix / 100))
  dryGainNode.gain.value = Math.cos(mixNorm * 0.5 * Math.PI)
  wetGainNode.gain.value = Math.sin(mixNorm * 0.5 * Math.PI)

  const isBypassed = params.bypassed
  bypassDryNode.gain.value = isBypassed ? 1.0 : 0.0
  bypassMasterNode.gain.value = isBypassed ? 0.0 : 1.0

  // Wire High-Pass (Clean mids and highs)
  inputNode.connect(hp1)
  hp1.connect(hp2)
  hp2.connect(wetMixSum) // Mids and highs route directly to wet mix sum with zero phase distortion

  // Wire Low-Pass (Sub path)
  inputNode.connect(lp1)
  lp1.connect(lp2)

  let subHarmonicNode: AudioNode | undefined

  if (hasWorklet && ctx.audioWorklet) {
    try {
      const workletNode = new (window as any).AudioWorkletNode(ctx, 'sub-harmonic-processor', {
        numberOfInputs: 1,
        numberOfOutputs: 1,
        outputChannelCount: [2],
      })

      const subParam = workletNode.parameters.get('subLevel')
      if (subParam) subParam.value = params.subLevel / 100
      const driveParam = workletNode.parameters.get('drive')
      if (driveParam) driveParam.value = params.drive / 100
      const punchParam = workletNode.parameters.get('punch')
      if (punchParam) punchParam.value = params.punch / 100
      const monoParam = workletNode.parameters.get('monoLock')
      if (monoParam) monoParam.value = params.monoLock ? 1.0 : 0.0

      lp2.connect(workletNode)
      workletNode.connect(subLimiter)
      subHarmonicNode = workletNode
    } catch {
      // Fallback to native Web Audio graph
      lp2.connect(waveShaperNode)
      waveShaperNode.connect(subLimiter)
    }
  } else {
    // Native Web Audio graph fallback
    lp2.connect(waveShaperNode)
    waveShaperNode.connect(subLimiter)
  }

  // Connect limiter to sub analyser and wet mix sum
  subLimiter.connect(subAnalyserNode)
  subLimiter.connect(wetMixSum)

  // Wet Mix Sum -> Wet Gain -> Master Output
  wetMixSum.connect(wetGainNode)
  wetGainNode.connect(bypassMasterNode)

  // Dry Path -> Dry Gain -> Master Output
  inputNode.connect(dryGainNode)
  dryGainNode.connect(bypassMasterNode)

  // A/B Bypass Dry Direct Path
  inputNode.connect(bypassDryNode)

  // Sum both into master output and master analyser
  bypassMasterNode.connect(outputNode)
  bypassDryNode.connect(outputNode)
  outputNode.connect(analyserNode)

  return {
    inputNode,
    outputNode,
    dryGainNode,
    wetGainNode,
    bypassDryNode,
    bypassMasterNode,
    lp1,
    lp2,
    hp1,
    hp2,
    subHarmonicNode,
    waveShaperNode,
    subLimiter,
    analyserNode,
    subAnalyserNode,
  }
}

/**
 * Dynamically update DSP parameters without audio artifacts or glitching
 */
export function updateBassEngineParams(nodes: BassEnhancerNodes, params: BassEnhancerParams): void {
  const now = nodes.inputNode.context.currentTime

  // Update Crossover Frequency
  nodes.lp1.frequency.setTargetAtTime(params.crossoverHz, now, 0.01)
  nodes.lp2.frequency.setTargetAtTime(params.crossoverHz, now, 0.01)
  nodes.hp1.frequency.setTargetAtTime(params.crossoverHz, now, 0.01)
  nodes.hp2.frequency.setTargetAtTime(params.crossoverHz, now, 0.01)

  // Update WaveShaper Curve
  nodes.waveShaperNode.curve = createSubBassWaveShaperCurve(params.drive)

  // Update Worklet parameters if present
  if (nodes.subHarmonicNode && (nodes.subHarmonicNode as any).parameters) {
    const p = (nodes.subHarmonicNode as any).parameters
    const subP = p.get('subLevel')
    if (subP) subP.setTargetAtTime(params.subLevel / 100, now, 0.01)
    const driveP = p.get('drive')
    if (driveP) driveP.setTargetAtTime(params.drive / 100, now, 0.01)
    const punchP = p.get('punch')
    if (punchP) punchP.setTargetAtTime(params.punch / 100, now, 0.01)
    const monoP = p.get('monoLock')
    if (monoP) monoP.setValueAtTime(params.monoLock ? 1.0 : 0.0, now)
  }

  // Update Parallel Wet / Dry Crossfade
  const mixNorm = Math.max(0, Math.min(1, params.mix / 100))
  nodes.dryGainNode.gain.setTargetAtTime(Math.cos(mixNorm * 0.5 * Math.PI), now, 0.01)
  nodes.wetGainNode.gain.setTargetAtTime(Math.sin(mixNorm * 0.5 * Math.PI), now, 0.01)

  // Update A/B Bypass
  nodes.bypassDryNode.gain.setTargetAtTime(params.bypassed ? 1.0 : 0.0, now, 0.005)
  nodes.bypassMasterNode.gain.setTargetAtTime(params.bypassed ? 0.0 : 1.0, now, 0.005)
}
