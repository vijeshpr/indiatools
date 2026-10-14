import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ShieldCheck,
  Printer,
  FileText,
  Smartphone,
  ExternalLink,
  Sparkles,
  VolumeX,
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

export const HeroSection: React.FC<HeroSectionProps> = ({
  i18n,
  onOpenTerminal,
  onOpenPosterModal,
  onOpenMobileTest,
}) => {
  const shouldReduceMotion = useReducedMotion()

  const springPhysics = {
    type: 'spring' as const,
    stiffness: 380,
    damping: 28,
  }

  return (
    <section className="relative pt-6 sm:pt-10 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden no-print">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-cyan-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto text-center space-y-6">
        {/* Top Product Category Pill */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Standalone SaaS-Style Web Utility • P2P QR Drop Studio</span>
          </div>
        </div>

        {/* 4 Dedicated Visual Trust Badges */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springPhysics}
          className="flex flex-wrap items-center justify-center gap-2.5 pt-1"
        >
          {/* Badge 1: Glowing emerald badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>{i18n.trustBadges.clientSideP2P}</span>
          </div>

          {/* Badge 2: Shield badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-900/80 border border-white/10 text-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>{i18n.trustBadges.noNumberExchange}</span>
          </div>

          {/* Badge 3: Hardware badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-900/80 border border-white/10 text-slate-200">
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>{i18n.trustBadges.worksAnyPrinter}</span>
          </div>

          {/* Badge 4: Silent badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-900/80 border border-white/10 text-slate-200">
            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            <span>{i18n.trustBadges.silentPrivate}</span>
          </div>
        </motion.div>

        {/* Primary SaaS Headline */}
        <motion.h1
          initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springPhysics, delay: shouldReduceMotion ? 0 : 0.08 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
        >
          {i18n.heroHeadline}
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springPhysics, delay: shouldReduceMotion ? 0 : 0.16 }}
          className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed"
        >
          {i18n.heroSubheadline}
        </motion.p>

        {/* Quick Action Buttons */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springPhysics, delay: shouldReduceMotion ? 0 : 0.24 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-2"
        >
          {/* Quick Action: Launch Counter Station */}
          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            transition={springPhysics}
            onClick={onOpenTerminal}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/35 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{i18n.cta.launchCounter}</span>
          </motion.button>

          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            transition={springPhysics}
            onClick={onOpenPosterModal}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm bg-slate-900/90 hover:bg-slate-800/90 border border-white/10 hover:border-cyan-500/30 text-slate-200 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>{i18n.cta.downloadPoster}</span>
          </motion.button>

          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            transition={springPhysics}
            onClick={onOpenMobileTest}
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl font-medium text-xs bg-slate-950/70 hover:bg-slate-800/80 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Open customer sender interface in a new browser tab for testing"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>{i18n.cta.testMobile}</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
          </motion.button>
        </motion.div>

        {/* Dynamic Metric Stat Cards */}
        <div className="grid grid-cols-3 gap-2.5 max-w-lg mx-auto pt-4 border-t border-white/10">
          <div className="text-center p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
            <p className="text-[11px] text-slate-400">{i18n.stats.cloudLogs}</p>
            <p className="text-sm font-bold text-emerald-400">100% In-RAM</p>
          </div>
          <div className="text-center p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
            <p className="text-[11px] text-slate-400">{i18n.stats.instantPrint}</p>
            <p className="text-sm font-bold text-cyan-400">Ctrl + P Native</p>
          </div>
          <div className="text-center p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
            <p className="text-[11px] text-slate-400">{i18n.stats.zeroSetup}</p>
            <p className="text-sm font-bold text-amber-400">0 Drivers</p>
          </div>
        </div>
      </div>
    </section>
  )
}
