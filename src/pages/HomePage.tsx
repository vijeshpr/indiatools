import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Truck,
  FileCheck,
  Lock,
  CheckCircle2,
  QrCode,
  Sparkles,
  Store,
  Layers,
  Cpu,
  ShieldCheck,
  Compass,
} from 'lucide-react'
import { Hero } from '../components/home/Hero'
import { CategoryNav } from '../components/home/CategoryNav'
import { ToolGrid } from '../components/home/ToolGrid'
import { AssetHubSection } from '../components/home/AssetHubSection'
import { ScrollGardenCanvas } from '../components/garden/ScrollGardenCanvas'
import { CommandPalette } from '../components/common/CommandPalette'
import { TOOLS } from '../data/tools'
import { useSEO } from '../hooks/useSEO'

export const HomePage: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useSEO({
    title: 'IndiaTools – Practical Calculators & Useful Online Tools',
    description:
      'IndiaTools provides practical online calculators and useful tools for vehicle costs, construction, electricity, salary, land area, image resizing and everyday calculations.',
    canonicalPath: '/',
  })

  // Filter tools based on selected category
  const filteredTools = useMemo(() => {
    if (selectedCategory === 'all') {
      return TOOLS
    }
    return TOOLS.filter((tool) => tool.category === selectedCategory)
  }, [selectedCategory])

  const handleResetFilters = () => {
    setSelectedCategory('all')
  }

  return (
    <div className="relative overflow-hidden selection:bg-[#16865D] selection:text-white">
      {/* Scroll-Reactive 5-Stage Living Garden Background Canvas */}
      <ScrollGardenCanvas />

      {/* 1. Cinematic 3D Botanical Hero Section with Blooming Flower & Pollen */}
      <Hero onOpenSearch={() => setIsSearchOpen(true)} />

      {/* 2. Sticky Category Filter Bar */}
      <CategoryNav
        activeCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        totalFilteredCount={filteredTools.length}
        hasActiveFilters={selectedCategory !== 'all'}
        onResetFilters={handleResetFilters}
      />

      {/* 3. Next-Generation Botanical Tool Grid */}
      <section id="garden-catalogue" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F3F0E5] tracking-tight flex items-center gap-2.5">
              <span>Garden Tool Catalogue</span>
              <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-[#10271C] text-[#D8B879] border border-emerald-500/25">
                {filteredTools.length} of {TOOLS.length} Blooming
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[#A8C5AC] mt-1 font-sans">
              Engineered for local in-browser execution with zero mandatory logins or cloud tracking.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#10271C]/90 hover:bg-[#163628] border border-emerald-500/20 text-xs font-mono text-[#A8C5AC] hover:text-[#F3F0E5] transition-colors cursor-pointer shadow-xs"
          >
            <span>Command Palette</span>
            <kbd className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-[#D8B879]">Ctrl+K</kbd>
          </button>
        </div>

        <ToolGrid tools={filteredTools} onResetFilters={handleResetFilters} />
      </section>

      {/* 4. Flagship Spotlight 1: Indian Cheque Studio */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5 }}
        className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0C1E16] border border-emerald-500/25 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#D8B879]/8 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Context & Benefits */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-950 text-[#D8B879] border border-emerald-800">
                  ★ FEATURED FINTECH TOOL
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-[#10271C] text-emerald-400 border border-emerald-700">
                  VERIFIED
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full bg-[#07130E] text-[#A8C5AC] border border-emerald-500/15">
                  CTS-2010 SPECIMEN
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-[#F3F0E5] tracking-tight leading-tight">
                Indian Cheque Studio
                <span className="block text-xl sm:text-2xl font-bold text-[#D8B879] mt-1">
                  Interactive Cheque Demo in 13 Indian Languages
                </span>
              </h2>

              <p className="text-sm sm:text-base text-[#A8C5AC] leading-relaxed max-w-2xl font-sans">
                Master cheque-filling with zero mistakes. Generate authentic CTS-2010 specimen cheques,
                convert numeric rupees into flawless words across 13 Indian languages, simulate Account Payee crossings,
                and export high-fidelity A4 specimen printouts.
              </p>

              {/* Supported Indian Languages Ribbon */}
              <div className="pt-2">
                <span className="text-[11px] font-mono uppercase text-[#D8B879] block mb-1.5 font-bold">
                  Supported Regional Scripts:
                </span>
                <div className="flex flex-wrap gap-1.5 text-xs font-medium text-[#F3F0E5]">
                  {['English', 'हिन्दी', 'தமிழ்', 'മലയാളം', 'తెలుగు', 'ಕನ್ನಡ', 'বাংলা', 'मराठी', 'ગુજરાતી', 'ਪੰਜਾਬੀ', 'ଓଡ଼ിଆ', 'অসমীয়া', 'اردو'].map((langName) => (
                    <span
                      key={langName}
                      className="px-2.5 py-1 rounded-lg bg-[#10271C] border border-emerald-500/20 text-[#A8C5AC] font-medium"
                    >
                      {langName}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Link
                  to="/calculators/indian-cheque-studio"
                  className="px-7 py-3.5 rounded-2xl bg-[#16865D] hover:bg-[#1fa372] text-[#F3F0E5] font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer group"
                >
                  <span>Explore Cheque Studio</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <span className="text-xs font-mono text-[#A8C5AC]">
                  100% Free • Non-Negotiable Training Specimen
                </span>
              </div>
            </div>

            {/* Right Column: Visual Mini Specimen Illustration */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[340px] sm:max-w-[390px] rounded-2xl border border-slate-300 bg-[#FAFBFB] text-slate-900 shadow-xl overflow-hidden font-serif select-none relative p-3 sm:p-4 text-xs">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-[#004B87]" />

                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.14] select-none z-10">
                  <span className="text-xl sm:text-2xl font-black uppercase tracking-[0.25em] -rotate-12 text-slate-800 text-center leading-tight">
                    DEMO — NOT A VALID CHEQUE
                  </span>
                </div>

                <div className="absolute top-2 left-2 pointer-events-none z-20">
                  <div className="w-16 h-8 border-b-2 border-r-2 border-slate-900 -rotate-45 -translate-x-4 -translate-y-2 flex items-center justify-center">
                    <span className="text-[6px] font-sans font-black tracking-tighter text-slate-950">
                      A/C PAYEE ONLY
                    </span>
                  </div>
                </div>

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

                <div className="mt-2 pt-1 border-t border-slate-200 text-center font-mono text-[8px] text-slate-600 tracking-wider">
                  ⑈ 123456 ⑈ 560002015 ⑆ 000123 ⑈ 10
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 5. Flagship Spotlight 2: UPI QR Code & Shop Standee Poster */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5 }}
        className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0C1E16] border border-emerald-500/25 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-950 text-[#D8B879] border border-emerald-800 flex items-center gap-1">
                  <QrCode className="w-3 h-3 text-[#D8B879]" />
                  <span>★ NEW CREATE TOOL</span>
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-[#10271C] text-emerald-400 border border-emerald-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>PRINT READY</span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-full bg-[#07130E] text-[#A8C5AC] border border-emerald-500/15">
                  A4 / A5 STANDEE
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-[#F3F0E5] tracking-tight leading-tight">
                UPI QR Code Generator with Logo
                <span className="block text-xl sm:text-2xl font-bold text-[#D8B879] mt-1">
                  & Printable Merchant Counter Stand Posters
                </span>
              </h2>

              <p className="text-sm sm:text-base text-[#A8C5AC] leading-relaxed max-w-2xl font-sans">
                Create high-resolution payment QR codes for Google Pay, PhonePe, and Paytm with your custom shop logo,
                fixed or open payment amounts, and transaction notes. Print authentic counter standee cards (A5 acrylic)
                or shop wall posters (A4) directly from your browser with zero registration.
              </p>

              <div className="pt-2">
                <span className="text-[11px] font-mono uppercase text-[#D8B879] block mb-1.5 font-bold">
                  Supported QR Formats:
                </span>
                <div className="flex flex-wrap gap-1.5 text-xs font-medium text-[#F3F0E5]">
                  {['UPI Payment Deep Link', 'Shop Logo Overlay', 'Website URL', 'WhatsApp Chat', 'Wi-Fi Auto-Connect', 'SVG Vector Export', 'Printable A5/A4 Standee'].map((badge) => (
                    <span
                      key={badge}
                      className="px-2.5 py-1 rounded-lg bg-[#10271C] border border-emerald-500/20 text-[#A8C5AC] font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <Link
                  to="/calculators/qr-code-generator"
                  className="px-7 py-3.5 rounded-2xl bg-[#16865D] hover:bg-[#1fa372] text-[#F3F0E5] font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer group"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Create UPI QR & Poster</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <span className="text-xs font-mono text-[#A8C5AC]">
                  100% Client-Side • Instant Vector SVG & PNG
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[280px] sm:max-w-[310px] rounded-3xl border border-emerald-500/25 bg-[#07130E] shadow-2xl text-center p-5 space-y-4 select-none relative group hover:scale-[1.02] transition-transform">
                <div className="flex items-center justify-center gap-1.5 py-1 px-3 rounded-full bg-[#10271C] border border-emerald-500/20 text-[11px] font-bold text-[#D8B879] font-mono">
                  <Store className="w-3.5 h-3.5 text-[#D8B879]" />
                  <span>MERCHANT STANDEE SPECIMEN</span>
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-base font-black text-[#F3F0E5] tracking-tight">
                    ANAND GENERAL STORE
                  </h4>
                  <p className="text-[11px] font-mono text-[#A8C5AC]">
                    Scan to pay with any UPI App
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-black border border-emerald-500/20 inline-block shadow-inner">
                  <div className="w-36 h-36 bg-white rounded-xl p-2 flex items-center justify-center relative border border-slate-200">
                    <div className="w-full h-full relative grid grid-cols-6 grid-rows-6 gap-1 p-1 bg-white">
                      <div className="col-span-2 row-span-2 border-2 border-slate-900 p-0.5 flex items-center justify-center">
                        <div className="w-full h-full bg-slate-900" />
                      </div>
                      <div className="col-start-5 col-span-2 row-span-2 border-2 border-slate-900 p-0.5 flex items-center justify-center">
                        <div className="w-full h-full bg-slate-900" />
                      </div>
                      <div className="col-span-2 row-start-5 row-span-2 border-2 border-slate-900 p-0.5 flex items-center justify-center">
                        <div className="w-full h-full bg-slate-900" />
                      </div>
                      <div className="col-start-3 row-start-1 bg-slate-800 rounded-xs" />
                      <div className="col-start-4 row-start-2 bg-slate-800 rounded-xs" />
                      <div className="col-start-3 row-start-3 bg-slate-800 rounded-xs" />
                      <div className="col-start-4 row-start-4 bg-slate-800 rounded-xs" />
                      <div className="col-start-5 row-start-4 bg-slate-800 rounded-xs" />
                      <div className="col-start-6 row-start-3 bg-slate-800 rounded-xs" />
                      <div className="col-start-4 row-start-6 bg-slate-800 rounded-xs" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-7 h-7 rounded-lg bg-[#16865D] text-[#F3F0E5] font-black text-[9px] flex items-center justify-center shadow-md border-2 border-white">
                          UPI
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-center gap-2 text-[10px] font-bold text-[#A8C5AC] font-mono">
                  <span className="px-2 py-0.5 rounded bg-[#10271C] border border-emerald-500/20">GPay</span>
                  <span className="px-2 py-0.5 rounded bg-[#10271C] border border-emerald-500/20">PhonePe</span>
                  <span className="px-2 py-0.5 rounded bg-[#10271C] border border-emerald-500/20">Paytm</span>
                  <span className="px-2 py-0.5 rounded bg-[#10271C] border border-emerald-500/20">BHIM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 6. Creative Download Hub (Fonts strictly removed!) */}
      <AssetHubSection />

      {/* 7. Privacy & Engineering Quality Guarantee */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5 }}
        className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
      >
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0C1E16] border border-emerald-500/25 shadow-2xl relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-[#10271C] text-[#D8B879] border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F3F0E5] tracking-tight">
            Built for Privacy. Zero Cloud Uploads.
          </h3>

          <p className="mt-3 text-sm sm:text-base text-[#A8C5AC] max-w-xl mx-auto leading-relaxed font-sans">
            Your personal photos, signatures, CTC figures, audio files, and calculations never leave your device.
            Everything is computed client-side in your own browser using modern HTML5, Web Audio, and Canvas2D standards.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-[#F3F0E5]">
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#10271C] border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No Cookies Tracking</span>
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#10271C] border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No Account Mandatory</span>
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#10271C] border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Free Forever</span>
            </span>
          </div>
        </div>
      </motion.section>

      {/* Global Command Palette */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  )
}
