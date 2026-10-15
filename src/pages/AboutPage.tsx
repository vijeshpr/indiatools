import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Cpu, Heart, CheckCircle2, ArrowRight } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'

export const AboutPage: React.FC = () => {
  useSEO({
    title: 'About IndiaTools – Purpose & Philosophy | IndiaTools',
    description:
      'Learn about IndiaTools: our mission to provide practical, 100% private, client-side tools and accurate calculators calibrated for everyday Indian realities.',
    canonicalPath: '/about',
  })

  return (
    <div className="min-h-screen py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="text-center space-y-4 mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-indigo-700 font-bold px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200">
          Our Mission & Philosophy
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Smart tools for real-life calculations.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          IndiaTools was built to replace cluttered, ad-ridden calculator websites with
          a fast, 100% private, and mathematically calibrated utility platform.
        </p>
      </div>

      <div className="space-y-12">
        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Indian Benchmarks
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every formula is calibrated to Indian realities: from JCB 3DX diesel consumption to DISCOM telescopic electricity slabs and New Tax Regime rules.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              100% Client-Side
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your photos, signatures, CTC numbers, and calculations are computed locally in your browser using HTML5 Canvas. Zero cloud tracking or uploads.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              100% Free Forever
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No subscriptions, mandatory signups, paywalls, or hidden limitations. A high-quality public utility for students, contractors, and builders.
            </p>
          </div>
        </div>

        {/* Narrative Section */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Why IndiaTools Exists
          </h2>
          <p>
            When an Indian home builder needs to compute cement bags or concrete ratios, they are often met with websites designed for US measurements (cubic yards, feet-inches fractions) or overwhelmed by pop-up ads. When an exam applicant needs a 50KB photograph for SSC or UPSC, they shouldn't have to upload their private photo to an untrusted cloud server.
          </p>
          <p>
            IndiaTools solves these problems with precision. Every tool has been engineered to run entirely inside the user's browser, respecting user privacy, device battery, and mobile data speed.
          </p>
        </div>

        {/* Categories Directory Links for Googlebot & Users */}
        <div className="pt-4 border-t border-slate-200">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-4 text-center">
            Explore Calculators By Sector:
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link to="/category/drive" className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-xs font-medium transition-colors">
              🚗 Vehicle & Fuel
            </Link>
            <Link to="/category/build" className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-xs font-medium transition-colors">
              🏗️ Civil Construction
            </Link>
            <Link to="/category/power" className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-xs font-medium transition-colors">
              ⚡ Electricity & Solar
            </Link>
            <Link to="/category/money" className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-xs font-medium transition-colors">
              💰 Salary, Tax & Finance
            </Link>
            <Link to="/category/land" className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-xs font-medium transition-colors">
              📐 Land & Property
            </Link>
            <Link to="/category/create" className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-xs font-medium transition-colors">
              🎨 Documents & Media
            </Link>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pt-4">
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <span>Explore All 65 Tools & Calculators</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
