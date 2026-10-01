import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Percent, IndianRupee, ArrowRightLeft, CheckCircle2 } from 'lucide-react'
import { calculateGst, GstResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

const GST_SLABS = [5, 12, 18, 28] as const

export const GstCalculatorTool: React.FC = () => {
  const tool = getToolBySlug('gst-calculator')!

  const [amount, setAmount] = useState<number>(25000)
  const [gstRate, setGstRate] = useState<5 | 12 | 18 | 28>(18)
  const [isInclusive, setIsInclusive] = useState<boolean>(false)

  const result: GstResult = useMemo(() => {
    return calculateGst(amount, gstRate, isInclusive)
  }, [amount, gstRate, isInclusive])

  const handleReset = () => {
    setAmount(25000)
    setGstRate(18)
    setIsInclusive(false)
  }

  const getResultSummary = () => {
    return `GST (Goods & Services Tax) Calculation:
- Base / Original Amount: ₹${result.originalAmount.toLocaleString('en-IN')}
- GST Rate: ${result.gstRatePct}% (${isInclusive ? 'GST Included in Price' : 'GST Added to Price'})
- CGST (Central GST): ₹${result.cgstAmount.toLocaleString('en-IN')} (${result.gstRatePct / 2}%)
- SGST (State GST): ₹${result.sgstAmount.toLocaleString('en-IN')} (${result.gstRatePct / 2}%)
- Total GST Tax: ₹${result.gstAmount.toLocaleString('en-IN')}
--------------------------------------------------
TOTAL INVOICE AMOUNT: ₹${result.finalAmount.toLocaleString('en-IN')}
Calculated via India Practical Tools (https://indiapracticaltools.com)`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Percent className="w-5 h-5 text-purple-400" />
              <span>Invoice / Price Amount</span>
            </h2>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              CGST + SGST Split
            </span>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              Amount (₹)
            </label>
            <input
              type="number"
              value={amount || ''}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-4 py-3 text-2xl font-bold font-mono text-white light:text-slate-900 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Exclusive vs Inclusive */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              Calculation Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsInclusive(false)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  !isInclusive
                    ? 'bg-purple-500/20 border-purple-500 text-white font-bold'
                    : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400'
                }`}
              >
                <span className="text-sm block">Add GST (Exclusive)</span>
                <span className="text-[11px] text-neutral-500">Price does not include tax</span>
              </button>

              <button
                type="button"
                onClick={() => setIsInclusive(true)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isInclusive
                    ? 'bg-purple-500/20 border-purple-500 text-white font-bold'
                    : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400'
                }`}
              >
                <span className="text-sm block">Remove GST (Inclusive)</span>
                <span className="text-[11px] text-neutral-500">Price is MRP / All-inclusive</span>
              </button>
            </div>
          </div>

          {/* Standard GST Slabs */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              GST Slab Rate
            </label>
            <div className="grid grid-cols-4 gap-2">
              {GST_SLABS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setGstRate(r)}
                  className={`py-2.5 rounded-xl border font-mono font-bold text-sm transition-all ${
                    gstRate === r
                      ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                      : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400'
                  }`}
                >
                  {r}%
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
                Total Invoice Value
              </span>
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {result.gstRatePct}% GST Applied
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                ₹{result.finalAmount.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Total Tax Component: <span className="font-bold text-purple-400 font-mono">₹{result.gstAmount.toLocaleString('en-IN')}</span>
              </p>
            </div>

            {/* Split */}
            <div className="space-y-3 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">Base Net Price</span>
                <span className="font-mono font-bold text-white">₹{result.originalAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">CGST ({result.gstRatePct / 2}%)</span>
                <span className="font-mono font-bold text-white">₹{result.cgstAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">SGST / UTGST ({result.gstRatePct / 2}%)</span>
                <span className="font-mono font-bold text-white">₹{result.sgstAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center text-xs pt-1 border-t border-neutral-800">
                <span className="text-neutral-400">If Interstate (IGST)</span>
                <span className="font-mono font-bold text-amber-400">₹{result.gstAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>Common GST Slabs in India</span>
            </div>
            <p>
              5%: Edible oil, tea, rail travel. 12%: Packaged food, business class air travel. 18%: IT software, hotel stays &gt;₹1k, hair oil. 28%: Automobiles, cement, luxury goods.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
