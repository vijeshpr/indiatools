import React, { useRef, useEffect } from 'react'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Maximize,
  Volume2,
  VolumeX,
} from 'lucide-react'
import type { CanvasDimensions } from '../../lib/hybridVideo/types.ts'

interface PreviewPlayerProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  dimensions: CanvasDimensions
  isPlaying: boolean
  onTogglePlay: () => void
  playheadSec: number
  totalDurationSec: number
  onSeek: (timeSec: number) => void
  isLooping: boolean
  onToggleLoop: () => void
}

export const PreviewPlayer: React.FC<PreviewPlayerProps> = ({
  canvasRef,
  dimensions,
  isPlaying,
  onTogglePlay,
  playheadSec,
  totalDurationSec,
  onSeek,
  isLooping,
  onToggleLoop,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const formatTimecode = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    const ms = Math.floor((sec % 1) * 100)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }

  const handleStep = (deltaSec: number) => {
    onSeek(Math.max(0, Math.min(totalDurationSec, playheadSec + deltaSec)))
  }

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(() => {})
      } else {
        document.exitFullscreen().catch(() => {})
      }
    }
  }

  const aspectClass =
    dimensions.aspectRatioId === '9:16'
      ? 'aspect-[9/16] max-h-[72vh]'
      : dimensions.aspectRatioId === '1:1'
      ? 'aspect-square max-h-[70vh]'
      : dimensions.aspectRatioId === '4:5'
      ? 'aspect-[4/5] max-h-[72vh]'
      : 'aspect-video max-h-[72vh]'

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full bg-[#07090E] select-none border-b lg:border-b-0 border-white/10"
    >
      {/* Canvas Viewport */}
      <div className="flex-1 min-h-0 flex items-center justify-center p-3 relative overflow-hidden bg-radial from-white/[0.02] to-transparent">
        {/* Subtle canvas border shadow & aspect ratio container */}
        <div
          className={`relative max-w-full flex items-center justify-center rounded-lg overflow-hidden border border-white/10 bg-[#090A0F] shadow-2xl shadow-black/80 ${aspectClass}`}
        >
          <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="w-full h-full object-contain block"
          />
        </div>
      </div>

      {/* Playback Controls & Timecode Bar */}
      <div className="h-12 bg-[#0B0E16] border-t border-white/10 px-4 flex items-center justify-between shrink-0">
        {/* Timecode */}
        <div className="flex items-center gap-1 font-mono text-xs">
          <span className="text-cyan-300 font-semibold">{formatTimecode(playheadSec)}</span>
          <span className="text-white/30">/</span>
          <span className="text-white/60">{formatTimecode(totalDurationSec)}</span>
        </div>

        {/* Center Playback Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            title="Step Back 1 Frame (1/30s)"
            onClick={() => handleStep(-1 / 30)}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            type="button"
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            onClick={onTogglePlay}
            className="p-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-lg shadow-cyan-500/30 transition-all active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
          </button>

          <button
            type="button"
            title="Step Forward 1 Frame (1/30s)"
            onClick={() => handleStep(1 / 30)}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right Tools: Loop & Fullscreen */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            title={isLooping ? 'Loop Playback (ON)' : 'Loop Playback (OFF)'}
            onClick={onToggleLoop}
            className={`p-1.5 rounded-lg transition-colors ${
              isLooping ? 'bg-cyan-500/20 text-cyan-300' : 'text-white/50 hover:text-white hover:bg-white/10'
            }`}
          >
            <Repeat className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Toggle Fullscreen"
            onClick={handleFullscreen}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
