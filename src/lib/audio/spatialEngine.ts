/**
 * Orbit Audio Studio — Spatial Audio DSP Engine
 * Client-side 8D & 16D spatial trajectory modeling, HRTF panning,
 * algorithmic room impulse response synthesis, and offline rendering.
 */

export type SpatialMode = '8d' | '16d' | 'preset' | 'custom'

export type SpatialPreset =
  | '360-rotation'
  | 'flyby'
  | 'front-back'
  | 'slow-cinematic'
  | 'fast-spin'
  | 'stationary'
  | 'cosmic-orbit'
  | 'deep-space'
  | 'neon-spiral'
  | 'gentle-8d'
  | 'wide-cinema'
  | 'floating-dream'
  | 'figure-eight'
  | 'pendulum'

export interface SpatialOptions {
  mode: SpatialMode
  preset: SpatialPreset
  speedSec: number // Duration in seconds for one full orbit cycle (e.g. 4 to 24s)
  radius: number // Distance in meters (1 to 6m, default 2.8m)
  direction: 1 | -1 // 1 = Clockwise, -1 = Counter-Clockwise
  elevation: number // Vertical modulation in meters (-2m to +2m)
  depthRatio: number // Elliptical front/back factor (0.5 to 1.5)
  widthRatio: number // Left/right width factor (0.5 to 1.5)
  reverbPreset: 'off' | 'studio' | 'hall' | 'cosmic'
  reverbWet: number // 0.0 to 0.45 (default 0.15)
  bassPreservation: number // 0.0 (off) to 1.0 (maximum, default 0.7)
  outputGain: number // Master gain (0.5 to 1.5, default 1.0)
}

export interface SpatialCoordinate {
  x: number // Left (-) to Right (+) in meters
  y: number // Down (-) to Up (+) in meters (elevation)
  z: number // Front (-) to Back (+) in meters (depth)
  azimuthDeg: number // 0 to 360 degrees around horizontal plane
  distance: number // Euclidean distance from listener at (0, 0, 0)
}

export const PRESET_CONFIGS: Record<SpatialPreset, Partial<SpatialOptions>> = {
  '360-rotation': {
    speedSec: 8.0,
    radius: 3.0,
    direction: 1,
    elevation: 0.0,
    depthRatio: 1.0,
    widthRatio: 1.0,
    reverbPreset: 'studio',
    reverbWet: 0.14,
    bassPreservation: 0.75,
  },
  flyby: {
    speedSec: 6.0,
    radius: 3.0,
    direction: 1,
    elevation: 0.0,
    depthRatio: 0.8,
    widthRatio: 1.4,
    reverbPreset: 'studio',
    reverbWet: 0.16,
    bassPreservation: 0.7,
  },
  'front-back': {
    speedSec: 7.5,
    radius: 3.2,
    direction: 1,
    elevation: 0.5,
    depthRatio: 1.3,
    widthRatio: 0.6,
    reverbPreset: 'studio',
    reverbWet: 0.15,
    bassPreservation: 0.75,
  },
  'slow-cinematic': {
    speedSec: 16.0,
    radius: 3.8,
    direction: 1,
    elevation: 0.8,
    depthRatio: 1.1,
    widthRatio: 1.3,
    reverbPreset: 'hall',
    reverbWet: 0.22,
    bassPreservation: 0.8,
  },
  'fast-spin': {
    speedSec: 4.0,
    radius: 2.6,
    direction: 1,
    elevation: 0.0,
    depthRatio: 1.0,
    widthRatio: 1.0,
    reverbPreset: 'studio',
    reverbWet: 0.12,
    bassPreservation: 0.75,
  },
  stationary: {
    speedSec: 8.0,
    radius: 2.5,
    direction: 1,
    elevation: 0.0,
    depthRatio: 1.0,
    widthRatio: 1.0,
    reverbPreset: 'off',
    reverbWet: 0.0,
    bassPreservation: 1.0,
  },
  'cosmic-orbit': {
    speedSec: 9.0,
    radius: 3.2,
    direction: 1,
    elevation: 0.6,
    depthRatio: 1.1,
    widthRatio: 1.1,
    reverbPreset: 'cosmic',
    reverbWet: 0.22,
    bassPreservation: 0.75,
  },
  'deep-space': {
    speedSec: 14.0,
    radius: 4.2,
    direction: 1,
    elevation: 0.9,
    depthRatio: 1.2,
    widthRatio: 1.2,
    reverbPreset: 'hall',
    reverbWet: 0.26,
    bassPreservation: 0.8,
  },
  'neon-spiral': {
    speedSec: 7.0,
    radius: 2.8,
    direction: 1,
    elevation: 1.2,
    depthRatio: 1.0,
    widthRatio: 1.2,
    reverbPreset: 'studio',
    reverbWet: 0.16,
    bassPreservation: 0.7,
  },
  'gentle-8d': {
    speedSec: 12.0,
    radius: 2.2,
    direction: 1,
    elevation: 0.2,
    depthRatio: 0.95,
    widthRatio: 1.0,
    reverbPreset: 'studio',
    reverbWet: 0.1,
    bassPreservation: 0.85,
  },
  'wide-cinema': {
    speedSec: 10.0,
    radius: 3.6,
    direction: 1,
    elevation: 0.5,
    depthRatio: 0.85,
    widthRatio: 1.35,
    reverbPreset: 'hall',
    reverbWet: 0.2,
    bassPreservation: 0.75,
  },
  'floating-dream': {
    speedSec: 11.0,
    radius: 3.0,
    direction: -1,
    elevation: 1.5,
    depthRatio: 1.1,
    widthRatio: 1.0,
    reverbPreset: 'cosmic',
    reverbWet: 0.24,
    bassPreservation: 0.7,
  },
  'figure-eight': {
    speedSec: 8.5,
    radius: 3.0,
    direction: 1,
    elevation: 0.7,
    depthRatio: 1.0,
    widthRatio: 1.1,
    reverbPreset: 'studio',
    reverbWet: 0.15,
    bassPreservation: 0.75,
  },
  pendulum: {
    speedSec: 6.5,
    radius: 3.2,
    direction: 1,
    elevation: 0.4,
    depthRatio: 0.6,
    widthRatio: 1.3,
    reverbPreset: 'studio',
    reverbWet: 0.14,
    bassPreservation: 0.8,
  },
}

/**
 * Calculate deterministic 3D spatial coordinates at time t (seconds)
 */
export function getSpatialCoordinates(timeSec: number, options: SpatialOptions): SpatialCoordinate {
  const speed = Math.max(1.0, options.speedSec)
  const dir = options.direction === -1 ? -1 : 1
  const omega = ((2 * Math.PI) / speed) * dir
  const theta = omega * timeSec

  const r = Math.max(0.5, options.radius)
  const w = options.widthRatio
  const d = options.depthRatio
  const elev = options.elevation

  let x = 0
  let y = 0
  let z = -r // Web Audio convention: -Z is Front, +Z is Back

  if (options.preset === 'stationary') {
    // Stationary Stereo (fixed front listening position)
    x = 0
    y = 0
    z = -2.5
  } else if (options.preset === 'flyby') {
    // Left-to-Right Flyby across front soundstage
    const phi = Math.sin(theta)
    x = r * 1.5 * phi * w
    z = -r * (0.6 + 0.3 * (1 - phi * phi)) * d
    y = 0
  } else if (options.preset === 'front-back') {
    // Front-to-Back Orbit
    x = r * 0.35 * Math.sin(2 * theta) * w
    z = -r * Math.cos(theta) * d
    y = elev * 0.35 * Math.sin(theta)
  } else if (options.preset === 'slow-cinematic') {
    // Slow Cinematic Orbit with gentle elevation sweep
    x = r * 1.25 * Math.sin(theta) * w
    z = -r * Math.cos(theta) * d
    y = elev * 0.5 * Math.sin(2 * theta)
  } else if (options.preset === 'fast-spin' || options.preset === '360-rotation' || options.mode === '8d') {
    // Pure 360-degree horizontal circular head rotation
    x = r * Math.sin(theta) * w
    z = -r * Math.cos(theta) * d
    y = 0
  } else if (options.mode === '16d') {
    // Multi-axis 3D movement: horizontal rotation + undulating elevation + depth oscillation
    x = r * Math.sin(theta) * w
    z = -(r * (0.9 + 0.2 * Math.cos(2 * theta))) * Math.cos(theta) * d
    y = elev * Math.sin(2 * theta + Math.PI / 4)
  } else if (options.preset === 'figure-eight') {
    // Lissajous infinity curve
    x = r * Math.sin(theta) * w
    z = -(r * 0.75) * Math.sin(2 * theta) * d
    y = elev * 0.6 * Math.cos(theta)
  } else if (options.preset === 'pendulum') {
    // Arc sweeping left to right in front of listener
    const phi = Math.sin(theta)
    x = r * phi * w
    z = -r * Math.sqrt(Math.max(0.1, 1 - 0.5 * phi * phi)) * d
    y = elev * (1 - phi * phi) * 0.5
  } else if (options.preset === 'neon-spiral') {
    // Pulsing spiral orbit
    const rEff = r * (0.7 + 0.3 * Math.sin(theta / 3))
    x = rEff * Math.sin(theta) * w
    z = -rEff * Math.cos(theta) * d
    y = elev * Math.sin(theta / 2)
  } else {
    // General trajectory with width, depth, elevation controls
    x = r * Math.sin(theta) * w
    z = -r * Math.cos(theta) * d
    y = elev * Math.sin(theta * 1.5)
  }

  // Calculate distance and azimuth (angle in degrees 0-360)
  const dist = Math.sqrt(x * x + y * y + z * z)
  // In X-Z plane, standard angle from front (-Z) clockwise:
  // atan2(x, -z): when z = -r, x = 0 -> atan2(0, r) = 0 deg
  let rad = Math.atan2(x, -z)
  if (rad < 0) rad += 2 * Math.PI
  const azimuthDeg = Math.round((rad * 180) / Math.PI)

  const cleanX = Math.abs(x) < 0.0001 ? 0 : parseFloat(x.toFixed(3))
  const cleanY = Math.abs(y) < 0.0001 ? 0 : parseFloat(y.toFixed(3))
  const cleanZ = Math.abs(z) < 0.0001 ? 0 : parseFloat(z.toFixed(3))

  return {
    x: cleanX === 0 ? 0 : cleanX,
    y: cleanY === 0 ? 0 : cleanY,
    z: cleanZ === 0 ? 0 : cleanZ,
    azimuthDeg,
    distance: parseFloat(dist.toFixed(2)),
  }
}

/**
 * Synthesize algorithmic room impulse responses locally without network requests
 */
export function createSyntheticImpulseResponse(
  audioCtx: BaseAudioContext,
  preset: 'studio' | 'hall' | 'cosmic'
): AudioBuffer {
  const sampleRate = audioCtx.sampleRate
  let duration = 1.2
  let decayRate = 3.5
  let preDelayMs = 15

  if (preset === 'studio') {
    duration = 1.1
    decayRate = 4.2
    preDelayMs = 12
  } else if (preset === 'hall') {
    duration = 2.4
    decayRate = 2.4
    preDelayMs = 28
  } else if (preset === 'cosmic') {
    duration = 3.8
    decayRate = 1.6
    preDelayMs = 45
  }

  const length = Math.max(1, Math.floor(sampleRate * duration))
  const preDelaySamples = Math.floor((preDelayMs / 1000) * sampleRate)
  const buffer = audioCtx.createBuffer(2, length, sampleRate)
  const left = buffer.getChannelData(0)
  const right = buffer.getChannelData(1)

  for (let i = 0; i < length; i++) {
    if (i < preDelaySamples) {
      left[i] = 0
      right[i] = 0
      continue
    }

    const t = (i - preDelaySamples) / sampleRate
    const envelope = Math.exp(-t * decayRate)

    // Mild stereo decorrelation
    const noiseL = (Math.random() * 2 - 1) * envelope
    const noiseR = (Math.random() * 2 - 1) * envelope

    // Soft low-pass damping over time
    const damping = Math.max(0.1, 1 - (i / length) * 0.7)
    left[i] = noiseL * damping * 0.35
    right[i] = noiseR * damping * 0.35
  }

  return buffer
}

/**
 * Synthesize a 5-second spatial demo test track
 * Contains arpeggiated melodic synth + stereo wide chords + soft bass kick
 */
export async function generateSpatialDemoSpecimen(): Promise<File> {
  const sampleRate = 44100
  const duration = 5.0
  const totalSamples = Math.floor(sampleRate * duration)

  const offlineCtx = new OfflineAudioContext(2, totalSamples, sampleRate)

  // 1. Kick beat on beats 0, 1.25, 2.5, 3.75
  for (let t = 0; t < duration - 0.5; t += 1.25) {
    const kickOsc = offlineCtx.createOscillator()
    const kickGain = offlineCtx.createGain()
    kickOsc.frequency.setValueAtTime(120, t)
    kickOsc.frequency.exponentialRampToValueAtTime(45, t + 0.28)
    kickGain.gain.setValueAtTime(0.5, t)
    kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
    kickOsc.connect(kickGain)
    kickGain.connect(offlineCtx.destination)
    kickOsc.start(t)
    kickOsc.stop(t + 0.4)
  }

  // 2. Melodic Synthwave Arpeggio (Notes: A4, C5, E5, G5, E5, C5)
  const notes = [440, 523.25, 659.25, 783.99, 659.25, 523.25]
  const stepTime = 0.25
  let noteIndex = 0

  for (let t = 0; t < duration - 0.2; t += stepTime) {
    const freq = notes[noteIndex % notes.length]
    noteIndex++

    const osc = offlineCtx.createOscillator()
    const gain = offlineCtx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(freq, t)

    gain.gain.setValueAtTime(0.18, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + stepTime * 0.9)

    osc.connect(gain)
    gain.connect(offlineCtx.destination)
    osc.start(t)
    osc.stop(t + stepTime)
  }

  // 3. Warm Ambient Stereo Pad
  const padL = offlineCtx.createOscillator()
  const padR = offlineCtx.createOscillator()
  const padGain = offlineCtx.createGain()
  padL.type = 'triangle'
  padR.type = 'sine'
  padL.frequency.value = 220 // A3
  padR.frequency.value = 277.18 // C#4
  padGain.gain.value = 0.12
  padL.connect(padGain)
  padR.connect(padGain)
  padGain.connect(offlineCtx.destination)
  padL.start(0)
  padR.start(0)
  padL.stop(duration)
  padR.stop(duration)

  const renderedBuffer = await offlineCtx.startRendering()

  const { encodeAudioBufferToWav } = await import('./encoders/wavEncoder')
  const blob = await encodeAudioBufferToWav(renderedBuffer)

  return new File([blob], 'Orbit_Spatial_Audio_Specimen.wav', { type: 'audio/wav' })
}

/**
 * Render complete spatial track offline using OfflineAudioContext
 * Synchronously schedules deterministic HRTF trajectories, room reverb, and centered bass crossover.
 */
export async function renderOfflineSpatialAudio(
  sourceBuffer: AudioBuffer,
  options: SpatialOptions,
  onProgress?: (percent: number) => void,
  isCancelled?: () => boolean
): Promise<AudioBuffer> {
  const duration = sourceBuffer.duration
  const sampleRate = sourceBuffer.sampleRate
  const totalSamples = Math.floor(duration * sampleRate)

  const offlineCtx = new OfflineAudioContext(2, totalSamples, sampleRate)

  // 1. Source Node
  const sourceNode = offlineCtx.createBufferSource()
  sourceNode.buffer = sourceBuffer

  // Master Limiter / Output Gain
  const masterGain = offlineCtx.createGain()
  masterGain.gain.value = Math.max(0.1, Math.min(2.0, options.outputGain))
  masterGain.connect(offlineCtx.destination)

  // Bass Preservation Crossover
  const hasBassPreservation = options.bassPreservation > 0
  const crossoverFreq = 130 // Hz

  let highPassSource: AudioNode = sourceNode

  if (hasBassPreservation) {
    // Low-Pass Branch for Centered Sub-Bass
    const lowPassFilter = offlineCtx.createBiquadFilter()
    lowPassFilter.type = 'lowpass'
    lowPassFilter.frequency.value = crossoverFreq
    lowPassFilter.Q.value = 0.7071

    const bassGain = offlineCtx.createGain()
    bassGain.gain.value = options.bassPreservation
    sourceNode.connect(lowPassFilter)
    lowPassFilter.connect(bassGain)
    bassGain.connect(masterGain)

    // High-Pass Branch for Spatial Panning
    const highPassFilter = offlineCtx.createBiquadFilter()
    highPassFilter.type = 'highpass'
    highPassFilter.frequency.value = crossoverFreq
    highPassFilter.Q.value = 0.7071
    sourceNode.connect(highPassFilter)
    highPassSource = highPassFilter
  }

  // Spatial Panner Node
  const panner = offlineCtx.createPanner()
  panner.panningModel = 'HRTF'
  panner.distanceModel = 'inverse'
  panner.refDistance = 1.0
  panner.maxDistance = 10000
  panner.rolloffFactor = 0.8
  panner.coneInnerAngle = 360

  highPassSource.connect(panner)

  // Schedule deterministic spatial trajectory every 50ms
  const stepSec = 0.05
  for (let t = 0; t < duration; t += stepSec) {
    const coord = getSpatialCoordinates(t, options)
    try {
      if (panner.positionX) {
        panner.positionX.setValueAtTime(coord.x, t)
        panner.positionY.setValueAtTime(coord.y, t)
        panner.positionZ.setValueAtTime(coord.z, t)
      } else {
        ;(panner as unknown as { setPosition: (x: number, y: number, z: number) => void }).setPosition(coord.x, coord.y, coord.z)
      }
    } catch {
      // ignore
    }
  }

  // Dry spatial path to master
  const dryGain = offlineCtx.createGain()
  const wetMix = options.reverbPreset === 'off' ? 0 : Math.min(0.45, options.reverbWet)
  dryGain.gain.value = Math.max(0.6, 1.0 - wetMix * 0.8)
  panner.connect(dryGain)
  dryGain.connect(masterGain)

  // Wet Spatial Reverb Branch
  if (options.reverbPreset !== 'off' && wetMix > 0) {
    const convolver = offlineCtx.createConvolver()
    convolver.buffer = createSyntheticImpulseResponse(offlineCtx, options.reverbPreset)
    const reverbGain = offlineCtx.createGain()
    reverbGain.gain.value = wetMix
    panner.connect(convolver)
    convolver.connect(reverbGain)
    reverbGain.connect(masterGain)
  }

  sourceNode.start(0)

  onProgress?.(30)

  if (isCancelled?.()) {
    throw new Error('Export cancelled by user.')
  }

  const rendered = await offlineCtx.startRendering()
  onProgress?.(60)

  return rendered
}
