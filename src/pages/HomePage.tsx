import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Truck,
  FileCheck,
  Lock,
  CheckCircle2,
  ShieldCheck,
  Languages,
} from 'lucide-react'
import { HeroSection } from '../components/home/HeroSection'
import { CategoryShowcase } from '../components/home/CategoryShowcase'
import { StatsSection } from '../components/home/StatsSection'
import { CategoryMascotGrid } from '../components/mascot/CategoryMascotGrid'
import { JcbExcavatorMascot, PhotoDocMascot } from '../components/mascot/CategoryMascots'
import {
  TricolorScrollRibbon,
  SectionTricolorDivider,
} from '../components/animations/TricolorScrollRibbon'
import { SearchModal } from '../components/common/SearchModal'
import { useSEO } from '../hooks/useSEO'

export const HomePage: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useSEO({
    title: 'IndiaTools – Practical Calculators & Useful Online Tools',
    description:
      'IndiaTools provides practical online calculators and useful tools for vehicle costs, construction, electricity, salary, land area, image resizing and everyday calculations.',
    canonicalPath: '/',
  })

  return (
    <div className="relative overflow-hidden">
      {/* Signature Indian Tricolor Flowing Scroll Ribbon */}
      <TricolorScrollRibbon />

      {/* Hero Section with Interactive AI Robot Mascot */}
      <HeroSection onOpenSearch={() => setIsSearchOpen(true)} />

      {/* Tricolor Section Divider */}
      <SectionTricolorDivider />

      {/* Verified Stats Section */}
      <StatsSection />

      {/* Tricolor Section Divider */}
      <SectionTricolorDivider />

      {/* Interactive 7 Category Mascots Grid */}
      <CategoryMascotGrid />

      {/* ================= FEATURED FLAGSHIP SPOTLIGHT: INDIAN CHEQUE STUDIO ================= */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5 }}
        className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-slate-800 shadow-sm dark:shadow-black/20 relative overflow-hidden group">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-teal-50/40 dark:bg-teal-950/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Context & Benefits */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  ★ FEATURED FINTECH TOOL
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  NEW
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  CTS-2010 SPECIMEN
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Indian Cheque Studio
                <span className="block text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                  Interactive Cheque Demo in 13 Indian Languages
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Master cheque-filling with zero mistakes. Generate authentic CTS-2010 specimen cheques,
                convert numeric rupees into flawless words across 13 Indian languages, simulate Account Payee crossings,
                and export high-fidelity A4 specimen printouts.
              </p>

              {/* Supported Indian Languages Ribbon */}
              <div className="pt-2">
                <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 block mb-1.5 font-bold">
                  Supported Regional Scripts:
                </span>
                <div className="flex flex-wrap gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                  {['English', 'हिन्दी', 'தமிழ்', 'മലയാളം', 'తెలుగు', 'ಕನ್ನಡ', 'বাংলা', 'मराठी', 'ગુજરાતી', 'ਪੰਜਾਬੀ', 'ଓଡ଼ିଆ', 'অসমীয়া', 'اردو'].map((langName) => (
                    <span key={langName} className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                      {langName}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Link
                  to="/calculators/indian-cheque-studio"
                  className="px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all cursor-pointer group"
                >
                  <span>Explore Cheque Studio</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  100% Free • Non-Negotiable Training Specimen
                </span>
              </div>
            </div>

            {/* Right Column: Visual Mini Specimen Illustration */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[340px] sm:max-w-[390px] rounded-2xl border border-slate-300 bg-[#FAFBFB] text-slate-900 shadow-sm overflow-hidden font-serif select-none relative p-3 sm:p-4 text-xs">
                {/* Bank Header Bar */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-[#004B87]" />

                {/* Diagonal Watermark */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.14] select-none z-10">
                  <span className="text-xl sm:text-2xl font-black uppercase tracking-[0.25em] -rotate-12 text-slate-800 text-center leading-tight">
                    DEMO — NOT A VALID CHEQUE
                  </span>
                </div>

                {/* Account Payee Crossing (Top Left) */}
                <div className="absolute top-2 left-2 pointer-events-none z-20">
                  <div className="w-16 h-8 border-b-2 border-r-2 border-slate-900 -rotate-45 -translate-x-4 -translate-y-2 flex items-center justify-center">
                    <span className="text-[6px] font-sans font-black tracking-tighter text-slate-950">
                      A/C PAYEE ONLY
                    </span>
                  </div>
                </div>

                {/* Bank Title & Date Row */}
                <div className="flex items-start justify-between pl-6 mb-2">
                  <div>
                    <h4 className="font-black text-xs text-[#004B87] uppercase font-sans tracking-tight">
                      State Bank of India
                    </h4>
                    <p className="text-[8px] text-slate-500 font-sans">
                      IFSC: SBIN0000691 • CTS-2010
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[7px] font-sans font-bold text-slate-500 uppercase block">
                      DATE / दिनांक
                    </span>
                    <div className="flex items-center gap-0.5 font-mono text-[9px] font-bold text-slate-900">
                      <span className="w-3 h-3.5 border border-slate-400 flex items-center justify-center bg-white">1</span>
                      <span className="w-3 h-3.5 border border-slate-400 flex items-center justify-center bg-white">5</span>
                      <span className="w-3 h-3.5 border border-slate-400 flex items-center justify-center bg-white">1</span>
                      <span className="w-3 h-3.5 border border-slate-400 flex items-center justify-center bg-white">0</span>
                      <span className="w-3 h-3.5 border border-slate-400 flex items-center justify-center bg-white">2</span>
                      <span className="w-3 h-3.5 border border-slate-400 flex items-center justify-center bg-white">0</span>
                      <span className="w-3 h-3.5 border border-slate-400 flex items-center justify-center bg-white">2</span>
                      <span className="w-3 h-3.5 border border-slate-400 flex items-center justify-center bg-white">6</span>
                    </div>
                  </div>
                </div>

                {/* Cheque Body */}
                <div className="mt-2 space-y-1.5 font-sans text-[10px]">
                  <div className="flex items-end gap-1 border-b border-dotted border-slate-400 pb-0.5">
                    <span className="font-bold text-slate-700 whitespace-nowrap text-[9px] font-serif">
                      PAY:
                    </span>
                    <span className="font-bold text-slate-950 font-serif text-[11px] truncate flex-1">
                      Ramesh Kumar
                    </span>
                    <span className="text-[8px] font-bold text-slate-600 whitespace-nowrap">
                      OR BEARER
                    </span>
                  </div>

                  <div className="border-b border-dotted border-slate-400 pb-0.5">
                    <span className="font-bold text-slate-700 whitespace-nowrap text-[9px] font-serif mr-1">
                      RUPEES:
                    </span>
                    <span className="font-semibold text-slate-950 font-serif text-[10px]">
                      पचास हज़ार रुपये मात्र // Fifty Thousand Rupees Only //
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="border border-slate-800 bg-white rounded px-2 py-0.5 shadow-2xs">
                      <span className="text-xs font-black font-mono text-slate-950">₹ 50,000 /-</span>
                    </div>
                    <div className="text-right text-[8px] text-slate-400 italic">
                      Authorised Signatory
                    </div>
                  </div>
                </div>

                {/* Bottom MICR Strip */}
                <div className="mt-2 pt-1 border-t border-slate-200 text-center font-mono text-[8px] text-slate-600 tracking-wider">
                  ⑈ 123456 ⑈ 560002015 ⑆ 000123 ⑈ 10
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Dual Flagship Spotlight Banner */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5 }}
        className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Flagship 1: JCB / Excavator Diesel Cost */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-slate-800 shadow-sm dark:shadow-black/20 relative overflow-hidden flex flex-col justify-between group hover:border-amber-300 dark:hover:border-amber-500/50 hover:shadow-md dark:hover:shadow-amber-950/20 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-mono uppercase font-bold text-amber-800 dark:text-amber-300 tracking-wider">
                    Flagship Commercial Tool
                  </span>
                </div>
                <div className="hidden sm:block shrink-0">
                  <JcbExcavatorMascot size={88} isHovered={true} />
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                JCB & Heavy Excavator Fuel Cost
              </h3>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Compute exact hourly, daily, weekly, and monthly diesel expenditure for JCB 3DX, 4DX,
                and 20-ton hydraulic excavators. Used by contractors, earthmovers, and quarry operators.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">JCB 3DX & Excavators</span>
              <Link
                to="/calculators/jcb-fuel-cost"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300"
              >
                <span>Launch Calculator</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Flagship 2: 50KB Photo Resizer for Govt Exams */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-slate-800 shadow-sm dark:shadow-black/20 relative overflow-hidden flex flex-col justify-between group hover:border-pink-300 dark:hover:border-pink-500/50 hover:shadow-md dark:hover:shadow-pink-950/20 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-pink-50 dark:bg-pink-950/80 text-pink-700 dark:text-pink-400 border border-pink-200 dark:border-pink-800 flex items-center justify-center">
                    <FileCheck className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-mono uppercase font-bold text-pink-800 dark:text-pink-300 tracking-wider">
                    Govt Exam Special
                  </span>
                </div>
                <div className="hidden sm:block shrink-0">
                  <PhotoDocMascot size={82} isHovered={true} />
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-pink-700 dark:group-hover:text-pink-400 transition-colors">
                50KB Photo Resizer for UPSC & SSC
              </h3>

              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Resize and compress applicant portrait photos strictly under 50KB for UPSC, SSC, IBPS,
                and State PSC portals. 100% private client-side processing directly in your browser.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">100% In-Browser Privacy</span>
              <Link
                to="/tools/50kb-photo"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-700 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-300"
              >
                <span>Resize Photo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Tricolor Section Divider */}
      <SectionTricolorDivider />

      {/* Category Showcase: DRIVE, BUILD, POWER, MONEY, LAND, WORK, CREATE */}
      <CategoryShowcase />

      {/* Privacy & Philosophy Callout */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5 }}
        className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-slate-800 shadow-sm dark:shadow-black/20 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Built for Privacy. Zero Cloud Uploads.
          </h3>

          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Your personal photos, signatures, CTC figures, and calculations never leave your device.
            Everything is computed client-side in your own browser using modern HTML5 standards.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>No Cookies Tracking</span>
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>No Account Mandatory</span>
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>100% Free Forever</span>
            </span>
          </div>
        </div>
      </motion.section>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  )
}
