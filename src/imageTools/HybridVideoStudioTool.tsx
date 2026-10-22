import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  Film,
  Video,
  Type,
  Sliders,
  ArrowLeftRight,
  Music,
  Plus,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { TopBar } from './hybridVideo/TopBar.tsx'
import { MediaLibraryPanel } from './hybridVideo/MediaLibraryPanel.tsx'
import { TextLibraryPanel } from './hybridVideo/TextLibraryPanel.tsx'
import { EffectsLibraryPanel } from './hybridVideo/EffectsLibraryPanel.tsx'
import { TransitionsLibraryPanel } from './hybridVideo/TransitionsLibraryPanel.tsx'
import { AudioLibraryPanel } from './hybridVideo/AudioLibraryPanel.tsx'
import { PreviewPlayer } from './hybridVideo/PreviewPlayer.tsx'
import { PropertiesPanel } from './hybridVideo/PropertiesPanel.tsx'
import { TimelineView } from './hybridVideo/TimelineView.tsx'
import { ExportModal } from './hybridVideo/ExportModal.tsx'
import { ProjectStorageModal } from './hybridVideo/ProjectStorageModal.tsx'

import type {
  HybridVideoProject,
  TimelineClip,
  Track,
  MediaAsset,
  CanvasDimensions,
  ClipTextProperties,
  ClipEffects,
  ClipTransition,
} from '../lib/hybridVideo/types.ts'
import {
  DEFAULT_TRANSFORM,
  DEFAULT_EFFECTS,
  DEFAULT_AUDIO_PROPS,
  DEFAULT_TEXT_PROPS,
} from '../lib/hybridVideo/types.ts'
import {
  createDefaultProject,
  saveProjectToLocalStorage,
  loadProjectFromLocalStorage,
} from '../lib/hybridVideo/projectState.ts'
import { calculateTotalProjectDuration, splitClipAtTime } from '../lib/hybridVideo/timelineEngine.ts'
import { drawCompositionFrame, type RenderContext } from '../lib/hybridVideo/previewEngine.ts'
import { hybridAudio } from '../lib/hybridVideo/audioTimelineEngine.ts'
import { revokeAssetUrls } from '../lib/hybridVideo/mediaManager.ts'

export const HybridVideoStudioTool: React.FC = () => {
  // Main Project State
  const [project, setProject] = useState<HybridVideoProject>(() => {
    return loadProjectFromLocalStorage() || createDefaultProject()
  })

  // History for Undo / Redo
  const [history, setHistory] = useState<HybridVideoProject[]>([project])
  const [historyIndex, setHistoryIndex] = useState(0)

  // Selection & Navigation
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'media' | 'text' | 'effects' | 'transitions' | 'audio'>('media')

  // Playback state
  const [playheadSec, setPlayheadSec] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)

  // Modals
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)

  // References
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const lastPlayheadTimeRef = useRef<number>(performance.now())

  // In-memory media elements cache
  const mediaAssetsMapRef = useRef<Map<string, MediaAsset>>(new Map())
  const videoElementsMapRef = useRef<Map<string, HTMLVideoElement>>(new Map())
  const imageElementsMapRef = useRef<Map<string, HTMLImageElement>>(new Map())

  // Keep media assets map synchronized with project.mediaAssets
  useEffect(() => {
    mediaAssetsMapRef.current.clear()
    for (const asset of project.mediaAssets) {
      mediaAssetsMapRef.current.set(asset.id, asset)
    }
  }, [project.mediaAssets])

  // Push new state to history (for undo/redo)
  const pushState = useCallback((newProject: HybridVideoProject) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1)
      return [...sliced, newProject]
    })
    setHistoryIndex((prev) => prev + 1)
    setProject(newProject)
    saveProjectToLocalStorage(newProject)
  }, [historyIndex])

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1
      setHistoryIndex(newIdx)
      setProject(history[newIdx])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1
      setHistoryIndex(newIdx)
      setProject(history[newIdx])
    }
  }

  // Pre-load video elements when video clips appear on timeline
  useEffect(() => {
    for (const clip of project.clips) {
      if (clip.type === 'video' && clip.assetId) {
        const asset = mediaAssetsMapRef.current.get(clip.assetId)
        if (asset && !videoElementsMapRef.current.has(clip.assetId)) {
          const vid = document.createElement('video')
          vid.crossOrigin = 'anonymous'
          vid.preload = 'auto'
          vid.muted = true
          vid.playsInline = true
          vid.src = asset.url
          videoElementsMapRef.current.set(clip.assetId, vid)
        }
      }
    }
  }, [project.clips])

  // Single render function
  const renderCurrentFrame = useCallback((timeSec: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const renderCtx: RenderContext = {
      canvas,
      ctx,
      settings: project.settings,
      tracks: project.tracks,
      clips: project.clips,
      mediaAssets: mediaAssetsMapRef.current,
      videoElements: videoElementsMapRef.current,
      imageElements: imageElementsMapRef.current,
    }

    drawCompositionFrame(renderCtx, timeSec)
  }, [project.settings, project.tracks, project.clips])

  // Render immediately when playhead or composition updates
  useEffect(() => {
    renderCurrentFrame(playheadSec)
  }, [renderCurrentFrame, playheadSec])

  // Playback loop
  useEffect(() => {
    if (!isPlaying) {
      hybridAudio.stopAll()
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
      return
    }

    // Start audio sync
    hybridAudio.playAt(playheadSec, project.clips, project.tracks, mediaAssetsMapRef.current)
    lastPlayheadTimeRef.current = performance.now()

    const loop = (now: number) => {
      const deltaSec = (now - lastPlayheadTimeRef.current) / 1000
      lastPlayheadTimeRef.current = now

      setPlayheadSec((prev) => {
        const next = prev + deltaSec
        const maxDuration = project.settings.durationSec

        if (next >= maxDuration) {
          if (isLooping) {
            hybridAudio.playAt(0, project.clips, project.tracks, mediaAssetsMapRef.current)
            return 0
          } else {
            setIsPlaying(false)
            return maxDuration
          }
        }
        return next
      })

      animFrameRef.current = requestAnimationFrame(loop)
    }

    animFrameRef.current = requestAnimationFrame(loop)

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
      hybridAudio.stopAll()
    }
  }, [isPlaying, isLooping, project.settings.durationSec, project.clips, project.tracks])

  // Toggle Play / Pause
  const togglePlay = () => {
    setIsPlaying((prev) => {
      const next = !prev
      if (next && playheadSec >= project.settings.durationSec) {
        setPlayheadSec(0)
      }
      return next
    })
  }

  // Keyboard Shortcuts: Space, S, Delete/Backspace, Ctrl+Z, Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in input or textarea
      const target = e.target as HTMLElement
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
        return
      }

      if (e.code === 'Space') {
        e.preventDefault()
        togglePlay()
      } else if (e.code === 'KeyS' && !e.ctrlKey && !e.metaKey) {
        if (selectedClipId) {
          e.preventDefault()
          handleSplitClip(selectedClipId, playheadSec)
        }
      } else if (e.code === 'Delete' || e.code === 'Backspace') {
        if (selectedClipId) {
          e.preventDefault()
          handleDeleteClip(selectedClipId)
        }
      } else if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ') {
        e.preventDefault()
        if (e.shiftKey) {
          handleRedo()
        } else {
          handleUndo()
        }
      } else if ((e.ctrlKey || e.metaKey) && e.code === 'KeyY') {
        e.preventDefault()
        handleRedo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedClipId, playheadSec, historyIndex, history.length])

  // Media Library Operations
  const handleAddMedia = (assets: MediaAsset[]) => {
    const updatedProject: HybridVideoProject = {
      ...project,
      mediaAssets: [...project.mediaAssets, ...assets],
    }
    pushState(updatedProject)
  }

  const handleRemoveMedia = (assetId: string) => {
    const updatedAssets = project.mediaAssets.filter((a) => a.id !== assetId)
    // Also remove clips tied to this asset
    const updatedClips = project.clips.filter((c) => c.assetId !== assetId)
    pushState({
      ...project,
      mediaAssets: updatedAssets,
      clips: updatedClips,
    })
  }

  const handleClearMedia = () => {
    revokeAssetUrls(project.mediaAssets)
    pushState({
      ...project,
      mediaAssets: [],
      clips: [],
    })
  }

  // Add Asset to Timeline
  const handleAddAssetToTimeline = (asset: MediaAsset) => {
    const targetTrackType = asset.type === 'audio' ? 'audio' : 'video'
    const targetTrack = project.tracks.find((t) => t.type === targetTrackType) || project.tracks[2]

    // Find end of last clip on this track
    const trackClips = project.clips.filter((c) => c.trackId === targetTrack.id)
    let startSec = 0
    for (const c of trackClips) {
      const end = c.startSec + c.durationSec
      if (end > startSec) startSec = end
    }

    const durationSec = Math.min(asset.durationSec, 15)

    const newClip: TimelineClip = {
      id: `clip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      trackId: targetTrack.id,
      assetId: asset.id,
      name: asset.name,
      type: asset.type,
      startSec,
      durationSec,
      trimStartSec: 0,
      trimEndSec: 0,
      speed: 1.0,
      transform: { ...DEFAULT_TRANSFORM },
      keyframes: [],
      effects: {
        ...DEFAULT_EFFECTS,
        colorGrading: { ...DEFAULT_EFFECTS.colorGrading },
        filters: { ...DEFAULT_EFFECTS.filters },
      },
      transitionIn: { type: 'none', durationSec: 0 },
      transitionOut: { type: 'none', durationSec: 0 },
      audioProps: { ...DEFAULT_AUDIO_PROPS },
    }

    const updatedClips = [...project.clips, newClip]
    const newTotalDuration = calculateTotalProjectDuration(updatedClips, project.settings.durationSec)

    pushState({
      ...project,
      settings: { ...project.settings, durationSec: newTotalDuration },
      clips: updatedClips,
    })

    setSelectedClipId(newClip.id)
  }

  // Add Text Clip to Timeline
  const handleAddTextClip = (textProps: ClipTextProperties) => {
    const textTrack = project.tracks.find((t) => t.type === 'text') || project.tracks[0]

    const newClip: TimelineClip = {
      id: `clip-text-${Date.now()}`,
      trackId: textTrack.id,
      name: textProps.titleStyle ? textProps.titleStyle.replace('-', ' ').toUpperCase() : 'TEXT TITLE',
      type: 'text',
      startSec: playheadSec,
      durationSec: 4.0,
      trimStartSec: 0,
      trimEndSec: 0,
      speed: 1.0,
      transform: { ...DEFAULT_TRANSFORM },
      keyframes: [],
      effects: {
        ...DEFAULT_EFFECTS,
        colorGrading: { ...DEFAULT_EFFECTS.colorGrading },
        filters: { ...DEFAULT_EFFECTS.filters },
      },
      transitionIn: { type: 'crossfade', durationSec: 0.5 },
      transitionOut: { type: 'crossfade', durationSec: 0.5 },
      textProps: { ...textProps },
      audioProps: { ...DEFAULT_AUDIO_PROPS },
    }

    const updatedClips = [...project.clips, newClip]
    const newTotalDuration = calculateTotalProjectDuration(updatedClips, project.settings.durationSec)

    pushState({
      ...project,
      settings: { ...project.settings, durationSec: newTotalDuration },
      clips: updatedClips,
    })

    setSelectedClipId(newClip.id)
  }

  // Clip Modifications
  const handleUpdateClip = (clipId: string, updates: Partial<TimelineClip>) => {
    const updatedClips = project.clips.map((c) => (c.id === clipId ? { ...c, ...updates } : c))
    const newTotalDuration = calculateTotalProjectDuration(updatedClips, project.settings.durationSec)

    pushState({
      ...project,
      settings: { ...project.settings, durationSec: newTotalDuration },
      clips: updatedClips,
    })
  }

  const handleDeleteClip = (clipId: string) => {
    const updatedClips = project.clips.filter((c) => c.id !== clipId)
    if (selectedClipId === clipId) setSelectedClipId(null)
    pushState({
      ...project,
      clips: updatedClips,
    })
  }

  const handleDuplicateClip = (clip: TimelineClip) => {
    const duplicated: TimelineClip = {
      ...clip,
      id: `clip-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `${clip.name} (Copy)`,
      startSec: clip.startSec + clip.durationSec + 0.2,
    }
    const updatedClips = [...project.clips, duplicated]
    pushState({
      ...project,
      clips: updatedClips,
    })
    setSelectedClipId(duplicated.id)
  }

  const handleSplitClip = (clipId: string, splitTimeSec: number) => {
    const clip = project.clips.find((c) => c.id === clipId)
    if (!clip) return

    const splitResult = splitClipAtTime(clip, splitTimeSec)
    if (!splitResult) return

    const [c1, c2] = splitResult
    const updatedClips = project.clips.filter((c) => c.id !== clipId).concat([c1, c2])

    pushState({
      ...project,
      clips: updatedClips,
    })
    setSelectedClipId(c2.id)
  }

  // Keyframes
  const handleAddKeyframe = (clipId: string, relTimeSec: number) => {
    const clip = project.clips.find((c) => c.id === clipId)
    if (!clip) return

    const newKeyframe = {
      id: `kf-${Date.now()}`,
      timeSec: Number(relTimeSec.toFixed(2)),
      transform: { ...clip.transform },
    }

    const updatedKeyframes = [...(clip.keyframes || []), newKeyframe].sort((a, b) => a.timeSec - b.timeSec)
    handleUpdateClip(clipId, { keyframes: updatedKeyframes })
  }

  const handleRemoveKeyframe = (clipId: string, kfId: string) => {
    const clip = project.clips.find((c) => c.id === clipId)
    if (!clip) return
    const updatedKeyframes = (clip.keyframes || []).filter((k) => k.id !== kfId)
    handleUpdateClip(clipId, { keyframes: updatedKeyframes })
  }

  // Apply Transition to Clip
  const handleApplyTransition = (transition: ClipTransition, target: 'in' | 'out' | 'both') => {
    if (!selectedClipId) return
    const clip = project.clips.find((c) => c.id === selectedClipId)
    if (!clip) return

    const updates: Partial<TimelineClip> = {}
    if (target === 'in' || target === 'both') updates.transitionIn = { ...transition }
    if (target === 'out' || target === 'both') updates.transitionOut = { ...transition }

    handleUpdateClip(selectedClipId, updates)
  }

  // Track Modifications
  const handleUpdateTrack = (trackId: string, updates: Partial<Track>) => {
    const updatedTracks = project.tracks.map((t) => (t.id === trackId ? { ...t, ...updates } : t))
    pushState({
      ...project,
      tracks: updatedTracks,
    })
  }

  const selectedClip = project.clips.find((c) => c.id === selectedClipId) || null

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] bg-[#090A0F] text-white overflow-hidden select-none">
      {/* Top Bar Navigation */}
      <TopBar
        projectName={project.settings.name}
        onProjectNameChange={(name) =>
          pushState({ ...project, settings: { ...project.settings, name } })
        }
        dimensions={project.settings.dimensions}
        onDimensionsChange={(dimensions) =>
          pushState({ ...project, settings: { ...project.settings, dimensions } })
        }
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onOpenProjectModal={() => setIsProjectModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Main Center Workspace (Left Side Panels + Center Preview + Right Inspector) */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Left Side: Navigation Tabs + Panel Body */}
        <div className="w-80 border-r border-white/10 flex bg-[#0A0D15] shrink-0">
          {/* Vertical Icon Strip */}
          <div className="w-14 border-r border-white/10 bg-[#080B12] flex flex-col items-center py-3 gap-2">
            {[
              { id: 'media', icon: Video, label: 'Media' },
              { id: 'text', icon: Type, label: 'Text' },
              { id: 'effects', icon: Sliders, label: 'Effects' },
              { id: 'transitions', icon: ArrowLeftRight, label: 'Transition' },
              { id: 'audio', icon: Music, label: 'Audio' },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  title={tab.label}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex flex-col items-center justify-center w-10 h-11 rounded-xl transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[9px] font-medium mt-0.5">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Tab Panel Content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'media' && (
              <MediaLibraryPanel
                mediaAssets={project.mediaAssets}
                onAddMedia={handleAddMedia}
                onRemoveMedia={handleRemoveMedia}
                onAddToTimeline={handleAddAssetToTimeline}
                onClearMedia={handleClearMedia}
              />
            )}
            {activeTab === 'text' && <TextLibraryPanel onAddTextClip={handleAddTextClip} />}
            {activeTab === 'effects' && (
              <EffectsLibraryPanel
                effects={selectedClip?.effects || DEFAULT_EFFECTS}
                hasSelectedClip={!!selectedClip}
                onChange={(updatedEffects) => {
                  if (selectedClip) {
                    handleUpdateClip(selectedClip.id, { effects: updatedEffects })
                  }
                }}
              />
            )}
            {activeTab === 'transitions' && (
              <TransitionsLibraryPanel
                hasSelectedClip={!!selectedClip}
                onApplyTransition={handleApplyTransition}
              />
            )}
            {activeTab === 'audio' && (
              <AudioLibraryPanel tracks={project.tracks} onUpdateTrack={handleUpdateTrack} />
            )}
          </div>
        </div>

        {/* Center: Real Composition Preview Player */}
        <div className="flex-1 min-w-0 flex flex-col bg-[#07090E]">
          <PreviewPlayer
            canvasRef={canvasRef}
            dimensions={project.settings.dimensions}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            playheadSec={playheadSec}
            totalDurationSec={project.settings.durationSec}
            onSeek={(t) => setPlayheadSec(t)}
            isLooping={isLooping}
            onToggleLoop={() => setIsLooping(!isLooping)}
          />
        </div>

        {/* Right Side: Contextual Clip Properties Panel */}
        <div className="w-72 bg-[#0D111A] shrink-0 hidden xl:block">
          <PropertiesPanel
            selectedClip={selectedClip}
            playheadSec={playheadSec}
            onUpdateClip={handleUpdateClip}
            onDeleteClip={handleDeleteClip}
            onDuplicateClip={handleDuplicateClip}
            onAddKeyframe={handleAddKeyframe}
            onRemoveKeyframe={handleRemoveKeyframe}
          />
        </div>
      </div>

      {/* Bottom Area: Multi-Track Interactive Timeline */}
      <div className="h-56 bg-[#0A0D14] shrink-0 flex flex-col">
        <TimelineView
          tracks={project.tracks}
          clips={project.clips}
          selectedClipId={selectedClipId}
          onSelectClip={(id) => setSelectedClipId(id)}
          playheadSec={playheadSec}
          totalDurationSec={project.settings.durationSec}
          onSeek={(t) => setPlayheadSec(t)}
          onUpdateClip={handleUpdateClip}
          onDeleteClip={handleDeleteClip}
          onSplitClip={handleSplitClip}
          onUpdateTrack={handleUpdateTrack}
        />
      </div>

      {/* Modals */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={project}
        mediaAssets={mediaAssetsMapRef.current}
        videoElements={videoElementsMapRef.current}
        imageElements={imageElementsMapRef.current}
      />

      <ProjectStorageModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        project={project}
        onLoadProject={(loaded) => {
          pushState(loaded)
          setPlayheadSec(0)
        }}
        onNewProject={() => {
          const fresh = createDefaultProject()
          pushState(fresh)
          setPlayheadSec(0)
          setSelectedClipId(null)
        }}
      />
    </div>
  )
}

export default HybridVideoStudioTool
