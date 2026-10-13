import React from 'react'
import { Sparkles, ShieldCheck, Cpu } from 'lucide-react'
import { InpaintingTranslation } from '../../lib/inpainting/i18n'

interface Props {
  t: InpaintingTranslation
}

export const InpaintingTrustBadges: React.FC<Props> = ({ t }) => {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.15)]">
        <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
        <span>{t.badgeFree}</span>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
        <span>{t.badgePrivacy}</span>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_12px_rgba(168,85,247,0.15)]">
        <Cpu className="w-3.5 h-3.5 text-purple-400" />
        <span>{t.badgeEngine}</span>
      </div>
    </div>
  )
}
