import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, ArrowUp, Cpu, Heart, CheckCircle2 } from 'lucide-react'
import { CATEGORIES, TOOLS } from '../../data/tools'
import { useI18n } from '../../i18n/I18nContext'

export const Footer: React.FC = () => {
  const { t } = useI18n()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Calculate dynamic category counts
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {}
    Object.keys(CATEGORIES).forEach((k) => {
      map[k] = TOOLS.filter((t) => t.category === k).length
    })
    return map
  }, [])

  return (
    <footer className="relative border-t border-emerald-500/20 bg-[#07130E] text-[#A8C5AC] overflow-hidden no-print">
      {/* Precision tricolor top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#FF9933] via-white/40 to-[#138808]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Column 1: Brand & Living Garden Mission */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#16865D] via-[#10271C] to-[#07130E] text-[#F3F0E5] font-bold text-sm flex items-center justify-center shadow-md border border-emerald-500/30">
                IT
              </div>
              <span className="font-extrabold text-lg text-[#F3F0E5] tracking-tight font-sans">
                India<span className="text-[#D8B879]">Tools</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-[#A8C5AC] leading-relaxed font-sans">
              Where Technology Comes Alive. A cinematic digital garden uniting everyday automotive, civil construction, power tariffs, land area, audio, and visual utilities.
            </p>

            {/* Privacy Badge */}
            <div className="p-3 rounded-xl bg-[#10271C] border border-emerald-500/20 text-xs text-[#F3F0E5] space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#D8B879]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Client-Side Privacy</span>
              </div>
              <p className="text-[11px] text-[#A8C5AC] font-sans leading-tight">
                Designed for efficient browser-based workflows. Photos, audio, and documents never leave your device.
              </p>
            </div>
          </div>

          {/* Column 2: Popular Tools */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F3F0E5] font-bold mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D8B879]" />
              <span>Popular Garden Tools</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-sans">
              <li>
                <Link
                  to="/calculators/indian-cheque-studio"
                  className="hover:text-[#D8B879] transition-colors flex items-center justify-between group"
                >
                  <span>Indian Cheque Studio</span>
                  <span className="text-[9px] font-mono bg-emerald-950 text-[#D8B879] px-1.5 py-0.2 rounded border border-emerald-800">
                    13 Lang
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/calculators/jcb-fuel-cost"
                  className="hover:text-[#D8B879] transition-colors flex items-center justify-between"
                >
                  <span>JCB Diesel Cost Calculator</span>
                  <span className="text-[9px] font-mono bg-[#10271C] text-[#D8B879] px-1.5 py-0.2 rounded border border-[#D8B879]/30">
                    3DX
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/tools/50kb-photo"
                  className="hover:text-[#D8B879] transition-colors flex items-center justify-between"
                >
                  <span>50KB Photo Resizer</span>
                  <span className="text-[9px] font-mono bg-[#10271C] text-[#A8C5AC] px-1.5 py-0.2 rounded border border-emerald-500/20">
                    UPSC/SSC
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/tools/fast-inpainting-watermark-remover"
                  className="hover:text-[#D8B879] transition-colors flex items-center justify-between"
                >
                  <span>Inpainting Watermark Remover</span>
                  <span className="text-[9px] font-mono bg-[#10271C] text-[#D8B879] px-1.5 py-0.2 rounded border border-emerald-500/20">
                    AI
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/calculators/cent-to-sqft" className="hover:text-[#D8B879] transition-colors">
                  Cent ↔ Sq.ft Land Converter
                </Link>
              </li>
              <li>
                <Link to="/calculators/solar-panel" className="hover:text-[#D8B879] transition-colors">
                  PM Surya Ghar Solar Calculator
                </Link>
              </li>
              <li>
                <Link to="/tools/orbit-audio-studio" className="hover:text-[#D8B879] transition-colors">
                  Orbit Audio Studio & Reverb
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Indian Utility Categories */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              <span>Utility Categories</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-sans">
              {Object.values(CATEGORIES).map((cat) => {
                const count = categoryCounts[cat.id] || 0
                return (
                  <li key={cat.id}>
                    <Link
                      to={`/category/${cat.id}`}
                      className="hover:text-white transition-colors flex items-center justify-between group"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: cat.accentColor }}
                        />
                        <span>{cat.title}</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-300">
                        {count} tools
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Column 4: Language & Platform */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Language & Platform</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-sans">
              <li>
                <Link to="/calculators/indian-cheque-studio/ml" className="hover:text-cyan-300 transition-colors">
                  മലയാളം (Malayalam)
                </Link>
              </li>
              <li>
                <Link to="/calculators/indian-cheque-studio/hi" className="hover:text-cyan-300 transition-colors">
                  हिन्दी (Hindi)
                </Link>
              </li>
              <li>
                <Link to="/calculators/indian-cheque-studio/ta" className="hover:text-cyan-300 transition-colors">
                  தமிழ் (Tamil)
                </Link>
              </li>
              <li>
                <Link to="/calculators/indian-cheque-studio/te" className="hover:text-cyan-300 transition-colors">
                  తెలుగు (Telugu)
                </Link>
              </li>
              <li className="pt-1 border-t border-white/[0.04]">
                <Link to="/about" className="hover:text-white transition-colors">
                  About Platform
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
                  type="button"
                  onClick={scrollToTop}
                  className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Back to Top</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Truthful Engineering Statement */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <p>
            © {new Date().getFullYear()} IndiaTools. Precision tools for real calculations.
          </p>

          <div className="flex items-center gap-2 text-slate-400">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Designed for efficient browser-based workflows • 100% Client-Side Engine</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
