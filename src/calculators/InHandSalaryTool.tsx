import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { IndianRupee, Briefcase, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { calculateInHandSalary, InHandSalaryResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const InHandSalaryTool: React.FC = () => {
  const tool = getToolBySlug('in-hand-salary')!

  const [annualCtc, setAnnualCtc] = useState<number>(1200000)
  const [taxRegime, setTaxRegime] = useState<'new' | 'old'>('new')

  const result: InHandSalaryResult = useMemo(() => {
    return calculateInHandSalary(annualCtc, taxRegime)
  }, [annualCtc, taxRegime])

  const handleReset = () => {
    setAnnualCtc(1200000)
    setTaxRegime('new')
  }

  const getResultSummary = () => {
    return `In-Hand Take Home Salary Breakdown:
- Annual CTC: ₹${result.annualCtc.toLocaleString('en-IN')}
- Tax Regime: ${taxRegime === 'new' ? 'New Tax Regime (Sec 115BAC - FY 2024-25)' : 'Old Tax Regime'}
--------------------------------------------------
ESTIMATED MONTHLY IN-HAND: ₹${result.monthlyInHand.toLocaleString('en-IN')}
ANNUAL NET TAKE-HOME: ₹${result.annualInHand.toLocaleString('en-IN')}
Monthly Deductions:
- Employee PF (12%): ₹${result.monthlyEpfDeduction.toLocaleString('en-IN')}
- Professional Tax: ₹${result.monthlyProfessionalTax.toLocaleString('en-IN')}
- Monthly TDS Income Tax: ₹${result.monthlyTdsIncomeTax.toLocaleString('en-IN')}
Total Annual Tax: ₹${result.totalAnnualTax.toLocaleString('en-IN')}
Calculated via IndiaTools (https://indiatools-rho.vercel.app)`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-purple-400" />
              <span>CTC & Tax Structure</span>
            </h2>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              FY 2024-25 / 2025-26 Budget Slabs
            </span>
          </div>

          {/* CTC Slider */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>Annual CTC Package</span>
              <span className="font-mono text-purple-400 font-bold text-base">₹{(annualCtc / 100000).toFixed(1)} Lakhs / yr</span>
            </div>
            <input
              type="range"
              min="300000"
              max="5000000"
              step="50000"
              value={annualCtc}
              onChange={(e) => setAnnualCtc(parseFloat(e.target.value) || 300000)}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-500 mt-1">
              <span>₹3 LPA</span>
              <span>₹12 LPA (Mid Tech)</span>
              <span>₹50 LPA (Lead)</span>
            </div>
          </div>

          {/* Tax Regime Selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              Income Tax Regime
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTaxRegime('new')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  taxRegime === 'new'
                    ? 'bg-purple-500/20 border-purple-500 text-white font-bold'
                    : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm block">New Regime</span>
                  <span className="text-[10px] bg-purple-500/30 text-purple-300 px-1.5 py-0.5 rounded font-mono">Default</span>
                </div>
                <span className="text-[11px] text-neutral-400 block mt-1">₹7.75L Zero Tax (with standard deduction)</span>
              </button>

              <button
                type="button"
                onClick={() => setTaxRegime('old')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  taxRegime === 'old'
                    ? 'bg-purple-500/20 border-purple-500 text-white font-bold'
                    : 'bg-neutral-950 light:bg-slate-50 border-neutral-800 text-neutral-400'
                }`}
              >
                <span className="text-sm block">Old Regime</span>
                <span className="text-[11px] text-neutral-400 block mt-1">80C, 80D, HRA & Home Loan deductions</span>
              </button>
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
                Monthly Net In-Hand Salary
              </span>
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                Credited to Bank
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                ₹{result.monthlyInHand.toLocaleString('en-IN')}
                <span className="text-lg text-neutral-400 font-normal"> / month</span>
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Annual Take-Home: <span className="font-bold text-purple-400 font-mono">₹{result.annualInHand.toLocaleString('en-IN')}/year</span> ({((result.annualInHand / result.annualCtc) * 100).toFixed(1)}% of CTC)
              </p>
            </div>

            {/* Deductions Breakdown */}
            <div className="space-y-3 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">Employee PF (EPF 12%)</span>
                <span className="font-mono font-bold text-white">₹{result.monthlyEpfDeduction.toLocaleString('en-IN')}/mo</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">Income Tax (TDS Monthly)</span>
                <span className="font-mono font-bold text-amber-400">₹{result.monthlyTdsIncomeTax.toLocaleString('en-IN')}/mo</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">Professional Tax (PT)</span>
                <span className="font-mono font-bold text-white">₹{result.monthlyProfessionalTax}/mo</span>
              </div>

              <div className="flex justify-between items-center text-xs pt-1 border-t border-neutral-800">
                <span className="text-neutral-400">Annual Income Tax Payable</span>
                <span className="font-mono font-bold text-white">₹{result.totalAnnualTax.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>CTC vs Take-Home Reality</span>
            </div>
            <p>
              In Indian employment offers, CTC includes Employer PF contribution (12%), gratuity provision (4.81%), and insurance perks that are never credited to your bank account. Real in-hand take-home is usually 70–82% of stated CTC.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
