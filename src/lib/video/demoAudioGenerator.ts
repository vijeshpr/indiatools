/**
 * IndiaTools — Audio Spectrum Video Studio 2.0
 * Algorithmic in-browser synthesizer generating 3 distinct demo compositions
 * (Electronic Synthwave, Lo-Fi Chill, and Cinematic Ambient) with zero external assets.
 */

export type DemoAudioGenre = 'synthwave' | 'lofi' | 'cinematic'

export interface DemoTrackMeta {
  id: DemoAudioGenre
  name: string
  bpm: number
  duration: number
  description: string
}

export const DEMO_TRACKS: DemoTrackMeta[] = [
  { id: 'synthwave', name: 'Synthwave Night Pulse (124 BPM)', bpm: 124, duration: 16.0, description: 'Punchy 808 sub-kick, crisp 16th hats, and driving sawtooth bassline' },
  { id: 'lofi', name: 'Lo-Fi Midnight Chill (85 BPM)', bpm: 85, duration: 16.0, description: 'Warm electric piano Rhodes chords, relaxed sub-bass, and soft vinyl acoustic air' },
  { id: 'cinematic', name: 'Cinematic Ambient Pulse (90 BPM)', bpm: 90, duration: 16.0, description: 'Dramatic sub-bass crescendo, orchestral sine sweeps, and celestial harmonics' },
]

/**
 * Generate an in-browser audio demo file
 */
export async function generateVisualizerDemoSpecimen(genre: DemoAudioGenre = 'synthwave'): Promise<File> {
  const sampleRate = 44100
  const duration = 16.0
  const offlineCtx = new (window.OfflineAudioContext || (window as any).webkitOfflineAudioContext)(
    2,
    Math.floor(sampleRate * duration),
    sampleRate
  )

  if (genre === 'lofi') {
    generateLoFiTrack(offlineCtx, duration)
  } else if (genre === 'cinematic') {
    generateCinematicTrack(offlineCtx, duration)
  } else {
    generateSynthwaveTrack(offlineCtx, duration)
  }

  const renderedBuffer = await offlineCtx.startRendering()
  const wavBlob = audioBufferToWavBlob(renderedBuffer)

  const filename = `indiatools-demo-${genre}-${Date.now()}.wav`
  return new File([wavBlob], filename, { type: 'audio/wav' })
}

function generateSynthwaveTrack(ctx: OfflineAudioContext, duration: number) {
  const bpm = 124
  const beatSec = 60 / bpm

  // 1. Punchy Kick Drum
  for (let t = 0; t < duration - 0.1; t += beatSec) {
    const kickOsc = ctx.createOscillator()
    const kickGain = ctx.createGain()
    kickOsc.type = 'sine'
    kickOsc.frequency.setValueAtTime(150, t)
    kickOsc.frequency.exponentialRampToValueAtTime(38, t + 0.18)
    kickGain.gain.setValueAtTime(0.75, t)
    kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.28)
    kickOsc.connect(kickGain)
    kickGain.connect(ctx.destination)
    kickOsc.start(t)
    kickOsc.stop(t + 0.3)
  }

  // 2. Crisp Hi-Hats
  const step16th = beatSec / 4
  for (let t = 0; t < duration - 0.05; t += step16th) {
    const bufferSize = ctx.sampleRate * 0.04
    const noiseBuffer = ctx.createBuffer(1, Math.floor(bufferSize), ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }

    const whiteNoise = ctx.createBufferSource()
    whiteNoise.buffer = noiseBuffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 7500

    const hatGain = ctx.createGain()
    hatGain.gain.setValueAtTime(0.12, t)
    hatGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035)

    whiteNoise.connect(filter)
    filter.connect(hatGain)
    hatGain.connect(ctx.destination)

    whiteNoise.start(t)
    whiteNoise.stop(t + 0.04)
  }

  // 3. Sawtooth Bassline
  const bassNotes = [65.41, 98.0, 116.54, 87.31] // C2, G2, A#2, F2
  const noteDuration = beatSec * 2
  let noteIndex = 0

  for (let t = 0; t < duration - 0.2; t += noteDuration) {
    const freq = bassNotes[noteIndex % bassNotes.length]
    noteIndex++

    const osc = ctx.createOscillator()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(freq, t)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(900, t)
    filter.frequency.exponentialRampToValueAtTime(250, t + noteDuration * 0.9)

    gain.gain.setValueAtTime(0.3, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + noteDuration * 0.95)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.start(t)
    osc.stop(t + noteDuration)
  }

  // 4. Arpeggiator Lead
  const leadNotes = [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25]
  const arpStep = beatSec / 2
  let leadIndex = 0

  for (let t = 0; t < duration - 0.1; t += arpStep) {
    const freq = leadNotes[leadIndex % leadNotes.length]
    leadIndex++

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, t)

    gain.gain.setValueAtTime(0.14, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + arpStep * 0.85)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(t)
    osc.stop(t + arpStep)
  }
}

function generateLoFiTrack(ctx: OfflineAudioContext, duration: number) {
  const bpm = 85
  const beatSec = 60 / bpm

  // Warm Rhodes Electric Piano Chords (Dm7, G7, Cmaj7, Am7)
  const chordSets = [
    [293.66, 349.23, 440.0, 523.25], // D4, F4, A4, C5
    [392.0, 493.88, 587.33, 698.46], // G4, B4, D5, F5
    [261.63, 329.63, 392.0, 493.88], // C4, E4, G4, B4
    [220.0, 261.63, 329.63, 392.0], // A3, C4, E4, G4
  ]

  const chordDuration = beatSec * 4
  let cIdx = 0

  for (let t = 0; t < duration - 0.5; t += chordDuration) {
    const chord = chordSets[cIdx % chordSets.length]
    cIdx++

    for (const freq of chord) {
      const osc = ctx.createOscillator()
      const filter = ctx.createBiquadFilter()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, t)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(1400, t)

      gain.gain.setValueAtTime(0.1, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + chordDuration * 0.95)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      osc.start(t)
      osc.stop(t + chordDuration)
    }
  }

  // Soft Lo-Fi Kick & Snare
  for (let t = 0; t < duration - 0.2; t += beatSec * 2) {
    // Kick on 1
    const kick = ctx.createOscillator()
    const kGain = ctx.createGain()
    kick.type = 'sine'
    kick.frequency.setValueAtTime(110, t)
    kick.frequency.exponentialRampToValueAtTime(45, t + 0.15)
    kGain.gain.setValueAtTime(0.5, t)
    kGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22)
    kick.connect(kGain)
    kGain.connect(ctx.destination)
    kick.start(t)
    kick.stop(t + 0.25)

    // Soft Rimshot / Snare on 2
    const snareT = t + beatSec
    const snareOsc = ctx.createOscillator()
    const sGain = ctx.createGain()
    snareOsc.type = 'triangle'
    snareOsc.frequency.setValueAtTime(220, snareT)
    sGain.gain.setValueAtTime(0.25, snareT)
    sGain.gain.exponentialRampToValueAtTime(0.001, snareT + 0.12)
    snareOsc.connect(sGain)
    sGain.connect(ctx.destination)
    snareOsc.start(snareT)
    snareOsc.stop(snareT + 0.15)
  }
}

function generateCinematicTrack(ctx: OfflineAudioContext, duration: number) {
  // Deep Sub Drone Swell + Celestial Harmonics
  const rootFreq = 55.0 // A1

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(rootFreq, 0)

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(180, 0)
  filter.frequency.linearRampToValueAtTime(950, duration * 0.7)

  gain.gain.setValueAtTime(0.05, 0)
  gain.gain.linearRampToValueAtTime(0.4, duration * 0.5)
  gain.gain.exponentialRampToValueAtTime(0.001, duration - 0.2)

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  osc.start(0)
  osc.stop(duration)

  // Celestial Harmonics (A3, C#4, E4)
  const harmonics = [220.0, 277.18, 329.63, 440.0]
  for (const hFreq of harmonics) {
    const hOsc = ctx.createOscillator()
    const hGain = ctx.createGain()
    hOsc.type = 'sine'
    hOsc.frequency.setValueAtTime(hFreq, 0)
    hGain.gain.setValueAtTime(0.05, 0)
    hGain.gain.linearRampToValueAtTime(0.12, duration * 0.6)
    hGain.gain.exponentialRampToValueAtTime(0.001, duration - 0.1)

    hOsc.connect(hGain)
    hGain.connect(ctx.destination)
    hOsc.start(0)
    hOsc.stop(duration)
  }
}

/**
 * Encodes AudioBuffer into uncompressed 16-bit PCM WAV Blob
 */
function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels
  const sampleRate = buffer.sampleRate
  const format = 1 // PCM
  const bitDepth = 16

  const channelData = []
  for (let c = 0; c < numChannels; c++) {
    channelData.push(buffer.getChannelData(c))
  }

  const numSamples = buffer.length
  const byteRate = (sampleRate * numChannels * bitDepth) / 8
  const blockAlign = (numChannels * bitDepth) / 8
  const dataSize = numSamples * numChannels * 2
  const bufferSize = 44 + dataSize

  const arrayBuffer = new ArrayBuffer(bufferSize)
  const view = new DataView(arrayBuffer)

  // RIFF Chunk Descriptor
  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(view, 8, 'WAVE')

  // fmt Sub-chunk
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, format, true)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitDepth, true)

  // data Sub-chunk
  writeString(view, 36, 'data')
  view.setUint32(40, dataSize, true)

  // Interleave and write 16-bit PCM samples
  let offset = 44
  for (let i = 0; i < numSamples; i++) {
    for (let c = 0; c < numChannels; c++) {
      let sample = channelData[c][i]
      sample = Math.max(-1, Math.min(1, sample))
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff
      view.setInt16(offset, intSample, true)
      offset += 2
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' })
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}
