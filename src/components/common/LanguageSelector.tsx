import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { SUPPORTED_LOCALES, ALL_LOCALE_CODES, isValidLocale } from '../../i18n/locales'
import type { SupportedLocale } from '../../i18n/locales'
import { useI18n } from '../../i18n/I18nContext'

interface LanguageSelectorProps {
  currentToolSlug?: string
  compact?: boolean
  className?: string
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentToolSlug,
  compact = false,
  className = '',
}) => {
  const { locale, setLocale, localeMeta } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectLanguage = (targetLocale: SupportedLocale) => {
    setLocale(targetLocale)
    setIsOpen(false)

    // Route resolution: If we are on a multilingual tool, navigate to its localized path
    if (currentToolSlug === 'gold-exchange-calculator') {
      const targetPath = targetLocale === 'en'
        ? '/tools/gold-exchange-calculator'
        : `/${targetLocale}/tools/gold-exchange-calculator`
      navigate(targetPath)
    } else if (currentToolSlug === 'indian-cheque-studio') {
      const targetPath = targetLocale === 'en'
        ? '/calculators/indian-cheque-studio'
        : `/calculators/indian-cheque-studio/${targetLocale}`
      navigate(targetPath)
    }
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
          isOpen
            ? 'bg-amber-500/10 border-amber-500/40 text-amber-500 dark:text-amber-400'
            : 'bg-white/80 dark:bg-zinc-900/80 hover:bg-slate-50 dark:hover:bg-zinc-800 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 shadow-xs'
        }`}
        aria-label="Select Language"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-amber-500" />
        <span className="font-medium">{localeMeta.nativeName}</span>
        {!compact && <span className="text-[10px] text-slate-400 font-mono">({localeMeta.code.toUpperCase()})</span>}
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-zinc-800 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Select Language / ഭാഷ / भाषा
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-0.5 px-1">
            {ALL_LOCALE_CODES.map((code: SupportedLocale) => {
              const meta = SUPPORTED_LOCALES[code]
              const isSelected = code === locale
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleSelectLanguage(code)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800/80'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold">{meta.nativeName}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{meta.name}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-500" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
