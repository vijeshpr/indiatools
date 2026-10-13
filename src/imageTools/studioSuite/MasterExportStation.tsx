import React from 'react'
import { Download, Film, Disc, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react'

export type ExportBitFormat = '24bit-wav' | '16bit-wav' | 'mp3'

interface MasterExportStationProps {
  selectedFormat: ExportBitFormat
  onFormatChange: (fmt: ExportBitFormat) => void
  onExport: () => void
  isExporting: boolean
  exportProgress: number
  onCancelExport: () => void
  hasAudio: boolean
  sampleRate?: number
}

export const MasterExportStation: React.FC<MasterExportStationProps> = ({
  selectedFormat,
  onFormatChange,
  onExport,
  isExporting,
  exportProgress,
  onCancelExport,
  hasAudio,
  sampleRate = 44100,
}) => {
  const formats: Array<{ id: ExportBitFormat; label: string; sub: string; desc: string }> = [
    { id: '24bit-wav', label: '24-Bit Linear PCM WAV', sub: 'Studio Master Archive', desc: '144 dB dynamic range for streaming distribution & vinyl mastering' },
    { id: '16bit-wav', label: '16-Bit Red Book WAV', sub: 'CD Audio Standard', desc: 'Industry standard 96 dB dynamic range with zero compression artifacts' },
    { id: 'mp3', label: '320 kbps High-Bitrate MP3', sub: 'Lossy Consumer Master', desc: 'Maximum quality MP3 for rapid sharing and client previews' },
  ]

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900/95 to-zinc-950/90 border border-slate-800 p-5 shadow-2xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white tracking-wide">
            Master Audio Export Workstation
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800">
          Sample Rate: {sampleRate} Hz
        </span>
      </div>

      {/* Format Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {formats.map((fmt) => {
          const isSelected = selectedFormat === fmt.id
          return (
            <button
              key={fmt.id}
              type="button"
              onClick={() => onFormatChange(fmt.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">{fmt.label}</span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <div className="text-[10px] text-amber-400/90 font-mono">{fmt.sub}</div>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{fmt.desc}</p>
            </button>
          )
        })}
      </div>

      {/* Progress & Export Action */}
      {isExporting ? (
        <div className="space-y-3 pt-2">
          <div className="flex justify-between text-xs text-amber-400 font-semibold">
            <span>Offline Multi-Stage Master Processing...</span>
            <span className="font-mono">{exportProgress}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-violet-500 transition-all duration-300"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCancelExport}
              className="text-xs text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
            >
              Cancel Rendering
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onExport}
          disabled={!hasAudio}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Render & Download Mastered Audio ({selectedFormat.toUpperCase()})
        </button>
      )}
    </div>
  )
}
