/**
 * Virtual 5.1 & 7.1 Surround Sound Upmixer DSP Engine
 * Real-time stereo-to-surround upmixing matrix, discrete multi-channel extraction,
 * and HRTF/binaural 3D headphone virtualization.
 */

export type SurroundMode = 'surround-5-1' | 'surround-7-1' | 'binaural-headphones'

export interface SurroundOptions {
  mode: SurroundMode
  centreClarity: number // 0.0 to 1.0 (dialogue vocal presence blend)
  centreLevel: number // 0.0 to 1.5
  subCrossoverHz: number // 60 to 140 Hz (4th-order Linkwitz-Riley low-pass)
  subGain: number // 0.0 to 2.0
  surroundSpread: number // 0.0 to 1.5 (ambience difference gain)
  surroundDelayMs: number // 10 to 40 ms
  rearDecorrelation: number // 0.0 to 1.5 (for 7.1 rear channels)
  frontStereoWidth: number // 0.5 to 1.5
  masterOutputGain: number // 0.0 to 1.5
}

export const DEFAULT_SURROUND_OPTIONS: SurroundOptions = {
  mode: 'surround-5-1',
  centreClarity: 0.65,
  centreLevel: 1.0,
  subCrossoverHz: 90,
  subGain: 1.25,
  surroundSpread: 0.9,
  surroundDelayMs: 22,
  rearDecorrelation: 0.85,
  frontStereoWidth: 1.1,
  masterOutputGain: 1.0,
}

export type ChannelId = 'FL' | 'FR' | 'C' | 'LFE' | 'SL' | 'SR' | 'RL' | 'RR'

export interface ChannelInfo {
  id: ChannelId
  name: string
  azimuthDeg: number // degrees relative to front (0 = front center)
  is71Only: boolean
}

export const SURROUND_CHANNELS: Record<ChannelId, ChannelInfo> = {
  FL: { id: 'FL', name: 'Front Left', azimuthDeg: -30, is71Only: false },
  FR: { id: 'FR', name: 'Front Right', azimuthDeg: 30, is71Only: false },
  C: { id: 'C', name: 'Centre (Dialogue)', azimuthDeg: 0, is71Only: false },
  LFE: { id: 'LFE', name: 'Subwoofer (LFE)', azimuthDeg: -15, is71Only: false },
  SL: { id: 'SL', name: 'Surround Left', azimuthDeg: -100, is71Only: false },
  SR: { id: 'SR', name: 'Surround Right', azimuthDeg: 100, is71Only: false },
  RL: { id: 'RL', name: 'Rear Left', azimuthDeg: -145, is71Only: true },
  RR: { id: 'RR', name: 'Rear Right', azimuthDeg: 145, is71Only: true },
}

export interface MultiChannelAudioData {
  channels: Float32Array[]
  channelNames: string[]
  sampleRate: number
  mode: SurroundMode
}

/**
 * Perform discrete DSP upmixing on stereo AudioBuffer
 * Returns discrete Float32Array buffers for all target channels
 */
export async function upmixStereoToMultiChannel(
  sourceBuffer: AudioBuffer,
  options: SurroundOptions,
  onProgress?: (percent: number) => void
): Promise<MultiChannelAudioData> {
  const sampleRate = sourceBuffer.sampleRate
  const numSamples = sourceBuffer.length

  const leftIn = sourceBuffer.getChannelData(0)
  const rightIn = sourceBuffer.numberOfChannels > 1 ? sourceBuffer.getChannelData(1) : leftIn

  const is71 = options.mode === 'surround-7-1'
  const isBinaural = options.mode === 'binaural-headphones'

  onProgress?.(15)

  // 1. FRONT LEFT & FRONT RIGHT (Preserve stereo imaging + width)
  const fl = new Float32Array(numSamples)
  const fr = new Float32Array(numSamples)
  const widthFactor = options.frontStereoWidth

  for (let i = 0; i < numSamples; i++) {
    const l = leftIn[i]
    const r = rightIn[i]
    // Mid/Side matrix expansion
    const mid = (l + r) * 0.5
    const side = (l - r) * 0.5 * widthFactor
    fl[i] = mid + side
    fr[i] = mid - side
  }

  onProgress?.(30)

  // 2. CENTRE CHANNEL (Correlated mono + dialogue presence bandpass filter)
  const c = new Float32Array(numSamples)
  // Two 1-pole filters to approximate bandpass 300 Hz - 3500 Hz
  const hpFreq = 300
  const lpFreq = 3500
  const hpAlpha = Math.exp((-2 * Math.PI * hpFreq) / sampleRate)
  const lpAlpha = Math.exp((-2 * Math.PI * lpFreq) / sampleRate)

  let hpPrevIn = 0
  let hpPrevOut = 0
  let lpPrevOut = 0

  for (let i = 0; i < numSamples; i++) {
    const correlatedMono = (leftIn[i] + rightIn[i]) * 0.5
    // High-pass filter at 300 Hz
    hpPrevOut = hpAlpha * (hpPrevOut + correlatedMono - hpPrevIn)
    hpPrevIn = correlatedMono
    // Low-pass filter at 3500 Hz
    lpPrevOut = lpAlpha * lpPrevOut + (1 - lpAlpha) * hpPrevOut

    // Blend dialogue clarity bandpass with full mono
    const centreSample = correlatedMono * (1 - options.centreClarity) + lpPrevOut * options.centreClarity * 1.4
    c[i] = centreSample * options.centreLevel
  }

  onProgress?.(45)

  // 3. SUBWOOFER / LFE (4th-order Linkwitz-Riley low-pass filter)
  // 4th order is two cascaded 2nd-order Butterworth filters
  const lfe = new Float32Array(numSamples)
  const fc = options.subCrossoverHz
  const omega = (2 * Math.PI * fc) / sampleRate
  const cosOmega = Math.cos(omega)
  const sinOmega = Math.sin(omega)
  const alphaQ = sinOmega / (2 * 0.7071) // Q = 0.7071 (Butterworth)

  const b0 = (1 - cosOmega) / 2
  const b1 = 1 - cosOmega
  const b2 = (1 - cosOmega) / 2
  const a0 = 1 + alphaQ
  const a1 = -2 * cosOmega
  const a2 = 1 - alphaQ

  // Stage 1 filter memory
  let x1_1 = 0, x2_1 = 0, y1_1 = 0, y2_1 = 0
  // Stage 2 filter memory
  let x1_2 = 0, x2_2 = 0, y1_2 = 0, y2_2 = 0

  for (let i = 0; i < numSamples; i++) {
    const monoSub = (leftIn[i] + rightIn[i]) * 0.5

    // Stage 1
    const y_1 = (b0 / a0) * monoSub + (b1 / a0) * x1_1 + (b2 / a0) * x2_1 - (a1 / a0) * y1_1 - (a2 / a0) * y2_1
    x2_1 = x1_1
    x1_1 = monoSub
    y2_1 = y1_1
    y1_1 = y_1

    // Stage 2
    const y_2 = (b0 / a0) * y_1 + (b1 / a0) * x1_2 + (b2 / a0) * x2_2 - (a1 / a0) * y1_2 - (a2 / a0) * y2_2
    x2_2 = x1_2
    x1_2 = y_1
    y2_2 = y1_2
    y1_2 = y_2

    lfe[i] = y_2 * options.subGain
  }

  onProgress?.(60)

  // 4. SURROUND LEFT & SURROUND RIGHT (Difference ambience + delay + HF rolloff)
  const sl = new Float32Array(numSamples)
  const sr = new Float32Array(numSamples)
  const delaySamples = Math.floor((options.surroundDelayMs / 1000) * sampleRate)

  // Ambient difference extraction with gentle HF roll-off (low-pass at 6.5 kHz)
  const sLpAlpha = Math.exp((-2 * Math.PI * 6500) / sampleRate)
  let sLpL = 0
  let sLpR = 0

  for (let i = 0; i < numSamples; i++) {
    const delayedIdx = Math.max(0, i - delaySamples)
    const diffL = (leftIn[delayedIdx] - rightIn[delayedIdx]) * 0.7071 * options.surroundSpread
    const diffR = (rightIn[delayedIdx] - leftIn[delayedIdx]) * 0.7071 * options.surroundSpread

    sLpL = sLpAlpha * sLpL + (1 - sLpAlpha) * diffL
    sLpR = sLpAlpha * sLpR + (1 - sLpAlpha) * diffR

    sl[i] = sLpL
    sr[i] = sLpR
  }

  onProgress?.(75)

  // 5. REAR SURROUND (7.1 only: further decorrelated delay + comb diffusion)
  let rl: Float32Array | null = null
  let rr: Float32Array | null = null

  if (is71 || isBinaural) {
    rl = new Float32Array(numSamples)
    rr = new Float32Array(numSamples)
    const rearExtraDelay = Math.floor(0.014 * sampleRate) // +14ms additional rear delay

    for (let i = 0; i < numSamples; i++) {
      const idx = Math.max(0, i - rearExtraDelay)
      // Slight phase stagger and decorrelation
      rl[i] = sl[idx] * options.rearDecorrelation
      rr[i] = sr[idx] * options.rearDecorrelation
    }
  }

  onProgress?.(90)

  // 6. IF BINAURAL HEADPHONE MODE: Virtualize down to 2-channel binaural stereo
  if (isBinaural && rl && rr) {
    const binL = new Float32Array(numSamples)
    const binR = new Float32Array(numSamples)

    // Virtual speaker layout: [channel, azimuthDeg]
    const speakerFeeds: Array<{ data: Float32Array; az: number; gain: number }> = [
      { data: fl, az: -30, gain: 0.8 },
      { data: fr, az: 30, gain: 0.8 },
      { data: c, az: 0, gain: 0.75 },
      { data: lfe, az: -15, gain: 0.65 },
      { data: sl, az: -100, gain: 0.65 },
      { data: sr, az: 100, gain: 0.65 },
      { data: rl, az: -145, gain: 0.55 },
      { data: rr, az: 145, gain: 0.55 },
    ]

    const speedOfSound = 343.0
    const headRadius = 0.0875 // 8.75 cm human head radius

    for (const spk of speakerFeeds) {
      const rad = (spk.az * Math.PI) / 180
      // Woodworth ITD calculation: deltaT = (r/c) * (sin(theta) + theta)
      const itdSec = (headRadius / speedOfSound) * (Math.sin(Math.abs(rad)) + Math.abs(rad))
      const itdSamples = Math.floor(itdSec * sampleRate)

      // ILD contralateral shadowing filter
      const shadowFreq = 3200
      const shadowAlpha = Math.exp((-2 * Math.PI * shadowFreq) / sampleRate)

      let shadowState = 0

      for (let i = 0; i < numSamples; i++) {
        const val = spk.data[i] * spk.gain

        if (spk.az < 0) {
          // Left side speaker: Left ear is ipsilateral (direct), Right ear is delayed + shadowed
          binL[i] += val
          const delayedIdx = Math.max(0, i - itdSamples)
          shadowState = shadowAlpha * shadowState + (1 - shadowAlpha) * (spk.data[delayedIdx] * spk.gain)
          binR[i] += shadowState * 0.72
        } else if (spk.az > 0) {
          // Right side speaker: Right ear is direct, Left ear is delayed + shadowed
          binR[i] += val
          const delayedIdx = Math.max(0, i - itdSamples)
          shadowState = shadowAlpha * shadowState + (1 - shadowAlpha) * (spk.data[delayedIdx] * spk.gain)
          binL[i] += shadowState * 0.72
        } else {
          // Center: both ears receive equal signals
          binL[i] += val * 0.7071
          binR[i] += val * 0.7071
        }
      }
    }

    // Apply master output gain
    for (let i = 0; i < numSamples; i++) {
      binL[i] *= options.masterOutputGain
      binR[i] *= options.masterOutputGain
    }

    onProgress?.(100)
    return {
      channels: [binL, binR],
      channelNames: ['Binaural Left', 'Binaural Right'],
      sampleRate,
      mode: 'binaural-headphones',
    }
  }

  // Multi-channel discrete return
  const channels = is71 ? [fl, fr, c, lfe, sl, sr, rl!, rr!] : [fl, fr, c, lfe, sl, sr]
  const names = is71
    ? ['Front Left', 'Front Right', 'Centre', 'LFE Subwoofer', 'Surround Left', 'Surround Right', 'Rear Left', 'Rear Right']
    : ['Front Left', 'Front Right', 'Centre', 'LFE Subwoofer', 'Surround Left', 'Surround Right']

  // Apply master gain to all discrete channels
  for (const ch of channels) {
    for (let i = 0; i < numSamples; i++) {
      ch[i] *= options.masterOutputGain
    }
  }

  onProgress?.(100)
  return {
    channels,
    channelNames: names,
    sampleRate,
    mode: options.mode,
  }
}
