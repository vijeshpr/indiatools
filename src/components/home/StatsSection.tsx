import React from 'react'
import { TOOLS, CATEGORIES } from '../../data/tools'

export const StatsSection: React.FC = () => {
  const toolCount = TOOLS.length
  const catCount = Object.keys(CATEGORIES).length

  return (
    <section className="py-12 relative border-y border-slate-200/80 bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {/* Stat 1: Real Total Tools */}
          <div className="text-center p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-indigo-600 block">
              {toolCount}
            </span>
            <span className="text-sm font-bold text-slate-900 mt-2 block">
              Precision Utilities
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Vehicles, Civil, Solar, Land, Salary & Cheque
            </p>
          </div>

          {/* Stat 2: Real Categories */}
          <div className="text-center p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-slate-900 block">
              {catCount}
            </span>
            <span className="text-sm font-bold text-slate-900 mt-2 block">
              Essential Categories
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Drive, Build, Power, Money, Land, Work, Create
            </p>
          </div>

          {/* Stat 3: 100% Browser-Side Privacy */}
          <div className="text-center p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-emerald-600 block">
              100%
            </span>
            <span className="text-sm font-bold text-slate-900 mt-2 block">
              Client-Side Privacy
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Zero cloud upload for photos or calculations
            </p>
          </div>

          {/* Stat 4: 13 Regional Languages */}
          <div className="text-center p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <span className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-teal-600 block">
              13
            </span>
            <span className="text-sm font-bold text-slate-900 mt-2 block">
              Indian Languages
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Real-time regional cheque script conversion
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
