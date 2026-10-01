import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { HardHat, Fuel, Clock, CheckCircle2, IndianRupee } from 'lucide-react'
import { calculateExcavatorCost, ExcavatorCostResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const ExcavatorCostTool: React.FC = () => {
  const tool = getToolBySlug('excavator-cost')!

  const [hoursWorked, setHoursWorked] = useState<number>(16)
  const [hireMode, setHireMode] = useState<'wet' | 'dry'>('dry')
  const [hourlyRate, setHourlyRate] = useState<number>(1100)
  const [dieselPrice, setDieselPrice] = useState<number>(90)
  const [litresPerHour, setLitresPerHour] = useState<number>(5.5)
  const [operatorBata, setOperatorBata] = useState<number>(500)
  const [days, setDays] = useState<number>(2)

  const result: ExcavatorCostResult = useMemo(() => {
    return calculateExcavatorCost(
      hoursWorked,
      hireMode,
      hourlyRate,
      dieselPrice,
      litresPerHour,
      operatorBata,
      days
    )
  }, [hoursWorked, hireMode, hourlyRate, dieselPrice, litresPerHour, operatorBata, days])

  const handleReset = () => {
    setHoursWorked(16)
    setHireMode('dry')
    setHourlyRate(1100)
    setDieselPrice(90)
    setLitresPerHour(5.5)
    setOperatorBata(500)
    setDays(2)
  }

  const getResultSummary = () => {
    return `Excavator & Earthmoving Working Cost Estimate:
- Work Duration: ${hoursWorked} Operating Hours over ${days} Days
- Contract Type: ${hireMode.toUpperCase()} HIRE (${hireMode === 'wet' ? 'Contractor supplies diesel' : 'Client supplies diesel'})
- Machine Rental: ₹${result.machineRent.toLocaleString('en-IN')} (at ₹${hourlyRate}/hr)
- Diesel Fuel Cost: ₹${result.dieselCost.toLocaleString('en-IN')} (${result.dieselLitresTotal} Litres)
- Operator Bata / Food Allowance: ₹${result.bataCost.toLocaleString('en-IN')}
--------------------------------------------------
TOTAL BILLING EXPENSE: ₹${result.totalCost.toLocaleString('en-IN')}
EFFECTIVE HOURLY RATE: ₹${result.effectiveHourlyCost}/hr
Calculated via India Practical Tools (https://indiapracticaltools.com)`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <HardHat className="w-5 h-5 text-amber-500" />
              <span>Rental & Operating Hours</span>
            </h2>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Wet vs Dry Hire
            </span>
          </div>

          {/* Hire Mode */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              Hire Contract Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setHireMode('dry')
                  setHourlyRate(1100)
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  hireMode === 'dry'
                    ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                    : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400'
                }`}
              >
                <span className="text-sm block font-bold text-white light:text-slate-900">Dry Hire</span>
                <span className="text-[11px] text-neutral-500">Site owner pays diesel</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setHireMode('wet')
                  setHourlyRate(1650)
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  hireMode === 'wet'
                    ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                    : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400'
                }`}
              >
                <span className="text-sm block font-bold text-white light:text-slate-900">Wet Hire</span>
                <span className="text-[11px] text-neutral-500">Contractor includes diesel</span>
              </button>
            </div>
          </div>

          {/* Hours and Days */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Total Operating Hours</label>
              <input
                type="number"
                value={hoursWorked || ''}
                onChange={(e) => setHoursWorked(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-3 py-2 font-mono text-white light:text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Number of Working Days</label>
              <input
                type="number"
                value={days || ''}
                onChange={(e) => setDays(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-3 py-2 font-mono text-white light:text-slate-900"
              />
            </div>
          </div>

          {/* Hourly Rate and Bata */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Hourly Machine Rent (₹/hr)</label>
              <input
                type="number"
                value={hourlyRate || ''}
                onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 rounded-xl px-3 py-2 font-mono text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Operator Bata (₹/day)</label>
              <input
                type="number"
                value={operatorBata || ''}
                onChange={(e) => setOperatorBata(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 rounded-xl px-3 py-2 font-mono text-white text-sm"
              />
            </div>
          </div>

          {/* Dry Hire fuel settings */}
          {hireMode === 'dry' && (
            <div className="p-4 rounded-xl bg-neutral-950/60 light:bg-slate-50 border border-neutral-800 space-y-3">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                Dry Hire Fuel Settings
              </span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Diesel Burn (L/hr)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={litresPerHour || ''}
                    onChange={(e) => setLitresPerHour(parseFloat(e.target.value) || 0)}
                    className="w-full bg-neutral-900 light:bg-white border border-neutral-700 rounded-lg px-3 py-1.5 font-mono text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Diesel Price (₹/L)</label>
                  <input
                    type="number"
                    value={dieselPrice || ''}
                    onChange={(e) => setDieselPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-neutral-900 light:bg-white border border-neutral-700 rounded-lg px-3 py-1.5 font-mono text-white text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Output */}
        <div className="lg:col-span-6 space-y-6">
          <motion.div
            layout
            className="p-6 sm:p-8 rounded-3xl bg-neutral-900/90 light:bg-white border border-neutral-800 light:border-slate-200 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-400">
                Total Contractor Bill
              </span>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                ₹{result.effectiveHourlyCost}/hour effective
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                ₹{result.totalCost.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Total for {hoursWorked} running hours across {days} days.
              </p>
            </div>

            {/* Breakdown */}
            <div className="space-y-3 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">Base Machine Hire</span>
                <span className="font-mono font-bold text-white">₹{result.machineRent.toLocaleString('en-IN')}</span>
              </div>

              {hireMode === 'dry' && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-300">Site Diesel ({result.dieselLitresTotal} Litres)</span>
                  <span className="font-mono font-bold text-amber-400">₹{result.dieselCost.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">Operator Daily Bata ({days} days)</span>
                <span className="font-mono font-bold text-white">₹{result.bataCost.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Contractor Advice</span>
            </div>
            <p>
              In hard rock or basement excavation, fuel consumption rises to 7.0–8.0 L/hr. For hard terrain, Wet Hire is often safer for the site owner as contractor absorbs excessive diesel spikes.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
