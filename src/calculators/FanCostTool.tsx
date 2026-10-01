import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Wind, Zap, CheckCircle2, TrendingDown, IndianRupee } from 'lucide-react'
import { calculateFanCost, FanCostResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const FanCostTool: React.FC = () => {
  const tool = getToolBySlug('fan-electricity-cost')!

  const [fanType, setFanType] = useState<'bldc' | 'regular_induction'>('regular_induction')
  const [numFans, setNumFans] = useState<number>(3)
  const [dailyHours, setDailyHours] = useState<number>(14)
  const [unitRate, setUnitRate] = useState<number>(8.5)

  const result: FanCostResult = useMemo(() => {
    return calculateFanCost(fanType, numFans, dailyHours, unitRate)
  }, [fanType, numFans, dailyHours, unitRate])

  const handleReset = () => {
    setFanType('regular_induction')
    setNumFans(3)
    setDailyHours(14)
    setUnitRate(8.5)
  }

  const getResultSummary = () => {
    return `Ceiling Fan Power Consumption & BLDC Upgrade Analysis:
- Fan Type: ${fanType === 'bldc' ? 'BLDC Energy Saving (28W)' : 'Traditional Induction Fan (75W)'}
- Number of Fans: ${numFans} Fans (${dailyHours} hours/day)
- Monthly Units: ${result.monthlyUnitsKwh} kWh (₹${result.monthlyCost.toLocaleString('en-IN')})
- Annual Power Bill: ₹${result.annualCost.toLocaleString('en-IN')}
${fanType === 'regular_induction' ? `- Switching to BLDC Fans saves: ₹${result.savingsIfBldcAnnual.toLocaleString('en-IN')} per year (Breakeven in ~14 months)!` : '- You are already saving 65% on fan electricity using BLDC tech!'}
Calculated via IndiaTools (https://indiatools-rho.vercel.app)`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Wind className="w-5 h-5 text-blue-500" />
              <span>Fan Inventory & Usage</span>
            </h2>
            <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              BLDC 28W vs Induction 75W
            </span>
          </div>

          {/* Fan Type */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              Motor Technology
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFanType('regular_induction')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  fanType === 'regular_induction'
                    ? 'bg-blue-500/20 border-blue-500 text-white font-bold'
                    : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400'
                }`}
              >
                <span className="text-sm block font-bold text-white light:text-slate-900">Standard Fan</span>
                <span className="text-[11px] text-neutral-500">75 Watt Induction Motor</span>
              </button>

              <button
                type="button"
                onClick={() => setFanType('bldc')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  fanType === 'bldc'
                    ? 'bg-blue-500/20 border-blue-500 text-white font-bold'
                    : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400'
                }`}
              >
                <span className="text-sm block font-bold text-white light:text-slate-900">BLDC Motor</span>
                <span className="text-[11px] text-neutral-500">28 Watt Brushless DC</span>
              </button>
            </div>
          </div>

          {/* Number of Fans */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>Number of Fans in House</span>
              <span className="font-mono text-blue-400 font-bold">{numFans} Fans</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="1"
              value={numFans}
              onChange={(e) => setNumFans(parseFloat(e.target.value) || 1)}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Hours per day */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>Daily Running Hours (Average per fan)</span>
              <span className="font-mono text-blue-400 font-bold">{dailyHours} Hours/day</span>
            </div>
            <input
              type="range"
              min="2"
              max="24"
              step="1"
              value={dailyHours}
              onChange={(e) => setDailyHours(parseFloat(e.target.value) || 1)}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Unit Rate */}
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Electricity Tariff (₹/unit)</label>
            <input
              type="number"
              step="0.5"
              value={unitRate || ''}
              onChange={(e) => setUnitRate(parseFloat(e.target.value) || 0)}
              className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 rounded-xl px-3 py-2 font-mono text-white text-sm"
            />
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-6 space-y-6">
          <motion.div
            layout
            className="p-6 sm:p-8 rounded-3xl bg-neutral-900/90 light:bg-white border border-neutral-800 light:border-slate-200 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-400">
                Annual Fan Electricity Outflow
              </span>
              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                {result.monthlyUnitsKwh} Units/mo
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                ₹{result.annualCost.toLocaleString('en-IN')}
                <span className="text-lg text-neutral-400 font-normal"> / year</span>
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Monthly commitment: <span className="font-bold text-blue-400 font-mono">₹{result.monthlyCost.toLocaleString('en-IN')}/mo</span> ({result.dailyUnitsKwh} units/day across {numFans} fans)
              </p>
            </div>

            {/* BLDC Potential Savings */}
            {fanType === 'regular_induction' && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  Potential BLDC Savings:
                </span>
                <div className="text-2xl font-black font-mono text-emerald-400">
                  +₹{result.savingsIfBldcAnnual.toLocaleString('en-IN')} / year
                </div>
                <p className="text-[11px] text-neutral-300">
                  Upgrading {numFans} conventional fans to BLDC pays for itself completely in approximately 12–15 months.
                </p>
              </div>
            )}
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Inverter Backup Benefit</span>
            </div>
            <p>
              BLDC fans consume 60-65% less current from home inverters, extending battery backup time from 4 hours to almost 10 hours during extended power cuts.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
