import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Fuel, ShieldCheck, Wrench, IndianRupee, PieChart, TrendingDown } from 'lucide-react'
import { calculateMonthlyVehicleRunningCost, MonthlyVehicleRunningCostResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const MonthlyVehicleRunningCostTool: React.FC = () => {
  const tool = getToolBySlug('monthly-vehicle-running-cost')!

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
    return `Monthly Vehicle Running Cost Breakdown:
- Monthly Distance: ${monthlyKm} km
- Fuel Expense: ₹${result.monthlyFuelCost.toLocaleString('en-IN')}
- EMI / Loan: ₹${monthlyEmi.toLocaleString('en-IN')}
- Insurance (Monthly share): ₹${result.monthlyInsurance.toLocaleString('en-IN')}
- Service & Maintenance: ₹${result.monthlyMaintenance.toLocaleString('en-IN')}
------------------------------------------------
TOTAL MONTHLY OUTFLOW: ₹${result.totalMonthlyCost.toLocaleString('en-IN')}
TOTAL ANNUAL OUTFLOW: ₹${result.annualTotalCost.toLocaleString('en-IN')}
EFFECTIVE COST PER KM: ₹${result.costPerKm}/km
Calculated via IndiaTools (https://indiatools-rho.vercel.app)`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Form */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              <span>Monthly Ownership Inputs</span>
            </h2>
            <span className="text-xs font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
              Complete TCO Model
            </span>
          </div>

          {/* Monthly Distance */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>Expected Monthly Driving</span>
              <span className="font-mono text-orange-400 font-bold">{monthlyKm.toLocaleString('en-IN')} km/month</span>
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
              <span>200 km (Weekend only)</span>
              <span>1,200 km (Daily Commute)</span>
              <span>3,500+ km (Commercial)</span>
            </div>
          </div>

          {/* Mileage & Fuel Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-1.5">
                Vehicle Mileage (km/L)
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
                Fuel Price (₹/Litre)
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
              Loan, Insurance & Upkeep
            </h3>
            
            <div>
              <label className="block text-xs text-neutral-300 light:text-slate-700 mb-1">
                Monthly Loan EMI (₹)
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
                  Annual Insurance Premium (₹)
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
                  Annual Maintenance / Service (₹)
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
                Total Monthly Outflow
              </span>
              <span className="text-xs text-orange-400 font-mono font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                ₹{result.costPerKm}/km
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                ₹{result.totalMonthlyCost.toLocaleString('en-IN')}
                <span className="text-lg text-neutral-400 font-normal"> / month</span>
              </div>
              <p className="text-xs text-neutral-400 light:text-slate-500 mt-2">
                Annual combined vehicle commitment: <span className="text-white light:text-slate-900 font-bold font-mono">₹{result.annualTotalCost.toLocaleString('en-IN')}/year</span>
              </p>
            </div>

            {/* Cost Breakdown Bars */}
            <div className="space-y-3 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300 light:text-slate-700 flex items-center gap-1.5">
                  <Fuel className="w-3.5 h-3.5 text-orange-400" /> Fuel Expense
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
                      <IndianRupee className="w-3.5 h-3.5 text-amber-400" /> Loan EMI
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
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Insurance (Monthly Prorated)
                </span>
                <span className="font-mono font-bold text-white light:text-slate-900">
                  ₹{result.monthlyInsurance.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-neutral-300 light:text-slate-700 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-emerald-400" /> Service & Maintenance
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
              <span>Indian TCO Insight</span>
            </div>
            <p>
              In India, fixed costs (loan depreciation + insurance) often exceed fuel costs for drives under 800 km/month. At ₹{result.costPerKm}/km, if you drive infrequently, cab services may be more economical than outright ownership.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
