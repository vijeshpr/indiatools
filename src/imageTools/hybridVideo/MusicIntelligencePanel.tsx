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
  Radio,
  Eye,
  EyeOff,
  Compass,
} from 'lucide-react'
import type { MediaAsset } from '../../lib/hybridVideo/types.ts'
import {
  analyzeAudioBuffer,
  type MusicAnalysisResult,
  type MusicSection,
  type MelodyProfileType,
  type MusicEvent,
} from '../../lib/hybridVideo/musicIntelligence.ts'
import type {
  SyncMode,
  CutIntensity,
  BeatSensitivity,
  TransitionAmount,
  VisualMotion,
  SyncStrength,
  AutoEditGeneratorOptions,
} from '../../lib/hybridVideo/autoEditGenerator.ts'

interface MusicIntelligencePanelProps {
  mediaAssets: MediaAsset[]
  musicAnalysis: MusicAnalysisResult | null
  onAnalysisComplete: (result: MusicAnalysisResult) => void
  playheadSec: number
  onSeek: (sec: number) => void
  onOpenAutoEditModal: () => void
  onAddManualBeatMarker?: (sec: number) => void
  onRegenerateAutoEditWithSync?: (options: AutoEditGeneratorOptions) => void
  showMusicMarkers: boolean
  onToggleMusicMarkers: () => void
  lastSummary?: string | null
}

export const MusicIntelligencePanel: React.FC<MusicIntelligencePanelProps> = ({
  mediaAssets,
  musicAnalysis,
  onAnalysisComplete,
  playheadSec,
  onSeek,
  onOpenAutoEditModal,
  onAddManualBeatMarker,
  onRegenerateAutoEditWithSync,
  showMusicMarkers,
  onToggleMusicMarkers,
  lastSummary,
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  // Music Sync Controls
  const [syncMode, setSyncMode] = useState<SyncMode>('balanced')
  const [cutIntensity, setCutIntensity] = useState<CutIntensity>('balanced')
  const [beatSensitivity, setBeatSensitivity] = useState<BeatSensitivity>('medium')
  const [transitionAmount, setTransitionAmount] = useState<TransitionAmount>('balanced')
  const [visualMotion, setVisualMotion] = useState<VisualMotion>('subtle')
  const [syncStrength, setSyncStrength] = useState<SyncStrength>('strong')
  const [usePhraseBoundaries, setUsePhraseBoundaries] = useState<boolean>(true)

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
      setAnalysisError('Please select an audio track to analyze.')
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

      const sensitivityMultiplier =
        beatSensitivity === 'low' ? 0.75 : beatSensitivity === 'high' ? 1.4 : 1.0

      const result = await analyzeAudioBuffer(
        audioBuffer,
        selectedAsset.id,
        selectedAsset.name,
        sensitivityMultiplier
      )

      onAnalysisComplete(result)
      await ctx.close()
    } catch (err) {
      setAnalysisError(`Music analysis failed: ${(err as Error).message}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleTriggerRegenerate = () => {
    if (onRegenerateAutoEditWithSync) {
      onRegenerateAutoEditWithSync({
        syncMode,
        cutIntensity,
        transitionAmount,
        visualMotion,
        syncStrength,
        usePhraseBoundaries,
      })
    } else {
      onOpenAutoEditModal()
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

      for (let i = 0; i < envelope.length; i++) {
        const val = envelope[i]
        const barH = Math.max(val * (h * 0.75), 2)
        const x = i * step
        const y = (h - barH) / 2

        const timeAtSample = (i / envelope.length) * duration
        const isClimax =
          timeAtSample >= musicAnalysis.climaxStartSec && timeAtSample <= musicAnalysis.climaxEndSec

        ctx.fillStyle = isClimax
          ? `rgba(244, 63, 94, ${0.4 + val * 0.6})`
          : `rgba(6, 182, 212, ${0.25 + val * 0.7})`

        ctx.fillRect(x, y, Math.max(step * 0.85, 1.5), barH)
      }
    }

    // Draw Phrase Boundary markers
    if (musicAnalysis.phraseBoundaries) {
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.75)'
      ctx.lineWidth = 1.5
      for (const p of musicAnalysis.phraseBoundaries) {
        const px = (p / duration) * w
        ctx.beginPath()
        ctx.moveTo(px, 0)
        ctx.lineTo(px, h)
        ctx.stroke()
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

    // Draw Current Playhead Position
    const playheadX = (Math.min(playheadSec, duration) / duration) * w
    ctx.strokeStyle = '#22d3ee'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(playheadX, 0)
    ctx.lineTo(playheadX, h)
    ctx.stroke()

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

  const formatSec = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = (s % 60).toFixed(1)
    return `${m}:${parseFloat(sec) < 10 ? '0' : ''}${sec}`
  }

  const getProfileLabel = (p: MelodyProfileType) => {
    switch (p) {
      case 'soft-melody':
        return 'Soft Melody'
      case 'vocal-like':
        return 'Vocal / Mid-Band Line'
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
        return 'Mixed Passages'
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#0D111A] text-white overflow-y-auto p-3 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-wide text-white uppercase">
              Music Sync Studio
            </h3>
            <p className="text-[10px] text-white/50">100% Client-Side Signal Analysis</p>
          </div>
        </div>

        {/* Toggle Beat Markers on Timeline */}
        <button
          type="button"
          onClick={onToggleMusicMarkers}
          title={showMusicMarkers ? 'Hide markers on timeline' : 'Show markers on timeline'}
          className={`p-1.5 rounded-lg border text-[10px] flex items-center gap-1 transition-colors ${
            showMusicMarkers
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
              : 'bg-white/5 text-white/40 border-white/10 hover:text-white'
          }`}
        >
          {showMusicMarkers ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">Timeline Markers</span>
        </button>
      </div>

      {/* Track Selector & Analysis Action */}
      <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5">
        <label className="text-[11px] font-medium text-white/70 block">Select Audio Track</label>

        {audioAssets.length === 0 ? (
          <div className="p-3 rounded-lg bg-white/[0.02] border border-dashed border-white/15 text-center text-xs text-white/40">
            No audio tracks in library. Import an MP3 or WAV file in the Media panel first.
          </div>
        ) : (
          <select
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            {audioAssets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name} ({formatSec(asset.durationSec)})
              </option>
            ))}
          </select>
        )}

        <div className="flex items-center gap-2">
          {/* Beat Sensitivity Selector */}
          <div className="flex-1 flex items-center gap-1 bg-black/30 border border-white/10 rounded-lg p-1 text-[10px]">
            <span className="text-white/50 px-1">Sens:</span>
            {(['low', 'medium', 'high'] as BeatSensitivity[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setBeatSensitivity(s)}
                className={`flex-1 py-0.5 rounded capitalize transition-colors ${
                  beatSensitivity === s
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={!selectedAsset || isAnalyzing}
            onClick={handleAnalyze}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isAnalyzing
                ? 'bg-cyan-500/30 text-cyan-200 cursor-wait'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-md shadow-cyan-500/20 active:scale-95'
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
        <div className="space-y-3.5">
          {/* Overview Metrics Badges */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center justify-between text-[10px] text-white/50 mb-0.5">
                <span>Estimated Tempo</span>
                <span className="text-[9px] px-1 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                  {Math.round(musicAnalysis.bpmConfidence * 100)}% conf
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-white font-mono">{musicAnalysis.bpm}</span>
                <span className="text-[9px] text-white/40">BPM</span>
              </div>
              <div className="text-[9px] text-cyan-400 mt-0.5">
                {musicAnalysis.beats.length} beats • {musicAnalysis.downbeats?.length || 0} bars
              </div>
            </div>

            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="text-[10px] text-white/50 mb-0.5">Vocal / Melody Activity</div>
              <div className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <span className="text-xs font-bold text-white capitalize">
                  {musicAnalysis.dominantMood}
                </span>
              </div>
              <div className="text-[9px] text-purple-300 mt-0.5">
                {Math.round((musicAnalysis.vocalActivityConfidence || 0.6) * 100)}% mid-band confidence
              </div>
            </div>
          </div>

          {/* Interactive Music Map Waveform Canvas */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-medium text-white/80">Interactive Music Map</span>
              <span className="text-[9px] text-white/40">Click to seek playhead</span>
            </div>

            <div className="relative border border-white/15 rounded-xl overflow-hidden bg-[#06080F]">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="w-full h-20 cursor-pointer block"
              />

              <div className="absolute top-1 right-1 flex items-center gap-2 text-[8px] bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm pointer-events-none">
                <span className="flex items-center gap-1 text-purple-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Phrase
                </span>
                <span className="flex items-center gap-1 text-yellow-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  Beats
                </span>
                <span className="flex items-center gap-1 text-rose-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Climax
                </span>
              </div>
            </div>
          </div>

          {/* MUSIC SYNC CONTROL PANEL CONTROLS */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-1.5 pb-1 border-b border-white/5">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs font-bold text-white">Music Sync Controls</span>
            </div>

            {/* Sync Mode */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-white/60 uppercase">Sync Mode</label>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { id: 'beat-sync', label: 'Beat Sync', desc: 'Rhythmic Cuts' },
                  { id: 'melody-vocal', label: 'Melody & Vocal', desc: 'Phrase Holds' },
                  { id: 'balanced', label: 'Balanced', desc: 'Hybrid Flow' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSyncMode(m.id as SyncMode)}
                    className={`p-1.5 rounded-lg border text-left transition-all ${
                      syncMode === m.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-black/30 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    <div className="text-[10px] font-bold">{m.label}</div>
                    <div className="text-[8px] text-white/40">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cut Intensity & Sync Strength */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-white/60 uppercase">
                  Cut Intensity
                </label>
                <div className="flex gap-1">
                  {(['slow', 'balanced', 'fast'] as CutIntensity[]).map((ci) => (
                    <button
                      key={ci}
                      type="button"
                      onClick={() => setCutIntensity(ci)}
                      className={`flex-1 py-1 rounded text-[10px] capitalize transition-colors ${
                        cutIntensity === ci
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                          : 'bg-black/30 text-white/50 border border-white/5 hover:text-white'
                      }`}
                    >
                      {ci}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-white/60 uppercase">
                  Sync Strength
                </label>
                <div className="flex gap-1">
                  {(['gentle', 'strong'] as SyncStrength[]).map((ss) => (
                    <button
                      key={ss}
                      type="button"
                      onClick={() => setSyncStrength(ss)}
                      className={`flex-1 py-1 rounded text-[10px] capitalize transition-colors ${
                        syncStrength === ss
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                          : 'bg-black/30 text-white/50 border border-white/5 hover:text-white'
                      }`}
                    >
                      {ss}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Transitions & Motion */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-white/60 uppercase">
                  Transition
                </label>
                <div className="flex gap-1">
                  {(['minimal', 'balanced', 'cinematic'] as TransitionAmount[]).map((ta) => (
                    <button
                      key={ta}
                      type="button"
                      onClick={() => setTransitionAmount(ta)}
                      className={`flex-1 py-1 rounded text-[9px] capitalize transition-colors ${
                        transitionAmount === ta
                          ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                          : 'bg-black/30 text-white/50 border border-white/5 hover:text-white'
                      }`}
                    >
                      {ta}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-white/60 uppercase">
                  Visual Motion
                </label>
                <div className="flex gap-1">
                  {(['off', 'subtle', 'dynamic'] as VisualMotion[]).map((vm) => (
                    <button
                      key={vm}
                      type="button"
                      onClick={() => setVisualMotion(vm)}
                      className={`flex-1 py-1 rounded text-[9px] capitalize transition-colors ${
                        visualMotion === vm
                          ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                          : 'bg-black/30 text-white/50 border border-white/5 hover:text-white'
                      }`}
                    >
                      {vm}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Phrase boundaries toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-[11px] text-white/70 pt-1">
              <input
                type="checkbox"
                checked={usePhraseBoundaries}
                onChange={(e) => setUsePhraseBoundaries(e.target.checked)}
                className="rounded bg-black/40 border-white/20 text-cyan-500 focus:ring-0"
              />
              <span>Use Detected Phrase Boundaries (for natural musical transitions)</span>
            </label>

            {/* Reanalyze & Regenerate Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Reanalyze Music</span>
              </button>

              <button
                type="button"
                onClick={handleTriggerRegenerate}
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Regenerate Auto Edit</span>
              </button>
            </div>
          </div>

          {/* Dynamic Generated Edit Summary (if available) */}
          {lastSummary && (
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/25 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Active Music-Sync Timeline Summary</span>
              </div>
              <p className="text-[11px] text-white/80 leading-relaxed font-mono">{lastSummary}</p>
            </div>
          )}

          {/* Clickable Detected Events List */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-white/80">Analyzed Musical Events</span>
              <span className="text-[9px] text-white/40">Click any event to seek</span>
            </div>

            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {musicAnalysis.events && musicAnalysis.events.length > 0 ? (
                musicAnalysis.events.slice(0, 40).map((evt) => {
                  const isClose = Math.abs(playheadSec - evt.timeSec) < 0.25
                  return (
                    <div
                      key={evt.id}
                      onClick={() => onSeek(evt.timeSec)}
                      className={`flex items-center justify-between p-1.5 rounded-lg text-[10px] cursor-pointer border transition-all ${
                        isClose
                          ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200'
                          : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] text-white/70'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            evt.type === 'climax_onset'
                              ? 'bg-rose-500'
                              : evt.type === 'phrase_boundary'
                              ? 'bg-purple-400'
                              : evt.type === 'downbeat'
                              ? 'bg-amber-400'
                              : 'bg-cyan-400'
                          }`}
                        />
                        <span className="truncate">{evt.description}</span>
                      </div>
                      <span className="font-mono text-white/50 shrink-0 ml-1">
                        {formatSec(evt.timeSec)}
                      </span>
                    </div>
                  )
                })
              ) : (
                <div className="text-[10px] text-white/40 p-2 text-center">
                  Events will appear here after analysis
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center space-y-2">
          <Activity className="w-8 h-8 text-cyan-400/30 mx-auto stroke-[1.5]" />
          <p className="text-xs text-white/60">No music analysis performed yet</p>
          <p className="text-[11px] text-white/40">
            Select an audio track above and click Analyze Music to generate beat markers, phrase
            boundaries, and synchronized cuts.
          </p>
        </div>
      )}
    </div>
  )
}
