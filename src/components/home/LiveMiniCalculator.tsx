import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Gauge, Zap, Compass, ArrowRight } from 'lucide-react'
import { calculateMileage, calculateAcCost, convertLandArea } from '../../lib/calculations'

export const LiveMiniCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mileage' | 'ac' | 'land'>('mileage')

  // Tab 1: Mileage
  const [distanceKm, setDistanceKm] = useState<number>(465)
  const [fuelLitres, setFuelLitres] = useState<number>(25)
  const [fuelPrice, setFuelPrice] = useState<number>(102)

  const mileageResult = useMemo(() => {
    return calculateMileage(distanceKm, fuelLitres, fuelPrice)
  }, [distanceKm, fuelLitres, fuelPrice])

  // Tab 2: AC Cost
  const [tonnage, setTonnage] = useState<1 | 1.5 | 2>(1.5)
  const [acHours, setAcHours] = useState<number>(8)
  const unitTariff = 8.5

  const acResult = useMemo(() => {
    return calculateAcCost(tonnage, 5, true, acHours, unitTariff)
  }, [tonnage, acHours, unitTariff])

  // Tab 3: Land
  const [centValue, setCentValue] = useState<number>(5.5)

  const landResult = useMemo(() => {
    return convertLandArea(centValue, 'cent')
  }, [centValue])

  return (
    <div className="relative p-6 sm:p-8 rounded-3xl bg-neutral-900/90 dark:bg-neutral-900/90 light:bg-white border border-neutral-700/80 light:border-slate-200 shadow-2xl shadow-black/40 overflow-hidden backdrop-blur-xl">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header with Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800 light:border-slate-100">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('mileage')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              activeTab === 'mileage'
                ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Vehicle Mileage</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ac')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              activeTab === 'ac'
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>AC Power Cost</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('land')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              activeTab === 'land'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Cent ↔ Sq.ft</span>
          </button>
        </div>

        <Link
          to={
            activeTab === 'mileage'
              ? '/calculators/vehicle-mileage'
              : activeTab === 'ac'
              ? '/calculators/ac-electricity-cost'
              : '/calculators/cent-to-sqft'
          }
          className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <span>Open Full Tool</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Dynamic Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'mileage' && (
          <motion.div
            key="mileage"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center"
          >
            <div className="md:col-span-7 space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-1.5 font-medium">
                  <span>Distance Travelled</span>
                  <span className="font-mono text-orange-400 font-bold">{distanceKm} km</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="900"
                  step="5"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-1.5 font-medium">
                  <span>Fuel Consumed (Litres)</span>
                  <span className="font-mono text-orange-400 font-bold">{fuelLitres} Litres</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="60"
                  step="1"
                  value={fuelLitres}
                  onChange={(e) => setFuelLitres(parseFloat(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-neutral-400">Fuel Rate:</span>
                <div className="flex gap-2">
                  {[90, 102, 106].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setFuelPrice(rate)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-mono font-medium border transition-colors ${
                        fuelPrice === rate
                          ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                          : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                      }`}
                    >
                      ₹{rate}/L
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col justify-center items-center text-center p-6 rounded-2xl bg-neutral-950/80 light:bg-slate-50 border border-neutral-800 light:border-slate-200">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                Fuel Economy
              </span>
              <div className="text-4xl font-black font-mono tracking-tight text-white light:text-slate-900">
                {mileageResult.mileageKmPerL}
                <span className="text-lg text-neutral-400 font-normal"> km/L</span>
              </div>
              <div className="mt-3 pt-3 border-t border-neutral-800/80 w-full flex items-center justify-around text-xs">
                <div>
                  <span className="text-neutral-500 block text-[10px]">Cost / Km</span>
                  <span className="font-mono text-amber-400 font-bold">₹{mileageResult.fuelCostPerKm}/km</span>
                </div>
                <div className="w-px h-6 bg-neutral-800" />
                <div>
                  <span className="text-neutral-500 block text-[10px]">Total Fuel Bill</span>
                  <span className="font-mono text-white light:text-slate-900 font-bold">₹{Math.round(fuelLitres * fuelPrice)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'ac' && (
          <motion.div
            key="ac"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center"
          >
            <div className="md:col-span-7 space-y-4">
              <div>
                <label className="block text-xs text-neutral-300 mb-1.5 font-medium">AC Capacity</label>
                <div className="grid grid-cols-3 gap-2">
                  {([1, 1.5, 2] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTonnage(t)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        tonnage === t ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      {t} Ton
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs text-neutral-300 mb-1.5 font-medium">
                  <span>Daily Run Time</span>
                  <span className="font-mono text-blue-400 font-bold">{acHours} Hours/day</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="16"
                  step="1"
                  value={acHours}
                  onChange={(e) => setAcHours(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Electricity Tariff:</span>
                <span className="font-mono font-bold text-white">₹{unitTariff} / unit</span>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col justify-center items-center text-center p-6 rounded-2xl bg-neutral-950/80 light:bg-slate-50 border border-neutral-800 light:border-slate-200">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                Monthly AC Bill
              </span>
              <div className="text-4xl font-black font-mono tracking-tight text-white light:text-slate-900">
                ₹{acResult.monthlyCostRs.toLocaleString('en-IN')}
                <span className="text-sm text-neutral-400 font-normal"> / mo</span>
              </div>
              <div className="mt-3 pt-3 border-t border-neutral-800/80 w-full flex items-center justify-around text-xs">
                <div>
                  <span className="text-neutral-500 block text-[10px]">Daily Expense</span>
                  <span className="font-mono text-blue-400 font-bold">₹{acResult.dailyCostRs}/day</span>
                </div>
                <div className="w-px h-6 bg-neutral-800" />
                <div>
                  <span className="text-neutral-500 block text-[10px]">Monthly Power</span>
                  <span className="font-mono text-white light:text-slate-900 font-bold">{acResult.monthlyUnitsKwh} Units</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'land' && (
          <motion.div
            key="land"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center"
          >
            <div className="md:col-span-7 space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs text-neutral-300 mb-1.5 font-medium">
                  <span>Cent Measurement</span>
                  <span className="font-mono text-emerald-400 font-bold">{centValue} Cents</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="25"
                  step="0.5"
                  value={centValue}
                  onChange={(e) => setCentValue(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex gap-2">
                {[3, 5, 8, 10, 20].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCentValue(c)}
                    className={`flex-1 py-1 rounded-lg text-xs font-mono border transition-all ${
                      centValue === c ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold' : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    {c} Cents
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col justify-center items-center text-center p-6 rounded-2xl bg-neutral-950/80 light:bg-slate-50 border border-neutral-800 light:border-slate-200">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                Square Feet Equivalent
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white light:text-slate-900">
                {landResult.sqft.toLocaleString('en-IN')}
                <span className="text-sm text-neutral-400 font-normal"> sq.ft</span>
              </div>
              <div className="mt-3 pt-3 border-t border-neutral-800/80 w-full flex items-center justify-around text-xs">
                <div>
                  <span className="text-neutral-500 block text-[10px]">In Acres</span>
                  <span className="font-mono text-emerald-400 font-bold">{landResult.acre} Acres</span>
                </div>
                <div className="w-px h-6 bg-neutral-800" />
                <div>
                  <span className="text-neutral-500 block text-[10px]">In Gunthas</span>
                  <span className="font-mono text-white light:text-slate-900 font-bold">{landResult.guntha} Gunthas</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
