import React from 'react'
import { ShieldCheck, Sparkles, Cpu } from 'lucide-react'
import { ScannerTranslation } from '../../lib/scanner/i18n'

interface ScannerTrustBadgesProps {
  t: ScannerTranslation
}

export const ScannerTrustBadges: React.FC<ScannerTrustBadgesProps> = ({ t }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2.5">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-sm backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span>{t.badgeFree}</span>
      </div>

      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-sm backdrop-blur-md">
        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
        <span>{t.badgePrivate}</span>
      </div>

      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300 text-xs font-semibold shadow-sm backdrop-blur-md font-mono">
        <Cpu className="w-3.5 h-3.5 text-slate-400" />
        <span>{t.badgeEngine}</span>
      </div>
    </div>
  )
}
