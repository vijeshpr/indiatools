import React from 'react'
import {
  Layers,
  Move,
  Maximize2,
  RotateCw,
  Eye,
  Volume2,
  VolumeX,
  Type,
  Key,
  Trash2,
  Copy,
  Clock,
  Gauge,
  Sliders,
  Sparkles,
  Circle,
} from 'lucide-react'
import type {
  TimelineClip,
  ClipTransform,
  FitMode,
  CircularPipConfig,
} from '../../lib/hybridVideo/types.ts'
import { DEFAULT_CIRCULAR_PIP } from '../../lib/hybridVideo/types.ts'

interface PropertiesPanelProps {
  selectedClip: TimelineClip | null
  playheadSec: number
  onUpdateClip: (clipId: string, updates: Partial<TimelineClip>) => void
  onDeleteClip: (clipId: string) => void
  onDuplicateClip: (clip: TimelineClip) => void
  onAddKeyframe: (clipId: string, timeSec: number) => void
  onRemoveKeyframe: (clipId: string, keyframeId: string) => void
  onMoveClipLayer?: (clipId: string, direction: 'forward' | 'backward') => void
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedClip,
  playheadSec,
  onUpdateClip,
  onDeleteClip,
  onDuplicateClip,
  onAddKeyframe,
  onRemoveKeyframe,
  onMoveClipLayer,
}) => {
  if (!selectedClip) {
    return (
      <div className="h-full bg-[#0D111A] text-white/40 flex flex-col items-center justify-center p-6 text-center select-none border-l border-white/10">
        <Layers className="w-8 h-8 mb-2 stroke-[1.5] text-white/20" />
        <p className="text-xs font-medium text-white/60">No Clip Selected</p>
        <p className="text-[11px] text-white/30 mt-1 max-w-[180px]">
          Click any clip on the timeline to inspect and edit its properties
        </p>
      </div>
    )
  }

  const updateTransform = (key: keyof ClipTransform, value: any) => {
    onUpdateClip(selectedClip.id, {
      transform: {
        ...selectedClip.transform,
        [key]: value,
      },
    })
  }

  const updateAudio = (key: keyof TimelineClip['audioProps'], value: any) => {
    onUpdateClip(selectedClip.id, {
      audioProps: {
        ...selectedClip.audioProps,
        [key]: value,
      },
    })
  }

  const updateText = (key: keyof NonNullable<TimelineClip['textProps']>, value: any) => {
    if (!selectedClip.textProps) return
    onUpdateClip(selectedClip.id, {
      textProps: {
        ...selectedClip.textProps,
        [key]: value,
      },
    })
  }

  const updatePip = (key: keyof CircularPipConfig, value: any) => {
    const currentPip = selectedClip.circularPip || { ...DEFAULT_CIRCULAR_PIP }
    onUpdateClip(selectedClip.id, {
      circularPip: {
        ...currentPip,
        [key]: value,
      },
    })
  }

  const updatePipConfig = (updates: Partial<CircularPipConfig>) => {
    const currentPip = selectedClip.circularPip || { ...DEFAULT_CIRCULAR_PIP }
    onUpdateClip(selectedClip.id, {
      circularPip: {
        ...currentPip,
        ...updates,
      },
    })
  }

  const clipRelTime = Math.max(0, playheadSec - selectedClip.startSec)
  const isPlayheadInsideClip =
    playheadSec >= selectedClip.startSec && playheadSec <= selectedClip.startSec + selectedClip.durationSec

  return (
    <div className="flex flex-col h-full bg-[#0D111A] text-white border-l border-white/10 select-none">
      {/* Header */}
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <div className="min-w-0">
          <input
            type="text"
            value={selectedClip.name}
            onChange={(e) => onUpdateClip(selectedClip.id, { name: e.target.value })}
            className="text-xs font-semibold text-white bg-transparent hover:bg-white/5 focus:bg-black/40 border border-transparent hover:border-white/10 focus:border-cyan-500/40 rounded px-1.5 py-0.5 truncate focus:outline-none w-full"
          />
          <div className="text-[10px] text-white/40 mt-0.5 px-1.5 flex items-center gap-2">
            <span className="uppercase font-bold text-cyan-400">{selectedClip.type}</span>
            <span>•</span>
            <span>{selectedClip.durationSec.toFixed(2)}s duration</span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            title="Duplicate clip"
            onClick={() => onDuplicateClip(selectedClip)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Delete clip"
            onClick={() => onDeleteClip(selectedClip.id)}
            className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Music Sync Diagnostic Explanation */}
        {selectedClip.cutReason && (
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/25 text-xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-300 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Music Sync Diagnostic</span>
            </div>
            <p className="text-[11px] text-white/80 leading-relaxed font-mono">
              {selectedClip.cutReason}
            </p>
          </div>
        )}

        {/* Transform Card */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
          <label className="text-[11px] font-semibold text-white/70 uppercase tracking-wider block flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-cyan-400" />
            Transform & Layout
          </label>

          {/* Fit Mode */}
          <div className="grid grid-cols-4 gap-1">
            {(['fit', 'fill', 'stretch', 'original'] as FitMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => updateTransform('fitMode', mode)}
                className={`py-1 rounded text-[10px] font-medium uppercase transition-colors ${
                  selectedClip.transform.fitMode === mode
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Scale Slider */}
          <div>
            <div className="flex justify-between text-xs text-white/80 mb-1">
              <span>Scale</span>
              <span className="font-mono text-cyan-300">{Math.round(selectedClip.transform.scale * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={3.0}
              step={0.05}
              value={selectedClip.transform.scale}
              onChange={(e) => updateTransform('scale', Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>

          {/* Opacity Slider */}
          <div>
            <div className="flex justify-between text-xs text-white/80 mb-1">
              <span>Opacity</span>
              <span className="font-mono text-cyan-300">{Math.round(selectedClip.transform.opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={selectedClip.transform.opacity}
              onChange={(e) => updateTransform('opacity', Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>

          {/* Position X / Y */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-white/50 block mb-1">Offset X (px)</span>
              <input
                type="number"
                value={Math.round(selectedClip.transform.x)}
                onChange={(e) => updateTransform('x', Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <span className="text-[10px] text-white/50 block mb-1">Offset Y (px)</span>
              <input
                type="number"
                value={Math.round(selectedClip.transform.y)}
                onChange={(e) => updateTransform('y', Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Rotation */}
          <div>
            <div className="flex justify-between text-xs text-white/80 mb-1">
              <span>Rotation</span>
              <span className="font-mono text-cyan-300">{selectedClip.transform.rotationDeg}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              value={selectedClip.transform.rotationDeg}
              onChange={(e) => updateTransform('rotationDeg', Number(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Circular PiP / Reaction Video Mode Card */}
        {(selectedClip.type === 'video' || selectedClip.type === 'image') && (
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="p-1 rounded-md bg-cyan-500/10 text-cyan-400">
                  <Circle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white/95">Circular PiP Mode</span>
                  <span className="text-[10px] text-white/40 block">Reaction Video / Face Cam</span>
                </div>
              </div>

              {/* Enable Toggle Switch */}
              <input
                type="checkbox"
                checked={!!selectedClip.circularPip?.enabled}
                onChange={(e) => updatePip('enabled', e.target.checked)}
                className="accent-cyan-400 cursor-pointer w-4 h-4 rounded"
                title="Enable / Disable Circular PiP Masking"
              />
            </div>

            {selectedClip.circularPip?.enabled && (
              <div className="space-y-3 pt-2 border-t border-white/5">
                {/* Position Presets */}
                <div>
                  <span className="text-[10px] text-white/50 block mb-1.5 font-medium uppercase tracking-wider">
                    Preset Position
                  </span>
                  <div className="grid grid-cols-5 gap-1 text-[10px]">
                    {[
                      { id: 'top-left', label: 'Top-L' },
                      { id: 'top-right', label: 'Top-R' },
                      { id: 'center', label: 'Center' },
                      { id: 'bottom-left', label: 'Btm-L' },
                      { id: 'bottom-right', label: 'Btm-R' },
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          updatePipConfig({
                            positionPreset: preset.id as any,
                            offsetX: 0,
                            offsetY: 0,
                          })
                        }}
                        className={`py-1.5 px-1 rounded text-center font-medium transition-colors ${
                          selectedClip.circularPip?.positionPreset === preset.id
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-white/[0.02] text-white/60 hover:text-white'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Circle Size Slider */}
                <div>
                  <div className="flex justify-between text-xs text-white/80 mb-1">
                    <span>Circle Size</span>
                    <span className="font-mono text-cyan-300">
                      {selectedClip.circularPip?.sizePercent ?? 28}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={12}
                    max={55}
                    step={1}
                    value={selectedClip.circularPip?.sizePercent ?? 28}
                    onChange={(e) => updatePip('sizePercent', Number(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Fine-tune Position X & Y */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-white/50 block mb-1">Fine-tune X (px)</span>
                    <input
                      type="number"
                      value={selectedClip.circularPip?.offsetX ?? 0}
                      onChange={(e) => updatePip('offsetX', Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-white/50 block mb-1">Fine-tune Y (px)</span>
                    <input
                      type="number"
                      value={selectedClip.circularPip?.offsetY ?? 0}
                      onChange={(e) => updatePip('offsetY', Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Border Width & Color */}
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-white/80 mb-1">
                      <span>Border Width</span>
                      <span className="font-mono text-cyan-300">
                        {selectedClip.circularPip?.borderWidth ?? 3.5}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={12}
                      step={0.5}
                      value={selectedClip.circularPip?.borderWidth ?? 3.5}
                      onChange={(e) => updatePip('borderWidth', Number(e.target.value))}
                      className="w-full accent-cyan-400 h-1 bg-white/10 rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-white/50 block mb-1">Border Color</span>
                    <div className="flex items-center gap-1.5">
                      {['#FFFFFF', '#00F0FF', '#F59E0B', '#EC4899', '#10B981', '#000000'].map(
                        (color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => updatePip('borderColor', color)}
                            className={`w-6 h-6 rounded-full border transition-all ${
                              (selectedClip.circularPip?.borderColor || '#FFFFFF') === color
                                ? 'scale-110 border-white ring-2 ring-cyan-400'
                                : 'border-white/20 hover:scale-105'
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        )
                      )}
                      <input
                        type="color"
                        value={selectedClip.circularPip?.borderColor || '#FFFFFF'}
                        onChange={(e) => updatePip('borderColor', e.target.value)}
                        className="w-6 h-6 rounded border border-white/20 bg-transparent cursor-pointer p-0 ml-1"
                        title="Custom color picker"
                      />
                    </div>
                  </div>
                </div>

                {/* Drop Shadow Controls */}
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-white/80 mb-1">
                      <span>Drop Shadow Intensity</span>
                      <span className="font-mono text-cyan-300">
                        {Math.round((selectedClip.circularPip?.shadowIntensity ?? 0.45) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={selectedClip.circularPip?.shadowIntensity ?? 0.45}
                      onChange={(e) => updatePip('shadowIntensity', Number(e.target.value))}
                      className="w-full accent-cyan-400 h-1 bg-white/10 rounded cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-white/50 block mb-1">Shadow Blur</span>
                      <input
                        type="number"
                        min={0}
                        max={40}
                        value={selectedClip.circularPip?.shadowBlur ?? 16}
                        onChange={(e) => updatePip('shadowBlur', Number(e.target.value))}
                        className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-white/50 block mb-1">Shadow Offset Y</span>
                      <input
                        type="number"
                        min={-20}
                        max={30}
                        value={selectedClip.circularPip?.shadowOffsetY ?? 8}
                        onChange={(e) => updatePip('shadowOffsetY', Number(e.target.value))}
                        className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Fit Mode (Cover vs Contain) */}
                <div>
                  <span className="text-[10px] text-white/50 block mb-1 font-medium">Fit Mode</span>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => updatePip('fitMode', 'cover')}
                      className={`py-1.5 rounded font-medium transition-colors ${
                        (selectedClip.circularPip?.fitMode || 'cover') === 'cover'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-white/[0.02] text-white/60 hover:text-white'
                      }`}
                    >
                      Cover (Crop 1:1)
                    </button>
                    <button
                      type="button"
                      onClick={() => updatePip('fitMode', 'contain')}
                      className={`py-1.5 rounded font-medium transition-colors ${
                        selectedClip.circularPip?.fitMode === 'contain'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-white/[0.02] text-white/60 hover:text-white'
                      }`}
                    >
                      Contain (Letterbox)
                    </button>
                  </div>
                </div>

                {/* Layer Ordering & Reset */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                  {onMoveClipLayer && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onMoveClipLayer(selectedClip.id, 'forward')}
                        className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-white/80"
                        title="Bring PiP clip forward in layer order"
                      >
                        Bring Forward
                      </button>
                      <button
                        type="button"
                        onClick={() => onMoveClipLayer(selectedClip.id, 'backward')}
                        className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[10px] text-white/80"
                        title="Send PiP clip backward in layer order"
                      >
                        Send Back
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      updatePipConfig({
                        ...DEFAULT_CIRCULAR_PIP,
                        enabled: true,
                      })
                    }}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 underline ml-auto"
                  >
                    Reset PiP
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Text Properties (if text clip) */}
        {selectedClip.type === 'text' && selectedClip.textProps && (
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
            <label className="text-[11px] font-semibold text-white/70 uppercase tracking-wider block flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-cyan-400" />
              Text Content & Style
            </label>

            <textarea
              rows={2}
              value={selectedClip.textProps.text}
              onChange={(e) => updateText('text', e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-2 text-xs text-white focus:border-cyan-400 focus:outline-none resize-none font-medium"
              placeholder="Enter text overlay..."
            />

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-white/50 block mb-1">Font Size</span>
                <input
                  type="number"
                  min={12}
                  max={200}
                  value={selectedClip.textProps.fontSize}
                  onChange={(e) => updateText('fontSize', Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white font-mono"
                />
              </div>

              <div>
                <span className="text-[10px] text-white/50 block mb-1">Color</span>
                <input
                  type="color"
                  value={selectedClip.textProps.color}
                  onChange={(e) => updateText('color', e.target.value)}
                  className="w-full h-7 bg-black/40 border border-white/10 rounded cursor-pointer p-0.5"
                />
              </div>
            </div>

            <div>
              <span className="text-[10px] text-white/50 block mb-1">Motion Animation</span>
              <select
                value={selectedClip.textProps.animation}
                onChange={(e) => updateText('animation', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="none">None (Static)</option>
                <option value="fade">Smooth Fade In/Out</option>
                <option value="slide-up">Slide Up</option>
                <option value="slide-down">Slide Down</option>
                <option value="pop-scale">Pop Scale Zoom</option>
                <option value="typewriter">Typewriter Lettering</option>
              </select>
            </div>
          </div>
        )}

        {/* Audio Properties (for audio or video clips) */}
        {(selectedClip.type === 'audio' || selectedClip.type === 'video') && (
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-violet-400" />
                Audio & Fades
              </label>

              <button
                type="button"
                onClick={() => updateAudio('muted', !selectedClip.audioProps.muted)}
                className={`p-1 rounded text-xs transition-colors ${
                  selectedClip.audioProps.muted ? 'bg-red-500/20 text-red-400' : 'text-white/60 hover:text-white'
                }`}
              >
                {selectedClip.audioProps.muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div>
              <div className="flex justify-between text-xs text-white/80 mb-1">
                <span>Clip Volume</span>
                <span className="font-mono text-cyan-300">{Math.round(selectedClip.audioProps.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={selectedClip.audioProps.volume}
                disabled={selectedClip.audioProps.muted}
                onChange={(e) => updateAudio('volume', Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-white/10 rounded-lg cursor-pointer disabled:opacity-30"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-white/50 block mb-1">Fade In (sec)</span>
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.2}
                  value={selectedClip.audioProps.fadeInSec}
                  onChange={(e) => updateAudio('fadeInSec', Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-white/50 block mb-1">Fade Out (sec)</span>
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.2}
                  value={selectedClip.audioProps.fadeOutSec}
                  onChange={(e) => updateAudio('fadeOutSec', Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Keyframe Animation Section */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              Keyframes ({selectedClip.keyframes?.length || 0})
            </label>

            <button
              type="button"
              disabled={!isPlayheadInsideClip}
              onClick={() => onAddKeyframe(selectedClip.id, clipRelTime)}
              className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 disabled:opacity-30 text-[10px] font-semibold transition-colors"
            >
              + Add Keyframe
            </button>
          </div>

          <p className="text-[10px] text-white/40">
            Animates position, scale, rotation, and opacity at specific moments.
          </p>

          {selectedClip.keyframes && selectedClip.keyframes.length > 0 && (
            <div className="space-y-1 mt-2">
              {selectedClip.keyframes.map((kf, idx) => (
                <div
                  key={kf.id}
                  className="flex items-center justify-between px-2 py-1 rounded bg-black/40 border border-white/5 text-[11px]"
                >
                  <span className="font-mono text-amber-300">
                    KF #{idx + 1} @ {kf.timeSec.toFixed(2)}s
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveKeyframe(selectedClip.id, kf.id)}
                    className="text-white/40 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
