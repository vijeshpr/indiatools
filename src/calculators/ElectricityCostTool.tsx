import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Zap, IndianRupee, Leaf, CheckCircle2, Sliders } from 'lucide-react'
import { calculateElectricity, ElectricityResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const ElectricityCostTool: React.FC = () => {
  const tool = getToolBySlug('electricity-cost')!

  const [mode, setMode] = useState<'units' | 'appliance'>('units')
  const [monthlyUnits, setMonthlyUnits] = useState<number>(280)
  const [ratePerUnit, setRatePerUnit] = useState<number>(7.0)

  // Appliance mode state
  const [acHours, setAcHours] = useState<number>(6)
  const [fanCount, setFanCount] = useState<number>(3)
  const [fanHours, setFanHours] = useState<number>(12)
  const [tvHours, setTvHours] = useState<number>(4)
  const [hasFridge, setHasFridge] = useState<boolean>(true)

  // Compute units from appliances if in appliance mode
  const effectiveMonthlyUnits = useMemo(() => {
    if (mode === 'units') return monthlyUnits
    // AC ~1200W, Fan ~75W, TV ~100W, Fridge ~1.5 kWh/day
    const acUnitsDaily = (1200 * acHours) / 1000
    const fanUnitsDaily = (75 * fanCount * fanHours) / 1000
    const tvUnitsDaily = (100 * tvHours) / 1000
    const fridgeDaily = hasFridge ? 1.5 : 0
    const dailyTotal = acUnitsDaily + fanUnitsDaily + tvUnitsDaily + fridgeDaily + 1.2 // base lights & chargers
    return Math.round(dailyTotal * 30)
  }, [mode, monthlyUnits, acHours, fanCount, fanHours, tvHours, hasFridge])

  const results: ElectricityResult = useMemo(() => {
    return calculateElectricity(effectiveMonthlyUnits, ratePerUnit)
  }, [effectiveMonthlyUnits, ratePerUnit])

  const handleReset = () => {
    setMode('units')
    setMonthlyUnits(280)
    setRatePerUnit(7.0)
    setAcHours(6)
    setFanCount(3)
    setFanHours(12)
    setTvHours(4)
    setHasFridge(true)
  }

  const getResultSummary = () => {
    return `Electricity Bill & Power Consumption:
Units: ${results.monthlyUnitsKwh} kWh / month (${results.dailyUnitsKwh} kWh / day)
Rate Base: ₹${ratePerUnit}/unit (Progressive slab breakdown)
- Estimated Monthly Bill: ₹${results.estimatedMonthlyBill.toLocaleString('en-IN')}
- Estimated Annual Bill: ₹${results.estimatedAnnualBill.toLocaleString('en-IN')}
- Carbon Footprint: ~${results.carbonFootprintKg} kg CO2 / month
Calculated on IndiaTools`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              <span>Electricity Usage Sizing</span>
            </h2>
            <div className="flex rounded-lg bg-neutral-800/80 p-0.5 border border-neutral-700">
              <button
                type="button"
                onClick={() => setMode('units')}
                className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors ${
                  mode === 'units'
                    ? 'bg-blue-500 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Enter Units
              </button>
              <button
                type="button"
                onClick={() => setMode('appliance')}
                className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors ${
                  mode === 'appliance'
                    ? 'bg-blue-500 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Appliance Estimator
              </button>
            </div>
          </div>

          {mode === 'units' ? (
            /* Mode 1: Direct Monthly Units */
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600">
                    Monthly Consumption (Units / kWh)
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="10"
                      max="3000"
                      value={monthlyUnits || ''}
                      onChange={(e) => setMonthlyUnits(parseInt(e.target.value) || 0)}
                      className="w-24 bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-lg px-2.5 py-1 text-sm font-mono text-right text-blue-400 font-bold focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-xs text-neutral-400 font-mono">kWh</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="30"
                  max="1000"
                  step="10"
                  value={monthlyUnits}
                  onChange={(e) => setMonthlyUnits(parseInt(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                  <span>100 Units (Low)</span>
                  <span>280 Units (Typical 2BHK)</span>
                  <span>600+ Units (Heavy AC)</span>
                </div>
              </div>
            </div>
          ) : (
            /* Mode 2: Multi Appliance Sizing */
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs text-neutral-300">
                Adjust key high-consumption appliances to project your monthly electricity usage:
              </div>

              {/* AC Usage */}
              <div>
                <div className="flex justify-between text-xs text-neutral-300 mb-1">
                  <span>1.5 Ton AC Usage</span>
                  <span className="font-bold text-blue-400 font-mono">{acHours} hrs / day</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="18"
                  value={acHours}
                  onChange={(e) => setAcHours(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              {/* Ceiling Fans */}
              <div>
                <div className="flex justify-between text-xs text-neutral-300 mb-1">
                  <span>Ceiling Fans ({fanCount} Fans)</span>
                  <span className="font-bold text-blue-400 font-mono">{fanHours} hrs / day</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={fanHours}
                  onChange={(e) => setFanHours(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              {/* TV & Fridge */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs text-neutral-300 block mb-1">LED TV (hrs/day)</label>
                  <input
                    type="number"
                    min="0"
                    max="16"
                    value={tvHours}
                    onChange={(e) => setTvHours(parseInt(e.target.value) || 0)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-300 block mb-1">Refrigerator</label>
                  <button
                    type="button"
                    onClick={() => setHasFridge(!hasFridge)}
                    className={`w-full p-2 rounded-lg text-xs font-semibold border ${
                      hasFridge
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                    }`}
                  >
                    {hasFridge ? '24/7 Active' : 'None'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Slab Rate Tuning */}
          <div className="pt-2 border-t border-neutral-800">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600">
                Average Unit Tariff (₹ / kWh)
              </label>
              <span className="text-xs text-blue-400 font-mono font-bold">₹{ratePerUnit} / unit</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="12.0"
              step="0.5"
              value={ratePerUnit}
              onChange={(e) => setRatePerUnit(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Results */}
        <div className="lg:col-span-6 space-y-4">
          <motion.div
            layout
            className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-blue-950/30 border border-blue-500/30 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>Monthly Bill Projection</span>
              </span>
              <span className="text-xs font-bold text-neutral-400">
                {results.monthlyUnitsKwh} Units Consumed
              </span>
            </div>

            {/* Bill Amount */}
            <div className="mb-6 pb-6 border-b border-neutral-800">
              <span className="text-xs text-neutral-400 block font-medium">Estimated Monthly Power Bill</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl sm:text-6xl font-black tracking-tight text-white">
                  ₹{results.estimatedMonthlyBill.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-semibold text-neutral-400">/ month</span>
              </div>
              <p className="mt-2 text-xs text-blue-300/90 font-mono">
                Daily burn: {results.dailyUnitsKwh} units / day (~₹{Math.round(results.estimatedMonthlyBill / 30)}/day)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                  <IndianRupee className="w-3.5 h-3.5 text-blue-400" />
                  <span>Annual Power Bill</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white font-mono">
                  ₹{results.estimatedAnnualBill.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-neutral-400">12 Months total</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CO2 Emissions</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white font-mono">
                  {results.carbonFootprintKg} kg
                </p>
                <span className="text-[11px] text-neutral-400">Per month</span>
              </div>
            </div>

            <div className="mt-5 p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400">Solar Potential:</span>
              <span className="font-bold text-amber-400 text-xs">
                Can be reduced to ₹0 with ~{(results.monthlyUnitsKwh / 120).toFixed(1)} kW Solar
              </span>
            </div>
          </motion.div>

          <div className="p-4 rounded-xl bg-neutral-900/50 light:bg-slate-100 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Setting your Air Conditioner thermostat to 24°C instead of 18°C saves up to 24% electricity over a summer billing cycle.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
