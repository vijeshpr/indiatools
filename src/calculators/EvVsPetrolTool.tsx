import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Zap, CheckCircle2 } from 'lucide-react'
import { calculateEvVsPetrol, EvVsPetrolResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useI18n } from '../i18n/I18nContext'
import { registerToolTranslations, useToolTranslations } from '../i18n/toolTranslations'
import { EvVsPetrolUI, evVsPetrolTranslations } from '../i18n/tools/evVsPetrolI18n'

// Defensive safety registration in case bundle is imported before or after registry initialization
registerToolTranslations('ev-vs-petrol', evVsPetrolTranslations)

export const EvVsPetrolTool: React.FC = () => {
  const tool = getToolBySlug('ev-vs-petrol')!
  const { locale } = useI18n()
  const { meta, ui, formulaExplanation, assumptions, example, faqs } = useToolTranslations<EvVsPetrolUI>(
    'ev-vs-petrol',
    locale
  )

  const [monthlyKm, setMonthlyKm] = useState<number>(1500)
  const [petrolPrice, setPetrolPrice] = useState<number>(102)
  const [electricityRate, setElectricityRate] = useState<number>(8.5)
  const [petrolMileage, setPetrolMileage] = useState<number>(14)
  const [evEfficiency, setEvEfficiency] = useState<number>(7.5) // 7.5 km per kWh
  const [extraPriceEv, setExtraPriceEv] = useState<number>(350000)

  const result: EvVsPetrolResult = useMemo(() => {
    return calculateEvVsPetrol(
      monthlyKm,
      petrolMileage,
      petrolPrice,
      evEfficiency,
      electricityRate,
      extraPriceEv
    )
  }, [monthlyKm, petrolMileage, petrolPrice, evEfficiency, electricityRate, extraPriceEv])

  const handleReset = () => {
    setMonthlyKm(1500)
    setPetrolPrice(102)
    setElectricityRate(8.5)
    setPetrolMileage(14)
    setEvEfficiency(7.5)
    setExtraPriceEv(350000)
  }

  const getResultSummary = () => {
    return `${ui.resultSummaryTitle}
- ${ui.monthlyDrivingText}: ${monthlyKm} km
- ${ui.petrolRunningCostText}: ₹${result.petrolCostPerKm}/km (₹${result.petrolMonthlyCost.toLocaleString('en-IN')}/mo)
- ${ui.evRunningCostText}: ₹${result.evCostPerKm}/km (₹${result.evMonthlyCost.toLocaleString('en-IN')}/mo)
- ${ui.netMonthlySavingsText}: ₹${result.monthlySavingsWithEv.toLocaleString('en-IN')}
- ${ui.annualEnergySavingsText}: ₹${result.annualSavings.toLocaleString('en-IN')}
- ${ui.breakevenDistanceText}: ${result.breakevenKm.toLocaleString('en-IN')} km (~${result.breakevenYears} ${ui.years})
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
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>{ui.evVsIceParams}</span>
            </h2>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {ui.greenMobilityTco}
            </span>
          </div>

          {/* Monthly Distance */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>{ui.expectedMonthlyDriving}</span>
              <span className="font-mono text-emerald-400 font-bold">{monthlyKm.toLocaleString('en-IN')} {ui.kmPerMonth}</span>
            </div>
            <input
              type="range"
              min="500"
              max="5000"
              step="50"
              value={monthlyKm}
              onChange={(e) => setMonthlyKm(parseFloat(e.target.value) || 0)}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Side by side inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-neutral-950/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 space-y-3">
              <span className="text-xs font-mono font-bold text-orange-400 uppercase">{ui.petrolIce}</span>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">{ui.petrolPrice}</label>
                <input
                  type="number"
                  value={petrolPrice || ''}
                  onChange={(e) => setPetrolPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-900 light:bg-white border border-neutral-700 light:border-slate-300 rounded-lg px-3 py-2 font-mono text-white light:text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">{ui.iceMileage}</label>
                <input
                  type="number"
                  step="0.5"
                  value={petrolMileage || ''}
                  onChange={(e) => setPetrolMileage(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-900 light:bg-white border border-neutral-700 light:border-slate-300 rounded-lg px-3 py-2 font-mono text-white light:text-slate-900 text-sm"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 space-y-3">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">{ui.electricEv}</span>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">{ui.powerTariff}</label>
                <input
                  type="number"
                  step="0.5"
                  value={electricityRate || ''}
                  onChange={(e) => setElectricityRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-900 light:bg-white border border-neutral-700 light:border-slate-300 rounded-lg px-3 py-2 font-mono text-white light:text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">{ui.evEfficiency}</label>
                <input
                  type="number"
                  step="0.5"
                  value={evEfficiency || ''}
                  onChange={(e) => setEvEfficiency(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-900 light:bg-white border border-neutral-700 light:border-slate-300 rounded-lg px-3 py-2 font-mono text-white light:text-slate-900 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Upfront Price Gap */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-1.5">
              {ui.evUpfrontPricePremium}
            </label>
            <input
              type="number"
              step="10000"
              value={extraPriceEv || ''}
              onChange={(e) => setExtraPriceEv(parseFloat(e.target.value) || 0)}
              className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-4 py-2.5 font-mono text-white light:text-slate-900 focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              {ui.upfrontPriceHint}
            </p>
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
                {ui.annualFuelSavings}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {ui.savePercent}
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-emerald-400">
                ₹{result.annualSavings.toLocaleString('en-IN')}
                <span className="text-xl text-neutral-400 font-normal"> {ui.perYear}</span>
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                {ui.monthlyInPocketSavings} <span className="font-bold text-white light:text-slate-900 font-mono">₹{result.monthlySavingsWithEv.toLocaleString('en-IN')}{ui.perMonth}</span>
              </p>
            </div>

            {/* Per Km Comparison */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800 light:border-slate-200">
                <span className="text-[11px] text-neutral-400 block mb-1">{ui.petrolCostPerKm}</span>
                <span className="text-xl font-bold font-mono text-orange-400">₹{result.petrolCostPerKm}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800 light:border-slate-200">
                <span className="text-[11px] text-neutral-400 block mb-1">{ui.evElectricityPerKm}</span>
                <span className="text-xl font-bold font-mono text-emerald-400">₹{result.evCostPerKm}</span>
              </div>
            </div>

            {/* Breakeven Timeline */}
            <div className="mt-5 p-4 rounded-xl bg-neutral-950/80 light:bg-slate-50 border border-neutral-800 light:border-slate-200">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-400">{ui.upfrontPriceBreakeven}</span>
                <span className="text-white font-mono font-bold">{result.breakevenYears} {ui.years} ({result.breakevenKm.toLocaleString('en-IN')} km)</span>
              </div>
              <p className="text-[11px] text-neutral-500">
                {(ui.breakevenFootnote || 'Breakeven calculated at {monthlyKm} km/month').replace('{monthlyKm}', monthlyKm.toLocaleString('en-IN'))}
              </p>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{ui.realWorldNuanceTitle}</span>
            </div>
            <p>
              {ui.realWorldNuanceDesc}
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
