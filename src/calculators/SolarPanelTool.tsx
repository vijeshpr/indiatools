import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Sun, IndianRupee, Layers, CheckCircle2, Award, Zap } from 'lucide-react'
import { calculateSolar, SolarResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const SolarPanelTool: React.FC = () => {
  const tool = getToolBySlug('solar-panel')!

  const [monthlyInput, setMonthlyInput] = useState<number>(300)
  const [isUnits, setIsUnits] = useState<boolean>(true) // Units (kWh) vs Rupees (₹)
  const [sunHours, setSunHours] = useState<number>(5.0)
  const [panelWattage, setPanelWattage] = useState<number>(540)

  const results: SolarResult = useMemo(() => {
    return calculateSolar(monthlyInput, isUnits, sunHours, panelWattage, 7.5)
  }, [monthlyInput, isUnits, sunHours, panelWattage])

  const handleReset = () => {
    setMonthlyInput(300)
    setIsUnits(true)
    setSunHours(5.0)
    setPanelWattage(540)
  }

  const getResultSummary = () => {
    return `Rooftop Solar & PM Surya Ghar Subsidy:
Monthly Consumption: ${monthlyInput} ${isUnits ? 'Units' : '₹'}
- Recommended Capacity: ${results.systemCapacityKw} kW (${results.panelCount} × ${panelWattage}W Panels)
- Roof Area Required: ${results.roofAreaSqft} sq.ft (Shadow-free)
- PM Surya Ghar Govt Subsidy: ₹${results.pmSuryaGharSubsidyRs.toLocaleString('en-IN')}
- Estimated Monthly Savings: ₹${results.monthlySavingsRs.toLocaleString('en-IN')}
- 25-Year Cumulative Savings: ₹${results.twentyFiveYearSavingsRs.toLocaleString('en-IN')}
Calculated on IndiaTools`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" />
              <span>Solar Rooftop Feasibility</span>
            </h2>
            <div className="flex rounded-lg bg-neutral-800/80 p-0.5 border border-neutral-700">
              <button
                type="button"
                onClick={() => setIsUnits(true)}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                  isUnits ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
                }`}
              >
                By Units (kWh)
              </button>
              <button
                type="button"
                onClick={() => setIsUnits(false)}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                  !isUnits ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
                }`}
              >
                By Bill (₹)
              </button>
            </div>
          </div>

          {/* Monthly Consumption */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600">
                {isUnits ? 'Monthly Electricity Consumption' : 'Average Monthly Bill'}
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="50"
                  max="10000"
                  value={monthlyInput || ''}
                  onChange={(e) => setMonthlyInput(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-lg px-2.5 py-1 text-sm font-mono text-right text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                />
                <span className="text-xs text-neutral-400 font-mono">
                  {isUnits ? 'Units' : '₹'}
                </span>
              </div>
            </div>
            <input
              type="range"
              min={isUnits ? 100 : 800}
              max={isUnits ? 1200 : 12000}
              step={isUnits ? 20 : 200}
              value={monthlyInput}
              onChange={(e) => setMonthlyInput(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Average Sun Hours */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600">
                Peak Sun Hours / Day
              </label>
              <span className="text-xs text-amber-400 font-mono font-bold">{sunHours} Hours / Day</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="6.5"
              step="0.1"
              value={sunHours}
              onChange={(e) => setSunHours(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              India averages 4.8 to 5.5 peak sun hours depending on latitude and monsoon cloud cover.
            </p>
          </div>

          {/* Panel Technology & Rating */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              Panel Rating (Wattage)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[400, 540, 580].map((watt) => (
                <button
                  key={watt}
                  type="button"
                  onClick={() => setPanelWattage(watt)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-colors ${
                    panelWattage === watt
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                      : 'bg-neutral-950 border-neutral-700 text-neutral-400'
                  }`}
                >
                  {watt}W Mono-PERC
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Results Card */}
        <div className="lg:col-span-6 space-y-4">
          <motion.div
            layout
            className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950/30 border border-amber-500/30 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                <Sun className="w-4 h-4" />
                <span>Recommended System Sizing</span>
              </span>
              <span className="text-xs font-bold text-neutral-400">
                {results.panelCount} Panels Needed
              </span>
            </div>

            {/* Capacity Headline */}
            <div className="mb-6 pb-6 border-b border-neutral-800">
              <span className="text-xs text-neutral-400 block font-medium">Recommended Solar System</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl sm:text-6xl font-black tracking-tight text-white">
                  {results.systemCapacityKw}
                </span>
                <span className="text-lg font-bold text-amber-400">kW Capacity</span>
              </div>
              <p className="mt-2 text-xs text-amber-300/90 font-mono">
                Generates ~{results.monthlyUnitsGenerated} units / month (Saves ₹{results.monthlySavingsRs.toLocaleString('en-IN')}/mo)
              </p>
            </div>

            {/* PM Surya Ghar Subsidy Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-neutral-900 border border-emerald-500/40 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-mono font-bold text-emerald-400">
                    PM Surya Ghar Muft Bijli Yojana
                  </h4>
                  <span className="text-[11px] text-neutral-300">Central Government Direct Subsidy</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                  ₹{results.pmSuryaGharSubsidyRs.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Multi Dimensions */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  <span>Roof Area Needed</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white font-mono">
                  {results.roofAreaSqft} sq.ft
                </p>
                <span className="text-[11px] text-neutral-400">Shadow-free roof</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                  <span>25-Yr Lifetime Savings</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white font-mono">
                  ₹{(results.twentyFiveYearSavingsRs / 100000).toFixed(1)} L
                </p>
                <span className="text-[11px] text-neutral-400">Cumulative ROI</span>
              </div>
            </div>
          </motion.div>

          <div className="p-4 rounded-xl bg-neutral-900/50 light:bg-slate-100 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              On-Grid solar with net-metering exports surplus daytime power to DISCOM, eliminating expensive battery replacements.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
