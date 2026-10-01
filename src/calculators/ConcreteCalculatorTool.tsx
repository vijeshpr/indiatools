import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { HardHat, Layers, CheckCircle2, IndianRupee } from 'lucide-react'
import { calculateConcrete, ConcreteResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

const GRADES = [
  { id: 'M15' as const, label: 'M15 (1:2:4)', desc: 'PCC Foundation, Pathways' },
  { id: 'M20' as const, label: 'M20 (1:1.5:3)', desc: 'Standard Slabs, Beams & Columns' },
  { id: 'M25' as const, label: 'M25 (1:1:2)', desc: 'Heavy RCC, Water Tanks, Commercial' },
]

export const ConcreteCalculatorTool: React.FC = () => {
  const tool = getToolBySlug('concrete-calculator')!

  const [lengthFt, setLengthFt] = useState<number>(30)
  const [widthFt, setWidthFt] = useState<number>(20)
  const [depthInches, setDepthInches] = useState<number>(5)
  const [grade, setGrade] = useState<'M15' | 'M20' | 'M25'>('M20')

  const result: ConcreteResult = useMemo(() => {
    return calculateConcrete(lengthFt, widthFt, depthInches, grade)
  }, [lengthFt, widthFt, depthInches, grade])

  const handleReset = () => {
    setLengthFt(30)
    setWidthFt(20)
    setDepthInches(5)
    setGrade('M20')
  }

  const getResultSummary = () => {
    return `Concrete Mix Material Requirement (${grade} Grade):
- Slab/Structure Dimensions: ${lengthFt} ft × ${widthFt} ft × ${depthInches} inches
- Wet Volume: ${result.volumeCft} cu.ft (${result.volumeCum} cu.m)
- Dry Batching Volume: ${result.dryVolumeCum} cu.m (1.54× factor)
- Cement Bags (50kg): ${result.cementBags} Bags
- M-Sand: ${result.sandTonnes} Tonnes (${result.sandCft} cu.ft)
- 20mm Aggregate: ${result.aggregateTonnes} Tonnes (${result.aggregateCft} cu.ft)
- Water Required: ~${result.waterLitres} Litres
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
              <span>Concrete Mix Design Inputs</span>
            </h2>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Dry Volume × 1.54 Factor
            </span>
          </div>

          {/* Grade selection */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              Select Concrete Grade
            </label>
            <div className="grid grid-cols-3 gap-2">
              {GRADES.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGrade(g.id)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    grade === g.id
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="text-sm block font-bold">{g.label}</span>
                  <span className="text-[10px] text-neutral-500 block mt-0.5 leading-tight">{g.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Length (Feet)</label>
              <input
                type="number"
                value={lengthFt || ''}
                onChange={(e) => setLengthFt(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 rounded-xl px-3 py-2 font-mono text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Width (Feet)</label>
              <input
                type="number"
                value={widthFt || ''}
                onChange={(e) => setWidthFt(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 rounded-xl px-3 py-2 font-mono text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Thickness (In)</label>
              <input
                type="number"
                step="0.5"
                value={depthInches || ''}
                onChange={(e) => setDepthInches(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 rounded-xl px-3 py-2 font-mono text-white text-sm"
              />
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
                Cement Bags Required
              </span>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {grade} Concrete
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                {result.cementBags}
                <span className="text-xl text-neutral-400 font-normal"> Bags</span>
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Wet Volume: <span className="font-bold text-white font-mono">{result.volumeCft} cft</span> ({result.volumeCum} m³) with ~{result.waterLitres} L water.
              </p>
            </div>

            {/* Material Split */}
            <div className="space-y-3 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="p-3 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-300 font-semibold block">Coarse M-Sand</span>
                  <span className="text-[11px] text-neutral-500">{result.sandCft} cft</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold font-mono text-white block">{result.sandTonnes} Tonnes</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-300 font-semibold block">20mm Crushed Stone Aggregate</span>
                  <span className="text-[11px] text-neutral-500">{result.aggregateCft} cft</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold font-mono text-white block">{result.aggregateTonnes} Tonnes</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Shrinkage Conversion</span>
            </div>
            <p>
              When water is mixed with cement, sand, and stone, the volume reduces significantly due to void fill. Hence, dry batching volume is taken as 1.54 times the final compacted wet concrete volume.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
