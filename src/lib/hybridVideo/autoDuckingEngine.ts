/**
 * IndiaTools — Hybrid Video Studio Auto-Ducking (Smart Audio Mix) Engine
 * 100% Client-Side Web Audio API Multi-Track Sidechain Volume Automation
 *
 * Automatically reduces background music gain when voice/dialogue is active,
 * holds through natural speech pauses, and smoothly restores music volume.
 */

import type {
  AutoDuckingConfig,
  AutoDuckingPresetId,
  TimelineClip,
  Track,
  MediaAsset,
} from './types.ts'

export interface AutoDuckingPreset {
  id: AutoDuckingPresetId
  name: string
  tagline: string
  description: string
  config: Partial<AutoDuckingConfig>
}

export const AUTO_DUCKING_PRESETS: AutoDuckingPreset[] = [
  {
    id: 'podcast',
    name: 'Podcast / Interview',
    tagline: 'Balanced Speech Recovery',
    description: 'Balanced -12 dB reduction with 0.08s attack and 0.6s hold to bridge conversational pauses.',
    config: {
      duckAmountDb: -12,
      thresholdDb: -28,
      attackSec: 0.08,
      holdSec: 0.6,
      releaseSec: 0.5,
      minMusicVolume: 0.15,
      preset: 'podcast',
    },
  },
  {
    id: 'voice-priority',
    name: 'Voice Priority / Narration',
    tagline: 'Maximum Speech Clarity',
    description: 'Strong -16 dB reduction with fast 0.05s attack, ideal for voiceovers, tutorials, and reels.',
    config: {
      duckAmountDb: -16,
      thresholdDb: -32,
      attackSec: 0.05,
      holdSec: 0.8,
      releaseSec: 0.4,
      minMusicVolume: 0.1,
      preset: 'voice-priority',
    },
  },
  {
    id: 'cinematic-dialogue',
    name: 'Cinematic Dialogue',
    tagline: 'Controlled Film Score',
    description: 'Controlled -9 dB reduction with slower 0.9s release that maintains cinematic score presence.',
    config: {
      duckAmountDb: -9,
      thresholdDb: -26,
      attackSec: 0.12,
      holdSec: 1.0,
      releaseSec: 0.9,
      minMusicVolume: 0.25,
      preset: 'cinematic-dialogue',
    },
  },
  {
    id: 'subtle-background',
    name: 'Subtle Background',
    tagline: 'Gentle Presence Dip',
    description: 'Small -6 dB reduction preserving high musical presence while keeping speech intelligible.',
    config: {
      duckAmountDb: -6,
      thresholdDb: -24,
      attackSec: 0.15,
      holdSec: 0.4,
      releaseSec: 0.6,
      minMusicVolume: 0.45,
      preset: 'subtle-background',
    },
  },
]

/**
 * Calculates continuous ducking gain curve over time.
 * Returns an array of gain multiplier values in range [minMusicVolume, 1.0].
 */
export function computeDuckingEnvelope(
  config: AutoDuckingConfig | null | undefined,
  clips: TimelineClip[],
  tracks: Track[],
  mediaAssets: Map<string, MediaAsset> | MediaAsset[],
  audioBuffers: Map<string, AudioBuffer>,
  totalDurationSec: number,
  sampleRate = 25 // 25 samples per second (40ms steps)
): Float32Array {
  const totalSamples = Math.max(1, Math.ceil(totalDurationSec * sampleRate))
  const envelope = new Float32Array(totalSamples)
  envelope.fill(1.0)

  if (!config || !config.enabled || !config.voiceTrackId) {
    return envelope
  }

  // Check if voice track exists and is not muted
  const voiceTrack = tracks.find((t) => t.id === config.voiceTrackId)
  if (voiceTrack && voiceTrack.muted) {
    return envelope // Voice track is muted, bypass ducking
  }

  // Find all active voice clips on the voice track
  const voiceClips = clips.filter(
    (c) => c.trackId === config.voiceTrackId && !c.audioProps.muted && c.audioProps.volume > 0
  )

  if (voiceClips.length === 0) {
    return envelope
  }

  const dt = 1 / sampleRate
  const targetDuckGain = Math.max(
    config.minMusicVolume,
    Math.pow(10, config.duckAmountDb / 20)
  )

  const attackCoeff = 1 - Math.exp(-dt / Math.max(0.01, config.attackSec))
  const releaseCoeff = 1 - Math.exp(-dt / Math.max(0.01, config.releaseSec))

  let currentGain = 1.0
  let holdCounterSec = 0

  for (let i = 0; i < totalSamples; i++) {
    const t = i * dt

    // Detect voice activity at timestamp t
    const isSpeechActive = isVoiceActiveAtTime(
      voiceClips,
      mediaAssets,
      audioBuffers,
      t,
      config.thresholdDb
    )

    if (isSpeechActive) {
      holdCounterSec = config.holdSec
      // Ramp gain down towards ducked level
      currentGain += (targetDuckGain - currentGain) * attackCoeff
    } else if (holdCounterSec > 0) {
      holdCounterSec -= dt
      // Maintain ducked level during hold period to prevent syllable pumping
    } else {
      // Ramp gain back up towards 1.0 (normal music level)
      currentGain += (1.0 - currentGain) * releaseCoeff
    }

    envelope[i] = Math.max(targetDuckGain, Math.min(1.0, currentGain))
  }

  return envelope
}

/**
 * Determines whether the voice track has active speech energy at timeSec.
 */
export function isVoiceActiveAtTime(
  voiceClips: TimelineClip[],
  mediaAssets: Map<string, MediaAsset> | MediaAsset[],
  audioBuffers: Map<string, AudioBuffer>,
  timeSec: number,
  thresholdDb: number
): boolean {
  if (!voiceClips || !Array.isArray(voiceClips)) return false

  const getAsset = (id?: string): MediaAsset | undefined => {
    if (!id) return undefined
    if (mediaAssets instanceof Map) return mediaAssets.get(id)
    if (Array.isArray(mediaAssets)) return mediaAssets.find((a) => a.id === id)
    return undefined
  }

  for (const clip of voiceClips) {
    const clipStart = clip.startSec
    const clipEnd = clip.startSec + clip.durationSec

    if (timeSec >= clipStart && timeSec <= clipEnd) {
      // Offset into clip media
      const relTime = timeSec - clipStart
      const speed = clip.speed ?? 1.0
      const trimStart = clip.trimStartSec ?? 0
      const sourceTime = trimStart + relTime * speed

      // 1. Check decoded AudioBuffer for actual acoustic RMS energy
      const assetId = clip.assetId
      if (assetId) {
        const buffer = audioBuffers instanceof Map ? audioBuffers.get(assetId) : undefined
        if (buffer && buffer.length > 0) {
          const sampleRate = buffer.sampleRate
          const centerSample = Math.floor(sourceTime * sampleRate)
          const windowSize = Math.floor(sampleRate * 0.04) // 40ms window

          if (centerSample >= 0 && centerSample < buffer.length) {
            const channelData = buffer.getChannelData(0)
            const startIdx = Math.max(0, centerSample - Math.floor(windowSize / 2))
            const endIdx = Math.min(channelData.length, startIdx + windowSize)

            let sumSq = 0
            let count = 0
            for (let s = startIdx; s < endIdx; s++) {
              const val = channelData[s]
              sumSq += val * val
              count++
            }

            if (count > 0) {
              const rms = Math.sqrt(sumSq / count)
              const db = 20 * Math.log10(rms + 1e-6)
              return db >= thresholdDb
            }
          }
        }

        // 2. Fallback to asset pre-computed waveform points if buffer is still loading
        const asset = getAsset(assetId)
        if (asset?.waveformPoints && asset.waveformPoints.length > 0) {
          const normIdx = Math.floor((sourceTime / Math.max(0.1, asset.durationSec)) * asset.waveformPoints.length)
          const clampedIdx = Math.min(asset.waveformPoints.length - 1, Math.max(0, normIdx))
          const energy = asset.waveformPoints[clampedIdx] || 0
          // Normalized energy threshold
          const minWaveformThreshold = Math.max(0.04, Math.pow(10, (thresholdDb + 20) / 20))
          return energy >= minWaveformThreshold
        }
      }

      // 3. Fallback: If media is an active clip with volume, consider active
      return true
    }
  }

  return false
}

/**
 * Returns ducking gain value at a specific timestamp from a pre-computed envelope.
 */
export function getDuckingGainAtTime(
  envelope: Float32Array,
  timeSec: number,
  sampleRate = 25
): number {
  if (!envelope || envelope.length === 0) return 1.0
  const idx = Math.min(envelope.length - 1, Math.max(0, Math.floor(timeSec * sampleRate)))
  return envelope[idx] ?? 1.0
}
