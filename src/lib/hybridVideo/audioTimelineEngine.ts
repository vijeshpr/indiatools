/**
 * IndiaTools — Hybrid Video Studio Audio Timeline Engine
 * Multi-track Web Audio API Mixing, Gain Routing, Fades, and Export Streaming
 */

import type { TimelineClip, Track, MediaAsset } from './types.ts'

export class HybridAudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private streamDestination: MediaStreamAudioDestinationNode | null = null
  private activeSourceNodes: Map<string, AudioBufferSourceNode> = new Map()
  private audioBufferCache: Map<string, AudioBuffer> = new Map()
  private isPlaying = false

  public init(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.streamDestination = this.ctx.createMediaStreamDestination()

      // Route master gain to both speakers and stream destination
      this.masterGain.connect(this.ctx.destination)
      this.masterGain.connect(this.streamDestination)
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
    mediaAssets: Map<string, MediaAsset>
  ): void {
    this.stopAll()
    const ctx = this.init()
    this.isPlaying = true

    const trackMap = new Map(tracks.map((t) => [t.id, t]))

    for (const clip of clips) {
      if (clip.type !== 'audio') continue

      const track = trackMap.get(clip.trackId)
      if (track?.muted || clip.audioProps.muted) continue

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

        // Fades
        const now = ctx.currentTime
        const remainingClipDur = clip.durationSec - clipRelOffset

        if (clip.audioProps.fadeInSec > 0 && clipRelOffset < clip.audioProps.fadeInSec) {
          const fadeInRemain = clip.audioProps.fadeInSec - clipRelOffset
          clipGain.gain.setValueAtTime(0, now)
          clipGain.gain.linearRampToValueAtTime(targetVol, now + fadeInRemain)
        } else {
          clipGain.gain.setValueAtTime(targetVol, now)
        }

        if (clip.audioProps.fadeOutSec > 0) {
          const fadeOutStart = Math.max(0, remainingClipDur - clip.audioProps.fadeOutSec)
          clipGain.gain.setValueAtTime(targetVol, now + fadeOutStart)
          clipGain.gain.linearRampToValueAtTime(0, now + remainingClipDur)
        }

        sourceNode.connect(clipGain)
        if (this.masterGain) {
          clipGain.connect(this.masterGain)
        }

        const startDelaySec = Math.max(0, clipStart - playheadSec)

        try {
          sourceNode.start(now + startDelaySec, sourceOffset, remainingClipDur)
          this.activeSourceNodes.set(clip.id, sourceNode)
        } catch {
          // Ignore range errors
        }
      }
    }
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
    this.streamDestination = null
  }
}

export const hybridAudio = new HybridAudioEngine()
