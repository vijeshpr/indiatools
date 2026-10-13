import React, { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  UploadCloud,
  Type,
  Image as ImageIcon,
  Layers,
} from 'lucide-react'
import {
  BatchItem,
  TextWatermarkConfig,
  LogoWatermarkConfig,
  WatermarkMode,
  ExportConfig,
} from '../../lib/watermarkEngine/types'
import {
  DEFAULT_TEXT_CONFIG,
  DEFAULT_LOGO_CONFIG,
  DEFAULT_EXPORT_CONFIG,
} from '../../lib/watermarkEngine/stampRenderer'
import {
  runBatchProcessor,
  loadLogoImage,
} from '../../lib/watermarkEngine/batchProcessor'
import {
  exportBatchToZip,
  triggerBlobDownload,
} from '../../lib/watermarkEngine/zipExporter'
import { LivePreviewViewport } from './LivePreviewViewport'
import { BatchQueue } from './BatchQueue'
import { TextControlsPanel } from './TextControlsPanel'
import { LogoControlsPanel } from './LogoControlsPanel'
import { BatchActionFooter } from './BatchActionFooter'
import { BatchWatermarkTranslation } from '../../lib/watermarkEngine/i18n'

interface Props {
  t: BatchWatermarkTranslation
}

export const BatchWatermarkWorkspace: React.FC<Props> = ({ t }) => {
  const [items, setItems] = useState<BatchItem[]>([])
  const [activeItemId, setActiveItemId] = useState<string | null>(null)
  const [mode, setMode] = useState<WatermarkMode>('text')

  const [textConfig, setTextConfig] = useState<TextWatermarkConfig>(DEFAULT_TEXT_CONFIG)
  const [logoConfig, setLogoConfig] = useState<LogoWatermarkConfig>(DEFAULT_LOGO_CONFIG)
  const [logoImageElement, setLogoImageElement] = useState<HTMLImageElement | null>(null)

  const [exportConfig, setExportConfig] = useState<ExportConfig>(DEFAULT_EXPORT_CONFIG)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [isZipping, setIsZipping] = useState<boolean>(false)
  const [overallProgress, setOverallProgress] = useState<number>(0)
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false)

  const dropZoneRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Add files to batch queue
  const handleAddFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (fileArray.length === 0) return

    const newItems: BatchItem[] = []

    let loadedCount = 0
    fileArray.forEach((file) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      const previewUrl = URL.createObjectURL(file)

      const img = new Image()
      img.onload = () => {
        newItems.push({
          id,
          file,
          name: file.name,
          size: file.size,
          type: file.type || 'image/jpeg',
          width: img.naturalWidth,
          height: img.naturalHeight,
          previewUrl,
          status: 'queued',
          progress: 0,
        })

        loadedCount++
        if (loadedCount === fileArray.length) {
          setItems((prev) => {
            const updated = [...prev, ...newItems]
            if (!activeItemId && updated.length > 0) {
              setActiveItemId(updated[0].id)
            }
            return updated
          })
        }
      }

      img.onerror = () => {
        loadedCount++
      }

      img.src = previewUrl
    })
  }, [activeItemId])

  // Handle Drag & Drop on main dropzone
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddFiles(e.dataTransfer.files)
    }
  }

  // Handle Logo Upload
  const handleUploadLogo = async (file: File) => {
    try {
      const url = URL.createObjectURL(file)
      const img = await loadLogoImage(url)
      setLogoImageElement(img)
      setLogoConfig((prev) => ({
        ...prev,
        logoUrl: url,
        logoWidth: img.naturalWidth,
        logoHeight: img.naturalHeight,
      }))
    } catch (err) {
      console.error('Failed to load logo', err)
    }
  }

  const handleClearLogo = () => {
    if (logoConfig.logoUrl) {
      URL.revokeObjectURL(logoConfig.logoUrl)
    }
    setLogoImageElement(null)
    setLogoConfig((prev) => ({
      ...prev,
      logoUrl: null,
      logoWidth: 0,
      logoHeight: 0,
    }))
  }

  // Remove single item from queue
  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id)
      if (target) {
        URL.revokeObjectURL(target.previewUrl)
        if (target.processedUrl) URL.revokeObjectURL(target.processedUrl)
      }
      const filtered = prev.filter((item) => item.id !== id)
      if (activeItemId === id) {
        setActiveItemId(filtered.length > 0 ? filtered[0].id : null)
      }
      return filtered
    })
  }

  // Clear all items from queue
  const handleClearAll = () => {
    items.forEach((item) => {
      URL.revokeObjectURL(item.previewUrl)
      if (item.processedUrl) URL.revokeObjectURL(item.processedUrl)
    })
    setItems([])
    setActiveItemId(null)
  }

  // Batch Processor execution
  const handleStartProcessBatch = async () => {
    if (items.length === 0 || isProcessing) return

    try {
      setIsProcessing(true)
      setOverallProgress(0)

      const updated = await runBatchProcessor(
        items,
        mode,
        textConfig,
        logoConfig,
        logoImageElement,
        exportConfig,
        {
          onItemProgress: (id, prog) => {
            setItems((prev) =>
              prev.map((i) =>
                i.id === id ? { ...i, progress: prog, status: 'processing' } : i
              )
            )
          },
          onItemComplete: (id, blob, url) => {
            setItems((prev) =>
              prev.map((i) =>
                i.id === id
                  ? { ...i, status: 'done', progress: 100, processedBlob: blob, processedUrl: url }
                  : i
              )
            )
          },
          onOverallProgress: (_completed, _total, percent) => {
            setOverallProgress(percent)
          },
        }
      )

      setItems(updated)
      setOverallProgress(100)

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#22d3ee', '#10b981', '#3b82f6'],
        })
      } catch {
        // Ignore confetti error
      }
    } finally {
      setIsProcessing(false)
    }
  }

  // ZIP Exporter execution
  const handleDownloadZip = async () => {
    const completed = items.filter((i) => i.status === 'done' && i.processedBlob)
    if (completed.length === 0 || isZipping) return

    try {
      setIsZipping(true)
      const zipBlob = await exportBatchToZip(items, exportConfig)
      const zipFilename = `IndiaTools-Watermarked-Batch-${completed.length}-photos.zip`
      triggerBlobDownload(zipBlob, zipFilename)
    } catch (err) {
      console.error('ZIP export failed', err)
    } finally {
      setIsZipping(false)
    }
  }

  const activeItem = items.find((i) => i.id === activeItemId) || null
  const completedCount = items.filter((i) => i.status === 'done').length

  return (
    <div className="space-y-6">
      {/* Top Drag-and-Drop Area */}
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-3xl p-6 md:p-8 text-center cursor-pointer transition-all duration-200 border-2 border-dashed ${
          isDraggingOver
            ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_30px_rgba(6,182,212,0.25)] scale-[1.01]'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900/80 shadow-xl'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleAddFiles(e.target.files)
              e.target.value = ''
            }
          }}
          multiple
          accept="image/*"
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center mb-3 shadow-inner border border-slate-800">
            <UploadCloud className="w-7 h-7 text-cyan-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-100 mb-1">
            {t.dropTitle}
          </h3>
          <p className="text-xs text-slate-400 mb-3 max-w-md">
            {t.dropSubtitle}
          </p>
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 font-semibold text-xs border border-cyan-500/30 transition-all shadow-sm"
          >
            {t.dropBrowse}
          </button>
        </div>
      </div>

      {/* Main Studio Batch Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center Viewport Column (7 Cols on Desktop) */}
        <div className="lg:col-span-7 space-y-6">
          <LivePreviewViewport
            activeItem={activeItem}
            mode={mode}
            textConfig={textConfig}
            logoConfig={logoConfig}
            logoImageElement={logoImageElement}
            exportConfig={exportConfig}
            t={t}
          />

          {/* Batch Queue directly under preview */}
          <BatchQueue
            items={items}
            activeItemId={activeItemId}
            onSelectItem={setActiveItemId}
            onRemoveItem={handleRemoveItem}
            onClearAll={handleClearAll}
            onAddFiles={handleAddFiles}
            t={t}
            isProcessing={isProcessing}
          />
        </div>

        {/* Right Control Panels Column (5 Cols on Desktop) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
            <button
              type="button"
              onClick={() => setMode('text')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'text'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>{t.tabText}</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('logo')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'logo'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{t.tabLogo}</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('dual')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'dual'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t.tabDual}</span>
            </button>
          </div>

          {/* Active Settings Panel */}
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 p-5 shadow-2xl backdrop-blur-xl">
            {mode === 'text' && (
              <TextControlsPanel
                config={textConfig}
                onChange={(updated) =>
                  setTextConfig((prev) => ({ ...prev, ...updated }))
                }
                t={t}
              />
            )}

            {mode === 'logo' && (
              <LogoControlsPanel
                config={logoConfig}
                onChange={(updated) =>
                  setLogoConfig((prev) => ({ ...prev, ...updated }))
                }
                onUploadLogo={handleUploadLogo}
                onClearLogo={handleClearLogo}
                t={t}
              />
            )}

            {mode === 'dual' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    <Type className="w-4 h-4" />
                    <span>Layer 1: Text Watermark</span>
                  </div>
                  <TextControlsPanel
                    config={textConfig}
                    onChange={(updated) =>
                      setTextConfig((prev) => ({ ...prev, ...updated }))
                    }
                    t={t}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    <ImageIcon className="w-4 h-4" />
                    <span>Layer 2: Logo Stamp</span>
                  </div>
                  <LogoControlsPanel
                    config={logoConfig}
                    onChange={(updated) =>
                      setLogoConfig((prev) => ({ ...prev, ...updated }))
                    }
                    onUploadLogo={handleUploadLogo}
                    onClearLogo={handleClearLogo}
                    t={t}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Process & Export Controls */}
          <BatchActionFooter
            totalItems={items.length}
            completedItems={completedCount}
            isProcessing={isProcessing}
            isZipping={isZipping}
            overallProgress={overallProgress}
            exportConfig={exportConfig}
            onChangeExportConfig={(updated) =>
              setExportConfig((prev) => ({ ...prev, ...updated }))
            }
            onStartProcessBatch={handleStartProcessBatch}
            onDownloadZip={handleDownloadZip}
            t={t}
          />
        </div>
      </div>
    </div>
  )
}
