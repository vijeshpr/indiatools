import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Wrench, Gauge, ShieldCheck, CheckCircle2, IndianRupee } from 'lucide-react'
import { calculateVehicleServiceCost, VehicleServiceResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

const VEHICLE_TYPES = [
  { id: 'bike' as const, label: '2-Wheeler / Bike', icon: '🏍️' },
  { id: 'hatchback' as const, label: 'Hatchback', icon: '🚗' },
  { id: 'sedan' as const, label: 'Sedan', icon: '🚘' },
  { id: 'suv' as const, label: 'Mid / Full SUV', icon: '🚙' },
]

export const VehicleServiceCostTool: React.FC = () => {
  const tool = getToolBySlug('vehicle-service-cost')!

  const [vehicleType, setVehicleType] = useState<'bike' | 'hatchback' | 'sedan' | 'suv'>('hatchback')
  const [odometerKm, setOdometerKm] = useState<number>(35000)
  const [serviceType, setServiceType] = useState<'minor' | 'major'>('major')

  const result: VehicleServiceResult = useMemo(() => {
    return calculateVehicleServiceCost(vehicleType, odometerKm, serviceType)
  }, [vehicleType, odometerKm, serviceType])

  const handleReset = () => {
    setVehicleType('hatchback')
    setOdometerKm(35000)
    setServiceType('major')
  }

  const getResultSummary = () => {
    return `Vehicle Periodic Service Budget Planner:
- Vehicle Segment: ${vehicleType.toUpperCase()}
- Current Odometer: ${odometerKm.toLocaleString('en-IN')} km
- Service Level: ${serviceType.toUpperCase()} Periodic Service (Every ${result.serviceIntervalKm.toLocaleString('en-IN')} km)
--------------------------------------------------
ESTIMATED SERVICE BILL: ₹${result.estimatedTotal.toLocaleString('en-IN')}
Cost Breakdown:
- Engine Oil: ₹${result.engineOilCost.toLocaleString('en-IN')}
- Oil/Air/AC Filters: ₹${result.filterCost.toLocaleString('en-IN')}
- Labor & Workshop GST: ₹${result.laborCost.toLocaleString('en-IN')}
- Consumables & Coolant: ₹${result.consumablesCost.toLocaleString('en-IN')}
- Wheel Alignment & Balancing: ₹${result.wheelAlignmentCost.toLocaleString('en-IN')}
Key Recommended Replacements: ${result.keyRecommendations.join(', ')}
Calculated via India Practical Tools (https://indiapracticaltools.com)`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-orange-500" />
              <span>Vehicle & Odometer Details</span>
            </h2>
            <span className="text-xs font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
              Indian Workshop Slabs
            </span>
          </div>

          {/* Vehicle Type Picker */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              Select Vehicle Segment
            </label>
            <div className="grid grid-cols-2 gap-2">
              {VEHICLE_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setVehicleType(t.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    vehicleType === t.id
                      ? 'bg-orange-500/20 border-orange-500 text-white font-bold'
                      : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 light:border-slate-200 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="text-lg block mb-1">{t.icon}</span>
                  <span className="text-xs block leading-tight">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Current Odometer */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-1.5 font-medium">
              <span>Current Odometer Reading</span>
              <span className="font-mono text-orange-400 font-bold">{odometerKm.toLocaleString('en-IN')} km</span>
            </div>
            <input
              type="range"
              min="1000"
              max="150000"
              step="1000"
              value={odometerKm}
              onChange={(e) => setOdometerKm(parseFloat(e.target.value) || 0)}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </div>

          {/* Service Type Selection */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              Scheduled Service Level
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setServiceType('minor')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  serviceType === 'minor'
                    ? 'bg-orange-500/20 border-orange-500 text-white font-bold'
                    : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400'
                }`}
              >
                <span className="text-sm block font-bold text-white light:text-slate-900">Minor Service</span>
                <span className="text-[11px] text-neutral-500">Engine oil, oil filter & basic check</span>
              </button>

              <button
                type="button"
                onClick={() => setServiceType('major')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  serviceType === 'major'
                    ? 'bg-orange-500/20 border-orange-500 text-white font-bold'
                    : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400'
                }`}
              >
                <span className="text-sm block font-bold text-white light:text-slate-900">Major Service</span>
                <span className="text-[11px] text-neutral-500">All filters, fluids & wheel alignment</span>
              </button>
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
                Estimated Workshop Invoice
              </span>
              <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                Every {result.serviceIntervalKm.toLocaleString('en-IN')} km
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                ₹{result.estimatedTotal.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Classification: <span className="font-bold text-amber-400 uppercase tracking-wide font-mono">{serviceType} Service</span>
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">Engine Oil (Synthetic / Semi-Synthetic)</span>
                <span className="font-mono font-bold text-white">₹{result.engineOilCost.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">Replacement Filters (Oil, Air, Cabin)</span>
                <span className="font-mono font-bold text-white">₹{result.filterCost.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">Labor Charges + 18% GST</span>
                <span className="font-mono font-bold text-amber-400">₹{result.laborCost.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">Wheel Alignment & Balancing</span>
                <span className="font-mono font-bold text-white">₹{result.wheelAlignmentCost.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checklist of parts */}
            <div className="mt-5 pt-4 border-t border-neutral-800 light:border-slate-100">
              <span className="text-xs font-mono text-neutral-400 uppercase block mb-2">
                Mandatory Check & Replace Items:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {result.keyRecommendations.map((part: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-neutral-800 light:bg-slate-100 text-neutral-300 light:text-slate-700 border border-neutral-700 light:border-slate-300"
                  >
                    ✓ {part}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span>Workshop Tip</span>
            </div>
            <p>
              Always decline unnecessary dealership add-ons like Engine Decarbonizing (₹2,500), Nitrogen inflation (₹300), and AC Sanitization sprays (₹1,500). Sticking strictly to the owner manual checklist saves 25% on invoice cost.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
