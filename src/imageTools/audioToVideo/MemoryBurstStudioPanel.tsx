/**
 * IndiaTools — Memory Burst Studio Panel
 * Multi-Photo Music Beat-Synchronized Cinematic Photo Cutting Studio
 */

import React, { useRef, useState, useEffect } from 'react'
import {
  Upload,
  Plus,
  Trash2,
  Shuffle,
  Zap,
  Sliders,
  SlidersHorizontal,
  Layers,
  Sparkles,
  Activity,
  Eye,
  EyeOff,
  MoveLeft,
  MoveRight,
  Music,
  Clock,
  RotateCcw,
  Film,
  Camera,
  CheckCircle2,
  RefreshCw,
  Rewind,
  FastForward,
  Gauge,
  Flame,
  ArrowRight,
  Bookmark,
} from 'lucide-react'
import {
  StudioCompositionConfig,
  NormalizedAudioBands,
} from '../../lib/audioToVideo/types'
import {
  MemoryBurstPhoto,
  MemoryBurstMode,
  MemoryBurstTransitionStyle,
  MemoryBurstPhotoOrder,
  MemoryBurstRhythmZoomConfig,
  MemoryBurstStudioConfig,
  DEFAULT_MEMORY_BURST_CONFIG,
} from '../../lib/memoryBurst/memoryBurstTypes'
import {
  MEMORY_BURST_PRESETS,
  applyMemoryBurstPreset,
} from '../../lib/memoryBurst/memoryBurstPresets'
import { memoryBurstEngine } from '../../lib/memoryBurst/memoryBurstEngine'
import { memoryBurstBeatDetector } from '../../lib/memoryBurst/memoryBurstBeatDetector'

interface MemoryBurstStudioPanelProps {
  composition: StudioCompositionConfig
  setComposition: React.Dispatch<React.SetStateAction<StudioCompositionConfig>>
  liveBands: NormalizedAudioBands
  currentTime: number
  duration: number
  audioUrl?: string | null
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void
}

export const MemoryBurstStudioPanel: React.FC<MemoryBurstStudioPanelProps> = ({
  composition,
  setComposition,
  liveBands,
  currentTime,
  duration,
  audioUrl,
  showToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const replaceInputRef = useRef<HTMLInputElement | null>(null)
  const [photoToReplaceId, setPhotoToReplaceId] = useState<string | null>(null)
  const [draggedPhotoIndex, setDraggedPhotoIndex] = useState<number | null>(null)

  const config: MemoryBurstStudioConfig =
    composition.memoryBurst || DEFAULT_MEMORY_BURST_CONFIG
  const climax = config.climax || DEFAULT_MEMORY_BURST_CONFIG.climax

  const [isAnalyzingBeats, setIsAnalyzingBeats] = useState<boolean>(false)
  const lastAnalyzedUrlRef = useRef<string | null>(null)

  const updateConfig = (updater: (prev: MemoryBurstStudioConfig) => MemoryBurstStudioConfig) => {
    setComposition((prev) => ({
      ...prev,
      memoryBurst: updater(prev.memoryBurst || DEFAULT_MEMORY_BURST_CONFIG),
    }))
  }

  // Audio Rhythm Beat Analysis Handler
  const handleAnalyzeBeats = async (force: boolean = false) => {
    const audioSource = audioUrl || '/audio/default-studio-track.mp3'
    if (!audioSource) return
    if (!force && lastAnalyzedUrlRef.current === audioSource && (config.beatMarkers?.length || 0) > 0) {
      return
    }

    setIsAnalyzingBeats(true)
    showToast('Analyzing audio rhythm & transient beat peaks...', 'info')

    try {
      const markers = await memoryBurstBeatDetector.analyzeAudio(
        audioSource,
        config.beatSensitivity || 65,
        config.minCutIntervalSec || 0.25
      )

      lastAnalyzedUrlRef.current = audioSource

      updateConfig((prev) => ({
        ...prev,
        beatMarkers: markers,
      }))

      showToast(`Detected ${markers.length} rhythmic beats! Photo cuts synced to music.`, 'success')
    } catch {
      showToast('Audio decoding fallback: generated rhythmic musical tempo beats', 'info')
    } finally {
      setIsAnalyzingBeats(false)
    }
  }

  // Automatic Audio Beat Analysis on Load or Audio Track Change
  useEffect(() => {
    const audioSource = audioUrl || '/audio/default-studio-track.mp3'
    if (audioSource && (lastAnalyzedUrlRef.current !== audioSource || (config.beatMarkers?.length || 0) === 0)) {
      handleAnalyzeBeats(false)
    }
  }, [audioUrl])

  // Handle Multi-Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newPhotos: MemoryBurstPhoto[] = []
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      newPhotos.push({
        id: `photo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        url,
        name: file.name,
        durationSec: config.defaultPhotoDurationSec || 1.5,
      })
    })

    updateConfig((prev) => ({
      ...prev,
      enabled: true,
      photos: [...prev.photos, ...newPhotos],
    }))

    showToast(`Added ${newPhotos.length} photo${newPhotos.length > 1 ? 's' : ''}`, 'success')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Handle Replace Photo
  const handleReplacePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !photoToReplaceId) return

    const newUrl = URL.createObjectURL(file)
    updateConfig((prev) => {
      const target = prev.photos.find((p) => p.id === photoToReplaceId)
      if (target?.url) {
        memoryBurstEngine.revokeUrl(target.url)
      }
      return {
        ...prev,
        photos: prev.photos.map((p) =>
          p.id === photoToReplaceId
            ? { ...p, url: newUrl, name: file.name }
            : p
        ),
      }
    })

    setPhotoToReplaceId(null)
    showToast('Photo replaced successfully', 'success')
    if (replaceInputRef.current) replaceInputRef.current.value = ''
  }

  // Remove Photo
  const handleRemovePhoto = (id: string) => {
    updateConfig((prev) => {
      const target = prev.photos.find((p) => p.id === id)
      if (target?.url) {
        memoryBurstEngine.revokeUrl(target.url)
      }
      return {
        ...prev,
        photos: prev.photos.filter((p) => p.id !== id),
      }
    })
    showToast('Photo removed', 'info')
  }

  // Clear All Photos
  const handleClearAllPhotos = () => {
    if (config.photos.length === 0) return
    config.photos.forEach((p) => memoryBurstEngine.revokeUrl(p.url))
    updateConfig((prev) => ({
      ...prev,
      photos: [],
    }))
    showToast('Cleared all photos', 'info')
  }

  // Move Photo Left/Right
  const handleMovePhoto = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= config.photos.length) return

    const updated = [...config.photos]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp

    updateConfig((prev) => ({
      ...prev,
      photos: updated,
    }))
  }

  // Shuffle Photos
  const handleShufflePhotos = () => {
    if (config.photos.length <= 1) return
    const shuffled = [...config.photos].sort(() => Math.random() - 0.5)
    updateConfig((prev) => ({
      ...prev,
      photos: shuffled,
    }))
    showToast('Photos shuffled randomly', 'info')
  }

  // Add Manual Beat Marker at Current Playhead
  const handleAddBeatMarker = () => {
    const markerTime = Number(currentTime.toFixed(2))
    updateConfig((prev) => ({
      ...prev,
      beatMarkers: [
        ...prev.beatMarkers.filter((m) => Math.abs(m.timeSec - markerTime) > 0.05),
        {
          id: `bm_${Date.now()}`,
          timeSec: markerTime,
          strength: 1.0,
        },
      ].sort((a, b) => a.timeSec - b.timeSec),
    }))
    showToast(`Added beat marker at ${markerTime.toFixed(2)}s`, 'success')
  }

  // Clear Beat Markers
  const handleClearBeatMarkers = () => {
    updateConfig((prev) => ({
      ...prev,
      beatMarkers: [],
    }))
    showToast('Cleared manual beat markers', 'info')
  }

  // Drag and drop photo reorder
  const handleDragStart = (index: number) => {
    setDraggedPhotoIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedPhotoIndex === null || draggedPhotoIndex === index) return

    const reordered = [...config.photos]
    const [moved] = reordered.splice(draggedPhotoIndex, 1)
    reordered.splice(index, 0, moved)

    setDraggedPhotoIndex(index)
    updateConfig((prev) => ({
      ...prev,
      photos: reordered,
    }))
  }

  const handleDragEnd = () => {
    setDraggedPhotoIndex(null)
  }

  const MODES: { id: MemoryBurstMode; label: string; desc: string }[] = [
    { id: 'memory-rewind', label: 'Memory Rewind', desc: 'BKU Climax accelerating memory montage with flashback rewind' },
    { id: 'beat-sync', label: 'Beat Sync', desc: 'Cuts sharply on energetic musical beat onsets' },
    { id: 'fast-cut', label: 'Fast Cut', desc: 'Rapid dynamic cuts across close intervals' },
    { id: 'memory-burst', label: 'Memory Burst', desc: 'Accelerating burst clusters of memories' },
    { id: 'every-2-beats', label: 'Every 2 Beats', desc: 'Steady cadence cutting every 2 beats' },
    { id: 'every-4-beats', label: 'Every 4 Beats', desc: 'Full measure cutting every 4 beats' },
    { id: 'manual-timing', label: 'Manual Timing', desc: 'Fixed custom duration per photo' },
    { id: 'auto-rhythm', label: 'Auto Rhythm', desc: 'Smooth mathematical rhythm cycling' },
  ]

  const TRANSITIONS: { id: MemoryBurstTransitionStyle; label: string }[] = [
    { id: 'instant-cut', label: 'Instant Cut' },
    { id: 'smooth-crossfade', label: 'Smooth Crossfade' },
    { id: 'fade-wipe', label: 'Fade Wipe' },
    { id: 'short-flash', label: 'Short Flash' },
    { id: 'scale-punch', label: 'Scale Punch' },
    { id: 'whip-pan', label: 'Whip Pan' },
    { id: 'glitch-split', label: 'Glitch Split' },
    { id: 'film-burn', label: 'Film Burn' },
    { id: 'random-shuffle', label: 'Random Shuffle' },
  ]

  return (
    <div className="space-y-6 text-slate-200">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*,.jpg,.jpeg,.png,.webp"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={replaceInputRef}
        onChange={handleReplacePhoto}
        accept="image/*,.jpg,.jpeg,.png,.webp"
        className="hidden"
      />

      {/* Header & Master Studio Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-pink-500 p-0.5 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Memory Burst Studio
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                PRO
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Music Beat-Synchronized Multi-Photo Cinematic Montage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Before / After Preview Toggle */}
          <button
            onClick={() =>
              updateConfig((prev) => ({
                ...prev,
                isBeforeActive: !prev.isBeforeActive,
              }))
            }
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              config.isBeforeActive
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white'
            }`}
            title="Toggle Clean Before vs Dynamic Beat After Preview"
          >
            {config.isBeforeActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{config.isBeforeActive ? 'Before (Clean)' : 'After (Dynamic)'}</span>
          </button>

          {/* Master Enable Toggle */}
          <button
            onClick={() =>
              updateConfig((prev) => ({
                ...prev,
                enabled: !prev.enabled,
              }))
            }
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              config.enabled
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{config.enabled ? 'Studio Active' : 'Enable Studio'}</span>
          </button>
        </div>
      </div>

      {/* QUICK PRESETS */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Curated Rhythm Presets</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {MEMORY_BURST_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                updateConfig((prev) => applyMemoryBurstPreset(prev, preset.id))
                showToast(`Applied preset: ${preset.name}`, 'success')
              }}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10 hover:border-rose-500/40 hover:bg-slate-800/60 transition-all text-left group"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm">{preset.icon}</span>
                <span className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                  {preset.name}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* MULTI-PHOTO FILMSTRIP & MANAGEMENT */}
      <div className="space-y-3 bg-slate-900/40 p-4 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-rose-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Photo Filmstrip ({config.photos.length})
            </h4>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 rounded-lg bg-rose-600/30 border border-rose-500/40 hover:bg-rose-600/50 text-rose-200 text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <Plus className="w-3 h-3" />
              <span>Add Photos</span>
            </button>
            {config.photos.length > 1 && (
              <button
                onClick={handleShufflePhotos}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all"
                title="Shuffle Order"
              >
                <Shuffle className="w-3 h-3" />
                <span>Shuffle</span>
              </button>
            )}
            {config.photos.length > 0 && (
              <button
                onClick={handleClearAllPhotos}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1 transition-all"
                title="Clear All"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {config.photos.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/15 hover:border-rose-500/50 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-950/30 hover:bg-slate-900/50 group"
          >
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-white mb-0.5">
              Upload Photos for Beat-Synchronized Montage
            </p>
            <p className="text-[11px] text-slate-400">
              Drag and drop or click to select multiple JPG, PNG, or WebP images
            </p>
          </div>
        ) : (
          /* Thumbnail Filmstrip */
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
            {config.photos.map((photo, index) => (
              <div
                key={photo.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative shrink-0 w-24 h-24 rounded-xl overflow-hidden border transition-all group bg-slate-950 ${
                  draggedPhotoIndex === index
                    ? 'border-rose-400 scale-95 opacity-50'
                    : 'border-white/10 hover:border-rose-500/60'
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-full object-cover"
                />

                {/* Index Pill */}
                <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/70 backdrop-blur-sm rounded text-[9px] font-bold text-white">
                  #{index + 1}
                </span>

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleMovePhoto(index, 'left')}
                      disabled={index === 0}
                      className="p-1 rounded bg-white/10 hover:bg-white/20 text-white disabled:opacity-20"
                      title="Move Left"
                    >
                      <MoveLeft className="w-2.5 h-2.5" />
                    </button>
                    <button
                      onClick={() => handleMovePhoto(index, 'right')}
                      disabled={index === config.photos.length - 1}
                      className="p-1 rounded bg-white/10 hover:bg-white/20 text-white disabled:opacity-20"
                      title="Move Right"
                    >
                      <MoveRight className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        setPhotoToReplaceId(photo.id)
                        replaceInputRef.current?.click()
                      }}
                      className="p-1 rounded bg-white/10 hover:bg-white/20 text-white"
                      title="Replace Photo"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                    </button>
                    <button
                      onClick={() => handleRemovePhoto(photo.id)}
                      className="p-1 rounded bg-rose-500/30 hover:bg-rose-500 text-white"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BKU CLIMAX / MEMORY REWIND WORKSPACE */}
      <div className="space-y-4 bg-gradient-to-b from-rose-950/30 via-slate-900/60 to-slate-950/80 p-4.5 rounded-2xl border border-rose-500/30 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-rose-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 p-0.5 flex items-center justify-center">
              <Rewind className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                BKU Climax / Memory Rewind
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  VIRAL EFFECT
                </span>
              </h4>
              <p className="text-[11px] text-slate-400">
                Emotional accelerating memory montage with flashback rewind & climax hold
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                updateConfig((prev) => applyMemoryBurstPreset(prev, 'memory-rewind-climax'))
                showToast('Activated Memory Rewind Climax Preset!', 'success')
              }}
              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold shadow-md shadow-rose-900/40 flex items-center gap-1.5 transition-all"
            >
              <Rewind className="w-3 h-3" />
              <span>Apply Preset</span>
            </button>

            <button
              onClick={() =>
                updateConfig((prev) => ({
                  ...prev,
                  mode: !prev.climax?.enabled ? 'memory-rewind' : prev.mode,
                  climax: {
                    ...(prev.climax || DEFAULT_MEMORY_BURST_CONFIG.climax),
                    enabled: !prev.climax?.enabled,
                  },
                }))
              }
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                config.climax?.enabled
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                  : 'bg-slate-800 text-slate-400 border border-white/10 hover:text-white'
              }`}
            >
              <span>{config.climax?.enabled ? 'Climax ON' : 'Enable Climax'}</span>
            </button>
          </div>
        </div>

        {/* Climax Timeline Range & Visual Bar */}
        <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span>Climax Window:</span>
              <span className="text-rose-300 font-bold">
                {climax.startSec.toFixed(1)}s → {(climax.startSec + climax.burstDurationSec).toFixed(1)}s
              </span>
              <span className="text-slate-500 text-[10px]">({climax.burstDurationSec.toFixed(1)}s burst)</span>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() =>
                  updateConfig((prev) => ({
                    ...prev,
                    climax: {
                      ...(prev.climax || DEFAULT_MEMORY_BURST_CONFIG.climax),
                      startSec: Number(currentTime.toFixed(1)),
                    },
                  }))
                }
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium"
                title="Set Start Time to Current Playhead"
              >
                Start: {currentTime.toFixed(1)}s
              </button>
            </div>
          </div>

          {/* Visual Track Climax Bar */}
          <div className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/10">
            {/* Climax highlight area */}
            <div
              className="absolute top-0 bottom-0 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 opacity-70"
              style={{
                left: `${Math.min(100, (climax.startSec / (duration || 30)) * 100)}%`,
                width: `${Math.min(100, (climax.burstDurationSec / (duration || 30)) * 100)}%`,
              }}
            />
            {/* Current Playhead indicator */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg shadow-white/50"
              style={{
                left: `${Math.min(100, (currentTime / (duration || 30)) * 100)}%`,
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Climax Start Time</span>
                <span className="text-rose-300 font-bold">{climax.startSec.toFixed(1)}s</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(1, duration - 2)}
                step="0.5"
                value={climax.startSec}
                onChange={(e) =>
                  updateConfig((prev) => ({
                    ...prev,
                    climax: {
                      ...(prev.climax || DEFAULT_MEMORY_BURST_CONFIG.climax),
                      startSec: parseFloat(e.target.value),
                    },
                  }))
                }
                className="w-full h-1.5 bg-slate-800 rounded-lg accent-rose-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Burst Duration</span>
                <span className="text-amber-300 font-bold">{climax.burstDurationSec.toFixed(1)}s</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="20.0"
                step="0.5"
                value={climax.burstDurationSec}
                onChange={(e) =>
                  updateConfig((prev) => ({
                    ...prev,
                    climax: {
                      ...(prev.climax || DEFAULT_MEMORY_BURST_CONFIG.climax),
                      burstDurationSec: parseFloat(e.target.value),
                    },
                  }))
                }
                className="w-full h-1.5 bg-slate-800 rounded-lg accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Photo Sequence Order */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Shuffle className="w-3.5 h-3.5 text-rose-400" />
              <span>Photo Order Sequence</span>
            </span>
            <span className="text-[10px] text-rose-300 font-bold uppercase">
              {climax.photoOrder}
            </span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {[
              { id: 'reverse', label: 'Reverse (Rewind)', desc: 'Flashback from recent to past' },
              { id: 'forward', label: 'Forward', desc: 'Standard sequential order' },
              { id: 'shuffle', label: 'Shuffle', desc: 'Random memory flash' },
              { id: 'custom', label: 'Custom List', desc: 'Current filmstrip order' },
            ].map((ord) => (
              <button
                key={ord.id}
                onClick={() =>
                  updateConfig((prev) => ({
                    ...prev,
                    climax: {
                      ...(prev.climax || DEFAULT_MEMORY_BURST_CONFIG.climax),
                      photoOrder: ord.id as MemoryBurstPhotoOrder,
                    },
                  }))
                }
                className={`p-2 rounded-xl text-left border transition-all ${
                  climax.photoOrder === ord.id
                    ? 'bg-rose-500/25 border-rose-400 text-white shadow-sm'
                    : 'bg-slate-900/50 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">{ord.label}</div>
                <div className="text-[9px] text-slate-400 line-clamp-1">{ord.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Cut Speed & Rhythmic Acceleration */}
        <div className="space-y-3 bg-black/30 p-3 rounded-xl border border-white/5">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Gauge className="w-3 h-3 text-cyan-400" />
                <span>Montage Cut Speed</span>
              </span>
              <span className="text-cyan-300 font-bold">{climax.cutSpeedMultiplier.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={climax.cutSpeedMultiplier}
              onChange={(e) =>
                updateConfig((prev) => ({
                  ...prev,
                  climax: {
                    ...(prev.climax || DEFAULT_MEMORY_BURST_CONFIG.climax),
                    cutSpeedMultiplier: parseFloat(e.target.value),
                  },
                }))
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Acceleration Toggle */}
          <div className="flex items-center justify-between pt-1">
            <div className="text-xs">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Rhythmic Acceleration</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Increases cut frequency progressively toward the climax peak
              </div>
            </div>
            <input
              type="checkbox"
              checked={climax.accelerationEnabled}
              onChange={(e) =>
                updateConfig((prev) => ({
                  ...prev,
                  climax: {
                    ...(prev.climax || DEFAULT_MEMORY_BURST_CONFIG.climax),
                    accelerationEnabled: e.target.checked,
                  },
                }))
              }
              className="w-4 h-4 rounded accent-rose-500 cursor-pointer"
            />
          </div>

          {climax.accelerationEnabled && (
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Acceleration Curve Strength</span>
                <span className="text-amber-300 font-bold">Level {climax.accelerationStrength}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={climax.accelerationStrength}
                onChange={(e) =>
                  updateConfig((prev) => ({
                    ...prev,
                    climax: {
                      ...(prev.climax || DEFAULT_MEMORY_BURST_CONFIG.climax),
                      accelerationStrength: parseInt(e.target.value, 10),
                    },
                  }))
                }
                className="w-full h-1.5 bg-slate-800 rounded-lg accent-amber-500 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Emotional Hold Frames */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-black/30 p-3 rounded-xl border border-white/5">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span className="text-white font-medium">Intro Hold Frame</span>
              <span className="text-slate-300 font-bold">{climax.startHoldSec.toFixed(1)}s</span>
            </div>
            <input
              type="range"
              min="0"
              max="5.0"
              step="0.5"
              value={climax.startHoldSec}
              onChange={(e) =>
                updateConfig((prev) => ({
                  ...prev,
                  climax: {
                    ...(prev.climax || DEFAULT_MEMORY_BURST_CONFIG.climax),
                    startHoldSec: parseFloat(e.target.value),
                  },
                }))
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg accent-rose-500 cursor-pointer"
            />
            <p className="text-[9px] text-slate-500">Hold on start photo before memory burst triggers</p>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span className="text-white font-medium flex items-center gap-1.5">
                <span>Ending Hold Frame</span>
                <input
                  type="checkbox"
                  checked={climax.endingHoldEnabled}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      climax: {
                        ...(prev.climax || DEFAULT_MEMORY_BURST_CONFIG.climax),
                        endingHoldEnabled: e.target.checked,
                      },
                    }))
                  }
                  className="w-3.5 h-3.5 rounded accent-rose-500 cursor-pointer"
                />
              </span>
              <span className="text-slate-300 font-bold">{climax.endHoldSec.toFixed(1)}s</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="8.0"
              step="0.5"
              value={climax.endHoldSec}
              disabled={!climax.endingHoldEnabled}
              onChange={(e) =>
                updateConfig((prev) => ({
                  ...prev,
                  climax: {
                    ...(prev.climax || DEFAULT_MEMORY_BURST_CONFIG.climax),
                    endHoldSec: parseFloat(e.target.value),
                  },
                }))
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg accent-rose-500 cursor-pointer disabled:opacity-30"
            />
            <p className="text-[9px] text-slate-500">Emotional pause on final photo after montage ends</p>
          </div>
        </div>

        {/* Visual Flow & Climax FX Toggles */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Climax Visual Flow & Punch Effects</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Micro Zoom Punch */}
            <button
              onClick={() =>
                updateConfig((prev) => ({
                  ...prev,
                  climax: {
                    ...(prev.climax || DEFAULT_MEMORY_BURST_CONFIG.climax),
                    zoomPunchEnabled: !prev.climax?.zoomPunchEnabled,
                  },
                }))
              }
              className={`p-2.5 rounded-xl border text-left transition-all ${
                climax.zoomPunchEnabled
                  ? 'bg-rose-500/20 border-rose-400 text-white'
                  : 'bg-slate-900/40 border-white/10 text-slate-400'
              }`}
            >
              <div className="text-xs font-bold flex items-center justify-between">
                <span>Zoom Punch</span>
                <span className={`w-2 h-2 rounded-full ${climax.zoomPunchEnabled ? 'bg-rose-400' : 'bg-slate-600'}`} />
              </div>
              <div className="text-[9px] text-slate-400">107% → 100% ease</div>
            </button>

            {/* Flash Cut */}
            <button
              onClick={() =>
                updateConfig((prev) => ({
                  ...prev,
                  climax: {
                    ...(prev.climax || DEFAULT_MEMORY_BURST_CONFIG.climax),
                    flashEnabled: !prev.climax?.flashEnabled,
                  },
                }))
              }
              className={`p-2.5 rounded-xl border text-left transition-all ${
                climax.flashEnabled
                  ? 'bg-rose-500/20 border-rose-400 text-white'
                  : 'bg-slate-900/40 border-white/10 text-slate-400'
              }`}
            >
              <div className="text-xs font-bold flex items-center justify-between">
                <span>Beat Flash</span>
                <span className={`w-2 h-2 rounded-full ${climax.flashEnabled ? 'bg-rose-400' : 'bg-slate-600'}`} />
              </div>
              <div className="text-[9px] text-slate-400">White strobe flash</div>
            </button>

            {/* Fade Wipe */}
            <button
              onClick={() =>
                updateConfig((prev) => ({
                  ...prev,
                  climax: {
                    ...(prev.climax || DEFAULT_MEMORY_BURST_CONFIG.climax),
                    fadeWipeEnabled: !prev.climax?.fadeWipeEnabled,
                    crossfadeEnabled: false,
                  },
                }))
              }
              className={`p-2.5 rounded-xl border text-left transition-all ${
                climax.fadeWipeEnabled
                  ? 'bg-rose-500/20 border-rose-400 text-white'
                  : 'bg-slate-900/40 border-white/10 text-slate-400'
              }`}
            >
              <div className="text-xs font-bold flex items-center justify-between">
                <span>Fade Wipe</span>
                <span className={`w-2 h-2 rounded-full ${climax.fadeWipeEnabled ? 'bg-rose-400' : 'bg-slate-600'}`} />
              </div>
              <div className="text-[9px] text-slate-400">Directional feathered wipe</div>
            </button>

            {/* Crossfade */}
            <button
              onClick={() =>
                updateConfig((prev) => ({
                  ...prev,
                  climax: {
                    ...(prev.climax || DEFAULT_MEMORY_BURST_CONFIG.climax),
                    crossfadeEnabled: !prev.climax?.crossfadeEnabled,
                    fadeWipeEnabled: false,
                  },
                }))
              }
              className={`p-2.5 rounded-xl border text-left transition-all ${
                climax.crossfadeEnabled
                  ? 'bg-rose-500/20 border-rose-400 text-white'
                  : 'bg-slate-900/40 border-white/10 text-slate-400'
              }`}
            >
              <div className="text-xs font-bold flex items-center justify-between">
                <span>Crossfade</span>
                <span className={`w-2 h-2 rounded-full ${climax.crossfadeEnabled ? 'bg-rose-400' : 'bg-slate-600'}`} />
              </div>
              <div className="text-[9px] text-slate-400">Seamless blend</div>
            </button>
          </div>
        </div>
      </div>

      {/* RHYTHM & CUTTING MODE */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            <span>Rhythm & Cutting Mode</span>
          </span>
          <span className="text-[10px] text-rose-300 font-bold uppercase">
            {config.mode}
          </span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => updateConfig((prev) => ({ ...prev, mode: mode.id }))}
              className={`p-2 rounded-xl text-left border transition-all ${
                config.mode === mode.id
                  ? 'bg-rose-500/20 border-rose-400 text-white shadow-sm'
                  : 'bg-slate-900/40 border-white/10 text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <div className="text-xs font-bold">{mode.label}</div>
              <div className="text-[9px] text-slate-400 line-clamp-1">{mode.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* TRANSITION STYLES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cinematic Shot Transitions</span>
          </label>
          <span className="text-[10px] text-cyan-300 font-bold">
            {config.transitionDurationSec.toFixed(2)}s
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {TRANSITIONS.map((style) => (
            <button
              key={style.id}
              onClick={() => updateConfig((prev) => ({ ...prev, transitionStyle: style.id }))}
              className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                config.transitionStyle === style.id
                  ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                  : 'bg-slate-900/40 border-white/10 text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>

        {/* Transition Duration Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Transition Duration</span>
            <span>{config.transitionDurationSec.toFixed(2)}s</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.6"
            step="0.01"
            value={config.transitionDurationSec}
            onChange={(e) =>
              updateConfig((prev) => ({
                ...prev,
                transitionDurationSec: parseFloat(e.target.value),
              }))
            }
            className="w-full h-1.5 bg-slate-800 rounded-lg accent-cyan-400 cursor-pointer"
          />
        </div>
      </div>

      {/* BEAT DETECTION & SENSITIVITY */}
      <div className="space-y-3 bg-slate-900/40 p-4 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Music Beat Sensitivity & Cadence
            </h4>
          </div>
          {/* Live Beat Hit Indicator */}
          <div
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
              liveBands.isBeatHit
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/50 scale-105'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            {liveBands.isBeatHit ? '⚡ BEAT HIT' : 'LISTENING'}
          </div>
        </div>

        {/* Audio Rhythm Beat Analyzer Card */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Rhythm Beat Sync:</span>
              <span className="text-emerald-300 font-bold">
                {config.beatMarkers.length > 0 ? `${config.beatMarkers.length} Beats Analyzed` : 'Not Analyzed'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {config.beatMarkers.length > 0
                ? 'Photos slide & transition precisely in time with every detected musical beat'
                : 'Click analyze to detect transients from audio and sync photo cuts to rhythm'}
            </p>
          </div>

          <button
            onClick={() => handleAnalyzeBeats(true)}
            disabled={isAnalyzingBeats}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isAnalyzingBeats ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing Audio...</span>
              </>
            ) : (
              <>
                <Music className="w-3.5 h-3.5" />
                <span>{config.beatMarkers.length > 0 ? 'Re-Analyze Beats' : 'Analyze Music Beats'}</span>
              </>
            )}
          </button>
        </div>

        {/* Sensitivity Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Beat Detection Sensitivity</span>
            <span className="text-emerald-400 font-bold">{config.beatSensitivity}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="1"
            value={config.beatSensitivity}
            onChange={(e) =>
              updateConfig((prev) => ({
                ...prev,
                beatSensitivity: parseInt(e.target.value, 10),
              }))
            }
            className="w-full h-1.5 bg-slate-800 rounded-lg accent-emerald-400 cursor-pointer"
          />
        </div>

        {/* Min Cut Interval / Debounce Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Minimum Cut Interval (Debounce)</span>
            <span className="text-slate-300 font-bold">{config.minCutIntervalSec.toFixed(2)}s</span>
          </div>
          <input
            type="range"
            min="0.15"
            max="0.8"
            step="0.05"
            value={config.minCutIntervalSec}
            onChange={(e) =>
              updateConfig((prev) => ({
                ...prev,
                minCutIntervalSec: parseFloat(e.target.value),
              }))
            }
            className="w-full h-1.5 bg-slate-800 rounded-lg accent-emerald-400 cursor-pointer"
          />
        </div>

        {/* Default Photo Duration (When Beat Sync is Disabled) */}
        {config.mode === 'manual-timing' && (
          <div className="space-y-1 pt-2 border-t border-white/5">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Per-Photo Duration</span>
              <span className="text-amber-400 font-bold">
                {config.defaultPhotoDurationSec.toFixed(1)}s
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.1"
              value={config.defaultPhotoDurationSec}
              onChange={(e) =>
                updateConfig((prev) => ({
                  ...prev,
                  defaultPhotoDurationSec: parseFloat(e.target.value),
                }))
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg accent-amber-400 cursor-pointer"
            />
          </div>
        )}

        {/* Manual Beat Markers Tool */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Manual Markers: <span className="text-white font-bold">{config.beatMarkers.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddBeatMarker}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <Plus className="w-3 h-3" />
              <span>Tap Beat Marker</span>
            </button>
            {config.beatMarkers.length > 0 && (
              <button
                onClick={handleClearBeatMarkers}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs transition-all"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RHYTHM-SYNCED CINEMATIC ZOOM */}
      <div className="space-y-3.5 p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-violet-950/30 to-slate-900/60 border border-purple-500/30 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-xs font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Rhythm Cinematic Zoom</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                MUSIC REACTIVE
              </span>
            </label>
            <p className="text-[11px] text-slate-400">
              Camera dynamically zooms and breathes in sync with the musical rhythm, bass, and kick hits
            </p>
          </div>

          {/* Toggle On / Off ("vendenkil off aakanulla option") */}
          <button
            onClick={() =>
              updateConfig((prev) => ({
                ...prev,
                rhythmZoom: {
                  ...(prev.rhythmZoom || DEFAULT_MEMORY_BURST_CONFIG.rhythmZoom),
                  enabled: !(prev.rhythmZoom?.enabled ?? true),
                },
              }))
            }
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              (config.rhythmZoom?.enabled ?? true)
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30'
                : 'bg-slate-800 text-slate-400 border border-white/10 hover:text-white'
            }`}
          >
            <span>{(config.rhythmZoom?.enabled ?? true) ? 'Zoom: ON' : 'Zoom: OFF'}</span>
          </button>
        </div>

        {(config.rhythmZoom?.enabled ?? true) && (
          <div className="space-y-3 pt-2 border-t border-purple-500/20">
            {/* Zoom Style Selector */}
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'rhythm-pulse', label: 'Rhythm Pulse', desc: 'Pulses with bass & kicks' },
                { id: 'slow-push', label: 'Cinematic Push', desc: 'Smooth Ken Burns + beat' },
                { id: 'beat-kick', label: 'Beat Kick', desc: 'Punch on rhythm beats' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() =>
                    updateConfig((prev) => ({
                      ...prev,
                      rhythmZoom: {
                        ...(prev.rhythmZoom || DEFAULT_MEMORY_BURST_CONFIG.rhythmZoom),
                        style: st.id as any,
                      },
                    }))
                  }
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    (config.rhythmZoom?.style || 'rhythm-pulse') === st.id
                      ? 'bg-purple-600/30 border-purple-400 text-white shadow-sm'
                      : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold">{st.label}</div>
                  <div className="text-[9px] text-slate-400 line-clamp-1">{st.desc}</div>
                </button>
              ))}
            </div>

            {/* Live Reactivity Visualizer Bar */}
            <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 shrink-0">Live Beat Reaction:</span>
              <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden flex items-center">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-75"
                  style={{ width: `${Math.min(100, (liveBands.bass || 0) * 100)}%` }}
                />
              </div>
              <span className={`text-[10px] font-bold ${liveBands.isBeatHit ? 'text-pink-400 animate-pulse' : 'text-slate-500'}`}>
                {liveBands.isBeatHit ? '💥 KICK' : 'RHYTHM'}
              </span>
            </div>

            {/* Intensity Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Rhythm Zoom Response Intensity</span>
                <span className="text-purple-300 font-bold">{config.rhythmZoom?.intensity || 60}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={config.rhythmZoom?.intensity || 60}
                onChange={(e) =>
                  updateConfig((prev) => ({
                    ...prev,
                    rhythmZoom: {
                      ...(prev.rhythmZoom || DEFAULT_MEMORY_BURST_CONFIG.rhythmZoom),
                      intensity: parseInt(e.target.value, 10),
                    },
                  }))
                }
                className="w-full h-1.5 bg-slate-800 rounded-lg accent-purple-400 cursor-pointer"
              />
            </div>

            {/* Max Zoom Limit Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Max Zoom Magnification</span>
                <span className="text-purple-300 font-bold">{(config.rhythmZoom?.maxZoom || 1.08).toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="1.02"
                max="1.15"
                step="0.01"
                value={config.rhythmZoom?.maxZoom || 1.08}
                onChange={(e) =>
                  updateConfig((prev) => ({
                    ...prev,
                    rhythmZoom: {
                      ...(prev.rhythmZoom || DEFAULT_MEMORY_BURST_CONFIG.rhythmZoom),
                      maxZoom: parseFloat(e.target.value),
                    },
                  }))
                }
                className="w-full h-1.5 bg-slate-800 rounded-lg accent-purple-400 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* CINEMATIC FX TOGGLES (STRICT: ALL OFF BY DEFAULT) */}
      <div className="space-y-3 bg-slate-900/40 p-4 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Cinematic Beat Effects (Optional)
          </h4>
        </div>

        {/* 1. Scale Punch */}
        <div className="space-y-2 p-3 rounded-xl bg-slate-950/40 border border-white/5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-2">
              <span>Scale Punch (105% → 100%)</span>
            </label>
            <input
              type="checkbox"
              checked={config.scalePunch.enabled}
              onChange={(e) =>
                updateConfig((prev) => ({
                  ...prev,
                  scalePunch: {
                    ...prev.scalePunch,
                    enabled: e.target.checked,
                  },
                }))
              }
              className="w-4 h-4 rounded accent-rose-500 cursor-pointer"
            />
          </div>
          {config.scalePunch.enabled && (
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Punch Zoom Level</span>
                <span>{((config.scalePunch.startScale - 1) * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="1.01"
                max="1.15"
                step="0.01"
                value={config.scalePunch.startScale}
                onChange={(e) =>
                  updateConfig((prev) => ({
                    ...prev,
                    scalePunch: {
                      ...prev.scalePunch,
                      startScale: parseFloat(e.target.value),
                    },
                  }))
                }
                className="w-full h-1.5 bg-slate-800 rounded-lg accent-rose-500 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* 2. Bass Micro-Shake */}
        <div className="space-y-2 p-3 rounded-xl bg-slate-950/40 border border-white/5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-2">
              <span>Bass Micro-Shake</span>
            </label>
            <input
              type="checkbox"
              checked={config.bassShake.enabled}
              onChange={(e) =>
                updateConfig((prev) => ({
                  ...prev,
                  bassShake: {
                    ...prev.bassShake,
                    enabled: e.target.checked,
                  },
                }))
              }
              className="w-4 h-4 rounded accent-rose-500 cursor-pointer"
            />
          </div>
          {config.bassShake.enabled && (
            <div className="space-y-2 pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Shake Intensity</span>
                  <span>{config.bassShake.intensity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={config.bassShake.intensity}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      bassShake: {
                        ...prev.bassShake,
                        intensity: parseInt(e.target.value, 10),
                      },
                    }))
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg accent-rose-500 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* 3. Short Flash Cut */}
        <div className="space-y-2 p-3 rounded-xl bg-slate-950/40 border border-white/5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-2">
              <span>Beat Flash Cut</span>
            </label>
            <input
              type="checkbox"
              checked={config.flash.enabled}
              onChange={(e) =>
                updateConfig((prev) => ({
                  ...prev,
                  flash: {
                    ...prev.flash,
                    enabled: e.target.checked,
                  },
                }))
              }
              className="w-4 h-4 rounded accent-rose-500 cursor-pointer"
            />
          </div>
          {config.flash.enabled && (
            <div className="space-y-2 pt-1">
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    updateConfig((prev) => ({
                      ...prev,
                      flash: { ...prev.flash, type: 'white' },
                    }))
                  }
                  className={`flex-1 py-1 rounded text-[11px] font-bold border ${
                    config.flash.type === 'white'
                      ? 'bg-white text-black border-white'
                      : 'bg-slate-900 text-slate-300 border-white/10'
                  }`}
                >
                  White Flash
                </button>
                <button
                  onClick={() =>
                    updateConfig((prev) => ({
                      ...prev,
                      flash: { ...prev.flash, type: 'warm' },
                    }))
                  }
                  className={`flex-1 py-1 rounded text-[11px] font-bold border ${
                    config.flash.type === 'warm'
                      ? 'bg-amber-500 text-black border-amber-400'
                      : 'bg-slate-900 text-slate-300 border-white/10'
                  }`}
                >
                  Warm Glow
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Flash Opacity</span>
                  <span>{(config.flash.opacity * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.6"
                  step="0.05"
                  value={config.flash.opacity}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      flash: {
                        ...prev.flash,
                        opacity: parseFloat(e.target.value),
                      },
                    }))
                  }
                  className="w-full h-1.5 bg-slate-800 rounded-lg accent-rose-500 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
