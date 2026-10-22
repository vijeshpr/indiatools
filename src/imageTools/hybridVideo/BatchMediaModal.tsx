import React, { useState } from 'react'
import {
  X,
  PlusCircle,
  Image as ImageIcon,
  Video,
  Shuffle,
  ListOrdered,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react'
import type { HybridVideoProject, MediaAsset } from '../../lib/hybridVideo/types.ts'
import {
  batchInsertMediaToTimeline,
  filterAndOrderMedia,
  type BatchInsertOptions,
} from '../../lib/hybridVideo/batchMediaOperations.ts'

interface BatchMediaModalProps {
  isOpen: boolean
  onClose: () => void
  project: HybridVideoProject
  playheadSec: number
  onApplyBatchInsert: (updatedProject: HybridVideoProject, message: string) => void
}

export const BatchMediaModal: React.FC<BatchMediaModalProps> = ({
  isOpen,
  onClose,
  project,
  playheadSec,
  onApplyBatchInsert,
}) => {
  const [filter, setFilter] = useState<'all' | 'images-only' | 'videos-only'>('all')
  const [order, setOrder] = useState<'library' | 'shuffle'>('library')
  const [stillDuration, setStillDuration] = useState(3.0)
  const [placement, setPlacement] = useState<'timeline-start' | 'playhead'>('timeline-start')
  const [mode, setMode] = useState<'replace-primary-track' | 'append'>('replace-primary-track')

  if (!isOpen) return null

  const eligible = filterAndOrderMedia(project.mediaAssets, filter, order)
  const imageCount = eligible.filter((a) => a.type === 'image').length
  const videoCount = eligible.filter((a) => a.type === 'video').length

  const handleConfirm = () => {
    const options: BatchInsertOptions = {
      mediaFilter: filter,
      order,
      stillImageDurationSec: stillDuration,
      placement,
      mode,
    }

    const { updatedProject, summary } = batchInsertMediaToTimeline(
      project,
      options,
      playheadSec
    )
    onApplyBatchInsert(updatedProject, summary)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0F131D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-white">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Add All Media to Timeline</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Summary Box */}
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-xs flex items-center justify-between">
            <div>
              <span className="font-semibold text-white">Ready to insert: </span>
              {eligible.length === 0 ? (
                <span className="text-red-400">No matching media in library</span>
              ) : (
                <span>
                  {imageCount > 0 ? `${imageCount} photo${imageCount > 1 ? 's' : ''}` : ''}
                  {imageCount > 0 && videoCount > 0 ? ' and ' : ''}
                  {videoCount > 0 ? `${videoCount} video${videoCount > 1 ? 's' : ''}` : ''}
                </span>
              )}
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
              {eligible.length} total
            </span>
          </div>

          {/* Media Filter */}
          <div>
            <label className="text-xs font-semibold text-white/80 block mb-1.5">Media Types</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'all', label: 'All Media' },
                { id: 'images-only', label: 'Photos Only' },
                { id: 'videos-only', label: 'Videos Only' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id as any)}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                    filter === item.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                      : 'bg-white/[0.03] text-white/60 border-white/10 hover:bg-white/[0.06]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Order */}
          <div>
            <label className="text-xs font-semibold text-white/80 block mb-1.5">Clip Sequence Order</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOrder('library')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                  order === 'library'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-white/[0.03] text-white/60 border-white/10 hover:bg-white/[0.06]'
                }`}
              >
                <ListOrdered className="w-4 h-4 text-cyan-400" />
                <span>Media Library Order</span>
              </button>

              <button
                type="button"
                onClick={() => setOrder('shuffle')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                  order === 'shuffle'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-white/[0.03] text-white/60 border-white/10 hover:bg-white/[0.06]'
                }`}
              >
                <Shuffle className="w-4 h-4 text-cyan-400" />
                <span>Shuffle Order</span>
              </button>
            </div>
          </div>

          {/* Still Image Duration */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-white/80">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Still Photo Duration
              </span>
              <span className="font-mono text-cyan-300">{stillDuration.toFixed(1)}s</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={10.0}
              step={0.5}
              value={stillDuration}
              onChange={(e) => setStillDuration(Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
            <p className="text-[10px] text-white/40">
              Videos will use their native file duration automatically.
            </p>
          </div>

          {/* Placement & Mode */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-semibold text-white/80 block mb-1">Insert Position</label>
              <select
                value={placement}
                onChange={(e) => setPlacement(e.target.value as any)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
              >
                <option value="timeline-start">Timeline Start (0s)</option>
                <option value="playhead">At Playhead ({playheadSec.toFixed(1)}s)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-white/80 block mb-1">Track Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
              >
                <option value="replace-primary-track">Replace Primary Track</option>
                <option value="append">Append After Existing</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 flex items-center justify-end gap-2 bg-black/20">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={eligible.length === 0}
            onClick={handleConfirm}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:pointer-events-none text-black font-semibold text-xs transition-all shadow-md shadow-cyan-500/20"
          >
            <PlusCircle className="w-3.5 h-3.5 text-black" />
            <span>Add {eligible.length} Media Items</span>
          </button>
        </div>
      </div>
    </div>
  )
}
