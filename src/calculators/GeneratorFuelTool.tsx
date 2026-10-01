import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Zap, Fuel, Clock, CheckCircle2, IndianRupee } from 'lucide-react'
import { calculateGeneratorFuel, GeneratorFuelResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

const DG_CAPACITIES = [
  { kva: 5, label: '5 kVA', desc: 'Shop / Clinic / Small Office' },
  { kva: 10, label: '10 kVA', desc: 'Duplex Home / Restaurant' },
  { kva: 25, label: '25 kVA', desc: 'Commercial Complex / Small Hospital' },
  { kva: 62.5, label: '62.5 kVA', desc: 'Mid Residential Apartment Block' },
  { kva: 125, label: '125 kVA', desc: 'High-Rise / Manufacturing Plant' },
]

export const GeneratorFuelTool: React.FC = () => {
  const tool = getToolBySlug('generator-fuel-cost')!

  const [kvaRating, setKvaRating] = useState<number>(25)
  const [loadPercentage, setLoadPercentage] = useState<number>(75)
  const [hoursRun, setHoursRun] = useState<number>(4)
  const [dieselPrice, setDieselPrice] = useState<number>(90)

  const result: GeneratorFuelResult = useMemo(() => {
    return calculateGeneratorFuel(kvaRating, loadPercentage, hoursRun, dieselPrice)
  }, [kvaRating, loadPercentage, hoursRun, dieselPrice])

  const handleReset = () => {
    setKvaRating(25)
    setLoadPercentage(75)
    setHoursRun(4)
    setDieselPrice(90)
  }

  const getResultSummary = () => {
    return `Diesel Generator (DG Set) Fuel Expense Projection:
- DG Rating: ${kvaRating} kVA (Operating at ${loadPercentage}% Load)
- Run Duration: ${hoursRun} Hours
- Hourly Diesel Consumption: ${result.hourlyLitres} Litres/hr (₹${result.hourlyCost}/hr)
- Total Diesel Consumed: ${result.totalLitres} Litres
-------------------------------------------------
TOTAL DIESEL COST: ₹${result.totalCost.toLocaleString('en-IN')} (at ₹${dieselPrice}/Litre)
POWER GENERATED: ${result.totalUnitsKwh} kWh Units
EFFECTIVE GENERATION COST: ₹${result.effectiveCostPerUnit} per kWh Unit
Calculated via IndiaTools (https://indiatools-rho.vercel.app)`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>DG Set Specifications</span>
            </h2>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Kirloskar / Cummins Standard
            </span>
          </div>

          {/* Preset Capacities */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              Select Generator Capacity (kVA)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DG_CAPACITIES.map((c) => (
                <button
                  key={c.kva}
                  type="button"
                  onClick={() => setKvaRating(c.kva)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    kvaRating === c.kva
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="text-sm block">{c.label}</span>
                  <span className="text-[10px] text-neutral-500 block leading-tight">{c.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom kVA */}
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Custom kVA Rating</label>
            <input
              type="number"
              value={kvaRating || ''}
              onChange={(e) => setKvaRating(parseFloat(e.target.value) || 0)}
              className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-3.5 py-2 font-mono text-white light:text-slate-900"
            />
          </div>

          {/* Load Percentage */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-1.5 font-medium">
              <span>Operating Load Level</span>
              <span className="font-mono text-amber-400 font-bold">{loadPercentage}% Load</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={loadPercentage}
              onChange={(e) => setLoadPercentage(parseFloat(e.target.value) || 20)}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-500 mt-1">
              <span>50% (Light)</span>
              <span>75% (Typical Duty)</span>
              <span>100% (Full Rated)</span>
            </div>
          </div>

          {/* Hours and Diesel Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Running Hours</label>
              <input
                type="number"
                step="0.5"
                value={hoursRun || ''}
                onChange={(e) => setHoursRun(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 rounded-xl px-3 py-2 font-mono text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Diesel Price (₹/L)</label>
              <input
                type="number"
                value={dieselPrice || ''}
                onChange={(e) => setDieselPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 rounded-xl px-3 py-2 font-mono text-white text-sm"
              />
            </div>
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
                Total Diesel Fuel Outflow
              </span>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {result.hourlyLitres} Litres / hour
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                ₹{result.totalCost.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Hourly Operating Expense: <span className="font-bold text-amber-400 font-mono">₹{result.hourlyCost}/hr</span> ({result.hourlyLitres} L/hr)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-1">Cost Per Unit Generated</span>
                <span className="text-lg font-bold font-mono text-amber-400">
                  ₹{result.effectiveCostPerUnit} / kWh
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">Grid power is ~₹8.50/unit</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-1">Total Power Output</span>
                <span className="text-lg font-bold font-mono text-white">
                  {result.totalUnitsKwh} kWh
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">Across {hoursRun} hours</span>
              </div>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Commercial Solar Synergy</span>
            </div>
            <p>
              Generating power via DG set costs ₹{result.effectiveCostPerUnit}/unit—nearly triple the commercial grid tariff. Businesses investing in rooftop solar or BESS (Battery Energy Storage Systems) recover capital within 2.5 years by cutting diesel generator runtime.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
