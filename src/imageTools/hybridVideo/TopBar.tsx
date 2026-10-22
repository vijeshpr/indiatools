import React from 'react'
import {
  Film,
  Undo2,
  Redo2,
  Download,
  FolderOpen,
  Save,
  Monitor,
  Smartphone,
  Square,
  Maximize2,
} from 'lucide-react'
import type { AspectRatioId, CanvasDimensions } from '../../lib/hybridVideo/types.ts'
import { ASPECT_RATIO_PRESETS } from '../../lib/hybridVideo/types.ts'

interface TopBarProps {
  projectName: string
  onProjectNameChange: (name: string) => void
  dimensions: CanvasDimensions
  onDimensionsChange: (dims: CanvasDimensions) => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onOpenProjectModal: () => void
  onOpenExportModal: () => void
}

export const TopBar: React.FC<TopBarProps> = ({
  projectName,
  onProjectNameChange,
  dimensions,
  onDimensionsChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenProjectModal,
  onOpenExportModal,
}) => {
  return (
    <header className="h-14 bg-[#0B0F17] border-b border-white/10 px-4 flex items-center justify-between select-none">
      {/* Brand & Project Name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
          <Film className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold tracking-wider uppercase">Hybrid Video Studio</span>
        </div>

        <div className="h-4 w-px bg-white/15 mx-1 hidden sm:block" />

        <input
          type="text"
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          placeholder="Untitled Project"
          className="bg-transparent hover:bg-white/5 focus:bg-black/40 border border-transparent hover:border-white/10 focus:border-cyan-500/40 rounded px-2 py-0.5 text-sm font-medium text-white placeholder-white/30 focus:outline-none transition-colors max-w-[200px] truncate"
        />
      </div>

      {/* Center Controls: Aspect Ratio & History */}
      <div className="flex items-center gap-2">
        {/* Aspect Ratio Picker */}
        <div className="flex items-center bg-black/40 border border-white/10 rounded-lg p-0.5">
          <button
            type="button"
            title="16:9 Landscape (Desktop, YouTube)"
            onClick={() => onDimensionsChange(ASPECT_RATIO_PRESETS['16:9'])}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              dimensions.aspectRatioId === '16:9'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">16:9</span>
          </button>

          <button
            type="button"
            title="9:16 Portrait (Reels, Shorts, TikTok)"
            onClick={() => onDimensionsChange(ASPECT_RATIO_PRESETS['9:16'])}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              dimensions.aspectRatioId === '9:16'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">9:16</span>
          </button>

          <button
            type="button"
            title="1:1 Square (Instagram Posts)"
            onClick={() => onDimensionsChange(ASPECT_RATIO_PRESETS['1:1'])}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              dimensions.aspectRatioId === '1:1'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Square className="w-3.5 h-3.5" />
            <span className="hidden md:inline">1:1</span>
          </button>
        </div>

        <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />

        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={!canUndo}
            onClick={onUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={!canRedo}
            onClick={onRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Actions: Project Save & Export */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenProjectModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-medium transition-colors"
        >
          <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Project</span>
        </button>

        <button
          type="button"
          onClick={onOpenExportModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
        >
          <Download className="w-3.5 h-3.5 text-black" />
          <span>Export Video</span>
        </button>
      </div>
    </header>
  )
}
