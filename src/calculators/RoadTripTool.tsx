import React, { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass,
  Fuel,
  Users,
  MapPin,
  CheckCircle2,
  IndianRupee,
  CreditCard,
  UtensilsCrossed,
  Hotel,
  CircleDollarSign,
  ArrowRightLeft,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  RotateCcw,
  Navigation2,
  Gauge,
  Car,
  Info,
} from 'lucide-react'
import { calculateRoadTrip, RoadTripResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { HighwayHero } from '../components/roadTrip/HighwayHero'
import { VehicleSelector } from '../components/roadTrip/VehicleSelector'
import { RoutePresets } from '../components/roadTrip/RoutePresets'
import { TripSummaryDashboard } from '../components/roadTrip/TripSummaryDashboard'
import { RoadTripActionBar } from '../components/roadTrip/RoadTripActionBar'
import { RoadTripGuide } from '../components/roadTrip/RoadTripGuide'
import {
  VehicleType,
  FuelType,
  RoutePreset,
  VEHICLE_CONFIGS,
  FUEL_RATES,
} from '../components/roadTrip/RoadTripTypes'

export const RoadTripTool: React.FC = () => {
  const tool = getToolBySlug('road-trip-planner')!

  // Route & Distance state
  const [fromCity, setFromCity] = useState<string>('New Delhi')
  const [toCity, setToCity] = useState<string>('Jaipur')
  const [distanceKm, setDistanceKm] = useState<number>(280)
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false)
  const [is24HourReturnDiscount, setIs24HourReturnDiscount] = useState<boolean>(true)
  const [activePresetId, setActivePresetId] = useState<string>('delhi-jaipur')
  const [scenicNote, setScenicNote] = useState<string>(
    'Smooth expressway cruising with famous highway dhabas at Murthal & Neemrana.'
  )

  // Vehicle & Fuel state
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('hatchback')
  const [fuelType, setFuelType] = useState<FuelType>('petrol')
  const [mileage, setMileage] = useState<number>(18.0)
  const [fuelPrice, setFuelPrice] = useState<number>(102)

  // Toll mode & cost
  const [tollMode, setTollMode] = useState<'auto' | 'custom'>('auto')
  const [customToll, setCustomToll] = useState<number>(450)

  // Meals & Expenses
  const [travelDays, setTravelDays] = useState<number>(1)
  const [foodPerDay, setFoodPerDay] = useState<number>(600) // per person per day

  // Optional Stays & Misc
  const [enableHotel, setEnableHotel] = useState<boolean>(false)
  const [hotelPerNight, setHotelPerNight] = useState<number>(2500)
  const [hotelNights, setHotelNights] = useState<number>(1)

  const [enableMisc, setEnableMisc] = useState<boolean>(false)
  const [miscCost, setMiscCost] = useState<number>(500)

  // Passengers
  const [passengers, setPassengers] = useState<number>(4)

  // Interaction feedback state
  const [isCalculating, setIsCalculating] = useState<boolean>(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Vehicle config lookup
  const currentVehicleConfig = VEHICLE_CONFIGS[selectedVehicle]

  // Handle vehicle change
  const handleSelectVehicle = (type: VehicleType) => {
    setSelectedVehicle(type)
    const cfg = VEHICLE_CONFIGS[type]
    setMileage(cfg.defaultMileage)
    setFuelType(cfg.fuelType)
    setFuelPrice(cfg.defaultFuelPrice)
  }

  // Handle route preset select
  const handleSelectPreset = (preset: RoutePreset) => {
    setActivePresetId(preset.id)
    setFromCity(preset.from)
    setToCity(preset.to)
    setDistanceKm(preset.distanceKm)
    setTravelDays(preset.days)
    setScenicNote(preset.scenicNote)
    setCustomToll(preset.estimatedTollCar)
  }

  // Calculate effective distance
  const effectiveDistanceKm = isRoundTrip ? distanceKm * 2 : distanceKm

  // Calculate effective toll
  const effectiveToll = useMemo(() => {
    let oneWay = 0
    if (tollMode === 'auto') {
      oneWay = Math.round(distanceKm * currentVehicleConfig.tollMultiplier)
    } else {
      oneWay = customToll
    }

    if (!isRoundTrip) return oneWay

    // Round-trip logic: NHAI gives 25% discount on return leg if within 24h
    if (is24HourReturnDiscount) {
      return Math.round(oneWay * 1.75)
    }
    return Math.round(oneWay * 2)
  }, [tollMode, distanceKm, currentVehicleConfig.tollMultiplier, customToll, isRoundTrip, is24HourReturnDiscount])

  // Calculate food & stay & other
  const totalMeals = Math.round(foodPerDay * passengers * travelDays)
  const totalHotel = enableHotel ? Math.round(hotelPerNight * hotelNights) : 0
  const totalMisc = enableMisc ? miscCost : 0
  const combinedNonFuelTravelCosts = totalMeals + totalHotel + totalMisc

  // Core underlying mathematical calculation
  const result: RoadTripResult = useMemo(() => {
    return calculateRoadTrip(
      effectiveDistanceKm,
      mileage,
      fuelPrice,
      effectiveToll,
      combinedNonFuelTravelCosts,
      passengers
    )
  }, [effectiveDistanceKm, mileage, fuelPrice, effectiveToll, combinedNonFuelTravelCosts, passengers])

  // Reset handler
  const handleReset = () => {
    setFromCity('New Delhi')
    setToCity('Jaipur')
    setDistanceKm(280)
    setIsRoundTrip(false)
    setIs24HourReturnDiscount(true)
    setActivePresetId('delhi-jaipur')
    setScenicNote('Smooth expressway cruising with famous highway dhabas at Murthal & Neemrana.')
    setSelectedVehicle('hatchback')
    setFuelType('petrol')
    setMileage(18.0)
    setFuelPrice(102)
    setTollMode('auto')
    setCustomToll(450)
    setTravelDays(1)
    setFoodPerDay(600)
    setEnableHotel(false)
    setHotelPerNight(2500)
    setHotelNights(1)
    setEnableMisc(false)
    setMiscCost(500)
    setPassengers(4)
  }

  // Calculate trigger with feedback
  const handleCalculateClick = () => {
    setIsCalculating(true)
    setTimeout(() => {
      setIsCalculating(false)
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 250)
  }

  // Summary generation for copy & share actions
  const getResultSummary = (): string => {
    return `Indian Highway Road Trip Budget Summary:
--------------------------------------------------
- Route: ${fromCity} ➔ ${toCity} (${isRoundTrip ? `${effectiveDistanceKm} km Round-Trip` : `${distanceKm} km One-Way`})
- Vehicle: ${currentVehicleConfig.name} (${currentVehicleConfig.tollClassLabel})
- Mileage & Fuel: ${mileage} km/L at ₹${fuelPrice}/L (${fuelType.toUpperCase()})
- Fuel Consumed: ${result.fuelLitres} Litres (₹${result.fuelCost.toLocaleString('en-IN')})
- NHAI FASTag Tolls: ₹${effectiveToll.toLocaleString('en-IN')} ${isRoundTrip && is24HourReturnDiscount ? '(24h Return Discount applied)' : ''}
- Meals & Highway Dhabas: ₹${totalMeals.toLocaleString('en-IN')} (${travelDays} day${travelDays > 1 ? 's' : ''})
${enableHotel ? `- Hotel & Night Stay: ₹${totalHotel.toLocaleString('en-IN')} (${hotelNights} night${hotelNights > 1 ? 's' : ''})\n` : ''}${enableMisc ? `- Parking & Miscellaneous: ₹${totalMisc.toLocaleString('en-IN')}\n` : ''}--------------------------------------------------
TOTAL OUTFLOW: ₹${result.totalCost.toLocaleString('en-IN')}
PER PERSON SHARE: ₹${result.costPerPerson.toLocaleString('en-IN')} (${passengers} travellers)
EFFECTIVE COST PER KM: ₹${result.costPerKm}/km
--------------------------------------------------
Calculated via IndiaTools Indian Highway Studio:
https://indiatools-rho.vercel.app/calculators/road-trip-planner`
  }

  return (
    <ToolPageLayout
      tool={tool}
      hideHeroHeader={true}
      hideHeaderActions={true}
      hideDefaultGuide={true}
      hideDefaultFaqs={true}
      maxWidthClass="max-w-6xl xl:max-w-7xl"
    >
      {/* ================= 1. CINEMATIC INDIAN HIGHWAY HERO SECTION ================= */}
      <HighwayHero />

      {/* ================= 2. MAIN CALCULATOR & TELEMETRY DASHBOARD ================= */}
      <div id="calculator-form" className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start scroll-mt-6">
        {/* Left Column: Form Controls (7 Cols on desktop) */}
        <div className="lg:col-span-7 space-y-6">
          {/* SECTION A: ROUTE & DISTANCE */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md space-y-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                  A
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <span>Route & Distance</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    City points, distance & round-trip settings
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                Expressway Routing
              </span>
            </div>

            {/* Indian Road Trip Presets */}
            <RoutePresets
              activePresetId={activePresetId}
              onSelectPreset={handleSelectPreset}
            />

            {/* Interactive Route Connection Visualizer */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-100/90 via-sky-50/50 to-slate-100/90 dark:from-slate-950/80 dark:via-sky-950/30 dark:to-slate-950/80 border border-cyan-500/30 text-xs shadow-xs">
              <div className="flex items-center justify-between gap-3">
                {/* Origin Pin */}
                <div className="flex items-center gap-2 min-w-0 max-w-[36%]">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 ring-4 ring-emerald-500/20 animate-pulse" />
                  <div className="min-w-0">
                    <span className="text-[9.5px] uppercase font-mono text-slate-400 block">Origin</span>
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate block">
                      {fromCity || 'Start City'}
                    </span>
                  </div>
                </div>

                {/* Animated Connecting Highway Ribbon */}
                <div className="flex-1 flex flex-col items-center px-1">
                  <div className="w-full flex items-center relative my-1.5">
                    <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 relative overflow-hidden rounded-full">
                      <div className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-500 w-full rounded-full" />
                      <div className="absolute inset-0 bg-white/70 w-1/3 rounded-full animate-route-flow" />
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 -top-2.5 px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-cyan-500/50 text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-300 shadow-xs flex items-center gap-1 shrink-0">
                      <span>{isRoundTrip ? '⇄' : '➔'}</span>
                      <span>{effectiveDistanceKm} km</span>
                    </div>
                  </div>
                  <span className="text-[9.5px] font-mono text-slate-500 dark:text-slate-400">
                    {isRoundTrip ? 'Round-Trip Highway' : 'One-Way Corridor'}
                  </span>
                </div>

                {/* Destination Pin */}
                <div className="flex items-center justify-end gap-2 min-w-0 max-w-[36%] text-right">
                  <div className="min-w-0">
                    <span className="text-[9.5px] uppercase font-mono text-slate-400 block">Destination</span>
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate block">
                      {toCity || 'Destination'}
                    </span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 ring-4 ring-amber-500/20" />
                </div>
              </div>
            </div>

            {/* Origin & Destination Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Starting City / Origin
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={fromCity}
                    onChange={(e) => {
                      setFromCity(e.target.value)
                      setActivePresetId('')
                    }}
                    placeholder="e.g. New Delhi, Mumbai"
                    className="w-full bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Destination City
                </label>
                <div className="relative">
                  <Navigation2 className="w-4 h-4 text-cyan-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={toCity}
                    onChange={(e) => {
                      setToCity(e.target.value)
                      setActivePresetId('')
                    }}
                    placeholder="e.g. Jaipur, Goa"
                    className="w-full bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Distance Slider & Input */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  One-Way Highway Distance
                </span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="10"
                    max="4000"
                    step="5"
                    value={distanceKm || ''}
                    onChange={(e) => setDistanceKm(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-20 font-mono font-bold text-right bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-sm text-cyan-600 dark:text-cyan-400 focus:outline-hidden"
                  />
                  <span className="font-mono text-xs text-slate-500">km</span>
                </div>
              </div>

              <input
                type="range"
                min="20"
                max="2500"
                step="10"
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 20)}
                className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
              />

              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>20 km (Short trip)</span>
                <span>650 km (Standard)</span>
                <span>2,500+ km (Cross-Country)</span>
              </div>
            </div>

            {/* Round-Trip & Return Discount Toggle */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Include Return Journey (Round-Trip)
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Calculates double distance ({distanceKm * 2} km) and return toll
                    </span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRoundTrip}
                    onChange={(e) => setIsRoundTrip(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 dark:bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>

              {isRoundTrip && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={is24HourReturnDiscount}
                      onChange={(e) => setIs24HourReturnDiscount(e.target.checked)}
                      className="rounded accent-cyan-500 cursor-pointer"
                    />
                    <span>Return within 24 Hours (Apply NHAI 25% Return FASTag Discount)</span>
                  </label>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                    {is24HourReturnDiscount ? '1.75x Toll' : '2.0x Toll'}
                  </span>
                </div>
              )}
            </div>

            {/* Scenic Route Tip */}
            {scenicNote && (
              <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2 bg-slate-100/80 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Highway Highlight:</strong> {scenicNote}</span>
              </div>
            )}
          </div>

          {/* SECTION B: VEHICLE & FUEL */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md space-y-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
                  B
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Car className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span>Vehicle & Fuel Telemetry</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Vehicle class, mileage & fuel pricing
                  </p>
                </div>
              </div>
            </div>

            {/* Vehicle Selector (6 Categories with dedicated SVG artwork) */}
            <VehicleSelector
              selectedVehicle={selectedVehicle}
              onSelectVehicle={handleSelectVehicle}
            />

            {/* Fuel Type Chips */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Fuel Variant
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['petrol', 'diesel', 'cng', 'ev'] as FuelType[]).map((f) => {
                  const info = FUEL_RATES[f]
                  const isCurrent = fuelType === f

                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => {
                        setFuelType(f)
                        setFuelPrice(info.defaultPrice)
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        isCurrent
                          ? 'bg-orange-500/15 border-orange-500 text-orange-700 dark:text-orange-300 ring-1 ring-orange-500/40 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{info.icon}</span>
                        <span>{info.name}</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        ₹{info.defaultPrice}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Mileage & Fuel Price Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Highway Mileage ({fuelType === 'cng' ? 'km/kg' : fuelType === 'ev' ? 'km/kWh' : 'km/L'})
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    Typical: ~{currentVehicleConfig.defaultMileage}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="100"
                    value={mileage || ''}
                    onChange={(e) => setMileage(Math.max(0.1, parseFloat(e.target.value) || 0))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setMileage((prev) => Math.max(1, Number((prev - 1).toFixed(1))))}
                      className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 cursor-pointer"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setMileage((prev) => Number((prev + 1).toFixed(1)))}
                      className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Fuel Price ({FUEL_RATES[fuelType].unit})
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    State Highway Avg
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">₹</span>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={fuelPrice || ''}
                    onChange={(e) => setFuelPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-7 pr-3 py-2 text-sm font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION C: TOLL & TRAVEL EXPENSES */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md space-y-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  C
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>FASTag Tolls & Travel Expenses</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Highway plazas, food allowance & stays
                  </p>
                </div>
              </div>
            </div>

            {/* Toll Mode Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  NHAI FASTag Toll Calculation
                </label>
                <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setTollMode('auto')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      tollMode === 'auto'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Auto ({currentVehicleConfig.tollMultiplier === 0 ? 'Free' : `₹${currentVehicleConfig.tollMultiplier}/km`})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTollMode('custom')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      tollMode === 'custom'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Custom Toll
                  </button>
                </div>
              </div>

              {tollMode === 'custom' ? (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Known One-Way FASTag Toll (₹)
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      Exact plaza total
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={customToll || ''}
                      onChange={(e) => setCustomToll(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-7 pr-3 py-2 text-sm font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0 text-amber-500" />
                    <span>
                      {currentVehicleConfig.tollMultiplier === 0 ? (
                        <><strong>Motorcycle Exempt:</strong> Two-wheelers do not pay toll fees on standard NHAI National Highways.</>
                      ) : (
                        <><strong>Automated NHAI Model:</strong> {distanceKm} km × ₹{currentVehicleConfig.tollMultiplier}/km ({currentVehicleConfig.tollClassLabel})</>
                      )}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-white shrink-0">
                    ₹{effectiveToll.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            {/* Travel Days & Meals Allowance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Duration of Journey
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {travelDays} Day{travelDays > 1 ? 's' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={travelDays}
                  onChange={(e) => setTravelDays(parseInt(e.target.value) || 1)}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Dhabas & Food / Person / Day
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    Tea, Snacks, Lunch
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">₹</span>
                  <input
                    type="number"
                    step="50"
                    min="0"
                    value={foodPerDay || ''}
                    onChange={(e) => setFoodPerDay(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-7 pr-3 py-2 text-sm font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Optional Stay & Misc Toggles */}
            <div className="space-y-3 pt-1">
              {/* Hotel Stay Toggle */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hotel className="w-4 h-4 text-purple-500" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                        Optional Hotel / Night Stay
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Include lodging for multi-day trips
                      </span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableHotel}
                      onChange={(e) => setEnableHotel(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 dark:bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {enableHotel && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Room Cost / Night (₹)</label>
                      <input
                        type="number"
                        value={hotelPerNight}
                        onChange={(e) => setHotelPerNight(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1">Nights</label>
                      <input
                        type="number"
                        min="1"
                        max="14"
                        value={hotelNights}
                        onChange={(e) => setHotelNights(parseInt(e.target.value) || 1)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Parking & Misc Toggle */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="w-4 h-4 text-emerald-500" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                        Parking, Entry Passes & Miscellaneous
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Sightseeing tickets, state border permits & parking
                      </span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableMisc}
                      onChange={(e) => setEnableMisc(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 dark:bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {enableMisc && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                    <label className="block text-[10px] text-slate-500 mb-1">Total Parking & Permits (₹)</label>
                    <input
                      type="number"
                      value={miscCost}
                      onChange={(e) => setMiscCost(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION D: SPLIT COSTS */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  D
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Split Costs & Group Sharing</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Number of travellers sharing expenses
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                {passengers} Travellers
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Travellers (1 to 12)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPassengers((p) => Math.max(1, p - 1))}
                    className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-base w-8 text-center text-slate-900 dark:text-white">
                    {passengers}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPassengers((p) => Math.min(12, p + 1))}
                    className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={passengers}
                onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg"
              />

              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Solo (1)</span>
                <span>Couples / Small Car (4)</span>
                <span>Tempo / Group (12)</span>
              </div>
            </div>
          </div>

          {/* CALCULATE TRIP BUTTON (REQUIREMENT 6) */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleCalculateClick}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-base text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-300 hover:from-cyan-300 hover:to-amber-200 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99] focus:ring-4 focus:ring-cyan-500/30 ${
                isCalculating ? 'animate-pulse opacity-90' : ''
              }`}
            >
              <Compass className="w-5 h-5 text-slate-950" />
              <span>Calculate Road Trip Budget</span>
            </button>
          </div>
        </div>

        {/* Right Column: Telemetry Summary Dashboard (5 Cols on desktop) */}
        <div ref={resultsRef} className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <TripSummaryDashboard
            distanceKm={effectiveDistanceKm}
            isRoundTrip={isRoundTrip}
            vehicleType={selectedVehicle}
            passengers={passengers}
            fuelLitres={result.fuelLitres}
            fuelCost={result.fuelCost}
            tollCost={effectiveToll}
            mealsCost={totalMeals}
            hotelCost={totalHotel}
            miscCost={totalMisc}
            totalCost={result.totalCost}
            costPerKm={result.costPerKm}
            costPerPerson={result.costPerPerson}
            travelDays={travelDays}
            is24HourReturnDiscount={is24HourReturnDiscount}
          />

          {/* Quick Highway Safety Tip Card */}
          <div className="p-4 rounded-2xl bg-slate-900/40 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <CheckCircle2 className="w-4 h-4 text-cyan-500" />
              <span>Indian Highway Speed & Mileage Rule</span>
            </div>
            <p className="leading-relaxed text-[11.5px]">
              Cruising steadily at 80–90 km/h in top gear on 6-lane expressways (e.g. Delhi-Mumbai NE-4 or Bengaluru-Mysuru NH-275) saves up to ₹1.20 per km in fuel compared to aggressive surges over 115 km/h.
            </p>
          </div>
        </div>
      </div>

      {/* ================= 3. COMPACT ACTION BAR (REQUIREMENT 5) ================= */}
      <div className="mt-8">
        <RoadTripActionBar
          onReset={handleReset}
          getSummaryText={getResultSummary}
          routeTitle={`${fromCity} to ${toCity} Highway Trip Budget`}
        />
      </div>

      {/* ================= 4. COMPREHENSIVE ROAD TRIP GUIDE & FAQS (REQUIREMENT 9) ================= */}
      <RoadTripGuide />

      {/* Embedded CSS for Route Connection Pulse & Flow Animation */}
      <style>{`
        @keyframes routeFlow {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
        .animate-route-flow {
          animation: routeFlow 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-route-flow {
            animation: none !important;
          }
        }
      `}</style>
    </ToolPageLayout>
  )
}
