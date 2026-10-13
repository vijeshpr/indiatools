import React, { useRef, useEffect, useState, useCallback } from 'react'
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react'
import {
  BatchItem,
  TextWatermarkConfig,
  LogoWatermarkConfig,
  WatermarkMode,
  ExportConfig,
} from '../../lib/watermarkEngine/types'
import {
  stampCanvas,
  exportCanvasToBlob,
} from '../../lib/watermarkEngine/stampRenderer'
import { triggerBlobDownload } from '../../lib/watermarkEngine/zipExporter'
import { BatchWatermarkTranslation } from '../../lib/watermarkEngine/i18n'

interface Props {
  activeItem: BatchItem | null
  mode: WatermarkMode
  textConfig: TextWatermarkConfig
  logoConfig: LogoWatermarkConfig
  logoImageElement: HTMLImageElement | null
  exportConfig: ExportConfig
  t: BatchWatermarkTranslation
}

export const LivePreviewViewport: React.FC<Props> = ({
  activeItem,
  mode,
  textConfig,
  logoConfig,
  logoImageElement,
  exportConfig,
  t,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [loadedSourceImage, setLoadedSourceImage] = useState<HTMLImageElement | null>(null)
  const [isExportingSingle, setIsExportingSingle] = useState(false)

  // Load the active preview image when it changes
  useEffect(() => {
    if (!activeItem) {
      setLoadedSourceImage(null)
      return
    }

    let isSubscribed = true
    const img = new Image()

    img.onload = () => {
      if (isSubscribed) {
        setLoadedSourceImage(img)
      }
    }

    img.onerror = () => {
      if (isSubscribed) {
        setLoadedSourceImage(null)
      }
    }

    img.src = activeItem.previewUrl

    return () => {
      isSubscribed = false
    }
  }, [activeItem])

  // Real-time canvas render loop
  const renderPreview = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !loadedSourceImage) return

    stampCanvas(
      canvas,
      loadedSourceImage,
      loadedSourceImage.naturalWidth,
      loadedSourceImage.naturalHeight,
      mode,
      textConfig,
      logoConfig,
      logoImageElement
    )
  }, [loadedSourceImage, mode, textConfig, logoConfig, logoImageElement])

  useEffect(() => {
    renderPreview()
  }, [renderPreview])

  const handleDownloadSingle = async () => {
    const canvas = canvasRef.current
    if (!canvas || !activeItem) return

    try {
      setIsExportingSingle(true)
      const blob = await exportCanvasToBlob(
        canvas,
        exportConfig.format,
        activeItem.type || 'image/jpeg',
        exportConfig.quality
      )
      const ext =
        exportConfig.format === 'image/jpeg' ? 'jpg' :
        exportConfig.format === 'image/png' ? 'png' :
        exportConfig.format === 'image/webp' ? 'webp' : 'jpg'
      const name = `${activeItem.name.replace(/\.[^/.]+$/, '')}_watermarked.${ext}`
      triggerBlobDownload(blob, name)
    } finally {
      setIsExportingSingle(false)
    }
  }

  return (
    <div className="flex flex-col h-full rounded-2xl bg-slate-950 border border-slate-800/80 shadow-2xl overflow-hidden">
      {/* Top Viewport Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Studio Canvas</span>
          </div>
          {activeItem && (
            <div className="flex items-center gap-2 text-slate-400 text-[11px] truncate font-mono">
              <span className="text-slate-600">•</span>
              <span className="truncate max-w-[180px] text-slate-300">{activeItem.name}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-semibold">
                {activeItem.width} × {activeItem.height} px
              </span>
            </div>
          )}
        </div>

        {/* Viewport Zoom & Single Download Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(0.4, Number((z - 0.15).toFixed(2))))}
            title="Zoom Out"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-slate-400 px-1.5 min-w-[36px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(2.5, Number((z + 0.15).toFixed(2))))}
            title="Zoom In"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(1)}
            title="Reset Zoom"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {activeItem && (
            <button
              type="button"
              onClick={handleDownloadSingle}
              disabled={isExportingSingle}
              className="ml-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold transition-all shadow-sm"
              title={t.downloadCurrent}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExportingSingle ? 'Saving...' : 'Save Single'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas Viewport Area */}
      <div className="relative flex-1 min-h-[360px] md:min-h-[460px] max-h-[640px] bg-black flex items-center justify-center p-4 overflow-auto select-none">
        {/* Subtle background grid pattern */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {activeItem ? (
          <div
            className="relative transition-transform duration-100 ease-out origin-center shadow-2xl border border-slate-800/80 rounded-sm overflow-hidden"
            style={{
              transform: `scale(${zoomLevel})`,
            }}
          >
            <canvas
              ref={canvasRef}
              className="max-h-[560px] w-auto h-auto object-contain block mx-auto"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 max-w-sm text-slate-500 z-10">
            <div className="w-16 h-16 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center mb-3 shadow-inner">
              <ImageIcon className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-sm font-medium text-slate-300 mb-1">
              {t.emptyQueue}
            </p>
            <p className="text-xs text-slate-500">
              {t.dropSubtitle}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
