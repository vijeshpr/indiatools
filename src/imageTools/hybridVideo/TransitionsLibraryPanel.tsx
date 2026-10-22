import React, { useState, useEffect, useRef } from 'react'
import {
  ArrowLeftRight,
  Clock,
  Sparkles,
  Zap,
  Layers,
  Wand2,
  Film,
  Flame,
  CheckCircle2,
} from 'lucide-react'
import type {
  ClipTransition,
  TransitionType,
  TransitionSyncMode,
} from '../../lib/hybridVideo/types.ts'
import {
  TRANSITION_LIBRARY,
  type TransitionCategory,
  computeClipTransition,
} from '../../lib/hybridVideo/transitionsEngine.ts'
import type { MusicAnalysisResult } from '../../lib/hybridVideo/musicIntelligence.ts'

interface TransitionsLibraryPanelProps {
  onApplyTransition: (transition: ClipTransition, target: 'in' | 'out' | 'both') => void
  onApplyToAllCuts?: (transition: ClipTransition, target: 'in' | 'out' | 'both') => void
  hasSelectedClip: boolean
  musicAnalysis?: MusicAnalysisResult | null
}

export const TransitionsLibraryPanel: React.FC<TransitionsLibraryPanelProps> = ({
  onApplyTransition,
  onApplyToAllCuts,
  hasSelectedClip,
  musicAnalysis,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | TransitionCategory>('all')
  const [selectedType, setSelectedType] = useState<TransitionType>('crossfade')
  const [durationSec, setDurationSec] = useState(0.5)
  const [syncMode, setSyncMode] = useState<TransitionSyncMode>('manual')

  // Animated preview canvas ref
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null)

  // Filtered transitions list
  const filteredTransitions = React.useMemo(() => {
    if (selectedCategory === 'all') return TRANSITION_LIBRARY
    return TRANSITION_LIBRARY.filter((t) => t.category === selectedCategory)
  }, [selectedCategory])

  // When syncMode changes, adjust durationSec to match musical interval
  useEffect(() => {
    if (syncMode === 'manual' || !musicAnalysis) return
    const bpm = musicAnalysis.bpm > 40 && musicAnalysis.bpm < 240 ? musicAnalysis.bpm : 120
    const beatInterval = 60 / bpm

    if (syncMode === 'on-beat') {
      setDurationSec(Number(beatInterval.toFixed(2)))
    } else if (syncMode === 'beat-to-beat') {
      setDurationSec(Number((beatInterval * 2).toFixed(2)))
    } else if (syncMode === 'phrase-boundary') {
      setDurationSec(Number((beatInterval * 4).toFixed(2)))
    }
  }, [syncMode, musicAnalysis])

  // Live animated preview loop for selected transition
  useEffect(() => {
    const canvas = previewCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const startTime = performance.now()
    const cycleDurationMs = (durationSec + 1.2) * 1000

    const render = (now: number) => {
      const elapsedMs = (now - startTime) % cycleDurationMs
      const elapsedSec = elapsedMs / 1000

      const w = canvas.width
      const h = canvas.height

      // Background A (Gradient A)
      ctx.save()
      const gradA = ctx.createLinearGradient(0, 0, w, h)
      gradA.addColorStop(0, '#1e293b')
      gradA.addColorStop(1, '#0f172a')
      ctx.fillStyle = gradA
      ctx.fillRect(0, 0, w, h)

      // Foreground B (Transition incoming layer)
      if (elapsedSec < durationSec) {
        const transState = computeClipTransition(
          { type: selectedType, durationSec, syncMode },
          { type: 'none', durationSec: 0 },
          elapsedSec,
          durationSec * 2,
          w,
          h
        )

        ctx.save()
        ctx.globalAlpha = transState.opacityMultiplier
        ctx.translate(w / 2 + transState.offsetX, h / 2 + transState.offsetY)
        if (transState.scaleMultiplier !== 1) ctx.scale(transState.scaleMultiplier, transState.scaleMultiplier)
        if (transState.rotationDeg !== 0) ctx.rotate((transState.rotationDeg * Math.PI) / 180)

        // Draw Layer B
        const gradB = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2)
        gradB.addColorStop(0, '#06b6d4')
        gradB.addColorStop(1, '#3b82f6')
        ctx.fillStyle = gradB
        ctx.fillRect(-w / 2, -h / 2, w, h)

        // Draw center label
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 12px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('NEXT CLIP', 0, 0)

        ctx.restore()

        // Flash overlay if applicable
        if (transState.flashAlpha > 0.05) {
          ctx.fillStyle = `${transState.flashColor || '#ffffff'}`
          ctx.globalAlpha = transState.flashAlpha
          ctx.fillRect(0, 0, w, h)
        }
      } else {
        // Holding layer B
        const gradB = ctx.createLinearGradient(0, 0, w, h)
        gradB.addColorStop(0, '#06b6d4')
        gradB.addColorStop(1, '#3b82f6')
        ctx.fillStyle = gradB
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 12px Inter, sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('NEXT CLIP', w / 2, h / 2)
      }

      ctx.restore()
      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animId)
  }, [selectedType, durationSec, syncMode])

  const handleApply = (target: 'in' | 'out' | 'both') => {
    onApplyTransition({ type: selectedType, durationSec, syncMode }, target)
  }

  const handleApplyAll = (target: 'in' | 'out' | 'both') => {
    if (onApplyToAllCuts) {
      onApplyToAllCuts({ type: selectedType, durationSec, syncMode }, target)
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#0D111A] text-white">
      {/* Header */}
      <div className="p-3 border-b border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-semibold text-white/90">Cinematic Transitions</h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded">
            29 Styles
          </span>
        </div>

        {/* Live Animated Thumbnail Box */}
        <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/40 h-28 flex items-center justify-center">
          <canvas
            ref={previewCanvasRef}
            width={240}
            height={112}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur text-[9px] font-medium text-cyan-300 border border-white/10">
            Preview: {TRANSITION_LIBRARY.find((t) => t.id === selectedType)?.name}
          </div>
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur text-[9px] font-mono text-white/70 border border-white/10">
            {durationSec.toFixed(2)}s
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 text-[10px] overflow-x-auto py-1">
          {[
            { id: 'all', label: 'All (29)' },
            { id: 'clean', label: 'Clean' },
            { id: 'cinematic', label: 'Cinematic' },
            { id: 'dynamic', label: 'Dynamic' },
            { id: 'stylized', label: 'Stylized' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-2 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-white/[0.02] text-white/50 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {!hasSelectedClip && (
        <div className="px-3 py-1.5 bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-[10px] flex items-center justify-between">
          <span>Select a timeline clip to apply directly, or use "Apply to All Cuts".</span>
        </div>
      )}

      {/* Main Controls & List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Timing & Beat-Sync Controls */}
        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs text-white/80">
            <span className="flex items-center gap-1 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Duration
            </span>
            <span className="font-mono text-cyan-300 text-xs">{durationSec.toFixed(2)}s</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={2.0}
            step={0.05}
            value={durationSec}
            onChange={(e) => {
              setDurationSec(Number(e.target.value))
              setSyncMode('manual')
            }}
            className="w-full accent-cyan-400 h-1 bg-white/10 rounded cursor-pointer"
          />

          {/* Music Synchronization Alignment */}
          <div className="pt-1.5 border-t border-white/5">
            <span className="text-[10px] text-white/50 block mb-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Music Beat Alignment
            </span>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              {[
                { id: 'manual', label: 'Manual' },
                { id: 'on-beat', label: '1 Beat' },
                { id: 'beat-to-beat', label: '2 Beats' },
                { id: 'phrase-boundary', label: 'Phrase Bar' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSyncMode(mode.id as TransitionSyncMode)}
                  className={`py-1 px-1.5 rounded text-center font-medium transition-colors ${
                    syncMode === mode.id
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-white/[0.02] text-white/60 hover:text-white'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transition Style Cards Grid */}
        <div className="grid grid-cols-1 gap-1.5">
          {filteredTransitions.map((item) => {
            const isSelected = selectedType === item.id
            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedType(item.id)
                  if (item.defaultDurationSec > 0 && syncMode === 'manual') {
                    setDurationSec(item.defaultDurationSec)
                  }
                }}
                className={`p-2 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200'
                    : 'bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/90">{item.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] uppercase px-1 py-0.5 rounded bg-white/5 text-white/40">
                      {item.category}
                    </span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                </div>
                <p className="text-[10px] text-white/40 mt-0.5 leading-tight">{item.description}</p>
              </div>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-white/10 space-y-1.5">
          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              disabled={!hasSelectedClip}
              onClick={() => handleApply('in')}
              className="py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 disabled:opacity-30 disabled:pointer-events-none text-cyan-300 text-[10px] font-semibold transition-colors"
            >
              Apply In
            </button>
            <button
              type="button"
              disabled={!hasSelectedClip}
              onClick={() => handleApply('out')}
              className="py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-white/80 text-[10px] font-medium transition-colors"
            >
              Apply Out
            </button>
            <button
              type="button"
              disabled={!hasSelectedClip}
              onClick={() => handleApply('both')}
              className="py-1.5 rounded-lg bg-cyan-500/30 hover:bg-cyan-500/40 disabled:opacity-30 disabled:pointer-events-none text-cyan-200 text-[10px] font-bold transition-colors"
            >
              Both (In+Out)
            </button>
          </div>

          {/* Batch Apply Across Entire Timeline */}
          {onApplyToAllCuts && (
            <button
              type="button"
              onClick={() => handleApplyAll('both')}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/40 hover:to-blue-600/40 border border-cyan-500/30 text-cyan-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
              Apply to All Eligible Cuts
            </button>
          )}

          {/* Remove Transition */}
          <button
            type="button"
            disabled={!hasSelectedClip}
            onClick={() => onApplyTransition({ type: 'none', durationSec: 0 }, 'both')}
            className="w-full py-1 rounded bg-white/[0.02] hover:bg-white/[0.05] disabled:opacity-30 disabled:pointer-events-none text-white/40 hover:text-white/70 text-[10px] transition-colors"
          >
            Remove Transitions from Selected Clip
          </button>
        </div>
      </div>
    </div>
  )
}
