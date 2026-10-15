import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRightLeft, CheckCircle2 } from 'lucide-react'
import { calculatePetrolVsDiesel, PetrolVsDieselResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useI18n } from '../i18n/I18nContext'
import { registerToolTranslations, useToolTranslations } from '../i18n/toolTranslations'
import { PetrolVsDieselUI, petrolVsDieselTranslations } from '../i18n/tools/petrolVsDieselI18n'

// Defensive safety registration in case bundle is imported before or after registry initialization
registerToolTranslations('petrol-vs-diesel', petrolVsDieselTranslations)

export const PetrolVsDieselTool: React.FC = () => {
  const tool = getToolBySlug('petrol-vs-diesel')!
  const { locale } = useI18n()
  const { meta, ui, formulaExplanation, assumptions, example, faqs } = useToolTranslations<PetrolVsDieselUI>(
    'petrol-vs-diesel',
    locale
  )

  const [monthlyKm, setMonthlyKm] = useState<number>(1500)
  const [petrolMileage, setPetrolMileage] = useState<number>(14)
  const [dieselMileage, setDieselMileage] = useState<number>(19)
  const [petrolPrice, setPetrolPrice] = useState<number>(102)
  const [dieselPrice, setDieselPrice] = useState<number>(90)
  const [extraPriceDiesel, setExtraPriceDiesel] = useState<number>(125000)

  const result: PetrolVsDieselResult = useMemo(() => {
    return calculatePetrolVsDiesel(
      monthlyKm,
      petrolMileage,
      dieselMileage,
      petrolPrice,
      dieselPrice,
      extraPriceDiesel
    )
  }, [monthlyKm, petrolMileage, dieselMileage, petrolPrice, dieselPrice, extraPriceDiesel])

  const handleReset = () => {
    setMonthlyKm(1500)
    setPetrolMileage(14)
    setDieselMileage(19)
    setPetrolPrice(102)
    setDieselPrice(90)
    setExtraPriceDiesel(125000)
  }

  const getResultSummary = () => {
    return `${ui.resultSummaryTitle}
- ${ui.monthlyDistanceText}: ${monthlyKm} km
- ${ui.petrolMonthlyCostText}: ₹${result.monthlyPetrolCost.toLocaleString('en-IN')} (₹${(result.monthlyPetrolCost / Math.max(1, monthlyKm)).toFixed(2)}/km)
- ${ui.dieselMonthlyCostText}: ₹${result.monthlyDieselCost.toLocaleString('en-IN')} (₹${(result.monthlyDieselCost / Math.max(1, monthlyKm)).toFixed(2)}/km)
- ${ui.monthlyFuelSavingsText}: ₹${result.monthlySavingsWithDiesel.toLocaleString('en-IN')}
- ${ui.dieselPremiumPriceText}: ₹${extraPriceDiesel.toLocaleString('en-IN')}
- ${ui.breakevenDistanceText}: ${result.breakevenKm.toLocaleString('en-IN')} km (${result.breakevenMonths} ${ui.months})
- ${ui.recommendationText}: ${result.isDieselRecommended ? ui.dieselRecommended : ui.petrolRecommended}
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
              <ArrowRightLeft className="w-5 h-5 text-orange-500" />
              <span>{ui.fuelEconomicsInput}</span>
            </h2>
            <span className="text-xs font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
              {ui.breakevenModel}
            </span>
          </div>

          {/* Monthly Distance */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>{ui.expectedMonthlyDriving}</span>
              <span className="font-mono text-orange-400 font-bold">{monthlyKm.toLocaleString('en-IN')} {ui.kmPerMonth}</span>
            </div>
            <input
              type="range"
              min="300"
              max="4000"
              step="50"
              value={monthlyKm}
              onChange={(e) => setMonthlyKm(parseFloat(e.target.value) || 0)}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </div>

          {/* Petrol Parameters */}
          <div className="p-4 rounded-xl bg-neutral-950/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              {ui.petrolVariant}
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">{ui.fuelPrice}</label>
                <input
                  type="number"
                  value={petrolPrice || ''}
                  onChange={(e) => setPetrolPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-900 light:bg-white border border-neutral-700 light:border-slate-300 rounded-lg px-3 py-2 font-mono text-white light:text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">{ui.mileage}</label>
                <input
                  type="number"
                  step="0.5"
                  value={petrolMileage || ''}
                  onChange={(e) => setPetrolMileage(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-900 light:bg-white border border-neutral-700 light:border-slate-300 rounded-lg px-3 py-2 font-mono text-white light:text-slate-900 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Diesel Parameters */}
          <div className="p-4 rounded-xl bg-neutral-950/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
              {ui.dieselVariant}
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">{ui.fuelPrice}</label>
                <input
                  type="number"
                  value={dieselPrice || ''}
                  onChange={(e) => setDieselPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-900 light:bg-white border border-neutral-700 light:border-slate-300 rounded-lg px-3 py-2 font-mono text-white light:text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">{ui.mileage}</label>
                <input
                  type="number"
                  step="0.5"
                  value={dieselMileage || ''}
                  onChange={(e) => setDieselMileage(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-900 light:bg-white border border-neutral-700 light:border-slate-300 rounded-lg px-3 py-2 font-mono text-white light:text-slate-900 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Diesel Extra Acquisition Cost */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-1.5">
              {ui.extraPriceDiesel}
            </label>
            <input
              type="number"
              step="5000"
              value={extraPriceDiesel || ''}
              onChange={(e) => setExtraPriceDiesel(parseFloat(e.target.value) || 0)}
              className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-4 py-2.5 font-mono text-white light:text-slate-900 focus:outline-none focus:border-orange-500"
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              {ui.extraPriceHint}
            </p>
          </div>
        </div>

        {/* Right Output Cards */}
        <div className="lg:col-span-6 space-y-6">
          <motion.div
            layout
            className="p-6 sm:p-8 rounded-3xl bg-neutral-900/90 light:bg-white border border-neutral-800 light:border-slate-200 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-400">
                {ui.breakevenPeriod}
              </span>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                  result.isDieselRecommended
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}
              >
                {result.isDieselRecommended ? ui.dieselFeasible : ui.petrolFavored}
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                {result.breakevenMonths}
                <span className="text-xl text-neutral-400 font-normal"> {ui.months}</span>
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                {(ui.breakevenDescription || 'Breakeven is achieved after driving {breakevenKm} km').replace('{breakevenKm}', result.breakevenKm.toLocaleString('en-IN'))}
              </p>
            </div>

            {/* Side-by-side fuel cost */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800 light:border-slate-200">
                <span className="text-[11px] text-neutral-400 block mb-1">{ui.petrolMonthlyFuel}</span>
                <span className="text-lg font-bold font-mono text-amber-400">₹{result.monthlyPetrolCost.toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-neutral-500 block mt-1">₹{(result.monthlyPetrolCost / Math.max(1, monthlyKm)).toFixed(2)}/km</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800 light:border-slate-200">
                <span className="text-[11px] text-neutral-400 block mb-1">{ui.dieselMonthlyFuel}</span>
                <span className="text-lg font-bold font-mono text-blue-400">₹{result.monthlyDieselCost.toLocaleString('en-IN')}</span>
                <span className="text-[11px] text-neutral-500 block mt-1">₹{(result.monthlyDieselCost / Math.max(1, monthlyKm)).toFixed(2)}/km</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
              <span className="text-neutral-300 font-medium">{ui.monthlySavingsWithDiesel}</span>
              <span className="text-emerald-400 font-bold font-mono text-sm">
                +₹{result.monthlySavingsWithDiesel.toLocaleString('en-IN')}/mo
              </span>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{ui.verdictTitle}</span>
            </div>
            <p>
              {ui.verdictDesc}
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
