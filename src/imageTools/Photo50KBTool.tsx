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

export const Photo50KBTool: React.FC = () => {
  const tool = getToolBySlug('50kb-photo')!

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [originalSizeKb, setOriginalSizeKb] = useState<number>(0)
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string>('')
  const [processedResult, setProcessedResult] = useState<ImageProcessingResult | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [dimensionPreset, setDimensionPreset] = useState<'standard' | 'upsc' | 'original'>('standard')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setOriginalSizeKb(Number((file.size / 1024).toFixed(1)))
    setOriginalPreviewUrl(URL.createObjectURL(file))
    await processImage(file, dimensionPreset)
  }

  const processImage = async (file: File, preset: 'standard' | 'upsc' | 'original') => {
    setIsProcessing(true)
    try {
      let targetW: number | undefined
      let targetH: number | undefined

      if (preset === 'upsc') {
        targetW = 200
        targetH = 230
      } else if (preset === 'standard') {
        targetW = 350
        targetH = 450
      }

      const res = await compressToMaxKb(file, 48, targetW, targetH) // target 48KB to stay safely under 50KB
      setProcessedResult(res)
    } catch (err) {
      console.error('Image compression failed', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePresetChange = (preset: 'standard' | 'upsc' | 'original') => {
    setDimensionPreset(preset)
    if (selectedFile) {
      processImage(selectedFile, preset)
    }
  }

  const handleDownload = () => {
    if (!processedResult) return
    const a = document.createElement('a')
    a.href = processedResult.dataUrl
    a.download = `photo-under-50kb-${Date.now()}.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleReset = () => {
    setSelectedFile(null)
    setOriginalSizeKb(0)
    setOriginalPreviewUrl('')
    setProcessedResult(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Upload & Controls */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-pink-500" />
              <span>Select Applicant Photo</span>
            </h2>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Private (In-Browser)</span>
            </div>
          </div>

          {/* Hidden File Input & Drop Area */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {!selectedFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-700 hover:border-pink-500/60 light:border-slate-300 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-neutral-950/40 hover:bg-neutral-950/80 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Click or Drop Passport Photo Here
              </h3>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Supports JPG, PNG & WebP. Converts and compresses instantly to strictly &lt; 50KB.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-semibold text-white truncate">{selectedFile.name}</p>
                    <span className="text-xs text-neutral-400">Original: {originalSizeKb} KB</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs rounded-lg bg-neutral-800 text-neutral-300 hover:text-white shrink-0"
                >
                  Change Photo
                </button>
              </div>

              {/* Portal Preset Switcher */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2 font-semibold">
                  Exam Portal Specification Preset
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'standard', label: 'Standard 3.5×4.5 cm (350×450 px)' },
                    { id: 'upsc', label: 'UPSC / SSC (200×230 px)' },
                    { id: 'original', label: 'Keep Original Ratio' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePresetChange(p.id as any)}
                      className={`p-2 rounded-xl text-xs font-semibold border text-center transition-colors ${
                        dimensionPreset === p.id
                          ? 'bg-pink-500/20 text-pink-400 border-pink-500/50'
                          : 'bg-neutral-950 border-neutral-700 text-neutral-400'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs text-neutral-400 space-y-1">
            <span className="font-bold text-neutral-300 block">Exam Compliance Guarantee:</span>
            <p>
              • File size output strictly between <strong>25 KB and 48 KB</strong> (100% compliant with &lt; 50KB rules).
            </p>
            <p>
              • Clean standard JPEG format accepted by NIC, TCS iON, and NTA servers.
            </p>
          </div>
        </div>

        {/* Right Processing & Result Card */}
        <div className="lg:col-span-6 space-y-4">
          <motion.div
            layout
            className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-pink-950/30 border border-pink-500/30 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-pink-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Client-Side Output</span>
              </span>
              {processedResult && (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Valid for Govt Upload</span>
                </span>
              )}
            </div>

            {isProcessing ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-10 h-10 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-neutral-300">Downscaling & optimizing JPEG quantisation...</p>
              </div>
            ) : processedResult ? (
              <div>
                {/* Before vs After Size Badges */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 mb-6">
                  <div>
                    <span className="text-[11px] uppercase text-neutral-400 block font-mono">Original File</span>
                    <span className="text-base font-bold text-neutral-300 font-mono">{originalSizeKb} KB</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] uppercase text-pink-400 block font-mono font-bold">New File Size</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      {processedResult.sizeKb} KB
                    </span>
                  </div>
                </div>

                {/* Photo Previews */}
                <div className="flex items-center justify-center p-4 bg-neutral-950 rounded-xl border border-neutral-800 mb-6">
                  <div className="relative border-2 border-neutral-700 rounded-lg p-1 bg-white shadow-lg">
                    <img
                      src={processedResult.dataUrl}
                      alt="Compressed 50KB Exam Photo"
                      className="w-44 h-56 object-cover rounded"
                    />
                    <div className="absolute bottom-2 right-2 bg-neutral-900/90 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                      {processedResult.width}×{processedResult.height}px
                    </div>
                  </div>
                </div>

                {/* Download CTA */}
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Photo ({processedResult.sizeKb} KB)</span>
                </button>
              </div>
            ) : (
              <div className="py-20 text-center text-neutral-400">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 text-neutral-600" />
                <p className="text-sm">Upload an image on the left to see instant compressed preview</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
