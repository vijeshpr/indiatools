import React from 'react'
import { ArrowLeftRight, Clock, Sparkles } from 'lucide-react'
import type { ClipTransition, TransitionType } from '../../lib/hybridVideo/types.ts'

interface TransitionsLibraryPanelProps {
  onApplyTransition: (transition: ClipTransition, target: 'in' | 'out' | 'both') => void
  hasSelectedClip: boolean
}

export const TransitionsLibraryPanel: React.FC<TransitionsLibraryPanelProps> = ({
  onApplyTransition,
  hasSelectedClip,
}) => {
  const [selectedType, setSelectedType] = React.useState<TransitionType>('crossfade')
  const [durationSec, setDurationSec] = React.useState(0.5)

  const TRANSITIONS: { id: TransitionType; name: string; desc: string }[] = [
    { id: 'none', name: 'Instant Cut', desc: 'Direct immediate cut without transition' },
    { id: 'crossfade', name: 'Smooth Crossfade', desc: 'Gentle dissolve between layers' },
    { id: 'fade-black', name: 'Fade to Black', desc: 'Cinematic dramatic blackout' },
    { id: 'fade-white', name: 'Flash to White', desc: 'High-energy burst exposure flash' },
    { id: 'scale-punch', name: 'Scale Punch Zoom', desc: 'Dynamic scale bounce entrance' },
    { id: 'whip-pan-left', name: 'Whip Pan (Left)', desc: 'Fast motion blur lateral pan' },
    { id: 'whip-pan-right', name: 'Whip Pan (Right)', desc: 'Fast motion blur lateral pan' },
    { id: 'fade-wipe-left', name: 'Directional Wipe', desc: 'Linear directional edge wipe' },
    { id: 'glitch-split', name: 'Glitch Split', desc: 'Digital RGB displacement twitch' },
  ]

  const handleApply = (target: 'in' | 'out' | 'both') => {
    onApplyTransition({ type: selectedType, durationSec }, target)
  }

  return (
    <div className="flex flex-col h-full bg-[#0D111A] text-white">
      <div className="p-3 border-b border-white/10">
        <h3 className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
          <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
          Cinematic Transitions
        </h3>
        <p className="text-[11px] text-white/40 mt-0.5">
          Select a transition style and apply it to clip entrance or exit
        </p>
      </div>

      {!hasSelectedClip && (
        <div className="px-3 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-[11px]">
          Select a clip on the timeline to apply transitions.
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Duration Slider */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-white/80">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Transition Duration
            </span>
            <span className="font-mono text-cyan-300">{durationSec.toFixed(2)}s</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={2.0}
            step={0.05}
            value={durationSec}
            onChange={(e) => setDurationSec(Number(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
          />
        </div>

        {/* Transition List */}
        <div className="space-y-1.5">
          {TRANSITIONS.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedType(item.id)}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                selectedType === item.id
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200'
                  : 'bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.05]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white/90">{item.name}</span>
                {selectedType === item.id && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                    Active
                  </span>
                )}
              </div>
              <p className="text-[10px] text-white/40 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Apply Action Buttons */}
        <div className="pt-2 border-t border-white/5 space-y-2">
          <button
            type="button"
            disabled={!hasSelectedClip}
            onClick={() => handleApply('in')}
            className="w-full py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 disabled:opacity-30 disabled:pointer-events-none text-cyan-300 text-xs font-semibold transition-colors"
          >
            Apply to Clip Entrance (In)
          </button>
          <button
            type="button"
            disabled={!hasSelectedClip}
            onClick={() => handleApply('out')}
            className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-white/80 text-xs font-medium transition-colors"
          >
            Apply to Clip Exit (Out)
          </button>
        </div>
      </div>
    </div>
  )
}
