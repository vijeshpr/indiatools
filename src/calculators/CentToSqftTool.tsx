import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Compass, CheckCircle2, ArrowRightLeft, Maximize2 } from 'lucide-react'
import { convertLandArea, LandUnit, LAND_CONVERSION_FACTORS_SQFT, LandConversionResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

const UNITS: { id: LandUnit; name: string; region: string }[] = [
  { id: 'cent', name: 'Cent', region: 'Kerala, Tamil Nadu, AP' },
  { id: 'sqft', name: 'Square Feet (sq.ft)', region: 'Universal Indian Standard' },
  { id: 'sqm', name: 'Square Meter (sq.m)', region: 'Govt Registry / Metro' },
  { id: 'acre', name: 'Acre', region: '100 Cents / 43,560 sq.ft' },
  { id: 'guntha', name: 'Guntha', region: 'Maharashtra, Karnataka, Telangana' },
  { id: 'ground', name: 'Ground', region: 'Tamil Nadu (2,400 sq.ft)' },
  { id: 'bigha', name: 'Bigha (Standard)', region: 'UP, Bihar, West Bengal' },
  { id: 'hectare', name: 'Hectare', region: 'Revenue Land / Agriculture' },
]

export const CentToSqftTool: React.FC = () => {
  const tool = getToolBySlug('cent-to-sqft')!

  const [inputVal, setInputVal] = useState<number>(5)
  const [fromUnit, setFromUnit] = useState<LandUnit>('cent')

  const results: LandConversionResult = useMemo(() => {
    return convertLandArea(inputVal, fromUnit)
  }, [inputVal, fromUnit])

  const handleReset = () => {
    setInputVal(5)
    setFromUnit('cent')
  }

  const getResultSummary = () => {
    return `Indian Land Measurement Conversion:
Input: ${inputVal} ${fromUnit.toUpperCase()}
- Square Feet: ${results.sqft.toLocaleString('en-IN')} sq.ft
- Cents: ${results.cent} Cents
- Square Meters: ${results.sqm} sq.m
- Acres: ${results.acre} Acres
- Gunthas: ${results.guntha} Gunthas
- Grounds (TN): ${results.ground} Grounds
- Bighas: ${results.bigha} Bighas
Calculated on India Practical Tools`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-500" />
              <span>Input Land Area</span>
            </h2>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Multi-Unit Mutual Sync
            </span>
          </div>

          {/* Value input */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              Area Value
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={inputVal || ''}
              onChange={(e) => setInputVal(parseFloat(e.target.value) || 0)}
              className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-4 py-3 text-2xl font-bold font-mono text-white light:text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Select Source Unit */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              Select Starting Unit
            </label>
            <div className="space-y-1.5">
              {UNITS.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setFromUnit(u.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left border transition-all ${
                    fromUnit === u.id
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                      : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 light:border-slate-200 text-neutral-300 light:text-slate-700 hover:bg-neutral-850'
                  }`}
                >
                  <div>
                    <span className="font-semibold text-sm block">{u.name}</span>
                    <span className="text-[11px] text-neutral-400">{u.region}</span>
                  </div>
                  {fromUnit === u.id && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                      Active
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Conversion Matrix */}
        <div className="lg:col-span-7 space-y-4">
          <motion.div
            layout
            className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-emerald-950/30 border border-emerald-500/30 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                <ArrowRightLeft className="w-4 h-4" />
                <span>Synchronized Land Conversions</span>
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {inputVal} {fromUnit}
              </span>
            </div>

            {/* Primary Conversion Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-neutral-800">
              {/* Square Feet Highlight */}
              <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800">
                <span className="text-xs text-neutral-400 uppercase tracking-wider block font-semibold">
                  Square Feet (sq.ft)
                </span>
                <p className="text-2xl sm:text-4xl font-black text-white font-mono mt-1">
                  {results.sqft.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-neutral-400">Universal benchmark</span>
              </div>

              {/* Cent Highlight */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="text-xs text-emerald-400 uppercase tracking-wider block font-semibold">
                  Cents
                </span>
                <p className="text-2xl sm:text-4xl font-black text-emerald-400 font-mono mt-1">
                  {results.cent.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-emerald-300/80">1 Cent = 435.6 sq.ft</span>
              </div>
            </div>

            {/* Regional Conversion Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">Acres</span>
                <p className="text-lg font-bold text-white font-mono mt-0.5">{results.acre}</p>
                <span className="text-[10px] text-neutral-400">1 Acre = 100 Cents</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">Square Meters</span>
                <p className="text-lg font-bold text-white font-mono mt-0.5">{results.sqm}</p>
                <span className="text-[10px] text-neutral-400">sq.m (10.76 sq.ft)</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">Gunthas</span>
                <p className="text-lg font-bold text-white font-mono mt-0.5">{results.guntha}</p>
                <span className="text-[10px] text-neutral-400">MH / KA / TS</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">Grounds (TN)</span>
                <p className="text-lg font-bold text-white font-mono mt-0.5">{results.ground}</p>
                <span className="text-[10px] text-neutral-400">1 Ground = 2400 sqft</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">Bighas</span>
                <p className="text-lg font-bold text-white font-mono mt-0.5">{results.bigha}</p>
                <span className="text-[10px] text-neutral-400">Standard Pukka</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">Hectares</span>
                <p className="text-lg font-bold text-white font-mono mt-0.5">{results.hectare}</p>
                <span className="text-[10px] text-neutral-400">10,000 sq.m</span>
              </div>
            </div>

            {/* Visual Dimension Helper (Footprint preview) */}
            <div className="mt-5 p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Equivalent Rectangular Plot Size:</span>
              </span>
              <span className="font-mono text-white">
                ~{Math.round(Math.sqrt(results.sqft))} ft × {Math.round(Math.sqrt(results.sqft))} ft (Square)
              </span>
            </div>
          </motion.div>

          <div className="p-4 rounded-xl bg-neutral-900/50 light:bg-slate-100 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              In revenue land records, 1 cent is always legally registered as 435.6 sq.ft. Always cross-verify survey sketch boundary pegs before finalizing registry deeds.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
