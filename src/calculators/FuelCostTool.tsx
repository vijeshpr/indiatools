import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Fuel, IndianRupee, MapPin, Leaf, CheckCircle2 } from 'lucide-react'
import { calculateFuelCost, FuelCostResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const FuelCostTool: React.FC = () => {
  const tool = getToolBySlug('fuel-cost')!

  const [distanceKm, setDistanceKm] = useState<number>(280)
  const [mileageKmPerL, setMileageKmPerL] = useState<number>(16)
  const [fuelPrice, setFuelPrice] = useState<number>(90)

  const results: FuelCostResult = useMemo(() => {
    return calculateFuelCost(distanceKm, mileageKmPerL, fuelPrice)
  }, [distanceKm, mileageKmPerL, fuelPrice])

  const handleReset = () => {
    setDistanceKm(280)
    setMileageKmPerL(16)
    setFuelPrice(90)
  }

  const getResultSummary = () => {
    return `Fuel Cost Projection:
Journey Distance: ${distanceKm} km | Mileage: ${mileageKmPerL} km/L | Fuel Price: ₹${fuelPrice}/L
- Fuel Required: ${results.totalFuelNeededL} Litres
- Total Fuel Expense: ₹${results.totalCost.toLocaleString('en-IN')}
- Cost per Km: ₹${results.costPerKm} / km
- CO2 Emissions: ~${results.co2EmissionsKg} kg CO2
Calculated on India Practical Tools`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-500" />
              <span>Route & Vehicle Economy</span>
            </h2>
            <span className="text-xs font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
              Trip Budgeting
            </span>
          </div>

          {/* Planned Distance */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600">
                Total Distance to Travel
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={distanceKm || ''}
                  onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-lg px-2.5 py-1 text-sm font-mono text-right text-orange-400 font-bold focus:outline-none focus:border-orange-500"
                />
                <span className="text-xs text-neutral-400 font-mono">km</span>
              </div>
            </div>
            <input
              type="range"
              min="10"
              max="1500"
              step="10"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
              <span>50 km</span>
              <span>300 km (Intercity)</span>
              <span>1000+ km (Cross-state)</span>
            </div>
          </div>

          {/* Vehicle Mileage */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600">
                Vehicle Mileage (km / Litre)
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.5"
                  min="2"
                  max="100"
                  value={mileageKmPerL || ''}
                  onChange={(e) => setMileageKmPerL(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-lg px-2.5 py-1 text-sm font-mono text-right text-orange-400 font-bold focus:outline-none focus:border-orange-500"
                />
                <span className="text-xs text-neutral-400 font-mono">km/L</span>
              </div>
            </div>
            <input
              type="range"
              min="8"
              max="65"
              step="1"
              value={mileageKmPerL}
              onChange={(e) => setMileageKmPerL(parseFloat(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setMileageKmPerL(45)}
                className="px-2 py-0.5 rounded bg-neutral-800 text-[11px] text-neutral-300 hover:text-white"
              >
                Bike (~45 km/L)
              </button>
              <button
                type="button"
                onClick={() => setMileageKmPerL(18)}
                className="px-2 py-0.5 rounded bg-neutral-800 text-[11px] text-neutral-300 hover:text-white"
              >
                Hatchback (~18)
              </button>
              <button
                type="button"
                onClick={() => setMileageKmPerL(14)}
                className="px-2 py-0.5 rounded bg-neutral-800 text-[11px] text-neutral-300 hover:text-white"
              >
                SUV (~14)
              </button>
            </div>
          </div>

          {/* Fuel Price */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              Fuel Rate (₹ / Litre)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-neutral-400 text-sm font-bold">₹</span>
              <input
                type="number"
                min="50"
                max="180"
                step="0.5"
                value={fuelPrice || ''}
                onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl pl-8 pr-4 py-2.5 text-base font-bold text-white light:text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Right Results */}
        <div className="lg:col-span-6 space-y-4">
          <motion.div
            layout
            className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-orange-950/30 border border-orange-500/30 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-orange-400 font-semibold flex items-center gap-1.5">
                <Fuel className="w-4 h-4" />
                <span>Total Fuel Budget</span>
              </span>
              <span className="text-xs font-semibold text-neutral-400 font-mono">
                {distanceKm} km trip
              </span>
            </div>

            {/* Total Rupees */}
            <div className="mb-6 pb-6 border-b border-neutral-800">
              <span className="text-xs text-neutral-400 block font-medium">Estimated Fuel Cost</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl sm:text-6xl font-black tracking-tight text-white">
                  ₹{results.totalCost.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="mt-2 text-xs text-orange-300/90 font-mono">
                Requires {results.totalFuelNeededL} Litres at ₹{fuelPrice}/L
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                  <Fuel className="w-3.5 h-3.5 text-orange-400" />
                  <span>Litres Needed</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white font-mono">
                  {results.totalFuelNeededL} L
                </p>
                <span className="text-[11px] text-neutral-400">Total volume</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cost per Km</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white font-mono">
                  ₹{results.costPerKm}
                </p>
                <span className="text-[11px] text-neutral-400">Per km travel</span>
              </div>
            </div>

            <div className="mt-5 p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>Estimated CO2 Emissions:</span>
              </span>
              <span className="font-bold text-white text-sm font-mono">
                ~{results.co2EmissionsKg} kg CO2
              </span>
            </div>
          </motion.div>

          <div className="p-4 rounded-xl bg-neutral-900/50 light:bg-slate-100 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Always keep at least 5 litres reserve fuel in your vehicle before entering ghat roads or interstate expressways.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
