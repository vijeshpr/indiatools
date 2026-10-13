import React from 'react'
import { TextDiagnostics } from '../../lib/watermarker/types'
import { X, Search, ShieldCheck, Binary, Copy, Check } from 'lucide-react'

interface CodepointInspectorModalProps {
  isOpen: boolean
  onClose: () => void
  diagnostics: TextDiagnostics
  rawText: string
}

export const CodepointInspectorModal: React.FC<CodepointInspectorModalProps> = ({
  isOpen,
  onClose,
  diagnostics,
  rawText,
}) => {
  const [copied, setCopied] = React.useState(false)

  if (!isOpen) return null

  const handleCopyCodepoints = () => {
    const list = Array.from(rawText).map((c) => {
      const hex = c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')
      return `U+${hex}`
    })
    navigator.clipboard.writeText(list.join(' '))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Binary className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Unicode Codepoint Forensic Inspector
                {diagnostics.hasSteganography && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider font-mono">
                    Steganography Detected
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Live inspection of visible glyphs vs invisible zero-width steganographic tokens
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diagnostic Stats */}
        <div className="grid grid-cols-3 gap-3 my-4">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-0.5">Total Characters</span>
            <span className="text-lg font-mono font-bold text-slate-100">
              {diagnostics.totalChars.toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-0.5">Visible Glyphs</span>
            <span className="text-lg font-mono font-bold text-emerald-400">
              {diagnostics.visibleChars.toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 block mb-0.5">Zero-Width Hidden</span>
            <span className="text-lg font-mono font-bold text-cyan-400">
              {diagnostics.zeroWidthChars.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Codepoint Breakdown Chips */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-slate-300 mb-2">
            Steganographic Zero-Width Character Distribution
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {diagnostics.breakdown.map((item) => (
              <div
                key={item.codePoint}
                className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                  item.count > 0
                    ? 'bg-cyan-950/20 border-cyan-800/40 text-cyan-300'
                    : 'bg-slate-900/40 border-slate-800/60 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono font-semibold">{item.codePoint}</span>
                  <span
                    className={`font-mono px-1.5 py-0.5 rounded text-[10px] ${
                      item.count > 0
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {item.count}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 truncate">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Visualized Hex Stream */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="text-xs font-semibold text-slate-300">
              Raw Stream Preview (First 200 code points)
            </h4>
            <button
              onClick={handleCopyCodepoints}
              className="text-[11px] flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" /> Copied Codepoints
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copy Hex Stream
                </>
              )}
            </button>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] leading-relaxed max-h-40 overflow-y-auto scrollbar-thin">
            {Array.from(rawText)
              .slice(0, 200)
              .map((c, i) => {
                const hex = c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')
                const isZero =
                  c === '\u200B' || c === '\u200C' || c === '\u200D' || c === '\uFEFF'
                return (
                  <span
                    key={i}
                    className={`inline-block mr-1.5 px-1 py-0.5 rounded text-[10px] mb-1 ${
                      isZero
                        ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 font-bold'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                    title={isZero ? `Hidden Zero-Width: U+${hex}` : `Visible: '${c}' (U+${hex})`}
                  >
                    {isZero ? `[${hex}]` : c === ' ' ? '␣' : c}
                  </span>
                )
              })}
            {rawText.length > 200 && (
              <span className="text-slate-600 ml-2">... +{rawText.length - 200} more</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  )
}
