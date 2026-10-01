import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Zap, Fuel, TrendingUp, CheckCircle2, IndianRupee } from 'lucide-react'
import { calculateEvVsPetrol, EvVsPetrolResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const EvVsPetrolTool: React.FC = () => {
  const tool = getToolBySlug('ev-vs-petrol')!

  const [monthlyKm, setMonthlyKm] = useState<number>(1500)
  const [petrolPrice, setPetrolPrice] = useState<number>(102)
  const [electricityRate, setElectricityRate] = useState<number>(8.5)
  const [petrolMileage, setPetrolMileage] = useState<number>(14)
  const [evEfficiency, setEvEfficiency] = useState<number>(7.5) // 7.5 km per kWh (e.g. Nexon EV / Tiago EV)
  const [extraPriceEv, setExtraPriceEv] = useState<number>(350000)

  const result: EvVsPetrolResult = useMemo(() => {
    return calculateEvVsPetrol(
      monthlyKm,
      petrolPrice,
      electricityRate,
      petrolMileage,
      evEfficiency,
      extraPriceEv
    )
  }, [monthlyKm, petrolPrice, electricityRate, petrolMileage, evEfficiency, extraPriceEv])

  const handleReset = () => {
    setMonthlyKm(1500)
    setPetrolPrice(102)
    setElectricityRate(8.5)
    setPetrolMileage(14)
    setEvEfficiency(7.5)
    setExtraPriceEv(350000)
  }

  const getResultSummary = () => {
    return `Electric Vehicle (EV) vs Petrol Economics:
- Monthly Driving: ${monthlyKm} km
- Petrol Running Cost: ₹${result.petrolCostPerKm}/km (₹${result.petrolMonthlyCost.toLocaleString('en-IN')}/mo)
- EV Running Cost: ₹${result.evCostPerKm}/km (₹${result.evMonthlyCost.toLocaleString('en-IN')}/mo)
- Net Monthly Savings with EV: ₹${result.monthlySavingsWithEv.toLocaleString('en-IN')}
- Annual Energy Savings: ₹${result.annualSavings.toLocaleString('en-IN')}
- Breakeven Distance: ${result.breakevenKm.toLocaleString('en-IN')} km (~${result.breakevenYears} Years)
Calculated via IndiaTools (https://indiatools-rho.vercel.app)`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>EV vs ICE Parameters</span>
            </h2>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Green Mobility TCO
            </span>
          </div>

          {/* Monthly Distance */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>Expected Monthly Driving</span>
              <span className="font-mono text-emerald-400 font-bold">{monthlyKm.toLocaleString('en-IN')} km/month</span>
            </div>
            <input
              type="range"
              min="500"
              max="5000"
              step="50"
              value={monthlyKm}
              onChange={(e) => setMonthlyKm(parseFloat(e.target.value) || 0)}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Side by side inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-neutral-950/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 space-y-3">
              <span className="text-xs font-mono font-bold text-orange-400 uppercase">Petrol ICE</span>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Petrol Price (₹/L)</label>
                <input
                  type="number"
                  value={petrolPrice || ''}
                  onChange={(e) => setPetrolPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-900 light:bg-white border border-neutral-700 light:border-slate-300 rounded-lg px-3 py-2 font-mono text-white light:text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">ICE Mileage (km/L)</label>
                <input
                  type="number"
                  step="0.5"
                  value={petrolMileage || ''}
                  onChange={(e) => setPetrolMileage(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-900 light:bg-white border border-neutral-700 light:border-slate-300 rounded-lg px-3 py-2 font-mono text-white light:text-slate-900 text-sm"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 space-y-3">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Electric (EV)</span>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Power Tariff (₹/kWh)</label>
                <input
                  type="number"
                  step="0.5"
                  value={electricityRate || ''}
                  onChange={(e) => setElectricityRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-900 light:bg-white border border-neutral-700 light:border-slate-300 rounded-lg px-3 py-2 font-mono text-white light:text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">EV Efficiency (km/kWh)</label>
                <input
                  type="number"
                  step="0.5"
                  value={evEfficiency || ''}
                  onChange={(e) => setEvEfficiency(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-900 light:bg-white border border-neutral-700 light:border-slate-300 rounded-lg px-3 py-2 font-mono text-white light:text-slate-900 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Upfront Price Gap */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-1.5">
              EV Upfront Price Premium over ICE (₹)
            </label>
            <input
              type="number"
              step="10000"
              value={extraPriceEv || ''}
              onChange={(e) => setExtraPriceEv(parseFloat(e.target.value) || 0)}
              className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-4 py-2.5 font-mono text-white light:text-slate-900 focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              Include state EV subsidy deductions, registration tax exemptions (0% road tax in many Indian states).
            </p>
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
                Annual Fuel Savings
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Save ~85% on Fuel
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-emerald-400">
                ₹{result.annualSavings.toLocaleString('en-IN')}
                <span className="text-xl text-neutral-400 font-normal"> / year</span>
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Monthly in-pocket savings: <span className="font-bold text-white light:text-slate-900 font-mono">₹{result.monthlySavingsWithEv.toLocaleString('en-IN')}/month</span>
              </p>
            </div>

            {/* Per Km Comparison */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800 light:border-slate-200">
                <span className="text-[11px] text-neutral-400 block mb-1">Petrol Cost/Km</span>
                <span className="text-xl font-bold font-mono text-orange-400">₹{result.petrolCostPerKm}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800 light:border-slate-200">
                <span className="text-[11px] text-neutral-400 block mb-1">EV Electricity/Km</span>
                <span className="text-xl font-bold font-mono text-emerald-400">₹{result.evCostPerKm}</span>
              </div>
            </div>

            {/* Breakeven Timeline */}
            <div className="mt-5 p-4 rounded-xl bg-neutral-950/80 light:bg-slate-50 border border-neutral-800 light:border-slate-200">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-400">Upfront Price Breakeven:</span>
                <span className="text-white font-mono font-bold">{result.breakevenYears} Years ({result.breakevenKm.toLocaleString('en-IN')} km)</span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Based on your {monthlyKm.toLocaleString('en-IN')} km/month driving pattern and home charging rates.
              </p>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Real World Nuance</span>
            </div>
            <p>
              Highway fast-charging (DC 50kW+) in India typically costs ₹18 to ₹24 per unit (including GST and convenience fees), raising EV cost per km to ~₹3.00/km on outstation trips. However, 85-90% of typical personal charging happens at home overnight at domestic DISCOM rates.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
