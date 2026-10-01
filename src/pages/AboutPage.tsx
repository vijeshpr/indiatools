import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Cpu, Heart, CheckCircle2, ArrowRight } from 'lucide-react'

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center space-y-4 mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
          Our Mission & Philosophy
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white light:text-slate-900 tracking-tight">
          Real-life problems. One simple toolbox.
        </h1>
        <p className="text-base sm:text-lg text-neutral-400 light:text-slate-600 max-w-2xl mx-auto leading-relaxed">
          India Practical Tools was built to replace cluttered, ad-ridden calculator websites with
          a cinematic, private, and mathematically rigorous technological utility platform.
        </p>
      </div>

      <div className="space-y-12">
        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-900/60 light:bg-white border border-neutral-800 light:border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white light:text-slate-900 mb-2">
              Indian Benchmarks
            </h3>
            <p className="text-xs text-neutral-400 light:text-slate-600 leading-relaxed">
              Every formula is calibrated to Indian realities: from JCB 3DX diesel consumption to DISCOM telescopic electricity slabs and New Tax Regime rules.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/60 light:bg-white border border-neutral-800 light:border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white light:text-slate-900 mb-2">
              100% Client-Side
            </h3>
            <p className="text-xs text-neutral-400 light:text-slate-600 leading-relaxed">
              Your photos, signatures, CTC numbers, and calculations are computed locally in your browser using HTML5 Canvas. Zero cloud tracking or uploads.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/60 light:bg-white border border-neutral-800 light:border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-4">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white light:text-slate-900 mb-2">
              Zero Ads & Paywalls
            </h3>
            <p className="text-xs text-neutral-400 light:text-slate-600 leading-relaxed">
              No obnoxious popup ads, no mandatory user registrations, and no subscriptions. Open, high-performance technology for every citizen.
            </p>
          </div>
        </div>

        {/* Narrative Section */}
        <div className="p-8 rounded-3xl bg-neutral-900/40 light:bg-slate-50 border border-neutral-800 light:border-slate-200 space-y-4 text-sm text-neutral-300 light:text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-white light:text-slate-900">
            Why India Practical Tools Exists
          </h2>
          <p>
            When an Indian homebuilder looks for construction material estimates, they shouldn't have to wade through spam blogs. When a government job aspirant needs a 50KB photo or 10KB signature for UPSC or SSC, they shouldn't have to upload sensitive biometric photos to unknown international servers.
          </p>
          <p>
            India Practical Tools combines cinematic product craftsmanship, client-side privacy, and rigorous engineering logic into one seamless experience.
          </p>
        </div>

        {/* Explore CTA */}
        <div className="text-center pt-8">
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-sm transition-all shadow-xl shadow-amber-500/20"
          >
            <span>Explore All Utilities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
