import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import {
  Music,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Download,
  Sparkles,
  Radio,
  FileAudio,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Layers,
  Lock,
  ShieldCheck,
  Cpu,
  Zap,
  SlidersHorizontal,
  Headphones,
  Disc,
  Upload,
  X,
  Repeat,
  FileDown,
} from 'lucide-react'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useToast } from '../components/common/Toast'
import {
  applyKaraokeDsp,
  applyPitchAndSpeedForExport,
  generateKaraokeDemoSpecimen,
} from '../lib/audio/karaokeDsp'
import {
  extractWaveformData,
  renderWaveformOnCanvas,
  WaveformData,
} from '../lib/audio/waveformRenderer'
import { decodeAudioFile } from '../lib/audio/audioProcessor'
import { encodeAudioBufferToWav } from '../lib/audio/encoders/wavEncoder'
import { encodeAudioBufferToMp3 } from '../lib/audio/encoders/mp3Encoder'

export const StudioKaraokeTool: React.FC = () => {
  const tool = getToolBySlug('studio-karaoke-vocal-remover')!
  const { showToast } = useToast()

  // File and decoding state
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [sourceBuffer, setSourceBuffer] = useState<AudioBuffer | null>(null)
  const [processedBuffer, setProcessedBuffer] = useState<AudioBuffer | null>(null)
  const [waveformData, setWaveformData] = useState<WaveformData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingStep, setLoadingStep] = useState<string>('')
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isMono, setIsMono] = useState<boolean>(false)
  const [hasClipped, setHasClipped] = useState<boolean>(false)
  const [peakLevel, setPeakLevel] = useState<number>(0)

  // Audio settings
  const [vocalReduction, setVocalReduction] = useState<number>(0.9) // 0.0 to 1.0 (default 90%)
  const [bassPreservation, setBassPreservation] = useState<number>(0.75) // 0.0 to 1.0 (default 75%)
  const [outputGain, setOutputGain] = useState<number>(1.0) // 0.5 to 2.0 (default 1.0)
  const [semitones, setSemitones] = useState<number>(0) // -12 to +12
  const [speed, setSpeed] = useState<number>(1.0) // 0.5 to 2.0

  // Playback state
  const [activeTrack, setActiveTrack] = useState<'karaoke' | 'original'>('karaoke')
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [volume, setVolume] = useState<number>(1.0)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isLooping, setIsLooping] = useState<boolean>(false)

  // Export settings & state
  const [exportFormat, setExportFormat] = useState<'mp3' | 'wav'>('mp3')
  const [mp3Bitrate, setMp3Bitrate] = useState<128 | 192 | 256 | 320>(192)
  const [customFilename, setCustomFilename] = useState<string>('')
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const [exportProgress, setExportProgress] = useState<number>(0)
  const [exportStage, setExportStage] = useState<string>('')

  // Refs for Web Audio playback
  const audioCtxRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const playbackStartTimeRef = useRef<number>(0)
  const playbackOffsetRef = useRef<number>(0)
  const animFrameRef = useRef<number | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const isCancelledRef = useRef<boolean>(false)

  // Helper to lazily obtain/resume AudioContext
  const getAudioContext = useCallback((): AudioContext => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      audioCtxRef.current = new AudioCtxClass()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.stop()
          sourceNodeRef.current.disconnect()
        } catch {
          // ignore
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close()
        } catch {
          // ignore
        }
      }
    }
  }, [])

  // Draw waveform whenever peaks, current playback time, or active track changes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const progress = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0
    renderWaveformOnCanvas(canvas, waveformData, progress, activeTrack === 'karaoke')
  }, [waveformData, currentTime, duration, activeTrack])

  // Handle window resizing for high-DPI canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)
      const progress = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0
      renderWaveformOnCanvas(canvas, waveformData, progress, activeTrack === 'karaoke')
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [waveformData, currentTime, duration, activeTrack])

  // Compute DSP processed buffer when source buffer or DSP parameters change
  useEffect(() => {
    if (!sourceBuffer) return

    let isCurrent = true
    const timer = setTimeout(async () => {
      try {
        const ctx = getAudioContext()
        const { buffer: newProcessed, hasClipped: clipped, peakLevel: peak } = await applyKaraokeDsp(
          sourceBuffer,
          {
            vocalReduction,
            bassPreservation,
            outputGain,
            semitones,
            speed,
          },
          ctx
        )

        if (!isCurrent) return
        setProcessedBuffer(newProcessed)
        setHasClipped(clipped)
        setPeakLevel(peak)

        // If currently playing in karaoke mode, smoothly swap source
        if (isPlaying && activeTrack === 'karaoke' && sourceNodeRef.current) {
          const currentOffset = playbackOffsetRef.current + (ctx.currentTime - playbackStartTimeRef.current) * (Math.pow(2, semitones / 12) * speed)
          const boundedOffset = Math.max(0, Math.min(sourceBuffer.duration, currentOffset))

          try {
            sourceNodeRef.current.stop()
            sourceNodeRef.current.disconnect()
          } catch {
            // ignore
          }

          startPlaybackAt(boundedOffset, newProcessed)
        }
      } catch (err: unknown) {
        console.error('DSP recalculation failed', err)
      }
    }, 60)

    return () => {
      isCurrent = false
      clearTimeout(timer)
    }
  }, [sourceBuffer, vocalReduction, bassPreservation, outputGain, getAudioContext])

  // Handle Audio File Selection
  const loadAudioFile = async (file: File) => {
    setFileError(null)
    setIsLoading(true)
    setLoadingStep('Reading and decoding audio...')

    // Stop existing playback
    stopPlayback()

    try {
      const { buffer, metadata } = await decodeAudioFile(file)
      setSourceFile(file)
      setSourceBuffer(buffer)
      setDuration(buffer.duration)
      setCurrentTime(0)
      playbackOffsetRef.current = 0

      const detectedMono = buffer.numberOfChannels === 1
      setIsMono(detectedMono)

      // Base custom filename on file name
      const cleanName = file.name.replace(/\.[^/.]+$/, '')
      setCustomFilename(`${cleanName}_karaoke`)

      setLoadingStep('Rendering high-resolution waveform...')
      const wf = extractWaveformData(buffer, 600)
      setWaveformData(wf)

      setLoadingStep('Applying stereo center isolation DSP...')
      const ctx = getAudioContext()
      const { buffer: initialKaraoke, hasClipped: clipped, peakLevel: peak } = await applyKaraokeDsp(
        buffer,
        {
          vocalReduction,
          bassPreservation,
          outputGain,
          semitones,
          speed,
        },
        ctx
      )
      setProcessedBuffer(initialKaraoke)
      setHasClipped(clipped)
      setPeakLevel(peak)

      showToast(`Loaded ${file.name} successfully!`, 'success')
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to decode audio file.'
      setFileError(errMsg)
      showToast(errMsg, 'error')
    } finally {
      setIsLoading(false)
      setLoadingStep('')
    }
  }

  // Load Built-in Demo Specimen
  const handleLoadDemo = async () => {
    setFileError(null)
    setIsLoading(true)
    setLoadingStep('Synthesizing stereo demo track...')
    try {
      const specimen = await generateKaraokeDemoSpecimen()
      await loadAudioFile(specimen)
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to generate demo specimen.'
      setFileError(errMsg)
      showToast(errMsg, 'error')
      setIsLoading(false)
    }
  }

  // Start playback at given offset
  const startPlaybackAt = (offset: number, customBuffer?: AudioBuffer) => {
    const ctx = getAudioContext()
    const targetBuffer = customBuffer || (activeTrack === 'karaoke' ? processedBuffer : sourceBuffer)
    if (!targetBuffer) return

    // Ensure Gain node is set up
    if (!gainNodeRef.current) {
      const gain = ctx.createGain()
      gain.gain.value = isMuted ? 0 : volume
      gain.connect(ctx.destination)
      gainNodeRef.current = gain
    } else {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume
    }

    const rate = Math.max(0.25, Math.min(4.0, Math.pow(2, semitones / 12) * speed))

    const source = ctx.createBufferSource()
    source.buffer = targetBuffer
    source.playbackRate.value = rate
    source.loop = isLooping
    source.connect(gainNodeRef.current)

    const boundedOffset = Math.max(0, Math.min(targetBuffer.duration, offset))
    playbackStartTimeRef.current = ctx.currentTime
    playbackOffsetRef.current = boundedOffset

    source.onended = () => {
      if (!isLooping && isPlaying) {
        setIsPlaying(false)
        setCurrentTime(0)
        playbackOffsetRef.current = 0
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      }
    }

    source.start(0, boundedOffset)
    sourceNodeRef.current = source
    setIsPlaying(true)

    // Start progress tracking loop
    trackProgress()
  }

  // Real-time animation loop tracking current time
  const trackProgress = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)

    const updateTime = () => {
      if (!audioCtxRef.current || !isPlaying || !sourceBuffer) return

      const ctx = audioCtxRef.current
      const rate = Math.pow(2, semitones / 12) * speed
      const elapsed = (ctx.currentTime - playbackStartTimeRef.current) * rate
      const current = playbackOffsetRef.current + elapsed

      if (current >= duration && !isLooping) {
        setIsPlaying(false)
        setCurrentTime(0)
        playbackOffsetRef.current = 0
        return
      }

      setCurrentTime(isLooping ? current % duration : Math.min(duration, current))
      animFrameRef.current = requestAnimationFrame(updateTime)
    }

    animFrameRef.current = requestAnimationFrame(updateTime)
  }

  // Stop / Pause Playback
  const pausePlayback = () => {
    if (!sourceNodeRef.current || !audioCtxRef.current) return
    const ctx = audioCtxRef.current
    const rate = Math.pow(2, semitones / 12) * speed
    const elapsed = (ctx.currentTime - playbackStartTimeRef.current) * rate
    const newOffset = Math.min(duration, playbackOffsetRef.current + elapsed)
    playbackOffsetRef.current = newOffset
    setCurrentTime(newOffset)

    try {
      sourceNodeRef.current.stop()
      sourceNodeRef.current.disconnect()
    } catch {
      // ignore
    }
    sourceNodeRef.current = null
    setIsPlaying(false)
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
  }

  const stopPlayback = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop()
        sourceNodeRef.current.disconnect()
      } catch {
        // ignore
      }
      sourceNodeRef.current = null
    }
    setIsPlaying(false)
    setCurrentTime(0)
    playbackOffsetRef.current = 0
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
  }

  // Toggle Play / Pause
  const handleTogglePlay = () => {
    if (!sourceBuffer) {
      showToast('Please load an audio file or click "Try Sample Track" first.', 'info')
      return
    }

    if (isPlaying) {
      pausePlayback()
    } else {
      startPlaybackAt(currentTime >= duration ? 0 : currentTime)
    }
  }

  // Switch between Original and Karaoke track seamlessly during playback
  const handleToggleTrack = (track: 'karaoke' | 'original') => {
    if (activeTrack === track) return
    setActiveTrack(track)

    if (isPlaying) {
      const ctx = getAudioContext()
      const rate = Math.pow(2, semitones / 12) * speed
      const elapsed = (ctx.currentTime - playbackStartTimeRef.current) * rate
      const currentOffset = Math.min(duration, playbackOffsetRef.current + elapsed)

      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.stop()
          sourceNodeRef.current.disconnect()
        } catch {
          // ignore
        }
      }

      const targetBuffer = track === 'karaoke' ? processedBuffer : sourceBuffer
      if (targetBuffer) {
        startPlaybackAt(currentOffset, targetBuffer)
      }
    }
  }

  // Waveform Click / Scrub
  const handleWaveformClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || duration <= 0) return

    const rect = canvasRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percent = Math.max(0, Math.min(1, clickX / rect.width))
    const seekTime = percent * duration

    setCurrentTime(seekTime)
    playbackOffsetRef.current = seekTime

    if (isPlaying) {
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.stop()
          sourceNodeRef.current.disconnect()
        } catch {
          // ignore
        }
      }
      startPlaybackAt(seekTime)
    }
  }

  // Update Pitch & Speed dynamically during playback
  const handlePitchChange = (newSemitones: number) => {
    setSemitones(newSemitones)
    if (sourceNodeRef.current) {
      const newRate = Math.max(0.25, Math.min(4.0, Math.pow(2, newSemitones / 12) * speed))
      sourceNodeRef.current.playbackRate.value = newRate
    }
  }

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed)
    if (sourceNodeRef.current) {
      const newRate = Math.max(0.25, Math.min(4.0, Math.pow(2, semitones / 12) * newSpeed))
      sourceNodeRef.current.playbackRate.value = newRate
    }
  }

  // Update volume
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    setIsMuted(false)
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume
    }
  }

  const handleToggleMute = () => {
    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = nextMuted ? 0 : volume
    }
  }

  // File Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('audio/') || /\.(mp3|wav|m4a|aac|ogg|webm|flac)$/i.test(file.name)) {
        await loadAudioFile(file)
      } else {
        showToast('Please select a valid audio file (MP3, WAV, M4A, OGG, WebM, etc.).', 'error')
      }
    }
  }

  // Export processed track to WAV or MP3
  const handleExport = async () => {
    if (!processedBuffer) {
      showToast('No processed audio available to export.', 'error')
      return
    }

    setIsExporting(true)
    setExportProgress(0)
    setExportStage('Initializing export pipeline...')
    isCancelledRef.current = false

    try {
      let exportBuffer = processedBuffer

      // Apply Pitch Shift & Speed if modified
      if (semitones !== 0 || speed !== 1.0) {
        setExportStage('Resampling audio for pitch & speed modification...')
        exportBuffer = await applyPitchAndSpeedForExport(processedBuffer, semitones, speed)
      }

      setExportStage(`Encoding into ${exportFormat.toUpperCase()} format...`)

      let resultBlob: Blob
      if (exportFormat === 'wav') {
        resultBlob = await encodeAudioBufferToWav(exportBuffer, {
          onProgress: (pct) => setExportProgress(pct),
          isCancelled: () => isCancelledRef.current,
        })
      } else {
        resultBlob = await encodeAudioBufferToMp3(exportBuffer, {
          kbps: mp3Bitrate,
          onProgress: (pct) => setExportProgress(pct),
          isCancelled: () => isCancelledRef.current,
        })
      }

      // Trigger automatic browser download
      const downloadUrl = URL.createObjectURL(resultBlob)
      const downloadLink = document.createElement('a')
      const fileName = `${customFilename || 'karaoke_track'}.${exportFormat}`
      downloadLink.href = downloadUrl
      downloadLink.download = fileName
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)

      setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000)

      showToast(`Exported "${fileName}" successfully!`, 'success')
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

  // Format seconds to M:SS
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
        {/* MAIN STUDIO WORKSPACE CONTAINER                                            */}
        {/* ========================================================================= */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-4 sm:p-6 lg:p-8 text-white relative overflow-hidden">
          {/* Subtle Ambient Backlight Glow */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                  Studio Karaoke DSP
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    Client Engine
                  </span>
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Zero Upload • Phase Cancellation • Sub-Bass Preservation • Instant Export
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadDemo}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-800/60 transition shadow-sm hover:shadow-cyan-900/30 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Try Sample Track</span>
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

          {/* Error / Warning Alerts */}
          {fileError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Audio Processing Error</p>
                <p className="mt-0.5 text-rose-300/90">{fileError}</p>
              </div>
              <button
                type="button"
                onClick={() => setFileError(null)}
                className="text-rose-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {isMono && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-950/50 border border-amber-700/70 text-amber-300 text-xs sm:text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Mono Audio Recording Detected</p>
                <p className="mt-0.5 text-amber-200/90 leading-relaxed">
                  This audio file has only 1 channel (Mono). Center channel cancellation relies on stereo phase
                  differences (L - R). In a mono file, lead vocals and backing instruments are mathematically
                  identical, so differential cancellation cannot isolate vocals without attenuating the entire track.
                  For optimal karaoke performance, load a stereo track.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* DRAG AND DROP ZONE (IF NO FILE LOADED)                                     */}
          {/* ========================================================================= */}
          {!sourceBuffer && !isLoading && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`p-8 sm:p-14 rounded-2xl border-2 border-dashed transition text-center cursor-pointer flex flex-col items-center justify-center gap-4 ${
                isDraggingOver
                  ? 'border-cyan-400 bg-cyan-950/30 text-cyan-200'
                  : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 text-slate-400'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 rounded-3xl bg-slate-800/80 border border-slate-700 flex items-center justify-center shadow-inner group">
                <FileAudio className="w-8 h-8 text-cyan-400 transition transform group-hover:scale-110" />
              </div>
              <div className="space-y-1">
                <p className="text-base sm:text-lg font-bold text-white">
                  Drop your song here or <span className="text-cyan-400 underline underline-offset-4">browse files</span>
                </p>
                <p className="text-xs text-slate-500">
                  Supports MP3, WAV, M4A, AAC, OGG, FLAC and WebM • Maximum privacy (processed 100% in browser)
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
                  <span>Or test instantly with a Sample Song</span>
                </button>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="p-12 text-center rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">{loadingStep || 'Processing audio...'}</p>
                <p className="text-xs text-slate-500">Executing DSP algorithms locally in browser memory</p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ACTIVE STUDIO WORKSTATION (ONCE AUDIO IS LOADED)                          */}
          {/* ========================================================================= */}
          {sourceBuffer && !isLoading && (
            <div className="space-y-6">
              {/* File Info & A/B Track Switch Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                    <Disc className="w-5 h-5 text-cyan-400 animate-spin-slow" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white truncate max-w-[240px] sm:max-w-md">
                      {sourceFile?.name || 'Studio_Karaoke_Demo.wav'}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                      <span>{formatTime(duration)}</span>
                      <span>•</span>
                      <span>{sourceBuffer.sampleRate.toLocaleString()} Hz</span>
                      <span>•</span>
                      <span>{sourceBuffer.numberOfChannels === 1 ? 'Mono' : 'Stereo'}</span>
                      {hasClipped && (
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          • Peak Limited ({peakLevel.toFixed(2)}x)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* A/B Switch: Original vs Karaoke */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleToggleTrack('karaoke')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeTrack === 'karaoke'
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Karaoke Track</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleTrack('original')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeTrack === 'original'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Original Audio</span>
                  </button>
                </div>
              </div>

              {/* Waveform Canvas & Scrubber */}
              <div className="relative group">
                <div className="relative h-28 sm:h-36 rounded-2xl bg-slate-950 border border-slate-800/90 overflow-hidden shadow-inner cursor-pointer">
                  <canvas
                    ref={canvasRef}
                    onClick={handleWaveformClick}
                    className="w-full h-full block"
                    title="Click anywhere to jump playhead"
                  />
                  {/* Subtle Top & Bottom Gradient Vignettes */}
                  <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-slate-950/70 to-transparent pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-slate-950/70 to-transparent pointer-events-none" />

                  {/* Mode Badge in Waveform */}
                  <div className="absolute top-2.5 right-3 pointer-events-none">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border ${
                        activeTrack === 'karaoke'
                          ? 'bg-cyan-950/80 text-cyan-400 border-cyan-800'
                          : 'bg-purple-950/80 text-purple-400 border-purple-800'
                      }`}
                    >
                      {activeTrack === 'karaoke' ? 'DSP Karaoke Mode' : 'Original Audio Bypass'}
                    </span>
                  </div>
                </div>

                {/* Timeline display underneath waveform */}
                <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 px-1 mt-1.5">
                  <span className="text-cyan-400 font-bold">{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Player Transport Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-cyan-500/25 transition transform active:scale-95 cursor-pointer"
                    title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={stopPlayback}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                    title="Stop and return to start"
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

                {/* Volume & Mute */}
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
              {/* STUDIO DSP CONTROLS (SLIDERS & PRESETS)                                   */}
              {/* ========================================================================= */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                {/* 1. Vocal Reduction Intensity */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <MicOff className="w-4 h-4 text-cyan-400" />
                      <span>Vocal Reduction Intensity</span>
                    </label>
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      {Math.round(vocalReduction * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.02"
                    value={vocalReduction}
                    onChange={(e) => setVocalReduction(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <div className="flex items-center justify-between gap-1 text-[11px]">
                    <span className="text-slate-500">Off (0%)</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setVocalReduction(0.5)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] cursor-pointer"
                      >
                        50%
                      </button>
                      <button
                        type="button"
                        onClick={() => setVocalReduction(0.85)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] cursor-pointer"
                      >
                        85%
                      </button>
                      <button
                        type="button"
                        onClick={() => setVocalReduction(1.0)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] cursor-pointer"
                      >
                        100%
                      </button>
                    </div>
                    <span className="text-slate-500">Max (100%)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                    Cancels centered mono frequencies [L - &alpha; &times; (L + R) / 2] where lead vocal tracks are mixed.
                  </p>
                </div>

                {/* 2. Bass & Instrument Preservation */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Radio className="w-4 h-4 text-emerald-400" />
                      <span>Bass & Kick Preservation</span>
                    </label>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      {Math.round(bassPreservation * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={bassPreservation}
                    onChange={(e) => setBassPreservation(parseFloat(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <div className="flex items-center justify-between gap-1 text-[11px]">
                    <span className="text-slate-500">Bypass</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setBassPreservation(0.4)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] cursor-pointer"
                      >
                        40%
                      </button>
                      <button
                        type="button"
                        onClick={() => setBassPreservation(0.75)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] cursor-pointer"
                      >
                        75%
                      </button>
                      <button
                        type="button"
                        onClick={() => setBassPreservation(1.0)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] cursor-pointer"
                      >
                        100%
                      </button>
                    </div>
                    <span className="text-slate-500">Full Sub</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                    Filters sub-frequencies (&lt;140 Hz) with an IIR biquad low-pass filter to keep bassline and kick drum intact.
                  </p>
                </div>

                {/* 3. Pitch Shifter */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-purple-400" />
                      <span>Pitch Shifter (Key Transpose)</span>
                    </label>
                    <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                      {semitones > 0 ? `+${semitones}` : semitones} semitones
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="1"
                    value={semitones}
                    onChange={(e) => handlePitchChange(parseInt(e.target.value, 10))}
                    className="w-full accent-purple-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <div className="flex items-center justify-between gap-1 text-[11px]">
                    <span className="text-slate-500">-12 (1 Octave Down)</span>
                    <div className="flex items-center gap-1.5">
                      {[-4, -2, 0, 2, 4].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handlePitchChange(s)}
                          className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                            semitones === s
                              ? 'bg-purple-600 text-white font-bold'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          {s > 0 ? `+${s}` : s}
                        </button>
                      ))}
                    </div>
                    <span className="text-slate-500">+12 (1 Octave Up)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                    Adjust the musical key to comfortably fit your vocal singing range (±1 octave range).
                  </p>
                </div>

                {/* 4. Playback / Output Speed & Master Gain */}
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>Playback & Export Speed</span>
                    </label>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                      {speed.toFixed(2)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.05"
                    value={speed}
                    onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <div className="flex items-center justify-between gap-1 text-[11px]">
                    <span className="text-slate-500">0.5x Slow</span>
                    <div className="flex items-center gap-1.5">
                      {[0.75, 1.0, 1.25, 1.5].map((sp) => (
                        <button
                          key={sp}
                          type="button"
                          onClick={() => handleSpeedChange(sp)}
                          className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                            speed === sp
                              ? 'bg-amber-600 text-white font-bold'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          {sp}x
                        </button>
                      ))}
                    </div>
                    <span className="text-slate-500">2.0x Fast</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                    Speed up or slow down for singing rehearsals and instrumental practice sessions.
                  </p>
                </div>
              </div>

              {/* Master Output Gain Slider */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs font-bold text-white">Master Output Boost</p>
                    <p className="text-[10px] text-slate-400">Compensates for acoustic headroom after center cancellation</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.05"
                    value={outputGain}
                    onChange={(e) => setOutputGain(parseFloat(e.target.value))}
                    className="w-28 sm:w-40 accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                  <span className="text-xs font-mono font-bold text-white w-12 text-right">
                    {(outputGain * 100).toFixed(0)}%
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
                    <h3 className="text-base font-bold text-white">Export Instrumental / Karaoke Track</h3>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    High-quality local encoding • Zero server transfer
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                  {/* Format Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Audio Format</label>
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

                  {/* MP3 Bitrate (if MP3 selected) */}
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

                  {/* Filename */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Target Filename</label>
                    <input
                      type="text"
                      value={customFilename}
                      onChange={(e) => setCustomFilename(e.target.value)}
                      placeholder="karaoke_track"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Progress Bar (during export) */}
                {isExporting && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-cyan-800/80 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-cyan-300">{exportStage}</span>
                      <span className="font-mono text-cyan-400 font-bold">{exportProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 transition-all duration-150"
                        style={{ width: `${exportProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Export Action Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Processed completely client-side. No audio ever leaves your computer.</span>
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
                      <span>{isExporting ? 'Encoding...' : `Export & Download ${exportFormat.toUpperCase()}`}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* EDUCATIONAL & TECHNICAL DSP GUIDE SECTION                                 */}
        {/* ========================================================================= */}
        <div className="space-y-6 text-slate-800 dark:text-slate-200">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-500" />
              <span>How Center Channel Vocal Cancellation Works Mathematically</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              In modern commercial music mixing and studio recording, audio engineers pan primary elements
              across the stereo soundstage according to acoustic conventions:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                  Center Soundstage
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Lead Vocals & Snare</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Recorded in equal amplitude and phase on both Left and Right channels (L = R), creating
                  the acoustic illusion of a phantom center speaker.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  Wide Soundstage
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Backing Instruments & Reverb</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Panned hard left and right (guitars, keyboards, stereo synthesizers, panning pads, and stereo backing harmonies).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Low Frequency & Sub
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Kick Drum & Bassline</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Mixed centered to prevent uneven turntable needle excursion or speaker cone distortion below 140 Hz.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-mono space-y-2">
              <p className="font-bold text-slate-900 dark:text-white font-sans">The Differential Cancellation Formula:</p>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <code className="text-cyan-600 dark:text-cyan-400">
                  Center = (Left + Right) / 2<br />
                  Left' = Left - &alpha; &bull; Center + &beta; &bull; LowPass(Center)<br />
                  Right' = Right - &alpha; &bull; Center + &beta; &bull; LowPass(Center)
                </code>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                When &alpha; = 1.0, any signal identical in both channels cancels itself out completely.
                To prevent losing the kick drum and bass guitar (which are also centered), our engine extracts the
                low frequencies below 140 Hz using a 2nd-order biquad IIR filter and injects them back into both channels.
              </p>
            </div>
          </div>

          {/* Section 2: Audio Engineering Considerations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Radio className="w-5 h-5 text-purple-500" />
                <span>Why Does Stereo Reverb Sometimes Remain?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Studio vocal tracks often have stereo reverb and delay effects applied during mastering.
                While the direct, dry singing voice is panned dead center and cancels out completely,
                the reverberation tail is spread wide across the stereo spectrum with phase offsets.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                This slight ghost reverb is actually ideal for karaoke performances, as it gives subtle
                harmonic guidance for singers without clashing with their voice!
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-500" />
                <span>Zero Server Uploads & Absolute Privacy</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Unlike cloud-based audio tools that upload your private audio files and songs to remote
                third-party servers, IndiaTools runs every sample through your browser&apos;s Web Audio DSP engine
                and WebAssembly memory.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Zero bytes leave your computer or smartphone. You can safely process copyrighted studio stems,
                unreleased vocal tracks, and private recordings with complete peace of mind.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
