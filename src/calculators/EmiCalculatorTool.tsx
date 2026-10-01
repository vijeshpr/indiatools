import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calculator, IndianRupee, Calendar, CheckCircle2, TrendingUp } from 'lucide-react'
import { calculateEmi, EmiResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const EmiCalculatorTool: React.FC = () => {
  const tool = getToolBySlug('emi-calculator')!

  const [principal, setPrincipal] = useState<number>(3500000)
  const [interestRate, setInterestRate] = useState<number>(8.75)
  const [tenureYears, setTenureYears] = useState<number>(20)

  const result: EmiResult = useMemo(() => {
    return calculateEmi(principal, interestRate, tenureYears)
  }, [principal, interestRate, tenureYears])

  const handleReset = () => {
    setPrincipal(3500000)
    setInterestRate(8.75)
    setTenureYears(20)
  }

  const getResultSummary = () => {
    return `Loan EMI & Repayment Schedule:
- Principal Loan Amount: ₹${principal.toLocaleString('en-IN')}
- Annual Interest Rate: ${interestRate}% p.a.
- Tenure: ${tenureYears} Years (${result.tenureMonths} Months)
--------------------------------------------------
MONTHLY EMI: ₹${result.monthlyEmi.toLocaleString('en-IN')}
TOTAL INTEREST PAYABLE: ₹${result.totalInterest.toLocaleString('en-IN')}
TOTAL PAYMENT (Principal + Interest): ₹${result.totalPayment.toLocaleString('en-IN')}
Interest Share: ${result.interestRatioPercentage}% of Total Outflow
Calculated via India Practical Tools (https://indiapracticaltools.com)`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-purple-400" />
              <span>Loan Parameters</span>
            </h2>
            <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
              Reducing Balance Method
            </span>
          </div>

          {/* Principal */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>Loan Amount (Principal)</span>
              <span className="font-mono text-purple-400 font-bold text-base">₹{principal.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="100000"
              max="20000000"
              step="50000"
              value={principal}
              onChange={(e) => setPrincipal(parseFloat(e.target.value) || 100000)}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-500 mt-1">
              <span>₹1 Lakh (Personal)</span>
              <span>₹50 Lakhs (Home)</span>
              <span>₹2 Crore (Luxury Villa)</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>Interest Rate (% per annum)</span>
              <span className="font-mono text-purple-400 font-bold text-base">{interestRate}% p.a.</span>
            </div>
            <input
              type="range"
              min="6.5"
              max="18"
              step="0.05"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value) || 6.5)}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-neutral-500 mt-1">
              <span>8.4% (Home Loan)</span>
              <span>9.5% (Car Loan)</span>
              <span>13.5% (Personal Loan)</span>
            </div>
          </div>

          {/* Tenure */}
          <div>
            <div className="flex justify-between items-center text-xs text-neutral-300 light:text-slate-700 mb-2 font-medium">
              <span>Loan Tenure (Years)</span>
              <span className="font-mono text-purple-400 font-bold text-base">{tenureYears} Years ({tenureYears * 12} Mos)</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(parseFloat(e.target.value) || 1)}
              className="w-full accent-purple-500 cursor-pointer"
            />
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
                Monthly Loan EMI
              </span>
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {result.tenureMonths} Payments
              </span>
            </div>

            <div className="my-6">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white light:text-slate-900">
                ₹{result.monthlyEmi.toLocaleString('en-IN')}
                <span className="text-lg text-neutral-400 font-normal"> / month</span>
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Total Payment: <span className="font-bold text-white font-mono">₹{result.totalPayment.toLocaleString('en-IN')}</span> (Principal + Interest)
              </p>
            </div>

            {/* Split */}
            <div className="space-y-3 pt-4 border-t border-neutral-800 light:border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">Principal Amount</span>
                <span className="font-mono font-bold text-white">₹{principal.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full h-2 bg-neutral-800 light:bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${Math.min(100, (principal / result.totalPayment) * 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-neutral-300">Total Interest Payable</span>
                <span className="font-mono font-bold text-amber-400">₹{result.totalInterest.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full h-2 bg-neutral-800 light:bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${Math.min(100, (result.totalInterest / result.totalPayment) * 100)}%` }}
                />
              </div>
            </div>
          </motion.div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>Prepayment Power</span>
            </div>
            <p>
              Making just 1 extra EMI payment per year or increasing your EMI by 5% annually reduces a 20-year home loan tenure to ~12 years, saving lakhs of rupees in compound interest.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
