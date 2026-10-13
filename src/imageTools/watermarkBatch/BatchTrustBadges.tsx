import React from 'react'
import { ShieldCheck, Zap, Sparkles } from 'lucide-react'
import { BatchWatermarkTranslation } from '../../lib/watermarkEngine/i18n'

interface Props {
  t: BatchWatermarkTranslation
}

export const BatchTrustBadges: React.FC<Props> = ({ t }) => {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span>{t.badgeFree}</span>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
        <span>{t.badgePrivacy}</span>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_12px_rgba(99,102,241,0.15)]">
        <Zap className="w-3.5 h-3.5 text-indigo-400" />
        <span>{t.badgeSpeed}</span>
      </div>
    </div>
  )
}
