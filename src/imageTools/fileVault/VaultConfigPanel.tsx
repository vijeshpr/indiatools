import React, { useState, useId } from 'react'
import {
  Key,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Shield,
  ShieldAlert,
  Cpu,
} from 'lucide-react'
import {
  VaultMode,
  EncryptConfig,
  DecryptConfig,
  VAULT_FORMAT,
} from '../../lib/fileVault/types'
import {
  generateSecurePassphrase,
  evaluatePasswordStrength,
} from '../../lib/fileVault/cryptoEngine'

interface VaultConfigPanelProps {
  mode: VaultMode
  encryptConfig: EncryptConfig
  decryptConfig: DecryptConfig
  onEncryptConfigChange: (cfg: EncryptConfig) => void
  onDecryptConfigChange: (cfg: DecryptConfig) => void
  disabled?: boolean
}

export const VaultConfigPanel: React.FC<VaultConfigPanelProps> = ({
  mode,
  encryptConfig,
  decryptConfig,
  onEncryptConfigChange,
  onDecryptConfigChange,
  disabled = false,
}) => {
  const pwdId = useId()
  const confirmPwdId = useId()
  const hintId = useId()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const isEncrypt = mode === 'encrypt'
  const strength = evaluatePasswordStrength(encryptConfig.password)

  const passwordsMatch = Boolean(
    encryptConfig.password.length > 0 &&
      encryptConfig.confirmPassword &&
      encryptConfig.confirmPassword.length > 0 &&
      encryptConfig.password === encryptConfig.confirmPassword
  )

  const handleGeneratePassword = () => {
    const generated = generateSecurePassphrase(20)
    onEncryptConfigChange({
      ...encryptConfig,
      password: generated,
      confirmPassword: generated,
    })
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${
              isEncrypt
                ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
            }`}
          >
            {isEncrypt ? <Key className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              {isEncrypt ? 'Encryption Key & Armor Parameters' : 'Authentication Passphrase'}
            </h3>
            <p className="text-xs text-slate-400">
              {isEncrypt
                ? 'PBKDF2-HMAC-SHA256 (250,000 rounds) + AES-256-GCM authenticated cipher'
                : 'Supply the matching passphrase to verify container integrity and decrypt'}
            </p>
          </div>
        </div>

        {isEncrypt && (
          <button
            type="button"
            onClick={handleGeneratePassword}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 transition-all hover:bg-cyan-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Generate 20-Char CSPRNG Key</span>
          </button>
        )}
      </div>

      {/* Main Form Fields */}
      {isEncrypt ? (
        <div className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            {/* Password */}
            <div>
              <label
                htmlFor={pwdId}
                className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-300"
              >
                <span>Master Passphrase *</span>
                <span className="text-[11px] text-slate-500">Required to encrypt & decrypt</span>
              </label>
              <div className="relative">
                <input
                  id={pwdId}
                  type={showPassword ? 'text' : 'password'}
                  value={encryptConfig.password}
                  onChange={(e) =>
                    onEncryptConfigChange({ ...encryptConfig, password: e.target.value })
                  }
                  placeholder="Enter strong passphrase..."
                  disabled={disabled}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 pr-10 text-sm text-slate-100 font-mono placeholder-slate-500 transition-all focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  aria-label={showPassword ? 'Hide passphrase' : 'Show passphrase'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {encryptConfig.password && (
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      Estimated Entropy: <strong className="text-slate-200 font-mono">{strength.entropyBits} bits</strong>
                    </span>
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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor={confirmPwdId}
                className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-300"
              >
                <span>Confirm Passphrase *</span>
                {passwordsMatch ? (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> Keys Match
                  </span>
                ) : encryptConfig.confirmPassword ? (
                  <span className="flex items-center gap-1 text-[11px] text-rose-400">
                    <AlertCircle className="h-3 w-3" /> Mismatch
                  </span>
                ) : null}
              </label>
              <div className="relative">
                <input
                  id={confirmPwdId}
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={encryptConfig.confirmPassword || ''}
                  onChange={(e) =>
                    onEncryptConfigChange({ ...encryptConfig, confirmPassword: e.target.value })
                  }
                  placeholder="Re-enter passphrase..."
                  disabled={disabled}
                  className={`w-full rounded-xl border bg-slate-950/80 px-3.5 py-2.5 pr-10 text-sm text-slate-100 font-mono placeholder-slate-500 transition-all focus:outline-none focus:ring-2 disabled:opacity-50 ${
                    encryptConfig.confirmPassword && !passwordsMatch
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-700 focus:border-cyan-400 focus:ring-cyan-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-500">
                Guarantees you never lock valuable files due to an accidental typo.
              </p>
            </div>
          </div>

          {/* Optional Public Hint */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor={hintId}
                className="text-xs font-semibold text-slate-300 flex items-center gap-1.5"
              >
                <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
                <span>Password Hint (Optional)</span>
              </label>
              <span className="rounded bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                Public Header Metadata
              </span>
            </div>
            <input
              id={hintId}
              type="text"
              value={encryptConfig.hint || ''}
              onChange={(e) =>
                onEncryptConfigChange({ ...encryptConfig, hint: e.target.value })
              }
              placeholder="e.g. Favorite book title from high school..."
              disabled={disabled}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/90 px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <p className="text-[11px] leading-relaxed text-amber-300/80">
              ⚠️ <strong>Warning:</strong> The hint is stored in the container header without encryption so it can be viewed before entering a password. <em>Never enter your actual passphrase or sensitive personal data here.</em>
            </p>
          </div>

          {/* Cryptographic Parameters Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3.5 text-xs text-slate-400 font-mono">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Cipher Standard</span>
              <span className="text-cyan-400 font-bold">AES-256-GCM (128-bit Tag)</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Key Derivation</span>
              <span className="text-slate-200 font-bold">PBKDF2-SHA256 (250,000 Rounds)</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Streaming Frame</span>
              <span className="text-slate-200 font-bold">4 MiB Chunked Authenticated AAD</span>
            </div>
          </div>
        </div>
      ) : (
        /* Decrypt Configuration */
        <div className="space-y-4">
          <div>
            <label
              htmlFor={pwdId}
              className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-300"
            >
              <span>Container Decryption Passphrase *</span>
              <span className="text-[11px] text-slate-500">Matching key required</span>
            </label>
            <div className="relative">
              <input
                id={pwdId}
                type={showPassword ? 'text' : 'password'}
                value={decryptConfig.password}
                onChange={(e) => onDecryptConfigChange({ password: e.target.value })}
                placeholder="Enter passphrase to unlock .vault file..."
                disabled={disabled}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 pr-10 text-sm text-slate-100 font-mono placeholder-slate-500 transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                aria-label={showPassword ? 'Hide passphrase' : 'Show passphrase'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-emerald-300/90 leading-relaxed space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-emerald-400">
              <Shield className="h-4 w-4" />
              <span>Full Authenticated Integrity Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-300">
              The .vault container verifies each chunk individually and validates the complete cumulative manifest upon finalization. If the passphrase is incorrect or any chunk was tampered with, truncated, or reordered, decryption halts immediately with zero temporary plaintext leakage.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
