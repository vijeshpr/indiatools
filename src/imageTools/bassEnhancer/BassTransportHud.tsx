/**
 * Bottom Transport HUD Component
 * Full-width waveform scrubber, Spacebar shortcut transport, A/B instant bypass,
 * time readout, and export triggers.
 */

import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Repeat,
  Download,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import { WaveformData } from '../../lib/audio/waveformRenderer'
import { BassExportFormat } from '../../lib/audio/bassEnhancer/types'

interface BassTransportHudProps {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isLooping: boolean
  isBypassed: boolean
  waveformData: WaveformData | null
  onPlayPause: () => void
  onSeek: (timeSec: number) => void
  onVolumeChange: (vol: number) => void
  onToggleMute: () => void
  onToggleLoop: () => void
  onToggleBypass: () => void
  onTriggerExport: (format: BassExportFormat) => void
  disabled?: boolean
}

function formatTime(sec: number): string {
  if (!isFinite(sec) || isNaN(sec)) return '00:00.0'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  const ms = Math.floor((sec % 1) * 10)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`
}

export const BassTransportHud: React.FC<BassTransportHudProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isLooping,
  isBypassed,
  waveformData,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleLoop,
  onToggleBypass,
  onTriggerExport,
  disabled = false,
}) => {
  const scrubberCanvasRef = useRef<HTMLCanvasElement>(null)

  // Render mini waveform in scrubber
  useEffect(() => {
    const canvas = scrubberCanvasRef.current
    if (!canvas || !waveformData) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)

    const peaks = waveformData.peaks
    const count = peaks.length
    const barWidth = w / count
    const progressFraction = duration > 0 ? currentTime / duration : 0
    const progressX = progressFraction * w

    for (let i = 0; i < count; i++) {
      const x = i * barWidth
      const peakVal = peaks[i]
      const barH = Math.max(2, peakVal * (h - 4))
      const y = (h - barH) / 2

      if (x <= progressX) {
        ctx.fillStyle = isBypassed ? '#94a3b8' : '#ff2d55'
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
      }

      ctx.fillRect(x, y, Math.max(1, barWidth - 1), barH)
    }
  }, [waveformData, currentTime, duration, isBypassed])

  // Handle Scrub Click / Drag
  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || duration <= 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    onSeek(fraction * duration)
  }

  const progressPct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0

  return (
    <div className="w-full bg-[#0e0e11]/95 backdrop-blur-2xl border border-white/5 rounded-2xl p-4 md:p-5 shadow-2xl flex flex-col gap-3">
      {/* Waveform Scrubber Bar */}
      <div
        role="progressbar"
        aria-valuenow={currentTime}
        aria-valuemin={0}
        aria-valuemax={duration}
        onClick={handleScrub}
        className={`relative w-full h-11 bg-slate-950 rounded-xl overflow-hidden cursor-pointer border border-white/5 group ${
          disabled ? 'opacity-40 pointer-events-none' : ''
        }`}
      >
        <canvas
          ref={scrubberCanvasRef}
          width={800}
          height={44}
          className="w-full h-full object-cover block pointer-events-none"
        />

        {/* Hover / Playhead indicator */}
        <div
          className={`absolute top-0 bottom-0 w-1 ${
            isBypassed ? 'bg-slate-300' : 'bg-[#ff2d55]'
          } shadow-[0_0_10px_#ff2d55] pointer-events-none transition-all duration-75`}
          style={{ left: `${progressPct}%` }}
        />
      </div>

      {/* Transport Deck Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        {/* Left: Playback Controls */}
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <motion.button
            whileTap={{ scale: 0.94 }}
            type="button"
            disabled={disabled}
            onClick={onPlayPause}
            className={`w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer shadow-lg transition-colors ${
              isPlaying
                ? 'bg-[#ff2d55] text-white shadow-[0_0_20px_rgba(255,45,85,0.45)]'
                : 'bg-white text-black hover:bg-slate-200'
            } disabled:opacity-40`}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </motion.button>

          {/* Loop Button */}
          <button
            type="button"
            disabled={disabled}
            onClick={onToggleLoop}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
              isLooping
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-slate-900 text-slate-400 border-white/5 hover:text-white'
            } disabled:opacity-40`}
            title="Toggle Loop"
          >
            <Repeat className="w-4 h-4" />
          </button>

          {/* Time Display */}
          <div className="font-mono text-xs text-white tracking-wider flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
            <span className="font-bold text-[#ff2d55]">{formatTime(currentTime)}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Center: A/B Instant Bypass Switch */}
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.96 }}
            type="button"
            disabled={disabled}
            onClick={onToggleBypass}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono tracking-wider transition-all flex items-center gap-2 cursor-pointer border shadow-md ${
              isBypassed
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                : 'bg-[#ff2d55]/15 text-[#ff2d55] border-[#ff2d55]/30 hover:bg-[#ff2d55]/25 shadow-[0_0_12px_rgba(255,45,85,0.2)]'
            } disabled:opacity-40`}
          >
            <span className={`w-2 h-2 rounded-full ${isBypassed ? 'bg-rose-400' : 'bg-[#ff2d55]'}`} />
            <span>{isBypassed ? 'A/B: RAW DRY BYPASS' : 'A/B: BASS ENHANCED'}</span>
          </motion.button>
        </div>

        {/* Right: Volume & Export Buttons */}
        <div className="flex items-center gap-3">
          {/* Mute & Volume */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-900/60 border border-white/5 px-2.5 py-1.5 rounded-xl">
            <button
              type="button"
              disabled={disabled}
              onClick={onToggleMute}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              disabled={disabled}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-16 h-1 accent-[#ff2d55] cursor-pointer"
            />
          </div>

          {/* Export 24-bit WAV Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            disabled={disabled}
            onClick={() => onTriggerExport('24bit-wav')}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#ff2d55] to-rose-600 hover:from-rose-500 hover:to-[#ff2d55] text-white shadow-lg shadow-[#ff2d55]/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export 24-Bit WAV</span>
          </motion.button>

          {/* Export MP3 Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            disabled={disabled}
            onClick={() => onTriggerExport('320kbps-mp3')}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 hover:border-white/20 shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>320k MP3</span>
          </motion.button>
        </div>
      </div>
    </div>
  )
}
