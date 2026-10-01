import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, IndianRupee, Calendar, CheckCircle2 } from 'lucide-react'
import { calculateSip, SipResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const SipCalculatorTool: React.FC = () => {
  const tool = getToolBySlug('sip-calculator')!

  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(10000)
  const [returnRate, setReturnRate] = useState<number>(12)
  const [tenureYears, setTenureYears] = useState<number>(15)

  const result: SipResult = useMemo(() => {
    return calculateSip(monthlyInvestment, returnRate, tenureYears)
  }, [monthlyInvestment, returnRate, tenureYears])

  const handleReset = () => {
    setMonthlyInvestment(10000)
    setReturnRate(12)
    setTenureYears(15)
  }

  const getResultSummary = () => {
    return `Mutual Fund Systematic Investment Plan (SIP) Wealth Projection:
- Monthly Investment: ₹${monthlyInvestment.toLocaleString('en-IN')}
- Expected Return Rate: ${returnRate}% p.a.
- Investment Horizon: ${tenureYears} Years (${tenureYears * 12} Installments)
--------------------------------------------------
TOTAL INVESTED CAPITAL: ₹${result.investedAmount.toLocaleString('en-IN')}
ESTIMATED RETURNS (WEALTH GAIN): ₹${result.estimatedReturns.toLocaleString('en-IN')}
TOTAL MATURITY VALUE: ₹${result.totalMaturityValue.toLocaleString('en-IN')}
Wealth Growth Multiplier: ${(result.totalMaturityValue / Math.max(1, result.investedAmount)).toFixed(2)}×
Calculated via IndiaTools (https://indiatools-rho.vercel.app)`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span>SIP Investment Parameters</span>
            </h2>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Monthly Compounding
            </span>
          </div>

          {/* Monthly SIP Amount */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>Monthly Investment (₹)</span>
              <span className="font-mono text-purple-400 font-bold text-base">₹{monthlyInvestment.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="500"
              max="150000"
              step="500"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(parseFloat(e.target.value) || 500)}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-500 mt-1">
              <span>₹500 (Starter)</span>
              <span>₹10,000 (Goal-based)</span>
              <span>₹1 Lakh+ (HNI)</span>
            </div>
          </div>

          {/* Expected Return Rate */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>Expected Annual Return (% p.a.)</span>
              <span className="font-mono text-purple-400 font-bold text-base">{returnRate}% p.a.</span>
            </div>
            <input
              type="range"
              min="5"
              max="22"
              step="0.5"
              value={returnRate}
              onChange={(e) => setReturnRate(parseFloat(e.target.value) || 5)}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-500 mt-1">
              <span>7% (Debt/FD)</span>
              <span>12% (Nifty 50 Index)</span>
              <span>15% (Midcap / Smallcap)</span>
            </div>
          </div>

          {/* Time Horizon */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>Investment Period (Years)</span>
              <span className="font-mono text-purple-400 font-bold text-base">{tenureYears} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="35"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(parseFloat(e.target.value) || 1)}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-500 mt-1">
              <span>5 Yrs (Car Goal)</span>
              <span>15 Yrs (Child Education)</span>
              <span>25+ Yrs (Retirement)</span>
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
                Expected Maturity Value
              </span>
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {((result.totalMaturityValue / Math.max(1, result.investedAmount))).toFixed(2)}× Growth
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-purple-400">
                ₹{result.totalMaturityValue.toLocaleString('en-IN')}
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Gain from Compounding: <span className="font-bold text-emerald-400 font-mono">+₹{result.estimatedReturns.toLocaleString('en-IN')}</span>
              </p>
            </div>

            {/* Split */}
            <div className="space-y-3 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">Total Invested Amount</span>
                <span className="font-mono font-bold text-white">₹{result.investedAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full h-2 bg-neutral-800 light:bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${Math.min(100, (result.investedAmount / result.totalMaturityValue) * 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-neutral-300">Estimated Returns (Interest / Alpha)</span>
                <span className="font-mono font-bold text-emerald-400">₹{result.estimatedReturns.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full h-2 bg-neutral-800 light:bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(100, (result.estimatedReturns / result.totalMaturityValue) * 100)}%` }}
                />
              </div>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>The Power of Compounding</span>
            </div>
            <p>
              In a 15-year SIP at 12%, more than 60% of your final maturity corpus is generated purely by interest compounding rather than your principal out-of-pocket contributions.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
