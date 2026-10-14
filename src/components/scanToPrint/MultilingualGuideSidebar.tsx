import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Printer,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Cpu,
  Zap,
} from 'lucide-react'
import { I18nContent } from './scanToPrintI18n'
import { SupportedLanguage } from '../../types/p2pPrint'

interface MultilingualGuideSidebarProps {
  i18n: I18nContent
  currentLang: SupportedLanguage
  onLangChange: (lang: SupportedLanguage) => void
}

const LANGUAGES: Array<{ code: SupportedLanguage; label: string; native: string }> = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
]

export const MultilingualGuideSidebar: React.FC<MultilingualGuideSidebarProps> = ({
  i18n,
  currentLang,
  onLangChange,
}) => {
  const shouldReduceMotion = useReducedMotion()

  const springPhysics = {
    type: 'spring' as const,
    stiffness: 380,
    damping: 28,
  }

  return (
    <div className="w-full space-y-6 no-print">
      {/* 1. Language Selector Tabs Card */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Select Language / ഭാഷ / भाषा</span>
          </span>
          <span className="font-mono text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            5 Indian Languages
          </span>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-white/5">
          {LANGUAGES.map((lang) => {
            const isActive = currentLang === lang.code
            return (
              <button
                key={lang.code}
                onClick={() => onLangChange(lang.code)}
                className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20 border border-emerald-400/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <span className="text-xs">{lang.native}</span>
                <span className="text-[10px] opacity-70 font-normal">{lang.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Section 1: How It Works (Step-by-Step) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">{i18n.howItWorks.title}</h3>
            <p className="text-[11px] text-slate-400">{i18n.howItWorks.subtitle}</p>
          </div>
        </div>

        {/* The 4 Steps */}
        <div className="space-y-3">
          {i18n.howItWorks.steps.map((step, idx) => (
            <motion.div
              key={step.stepNumber}
              initial={shouldReduceMotion ? false : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springPhysics, delay: shouldReduceMotion ? 0 : idx * 0.05 }}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 hover:border-cyan-500/20 transition-all flex items-start gap-3 group"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-400/40 text-cyan-300 font-bold font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                {step.stepNumber}
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. Section 2: For Shopkeepers: Zero Printer Setup Guide (Crucial Info Card) */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springPhysics}
        className="relative p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#09151F] to-[#0A101D] border-2 border-emerald-500/30 backdrop-blur-xl shadow-2xl space-y-4 overflow-hidden"
      >
        {/* Subtle Ambient Radial Light */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                {i18n.zeroPrinterSetup.title}
              </h3>
              <p className="text-[11px] text-emerald-400 font-medium">
                {i18n.zeroPrinterSetup.subtitle}
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
            {i18n.zeroPrinterSetup.badge}
          </span>
        </div>

        {/* The 3 Highlighted Guarantees */}
        <div className="space-y-3 pt-1">
          {/* Bullet 1 */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/25 flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-white">
                {i18n.zeroPrinterSetup.bullet1.title}
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {i18n.zeroPrinterSetup.bullet1.desc}
              </p>
            </div>
          </div>

          {/* Bullet 2 */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/25 flex items-start gap-3">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-white">
                {i18n.zeroPrinterSetup.bullet2.title}
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {i18n.zeroPrinterSetup.bullet2.desc}
              </p>
            </div>
          </div>

          {/* Bullet 3 */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/25 flex items-start gap-3">
            <Cpu className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-white">
                {i18n.zeroPrinterSetup.bullet3.title}
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {i18n.zeroPrinterSetup.bullet3.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Supported Hardware Brands */}
        <div className="pt-3 border-t border-white/10 space-y-1.5">
          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
            Compatible Hardware Brands:
          </p>
          <p className="text-[11px] font-mono text-emerald-300/90 leading-tight">
            {i18n.zeroPrinterSetup.supportedBrands}
          </p>
          <div className="inline-flex items-center gap-1.5 text-[10px] text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>{i18n.zeroPrinterSetup.osPrintNotice}</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
