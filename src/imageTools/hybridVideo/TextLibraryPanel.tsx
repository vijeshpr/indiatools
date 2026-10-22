import React from 'react'
import { Type, Plus, Sparkles } from 'lucide-react'
import { TITLE_STYLE_PRESETS, type TextTitlePresetDef } from '../../lib/hybridVideo/textOverlayEngine.ts'
import type { ClipTextProperties } from '../../lib/hybridVideo/types.ts'

interface TextLibraryPanelProps {
  onAddTextClip: (textProps: ClipTextProperties) => void
}

export const TextLibraryPanel: React.FC<TextLibraryPanelProps> = ({ onAddTextClip }) => {
  return (
    <div className="flex flex-col h-full bg-[#0D111A] text-white">
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
            <Type className="w-4 h-4 text-cyan-400" />
            Motion Titles & Typography
          </h3>
          <p className="text-[11px] text-white/40 mt-0.5">
            Click to add customizable text overlays to your timeline
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {TITLE_STYLE_PRESETS.map((preset: TextTitlePresetDef) => (
          <div
            key={preset.id}
            className="group p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col gap-2"
          >
            {/* Visual Mini Preview Box */}
            <div className="h-16 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center p-2 text-center overflow-hidden relative">
              <span
                style={{
                  fontFamily: preset.props.fontFamily,
                  fontSize: Math.min(22, preset.props.fontSize * 0.35),
                  fontWeight: preset.props.fontWeight,
                  color: preset.props.color,
                  textShadow: preset.props.shadowBlur ? `${preset.props.shadowOffsetX}px ${preset.props.shadowOffsetY}px ${preset.props.shadowBlur * 0.4}px ${preset.props.shadowColor}` : 'none',
                  backgroundColor: preset.props.backgroundColor || 'transparent',
                  padding: preset.props.backgroundColor ? '4px 8px' : '0',
                  borderRadius: preset.props.backgroundRadius ? '4px' : '0',
                }}
                className="truncate max-w-full"
              >
                {preset.props.text}
              </span>
            </div>

            {/* Title & Description */}
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-medium text-white/90">{preset.name}</p>
                <p className="text-[10px] text-white/40 truncate">{preset.description}</p>
              </div>

              <button
                type="button"
                onClick={() => onAddTextClip({ ...preset.props })}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 text-xs font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
