import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Upload,
  Download,
  Image as ImageIcon,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  AlertCircle,
  FileCheck,
} from 'lucide-react'
import { compressToMaxKb, ImageProcessingResult } from '../lib/imageProcessing'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const Photo100KBTool: React.FC = () => {
  const tool = getToolBySlug('100kb-photo')!

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [originalSizeKb, setOriginalSizeKb] = useState<number>(0)
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string>('')
  const [processedResult, setProcessedResult] = useState<ImageProcessingResult | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [dimensionPreset, setDimensionPreset] = useState<'standard' | 'ssc' | 'original'>('standard')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setOriginalSizeKb(Number((file.size / 1024).toFixed(1)))
    setOriginalPreviewUrl(URL.createObjectURL(file))
    await processImage(file, dimensionPreset)
  }

  const processImage = async (file: File, preset: 'standard' | 'ssc' | 'original') => {
    setIsProcessing(true)
    try {
      let targetW: number | undefined
      let targetH: number | undefined

      if (preset === 'ssc') {
        targetW = 350
        targetH = 450
      } else if (preset === 'standard') {
        targetW = 600
        targetH = 600
      }

      const res = await compressToMaxKb(file, 96, targetW, targetH) // target 96KB to stay safely under 100KB
      setProcessedResult(res)
    } catch (err) {
      console.error('Image compression failed', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePresetChange = (preset: 'standard' | 'ssc' | 'original') => {
    setDimensionPreset(preset)
    if (selectedFile) {
      processImage(selectedFile, preset)
    }
  }

  const handleDownload = () => {
    if (!processedResult) return
    const a = document.createElement('a')
    a.href = processedResult.dataUrl
    a.download = `photo-under-100kb-${Date.now()}.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleReset = () => {
    setSelectedFile(null)
    setOriginalSizeKb(0)
    setOriginalPreviewUrl('')
    setProcessedResult(null)
    setDimensionPreset('standard')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const getResultSummary = () => {
    if (!processedResult) return 'No image processed yet.'
    return `Photo Under 100KB Compression Summary:
- Original Size: ${originalSizeKb} KB
- Compressed Size: ${processedResult.sizeKb} KB (Safely below 100 KB limit)
- Compression Ratio: ${(((originalSizeKb - processedResult.sizeKb) / originalSizeKb) * 100).toFixed(1)}% reduction
- Output Dimensions: ${processedResult.width} × ${processedResult.height} px
- Output Format: JPEG
- Privacy: 100% Client-side in-browser (Zero server upload)
Processed on India Practical Tools (https://indiapracticaltools.com)`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Upload & Config Area */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
              <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-pink-500" />
                <span>Upload & Resize Under 100KB</span>
              </h2>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Private (Local)
              </span>
            </div>

            {/* Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-700 light:border-slate-300 hover:border-pink-500/60 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-neutral-950/50 light:bg-slate-50 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-pink-500/15 text-pink-400 border border-pink-500/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-white light:text-slate-900 text-base mb-1">
                {selectedFile ? 'Replace Photo' : 'Click to Upload or Drag & Drop'}
              </h3>
              <p className="text-xs text-neutral-400 light:text-slate-500 max-w-xs mx-auto">
                Supports JPG, PNG, WEBP. Target: Strictly under 100KB for SSC, IBPS, Aadhaar, State PSC.
              </p>
            </div>

            {/* Presets */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
                Dimension Standards
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetChange('standard')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    dimensionPreset === 'standard'
                      ? 'bg-pink-500/20 border-pink-500 text-white font-bold'
                      : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 light:border-slate-200 text-neutral-400'
                  }`}
                >
                  <span className="text-xs font-bold block">Standard</span>
                  <span className="text-[10px] text-neutral-500">600×600 px</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetChange('ssc')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    dimensionPreset === 'ssc'
                      ? 'bg-pink-500/20 border-pink-500 text-white font-bold'
                      : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 light:border-slate-200 text-neutral-400'
                  }`}
                >
                  <span className="text-xs font-bold block">SSC / IBPS</span>
                  <span className="text-[10px] text-neutral-500">3.5 × 4.5 cm</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetChange('original')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    dimensionPreset === 'original'
                      ? 'bg-pink-500/20 border-pink-500 text-white font-bold'
                      : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 light:border-slate-200 text-neutral-400'
                  }`}
                >
                  <span className="text-xs font-bold block">Keep Aspect</span>
                  <span className="text-[10px] text-neutral-500">Auto Scale</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Area */}
        <div className="lg:col-span-6 space-y-6">
          <motion.div
            layout
            className="p-6 sm:p-8 rounded-3xl bg-neutral-900/90 light:bg-white border border-neutral-800 light:border-slate-200 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-400">
                Optimized Result
              </span>
              {processedResult && (
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {processedResult.sizeKb} KB (Passes &lt;100KB)
                </span>
              )}
            </div>

            {processedResult ? (
              <div className="space-y-6 my-4">
                <div className="flex items-center justify-center p-4 bg-neutral-950 rounded-2xl border border-neutral-800">
                  <img
                    src={processedResult.dataUrl}
                    alt="Processed under 100KB"
                    className="max-h-64 object-contain rounded-lg border border-neutral-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                    <span className="text-[11px] text-neutral-400 block mb-0.5">Original File Size</span>
                    <span className="text-xl font-bold font-mono text-white light:text-slate-900">
                      {originalSizeKb} KB
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                    <span className="text-[11px] text-emerald-400 font-semibold block mb-0.5">Compressed File Size</span>
                    <span className="text-xl font-bold font-mono text-emerald-400">
                      {processedResult.sizeKb} KB
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full py-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 cursor-pointer text-base transition-all"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Photo ({processedResult.sizeKb} KB)</span>
                </button>
              </div>
            ) : (
              <div className="py-16 text-center text-neutral-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Upload a photo to see the live under-100KB preview and download.</p>
              </div>
            )}
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Govt Portal Compliance</span>
            </div>
            <p>
              State PSC exams, IBPS PO, and national portals strictly reject applications if photos exceed 100KB. This tool iterates through progressive JPEG matrices completely inside your browser memory—no files are transmitted over the internet.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
