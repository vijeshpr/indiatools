import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Percent, Tag, IndianRupee, CheckCircle2 } from 'lucide-react'
import { calculatePercentage, PercentageResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const PercentageDiscountTool: React.FC = () => {
  const tool = getToolBySlug('percentage-calculator')!

  const [baseValue, setBaseValue] = useState<number>(4500)
  const [percentRate, setPercentRate] = useState<number>(25)

  const result: PercentageResult = useMemo(() => {
    return calculatePercentage(baseValue, percentRate)
  }, [baseValue, percentRate])

  const handleReset = () => {
    setBaseValue(4500)
    setPercentRate(25)
  }

  const getResultSummary = () => {
    return `Percentage & Discount Calculation:
- Base Value: ₹${baseValue.toLocaleString('en-IN')}
- Percentage Rate: ${percentRate}%
- Calculated Share (Amount): ₹${result.calculatedAmount.toLocaleString('en-IN')}
--------------------------------------------------
AFTER ${percentRate}% DISCOUNT: ₹${result.finalWithDiscount.toLocaleString('en-IN')} (Saved ₹${result.calculatedAmount.toLocaleString('en-IN')})
AFTER ${percentRate}% MARKUP / TAX: ₹${result.finalWithAddition.toLocaleString('en-IN')}
Calculated via India Practical Tools (https://indiapracticaltools.com)`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Tag className="w-5 h-5 text-purple-400" />
              <span>Input Value & Percentage</span>
            </h2>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Dual Addition/Discount
            </span>
          </div>

          {/* Base Value */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-1.5">
              Original Amount / Price (₹)
            </label>
            <input
              type="number"
              value={baseValue || ''}
              onChange={(e) => setBaseValue(parseFloat(e.target.value) || 0)}
              className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-4 py-3 text-2xl font-bold font-mono text-white light:text-slate-900 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Percentage */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>Percentage Rate</span>
              <span className="font-mono text-purple-400 font-bold text-lg">{percentRate}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="0.5"
              value={percentRate}
              onChange={(e) => setPercentRate(parseFloat(e.target.value) || 1)}
              className="w-full accent-purple-500 cursor-pointer"
            />
            {/* Quick chips */}
            <div className="flex gap-2 mt-3">
              {[5, 10, 15, 20, 25, 50].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setPercentRate(rate)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                    percentRate === rate
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                  }`}
                >
                  {rate}%
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
                Calculated Percentage Amount
              </span>
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {percentRate}% of ₹{baseValue.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                ₹{result.calculatedAmount.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                The exact {percentRate}% portion of your original amount.
              </p>
            </div>

            {/* Side by side Discount vs Addition */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-emerald-400 font-semibold block mb-1">
                  Discounted Price (-{percentRate}%)
                </span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  ₹{result.finalWithDiscount.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">
                  You save ₹{result.calculatedAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 light:bg-slate-50 border border-neutral-800">
                <span className="text-[11px] text-purple-400 font-semibold block mb-1">
                  Markup / With Tax (+{percentRate}%)
                </span>
                <span className="text-xl font-bold font-mono text-white">
                  ₹{result.finalWithAddition.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">
                  +₹{result.calculatedAmount.toLocaleString('en-IN')} added
                </span>
              </div>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>Festive Discount Trap</span>
            </div>
            <p>
              A 50% discount followed by an additional 20% discount does NOT equal a 70% discount. It is 50% of the original, plus 20% of the remaining 50%, resulting in an effective 60% discount overall.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
