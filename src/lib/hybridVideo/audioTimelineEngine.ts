/**
 * IndiaTools — Hybrid Video Studio Audio Timeline Engine
 * Multi-track Web Audio API Mixing, Gain Routing, Fades, and Export Streaming
 * Built-in Auto-Ducking (Smart Audio Mix) with live voice activity and gain reduction monitoring
 */

import type { TimelineClip, Track, MediaAsset, AutoDuckingConfig } from './types.ts'
import { computeDuckingEnvelope } from './autoDuckingEngine.ts'

export class HybridAudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private streamDestination: MediaStreamAudioDestinationNode | null = null
  private voiceAnalyserNode: AnalyserNode | null = null
  private activeSourceNodes: Map<string, AudioBufferSourceNode> = new Map()
  private audioBufferCache: Map<string, AudioBuffer> = new Map()
  private isPlaying = false
  private currentDuckingEnvelope: Float32Array | null = null
  private activeAutoDuckingConfig: AutoDuckingConfig | null = null

  public init(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.streamDestination = this.ctx.createMediaStreamDestination()

      // Voice Activity Analyser Node for live meters
      this.voiceAnalyserNode = this.ctx.createAnalyser()
      this.voiceAnalyserNode.fftSize = 256
      this.voiceAnalyserNode.smoothingTimeConstant = 0.4

      // Route master gain to both speakers and stream destination
      this.masterGain.connect(this.ctx.destination)
      this.masterGain.connect(this.streamDestination)

      // Route voice analyser into master gain
      this.voiceAnalyserNode.connect(this.masterGain)
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    return this.ctx
  }

  public getStreamDestination(): MediaStreamAudioDestinationNode | null {
    this.init()
    return this.streamDestination
  }

  public async preloadAssetAudio(asset: MediaAsset): Promise<AudioBuffer | null> {
    if (this.audioBufferCache.has(asset.id)) {
      return this.audioBufferCache.get(asset.id)!
    }

    const ctx = this.init()
    try {
      const response = await fetch(asset.url)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
      this.audioBufferCache.set(asset.id, audioBuffer)
      return audioBuffer
    } catch {
      return null
    }
  }

  public stopAll(): void {
    this.isPlaying = false
    this.currentDuckingEnvelope = null
    this.activeAutoDuckingConfig = null

    for (const [, node] of this.activeSourceNodes) {
      try {
        node.stop()
        node.disconnect()
      } catch {
        // Ignore already stopped
      }
    }
    this.activeSourceNodes.clear()
  }

  public playAt(
    playheadSec: number,
    clips: TimelineClip[],
    tracks: Track[],
    mediaAssets: Map<string, MediaAsset>,
    autoDucking?: AutoDuckingConfig | null
  ): void {
    this.stopAll()
    const ctx = this.init()
    this.isPlaying = true
    this.activeAutoDuckingConfig = autoDucking && autoDucking.enabled ? autoDucking : null

    const trackMap = new Map(tracks.map((t) => [t.id, t]))

    // 1. Calculate Auto-Ducking Envelope if enabled
    const totalDuration = Math.max(1, Math.max(...clips.map((c) => c.startSec + c.durationSec), 30))
    const sampleRate = 25
    let duckingCurve: Float32Array | null = null

    if (autoDucking && autoDucking.enabled) {
      duckingCurve = computeDuckingEnvelope(
        autoDucking,
        clips,
        tracks,
        mediaAssets,
        this.audioBufferCache,
        totalDuration,
        sampleRate
      )
      this.currentDuckingEnvelope = duckingCurve
    }

    for (const clip of clips) {
      // Support audio clips as well as video clips containing audio
      if (clip.type !== 'audio' && clip.type !== 'video') continue

      const track = trackMap.get(clip.trackId)
      if (track?.muted || clip.audioProps.muted || clip.audioProps.volume <= 0) continue

      const clipStart = clip.startSec
      const clipEnd = clip.startSec + clip.durationSec

      // If clip is currently active or will start in the future
      if (playheadSec < clipEnd) {
        const asset = clip.assetId ? mediaAssets.get(clip.assetId) : undefined
        if (!asset) continue

        const buffer = this.audioBufferCache.get(asset.id)
        if (!buffer) {
          // Preload on background
          this.preloadAssetAudio(asset)
          continue
        }

        const sourceNode = ctx.createBufferSource()
        sourceNode.buffer = buffer

        // Clip + Track Gain Node
        const clipGain = ctx.createGain()
        const trackVol = track?.volume ?? 1
        const clipVol = clip.audioProps.volume ?? 1
        const targetVol = trackVol * clipVol

        const clipRelOffset = Math.max(0, playheadSec - clipStart)
        const sourceOffset = clip.trimStartSec + clipRelOffset * clip.speed

        const now = ctx.currentTime
        const remainingClipDur = clip.durationSec - clipRelOffset
        const startDelaySec = Math.max(0, clipStart - playheadSec)

        // Determine if this clip is on a targeted ducked music track
        const isDuckedMusicTrack =
          duckingCurve !== null &&
          autoDucking?.targetTrackIds?.includes(clip.trackId)

        if (isDuckedMusicTrack && duckingCurve) {
          // Schedule ducking curve slice for this background music clip
          const startIdx = Math.floor(Math.max(0, clipStart) * sampleRate)
          const endIdx = Math.floor(clipEnd * sampleRate)
          const numSamples = Math.max(2, endIdx - startIdx)
          const curveSlice = new Float32Array(numSamples)

          for (let s = 0; s < numSamples; s++) {
            const envVal = duckingCurve[Math.min(duckingCurve.length - 1, startIdx + s)] ?? 1.0
            curveSlice[s] = Math.max(0, Math.min(1.0, targetVol * envVal))
          }

          const startSliceIdx = Math.min(
            curveSlice.length - 2,
            Math.floor(clipRelOffset * sampleRate)
          )
          const activeSlice = curveSlice.subarray(startSliceIdx)

          if (activeSlice.length >= 2) {
            try {
              clipGain.gain.setValueCurveAtTime(activeSlice, now + startDelaySec, remainingClipDur)
            } catch {
              clipGain.gain.setValueAtTime(targetVol, now + startDelaySec)
            }
          } else {
            clipGain.gain.setValueAtTime(targetVol, now + startDelaySec)
          }
        } else {
          // Standard manual volume and fades
          if (clip.audioProps.fadeInSec > 0 && clipRelOffset < clip.audioProps.fadeInSec) {
            const fadeInRemain = clip.audioProps.fadeInSec - clipRelOffset
            clipGain.gain.setValueAtTime(0, now + startDelaySec)
            clipGain.gain.linearRampToValueAtTime(targetVol, now + startDelaySec + fadeInRemain)
          } else {
            clipGain.gain.setValueAtTime(targetVol, now + startDelaySec)
          }

          if (clip.audioProps.fadeOutSec > 0) {
            const fadeOutStart = Math.max(0, remainingClipDur - clip.audioProps.fadeOutSec)
            clipGain.gain.setValueAtTime(targetVol, now + startDelaySec + fadeOutStart)
            clipGain.gain.linearRampToValueAtTime(0, now + startDelaySec + remainingClipDur)
          }
        }

        sourceNode.connect(clipGain)

        // Route voice track through voiceAnalyserNode for live meters
        if (this.voiceAnalyserNode && autoDucking && clip.trackId === autoDucking.voiceTrackId) {
          clipGain.connect(this.voiceAnalyserNode)
        } else if (this.masterGain) {
          clipGain.connect(this.masterGain)
        }

        try {
          sourceNode.start(now + startDelaySec, sourceOffset, remainingClipDur)
          this.activeSourceNodes.set(clip.id, sourceNode)
        } catch {
          // Ignore range errors
        }
      }
    }
  }

  /**
   * Returns normalized 0.0 to 1.0 live voice activity level for UI meter
   */
  public getVoiceActivityLevel(): number {
    if (!this.voiceAnalyserNode || !this.isPlaying) return 0
    const data = new Uint8Array(this.voiceAnalyserNode.frequencyBinCount)
    this.voiceAnalyserNode.getByteFrequencyData(data)
    let sum = 0
    for (let i = 0; i < data.length; i++) {
      sum += data[i]
    }
    return Math.min(1.0, sum / (data.length * 110))
  }

  /**
   * Returns current gain reduction in dB for UI meter
   */
  public getGainReductionDb(timeSec: number): number {
    if (!this.currentDuckingEnvelope || !this.isPlaying) return 0
    const sampleRate = 25
    const idx = Math.min(
      this.currentDuckingEnvelope.length - 1,
      Math.max(0, Math.floor(timeSec * sampleRate))
    )
    const gain = this.currentDuckingEnvelope[idx] ?? 1.0
    if (gain >= 0.98) return 0
    return Math.max(-24, Math.min(0, 20 * Math.log10(gain)))
  }

  public isAutoDuckingActive(): boolean {
    return this.isPlaying && this.activeAutoDuckingConfig !== null
  }

  public dispose(): void {
    this.stopAll()
    this.audioBufferCache.clear()
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.close()
      } catch {
        // Ignore
      }
    }
    this.ctx = null
    this.masterGain = null
    this.voiceAnalyserNode = null
    this.streamDestination = null
  }
}

export const hybridAudio = new HybridAudioEngine()
