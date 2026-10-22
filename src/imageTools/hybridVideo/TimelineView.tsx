import React, { useRef, useState, useEffect } from 'react'
import {
  Scissors,
  Trash2,
  Magnet,
  ZoomIn,
  ZoomOut,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Type,
  Video,
  Image as ImageIcon,
  Music,
} from 'lucide-react'
import type { TimelineClip, Track } from '../../lib/hybridVideo/types.ts'
import { findSnapTime, splitClipAtTime, trimClipStart, trimClipEnd } from '../../lib/hybridVideo/timelineEngine.ts'

interface TimelineViewProps {
  tracks: Track[]
  clips: TimelineClip[]
  selectedClipId: string | null
  onSelectClip: (clipId: string | null) => void
  playheadSec: number
  totalDurationSec: number
  onSeek: (timeSec: number) => void
  onUpdateClip: (clipId: string, updates: Partial<TimelineClip>) => void
  onDeleteClip: (clipId: string) => void
  onSplitClip: (clipId: string, splitTimeSec: number) => void
  onUpdateTrack: (trackId: string, updates: Partial<Track>) => void
  musicBeats?: number[]
  musicPhrases?: number[]
  showMusicMarkers?: boolean
  onToggleMusicMarkers?: () => void
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  tracks,
  clips,
  selectedClipId,
  onSelectClip,
  playheadSec,
  totalDurationSec,
  onSeek,
  onUpdateClip,
  onDeleteClip,
  onSplitClip,
  onUpdateTrack,
  musicBeats = [],
  musicPhrases = [],
  showMusicMarkers = true,
  onToggleMusicMarkers,
}) => {
  const [pxPerSec, setPxPerSec] = useState(60) // timeline zoom level
  const [snapEnabled, setSnapEnabled] = useState(true)
  const tracksContainerRef = useRef<HTMLDivElement>(null)

  // Dragging state
  const [dragState, setDragState] = useState<{
    type: 'move' | 'trim-start' | 'trim-end' | 'playhead'
    clipId?: string
    initialMouseX: number
    initialStartSec?: number
    initialDurationSec?: number
    initialTrimStartSec?: number
  } | null>(null)

  // Zoom handlers
  const handleZoom = (delta: number) => {
    setPxPerSec((prev) => Math.max(20, Math.min(200, prev + delta)))
  }

  // Pointer drag listeners
  useEffect(() => {
    if (!dragState) return

    const handlePointerMove = (e: PointerEvent) => {
      const deltaPx = e.clientX - dragState.initialMouseX
      const deltaSec = deltaPx / pxPerSec

      if (dragState.type === 'playhead') {
        if (!tracksContainerRef.current) return
        const rect = tracksContainerRef.current.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const targetSec = Math.max(0, Math.min(totalDurationSec, clickX / pxPerSec))
        onSeek(targetSec)
      } else if (dragState.type === 'move' && dragState.clipId) {
        const rawNewStart = Math.max(0, (dragState.initialStartSec || 0) + deltaSec)
        const snap = snapEnabled
          ? findSnapTime(rawNewStart, pxPerSec, clips, playheadSec, dragState.clipId)
          : { snappedTimeSec: rawNewStart, didSnap: false }

        onUpdateClip(dragState.clipId, { startSec: Math.max(0, snap.snappedTimeSec) })
      } else if (dragState.type === 'trim-start' && dragState.clipId) {
        const rawNewStart = Math.max(0, (dragState.initialStartSec || 0) + deltaSec)
        const clip = clips.find((c) => c.id === dragState.clipId)
        if (clip) {
          const trimmed = trimClipStart(clip, rawNewStart)
          onUpdateClip(dragState.clipId, trimmed)
        }
      } else if (dragState.type === 'trim-end' && dragState.clipId) {
        const rawNewEnd = Math.max(0.2, (dragState.initialStartSec || 0) + (dragState.initialDurationSec || 0) + deltaSec)
        const clip = clips.find((c) => c.id === dragState.clipId)
        if (clip) {
          const trimmed = trimClipEnd(clip, rawNewEnd)
          onUpdateClip(dragState.clipId, trimmed)
        }
      }
    }

    const handlePointerUp = () => {
      setDragState(null)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [dragState, pxPerSec, snapEnabled, clips, playheadSec, totalDurationSec, onSeek, onUpdateClip])

  // Split selected clip at playhead
  const handleSplit = () => {
    if (!selectedClipId) return
    onSplitClip(selectedClipId, playheadSec)
  }

  const timelineWidthPx = Math.max(1200, (totalDurationSec + 5) * pxPerSec)

  return (
    <div className="flex flex-col h-full bg-[#0A0D14] border-t border-white/10 select-none">
      {/* Timeline Action Header */}
      <div className="h-10 bg-[#0E121B] border-b border-white/10 px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {/* Split button */}
          <button
            type="button"
            title="Split selected clip at playhead (S)"
            disabled={!selectedClipId}
            onClick={handleSplit}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-xs text-white/80 hover:text-white transition-colors"
          >
            <Scissors className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Split (S)</span>
          </button>

          {/* Delete clip button */}
          <button
            type="button"
            title="Delete selected clip (Delete)"
            disabled={!selectedClipId}
            onClick={() => selectedClipId && onDeleteClip(selectedClipId)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-red-500/20 disabled:opacity-30 disabled:pointer-events-none text-xs text-white/60 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>

          {/* Snap toggle */}
          <button
            type="button"
            title={snapEnabled ? 'Magnetic Snapping (ON)' : 'Magnetic Snapping (OFF)'}
            onClick={() => setSnapEnabled(!snapEnabled)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-colors ${
              snapEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'text-white/40 hover:text-white'
            }`}
          >
            <Magnet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Snap</span>
          </button>

          {/* Music Markers toggle */}
          {onToggleMusicMarkers && (
            <button
              type="button"
              title={showMusicMarkers ? 'Music Beat & Phrase Markers (Visible)' : 'Music Beat & Phrase Markers (Hidden)'}
              onClick={onToggleMusicMarkers}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-colors ${
                showMusicMarkers ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-white/40 hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden md:inline">Beat Markers</span>
            </button>
          )}
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Zoom Out Timeline"
            onClick={() => handleZoom(-15)}
            className="p-1 rounded text-white/50 hover:text-white hover:bg-white/10"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[10px] text-white/40 font-mono w-10 text-center">{pxPerSec}px/s</span>
          <button
            type="button"
            title="Zoom In Timeline"
            onClick={() => handleZoom(15)}
            className="p-1 rounded text-white/50 hover:text-white hover:bg-white/10"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timeline Body: Track Headers (Left) + Scrollable Canvas/Clips Lanes (Right) */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Left: Track Control Headers */}
        <div className="w-48 bg-[#090C13] border-r border-white/10 shrink-0 flex flex-col pt-7 z-10 shadow-lg">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="h-14 border-b border-white/5 px-2.5 flex items-center justify-between text-xs text-white/80 group"
            >
              <div className="flex items-center gap-1.5 truncate">
                {track.type === 'text' ? (
                  <Type className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                ) : track.type === 'video' ? (
                  <Video className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                ) : track.type === 'image' ? (
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Music className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                )}
                <span className="truncate text-[11px] font-medium" title={track.name}>
                  {track.name}
                </span>
              </div>

              {/* Mute, Lock, Hide track buttons */}
              <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  title={track.locked ? 'Unlock track' : 'Lock track'}
                  onClick={() => onUpdateTrack(track.id, { locked: !track.locked })}
                  className="p-1 rounded hover:bg-white/10"
                >
                  {track.locked ? <Lock className="w-3 h-3 text-amber-400" /> : <Unlock className="w-3 h-3 text-white/40" />}
                </button>

                <button
                  type="button"
                  title={track.hidden ? 'Show track' : 'Hide track'}
                  onClick={() => onUpdateTrack(track.id, { hidden: !track.hidden })}
                  className="p-1 rounded hover:bg-white/10"
                >
                  {track.hidden ? <EyeOff className="w-3 h-3 text-red-400" /> : <Eye className="w-3 h-3 text-white/40" />}
                </button>

                {track.type === 'audio' && (
                  <button
                    type="button"
                    title={track.muted ? 'Unmute track' : 'Mute track'}
                    onClick={() => onUpdateTrack(track.id, { muted: !track.muted })}
                    className="p-1 rounded hover:bg-white/10"
                  >
                    {track.muted ? <VolumeX className="w-3 h-3 text-red-400" /> : <Volume2 className="w-3 h-3 text-white/40" />}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Scrollable Timeline Lanes + Time Ruler */}
        <div
          ref={tracksContainerRef}
          onClick={(e) => {
            // Seek playhead on clicking empty space in timeline
            if ((e.target as HTMLElement).closest('.timeline-clip')) return
            const rect = tracksContainerRef.current?.getBoundingClientRect()
            if (rect) {
              const clickX = e.clientX - rect.left + (tracksContainerRef.current?.scrollLeft || 0)
              onSeek(Math.max(0, Math.min(totalDurationSec, clickX / pxPerSec)))
            }
          }}
          className="flex-1 overflow-x-auto overflow-y-auto relative bg-[#07090F]"
        >
          <div style={{ width: `${timelineWidthPx}px` }} className="relative min-h-full">
            {/* Top Time Ruler */}
            <div className="h-7 bg-[#0B0E17] border-b border-white/10 sticky top-0 z-20 flex items-end">
              {Array.from({ length: Math.ceil(totalDurationSec) + 1 }).map((_, sec) => (
                <div
                  key={sec}
                  style={{ left: `${sec * pxPerSec}px` }}
                  className="absolute bottom-0 h-4 border-l border-white/20 pl-1 text-[9px] font-mono text-white/40 select-none pointer-events-none"
                >
                  {sec}s
                </div>
              ))}

              {/* Music Beat & Phrase Markers overlay */}
              {showMusicMarkers && (
                <>
                  {musicPhrases.map((phraseSec, idx) => (
                    <div
                      key={`phrase-${idx}`}
                      style={{ left: `${phraseSec * pxPerSec}px` }}
                      title={`Phrase Boundary: ${phraseSec.toFixed(2)}s`}
                      className="absolute top-0 bottom-0 w-0.5 bg-purple-400 z-10 pointer-events-none"
                    >
                      <span className="absolute top-0 -left-1 w-2 h-2 rounded-full bg-purple-400 shadow-sm shadow-purple-500/80" />
                    </div>
                  ))}
                  {musicBeats.map((beatSec, idx) => (
                    <div
                      key={`beat-${idx}`}
                      style={{ left: `${beatSec * pxPerSec}px` }}
                      title={`Beat: ${beatSec.toFixed(2)}s`}
                      className="absolute top-0 h-2.5 w-0.5 bg-yellow-400/70 z-10 pointer-events-none"
                    />
                  ))}
                </>
              )}
            </div>

            {/* Red Vertical Playhead Needle */}
            <div
              style={{ left: `${playheadSec * pxPerSec}px` }}
              onPointerDown={(e) => {
                e.stopPropagation()
                setDragState({ type: 'playhead', initialMouseX: e.clientX })
              }}
              className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-30 pointer-events-auto cursor-ew-resize select-none"
            >
              <div className="w-3 h-4 bg-rose-500 rounded-b -translate-x-[5px] -translate-y-0.5 flex items-center justify-center shadow-md shadow-rose-500/50">
                <div className="w-0.5 h-1.5 bg-white rounded" />
              </div>
            </div>

            {/* Track Lanes */}
            <div className="relative">
              {tracks.map((track) => {
                const trackClips = clips.filter((c) => c.trackId === track.id)
                return (
                  <div
                    key={track.id}
                    className={`h-14 border-b border-white/5 relative bg-white/[0.01] ${
                      track.locked ? 'pointer-events-none opacity-60' : ''
                    }`}
                  >
                    {trackClips.map((clip) => {
                      const isSelected = selectedClipId === clip.id
                      const clipLeftPx = clip.startSec * pxPerSec
                      const clipWidthPx = Math.max(12, clip.durationSec * pxPerSec)

                      return (
                        <div
                          key={clip.id}
                          style={{
                            left: `${clipLeftPx}px`,
                            width: `${clipWidthPx}px`,
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectClip(clip.id)
                          }}
                          onPointerDown={(e) => {
                            if ((e.target as HTMLElement).classList.contains('trim-handle')) return
                            e.stopPropagation()
                            onSelectClip(clip.id)
                            setDragState({
                              type: 'move',
                              clipId: clip.id,
                              initialMouseX: e.clientX,
                              initialStartSec: clip.startSec,
                            })
                          }}
                          className={`timeline-clip absolute top-1 bottom-1 rounded-md px-2 flex items-center justify-between cursor-grab active:cursor-grabbing text-xs overflow-hidden transition-shadow select-none ${
                            clip.type === 'text'
                              ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-200'
                              : clip.type === 'video'
                              ? 'bg-blue-950/80 border-blue-500/60 text-blue-200'
                              : clip.type === 'image'
                              ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
                              : 'bg-violet-950/80 border-violet-500/60 text-violet-200'
                          } ${
                            isSelected
                              ? 'ring-2 ring-cyan-400 border-white shadow-lg shadow-cyan-500/20 z-10'
                              : 'border'
                          }`}
                        >
                          {/* Left Trim Handle */}
                          <div
                            onPointerDown={(e) => {
                              e.stopPropagation()
                              setDragState({
                                type: 'trim-start',
                                clipId: clip.id,
                                initialMouseX: e.clientX,
                                initialStartSec: clip.startSec,
                                initialDurationSec: clip.durationSec,
                              })
                            }}
                            className="trim-handle absolute left-0 top-0 bottom-0 w-2 hover:w-3 bg-white/20 hover:bg-cyan-400 cursor-ew-resize transition-all rounded-l"
                          />

                          {/* Label & Duration */}
                          <div className="flex items-center gap-1.5 truncate pointer-events-none mx-2">
                            <span className="font-semibold text-[11px] truncate">{clip.name}</span>
                            <span className="text-[10px] opacity-60">({clip.durationSec.toFixed(1)}s)</span>
                          </div>

                          {/* Keyframe Indicator diamonds */}
                          {clip.keyframes && clip.keyframes.length > 0 && (
                            <div className="absolute bottom-1 left-2 flex gap-1 pointer-events-none">
                              {clip.keyframes.map((kf) => (
                                <div
                                  key={kf.id}
                                  style={{ left: `${(kf.timeSec / clip.durationSec) * 100}%` }}
                                  className="w-1.5 h-1.5 bg-amber-400 rotate-45"
                                />
                              ))}
                            </div>
                          )}

                          {/* Right Trim Handle */}
                          <div
                            onPointerDown={(e) => {
                              e.stopPropagation()
                              setDragState({
                                type: 'trim-end',
                                clipId: clip.id,
                                initialMouseX: e.clientX,
                                initialStartSec: clip.startSec,
                                initialDurationSec: clip.durationSec,
                              })
                            }}
                            className="trim-handle absolute right-0 top-0 bottom-0 w-2 hover:w-3 bg-white/20 hover:bg-cyan-400 cursor-ew-resize transition-all rounded-r"
                          />
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
