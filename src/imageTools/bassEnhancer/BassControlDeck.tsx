/**
 * Precision Bass Control Deck (Right Panel)
 * Houses ultra-modern rotary knobs, linear sliders, mono bass lock toggle, and quick presets.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Sparkles, Layers, Sliders, Zap } from 'lucide-react'
import { BassEnhancerParams } from '../../lib/audio/bassEnhancer/types'
import { ModernKnob } from './ModernKnob'
import { ModernSlider } from './ModernSlider'

interface BassControlDeckProps {
  params: BassEnhancerParams
  onChange: (updater: (prev: BassEnhancerParams) => BassEnhancerParams) => void
  disabled?: boolean
}

export const PRESETS = [
  {
    id: 'deep-808',
    name: 'Deep 808 Sub',
    subLevel: 75,
    crossoverHz: 90,
    drive: 50,
    punch: 55,
    monoLock: true,
    mix: 90,
  },
  {
    id: 'club-kick',
    name: 'Club Punch Kick',
    subLevel: 45,
    crossoverHz: 115,
    drive: 35,
    punch: 85,
    monoLock: true,
    mix: 85,
  },
  {
    id: 'warm-tape',
    name: 'Warm Tape Bass',
    subLevel: 55,
    crossoverHz: 80,
    drive: 70,
    punch: 35,
    monoLock: true,
    mix: 80,
  },
  {
    id: 'natural-sub',
    name: 'Clean Sub-Octave',
    subLevel: 85,
    crossoverHz: 65,
    drive: 15,
    punch: 45,
    monoLock: true,
    mix: 85,
  },
]

export const BassControlDeck: React.FC<BassControlDeckProps> = ({
  params,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="bg-[#0e0e11]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-2xl flex flex-col gap-6">
      {/* Header with Quick Presets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#ff2d55]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              DSP Precision Rack
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">4th-Order L-R</span>
        </div>

        {/* Quick Style Selector Pills */}
        <div className="grid grid-cols-2 gap-1.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              disabled={disabled}
              onClick={() =>
                onChange((p) => ({
                  ...p,
                  subLevel: preset.subLevel,
                  crossoverHz: preset.crossoverHz,
                  drive: preset.drive,
                  punch: preset.punch,
                  monoLock: preset.monoLock,
                  mix: preset.mix,
                }))
              }
              className="px-2 py-1.5 rounded-lg text-[10px] font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5 hover:border-[#ff2d55]/30 transition-all text-left flex items-center justify-between disabled:opacity-40 cursor-pointer"
            >
              <span>{preset.name}</span>
              <Sparkles className="w-2.5 h-2.5 text-slate-500" />
            </button>
          ))}
        </div>
      </div>

      {/* Main 4 Precision Knobs Grid */}
      <div className="grid grid-cols-2 gap-y-6 gap-x-3 py-2 border-y border-white/5 bg-black/20 rounded-xl px-2">
        {/* 1. Sub-Harmonic Level */}
        <ModernKnob
          label="Sub -1 Octave"
          value={params.subLevel}
          min={0}
          max={100}
          defaultValue={55}
          unit="%"
          accentColor="crimson"
          disabled={disabled}
          onChange={(val) => onChange((p) => ({ ...p, subLevel: val }))}
          description="True -1 octave synthesizer"
        />

        {/* 2. Transient Punch */}
        <ModernKnob
          label="Punch / Attack"
          value={params.punch}
          min={0}
          max={100}
          defaultValue={45}
          unit="%"
          accentColor="amber"
          disabled={disabled}
          onChange={(val) => onChange((p) => ({ ...p, punch: val }))}
          description="Kick impact transient shaper"
        />

        {/* 3. Drive / Warmth */}
        <ModernKnob
          label="Drive / Saturation"
          value={params.drive}
          min={0}
          max={100}
          defaultValue={40}
          unit="%"
          accentColor="crimson"
          disabled={disabled}
          onChange={(val) => onChange((p) => ({ ...p, drive: val }))}
          description="Earbud & phone speaker harmonics"
        />

        {/* 4. Crossover Frequency */}
        <ModernKnob
          label="Crossover Split"
          value={params.crossoverHz}
          min={40}
          max={160}
          step={1}
          defaultValue={85}
          unit="Hz"
          accentColor="amber"
          disabled={disabled}
          onChange={(val) => onChange((p) => ({ ...p, crossoverHz: val }))}
          description="Linkwitz-Riley 4th order cutoff"
        />
      </div>

      {/* Modern Mono Bass Lock Toggle */}
      <div className="bg-slate-900/60 border border-white/5 rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              params.monoLock
                ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Mono Bass Lock</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono">
                &lt;120Hz
              </span>
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              Anchors sub frequencies dead-center to eliminate club phase cancellation
            </div>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange((p) => ({ ...p, monoLock: !p.monoLock }))}
          className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer disabled:opacity-40 ${
            params.monoLock ? 'bg-[#00f0ff]' : 'bg-slate-800'
          }`}
        >
          <motion.div
            animate={{ x: params.monoLock ? 20 : 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 450 }}
            className={`w-5 h-5 rounded-full ${params.monoLock ? 'bg-black' : 'bg-slate-400'}`}
          />
        </button>
      </div>

      {/* Parallel Wet / Dry Slider */}
      <div className="pt-1">
        <ModernSlider
          label="Parallel Wet / Dry Mix"
          value={params.mix}
          min={0}
          max={100}
          defaultValue={85}
          unit="%"
          accentColor="cyan"
          disabled={disabled}
          onChange={(val) => onChange((p) => ({ ...p, mix: val }))}
          description="Equal-power parallel blending between clean dry and sub-enhanced path"
        />
      </div>
    </div>
  )
}
