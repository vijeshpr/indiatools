import React, { useState, useEffect } from 'react'
import {
  X,
  Sparkles,
  Heart,
  Film,
  Zap,
  Rewind,
  Flame,
  Compass,
  Square,
  Sliders,
  Check,
  AlertCircle,
  Music,
} from 'lucide-react'
import type { MediaAsset, HybridVideoProject } from '../../lib/hybridVideo/types.ts'
import {
  AUTO_EDIT_STYLES,
  recommendStyleForMusic,
  generateAutoEditTimeline,
  type AutoEditStyle,
  type AutoEditGeneratorOptions,
} from '../../lib/hybridVideo/autoEditGenerator.ts'
import type { MusicAnalysisResult } from '../../lib/hybridVideo/musicIntelligence.ts'

interface AutoEditModalProps {
  isOpen: boolean
  onClose: () => void
  project: HybridVideoProject
  mediaAssets: MediaAsset[]
  musicAnalysis: MusicAnalysisResult | null
  onApplyAutoEdit: (
    updatedProject: HybridVideoProject,
    summary: string,
    usedOptions: AutoEditGeneratorOptions
  ) => void
}

const STYLE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Heart,
  Film,
  Zap,
  Rewind,
  Flame,
  Compass,
  Square,
  Sliders,
}

export const AutoEditModal: React.FC<AutoEditModalProps> = ({
  isOpen,
  onClose,
  project,
  mediaAssets,
  musicAnalysis,
  onApplyAutoEdit,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<AutoEditStyle>('cinematic-story')
  const [order, setOrder] = useState<'original' | 'shuffle'>('original')
  const [mediaFilter, setMediaFilter] = useState<'all' | 'images-only' | 'videos-only'>('all')
  const [pacingOffset, setPacingOffset] = useState<number>(1.0)
  const [keepMelodyCalm, setKeepMelodyCalm] = useState<boolean>(true)
  const [endingHoldFrame, setEndingHoldFrame] = useState<boolean>(true)
  const [selectedMusicId, setSelectedMusicId] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const audioAssets = mediaAssets.filter((a) => a.type === 'audio' || a.type === 'video')
  const visualAssets = mediaAssets.filter((a) => {
    if (mediaFilter === 'images-only') return a.type === 'image'
    if (mediaFilter === 'videos-only') return a.type === 'video'
    return a.type === 'image' || a.type === 'video'
  })

  // Set default music asset and recommended style
  useEffect(() => {
    if (musicAnalysis) {
      setSelectedMusicId(musicAnalysis.assetId)
      const { recommendedStyle } = recommendStyleForMusic(musicAnalysis)
      setSelectedStyle(recommendedStyle)
    } else if (audioAssets.length > 0 && !selectedMusicId) {
      setSelectedMusicId(audioAssets[0].id)
    }
  }, [musicAnalysis, audioAssets, selectedMusicId])

  if (!isOpen) return null

  const recommendation = musicAnalysis ? recommendStyleForMusic(musicAnalysis) : null

  const handleGenerate = () => {
    setErrorMessage(null)

    const musicAsset = mediaAssets.find((a) => a.id === selectedMusicId)
    if (!musicAsset) {
      setErrorMessage('Please select a music track to synchronize with.')
      return
    }

    if (visualAssets.length === 0) {
      setErrorMessage('Please import photos or videos to construct the video timeline.')
      return
    }

    try {
      // Build dummy analysis if none performed yet
      const activeAnalysis: MusicAnalysisResult = musicAnalysis || {
        assetId: musicAsset.id,
        assetName: musicAsset.name,
        durationSec: musicAsset.durationSec || 30,
        bpm: 120,
        bpmConfidence: 0.5,
        beats: [],
        onsets: [],
        downbeats: [],
        phraseBoundaries: [],
        events: [],
        energyEnvelope: [],
        sections: [
          {
            id: 'sec-intro',
            name: 'Intro',
            startSec: 0,
            endSec: Math.min(6, musicAsset.durationSec * 0.2),
            type: 'intro',
            energyLevel: 0.4,
            isMelodyDominant: true,
            melodyProfile: 'soft-melody',
          },
          {
            id: 'sec-body',
            name: 'Main Flow',
            startSec: Math.min(6, musicAsset.durationSec * 0.2),
            endSec: musicAsset.durationSec * 0.8,
            type: 'melody',
            energyLevel: 0.6,
            isMelodyDominant: true,
            melodyProfile: 'sustained-instrumental',
          },
          {
            id: 'sec-climax',
            name: 'Climax & Finish',
            startSec: musicAsset.durationSec * 0.8,
            endSec: musicAsset.durationSec,
            type: 'climax',
            energyLevel: 0.85,
            isMelodyDominant: false,
            melodyProfile: 'beat-driven',
          },
        ],
        dominantMood: 'energetic',
        overallMelodyScore: 0.5,
        vocalActivityConfidence: 0.5,
        climaxStartSec: musicAsset.durationSec * 0.8,
        climaxEndSec: musicAsset.durationSec,
        suggestedCutPoints: [],
      }

      const options: AutoEditGeneratorOptions = {
        style: selectedStyle,
        assetOrder: order,
        mediaFilter,
        pacingOffsetMultiplier: pacingOffset,
        keepMelodyCalm,
        endingHoldFrame,
      }

      const result = generateAutoEditTimeline(
        project,
        musicAsset,
        activeAnalysis,
        mediaAssets,
        options
      )

      onApplyAutoEdit(result.updatedProject, result.summary, options)
      onClose()
    } catch (err) {
      setErrorMessage((err as Error).message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0E131F] border border-white/15 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#121826]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-wide text-white">
                Create Video Automatically
              </h2>
              <p className="text-xs text-white/50">
                AI-styled music intelligence pacing with 100% browser-side privacy
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Recommendation Banner */}
          {recommendation && (
            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-purple-300">
                    Recommended Style: {AUTO_EDIT_STYLES[recommendation.recommendedStyle].name}
                  </span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded-full font-medium">
                    Analysis Match
                  </span>
                </div>
                <p className="text-white/60 mt-1">{recommendation.reason}</p>
              </div>
            </div>
          )}

          {/* Music Track Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/80 flex items-center gap-2">
              <Music className="w-4 h-4 text-cyan-400" />
              <span>Target Music Track</span>
            </label>
            <select
              value={selectedMusicId}
              onChange={(e) => setSelectedMusicId(e.target.value)}
              className="w-full bg-[#182030] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              {audioAssets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.name} ({Math.round(asset.durationSec)}s)
                </option>
              ))}
            </select>
          </div>

          {/* Style Selector Grid */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-white/80 block">
              Choose Editing Style (8 Cinematic Archetypes)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {(Object.keys(AUTO_EDIT_STYLES) as AutoEditStyle[]).map((styleKey) => {
                const styleDef = AUTO_EDIT_STYLES[styleKey]
                const Icon = STYLE_ICONS[styleDef.iconName] || Film
                const isSelected = selectedStyle === styleKey
                const isRecommended = recommendation?.recommendedStyle === styleKey

                return (
                  <div
                    key={styleKey}
                    onClick={() => setSelectedStyle(styleKey)}
                    className={`relative p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/10 scale-[1.02]'
                        : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20 text-white/80'
                    }`}
                  >
                    {isRecommended && (
                      <span className="absolute -top-2 -right-1 text-[9px] font-bold bg-purple-500 text-white px-1.5 py-0.5 rounded-full shadow-sm">
                        TOP PICK
                      </span>
                    )}

                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div
                          className={`p-1.5 rounded-lg ${
                            isSelected
                              ? 'bg-cyan-400 text-black'
                              : 'bg-white/10 text-cyan-400'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold">{styleDef.name}</span>
                      </div>
                      <p className="text-[10px] text-white/50 line-clamp-2 leading-relaxed">
                        {styleDef.description}
                      </p>
                    </div>

                    <div className="mt-2 text-[9px] font-mono text-cyan-300/80">
                      ~{styleDef.baseShotDurationSec}s base cut
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Configuration Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/10">
            {/* Filter & Order */}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/60 block mb-1">Visual Media Pool</label>
                <div className="flex gap-1.5">
                  {[
                    { id: 'all', label: `All (${visualAssets.length})` },
                    { id: 'images-only', label: 'Photos Only' },
                    { id: 'videos-only', label: 'Videos Only' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setMediaFilter(f.id as any)}
                      className={`flex-1 py-1.5 text-xs rounded-lg border transition-all ${
                        mediaFilter === f.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-medium'
                          : 'bg-black/30 border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-white/60 block mb-1">Photo Sequence</label>
                <div className="flex gap-1.5">
                  {[
                    { id: 'original', label: 'Original Library Order' },
                    { id: 'shuffle', label: 'Shuffle Randomly' },
                  ].map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setOrder(o.id as any)}
                      className={`flex-1 py-1.5 text-xs rounded-lg border transition-all ${
                        order === o.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-medium'
                          : 'bg-black/30 border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pacing & Musical Nuance */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-white/60 mb-1">
                  <span>Pacing Speed Offset</span>
                  <span className="text-cyan-400 font-mono">
                    {pacingOffset < 1 ? 'Faster (0.8x)' : pacingOffset > 1 ? 'Slower (1.25x)' : 'Standard (1.0x)'}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {[
                    { val: 0.8, label: 'Faster' },
                    { val: 1.0, label: 'Standard' },
                    { val: 1.25, label: 'Slower' },
                  ].map((p) => (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() => setPacingOffset(p.val)}
                      className={`flex-1 py-1.5 text-xs rounded-lg border transition-all ${
                        pacingOffset === p.val
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-medium'
                          : 'bg-black/30 border-white/10 text-white/60 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                  <input
                    type="checkbox"
                    checked={keepMelodyCalm}
                    onChange={(e) => setKeepMelodyCalm(e.target.checked)}
                    className="rounded bg-black/40 border-white/20 text-cyan-500 focus:ring-0"
                  />
                  <span>Keep Melody Sections Calm (longer shot holds)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                  <input
                    type="checkbox"
                    checked={endingHoldFrame}
                    onChange={(e) => setEndingHoldFrame(e.target.checked)}
                    className="rounded bg-black/40 border-white/20 text-cyan-500 focus:ring-0"
                  />
                  <span>Emotional Ending Hold Frame (lingers on final photo)</span>
                </label>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-[#121826]">
          <span className="text-xs text-white/50">
            {visualAssets.length} visual asset{visualAssets.length === 1 ? '' : 's'} ready to distribute
          </span>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleGenerate}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Generate Video Edit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
