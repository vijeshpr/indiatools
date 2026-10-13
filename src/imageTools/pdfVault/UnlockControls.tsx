import React, { useState, useId } from 'react'
import { Unlock, KeyRound, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react'
import { UnlockOptions } from '../../lib/pdfVault/types'

interface UnlockControlsProps {
  options: UnlockOptions
  onChange: (options: UnlockOptions) => void
  disabled?: boolean
}

export const UnlockControls: React.FC<UnlockControlsProps> = ({
  options,
  onChange,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const passwordInputId = useId()

  return (
    <div className="space-y-6 rounded-2xl border border-slate-700/60 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Unlock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">
              Batch PDF Decryption & Password Removal
            </h3>
            <p className="text-xs text-slate-400">
              Permanently decrypt and remove owner or open password locks from queued files
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor={passwordInputId}
            className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-300"
          >
            <span>Batch Decryption Password *</span>
            <span className="text-[11px] text-slate-400">Owner or User Password</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <KeyRound className="h-4 w-4" />
            </div>
            <input
              id={passwordInputId}
              type={showPassword ? 'text' : 'password'}
              value={options.password}
              onChange={(e) => onChange({ ...options, password: e.target.value })}
              placeholder="Enter password to unlock queued PDF files..."
              disabled={disabled}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">
            Provide the password that decrypts the batch. Either the User (Open) password or Owner (Permissions) password can be used.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-emerald-300 leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>How Decryption Works</span>
          </div>
          <p className="text-[11px] text-slate-300">
            QPDF WebAssembly loads each document into an isolated sandbox, validates the encryption key, strips the standard encryption trailer dictionary, and writes an unencrypted PDF stream. All printing, copying, and modification restrictions are completely unlocked.
          </p>
        </div>

        <div className="flex items-start gap-2 rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-[11px] text-slate-400">
          <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Note:</strong> We respect digital rights and privacy. This utility is designed for legitimate document owners, accountants, students, and businesses removing forgotten restrictions or batch-decrypting their own statements.
          </span>
        </div>
      </div>
    </div>
  )
}
