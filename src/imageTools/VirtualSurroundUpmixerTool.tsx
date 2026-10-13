import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Upload,
  Download,
  Sparkles,
  Sliders,
  RotateCcw,
  Repeat,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Disc,
  Radio,
  Layers,
  ChevronDown,
  ChevronUp,
  Cpu,
  Zap,
  Film,
  Headphones,
  Speaker,
  Activity,
  Tv,
} from 'lucide-react'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useToast } from '../components/common/Toast'
import {
  SurroundOptions,
  SurroundMode,
  ChannelId,
  DEFAULT_SURROUND_OPTIONS,
  SURROUND_CHANNELS,
  upmixStereoToMultiChannel,
} from '../lib/audio/surroundEngine'
import { renderSurroundRadar, SpeakerRadarTelemetry } from '../lib/audio/surroundRadarRenderer'
import { decodeAudioFile } from '../lib/audio/audioProcessor'
import { extractWaveformData, renderWaveformOnCanvas, WaveformData } from '../lib/audio/waveformRenderer'
import { encodeMultiChannelWav, SPEAKER_MASKS } from '../lib/audio/encoders/multiChannelWavEncoder'
import { encodeAudioBufferToMp3 } from '../lib/audio/encoders/mp3Encoder'
import { generateVisualizerDemoSpecimen } from '../lib/video/demoAudioGenerator'

export const VirtualSurroundUpmixerTool: React.FC = () => {
  const tool = getToolBySlug('virtual-surround-upmixer')!
  const { showToast } = useToast()

  // Audio state
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [sourceBuffer, setSourceBuffer] = useState<AudioBuffer | null>(null)
  const [waveformData, setWaveformData] = useState<WaveformData | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isBypassed, setIsBypassed] = useState<boolean>(false) // A/B Bypass (Stereo vs Surround)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [volume, setVolume] = useState<number>(1.0)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isLooping, setIsLooping] = useState<boolean>(false)
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false)
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false)

  // Surround Options
  const [options, setOptions] = useState<SurroundOptions>(DEFAULT_SURROUND_OPTIONS)
  const [selectedChannel, setSelectedChannel] = useState<ChannelId | null>(null)
  const [showAdvancedMatrix, setShowAdvancedMatrix] = useState<boolean>(false)

  // Export State
  const [exportFormat, setExportFormat] = useState<'discrete-wav-24' | 'discrete-wav-16' | 'binaural-wav-24' | 'binaural-mp3'>('discrete-wav-24')
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const [exportProgress, setExportProgress] = useState<number>(0)
  const exportCancelledRef = useRef<boolean>(false)

  // Web Audio Graph refs
  const audioContextRef = useRef<AudioContext | null>(null)
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null)
  const masterGainNodeRef = useRef<GainNode | null>(null)
  const dryGainNodeRef = useRef<GainNode | null>(null)
  const wetGainNodeRef = useRef<GainNode | null>(null)

  // Real-time DSP nodes
  const centreGainNodeRef = useRef<GainNode | null>(null)
  const subGainNodeRef = useRef<GainNode | null>(null)
  const subFilter1Ref = useRef<BiquadFilterNode | null>(null)
  const subFilter2Ref = useRef<BiquadFilterNode | null>(null)
  const surroundDelayNodeRef = useRef<DelayNode | null>(null)
  const surroundSpreadGainRef = useRef<GainNode | null>(null)

  // Real-time Analysers for radar VU meters
  const channelAnalysersRef = useRef<Record<ChannelId, AnalyserNode | null>>({
    FL: null,
    FR: null,
    C: null,
    LFE: null,
    SL: null,
    SR: null,
    RL: null,
    RR: null,
  })

  const playbackStartTimeRef = useRef<number>(0)
  const playbackStartOffsetRef = useRef<number>(0)
  const animationFrameRef = useRef<number | null>(null)

  // Canvas refs
  const radarCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Build Real-Time Surround Audio Graph
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioCtx()

      const masterGain = ctx.createGain()
      const dryGain = ctx.createGain()
      const wetGain = ctx.createGain()

      // Centre channel path (L+R sum -> bandpass -> gain)
      const centreSum = ctx.createGain()
      centreSum.gain.value = 0.5
      const centreHp = ctx.createBiquadFilter()
      centreHp.type = 'highpass'
      centreHp.frequency.value = 300
      const centreLp = ctx.createBiquadFilter()
      centreLp.type = 'lowpass'
      centreLp.frequency.value = 3500
      const centreGain = ctx.createGain()
      centreGain.gain.value = options.centreLevel

      centreSum.connect(centreHp)
      centreHp.connect(centreLp)
      centreLp.connect(centreGain)

      // Subwoofer path (L+R sum -> 4th-order Linkwitz-Riley lowpass -> gain)
      const subSum = ctx.createGain()
      subSum.gain.value = 0.5
      const subLp1 = ctx.createBiquadFilter()
      subLp1.type = 'lowpass'
      subLp1.frequency.value = options.subCrossoverHz
      subLp1.Q.value = 0.7071
      const subLp2 = ctx.createBiquadFilter()
      subLp2.type = 'lowpass'
      subLp2.frequency.value = options.subCrossoverHz
      subLp2.Q.value = 0.7071
      const subGain = ctx.createGain()
      subGain.gain.value = options.subGain

      subSum.connect(subLp1)
      subLp1.connect(subLp2)
      subLp2.connect(subGain)

      // Surround Ambience difference path (Delay + Spread Gain)
      const surroundDelay = ctx.createDelay(0.1)
      surroundDelay.delayTime.value = options.surroundDelayMs / 1000
      const surroundSpread = ctx.createGain()
      surroundSpread.gain.value = options.surroundSpread

      surroundDelay.connect(surroundSpread)

      // Setup Channel Analysers for VU metering
      const createAnalyser = () => {
        const a = ctx.createAnalyser()
        a.fftSize = 256
        a.smoothingTimeConstant = 0.75
        return a
      }

      channelAnalysersRef.current = {
        FL: createAnalyser(),
        FR: createAnalyser(),
        C: createAnalyser(),
        LFE: createAnalyser(),
        SL: createAnalyser(),
        SR: createAnalyser(),
        RL: createAnalyser(),
        RR: createAnalyser(),
      }

      // Connect analysers to signals
      centreGain.connect(channelAnalysersRef.current.C!)
      subGain.connect(channelAnalysersRef.current.LFE!)
      surroundSpread.connect(channelAnalysersRef.current.SL!)
      surroundSpread.connect(channelAnalysersRef.current.SR!)

      // Limiter / Compressor for safety
      const compressor = ctx.createDynamicsCompressor()
      compressor.threshold.value = -2.5
      compressor.knee.value = 6.0
      compressor.ratio.value = 16.0
      compressor.attack.value = 0.003
      compressor.release.value = 0.15

      // Summing to output
      wetGain.connect(masterGain)
      dryGain.connect(masterGain)
      masterGain.connect(compressor)
      compressor.connect(ctx.destination)

      audioContextRef.current = ctx
      masterGainNodeRef.current = masterGain
      dryGainNodeRef.current = dryGain
      wetGainNodeRef.current = wetGain
      centreGainNodeRef.current = centreGain
      subGainNodeRef.current = subGain
      subFilter1Ref.current = subLp1
      subFilter2Ref.current = subLp2
      surroundDelayNodeRef.current = surroundDelay
      surroundSpreadGainRef.current = surroundSpread
    }
    return audioContextRef.current
  }, [options])

  // Update real-time DSP parameters
  useEffect(() => {
    if (masterGainNodeRef.current && dryGainNodeRef.current && wetGainNodeRef.current) {
      if (isBypassed) {
        dryGainNodeRef.current.gain.value = 1.0
        wetGainNodeRef.current.gain.value = 0.0
      } else {
        dryGainNodeRef.current.gain.value = 0.0
        wetGainNodeRef.current.gain.value = 1.0
      }
      masterGainNodeRef.current.gain.value = isMuted ? 0 : volume * options.masterOutputGain
    }

    if (centreGainNodeRef.current) centreGainNodeRef.current.gain.value = options.centreLevel
    if (subGainNodeRef.current) subGainNodeRef.current.gain.value = options.subGain
    if (subFilter1Ref.current && subFilter2Ref.current) {
      subFilter1Ref.current.frequency.value = options.subCrossoverHz
      subFilter2Ref.current.frequency.value = options.subCrossoverHz
    }
    if (surroundDelayNodeRef.current) surroundDelayNodeRef.current.delayTime.value = options.surroundDelayMs / 1000
    if (surroundSpreadGainRef.current) surroundSpreadGainRef.current.gain.value = options.surroundSpread
  }, [options, volume, isMuted, isBypassed])

  // Stop playback cleanly and completely
  const stopAllAudio = useCallback(() => {
    if (activeSourceRef.current) {
      try {
        activeSourceRef.current.stop()
        activeSourceRef.current.disconnect()
      } catch (e) {
        // Source already ended
      }
      activeSourceRef.current = null
    }
    setIsPlaying(false)
  }, [])

  // Play audio from specific offset
  const playFromOffset = useCallback(
    async (offsetSec: number) => {
      if (!sourceBuffer) return

      stopAllAudio()

      const ctx = getAudioContext()
      if (ctx.state === 'suspended') {
        await ctx.resume()
      }

      const source = ctx.createBufferSource()
      source.buffer = sourceBuffer
      source.loop = isLooping

      // Split and feed channels
      if (dryGainNodeRef.current && wetGainNodeRef.current) {
        source.connect(dryGainNodeRef.current)
        source.connect(wetGainNodeRef.current)
      }

      // Connect Front Analysers
      if (channelAnalysersRef.current.FL && channelAnalysersRef.current.FR) {
        source.connect(channelAnalysersRef.current.FL)
        source.connect(channelAnalysersRef.current.FR)
      }

      const boundedOffset = Math.max(0, Math.min(offsetSec, sourceBuffer.duration))
      playbackStartTimeRef.current = ctx.currentTime
      playbackStartOffsetRef.current = boundedOffset

      source.onended = () => {
        if (!isLooping && activeSourceRef.current === source) {
          setIsPlaying(false)
          setCurrentTime(0)
          playbackStartOffsetRef.current = 0
        }
      }

      source.start(0, boundedOffset)
      activeSourceRef.current = source
      setIsPlaying(true)
    },
    [sourceBuffer, isLooping, getAudioContext, stopAllAudio]
  )

  const pauseAudio = useCallback(() => {
    if (!isPlaying) return
    if (audioContextRef.current) {
      const elapsed = audioContextRef.current.currentTime - playbackStartTimeRef.current
      const current = Math.min(duration, playbackStartOffsetRef.current + elapsed)
      playbackStartOffsetRef.current = current
      setCurrentTime(current)
    }
    stopAllAudio()
  }, [isPlaying, duration, stopAllAudio])

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      pauseAudio()
    } else {
      playFromOffset(playbackStartOffsetRef.current)
    }
  }, [isPlaying, pauseAudio, playFromOffset])

  const handleStop = useCallback(() => {
    stopAllAudio()
    playbackStartOffsetRef.current = 0
    setCurrentTime(0)
  }, [stopAllAudio])

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const targetSec = parseFloat(e.target.value)
      setCurrentTime(targetSec)
      playbackStartOffsetRef.current = targetSec
      if (isPlaying) {
        playFromOffset(targetSec)
      }
    },
    [isPlaying, playFromOffset]
  )

  // Load Audio File
  const handleLoadAudioFile = useCallback(
    async (file: File) => {
      stopAllAudio()
      setIsLoadingAudio(true)
      try {
        const { buffer } = await decodeAudioFile(file)
        setAudioFile(file)
        setSourceBuffer(buffer)
        setDuration(buffer.duration)
        setCurrentTime(0)
        playbackStartOffsetRef.current = 0

        const wave = extractWaveformData(buffer, 600)
        setWaveformData(wave)

        showToast(`Loaded "${file.name}" (${(buffer.duration).toFixed(1)}s)`, 'success')
      } catch (err: any) {
        showToast(err.message || 'Failed to decode audio file.', 'error')
      } finally {
        setIsLoadingAudio(false)
      }
    },
    [stopAllAudio, showToast]
  )

  // Load Demo Audio
  const handleLoadDemoAudio = useCallback(async () => {
    stopAllAudio()
    setIsLoadingAudio(true)
    try {
      showToast('Synthesizing surround specimen track...', 'info')
      const demo = await generateVisualizerDemoSpecimen()
      await handleLoadAudioFile(demo)
      showToast('Specimen loaded! Press Play to hear 5.1/7.1 soundstage.', 'success')
    } catch (e: any) {
      showToast('Failed to load demo track.', 'error')
    } finally {
      setIsLoadingAudio(false)
    }
  }, [stopAllAudio, handleLoadAudioFile, showToast])

  // Spacebar toggle hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement)?.tagName !== 'INPUT' && (e.target as HTMLElement)?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        handleTogglePlay()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleTogglePlay])

  // Radar render loop & VU metering
  useEffect(() => {
    let isRunning = true
    const freqBytes = new Uint8Array(128)

    const render = () => {
      if (!isRunning) return
      const nowSec = performance.now() / 1000

      // Update current time
      if (isPlaying && audioContextRef.current) {
        const elapsed = audioContextRef.current.currentTime - playbackStartTimeRef.current
        const curr = Math.min(duration, playbackStartOffsetRef.current + elapsed)
        setCurrentTime(curr)
      }

      // Collect real-time energy from channel analysers
      const levels: Record<ChannelId, number> = {
        FL: 0, FR: 0, C: 0, LFE: 0, SL: 0, SR: 0, RL: 0, RR: 0,
      }

      if (isPlaying && !isBypassed) {
        for (const chKey of Object.keys(channelAnalysersRef.current) as ChannelId[]) {
          const an = channelAnalysersRef.current[chKey]
          if (an) {
            an.getByteFrequencyData(freqBytes)
            let s = 0
            for (let i = 0; i < 32; i++) s += freqBytes[i]
            levels[chKey] = Math.min(1.0, (s / (32 * 255)) * 1.5)
          }
        }
      }

      // Render Radar Canvas
      if (radarCanvasRef.current) {
        renderSurroundRadar(
          radarCanvasRef.current,
          options.mode,
          { channelLevels: levels, isPlaying, isBypassed, selectedChannel },
          nowSec,
          (ch) => setSelectedChannel(ch)
        )
      }

      // Render Waveform Canvas
      if (waveformCanvasRef.current && waveformData) {
        const progress = duration > 0 ? currentTime / duration : 0
        renderWaveformOnCanvas(waveformCanvasRef.current, waveformData, progress, !isBypassed)
      }

      animationFrameRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      isRunning = false
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [isPlaying, isBypassed, duration, options.mode, selectedChannel, waveformData])

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopAllAudio()
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close()
        } catch (e) {
          // Ignore
        }
      }
    }
  }, [stopAllAudio])

  // Multi-Channel Discrete Audio Export
  const handleExportSurroundAudio = useCallback(async () => {
    if (!sourceBuffer) {
      showToast('Please load an audio file first.', 'error')
      return
    }

    setIsExporting(true)
    setExportProgress(10)
    exportCancelledRef.current = false

    try {
      showToast(`Rendering ${options.mode === 'surround-7-1' ? '7.1' : options.mode === 'surround-5-1' ? '5.1' : 'Binaural'} channels...`, 'info')

      const result = await upmixStereoToMultiChannel(
        sourceBuffer,
        options,
        (pct) => setExportProgress(Math.round(pct * 0.8))
      )

      if (exportCancelledRef.current) {
        showToast('Export cancelled.', 'info')
        return
      }

      let blob: Blob
      let ext: string

      if (exportFormat === 'binaural-mp3' && result.mode === 'binaural-headphones') {
        setExportProgress(85)
        // Create stereo AudioBuffer for mp3 encoder
        const offlineCtx = new (window.OfflineAudioContext || (window as any).webkitOfflineAudioContext)(
          2,
          result.channels[0].length,
          result.sampleRate
        )
        const stereoBuf = offlineCtx.createBuffer(2, result.channels[0].length, result.sampleRate)
        stereoBuf.getChannelData(0).set(result.channels[0])
        stereoBuf.getChannelData(1).set(result.channels[1])

        blob = await encodeAudioBufferToMp3(stereoBuf, {
          kbps: 320,
          onProgress: (pct) => setExportProgress(80 + Math.round(pct * 0.2)),
          isCancelled: () => exportCancelledRef.current,
        })
        ext = 'mp3'
      } else {
        const bitDepth = exportFormat.includes('24') ? 24 : 16
        setExportProgress(85)
        blob = await encodeMultiChannelWav(result.channels, result.sampleRate, {
          bitDepth,
          onProgress: (pct) => setExportProgress(80 + Math.round(pct * 0.2)),
          isCancelled: () => exportCancelledRef.current,
        })
        ext = 'wav'
      }

      const cleanName = (audioFile?.name || 'audio').replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
      const tag = options.mode === 'surround-7-1' ? '7.1_Surround' : options.mode === 'surround-5-1' ? '5.1_Surround' : '3D_Binaural'
      const outFilename = `${cleanName}_${tag}.${ext}`

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = outFilename
      document.body.appendChild(a)
      a.click()
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 2000)

      const mb = (blob.size / (1024 * 1024)).toFixed(2)
      showToast(`Exported ${outFilename} (${result.channels.length} ch, ${mb} MB)`, 'success')
    } catch (err: any) {
      showToast(err.message || 'Export failed.', 'error')
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }, [sourceBuffer, options, exportFormat, audioFile, showToast])

  return (
    <ToolPageLayout
      tool={tool}
      customTitle="Free Virtual 5.1 & 7.1 Surround Sound Upmixer | IndiaTools"
      customDescription="Convert standard stereo songs into discrete 5.1 and 7.1 surround sound audio files. Dialogue extraction, Linkwitz-Riley LFE crossover, and 3D binaural headphone export with 100% in-browser privacy."
      maxWidthClass="max-w-7xl"
    >
      <div className="space-y-6">
        {/* SURROUND HERO SECTION */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 p-6 md:p-8 border border-cyan-500/25 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                ITU-R BS.775 Acoustic Matrix • Discrete Multi-Channel Studio
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Virtual <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">5.1 & 7.1 Surround Sound</span> Upmixer
              </h1>
              <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
                Upscale ordinary stereo music, podcasts, and movie soundtracks into discrete 6-channel 5.1, 8-channel 7.1, or 3D binaural headphone mixes with calibrated center dialogue and punchy LFE subwoofer crossover.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleLoadDemoAudio}
                disabled={isLoadingAudio}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-sm font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                Try Surround Sample
              </button>

              <button
                onClick={handleExportSurroundAudio}
                disabled={!sourceBuffer || isExporting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {isExporting ? `Exporting (${exportProgress}%)` : 'Export Multi-Channel'}
              </button>
            </div>
          </div>
        </div>

        {/* TRUST AND PRIVACY STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-1">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Zero Audio Uploads (100% Client-Side)</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <Speaker className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Discrete 6 & 8 Channel PCM Export</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <Tv className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>4th-Order 24dB/oct LFE Crossover</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <Headphones className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Woodworth 3D Binaural HRTF Mode</span>
          </div>
        </div>

        {/* WORKSPACE: RADAR VISUALIZER & SURROUND MATRIX */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Radar Soundstage & Transport (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Visualizer Canvas Card */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-2xl backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
                  <span className="text-xs font-bold text-white tracking-wider uppercase">
                    Surround Soundstage Radar
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {options.mode === 'surround-7-1' ? '7.1 Discrete' : options.mode === 'surround-5-1' ? '5.1 Discrete' : '3D Binaural'}
                  </span>
                </div>
              </div>

              {/* Speaker Radar Canvas */}
              <div className="relative w-full aspect-square max-h-[460px] mx-auto overflow-hidden rounded-xl bg-black border border-slate-800/80 shadow-inner flex items-center justify-center">
                <canvas
                  ref={radarCanvasRef}
                  width={600}
                  height={600}
                  className="w-full h-full object-contain pointer-events-none select-none"
                />
              </div>

              {/* Waveform Canvas Bar */}
              <div className="relative w-full h-14 overflow-hidden rounded-lg bg-slate-950 border border-slate-800">
                <canvas
                  ref={waveformCanvasRef}
                  width={700}
                  height={56}
                  className="w-full h-full object-cover pointer-events-none select-none"
                />
                {!waveformData && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">
                    Load audio to view waveform
                  </div>
                )}
              </div>

              {/* Master Audio Transport Deck */}
              <div className="space-y-3 pt-1">
                {/* Seekbar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>{formatTimeDisplay(currentTime)}</span>
                    <span>{formatTimeDisplay(duration)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={duration || 1}
                    step="0.05"
                    value={currentTime}
                    onChange={handleSeek}
                    disabled={!sourceBuffer}
                    className="w-full h-2 rounded-lg bg-slate-800 accent-cyan-400 cursor-pointer disabled:opacity-40"
                  />
                </div>

                {/* Transport Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      disabled={!sourceBuffer}
                      className={`inline-flex items-center justify-center w-11 h-11 rounded-xl font-bold transition-all shadow-md cursor-pointer ${
                        isPlaying
                          ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-500/20'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
                      } disabled:opacity-40 disabled:pointer-events-none`}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={handleStop}
                      disabled={!sourceBuffer}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors disabled:opacity-40 cursor-pointer"
                      title="Stop audio"
                    >
                      <Square className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsLooping(!isLooping)}
                      disabled={!sourceBuffer}
                      className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                        isLooping
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                      } disabled:opacity-40`}
                      title="Loop playback"
                    >
                      <Repeat className="w-4 h-4" />
                    </button>

                    {/* A/B Bypass Button */}
                    <button
                      type="button"
                      onClick={() => setIsBypassed(!isBypassed)}
                      disabled={!sourceBuffer}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isBypassed
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      } disabled:opacity-40`}
                    >
                      {isBypassed ? 'A/B: STEREO (BYPASS)' : 'A/B: SURROUND (ON)'}
                    </button>
                  </div>

                  {/* Volume Slider */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(parseFloat(e.target.value))
                        if (isMuted) setIsMuted(false)
                      }}
                      className="w-20 md:w-28 h-1.5 rounded-lg bg-slate-800 accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Audio File Import Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDraggingOver(true)
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setIsDraggingOver(false)
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleLoadAudioFile(e.dataTransfer.files[0])
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
                isDraggingOver
                  ? 'border-cyan-400 bg-cyan-950/20'
                  : 'border-slate-800 hover:border-cyan-500/40 bg-slate-900/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleLoadAudioFile(e.target.files[0])
                  }
                }}
              />
              <div className="flex items-center justify-center gap-3">
                <Upload className="w-5 h-5 text-cyan-400" />
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-200">
                    {audioFile ? audioFile.name : 'Click or Drop Audio (MP3, WAV, FLAC, M4A, OGG)'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {sourceBuffer
                      ? `${(sourceBuffer.duration).toFixed(1)}s • ${sourceBuffer.sampleRate} Hz • Stereo Source`
                      : 'Audio processed entirely in device memory with zero server uploads.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Surround Matrix Controls & Export (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Mode Selector Card */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 backdrop-blur-xl shadow-lg space-y-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                1. Spatial Channel Layout
              </h2>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'surround-5-1', label: '5.1 Surround', sub: '6 Channels' },
                  { id: 'surround-7-1', label: '7.1 Surround', sub: '8 Channels' },
                  { id: 'binaural-headphones', label: '3D Headphones', sub: 'Binaural HRTF' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setOptions((p) => ({ ...p, mode: m.id as SurroundMode }))}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      options.mode === m.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">{m.label}</div>
                    <div className="text-[9px] text-slate-500">{m.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* DSP Matrix Controls Card */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 backdrop-blur-xl shadow-lg space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                2. Surround DSP Matrix Tuning
              </h2>

              {/* Centre Dialogue Clarity */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300 font-semibold">
                  <span>Centre Dialogue Clarity (Vocal Bandpass)</span>
                  <span className="font-mono text-cyan-400">{Math.round(options.centreClarity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={options.centreClarity}
                  onChange={(e) => setOptions((p) => ({ ...p, centreClarity: parseFloat(e.target.value) }))}
                  className="w-full accent-cyan-400"
                />
              </div>

              {/* Subwoofer Crossover */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300 font-semibold">
                  <span>LFE Subwoofer 24dB/oct Crossover</span>
                  <span className="font-mono text-pink-400">{options.subCrossoverHz} Hz</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="140"
                  step="5"
                  value={options.subCrossoverHz}
                  onChange={(e) => setOptions((p) => ({ ...p, subCrossoverHz: parseInt(e.target.value) }))}
                  className="w-full accent-pink-400"
                />
              </div>

              {/* Subwoofer Gain */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300 font-semibold">
                  <span>Subwoofer Impact Gain</span>
                  <span className="font-mono text-pink-400">{options.subGain.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={options.subGain}
                  onChange={(e) => setOptions((p) => ({ ...p, subGain: parseFloat(e.target.value) }))}
                  className="w-full accent-pink-400"
                />
              </div>

              {/* Surround Ambience Spread */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300 font-semibold">
                  <span>Surround Ambience Spread (L-R Difference)</span>
                  <span className="font-mono text-emerald-400">{options.surroundSpread.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.5"
                  step="0.05"
                  value={options.surroundSpread}
                  onChange={(e) => setOptions((p) => ({ ...p, surroundSpread: parseFloat(e.target.value) }))}
                  className="w-full accent-emerald-400"
                />
              </div>

              {/* Advanced Matrix Accordion */}
              <div className="border-t border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAdvancedMatrix(!showAdvancedMatrix)}
                  className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <span>Advanced Delays & Channel Phase</span>
                  {showAdvancedMatrix ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showAdvancedMatrix && (
                  <div className="space-y-3 pt-3">
                    {/* Surround Delay */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Surround Decorrelation Delay</span>
                        <span className="font-mono text-cyan-400">{options.surroundDelayMs} ms</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="40"
                        step="1"
                        value={options.surroundDelayMs}
                        onChange={(e) => setOptions((p) => ({ ...p, surroundDelayMs: parseInt(e.target.value) }))}
                        className="w-full accent-cyan-400"
                      />
                    </div>

                    {/* Front Width */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Front Stereo Width Expansion</span>
                        <span className="font-mono text-cyan-400">{options.frontStereoWidth.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.05"
                        value={options.frontStereoWidth}
                        onChange={(e) => setOptions((p) => ({ ...p, frontStereoWidth: parseFloat(e.target.value) }))}
                        className="w-full accent-cyan-400"
                      />
                    </div>

                    {/* Rear Decorrelation (7.1 only) */}
                    {options.mode === 'surround-7-1' && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>7.1 Rear Ambience Decorrelation</span>
                          <span className="font-mono text-cyan-400">{options.rearDecorrelation.toFixed(2)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.4"
                          max="1.4"
                          step="0.05"
                          value={options.rearDecorrelation}
                          onChange={(e) => setOptions((p) => ({ ...p, rearDecorrelation: parseFloat(e.target.value) }))}
                          className="w-full accent-cyan-400"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Export Multi-Channel File Card */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 backdrop-blur-xl shadow-lg space-y-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400" />
                3. Export Multi-Channel File
              </h2>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'discrete-wav-24', label: '24-Bit Discrete WAV', sub: 'Studio Master Multi-ch' },
                  { id: 'discrete-wav-16', label: '16-Bit Discrete WAV', sub: 'Standard Multi-ch' },
                  { id: 'binaural-wav-24', label: '3D Headphone WAV', sub: 'Binaural Stereo' },
                  { id: 'binaural-mp3', label: '3D Headphone MP3', sub: '320k Binaural' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setExportFormat(fmt.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      exportFormat === fmt.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">{fmt.label}</div>
                    <div className="text-[9px] text-slate-500">{fmt.sub}</div>
                  </button>
                ))}
              </div>

              {isExporting && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs text-cyan-400">
                    <span>Rendering Channels...</span>
                    <span>{exportProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      exportCancelledRef.current = true
                      setIsExporting(false)
                    }}
                    className="text-[11px] text-rose-400 hover:underline"
                  >
                    Cancel Export
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={handleExportSurroundAudio}
                disabled={!sourceBuffer || isExporting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                {isExporting ? `Rendering... (${exportProgress}%)` : `Export ${options.mode === 'surround-7-1' ? '7.1 Discrete' : options.mode === 'surround-5-1' ? '5.1 Discrete' : '3D Binaural'} Mix`}
              </button>
            </div>
          </div>
        </div>

        {/* EDUCATIONAL & FAQ SECTION */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Stereo-to-Surround Upmixing Science
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-2">
              <h3 className="text-sm font-bold text-cyan-400">1. Centre Channel Extraction</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Correlated monaural audio present equally in Left and Right is isolated. A bandpass filter isolates vocal formants between 300 Hz and 3.5 kHz for crisp cinematic dialogue clarity.
              </p>
            </div>
            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-2">
              <h3 className="text-sm font-bold text-pink-400">2. Linkwitz-Riley LFE Crossover</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cascaded 2nd-order Butterworth filters generate a steep 24 dB/octave low-pass crossover to feed the dedicated subwoofer (LFE) channel without phase cancellation.
              </p>
            </div>
            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-2">
              <h3 className="text-sm font-bold text-emerald-400">3. Surround & Rear Ambience</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Anti-phase difference information (L - R) is extracted, delayed by 10 to 40 ms, and passed through high-frequency diffusion filters to simulate authentic theater side and rear acoustic envelopment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}

function formatTimeDisplay(sec: number): string {
  if (isNaN(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
