import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Menu,
  X,
  Sparkles,
  Command,
} from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { SearchModal } from './SearchModal'
import { CATEGORIES } from '../../data/tools'

export const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Track scroll position for header blur refinement
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#080A10]/85 dark:bg-[#080A10]/90 light:bg-white/90 backdrop-blur-xl border-b border-neutral-800/80 light:border-slate-200/80 shadow-lg shadow-black/5'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
            aria-label="India Practical Tools Homepage"
          >
            {/* Custom geometric toolbox symbol */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-950 border border-neutral-700/80 shadow-md flex items-center justify-center overflow-hidden group-hover:border-amber-500/50 transition-colors">
              {/* Subtle tricolor edge accent */}
              <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

              {/* Toolbox geometric icon */}
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-amber-400 group-hover:scale-105 transition-transform"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                <line x1="12" y1="12" x2="12" y2="12.01" />
                <path d="M7 12h3" />
                <path d="M14 12h3" />
              </svg>

              {/* Ashoka blue center precision dot */}
              <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-[#000080] dark:bg-[#4B6BFB] ring-1 ring-white/50" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-base sm:text-lg bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-100 to-neutral-300 dark:from-white dark:to-neutral-300 light:from-slate-900 light:to-slate-800">
                  INDIA PRACTICAL
                </span>
                <span className="font-mono text-xs px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                  TOOLS
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-neutral-400 dark:text-neutral-400 light:text-slate-500 font-medium tracking-wide">
                Real-life problems. One simple toolbox.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/tools"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/tools'
                  ? 'text-amber-400 bg-amber-500/10'
                  : 'text-neutral-300 dark:text-neutral-300 light:text-slate-700 hover:text-white dark:hover:text-white hover:bg-neutral-800/40'
              }`}
            >
              All Tools (15+)
            </Link>

            <Link
              to="/calculators/jcb-fuel-cost"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-300 dark:text-neutral-300 light:text-slate-700 hover:text-white dark:hover:text-white hover:bg-neutral-800/40 transition-colors flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>JCB Cost</span>
            </Link>

            <Link
              to="/tools/50kb-photo"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-300 dark:text-neutral-300 light:text-slate-700 hover:text-white dark:hover:text-white hover:bg-neutral-800/40 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>50KB Resizer</span>
            </Link>

            <Link
              to="/about"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/about'
                  ? 'text-amber-400 bg-amber-500/10'
                  : 'text-neutral-300 dark:text-neutral-300 light:text-slate-700 hover:text-white dark:hover:text-white hover:bg-neutral-800/40'
              }`}
            >
              About
            </Link>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            {/* Spotlight Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              type="button"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900/80 dark:bg-neutral-900/90 light:bg-slate-100 border border-neutral-700/70 light:border-slate-300 text-neutral-300 dark:text-neutral-300 light:text-slate-700 hover:border-amber-500/50 hover:text-white transition-all text-sm group"
              aria-label="Search tools"
            >
              <Search className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-xs text-neutral-400 dark:text-neutral-400">Search</span>
              <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] font-mono text-neutral-400 bg-neutral-800/80 dark:bg-neutral-800 light:bg-slate-200 px-1.5 py-0.5 rounded border border-neutral-700/60 light:border-slate-300">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </kbd>
            </button>

            {/* Dark / Light Mode Toggle */}
            <ThemeToggle />

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="md:hidden p-2 rounded-xl text-neutral-300 hover:text-white bg-neutral-900/60 border border-neutral-800"
              aria-label="Open navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-neutral-800 bg-[#080A10]/95 backdrop-blur-2xl px-4 py-4 space-y-3"
            >
              <div className="flex flex-col gap-1">
                <Link
                  to="/"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-neutral-800"
                >
                  Home
                </Link>
                <Link
                  to="/tools"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-800"
                >
                  All 15+ Tools
                </Link>
                <Link
                  to="/calculators/jcb-fuel-cost"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-amber-400 hover:bg-neutral-800 flex items-center justify-between"
                >
                  <span>🚜 JCB Fuel Calculator</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">Flagship</span>
                </Link>
                <Link
                  to="/tools/50kb-photo"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-pink-400 hover:bg-neutral-800 flex items-center justify-between"
                >
                  <span>📄 50KB Photo Resizer</span>
                  <span className="text-[10px] bg-pink-500/20 text-pink-400 px-1.5 py-0.5 rounded">Govt Exam</span>
                </Link>
                <Link
                  to="/calculators/solar-panel"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-800"
                >
                  ⚡ PM Surya Ghar Solar
                </Link>
                <Link
                  to="/calculators/cent-to-sqft"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-800"
                >
                  📐 Cent ↔ Sq.ft Converter
                </Link>
                <Link
                  to="/about"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:bg-neutral-800"
                >
                  About Platform
                </Link>
              </div>

              {/* Categories list in mobile menu */}
              <div className="pt-2 border-t border-neutral-800/80">
                <p className="text-[11px] font-mono uppercase text-neutral-400 px-3 mb-1">
                  Categories
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.values(CATEGORIES).map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.id}`}
                      className="flex items-center gap-2 p-2 rounded-lg text-xs text-neutral-300 hover:bg-neutral-800/60"
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.accentColor }} />
                      <span>{cat.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
