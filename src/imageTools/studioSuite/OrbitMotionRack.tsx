import React from 'react'
import { Radio, Power, Sliders, Repeat, Music, Shield, ShieldCheck } from 'lucide-react'
import { OrbitMotionConfig, LfoShape, BeatSubdivision } from '../../lib/audio/studioSuite/types'

interface OrbitMotionRackProps {
  config: OrbitMotionConfig
  onChange: (newConfig: OrbitMotionConfig) => void
}

export const OrbitMotionRack: React.FC<OrbitMotionRackProps> = ({
  config,
  onChange,
}) => {
  const shapes: Array<{ id: LfoShape; label: string; desc: string }> = [
    { id: 'sine', label: 'Sine Wave', desc: 'Smooth continuous orbit' },
    { id: 'triangle', label: 'Triangle', desc: 'Linear left-right sweep' },
    { id: 'square', label: 'Square Chop', desc: 'Rhythmic channel toggle' },
    { id: 'random', label: 'Sample & Hold', desc: 'Stepped random stereo' },
  ]

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900/90 to-zinc-950/80 border border-violet-500/30 p-5 shadow-xl backdrop-blur-xl space-y-4">
      {/* Rack Module Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                Module 03: Orbit Motion Rack
              </h3>
              <div
                className={`w-2 h-2 rounded-full ${
                  config.enabled ? 'bg-violet-400 shadow-md shadow-violet-400 animate-pulse' : 'bg-slate-700'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-400">LFO Auto-Panner, Tremolo & Sub-Bass Center Lock</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onChange({ ...config, enabled: !config.enabled })}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            config.enabled
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          {config.enabled ? 'RACK ON' : 'BYPASS'}
        </button>
      </div>

      {/* LFO Shape Selection */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">LFO Movement Modulation Waveform</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {shapes.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange({ ...config, shape: s.id })}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                config.shape === s.id
                  ? 'bg-violet-500/15 border-violet-400 text-white shadow-md shadow-violet-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-xs font-bold text-white">{s.label}</div>
              <div className="text-[9px] text-slate-400 mt-0.5">{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Rate, Sync & Depth */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Rate / Tempo Sync */}
        <div className="space-y-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300 font-semibold">LFO Panning Speed</span>
            <button
              type="button"
              onClick={() => onChange({ ...config, tempoSync: !config.tempoSync })}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                config.tempoSync
                  ? 'bg-violet-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {config.tempoSync ? 'BPM SYNC (ON)' : 'FREE HZ'}
            </button>
          </div>

          {!config.tempoSync ? (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Free Rate</span>
                <span className="text-violet-400">{config.rateHz.toFixed(2)} Hz</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.05"
                value={config.rateHz}
                onChange={(e) => onChange({ ...config, rateHz: parseFloat(e.target.value) })}
                className="w-full accent-violet-400"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500">Subdivision</span>
                <select
                  value={config.subdivision}
                  onChange={(e) => onChange({ ...config, subdivision: e.target.value as BeatSubdivision })}
                  className="w-full px-2 py-1 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white"
                >
                  <option value="1/4">1/4 Note (Beat)</option>
                  <option value="1/8">1/8 Note</option>
                  <option value="1/16">1/16 Note</option>
                </select>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500">Track BPM ({config.bpm})</span>
                <input
                  type="range"
                  min="60"
                  max="180"
                  step="1"
                  value={config.bpm}
                  onChange={(e) => onChange({ ...config, bpm: parseInt(e.target.value) })}
                  className="w-full accent-violet-400 mt-1"
                />
              </div>
            </div>
          )}
        </div>

        {/* Stereo Depth / Width */}
        <div className="space-y-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex justify-between text-xs text-slate-300 font-semibold">
            <span>Stereo Orbit Width</span>
            <span className="font-mono text-violet-400">{Math.round(config.depth * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1.5"
            step="0.02"
            value={config.depth}
            onChange={(e) => onChange({ ...config, depth: parseFloat(e.target.value) })}
            className="w-full accent-violet-400"
          />

          <div className="flex justify-between text-[11px] text-slate-400 pt-1">
            <span>Tremolo Modulation Depth</span>
            <span className="font-mono text-violet-400">{Math.round(config.tremoloDepth * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={config.tremoloDepth}
            onChange={(e) => onChange({ ...config, tremoloDepth: parseFloat(e.target.value) })}
            className="w-full accent-violet-400"
          />
        </div>
      </div>

      {/* SUB-BASS CENTER LOCK (CRITICAL FEATURE) */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-violet-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            config.subLock ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
          }`}>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Sub-Bass Center Lock</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Phase Guard
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Isolates frequencies below {config.subLockCrossoverHz}Hz to remain anchored in mono center, panning only mids & highs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="space-y-0.5 w-32">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Cutoff</span>
              <span className="font-mono text-emerald-400">{config.subLockCrossoverHz}Hz</span>
            </div>
            <input
              type="range"
              min="80"
              max="180"
              step="5"
              value={config.subLockCrossoverHz}
              onChange={(e) => onChange({ ...config, subLockCrossoverHz: parseInt(e.target.value) })}
              className="w-full h-1 accent-emerald-400"
            />
          </div>

          <button
            type="button"
            onClick={() => onChange({ ...config, subLock: !config.subLock })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              config.subLock
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {config.subLock ? 'LOCKED' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  )
}
