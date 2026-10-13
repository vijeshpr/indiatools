import React, { useRef } from 'react'
import {
  Upload,
  Trash2,
  Sliders,
  RotateCw,
  Layers,
  Grid,
} from 'lucide-react'
import {
  LogoWatermarkConfig,
  BlendMode,
} from '../../lib/watermarkEngine/types'
import { PositionAnchorGrid } from './PositionAnchorGrid'
import { BatchWatermarkTranslation } from '../../lib/watermarkEngine/i18n'

interface Props {
  config: LogoWatermarkConfig
  onChange: (updated: Partial<LogoWatermarkConfig>) => void
  onUploadLogo: (file: File) => void
  onClearLogo: () => void
  t: BatchWatermarkTranslation
}

const BLEND_MODES: { labelKey: keyof BatchWatermarkTranslation['blendModes']; value: BlendMode }[] = [
  { labelKey: 'normal', value: 'source-over' },
  { labelKey: 'multiply', value: 'multiply' },
  { labelKey: 'screen', value: 'screen' },
  { labelKey: 'overlay', value: 'overlay' },
  { labelKey: 'softLight', value: 'soft-light' },
  { labelKey: 'hardLight', value: 'hard-light' },
  { labelKey: 'luminosity', value: 'luminosity' },
  { labelKey: 'difference', value: 'difference' },
]

export const LogoControlsPanel: React.FC<Props> = ({
  config,
  onChange,
  onUploadLogo,
  onClearLogo,
  t,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-4">
      {/* Upload Logo Area */}
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onUploadLogo(e.target.files[0])
              e.target.value = ''
            }
          }}
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          className="hidden"
        />

        {config.logoUrl ? (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-700/80 shadow-inner">
            <div className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-800 p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src={config.logoUrl}
                alt="Logo Stamp"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">
                Active Logo Stamp
              </p>
              <p className="text-[11px] font-mono text-emerald-400 mt-0.5">
                {config.logoWidth} × {config.logoHeight} px
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  {t.changeLogo}
                </button>
                <span className="text-slate-600">•</span>
                <button
                  type="button"
                  onClick={onClearLogo}
                  className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-slate-700/80 hover:border-cyan-400/80 bg-slate-950/50 hover:bg-slate-900/50 transition-all duration-150 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform border border-slate-800">
              <Upload className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-xs font-semibold text-slate-200 mb-0.5">
              {t.uploadLogo}
            </p>
            <p className="text-[11px] text-slate-500">
              Transparent PNG or SVG recommended
            </p>
          </button>
        )}
      </div>

      {/* Scale & Blend Mode Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className="flex justify-between text-[11px] mb-1 font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-cyan-400" />
              <span>{t.logoScale}</span>
            </span>
            <span className="text-cyan-400 font-semibold">
              {config.scalePercent}%
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={60}
            step={1}
            value={config.scalePercent}
            onChange={(e) => onChange({ scalePercent: Number(e.target.value) })}
            className="w-full h-1.5 rounded-lg bg-slate-800 accent-cyan-400 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>{t.blendMode}</span>
          </label>
          <select
            value={config.blendMode}
            onChange={(e) => onChange({ blendMode: e.target.value as BlendMode })}
            className="w-full px-2.5 py-2 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          >
            {BLEND_MODES.map((b) => (
              <option key={b.value} value={b.value}>
                {t.blendModes[b.labelKey]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Opacity & Rotation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className="flex justify-between text-[11px] mb-1 font-mono">
            <span className="text-slate-400">{t.opacity}</span>
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

      {/* Tiling Grid for Logo */}
      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-inner space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-cyan-400" />
            <div>
              <p className="text-xs font-semibold text-slate-200">
                {t.tilingLabel}
              </p>
              <p className="text-[10px] text-slate-400">
                Repeat logo pattern across whole image
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              onChange({
                tiling: !config.tiling,
                rotation: !config.tiling && config.rotation === 0 ? -25 : config.rotation,
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
                min={100}
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
                min={80}
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
