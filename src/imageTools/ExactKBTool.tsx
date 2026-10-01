import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Upload,
  Download,
  Shrink,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  FileCheck,
} from 'lucide-react'
import { compressToExactKb, ImageProcessingResult } from '../lib/imageProcessing'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const ExactKBTool: React.FC = () => {
  const tool = getToolBySlug('exact-kb-compressor')!

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [originalSizeKb, setOriginalSizeKb] = useState<number>(0)
  const [targetKb, setTargetKb] = useState<number>(35)
  const [processedResult, setProcessedResult] = useState<ImageProcessingResult | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setOriginalSizeKb(Number((file.size / 1024).toFixed(1)))
    await processImage(file, targetKb)
  }

  const processImage = async (file: File, target: number) => {
    setIsProcessing(true)
    try {
      const res = await compressToExactKb(file, target)
      setProcessedResult(res)
    } catch (err) {
      console.error('Exact KB compression failed', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTargetChange = (val: number) => {
    setTargetKb(val)
    if (selectedFile) {
      processImage(selectedFile, val)
    }
  }

  const handleDownload = () => {
    if (!processedResult) return
    const a = document.createElement('a')
    a.href = processedResult.dataUrl
    a.download = `compressed-${processedResult.sizeKb}kb.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleReset = () => {
    setSelectedFile(null)
    setOriginalSizeKb(0)
    setProcessedResult(null)
    setTargetKb(35)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Shrink className="w-5 h-5 text-pink-500" />
              <span>Target File Size</span>
            </h2>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% In-Browser</span>
            </div>
          </div>

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
              className="border-2 border-dashed border-neutral-700 hover:border-pink-500/60 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-neutral-950/40 hover:bg-neutral-950/80 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Upload Image to Compress
              </h3>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Select any photo or certificate. We'll tune it to your exact target KB.
              </p>
            </div>
          ) : (
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
                Change
              </button>
            </div>
          )}

          {/* Target KB slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                Desired Target Size (KB)
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="10"
                  max="1000"
                  value={targetKb}
                  onChange={(e) => handleTargetChange(parseInt(e.target.value) || 10)}
                  className="w-20 bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-1 text-sm font-mono text-right text-pink-400 font-bold"
                />
                <span className="text-xs text-neutral-400 font-mono">KB</span>
              </div>
            </div>
            <input
              type="range"
              min="15"
              max="250"
              step="5"
              value={targetKb}
              onChange={(e) => handleTargetChange(parseInt(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer"
            />
            {/* Quick target presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[20, 35, 50, 80, 100, 150].map((kb) => (
                <button
                  key={kb}
                  type="button"
                  onClick={() => handleTargetChange(kb)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-mono font-bold border transition-colors ${
                    targetKb === kb
                      ? 'bg-pink-500/20 text-pink-400 border-pink-500/50'
                      : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
                  }`}
                >
                  {kb} KB
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Preview & Download */}
        <div className="lg:col-span-6 space-y-4">
          <motion.div
            layout
            className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-pink-950/30 border border-pink-500/30 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-pink-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Binary Search Result</span>
              </span>
              <span className="text-xs font-mono text-neutral-400">Target: {targetKb} KB</span>
            </div>

            {isProcessing ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-10 h-10 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-neutral-300">Targeting {targetKb} KB via binary search...</p>
              </div>
            ) : processedResult ? (
              <div>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 mb-6">
                  <div>
                    <span className="text-[11px] uppercase text-neutral-400 block font-mono">Original</span>
                    <span className="text-base font-bold text-neutral-300 font-mono">{originalSizeKb} KB</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] uppercase text-pink-400 block font-mono font-bold">Achieved Size</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      {processedResult.sizeKb} KB
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center p-4 bg-neutral-950 rounded-xl border border-neutral-800 mb-6">
                  <img
                    src={processedResult.dataUrl}
                    alt="Exact KB Compressed"
                    className="max-h-60 rounded object-contain"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {processedResult.sizeKb} KB Image</span>
                </button>
              </div>
            ) : (
              <div className="py-20 text-center text-neutral-400">
                <Shrink className="w-12 h-12 mx-auto mb-2 text-neutral-600" />
                <p className="text-sm">Upload an image to compress to exact target KB</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
