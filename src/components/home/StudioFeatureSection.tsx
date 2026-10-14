import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Volume2,
  Headphones,
  Sparkles,
  Radio,
  Sliders,
  ArrowRight,
  Disc,
  Activity,
  CheckCircle2,
} from 'lucide-react'

export const StudioFeatureSection: React.FC = () => {
  const [activeFrequency, setActiveFrequency] = useState(2)

  const frequencies = [
    { label: 'Sub Bass', val: '40 Hz', color: '#A855F7' },
    { label: 'Punch', val: '120 Hz', color: '#8B5CF6' },
    { label: 'Warmth', val: '500 Hz', color: '#06B6D4' },
    { label: 'Vocal Air', val: '2.5 kHz', color: '#10B981' },
    { label: 'Brilliance', val: '12 kHz', color: '#F59E0B' },
  ]

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="rounded-3xl bg-gradient-to-br from-[#0F1E28] via-[#09151D] to-[#050D12] border border-cyan-500/25 p-8 sm:p-12 lg:p-14 shadow-2xl shadow-cyan-950/40 relative overflow-hidden">
        {/* Soft Ambient Studio Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Column: Context & Audio Capabilities */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                <Headphones className="w-3.5 h-3.5" />
                <span>STUDIO & SOUND LAB</span>
              </span>
              <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30">
                8D AUDIO SPATIALIZER
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Binaural 8D Audio & Sound Mastering in Your Browser
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-2xl">
              Turn ordinary stereo music, podcasts, and field recordings into immersive 360-degree orbital soundscapes.
              Simulate acoustic head rotation, enhance sub-harmonic bass frequencies, and export master-quality 48kHz WAV audio with zero cloud processing.
            </p>

            {/* Interactive Frequency Slices */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 block">
                Interactive Frequency Mastering Engine:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {frequencies.map((f, i) => (
                  <button
                    key={f.label}
                    type="button"
                    onClick={() => setActiveFrequency(i)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      activeFrequency === i
                        ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg'
                        : 'bg-black/30 border-white/10 text-slate-400 hover:border-cyan-500/30'
                    }`}
                  >
                    <span className="text-[10px] font-mono block text-slate-400">{f.val}</span>
                    <span className="text-xs font-bold block truncate">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/tools/orbit-audio-studio"
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-cyan-950/60 transition-all cursor-pointer group hover:scale-[1.02]"
              >
                <Disc className="w-4 h-4" />
                <span>Open Orbit Audio Studio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>

              <Link
                to="/tools/studio-master-spatial-suite"
                className="px-6 py-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-white font-semibold text-sm border border-cyan-500/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-cyan-300" />
                <span>Spatial Master Suite</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Audio Reactive Orbit Specimen Visualizer */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-3xl bg-[#071116] border border-cyan-500/30 p-6 shadow-2xl relative select-none">
              <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20 text-xs font-mono">
                <span className="text-cyan-300 font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>360° ORBIT RADAR</span>
                </span>
                <span className="text-slate-400">48kHz / 32-bit float</span>
              </div>

              {/* Orbital Head Position Simulator */}
              <div className="py-6 flex items-center justify-center relative">
                <div className="w-44 h-44 rounded-full border border-dashed border-cyan-500/30 relative flex items-center justify-center animate-[spin_16s_linear_infinite]">
                  {/* Rotating Audio Node */}
                  <div className="absolute -top-3 w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 shadow-lg shadow-cyan-400/50 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  {/* Opposite Audio Node */}
                  <div className="absolute -bottom-3 w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>

                {/* Central Listener Head */}
                <div className="absolute w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 flex flex-col items-center justify-center shadow-inner">
                  <Headphones className="w-7 h-7 text-cyan-300" />
                  <span className="text-[9px] font-mono text-cyan-300 font-bold mt-0.5">LISTENER</span>
                </div>
              </div>

              {/* Dynamic Oscilloscope Bars */}
              <div className="pt-2 flex items-end justify-between gap-1 h-12 px-2">
                {[35, 60, 85, 45, 95, 70, 50, 80, 65, 90, 40, 75, 55, 85, 60, 45].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [`${h * 0.4}%`, `${h}%`, `${h * 0.5}%`] }}
                    transition={{
                      duration: 0.8 + (i % 4) * 0.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="w-1.5 rounded-full bg-gradient-to-t from-cyan-500 to-purple-400"
                  />
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-cyan-500/15 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Web Audio PannerNode</span>
                <span className="text-cyan-400 font-semibold">Zero Latency</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
