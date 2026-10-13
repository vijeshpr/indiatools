/**
 * Algorithmic in-browser synthwave audio demo generator for instant visualizer preview
 */
export async function generateVisualizerDemoSpecimen(): Promise<File> {
  const sampleRate = 44100
  const duration = 16.0 // 16 seconds loopable electronic track
  const offlineCtx = new (window.OfflineAudioContext || (window as any).webkitOfflineAudioContext)(
    2,
    sampleRate * duration,
    sampleRate
  )

  const bpm = 124
  const beatSec = 60 / bpm

  // 1. Punchy Sub Kick Drum (every beat)
  for (let t = 0; t < duration - 0.1; t += beatSec) {
    const kickOsc = offlineCtx.createOscillator()
    const kickGain = offlineCtx.createGain()
    kickOsc.type = 'sine'
    kickOsc.frequency.setValueAtTime(140, t)
    kickOsc.frequency.exponentialRampToValueAtTime(38, t + 0.18)
    kickGain.gain.setValueAtTime(0.7, t)
    kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.28)
    kickOsc.connect(kickGain)
    kickGain.connect(offlineCtx.destination)
    kickOsc.start(t)
    kickOsc.stop(t + 0.3)
  }

  // 2. Crisp Hi-Hats (every 16th note)
  const step16th = beatSec / 4
  for (let t = 0; t < duration - 0.05; t += step16th) {
    // Generate burst of white noise
    const bufferSize = sampleRate * 0.04
    const noiseBuffer = offlineCtx.createBuffer(1, bufferSize, sampleRate)
    const output = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }

    const whiteNoise = offlineCtx.createBufferSource()
    whiteNoise.buffer = noiseBuffer

    const filter = offlineCtx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 7500

    const hatGain = offlineCtx.createGain()
    hatGain.gain.setValueAtTime(0.12, t)
    hatGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035)

    whiteNoise.connect(filter)
    filter.connect(hatGain)
    hatGain.connect(offlineCtx.destination)

    whiteNoise.start(t)
    whiteNoise.stop(t + 0.04)
  }

  // 3. Synthwave Bassline (Notes: C2, G2, A#2, F2)
  const bassNotes = [65.41, 98.0, 116.54, 87.31]
  const noteDuration = beatSec * 2
  let noteIndex = 0

  for (let t = 0; t < duration - 0.2; t += noteDuration) {
    const freq = bassNotes[noteIndex % bassNotes.length]
    noteIndex++

    const osc = offlineCtx.createOscillator()
    const filter = offlineCtx.createBiquadFilter()
    const gain = offlineCtx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(freq, t)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(800, t)
    filter.frequency.exponentialRampToValueAtTime(250, t + noteDuration * 0.9)

    gain.gain.setValueAtTime(0.28, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + noteDuration * 0.95)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(offlineCtx.destination)

    osc.start(t)
    osc.stop(t + noteDuration)
  }

  // 4. Melodic Lead Arpeggio
  const leadNotes = [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25]
  const arpStep = beatSec / 2
  let leadIndex = 0

  for (let t = 0; t < duration - 0.1; t += arpStep) {
    const freq = leadNotes[leadIndex % leadNotes.length]
    leadIndex++

    const osc = offlineCtx.createOscillator()
    const gain = offlineCtx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, t)

    gain.gain.setValueAtTime(0.18, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + arpStep * 0.85)

    osc.connect(gain)
    gain.connect(offlineCtx.destination)

    osc.start(t)
    osc.stop(t + arpStep)
  }

  // 5. Stereo Pad chords
  const padL = offlineCtx.createOscillator()
  const padR = offlineCtx.createOscillator()
  const padGain = offlineCtx.createGain()
  padL.type = 'sine'
  padR.type = 'sine'
  padL.frequency.value = 261.63 // C4
  padR.frequency.value = 329.63 // E4
  padGain.gain.value = 0.14
  padL.connect(padGain)
  padR.connect(padGain)
  padGain.connect(offlineCtx.destination)
  padL.start(0)
  padR.start(0)
  padL.stop(duration)
  padR.stop(duration)

  const renderedBuffer = await offlineCtx.startRendering()

  // Encode to WAV Blob
  const { encodeAudioBufferToWav } = await import('../audio/encoders/wavEncoder')
  const blob = await encodeAudioBufferToWav(renderedBuffer)

  return new File([blob], 'Cyberpunk_Neon_Visualizer_Specimen.wav', { type: 'audio/wav' })
}
