import React, { useState } from 'react'
import {
  X,
  Download,
  Film,
  CheckCircle2,
  AlertCircle,
  Loader2,
  StopCircle,
} from 'lucide-react'
import type { ExportConfig, HybridVideoProject, MediaAsset } from '../../lib/hybridVideo/types.ts'
import { HybridVideoExporter, type ExportProgress, type ExportResult } from '../../lib/hybridVideo/exportEngine.ts'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  project: HybridVideoProject
  mediaAssets: Map<string, MediaAsset>
  videoElements: Map<string, HTMLVideoElement>
  imageElements: Map<string, HTMLImageElement>
  musicAnalysis?: import('../../lib/hybridVideo/musicIntelligence.ts').MusicAnalysisResult | null
  musicReactivity?: import('../../lib/hybridVideo/types.ts').MusicReactivityConfig | null
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
  mediaAssets,
  videoElements,
  imageElements,
  musicAnalysis,
  musicReactivity,
}) => {
  const [resolution, setResolution] = useState<'720p' | '1080p' | '4k'>('1080p')
  const [format, setFormat] = useState<'webm' | 'mp4'>('webm')
  const [fps, setFps] = useState<30 | 60>(30)
  const [includeAudio, setIncludeAudio] = useState(true)

  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState<ExportProgress | null>(null)
  const [exportResult, setExportResult] = useState<ExportResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [exporter, setExporter] = useState<HybridVideoExporter | null>(null)

  if (!isOpen) return null

  // Calculate resolution dimensions based on aspect ratio
  const getExportDimensions = () => {
    const isPortrait = project.settings.dimensions.aspectRatioId === '9:16'
    const isSquare = project.settings.dimensions.aspectRatioId === '1:1'
    const isFeed = project.settings.dimensions.aspectRatioId === '4:5'

    if (resolution === '720p') {
      if (isPortrait) return { width: 720, height: 1280 }
      if (isSquare) return { width: 720, height: 720 }
      if (isFeed) return { width: 720, height: 900 }
      return { width: 1280, height: 720 }
    } else if (resolution === '4k') {
      if (isPortrait) return { width: 2160, height: 3840 }
      if (isSquare) return { width: 2160, height: 2160 }
      if (isFeed) return { width: 2160, height: 2700 }
      return { width: 3840, height: 2160 }
    } else {
      // 1080p
      if (isPortrait) return { width: 1080, height: 1920 }
      if (isSquare) return { width: 1080, height: 1080 }
      if (isFeed) return { width: 1080, height: 1350 }
      return { width: 1920, height: 1080 }
    }
  }

  const handleStartExport = async () => {
    setIsExporting(true)
    setErrorMessage(null)
    setExportResult(null)

    const dims = getExportDimensions()
    const config: ExportConfig = {
      format,
      resolution,
      width: dims.width,
      height: dims.height,
      fps,
      bitrateBps: resolution === '4k' ? 18000000 : resolution === '1080p' ? 9000000 : 5000000,
      includeAudio,
    }

    const exp = new HybridVideoExporter()
    setExporter(exp)

    try {
      const result = await exp.renderAndExport(
        project,
        config,
        mediaAssets,
        videoElements,
        imageElements,
        (p) => setProgress(p),
        musicAnalysis,
        musicReactivity
      )
      setExportResult(result)
    } catch (err) {
      if ((err as Error).message !== 'Export cancelled by user') {
        setErrorMessage((err as Error).message || 'Export failed')
      }
    } finally {
      setIsExporting(false)
      setExporter(null)
    }
  }

  const handleCancelExport = () => {
    if (exporter) {
      exporter.cancel()
    }
  }

  const handleDownload = () => {
    if (!exportResult) return
    const url = URL.createObjectURL(exportResult.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = exportResult.fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 10000)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0F131D] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-white">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Export Video Composition</h2>
          </div>
          {!isExporting && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {!isExporting && !exportResult ? (
            <>
              {/* Resolution */}
              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1.5">
                  Output Resolution
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['720p', '1080p', '4k'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setResolution(r)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        resolution === r
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                          : 'bg-white/[0.03] text-white/60 border-white/10 hover:bg-white/[0.06]'
                      }`}
                    >
                      {r.toUpperCase()}
                      <span className="block text-[10px] font-normal opacity-60">
                        {r === '720p' ? 'HD Ready' : r === '1080p' ? 'Full HD' : 'Ultra HD'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="text-xs font-semibold text-white/80 block mb-1.5">
                  Container Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormat('webm')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all ${
                      format === 'webm'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-white/[0.03] text-white/60 border-white/10 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="font-semibold text-white">WebM (VP9 + Opus)</div>
                    <div className="text-[10px] opacity-60">Universal browser seekable format</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormat('mp4')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all ${
                      format === 'mp4'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-white/[0.03] text-white/60 border-white/10 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="font-semibold text-white">MP4 (H.264)</div>
                    <div className="text-[10px] opacity-60">Browser supported devices</div>
                  </button>
                </div>
              </div>

              {/* Frame rate & Audio */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1.5">Frame Rate</label>
                  <select
                    value={fps}
                    onChange={(e) => setFps(Number(e.target.value) as 30 | 60)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value={30}>30 FPS (Standard)</option>
                    <option value={60}>60 FPS (Cinematic Smooth)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/80 block mb-1.5">Audio Tracks</label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeAudio}
                      onChange={(e) => setIncludeAudio(e.target.checked)}
                      className="accent-cyan-400 w-4 h-4 rounded"
                    />
                    <span className="text-xs text-white/80">Include Audio</span>
                  </label>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </>
          ) : isExporting ? (
            /* Exporting Progress View */
            <div className="py-6 flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold font-mono text-cyan-300">
                  {progress?.percent || 0}%
                </span>
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  {progress?.phaseText || 'Rendering video frames...'}
                </p>
                <p className="text-xs text-white/50 mt-1">
                  Time elapsed: {progress?.elapsedSec || 0}s • Remaining: ~{progress?.remainingSec || 0}s
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  style={{ width: `${progress?.percent || 0}%` }}
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-200"
                />
              </div>

              <button
                type="button"
                onClick={handleCancelExport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-medium transition-colors"
              >
                <StopCircle className="w-3.5 h-3.5" />
                <span>Cancel Export</span>
              </button>
            </div>
          ) : exportResult ? (
            /* Export Completed View */
            <div className="py-6 flex flex-col items-center text-center space-y-3">
              <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">Video Rendered Successfully!</h3>
                <p className="text-xs text-white/60 mt-1">
                  {exportResult.fileName} • {exportResult.formattedSize}
                </p>
              </div>

              <div className="pt-2 w-full flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Video</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        {!isExporting && !exportResult && (
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
              onClick={handleStartExport}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs transition-all shadow-md shadow-cyan-500/20"
            >
              <Film className="w-3.5 h-3.5 text-black" />
              <span>Start Rendering</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
