import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Flame, Calendar, CheckCircle2, IndianRupee } from 'lucide-react'
import { calculateLpgUsage, LpgResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const LpgUsageTool: React.FC = () => {
  const tool = getToolBySlug('lpg-usage')!

  const [numPersons, setNumPersons] = useState<number>(4)
  const [cookingHoursDaily, setCookingHoursDaily] = useState<number>(2.5)
  const [cylinderPrice, setCylinderPrice] = useState<number>(850)

  const result: LpgResult = useMemo(() => {
    return calculateLpgUsage(numPersons, cookingHoursDaily, cylinderPrice)
  }, [numPersons, cookingHoursDaily, cylinderPrice])

  const handleReset = () => {
    setNumPersons(4)
    setCookingHoursDaily(2.5)
    setCylinderPrice(850)
  }

  const getResultSummary = () => {
    return `LPG Cooking Gas Cylinder Duration & Refill Projection:
- Family Members: ${numPersons} Persons (${cookingHoursDaily} cooking hours daily)
- 14.2kg Cylinder Lasts: ~${result.daysCylinderLasts} Days (~${(result.daysCylinderLasts / 7).toFixed(1)} Weeks)
- Total Burner Cooking Capacity: ~${result.totalCookingHours} Hours
- Daily Gas Cost: ₹${result.dailyCostRs} / day
- Estimated Monthly Expense: ₹${result.monthlyExpenditureRs.toLocaleString('en-IN')} (at ₹${cylinderPrice}/cylinder)
Calculated via India Practical Tools (https://indiapracticaltools.com)`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-500" />
              <span>Household Cooking Frequency</span>
            </h2>
            <span className="text-xs font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              14.2 kg Domestic Cylinder
            </span>
          </div>

          {/* Members */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>Family Members</span>
              <span className="font-mono text-red-400 font-bold">{numPersons} Persons</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={numPersons}
              onChange={(e) => setNumPersons(parseFloat(e.target.value) || 1)}
              className="w-full accent-red-500 cursor-pointer"
            />
          </div>

          {/* Cooking Hours Daily */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>Daily Stove Burning Hours</span>
              <span className="font-mono text-red-400 font-bold">{cookingHoursDaily} Hours/day</span>
            </div>
            <input
              type="range"
              min="1"
              max="6"
              step="0.5"
              value={cookingHoursDaily}
              onChange={(e) => setCookingHoursDaily(parseFloat(e.target.value) || 1)}
              className="w-full accent-red-500 cursor-pointer"
            />
          </div>

          {/* Cylinder Price */}
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Cylinder Price (₹)</label>
            <input
              type="number"
              value={cylinderPrice || ''}
              onChange={(e) => setCylinderPrice(parseFloat(e.target.value) || 0)}
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
                Expected Cylinder Lifespan
              </span>
              <span className="text-xs font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                ~{(result.daysCylinderLasts / 7).toFixed(1)} Weeks
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                {result.daysCylinderLasts}
                <span className="text-xl text-neutral-400 font-normal"> Days</span>
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Monthly Fuel Outflow: <span className="font-bold text-red-400 font-mono">₹{result.monthlyExpenditureRs.toLocaleString('en-IN')}/mo</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-1">Daily Gas Cost</span>
                <span className="text-lg font-bold font-mono text-white">
                  ₹{result.dailyCostRs} / day
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">Average running</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-1">Total Cooking Capacity</span>
                <span className="text-lg font-bold font-mono text-white">
                  ~{result.totalCookingHours} Hours
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">Flame time</span>
              </div>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-red-400" />
              <span>Petroleum Conservation Research Association (PCRA) Tip</span>
            </div>
            <p>
              Using a pressure cooker reduces LPG consumption by up to 30%. Also, keeping ingredients ready before lighting the stove and covering cooking pans avoids heat loss, extending cylinder lifespan by 6 to 9 days.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
