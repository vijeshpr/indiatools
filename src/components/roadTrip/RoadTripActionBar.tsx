import React, { useState } from 'react'
import { RotateCcw, Copy, Share2, Check, AlertCircle } from 'lucide-react'
import { useToast } from '../common/Toast'

interface RoadTripActionBarProps {
  onReset: () => void
  getSummaryText: () => string
  routeTitle: string
}

export const RoadTripActionBar: React.FC<RoadTripActionBarProps> = ({
  onReset,
  getSummaryText,
  routeTitle,
}) => {
  const { showToast } = useToast()
  const [copied, setCopied] = useState<boolean>(false)
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false)

  const handleCopy = async () => {
    try {
      const text = getSummaryText()
      await navigator.clipboard.writeText(text)
      setCopied(true)
      showToast('Trip budget summary copied to clipboard!')
      setTimeout(() => setCopied(false), 2500)
    } catch {
      showToast('Unable to copy to clipboard')
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    const title = routeTitle || 'Indian Road Trip Budget Planner'
    const text = getSummaryText()

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out our Indian Highway Road Trip Budget on IndiaTools:\n\n${text}`,
          url,
        })
        return
      } catch (err: any) {
        if (err?.name === 'AbortError') return
      }
    }

    // Fallback
    try {
      await navigator.clipboard.writeText(`${title}\n${url}\n\n${text}`)
      showToast('Trip link & summary copied to clipboard!')
    } catch {
      showToast('Unable to share link')
    }
  }

  const handleConfirmReset = () => {
    onReset()
    setShowResetConfirm(false)
    showToast('Trip planner reset to default parameters')
  }

  return (
    <div className="p-3 sm:p-4 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
      {/* Left Info / Reset action */}
      <div className="flex items-center gap-2">
        {showResetConfirm ? (
          <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-rose-700 dark:text-rose-300 font-medium">Reset all inputs?</span>
            <button
              type="button"
              onClick={handleConfirmReset}
              className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer transition-colors"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setShowResetConfirm(false)}
              className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 cursor-pointer transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 transition-colors cursor-pointer"
            title="Reset to default road trip settings"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Reset</span>
          </button>
        )}
        <span className="hidden sm:inline text-xs text-slate-400 dark:text-slate-500 font-mono">
          Client-Side Safe
        </span>
      </div>

      {/* Right Primary Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
          title="Copy formatted summary to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Copy Results</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 transition-all shadow-md shadow-cyan-600/20 hover:shadow-cyan-600/30 cursor-pointer"
          title="Share trip with friends"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Trip</span>
        </button>
      </div>
    </div>
  )
}
