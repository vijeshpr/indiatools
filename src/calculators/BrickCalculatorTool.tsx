import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { HardHat, CheckCircle2, IndianRupee } from 'lucide-react'
import { calculateBricks, BrickResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const BrickCalculatorTool: React.FC = () => {
  const tool = getToolBySlug('brick-calculator')!

  const [wallLengthFt, setWallLengthFt] = useState<number>(30)
  const [wallHeightFt, setWallHeightFt] = useState<number>(10)
  const [wallThicknessInches, setWallThicknessInches] = useState<4.5 | 9>(9)
  const [wastagePct, setWastagePct] = useState<number>(8)

  const result: BrickResult = useMemo(() => {
    return calculateBricks(wallLengthFt, wallHeightFt, wallThicknessInches, wastagePct)
  }, [wallLengthFt, wallHeightFt, wallThicknessInches, wastagePct])

  const handleReset = () => {
    setWallLengthFt(30)
    setWallHeightFt(10)
    setWallThicknessInches(9)
    setWastagePct(8)
  }

  const getResultSummary = () => {
    return `Brick & Block Wall Masonry Requirement:
- Wall Dimensions: ${wallLengthFt} ft (L) × ${wallHeightFt} ft (H) = ${result.wallAreaSqft} sq.ft
- Wall Thickness: ${wallThicknessInches} inches (${wallThicknessInches === 9 ? 'External Load Bearing' : 'Internal Partition'})
- Bricks Required: ${result.totalBricks.toLocaleString('en-IN')} units (includes ${wastagePct}% wastage)
- Estimated Material Cost: ₹${result.estimatedCostRs.toLocaleString('en-IN')}
- Cement Mortar Required: ${result.cementBags} Bags (50kg)
- Sand for Mortar: ${result.sandCft} cu.ft (~${result.sandBrass} Brass)
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
              <span>Wall Dimensions & Brick Type</span>
            </h2>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {wastagePct}% Wastage Included
            </span>
          </div>

          {/* Wall Thickness */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              Wall Thickness
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setWallThicknessInches(9)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  wallThicknessInches === 9
                    ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                    : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400'
                }`}
              >
                <span className="text-sm block">9 Inch (Outer Wall)</span>
                <span className="text-[11px] text-neutral-500">Full brick standard</span>
              </button>

              <button
                type="button"
                onClick={() => setWallThicknessInches(4.5)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  wallThicknessInches === 4.5
                    ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                    : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400'
                }`}
              >
                <span className="text-sm block">4.5 Inch (Partition)</span>
                <span className="text-[11px] text-neutral-500">Single brick layer</span>
              </button>
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Wall Length (Feet)</label>
              <input
                type="number"
                value={wallLengthFt || ''}
                onChange={(e) => setWallLengthFt(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-3 py-2 font-mono text-white light:text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Wall Height (Feet)</label>
              <input
                type="number"
                value={wallHeightFt || ''}
                onChange={(e) => setWallHeightFt(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-3 py-2 font-mono text-white light:text-slate-900"
              />
            </div>
          </div>

          {/* Wastage */}
          <div>
            <div className="flex justify-between text-xs text-neutral-400 mb-1 font-medium">
              <span>Handling & Cutting Wastage</span>
              <span className="font-mono text-amber-400">{wastagePct}%</span>
            </div>
            <input
              type="range"
              min="3"
              max="15"
              step="1"
              value={wastagePct}
              onChange={(e) => setWastagePct(parseFloat(e.target.value) || 5)}
              className="w-full accent-amber-500 cursor-pointer"
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
                Total Bricks Required
              </span>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {result.wallAreaSqft} sq.ft Wall Area
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                {result.totalBricks.toLocaleString('en-IN')}
                <span className="text-xl text-neutral-400 font-normal"> Units</span>
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Estimated Material Expense: <span className="font-bold text-amber-400 font-mono">₹{result.estimatedCostRs.toLocaleString('en-IN')}</span> (Bricks + Mortar)
              </p>
            </div>

            {/* Mortar requirements */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-1">Cement for Mortar (1:6)</span>
                <span className="text-lg font-bold font-mono text-white">
                  {result.cementBags} Bags
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">50kg OPC/PPC</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-1">Sand for Mortar</span>
                <span className="text-lg font-bold font-mono text-white">
                  {result.sandCft} cft
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">~{result.sandBrass} Brass</span>
              </div>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Standard Red Brick Rule</span>
            </div>
            <p>
              In a 9-inch brick wall in India, approximately 90 to 95 standard red clay bricks are needed per 10 square feet of elevation (including standard 10mm mortar joint thickness).
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
