/**
 * IndiaTools — SonicCam
 * Beat-Synced Multi-Region Cinematic Photo Studio Panel
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
  Grid,
  Scissors,
  Music,
  Radio,
  Clock,
  Sparkle,
} from 'lucide-react'
import {
  StudioCompositionConfig,
  NormalizedAudioBands,
} from '../../lib/audioToVideo/types'
import {
  SonicCamStudioConfig,
  DEFAULT_SONIC_CAM_CONFIG,
  ImageRegion,
  BeatMarker,
  SonicCamPresetMetadata,
  RegionLayoutMode,
  SequencerMode,
  NoBeatBehavior,
  SonicTransitionType,
  InnerMotionMode,
} from '../../lib/sonicCam/sonicCamTypes'
import {
  SONIC_CAM_PRESETS,
  getSonicCamPreset,
} from '../../lib/sonicCam/sonicCamPresets'
import { generateAutoRegions } from '../../lib/sonicCam/sonicCamRegionGenerator'
import { sonicCamBeatDetector } from '../../lib/sonicCam/sonicCamBeatDetector'
import { sonicCamEngine } from '../../lib/sonicCam/sonicCamEngine'

interface SonicCamStudioPanelProps {
  composition: StudioCompositionConfig
  setComposition: React.Dispatch<React.SetStateAction<StudioCompositionConfig>>
  liveBands: NormalizedAudioBands
  currentTime: number
  duration: number
  audioUrl?: string | null
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void
  onSelectPresetModal: (preset: SonicCamPresetMetadata) => void
}

export const SonicCamStudioPanel: React.FC<SonicCamStudioPanelProps> = ({
  composition,
  setComposition,
  liveBands,
  currentTime,
  duration,
  audioUrl,
  showToast,
  onSelectPresetModal,
}) => {
  const sonic = composition.sonicCam3d || DEFAULT_SONIC_CAM_CONFIG

  const photoInputRef = useRef<HTMLInputElement | null>(null)
  const jsonInputRef = useRef<HTMLInputElement | null>(null)

  // Accordion collapse states
  const [openSections, setOpenSections] = useState({
    regions: true,
    beats: true,
    sequencer: true,
    transitions: false,
    bassShake: false,
    innerMotion: false,
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const [isAnalyzingBeats, setIsAnalyzingBeats] = useState<boolean>(false)

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

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
    const initialRegions = generateAutoRegions(sonic.layoutMode || 'cinematic-grid', sonic.regionCount || 6)

    setComposition((prev) => ({
      ...prev,
      sonicCam3d: {
        ...(prev.sonicCam3d || DEFAULT_SONIC_CAM_CONFIG),
        sourceImageUrl: url,
        regions: initialRegions,
      },
      background: {
        ...prev.background,
        singleImageUrl: url,
      },
    }))
    showToast(`Loaded photograph & generated ${initialRegions.length} visual regions`, 'success')
  }

  const handleRegenerateRegions = (mode?: RegionLayoutMode, count?: number) => {
    const targetMode = mode || sonic.layoutMode || 'cinematic-grid'
    const targetCount = count || sonic.regionCount || 6
    const newRegions = generateAutoRegions(targetMode, targetCount)

    updateSonic((prev) => ({
      ...prev,
      layoutMode: targetMode,
      regionCount: targetCount,
      regions: newRegions,
      selectedRegionId: null,
    }))
    showToast(`Generated ${newRegions.length} regions (${targetMode.replace('-', ' ')})`, 'success')
  }

  const handleAddManualRegion = () => {
    const newId = `reg-${Date.now().toString().slice(-4)}`
    const newRegion: ImageRegion = {
      id: newId,
      label: `Region ${sonic.regions.length + 1}`,
      x: 0.25,
      y: 0.25,
      width: 0.5,
      height: 0.5,
      color: '#00F0FF',
    }

    updateSonic((prev) => ({
      ...prev,
      regions: [...prev.regions, newRegion],
      selectedRegionId: newId,
    }))
    showToast('Added manual region (0.5x0.5)', 'info')
  }

  const handleDeleteRegion = (id: string) => {
    updateSonic((prev) => ({
      ...prev,
      regions: prev.regions.filter((r) => r.id !== id),
      selectedRegionId: prev.selectedRegionId === id ? null : prev.selectedRegionId,
    }))
    showToast('Region deleted', 'info')
  }

  // Audio Beat Analysis Handler
  const handleAnalyzeBeats = async () => {
    setIsAnalyzingBeats(true)
    showToast('Analyzing audio rhythm & transient peaks...', 'info')

    try {
      const audioSource = audioUrl || '/audio/default-studio-track.mp3'
      const detected = await sonicCamBeatDetector.analyzeAudio(audioSource, sonic.beatDetection)

      updateSonic((prev) => ({
        ...prev,
        beatMarkers: detected,
      }))
      showToast(`Detected ${detected.length} rhythmic beat markers!`, 'success')
    } catch {
      showToast('Could not analyze audio buffer, using tempo rhythm fallback', 'info')
    } finally {
      setIsAnalyzingBeats(false)
    }
  }

  const handleAddBeatAtCurrentTime = () => {
    const time = Math.round(currentTime * 100) / 100
    const newMarker: BeatMarker = {
      id: `beat-manual-${Date.now()}`,
      timeSec: time,
      strength: 1.0,
      isManual: true,
    }

    updateSonic((prev) => {
      const existing = prev.beatMarkers || []
      const updated = [...existing, newMarker].sort((a, b) => a.timeSec - b.timeSec)
      return {
        ...prev,
        beatMarkers: updated,
      }
    })
    showToast(`Added beat marker at ${formatSec(currentTime)}`, 'success')
  }

  const handleClearBeats = () => {
    updateSonic((prev) => ({ ...prev, beatMarkers: [] }))
    showToast('Cleared all beat markers', 'info')
  }

  const handleResetAll = () => {
    updateSonic((prev) => ({
      ...DEFAULT_SONIC_CAM_CONFIG,
      sourceImageUrl: prev.sourceImageUrl || composition.background.singleImageUrl || null,
      regions: prev.regions.length > 0 ? prev.regions : generateAutoRegions('cinematic-grid', 6),
    }))
    sonicCamEngine.reset()
    showToast('Reset all SonicCam effects to clean neutral', 'info')
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
    a.download = `soniccam-beat-regions-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Exported SonicCam region layout & sequence JSON', 'success')
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
          showToast('Imported SonicCam settings JSON successfully', 'success')
        }
      } catch {
        showToast('Invalid JSON file format', 'error')
      }
    }
    reader.readAsText(file)
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
              SonicCam — Beat-Synced Multi-Region Studio
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
            Cut between multiple photographic regions in rhythm with music • Works with any photo
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
            title="Toggle Before / After (Temporary clean full-photo comparison)"
          >
            {sonic.isBeforeActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{sonic.isBeforeActive ? 'Before (Full Image)' : 'Compare'}</span>
          </button>

          <button
            onClick={handleExportJson}
            className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-sky-300 transition-all"
            title="Export Region Layout & Sequence JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => jsonInputRef.current?.click()}
            className="p-1.5 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-sky-300 transition-all"
            title="Import Region Layout JSON"
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
            <span className="text-[11px] font-bold text-slate-300">SonicCam</span>
            <input
              type="checkbox"
              checked={sonic.enabled}
              onChange={handleToggleMaster}
              className="w-4 h-4 accent-sky-400 rounded cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* 1. Photograph Media */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Aperture className="w-3.5 h-3.5 text-sky-400" />
            <span>Master Photograph</span>
          </label>
          <span className="text-[10px] text-slate-500">Works with landscapes, cars, people, cities, objects</span>
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
                Upload Any Photograph
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                PNG, JPEG, WebP • Regions will be generated dynamically
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
                  Master Photograph Loaded
                </div>
                <div className="text-[10px] text-sky-400 font-mono mt-0.5">
                  {sonic.regions.length} visual regions active
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
                onClick={() => updateSonic((prev) => ({ ...prev, sourceImageUrl: null, regions: [] }))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 bg-slate-800/60 border border-white/10"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Curated Presets Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-sky-400" />
            <span>9 Curated SonicCam Presets</span>
          </label>
          <span className="text-[10px] text-slate-500">Explicit 1-click selection</span>
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

      {/* 3. Visual Regions Editor Accordion */}
      <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div
            onClick={() => toggleSection('regions')}
            className="flex items-center gap-2 cursor-pointer flex-1"
          >
            <Grid className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold text-white">Visual Image Regions ({sonic.regions.length})</span>
            {openSections.regions ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            )}
          </div>
          <button
            onClick={() =>
              updateSonic((prev) => ({
                ...prev,
                showRegionBoundsInPreview: !prev.showRegionBoundsInPreview,
              }))
            }
            className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
              sonic.showRegionBoundsInPreview
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                : 'bg-slate-900 text-slate-400 border border-white/5'
            }`}
            title="Toggle region boundary lines in the preview canvas (never included in exported video)"
          >
            <Eye className="w-3 h-3" />
            <span>{sonic.showRegionBoundsInPreview ? 'Outlines: ON' : 'Outlines: OFF'}</span>
          </button>
        </div>

        {openSections.regions && (
          <div className="space-y-3 pt-2 border-t border-white/5">
            {/* Region Count & Layout Selector Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Region Count:</span>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg">
                  {[4, 6, 9, 12, 16].map((cnt) => (
                    <button
                      key={cnt}
                      onClick={() => handleRegenerateRegions(sonic.layoutMode, cnt)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sonic.regionCount === cnt
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Layout Mode:</span>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg">
                  {(
                    [
                      { id: 'cinematic-grid', label: 'Cinematic' },
                      { id: 'uniform-grid', label: 'Uniform' },
                      { id: 'random-rectangles', label: 'Random' },
                      { id: 'manual', label: 'Manual' },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleRegenerateRegions(m.id, sonic.regionCount)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sonic.layoutMode === m.id
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => handleRegenerateRegions(sonic.layoutMode, sonic.regionCount)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 hover:bg-sky-500/30 flex items-center gap-1.5"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Generate Regions</span>
                </button>

                <button
                  onClick={handleAddManualRegion}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 border border-white/10 text-slate-300 hover:text-white flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Manual</span>
                </button>
              </div>
            </div>

            {/* Region Cards List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[160px] overflow-y-auto pr-1">
              {sonic.regions.map((reg) => (
                <div
                  key={reg.id}
                  onClick={() => updateSonic((prev) => ({ ...prev, selectedRegionId: reg.id }))}
                  className={`p-2 rounded-xl bg-slate-950 border cursor-pointer transition-all flex items-center justify-between text-xs ${
                    sonic.selectedRegionId === reg.id
                      ? 'border-sky-400 bg-sky-950/20 text-white'
                      : 'border-white/5 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: reg.color }}
                    />
                    <span className="truncate text-[11px] font-bold">{reg.label}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteRegion(reg.id)
                    }}
                    className="p-1 text-slate-500 hover:text-red-400"
                    title="Delete region"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Real Audio Beat Detection Accordion */}
      <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div
            onClick={() => toggleSection('beats')}
            className="flex items-center gap-2 cursor-pointer flex-1"
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white">Audio Beat Synchronizer</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              {sonic.beatMarkers.length} beats
            </span>
            {openSections.beats ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            )}
          </div>
        </div>

        {openSections.beats && (
          <div className="space-y-3 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <button
                onClick={handleAnalyzeBeats}
                disabled={isAnalyzingBeats}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-sky-600 text-white hover:brightness-110 flex items-center gap-1.5 shadow"
              >
                <Radio className={`w-3.5 h-3.5 ${isAnalyzingBeats ? 'animate-spin' : ''}`} />
                <span>{isAnalyzingBeats ? 'Analyzing Audio...' : 'Analyze Audio Beats'}</span>
              </button>

              <button
                onClick={handleAddBeatAtCurrentTime}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 border border-white/10 text-slate-300 hover:text-white flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Beat at {formatSec(currentTime)}</span>
              </button>

              {sonic.beatMarkers.length > 0 && (
                <button
                  onClick={handleClearBeats}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 bg-slate-900 border border-white/10"
                  title="Clear all beats"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Sensitivity</span>
                  <span className="font-mono text-cyan-400">{sonic.beatDetection.sensitivity}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="95"
                  value={sonic.beatDetection.sensitivity}
                  onChange={(e) =>
                    updateSonic((prev) => ({
                      ...prev,
                      beatDetection: {
                        ...prev.beatDetection,
                        sensitivity: parseInt(e.target.value),
                      },
                    }))
                  }
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Min Beat Spacing</span>
                  <span className="font-mono text-cyan-400">
                    {sonic.beatDetection.minIntervalSec.toFixed(2)}s
                  </span>
                </div>
                <input
                  type="range"
                  min="0.20"
                  max="1.20"
                  step="0.05"
                  value={sonic.beatDetection.minIntervalSec}
                  onChange={(e) =>
                    updateSonic((prev) => ({
                      ...prev,
                      beatDetection: {
                        ...prev.beatDetection,
                        minIntervalSec: parseFloat(e.target.value),
                      },
                    }))
                  }
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Sequencer & No-Beat Behavior Accordion */}
      <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div
            onClick={() => toggleSection('sequencer')}
            className="flex items-center gap-2 cursor-pointer flex-1"
          >
            <Clock className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-bold text-white">Shot Sequencer & No-Beat Mode</span>
            {openSections.sequencer ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            )}
          </div>
        </div>

        {openSections.sequencer && (
          <div className="space-y-3 pt-2 border-t border-white/5">
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400">Sequencer Cutting Mode:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg text-center">
                {(
                  [
                    { id: 'beat-driven', label: 'Beat-Driven' },
                    { id: 'every-n-beats', label: 'Every N Beats' },
                    { id: 'sequential', label: 'Sequential' },
                    { id: 'random', label: 'Random Shuffle' },
                    { id: 'energy-driven', label: 'Energy-Driven' },
                  ] as const
                ).map((sm) => (
                  <button
                    key={sm.id}
                    onClick={() => updateSonic((prev) => ({ ...prev, sequencerMode: sm.id }))}
                    className={`px-2 py-1 rounded text-[10px] font-bold ${
                      sonic.sequencerMode === sm.id
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                        : 'text-slate-400'
                    }`}
                  >
                    {sm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Essential Requirement: No-Beat Behavior */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-300">
                No-Beat Behavior (In Quiet Sections or Inactivity):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                {(
                  [
                    { id: 'show-full-image', label: '1. Show Full Image' },
                    { id: 'hold-current-region', label: '2. Hold Current Region' },
                    { id: 'return-full-smooth', label: '3. Return Full Smooth' },
                  ] as const
                ).map((nb) => (
                  <button
                    key={nb.id}
                    onClick={() => updateSonic((prev) => ({ ...prev, noBeatBehavior: nb.id }))}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-left transition-all ${
                      sonic.noBeatBehavior === nb.id
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {nb.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Full Image Every N Shots</span>
                  <span className="font-mono text-violet-400">
                    {sonic.fullImageEveryNShots === 0 ? 'Disabled' : `Every ${sonic.fullImageEveryNShots} shots`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={sonic.fullImageEveryNShots}
                  onChange={(e) =>
                    updateSonic((prev) => ({
                      ...prev,
                      fullImageEveryNShots: parseInt(e.target.value),
                    }))
                  }
                  className="w-full accent-violet-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Beat Interval (N Beats)</span>
                  <span className="font-mono text-violet-400">{sonic.beatInterval} Beats</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={sonic.beatInterval}
                  onChange={(e) =>
                    updateSonic((prev) => ({
                      ...prev,
                      beatInterval: parseInt(e.target.value),
                    }))
                  }
                  className="w-full accent-violet-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. Cinematic Transitions Accordion */}
      <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div
            onClick={() => toggleSection('transitions')}
            className="flex items-center gap-2 cursor-pointer flex-1"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white">Cinematic Shot Transitions</span>
            {openSections.transitions ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            )}
          </div>
        </div>

        {openSections.transitions && (
          <div className="space-y-3 pt-2 border-t border-white/5">
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400">Transition Style:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-white/5 text-center">
                {(
                  [
                    { id: 'instant-cut', label: 'Instant Cut', icon: '⚡' },
                    { id: 'snap-zoom', label: 'Snap Zoom', icon: '🔍' },
                    { id: 'smooth-zoom-cut', label: 'Smooth Zoom', icon: '🌊' },
                    { id: 'whip-pan', label: 'Whip Pan', icon: '↔️' },
                    { id: 'vertical-drop', label: 'Vertical Drop', icon: '⬇️' },
                    { id: 'directional-slide', label: 'Slide Cut', icon: '↗️' },
                    { id: 'flash-cut', label: 'Flash Cut', icon: '💥' },
                    { id: 'crossfade', label: 'Crossfade', icon: '🌫️' },
                    { id: 'glitch-rgb', label: 'Glitch RGB', icon: '👾' },
                    { id: 'spin-twist', label: 'Spin Vortex', icon: '🌀' },
                    { id: 'bass-shockwave', label: 'Bass Shock', icon: '🔊' },
                    { id: 'film-burn', label: 'Film Burn', icon: '🔥' },
                    { id: 'zoom-through', label: 'Hyper Zoom', icon: '🚀' },
                    { id: 'strobe-shutter', label: 'Strobe Shutter', icon: '⚡' },
                    { id: 'prism-split', label: 'Prism Split', icon: '💎' },
                  ] as const
                ).map((tr) => (
                  <button
                    key={tr.id}
                    onClick={() => updateSonic((prev) => ({ ...prev, transition: tr.id }))}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      sonic.transition === tr.id
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-400/50 shadow-md shadow-amber-500/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span>{tr.icon}</span>
                    <span>{tr.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Transition Duration</span>
                <span className="font-mono text-amber-400">
                  {sonic.transitionDurationSec.toFixed(2)}s
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.60"
                step="0.02"
                value={sonic.transitionDurationSec}
                onChange={(e) =>
                  updateSonic((prev) => ({
                    ...prev,
                    transitionDurationSec: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* 7. Bass-Reactive Micro-Shake Accordion */}
      <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div
            onClick={() => toggleSection('bassShake')}
            className="flex items-center gap-2 cursor-pointer flex-1"
          >
            <Zap className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-bold text-white">Bass-Reactive Micro-Shake</span>
            {openSections.bassShake ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            )}
          </div>
          <input
            type="checkbox"
            checked={sonic.bassShake.enabled}
            onChange={(e) =>
              updateSonic((prev) => ({
                ...prev,
                enabled: e.target.checked ? true : prev.enabled,
                bassShake: { ...prev.bassShake, enabled: e.target.checked },
              }))
            }
            className="w-4 h-4 accent-pink-400 rounded cursor-pointer"
          />
        </div>

        {openSections.bassShake && (
          <div className="space-y-3 pt-2 border-t border-white/5">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Shake Intensity</span>
                  <span className="font-mono text-pink-400">{sonic.bassShake.intensity}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={sonic.bassShake.intensity}
                  onChange={(e) =>
                    updateSonic((prev) => ({
                      ...prev,
                      bassShake: {
                        ...prev.bassShake,
                        intensity: parseInt(e.target.value),
                      },
                    }))
                  }
                  className="w-full accent-pink-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Max Displacement</span>
                  <span className="font-mono text-pink-400">{sonic.bassShake.maxDisplacementPx} px</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="35"
                  value={sonic.bassShake.maxDisplacementPx}
                  onChange={(e) =>
                    updateSonic((prev) => ({
                      ...prev,
                      bassShake: {
                        ...prev.bassShake,
                        maxDisplacementPx: parseInt(e.target.value),
                      },
                    }))
                  }
                  className="w-full accent-pink-400 cursor-pointer"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={sonic.bassShake.zoomImpulseEnabled}
                onChange={(e) =>
                  updateSonic((prev) => ({
                    ...prev,
                    bassShake: {
                      ...prev.bassShake,
                      zoomImpulseEnabled: e.target.checked,
                    },
                  }))
                }
                className="accent-pink-400 rounded cursor-pointer"
              />
              <span>Brief Zoom Impulse on Heavy Kicks</span>
            </label>
          </div>
        )}
      </div>

      {/* 8. Inner Camera Motion Accordion */}
      <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div
            onClick={() => toggleSection('innerMotion')}
            className="flex items-center gap-2 cursor-pointer flex-1"
          >
            <Move className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white">Inner Region Camera Motion</span>
            {openSections.innerMotion ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            )}
          </div>
          <input
            type="checkbox"
            checked={sonic.innerMotion.enabled}
            onChange={(e) =>
              updateSonic((prev) => ({
                ...prev,
                enabled: e.target.checked ? true : prev.enabled,
                innerMotion: { ...prev.innerMotion, enabled: e.target.checked },
              }))
            }
            className="w-4 h-4 accent-emerald-400 rounded cursor-pointer"
          />
        </div>

        {openSections.innerMotion && (
          <div className="space-y-3 pt-2 border-t border-white/5">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Motion Mode:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg">
                {(
                  [
                    { id: 'subtle-push', label: 'Subtle Push' },
                    { id: 'subtle-drift', label: 'Drift' },
                    { id: 'handheld', label: 'Handheld' },
                  ] as const
                ).map((im) => (
                  <button
                    key={im.id}
                    onClick={() =>
                      updateSonic((prev) => ({
                        ...prev,
                        innerMotion: { ...prev.innerMotion, mode: im.id },
                      }))
                    }
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      sonic.innerMotion.mode === im.id
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-400'
                    }`}
                  >
                    {im.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Motion Intensity</span>
                <span className="font-mono text-emerald-400">{sonic.innerMotion.intensity}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                value={sonic.innerMotion.intensity}
                onChange={(e) =>
                  updateSonic((prev) => ({
                    ...prev,
                    innerMotion: {
                      ...prev.innerMotion,
                      intensity: parseInt(e.target.value),
                    },
                  }))
                }
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
