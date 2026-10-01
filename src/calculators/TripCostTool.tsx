import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Navigation, Users, Fuel, CreditCard, IndianRupee, CheckCircle2 } from 'lucide-react'
import { calculateTripCost, TripCostResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const TripCostTool: React.FC = () => {
  const tool = getToolBySlug('trip-cost')!

  const [oneWayDistanceKm, setOneWayDistanceKm] = useState<number>(350)
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(true)
  const [mileageKmPerL, setMileageKmPerL] = useState<number>(15)
  const [fuelPrice, setFuelPrice] = useState<number>(104)
  const [tolls, setTolls] = useState<number>(450)
  const [parkingMisc, setParkingMisc] = useState<number>(300)
  const [travelers, setTravelers] = useState<number>(4)

  const results: TripCostResult = useMemo(() => {
    return calculateTripCost(
      oneWayDistanceKm,
      isRoundTrip,
      mileageKmPerL,
      fuelPrice,
      tolls,
      parkingMisc,
      travelers
    )
  }, [oneWayDistanceKm, isRoundTrip, mileageKmPerL, fuelPrice, tolls, parkingMisc, travelers])

  const handleReset = () => {
    setOneWayDistanceKm(350)
    setIsRoundTrip(true)
    setMileageKmPerL(15)
    setFuelPrice(104)
    setTolls(450)
    setParkingMisc(300)
    setTravelers(4)
  }

  const getResultSummary = () => {
    return `Road Trip Budget & Split:
Total Distance: ${results.totalDistanceKm} km (${isRoundTrip ? 'Round Trip' : 'One Way'})
Travelers: ${travelers} | Fuel: ${results.fuelRequiredL} L (₹${results.fuelCost})
FASTag Tolls: ₹${results.tollsCost} | Parking/Misc: ₹${results.miscCost}
- Grand Total Cost: ₹${results.totalCost.toLocaleString('en-IN')}
- Cost Per Traveler: ₹${results.costPerPerson.toLocaleString('en-IN')}
Calculated on IndiaTools`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-orange-500" />
              <span>Journey & Toll Logistics</span>
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRoundTrip(false)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                  !isRoundTrip
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                One-Way
              </button>
              <button
                type="button"
                onClick={() => setIsRoundTrip(true)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                  isRoundTrip
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                Round-Trip
              </button>
            </div>
          </div>

          {/* Distance */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600">
                One-Way Distance
              </label>
              <span className="text-sm font-bold text-amber-400 font-mono">
                {oneWayDistanceKm} km {isRoundTrip && `(Total: ${oneWayDistanceKm * 2} km)`}
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="1500"
              step="10"
              value={oneWayDistanceKm}
              onChange={(e) => setOneWayDistanceKm(parseFloat(e.target.value) || 0)}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Mileage & Fuel Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-1.5">
                Vehicle Mileage (km/L)
              </label>
              <input
                type="number"
                step="0.5"
                min="5"
                max="80"
                value={mileageKmPerL || ''}
                onChange={(e) => setMileageKmPerL(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-3 py-2.5 text-sm font-bold text-white light:text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-1.5">
                Fuel Price (₹ / L)
              </label>
              <input
                type="number"
                min="50"
                max="150"
                value={fuelPrice || ''}
                onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-3 py-2.5 text-sm font-bold text-white light:text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Tolls & Misc */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-1.5">
                FASTag Tolls (One-Way ₹)
              </label>
              <input
                type="number"
                min="0"
                max="5000"
                value={tolls}
                onChange={(e) => setTolls(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-3 py-2.5 text-sm font-bold text-white light:text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-1.5">
                Parking & Misc (₹)
              </label>
              <input
                type="number"
                min="0"
                max="5000"
                value={parkingMisc}
                onChange={(e) => setParkingMisc(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-3 py-2.5 text-sm font-bold text-white light:text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Number of Travelers */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600">
                Number of Travelers (Cost Split)
              </label>
              <span className="text-sm font-bold text-amber-400 font-mono">
                {travelers} People
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={travelers}
              onChange={(e) => setTravelers(parseInt(e.target.value) || 1)}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Results */}
        <div className="lg:col-span-6 space-y-4">
          <motion.div
            layout
            className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950/30 border border-amber-500/30 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>Group Cost Distribution</span>
              </span>
              <span className="text-xs font-bold text-neutral-400">
                Split across {travelers} travelers
              </span>
            </div>

            {/* Cost Per Person */}
            <div className="mb-6 pb-6 border-b border-neutral-800">
              <span className="text-xs text-neutral-400 block font-medium">Fair Share Per Person</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl sm:text-6xl font-black tracking-tight text-white">
                  ₹{results.costPerPerson.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-bold text-amber-400">/ person</span>
              </div>
              <p className="mt-2 text-xs text-amber-300/90 font-mono">
                Grand Total Trip Expense: ₹{results.totalCost.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                  <Fuel className="w-3.5 h-3.5 text-orange-400" />
                  <span>Fuel Share</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white font-mono">
                  ₹{results.fuelCost.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-neutral-400">{results.fuelRequiredL} L Total</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                  <CreditCard className="w-3.5 h-3.5 text-sky-400" />
                  <span>FASTag & Parking</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white font-mono">
                  ₹{(results.tollsCost + results.miscCost).toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-neutral-400">Tolls ₹{results.tollsCost}</span>
              </div>
            </div>

            <div className="mt-5 p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400">Total Distance Logged:</span>
              <span className="font-bold text-white text-sm font-mono">
                {results.totalDistanceKm} km
              </span>
            </div>
          </motion.div>

          <div className="p-4 rounded-xl bg-neutral-900/50 light:bg-slate-100 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              FASTag toll booths automatically deduct from your linked bank account. Maintain at least ₹1,000 wallet balance to avoid blacklisting penalty rates.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
