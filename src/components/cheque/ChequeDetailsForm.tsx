import React from 'react'
import { Calendar, IndianRupee, User, Copy, Check, ArrowRight, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react'
import { ChequeFormData, ChequeErrors, SupportedLanguage } from '../../lib/cheque/types'
import { convertAmountToWords, formatInr } from '../../lib/cheque/amountToWords'
import { getTranslations } from '../../lib/cheque/languages'
import { useToast } from '../common/Toast'

interface ChequeDetailsFormProps {
  data: ChequeFormData
  errors: ChequeErrors
  onChange: (fields: Partial<ChequeFormData>) => void
  onContinue: () => void
  onBack: () => void
  lang: SupportedLanguage
}

export const ChequeDetailsForm: React.FC<ChequeDetailsFormProps> = ({
  data,
  errors,
  onChange,
  onContinue,
  onBack,
  lang,
}) => {
  const t = getTranslations(lang)
  const { showToast } = useToast()
  const isRtl = lang === 'ur'

  const amountResult = convertAmountToWords(data.amountRupees, data.amountPaise, lang)

  const handleCopyWords = async () => {
    try {
      await navigator.clipboard.writeText(amountResult.words)
      showToast(t.copiedBtn)
    } catch {
      showToast('Could not copy to clipboard')
    }
  }

  const setTodayDate = () => {
    const today = new Date().toISOString().split('T')[0]
    onChange({ date: today })
  }

  const quickAmounts = [5000, 25000, 50000, 100000, 500000]

  return (
    <div className="space-y-3.5 sm:space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="pb-2.5 sm:pb-3 border-b border-slate-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center text-[11px] font-mono font-bold">
            04
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.detailsFormTitle}
          </h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-neutral-400">
          {t.detailsFormSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3.5 sm:gap-4">
        {/* ================= LEFT COLUMN: CORE FIELDS ================= */}
        <div className="space-y-3.5">
          {/* 1. Cheque Date */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-800 dark:text-neutral-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span>{t.dateFieldLabel}</span>
                <span className="text-amber-500">*</span>
              </label>
              <button
                type="button"
                onClick={setTodayDate}
                className="text-[11px] font-mono text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors cursor-pointer"
              >
                {t.todayDateBtn}
              </button>
            </div>
            <input
              type="date"
              value={data.date}
              onChange={(e) => onChange({ date: e.target.value })}
              className={`w-full bg-slate-50 dark:bg-neutral-900/90 border rounded-lg px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none transition-colors shadow-inner ${
                errors.date
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-slate-200 dark:border-neutral-800 focus:border-amber-500'
              }`}
            />
            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 dark:text-neutral-500">
              <span>{t.dateFieldHint}</span>
              {errors.date && (
                <span className="text-rose-500 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  {errors.date}
                </span>
              )}
            </div>
          </div>

          {/* 2. Payee Name */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-800 dark:text-neutral-200 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span>{t.payeeFieldLabel}</span>
                <span className="text-amber-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => onChange({ payeeName: 'SELF' })}
                className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer"
              >
                {t.payeeQuickSelf}
              </button>
            </div>
            <input
              type="text"
              value={data.payeeName}
              onChange={(e) => onChange({ payeeName: e.target.value })}
              placeholder={t.payeeFieldPlaceholder}
              maxLength={70}
              className={`w-full bg-slate-50 dark:bg-neutral-900/90 border rounded-lg px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none transition-colors shadow-inner font-medium ${
                errors.payeeName
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-slate-200 dark:border-neutral-800 focus:border-amber-500'
              }`}
            />
            {errors.payeeName && (
              <span className="text-[10px] text-rose-500 flex items-center gap-1 font-medium mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.payeeName}
              </span>
            )}
          </div>

          {/* 3. Amount in Rupees + Paise */}
          <div>
            <label className="text-xs font-semibold text-slate-800 dark:text-neutral-200 flex items-center gap-1.5 mb-1">
              <IndianRupee className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>{t.amountFieldLabel}</span>
              <span className="text-amber-500">*</span>
            </label>

            <div className="grid grid-cols-12 gap-2">
              {/* Rupees Input */}
              <div className="col-span-8 sm:col-span-9 relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-neutral-400 font-bold text-xs sm:text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  max="1000000000"
                  step="1"
                  value={data.amountRupees || ''}
                  onChange={(e) => onChange({ amountRupees: e.target.value })}
                  placeholder="50000"
                  className={`w-full bg-slate-50 dark:bg-neutral-900/90 border rounded-lg pl-7 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none transition-colors shadow-inner font-mono font-bold ${
                    errors.amount
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-200 dark:border-neutral-800 focus:border-amber-500'
                  }`}
                />
              </div>

              {/* Paise Input */}
              <div className="col-span-4 sm:col-span-3">
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={data.amountPaise === 0 ? '' : data.amountPaise}
                  onChange={(e) => onChange({ amountPaise: e.target.value })}
                  placeholder=".00 P"
                  className="w-full bg-slate-50 dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 rounded-lg px-2 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors shadow-inner font-mono text-center"
                  title="Paise (0-99)"
                />
              </div>
            </div>

            {/* Quick Amount Chips */}
            <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
              <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">Quick:</span>
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => onChange({ amountRupees: amt, amountPaise: 0 })}
                  className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-300 text-[10px] font-mono transition-colors cursor-pointer"
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            {errors.amount && (
              <span className="text-[10px] text-rose-500 flex items-center gap-1 font-medium mt-1">
                <AlertCircle className="w-3 h-3" />
                {errors.amount}
              </span>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: WORDS & DEMO METADATA ================= */}
        <div className="space-y-3.5">
          {/* Live Amount in Words Showcase */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-neutral-950/80 border border-slate-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {t.amountInWordsLabel}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyWords}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white hover:bg-slate-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-neutral-700 text-[10px] font-medium transition-colors cursor-pointer shadow-xs"
                  title="Copy generated words"
                >
                  <Copy className="w-3 h-3" />
                  <span>{t.copyWordsBtn}</span>
                </button>
              </div>

              {/* Primary Localized Words */}
              <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800/80 min-h-[46px] flex items-center">
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug break-words">
                  {amountResult.words}
                </p>
              </div>

              {/* English Baseline Translation if in regional language */}
              {lang !== 'en' && (
                <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-neutral-900/50 text-[11px] text-slate-600 dark:text-neutral-400 border border-slate-200/60 dark:border-transparent">
                  <span className="text-[9px] font-mono text-slate-500 dark:text-neutral-500 block mb-0.5">
                    English Standard:
                  </span>
                  <span className="font-medium text-slate-800 dark:text-neutral-300">
                    {amountResult.wordsInEnglish}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-neutral-800/60 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-neutral-400">
              <span>Formatted INR:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{amountResult.formattedInr}</span>
            </div>
          </div>

          {/* Optional Account Holder Name */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-neutral-300 block mb-1">
              {t.accountHolderLabel}
            </label>
            <input
              type="text"
              value={data.accountHolderName}
              onChange={(e) => onChange({ accountHolderName: e.target.value })}
              placeholder={t.accountHolderPlaceholder}
              maxLength={60}
              className="w-full bg-slate-50 dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
            />
          </div>

          {/* Optional Memo */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-neutral-300 block mb-1">
              {t.memoLabel}
            </label>
            <input
              type="text"
              value={data.memo}
              onChange={(e) => onChange({ memo: e.target.value })}
              placeholder={t.memoPlaceholder}
              maxLength={40}
              className="w-full bg-slate-50 dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Security notice */}
      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-neutral-900/40 border border-slate-200 dark:border-neutral-800/80 text-[11px] text-slate-600 dark:text-neutral-400">
        {t.signatureNote}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-neutral-800">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.backBtn}</span>
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-neutral-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all cursor-pointer"
        >
          <span>Generate Live Cheque</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
