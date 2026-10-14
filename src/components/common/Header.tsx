import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Menu,
  X,
  Command,
  ArrowRight,
  Sparkles,
  Layers,
  Wrench,
  PenTool,
} from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { CommandPalette } from './CommandPalette'
import { LanguageSelector } from './LanguageSelector'
import { CATEGORIES, TOOLS } from '../../data/tools'
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
      // Don't trigger if user is typing in an input or textarea
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

  // Track scroll position for subtle depth
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
              ? 'bg-[#090A0F]/90 dark:bg-[#090A0F]/90 backdrop-blur-2xl border border-white/[0.12] shadow-2xl shadow-black/50'
              : 'bg-[#11131F]/80 dark:bg-[#11131F]/80 backdrop-blur-xl border border-white/[0.08] shadow-lg shadow-black/20'
          }`}
        >
          <div className="px-3.5 sm:px-5 h-16 flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Brand Mark & Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-xl p-1"
              aria-label="IndiaTools Homepage"
            >
              {/* Brand Icon with Indian tricolor micro hairline */}
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-600 text-white shadow-md shadow-indigo-600/30 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 border border-white/20">
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-white"
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
                <span className="font-extrabold tracking-tight text-lg text-white font-sans">
                  India<span className="text-cyan-400">Tools</span>
                </span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 font-bold uppercase tracking-wider">
                  PRO
                </span>
              </div>
            </Link>

            {/* Center: Main Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  location.pathname === '/'
                    ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {t('nav.home', 'Home')}
              </Link>

              <Link
                to="/tools"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  location.pathname === '/tools'
                    ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {t('nav.allTools', 'Explore Tools')}
              </Link>

              <a
                href="#creative-assets"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors flex items-center gap-1.5"
              >
                <span>Creative Hub</span>
                <span className="text-[9px] font-mono font-bold bg-violet-950 text-violet-300 border border-violet-800 px-1.5 py-0.2 rounded uppercase">
                  NEW
                </span>
              </a>

              <Link
                to="/categories"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  location.pathname === '/categories'
                    ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {t('nav.categories', 'Categories')}
              </Link>

              <Link
                to="/calculators/indian-cheque-studio"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  location.pathname.includes('indian-cheque-studio')
                    ? 'text-cyan-300 bg-cyan-500/15 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span>Cheque Studio</span>
                <span className="text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded uppercase">
                  13 Lang
                </span>
              </Link>
            </nav>

            {/* Right: Search, Language, Theme, Mobile Hamburger */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Raycast Command Palette Shortcut Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                type="button"
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-slate-300 hover:text-white transition-all text-xs font-mono group cursor-pointer"
                aria-label="Search tools with Command Palette (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline font-sans text-xs">{t('nav.search', 'Search')}</span>
                <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-slate-400 bg-black/40 px-1.5 py-0.5 rounded border border-white/[0.08]">
                  <Command className="w-2.5 h-2.5" />
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
                className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-white/[0.05] border border-white/[0.1] cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden border-t border-white/[0.08] px-4 py-3 space-y-3 bg-[#090A0F]/95 rounded-b-2xl"
              >
                <div className="flex flex-col gap-1">
                  <Link
                    to="/"
                    className="px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/[0.05]"
                  >
                    {t('nav.home', 'Home')}
                  </Link>
                  <Link
                    to="/tools"
                    className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/[0.05] flex items-center justify-between"
                  >
                    <span>{t('nav.allTools', 'Explore All Tools')}</span>
                    <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      {TOOLS.length}
                    </span>
                  </Link>
                  <a
                    href="#creative-assets"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-violet-300 hover:bg-white/[0.05] flex items-center justify-between"
                  >
                    <span>🎨 Creative Asset Hub</span>
                    <span className="text-[10px] font-mono font-bold bg-violet-950 text-violet-300 border border-violet-800 px-1.5 py-0.5 rounded">
                      Free Downloads
                    </span>
                  </a>
                  <Link
                    to="/calculators/indian-cheque-studio"
                    className="px-3 py-2 rounded-lg text-sm font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-800/60 flex items-center justify-between"
                  >
                    <span>🖋️ {t('nav.chequeStudio', 'Indian Cheque Studio')}</span>
                    <span className="text-[10px] bg-cyan-600 text-black px-1.5 py-0.5 rounded font-mono font-bold">
                      13 Lang
                    </span>
                  </Link>
                  <Link
                    to="/categories"
                    className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/[0.05]"
                  >
                    {t('nav.categories', 'Categories')}
                  </Link>
                  <Link
                    to="/about"
                    className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/[0.05]"
                  >
                    {t('nav.about', 'About the Engineering Platform')}
                  </Link>
                </div>

                {/* Category quick links */}
                <div className="pt-2 border-t border-white/[0.06]">
                  <p className="text-[10px] font-mono uppercase text-slate-500 px-3 mb-1.5">
                    Categories
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {Object.values(CATEGORIES).map((cat) => {
                      const count = TOOLS.filter((t) => t.category === cat.id).length
                      return (
                        <Link
                          key={cat.id}
                          to={`/category/${cat.id}`}
                          className="flex items-center justify-between p-2 rounded-lg text-xs text-slate-300 hover:bg-white/[0.05]"
                        >
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.accentColor }} />
                            <span>{cat.title}</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">{count}</span>
                        </Link>
                      )
                    })}
                  </div>
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
