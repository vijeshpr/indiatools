/**
 * 20–300 Hz Focused Sub-Bass Spectrum Visualizer Component
 * Smooth 60fps canvas redraw with glowing energy curves, harmonic overtones, and peak hold.
 */

import React, { useRef, useEffect, useState } from 'react'
import { Activity, Radio, Volume2, Zap } from 'lucide-react'
import { renderSubBassSpectrum } from '../../lib/audio/bassEnhancer/spectrumCanvasRenderer'
import { BassTelemetryMetrics } from '../../lib/audio/bassEnhancer/types'

interface BassSpectrumVisualizerProps {
  analyserNode: AnalyserNode | null
  crossoverHz: number
  subLevel: number
  monoLock: boolean
  isBypassed: boolean
  isPlaying: boolean
}

export const BassSpectrumVisualizer: React.FC<BassSpectrumVisualizerProps> = ({
  analyserNode,
  crossoverHz,
  subLevel,
  monoLock,
  isBypassed,
  isPlaying,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number | null>(null)
  const peakHoldRef = useRef<Float32Array>(new Float32Array(140))

  const [metrics, setMetrics] = useState<BassTelemetryMetrics>({
    subEnergyDb: -70,
    fundamentalHz: 0,
    subOctaveEnergyDb: -70,
    harmonicEnergyDb: -70,
    peakLimitingDb: 0,
    isLimiting: false,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let lastTime = 0

    const drawLoop = (time: number) => {
      if (analyserNode && canvas) {
        // Redraw frame
        const currentMetrics = renderSubBassSpectrum(
          canvas,
          analyserNode,
          peakHoldRef.current,
          crossoverHz,
          subLevel,
          monoLock,
          isBypassed
        )

        // Throttle React state update to ~15fps for performance
        if (time - lastTime > 65) {
          lastTime = time
          setMetrics(currentMetrics)
        }
      }

      animFrameRef.current = requestAnimationFrame(drawLoop)
    }

    animFrameRef.current = requestAnimationFrame(drawLoop)

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [analyserNode, crossoverHz, subLevel, monoLock, isBypassed, isPlaying])

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/5 bg-[#0a0a0b] shadow-2xl flex flex-col">
      {/* Top Telemetry Header */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isPlaying ? 'bg-[#ff2d55] animate-pulse shadow-[0_0_8px_#ff2d55]' : 'bg-slate-700'
            }`}
          />
          <span className="text-xs font-bold text-white tracking-wider uppercase font-mono flex items-center gap-1.5">
            <span>20–300 Hz Sub Spectrum Analyzer</span>
          </span>
        </div>

        {/* Live Telemetry Pills */}
        <div className="flex items-center gap-3 text-[11px] font-mono">
          {/* Sub Energy */}
          <div className="flex items-center gap-1 text-slate-300">
            <span className="text-slate-500">SUB:</span>
            <span className="text-[#ff2d55] font-bold">
              {metrics.subEnergyDb > -65 ? `${metrics.subEnergyDb.toFixed(1)} dB` : '-INF'}
            </span>
          </div>

          {/* Fundamental */}
          {metrics.fundamentalHz > 0 && (
            <div className="hidden sm:flex items-center gap-1 text-slate-300">
              <span className="text-slate-500">PEAK:</span>
              <span className="text-[#ffb800] font-bold">{metrics.fundamentalHz} Hz</span>
            </div>
          )}

          {/* Harmonics */}
          <div className="flex items-center gap-1 text-slate-300">
            <span className="text-slate-500">HARMONICS:</span>
            <span className="text-[#00f0ff] font-bold">
              {metrics.harmonicEnergyDb > -65 ? `${metrics.harmonicEnergyDb.toFixed(1)} dB` : '-INF'}
            </span>
          </div>

          {/* Limiter Active Indicator */}
          {metrics.isLimiting && (
            <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold border border-rose-500/40 animate-pulse">
              LIMITING -{metrics.peakLimitingDb}dB
            </span>
          )}
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative w-full h-[260px] md:h-[320px] bg-black">
        <canvas
          ref={canvasRef}
          width={1000}
          height={320}
          className="w-full h-full object-cover block select-none pointer-events-none"
        />

        {/* Floating Zone Indicator Badges */}
        <div className="absolute bottom-6 left-4 flex items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#ff2d55]/10 border border-[#ff2d55]/20 text-[9px] font-mono text-[#ff2d55]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff2d55]" />
            <span>-1 Octave Synth (20–45Hz)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#ffb800]/10 border border-[#ffb800]/20 text-[9px] font-mono text-[#ffb800]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb800]" />
            <span>Fundamental Band</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-[9px] font-mono text-[#00f0ff]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
            <span>Saturation Overtones</span>
          </div>
        </div>
      </div>
    </div>
  )
}
