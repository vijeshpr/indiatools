import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Home, Maximize2, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { calculateCarpetArea, CarpetAreaResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const CarpetAreaTool: React.FC = () => {
  const tool = getToolBySlug('carpet-area')!

  const [superBuiltUp, setSuperBuiltUp] = useState<number>(1450)
  const [loadingPct, setLoadingPct] = useState<number>(28)

  const result: CarpetAreaResult = useMemo(() => {
    return calculateCarpetArea(superBuiltUp, loadingPct)
  }, [superBuiltUp, loadingPct])

  const handleReset = () => {
    setSuperBuiltUp(1450)
    setLoadingPct(28)
  }

  const getResultSummary = () => {
    return `RERA Carpet Area & Super Built-up Loading Factor:
- Quoted Super Built-up Area (SBA): ${superBuiltUp} sq.ft
- Builder Loading Factor: ${loadingPct}%
--------------------------------------------------
USABLE RERA CARPET AREA: ${result.carpetAreaSqft} sq.ft
BUILT-UP AREA (Plinth): ~${result.builtUpAreaSqft} sq.ft
USABLE SPACE RATIO: ${result.usableSpaceRatioPct}% of purchased area
Non-Usable Common Area (Lobbies, Staircase, Lifts): ${superBuiltUp - result.carpetAreaSqft} sq.ft
Calculated via India Practical Tools (https://indiapracticaltools.com)`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Home className="w-5 h-5 text-emerald-400" />
              <span>Apartment Area Specifications</span>
            </h2>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              RERA Compliant Formula
            </span>
          </div>

          {/* Super Built Up Area */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>Super Built-up Area (SBA)</span>
              <span className="font-mono text-emerald-400 font-bold text-base">{superBuiltUp} sq.ft</span>
            </div>
            <input
              type="range"
              min="500"
              max="4000"
              step="25"
              value={superBuiltUp}
              onChange={(e) => setSuperBuiltUp(parseFloat(e.target.value) || 500)}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-500 mt-1">
              <span>600 sq.ft (1 BHK)</span>
              <span>1,450 sq.ft (3 BHK)</span>
              <span>3,500+ sq.ft (Penthouse)</span>
            </div>
          </div>

          {/* Builder Loading Percentage */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>Builder Loading Percentage</span>
              <span className="font-mono text-emerald-400 font-bold text-base">{loadingPct}% Loading</span>
            </div>
            <input
              type="range"
              min="15"
              max="45"
              step="1"
              value={loadingPct}
              onChange={(e) => setLoadingPct(parseFloat(e.target.value) || 15)}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-500 mt-1">
              <span>18-22% (Standalone building)</span>
              <span>25-30% (Standard Gated Society)</span>
              <span>35-40% (Luxury High-Rise)</span>
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
                True RERA Carpet Area
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {result.usableSpaceRatioPct}% Efficiency
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                {result.carpetAreaSqft.toLocaleString('en-IN')}
                <span className="text-lg text-neutral-400 font-normal"> sq.ft</span>
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Actual internal liveable space inside the inner faces of your apartment walls.
              </p>
            </div>

            {/* Split */}
            <div className="space-y-3 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">Liveable Carpet Area</span>
                <span className="font-mono font-bold text-emerald-400">{result.carpetAreaSqft} sq.ft</span>
              </div>
              <div className="w-full h-2 bg-neutral-800 light:bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${result.usableSpaceRatioPct}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-neutral-300">Built-Up Area (Includes walls & balconies)</span>
                <span className="font-mono font-bold text-white">~{result.builtUpAreaSqft} sq.ft</span>
              </div>

              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-neutral-400">Common Amenities, Lift, Lobby, Staircase</span>
                <span className="font-mono font-bold text-amber-400">~{superBuiltUp - result.carpetAreaSqft} sq.ft</span>
              </div>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Real Estate (Regulation and Development) Act Rule</span>
            </div>
            <p>
              Under RERA, developers are legally required to quote and sell properties based on net Carpet Area rather than ambiguous Super Built-up Area. Balconies and private terraces must be quoted as distinct standalone line items.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
