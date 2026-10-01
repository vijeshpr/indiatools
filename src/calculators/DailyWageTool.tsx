import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Clock, Briefcase, IndianRupee, CheckCircle2 } from 'lucide-react'
import { calculateDailyWage, DailyWageResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const DailyWageTool: React.FC = () => {
  const tool = getToolBySlug('daily-wage')!

  const [monthlySalary, setMonthlySalary] = useState<number>(26000)
  const [workingDays, setWorkingDays] = useState<number>(26)
  const [dailyHours, setDailyHours] = useState<number>(8)
  const [overtimeHours, setOvertimeHours] = useState<number>(12)
  const [overtimeMultiplier, setOvertimeMultiplier] = useState<number>(2.0)

  const result: DailyWageResult = useMemo(() => {
    return calculateDailyWage(monthlySalary, workingDays, dailyHours, overtimeHours, overtimeMultiplier)
  }, [monthlySalary, workingDays, dailyHours, overtimeHours, overtimeMultiplier])

  const handleReset = () => {
    setMonthlySalary(26000)
    setWorkingDays(26)
    setDailyHours(8)
    setOvertimeHours(12)
    setOvertimeMultiplier(2.0)
  }

  const getResultSummary = () => {
    return `Daily Wage & Overtime Allowance Breakdown:
- Monthly Base Wage: ₹${monthlySalary.toLocaleString('en-IN')} (${workingDays} working days, ${dailyHours} hrs/day)
- Daily Wage: ₹${result.dailyWage.toLocaleString('en-IN')} / day
- Regular Hourly Rate: ₹${result.hourlyWage} / hour
- Overtime Multiplier: ${overtimeMultiplier}× (Factories Act Sec 59 Standard)
- OT Hourly Rate: ₹${result.overtimeHourlyRate} / hour
- Overtime Earnings: ₹${result.overtimeEarnings.toLocaleString('en-IN')} (${overtimeHours} OT hours)
--------------------------------------------------
TOTAL MONTHLY TAKE-HOME: ₹${result.totalTakeHome.toLocaleString('en-IN')}
Calculated via India Practical Tools (https://indiapracticaltools.com)`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <span>Wage & Shift Hours</span>
            </h2>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Factories Act 1948
            </span>
          </div>

          {/* Monthly Wage */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-1.5">
              Monthly Basic + DA Salary (₹)
            </label>
            <input
              type="number"
              step="500"
              value={monthlySalary || ''}
              onChange={(e) => setMonthlySalary(parseFloat(e.target.value) || 0)}
              className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-4 py-2.5 font-mono text-white light:text-slate-900 text-lg font-bold"
            />
          </div>

          {/* Working Days & Daily Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Working Days in Month</label>
              <input
                type="number"
                value={workingDays || ''}
                onChange={(e) => setWorkingDays(parseFloat(e.target.value) || 26)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 rounded-xl px-3 py-2 font-mono text-white text-sm"
              />
              <span className="text-[10px] text-neutral-500 block mt-0.5">Typically 26 days</span>
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Shift Hours / Day</label>
              <input
                type="number"
                value={dailyHours || ''}
                onChange={(e) => setDailyHours(parseFloat(e.target.value) || 8)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 rounded-xl px-3 py-2 font-mono text-white text-sm"
              />
              <span className="text-[10px] text-neutral-500 block mt-0.5">Statutory 8 hours</span>
            </div>
          </div>

          {/* Overtime Hours & Multiplier */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Monthly Overtime Hours</label>
              <input
                type="number"
                value={overtimeHours || ''}
                onChange={(e) => setOvertimeHours(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 rounded-xl px-3 py-2 font-mono text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">OT Multiplier</label>
              <select
                value={overtimeMultiplier}
                onChange={(e) => setOvertimeMultiplier(parseFloat(e.target.value))}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 rounded-xl px-3 py-2 font-mono text-white text-sm"
              >
                <option value={2.0}>2.0× (Factories Act)</option>
                <option value={1.5}>1.5× (Establishment Act)</option>
                <option value={1.0}>1.0× (Standard Rate)</option>
              </select>
            </div>
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
                Total Earnings (Salary + OT)
              </span>
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                ₹{result.dailyWage}/day
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                ₹{result.totalTakeHome.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Includes Overtime Pay of: <span className="font-bold text-emerald-400 font-mono">+₹{result.overtimeEarnings.toLocaleString('en-IN')}</span> ({overtimeHours} hours)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-1">Standard Hourly Rate</span>
                <span className="text-lg font-bold font-mono text-white">
                  ₹{result.hourlyWage} / hr
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">8hr shift basis</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-1">Overtime Hourly Rate</span>
                <span className="text-lg font-bold font-mono text-purple-400">
                  ₹{result.overtimeHourlyRate} / hr
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">{overtimeMultiplier}× multiplier</span>
              </div>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>Section 59 Compliance</span>
            </div>
            <p>
              Under Indian labor statutes, any worker engaged for more than 9 hours on any day or more than 48 hours in any week in a registered factory is entitled to overtime wages at twice their ordinary rate of pay.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
