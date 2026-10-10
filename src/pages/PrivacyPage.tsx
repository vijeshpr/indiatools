import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'

export const PrivacyPage: React.FC = () => {
  useSEO({
    title: 'Privacy Policy – Zero Data Collection | IndiaTools',
    description:
      'Our privacy commitment: 100% client-side computing. Photos, files, and calculations never leave your browser.',
    canonicalPath: '/privacy',
  })
  return (
    <div className="min-h-screen py-12 sm:py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/30">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Privacy Policy
          </h1>
          <span className="text-xs text-slate-500 dark:text-neutral-400 font-mono">Last updated: October 2026</span>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 shadow-sm space-y-6 text-sm text-slate-700 dark:text-neutral-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>100% Client-Side Computing Commitment</span>
          </h2>
          <p>
            At IndiaTools, we adhere to a strict client-side architecture. When you upload photos for 50KB compression, signature background whitening, or passport photo creation, the image processing is executed entirely in your browser memory via the HTML5 Canvas API.
          </p>
          <p className="font-semibold text-emerald-700 dark:text-emerald-400">
            Your images and personal documents are never transmitted to our servers or stored anywhere.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            No Personal Data Collection
          </h2>
          <p>
            We do not require account registration, passwords, phone numbers, or credit card details. You are free to utilize all 43 calculators completely anonymously.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Local Storage Usage
          </h2>
          <p>
            The website only utilizes browser localStorage to preserve your dark/light theme preference (<code className="text-indigo-600 dark:text-amber-400 font-mono">ipt_theme_v2</code>). No advertising trackers or fingerprinting cookies are deployed.
          </p>
        </section>
      </div>
    </div>
  )
}
