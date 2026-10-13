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
  Building2,
  Music,
  Activity,
} from 'lucide-react'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useToast } from '../components/common/Toast'
import {
  ReverbOptions,
  ReverbPresetId,
  WallMaterial,
  REVERB_PRESETS,
  MATERIAL_PROPERTIES,
  generateProceduralImpulseResponse,
  renderOfflineReverbAudio,
} from '../lib/audio/reverbEngine'
import { renderAcousticChamber } from '../lib/audio/reverbChamberRenderer'
import { decodeAudioFile } from '../lib/audio/audioProcessor'
import { extractWaveformData, renderWaveformOnCanvas, WaveformData } from '../lib/audio/waveformRenderer'
import { encodeMultiChannelWav } from '../lib/audio/encoders/multiChannelWavEncoder'
import { encodeAudioBufferToMp3 } from '../lib/audio/encoders/mp3Encoder'
import { generateVisualizerDemoSpecimen } from '../lib/video/demoAudioGenerator'

export const DtsCinemaReverbTool: React.FC = () => {
  const tool = getToolBySlug('dts-cinema-theater-reverb')!
  const { showToast } = useToast()

  // Audio state
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [sourceBuffer, setSourceBuffer] = useState<AudioBuffer | null>(null)
  const [waveformData, setWaveformData] = useState<WaveformData | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isBypassed, setIsBypassed] = useState<boolean>(false) // A/B Bypass (Dry vs Reverb)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [volume, setVolume] = useState<number>(1.0)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isLooping, setIsLooping] = useState<boolean>(false)
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false)
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false)

  // Reverb options
  const [options, setOptions] = useState<ReverbOptions>({
    preset: 'imax-dome',
    ...REVERB_PRESETS['imax-dome'].defaultOptions,
  })
  const [showAdvancedPhysics, setShowAdvancedPhysics] = useState<boolean>(false)

  // Export state
  const [exportBitDepth, setExportBitDepth] = useState<'24bit-wav' | '16bit-wav' | 'mp3'>('24bit-wav')
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const [exportProgress, setExportProgress] = useState<number>(0)
  const exportCancelledRef = useRef<boolean>(false)

  // Web Audio graph refs
  const audioContextRef = useRef<AudioContext | null>(null)
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null)
  const convolverNodeRef = useRef<ConvolverNode | null>(null)
  const dryGainNodeRef = useRef<GainNode | null>(null)
  const wetGainNodeRef = useRef<GainNode | null>(null)
  const masterGainNodeRef = useRef<GainNode | null>(null)
  const hfDampFilterRef = useRef<BiquadFilterNode | null>(null)
  const subFilterRef = useRef<BiquadFilterNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const playbackStartTimeRef = useRef<number>(0)
  const playbackStartOffsetRef = useRef<number>(0)
  const animationFrameRef = useRef<number | null>(null)
  const irDebounceTimerRef = useRef<any>(null)

  // Canvas refs
  const chamberCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Master AudioContext initialization
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioCtx()

      const convolver = ctx.createConvolver()
      convolver.normalize = false

      const hfFilter = ctx.createBiquadFilter()
      hfFilter.type = 'lowpass'
      hfFilter.frequency.value = options.hfDampingHz

      const subFilter = ctx.createBiquadFilter()
      subFilter.type = 'lowshelf'
      subFilter.frequency.value = 110
      subFilter.gain.value = (options.lfResonanceGain - 1.0) * 6.0

      const dryGain = ctx.createGain()
      const wetGain = ctx.createGain()
      const masterGain = ctx.createGain()

      const compressor = ctx.createDynamicsCompressor()
      compressor.threshold.value = -3.0
      compressor.knee.value = 8.0
      compressor.ratio.value = 12.0
      compressor.attack.value = 0.003
      compressor.release.value = 0.15

      const analyser = ctx.createAnalyser()
      analyser.fftSize = 512

      // Connections:
      // Convolver -> HF Filter -> Sub Filter -> Wet Gain -> Master Gain
      convolver.connect(hfFilter)
      hfFilter.connect(subFilter)
      subFilter.connect(wetGain)
      wetGain.connect(masterGain)

      // Dry Gain -> Master Gain
      dryGain.connect(masterGain)

      // Master Gain -> Compressor -> Analyser -> Destination
      masterGain.connect(compressor)
      compressor.connect(analyser)
      analyser.connect(ctx.destination)

      audioContextRef.current = ctx
      convolverNodeRef.current = convolver
      dryGainNodeRef.current = dryGain
      wetGainNodeRef.current = wetGain
      masterGainNodeRef.current = masterGain
      hfDampFilterRef.current = hfFilter
      subFilterRef.current = subFilter
      analyserRef.current = analyser

      // Generate initial IR buffer
      const ir = generateProceduralImpulseResponse(ctx, options)
      convolver.buffer = ir
    }
    return audioContextRef.current
  }, [options])

  // Update real-time gains and filters when options change
  useEffect(() => {
    if (dryGainNodeRef.current && wetGainNodeRef.current && masterGainNodeRef.current) {
      if (isBypassed) {
        dryGainNodeRef.current.gain.value = 1.0
        wetGainNodeRef.current.gain.value = 0.0
      } else {
        const mix = options.wetDryMix
        dryGainNodeRef.current.gain.value = Math.cos(mix * 0.5 * Math.PI)
        wetGainNodeRef.current.gain.value = Math.sin(mix * 0.5 * Math.PI)
      }
      masterGainNodeRef.current.gain.value = isMuted ? 0 : volume * options.outputGain
    }

    if (hfDampFilterRef.current) {
      hfDampFilterRef.current.frequency.value = options.hfDampingHz
    }
    if (subFilterRef.current) {
      subFilterRef.current.gain.value = (options.lfResonanceGain - 1.0) * 6.0
    }
  }, [options.wetDryMix, options.outputGain, options.hfDampingHz, options.lfResonanceGain, volume, isMuted, isBypassed])

  // Debounced IR regeneration when physical acoustic dimensions change
  useEffect(() => {
    if (irDebounceTimerRef.current) {
      clearTimeout(irDebounceTimerRef.current)
    }

    irDebounceTimerRef.current = setTimeout(() => {
      if (audioContextRef.current && convolverNodeRef.current) {
        try {
          const ir = generateProceduralImpulseResponse(audioContextRef.current, options)
          convolverNodeRef.current.buffer = ir
        } catch (e) {
          // Ignore
        }
      }
    }, 120)

    return () => {
      if (irDebounceTimerRef.current) clearTimeout(irDebounceTimerRef.current)
    }
  }, [options.roomLength, options.roomWidth, options.roomHeight, options.wallMaterial, options.rt60, options.preDelayMs, options.earlyReflectionLevel, options.lateReverbLevel])

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

      // Connect source to both Dry and Convolver nodes
      if (dryGainNodeRef.current && convolverNodeRef.current) {
        source.connect(dryGainNodeRef.current)
        source.connect(convolverNodeRef.current)
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

  // Handle Audio File Loading
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

        // Extract waveform data for visualizer
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

  // Handle Demo Audio Specimen
  const handleLoadDemoAudio = useCallback(async () => {
    stopAllAudio()
    setIsLoadingAudio(true)
    try {
      showToast('Synthesizing cinema specimen track...', 'info')
      const demo = await generateVisualizerDemoSpecimen()
      await handleLoadAudioFile(demo)
      showToast('Specimen loaded! Press Play to hear cinema acoustics.', 'success')
    } catch (e: any) {
      showToast('Failed to load demo track.', 'error')
    } finally {
      setIsLoadingAudio(false)
    }
  }, [stopAllAudio, handleLoadAudioFile, showToast])

  // Select Preset Handler
  const handleSelectPreset = useCallback((presetId: ReverbPresetId) => {
    const p = REVERB_PRESETS[presetId]
    setOptions((prev) => ({
      ...prev,
      preset: presetId,
      ...p.defaultOptions,
    }))
    showToast(`Loaded ${p.name}`, 'info')
  }, [showToast])

  // Spacebar hotkey
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

  // Canvas visualizer render loop
  useEffect(() => {
    let isRunning = true
    const freqData = new Uint8Array(256)

    const render = () => {
      if (!isRunning) return
      const nowSec = performance.now() / 1000

      // Update current time
      if (isPlaying && audioContextRef.current) {
        const elapsed = audioContextRef.current.currentTime - playbackStartTimeRef.current
        const curr = Math.min(duration, playbackStartOffsetRef.current + elapsed)
        setCurrentTime(curr)
      }

      // Calculate real energy from AnalyserNode
      let energy = 0
      if (analyserRef.current && isPlaying) {
        analyserRef.current.getByteFrequencyData(freqData)
        let sum = 0
        for (let i = 0; i < 32; i++) sum += freqData[i]
        energy = sum / (32 * 255)
      }

      // Render Chamber Canvas
      if (chamberCanvasRef.current) {
        renderAcousticChamber(
          chamberCanvasRef.current,
          options,
          { audioEnergy: energy, isPlaying, isBypassed },
          nowSec
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
  }, [isPlaying, isBypassed, duration, options, waveformData])

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

  // Offline Audio Export Handler
  const handleExportReverbAudio = useCallback(async () => {
    if (!sourceBuffer) {
      showToast('Please load an audio file first.', 'error')
      return
    }

    setIsExporting(true)
    setExportProgress(5)
    exportCancelledRef.current = false

    try {
      showToast('Rendering cinema acoustic reverb offline...', 'info')
      const renderedBuffer = await renderOfflineReverbAudio(
        sourceBuffer,
        options,
        (pct) => setExportProgress(pct)
      )

      if (exportCancelledRef.current) {
        showToast('Export cancelled.', 'info')
        return
      }

      let blob: Blob
      let ext: string

      if (exportBitDepth === 'mp3') {
        setExportProgress(88)
        blob = await encodeAudioBufferToMp3(renderedBuffer, {
          kbps: 320,
          onProgress: (pct) => setExportProgress(85 + Math.round(pct * 0.15)),
          isCancelled: () => exportCancelledRef.current,
        })
        ext = 'mp3'
      } else {
        const bitDepth = exportBitDepth === '24bit-wav' ? 24 : 16
        setExportProgress(90)
        blob = await encodeMultiChannelWav(
          [renderedBuffer.getChannelData(0), renderedBuffer.getChannelData(1)],
          renderedBuffer.sampleRate,
          {
            bitDepth,
            onProgress: (pct) => setExportProgress(85 + Math.round(pct * 0.15)),
            isCancelled: () => exportCancelledRef.current,
          }
        )
        ext = 'wav'
      }

      // Trigger client-side download
      const cleanName = (audioFile?.name || 'audio').replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
      const outFilename = `${cleanName}_Cinema_Theater_Mix_${options.preset}.${ext}`

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
      showToast(`Exported ${outFilename} (${mb} MB)`, 'success')
    } catch (err: any) {
      showToast(err.message || 'Export failed.', 'error')
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }, [sourceBuffer, options, exportBitDepth, audioFile, showToast])

  return (
    <ToolPageLayout
      tool={tool}
      customTitle="Free DTS Cinema Theater Acoustic Reverb Simulator | IndiaTools"
      customDescription="Transform any audio track into a master-grade cinema theater acoustic experience. Procedural impulse responses for IMAX domes, vintage halls, and VIP screening rooms with zero server uploads."
      maxWidthClass="max-w-7xl"
    >
      <div className="space-y-6">
        {/* CINEMATIC HERO SECTION */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-zinc-950 to-amber-950/40 p-6 md:p-8 border border-amber-500/25 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                DTS Cinema Acoustic Lab • Procedural Impulse Responses
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Cinema Theater <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">Acoustic Reverb</span> Simulator
              </h1>
              <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
                Experience physical cinema acoustics inside your browser. Mathematically simulated early reflection ray bounces, RT60 decay curves, and authentic architectural resonance with 100% client-side privacy.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleLoadDemoAudio}
                disabled={isLoadingAudio}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                Try Cinema Sample
              </button>

              <button
                onClick={handleExportReverbAudio}
                disabled={!sourceBuffer || isExporting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {isExporting ? `Exporting (${exportProgress}%)` : 'Export Master'}
              </button>
            </div>
          </div>
        </div>

        {/* TRUST AND PRIVACY STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-1">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Zero Audio Uploads (100% In-Browser)</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <Cpu className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Procedural Mathematical IR Engine</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>5 Architect-Modeled Cinema Presets</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <Disc className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Studio 24-Bit PCM WAV Export</span>
          </div>
        </div>

        {/* WORKSPACE: VISUAL CHAMBER & REVERB CONTROLS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Chamber Visualizer & Transport (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Visualizer Canvas Card */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-2xl backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`} />
                  <span className="text-xs font-bold text-white tracking-wider uppercase">
                    Interactive Acoustic Auditorium
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {REVERB_PRESETS[options.preset].name}
                  </span>
                </div>
              </div>

              {/* 3D Isometric Chamber Canvas */}
              <div className="relative w-full aspect-[16/10] max-h-[440px] overflow-hidden rounded-xl bg-black border border-slate-800/80 shadow-inner flex items-center justify-center">
                <canvas
                  ref={chamberCanvasRef}
                  width={800}
                  height={500}
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
                    className="w-full h-2 rounded-lg bg-slate-800 accent-amber-400 cursor-pointer disabled:opacity-40"
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
                          ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/20'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
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
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
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
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      } disabled:opacity-40`}
                    >
                      {isBypassed ? 'A/B: DRY (BYPASS)' : 'A/B: REVERB (ON)'}
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
                      className="w-20 md:w-28 h-1.5 rounded-lg bg-slate-800 accent-amber-400 cursor-pointer"
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
                  ? 'border-amber-400 bg-amber-950/20'
                  : 'border-slate-800 hover:border-amber-500/40 bg-slate-900/40'
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
                <Upload className="w-5 h-5 text-amber-400" />
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-200">
                    {audioFile ? audioFile.name : 'Click or Drop Audio to Process (MP3, WAV, FLAC, M4A, OGG)'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {sourceBuffer
                      ? `${(sourceBuffer.duration).toFixed(1)}s • ${sourceBuffer.sampleRate} Hz • ${sourceBuffer.numberOfChannels} ch`
                      : 'Audio processed entirely in device memory with zero server uploads.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Studio Acoustic Controls & Export (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Presets Selector Card */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 backdrop-blur-xl shadow-lg space-y-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                1. Cinema Presets
              </h2>

              <div className="space-y-2">
                {(Object.keys(REVERB_PRESETS) as ReverbPresetId[]).map((pid) => {
                  const p = REVERB_PRESETS[pid]
                  const isSelected = options.preset === pid
                  return (
                    <button
                      key={pid}
                      type="button"
                      onClick={() => handleSelectPreset(pid)}
                      className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400 text-white shadow-md shadow-amber-500/10'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{p.name}</span>
                        <span className="text-[10px] font-mono text-amber-400">
                          RT60: {p.defaultOptions.rt60}s
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{p.subtitle}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Reverb Tuning & Mixer Controls Card */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 backdrop-blur-xl shadow-lg space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                2. Acoustic Master Controls
              </h2>

              {/* Wet / Dry Mix */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300 font-semibold">
                  <span>Wet / Dry Reverb Mix</span>
                  <span className="font-mono text-amber-400">{Math.round(options.wetDryMix * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={options.wetDryMix}
                  onChange={(e) => setOptions((p) => ({ ...p, wetDryMix: parseFloat(e.target.value) }))}
                  className="w-full accent-amber-400"
                />
              </div>

              {/* RT60 Reverb Decay */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300 font-semibold">
                  <span>RT60 Reverb Decay</span>
                  <span className="font-mono text-amber-400">{options.rt60.toFixed(2)}s</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="5.5"
                  step="0.1"
                  value={options.rt60}
                  onChange={(e) => setOptions((p) => ({ ...p, rt60: parseFloat(e.target.value) }))}
                  className="w-full accent-amber-400"
                />
              </div>

              {/* Pre-Delay */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300 font-semibold">
                  <span>Pre-Delay Time</span>
                  <span className="font-mono text-amber-400">{options.preDelayMs} ms</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="2"
                  value={options.preDelayMs}
                  onChange={(e) => setOptions((p) => ({ ...p, preDelayMs: parseInt(e.target.value) }))}
                  className="w-full accent-amber-400"
                />
              </div>

              {/* Wall Material Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Auditorium Wall Material</label>
                <select
                  value={options.wallMaterial}
                  onChange={(e) => setOptions((p) => ({ ...p, wallMaterial: e.target.value as WallMaterial }))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                >
                  {(Object.keys(MATERIAL_PROPERTIES) as WallMaterial[]).map((mat) => (
                    <option key={mat} value={mat}>
                      {MATERIAL_PROPERTIES[mat].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Advanced Geometry Accordion */}
              <div className="border-t border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAdvancedPhysics(!showAdvancedPhysics)}
                  className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <span>Advanced Room Geometry & Sub EQ</span>
                  {showAdvancedPhysics ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showAdvancedPhysics && (
                  <div className="space-y-3 pt-3">
                    {/* Room Dimensions */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400">Length ({options.roomLength}m)</span>
                        <input
                          type="range"
                          min="10"
                          max="55"
                          step="1"
                          value={options.roomLength}
                          onChange={(e) => setOptions((p) => ({ ...p, roomLength: parseInt(e.target.value) }))}
                          className="w-full accent-amber-400"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400">Width ({options.roomWidth}m)</span>
                        <input
                          type="range"
                          min="8"
                          max="35"
                          step="1"
                          value={options.roomWidth}
                          onChange={(e) => setOptions((p) => ({ ...p, roomWidth: parseInt(e.target.value) }))}
                          className="w-full accent-amber-400"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400">Height ({options.roomHeight}m)</span>
                        <input
                          type="range"
                          min="3"
                          max="22"
                          step="0.5"
                          value={options.roomHeight}
                          onChange={(e) => setOptions((p) => ({ ...p, roomHeight: parseFloat(e.target.value) }))}
                          className="w-full accent-amber-400"
                        />
                      </div>
                    </div>

                    {/* HF Damping */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>High-Frequency Dampening Cutoff</span>
                        <span className="font-mono text-amber-400">{options.hfDampingHz} Hz</span>
                      </div>
                      <input
                        type="range"
                        min="2000"
                        max="14000"
                        step="250"
                        value={options.hfDampingHz}
                        onChange={(e) => setOptions((p) => ({ ...p, hfDampingHz: parseInt(e.target.value) }))}
                        className="w-full accent-amber-400"
                      />
                    </div>

                    {/* Sub-Bass Resonance */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Cinema Sub-Bass Resonance</span>
                        <span className="font-mono text-amber-400">{options.lfResonanceGain.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.05"
                        value={options.lfResonanceGain}
                        onChange={(e) => setOptions((p) => ({ ...p, lfResonanceGain: parseFloat(e.target.value) }))}
                        className="w-full accent-amber-400"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Export Master Options Card */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 backdrop-blur-xl shadow-lg space-y-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-amber-400" />
                3. Export Cinema Master
              </h2>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '24bit-wav', label: '24-Bit WAV', sub: 'Studio Master' },
                  { id: '16bit-wav', label: '16-Bit WAV', sub: 'CD Standard' },
                  { id: 'mp3', label: '320k MP3', sub: 'High Bitrate' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setExportBitDepth(fmt.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      exportBitDepth === fmt.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
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
                  <div className="flex justify-between text-xs text-amber-400">
                    <span>Rendering Reverb...</span>
                    <span>{exportProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 transition-all duration-300"
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
                onClick={handleExportReverbAudio}
                disabled={!sourceBuffer || isExporting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                {isExporting ? `Rendering... (${exportProgress}%)` : 'Render & Download Master Mix'}
              </button>
            </div>
          </div>
        </div>

        {/* EDUCATIONAL & FAQ SECTION */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-400" />
            Cinema Acoustics Explained
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-2">
              <h3 className="text-sm font-bold text-amber-400">1. Geometric Early Reflections</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sound travels at 343 m/s. Our engine calculates ray delays off the auditorium walls, floor, and ceiling to create psychoacoustic physical space perception.
              </p>
            </div>
            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-2">
              <h3 className="text-sm font-bold text-amber-400">2. Exponential RT60 Decay</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                RT60 is the time required for reverberation energy to drop by 60 dB. Cinema auditoriums require 1.2s to 2.8s for immersive dialog clarity and cinematic grandeur.
              </p>
            </div>
            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-2">
              <h3 className="text-sm font-bold text-amber-400">3. 100% In-Browser Privacy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Procedural impulse response generation and offline audio processing run locally using the Web Audio API. Your songs and film tracks are never uploaded to any server.
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
