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
  Brush,
  Wind,
  Compass,
  Camera,
  Droplets,
  RotateCw,
  Orbit,
  EyeOff,
  Aperture,
  CircleDot,
  Flame,
  RefreshCw,
  BarChart3,
  Disc,
  Waves,
  Tv,
  SlidersHorizontal,
  Flower2,
  Sprout,
  Leaf,
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
  NormalizedAudioBands,
} from '../lib/audioToVideo/types'
import {
  CameraMotionPreset,
  CameraEasing,
  DepthMode,
  AtmosphericParticleType,
  CinematicColorPreset,
  CINEMATIC_COLOR_PRESETS,
  DEFAULT_PHOTO_MOTION_CONFIG,
  PhotoMotionStudioConfig,
} from '../lib/audioToVideo/photoMotionTypes'
import {
  CinematicPortalStudioConfig,
  DEFAULT_PORTAL_VFX_CONFIG,
  PORTAL_VFX_PRESETS,
  PortalPreset,
  PortalModuleId,
} from '../lib/portalVfx/portalTypes'
import {
  GARDEN_SCENES,
  getGardenScene,
} from '../lib/garden/gardenPresets'
import {
  DEFAULT_GARDEN_CONFIG,
  GardenSceneId,
  MusicGrownGardenConfig,
} from '../lib/garden/gardenTypes'
import { BACKGROUND_PRESETS } from '../lib/audioToVideo/backgroundPresets'
import { AudioToVideoAudioEngine } from '../lib/audioToVideo/audioToVideoAudioEngine'
import { AudioToVideoRenderEngine } from '../lib/audioToVideo/audioToVideoRenderEngine'
import {
  AudioToVideoExportEngine,
  ExportProgress,
} from '../lib/audioToVideo/audioToVideoExportEngine'

type StudioTab =
  | 'portal'
  | 'photomotion'
  | 'garden'
  | 'background'
  | 'visualizer'
  | 'cinematic'
  | 'typography'
  | 'audio'

export const AudioToVideoStudioTool: React.FC = () => {
  const tool = getToolBySlug('audio-to-video-studio')
  const { showToast } = useToast()

  // Composition State
  const [composition, setComposition] = useState<StudioCompositionConfig>(DEFAULT_STUDIO_COMPOSITION)
  const [activeTab, setActiveTab] = useState<StudioTab>('visualizer')

  // Portal VFX Studio State
  const [selectedPresetModal, setSelectedPresetModal] = useState<PortalPreset | null>(null)
  const [isDraggingPortal, setIsDraggingPortal] = useState<boolean>(false)
  const [isResizingPortal, setIsResizingPortal] = useState<boolean>(false)
  const portalImageInputRef = useRef<HTMLInputElement | null>(null)
  const interiorBgInputRef = useRef<HTMLInputElement | null>(null)

  // 2.5D Photo Motion & Mask Studio State
  const [isMaskModalOpen, setIsMaskModalOpen] = useState<boolean>(false)
  const [brushSize, setBrushSize] = useState<number>(36)
  const [isEraser, setIsEraser] = useState<boolean>(false)
  const [isPainting, setIsPainting] = useState<boolean>(false)
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const photoMotionInputRef = useRef<HTMLInputElement | null>(null)
  const foregroundInputRef = useRef<HTMLInputElement | null>(null)

  // Garden Studio State & Refs
  const gardenPhotoInputRef = useRef<HTMLInputElement | null>(null)
  const frameCounterRef = useRef<number>(0)
  const [liveBands, setLiveBands] = useState<NormalizedAudioBands>({
    bass: 0,
    mid: 0,
    treble: 0,
    subBass: 0,
    overall: 0,
    isBeatHit: false,
  })

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
          let { bands, freqData, timeData } = audio.analyze()
          let time = audio.getCurrentTime()
          const dur = audio.getDuration() || 30

          // Standby preview animation: if no audio track is loaded yet, generate smooth rhythmic pulses so the video canvas is visibly active with equalizer movement and bass punch!
          if (!audio.isAudioLoaded()) {
            const now = performance.now() / 1000
            time = now
            // Gentle rhythmic bass kick pulse (~120 BPM, cycle every 0.5s)
            const kickPhase = (now % 0.5) / 0.5
            const ambientBass = Math.max(0, Math.exp(-kickPhase * 5) * 0.85)
            const ambientMid = 0.3 + 0.15 * Math.sin(now * 3.2)
            const ambientTreble = 0.25 + 0.12 * Math.cos(now * 4.8)
            bands = {
              bass: ambientBass,
              mid: ambientMid,
              treble: ambientTreble,
              subBass: ambientBass * 0.9,
              overall: (ambientBass + ambientMid + ambientTreble) / 3,
              isBeatHit: ambientBass > 0.6,
            }

            const dummyFreq = new Uint8Array(1024)
            for (let i = 0; i < 128; i++) {
              const wave1 = Math.sin(i * 0.18 + now * 5) * 0.5 + 0.5
              const wave2 = Math.cos(i * 0.32 - now * 3.5) * 0.5 + 0.5
              const falloff = Math.max(0.08, 1 - i / 96)
              dummyFreq[i] = Math.min(255, Math.floor((wave1 * 0.5 + wave2 * 0.3 + ambientBass * 0.7) * falloff * 230))
            }
            freqData = dummyFreq

            const dummyTime = new Uint8Array(1024)
            for (let i = 0; i < 1024; i++) {
              dummyTime[i] = Math.floor(128 + Math.sin(i * 0.04 + now * 7) * 32 * (ambientBass * 0.8 + 0.3))
            }
            timeData = dummyTime
          }

          // Update playback time state throttled
          if (audio.isAudioLoaded()) {
            setCurrentTime(time)
            if (audio.isEnded() && isPlaying) {
              setIsPlaying(false)
            }
          }

          // Update live DSP meters throttled every ~4 frames
          frameCounterRef.current++
          if (frameCounterRef.current % 4 === 0) {
            setLiveBands(bands)
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
    if (!audioEngineRef.current.isAudioLoaded()) {
      showToast('Synthesizing demo beat for playback...', 'info')
      handleGenerateDemoAudio().then(() => {
        audioEngineRef.current?.play().then(() => setIsPlaying(true))
      })
      return
    }
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

  // =========================================================
  // CINEMATIC PORTAL VFX HANDLERS
  // =========================================================

  // Handle Main Photograph Import
  const handlePortalImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (JPG, PNG, WebP)', 'error')
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
      portalVfx: {
        ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
        sourceImageUrl: url,
        sourceImageName: file.name,
        isBeforePreviewActive: false,
        masterAllEffectsEnabled: true,
      },
    }))
    showToast(`Imported ${file.name} — Clean preview active with zero effects`, 'success')
  }

  // Handle Portal Interior Secondary Image Upload
  const handleInteriorBgUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (JPG, PNG, WebP) for interior', 'error')
      return
    }
    const url = URL.createObjectURL(file)
    setComposition((prev) => ({
      ...prev,
      portalVfx: {
        ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
        interior: {
          ...(prev.portalVfx?.interior || DEFAULT_PORTAL_VFX_CONFIG.interior),
          enabled: true,
          interiorBgUrl: url,
          interiorBgName: file.name,
        },
      },
    }))
    showToast(`Loaded interior background: ${file.name}`, 'success')
  }

  const handleRemoveInteriorBg = () => {
    setComposition((prev) => ({
      ...prev,
      portalVfx: {
        ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
        interior: {
          ...(prev.portalVfx?.interior || DEFAULT_PORTAL_VFX_CONFIG.interior),
          interiorBgUrl: null,
          interiorBgName: undefined,
        },
      },
    }))
    showToast('Interior background removed', 'info')
  }

  // Reset All Effects — Turns every module OFF and restores clean original preview
  const handleResetAllPortalEffects = () => {
    setComposition((prev) => ({
      ...prev,
      portalVfx: {
        ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
        masterAllEffectsEnabled: true,
        isBeforePreviewActive: false,
        ring: { ...(prev.portalVfx?.ring || DEFAULT_PORTAL_VFX_CONFIG.ring), enabled: false },
        energyFlow: { ...(prev.portalVfx?.energyFlow || DEFAULT_PORTAL_VFX_CONFIG.energyFlow), enabled: false },
        interior: { ...(prev.portalVfx?.interior || DEFAULT_PORTAL_VFX_CONFIG.interior), enabled: false },
        lightSpill: { ...(prev.portalVfx?.lightSpill || DEFAULT_PORTAL_VFX_CONFIG.lightSpill), enabled: false },
        shockwave: { ...(prev.portalVfx?.shockwave || DEFAULT_PORTAL_VFX_CONFIG.shockwave), enabled: false },
        particles: { ...(prev.portalVfx?.particles || DEFAULT_PORTAL_VFX_CONFIG.particles), enabled: false },
        opening: { ...(prev.portalVfx?.opening || DEFAULT_PORTAL_VFX_CONFIG.opening), enabled: false },
        exitTransition: { ...(prev.portalVfx?.exitTransition || DEFAULT_PORTAL_VFX_CONFIG.exitTransition), enabled: false },
        audioReactivity: { ...(prev.portalVfx?.audioReactivity || DEFAULT_PORTAL_VFX_CONFIG.audioReactivity), enabled: false },
      },
    }))
    showToast('Reset all effects — Clean original preview restored', 'info')
  }

  // Toggle Master Switch (Bypass / Enable without losing custom parameters)
  const toggleMasterAllEffects = () => {
    setComposition((prev) => {
      const current = prev.portalVfx?.masterAllEffectsEnabled ?? true
      const next = !current
      showToast(next ? 'All effects enabled' : 'Master bypass active (all effects muted)', next ? 'success' : 'info')
      return {
        ...prev,
        portalVfx: {
          ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
          masterAllEffectsEnabled: next,
        },
      }
    })
  }

  // Toggle Before / After (Temporary bypass)
  const toggleBeforeAfter = () => {
    setComposition((prev) => {
      const current = prev.portalVfx?.isBeforePreviewActive ?? false
      const next = !current
      return {
        ...prev,
        portalVfx: {
          ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
          isBeforePreviewActive: next,
        },
      }
    })
  }

  // Explicit Preset Application with Confirmation
  const handleApplyPreset = (preset: PortalPreset) => {
    setComposition((prev) => ({
      ...prev,
      portalVfx: preset.apply(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
    }))
    setSelectedPresetModal(null)
    showToast(`Applied preset: ${preset.name}`, 'success')
  }

  // 1-Click Clean Sample Scene Synthesizer (Ancient Stone Chamber)
  const handleLoadSamplePortalPhoto = () => {
    try {
      const offscreen = document.createElement('canvas')
      offscreen.width = 1920
      offscreen.height = 1080
      const ctx = offscreen.getContext('2d')
      if (!ctx) return

      // Dark ancient stone chamber
      const wallGrad = ctx.createLinearGradient(0, 0, 0, 1080)
      wallGrad.addColorStop(0, '#07090E')
      wallGrad.addColorStop(0.4, '#0F172A')
      wallGrad.addColorStop(0.8, '#1E293B')
      wallGrad.addColorStop(1, '#090D16')
      ctx.fillStyle = wallGrad
      ctx.fillRect(0, 0, 1920, 1080)

      // Stone floor perspective grid
      ctx.fillStyle = '#0B1120'
      ctx.beginPath()
      ctx.moveTo(0, 780)
      ctx.lineTo(1920, 780)
      ctx.lineTo(1920, 1080)
      ctx.lineTo(0, 1080)
      ctx.closePath()
      ctx.fill()

      // Floor stone joints
      ctx.strokeStyle = '#1E293B'
      ctx.lineWidth = 2
      for (let x = -200; x <= 2120; x += 180) {
        ctx.beginPath()
        ctx.moveTo(960 + (x - 960) * 0.15, 780)
        ctx.lineTo(x, 1080)
        ctx.stroke()
      }

      // Massive stone pillars framing portal area
      ctx.fillStyle = '#172033'
      ctx.fillRect(280, 140, 120, 640)
      ctx.fillRect(1520, 140, 120, 640)

      // Stone arch header
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 18
      ctx.strokeRect(340, 140, 1240, 640)

      const url = offscreen.toDataURL('image/jpeg', 0.92)
      setComposition((prev) => ({
        ...prev,
        background: { ...prev.background, singleImageUrl: url, mode: 'single-image' },
        portalVfx: {
          ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
          sourceImageUrl: url,
          sourceImageName: 'Stargate_Ancient_Chamber_1080p.jpg',
          isBeforePreviewActive: false,
          masterAllEffectsEnabled: true,
        },
      }))
      showToast('Loaded 1080p Ancient Chamber Photo — Clean neutral preview ready', 'success')
    } catch {
      showToast('Could not synthesize sample scene', 'error')
    }
  }

  // =========================================================
  // 2.5D PHOTO MOTION & BRUSH MASK HANDLERS
  // =========================================================

  // Handle Photo Motion Image Upload
  const handlePhotoMotionImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (JPG, PNG, WebP)', 'error')
      return
    }
    const url = URL.createObjectURL(file)
    setComposition((prev) => ({
      ...prev,
      photoMotion: {
        ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
        enabled: true,
        sourceImageUrl: url,
        sourceImageName: file.name,
      },
    }))
    showToast(`Loaded ${file.name} into 2.5D Motion Studio`, 'success')
  }

  // Handle Foreground Layer Upload (Dual-Layer Parallax Mode)
  const handleForegroundLayerUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload a PNG or image with transparency for Foreground', 'error')
      return
    }
    const url = URL.createObjectURL(file)
    setComposition((prev) => ({
      ...prev,
      photoMotion: {
        ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
        enabled: true,
        depth: {
          ...(prev.photoMotion?.depth || DEFAULT_PHOTO_MOTION_CONFIG.depth),
          mode: 'manual-layers',
          foregroundUrl: url,
        },
      },
    }))
    showToast('Foreground parallax layer loaded', 'success')
  }

  // Synthesize Instant 1080p Cozy Mountain Cabin Scene (1-Click Test)
  const handleLoadSamplePhoto = () => {
    try {
      const offscreen = document.createElement('canvas')
      offscreen.width = 1920
      offscreen.height = 1080
      const ctx = offscreen.getContext('2d')
      if (!ctx) return

      // Sky & Twilight Horizon
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 750)
      skyGrad.addColorStop(0, '#060B18')
      skyGrad.addColorStop(0.4, '#0F1D38')
      skyGrad.addColorStop(0.7, '#1B2E4B')
      skyGrad.addColorStop(1, '#2F4858')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, 1920, 1080)

      // Distant Misty Mountain Silhouettes
      ctx.fillStyle = '#111E38'
      ctx.beginPath()
      ctx.moveTo(0, 700)
      ctx.lineTo(320, 430)
      ctx.lineTo(680, 600)
      ctx.lineTo(1100, 380)
      ctx.lineTo(1520, 570)
      ctx.lineTo(1920, 440)
      ctx.lineTo(1920, 1080)
      ctx.lineTo(0, 1080)
      ctx.closePath()
      ctx.fill()

      // Midground Pine Forest Ridge
      ctx.fillStyle = '#062B28'
      for (let x = 0; x < 1920; x += 32) {
        const treeH = 100 + Math.sin(x * 0.04) * 55 + Math.cos(x * 0.1) * 20
        ctx.beginPath()
        ctx.moveTo(x, 780)
        ctx.lineTo(x + 16, 780 - treeH)
        ctx.lineTo(x + 32, 780)
        ctx.closePath()
        ctx.fill()
      }

      // Foreground Cozy Cabin Wood Frame
      ctx.fillStyle = '#1A120B'
      ctx.fillRect(0, 0, 240, 1080) // Left wall
      ctx.fillRect(1680, 0, 240, 1080) // Right wall
      ctx.fillRect(0, 0, 1920, 150) // Top beam
      ctx.fillRect(0, 910, 1920, 170) // Bottom wooden sill
      ctx.fillRect(940, 150, 40, 760) // Center mullion
      ctx.fillRect(240, 520, 1440, 35) // Horizontal crossbar

      // Warm Golden Bedside Lamp on Sill
      const lampGrad = ctx.createRadialGradient(420, 870, 8, 420, 870, 260)
      lampGrad.addColorStop(0, 'rgba(251, 191, 36, 0.88)')
      lampGrad.addColorStop(0.35, 'rgba(245, 158, 11, 0.35)')
      lampGrad.addColorStop(1, 'rgba(245, 158, 11, 0)')
      ctx.fillStyle = lampGrad
      ctx.beginPath()
      ctx.arc(420, 870, 260, 0, Math.PI * 2)
      ctx.fill()

      // Lamp Base & Shade
      ctx.fillStyle = '#B45309'
      ctx.fillRect(405, 840, 30, 70)
      ctx.beginPath()
      ctx.arc(420, 835, 25, Math.PI, 0)
      ctx.fill()

      const dataUrl = offscreen.toDataURL('image/jpeg', 0.92)
      setComposition((prev) => ({
        ...prev,
        photoMotion: {
          ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
          enabled: true,
          sourceImageUrl: dataUrl,
          sourceImageName: 'Cozy_Mountain_Cabin_1080p.jpg',
          camera: {
            ...(prev.photoMotion?.camera || DEFAULT_PHOTO_MOTION_CONFIG.camera),
            preset: 'gentle-float',
            speed: 1.0,
            intensity: 6,
          },
          atmosphere: {
            ...(prev.photoMotion?.atmosphere || DEFAULT_PHOTO_MOTION_CONFIG.atmosphere),
            rainEnabled: true,
            windowDropletsOverlay: true,
            fogEnabled: true,
            particlesEnabled: true,
            particleType: 'fireflies',
            particleCount: 50,
          },
          lighting: {
            ...(prev.photoMotion?.lighting || DEFAULT_PHOTO_MOTION_CONFIG.lighting),
            preset: 'romantic-rain',
            vignette: 50,
            ambientGlow: 40,
          },
        },
      }))
      showToast('Loaded 1080p Cozy Cabin Scene into 2.5D Motion Studio', 'success')
    } catch {
      showToast('Could not synthesize sample scene', 'error')
    }
  }

  // Remove Photo Motion
  const handleRemovePhotoMotion = () => {
    setComposition((prev) => ({
      ...prev,
      photoMotion: {
        ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
        enabled: false,
        sourceImageUrl: null,
        sourceImageName: undefined,
      },
    }))
    showToast('Photo Motion cleared', 'info')
  }

  // Brush Mask Canvas Editor Handlers
  const openMaskEditor = () => {
    if (!composition.photoMotion?.sourceImageUrl) {
      showToast('Please upload or load a photo first before creating a mask', 'info')
      return
    }
    setIsMaskModalOpen(true)
  }

  // Initialize or re-sync Mask Canvas when modal opens
  useEffect(() => {
    if (!isMaskModalOpen || !maskCanvasRef.current || !composition.photoMotion?.sourceImageUrl) return
    const canvas = maskCanvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 960
    canvas.height = 540
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // If a saved mask exists, draw it back onto the canvas
    if (composition.photoMotion.depth.maskDataUrl) {
      const savedMask = new Image()
      savedMask.onload = () => {
        ctx.drawImage(savedMask, 0, 0, canvas.width, canvas.height)
      }
      savedMask.src = composition.photoMotion.depth.maskDataUrl
    }
  }, [isMaskModalOpen, composition.photoMotion?.sourceImageUrl, composition.photoMotion?.depth.maskDataUrl])

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = maskCanvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }

  const startMaskDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsPainting(true)
    drawMask(e)
  }

  const drawMask = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isPainting && e.type !== 'mousedown' && e.type !== 'touchstart') return
    const canvas = maskCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { x, y } = getCanvasCoords(e)

    ctx.save()
    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2)
      ctx.fillStyle = '#000000'
      ctx.fill()
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.beginPath()
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(239, 68, 68, 0.75)'
      ctx.shadowColor = 'rgba(239, 68, 68, 0.4)'
      ctx.shadowBlur = 4
      ctx.fill()
    }
    ctx.restore()
  }

  const stopMaskDrawing = () => {
    setIsPainting(false)
  }

  const handleClearMask = () => {
    const canvas = maskCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    showToast('Mask cleared', 'info')
  }

  const handleInvertMask = () => {
    const canvas = maskCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imgData.data
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 10) {
        data[i + 3] = 0 // clear drawn
      } else {
        data[i] = 239
        data[i + 1] = 68
        data[i + 2] = 68
        data[i + 3] = 190 // fill inverse
      }
    }
    ctx.putImageData(imgData, 0, 0)
    showToast('Mask inverted', 'info')
  }

  const handleSaveMask = () => {
    const canvas = maskCanvasRef.current
    if (!canvas) return
    const maskDataUrl = canvas.toDataURL('image/png')
    setComposition((prev) => ({
      ...prev,
      photoMotion: {
        ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
        enabled: true,
        depth: {
          ...(prev.photoMotion?.depth || DEFAULT_PHOTO_MOTION_CONFIG.depth),
          mode: 'brush-mask',
          maskDataUrl,
        },
      },
    }))
    setIsMaskModalOpen(false)
    showToast('Brush mask applied to 2.5D Parallax Compositor!', 'success')
  }

  // Handle Custom Garden Photo Upload
  const handleGardenPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setComposition((prev) => ({
      ...prev,
      gardenStudio: {
        ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
        enabled: true,
        sceneId: 'custom-photo',
        customPhoto: {
          ...(prev.gardenStudio?.customPhoto || DEFAULT_GARDEN_CONFIG.customPhoto),
          customImageUrl: url,
        },
      },
    }))
    showToast('Loaded custom garden photograph', 'success')
  }

  // Handle Garden Reset
  const handleResetGarden = () => {
    setComposition((prev) => ({
      ...prev,
      gardenStudio: DEFAULT_GARDEN_CONFIG,
    }))
    showToast('Reset all garden effects to neutral', 'info')
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
            {/* Viewport Action Controls Bar */}
            <div className="bg-[#090A0F] border border-white/10 rounded-2xl p-2.5 px-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xl">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                  <Aperture className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Viewport:</span>
                </span>
                {(['fit', 'fill', 'original'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() =>
                      setComposition((prev) => ({
                        ...prev,
                        portalVfx: {
                          ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                          imageFit: mode,
                        },
                      }))
                    }
                    className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all ${
                      (composition.portalVfx?.imageFit || 'fit') === mode
                        ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {/* 1-Click Garden Studio Mode Switch */}
                <button
                  onClick={() => setActiveTab('garden')}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'garden'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400'
                      : 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:text-white hover:bg-emerald-900/60'
                  }`}
                  title="Switch directly to Music-Grown Garden Studio"
                >
                  <Flower2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>🌸 Garden Studio</span>
                </button>

                {/* Master All Effects Bypass/Enable */}
                <button
                  onClick={toggleMasterAllEffects}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                    composition.portalVfx?.masterAllEffectsEnabled
                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 shadow'
                      : 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                  }`}
                  title="Toggle master bypass for all visual effects without deleting settings"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{composition.portalVfx?.masterAllEffectsEnabled ? 'All Effects: ON' : 'All Effects: BYPASS'}</span>
                </button>

                {/* Before / After Preview Switch */}
                <button
                  onClick={toggleBeforeAfter}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                    composition.portalVfx?.isBeforePreviewActive
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white'
                  }`}
                  title="Toggle Before (100% clean photo) vs After (with active VFX)"
                >
                  {composition.portalVfx?.isBeforePreviewActive ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Viewing: Clean Before</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Before / After</span>
                    </>
                  )}
                </button>

                {/* Reset All Effects Button */}
                <button
                  onClick={handleResetAllPortalEffects}
                  className="px-2.5 py-1.5 rounded-xl font-bold bg-slate-900 hover:bg-red-950/40 border border-white/10 text-slate-400 hover:text-red-300 flex items-center gap-1"
                  title="Turn off every effect and restore the clean original photo"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Effects</span>
                </button>
              </div>
            </div>

            {/* Visualizer Canvas Container */}
            <div
              className="relative w-full aspect-video bg-[#05060A] rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center group select-none"
              onMouseMove={(e) => {
                if (!isDraggingPortal || !composition.portalVfx?.ring.enabled) return
                const rect = e.currentTarget.getBoundingClientRect()
                const newX = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100))
                const newY = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100))
                setComposition((prev) => ({
                  ...prev,
                  portalVfx: {
                    ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                    ring: {
                      ...(prev.portalVfx?.ring || DEFAULT_PORTAL_VFX_CONFIG.ring),
                      posX: Math.round(newX),
                      posY: Math.round(newY),
                    },
                  },
                }))
              }}
              onMouseUp={() => setIsDraggingPortal(false)}
              onMouseLeave={() => setIsDraggingPortal(false)}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain pointer-events-none"
              />

              {/* On-Canvas Interactive Drag Handle (When Portal Ring is Enabled) */}
              {activeTab === 'portal' &&
                composition.portalVfx?.sourceImageUrl &&
                composition.portalVfx?.ring.enabled && (
                  <div
                    style={{
                      left: `${composition.portalVfx.ring.posX}%`,
                      top: `${composition.portalVfx.ring.posY}%`,
                    }}
                    onMouseDown={() => setIsDraggingPortal(true)}
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-cyan-400 bg-black/60 backdrop-blur-md cursor-move flex items-center justify-center hover:scale-125 transition-transform shadow-lg shadow-cyan-500/40 group/handle"
                    title="Click and drag to position portal"
                  >
                    <CircleDot className="w-4 h-4 text-cyan-300 animate-pulse" />
                    <span className="absolute -top-6 px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/80 text-cyan-300 border border-cyan-500/30 opacity-0 group-hover/handle:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                      Drag Portal ({composition.portalVfx.ring.posX}%, {composition.portalVfx.ring.posY}%)
                    </span>
                  </div>
                )}

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
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 bg-[#090A0F] p-1.5 rounded-2xl border border-white/10">
              {[
                { id: 'portal', label: 'Portal VFX', icon: Orbit },
                { id: 'photomotion', label: '2.5D Motion', icon: Film },
                { id: 'garden', label: 'Garden', icon: Flower2 },
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
                    className={`flex flex-col items-center justify-center py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                      isActive
                        ? 'bg-gradient-to-tr from-emerald-600/30 via-teal-600/30 to-cyan-500/20 text-emerald-300 border border-emerald-400 shadow-md'
                        : tab.id === 'garden'
                        ? 'text-emerald-300 bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-900/50 hover:text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1 ${tab.id === 'garden' && !isActive ? 'text-emerald-400' : ''}`} />
                    <div className="flex items-center gap-1">
                      <span>{tab.label}</span>
                      {tab.id === 'garden' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* TAB CONTENT PANELS */}
            <div className="bg-[#090A0F] border border-white/10 rounded-2xl p-5 shadow-2xl max-h-[580px] overflow-y-auto space-y-5">
              {/* TAB 0: CINEMATIC PORTAL VFX STUDIO */}
              {activeTab === 'portal' && (
                <div className="space-y-6">
                  {/* Hidden Photo Inputs */}
                  <input
                    type="file"
                    ref={portalImageInputRef}
                    onChange={(e) => e.target.files?.[0] && handlePortalImageUpload(e.target.files[0])}
                    accept="image/*,.jpg,.jpeg,.png,.webp"
                    className="hidden"
                  />
                  <input
                    type="file"
                    ref={interiorBgInputRef}
                    onChange={(e) => e.target.files?.[0] && handleInteriorBgUpload(e.target.files[0])}
                    accept="image/*,.jpg,.jpeg,.png,.webp"
                    className="hidden"
                  />

                  {/* Header & Master Controls */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 flex items-center justify-center">
                        <Orbit className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>Cinematic Portal VFX Studio</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            After Effects VFX
                          </span>
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Composite dimensional portals with energy arcs, light spill, and shockwaves
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleMasterAllEffects}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          composition.portalVfx?.masterAllEffectsEnabled
                            ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                        title="Master switch: Toggle all visual effects without deleting settings"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>{composition.portalVfx?.masterAllEffectsEnabled ? 'Active' : 'Bypassed'}</span>
                      </button>

                      <button
                        onClick={handleResetAllPortalEffects}
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-950/50 text-slate-400 hover:text-red-300 border border-white/10"
                        title="Reset all effects to clean preview"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* SECTION 1: SOURCE PHOTOGRAPH IMPORT */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Base Photograph (Clean Canvas)</span>
                      </span>
                      {composition.portalVfx?.sourceImageUrl && (
                        <span className="text-[10px] text-emerald-400 font-mono">● 100% Client-Side Loaded</span>
                      )}
                    </label>

                    {composition.portalVfx?.sourceImageUrl ? (
                      <div className="p-3 bg-slate-900/90 border border-white/10 rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={composition.portalVfx.sourceImageUrl}
                            alt="Portal Base"
                            className="w-14 h-14 rounded-lg object-cover border border-white/15 shrink-0 bg-slate-950"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">
                              {composition.portalVfx.sourceImageName || 'Photograph Loaded'}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Drag on canvas to position & resize portal
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => portalImageInputRef.current?.click()}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10"
                          >
                            Replace
                          </button>
                          <button
                            onClick={() =>
                              setComposition((prev) => ({
                                ...prev,
                                background: { ...prev.background, singleImageUrl: null },
                                portalVfx: {
                                  ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                  sourceImageUrl: null,
                                  sourceImageName: undefined,
                                },
                              }))
                            }
                            className="p-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-white/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={() => portalImageInputRef.current?.click()}
                          className="p-4 rounded-xl border border-white/10 bg-slate-900/80 hover:border-cyan-400/50 flex flex-col items-center justify-center gap-2 text-slate-300 hover:text-white transition-all group"
                        >
                          <Upload className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold">Import Photograph</span>
                          <span className="text-[10px] text-slate-500">JPG, PNG, WebP</span>
                        </button>

                        <button
                          onClick={handleLoadSamplePortalPhoto}
                          className="p-4 rounded-xl border border-violet-500/30 bg-violet-950/20 hover:bg-violet-950/40 flex flex-col items-center justify-center gap-2 text-violet-300 hover:text-white transition-all group"
                        >
                          <Sparkles className="w-5 h-5 text-violet-400 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold">1-Click Test Scene</span>
                          <span className="text-[10px] text-slate-400">Loads 1080p Ancient Chamber</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* SECTION 2: CURATED VFX PRESETS (EXPLICIT USER CONFIRMATION) */}
                  <div className="space-y-3 pt-2 border-t border-white/5">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Curated VFX Presets (Optional)</span>
                      </span>
                      <span className="text-[10px] text-slate-500">Explicit User Action Only</span>
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {PORTAL_VFX_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => setSelectedPresetModal(preset)}
                          className="p-2.5 rounded-xl border border-white/10 bg-slate-900/70 hover:border-cyan-400/50 text-left transition-all group"
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0 group-hover:scale-125 transition-transform"
                              style={{ backgroundColor: preset.accentColor }}
                            />
                            <span className="text-[11px] font-bold text-white truncate">{preset.name}</span>
                          </div>
                          <div className="text-[9px] text-slate-400 line-clamp-1">{preset.subtitle}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SECTION 3: 8 INDEPENDENT EFFECT MODULES (ALL OFF BY DEFAULT) */}
                  <div className="space-y-4 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Independent Effect Modules</span>
                      </label>
                      <span className="text-[10px] text-slate-400">All Modules Start OFF</span>
                    </div>

                    {/* MODULE A: PORTAL RING */}
                    <div className="p-3.5 bg-slate-900/60 border border-white/10 rounded-xl space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CircleDot className="w-4 h-4 text-cyan-400" />
                          <span className="font-bold text-white">A. Portal Dimensional Ring</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={composition.portalVfx?.ring.enabled ?? false}
                          onChange={(e) =>
                            setComposition((prev) => ({
                              ...prev,
                              portalVfx: {
                                ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                ring: {
                                  ...(prev.portalVfx?.ring || DEFAULT_PORTAL_VFX_CONFIG.ring),
                                  enabled: e.target.checked,
                                },
                              },
                            }))
                          }
                          className="w-4 h-4 accent-cyan-400 cursor-pointer"
                        />
                      </div>

                      {composition.portalVfx?.ring.enabled && (
                        <div className="space-y-3 pt-2 border-t border-white/5">
                          {/* Shape selector */}
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-[11px]">Portal Shape</span>
                            <div className="flex bg-slate-950 p-0.5 rounded-lg border border-white/10 text-[11px]">
                              {(['circle', 'ellipse', 'oval'] as const).map((s) => (
                                <button
                                  key={s}
                                  onClick={() =>
                                    setComposition((prev) => ({
                                      ...prev,
                                      portalVfx: {
                                        ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                        ring: {
                                          ...(prev.portalVfx?.ring || DEFAULT_PORTAL_VFX_CONFIG.ring),
                                          shape: s,
                                        },
                                      },
                                    }))
                                  }
                                  className={`px-2.5 py-1 rounded font-bold capitalize ${
                                    (composition.portalVfx?.ring.shape || 'ellipse') === s
                                      ? 'bg-cyan-500 text-black shadow'
                                      : 'text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Dimensions & Rotation */}
                          <div className="grid grid-cols-2 gap-3 text-[11px]">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-slate-400">Width</span>
                                <span className="text-cyan-400 font-mono">
                                  {composition.portalVfx?.ring.width || 360}px
                                </span>
                              </div>
                              <input
                                type="range"
                                min="100"
                                max="900"
                                value={composition.portalVfx?.ring.width || 360}
                                onChange={(e) =>
                                  setComposition((prev) => ({
                                    ...prev,
                                    portalVfx: {
                                      ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                      ring: {
                                        ...(prev.portalVfx?.ring || DEFAULT_PORTAL_VFX_CONFIG.ring),
                                        width: parseInt(e.target.value),
                                      },
                                    },
                                  }))
                                }
                                className="w-full accent-cyan-400"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-slate-400">Height</span>
                                <span className="text-cyan-400 font-mono">
                                  {composition.portalVfx?.ring.height || 360}px
                                </span>
                              </div>
                              <input
                                type="range"
                                min="100"
                                max="900"
                                value={composition.portalVfx?.ring.height || 360}
                                onChange={(e) =>
                                  setComposition((prev) => ({
                                    ...prev,
                                    portalVfx: {
                                      ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                      ring: {
                                        ...(prev.portalVfx?.ring || DEFAULT_PORTAL_VFX_CONFIG.ring),
                                        height: parseInt(e.target.value),
                                      },
                                    },
                                  }))
                                }
                                className="w-full accent-cyan-400"
                              />
                            </div>
                          </div>

                          {/* Thickness & Glow */}
                          <div className="grid grid-cols-2 gap-3 text-[11px]">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-slate-400">Ring Thickness</span>
                                <span className="text-cyan-400 font-mono">
                                  {composition.portalVfx?.ring.thickness || 14}px
                                </span>
                              </div>
                              <input
                                type="range"
                                min="2"
                                max="40"
                                value={composition.portalVfx?.ring.thickness || 14}
                                onChange={(e) =>
                                  setComposition((prev) => ({
                                    ...prev,
                                    portalVfx: {
                                      ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                      ring: {
                                        ...(prev.portalVfx?.ring || DEFAULT_PORTAL_VFX_CONFIG.ring),
                                        thickness: parseInt(e.target.value),
                                      },
                                    },
                                  }))
                                }
                                className="w-full accent-cyan-400"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-slate-400">Glow Intensity</span>
                                <span className="text-cyan-400 font-mono">
                                  {composition.portalVfx?.ring.glowIntensity || 65}%
                                </span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={composition.portalVfx?.ring.glowIntensity || 65}
                                onChange={(e) =>
                                  setComposition((prev) => ({
                                    ...prev,
                                    portalVfx: {
                                      ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                      ring: {
                                        ...(prev.portalVfx?.ring || DEFAULT_PORTAL_VFX_CONFIG.ring),
                                        glowIntensity: parseInt(e.target.value),
                                      },
                                    },
                                  }))
                                }
                                className="w-full accent-cyan-400"
                              />
                            </div>
                          </div>

                          {/* Ring Colors */}
                          <div className="grid grid-cols-2 gap-3 pt-1">
                            <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-white/5">
                              <span className="text-[11px] text-slate-400">Primary Core</span>
                              <input
                                type="color"
                                value={composition.portalVfx?.ring.primaryColor || '#00F0FF'}
                                onChange={(e) =>
                                  setComposition((prev) => ({
                                    ...prev,
                                    portalVfx: {
                                      ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                      ring: {
                                        ...(prev.portalVfx?.ring || DEFAULT_PORTAL_VFX_CONFIG.ring),
                                        primaryColor: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                              />
                            </div>

                            <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-white/5">
                              <span className="text-[11px] text-slate-400">Secondary Aura</span>
                              <input
                                type="color"
                                value={composition.portalVfx?.ring.secondaryColor || '#A855F7'}
                                onChange={(e) =>
                                  setComposition((prev) => ({
                                    ...prev,
                                    portalVfx: {
                                      ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                      ring: {
                                        ...(prev.portalVfx?.ring || DEFAULT_PORTAL_VFX_CONFIG.ring),
                                        secondaryColor: e.target.value,
                                      },
                                    },
                                  }))
                                }
                                className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* MODULE B: ENERGY FLOW */}
                    <div className="p-3.5 bg-slate-900/60 border border-white/10 rounded-xl space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-sky-400" />
                          <span className="font-bold text-white">B. Plasma & Lightning Energy Flow</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={composition.portalVfx?.energyFlow.enabled ?? false}
                          onChange={(e) =>
                            setComposition((prev) => ({
                              ...prev,
                              portalVfx: {
                                ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                energyFlow: {
                                  ...(prev.portalVfx?.energyFlow || DEFAULT_PORTAL_VFX_CONFIG.energyFlow),
                                  enabled: e.target.checked,
                                },
                              },
                            }))
                          }
                          className="w-4 h-4 accent-cyan-400 cursor-pointer"
                        />
                      </div>

                      {composition.portalVfx?.energyFlow.enabled && (
                        <div className="space-y-3 pt-2 border-t border-white/5">
                          <div className="grid grid-cols-2 gap-3 text-[11px]">
                            <div>
                              <span className="text-slate-400 mb-1 block">Energy Style</span>
                              <select
                                value={composition.portalVfx?.energyFlow.style || 'plasma'}
                                onChange={(e) =>
                                  setComposition((prev) => ({
                                    ...prev,
                                    portalVfx: {
                                      ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                      energyFlow: {
                                        ...(prev.portalVfx?.energyFlow || DEFAULT_PORTAL_VFX_CONFIG.energyFlow),
                                        style: e.target.value as any,
                                      },
                                    },
                                  }))
                                }
                                className="w-full bg-slate-950 border border-white/10 rounded-lg p-1.5 text-slate-200"
                              >
                                <option value="plasma">Plasma Streams</option>
                                <option value="electric">Electric Lightning</option>
                                <option value="ember">Fiery Embers</option>
                              </select>
                            </div>

                            <div>
                              <span className="text-slate-400 mb-1 block">Flow Direction</span>
                              <select
                                value={composition.portalVfx?.energyFlow.direction || 'clockwise'}
                                onChange={(e) =>
                                  setComposition((prev) => ({
                                    ...prev,
                                    portalVfx: {
                                      ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                      energyFlow: {
                                        ...(prev.portalVfx?.energyFlow || DEFAULT_PORTAL_VFX_CONFIG.energyFlow),
                                        direction: e.target.value as any,
                                      },
                                    },
                                  }))
                                }
                                className="w-full bg-slate-950 border border-white/10 rounded-lg p-1.5 text-slate-200"
                              >
                                <option value="clockwise">Clockwise</option>
                                <option value="counter-clockwise">Counter-Clockwise</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="text-slate-400">Flow Speed</span>
                              <span className="text-cyan-400 font-mono">
                                {(composition.portalVfx?.energyFlow.speed || 1.2).toFixed(1)}x
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0.2"
                              max="3.0"
                              step="0.1"
                              value={composition.portalVfx?.energyFlow.speed || 1.2}
                              onChange={(e) =>
                                setComposition((prev) => ({
                                  ...prev,
                                  portalVfx: {
                                    ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                    energyFlow: {
                                      ...(prev.portalVfx?.energyFlow || DEFAULT_PORTAL_VFX_CONFIG.energyFlow),
                                      speed: parseFloat(e.target.value),
                                    },
                                  },
                                }))
                              }
                              className="w-full accent-cyan-400"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* MODULE C: PORTAL INTERIOR DISTORTION */}
                    <div className="p-3.5 bg-slate-900/60 border border-white/10 rounded-xl space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Aperture className="w-4 h-4 text-indigo-400" />
                          <span className="font-bold text-white">C. Masked Portal Interior Distortion</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={composition.portalVfx?.interior.enabled ?? false}
                          onChange={(e) =>
                            setComposition((prev) => ({
                              ...prev,
                              portalVfx: {
                                ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                interior: {
                                  ...(prev.portalVfx?.interior || DEFAULT_PORTAL_VFX_CONFIG.interior),
                                  enabled: e.target.checked,
                                },
                              },
                            }))
                          }
                          className="w-4 h-4 accent-cyan-400 cursor-pointer"
                        />
                      </div>

                      {composition.portalVfx?.interior.enabled && (
                        <div className="space-y-3 pt-2 border-t border-white/5">
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Distortion is strictly confined to the interior of the portal opening. The surrounding photograph remains completely unaffected.
                          </p>

                          <div>
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="text-slate-400">Vortex Swirl Amount</span>
                              <span className="text-cyan-400 font-mono">
                                {composition.portalVfx?.interior.swirlAmount || 45}°
                              </span>
                            </div>
                            <input
                              type="range"
                              min="-180"
                              max="180"
                              value={composition.portalVfx?.interior.swirlAmount || 45}
                              onChange={(e) =>
                                setComposition((prev) => ({
                                  ...prev,
                                  portalVfx: {
                                    ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                    interior: {
                                      ...(prev.portalVfx?.interior || DEFAULT_PORTAL_VFX_CONFIG.interior),
                                      swirlAmount: parseInt(e.target.value),
                                    },
                                  },
                                }))
                              }
                              className="w-full accent-cyan-400"
                            />
                          </div>

                          {/* Secondary Interior Background Image */}
                          <div className="pt-1">
                            <span className="text-[11px] font-bold text-slate-300 block mb-1">
                              Alternate Dimension Interior Image (Optional)
                            </span>
                            {composition.portalVfx?.interior.interiorBgUrl ? (
                              <div className="p-2.5 bg-slate-950 rounded-lg border border-white/10 flex items-center justify-between">
                                <span className="text-[11px] text-cyan-300 truncate max-w-[200px]">
                                  {composition.portalVfx.interior.interiorBgName || 'Interior Photo Loaded'}
                                </span>
                                <button
                                  onClick={handleRemoveInteriorBg}
                                  className="text-xs text-red-400 hover:text-red-300"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => interiorBgInputRef.current?.click()}
                                className="w-full py-2 rounded-lg border border-dashed border-white/15 bg-slate-950/50 hover:bg-slate-950 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5"
                              >
                                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                                <span>Upload Dimension Background</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* MODULE D: CINEMATIC LIGHT SPILL */}
                    <div className="p-3.5 bg-slate-900/60 border border-white/10 rounded-xl space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4 text-amber-400" />
                          <span className="font-bold text-white">D. Cinematic Light Spill</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={composition.portalVfx?.lightSpill.enabled ?? false}
                          onChange={(e) =>
                            setComposition((prev) => ({
                              ...prev,
                              portalVfx: {
                                ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                lightSpill: {
                                  ...(prev.portalVfx?.lightSpill || DEFAULT_PORTAL_VFX_CONFIG.lightSpill),
                                  enabled: e.target.checked,
                                },
                              },
                            }))
                          }
                          className="w-4 h-4 accent-cyan-400 cursor-pointer"
                        />
                      </div>

                      {composition.portalVfx?.lightSpill.enabled && (
                        <div className="space-y-3 pt-2 border-t border-white/5">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="flex justify-between text-[11px] mb-1">
                                <span className="text-slate-400">Intensity</span>
                                <span className="text-cyan-400 font-mono">
                                  {composition.portalVfx?.lightSpill.intensity || 50}%
                                </span>
                              </div>
                              <input
                                type="range"
                                min="10"
                                max="100"
                                value={composition.portalVfx?.lightSpill.intensity || 50}
                                onChange={(e) =>
                                  setComposition((prev) => ({
                                    ...prev,
                                    portalVfx: {
                                      ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                      lightSpill: {
                                        ...(prev.portalVfx?.lightSpill || DEFAULT_PORTAL_VFX_CONFIG.lightSpill),
                                        intensity: parseInt(e.target.value),
                                      },
                                    },
                                  }))
                                }
                                className="w-full accent-cyan-400"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between text-[11px] mb-1">
                                <span className="text-slate-400">Spread Radius</span>
                                <span className="text-cyan-400 font-mono">
                                  {composition.portalVfx?.lightSpill.spreadRadius || 220}px
                                </span>
                              </div>
                              <input
                                type="range"
                                min="50"
                                max="450"
                                value={composition.portalVfx?.lightSpill.spreadRadius || 220}
                                onChange={(e) =>
                                  setComposition((prev) => ({
                                    ...prev,
                                    portalVfx: {
                                      ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                      lightSpill: {
                                        ...(prev.portalVfx?.lightSpill || DEFAULT_PORTAL_VFX_CONFIG.lightSpill),
                                        spreadRadius: parseInt(e.target.value),
                                      },
                                    },
                                  }))
                                }
                                className="w-full accent-cyan-400"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* MODULE E: ENERGY SHOCKWAVE */}
                    <div className="p-3.5 bg-slate-900/60 border border-white/10 rounded-xl space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Radio className="w-4 h-4 text-violet-400" />
                          <span className="font-bold text-white">E. Expanding Energy Shockwave</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={composition.portalVfx?.shockwave.enabled ?? false}
                          onChange={(e) =>
                            setComposition((prev) => ({
                              ...prev,
                              portalVfx: {
                                ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                shockwave: {
                                  ...(prev.portalVfx?.shockwave || DEFAULT_PORTAL_VFX_CONFIG.shockwave),
                                  enabled: e.target.checked,
                                },
                              },
                            }))
                          }
                          className="w-4 h-4 accent-cyan-400 cursor-pointer"
                        />
                      </div>

                      {composition.portalVfx?.shockwave.enabled && (
                        <div className="space-y-3 pt-2 border-t border-white/5">
                          <div className="grid grid-cols-2 gap-3 text-[11px]">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-slate-400">Wave Speed</span>
                                <span className="text-cyan-400 font-mono">
                                  {(composition.portalVfx?.shockwave.speed || 1.2).toFixed(1)}x
                                </span>
                              </div>
                              <input
                                type="range"
                                min="0.5"
                                max="3.0"
                                step="0.1"
                                value={composition.portalVfx?.shockwave.speed || 1.2}
                                onChange={(e) =>
                                  setComposition((prev) => ({
                                    ...prev,
                                    portalVfx: {
                                      ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                      shockwave: {
                                        ...(prev.portalVfx?.shockwave || DEFAULT_PORTAL_VFX_CONFIG.shockwave),
                                        speed: parseFloat(e.target.value),
                                      },
                                    },
                                  }))
                                }
                                className="w-full accent-cyan-400"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-slate-400">Expansion Radius</span>
                                <span className="text-cyan-400 font-mono">
                                  {composition.portalVfx?.shockwave.radius || 200}px
                                </span>
                              </div>
                              <input
                                type="range"
                                min="80"
                                max="500"
                                value={composition.portalVfx?.shockwave.radius || 200}
                                onChange={(e) =>
                                  setComposition((prev) => ({
                                    ...prev,
                                    portalVfx: {
                                      ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                      shockwave: {
                                        ...(prev.portalVfx?.shockwave || DEFAULT_PORTAL_VFX_CONFIG.shockwave),
                                        radius: parseInt(e.target.value),
                                      },
                                    },
                                  }))
                                }
                                className="w-full accent-cyan-400"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* MODULE F: PARTICLE SUCTION */}
                    <div className="p-3.5 bg-slate-900/60 border border-white/10 rounded-xl space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-cyan-300" />
                          <span className="font-bold text-white">F. Event Horizon Particle Suction</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={composition.portalVfx?.particles.enabled ?? false}
                          onChange={(e) =>
                            setComposition((prev) => ({
                              ...prev,
                              portalVfx: {
                                ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                particles: {
                                  ...(prev.portalVfx?.particles || DEFAULT_PORTAL_VFX_CONFIG.particles),
                                  enabled: e.target.checked,
                                },
                              },
                            }))
                          }
                          className="w-4 h-4 accent-cyan-400 cursor-pointer"
                        />
                      </div>

                      {composition.portalVfx?.particles.enabled && (
                        <div className="space-y-3 pt-2 border-t border-white/5">
                          <div className="grid grid-cols-2 gap-3 text-[11px]">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-slate-400">Particle Count</span>
                                <span className="text-cyan-400 font-mono">
                                  {composition.portalVfx?.particles.count || 75}
                                </span>
                              </div>
                              <input
                                type="range"
                                min="20"
                                max="180"
                                value={composition.portalVfx?.particles.count || 75}
                                onChange={(e) =>
                                  setComposition((prev) => ({
                                    ...prev,
                                    portalVfx: {
                                      ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                      particles: {
                                        ...(prev.portalVfx?.particles || DEFAULT_PORTAL_VFX_CONFIG.particles),
                                        count: parseInt(e.target.value),
                                      },
                                    },
                                  }))
                                }
                                className="w-full accent-cyan-400"
                              />
                            </div>

                            <div>
                              <span className="text-slate-400 mb-1 block">Direction</span>
                              <div className="flex bg-slate-950 p-0.5 rounded-lg border border-white/10">
                                <button
                                  onClick={() =>
                                    setComposition((prev) => ({
                                      ...prev,
                                      portalVfx: {
                                        ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                        particles: {
                                          ...(prev.portalVfx?.particles || DEFAULT_PORTAL_VFX_CONFIG.particles),
                                          direction: 'inward',
                                        },
                                      },
                                    }))
                                  }
                                  className={`flex-1 py-1 rounded font-bold ${
                                    (composition.portalVfx?.particles.direction || 'inward') === 'inward'
                                      ? 'bg-cyan-500 text-black'
                                      : 'text-slate-400 hover:text-white'
                                  }`}
                                >
                                  Inward Suction
                                </button>
                                <button
                                  onClick={() =>
                                    setComposition((prev) => ({
                                      ...prev,
                                      portalVfx: {
                                        ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                        particles: {
                                          ...(prev.portalVfx?.particles || DEFAULT_PORTAL_VFX_CONFIG.particles),
                                          direction: 'outward',
                                        },
                                      },
                                    }))
                                  }
                                  className={`flex-1 py-1 rounded font-bold ${
                                    composition.portalVfx?.particles.direction === 'outward'
                                      ? 'bg-cyan-500 text-black'
                                      : 'text-slate-400 hover:text-white'
                                  }`}
                                >
                                  Outward Embers
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* MODULE G: OPENING & CLOSING ANIMATION */}
                    <div className="p-3.5 bg-slate-900/60 border border-white/10 rounded-xl space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Compass className="w-4 h-4 text-emerald-400" />
                          <span className="font-bold text-white">G. Opening & Closing Animation</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={composition.portalVfx?.opening.enabled ?? false}
                          onChange={(e) =>
                            setComposition((prev) => ({
                              ...prev,
                              portalVfx: {
                                ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                opening: {
                                  ...(prev.portalVfx?.opening || DEFAULT_PORTAL_VFX_CONFIG.opening),
                                  enabled: e.target.checked,
                                },
                              },
                            }))
                          }
                          className="w-4 h-4 accent-cyan-400 cursor-pointer"
                        />
                      </div>

                      {composition.portalVfx?.opening.enabled && (
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[11px]">
                          <div>
                            <span className="text-slate-400 block mb-1">Open Duration</span>
                            <input
                              type="range"
                              min="0.5"
                              max="4.0"
                              step="0.1"
                              value={composition.portalVfx?.opening.openDuration || 1.5}
                              onChange={(e) =>
                                setComposition((prev) => ({
                                  ...prev,
                                  portalVfx: {
                                    ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                    opening: {
                                      ...(prev.portalVfx?.opening || DEFAULT_PORTAL_VFX_CONFIG.opening),
                                      openDuration: parseFloat(e.target.value),
                                    },
                                  },
                                }))
                              }
                              className="w-full accent-cyan-400"
                            />
                            <span className="text-cyan-400 font-mono text-[10px]">
                              {composition.portalVfx?.opening.openDuration || 1.5}s
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-400 block mb-1">Hold Duration</span>
                            <input
                              type="range"
                              min="1.0"
                              max="10.0"
                              step="0.5"
                              value={composition.portalVfx?.opening.holdDuration || 5.0}
                              onChange={(e) =>
                                setComposition((prev) => ({
                                  ...prev,
                                  portalVfx: {
                                    ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                    opening: {
                                      ...(prev.portalVfx?.opening || DEFAULT_PORTAL_VFX_CONFIG.opening),
                                      holdDuration: parseFloat(e.target.value),
                                    },
                                  },
                                }))
                              }
                              className="w-full accent-cyan-400"
                            />
                            <span className="text-cyan-400 font-mono text-[10px]">
                              {composition.portalVfx?.opening.holdDuration || 5.0}s
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-400 block mb-1">Close Duration</span>
                            <input
                              type="range"
                              min="0.5"
                              max="4.0"
                              step="0.1"
                              value={composition.portalVfx?.opening.closeDuration || 1.5}
                              onChange={(e) =>
                                setComposition((prev) => ({
                                  ...prev,
                                  portalVfx: {
                                    ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                    opening: {
                                      ...(prev.portalVfx?.opening || DEFAULT_PORTAL_VFX_CONFIG.opening),
                                      closeDuration: parseFloat(e.target.value),
                                    },
                                  },
                                }))
                              }
                              className="w-full accent-cyan-400"
                            />
                            <span className="text-cyan-400 font-mono text-[10px]">
                              {composition.portalVfx?.opening.closeDuration || 1.5}s
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* MODULE H: PORTAL EXIT TRANSITION */}
                    <div className="p-3.5 bg-slate-900/60 border border-white/10 rounded-xl space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Maximize2 className="w-4 h-4 text-purple-400" />
                          <span className="font-bold text-white">H. Portal Exit Zoom Transition</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={composition.portalVfx?.exitTransition.enabled ?? false}
                          onChange={(e) =>
                            setComposition((prev) => ({
                              ...prev,
                              portalVfx: {
                                ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                exitTransition: {
                                  ...(prev.portalVfx?.exitTransition || DEFAULT_PORTAL_VFX_CONFIG.exitTransition),
                                  enabled: e.target.checked,
                                },
                              },
                            }))
                          }
                          className="w-4 h-4 accent-cyan-400 cursor-pointer"
                        />
                      </div>

                      {composition.portalVfx?.exitTransition.enabled && (
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5 text-[11px]">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-slate-400">Trigger Start Time</span>
                              <span className="text-cyan-400 font-mono">
                                {composition.portalVfx?.exitTransition.startTime || 6.0}s
                              </span>
                            </div>
                            <input
                              type="range"
                              min="1.0"
                              max="20.0"
                              step="0.5"
                              value={composition.portalVfx?.exitTransition.startTime || 6.0}
                              onChange={(e) =>
                                setComposition((prev) => ({
                                  ...prev,
                                  portalVfx: {
                                    ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                    exitTransition: {
                                      ...(prev.portalVfx?.exitTransition || DEFAULT_PORTAL_VFX_CONFIG.exitTransition),
                                      startTime: parseFloat(e.target.value),
                                    },
                                  },
                                }))
                              }
                              className="w-full accent-cyan-400"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-slate-400">Zoom Speed</span>
                              <span className="text-cyan-400 font-mono">
                                {(composition.portalVfx?.exitTransition.zoomSpeed || 1.6).toFixed(1)}x
                              </span>
                            </div>
                            <input
                              type="range"
                              min="1.0"
                              max="3.0"
                              step="0.1"
                              value={composition.portalVfx?.exitTransition.zoomSpeed || 1.6}
                              onChange={(e) =>
                                setComposition((prev) => ({
                                  ...prev,
                                  portalVfx: {
                                    ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                    exitTransition: {
                                      ...(prev.portalVfx?.exitTransition || DEFAULT_PORTAL_VFX_CONFIG.exitTransition),
                                      zoomSpeed: parseFloat(e.target.value),
                                    },
                                  },
                                }))
                              }
                              className="w-full accent-cyan-400"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* MUSIC REACTIVITY (OFF BY DEFAULT) */}
                    <div className="p-3.5 bg-slate-900/60 border border-white/10 rounded-xl space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-cyan-400" />
                          <div>
                            <span className="font-bold text-white block">React to Music (Web Audio API)</span>
                            <span className="text-[10px] text-slate-500">OFF by default • Modulates portal on beat</span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={composition.portalVfx?.audioReactivity.enabled ?? false}
                          onChange={(e) =>
                            setComposition((prev) => ({
                              ...prev,
                              portalVfx: {
                                ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                audioReactivity: {
                                  ...(prev.portalVfx?.audioReactivity || DEFAULT_PORTAL_VFX_CONFIG.audioReactivity),
                                  enabled: e.target.checked,
                                },
                              },
                            }))
                          }
                          className="w-4 h-4 accent-cyan-400 cursor-pointer"
                        />
                      </div>

                      {composition.portalVfx?.audioReactivity.enabled && (
                        <div className="space-y-3 pt-2 border-t border-white/5">
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={composition.portalVfx?.audioReactivity.modulateGlow ?? true}
                                onChange={(e) =>
                                  setComposition((prev) => ({
                                    ...prev,
                                    portalVfx: {
                                      ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                      audioReactivity: {
                                        ...(prev.portalVfx?.audioReactivity || DEFAULT_PORTAL_VFX_CONFIG.audioReactivity),
                                        modulateGlow: e.target.checked,
                                      },
                                    },
                                  }))
                                }
                                className="accent-cyan-400"
                              />
                              <span>Pulse Glow on Bass</span>
                            </label>

                            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={composition.portalVfx?.audioReactivity.triggerShockwaveOnBeat ?? true}
                                onChange={(e) =>
                                  setComposition((prev) => ({
                                    ...prev,
                                    portalVfx: {
                                      ...(prev.portalVfx || DEFAULT_PORTAL_VFX_CONFIG),
                                      audioReactivity: {
                                        ...(prev.portalVfx?.audioReactivity || DEFAULT_PORTAL_VFX_CONFIG.audioReactivity),
                                        triggerShockwaveOnBeat: e.target.checked,
                                      },
                                    },
                                  }))
                                }
                                className="accent-cyan-400"
                              />
                              <span>Beat Shockwaves</span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

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

              {/* TAB 2: 2.5D PHOTO MOTION STUDIO */}
              {activeTab === 'photomotion' && (
                <div className="space-y-6">
                  {/* Header & Master Toggle */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 flex items-center justify-center">
                        <Film className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>2.5D Photo Motion Studio</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            Cinematic Parallax
                          </span>
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Transform photos into moving camera shots with atmospheric depth
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setComposition((prev) => ({
                          ...prev,
                          photoMotion: {
                            ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                            enabled: !(prev.photoMotion?.enabled ?? false),
                          },
                        }))
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        composition.photoMotion?.enabled
                          ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                          : 'bg-slate-800 text-slate-400 hover:text-white border border-white/10'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{composition.photoMotion?.enabled ? 'Active' : 'Disabled'}</span>
                    </button>
                  </div>

                  {/* Hidden Photo Inputs */}
                  <input
                    type="file"
                    ref={photoMotionInputRef}
                    onChange={(e) => e.target.files?.[0] && handlePhotoMotionImageUpload(e.target.files[0])}
                    accept="image/*,.jpg,.jpeg,.png,.webp"
                    className="hidden"
                  />
                  <input
                    type="file"
                    ref={foregroundInputRef}
                    onChange={(e) => e.target.files?.[0] && handleForegroundLayerUpload(e.target.files[0])}
                    accept="image/*,.png,.webp"
                    className="hidden"
                  />

                  {/* SECTION 1: PHOTO SOURCE SELECTION */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Source Photograph</span>
                      </span>
                      {composition.photoMotion?.sourceImageUrl && (
                        <span className="text-[10px] text-cyan-400 font-mono">100% Client-Side</span>
                      )}
                    </label>

                    {composition.photoMotion?.sourceImageUrl ? (
                      <div className="p-3 bg-slate-900/90 border border-white/10 rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={composition.photoMotion.sourceImageUrl}
                            alt="2.5D Motion Source"
                            className="w-14 h-14 rounded-lg object-cover border border-white/15 shrink-0 bg-slate-950"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">
                              {composition.photoMotion.sourceImageName || 'Custom Photo Loaded'}
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span className="text-emerald-400 font-semibold">● Ready for 2.5D Motion</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => photoMotionInputRef.current?.click()}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10"
                            title="Replace photo"
                          >
                            Replace
                          </button>
                          <button
                            onClick={handleRemovePhotoMotion}
                            className="p-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-white/10"
                            title="Clear photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={() => photoMotionInputRef.current?.click()}
                          className="p-4 rounded-xl border border-white/10 bg-slate-900/80 hover:border-cyan-400/50 flex flex-col items-center justify-center gap-2 text-slate-300 hover:text-white transition-all group"
                        >
                          <Upload className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold">Import Photograph</span>
                          <span className="text-[10px] text-slate-500">JPG, PNG, WebP</span>
                        </button>

                        <button
                          onClick={handleLoadSamplePhoto}
                          className="p-4 rounded-xl border border-violet-500/30 bg-violet-950/20 hover:bg-violet-950/40 flex flex-col items-center justify-center gap-2 text-violet-300 hover:text-white transition-all group"
                        >
                          <Sparkles className="w-5 h-5 text-violet-400 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold">1-Click Test Scene</span>
                          <span className="text-[10px] text-slate-400">Loads 1080p Cozy Cabin</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* SECTION 2: DEPTH & PARALLAX MODE */}
                  <div className="space-y-3 pt-2 border-t border-white/5">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Depth & Parallax Separation</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {composition.photoMotion?.depth.mode === 'single-2.5d'
                          ? 'Single-Image Warp'
                          : composition.photoMotion?.depth.mode === 'manual-layers'
                          ? 'Dual-Layer Parallax'
                          : 'Brush Mask Cutout'}
                      </span>
                    </label>

                    {/* Mode Selector Tabs */}
                    <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl border border-white/10 text-xs">
                      {[
                        { id: 'single-2.5d', label: 'Single 2.5D' },
                        { id: 'manual-layers', label: 'Dual Layer' },
                        { id: 'brush-mask', label: 'Brush Mask' },
                      ].map((m) => {
                        const isCurrent = (composition.photoMotion?.depth.mode || 'single-2.5d') === m.id
                        return (
                          <button
                            key={m.id}
                            onClick={() =>
                              setComposition((prev) => ({
                                ...prev,
                                photoMotion: {
                                  ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                  enabled: true,
                                  depth: {
                                    ...(prev.photoMotion?.depth || DEFAULT_PHOTO_MOTION_CONFIG.depth),
                                    mode: m.id as DepthMode,
                                  },
                                },
                              }))
                            }
                            className={`py-1.5 px-2 rounded-lg font-bold transition-all text-center ${
                              isCurrent
                                ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {m.label}
                          </button>
                        )
                      })}
                    </div>

                    {/* Mode A: Single-Image 2.5D Controls */}
                    {composition.photoMotion?.depth.mode === 'single-2.5d' && (
                      <div className="p-3 bg-slate-900/60 border border-white/5 rounded-xl space-y-3 text-xs">
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Automated 2.5D perspective projection. Employs focal depth scaling and background overscan safeguards to prevent exposed canvas edges.
                        </p>
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-slate-400">Background Overscan Safeguard</span>
                            <span className="text-cyan-400 font-mono">
                              {((composition.photoMotion?.depth.bgOverscanScale || 1.15) * 100).toFixed(0)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1.05"
                            max="1.30"
                            step="0.01"
                            value={composition.photoMotion?.depth.bgOverscanScale || 1.15}
                            onChange={(e) =>
                              setComposition((prev) => ({
                                ...prev,
                                photoMotion: {
                                  ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                  depth: {
                                    ...(prev.photoMotion?.depth || DEFAULT_PHOTO_MOTION_CONFIG.depth),
                                    bgOverscanScale: parseFloat(e.target.value),
                                  },
                                },
                              }))
                            }
                            className="w-full accent-cyan-400"
                          />
                        </div>
                      </div>
                    )}

                    {/* Mode B: Dual-Layer Manual Controls */}
                    {composition.photoMotion?.depth.mode === 'manual-layers' && (
                      <div className="p-3 bg-slate-900/60 border border-white/5 rounded-xl space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 font-bold">Foreground Layer (Cutout PNG)</span>
                          <button
                            onClick={() => foregroundInputRef.current?.click()}
                            className="px-2.5 py-1 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1"
                          >
                            <Upload className="w-3 h-3" />
                            <span>{composition.photoMotion.depth.foregroundUrl ? 'Replace FG' : 'Upload FG'}</span>
                          </button>
                        </div>

                        {composition.photoMotion.depth.foregroundUrl && (
                          <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Foreground layer loaded and synchronized with camera</span>
                          </div>
                        )}

                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-slate-400">Parallax Speed Multiplier</span>
                            <span className="text-cyan-400 font-mono">
                              {(composition.photoMotion?.depth.parallaxRatio || 1.35).toFixed(2)}x
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.5"
                            max="2.5"
                            step="0.05"
                            value={composition.photoMotion?.depth.parallaxRatio || 1.35}
                            onChange={(e) =>
                              setComposition((prev) => ({
                                ...prev,
                                photoMotion: {
                                  ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                  depth: {
                                    ...(prev.photoMotion?.depth || DEFAULT_PHOTO_MOTION_CONFIG.depth),
                                    parallaxRatio: parseFloat(e.target.value),
                                  },
                                },
                              }))
                            }
                            className="w-full accent-cyan-400"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-slate-400">Background Depth Blur (DOF)</span>
                            <span className="text-cyan-400 font-mono">
                              {composition.photoMotion?.depth.bgBlurPx || 0}px
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="15"
                            value={composition.photoMotion?.depth.bgBlurPx || 0}
                            onChange={(e) =>
                              setComposition((prev) => ({
                                ...prev,
                                photoMotion: {
                                  ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                  depth: {
                                    ...(prev.photoMotion?.depth || DEFAULT_PHOTO_MOTION_CONFIG.depth),
                                    bgBlurPx: parseInt(e.target.value),
                                  },
                                },
                              }))
                            }
                            className="w-full accent-cyan-400"
                          />
                        </div>
                      </div>
                    )}

                    {/* Mode C: Brush Mask Cutout Controls */}
                    {composition.photoMotion?.depth.mode === 'brush-mask' && (
                      <div className="p-3 bg-slate-900/60 border border-white/5 rounded-xl space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 font-bold">Interactive Brush Mask</span>
                          <button
                            onClick={openMaskEditor}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                          >
                            <Brush className="w-3.5 h-3.5" />
                            <span>Paint Subject Mask</span>
                          </button>
                        </div>

                        {composition.photoMotion.depth.maskDataUrl ? (
                          <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Subject mask painted & active for 2.5D parallax cutout</span>
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Click <strong>Paint Subject Mask</strong> to paint over your foreground subject (e.g., character, window, trees) to separate it into a 2.5D parallax plane.
                          </p>
                        )}

                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-slate-400">Foreground Parallax Ratio</span>
                            <span className="text-cyan-400 font-mono">
                              {(composition.photoMotion?.depth.parallaxRatio || 1.35).toFixed(2)}x
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.5"
                            max="2.5"
                            step="0.05"
                            value={composition.photoMotion?.depth.parallaxRatio || 1.35}
                            onChange={(e) =>
                              setComposition((prev) => ({
                                ...prev,
                                photoMotion: {
                                  ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                  depth: {
                                    ...(prev.photoMotion?.depth || DEFAULT_PHOTO_MOTION_CONFIG.depth),
                                    parallaxRatio: parseFloat(e.target.value),
                                  },
                                },
                              }))
                            }
                            className="w-full accent-cyan-400"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SECTION 3: 10 CAMERA MOTION PRESETS */}
                  <div className="space-y-3 pt-2 border-t border-white/5">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Camera Motion Presets (10 Cinematic Shots)</span>
                      </span>
                      <span className="text-[10px] text-cyan-400 font-mono">
                        {composition.photoMotion?.camera.preset}
                      </span>
                    </label>

                    {/* Presets 2-Column Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'slow-push-in', label: 'Slow Push-In', desc: 'Dolly forward towards center' },
                        { id: 'slow-pull-back', label: 'Slow Pull-Back', desc: 'Dolly outward revealing scene' },
                        { id: 'pan-left', label: 'Pan Left', desc: 'Horizontal cinematic tracking' },
                        { id: 'pan-right', label: 'Pan Right', desc: 'Horizontal cinematic tracking' },
                        { id: 'pan-up', label: 'Pan Up', desc: 'Vertical crane tilt upward' },
                        { id: 'pan-down', label: 'Pan Down', desc: 'Vertical crane tilt downward' },
                        { id: 'diagonal-drift', label: 'Diagonal Drift', desc: 'Sweeping corner glide' },
                        { id: 'ken-burns', label: 'Ken Burns', desc: 'Documentary curve pan & zoom' },
                        { id: 'gentle-float', label: 'Gentle Float', desc: 'Handheld drone Lissajous motion' },
                        { id: 'orbit-perspective', label: 'Orbit 3D Tilt', desc: 'Circular 3D perspective orbit' },
                      ].map((cam) => {
                        const isSelected = (composition.photoMotion?.camera.preset || 'slow-push-in') === cam.id
                        return (
                          <button
                            key={cam.id}
                            onClick={() =>
                              setComposition((prev) => ({
                                ...prev,
                                photoMotion: {
                                  ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                  enabled: true,
                                  camera: {
                                    ...(prev.photoMotion?.camera || DEFAULT_PHOTO_MOTION_CONFIG.camera),
                                    preset: cam.id as CameraMotionPreset,
                                  },
                                },
                              }))
                            }
                            className={`p-2.5 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-md'
                                : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                            }`}
                          >
                            <div className="text-xs font-bold flex items-center justify-between">
                              <span>{cam.label}</span>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{cam.desc}</div>
                          </button>
                        )
                      })}
                    </div>

                    {/* Camera Speed & Motion Controls */}
                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-400">Camera Speed</span>
                          <span className="text-cyan-400 font-mono">
                            {(composition.photoMotion?.camera.speed || 1.0).toFixed(1)}x
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.2"
                          max="2.5"
                          step="0.1"
                          value={composition.photoMotion?.camera.speed || 1.0}
                          onChange={(e) =>
                            setComposition((prev) => ({
                              ...prev,
                              photoMotion: {
                                ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                camera: {
                                  ...(prev.photoMotion?.camera || DEFAULT_PHOTO_MOTION_CONFIG.camera),
                                  speed: parseFloat(e.target.value),
                                },
                              },
                            }))
                          }
                          className="w-full accent-cyan-400"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-400">Motion Intensity</span>
                          <span className="text-cyan-400 font-mono">
                            {composition.photoMotion?.camera.intensity || 5}/10
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={composition.photoMotion?.camera.intensity || 5}
                          onChange={(e) =>
                            setComposition((prev) => ({
                              ...prev,
                              photoMotion: {
                                ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                camera: {
                                  ...(prev.photoMotion?.camera || DEFAULT_PHOTO_MOTION_CONFIG.camera),
                                  intensity: parseInt(e.target.value),
                                },
                              },
                            }))
                          }
                          className="w-full accent-cyan-400"
                        />
                      </div>
                    </div>

                    {/* Camera Easing Selector */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] text-slate-400">Camera Easing & Looping</span>
                      <div className="grid grid-cols-4 gap-1 bg-slate-900 p-1 rounded-xl border border-white/10 text-xs">
                        {[
                          { id: 'smooth-sine', label: 'Smooth' },
                          { id: 'ease-in-out', label: 'Ease In-Out' },
                          { id: 'pendulum-loop', label: 'Pendulum' },
                          { id: 'linear', label: 'Linear' },
                        ].map((ea) => {
                          const isCurrent = (composition.photoMotion?.camera.easing || 'smooth-sine') === ea.id
                          return (
                            <button
                              key={ea.id}
                              onClick={() =>
                                setComposition((prev) => ({
                                  ...prev,
                                  photoMotion: {
                                    ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                    camera: {
                                      ...(prev.photoMotion?.camera || DEFAULT_PHOTO_MOTION_CONFIG.camera),
                                      easing: ea.id as CameraEasing,
                                    },
                                  },
                                }))
                              }
                              className={`py-1 rounded-lg font-bold text-[11px] transition-all ${
                                isCurrent ? 'bg-cyan-500 text-black shadow' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              {ea.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: ATMOSPHERIC EFFECTS STUDIO */}
                  <div className="space-y-3 pt-2 border-t border-white/5">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Atmospheric Rain, Fog & Particles</span>
                      </span>
                    </label>

                    {/* Rain Controls */}
                    <div className="p-3 bg-slate-900/60 border border-white/5 rounded-xl space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 flex items-center gap-1.5">
                          <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Cinematic Multi-Plane Rain</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={composition.photoMotion?.atmosphere.rainEnabled ?? true}
                          onChange={(e) =>
                            setComposition((prev) => ({
                              ...prev,
                              photoMotion: {
                                ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                atmosphere: {
                                  ...(prev.photoMotion?.atmosphere || DEFAULT_PHOTO_MOTION_CONFIG.atmosphere),
                                  rainEnabled: e.target.checked,
                                },
                              },
                            }))
                          }
                          className="accent-cyan-400 w-4 h-4 cursor-pointer"
                        />
                      </div>

                      {composition.photoMotion?.atmosphere.rainEnabled && (
                        <div className="space-y-2 pt-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Rain Intensity</span>
                            <span className="text-cyan-400 font-mono">
                              {composition.photoMotion?.atmosphere.rainIntensity ?? 65}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={composition.photoMotion?.atmosphere.rainIntensity ?? 65}
                            onChange={(e) =>
                              setComposition((prev) => ({
                                ...prev,
                                photoMotion: {
                                  ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                  atmosphere: {
                                    ...(prev.photoMotion?.atmosphere || DEFAULT_PHOTO_MOTION_CONFIG.atmosphere),
                                    rainIntensity: parseInt(e.target.value),
                                  },
                                },
                              }))
                            }
                            className="w-full accent-cyan-400"
                          />

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[11px] text-slate-300">Window Condensation Droplets</span>
                            <input
                              type="checkbox"
                              checked={composition.photoMotion?.atmosphere.windowDropletsOverlay ?? true}
                              onChange={(e) =>
                                setComposition((prev) => ({
                                  ...prev,
                                  photoMotion: {
                                    ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                    atmosphere: {
                                      ...(prev.photoMotion?.atmosphere || DEFAULT_PHOTO_MOTION_CONFIG.atmosphere),
                                      windowDropletsOverlay: e.target.checked,
                                    },
                                  },
                                }))
                              }
                              className="accent-cyan-400 w-4 h-4 cursor-pointer"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Fog & Mist Controls */}
                    <div className="p-3 bg-slate-900/60 border border-white/5 rounded-xl space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 flex items-center gap-1.5">
                          <Wind className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Volumetric Fog & Mountain Mist</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={composition.photoMotion?.atmosphere.fogEnabled ?? true}
                          onChange={(e) =>
                            setComposition((prev) => ({
                              ...prev,
                              photoMotion: {
                                ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                atmosphere: {
                                  ...(prev.photoMotion?.atmosphere || DEFAULT_PHOTO_MOTION_CONFIG.atmosphere),
                                  fogEnabled: e.target.checked,
                                },
                              },
                            }))
                          }
                          className="accent-cyan-400 w-4 h-4 cursor-pointer"
                        />
                      </div>

                      {composition.photoMotion?.atmosphere.fogEnabled && (
                        <div className="space-y-2 pt-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Fog Density</span>
                            <span className="text-cyan-400 font-mono">
                              {composition.photoMotion?.atmosphere.fogDensity ?? 40}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={composition.photoMotion?.atmosphere.fogDensity ?? 40}
                            onChange={(e) =>
                              setComposition((prev) => ({
                                ...prev,
                                photoMotion: {
                                  ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                  atmosphere: {
                                    ...(prev.photoMotion?.atmosphere || DEFAULT_PHOTO_MOTION_CONFIG.atmosphere),
                                    fogDensity: parseInt(e.target.value),
                                  },
                                },
                              }))
                            }
                            className="w-full accent-cyan-400"
                          />
                        </div>
                      )}
                    </div>

                    {/* Particle Systems (Dust, Snow, Fireflies, Stars, Bokeh) */}
                    <div className="p-3 bg-slate-900/60 border border-white/5 rounded-xl space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Floating Particles & Fireflies</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={composition.photoMotion?.atmosphere.particlesEnabled ?? true}
                          onChange={(e) =>
                            setComposition((prev) => ({
                              ...prev,
                              photoMotion: {
                                ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                atmosphere: {
                                  ...(prev.photoMotion?.atmosphere || DEFAULT_PHOTO_MOTION_CONFIG.atmosphere),
                                  particlesEnabled: e.target.checked,
                                },
                              },
                            }))
                          }
                          className="accent-cyan-400 w-4 h-4 cursor-pointer"
                        />
                      </div>

                      {composition.photoMotion?.atmosphere.particlesEnabled && (
                        <div className="space-y-2 pt-1">
                          <div className="grid grid-cols-5 gap-1 bg-slate-950 p-1 rounded-lg border border-white/10 text-[11px]">
                            {(['dust', 'snow', 'fireflies', 'stars', 'bokeh'] as AtmosphericParticleType[]).map((type) => {
                              const isCurrent = (composition.photoMotion?.atmosphere.particleType || 'dust') === type
                              return (
                                <button
                                  key={type}
                                  onClick={() =>
                                    setComposition((prev) => ({
                                      ...prev,
                                      photoMotion: {
                                        ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                        atmosphere: {
                                          ...(prev.photoMotion?.atmosphere || DEFAULT_PHOTO_MOTION_CONFIG.atmosphere),
                                          particleType: type,
                                        },
                                      },
                                    }))
                                  }
                                  className={`py-1 rounded font-bold capitalize transition-all ${
                                    isCurrent ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {type}
                                </button>
                              )
                            })}
                          </div>

                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Particle Count</span>
                            <span className="text-cyan-400 font-mono">
                              {composition.photoMotion?.atmosphere.particleCount ?? 60}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="20"
                            max="150"
                            value={composition.photoMotion?.atmosphere.particleCount ?? 60}
                            onChange={(e) =>
                              setComposition((prev) => ({
                                ...prev,
                                photoMotion: {
                                  ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                  atmosphere: {
                                    ...(prev.photoMotion?.atmosphere || DEFAULT_PHOTO_MOTION_CONFIG.atmosphere),
                                    particleCount: parseInt(e.target.value),
                                  },
                                },
                              }))
                            }
                            className="w-full accent-cyan-400"
                          />
                        </div>
                      )}
                    </div>

                    {/* Volumetric God-Rays & 35mm Grain */}
                    <div className="p-3 bg-slate-900/60 border border-white/5 rounded-xl space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 flex items-center gap-1.5">
                          <Sun className="w-3.5 h-3.5 text-amber-300" />
                          <span>Volumetric God-Rays & 35mm Grain</span>
                        </span>
                        <input
                          type="checkbox"
                          checked={composition.photoMotion?.atmosphere.lightRaysEnabled ?? true}
                          onChange={(e) =>
                            setComposition((prev) => ({
                              ...prev,
                              photoMotion: {
                                ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                atmosphere: {
                                  ...(prev.photoMotion?.atmosphere || DEFAULT_PHOTO_MOTION_CONFIG.atmosphere),
                                  lightRaysEnabled: e.target.checked,
                                },
                              },
                            }))
                          }
                          className="accent-cyan-400 w-4 h-4 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-2 pt-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-400">Film Grain Intensity</span>
                          <span className="text-cyan-400 font-mono">
                            {composition.photoMotion?.atmosphere.filmGrainIntensity ?? 12}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="40"
                          value={composition.photoMotion?.atmosphere.filmGrainIntensity ?? 12}
                          onChange={(e) =>
                            setComposition((prev) => ({
                              ...prev,
                              photoMotion: {
                                ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                atmosphere: {
                                  ...(prev.photoMotion?.atmosphere || DEFAULT_PHOTO_MOTION_CONFIG.atmosphere),
                                  filmGrainIntensity: parseInt(e.target.value),
                                },
                              },
                            }))
                          }
                          className="w-full accent-cyan-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 5: 8 CINEMATIC COLOR GRADING PRESETS */}
                  <div className="space-y-3 pt-2 border-t border-white/5">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Cinematic LUT Color Grading (8 Presets)</span>
                      </span>
                      <span className="text-[10px] text-cyan-400 font-mono">
                        {composition.photoMotion?.lighting.preset}
                      </span>
                    </label>

                    {/* Presets Cards */}
                    <div className="grid grid-cols-3 gap-2">
                      {CINEMATIC_COLOR_PRESETS.map((lut) => {
                        const isSelected = (composition.photoMotion?.lighting.preset || 'romantic-rain') === lut.id
                        return (
                          <button
                            key={lut.id}
                            onClick={() =>
                              setComposition((prev) => ({
                                ...prev,
                                photoMotion: {
                                  ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                  lighting: {
                                    ...(prev.photoMotion?.lighting || DEFAULT_PHOTO_MOTION_CONFIG.lighting),
                                    preset: lut.id,
                                    ...lut.settings,
                                  },
                                },
                              }))
                            }
                            className={`p-2 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'bg-slate-800 border-cyan-400 shadow'
                                : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: lut.accentColor }}
                              />
                              <span className="text-[11px] font-bold text-white truncate">{lut.name}</span>
                            </div>
                            <div className="text-[9px] text-slate-500 line-clamp-1">{lut.subtitle}</div>
                          </button>
                        )
                      })}
                    </div>

                    {/* Fine-Tuning Sliders */}
                    <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-400">Color Temperature</span>
                          <span className="text-cyan-400 font-mono">
                            {(composition.photoMotion?.lighting.temperature ?? 10) > 0 ? '+' : ''}
                            {composition.photoMotion?.lighting.temperature ?? 10}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="-50"
                          max="50"
                          value={composition.photoMotion?.lighting.temperature ?? 10}
                          onChange={(e) =>
                            setComposition((prev) => ({
                              ...prev,
                              photoMotion: {
                                ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                lighting: {
                                  ...(prev.photoMotion?.lighting || DEFAULT_PHOTO_MOTION_CONFIG.lighting),
                                  temperature: parseInt(e.target.value),
                                },
                              },
                            }))
                          }
                          className="w-full accent-cyan-400"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-400">Vignette Shading</span>
                          <span className="text-cyan-400 font-mono">
                            {composition.photoMotion?.lighting.vignette ?? 45}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={composition.photoMotion?.lighting.vignette ?? 45}
                          onChange={(e) =>
                            setComposition((prev) => ({
                              ...prev,
                              photoMotion: {
                                ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                lighting: {
                                  ...(prev.photoMotion?.lighting || DEFAULT_PHOTO_MOTION_CONFIG.lighting),
                                  vignette: parseInt(e.target.value),
                                },
                              },
                            }))
                          }
                          className="w-full accent-cyan-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 6: AUDIO REACTIVITY CONTROLS */}
                  <div className="space-y-3 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Web Audio Reactivity Modulation</span>
                      </label>
                      <input
                        type="checkbox"
                        checked={composition.photoMotion?.audioReactivity.enabled ?? true}
                        onChange={(e) =>
                          setComposition((prev) => ({
                            ...prev,
                            photoMotion: {
                              ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                              audioReactivity: {
                                ...(prev.photoMotion?.audioReactivity || DEFAULT_PHOTO_MOTION_CONFIG.audioReactivity),
                                enabled: e.target.checked,
                              },
                            },
                          }))
                        }
                        className="accent-cyan-400 w-4 h-4 cursor-pointer"
                      />
                    </div>

                    {composition.photoMotion?.audioReactivity.enabled && (
                      <div className="p-3 bg-slate-900/60 border border-white/5 rounded-xl space-y-2.5 text-xs">
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-slate-400">Audio Sensitivity Multiplier</span>
                            <span className="text-cyan-400 font-mono">
                              {(composition.photoMotion?.audioReactivity.sensitivity ?? 1.2).toFixed(1)}x
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.5"
                            max="2.5"
                            step="0.1"
                            value={composition.photoMotion?.audioReactivity.sensitivity ?? 1.2}
                            onChange={(e) =>
                              setComposition((prev) => ({
                                ...prev,
                                photoMotion: {
                                  ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                  audioReactivity: {
                                    ...(prev.photoMotion?.audioReactivity || DEFAULT_PHOTO_MOTION_CONFIG.audioReactivity),
                                    sensitivity: parseFloat(e.target.value),
                                  },
                                },
                              }))
                            }
                            className="w-full accent-cyan-400"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                            <input
                              type="checkbox"
                              checked={composition.photoMotion?.audioReactivity.modulateLight ?? true}
                              onChange={(e) =>
                                setComposition((prev) => ({
                                  ...prev,
                                  photoMotion: {
                                    ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                    audioReactivity: {
                                      ...(prev.photoMotion?.audioReactivity || DEFAULT_PHOTO_MOTION_CONFIG.audioReactivity),
                                      modulateLight: e.target.checked,
                                    },
                                  },
                                }))
                              }
                              className="accent-cyan-400 w-3.5 h-3.5"
                            />
                            <span>Modulate Lamp Glow</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                            <input
                              type="checkbox"
                              checked={composition.photoMotion?.audioReactivity.modulateParticles ?? true}
                              onChange={(e) =>
                                setComposition((prev) => ({
                                  ...prev,
                                  photoMotion: {
                                    ...(prev.photoMotion || DEFAULT_PHOTO_MOTION_CONFIG),
                                    audioReactivity: {
                                      ...(prev.photoMotion?.audioReactivity || DEFAULT_PHOTO_MOTION_CONFIG.audioReactivity),
                                      modulateParticles: e.target.checked,
                                    },
                                  },
                                }))
                              }
                              className="accent-cyan-400 w-3.5 h-3.5"
                            />
                            <span>Modulate Fireflies</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2.5: MUSIC-GROWN GARDEN STUDIO */}
              {activeTab === 'garden' && (
                <div className="space-y-6">
                  {/* Hidden Garden Photo Input */}
                  <input
                    type="file"
                    ref={gardenPhotoInputRef}
                    onChange={handleGardenPhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  {/* Header & Master Toggle */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Flower2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>Music-Grown Garden Studio</span>
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                              composition.gardenStudio?.enabled
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {composition.gardenStudio?.enabled ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Atmospheric living botanical world reactive to music
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {composition.gardenStudio?.enabled && (
                        <button
                          onClick={() =>
                            setComposition((prev) => ({
                              ...prev,
                              gardenStudio: {
                                ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                isBeforeActive: !prev.gardenStudio?.isBeforeActive,
                              },
                            }))
                          }
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                            composition.gardenStudio?.isBeforeActive
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                          }`}
                          title="Temporarily view original clean photo without garden effects"
                        >
                          {composition.gardenStudio?.isBeforeActive ? 'Showing Original' : 'Before / After'}
                        </button>
                      )}

                      <button
                        onClick={handleResetGarden}
                        className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-red-300 hover:border-red-500/30 transition-all"
                        title="Reset all garden effects to neutral default"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      <input
                        type="checkbox"
                        checked={composition.gardenStudio?.enabled ?? false}
                        onChange={(e) => {
                          const nextState = e.target.checked
                          setComposition((prev) => ({
                            ...prev,
                            gardenStudio: {
                              ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                              enabled: nextState,
                            },
                          }))
                          showToast(
                            nextState ? 'Music-Grown Garden Mode activated' : 'Garden Mode disabled',
                            nextState ? 'success' : 'info'
                          )
                        }}
                        className="w-4 h-4 accent-emerald-400 rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* SECTION 1: GARDEN WORLD SCENE LIBRARY */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Garden World Library</span>
                      </label>
                      <button
                        onClick={() => gardenPhotoInputRef.current?.click()}
                        className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload Custom Photo</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {GARDEN_SCENES.map((scene) => {
                        const isSelected =
                          composition.gardenStudio?.enabled &&
                          composition.gardenStudio?.sceneId === scene.id

                        return (
                          <div
                            key={scene.id}
                            onClick={() => {
                              setComposition((prev) => ({
                                ...prev,
                                gardenStudio: {
                                  ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                  enabled: true,
                                  sceneId: scene.id,
                                },
                              }))
                              showToast(`Loaded ${scene.name}`, 'success')
                            }}
                            className={`p-2 rounded-xl border text-left transition-all cursor-pointer relative group overflow-hidden ${
                              isSelected
                                ? 'bg-emerald-950/40 border-emerald-400 shadow-lg shadow-emerald-500/20'
                                : 'bg-slate-900/80 border-white/10 hover:border-white/20 hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="relative aspect-video rounded-lg overflow-hidden mb-2 bg-slate-950">
                              <img
                                src={scene.thumbnailPath}
                                alt={scene.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  // Graceful fallback to jpg if webp fails
                                  ;(e.target as HTMLImageElement).src = scene.imagePath
                                }}
                              />
                              {isSelected && (
                                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-black shadow-md">
                                  <CheckCircle2 className="w-3 h-3" />
                                </div>
                              )}
                            </div>
                            <div className="font-bold text-xs text-white truncate">{scene.name}</div>
                            <div className="text-[10px] text-slate-400 truncate mt-0.5">
                              {scene.subtitle}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Custom Photograph Active Panel */}
                    {composition.gardenStudio?.sceneId === 'custom-photo' &&
                      composition.gardenStudio.customPhoto.customImageUrl && (
                        <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Custom Garden Photo Active</span>
                            </span>
                            <button
                              onClick={() =>
                                setComposition((prev) => ({
                                  ...prev,
                                  gardenStudio: {
                                    ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                    sceneId: 'moonlit-rose',
                                  },
                                }))
                              }
                              className="text-[10px] text-red-400 hover:text-red-300 font-bold"
                            >
                              Remove Custom
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <div className="text-[11px] text-slate-400 mb-1">Image Fit</div>
                              <select
                                value={composition.gardenStudio.customPhoto.customImageFit}
                                onChange={(e) =>
                                  setComposition((prev) => ({
                                    ...prev,
                                    gardenStudio: {
                                      ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                      customPhoto: {
                                        ...(prev.gardenStudio?.customPhoto || DEFAULT_GARDEN_CONFIG.customPhoto),
                                        customImageFit: e.target.value as any,
                                      },
                                    },
                                  }))
                                }
                                className="w-full bg-slate-800 border border-white/10 rounded-lg p-1.5 text-xs text-white"
                              >
                                <option value="cover">Cover (Cinematic Fill)</option>
                                <option value="contain">Contain (Full Image)</option>
                                <option value="100%">Stretch 100%</option>
                              </select>
                            </div>

                            <div>
                              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                                <span>Brightness</span>
                                <span>{composition.gardenStudio.customPhoto.brightness}%</span>
                              </div>
                              <input
                                type="range"
                                min="30"
                                max="150"
                                value={composition.gardenStudio.customPhoto.brightness}
                                onChange={(e) =>
                                  setComposition((prev) => ({
                                    ...prev,
                                    gardenStudio: {
                                      ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                      customPhoto: {
                                        ...(prev.gardenStudio?.customPhoto || DEFAULT_GARDEN_CONFIG.customPhoto),
                                        brightness: parseInt(e.target.value),
                                      },
                                    },
                                  }))
                                }
                                className="w-full accent-emerald-400"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                  </div>

                  {/* SECTION 2: MUSICAL BLOOM ENGINE */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sprout className="w-4 h-4 text-emerald-400" />
                        <div>
                          <div className="text-xs font-bold text-white">Musical Bloom Engine</div>
                          <div className="text-[10px] text-slate-400">
                            Layered geometric botanical petal uncurling & blooming
                          </div>
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={composition.gardenStudio?.bloom.enabled ?? false}
                        onChange={(e) =>
                          setComposition((prev) => ({
                            ...prev,
                            gardenStudio: {
                              ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                              bloom: {
                                ...(prev.gardenStudio?.bloom || DEFAULT_GARDEN_CONFIG.bloom),
                                enabled: e.target.checked,
                              },
                            },
                          }))
                        }
                        className="w-4 h-4 accent-emerald-400 rounded cursor-pointer"
                      />
                    </div>

                    {composition.gardenStudio?.bloom.enabled && (
                      <div className="space-y-3 pt-3 border-t border-white/5">
                        <div>
                          <div className="flex justify-between text-xs text-slate-300 mb-1">
                            <span>Bloom Intensity</span>
                            <span className="font-mono text-emerald-400 font-bold">
                              {composition.gardenStudio.bloom.intensity}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={composition.gardenStudio.bloom.intensity}
                            onChange={(e) =>
                              setComposition((prev) => ({
                                ...prev,
                                gardenStudio: {
                                  ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                  bloom: {
                                    ...(prev.gardenStudio?.bloom || DEFAULT_GARDEN_CONFIG.bloom),
                                    intensity: parseInt(e.target.value),
                                  },
                                },
                              }))
                            }
                            className="w-full accent-emerald-400 cursor-pointer"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-slate-300 mb-1">
                            <span>Bloom Response Speed</span>
                            <span className="font-mono text-emerald-400 font-bold">
                              {Math.round(composition.gardenStudio.bloom.responseSpeed * 100)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.1"
                            max="0.9"
                            step="0.05"
                            value={composition.gardenStudio.bloom.responseSpeed}
                            onChange={(e) =>
                              setComposition((prev) => ({
                                ...prev,
                                gardenStudio: {
                                  ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                  bloom: {
                                    ...(prev.gardenStudio?.bloom || DEFAULT_GARDEN_CONFIG.bloom),
                                    responseSpeed: parseFloat(e.target.value),
                                  },
                                },
                              }))
                            }
                            className="w-full accent-emerald-400 cursor-pointer"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                            <input
                              type="checkbox"
                              checked={composition.gardenStudio.bloom.beatBloomPulse}
                              onChange={(e) =>
                                setComposition((prev) => ({
                                  ...prev,
                                  gardenStudio: {
                                    ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                    bloom: {
                                      ...(prev.gardenStudio?.bloom || DEFAULT_GARDEN_CONFIG.bloom),
                                      beatBloomPulse: e.target.checked,
                                    },
                                  },
                                }))
                              }
                              className="accent-emerald-400 w-3.5 h-3.5"
                            />
                            <span>Beat Opening Accents</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                            <input
                              type="checkbox"
                              checked={composition.gardenStudio.bloom.gradualSongBloom}
                              onChange={(e) =>
                                setComposition((prev) => ({
                                  ...prev,
                                  gardenStudio: {
                                    ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                    bloom: {
                                      ...(prev.gardenStudio?.bloom || DEFAULT_GARDEN_CONFIG.bloom),
                                      gradualSongBloom: e.target.checked,
                                    },
                                  },
                                }))
                              }
                              className="accent-emerald-400 w-3.5 h-3.5"
                            />
                            <span>Song Progression Bloom</span>
                          </label>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div>
                            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                              <span>Botanical Centers</span>
                              <span>{composition.gardenStudio.bloom.flowerCount}</span>
                            </div>
                            <input
                              type="range"
                              min="4"
                              max="8"
                              value={composition.gardenStudio.bloom.flowerCount}
                              onChange={(e) =>
                                setComposition((prev) => ({
                                  ...prev,
                                  gardenStudio: {
                                    ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                    bloom: {
                                      ...(prev.gardenStudio?.bloom || DEFAULT_GARDEN_CONFIG.bloom),
                                      flowerCount: parseInt(e.target.value),
                                    },
                                  },
                                }))
                              }
                              className="w-full accent-emerald-400"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                              <span>Petal Ring Layers</span>
                              <span>{composition.gardenStudio.bloom.petalLayers}</span>
                            </div>
                            <input
                              type="range"
                              min="2"
                              max="4"
                              value={composition.gardenStudio.bloom.petalLayers}
                              onChange={(e) =>
                                setComposition((prev) => ({
                                  ...prev,
                                  gardenStudio: {
                                    ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                    bloom: {
                                      ...(prev.gardenStudio?.bloom || DEFAULT_GARDEN_CONFIG.bloom),
                                      petalLayers: parseInt(e.target.value),
                                    },
                                  },
                                }))
                              }
                              className="w-full accent-emerald-400"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SECTION 3: AUDIO-REACTIVE ENGINE & LIVE METERS */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-cyan-400" />
                        <div>
                          <div className="text-xs font-bold text-white">Audio-Reactive Engine</div>
                          <div className="text-[10px] text-slate-400">
                            Custom DSP mappings to botanical motion & lighting
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">
                        Live DSP Analysis
                      </span>
                    </div>

                    {/* Real-Time DSP Signal Meters */}
                    <div className="grid grid-cols-4 gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-white/5">
                      {[
                        { label: 'Bass', val: liveBands.bass, color: 'bg-rose-500' },
                        { label: 'Mids', val: liveBands.mid, color: 'bg-emerald-400' },
                        { label: 'Treble', val: liveBands.treble, color: 'bg-cyan-400' },
                        { label: 'Energy', val: liveBands.overall, color: 'bg-amber-400' },
                      ].map((meter) => (
                        <div key={meter.label} className="space-y-1">
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span>{meter.label}</span>
                            <span className="font-mono">{Math.round(meter.val * 100)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${meter.color} transition-all duration-75`}
                              style={{ width: `${Math.min(100, Math.round(meter.val * 100))}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mappings */}
                    <div className="space-y-3 pt-2">
                      {[
                        {
                          key: 'bassToBloom',
                          label: 'Bass → Bloom Amount & Garden Pulse',
                          desc: 'Low frequencies expand petals & pulse scene breathing',
                        },
                        {
                          key: 'midToLeafSway',
                          label: 'Mid Frequencies → Leaf & Stem Sway',
                          desc: 'Melodic mid-range instruments oscillate stems naturally',
                        },
                        {
                          key: 'trebleToFireflies',
                          label: 'Treble → Firefly Glow Flare',
                          desc: 'High acoustic sparkle brightens firefly luminous cores',
                        },
                        {
                          key: 'trebleToPollenSparkle',
                          label: 'Treble → Pollen Spore Shimmer',
                          desc: 'Percussive highs shimmer floating pollen particles',
                        },
                        {
                          key: 'energyToAmbientLighting',
                          label: 'Overall Energy → Atmospheric Lighting',
                          desc: 'Master song intensity brightens ambient garden haze',
                        },
                      ].map((mapping) => (
                        <div key={mapping.key} className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-300">
                            <span>{mapping.label}</span>
                            <span className="font-mono text-cyan-400 font-bold">
                              {(composition.gardenStudio?.audioMapping as any)?.[mapping.key] ?? 50}%
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500">{mapping.desc}</p>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={(composition.gardenStudio?.audioMapping as any)?.[mapping.key] ?? 50}
                            onChange={(e) =>
                              setComposition((prev) => ({
                                ...prev,
                                gardenStudio: {
                                  ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                  audioMapping: {
                                    ...(prev.gardenStudio?.audioMapping || DEFAULT_GARDEN_CONFIG.audioMapping),
                                    [mapping.key]: parseInt(e.target.value),
                                  },
                                },
                              }))
                            }
                            className="w-full accent-cyan-400 cursor-pointer"
                          />
                        </div>
                      ))}

                      {/* Smoothing Factor */}
                      <div className="pt-2 border-t border-white/5 space-y-1">
                        <div className="flex justify-between text-xs text-slate-300">
                          <span>Audio Curve Smoothing (Zero Jitter)</span>
                          <span className="font-mono text-cyan-400 font-bold">
                            {Math.round(
                              (composition.gardenStudio?.audioMapping.smoothingFactor ?? 0.8) * 100
                            )}
                            %
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.2"
                          max="0.95"
                          step="0.05"
                          value={composition.gardenStudio?.audioMapping.smoothingFactor ?? 0.8}
                          onChange={(e) =>
                            setComposition((prev) => ({
                              ...prev,
                              gardenStudio: {
                                ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                audioMapping: {
                                  ...(prev.gardenStudio?.audioMapping || DEFAULT_GARDEN_CONFIG.audioMapping),
                                  smoothingFactor: parseFloat(e.target.value),
                                },
                              },
                            }))
                          }
                          className="w-full accent-cyan-400 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: NATURAL BOTANICAL ATMOSPHERE & MOTION */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-4">
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Atmosphere & Botanical Motion</div>
                        <div className="text-[10px] text-slate-400">
                          Organic fireflies, pollen, mist, light rays, and wind
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* 1. Fireflies */}
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-white">Fireflies Drift & Glow</div>
                            <div className="text-[10px] text-slate-400">
                              Luminous organic particles with treble reactivity
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={composition.gardenStudio?.atmosphere.firefliesEnabled ?? false}
                            onChange={(e) =>
                              setComposition((prev) => ({
                                ...prev,
                                gardenStudio: {
                                  ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                  atmosphere: {
                                    ...(prev.gardenStudio?.atmosphere || DEFAULT_GARDEN_CONFIG.atmosphere),
                                    firefliesEnabled: e.target.checked,
                                  },
                                },
                              }))
                            }
                            className="w-4 h-4 accent-emerald-400 rounded cursor-pointer"
                          />
                        </div>

                        {composition.gardenStudio?.atmosphere.firefliesEnabled && (
                          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                            <div>
                              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                                <span>Count</span>
                                <span>{composition.gardenStudio.atmosphere.fireflyCount}</span>
                              </div>
                              <input
                                type="range"
                                min="10"
                                max="70"
                                value={composition.gardenStudio.atmosphere.fireflyCount}
                                onChange={(e) =>
                                  setComposition((prev) => ({
                                    ...prev,
                                    gardenStudio: {
                                      ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                      atmosphere: {
                                        ...(prev.gardenStudio?.atmosphere || DEFAULT_GARDEN_CONFIG.atmosphere),
                                        fireflyCount: parseInt(e.target.value),
                                      },
                                    },
                                  }))
                                }
                                className="w-full accent-emerald-400"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                                <span>Glow Size</span>
                                <span>{composition.gardenStudio.atmosphere.fireflySize.toFixed(1)}px</span>
                              </div>
                              <input
                                type="range"
                                min="1.5"
                                max="5.0"
                                step="0.5"
                                value={composition.gardenStudio.atmosphere.fireflySize}
                                onChange={(e) =>
                                  setComposition((prev) => ({
                                    ...prev,
                                    gardenStudio: {
                                      ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                      atmosphere: {
                                        ...(prev.gardenStudio?.atmosphere || DEFAULT_GARDEN_CONFIG.atmosphere),
                                        fireflySize: parseFloat(e.target.value),
                                      },
                                    },
                                  }))
                                }
                                className="w-full accent-emerald-400"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 2. Floating Pollen */}
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-white">Floating Pollen Spores</div>
                            <div className="text-[10px] text-slate-400">
                              Buoyant floral dust motes drifting in sunbeams
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={composition.gardenStudio?.atmosphere.pollenEnabled ?? false}
                            onChange={(e) =>
                              setComposition((prev) => ({
                                ...prev,
                                gardenStudio: {
                                  ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                  atmosphere: {
                                    ...(prev.gardenStudio?.atmosphere || DEFAULT_GARDEN_CONFIG.atmosphere),
                                    pollenEnabled: e.target.checked,
                                  },
                                },
                              }))
                            }
                            className="w-4 h-4 accent-emerald-400 rounded cursor-pointer"
                          />
                        </div>

                        {composition.gardenStudio?.atmosphere.pollenEnabled && (
                          <div className="pt-2 border-t border-white/5">
                            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                              <span>Pollen Density</span>
                              <span>{composition.gardenStudio.atmosphere.pollenDensity}</span>
                            </div>
                            <input
                              type="range"
                              min="15"
                              max="90"
                              value={composition.gardenStudio.atmosphere.pollenDensity}
                              onChange={(e) =>
                                setComposition((prev) => ({
                                  ...prev,
                                  gardenStudio: {
                                    ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                    atmosphere: {
                                      ...(prev.gardenStudio?.atmosphere || DEFAULT_GARDEN_CONFIG.atmosphere),
                                      pollenDensity: parseInt(e.target.value),
                                    },
                                  },
                                }))
                              }
                              className="w-full accent-emerald-400"
                            />
                          </div>
                        )}
                      </div>

                      {/* 3. Atmospheric Mist */}
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-white">Atmospheric Drifting Mist</div>
                            <div className="text-[10px] text-slate-400">
                              Multi-layer soft fog drifting across the garden
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={composition.gardenStudio?.atmosphere.mistEnabled ?? false}
                            onChange={(e) =>
                              setComposition((prev) => ({
                                ...prev,
                                gardenStudio: {
                                  ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                  atmosphere: {
                                    ...(prev.gardenStudio?.atmosphere || DEFAULT_GARDEN_CONFIG.atmosphere),
                                    mistEnabled: e.target.checked,
                                  },
                                },
                              }))
                            }
                            className="w-4 h-4 accent-emerald-400 rounded cursor-pointer"
                          />
                        </div>

                        {composition.gardenStudio?.atmosphere.mistEnabled && (
                          <div className="pt-2 border-t border-white/5">
                            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                              <span>Mist Density</span>
                              <span>{composition.gardenStudio.atmosphere.mistDensity}%</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="80"
                              value={composition.gardenStudio.atmosphere.mistDensity}
                              onChange={(e) =>
                                setComposition((prev) => ({
                                  ...prev,
                                  gardenStudio: {
                                    ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                    atmosphere: {
                                      ...(prev.gardenStudio?.atmosphere || DEFAULT_GARDEN_CONFIG.atmosphere),
                                      mistDensity: parseInt(e.target.value),
                                    },
                                  },
                                }))
                              }
                              className="w-full accent-emerald-400"
                            />
                          </div>
                        )}
                      </div>

                      {/* 4. Volumetric Light Rays */}
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-white">
                              Volumetric Sun / Moon Rays
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Diagonal celestial god-rays streaming through foliage
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={composition.gardenStudio?.atmosphere.lightRaysEnabled ?? false}
                            onChange={(e) =>
                              setComposition((prev) => ({
                                ...prev,
                                gardenStudio: {
                                  ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                  atmosphere: {
                                    ...(prev.gardenStudio?.atmosphere || DEFAULT_GARDEN_CONFIG.atmosphere),
                                    lightRaysEnabled: e.target.checked,
                                  },
                                },
                              }))
                            }
                            className="w-4 h-4 accent-emerald-400 rounded cursor-pointer"
                          />
                        </div>

                        {composition.gardenStudio?.atmosphere.lightRaysEnabled && (
                          <div className="pt-2 border-t border-white/5">
                            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                              <span>Ray Intensity</span>
                              <span>{composition.gardenStudio.atmosphere.lightRayIntensity}%</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="90"
                              value={composition.gardenStudio.atmosphere.lightRayIntensity}
                              onChange={(e) =>
                                setComposition((prev) => ({
                                  ...prev,
                                  gardenStudio: {
                                    ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                    atmosphere: {
                                      ...(prev.gardenStudio?.atmosphere || DEFAULT_GARDEN_CONFIG.atmosphere),
                                      lightRayIntensity: parseInt(e.target.value),
                                    },
                                  },
                                }))
                              }
                              className="w-full accent-emerald-400"
                            />
                          </div>
                        )}
                      </div>

                      {/* 5. Natural Wind */}
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-white">Natural Garden Breeze</div>
                            <div className="text-[10px] text-slate-400">
                              Directs drifting pollen, foliage sway & light rays
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={composition.gardenStudio?.atmosphere.windEnabled ?? false}
                            onChange={(e) =>
                              setComposition((prev) => ({
                                ...prev,
                                gardenStudio: {
                                  ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                  atmosphere: {
                                    ...(prev.gardenStudio?.atmosphere || DEFAULT_GARDEN_CONFIG.atmosphere),
                                    windEnabled: e.target.checked,
                                  },
                                },
                              }))
                            }
                            className="w-4 h-4 accent-emerald-400 rounded cursor-pointer"
                          />
                        </div>

                        {composition.gardenStudio?.atmosphere.windEnabled && (
                          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                            <div>
                              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                                <span>Breeze Speed</span>
                                <span>{composition.gardenStudio.atmosphere.windSpeed}</span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="10"
                                value={composition.gardenStudio.atmosphere.windSpeed}
                                onChange={(e) =>
                                  setComposition((prev) => ({
                                    ...prev,
                                    gardenStudio: {
                                      ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                      atmosphere: {
                                        ...(prev.gardenStudio?.atmosphere || DEFAULT_GARDEN_CONFIG.atmosphere),
                                        windSpeed: parseInt(e.target.value),
                                      },
                                    },
                                  }))
                                }
                                className="w-full accent-emerald-400"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                                <span>Wind Direction</span>
                                <span>{composition.gardenStudio.atmosphere.windDirectionDeg}°</span>
                              </div>
                              <input
                                type="range"
                                min="-45"
                                max="45"
                                value={composition.gardenStudio.atmosphere.windDirectionDeg}
                                onChange={(e) =>
                                  setComposition((prev) => ({
                                    ...prev,
                                    gardenStudio: {
                                      ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                      atmosphere: {
                                        ...(prev.gardenStudio?.atmosphere || DEFAULT_GARDEN_CONFIG.atmosphere),
                                        windDirectionDeg: parseInt(e.target.value),
                                      },
                                    },
                                  }))
                                }
                                className="w-full accent-emerald-400"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 6. Dew Highlights & 2.5D Parallax */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-white/5 cursor-pointer text-xs text-white">
                          <span className="flex items-center gap-1.5">
                            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Dew Highlights</span>
                          </span>
                          <input
                            type="checkbox"
                            checked={composition.gardenStudio?.atmosphere.dewHighlightsEnabled ?? false}
                            onChange={(e) =>
                              setComposition((prev) => ({
                                ...prev,
                                gardenStudio: {
                                  ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                  atmosphere: {
                                    ...(prev.gardenStudio?.atmosphere || DEFAULT_GARDEN_CONFIG.atmosphere),
                                    dewHighlightsEnabled: e.target.checked,
                                  },
                                },
                              }))
                            }
                            className="w-4 h-4 accent-emerald-400 rounded cursor-pointer"
                          />
                        </label>

                        <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-white/5 cursor-pointer text-xs text-white">
                          <span className="flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-emerald-400" />
                            <span>2.5D Parallax</span>
                          </span>
                          <input
                            type="checkbox"
                            checked={composition.gardenStudio?.atmosphere.parallaxEnabled ?? false}
                            onChange={(e) =>
                              setComposition((prev) => ({
                                ...prev,
                                gardenStudio: {
                                  ...(prev.gardenStudio || DEFAULT_GARDEN_CONFIG),
                                  atmosphere: {
                                    ...(prev.gardenStudio?.atmosphere || DEFAULT_GARDEN_CONFIG.atmosphere),
                                    parallaxEnabled: e.target.checked,
                                  },
                                },
                              }))
                            }
                            className="w-4 h-4 accent-emerald-400 rounded cursor-pointer"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: VISUALIZER & SPECTRUM */}
              {activeTab === 'visualizer' && (
                <div className="space-y-5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>Audio Spectrum & Waveform Style</span>
                  </h3>

                  {/* Spectrum Style Cards */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Spectrum Architecture</span>
                      </label>
                      {composition.visualizer.spectrumStyle !== 'none' ? (
                        <button
                          onClick={() => {
                            setComposition((prev) => ({
                              ...prev,
                              visualizer: { ...prev.visualizer, spectrumStyle: 'none' },
                            }))
                            showToast('Deselected spectrum bars', 'info')
                          }}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40 transition-all flex items-center gap-1 cursor-pointer"
                          title="Click to deselect and hide spectrum bars"
                        >
                          <EyeOff className="w-3 h-3" />
                          <span>Deselect (Turn Off)</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">None (Clean)</span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {[
                        {
                          id: 'circular',
                          label: 'Circular Halo',
                          desc: '360° radial pulsating halo ring',
                          icon: Disc,
                        },
                        {
                          id: 'bars',
                          label: 'Vertical Bars',
                          desc: 'Stereo vertical equalizer columns',
                          icon: BarChart3,
                        },
                        {
                          id: 'mirrored',
                          label: 'Mirrored Center',
                          desc: 'Symmetric center-split bounce',
                          icon: Activity,
                        },
                        {
                          id: 'bottom-equalizer',
                          label: 'Bottom Equalizer',
                          desc: 'Dynamic ground frequency bars',
                          icon: SlidersHorizontal,
                        },
                        {
                          id: 'none',
                          label: 'Disabled (None)',
                          desc: 'Turn off spectrum frequency bars',
                          icon: EyeOff,
                        },
                      ].map((style) => {
                        const Icon = style.icon
                        const isSelected = composition.visualizer.spectrumStyle === style.id
                        return (
                          <button
                            key={style.id}
                            onClick={() => {
                              // If already selected, clicking it again toggles/deselects it!
                              const nextStyle = isSelected ? 'none' : style.id
                              setComposition((prev) => ({
                                ...prev,
                                visualizer: { ...prev.visualizer, spectrumStyle: nextStyle as any },
                              }))
                              if (isSelected) {
                                showToast(`Deselected ${style.label}`, 'info')
                              }
                            }}
                            className={`p-3 rounded-xl border text-left transition-all relative group overflow-hidden cursor-pointer ${
                              isSelected
                                ? 'bg-gradient-to-tr from-cyan-500/20 via-indigo-600/20 to-violet-500/10 border-cyan-400 text-white shadow-lg shadow-cyan-500/20'
                                : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white hover:border-white/20 hover:bg-slate-800/60'
                            } ${style.id === 'none' ? 'sm:col-span-2' : ''}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                                  isSelected
                                    ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                                    : 'bg-slate-800 text-slate-400 group-hover:text-cyan-300 group-hover:bg-slate-700'
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-xs truncate">{style.label}</span>
                                  {isSelected && (
                                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>Active</span>
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-500 truncate mt-0.5">{style.desc}</p>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Waveform Style Cards */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Waves className="w-3.5 h-3.5 text-violet-400" />
                        <span>Time-Domain Waveform</span>
                      </label>
                      {composition.visualizer.waveformStyle !== 'none' ? (
                        <button
                          onClick={() => {
                            setComposition((prev) => ({
                              ...prev,
                              visualizer: { ...prev.visualizer, waveformStyle: 'none' },
                            }))
                            showToast('Deselected waveform', 'info')
                          }}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/10 text-violet-300 border border-violet-500/30 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40 transition-all flex items-center gap-1 cursor-pointer"
                          title="Click to deselect and hide waveform"
                        >
                          <EyeOff className="w-3 h-3" />
                          <span>Deselect (Turn Off)</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">None (Clean)</span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {[
                        {
                          id: 'smooth-center',
                          label: 'Smooth Bezier Wave',
                          desc: 'Floating liquid audio ribbon',
                          icon: Waves,
                        },
                        {
                          id: 'oscilloscope',
                          label: 'CRT Oscilloscope',
                          desc: 'Retro analog cathode beam',
                          icon: Tv,
                        },
                        {
                          id: 'dual-sided',
                          label: 'Dual-Sided Ribbon',
                          desc: 'Mirrored acoustic envelope',
                          icon: Activity,
                        },
                        {
                          id: 'none',
                          label: 'Disabled (None)',
                          desc: 'Turn off waveform line',
                          icon: EyeOff,
                        },
                      ].map((style) => {
                        const Icon = style.icon
                        const isSelected = composition.visualizer.waveformStyle === style.id
                        return (
                          <button
                            key={style.id}
                            onClick={() => {
                              // If already selected, clicking it again toggles/deselects it!
                              const nextStyle = isSelected ? 'none' : style.id
                              setComposition((prev) => ({
                                ...prev,
                                visualizer: { ...prev.visualizer, waveformStyle: nextStyle as any },
                              }))
                              if (isSelected) {
                                showToast(`Deselected ${style.label}`, 'info')
                              }
                            }}
                            className={`p-3 rounded-xl border text-left transition-all relative group overflow-hidden cursor-pointer ${
                              isSelected
                                ? 'bg-gradient-to-tr from-violet-600/20 via-indigo-600/20 to-cyan-500/10 border-violet-400 text-white shadow-lg shadow-violet-500/20'
                                : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white hover:border-white/20 hover:bg-slate-800/60'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                                  isSelected
                                    ? 'bg-violet-500 text-white shadow-md shadow-violet-500/30'
                                    : 'bg-slate-800 text-slate-400 group-hover:text-violet-300 group-hover:bg-slate-700'
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-xs truncate">{style.label}</span>
                                  {isSelected && (
                                    <span className="text-[10px] font-black uppercase tracking-wider text-violet-300 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>Active</span>
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-500 truncate mt-0.5">{style.desc}</p>
                              </div>
                            </div>
                          </button>
                        )
                      })}
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

                  {/* Bass-Reactive Camera Scale Zoom & Beat Punch */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Bass-Reactive Camera Scale Zoom</span>
                      </label>
                      {composition.cinematicFx.bassScaleEnabled ? (
                        <button
                          onClick={() => {
                            setComposition((prev) => ({
                              ...prev,
                              cinematicFx: { ...prev.cinematicFx, bassScaleEnabled: false },
                            }))
                            showToast('Deselected Bass Zoom punch', 'info')
                          }}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40 transition-all flex items-center gap-1 cursor-pointer"
                          title="Click to deselect / turn off camera bass punch"
                        >
                          <EyeOff className="w-3 h-3" />
                          <span>Deselect (Turn Off)</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setComposition((prev) => ({
                              ...prev,
                              cinematicFx: { ...prev.cinematicFx, bassScaleEnabled: true },
                            }))
                            showToast('Enabled Bass Zoom punch', 'success')
                          }}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-white/10 hover:border-cyan-500/40 hover:text-cyan-300 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          <span>Turn On Bass Zoom</span>
                        </button>
                      )}
                    </div>

                    <div
                      onClick={() => {
                        const nextState = !composition.cinematicFx.bassScaleEnabled
                        setComposition((prev) => ({
                          ...prev,
                          cinematicFx: { ...prev.cinematicFx, bassScaleEnabled: nextState },
                        }))
                        showToast(nextState ? 'Bass Zoom Punch enabled' : 'Deselected Bass Zoom punch', 'info')
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                        composition.cinematicFx.bassScaleEnabled
                          ? 'bg-gradient-to-tr from-cyan-500/20 via-indigo-600/20 to-violet-500/10 border-cyan-400 shadow-lg shadow-cyan-500/20'
                          : 'bg-slate-900/80 border-white/10 hover:border-white/20 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                              composition.cinematicFx.bassScaleEnabled
                                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                                : 'bg-slate-800 text-slate-400 group-hover:text-cyan-300'
                            }`}
                          >
                            <Activity className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">Dynamic Bass Camera Punch</span>
                              {composition.cinematicFx.bassScaleEnabled ? (
                                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Active</span>
                                </span>
                              ) : (
                                <span className="text-[10px] font-medium text-slate-500">Disabled (Static)</span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Pulsates the camera scale dynamically in sync with low frequency bass kicks
                            </p>
                          </div>
                        </div>

                        <div className="relative inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={composition.cinematicFx.bassScaleEnabled}
                            onChange={(e) =>
                              setComposition((prev) => ({
                                ...prev,
                                cinematicFx: {
                                  ...prev.cinematicFx,
                                  bassScaleEnabled: e.target.checked,
                                },
                              }))
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Strength slider if active */}
                      {composition.cinematicFx.bassScaleEnabled && (
                        <div className="mt-3 pt-3 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                            <span>Bass Punch Strength</span>
                            <span className="font-mono text-cyan-400 font-bold">
                              {composition.cinematicFx.bassScaleStrength * 10}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={composition.cinematicFx.bassScaleStrength}
                            onChange={(e) =>
                              setComposition((prev) => ({
                                ...prev,
                                cinematicFx: {
                                  ...prev.cinematicFx,
                                  bassScaleStrength: parseInt(e.target.value),
                                },
                              }))
                            }
                            className="w-full accent-cyan-400 cursor-pointer"
                          />
                          <div className="flex justify-between text-[9px] text-slate-500 mt-0.5">
                            <span>Subtle (1)</span>
                            <span>Standard (5)</span>
                            <span>Extreme Kick (10)</span>
                          </div>
                        </div>
                      )}
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
                      className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{fx.label}</span>
                            {fx.key === 'bassScaleEnabled' && (composition.cinematicFx as any)[fx.key] && (
                              <button
                                onClick={() => {
                                  setComposition((prev) => ({
                                    ...prev,
                                    cinematicFx: { ...prev.cinematicFx, bassScaleEnabled: false },
                                  }))
                                  showToast('Deselected Bass Zoom punch', 'info')
                                }}
                                className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-red-500/20 hover:text-red-300 transition-all flex items-center gap-1 cursor-pointer"
                                title="Click to deselect"
                              >
                                <EyeOff className="w-2.5 h-2.5" />
                                <span>Deselect</span>
                              </button>
                            )}
                          </div>
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

                      {/* Special slider for bass scale zoom strength */}
                      {fx.key === 'bassScaleEnabled' && composition.cinematicFx.bassScaleEnabled && (
                        <div className="pt-2 border-t border-white/5">
                          <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                            <span>Scale Strength</span>
                            <span className="font-mono text-cyan-400 font-bold">
                              {composition.cinematicFx.bassScaleStrength * 10}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={composition.cinematicFx.bassScaleStrength}
                            onChange={(e) =>
                              setComposition((prev) => ({
                                ...prev,
                                cinematicFx: {
                                  ...prev.cinematicFx,
                                  bassScaleStrength: parseInt(e.target.value),
                                },
                              }))
                            }
                            className="w-full accent-cyan-400 cursor-pointer"
                          />
                        </div>
                      )}
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
        {/* PRESET CONFIRMATION MODAL (EXPLICIT USER CONFIRMATION)    */}
        {/* ========================================================= */}
        {selectedPresetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="bg-[#090A0F] border border-white/15 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: selectedPresetModal.accentColor }}
                  />
                  <h3 className="text-sm font-bold text-white">{selectedPresetModal.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedPresetModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedPresetModal.subtitle}
                </p>

                <div className="p-3 bg-slate-950/70 border border-white/10 rounded-xl space-y-2">
                  <div className="text-[11px] font-bold text-slate-400">Effects to be activated:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPresetModal.enabledModules.map((mod) => (
                      <span
                        key={mod}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                      >
                        ✓ {mod}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-[10px] text-slate-500">
                  Other effects will remain OFF. Selecting a preset never activates hidden effects.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedPresetModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-900 border border-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleApplyPreset(selectedPresetModal)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/20"
                >
                  Confirm & Apply
                </button>
              </div>
            </div>
          </div>
        )}

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
        {/* BRUSH MASK PAINTER STUDIO MODAL                           */}
        {/* ========================================================= */}
        {isMaskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <div className="bg-[#090A0F] border border-white/15 rounded-3xl p-5 sm:p-6 max-w-4xl w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 p-0.5 flex items-center justify-center">
                    <Brush className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>2.5D Brush Mask Studio</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        Interactive Cutout
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Paint over the foreground subject (window, character, object) to create a parallax layer.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsMaskModalOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Painting Canvas Viewport */}
              <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center select-none">
                {composition.photoMotion?.sourceImageUrl && (
                  <img
                    src={composition.photoMotion.sourceImageUrl}
                    alt="Mask Background"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none opacity-80"
                  />
                )}
                <canvas
                  ref={maskCanvasRef}
                  onMouseDown={startMaskDrawing}
                  onMouseMove={drawMask}
                  onMouseUp={stopMaskDrawing}
                  onMouseLeave={stopMaskDrawing}
                  onTouchStart={startMaskDrawing}
                  onTouchMove={drawMask}
                  onTouchEnd={stopMaskDrawing}
                  className="absolute inset-0 w-full h-full object-contain cursor-crosshair touch-none"
                />
              </div>

              {/* Tool Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex bg-slate-900 p-1 rounded-xl border border-white/10 text-xs">
                    <button
                      onClick={() => setIsEraser(false)}
                      className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 ${
                        !isEraser ? 'bg-red-500 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Brush className="w-3.5 h-3.5" />
                      <span>Brush</span>
                    </button>
                    <button
                      onClick={() => setIsEraser(true)}
                      className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 ${
                        isEraser ? 'bg-cyan-500 text-black shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Eraser</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Size:</span>
                    <input
                      type="range"
                      min="8"
                      max="100"
                      value={brushSize}
                      onChange={(e) => setBrushSize(parseInt(e.target.value))}
                      className="w-24 accent-red-400"
                    />
                    <span className="font-mono text-cyan-400 text-[11px] w-6">{brushSize}px</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleInvertMask}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10"
                  >
                    Invert
                  </button>
                  <button
                    onClick={handleClearMask}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-400 border border-white/10"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={handleSaveMask}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Apply Mask</span>
                  </button>
                </div>
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
