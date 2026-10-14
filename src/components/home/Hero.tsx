import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  ArrowRight,
  Sparkles,
  Compass,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Layers,
} from 'lucide-react'
import { BotanicalHero3D } from '../garden/BotanicalHero3D'
import { CommandPalette } from '../common/CommandPalette'
import { TOOLS } from '../../data/tools'

interface HeroProps {
  onOpenSearch?: () => void
}

export const Hero: React.FC<HeroProps> = ({ onOpenSearch }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const handleTriggerSearch = () => {
    if (onOpenSearch) {
      onOpenSearch()
    } else {
      setIsSearchOpen(true)
    }
  }

  const handleScrollToTools = () => {
    const el = document.getElementById('category-explorer') || document.getElementById('garden-catalogue')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-[85vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden text-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* 1. Realistic 3D Indian Flower Garden Stage (Roses, Chendumalli, Jasmine & Climbing Vines) */}
      <BotanicalHero3D />

      {/* 2. Hero Content Container (Deliberate Negative-Space Framing in Center) */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-6 sm:space-y-8 pointer-events-auto">
        {/* Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#06140D]/85 border border-[#D8B879]/40 backdrop-blur-xl shadow-2xl shadow-emerald-950/60"
        >
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <span className="text-xs sm:text-[13px] font-mono tracking-widest uppercase text-[#FDE68A] font-bold">
            YOUR EVERYDAY DIGITAL TOOLKIT
          </span>
        </motion.div>

        {/* Large, High-Contrast Cinematic Headline */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="space-y-4"
        >
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white font-sans leading-[1.04] drop-shadow-md">
            Technology in <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#FDE68A] via-[#FBBF24] to-[#F59E0B] bg-clip-text text-transparent drop-shadow-sm">
              Full Bloom.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-200 leading-relaxed font-sans font-normal drop-shadow-sm px-2">
            Powerful browser tools for audio, images, video, documents, finance and everyday work — thoughtfully designed for everyone.
          </p>
        </motion.div>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          {/* Primary CTA */}
          <button
            type="button"
            onClick={handleScrollToTools}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-base sm:text-lg flex items-center gap-3 shadow-2xl shadow-emerald-950/70 hover:shadow-emerald-500/30 transition-all duration-200 cursor-pointer group hover:scale-[1.03] active:scale-[0.98]"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>Explore All Tools</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
          </button>

          {/* Secondary CTA */}
          <Link
            to="/categories"
            className="px-7 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-base sm:text-lg border border-[#D8B879]/40 hover:border-[#D8B879] flex items-center gap-2.5 transition-all duration-200 cursor-pointer shadow-xl shadow-black/40 backdrop-blur-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <Compass className="w-5 h-5 text-amber-300" />
            <span>Discover Categories</span>
          </Link>
        </motion.div>

        {/* Global Command Search Bar Input */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="max-w-xl mx-auto pt-2"
        >
          <div
            onClick={handleTriggerSearch}
            className="group relative flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-[#0A1D14]/90 hover:bg-[#102B1E] border border-emerald-500/35 hover:border-[#D8B879]/70 shadow-2xl shadow-black/60 cursor-pointer transition-all backdrop-blur-2xl"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleTriggerSearch()
              }
            }}
            aria-label="Open Command Search (Ctrl+K)"
          >
            <div className="flex items-center gap-3 pl-2 sm:pl-3 flex-1 min-w-0">
              <Search className="w-5 h-5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-sm sm:text-base text-slate-300 group-hover:text-white font-sans truncate text-left">
                Search 64 verified tools, calculators & utilities...
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-amber-300">
              <span>Ctrl</span>
              <span>K</span>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono text-slate-300"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-emerald-500/20 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% In-Browser Privacy</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-emerald-500/20 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero Mandatory Logins</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-emerald-500/20 backdrop-blur-md">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{TOOLS.length} Production Utilities</span>
          </div>
        </motion.div>
      </div>

      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </section>
  )
}
