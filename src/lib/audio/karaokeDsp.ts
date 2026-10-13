/**
 * Studio Karaoke DSP Engine
 * Client-side digital signal processing for center channel vocal reduction,
 * low-frequency bass preservation, and varispeed pitch/speed adjustment.
 */

export interface KaraokeDspOptions {
  vocalReduction: number // 0.0 (off) to 1.0 (maximum)
  bassPreservation: number // 0.0 (off) to 1.0 (maximum)
  outputGain: number // 0.2 to 2.0 (default 1.0)
  semitones: number // -12 to +12
  speed: number // 0.5 to 2.0 (default 1.0)
}

/**
 * 2nd-order IIR Biquad Low-Pass Filter
 * Used to isolate low-frequency audio (<140 Hz) for kick/bass preservation
 */
class BiquadLowPassFilter {
  private b0 = 0
  private b1 = 0
  private b2 = 0
  private a1 = 0
  private a2 = 0

  private x1 = 0
  private x2 = 0
  private y1 = 0
  private y2 = 0

  constructor(cutoffHz: number, sampleRate: number, q = 0.7071) {
    const omega = (2 * Math.PI * cutoffHz) / sampleRate
    const sn = Math.sin(omega)
    const cs = Math.cos(omega)
    const alpha = sn / (2 * q)

    const a0 = 1 + alpha
    this.b0 = (1 - cs) / 2 / a0
    this.b1 = (1 - cs) / a0
    this.b2 = (1 - cs) / 2 / a0
    this.a1 = (-2 * cs) / a0
    this.a2 = (1 - alpha) / a0
  }

  process(sample: number): number {
    const y =
      this.b0 * sample +
      this.b1 * this.x1 +
      this.b2 * this.x2 -
      this.a1 * this.y1 -
      this.a2 * this.y2

    this.x2 = this.x1
    this.x1 = sample
    this.y2 = this.y1
    this.y1 = y

    return y
  }

  reset(): void {
    this.x1 = 0
    this.x2 = 0
    this.y1 = 0
    this.y2 = 0
  }
}

/**
 * Process audio buffer channels for vocal reduction and bass preservation
 * Returns a new AudioBuffer with DSP applied
 */
export async function applyKaraokeDsp(
  sourceBuffer: AudioBuffer,
  options: KaraokeDspOptions,
  audioCtx: BaseAudioContext
): Promise<{ buffer: AudioBuffer; hasClipped: boolean; peakLevel: number }> {
  const numChannels = sourceBuffer.numberOfChannels
  const length = sourceBuffer.length
  const sampleRate = sourceBuffer.sampleRate

  // If mono audio, stereo center subtraction cannot isolate vocals
  const isMono = numChannels === 1

  // Create destination buffer with 2 channels for stereo output
  const outputChannels = Math.max(2, numChannels)
  const processedBuffer = audioCtx.createBuffer(outputChannels, length, sampleRate)

  const leftSrc = sourceBuffer.getChannelData(0)
  const rightSrc = isMono ? leftSrc : sourceBuffer.getChannelData(1)

  const leftDst = processedBuffer.getChannelData(0)
  const rightDst = processedBuffer.getChannelData(1)

  const alpha = Math.max(0, Math.min(1, options.vocalReduction))
  const beta = Math.max(0, Math.min(1, options.bassPreservation))
  const gain = Math.max(0.1, Math.min(2.5, options.outputGain))

  // Set up bass preservation low-pass filters (140 Hz cutoff)
  const bassFilter = new BiquadLowPassFilter(140, sampleRate)

  let maxPeak = 0

  for (let i = 0; i < length; i++) {
    const l = leftSrc[i]
    const r = rightSrc[i]

    if (isMono || alpha === 0) {
      // In mono or bypass, simply apply output gain
      const outL = l * gain
      const outR = r * gain
      leftDst[i] = Math.max(-1, Math.min(1, outL))
      rightDst[i] = Math.max(-1, Math.min(1, outR))

      const peak = Math.max(Math.abs(outL), Math.abs(outR))
      if (peak > maxPeak) maxPeak = peak
      continue
    }

    // Center channel extraction: C = (L + R) / 2
    const center = (l + r) * 0.5

    // Low-frequency bass extraction from the center channel
    const bassLow = beta > 0 ? bassFilter.process(center) : 0

    // Center cancellation: subtract fraction alpha of center channel
    // When alpha = 1.0, L' = (L - R)/2 and R' = (R - L)/2
    let lProc = l - alpha * center
    let rProc = r - alpha * center

    // Add back preserved low frequencies (kick drum & bass guitar)
    if (beta > 0) {
      const bassRestored = beta * alpha * bassLow
      lProc += bassRestored
      rProc += bassRestored
    }

    // Apply output gain
    lProc *= gain
    rProc *= gain

    const peak = Math.max(Math.abs(lProc), Math.abs(rProc))
    if (peak > maxPeak) maxPeak = peak

    // Safe ceiling limiting to prevent overflow
    leftDst[i] = Math.max(-1, Math.min(1, lProc))
    rightDst[i] = Math.max(-1, Math.min(1, rProc))
  }

  const hasClipped = maxPeak > 0.99

  return {
    buffer: processedBuffer,
    hasClipped,
    peakLevel: Math.min(maxPeak, 2.0),
  }
}

/**
 * Resample an AudioBuffer to apply pitch shifting and speed modification for export
 * Pitch ratio: 2^(semitones / 12)
 * Combined rate multiplier: pitchRatio * speed
 */
export async function applyPitchAndSpeedForExport(
  inputBuffer: AudioBuffer,
  semitones: number,
  speed: number
): Promise<AudioBuffer> {
  const pitchRatio = Math.pow(2, semitones / 12)
  const totalRate = Math.max(0.25, Math.min(4.0, pitchRatio * speed))

  // If rate is effectively 1.0, return input buffer directly
  if (Math.abs(totalRate - 1.0) < 0.001) {
    return inputBuffer
  }

  const targetLength = Math.max(1, Math.round(inputBuffer.length / totalRate))
  const sampleRate = inputBuffer.sampleRate
  const channels = inputBuffer.numberOfChannels

  const offlineCtx = new OfflineAudioContext(channels, targetLength, sampleRate)
  const sourceNode = offlineCtx.createBufferSource()
  sourceNode.buffer = inputBuffer
  sourceNode.playbackRate.value = totalRate
  sourceNode.connect(offlineCtx.destination)
  sourceNode.start(0)

  return await offlineCtx.startRendering()
}

/**
 * Synthesize a 4-second stereo demo music track containing:
 * - Centered Lead Melody (Vocals simulation)
 * - Wide Stereo Arpeggio (Instruments)
 * - Centered Kick & Sub-Bass (<100 Hz)
 * Perfect for verifying center cancellation and bass preservation instantly
 */
export async function generateKaraokeDemoSpecimen(): Promise<File> {
  const sampleRate = 44100
  const duration = 4.0
  const totalSamples = Math.floor(sampleRate * duration)

  const offlineCtx = new OfflineAudioContext(2, totalSamples, sampleRate)

  // 1. Kick & Sub-bass (panned center, 55 Hz to 90 Hz)
  const kickOsc = offlineCtx.createOscillator()
  const kickGain = offlineCtx.createGain()
  kickOsc.frequency.setValueAtTime(110, 0)
  kickOsc.frequency.exponentialRampToValueAtTime(50, 0.25)
  kickGain.gain.setValueAtTime(0.4, 0)
  kickGain.gain.exponentialRampToValueAtTime(0.001, 0.4)
  kickOsc.connect(kickGain)
  kickGain.connect(offlineCtx.destination)
  kickOsc.start(0)
  kickOsc.stop(0.5)

  // Repeat kick at 1.0s, 2.0s, 3.0s
  for (let t = 1.0; t < 3.5; t += 1.0) {
    const kOsc = offlineCtx.createOscillator()
    const kGain = offlineCtx.createGain()
    kOsc.frequency.setValueAtTime(110, t)
    kOsc.frequency.exponentialRampToValueAtTime(50, t + 0.25)
    kGain.gain.setValueAtTime(0.4, t)
    kGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
    kOsc.connect(kGain)
    kGain.connect(offlineCtx.destination)
    kOsc.start(t)
    kOsc.stop(t + 0.5)
  }

  // 2. Wide Stereo Instrumental Pads (Left: 330 Hz, Right: 440 Hz)
  const pannerL = offlineCtx.createStereoPanner()
  pannerL.pan.value = -0.75
  const oscL = offlineCtx.createOscillator()
  const gainL = offlineCtx.createGain()
  oscL.type = 'triangle'
  oscL.frequency.value = 329.63 // E4
  gainL.gain.value = 0.15
  oscL.connect(gainL)
  gainL.connect(pannerL)
  pannerL.connect(offlineCtx.destination)
  oscL.start(0)
  oscL.stop(duration)

  const pannerR = offlineCtx.createStereoPanner()
  pannerR.pan.value = 0.75
  const oscR = offlineCtx.createOscillator()
  const gainR = offlineCtx.createGain()
  oscR.type = 'sawtooth'
  oscR.frequency.value = 440.0 // A4
  gainR.gain.value = 0.12
  oscR.connect(gainR)
  gainR.connect(pannerR)
  pannerR.connect(offlineCtx.destination)
  oscR.start(0)
  oscR.stop(duration)

  // 3. Centered Lead Vocal Simulation (panned dead center: pan = 0.0, 587 Hz D5 melody)
  const leadPanner = offlineCtx.createStereoPanner()
  leadPanner.pan.value = 0.0
  const leadOsc = offlineCtx.createOscillator()
  const leadGain = offlineCtx.createGain()
  leadOsc.type = 'sine'
  leadOsc.frequency.setValueAtTime(523.25, 0) // C5
  leadOsc.frequency.setValueAtTime(587.33, 1.0) // D5
  leadOsc.frequency.setValueAtTime(659.25, 2.0) // E5
  leadOsc.frequency.setValueAtTime(523.25, 3.0) // C5
  leadGain.gain.value = 0.28
  leadOsc.connect(leadGain)
  leadGain.connect(leadPanner)
  leadPanner.connect(offlineCtx.destination)
  leadOsc.start(0)
  leadOsc.stop(duration)

  const renderedBuffer = await offlineCtx.startRendering()

  // Encode to WAV
  const { encodeAudioBufferToWav } = await import('./encoders/wavEncoder')
  const blob = await encodeAudioBufferToWav(renderedBuffer)

  return new File([blob], 'Studio_Karaoke_Demo_Specimen.wav', { type: 'audio/wav' })
}
