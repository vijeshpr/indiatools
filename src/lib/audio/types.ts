export type AudioFormat = 'mp3' | 'wav' | 'ogg' | 'flac' | 'm4a' | 'aac' | 'webm' | 'aiff'

export type AudioQualityPreset = 'small' | 'balanced' | 'high'

export type AudioChannelsOption = 'original' | 'mono' | 'stereo'

export interface AudioConversionOptions {
  outputFormat: AudioFormat
  preset: AudioQualityPreset
  mp3Bitrate: 64 | 96 | 128 | 160 | 192 | 256 | 320
  sampleRate: number // 0 means original, or 22050, 32000, 44100, 48000
  channels: AudioChannelsOption
  volume: number // 1.0 = default (0.25 to 2.0)
  normalize: boolean
  customFilename?: string
}

export type ConversionStage =
  | 'idle'
  | 'reading'
  | 'decoding'
  | 'processing'
  | 'encoding'
  | 'finalizing'
  | 'complete'
  | 'error'

export interface ConversionProgress {
  stage: ConversionStage
  stageLabel: string
  percent: number // 0 to 100
  details?: string
}

export interface AudioMetadata {
  format: AudioFormat
  fileName: string
  fileSize: number
  duration: number
  sampleRate: number
  numberOfChannels: number
  bitrateEstimate?: number
}

export interface ConversionResult {
  blob: Blob
  url: string
  filename: string
  outputFormat: AudioFormat
  fileSize: number
  duration: number
  sampleRate: number
  numberOfChannels: number
  bitrateEstimate?: number
}

export interface FormatCapability {
  format: AudioFormat
  label: string
  extension: string
  mimeType: string
  canDecode: boolean
  canEncode: boolean
  description: string
  note?: string
}
