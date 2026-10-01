import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Compass, ArrowRightLeft, CheckCircle2 } from 'lucide-react'
import { convertLandArea, LandUnit, LandConversionResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const AcreConverterTool: React.FC = () => {
  const tool = getToolBySlug('acre-converter')!

  const [acreVal, setAcreVal] = useState<number>(2.5)

  const results: LandConversionResult = useMemo(() => {
    return convertLandArea(acreVal, 'acre')
  }, [acreVal])

  const handleReset = () => {
    setAcreVal(2.5)
  }

  const getResultSummary = () => {
    return `Acre Land Conversion Breakdown:
Input: ${acreVal} Acres
- Square Feet: ${results.sqft.toLocaleString('en-IN')} sq.ft (43,560 sq.ft/acre)
- Cents: ${results.cent} Cents (100 cents/acre)
- Gunthas: ${results.guntha} Gunthas (40 gunthas/acre)
- Grounds (Tamil Nadu): ${results.ground} Grounds
- Bighas: ${results.bigha} Standard Bighas
- Square Meters: ${results.sqm.toLocaleString('en-IN')} sq.m
- Hectares: ${results.hectare} Hectares (2.471 acres/hectare)
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
              <span>Input Acre Measurement</span>
            </h2>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              100 Cents / 43,560 sq.ft
            </span>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              Acre Value
            </label>
            <input
              type="number"
              step="0.05"
              min="0.01"
              value={acreVal || ''}
              onChange={(e) => setAcreVal(parseFloat(e.target.value) || 0)}
              className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-4 py-3 text-2xl font-bold font-mono text-white light:text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Quick presets */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              Popular Land Parcels
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[0.25, 0.5, 1, 2.5, 5, 10, 25, 50].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAcreVal(preset)}
                  className={`py-2 rounded-lg text-xs font-mono border transition-all ${
                    acreVal === preset
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {preset} {preset === 1 ? 'Acre' : 'Acres'}
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
                Converted Land Area
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Revenue Standard
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                {results.sqft.toLocaleString('en-IN')}
                <span className="text-lg text-neutral-400 font-normal"> sq.ft</span>
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Exactly <span className="font-bold text-emerald-400 font-mono">{results.cent} Cents</span> across Kerala, Tamil Nadu, and AP.
              </p>
            </div>

            {/* Grid of Indian Regional Units */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="p-3 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-0.5">Gunthas (MH / KA / TS)</span>
                <span className="text-base font-bold font-mono text-white">{results.guntha} Gunthas</span>
                <span className="text-[10px] text-neutral-500 block">40 Gunthas = 1 Acre</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-0.5">Grounds (Tamil Nadu)</span>
                <span className="text-base font-bold font-mono text-white">{results.ground} Grounds</span>
                <span className="text-[10px] text-neutral-500 block">1 Ground = 2,400 sq.ft</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-0.5">Standard Bigha (UP/WB)</span>
                <span className="text-base font-bold font-mono text-white">{results.bigha} Bighas</span>
                <span className="text-[10px] text-neutral-500 block">~27,225 sq.ft</span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-0.5">Hectares (Metric)</span>
                <span className="text-base font-bold font-mono text-emerald-400">{results.hectare} Hectares</span>
                <span className="text-[10px] text-neutral-500 block">10,000 sq.m</span>
              </div>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Survey Number Verification</span>
            </div>
            <p>
              In agricultural RTC / Patta documents, government land records record area in Acre-Gunta or Hectare-Are. 1 Acre is strictly 40 Guntas or 100 Cents.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
