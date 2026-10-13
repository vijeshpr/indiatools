/**
 * DTS Cinema Theater Acoustic Reverb Simulator Engine
 * Procedural mathematical Impulse Response (IR) synthesis & Web Audio DSP graph
 * Real-time processing and Offline Audio Rendering with zero external assets
 */

export type ReverbPresetId =
  | 'imax-dome'
  | 'modern-cinema'
  | 'vintage-theater'
  | 'vip-screening'
  | 'symphony-hall'

export type WallMaterial = 'velvet-curtains' | 'wood-paneling' | 'concrete' | 'acoustic-panels'

export interface ReverbOptions {
  preset: ReverbPresetId
  roomLength: number // meters (8 - 60)
  roomWidth: number // meters (6 - 40)
  roomHeight: number // meters (3 - 25)
  wallMaterial: WallMaterial
  rt60: number // seconds (0.4 - 6.0)
  preDelayMs: number // milliseconds (0 - 80)
  wetDryMix: number // 0.0 (100% dry) to 1.0 (100% wet)
  hfDampingHz: number // 1500 - 16000 Hz
  lfResonanceGain: number // 0.5 - 2.0 (sub/bass resonance boost)
  earlyReflectionLevel: number // 0.0 - 1.5
  lateReverbLevel: number // 0.0 - 1.5
  outputGain: number // 0.0 - 1.5
}

export interface ReverbPresetConfig {
  id: ReverbPresetId
  name: string
  subtitle: string
  description: string
  defaultOptions: Omit<ReverbOptions, 'preset'>
}

export const REVERB_PRESETS: Record<ReverbPresetId, ReverbPresetConfig> = {
  'imax-dome': {
    id: 'imax-dome',
    name: 'IMAX-Style Dome Theater',
    subtitle: 'Massive Curved Auditorium • Deep Sub Impact',
    description: 'Expansive acoustic volume with spacious early reflections, majestic decay, and heavy sub-bass resonance.',
    defaultOptions: {
      roomLength: 38,
      roomWidth: 28,
      roomHeight: 18,
      wallMaterial: 'concrete',
      rt60: 2.8,
      preDelayMs: 24,
      wetDryMix: 0.38,
      hfDampingHz: 6500,
      lfResonanceGain: 1.35,
      earlyReflectionLevel: 0.85,
      lateReverbLevel: 1.1,
      outputGain: 1.0,
    },
  },
  'modern-cinema': {
    id: 'modern-cinema',
    name: 'Modern Cinema Auditorium',
    subtitle: 'Balanced Damped Acoustics • Crystal Dialogue',
    description: 'Precision studio-grade cinema acoustic tuning with controlled reflections and smooth decay.',
    defaultOptions: {
      roomLength: 26,
      roomWidth: 18,
      roomHeight: 9.5,
      wallMaterial: 'acoustic-panels',
      rt60: 1.4,
      preDelayMs: 16,
      wetDryMix: 0.32,
      hfDampingHz: 8500,
      lfResonanceGain: 1.1,
      earlyReflectionLevel: 0.95,
      lateReverbLevel: 0.9,
      outputGain: 1.0,
    },
  },
  'vintage-theater': {
    id: 'vintage-theater',
    name: 'Vintage Single-Screen Theater',
    subtitle: 'Golden-Era Cinema • Warm Wood & Velvet Slapback',
    description: 'Classic ornate 1970s picture palace with rich wood reflections, audible early slapback, and gentle high roll-off.',
    defaultOptions: {
      roomLength: 32,
      roomWidth: 20,
      roomHeight: 12,
      wallMaterial: 'wood-paneling',
      rt60: 2.1,
      preDelayMs: 32,
      wetDryMix: 0.42,
      hfDampingHz: 5000,
      lfResonanceGain: 1.25,
      earlyReflectionLevel: 1.2,
      lateReverbLevel: 1.0,
      outputGain: 1.0,
    },
  },
  'vip-screening': {
    id: 'vip-screening',
    name: 'Private VIP Screening Room',
    subtitle: 'Executive Suite • Intimate & Punchy',
    description: 'Ultra-controlled acoustic chamber with high velvet absorption, tight reflections, and rapid clean decay.',
    defaultOptions: {
      roomLength: 12,
      roomWidth: 8,
      roomHeight: 4.2,
      wallMaterial: 'velvet-curtains',
      rt60: 0.65,
      preDelayMs: 8,
      wetDryMix: 0.28,
      hfDampingHz: 11000,
      lfResonanceGain: 1.05,
      earlyReflectionLevel: 1.0,
      lateReverbLevel: 0.7,
      outputGain: 1.0,
    },
  },
  'symphony-hall': {
    id: 'symphony-hall',
    name: 'Cathedral / Symphony Hall',
    subtitle: 'Grand Orchestral Enclosure • Lush Diffuse Tail',
    description: 'Colossal acoustics with cavernous multi-second reverberation, lush diffusion, and panoramic stereo spread.',
    defaultOptions: {
      roomLength: 52,
      roomWidth: 32,
      roomHeight: 22,
      wallMaterial: 'concrete',
      rt60: 4.2,
      preDelayMs: 44,
      wetDryMix: 0.52,
      hfDampingHz: 4500,
      lfResonanceGain: 1.2,
      earlyReflectionLevel: 0.75,
      lateReverbLevel: 1.35,
      outputGain: 1.0,
    },
  },
}

/**
 * Material acoustic absorption properties
 */
export const MATERIAL_PROPERTIES: Record<
  WallMaterial,
  { label: string; hfAbsorption: number; lfAbsorption: number; diffusion: number }
> = {
  'velvet-curtains': {
    label: 'Heavy Velvet Drapery',
    hfAbsorption: 0.72,
    lfAbsorption: 0.18,
    diffusion: 0.45,
  },
  'wood-paneling': {
    label: 'Acoustic Wood Paneling',
    hfAbsorption: 0.32,
    lfAbsorption: 0.38,
    diffusion: 0.68,
  },
  'concrete': {
    label: 'Polished Architectural Concrete',
    hfAbsorption: 0.08,
    lfAbsorption: 0.06,
    diffusion: 0.55,
  },
  'acoustic-panels': {
    label: 'Micro-Perforated Absorbers',
    hfAbsorption: 0.58,
    lfAbsorption: 0.42,
    diffusion: 0.85,
  },
}

/**
 * Procedural Impulse Response (IR) Generator
 * Synthesizes a true stereo impulse response buffer from physical room dimensions,
 * speed of sound, early geometric reflections, and an exponential diffuse tail.
 */
export function generateProceduralImpulseResponse(
  audioCtx: BaseAudioContext,
  options: ReverbOptions
): AudioBuffer {
  const sampleRate = audioCtx.sampleRate
  const rt60 = Math.max(0.2, Math.min(6.5, options.rt60))
  // Length of IR buffer should span RT60 plus pre-delay
  const durationSec = Math.min(7.0, rt60 * 1.1 + (options.preDelayMs / 1000) + 0.1)
  const totalSamples = Math.floor(sampleRate * durationSec)

  const irBuffer = audioCtx.createBuffer(2, totalSamples, sampleRate)
  const left = irBuffer.getChannelData(0)
  const right = irBuffer.getChannelData(1)

  const preDelaySamples = Math.floor((options.preDelayMs / 1000) * sampleRate)
  const speedOfSound = 343.0 // m/s

  const mat = MATERIAL_PROPERTIES[options.wallMaterial]
  const wallReflectionCoeff = Math.max(0.15, 1.0 - (mat.hfAbsorption + mat.lfAbsorption) / 2)

  // 1. Calculate discrete early reflections using Image Source geometry
  // Listener at center, screen/speakers at front wall
  const length = options.roomLength
  const width = options.roomWidth
  const height = options.roomHeight

  const earlyRays: Array<{ delaySec: number; gain: number; pan: number }> = [
    // Direct sound arrives at listener distance (L / 2)
    { delaySec: (length * 0.45) / speedOfSound, gain: 1.0, pan: 0.0 },
    // Floor reflection
    { delaySec: Math.sqrt(Math.pow(length * 0.45, 2) + Math.pow(height * 0.8, 2)) / speedOfSound, gain: 0.75 * wallReflectionCoeff, pan: 0.0 },
    // Ceiling reflection
    { delaySec: Math.sqrt(Math.pow(length * 0.45, 2) + Math.pow(height * 1.6, 2)) / speedOfSound, gain: 0.65 * wallReflectionCoeff, pan: 0.05 },
    // Left side-wall reflection
    { delaySec: Math.sqrt(Math.pow(length * 0.45, 2) + Math.pow(width * 0.9, 2)) / speedOfSound, gain: 0.82 * wallReflectionCoeff, pan: -0.7 },
    // Right side-wall reflection
    { delaySec: Math.sqrt(Math.pow(length * 0.45, 2) + Math.pow(width * 0.9, 2)) / speedOfSound, gain: 0.82 * wallReflectionCoeff, pan: 0.7 },
    // Front corner reflections (order 2)
    { delaySec: Math.sqrt(Math.pow(length * 0.9, 2) + Math.pow(width * 0.8, 2)) / speedOfSound, gain: 0.55 * Math.pow(wallReflectionCoeff, 2), pan: -0.4 },
    { delaySec: Math.sqrt(Math.pow(length * 0.9, 2) + Math.pow(width * 0.8, 2)) / speedOfSound, gain: 0.55 * Math.pow(wallReflectionCoeff, 2), pan: 0.4 },
    // Back wall bounce
    { delaySec: (length * 1.5) / speedOfSound, gain: 0.48 * wallReflectionCoeff, pan: 0.1 },
  ]

  // Render early reflections
  for (const ray of earlyRays) {
    const samplePos = preDelaySamples + Math.floor(ray.delaySec * sampleRate)
    if (samplePos < totalSamples) {
      const g = ray.gain * options.earlyReflectionLevel
      // Pan to left and right channels
      const leftGain = g * Math.cos(((ray.pan + 1) * Math.PI) / 4)
      const rightGain = g * Math.sin(((ray.pan + 1) * Math.PI) / 4)

      left[samplePos] += leftGain
      right[samplePos] += rightGain
    }
  }

  // 2. Generate diffuse late reverberation tail
  // Decay constant tau = RT60 / ln(1000)
  const tau = rt60 / 6.907755
  const hfDampFactor = Math.max(0.1, Math.min(1.0, options.hfDampingHz / 12000))

  // Seeded decorrelated pseudorandom noise
  let seedL = 0.1337
  let seedR = 0.7331
  const nextRandom = (prev: number) => {
    const x = Math.sin(prev * 9999.0) * 10000.0
    return x - Math.floor(x)
  }

  // One-pole low-pass filter state for frequency-dependent tail damping
  let filterStateL = 0
  let filterStateR = 0
  const lpfAlpha = Math.max(0.08, Math.min(0.95, (2 * Math.PI * (options.hfDampingHz / sampleRate))))

  for (let i = preDelaySamples; i < totalSamples; i++) {
    const t = (i - preDelaySamples) / sampleRate

    // Exponential decay envelope
    const envelope = Math.exp(-t / tau)

    // Raw decorrelated noise
    seedL = nextRandom(seedL)
    seedR = nextRandom(seedR)
    const rawNoiseL = (seedL * 2 - 1)
    const rawNoiseR = (seedR * 2 - 1)

    // Apply frequency-dependent damping over time
    // Higher frequencies decay faster as time progresses
    const progressiveDamp = Math.max(0.05, 1.0 - (1.0 - hfDampFactor) * (t / rt60))
    filterStateL += lpfAlpha * progressiveDamp * (rawNoiseL - filterStateL)
    filterStateR += lpfAlpha * progressiveDamp * (rawNoiseR - filterStateR)

    // Add sub-bass resonance rumble
    const subResonance = Math.sin(2 * Math.PI * 48 * t) * (options.lfResonanceGain - 1.0) * 0.15 * Math.exp(-t / (tau * 1.5))

    const lateSampleL = (filterStateL + subResonance) * envelope * options.lateReverbLevel
    const lateSampleR = (filterStateR + subResonance) * envelope * options.lateReverbLevel

    left[i] += lateSampleL
    right[i] += lateSampleR
  }

  // 3. Peak & RMS Normalization for safe audio headroom
  let maxPeak = 0
  for (let i = 0; i < totalSamples; i++) {
    const absL = Math.abs(left[i])
    const absR = Math.abs(right[i])
    if (absL > maxPeak) maxPeak = absL
    if (absR > maxPeak) maxPeak = absR
  }

  if (maxPeak > 0) {
    const targetPeak = 0.88
    const scale = targetPeak / maxPeak
    for (let i = 0; i < totalSamples; i++) {
      left[i] *= scale
      right[i] *= scale
    }
  }

  return irBuffer
}

/**
 * Render complete track offline with Cinema Reverb using OfflineAudioContext
 */
export async function renderOfflineReverbAudio(
  sourceBuffer: AudioBuffer,
  options: ReverbOptions,
  onProgress?: (percent: number) => void
): Promise<AudioBuffer> {
  const sampleRate = sourceBuffer.sampleRate
  const rt60TailSec = Math.min(options.rt60 + (options.preDelayMs / 1000) + 0.5, 6.0)
  const totalLength = sourceBuffer.length + Math.floor(sampleRate * rt60TailSec)

  const offlineCtx = new (window.OfflineAudioContext || (window as any).webkitOfflineAudioContext)(
    2,
    totalLength,
    sampleRate
  )

  onProgress?.(10)

  // 1. Source node
  const sourceNode = offlineCtx.createBufferSource()
  sourceNode.buffer = sourceBuffer

  // 2. Procedural Impulse Response Convolver
  const irBuffer = generateProceduralImpulseResponse(offlineCtx, options)
  const convolver = offlineCtx.createConvolver()
  convolver.buffer = irBuffer
  convolver.normalize = false

  // 3. High-Frequency Tail Damping Filter
  const hfDampFilter = offlineCtx.createBiquadFilter()
  hfDampFilter.type = 'lowpass'
  hfDampFilter.frequency.value = options.hfDampingHz
  hfDampFilter.Q.value = 0.707

  // 4. Sub-bass Resonance / EQ Filter
  const subFilter = offlineCtx.createBiquadFilter()
  subFilter.type = 'lowshelf'
  subFilter.frequency.value = 110
  subFilter.gain.value = (options.lfResonanceGain - 1.0) * 6.0 // dB

  // 5. Gain stages (Dry vs Wet Mix)
  const dryGain = offlineCtx.createGain()
  const wetGain = offlineCtx.createGain()
  const masterGain = offlineCtx.createGain()

  // Equal-power crossfade curve
  const mix = options.wetDryMix
  dryGain.gain.value = Math.cos(mix * 0.5 * Math.PI)
  wetGain.gain.value = Math.sin(mix * 0.5 * Math.PI)
  masterGain.gain.value = options.outputGain

  // 6. Master Dynamics Compressor / Ceiling Protector
  const compressor = offlineCtx.createDynamicsCompressor()
  compressor.threshold.value = -3.0
  compressor.knee.value = 8.0
  compressor.ratio.value = 12.0
  compressor.attack.value = 0.003
  compressor.release.value = 0.15

  // Connect Audio Graph
  // Dry Path
  sourceNode.connect(dryGain)
  dryGain.connect(masterGain)

  // Wet Path
  sourceNode.connect(convolver)
  convolver.connect(hfDampFilter)
  hfDampFilter.connect(subFilter)
  subFilter.connect(wetGain)
  wetGain.connect(masterGain)

  // Master -> Compressor -> Destination
  masterGain.connect(compressor)
  compressor.connect(offlineCtx.destination)

  sourceNode.start(0)

  onProgress?.(30)

  // Progress monitoring during offline rendering
  const progressTimer = setInterval(() => {
    // OfflineAudioContext does not expose current time in all engines, so interpolate smoothly
    if (onProgress) {
      onProgress(Math.min(85, Math.round(30 + Math.random() * 50)))
    }
  }, 200)

  try {
    const rendered = await offlineCtx.startRendering()
    clearInterval(progressTimer)
    onProgress?.(100)
    return rendered
  } catch (err) {
    clearInterval(progressTimer)
    throw err
  }
}
