import {
  AudioConversionOptions,
  AudioFormat,
  AudioMetadata,
  ConversionProgress,
  ConversionResult,
} from './types'
import { detectAudioFormat } from './formatCapabilities'
import { encodeAudioBufferToWav } from './encoders/wavEncoder'
import { encodeAudioBufferToMp3 } from './encoders/mp3Encoder'
import { encodeAudioBufferWithMediaRecorder } from './encoders/mediaRecorderEncoder'

/**
 * Decode audio file into an AudioBuffer using browser Web Audio API
 */
export async function decodeAudioFile(
  file: File,
  onProgress?: (progress: ConversionProgress) => void
): Promise<{ buffer: AudioBuffer; metadata: AudioMetadata }> {
  onProgress?.({
    stage: 'reading',
    stageLabel: 'Reading file into device memory...',
    percent: 15,
  })

  const arrayBuffer = await file.arrayBuffer()

  onProgress?.({
    stage: 'decoding',
    stageLabel: 'Decoding audio stream via Web Audio API...',
    percent: 30,
  })

  // Use OfflineAudioContext or AudioContext to decode
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()

  let audioBuffer: AudioBuffer
  try {
    audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
  } catch (err: any) {
    try {
      audioCtx.close()
    } catch {
      // ignore
    }
    const detected = detectAudioFormat(file)
    throw new Error(
      `Could not decode ${detected.toUpperCase()} audio file. The file may be corrupt, DRM-protected, or encoded with a codec not supported natively by your browser engine.`
    )
  } finally {
    try {
      audioCtx.close()
    } catch {
      // ignore
    }
  }

  const detectedFormat = detectAudioFormat(file)
  const duration = audioBuffer.duration
  const bitrateEstimate =
    duration > 0 ? Math.round((file.size * 8) / duration / 1000) : undefined

  const metadata: AudioMetadata = {
    format: detectedFormat,
    fileName: file.name,
    fileSize: file.size,
    duration,
    sampleRate: audioBuffer.sampleRate,
    numberOfChannels: audioBuffer.numberOfChannels,
    bitrateEstimate,
  }

  return { buffer: audioBuffer, metadata }
}

/**
 * Apply user audio processing (resampling, channel mix, volume gain, peak normalization)
 */
export async function processAudioBuffer(
  inputBuffer: AudioBuffer,
  options: AudioConversionOptions,
  onProgress?: (progress: ConversionProgress) => void,
  isCancelled?: () => boolean
): Promise<AudioBuffer> {
  onProgress?.({
    stage: 'processing',
    stageLabel: 'Processing channels, sample rate & acoustics...',
    percent: 45,
  })

  if (isCancelled?.()) throw new Error('Conversion cancelled by user.')

  // Determine target sample rate
  const targetSampleRate =
    options.sampleRate > 0 ? options.sampleRate : inputBuffer.sampleRate

  // Determine target channel count
  let targetChannels = inputBuffer.numberOfChannels
  if (options.channels === 'mono') {
    targetChannels = 1
  } else if (options.channels === 'stereo') {
    targetChannels = 2
  }

  // Resample / Remix using OfflineAudioContext for pristine band-limited sinc interpolation
  const needsResample =
    targetSampleRate !== inputBuffer.sampleRate ||
    targetChannels !== inputBuffer.numberOfChannels

  let processedBuffer = inputBuffer

  if (needsResample) {
    const targetLength = Math.ceil(inputBuffer.duration * targetSampleRate)
    const offlineCtx = new OfflineAudioContext(
      targetChannels,
      targetLength,
      targetSampleRate
    )

    const source = offlineCtx.createBufferSource()
    source.buffer = inputBuffer

    // Handle channel downmixing / upmixing safely
    if (inputBuffer.numberOfChannels > 1 && targetChannels === 1) {
      // Mix stereo down to mono
      const merger = offlineCtx.createChannelMerger(1)
      source.connect(merger)
      merger.connect(offlineCtx.destination)
    } else {
      source.connect(offlineCtx.destination)
    }

    source.start(0)
    processedBuffer = await offlineCtx.startRendering()
  }

  if (isCancelled?.()) throw new Error('Conversion cancelled by user.')

  // Apply volume gain and peak normalization
  const numChannels = processedBuffer.numberOfChannels
  const length = processedBuffer.length
  const volumeMultiplier = Math.max(0.25, Math.min(2.0, options.volume))

  // Find peak amplitude across all channels if normalize is enabled or volume changed
  let maxPeak = 0
  for (let ch = 0; ch < numChannels; ch++) {
    const data = processedBuffer.getChannelData(ch)
    for (let i = 0; i < length; i++) {
      const absVal = Math.abs(data[i])
      if (absVal > maxPeak) maxPeak = absVal
    }
  }

  let finalGain = volumeMultiplier
  if (options.normalize && maxPeak > 0.001) {
    // Target -0.3 dBFS (0.96) peak ceiling to avoid clipping inter-sample peaks
    const normFactor = 0.96 / maxPeak
    finalGain *= normFactor
  }

  // If gain adjustment is required, apply directly to samples
  if (Math.abs(finalGain - 1.0) > 0.005) {
    for (let ch = 0; ch < numChannels; ch++) {
      const data = processedBuffer.getChannelData(ch)
      for (let i = 0; i < length; i++) {
        data[i] = Math.max(-1, Math.min(1, data[i] * finalGain))
      }
    }
  }

  return processedBuffer
}

/**
 * Master conversion pipeline: orchestrates decoding, processing, and encoding
 */
export async function convertAudioFile(
  file: File,
  options: AudioConversionOptions,
  onProgress?: (progress: ConversionProgress) => void,
  isCancelled?: () => boolean
): Promise<ConversionResult> {
  // 1. Decode
  const { buffer: rawBuffer, metadata } = await decodeAudioFile(file, onProgress)

  if (isCancelled?.()) throw new Error('Conversion cancelled by user.')

  // 2. Process & Resample
  const processedBuffer = await processAudioBuffer(rawBuffer, options, onProgress, isCancelled)

  if (isCancelled?.()) throw new Error('Conversion cancelled by user.')

  // 3. Encode to target format
  onProgress?.({
    stage: 'encoding',
    stageLabel: `Encoding audio to ${options.outputFormat.toUpperCase()}...`,
    percent: 60,
  })

  let outputBlob: Blob
  const targetFormat = options.outputFormat

  if (targetFormat === 'wav') {
    outputBlob = await encodeAudioBufferToWav(processedBuffer, {
      onProgress: (p) => {
        onProgress?.({
          stage: 'encoding',
          stageLabel: `Encoding WAV (16-bit PCM)... ${p}%`,
          percent: 60 + Math.round(p * 0.35),
        })
      },
      isCancelled,
    })
  } else if (targetFormat === 'mp3') {
    outputBlob = await encodeAudioBufferToMp3(processedBuffer, {
      kbps: options.mp3Bitrate,
      onProgress: (p) => {
        onProgress?.({
          stage: 'encoding',
          stageLabel: `Encoding MP3 (${options.mp3Bitrate} kbps)... ${p}%`,
          percent: 60 + Math.round(p * 0.35),
        })
      },
      isCancelled,
    })
  } else if (targetFormat === 'webm') {
    outputBlob = await encodeAudioBufferWithMediaRecorder(processedBuffer, {
      mimeType: 'audio/webm;codecs=opus',
      bitrate: options.mp3Bitrate,
      onProgress: (p) => {
        onProgress?.({
          stage: 'encoding',
          stageLabel: `Recording WebM Opus stream... ${p}%`,
          percent: 60 + Math.round(p * 0.35),
        })
      },
      isCancelled,
    })
  } else if (targetFormat === 'ogg') {
    // Check supported OGG mime type
    const mime = MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
      ? 'audio/ogg;codecs=opus'
      : 'audio/ogg'
    outputBlob = await encodeAudioBufferWithMediaRecorder(processedBuffer, {
      mimeType: mime,
      bitrate: options.mp3Bitrate,
      onProgress: (p) => {
        onProgress?.({
          stage: 'encoding',
          stageLabel: `Recording OGG Opus stream... ${p}%`,
          percent: 60 + Math.round(p * 0.35),
        })
      },
      isCancelled,
    })
  } else if (targetFormat === 'm4a' || targetFormat === 'aac') {
    const mime = MediaRecorder.isTypeSupported('audio/mp4;codecs=mp4a.40.2')
      ? 'audio/mp4;codecs=mp4a.40.2'
      : MediaRecorder.isTypeSupported('audio/mp4')
      ? 'audio/mp4'
      : 'audio/aac'
    outputBlob = await encodeAudioBufferWithMediaRecorder(processedBuffer, {
      mimeType: mime,
      bitrate: options.mp3Bitrate,
      onProgress: (p) => {
        onProgress?.({
          stage: 'encoding',
          stageLabel: `Recording AAC stream... ${p}%`,
          percent: 60 + Math.round(p * 0.35),
        })
      },
      isCancelled,
    })
  } else {
    // Fallback for formats without client-side encoder: export studio WAV
    outputBlob = await encodeAudioBufferToWav(processedBuffer, {
      onProgress: (p) => {
        onProgress?.({
          stage: 'encoding',
          stageLabel: `Encoding lossless PCM... ${p}%`,
          percent: 60 + Math.round(p * 0.35),
        })
      },
      isCancelled,
    })
  }

  // 4. Finalizing
  onProgress?.({
    stage: 'finalizing',
    stageLabel: 'Finalizing audio package and generating download link...',
    percent: 98,
  })

  // Format filename
  const baseName = (options.customFilename || file.name)
    .replace(/\.[^/.]+$/, '')
    .trim()
  const cleanBaseName = baseName || 'converted_audio'
  const outFilename = `${cleanBaseName}.${targetFormat}`

  const downloadUrl = URL.createObjectURL(outputBlob)

  const result: ConversionResult = {
    blob: outputBlob,
    url: downloadUrl,
    filename: outFilename,
    outputFormat: targetFormat,
    fileSize: outputBlob.size,
    duration: processedBuffer.duration,
    sampleRate: processedBuffer.sampleRate,
    numberOfChannels: processedBuffer.numberOfChannels,
    bitrateEstimate:
      targetFormat === 'mp3'
        ? options.mp3Bitrate
        : Math.round((outputBlob.size * 8) / processedBuffer.duration / 1000),
  }

  onProgress?.({
    stage: 'complete',
    stageLabel: 'Conversion complete!',
    percent: 100,
  })

  return result
}

/**
 * Generate a 3.5-second harmonic acoustic chime audio file in memory for instant demo testing
 */
export async function generateSampleAudioFile(): Promise<File> {
  const sampleRate = 44100
  const duration = 3.5
  const length = Math.floor(sampleRate * duration)
  const ctx = new OfflineAudioContext(2, length, sampleRate)

  const freqs = [261.63, 329.63, 392.0, 523.25, 659.25] // C Major 9 chord
  freqs.forEach((f, idx) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = idx % 2 === 0 ? 'sine' : 'triangle'
    osc.frequency.setValueAtTime(f, 0)

    const startTime = 0.08 * idx
    gain.gain.setValueAtTime(0.0001, 0)
    gain.gain.linearRampToValueAtTime(0.16 / (idx + 1), startTime + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.0001, duration - 0.1)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(startTime)
    osc.stop(duration)
  })

  const buffer = await ctx.startRendering()
  const wavBlob = await encodeAudioBufferToWav(buffer)
  return new File([wavBlob], 'IndiaTools_Sample_Audio.wav', { type: 'audio/wav' })
}
