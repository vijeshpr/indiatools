import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  Command,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  Cpu,
  Lock,
  Globe,
  Sliders,
} from 'lucide-react'
import { CommandPalette } from '../common/CommandPalette'
import { TOOLS } from '../../data/tools'

interface HeroProps {
  onOpenSearch?: () => void
}

const QUICK_SHORTCUTS = [
  { label: 'Cheque Studio', path: '/calculators/indian-cheque-studio', badge: '13 Lang', color: 'cyan' },
  { label: 'JCB Fuel Cost', path: '/calculators/jcb-fuel-cost', badge: 'Flagship', color: 'amber' },
  { label: '50KB Photo Resizer', path: '/tools/50kb-photo', badge: 'Govt Exam', color: 'pink' },
  { label: 'Watermark Remover', path: '/tools/fast-inpainting-watermark-remover', badge: 'AI Inpainting', color: 'rose' },
  { label: 'Orbit Audio Studio', path: '/tools/orbit-audio-studio', badge: 'WebAudio', color: 'violet' },
  { label: 'Cent ↔ Sq.ft', path: '/calculators/cent-to-sqft', badge: 'Land Area', color: 'emerald' },
]

export const Hero: React.FC<HeroProps> = ({ onOpenSearch }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const handleTriggerSearch = () => {
    if (onOpenSearch) {
      onOpenSearch()
    } else {
      setIsSearchOpen(true)
    }
  }

  return (
    <section className="relative pt-8 pb-16 sm:pt-14 sm:pb-20 overflow-hidden text-center px-4 sm:px-6 lg:px-8">
      {/* Ambient Lighting Mesh (Cyan, Violet, Emerald) */}
      <div className="absolute inset-0 pointer-events-none select-none z-0" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-cyan-500/15 via-violet-600/15 to-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-10 left-1/4 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-16 right-1/4 w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Engineering Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md shadow-xs"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <span className="text-[11px] font-mono tracking-wide uppercase text-slate-300 font-semibold">
            {TOOLS.length} Verified Browser Utilities • Linear-Grade Engine
          </span>
        </motion.div>

        {/* Headlines */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-3"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white font-sans leading-[1.08]">
            High-Performance <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
              Browser Utilities.
            </span>
          </h1>

          <p className="text-lg sm:text-2xl font-semibold text-slate-200 tracking-tight">
            Privacy-first tools. Powerful local processing.
          </p>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed font-sans pt-1">
            Powerful browser-based utilities for media, images, documents, and everyday workflows.
            Process locally whenever supported, with clear privacy information and no unnecessary sign-up barriers.
          </p>
        </motion.div>

        {/* Raycast-style Command Bar Search Trigger */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto pt-2"
        >
          <div
            onClick={handleTriggerSearch}
            className="group relative flex items-center justify-between p-2 sm:p-2.5 rounded-2xl bg-[#11131F]/90 hover:bg-[#171A28] border border-white/[0.12] hover:border-cyan-500/50 shadow-2xl shadow-cyan-500/5 cursor-pointer transition-all backdrop-blur-xl"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleTriggerSearch()
              }
            }}
            aria-label="Open Command Palette Search"
          >
            <div className="flex items-center gap-3 pl-2 sm:pl-3 flex-1 min-w-0">
              <Search className="w-5 h-5 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-sm sm:text-base text-slate-400 group-hover:text-slate-300 font-sans truncate text-left">
                Search tools, explore categories, or jump to a utility...
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 pr-1">
              <kbd className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-white/[0.08] px-2.5 py-1 rounded-lg border border-white/[0.1] shadow-2xs">
                <Command className="w-3 h-3 text-cyan-400" />
                <span>K</span>
              </kbd>
              <div className="sm:hidden px-2 py-1 rounded-lg bg-cyan-500 text-black text-xs font-bold font-mono">
                Search
              </div>
            </div>
          </div>

          {/* Quick Jump Shortcuts */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[11px] font-mono uppercase text-slate-500 font-medium">Quick Jump:</span>
            {QUICK_SHORTCUTS.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] transition-colors flex items-center gap-1.5"
              >
                <span>{item.label}</span>
                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-white/[0.08] text-slate-400">
                  {item.badge}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-medium text-slate-400"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Browser-Based Processing</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>No Sign-Up Required</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Free Tools</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
            <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
            <span>Privacy-First Design</span>
          </div>
        </motion.div>
      </div>

      {/* Internal Command Palette fallback if onOpenSearch not provided */}
      {!onOpenSearch && (
        <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      )}
    </section>
  )
}
