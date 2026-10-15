import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Gauge, Fuel, IndianRupee, Sparkles, CheckCircle2 } from 'lucide-react'
import { calculateMileage, MileageResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useI18n } from '../i18n/I18nContext'
import { registerToolTranslations, useToolTranslations } from '../i18n/toolTranslations'
import { VehicleMileageUI, vehicleMileageTranslations } from '../i18n/tools/vehicleMileageI18n'

// Defensive safety registration in case bundle is imported before or after registry initialization
registerToolTranslations('vehicle-mileage', vehicleMileageTranslations)

export const VehicleMileageTool: React.FC = () => {
  const tool = getToolBySlug('vehicle-mileage')!
  const { locale } = useI18n()
  const { meta, ui, formulaExplanation, assumptions, example, faqs } = useToolTranslations<VehicleMileageUI>(
    'vehicle-mileage',
    locale
  )

  const [distanceKm, setDistanceKm] = useState<number>(450)
  const [fuelLitres, setFuelLitres] = useState<number>(25)
  const [fuelPrice, setFuelPrice] = useState<number>(102)

  const results: MileageResult = useMemo(() => {
    return calculateMileage(distanceKm, fuelLitres, fuelPrice)
  }, [distanceKm, fuelLitres, fuelPrice])

  const localizedRating = useMemo(() => {
    if (distanceKm <= 0 || fuelLitres <= 0) return ui?.invalidInputsRating || 'Invalid'
    if (results.rating === 'exceptional') return ui?.exceptionalRating || 'Exceptional'
    if (results.rating === 'good') return ui?.goodRating || 'Good'
    if (results.rating === 'moderate') return ui?.moderateRating || 'Moderate'
    return ui?.heavyRating || 'Heavy'
  }, [results.rating, distanceKm, fuelLitres, ui])

  const handleReset = () => {
    setDistanceKm(450)
    setFuelLitres(25)
    setFuelPrice(102)
  }

  const getResultSummary = () => {
    return `${ui.resultSummaryTitle}
${ui.distanceTraveled}: ${distanceKm} km | ${ui.fuelRefilled}: ${fuelLitres} L | ${ui.currentFuelPrice}: ₹${fuelPrice}/L
- ${ui.calculatedMileage}: ${results.mileageKmPerL} km/L
- ${ui.runningCostText} ₹${results.fuelCostPerKm} / km
- ${ui.costFor100KmText} ₹${results.costPer100Km}
- ${ui.ratingText} ${localizedRating}
${ui.calculatedOn}`
  }

  // Create customized tool definition with localized metadata & content
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
      faqs: faqs || tool.faqs,
    }
  }, [tool, meta, formulaExplanation, assumptions, example, faqs])

  return (
    <ToolPageLayout
      tool={localizedTool}
      customH1={meta.h1}
      customSubtitle={meta.subtitle}
      onReset={handleReset}
      onCopyResult={getResultSummary}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs Card */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-orange-500" />
              <span>{ui.tripRefuelingData}</span>
            </h2>
            <span className="text-xs font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
              {ui.tankToTankMethod}
            </span>
          </div>

          {/* Distance Traveled */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600">
                {ui.distanceTraveled}
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
              max="1200"
              step="5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
              <span>{ui.cityGuide}</span>
              <span>{ui.highwayGuide}</span>
              <span>{ui.longTourGuide}</span>
            </div>
          </div>

          {/* Fuel Consumed */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600">
                {ui.fuelRefilled}
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="500"
                  value={fuelLitres || ''}
                  onChange={(e) => setFuelLitres(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-lg px-2.5 py-1 text-sm font-mono text-right text-orange-400 font-bold focus:outline-none focus:border-orange-500"
                />
                <span className="text-xs text-neutral-400 font-mono">{ui.litres}</span>
              </div>
            </div>
            <input
              type="range"
              min="2"
              max="80"
              step="0.5"
              value={fuelLitres}
              onChange={(e) => setFuelLitres(parseFloat(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </div>

          {/* Fuel Price (₹/L) */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              {ui.currentFuelPrice}
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
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setFuelPrice(102)}
                className="px-2.5 py-1 rounded bg-neutral-800 text-[11px] text-neutral-300 hover:text-white"
              >
                {ui.petrolQuick}
              </button>
              <button
                type="button"
                onClick={() => setFuelPrice(90)}
                className="px-2.5 py-1 rounded bg-neutral-800 text-[11px] text-neutral-300 hover:text-white"
              >
                {ui.dieselQuick}
              </button>
              <button
                type="button"
                onClick={() => setFuelPrice(85)}
                className="px-2.5 py-1 rounded bg-neutral-800 text-[11px] text-neutral-300 hover:text-white"
              >
                {ui.cngQuick}
              </button>
            </div>
          </div>
        </div>

        {/* Right Animated Results Card */}
        <div className="lg:col-span-6 space-y-4">
          <motion.div
            layout
            className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-orange-950/30 border border-orange-500/30 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-orange-400 font-semibold flex items-center gap-1.5">
                <Gauge className="w-4 h-4" />
                <span>{ui.fuelEconomyAnalytics}</span>
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                {(localizedRating || 'Good').split(' ')[0]}
              </span>
            </div>

            {/* Main Headline: KM/L */}
            <div className="mb-6 pb-6 border-b border-neutral-800">
              <span className="text-xs text-neutral-400 block font-medium">{ui.calculatedMileage}</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl sm:text-6xl font-black tracking-tight text-white">
                  {results.mileageKmPerL}
                </span>
                <span className="text-lg font-bold text-orange-400">KM / L</span>
              </div>
              <p className="mt-2 text-xs text-neutral-400">
                {localizedRating || ''}
              </p>
            </div>

            {/* Multi-Dimension Breakdown Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Cost / Km */}
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                  <IndianRupee className="w-3.5 h-3.5 text-orange-400" />
                  <span>{ui.costPerKm}</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white font-mono">
                  ₹{results.fuelCostPerKm}
                </p>
                <span className="text-[11px] text-neutral-400">{ui.perKilometer}</span>
              </div>

              {/* Cost for 100 Km */}
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                  <Fuel className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{ui.costFor100Km}</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white font-mono">
                  ₹{results.costPer100Km}
                </p>
                <span className="text-[11px] text-neutral-400">{(100 / (results.mileageKmPerL || 1)).toFixed(1)} L / 100km</span>
              </div>
            </div>

            {/* Total Refueling Spend */}
            <div className="mt-5 p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400">{ui.totalFuelSpend}</span>
              <span className="font-bold text-white text-sm font-mono">
                ₹{Math.round(fuelLitres * fuelPrice).toLocaleString('en-IN')}
              </span>
            </div>
          </motion.div>

          <div className="p-4 rounded-xl bg-neutral-900/50 light:bg-slate-100 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              {ui.tyreAdvice}
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
