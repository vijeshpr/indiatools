import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Languages,
  Layers,
  Wrench,
  CheckCircle2,
} from 'lucide-react'
import { LiveMiniCalculator } from './LiveMiniCalculator'
import { TOOLS, CATEGORIES } from '../../data/tools'

interface HeroSectionProps {
  onOpenSearch: () => void
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
    <section className="relative pt-10 sm:pt-16 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Eyebrow Pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-indigo-900">
              INDIA'S EVERYDAY DIGITAL TOOLBOX
            </span>
            <span className="text-indigo-300">•</span>
            <span className="text-[11px] text-indigo-700 font-semibold font-mono">
              {totalTools} Precision Utilities
            </span>
          </div>
        </motion.div>

        {/* Hero Title & Subtext */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-slate-900"
          >
            Smart tools for real-life calculations.
            <span className="block text-indigo-600 mt-2 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Built specifically for India.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed pt-2"
          >
            Calculate, compare, convert and plan with practical tools built for everyday Indian needs.
            Free to use, fast to access, and designed for your phone or desktop.
          </motion.p>

          {/* Large Interactive Search Field */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-4 max-w-2xl mx-auto"
          >
            <div
              onClick={onOpenSearch}
              className="relative flex items-center bg-white border border-slate-200 hover:border-indigo-400 rounded-2xl shadow-sm hover:shadow-md transition-all p-2 sm:p-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 ml-1">
                <Search className="w-5 h-5" />
              </div>

              <span className="text-slate-400 group-hover:text-slate-600 text-sm sm:text-base px-3 text-left flex-1 select-none">
                Search 43 tools (e.g. JCB diesel, cheque, cent to sqft, 50kb photo)...
              </span>

              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 font-mono text-xs border border-slate-200 mr-1">
                <span>Ctrl K</span>
              </div>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-3 text-xs text-slate-600">
              <span className="text-[11px] font-mono text-slate-400 mr-1">Popular:</span>
              {quickPills.map((pill) => (
                <Link
                  key={pill.label}
                  to={pill.path}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <span>{pill.label}</span>
                  <span className="text-[9px] font-mono font-semibold bg-slate-100 text-slate-500 px-1 py-0.2 rounded">
                    {pill.tag}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 pb-6"
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
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-base flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Try Live Calculators</span>
            </a>
          </motion.div>

          {/* Factual Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-2 pb-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left"
          >
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <div className="text-base font-extrabold text-slate-900">{totalTools} Tools</div>
                <div className="text-[11px] text-slate-500">Everyday Precision</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-base font-extrabold text-slate-900">{totalCategories} Categories</div>
                <div className="text-[11px] text-slate-500">Drive, Build, Money...</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-base font-extrabold text-slate-900">100% Private</div>
                <div className="text-[11px] text-slate-500">Zero Cloud Uploads</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Languages className="w-4 h-4" />
              </div>
              <div>
                <div className="text-base font-extrabold text-slate-900">13 Languages</div>
                <div className="text-[11px] text-slate-500">Indian Cheque Words</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Embedded Interactive Live Mini-Calculator Section */}
        <motion.div
          id="live-calculator-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-4xl mx-auto mt-8 scroll-mt-24"
        >
          <LiveMiniCalculator />
        </motion.div>
      </div>
    </section>
  )
}
