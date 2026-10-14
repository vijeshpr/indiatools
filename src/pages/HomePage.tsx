import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Lock,
  CheckCircle2,
  QrCode,
  Sparkles,
  Store,
  Compass,
  FileCheck,
} from 'lucide-react'
import { Hero } from '../components/home/Hero'
import { CategoryNav } from '../components/home/CategoryNav'
import { FeaturedToolsSection } from '../components/home/FeaturedToolsSection'
import { StudioFeatureSection } from '../components/home/StudioFeatureSection'
import { ToolGrid } from '../components/home/ToolGrid'
import { AssetHubSection } from '../components/home/AssetHubSection'
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

  // Filter tools based on selected category with alias mapping
  const filteredTools = useMemo(() => {
    if (selectedCategory === 'all') {
      return TOOLS
    }
    return TOOLS.filter((tool) => {
      if (tool.category === selectedCategory) return true
      if (selectedCategory === 'utilities' && ['drive', 'build', 'power', 'land', 'work'].includes(tool.category)) return true
      if (selectedCategory === 'image' && tool.category === 'create' && (tool.slug.includes('photo') || tool.slug.includes('compressor') || tool.slug.includes('watermark') || tool.slug.includes('scanner') || tool.slug.includes('pixel') || tool.slug.includes('clear'))) return true
      if (selectedCategory === 'audio' && (tool.category === 'create' || tool.category === 'audio') && (tool.slug.includes('audio') || tool.slug.includes('reverb') || tool.slug.includes('bass') || tool.slug.includes('surround'))) return true
      if (selectedCategory === 'video' && tool.slug.includes('spectrum')) return true
      if (selectedCategory === 'pdf' && (tool.slug.includes('pdf') || tool.slug.includes('print') || tool.slug.includes('qr'))) return true
      if (selectedCategory === 'security' && (tool.slug.includes('vault') || tool.slug.includes('watermark') || tool.slug.includes('tracer'))) return true
      if (selectedCategory === 'developer' && (tool.slug.includes('ai-token') || tool.slug.includes('experience'))) return true
      return false
    })
  }, [selectedCategory])

  const handleResetFilters = () => {
    setSelectedCategory('all')
  }

  return (
    <div className="relative overflow-hidden selection:bg-emerald-600 selection:text-white">
      {/* 1. Cinematic 3D Botanical Hero Section with Roses, Chendumalli, Jasmine & Climbing Vines */}
      <Hero onOpenSearch={() => setIsSearchOpen(true)} />

      {/* 2. Sticky Category Filter Bar */}
      <CategoryNav
        activeCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        totalFilteredCount={filteredTools.length}
        hasActiveFilters={selectedCategory !== 'all'}
        onResetFilters={handleResetFilters}
      />

      {/* 3. Featured & Popular Flagship Tools Section */}
      <FeaturedToolsSection />

      {/* 4. Complete Tool Directory Grid */}
      <section id="garden-catalogue" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D2418] border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold uppercase tracking-wider mb-2.5">
              <span>EXPLORE ALL BROWSER TOOLS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex flex-wrap items-center gap-3">
              <span>Complete Tool Directory</span>
              <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-[#122E21] text-amber-300 border border-amber-400/30">
                {filteredTools.length} of {TOOLS.length} Available
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-1 font-sans">
              Every tool operates 100% inside your browser. No mandatory accounts, cookies, or cloud uploads.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="self-start sm:self-end flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#0F281D] hover:bg-[#153628] border border-emerald-500/25 text-xs font-mono text-slate-200 hover:text-white transition-colors cursor-pointer shadow-md"
          >
            <span>Command Palette</span>
            <kbd className="px-1.5 py-0.5 rounded bg-black/50 text-[10px] text-amber-300 font-bold">Ctrl+K</kbd>
          </button>
        </div>

        <ToolGrid tools={filteredTools} onResetFilters={handleResetFilters} />
      </section>

      {/* 5. Dedicated Audio & Studio Feature Section */}
      <StudioFeatureSection />

      {/* 6. Creative Download Hub (Strict Zero-Font Mandate!) */}
      <div id="creative-hub">
        <AssetHubSection />
      </div>

      {/* 7. Flagship Fintech Spotlight: Indian Cheque Studio in 13 Indian Languages */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5 }}
        className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-gradient-to-br from-[#0F281E] via-[#091C14] to-[#06140D] border border-emerald-500/30 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-400/8 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Column: Context & Benefits */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-950 text-amber-300 border border-emerald-800">
                  ★ FEATURED FINTECH TOOL
                </span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#102B1E] text-emerald-400 border border-emerald-700">
                  VERIFIED
                </span>
                <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#06150E] text-slate-300 border border-emerald-500/20">
                  CTS-2010 SPECIMEN
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Indian Cheque Studio
                <span className="block text-xl sm:text-2xl font-bold text-amber-300 mt-1.5">
                  Interactive Cheque Demo in 13 Indian Languages
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-sans">
                Master cheque-filling with zero mistakes. Generate authentic CTS-2010 specimen cheques,
                convert numeric rupees into flawless words across 13 Indian languages, simulate Account Payee crossings,
                and export high-fidelity A4 specimen printouts.
              </p>

              {/* Supported Indian Languages Ribbon */}
              <div className="pt-2">
                <span className="text-xs font-mono uppercase text-amber-300 block mb-2 font-bold">
                  Supported Regional Scripts:
                </span>
                <div className="flex flex-wrap gap-1.5 text-xs font-medium text-white">
                  {['English', 'हिन्दी', 'தமிழ்', 'മലയാളം', 'తెలుగు', 'ಕನ್ನಡ', 'বাংলা', 'मराठी', 'ગુજરાતી', 'ਪੰਜਾਬੀ', 'ଓଡ଼ିଆ', 'অসমীয়া', 'اردو'].map((langName) => (
                    <span
                      key={langName}
                      className="px-2.5 py-1 rounded-lg bg-[#0F281D] border border-emerald-500/25 text-slate-200 font-medium"
                    >
                      {langName}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to="/calculators/indian-cheque-studio"
                  className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-emerald-950/60 transition-all cursor-pointer group hover:scale-[1.02]"
                >
                  <span>Explore Cheque Studio</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>

                <span className="text-xs font-mono text-emerald-400/90">
                  100% Free • Non-Negotiable Specimen Training
                </span>
              </div>
            </div>

            {/* Right Column: Visual Mini Specimen Illustration */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[340px] sm:max-w-[400px] rounded-2xl border border-slate-300 bg-[#FAFBFB] text-slate-900 shadow-2xl overflow-hidden font-serif select-none relative p-4 text-xs">
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
                    <div className="border border-slate-800 bg-white rounded px-2 py-0.5 shadow-xs">
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

      {/* 8. Flagship Spotlight 2: UPI QR Code & Shop Standee Poster */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5 }}
        className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-gradient-to-br from-[#0F281E] via-[#091C14] to-[#06140D] border border-emerald-500/30 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-emerald-950 text-amber-300 border border-emerald-800 flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-amber-300" />
                  <span>★ NEW CREATE TOOL</span>
                </span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#102B1E] text-emerald-400 border border-emerald-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PRINT READY</span>
                </span>
                <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#06150E] text-slate-300 border border-emerald-500/20">
                  A4 / A5 STANDEE
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                UPI QR Code Generator with Logo
                <span className="block text-xl sm:text-2xl font-bold text-amber-300 mt-1.5">
                  & Printable Merchant Counter Stand Posters
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-sans">
                Create high-resolution payment QR codes for Google Pay, PhonePe, and Paytm with your custom shop logo,
                fixed or open payment amounts, and transaction notes. Print authentic counter standee cards (A5 acrylic)
                or shop wall posters (A4) directly from your browser with zero registration.
              </p>

              <div className="pt-2">
                <span className="text-xs font-mono uppercase text-amber-300 block mb-2 font-bold">
                  Supported QR Formats:
                </span>
                <div className="flex flex-wrap gap-1.5 text-xs font-medium text-white">
                  {['UPI Payment Deep Link', 'Shop Logo Overlay', 'Website URL', 'WhatsApp Chat', 'Wi-Fi Auto-Connect', 'SVG Vector Export', 'Printable A5/A4 Standee'].map((badge) => (
                    <span
                      key={badge}
                      className="px-2.5 py-1 rounded-lg bg-[#0F281D] border border-emerald-500/25 text-slate-200 font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to="/calculators/qr-code-generator"
                  className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-emerald-950/60 transition-all cursor-pointer group hover:scale-[1.02]"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Create UPI QR & Poster</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>

                <span className="text-xs font-mono text-emerald-400/90">
                  100% Client-Side • Instant Vector SVG & PNG
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[280px] sm:max-w-[320px] rounded-3xl border border-emerald-500/30 bg-[#071710] shadow-2xl text-center p-6 space-y-4 select-none relative group hover:scale-[1.02] transition-transform">
                <div className="flex items-center justify-center gap-1.5 py-1 px-3 rounded-full bg-[#102B1E] border border-emerald-500/25 text-xs font-bold text-amber-300 font-mono">
                  <Store className="w-3.5 h-3.5 text-amber-300" />
                  <span>MERCHANT STANDEE SPECIMEN</span>
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-base font-black text-white tracking-tight">
                    ANAND GENERAL STORE
                  </h4>
                  <p className="text-xs font-mono text-slate-400">
                    Scan to pay with any UPI App
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-black border border-emerald-500/25 inline-block shadow-inner">
                  <div className="w-38 h-38 bg-white rounded-xl p-2.5 flex items-center justify-center relative border border-slate-200">
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
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center shadow-md border-2 border-white">
                          UPI
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-300 font-mono">
                  <span className="px-2 py-0.5 rounded bg-[#102B1E] border border-emerald-500/20">GPay</span>
                  <span className="px-2 py-0.5 rounded bg-[#102B1E] border border-emerald-500/20">PhonePe</span>
                  <span className="px-2 py-0.5 rounded bg-[#102B1E] border border-emerald-500/20">Paytm</span>
                  <span className="px-2 py-0.5 rounded bg-[#102B1E] border border-emerald-500/20">BHIM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 9. Privacy & Engineering Quality Guarantee */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.5 }}
        className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
      >
        <div className="p-8 sm:p-12 lg:p-14 rounded-3xl bg-gradient-to-br from-[#0F281E] via-[#091C14] to-[#06140D] border border-emerald-500/30 shadow-2xl relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-[#102B1E] text-amber-300 border border-emerald-500/35 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for Privacy. Zero Cloud Uploads.
          </h3>

          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-sans">
            Your personal photos, signatures, CTC figures, audio files, and calculations never leave your device.
            Everything is computed client-side in your own browser using modern HTML5, Web Audio, and Canvas2D standards.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 text-xs font-mono text-white">
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#102B1E] border border-emerald-500/25">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No Cookies Tracking</span>
            </span>
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#102B1E] border border-emerald-500/25">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No Account Mandatory</span>
            </span>
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#102B1E] border border-emerald-500/25">
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
