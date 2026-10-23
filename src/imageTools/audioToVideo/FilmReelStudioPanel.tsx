/**
 * IndiaTools — Film Reel Journey Studio Panel
 * 35mm Vintage Studio Dedicated Editing Suite
 * Continuous 35mm Celluloid Ribbon, Sprocket Perforations, Volumetric Projector Light & Film Grain
 */

import React, { useRef, useState } from 'react'
import {
  Film,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  Camera,
  RotateCcw,
  Eye,
  EyeOff,
  MoveLeft,
  MoveRight,
  Shuffle,
  Music,
  Activity,
  Sliders,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  Sun,
  Layers,
  Image as ImageIcon,
  Aperture,
  Compass,
} from 'lucide-react'
import {
  StudioCompositionConfig,
  NormalizedAudioBands,
} from '../../lib/audioToVideo/types.ts'
import {
  PhotoUniverseStudioConfig,
  UniversePhoto,
  FilmStripPathStyle,
  FilmReelColorGrade,
  ProjectorBeamColor,
  UniverseFilmReelConfig,
  DEFAULT_UNIVERSE_FILM_REEL_CONFIG,
  DEFAULT_PHOTO_UNIVERSE_CONFIG,
  UniverseAudioAnalysisResult,
} from '../../lib/photoUniverse/photoUniverseTypes.ts'
import { universeAudioAnalyzer } from '../../lib/photoUniverse/universeAudioAnalyzer.ts'
import { universeEngine } from '../../lib/photoUniverse/universeEngine.ts'

interface FilmReelStudioPanelProps {
  composition: StudioCompositionConfig
  setComposition: React.Dispatch<React.SetStateAction<StudioCompositionConfig>>
  liveBands?: NormalizedAudioBands
  currentTime?: number
  duration?: number
  audioUrl?: string | null
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void
}

export interface FilmReelPreset {
  id: string
  name: string
  subtitle: string
  accentColor: string
  config: Partial<UniverseFilmReelConfig>
}

export const FILM_REEL_PRESETS: FilmReelPreset[] = [
  {
    id: 'classic-hollywood-1950s',
    name: 'Classic Hollywood 1950s',
    subtitle: 'Warm Amber S-Curve Ribbon',
    accentColor: '#F59E0B',
    config: {
      pathStyle: 's-curve',
      colorGrade: 'warm-amber',
      projectorBeamColor: 'amber-gold',
      warmth: 75,
      filmGrainIntensity: 35,
      projectorLightIntensity: 80,
      cameraSpeed: 0.9,
      focusHoldDuration: 4.2,
      sprocketHoleDetail: 'classic-35mm',
      sprocketGlow: 50,
      celluloidTranslucency: 85,
      dustMotesEnabled: true,
      dustCount: 80,
      gateWeaveIntensity: 20,
      flickerIntensity: 15,
      frameDividersEnabled: true,
      lensStreakEnabled: true,
      ribbonWidthScale: 1.0,
      musicReactive: true,
      cinematicEnding: true,
    },
  },
  {
    id: 'epic-golden-spiral',
    name: 'Epic Golden Spiral',
    subtitle: 'Ascending 3D Helical Galaxy',
    accentColor: '#EAB308',
    config: {
      pathStyle: 'spiral',
      colorGrade: 'warm-amber',
      projectorBeamColor: 'amber-gold',
      warmth: 85,
      filmGrainIntensity: 30,
      projectorLightIntensity: 90,
      cameraSpeed: 0.95,
      focusHoldDuration: 3.8,
      sprocketHoleDetail: 'wide-cinema',
      sprocketGlow: 70,
      celluloidTranslucency: 90,
      dustMotesEnabled: true,
      dustCount: 110,
      gateWeaveIntensity: 15,
      flickerIntensity: 10,
      frameDividersEnabled: true,
      lensStreakEnabled: true,
      ribbonWidthScale: 1.15,
      musicReactive: true,
      cinematicEnding: true,
    },
  },
  {
    id: 'noir-monochrome-1940s',
    name: 'Noir Cinema Monochrome',
    subtitle: 'Silver Celluloid & High Contrast',
    accentColor: '#94A3B8',
    config: {
      pathStyle: 's-curve',
      colorGrade: 'noir-monochrome',
      projectorBeamColor: 'soft-white',
      warmth: 20,
      filmGrainIntensity: 50,
      projectorLightIntensity: 85,
      cameraSpeed: 0.85,
      focusHoldDuration: 4.5,
      sprocketHoleDetail: 'classic-35mm',
      sprocketGlow: 40,
      celluloidTranslucency: 80,
      dustMotesEnabled: true,
      dustCount: 90,
      gateWeaveIntensity: 30,
      flickerIntensity: 25,
      frameDividersEnabled: true,
      lensStreakEnabled: false,
      ribbonWidthScale: 1.0,
      musicReactive: true,
      cinematicEnding: true,
    },
  },
  {
    id: 'technicolor-dream-corridor',
    name: 'Technicolor Dream Corridor',
    subtitle: 'Infinite Perspective Tunnel',
    accentColor: '#EC4899',
    config: {
      pathStyle: 'infinite-tunnel',
      colorGrade: 'classic-technicolor',
      projectorBeamColor: 'tungsten-warm',
      warmth: 80,
      filmGrainIntensity: 25,
      projectorLightIntensity: 85,
      cameraSpeed: 1.0,
      focusHoldDuration: 3.5,
      sprocketHoleDetail: 'wide-cinema',
      sprocketGlow: 65,
      celluloidTranslucency: 88,
      dustMotesEnabled: true,
      dustCount: 100,
      gateWeaveIntensity: 12,
      flickerIntensity: 12,
      frameDividersEnabled: true,
      lensStreakEnabled: true,
      ribbonWidthScale: 1.05,
      musicReactive: true,
      cinematicEnding: true,
    },
  },
]

export const FilmReelStudioPanel: React.FC<FilmReelStudioPanelProps> = ({
  composition,
  setComposition,
  duration = 30,
  audioUrl,
  showToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'ribbon' | 'lighting' | 'camera' | 'atmosphere' | 'gallery'
  >('all')

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [analysisProgress, setAnalysisProgress] = useState<number>(0)
  const [analysisResult, setAnalysisResult] = useState<UniverseAudioAnalysisResult | null>(() => {
    return universeEngine.getAudioAnalysis()
  })

  const universeConfig: PhotoUniverseStudioConfig =
    composition.photoUniverse || DEFAULT_PHOTO_UNIVERSE_CONFIG

  const filmReel: UniverseFilmReelConfig =
    universeConfig.filmReel || DEFAULT_UNIVERSE_FILM_REEL_CONFIG

  const updateFilmReel = (
    updater: (prev: UniverseFilmReelConfig) => UniverseFilmReelConfig
  ) => {
    setComposition((prev) => {
      const currentUniverse = prev.photoUniverse || DEFAULT_PHOTO_UNIVERSE_CONFIG
      const currentReel = currentUniverse.filmReel || DEFAULT_UNIVERSE_FILM_REEL_CONFIG
      return {
        ...prev,
        photoUniverse: {
          ...currentUniverse,
          enabled: true,
          filmReel: updater(currentReel),
        },
      }
    })
  }

  const updatePhotos = (
    updater: (prev: UniversePhoto[]) => UniversePhoto[]
  ) => {
    setComposition((prev) => {
      const currentUniverse = prev.photoUniverse || DEFAULT_PHOTO_UNIVERSE_CONFIG
      return {
        ...prev,
        photoUniverse: {
          ...currentUniverse,
          photos: updater(currentUniverse.photos || []),
        },
      }
    })
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
      const result = await universeAudioAnalyzer.analyzeAudioTrack(
        audioUrl,
        (progress: number) => setAnalysisProgress(Math.round(progress))
      )
      setAnalysisResult(result)
      universeEngine.setAnalysisResult(result)

      updateFilmReel((prev) => ({
        ...prev,
        cameraSpeed: result.recommendedBaseSpeed || prev.cameraSpeed,
        focusHoldDuration: result.recommendedHoldDuration || prev.focusHoldDuration,
      }))

      showToast(`Audio analysis complete! Detected profile: ${result.detectedProfile}`, 'success')
    } catch {
      const fallback = universeAudioAnalyzer.generateFallbackAnalysis(duration, 'balanced-cinematic')
      setAnalysisResult(fallback)
      universeEngine.setAnalysisResult(fallback)
      showToast('Calculated adaptive rhythm timeline from track length.', 'info')
    } finally {
      setIsAnalyzing(false)
      setAnalysisProgress(0)
    }
  }

  // Photo Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newPhotos: UniversePhoto[] = []
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return
      const url = URL.createObjectURL(file)
      newPhotos.push({
        id: `reel_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        url,
        name: file.name,
        aspectRatio: 16 / 9,
      })
    })

    if (newPhotos.length > 0) {
      updatePhotos((prev) => [...prev, ...newPhotos])
      // Ensure Film Reel is active when uploading
      updateFilmReel((prev) => ({ ...prev, enabled: true }))
      showToast(`Added ${newPhotos.length} photo(s) to Film Reel`, 'success')
    }

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Remove Photo
  const handleRemovePhoto = (id: string) => {
    updatePhotos((prev) => prev.filter((p) => p.id !== id))
    showToast('Removed photo from Film Reel', 'info')
  }

  // Move Photo
  const handleMovePhoto = (index: number, direction: 'left' | 'right') => {
    updatePhotos((prev) => {
      const next = [...prev]
      const targetIndex = direction === 'left' ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= next.length) return prev
      const temp = next[index]
      next[index] = next[targetIndex]
      next[targetIndex] = temp
      return next
    })
  }

  // Shuffle Photos
  const handleShufflePhotos = () => {
    updatePhotos((prev) => {
      const next = [...prev]
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[next[i], next[j]] = [next[j], next[i]]
      }
      return next
    })
    showToast('Shuffled film frames sequence', 'info')
  }

  // Apply Film Reel Preset
  const handleApplyPreset = (preset: FilmReelPreset) => {
    updateFilmReel((prev) => ({
      ...prev,
      ...preset.config,
      enabled: true,
    }))
    showToast(`Applied preset: ${preset.name}`, 'success')
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* 1. HERO HEADER BANNER */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-yellow-950/20 to-black border border-amber-500/40 shadow-xl shadow-amber-950/20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500/25 to-yellow-600/10 border border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/20">
              <Film className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-white tracking-wide">
                  Film Reel Journey
                </h3>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50">
                  35mm Vintage Studio
                </span>
              </div>
              <p className="text-xs text-amber-200/70 mt-0.5">
                Continuous 35mm celluloid ribbon, sprocket perforations, volumetric projector light & film grain
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            {/* Reset Defaults */}
            <button
              type="button"
              onClick={() => {
                updateFilmReel(() => ({
                  ...DEFAULT_UNIVERSE_FILM_REEL_CONFIG,
                  enabled: true,
                }))
                showToast('Reset Film Reel settings to defaults', 'info')
              }}
              className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 transition-all cursor-pointer"
              title="Reset Film Reel to defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Master Active / Disabled Switch */}
            <button
              type="button"
              onClick={() =>
                updateFilmReel((prev) => ({
                  ...prev,
                  enabled: !prev.enabled,
                }))
              }
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-lg ${
                filmReel.enabled
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-amber-500/30'
                  : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {filmReel.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>{filmReel.enabled ? 'STUDIO ACTIVE' : 'DISABLED'}</span>
            </button>
          </div>
        </div>

        {/* 2. Curated Style Presets */}
        <div className="space-y-1.5 pt-2 border-t border-amber-500/20">
          <span className="text-[11px] font-semibold text-amber-300/80">
            Curated Film Reel Presets
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {FILM_REEL_PRESETS.map((preset) => {
              const isActive =
                filmReel.enabled &&
                filmReel.pathStyle === preset.config.pathStyle &&
                filmReel.colorGrade === preset.config.colorGrade
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-950/60 border-amber-400 text-white shadow-md shadow-amber-950/50'
                      : 'bg-black/40 border-gray-800/80 text-gray-400 hover:border-gray-700 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: preset.accentColor }}
                    />
                    <span className="text-xs font-bold text-white truncate">
                      {preset.name}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">
                    {preset.subtitle}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 3. MULTI-PHOTO FILMSTRIP MANAGER */}
      <div className="p-4 rounded-2xl bg-gray-950/60 border border-gray-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white">Filmstrip Photos</h4>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
              {universeConfig.photos?.length || 0} frames
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleShufflePhotos}
              disabled={!universeConfig.photos || universeConfig.photos.length < 2}
              className="px-2.5 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-xs text-gray-300 hover:text-white hover:bg-gray-800 disabled:opacity-40 transition-colors flex items-center space-x-1.5 cursor-pointer"
              title="Shuffle photo sequence"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Photos</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>
        </div>

        {/* Photos Horizontal Filmstrip */}
        {universeConfig.photos && universeConfig.photos.length > 0 ? (
          <div className="flex space-x-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-gray-800">
            {universeConfig.photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative shrink-0 w-32 rounded-xl overflow-hidden border border-amber-500/30 bg-black/60 shadow-md"
              >
                <div className="aspect-[16/10] bg-gray-900 relative overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-amber-300 font-bold border border-amber-500/40">
                    #{index + 1}
                  </div>
                </div>

                <div className="p-1.5 bg-gray-950 flex items-center justify-between border-t border-gray-800">
                  <div className="flex items-center space-x-0.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMovePhoto(index, 'left')}
                      className="p-1 rounded text-gray-400 hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Move Left"
                    >
                      <MoveLeft className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={index === universeConfig.photos.length - 1}
                      onClick={() => handleMovePhoto(index, 'right')}
                      className="p-1 rounded text-gray-400 hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Move Right"
                    >
                      <MoveRight className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-950/40 cursor-pointer"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-6 rounded-xl border border-dashed border-amber-500/30 bg-amber-950/10 text-center cursor-pointer hover:border-amber-400 transition-colors"
          >
            <Upload className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-80" />
            <div className="text-xs font-bold text-white">Click or drag photos here to load into 35mm filmstrip</div>
            <div className="text-[11px] text-gray-400 mt-1">Supports JPG, PNG, WebP (Landscape & Portrait supported)</div>
          </div>
        )}
      </div>

      {/* 4. SECTION FILTER TABS */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1 text-xs border-b border-gray-800">
        {[
          { id: 'all', label: 'All Settings' },
          { id: 'ribbon', label: '35mm Ribbon & Path' },
          { id: 'lighting', label: 'Projector Light' },
          { id: 'camera', label: 'Flight & Pacing' },
          { id: 'atmosphere', label: 'Film Grain & Vignette' },
          { id: 'gallery', label: 'Visual Reference Gallery' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer font-medium ${
              activeFilter === tab.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 5. 35MM RIBBON & PATH SETTINGS */}
      {(activeFilter === 'all' || activeFilter === 'ribbon') && (
        <div className="p-4 rounded-2xl bg-gray-950/60 border border-gray-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Film className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white">35mm Ribbon & Path Style</h4>
          </div>

          {/* Path Style */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-gray-300">Continuous 3D Spline Path</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                {
                  id: 's-curve' as FilmStripPathStyle,
                  name: 'S-Curve Ribbon',
                  desc: 'Serpentine curve winding through 3D space with cinematic glide',
                },
                {
                  id: 'spiral' as FilmStripPathStyle,
                  name: 'Helical Spiral',
                  desc: 'Ascending cinema spiral around central projector beam',
                },
                {
                  id: 'infinite-tunnel' as FilmStripPathStyle,
                  name: 'Infinite Tunnel',
                  desc: 'Forward perspective corridor with vintage waves',
                },
              ].map((style) => {
                const isSelected = (filmReel.pathStyle ?? 's-curve') === style.id
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => updateFilmReel((prev) => ({ ...prev, pathStyle: style.id }))}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500 text-amber-200 shadow-md shadow-amber-950/50'
                        : 'bg-black/40 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>{style.name}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-tight">
                      {style.desc}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Celluloid Tint & Color Grade */}
          <div className="space-y-2 pt-2 border-t border-gray-800/80">
            <span className="text-xs font-medium text-gray-300">Celluloid Film Base & Color Grade</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'warm-amber' as FilmReelColorGrade, name: 'Warm Amber', color: '#F59E0B' },
                { id: 'vintage-sepia' as FilmReelColorGrade, name: 'Vintage Sepia', color: '#D97706' },
                { id: 'noir-monochrome' as FilmReelColorGrade, name: 'Noir Monochrome', color: '#94A3B8' },
                { id: 'classic-technicolor' as FilmReelColorGrade, name: 'Technicolor', color: '#EC4899' },
              ].map((grade) => {
                const isSelected = (filmReel.colorGrade ?? 'warm-amber') === grade.id
                return (
                  <button
                    key={grade.id}
                    type="button"
                    onClick={() => updateFilmReel((prev) => ({ ...prev, colorGrade: grade.id }))}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/50 border-amber-500 text-amber-200'
                        : 'bg-black/40 border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: grade.color }} />
                      <span className="text-xs font-bold text-white truncate">{grade.name}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sprockets & Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-800/80">
            {/* Celluloid Translucency */}
            <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-gray-800/60">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Celluloid Translucency</span>
                <span className="text-amber-300 font-mono">{filmReel.celluloidTranslucency ?? 85}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={filmReel.celluloidTranslucency ?? 85}
                onChange={(e) =>
                  updateFilmReel((prev) => ({ ...prev, celluloidTranslucency: Number(e.target.value) }))
                }
                className="w-full accent-amber-400"
              />
            </div>

            {/* Sprocket Perforation Glow */}
            <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-gray-800/60">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Sprocket Hole Rim Glow</span>
                <span className="text-amber-300 font-mono">{filmReel.sprocketGlow ?? 50}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={filmReel.sprocketGlow ?? 50}
                onChange={(e) =>
                  updateFilmReel((prev) => ({ ...prev, sprocketGlow: Number(e.target.value) }))
                }
                className="w-full accent-amber-400"
              />
            </div>

            {/* Ribbon Width Scale */}
            <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-gray-800/60">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Ribbon Width Scale</span>
                <span className="text-amber-300 font-mono">{(filmReel.ribbonWidthScale ?? 1.0).toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.4"
                step="0.05"
                value={filmReel.ribbonWidthScale ?? 1.0}
                onChange={(e) =>
                  updateFilmReel((prev) => ({ ...prev, ribbonWidthScale: Number(e.target.value) }))
                }
                className="w-full accent-amber-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. PROJECTOR & LIGHTING SETTINGS */}
      {(activeFilter === 'all' || activeFilter === 'lighting') && (
        <div className="p-4 rounded-2xl bg-gray-950/60 border border-gray-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Sun className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white">Vintage Projector Lighting</h4>
          </div>

          {/* Projector Beam Color */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-gray-300">Projector Lamp Color Temperature</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'amber-gold' as ProjectorBeamColor, name: 'Amber Gold (2400K)', color: '#F59E0B' },
                { id: 'tungsten-warm' as ProjectorBeamColor, name: 'Tungsten Warm (3200K)', color: '#FFB74D' },
                { id: 'soft-white' as ProjectorBeamColor, name: 'Soft White (5500K)', color: '#F8FAFC' },
                { id: 'sepia-glow' as ProjectorBeamColor, name: 'Sepia Glow (2000K)', color: '#D97706' },
              ].map((lamp) => {
                const isSelected = (filmReel.projectorBeamColor ?? 'amber-gold') === lamp.id
                return (
                  <button
                    key={lamp.id}
                    type="button"
                    onClick={() => updateFilmReel((prev) => ({ ...prev, projectorBeamColor: lamp.id }))}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/50 border-amber-500 text-amber-200'
                        : 'bg-black/40 border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lamp.color }} />
                      <span className="text-xs font-bold text-white truncate">{lamp.name}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Projector Beam Intensity */}
            <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-gray-800/60">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Beam Intensity</span>
                <span className="text-amber-300 font-mono">{filmReel.projectorLightIntensity ?? 75}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={filmReel.projectorLightIntensity ?? 75}
                onChange={(e) =>
                  updateFilmReel((prev) => ({ ...prev, projectorLightIntensity: Number(e.target.value) }))
                }
                className="w-full accent-amber-400"
              />
            </div>

            {/* Shutter Lamp Flicker */}
            <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-gray-800/60">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Shutter Lamp Flicker</span>
                <span className="text-amber-300 font-mono">{filmReel.flickerIntensity ?? 15}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={filmReel.flickerIntensity ?? 15}
                onChange={(e) =>
                  updateFilmReel((prev) => ({ ...prev, flickerIntensity: Number(e.target.value) }))
                }
                className="w-full accent-amber-400"
              />
            </div>

            {/* Dust Motes Count */}
            <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-gray-800/60">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Atmospheric Dust Particles</span>
                <span className="text-amber-300 font-mono">{filmReel.dustCount ?? 80} motes</span>
              </div>
              <input
                type="range"
                min="20"
                max="150"
                value={filmReel.dustCount ?? 80}
                onChange={(e) =>
                  updateFilmReel((prev) => ({ ...prev, dustCount: Number(e.target.value) }))
                }
                className="w-full accent-amber-400"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-800/80">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-gray-800">
              <div>
                <span className="text-xs text-gray-200 font-medium block">Anamorphic Lens Streak</span>
                <span className="text-[10px] text-gray-400 block">Cinematic horizontal projector beam flare</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateFilmReel((prev) => ({ ...prev, lensStreakEnabled: !(prev.lensStreakEnabled ?? true) }))
                }
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  filmReel.lensStreakEnabled ?? true
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-gray-800 text-gray-500'
                }`}
              >
                {filmReel.lensStreakEnabled ?? true ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-gray-800">
              <div>
                <span className="text-xs text-gray-200 font-medium block">Music Rhythm Reactivity</span>
                <span className="text-[10px] text-gray-400 block">Projector beam pulses with bass energy</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateFilmReel((prev) => ({ ...prev, musicReactive: !(prev.musicReactive ?? true) }))
                }
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                  filmReel.musicReactive ?? true
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-gray-800 text-gray-500'
                }`}
              >
                {filmReel.musicReactive ?? true ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. CAMERA FLIGHT & PACING */}
      {(activeFilter === 'all' || activeFilter === 'camera') && (
        <div className="p-4 rounded-2xl bg-gray-950/60 border border-gray-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Camera className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white">Camera Flight & Pacing</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Camera Speed */}
            <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-gray-800/60">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Camera Speed</span>
                <span className="text-amber-300 font-mono">{(filmReel.cameraSpeed ?? 0.9).toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={filmReel.cameraSpeed ?? 0.9}
                onChange={(e) =>
                  updateFilmReel((prev) => ({ ...prev, cameraSpeed: Number(e.target.value) }))
                }
                className="w-full accent-amber-400"
              />
            </div>

            {/* Focus Hold Duration */}
            <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-gray-800/60">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Photo Focus Hold Duration</span>
                <span className="text-amber-300 font-mono">{(filmReel.focusHoldDuration ?? 4.2).toFixed(1)}s</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="8.0"
                step="0.2"
                value={filmReel.focusHoldDuration ?? 4.2}
                onChange={(e) =>
                  updateFilmReel((prev) => ({ ...prev, focusHoldDuration: Number(e.target.value) }))
                }
                className="w-full accent-amber-400"
              />
            </div>

            {/* Gate Weave Jitter */}
            <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-gray-800/60">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Gate Weave (Analog Jitter)</span>
                <span className="text-amber-300 font-mono">{filmReel.gateWeaveIntensity ?? 20}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={filmReel.gateWeaveIntensity ?? 20}
                onChange={(e) =>
                  updateFilmReel((prev) => ({ ...prev, gateWeaveIntensity: Number(e.target.value) }))
                }
                className="w-full accent-amber-400"
              />
            </div>
          </div>

          {/* Grand Finale Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-gray-800">
            <div>
              <span className="text-xs text-white font-bold block">Cinematic Grand Finale Formation</span>
              <span className="text-[11px] text-gray-400 block">
                Pulls back in the final 12% of duration into a panoramic wide view of the complete film strip formation
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                updateFilmReel((prev) => ({ ...prev, cinematicEnding: !(prev.cinematicEnding ?? true) }))
              }
              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                filmReel.cinematicEnding ?? true
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-gray-800 text-gray-500'
              }`}
            >
              {filmReel.cinematicEnding ?? true ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      )}

      {/* 8. FILM GRAIN & VIGNETTE */}
      {(activeFilter === 'all' || activeFilter === 'atmosphere') && (
        <div className="p-4 rounded-2xl bg-gray-950/60 border border-gray-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white">Vintage Film Atmosphere & Grain</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Film Grain */}
            <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-gray-800/60">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Procedural 35mm Film Grain</span>
                <span className="text-amber-300 font-mono">{filmReel.filmGrainIntensity ?? 35}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={filmReel.filmGrainIntensity ?? 35}
                onChange={(e) =>
                  updateFilmReel((prev) => ({ ...prev, filmGrainIntensity: Number(e.target.value) }))
                }
                className="w-full accent-amber-400"
              />
            </div>

            {/* Amber Warmth */}
            <div className="space-y-1 bg-black/40 p-2.5 rounded-xl border border-gray-800/60">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-400">Atmosphere Warmth</span>
                <span className="text-amber-300 font-mono">{filmReel.warmth ?? 70}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={filmReel.warmth ?? 70}
                onChange={(e) =>
                  updateFilmReel((prev) => ({ ...prev, warmth: Number(e.target.value) }))
                }
                className="w-full accent-amber-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* 9. VISUAL REFERENCE ASSET GALLERY */}
      {(activeFilter === 'all' || activeFilter === 'gallery') && (
        <div className="p-4 rounded-2xl bg-gray-950/60 border border-gray-800 space-y-3">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white">Visual Reference Gallery (Assets A–E)</h4>
          </div>
          <p className="text-xs text-gray-400">
            Dedicated cinematic 16:9 renders establishing the aesthetic direction of Film Reel Journey.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 pt-1">
            {[
              {
                id: 'A',
                title: 'Asset A: Hero Film Strip',
                desc: 'Continuous 35mm S-curve ribbon',
                src: '/images/filmReel/hero-film-strip.jpg',
              },
              {
                id: 'B',
                title: 'Asset B: Vintage Reel',
                desc: 'Brushed dark metal 35mm reel',
                src: '/images/filmReel/vintage-film-reel.jpg',
              },
              {
                id: 'C',
                title: 'Asset C: Projector Beam',
                desc: 'Atmospheric light beam with dust',
                src: '/images/filmReel/projector-light-atmosphere.jpg',
              },
              {
                id: 'D',
                title: 'Asset D: Frame Transition',
                desc: 'Glide past embedded photographs',
                src: '/images/filmReel/film-frame-transition.jpg',
              },
              {
                id: 'E',
                title: 'Asset E: Grand Finale',
                desc: 'Epic wide cosmic ribbon spiral',
                src: '/images/filmReel/grand-finale-composition.jpg',
              },
            ].map((asset) => (
              <div
                key={asset.id}
                className="group relative rounded-xl overflow-hidden border border-gray-800 bg-black/80 hover:border-amber-500/50 transition-all shadow-md"
              >
                <div className="aspect-[16/9] overflow-hidden bg-gray-900">
                  <img
                    src={asset.src}
                    alt={asset.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-2 bg-gray-950/90 border-t border-gray-800">
                  <div className="text-[11px] font-bold text-white truncate">{asset.title}</div>
                  <div className="text-[9px] text-gray-400 line-clamp-1">{asset.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
