import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Grid, HardHat, CheckCircle2, IndianRupee } from 'lucide-react'
import { calculateTiles, TileResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

const TILE_SIZES: { id: '2x2' | '4x2' | '2x1' | '1x1'; label: string; desc: string }[] = [
  { id: '2x2', label: '2ft × 2ft (600×600 mm)', desc: 'Standard Vitrified Floor Tile' },
  { id: '4x2', label: '4ft × 2ft (1200×600 mm)', desc: 'GVT Large Slab Floor Tile' },
  { id: '2x1', label: '2ft × 1ft (600×300 mm)', desc: 'Kitchen & Bathroom Wall Tile' },
  { id: '1x1', label: '1ft × 1ft (300×300 mm)', desc: 'Bathroom Anti-Skid / Balcony' },
]

export const TileCalculatorTool: React.FC = () => {
  const tool = getToolBySlug('tile-calculator')!

  const [lengthFt, setLengthFt] = useState<number>(16)
  const [widthFt, setWidthFt] = useState<number>(14)
  const [tileSize, setTileSize] = useState<'2x2' | '4x2' | '2x1' | '1x1'>('2x2')
  const [includeSkirting, setIncludeSkirting] = useState<boolean>(true)

  const result: TileResult = useMemo(() => {
    return calculateTiles(lengthFt, widthFt, tileSize, includeSkirting)
  }, [lengthFt, widthFt, tileSize, includeSkirting])

  const handleReset = () => {
    setLengthFt(16)
    setWidthFt(14)
    setTileSize('2x2')
    setIncludeSkirting(true)
  }

  const getResultSummary = () => {
    return `Tile & Flooring Box Requirement:
- Room Dimensions: ${lengthFt} ft × ${widthFt} ft = ${result.roomAreaSqft} sq.ft
- Tile Size: ${tileSize} feet
- Skirting Included: ${includeSkirting ? 'Yes (4" skirting)' : 'No'}
- Total Billing Area: ${result.totalTilingAreaSqft} sq.ft (includes cutting wastage)
- Boxes Required: ${result.boxCount} Boxes (${result.tileCount} Tiles)
- Tile Material Cost: ₹${result.estimatedCostRs.toLocaleString('en-IN')}
- Adhesive / Mortar Bags: ~${result.adhesiveBags} Bags (20kg)
Calculated via IndiaTools (https://indiatools-rho.vercel.app)`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Grid className="w-5 h-5 text-amber-500" />
              <span>Room Dimensions & Tile Size</span>
            </h2>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              8% Corner Wastage
            </span>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Room Length (Feet)</label>
              <input
                type="number"
                value={lengthFt || ''}
                onChange={(e) => setLengthFt(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-3 py-2 font-mono text-white light:text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Room Width (Feet)</label>
              <input
                type="number"
                value={widthFt || ''}
                onChange={(e) => setWidthFt(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-3 py-2 font-mono text-white light:text-slate-900"
              />
            </div>
          </div>

          {/* Tile Size */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              Select Tile Dimensions
            </label>
            <div className="space-y-2">
              {TILE_SIZES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTileSize(t.id)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                    tileSize === t.id
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400'
                  }`}
                >
                  <div>
                    <span className="text-xs block font-bold text-white light:text-slate-900">{t.label}</span>
                    <span className="text-[11px] text-neutral-500">{t.desc}</span>
                  </div>
                  <span className="text-xs font-mono text-amber-400">{t.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Skirting */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
              <input
                type="checkbox"
                checked={includeSkirting}
                onChange={(e) => setIncludeSkirting(e.target.checked)}
                className="rounded border-neutral-700 text-amber-500 focus:ring-amber-500"
              />
              <span>Include 4" Wall Skirting (~10% extra)</span>
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
                Total Tile Boxes
              </span>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {result.totalTilingAreaSqft} sq.ft Coverage
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                {result.boxCount}
                <span className="text-xl text-neutral-400 font-normal"> Boxes</span>
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Total Tiles: <span className="font-bold text-white font-mono">{result.tileCount} pcs</span> • Estimated Cost: <span className="font-bold text-amber-400 font-mono">₹{result.estimatedCostRs.toLocaleString('en-IN')}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-1">Tile Adhesive / Mortar</span>
                <span className="text-lg font-bold font-mono text-white">
                  ~{result.adhesiveBags} Bags
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">20kg Polymer Adhesive</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-1">Net Floor Area</span>
                <span className="text-lg font-bold font-mono text-white">
                  {result.roomAreaSqft} sq.ft
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">Exclude skirting & waste</span>
              </div>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Tile Box Rule</span>
            </div>
            <p>
              Always preserve 1 unopened box of each tile pattern. Tile manufacturing batches vary in shade (dye-lot variance); finding the identical shade months later for pipeline repairs is nearly impossible.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
