import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles,
  ArrowRight,
  Truck,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react'
import { HeroSection } from '../components/home/HeroSection'
import { CategoryShowcase } from '../components/home/CategoryShowcase'
import { StatsSection } from '../components/home/StatsSection'
import {
  TricolorScrollRibbon,
  SectionTricolorDivider,
} from '../components/animations/TricolorScrollRibbon'
import { SearchModal } from '../components/common/SearchModal'

export const HomePage: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <div className="relative overflow-hidden">
      {/* Signature Indian Tricolor Flowing Scroll Ribbon */}
      <TricolorScrollRibbon />

      {/* Hero Section */}
      <HeroSection onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Tricolor Section Divider */}
      <SectionTricolorDivider />

      {/* Verified Stats Section */}
      <StatsSection />

      {/* Dual Flagship Spotlight Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Flagship 1: JCB / Excavator Diesel Cost */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950/40 border border-amber-500/30 shadow-xl relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono uppercase font-bold text-amber-400 tracking-wider">
                  Flagship Commercial Tool
                </span>
              </div>

              <h3 className="text-2xl font-black text-white group-hover:text-amber-300 transition-colors">
                JCB & Heavy Excavator Fuel Cost
              </h3>

              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                Compute exact hourly, daily, weekly, and monthly diesel expenditure for JCB 3DX, 4DX,
                and 20-ton hydraulic excavators. Used by contractors, earthmovers, and quarry operators.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-400">JCB 3DX & Excavators</span>
              <Link
                to="/calculators/jcb-fuel-cost"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:text-amber-300"
              >
                <span>Launch Calculator</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Flagship 2: 50KB Photo Resizer for Govt Exams */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-pink-950/40 border border-pink-500/30 shadow-xl relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                  <FileCheck className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono uppercase font-bold text-pink-400 tracking-wider">
                  Govt Exam Special
                </span>
              </div>

              <h3 className="text-2xl font-black text-white group-hover:text-pink-300 transition-colors">
                50KB Photo Resizer for UPSC & SSC
              </h3>

              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                Resize and compress applicant portrait photos strictly under 50KB for UPSC, SSC, IBPS,
                and State PSC portals. 100% private client-side processing directly in your browser.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-400">100% In-Browser Privacy</span>
              <Link
                to="/tools/50kb-photo"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-400 group-hover:text-pink-300"
              >
                <span>Resize Photo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tricolor Section Divider */}
      <SectionTricolorDivider />

      {/* Category Showcase: DRIVE, BUILD, POWER, LAND, WORK, CREATE */}
      <CategoryShowcase />

      {/* Privacy & Philosophy Callout */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900/60 dark:bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-2xl relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white light:text-slate-900 tracking-tight">
            Built for Privacy. Zero Cloud Uploads.
          </h3>

          <p className="mt-3 text-sm sm:text-base text-neutral-400 light:text-slate-600 max-w-xl mx-auto leading-relaxed">
            Your personal photos, signatures, CTC figures, and calculations never leave your device.
            Everything is computed client-side in your own browser using modern HTML5 standards.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-neutral-300">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-950 border border-neutral-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No Cookies Tracking</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-950 border border-neutral-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No Account Mandatory</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-950 border border-neutral-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Free Forever</span>
            </span>
          </div>
        </div>
      </section>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  )
}
