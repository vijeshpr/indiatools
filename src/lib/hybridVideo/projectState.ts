/**
 * IndiaTools — Hybrid Video Studio Project State & Persistence Engine
 * Versioned Project Schema, LocalStorage Autosave, and JSON Project Export/Import
 */

import {
  type HybridVideoProject,
  type Track,
  ASPECT_RATIO_PRESETS,
} from './types.ts'

export const CURRENT_PROJECT_VERSION = 1
export const AUTOSAVE_STORAGE_KEY = 'indiatools_hybrid_video_project_v1'

export function createDefaultProject(): HybridVideoProject {
  const defaultTracks: Track[] = [
    { id: 'track-text-1', name: 'T1 · Titles & Text', type: 'text', locked: false, muted: false, hidden: false, volume: 1 },
    { id: 'track-video-2', name: 'V2 · Overlay / PiP', type: 'image', locked: false, muted: false, hidden: false, volume: 1 },
    { id: 'track-video-1', name: 'V1 · Main Video / Photos', type: 'video', locked: false, muted: false, hidden: false, volume: 1 },
    { id: 'track-audio-1', name: 'A1 · Music & Audio', type: 'audio', locked: false, muted: false, hidden: false, volume: 1 },
  ]

  return {
    settings: {
      version: CURRENT_PROJECT_VERSION,
      id: `proj-${Date.now()}`,
      name: 'Untitled Video Project',
      fps: 30,
      dimensions: { ...ASPECT_RATIO_PRESETS['16:9'] },
      durationSec: 15,
      backgroundColor: '#090A0F',
    },
    tracks: defaultTracks,
    clips: [],
    mediaAssets: [],
  }
}

export function saveProjectToJson(project: HybridVideoProject): string {
  // Strip out File objects and transient memory blob URLs before JSON export
  const exportable = {
    ...project,
    mediaAssets: project.mediaAssets.map((asset) => ({
      id: asset.id,
      name: asset.name,
      type: asset.type,
      durationSec: asset.durationSec,
      naturalWidth: asset.naturalWidth,
      naturalHeight: asset.naturalHeight,
      sizeBytes: asset.sizeBytes,
      mimeType: asset.mimeType,
      createdAt: asset.createdAt,
      // Note: user will relink files if opened on another machine/session
    })),
  }
  return JSON.stringify(exportable, null, 2)
}

export function parseProjectJson(jsonStr: string): HybridVideoProject {
  const parsed = JSON.parse(jsonStr)

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid project JSON file: expected object')
  }

  if (!parsed.settings || !Array.isArray(parsed.tracks) || !Array.isArray(parsed.clips)) {
    throw new Error('Incompatible project schema: missing settings, tracks, or clips')
  }

  return {
    settings: {
      version: parsed.settings.version || CURRENT_PROJECT_VERSION,
      id: parsed.settings.id || `proj-${Date.now()}`,
      name: parsed.settings.name || 'Restored Project',
      fps: parsed.settings.fps || 30,
      dimensions: parsed.settings.dimensions || { ...ASPECT_RATIO_PRESETS['16:9'] },
      durationSec: parsed.settings.durationSec || 15,
      backgroundColor: parsed.settings.backgroundColor || '#090A0F',
    },
    tracks: parsed.tracks,
    clips: parsed.clips,
    mediaAssets: Array.isArray(parsed.mediaAssets) ? parsed.mediaAssets : [],
  }
}

export function saveProjectToLocalStorage(project: HybridVideoProject): void {
  try {
    const jsonStr = saveProjectToJson(project)
    localStorage.setItem(AUTOSAVE_STORAGE_KEY, jsonStr)
  } catch {
    // LocalStorage quota may be exceeded; safely ignore
  }
}

export function loadProjectFromLocalStorage(): HybridVideoProject | null {
  try {
    const saved = localStorage.getItem(AUTOSAVE_STORAGE_KEY)
    if (!saved) return null
    return parseProjectJson(saved)
  } catch {
    return null
  }
}
