/**
 * ModeSwitcher Component
 * Segmented control toggling between Encrypt mode and Unlock mode with Framer Motion transitions.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Unlock, Lock } from 'lucide-react'
import { VaultMode } from '../../lib/pdfVault/types'

interface ModeSwitcherProps {
  mode: VaultMode
  onChange: (mode: VaultMode) => void
  disabled?: boolean
}

export const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ mode, onChange, disabled }) => {
  return (
    <div className="relative inline-flex p-1 rounded-xl bg-slate-900 border border-white/5 select-none">
      {/* Encrypt Mode Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('encrypt')}
        className={`relative z-10 px-5 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer ${
          mode === 'encrypt' ? 'text-black font-black' : 'text-slate-400 hover:text-white'
        } disabled:opacity-50`}
      >
        <Lock className="w-3.5 h-3.5" />
        <span>Encrypt & Protect</span>
      </button>

      {/* Unlock Mode Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('unlock')}
        className={`relative z-10 px-5 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer ${
          mode === 'unlock' ? 'text-black font-black' : 'text-slate-400 hover:text-white'
        } disabled:opacity-50`}
      >
        <Unlock className="w-3.5 h-3.5" />
        <span>Unlock & Remove Password</span>
      </button>

      {/* Animated Sliding Highlight */}
      <motion.div
        layout
        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
        className={`absolute top-1 bottom-1 rounded-lg ${
          mode === 'encrypt'
            ? 'left-1 w-[calc(50%-4px)] bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.35)]'
            : 'left-[calc(50%)] w-[calc(50%-4px)] bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.35)]'
        }`}
      />
    </div>
  )
}
