import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Navigation, Users, Fuel, CreditCard, IndianRupee, CheckCircle2 } from 'lucide-react'
import { calculateTripCost, TripCostResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useI18n } from '../i18n/I18nContext'
import { registerToolTranslations, useToolTranslations } from '../i18n/toolTranslations'
import { TripCostUI, tripCostTranslations } from '../i18n/tools/tripCostI18n'

// Defensive safety registration in case bundle is imported before or after registry initialization
registerToolTranslations('trip-cost', tripCostTranslations)

export const TripCostTool: React.FC = () => {
  const tool = getToolBySlug('trip-cost')!
  const { locale } = useI18n()
  const { meta, ui, formulaExplanation, assumptions, example, faqs } = useToolTranslations<TripCostUI>(
    'trip-cost',
    locale
  )

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
    return `${ui.resultSummaryTitle}
${ui.totalDistanceText}: ${results.totalDistanceKm} km (${isRoundTrip ? ui.roundTrip : ui.oneWay})
${ui.travelersText}: ${travelers} | ${ui.fuelText}: ${results.fuelRequiredL} L (₹${results.fuelCost})
${ui.fastagTollsText}: ₹${results.tollsCost} | ${ui.parkingMiscText}: ₹${results.miscCost}
- ${ui.grandTotalCostText}: ₹${results.totalCost.toLocaleString('en-IN')}
- ${ui.costPerTravelerText}: ₹${results.costPerPerson.toLocaleString('en-IN')}
${ui.calculatedOn}`
  }

  const localizedTool = useMemo(() => {
    return {
      ...tool,
      title: meta.title,
      detailedDescription: meta.subtitle,
      formulaExplanation: formulaExplanation || tool.formulaExplanation,
      assumptions: assumptions || tool.assumptions,
      exampleCalculation: example ? {
        title: example.title,
        inputs: example.inputs,
        outputs: example.outputs,
        explanation: example.explanation,
      } : tool.exampleCalculation,
      faqs: faqs && faqs.length > 0 ? faqs : tool.faqs,
    }
  }, [tool, meta, formulaExplanation, assumptions, example, faqs])

  return (
    <ToolPageLayout
      tool={localizedTool}
      onReset={handleReset}
      onCopyResult={getResultSummary}
      customH1={meta.h1}
      customSubtitle={meta.subtitle}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-orange-500" />
              <span>{ui.journeyLogistics}</span>
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
                {ui.oneWay}
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
                {ui.roundTrip}
              </button>
            </div>
          </div>

          {/* Distance */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600">
                {ui.oneWayDistance}
              </label>
              <span className="text-sm font-bold text-amber-400 font-mono">
                {oneWayDistanceKm} km {isRoundTrip && `(${ui.totalDistanceLabel}: ${oneWayDistanceKm * 2} km)`}
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="1500"
              step="10"
              value={oneWayDistanceKm}
              onChange={(e) => setOneWayDistanceKm(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Mileage & Fuel Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-1.5">
                {ui.vehicleMileage}
              </label>
              <input
                type="number"
                min="4"
                max="80"
                step="0.5"
                value={mileageKmPerL || ''}
                onChange={(e) => setMileageKmPerL(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-3 py-2 text-sm text-white light:text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-1.5">
                {ui.fuelRate}
              </label>
              <input
                type="number"
                min="60"
                max="180"
                value={fuelPrice || ''}
                onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-3 py-2 text-sm text-white light:text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Tolls & Parking */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-1.5">
                {ui.fastagTolls}
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={tolls || ''}
                onChange={(e) => setTolls(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-3 py-2 text-sm text-white light:text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-1.5">
                {ui.parkingMisc}
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={parkingMisc || ''}
                onChange={(e) => setParkingMisc(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-3 py-2 text-sm text-white light:text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Travelers */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600">
                {ui.numberOfTravelers}
              </label>
              <span className="text-sm font-bold text-amber-400 font-mono">
                {travelers} {travelers === 1 ? ui.person : ui.people}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={travelers}
              onChange={(e) => setTravelers(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Output Card */}
        <div className="lg:col-span-6 space-y-4">
          <motion.div
            layout
            className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950/30 border border-amber-500/30 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" />
                <span>{ui.grandTotalCost}</span>
              </span>
              <span className="text-xs font-mono text-neutral-400">
                {results.totalDistanceKm} km
              </span>
            </div>

            <div className="mb-6 pb-6 border-b border-neutral-800">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-6xl font-black tracking-tight text-white">
                  ₹{results.totalCost.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-neutral-400">{ui.splitPerPerson}:</span>
                <span className="text-sm font-bold text-amber-400 font-mono">
                  ₹{results.costPerPerson.toLocaleString('en-IN')} / {ui.person}
                </span>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
              <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-1">{ui.fuelShare}</span>
                <span className="text-sm sm:text-base font-bold text-white font-mono block">
                  ₹{results.fuelCost.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">{results.fuelRequiredL} L</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-1">{ui.tollShare}</span>
                <span className="text-sm sm:text-base font-bold text-white font-mono block">
                  ₹{results.tollsCost.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-neutral-400">FASTag</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-1">{ui.parkingShare}</span>
                <span className="text-sm sm:text-base font-bold text-white font-mono block">
                  ₹{results.miscCost.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-neutral-400">Fixed</span>
              </div>
            </div>

            <div className="mt-5 p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400">{ui.perKmNet}:</span>
              <span className="font-bold text-white text-sm font-mono">
                ₹{(results.totalCost / Math.max(1, results.totalDistanceKm)).toFixed(2)} / km
              </span>
            </div>
          </motion.div>

          <div className="p-4 rounded-xl bg-neutral-900/50 light:bg-slate-100 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>{ui.efficiencyTip}</p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
