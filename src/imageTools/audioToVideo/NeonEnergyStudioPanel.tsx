/**
 * IndiaTools — Neon Energy / Electric Glow Studio Panel
 * Dedicated Cinematic Multi-Colour Electric Neon Editing Suite
 */

import React, { useRef } from 'react'
import {
  Zap,
  Upload,
  Trash2,
  Sparkles,
  Sliders,
  RotateCcw,
  Type,
  Image as ImageIcon,
  Activity,
  Layers,
  Palette,
  Eye,
  SlidersHorizontal,
  Flame,
  Radio,
  CheckCircle2,
  RefreshCw,
  Maximize2,
} from 'lucide-react'
import {
  StudioCompositionConfig,
  NormalizedAudioBands,
} from '../../lib/audioToVideo/types.ts'
import {
  NeonEnergyStudioConfig,
  NeonTheme,
  NeonInputMode,
  NeonBackgroundStyle,
  DEFAULT_NEON_ENERGY_CONFIG,
} from '../../lib/neonEnergy/neonEnergyTypes.ts'
import {
  NEON_PRESETS,
  applyNeonPreset,
} from '../../lib/neonEnergy/neonEnergyPresets.ts'

interface NeonEnergyStudioPanelProps {
  composition: StudioCompositionConfig
  setComposition: React.Dispatch<React.SetStateAction<StudioCompositionConfig>>
  liveBands?: NormalizedAudioBands
  currentTime?: number
  duration?: number
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void
}

export const NeonEnergyStudioPanel: React.FC<NeonEnergyStudioPanelProps> = ({
  composition,
  setComposition,
  liveBands,
  currentTime = 0,
  duration = 30,
  showToast,
}) => {
  const neon = composition.neonEnergy || DEFAULT_NEON_ENERGY_CONFIG
  const logoInputRef = useRef<HTMLInputElement | null>(null)

  // Generic updater
  const updateConfig = (updates: Partial<NeonEnergyStudioConfig>) => {
    setComposition((prev) => ({
      ...prev,
      neonEnergy: {
        ...(prev.neonEnergy || DEFAULT_NEON_ENERGY_CONFIG),
        ...updates,
      },
    }))
  }

  // Master Enable Toggle with mutual exclusion of competing full-screen engines
  const toggleMasterEnable = () => {
    const nextEnabled = !neon.enabled
    setComposition((prev) => ({
      ...prev,
      neonEnergy: {
        ...(prev.neonEnergy || DEFAULT_NEON_ENERGY_CONFIG),
        enabled: nextEnabled,
      },
      vintageCassette: nextEnabled && prev.vintageCassette ? { ...prev.vintageCassette, enabled: false } : prev.vintageCassette,
      photoUniverse: nextEnabled && prev.photoUniverse ? { ...prev.photoUniverse, enabled: false } : prev.photoUniverse,
      memoryBurst: nextEnabled && prev.memoryBurst ? { ...prev.memoryBurst, enabled: false } : prev.memoryBurst,
      sonicCam3d: nextEnabled && prev.sonicCam3d ? { ...prev.sonicCam3d, enabled: false } : prev.sonicCam3d,
      gardenStudio: nextEnabled && prev.gardenStudio ? { ...prev.gardenStudio, enabled: false } : prev.gardenStudio,
      photoMotion: nextEnabled && prev.photoMotion ? { ...prev.photoMotion, enabled: false } : prev.photoMotion,
    }))
    showToast(nextEnabled ? 'Neon Energy Visualizer Active' : 'Neon Visualizer Disabled', 'info')
  }

  // Logo File Upload (Preserves transparent PNG)
  const handleLogoUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG with transparency recommended)', 'error')
      return
    }
    const url = URL.createObjectURL(file)
    setComposition((prev) => ({
      ...prev,
      neonEnergy: {
        ...(prev.neonEnergy || DEFAULT_NEON_ENERGY_CONFIG),
        enabled: true,
        mode: 'image',
        image: {
          ...(prev.neonEnergy?.image || DEFAULT_NEON_ENERGY_CONFIG.image),
          logoUrl: url,
          logoName: file.name,
        },
      },
      vintageCassette: prev.vintageCassette ? { ...prev.vintageCassette, enabled: false } : prev.vintageCassette,
      photoUniverse: prev.photoUniverse ? { ...prev.photoUniverse, enabled: false } : prev.photoUniverse,
      memoryBurst: prev.memoryBurst ? { ...prev.memoryBurst, enabled: false } : prev.memoryBurst,
      sonicCam3d: prev.sonicCam3d ? { ...prev.sonicCam3d, enabled: false } : prev.sonicCam3d,
      gardenStudio: prev.gardenStudio ? { ...prev.gardenStudio, enabled: false } : prev.gardenStudio,
      photoMotion: prev.photoMotion ? { ...prev.photoMotion, enabled: false } : prev.photoMotion,
    }))
    showToast(`Loaded ${file.name} into Neon Studio`, 'success')
  }

  // Remove logo and revert to text mode
  const handleRemoveLogo = () => {
    updateConfig({
      mode: 'text',
      image: {
        ...neon.image,
        logoUrl: null,
        logoName: undefined,
      },
    })
    showToast('Logo cleared. Switched to Custom Text mode.', 'info')
  }

  // Reset to Defaults
  const handleResetDefaults = () => {
    setComposition((prev) => ({
      ...prev,
      neonEnergy: {
        ...DEFAULT_NEON_ENERGY_CONFIG,
        enabled: prev.neonEnergy?.enabled ?? true,
      },
    }))
    showToast('Reset Neon Energy Visualizer to defaults', 'info')
  }

  return (
    <div className="space-y-6">
      {/* 1. Header & Master Studio Toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-pink-500 to-yellow-400 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Zap className="w-4 h-4 text-black font-black" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Neon Energy Visualizer</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Electric Glow
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Cinematic multicoloured electric sign above glossy reflecting floor
            </p>
          </div>
        </div>

        <button
          onClick={toggleMasterEnable}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            neon.enabled
              ? 'bg-gradient-to-r from-cyan-400 to-pink-500 text-black shadow-lg shadow-cyan-500/30 font-black'
              : 'bg-slate-800 text-slate-400 hover:text-white border border-white/10'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{neon.enabled ? 'Active' : 'Disabled'}</span>
        </button>
      </div>

      {/* Hidden file input for logo */}
      <input
        type="file"
        ref={logoInputRef}
        onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
        accept="image/png,image/webp,image/svg+xml,image/jpeg"
        className="hidden"
      />

      {/* 2. Curated Cinematic Presets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Curated Neon Presets</span>
          </span>
          <button
            onClick={handleResetDefaults}
            className="text-[10px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {NEON_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                const next = applyNeonPreset(neon, preset.id)
                setComposition((prev) => ({
                  ...prev,
                  neonEnergy: {
                    ...next,
                    enabled: true,
                  },
                  vintageCassette: prev.vintageCassette ? { ...prev.vintageCassette, enabled: false } : prev.vintageCassette,
                  photoUniverse: prev.photoUniverse ? { ...prev.photoUniverse, enabled: false } : prev.photoUniverse,
                  memoryBurst: prev.memoryBurst ? { ...prev.memoryBurst, enabled: false } : prev.memoryBurst,
                  sonicCam3d: prev.sonicCam3d ? { ...prev.sonicCam3d, enabled: false } : prev.sonicCam3d,
                  gardenStudio: prev.gardenStudio ? { ...prev.gardenStudio, enabled: false } : prev.gardenStudio,
                  photoMotion: prev.photoMotion ? { ...prev.photoMotion, enabled: false } : prev.photoMotion,
                }))
                showToast(`Applied preset: ${preset.name}`, 'success')
              }}
              className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                neon.glow.theme === preset.config.glow?.theme
                  ? 'bg-cyan-950/50 border-cyan-500/50 text-white shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base">{preset.icon}</span>
                <span className="text-xs font-bold truncate text-slate-200">{preset.name}</span>
              </div>
              <span className="text-[10px] text-slate-500 line-clamp-1">{preset.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Input Mode Switcher (Image Logo vs Custom Text) */}
      <div className="space-y-3 pt-2 border-t border-white/5">
        <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sign Type & Input Source</span>
          </span>
          <span className="text-[10px] font-mono text-cyan-400">
            {neon.mode === 'image' ? 'Transparent PNG Logo' : 'Custom Neon Text'}
          </span>
        </label>

        <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => updateConfig({ mode: 'text' })}
            className={`py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              neon.mode === 'text'
                ? 'bg-gradient-to-r from-cyan-600/40 to-pink-600/40 text-cyan-300 border border-cyan-400/50 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Custom Text</span>
          </button>
          <button
            onClick={() => updateConfig({ mode: 'image' })}
            className={`py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              neon.mode === 'image'
                ? 'bg-gradient-to-r from-cyan-600/40 to-pink-600/40 text-cyan-300 border border-cyan-400/50 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>PNG Logo / Graphic</span>
          </button>
        </div>

        {/* Content based on Mode */}
        {neon.mode === 'text' ? (
          <div className="space-y-3 bg-slate-900/60 border border-white/10 p-3.5 rounded-2xl">
            {/* Custom Text Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                <span>Neon Sign Text</span>
                <span className="text-[10px] text-slate-500">Supports Multiline (\n)</span>
              </label>
              <textarea
                rows={2}
                value={neon.text.customText}
                onChange={(e) =>
                  updateConfig({
                    text: { ...neon.text, customText: e.target.value },
                  })
                }
                placeholder="Enter neon text..."
                className="w-full px-3 py-2 bg-slate-950 border border-white/15 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono tracking-wider resize-none"
              />
            </div>

            {/* Font Family & Weight */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-400">Font Family</label>
                <select
                  value={neon.text.fontFamily}
                  onChange={(e) =>
                    updateConfig({
                      text: { ...neon.text, fontFamily: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Inter">Inter (Clean Modern)</option>
                  <option value="Montserrat">Montserrat (Geometric)</option>
                  <option value="Orbitron">Orbitron (Sci-Fi Cyber)</option>
                  <option value="Cinzel">Cinzel (Cinematic Serif)</option>
                  <option value="Playfair Display">Playfair Display (Luxury)</option>
                  <option value="Bebas Neue">Bebas Neue (Bold Condensed)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-400">Font Weight</label>
                <select
                  value={neon.text.fontWeight}
                  onChange={(e) =>
                    updateConfig({
                      text: {
                        ...neon.text,
                        fontWeight: e.target.value as 'bold' | '900' | '600' | 'normal',
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="900">Black (900 Heavy)</option>
                  <option value="bold">Bold (700)</option>
                  <option value="600">Semibold (600)</option>
                  <option value="normal">Normal (400)</option>
                </select>
              </div>
            </div>

            {/* Font Size & Letter Spacing Sliders */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Font Size</span>
                  <span className="font-mono text-cyan-400">{neon.text.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="28"
                  max="140"
                  value={neon.text.fontSize}
                  onChange={(e) =>
                    updateConfig({
                      text: { ...neon.text, fontSize: parseInt(e.target.value) },
                    })
                  }
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Letter Spacing</span>
                  <span className="font-mono text-cyan-400">{neon.text.letterSpacing}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={neon.text.letterSpacing}
                  onChange={(e) =>
                    updateConfig({
                      text: { ...neon.text, letterSpacing: parseInt(e.target.value) },
                    })
                  }
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            </div>

            {/* White Core Neon Tube Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
              <div>
                <span className="font-bold text-white block">White Tube Core</span>
                <span className="text-[10px] text-slate-400">
                  Renders brilliant white-hot central gas filament
                </span>
              </div>
              <input
                type="checkbox"
                checked={neon.text.whiteCore}
                onChange={(e) =>
                  updateConfig({
                    text: { ...neon.text, whiteCore: e.target.checked },
                  })
                }
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3 bg-slate-900/60 border border-white/10 p-3.5 rounded-2xl">
            {neon.image.logoUrl ? (
              <div className="p-3 bg-slate-950 border border-white/10 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-lg bg-black/60 border border-white/10 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={neon.image.logoUrl}
                      alt="Neon Logo"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {neon.image.logoName || 'Uploaded Transparent Logo'}
                    </div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1.5 mt-0.5">
                      <span>● Ready for Electric Glow</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 cursor-pointer"
                  >
                    Replace
                  </button>
                  <button
                    onClick={handleRemoveLogo}
                    className="p-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-white/10 cursor-pointer"
                    title="Clear logo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => logoInputRef.current?.click()}
                className="p-5 rounded-xl border border-dashed border-white/20 hover:border-cyan-400/60 bg-slate-950/50 hover:bg-slate-900/50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-bold text-slate-200 block">
                    Upload Transparent PNG Logo
                  </span>
                  <span className="text-[10px] text-slate-400">
                    PNG, WebP or SVG with transparent background
                  </span>
                </div>
              </div>
            )}

            {/* Logo Scale Slider */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Logo Proportional Scale</span>
                <span className="font-mono text-cyan-400">{neon.image.logoScale}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="180"
                value={neon.image.logoScale}
                onChange={(e) =>
                  updateConfig({
                    image: { ...neon.image, logoScale: parseInt(e.target.value) },
                  })
                }
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. Position Controls (X and Y) */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sign Position & Height</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            X: {neon.posX}% | Y: {neon.posY}%
          </span>
        </label>

        <div className="grid grid-cols-2 gap-3 bg-slate-900/60 border border-white/10 p-3 rounded-2xl">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Horizontal Center</span>
              <span className="font-mono text-cyan-400">{neon.posX}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="80"
              value={neon.posX}
              onChange={(e) => updateConfig({ posX: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Vertical Position</span>
              <span className="font-mono text-cyan-400">{neon.posY}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="65"
              value={neon.posY}
              onChange={(e) => updateConfig({ posY: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* 5. Audio-Reactive Scale — The Bump */}
      <div className="space-y-3 pt-2 border-t border-white/5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-pink-400" />
            <span>Audio-Reactive Bass Bump</span>
          </label>
          {liveBands && (
            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
              <span>Kick:</span>
              <span className={`font-bold ${liveBands.isBeatHit ? 'text-pink-400 animate-pulse' : 'text-slate-500'}`}>
                {liveBands.isBeatHit ? '💥 BEAT HIT' : `${Math.round(liveBands.bass * 100)}%`}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3 bg-slate-900/60 border border-white/10 p-3 rounded-2xl">
          {/* Sensitivity */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Bass Sensitivity (30–150 Hz)</span>
              <span className="font-mono text-cyan-400">{neon.audio.bassSensitivity.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="2.5"
              step="0.05"
              value={neon.audio.bassSensitivity}
              onChange={(e) =>
                updateConfig({
                  audio: { ...neon.audio, bassSensitivity: parseFloat(e.target.value) },
                })
              }
              className="w-full accent-pink-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Bump Strength */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Beat Bump Scale Strength</span>
              <span className="font-mono text-pink-400">{neon.audio.bumpStrength.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="1.05"
              max="1.35"
              step="0.01"
              value={neon.audio.bumpStrength}
              onChange={(e) =>
                updateConfig({
                  audio: { ...neon.audio, bumpStrength: parseFloat(e.target.value) },
                })
              }
              className="w-full accent-pink-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* 6. Neon Glow & Color Themes */}
      <div className="space-y-3 pt-2 border-t border-white/5">
        <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-cyan-400" />
            <span>Neon Illumination & Colour Spectrum</span>
          </span>
          <span className="text-[10px] font-mono text-cyan-400 capitalize">
            {neon.glow.theme.replace('-', ' ')}
          </span>
        </label>

        {/* Theme Pills */}
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'cyber-rainbow', label: 'Rainbow Quad', icon: '🌈' },
            { id: 'electric-cyan', label: 'Electric Azure', icon: '⚡' },
            { id: 'hot-magenta', label: 'Hot Magenta', icon: '💖' },
            { id: 'acid-lime', label: 'Acid Lime', icon: '🔋' },
            { id: 'electric-gold', label: 'Royal Amber', icon: '👑' },
            { id: 'tokyo-midnight', label: 'Tokyo Violet', icon: '🌆' },
          ].map((theme) => (
            <button
              key={theme.id}
              onClick={() =>
                updateConfig({
                  glow: { ...neon.glow, theme: theme.id as NeonTheme },
                })
              }
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                neon.glow.theme === theme.id
                  ? 'bg-gradient-to-r from-cyan-600/30 to-pink-600/30 border-cyan-400 text-white shadow-md'
                  : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <span>{theme.icon}</span>
              <span className="text-[11px] truncate">{theme.label}</span>
            </button>
          ))}
        </div>

        {/* Glow Sliders */}
        <div className="space-y-3 bg-slate-900/60 border border-white/10 p-3 rounded-2xl">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Glow Intensity</span>
              <span className="font-mono text-cyan-400">{neon.glow.glowIntensity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={neon.glow.glowIntensity}
              onChange={(e) =>
                updateConfig({
                  glow: { ...neon.glow, glowIntensity: parseInt(e.target.value) },
                })
              }
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Aura Radius</span>
              <span className="font-mono text-cyan-400">{neon.glow.auraRadius}px</span>
            </div>
            <input
              type="range"
              min="15"
              max="90"
              value={neon.glow.auraRadius}
              onChange={(e) =>
                updateConfig({
                  glow: { ...neon.glow, auraRadius: parseInt(e.target.value) },
                })
              }
              className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Hue Cycling Toggle & Speed */}
          <div className="pt-2 border-t border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">Continuous Hue Shifting</span>
              <input
                type="checkbox"
                checked={neon.glow.hueCyclingEnabled}
                onChange={(e) =>
                  updateConfig({
                    glow: { ...neon.glow, hueCyclingEnabled: e.target.checked },
                  })
                }
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </div>

            {neon.glow.hueCyclingEnabled && (
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Color Cycle Speed</span>
                  <span className="font-mono text-cyan-400">{neon.glow.hueCycleSpeed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.1"
                  value={neon.glow.hueCycleSpeed}
                  onChange={(e) =>
                    updateConfig({
                      glow: { ...neon.glow, hueCycleSpeed: parseFloat(e.target.value) },
                    })
                  }
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 7. Glossy Floor Reflection */}
      <div className="space-y-3 pt-2 border-t border-white/5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Glossy Floor Reflection</span>
          </label>
          <input
            type="checkbox"
            checked={neon.reflection.enabled}
            onChange={(e) =>
              updateConfig({
                reflection: { ...neon.reflection, enabled: e.target.checked },
              })
            }
            className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
          />
        </div>

        {neon.reflection.enabled && (
          <div className="space-y-3 bg-slate-900/60 border border-white/10 p-3 rounded-2xl">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Reflection Opacity</span>
                <span className="font-mono text-cyan-400">{neon.reflection.opacity}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="90"
                value={neon.reflection.opacity}
                onChange={(e) =>
                  updateConfig({
                    reflection: { ...neon.reflection, opacity: parseInt(e.target.value) },
                  })
                }
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Floor Horizon Height</span>
                <span className="font-mono text-cyan-400">{neon.reflection.floorHorizonY}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="82"
                value={neon.reflection.floorHorizonY}
                onChange={(e) =>
                  updateConfig({
                    reflection: { ...neon.reflection, floorHorizonY: parseInt(e.target.value) },
                  })
                }
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
              <span className="text-slate-300">Floor Perspective Grid</span>
              <input
                type="checkbox"
                checked={neon.reflection.floorGridEnabled}
                onChange={(e) =>
                  updateConfig({
                    reflection: { ...neon.reflection, floorGridEnabled: e.target.checked },
                  })
                }
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* 8. Dark Cinematic Background & Mid-Frequency Pulse */}
      <div className="space-y-3 pt-2 border-t border-white/5">
        <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cinematic Dark Background</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400 capitalize">
            {neon.backgroundStyle.replace('-', ' ')}
          </span>
        </label>

        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'dark-navy-slate', label: 'Dark Navy Slate' },
            { id: 'charcoal-abyss', label: 'Charcoal Abyss' },
            { id: 'cyber-dark', label: 'Cyber Dark' },
            { id: 'midnight-studio', label: 'Midnight Studio' },
          ].map((style) => (
            <button
              key={style.id}
              onClick={() => updateConfig({ backgroundStyle: style.id as NeonBackgroundStyle })}
              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                neon.backgroundStyle === style.id
                  ? 'bg-cyan-950/50 border-cyan-400 text-cyan-300 shadow-sm'
                  : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>

        {/* Mid-Frequency Ambient Pulse */}
        <div className="bg-slate-900/60 border border-white/10 p-3 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-white block">Mid-Frequency Ambient Pulse</span>
              <span className="text-[10px] text-slate-400">
                Pulsing radial aura driven by vocals, synths and mids (150–2000 Hz)
              </span>
            </div>
            <input
              type="checkbox"
              checked={neon.audio.midFreqPulseEnabled}
              onChange={(e) =>
                updateConfig({
                  audio: { ...neon.audio, midFreqPulseEnabled: e.target.checked },
                })
              }
              className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
            />
          </div>

          {neon.audio.midFreqPulseEnabled && (
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Pulse Intensity</span>
                <span className="font-mono text-cyan-400">{neon.audio.midFreqPulseIntensity}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={neon.audio.midFreqPulseIntensity}
                onChange={(e) =>
                  updateConfig({
                    audio: { ...neon.audio, midFreqPulseIntensity: parseInt(e.target.value) },
                  })
                }
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
