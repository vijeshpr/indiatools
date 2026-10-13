import React, { useState, useRef, useEffect } from 'react'
import {
  WatermarkLocale,
  WATERMARK_LOCALES,
  ALL_WATERMARK_LOCALES,
} from '../../lib/watermarker/i18n/locales'
import { Globe, Search, Check, ChevronDown } from 'lucide-react'

interface LanguageSelectorProps {
  currentLocale: WatermarkLocale
  onLocaleChange: (locale: WatermarkLocale) => void
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLocale,
  onLocaleChange,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const activeMeta = WATERMARK_LOCALES[currentLocale] || WATERMARK_LOCALES.en

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  const filteredLocales = ALL_WATERMARK_LOCALES.filter((loc) => {
    const meta = WATERMARK_LOCALES[loc]
    const q = search.toLowerCase().trim()
    if (!q) return true
    return (
      meta.name.toLowerCase().includes(q) ||
      meta.nativeName.toLowerCase().includes(q) ||
      meta.code.toLowerCase().includes(q) ||
      meta.script.toLowerCase().includes(q)
    )
  })

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 text-slate-200 transition-all shadow-sm group focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
        title="Select Language (22 Indian Scheduled Languages + English)"
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
        <span className="text-xs font-semibold tracking-wide text-slate-100">
          {activeMeta.nativeName}
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-mono uppercase">
          {activeMeta.code}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-slate-800 shadow-2xl shadow-cyan-950/40 z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2 border-b border-slate-800/80 mb-1">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search language or script..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
              />
            </div>
            <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-400">
              <span>All 22 Indian Scheduled Languages</span>
              <span className="font-mono text-cyan-400">23 Locales</span>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-0.5 pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            {filteredLocales.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                No matching languages found
              </div>
            ) : (
              filteredLocales.map((loc) => {
                const meta = WATERMARK_LOCALES[loc]
                const isSelected = loc === currentLocale
                return (
                  <button
                    key={loc}
                    onClick={() => {
                      onLocaleChange(loc)
                      setIsOpen(false)
                      setSearch('')
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-medium'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-semibold text-slate-100 truncate text-[13px]">
                        {meta.nativeName}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate">
                        ({meta.name})
                      </span>
                      {meta.dir === 'rtl' && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                          RTL
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        {meta.code}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
