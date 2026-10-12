import React from 'react'
import { Link } from 'react-router-dom'
import { motion, Variants } from 'framer-motion'
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Languages,
  Layers,
  Wrench,
  Zap,
} from 'lucide-react'
import { LiveMiniCalculator } from './LiveMiniCalculator'
import { TOOLS, CATEGORIES } from '../../data/tools'
import { AiHeroMascot } from '../mascot/AiHeroMascot'

interface HeroSectionProps {
  onOpenSearch: () => void
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenSearch }) => {
  const totalTools = TOOLS.length // Exactly 43
  const totalCategories = Object.keys(CATEGORIES).length // Exactly 7

  const quickPills = [
    { label: 'JCB Fuel Cost', path: '/calculators/jcb-fuel-cost', tag: 'Flagship' },
    { label: 'Indian Cheque Studio', path: '/calculators/indian-cheque-studio', tag: '13 Languages' },
    { label: '50KB Photo Resizer', path: '/tools/50kb-photo', tag: 'Govt Exam' },
    { label: 'Cent ↔ Sq.ft', path: '/calculators/cent-to-sqft', tag: 'Land' },
    { label: 'AC Power Cost', path: '/calculators/ac-electricity-cost', tag: 'Tariffs' },
    { label: 'PM Surya Ghar Solar', path: '/calculators/solar-panel', tag: 'Solar' },
  ]

  return (
    <section className="relative pt-6 sm:pt-10 pb-20 overflow-hidden">
      {/* Floating Decorative Ambient Badge for Desktop (Left only) */}
      <motion.div
        animate={{ y: [-6, 6, -6] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        className="hidden 2xl:flex absolute top-28 left-8 items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-[#131B2E]/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 shadow-md dark:shadow-black/30 pointer-events-none select-none z-10"
      >
        <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <Zap className="w-4 h-4" />
        </div>
        <div className="text-left">
          <span className="text-[11px] font-bold text-slate-900 dark:text-white block leading-tight">Instant Indian Math</span>
          <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400">Zero lag • 100% Client-side</span>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Responsive Hero Layout: 2 Columns on Desktop, Clean Stack on Mobile */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center"
        >
          {/* ================= LEFT COLUMN: HEADING, DESCRIPTION, SEARCH & CTAS ================= */}
          <div className="lg:col-span-7 xl:col-span-8 text-center lg:text-left space-y-4 sm:space-y-5">
            {/* Featured Cheque Studio Spotlight Pill */}
            <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
              <Link
                to="/calculators/indian-cheque-studio"
                className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 hover:from-amber-500/20 hover:via-indigo-500/20 hover:to-emerald-500/20 border border-amber-500/30 dark:border-amber-400/30 text-slate-800 dark:text-zinc-200 shadow-xs transition-all cursor-pointer"
              >
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-2xs">
                  FEATURED
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Indian Cheque Studio (13 Languages & CTS-2010 Specimen)
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-amber-500" />
              </Link>
            </motion.div>

            {/* Eyebrow Pill */}
            <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
              <div className="inline-flex max-w-full flex-wrap justify-center lg:justify-start items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-indigo-900 dark:text-indigo-300">
                  INDIA'S EVERYDAY DIGITAL TOOLBOX
                </span>
                <span className="text-indigo-300 dark:text-indigo-700 hidden sm:inline">•</span>
                <span className="text-[10px] sm:text-[11px] text-indigo-700 dark:text-indigo-400 font-semibold font-mono">
                  {totalTools} Precision Utilities
                </span>
              </div>
            </motion.div>

            {/* Hero Title & Subtext */}
            <motion.h1
              variants={itemVariants}
              className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-slate-900 dark:text-white break-words"
            >
              Smart tools for real-life calculations.
              <span className="block text-indigo-600 dark:text-indigo-400 mt-1.5 text-xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Built specifically for India.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Calculate, compare, convert and plan with practical tools built for everyday Indian needs.
              Free to use, fast to access, and designed for your phone or desktop.
            </motion.p>

            {/* Large Interactive Search Field */}
            <motion.div variants={itemVariants} className="pt-2 max-w-2xl mx-auto lg:mx-0">
              <div
                onClick={onOpenSearch}
                className="relative flex items-center min-w-0 bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/60 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-indigo-950/40 transition-all p-2 sm:p-2.5 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 ml-1">
                  <Search className="w-5 h-5 group-hover:scale-105 transition-transform" />
                </div>

                <span className="text-slate-400 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 text-xs sm:text-base px-3 text-left flex-1 min-w-0 truncate select-none">
                  <span className="sm:hidden">Search 43 tools (JCB, cheque, 50kb)...</span>
                  <span className="hidden sm:inline">Search 43 tools (e.g. JCB diesel, cheque, cent to sqft, 50kb photo)...</span>
                </span>

                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono text-xs border border-slate-200 dark:border-slate-700 mr-1 shrink-0">
                  <span>Ctrl K</span>
                </div>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 pt-3 text-xs text-slate-600 dark:text-slate-300">
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mr-1">Popular:</span>
                {quickPills.map((pill) => (
                  <motion.div
                    key={pill.label}
                    whileHover={{ scale: 1.04, y: -1 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Link
                      to={pill.path}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#131B2E] hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/40 text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <span>{pill.label}</span>
                      <span className="text-[9px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1 py-0.2 rounded">
                        {pill.tag}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2"
            >
              <Link
                to="/tools"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer group"
              >
                <span>Explore All {totalTools} Tools</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#live-calculator-section"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white dark:bg-[#131B2E] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-base flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Try Live Calculators</span>
              </a>
            </motion.div>
          </div>

          {/* ================= RIGHT COLUMN: BHARATH AI INTERACTIVE COMPANION ================= */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 xl:col-span-4 flex flex-col items-center justify-center relative mt-4 lg:mt-0"
          >
            {/* Clean Glassmorphic Pedestal Card */}
            <div className="relative p-5 sm:p-7 rounded-3xl bg-white/60 dark:bg-[#131B2E]/70 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-sm dark:shadow-indigo-950/20 flex flex-col items-center text-center group hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all">
              {/* Subtle Ambient Radial Glow */}
              <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-400/15 rounded-3xl blur-2xl pointer-events-none" />

              {/* Bharath AI Mascot */}
              <AiHeroMascot />

              {/* Accessible Minimalist Label */}
              <p className="mt-2 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium max-w-[210px] leading-snug">
                Your friendly interactive companion for everyday Indian math.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Factual Trust Indicators */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="pt-10 pb-6 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 max-w-5xl mx-auto text-left"
        >
          <motion.div
            whileHover={{ y: -3, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="p-2.5 sm:p-3.5 rounded-xl bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-slate-800 shadow-2xs dark:shadow-black/20 flex items-center gap-2 sm:gap-3 min-w-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Wrench className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">{totalTools} Tools</div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">Everyday Precision</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -3, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="p-2.5 sm:p-3.5 rounded-xl bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-slate-800 shadow-2xs dark:shadow-black/20 flex items-center gap-2 sm:gap-3 min-w-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-teal-50 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">{totalCategories} Categories</div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">Drive, Build, Money...</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -3, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="p-2.5 sm:p-3.5 rounded-xl bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-slate-800 shadow-2xs dark:shadow-black/20 flex items-center gap-2 sm:gap-3 min-w-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">100% Private</div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">Zero Cloud Uploads</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -3, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="p-2.5 sm:p-3.5 rounded-xl bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-slate-800 shadow-2xs dark:shadow-black/20 flex items-center gap-2 sm:gap-3 min-w-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Languages className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate">13 Languages</div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">Indian Cheque Words</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Embedded Interactive Live Mini-Calculator Section */}
        <motion.div
          id="live-calculator-section"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mt-8 scroll-mt-24"
        >
          <LiveMiniCalculator />
        </motion.div>
      </div>
    </section>
  )
}
