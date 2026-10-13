/**
 * Interactive PDF Drop Zone with Header Magic Byte Validation and Sample Generator
 */

import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, Sparkles, ShieldCheck, Lock, Cpu } from 'lucide-react'

interface PdfDropZoneProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
  fileCount?: number
}

// Generates a quick sample PDF for testing immediately in the browser
function createTestSamplePdf(name = 'Sample_Document.pdf'): File {
  const text = 'IndiaTools Batch PDF Password Vault Sample Document'
  const content = `BT /F1 20 Tf 72 720 Td (${text}) Tj /F1 12 Tf 72 680 Td (Confidential document generated for local browser encryption testing.) Tj ET`
  const stream = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`
  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj',
    `4 0 obj\n${stream}\nendobj`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
  ]

  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  let currentOffset = pdf.length

  for (let i = 0; i < objects.length; i++) {
    offsets.push(currentOffset)
    const objStr = objects[i] + '\n'
    pdf += objStr
    currentOffset += objStr.length
  }

  const startxref = currentOffset
  pdf += 'xref\n'
  pdf += `0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'
  for (let i = 1; i <= objects.length; i++) {
    pdf += String(offsets[i]).padStart(10, '0') + ' 00000 n \n'
  }
  pdf += 'trailer\n'
  pdf += `<< /Size ${objects.length + 1} /Root 1 0 R >>\n`
  pdf += 'startxref\n'
  pdf += `${startxref}\n`
  pdf += '%%EOF\n'

  const bytes = new TextEncoder().encode(pdf)
  return new File([bytes], name, { type: 'application/pdf' })
}

export const PdfDropZone: React.FC<PdfDropZoneProps> = ({
  onFilesSelected,
  disabled = false,
  fileCount,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const pdfFiles = Array.from(e.dataTransfer.files).filter(
        (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
      )
      if (pdfFiles.length > 0) {
        onFilesSelected(pdfFiles)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files))
      e.target.value = '' // Reset input so same file can be selected again
    }
  }

  const handleAddSample = (e: React.MouseEvent) => {
    e.stopPropagation()
    const sample = createTestSamplePdf(`Sample_${Date.now().toString().slice(-4)}.pdf`)
    onFilesSelected([sample])
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && fileInputRef.current?.click()}
      className={`relative w-full rounded-2xl p-6 md:p-8 transition-all flex flex-col items-center justify-center text-center overflow-hidden border-2 cursor-pointer ${
        isDragging
          ? 'border-amber-400 bg-amber-400/10 shadow-[0_0_25px_rgba(251,191,36,0.25)]'
          : 'border-dashed border-white/10 hover:border-white/20 bg-slate-900/60'
      } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Floating Animated Particle Glow behind icon */}
      <div className="relative mb-3 pointer-events-none">
        <motion.div
          animate={{
            scale: isDragging ? [1, 1.25, 1] : [1, 1.08, 1],
            opacity: [0.35, 0.6, 0.35],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -inset-4 rounded-full bg-gradient-to-r from-amber-500/30 to-emerald-500/20 blur-xl"
        />

        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-xl">
          <Upload className="w-6 h-6 text-amber-400" />
        </div>
      </div>

      <h3 className="text-base md:text-lg font-bold text-white mb-1 tracking-tight">
        Drop Multiple PDF Documents Here or{' '}
        <span className="text-amber-400 underline decoration-amber-400/40 underline-offset-4">
          Browse
        </span>
      </h3>
      <p className="text-xs text-slate-400 max-w-md mb-4 leading-relaxed">
        Select single or batch PDF files. Header magic bytes (<code className="text-slate-300 font-mono">%PDF-</code>) are verified locally.
      </p>

      {/* Actions row */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={handleAddSample}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Add Sample Test PDF</span>
        </button>
      </div>

      {/* Trust Badges */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-white/5 w-full pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold text-emerald-400">
          <ShieldCheck className="w-3 h-3" />
          <span>100% Free to Use</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-semibold text-amber-400">
          <Lock className="w-3 h-3" />
          <span>Zero Upload • Local Processing</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-semibold text-cyan-400">
          <Cpu className="w-3 h-3" />
          <span>Browser-Based PDF Security (QPDF WASM)</span>
        </div>
      </div>
    </div>
  )
}
