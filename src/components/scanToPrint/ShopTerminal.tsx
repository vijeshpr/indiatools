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
    <div id="shop-terminal" className="w-full max-w-6xl mx-auto space-y-6 no-print">
      {/* Station Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
              <span>{i18n.terminal.stationTitle}</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
                Live Terminal
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Active Session: <span className="font-mono text-cyan-400 font-semibold">{sessionId}</span>
            </p>
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPosterModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Counter Standee</span>
          </button>

          <button
            onClick={onResetSession}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Generate new session key"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Session</span>
          </button>
        </div>
      </div>

      {/* Main Grid: QR & Radar (Left) | Document Tray (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: QR Code & Connection Radar */}
        <div className="lg:col-span-5 space-y-6">
          {/* QR Code Card */}
          <QRCodeDisplay
            sessionId={sessionId}
            sessionUrl={sessionUrl}
            sessionLabel={i18n.terminal.sessionCode}
            instructionText={i18n.terminal.scanToConnect}
            onOpenMobileTest={onOpenMobileTest}
          />

          {/* Connection Radar Card */}
          <ConnectionRadar
            state={state}
            waitingText={i18n.terminal.waitingCustomer}
            connectedText={i18n.terminal.customerConnected}
            receivingText={i18n.terminal.receivingStream}
            readyText={i18n.terminal.readyToPrint}
          />

          {/* In-Memory Guarantee Card */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5 text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-200">Zero Cloud Storage Guarantee:</span>
              <p>Files exist strictly in browser RAM. No servers, no intermediate cloud caching, and no WhatsApp logs.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Incoming Document Tray & Inspector */}
        <div className="lg:col-span-7">
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
        </div>
      </div>
    </div>
  )
}
