/**
 * IndiaTools — Audio to Video Studio
 * Web Audio Analysis & Playback Pipeline
 */

import { NormalizedAudioBands } from './types.ts'

export class AudioToVideoAudioEngine {
  private audioCtx: AudioContext | null = null
  private audioElement: HTMLAudioElement | null = null
  private sourceNode: MediaElementAudioSourceNode | null = null
  private analyserNode: AnalyserNode | null = null
  private gainNode: GainNode | null = null
  private destinationNode: MediaStreamAudioDestinationNode | null = null

  private freqData: Uint8Array = new Uint8Array(1024)
  private timeData: Uint8Array = new Uint8Array(1024)

  private prevBass = 0
  private beatDecay = 0

  private isLoaded = false
  private audioDuration = 0

  constructor() {
    // Lazily initialized on first user interaction or audio load to comply with autoplay policy
  }

  private initContextIfNeeded(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext
      this.audioCtx = new AudioCtxClass()
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }
    return this.audioCtx
  }

  public async loadAudio(fileOrUrl: File | string): Promise<{ duration: number; name: string }> {
    const ctx = this.initContextIfNeeded()

    if (!this.audioElement) {
      this.audioElement = new Audio()
      this.audioElement.crossOrigin = 'anonymous'
      this.audioElement.preload = 'auto'

      this.sourceNode = ctx.createMediaElementSource(this.audioElement)
      this.analyserNode = ctx.createAnalyser()
      this.analyserNode.fftSize = 2048
      this.analyserNode.smoothingTimeConstant = 0.8

      this.gainNode = ctx.createGain()
      this.destinationNode = ctx.createMediaStreamDestination()

      // Connect graph: Source -> Analyser -> Gain -> [Destination & Speakers]
      this.sourceNode.connect(this.analyserNode)
      this.analyserNode.connect(this.gainNode)
      this.gainNode.connect(ctx.destination)
      this.gainNode.connect(this.destinationNode)

      this.freqData = new Uint8Array(this.analyserNode.frequencyBinCount)
      this.timeData = new Uint8Array(this.analyserNode.frequencyBinCount)
    }

    let url: string
    let fileName: string

    if (fileOrUrl instanceof File) {
      url = URL.createObjectURL(fileOrUrl)
      fileName = fileOrUrl.name
    } else {
      url = fileOrUrl
      fileName = 'Demo Audio'
    }

    this.audioElement.src = url

    return new Promise((resolve, reject) => {
      const onLoadedMetadata = () => {
        this.isLoaded = true
        this.audioDuration = this.audioElement?.duration || 0
        this.audioElement?.removeEventListener('loadedmetadata', onLoadedMetadata)
        this.audioElement?.removeEventListener('error', onError)
        resolve({ duration: this.audioDuration, name: fileName })
      }

      const onError = (e: Event) => {
        this.audioElement?.removeEventListener('loadedmetadata', onLoadedMetadata)
        this.audioElement?.removeEventListener('error', onError)
        reject(new Error('Failed to load audio file into browser.'))
      }

      this.audioElement?.addEventListener('loadedmetadata', onLoadedMetadata)
      this.audioElement?.addEventListener('error', onError)
      this.audioElement?.load()
    })
  }

  public play(): Promise<void> {
    if (!this.audioElement) return Promise.resolve()
    this.initContextIfNeeded()
    return this.audioElement.play()
  }

  public pause(): void {
    if (!this.audioElement) return
    this.audioElement.pause()
  }

  public seek(timeSec: number): void {
    if (!this.audioElement) return
    const boundedTime = Math.max(0, Math.min(this.audioDuration, timeSec))
    this.audioElement.currentTime = boundedTime
  }

  public setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume))
    }
  }

  public getCurrentTime(): number {
    return this.audioElement?.currentTime || 0
  }

  public getDuration(): number {
    return this.audioDuration
  }

  public isPaused(): boolean {
    return this.audioElement?.paused ?? true
  }

  public isEnded(): boolean {
    return this.audioElement?.ended ?? false
  }

  public isAudioLoaded(): boolean {
    return this.isLoaded
  }

  /**
   * Samples real-time frequency and time-domain data, returning normalized DSP bands
   */
  public analyze(): {
    bands: NormalizedAudioBands
    freqData: Uint8Array
    timeData: Uint8Array
  } {
    if (!this.analyserNode || !this.isLoaded) {
      return {
        bands: { bass: 0, mid: 0, treble: 0, subBass: 0, overall: 0, isBeatHit: false },
        freqData: this.freqData,
        timeData: this.timeData,
      }
    }

    this.analyserNode.getByteFrequencyData(this.freqData as any)
    this.analyserNode.getByteTimeDomainData(this.timeData as any)

    const binCount = this.analyserNode.frequencyBinCount // 1024 bins (each ~21.5 Hz @ 44.1kHz)

    // Sub-bass (20-60 Hz: bins 1 to 3)
    let subBassSum = 0
    for (let i = 1; i <= 3; i++) subBassSum += this.freqData[i]
    const subBass = subBassSum / (3 * 255)

    // Bass (60-250 Hz: bins 4 to 12)
    let bassSum = 0
    for (let i = 4; i <= 12; i++) bassSum += this.freqData[i]
    const bass = bassSum / (9 * 255)

    // Mid (250-4000 Hz: bins 13 to 180)
    let midSum = 0
    for (let i = 13; i <= 180; i++) midSum += this.freqData[i]
    const mid = midSum / (168 * 255)

    // Treble (4000-16000 Hz: bins 181 to 740)
    let trebleSum = 0
    for (let i = 181; i <= 740; i++) trebleSum += this.freqData[i]
    const treble = trebleSum / (560 * 255)

    const overall = (subBass * 0.4 + bass * 0.35 + mid * 0.15 + treble * 0.1)

    // Beat transient detection (sudden low-frequency delta exceeding threshold)
    const bassDelta = bass - this.prevBass
    this.prevBass = bass
    this.beatDecay = Math.max(0, this.beatDecay - 0.05)

    let isBeatHit = false
    if (bassDelta > 0.15 && bass > 0.4 && this.beatDecay <= 0) {
      isBeatHit = true
      this.beatDecay = 0.25 // debounces immediate successive triggers
    }

    return {
      bands: { bass, mid, treble, subBass, overall, isBeatHit },
      freqData: this.freqData,
      timeData: this.timeData,
    }
  }

  /**
   * Returns audio MediaStreamTrack for recording into MediaRecorder
   */
  public getAudioExportTrack(): MediaStreamTrack | null {
    if (!this.destinationNode) return null
    const tracks = this.destinationNode.stream.getAudioTracks()
    return tracks.length > 0 ? tracks[0] : null
  }

  public destroy(): void {
    if (this.audioElement) {
      this.audioElement.pause()
      this.audioElement.src = ''
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close().catch(() => {})
    }
    this.audioCtx = null
    this.audioElement = null
    this.sourceNode = null
    this.analyserNode = null
    this.gainNode = null
    this.destinationNode = null
    this.isLoaded = false
  }
}
