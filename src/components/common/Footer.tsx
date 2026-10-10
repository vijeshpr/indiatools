import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, ArrowUp } from 'lucide-react'
import { CATEGORIES } from '../../data/tools'

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative border-t border-slate-800 bg-[#0F172A] text-slate-400 overflow-hidden no-print">
      {/* Tricolor subtle top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#FF9933] via-white/50 to-[#138808]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-sm">
                IT
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                India<span className="text-indigo-400">Tools</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              "Smart tools for real-life calculations." A fast, browser-native utility platform
              for everyday automotive, civil construction, power tariffs, land area, salary, and educational cheque specimens in India.
            </p>

            {/* Privacy Badge */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 max-w-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold text-white block">100% Client-Side Privacy</span>
                <span className="text-slate-400">All calculations and photo resizing execute inside your browser. Zero cloud tracking.</span>
              </div>
            </div>
          </div>

          {/* Column: Popular Tools */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-4">
              Featured Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/calculators/indian-cheque-studio" className="hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <span>Indian Cheque Studio</span>
                  <span className="text-[9px] bg-indigo-900/80 text-indigo-300 px-1 py-0.2 rounded font-mono">13 Lang</span>
                </Link>
              </li>
              <li>
                <Link to="/calculators/jcb-fuel-cost" className="hover:text-amber-400 transition-colors">
                  JCB Diesel Cost Calculator
                </Link>
              </li>
              <li>
                <Link to="/calculators/vehicle-mileage" className="hover:text-indigo-400 transition-colors">
                  Vehicle Mileage & Fuel/Km
                </Link>
              </li>
              <li>
                <Link to="/tools/50kb-photo" className="hover:text-pink-400 transition-colors">
                  50KB Govt Exam Photo
                </Link>
              </li>
              <li>
                <Link to="/calculators/cent-to-sqft" className="hover:text-emerald-400 transition-colors">
                  Cent ↔ Sq.ft Land Converter
                </Link>
              </li>
              <li>
                <Link to="/calculators/solar-panel" className="hover:text-cyan-400 transition-colors">
                  PM Surya Ghar Solar Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Categories */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              {Object.values(CATEGORIES).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.id}`}
                    className="hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: cat.accentColor }}
                    />
                    <span>{cat.title} ({cat.subtitle})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column: Platform & Legal */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About the Project
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact & Feedback
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li className="pt-2">
                <button
                  onClick={scrollToTop}
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Back to Top</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} IndiaTools. Free open technology for India.
          </p>
          <div className="flex items-center gap-3">
            <span>Built with precision for everyday Indian calculations</span>
            <span>•</span>
            <span className="text-emerald-400">100% Client-Side Engine</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
