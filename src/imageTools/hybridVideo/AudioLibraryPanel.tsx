import React, { useState, useEffect, useRef } from 'react'
import {
  Music,
  Volume2,
  VolumeX,
  Mic,
  Sparkles,
  RotateCcw,
  Check,
  Activity,
  ArrowDownRight,
} from 'lucide-react'
import type { Track, TimelineClip, AutoDuckingConfig, AutoDuckingPresetId } from '../../lib/hybridVideo/types.ts'
import { DEFAULT_AUTO_DUCKING } from '../../lib/hybridVideo/types.ts'
import { AUTO_DUCKING_PRESETS } from '../../lib/hybridVideo/autoDuckingEngine.ts'
import { hybridAudio } from '../../lib/hybridVideo/audioTimelineEngine.ts'

interface AudioLibraryPanelProps {
  tracks: Track[]
  clips?: TimelineClip[]
  autoDucking?: AutoDuckingConfig
  onUpdateTrack: (trackId: string, updates: Partial<Track>) => void
  onUpdateAutoDucking?: (config: AutoDuckingConfig) => void
  playheadSec?: number
  isPlaying?: boolean
}

export const AudioLibraryPanel: React.FC<AudioLibraryPanelProps> = ({
  tracks,
  clips = [],
  autoDucking = DEFAULT_AUTO_DUCKING,
  onUpdateTrack,
  onUpdateAutoDucking,
  playheadSec = 0,
  isPlaying = false,
}) => {
  const audioTracks = tracks.filter((t) => t.type === 'audio')
  // Candidates for voice track: audio tracks and video tracks (which can contain speech audio)
  const voiceTrackCandidates = tracks.filter((t) => t.type === 'audio' || t.type === 'video')

  // Live meters state for smooth 60fps UI feedback
  const [voiceLevel, setVoiceLevel] = useState(0) // 0 to 1
  const [gainReductionDb, setGainReductionDb] = useState(0) // 0 to duckAmount
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    let active = true

    const updateMeters = () => {
      if (!active) return

      if (autoDucking.enabled) {
        // Read live analyzer if playing, or envelope reduction at current playhead
        const level = hybridAudio.getVoiceActivityLevel()
        const reduction = hybridAudio.getGainReductionDb(playheadSec)

        setVoiceLevel(level)
        setGainReductionDb(reduction)

        // Threshold check (approximate dB level to 0-1 scale)
        const thresholdNorm = Math.pow(10, autoDucking.thresholdDb / 20)
        setIsVoiceActive(level > thresholdNorm || reduction > 0.5)
      } else {
        setVoiceLevel(0)
        setGainReductionDb(0)
        setIsVoiceActive(false)
      }

      rafIdRef.current = requestAnimationFrame(updateMeters)
    }

    rafIdRef.current = requestAnimationFrame(updateMeters)

    return () => {
      active = false
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [autoDucking.enabled, autoDucking.thresholdDb, playheadSec, isPlaying])

  const handleToggleEnabled = () => {
    if (!onUpdateAutoDucking) return
    onUpdateAutoDucking({
      ...autoDucking,
      enabled: !autoDucking.enabled,
    })
  }

  const handleApplyPreset = (presetId: AutoDuckingPresetId) => {
    if (!onUpdateAutoDucking) return
    const preset = AUTO_DUCKING_PRESETS.find((p) => p.id === presetId)
    if (!preset || !preset.config) return
    onUpdateAutoDucking({
      ...autoDucking,
      preset: presetId,
      duckAmountDb: preset.config.duckAmountDb ?? autoDucking.duckAmountDb,
      thresholdDb: preset.config.thresholdDb ?? autoDucking.thresholdDb,
      attackSec: preset.config.attackSec ?? autoDucking.attackSec,
      holdSec: preset.config.holdSec ?? autoDucking.holdSec,
      releaseSec: preset.config.releaseSec ?? autoDucking.releaseSec,
      minMusicVolume: preset.config.minMusicVolume ?? autoDucking.minMusicVolume,
    })
  }

  const handleResetDefaults = () => {
    if (!onUpdateAutoDucking) return
    onUpdateAutoDucking({
      ...DEFAULT_AUTO_DUCKING,
      voiceTrackId: autoDucking.voiceTrackId || (voiceTrackCandidates[0]?.id ?? 'track-audio-1'),
      targetTrackIds: autoDucking.targetTrackIds.length > 0 ? autoDucking.targetTrackIds : (audioTracks.map(t => t.id)),
    })
  }

  const handleUpdateField = <K extends keyof AutoDuckingConfig>(
    key: K,
    val: AutoDuckingConfig[K]
  ) => {
    if (!onUpdateAutoDucking) return
    onUpdateAutoDucking({
      ...autoDucking,
      preset: 'custom',
      [key]: val,
    })
  }

  const handleToggleTargetTrack = (trackId: string) => {
    if (!onUpdateAutoDucking) return
    const exists = autoDucking.targetTrackIds.includes(trackId)
    const updated = exists
      ? autoDucking.targetTrackIds.filter((id) => id !== trackId)
      : [...autoDucking.targetTrackIds, trackId]
    onUpdateAutoDucking({
      ...autoDucking,
      targetTrackIds: updated,
    })
  }

  return (
    <div className="flex flex-col h-full bg-[#0D111A] text-white">
      {/* Header */}
      <div className="p-3 border-b border-white/10 shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
            <Music className="w-4 h-4 text-violet-400" />
            Audio Mixer & Auto-Ducking
          </h3>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-mono">
            Smart Audio
          </span>
        </div>
        <p className="text-[11px] text-white/40 mt-0.5">
          Control track volumes, smart voice priority ducking, and mix balances
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* ============================================================== */}
        {/* AUTO-DUCKING CARD */}
        {/* ============================================================== */}
        <div
          className={`p-3.5 rounded-xl border transition-all duration-200 ${
            autoDucking.enabled
              ? 'bg-gradient-to-br from-violet-950/30 via-[#101726] to-cyan-950/20 border-violet-500/40 shadow-lg shadow-violet-950/20'
              : 'bg-white/[0.02] border-white/10'
          }`}
        >
          {/* Card Top: Title & Master Switch */}
          <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                  autoDucking.enabled ? 'bg-violet-600 text-white' : 'bg-white/10 text-white/40'
                }`}
              >
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-white">Auto-Ducking</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-medium ${
                      autoDucking.enabled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/10 text-white/40'
                    }`}
                  >
                    {autoDucking.enabled ? 'ACTIVE' : 'BYPASS'}
                  </span>
                </div>
                <p className="text-[10px] text-white/50">
                  Lowers background music when voice is speaking
                </p>
              </div>
            </div>

            {/* Master Toggle */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoDucking.enabled}
                onChange={handleToggleEnabled}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-violet-500 peer-checked:to-cyan-400"></div>
            </label>
          </div>

          {/* Expanded Ducking Controls */}
          {autoDucking.enabled && (
            <div className="mt-3 space-y-3.5">
              {/* One-Click Presets */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-medium text-white/80 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Ducking Presets
                  </span>
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="text-[10px] text-white/50 hover:text-white/80 flex items-center gap-1 transition-colors"
                    title="Reset to defaults"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    Reset
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {(
                    [
                      { id: 'podcast' as const, label: 'Podcast' },
                      { id: 'voice-priority' as const, label: 'Voice Priority' },
                      { id: 'cinematic-dialogue' as const, label: 'Cinematic' },
                      { id: 'subtle-background' as const, label: 'Subtle' },
                    ]
                  ).map((p) => {
                    const isSelected = autoDucking.preset === p.id
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleApplyPreset(p.id)}
                        className={`text-left px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                          isSelected
                            ? 'bg-violet-600/40 border border-violet-400/50 text-violet-200'
                            : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{p.label}</span>
                          {isSelected && <Check className="w-3 h-3 text-cyan-300" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Live Activity & Gain Meters */}
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-white/60 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-cyan-400" />
                    Voice Detection
                  </span>
                  <span
                    className={`font-semibold px-1 rounded text-[9px] ${
                      isVoiceActive
                        ? 'bg-emerald-500/20 text-emerald-300 animate-pulse'
                        : 'text-white/30'
                    }`}
                  >
                    {isVoiceActive ? 'VOICE DETECTED' : 'QUIET'}
                  </span>
                </div>

                {/* Voice Input Meter Bar */}
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full transition-[width] duration-75 rounded-full ${
                        isVoiceActive
                          ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                          : 'bg-cyan-500/40'
                      }`}
                      style={{ width: `${Math.min(100, Math.round(voiceLevel * 100))}%` }}
                    />
                    {/* Threshold marker tick */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-amber-400/80 shadow-[0_0_4px_#fbbf24]"
                      style={{
                        left: `${Math.min(95, Math.max(5, ((autoDucking.thresholdDb + 50) / 45) * 100))}%`,
                      }}
                      title={`Threshold: ${autoDucking.thresholdDb} dB`}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-white/40 font-mono">
                    <span>Input: {Math.round(voiceLevel * 100)}%</span>
                    <span className="text-amber-400/80">Gate: {autoDucking.thresholdDb} dB</span>
                  </div>
                </div>

                {/* Gain Reduction Meter Bar */}
                <div className="pt-1 border-t border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-white/60 flex items-center gap-1">
                      <ArrowDownRight className="w-3 h-3 text-amber-400" />
                      Music Reduction
                    </span>
                    <span className="text-amber-300 font-semibold text-[10px]">
                      {gainReductionDb > 0.1 ? `-${gainReductionDb.toFixed(1)} dB` : '0.0 dB'}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-[width] duration-75 rounded-full"
                      style={{
                        width: `${Math.min(100, Math.max(0, (gainReductionDb / Math.max(1, Math.abs(autoDucking.duckAmountDb))) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Routing: Voice Source Track & Target Music Tracks */}
              <div className="space-y-2 pt-1 border-t border-white/5">
                <span className="text-[11px] font-medium text-white/80">Track Routing</span>

                {/* Voice Source Dropdown */}
                <div>
                  <label className="text-[10px] text-white/50 block mb-1">
                    Voice / Narration Track (Trigger)
                  </label>
                  <select
                    value={autoDucking.voiceTrackId}
                    onChange={(e) => handleUpdateField('voiceTrackId', e.target.value)}
                    className="w-full text-xs bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-violet-400"
                  >
                    {voiceTrackCandidates.map((t) => (
                      <option key={t.id} value={t.id} className="bg-[#0D111A]">
                        {t.name} ({t.type === 'video' ? 'Video Audio' : 'Audio Track'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Ducked Tracks */}
                <div>
                  <label className="text-[10px] text-white/50 block mb-1">
                    Target Background Tracks (To Duck)
                  </label>
                  <div className="space-y-1">
                    {audioTracks.map((t) => {
                      const isTarget = autoDucking.targetTrackIds.includes(t.id)
                      const isVoiceSource = t.id === autoDucking.voiceTrackId
                      return (
                        <label
                          key={t.id}
                          className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors border ${
                            isTarget
                              ? 'bg-violet-950/30 border-violet-500/30 text-white'
                              : 'bg-white/[0.02] border-white/5 text-white/60 hover:text-white/80'
                          } ${isVoiceSource ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <Music className="w-3 h-3 text-violet-400 shrink-0" />
                            <span className="truncate">{t.name}</span>
                            {isVoiceSource && (
                              <span className="text-[9px] text-amber-300 font-mono">(Voice Source)</span>
                            )}
                          </span>
                          <input
                            type="checkbox"
                            checked={isTarget}
                            disabled={isVoiceSource}
                            onChange={() => handleToggleTargetTrack(t.id)}
                            className="rounded accent-violet-500 w-3.5 h-3.5"
                          />
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Fine-Tuning Sliders */}
              <div className="space-y-2.5 pt-1 border-t border-white/5">
                <span className="text-[11px] font-medium text-white/80">Envelope & Tuning</span>

                {/* Duck Amount (dB) */}
                <div>
                  <div className="flex justify-between text-[10px] text-white/60 mb-1">
                    <span>Duck Amount</span>
                    <span className="font-mono text-cyan-300">-{Math.abs(autoDucking.duckAmountDb)} dB</span>
                  </div>
                  <input
                    type="range"
                    min={3}
                    max={30}
                    step={1}
                    value={Math.abs(autoDucking.duckAmountDb)}
                    onChange={(e) => handleUpdateField('duckAmountDb', -Math.abs(Number(e.target.value)))}
                    className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-white/30">
                    <span>-3 dB (Subtle)</span>
                    <span>-30 dB (Heavy)</span>
                  </div>
                </div>

                {/* Voice Detection Threshold (dB) */}
                <div>
                  <div className="flex justify-between text-[10px] text-white/60 mb-1">
                    <span>Voice Threshold</span>
                    <span className="font-mono text-cyan-300">{autoDucking.thresholdDb} dB</span>
                  </div>
                  <input
                    type="range"
                    min={-45}
                    max={-10}
                    step={1}
                    value={autoDucking.thresholdDb}
                    onChange={(e) => handleUpdateField('thresholdDb', Number(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-white/30">
                    <span>-45 dB (Sensitive)</span>
                    <span>-10 dB (Loud only)</span>
                  </div>
                </div>

                {/* Attack & Release Times */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="flex justify-between text-[10px] text-white/60 mb-1">
                      <span>Attack</span>
                      <span className="font-mono text-cyan-300">
                        {Math.round(autoDucking.attackSec * 1000)}ms
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.02}
                      max={0.3}
                      step={0.01}
                      value={autoDucking.attackSec}
                      onChange={(e) => handleUpdateField('attackSec', Number(e.target.value))}
                      className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-white/60 mb-1">
                      <span>Hold</span>
                      <span className="font-mono text-cyan-300">{autoDucking.holdSec}s</span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={2.0}
                      step={0.1}
                      value={autoDucking.holdSec}
                      onChange={(e) => handleUpdateField('holdSec', Number(e.target.value))}
                      className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="flex justify-between text-[10px] text-white/60 mb-1">
                      <span>Release</span>
                      <span className="font-mono text-cyan-300">{autoDucking.releaseSec}s</span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={2.5}
                      step={0.1}
                      value={autoDucking.releaseSec}
                      onChange={(e) => handleUpdateField('releaseSec', Number(e.target.value))}
                      className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-white/60 mb-1">
                      <span>Min Floor</span>
                      <span className="font-mono text-cyan-300">
                        {Math.round(autoDucking.minMusicVolume * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.05}
                      max={0.6}
                      step={0.05}
                      value={autoDucking.minMusicVolume}
                      onChange={(e) => handleUpdateField('minMusicVolume', Number(e.target.value))}
                      className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* INDIVIDUAL AUDIO TRACKS LIST */}
        {/* ============================================================== */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-medium text-white/70">
            <span>Audio Tracks</span>
            <span className="text-[10px] text-white/40">{audioTracks.length} tracks</span>
          </div>

          {audioTracks.map((track) => {
            const isVoiceTrack = autoDucking.enabled && autoDucking.voiceTrackId === track.id
            const isDuckedTrack =
              autoDucking.enabled && autoDucking.targetTrackIds.includes(track.id)

            return (
              <div
                key={track.id}
                className={`p-3 rounded-xl border space-y-2.5 transition-colors ${
                  isVoiceTrack
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : isDuckedTrack
                    ? 'bg-violet-950/20 border-violet-500/30'
                    : 'bg-white/[0.03] border-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <Music className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span className="text-xs font-medium text-white/90 truncate">{track.name}</span>
                    {isVoiceTrack && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] bg-emerald-500/20 text-emerald-300 font-mono">
                        VOICE
                      </span>
                    )}
                    {isDuckedTrack && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] bg-violet-500/20 text-violet-300 font-mono">
                        DUCKED
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdateTrack(track.id, { muted: !track.muted })}
                    className={`p-1.5 rounded-lg transition-colors ${
                      track.muted
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                    }`}
                    title={track.muted ? 'Unmute track' : 'Mute track'}
                  >
                    {track.muted ? (
                      <VolumeX className="w-3.5 h-3.5" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Volume slider */}
                <div>
                  <div className="flex justify-between text-[11px] text-white/60 mb-1">
                    <span>Base Track Volume</span>
                    <span className="font-mono text-cyan-300">
                      {Math.round(track.volume * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={track.volume}
                    disabled={track.muted}
                    onChange={(e) => onUpdateTrack(track.id, { volume: Number(e.target.value) })}
                    className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer disabled:opacity-30"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
