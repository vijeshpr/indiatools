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
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle2,
  ShieldCheck,
  Zap,
  HelpCircle,
  Keyboard,
  Layers,
  Wand2,
} from 'lucide-react'
import { TopBar } from './hybridVideo/TopBar.tsx'
import { MediaLibraryPanel } from './hybridVideo/MediaLibraryPanel.tsx'
import { TextLibraryPanel } from './hybridVideo/TextLibraryPanel.tsx'
import { EffectsLibraryPanel } from './hybridVideo/EffectsLibraryPanel.tsx'
import { TransitionsLibraryPanel } from './hybridVideo/TransitionsLibraryPanel.tsx'
import { AudioLibraryPanel } from './hybridVideo/AudioLibraryPanel.tsx'
import { MusicIntelligencePanel } from './hybridVideo/MusicIntelligencePanel.tsx'
import { MusicReactivityPanel } from './hybridVideo/MusicReactivityPanel.tsx'
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
  DEFAULT_MUSIC_REACTIVITY,
  type MusicReactivityConfig,
} from '../lib/hybridVideo/types.ts'
import {
  createReactivityConfig,
  type ReactivityPresetId,
} from '../lib/hybridVideo/musicReactivityEngine.ts'
import { applyTransitionToAllCuts } from '../lib/hybridVideo/transitionsEngine.ts'
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
    'media' | 'music-ai' | 'reactivity' | 'text' | 'effects' | 'transitions' | 'audio'
  >('media')

  // Music Reactivity State (OFF by default)
  const [musicReactivity, setMusicReactivity] = useState<MusicReactivityConfig>(() => {
    return project.settings.musicReactivity || project.musicReactivity || DEFAULT_MUSIC_REACTIVITY
  })

  // Panel Collapsibility
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true)
  const [isInspectorOpen, setIsInspectorOpen] = useState(true)

  // Timeline Marker Display
  const [showMusicMarkers, setShowMusicMarkers] = useState(true)

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
      musicAnalysis,
      musicReactivity,
      selectedClipId,
    }

    drawCompositionFrame(renderCtx, playheadSec)
  }, [playheadSec, project, musicAnalysis, musicReactivity, selectedClipId])

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

  // Direct Auto-Edit Regeneration from Music Sync Panel
  const handleRegenerateAutoEditWithSync = (syncOptions: AutoEditGeneratorOptions) => {
    const musicAsset =
      project.mediaAssets.find((a) => a.id === musicAnalysis?.assetId) ||
      project.mediaAssets.find((a) => a.type === 'audio')

    if (!musicAsset) {
      alert('Please select and analyze a music track in the library first.')
      return
    }

    const activeAnalysis: MusicAnalysisResult = musicAnalysis || {
      assetId: musicAsset.id,
      assetName: musicAsset.name,
      durationSec: musicAsset.durationSec || 30,
      bpm: 120,
      bpmConfidence: 0.5,
      beats: [],
      onsets: [],
      downbeats: [],
      phraseBoundaries: [],
      events: [],
      energyEnvelope: [],
      sections: [],
      dominantMood: 'energetic',
      overallMelodyScore: 0.5,
      vocalActivityConfidence: 0.5,
      climaxStartSec: musicAsset.durationSec * 0.8,
      climaxEndSec: musicAsset.durationSec,
      suggestedCutPoints: [],
    }

    const combinedOptions: AutoEditGeneratorOptions = {
      ...lastAutoEditOptions,
      ...syncOptions,
    }

    try {
      const baseProject = preAutoEditProjectSnapshot || project
      const result = generateAutoEditTimeline(
        baseProject,
        musicAsset,
        activeAnalysis,
        project.mediaAssets,
        combinedOptions
      )
      setPreAutoEditProjectSnapshot(baseProject)
      setLastAutoEditOptions(combinedOptions)
      setLastAutoEditSummary(result.summary)
      pushState(result.updatedProject)
      setPlayheadSec(0)
    } catch (err) {
      console.error('Music sync auto edit error:', err)
      alert((err as Error).message)
    }
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
      downbeats: [],
      phraseBoundaries: [],
      events: [],
      energyEnvelope: [],
      sections: [],
      dominantMood: 'energetic',
      overallMelodyScore: 0.5,
      vocalActivityConfidence: 0.5,
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

  // Move clip layer forward / backward
  const handleMoveClipLayer = (clipId: string, direction: 'forward' | 'backward') => {
    const clipIndex = project.clips.findIndex((c) => c.id === clipId)
    if (clipIndex === -1) return
    const clip = project.clips[clipIndex]

    // If overlay track exists, toggle track assignment or move in clips array
    const videoTracks = project.tracks.filter((t) => t.type === 'video' || t.type === 'image')
    if (videoTracks.length >= 2) {
      const currentTrackIdx = videoTracks.findIndex((t) => t.id === clip.trackId)
      if (direction === 'forward' && currentTrackIdx !== -1) {
        // Target overlay track (track-video-2)
        const overlayTrack = project.tracks.find((t) => t.id === 'track-video-2') || videoTracks[0]
        if (clip.trackId !== overlayTrack.id) {
          handleUpdateClip(clipId, { trackId: overlayTrack.id })
          return
        }
      } else if (direction === 'backward' && currentTrackIdx !== -1) {
        // Target main track (track-video-1)
        const mainTrack =
          project.tracks.find((t) => t.id === 'track-video-1') || videoTracks[videoTracks.length - 1]
        if (clip.trackId !== mainTrack.id) {
          handleUpdateClip(clipId, { trackId: mainTrack.id })
          return
        }
      }
    }

    // Also adjust position in clips array
    const updatedClips = [...project.clips]
    if (direction === 'forward' && clipIndex < updatedClips.length - 1) {
      const temp = updatedClips[clipIndex]
      updatedClips[clipIndex] = updatedClips[clipIndex + 1]
      updatedClips[clipIndex + 1] = temp
      pushState({ ...project, clips: updatedClips })
    } else if (direction === 'backward' && clipIndex > 0) {
      const temp = updatedClips[clipIndex]
      updatedClips[clipIndex] = updatedClips[clipIndex - 1]
      updatedClips[clipIndex - 1] = temp
      pushState({ ...project, clips: updatedClips })
    }
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

  // Batch Apply Transition Across All Cuts on Video/Image Tracks
  const handleApplyTransitionToAllCuts = (
    transition: ClipTransition,
    target: 'in' | 'out' | 'both'
  ) => {
    const updatedClips = applyTransitionToAllCuts(project.clips, transition, target)
    pushState({
      ...project,
      clips: updatedClips,
    })
  }

  // Music Reactivity Handlers
  const handleUpdateReactivity = (newConfig: MusicReactivityConfig) => {
    setMusicReactivity(newConfig)
    if (newConfig.scope === 'selected' && selectedClipId) {
      handleUpdateClip(selectedClipId, { musicReactivity: newConfig })
    } else if (newConfig.scope === 'all') {
      const updatedClips = project.clips.map((c) =>
        c.type === 'image' || c.type === 'video' ? { ...c, musicReactivity: newConfig } : c
      )
      pushState({
        ...project,
        clips: updatedClips,
        settings: { ...project.settings, musicReactivity: newConfig },
        musicReactivity: newConfig,
      })
    } else {
      pushState({
        ...project,
        settings: { ...project.settings, musicReactivity: newConfig },
        musicReactivity: newConfig,
      })
    }
  }

  const handleApplyReactivityPreset = (presetId: ReactivityPresetId) => {
    const newConfig = createReactivityConfig(presetId)
    handleUpdateReactivity(newConfig)
  }

  const handleResetReactivity = () => {
    const resetConfig = createReactivityConfig()
    resetConfig.enabled = false
    handleUpdateReactivity(resetConfig)
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
    <div className="w-full bg-[#080A10] text-white selection:bg-cyan-500 selection:text-black">
      {/* =========================================================================
          SECTION 1: IMMEDIATE FULL-SCREEN VIDEO EDITOR WORKSPACE (FIRST SCREEN)
          ========================================================================= */}
      <div className="flex flex-col h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] min-h-[640px] bg-[#090A0F] border-b border-white/10 overflow-hidden select-none relative">
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

        {/* Main Center Workspace (Left Navigation + Center Preview + Right Inspector) */}
        <div className="flex-1 min-h-0 flex overflow-hidden relative">
          {/* Left Side: Navigation Tabs + Collapsible Panel Body */}
          <div
            className={`border-r border-white/10 flex bg-[#0A0D15] shrink-0 transition-all duration-200 z-10 ${
              isLeftPanelOpen ? 'w-80 md:w-88' : 'w-14'
            }`}
          >
            {/* Vertical Icon Strip */}
            <div className="w-14 border-r border-white/10 bg-[#080B12] flex flex-col items-center py-2.5 gap-2 shrink-0">
              {[
                { id: 'media', icon: Video, label: 'Media' },
                { id: 'music-ai', icon: Sparkles, label: 'Music Sync' },
                { id: 'reactivity', icon: Zap, label: 'Beat VFX' },
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
                    onClick={() => {
                      setActiveTab(tab.id as any)
                      if (!isLeftPanelOpen) setIsLeftPanelOpen(true)
                    }}
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

              {/* Panel Collapse / Expand toggle button */}
              <div className="mt-auto pt-2">
                <button
                  type="button"
                  title={isLeftPanelOpen ? 'Collapse Left Panel' : 'Expand Left Panel'}
                  onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {isLeftPanelOpen ? (
                    <ChevronLeft className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Tab Panel Content (Hidden if collapsed) */}
            {isLeftPanelOpen && (
              <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
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
                    onRegenerateAutoEditWithSync={handleRegenerateAutoEditWithSync}
                    showMusicMarkers={showMusicMarkers}
                    onToggleMusicMarkers={() => setShowMusicMarkers(!showMusicMarkers)}
                    lastSummary={lastAutoEditSummary}
                  />
                )}
                {activeTab === 'reactivity' && (
                  <MusicReactivityPanel
                    config={
                      musicReactivity.scope === 'selected' && selectedClip?.musicReactivity
                        ? selectedClip.musicReactivity
                        : musicReactivity
                    }
                    onChangeConfig={handleUpdateReactivity}
                    onApplyPreset={handleApplyReactivityPreset}
                    onResetReactivity={handleResetReactivity}
                    musicAnalysis={musicAnalysis}
                    playheadSec={playheadSec}
                    hasSelectedClip={!!selectedClip}
                    selectedClipName={selectedClip?.name}
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
                    onApplyToAllCuts={handleApplyTransitionToAllCuts}
                    musicAnalysis={musicAnalysis}
                  />
                )}
                {activeTab === 'audio' && (
                  <AudioLibraryPanel tracks={project.tracks} onUpdateTrack={handleUpdateTrack} />
                )}
              </div>
            )}
          </div>

          {/* Center: Real Composition Preview Player */}
          <div className="flex-1 min-w-0 flex flex-col bg-[#07090E] relative">
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

          {/* Right Side: Contextual Clip Properties & Diagnostic Panel */}
          {isInspectorOpen && (
            <div className="w-72 bg-[#0D111A] shrink-0 hidden lg:flex flex-col border-l border-white/10">
              <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between text-xs text-white/70 bg-[#0B0F17]">
                <span className="font-semibold uppercase tracking-wider text-[10px]">
                  Clip Inspector
                </span>
                <button
                  type="button"
                  title="Close Inspector"
                  onClick={() => setIsInspectorOpen(false)}
                  className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 min-h-0">
                <PropertiesPanel
                  selectedClip={selectedClip}
                  playheadSec={playheadSec}
                  onUpdateClip={handleUpdateClip}
                  onDeleteClip={handleDeleteClip}
                  onDuplicateClip={handleDuplicateClip}
                  onAddKeyframe={handleAddKeyframe}
                  onRemoveKeyframe={handleRemoveKeyframe}
                  onMoveClipLayer={handleMoveClipLayer}
                />
              </div>
            </div>
          )}

          {!isInspectorOpen && (
            <button
              type="button"
              title="Open Inspector"
              onClick={() => setIsInspectorOpen(true)}
              className="absolute right-2 top-3 z-20 p-2 rounded-lg bg-black/60 border border-white/15 text-white/60 hover:text-white backdrop-blur-md hidden lg:block"
            >
              <Sliders className="w-4 h-4" />
            </button>
          )}
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
                transitionAmount: 'cinematic',
              })
            }
            onSyncToBeats={() =>
              handleQuickRegenerate({
                syncMode: 'beat-sync',
                cutIntensity: 'fast',
              })
            }
            onKeepMelodyCalm={() =>
              handleQuickRegenerate({
                keepMelodyCalm: true,
                syncMode: 'melody-vocal',
              })
            }
            onIncreaseClimax={() =>
              handleQuickRegenerate({
                style: 'climax-rewind',
                cutIntensity: 'fast',
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
            musicBeats={musicAnalysis?.beats || []}
            musicPhrases={musicAnalysis?.phraseBoundaries || []}
            showMusicMarkers={showMusicMarkers}
            onToggleMusicMarkers={() => setShowMusicMarkers(!showMusicMarkers)}
          />
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: DOCUMENTATION, SEO GUIDE, TUTORIAL & FAQS (BELOW THE EDITOR)
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 py-16 space-y-16 text-white/90">
        {/* Intro Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Browser-Native Professional Media Studio</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            IndiaTools Hybrid Video Studio
          </h1>
          <p className="max-w-3xl mx-auto text-sm md:text-base text-white/70 leading-relaxed">
            Create cinema-grade Reels, Shorts, and landscape videos with real Web Audio music
            synchronization, multi-track timeline editing, keyframe motion, color grading LUTs, and
            seekable browser video export without any cloud uploads.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="p-3 w-fit rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Music Intelligence Beat Sync</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Decodes your music locally using the browser Web Audio API to identify downbeats,
              rhythmic accents, structural phrases, and emotional climax sections. Visual cuts
              anchor strictly to musical moments rather than generic intervals.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="p-3 w-fit rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Multi-Track Timeline Editing</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Slice, trim, reorder, and duplicate clips across dedicated video, image, motion
              typography, and audio tracks with magnetic snapping, frame-accurate split points, and
              interactive keyframe animation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="p-3 w-fit rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">100% Client-Side Privacy</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Zero cloud uploads, zero external AI APIs, and zero subscription paywalls. Your videos,
              photos, and audio tracks are processed in your local browser memory and exported
              directly onto your device in Full HD or 4K.
            </p>
          </div>
        </div>

        {/* Step-by-Step Workflow Walkthrough */}
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-cyan-400" />
            <span>How to Create a Video in Hybrid Video Studio</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="text-cyan-400 font-mono font-bold text-sm">STEP 1</div>
              <h4 className="text-sm font-semibold text-white">Import Photos & Music</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Drag and drop your photos, video clips, and background song into the Media Library.
                Supports MP4, WebM, JPG, PNG, and MP3 files.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-cyan-400 font-mono font-bold text-sm">STEP 2</div>
              <h4 className="text-sm font-semibold text-white">Analyze Track Rhythms</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Open the Music Sync tab and click "Analyze Music". The studio extracts tempo,
                measures, phrase boundaries, and peak climax points in seconds.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-cyan-400 font-mono font-bold text-sm">STEP 3</div>
              <h4 className="text-sm font-semibold text-white">Choose Editing Style</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Click "Create Video Automatically" and pick from 8 cinematic archetypes: Melody &
                Emotion, Climax Memory Rewind, Beat Sync, or Cinematic Story.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-cyan-400 font-mono font-bold text-sm">STEP 4</div>
              <h4 className="text-sm font-semibold text-white">Preview & Export Video</h4>
              <p className="text-xs text-white/50 leading-relaxed">
                Fine-tune cut boundaries on the timeline ruler, adjust color grading LUTs, and click
                Export to render a seekable MP4 or WebM video file.
              </p>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Table */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-cyan-400" />
            <span>Studio Keyboard Shortcuts</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
              <span className="text-white/60">Play / Pause</span>
              <kbd className="px-2 py-0.5 rounded bg-white/10 text-cyan-300 font-mono">Space</kbd>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
              <span className="text-white/60">Split Clip</span>
              <kbd className="px-2 py-0.5 rounded bg-white/10 text-cyan-300 font-mono">S</kbd>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
              <span className="text-white/60">Delete Clip</span>
              <kbd className="px-2 py-0.5 rounded bg-white/10 text-cyan-300 font-mono">Delete</kbd>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
              <span className="text-white/60">Undo / Redo</span>
              <kbd className="px-2 py-0.5 rounded bg-white/10 text-cyan-300 font-mono">Ctrl + Z / Y</kbd>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <span>Frequently Asked Questions</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
              <h4 className="font-semibold text-white">
                How does Music Sync Auto Edit work without cloud servers?
              </h4>
              <p className="text-white/60 leading-relaxed">
                Hybrid Video Studio utilizes the Web Audio API to decode your imported audio track
                into raw PCM float audio samples in browser memory. It calculates frame-by-frame RMS
                energy, sub-bass spectral flux, and transient peaks to place cuts strictly on genuine
                musical accents and phrase transitions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
              <h4 className="font-semibold text-white">
                Why do some cuts stay longer while others flash rapidly?
              </h4>
              <p className="text-white/60 leading-relaxed">
                The auto-editor respects the emotional pacing of your track: during calm, melodic,
                or vocal-driven passages, images hold for 4 to 7 seconds with gentle crossfades.
                When the music reaches its detected climax or energetic rhythm, cuts accelerate
                tightly across consecutive beats.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
              <h4 className="font-semibold text-white">
                Can I manually adjust the clips after automatic generation?
              </h4>
              <p className="text-white/60 leading-relaxed">
                Yes! Auto Edit generates a 100% editable timeline. You can drag clip boundaries,
                split clips, reorder media, add custom motion typography, or click any clip to view
                the Music Sync diagnostic explaining why it was placed at that specific timestamp.
              </p>
            </div>
          </div>
        </div>
      </section>

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
        musicAnalysis={musicAnalysis}
        musicReactivity={musicReactivity}
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
