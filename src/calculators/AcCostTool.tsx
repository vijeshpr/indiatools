import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Zap, Thermometer, CheckCircle2, TrendingDown, IndianRupee } from 'lucide-react'
import { calculateAcCost, AcCostResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const AcCostTool: React.FC = () => {
  const tool = getToolBySlug('ac-electricity-cost')!

  const [tonnage, setTonnage] = useState<1 | 1.5 | 2>(1.5)
  const [starRating, setStarRating] = useState<3 | 5>(5)
  const [isInverter, setIsInverter] = useState<boolean>(true)
  const [dailyHours, setDailyHours] = useState<number>(8)
  const [unitRate, setUnitRate] = useState<number>(8.5)

  const result: AcCostResult = useMemo(() => {
    return calculateAcCost(tonnage, starRating, isInverter, dailyHours, unitRate)
  }, [tonnage, starRating, isInverter, dailyHours, unitRate])

  const handleReset = () => {
    setTonnage(1.5)
    setStarRating(5)
    setIsInverter(true)
    setDailyHours(8)
    setUnitRate(8.5)
  }

  const getResultSummary = () => {
    return `Air Conditioner (AC) Electricity Cost Breakdown:
- AC Specification: ${tonnage} Ton, ${starRating}-Star ${isInverter ? 'Dual Inverter' : 'Fixed Speed'} AC
- Running Schedule: ${dailyHours} hours/day at ₹${unitRate}/unit
- Daily Consumption: ${result.dailyUnitsKwh} kWh Units (₹${result.dailyCostRs}/day)
- Monthly Consumption: ${result.monthlyUnitsKwh} kWh Units
------------------------------------------------
MONTHLY ELECTRICITY BILL: ₹${result.monthlyCostRs.toLocaleString('en-IN')}
4-MONTH SUMMER SEASON BILL: ₹${result.summerSeasonCostRs.toLocaleString('en-IN')}
Average Power Draw: ${result.averagePowerWatts} Watts
${starRating === 3 ? `Upgrade Tip: A 5-Star AC saves ~₹${result.fiveStarSavingsMonthly}/month in electricity!` : 'Optimal: 5-Star Inverter gives maximum efficiency!'}
Calculated via India Practical Tools (https://indiapracticaltools.com)`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              <span>Air Conditioner Specifications</span>
            </h2>
            <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              BEE ISEER Standard
            </span>
          </div>

          {/* Tonnage */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              AC Capacity (Tonnage)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([1, 1.5, 2] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTonnage(t)}
                  className={`py-2.5 rounded-xl border font-bold text-sm transition-all ${
                    tonnage === t
                      ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                      : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400'
                  }`}
                >
                  {t} Ton
                </button>
              ))}
            </div>
          </div>

          {/* Star & Inverter */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1.5">BEE Star Rating</label>
              <div className="flex gap-2">
                {([3, 5] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStarRating(s)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold ${
                      starRating === s ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    ★ {s}-Star
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1.5">Compressor Tech</label>
              <div className="flex gap-2">
                {[true, false].map((inv) => (
                  <button
                    key={String(inv)}
                    type="button"
                    onClick={() => setIsInverter(inv)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold ${
                      isInverter === inv ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    {inv ? 'Inverter' : 'Fixed'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Daily Hours Slider */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>Daily Run Time</span>
              <span className="font-mono text-blue-400 font-bold">{dailyHours} Hours/day</span>
            </div>
            <input
              type="range"
              min="1"
              max="24"
              step="1"
              value={dailyHours}
              onChange={(e) => setDailyHours(parseFloat(e.target.value) || 0)}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Tariff */}
          <div>
            <label className="block text-xs text-neutral-400 mb-1">DISCOM Tariff (₹/unit)</label>
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
                Monthly AC Electricity Bill
              </span>
              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                {result.monthlyUnitsKwh} Units/mo
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                ₹{result.monthlyCostRs.toLocaleString('en-IN')}
                <span className="text-lg text-neutral-400 font-normal"> / month</span>
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Daily expense: <span className="font-bold text-blue-400 font-mono">₹{result.dailyCostRs}/day</span> ({result.dailyUnitsKwh} units/day)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-1">4-Month Summer Bill</span>
                <span className="text-lg font-bold font-mono text-white">
                  ₹{result.summerSeasonCostRs.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">Peak cooling period</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-1">Average Power Draw</span>
                <span className="text-lg font-bold font-mono text-white">
                  {result.averagePowerWatts} Watts
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">With inverter cycling</span>
              </div>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <span>BEE 24°C Recommendation</span>
            </div>
            <p>
              According to the Bureau of Energy Efficiency (BEE), setting your AC temperature to 24°C rather than 18°C reduces power load by 24% and preserves compressor lifespan.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
