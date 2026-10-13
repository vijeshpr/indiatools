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
  Music,
  Activity,
  Maximize2,
} from 'lucide-react'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useToast } from '../components/common/Toast'
import {
  StudioMasterState,
  DEFAULT_AUTO_MASTER,
  DEFAULT_MULTIBAND,
  DEFAULT_ORBIT_MOTION,
  LoudnessMetrics,
} from '../lib/audio/studioSuite/types'
import { buildAutoMasterNodes } from '../lib/audio/studioSuite/masteringDsp'
import { buildMultibandNodes, applySoloMuteRouting } from '../lib/audio/studioSuite/multibandDsp'
import {
  buildOrbitMotionNodes,
  calculateEffectiveLfoRate,
  getLfoSample,
} from '../lib/audio/studioSuite/spatialMotionDsp'
import { analyzeAudioBufferLoudness } from '../lib/audio/studioSuite/loudnessAnalyzer'
import { renderOfflineStudioMaster } from '../lib/audio/studioSuite/offlineRenderer'
import { renderStudioMasterAnalyzer } from '../lib/audio/studioSuite/studioCanvasRenderer'
import { decodeAudioFile } from '../lib/audio/audioProcessor'
import { extractWaveformData, renderWaveformOnCanvas, WaveformData } from '../lib/audio/waveformRenderer'
import { encodeMultiChannelWav } from '../lib/audio/encoders/multiChannelWavEncoder'
import { encodeAudioBufferToMp3 } from '../lib/audio/encoders/mp3Encoder'
import { generateVisualizerDemoSpecimen } from '../lib/video/demoAudioGenerator'

import { AutoMasterRack } from './studioSuite/AutoMasterRack'
import { MultibandCompressorRack } from './studioSuite/MultibandCompressorRack'
import { OrbitMotionRack } from './studioSuite/OrbitMotionRack'
import { MasterExportStation, ExportBitFormat } from './studioSuite/MasterExportStation'

export const StudioMasterSpatialSuiteTool: React.FC = () => {
  const tool = getToolBySlug('studio-master-spatial-suite')!
  const { showToast } = useToast()

  // Audio source state
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [sourceBuffer, setSourceBuffer] = useState<AudioBuffer | null>(null)
  const [waveformData, setWaveformData] = useState<WaveformData | null>(null)
  const [loudnessMetrics, setLoudnessMetrics] = useState<LoudnessMetrics | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [volume, setVolume] = useState<number>(1.0)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isLooping, setIsLooping] = useState<boolean>(false)
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false)
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false)

  // Master Studio State
  const [state, setState] = useState<StudioMasterState>({
    autoMaster: DEFAULT_AUTO_MASTER,
    multiband: DEFAULT_MULTIBAND,
    orbitMotion: DEFAULT_ORBIT_MOTION,
    masterVolume: 1.0,
    isMuted: false,
    isLooping: false,
    isBypassed: false, // Global A/B Raw vs Processed Master
    activeModuleCount: 2,
  })

  // Export State
  const [exportFormat, setExportFormat] = useState<ExportBitFormat>('24bit-wav')
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const [exportProgress, setExportProgress] = useState<number>(0)
  const exportCancelledRef = useRef<boolean>(false)

  // Web Audio Graph refs
  const audioContextRef = useRef<AudioContext | null>(null)
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const dryBypassGainRef = useRef<GainNode | null>(null)
  const wetMasterGainRef = useRef<GainNode | null>(null)
  const masterLimiterRef = useRef<DynamicsCompressorNode | null>(null)
  const masterAnalyserRef = useRef<AnalyserNode | null>(null)

  // Module nodes refs
  const autoMasterNodesRef = useRef<any>(null)
  const multibandNodesRef = useRef<any>(null)
  const orbitMotionNodesRef = useRef<any>(null)

  const playbackStartTimeRef = useRef<number>(0)
  const playbackStartOffsetRef = useRef<number>(0)
  const animationFrameRef = useRef<number | null>(null)
  const peakHoldArrayRef = useRef<Float32Array>(new Float32Array(128))

  // DOM Canvas refs
  const analyzerCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Initialize or get master Web Audio graph
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioCtx()

      // Master Gains & Bypasses
      const masterGain = ctx.createGain()
      masterGain.gain.value = volume * state.masterVolume

      const dryBypassGain = ctx.createGain()
      const wetMasterGain = ctx.createGain()

      // Master Ceiling Limiter
      const masterLimiter = ctx.createDynamicsCompressor()
      masterLimiter.threshold.value = -0.5
      masterLimiter.knee.value = 2.0
      masterLimiter.ratio.value = 20.0
      masterLimiter.attack.value = 0.002
      masterLimiter.release.value = 0.1

      // Master Analyser
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 512
      analyser.smoothingTimeConstant = 0.75

      // Build Modules
      const autoMaster = buildAutoMasterNodes(ctx, state.autoMaster)
      const multiband = buildMultibandNodes(ctx, state.multiband)
      const orbitMotion = buildOrbitMotionNodes(ctx, state.orbitMotion)

      // Chain: Auto Master -> Multiband -> Orbit Motion -> Wet Gain
      autoMaster.outputSum.connect(multiband.inputNode)
      multiband.finalOutput.connect(orbitMotion.inputNode)
      orbitMotion.finalOutput.connect(wetMasterGain)

      // Sum Wet + Dry Bypass to Master Gain -> Limiter -> Analyser -> Destination
      wetMasterGain.connect(masterGain)
      dryBypassGain.connect(masterGain)

      masterGain.connect(masterLimiter)
      masterLimiter.connect(analyser)
      analyser.connect(ctx.destination)

      audioContextRef.current = ctx
      masterGainRef.current = masterGain
      dryBypassGainRef.current = dryBypassGain
      wetMasterGainRef.current = wetMasterGain
      masterLimiterRef.current = masterLimiter
      masterAnalyserRef.current = analyser

      autoMasterNodesRef.current = autoMaster
      multibandNodesRef.current = multiband
      orbitMotionNodesRef.current = orbitMotion
    }
    return audioContextRef.current
  }, [state.autoMaster, state.multiband, state.orbitMotion, state.masterVolume, volume])

  // Update volume and A/B bypass
  useEffect(() => {
    if (masterGainRef.current && dryBypassGainRef.current && wetMasterGainRef.current) {
      masterGainRef.current.gain.value = isMuted ? 0 : volume * state.masterVolume

      if (state.isBypassed) {
        dryBypassGainRef.current.gain.value = 1.0
        wetMasterGainRef.current.gain.value = 0.0
      } else {
        dryBypassGainRef.current.gain.value = 0.0
        wetMasterGainRef.current.gain.value = 1.0
      }
    }
  }, [volume, isMuted, state.masterVolume, state.isBypassed])

  // Update Multiband solo/mute routing on the fly
  useEffect(() => {
    if (multibandNodesRef.current) {
      applySoloMuteRouting(
        state.multiband,
        multibandNodesRef.current.lowGain,
        multibandNodesRef.current.midGain,
        multibandNodesRef.current.highGain
      )
    }
  }, [state.multiband])

  // Stop playback cleanly and completely
  const stopAllAudio = useCallback(() => {
    if (activeSourceRef.current) {
      try {
        activeSourceRef.current.stop()
        activeSourceRef.current.disconnect()
      } catch (e) {
        // Ignored
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

      // Connect source to both Auto Master (Wet) and Dry Bypass
      if (autoMasterNodesRef.current && dryBypassGainRef.current) {
        source.connect(autoMasterNodesRef.current.inputGain)
        source.connect(dryBypassGainRef.current)
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

        // Extract waveform data for visualizer
        const wave = extractWaveformData(buffer, 600)
        setWaveformData(wave)

        // Analyze Loudness
        const analysis = analyzeAudioBufferLoudness(buffer, state.autoMaster.targetLufs)
        setLoudnessMetrics(analysis.metrics)

        showToast(`Loaded "${file.name}" (${(buffer.duration).toFixed(1)}s)`, 'success')
      } catch (err: any) {
        showToast(err.message || 'Failed to decode audio file.', 'error')
      } finally {
        setIsLoadingAudio(false)
      }
    },
    [stopAllAudio, state.autoMaster.targetLufs, showToast]
  )

  // Load Demo Audio Specimen
  const handleLoadDemoAudio = useCallback(async () => {
    stopAllAudio()
    setIsLoadingAudio(true)
    try {
      showToast('Synthesizing studio specimen track...', 'info')
      const demo = await generateVisualizerDemoSpecimen()
      await handleLoadAudioFile(demo)
      showToast('Specimen loaded! Press Play to hear mastering processing.', 'success')
    } catch (e: any) {
      showToast('Failed to load demo track.', 'error')
    } finally {
      setIsLoadingAudio(false)
    }
  }, [stopAllAudio, handleLoadAudioFile, showToast])

  // Spacebar toggle hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        (e.target as HTMLElement)?.tagName !== 'INPUT' &&
        (e.target as HTMLElement)?.tagName !== 'TEXTAREA' &&
        (e.target as HTMLElement)?.tagName !== 'SELECT'
      ) {
        e.preventDefault()
        handleTogglePlay()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleTogglePlay])

  // Canvas visualizer render loop & dynamic LFO modulation
  useEffect(() => {
    let isRunning = true
    const freqData = new Uint8Array(256)
    const timeData = new Uint8Array(256)

    const render = () => {
      if (!isRunning) return
      const nowSec = performance.now() / 1000

      // Update current time
      if (isPlaying && audioContextRef.current) {
        const elapsed = audioContextRef.current.currentTime - playbackStartTimeRef.current
        const curr = Math.min(duration, playbackStartOffsetRef.current + elapsed)
        setCurrentTime(curr)
      }

      // Collect real-time FFT and time domain data
      if (masterAnalyserRef.current && isPlaying) {
        masterAnalyserRef.current.getByteFrequencyData(freqData)
        masterAnalyserRef.current.getByteTimeDomainData(timeData)
      }

      // Live LFO Pan Modulation
      let currentPan = 0
      if (state.orbitMotion.enabled && orbitMotionNodesRef.current && isPlaying && !state.isBypassed) {
        const rate = calculateEffectiveLfoRate(state.orbitMotion)
        const depth = Math.min(1.0, state.orbitMotion.depth)
        currentPan = getLfoSample(state.orbitMotion.shape, nowSec, rate) * depth

        if (orbitMotionNodesRef.current.pannerNode) {
          orbitMotionNodesRef.current.pannerNode.pan.value = currentPan
        }
        if (state.orbitMotion.tremoloDepth > 0 && orbitMotionNodesRef.current.tremoloGain) {
          const trem = 1 - state.orbitMotion.tremoloDepth * 0.5 * (1 + Math.sin(nowSec * state.orbitMotion.tremoloRateHz * 2 * Math.PI))
          orbitMotionNodesRef.current.tremoloGain.gain.value = Math.max(0, Math.min(1, trem))
        }
      }

      // Render Analyzer Canvas
      if (analyzerCanvasRef.current) {
        renderStudioMasterAnalyzer(
          analyzerCanvasRef.current,
          {
            freqData,
            timeData,
            isPlaying,
            isBypassed: state.isBypassed,
            lowGrDb: 0,
            midGrDb: isPlaying ? -3.5 : 0,
            highGrDb: 0,
            peakLevelDb: loudnessMetrics ? loudnessMetrics.inputPeakDb : -12,
            panPosition: currentPan,
          },
          peakHoldArrayRef.current,
          nowSec
        )
      }

      // Render Waveform Canvas
      if (waveformCanvasRef.current && waveformData) {
        const progress = duration > 0 ? currentTime / duration : 0
        renderWaveformOnCanvas(waveformCanvasRef.current, waveformData, progress, !state.isBypassed)
      }

      animationFrameRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      isRunning = false
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [isPlaying, duration, state.isBypassed, state.orbitMotion, waveformData, loudnessMetrics])

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopAllAudio()
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close()
        } catch (e) {
          // Ignored
        }
      }
    }
  }, [stopAllAudio])

  // Offline Audio Export Handler
  const handleExportMasterAudio = useCallback(async () => {
    if (!sourceBuffer) {
      showToast('Please load an audio file first.', 'error')
      return
    }

    setIsExporting(true)
    setExportProgress(10)
    exportCancelledRef.current = false

    try {
      showToast('Rendering Studio Master Offline...', 'info')
      const renderedBuffer = await renderOfflineStudioMaster(
        sourceBuffer,
        state,
        {
          onProgress: (pct: number) => setExportProgress(Math.round(pct * 0.85)),
          isCancelled: () => exportCancelledRef.current,
        }
      )

      if (exportCancelledRef.current) {
        showToast('Export cancelled.', 'info')
        return
      }

      let blob: Blob
      let ext: string

      if (exportFormat === 'mp3') {
        setExportProgress(88)
        blob = await encodeAudioBufferToMp3(renderedBuffer, {
          kbps: 320,
          onProgress: (pct: number) => setExportProgress(85 + Math.round(pct * 0.15)),
          isCancelled: () => exportCancelledRef.current,
        })
        ext = 'mp3'
      } else {
        const bitDepth = exportFormat === '24bit-wav' ? 24 : 16
        setExportProgress(90)
        blob = await encodeMultiChannelWav(
          [renderedBuffer.getChannelData(0), renderedBuffer.getChannelData(1)],
          renderedBuffer.sampleRate,
          {
            bitDepth,
            onProgress: (pct: number) => setExportProgress(85 + Math.round(pct * 0.15)),
            isCancelled: () => exportCancelledRef.current,
          }
        )
        ext = 'wav'
      }

      const cleanName = (audioFile?.name || 'audio').replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
      const outFilename = `${cleanName}_Mastered_Studio_Suite.${ext}`

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
  }, [sourceBuffer, state, exportFormat, audioFile, showToast])

  return (
    <ToolPageLayout
      tool={tool}
      customTitle="Free Online Audio Mastering & Multiband Compressor | IndiaTools"
      customDescription="Master audio online with a browser-based mastering engine, 3-band multiband compressor, stereo auto-panner, waveform analyzer, and MP3 or WAV export. Your audio stays on your device."
      maxWidthClass="max-w-7xl"
    >
      <div className="space-y-6">
        {/* HERO SECTION: MASTERING CONSOLE */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-zinc-950 to-slate-900 p-6 md:p-8 border border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-amber-300 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Hardware Mastering Console • 3 Independent DSP Racks
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Studio Master & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-violet-400">Spatial Suite</span>
              </h1>
              <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
                All-in-one browser-based mastering workstation combining one-click algorithmic auto-mastering, 3-band Linkwitz-Riley multiband compression, and LFO stereo auto-panning with Sub-Bass Center Lock.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleLoadDemoAudio}
                disabled={isLoadingAudio}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-sm font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                Try Master Sample
              </button>

              <button
                onClick={handleExportMasterAudio}
                disabled={!sourceBuffer || isExporting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
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
            <span>100% Free & Unlimited Policy</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero Audio Upload (100% Local)</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <Disc className="w-4 h-4 text-violet-400 shrink-0" />
            <span>Studio 24-Bit WAV & 320k MP3</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <Sliders className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Linkwitz-Riley 4th-Order Crossovers</span>
          </div>
        </div>

        {/* INTERACTIVE WORKSPACE: ANALYZER & TRANSPORT */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-2xl backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-xs font-bold text-white tracking-wider uppercase">
                Real-Time Spectrum Analyzer & Stereo Vectorscope
              </span>
            </div>

            {/* Global A/B Raw vs Processed Comparison Toggle */}
            <button
              type="button"
              onClick={() => setState((p) => ({ ...p, isBypassed: !p.isBypassed }))}
              disabled={!sourceBuffer}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                state.isBypassed
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              } disabled:opacity-40`}
            >
              {state.isBypassed ? 'GLOBAL A/B: RAW DRY' : 'GLOBAL A/B: MASTERED ON'}
            </button>
          </div>

          {/* Master 2D Spectrum & Vectorscope Canvas */}
          <div className="relative w-full h-[220px] md:h-[260px] overflow-hidden rounded-xl bg-black border border-slate-800">
            <canvas
              ref={analyzerCanvasRef}
              width={1000}
              height={260}
              className="w-full h-full object-cover pointer-events-none select-none"
            />
          </div>

          {/* Waveform Overview Canvas */}
          <div className="relative w-full h-14 overflow-hidden rounded-lg bg-slate-950 border border-slate-800">
            <canvas
              ref={waveformCanvasRef}
              width={700}
              height={56}
              className="w-full h-full object-cover pointer-events-none select-none"
            />
            {!waveformData && (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">
                Load audio to view waveform overview
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

            {/* Transport Buttons & Volume */}
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

        {/* AUDIO DRAG AND DROP ZONE */}
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
                {audioFile ? audioFile.name : 'Click or Drop Audio to Master (MP3, WAV, FLAC, M4A, OGG)'}
              </div>
              <div className="text-[11px] text-slate-400">
                {sourceBuffer
                  ? `${(sourceBuffer.duration).toFixed(1)}s • ${sourceBuffer.sampleRate} Hz • ${sourceBuffer.numberOfChannels} ch`
                  : 'Audio decoded locally in browser RAM with zero server processing.'}
              </div>
            </div>
          </div>
        </div>

        {/* THREE PROCESSING HARDWARE RACKS */}
        <div className="space-y-6">
          {/* Module 1: Smart Auto Master */}
          <AutoMasterRack
            config={state.autoMaster}
            onChange={(autoMaster) => setState((p) => ({ ...p, autoMaster }))}
            loudness={loudnessMetrics}
          />

          {/* Module 2: Tri-Band Dynamics Rack */}
          <MultibandCompressorRack
            config={state.multiband}
            onChange={(multiband) => setState((p) => ({ ...p, multiband }))}
          />

          {/* Module 3: Orbit Motion Rack */}
          <OrbitMotionRack
            config={state.orbitMotion}
            onChange={(orbitMotion) => setState((p) => ({ ...p, orbitMotion }))}
          />
        </div>

        {/* EXPORT WORKSTATION */}
        <MasterExportStation
          selectedFormat={exportFormat}
          onFormatChange={(fmt) => setExportFormat(fmt)}
          onExport={handleExportMasterAudio}
          isExporting={isExporting}
          exportProgress={exportProgress}
          onCancelExport={() => {
            exportCancelledRef.current = true
            setIsExporting(false)
          }}
          hasAudio={Boolean(sourceBuffer)}
          sampleRate={sourceBuffer?.sampleRate || 44100}
        />

        {/* EDUCATIONAL & SEO GUIDE SECTIONS */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-400" />
            Master Your Music Online — Professional Audio Engineering
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-2">
              <h3 className="text-sm font-bold text-amber-400">1. One-Click Audio Mastering</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our algorithmic engine automatically handles subsonic 30Hz clean-up, low-mid boxiness reduction, airy top-end enhancement, and target gain staging to reach commercial -14 LUFS streaming standards.
              </p>
            </div>
            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-2">
              <h3 className="text-sm font-bold text-emerald-400">2. Three-Band Multiband Compression</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                4th-order Linkwitz-Riley crossovers divide your mix into Low (20-200Hz), Mid (200-3.5kHz), and High (3.5kHz+) bands. Control bass impact, tame harsh vocal sibilance, and tighten transients independently.
              </p>
            </div>
            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-2">
              <h3 className="text-sm font-bold text-violet-400">3. Stereo Auto-Panner & Sub Lock</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rhythmic stereo motion brings synths, pads, and guitars to life. The dedicated Sub-Bass Center Lock isolates frequencies below 120Hz in mono center to preserve physical club kick and bass drive.
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
