import React, { useRef, useState } from 'react'
import {
  Upload,
  Video,
  Image as ImageIcon,
  Music,
  Plus,
  Trash2,
  AlertCircle,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react'
import type { MediaAsset } from '../../lib/hybridVideo/types.ts'
import { probeMediaFile } from '../../lib/hybridVideo/mediaManager.ts'

interface MediaLibraryPanelProps {
  mediaAssets: MediaAsset[]
  onAddMedia: (assets: MediaAsset[]) => void
  onRemoveMedia: (assetId: string) => void
  onAddToTimeline: (asset: MediaAsset) => void
  onClearMedia: () => void
  onOpenBatchModal?: () => void
  onOpenAutoEditModal?: () => void
}

export const MediaLibraryPanel: React.FC<MediaLibraryPanelProps> = ({
  mediaAssets,
  onAddMedia,
  onRemoveMedia,
  onAddToTimeline,
  onClearMedia,
  onOpenBatchModal,
  onOpenAutoEditModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return
    setIsProcessing(true)
    setErrorMessage(null)

    const loadedAssets: MediaAsset[] = []
    const errors: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        const asset = await probeMediaFile(file)
        loadedAssets.push(asset)
      } catch (err) {
        errors.push(`${file.name}: ${(err as Error).message}`)
      }
    }

    if (loadedAssets.length > 0) {
      onAddMedia(loadedAssets)
    }

    if (errors.length > 0) {
      setErrorMessage(errors.join(' | '))
    }

    setIsProcessing(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const formatSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="flex flex-col h-full bg-[#0D111A] text-white">
      {/* Upload Drag & Drop Box */}
      <div className="p-3 border-b border-white/10">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-cyan-400 bg-cyan-500/10 scale-[0.99]'
              : 'border-white/15 bg-white/[0.02] hover:border-cyan-500/40 hover:bg-white/[0.04]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="video/*,image/*,audio/*"
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />

          <div className="flex flex-col items-center gap-1.5">
            <div className="p-2.5 rounded-full bg-cyan-500/10 text-cyan-400">
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-white/90">
              {isProcessing ? 'Probing media...' : 'Import Videos, Images & Audio'}
            </div>
            <p className="text-[11px] text-white/50">
              Drag & drop files or click to browse (100% local, no server uploads)
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-2.5 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="truncate">{errorMessage}</span>
          </div>
        )}

        {/* One-Click Batch Actions Bar */}
        {mediaAssets.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex gap-2">
              {onOpenBatchModal && (
                <button
                  type="button"
                  onClick={onOpenBatchModal}
                  className="flex-1 py-2 px-2.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Add All Media to Timeline</span>
                </button>
              )}

              {onOpenAutoEditModal && (
                <button
                  type="button"
                  onClick={onOpenAutoEditModal}
                  className="py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/20 active:scale-[0.98]"
                  title="Automatically pace photos to music"
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span className="hidden sm:inline">Auto Edit</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Header bar with Count & Clear */}
      <div className="px-3 py-2 flex items-center justify-between text-xs text-white/60 border-b border-white/5">
        <span>Media Assets ({mediaAssets.length})</span>
        {mediaAssets.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Clear all assets from the media library?')) {
                onClearMedia()
              }
            }}
            className="text-[11px] text-red-400/70 hover:text-red-400 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Assets Grid / List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {mediaAssets.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/40">
            <Video className="w-8 h-8 mb-2 stroke-[1.5] text-white/20" />
            <p className="text-xs">No media files imported yet</p>
            <p className="text-[11px] text-white/30 mt-1">
              Supports MP4, WebM, JPG, PNG, WebP, MP3, WAV
            </p>
          </div>
        ) : (
          mediaAssets.map((asset) => (
            <div
              key={asset.id}
              className="group relative flex items-center gap-2.5 p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 transition-all"
            >
              {/* Thumbnail / Icon */}
              <div className="w-14 h-11 rounded bg-black/40 overflow-hidden flex items-center justify-center shrink-0 border border-white/10 relative">
                {asset.thumbnailUrl ? (
                  <img src={asset.thumbnailUrl} alt={asset.name} className="w-full h-full object-cover" />
                ) : asset.type === 'video' ? (
                  <Video className="w-5 h-5 text-cyan-400" />
                ) : asset.type === 'image' ? (
                  <ImageIcon className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Music className="w-5 h-5 text-violet-400" />
                )}

                {/* Type Badge */}
                <span className="absolute bottom-0.5 right-0.5 text-[9px] font-bold px-1 rounded bg-black/70 uppercase tracking-wider text-white/80">
                  {asset.type}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white/90 truncate" title={asset.name}>
                  {asset.name}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-white/40 mt-0.5">
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />
                    {formatDuration(asset.durationSec)}
                  </span>
                  <span>•</span>
                  <span>{formatSize(asset.sizeBytes)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  title="Add to timeline"
                  onClick={() => onAddToTimeline(asset)}
                  className="p-1.5 rounded-md bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Delete asset"
                  onClick={() => onRemoveMedia(asset.id)}
                  className="p-1.5 rounded-md hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
