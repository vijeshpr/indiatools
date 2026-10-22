import React from 'react'
import {
  Zap,
  Activity,
  Sliders,
  RotateCcw,
  Sparkles,
  Waves,
  Eye,
  Camera,
  Sun,
  Layers,
  HelpCircle,
} from 'lucide-react'
import type {
  MusicReactivityConfig,
  ReactivityMode,
  ReactivityScope,
} from '../../lib/hybridVideo/types.ts'
import type { MusicAnalysisResult } from '../../lib/hybridVideo/musicIntelligence.ts'
import {
  REACTIVITY_PRESETS,
  createReactivityConfig,
  type ReactivityPresetId,
} from '../../lib/hybridVideo/musicReactivityEngine.ts'

interface MusicReactivityPanelProps {
  config: MusicReactivityConfig
  onChangeConfig: (newConfig: MusicReactivityConfig) => void
  onApplyPreset: (presetId: ReactivityPresetId) => void
  onResetReactivity: () => void
  musicAnalysis: MusicAnalysisResult | null
  playheadSec: number
  hasSelectedClip: boolean
  selectedClipName?: string
}

export const MusicReactivityPanel: React.FC<MusicReactivityPanelProps> = ({
  config,
  onChangeConfig,
  onApplyPreset,
  onResetReactivity,
  musicAnalysis,
  playheadSec,
  hasSelectedClip,
  selectedClipName,
}) => {
  const [activeTab, setActiveTab] = React.useState<'presets' | 'camera' | 'lighting' | 'stylized'>('presets')

  const updateSubConfig = <K extends keyof MusicReactivityConfig>(
    key: K,
    val: MusicReactivityConfig[K]
  ) => {
    onChangeConfig({
      ...config,
      [key]: val,
    })
  }

  // Calculate live energy gauge for visual feedback
  const liveEnergy = React.useMemo(() => {
    if (!musicAnalysis?.energyEnvelope || musicAnalysis.energyEnvelope.length === 0) return 0
    const frameIdx = Math.min(
      musicAnalysis.energyEnvelope.length - 1,
      Math.max(0, Math.floor(playheadSec * 20))
    )
    return musicAnalysis.energyEnvelope[frameIdx] || 0
  }, [musicAnalysis, playheadSec])

  return (
    <div className="flex flex-col h-full bg-[#0D111A] text-white">
      {/* Header with Master Switch */}
      <div className="p-3 border-b border-white/10 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white/95">Beat-Synced VFX</h3>
              <p className="text-[10px] text-white/40">Music Reactivity Engine</p>
            </div>
          </div>

          {/* Master Enable/Disable Switch */}
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                config.enabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/10 text-white/40'
              }`}
            >
              {config.enabled ? 'ON' : 'OFF'}
            </span>
            <button
              type="button"
              onClick={() => updateSubConfig('enabled', !config.enabled)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                config.enabled ? 'bg-amber-500' : 'bg-white/20'
              }`}
              title="Toggle Music Reactivity Master Switch"
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  config.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Real-time Beat / Energy Activity Bar */}
        {musicAnalysis && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-white/50">
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400" />
                Live Audio Signal
              </span>
              <span className="font-mono text-cyan-300">
                {musicAnalysis.bpm > 0 ? `${musicAnalysis.bpm} BPM` : 'Analyzed'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-amber-400 to-rose-500 transition-all duration-75"
                style={{ width: `${Math.min(100, Math.round(liveEnergy * 100))}%` }}
              />
            </div>
          </div>
        )}

        {/* Scope Selector */}
        <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/5 rounded-lg text-[10px]">
          <span className="text-white/40 px-1 font-medium">Scope:</span>
          {(['global', 'selected', 'all'] as ReactivityScope[]).map((scopeMode) => (
            <button
              key={scopeMode}
              type="button"
              onClick={() => updateSubConfig('scope', scopeMode)}
              className={`flex-1 py-1 rounded capitalize font-medium transition-colors ${
                config.scope === scopeMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {scopeMode === 'global' ? 'Global' : scopeMode === 'selected' ? 'Selected' : 'All Cuts'}
            </button>
          ))}
        </div>

        {config.scope === 'selected' && !hasSelectedClip && (
          <div className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px]">
            Select a timeline clip to apply per-clip reactivity.
          </div>
        )}
        {config.scope === 'selected' && hasSelectedClip && selectedClipName && (
          <div className="px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] truncate">
            Target clip: <span className="font-medium text-white">{selectedClipName}</span>
          </div>
        )}
      </div>

      {/* Sub-tab navigation */}
      <div className="flex border-b border-white/10 bg-[#090C14]">
        {[
          { id: 'presets', label: 'Presets', icon: Sparkles },
          { id: 'camera', label: 'Motion', icon: Camera },
          { id: 'lighting', label: 'Flash/Bass', icon: Sun },
          { id: 'stylized', label: 'VFX', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 flex items-center justify-center gap-1.5 text-[11px] font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                  : 'border-transparent text-white/50 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* =========================================================================
            TAB 1: PRESETS & MODES
            ========================================================================= */}
        {activeTab === 'presets' && (
          <div className="space-y-4">
            {/* Primary Reactivity Mode Buttons */}
            <div>
              <label className="text-[10px] font-semibold text-white/60 uppercase tracking-wider block mb-1.5">
                Reactivity Mode
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'beat-sync', name: 'Beat Sync', desc: 'Rhythmic beats & cuts' },
                  { id: 'bass-pulse', name: 'Bass Pulse', desc: 'Low-frequency sub-bass' },
                  { id: 'melody-flow', name: 'Melody Flow', desc: 'Smooth phrased motion' },
                  { id: 'balanced', name: 'Balanced', desc: 'Harmonic combination' },
                ].map((modeItem) => {
                  const isSelected = config.mode === modeItem.id
                  return (
                    <button
                      key={modeItem.id}
                      type="button"
                      onClick={() => updateSubConfig('mode', modeItem.id as ReactivityMode)}
                      className={`p-2 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                          : 'bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="text-[11px] font-bold text-white/95">{modeItem.name}</div>
                      <div className="text-[9px] text-white/40 mt-0.5">{modeItem.desc}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 8 Production Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">
                  8 Production Presets
                </label>
                <button
                  type="button"
                  onClick={onResetReactivity}
                  className="flex items-center gap-1 text-[10px] text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Undo Music Sync
                </button>
              </div>

              <div className="space-y-1.5">
                {REACTIVITY_PRESETS.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => onApplyPreset(preset.id)}
                    className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-amber-500/30 cursor-pointer transition-all flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white/90">{preset.name}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300">
                        {preset.tagline}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/45 leading-relaxed">{preset.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: CAMERA MOTION (BEAT SHAKE & ZOOM PUNCH)
            ========================================================================= */}
        {activeTab === 'camera' && (
          <div className="space-y-4">
            {/* Beat Shake Card */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  Beat Shake
                </span>
                <input
                  type="checkbox"
                  checked={config.beatShake.enabled}
                  onChange={(e) =>
                    updateSubConfig('beatShake', { ...config.beatShake, enabled: e.target.checked })
                  }
                  className="accent-amber-400 cursor-pointer w-4 h-4 rounded"
                />
              </div>

              {config.beatShake.enabled && (
                <div className="space-y-2.5 pt-1 border-t border-white/5">
                  <div>
                    <div className="flex justify-between text-[11px] text-white/70">
                      <span>Intensity</span>
                      <span className="font-mono text-amber-300">{config.beatShake.intensity}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={config.beatShake.intensity}
                      onChange={(e) =>
                        updateSubConfig('beatShake', {
                          ...config.beatShake,
                          intensity: Number(e.target.value),
                        })
                      }
                      className="w-full accent-amber-400 h-1 bg-white/10 rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-white/70">
                      <span>Duration</span>
                      <span className="font-mono text-amber-300">
                        {config.beatShake.durationSec.toFixed(2)}s
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.05}
                      max={0.4}
                      step={0.01}
                      value={config.beatShake.durationSec}
                      onChange={(e) =>
                        updateSubConfig('beatShake', {
                          ...config.beatShake,
                          durationSec: Number(e.target.value),
                        })
                      }
                      className="w-full accent-amber-400 h-1 bg-white/10 rounded cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-white/50 block mb-1">Direction</span>
                      <select
                        value={config.beatShake.type}
                        onChange={(e) =>
                          updateSubConfig('beatShake', {
                            ...config.beatShake,
                            type: e.target.value as any,
                          })
                        }
                        className="w-full bg-[#080B12] border border-white/10 rounded px-2 py-1 text-white"
                      >
                        <option value="combined">Combined</option>
                        <option value="horizontal">Horizontal</option>
                        <option value="vertical">Vertical</option>
                        <option value="rotational">Rotational</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-white/50 block mb-1">Trigger</span>
                      <select
                        value={config.beatShake.trigger}
                        onChange={(e) =>
                          updateSubConfig('beatShake', {
                            ...config.beatShake,
                            trigger: e.target.value as any,
                          })
                        }
                        className="w-full bg-[#080B12] border border-white/10 rounded px-2 py-1 text-white"
                      >
                        <option value="strong-beats-only">Strong Beats Only</option>
                        <option value="all-beats">All Detected Beats</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Beat Zoom Punch Card */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  Beat Zoom Punch
                </span>
                <input
                  type="checkbox"
                  checked={config.zoomPunch.enabled}
                  onChange={(e) =>
                    updateSubConfig('zoomPunch', { ...config.zoomPunch, enabled: e.target.checked })
                  }
                  className="accent-cyan-400 cursor-pointer w-4 h-4 rounded"
                />
              </div>

              {config.zoomPunch.enabled && (
                <div className="space-y-2.5 pt-1 border-t border-white/5">
                  <div>
                    <div className="flex justify-between text-[11px] text-white/70">
                      <span>Punch Amount</span>
                      <span className="font-mono text-cyan-300">
                        {config.zoomPunch.amount.toFixed(2)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1.0}
                      max={1.5}
                      step={0.01}
                      value={config.zoomPunch.amount}
                      onChange={(e) =>
                        updateSubConfig('zoomPunch', {
                          ...config.zoomPunch,
                          amount: Number(e.target.value),
                        })
                      }
                      className="w-full accent-cyan-400 h-1 bg-white/10 rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-white/70">
                      <span>Duration</span>
                      <span className="font-mono text-cyan-300">
                        {config.zoomPunch.durationSec.toFixed(2)}s
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.08}
                      max={0.5}
                      step={0.01}
                      value={config.zoomPunch.durationSec}
                      onChange={(e) =>
                        updateSubConfig('zoomPunch', {
                          ...config.zoomPunch,
                          durationSec: Number(e.target.value),
                        })
                      }
                      className="w-full accent-cyan-400 h-1 bg-white/10 rounded cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <span className="text-white/50 block mb-1">Direction</span>
                      <select
                        value={config.zoomPunch.direction}
                        onChange={(e) =>
                          updateSubConfig('zoomPunch', {
                            ...config.zoomPunch,
                            direction: e.target.value as any,
                          })
                        }
                        className="w-full bg-[#080B12] border border-white/10 rounded px-2 py-1 text-white"
                      >
                        <option value="in">Punch In (Zoom In)</option>
                        <option value="out">Punch Out (Zoom Out)</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-white/50 block mb-1">Recovery</span>
                      <select
                        value={config.zoomPunch.recovery}
                        onChange={(e) =>
                          updateSubConfig('zoomPunch', {
                            ...config.zoomPunch,
                            recovery: e.target.value as any,
                          })
                        }
                        className="w-full bg-[#080B12] border border-white/10 rounded px-2 py-1 text-white"
                      >
                        <option value="fast">Fast Recovery</option>
                        <option value="normal">Normal Decay</option>
                        <option value="slow">Slow Release</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Melody Motion Card */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5 text-purple-400" />
                  Melody Motion Drift
                </span>
                <input
                  type="checkbox"
                  checked={config.melodyMotion.enabled}
                  onChange={(e) =>
                    updateSubConfig('melodyMotion', {
                      ...config.melodyMotion,
                      enabled: e.target.checked,
                    })
                  }
                  className="accent-purple-400 cursor-pointer w-4 h-4 rounded"
                />
              </div>

              {config.melodyMotion.enabled && (
                <div className="space-y-2.5 pt-1 border-t border-white/5">
                  <div>
                    <div className="flex justify-between text-[11px] text-white/70">
                      <span>Motion Amount</span>
                      <span className="font-mono text-purple-300">
                        {config.melodyMotion.amount}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={config.melodyMotion.amount}
                      onChange={(e) =>
                        updateSubConfig('melodyMotion', {
                          ...config.melodyMotion,
                          amount: Number(e.target.value),
                        })
                      }
                      className="w-full accent-purple-400 h-1 bg-white/10 rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-white/70">
                      <span>Smoothness Speed</span>
                      <span className="font-mono text-purple-300">
                        {config.melodyMotion.smoothness.toFixed(1)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.2}
                      max={2.0}
                      step={0.1}
                      value={config.melodyMotion.smoothness}
                      onChange={(e) =>
                        updateSubConfig('melodyMotion', {
                          ...config.melodyMotion,
                          smoothness: Number(e.target.value),
                        })
                      }
                      className="w-full accent-purple-400 h-1 bg-white/10 rounded cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: LIGHTING & BASS IMPACT
            ========================================================================= */}
        {activeTab === 'lighting' && (
          <div className="space-y-4">
            {/* Beat Flash / Light Pulse Card */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  Beat Flash / Exposure Burst
                </span>
                <input
                  type="checkbox"
                  checked={config.beatFlash.enabled}
                  onChange={(e) =>
                    updateSubConfig('beatFlash', { ...config.beatFlash, enabled: e.target.checked })
                  }
                  className="accent-amber-400 cursor-pointer w-4 h-4 rounded"
                />
              </div>

              {config.beatFlash.enabled && (
                <div className="space-y-2.5 pt-1 border-t border-white/5">
                  <div>
                    <div className="flex justify-between text-[11px] text-white/70">
                      <span>Flash Intensity</span>
                      <span className="font-mono text-amber-300">{config.beatFlash.intensity}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={config.beatFlash.intensity}
                      onChange={(e) =>
                        updateSubConfig('beatFlash', {
                          ...config.beatFlash,
                          intensity: Number(e.target.value),
                        })
                      }
                      className="w-full accent-amber-400 h-1 bg-white/10 rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-white/70">
                      <span>Duration</span>
                      <span className="font-mono text-amber-300">
                        {config.beatFlash.durationSec.toFixed(2)}s
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.05}
                      max={0.35}
                      step={0.01}
                      value={config.beatFlash.durationSec}
                      onChange={(e) =>
                        updateSubConfig('beatFlash', {
                          ...config.beatFlash,
                          durationSec: Number(e.target.value),
                        })
                      }
                      className="w-full accent-amber-400 h-1 bg-white/10 rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <span className="text-white/50 text-[10px] block mb-1">Burst Color Tint</span>
                    <select
                      value={config.beatFlash.color}
                      onChange={(e) =>
                        updateSubConfig('beatFlash', {
                          ...config.beatFlash,
                          color: e.target.value as any,
                        })
                      }
                      className="w-full bg-[#080B12] border border-white/10 rounded px-2 py-1 text-white text-[10px]"
                    >
                      <option value="neutral-white">Neutral Clean White</option>
                      <option value="warm-amber">Warm Amber Sunburst</option>
                      <option value="cool-cyan">Cool Cyan Laser</option>
                      <option value="neon-pink">Neon Pink Glow</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Bass Low-Frequency Impact Card */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-rose-400" />
                  Sub-Bass Low-Frequency Impact
                </span>
                <input
                  type="checkbox"
                  checked={config.bassImpact.enabled}
                  onChange={(e) =>
                    updateSubConfig('bassImpact', {
                      ...config.bassImpact,
                      enabled: e.target.checked,
                    })
                  }
                  className="accent-rose-400 cursor-pointer w-4 h-4 rounded"
                />
              </div>

              {config.bassImpact.enabled && (
                <div className="space-y-2.5 pt-1 border-t border-white/5">
                  <div>
                    <div className="flex justify-between text-[11px] text-white/70">
                      <span>Impact Intensity</span>
                      <span className="font-mono text-rose-300">{config.bassImpact.intensity}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={config.bassImpact.intensity}
                      onChange={(e) =>
                        updateSubConfig('bassImpact', {
                          ...config.bassImpact,
                          intensity: Number(e.target.value),
                        })
                      }
                      className="w-full accent-rose-400 h-1 bg-white/10 rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-white/70">
                      <span>Sensitivity</span>
                      <span className="font-mono text-rose-300">
                        {config.bassImpact.sensitivity.toFixed(1)}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      value={config.bassImpact.sensitivity}
                      onChange={(e) =>
                        updateSubConfig('bassImpact', {
                          ...config.bassImpact,
                          sensitivity: Number(e.target.value),
                        })
                      }
                      className="w-full accent-rose-400 h-1 bg-white/10 rounded cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: OPTIONAL STYLIZED EFFECTS (VFX)
            ========================================================================= */}
        {activeTab === 'stylized' && (
          <div className="space-y-4">
            {/* Chromatic Aberration */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white/90">
                  RGB Split / Chromatic Twitch
                </span>
                <input
                  type="checkbox"
                  checked={config.chromaticAberration.enabled}
                  onChange={(e) =>
                    updateSubConfig('chromaticAberration', {
                      ...config.chromaticAberration,
                      enabled: e.target.checked,
                    })
                  }
                  className="accent-cyan-400 cursor-pointer w-4 h-4 rounded"
                />
              </div>
              {config.chromaticAberration.enabled && (
                <div>
                  <div className="flex justify-between text-[11px] text-white/70">
                    <span>Intensity</span>
                    <span className="font-mono text-cyan-300">
                      {config.chromaticAberration.intensity}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={config.chromaticAberration.intensity}
                    onChange={(e) =>
                      updateSubConfig('chromaticAberration', {
                        ...config.chromaticAberration,
                        intensity: Number(e.target.value),
                      })
                    }
                    className="w-full accent-cyan-400 h-1 bg-white/10 rounded cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Radial Glow */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white/90">
                  Phrase Radial Glow
                </span>
                <input
                  type="checkbox"
                  checked={config.radialGlow.enabled}
                  onChange={(e) =>
                    updateSubConfig('radialGlow', {
                      ...config.radialGlow,
                      enabled: e.target.checked,
                    })
                  }
                  className="accent-purple-400 cursor-pointer w-4 h-4 rounded"
                />
              </div>
              {config.radialGlow.enabled && (
                <div>
                  <div className="flex justify-between text-[11px] text-white/70">
                    <span>Intensity</span>
                    <span className="font-mono text-purple-300">
                      {config.radialGlow.intensity}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={config.radialGlow.intensity}
                    onChange={(e) =>
                      updateSubConfig('radialGlow', {
                        ...config.radialGlow,
                        intensity: Number(e.target.value),
                      })
                    }
                    className="w-full accent-purple-400 h-1 bg-white/10 rounded cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Vignette Pulse */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white/90">
                  Rhythmic Vignette Pulse
                </span>
                <input
                  type="checkbox"
                  checked={config.vignettePulse.enabled}
                  onChange={(e) =>
                    updateSubConfig('vignettePulse', {
                      ...config.vignettePulse,
                      enabled: e.target.checked,
                    })
                  }
                  className="accent-amber-400 cursor-pointer w-4 h-4 rounded"
                />
              </div>
              {config.vignettePulse.enabled && (
                <div>
                  <div className="flex justify-between text-[11px] text-white/70">
                    <span>Intensity</span>
                    <span className="font-mono text-amber-300">
                      {config.vignettePulse.intensity}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={config.vignettePulse.intensity}
                    onChange={(e) =>
                      updateSubConfig('vignettePulse', {
                        ...config.vignettePulse,
                        intensity: Number(e.target.value),
                      })
                    }
                    className="w-full accent-amber-400 h-1 bg-white/10 rounded cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
