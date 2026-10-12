import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Fuel, IndianRupee, MapPin, Leaf, CheckCircle2 } from 'lucide-react'
import { calculateFuelCost, FuelCostResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useI18n } from '../i18n/I18nContext'
import { useToolTranslations } from '../i18n/toolTranslations'
import { FuelCostUI } from '../i18n/tools/fuelCostI18n'

export const FuelCostTool: React.FC = () => {
  const tool = getToolBySlug('fuel-cost')!
  const { locale } = useI18n()
  const { meta, ui, formulaExplanation, assumptions, example, faqs } = useToolTranslations<FuelCostUI>(
    'fuel-cost',
    locale
  )

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
    return `${ui.resultSummaryTitle}
${ui.journeyDistanceText}: ${distanceKm} km | ${ui.mileageText}: ${mileageKmPerL} km/L | ${ui.fuelPriceText}: ₹${fuelPrice}/L
- ${ui.fuelRequiredText}: ${results.totalFuelNeededL} ${ui.litresNeeded}
- ${ui.totalFuelExpenseText}: ₹${results.totalCost.toLocaleString('en-IN')}
- ${ui.costPerKm}: ₹${results.costPerKm} / km
- ${ui.estimatedCo2} ~${results.co2EmissionsKg} kg CO2
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
              <MapPin className="w-5 h-5 text-orange-500" />
              <span>{ui.routeAndEconomy}</span>
            </h2>
            <span className="text-xs font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
              {ui.tripBudgeting}
            </span>
          </div>

          {/* Planned Distance */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600">
                {ui.totalDistanceToTravel}
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
                <span className="text-xs text-neutral-400 font-mono">{ui.kmShort}</span>
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
              <span>{ui.kmGuide50}</span>
              <span>{ui.kmGuide300}</span>
              <span>{ui.kmGuide1000}</span>
            </div>
          </div>

          {/* Vehicle Mileage */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600">
                {ui.vehicleMileage}
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
                <span className="text-xs text-neutral-400 font-mono">{ui.kmPerLShort}</span>
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
                {ui.bikeQuick}
              </button>
              <button
                type="button"
                onClick={() => setMileageKmPerL(18)}
                className="px-2 py-0.5 rounded bg-neutral-800 text-[11px] text-neutral-300 hover:text-white"
              >
                {ui.hatchbackQuick}
              </button>
              <button
                type="button"
                onClick={() => setMileageKmPerL(14)}
                className="px-2 py-0.5 rounded bg-neutral-800 text-[11px] text-neutral-300 hover:text-white"
              >
                {ui.suvQuick}
              </button>
            </div>
          </div>

          {/* Fuel Price */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              {ui.fuelRate}
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
                <span>{ui.totalFuelBudget}</span>
              </span>
              <span className="text-xs font-semibold text-neutral-400 font-mono">
                {distanceKm} km {ui.tripBadge}
              </span>
            </div>

            {/* Total Rupees */}
            <div className="mb-6 pb-6 border-b border-neutral-800">
              <span className="text-xs text-neutral-400 block font-medium">{ui.estimatedFuelCost}</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl sm:text-6xl font-black tracking-tight text-white">
                  ₹{results.totalCost.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="mt-2 text-xs text-orange-300/90 font-mono">
                {ui.fuelRequirementSummary
                  .replace('{litres}', results.totalFuelNeededL.toString())
                  .replace('{price}', fuelPrice.toString())}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                  <Fuel className="w-3.5 h-3.5 text-orange-400" />
                  <span>{ui.litresNeeded}</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white font-mono">
                  {results.totalFuelNeededL} L
                </p>
                <span className="text-[11px] text-neutral-400">{ui.totalVolume}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{ui.costPerKm}</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white font-mono">
                  ₹{results.costPerKm}
                </p>
                <span className="text-[11px] text-neutral-400">{ui.perKmTravel}</span>
              </div>
            </div>

            <div className="mt-5 p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>{ui.estimatedCo2}</span>
              </span>
              <span className="font-bold text-white text-sm font-mono">
                ~{results.co2EmissionsKg} kg CO2
              </span>
            </div>
          </motion.div>

          <div className="p-4 rounded-xl bg-neutral-900/50 light:bg-slate-100 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>{ui.safetyTip}</p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
