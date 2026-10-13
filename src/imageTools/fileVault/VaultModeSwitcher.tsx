import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Unlock, Lock, Zap } from 'lucide-react'
import { VaultMode } from '../../lib/fileVault/types'

interface VaultModeSwitcherProps {
  mode: VaultMode
  onChange: (mode: VaultMode) => void
  disabled?: boolean
}

export const VaultModeSwitcher: React.FC<VaultModeSwitcherProps> = ({
  mode,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="relative inline-flex p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-2xl backdrop-blur-xl select-none">
      {/* Encrypt Mode Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('encrypt')}
        className={`relative z-10 px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2.5 cursor-pointer ${
          mode === 'encrypt' ? 'text-slate-950 font-black' : 'text-slate-400 hover:text-white'
        } disabled:opacity-50`}
      >
        <Lock className="w-4 h-4" />
        <span>Encrypt & Armor</span>
        {mode === 'encrypt' && (
          <motion.div
            layoutId="vault-mode-pill"
            className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-cyan-300 rounded-xl -z-10 shadow-lg shadow-cyan-500/25"
            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
          />
        )}
      </button>

      {/* Decrypt Mode Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('decrypt')}
        className={`relative z-10 px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2.5 cursor-pointer ${
          mode === 'decrypt' ? 'text-slate-950 font-black' : 'text-slate-400 hover:text-white'
        } disabled:opacity-50`}
      >
        <Unlock className="w-4 h-4" />
        <span>Authenticate & Decrypt</span>
        {mode === 'decrypt' && (
          <motion.div
            layoutId="vault-mode-pill"
            className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-xl -z-10 shadow-lg shadow-emerald-500/25"
            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
          />
        )}
      </button>
    </div>
  )
}
