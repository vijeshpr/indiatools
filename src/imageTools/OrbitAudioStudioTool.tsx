import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Compass,
  Headphones,
  RotateCcw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Repeat,
  Download,
  Sparkles,
  Upload,
  FileAudio,
  Radio,
  SlidersHorizontal,
  ShieldCheck,
  Cpu,
  Zap,
  Disc,
  AlertCircle,
  AlertTriangle,
  X,
  FileDown,
  RotateCw,
  Power,
} from 'lucide-react'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useToast } from '../components/common/Toast'
import {
  SpatialMode,
  SpatialPreset,
  SpatialOptions,
  SpatialCoordinate,
  PRESET_CONFIGS,
  getSpatialCoordinates,
  createSyntheticImpulseResponse,
  generateSpatialDemoSpecimen,
  renderOfflineSpatialAudio,
} from '../lib/audio/spatialEngine'
import { renderSpatialRadar, RadarPoint } from '../lib/audio/spatialRadarRenderer'
import { extractWaveformData, renderWaveformOnCanvas, WaveformData } from '../lib/audio/waveformRenderer'
import { decodeAudioFile } from '../lib/audio/audioProcessor'
import { encodeAudioBufferToWav } from '../lib/audio/encoders/wavEncoder'
import { encodeAudioBufferToMp3 } from '../lib/audio/encoders/mp3Encoder'

export const OrbitAudioStudioTool: React.FC = () => {
  const tool = getToolBySlug('orbit-audio-studio')!
  const { showToast } = useToast()

  // Audio source state
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [sourceBuffer, setSourceBuffer] = useState<AudioBuffer | null>(null)
  const [waveformData, setWaveformData] = useState<WaveformData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingStep, setLoadingStep] = useState<string>('')
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isMono, setIsMono] = useState<boolean>(false)
  const [isLargeFile, setIsLargeFile] = useState<boolean>(false)

  // Spatial configuration state
  const [options, setOptions] = useState<SpatialOptions>({
    mode: '8d',
    preset: '360-rotation',
    speedSec: 8.0,
    radius: 3.0,
    direction: 1, // Clockwise
    elevation: 0.0,
    depthRatio: 1.0,
    widthRatio: 1.0,
    reverbPreset: 'studio',
    reverbWet: 0.14,
    bassPreservation: 0.75,
    outputGain: 1.0,
  })

  // 3D Spatial Audio master toggle (ON / OFF)
  const [isSpatialEnabled, setIsSpatialEnabled] = useState<boolean>(true)

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [volume, setVolume] = useState<number>(1.0)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isLooping, setIsLooping] = useState<boolean>(false)

  // Radar telemetry
  const [currentCoord, setCurrentCoord] = useState<SpatialCoordinate>({
    x: 0,
    y: 0,
    z: -3.0,
    azimuthDeg: 0,
    distance: 3.0,
  })

  // Export state
  const [exportFormat, setExportFormat] = useState<'wav' | 'mp3'>('mp3')
  const [mp3Bitrate, setMp3Bitrate] = useState<128 | 192 | 256 | 320>(256)
  const [customFilename, setCustomFilename] = useState<string>('')
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const [exportProgress, setExportProgress] = useState<number>(0)
  const [exportStage, setExportStage] = useState<string>('')

  // Refs for Web Audio graph & robust playback lifecycle
  const audioCtxRef = useRef<AudioContext | null>(null)
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set())
  const pannerNodeRef = useRef<PannerNode | null>(null)
  const dryGainRef = useRef<GainNode | null>(null)
  const reverbGainRef = useRef<GainNode | null>(null)
  const bassFilterRef = useRef<BiquadFilterNode | null>(null)
  const bassGainRef = useRef<GainNode | null>(null)
  const highPassFilterRef = useRef<BiquadFilterNode | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const bypassGainRef = useRef<GainNode | null>(null)

  const playbackStartTimeRef = useRef<number>(0)
  const playbackOffsetRef = useRef<number>(0)
  const animFrameRef = useRef<number | null>(null)
  const trailsRef = useRef<RadarPoint[]>([])
  const isCancelledRef = useRef<boolean>(false)
  const isStartingPlaybackRef = useRef<boolean>(false)

  const radarCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Get or lazily create AudioContext with autoplay unlock
  const getAudioContext = useCallback((): AudioContext => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      audioCtxRef.current = new AudioCtxClass()
    }
    return audioCtxRef.current
  }, [])

  // =========================================================================
  // CRITICAL FIX: STOP ALL ACTIVE AUDIO INSTANCES & SUSPEND HARDWARE PIPELINE
  // =========================================================================
  const stopAllAudio = useCallback((resetPosition = false) => {
    // 1. Cancel active animation frame loop
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }

    // 2. Stop and disconnect every registered AudioBufferSourceNode immediately
    activeSourcesRef.current.forEach((src) => {
      try {
        src.onended = null // Remove listener to avoid race conditions
        src.stop(0)
        src.disconnect()
      } catch {
        // Source might already have stopped
      }
    })
    activeSourcesRef.current.clear()

    // 3. Immediately silence master output gain to avoid any reverb tail or residual capacitor bleed
    if (masterGainRef.current && audioCtxRef.current) {
      try {
        masterGainRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime)
        masterGainRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime)
      } catch {
        // ignore
      }
    }

    // 4. Suspend AudioContext to guarantee zero hardware audio thread activity
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend().catch(() => {})
    }

    // 5. Update state
    setIsPlaying(false)
    isStartingPlaybackRef.current = false

    if (resetPosition) {
      playbackOffsetRef.current = 0
      setCurrentTime(0)
      trailsRef.current = []
    }
  }, [])

  // Component unmount & page navigation cleanup
  useEffect(() => {
    return () => {
      stopAllAudio(true)
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close().catch(() => {})
        } catch {
          // ignore
        }
      }
    }
  }, [stopAllAudio])

  // Waveform render on progress change
  useEffect(() => {
    const canvas = waveformCanvasRef.current
    if (!canvas) return
    const progress = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0
    renderWaveformOnCanvas(canvas, waveformData, progress, isSpatialEnabled)
  }, [waveformData, currentTime, duration, isSpatialEnabled])

  // Canvas resize listener
  useEffect(() => {
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1

      // Radar Canvas
      const radar = radarCanvasRef.current
      if (radar) {
        const rect = radar.getBoundingClientRect()
        radar.width = Math.floor(rect.width * dpr)
        radar.height = Math.floor(rect.height * dpr)
        renderSpatialRadar(radar, currentCoord, options, trailsRef.current)
      }

      // Waveform Canvas
      const wave = waveformCanvasRef.current
      if (wave) {
        const rect = wave.getBoundingClientRect()
        wave.width = Math.floor(rect.width * dpr)
        wave.height = Math.floor(rect.height * dpr)
        const progress = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0
        renderWaveformOnCanvas(wave, waveformData, progress, isSpatialEnabled)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentCoord, options, waveformData, currentTime, duration, isSpatialEnabled])

  // Handle Audio File Loading
  const loadAudioFile = async (file: File) => {
    setFileError(null)
    setIsLoading(true)
    setLoadingStep('Reading audio bitstream...')
    stopPlayback()

    if (file.size > 60 * 1024 * 1024) {
      setIsLargeFile(true)
    } else {
      setIsLargeFile(false)
    }

    try {
      const { buffer } = await decodeAudioFile(file)
      setSourceFile(file)
      setSourceBuffer(buffer)
      setDuration(buffer.duration)
      setCurrentTime(0)
      playbackOffsetRef.current = 0

      const detectedMono = buffer.numberOfChannels === 1
      setIsMono(detectedMono)

      const baseName = file.name.replace(/\.[^/.]+$/, '')
      setCustomFilename(`${baseName}_3d_spatial`)

      setLoadingStep('Extracting audio peaks for timeline...')
      const wf = extractWaveformData(buffer, 600)
      setWaveformData(wf)

      // Initialize radar display
      const initialCoord = getSpatialCoordinates(0, options)
      setCurrentCoord(initialCoord)
      trailsRef.current = []

      showToast(`Loaded "${file.name}" successfully!`, 'success')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not decode audio file.'
      setFileError(msg)
      showToast(msg, 'error')
    } finally {
      setIsLoading(false)
      setLoadingStep('')
    }
  }

  // Load Built-in Spatial Specimen
  const handleLoadDemo = async () => {
    setFileError(null)
    setIsLoading(true)
    setLoadingStep('Synthesizing 3D spatial arpeggio track...')
    try {
      const specimen = await generateSpatialDemoSpecimen()
      await loadAudioFile(specimen)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Demo generation failed.'
      setFileError(msg)
      showToast(msg, 'error')
      setIsLoading(false)
    }
  }

  // Build / Rebuild Live Web Audio Processing Graph
  const startPlaybackAt = async (offset: number) => {
    if (!sourceBuffer || isStartingPlaybackRef.current) return
    isStartingPlaybackRef.current = true

    // Stop any existing sources first to guarantee NO duplicate instances
    stopAllAudio(false)

    try {
      const ctx = getAudioContext()
      if (ctx.state === 'suspended') {
        await ctx.resume()
      }

      // 1. Master Output Gain Node
      if (!masterGainRef.current) {
        const master = ctx.createGain()
        master.connect(ctx.destination)
        masterGainRef.current = master
      }

      // Set master volume
      const targetGain = isMuted ? 0 : volume * options.outputGain
      masterGainRef.current.gain.cancelScheduledValues(ctx.currentTime)
      masterGainRef.current.gain.setValueAtTime(targetGain, ctx.currentTime)

      // 2. High-Pass / Low-Pass Crossover for Bass Preservation
      const crossoverFreq = 130
      const lp = ctx.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = crossoverFreq
      lp.Q.value = 0.7071
      bassFilterRef.current = lp

      const bassGain = ctx.createGain()
      bassGain.gain.value = isSpatialEnabled ? options.bassPreservation : 0
      bassGainRef.current = bassGain

      lp.connect(bassGain)
      bassGain.connect(masterGainRef.current)

      const hp = ctx.createBiquadFilter()
      hp.type = 'highpass'
      hp.frequency.value = crossoverFreq
      hp.Q.value = 0.7071
      highPassFilterRef.current = hp

      // 3. Panner Node (HRTF Panning)
      const panner = ctx.createPanner()
      panner.panningModel = 'HRTF'
      panner.distanceModel = 'inverse'
      panner.refDistance = 1.0
      panner.maxDistance = 10000
      panner.rolloffFactor = 0.8
      panner.coneInnerAngle = 360
      pannerNodeRef.current = panner

      // Set initial listener position
      try {
        if (ctx.listener.forwardX) {
          ctx.listener.forwardX.value = 0
          ctx.listener.forwardY.value = 0
          ctx.listener.forwardZ.value = -1
          ctx.listener.upX.value = 0
          ctx.listener.upY.value = 1
          ctx.listener.upZ.value = 0
        } else {
          ;(ctx.listener as unknown as { setOrientation: (x: number, y: number, z: number, ux: number, uy: number, uz: number) => void }).setOrientation(0, 0, -1, 0, 1, 0)
        }
      } catch {
        // ignore
      }

      hp.connect(panner)

      // Dry spatial gain
      const dry = ctx.createGain()
      const wetMix = options.reverbPreset === 'off' ? 0 : options.reverbWet
      dry.gain.value = isSpatialEnabled ? Math.max(0.6, 1.0 - wetMix * 0.8) : 0
      dryGainRef.current = dry
      panner.connect(dry)
      dry.connect(masterGainRef.current)

      // Wet reverb branch
      const reverbGain = ctx.createGain()
      reverbGain.gain.value = isSpatialEnabled && options.reverbPreset !== 'off' ? wetMix : 0
      reverbGainRef.current = reverbGain

      if (options.reverbPreset !== 'off') {
        const convolver = ctx.createConvolver()
        convolver.buffer = createSyntheticImpulseResponse(ctx, options.reverbPreset)
        panner.connect(convolver)
        convolver.connect(reverbGain)
        reverbGain.connect(masterGainRef.current)
      }

      // Bypass branch for stereo playback when 3D Spatial is disabled
      const bypass = ctx.createGain()
      bypass.gain.value = isSpatialEnabled ? 0 : 1.0
      bypassGainRef.current = bypass
      bypass.connect(masterGainRef.current)

      // 4. Source Node
      const source = ctx.createBufferSource()
      source.buffer = sourceBuffer
      source.loop = isLooping

      // Connect source to crossover and bypass
      source.connect(lp)
      source.connect(hp)
      source.connect(bypass)

      const boundedOffset = Math.max(0, Math.min(sourceBuffer.duration, offset))
      playbackStartTimeRef.current = ctx.currentTime
      playbackOffsetRef.current = boundedOffset

      // Register source in active registry
      activeSourcesRef.current.add(source)

      source.onended = () => {
        activeSourcesRef.current.delete(source)
        if (!isLooping && isPlaying) {
          stopAllAudio(true)
        }
      }

      source.start(0, boundedOffset)
      setIsPlaying(true)
      isStartingPlaybackRef.current = false

      // Launch 60fps telemetry and radar update loop
      startTelemetryLoop()
    } catch (err: unknown) {
      console.error('Playback initialization error', err)
      stopAllAudio(false)
      isStartingPlaybackRef.current = false
    }
  }

  // 60 FPS Telemetry & Visualizer Animation Loop
  const startTelemetryLoop = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)

    let lastTrailTime = 0

    const updateFrame = () => {
      if (!audioCtxRef.current || !isPlaying || !sourceBuffer) return

      const ctx = audioCtxRef.current
      const elapsed = ctx.currentTime - playbackStartTimeRef.current
      const cur = playbackOffsetRef.current + elapsed

      if (cur >= duration && !isLooping) {
        stopAllAudio(true)
        return
      }

      const activeTime = isLooping ? cur % duration : Math.min(duration, cur)
      setCurrentTime(activeTime)

      // Calculate spatial coordinates for current playback time
      const coord = getSpatialCoordinates(activeTime, options)
      setCurrentCoord(coord)

      // Update PannerNode position dynamically in real time
      if (pannerNodeRef.current && isSpatialEnabled) {
        try {
          if (pannerNodeRef.current.positionX) {
            pannerNodeRef.current.positionX.setValueAtTime(coord.x, ctx.currentTime)
            pannerNodeRef.current.positionY.setValueAtTime(coord.y, ctx.currentTime)
            pannerNodeRef.current.positionZ.setValueAtTime(coord.z, ctx.currentTime)
          } else {
            ;(pannerNodeRef.current as unknown as { setPosition: (x: number, y: number, z: number) => void }).setPosition(coord.x, coord.y, coord.z)
          }
        } catch {
          // ignore
        }
      }

      // Record motion trails every 60ms
      const now = performance.now()
      if (now - lastTrailTime > 60) {
        lastTrailTime = now
        // Decay existing trails
        trailsRef.current = trailsRef.current
          .map((pt) => ({ ...pt, alpha: pt.alpha - 0.045 }))
          .filter((pt) => pt.alpha > 0.05)

        trailsRef.current.push({
          x: coord.x,
          z: coord.z,
          y: coord.y,
          alpha: 1.0,
        })
      }

      // Draw radar
      if (radarCanvasRef.current) {
        renderSpatialRadar(radarCanvasRef.current, coord, options, trailsRef.current)
      }

      animFrameRef.current = requestAnimationFrame(updateFrame)
    }

    animFrameRef.current = requestAnimationFrame(updateFrame)
  }

  // Pause playback: saves current playback offset, kills all nodes & suspends AudioContext
  const pausePlayback = useCallback(() => {
    if (audioCtxRef.current && isPlaying) {
      const elapsed = audioCtxRef.current.currentTime - playbackStartTimeRef.current
      const currentPos = playbackOffsetRef.current + elapsed
      const boundedOffset = Math.max(0, Math.min(duration, currentPos))
      playbackOffsetRef.current = boundedOffset
      setCurrentTime(boundedOffset)
    }
    stopAllAudio(false)
  }, [duration, isPlaying, stopAllAudio])

  // Pause playback automatically when tab/window is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isPlaying) {
        pausePlayback()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isPlaying, pausePlayback])

  // Stop playback: kills all nodes, suspends AudioContext, resets playhead to 0
  const stopPlayback = useCallback(() => {
    stopAllAudio(true)
    const initCoord = getSpatialCoordinates(0, options)
    setCurrentCoord(initCoord)
    if (radarCanvasRef.current) {
      renderSpatialRadar(radarCanvasRef.current, initCoord, options, [])
    }
  }, [options, stopAllAudio])

  // Play / Pause toggle
  const handleTogglePlay = () => {
    if (!sourceBuffer) {
      showToast('Select an audio file or click "Try Demo Track" first.', 'info')
      return
    }

    if (isPlaying) {
      pausePlayback()
    } else {
      startPlaybackAt(currentTime >= duration ? 0 : currentTime)
    }
  }

  // 3D Spatial Audio Master Enable / Disable Toggle
  const handleToggleSpatial = (enabled: boolean) => {
    setIsSpatialEnabled(enabled)

    if (dryGainRef.current && reverbGainRef.current && bassGainRef.current && bypassGainRef.current) {
      const wetMix = options.reverbPreset === 'off' ? 0 : options.reverbWet

      if (enabled) {
        dryGainRef.current.gain.value = Math.max(0.6, 1.0 - wetMix * 0.8)
        reverbGainRef.current.gain.value = options.reverbPreset !== 'off' ? wetMix : 0
        bassGainRef.current.gain.value = options.bassPreservation
        bypassGainRef.current.gain.value = 0
      } else {
        dryGainRef.current.gain.value = 0
        reverbGainRef.current.gain.value = 0
        bassGainRef.current.gain.value = 0
        bypassGainRef.current.gain.value = 1.0
      }
    }
  }

  // Waveform click to seek
  const handleWaveformClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!waveformCanvasRef.current || duration <= 0) return

    const rect = waveformCanvasRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percent = Math.max(0, Math.min(1, clickX / rect.width))
    const seekTime = percent * duration

    setCurrentTime(seekTime)
    playbackOffsetRef.current = seekTime

    if (isPlaying) {
      startPlaybackAt(seekTime)
    }
  }

  // Apply Movement Preset
  const handleApplyPreset = (presetKey: SpatialPreset) => {
    const config = PRESET_CONFIGS[presetKey]
    const next: SpatialOptions = {
      ...options,
      preset: presetKey,
      mode: presetKey === 'figure-eight' || presetKey === 'pendulum' ? 'custom' : 'preset',
      ...config,
    }
    setOptions(next)

    // If stationary preset chosen, set spatial mode appropriately
    if (presetKey === 'stationary') {
      setIsSpatialEnabled(false)
    } else {
      setIsSpatialEnabled(true)
    }

    // Update active gains immediately if currently playing
    if (reverbGainRef.current && dryGainRef.current && bassGainRef.current && isSpatialEnabled) {
      const wetMix = next.reverbPreset === 'off' ? 0 : next.reverbWet
      dryGainRef.current.gain.value = Math.max(0.6, 1.0 - wetMix * 0.8)
      reverbGainRef.current.gain.value = next.reverbPreset !== 'off' ? wetMix : 0
      bassGainRef.current.gain.value = next.bassPreservation
    }

    showToast(`Loaded "${presetKey.replace('-', ' ').toUpperCase()}" preset!`, 'info')
  }

  // Volume Change
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol)
    setIsMuted(false)
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime)
      masterGainRef.current.gain.setValueAtTime(newVol * options.outputGain, audioCtxRef.current.currentTime)
    }
  }

  // Mute Toggle (Immediate complete silence)
  const handleToggleMute = () => {
    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime)
      masterGainRef.current.gain.setValueAtTime(
        nextMuted ? 0 : volume * options.outputGain,
        audioCtxRef.current.currentTime
      )
    }
  }

  // Export processed spatial audio to WAV or MP3
  const handleExport = async () => {
    if (!sourceBuffer) {
      showToast('Please load an audio file first.', 'error')
      return
    }

    setIsExporting(true)
    setExportProgress(0)
    setExportStage('Rendering 3D spatial trajectory via Offline Audio Context...')
    isCancelledRef.current = false

    try {
      const renderedBuffer = await renderOfflineSpatialAudio(
        sourceBuffer,
        options,
        (pct) => setExportProgress(pct),
        () => isCancelledRef.current
      )

      setExportStage(`Encoding audio into ${exportFormat.toUpperCase()} format...`)

      let resultBlob: Blob
      if (exportFormat === 'wav') {
        resultBlob = await encodeAudioBufferToWav(renderedBuffer, {
          onProgress: (pct) => setExportProgress(60 + Math.round(pct * 0.38)),
          isCancelled: () => isCancelledRef.current,
        })
      } else {
        resultBlob = await encodeAudioBufferToMp3(renderedBuffer, {
          kbps: mp3Bitrate,
          onProgress: (pct) => setExportProgress(60 + Math.round(pct * 0.38)),
          isCancelled: () => isCancelledRef.current,
        })
      }

      const downloadUrl = URL.createObjectURL(resultBlob)
      const downloadLink = document.createElement('a')
      const targetName = `${customFilename || 'orbit_spatial_track'}.${exportFormat}`
      downloadLink.href = downloadUrl
      downloadLink.download = targetName
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)

      setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000)

      setExportProgress(100)
      showToast(`Exported "${targetName}" successfully!`, 'success')
    } catch (err: unknown) {
      if (isCancelledRef.current) {
        showToast('Export cancelled.', 'info')
      } else {
        const msg = err instanceof Error ? err.message : 'Export failed.'
        showToast(msg, 'error')
      }
    } finally {
      setIsExporting(false)
      setExportProgress(0)
      setExportStage('')
    }
  }

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <ToolPageLayout tool={tool} maxWidthClass="max-w-6xl">
      <div className="space-y-8">
        {/* ========================================================================= */}
        {/* MAIN FUTURISTIC STUDIO WORKSPACE                                          */}
        {/* ========================================================================= */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-4 sm:p-6 lg:p-8 text-white relative overflow-hidden">
          {/* Ambient Studio Lighting */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black tracking-tight text-white">Orbit Audio Studio</h2>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    3D Headphone Spatial
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Binaural 360° sound movement around the listener • 100% Client-Side HRTF Engine
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadDemo}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800/60 transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Try Demo Track</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition cursor-pointer"
              >
                <Upload className="w-4 h-4 text-purple-400" />
                <span>Open Audio File</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.webm,.flac"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    loadAudioFile(e.target.files[0])
                  }
                }}
              />
            </div>
          </div>

          {/* Headphone Recommendation & 3D Spatial Master Toggle Bar */}
          <div className="mb-6 p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/50 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-900/50 flex items-center justify-center text-cyan-300">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-cyan-200">
                  Headphone-Based 3D Spatial Audio Experience
                </p>
                <p className="text-[11px] text-cyan-300/80">
                  Binaural HRTF simulates acoustic waves traveling around your head. Wear stereo headphones for the 360° illusion.
                </p>
              </div>
            </div>

            {/* Master 3D Spatial Toggle Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleSpatial(!isSpatialEnabled)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  isSpatialEnabled
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white border-cyan-400 shadow-md shadow-cyan-500/25'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>3D Spatial Mode: {isSpatialEnabled ? 'ENABLED' : 'BYPASSED'}</span>
              </button>
            </div>
          </div>

          {/* Error & Warnings */}
          {fileError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Audio File Error</p>
                <p className="mt-0.5 text-rose-300/90">{fileError}</p>
              </div>
              <button
                type="button"
                onClick={() => setFileError(null)}
                className="text-rose-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {isMono && (
            <div className="mb-6 p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Mono Recording Detected:</strong> Audio will orbit in 360° space smoothly, though stereo multi-track
                recordings provide deeper spatial dimension.
              </div>
            </div>
          )}

          {isLargeFile && (
            <div className="mb-6 p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/60 text-purple-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong>Large Audio File (&gt;60MB):</strong> High browser memory usage. Processing runs in chunked slices.
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DRAG AND DROP ZONE (EMPTY STATE)                                          */}
          {/* ========================================================================= */}
          {!sourceBuffer && !isLoading && (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDraggingOver(true)
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                setIsDraggingOver(false)
              }}
              onDrop={(e) => {
                e.preventDefault()
                setIsDraggingOver(false)
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  loadAudioFile(e.dataTransfer.files[0])
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`p-10 sm:p-14 rounded-2xl border-2 border-dashed transition text-center cursor-pointer flex flex-col items-center justify-center gap-4 ${
                isDraggingOver
                  ? 'border-cyan-400 bg-cyan-950/30 text-cyan-200'
                  : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="w-16 h-16 rounded-3xl bg-slate-800/80 border border-slate-700 flex items-center justify-center shadow-inner group">
                <FileAudio className="w-8 h-8 text-cyan-400 transition transform group-hover:scale-110" />
              </div>
              <div className="space-y-1">
                <p className="text-base sm:text-lg font-bold text-white">
                  Drop your music track here or <span className="text-cyan-400 underline underline-offset-4">browse files</span>
                </p>
                <p className="text-xs text-slate-500">
                  Supports MP3, WAV, M4A, AAC, OGG, FLAC and WebM • 100% private in-browser processing
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleLoadDemo()
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <span>Or test instantly with a 3D Demo Arpeggio</span>
                </button>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="p-12 text-center rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">{loadingStep || 'Decoding audio...'}</p>
                <p className="text-xs text-slate-500">Executing DSP algorithms locally in browser memory</p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ACTIVE STUDIO WORKSTATION (WHEN AUDIO IS LOADED)                          */}
          {/* ========================================================================= */}
          {sourceBuffer && !isLoading && (
            <div className="space-y-6">
              {/* File Info Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                    <Disc className="w-5 h-5 text-cyan-400 animate-spin-slow" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white truncate max-w-[240px] sm:max-w-md">
                      {sourceFile?.name || 'Orbit_Spatial_Specimen.wav'}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                      <span>{formatTime(duration)}</span>
                      <span>•</span>
                      <span>{sourceBuffer.sampleRate.toLocaleString()} Hz</span>
                      <span>•</span>
                      <span>{sourceBuffer.numberOfChannels === 1 ? 'Mono' : 'Stereo'}</span>
                    </p>
                  </div>
                </div>

                {/* Instant A/B Toggle: 3D Spatial Sound vs Original Stereo Bypass */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleToggleSpatial(true)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      isSpatialEnabled
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5 text-cyan-300" />
                    <span>3D Spatial Sound</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleSpatial(false)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      !isSpatialEnabled
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Stationary Stereo Bypass</span>
                  </button>
                </div>
              </div>

              {/* Central Grid: Live 3D Radar (Left) + Spatial Orbit Controls (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* 1. Live Spatial Radar Canvas (5 Cols on LG) */}
                <div className="lg:col-span-5 rounded-2xl bg-slate-950 border border-slate-800 p-4 flex flex-col justify-between relative shadow-inner">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-cyan-400" />
                      <span>Live Acoustic Radar</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                      {isSpatialEnabled ? 'HRTF Synchronized' : 'Bypassed (Center)'}
                    </span>
                  </div>

                  {/* Canvas Container */}
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-slate-900 bg-[#030712]">
                    <canvas
                      ref={radarCanvasRef}
                      className="w-full h-full block cursor-crosshair"
                      title="Spatial audio coordinates (X, Y, Z)"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2 px-1">
                    <span>
                      Speed:{' '}
                      <strong className="text-cyan-400">{options.speedSec.toFixed(1)}s / orbit</strong>
                    </span>
                    <span>
                      Preset:{' '}
                      <strong className="text-purple-400 uppercase">{options.preset.replace('-', ' ')}</strong>
                    </span>
                  </div>
                </div>

                {/* 2. Sound Movement Presets & Orbit Customization (7 Cols on LG) */}
                <div className="lg:col-span-7 rounded-2xl bg-slate-950/70 border border-slate-800 p-5 space-y-5">
                  {/* Presets Grid (Featuring all requested sound movement presets) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                        <span>Sound Movement Presets</span>
                      </label>
                      <span className="text-[11px] text-slate-500">Instant 3D spatial trajectories</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(
                        [
                          { key: '360-rotation', label: '360° Head Rotation', desc: 'Smooth horizontal orbit' },
                          { key: 'flyby', label: 'Left-to-Right Flyby', desc: 'Front soundstage sweep' },
                          { key: 'front-back', label: 'Front-to-Back Orbit', desc: 'Deep front-to-back arc' },
                          { key: 'slow-cinematic', label: 'Slow Cinematic', desc: '16s expansive orbit' },
                          { key: 'fast-spin', label: 'Fast Circular Spin', desc: 'Energetic 4s rotation' },
                          { key: 'stationary', label: 'Stationary Stereo', desc: 'Fixed centered position' },
                        ] as const
                      ).map(({ key, label, desc }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleApplyPreset(key)}
                          className={`p-2.5 rounded-xl text-left transition border cursor-pointer ${
                            options.preset === key
                              ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-md shadow-cyan-950'
                              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          <p className="text-xs font-bold text-white truncate">{label}</p>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sliders Grid: Speed, Distance Radius, Elevation, Direction */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Orbit Speed */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-300 font-medium">Orbit Rotation Speed</span>
                        <span className="font-mono text-cyan-400 font-bold">{options.speedSec.toFixed(1)}s</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="24"
                        step="0.5"
                        value={options.speedSec}
                        onChange={(e) => setOptions({ ...options, speedSec: parseFloat(e.target.value) })}
                        className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>2s (Fast)</span>
                        <span>8s (Balanced)</span>
                        <span>24s (Slow)</span>
                      </div>
                    </div>

                    {/* Orbit Distance / Radius */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-300 font-medium">Orbit Distance / Radius</span>
                        <span className="font-mono text-cyan-400 font-bold">{options.radius.toFixed(1)}m</span>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="5.0"
                        step="0.2"
                        value={options.radius}
                        onChange={(e) => setOptions({ ...options, radius: parseFloat(e.target.value) })}
                        className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>1.0m (Close)</span>
                        <span>3.0m (Studio)</span>
                        <span>5.0m (Distant)</span>
                      </div>
                    </div>

                    {/* Elevation Modulation (Y) */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-300 font-medium">Elevation Modulation (Y)</span>
                        <span className="font-mono text-purple-400 font-bold">
                          {options.elevation > 0 ? `+${options.elevation.toFixed(1)}m` : `${options.elevation.toFixed(1)}m`}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2.0"
                        step="0.1"
                        value={options.elevation}
                        onChange={(e) => setOptions({ ...options, elevation: parseFloat(e.target.value) })}
                        className="w-full accent-purple-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>0m (Flat)</span>
                        <span>1.0m (3D Wave)</span>
                        <span>2.0m (Max 3D)</span>
                      </div>
                    </div>

                    {/* Direction Switch */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-300 font-medium">Orbit Direction</span>
                        <span className="font-mono text-cyan-400 font-bold">
                          {options.direction === 1 ? 'Clockwise ↻' : 'Counter-Clockwise ↺'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setOptions({ ...options, direction: 1 })}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold border cursor-pointer flex items-center justify-center gap-1.5 ${
                            options.direction === 1
                              ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>Clockwise</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setOptions({ ...options, direction: -1 })}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold border cursor-pointer flex items-center justify-center gap-1.5 ${
                            options.direction === -1
                              ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Counter</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lower Controls: Reverb & Ambience + Bass Preservation Crossover */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Room Ambience & Reverb */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Radio className="w-4 h-4 text-purple-400" />
                      <span>Acoustic Room Ambience</span>
                    </label>
                    <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                      {Math.round(options.reverbWet * 100)}% Wet
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {(['off', 'studio', 'hall', 'cosmic'] as const).map((rPreset) => (
                      <button
                        key={rPreset}
                        type="button"
                        onClick={() => setOptions({ ...options, reverbPreset: rPreset })}
                        className={`py-1.5 rounded-lg text-xs font-bold uppercase transition border cursor-pointer ${
                          options.reverbPreset === rPreset
                            ? 'bg-purple-600 text-white border-purple-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {rPreset}
                      </button>
                    ))}
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="0.4"
                    step="0.02"
                    value={options.reverbWet}
                    onChange={(e) => setOptions({ ...options, reverbWet: parseFloat(e.target.value) })}
                    className="w-full accent-purple-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Algorithmic impulse response simulates spatial wall reflections and acoustic room depth.
                  </p>
                </div>

                {/* 2. Bass & Kick Preservation Crossover */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Disc className="w-4 h-4 text-emerald-400" />
                      <span>Sub-Bass &amp; Kick Preservation</span>
                    </label>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      {Math.round(options.bassPreservation * 100)}% Centered
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={options.bassPreservation}
                    onChange={(e) => setOptions({ ...options, bassPreservation: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />

                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Off (0% Full Orbit)</span>
                    <button
                      type="button"
                      onClick={() => setOptions({ ...options, bassPreservation: 0.75 })}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] cursor-pointer"
                    >
                      Studio Crossover (75%)
                    </button>
                    <span>Max Centered (100%)</span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Crossover filter keeps frequencies below 130 Hz centered in stereo space, preventing disorientation
                    and preserving kick drum punch.
                  </p>
                </div>
              </div>

              {/* Waveform Timeline */}
              <div className="relative group">
                <div className="relative h-24 sm:h-28 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner cursor-pointer">
                  <canvas
                    ref={waveformCanvasRef}
                    onClick={handleWaveformClick}
                    className="w-full h-full block"
                    title="Click anywhere to seek playhead"
                  />
                  <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-slate-950/70 to-transparent pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-slate-950/70 to-transparent pointer-events-none" />

                  {/* Mode Badge inside Waveform */}
                  <div className="absolute top-2 right-3 pointer-events-none">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border ${
                        isSpatialEnabled
                          ? 'bg-cyan-950/80 text-cyan-400 border-cyan-800'
                          : 'bg-purple-950/80 text-purple-400 border-purple-800'
                      }`}
                    >
                      {isSpatialEnabled ? '3D Headphone Spatial Active' : 'Stereo Bypass Active'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 px-1 mt-1.5">
                  <span className="text-cyan-400 font-bold">{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Transport Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white flex items-center justify-center font-bold shadow-lg shadow-cyan-500/25 transition transform active:scale-95 cursor-pointer"
                    title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={stopPlayback}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                    title="Stop and return to beginning"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsLooping(!isLooping)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer ${
                      isLooping
                        ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400'
                    }`}
                    title="Toggle Loop Playback"
                  >
                    <Repeat className="w-4 h-4" />
                  </button>
                </div>

                {/* Master Volume & Mute */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    className="text-slate-400 hover:text-white transition cursor-pointer"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-24 sm:w-32 accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                  <span className="text-xs font-mono text-slate-400 w-9">
                    {Math.round((isMuted ? 0 : volume) * 100)}%
                  </span>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* EXPORT SECTION                                                            */}
              {/* ========================================================================= */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-2">
                    <FileDown className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-base font-bold text-white">Export Spatial Audio Track</h3>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Deterministic offline HRTF rendering • High quality WAV &amp; MP3
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                  {/* Format */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Target Format</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setExportFormat('mp3')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                          exportFormat === 'mp3'
                            ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        MP3 (Compressed)
                      </button>
                      <button
                        type="button"
                        onClick={() => setExportFormat('wav')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                          exportFormat === 'wav'
                            ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        WAV (16-bit PCM)
                      </button>
                    </div>
                  </div>

                  {/* Bitrate or Quality Spec */}
                  {exportFormat === 'mp3' ? (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">MP3 Bitrate</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {([128, 192, 256, 320] as const).map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setMp3Bitrate(b)}
                            className={`py-2 rounded-xl text-xs font-bold font-mono transition border cursor-pointer ${
                              mp3Bitrate === b
                                ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                          >
                            {b}k
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Quality Spec</label>
                      <div className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
                        16-bit Linear PCM (Studio Lossless)
                      </div>
                    </div>
                  )}

                  {/* Target Filename */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Target Filename</label>
                    <input
                      type="text"
                      value={customFilename}
                      onChange={(e) => setCustomFilename(e.target.value)}
                      placeholder="orbit_spatial_track"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Progress bar */}
                {isExporting && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-cyan-800/80 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-cyan-300">{exportStage}</span>
                      <span className="font-mono text-cyan-400 font-bold">{exportProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 transition-all duration-150"
                        style={{ width: `${exportProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Processed 100% locally in browser memory. Zero audio uploads.</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isExporting && (
                      <button
                        type="button"
                        onClick={() => {
                          isCancelledRef.current = true
                          setIsExporting(false)
                        }}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleExport}
                      disabled={isExporting}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 shadow-lg shadow-cyan-500/25 transition transform active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isExporting ? 'Rendering...' : `Export & Download ${exportFormat.toUpperCase()}`}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* EDUCATIONAL & TECHNICAL SPATIAL AUDIO GUIDE SECTION                       */}
        {/* ========================================================================= */}
        <div className="space-y-6 text-slate-800 dark:text-slate-200">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-500" />
              <span>How 3D Headphone Spatial Audio Works</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              &quot;8D&quot; and &quot;16D&quot; audio are creative names for <strong>Binaural Spatial Audio</strong>.
              They do not add literal extra physical dimensions to the sound. Instead, they leverage the physics of
              how the human brain localizes sound in 3D space:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                  1. ITD &amp; ILD Panning
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Interaural Time &amp; Level</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  When a sound source is on your right, the acoustic wave reaches your right ear fractions of a millisecond
                  earlier (ITD) and slightly louder (ILD) than your left ear because your head casts an acoustic shadow.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  2. HRTF Filtering
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Head-Related Transfer Function</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  The folds of the human ear (pinna) filter specific high frequencies depending on whether a sound is
                  above, below, in front, or behind you. Web Audio&apos;s HRTF panner models this filtering accurately.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  3. Room Reflections
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Convolution Reverb</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Without acoustic room reflections, sounds feel inside your skull. Adding diffuse spatial reverberation
                  pushes the sound outside your head, creating the illusion of a spacious 3D listening room.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-2">
              <p className="font-bold text-slate-900 dark:text-white">
                Why Sub-Bass Preservation is Essential in 3D Tracks:
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                In music production, low frequencies below 130 Hz (kick drum and sub-bass) carry physical weight and energy.
                If heavy sub-bass is panned hard to one ear during a 3D orbit, it creates an uncomfortable ear-pressure
                sensation and fatigue. Orbit Audio Studio includes a built-in crossover filter that keeps sub-bass frequencies
                centered while freely orbiting the melodic and vocal frequencies around your head!
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
