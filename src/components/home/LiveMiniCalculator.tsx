import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gauge, Fuel, IndianRupee, ArrowRight, Sparkles } from 'lucide-react'
import { calculateMileage } from '../../lib/calculations'

export const LiveMiniCalculator: React.FC = () => {
  const [distanceKm, setDistanceKm] = useState<number>(465)
  const [fuelLitres, setFuelLitres] = useState<number>(25)
  const [fuelPrice, setFuelPrice] = useState<number>(102)

  const mileageResult = useMemo(() => {
    return calculateMileage(distanceKm, fuelLitres, fuelPrice)
  }, [distanceKm, fuelLitres, fuelPrice])

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl bg-neutral-900/90 dark:bg-neutral-900/90 light:bg-white border border-neutral-700/80 light:border-slate-200 shadow-2xl shadow-black/40 overflow-hidden backdrop-blur-xl">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-neutral-800 light:border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-500/15 text-orange-400 border border-orange-500/30 flex items-center justify-center">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-white light:text-slate-900">
                Instant Mileage & Running Cost
              </h3>
              <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                Live Interactive
              </span>
            </div>
            <p className="text-xs text-neutral-400 light:text-slate-500">
              Try it directly — zero page refresh or signup required
            </p>
          </div>
        </div>

        <Link
          to="/calculators/vehicle-mileage"
          className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Open Full Tool</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Calculator Body: Inputs on Left, Animated Result on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center">
        {/* Inputs */}
        <div className="md:col-span-7 space-y-4">
          {/* Distance */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-1.5 font-medium">
              <span>Distance Travelled</span>
              <span className="font-mono text-amber-400 font-bold">{distanceKm} km</span>
            </div>
            <input
              type="range"
              min="50"
              max="900"
              step="5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Fuel Filled */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-1.5 font-medium">
              <span>Fuel Consumed (Litres)</span>
              <span className="font-mono text-amber-400 font-bold">{fuelLitres} Litres</span>
            </div>
            <input
              type="range"
              min="3"
              max="60"
              step="1"
              value={fuelLitres}
              onChange={(e) => setFuelLitres(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Fuel Price Buttons */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-neutral-400">Fuel Rate:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFuelPrice(102)}
                className={`px-2.5 py-1 text-xs rounded-lg font-mono font-medium border transition-colors ${
                  fuelPrice === 102
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                    : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                }`}
              >
                Petrol ₹102
              </button>
              <button
                type="button"
                onClick={() => setFuelPrice(90)}
                className={`px-2.5 py-1 text-xs rounded-lg font-mono font-medium border transition-colors ${
                  fuelPrice === 90
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                    : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                }`}
              >
                Diesel ₹90
              </button>
            </div>
          </div>
        </div>

        {/* Live Animated Output */}
        <div className="md:col-span-5 p-5 rounded-2xl bg-neutral-950/90 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-center relative overflow-hidden">
          <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1 font-semibold">
            Fuel Mileage
          </div>

          <motion.div
            key={mileageResult.mileageKmPerL}
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-baseline justify-center gap-1.5 my-1"
          >
            <span className="text-4xl sm:text-5xl font-black text-white light:text-slate-900 font-mono tracking-tight">
              {mileageResult.mileageKmPerL}
            </span>
            <span className="text-sm font-bold text-amber-400 font-mono">KM/L</span>
          </motion.div>

          <div className="mt-3 pt-3 border-t border-neutral-800/80 light:border-slate-200 flex items-center justify-around text-xs">
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-mono">Running Cost</span>
              <span className="font-bold text-white light:text-slate-900 font-mono text-sm">
                ₹{mileageResult.fuelCostPerKm} / km
              </span>
            </div>
            <div className="w-[1px] h-6 bg-neutral-800" />
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase font-mono">100 km Cost</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">
                ₹{mileageResult.costPer100Km}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
