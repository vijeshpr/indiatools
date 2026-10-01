import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import {
  Search,
  ArrowRight,
  Sparkles,
  Car,
  HardHat,
  Zap,
  IndianRupee,
  FileText,
  Home,
  Sun,
  Ruler,
} from 'lucide-react'
import { LiveMiniCalculator } from './LiveMiniCalculator'

interface HeroSectionProps {
  onOpenSearch: () => void
}

const ACTION_WORDS = ['Calculate.', 'Convert.', 'Plan.', 'Create.']

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenSearch }) => {
  const [activeWordIndex, setActiveWordIndex] = useState(0)

  // Mouse-responsive lighting coordinates
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 120 })
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 120 })

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % ACTION_WORDS.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] flex flex-col justify-center pt-8 pb-20 overflow-hidden"
    >
      {/* Background Interactive Lighting Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-40 blur-3xl transition-opacity duration-500"
        style={{
          background: `radial-gradient(650px circle at ${smoothX}px ${smoothY}px, rgba(245, 158, 11, 0.12), rgba(249, 115, 22, 0.05), transparent 75%)`,
        }}
      />

      {/* Background Ambient Subtle Icons (Floating geometry) */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-25 dark:opacity-20 light:opacity-10">
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 left-[10%] text-orange-500/40"
        >
          <Car className="w-16 h-16" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 18, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-28 right-[12%] text-amber-500/40"
        >
          <HardHat className="w-14 h-14" />
        </motion.div>

        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-36 left-[8%] text-blue-500/40"
        >
          <Zap className="w-16 h-16" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute bottom-20 right-[10%] text-emerald-500/40"
        >
          <Sun className="w-20 h-20" />
        </motion.div>

        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          className="absolute top-1/2 left-[3%] text-purple-500/30"
        >
          <IndianRupee className="w-12 h-12" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
          className="absolute top-1/3 right-[4%] text-pink-500/30"
        >
          <FileText className="w-14 h-14" />
        </motion.div>
      </div>

      {/* Atmospheric Radial Gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Intro Tag Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 dark:bg-neutral-900/90 light:bg-white border border-neutral-700/80 light:border-slate-300 shadow-xl backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-200 light:text-slate-800">
              India Practical Tools Platform
            </span>
            <span className="text-neutral-500">•</span>
            <span className="text-xs text-amber-400 font-semibold">40+ Precision Utilities</span>
          </div>
        </motion.div>

        {/* Cinematic Large Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white light:text-slate-900"
          >
            EVERYDAY PROBLEMS.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
              ONE POWERFUL TOOLBOX.
            </span>
          </motion.h1>

          {/* Kinetic Word Transition */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-10 flex items-center justify-center gap-2 text-xl sm:text-2xl font-bold font-mono text-neutral-300 light:text-slate-700"
          >
            <span className="text-neutral-500">I want to</span>
            <motion.span
              key={activeWordIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-amber-400 border-b-2 border-amber-400 pb-0.5"
            >
              {ACTION_WORDS[activeWordIndex]}
            </motion.span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-base sm:text-xl text-neutral-400 light:text-slate-600 max-w-2xl mx-auto leading-relaxed pt-2"
          >
            Everything you need for everyday Indian life — automotive mileage, JCB machine fuel,
            house construction, solar requirements, land units, salary in-hand, and 50KB govt exam photos.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 pb-10"
          >
            <Link
              to="/tools"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-neutral-950 font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 group cursor-pointer"
            >
              <span>Explore All 40+ Tools</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>

            <button
              onClick={onOpenSearch}
              type="button"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-neutral-900/90 light:bg-white text-white light:text-slate-900 border border-neutral-700 light:border-slate-300 font-bold text-base hover:border-amber-500/60 hover:bg-neutral-850 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Search a Tool</span>
              <kbd className="hidden sm:inline text-xs font-mono bg-neutral-800 light:bg-slate-100 text-neutral-400 px-2 py-0.5 rounded border border-neutral-700 light:border-slate-300 ml-1">
                Ctrl K
              </kbd>
            </button>
          </motion.div>
        </div>

        {/* Embedded Interactive Live Mini-Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto mt-6"
        >
          <LiveMiniCalculator />
        </motion.div>
      </div>
    </section>
  )
}
