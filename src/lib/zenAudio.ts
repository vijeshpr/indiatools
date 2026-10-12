/**
 * Client-side Web Audio Synthesizer for Zen ASMR Effects.
 * 
 * Generates realistic acoustic pops, sand crunch/chimes, and resonant fluid drops
 * with zero external mp3/wav files and zero network overhead.
 */

class ZenAudioEngine {
  private ctx: AudioContext | null = null
  private isMuted: boolean = false
  private volume: number = 0.65

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol))
  }

  public getVolume(): number {
    return this.volume
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted
  }

  public getMuted(): boolean {
    return this.isMuted
  }

  /**
   * Synthesize acoustic bubble wrap pop
   * Dual-frequency snap + low resonance body + noise transient
   */
  public playBubblePop(pitchMod: number = 1.0) {
    if (this.isMuted || this.volume <= 0) return
    this.initContext()
    if (!this.ctx) return

    try {
      const now = this.ctx.currentTime
      const baseFreq = (450 + Math.random() * 220) * pitchMod

      // 1. Resonant Body Oscillator
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(baseFreq, now)
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.25, now + 0.06)

      gain.gain.setValueAtTime(this.volume * 0.8, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.07)

      // 2. High-frequency click / snap
      const clickOsc = this.ctx.createOscillator()
      const clickGain = this.ctx.createGain()

      clickOsc.type = 'triangle'
      clickOsc.frequency.setValueAtTime(baseFreq * 2.8, now)
      clickOsc.frequency.exponentialRampToValueAtTime(120, now + 0.025)

      clickGain.gain.setValueAtTime(this.volume * 0.45, now)
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)

      clickOsc.connect(clickGain)
      clickGain.connect(this.ctx.destination)

      clickOsc.start(now)
      clickOsc.stop(now + 0.035)

      // Mobile haptic vibration if supported
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(12)
      }
    } catch (e) {
      // Graceful fallback if audio is restricted
    }
  }

  /**
   * Synthesize granular sand slicing friction sound
   */
  public playSandSlice(pitchMod: number = 1.0) {
    if (this.isMuted || this.volume <= 0) return
    this.initContext()
    if (!this.ctx) return

    try {
      const now = this.ctx.currentTime
      const bufferSize = this.ctx.sampleRate * 0.05
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4))
      }

      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime((1800 + Math.random() * 800) * pitchMod, now)
      filter.Q.setValueAtTime(2.5, now)

      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(this.volume * 0.4, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      noise.start(now)
      noise.stop(now + 0.055)

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(8)
      }
    } catch (e) {}
  }

  /**
   * Synthesize water fluid drop / harmonic resonant ripple
   */
  public playFluidRipple(freqOffset: number = 0) {
    if (this.isMuted || this.volume <= 0) return
    this.initContext()
    if (!this.ctx) return

    try {
      const now = this.ctx.currentTime
      const baseFreq = 520 + freqOffset + Math.random() * 120

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(baseFreq, now)
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.6, now + 0.07)
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + 0.22)

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(this.volume * 0.35, now + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.25)
    } catch (e) {}
  }
}

export { ZenAudioEngine }
export const zenAudio = new ZenAudioEngine()
