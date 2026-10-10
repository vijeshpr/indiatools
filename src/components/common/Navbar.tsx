import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Menu,
  X,
  Command,
  ArrowRight,
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

  // Track scroll position for subtle shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 no-print ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm'
            : 'bg-white/90 backdrop-blur-sm border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Brand Logo & Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 rounded-lg p-1"
            aria-label="IndiaTools Homepage"
          >
            {/* Clean Brand Icon */}
            <div className="relative w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-sm flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
              {/* Subtle tricolor top hairline */}
              <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

              {/* Toolbox icon */}
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

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-lg text-slate-900">
                  India<span className="text-indigo-600">Tools</span>
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold uppercase">
                  PRO
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-500 font-medium tracking-normal">
                Everyday Indian Digital Toolbox
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname === '/'
                  ? 'text-indigo-600 bg-indigo-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>

            <Link
              to="/tools"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname === '/tools'
                  ? 'text-indigo-600 bg-indigo-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All Tools (43)
            </Link>

            <Link
              to="/categories"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname === '/categories'
                  ? 'text-indigo-600 bg-indigo-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Categories
            </Link>

            <Link
              to="/calculators/indian-cheque-studio"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                location.pathname === '/calculators/indian-cheque-studio'
                  ? 'text-indigo-600 bg-indigo-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>Cheque Studio</span>
              <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded uppercase">
                NEW
              </span>
            </Link>

            <Link
              to="/about"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname === '/about'
                  ? 'text-indigo-600 bg-indigo-50/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              About
            </Link>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            {/* Quick Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              type="button"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all text-sm group cursor-pointer"
              aria-label="Search tools"
            >
              <Search className="w-4 h-4 text-indigo-600 group-hover:scale-105 transition-transform" />
              <span className="hidden sm:inline text-xs font-medium">Search</span>
              <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </kbd>
            </button>

            {/* Primary Action Button */}
            <Link
              to="/tools"
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <span>Explore 43 Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Light / Dark Mode Toggle */}
            <ThemeToggle />

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="md:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 bg-slate-100 border border-slate-200"
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
              className="md:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg"
            >
              <div className="flex flex-col gap-1">
                <Link
                  to="/"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-900 hover:bg-slate-100"
                >
                  Home
                </Link>
                <Link
                  to="/tools"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>All 43 Tools</span>
                  <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">43</span>
                </Link>
                <Link
                  to="/calculators/indian-cheque-studio"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 flex items-center justify-between"
                >
                  <span>🖋️ Indian Cheque Studio</span>
                  <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-mono font-bold">13 Lang</span>
                </Link>
                <Link
                  to="/categories"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Tool Categories
                </Link>
                <Link
                  to="/calculators/jcb-fuel-cost"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>🚜 JCB Fuel Calculator</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Flagship</span>
                </Link>
                <Link
                  to="/tools/50kb-photo"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span>📄 50KB Photo Resizer</span>
                  <span className="text-[10px] bg-pink-100 text-pink-800 px-1.5 py-0.5 rounded">Govt Exam</span>
                </Link>
                <Link
                  to="/about"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  About Platform
                </Link>
              </div>

              {/* Categories list in mobile menu */}
              <div className="pt-2 border-t border-slate-200">
                <p className="text-[11px] font-mono uppercase text-slate-400 px-3 mb-1">
                  Categories
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.values(CATEGORIES).map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.id}`}
                      className="flex items-center gap-2 p-2 rounded-lg text-xs text-slate-700 hover:bg-slate-100"
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
