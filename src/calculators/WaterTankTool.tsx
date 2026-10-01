import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Droplet, Waves, CheckCircle2, IndianRupee } from 'lucide-react'
import { calculateWaterTank, WaterTankResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const WaterTankTool: React.FC = () => {
  const tool = getToolBySlug('water-tank-capacity')!

  const [numPersons, setNumPersons] = useState<number>(4)
  const [daysBackup, setDaysBackup] = useState<number>(2)
  const [extraNeeds, setExtraNeeds] = useState<boolean>(true)

  const result: WaterTankResult = useMemo(() => {
    return calculateWaterTank(numPersons, daysBackup, extraNeeds)
  }, [numPersons, daysBackup, extraNeeds])

  const handleReset = () => {
    setNumPersons(4)
    setDaysBackup(2)
    setExtraNeeds(true)
  }

  const getResultSummary = () => {
    return `Household Water Tank Sizing Requirement (IS:1172 Standard):
- Family Size: ${numPersons} Persons (${daysBackup} Days reserve backup)
- Daily Consumption: ${result.dailyRequirementLitres} Litres (135 Litres per capita per day)
- Recommended Split:
  - Overhead Tank (OHT): ${result.recommendedOhtCapacityLitres} Litres (Dimensions: ${result.ohtDimensionsFt})
  - Underground Sump: ${result.recommendedSumpCapacityLitres} Litres (Dimensions: ${result.sumpDimensionsFt})
Calculated via India Practical Tools (https://indiapracticaltools.com)`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Droplet className="w-5 h-5 text-cyan-400" />
              <span>Family Size & Reserve Days</span>
            </h2>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              IS:1172 (135 LPCD)
            </span>
          </div>

          {/* Family Members */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>Number of Family Members</span>
              <span className="font-mono text-cyan-400 font-bold">{numPersons} Persons</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={numPersons}
              onChange={(e) => setNumPersons(parseFloat(e.target.value) || 1)}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Backup Days */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>Days of Buffer Storage Required</span>
              <span className="font-mono text-cyan-400 font-bold">{daysBackup} Days</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              step="0.5"
              value={daysBackup}
              onChange={(e) => setDaysBackup(parseFloat(e.target.value) || 1)}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              Indian municipal supply often runs on alternate days; 1.5 to 2 days buffer is recommended.
            </p>
          </div>

          {/* Gardening & Extras */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-300">
              <input
                type="checkbox"
                checked={extraNeeds}
                onChange={(e) => setExtraNeeds(e.target.checked)}
                className="rounded border-neutral-700 text-cyan-500 focus:ring-cyan-500"
              />
              <span>Include Gardening, Car Wash & Guest Allowance (+100 L/day)</span>
            </label>
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
                Overhead Tank (OHT) Size
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                Gravity Feed Standard
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                {result.recommendedOhtCapacityLitres.toLocaleString('en-IN')}
                <span className="text-xl text-neutral-400 font-normal"> Litres</span>
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Daily family draw: <span className="font-bold text-cyan-400 font-mono">{result.dailyRequirementLitres} Litres/day</span>
              </p>
            </div>

            {/* Sump vs OHT split */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-1">Underground Sump</span>
                <span className="text-lg font-bold font-mono text-white">
                  {result.recommendedSumpCapacityLitres.toLocaleString('en-IN')} L
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">Municipal intake</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-1">Overhead Tank</span>
                <span className="text-lg font-bold font-mono text-cyan-400">
                  {result.recommendedOhtCapacityLitres.toLocaleString('en-IN')} L
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">Rooftop storage</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-neutral-400 font-mono text-[11px]">OHT Dimensions:</span>
                <span className="text-white font-mono">{result.ohtDimensionsFt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 font-mono text-[11px]">Sump Dimensions:</span>
                <span className="text-white font-mono">{result.sumpDimensionsFt}</span>
              </div>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>IS:1172 Benchmark</span>
            </div>
            <p>
              National Building Code (NBC) specifies 135 LPCD for Indian residences: 45L for bathing, 30L for flushing, 20L for washing clothes, 15L for cooking, and 25L for utensils and floor cleaning.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
