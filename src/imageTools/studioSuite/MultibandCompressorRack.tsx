import React from 'react'
import { Activity, Power, Sliders, Volume2, VolumeX, Eye } from 'lucide-react'
import { MultibandConfig, BandDynamicsConfig } from '../../lib/audio/studioSuite/types'

interface MultibandCompressorRackProps {
  config: MultibandConfig
  onChange: (newConfig: MultibandConfig) => void
}

export const MultibandCompressorRack: React.FC<MultibandCompressorRackProps> = ({
  config,
  onChange,
}) => {
  const updateBand = (
    bandKey: 'low' | 'mid' | 'high',
    updates: Partial<BandDynamicsConfig>
  ) => {
    onChange({
      ...config,
      [bandKey]: {
        ...config[bandKey],
        ...updates,
      },
    })
  }

  const renderBandStrip = (
    label: string,
    rangeDesc: string,
    bandKey: 'low' | 'mid' | 'high',
    accentColor: string,
    accentBorder: string
  ) => {
    const band = config[bandKey]
    return (
      <div className={`rounded-xl bg-slate-950/70 border ${accentBorder} p-3.5 space-y-3`}>
        {/* Strip Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <span className={`text-xs font-bold ${accentColor} uppercase tracking-wider`}>
              {label}
            </span>
            <span className="text-[10px] text-slate-500 ml-1.5 font-mono">{rangeDesc}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Solo */}
            <button
              type="button"
              onClick={() => updateBand(bandKey, { solo: !band.solo })}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                band.solo
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Solo band"
            >
              S
            </button>

            {/* Mute */}
            <button
              type="button"
              onClick={() => updateBand(bandKey, { mute: !band.mute })}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                band.mute
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Mute band"
            >
              M
            </button>
          </div>
        </div>

        {/* Sliders: Threshold & Ratio */}
        <div className="space-y-2">
          <div className="space-y-0.5">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Threshold</span>
              <span className="font-mono text-slate-200">{band.threshold} dB</span>
            </div>
            <input
              type="range"
              min="-60"
              max="0"
              step="1"
              value={band.threshold}
              onChange={(e) => updateBand(bandKey, { threshold: parseInt(e.target.value) })}
              className="w-full h-1.5 accent-emerald-400"
            />
          </div>

          <div className="space-y-0.5">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Ratio</span>
              <span className="font-mono text-slate-200">{band.ratio.toFixed(1)}:1</span>
            </div>
            <input
              type="range"
              min="1"
              max="16"
              step="0.5"
              value={band.ratio}
              onChange={(e) => updateBand(bandKey, { ratio: parseFloat(e.target.value) })}
              className="w-full h-1.5 accent-emerald-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="space-y-0.5">
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Attack</span>
                <span className="font-mono text-slate-300">{band.attackMs}ms</span>
              </div>
              <input
                type="range"
                min="1"
                max="80"
                step="1"
                value={band.attackMs}
                onChange={(e) => updateBand(bandKey, { attackMs: parseInt(e.target.value) })}
                className="w-full h-1 accent-emerald-400"
              />
            </div>

            <div className="space-y-0.5">
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Release</span>
                <span className="font-mono text-slate-300">{band.releaseMs}ms</span>
              </div>
              <input
                type="range"
                min="10"
                max="400"
                step="10"
                value={band.releaseMs}
                onChange={(e) => updateBand(bandKey, { releaseMs: parseInt(e.target.value) })}
                className="w-full h-1 accent-emerald-400"
              />
            </div>
          </div>

          <div className="space-y-0.5 pt-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Make-up Gain</span>
              <span className="font-mono text-emerald-400">{band.gainDb > 0 ? `+${band.gainDb}` : band.gainDb} dB</span>
            </div>
            <input
              type="range"
              min="-12"
              max="12"
              step="0.5"
              value={band.gainDb}
              onChange={(e) => updateBand(bandKey, { gainDb: parseFloat(e.target.value) })}
              className="w-full h-1.5 accent-emerald-400"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900/90 to-zinc-950/80 border border-emerald-500/30 p-5 shadow-xl backdrop-blur-xl space-y-4">
      {/* Rack Module Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                Module 02: Tri-Band Dynamics Rack
              </h3>
              <div
                className={`w-2 h-2 rounded-full ${
                  config.enabled ? 'bg-emerald-400 shadow-md shadow-emerald-400 animate-pulse' : 'bg-slate-700'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-400">Linkwitz-Riley 4th-Order (-24 dB/oct) Phase-Aligned Compression</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onChange({ ...config, enabled: !config.enabled })}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            config.enabled
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          {config.enabled ? 'RACK ON' : 'BYPASS'}
        </button>
      </div>

      {/* Crossover Frequency Controls */}
      <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-300 font-semibold">
            <span>Low-Mid Crossover</span>
            <span className="font-mono text-emerald-400">{config.lowCrossoverHz} Hz</span>
          </div>
          <input
            type="range"
            min="80"
            max="320"
            step="10"
            value={config.lowCrossoverHz}
            onChange={(e) => onChange({ ...config, lowCrossoverHz: parseInt(e.target.value) })}
            className="w-full h-1.5 accent-emerald-400"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-300 font-semibold">
            <span>Mid-High Crossover</span>
            <span className="font-mono text-emerald-400">{config.highCrossoverHz} Hz</span>
          </div>
          <input
            type="range"
            min="2000"
            max="6500"
            step="100"
            value={config.highCrossoverHz}
            onChange={(e) => onChange({ ...config, highCrossoverHz: parseInt(e.target.value) })}
            className="w-full h-1.5 accent-emerald-400"
          />
        </div>
      </div>

      {/* 3 Frequency Channel Strips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {renderBandStrip('Low Band', `0 - ${config.lowCrossoverHz}Hz`, 'low', 'text-amber-400', 'border-amber-500/30')}
        {renderBandStrip('Mid Band', `${config.lowCrossoverHz} - ${config.highCrossoverHz}Hz`, 'mid', 'text-emerald-400', 'border-emerald-500/30')}
        {renderBandStrip('High Band', `${config.highCrossoverHz}Hz+`, 'high', 'text-violet-400', 'border-violet-500/30')}
      </div>
    </div>
  )
}
