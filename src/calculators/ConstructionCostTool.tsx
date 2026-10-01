import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Building2, IndianRupee, Layers, CheckCircle2, Hammer, HardHat } from 'lucide-react'
import {
  calculateConstructionCost,
  ConstructionTier,
  ConstructionCostResult,
} from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const ConstructionCostTool: React.FC = () => {
  const tool = getToolBySlug('construction-cost')!

  const [builtUpArea, setBuiltUpArea] = useState<number>(1500)
  const [floors, setFloors] = useState<number>(1)
  const [qualityTier, setQualityTier] = useState<ConstructionTier>('standard')

  const results: ConstructionCostResult = useMemo(() => {
    return calculateConstructionCost(builtUpArea, floors, qualityTier)
  }, [builtUpArea, floors, qualityTier])

  const handleReset = () => {
    setBuiltUpArea(1500)
    setFloors(1)
    setQualityTier('standard')
  }

  const getResultSummary = () => {
    return `House Construction Cost & Material Estimation:
Total Area: ${results.totalBuiltUpAreaSqft} sq.ft (${floors} Floors) | Tier: ${qualityTier.toUpperCase()} (@ ₹${results.ratePerSqft}/sq.ft)
- Grand Total Budget: ₹${results.totalCostRs.toLocaleString('en-IN')}
- Cement: ~${results.materials.cementBags} Bags (₹${results.materials.cementCost.toLocaleString('en-IN')})
- Steel (TMT): ~${results.materials.steelTonnes} Tonnes (₹${results.materials.steelCost.toLocaleString('en-IN')})
- Sand & Aggregates: ₹${results.materials.sandAggregatesCost.toLocaleString('en-IN')}
- Bricks: ~${results.materials.bricksCount.toLocaleString('en-IN')} Bricks (₹${results.materials.bricksCost.toLocaleString('en-IN')})
- Flooring & Tiles: ₹${results.materials.flooringTilesCost.toLocaleString('en-IN')}
- Labor & Supervision: ₹${results.materials.laborCost.toLocaleString('en-IN')}
Calculated on IndiaTools`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-500" />
              <span>Project Dimensions & Specification</span>
            </h2>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Turnkey Estimation
            </span>
          </div>

          {/* Built-up area per floor */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600">
                Ground Floor Built-up Area
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="200"
                  max="15000"
                  value={builtUpArea || ''}
                  onChange={(e) => setBuiltUpArea(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-lg px-2.5 py-1 text-sm font-mono text-right text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                />
                <span className="text-xs text-neutral-400 font-mono">sq.ft</span>
              </div>
            </div>
            <input
              type="range"
              min="400"
              max="4000"
              step="50"
              value={builtUpArea}
              onChange={(e) => setBuiltUpArea(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
              <span>800 sq.ft (Compact 2BHK)</span>
              <span>1,500 sq.ft (3BHK Villa)</span>
              <span>3,000+ sq.ft</span>
            </div>
          </div>

          {/* Number of Floors */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              Number of Floors
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { count: 1, label: 'Ground Only (G)' },
                { count: 2, label: 'Ground + 1 (G+1)' },
                { count: 3, label: 'Ground + 2 (G+2)' },
              ].map((f) => (
                <button
                  key={f.count}
                  type="button"
                  onClick={() => setFloors(f.count)}
                  className={`py-2 px-2 text-center rounded-xl text-xs font-bold border transition-colors ${
                    floors === f.count
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                      : 'bg-neutral-950 border-neutral-700 text-neutral-400'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Construction Quality Tier */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              Finishing & Material Quality Tier
            </label>
            <div className="space-y-2">
              {[
                { id: 'economy', title: 'Economy / Basic (₹1,550/sq.ft)', desc: 'Standard red bricks, basic vitrified tiles, local fittings' },
                { id: 'standard', title: 'Standard Residential (₹1,850/sq.ft)', desc: 'Branded TMT (Tata/JSW), 4x2 GVT tiles, Jaquar fittings' },
                { id: 'premium', title: 'Premium / High-End (₹2,400/sq.ft)', desc: 'Teak wood, granite stairs, false ceiling, Kohler fittings' },
                { id: 'luxury', title: 'Luxury Architectural (₹3,200/sq.ft)', desc: 'Italian marble, home automation, double-glazed glass' },
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setQualityTier(tier.id as ConstructionTier)}
                  className={`w-full p-3 rounded-xl text-left border transition-all ${
                    qualityTier === tier.id
                      ? 'bg-amber-500/15 border-amber-500/50 text-white'
                      : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400'
                  }`}
                >
                  <span className="font-bold text-sm block text-amber-300">{tier.title}</span>
                  <span className="text-[11px] text-neutral-400 mt-0.5 block">{tier.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Cost & Material Breakdown */}
        <div className="lg:col-span-6 space-y-4">
          <motion.div
            layout
            className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950/30 border border-amber-500/30 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                <HardHat className="w-4 h-4" />
                <span>Turnkey Construction Estimate</span>
              </span>
              <span className="text-xs font-bold text-neutral-400 font-mono">
                {results.totalBuiltUpAreaSqft} sq.ft total
              </span>
            </div>

            {/* Total Rupees */}
            <div className="mb-6 pb-6 border-b border-neutral-800">
              <span className="text-xs text-neutral-400 block font-medium">Estimated Project Budget</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                  ₹{results.totalCostRs.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="mt-2 text-xs text-amber-300/90 font-mono">
                ₹{(results.totalCostRs / 100000).toFixed(2)} Lakhs (Turnkey rate: ₹{results.ratePerSqft}/sq.ft)
              </p>
            </div>

            {/* Materials Breakdown */}
            <div className="space-y-2.5">
              <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-400 font-semibold mb-2">
                Estimated Material & Labor Distribution:
              </h4>

              {/* Cement */}
              <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 flex justify-between items-center text-xs">
                <div>
                  <span className="font-semibold text-white">Cement (16.4%)</span>
                  <span className="text-neutral-400 block text-[11px]">~{results.materials.cementBags} Bags (50kg)</span>
                </div>
                <span className="font-mono font-bold text-white">
                  ₹{results.materials.cementCost.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Steel */}
              <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 flex justify-between items-center text-xs">
                <div>
                  <span className="font-semibold text-white">TMT Rebar Steel (14.2%)</span>
                  <span className="text-neutral-400 block text-[11px]">~{results.materials.steelTonnes} Metric Tonnes</span>
                </div>
                <span className="font-mono font-bold text-white">
                  ₹{results.materials.steelCost.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Bricks & Masonry */}
              <div className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 flex justify-between items-center text-xs">
                <div>
                  <span className="font-semibold text-white">Bricks / AAC Blocks (10%)</span>
                  <span className="text-neutral-400 block text-[11px]">~{results.materials.bricksCount.toLocaleString('en-IN')} Nos</span>
                </div>
                <span className="font-mono font-bold text-white">
                  ₹{results.materials.bricksCost.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Labor & Masonry */}
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex justify-between items-center text-xs">
                <div>
                  <span className="font-semibold text-amber-400">Civil Labor & Masons (25%)</span>
                  <span className="text-neutral-400 block text-[11px]">Execution, shuttering & supervision</span>
                </div>
                <span className="font-mono font-bold text-amber-400">
                  ₹{results.materials.laborCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </motion.div>

          <div className="p-4 rounded-xl bg-neutral-900/50 light:bg-slate-100 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Always keep an emergency 8-10% contingency fund for foundation water table fluctuations and architectural revisions.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
