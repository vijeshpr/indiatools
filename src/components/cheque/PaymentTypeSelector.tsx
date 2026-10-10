import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Banknote, UserCheck, AlertTriangle, ArrowRight, ArrowLeft, CheckCircle2, Info } from 'lucide-react'
import { PaymentMode, SupportedLanguage } from '../../lib/cheque/types'
import { getPaymentModes } from '../../lib/cheque/paymentModes'
import { getTranslations } from '../../lib/cheque/languages'

interface PaymentTypeSelectorProps {
  selectedMode: PaymentMode
  onSelectMode: (mode: PaymentMode) => void
  onContinue: () => void
  onBack: () => void
  lang: SupportedLanguage
}

export const PaymentTypeSelector: React.FC<PaymentTypeSelectorProps> = ({
  selectedMode,
  onSelectMode,
  onContinue,
  onBack,
  lang,
}) => {
  const t = getTranslations(lang)
  const isRtl = lang === 'ur'
  const modes = getPaymentModes(lang)

  const modeIcons: Record<PaymentMode, React.ElementType> = {
    'account-payee': ShieldCheck,
    cash: Banknote,
    self: UserCheck,
    bearer: AlertTriangle,
  }

  return (
    <div className="space-y-3.5 sm:space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="pb-2.5 sm:pb-3 border-b border-slate-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center text-[11px] font-mono font-bold">
            03
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.selectPaymentTitle}
          </h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-neutral-400">
          {t.selectPaymentSubtitle}
        </p>
      </div>

      {/* 4 Payment Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
        {modes.map((mode) => {
          const isSelected = selectedMode === mode.id
          const IconComponent = modeIcons[mode.id]

          return (
            <motion.div
              key={mode.id}
              whileHover={{ y: -1.5, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectMode(mode.id)}
              className={`cursor-pointer p-3.5 sm:p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50'
                  : 'bg-white dark:bg-neutral-900/60 border-slate-200 dark:border-neutral-800/80 hover:border-slate-300 dark:hover:border-neutral-700'
              }`}
            >
              <div>
                {/* Header with Icon, Badge, Checkbox */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        mode.safetyLevel === 'high'
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                          : mode.safetyLevel === 'medium'
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                          : 'bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {mode.title}
                      </h3>
                      <span
                        className={`text-[9px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full inline-block mt-0.5 ${
                          mode.safetyLevel === 'high'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30'
                            : mode.safetyLevel === 'medium'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30'
                        }`}
                      >
                        {mode.badge}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-amber-500 text-white dark:text-neutral-950 shadow-sm'
                        : 'border border-slate-300 dark:border-neutral-700 text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>

                {/* Primary Description */}
                <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed mb-2">
                  {mode.description}
                </p>

                {/* Educational Annotation Box */}
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-neutral-950/80 border border-slate-200 dark:border-neutral-800/80 text-[11px] text-slate-600 dark:text-neutral-400 leading-relaxed">
                  <strong className="text-amber-600 dark:text-amber-400 block mb-0.5">
                    Cheque Marking:
                  </strong>
                  {mode.educationalNote}
                </div>
              </div>

              {/* Visual Mini Cheque Corner Simulation */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-neutral-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-neutral-500">
                <span className="font-mono text-[10px]">
                  Format Tag: <strong className="text-slate-800 dark:text-neutral-300">{mode.chequeMarking}</strong>
                </span>
                {mode.id === 'account-payee' && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                    Recommended for safety
                  </span>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Banking Regulations Disclaimer */}
      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-neutral-900/40 border border-slate-200 dark:border-neutral-800/80 text-xs text-slate-600 dark:text-neutral-400 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
        <span>{t.bankingRulesNotice}</span>
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
          <span>{t.continueBtn}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
