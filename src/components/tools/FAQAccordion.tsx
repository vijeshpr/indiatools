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
    <section className="mt-12 pt-8 border-t border-neutral-800/80 light:border-slate-200">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="w-5 h-5 text-amber-400" />
        <h2 className="text-xl sm:text-2xl font-bold text-white light:text-slate-900 tracking-tight">
          {title}
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndices.includes(index)

          return (
            <div
              key={index}
              className="rounded-xl border border-neutral-800/90 light:border-slate-200/90 bg-neutral-900/50 light:bg-white overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                type="button"
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 hover:bg-neutral-800/30 light:hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-sm sm:text-base text-neutral-100 light:text-slate-800">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-neutral-400"
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
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-sm text-neutral-400 light:text-slate-600 leading-relaxed border-t border-neutral-800/50 light:border-slate-100 pt-3">
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
