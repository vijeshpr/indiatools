/**
 * IndiaTools — SonicCam 3D
 * Music-Reactive Cinematic Camera Studio Panel
 */

import React, { useRef, useState } from 'react'
import {
  Camera,
  RotateCcw,
  Eye,
  EyeOff,
  Upload,
  Download,
  Trash2,
  Sliders,
  SlidersHorizontal,
  Compass,
  Film,
  Sparkles,
  Zap,
  Activity,
  Layers,
  ChevronDown,
  ChevronUp,
  Plus,
  Play,
  CheckCircle2,
  Aperture,
  Maximize2,
  Move,
  Volume2,
} from 'lucide-react'
import {
  StudioCompositionConfig,
  NormalizedAudioBands,
} from '../../lib/audioToVideo/types'
import {
  SonicCamStudioConfig,
  DEFAULT_SONIC_CAM_CONFIG,
  CameraKeyframe,
  SonicCamPresetMetadata,
  PushPullMode,
  OrbitDirection,
  DriftDirection,
  TiltRiseMode,
  SonicCamEasing,
  CameraFitMode,
} from '../../lib/sonicCam/sonicCamTypes'
import {
  SONIC_CAM_PRESETS,
  getSonicCamPreset,
} from '../../lib/sonicCam/sonicCamPresets'
import { sonicCamEngine } from '../../lib/sonicCam/sonicCamEngine'

interface SonicCamStudioPanelProps {
  composition: StudioCompositionConfig
  setComposition: React.Dispatch<React.SetStateAction<StudioCompositionConfig>>
  liveBands: NormalizedAudioBands
  currentTime: number
  duration: number
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void
  onSelectPresetModal: (preset: SonicCamPresetMetadata) => void
}

export const SonicCamStudioPanel: React.FC<SonicCamStudioPanelProps> = ({
  composition,
  setComposition,
  liveBands,
  currentTime,
  duration,
  showToast,
  onSelectPresetModal,
}) => {
  const sonic = composition.sonicCam3d || DEFAULT_SONIC_CAM_CONFIG

  const photoInputRef = useRef<HTMLInputElement | null>(null)
  const bgInputRef = useRef<HTMLInputElement | null>(null)
  const jsonInputRef = useRef<HTMLInputElement | null>(null)

  // Accordion section collapse state
  const [openSections, setOpenSections] = useState({
    orbit: true,
    pushPull: true,
    drift: false,
    depth: false,
    tiltRise: false,
    reactive: true,
    path: false,
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  // Keyframe addition state
  const [newKfZoom, setNewKfZoom] = useState<number>(1.2)
  const [newKfOrbit, setNewKfOrbit] = useState<number>(0)
  const [newKfTilt, setNewKfTilt] = useState<number>(0)

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // Helper to update sonicCam3d config
  const updateSonic = (updater: (prev: SonicCamStudioConfig) => SonicCamStudioConfig) => {
    setComposition((prev) => ({
      ...prev,
      sonicCam3d: updater(prev.sonicCam3d || DEFAULT_SONIC_CAM_CONFIG),
    }))
  }

  // File Upload Handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP)', 'error')
      return
    }
    const url = URL.createObjectURL(file)
    setComposition((prev) => ({
      ...prev,
      sonicCam3d: {
        ...(prev.sonicCam3d || DEFAULT_SONIC_CAM_CONFIG),
        sourceImageUrl: url,
      },
      background: {
        ...prev.background,
        singleImageUrl: url,
      },
    }))
    showToast('Loaded photograph into SonicCam 3D', 'success')
  }

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error')
      return
    }
    const url = URL.createObjectURL(file)
    updateSonic((prev) => ({
      ...prev,
      depth: {
        ...prev.depth,
        enabled: true,
        customBackgroundUrl: url,
      },
    }))
    showToast('Loaded custom background layer for 3D parallax', 'success')
  }

  const handleResetAll = () => {
    updateSonic((prev) => ({
      ...DEFAULT_SONIC_CAM_CONFIG,
      sourceImageUrl: prev.sourceImageUrl || composition.background.singleImageUrl || null,
    }))
    sonicCamEngine.resetSmoothing()
    showToast('Reset all SonicCam 3D effects to clean neutral', 'info')
  }

  const handleToggleMaster = () => {
    updateSonic((prev) => ({
      ...prev,
      enabled: !prev.enabled,
    }))
  }

  const handleToggleBeforeAfter = () => {
    updateSonic((prev) => ({
      ...prev,
      isBeforeActive: !prev.isBeforeActive,
    }))
  }

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(sonic, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `soniccam-3d-settings-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Exported SonicCam 3D settings JSON', 'success')
  }

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string)
        if (typeof parsed === 'object') {
          updateSonic((prev) => ({
            ...DEFAULT_SONIC_CAM_CONFIG,
            ...parsed,
            sourceImageUrl: prev.sourceImageUrl || composition.background.singleImageUrl || null,
          }))
          showToast('Imported SonicCam 3D settings JSON', 'success')
        }
      } catch {
        showToast('Invalid JSON file format', 'error')
      }
    }
    reader.readAsText(file)
  }

  const handleAddKeyframe = () => {
    const newKf: CameraKeyframe = {
      id: `kf-${Date.now()}`,
      timeSec: Math.round(currentTime * 10) / 10,
      xOffset: 0,
      yOffset: 0,
      zoom: newKfZoom,
      tiltDeg: newKfTilt,
      orbitDeg: newKfOrbit,
      intensity: 60,
      easing: 'ease-in-out',
    }
    updateSonic((prev) => {
      const existing = prev.cameraPath.keyframes || []
      const updated = [...existing, newKf].sort((a, b) => a.timeSec - b.timeSec)
      return {
        ...prev,
        cameraPath: {
          ...prev.cameraPath,
          enabled: true,
          keyframes: updated,
        },
      }
    })
    showToast(`Added keyframe at ${formatSec(currentTime)}`, 'success')
  }

  const handleDeleteKeyframe = (id: string) => {
    updateSonic((prev) => ({
      ...prev,
      cameraPath: {
        ...prev.cameraPath,
        keyframes: prev.cameraPath.keyframes.filter((k) => k.id !== id),
      },
    }))
    showToast('Keyframe removed', 'info')
  }

  const activePhoto = sonic.sourceImageUrl || composition.background.singleImageUrl

  return (
    <div className="space-y-6">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={photoInputRef}
        onChange={handlePhotoUpload}
        accept="image/*,.jpg,.jpeg,.png,.webp"
        className="hidden"
      />
      <input
        type="file"
        ref={bgInputRef}
        onChange={handleBgUpload}
        accept="image/*,.jpg,.jpeg,.png,.webp"
        className="hidden"
      />
      <input
        type="file"
        ref={jsonInputRef}
        onChange={handleImportJson}
        accept=".json"
        className="hidden"
      />

      {/* Header & Studio Master Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              SonicCam 3D Studio
            </h3>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                sonic.enabled
                  ? 'bg-sky-500/15 text-sky-300 border-sky-500/40 animate-pulse'
                  : 'bg-slate-800 text-slate-400 border-white/10'
              }`}
            >
              {sonic.enabled ? 'ACTIVE' : 'OFF (NEUTRAL)'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Music-Reactive Cinematic Virtual Camera • Orbit, Dolly, Parallax & Keyframes
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={handleToggleBeforeAfter}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              sonic.isBeforeActive
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow'
                : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Toggle Before / After (Temporary clean comparison)"
          >
            {sonic.isBeforeActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{sonic.isBeforeActive ? 'Before (Original)' : 'Compare'}</span>
          </button>

          <button
            onClick={handleExportJson}
            className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-sky-300 transition-all"
            title="Export Camera Settings JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => jsonInputRef.current?.click()}
            className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-sky-300 transition-all"
            title="Import Camera Settings JSON"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleResetAll}
            className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-red-400 transition-all"
            title="Reset all SonicCam effects to neutral"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 cursor-pointer">
            <span className="text-[11px] font-bold text-slate-300">Camera</span>
            <input
              type="checkbox"
              checked={sonic.enabled}
              onChange={handleToggleMaster}
              className="w-4 h-4 accent-sky-400 rounded cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* 1. Photograph Media & Fit */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Aperture className="w-3.5 h-3.5 text-sky-400" />
            <span>Visual Subject Photograph</span>
          </label>
          {activePhoto && (
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-white/10">
              {(['cover', 'contain', 'fill'] as CameraFitMode[]).map((fit) => (
                <button
                  key={fit}
                  onClick={() => updateSonic((prev) => ({ ...prev, sourceImageFit: fit }))}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize transition-all ${
                    sonic.sourceImageFit === fit
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>
          )}
        </div>

        {!activePhoto ? (
          <div
            onClick={() => photoInputRef.current?.click()}
            className="p-6 rounded-2xl border-2 border-dashed border-white/15 hover:border-sky-400/50 bg-slate-950/40 hover:bg-slate-900/40 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group"
          >
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                Upload Still Photograph
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                PNG, JPEG, WebP • Processed locally in your browser
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={activePhoto}
                alt="Source preview"
                className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  Visual Subject Loaded
                </div>
                <div className="text-[10px] text-sky-400 font-mono mt-0.5">
                  100% Client-Side Virtual Camera
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => photoInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 hover:text-white border border-white/10"
              >
                Replace
              </button>
              <button
                onClick={() => updateSonic((prev) => ({ ...prev, sourceImageUrl: null }))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 bg-slate-800/60 border border-white/10"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Curated Camera Presets (Explicit 1-Click Selection) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-sky-400" />
            <span>9 Curated Cinematic Camera Presets</span>
          </label>
          <span className="text-[10px] text-slate-500">Requires explicit selection</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
          {SONIC_CAM_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => onSelectPresetModal(preset)}
              className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-sky-500/40 cursor-pointer transition-all space-y-1.5 group relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                  {preset.name}
                </span>
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: preset.accentColor }}
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-snug line-clamp-2">
                {preset.subtitle}
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {preset.enabledModules.slice(0, 2).map((m) => (
                  <span
                    key={m}
                    className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-white/5 text-slate-300"
                  >
                    ✓ {m}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Collapsible Camera Modules */}
      <div className="space-y-3 pt-2">
        {/* MODULE A: SMOOTH ORBIT */}
        <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div
              onClick={() => toggleSection('orbit')}
              className="flex items-center gap-2 cursor-pointer flex-1"
            >
              <Compass className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold text-white">Smooth Orbit Arc</span>
              {openSections.orbit ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              )}
            </div>
            <input
              type="checkbox"
              checked={sonic.orbit.enabled}
              onChange={(e) =>
                updateSonic((prev) => ({
                  ...prev,
                  enabled: e.target.checked ? true : prev.enabled,
                  orbit: { ...prev.orbit, enabled: e.target.checked },
                }))
              }
              className="w-4 h-4 accent-sky-400 rounded cursor-pointer"
            />
          </div>

          {openSections.orbit && (
            <div className="space-y-3 pt-2 border-t border-white/5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Direction:</span>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg">
                  {(['oscillate', 'left', 'right'] as OrbitDirection[]).map((dir) => (
                    <button
                      key={dir}
                      onClick={() =>
                        updateSonic((prev) => ({
                          ...prev,
                          orbit: { ...prev.orbit, direction: dir },
                        }))
                      }
                      className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                        sonic.orbit.direction === dir
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'text-slate-400'
                      }`}
                    >
                      {dir}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Orbit Range</span>
                  <span className="font-mono text-sky-400">{sonic.orbit.rangeDeg}°</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="35"
                  value={sonic.orbit.rangeDeg}
                  onChange={(e) =>
                    updateSonic((prev) => ({
                      ...prev,
                      orbit: { ...prev.orbit, rangeDeg: parseInt(e.target.value) },
                    }))
                  }
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Orbit Speed</span>
                  <span className="font-mono text-sky-400">{sonic.orbit.speed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  value={sonic.orbit.speed}
                  onChange={(e) =>
                    updateSonic((prev) => ({
                      ...prev,
                      orbit: { ...prev.orbit, speed: parseFloat(e.target.value) },
                    }))
                  }
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* MODULE B: PUSH-IN / PULL-OUT (DOLLY ZOOM) */}
        <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div
              onClick={() => toggleSection('pushPull')}
              className="flex items-center gap-2 cursor-pointer flex-1"
            >
              <Maximize2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white">Push-In / Pull-Out (Dolly Zoom)</span>
              {openSections.pushPull ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              )}
            </div>
            <input
              type="checkbox"
              checked={sonic.pushPull.enabled}
              onChange={(e) =>
                updateSonic((prev) => ({
                  ...prev,
                  enabled: e.target.checked ? true : prev.enabled,
                  pushPull: { ...prev.pushPull, enabled: e.target.checked },
                }))
              }
              className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
            />
          </div>

          {openSections.pushPull && (
            <div className="space-y-3 pt-2 border-t border-white/5">
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400">Dolly Movement Mode:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg text-center">
                  {(
                    [
                      'push-in',
                      'pull-out',
                      'push-then-pull',
                      'slow-approach',
                      'wide-establishing',
                    ] as PushPullMode[]
                  ).map((m) => (
                    <button
                      key={m}
                      onClick={() =>
                        updateSonic((prev) => ({
                          ...prev,
                          pushPull: { ...prev.pushPull, mode: m },
                        }))
                      }
                      className={`px-2 py-1 rounded text-[10px] font-bold capitalize ${
                        sonic.pushPull.mode === m
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'text-slate-400'
                      }`}
                    >
                      {m.replace(/-/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Start Zoom</span>
                    <span className="font-mono text-cyan-400">
                      {sonic.pushPull.startZoom.toFixed(2)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="2.0"
                    step="0.05"
                    value={sonic.pushPull.startZoom}
                    onChange={(e) =>
                      updateSonic((prev) => ({
                        ...prev,
                        pushPull: {
                          ...prev.pushPull,
                          startZoom: parseFloat(e.target.value),
                        },
                      }))
                    }
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>End Zoom</span>
                    <span className="font-mono text-cyan-400">
                      {sonic.pushPull.endZoom.toFixed(2)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="2.2"
                    step="0.05"
                    value={sonic.pushPull.endZoom}
                    onChange={(e) =>
                      updateSonic((prev) => ({
                        ...prev,
                        pushPull: {
                          ...prev.pushPull,
                          endZoom: parseFloat(e.target.value),
                        },
                      }))
                    }
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Overscan Safeguard (Prevents Black Seams)</span>
                  <span className="font-mono text-cyan-400">
                    {sonic.pushPull.overscan.toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="1.05"
                  max="1.35"
                  step="0.01"
                  value={sonic.pushPull.overscan}
                  onChange={(e) =>
                    updateSonic((prev) => ({
                      ...prev,
                      pushPull: {
                        ...prev.pushPull,
                        overscan: parseFloat(e.target.value),
                      },
                    }))
                  }
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* MODULE C: CAMERA DRIFT */}
        <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div
              onClick={() => toggleSection('drift')}
              className="flex items-center gap-2 cursor-pointer flex-1"
            >
              <Move className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-bold text-white">Musical Camera Drift</span>
              {openSections.drift ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              )}
            </div>
            <input
              type="checkbox"
              checked={sonic.drift.enabled}
              onChange={(e) =>
                updateSonic((prev) => ({
                  ...prev,
                  enabled: e.target.checked ? true : prev.enabled,
                  drift: { ...prev.drift, enabled: e.target.checked },
                }))
              }
              className="w-4 h-4 accent-violet-400 rounded cursor-pointer"
            />
          </div>

          {openSections.drift && (
            <div className="space-y-3 pt-2 border-t border-white/5">
              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sonic.drift.horizontalEnabled}
                    onChange={(e) =>
                      updateSonic((prev) => ({
                        ...prev,
                        drift: {
                          ...prev.drift,
                          horizontalEnabled: e.target.checked,
                        },
                      }))
                    }
                    className="accent-violet-400 rounded"
                  />
                  <span className="text-slate-300">Horizontal</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sonic.drift.verticalEnabled}
                    onChange={(e) =>
                      updateSonic((prev) => ({
                        ...prev,
                        drift: {
                          ...prev.drift,
                          verticalEnabled: e.target.checked,
                        },
                      }))
                    }
                    className="accent-violet-400 rounded"
                  />
                  <span className="text-slate-300">Vertical</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sonic.drift.tiltEnabled}
                    onChange={(e) =>
                      updateSonic((prev) => ({
                        ...prev,
                        drift: { ...prev.drift, tiltEnabled: e.target.checked },
                      }))
                    }
                    className="accent-violet-400 rounded"
                  />
                  <span className="text-slate-300">Tilt Drift</span>
                </label>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Drift Amplitude</span>
                  <span className="font-mono text-violet-400">{sonic.drift.amplitude} px</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={sonic.drift.amplitude}
                  onChange={(e) =>
                    updateSonic((prev) => ({
                      ...prev,
                      drift: { ...prev.drift, amplitude: parseInt(e.target.value) },
                    }))
                  }
                  className="w-full accent-violet-400 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* MODULE D: DEPTH-AWARE PARALLAX */}
        <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div
              onClick={() => toggleSection('depth')}
              className="flex items-center gap-2 cursor-pointer flex-1"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white">Depth-Aware Parallax</span>
              {openSections.depth ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              )}
            </div>
            <input
              type="checkbox"
              checked={sonic.depth.enabled}
              onChange={(e) =>
                updateSonic((prev) => ({
                  ...prev,
                  enabled: e.target.checked ? true : prev.enabled,
                  depth: { ...prev.depth, enabled: e.target.checked },
                }))
              }
              className="w-4 h-4 accent-emerald-400 rounded cursor-pointer"
            />
          </div>

          {openSections.depth && (
            <div className="space-y-3 pt-2 border-t border-white/5">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Parallax Depth Intensity</span>
                  <span className="font-mono text-emerald-400">{sonic.depth.intensity}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={sonic.depth.intensity}
                  onChange={(e) =>
                    updateSonic((prev) => ({
                      ...prev,
                      depth: { ...prev.depth, intensity: parseInt(e.target.value) },
                    }))
                  }
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">Custom Background Plane</div>
                  <div className="text-[10px] text-slate-400">
                    {sonic.depth.customBackgroundUrl ? 'Loaded' : 'Optional separate depth background'}
                  </div>
                </div>
                <button
                  onClick={() => bgInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-800 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-950/50"
                >
                  {sonic.depth.customBackgroundUrl ? 'Replace' : 'Upload'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MODULE E: MUSIC-REACTIVE ENGINE (WITH EXPONENTIAL SMOOTHNESS) */}
        <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div
              onClick={() => toggleSection('reactive')}
              className="flex items-center gap-2 cursor-pointer flex-1"
            >
              <Activity className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-bold text-white">Music-Reactive Camera Engine</span>
              {openSections.reactive ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              )}
            </div>
            <input
              type="checkbox"
              checked={sonic.musicReactive.enabled}
              onChange={(e) =>
                updateSonic((prev) => ({
                  ...prev,
                  enabled: e.target.checked ? true : prev.enabled,
                  musicReactive: {
                    ...prev.musicReactive,
                    enabled: e.target.checked,
                  },
                }))
              }
              className="w-4 h-4 accent-pink-400 rounded cursor-pointer"
            />
          </div>

          {openSections.reactive && (
            <div className="space-y-3 pt-2 border-t border-white/5">
              {/* Live Audio Energy Meters */}
              <div className="grid grid-cols-4 gap-2 p-2.5 rounded-xl bg-slate-950 border border-white/10">
                <div className="text-center">
                  <div className="text-[9px] font-bold text-pink-400">BASS</div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-pink-500 transition-all duration-75"
                      style={{ width: `${Math.min(100, liveBands.bass * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] font-bold text-violet-400">MIDS</div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-violet-500 transition-all duration-75"
                      style={{ width: `${Math.min(100, liveBands.mid * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] font-bold text-cyan-400">TREBLE</div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-75"
                      style={{ width: `${Math.min(100, liveBands.treble * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] font-bold text-amber-400">ENERGY</div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-amber-500 transition-all duration-75"
                      style={{ width: `${Math.min(100, liveBands.overall * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Crucial Smoothness Slider */}
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-pink-500/20">
                <div className="flex justify-between text-[11px] font-bold text-white mb-1">
                  <span className="flex items-center gap-1 text-pink-300">
                    <Zap className="w-3 h-3" />
                    <span>Anti-Jitter Exponential Smoothness</span>
                  </span>
                  <span className="font-mono text-pink-400">
                    {(sonic.musicReactive.smoothness * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">
                  Controls exponential interpolation to guarantee silky cinematic motion without abrupt jumps.
                </p>
                <input
                  type="range"
                  min="0.50"
                  max="0.98"
                  step="0.01"
                  value={sonic.musicReactive.smoothness}
                  onChange={(e) =>
                    updateSonic((prev) => ({
                      ...prev,
                      musicReactive: {
                        ...prev.musicReactive,
                        smoothness: parseFloat(e.target.value),
                      },
                    }))
                  }
                  className="w-full accent-pink-400 cursor-pointer"
                />
              </div>

              {/* Master Reactivity */}
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Master Music Sensitivity</span>
                  <span className="font-mono text-pink-400">
                    {sonic.musicReactive.masterReactivity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={sonic.musicReactive.masterReactivity}
                  onChange={(e) =>
                    updateSonic((prev) => ({
                      ...prev,
                      musicReactive: {
                        ...prev.musicReactive,
                        masterReactivity: parseInt(e.target.value),
                      },
                    }))
                  }
                  className="w-full accent-pink-400 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* MODULE F: DYNAMIC CAMERA PATH & KEYFRAMES */}
        <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div
              onClick={() => toggleSection('path')}
              className="flex items-center gap-2 cursor-pointer flex-1"
            >
              <Film className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold text-white">Music-Directed Camera Path</span>
              {openSections.path ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              )}
            </div>
            <input
              type="checkbox"
              checked={sonic.cameraPath.enabled}
              onChange={(e) =>
                updateSonic((prev) => ({
                  ...prev,
                  enabled: e.target.checked ? true : prev.enabled,
                  cameraPath: { ...prev.cameraPath, enabled: e.target.checked },
                }))
              }
              className="w-4 h-4 accent-teal-400 rounded cursor-pointer"
            />
          </div>

          {openSections.path && (
            <div className="space-y-3 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Keyframes ({sonic.cameraPath.keyframes.length})
                </span>
                <button
                  onClick={handleAddKeyframe}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 hover:bg-teal-500/30 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add at {formatSec(currentTime)}</span>
                </button>
              </div>

              {/* Keyframe List */}
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                {sonic.cameraPath.keyframes.map((kf, i) => (
                  <div
                    key={kf.id}
                    className="p-2 rounded-lg bg-slate-950 border border-white/5 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-teal-400 font-bold">#{i + 1}</span>
                      <span className="text-white">{formatSec(kf.timeSec)}</span>
                      <span className="text-slate-400">zoom {kf.zoom.toFixed(2)}x</span>
                    </div>
                    <button
                      onClick={() => handleDeleteKeyframe(kf.id)}
                      className="text-slate-500 hover:text-red-400 p-1"
                      title="Delete keyframe"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
