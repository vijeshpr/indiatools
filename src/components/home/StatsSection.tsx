import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Cpu, Globe2, Sparkles } from 'lucide-react'

export const StatsSection: React.FC = () => {
  return (
    <section className="py-16 relative border-y border-neutral-800/80 light:border-slate-200 bg-neutral-900/40 light:bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Stat 1: 15+ Core Tools */}
          <div className="text-center p-6 rounded-2xl bg-neutral-950/60 light:bg-white border border-neutral-800/80 light:border-slate-200">
            <span className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-amber-400 block">
              15+
            </span>
            <span className="text-sm font-bold text-white light:text-slate-900 mt-2 block">
              Built-in Utilities
            </span>
            <p className="text-xs text-neutral-400 mt-1">
              Vehicles, Civil, Solar, Land, Salary & Photos
            </p>
          </div>

          {/* Stat 2: 6 Major Categories */}
          <div className="text-center p-6 rounded-2xl bg-neutral-950/60 light:bg-white border border-neutral-800/80 light:border-slate-200">
            <span className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900 block">
              6
            </span>
            <span className="text-sm font-bold text-white light:text-slate-900 mt-2 block">
              Essential Categories
            </span>
            <p className="text-xs text-neutral-400 mt-1">
              Drive, Build, Power, Land, Work & Create
            </p>
          </div>

          {/* Stat 3: 100% Browser-Side Privacy */}
          <div className="text-center p-6 rounded-2xl bg-neutral-950/60 light:bg-white border border-neutral-800/80 light:border-slate-200">
            <span className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-emerald-400 block">
              100%
            </span>
            <span className="text-sm font-bold text-white light:text-slate-900 mt-2 block">
              Client-Side Privacy
            </span>
            <p className="text-xs text-neutral-400 mt-1">
              Zero cloud upload for photos or calculations
            </p>
          </div>

          {/* Stat 4: ₹0 Cost */}
          <div className="text-center p-6 rounded-2xl bg-neutral-950/60 light:bg-white border border-neutral-800/80 light:border-slate-200">
            <span className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-sky-400 block">
              ₹0
            </span>
            <span className="text-sm font-bold text-white light:text-slate-900 mt-2 block">
              Free & Open Access
            </span>
            <p className="text-xs text-neutral-400 mt-1">
              No paywalls, logins, or hidden subscriptions
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
