import { AudioFormat, FormatCapability } from './types'

export function detectAudioFormat(file: File): AudioFormat {
  const name = file.name.toLowerCase()
  const mime = file.type.toLowerCase()

  if (name.endsWith('.mp3') || mime.includes('audio/mpeg') || mime.includes('audio/mp3')) return 'mp3'
  if (name.endsWith('.wav') || mime.includes('audio/wav') || mime.includes('audio/wave')) return 'wav'
  if (name.endsWith('.ogg') || name.endsWith('.oga') || mime.includes('audio/ogg')) return 'ogg'
  if (name.endsWith('.flac') || mime.includes('audio/flac')) return 'flac'
  if (name.endsWith('.m4a') || mime.includes('audio/x-m4a') || mime.includes('audio/m4a')) return 'm4a'
  if (name.endsWith('.aac') || mime.includes('audio/aac')) return 'aac'
  if (name.endsWith('.webm') || mime.includes('audio/webm')) return 'webm'
  if (name.endsWith('.aif') || name.endsWith('.aiff') || mime.includes('audio/aiff') || mime.includes('audio/x-aiff')) return 'aiff'

  return 'mp3' // default fallback
}

export function getAvailableFormatCapabilities(): FormatCapability[] {
  const isMediaRecorderSupported = typeof window !== 'undefined' && typeof window.MediaRecorder !== 'undefined'

  const canEncodeWebM = isMediaRecorderSupported && (
    MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ||
    MediaRecorder.isTypeSupported('audio/webm')
  )

  const canEncodeOgg = isMediaRecorderSupported && (
    MediaRecorder.isTypeSupported('audio/ogg;codecs=opus') ||
    MediaRecorder.isTypeSupported('audio/ogg;codecs=vorbis') ||
    MediaRecorder.isTypeSupported('audio/ogg')
  )

  const canEncodeAac = isMediaRecorderSupported && (
    MediaRecorder.isTypeSupported('audio/mp4;codecs=mp4a.40.2') ||
    MediaRecorder.isTypeSupported('audio/mp4') ||
    MediaRecorder.isTypeSupported('audio/aac')
  )

  return [
    {
      format: 'mp3',
      label: 'MP3 (MPEG-1 Audio Layer III)',
      extension: '.mp3',
      mimeType: 'audio/mp3',
      canDecode: true,
      canEncode: true,
      description: 'Universal compatibility. Bundled in-browser LAME encoder with selectable 64–320 kbps bitrate.',
    },
    {
      format: 'wav',
      label: 'WAV (Waveform Audio File Format)',
      extension: '.wav',
      mimeType: 'audio/wav',
      canDecode: true,
      canEncode: true,
      description: 'Studio-grade uncompressed 16-bit linear PCM audio. 100% lossless bit-for-bit accuracy.',
    },
    {
      format: 'ogg',
      label: 'OGG (Ogg Vorbis / Opus)',
      extension: '.ogg',
      mimeType: 'audio/ogg',
      canDecode: true,
      canEncode: canEncodeOgg,
      description: 'Open-source container format with efficient lossy compression.',
      note: canEncodeOgg ? undefined : 'Not supported by this browser engine for direct encoding. Convert to MP3 or WAV instead.',
    },
    {
      format: 'webm',
      label: 'WebM Audio (Opus Codec)',
      extension: '.webm',
      mimeType: 'audio/webm',
      canDecode: true,
      canEncode: canEncodeWebM,
      description: 'Modern high-efficiency Opus web audio format backed by Google & Xiph.Org.',
      note: canEncodeWebM ? undefined : 'Not supported by this browser engine for direct encoding.',
    },
    {
      format: 'm4a',
      label: 'M4A (MPEG-4 Audio / AAC)',
      extension: '.m4a',
      mimeType: 'audio/mp4',
      canDecode: true,
      canEncode: canEncodeAac,
      description: 'Apple ecosystem standard format. Full client-side decoding supported.',
      note: canEncodeAac ? undefined : 'Client-side AAC encoding requires Safari/Chromium MP4 media recorder.',
    },
    {
      format: 'aac',
      label: 'AAC (Advanced Audio Coding)',
      extension: '.aac',
      mimeType: 'audio/aac',
      canDecode: true,
      canEncode: canEncodeAac,
      description: 'Advanced Audio Coding for high-fidelity streaming audio.',
      note: canEncodeAac ? undefined : 'Direct AAC encoding depends on browser MediaRecorder support.',
    },
    {
      format: 'flac',
      label: 'FLAC (Free Lossless Audio Codec)',
      extension: '.flac',
      mimeType: 'audio/flac',
      canDecode: true,
      canEncode: false,
      description: 'Lossless audio compression. In-browser decoding supported natively via Web Audio API.',
      note: 'FLAC decoding is fully supported. For lossless export, select uncompressed Studio WAV.',
    },
    {
      format: 'aiff',
      label: 'AIFF (Audio Interchange Format)',
      extension: '.aiff',
      mimeType: 'audio/aiff',
      canDecode: true,
      canEncode: false,
      description: 'Apple uncompressed PCM format. Full client-side decoding supported.',
      note: 'Decoding supported. For lossless export, select uncompressed Studio WAV.',
    },
  ]
}

export function estimateOutputSize(
  durationSec: number,
  format: AudioFormat,
  sampleRate: number,
  channels: number,
  mp3Bitrate: number
): number {
  if (durationSec <= 0) return 0
  if (format === 'wav') {
    return 44 + sampleRate * channels * 2 * durationSec
  }
  const effectiveBitrate = mp3Bitrate * 1000
  return Math.round((effectiveBitrate / 8) * durationSec)
}
