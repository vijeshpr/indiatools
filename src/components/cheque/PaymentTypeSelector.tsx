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
      <div className="pb-2.5 sm:pb-3 border-b border-neutral-800 light:border-slate-200">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center text-[11px] font-mono font-bold">
            03
          </span>
          <h2 className="text-lg sm:text-xl font-black text-white light:text-slate-900 tracking-tight">
            {t.selectPaymentTitle}
          </h2>
        </div>
        <p className="text-xs text-neutral-400 light:text-slate-600">
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
                  ? 'bg-amber-500/10 border-amber-500/80 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50'
                  : 'bg-neutral-900/60 light:bg-white border-neutral-800/80 light:border-slate-200 hover:border-neutral-700 light:hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header with Icon, Badge, Checkbox */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        mode.safetyLevel === 'high'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : mode.safetyLevel === 'medium'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white light:text-slate-900 leading-tight">
                        {mode.title}
                      </h3>
                      <span
                        className={`text-[9px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full inline-block mt-0.5 ${
                          mode.safetyLevel === 'high'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : mode.safetyLevel === 'medium'
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {mode.badge}
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
                    <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>

                {/* Primary Description */}
                <p className="text-xs text-neutral-300 light:text-slate-700 leading-relaxed mb-2">
                  {mode.description}
                </p>

                {/* Educational Annotation Box */}
                <div className="p-2.5 rounded-lg bg-neutral-950/80 light:bg-slate-50 border border-neutral-800/80 light:border-slate-200 text-[11px] text-neutral-400 light:text-slate-600 leading-relaxed">
                  <strong className="text-amber-400 block mb-0.5">
                    Cheque Marking:
                  </strong>
                  {mode.educationalNote}
                </div>
              </div>

              {/* Visual Mini Cheque Corner Simulation */}
              <div className="mt-2.5 pt-2 border-t border-neutral-800/60 light:border-slate-100 flex items-center justify-between text-[11px] text-neutral-500">
                <span className="font-mono text-[10px]">
                  Format Tag: <strong className="text-neutral-300">{mode.chequeMarking}</strong>
                </span>
                {mode.id === 'account-payee' && (
                  <span className="text-emerald-400 font-semibold text-[10px]">
                    Recommended for safety
                  </span>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Banking Regulations Disclaimer */}
      <div className="p-2.5 rounded-lg bg-neutral-900/40 light:bg-slate-50 border border-neutral-800/80 light:border-slate-200 text-xs text-neutral-400 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <span>{t.bankingRulesNotice}</span>
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
