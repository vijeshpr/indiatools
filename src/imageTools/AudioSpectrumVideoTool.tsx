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

  // -------------------------------------------------------------
  // AUDIO STATE (File, Buffer, Playback, Time, Drag & Drop)
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
  // PHOTO STATE (File, Image Element, Thumbnail, Layout, Drag & Drop)
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
  // COMPOSITION ENGINE STATE
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

  // -------------------------------------------------------------
  // STUDIO WORKSPACE NAVIGATION & UI TOGGLES
  // -------------------------------------------------------------
  const [activeTab, setActiveTab] = useState<'visualizers' | 'templates' | 'typography' | 'fx'>('visualizers')
  const [visualizerCategory, setVisualizerCategory] = useState<string>('all')
  const [templateCategory, setTemplateCategory] = useState<string>('all')
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('ml')
  const [showSafeZones, setShowSafeZones] = useState<boolean>(false)

  // -------------------------------------------------------------
  // VIDEO EXPORT MODAL STATE
  // -------------------------------------------------------------
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [targetExportLength, setTargetExportLength] = useState<'15s' | '30s' | '60s' | 'full'>('15s')
  const [exportFps, setExportFps] = useState<30 | 60>(60)
  const [exportProgress, setExportProgress] = useState<{
    percent: number
    elapsedSec: number
    remainingSec: number
  }>({ percent: 0, elapsedSec: 0, remainingSec: 0 })

  // -------------------------------------------------------------
  // AUDIO & CANVAS REFS
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

  // Stop audio playback safely
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

  // Hotkey Spacebar for Play/Pause
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
          // slice(0) avoids detached arrayBuffer memory errors across browsers
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

        // Update title layer
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

  // Demo audio track generator
  const handleLoadDemoTrack = useCallback(
    async (genre: DemoAudioGenre = 'synthwave') => {
      stopAllAudio()
      setIsLoadingAudio(true)
      try {
        const demoMeta = DEMO_TRACKS.find((t) => t.id === genre) || DEMO_TRACKS[0]
        showToast(`Synthesizing ${demoMeta.name}...`, 'info')
        const file = await generateVisualizerDemoSpecimen(genre)
        await handleProcessAudioFile(file)

        if (genre === 'synthwave') applyStudioTemplate('neon-night')
        else if (genre === 'lofi') applyStudioTemplate('lofi-night')
        else applyStudioTemplate('cinematic-portrait')

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
  // PHOTO UPLOAD HANDLERS (JPG, PNG, WebP with local preview)
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

  // Generate Sample Artwork Canvas in 1 click
  const handleLoadSampleArtwork = useCallback(() => {
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = 1080
    tempCanvas.height = 1080
    const ctx = tempCanvas.getContext('2d')
    if (!ctx) return

    // Draw radiant aesthetic artwork
    const grad = ctx.createRadialGradient(540, 540, 50, 540, 540, 600)
    grad.addColorStop(0, '#f97316')
    grad.addColorStop(0.4, '#8b5cf6')
    grad.addColorStop(0.8, '#06b6d4')
    grad.addColorStop(1, '#090a0f')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 1080, 1080)

    // Cosmic stardust specks
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

  // Change image presentation layout mode
  const handleSetImageLayoutMode = (mode: ImageLayoutMode) => {
    setState((prev) => ({
      ...prev,
      imageLayoutMode: mode,
      backgroundMode: mode === 'album-disc' ? 'blurred-cover' : prev.backgroundMode,
    }))
  }

  // -------------------------------------------------------------
  // STUDIO TEMPLATES & INDIC LANGUAGE
  // -------------------------------------------------------------
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
  // CANVAS RENDER LOOP (60 FPS with A/V sync)
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
    const freqData = new Uint8Array(state.fftSize / 2)
    const timeData = new Uint8Array(state.fftSize / 2)

    const render = () => {
      if (!isRunning) return

      const width = canvas.width
      const height = canvas.height
      const nowSec = performance.now() / 1000

      let renderTime = currentTime
      if (isPlaying && audioContextRef.current) {
        const elapsed = audioContextRef.current.currentTime - playbackStartTimeRef.current
        renderTime = Math.min(duration, playbackStartOffsetRef.current + elapsed)
        setCurrentTime(renderTime)
      }

      if (analyserRef.current && isPlaying) {
        analyserRef.current.getByteFrequencyData(freqData)
        analyserRef.current.getByteTimeDomainData(timeData)
      } else {
        // Idle gentle breathing animation when audio is paused
        for (let i = 0; i < freqData.length; i++) {
          freqData[i] = Math.max(0, Math.sin(nowSec * 2.2 + i * 0.12) * 32 + 18)
        }
        for (let i = 0; i < timeData.length; i++) {
          timeData[i] = 128 + Math.sin(nowSec * 3 + i * 0.06) * 8
        }
      }

      const bands = dspAnalyzerRef.current.analyze(freqData, renderTime)

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
  // VIDEO RECORDING & EXPORT EXECUTION
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

        const cleanTitle = (audioFileName || 'music_video').replace(/[^a-zA-Z0-9_-]/g, '_')
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
    await playFromOffset(0)
    session.start()
  }, [audioBuffer, targetExportLength, exportFps, audioFileName, state.activePreset, state.aspectRatio, getAudioContext, playFromOffset, stopAllAudio, showToast])

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

  const templateList = useMemo(() => {
    const all = Object.values(STUDIO_TEMPLATES)
    if (templateCategory === 'all') return all
    return all.filter((t) => t.category === templateCategory)
  }, [templateCategory])

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
                <span className="font-semibold text-white block">Lyrics & Style</span>
                <span className="text-[11px] text-slate-400">5 Indic Languages</span>
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
              /* Audio Loaded State */
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
              /* Photo Loaded State */
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

                {/* Photo Zoom & Darkness Sliders Toggle */}
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

          {/* Quick controls */}
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

          {/* Export Video Button */}
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
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 backdrop-blur-xl shadow-xl flex flex-col min-h-[640px]">
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
                20 Visualizer Styles
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
                20 Studio Presets
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
                Indic Typography
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

                <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    Spectrum Dynamics
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
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: 20 STUDIO TEMPLATES */}
            {activeTab === 'templates' && (
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
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
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: INDIC TYPOGRAPHY */}
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

            {/* TAB 4: CINEMATIC FX */}
            {activeTab === 'fx' && (
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <option value="monochrome-silver">Monochrome Silver</option>
                      <option value="crimson-cinema">Crimson Cinema</option>
                      <option value="ocean-sapphire">Ocean Sapphire</option>
                      <option value="cherry-blossom">Cherry Blossom Pastel</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Atmospheric Particles:</label>
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
                      <option value="none">Disabled</option>
                    </select>
                  </div>
                </div>

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
                        <span>Bass Camera Shake</span>
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
        {/* 5. VIDEO EXPORT MODAL                                     */}
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
                      <span className="font-bold text-white">{exportFps} FPS</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Format:</span>
                      <span className="font-bold text-white uppercase">
                        .{getSupportedVideoMimeType().extension}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Watermark:</span>
                      <span className="font-bold text-emerald-400">None (100% Clean)</span>
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
                <div className="space-y-4 py-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Rendering Frame by Frame in Real-Time...</span>
                    <span className="font-mono text-emerald-400 font-bold">{exportProgress.percent}%</span>
                  </div>

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

        {/* ========================================================= */}
        {/* 6. BELOW-THE-FOLD COMPREHENSIVE SEO & KNOWLEDGE HUB       */}
        {/* ========================================================= */}
        <div className="border-t border-slate-800 pt-10 space-y-12">
          {/* Privacy & Zero-Watermark Guarantee */}
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

          {/* Detailed FAQ Accordion */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white text-center mb-6">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  q: 'How do I create a music visualizer video for Instagram Reels and YouTube Shorts?',
                  a: 'Choose the 9:16 aspect ratio in the toolbar, click Upload Audio to select your MP3 or WAV, click Upload Photo for your cover artwork, pick a visualizer preset like Circular Harmonic Spectrum, and click Export Video. Your vertical Full HD video will be ready in seconds.',
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
