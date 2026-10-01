import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Clock, Calendar, CheckCircle2, Award } from 'lucide-react'
import { calculateExperience, ExperienceResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const ExperienceTool: React.FC = () => {
  const tool = getToolBySlug('experience-calculator')!

  const [startDate, setStartDate] = useState<string>('2021-06-01')
  const [endDate, setEndDate] = useState<string>('2026-10-01')
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState<boolean>(true)
  const [gapMonths, setGapMonths] = useState<number>(0)

  const results: ExperienceResult = useMemo(() => {
    return calculateExperience(startDate, endDate, isCurrentlyWorking, gapMonths)
  }, [startDate, endDate, isCurrentlyWorking, gapMonths])

  const handleReset = () => {
    setStartDate('2021-06-01')
    setEndDate('2026-10-01')
    setIsCurrentlyWorking(true)
    setGapMonths(0)
  }

  const getResultSummary = () => {
    return `Work Experience & Career Gap Summary:
Service Duration: ${startDate} to ${isCurrentlyWorking ? 'Present' : endDate}
Career Gap Deducted: ${gapMonths} Months
- Total Work Experience: ${results.formattedExperience}
- Total Calendar Days: ${results.totalCalendarDays} Days
- Approximate Working Days: ${results.totalWorkingDaysApprox} Days (5-day week)
- Equivalent Months: ${results.effectiveMonths} Months
Calculated on IndiaTools`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <span>Service Employment Dates</span>
            </h2>
            <div className="flex items-center gap-2">
              <label className="text-xs text-neutral-400 cursor-pointer flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={isCurrentlyWorking}
                  onChange={(e) => setIsCurrentlyWorking(e.target.checked)}
                  className="rounded accent-purple-500 cursor-pointer"
                />
                <span className="text-white font-medium">Currently Working</span>
              </label>
            </div>
          </div>

          {/* Joining Date */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-1.5">
              Joining Date / Service Start
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-white light:text-slate-900 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Relieving Date */}
          {!isCurrentlyWorking && (
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-1.5">
                Relieving Date / Service End
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-white light:text-slate-900 focus:outline-none focus:border-purple-500"
              />
            </div>
          )}

          {/* Career Gap */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600">
                Career Break / Unpaid Leave
              </label>
              <span className="text-xs text-purple-400 font-mono font-bold">
                {gapMonths} Months
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              value={gapMonths}
              onChange={(e) => setGapMonths(parseInt(e.target.value) || 0)}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              Deducts sabbaticals or career gaps from total verifiable experience.
            </p>
          </div>
        </div>

        {/* Right Results */}
        <div className="lg:col-span-6 space-y-4">
          <motion.div
            layout
            className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-purple-950/30 border border-purple-500/30 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Aggregated Tenure</span>
              </span>
              <span className="text-xs font-bold text-neutral-400 font-mono">
                {results.effectiveMonths} Total Months
              </span>
            </div>

            {/* Formatted Headline */}
            <div className="mb-6 pb-6 border-b border-neutral-800">
              <span className="text-xs text-neutral-400 block font-medium">Exact Net Experience</span>
              <div className="mt-1">
                <span className="text-2xl sm:text-4xl font-black tracking-tight text-white block">
                  {results.formattedExperience}
                </span>
              </div>
              <p className="mt-2 text-xs text-purple-300/90 font-mono">
                Ready for resume, LinkedIn, and government service verification.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <span className="text-xs text-neutral-400 mb-1 block">Calendar Days</span>
                <p className="text-lg sm:text-xl font-bold text-white font-mono">
                  {results.totalCalendarDays.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-neutral-400">Total days on payroll</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <span className="text-xs text-neutral-400 mb-1 block">Approx Working Days</span>
                <p className="text-lg sm:text-xl font-bold text-white font-mono">
                  ~{results.totalWorkingDaysApprox.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-neutral-400">5-day corporate week</span>
              </div>
            </div>
          </motion.div>

          <div className="p-4 rounded-xl bg-neutral-900/50 light:bg-slate-100 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              When uploading service certificates to EPFO or state PSC portals, align dates exactly with the relieving letter day to avoid discrepancy flags.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
