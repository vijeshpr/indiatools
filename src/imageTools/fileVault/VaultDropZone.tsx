import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileCode, Sparkles, ShieldCheck, Lock, HardDrive, Cpu } from 'lucide-react'
import { VaultMode } from '../../lib/fileVault/types'

interface VaultDropZoneProps {
  mode: VaultMode
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
  fileCount?: number
}

// Generate sample test file for instantaneous testing
function createSampleTestFile(name = 'Confidential_Financial_Ledger.txt'): File {
  const content = [
    '========================================================================',
    'CONFIDENTIAL FINANCIAL LEDGER & STRATEGIC INTEL',
    'Classification: STRICTLY PROPRIETARY // ZERO-KNOWLEDGE AUDIT',
    'Timestamp: ' + new Date().toISOString(),
    '========================================================================',
    '',
    'SUMMARY TRANSACTION LOGS:',
    '1. 2026-Q1 Capital Allocation: ₹4,25,00,000 INR (Encrypted Escrow)',
    '2. Cryptographic Key Derivation: PBKDF2-HMAC-SHA256 (250,000 Iterations)',
    '3. Authenticated Cipher: AES-256-GCM with 128-bit Authentication Tag',
    '4. Storage Location: Local In-Memory Web Crypto Pipeline (0 KB Network Transfer)',
    '',
    'INTEGRITY STATEMENT:',
    'This test specimen validates authenticated chunk framing and complete',
    'tamper detection in the IndiaTools Zero-Knowledge Military File Vault.',
    '========================================================================',
  ].join('\n')

  return new File([content], name, { type: 'text/plain' })
}

export const VaultDropZone: React.FC<VaultDropZoneProps> = ({
  mode,
  onFilesSelected,
  disabled = false,
  fileCount = 0,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    if (disabled || !e.dataTransfer.files) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      onFilesSelected(files)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      onFilesSelected(files)
      e.target.value = ''
    }
  }

  const handleGenerateSample = (e: React.MouseEvent) => {
    e.stopPropagation()
    const sample = createSampleTestFile()
    onFilesSelected([sample])
  }

  const isEncrypt = mode === 'encrypt'

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && fileInputRef.current?.click()}
      className={`relative group cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-300 backdrop-blur-xl ${
        isDragOver
          ? isEncrypt
            ? 'border-cyan-400 bg-cyan-950/30 shadow-2xl shadow-cyan-500/20 scale-[1.01]'
            : 'border-emerald-400 bg-emerald-950/30 shadow-2xl shadow-emerald-500/20 scale-[1.01]'
          : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
      } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={!isEncrypt ? '.vault,.enc' : undefined}
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Animated Cyber Icon */}
        <div
          className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border transition-transform duration-300 group-hover:scale-110 ${
            isEncrypt
              ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400 shadow-inner shadow-cyan-500/20'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-inner shadow-emerald-500/20'
          }`}
        >
          {isEncrypt ? <Lock className="h-8 w-8" /> : <Upload className="h-8 w-8" />}
          <span
            className={`absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black text-slate-950 ${
              isEncrypt ? 'bg-cyan-400' : 'bg-emerald-400'
            }`}
          >
            +
          </span>
        </div>

        <div className="space-y-1.5 max-w-lg">
          <h3 className="text-base font-bold text-slate-100">
            {isEncrypt
              ? 'Drop Files to Armor with AES-256-GCM'
              : 'Drop .vault Containers to Authenticate & Decrypt'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isEncrypt
              ? 'Drag & drop arbitrary documents, images, archives, audio, or binary files. 100% processed locally in memory.'
              : 'Upload .vault or .enc containers. Every chunk and final manifest is authenticated before decryption.'}
          </p>
        </div>

        {/* Buttons and Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-slate-950 shadow-md transition-all active:scale-95 ${
              isEncrypt
                ? 'bg-cyan-400 hover:bg-cyan-300 shadow-cyan-500/20'
                : 'bg-emerald-400 hover:bg-emerald-300 shadow-emerald-500/20'
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Select Local Files</span>
          </button>

          {isEncrypt && (
            <button
              type="button"
              onClick={handleGenerateSample}
              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-2 text-xs font-medium text-cyan-300 transition-all hover:bg-cyan-500/20 active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Load Sample Test File</span>
            </button>
          )}
        </div>

        {/* Technical Safety Badges */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 border-t border-slate-800/80 pt-4 w-full max-w-md">
          <span className="flex items-center gap-1">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span>Web Crypto Native</span>
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>0 KB Network Upload</span>
          </span>
          <span className="flex items-center gap-1">
            <HardDrive className="h-3.5 w-3.5 text-amber-400" />
            <span>Chunked Streaming</span>
          </span>
        </div>
      </div>
    </div>
  )
}
