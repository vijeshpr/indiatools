import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Upload,
  Download,
  Sparkles,
  Sliders,
  Tv,
  Smartphone,
  Disc,
  BarChart3,
  Activity,
  Layers,
  Settings,
  Music,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Repeat,
  Eye,
  EyeOff,
  Type,
  Waves,
  Grid,
  Flame,
  Sun,
  Maximize2,
  Film,
  Zap,
  X,
  ChevronDown,
  ChevronUp,
  Palette,
  Plus,
  Trash2,
  Copy,
  ShieldCheck,
  Clock,
  Compass,
  MonitorPlay,
  HelpCircle,
  Check,
  SlidersHorizontal,
} from 'lucide-react'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useToast } from '../components/common/Toast'
import {
  AspectRatio,
  VisualizerPreset,
  ColorTheme,
  BackgroundMode,
  CompositionState,
  TypographyLayer,
  PhotoAsset,
  SupportedLanguage,
  StudioTemplateId,
  ParticlePresetType,
  TextAnimationStyle,
  ASPECT_RATIOS,
  THEME_PALETTES,
  SUPPORTED_LANGUAGES,
  VISUALIZER_ENGINES,
} from '../lib/video/audioVisualizerTypes'
import {
  renderStudioComposition,
  AtmosphericParticleManager,
  PeakHoldManager,
  AudioDspAnalyzer,
} from '../lib/video/audioVisualizerEngine'
import {
  VideoRecorderSession,
  downloadBlob,
  formatTimeDisplay,
  formatTimecode,
  getSupportedVideoMimeType,
} from '../lib/video/videoExportEngine'
import { decodeAudioFile } from '../lib/audio/audioProcessor'
import {
  generateVisualizerDemoSpecimen,
  DEMO_TRACKS,
  DemoAudioGenre,
} from '../lib/video/demoAudioGenerator'
import { STUDIO_TEMPLATES } from '../lib/video/studioTemplates'
import { ensureFontsLoaded } from '../lib/video/typographyEngine'

const INITIAL_TEXT_LAYERS: TypographyLayer[] = [
  {
    id: 'layer-title',
    name: 'Song Title',
    text: 'സന്ധ്യാരാഗം',
    language: 'ml',
    fontFamily: "'Noto Sans Malayalam', sans-serif",
    fontSize: 54,
    fontWeight: 700,
    color: '#ffffff',
    align: 'center',
    xPercent: 50,
    yPercent: 78,
    letterSpacing: 1,
    lineHeight: 1.2,
    opacity: 1,
    rotation: 0,
    hasOutline: false,
    outlineColor: '#000000',
    outlineWidth: 2,
    hasShadow: true,
    shadowColor: 'rgba(0,0,0,0.85)',
    shadowBlur: 16,
    hasGlow: true,
    glowColor: 'rgba(6, 182, 212, 0.7)',
    glowIntensity: 15,
    animationStyle: 'cinematic-reveal',
    animationDuration: 1.5,
    startTime: 0,
    endTime: 9999,
    visible: true,
    locked: false,
    audioReactiveScale: true,
    audioReactiveGlow: true,
  },
  {
    id: 'layer-artist',
    name: 'Artist / Vocalist',
    text: 'അനശ്വര ഗാനങ്ങൾ',
    language: 'ml',
    fontFamily: "'Noto Sans Malayalam', sans-serif",
    fontSize: 26,
    fontWeight: 600,
    color: '#38bdf8',
    align: 'center',
    xPercent: 50,
    yPercent: 84,
    letterSpacing: 2,
    lineHeight: 1.2,
    opacity: 0.95,
    rotation: 0,
    hasOutline: false,
    outlineColor: '#000000',
    outlineWidth: 2,
    hasShadow: true,
    shadowColor: 'rgba(0,0,0,0.8)',
    shadowBlur: 10,
    hasGlow: false,
    glowColor: 'rgba(6, 182, 212, 0.5)',
    glowIntensity: 10,
    animationStyle: 'masked-slide',
    animationDuration: 1.2,
    startTime: 0.3,
    endTime: 9999,
    visible: true,
    locked: false,
    audioReactiveScale: false,
    audioReactiveGlow: false,
  },
  {
    id: 'layer-channel',
    name: 'Channel Tag',
    text: '@indiatools_official',
    language: 'en',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 16,
    fontWeight: 500,
    color: '#94a3b8',
    align: 'center',
    xPercent: 50,
    yPercent: 89,
    letterSpacing: 3,
    lineHeight: 1.2,
    opacity: 0.8,
    rotation: 0,
    hasOutline: false,
    outlineColor: '#000000',
    outlineWidth: 1,
    hasShadow: false,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowBlur: 5,
    hasGlow: false,
    glowColor: 'rgba(0,0,0,0)',
    glowIntensity: 0,
    animationStyle: 'cinematic-reveal',
    animationDuration: 1.0,
    startTime: 0.6,
    endTime: 9999,
    visible: true,
    locked: false,
    audioReactiveScale: false,
    audioReactiveGlow: false,
  },
]

export const AudioSpectrumVideoTool: React.FC = () => {
  const tool = getToolBySlug('audio-spectrum-waveform-video-generator')!
  const { showToast } = useToast()

  // Audio Playback & Decoding State
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(16)
  const [volume, setVolume] = useState<number>(1.0)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isLooping, setIsLooping] = useState<boolean>(true)
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false)
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false)
  const [audioTitle, setAudioTitle] = useState<string>('Golden Hour Reflections')

  // Composition State
  const [state, setState] = useState<CompositionState>({
    version: 2,
    aspectRatio: '9:16',
    fps: 60,
    duration: 16,
    currentTime: 0,
    trimStart: 0,
    trimEnd: 16,
    isPlaying: false,
    isLooping: true,
    volume: 1.0,
    isMuted: false,

    activeTemplateId: 'cinematic-portrait',
    activePreset: 'circular-harmonic-spectrum',
    theme: 'neon-cyber',
    backgroundMode: 'blurred-cover',

    fftSize: 2048,
    smoothing: 0.82,
    sensitivity: 1.25,
    bassSensitivity: 1.35,
    trebleSensitivity: 1.0,
    barCount: 64,

    photos: [],
    activePhotoIndex: 0,
    imageLayoutMode: 'album-disc',
    slideshowTransition: 'crossfade',
    slideshowSpeed: 4,
    enableVinylRotation: true,

    particlePreset: 'floating-dust',
    fx: {
      cameraDrift: 30,
      cameraBassShake: 15,
      bloomGlow: 35,
      filmGrain: 15,
      chromaticAberration: 12,
      vignette: 45,
      scanlines: 0,
      lightLeaks: 20,
      colorGrading: 'vintage-warm',
    },

    textLayers: INITIAL_TEXT_LAYERS,
    selectedLayerId: 'layer-title',

    branding: {
      enabled: false,
      text: 'Made with IndiaTools',
      subtext: 'Free Music Video Studio',
      showToolUrl: true,
      position: 'bottom-center',
    },
  })

  // Studio UI Navigation State
  const [activeTab, setActiveTab] = useState<'visualizers' | 'templates' | 'typography' | 'fx' | 'media'>('visualizers')
  const [visualizerCategory, setVisualizerCategory] = useState<string>('all')
  const [templateCategory, setTemplateCategory] = useState<string>('all')
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('ml')
  const [showSafeZones, setShowSafeZones] = useState<boolean>(false)

  // Export State
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [targetExportLength, setTargetExportLength] = useState<'15s' | '30s' | '60s' | 'full'>('15s')
  const [exportFps, setExportFps] = useState<30 | 60>(60)
  const [exportProgress, setExportProgress] = useState<{
    percent: number
    elapsedSec: number
    remainingSec: number
  }>({ percent: 0, elapsedSec: 0, remainingSec: 0 })

  // Photo image DOM element cache
  const [photoImages, setPhotoImages] = useState<HTMLImageElement[]>([])

  // Engine references
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const destinationNodeRef = useRef<MediaStreamAudioDestinationNode | null>(null)
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null)
  const playbackStartTimeRef = useRef<number>(0)
  const playbackStartOffsetRef = useRef<number>(0)
  const animationFrameRef = useRef<number | null>(null)

  const dspAnalyzerRef = useRef<AudioDspAnalyzer>(new AudioDspAnalyzer())
  const peakHoldManagerRef = useRef<PeakHoldManager>(new PeakHoldManager())
  const particleManagerRef = useRef<AtmosphericParticleManager>(new AtmosphericParticleManager('floating-dust', 60))
  const recorderSessionRef = useRef<VideoRecorderSession | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const photoInputRef = useRef<HTMLInputElement | null>(null)

  // Load Google Fonts on component mount
  useEffect(() => {
    ensureFontsLoaded()
  }, [])

  // Sync particle preset with manager
  useEffect(() => {
    particleManagerRef.current.setPreset(state.particlePreset)
  }, [state.particlePreset])

  // Master AudioContext initializer
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioCtx()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = state.fftSize
      analyser.smoothingTimeConstant = state.smoothing

      const gain = ctx.createGain()
      gain.gain.value = isMuted ? 0 : volume

      const dest = ctx.createMediaStreamDestination()

      analyser.connect(gain)
      gain.connect(ctx.destination)
      gain.connect(dest)

      audioContextRef.current = ctx
      analyserRef.current = analyser
      gainNodeRef.current = gain
      destinationNodeRef.current = dest
    }
    return audioContextRef.current
  }, [state.fftSize, state.smoothing, isMuted, volume])

  // Volume & Mute listener
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      const val = isMuted ? 0 : volume
      gainNodeRef.current.gain.setValueAtTime(val, audioContextRef.current.currentTime)
    }
  }, [volume, isMuted])

  // FFT tuning listener
  useEffect(() => {
    if (analyserRef.current) {
      analyserRef.current.fftSize = state.fftSize
      analyserRef.current.smoothingTimeConstant = state.smoothing
    }
  }, [state.fftSize, state.smoothing])

  // Stop audio playback
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

  // Play audio from specific second offset
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

  // Toggle play/pause
  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      pauseAudio()
    } else {
      playFromOffset(playbackStartOffsetRef.current)
    }
  }, [isPlaying, pauseAudio, playFromOffset])

  // Spacebar hotkey for Play/Pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return
      }

      if (e.code === 'Space') {
        e.preventDefault()
        handleTogglePlay()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleTogglePlay])

  // Handle Seek scrubber
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
        const { buffer } = await decodeAudioFile(file)
        setAudioFile(file)
        setAudioBuffer(buffer)
        setDuration(buffer.duration)
        setCurrentTime(0)
        playbackStartOffsetRef.current = 0

        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        setAudioTitle(cleanName)

        // Update layer title
        setState((prev) => ({
          ...prev,
          duration: buffer.duration,
          trimEnd: buffer.duration,
          textLayers: prev.textLayers.map((l) =>
            l.id === 'layer-title' ? { ...l, text: cleanName } : l
          ),
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

  // Handle Demo Track Selection
  const handleLoadDemo = useCallback(
    async (genre: DemoAudioGenre) => {
      stopAllAudio()
      setIsLoadingAudio(true)
      try {
        const demoMeta = DEMO_TRACKS.find((t) => t.id === genre) || DEMO_TRACKS[0]
        showToast(`Generating instant ${demoMeta.name}...`, 'info')
        const file = await generateVisualizerDemoSpecimen(genre)
        await handleLoadAudioFile(file)

        // Apply matching template
        if (genre === 'synthwave') {
          applyStudioTemplate('neon-night')
        } else if (genre === 'lofi') {
          applyStudioTemplate('lofi-night')
        } else {
          applyStudioTemplate('cinematic-portrait')
        }

        showToast(`Sample track ready! Press Play or Spacebar to watch.`, 'success')
      } catch (err: any) {
        showToast('Could not synthesize sample track.', 'error')
      } finally {
        setIsLoadingAudio(false)
      }
    },
    [stopAllAudio, handleLoadAudioFile, showToast]
  )

  // Handle Artwork Photo Selection
  const handlePhotoUpload = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return

      const newPhotos: PhotoAsset[] = []
      const newImages: HTMLImageElement[] = []

      Array.from(files).forEach((file, index) => {
        const url = URL.createObjectURL(file)
        const img = new Image()
        img.src = url
        img.onload = () => {
          setPhotoImages((prev) => [...prev, img])
        }

        newPhotos.push({
          id: `photo-${Date.now()}-${index}`,
          file,
          url,
          name: file.name,
          width: 1080,
          height: 1080,
          duration: 4,
          crop: { x: 0, y: 0, zoom: 1, rotation: 0 },
          filters: { brightness: 100, contrast: 100, saturation: 100, warmth: 0, vignette: 0 },
        })
      })

      setState((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos],
      }))
      showToast(`${files.length} photo(s) added successfully!`, 'success')
    },
    [showToast]
  )

  // Apply One-Click Studio Template
  const applyStudioTemplate = useCallback(
    (templateId: StudioTemplateId) => {
      const t = STUDIO_TEMPLATES[templateId]
      if (!t) return

      const sampleTitle = t.sampleTitle[currentLanguage] || t.sampleTitle.en
      const sampleArtist = t.sampleArtist[currentLanguage] || t.sampleArtist.en

      setState((prev) => ({
        ...prev,
        activeTemplateId: templateId,
        activePreset: t.preset,
        theme: t.theme,
        backgroundMode: t.backgroundMode,
        particlePreset: t.particlePreset,
        fx: { ...t.fx },
        textLayers: prev.textLayers.map((layer) => {
          if (layer.id === 'layer-title') {
            return { ...layer, text: sampleTitle, language: currentLanguage }
          }
          if (layer.id === 'layer-artist') {
            return { ...layer, text: sampleArtist, language: currentLanguage }
          }
          return layer
        }),
      }))

      showToast(`Applied preset: ${t.name}`, 'info')
    },
    [currentLanguage, showToast]
  )

  // Language switcher: updates template text to native scripts
  const handleSwitchLanguage = useCallback(
    (lang: SupportedLanguage) => {
      setCurrentLanguage(lang)
      const currentTemplate = STUDIO_TEMPLATES[state.activeTemplateId]
      const fontMeta = SUPPORTED_LANGUAGES[lang]

      if (currentTemplate) {
        const sampleTitle = currentTemplate.sampleTitle[lang] || currentTemplate.sampleTitle.en
        const sampleArtist = currentTemplate.sampleArtist[lang] || currentTemplate.sampleArtist.en

        setState((prev) => ({
          ...prev,
          textLayers: prev.textLayers.map((layer) => {
            if (layer.id === 'layer-title') {
              return {
                ...layer,
                text: sampleTitle,
                language: lang,
                fontFamily: fontMeta.defaultFont,
              }
            }
            if (layer.id === 'layer-artist') {
              return {
                ...layer,
                text: sampleArtist,
                language: lang,
                fontFamily: fontMeta.defaultFont,
              }
            }
            return layer
          }),
        }))
      }
      showToast(`Switched typography script to ${fontMeta.nativeName} (${fontMeta.name})`, 'info')
    },
    [state.activeTemplateId, showToast]
  )

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopAllAudio()
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (recorderSessionRef.current) {
        recorderSessionRef.current.cancel()
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close()
        } catch {
          // ignore
        }
      }
    }
  }, [stopAllAudio])

  // Canvas Main Render Loop (60 FPS)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dim = ASPECT_RATIOS[state.aspectRatio]
    if (canvas.width !== dim.width || canvas.height !== dim.height) {
      canvas.width = dim.width
      canvas.height = dim.height
    }

    let isRunning = true
    const freqData = new Uint8Array(state.fftSize / 2)
    const timeData = new Uint8Array(state.fftSize / 2)

    const render = () => {
      if (!isRunning) return

      const width = canvas.width
      const height = canvas.height
      const nowSec = performance.now() / 1000

      // Compute precise current playback time
      let renderTime = currentTime
      if (isPlaying && audioContextRef.current) {
        const elapsed = audioContextRef.current.currentTime - playbackStartTimeRef.current
        renderTime = Math.min(duration, playbackStartOffsetRef.current + elapsed)
        setCurrentTime(renderTime)
      }

      // Extract frequency and time domain data from Web Audio Analyser
      if (analyserRef.current && isPlaying) {
        analyserRef.current.getByteFrequencyData(freqData)
        analyserRef.current.getByteTimeDomainData(timeData)
      } else {
        // Idle breathing visualizer movement when audio is paused
        for (let i = 0; i < freqData.length; i++) {
          freqData[i] = Math.max(0, Math.sin(nowSec * 2.2 + i * 0.12) * 32 + 18)
        }
        for (let i = 0; i < timeData.length; i++) {
          timeData[i] = 128 + Math.sin(nowSec * 3 + i * 0.06) * 8
        }
      }

      // Advanced DSP 6-band logarithmic envelope analysis
      const bands = dspAnalyzerRef.current.analyze(freqData, renderTime)

      // Master Studio Composition Frame Rendering
      const compositionStateSnapshot: CompositionState = {
        ...state,
        currentTime: renderTime,
        isPlaying,
      }

      renderStudioComposition(
        ctx,
        compositionStateSnapshot,
        freqData,
        timeData,
        bands,
        peakHoldManagerRef.current,
        particleManagerRef.current,
        photoImages,
        width,
        height
      )

      // Optional Safe-Zones Guide Overlay (Reels / Shorts engagement buttons and caption safety)
      if (showSafeZones && state.aspectRatio === '9:16') {
        drawReelsSafeZoneOverlay(ctx, width, height)
      }

      animationFrameRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      isRunning = false
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [state, isPlaying, duration, photoImages, showSafeZones])

  // Helper: Draw Safe-Zones Overlay
  const drawReelsSafeZoneOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save()

    // Semi-transparent safe zone bounding guide
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.75)'
    ctx.lineWidth = 3
    ctx.setLineDash([8, 8])

    const safeTop = height * 0.14
    const safeBottom = height * 0.8
    const safeRight = width * 0.82
    const safeLeft = width * 0.08

    ctx.strokeRect(safeLeft, safeTop, safeRight - safeLeft, safeBottom - safeTop)

    // Instagram Reels icons zone (Right Side)
    ctx.fillStyle = 'rgba(239, 68, 68, 0.18)'
    ctx.fillRect(safeRight, safeTop, width - safeRight, safeBottom - safeTop)

    // Bottom caption zone
    ctx.fillStyle = 'rgba(239, 68, 68, 0.18)'
    ctx.fillRect(0, safeBottom, width, height - safeBottom)

    // Header profile zone
    ctx.fillStyle = 'rgba(239, 68, 68, 0.18)'
    ctx.fillRect(0, 0, width, safeTop)

    // Text label
    ctx.setLineDash([])
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('⚡ REELS / SHORTS SAFE ZONE (Keep text inside dashed box)', width / 2, safeTop - 20)

    ctx.restore()
  }

  // Handle Video Recording & Export Execution
  const handleStartExport = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) {
      showToast('Canvas render engine is not ready.', 'error')
      return
    }

    if (!audioBuffer) {
      showToast('Please upload an audio track or load a demo before exporting.', 'error')
      return
    }

    const ctx = getAudioContext()
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
    setExportProgress({ percent: 0, elapsedSec: 0, remainingSec: targetSeconds })

    const session = new VideoRecorderSession({
      canvas,
      audioDestination: dest,
      fps: exportFps,
      bitrate: 7_000_000,
      duration: targetSeconds,
      onStart: () => {
        showToast('Exporting high-definition video with A/V sync...', 'info')
      },
      onProgress: (info) => {
        setExportProgress({
          percent: info.percent,
          elapsedSec: info.elapsedSec,
          remainingSec: info.remainingSec,
        })
      },
      onComplete: (blob, ext) => {
        setIsRecording(false)
        stopAllAudio()

        const cleanTitle = (audioTitle || 'music_video').replace(/[^a-zA-Z0-9_-]/g, '_')
        const filename = `IndiaTools_${cleanTitle}_${state.activePreset}_${state.aspectRatio.replace(':', 'x')}.${ext}`
        downloadBlob(blob, filename)

        const mb = (blob.size / (1024 * 1024)).toFixed(2)
        showToast(`Video exported successfully! (${mb} MB .${ext})`, 'success')
        setIsExportModalOpen(false)
      },
      onError: (err) => {
        setIsRecording(false)
        stopAllAudio()
        showToast(`Export failed: ${err.message}`, 'error')
      },
    })

    recorderSessionRef.current = session

    // Rewind to 0 and begin capture
    await playFromOffset(0)
    session.start()
  }, [audioBuffer, targetExportLength, exportFps, audioTitle, state.activePreset, state.aspectRatio, getAudioContext, playFromOffset, stopAllAudio, showToast])

  // Cancel video export
  const handleCancelExport = useCallback(() => {
    if (recorderSessionRef.current) {
      recorderSessionRef.current.cancel()
    }
    stopAllAudio()
    setIsRecording(false)
    showToast('Export cancelled.', 'info')
  }, [stopAllAudio, showToast])

  // Selected typography layer accessor
  const selectedLayer = useMemo(() => {
    return state.textLayers.find((l) => l.id === state.selectedLayerId) || state.textLayers[0]
  }, [state.textLayers, state.selectedLayerId])

  // Update selected typography layer property
  const updateSelectedLayer = (updates: Partial<TypographyLayer>) => {
    if (!selectedLayer) return
    setState((prev) => ({
      ...prev,
      textLayers: prev.textLayers.map((l) =>
        l.id === selectedLayer.id ? { ...l, ...updates } : l
      ),
    }))
  }

  // Filtered visualizers
  const filteredVisualizers = useMemo(() => {
    if (visualizerCategory === 'all') return VISUALIZER_ENGINES
    return VISUALIZER_ENGINES.filter((e) => e.category === visualizerCategory)
  }, [visualizerCategory])

  // Filtered templates
  const templateList = useMemo(() => {
    const all = Object.values(STUDIO_TEMPLATES)
    if (templateCategory === 'all') return all
    return all.filter((t) => t.category === templateCategory)
  }, [templateCategory])

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {/* Top Studio Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl shadow-2xl flex flex-wrap items-center justify-between gap-4">
          {/* Aspect Ratio selector */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setState((p) => ({ ...p, aspectRatio: '9:16' }))}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                state.aspectRatio === '9:16'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              9:16 Reels / Shorts
            </button>
            <button
              onClick={() => setState((p) => ({ ...p, aspectRatio: '1:1' }))}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                state.aspectRatio === '1:1'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Disc className="w-3.5 h-3.5" />
              1:1 Square
            </button>
            <button
              onClick={() => setState((p) => ({ ...p, aspectRatio: '16:9' }))}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                state.aspectRatio === '16:9'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              16:9 Landscape
            </button>
          </div>

          {/* Center quick toggles */}
          <div className="flex items-center gap-3">
            {/* Safe-Zones toggle for 9:16 */}
            {state.aspectRatio === '9:16' && (
              <button
                onClick={() => setShowSafeZones(!showSafeZones)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  showSafeZones
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
                title="Toggle Instagram Reels & YouTube Shorts safe-zone guides"
              >
                {showSafeZones ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                Safe Zones
              </button>
            )}

            {/* FPS Selector */}
            <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs">
              <span className="px-2 text-slate-400 font-medium">FPS</span>
              {[30, 60].map((f) => (
                <button
                  key={f}
                  onClick={() => setState((p) => ({ ...p, fps: f as any }))}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                    state.fps === f ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Language Quick Switcher */}
            <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs">
              {(['ml', 'en', 'te', 'kn', 'ta'] as SupportedLanguage[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleSwitchLanguage(lang)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    currentLanguage === lang
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {SUPPORTED_LANGUAGES[lang].nativeName}
                </button>
              ))}
            </div>
          </div>

          {/* Export Video Button */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/35 transition-all transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" />
            Export Video
          </button>
        </div>

        {/* Workspace Split Layout: Controls on Left, Preview on Center/Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Tabbed Control Dock (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-xl shadow-xl flex flex-col min-h-[680px]">
            {/* Dock Tabs Header */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-5 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('visualizers')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'visualizers'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Activity className="w-4 h-4" />
                20 Visualizers
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'templates'
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                20 Templates
              </button>
              <button
                onClick={() => setActiveTab('typography')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'typography'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Type className="w-4 h-4" />
                Typography & Lyrics
              </button>
              <button
                onClick={() => setActiveTab('fx')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'fx'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Cinematic FX
              </button>
              <button
                onClick={() => setActiveTab('media')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'media'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Music className="w-4 h-4" />
                Audio & Photo
              </button>
            </div>

            {/* TAB CONTENT 1: VISUALIZERS (20 Distinct Engines) */}
            {activeTab === 'visualizers' && (
              <div className="space-y-5 flex-1 overflow-y-auto pr-1">
                {/* Category filter pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['all', 'radial', 'linear', 'cinematic', 'minimal', 'hud', 'particle'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setVisualizerCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                        visualizerCategory === cat
                          ? 'bg-slate-800 text-white border border-slate-700'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Grid of Visualizer Engines */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                  {filteredVisualizers.map((engine) => {
                    const isSelected = state.activePreset === engine.id
                    return (
                      <div
                        key={engine.id}
                        onClick={() => setState((p) => ({ ...p, activePreset: engine.id }))}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/40'
                            : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Activity className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                            {engine.name}
                          </span>
                          <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            {engine.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {engine.description}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {/* Fine-Tuning Sliders for Current Engine */}
                <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    Fine-Tune Visualizer Dynamics
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Audio Sensitivity</span>
                        <span className="font-mono text-cyan-400">{state.sensitivity.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.05"
                        value={state.sensitivity}
                        onChange={(e) => setState((p) => ({ ...p, sensitivity: parseFloat(e.target.value) }))}
                        className="w-full accent-cyan-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Bass Reactivity</span>
                        <span className="font-mono text-cyan-400">{state.bassSensitivity.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.05"
                        value={state.bassSensitivity}
                        onChange={(e) => setState((p) => ({ ...p, bassSensitivity: parseFloat(e.target.value) }))}
                        className="w-full accent-cyan-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>FFT Bar Count</span>
                        <span className="font-mono text-cyan-400">{state.barCount} bars</span>
                      </div>
                      <input
                        type="range"
                        min="32"
                        max="160"
                        step="8"
                        value={state.barCount}
                        onChange={(e) => setState((p) => ({ ...p, barCount: parseInt(e.target.value) }))}
                        className="w-full accent-cyan-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>DSP Smoothing</span>
                        <span className="font-mono text-cyan-400">{state.smoothing.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.3"
                        max="0.95"
                        step="0.02"
                        value={state.smoothing}
                        onChange={(e) => setState((p) => ({ ...p, smoothing: parseFloat(e.target.value) }))}
                        className="w-full accent-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: 20 ONE-CLICK STUDIO TEMPLATES */}
            {activeTab === 'templates' && (
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                {/* Category filter */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['all', 'Cinematic', 'Electronic', 'Mood', 'Indian Traditional', 'Minimal'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setTemplateCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                        templateCategory === cat
                          ? 'bg-violet-900/60 text-violet-200 border border-violet-500/40'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {templateList.map((tpl) => {
                    const isSelected = state.activeTemplateId === tpl.id
                    return (
                      <div
                        key={tpl.id}
                        onClick={() => applyStudioTemplate(tpl.id)}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-violet-950/40 border-violet-500/60 shadow-lg shadow-violet-950/50 ring-1 ring-violet-500/40'
                            : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-bold text-white flex items-center gap-1.5">
                            <Sparkles className={`w-4 h-4 ${isSelected ? 'text-violet-400' : 'text-slate-400'}`} />
                            {tpl.name}
                          </span>
                          <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-violet-900/40 text-violet-300 border border-violet-700/40">
                            {tpl.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                          {tpl.subtitle}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                          <span className="capitalize">{tpl.theme.replace('-', ' ')}</span>
                          <span>•</span>
                          <span className="capitalize">{tpl.particlePreset.replace('-', ' ')}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: MULTI-LANGUAGE TYPOGRAPHY & LYRICS */}
            {activeTab === 'typography' && (
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                {/* 5 Languages Selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-2">
                    Typography Script & Native Grapheme Cluster Engine:
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {(['ml', 'en', 'te', 'kn', 'ta'] as SupportedLanguage[]).map((lang) => {
                      const isCurrent = currentLanguage === lang
                      return (
                        <button
                          key={lang}
                          onClick={() => handleSwitchLanguage(lang)}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            isCurrent
                              ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 shadow-md shadow-amber-950/40 font-bold'
                              : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <div className="text-sm">{SUPPORTED_LANGUAGES[lang].nativeName}</div>
                          <div className="text-[10px] text-slate-500 uppercase">{SUPPORTED_LANGUAGES[lang].name}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Text Layers Selector */}
                <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {state.textLayers.map((layer) => (
                      <button
                        key={layer.id}
                        onClick={() => setState((p) => ({ ...p, selectedLayerId: layer.id }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedLayer?.id === layer.id
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {layer.name}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const newId = `layer-lyric-${Date.now()}`
                      const newLayer: TypographyLayer = {
                        id: newId,
                        name: 'New Lyric Layer',
                        text: currentLanguage === 'ml' ? 'ഹൃദയത്തിൽ തൊടുന്ന വരികൾ' : 'Melodic Acoustic Echo',
                        language: currentLanguage,
                        fontFamily: SUPPORTED_LANGUAGES[currentLanguage].defaultFont,
                        fontSize: 32,
                        fontWeight: 600,
                        color: '#ffffff',
                        align: 'center',
                        xPercent: 50,
                        yPercent: 70,
                        letterSpacing: 1,
                        lineHeight: 1.2,
                        opacity: 1,
                        rotation: 0,
                        hasOutline: false,
                        outlineColor: '#000000',
                        outlineWidth: 2,
                        hasShadow: true,
                        shadowColor: 'rgba(0,0,0,0.8)',
                        shadowBlur: 10,
                        hasGlow: true,
                        glowColor: 'rgba(234, 179, 8, 0.6)',
                        glowIntensity: 12,
                        animationStyle: 'cinematic-reveal',
                        animationDuration: 1.2,
                        startTime: 0,
                        endTime: 9999,
                        visible: true,
                        locked: false,
                        audioReactiveScale: true,
                        audioReactiveGlow: true,
                      }
                      setState((p) => ({
                        ...p,
                        textLayers: [...p.textLayers, newLayer],
                        selectedLayerId: newId,
                      }))
                      showToast('Lyric layer added.', 'success')
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Layer
                  </button>
                </div>

                {/* Selected Layer Inspector */}
                {selectedLayer && (
                  <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-slate-400">
                        Editing: {selectedLayer.name}
                      </span>
                      {selectedLayer.id.startsWith('layer-lyric') && (
                        <button
                          onClick={() => {
                            setState((p) => ({
                              ...p,
                              textLayers: p.textLayers.filter((l) => l.id !== selectedLayer.id),
                              selectedLayerId: p.textLayers[0]?.id || null,
                            }))
                            showToast('Layer deleted.', 'info')
                          }}
                          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      )}
                    </div>

                    {/* Text Input (Supports Indic scripts directly) */}
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Text String (Unicode Indic Safe):</label>
                      <input
                        type="text"
                        value={selectedLayer.text}
                        onChange={(e) => updateSelectedLayer({ text: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                        placeholder="Enter text in Malayalam, Telugu, Kannada, Tamil, or English..."
                      />
                    </div>

                    {/* Font & Animation controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="text-slate-300 block mb-1">Font Family:</label>
                        <select
                          value={selectedLayer.fontFamily}
                          onChange={(e) => updateSelectedLayer({ fontFamily: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        >
                          {SUPPORTED_LANGUAGES[selectedLayer.language || currentLanguage]?.availableFonts.map((f) => (
                            <option key={f.id} value={f.family}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-300 block mb-1">Motion Graphics Animation:</label>
                        <select
                          value={selectedLayer.animationStyle}
                          onChange={(e) => updateSelectedLayer({ animationStyle: e.target.value as TextAnimationStyle })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        >
                          <option value="cinematic-reveal">Cinematic Reveal (Fade + Track)</option>
                          <option value="neon-glow">Neon Electric Glow Pulse</option>
                          <option value="gold-luxury">Gold Luxury Shimmer</option>
                          <option value="grapheme-reveal">Indic Grapheme Cluster Unfurl</option>
                          <option value="word-by-word">Word-by-Word Karaoke Flow</option>
                          <option value="glitch-title">Cybernetic Transient Glitch</option>
                          <option value="blur-to-sharp">Camera Defocus to Sharp</option>
                          <option value="beat-pulse">Beat-Reactive Scale Bounce</option>
                        </select>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Font Size:</span>
                          <span className="font-mono text-amber-400">{selectedLayer.fontSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="16"
                          max="96"
                          value={selectedLayer.fontSize}
                          onChange={(e) => updateSelectedLayer({ fontSize: parseInt(e.target.value) })}
                          className="w-full accent-amber-500"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Vertical Position (Y%):</span>
                          <span className="font-mono text-amber-400">{selectedLayer.yPercent}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="95"
                          value={selectedLayer.yPercent}
                          onChange={(e) => updateSelectedLayer({ yPercent: parseInt(e.target.value) })}
                          className="w-full accent-amber-500"
                        />
                      </div>
                    </div>

                    {/* Audio Reactivity Toggles */}
                    <div className="flex items-center gap-4 pt-2 border-t border-slate-800 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                        <input
                          type="checkbox"
                          checked={selectedLayer.audioReactiveScale}
                          onChange={(e) => updateSelectedLayer({ audioReactiveScale: e.target.checked })}
                          className="accent-amber-500 rounded"
                        />
                        Bass Beat Pulse (Scale Bounce)
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                        <input
                          type="checkbox"
                          checked={selectedLayer.audioReactiveGlow}
                          onChange={(e) => updateSelectedLayer({ audioReactiveGlow: e.target.checked })}
                          className="accent-amber-500 rounded"
                        />
                        Treble Reactive Glow
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 4: CINEMATIC FX & BACKGROUND */}
            {activeTab === 'fx' && (
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                {/* Background Mode & Color Theme */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Background Mode:</label>
                    <select
                      value={state.backgroundMode}
                      onChange={(e) => setState((p) => ({ ...p, backgroundMode: e.target.value as BackgroundMode }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="blurred-cover">Blurred Cover Backdrop</option>
                      <option value="cyber-grid">Cyberpunk 3D Perspective Grid</option>
                      <option value="deep-space">Deep Celestial Space Gradient</option>
                      <option value="dark-studio">Minimal Obsidian Studio</option>
                      <option value="gradient-pulse">Audio-Reactive Bass Pulse</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Color Palette Theme:</label>
                    <select
                      value={state.theme}
                      onChange={(e) => setState((p) => ({ ...p, theme: e.target.value as ColorTheme }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="neon-cyber">Neon Cyber (Cyan & Magenta)</option>
                      <option value="electric-violet">Electric Violet</option>
                      <option value="sunset-ember">Sunset Ember (Orange & Amber)</option>
                      <option value="aurora-emerald">Aurora Emerald</option>
                      <option value="matrix-glow">Matrix Hacker Green</option>
                      <option value="gold-luxury">Gold Luxury</option>
                      <option value="monochrome-silver">Monochrome Silver Platinum</option>
                      <option value="crimson-cinema">Crimson Cinema</option>
                      <option value="ocean-sapphire">Ocean Sapphire</option>
                      <option value="cherry-blossom">Cherry Blossom Pastel</option>
                    </select>
                  </div>
                </div>

                {/* Atmospheric Particles */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Atmospheric Particle Preset:</label>
                  <select
                    value={state.particlePreset}
                    onChange={(e) => setState((p) => ({ ...p, particlePreset: e.target.value as ParticlePresetType }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="floating-dust">Floating Dust Motes (Lo-Fi Acoustic)</option>
                    <option value="rising-embers">Rising Flame Embers (Phonk / Trap)</option>
                    <option value="monsoon-rain">Monsoon Rain Streaks (Kerala / Romantic)</option>
                    <option value="cosmic-stardust">Cosmic Stardust (Ambient / Sci-Fi)</option>
                    <option value="sakura-petals">Falling Sakura Petals</option>
                    <option value="none">Disabled (Clean Minimal)</option>
                  </select>
                </div>

                {/* Camera & Post-FX Sliders */}
                <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-3.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Film className="w-3.5 h-3.5 text-rose-400" />
                    Camera & Optical Post-Processing
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>2.5D Camera Drift (Ken Burns)</span>
                        <span className="font-mono text-rose-400">{state.fx.cameraDrift}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={state.fx.cameraDrift}
                        onChange={(e) =>
                          setState((p) => ({ ...p, fx: { ...p.fx, cameraDrift: parseInt(e.target.value) } }))
                        }
                        className="w-full accent-rose-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Bass Impact Camera Shake</span>
                        <span className="font-mono text-rose-400">{state.fx.cameraBassShake}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={state.fx.cameraBassShake}
                        onChange={(e) =>
                          setState((p) => ({ ...p, fx: { ...p.fx, cameraBassShake: parseInt(e.target.value) } }))
                        }
                        className="w-full accent-rose-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Procedural Film Grain</span>
                        <span className="font-mono text-rose-400">{state.fx.filmGrain}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={state.fx.filmGrain}
                        onChange={(e) =>
                          setState((p) => ({ ...p, fx: { ...p.fx, filmGrain: parseInt(e.target.value) } }))
                        }
                        className="w-full accent-rose-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Transient Chromatic Aberration</span>
                        <span className="font-mono text-rose-400">{state.fx.chromaticAberration}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={state.fx.chromaticAberration}
                        onChange={(e) =>
                          setState((p) => ({ ...p, fx: { ...p.fx, chromaticAberration: parseInt(e.target.value) } }))
                        }
                        className="w-full accent-rose-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Cinematic Vignette</span>
                        <span className="font-mono text-rose-400">{state.fx.vignette}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={state.fx.vignette}
                        onChange={(e) =>
                          setState((p) => ({ ...p, fx: { ...p.fx, vignette: parseInt(e.target.value) } }))
                        }
                        className="w-full accent-rose-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 block mb-1">Color Grading LUT:</label>
                      <select
                        value={state.fx.colorGrading}
                        onChange={(e) =>
                          setState((p) => ({ ...p, fx: { ...p.fx, colorGrading: e.target.value as any } }))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
                      >
                        <option value="neutral">Neutral Direct Pass</option>
                        <option value="teal-orange">Teal & Orange Hollywood</option>
                        <option value="vintage-warm">Vintage Golden Warmth</option>
                        <option value="cyber-cool">Cyber Cool Neon Tint</option>
                        <option value="noir">Classic Black & White Noir</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 5: AUDIO & PHOTO ASSETS */}
            {activeTab === 'media' && (
              <div className="space-y-5 flex-1 overflow-y-auto pr-1">
                {/* Audio Upload Box */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Audio File (MP3, WAV, AAC, M4A, OGG, FLAC):
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDraggingOver(true)
                    }}
                    onDragLeave={() => setIsDraggingOver(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setIsDraggingOver(false)
                      if (e.dataTransfer.files?.[0]) {
                        handleLoadAudioFile(e.dataTransfer.files[0])
                      }
                    }}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      isDraggingOver
                        ? 'border-emerald-500 bg-emerald-950/20'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-900/40'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleLoadAudioFile(e.target.files[0])
                      }}
                    />
                    <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-white mb-1">
                      {audioFile ? audioFile.name : 'Click to Upload Audio or Drag & Drop'}
                    </p>
                    <p className="text-xs text-slate-400">
                      100% Client-Side. Never uploaded to any external server.
                    </p>
                  </div>
                </div>

                {/* 3 Instant Demo Audio Synthesizers */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    No Audio File? Synthesize Instant Demo Track (Zero External Assets):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {DEMO_TRACKS.map((t) => (
                      <button
                        key={t.id}
                        disabled={isLoadingAudio}
                        onClick={() => handleLoadDemo(t.id)}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-950/20 text-left transition-all"
                      >
                        <div className="text-xs font-bold text-white mb-0.5 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-emerald-400" />
                          {t.name}
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                          {t.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Artwork Photo Upload */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Cover Artwork / Center Photo:
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => photoInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 transition-all border border-slate-700"
                    >
                      <ImageIcon className="w-4 h-4 text-cyan-400" />
                      Upload Cover Photo
                    </button>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handlePhotoUpload(e.target.files)}
                    />
                    <div className="text-xs text-slate-400">
                      {photoImages.length > 0
                        ? `${photoImages.length} photo(s) loaded`
                        : 'Default geometric vinyl centerpiece active'}
                    </div>
                  </div>
                </div>

                {/* Photo Layout & Vinyl Settings */}
                <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-300 block mb-1">Image Presentation Layout:</label>
                    <select
                      value={state.imageLayoutMode}
                      onChange={(e) => setState((p) => ({ ...p, imageLayoutMode: e.target.value as any }))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="album-disc">Circular Vinyl Disc</option>
                      <option value="fullscreen-cinematic">Fullscreen Cinematic Background</option>
                      <option value="portrait-frame">Vertical Floating Phone Frame</option>
                      <option value="floating-card">2.5D Floating Card</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 mt-4">
                      <input
                        type="checkbox"
                        checked={state.enableVinylRotation}
                        onChange={(e) => setState((p) => ({ ...p, enableVinylRotation: e.target.checked }))}
                        className="accent-cyan-500 rounded"
                      />
                      Vinyl Record Slow Spin Animation
                    </label>
                  </div>
                </div>

                {/* Branding / Watermark Toggle */}
                <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">Optional Branding / Watermark</span>
                      <span className="text-[11px] text-slate-400">
                        Never forced. 100% free with or without watermark.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={state.branding.enabled}
                        onChange={(e) =>
                          setState((p) => ({
                            ...p,
                            branding: { ...p.branding, enabled: e.target.checked },
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  {state.branding.enabled && (
                    <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800">
                      <div>
                        <label className="text-slate-400 block mb-1">Primary Tag:</label>
                        <input
                          type="text"
                          value={state.branding.text}
                          onChange={(e) =>
                            setState((p) => ({
                              ...p,
                              branding: { ...p.branding, text: e.target.value },
                            }))
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Subtitle:</label>
                        <input
                          type="text"
                          value={state.branding.subtext}
                          onChange={(e) =>
                            setState((p) => ({
                              ...p,
                              branding: { ...p.branding, subtext: e.target.value },
                            }))
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Master Preview Viewport & Transport (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Master Preview Canvas Box */}
            <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center relative min-h-[480px]">
              <div className="relative max-h-[560px] w-full flex items-center justify-center overflow-hidden rounded-xl bg-black">
                <canvas
                  ref={canvasRef}
                  className="max-h-[540px] w-auto h-auto object-contain rounded-lg shadow-2xl"
                  style={{
                    aspectRatio:
                      state.aspectRatio === '9:16' ? '9/16' : state.aspectRatio === '1:1' ? '1/1' : '16/9',
                  }}
                />

                {/* Floating Aspect & Status Badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}
                  />
                  <span>{state.aspectRatio}</span>
                  <span>•</span>
                  <span>{state.fps} FPS</span>
                </div>
              </div>

              {/* Timecode readout & Beat Indicator */}
              <div className="w-full mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {formatTimecode(currentTime, state.fps)} / {formatTimecode(duration, state.fps)}
                </span>
                <span className="text-[11px] text-slate-500 font-sans">
                  {audioTitle.length > 25 ? audioTitle.slice(0, 25) + '...' : audioTitle}
                </span>
              </div>
            </div>

            {/* Bottom Transport Controls Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-xl space-y-3">
              {/* Audio Scrubber Timeline */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400 w-10 text-right">
                  {formatTimeDisplay(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={duration || 16}
                  step="0.05"
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-400 w-10">
                  {formatTimeDisplay(duration)}
                </span>
              </div>

              {/* Playback Transport Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePlay}
                    className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-105"
                    title={isPlaying ? 'Pause (Spacebar)' : 'Play (Spacebar)'}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>

                  <button
                    onClick={() => {
                      stopAllAudio()
                      playbackStartOffsetRef.current = 0
                      setCurrentTime(0)
                    }}
                    className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                    title="Rewind to Start"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsLooping(!isLooping)}
                    className={`p-2.5 rounded-xl transition-all ${
                      isLooping
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title={isLooping ? 'Looping enabled' : 'Looping disabled'}
                  >
                    <Repeat className="w-4 h-4" />
                  </button>
                </div>

                {/* Volume Slider & Mute */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white transition-all"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-rose-400" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
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
                    className="w-20 accent-cyan-500 h-1 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Export Progress / Settings Modal */}
        {isExportModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Export Video</h3>
                    <p className="text-xs text-slate-400">
                      Browser-native MediaRecorder rendering at Full HD
                    </p>
                  </div>
                </div>
                {!isRecording && (
                  <button
                    onClick={() => setIsExportModalOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Export Parameters (When not yet recording) */}
              {!isRecording ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Target Clip Duration:
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: '15s', label: '15s Reels' },
                        { id: '30s', label: '30s Status' },
                        { id: '60s', label: '60s Short' },
                        { id: 'full', label: 'Full Audio' },
                      ].map((d) => (
                        <button
                          key={d.id}
                          onClick={() => setTargetExportLength(d.id as any)}
                          className={`py-2 px-1 text-center rounded-xl border text-xs font-semibold transition-all ${
                            targetExportLength === d.id
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-md'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Resolution:</span>
                      <span className="font-bold text-white">
                        {ASPECT_RATIOS[state.aspectRatio].width} × {ASPECT_RATIOS[state.aspectRatio].height} Full HD
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Frame Rate:</span>
                      <span className="font-bold text-white">{exportFps} FPS (Crisp Motion)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Format:</span>
                      <span className="font-bold text-white uppercase">
                        .{getSupportedVideoMimeType().extension} (Browser Native)
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Watermark:</span>
                      <span className="font-bold text-emerald-400">
                        {state.branding.enabled ? 'Custom Tag Active' : 'None (100% Clean)'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => setIsExportModalOpen(false)}
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                    >
                      Back to Editor
                    </button>
                    <button
                      onClick={handleStartExport}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Begin Video Export
                    </button>
                  </div>
                </div>
              ) : (
                /* Active Recording Progress View */
                <div className="space-y-4 py-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Rendering Frame by Frame in Real-Time...</span>
                    <span className="font-mono text-emerald-400 font-bold">{exportProgress.percent}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${exportProgress.percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>Elapsed: {exportProgress.elapsedSec}s</span>
                    <span>Remaining: ~{exportProgress.remainingSec}s</span>
                  </div>

                  <p className="text-[11px] text-slate-500 text-center">
                    Please keep this browser tab active. The video and audio are syncing in memory.
                  </p>

                  <button
                    onClick={handleCancelExport}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold bg-rose-950/40 text-rose-300 border border-rose-500/30 hover:bg-rose-900/40 transition-all"
                  >
                    Cancel Export
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Below-the-fold Comprehensive SEO Article & Knowledge Hub */}
        <div className="border-t border-slate-800 pt-10 space-y-12">
          {/* 3-Step Quick Guide */}
          <div>
            <h2 className="text-xl font-bold text-white text-center mb-6">
              How to Create an Audio Spectrum Video in 3 Easy Steps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-sm border border-cyan-500/30">
                  1
                </div>
                <h3 className="text-sm font-bold text-white">Upload Audio & Cover Photo</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Drop your MP3, WAV, or AAC song. Don’t have a file ready? Click any of the 3 instant
                  algorithmic synthesizers (Synthwave, Lo-Fi, or Cinematic) to generate instant audio specimen.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-400 font-bold flex items-center justify-center text-sm border border-violet-500/30">
                  2
                </div>
                <h3 className="text-sm font-bold text-white">Select Visualizer & Indic Typography</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Choose from 20 mathematically distinct visualizers (Circular Pulse, Neon Segmented, HUD Ring,
                  etc.) and type your lyrics or song title in Malayalam, Telugu, Kannada, Tamil, or English.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm border border-emerald-500/30">
                  3
                </div>
                <h3 className="text-sm font-bold text-white">Export Full HD Reel or Short</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Select your target length (15s, 30s, or Full Track) and hit Export Video. The MediaRecorder
                  engine encodes the video with synchronized audio locally in your browser.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy & Zero-Watermark Guarantee */}
          <div className="bg-gradient-to-r from-emerald-950/30 via-slate-900 to-cyan-950/30 border border-emerald-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">100% Client-Side Private Video Studio</h3>
                <p className="text-xs text-slate-400 max-w-xl leading-relaxed mt-0.5">
                  Your audio tracks, personal photos, and lyrics never leave your device. All DSP frequency
                  analysis, canvas motion rendering, and video encoding happen right inside your browser memory.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-3.5 py-2 rounded-xl border border-emerald-500/30 whitespace-nowrap">
              <Check className="w-4 h-4" />
              Zero Forced Watermark
            </div>
          </div>

          {/* Detailed FAQ Accordion */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white text-center mb-6">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  q: 'How do I create a music visualizer video for Instagram Reels and YouTube Shorts?',
                  a: 'Simply choose the 9:16 aspect ratio in the top toolbar, upload your song, select a visualizer style like Circular Harmonic Spectrum or Dual-Ring, customize your song title, and hit Export Video. It encodes a vertical Full HD video ready to post directly on Instagram Reels, YouTube Shorts, or WhatsApp Status.',
                },
                {
                  q: 'Why does IndiaTools support Indic fonts (Malayalam, Telugu, Kannada, Tamil) without broken ligatures?',
                  a: 'Unlike generic video generators that split characters with naive string methods, IndiaTools utilizes Intl.Segmenter with grapheme cluster granularity combined with Google Noto Indic Web Fonts. This ensures conjunct consonants, chillus, and dependent vowel signs render accurately without visual glitching.',
                },
                {
                  q: 'Is this audio spectrum video generator really 100% free with no watermark?',
                  a: 'Yes! IndiaTools believes in unrestricted creative freedom for musicians, creators, and editors. By default, the output video has zero watermark. If you want to include branding, you can optionally enable the custom watermark toggle to show your own artist handle or channel name.',
                },
                {
                  q: 'What audio file formats are supported?',
                  a: 'You can upload MP3, WAV, AAC, M4A, OGG, and FLAC files. In addition, you can synthesize sample demo tracks directly in your browser with zero file uploads using our built-in Web Audio synthesizers.',
                },
                {
                  q: 'Can I export in 1080p Full HD at 60 FPS?',
                  a: 'Yes. The canvas locks to exact high-definition dimensions (1080×1920 for 9:16, 1080×1080 for 1:1, and 1920×1080 for 16:9). When you select 60 FPS in the toolbar, the video recording stream operates at a fluid 60 frames per second.',
                },
                {
                  q: 'How do the 20 visualizer engines differ from each other?',
                  a: 'Each visualizer runs an independent mathematical algorithm: from radial Bezier harmonic arcs and counter-rotating rings to 3D perspective topographic terrain, matrix dot arrays, and telemetry HUD reticles. They respond dynamically to sub-bass, mid, and treble frequencies.',
                },
                {
                  q: 'Does IndiaTools upload my audio or photos to any cloud server?',
                  a: 'Never. Everything runs 100% locally on your machine via Web Audio API, HTML5 Canvas, and MediaRecorder. Your intellectual property and private audio tracks stay completely private on your device.',
                },
                {
                  q: 'What should I do if my browser cannot play or export MP4 videos?',
                  a: 'IndiaTools automatically detects your browser’s supported codecs. Modern Chromium and Safari browsers export native MP4 (H.264/AAC), while Firefox defaults to high-quality WebM (VP9/VP8/Opus), which is fully supported across all major social networks.',
                },
              ].map((faq, idx) => (
                <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                    {faq.q}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed pl-6">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* JSON-LD Structured Data Schema for SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebApplication',
                name: 'Audio Spectrum Waveform Video Generator 2.0 — IndiaTools',
                url: 'https://indiatools-rho.vercel.app/tools/audio-spectrum-waveform-video-generator',
                description:
                  'Free online audio visualizer & music video studio. Create 1080p 60FPS soundwave videos for Instagram Reels, YouTube Shorts, and WhatsApp Status with Indic typography support for Malayalam, Telugu, Kannada, Tamil, and English.',
                applicationCategory: 'MultimediaApplication',
                operatingSystem: 'All',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'INR',
                },
                featureList: [
                  '20 Distinct Visualizer Engines',
                  '20 One-Click Studio Presets',
                  'Indic Typography for Malayalam, Telugu, Kannada, Tamil, and English',
                  'Full HD 1080p 60FPS Video Export',
                  '100% Client-Side Private Processing',
                  'Zero Forced Watermark',
                ],
              }),
            }}
          />
        </div>
      </div>
    </ToolPageLayout>
  )
}
