import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Compass, ArrowRightLeft, CheckCircle2 } from 'lucide-react'
import { convertLandArea, LandConversionResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const LandAreaTool: React.FC = () => {
  const tool = getToolBySlug('land-area')!

  const [mode, setMode] = useState<'rectangle' | 'four_sided'>('rectangle')
  
  // Rectangle
  const [rectLengthFt, setRectLengthFt] = useState<number>(60)
  const [rectWidthFt, setRectWidthFt] = useState<number>(40)

  // 4-sided plot
  const [northFt, setNorthFt] = useState<number>(65)
  const [southFt, setSouthFt] = useState<number>(60)
  const [eastFt, setEastFt] = useState<number>(45)
  const [westFt, setWestFt] = useState<number>(40)

  const totalSqft = useMemo(() => {
    if (mode === 'rectangle') {
      return rectLengthFt * rectWidthFt
    } else {
      // Indian Patwari / Amin average width method: ((North + South) / 2) * ((East + West) / 2)
      const avgLength = (northFt + southFt) / 2
      const avgWidth = (eastFt + westFt) / 2
      return Math.round(avgLength * avgWidth)
    }
  }, [mode, rectLengthFt, rectWidthFt, northFt, southFt, eastFt, westFt])

  const results: LandConversionResult = useMemo(() => {
    return convertLandArea(totalSqft, 'sqft')
  }, [totalSqft])

  const handleReset = () => {
    setMode('rectangle')
    setRectLengthFt(60)
    setRectWidthFt(40)
    setNorthFt(65)
    setSouthFt(60)
    setEastFt(45)
    setWestFt(40)
  }

  const getResultSummary = () => {
    return `Land Area & Plot Dimension Survey Summary:
- Mode: ${mode === 'rectangle' ? `Rectangle Plot (${rectLengthFt} ft × ${rectWidthFt} ft)` : `4-Sided Plot (N:${northFt}ft, S:${southFt}ft, E:${eastFt}ft, W:${westFt}ft)`}
- Total Area: ${totalSqft.toLocaleString('en-IN')} Square Feet (sq.ft)
- Cents: ${results.cent} Cents (435.6 sq.ft/cent)
- Acres: ${results.acre} Acres
- Gunthas: ${results.guntha} Gunthas (1,089 sq.ft/guntha)
- Grounds (Tamil Nadu): ${results.ground} Grounds (2,400 sq.ft/ground)
- Square Meters: ${results.sqm} sq.m
Calculated via India Practical Tools (https://indiapracticaltools.com)`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <span>Plot Geometry & Boundaries</span>
            </h2>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Patwari Survey Method
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode('rectangle')}
              className={`p-3 rounded-xl border text-left transition-all ${
                mode === 'rectangle'
                  ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                  : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400'
              }`}
            >
              <span className="text-sm block">Rectangular Plot</span>
              <span className="text-[11px] text-neutral-500">Standard Length × Width</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('four_sided')}
              className={`p-3 rounded-xl border text-left transition-all ${
                mode === 'four_sided'
                  ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                  : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400'
              }`}
            >
              <span className="text-sm block">4-Sided Irregular Plot</span>
              <span className="text-[11px] text-neutral-500">North, South, East, West</span>
            </button>
          </div>

          {/* Inputs based on mode */}
          {mode === 'rectangle' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Plot Length (Feet)</label>
                <input
                  type="number"
                  value={rectLengthFt || ''}
                  onChange={(e) => setRectLengthFt(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 rounded-xl px-4 py-2.5 font-mono text-white text-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Plot Width (Feet)</label>
                <input
                  type="number"
                  value={rectWidthFt || ''}
                  onChange={(e) => setRectWidthFt(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 rounded-xl px-4 py-2.5 font-mono text-white text-lg font-bold"
                />
              </div>

              {/* Quick site dimension presets */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  Popular Indian Layout Plot Sizes
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { l: 40, w: 30, name: '30×40 (1,200 sq.ft)' },
                    { l: 60, w: 40, name: '40×60 (2,400 sq.ft)' },
                    { l: 80, w: 50, name: '50×80 (4,000 sq.ft)' },
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setRectLengthFt(p.l)
                        setRectWidthFt(p.w)
                      }}
                      className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 hover:border-emerald-500"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">North Boundary (Ft)</label>
                <input
                  type="number"
                  value={northFt || ''}
                  onChange={(e) => setNorthFt(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 rounded-xl px-3 py-2 font-mono text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">South Boundary (Ft)</label>
                <input
                  type="number"
                  value={southFt || ''}
                  onChange={(e) => setSouthFt(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 rounded-xl px-3 py-2 font-mono text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">East Boundary (Ft)</label>
                <input
                  type="number"
                  value={eastFt || ''}
                  onChange={(e) => setEastFt(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 rounded-xl px-3 py-2 font-mono text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">West Boundary (Ft)</label>
                <input
                  type="number"
                  value={westFt || ''}
                  onChange={(e) => setWestFt(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 rounded-xl px-3 py-2 font-mono text-white text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Output */}
        <div className="lg:col-span-6 space-y-6">
          <motion.div
            layout
            className="p-6 sm:p-8 rounded-3xl bg-neutral-900/90 light:bg-white border border-neutral-800 light:border-slate-200 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-neutral-400">
                Calculated Land Area
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Multi-Unit Sync
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                {totalSqft.toLocaleString('en-IN')}
                <span className="text-lg text-neutral-400 font-normal"> sq.ft</span>
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Equivalent to <span className="font-bold text-emerald-400 font-mono">{results.cent} Cents</span> or <span className="font-bold text-white font-mono">{results.guntha} Gunthas</span>.
              </p>
            </div>

            {/* Indian Regional Units */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="p-3 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-0.5">Cents (South India)</span>
                <span className="text-base font-bold font-mono text-emerald-400">{results.cent} Cents</span>
                <span className="text-[10px] text-neutral-500 block">435.6 sq.ft / cent</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-0.5">Gunthas (MH / KA / TS)</span>
                <span className="text-base font-bold font-mono text-white">{results.guntha} Gunthas</span>
                <span className="text-[10px] text-neutral-500 block">1,089 sq.ft / guntha</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-0.5">Acres</span>
                <span className="text-base font-bold font-mono text-white">{results.acre} Acres</span>
                <span className="text-[10px] text-neutral-500 block">43,560 sq.ft / acre</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-0.5">Square Meters (sq.m)</span>
                <span className="text-base font-bold font-mono text-white">{results.sqm} m²</span>
                <span className="text-[10px] text-neutral-500 block">Registry Standard</span>
              </div>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Village Survey (Patwari) Rule</span>
            </div>
            <p>
              When measuring trapezoidal or irregular four-sided land plots, Indian revenue officers take the average of opposing sides. For highly irregular plots with sharp diagonals, dividing the plot into two triangles and summing their areas gives true millimeter precision.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
