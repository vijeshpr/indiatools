import React from 'react'
import {
  RotateCcw,
  Sparkles,
  Zap,
  TrendingDown,
  TrendingUp,
  Film,
  Heart,
  Flame,
  Undo2,
  X,
} from 'lucide-react'

interface RegenerationToolbarProps {
  lastSummary: string
  onRegenerate: () => void
  onSlowerCuts: () => void
  onFasterCuts: () => void
  onMoreCinematic: () => void
  onSyncToBeats: () => void
  onKeepMelodyCalm: () => void
  onIncreaseClimax: () => void
  onRestorePrevious: () => void
  onDismiss: () => void
}

export const RegenerationToolbar: React.FC<RegenerationToolbarProps> = ({
  lastSummary,
  onRegenerate,
  onSlowerCuts,
  onFasterCuts,
  onMoreCinematic,
  onSyncToBeats,
  onKeepMelodyCalm,
  onIncreaseClimax,
  onRestorePrevious,
  onDismiss,
}) => {
  return (
    <div className="bg-[#0B101D] border-t border-b border-cyan-500/20 px-3 py-2 flex flex-wrap items-center justify-between gap-2 shadow-md">
      {/* Left: Summary Badge */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] text-purple-300 font-semibold">
          <Sparkles className="w-3 h-3 text-yellow-300" />
          Auto-Edit Active
        </span>
        <span className="text-xs text-white/80 hidden sm:inline truncate max-w-xs md:max-w-md">
          {lastSummary}
        </span>
      </div>

      {/* Center / Right: Quick Adjustment Pills */}
      <div className="flex items-center flex-wrap gap-1 text-[11px]">
        <button
          type="button"
          onClick={onRegenerate}
          title="Shuffle and re-distribute photos across music sections"
          className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 flex items-center gap-1 transition-all"
        >
          <RotateCcw className="w-3 h-3 text-cyan-400" />
          <span>Regenerate</span>
        </button>

        <button
          type="button"
          onClick={onSlowerCuts}
          title="Lengthen shot durations across the timeline"
          className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 flex items-center gap-1 transition-all"
        >
          <TrendingDown className="w-3 h-3 text-emerald-400" />
          <span>Slower Cuts</span>
        </button>

        <button
          type="button"
          onClick={onFasterCuts}
          title="Accelerate cuts across the timeline"
          className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 flex items-center gap-1 transition-all"
        >
          <TrendingUp className="w-3 h-3 text-amber-400" />
          <span>Faster Cuts</span>
        </button>

        <button
          type="button"
          onClick={onMoreCinematic}
          title="Lengthen crossfades and enable subtle zoom drifts"
          className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 flex items-center gap-1 transition-all"
        >
          <Film className="w-3 h-3 text-indigo-400" />
          <span>More Cinematic</span>
        </button>

        <button
          type="button"
          onClick={onSyncToBeats}
          title="Align cuts strictly to detected musical beats"
          className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 flex items-center gap-1 transition-all"
        >
          <Zap className="w-3 h-3 text-yellow-400" />
          <span>Sync to Beats</span>
        </button>

        <button
          type="button"
          onClick={onKeepMelodyCalm}
          title="Hold frames longer during melodic passages"
          className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 flex items-center gap-1 transition-all"
        >
          <Heart className="w-3 h-3 text-pink-400" />
          <span>Melody Calm</span>
        </button>

        <button
          type="button"
          onClick={onIncreaseClimax}
          title="Make cuts faster during climax section"
          className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 flex items-center gap-1 transition-all"
        >
          <Flame className="w-3 h-3 text-rose-400" />
          <span>Climax Burst</span>
        </button>

        {/* Restore Previous State */}
        <button
          type="button"
          onClick={onRestorePrevious}
          title="Undo auto-generation and restore previous project state"
          className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 flex items-center gap-1 transition-all"
        >
          <Undo2 className="w-3 h-3" />
          <span>Restore Previous</span>
        </button>

        {/* Dismiss toolbar */}
        <button
          type="button"
          onClick={onDismiss}
          title="Dismiss toolbar"
          className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors ml-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
