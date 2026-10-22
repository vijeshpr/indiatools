import React from 'react'
import { Sliders, Sun, Contrast, Droplets, Thermometer, Eye, RotateCcw, Sparkles } from 'lucide-react'
import type { ClipEffects } from '../../lib/hybridVideo/types.ts'
import { DEFAULT_EFFECTS } from '../../lib/hybridVideo/types.ts'

interface EffectsLibraryPanelProps {
  effects: ClipEffects
  onChange: (updated: ClipEffects) => void
  hasSelectedClip: boolean
}

export const EffectsLibraryPanel: React.FC<EffectsLibraryPanelProps> = ({
  effects,
  onChange,
  hasSelectedClip,
}) => {
  const updateColorGrading = (key: keyof ClipEffects['colorGrading'], value: any) => {
    onChange({
      ...effects,
      enabled: true,
      colorGrading: {
        ...effects.colorGrading,
        [key]: value,
      },
    })
  }

  const updateFilter = (key: keyof ClipEffects['filters'], value: number) => {
    onChange({
      ...effects,
      enabled: true,
      filters: {
        ...effects.filters,
        [key]: value,
      },
    })
  }

  const handleReset = () => {
    onChange({
      ...DEFAULT_EFFECTS,
      colorGrading: { ...DEFAULT_EFFECTS.colorGrading },
      filters: { ...DEFAULT_EFFECTS.filters },
    })
  }

  return (
    <div className="flex flex-col h-full bg-[#0D111A] text-white">
      {/* Header with Master Toggle */}
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-white/90">Cinematic Effects Lab</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={effects.enabled}
              onChange={(e) => onChange({ ...effects, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-8 h-4 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-cyan-500"></div>
          </label>
          <span className="text-[11px] text-white/60 font-medium">{effects.enabled ? 'ON' : 'OFF'}</span>
        </div>
      </div>

      {!hasSelectedClip && (
        <div className="px-3 py-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-[11px] flex items-center justify-between">
          <span>Editing default effect preset. Select a clip to adjust its specific effects.</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Cinematic LUT Presets */}
        <div>
          <label className="text-[11px] font-semibold text-white/70 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Cinematic Color Presets
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'none', label: 'Original / Neutral' },
              { id: 'teal-orange', label: 'Teal & Orange' },
              { id: 'cyberpunk-neon', label: 'Cyberpunk Neon' },
              { id: 'vintage-film', label: 'Vintage 35mm' },
              { id: 'bw-contrast', label: 'B&W Noir' },
              { id: 'golden-hour', label: 'Golden Hour' },
              { id: 'clean-studio', label: 'Clean Studio' },
            ].map((lut) => (
              <button
                key={lut.id}
                type="button"
                onClick={() => updateColorGrading('lutPreset', lut.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left transition-all ${
                  effects.colorGrading.lutPreset === lut.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                    : 'bg-white/[0.02] text-white/70 border-white/10 hover:bg-white/[0.05]'
                }`}
              >
                {lut.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color Grading Sliders */}
        <div className="space-y-3 pt-2 border-t border-white/5">
          <label className="text-[11px] font-semibold text-white/70 uppercase tracking-wider block">
            Color Grading
          </label>

          {/* Exposure */}
          <div>
            <div className="flex justify-between text-xs text-white/80 mb-1">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Exposure
              </span>
              <span className="font-mono text-cyan-300">{effects.colorGrading.exposure}</span>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              value={effects.colorGrading.exposure}
              onChange={(e) => updateColorGrading('exposure', Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>

          {/* Contrast */}
          <div>
            <div className="flex justify-between text-xs text-white/80 mb-1">
              <span className="flex items-center gap-1.5">
                <Contrast className="w-3.5 h-3.5 text-blue-400" />
                Contrast
              </span>
              <span className="font-mono text-cyan-300">{effects.colorGrading.contrast}</span>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              value={effects.colorGrading.contrast}
              onChange={(e) => updateColorGrading('contrast', Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>

          {/* Saturation */}
          <div>
            <div className="flex justify-between text-xs text-white/80 mb-1">
              <span className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-rose-400" />
                Saturation
              </span>
              <span className="font-mono text-cyan-300">{effects.colorGrading.saturation}</span>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              value={effects.colorGrading.saturation}
              onChange={(e) => updateColorGrading('saturation', Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>

          {/* Temperature */}
          <div>
            <div className="flex justify-between text-xs text-white/80 mb-1">
              <span className="flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-orange-400" />
                Temperature (Cool / Warm)
              </span>
              <span className="font-mono text-cyan-300">{effects.colorGrading.temperature}</span>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              value={effects.colorGrading.temperature}
              onChange={(e) => updateColorGrading('temperature', Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Cinematic Filters */}
        <div className="space-y-3 pt-2 border-t border-white/5">
          <label className="text-[11px] font-semibold text-white/70 uppercase tracking-wider block">
            Cinematic Optical Filters
          </label>

          {/* Vignette */}
          <div>
            <div className="flex justify-between text-xs text-white/80 mb-1">
              <span>Vignette Darkness</span>
              <span className="font-mono text-cyan-300">{effects.filters.vignette}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={effects.filters.vignette}
              onChange={(e) => updateFilter('vignette', Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>

          {/* Film Grain */}
          <div>
            <div className="flex justify-between text-xs text-white/80 mb-1">
              <span>Film Grain Texture</span>
              <span className="font-mono text-cyan-300">{effects.filters.filmGrain}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={effects.filters.filmGrain}
              onChange={(e) => updateFilter('filmGrain', Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>

          {/* Glow / Bloom */}
          <div>
            <div className="flex justify-between text-xs text-white/80 mb-1">
              <span>Cinematic Glow / Bloom</span>
              <span className="font-mono text-cyan-300">{effects.filters.glow}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={effects.filters.glow}
              onChange={(e) => updateFilter('glow', Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>

          {/* Blur */}
          <div>
            <div className="flex justify-between text-xs text-white/80 mb-1">
              <span>Gaussian Blur</span>
              <span className="font-mono text-cyan-300">{effects.filters.blurPx}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              value={effects.filters.blurPx}
              onChange={(e) => updateFilter('blurPx', Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Reset Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/70 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Effects to Default (OFF)</span>
          </button>
        </div>
      </div>
    </div>
  )
}
