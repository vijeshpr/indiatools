import React from 'react'
import {
  Type,
  Grid,
  RotateCw,
  Sliders,
  Sparkles,
} from 'lucide-react'
import { TextWatermarkConfig } from '../../lib/watermarkEngine/types'
import { PositionAnchorGrid } from './PositionAnchorGrid'
import { BatchWatermarkTranslation } from '../../lib/watermarkEngine/i18n'

interface Props {
  config: TextWatermarkConfig
  onChange: (updated: Partial<TextWatermarkConfig>) => void
  t: BatchWatermarkTranslation
}

const FONTS = [
  { name: 'Inter (Modern Sans)', value: 'Inter, system-ui, sans-serif' },
  { name: 'Plus Jakarta Sans (Clean)', value: '"Plus Jakarta Sans", sans-serif' },
  { name: 'Montserrat (Bold Studio)', value: 'Montserrat, sans-serif' },
  { name: 'Poppins (Geometric)', value: 'Poppins, sans-serif' },
  { name: 'Outfit (High-End)', value: 'Outfit, sans-serif' },
  { name: 'Oswald (Condensed)', value: 'Oswald, sans-serif' },
  { name: 'Playfair Display (Luxury Serif)', value: '"Playfair Display", serif' },
  { name: 'Space Mono (Technical)', value: '"Space Mono", monospace' },
]

const COLOR_SWATCHES = [
  { label: 'White', hex: '#ffffff' },
  { label: 'Obsidian', hex: '#0f172a' },
  { label: 'Neon Cyan', hex: '#22d3ee' },
  { label: 'Amber', hex: '#fbbf24' },
  { label: 'Rose', hex: '#fb7185' },
  { label: 'Emerald', hex: '#34d399' },
]

export const TextControlsPanel: React.FC<Props> = ({ config, onChange, t }) => {
  return (
    <div className="space-y-4">
      {/* Watermark Text Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.textLabel}</span>
          </label>
          <span className="text-[11px] font-mono text-slate-400">
            {config.text.length} chars
          </span>
        </div>
        <input
          type="text"
          value={config.text}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="e.g. © 2026 Studio India"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/80 focus:border-cyan-400 transition-all shadow-inner"
        />

        {/* Quick Text Preset Chips */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {['© 2026 Studio', 'CONFIDENTIAL', 'SAMPLE PHOTO', 'DO NOT COPY', 'PROTECTED'].map(
            (preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onChange({ text: preset })}
                className="px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[10px] font-mono transition-colors border border-slate-700/50"
              >
                {preset}
              </button>
            )
          )}
        </div>
      </div>

      {/* Typography & Font Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            {t.fontFamily}
          </label>
          <select
            value={config.fontFamily}
            onChange={(e) => onChange({ fontFamily: e.target.value })}
            className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          >
            {FONTS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1 font-mono">
            <span className="text-slate-400">{t.fontSize}</span>
            <span className="text-cyan-400 font-semibold">
              {config.fontSizePercent}%
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={15}
            step={0.5}
            value={config.fontSizePercent}
            onChange={(e) => onChange({ fontSizePercent: Number(e.target.value) })}
            className="w-full h-1.5 rounded-lg bg-slate-800 accent-cyan-400 cursor-pointer"
          />
        </div>
      </div>

      {/* Text Style Pills: Bold, Italic, All Caps, Shadow */}
      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          onClick={() => onChange({ bold: !config.bold })}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            config.bold
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
          }`}
        >
          {t.bold} (B)
        </button>

        <button
          type="button"
          onClick={() => onChange({ italic: !config.italic })}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold italic border transition-all ${
            config.italic
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
          }`}
        >
          {t.italic} (I)
        </button>

        <button
          type="button"
          onClick={() => onChange({ allCaps: !config.allCaps })}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all ${
            config.allCaps
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
          }`}
        >
          {t.allCaps}
        </button>

        <button
          type="button"
          onClick={() => onChange({ hasShadow: !config.hasShadow })}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
            config.hasShadow
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>{t.shadow}</span>
        </button>
      </div>

      {/* Color Swatches & Picker */}
      <div className="pt-1">
        <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
          {t.color}
        </label>
        <div className="flex items-center gap-2">
          {COLOR_SWATCHES.map((swatch) => (
            <button
              key={swatch.hex}
              type="button"
              onClick={() => onChange({ color: swatch.hex })}
              style={{ backgroundColor: swatch.hex }}
              title={swatch.label}
              className={`w-7 h-7 rounded-full border-2 transition-transform ${
                config.color.toLowerCase() === swatch.hex.toLowerCase()
                  ? 'border-cyan-400 scale-110 shadow-[0_0_8px_#22d3ee]'
                  : 'border-slate-700 hover:scale-105'
              }`}
            />
          ))}
          <input
            type="color"
            value={config.color}
            onChange={(e) => onChange({ color: e.target.value })}
            className="w-7 h-7 rounded-lg bg-transparent border border-slate-700 cursor-pointer"
            title="Custom Hex Color"
          />
        </div>
      </div>

      {/* Opacity & Rotation Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <div className="flex justify-between text-[11px] mb-1 font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-cyan-400" />
              <span>{t.opacity}</span>
            </span>
            <span className="text-cyan-400 font-semibold">
              {Math.round(config.opacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0.1}
            max={1.0}
            step={0.05}
            value={config.opacity}
            onChange={(e) => onChange({ opacity: Number(e.target.value) })}
            className="w-full h-1.5 rounded-lg bg-slate-800 accent-cyan-400 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] mb-1 font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <RotateCw className="w-3 h-3 text-cyan-400" />
              <span>{t.rotation}</span>
            </span>
            <span className="text-cyan-400 font-semibold">
              {config.rotation}°
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={-90}
              max={90}
              step={5}
              value={config.rotation}
              onChange={(e) => onChange({ rotation: Number(e.target.value) })}
              className="w-full h-1.5 rounded-lg bg-slate-800 accent-cyan-400 cursor-pointer"
            />
            <button
              type="button"
              onClick={() => onChange({ rotation: 0 })}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-white"
            >
              0°
            </button>
          </div>
        </div>
      </div>

      {/* Anti-Theft Diagonal Tiling Grid Switcher */}
      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-inner space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-cyan-400" />
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {t.tilingLabel}
              </p>
              <p className="text-[10px] text-slate-400">
                {t.tilingDescription}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              onChange({
                tiling: !config.tiling,
                // Default subtle rotation for tiling
                rotation: !config.tiling && config.rotation === 0 ? -30 : config.rotation,
              })
            }
            className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              config.tiling ? 'bg-cyan-500' : 'bg-slate-800'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                config.tiling ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {config.tiling && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <div>
              <div className="flex justify-between text-[10px] mb-1 font-mono">
                <span className="text-slate-400">{t.tileSpacingX}</span>
                <span className="text-cyan-400">{config.tileSpacingX}px</span>
              </div>
              <input
                type="range"
                min={80}
                max={400}
                step={20}
                value={config.tileSpacingX}
                onChange={(e) => onChange({ tileSpacingX: Number(e.target.value) })}
                className="w-full h-1.5 rounded-lg bg-slate-800 accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] mb-1 font-mono">
                <span className="text-slate-400">{t.tileSpacingY}</span>
                <span className="text-cyan-400">{config.tileSpacingY}px</span>
              </div>
              <input
                type="range"
                min={60}
                max={300}
                step={15}
                value={config.tileSpacingY}
                onChange={(e) => onChange({ tileSpacingY: Number(e.target.value) })}
                className="w-full h-1.5 rounded-lg bg-slate-800 accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* 9-Point Position Grid (Only if not tiling) */}
      <PositionAnchorGrid
        anchor={config.anchor}
        onChangeAnchor={(anchor) => onChange({ anchor })}
        paddingX={config.paddingXPercent}
        onChangePaddingX={(paddingXPercent) => onChange({ paddingXPercent })}
        paddingY={config.paddingYPercent}
        onChangePaddingY={(paddingYPercent) => onChange({ paddingYPercent })}
        t={t}
        disabled={config.tiling}
      />
    </div>
  )
}
