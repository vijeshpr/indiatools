import React from 'react'
import { ShieldCheck, HardDrive, Cpu, Lock, Sparkles } from 'lucide-react'

export const SecurityNotice: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-slate-950/90 p-6 backdrop-blur-xl shadow-xl">
      <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-100">
            IndiaTools Zero-Knowledge Privacy Architecture
          </h3>
          <p className="text-xs text-slate-400">
            Enterprise-grade cryptographic security executing entirely within your local browser
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
            <HardDrive className="h-4 w-4" />
            <span>0% Server Uploads</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            PDFs are processed strictly inside client memory via WebAssembly. Files never touch any external server or API.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Cpu className="h-4 w-4" />
            <span>QPDF WebAssembly</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Powered by upstream QPDF 12 compiled to native WASM, providing authentic PDF encryption and permission dictionary handling.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Lock className="h-4 w-4" />
            <span>AES-256 Bit Cipher</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Full compliance with ISO 32000-2 standards. Supports granular printing, copying, and modification flags.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
            <Sparkles className="h-4 w-4" />
            <span>Memory Hygiene</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Blob URLs and memory buffers are immediately revoked and garbage collected upon download or cancellation.
          </p>
        </div>
      </div>
    </div>
  )
}
