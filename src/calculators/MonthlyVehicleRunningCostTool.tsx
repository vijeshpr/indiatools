import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Fuel, ShieldCheck, Wrench, IndianRupee, TrendingDown } from 'lucide-react'
import { calculateMonthlyVehicleRunningCost, MonthlyVehicleRunningCostResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useI18n } from '../i18n/I18nContext'
import { registerToolTranslations, useToolTranslations } from '../i18n/toolTranslations'
import { MonthlyVehicleRunningCostUI, monthlyVehicleRunningCostTranslations } from '../i18n/tools/monthlyVehicleRunningCostI18n'

// Defensive safety registration in case bundle is imported before or after registry initialization
registerToolTranslations('monthly-vehicle-running-cost', monthlyVehicleRunningCostTranslations)

export const MonthlyVehicleRunningCostTool: React.FC = () => {
  const tool = getToolBySlug('monthly-vehicle-running-cost')!
  const { locale } = useI18n()
  const { meta, ui, formulaExplanation, assumptions, example, faqs } = useToolTranslations<MonthlyVehicleRunningCostUI>(
    'monthly-vehicle-running-cost',
    locale
  )

  const [monthlyKm, setMonthlyKm] = useState<number>(1200)
  const [fuelMileage, setFuelMileage] = useState<number>(15)
  const [fuelPrice, setFuelPrice] = useState<number>(102)
  const [monthlyEmi, setMonthlyEmi] = useState<number>(8500)
  const [annualInsurance, setAnnualInsurance] = useState<number>(14000)
  const [annualMaintenance, setAnnualMaintenance] = useState<number>(9000)

  const result: MonthlyVehicleRunningCostResult = useMemo(() => {
    return calculateMonthlyVehicleRunningCost(
      monthlyKm,
      fuelMileage,
      fuelPrice,
      monthlyEmi,
      annualInsurance,
      annualMaintenance
    )
  }, [monthlyKm, fuelMileage, fuelPrice, monthlyEmi, annualInsurance, annualMaintenance])

  const handleReset = () => {
    setMonthlyKm(1200)
    setFuelMileage(15)
    setFuelPrice(102)
    setMonthlyEmi(8500)
    setAnnualInsurance(14000)
    setAnnualMaintenance(9000)
  }

  const getResultSummary = () => {
    return `${ui.resultSummaryTitle}
- ${ui.monthlyDistanceText}: ${monthlyKm} km
- ${ui.fuelExpenseText}: ₹${result.monthlyFuelCost.toLocaleString('en-IN')}
- ${ui.emiLoanText}: ₹${monthlyEmi.toLocaleString('en-IN')}
- ${ui.insuranceShareText}: ₹${result.monthlyInsurance.toLocaleString('en-IN')}
- ${ui.maintenanceText}: ₹${result.monthlyMaintenance.toLocaleString('en-IN')}
------------------------------------------------
${ui.totalMonthlyOutflowText}: ₹${result.totalMonthlyCost.toLocaleString('en-IN')}
${ui.totalAnnualOutflowText}: ₹${result.annualTotalCost.toLocaleString('en-IN')}
${ui.effectiveCostPerKmText}: ₹${result.costPerKm}/km
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
        {/* Left Input Form */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              <span>{ui.monthlyOwnershipInputs}</span>
            </h2>
            <span className="text-xs font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
              {ui.completeTcoModel}
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
              min="200"
              max="5000"
              step="50"
              value={monthlyKm}
              onChange={(e) => setMonthlyKm(parseFloat(e.target.value) || 0)}
              className="w-full accent-orange-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-500 mt-1">
              <span>{ui.drivingGuideWeekend}</span>
              <span>{ui.drivingGuideCommute}</span>
              <span>{ui.drivingGuideCommercial}</span>
            </div>
          </div>

          {/* Mileage & Fuel Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-1.5">
                {ui.vehicleMileage}
              </label>
              <input
                type="number"
                step="0.5"
                min="5"
                max="80"
                value={fuelMileage || ''}
                onChange={(e) => setFuelMileage(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-3.5 py-2.5 font-mono font-bold text-white light:text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-1.5">
                {ui.fuelPrice}
              </label>
              <input
                type="number"
                step="1"
                min="50"
                value={fuelPrice || ''}
                onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-3.5 py-2.5 font-mono font-bold text-white light:text-slate-900 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Fixed Monthly Costs */}
          <div className="space-y-4 pt-2 border-t border-neutral-800 light:border-slate-100">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600">
              {ui.loanInsuranceUpkeep}
            </h3>
            
            <div>
              <label className="block text-xs text-neutral-300 light:text-slate-700 mb-1">
                {ui.monthlyLoanEmi}
              </label>
              <input
                type="number"
                step="500"
                value={monthlyEmi || ''}
                onChange={(e) => setMonthlyEmi(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-3 py-2 font-mono text-white light:text-slate-900 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-300 light:text-slate-700 mb-1">
                  {ui.annualInsurance}
                </label>
                <input
                  type="number"
                  step="500"
                  value={annualInsurance || ''}
                  onChange={(e) => setAnnualInsurance(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-3 py-2 font-mono text-white light:text-slate-900 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-300 light:text-slate-700 mb-1">
                  {ui.annualMaintenance}
                </label>
                <input
                  type="number"
                  step="500"
                  value={annualMaintenance || ''}
                  onChange={(e) => setAnnualMaintenance(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-3 py-2 font-mono text-white light:text-slate-900 focus:outline-none focus:border-orange-500 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Results */}
        <div className="lg:col-span-6 space-y-6">
          <motion.div
            layout
            className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 light:from-white light:to-slate-50 border border-neutral-800 light:border-slate-200 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-60 h-60 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-400 light:text-slate-600">
                {ui.totalMonthlyOutflow}
              </span>
              <span className="text-xs text-orange-400 font-mono font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                ₹{result.costPerKm}/km
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                ₹{result.totalMonthlyCost.toLocaleString('en-IN')}
                <span className="text-lg text-neutral-400 font-normal"> {ui.perMonth}</span>
              </div>
              <p className="text-xs text-neutral-400 light:text-slate-500 mt-2">
                {ui.annualCommitmentText} <span className="text-white light:text-slate-900 font-bold font-mono">₹{result.annualTotalCost.toLocaleString('en-IN')}{ui.perYear}</span>
              </p>
            </div>

            {/* Cost Breakdown Bars */}
            <div className="space-y-3 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300 light:text-slate-700 flex items-center gap-1.5">
                  <Fuel className="w-3.5 h-3.5 text-orange-400" /> {ui.fuelExpenseShare}
                </span>
                <span className="font-mono font-bold text-white light:text-slate-900">
                  ₹{result.monthlyFuelCost.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-800 light:bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${Math.min(100, (result.monthlyFuelCost / result.totalMonthlyCost) * 100)}%` }}
                />
              </div>

              {monthlyEmi > 0 && (
                <>
                  <div className="flex justify-between items-center text-xs pt-1">
                    <span className="text-neutral-300 light:text-slate-700 flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-amber-400" /> {ui.loanEmiShare}
                    </span>
                    <span className="font-mono font-bold text-white light:text-slate-900">
                      ₹{monthlyEmi.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-800 light:bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${Math.min(100, (monthlyEmi / result.totalMonthlyCost) * 100)}%` }}
                    />
                  </div>
                </>
              )}

              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-neutral-300 light:text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> {ui.insuranceShare}
                </span>
                <span className="font-mono font-bold text-white light:text-slate-900">
                  ₹{result.monthlyInsurance.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-neutral-300 light:text-slate-700 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-emerald-400" /> {ui.serviceShare}
                </span>
                <span className="font-mono font-bold text-white light:text-slate-900">
                  ₹{result.monthlyMaintenance.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 light:text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 light:text-slate-800 font-semibold">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <span>{ui.tcoInsightTitle}</span>
            </div>
            <p>
              {(ui.tcoInsightDesc || 'Running cost is ₹{costPerKm}/km').replace('{costPerKm}', result.costPerKm.toString())}
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
