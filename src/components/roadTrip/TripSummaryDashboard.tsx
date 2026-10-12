import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Fuel,
  Users,
  Compass,
  CreditCard,
  UtensilsCrossed,
  Hotel,
  CircleDollarSign,
  ArrowRightLeft,
  Sparkles,
  Info,
  ShieldAlert,
} from 'lucide-react'
import { VehicleType, VEHICLE_CONFIGS } from './RoadTripTypes'

interface TripSummaryDashboardProps {
  distanceKm: number
  isRoundTrip: boolean
  vehicleType: VehicleType
  passengers: number
  fuelLitres: number
  fuelCost: number
  tollCost: number
  mealsCost: number
  hotelCost: number
  miscCost: number
  totalCost: number
  costPerKm: number
  costPerPerson: number
  travelDays: number
  is24HourReturnDiscount: boolean
}

// Lightweight smooth number count-up hook (60fps ease-out, prefers-reduced-motion safe)
function useAnimatedNumber(value: number, durationMs: number = 320): number {
  const [displayValue, setDisplayValue] = useState(value)
  const prevValue = useRef(value)

  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(value)
      prevValue.current = value
      return
    }

    const start = prevValue.current
    const end = value
    if (start === end) return

    const startTime = performance.now()
    let animationFrameId: number

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / durationMs, 1)
      // Smooth cubic ease out
      const ease = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(start + (end - start) * ease)
      setDisplayValue(current)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step)
      } else {
        prevValue.current = end
      }
    }

    animationFrameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrameId)
  }, [value, durationMs])

  return displayValue
}

export const TripSummaryDashboard: React.FC<TripSummaryDashboardProps> = ({
  distanceKm,
  isRoundTrip,
  vehicleType,
  passengers,
  fuelLitres,
  fuelCost,
  tollCost,
  mealsCost,
  hotelCost,
  miscCost,
  totalCost,
  costPerKm,
  costPerPerson,
  travelDays,
  is24HourReturnDiscount,
}) => {
  const vehicleConfig = VEHICLE_CONFIGS[vehicleType]

  // Animated counters for smooth numerical transitions
  const animTotalCost = useAnimatedNumber(totalCost)
  const animCostPerPerson = useAnimatedNumber(costPerPerson)
  const animFuelCost = useAnimatedNumber(fuelCost)
  const animTollCost = useAnimatedNumber(tollCost)
  const animMealsCost = useAnimatedNumber(mealsCost)
  const animOtherCost = useAnimatedNumber(hotelCost + miscCost)

  // Calculate percentage shares for visual breakdown bar
  const safeTotal = Math.max(1, totalCost)
  const fuelPct = Math.round((fuelCost / safeTotal) * 100)
  const tollPct = Math.round((tollCost / safeTotal) * 100)
  const mealsPct = Math.round((mealsCost / safeTotal) * 100)
  const otherCost = hotelCost + miscCost
  const otherPct = Math.max(0, 100 - fuelPct - tollPct - mealsPct)

  // Refill estimate
  const tankCapacity = vehicleConfig.tankSizeLitres
  const tankFillRatio = fuelLitres / tankCapacity
  const tanksNeeded = Number(tankFillRatio.toFixed(1))

  return (
    <div className="space-y-4">
      {/* Main Budget Card */}
      <motion.div
        layout
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#0B1222] to-[#070D18] border border-cyan-500/30 shadow-2xl text-white p-6 sm:p-7"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

        {/* Header Telemetry */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300">
              Trip Budget Summary
            </span>
            {isRoundTrip && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                <ArrowRightLeft className="w-3 h-3" />
                <span>Round-Trip Active</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-cyan-300">
              ₹{costPerKm}/km effective
            </span>
          </div>
        </div>

        {/* Primary Hero Figures */}
        <div className="relative z-10 my-6 grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Estimated Total Outflow
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white flex items-baseline gap-1">
              <span>₹{animTotalCost.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              For {distanceKm} km across {travelDays} day{travelDays > 1 ? 's' : ''} in a {vehicleConfig.name}
            </p>
          </div>

          <div className="sm:text-right p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 backdrop-blur-xs">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 block mb-1">
              Per-Person Share
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-emerald-400">
              ₹{animCostPerPerson.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-emerald-200/80 mt-1 flex items-center sm:justify-end gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>Split across {passengers} traveller{passengers > 1 ? 's' : ''}</span>
            </p>
          </div>
        </div>

        {/* Expense Distribution Bar */}
        <div className="relative z-10 space-y-1.5 pt-2 pb-4">
          <div className="flex justify-between text-[11px] font-mono text-slate-300">
            <span>Budget Allocation</span>
            <span className="text-slate-400">
              Fuel {fuelPct}% • Toll {tollPct}% • Food {mealsPct}% {otherCost > 0 ? `• Stay/Other ${otherPct}%` : ''}
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex p-0.5 gap-0.5">
            <div
              style={{ width: `${fuelPct}%` }}
              className="h-full rounded-l-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
              title={`Fuel: ₹${fuelCost} (${fuelPct}%)`}
            />
            <div
              style={{ width: `${tollPct}%` }}
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              title={`FASTag Tolls: ₹${tollCost} (${tollPct}%)`}
            />
            <div
              style={{ width: `${mealsPct}%` }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
              title={`Food & Dhabas: ₹${mealsCost} (${mealsPct}%)`}
            />
            {otherCost > 0 && (
              <div
                style={{ width: `${otherPct}%` }}
                className="h-full rounded-r-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                title={`Stay & Misc: ₹${otherCost} (${otherPct}%)`}
              />
            )}
          </div>
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-slate-800/80 text-xs">
          {/* Fuel */}
          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center gap-1.5 text-orange-400 mb-1 font-mono text-[11px]">
              <Fuel className="w-3.5 h-3.5" />
              <span>Fuel Outflow</span>
            </div>
            <div className="font-mono font-bold text-base text-white">
              ₹{animFuelCost.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {fuelLitres} Litres required
            </span>
          </div>

          {/* Tolls */}
          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center gap-1.5 text-cyan-400 mb-1 font-mono text-[11px]">
              <CreditCard className="w-3.5 h-3.5" />
              <span>NHAI FASTag Toll</span>
            </div>
            <div className="font-mono font-bold text-base text-white">
              ₹{animTollCost.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {vehicleConfig.tollMultiplier === 0
                ? '2-Wheeler Exempt'
                : isRoundTrip && is24HourReturnDiscount
                ? '24h Return Discount'
                : 'National Highway Rate'}
            </span>
          </div>

          {/* Meals */}
          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center gap-1.5 text-emerald-400 mb-1 font-mono text-[11px]">
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Food & Dhabas</span>
            </div>
            <div className="font-mono font-bold text-base text-white">
              ₹{animMealsCost.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {travelDays} Day{travelDays > 1 ? 's' : ''} Allowance
            </span>
          </div>

          {/* Stay & Other */}
          <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center gap-1.5 text-purple-400 mb-1 font-mono text-[11px]">
              <Hotel className="w-3.5 h-3.5" />
              <span>Stay & Misc</span>
            </div>
            <div className="font-mono font-bold text-base text-white">
              ₹{animOtherCost.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {hotelCost > 0 ? `Stay ₹${hotelCost}` : 'Parking & Misc'}
            </span>
          </div>
        </div>

        {/* Refill Context Callout */}
        <div className="relative z-10 mt-4 p-3 rounded-xl bg-sky-950/40 border border-sky-500/20 text-xs text-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Fuel className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Highway Fuel Planning:</strong> At ~{vehicleConfig.defaultMileage} km/L, your {vehicleConfig.name} ({tankCapacity}L tank) will need approximately <strong>{tanksNeeded} full tank{tanksNeeded > 1 ? 's' : ''}</strong> of fuel.
            </span>
          </div>
          <span className="text-[11px] font-mono text-cyan-300 shrink-0">
            {tanksNeeded <= 1.0 ? '✓ Single tank journey' : `Plan ~${Math.ceil(tanksNeeded) - 1} highway fuel stop${Math.ceil(tanksNeeded) - 1 > 1 ? 's' : ''}`}
          </span>
        </div>
      </motion.div>
    </div>
  )
}

