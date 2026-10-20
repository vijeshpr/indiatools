import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Upload,
  Download,
  Sliders,
  Sparkles,
  Type,
  Image as ImageIcon,
  Music,
  Video,
  Layers,
  Palette,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
  Plus,
  Zap,
  Eye,
  Film,
  Sun,
  CloudRain,
  Activity,
  Radio,
} from 'lucide-react'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useToast } from '../components/common/Toast'
import {
  AspectRatio,
  VideoResolution,
  ASPECT_RATIO_RESOLUTIONS,
  StudioCompositionConfig,
  DEFAULT_STUDIO_COMPOSITION,
  BackgroundCategory,
  MotionStyle,
  SlideshowImage,
  AudioTrackMetadata,
} from '../lib/audioToVideo/types'
import { BACKGROUND_PRESETS } from '../lib/audioToVideo/backgroundPresets'
import { AudioToVideoAudioEngine } from '../lib/audioToVideo/audioToVideoAudioEngine'
import { AudioToVideoRenderEngine } from '../lib/audioToVideo/audioToVideoRenderEngine'
import {
  AudioToVideoExportEngine,
  ExportProgress,
} from '../lib/audioToVideo/audioToVideoExportEngine'

type StudioTab = 'audio' | 'background' | 'visualizer' | 'cinematic' | 'typography'

export const AudioToVideoStudioTool: React.FC = () => {
  const tool = getToolBySlug('audio-to-video-studio')
  const { showToast } = useToast()

  // Composition State
  const [composition, setComposition] = useState<StudioCompositionConfig>(DEFAULT_STUDIO_COMPOSITION)
  const [activeTab, setActiveTab] = useState<StudioTab>('background')

  // Audio Playback & Track State
  const [audioTrack, setAudioTrack] = useState<AudioTrackMetadata>({
    file: null,
    url: null,
    name: 'No audio loaded',
    duration: 0,
    sizeBytes: 0,
    type: '',
    fadeInSec: 1.0,
    fadeOutSec: 1.0,
  })
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [volume, setVolume] = useState<number>(0.85)
  const [isMuted, setIsMuted] = useState<boolean>(false)

  // Export State
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null)
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false)

  // Canvas & Engine References
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const audioEngineRef = useRef<AudioToVideoAudioEngine | null>(null)
  const renderEngineRef = useRef<AudioToVideoRenderEngine | null>(null)
  const exportEngineRef = useRef<AudioToVideoExportEngine | null>(null)
  const animFrameIdRef = useRef<number | null>(null)
  const audioInputRef = useRef<HTMLInputElement | null>(null)
  const singleImageInputRef = useRef<HTMLInputElement | null>(null)
  const slideshowInputRef = useRef<HTMLInputElement | null>(null)

  // Initialize Web Audio & Render Engines once on mount
  useEffect(() => {
    audioEngineRef.current = new AudioToVideoAudioEngine()
    renderEngineRef.current = new AudioToVideoRenderEngine()
    exportEngineRef.current = new AudioToVideoExportEngine()

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current)
      audioEngineRef.current?.destroy()
    }
  }, [])

  // Animation Loop (60 FPS Canvas Rendering)
  useEffect(() => {
    const loop = () => {
      const canvas = canvasRef.current
      const audio = audioEngineRef.current
      const renderer = renderEngineRef.current

      if (canvas && audio && renderer) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const { bands, freqData, timeData } = audio.analyze()
          const time = audio.getCurrentTime()
          const dur = audio.getDuration() || 30

          // Update playback time state throttled
          setCurrentTime(time)
          if (audio.isEnded() && isPlaying) {
            setIsPlaying(false)
          }

          renderer.render(
            ctx,
            canvas.width,
            canvas.height,
            composition,
            bands,
            freqData,
            timeData,
            time,
            dur
          )
        }
      }

      animFrameIdRef.current = requestAnimationFrame(loop)
    }

    animFrameIdRef.current = requestAnimationFrame(loop)
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current)
    }
  }, [composition, isPlaying])

  // Canvas Resolution & Sizing update
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resConfig =
      ASPECT_RATIO_RESOLUTIONS[composition.aspectRatio][composition.resolution]
    canvas.width = resConfig.width
    canvas.height = resConfig.height
  }, [composition.aspectRatio, composition.resolution])

  // Handle Audio File Import
  const handleAudioFile = async (file: File) => {
    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|ogg|m4a|aac|flac|webm)$/i)) {
      showToast('Please select a valid audio file (MP3, WAV, OGG, WebM)', 'error')
      return
    }

    try {
      if (!audioEngineRef.current) return
      const { duration, name } = await audioEngineRef.current.loadAudio(file)

      setAudioTrack({
        file,
        url: URL.createObjectURL(file),
        name,
        duration,
        sizeBytes: file.size,
        type: file.type || 'audio/mpeg',
        fadeInSec: 1.0,
        fadeOutSec: 1.0,
      })

      // Update text overlay title with song name
      const cleanTitle = name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
      setComposition((prev) => ({
        ...prev,
        textOverlay: {
          ...prev.textOverlay,
          title: cleanTitle.slice(0, 32),
        },
      }))

      setIsPlaying(false)
      setCurrentTime(0)
      showToast(`Audio loaded: ${name} (${Math.round(duration)}s)`, 'success')
    } catch (err: any) {
      showToast(err?.message || 'Failed to load audio', 'error')
    }
  }

  // Create Synthetic Ambient Demo Track for instant 1-click test
  const handleGenerateDemoAudio = async () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const durationSec = 15
      const sampleRate = audioCtx.sampleRate
      const buffer = audioCtx.createBuffer(2, sampleRate * durationSec, sampleRate)
      const left = buffer.getChannelData(0)
      const right = buffer.getChannelData(1)

      for (let i = 0; i < buffer.length; i++) {
        const t = i / sampleRate
        // Ambient melodic synth chords + kick pulse at 120 BPM (every 0.5s)
        const kickTime = t % 0.5
        const kick = Math.exp(-kickTime * 18) * Math.sin(2 * Math.PI * (120 - kickTime * 180) * kickTime)
        const melody =
          Math.sin(2 * Math.PI * 220 * t) * 0.15 +
          Math.sin(2 * Math.PI * 330 * t) * 0.1 +
          Math.sin(2 * Math.PI * 440 * t) * 0.08
        const envelope = Math.sin((t / durationSec) * Math.PI)
        left[i] = (kick * 0.5 + melody) * envelope * 0.6
        right[i] = (kick * 0.5 + melody) * envelope * 0.6
      }

      // Encode into WAV Blob
      const wavBytes = audioBufferToWav(buffer)
      const demoBlob = new Blob([wavBytes.buffer as ArrayBuffer], { type: 'audio/wav' })
      const demoFile = new File([demoBlob], 'Luminous_Ambient_Demo.wav', { type: 'audio/wav' })

      await handleAudioFile(demoFile)
      audioCtx.close()
    } catch (e) {
      showToast('Could not synthesize demo audio on this browser', 'error')
    }
  }

  // Helper: AudioBuffer to 16-bit PCM WAV
  const audioBufferToWav = (buffer: AudioBuffer): Uint8Array => {
    const numChannels = buffer.numberOfChannels
    const sampleRate = buffer.sampleRate
    const format = 1 // PCM
    const bitDepth = 16
    const bytesPerSample = bitDepth / 8
    const blockAlign = numChannels * bytesPerSample
    const numSamples = buffer.length
    const dataSize = numSamples * blockAlign
    const headerSize = 44
    const totalSize = headerSize + dataSize
    const arrayBuffer = new ArrayBuffer(totalSize)
    const view = new DataView(arrayBuffer)

    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
    }

    writeString(0, 'RIFF')
    view.setUint32(4, totalSize - 8, true)
    writeString(8, 'WAVE')
    writeString(12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, format, true)
    view.setUint16(22, numChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * blockAlign, true)
    view.setUint16(32, blockAlign, true)
    view.setUint16(34, bitDepth, true)
    writeString(36, 'data')
    view.setUint32(40, dataSize, true)

    let offset = 44
    for (let i = 0; i < numSamples; i++) {
      for (let ch = 0; ch < numChannels; ch++) {
        let sample = buffer.getChannelData(ch)[i]
        sample = Math.max(-1, Math.min(1, sample))
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true)
        offset += 2
      }
    }
    return new Uint8Array(arrayBuffer)
  }

  // Playback Control Handlers
  const togglePlayPause = () => {
    if (!audioEngineRef.current) return
    if (isPlaying) {
      audioEngineRef.current.pause()
      setIsPlaying(false)
    } else {
      audioEngineRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => showToast('Click to allow audio playback', 'info'))
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    audioEngineRef.current?.seek(newTime)
  }

  const handleVolumeChange = (v: number) => {
    setVolume(v)
    setIsMuted(v === 0)
    audioEngineRef.current?.setVolume(v)
  }

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false)
      audioEngineRef.current?.setVolume(volume || 0.8)
    } else {
      setIsMuted(true)
      audioEngineRef.current?.setVolume(0)
    }
  }

  // Handle Single Image Upload
  const handleSingleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (JPG, PNG, WebP)', 'error')
      return
    }
    const url = URL.createObjectURL(file)
    setComposition((prev) => ({
      ...prev,
      background: {
        ...prev.background,
        mode: 'single-image',
        singleImageUrl: url,
        singleImageName: file.name,
      },
    }))
    showToast('Photo set as background with motion animation', 'success')
  }

  // Handle Slideshow Multiple Image Upload
  const handleSlideshowUpload = (files: FileList) => {
    const newSlides: SlideshowImage[] = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((f, idx) => ({
        id: `slide_${Date.now()}_${idx}`,
        url: URL.createObjectURL(f),
        name: f.name,
        durationSec: 4.0,
      }))

    if (newSlides.length === 0) return

    setComposition((prev) => ({
      ...prev,
      background: {
        ...prev.background,
        mode: 'slideshow',
        slideshow: [...prev.background.slideshow, ...newSlides],
      },
    }))
    showToast(`Added ${newSlides.length} images to Slideshow Studio`, 'success')
  }

  // Handle Export Video
  const handleStartExport = async () => {
    const canvas = canvasRef.current
    const audio = audioEngineRef.current
    const exporter = exportEngineRef.current
    if (!canvas || !audio || !exporter) return

    const totalDuration = audio.getDuration() || 15
    if (totalDuration <= 0) {
      showToast('Please load an audio file before exporting', 'error')
      return
    }

    setIsExportModalOpen(true)
    audio.seek(0)
    audio.play().catch(() => {})
    setIsPlaying(true)

    const audioTrack = audio.getAudioExportTrack()

    try {
      await exporter.startExport(canvas, audioTrack, totalDuration, 30, (prog) => {
        setExportProgress(prog)
      })
      showToast('Video export completed successfully!', 'success')
    } catch (err: any) {
      if (err?.message !== 'Export cancelled by user.') {
        showToast(err?.message || 'Video export failed', 'error')
      }
    } finally {
      audio.pause()
      setIsPlaying(false)
    }
  }

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  if (!tool) return null

  return (
    <ToolPageLayout
      tool={tool}
      hideHeroHeader={true}
      maxWidthClass="max-w-[1720px] w-full px-2 sm:px-4 lg:px-6"
    >
      <div className="space-y-6">
        {/* ========================================================= */}
        {/* TOP BAR: STUDIO BRANDING & WORKSPACE HEADER               */}
        {/* ========================================================= */}
        <div className="bg-[#090A0F] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#090A0F] rounded-[10px] flex items-center justify-center">
                <Video className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Audio to Video Studio
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Flagship
                </span>
                <span className="hidden sm:inline-block text-xs px-2.5 py-0.5 rounded-full font-bold bg-violet-500/10 text-violet-400 border border-violet-500/30">
                  100% Client-Side
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Turn Your Music Into Moving Visual Stories.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Aspect Ratio Buttons */}
            <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/10">
              {(['16:9', '9:16', '1:1'] as AspectRatio[]).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setComposition((prev) => ({ ...prev, aspectRatio: ratio }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    composition.aspectRatio === ratio
                      ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {ratio === '16:9' ? '16:9 Landscape' : ratio === '9:16' ? '9:16 Vertical' : '1:1 Square'}
                </button>
              ))}
            </div>

            {/* Resolution Buttons */}
            <div className="flex bg-slate-900/80 p-1 rounded-xl border border-white/10">
              {(['1080p', '720p'] as VideoResolution[]).map((res) => (
                <button
                  key={res}
                  onClick={() => setComposition((prev) => ({ ...prev, resolution: res }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    composition.resolution === res
                      ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {res === '1080p' ? 'Full HD (1080p)' : 'Fast (720p)'}
                </button>
              ))}
            </div>

            {/* Performance Mode Switch */}
            <button
              onClick={() =>
                setComposition((prev) => ({ ...prev, performanceMode: !prev.performanceMode }))
              }
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                composition.performanceMode
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                  : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-slate-200'
              }`}
              title="Reduces particle count and blur for low-end hardware"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{composition.performanceMode ? 'Performance Mode' : 'High Quality'}</span>
            </button>

            {/* Export Video Trigger */}
            <button
              onClick={handleStartExport}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Export Video</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MAIN STUDIO WORKSPACE: PREVIEW + TIMELINE + DOCK EDITORS  */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT 7/12: LIVE PREVIEW SCREEN & AUDIO SCRUBBER */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Visualizer Canvas Container */}
            <div className="relative w-full aspect-video bg-[#05060A] rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center group">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain pointer-events-none"
              />

              {/* Central Play/Pause Hover Trigger */}
              <button
                onClick={togglePlayPause}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95 shadow-2xl"
              >
                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1 text-cyan-400" />}
              </button>

              {/* Top overlay badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-black/60 backdrop-blur-md text-white border border-white/10">
                  {composition.aspectRatio}
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-black/60 backdrop-blur-md text-cyan-300 border border-white/10">
                  {composition.resolution}
                </span>
              </div>
            </div>

            {/* Audio Timeline & Scrubber Panel */}
            <div className="bg-[#090A0F] border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlayPause}
                    className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <button
                    onClick={() => {
                      if (audioEngineRef.current) {
                        audioEngineRef.current.seek(0)
                        setCurrentTime(0)
                      }
                    }}
                    className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-colors"
                    title="Restart"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <div className="text-xs font-mono text-slate-300">
                    <span className="text-cyan-400 font-bold">{formatSec(currentTime)}</span>
                    <span className="text-slate-500 mx-1">/</span>
                    <span>{formatSec(audioTrack.duration || 0)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 max-w-xs truncate">
                  <Music className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-xs text-slate-300 truncate font-medium">
                    {audioTrack.name}
                  </span>
                </div>

                {/* Volume slider */}
                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="text-slate-400 hover:text-white">
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-20 accent-cyan-400 cursor-pointer h-1.5 rounded-lg bg-slate-800"
                  />
                </div>
              </div>

              {/* Timeline Seek Bar */}
              <div className="relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max={audioTrack.duration || 30}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 rounded-lg bg-slate-800 accent-gradient cursor-pointer accent-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* RIGHT 5/12: MODULAR EDITING SUITE & STUDIO DOCK */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Dock Navigation Tabs */}
            <div className="grid grid-cols-5 gap-1 bg-[#090A0F] p-1.5 rounded-2xl border border-white/10">
              {[
                { id: 'background', label: 'Scene', icon: ImageIcon },
                { id: 'visualizer', label: 'Spectrum', icon: Activity },
                { id: 'cinematic', label: 'Effects', icon: Sparkles },
                { id: 'typography', label: 'Titles', icon: Type },
                { id: 'audio', label: 'Audio', icon: Music },
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as StudioTab)}
                    className={`flex flex-col items-center justify-center py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-gradient-to-tr from-violet-600/30 via-indigo-600/30 to-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* TAB CONTENT PANELS */}
            <div className="bg-[#090A0F] border border-white/10 rounded-2xl p-5 shadow-2xl max-h-[580px] overflow-y-auto space-y-5">
              {/* TAB 1: BACKGROUND & MOTION STUDIO */}
              {activeTab === 'background' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-cyan-400" />
                      <span>Cinematic Background & Motion</span>
                    </h3>
                    <div className="flex bg-slate-900 p-0.5 rounded-lg border border-white/10 text-xs">
                      <button
                        onClick={() =>
                          setComposition((prev) => ({
                            ...prev,
                            background: { ...prev.background, mode: 'preset' },
                          }))
                        }
                        className={`px-2.5 py-1 rounded-md font-bold ${
                          composition.background.mode === 'preset'
                            ? 'bg-cyan-500 text-black'
                            : 'text-slate-400'
                        }`}
                      >
                        12 Presets
                      </button>
                      <button
                        onClick={() =>
                          setComposition((prev) => ({
                            ...prev,
                            background: { ...prev.background, mode: 'single-image' },
                          }))
                        }
                        className={`px-2.5 py-1 rounded-md font-bold ${
                          composition.background.mode === 'single-image'
                            ? 'bg-cyan-500 text-black'
                            : 'text-slate-400'
                        }`}
                      >
                        Custom Photo
                      </button>
                      <button
                        onClick={() =>
                          setComposition((prev) => ({
                            ...prev,
                            background: { ...prev.background, mode: 'slideshow' },
                          }))
                        }
                        className={`px-2.5 py-1 rounded-md font-bold ${
                          composition.background.mode === 'slideshow'
                            ? 'bg-cyan-500 text-black'
                            : 'text-slate-400'
                        }`}
                      >
                        Slideshow
                      </button>
                    </div>
                  </div>

                  {/* Mode A: 12 Presets */}
                  {composition.background.mode === 'preset' && (
                    <div className="grid grid-cols-2 gap-2.5">
                      {BACKGROUND_PRESETS.map((preset) => {
                        const isSelected = composition.background.presetId === preset.id
                        return (
                          <button
                            key={preset.id}
                            onClick={() =>
                              setComposition((prev) => ({
                                ...prev,
                                background: { ...prev.background, presetId: preset.id },
                              }))
                            }
                            className={`p-3 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'bg-cyan-950/30 border-cyan-400 text-white shadow-lg'
                                : 'bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: preset.accentColor }}
                              />
                              <span className="text-[10px] text-slate-500">{preset.category}</span>
                            </div>
                            <div className="text-xs font-bold truncate">{preset.name}</div>
                            <div className="text-[10px] text-slate-400 truncate">{preset.subtitle}</div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Mode B: Single Image Upload + Motion */}
                  {composition.background.mode === 'single-image' && (
                    <div className="space-y-4">
                      <input
                        type="file"
                        ref={singleImageInputRef}
                        onChange={(e) => e.target.files?.[0] && handleSingleImageUpload(e.target.files[0])}
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                      />
                      <button
                        onClick={() => singleImageInputRef.current?.click()}
                        className="w-full py-8 border-2 border-dashed border-white/15 hover:border-cyan-400/50 rounded-2xl flex flex-col items-center justify-center gap-2 bg-slate-900/40 hover:bg-slate-900/80 transition-all text-slate-300 hover:text-white"
                      >
                        <Upload className="w-6 h-6 text-cyan-400" />
                        <span className="text-xs font-bold">
                          {composition.background.singleImageName || 'Upload Photograph (JPG, PNG, WebP)'}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          100% Client-Side. Zero server upload.
                        </span>
                      </button>

                      {/* Ken Burns Motion Styles */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300">Camera Motion Style</label>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {[
                            { id: 'slow-zoom-in', label: 'Slow Zoom-In' },
                            { id: 'slow-zoom-out', label: 'Slow Zoom-Out' },
                            { id: 'pan-left-right', label: 'Horizontal Pan' },
                            { id: 'ken-burns', label: 'Cinematic Ken Burns' },
                          ].map((m) => (
                            <button
                              key={m.id}
                              onClick={() =>
                                setComposition((prev) => ({
                                  ...prev,
                                  background: { ...prev.background, motionStyle: m.id as MotionStyle },
                                }))
                              }
                              className={`p-2.5 rounded-xl border text-center font-bold ${
                                composition.background.motionStyle === m.id
                                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                                  : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                              }`}
                            >
                              {m.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mode C: Slideshow Multi-Image Studio */}
                  {composition.background.mode === 'slideshow' && (
                    <div className="space-y-4">
                      <input
                        type="file"
                        ref={slideshowInputRef}
                        multiple
                        onChange={(e) => e.target.files && handleSlideshowUpload(e.target.files)}
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                      />
                      <button
                        onClick={() => slideshowInputRef.current?.click()}
                        className="w-full py-4 border border-dashed border-cyan-500/40 rounded-xl bg-cyan-950/20 text-cyan-300 hover:bg-cyan-950/40 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Images to Slideshow</span>
                      </button>

                      {/* Slides list */}
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {composition.background.slideshow.map((slide, idx) => (
                          <div
                            key={slide.id}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-white/5 text-xs"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold">
                                {idx + 1}
                              </span>
                              <span className="text-slate-300 truncate font-medium">{slide.name}</span>
                            </div>
                            <button
                              onClick={() =>
                                setComposition((prev) => ({
                                  ...prev,
                                  background: {
                                    ...prev.background,
                                    slideshow: prev.background.slideshow.filter((s) => s.id !== slide.id),
                                  },
                                }))
                              }
                              className="text-slate-500 hover:text-red-400 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Environmental Adjustments */}
                  <div className="pt-2 border-t border-white/10 space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Scene Brightness</span>
                        <span>{composition.background.brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="120"
                        value={composition.background.brightness}
                        onChange={(e) =>
                          setComposition((prev) => ({
                            ...prev,
                            background: { ...prev.background, brightness: parseInt(e.target.value) },
                          }))
                        }
                        className="w-full accent-cyan-400"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Film Grain Texture</span>
                        <span>{composition.background.filmGrain}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="60"
                        value={composition.background.filmGrain}
                        onChange={(e) =>
                          setComposition((prev) => ({
                            ...prev,
                            background: { ...prev.background, filmGrain: parseInt(e.target.value) },
                          }))
                        }
                        className="w-full accent-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: VISUALIZER & SPECTRUM */}
              {activeTab === 'visualizer' && (
                <div className="space-y-5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>Audio Spectrum & Waveform Style</span>
                  </h3>

                  {/* Spectrum Style Cards */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">Spectrum Architecture</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'circular', label: 'Circular Halo' },
                        { id: 'bars', label: 'Vertical Bars' },
                        { id: 'mirrored', label: 'Mirrored Center' },
                        { id: 'bottom-equalizer', label: 'Bottom Equalizer' },
                      ].map((style) => (
                        <button
                          key={style.id}
                          onClick={() =>
                            setComposition((prev) => ({
                              ...prev,
                              visualizer: { ...prev.visualizer, spectrumStyle: style.id as any },
                            }))
                          }
                          className={`p-2.5 rounded-xl border text-center font-bold ${
                            composition.visualizer.spectrumStyle === style.id
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                              : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Waveform Style Cards */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">Time-Domain Waveform</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'smooth-center', label: 'Smooth Bezier Wave' },
                        { id: 'oscilloscope', label: 'CRT Oscilloscope' },
                        { id: 'dual-sided', label: 'Dual-Sided Ribbon' },
                        { id: 'none', label: 'Disabled' },
                      ].map((style) => (
                        <button
                          key={style.id}
                          onClick={() =>
                            setComposition((prev) => ({
                              ...prev,
                              visualizer: { ...prev.visualizer, waveformStyle: style.id as any },
                            }))
                          }
                          className={`p-2.5 rounded-xl border text-center font-bold ${
                            composition.visualizer.waveformStyle === style.id
                              ? 'bg-violet-500/20 border-violet-400 text-violet-300'
                              : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Spectrum Sliders */}
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Frequency Bar Count</span>
                        <span>{composition.visualizer.barCount}</span>
                      </div>
                      <input
                        type="range"
                        min="32"
                        max="128"
                        step="8"
                        value={composition.visualizer.barCount}
                        onChange={(e) =>
                          setComposition((prev) => ({
                            ...prev,
                            visualizer: { ...prev.visualizer, barCount: parseInt(e.target.value) },
                          }))
                        }
                        className="w-full accent-cyan-400"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Maximum Bar Height</span>
                        <span>{composition.visualizer.barMaxHeight}px</span>
                      </div>
                      <input
                        type="range"
                        min="80"
                        max="320"
                        value={composition.visualizer.barMaxHeight}
                        onChange={(e) =>
                          setComposition((prev) => ({
                            ...prev,
                            visualizer: { ...prev.visualizer, barMaxHeight: parseInt(e.target.value) },
                          }))
                        }
                        className="w-full accent-cyan-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CINEMATIC EFFECTS */}
              {activeTab === 'cinematic' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Atmospheric & Beat-Reactive Effects</span>
                  </h3>

                  {/* Toggles */}
                  {[
                    {
                      key: 'floatingParticlesEnabled',
                      label: 'Floating Dust Motes / Stardust',
                      desc: 'Atmospheric motes floating gently across the scene',
                    },
                    {
                      key: 'rainEnabled',
                      label: 'Rainfall & Falling Drops',
                      desc: 'Cinematic rain overlay with customizable wind angle',
                    },
                    {
                      key: 'lightRaysEnabled',
                      label: 'Anamorphic God-Rays & Volumetric Light',
                      desc: 'Subtle light beams shining across the composition',
                    },
                    {
                      key: 'bassScaleEnabled',
                      label: 'Bass-Reactive Camera Scale Zoom',
                      desc: 'Subtle cinematic pulse in sync with low frequency bass kicks',
                    },
                    {
                      key: 'beatLightPulseEnabled',
                      label: 'Beat-Synchronized Ambient Light Pulse',
                      desc: 'Atmospheric light surges on high-energy beat transients',
                    },
                  ].map((fx) => (
                    <div
                      key={fx.key}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-white/5"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{fx.label}</div>
                        <div className="text-[10px] text-slate-400">{fx.desc}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={(composition.cinematicFx as any)[fx.key]}
                        onChange={(e) =>
                          setComposition((prev) => ({
                            ...prev,
                            cinematicFx: {
                              ...prev.cinematicFx,
                              [fx.key]: e.target.checked,
                            },
                          }))
                        }
                        className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: TYPOGRAPHY & TITLES */}
              {activeTab === 'typography' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Type className="w-4 h-4 text-cyan-400" />
                    <span>Title & Artist Typography</span>
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300">Track Title</label>
                      <input
                        type="text"
                        value={composition.textOverlay.title}
                        onChange={(e) =>
                          setComposition((prev) => ({
                            ...prev,
                            textOverlay: { ...prev.textOverlay, title: e.target.value },
                          }))
                        }
                        placeholder="Song / Episode Title"
                        className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300">Artist / Channel Name</label>
                      <input
                        type="text"
                        value={composition.textOverlay.artist}
                        onChange={(e) =>
                          setComposition((prev) => ({
                            ...prev,
                            textOverlay: { ...prev.textOverlay, artist: e.target.value },
                          }))
                        }
                        placeholder="Artist or Creator"
                        className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300">Subtitle / Tagline</label>
                      <input
                        type="text"
                        value={composition.textOverlay.subtitle}
                        onChange={(e) =>
                          setComposition((prev) => ({
                            ...prev,
                            textOverlay: { ...prev.textOverlay, subtitle: e.target.value },
                          }))
                        }
                        placeholder="Official Music Video / Remix"
                        className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-cyan-400 outline-none"
                      />
                    </div>

                    {/* Font & Position */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="text-xs font-bold text-slate-300">Alignment</label>
                        <select
                          value={composition.textOverlay.alignment}
                          onChange={(e) =>
                            setComposition((prev) => ({
                              ...prev,
                              textOverlay: { ...prev.textOverlay, alignment: e.target.value as any },
                            }))
                          }
                          className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none"
                        >
                          <option value="center">Center</option>
                          <option value="left">Left</option>
                          <option value="right">Right</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-300">Position</label>
                        <select
                          value={composition.textOverlay.position}
                          onChange={(e) =>
                            setComposition((prev) => ({
                              ...prev,
                              textOverlay: { ...prev.textOverlay, position: e.target.value as any },
                            }))
                          }
                          className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs outline-none"
                        >
                          <option value="bottom">Bottom</option>
                          <option value="top">Top</option>
                          <option value="middle">Middle</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: AUDIO STATION */}
              {activeTab === 'audio' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Music className="w-4 h-4 text-cyan-400" />
                    <span>Audio Track Station</span>
                  </h3>

                  <input
                    type="file"
                    ref={audioInputRef}
                    onChange={(e) => e.target.files?.[0] && handleAudioFile(e.target.files[0])}
                    accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac"
                    className="hidden"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => audioInputRef.current?.click()}
                      className="p-4 rounded-xl border border-white/10 bg-slate-900 hover:border-cyan-400/50 flex flex-col items-center justify-center gap-2 text-slate-300 hover:text-white transition-all"
                    >
                      <Upload className="w-5 h-5 text-cyan-400" />
                      <span className="text-xs font-bold">Import Audio File</span>
                      <span className="text-[10px] text-slate-500">MP3, WAV, OGG, WebM</span>
                    </button>

                    <button
                      onClick={handleGenerateDemoAudio}
                      className="p-4 rounded-xl border border-violet-500/30 bg-violet-950/20 hover:bg-violet-950/40 flex flex-col items-center justify-center gap-2 text-violet-300 hover:text-white transition-all"
                    >
                      <Sparkles className="w-5 h-5 text-violet-400" />
                      <span className="text-xs font-bold">1-Click Test Demo</span>
                      <span className="text-[10px] text-slate-400">Synthesizes 15s Ambient Beat</span>
                    </button>
                  </div>

                  {/* Loaded Metadata Card */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">File Name:</span>
                      <span className="font-bold text-white truncate max-w-[200px]">{audioTrack.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Duration:</span>
                      <span className="font-bold text-cyan-400">{formatSec(audioTrack.duration)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">File Size:</span>
                      <span className="font-bold text-slate-200">
                        {audioTrack.sizeBytes > 0
                          ? `${(audioTrack.sizeBytes / (1024 * 1024)).toFixed(2)} MB`
                          : 'Procedural'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* EXPORT PROGRESS MODAL                                     */}
        {/* ========================================================= */}
        {isExportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="bg-[#090A0F] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-0.5 mx-auto">
                <div className="w-full h-full bg-[#090A0F] rounded-[14px] flex items-center justify-center">
                  {exportProgress?.status === 'completed' ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  ) : exportProgress?.status === 'error' ? (
                    <AlertCircle className="w-8 h-8 text-red-400" />
                  ) : (
                    <Video className="w-8 h-8 text-cyan-400 animate-pulse" />
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  {exportProgress?.status === 'completed'
                    ? 'Video Export Complete!'
                    : exportProgress?.status === 'error'
                    ? 'Export Encountered an Error'
                    : 'Rendering Cinematic Video...'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {exportProgress?.status === 'completed'
                    ? 'Your video was rendered locally with synchronized audio and forward-seekable duration.'
                    : 'Real-time Canvas and Web Audio recording running directly in your browser.'}
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-400 transition-all duration-300"
                    style={{ width: `${exportProgress?.progressPercent || 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>{exportProgress?.progressPercent || 0}% complete</span>
                  <span>
                    {exportProgress?.status === 'recording' &&
                      `${exportProgress.estimatedRemainingSec}s remaining`}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-3 pt-2">
                {exportProgress?.status === 'completed' ? (
                  <>
                    <a
                      href={exportProgress.blobUrl}
                      download={exportProgress.fileName}
                      className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:from-emerald-500 hover:to-cyan-500 flex items-center gap-2 shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Video (.webm)</span>
                    </a>
                    <button
                      onClick={() => setIsExportModalOpen(false)}
                      className="px-5 py-3 rounded-xl font-bold text-sm bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
                    >
                      Close
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      exportEngineRef.current?.cancel()
                      setIsExportModalOpen(false)
                    }}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 border border-white/10 text-slate-400 hover:text-red-400"
                  >
                    Cancel Export
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SEO DOCUMENTATION & EDUCATIONAL CONTENT GUIDE             */}
        {/* ========================================================= */}
        <div className="bg-[#090A0F] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-8 text-slate-300">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              About Audio to Video Studio
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              <strong>Audio to Video Studio</strong> is IndiaTools' flagship browser-based music video generator.
              It allows musicians, podcast creators, beatmakers, and video editors to transform raw audio files into
              dynamic, high-definition videos with audio-reactive spectrum waveforms, motion photograph slideshows,
              cinematic particle effects, and multi-language typography—entirely within your browser with zero server uploads.
            </p>
          </div>

          {/* 6-Step Quick Start Guide */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">How to Generate Music Videos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  step: '01',
                  title: 'Upload Audio Track',
                  desc: 'Import your song or beat in MP3, WAV, OGG, or WebM format. Or test instantly using our 1-click procedural ambient synthesizer.',
                },
                {
                  step: '02',
                  title: 'Pick Scene & Motion',
                  desc: 'Choose from 12 procedural atmospheric scenes (Night City, Romantic Rain, Ocean Waves) or upload your own photos with Ken Burns motion.',
                },
                {
                  step: '03',
                  title: 'Configure Visualizers',
                  desc: 'Select your preferred spectrum style (Circular Halo, Vertical Bars, Bottom Equalizer) and oscilloscope waveform with custom colors.',
                },
                {
                  step: '04',
                  title: 'Add Cinematic Effects',
                  desc: 'Enable atmospheric rain, floating dust particles, anamorphic god-rays, and beat-reactive camera zoom scale kicks.',
                },
                {
                  step: '05',
                  title: 'Customize Typography',
                  desc: 'Enter your song title, artist name, and subtitle with full support for Malayalam, Tamil, Telugu, Kannada, Hindi, and English.',
                },
                {
                  step: '06',
                  title: 'Export Seekable Video',
                  desc: 'Render your video in 1080p Full HD or 720p Fast HD. Download a complete WebM video file with synchronized audio and duration scrub indexing.',
                },
              ].map((item) => (
                <div key={item.step} className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
                  <span className="text-xs font-black text-cyan-400">{item.step}</span>
                  <div className="text-sm font-bold text-white">{item.title}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-1.5">
                <h4 className="text-xs font-bold text-white">Is my audio or photo uploaded to any server?</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No. 100% of audio decoding, Canvas visualizer animation, and video encoding happens locally in your
                  browser using the Web Audio API and HTML5 MediaRecorder. Your media never leaves your device.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-1.5">
                <h4 className="text-xs font-bold text-white">Can I upload the exported video to YouTube and Instagram?</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Yes! Choose 16:9 for YouTube and desktop displays, 9:16 for Instagram Reels, YouTube Shorts, and
                  TikTok, or 1:1 for square feeds. WebM files are natively accepted by YouTube and social media platforms.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-1.5">
                <h4 className="text-xs font-bold text-white">Does the exported video support timeline seeking?</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Yes. Our export engine injects compliant WebM Duration and Cues indexing tables into the container header,
                  ensuring that VLC, Windows Media Player, QuickTime, and web browsers report accurate duration and allow forward scrubbing.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 space-y-1.5">
                <h4 className="text-xs font-bold text-white">Are Indian language scripts supported?</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Yes. Title overlays fully support Malayalam, Tamil, Telugu, Kannada, Hindi, and English scripts with clean
                  drop shadows and stroke outlines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
