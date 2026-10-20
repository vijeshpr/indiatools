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
  RefreshCw,
  FolderOpen,
  Radio,
  Gauge,
  CloudRain,
  Feather,
  Wind,
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
  ImageLayoutMode,
  LightShowMode,
  LightShowConfig,
  SmokePalette,
  SmokePosition,
  SmokeConfig,
  ParticleUniverseMode,
  ParticleUniverseConfig,
  ShockwaveConfig,
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
  ExportState,
  ExportProgressInfo,
  ExportResultInfo,
  downloadBlob,
  formatBytes,
  formatDurationDisplay,
  formatTimeDisplay,
  formatTimecode,
  getSupportedVideoMimeType,
} from '../lib/video/videoExportEngine'
import {
  generateVisualizerDemoSpecimen,
  DEMO_TRACKS,
  DemoAudioGenre,
} from '../lib/video/demoAudioGenerator'
import { STUDIO_TEMPLATES } from '../lib/video/studioTemplates'
import { EFFECT_COMBOS, EffectCombo } from '../lib/video/effectCombos'
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

  // -------------------------------------------------------------
  // AUDIO FILE, BUFFER & PLAYBACK STATE
  // -------------------------------------------------------------
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null)
  const [audioFileName, setAudioFileName] = useState<string>('')
  const [audioDuration, setAudioDuration] = useState<number>(16)
  const [audioFileSize, setAudioFileSize] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(16)
  const [volume, setVolume] = useState<number>(1.0)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isLooping, setIsLooping] = useState<boolean>(true)
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false)
  const [isAudioDragOver, setIsAudioDragOver] = useState<boolean>(false)

  // -------------------------------------------------------------
  // PHOTO & ARTWORK STATE
  // -------------------------------------------------------------
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [photoName, setPhotoName] = useState<string>('')
  const [photoDimensions, setPhotoDimensions] = useState<{ width: number; height: number } | null>(null)
  const [photoImages, setPhotoImages] = useState<HTMLImageElement[]>([])
  const [isPhotoDragOver, setIsPhotoDragOver] = useState<boolean>(false)
  const [photoZoom, setPhotoZoom] = useState<number>(1.0)
  const [photoOffsetY, setPhotoOffsetY] = useState<number>(0)
  const [photoDarkness, setPhotoDarkness] = useState<number>(35)
  const [showPhotoFineTune, setShowPhotoFineTune] = useState<boolean>(false)

  // -------------------------------------------------------------
  // AUDIO DSP TUNING & LIVE DIAGNOSTIC STATE
  // -------------------------------------------------------------
  const [audioDspTuning, setAudioDspTuning] = useState({
    sensitivity: 1.25,
    bassSensitivity: 1.35,
    midsSensitivity: 1.0,
    trebleSensitivity: 1.0,
    smoothing: 0.82,
    attack: 0.75,
    release: 0.18,
    beatThreshold: 1.45,
    minTriggerInterval: 0.22,
    reduceFlashing: false,
  })

  const [liveMeters, setLiveMeters] = useState({
    subBass: 0,
    bass: 0,
    mids: 0,
    treble: 0,
    overall: 0,
    isBeatHit: false,
  })

  // -------------------------------------------------------------
  // EFFECTS CONFIG: LIGHT SHOW, SMOKE, PARTICLES, SHOCKWAVES
  // -------------------------------------------------------------
  const [lightingConfig, setLightingConfig] = useState<LightShowConfig>({
    enabled: true,
    mode: 'concert-stage',
    intensity: 75,
    beamCount: 8,
    reduceFlashing: false,
    blackoutOnDrop: false,
    ambientGlow: 50,
  })

  const [smokeConfig, setSmokeConfig] = useState<SmokeConfig>({
    enabled: true,
    palette: 'cyan',
    position: 'bottom-rise',
    density: 26,
    speed: 1.2,
    opacity: 65,
    turbulence: 50,
  })

  const [universeConfig, setUniverseConfig] = useState<ParticleUniverseConfig>({
    enabled: true,
    mode: 'starfield',
    count: 85,
    size: 3,
    speed: 1.2,
    glow: 14,
    burstIntensity: 70,
  })

  const [shockwaveConfig, setShockwaveConfig] = useState<ShockwaveConfig>({
    enabled: true,
    ringCount: 2,
    thickness: 4,
    glow: 18,
    expansionSpeed: 2.4,
    color: '#06b6d4',
  })

  // -------------------------------------------------------------
  // MASTER COMPOSITION STATE
  // -------------------------------------------------------------
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
    imageLayoutMode: 'fullscreen-cinematic',
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

    lighting: lightingConfig,
    smoke: smokeConfig,
    particleUniverse: universeConfig,
    shockwaves: shockwaveConfig,

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

  // Keep state.effects in sync with effect config states
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      lighting: lightingConfig,
      smoke: smokeConfig,
      particleUniverse: universeConfig,
      shockwaves: shockwaveConfig,
    }))
  }, [lightingConfig, smokeConfig, universeConfig, shockwaveConfig])

  // -------------------------------------------------------------
  // STUDIO WORKSPACE NAVIGATION & UI TOGGLES
  // -------------------------------------------------------------
  const [activeTab, setActiveTab] = useState<
    'visualizers' | 'combos' | 'lighting' | 'smoke' | 'particles' | 'typography' | 'reactivity'
  >('visualizers')
  const [visualizerCategory, setVisualizerCategory] = useState<string>('all')
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('ml')
  const [showSafeZones, setShowSafeZones] = useState<boolean>(false)

  // -------------------------------------------------------------
  // VIDEO EXPORT MODAL STATE (Triple-Guard Telemetry & Result Store)
  // -------------------------------------------------------------
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [exportState, setExportState] = useState<ExportState>('idle')
  const [targetExportLength, setTargetExportLength] = useState<'15s' | '30s' | '60s' | 'full'>('15s')
  const [exportFps, setExportFps] = useState<30 | 60>(60)
  const [exportTelemetry, setExportTelemetry] = useState<ExportProgressInfo>({
    state: 'idle',
    percent: 0,
    elapsedSec: 0,
    remainingSec: 15,
    currentFrame: 0,
    totalFrames: 900,
    fps: 60,
    phaseText: 'Ready',
    audioCurrentTime: 0,
    duration: 15,
  })
  const [exportResult, setExportResult] = useState<{
    blob: Blob
    blobUrl: string
    fileName: string
    fileExtension: string
    mimeType: string
    fileSizeBytes: number
    formattedSize: string
    durationSec: number
    fps: number
  } | null>(null)
  const [exportErrorMessage, setExportErrorMessage] = useState<string | null>(null)

  // -------------------------------------------------------------
  // AUDIO & CANVAS ENGINE REFS
  // -------------------------------------------------------------
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

  const audioFileInputRef = useRef<HTMLInputElement | null>(null)
  const photoFileInputRef = useRef<HTMLInputElement | null>(null)

  // Load Google Fonts on mount
  useEffect(() => {
    ensureFontsLoaded()
  }, [])

  // Master AudioContext initializer (singleton pattern with user gesture recovery)
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioCtx()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = state.fftSize
      analyser.smoothingTimeConstant = audioDspTuning.smoothing

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
  }, [state.fftSize, audioDspTuning.smoothing, isMuted, volume])

  // Volume & Mute listener
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      const val = isMuted ? 0 : volume
      gainNodeRef.current.gain.setValueAtTime(val, audioContextRef.current.currentTime)
    }
  }, [volume, isMuted])

  // Stop audio playback cleanly
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
    dspAnalyzerRef.current.reset()
  }, [])

  // Play audio from specific second offset with resume on gesture
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
          dspAnalyzerRef.current.reset()
        }
        // GUARD A: Complete export if video recording session is active
        if (recorderSessionRef.current && recorderSessionRef.current.isRecording()) {
          recorderSessionRef.current.finishExport('audio-source-ended')
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

  // -------------------------------------------------------------
  // AUDIO UPLOAD HANDLERS (Rock-solid local decodeAudioData)
  // -------------------------------------------------------------
  const handleProcessAudioFile = useCallback(
    async (file: File) => {
      if (!file) return

      stopAllAudio()
      setIsLoadingAudio(true)

      try {
        const arrayBuffer = await file.arrayBuffer()
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
        const ctx = new AudioCtx()

        let decodedBuffer: AudioBuffer
        try {
          const bufferCopy = arrayBuffer.slice(0)
          decodedBuffer = await new Promise<AudioBuffer>((resolve, reject) => {
            ctx.decodeAudioData(bufferCopy, resolve, reject).catch?.(reject)
          })
        } finally {
          try {
            await ctx.close()
          } catch {}
        }

        setAudioFile(file)
        setAudioBuffer(decodedBuffer)
        setAudioFileName(file.name)
        setAudioFileSize(file.size)
        setAudioDuration(decodedBuffer.duration)
        setDuration(decodedBuffer.duration)
        setCurrentTime(0)
        playbackStartOffsetRef.current = 0

        const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')

        setState((prev) => ({
          ...prev,
          duration: decodedBuffer.duration,
          trimEnd: decodedBuffer.duration,
          textLayers: prev.textLayers.map((l) =>
            l.id === 'layer-title' ? { ...l, text: cleanTitle } : l
          ),
        }))

        showToast(`Audio Loaded: ${file.name} (${formatTimeDisplay(decodedBuffer.duration)})`, 'success')
      } catch (err: any) {
        showToast(
          err.message ||
            'Could not decode audio. Please ensure the file is an uncorrupted MP3, WAV, AAC, M4A, or OGG file.',
          'error'
        )
      } finally {
        setIsLoadingAudio(false)
      }
    },
    [stopAllAudio, showToast]
  )

  const handleAudioFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessAudioFile(e.target.files[0])
    }
  }

  const handleRemoveAudio = useCallback(() => {
    stopAllAudio()
    setAudioFile(null)
    setAudioBuffer(null)
    setAudioFileName('')
    setAudioFileSize(0)
    setDuration(16)
    setCurrentTime(0)
    playbackStartOffsetRef.current = 0
    showToast('Audio track removed.', 'info')
  }, [stopAllAudio, showToast])

  const handleLoadDemoTrack = useCallback(
    async (genre: DemoAudioGenre = 'synthwave') => {
      stopAllAudio()
      setIsLoadingAudio(true)
      try {
        const demoMeta = DEMO_TRACKS.find((t) => t.id === genre) || DEMO_TRACKS[0]
        showToast(`Synthesizing ${demoMeta.name}...`, 'info')
        const file = await generateVisualizerDemoSpecimen(genre)
        await handleProcessAudioFile(file)

        if (genre === 'synthwave') applyEffectCombo('neon-smoke-storm')
        else if (genre === 'lofi') applyEffectCombo('purple-smoke-galaxy')
        else applyEffectCombo('cinematic-light-beams')

        showToast('Demo specimen ready! Click Play or Spacebar.', 'success')
      } catch (err: any) {
        showToast('Could not synthesize sample track.', 'error')
      } finally {
        setIsLoadingAudio(false)
      }
    },
    [stopAllAudio, handleProcessAudioFile, showToast]
  )

  // -------------------------------------------------------------
  // PHOTO UPLOAD HANDLERS
  // -------------------------------------------------------------
  const handleProcessPhotoFile = useCallback(
    (file: File) => {
      if (!file) return
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (JPG, PNG, WebP).', 'error')
        return
      }

      if (photoUrl) {
        URL.revokeObjectURL(photoUrl)
      }

      const url = URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => {
        setPhotoFile(file)
        setPhotoUrl(url)
        setPhotoName(file.name)
        setPhotoDimensions({ width: img.naturalWidth || 1080, height: img.naturalHeight || 1080 })
        setPhotoImages([img])

        const newPhotoAsset: PhotoAsset = {
          id: `photo-${Date.now()}`,
          file,
          url,
          name: file.name,
          width: img.naturalWidth || 1080,
          height: img.naturalHeight || 1080,
          duration: 16,
          crop: { x: 0, y: photoOffsetY, zoom: photoZoom, rotation: photoDarkness },
          filters: { brightness: 100, contrast: 100, saturation: 100, warmth: 0, vignette: 0 },
        }

        setState((prev) => ({
          ...prev,
          photos: [newPhotoAsset],
          activePhotoIndex: 0,
        }))

        showToast(`Photo Loaded: ${file.name}`, 'success')
      }

      img.onerror = () => {
        showToast('Failed to load image file. Please try another photo.', 'error')
      }

      img.src = url
    },
    [photoUrl, photoOffsetY, photoZoom, photoDarkness, showToast]
  )

  const handlePhotoFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessPhotoFile(e.target.files[0])
    }
  }

  const handleRemovePhoto = useCallback(() => {
    if (photoUrl) {
      URL.revokeObjectURL(photoUrl)
    }
    setPhotoFile(null)
    setPhotoUrl(null)
    setPhotoName('')
    setPhotoDimensions(null)
    setPhotoImages([])
    setState((prev) => ({
      ...prev,
      photos: [],
      activePhotoIndex: 0,
    }))
    showToast('Photo removed.', 'info')
  }, [photoUrl, showToast])

  const handleLoadSampleArtwork = useCallback(() => {
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = 1080
    tempCanvas.height = 1080
    const ctx = tempCanvas.getContext('2d')
    if (!ctx) return

    const grad = ctx.createRadialGradient(540, 540, 50, 540, 540, 600)
    grad.addColorStop(0, '#f97316')
    grad.addColorStop(0.4, '#8b5cf6')
    grad.addColorStop(0.8, '#06b6d4')
    grad.addColorStop(1, '#090a0f')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 1080, 1080)

    ctx.fillStyle = '#ffffff'
    for (let i = 0; i < 200; i++) {
      const rx = Math.random() * 1080
      const ry = Math.random() * 1080
      const r = Math.random() * 3 + 1
      ctx.globalAlpha = Math.random() * 0.8 + 0.2
      ctx.beginPath()
      ctx.arc(rx, ry, r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1.0

    tempCanvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'Sample_Cosmic_Artwork.png', { type: 'image/png' })
        handleProcessPhotoFile(file)
      }
    }, 'image/png')
  }, [handleProcessPhotoFile])

  // Sync photo zoom & darkness into composition state
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      photos: prev.photos.map((p, idx) =>
        idx === 0
          ? {
              ...p,
              crop: { x: 0, y: photoOffsetY, zoom: photoZoom, rotation: photoDarkness },
            }
          : p
      ),
    }))
  }, [photoZoom, photoOffsetY, photoDarkness])

  const handleSetImageLayoutMode = (mode: ImageLayoutMode) => {
    setState((prev) => ({
      ...prev,
      imageLayoutMode: mode,
      backgroundMode: mode === 'album-disc' ? 'blurred-cover' : prev.backgroundMode,
    }))
  }

  // -------------------------------------------------------------
  // APPLY ONE-CLICK EFFECT COMBINATIONS (Section 8)
  // -------------------------------------------------------------
  const applyEffectCombo = useCallback(
    (comboId: string) => {
      const combo = EFFECT_COMBOS.find((c) => c.id === comboId)
      if (!combo) return

      setState((prev) => ({
        ...prev,
        activePreset: combo.preset,
        theme: combo.theme,
        lighting: { ...combo.lighting },
        smoke: { ...combo.smoke },
        particleUniverse: { ...combo.particleUniverse },
        shockwaves: { ...combo.shockwaves },
      }))

      setLightingConfig(combo.lighting)
      setSmokeConfig(combo.smoke)
      setUniverseConfig(combo.particleUniverse)
      setShockwaveConfig(combo.shockwaves)

      showToast(`Applied Combo: ${combo.name}`, 'info')
    },
    [showToast]
  )

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
      showToast(`Switched typography to ${fontMeta.nativeName} (${fontMeta.name})`, 'info')
    },
    [state.activeTemplateId, showToast]
  )

  // -------------------------------------------------------------
  // MASTER CANVAS RENDER LOOP (Deterministic, strictly audio-reactive)
  // Background tab resilient with timer-driven rendering fallback
  // -------------------------------------------------------------
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
    let fallbackInterval: any = null
    let isRenderingFrame = false
    const freqData = new Uint8Array(state.fftSize / 2)
    const timeData = new Uint8Array(state.fftSize / 2)
    let frameCount = 0

    const scheduleNextTick = () => {
      if (!isRunning) return
      if (typeof document !== 'undefined' && document.hidden) {
        // Tab is hidden in background: RAF is paused or throttled to 1 FPS by browser
        if (!fallbackInterval) {
          const fpsInterval = Math.max(16, Math.floor(1000 / (exportFps || 60)))
          fallbackInterval = setInterval(() => {
            if (!isRenderingFrame) {
              isRenderingFrame = true
              render()
              isRenderingFrame = false
            }
          }, fpsInterval)
        }
      } else {
        // Tab is visible: use hardware-accelerated RAF
        if (fallbackInterval) {
          clearInterval(fallbackInterval)
          fallbackInterval = null
        }
        animationFrameRef.current = requestAnimationFrame(render)
      }
    }

    const render = () => {
      if (!isRunning) return
      frameCount++

      const width = canvas.width
      const height = canvas.height

      let renderTime = currentTime
      if (isPlaying && audioContextRef.current) {
        const elapsed = audioContextRef.current.currentTime - playbackStartTimeRef.current
        renderTime = Math.min(duration, playbackStartOffsetRef.current + elapsed)
        setCurrentTime(renderTime)
      }

      // STRICT AUDIO REACTIVITY: If audio is paused, do NOT generate synthetic sinusoidal values
      // Real silence guarantees zero beat hits and zero false spectrum animation when paused!
      if (analyserRef.current && isPlaying) {
        analyserRef.current.getByteFrequencyData(freqData)
        analyserRef.current.getByteTimeDomainData(timeData)
      } else {
        freqData.fill(0)
        timeData.fill(128)
      }

      const bands = dspAnalyzerRef.current.analyze(
        freqData,
        renderTime,
        {
          sensitivity: audioDspTuning.sensitivity,
          bassSensitivity: audioDspTuning.bassSensitivity,
          midsSensitivity: audioDspTuning.midsSensitivity,
          trebleSensitivity: audioDspTuning.trebleSensitivity,
          smoothing: audioDspTuning.smoothing,
          attack: audioDspTuning.attack,
          release: audioDspTuning.release,
          beatThreshold: audioDspTuning.beatThreshold,
          minTriggerInterval: audioDspTuning.minTriggerInterval,
        },
        timeData
      )

      // Throttle live VU meter state updates to ~15 FPS to keep React render lightweight
      if (frameCount % 4 === 0) {
        setLiveMeters({
          subBass: bands.subBass,
          bass: bands.bass,
          mids: bands.mids,
          treble: bands.treble,
          overall: bands.overall,
          isBeatHit: isPlaying && bands.isBeatHit,
        })
      }

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

      // Only show editor safe zone overlay during live preview, never in exported video
      if (showSafeZones && state.aspectRatio === '9:16' && !isRecording) {
        drawReelsSafeZoneOverlay(ctx, width, height)
      }

      // Notify recorder session of actual render tick and audio timestamp
      if (recorderSessionRef.current && recorderSessionRef.current.isRecording()) {
        recorderSessionRef.current.notifyFrameRendered()
        recorderSessionRef.current.updateAudioPosition(renderTime)
      }

      scheduleNextTick()
    }

    const handleVisibilityChange = () => {
      if (!isRunning) return
      if (!document.hidden) {
        if (fallbackInterval) {
          clearInterval(fallbackInterval)
          fallbackInterval = null
        }
        if (!animationFrameRef.current) {
          animationFrameRef.current = requestAnimationFrame(render)
        }
      } else {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
          animationFrameRef.current = null
        }
        scheduleNextTick()
      }
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange)
    }

    render()

    return () => {
      isRunning = false
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      if (fallbackInterval) {
        clearInterval(fallbackInterval)
        fallbackInterval = null
      }
    }
  }, [state, isPlaying, duration, photoImages, showSafeZones, audioDspTuning, isRecording, exportFps])

  const drawReelsSafeZoneOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save()
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.75)'
    ctx.lineWidth = 3
    ctx.setLineDash([8, 8])

    const safeTop = height * 0.14
    const safeBottom = height * 0.8
    const safeRight = width * 0.82
    const safeLeft = width * 0.08

    ctx.strokeRect(safeLeft, safeTop, safeRight - safeLeft, safeBottom - safeTop)

    ctx.fillStyle = 'rgba(239, 68, 68, 0.18)'
    ctx.fillRect(safeRight, safeTop, width - safeRight, safeBottom - safeTop)
    ctx.fillRect(0, safeBottom, width, height - safeBottom)
    ctx.fillRect(0, 0, width, safeTop)

    ctx.setLineDash([])
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('⚡ REELS / SHORTS SAFE ZONE (Keep text inside dashed box)', width / 2, safeTop - 20)
    ctx.restore()
  }

  // -------------------------------------------------------------
  // VIDEO EXPORT EXECUTION (Triple-Guard Finalization & Telemetry)
  // -------------------------------------------------------------
  const handleStartExport = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) {
      showToast('Canvas render engine is not ready.', 'error')
      return
    }

    if (!audioBuffer) {
      showToast('Please upload an audio track or pick a demo before exporting.', 'error')
      return
    }

    const ctx = getAudioContext()
    const dest = destinationNodeRef.current
    if (!dest) {
      showToast('Audio recording node not initialized.', 'error')
      return
    }

    let targetSeconds = audioBuffer.duration
    if (targetExportLength === '15s') targetSeconds = Math.min(15, audioBuffer.duration)
    else if (targetExportLength === '30s') targetSeconds = Math.min(30, audioBuffer.duration)
    else if (targetExportLength === '60s') targetSeconds = Math.min(60, audioBuffer.duration)

    if (exportResult?.blobUrl) {
      try {
        URL.revokeObjectURL(exportResult.blobUrl)
      } catch {
        // ignore
      }
      setExportResult(null)
    }

    setExportErrorMessage(null)
    setExportState('recording')
    setIsRecording(true)

    const initialTelemetry: ExportProgressInfo = {
      state: 'recording',
      percent: 0,
      elapsedSec: 0,
      remainingSec: targetSeconds,
      currentFrame: 0,
      totalFrames: Math.max(1, Math.round(targetSeconds * exportFps)),
      fps: exportFps,
      phaseText: `Recording Audio & Video (00:00 / ${formatDurationDisplay(targetSeconds)})`,
      audioCurrentTime: 0,
      duration: targetSeconds,
    }
    setExportTelemetry(initialTelemetry)

    const session = new VideoRecorderSession({
      canvas,
      audioDestination: dest,
      fps: exportFps,
      bitrate: 7_000_000,
      duration: targetSeconds,
      trimStart: 0,
      trimEnd: targetSeconds,
      onStart: () => {
        showToast('Exporting high-definition video with A/V sync...', 'info')
      },
      onProgress: (info) => {
        setExportTelemetry(info)
        if (info.state === 'finalizing') {
          setExportState('finalizing')
        }
      },
      onComplete: (result) => {
        setIsRecording(false)
        stopAllAudio()
        setExportState('completed')

        const cleanTitle = (audioFileName || 'music_video').replace(/[^a-zA-Z0-9_-]/g, '_')
        const filename = `IndiaTools_${cleanTitle}_${state.activePreset}_${state.aspectRatio.replace(':', 'x')}.${result.fileExtension}`

        let blobUrl = ''
        try {
          blobUrl = URL.createObjectURL(result.blob)
        } catch {
          // ignore
        }

        setExportResult({
          blob: result.blob,
          blobUrl,
          fileName: filename,
          fileExtension: result.fileExtension,
          mimeType: result.mimeType,
          fileSizeBytes: result.fileSizeBytes,
          formattedSize: result.formattedSize,
          durationSec: result.durationSec,
          fps: result.fps,
        })

        const downloadSuccess = downloadBlob(result.blob, filename)
        if (downloadSuccess) {
          showToast(`Video exported successfully! (${result.formattedSize})`, 'success')
        } else {
          showToast(`Video ready! (${result.formattedSize}) Click download button to save.`, 'info')
        }
      },
      onError: (err) => {
        setIsRecording(false)
        stopAllAudio()
        setExportState('error')
        setExportErrorMessage(err.message || 'Export failed.')
        showToast(`Export failed: ${err.message}`, 'error')
      },
    })

    recorderSessionRef.current = session
    await playFromOffset(0)
    session.start()
  }, [
    audioBuffer,
    targetExportLength,
    exportFps,
    audioFileName,
    state.activePreset,
    state.aspectRatio,
    exportResult,
    getAudioContext,
    playFromOffset,
    stopAllAudio,
    showToast,
  ])

  const handleCancelExport = useCallback(() => {
    if (recorderSessionRef.current) {
      recorderSessionRef.current.cancel()
      recorderSessionRef.current = null
    }
    stopAllAudio()
    setIsRecording(false)
    setExportState('idle')
    setExportErrorMessage(null)
    showToast('Export cancelled.', 'info')
  }, [stopAllAudio, showToast])

  const handleCloseExportModal = useCallback(() => {
    if (isRecording || exportState === 'recording' || exportState === 'finalizing') {
      handleCancelExport()
    }
    if (exportResult?.blobUrl) {
      try {
        URL.revokeObjectURL(exportResult.blobUrl)
      } catch {
        // ignore
      }
      setExportResult(null)
    }
    setExportState('idle')
    setExportErrorMessage(null)
    setIsExportModalOpen(false)
  }, [isRecording, exportState, handleCancelExport, exportResult])

  const handleDownloadAgain = useCallback(() => {
    if (!exportResult) return
    const a = document.createElement('a')
    a.href = exportResult.blobUrl
    a.download = exportResult.fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    showToast('Download started!', 'success')
  }, [exportResult, showToast])

  const selectedLayer = useMemo(() => {
    return state.textLayers.find((l) => l.id === state.selectedLayerId) || state.textLayers[0]
  }, [state.textLayers, state.selectedLayerId])

  const updateSelectedLayer = (updates: Partial<TypographyLayer>) => {
    if (!selectedLayer) return
    setState((prev) => ({
      ...prev,
      textLayers: prev.textLayers.map((l) =>
        l.id === selectedLayer.id ? { ...l, ...updates } : l
      ),
    }))
  }

  const filteredVisualizers = useMemo(() => {
    if (visualizerCategory === 'all') return VISUALIZER_ENGINES
    return VISUALIZER_ENGINES.filter((e) => e.category === visualizerCategory)
  }, [visualizerCategory])

  return (
    <ToolPageLayout tool={tool}>
      <div className="space-y-6">
        {/* ========================================================= */}
        {/* 1. VISIBLE FIRST-USE 5-STEP INSTRUCTIONS BANNER           */}
        {/* ========================================================= */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl shadow-xl">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Quick 5-Step Video Creator Workflow
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
            <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-xl flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0">
                1
              </span>
              <div>
                <span className="font-semibold text-white block">Upload Audio</span>
                <span className="text-[11px] text-slate-400">MP3, WAV, AAC</span>
              </div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-xl flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs shrink-0">
                2
              </span>
              <div>
                <span className="font-semibold text-white block">Upload Photo</span>
                <span className="text-[11px] text-slate-400">JPG, PNG, WebP</span>
              </div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-xl flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 font-bold flex items-center justify-center text-xs shrink-0">
                3
              </span>
              <div>
                <span className="font-semibold text-white block">Pick Visualizer</span>
                <span className="text-[11px] text-slate-400">20 Styles Available</span>
              </div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-xl flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs shrink-0">
                4
              </span>
              <div>
                <span className="font-semibold text-white block">Lights & Smoke</span>
                <span className="text-[11px] text-slate-400">Audio-Reactive FX</span>
              </div>
            </div>
            <div className="bg-slate-950/70 border border-slate-800/80 p-2.5 rounded-xl flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center text-xs shrink-0">
                5
              </span>
              <div>
                <span className="font-semibold text-white block">Export Video</span>
                <span className="text-[11px] text-slate-400">1080p Reels / Shorts</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. DEDICATED MEDIA ASSETS STATION (AUDIO & PHOTO UPLOADS) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ---------------- CARD A: AUDIO UPLOAD STATION ---------------- */}
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsAudioDragOver(true)
            }}
            onDragLeave={() => setIsAudioDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsAudioDragOver(false)
              if (e.dataTransfer.files?.[0]) handleProcessAudioFile(e.dataTransfer.files[0])
            }}
            className={`bg-slate-900/95 border-2 rounded-2xl p-5 shadow-xl transition-all ${
              isAudioDragOver
                ? 'border-emerald-500 bg-emerald-950/30'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <input
              ref={audioFileInputRef}
              type="file"
              accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac"
              className="hidden"
              onChange={handleAudioFileInputChange}
            />

            {!audioBuffer ? (
              <div className="flex flex-col items-center justify-center text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-lg">
                  <Music className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Upload Your Audio Song / Music</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    MP3, WAV, AAC, M4A, or OGG. Processed 100% locally in your browser.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1 flex-wrap justify-center">
                  <button
                    onClick={() => audioFileInputRef.current?.click()}
                    disabled={isLoadingAudio}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/25 transition-all transform hover:scale-105"
                  >
                    <Upload className="w-4 h-4" />
                    {isLoadingAudio ? 'Decoding Audio...' : 'Choose Audio File'}
                  </button>

                  <button
                    onClick={() => handleLoadDemoTrack('synthwave')}
                    disabled={isLoadingAudio}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all border border-slate-700"
                    title="Synthesizes in-browser electronic beat specimen"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Instant Demo Synth
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Audio Loaded Ready
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {formatTimeDisplay(audioDuration)} • {(audioFileSize / (1024 * 1024)).toFixed(1)} MB
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTogglePlay}
                    className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all shrink-0"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">{audioFileName}</div>
                    <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mt-0.5">
                      <span>{formatTimeDisplay(currentTime)}</span>
                      <span>/</span>
                      <span>{formatTimeDisplay(audioDuration)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <button
                    onClick={() => audioFileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all font-semibold"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                    Replace Audio
                  </button>
                  <button
                    onClick={handleRemoveAudio}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-all font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove Audio
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ---------------- CARD B: PHOTO UPLOAD STATION ---------------- */}
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsPhotoDragOver(true)
            }}
            onDragLeave={() => setIsPhotoDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsPhotoDragOver(false)
              if (e.dataTransfer.files?.[0]) handleProcessPhotoFile(e.dataTransfer.files[0])
            }}
            className={`bg-slate-900/95 border-2 rounded-2xl p-5 shadow-xl transition-all ${
              isPhotoDragOver
                ? 'border-cyan-500 bg-cyan-950/30'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <input
              ref={photoFileInputRef}
              type="file"
              accept="image/*,.jpg,.jpeg,.png,.webp,.gif"
              className="hidden"
              onChange={handlePhotoFileInputChange}
            />

            {!photoFile ? (
              <div className="flex flex-col items-center justify-center text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shadow-lg">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Upload Your Photo / Cover Art</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    JPG, PNG, or WebP. Used as real video background or spinning album art.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1 flex-wrap justify-center">
                  <button
                    onClick={() => photoFileInputRef.current?.click()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-600/25 transition-all transform hover:scale-105"
                  >
                    <Upload className="w-4 h-4" />
                    Choose Photo File
                  </button>

                  <button
                    onClick={handleLoadSampleArtwork}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all border border-slate-700"
                    title="Generates in-browser vibrant sample artwork"
                  >
                    <Palette className="w-3.5 h-3.5 text-cyan-400" />
                    Use Sample Artwork
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Photo Loaded Ready
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {photoDimensions ? `${photoDimensions.width} × ${photoDimensions.height}` : 'HD'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {photoUrl && (
                    <img
                      src={photoUrl}
                      alt="Uploaded artwork preview"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-md shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">{photoName}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <button
                        onClick={() => handleSetImageLayoutMode('fullscreen-cinematic')}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                          state.imageLayoutMode === 'fullscreen-cinematic'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Full Background
                      </button>
                      <button
                        onClick={() => handleSetImageLayoutMode('album-disc')}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                          state.imageLayoutMode === 'album-disc'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Vinyl Disc
                      </button>
                      <button
                        onClick={() => handleSetImageLayoutMode('portrait-frame')}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                          state.imageLayoutMode === 'portrait-frame'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Portrait Card
                      </button>
                    </div>
                  </div>
                </div>

                {showPhotoFineTune && (
                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Zoom / Crop Scale</span>
                      <span className="font-mono text-cyan-400">{(photoZoom * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.8"
                      max="2.0"
                      step="0.05"
                      value={photoZoom}
                      onChange={(e) => setPhotoZoom(parseFloat(e.target.value))}
                      className="w-full accent-cyan-500 h-1 bg-slate-800 rounded"
                    />

                    <div className="flex justify-between text-slate-300 pt-1">
                      <span>Dark Contrast Overlay</span>
                      <span className="font-mono text-cyan-400">{photoDarkness}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      step="5"
                      value={photoDarkness}
                      onChange={(e) => setPhotoDarkness(parseInt(e.target.value))}
                      className="w-full accent-cyan-500 h-1 bg-slate-800 rounded"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => photoFileInputRef.current?.click()}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all font-semibold"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                      Replace
                    </button>
                    <button
                      onClick={() => setShowPhotoFineTune(!showPhotoFineTune)}
                      className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      {showPhotoFineTune ? 'Hide Adjustments' : 'Fit & Zoom'}
                    </button>
                  </div>
                  <button
                    onClick={handleRemovePhoto}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-all font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. TOOLBAR: ASPECT RATIO, SAFE-ZONES, FPS, EXPORT TRIGGER */}
        {/* ========================================================= */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 backdrop-blur-xl shadow-2xl flex flex-wrap items-center justify-between gap-4">
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

          <div className="flex items-center gap-3">
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

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/35 transition-all transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" />
            Export Video
          </button>
        </div>

        {/* ========================================================= */}
        {/* 4. WORKSPACE SPLIT: DEEP CUSTOMIZATION DOCK & LIVE CANVAS  */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Tabbed Dock (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-xl shadow-xl flex flex-col min-h-[660px]">
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
                onClick={() => setActiveTab('combos')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'combos'
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                12 Effect Combos
              </button>
              <button
                onClick={() => setActiveTab('lighting')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'lighting'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Zap className="w-4 h-4" />
                Beat Light Show
              </button>
              <button
                onClick={() => setActiveTab('smoke')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'smoke'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Wind className="w-4 h-4" />
                Audio Smoke
              </button>
              <button
                onClick={() => setActiveTab('particles')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'particles'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Radio className="w-4 h-4" />
                Particles & Waves
              </button>
              <button
                onClick={() => setActiveTab('typography')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'typography'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Type className="w-4 h-4" />
                Typography
              </button>
              <button
                onClick={() => setActiveTab('reactivity')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === 'reactivity'
                    ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Gauge className="w-4 h-4" />
                DSP Reactivity
              </button>
            </div>

            {/* TAB 1: 20 VISUALIZERS */}
            {activeTab === 'visualizers' && (
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
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
              </div>
            )}

            {/* TAB 2: 12 ONE-CLICK EFFECT COMBINATIONS (Section 8) */}
            {activeTab === 'combos' && (
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {EFFECT_COMBOS.map((combo) => (
                    <div
                      key={combo.id}
                      onClick={() => applyEffectCombo(combo.id)}
                      className="p-4 rounded-xl border bg-slate-950/50 border-slate-800/80 hover:border-violet-500/50 hover:bg-violet-950/20 text-left cursor-pointer transition-all shadow-md group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-bold text-white flex items-center gap-1.5 group-hover:text-violet-300">
                          <Sparkles className="w-4 h-4 text-violet-400" />
                          {combo.name}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-violet-900/40 text-violet-300 border border-violet-700/40">
                          {combo.theme}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {combo.subtitle}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: BEAT LIGHT SHOW (Section 3) */}
            {activeTab === 'lighting' && (
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                <div className="flex items-center justify-between bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-white block">Enable Beat Light Show</span>
                    <span className="text-[11px] text-slate-400">
                      Concert beams, spotlights and sweeps pulsing to beats
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lightingConfig.enabled}
                      onChange={(e) => setLightingConfig((p) => ({ ...p, enabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {lightingConfig.enabled && (
                  <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-4 text-xs">
                    <div>
                      <label className="text-slate-300 block mb-1 font-semibold">Light Show Mode:</label>
                      <select
                        value={lightingConfig.mode}
                        onChange={(e) =>
                          setLightingConfig((p) => ({ ...p, mode: e.target.value as LightShowMode }))
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      >
                        <option value="concert-stage">Concert Stage Beams (Arena Sweepers)</option>
                        <option value="neon-club">Neon Club Rotating Sweepers</option>
                        <option value="cinematic-spotlight">Cinematic Center Spotlight</option>
                        <option value="dark-bass-drop">Dark Bass Drop Pulse</option>
                        <option value="rainbow-pulse">Rainbow Pulse Strobe</option>
                        <option value="minimal-light-bars">Minimal Concert Stage Bars</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Beam Intensity:</span>
                          <span className="font-mono text-amber-400">{lightingConfig.intensity}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={lightingConfig.intensity}
                          onChange={(e) =>
                            setLightingConfig((p) => ({ ...p, intensity: parseInt(e.target.value) }))
                          }
                          className="w-full accent-amber-500"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Beam Count:</span>
                          <span className="font-mono text-amber-400">{lightingConfig.beamCount}</span>
                        </div>
                        <input
                          type="range"
                          min="4"
                          max="16"
                          value={lightingConfig.beamCount}
                          onChange={(e) =>
                            setLightingConfig((p) => ({ ...p, beamCount: parseInt(e.target.value) }))
                          }
                          className="w-full accent-amber-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-2 border-t border-slate-800 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                        <input
                          type="checkbox"
                          checked={lightingConfig.reduceFlashing}
                          onChange={(e) =>
                            setLightingConfig((p) => ({ ...p, reduceFlashing: e.target.checked }))
                          }
                          className="accent-amber-500 rounded"
                        />
                        Reduce Flashing (Accessibility Safe)
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                        <input
                          type="checkbox"
                          checked={lightingConfig.blackoutOnDrop}
                          onChange={(e) =>
                            setLightingConfig((p) => ({ ...p, blackoutOnDrop: e.target.checked }))
                          }
                          className="accent-amber-500 rounded"
                        />
                        Blackout Flash on Bass Drop
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: AUDIO-REACTIVE SMOKE & MIST (Section 4) */}
            {activeTab === 'smoke' && (
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                <div className="flex items-center justify-between bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Enable Coloured Smoke & Mist
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Volumetric atmospheric fog swirling to bass & beat hits
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={smokeConfig.enabled}
                      onChange={(e) => setSmokeConfig((p) => ({ ...p, enabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                  </label>
                </div>

                {smokeConfig.enabled && (
                  <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-300 block mb-1 font-semibold">Smoke Palette:</label>
                        <select
                          value={smokeConfig.palette}
                          onChange={(e) =>
                            setSmokeConfig((p) => ({ ...p, palette: e.target.value as SmokePalette }))
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white capitalize"
                        >
                          <option value="cyan">Cyan Electric</option>
                          <option value="purple">Royal Purple</option>
                          <option value="magenta">Neon Magenta</option>
                          <option value="electric-blue">Electric Blue</option>
                          <option value="orange">Sunset Orange</option>
                          <option value="red">Crimson Red</option>
                          <option value="rainbow">Chroma Rainbow</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-300 block mb-1 font-semibold">Flow Position:</label>
                        <select
                          value={smokeConfig.position}
                          onChange={(e) =>
                            setSmokeConfig((p) => ({ ...p, position: e.target.value as SmokePosition }))
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        >
                          <option value="bottom-rise">Rising From Bottom (Stage Fog)</option>
                          <option value="side-flow">Side Flowing Plumes</option>
                          <option value="center-burst">Center Bass Bursts</option>
                          <option value="background-ambient">Ambient Background Mist</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Smoke Opacity:</span>
                          <span className="font-mono text-rose-400">{smokeConfig.opacity}%</span>
                        </div>
                        <input
                          type="range"
                          min="15"
                          max="95"
                          value={smokeConfig.opacity}
                          onChange={(e) =>
                            setSmokeConfig((p) => ({ ...p, opacity: parseInt(e.target.value) }))
                          }
                          className="w-full accent-rose-500"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Flow Speed:</span>
                          <span className="font-mono text-rose-400">{smokeConfig.speed.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="2.5"
                          step="0.1"
                          value={smokeConfig.speed}
                          onChange={(e) =>
                            setSmokeConfig((p) => ({ ...p, speed: parseFloat(e.target.value) }))
                          }
                          className="w-full accent-rose-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: PARTICLE UNIVERSE & SHOCKWAVES (Sections 5 & 6) */}
            {activeTab === 'particles' && (
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                {/* 12 Particle Universe Modes */}
                <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white">Particle Universe (12 Modes)</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={universeConfig.enabled}
                        onChange={(e) =>
                          setUniverseConfig((p) => ({ ...p, enabled: e.target.checked }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>

                  {universeConfig.enabled && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-slate-300 block mb-1">Particle Mode:</label>
                        <select
                          value={universeConfig.mode}
                          onChange={(e) =>
                            setUniverseConfig((p) => ({
                              ...p,
                              mode: e.target.value as ParticleUniverseMode,
                            }))
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white capitalize"
                        >
                          <option value="galaxy">Galaxy Vortex (Orbiting Spiral)</option>
                          <option value="starfield">Starfield Warp Speed</option>
                          <option value="neon-dust">Neon Ambient Dust</option>
                          <option value="fireflies">Floating Fireflies</option>
                          <option value="energy-sparks">Energy Sparks (Electric Hits)</option>
                          <option value="particle-explosion">Particle Explosion on Beat</option>
                          <option value="orbiting-particles">Orbiting Vinyl Satellites</option>
                          <option value="rainbow-confetti">Rainbow Festival Confetti</option>
                          <option value="cosmic-nebula">Cosmic Nebula Gas</option>
                          <option value="light-trails">Light Trails (Long Exposure)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between text-slate-300 mb-1">
                            <span>Count:</span>
                            <span className="font-mono text-blue-400">{universeConfig.count}</span>
                          </div>
                          <input
                            type="range"
                            min="30"
                            max="180"
                            value={universeConfig.count}
                            onChange={(e) =>
                              setUniverseConfig((p) => ({ ...p, count: parseInt(e.target.value) }))
                            }
                            className="w-full accent-blue-500"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-slate-300 mb-1">
                            <span>Beat Burst:</span>
                            <span className="font-mono text-blue-400">{universeConfig.burstIntensity}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={universeConfig.burstIntensity}
                            onChange={(e) =>
                              setUniverseConfig((p) => ({
                                ...p,
                                burstIntensity: parseInt(e.target.value),
                              }))
                            }
                            className="w-full accent-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bass Shockwaves & Concentric Energy Rings (Section 6) */}
                <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white">Bass Shockwaves & Energy Rings</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shockwaveConfig.enabled}
                        onChange={(e) =>
                          setShockwaveConfig((p) => ({ ...p, enabled: e.target.checked }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>

                  {shockwaveConfig.enabled && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Rings Count:</span>
                          <span className="font-mono text-cyan-400">{shockwaveConfig.ringCount}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="4"
                          value={shockwaveConfig.ringCount}
                          onChange={(e) =>
                            setShockwaveConfig((p) => ({ ...p, ringCount: parseInt(e.target.value) }))
                          }
                          className="w-full accent-cyan-500"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Expansion Speed:</span>
                          <span className="font-mono text-cyan-400">
                            {shockwaveConfig.expansionSpeed.toFixed(1)}x
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1.0"
                          max="4.0"
                          step="0.2"
                          value={shockwaveConfig.expansionSpeed}
                          onChange={(e) =>
                            setShockwaveConfig((p) => ({
                              ...p,
                              expansionSpeed: parseFloat(e.target.value),
                            }))
                          }
                          className="w-full accent-cyan-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 6: INDIC TYPOGRAPHY */}
            {activeTab === 'typography' && (
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-2">
                    Script & Native Grapheme Engine:
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {(['ml', 'en', 'te', 'kn', 'ta'] as SupportedLanguage[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleSwitchLanguage(lang)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          currentLanguage === lang
                            ? 'bg-amber-950/40 border-amber-500/60 text-amber-300 shadow-md font-bold'
                            : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="text-sm">{SUPPORTED_LANGUAGES[lang].nativeName}</div>
                        <div className="text-[10px] text-slate-500 uppercase">{SUPPORTED_LANGUAGES[lang].name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedLayer && (
                  <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-4">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Text String (Unicode Indic Safe):</label>
                      <input
                        type="text"
                        value={selectedLayer.text}
                        onChange={(e) => updateSelectedLayer({ text: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                        placeholder="Song Title / Lyric..."
                      />
                    </div>

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
                        <label className="text-slate-300 block mb-1">Animation Style:</label>
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
                  </div>
                )}
              </div>
            )}

            {/* TAB 7: AUDIO REACTIVITY TUNING & LIVE DIAGNOSTICS (Section 9) */}
            {activeTab === 'reactivity' && (
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                {/* Live Measured Audio Diagnostics Panel */}
                <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-fuchsia-400" />
                      Live Analyser Energy Activity
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-all ${
                        liveMeters.isBeatHit
                          ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/50 animate-pulse'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {liveMeters.isBeatHit ? '⚡ BEAT DETECTED' : 'IDLE WAIT'}
                    </span>
                  </div>

                  {/* 6-Band Live VU Meters */}
                  <div className="space-y-2 text-[11px] font-mono">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-0.5">
                        <span>Sub-Bass (20-60 Hz)</span>
                        <span className="text-cyan-400">{(liveMeters.subBass * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-cyan-500 h-full transition-all duration-75"
                          style={{ width: `${liveMeters.subBass * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-0.5">
                        <span>Bass (60-250 Hz)</span>
                        <span className="text-emerald-400">{(liveMeters.bass * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full transition-all duration-75"
                          style={{ width: `${liveMeters.bass * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-0.5">
                        <span>Midrange (500-2000 Hz)</span>
                        <span className="text-amber-400">{(liveMeters.mids * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-amber-500 h-full transition-all duration-75"
                          style={{ width: `${liveMeters.mids * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-0.5">
                        <span>Treble (6000-20000 Hz)</span>
                        <span className="text-rose-400">{(liveMeters.treble * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-rose-500 h-full transition-all duration-75"
                          style={{ width: `${liveMeters.treble * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {isPlaying && liveMeters.overall === 0 && (
                    <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-[11px] text-amber-300">
                      💡 Tip: Click anywhere in the editor window to resume the Web Audio context if meters remain at zero.
                    </div>
                  )}
                </div>

                {/* DSP Tuning Sliders */}
                <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-3.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Reactivity Parameters</span>
                    <button
                      onClick={() =>
                        setAudioDspTuning({
                          sensitivity: 1.25,
                          bassSensitivity: 1.35,
                          midsSensitivity: 1.0,
                          trebleSensitivity: 1.0,
                          smoothing: 0.82,
                          attack: 0.75,
                          release: 0.18,
                          beatThreshold: 1.45,
                          minTriggerInterval: 0.22,
                          reduceFlashing: false,
                        })
                      }
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      Reset Defaults
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Global Sensitivity:</span>
                        <span className="font-mono text-fuchsia-400">{audioDspTuning.sensitivity.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.05"
                        value={audioDspTuning.sensitivity}
                        onChange={(e) =>
                          setAudioDspTuning((p) => ({ ...p, sensitivity: parseFloat(e.target.value) }))
                        }
                        className="w-full accent-fuchsia-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Bass Sensitivity:</span>
                        <span className="font-mono text-fuchsia-400">{audioDspTuning.bassSensitivity.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.05"
                        value={audioDspTuning.bassSensitivity}
                        onChange={(e) =>
                          setAudioDspTuning((p) => ({ ...p, bassSensitivity: parseFloat(e.target.value) }))
                        }
                        className="w-full accent-fuchsia-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Beat Threshold:</span>
                        <span className="font-mono text-fuchsia-400">{audioDspTuning.beatThreshold.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="1.1"
                        max="2.0"
                        step="0.05"
                        value={audioDspTuning.beatThreshold}
                        onChange={(e) =>
                          setAudioDspTuning((p) => ({ ...p, beatThreshold: parseFloat(e.target.value) }))
                        }
                        className="w-full accent-fuchsia-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>DSP Smoothing:</span>
                        <span className="font-mono text-fuchsia-400">{audioDspTuning.smoothing.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="0.3"
                        max="0.95"
                        step="0.02"
                        value={audioDspTuning.smoothing}
                        onChange={(e) =>
                          setAudioDspTuning((p) => ({ ...p, smoothing: parseFloat(e.target.value) }))
                        }
                        className="w-full accent-fuchsia-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Master Live Preview & Timeline Transport (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
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

                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}
                  />
                  <span>{state.aspectRatio}</span>
                  <span>•</span>
                  <span>{state.fps} FPS</span>
                </div>
              </div>

              <div className="w-full mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {formatTimecode(currentTime, state.fps)} / {formatTimecode(duration, state.fps)}
                </span>
                <span className="text-[11px] text-slate-500 font-sans truncate max-w-[180px]">
                  {audioFileName || 'Waiting for audio track...'}
                </span>
              </div>
            </div>

            {/* Bottom Timeline Transport */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-xl space-y-3">
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
                  onChange={(e) => {
                    const sec = parseFloat(e.target.value)
                    setCurrentTime(sec)
                    playbackStartOffsetRef.current = sec
                    if (isPlaying) playFromOffset(sec)
                  }}
                  className="flex-1 accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-400 w-10">
                  {formatTimeDisplay(duration)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePlay}
                    disabled={!audioBuffer}
                    className={`p-3 rounded-xl text-white shadow-lg transition-all transform hover:scale-105 ${
                      !audioBuffer
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/25'
                    }`}
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

        {/* ========================================================= */}
        {/* 5. VIDEO EXPORT MODAL (Triple-Guard Telemetry & Guaranteed Download) */}
        {/* ========================================================= */}
        {isExportModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {exportState === 'completed'
                        ? 'Export Complete!'
                        : exportState === 'recording' || exportState === 'finalizing'
                        ? 'Rendering Video...'
                        : exportState === 'error'
                        ? 'Export Failed'
                        : 'Export Video Studio'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {exportState === 'completed'
                        ? 'Your video is ready for download'
                        : 'Browser-native MediaRecorder rendering at Full HD'}
                    </p>
                  </div>
                </div>
                {exportState !== 'recording' && exportState !== 'finalizing' && (
                  <button
                    onClick={handleCloseExportModal}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* STATE 1: IDLE CONFIGURATION */}
              {exportState === 'idle' && (
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

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Frame Rate:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setExportFps(60)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all text-left flex items-center justify-between ${
                          exportFps === 60
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>60 FPS (Ultra Smooth)</span>
                        {exportFps === 60 && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                      <button
                        onClick={() => setExportFps(30)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all text-left flex items-center justify-between ${
                          exportFps === 30
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>30 FPS (Standard)</span>
                        {exportFps === 30 && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
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
                      <span className="font-bold text-white">{exportFps} FPS</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Format:</span>
                      <span className="font-bold text-white uppercase">
                        .{getSupportedVideoMimeType().extension} ({getSupportedVideoMimeType().label})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Watermark:</span>
                      <span className="font-bold text-emerald-400">None (100% Clean)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handleCloseExportModal}
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
              )}

              {/* STATE 2: RECORDING & FINALIZING */}
              {(exportState === 'recording' || exportState === 'finalizing') && (
                <div className="space-y-4 py-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                      <span className="font-semibold text-white">
                        {exportTelemetry.phaseText}
                      </span>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold text-sm">
                      {exportTelemetry.percent}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        exportState === 'finalizing'
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 animate-pulse'
                          : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                      }`}
                      style={{ width: `${exportTelemetry.percent}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                      <span className="text-[11px] text-slate-400 block mb-0.5">Frame Counter:</span>
                      <span className="font-mono font-bold text-white">
                        Frame {exportTelemetry.currentFrame} / {exportTelemetry.totalFrames}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        ({exportTelemetry.fps} FPS · Render-tick estimate)
                      </span>
                    </div>

                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                      <span className="text-[11px] text-slate-400 block mb-0.5">Timeline Position:</span>
                      <span className="font-mono font-bold text-white">
                        {formatDurationDisplay(exportTelemetry.audioCurrentTime)} / {formatDurationDisplay(exportTelemetry.duration)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Audio track position
                      </span>
                    </div>

                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                      <span className="text-[11px] text-slate-400 block mb-0.5">Elapsed Time:</span>
                      <span className="font-mono font-bold text-white">
                        {formatDurationDisplay(exportTelemetry.elapsedSec)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Real-time recording
                      </span>
                    </div>

                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
                      <span className="text-[11px] text-slate-400 block mb-0.5">Estimated Remaining:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        ~{formatDurationDisplay(exportTelemetry.remainingSec)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        To packaging finish
                      </span>
                    </div>
                  </div>

                  <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-200">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Keep this tab active for smoothest 60 FPS hardware rendering.</span>
                      <span className="text-[11px] text-amber-300/80 leading-relaxed block mt-0.5">
                        Browsers throttle background tabs to save battery. Keeping this window in focus gives the best audio/video sync.
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCancelExport}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold bg-rose-950/40 text-rose-300 border border-rose-500/30 hover:bg-rose-900/40 transition-all flex items-center justify-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel Export
                  </button>
                </div>
              )}

              {/* STATE 3: COMPLETED */}
              {exportState === 'completed' && exportResult && (
                <div className="space-y-4 py-1">
                  <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Video Successfully Generated!</h4>
                      <p className="text-xs text-emerald-300/80">
                        1080p high-definition visualizer packaged with 100% A/V sync.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                    <div className="col-span-2">
                      <span className="text-slate-400 block mb-0.5">File Name:</span>
                      <span className="font-mono text-white font-semibold text-[11px] break-all">
                        {exportResult.fileName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">File Format:</span>
                      <span className="font-bold text-white uppercase">
                        .{exportResult.fileExtension} ({exportResult.mimeType.split(';')[0]})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">File Size:</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        {exportResult.formattedSize}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Duration:</span>
                      <span className="font-bold text-white font-mono">
                        {formatDurationDisplay(exportResult.durationSec)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Frame Rate:</span>
                      <span className="font-bold text-white font-mono">
                        {exportResult.fps} FPS
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <button
                      onClick={handleDownloadAgain}
                      className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Video Again (.{exportResult.fileExtension})
                    </button>
                    <p className="text-[11px] text-slate-400 text-center">
                      Your download was triggered automatically. If your browser blocked pop-up downloads, click the button above.
                    </p>
                    <button
                      onClick={handleCloseExportModal}
                      className="w-full py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                    >
                      Back to Editor
                    </button>
                  </div>
                </div>
              )}

              {/* STATE 4: ERROR & RECOVERY */}
              {exportState === 'error' && (
                <div className="space-y-4 py-1">
                  <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-4 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shrink-0">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Export Failed</h4>
                      <p className="text-xs text-rose-300/80 leading-relaxed">
                        {exportErrorMessage || 'Video encoding pipeline failed. Please retry.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handleCloseExportModal}
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleStartExport}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Retry Export
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 6. BELOW-THE-FOLD COMPREHENSIVE SEO & KNOWLEDGE HUB       */}
        {/* ========================================================= */}
        <div className="border-t border-slate-800 pt-10 space-y-12">
          <div className="bg-gradient-to-r from-emerald-950/30 via-slate-900 to-cyan-950/30 border border-emerald-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">100% Client-Side Private Video Studio</h3>
                <p className="text-xs text-slate-400 max-w-xl leading-relaxed mt-0.5">
                  Your audio files and personal photos never leave your device. All DSP frequency analysis,
                  canvas motion rendering, and video encoding happen entirely inside your browser memory.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-3.5 py-2 rounded-xl border border-emerald-500/30 whitespace-nowrap">
              <Check className="w-4 h-4" />
              Zero Forced Watermark
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white text-center mb-6">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  q: 'How does real audio reactivity work in this tool?',
                  a: 'The engine uses the Web Audio API with a 2048-point Fast Fourier Transform (FFT) and an asymmetric envelope follower. It calculates real energy across sub-bass (20-60 Hz), bass (60-250 Hz), midrange, and treble, driving concert stage lights, volumetric smoke, shockwave rings, and spectrum bars directly from your music.',
                },
                {
                  q: 'Why does animation stop triggering when audio is paused?',
                  a: 'Unlike decorative simulators that run constant timers or random number generators, our engine only generates visual reactions when audio data is flowing through the AnalyserNode. When paused, beat triggers and transient shockwaves halt immediately.',
                },
                {
                  q: 'What are the 12 One-Click Effect Combinations?',
                  a: 'Combinations like Neon Smoke Storm, Cosmic Bass Drop, Purple Smoke Galaxy, and Dark Club Blackout orchestrate visualizers, coloured smoke plumes, concert light sweepers, and particle shockwaves into a single cohesive concert aesthetic in one click.',
                },
                {
                  q: 'Can I reduce flashing lights for accessibility?',
                  a: 'Yes! The Beat Light Show tab and DSP Reactivity panel feature a "Reduce Flashing" toggle that automatically smooths out harsh transient strobes while maintaining fluid music synchronization.',
                },
                {
                  q: 'Why does IndiaTools support Indic fonts without broken letters?',
                  a: 'IndiaTools utilizes Intl.Segmenter with grapheme cluster granularity combined with Google Noto Indic Web Fonts. This ensures conjunct consonants, chillus, and dependent vowel signs in Malayalam, Telugu, Kannada, and Tamil render properly without broken ligatures.',
                },
                {
                  q: 'Is this audio spectrum video generator really 100% free with no watermark?',
                  a: 'Yes! IndiaTools believes in unrestricted creative freedom for musicians, creators, and editors. By default, the output video has zero watermark.',
                },
                {
                  q: 'What audio file formats are supported?',
                  a: 'You can upload MP3, WAV, AAC, M4A, OGG, and FLAC files. In addition, you can synthesize instant sample demo tracks directly in your browser with zero file uploads using our built-in Web Audio synthesizers.',
                },
                {
                  q: 'Does IndiaTools upload my audio or photos to any cloud server?',
                  a: 'Never. Everything runs 100% locally on your machine via Web Audio API, HTML5 Canvas, and MediaRecorder. Your intellectual property and private audio tracks stay completely private on your device.',
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
                  '12 Curated Audio-Reactive Effect Combos',
                  'Beat-Reactive Concert Light Show',
                  'Volumetric Audio Smoke & Mist',
                  '12 Particle Universe Systems & Bass Shockwaves',
                  'Live DSP Frequency Diagnostic VU Meters',
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
