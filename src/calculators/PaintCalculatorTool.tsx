import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Palette, HardHat, CheckCircle2, IndianRupee } from 'lucide-react'
import { calculatePaint, PaintResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

const PAINTS = [
  { id: 'economy' as const, name: 'Economy Emulsion / Distemper', desc: 'Budget-friendly washable paint' },
  { id: 'premium' as const, name: 'Premium Emulsion (Apex/Apcolite)', desc: 'Rich matte/sheen with anti-fungal coat' },
  { id: 'luxury' as const, name: 'Luxury Teflon / Royale Emulsion', desc: 'High washability, Teflon stain shield' },
]

export const PaintCalculatorTool: React.FC = () => {
  const tool = getToolBySlug('paint-calculator')!

  const [floorAreaSqft, setFloorAreaSqft] = useState<number>(1000)
  const [ceilingHeightFt, setCeilingHeightFt] = useState<number>(10)
  const [paintGrade, setPaintGrade] = useState<'economy' | 'premium' | 'luxury'>('premium')

  const result: PaintResult = useMemo(() => {
    return calculatePaint(floorAreaSqft, ceilingHeightFt, paintGrade)
  }, [floorAreaSqft, ceilingHeightFt, paintGrade])

  const handleReset = () => {
    setFloorAreaSqft(1000)
    setCeilingHeightFt(10)
    setPaintGrade('premium')
  }

  const getResultSummary = () => {
    return `House Painting & Wall Finish Quantity Projection:
- Home Carpet Area: ${floorAreaSqft} sq.ft (Paintable Surface: ${result.wallAreaSqft} sq.ft)
- Finish Grade: ${paintGrade.toUpperCase()}
- Topcoat Paint: ${result.paintLitres} Litres (20L Buckets: ${result.bucket20L}, 10L: ${result.bucket10L}, 4L: ${result.bucket4L})
- Wall Putty: ${result.puttyKg} kg (2 coats)
- Primer Base: ${result.primerLitres} Litres (1 coat)
-------------------------------------------------
TOTAL MATERIAL ESTIMATE: ₹${result.estimatedCostRs.toLocaleString('en-IN')}
Calculated via India Practical Tools (https://indiapracticaltools.com)`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Palette className="w-5 h-5 text-pink-500" />
              <span>Wall Surface & Paint Grade</span>
            </h2>
            <span className="text-xs font-mono text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
              3.5× Wall Multiplier
            </span>
          </div>

          {/* Carpet Area */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>Home Carpet / Floor Area</span>
              <span className="font-mono text-pink-400 font-bold">{floorAreaSqft} sq.ft</span>
            </div>
            <input
              type="range"
              min="200"
              max="4000"
              step="50"
              value={floorAreaSqft}
              onChange={(e) => setFloorAreaSqft(parseFloat(e.target.value) || 0)}
              className="w-full accent-pink-500 cursor-pointer"
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              Calculates ~{result.wallAreaSqft} sq.ft of total wall & ceiling paintable area.
            </p>
          </div>

          {/* Ceiling Height */}
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Ceiling Height (Feet)</label>
            <input
              type="number"
              value={ceilingHeightFt || ''}
              onChange={(e) => setCeilingHeightFt(parseFloat(e.target.value) || 10)}
              className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 rounded-xl px-3 py-2 font-mono text-white text-sm"
            />
          </div>

          {/* Paint Tier Selection */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              Select Paint Tier
            </label>
            <div className="space-y-2">
              {PAINTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPaintGrade(p.id)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                    paintGrade === p.id
                      ? 'bg-pink-500/20 border-pink-500 text-white font-bold'
                      : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400'
                  }`}
                >
                  <div>
                    <span className="text-xs block font-bold text-white light:text-slate-900">{p.name}</span>
                    <span className="text-[11px] text-neutral-500">{p.desc}</span>
                  </div>
                </button>
              ))}
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
                Total Paint Required
              </span>
              <span className="text-xs font-mono font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                2 Coats Standard
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                {result.paintLitres}
                <span className="text-xl text-neutral-400 font-normal"> Litres</span>
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Estimated Material Expense: <span className="font-bold text-pink-400 font-mono">₹{result.estimatedCostRs.toLocaleString('en-IN')}</span>
              </p>
            </div>

            {/* Breakdown */}
            <div className="space-y-3 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">Wall Putty (2 coats)</span>
                <span className="font-mono font-bold text-white">{result.puttyKg} kg</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">Primer Base (1 coat)</span>
                <span className="font-mono font-bold text-white">{result.primerLitres} Litres</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">Recommended Can Sizes</span>
                <span className="font-mono font-bold text-amber-400">
                  {result.bucket20L > 0 && `${result.bucket20L}×20L `}
                  {result.bucket10L > 0 && `${result.bucket10L}×10L `}
                  {result.bucket4L > 0 && `${result.bucket4L}×4L`}
                </span>
              </div>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-pink-400" />
              <span>Thumb Rule for Indian Homes</span>
            </div>
            <p>
              Wall area is roughly 3.5 times the carpet area of a flat. 1 litre of premium acrylic emulsion covers approximately 130–150 sq.ft for a single coat, or 70–80 sq.ft for 2 coats on a smooth puttied surface.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
