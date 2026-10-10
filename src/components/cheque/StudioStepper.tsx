import React from 'react'
import { motion } from 'framer-motion'
import { Check, Globe2, Building2, ShieldCheck, FileEdit, Eye } from 'lucide-react'
import { SupportedLanguage } from '../../lib/cheque/types'
import { getTranslations } from '../../lib/cheque/languages'

export interface StepItem {
  id: number
  titleKey: 'step1Title' | 'step2Title' | 'step3Title' | 'step4Title' | 'step5Title'
  descKey: 'step1Desc' | 'step2Desc' | 'step3Desc' | 'step4Desc' | 'step5Desc'
  icon: React.ElementType
}

const STEPS: StepItem[] = [
  { id: 1, titleKey: 'step1Title', descKey: 'step1Desc', icon: Globe2 },
  { id: 2, titleKey: 'step2Title', descKey: 'step2Desc', icon: Building2 },
  { id: 3, titleKey: 'step3Title', descKey: 'step3Desc', icon: ShieldCheck },
  { id: 4, titleKey: 'step4Title', descKey: 'step4Desc', icon: FileEdit },
  { id: 5, titleKey: 'step5Title', descKey: 'step5Desc', icon: Eye },
]

interface StudioStepperProps {
  currentStep: number
  onStepClick: (step: number) => void
  lang: SupportedLanguage
  completedSteps: Set<number>
}

export const StudioStepper: React.FC<StudioStepperProps> = ({
  currentStep,
  onStepClick,
  lang,
  completedSteps,
}) => {
  const t = getTranslations(lang)
  const isRtl = lang === 'ur'

  return (
    <nav
      aria-label="Studio Progress"
      className="w-full bg-white/95 dark:bg-neutral-900/80 backdrop-blur-md border border-slate-200 dark:border-neutral-800 rounded-xl p-2 sm:p-2.5 shadow-sm mb-3 sm:mb-4"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {STEPS.map((step, idx) => {
          const isCurrent = currentStep === step.id
          const isCompleted = completedSteps.has(step.id) || currentStep > step.id
          const Icon = step.icon
          const title = t[step.titleKey]
          const desc = t[step.descKey]

          return (
            <React.Fragment key={step.id}>
              {/* Step Button */}
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                className={`group flex items-center gap-1.5 sm:gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-lg transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                  isCurrent
                    ? 'bg-amber-500/10 border border-amber-500/40 text-amber-700 dark:text-amber-400 font-semibold shadow-xs'
                    : isCompleted
                    ? 'hover:bg-slate-100 dark:hover:bg-neutral-800/60 text-slate-700 dark:text-neutral-300'
                    : 'text-slate-400 dark:text-neutral-500 hover:text-slate-700 dark:hover:text-neutral-300'
                }`}
                title={`${title} - ${desc}`}
              >
                {/* Circle Icon Indicator */}
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-transform group-hover:scale-105 ${
                    isCurrent
                      ? 'bg-amber-500 text-white dark:text-neutral-950 shadow-md shadow-amber-500/30'
                      : isCompleted
                      ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                      : 'bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400'
                  }`}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Text Label (Hidden on small mobile for compact responsiveness) */}
                <div className="hidden md:block">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-neutral-400 leading-none mb-0.5">
                    0{step.id}
                  </div>
                  <div
                    className={`text-xs font-medium leading-none truncate max-w-[90px] lg:max-w-[120px] ${
                      isCurrent
                        ? 'text-amber-700 dark:text-amber-300 font-bold'
                        : isCompleted
                        ? 'text-slate-800 dark:text-neutral-200'
                        : 'text-slate-500 dark:text-neutral-400'
                    }`}
                  >
                    {title}
                  </div>
                </div>
              </button>

              {/* Connector line between steps */}
              {idx < STEPS.length - 1 && (
                <div className="flex-1 mx-1 sm:mx-1.5 hidden xs:block">
                  <div
                    className={`h-[2px] rounded-full transition-colors duration-300 ${
                      currentStep > step.id
                        ? 'bg-emerald-500/50'
                        : currentStep === step.id
                        ? 'bg-amber-500/40'
                        : 'bg-slate-200 dark:bg-neutral-800'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </nav>
  )
}
