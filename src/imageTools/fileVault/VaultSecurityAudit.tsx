import React from 'react'
import { ShieldCheck, HardDrive, Cpu, Lock, AlertCircle, FileCheck, EyeOff } from 'lucide-react'

export const VaultSecurityAudit: React.FC = () => {
  return (
    <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-100">
            IndiaTools Zero-Knowledge Cryptographic Specification
          </h3>
          <p className="text-xs text-slate-400">
            Verifiable client-side Web Crypto architecture with authenticated chunked framing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
            <EyeOff className="h-4 w-4" />
            <span>0% Server Exposure</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Files, keys, and passphrases never leave your device. All encryption and decryption execute 100% inside your browser's local Web Crypto engine.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Lock className="h-4 w-4" />
            <span>AES-256-GCM + PBKDF2</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Keys are derived using PBKDF2 (SHA-256, 250,000 rounds, 16-byte random salt). Authenticated encryption uses AES-GCM with 128-bit integrity tags.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Cpu className="h-4 w-4" />
            <span>Authenticated Framing</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Multi-megabyte files are partitioned into 4 MiB chunks. Each chunk receives a unique 12-byte nonce and Additional Authenticated Data (AAD) bound to the header hash.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-violet-400">
            <FileCheck className="h-4 w-4" />
            <span>Tamper Detection</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            An authenticated finalization manifest verifies chunk order, total count, and cumulative SHA-256 digest. Partial plaintext is never exposed upon failure.
          </p>
        </div>
      </div>

      {/* Honest Engineering Disclosure */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-[11px] leading-relaxed text-slate-400 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <AlertCircle className="h-4 w-4 text-cyan-400" />
          <span>Scientific Disclosure & Operational Limitations</span>
        </div>
        <p>
          <strong>Product Naming Note:</strong> The phrase <em>“Military-Grade”</em> is a common industry positioning descriptor referencing AES-256-GCM (used by government institutions worldwide). It is not an official military certification or formal governmental endorsement.
        </p>
        <p>
          <strong>Browser Memory Boundaries:</strong> While our pipeline streams in 4 MiB bounded chunks to prevent browser crashes, browsers without the File System Access API must accumulate the processed file as a Blob for download. For files exceeding available device RAM, we recommend keeping file sizes within your system memory capacity.
        </p>
      </div>
    </div>
  )
}
