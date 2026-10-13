/**
 * Studio Bass Enhancer & Sub-Harmonic Generator
 * Ultra-modern, 100% client-side pro audio plugin workstation for IndiaTools.
 * Built with Web Audio API, Linkwitz-Riley 4th-order crossovers, AudioWorklet sub-octave DSP,
 * and high-performance 20–300 Hz canvas visualizer.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Volume2,
  Sliders,
  Layers,
  Sparkles,
  Download,
  ShieldCheck,
  Zap,
  Lock,
  RotateCcw,
  RefreshCw,
  FolderOpen,
} from 'lucide-react'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useToast } from '../components/common/Toast'

import {
  BassEnhancerParams,
  DEFAULT_BASS_PARAMS,
  BassExportFormat,
  BassExportProgress,
} from '../lib/audio/bassEnhancer/types'
import {
  buildBassEnhancerGraph,
  registerSubHarmonicWorklet,
  updateBassEngineParams,
  BassEnhancerNodes,
} from '../lib/audio/bassEnhancer/subHarmonicEngine'
import { renderOfflineBassEnhancedBuffer } from '../lib/audio/bassEnhancer/offlineBassRenderer'
import { BassSpectrumVisualizer } from './bassEnhancer/BassSpectrumVisualizer'
import { BassControlDeck } from './bassEnhancer/BassControlDeck'
import { BassTransportHud } from './bassEnhancer/BassTransportHud'
import { DropZoneOverlay } from './bassEnhancer/DropZoneOverlay'
import { BassExportModal } from './bassEnhancer/BassExportModal'

import { decodeAudioFile } from '../lib/audio/audioProcessor'
import { extractWaveformData, WaveformData } from '../lib/audio/waveformRenderer'
import { encodeMultiChannelWav } from '../lib/audio/encoders/multiChannelWavEncoder'
import { encodeAudioBufferToMp3 } from '../lib/audio/encoders/mp3Encoder'
import { generateVisualizerDemoSpecimen } from '../lib/video/demoAudioGenerator'

export const StudioBassEnhancerTool: React.FC = () => {
  const tool = getToolBySlug('studio-bass-enhancer')!
  const { showToast } = useToast()

  // Audio source & buffer state
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [sourceBuffer, setSourceBuffer] = useState<AudioBuffer | null>(null)
  const [waveformData, setWaveformData] = useState<WaveformData | null>(null)
  const [isLoadingAudio, setIsLoadingAudio] = useState(false)
  const [isLoadingDemo, setIsLoadingDemo] = useState(false)

  // Transport state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1.0)
  const [isMuted, setIsMuted] = useState(false)
  const [isLooping, setIsLooping] = useState(false)

  // DSP Parameters
  const [params, setParams] = useState<BassEnhancerParams>(DEFAULT_BASS_PARAMS)

  // Export Modal State
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState<BassExportProgress>({
    stage: 'idle',
    percentage: 0,
    stageMessage: 'Initializing…',
  })
  const exportCancelledRef = useRef(false)

  // Web Audio Graph refs
  const audioContextRef = useRef<AudioContext | null>(null)
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null)
  const dspNodesRef = useRef<BassEnhancerNodes | null>(null)
  const playbackStartTimeRef = useRef(0)
  const playbackOffsetRef = useRef(0)
  const animFrameRef = useRef<number | null>(null)

  // Initialize or get master AudioContext
  const getAudioContext = useCallback(async (): Promise<AudioContext> => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      audioContextRef.current = new AudioCtx()
      await registerSubHarmonicWorklet(audioContextRef.current)
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume()
    }
    return audioContextRef.current
  }, [])

  // Stop active playback immediately with complete silence
  const stopPlayback = useCallback(() => {
    if (activeSourceRef.current) {
      try {
        activeSourceRef.current.stop()
        activeSourceRef.current.disconnect()
      } catch {
        // Source might already have ended
      }
      activeSourceRef.current = null
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }

    setIsPlaying(false)
  }, [])

  // Load Audio File
  const handleLoadFile = async (file: File) => {
    stopPlayback()
    setIsLoadingAudio(true)
    playbackOffsetRef.current = 0
    setCurrentTime(0)

    try {
      showToast(`Decoding ${file.name}…`, 'info')
      const decoded = await decodeAudioFile(file)
      const buffer = decoded.buffer
      setAudioFile(file)
      setSourceBuffer(buffer)
      setDuration(buffer.duration)

      // Generate waveform
      const wf = extractWaveformData(buffer, 600)
      setWaveformData(wf)

      // Initialize DSP graph
      const ctx = await getAudioContext()
      if (!dspNodesRef.current) {
        dspNodesRef.current = buildBassEnhancerGraph(ctx, params, true)
        dspNodesRef.current.outputNode.connect(ctx.destination)
      } else {
        updateBassEngineParams(dspNodesRef.current, params)
      }

      showToast(`Loaded ${file.name} (${buffer.duration.toFixed(1)}s)`, 'success')
    } catch (err: any) {
      console.error('Audio load error:', err)
      showToast(err.message || 'Failed to decode audio file.', 'error')
    } finally {
      setIsLoadingAudio(false)
    }
  }

  // Load Synthwave Demo Track
  const handleLoadDemoTrack = async () => {
    setIsLoadingDemo(true)
    try {
      showToast('Generating punchy electronic demo track…', 'info')
      const demoFile = await generateVisualizerDemoSpecimen()
      await handleLoadFile(demoFile)
    } catch (err: any) {
      showToast('Failed to generate demo track.', 'error')
    } finally {
      setIsLoadingDemo(false)
    }
  }

  // Play / Pause Toggle
  const handlePlayPause = async () => {
    if (!sourceBuffer) return

    if (isPlaying) {
      // Pause: calculate and store current playback offset
      const ctx = await getAudioContext()
      const elapsed = ctx.currentTime - playbackStartTimeRef.current
      playbackOffsetRef.current = (playbackOffsetRef.current + elapsed) % sourceBuffer.duration
      setCurrentTime(playbackOffsetRef.current)
      stopPlayback()
    } else {
      // Play
      const ctx = await getAudioContext()

      // Ensure graph is connected
      if (!dspNodesRef.current) {
        dspNodesRef.current = buildBassEnhancerGraph(ctx, params, true)
        dspNodesRef.current.outputNode.connect(ctx.destination)
      }

      const source = ctx.createBufferSource()
      source.buffer = sourceBuffer
      source.loop = isLooping
      source.connect(dspNodesRef.current.inputNode)

      const startOffset = playbackOffsetRef.current % sourceBuffer.duration
      source.start(0, startOffset)
      playbackStartTimeRef.current = ctx.currentTime
      activeSourceRef.current = source
      setIsPlaying(true)

      source.onended = () => {
        if (!isLooping) {
          setIsPlaying(false)
          playbackOffsetRef.current = 0
          setCurrentTime(0)
        }
      }

      // Time tracking animation frame
      const updateClock = () => {
        if (!activeSourceRef.current) return
        const elapsed = ctx.currentTime - playbackStartTimeRef.current
        const nowSec = (startOffset + elapsed) % sourceBuffer.duration
        setCurrentTime(nowSec)
        animFrameRef.current = requestAnimationFrame(updateClock)
      }
      animFrameRef.current = requestAnimationFrame(updateClock)
    }
  }

  // Seek Scrubber
  const handleSeek = async (timeSec: number) => {
    if (!sourceBuffer) return
    const wasPlaying = isPlaying
    stopPlayback()
    playbackOffsetRef.current = Math.max(0, Math.min(sourceBuffer.duration, timeSec))
    setCurrentTime(playbackOffsetRef.current)

    if (wasPlaying) {
      const ctx = await getAudioContext()
      if (!dspNodesRef.current) {
        dspNodesRef.current = buildBassEnhancerGraph(ctx, params, true)
        dspNodesRef.current.outputNode.connect(ctx.destination)
      }

      const source = ctx.createBufferSource()
      source.buffer = sourceBuffer
      source.loop = isLooping
      source.connect(dspNodesRef.current.inputNode)
      source.start(0, playbackOffsetRef.current)
      playbackStartTimeRef.current = ctx.currentTime
      activeSourceRef.current = source
      setIsPlaying(true)

      source.onended = () => {
        if (!isLooping) {
          setIsPlaying(false)
          playbackOffsetRef.current = 0
          setCurrentTime(0)
        }
      }

      const updateClock = () => {
        if (!activeSourceRef.current) return
        const elapsed = ctx.currentTime - playbackStartTimeRef.current
        const nowSec = (playbackOffsetRef.current + elapsed) % sourceBuffer.duration
        setCurrentTime(nowSec)
        animFrameRef.current = requestAnimationFrame(updateClock)
      }
      animFrameRef.current = requestAnimationFrame(updateClock)
    }
  }

  // Spacebar Play/Pause Keyboard Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault()
        handlePlayPause()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, sourceBuffer])

  // Real-time parameter updates
  const handleParamsChange = (updater: (prev: BassEnhancerParams) => BassEnhancerParams) => {
    setParams((prev) => {
      const next = updater(prev)
      if (dspNodesRef.current) {
        updateBassEngineParams(dspNodesRef.current, next)
      }
      return next
    })
  }

  // Export Audio Rendering
  const handleTriggerExport = async (format: BassExportFormat) => {
    if (!sourceBuffer) {
      showToast('Please load an audio file first.', 'info')
      return
    }

    stopPlayback()
    setIsExporting(true)
    exportCancelledRef.current = false
    setExportProgress({
      stage: 'analyzing',
      percentage: 5,
      stageMessage: 'Analyzing Spectrum…',
    })

    try {
      // 1. Run offline DSP rendering
      const renderedBuffer = await renderOfflineBassEnhancedBuffer(sourceBuffer, params, {
        onProgress: (p) => setExportProgress(p),
        isCancelled: () => exportCancelledRef.current,
      })

      if (exportCancelledRef.current) {
        showToast('Export cancelled.', 'info')
        return
      }

      setExportProgress({
        stage: 'encoding',
        percentage: 88,
        stageMessage: `Encoding ${format === '320kbps-mp3' ? '320 kbps MP3' : '24-bit WAV'}…`,
      })

      let blob: Blob
      let ext: string

      if (format === '320kbps-mp3') {
        blob = await encodeAudioBufferToMp3(renderedBuffer, {
          kbps: 320,
          onProgress: (pct: number) => {
            setExportProgress({
              stage: 'encoding',
              percentage: 88 + Math.round(pct * 0.12),
              stageMessage: `Writing MP3 bitstream (${Math.round(pct)}%)…`,
            })
          },
          isCancelled: () => exportCancelledRef.current,
        })
        ext = 'mp3'
      } else {
        const bitDepth = format === '24bit-wav' ? 24 : 16
        blob = await encodeMultiChannelWav(
          [renderedBuffer.getChannelData(0), renderedBuffer.getChannelData(1)],
          renderedBuffer.sampleRate,
          {
            bitDepth,
            onProgress: (pct: number) => {
              setExportProgress({
                stage: 'encoding',
                percentage: 88 + Math.round(pct * 0.12),
                stageMessage: `Packing ${bitDepth}-bit PCM WAV (${Math.round(pct)}%)…`,
              })
            },
            isCancelled: () => exportCancelledRef.current,
          }
        )
        ext = 'wav'
      }

      setExportProgress({
        stage: 'done',
        percentage: 100,
        stageMessage: 'Export complete!',
      })

      // Download file
      const rawName = (audioFile?.name || 'track').replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
      const fileName = `${rawName}_Deep_Bass_Boost.${ext}`

      const downloadUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000)

      showToast(`Exported ${fileName} successfully!`, 'success')
      setTimeout(() => setIsExporting(false), 800)
    } catch (err: any) {
      if (!exportCancelledRef.current) {
        console.error('Export failed:', err)
        showToast(err.message || 'Export failed.', 'error')
      }
      setIsExporting(false)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPlayback()
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close()
      }
    }
  }, [stopPlayback])

  return (
    <ToolPageLayout tool={tool}>
      <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Subtle Background Particle Glow */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-25">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff2d55]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#ffb800]/10 rounded-full blur-3xl" />
        </div>

        {/* WORKSTATION UPPER SUITE: Visualizer / DropZone (Left) & Control Deck (Right) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Center Viewport (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {!sourceBuffer ? (
              <DropZoneOverlay
                onFileSelected={handleLoadFile}
                onLoadDemoTrack={handleLoadDemoTrack}
                isLoadingDemo={isLoadingDemo}
              />
            ) : (
              <div className="flex flex-col gap-3">
                {/* Active Audio Banner */}
                <div className="bg-[#0e0e11] border border-white/5 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-2 h-2 rounded-full bg-[#ff2d55] animate-ping" />
                    <span className="text-xs font-mono font-bold text-white truncate max-w-[240px] sm:max-w-sm">
                      {audioFile?.name || 'Session Audio'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                      ({sourceBuffer.sampleRate}Hz • {sourceBuffer.numberOfChannels}Ch)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      stopPlayback()
                      setSourceBuffer(null)
                      setAudioFile(null)
                      setWaveformData(null)
                    }}
                    className="text-[11px] font-mono text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Change File</span>
                  </button>
                </div>

                {/* 20–300 Hz Spectrum Visualizer */}
                <BassSpectrumVisualizer
                  analyserNode={dspNodesRef.current?.analyserNode || null}
                  crossoverHz={params.crossoverHz}
                  subLevel={params.subLevel}
                  monoLock={params.monoLock}
                  isBypassed={params.bypassed}
                  isPlaying={isPlaying}
                />
              </div>
            )}
          </div>

          {/* Right Panel: Precision DSP Rack (5 Cols) */}
          <div className="lg:col-span-5">
            <BassControlDeck
              params={params}
              onChange={handleParamsChange}
              disabled={!sourceBuffer}
            />
          </div>
        </div>

        {/* BOTTOM HUD: Waveform Overview, Transport & Export */}
        <div className="relative z-10">
          <BassTransportHud
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            isLooping={isLooping}
            isBypassed={params.bypassed}
            waveformData={waveformData}
            onPlayPause={handlePlayPause}
            onSeek={handleSeek}
            onVolumeChange={(v) => {
              setVolume(v)
              if (dspNodesRef.current) {
                dspNodesRef.current.outputNode.gain.value = v
              }
            }}
            onToggleMute={() => {
              setIsMuted(!isMuted)
              if (dspNodesRef.current) {
                dspNodesRef.current.outputNode.gain.value = !isMuted ? 0 : volume
              }
            }}
            onToggleLoop={() => setIsLooping(!isLooping)}
            onToggleBypass={() =>
              handleParamsChange((p) => ({ ...p, bypassed: !p.bypassed }))
            }
            onTriggerExport={handleTriggerExport}
            disabled={!sourceBuffer}
          />
        </div>

        {/* EXPORT PROGRESS MODAL */}
        <BassExportModal
          isOpen={isExporting}
          progress={exportProgress}
          onCancel={() => {
            exportCancelledRef.current = true
            setIsExporting(false)
          }}
        />

        {/* SEO & AUDIO ENGINEERING MASTER GUIDE */}
        <div className="relative z-10 bg-slate-950/60 border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 text-slate-300">
          <div className="border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#ff2d55]" />
              <span>Studio Bass Enhancer & Sub-Harmonic Engineering Guide</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              How true sub-harmonic synthesis, Linkwitz-Riley crossovers, and non-linear saturation transform low-end impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
            <div className="space-y-3">
              <h3 className="font-bold text-white text-sm text-[#ff2d55]">
                1. Sub-Harmonic Octave Synthesizer (-1 Octave)
              </h3>
              <p>
                Unlike generic EQ bass boosters that merely amplify existing muddy mud around 100–250 Hz, our sub-harmonic DSP analyzes the fundamental zero-crossings and amplitude envelope of your low-end. It synthesizes pure, phase-locked content exactly one octave below the fundamental ($f/2$), injecting physical, chest-thumping sub-bass that was previously missing.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-white text-sm text-[#ffb800]">
                2. Phase-Aligned 4th-Order Linkwitz-Riley Crossover
              </h3>
              <p>
                A 4th-order Linkwitz-Riley crossover (-24 dB/octave) splits the audio into a sub-bass path and mid/high passthrough. Because Linkwitz-Riley filters maintain a constant $360^\circ$ phase alignment at the crossover frequency, summing the processed sub and clean mid/high paths produces a totally flat magnitude response with zero comb filtering or hollow notches.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-white text-sm text-[#00f0ff]">
                3. Earbud & Smartphone Saturation Overtones
              </h3>
              <p>
                Smartphone speakers, laptops, and cheap earbuds cannot physically reproduce frequencies below 60 Hz. Our hyperbolic tangent (tanh) and polynomial waveshapers generate controlled 2nd and 3rd order harmonics (80–240 Hz). Through psychoacoustic phenomenon of the "missing fundamental", your brain perceives deep sub-bass even on small drivers.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-white text-sm text-emerald-400">
                4. Mono Bass Lock (&lt;120 Hz Phase Guard)
              </h3>
              <p>
                Stereo imaging in deep sub-bass frequencies causes severe phase cancellation on car subwoofers and club PA sound systems, resulting in thin, weak bass. Mono Bass Lock collapses all frequencies below 120 Hz to mono center while preserving wide stereo imaging across vocals, guitars, and synths above 120 Hz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
