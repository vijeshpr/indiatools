import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Wifi, Smartphone, CheckCircle, Volume2, VolumeX } from 'lucide-react'
import { P2PConnectionState } from '../../types/p2pPrint'
import { getChimeMuted, setChimeMuted } from './chimeAudio'

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
  const [muted, setMutedState] = React.useState(getChimeMuted())
  const shouldReduceMotion = useReducedMotion()

  const toggleSound = () => {
    const next = !muted
    setChimeMuted(next)
    setMutedState(next)
  }

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
      {/* Sound toggle button */}
      <button
        onClick={toggleSound}
        className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
        title={muted ? 'Unmute connection chime' : 'Mute connection chime'}
      >
        {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
      </button>

      {/* Radar Graphic Viewport */}
      <div className="relative w-36 h-36 flex items-center justify-center my-3">
        {/* Concentric Radar Rings */}
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-4 rounded-full border border-white/10" />
        <div className="absolute inset-8 rounded-full border border-white/10" />

        {/* Dynamic Expanding Pulse Rings */}
        {!shouldReduceMotion && (!isConnected ? (
          // Amber Pulse Ring
          <motion.div
            animate={{
              scale: [1, 1.8],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute w-16 h-16 rounded-full bg-amber-400/20 border border-amber-400/40 pointer-events-none"
          />
        ) : (
          // Emerald / Cyan Active Rings
          <motion.div
            animate={{
              scale: [1, 1.9],
              opacity: [0.7, 0],
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
              : { scale: [1, 1.04, 1], filter: 'drop-shadow(0 0 10px rgba(245,158,11,0.3))' }
          }
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center border shadow-inner ${
            isConnected
              ? 'bg-gradient-to-br from-emerald-500/20 to-teal-600/30 border-emerald-400/50 text-emerald-300'
              : 'bg-gradient-to-br from-amber-500/20 to-orange-600/30 border-amber-400/50 text-amber-300'
          }`}
        >
          {isComplete ? (
            <CheckCircle className="w-8 h-8 text-cyan-400" />
          ) : isConnected ? (
            <Smartphone className="w-8 h-8 text-emerald-400" />
          ) : (
            <Wifi className="w-8 h-8 text-amber-400" />
          )}
        </motion.div>
      </div>

      {/* Status Badge */}
      <div className={`mt-2 px-3 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-2 ${statusBg} ${statusColor}`}>
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isConnected ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isConnected ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
        </span>
        <span>{currentLabel}</span>
      </div>

      {clientDeviceName && isConnected && (
        <p className="text-xs text-slate-400 mt-2 font-mono">
          Device: <span className="text-emerald-400">{clientDeviceName}</span>
        </p>
      )}
    </div>
  )
}
