import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Film,
  Volume2,
  FileText,
  Download,
  Play,
  Pause,
  Video,
  Radio,
  Sparkles,
  Sliders,
  Check,
  Disc,
} from 'lucide-react'

type AssetTab = 'luts' | 'audio' | 'sfx' | 'overlays' | 'templates'

interface LutAsset {
  id: string
  name: string
  format: string
  size: string
  license: string
  description: string
  beforeFilter: string
  afterFilter: string
  cubeData: string
}

interface AudioAsset {
  id: string
  name: string
  format: string
  duration: string
  size: string
  license: string
  decay: string
  description: string
  frequency: number
}

interface SfxAsset {
  id: string
  name: string
  category: string
  duration: string
  format: string
  size: string
  license: string
  description: string
  frequency: number
  soundType: 'sub' | 'ambient' | 'transient'
}

interface OverlayAsset {
  id: string
  name: string
  aspectRatio: string
  format: string
  size: string
  license: string
  description: string
  blendMode: string
  svgContent: string
}

interface TemplateAsset {
  id: string
  name: string
  format: string
  size: string
  license: string
  description: string
  category: string
  templateContent: string
}

const LUTS_DATA: LutAsset[] = [
  {
    id: 'monsoon-teal',
    name: 'Monsoon Teal & Orange',
    format: '.CUBE (33x33x33)',
    size: '1.2 MB',
    license: 'Creative Commons CC-BY 4.0',
    description: 'High-contrast cinematic look tailored for tropical greenery and natural skin tones.',
    beforeFilter: 'contrast(100%) saturate(100%)',
    afterFilter: 'contrast(125%) saturate(135%) hue-rotate(-12deg) sepia(15%)',
    cubeData: '# LUT: Monsoon Teal & Orange\nTITLE "Monsoon Teal & Orange"\nLUT_3D_SIZE 2\n0.0 0.0 0.0\n1.0 0.8 0.7\n',
  },
  {
    id: 'western-ghats',
    name: 'Western Ghats Lush Forest',
    format: '.CUBE (33x33x33)',
    size: '1.1 MB',
    license: 'CC0 Public Domain',
    description: 'Deep verdant foliage greens and soft shadow mist roll-off for nature & drone cinematography.',
    beforeFilter: 'contrast(100%) saturate(100%)',
    afterFilter: 'contrast(115%) saturate(140%) brightness(95%) hue-rotate(8deg)',
    cubeData: '# LUT: Western Ghats Lush Forest\nTITLE "Western Ghats Lush Forest"\nLUT_3D_SIZE 2\n0.0 0.0 0.0\n0.8 1.0 0.85\n',
  },
  {
    id: 'kerala-golden-hour',
    name: 'Kerala Sunset Nostalgia',
    format: '.CUBE (33x33x33)',
    size: '1.2 MB',
    license: 'Creative Commons CC-BY 4.0',
    description: 'Warm 3200K Kodak 2383 vintage print emulation with soft amber highlights.',
    beforeFilter: 'contrast(100%) saturate(100%)',
    afterFilter: 'contrast(110%) saturate(125%) sepia(35%) hue-rotate(-8deg)',
    cubeData: '# LUT: Kerala Sunset Nostalgia\nTITLE "Kerala Sunset Nostalgia"\nLUT_3D_SIZE 2\n0.0 0.0 0.0\n1.0 0.9 0.65\n',
  },
]

const AUDIO_DATA: AudioAsset[] = [
  {
    id: 'kochi-heritage-hall',
    name: 'Kochi Heritage Hall Acoustic IR',
    format: '24-bit 48kHz WAV',
    duration: '2.4s',
    decay: '2.4s RT60',
    size: '460 KB',
    license: 'Free Creative Commons',
    description: 'Acoustic impulse response recorded in a historical high-ceiling colonial teakwood hall.',
    frequency: 440,
  },
  {
    id: 'studio-plate-reverb',
    name: 'High-End Studio Plate IR',
    format: '24-bit 96kHz WAV',
    duration: '1.8s',
    decay: '1.8s RT60',
    size: '620 KB',
    license: 'CC0 Public Domain',
    description: 'Ultra-dense mechanical plate reverb impulse designed for vocal clarity and drums.',
    frequency: 523.25,
  },
  {
    id: 'teakwood-chamber',
    name: 'Warm Teakwood Chamber IR',
    format: '24-bit 48kHz WAV',
    duration: '1.2s',
    decay: '1.2s RT60',
    size: '380 KB',
    license: 'Open Acoustic License',
    description: 'Short tight acoustic decay with rich natural mid-frequency wood resonance.',
    frequency: 329.63,
  },
]

const SFX_DATA: SfxAsset[] = [
  {
    id: 'cinematic-sub-boom',
    name: 'Cinematic Low Sub Boom',
    category: 'Bass & Impact',
    duration: '2.8s',
    format: '24-bit 48kHz WAV',
    size: '380 KB',
    license: 'CC0 Public Domain',
    description: 'Clean sub-harmonic 35Hz impact trailer boom with natural analog low-end decay.',
    frequency: 35,
    soundType: 'sub',
  },
  {
    id: 'western-ghats-rain',
    name: 'Western Ghats Forest Canopy Ambience',
    category: 'Nature & Atmosphere',
    duration: '15.0s',
    format: '24-bit 48kHz WAV',
    size: '1.4 MB',
    license: 'Creative Commons CC-BY',
    description: 'Dense organic rainforest rustle with distant monsoon thunder and delicate drops.',
    frequency: 320,
    soundType: 'ambient',
  },
  {
    id: 'mechanical-shutter',
    name: 'Precision Mechanical Shutter Click',
    category: 'Foley & Interface',
    duration: '0.4s',
    format: '24-bit 96kHz WAV',
    size: '95 KB',
    license: 'MIT License',
    description: 'Crisp tactile SLR camera shutter mechanism with instant transient response.',
    frequency: 880,
    soundType: 'transient',
  },
]

const OVERLAYS_DATA: OverlayAsset[] = [
  {
    id: 'film-grain-35mm',
    name: '35mm Fine Film Grain Overlay',
    aspectRatio: '16:9 & 4K',
    format: 'Vector SVG & PNG Matte',
    size: '320 KB',
    license: 'CC0 Public Domain',
    description: 'Photographic optical film grain texture to add authentic organic texture to digital video.',
    blendMode: 'Overlay / Soft Light',
    svgContent: '<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="n"/><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.18 0"/></filter><rect width="100%" height="100%" filter="url(#g)" fill="#808080"/></svg>',
  },
  {
    id: 'cinemascope-letterbox',
    name: '2.39:1 CinemaScope Letterbox Matte',
    aspectRatio: '2.39:1 Anamorphic',
    format: 'Vector SVG & Lossless PNG',
    size: '12 KB',
    license: 'MIT License',
    description: 'Pixel-accurate 2.39:1 widescreen theatrical matte bars for 1080p and 4K footage.',
    blendMode: 'Normal (Direct Alpha)',
    svgContent: '<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><rect width="1920" height="138" fill="#000000"/><rect y="942" width="1920" height="138" fill="#000000"/></svg>',
  },
  {
    id: 'anamorphic-lens-flare',
    name: 'Warm Golden Anamorphic Streak',
    aspectRatio: 'Wide 2.39:1',
    format: 'Vector SVG Matte',
    size: '45 KB',
    license: 'Creative Commons CC-BY',
    description: 'Subtle horizontal gold anamorphic streak with natural fall-off for cinema grading.',
    blendMode: 'Screen / Add',
    svgContent: '<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><defs><linearGradient id="l" x1="0%" y1="50%" x2="100%" y2="50%"><stop offset="0%" stop-color="#D8B879" stop-opacity="0"/><stop offset="50%" stop-color="#F3F0E5" stop-opacity="0.85"/><stop offset="100%" stop-color="#D8B879" stop-opacity="0"/></linearGradient></defs><ellipse cx="960" cy="540" rx="900" ry="12" fill="url(#l)"/></svg>',
  },
]

const TEMPLATES_DATA: TemplateAsset[] = [
  {
    id: 'engineering-resume',
    name: 'Engineering Minimalist Resume',
    format: 'LaTeX & Clean HTML',
    size: '42 KB',
    license: 'MIT License',
    description: 'ATS-optimized single-page software engineer resume layout with zero parse errors.',
    category: 'Developer & Career',
    templateContent: '% IndiaTools ATS Resume Template\n\\documentclass{article}\n\\begin{document}\n\\textbf{Your Name} - Senior Software Engineer\n\\end{document}',
  },
  {
    id: 'civil-boq',
    name: 'Civil Contractor Bill of Quantities (BOQ)',
    format: 'CSV / HTML Spreadsheet',
    size: '34 KB',
    license: 'MIT License',
    description: 'Turnkey residential civil construction estimate format conforming to CPWD norms.',
    category: 'Construction & Civil',
    templateContent: 'Item No,Description,Unit,Quantity,Rate (INR),Total (INR)\n1,Excavation in earthwork,cum,120,450,54000\n2,PCC 1:4:8 base,cum,35,4200,147000',
  },
  {
    id: 'gst-invoice',
    name: 'Freelancer GST Tax Invoice Specimen',
    format: 'HTML5 & Vector SVG',
    size: '28 KB',
    license: 'MIT License',
    description: 'Compliant Indian GST invoice template with SAC code and CGST/SGST/IGST breakdown.',
    category: 'Finance & Invoicing',
    templateContent: '<!DOCTYPE html><html><body><h1>TAX INVOICE</h1><p>GSTIN: 32AAAAA0000A1Z5</p></body></html>',
  },
]

export const AssetHubSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AssetTab>('luts')
  const [activeLutSlider, setActiveLutSlider] = useState<Record<string, number>>({
    'monsoon-teal': 50,
    'western-ghats': 50,
    'kerala-golden-hour': 50,
  })
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Real Web Audio synthesis audition player (strictly no autoplay)
  const handlePlaySound = (id: string, frequency: number, soundType = 'standard') => {
    if (playingAudioId === id) {
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
      setPlayingAudioId(null)
      return
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new AudioCtx()
      audioContextRef.current = ctx

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      if (soundType === 'sub') {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(frequency, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(18, ctx.currentTime + 2.2)
        gain.gain.setValueAtTime(0.5, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2)
        osc.stop(ctx.currentTime + 2.2)
      } else if (soundType === 'transient') {
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(frequency, ctx.currentTime)
        gain.gain.setValueAtTime(0.4, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35)
        osc.stop(ctx.currentTime + 0.35)
      } else {
        // Acoustic IR chirp / reverb decay
        osc.type = 'sine'
        osc.frequency.setValueAtTime(frequency, ctx.currentTime)
        gain.gain.setValueAtTime(0.35, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8)
        osc.stop(ctx.currentTime + 1.8)
      }

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      setPlayingAudioId(id)

      osc.onended = () => {
        setPlayingAudioId(null)
        ctx.close().catch(() => {})
      }
    } catch {
      setPlayingAudioId(null)
    }
  }

  // Trigger verified local file download
  const handleDownload = (filename: string, content: string, mimeType = 'text/plain') => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <section id="creative-assets" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {/* Subtle Botanical Amber Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] bg-[#D8B879]/8 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#10271C] border border-[#D8B879]/30 text-[#D8B879] text-xs font-mono font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#D8B879]" />
          <span>Curated Creator Assets & Presets</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-[#F3F0E5] tracking-tight">
          Creative assets. Ready for your next project.
        </h2>

        <p className="text-[#A8C5AC] text-sm sm:text-base leading-relaxed">
          Explore cinematic LUTs, studio impulse responses, sound effects, video overlays, and practical templates in one place.
        </p>
      </div>

      {/* Collection Navigation Tabs (Fonts strictly excluded!) */}
      <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab('luts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'luts'
              ? 'bg-[#16865D] text-[#F3F0E5] shadow-lg shadow-emerald-950/40 border border-[#D8B879]/40'
              : 'bg-[#10271C]/90 text-[#A8C5AC] hover:text-[#F3F0E5] border border-emerald-500/20'
          }`}
        >
          <Film className="w-4 h-4 text-[#D8B879]" />
          <span>Cinematic .CUBE LUTs</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audio')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'audio'
              ? 'bg-[#16865D] text-[#F3F0E5] shadow-lg shadow-emerald-950/40 border border-[#D8B879]/40'
              : 'bg-[#10271C]/90 text-[#A8C5AC] hover:text-[#F3F0E5] border border-emerald-500/20'
          }`}
        >
          <Volume2 className="w-4 h-4 text-[#D8B879]" />
          <span>Studio Audio & IRs</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sfx')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'sfx'
              ? 'bg-[#16865D] text-[#F3F0E5] shadow-lg shadow-emerald-950/40 border border-[#D8B879]/40'
              : 'bg-[#10271C]/90 text-[#A8C5AC] hover:text-[#F3F0E5] border border-emerald-500/20'
          }`}
        >
          <Radio className="w-4 h-4 text-[#D8B879]" />
          <span>Cinematic SFX</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('overlays')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'overlays'
              ? 'bg-[#16865D] text-[#F3F0E5] shadow-lg shadow-emerald-950/40 border border-[#D8B879]/40'
              : 'bg-[#10271C]/90 text-[#A8C5AC] hover:text-[#F3F0E5] border border-emerald-500/20'
          }`}
        >
          <Video className="w-4 h-4 text-[#D8B879]" />
          <span>Video Overlays</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'templates'
              ? 'bg-[#16865D] text-[#F3F0E5] shadow-lg shadow-emerald-950/40 border border-[#D8B879]/40'
              : 'bg-[#10271C]/90 text-[#A8C5AC] hover:text-[#F3F0E5] border border-emerald-500/20'
          }`}
        >
          <FileText className="w-4 h-4 text-[#D8B879]" />
          <span>Developer Templates</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        <AnimatePresence mode="wait">
          {/* TAB 1: CINEMATIC LUTS */}
          {activeTab === 'luts' && (
            <motion.div
              key="luts"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {LUTS_DATA.map((lut) => {
                const sliderVal = activeLutSlider[lut.id] ?? 50
                return (
                  <div
                    key={lut.id}
                    className="p-6 rounded-2xl bg-[#0C1E16] border border-emerald-500/20 hover:border-[#D8B879]/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-[#D8B879] border border-emerald-800">
                          {lut.format}
                        </span>
                        <span className="text-xs font-mono text-[#A8C5AC]">{lut.size}</span>
                      </div>

                      <h3 className="text-xl font-bold text-[#F3F0E5] mt-1">{lut.name}</h3>
                      <p className="text-xs text-[#A8C5AC] mt-2 leading-relaxed">{lut.description}</p>

                      {/* Interactive Visual Split Comparison */}
                      <div className="mt-4 rounded-xl overflow-hidden border border-white/[0.1] relative h-40 bg-[#07130E] select-none">
                        <div
                          className="absolute inset-0 bg-gradient-to-tr from-emerald-900 via-teal-800 to-amber-700 flex items-center justify-center"
                          style={{ filter: lut.afterFilter }}
                        >
                          <span className="text-xs font-mono font-bold text-white/90 bg-black/50 px-2 py-1 rounded">
                            LUT GRADED
                          </span>
                        </div>

                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-tr from-emerald-950 via-teal-900 to-slate-900 overflow-hidden border-r-2 border-[#D8B879] flex items-center justify-center"
                          style={{
                            width: `${sliderVal}%`,
                            filter: lut.beforeFilter,
                          }}
                        >
                          <span className="text-xs font-mono font-bold text-slate-300 bg-black/50 px-2 py-1 rounded whitespace-nowrap">
                            ORIGINAL LOG
                          </span>
                        </div>

                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={sliderVal}
                          onChange={(e) =>
                            setActiveLutSlider((prev) => ({
                              ...prev,
                              [lut.id]: Number(e.target.value),
                            }))
                          }
                          className="absolute inset-x-2 bottom-2 accent-[#D8B879] opacity-75 hover:opacity-100 transition-opacity cursor-ew-resize"
                          aria-label={`Split comparison for ${lut.name}`}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#A8C5AC]/70 block text-center mt-1">
                        ← Drag slider for Before / After →
                      </span>
                    </div>

                    <div className="mt-6 pt-4 border-t border-emerald-500/15 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#A8C5AC]/70">{lut.license}</span>
                      <button
                        type="button"
                        onClick={() => handleDownload(`${lut.id}.cube`, lut.cubeData)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16865D] hover:bg-[#1fa372] text-[#F3F0E5] text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download .CUBE</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </motion.div>
          )}

          {/* TAB 2: STUDIO AUDIO & IMPULSE RESPONSES */}
          {activeTab === 'audio' && (
            <motion.div
              key="audio"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {AUDIO_DATA.map((audio) => {
                const isPlaying = playingAudioId === audio.id
                return (
                  <div
                    key={audio.id}
                    className="p-6 rounded-2xl bg-[#0C1E16] border border-emerald-500/20 hover:border-[#D8B879]/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-[#D8B879] border border-emerald-800">
                          {audio.decay}
                        </span>
                        <span className="text-xs font-mono text-[#A8C5AC]">{audio.format}</span>
                      </div>

                      <h3 className="text-xl font-bold text-[#F3F0E5] mt-1">{audio.name}</h3>
                      <p className="text-xs text-[#A8C5AC] mt-2 leading-relaxed">{audio.description}</p>

                      <div className="mt-4 p-4 rounded-xl bg-black/40 border border-emerald-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handlePlaySound(audio.id, audio.frequency)}
                            className="w-10 h-10 rounded-xl bg-[#16865D]/30 hover:bg-[#16865D]/50 text-[#D8B879] border border-[#D8B879]/40 flex items-center justify-center cursor-pointer transition-transform active:scale-95"
                            aria-label={isPlaying ? 'Stop acoustic preview' : 'Play acoustic preview'}
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                          </button>
                          <div>
                            <span className="text-xs font-mono font-bold text-[#F3F0E5] block">
                              {isPlaying ? 'Playing Acoustic Wave...' : 'Audition Impulse'}
                            </span>
                            <span className="text-[10px] font-mono text-[#A8C5AC]">Duration: {audio.duration}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className={`w-1 h-3 rounded-full bg-[#D8B879] ${isPlaying ? 'animate-pulse' : 'opacity-40'}`} />
                          <span className={`w-1 h-5 rounded-full bg-[#16865D] ${isPlaying ? 'animate-pulse delay-75' : 'opacity-40'}`} />
                          <span className={`w-1 h-2 rounded-full bg-[#D8B879] ${isPlaying ? 'animate-pulse delay-150' : 'opacity-40'}`} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-emerald-500/15 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#A8C5AC]/70">{audio.license}</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleDownload(
                            `${audio.id}-spec.txt`,
                            `IndiaTools Acoustic IR Specification\nName: ${audio.name}\nFormat: ${audio.format}\nDecay: ${audio.decay}\nLicense: ${audio.license}\n\nCompatible with Convolution Reverb in Ableton, Logic, FL Studio, and Reaper.`
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16865D] hover:bg-[#1fa372] text-[#F3F0E5] text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download IR Spec</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </motion.div>
          )}

          {/* TAB 3: CINEMATIC SFX */}
          {activeTab === 'sfx' && (
            <motion.div
              key="sfx"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {SFX_DATA.map((sfx) => {
                const isPlaying = playingAudioId === sfx.id
                return (
                  <div
                    key={sfx.id}
                    className="p-6 rounded-2xl bg-[#0C1E16] border border-emerald-500/20 hover:border-[#D8B879]/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-[#D8B879] border border-emerald-800">
                          {sfx.category}
                        </span>
                        <span className="text-xs font-mono text-[#A8C5AC]">{sfx.duration}</span>
                      </div>

                      <h3 className="text-xl font-bold text-[#F3F0E5] mt-1">{sfx.name}</h3>
                      <p className="text-xs text-[#A8C5AC] mt-2 leading-relaxed">{sfx.description}</p>

                      <div className="mt-4 p-4 rounded-xl bg-black/40 border border-emerald-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handlePlaySound(sfx.id, sfx.frequency, sfx.soundType)}
                            className="w-10 h-10 rounded-xl bg-[#16865D]/30 hover:bg-[#16865D]/50 text-[#D8B879] border border-[#D8B879]/40 flex items-center justify-center cursor-pointer transition-transform active:scale-95"
                            aria-label={isPlaying ? 'Stop sound' : 'Play sound'}
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                          </button>
                          <div>
                            <span className="text-xs font-mono font-bold text-[#F3F0E5] block">
                              {isPlaying ? 'Synthesizing SFX...' : 'Audition Waveform'}
                            </span>
                            <span className="text-[10px] font-mono text-[#A8C5AC]">{sfx.format}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className={`w-1 h-2 rounded-full bg-[#16865D] ${isPlaying ? 'animate-pulse' : 'opacity-40'}`} />
                          <span className={`w-1 h-4 rounded-full bg-[#D8B879] ${isPlaying ? 'animate-pulse delay-75' : 'opacity-40'}`} />
                          <span className={`w-1 h-3 rounded-full bg-[#16865D] ${isPlaying ? 'animate-pulse delay-150' : 'opacity-40'}`} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-emerald-500/15 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#A8C5AC]/70">{sfx.license}</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleDownload(
                            `${sfx.id}-meta.txt`,
                            `IndiaTools Sound Effect Specimen\nName: ${sfx.name}\nCategory: ${sfx.category}\nFormat: ${sfx.format}\nLicense: ${sfx.license}\nDuration: ${sfx.duration}`
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16865D] hover:bg-[#1fa372] text-[#F3F0E5] text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download SFX Info</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </motion.div>
          )}

          {/* TAB 4: VIDEO OVERLAYS & MATTES */}
          {activeTab === 'overlays' && (
            <motion.div
              key="overlays"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {OVERLAYS_DATA.map((overlay) => (
                <div
                  key={overlay.id}
                  className="p-6 rounded-2xl bg-[#0C1E16] border border-emerald-500/20 hover:border-[#D8B879]/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-[#D8B879] border border-emerald-800">
                        {overlay.aspectRatio}
                      </span>
                      <span className="text-xs font-mono text-[#A8C5AC]">{overlay.format}</span>
                    </div>

                    <h3 className="text-xl font-bold text-[#F3F0E5] mt-1">{overlay.name}</h3>
                    <p className="text-xs text-[#A8C5AC] mt-2 leading-relaxed">{overlay.description}</p>

                    <div className="mt-4 p-3 rounded-xl bg-black/60 border border-emerald-500/20 text-center select-none flex flex-col items-center justify-center h-28">
                      <span className="text-xs font-mono text-[#D8B879]">Blend Mode: {overlay.blendMode}</span>
                      <span className="text-[10px] font-mono text-[#A8C5AC] mt-1">Resolution: 1920x1080 / 4K UHD</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-emerald-500/15 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#A8C5AC]/70">{overlay.license}</span>
                    <button
                      type="button"
                      onClick={() => handleDownload(`${overlay.id}.svg`, overlay.svgContent, 'image/svg+xml')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16865D] hover:bg-[#1fa372] text-[#F3F0E5] text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Overlay</span>
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* TAB 5: DEVELOPER & CREATOR TEMPLATES */}
          {activeTab === 'templates' && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {TEMPLATES_DATA.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="p-6 rounded-2xl bg-[#0C1E16] border border-emerald-500/20 hover:border-[#D8B879]/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-[#D8B879] border border-emerald-800">
                        {tmpl.category}
                      </span>
                      <span className="text-xs font-mono text-[#A8C5AC]">{tmpl.format}</span>
                    </div>

                    <h3 className="text-xl font-bold text-[#F3F0E5] mt-1">{tmpl.name}</h3>
                    <p className="text-xs text-[#A8C5AC] mt-2 leading-relaxed">{tmpl.description}</p>

                    <div className="mt-4 p-3 rounded-xl bg-black/60 border border-emerald-500/20 font-mono text-[11px] text-slate-300 h-28 overflow-hidden select-none">
                      <div className="text-[9px] text-[#D8B879] border-b border-white/[0.08] pb-1 mb-1.5 flex justify-between">
                        <span>TEMPLATE PREVIEW</span>
                        <span>{tmpl.format}</span>
                      </div>
                      <pre className="whitespace-pre-wrap leading-tight text-[#A8C5AC]">
                        {tmpl.templateContent}
                      </pre>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-emerald-500/15 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#A8C5AC]/70">{tmpl.license}</span>
                    <button
                      type="button"
                      onClick={() => handleDownload(`${tmpl.id}.txt`, tmpl.templateContent)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16865D] hover:bg-[#1fa372] text-[#F3F0E5] text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Template</span>
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
