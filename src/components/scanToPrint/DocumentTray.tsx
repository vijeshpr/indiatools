import React from 'react'
import { motion } from 'framer-motion'
import { FileUp, Inbox, ArrowDownCircle, Activity } from 'lucide-react'
import { P2PConnectionState, ReceivedDocument, TransferProgress } from '../../types/p2pPrint'
import { I18nContent } from './scanToPrintI18n'
import { DocumentInspector } from './DocumentInspector'

interface DocumentTrayProps {
  state: P2PConnectionState
  progress: TransferProgress | null
  document: ReceivedDocument | null
  autoPrintEnabled: boolean
  onToggleAutoPrint: () => void
  onPrint: () => void
  onPurge: () => void
  i18n: I18nContent
}

export const DocumentTray: React.FC<DocumentTrayProps> = ({
  state,
  progress,
  document,
  autoPrintEnabled,
  onToggleAutoPrint,
  onPrint,
  onPurge,
  i18n,
}) => {
  // If a document has finished transferring and is ready in RAM
  if (document) {
    return (
      <DocumentInspector
        document={document}
        autoPrintEnabled={autoPrintEnabled}
        onToggleAutoPrint={onToggleAutoPrint}
        onPrint={onPrint}
        onPurge={onPurge}
        i18n={i18n}
      />
    )
  }

  // If in the middle of streaming chunks
  if (state === 'transferring' && progress) {
    const mbReceived = (progress.bytesReceived / (1024 * 1024)).toFixed(2)
    const mbTotal = (progress.totalBytes / (1024 * 1024)).toFixed(2)
    const speedKbps = (progress.speedBps / 1024).toFixed(1)

    return (
      <div className="p-8 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center text-center space-y-5 animate-in fade-in duration-200">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-emerald-400 border-l-transparent"
          />
          <ArrowDownCircle className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-base text-white">{i18n.terminal.receivingStream}</h3>
          <p className="text-xs text-slate-400 font-mono">
            {mbReceived} MB / {mbTotal} MB • Chunk {progress.chunkIndex}/{progress.totalChunks}
          </p>
        </div>

        {/* Progress Bar with Spring Animation */}
        <div className="w-full max-w-md space-y-1.5">
          <div className="w-full h-3 rounded-full bg-slate-950 border border-white/10 overflow-hidden p-0.5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>{speedKbps} KB/s</span>
            </span>
            <span className="font-bold text-cyan-400">{progress.percentage}%</span>
          </div>
        </div>
      </div>
    )
  }

  // Idle / Waiting for Customer Upload state
  return (
    <div className="p-8 sm:p-12 rounded-2xl bg-slate-900/60 border border-dashed border-white/15 backdrop-blur-xl flex flex-col items-center justify-center text-center space-y-4">
      <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/5 text-slate-400">
        <Inbox className="w-10 h-10 text-cyan-400/80" />
      </div>

      <div className="space-y-1.5 max-w-sm">
        <h3 className="font-bold text-base text-slate-200">{i18n.terminal.noDocWaiting}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{i18n.terminal.noDocDesc}</p>
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-white/5 text-xs text-slate-400">
        <FileUp className="w-3.5 h-3.5 text-emerald-400" />
        <span>Supports PDF, JPG, PNG, WEBP, DOCX</span>
      </div>
    </div>
  )
}
