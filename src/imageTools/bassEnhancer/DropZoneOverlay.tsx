/**
 * Modern Audio Drop Zone with Animated Dashed Border & Demo Track Attractor
 */

import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Music, Sparkles, ShieldCheck, Zap, Lock } from 'lucide-react'

interface DropZoneOverlayProps {
  onFileSelected: (file: File) => void
  onLoadDemoTrack: () => void
  isLoadingDemo?: boolean
}

export const DropZoneOverlay: React.FC<DropZoneOverlayProps> = ({
  onFileSelected,
  onLoadDemoTrack,
  isLoadingDemo = false,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('audio/') || /\.(mp3|wav|ogg|flac|m4a|aac|webm)$/i.test(file.name)) {
        onFileSelected(file)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0])
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full rounded-2xl p-8 transition-all flex flex-col items-center justify-center text-center overflow-hidden border-2 ${
        isDragging
          ? 'border-[#ff2d55] bg-[#ff2d55]/10 shadow-[0_0_30px_rgba(255,45,85,0.25)]'
          : 'border-dashed border-white/10 hover:border-white/20 bg-[#0a0a0b]/80'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.ogg,.flac,.m4a,.aac,.webm"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Floating Animated Particle Glow behind icon */}
      <div className="relative mb-4">
        <motion.div
          animate={{
            scale: isDragging ? [1, 1.25, 1] : [1, 1.08, 1],
            opacity: [0.35, 0.6, 0.35],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#ff2d55]/30 to-[#ffb800]/20 blur-xl pointer-events-none"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center cursor-pointer shadow-xl group hover:border-[#ff2d55]/50 transition-colors"
        >
          <Upload className="w-7 h-7 text-[#ff2d55] group-hover:scale-110 transition-transform" />
        </div>
      </div>

      {/* Primary Action Call to Action */}
      <h3 className="text-lg font-bold text-white mb-1.5 tracking-tight">
        Drop Your Audio Track or{' '}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-[#ff2d55] hover:text-[#ff2d55]/80 underline decoration-[#ff2d55]/40 underline-offset-4 cursor-pointer"
        >
          Browse Files
        </button>
      </h3>
      <p className="text-xs text-slate-400 max-w-md mb-5 leading-relaxed">
        Supports MP3, Lossless WAV, FLAC, M4A, AAC, and OGG. Processed 100% locally in your browser memory with zero server uploads.
      </p>

      {/* Quick Test Demo Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onLoadDemoTrack}
          disabled={isLoadingDemo}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 hover:border-[#ffb800]/40 transition-all flex items-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#ffb800]" />
          <span>{isLoadingDemo ? 'Synthesizing Demo Kick...' : 'Load Sub-Kick Demo Track'}</span>
        </button>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-white/5 w-full">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Free & Unlimited</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff2d55]/10 border border-[#ff2d55]/20 text-[11px] font-semibold text-[#ff2d55]">
          <Lock className="w-3.5 h-3.5" />
          <span>Zero Upload • 100% Private</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-[11px] font-semibold text-[#00f0ff]">
          <Zap className="w-3.5 h-3.5" />
          <span>True Sub-Harmonic DSP Engine</span>
        </div>
      </div>
    </div>
  )
}
