import React, { useState, useId } from 'react'
import {
  Lock,
  Key,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Cpu,
} from 'lucide-react'
import { EncryptOptions, AesKeyLength } from '../../lib/pdfVault/types'

interface EncryptionControlsProps {
  options: EncryptOptions
  onChange: (options: EncryptOptions) => void
  confirmPassword: string
  onConfirmPasswordChange: (val: string) => void
  disabled?: boolean
}

// Generate cryptographically secure alphanumeric + symbols password
function generateSecurePassword(length = 16): string {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*-_=+'
  const array = new Uint32Array(length)
  window.crypto.getRandomValues(array)
  return Array.from(array)
    .map((x) => charset[x % charset.length])
    .join('')
}

// Evaluate password entropy and strength
function getPasswordStrength(pwd: string): {
  score: number
  label: string
  color: string
} {
  if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-700' }
  let score = 0
  if (pwd.length >= 8) score += 1
  if (pwd.length >= 12) score += 1
  if (pwd.length >= 16) score += 1
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1
  if (/\d/.test(pwd)) score += 1
  if (/[^a-zA-Z0-9]/.test(pwd)) score += 1

  if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-rose-500' }
  if (score <= 4) return { score: 2, label: 'Moderate', color: 'bg-amber-500' }
  if (score <= 5) return { score: 3, label: 'Strong', color: 'bg-emerald-500' }
  return { score: 4, label: 'Enterprise Grade', color: 'bg-cyan-500' }
}

export const EncryptionControls: React.FC<EncryptionControlsProps> = ({
  options,
  onChange,
  confirmPassword,
  onConfirmPasswordChange,
  disabled = false,
}) => {
  const userPwdId = useId()
  const confirmPwdId = useId()
  const ownerPwdId = useId()

  const [showUserPwd, setShowUserPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)
  const [showOwnerPwd, setShowOwnerPwd] = useState(false)
  const [showOwnerAccordion, setShowOwnerAccordion] = useState(false)

  const strength = getPasswordStrength(options.userPassword)
  const passwordsMatch =
    options.userPassword.length > 0 &&
    confirmPassword.length > 0 &&
    options.userPassword === confirmPassword

  const handleGeneratePassword = () => {
    const generated = generateSecurePassword(16)
    onChange({ ...options, userPassword: generated })
    onConfirmPasswordChange(generated)
  }

  return (
    <div className="space-y-6 rounded-2xl border border-slate-700/60 bg-slate-900/70 p-6 backdrop-blur-xl shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100">
              Encryption & Cryptographic Passwords
            </h3>
            <p className="text-xs text-slate-400">
              Authentic browser-level AES PDF protection (ISO 32000 standard compliant)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGeneratePassword}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 transition-all hover:bg-amber-500/20 active:scale-95 disabled:opacity-50"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          Auto-Generate Secure Password
        </button>
      </div>

      {/* Main Open/User Password */}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor={userPwdId}
            className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-300"
          >
            <span>Document Open Password (User) *</span>
            <span className="text-[11px] text-slate-400">Required to view file</span>
          </label>
          <div className="relative">
            <input
              id={userPwdId}
              type={showUserPwd ? 'text' : 'password'}
              value={options.userPassword}
              onChange={(e) => onChange({ ...options, userPassword: e.target.value })}
              placeholder="Enter open password..."
              disabled={disabled}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 pr-10 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowUserPwd(!showUserPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              aria-label={showUserPwd ? 'Hide password' : 'Show password'}
            >
              {showUserPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Strength Bar */}
          {options.userPassword && (
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Security Strength:</span>
                <span className="font-semibold text-slate-200">{strength.label}</span>
              </div>
              <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full transition-all duration-300 ${strength.color}`}
                  style={{ width: `${(strength.score / 4) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor={confirmPwdId}
            className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-300"
          >
            <span>Confirm Open Password *</span>
            {passwordsMatch ? (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                <CheckCircle2 className="h-3 w-3" /> Matches
              </span>
            ) : confirmPassword && (
              <span className="flex items-center gap-1 text-[11px] text-rose-400">
                <AlertCircle className="h-3 w-3" /> Does not match
              </span>
            )}
          </label>
          <div className="relative">
            <input
              id={confirmPwdId}
              type={showConfirmPwd ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              placeholder="Re-enter open password..."
              disabled={disabled}
              className={`w-full rounded-xl border bg-slate-950/80 px-3.5 py-2.5 pr-10 text-sm text-slate-100 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 disabled:opacity-50 ${
                confirmPassword && !passwordsMatch
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-700 focus:border-amber-500 focus:ring-amber-500/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPwd(!showConfirmPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              aria-label={showConfirmPwd ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">
            Confirming ensures you never lock valuable files by accidental typo.
          </p>
        </div>
      </div>

      {/* Cipher & Standard Selection */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-300">
          Cryptographic Standard & Cipher Bit-Depth
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange({ ...options, keyLength: 256 })}
            className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
              options.keyLength === 256
                ? 'border-amber-500/60 bg-amber-500/10 shadow-sm shadow-amber-500/10'
                : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                options.keyLength === 256
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-100">
                  AES-256 (Recommended)
                </span>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">
                  ISO 32000-2
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                Military-grade 256-bit Advanced Encryption Standard. Supported by modern PDF readers, Acrobat X+, Chrome, and Edge.
              </p>
            </div>
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange({ ...options, keyLength: 128 })}
            className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
              options.keyLength === 128
                ? 'border-amber-500/60 bg-amber-500/10 shadow-sm shadow-amber-500/10'
                : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                options.keyLength === 128
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-100">
                  AES-128 (Legacy Compatible)
                </span>
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                  Acrobat 7+
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                128-bit AES for maximum compatibility with older legacy enterprise PDF viewers and hardware print controllers.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Advanced Owner / Master Permissions Password Accordion */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5">
        <button
          type="button"
          onClick={() => setShowOwnerAccordion(!showOwnerAccordion)}
          className="flex w-full items-center justify-between text-left text-xs font-medium text-slate-300 hover:text-slate-100"
        >
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-amber-400" />
            <span>Master Permissions Password (Owner Password)</span>
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
              Optional / Advanced
            </span>
          </div>
          {showOwnerAccordion ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </button>

        {showOwnerAccordion && (
          <div className="mt-3.5 border-t border-slate-800/80 pt-3.5 space-y-3">
            <div className="flex items-start gap-2 rounded-lg bg-slate-900/90 p-2.5 text-slate-400 text-[11px] leading-relaxed">
              <Info className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
              <span>
                <strong>User Password vs. Owner Password:</strong> The User password is used by recipients to open the PDF. The Owner password allows overriding restrictions and changing security settings. If left blank, a secure random internal owner key is assigned to enforce the permissions.
              </span>
            </div>

            <div className="relative">
              <label
                htmlFor={ownerPwdId}
                className="mb-1 block text-[11px] font-medium text-slate-400"
              >
                Owner / Permissions Password
              </label>
              <div className="relative">
                <input
                  id={ownerPwdId}
                  type={showOwnerPwd ? 'text' : 'password'}
                  value={options.ownerPassword || ''}
                  onChange={(e) => onChange({ ...options, ownerPassword: e.target.value })}
                  placeholder="Leave empty or set master password..."
                  disabled={disabled}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 pr-10 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowOwnerPwd(!showOwnerPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  aria-label={showOwnerPwd ? 'Hide owner password' : 'Show owner password'}
                >
                  {showOwnerPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
