import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, IndianRupee, ArrowUpRight, CheckCircle2, ShieldCheck } from 'lucide-react'
import { calculateSalaryHike, SalaryHikeResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const SalaryHikeTool: React.FC = () => {
  const tool = getToolBySlug('salary-hike')!

  const [currentCtc, setCurrentCtc] = useState<number>(1000000) // 10 LPA
  const [hikeMode, setHikeMode] = useState<'percentage' | 'offeredCtc'>('percentage')
  const [hikeVal, setHikeVal] = useState<number>(35) // 35% or offered CTC

  const results: SalaryHikeResult = useMemo(() => {
    return calculateSalaryHike(currentCtc, hikeVal, hikeMode)
  }, [currentCtc, hikeVal, hikeMode])

  const handleReset = () => {
    setCurrentCtc(1000000)
    setHikeMode('percentage')
    setHikeVal(35)
  }

  const getResultSummary = () => {
    return `Salary Hike & In-Hand Pay Estimation:
Current CTC: ₹${currentCtc.toLocaleString('en-IN')} (₹${(currentCtc / 100000).toFixed(1)} LPA)
- Percentage Hike: ${results.hikePercentage}%
- New Annual CTC: ₹${results.newCtc.toLocaleString('en-IN')} (₹${(results.newCtc / 100000).toFixed(2)} LPA)
- Annual Absolute Increase: ₹${results.absoluteHikeAnnual.toLocaleString('en-IN')}
- New Monthly Gross: ₹${results.monthlyGrossNew.toLocaleString('en-IN')} (+₹${results.monthlyGrossIncrease.toLocaleString('en-IN')})
- Estimated In-Hand Take Home: ~₹${results.estimatedMonthlyInHandNew.toLocaleString('en-IN')}/mo (New Tax Regime)
Calculated on India Practical Tools`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span>Current & Target Compensation</span>
            </h2>
            <div className="flex rounded-lg bg-neutral-800 p-0.5 border border-neutral-700">
              <button
                type="button"
                onClick={() => {
                  setHikeMode('percentage')
                  setHikeVal(30)
                }}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                  hikeMode === 'percentage'
                    ? 'bg-purple-500 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Hike %
              </button>
              <button
                type="button"
                onClick={() => {
                  setHikeMode('offeredCtc')
                  setHikeVal(currentCtc * 1.35)
                }}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                  hikeMode === 'offeredCtc'
                    ? 'bg-purple-500 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Offered CTC
              </button>
            </div>
          </div>

          {/* Current CTC */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600">
                Current Annual CTC
              </label>
              <span className="text-sm font-bold text-purple-400 font-mono">
                ₹{(currentCtc / 100000).toFixed(2)} LPA
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-neutral-400 text-sm font-bold">₹</span>
              <input
                type="number"
                step="50000"
                min="100000"
                max="10000000"
                value={currentCtc || ''}
                onChange={(e) => setCurrentCtc(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl pl-8 pr-4 py-2.5 text-base font-bold text-white light:text-slate-900 focus:outline-none focus:border-purple-500"
              />
            </div>
            {/* Quick preset buttons */}
            <div className="flex gap-1.5 mt-2">
              {[400000, 800000, 1500000, 2500000].map((ctc) => (
                <button
                  key={ctc}
                  type="button"
                  onClick={() => setCurrentCtc(ctc)}
                  className="px-2 py-0.5 rounded bg-neutral-800 text-[11px] text-neutral-300 hover:text-white"
                >
                  {ctc / 100000} LPA
                </button>
              ))}
            </div>
          </div>

          {/* Hike or Offered CTC */}
          {hikeMode === 'percentage' ? (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600">
                  Percentage Hike (%)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max="300"
                    value={hikeVal}
                    onChange={(e) => setHikeVal(parseFloat(e.target.value) || 0)}
                    className="w-20 bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1 text-sm font-mono text-right text-purple-400 font-bold"
                  />
                  <span className="text-xs text-neutral-400 font-mono">%</span>
                </div>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="1"
                value={hikeVal}
                onChange={(e) => setHikeVal(parseFloat(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                <span>10% (Appraisal)</span>
                <span>35% (Standard Switch)</span>
                <span>70%+ (Aggressive)</span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
                Offered Annual CTC (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-neutral-400 text-sm font-bold">₹</span>
                <input
                  type="number"
                  step="50000"
                  min={currentCtc}
                  value={hikeVal}
                  onChange={(e) => setHikeVal(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-8 pr-4 py-2.5 text-base font-bold text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Results */}
        <div className="lg:col-span-6 space-y-4">
          <motion.div
            layout
            className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-purple-950/30 border border-purple-500/30 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>Offer Evaluation</span>
              </span>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                +{results.hikePercentage}% Hike
              </span>
            </div>

            {/* New CTC */}
            <div className="mb-6 pb-6 border-b border-neutral-800">
              <span className="text-xs text-neutral-400 block font-medium">New Annual Compensation (CTC)</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                  ₹{(results.newCtc / 100000).toFixed(2)} LPA
                </span>
              </div>
              <p className="mt-2 text-xs text-purple-300/90 font-mono">
                Annual Bump: +₹{results.absoluteHikeAnnual.toLocaleString('en-IN')} (+₹{results.monthlyGrossIncrease.toLocaleString('en-IN')}/mo)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Monthly Gross */}
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <span className="text-xs text-neutral-400 mb-1 block">New Monthly Gross</span>
                <p className="text-lg sm:text-xl font-bold text-white font-mono">
                  ₹{results.monthlyGrossNew.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-neutral-400">Before deductions</span>
              </div>

              {/* Estimated In-Hand Take Home */}
              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30">
                <span className="text-xs text-purple-300 font-semibold mb-1 block">Est. Take Home (In-Hand)</span>
                <p className="text-lg sm:text-xl font-black text-purple-400 font-mono">
                  ~₹{results.estimatedMonthlyInHandNew.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-purple-300/70">Per month in bank</span>
              </div>
            </div>

            <div className="mt-5 p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400">Net Monthly Salary Surge:</span>
              <span className="font-bold text-emerald-400 text-sm font-mono">
                +₹{results.monthlyInHandIncrease.toLocaleString('en-IN')} / mo
              </span>
            </div>
          </motion.div>

          <div className="p-4 rounded-xl bg-neutral-900/50 light:bg-slate-100 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Under the New Tax Regime (Section 87A + standard deduction of ₹75,000), income up to ₹7.75 Lakhs is 100% tax-free.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
