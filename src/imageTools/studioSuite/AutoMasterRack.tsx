import React from 'react'
import { Sparkles, Power, Sliders, Activity, Zap, CheckCircle2, AlertTriangle } from 'lucide-react'
import { AutoMasterConfig, MasteringPresetId, LoudnessMetrics } from '../../lib/audio/studioSuite/types'
import { MASTERING_PRESET_SPECS } from '../../lib/audio/studioSuite/masteringDsp'

interface AutoMasterRackProps {
  config: AutoMasterConfig
  onChange: (newConfig: AutoMasterConfig) => void
  loudness: LoudnessMetrics | null
  onAnalyzeAudio?: () => void
  isAnalyzing?: boolean
}

export const AutoMasterRack: React.FC<AutoMasterRackProps> = ({
  config,
  onChange,
  loudness,
  onAnalyzeAudio,
  isAnalyzing = false,
}) => {
  const spec = MASTERING_PRESET_SPECS[config.preset]

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900/90 to-zinc-950/80 border border-amber-500/30 p-5 shadow-xl backdrop-blur-xl space-y-4">
      {/* Rack Module Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                Module 01: Smart Auto Master
              </h3>
              <div
                className={`w-2 h-2 rounded-full ${
                  config.enabled ? 'bg-amber-400 shadow-md shadow-amber-400 animate-pulse' : 'bg-slate-700'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-400">Algorithmic Tonal Balance & Broadcast Loudness Staging</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onChange({ ...config, enabled: !config.enabled })}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            config.enabled
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          {config.enabled ? 'RACK ON' : 'BYPASS'}
        </button>
      </div>

      {/* Preset Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300">Mastering Target Style</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {(Object.keys(MASTERING_PRESET_SPECS) as MasteringPresetId[]).map((pid) => {
            const p = MASTERING_PRESET_SPECS[pid]
            const isSelected = config.preset === pid
            return (
              <button
                key={pid}
                type="button"
                onClick={() => onChange({ ...config, preset: pid })}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-400 text-white shadow-md shadow-amber-500/10'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-white truncate">{p.name.split(' (')[0]}</div>
                <div className="text-[9px] text-amber-400/80 truncate mt-0.5">{p.subtitle.split(' • ')[0]}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sliders: Intensity & Target LUFS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-300 font-semibold">
            <span>Mastering Intensity</span>
            <span className="font-mono text-amber-400">{Math.round(config.intensity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={config.intensity}
            onChange={(e) => onChange({ ...config, intensity: parseFloat(e.target.value) })}
            className="w-full accent-amber-400"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-300 font-semibold">
            <span>Broadcast Loudness Target</span>
            <span className="font-mono text-amber-400">{config.targetLufs.toFixed(1)} LUFS</span>
          </div>
          <input
            type="range"
            min="-18"
            max="-9"
            step="0.5"
            value={config.targetLufs}
            onChange={(e) => onChange({ ...config, targetLufs: parseFloat(e.target.value) })}
            className="w-full accent-amber-400"
          />
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => onChange({ ...config, subsonicCut: !config.subsonicCut })}
          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
            config.subsonicCut
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
              : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold">Subsonic 30Hz Cut</div>
          <div className="text-[9px] text-slate-400">Removes DC Rumble</div>
        </button>

        <button
          type="button"
          onClick={() => onChange({ ...config, warmSaturation: !config.warmSaturation })}
          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
            config.warmSaturation
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
              : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold">Tape Saturation</div>
          <div className="text-[9px] text-slate-400">Warm 2nd Harmonics</div>
        </button>

        <button
          type="button"
          onClick={() => onChange({ ...config, highAirBoost: !config.highAirBoost })}
          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
            config.highAirBoost
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
              : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold">12kHz Air Sheen</div>
          <div className="text-[9px] text-slate-400">High-End Sparkle</div>
        </button>
      </div>

      {/* Real-time Loudness Telemetry Box */}
      {loudness && (
        <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Measured Loudness:</span>
            <span className="font-mono font-bold text-amber-400">{loudness.estimatedLufs} LUFS</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-slate-300">
            <span>Peak: {loudness.inputPeakDb} dBFS</span>
            <span>•</span>
            <span>RMS: {loudness.inputRmsDb} dB</span>
            <span>•</span>
            <span>Crest: {loudness.crestFactorDb} dB</span>
          </div>
        </div>
      )}
    </div>
  )
}
