import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { HardHat, CheckCircle2 } from 'lucide-react'
import { calculateCement, CementCalcResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

const APPLICATIONS = [
  { id: 'plastering' as const, name: 'Wall Plastering (1:4)', defaultVal: 800, defThick: 12 },
  { id: 'brickwork' as const, name: 'Brickwork Mortar (1:6)', defaultVal: 500, defThick: 9 },
  { id: 'flooring' as const, name: 'Flooring Screed Bed', defaultVal: 600, defThick: 50 },
  { id: 'slab' as const, name: 'RCC Roof Slab (M20)', defaultVal: 1000, defThick: 125 },
]

export const CementCalculatorTool: React.FC = () => {
  const tool = getToolBySlug('cement-calculator')!

  const [workType, setWorkType] = useState<'plastering' | 'brickwork' | 'flooring' | 'slab'>('plastering')
  const [areaSqft, setAreaSqft] = useState<number>(800)
  const [thickness, setThickness] = useState<number>(12)

  const activeApp = APPLICATIONS.find((a) => a.id === workType)!

  const result: CementCalcResult = useMemo(() => {
    return calculateCement(workType, areaSqft, thickness)
  }, [workType, areaSqft, thickness])

  const handleReset = () => {
    setWorkType('plastering')
    setAreaSqft(800)
    setThickness(12)
  }

  const getResultSummary = () => {
    return `Cement & Mortar Requirement Projection:
- Application: ${activeApp.name}
- Work Area: ${areaSqft} sq.ft (Thickness: ${thickness} mm/in)
- Cement Bags Required: ${result.totalBags} Bags (50kg each)
- Total Weight: ${result.totalWeightKg.toLocaleString('en-IN')} kg
- Sand (M-Sand) Required: ${result.sandRequiredCft} cu.ft
- Aggregate Required: ${result.aggregateRequiredCft} cu.ft
- Estimated Cement Cost: ₹${result.estimatedCostRs.toLocaleString('en-IN')}
Calculated via IndiaTools (https://indiatools-rho.vercel.app)`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <HardHat className="w-5 h-5 text-amber-500" />
              <span>Civil Work Type & Quantity</span>
            </h2>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              IS:456 Proportions
            </span>
          </div>

          {/* Application Selection */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              Civil Work Application
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {APPLICATIONS.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => {
                    setWorkType(app.id)
                    setAreaSqft(app.defaultVal)
                    setThickness(app.defThick)
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    workType === app.id
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="text-xs block font-semibold">{app.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Area */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>Work Surface Area (sq.ft)</span>
              <span className="font-mono text-amber-400 font-bold">{areaSqft} sq.ft</span>
            </div>
            <input
              type="number"
              min="1"
              value={areaSqft || ''}
              onChange={(e) => setAreaSqft(parseFloat(e.target.value) || 0)}
              className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-4 py-2.5 font-mono text-white light:text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Thickness */}
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Thickness (mm or inches as applicable)</label>
            <input
              type="number"
              value={thickness || ''}
              onChange={(e) => setThickness(parseFloat(e.target.value) || 0)}
              className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-4 py-2 font-mono text-white light:text-slate-900 text-sm"
            />
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
                Cement Requirement
              </span>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                50 kg Bags (OPC/PPC)
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                {result.totalBags}
                <span className="text-xl text-neutral-400 font-normal"> Bags</span>
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Estimated Cement Cost: <span className="font-bold text-amber-400 font-mono">₹{result.estimatedCostRs.toLocaleString('en-IN')}</span> ({result.totalWeightKg.toLocaleString('en-IN')} kg)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-1">M-Sand Required</span>
                <span className="text-lg font-bold font-mono text-white light:text-slate-900">
                  {result.sandRequiredCft} cu.ft
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">Dry batching</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-1">Aggregate Required</span>
                <span className="text-lg font-bold font-mono text-white light:text-slate-900">
                  {result.aggregateRequiredCft} cu.ft
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">Crushed stone</span>
              </div>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>IS Standard Rule of Thumb</span>
            </div>
            <p>
              External plastering (1:4 ratio, 18-20mm double coat) requires ~0.14 bags/sq.m. Internal plastering (1:6 ratio, 12mm) requires ~0.08 bags/sq.m. Add 5-7% extra for site handling wastage.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
