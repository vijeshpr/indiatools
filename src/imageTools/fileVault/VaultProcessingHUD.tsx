import React from 'react'
import {
  Activity,
  Zap,
  Clock,
  HardDrive,
  StopCircle,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Cpu,
} from 'lucide-react'
import { VaultProgressUpdate, VaultMode } from '../../lib/fileVault/types'

interface VaultProcessingHUDProps {
  mode: VaultMode
  isProcessing: boolean
  currentProgress: VaultProgressUpdate | null
  onCancel: () => void
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export const VaultProcessingHUD: React.FC<VaultProcessingHUDProps> = ({
  mode,
  isProcessing,
  currentProgress,
  onCancel,
}) => {
  if (!isProcessing || !currentProgress) return null

  const isEncrypt = mode === 'encrypt'
  const progressPercent =
    currentProgress.totalBytes > 0
      ? Math.min(100, Math.round((currentProgress.bytesProcessed / currentProgress.totalBytes) * 100))
      : 0

  const remainingBytes = Math.max(0, currentProgress.totalBytes - currentProgress.bytesProcessed)
  const etaSec =
    currentProgress.throughputMBps > 0 && remainingBytes > 0
      ? Math.round(remainingBytes / (currentProgress.throughputMBps * 1024 * 1024))
      : null

  return (
    <div className="relative overflow-hidden rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-slate-900/95 via-slate-950 to-slate-900/90 p-6 md:p-8 backdrop-blur-2xl shadow-2xl shadow-cyan-950/40 animate-in fade-in duration-300">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 animate-pulse" />

      <div className="space-y-6">
        {/* Header telemetry strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  {isEncrypt ? 'Active Encryption Pipeline' : 'Authenticated Decryption Pipeline'}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              </div>
              <h4 className="text-sm font-semibold text-slate-100 truncate max-w-md">
                {currentProgress.itemId}
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-300 transition-all hover:bg-rose-500/20 active:scale-95 cursor-pointer"
          >
            <StopCircle className="h-4 w-4" />
            <span>Abort Operation</span>
          </button>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-semibold">
            <span className="text-slate-300">
              {currentProgress.statusMessage || 'Processing stream...'}
            </span>
            <span className={isEncrypt ? 'text-cyan-400' : 'text-emerald-400'}>
              {progressPercent}%
            </span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-950 border border-slate-800 shadow-inner">
            <div
              className={`h-full transition-all duration-200 rounded-full ${
                isEncrypt
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-400'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Real-time HUD Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono text-center">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              <span>Throughput</span>
            </div>
            <div className="text-sm font-bold text-slate-100">
              {currentProgress.throughputMBps > 0
                ? `${currentProgress.throughputMBps} MB/s`
                : 'Measuring...'}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <HardDrive className="h-3.5 w-3.5 text-emerald-400" />
              <span>Processed</span>
            </div>
            <div className="text-sm font-bold text-slate-100">
              {formatBytes(currentProgress.bytesProcessed)} / {formatBytes(currentProgress.totalBytes)}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <Cpu className="h-3.5 w-3.5 text-amber-400" />
              <span>Chunk Counter</span>
            </div>
            <div className="text-sm font-bold text-slate-100">
              {currentProgress.chunksProcessed} / {currentProgress.totalChunks}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <Clock className="h-3.5 w-3.5 text-violet-400" />
              <span>Elapsed / ETA</span>
            </div>
            <div className="text-sm font-bold text-slate-100">
              {formatDuration(currentProgress.elapsedMs)} {etaSec !== null ? `/ ~${etaSec}s` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
