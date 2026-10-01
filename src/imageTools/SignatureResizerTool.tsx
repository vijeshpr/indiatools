import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Upload,
  Download,
  FileSignature,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Sliders,
  FileCheck,
} from 'lucide-react'
import { processSignature, ImageProcessingResult } from '../lib/imageProcessing'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const SignatureResizerTool: React.FC = () => {
  const tool = getToolBySlug('signature-resizer')!

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [originalSizeKb, setOriginalSizeKb] = useState<number>(0)
  const [threshold, setThreshold] = useState<number>(205)
  const [contrast, setContrast] = useState<number>(1.5)
  const [processedResult, setProcessedResult] = useState<ImageProcessingResult | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setOriginalSizeKb(Number((file.size / 1024).toFixed(1)))
    await runProcessing(file, threshold, contrast)
  }

  const runProcessing = async (file: File, thresh: number, cont: number) => {
    setIsProcessing(true)
    try {
      const res = await processSignature(file, 18, cont, thresh) // Target 18KB (well within 10-20KB)
      setProcessedResult(res)
    } catch (err) {
      console.error('Signature processing failed', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSliderChange = (newThresh: number, newCont: number) => {
    setThreshold(newThresh)
    setContrast(newCont)
    if (selectedFile) {
      runProcessing(selectedFile, newThresh, newCont)
    }
  }

  const handleDownload = () => {
    if (!processedResult) return
    const a = document.createElement('a')
    a.href = processedResult.dataUrl
    a.download = `signature-exam-${processedResult.sizeKb}kb.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleReset = () => {
    setSelectedFile(null)
    setOriginalSizeKb(0)
    setProcessedResult(null)
    setThreshold(205)
    setContrast(1.5)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-pink-500" />
              <span>Signature Paper & Clean-Up</span>
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
                Upload Handwritten Signature
              </h3>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Snap a photo of your signature on white paper. We remove background shadows and compress to 10–20KB.
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
                  Change
                </button>
              </div>

              {/* Background Whitener Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-pink-400" />
                    <span>Paper Shadow Whitener</span>
                  </label>
                  <span className="text-xs text-pink-400 font-mono font-bold">{threshold}</span>
                </div>
                <input
                  type="range"
                  min="160"
                  max="240"
                  step="2"
                  value={threshold}
                  onChange={(e) => handleSliderChange(parseInt(e.target.value), contrast)}
                  className="w-full accent-pink-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                  <span>Less aggressive</span>
                  <span>Default (Clean paper)</span>
                  <span>Aggressive whiten</span>
                </div>
              </div>

              {/* Ink Contrast Boost Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                    Ink Darkness / Contrast
                  </label>
                  <span className="text-xs text-pink-400 font-mono font-bold">{contrast}x</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.1"
                  value={contrast}
                  onChange={(e) => handleSliderChange(threshold, parseFloat(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs text-neutral-400 space-y-1">
            <span className="font-bold text-neutral-300 block">UPSC / SSC / Bank PO Rules:</span>
            <p>• Allowed Size: <strong>10 KB to 20 KB</strong></p>
            <p>• Pure white background without yellow tint or table textures</p>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-6 space-y-4">
          <motion.div
            layout
            className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-pink-950/30 border border-pink-500/30 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-pink-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Whitened & Compressed Signature</span>
              </span>
              {processedResult && (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>10–20 KB Compliant</span>
                </span>
              )}
            </div>

            {isProcessing ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-10 h-10 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-neutral-300">Whitening paper pixels & boosting ink...</p>
              </div>
            ) : processedResult ? (
              <div>
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 mb-6">
                  <div>
                    <span className="text-[11px] uppercase text-neutral-400 block font-mono">Original File</span>
                    <span className="text-base font-bold text-neutral-300 font-mono">{originalSizeKb} KB</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] uppercase text-pink-400 block font-mono font-bold">Cleaned Signature</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      {processedResult.sizeKb} KB
                    </span>
                  </div>
                </div>

                {/* Signature Preview Canvas Container */}
                <div className="p-6 bg-white rounded-xl border border-neutral-700 shadow-inner flex items-center justify-center mb-6 overflow-hidden">
                  <img
                    src={processedResult.dataUrl}
                    alt="Cleaned Exam Signature"
                    className="max-h-28 object-contain"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Signature ({processedResult.sizeKb} KB)</span>
                </button>
              </div>
            ) : (
              <div className="py-20 text-center text-neutral-400">
                <FileSignature className="w-12 h-12 mx-auto mb-2 text-neutral-600" />
                <p className="text-sm">Upload a photo of your signature to clean and compress</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
