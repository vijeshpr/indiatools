import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  Command,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Compass,
  Cpu,
  Lock,
  ShieldCheck,
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

  const handleScrollToGarden = () => {
    const el = document.getElementById('garden-catalogue')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative pt-6 pb-20 sm:pt-10 sm:pb-28 overflow-hidden text-center px-4 sm:px-6 lg:px-8">
      {/* 1. Real 3D Botanical Hero Scene with Opening Flower, Leaves & Pollen */}
      <div className="relative w-full max-w-5xl mx-auto -mb-16 sm:-mb-24 z-0">
        <BotanicalHero3D />
      </div>

      {/* 2. Hero Content Container with Editorial Nature-Tech Typography */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Botanical Identity Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10271C]/90 border border-emerald-500/30 backdrop-blur-md shadow-lg shadow-emerald-950/40"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#F3F0E5] font-semibold">
            IndiaTools • The Living Digital Garden • {TOOLS.length} Utilities
          </span>
        </motion.div>

        {/* Cinematic Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="space-y-4"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#F3F0E5] font-sans leading-[1.08]">
            A world of tools. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#D8B879] via-[#A8C5AC] to-[#16865D] bg-clip-text text-transparent">
              Growing around you.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-[#A8C5AC] leading-relaxed font-sans">
            Discover powerful browser utilities for media, documents, creativity, and everyday work —
            wrapped in a completely new digital experience.
          </p>
        </motion.div>

        {/* Primary & Secondary Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3.5 pt-2"
        >
          <button
            type="button"
            onClick={handleScrollToGarden}
            className="px-7 py-3.5 rounded-2xl bg-[#16865D] hover:bg-[#1fa372] text-[#F3F0E5] font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-emerald-900/40 transition-all cursor-pointer group hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-[#D8B879]" />
            <span>Explore the Garden</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <Link
            to="/tools"
            className="px-6 py-3.5 rounded-2xl bg-[#10271C]/90 hover:bg-[#163628] text-[#F3F0E5] font-semibold text-sm sm:text-base border border-emerald-500/25 flex items-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <Compass className="w-4 h-4 text-[#A8C5AC]" />
            <span>Discover All Tools</span>
          </Link>
        </motion.div>

        {/* Raycast-style Botanical Command Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto pt-3"
        >
          <div
            onClick={handleTriggerSearch}
            className="group relative flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-[#10271C]/85 hover:bg-[#163628] border border-emerald-500/25 hover:border-[#D8B879]/50 shadow-2xl shadow-emerald-950/40 cursor-pointer transition-all backdrop-blur-xl"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleTriggerSearch()
              }
            }}
            aria-label="Open Botanical Command Palette (Ctrl+K)"
          >
            <div className="flex items-center gap-3 pl-2 sm:pl-3 flex-1 min-w-0">
              <Search className="w-5 h-5 text-[#D8B879] shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-sm sm:text-base text-[#A8C5AC] group-hover:text-[#F3F0E5] font-sans truncate text-left">
                Search tools, explore categories, or jump to a utility...
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 pr-1">
              <kbd className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-[#D8B879] bg-black/40 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <Command className="w-3 h-3 text-[#A8C5AC]" />
                <span>K</span>
              </kbd>
              <div className="sm:hidden px-2.5 py-1 rounded-lg bg-[#16865D] text-[#F3F0E5] text-xs font-bold font-mono">
                Search
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-medium text-[#A8C5AC]"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10271C]/70 border border-emerald-500/20">
            <Cpu className="w-3.5 h-3.5 text-[#16865D]" />
            <span>In-Browser Processing</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10271C]/70 border border-emerald-500/20">
            <Lock className="w-3.5 h-3.5 text-[#D8B879]" />
            <span>Zero Server Uploads</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10271C]/70 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5 text-[#A8C5AC]" />
            <span>Free & Open Access</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10271C]/70 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Client-Side Privacy</span>
          </div>
        </motion.div>

        {/* Botanical Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="pt-6 flex flex-col items-center justify-center gap-1 text-[#A8C5AC]/70 cursor-pointer"
          onClick={handleScrollToGarden}
        >
          <span className="text-[10px] font-mono tracking-widest uppercase">Scroll to bloom</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#D8B879]" />
        </motion.div>
      </div>

      {!onOpenSearch && (
        <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      )}
    </section>
  )
}
