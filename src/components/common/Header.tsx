import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Menu,
  X,
  Command,
  Compass,
  Sparkles,
  Info,
  ShieldCheck,
  Languages,
} from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { CommandPalette } from './CommandPalette'
import { LanguageSelector } from './LanguageSelector'
import { TOOLS } from '../../data/tools'
import { useI18n } from '../../i18n/I18nContext'

export const Header: React.FC = () => {
  const { t } = useI18n()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Track scroll position for subtle elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header className="sticky top-2 sm:top-3 z-40 w-full px-3 sm:px-6 lg:px-8 no-print">
        <div
          className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${
            isScrolled
              ? 'bg-[#07130E]/95 backdrop-blur-2xl border border-emerald-500/25 shadow-2xl shadow-emerald-950/60'
              : 'bg-[#10271C]/90 backdrop-blur-xl border border-emerald-500/20 shadow-lg shadow-emerald-950/30'
          }`}
        >
          <div className="px-3.5 sm:px-5 h-16 flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Brand Mark & Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B879] rounded-xl p-1 shrink-0"
              aria-label="IndiaTools Homepage"
            >
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#16865D] via-[#10271C] to-[#07130E] text-[#F3F0E5] shadow-md shadow-emerald-900/40 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 border border-emerald-500/30">
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-[#F3F0E5]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  <line x1="12" y1="12" x2="12" y2="12.01" />
                  <path d="M7 12h3" />
                  <path d="M14 12h3" />
                </svg>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-lg text-[#F3F0E5] font-sans">
                  India<span className="text-[#D8B879]">Tools</span>
                </span>
                <span className="hidden sm:inline-block font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#10271C] text-[#D8B879] border border-[#D8B879]/30 font-bold uppercase tracking-wider">
                  GARDEN
                </span>
              </div>
            </Link>

            {/* Center: Global Navigation Only (No category clutter) */}
            <nav className="hidden md:flex items-center gap-1.5">
              <Link
                to="/"
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  location.pathname === '/'
                    ? 'text-[#D8B879] bg-[#16865D]/30 border border-[#D8B879]/40'
                    : 'text-[#A8C5AC] hover:text-[#F3F0E5] hover:bg-white/[0.04]'
                }`}
              >
                {t('nav.home', 'Home')}
              </Link>

              <Link
                to="/tools"
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  location.pathname === '/tools'
                    ? 'text-[#D8B879] bg-[#16865D]/30 border border-[#D8B879]/40'
                    : 'text-[#A8C5AC] hover:text-[#F3F0E5] hover:bg-white/[0.04]'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-[#D8B879]" />
                <span>{t('nav.allTools', 'Explore Tools')}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-[#D8B879]">
                  {TOOLS.length}
                </span>
              </Link>

              <a
                href="#creative-assets"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#A8C5AC] hover:text-[#F3F0E5] hover:bg-white/[0.04] transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Creative Hub</span>
              </a>

              <Link
                to="/about"
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  location.pathname === '/about'
                    ? 'text-[#D8B879] bg-[#16865D]/30 border border-[#D8B879]/40'
                    : 'text-[#A8C5AC] hover:text-[#F3F0E5] hover:bg-white/[0.04]'
                }`}
              >
                {t('nav.about', 'About')}
              </Link>

              <Link
                to="/privacy"
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  location.pathname === '/privacy'
                    ? 'text-[#D8B879] bg-[#16865D]/30 border border-[#D8B879]/40'
                    : 'text-[#A8C5AC] hover:text-[#F3F0E5] hover:bg-white/[0.04]'
                }`}
              >
                Privacy
              </Link>
            </nav>

            {/* Right: Search, Language, Theme, Mobile Hamburger */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Raycast Command Palette Shortcut Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                type="button"
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#07130E]/80 hover:bg-[#163628] border border-emerald-500/25 text-[#A8C5AC] hover:text-[#F3F0E5] transition-all text-xs font-mono group cursor-pointer shadow-xs"
                aria-label="Search tools with Command Palette (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-[#D8B879] group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline font-sans text-xs">{t('nav.search', 'Search')}</span>
                <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-[#D8B879] bg-black/40 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  <Command className="w-2.5 h-2.5 text-[#A8C5AC]" />
                  <span>K</span>
                </kbd>
              </button>

              {/* Language Selector */}
              <LanguageSelector compact={true} />

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                type="button"
                className="md:hidden p-2 rounded-xl text-[#A8C5AC] hover:text-[#F3F0E5] bg-[#10271C] border border-emerald-500/20 cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Global Drawer */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden border-t border-emerald-500/20 px-4 py-3 space-y-2 bg-[#07130E]/98 rounded-b-2xl"
              >
                <div className="flex flex-col gap-1">
                  <Link
                    to="/"
                    className="px-3 py-2 rounded-lg text-sm font-medium text-[#F3F0E5] hover:bg-white/[0.05]"
                  >
                    {t('nav.home', 'Home')}
                  </Link>

                  <Link
                    to="/tools"
                    className="px-3 py-2 rounded-lg text-sm font-medium text-[#A8C5AC] hover:bg-white/[0.05] flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#D8B879]" />
                      <span>{t('nav.allTools', 'Explore All Garden Tools')}</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-[#D8B879] bg-[#10271C] px-2 py-0.5 rounded border border-emerald-500/30">
                      {TOOLS.length}
                    </span>
                  </Link>

                  <Link
                    to="/all-tools"
                    className="px-3 py-2 rounded-lg text-sm font-medium text-[#A8C5AC] hover:bg-white/[0.05] flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Languages className="w-4 h-4 text-[#10B981]" />
                      <span>22 Languages Directory</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-[#D8B879] bg-[#10271C] px-2 py-0.5 rounded border border-emerald-500/30">
                      22
                    </span>
                  </Link>

                  <a
                    href="#creative-assets"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-[#D8B879] hover:bg-white/[0.05] flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#10B981]" />
                    <span>Creative Hub</span>
                  </a>

                  <Link
                    to="/about"
                    className="px-3 py-2 rounded-lg text-sm font-medium text-[#A8C5AC] hover:bg-white/[0.05] flex items-center gap-2"
                  >
                    <Info className="w-4 h-4 text-[#D8B879]" />
                    <span>{t('nav.about', 'About IndiaTools')}</span>
                  </Link>

                  <Link
                    to="/privacy"
                    className="px-3 py-2 rounded-lg text-sm font-medium text-[#A8C5AC] hover:bg-white/[0.05] flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    <span>Client-Side Privacy</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Global Raycast Command Palette Modal */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
