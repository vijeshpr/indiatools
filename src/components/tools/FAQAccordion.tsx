import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { FAQItem } from '../../types'

interface FAQAccordionProps {
  faqs: FAQItem[]
  title?: string
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  faqs,
  title = 'Frequently Asked Questions',
}) => {
  const [openIndices, setOpenIndices] = useState<number[]>([0]) // First FAQ open by default

  const toggleFAQ = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  if (!faqs || faqs.length === 0) return null

  return (
    <section className="mt-12 pt-8 border-t border-slate-200 dark:border-neutral-800/80">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-amber-400" />
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndices.includes(index)

          return (
            <div
              key={index}
              className="rounded-xl border border-slate-200 dark:border-neutral-800/90 bg-white dark:bg-neutral-900/50 overflow-hidden transition-colors shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                type="button"
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 hover:bg-slate-50 dark:hover:bg-neutral-800/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-sm sm:text-base text-slate-900 dark:text-neutral-100">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-slate-400 dark:text-neutral-400"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-sm text-slate-600 dark:text-neutral-400 leading-relaxed border-t border-slate-100 dark:border-neutral-800/50 pt-3">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
