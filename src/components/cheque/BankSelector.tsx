import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Building2, CheckCircle2, ArrowRight, ArrowLeft, Shield } from 'lucide-react'
import { BankInfo, BankCategory, SupportedLanguage } from '../../lib/cheque/types'
import { BANKS, filterBanks } from '../../lib/cheque/banks'
import { getTranslations } from '../../lib/cheque/languages'

interface BankSelectorProps {
  selectedBankId: string
  onSelectBank: (bankId: string) => void
  onContinue: () => void
  onBack: () => void
  lang: SupportedLanguage
}

export const BankSelector: React.FC<BankSelectorProps> = ({
  selectedBankId,
  onSelectBank,
  onContinue,
  onBack,
  lang,
}) => {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<BankCategory | 'all'>('all')
  const t = getTranslations(lang)
  const isRtl = lang === 'ur'

  const filteredBanks = useMemo(() => {
    return filterBanks(search, categoryFilter)
  }, [search, categoryFilter])

  const selectedBank = BANKS.find((b) => b.id === selectedBankId) || BANKS[0]

  return (
    <div className="space-y-3.5 sm:space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 sm:pb-3 border-b border-neutral-800 light:border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center text-[11px] font-mono font-bold">
              02
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white light:text-slate-900 tracking-tight">
              {t.selectBankTitle}
            </h2>
          </div>
          <p className="text-xs text-neutral-400 light:text-slate-600">
            {t.selectBankSubtitle}
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchBankPlaceholder}
            className="w-full bg-neutral-900/90 light:bg-slate-50 border border-neutral-800 light:border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white light:text-slate-900 focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 custom-scrollbar">
        {[
          { id: 'all', label: t.allBanksFilter },
          { id: 'public', label: t.publicBanksFilter },
          { id: 'private', label: t.privateBanksFilter },
          { id: 'rrb', label: t.rrbBanksFilter },
          { id: 'cooperative', label: t.coopBanksFilter },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCategoryFilter(tab.id as BankCategory | 'all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              categoryFilter === tab.id
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm shadow-amber-500/20'
                : 'bg-neutral-900/60 light:bg-slate-100 hover:bg-neutral-800 text-neutral-400 light:text-slate-600 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bank Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 max-h-[380px] overflow-y-auto pr-1 p-0.5 custom-scrollbar">
        {filteredBanks.map((bank) => {
          const isSelected = selectedBankId === bank.id

          return (
            <motion.div
              key={bank.id}
              whileHover={{ y: -1.5, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectBank(bank.id)}
              className={`cursor-pointer relative p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-500/70 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50'
                  : 'bg-neutral-900/60 light:bg-white border-neutral-800/80 light:border-slate-200 hover:border-neutral-700 light:hover:border-slate-300 hover:bg-neutral-900 light:hover:bg-slate-50/80'
              }`}
            >
              {/* Brand Accent Top Stripe */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: bank.themeColor }}
              />

              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] text-white shadow-sm shrink-0"
                    style={{ backgroundColor: bank.themeColor }}
                  >
                    {bank.shortName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white light:text-slate-900 leading-snug">
                      {bank.name}
                    </h3>
                    <span className="text-[10px] font-mono uppercase text-neutral-400 light:text-slate-500">
                      {bank.categoryLabel}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-amber-500 text-neutral-950 shadow-sm'
                      : 'border border-neutral-700 light:border-slate-300 text-transparent'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3 fill-current" />
                </div>
              </div>

              {/* Tagline / Branch Hint */}
              <div className="pt-1.5 border-t border-neutral-800/60 light:border-slate-100 flex items-center justify-between text-[10px] text-neutral-400">
                <span className="truncate max-w-[160px]">
                  {bank.tagline || bank.branchPlaceholder}
                </span>
                <span className="font-mono text-neutral-500 text-[10px]">
                  {bank.ifscPrefix.slice(0, 4)}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filteredBanks.length === 0 && (
        <div className="py-8 text-center text-neutral-500 text-xs">
          No bank found matching "{search}".
        </div>
      )}

      {/* Educational Notice */}
      <div className="p-2.5 rounded-lg bg-neutral-900/60 light:bg-slate-50 border border-neutral-800/80 light:border-slate-200 text-xs text-neutral-400 flex items-start gap-2">
        <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <span>{t.genericTemplateNotice}</span>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-neutral-800 light:border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.backBtn}</span>
        </button>

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
