import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Compass, Fuel, Users, MapPin, CheckCircle2, IndianRupee } from 'lucide-react'
import { calculateRoadTrip, RoadTripResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const RoadTripTool: React.FC = () => {
  const tool = getToolBySlug('road-trip-planner')!

  const [distanceKm, setDistanceKm] = useState<number>(650)
  const [mileage, setMileage] = useState<number>(16)
  const [fuelPrice, setFuelPrice] = useState<number>(102)
  const [tollCost, setTollCost] = useState<number>(950)
  const [mealsAndOther, setMealsAndOther] = useState<number>(1800)
  const [passengers, setPassengers] = useState<number>(4)

  const result: RoadTripResult = useMemo(() => {
    return calculateRoadTrip(distanceKm, mileage, fuelPrice, tollCost, mealsAndOther, passengers)
  }, [distanceKm, mileage, fuelPrice, tollCost, mealsAndOther, passengers])

  const handleReset = () => {
    setDistanceKm(650)
    setMileage(16)
    setFuelPrice(102)
    setTollCost(950)
    setMealsAndOther(1800)
    setPassengers(4)
  }

  const getResultSummary = () => {
    return `Highway Road Trip Budget Summary:
- One-Way Distance: ${distanceKm} km
- Fuel Consumed: ${result.fuelLitres} Litres (₹${result.fuelCost.toLocaleString('en-IN')})
- FASTag Tolls: ₹${tollCost.toLocaleString('en-IN')}
- Meals & Highway Dhabas: ₹${mealsAndOther.toLocaleString('en-IN')}
--------------------------------------------------
TOTAL OUTFLOW: ₹${result.totalCost.toLocaleString('en-IN')}
PER PERSON SHARE: ₹${result.costPerPerson.toLocaleString('en-IN')} (${passengers} travellers)
EFFECTIVE COST PER KM: ₹${result.costPerKm}/km
Calculated via IndiaTools (https://indiatools-rho.vercel.app)`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-orange-500" />
              <span>Route & Vehicle Parameters</span>
            </h2>
            <span className="text-xs font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
              FASTag & Fuel Split
            </span>
          </div>

          {/* Distance */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>Trip Distance</span>
              <span className="font-mono text-orange-400 font-bold text-base">{distanceKm} km</span>
            </div>
            <input
              type="range"
              min="50"
              max="2500"
              step="25"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 50)}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </div>

          {/* Mileage & Fuel Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Highway Mileage (km/L)</label>
              <input
                type="number"
                step="0.5"
                value={mileage || ''}
                onChange={(e) => setMileage(parseFloat(e.target.value) || 1)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 rounded-xl px-3 py-2 font-mono text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Fuel Price (₹/L)</label>
              <input
                type="number"
                value={fuelPrice || ''}
                onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 rounded-xl px-3 py-2 font-mono text-white text-sm"
              />
            </div>
          </div>

          {/* Tolls & Meals */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">FASTag Tolls (₹)</label>
              <input
                type="number"
                value={tollCost || ''}
                onChange={(e) => setTollCost(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 rounded-xl px-3 py-2 font-mono text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Meals & Snacks (₹)</label>
              <input
                type="number"
                value={mealsAndOther || ''}
                onChange={(e) => setMealsAndOther(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 rounded-xl px-3 py-2 font-mono text-white text-sm"
              />
            </div>
          </div>

          {/* Passengers */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>Total Passengers Splitting Cost</span>
              <span className="font-mono text-orange-400 font-bold">{passengers} Travellers</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="1"
              value={passengers}
              onChange={(e) => setPassengers(parseFloat(e.target.value) || 1)}
              className="w-full accent-orange-500 cursor-pointer"
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
                Total Road Trip Budget
              </span>
              <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                ₹{result.costPerKm}/km
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                ₹{result.totalCost.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Share per person: <span className="font-bold text-emerald-400 font-mono text-base">₹{result.costPerPerson.toLocaleString('en-IN')} / head</span> ({passengers} passengers)
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">Fuel Cost ({result.fuelLitres} Litres)</span>
                <span className="font-mono font-bold text-white">₹{result.fuelCost.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">NHAI FASTag Toll Plaza</span>
                <span className="font-mono font-bold text-amber-400">₹{tollCost.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">Dhabas, Chai & Snacks</span>
                <span className="font-mono font-bold text-white">₹{mealsAndOther.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-orange-400" />
              <span>Speed & Fuel Consumption</span>
            </div>
            <p>
              Cruising at 80–90 km/h on Indian expressways gives 15-20% higher mileage than driving aggressively above 110 km/h with frequent braking.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
