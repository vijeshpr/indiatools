/**
 * IndiaTools — Floating Photo Universe Studio Panel
 * 3D Music-Driven Floating Photo Experience Panel
 * Multi-photo management, signature camera flight, depth of field, bass shake & atmospheric VFX
 */

import React, { useRef, useState } from 'react'
import {
  Upload,
  Plus,
  Trash2,
  Sparkles,
  Camera,
  Activity,
  Zap,
  Sliders,
  MoveLeft,
  MoveRight,
  RotateCcw,
  Eye,
  EyeOff,
  Flame,
  CheckCircle2,
  Compass,
  Layers,
  Aperture,
  Maximize2,
  Minimize2,
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
  DEFAULT_PHOTO_UNIVERSE_CONFIG,
} from '../../lib/photoUniverse/photoUniverseTypes.ts'
import {
  UNIVERSE_PRESETS,
  applyUniversePreset,
} from '../../lib/photoUniverse/photoUniversePresets.ts'

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
  showToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [activeSection, setActiveSection] = useState<'photos' | 'camera' | 'dof' | 'shake' | 'atmosphere' | 'all'>('all')

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

  // Handle Multi-Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newPhotos: UniversePhoto[] = []
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file)
      // Detect natural dimensions asynchronously
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

    updateConfig((prev) => ({
      ...prev,
      enabled: true, // Auto-enable Photo Universe on import
      photos: [...prev.photos, ...newPhotos],
    }))

    showToast(`Imported ${newPhotos.length} photos into 3D Universe!`, 'success')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Move photo left/right in universe
  const handleMovePhoto = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= config.photos.length) return

    updateConfig((prev) => {
      const updated = [...prev.photos]
      const [moved] = updated.splice(index, 1)
      updated.splice(targetIndex, 0, moved)
      return { ...prev, photos: updated }
    })
  }

  // Remove photo
  const handleRemovePhoto = (id: string) => {
    updateConfig((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== id),
      manualOrder: prev.manualOrder.filter((pId) => pId !== id),
    }))
    showToast('Removed photograph from 3D Universe.', 'info')
  }

  // Clear all photos
  const handleClearAllPhotos = () => {
    updateConfig((prev) => ({
      ...prev,
      photos: [],
      manualOrder: [],
    }))
    showToast('Cleared photo universe collection.', 'info')
  }

  // Apply Preset
  const handleApplyPreset = (presetId: string) => {
    updateConfig((prev) => applyUniversePreset(prev, presetId))
    showToast(`Applied preset: ${presetId.replace(/-/g, ' ')}`, 'success')
  }

  // Reset to Defaults
  const handleReset = () => {
    updateConfig((prev) => ({
      ...DEFAULT_PHOTO_UNIVERSE_CONFIG,
      enabled: true,
      photos: prev.photos, // Preserve user's uploaded photos
    }))
    showToast('Reset 3D Photo Universe settings to defaults.', 'info')
  }

  return (
    <div className="space-y-6 text-gray-200">
      {/* 1. Header Bar: Master Enable Toggle & Mode Identity */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-900 via-indigo-950/40 to-gray-900 border border-cyan-500/30 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-white text-base">3D Floating Photo Universe</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                THREE.JS WEBGL
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Virtual cinematic camera flying through floating physical photo frames
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

      {/* 2. Curated Presets Bar */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Cinematic Presets</span>
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

      {/* Hidden File Input for Image Uploads */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handlePhotoUpload}
      />

      {/* 3. Section Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-gray-800 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveSection('all')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeSection === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-gray-400 hover:text-white'
          }`}
        >
          All Controls
        </button>
        <button
          onClick={() => setActiveSection('photos')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeSection === 'photos' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-gray-400 hover:text-white'
          }`}
        >
          Photos ({config.photos.length})
        </button>
        <button
          onClick={() => setActiveSection('camera')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeSection === 'camera' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-gray-400 hover:text-white'
          }`}
        >
          Camera Flight
        </button>
        <button
          onClick={() => setActiveSection('dof')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeSection === 'dof' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-gray-400 hover:text-white'
          }`}
        >
          Depth of Field
        </button>
        <button
          onClick={() => setActiveSection('shake')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeSection === 'shake' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-gray-400 hover:text-white'
          }`}
        >
          Bass Shake
        </button>
        <button
          onClick={() => setActiveSection('atmosphere')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeSection === 'atmosphere' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-gray-400 hover:text-white'
          }`}
        >
          Atmosphere
        </button>
      </div>

      {/* 4. Photo Collection Filmstrip */}
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

      {/* 5. Signature Camera Flight */}
      {(activeSection === 'all' || activeSection === 'camera') && (
        <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Camera className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">Signature Camera Flight</h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'smooth-cinematic', name: 'Smooth Cinematic', desc: 'Gliding curves & wide arcs' },
              { id: 'rhythmic-flight', name: 'Rhythmic Flight', desc: 'Punchy beat acceleration' },
              { id: 'energetic-orbit', name: 'Energetic Orbit', desc: 'Curved corkscrew reveal' },
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
                <span className="font-mono text-cyan-300">{config.cameraSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
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
                max="7.0"
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

      {/* 6. Realistic Depth of Field & Optical Blur */}
      {(activeSection === 'all' || activeSection === 'dof') && (
        <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Aperture className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">Realistic Depth-of-Field & Lens Blur</h4>
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
                <span className="text-gray-400">Focus Transition Speed</span>
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

      {/* 7. Bass-Impact Shake & Physics */}
      {(activeSection === 'all' || activeSection === 'shake') && (
        <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">Bass-Impact Shake & Physics</h4>
            </div>

            <button
              onClick={() =>
                updateConfig((prev) => ({
                  ...prev,
                  bassShake: { ...prev.bassShake, enabled: !prev.bassShake.enabled },
                }))
              }
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                config.bassShake.enabled
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-gray-800 text-gray-500'
              }`}
            >
              {config.bassShake.enabled ? 'SHAKE ENABLED' : 'SHAKE DISABLED'}
            </button>
          </div>

          {config.bassShake.enabled && (
            <div className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    min="10"
                    max="100"
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

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Max Displacement</span>
                    <span className="font-mono text-cyan-300">{config.bassShake.maxDisplacementPx}px</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="24"
                    value={config.bassShake.maxDisplacementPx}
                    onChange={(e) =>
                      updateConfig((prev) => ({
                        ...prev,
                        bassShake: { ...prev.bassShake, maxDisplacementPx: Number(e.target.value) },
                      }))
                    }
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>

              {/* Nearby photo reaction toggle */}
              <div className="flex items-center justify-between p-2.5 bg-gray-950/70 rounded-xl border border-gray-800">
                <div>
                  <div className="text-xs font-bold text-white">Nearby Floating Photo Physical Reaction</div>
                  <div className="text-[10px] text-gray-400">
                    Adjacent photo frames physically tilt and vibrate slightly when bass hits
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.bassShake.nearbyPhotoReaction}
                  onChange={(e) =>
                    updateConfig((prev) => ({
                      ...prev,
                      bassShake: { ...prev.bassShake, nearbyPhotoReaction: e.target.checked },
                    }))
                  }
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 8. Atmospheric & Visual Details */}
      {(activeSection === 'all' || activeSection === 'atmosphere') && (
        <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">Atmosphere & Visual Lighting</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Stardust Particles */}
            <div className="flex items-center justify-between p-3 bg-gray-950/80 rounded-xl border border-gray-800">
              <div>
                <div className="text-xs font-bold text-white">Atmospheric Dust Motes</div>
                <div className="text-[10px] text-gray-400">Floating stardust reacting to treble</div>
              </div>
              <input
                type="checkbox"
                checked={config.visualDetails.particlesEnabled}
                onChange={(e) =>
                  updateConfig((prev) => ({
                    ...prev,
                    visualDetails: {
                      ...prev.visualDetails,
                      particlesEnabled: e.target.checked,
                    },
                  }))
                }
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            {/* Edge Rim Lighting */}
            <div className="flex items-center justify-between p-3 bg-gray-950/80 rounded-xl border border-gray-800">
              <div>
                <div className="text-xs font-bold text-white">Focused Photo Rim Light</div>
                <div className="text-[10px] text-gray-400">Glowing border when approaching target</div>
              </div>
              <input
                type="checkbox"
                checked={config.visualDetails.edgeLightingEnabled}
                onChange={(e) =>
                  updateConfig((prev) => ({
                    ...prev,
                    visualDetails: {
                      ...prev.visualDetails,
                      edgeLightingEnabled: e.target.checked,
                    },
                  }))
                }
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            {/* Travel Light Streaks */}
            <div className="flex items-center justify-between p-3 bg-gray-950/80 rounded-xl border border-gray-800">
              <div>
                <div className="text-xs font-bold text-white">Fast Travel Light Streaks</div>
                <div className="text-[10px] text-gray-400">Subtle acceleration streaks during transition</div>
              </div>
              <input
                type="checkbox"
                checked={config.visualDetails.lightStreaksEnabled}
                onChange={(e) =>
                  updateConfig((prev) => ({
                    ...prev,
                    visualDetails: {
                      ...prev.visualDetails,
                      lightStreaksEnabled: e.target.checked,
                    },
                  }))
                }
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>

            {/* Cinematic Vignette */}
            <div className="flex items-center justify-between p-3 bg-gray-950/80 rounded-xl border border-gray-800">
              <div>
                <div className="text-xs font-bold text-white">Cinematic Vignette</div>
                <div className="text-[10px] text-gray-400">Subtle outer border darkening</div>
              </div>
              <input
                type="checkbox"
                checked={config.visualDetails.vignetteEnabled}
                onChange={(e) =>
                  updateConfig((prev) => ({
                    ...prev,
                    visualDetails: {
                      ...prev.visualDetails,
                      vignetteEnabled: e.target.checked,
                    },
                  }))
                }
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* 9. Reset Settings Action */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleReset}
          className="flex items-center space-x-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl text-xs font-bold border border-gray-800 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Universe Settings</span>
        </button>
      </div>
    </div>
  )
}
