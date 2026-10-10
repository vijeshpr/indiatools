import { FileText, CheckCircle2 } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'

export const TermsPage: React.FC = () => {
  useSEO({
    title: 'Terms of Service | IndiaTools',
    description:
      'Read the terms and conditions for using IndiaTools web applications and calculators.',
    canonicalPath: '/terms',
  })
  return (
    <div className="min-h-screen py-12 sm:py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-500/30">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Terms of Service
          </h1>
          <span className="text-xs text-slate-500 dark:text-neutral-400 font-mono">Last updated: October 2026</span>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-6 text-sm text-slate-700 dark:text-neutral-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Purpose & Educational Nature
          </h2>
          <p>
            IndiaTools provides computational estimates, conversion tools, and client-side photo processing utilities for informational and preparation purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Engineering & Financial Estimates
          </h2>
          <p>
            Calculations for JCB fuel consumption, house construction materials, rooftop solar capacities, and salary take-home amounts are derived from standard Indian engineering guidelines and tax slabs. Actual field costs may vary depending on vendor pricing, site soil conditions, state tariff revisions, and customized contractor contracts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Permitted Use
          </h2>
          <p>
            All tools are free for personal, commercial, and student use. No reverse engineering or automated scraping of the site is permitted.
          </p>
        </section>
      </div>
    </div>
  )
}
