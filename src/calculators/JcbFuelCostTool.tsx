import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Truck, Fuel, IndianRupee, Clock, Calendar, CheckCircle2 } from 'lucide-react'
import {
  calculateJcbFuel,
  JCB_MACHINE_PRESETS,
  JcbFuelResult,
} from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useI18n } from '../i18n/I18nContext'
import { useToolTranslations } from '../i18n/toolTranslations'
import { JcbFuelCostUI } from '../i18n/tools/jcbFuelCostI18n'

export const JcbFuelCostTool: React.FC = () => {
  const tool = getToolBySlug('jcb-fuel-cost')!
  const { locale } = useI18n()
  const { meta, ui, formulaExplanation, assumptions, example, faqs } = useToolTranslations<JcbFuelCostUI>(
    'jcb-fuel-cost',
    locale
  )

  const [machineId, setMachineId] = useState('jcb-3dx')
  const [dailyHours, setDailyHours] = useState(8)
  const [fuelLph, setFuelLph] = useState(4.8)
  const [dieselPrice, setDieselPrice] = useState(90)
  const [workingDays, setWorkingDays] = useState(26)

  // When machine preset changes, update default fuelLph
  const handleMachineChange = (id: string) => {
    setMachineId(id)
    const preset = JCB_MACHINE_PRESETS.find((p) => p.id === id)
    if (preset) {
      setFuelLph(preset.typicalLph)
    }
  }

  const results: JcbFuelResult = useMemo(() => {
    return calculateJcbFuel(dailyHours, fuelLph, dieselPrice, workingDays)
  }, [dailyHours, fuelLph, dieselPrice, workingDays])

  const handleReset = () => {
    setMachineId('jcb-3dx')
    setDailyHours(8)
    setFuelLph(4.8)
    setDieselPrice(90)
    setWorkingDays(26)
  }

  const getResultSummary = () => {
    return `${ui.resultSummaryTitle}
${ui.machineText}: ${JCB_MACHINE_PRESETS.find((p) => p.id === machineId)?.name || 'Custom'}
${ui.operatingHoursText}: ${dailyHours} hrs/day (${workingDays} ${ui.daysShort}/mo)
${ui.dieselPriceSummaryText}: ₹${dieselPrice}/L at ${fuelLph} LPH
- ${ui.hourlyFuelCostText}: ₹${results.hourlyFuelCost.toLocaleString('en-IN')}/hr
- ${ui.dailyFuelCostText}: ₹${results.dailyFuelCost.toLocaleString('en-IN')} (${results.dailyFuelLitres} Litres)
- ${ui.monthlyFuelCostText}: ₹${results.monthlyFuelCost.toLocaleString('en-IN')} (${results.monthlyFuelLitres} Litres)
- ${ui.annualFuelBurnText}: ₹${results.annualFuelCost.toLocaleString('en-IN')}
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
        {/* Left Inputs Card */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-500" />
              <span>{ui.machineParams}</span>
            </h2>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {ui.liveReactivity}
            </span>
          </div>

          {/* Machine Preset Selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              {ui.machinePresetLabel}
            </label>
            <select
              value={machineId}
              onChange={(e) => handleMachineChange(e.target.value)}
              className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-4 py-3 text-sm text-white light:text-slate-900 focus:outline-none focus:border-amber-500 transition-colors"
            >
              {JCB_MACHINE_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name} (~{preset.typicalLph} L/hr)
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-neutral-400">
              {JCB_MACHINE_PRESETS.find((p) => p.id === machineId)?.description}
            </p>
          </div>

          {/* Operating Hours Per Day */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600">
                {ui.operatingHoursPerDay}
              </label>
              <span className="text-sm font-bold text-amber-400 font-mono">
                {dailyHours} {ui.hoursPerDay}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={dailyHours}
              onChange={(e) => setDailyHours(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
              <span>{ui.shiftGuide1}</span>
              <span>{ui.shiftGuide8}</span>
              <span>{ui.shiftGuide16}</span>
            </div>
          </div>

          {/* Hourly Fuel Consumption (LPH) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600">
                {ui.fuelConsumptionLph}
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="40"
                  value={fuelLph}
                  onChange={(e) => setFuelLph(parseFloat(e.target.value) || 0)}
                  className="w-20 bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-lg px-2.5 py-1 text-sm font-mono text-right text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                />
                <span className="text-xs text-neutral-400 font-mono">{ui.lphShort}</span>
              </div>
            </div>
            <input
              type="range"
              min="1.5"
              max="25"
              step="0.1"
              value={fuelLph}
              onChange={(e) => setFuelLph(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Two-Column: Diesel Price & Monthly Working Days */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-1.5">
                {ui.dieselPriceLabel}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-neutral-400 text-sm font-bold">₹</span>
                <input
                  type="number"
                  min="50"
                  max="150"
                  value={dieselPrice}
                  onChange={(e) => setDieselPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl pl-8 pr-3 py-2.5 text-sm font-bold text-white light:text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-1.5">
                {ui.daysWorkedMonth}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={workingDays}
                  onChange={(e) => setWorkingDays(parseInt(e.target.value) || 0)}
                  className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-3 py-2.5 text-sm font-bold text-white light:text-slate-900 focus:outline-none focus:border-amber-500"
                />
                <span className="absolute right-3 top-2.5 text-xs text-neutral-400 font-mono">{ui.daysShort}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Animated Results Card */}
        <div className="lg:col-span-6 space-y-4">
          <motion.div
            layout
            className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950/30 border border-amber-500/30 shadow-2xl relative overflow-hidden"
          >
            {/* Top glowing ambient highlight */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                <Fuel className="w-4 h-4 text-amber-400" />
                <span>{ui.operatingDieselBurn}</span>
              </span>
              <span className="text-xs font-bold text-neutral-400">
                {dailyHours} hrs × ₹{dieselPrice}/L
              </span>
            </div>

            {/* Flagship Daily & Monthly Headline */}
            <div className="mb-6 pb-6 border-b border-neutral-800">
              <span className="text-xs text-neutral-400 block font-medium">{ui.estimatedDailyDieselCost}</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                  ₹{results.dailyFuelCost.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-semibold text-neutral-400">{ui.perDay}</span>
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-amber-300/90 font-mono">
                <span>
                  {ui.burnSummaryText
                    .replace('{litres}', results.dailyFuelLitres.toString())
                    .replace('{hourlyCost}', results.hourlyFuelCost.toString())}
                </span>
              </div>
            </div>

            {/* 4 Multi-Dimension Result Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Cost / Hour */}
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{ui.costPerHour}</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white font-mono">
                  ₹{results.hourlyFuelCost.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-neutral-400">{fuelLph} L/hr</span>
              </div>

              {/* Litres / Day */}
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                  <Fuel className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{ui.litresPerDay}</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white font-mono">
                  {results.dailyFuelLitres} L
                </p>
                <span className="text-[11px] text-neutral-400">{dailyHours} hours</span>
              </div>

              {/* Weekly Fuel Cost */}
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  <span>{ui.weeklyCost}</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white font-mono">
                  ₹{results.weeklyFuelCost.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-neutral-400">{ui.daysShift}</span>
              </div>

              {/* Monthly Fuel Cost */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
                  <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
                  <span>{ui.monthlyCost}</span>
                </div>
                <p className="text-lg sm:text-xl font-black text-amber-400 font-mono">
                  ₹{results.monthlyFuelCost.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-amber-300/80">
                  {ui.perMonthLitres.replace('{litres}', results.monthlyFuelLitres.toString())}
                </span>
              </div>
            </div>

            {/* Annual Cumulative Banner */}
            <div className="mt-5 p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400">{ui.annualDieselExpenditure}</span>
              <span className="font-bold text-white text-sm font-mono">
                ₹{results.annualFuelCost.toLocaleString('en-IN')}
              </span>
            </div>
          </motion.div>

          {/* Quick contractor check note */}
          <div className="p-4 rounded-xl bg-neutral-900/50 light:bg-slate-100 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong>{ui.contractorTipTitle}</strong> {ui.contractorTipDesc}
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
