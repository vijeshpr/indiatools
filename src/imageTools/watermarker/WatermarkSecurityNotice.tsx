import React from 'react'
import { ShieldCheck, AlertTriangle, Scale, Lock } from 'lucide-react'
import { WatermarkTranslation } from '../../lib/watermarker/i18n/translations'

interface WatermarkSecurityNoticeProps {
  t: WatermarkTranslation
}

export const WatermarkSecurityNotice: React.FC<WatermarkSecurityNoticeProps> = ({ t }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
      {/* Zero Knowledge Privacy Pledge */}
      <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden group hover:border-cyan-500/30 transition-all">
        <div className="flex items-center gap-3 mb-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Lock className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-100">Zero-Server Privacy Pledge</h4>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {t.zeroKnowledgePledge}
        </p>
      </div>

      {/* Steganographic Robustness Guidance */}
      <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden group hover:border-amber-500/30 transition-all">
        <div className="flex items-center gap-3 mb-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-100">Robustness & Survival Rules</h4>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          {t.robustnessWarning}
        </p>
      </div>

      {/* Legal & Forensic Attribution in India */}
      <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden group hover:border-emerald-500/30 transition-all">
        <div className="flex items-center gap-3 mb-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Scale className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-100">Legal Evidence & Section 65B</h4>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Embedded cryptographic CRC checksums and precise UTC epoch timestamps provide verifiable electronic audit trails admissible under the Indian Evidence Act Section 65B for trade secret leak investigations.
        </p>
      </div>
    </div>
  )
}
