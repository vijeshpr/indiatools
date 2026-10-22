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
import { MusicIntelligencePanel } from './hybridVideo/MusicIntelligencePanel.tsx'
import { PreviewPlayer } from './hybridVideo/PreviewPlayer.tsx'
import { PropertiesPanel } from './hybridVideo/PropertiesPanel.tsx'
import { TimelineView } from './hybridVideo/TimelineView.tsx'
import { ExportModal } from './hybridVideo/ExportModal.tsx'
import { ProjectStorageModal } from './hybridVideo/ProjectStorageModal.tsx'
import { BatchMediaModal } from './hybridVideo/BatchMediaModal.tsx'
import { AutoEditModal } from './hybridVideo/AutoEditModal.tsx'
import { RegenerationToolbar } from './hybridVideo/RegenerationToolbar.tsx'

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
import type { MusicAnalysisResult } from '../lib/hybridVideo/musicIntelligence.ts'
import {
  generateAutoEditTimeline,
  type AutoEditGeneratorOptions,
} from '../lib/hybridVideo/autoEditGenerator.ts'
import {
  batchInsertMediaToTimeline,
  type BatchInsertOptions,
} from '../lib/hybridVideo/batchMediaOperations.ts'

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
  const [activeTab, setActiveTab] = useState<
    'media' | 'text' | 'effects' | 'transitions' | 'audio' | 'music-ai'
  >('media')

  // Playback state
  const [playheadSec, setPlayheadSec] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)

  // Modals & Auto-edit states
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false)
  const [isAutoEditModalOpen, setIsAutoEditModalOpen] = useState(false)
  const [musicAnalysis, setMusicAnalysis] = useState<MusicAnalysisResult | null>(null)
  const [lastAutoEditOptions, setLastAutoEditOptions] = useState<AutoEditGeneratorOptions | null>(
    null
  )
  const [lastAutoEditSummary, setLastAutoEditSummary] = useState<string | null>(null)
  const [preAutoEditProjectSnapshot, setPreAutoEditProjectSnapshot] =
    useState<HybridVideoProject | null>(null)

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
  const pushState = useCallback(
    (newProject: HybridVideoProject) => {
      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1)
        return [...sliced, newProject]
      })
      setHistoryIndex((prev) => prev + 1)
      setProject(newProject)
      saveProjectToLocalStorage(newProject)
    },
    [historyIndex]
  )

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
    const videoMap = videoElementsMapRef.current
    for (const clip of project.clips) {
      if (clip.assetId) {
        const asset = mediaAssetsMapRef.current.get(clip.assetId)
        if (asset && asset.type === 'video' && !videoMap.has(asset.id)) {
          const video = document.createElement('video')
          video.src = asset.url
          video.crossOrigin = 'anonymous'
          video.preload = 'auto'
          video.muted = true
          video.playsInline = true
          videoMap.set(asset.id, video)
        }
      }
    }
  }, [project.clips])

  // Pre-load image elements
  useEffect(() => {
    const imgMap = imageElementsMapRef.current
    for (const clip of project.clips) {
      if (clip.assetId) {
        const asset = mediaAssetsMapRef.current.get(clip.assetId)
        if (asset && asset.type === 'image' && !imgMap.has(asset.id)) {
          const img = new Image()
          img.src = asset.url
          img.crossOrigin = 'anonymous'
          imgMap.set(asset.id, img)
        }
      }
    }
  }, [project.clips])

  // Playback Loop
  useEffect(() => {
    if (!isPlaying) {
      hybridAudio.stopAll()
      return
    }

    hybridAudio.playAt(playheadSec, project.clips, project.tracks, mediaAssetsMapRef.current)
    lastPlayheadTimeRef.current = performance.now()

    let running = true

    const tick = (now: number) => {
      if (!running) return

      const deltaSec = (now - lastPlayheadTimeRef.current) / 1000
      lastPlayheadTimeRef.current = now

      setPlayheadSec((prev) => {
        const next = prev + deltaSec
        if (next >= project.settings.durationSec) {
          if (isLooping) {
            hybridAudio.playAt(0, project.clips, project.tracks, mediaAssetsMapRef.current)
            return 0
          } else {
            setIsPlaying(false)
            hybridAudio.stopAll()
            return project.settings.durationSec
          }
        }
        return next
      })

      animFrameRef.current = requestAnimationFrame(tick)
    }

    animFrameRef.current = requestAnimationFrame(tick)

    return () => {
      running = false
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isPlaying, isLooping, project.settings.durationSec, project.clips, project.tracks])

  // Canvas Frame Rendering
  useEffect(() => {
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

    drawCompositionFrame(renderCtx, playheadSec)
  }, [playheadSec, project])

  const togglePlay = () => {
    if (playheadSec >= project.settings.durationSec) {
      setPlayheadSec(0)
    }
    setIsPlaying(!isPlaying)
  }

  // Media Library Handlers
  const handleAddMedia = (assets: MediaAsset[]) => {
    const updatedAssets = [...project.mediaAssets, ...assets]
    pushState({
      ...project,
      mediaAssets: updatedAssets,
    })
  }

  const handleRemoveMedia = (assetId: string) => {
    const updatedAssets = project.mediaAssets.filter((a) => a.id !== assetId)
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

  // Add individual asset to timeline
  const handleAddAssetToTimeline = (asset: MediaAsset) => {
    let targetTrack: Track | undefined
    if (asset.type === 'video' || asset.type === 'image') {
      targetTrack = project.tracks.find((t) => t.type === 'video')
    } else {
      targetTrack = project.tracks.find((t) => t.type === 'audio')
    }

    if (!targetTrack) return

    // Find end of existing clips on that track to place sequentially
    const trackClips = project.clips.filter((c) => c.trackId === targetTrack!.id)
    const lastClipEnd = trackClips.reduce(
      (max, c) => Math.max(max, c.startSec + c.durationSec),
      0
    )
    const startSec = lastClipEnd
    const durationSec = asset.type === 'image' ? 4 : asset.durationSec

    const newClip: TimelineClip = {
      id: `clip-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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
      effects: { ...DEFAULT_EFFECTS },
      transitionIn: { type: 'none', durationSec: 0 },
      transitionOut: { type: 'none', durationSec: 0 },
      audioProps: { ...DEFAULT_AUDIO_PROPS },
    }

    const updatedClips = [...project.clips, newClip]
    const newTotalDuration = calculateTotalProjectDuration(
      updatedClips,
      project.settings.durationSec
    )

    pushState({
      ...project,
      settings: { ...project.settings, durationSec: newTotalDuration },
      clips: updatedClips,
    })
    setSelectedClipId(newClip.id)
  }

  // One-Click Auto-Edit Apply
  const handleApplyAutoEdit = (
    updatedProject: HybridVideoProject,
    summary: string,
    options: AutoEditGeneratorOptions
  ) => {
    setPreAutoEditProjectSnapshot({ ...project })
    setLastAutoEditOptions(options)
    setLastAutoEditSummary(summary)
    pushState(updatedProject)
    setPlayheadSec(0)
  }

  // Quick Regeneration Toolbar Handlers
  const handleQuickRegenerate = (overrides?: Partial<AutoEditGeneratorOptions>) => {
    if (!lastAutoEditOptions) return
    const musicAsset =
      project.mediaAssets.find((a) => a.id === musicAnalysis?.assetId) ||
      project.mediaAssets.find((a) => a.type === 'audio')
    if (!musicAsset) return

    const activeAnalysis: MusicAnalysisResult = musicAnalysis || {
      assetId: musicAsset.id,
      assetName: musicAsset.name,
      durationSec: musicAsset.durationSec || 30,
      bpm: 120,
      bpmConfidence: 0.5,
      beats: [],
      onsets: [],
      energyEnvelope: [],
      sections: [],
      dominantMood: 'energetic',
      overallMelodyScore: 0.5,
      climaxStartSec: musicAsset.durationSec * 0.8,
      climaxEndSec: musicAsset.durationSec,
      suggestedCutPoints: [],
    }

    const updatedOptions: AutoEditGeneratorOptions = {
      ...lastAutoEditOptions,
      ...overrides,
    }

    try {
      const baseProject = preAutoEditProjectSnapshot || project
      const result = generateAutoEditTimeline(
        baseProject,
        musicAsset,
        activeAnalysis,
        project.mediaAssets,
        updatedOptions
      )
      setLastAutoEditOptions(updatedOptions)
      setLastAutoEditSummary(result.summary)
      pushState(result.updatedProject)
      setPlayheadSec(0)
    } catch (err) {
      console.error('Quick regenerate error:', err)
    }
  }

  const handleRestorePrevious = () => {
    if (preAutoEditProjectSnapshot) {
      pushState(preAutoEditProjectSnapshot)
      setLastAutoEditSummary(null)
      setPreAutoEditProjectSnapshot(null)
    }
  }

  // Text Clip
  const handleAddTextClip = (presetText: ClipTextProperties) => {
    const textTrack = project.tracks.find((t) => t.type === 'text')
    if (!textTrack) return

    const newClip: TimelineClip = {
      id: `text-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      trackId: textTrack.id,
      name: presetText.text,
      type: 'text',
      startSec: playheadSec,
      durationSec: 3.5,
      trimStartSec: 0,
      trimEndSec: 0,
      speed: 1.0,
      transform: { ...DEFAULT_TRANSFORM },
      keyframes: [],
      effects: { ...DEFAULT_EFFECTS },
      transitionIn: { type: 'none', durationSec: 0 },
      transitionOut: { type: 'none', durationSec: 0 },
      textProps: { ...presetText },
      audioProps: { ...DEFAULT_AUDIO_PROPS },
    }

    const updatedClips = [...project.clips, newClip]
    const newTotalDuration = calculateTotalProjectDuration(
      updatedClips,
      project.settings.durationSec
    )

    pushState({
      ...project,
      settings: { ...project.settings, durationSec: newTotalDuration },
      clips: updatedClips,
    })
    setSelectedClipId(newClip.id)
  }

  // Clip Modifications
  const handleUpdateClip = (clipId: string, updates: Partial<TimelineClip>) => {
    const updatedClips = project.clips.map((c) =>
      c.id === clipId ? { ...c, ...updates } : c
    )
    const newTotalDuration = calculateTotalProjectDuration(
      updatedClips,
      project.settings.durationSec
    )

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

    const updatedKeyframes = [...(clip.keyframes || []), newKeyframe].sort(
      (a, b) => a.timeSec - b.timeSec
    )
    handleUpdateClip(clipId, { keyframes: updatedKeyframes })
  }

  const handleRemoveKeyframe = (clipId: string, kfId: string) => {
    const clip = project.clips.find((c) => c.id === clipId)
    if (!clip) return
    const updatedKeyframes = (clip.keyframes || []).filter((k) => k.id !== kfId)
    handleUpdateClip(clipId, { keyframes: updatedKeyframes })
  }

  // Apply Transition to Clip
  const handleApplyTransition = (
    transition: ClipTransition,
    target: 'in' | 'out' | 'both'
  ) => {
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
              { id: 'music-ai', icon: Sparkles, label: 'Music AI' },
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
                onOpenBatchModal={() => setIsBatchModalOpen(true)}
                onOpenAutoEditModal={() => setIsAutoEditModalOpen(true)}
              />
            )}
            {activeTab === 'music-ai' && (
              <MusicIntelligencePanel
                mediaAssets={project.mediaAssets}
                musicAnalysis={musicAnalysis}
                onAnalysisComplete={(res) => setMusicAnalysis(res)}
                playheadSec={playheadSec}
                onSeek={(t) => setPlayheadSec(t)}
                onOpenAutoEditModal={() => setIsAutoEditModalOpen(true)}
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

      {/* Regeneration Toolbar (Shown when auto-edit summary exists) */}
      {lastAutoEditSummary && (
        <RegenerationToolbar
          lastSummary={lastAutoEditSummary}
          onRegenerate={() => handleQuickRegenerate({ assetOrder: 'shuffle' })}
          onSlowerCuts={() =>
            handleQuickRegenerate({
              pacingOffsetMultiplier: (lastAutoEditOptions?.pacingOffsetMultiplier || 1.0) * 1.25,
            })
          }
          onFasterCuts={() =>
            handleQuickRegenerate({
              pacingOffsetMultiplier: (lastAutoEditOptions?.pacingOffsetMultiplier || 1.0) * 0.8,
            })
          }
          onMoreCinematic={() =>
            handleQuickRegenerate({
              style: 'cinematic-story',
            })
          }
          onSyncToBeats={() =>
            handleQuickRegenerate({
              style: 'beat-sync',
            })
          }
          onKeepMelodyCalm={() =>
            handleQuickRegenerate({
              keepMelodyCalm: true,
            })
          }
          onIncreaseClimax={() =>
            handleQuickRegenerate({
              style: 'climax-rewind',
            })
          }
          onRestorePrevious={handleRestorePrevious}
          onDismiss={() => setLastAutoEditSummary(null)}
        />
      )}

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
      <BatchMediaModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        project={project}
        playheadSec={playheadSec}
        onApplyBatchInsert={(updatedProject, _summary) => {
          setPreAutoEditProjectSnapshot({ ...project })
          pushState(updatedProject)
          setPlayheadSec(0)
        }}
      />

      <AutoEditModal
        isOpen={isAutoEditModalOpen}
        onClose={() => setIsAutoEditModalOpen(false)}
        project={project}
        mediaAssets={project.mediaAssets}
        musicAnalysis={musicAnalysis}
        onApplyAutoEdit={handleApplyAutoEdit}
      />

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
          setLastAutoEditSummary(null)
        }}
      />
    </div>
  )
}

export default HybridVideoStudioTool
