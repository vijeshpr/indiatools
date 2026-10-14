import React from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Zap,
  Printer,
  FileText,
  Smartphone,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import { I18nContent } from './scanToPrintI18n'
import { SupportedLanguage } from '../../types/p2pPrint'

interface HeroSectionProps {
  i18n: I18nContent
  currentLang: SupportedLanguage
  onLangChange: (lang: SupportedLanguage) => void
  onOpenTerminal: () => void
  onOpenPosterModal: () => void
  onOpenMobileTest: () => void
}

const LANGUAGES: Array<{ code: SupportedLanguage; label: string; native: string }> = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
]

export const HeroSection: React.FC<HeroSectionProps> = ({
  i18n,
  currentLang,
  onLangChange,
  onOpenTerminal,
  onOpenPosterModal,
  onOpenMobileTest,
}) => {
  return (
    <section className="relative pt-6 sm:pt-10 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden no-print">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-cyan-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto text-center space-y-6">
        {/* Top Bar with Language Switcher & Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Standalone P2P Print Studio</span>
          </div>

          {/* Language Switcher Pill */}
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onLangChange(lang.code)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  currentLang === lang.code
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang.native}
              </button>
            ))}
          </div>
        </div>

        {/* Live Status Pills */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2.5 pt-2"
        >
          {/* Green Pulsing Dot Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>{i18n.pills.p2pZeroCloud}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800/80 border border-white/10 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>{i18n.pills.noNumberSharing}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800/80 border border-white/10 text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{i18n.pills.webrtcSpeed}</span>
          </div>
        </motion.div>

        {/* Primary Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
        >
          {i18n.heroHeadline}
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed"
        >
          {i18n.heroSubheadline}
        </motion.p>

        {/* CTA Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-2"
        >
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Printer className="w-4 h-4" />
            <span>{i18n.cta.openTerminal}</span>
          </button>

          <button
            onClick={onOpenPosterModal}
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm bg-slate-800/90 hover:bg-slate-700/90 border border-white/10 hover:border-cyan-500/30 text-slate-200 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>{i18n.cta.downloadPoster}</span>
          </button>

          <button
            onClick={onOpenMobileTest}
            className="flex items-center gap-1.5 px-3.5 py-3 rounded-xl font-medium text-xs bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            title="Open test mobile sender in new tab"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>{i18n.cta.testMobile}</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
          </button>
        </motion.div>

        {/* Dynamic Stat Badges */}
        <div className="grid grid-cols-3 gap-2 max-w-lg mx-auto pt-4 border-t border-white/10">
          <div className="text-center p-2 rounded-lg bg-slate-900/40 border border-white/5">
            <p className="text-xs text-slate-400">{i18n.stats.cloudLogs}</p>
            <p className="text-sm font-bold text-emerald-400">100% In-RAM</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-slate-900/40 border border-white/5">
            <p className="text-xs text-slate-400">{i18n.stats.instantPrint}</p>
            <p className="text-sm font-bold text-cyan-400">Native Print</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-slate-900/40 border border-white/5">
            <p className="text-xs text-slate-400">{i18n.stats.zeroSetup}</p>
            <p className="text-sm font-bold text-amber-400">No App Needed</p>
          </div>
        </div>
      </div>
    </section>
  )
}
