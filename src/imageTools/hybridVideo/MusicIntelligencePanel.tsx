import React, { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  Music,
  Activity,
  Zap,
  Sliders,
  CheckCircle2,
  Clock,
  Volume2,
  Play,
  RotateCcw,
  PlusCircle,
  Trash2,
  Flame,
  Heart,
  HelpCircle,
} from 'lucide-react'
import type { MediaAsset } from '../../lib/hybridVideo/types.ts'
import {
  analyzeAudioBuffer,
  type MusicAnalysisResult,
  type MusicSection,
  type MelodyProfileType,
} from '../../lib/hybridVideo/musicIntelligence.ts'

interface MusicIntelligencePanelProps {
  mediaAssets: MediaAsset[]
  musicAnalysis: MusicAnalysisResult | null
  onAnalysisComplete: (result: MusicAnalysisResult) => void
  playheadSec: number
  onSeek: (sec: number) => void
  onOpenAutoEditModal: () => void
  onAddManualBeatMarker?: (sec: number) => void
}

export const MusicIntelligencePanel: React.FC<MusicIntelligencePanelProps> = ({
  mediaAssets,
  musicAnalysis,
  onAnalysisComplete,
  playheadSec,
  onSeek,
  onOpenAutoEditModal,
  onAddManualBeatMarker,
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [sensitivity, setSensitivity] = useState(1.0)
  const [customMarkers, setCustomMarkers] = useState<number[]>([])

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Filter audio and video assets suitable for music analysis
  const audioAssets = mediaAssets.filter((a) => a.type === 'audio' || a.type === 'video')

  // Auto-select first audio track if not set
  useEffect(() => {
    if (!selectedAssetId && audioAssets.length > 0) {
      setSelectedAssetId(audioAssets[0].id)
    }
  }, [audioAssets, selectedAssetId])

  const selectedAsset = mediaAssets.find((a) => a.id === selectedAssetId)

  const handleAnalyze = async () => {
    if (!selectedAsset) {
      setAnalysisError('Please select an audio or video track to analyze.')
      return
    }

    setIsAnalyzing(true)
    setAnalysisError(null)

    try {
      const response = await fetch(selectedAsset.url)
      const arrayBuffer = await response.arrayBuffer()

      // Decode audio in browser Web Audio API
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioCtx()
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0))

      const result = await analyzeAudioBuffer(
        audioBuffer,
        selectedAsset.id,
        selectedAsset.name,
        sensitivity
      )

      onAnalysisComplete(result)
      await ctx.close()
    } catch (err) {
      setAnalysisError(`Music analysis failed: ${(err as Error).message}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Draw Waveform and Sections onto Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !musicAnalysis) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = Math.max(rect.width * dpr, 200)
    canvas.height = Math.max(rect.height * dpr, 80)
    ctx.scale(dpr, dpr)

    const w = rect.width
    const h = rect.height
    const duration = musicAnalysis.durationSec || 1

    // Clear background
    ctx.fillStyle = '#06080F'
    ctx.fillRect(0, 0, w, h)

    // Draw Section Blocks background
    for (const section of musicAnalysis.sections) {
      const startX = (section.startSec / duration) * w
      const endX = (section.endSec / duration) * w
      const sectionW = Math.max(endX - startX, 1)

      let fillColor = 'rgba(255, 255, 255, 0.03)'
      if (section.type === 'intro') fillColor = 'rgba(59, 130, 246, 0.08)'
      else if (section.type === 'melody') fillColor = 'rgba(168, 85, 247, 0.12)'
      else if (section.type === 'buildup') fillColor = 'rgba(245, 158, 11, 0.12)'
      else if (section.type === 'climax') fillColor = 'rgba(244, 63, 94, 0.18)'
      else if (section.type === 'outro') fillColor = 'rgba(14, 165, 233, 0.08)'

      ctx.fillStyle = fillColor
      ctx.fillRect(startX, 0, sectionW, h)

      // Section label border line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(startX, 0)
      ctx.lineTo(startX, h)
      ctx.stroke()
    }

    // Draw Energy Waveform Envelope
    const envelope = musicAnalysis.energyEnvelope
    if (envelope && envelope.length > 0) {
      const step = w / envelope.length

      // Draw mirrored energy bars
      for (let i = 0; i < envelope.length; i++) {
        const val = envelope[i]
        const barH = Math.max(val * (h * 0.75), 2)
        const x = i * step
        const y = (h - barH) / 2

        // Color based on climax or calm
        const timeAtSample = (i / envelope.length) * duration
        const isClimax =
          timeAtSample >= musicAnalysis.climaxStartSec && timeAtSample <= musicAnalysis.climaxEndSec

        ctx.fillStyle = isClimax
          ? `rgba(244, 63, 94, ${0.4 + val * 0.6})`
          : `rgba(6, 182, 212, ${0.25 + val * 0.7})`

        ctx.fillRect(x, y, Math.max(step * 0.85, 1.5), barH)
      }
    }

    // Draw Beat Markers
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.6)'
    ctx.lineWidth = 1
    for (const b of musicAnalysis.beats) {
      const bx = (b / duration) * w
      ctx.beginPath()
      ctx.moveTo(bx, h - 8)
      ctx.lineTo(bx, h)
      ctx.stroke()
    }

    // Draw Custom Markers
    ctx.strokeStyle = '#ec4899'
    ctx.lineWidth = 2
    for (const cm of customMarkers) {
      const cx = (cm / duration) * w
      ctx.beginPath()
      ctx.moveTo(cx, 0)
      ctx.lineTo(cx, 8)
      ctx.stroke()
    }

    // Draw Current Playhead Position
    const playheadX = (Math.min(playheadSec, duration) / duration) * w
    ctx.strokeStyle = '#22d3ee'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(playheadX, 0)
    ctx.lineTo(playheadX, h)
    ctx.stroke()

    // Playhead head icon
    ctx.fillStyle = '#22d3ee'
    ctx.beginPath()
    ctx.arc(playheadX, 4, 3.5, 0, Math.PI * 2)
    ctx.fill()
  }, [musicAnalysis, playheadSec, customMarkers])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!musicAnalysis) return
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percent = Math.max(0, Math.min(1, clickX / rect.width))
    const targetSec = percent * musicAnalysis.durationSec
    onSeek(targetSec)
  }

  const handleAddMarker = () => {
    setCustomMarkers((prev) => [...prev, playheadSec].sort((a, b) => a - b))
    if (onAddManualBeatMarker) {
      onAddManualBeatMarker(playheadSec)
    }
  }

  const handleClearMarkers = () => {
    setCustomMarkers([])
  }

  const formatSec = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const getProfileLabel = (p: MelodyProfileType) => {
    switch (p) {
      case 'soft-melody':
        return 'Soft Melody'
      case 'vocal-like':
        return 'Vocal-Like Line'
      case 'sustained-instrumental':
        return 'Sustained Strings / Synth'
      case 'piano-strings':
        return 'Piano / Strings'
      case 'beat-driven':
        return 'Beat-Driven Rhythm'
      case 'bass-heavy':
        return 'Bass-Heavy Groove'
      case 'high-energy-mixed':
        return 'High Energy Mix'
      default:
        return 'Uncertain / Mixed'
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#0D111A] text-white overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white">Music Intelligence</h3>
            <p className="text-[11px] text-white/50">100% Client-Side Web Audio Signal Analyzer</p>
          </div>
        </div>
      </div>

      {/* Track Selector & Analysis Action */}
      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
        <label className="text-xs font-medium text-white/70 block">Select Audio Track</label>

        {audioAssets.length === 0 ? (
          <div className="p-3 rounded-lg bg-white/[0.02] border border-dashed border-white/15 text-center text-xs text-white/40">
            No audio tracks in library. Import an MP3 or WAV file in the Media panel first.
          </div>
        ) : (
          <select
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            {audioAssets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name} ({formatSec(asset.durationSec)})
              </option>
            ))}
          </select>
        )}

        {/* Sensitivity & Analyze Button */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex-1 flex items-center gap-1.5 bg-black/30 border border-white/10 rounded-lg px-2.5 py-1.5">
            <Sliders className="w-3.5 h-3.5 text-white/40" />
            <span className="text-[10px] text-white/60">Beat Sens:</span>
            <input
              type="range"
              min={0.5}
              max={2.0}
              step={0.1}
              value={sensitivity}
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              className="w-16 accent-cyan-400 h-1"
            />
            <span className="text-[10px] text-cyan-300 font-mono">{sensitivity.toFixed(1)}x</span>
          </div>

          <button
            type="button"
            disabled={!selectedAsset || isAnalyzing}
            onClick={handleAnalyze}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isAnalyzing
                ? 'bg-cyan-500/30 text-cyan-200 cursor-wait'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20 active:scale-95'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Activity className="w-3.5 h-3.5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Analyze Music
              </>
            )}
          </button>
        </div>

        {analysisError && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-lg">
            {analysisError}
          </p>
        )}
      </div>

      {/* Analysis Results Display */}
      {musicAnalysis ? (
        <div className="space-y-4">
          {/* Overview Metric Badges */}
          <div className="grid grid-cols-2 gap-2">
            {/* BPM Badge */}
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center justify-between text-[11px] text-white/50 mb-1">
                <span>Estimated BPM</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                  {Math.round(musicAnalysis.bpmConfidence * 100)}% conf
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-white font-mono">{musicAnalysis.bpm}</span>
                <span className="text-[10px] text-white/40">beats/min</span>
              </div>
              <div className="text-[10px] text-cyan-400 mt-1">
                {musicAnalysis.beats.length} beats detected
              </div>
            </div>

            {/* Mood Badge */}
            <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="text-[11px] text-white/50 mb-1">Emotional Mood</div>
              <div className="flex items-center gap-1.5">
                {musicAnalysis.dominantMood === 'romantic' || musicAnalysis.dominantMood === 'calm' ? (
                  <Heart className="w-4 h-4 text-pink-400 shrink-0" />
                ) : (
                  <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span className="text-sm font-bold capitalize text-white">
                  {musicAnalysis.dominantMood}
                </span>
              </div>
              <div className="text-[10px] text-white/40 mt-1">
                Peak: {formatSec(musicAnalysis.climaxStartSec)} - {formatSec(musicAnalysis.climaxEndSec)}
              </div>
            </div>
          </div>

          {/* Melody vs Rhythm Meter */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Profile:</span>
              <span className="font-semibold text-purple-300">
                {getProfileLabel(musicAnalysis.sections[0]?.melodyProfile || 'uncertain')}
              </span>
            </div>

            {/* Balance Bar */}
            <div className="space-y-1">
              <div className="h-2 rounded-full bg-white/10 overflow-hidden flex">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all"
                  style={{ width: `${Math.round(musicAnalysis.overallMelodyScore * 100)}%` }}
                />
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all"
                  style={{ width: `${Math.round((1 - musicAnalysis.overallMelodyScore) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-white/40">
                <span>Melody {Math.round(musicAnalysis.overallMelodyScore * 100)}%</span>
                <span>Rhythm {Math.round((1 - musicAnalysis.overallMelodyScore) * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Interactive Music Map Canvas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-white/80">Interactive Music Map</span>
              <span className="text-[10px] text-white/40">Click waveform to seek</span>
            </div>

            <div className="relative border border-white/15 rounded-xl overflow-hidden bg-[#06080F]">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="w-full h-24 cursor-pointer block"
              />

              {/* Legend overlay */}
              <div className="absolute top-1 right-2 flex items-center gap-2 text-[9px] bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none">
                <span className="flex items-center gap-1 text-purple-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Melody
                </span>
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Climax
                </span>
                <span className="flex items-center gap-1 text-yellow-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  Beats
                </span>
              </div>
            </div>

            {/* Manual Beat Marker controls */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleAddMarker}
                className="text-[11px] flex items-center gap-1 text-pink-300 hover:text-pink-200 transition-colors"
              >
                <PlusCircle className="w-3 h-3" />
                Add Marker at {playheadSec.toFixed(1)}s
              </button>

              {customMarkers.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearMarkers}
                  className="text-[11px] flex items-center gap-1 text-white/40 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear ({customMarkers.length})
                </button>
              )}
            </div>
          </div>

          {/* Detected Sections List */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-white/80 block">Detected Sections</span>
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {musicAnalysis.sections.map((section, idx) => {
                const isCurrent =
                  playheadSec >= section.startSec && playheadSec <= section.endSec
                return (
                  <div
                    key={section.id || idx}
                    onClick={() => onSeek(section.startSec)}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer border transition-all ${
                      isCurrent
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-200'
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] text-white/70'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          section.type === 'climax'
                            ? 'bg-rose-500'
                            : section.type === 'melody'
                            ? 'bg-purple-400'
                            : section.type === 'buildup'
                            ? 'bg-amber-400'
                            : 'bg-cyan-400'
                        }`}
                      />
                      <span className="font-medium capitalize">{section.name}</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[10px] text-white/50">
                      <span>
                        {formatSec(section.startSec)} - {formatSec(section.endSec)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ONE-CLICK AUTO CREATE CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenAutoEditModal}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Create Video Automatically</span>
            </button>
            <p className="text-[10px] text-center text-white/40 mt-1.5">
              Syncs photos with detected melody, beats & climax curves
            </p>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center space-y-2">
          <Activity className="w-8 h-8 text-cyan-400/30 mx-auto stroke-[1.5]" />
          <p className="text-xs text-white/60">No music analysis performed yet</p>
          <p className="text-[11px] text-white/40">
            Select an imported audio track above and click Analyze Music to generate beat markers,
            melody profiles, and emotional climax sections.
          </p>
        </div>
      )}
    </div>
  )
}
