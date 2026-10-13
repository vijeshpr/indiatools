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
  Tv,
  Smartphone,
  Square as SquareIcon,
  Disc,
  BarChart3,
  Activity,
  Radio,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Repeat,
  RotateCcw,
  Film,
  Zap,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Eye,
} from 'lucide-react'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useToast } from '../components/common/Toast'
import {
  AspectRatio,
  VisualizerPreset,
  ColorTheme,
  BackgroundMode,
  VisualizerConfig,
  TrackMetadata,
  ASPECT_RATIOS,
  THEME_PALETTES,
} from '../lib/video/audioVisualizerTypes'
import {
  calculateAudioBands,
  VisualizerParticleSystem,
  PeakHoldManager,
  drawBackground,
  drawCircularPulse,
  drawLinearBars,
  drawSmoothWaveform,
  drawCyberpunkOscilloscope,
  drawMetadataOverlay,
} from '../lib/video/audioVisualizerEngine'
import {
  VideoRecorderSession,
  downloadBlob,
  formatTimeDisplay,
  getSupportedVideoMimeType,
} from '../lib/video/videoExportEngine'
import { decodeAudioFile } from '../lib/audio/audioProcessor'
import { generateVisualizerDemoSpecimen } from '../lib/video/demoAudioGenerator'

export const AudioSpectrumVideoTool: React.FC = () => {
  const tool = getToolBySlug('audio-spectrum-waveform-video-generator')!
  const { showToast } = useToast()

  // Audio state
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [volume, setVolume] = useState<number>(1.0)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isLooping, setIsLooping] = useState<boolean>(false)
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false)
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false)

  // Cover image & metadata
  const [coverImage, setCoverImage] = useState<HTMLImageElement | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<TrackMetadata>({
    title: 'Neon Horizon',
    artist: 'IndiaTools Visual Studio',
    handle: '@indiatools_official',
    showMetadata: true,
  })

  // Visualizer configuration
  const [config, setConfig] = useState<VisualizerConfig>({
    preset: 'circular-pulse',
    aspectRatio: '16:9',
    theme: 'neon-cyber',
    bgMode: 'blurred-cover',
    barCount: 64,
    fftSize: 2048,
    smoothing: 0.85,
    sensitivity: 1.25,
    bassReactivity: 1.2,
    showParticles: true,
    glowStrength: 1.2,
    waveformThickness: 4,
    spinSpeed: 0.8,
  })
  const [showAdvancedTuning, setShowAdvancedTuning] = useState<boolean>(false)

  // Video recording / Export state
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [recordingElapsed, setRecordingElapsed] = useState<number>(0)
  const [targetExportLength, setTargetExportLength] = useState<'15s' | '30s' | '60s' | 'full'>('full')
  const [exportFps, setExportFps] = useState<30 | 60>(60)

  // DOM and Web Audio references
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const destinationNodeRef = useRef<MediaStreamAudioDestinationNode | null>(null)
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null)
  const playbackStartTimeRef = useRef<number>(0)
  const playbackStartOffsetRef = useRef<number>(0)
  const animationFrameRef = useRef<number | null>(null)
  const rotationAngleRef = useRef<number>(0)
  const particleSystemRef = useRef<VisualizerParticleSystem>(new VisualizerParticleSystem(75))
  const peakHoldManagerRef = useRef<PeakHoldManager>(new PeakHoldManager())
  const recorderSessionRef = useRef<VideoRecorderSession | null>(null)
  const recordIntervalRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const coverInputRef = useRef<HTMLInputElement | null>(null)

  // Initialize or get master AudioContext
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioCtx()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = config.fftSize
      analyser.smoothingTimeConstant = config.smoothing

      const gain = ctx.createGain()
      gain.gain.value = isMuted ? 0 : volume

      const dest = ctx.createMediaStreamDestination()

      analyser.connect(gain)
      gain.connect(ctx.destination)
      gain.connect(dest) // Audio to recording destination

      audioContextRef.current = ctx
      analyserRef.current = analyser
      gainNodeRef.current = gain
      destinationNodeRef.current = dest
    }
    return audioContextRef.current
  }, [config.fftSize, config.smoothing, isMuted, volume])

  // Update volume and mute
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      const val = isMuted ? 0 : volume
      gainNodeRef.current.gain.setValueAtTime(val, audioContextRef.current.currentTime)
    }
  }, [volume, isMuted])

  // Update Analyser settings
  useEffect(() => {
    if (analyserRef.current) {
      analyserRef.current.fftSize = config.fftSize
      analyserRef.current.smoothingTimeConstant = config.smoothing
    }
  }, [config.fftSize, config.smoothing])

  // Authoritative stop all audio playback
  const stopAllAudio = useCallback(() => {
    if (activeSourceRef.current) {
      try {
        activeSourceRef.current.stop()
        activeSourceRef.current.disconnect()
      } catch (e) {
        // Source might already have ended
      }
      activeSourceRef.current = null
    }
    setIsPlaying(false)
  }, [])

  // Play audio from specific offset
  const playFromOffset = useCallback(
    async (offsetSec: number) => {
      if (!audioBuffer) return

      stopAllAudio()

      const ctx = getAudioContext()
      if (ctx.state === 'suspended') {
        await ctx.resume()
      }

      const source = ctx.createBufferSource()
      source.buffer = audioBuffer
      source.loop = isLooping

      if (analyserRef.current) {
        source.connect(analyserRef.current)
      }

      const boundedOffset = Math.max(0, Math.min(offsetSec, audioBuffer.duration))
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
    [audioBuffer, isLooping, getAudioContext, stopAllAudio]
  )

  // Pause playback
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

  // Toggle Play / Pause
  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      pauseAudio()
    } else {
      playFromOffset(playbackStartOffsetRef.current)
    }
  }, [isPlaying, pauseAudio, playFromOffset])

  // Stop playback completely
  const handleStop = useCallback(() => {
    stopAllAudio()
    playbackStartOffsetRef.current = 0
    setCurrentTime(0)
  }, [stopAllAudio])

  // Seek audio
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

  // Handle Audio File Selection
  const handleLoadAudioFile = useCallback(
    async (file: File) => {
      stopAllAudio()
      setIsLoadingAudio(true)
      try {
        const { buffer, metadata: fileMeta } = await decodeAudioFile(file)
        setAudioFile(file)
        setAudioBuffer(buffer)
        setDuration(buffer.duration)
        setCurrentTime(0)
        playbackStartOffsetRef.current = 0

        // Auto-populate title if empty or default
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        setMetadata((prev) => ({
          ...prev,
          title: cleanName,
        }))

        showToast(`Loaded ${file.name} (${formatTimeDisplay(buffer.duration)})`, 'success')
      } catch (err: any) {
        showToast(err.message || 'Failed to decode audio file.', 'error')
      } finally {
        setIsLoadingAudio(false)
      }
    },
    [stopAllAudio, showToast]
  )

  // Handle Demo Track Generation
  const handleLoadDemoTrack = useCallback(async () => {
    stopAllAudio()
    setIsLoadingAudio(true)
    try {
      showToast('Generating instant synth specimen track...', 'info')
      const demoFile = await generateVisualizerDemoSpecimen()
      await handleLoadAudioFile(demoFile)
      setMetadata({
        title: 'Cyberpulse Horizons',
        artist: 'IndiaTools Synth Lab',
        handle: '@indiatools_official',
        showMetadata: true,
      })
      showToast('Sample track loaded! Press Play to watch the visualizer.', 'success')
    } catch (err: any) {
      showToast('Could not generate sample track.', 'error')
    } finally {
      setIsLoadingAudio(false)
    }
  }, [stopAllAudio, handleLoadAudioFile, showToast])

  // Handle Cover Art Selection
  const handleCoverUpload = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => {
        setCoverImage(img)
        setCoverImageUrl(url)
        showToast('Cover artwork uploaded successfully!', 'success')
      }
      img.onerror = () => {
        showToast('Failed to load image file.', 'error')
      }
      img.src = url
    },
    [showToast]
  )

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopAllAudio()
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (recorderSessionRef.current) {
        recorderSessionRef.current.stop()
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close()
        } catch {
          // ignore
        }
      }
      if (coverImageUrl) {
        URL.revokeObjectURL(coverImageUrl)
      }
    }
  }, [stopAllAudio, coverImageUrl])

  // Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dimensions = ASPECT_RATIOS[config.aspectRatio]
    if (canvas.width !== dimensions.width || canvas.height !== dimensions.height) {
      canvas.width = dimensions.width
      canvas.height = dimensions.height
      particleSystemRef.current.init(dimensions.width, dimensions.height)
    }

    let isRunning = true
    const freqData = new Uint8Array(config.fftSize / 2)
    const timeData = new Uint8Array(config.fftSize / 2)

    const render = () => {
      if (!isRunning) return

      const width = canvas.width
      const height = canvas.height
      const nowSec = performance.now() / 1000

      // Update current playback time if playing
      if (isPlaying && audioContextRef.current) {
        const elapsed = audioContextRef.current.currentTime - playbackStartTimeRef.current
        const curr = Math.min(duration, playbackStartOffsetRef.current + elapsed)
        setCurrentTime(curr)
      }

      // Extract frequency and time domain data
      if (analyserRef.current && isPlaying) {
        analyserRef.current.getByteFrequencyData(freqData)
        analyserRef.current.getByteTimeDomainData(timeData)
      } else {
        // Idle ambient subtle movement
        for (let i = 0; i < freqData.length; i++) {
          freqData[i] = Math.max(0, Math.sin(nowSec * 2 + i * 0.1) * 25 + 15)
        }
        for (let i = 0; i < timeData.length; i++) {
          timeData[i] = 128 + Math.sin(nowSec * 3 + i * 0.05) * 6
        }
      }

      const bands = calculateAudioBands(freqData)
      const palette = THEME_PALETTES[config.theme]

      // Update rotation
      rotationAngleRef.current += 0.008 * config.spinSpeed * (1 + bands.bass * 1.5)

      // 1. Draw Background
      drawBackground(ctx, width, height, config.bgMode, coverImage, bands.bass, palette, nowSec)

      // 2. Draw Ambient Particles
      if (config.showParticles) {
        particleSystemRef.current.updateAndDraw(ctx, width, height, bands.bass, palette)
      }

      // 3. Draw Selected Preset
      switch (config.preset) {
        case 'circular-pulse':
          drawCircularPulse(
            ctx,
            width,
            height,
            freqData,
            timeData,
            bands.bass,
            coverImage,
            config,
            palette,
            rotationAngleRef.current
          )
          break
        case 'linear-bars':
          const peakCaps = peakHoldManagerRef.current.update(Array.from(freqData))
          drawLinearBars(ctx, width, height, freqData, peakCaps, bands.bass, config, palette)
          break
        case 'smooth-waveform':
          drawSmoothWaveform(ctx, width, height, timeData, freqData, bands.bass, config, palette)
          break
        case 'cyberpunk-oscilloscope':
          drawCyberpunkOscilloscope(
            ctx,
            width,
            height,
            timeData,
            freqData,
            bands.bass,
            config,
            palette,
            nowSec
          )
          break
      }

      // 4. Draw Typography & Channel Metadata Overlay
      drawMetadataOverlay(ctx, width, height, metadata, palette, config)

      animationFrameRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      isRunning = false
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [config, isPlaying, duration, coverImage, metadata])

  // Start Video Recording Process
  const handleStartExport = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) {
      showToast('Canvas render surface not ready.', 'error')
      return
    }

    if (!audioBuffer) {
      showToast('Please load an audio track before exporting video.', 'error')
      return
    }

    getAudioContext()
    const dest = destinationNodeRef.current
    if (!dest) {
      showToast('Audio recording node not initialized.', 'error')
      return
    }

    // Determine target seconds
    let targetSeconds = audioBuffer.duration
    if (targetExportLength === '15s') targetSeconds = Math.min(15, audioBuffer.duration)
    else if (targetExportLength === '30s') targetSeconds = Math.min(30, audioBuffer.duration)
    else if (targetExportLength === '60s') targetSeconds = Math.min(60, audioBuffer.duration)

    setIsRecording(true)
    setRecordingElapsed(0)

    const session = new VideoRecorderSession({
      canvas,
      audioDestination: dest,
      fps: exportFps,
      bitrate: 6_000_000,
      onStart: () => {
        showToast('Video recording started...', 'info')
      },
      onComplete: (blob, ext) => {
        setIsRecording(false)
        if (recordIntervalRef.current) clearInterval(recordIntervalRef.current)
        stopAllAudio()

        const cleanTitle = (metadata.title || 'spectrum_video').replace(/[^a-zA-Z0-9_-]/g, '_')
        const filename = `IndiaTools_${cleanTitle}_${config.preset}_${Date.now()}.${ext}`
        downloadBlob(blob, filename)

        const mb = (blob.size / (1024 * 1024)).toFixed(2)
        showToast(`Video exported successfully! (${mb} MB .${ext})`, 'success')
        setIsExportModalOpen(false)
      },
      onError: (err) => {
        setIsRecording(false)
        if (recordIntervalRef.current) clearInterval(recordIntervalRef.current)
        stopAllAudio()
        showToast(`Export error: ${err.message}`, 'error')
      },
    })

    recorderSessionRef.current = session

    // Rewind and play audio from start
    await playFromOffset(0)
    session.start()

    let elapsed = 0
    recordIntervalRef.current = setInterval(() => {
      elapsed += 1
      setRecordingElapsed(elapsed)
      if (elapsed >= targetSeconds) {
        clearInterval(recordIntervalRef.current)
        session.stop()
      }
    }, 1000)
  }, [
    audioBuffer,
    config.preset,
    exportFps,
    getAudioContext,
    metadata.title,
    playFromOffset,
    showToast,
    stopAllAudio,
    targetExportLength,
  ])

  // Stop recording manually early
  const handleStopExportEarly = useCallback(() => {
    if (recorderSessionRef.current && isRecording) {
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current)
      recorderSessionRef.current.stop()
      stopAllAudio()
      showToast('Finalizing video file...', 'info')
    }
  }, [isRecording, showToast, stopAllAudio])

  // Cancel recording without saving
  const handleCancelExport = useCallback(() => {
    if (recorderSessionRef.current) {
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current)
      recorderSessionRef.current.stop()
      stopAllAudio()
      setIsRecording(false)
      showToast('Video recording canceled.', 'info')
    }
  }, [showToast, stopAllAudio])

  // Target seconds computation for export modal
  const targetSecondsNum =
    audioBuffer && targetExportLength === '15s'
      ? Math.min(15, audioBuffer.duration)
      : audioBuffer && targetExportLength === '30s'
      ? Math.min(30, audioBuffer.duration)
      : audioBuffer && targetExportLength === '60s'
      ? Math.min(60, audioBuffer.duration)
      : audioBuffer
      ? audioBuffer.duration
      : 30

  return (
    <ToolPageLayout
      tool={tool}
      customTitle="100% Free Audio Spectrum & Waveform Video Generator | IndiaTools"
      customDescription="Generate stunning audio visualizer and waveform videos in your browser. Circular pulse, studio equalizer bars, glowing neon waveforms, and cyberpunk oscilloscope. 100% private with zero file uploads."
      maxWidthClass="max-w-7xl"
    >
      <div className="space-y-6">
        {/* Flagship Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 md:p-8 border border-indigo-500/20 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Zero Server Upload • 100% In-Browser Video Engine
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Audio Spectrum & Waveform <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400">Video Generator</span>
              </h1>
              <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
                Turn your songs, beats, and podcasts into high-definition reactive music videos for YouTube, Instagram Reels, and TikTok without expensive video editing software.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleLoadDemoTrack}
                disabled={isLoadingAudio}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-sm font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-indigo-400" />
                Try Sample Track
              </button>

              <button
                onClick={() => setIsExportModalOpen(true)}
                disabled={!audioBuffer}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <Film className="w-4 h-4" />
                Export Video
              </button>
            </div>
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Controls & Settings (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Audio & Media Import Section */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 backdrop-blur-xl shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  1. Audio & Artwork
                </h2>
                {audioFile && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Ready
                  </span>
                )}
              </div>

              {/* Audio Drop Zone */}
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
                className={`relative rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all duration-200 ${
                  isDraggingOver
                    ? 'border-cyan-400 bg-cyan-950/20 scale-[0.99]'
                    : 'border-slate-750 hover:border-cyan-500/50 bg-slate-950/50 hover:bg-slate-950/80'
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
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-xs md:text-sm font-medium text-slate-200">
                    {audioFile ? (
                      <span className="text-cyan-400 font-semibold truncate max-w-[280px] inline-block">
                        {audioFile.name}
                      </span>
                    ) : (
                      'Click or Drag Audio (MP3, WAV, FLAC, M4A, OGG)'
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {audioBuffer
                      ? `Duration: ${formatTimeDisplay(duration)} • Sample Rate: ${audioBuffer.sampleRate} Hz`
                      : 'Zero server uploads. 100% processed in browser RAM.'}
                  </p>
                </div>
              </div>

              {/* Cover Image & Metadata Upload */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleCoverUpload(e.target.files[0])
                      }
                    }}
                  />
                  <ImageIcon className="w-4 h-4 text-violet-400" />
                  {coverImage ? 'Change Artwork' : 'Upload Artwork'}
                </button>

                {coverImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImage(null)
                      if (coverImageUrl) URL.revokeObjectURL(coverImageUrl)
                      setCoverImageUrl(null)
                    }}
                    className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold hover:bg-rose-500/20 transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    Remove Cover
                  </button>
                )}
              </div>

              {/* Track Metadata Inputs */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">On-Screen Overlay Text</span>
                  <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={metadata.showMetadata}
                      onChange={(e) => setMetadata((p) => ({ ...p, showMetadata: e.target.checked }))}
                      className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                    />
                    Display Overlay
                  </label>
                </div>

                {metadata.showMetadata && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Song Title (e.g. Neon Horizon)"
                      value={metadata.title}
                      onChange={(e) => setMetadata((p) => ({ ...p, title: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Artist / Subtitle"
                        value={metadata.artist}
                        onChange={(e) => setMetadata((p) => ({ ...p, artist: e.target.value }))}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                      <input
                        type="text"
                        placeholder="Social handle / Channel"
                        value={metadata.handle}
                        onChange={(e) => setMetadata((p) => ({ ...p, handle: e.target.value }))}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Presets & Style Customization */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 backdrop-blur-xl shadow-lg space-y-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-400" />
                2. Visualizer Preset & Aspect Ratio
              </h2>

              {/* 4 Presets Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Preset Style</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'circular-pulse', label: 'Circular Pulse', desc: 'Radial disc halo', icon: Disc },
                    { id: 'linear-bars', label: 'Linear Bars', desc: 'Studio equalizer', icon: BarChart3 },
                    { id: 'smooth-waveform', label: 'Glowing Wave', desc: 'Continuous neon ribbon', icon: Activity },
                    { id: 'cyberpunk-oscilloscope', label: 'CRT Oscilloscope', desc: 'Retro scanlines & telemetry', icon: Radio },
                  ].map((p) => {
                    const Icon = p.icon
                    const isSelected = config.preset === p.id
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setConfig((prev) => ({ ...prev, preset: p.id as VisualizerPreset }))}
                        className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-br from-indigo-950/80 to-purple-950/60 border-cyan-400 text-white shadow-lg shadow-cyan-500/10'
                            : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 w-full mb-1">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                          <span className="text-xs font-bold text-white">{p.label}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{p.desc}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Aspect Ratio Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Aspect Ratio (Format)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '16:9', label: '16:9 Landscape', sub: 'YouTube / Desktop', icon: Tv },
                    { id: '9:16', label: '9:16 Portrait', sub: 'Reels / Shorts', icon: Smartphone },
                    { id: '1:1', label: '1:1 Square', sub: 'Instagram Feed', icon: SquareIcon },
                  ].map((ratio) => {
                    const Icon = ratio.icon
                    const isSelected = config.aspectRatio === ratio.id
                    return (
                      <button
                        key={ratio.id}
                        type="button"
                        onClick={() => setConfig((prev) => ({ ...prev, aspectRatio: ratio.id as AspectRatio }))}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300'
                            : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4 mb-1" />
                        <span className="text-xs font-bold">{ratio.id}</span>
                        <span className="text-[9px] text-slate-400">{ratio.sub}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Color Themes & Background Modes */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Color Palette</label>
                  <select
                    value={config.theme}
                    onChange={(e) => setConfig((prev) => ({ ...prev, theme: e.target.value as ColorTheme }))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="neon-cyber">Neon Cyber (Cyan/Violet)</option>
                    <option value="electric-violet">Electric Violet & Blue</option>
                    <option value="sunset-ember">Sunset Ember (Orange/Red)</option>
                    <option value="aurora-emerald">Aurora Emerald & Cyan</option>
                    <option value="matrix-glow">Matrix Neon Green</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">Background Scene</label>
                  <select
                    value={config.bgMode}
                    onChange={(e) => setConfig((prev) => ({ ...prev, bgMode: e.target.value as BackgroundMode }))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="blurred-cover">Blurred Cover Art</option>
                    <option value="cyber-grid">3D Cyberpunk Grid</option>
                    <option value="deep-space">Deep Space Nebula</option>
                    <option value="dark-studio">Dark Studio Vignette</option>
                  </select>
                </div>
              </div>

              {/* Advanced Fine-Tuning Accordion */}
              <div className="border-t border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAdvancedTuning(!showAdvancedTuning)}
                  className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    Advanced Audio & Visual Dynamics
                  </span>
                  {showAdvancedTuning ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showAdvancedTuning && (
                  <div className="space-y-3.5 pt-3">
                    {/* Sensitivity */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Audio Sensitivity</span>
                        <span className="font-mono text-cyan-400">{config.sensitivity.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.1"
                        value={config.sensitivity}
                        onChange={(e) => setConfig((p) => ({ ...p, sensitivity: parseFloat(e.target.value) }))}
                        className="w-full accent-cyan-400"
                      />
                    </div>

                    {/* Bass Reactivity */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Bass Pulse & Beat Shake</span>
                        <span className="font-mono text-cyan-400">{config.bassReactivity.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.0"
                        max="2.0"
                        step="0.1"
                        value={config.bassReactivity}
                        onChange={(e) => setConfig((p) => ({ ...p, bassReactivity: parseFloat(e.target.value) }))}
                        className="w-full accent-cyan-400"
                      />
                    </div>

                    {/* Glow Intensity */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Luminous Glow Bloom</span>
                        <span className="font-mono text-cyan-400">{config.glowStrength.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="2.0"
                        step="0.1"
                        value={config.glowStrength}
                        onChange={(e) => setConfig((p) => ({ ...p, glowStrength: parseFloat(e.target.value) }))}
                        className="w-full accent-cyan-400"
                      />
                    </div>

                    {/* Particles toggle */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-300">Beat-Reactive Floating Dust</span>
                      <input
                        type="checkbox"
                        checked={config.showParticles}
                        onChange={(e) => setConfig((p) => ({ ...p, showParticles: e.target.checked }))}
                        className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Interactive Studio Canvas & Transport (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Visualizer Studio Monitor Screen */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-bold text-white tracking-wider uppercase">
                    Live Studio Canvas Output
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                    {ASPECT_RATIOS[config.aspectRatio].width}x{ASPECT_RATIOS[config.aspectRatio].height}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">
                    {isPlaying ? 'Audio Playing' : audioBuffer ? 'Ready (Paused)' : 'Waiting for Audio'}
                  </span>
                </div>
              </div>

              {/* Aspect Ratio Bounded Canvas Container */}
              <div
                className={`relative w-full mx-auto overflow-hidden rounded-xl bg-black border border-slate-800/80 shadow-inner flex items-center justify-center ${
                  config.aspectRatio === '16:9'
                    ? 'aspect-video max-h-[520px]'
                    : config.aspectRatio === '9:16'
                    ? 'aspect-[9/16] max-h-[620px] max-w-[350px]'
                    : 'aspect-square max-h-[520px] max-w-[520px]'
                }`}
              >
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain pointer-events-none select-none"
                />

                {/* Subtle Watermark on Preview */}
                <div className="absolute bottom-2.5 right-3 text-[10px] font-mono text-white/30 pointer-events-none select-none">
                  IndiaTools Engine
                </div>
              </div>

              {/* Master Audio Transport Controls Bar */}
              <div className="space-y-3 pt-2">
                {/* Seekbar and Timestamps */}
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
                    disabled={!audioBuffer}
                    className="w-full h-2 rounded-lg bg-slate-800 accent-cyan-400 cursor-pointer disabled:opacity-40"
                  />
                </div>

                {/* Playback Buttons & Volume */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTogglePlay}
                      disabled={!audioBuffer}
                      className={`inline-flex items-center justify-center w-11 h-11 rounded-xl font-bold text-white transition-all shadow-md cursor-pointer ${
                        isPlaying
                          ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                          : 'bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/20'
                      } disabled:opacity-40 disabled:pointer-events-none`}
                    >
                      {isPlaying ? <Pause className="w-5 h-5 text-slate-950" /> : <Play className="w-5 h-5 ml-0.5 text-slate-950" />}
                    </button>

                    <button
                      type="button"
                      onClick={handleStop}
                      disabled={!audioBuffer}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors disabled:opacity-40 cursor-pointer"
                      title="Stop audio"
                    >
                      <Square className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsLooping(!isLooping)}
                      disabled={!audioBuffer}
                      className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                        isLooping
                          ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
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
                      className="w-20 md:w-28 h-1.5 rounded-lg bg-slate-800 accent-indigo-400 cursor-pointer"
                    />
                  </div>

                  {/* Export Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsExportModalOpen(true)}
                    disabled={!audioBuffer}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Render & Download
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Export Specs Info Card */}
            <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Synchronous 60 FPS Canvas Capture with 192kbps Audio</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-300">
                  Codec: {getSupportedVideoMimeType().extension.toUpperCase()}
                </span>
                <span>•</span>
                <span>Zero Server Uploads</span>
              </div>
            </div>
          </div>
        </div>

        {/* EXPORT VIDEO MODAL / DRAWER */}
        {isExportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-indigo-500/30 p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white">Export Video</h3>
                </div>
                {!isRecording && (
                  <button
                    onClick={() => setIsExportModalOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {!isRecording ? (
                <div className="space-y-4">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Render your visualizer to an HD video file directly inside your browser. The engine captures high-resolution canvas frames and synchronizes them with the audio in real-time.
                  </p>

                  {/* Target Export Duration */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400">Video Duration to Render</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: '15s', label: '15 Sec', desc: 'Short Teaser' },
                        { id: '30s', label: '30 Sec', desc: 'Reels / Story' },
                        { id: '60s', label: '60 Sec', desc: 'Shorts Clip' },
                        { id: 'full', label: 'Full Song', desc: `${formatTimeDisplay(duration)} total` },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setTargetExportLength(item.id as any)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            targetExportLength === item.id
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <div className="text-xs font-bold">{item.label}</div>
                          <div className="text-[9px] text-slate-500">{item.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* FPS & Quality */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">Frame Rate</label>
                      <select
                        value={exportFps}
                        onChange={(e) => setExportFps(parseInt(e.target.value) as 30 | 60)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value={60}>60 FPS (Ultra Smooth)</option>
                        <option value={30}>30 FPS (Standard)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400">Target Resolution</label>
                      <div className="px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono">
                        {ASPECT_RATIOS[config.aspectRatio].width}x{ASPECT_RATIOS[config.aspectRatio].height}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-cyan-950/20 border border-cyan-500/20 p-3 text-xs text-cyan-300 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Browser Direct Recording Note
                    </div>
                    <p className="text-[11px] text-cyan-200/80">
                      Recording occurs in real-time as the audio plays to ensure 100% synchronized beat tracking and zero server limits. Keep this tab active while recording.
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsExportModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleStartExport}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      Start Recording
                    </button>
                  </div>
                </div>
              ) : (
                /* LIVE RECORDING IN PROGRESS VIEW */
                <div className="space-y-5 text-center py-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-sm font-extrabold text-rose-400 tracking-wider uppercase">
                      Recording Visualizer Video...
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-3xl font-mono font-extrabold text-white">
                      {formatTimeDisplay(recordingElapsed)} / {formatTimeDisplay(targetSecondsNum)}
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-pink-500 transition-all duration-300"
                        style={{
                          width: `${Math.min(100, (recordingElapsed / (targetSecondsNum || 1)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-400">
                    Capturing high-DPI canvas frames with audio stream. Please keep this browser window in focus.
                  </p>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleStopExportEarly}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      Finish & Download Now
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelExport}
                      className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Educational Guide, FAQ and Producer Tips */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              How to Create Stunning Music Visualizer Videos
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Music producers, DJs, and podcasters no longer need to learn complex 3D software or pay for monthly cloud rendering subscriptions. Here is how IndiaTools renders reactive spectrum videos directly inside your browser:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-sm font-bold text-white">Import Audio & Artwork</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Load any MP3, WAV, or OGG track into device memory. Upload your single cover art to create a rotating vinyl disc or background glow.
              </p>
            </div>

            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-sm font-bold text-white">Choose Preset & Aspect Ratio</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pick from 16:9 for YouTube releases, 9:16 for viral Instagram Reels and YouTube Shorts, or 1:1 for social feeds. Customize glow, colors, and typography.
              </p>
            </div>

            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="text-sm font-bold text-white">Export & Download HD Video</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click Export Video. Our Web MediaRecorder records the visualizer frames and syncs the lossless audio into a WebM or MP4 video ready for upload.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
