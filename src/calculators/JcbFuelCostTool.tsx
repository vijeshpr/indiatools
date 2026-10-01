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

export const JcbFuelCostTool: React.FC = () => {
  const tool = getToolBySlug('jcb-fuel-cost')!

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
    return `JCB / Excavator Fuel Estimation:
Machine: ${JCB_MACHINE_PRESETS.find((p) => p.id === machineId)?.name || 'Custom'}
Operating Hours: ${dailyHours} hrs/day (${workingDays} days/mo)
Diesel Price: ₹${dieselPrice}/L at ${fuelLph} LPH
- Hourly Fuel Cost: ₹${results.hourlyFuelCost.toLocaleString('en-IN')}/hr
- Daily Fuel Cost: ₹${results.dailyFuelCost.toLocaleString('en-IN')} (${results.dailyFuelLitres} Litres)
- Monthly Fuel Cost: ₹${results.monthlyFuelCost.toLocaleString('en-IN')} (${results.monthlyFuelLitres} Litres)
- Annual Fuel Burn: ₹${results.annualFuelCost.toLocaleString('en-IN')}
Calculated on India Practical Tools`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs Card */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-500" />
              <span>Machine & Operating Parameters</span>
            </h2>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Live Reactivity
            </span>
          </div>

          {/* Machine Preset Selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              Machine Model / Equipment Type
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
                Operating Hours Per Day
              </label>
              <span className="text-sm font-bold text-amber-400 font-mono">
                {dailyHours} Hours / Day
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
              <span>1 hr (Shift start)</span>
              <span>8 hrs (Standard)</span>
              <span>16+ hrs (Double shift)</span>
            </div>
          </div>

          {/* Hourly Fuel Consumption (LPH) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600">
                Fuel Consumption (Litres / Hour)
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
                <span className="text-xs text-neutral-400 font-mono">L/hr</span>
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
                Diesel Price (₹ / Litre)
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
                Days Worked / Month
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
                <span className="absolute right-3 top-2.5 text-xs text-neutral-400 font-mono">days</span>
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
                <span>Operating Diesel Burn</span>
              </span>
              <span className="text-xs font-bold text-neutral-400">
                {dailyHours} hrs × ₹{dieselPrice}/L
              </span>
            </div>

            {/* Flagship Daily & Monthly Headline */}
            <div className="mb-6 pb-6 border-b border-neutral-800">
              <span className="text-xs text-neutral-400 block font-medium">Estimated Daily Diesel Cost</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                  ₹{results.dailyFuelCost.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-semibold text-neutral-400">/ day</span>
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-amber-300/90 font-mono">
                <span>Burn: {results.dailyFuelLitres} Litres / Day</span>
                <span>•</span>
                <span>₹{results.hourlyFuelCost} / Operating Hour</span>
              </div>
            </div>

            {/* 4 Multi-Dimension Result Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Cost / Hour */}
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cost / Hour</span>
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
                  <span>Litres / Day</span>
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
                  <span>Weekly Cost</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white font-mono">
                  ₹{results.weeklyFuelCost.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-neutral-400">6 Days shift</span>
              </div>

              {/* Monthly Fuel Cost */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
                  <IndianRupee className="w-3.5 h-3.5 text-amber-400" />
                  <span>Monthly Cost</span>
                </div>
                <p className="text-lg sm:text-xl font-black text-amber-400 font-mono">
                  ₹{results.monthlyFuelCost.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-amber-300/80">{results.monthlyFuelLitres} L / month</span>
              </div>
            </div>

            {/* Annual Cumulative Banner */}
            <div className="mt-5 p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400">Annual Diesel Expenditure (12 mo):</span>
              <span className="font-bold text-white text-sm font-mono">
                ₹{results.annualFuelCost.toLocaleString('en-IN')}
              </span>
            </div>
          </motion.div>

          {/* Quick contractor check note */}
          <div className="p-4 rounded-xl bg-neutral-900/50 light:bg-slate-100 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong>Contractor Tip:</strong> In heavy rock excavation or hydraulic breaker operation, add +1.5 L/hr to the standard fuel rate.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
