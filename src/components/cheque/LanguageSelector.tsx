import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, CheckCircle2, ArrowRight, Globe, Sparkles } from 'lucide-react'
import { SupportedLanguage } from '../../lib/cheque/types'
import { LANGUAGES, getTranslations } from '../../lib/cheque/languages'

interface LanguageSelectorProps {
  selectedLang: SupportedLanguage
  onSelectLang: (lang: SupportedLanguage) => void
  onContinue: () => void
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLang,
  onSelectLang,
  onContinue,
}) => {
  const [search, setSearch] = useState('')
  const t = getTranslations(selectedLang)
  const isRtl = selectedLang === 'ur'

  const filteredLanguages = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return LANGUAGES
    return LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.nativeName.toLowerCase().includes(q) ||
        l.script.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div className="space-y-3.5 sm:space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 sm:pb-3 border-b border-slate-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center text-[11px] font-mono font-bold">
              01
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.selectLanguageTitle}
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-neutral-400">
            {t.selectLanguageSubtitle}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchLanguagePlaceholder}
            className="w-full bg-slate-50 dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
          />
        </div>
      </div>

      {/* Language Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 max-h-[380px] overflow-y-auto pr-1 p-0.5 custom-scrollbar">
        {filteredLanguages.map((langItem) => {
          const isSelected = selectedLang === langItem.code
          return (
            <motion.div
              key={langItem.code}
              whileHover={{ y: -1.5, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectLang(langItem.code)}
              className={`cursor-pointer relative p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50'
                  : 'bg-white dark:bg-neutral-900/60 border-slate-200 dark:border-neutral-800/80 hover:border-slate-300 dark:hover:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-900'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-400 block">
                    {langItem.script} Script {langItem.direction === 'rtl' ? '• RTL' : ''}
                  </span>
                  <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight font-sans">
                    {langItem.nativeName}
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-amber-500 text-white dark:text-neutral-950 shadow-sm'
                      : 'border border-slate-300 dark:border-neutral-700 text-transparent'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>

              {/* English Name & Sample Words */}
              <div className="pt-1.5 border-t border-slate-100 dark:border-neutral-800/60 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 dark:text-neutral-300">
                  {langItem.name}
                </span>
                <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400/90 font-medium bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-500/20">
                  {langItem.currencyPlural} {langItem.onlyWord}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filteredLanguages.length === 0 && (
        <div className="py-8 text-center text-slate-400 dark:text-neutral-500 text-xs">
          No matching Indian language found for "{search}". Try searching by English or native script name.
        </div>
      )}

      {/* Continue Action Button */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-neutral-800">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-neutral-400">
          <Globe className="w-3.5 h-3.5 text-amber-500" />
          <span>
            Selected: <strong className="text-slate-900 dark:text-white">{LANGUAGES.find((l) => l.code === selectedLang)?.name} ({LANGUAGES.find((l) => l.code === selectedLang)?.nativeName})</strong>
          </span>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-neutral-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all cursor-pointer"
        >
          <span>{t.continueBtn}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
