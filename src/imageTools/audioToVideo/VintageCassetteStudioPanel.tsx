/**
 * IndiaTools — Vintage Cassette Visualizer Studio Panel
 * Dedicated 1990s Retro Audio Cassette Editing Suite
 */

import React, { useRef } from 'react'
import {
  Disc,
  Upload,
  Trash2,
  Sparkles,
  Sliders,
  RotateCcw,
  Eye,
  EyeOff,
  Music,
  Activity,
  Layers,
  Image as ImageIcon,
  Zap,
  SlidersHorizontal,
  Flame,
  Tv,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'
import {
  StudioCompositionConfig,
  NormalizedAudioBands,
} from '../../lib/audioToVideo/types.ts'
import {
  VintageCassetteStudioConfig,
  CassetteStyle,
  CassetteLabelTemplate,
  MagneticTapeStyle,
  CassetteBackgroundPreset,
  DEFAULT_VINTAGE_CASSETTE_CONFIG,
} from '../../lib/cassette/cassetteTypes.ts'
import {
  CASSETTE_PRESETS,
  applyCassettePreset,
} from '../../lib/cassette/cassettePresets.ts'
import { vintageCassetteEngine } from '../../lib/cassette/cassetteEngine.ts'

interface VintageCassetteStudioPanelProps {
  composition: StudioCompositionConfig
  setComposition: React.Dispatch<React.SetStateAction<StudioCompositionConfig>>
  liveBands?: NormalizedAudioBands
  currentTime?: number
  duration?: number
  audioUrl?: string | null
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void
}

export const VintageCassetteStudioPanel: React.FC<VintageCassetteStudioPanelProps> = ({
  composition,
  setComposition,
  liveBands,
  currentTime = 0,
  duration = 30,
  showToast,
}) => {
  const cassette = composition.vintageCassette || DEFAULT_VINTAGE_CASSETTE_CONFIG
  const labelPhotoInputRef = useRef<HTMLInputElement | null>(null)
  const customBgInputRef = useRef<HTMLInputElement | null>(null)

  const updateConfig = (updates: Partial<VintageCassetteStudioConfig>) => {
    setComposition((prev) => ({
      ...prev,
      vintageCassette: {
        ...(prev.vintageCassette || DEFAULT_VINTAGE_CASSETTE_CONFIG),
        ...updates,
      },
    }))
  }

  // Handle Master Enable Toggle
  const toggleMasterEnable = () => {
    const nextEnabled = !cassette.enabled
    setComposition((prev) => ({
      ...prev,
      vintageCassette: {
        ...(prev.vintageCassette || DEFAULT_VINTAGE_CASSETTE_CONFIG),
        enabled: nextEnabled,
      },
      // Disable other conflicting full-screen single-scene engines if activating cassette
      photoUniverse: nextEnabled && prev.photoUniverse ? { ...prev.photoUniverse, enabled: false } : prev.photoUniverse,
      memoryBurst: nextEnabled && prev.memoryBurst ? { ...prev.memoryBurst, enabled: false } : prev.memoryBurst,
      sonicCam3d: nextEnabled && prev.sonicCam3d ? { ...prev.sonicCam3d, enabled: false } : prev.sonicCam3d,
      gardenStudio: nextEnabled && prev.gardenStudio ? { ...prev.gardenStudio, enabled: false } : prev.gardenStudio,
    }))

    if (nextEnabled) {
      vintageCassetteEngine.reset(currentTime)
      showToast('Vintage Cassette Visualizer activated! 📼', 'success')
    } else {
      showToast('Vintage Cassette Visualizer deactivated', 'info')
    }
  }

  // Handle Photo Upload for Label
  const handleLabelPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (PNG, JPG, WebP)', 'error')
      return
    }

    const objectUrl = URL.createObjectURL(file)
    updateConfig({ labelPhotoUrl: objectUrl })
    showToast(`Cassette label photo "${file.name}" applied!`, 'success')
  }

  // Handle Custom Background Upload
  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid background image', 'error')
      return
    }

    const objectUrl = URL.createObjectURL(file)
    updateConfig({ customBackgroundUrl: objectUrl })
    showToast(`Custom background applied!`, 'success')
  }

  // Reset to Defaults
  const handleResetDefaults = () => {
    setComposition((prev) => ({
      ...prev,
      vintageCassette: {
        ...DEFAULT_VINTAGE_CASSETTE_CONFIG,
        enabled: prev.vintageCassette?.enabled ?? true,
        labelPhotoUrl: prev.vintageCassette?.labelPhotoUrl,
      },
    }))
    vintageCassetteEngine.reset(currentTime)
    showToast('Reset to default 1990s cassette settings', 'info')
  }

  const bassEnergy = liveBands?.bass ?? 0

  return (
    <div className="space-y-6 text-sm text-gray-200 pb-12">
      {/* 1. Header & Master Activation Hero */}
      <div className="bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-slate-900/60 p-5 rounded-2xl border border-amber-500/30 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <Disc className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Vintage Cassette Visualizer
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full tracking-wider">
                  1990s RETRO
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Authentic compact cassette tape with rotating spools, audio-reactive magnetic ribbon & custom photo label.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={toggleMasterEnable}
              className={`px-4 py-2 rounded-xl font-medium text-xs flex items-center gap-2 transition-all shadow-md ${
                cassette.enabled
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25 ring-2 ring-amber-400/40 font-semibold'
                  : 'bg-slate-800 hover:bg-slate-700 text-gray-300 border border-slate-700'
              }`}
            >
              {cassette.enabled ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-slate-950" />
                  <span>Cassette Active</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                  <span>Activate Cassette</span>
                </>
              )}
            </button>

            <button
              onClick={handleResetDefaults}
              title="Reset Cassette to Defaults"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-gray-400 hover:text-white border border-slate-700/60 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Audio Reaction Indicator */}
        {cassette.enabled && (
          <div className="mt-4 pt-3 border-t border-amber-500/15 flex items-center justify-between text-[11px] text-gray-400">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Drive Reel Speed:</span>
              <span className="text-amber-300 font-mono font-medium">
                {(cassette.reelSpeed * (1 + (cassette.bassReactivity / 100) * bassEnergy * 2.8)).toFixed(2)}x
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>Bass Energy:</span>
              <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-75"
                  style={{ width: `${Math.round(bassEnergy * 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Curated Style Presets */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h4 className="font-semibold text-xs text-white uppercase tracking-wider">
              Signature Presets
            </h4>
          </div>
          <span className="text-[11px] text-gray-400">1-Click Vintage Aesthetics</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {CASSETTE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                const next = applyCassettePreset(cassette, preset.id)
                updateConfig(next)
                showToast(`Applied preset: ${preset.name}`, 'success')
              }}
              className="text-left p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/40 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-medium text-xs text-white group-hover:text-amber-300 transition-colors">
                    {preset.name}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                    {preset.badge}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 line-clamp-2 leading-tight">
                  {preset.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Cassette Shell Body & Style */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
          <Layers className="w-4 h-4 text-amber-400" />
          <h4 className="font-semibold text-xs text-white uppercase tracking-wider">
            Cassette Shell Style
          </h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(
            [
              { id: 'smoked-black', name: 'Smoked Black', desc: '1990s Polycarbonate' },
              { id: 'classic-retro', name: 'Classic Retro', desc: '1980s Ivory Beige' },
              { id: 'transparent-clear', name: 'Crystal Clear', desc: 'Visible Mechanics' },
              { id: 'golden-edition', name: 'Golden Master', desc: 'Collectors Gold' },
            ] as const
          ).map((s) => (
            <button
              key={s.id}
              onClick={() => updateConfig({ cassetteStyle: s.id })}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                cassette.cassetteStyle === s.id
                  ? 'bg-amber-500/15 border-amber-500/60 text-white shadow-sm ring-1 ring-amber-500/30'
                  : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 text-gray-300'
              }`}
            >
              <div className="font-medium text-xs">{s.name}</div>
              <div className="text-[10px] text-gray-400">{s.desc}</div>
            </button>
          ))}
        </div>

        {/* Shell Opacity Slider */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs text-gray-300">
            <span>Shell Transparency / Density</span>
            <span className="font-mono text-amber-400">{cassette.shellOpacity}%</span>
          </div>
          <input
            type="range"
            min={30}
            max={100}
            step={1}
            value={cassette.shellOpacity}
            onChange={(e) => updateConfig({ shellOpacity: Number(e.target.value) })}
            className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* 4. Custom Photo Label Designer */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <h4 className="font-semibold text-xs text-white uppercase tracking-wider">
              Custom Cassette Label & Photo
            </h4>
          </div>
          <span className="text-[11px] text-amber-400/80">Cover-Crop & Center Window</span>
        </div>

        {/* Label Photo Upload & Preview Card */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
          <div className="relative w-28 h-20 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 flex items-center justify-center shrink-0">
            {cassette.labelPhotoUrl ? (
              <img
                src={cassette.labelPhotoUrl}
                alt="Label preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-2 text-gray-500">
                <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                <span className="text-[9px]">No Photo</span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2 w-full">
            <div className="flex items-center gap-2">
              <input
                ref={labelPhotoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLabelPhotoUpload}
                className="hidden"
              />
              <button
                onClick={() => labelPhotoInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium text-xs flex items-center gap-1.5 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Label Photo</span>
              </button>

              {cassette.labelPhotoUrl && (
                <button
                  onClick={() => updateConfig({ labelPhotoUrl: undefined })}
                  className="px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 text-xs flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-gray-400">
              Your photo is mapped into the cassette's paper label, automatically fitted around the spool window.
            </p>
          </div>
        </div>

        {/* Label Template Selector */}
        <div className="space-y-1.5">
          <label className="text-xs text-gray-300 block">Label Template</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(
              [
                { id: 'classic', name: 'Classic Ruled', desc: 'Handwritten Lines' },
                { id: 'transparent', name: 'Transparent', desc: 'Minimal Clear' },
                { id: 'neon', name: 'Outrun Neon', desc: 'Synthwave Glow' },
                { id: 'grunge', name: 'Raw Grunge', desc: 'Distressed Wear' },
              ] as const
            ).map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => updateConfig({ labelTemplate: tpl.id })}
                className={`p-2 rounded-xl border text-left transition-all ${
                  cassette.labelTemplate === tpl.id
                    ? 'bg-amber-500/15 border-amber-500/60 text-white ring-1 ring-amber-500/30'
                    : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 text-gray-300'
                }`}
              >
                <div className="font-medium text-xs">{tpl.name}</div>
                <div className="text-[10px] text-gray-400">{tpl.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Label Text Metadata & Side A/B */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-gray-300 block mb-1">Mixtape Title</label>
            <input
              type="text"
              value={cassette.labelTitle}
              onChange={(e) => updateConfig({ labelTitle: e.target.value })}
              placeholder="MIXTAPE VOL. 1"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Artist / Subtitle</label>
            <input
              type="text"
              value={cassette.labelArtist}
              onChange={(e) => updateConfig({ labelArtist: e.target.value })}
              placeholder="ORIGINAL RECORDING"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-300 block mb-1">Side Tag</label>
            <select
              value={cassette.labelSideText}
              onChange={(e) => updateConfig({ labelSideText: e.target.value as any })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="SIDE A">SIDE A</option>
              <option value="SIDE B">SIDE B</option>
              <option value="AUTO REVERSE">AUTO REVERSE</option>
            </select>
          </div>
        </div>

        {/* Photo Crop & Fit Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>Photo Fit Mode</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {(['cover', 'contain'] as const).map((fit) => (
                <button
                  key={fit}
                  onClick={() => updateConfig({ labelPhotoFit: fit })}
                  className={`py-1 text-xs rounded-lg font-medium capitalize border transition-all ${
                    cassette.labelPhotoFit === fit
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold'
                      : 'bg-slate-800 border-slate-700 text-gray-300'
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>Photo Zoom</span>
              <span className="font-mono text-amber-400">{cassette.labelPhotoZoom}%</span>
            </div>
            <input
              type="range"
              min={80}
              max={200}
              step={2}
              value={cassette.labelPhotoZoom}
              onChange={(e) => updateConfig({ labelPhotoZoom: Number(e.target.value) })}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>Offset Y</span>
              <span className="font-mono text-amber-400">{cassette.labelPhotoOffsetY}px</span>
            </div>
            <input
              type="range"
              min={-60}
              max={60}
              step={1}
              value={cassette.labelPhotoOffsetY}
              onChange={(e) => updateConfig({ labelPhotoOffsetY: Number(e.target.value) })}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 5. Audio-Reactive Spinning Reels */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <h4 className="font-semibold text-xs text-white uppercase tracking-wider">
              Audio-Reactive Spinning Reels
            </h4>
          </div>
          <span className="text-[11px] text-gray-400">Independent Left & Right Hubs</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-300">
              <span>Base Rotation Speed</span>
              <span className="font-mono text-amber-400">{cassette.reelSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={2.5}
              step={0.1}
              value={cassette.reelSpeed}
              onChange={(e) => updateConfig({ reelSpeed: Number(e.target.value) })}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-300">
              <span>Bass Transient Acceleration</span>
              <span className="font-mono text-amber-400">{cassette.bassReactivity}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={cassette.bassReactivity}
              onChange={(e) => updateConfig({ bassReactivity: Number(e.target.value) })}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Spool Progression */}
        <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoSpool"
              checked={cassette.autoSpoolProgress}
              onChange={(e) => updateConfig({ autoSpoolProgress: e.target.checked })}
              className="accent-amber-500 rounded cursor-pointer"
            />
            <label htmlFor="autoSpool" className="text-xs text-gray-300 cursor-pointer">
              Auto-wind tape spools during music playback (Left to Right)
            </label>
          </div>

          {!cassette.autoSpoolProgress && (
            <div className="flex items-center gap-2 w-full sm:w-48">
              <span className="text-[11px] text-gray-400">Manual Spool:</span>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={cassette.reelSpoolProgress}
                onChange={(e) => updateConfig({ reelSpoolProgress: Number(e.target.value) })}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      {/* 6. Unraveling Magnetic Tape Ribbon Waveform */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <h4 className="font-semibold text-xs text-white uppercase tracking-wider">
              Magnetic Tape Ribbon Waveform
            </h4>
          </div>
          <button
            onClick={() => updateConfig({ tapeRibbonEnabled: !cassette.tapeRibbonEnabled })}
            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
              cassette.tapeRibbonEnabled
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-gray-400 border-slate-700'
            }`}
          >
            {cassette.tapeRibbonEnabled ? 'Tape Enabled' : 'Tape Disabled'}
          </button>
        </div>

        {cassette.tapeRibbonEnabled && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(
                [
                  { id: 'loose-flowing', name: 'Loose Flowing', desc: 'Natural Organic S-Loops' },
                  { id: 'symmetrical-ribbon', name: 'Symmetrical Ribbon', desc: 'Twin Dual-Side Loops' },
                  { id: 'cinematic-trail', name: 'Cinematic Trail', desc: 'Wide Waveform Ocean' },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  onClick={() => updateConfig({ tapeRibbonStyle: m.id })}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    cassette.tapeRibbonStyle === m.id
                      ? 'bg-amber-500/15 border-amber-500/60 text-white ring-1 ring-amber-500/30'
                      : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 text-gray-300'
                  }`}
                >
                  <div className="font-medium text-xs">{m.name}</div>
                  <div className="text-[10px] text-gray-400">{m.desc}</div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-300">
                  <span>Waveform Amplitude</span>
                  <span className="font-mono text-amber-400">{cassette.waveformIntensity}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={cassette.waveformIntensity}
                  onChange={(e) => updateConfig({ waveformIntensity: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-300">
                  <span>Ribbon Thickness</span>
                  <span className="font-mono text-amber-400">{cassette.ribbonThickness}px</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={20}
                  step={1}
                  value={cassette.ribbonThickness}
                  onChange={(e) => updateConfig({ ribbonThickness: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-gray-300">
                  <span>Atmospheric Ribbon Glow</span>
                  <span className="font-mono text-amber-400">{cassette.ribbonGlow}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={cassette.ribbonGlow}
                  onChange={(e) => updateConfig({ ribbonGlow: Number(e.target.value) })}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* 7. Retro Atmosphere & Overlays */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-amber-400" />
            <h4 className="font-semibold text-xs text-white uppercase tracking-wider">
              Retro Atmosphere & CRT Finishing
            </h4>
          </div>
          <span className="text-[11px] text-gray-400">Film Grain & VHS Scanlines</span>
        </div>

        {/* Background Preset */}
        <div className="space-y-2">
          <label className="text-xs text-gray-300 block">Studio Backdrop Preset</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(
              [
                { id: 'midnight-studio', name: 'Midnight Studio', desc: 'Navy & Amber Spotlight' },
                { id: 'warm-nostalgia', name: 'Warm Nostalgia', desc: 'Golden Hour Sunset' },
                { id: 'neon-cyberpunk', name: 'Neon Synthwave', desc: 'Magenta & Cyan Dark' },
                { id: 'deep-charcoal', name: 'Deep Charcoal', desc: 'Vinyl Studio Slate' },
              ] as const
            ).map((bg) => (
              <button
                key={bg.id}
                onClick={() => updateConfig({ backgroundPreset: bg.id, customBackgroundUrl: undefined })}
                className={`p-2 rounded-xl border text-left transition-all ${
                  cassette.backgroundPreset === bg.id && !cassette.customBackgroundUrl
                    ? 'bg-amber-500/15 border-amber-500/60 text-white ring-1 ring-amber-500/30'
                    : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 text-gray-300'
                }`}
              >
                <div className="font-medium text-xs">{bg.name}</div>
                <div className="text-[10px] text-gray-400">{bg.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Background Upload */}
        <div className="flex items-center gap-2 pt-1">
          <input
            ref={customBgInputRef}
            type="file"
            accept="image/*"
            onChange={handleCustomBgUpload}
            className="hidden"
          />
          <button
            onClick={() => customBgInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-300 border border-slate-700 text-xs flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Custom Backdrop</span>
          </button>
          {cassette.customBackgroundUrl && (
            <button
              onClick={() => updateConfig({ customBackgroundUrl: undefined })}
              className="text-xs text-red-400 hover:text-red-300 underline"
            >
              Clear Custom Backdrop
            </button>
          )}
        </div>

        {/* Toggles: Grain & VHS Scanlines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-300 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={cassette.analogGrain}
                  onChange={(e) => updateConfig({ analogGrain: e.target.checked })}
                  className="accent-amber-500 rounded cursor-pointer"
                />
                <span>Analog Film Grain</span>
              </label>
              <span className="font-mono text-xs text-amber-400">{cassette.grainIntensity}%</span>
            </div>
            {cassette.analogGrain && (
              <input
                type="range"
                min={5}
                max={50}
                step={2}
                value={cassette.grainIntensity}
                onChange={(e) => updateConfig({ grainIntensity: Number(e.target.value) })}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-300 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={cassette.vhsScanlines}
                  onChange={(e) => updateConfig({ vhsScanlines: e.target.checked })}
                  className="accent-amber-500 rounded cursor-pointer"
                />
                <span>CRT / VHS Scanlines</span>
              </label>
              <span className="font-mono text-xs text-amber-400">{cassette.scanlineIntensity}%</span>
            </div>
            {cassette.vhsScanlines && (
              <input
                type="range"
                min={5}
                max={50}
                step={2}
                value={cassette.scanlineIntensity}
                onChange={(e) => updateConfig({ scanlineIntensity: Number(e.target.value) })}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            )}
          </div>
        </div>
      </div>

      {/* 8. The Tape Glitch (Musical Climax Event) */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <h4 className="font-semibold text-xs text-white uppercase tracking-wider">
              The Tape Glitch (Climax Drops)
            </h4>
          </div>
          <button
            onClick={() => updateConfig({ climaxGlitchEnabled: !cassette.climaxGlitchEnabled })}
            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
              cassette.climaxGlitchEnabled
                ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                : 'bg-slate-800 text-gray-400 border-slate-700'
            }`}
          >
            {cassette.climaxGlitchEnabled ? 'Glitch Enabled' : 'Glitch Disabled'}
          </button>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed">
          Briefly triggers authentic tape tracking noise, horizontal displacement and chromatic scanline distortion during peak musical drops or climax events.
        </p>

        {cassette.climaxGlitchEnabled && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-300">
                <span>Glitch Intensity</span>
                <span className="font-mono text-orange-400">{cassette.glitchIntensity}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={cassette.glitchIntensity}
                onChange={(e) => updateConfig({ glitchIntensity: Number(e.target.value) })}
                className="w-full accent-orange-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-300">
                <span>Trigger Energy Threshold</span>
                <span className="font-mono text-orange-400">{(cassette.glitchThreshold * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min={0.60}
                max={0.95}
                step={0.02}
                value={cassette.glitchThreshold}
                onChange={(e) => updateConfig({ glitchThreshold: Number(e.target.value) })}
                className="w-full accent-orange-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-300">
                <span>Cooldown Time</span>
                <span className="font-mono text-orange-400">{cassette.glitchCooldownSec.toFixed(1)}s</span>
              </div>
              <input
                type="range"
                min={2.0}
                max={8.0}
                step={0.5}
                value={cassette.glitchCooldownSec}
                onChange={(e) => updateConfig({ glitchCooldownSec: Number(e.target.value) })}
                className="w-full accent-orange-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
