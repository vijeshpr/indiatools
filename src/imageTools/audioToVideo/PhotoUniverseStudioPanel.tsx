/**
 * IndiaTools — Floating Photo Universe Studio Panel
 * 3D Music-Driven Floating Photo Experience Panel 2.0
 * Multi-photo management, deterministic camera choreography, local audio analysis,
 * multi-layered space backgrounds & refined single-subject focus depth
 */

import React, { useRef, useState, useEffect } from 'react'
import {
  Upload,
  Plus,
  Trash2,
  Sparkles,
  Camera,
  Zap,
  MoveLeft,
  MoveRight,
  RotateCcw,
  Eye,
  EyeOff,
  Flame,
  Layers,
  Aperture,
  Image as ImageIcon,
  Compass,
  Music,
  Activity,
  CheckCircle2,
  SlidersHorizontal,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Disc3,
} from 'lucide-react'
import {
  StudioCompositionConfig,
  NormalizedAudioBands,
} from '../../lib/audioToVideo/types.ts'
import {
  PhotoUniverseStudioConfig,
  UniversePhoto,
  CameraMovementStyle,
  DepthOfFieldMode,
  DirectorMode,
  GlobalMotionPreset,
  PhotoMotionBehavior,
  BassShakeLevel,
  UniverseBackgroundType,
  MusicMovementProfile,
  UniverseAudioAnalysisResult,
  DEFAULT_PHOTO_UNIVERSE_CONFIG,
  DEFAULT_UNIVERSE_BACKGROUND,
  DEFAULT_UNIVERSE_BASS_SHAKE,
} from '../../lib/photoUniverse/photoUniverseTypes.ts'
import {
  UNIVERSE_PRESETS,
  applyUniversePreset,
} from '../../lib/photoUniverse/photoUniversePresets.ts'
import { universeAudioAnalyzer } from '../../lib/photoUniverse/universeAudioAnalyzer.ts'
import { universeEngine } from '../../lib/photoUniverse/universeEngine.ts'

interface PhotoUniverseStudioPanelProps {
  composition: StudioCompositionConfig
  setComposition: React.Dispatch<React.SetStateAction<StudioCompositionConfig>>
  liveBands?: NormalizedAudioBands
  currentTime?: number
  duration?: number
  audioUrl?: string | null
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void
}

export const PhotoUniverseStudioPanel: React.FC<PhotoUniverseStudioPanelProps> = ({
  composition,
  setComposition,
  currentTime = 0,
  duration = 30,
  audioUrl,
  showToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const bgFileInputRef = useRef<HTMLInputElement | null>(null)
  const [activeSection, setActiveSection] = useState<
    'all' | 'analysis' | 'motion' | 'photos' | 'background' | 'camera' | 'dof' | 'shake'
  >('all')

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [analysisProgress, setAnalysisProgress] = useState<number>(0)
  const [analysisResult, setAnalysisResult] = useState<UniverseAudioAnalysisResult | null>(() => {
    return universeEngine.getAudioAnalysis()
  })

  const config: PhotoUniverseStudioConfig =
    composition.photoUniverse || DEFAULT_PHOTO_UNIVERSE_CONFIG

  const updateConfig = (
    updater: (prev: PhotoUniverseStudioConfig) => PhotoUniverseStudioConfig
  ) => {
    setComposition((prev) => ({
      ...prev,
      photoUniverse: updater(prev.photoUniverse || DEFAULT_PHOTO_UNIVERSE_CONFIG),
    }))
  }

  // Audio Analysis Trigger
  const handleAnalyzeMusic = async () => {
    if (!audioUrl) {
      showToast('Please select or upload an audio track first in the Audio tab.', 'error')
      return
    }

    setIsAnalyzing(true)
    setAnalysisProgress(10)

    try {
      const result = await universeAudioAnalyzer.analyzeAudioTrack(audioUrl, (pct) => {
        setAnalysisProgress(pct)
      })

      setAnalysisResult(result)
      universeEngine.setAudioAnalysis(result)
      universeEngine.regenerateScore(config, duration || result.durationSec)

      // Automatically recommend motion preset based on detected profile
      let recommendedPreset: GlobalMotionPreset = 'dream-cinema'
      if (result.detectedProfile === 'steady-rhythm') recommendedPreset = 'balanced-music-video'
      if (result.detectedProfile === 'bass-heavy') recommendedPreset = 'energetic-flight'
      if (result.detectedProfile === 'melody-ambient' || result.detectedProfile === 'soft-vocal') {
        recommendedPreset = 'dream-cinema'
      }

      updateConfig((prev) => ({
        ...prev,
        motionPreset: recommendedPreset,
        photoFocusDuration: result.recommendedHoldDuration,
        cameraSpeed: result.recommendedBaseSpeed,
      }))

      showToast(
        `Analysis complete! Detected "${result.detectedProfile}" — applied ${recommendedPreset} choreography.`,
        'success'
      )
    } catch (err: unknown) {
      console.warn('Audio analysis fallback used:', err)
      const fallback = universeAudioAnalyzer.generateFallbackAnalysis(
        duration || 30,
        config.profileOverride !== 'auto' ? config.profileOverride : 'balanced-cinematic'
      )
      setAnalysisResult(fallback)
      universeEngine.setAudioAnalysis(fallback)
      universeEngine.regenerateScore(config, duration || 30)
      showToast('Estimated audio movement profile applied.', 'info')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Handle Multi-Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newPhotos: UniversePhoto[] = []
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      const img = new Image()
      img.onload = () => {
        const aspect = img.naturalWidth / img.naturalHeight
        updateConfig((prev) => ({
          ...prev,
          photos: prev.photos.map((p) =>
            p.url === url
              ? { ...p, width: img.naturalWidth, height: img.naturalHeight, aspectRatio: aspect }
              : p
          ),
        }))
      }
      img.src = url

      newPhotos.push({
        id: `photo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        url,
        name: file.name,
        aspectRatio: 16 / 9,
      })
    })

    updateConfig((prev) => {
      const updatedPhotos = [...prev.photos, ...newPhotos]
      const updatedConfig = {
        ...prev,
        enabled: true,
        photos: updatedPhotos,
      }
      // Regenerate score with updated photo count
      universeEngine.regenerateScore(updatedConfig, duration)
      return updatedConfig
    })

    showToast(`Imported ${newPhotos.length} photos into 3D Universe!`, 'success')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Handle Custom Background Upload
  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    updateConfig((prev) => ({
      ...prev,
      background: {
        ...prev.background,
        type: 'custom-image',
        customImage: {
          url,
          name: file.name,
          fitMode: 'cover',
          brightness: 100,
          blur: 0,
          parallaxEnabled: true,
        },
      },
    }))

    showToast('Custom space background loaded successfully!', 'success')
    if (bgFileInputRef.current) bgFileInputRef.current.value = ''
  }

  // Move photo left/right in filmstrip
  const handleMovePhoto = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= config.photos.length) return

    updateConfig((prev) => {
      const updated = [...prev.photos]
      const [moved] = updated.splice(index, 1)
      updated.splice(targetIndex, 0, moved)
      const newCfg = { ...prev, photos: updated }
      universeEngine.regenerateScore(newCfg, duration)
      return newCfg
    })
  }

  // Remove photo
  const handleRemovePhoto = (id: string) => {
    updateConfig((prev) => {
      const newCfg = {
        ...prev,
        photos: prev.photos.filter((p) => p.id !== id),
        manualOrder: prev.manualOrder.filter((pId) => pId !== id),
      }
      universeEngine.regenerateScore(newCfg, duration)
      return newCfg
    })
    showToast('Removed photograph from 3D Universe.', 'info')
  }

  // Clear all photos
  const handleClearAllPhotos = () => {
    updateConfig((prev) => {
      const newCfg = {
        ...prev,
        photos: [],
        manualOrder: [],
      }
      universeEngine.regenerateScore(newCfg, duration)
      return newCfg
    })
    showToast('Cleared photo universe collection.', 'info')
  }

  // Apply Preset
  const handleApplyPreset = (presetId: string) => {
    updateConfig((prev) => {
      const updated = applyUniversePreset(prev, presetId)
      universeEngine.regenerateScore(updated, duration)
      return updated
    })
    showToast(`Applied preset: ${presetId.replace(/-/g, ' ')}`, 'success')
  }

  // Apply Global Motion Preset
  const handleApplyMotionPreset = (preset: GlobalMotionPreset) => {
    updateConfig((prev) => {
      let speed = prev.cameraSpeed
      let hold = prev.photoFocusDuration
      let shakeLvl: BassShakeLevel = 'subtle'

      if (preset === 'dream-cinema') {
        speed = 0.85
        hold = 4.0
        shakeLvl = 'subtle'
      } else if (preset === 'balanced-music-video') {
        speed = 1.0
        hold = 3.2
        shakeLvl = 'balanced'
      } else if (preset === 'energetic-flight') {
        speed = 1.2
        hold = 2.4
        shakeLvl = 'balanced'
      }

      const updated: PhotoUniverseStudioConfig = {
        ...prev,
        motionPreset: preset,
        cameraSpeed: speed,
        photoFocusDuration: hold,
        photoMotion: 'static',
        bassShake: {
          ...prev.bassShake,
          level: shakeLvl,
        },
      }
      universeEngine.regenerateScore(updated, duration)
      return updated
    })
    showToast(`Motion preset set to: ${preset.replace(/-/g, ' ').toUpperCase()}`, 'info')
  }

  // Reset to Defaults
  const handleReset = () => {
    updateConfig((prev) => ({
      ...DEFAULT_PHOTO_UNIVERSE_CONFIG,
      enabled: true,
      photos: prev.photos,
    }))
    showToast('Reset 3D Photo Universe settings to calm cinematic defaults.', 'info')
  }

  return (
    <div className="space-y-6 text-gray-200">
      {/* 1. Header Bar: Master Enable Toggle & Universe 2.0 Identity */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-900 via-indigo-950/40 to-gray-900 border border-cyan-500/30 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-white text-base">3D Floating Photo Universe 2.0</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                CHOREOGRAPHED THREE.JS
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Music-analyzed cinematic camera score, 3-layer spatial depth & deep space starfield
            </p>
          </div>
        </div>

        <button
          onClick={() => updateConfig((prev) => ({ ...prev, enabled: !prev.enabled }))}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
            config.enabled
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-cyan-500/20'
              : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
          }`}
        >
          {config.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <span>{config.enabled ? 'ACTIVE MODE' : 'ENABLE EFFECT'}</span>
        </button>
      </div>

      {/* 2. Audio Pre-Analysis & Musical Choreography Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-gray-900 to-black border border-indigo-500/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-white">Full-Track Music Analysis Engine</h4>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono">
                  100% Client-Side
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Pre-computes phrase boundaries, dynamics & rhythmic onsets before camera movement starts
              </p>
            </div>
          </div>

          <button
            onClick={handleAnalyzeMusic}
            disabled={isAnalyzing}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-black text-xs font-bold rounded-xl shadow-md disabled:opacity-50 transition-all shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? `Analyzing (${analysisProgress}%)` : 'Analyze Music Track'}</span>
          </button>
        </div>

        {/* Progress Bar */}
        {isAnalyzing && (
          <div className="w-full bg-gray-950 rounded-full h-2 overflow-hidden border border-indigo-500/30">
            <div
              className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-blue-500 h-full transition-all duration-300"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
        )}

        {/* Analysis Result Overview */}
        {analysisResult && (
          <div className="p-3 bg-gray-950/80 rounded-xl border border-indigo-500/20 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">Detected Profile:</span>
                <span className="font-bold text-cyan-300 uppercase tracking-wide bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/30">
                  {analysisResult.detectedProfile}
                </span>
                <span className="text-gray-500 text-[10px]">
                  ({Math.round(analysisResult.confidence * 100)}% match)
                </span>
              </div>

              <div className="flex items-center space-x-3 text-[11px] text-gray-400 font-mono">
                <span>Hold: {analysisResult.recommendedHoldDuration.toFixed(1)}s</span>
                <span>Speed: {analysisResult.recommendedBaseSpeed.toFixed(2)}x</span>
                <span>Phrases: {analysisResult.phraseCount}</span>
              </div>
            </div>

            {/* Timeline Energy Mini Bar */}
            {analysisResult.timelinePoints && analysisResult.timelinePoints.length > 0 && (
              <div className="pt-1">
                <div className="text-[10px] text-gray-400 mb-1 flex justify-between">
                  <span>Audio Energy Timeline Overview</span>
                  <span>{duration.toFixed(0)}s total</span>
                </div>
                <div className="h-6 w-full bg-gray-900 rounded-lg overflow-hidden flex items-end px-1 gap-[2px] border border-gray-800">
                  {analysisResult.timelinePoints.slice(0, 80).map((pt, idx) => {
                    const isNow =
                      currentTime >= pt.timestamp &&
                      currentTime < pt.timestamp + duration / 80
                    return (
                      <div
                        key={idx}
                        className={`w-full rounded-t-sm transition-all ${
                          isNow
                            ? 'bg-amber-400 scale-y-110 shadow-lg'
                            : pt.isPhraseStart
                            ? 'bg-cyan-400'
                            : pt.isBeat
                            ? 'bg-indigo-400'
                            : 'bg-indigo-900/50'
                        }`}
                        style={{ height: `${Math.max(15, pt.energy * 100)}%` }}
                        title={`${pt.timestamp.toFixed(1)}s: ${Math.round(pt.energy * 100)}%`}
                      />
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Manual Override */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-gray-800/60">
          <span className="text-gray-400">Movement Profile Mode:</span>
          <select
            value={config.profileOverride}
            onChange={(e) => {
              const val = e.target.value as PhotoUniverseStudioConfig['profileOverride']
              updateConfig((prev) => {
                const updated = { ...prev, profileOverride: val }
                universeEngine.regenerateScore(updated, duration)
                return updated
              })
            }}
            className="bg-gray-950 text-gray-200 border border-gray-700 rounded-lg px-2.5 py-1 text-xs focus:border-cyan-400 focus:outline-none"
          >
            <option value="auto">Auto-Classified from Music</option>
            <option value="melody-ambient">Melody & Ambient (Slow, expansive)</option>
            <option value="soft-vocal">Soft Vocal (Gentle focus holds)</option>
            <option value="steady-rhythm">Steady Rhythm (Balanced cuts)</option>
            <option value="bass-heavy">Bass-Heavy (Punchy & dynamic)</option>
            <option value="balanced-cinematic">Balanced Cinematic (Default)</option>
          </select>
        </div>
      </div>

      {/* 3. Global Motion Presets */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
          <Activity className="w-3.5 h-3.5" />
          <span>Global Motion Presets</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            {
              id: 'dream-cinema' as GlobalMotionPreset,
              title: 'Dream Cinema',
              tag: 'Calm & Flowing',
              desc: 'Slow gliding curves, 4s hold, minimal shake',
            },
            {
              id: 'balanced-music-video' as GlobalMotionPreset,
              title: 'Balanced Video',
              tag: 'Music-Aligned',
              desc: 'Moderate pace, 3.2s hold, rhythmic cuts',
            },
            {
              id: 'energetic-flight' as GlobalMotionPreset,
              title: 'Energetic Flight',
              tag: 'Punchy Beats',
              desc: 'Dynamic travel, 2.4s hold, responsive banking',
            },
            {
              id: 'custom' as GlobalMotionPreset,
              title: 'Custom Pacing',
              tag: 'User Directed',
              desc: 'Fine-tune speeds, focus durations & layout',
            },
          ].map((preset) => {
            const isActive = config.motionPreset === preset.id
            return (
              <button
                key={preset.id}
                onClick={() => handleApplyMotionPreset(preset.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/10'
                    : 'bg-gray-950/80 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{preset.title}</span>
                  {isActive && <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />}
                </div>
                <div className="text-[10px] text-cyan-400 font-mono">{preset.tag}</div>
                <div className="text-[10px] text-gray-400 mt-1 line-clamp-1">{preset.desc}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. Curated Style Presets */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Cinematic Visual Styles</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {UNIVERSE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset.id)}
              className="p-3 rounded-xl bg-gray-900/80 hover:bg-gray-800/80 border border-gray-800 hover:border-cyan-500/50 transition-all text-left group"
            >
              <div
                className="w-2 h-2 rounded-full mb-1.5"
                style={{ backgroundColor: preset.accentColor }}
              />
              <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                {preset.name}
              </div>
              <div className="text-[10px] text-gray-400 line-clamp-1">{preset.subtitle}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handlePhotoUpload}
      />
      <input
        ref={bgFileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleCustomBgUpload}
      />

      {/* 5. Section Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-gray-800 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveSection('all')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeSection === 'all'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          All Controls
        </button>
        <button
          onClick={() => setActiveSection('photos')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeSection === 'photos'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Photos ({config.photos.length})
        </button>
        <button
          onClick={() => setActiveSection('background')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeSection === 'background'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Background & Space
        </button>
        <button
          onClick={() => setActiveSection('camera')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeSection === 'camera'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Camera Flight
        </button>
        <button
          onClick={() => setActiveSection('dof')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeSection === 'dof'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Depth of Field
        </button>
        <button
          onClick={() => setActiveSection('shake')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeSection === 'shake'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Bass Shake
        </button>
      </div>

      {/* 6. Photo Collection Filmstrip & Spatial Layout */}
      {(activeSection === 'all' || activeSection === 'photos') && (
        <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">Floating Photographs Collection</h4>
              <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full font-bold">
                {config.photos.length} Photos
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {config.photos.length > 0 && (
                <button
                  onClick={handleClearAllPhotos}
                  className="px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-black text-xs font-bold rounded-lg shadow-md hover:brightness-110 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Photos</span>
              </button>
            </div>
          </div>

          {/* Filmstrip Display */}
          {config.photos.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-8 border-2 border-dashed border-gray-800 hover:border-cyan-500/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer text-center group transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-gray-300">Click to import local photographs</p>
              <p className="text-xs text-gray-500 mt-1">
                Select 3 to 20 images (JPG, PNG, WebP). 100% private in browser memory.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {config.photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="relative group rounded-xl overflow-hidden bg-gray-950 border border-gray-800 hover:border-cyan-500/60 transition-all shadow-md"
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-sm text-[10px] font-mono text-cyan-300 px-1.5 py-0.5 rounded">
                    #{index + 1}
                  </div>
                  <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <button
                      onClick={() => handleRemovePhoto(photo.id)}
                      className="p-1 bg-rose-950/80 hover:bg-rose-600 text-white rounded transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="p-1.5 bg-gray-900/90 flex items-center justify-between text-[10px] text-gray-400">
                    <span className="truncate max-w-[70px]">{photo.name}</span>
                    <div className="flex space-x-0.5">
                      <button
                        onClick={() => handleMovePhoto(index, 'left')}
                        disabled={index === 0}
                        className="p-1 hover:text-white disabled:opacity-30"
                      >
                        <MoveLeft className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMovePhoto(index, 'right')}
                        disabled={index === config.photos.length - 1}
                        className="p-1 hover:text-white disabled:opacity-30"
                      >
                        <MoveRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Photo Motion Behavior (Static Default) */}
          <div className="p-3 bg-gray-950/70 rounded-xl border border-gray-800 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Photo Rotation Behavior</span>
                </div>
                <div className="text-[10px] text-gray-400">
                  Fixed static orientation prevents dizziness; camera does the cinematic work
                </div>
              </div>

              <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg border border-gray-800">
                {(
                  [
                    { id: 'static', label: 'Static (Stable)' },
                    { id: 'subtle-float', label: 'Subtle Breathing' },
                    { id: 'music-micro', label: 'Music Micro' },
                  ] as { id: PhotoMotionBehavior; label: string }[]
                ).map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() =>
                      updateConfig((prev) => ({
                        ...prev,
                        photoMotion: mode.id,
                        enableRotation: mode.id !== 'static',
                      }))
                    }
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                      config.photoMotion === mode.id
                        ? 'bg-cyan-500 text-black shadow'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3D Spatial Universe Layout Controls */}
          <div className="pt-3 border-t border-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">3D Space Spread</span>
                <span className="font-mono text-cyan-300">{config.spaceSpread}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                value={config.spaceSpread}
                onChange={(e) =>
                  updateConfig((prev) => ({ ...prev, spaceSpread: Number(e.target.value) }))
                }
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Photo Frame Scale</span>
                <span className="font-mono text-cyan-300">{config.photoScale.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="2.0"
                step="0.1"
                value={config.photoScale}
                onChange={(e) =>
                  updateConfig((prev) => ({ ...prev, photoScale: Number(e.target.value) }))
                }
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Depth Range Corridor</span>
                <span className="font-mono text-cyan-300">{config.depthRange}px</span>
              </div>
              <input
                type="range"
                min="600"
                max="3000"
                step="100"
                value={config.depthRange}
                onChange={(e) =>
                  updateConfig((prev) => ({ ...prev, depthRange: Number(e.target.value) }))
                }
                className="w-full accent-cyan-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* 7. Background & Space Environment Manager */}
      {(activeSection === 'all' || activeSection === 'background') && (
        <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Disc3 className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">Space & Universe Background</h4>
            </div>

            {config.background.type === 'custom-image' && (
              <button
                onClick={() => bgFileInputRef.current?.click()}
                className="text-xs text-cyan-400 hover:underline flex items-center space-x-1"
              >
                <ImageIcon className="w-3 h-3" />
                <span>Replace Image</span>
              </button>
            )}
          </div>

          {/* Background Type Selection */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'deep-space' as UniverseBackgroundType, name: 'Deep Space', desc: 'Starfield & subtle nebulas' },
              { id: 'minimal-starfield' as UniverseBackgroundType, name: 'Minimal Stars', desc: 'Crisp & distraction-free' },
              { id: 'nebula-galaxy' as UniverseBackgroundType, name: 'Nebula Galaxy', desc: 'Luminous cosmic clouds' },
              { id: 'custom-image' as UniverseBackgroundType, name: 'Custom Image', desc: 'Upload background image' },
              { id: 'solid-dark' as UniverseBackgroundType, name: 'Solid Void', desc: 'Pure dark minimal studio' },
            ].map((bg) => {
              const isActive = config.background.type === bg.id
              return (
                <button
                  key={bg.id}
                  onClick={() => {
                    if (bg.id === 'custom-image' && !config.background.customImage) {
                      bgFileInputRef.current?.click()
                    } else {
                      updateConfig((prev) => ({
                        ...prev,
                        background: { ...prev.background, type: bg.id },
                      }))
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 border-cyan-400 text-white'
                      : 'bg-gray-950/80 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  <div className="text-xs font-bold">{bg.name}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{bg.desc}</div>
                </button>
              )
            })}
          </div>

          {/* Custom Background Settings */}
          {config.background.type === 'custom-image' && config.background.customImage && (
            <div className="p-3 bg-gray-950/80 rounded-xl border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300 font-semibold truncate max-w-[200px]">
                  Custom: {config.background.customImage.name}
                </span>
                <button
                  onClick={() => bgFileInputRef.current?.click()}
                  className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-cyan-300 rounded text-[10px]"
                >
                  Change
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Brightness</span>
                    <span className="font-mono text-cyan-300">{config.background.customImage.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="150"
                    value={config.background.customImage.brightness}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      updateConfig((prev) => ({
                        ...prev,
                        background: {
                          ...prev.background,
                          customImage: prev.background.customImage
                            ? { ...prev.background.customImage, brightness: val }
                            : null,
                        },
                      }))
                    }}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Blur Level</span>
                    <span className="font-mono text-cyan-300">{config.background.customImage.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={config.background.customImage.blur}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      updateConfig((prev) => ({
                        ...prev,
                        background: {
                          ...prev.background,
                          customImage: prev.background.customImage
                            ? { ...prev.background.customImage, blur: val }
                            : null,
                        },
                      }))
                    }}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div className="flex items-center justify-between pt-3">
                  <span className="text-xs text-gray-400">Parallax Motion Drift</span>
                  <input
                    type="checkbox"
                    checked={config.background.customImage.parallaxEnabled}
                    onChange={(e) => {
                      const checked = e.target.checked
                      updateConfig((prev) => ({
                        ...prev,
                        background: {
                          ...prev.background,
                          customImage: prev.background.customImage
                            ? { ...prev.background.customImage, parallaxEnabled: checked }
                            : null,
                        },
                      }))
                    }}
                    className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Procedural Space Controls */}
          {config.background.type !== 'custom-image' && config.background.type !== 'solid-dark' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Galaxy Color Tint</label>
                <select
                  value={config.background.galaxyTint}
                  onChange={(e) => {
                    const tint = e.target.value as PhotoUniverseStudioConfig['background']['galaxyTint']
                    updateConfig((prev) => ({
                      ...prev,
                      background: { ...prev.background, galaxyTint: tint },
                    }))
                  }}
                  className="w-full bg-gray-950 text-gray-200 border border-gray-700 rounded-lg px-2.5 py-1 text-xs focus:border-cyan-400 focus:outline-none"
                >
                  <option value="cosmic-blue">Cosmic Blue</option>
                  <option value="mystic-violet">Mystic Violet</option>
                  <option value="amber-nebula">Amber Nebula</option>
                  <option value="emerald-deep">Emerald Deep</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Starfield Density</span>
                  <span className="font-mono text-cyan-300">{config.background.starCount}</span>
                </div>
                <input
                  type="range"
                  min="800"
                  max="4000"
                  step="200"
                  value={config.background.starCount}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      background: { ...prev.background, starCount: Number(e.target.value) },
                    }))
                  }
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Nebula Glow Intensity</span>
                  <span className="font-mono text-cyan-300">{config.background.nebulaGlow}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.background.nebulaGlow}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      background: { ...prev.background, nebulaGlow: Number(e.target.value) },
                    }))
                  }
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 8. Signature Camera Flight & Pacing */}
      {(activeSection === 'all' || activeSection === 'camera') && (
        <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Camera className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">Signature Camera Flight & Pacing</h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'smooth-cinematic', name: 'Smooth Cinematic', desc: 'Gliding curves & wide arcs' },
              { id: 'rhythmic-flight', name: 'Rhythmic Flight', desc: 'Beat-paced transitions' },
              { id: 'energetic-orbit', name: 'Energetic Orbit', desc: 'Curved fly-by reveals' },
              { id: 'slow-dream', name: 'Slow Dream Motion', desc: 'Ethereal drifting float' },
            ].map((style) => (
              <button
                key={style.id}
                onClick={() =>
                  updateConfig((prev) => ({
                    ...prev,
                    cameraStyle: style.id as CameraMovementStyle,
                  }))
                }
                className={`p-3 rounded-xl border text-left transition-all ${
                  config.cameraStyle === style.id
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/10'
                    : 'bg-gray-950/80 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                <div className="text-xs font-bold">{style.name}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">{style.desc}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Flight Speed</span>
                <span className="font-mono text-cyan-300">{config.cameraSpeed.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={config.cameraSpeed}
                onChange={(e) =>
                  updateConfig((prev) => ({ ...prev, cameraSpeed: Number(e.target.value) }))
                }
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Photo Focus Duration</span>
                <span className="font-mono text-cyan-300">{config.photoFocusDuration.toFixed(1)}s</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="6.0"
                step="0.2"
                value={config.photoFocusDuration}
                onChange={(e) =>
                  updateConfig((prev) => ({
                    ...prev,
                    photoFocusDuration: Number(e.target.value),
                  }))
                }
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Transition Smoothness</span>
                <span className="font-mono text-cyan-300">{config.transitionSmoothness}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={config.transitionSmoothness}
                onChange={(e) =>
                  updateConfig((prev) => ({
                    ...prev,
                    transitionSmoothness: Number(e.target.value),
                  }))
                }
                className="w-full accent-cyan-400"
              />
            </div>
          </div>

          {/* Director Mode: Auto vs Manual */}
          <div className="pt-2 flex items-center justify-between border-t border-gray-800/80">
            <div>
              <div className="text-xs font-bold text-white">Camera Director Mode</div>
              <div className="text-[10px] text-gray-400">
                {config.directorMode === 'auto'
                  ? 'Automatic Director: Smooth forward route avoiding repetition & sudden 180° turns'
                  : 'Manual Path: Visited in exact sequence from filmstrip'}
              </div>
            </div>
            <div className="flex space-x-1 bg-gray-950 p-1 rounded-xl border border-gray-800">
              <button
                onClick={() => updateConfig((prev) => ({ ...prev, directorMode: 'auto' }))}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  config.directorMode === 'auto'
                    ? 'bg-cyan-500 text-black shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Auto Director
              </button>
              <button
                onClick={() => updateConfig((prev) => ({ ...prev, directorMode: 'manual' }))}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  config.directorMode === 'manual'
                    ? 'bg-cyan-500 text-black shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Manual Path
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Realistic Depth of Field & Optical Focus */}
      {(activeSection === 'all' || activeSection === 'dof') && (
        <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Aperture className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">Single-Subject Focus & Optical Depth</h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['off', 'subtle', 'cinematic', 'strong'] as DepthOfFieldMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => updateConfig((prev) => ({ ...prev, depthOfField: mode }))}
                className={`p-2.5 rounded-xl border text-center uppercase tracking-wider text-xs font-bold transition-all ${
                  config.depthOfField === mode
                    ? 'bg-cyan-500/20 border-cyan-400 text-white'
                    : 'bg-gray-950/80 border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Focus Pull Speed</span>
                <span className="font-mono text-cyan-300">
                  {config.focusTransitionSpeed.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={config.focusTransitionSpeed}
                onChange={(e) =>
                  updateConfig((prev) => ({
                    ...prev,
                    focusTransitionSpeed: Number(e.target.value),
                  }))
                }
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Background Blur Intensity</span>
                <span className="font-mono text-cyan-300">
                  {config.backgroundBlurIntensity}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={config.backgroundBlurIntensity}
                onChange={(e) =>
                  updateConfig((prev) => ({
                    ...prev,
                    backgroundBlurIntensity: Number(e.target.value),
                  }))
                }
                className="w-full accent-cyan-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* 10. Refined Bass-Impact Micro-Shake */}
      {(activeSection === 'all' || activeSection === 'shake') && (
        <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <div>
                <h4 className="text-sm font-bold text-white">Damped Bass-Impact Micro Shake</h4>
                <p className="text-[10px] text-gray-400">
                  Restrained camera pulse — suppressed during photo focus holds to preserve readability
                </p>
              </div>
            </div>

            <div className="flex space-x-1 bg-gray-950 p-1 rounded-lg border border-gray-800">
              {(
                [
                  { id: 'off', label: 'Off' },
                  { id: 'subtle', label: 'Subtle' },
                  { id: 'balanced', label: 'Balanced' },
                  { id: 'strong', label: 'Strong' },
                ] as { id: BassShakeLevel; label: string }[]
              ).map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() =>
                    updateConfig((prev) => ({
                      ...prev,
                      bassShake: {
                        ...prev.bassShake,
                        level: lvl.id,
                        enabled: lvl.id !== 'off',
                      },
                    }))
                  }
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                    config.bassShake.level === lvl.id
                      ? 'bg-cyan-500 text-black shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {config.bassShake.level !== 'off' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Bass Sensitivity</span>
                  <span className="font-mono text-cyan-300">{config.bassShake.bassSensitivity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={config.bassShake.bassSensitivity}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      bassShake: { ...prev.bassShake, bassSensitivity: Number(e.target.value) },
                    }))
                  }
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Shake Intensity</span>
                  <span className="font-mono text-cyan-300">{config.bassShake.shakeIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={config.bassShake.shakeIntensity}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      bassShake: { ...prev.bassShake, shakeIntensity: Number(e.target.value) },
                    }))
                  }
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 11. Footer Actions: Re-plan Route & Reset Defaults */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => {
            const score = universeEngine.regenerateScore(config, duration)
            showToast(`Re-choreographed camera flight score with ${score.segments.length} segments!`, 'success')
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-cyan-300 rounded-xl text-xs font-semibold border border-cyan-500/20 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Regenerate Camera Route</span>
        </button>

        <button
          onClick={handleReset}
          className="flex items-center space-x-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl text-xs font-bold border border-gray-800 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>
    </div>
  )
}
