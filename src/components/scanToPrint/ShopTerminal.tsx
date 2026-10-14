import React from 'react'
import { Printer, Shield, RefreshCw, FileText } from 'lucide-react'
import { P2PConnectionState, ReceivedDocument, TransferProgress } from '../../types/p2pPrint'
import { I18nContent } from './scanToPrintI18n'
import { ConnectionRadar } from './ConnectionRadar'
import { QRCodeDisplay } from './QRCodeDisplay'
import { DocumentTray } from './DocumentTray'

interface ShopTerminalProps {
  sessionId: string
  sessionUrl: string
  state: P2PConnectionState
  progress: TransferProgress | null
  document: ReceivedDocument | null
  autoPrintEnabled: boolean
  onToggleAutoPrint: () => void
  onPrint: () => void
  onPurge: () => void
  onOpenPosterModal: () => void
  onOpenMobileTest: () => void
  onResetSession: () => void
  i18n: I18nContent
}

export const ShopTerminal: React.FC<ShopTerminalProps> = ({
  sessionId,
  sessionUrl,
  state,
  progress,
  document,
  autoPrintEnabled,
  onToggleAutoPrint,
  onPrint,
  onPurge,
  onOpenPosterModal,
  onOpenMobileTest,
  onResetSession,
  i18n,
}) => {
  return (
    <div id="shop-terminal" className="w-full space-y-6">
      {/* Station Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-xl no-print">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
              <span>{i18n.terminal.stationTitle}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
                Counter 01
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Station Code: <span className="font-bold text-cyan-400">{sessionId}</span>
            </p>
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2">
          {/* Print Station Poster Generator Button */}
          <button
            onClick={onOpenPosterModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 hover:from-cyan-500/30 hover:to-emerald-500/30 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Print Station Poster (A4)</span>
          </button>

          <button
            onClick={onResetSession}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Generate new session key"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Session</span>
          </button>
        </div>
      </div>

      {/* Dynamic Session QR Box & Visual Connection Radar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch no-print">
        {/* Dynamic Session QR Box */}
        <QRCodeDisplay
          sessionId={sessionId}
          sessionUrl={sessionUrl}
          sessionLabel={i18n.terminal.sessionCode}
          instructionText={i18n.terminal.scanToConnect}
          onOpenMobileTest={onOpenMobileTest}
        />

        {/* Visual Connection Radar */}
        <ConnectionRadar
          state={state}
          waitingText={i18n.terminal.waitingCustomer}
          connectedText={i18n.terminal.customerConnected}
          receivingText={i18n.terminal.receivingStream}
          readyText={i18n.terminal.readyToPrint}
        />
      </div>

      {/* Incoming Document Tray & Multi-Page Inspector */}
      <DocumentTray
        state={state}
        progress={progress}
        document={document}
        autoPrintEnabled={autoPrintEnabled}
        onToggleAutoPrint={onToggleAutoPrint}
        onPrint={onPrint}
        onPurge={onPurge}
        i18n={i18n}
      />

      {/* In-Memory Guarantee Card */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-3 text-xs text-slate-400 no-print">
        <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
        <p>
          <span className="font-semibold text-slate-200">100% In-RAM Transfer:</span> Files exist strictly in browser heap memory. No cloud upload, no disk writes, and zero logs. Buffers shredded upon printing or clearing.
        </p>
      </div>
    </div>
  )
}
