import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Upload,
  Download,
  FileText,
  Trash2,
  Plus,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
} from 'lucide-react'
import { imagesToPdf } from '../lib/imageProcessing'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const ImageToPdfTool: React.FC = () => {
  const tool = getToolBySlug('image-to-pdf')!

  const [files, setFiles] = useState<{ file: File; preview: string; id: string }[]>([])
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [generatedPdfBlob, setGeneratedPdfBlob] = useState<Blob | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFilesAdded = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (!selected || selected.length === 0) return

    const newEntries = Array.from(selected).map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
      id: Math.random().toString(36).substring(7),
    }))

    setFiles((prev) => [...prev, ...newEntries])
    setGeneratedPdfBlob(null)
    setPdfUrl('')
  }

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== id))
    setGeneratedPdfBlob(null)
    setPdfUrl('')
  }

  const handleGeneratePdf = async () => {
    if (files.length === 0) return
    setIsGenerating(true)
    try {
      const rawFiles = files.map((f) => f.file)
      const blob = await imagesToPdf(rawFiles)
      setGeneratedPdfBlob(blob)
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    } catch (err) {
      console.error('PDF generation error', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!pdfUrl) return
    const a = document.createElement('a')
    a.href = pdfUrl
    a.download = `documents-compiled-${Date.now()}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleReset = () => {
    setFiles([])
    setGeneratedPdfBlob(null)
    setPdfUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const getResultSummary = () => {
    if (!generatedPdfBlob) return 'No PDF compiled yet.'
    const sizeKb = Number((generatedPdfBlob.size / 1024).toFixed(1))
    return `Images to PDF Compilation Summary:
- Number of Pages: ${files.length} Page(s)
- Output File: documents-compiled.pdf (${sizeKb} KB)
- Page Standard: ISO 216 A4 (595 × 842 pt)
- Privacy Guarantee: 100% Client-side browser compiled (Zero cloud upload)
Created via IndiaTools (https://indiatools-rho.vercel.app)`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
              <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-pink-500" />
                <span>Add Document Images</span>
              </h2>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Client Side
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
                multiple
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFilesAdded}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-pink-500/15 text-pink-400 border border-pink-500/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-white light:text-slate-900 text-base mb-1">
                {files.length > 0 ? 'Add More Pages / Photos' : 'Click to Upload Images or Drag & Drop'}
              </h3>
              <p className="text-xs text-neutral-400 light:text-slate-500 max-w-xs mx-auto">
                Upload Aadhaar, PAN card, Marksheets, Certificates, or Receipts to merge into a single PDF.
              </p>
            </div>

            {/* Uploaded List */}
            {files.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Selected Pages ({files.length}):</span>
                  <span>Will be ordered page 1 to {files.length}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {files.map((item, index) => (
                    <div
                      key={item.id}
                      className="relative p-2 rounded-xl bg-neutral-950 border border-neutral-800 group"
                    >
                      <img
                        src={item.preview}
                        alt={`Page ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <span className="absolute top-3 left-3 bg-neutral-900/90 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-neutral-700">
                        Page {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        className="absolute top-3 right-3 p-1 rounded-md bg-red-500/80 hover:bg-red-600 text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleGeneratePdf}
                  disabled={isGenerating}
                  className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 cursor-pointer disabled:opacity-50"
                >
                  <FileCheck className="w-5 h-5" />
                  <span>{isGenerating ? 'Compiling PDF...' : `Generate ${files.length}-Page PDF`}</span>
                </button>
              </div>
            )}
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
                Compiled Document
              </span>
              {generatedPdfBlob && (
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Ready to Download
                </span>
              )}
            </div>

            {generatedPdfBlob ? (
              <div className="space-y-6 my-4">
                <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white light:text-slate-900 text-lg">
                      documents-compiled.pdf
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono mt-1">
                      {files.length} Pages • {(generatedPdfBlob.size / 1024).toFixed(1)} KB • Standard A4 Format
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full py-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 cursor-pointer text-base transition-all"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Merged PDF</span>
                </button>
              </div>
            ) : (
              <div className="py-16 text-center text-neutral-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">
                  {files.length > 0
                    ? 'Click "Generate PDF" on the left to compile your document.'
                    : 'Upload images to compile them into a standardized A4 PDF.'}
                </p>
              </div>
            )}
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Strict Financial & Identity Privacy</span>
            </div>
            <p>
              Unlike free online PDF conversion websites that upload your Aadhaar, bank statements, and sensitive tax files to untrusted third-party servers, IndiaTools constructs the PDF binary entirely in your device memory.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
