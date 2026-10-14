import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Wifi, Smartphone, CheckCircle, ArrowDownCircle } from 'lucide-react'
import { P2PConnectionState } from '../../types/p2pPrint'

interface ConnectionRadarProps {
  state: P2PConnectionState
  waitingText: string
  connectedText: string
  receivingText: string
  readyText: string
  clientDeviceName?: string
}

export const ConnectionRadar: React.FC<ConnectionRadarProps> = ({
  state,
  waitingText,
  connectedText,
  receivingText,
  readyText,
  clientDeviceName,
}) => {
  const shouldReduceMotion = useReducedMotion()

  const isConnected = state === 'connected' || state === 'transferring' || state === 'complete'
  const isTransferring = state === 'transferring'
  const isComplete = state === 'complete'

  const statusColor = isComplete
    ? 'text-cyan-400'
    : isConnected
    ? 'text-emerald-400'
    : 'text-amber-400'

  const statusBg = isComplete
    ? 'bg-cyan-500/15 border-cyan-500/30'
    : isConnected
    ? 'bg-emerald-500/15 border-emerald-500/30'
    : 'bg-amber-500/15 border-amber-500/30'

  const currentLabel = isComplete
    ? readyText
    : isTransferring
    ? receivingText
    : isConnected
    ? connectedText
    : waitingText

  return (
    <div className="relative p-5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center overflow-hidden">
      {/* 100% Silent Visual Architecture Pill */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-white/5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          P2P Connection Radar
        </span>
        <span className="text-[10px] font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          100% Visual • Silent
        </span>
      </div>

      {/* Radar Graphic Viewport */}
      <div className="relative w-36 h-36 flex items-center justify-center my-4">
        {/* Concentric Radar Rings */}
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-4 rounded-full border border-white/10" />
        <div className="absolute inset-8 rounded-full border border-white/10" />

        {/* Dynamic Expanding Pulse Rings (Visual-Only) */}
        {!shouldReduceMotion && (!isConnected ? (
          // Idle State: Pulsing Amber Ring
          <motion.div
            animate={{
              scale: [1, 1.8],
              opacity: [0.65, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute w-16 h-16 rounded-full bg-amber-400/25 border border-amber-400/40 pointer-events-none"
          />
        ) : (
          // Connected / Active State: Vibrant Emerald / Cyan Rings
          <motion.div
            animate={{
              scale: [1, 1.9],
              opacity: [0.75, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute w-16 h-16 rounded-full bg-emerald-400/25 border border-emerald-400/50 pointer-events-none"
          />
        ))}

        {/* Center Beacon Icon */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : isConnected
              ? { scale: [1, 1.08, 1], filter: 'drop-shadow(0 0 16px rgba(16,185,129,0.5))' }
              : { scale: [1, 1.05, 1], filter: 'drop-shadow(0 0 10px rgba(245,158,11,0.35))' }
          }
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border shadow-inner transition-colors duration-300 ${
            isComplete
              ? 'bg-gradient-to-br from-cyan-500/20 to-teal-600/30 border-cyan-400/50 text-cyan-300'
              : isTransferring
              ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border-cyan-400/50 text-cyan-300'
              : isConnected
              ? 'bg-gradient-to-br from-emerald-500/20 to-teal-600/30 border-emerald-400/50 text-emerald-300'
              : 'bg-gradient-to-br from-amber-500/20 to-orange-600/30 border-amber-400/50 text-amber-300'
          }`}
        >
          {isComplete ? (
            <CheckCircle className="w-8 h-8 text-cyan-400" />
          ) : isTransferring ? (
            <ArrowDownCircle className="w-8 h-8 text-cyan-400 animate-pulse" />
          ) : isConnected ? (
            <Smartphone className="w-8 h-8 text-emerald-400" />
          ) : (
            <Wifi className="w-8 h-8 text-amber-400" />
          )}
        </motion.div>
      </div>

      {/* Status Badge with Live Ping Indicator */}
      <div
        className={`mt-1 px-3.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all duration-300 ${statusBg} ${statusColor}`}
      >
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isComplete ? 'bg-cyan-400' : isConnected ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isComplete ? 'bg-cyan-400' : isConnected ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
        </span>
        <span className="text-center">{currentLabel}</span>
      </div>

      {clientDeviceName && isConnected && (
        <p className="text-[11px] text-slate-400 mt-2 font-mono">
          Device: <span className="text-emerald-400 font-semibold">{clientDeviceName}</span>
        </p>
      )}
    </div>
  )
}
