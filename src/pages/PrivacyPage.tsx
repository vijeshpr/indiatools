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
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white light:text-slate-900">
            Privacy Policy
          </h1>
          <span className="text-xs text-neutral-400 font-mono">Last updated: October 2026</span>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-neutral-900/60 light:bg-white border border-neutral-800 light:border-slate-200 space-y-6 text-sm text-neutral-300 light:text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white light:text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>100% Client-Side Computing Commitment</span>
          </h2>
          <p>
            At IndiaTools, we adhere to a strict client-side architecture. When you upload photos for 50KB compression, signature background whitening, or passport photo creation, the image processing is executed entirely in your browser memory via the HTML5 Canvas API.
          </p>
          <p className="font-semibold text-emerald-400">
            Your images and personal documents are never transmitted to our servers or stored anywhere.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white light:text-slate-900">
            No Personal Data Collection
          </h2>
          <p>
            We do not require account registration, passwords, phone numbers, or credit card details. You are free to utilize all 15+ calculators completely anonymously.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white light:text-slate-900">
            Local Storage Usage
          </h2>
          <p>
            The website only utilizes browser localStorage to preserve your dark/light theme preference (<code className="text-amber-400 font-mono">ipt_theme</code>). No advertising trackers or fingerprinting cookies are deployed.
          </p>
        </section>
      </div>
    </div>
  )
}
