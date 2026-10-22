import React from 'react'
import { Music, Volume2, VolumeX, Sliders } from 'lucide-react'
import type { Track } from '../../lib/hybridVideo/types.ts'

interface AudioLibraryPanelProps {
  tracks: Track[]
  onUpdateTrack: (trackId: string, updates: Partial<Track>) => void
}

export const AudioLibraryPanel: React.FC<AudioLibraryPanelProps> = ({
  tracks,
  onUpdateTrack,
}) => {
  const audioTracks = tracks.filter((t) => t.type === 'audio')

  return (
    <div className="flex flex-col h-full bg-[#0D111A] text-white">
      <div className="p-3 border-b border-white/10">
        <h3 className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
          <Music className="w-4 h-4 text-violet-400" />
          Audio & Music Tracks
        </h3>
        <p className="text-[11px] text-white/40 mt-0.5">
          Control audio levels, mute, and track mixing
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {audioTracks.map((track) => (
          <div
            key={track.id}
            className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/90 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-violet-400" />
                {track.name}
              </span>
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
                {track.muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Volume slider */}
            <div>
              <div className="flex justify-between text-[11px] text-white/60 mb-1">
                <span>Track Volume</span>
                <span className="font-mono text-cyan-300">{Math.round(track.volume * 100)}%</span>
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
        ))}
      </div>
    </div>
  )
}
