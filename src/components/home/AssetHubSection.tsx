import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Type,
  Film,
  Volume2,
  FileText,
  Download,
  Eye,
  Play,
  Pause,
  Sliders,
  Check,
  ExternalLink,
  Sparkles,
} from 'lucide-react'

type AssetTab = 'fonts' | 'luts' | 'audio' | 'templates'

interface FontAsset {
  id: string
  name: string
  designer: string
  script: string
  format: string
  license: string
  size: string
  downloadUrl?: string
  description: string
  sampleText: string
  fontFamily: string
}

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

const FONTS_DATA: FontAsset[] = [
  {
    id: 'manjari',
    name: 'Manjari',
    designer: 'Santhosh Thottingal (SMC)',
    script: 'Malayalam & Latin',
    format: 'WOFF2 / TTF',
    license: 'SIL Open Font License 1.1',
    size: '86 KB',
    description: 'Spiral and curved Malayalam font suitable for both headlines and long-form body text.',
    sampleText: 'നമസ്കാരം കേരളം • Malayalam Typography',
    fontFamily: "'Manjari', system-ui, sans-serif",
  },
  {
    id: 'gayathri',
    name: 'Gayathri',
    designer: 'Swathanthra Malayalam Computing',
    script: 'Malayalam & Latin',
    format: 'WOFF2 / TTF',
    license: 'SIL Open Font License 1.1',
    size: '112 KB',
    description: 'Gentle, readable modern display typeface designed for posters, titles, and magazines.',
    sampleText: 'സാഹിത്യവും സംസ്കാരവും • Gayathri Display',
    fontFamily: "'Gayathri', system-ui, sans-serif",
  },
  {
    id: 'noto-sans-indic',
    name: 'Noto Sans Devanagari & Malayalam',
    designer: 'Google Fonts & Monotype',
    script: 'Multi-Script Pan-India',
    format: 'Variable WOFF2',
    license: 'SIL Open Font License 1.1',
    size: '142 KB',
    description: 'Harmonious typographic system designed for complete pan-Indian multi-script clarity.',
    sampleText: 'भारत माता की जय • എല്ലാ ഭാരതീയർക്കും സ്വാഗതം',
    fontFamily: "'Noto Sans', system-ui, sans-serif",
  },
]

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
    name: 'Western Ghats Lush Mist',
    format: '.CUBE (33x33x33)',
    size: '1.1 MB',
    license: 'CC0 Public Domain',
    description: 'Deep verdant greens and soft shadow mist roll-off for nature & drone cinematography.',
    beforeFilter: 'contrast(100%) saturate(100%)',
    afterFilter: 'contrast(115%) saturate(140%) brightness(95%) hue-rotate(8deg)',
    cubeData: '# LUT: Western Ghats Lush Mist\nTITLE "Western Ghats Lush Mist"\nLUT_3D_SIZE 2\n0.0 0.0 0.0\n0.8 1.0 0.85\n',
  },
  {
    id: 'golden-hour-kerala',
    name: 'Kerala Sunset Nostalgia',
    format: '.CUBE (33x33x33)',
    size: '1.2 MB',
    license: 'Creative Commons CC-BY 4.0',
    description: 'Warm 3200K Kodak 2383 vintage print emulation with golden amber highlights.',
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
    description: 'Acoustic impulse response recorded in a historical high-ceiling colonial wooden hall.',
    frequency: 440,
  },
  {
    id: 'studio-plate',
    name: 'High-End Studio Plate IR',
    format: '24-bit 96kHz WAV',
    duration: '1.8s',
    decay: '1.8s RT60',
    size: '620 KB',
    license: 'CC0 Public Domain',
    description: 'Ultra-dense mechanical plate reverb impulse designed for vocal presence and percussion.',
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
    description: 'Short tight acoustic decay with rich natural mid-frequency resonance.',
    frequency: 329.63,
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
  const [activeTab, setActiveTab] = useState<AssetTab>('fonts')
  const [fontCustomText, setFontCustomText] = useState('നമസ്കാരം • Welcome to IndiaTools')
  const [fontSize, setFontSize] = useState(24)
  const [activeLutSlider, setActiveLutSlider] = useState<Record<string, number>>({
    'monsoon-teal': 50,
    'western-ghats': 50,
    'golden-hour-kerala': 50,
  })
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Real Web Audio synth impulse preview (strictly no autoplay)
  const handlePlayPreview = (asset: AudioAsset) => {
    if (playingAudioId === asset.id) {
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

      osc.type = 'sine'
      osc.frequency.setValueAtTime(asset.frequency, ctx.currentTime)

      // Reverb decay envelope simulation
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 1.8)

      setPlayingAudioId(asset.id)
      osc.onended = () => {
        setPlayingAudioId(null)
        ctx.close()
      }
    } catch {
      setPlayingAudioId(null)
    }
  }

  // Trigger local instant file download
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
      {/* Subtle Ambient Background Mesh */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/80 border border-violet-800/80 text-violet-300 text-xs font-mono font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Curated Creator Presets & Downloads</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Creative assets. Ready for your next project.
        </h2>

        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Explore regional typography, cinematic LUTs, audio resources, and practical templates in one place.
        </p>
      </div>

      {/* Collection Navigation Tabs */}
      <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab('fonts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'fonts'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25 border border-violet-400/40'
              : 'bg-[#11131F] text-slate-400 hover:text-white border border-white/[0.08]'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Malayalam & Indian Fonts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('luts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'luts'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/25 border border-cyan-400/40'
              : 'bg-[#11131F] text-slate-400 hover:text-white border border-white/[0.08]'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Cinematic .CUBE LUTs</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audio')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'audio'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 border border-emerald-400/40'
              : 'bg-[#11131F] text-slate-400 hover:text-white border border-white/[0.08]'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>Studio Impulse Responses</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'templates'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25 border border-amber-400/40'
              : 'bg-[#11131F] text-slate-400 hover:text-white border border-white/[0.08]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Resume & Developer Templates</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {/* TAB 1: FONTS */}
          {activeTab === 'fonts' && (
            <motion.div
              key="fonts"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Interactive Live Type Preview Input */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#11131F] border border-white/[0.08] flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 w-full">
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">
                    Live Type Tester (Type in Malayalam, Hindi, or English):
                  </label>
                  <input
                    type="text"
                    value={fontCustomText}
                    onChange={(e) => setFontCustomText(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-violet-400"
                    placeholder="Type sample text here..."
                  />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="text-xs font-mono text-slate-400 whitespace-nowrap">Size: {fontSize}px</span>
                  <input
                    type="range"
                    min="16"
                    max="48"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-28 accent-violet-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Font Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {FONTS_DATA.map((font) => (
                  <div
                    key={font.id}
                    className="p-6 rounded-2xl bg-[#11131F] border border-white/[0.08] hover:border-violet-500/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-violet-950/80 text-violet-300 border border-violet-800">
                          {font.script}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{font.format}</span>
                      </div>

                      <h3 className="text-xl font-bold text-white mt-1">{font.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">By {font.designer}</p>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{font.description}</p>

                      {/* Live Render Area */}
                      <div className="mt-4 p-4 rounded-xl bg-black/50 border border-white/[0.06] min-h-[90px] flex items-center justify-center text-center overflow-hidden">
                        <p
                          style={{ fontSize: `${fontSize}px`, fontFamily: font.fontFamily }}
                          className="text-white font-medium break-words leading-tight"
                        >
                          {fontCustomText || font.sampleText}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-500">{font.license}</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleDownload(
                            `${font.id}-specimen.txt`,
                            `IndiaTools Font Specimen: ${font.name}\nDesigner: ${font.designer}\nLicense: ${font.license}\nFormat: ${font.format}\n\nOfficial Font Repository: Swathanthra Malayalam Computing (SMC)`
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Info</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 2: LUTS */}
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
                    className="p-6 rounded-2xl bg-[#11131F] border border-white/[0.08] hover:border-cyan-500/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                          {lut.format}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{lut.size}</span>
                      </div>

                      <h3 className="text-xl font-bold text-white mt-1">{lut.name}</h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{lut.description}</p>

                      {/* Interactive Visual Split Comparison */}
                      <div className="mt-4 rounded-xl overflow-hidden border border-white/[0.1] relative h-40 bg-slate-900 select-none">
                        {/* Background simulated footage with LUT grading applied */}
                        <div
                          className="absolute inset-0 bg-gradient-to-tr from-emerald-900 via-teal-800 to-amber-700 flex items-center justify-center"
                          style={{ filter: lut.afterFilter }}
                        >
                          <span className="text-xs font-mono font-bold text-white/90 bg-black/40 px-2 py-1 rounded">
                            LUT GRADED
                          </span>
                        </div>

                        {/* Split reveal overlay */}
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-tr from-emerald-950 via-teal-900 to-slate-800 overflow-hidden border-r-2 border-cyan-400 flex items-center justify-center"
                          style={{
                            width: `${sliderVal}%`,
                            filter: lut.beforeFilter,
                          }}
                        >
                          <span className="text-xs font-mono font-bold text-slate-300 bg-black/40 px-2 py-1 rounded whitespace-nowrap">
                            ORIGINAL LOG
                          </span>
                        </div>

                        {/* Slider control */}
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
                          className="absolute inset-x-2 bottom-2 accent-cyan-400 opacity-70 hover:opacity-100 transition-opacity cursor-ew-resize"
                          aria-label={`Split comparison for ${lut.name}`}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 block text-center mt-1">
                        ← Drag slider for Before / After →
                      </span>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-500">{lut.license}</span>
                      <button
                        type="button"
                        onClick={() => handleDownload(`${lut.id}.cube`, lut.cubeData)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
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

          {/* TAB 3: AUDIO IMPULSE RESPONSES */}
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
                    className="p-6 rounded-2xl bg-[#11131F] border border-white/[0.08] hover:border-emerald-500/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                          {audio.decay}
                        </span>
                        <span className="text-xs font-mono text-slate-400">{audio.format}</span>
                      </div>

                      <h3 className="text-xl font-bold text-white mt-1">{audio.name}</h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{audio.description}</p>

                      {/* Interactive Audio Player Preview */}
                      <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handlePlayPreview(audio)}
                            className="w-10 h-10 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center cursor-pointer transition-transform active:scale-95"
                            aria-label={isPlaying ? 'Stop acoustic preview' : 'Play acoustic preview'}
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                          </button>
                          <div>
                            <span className="text-xs font-mono font-bold text-white block">
                              {isPlaying ? 'Playing Acoustic Wave...' : 'Audition Impulse'}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">Duration: {audio.duration}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className={`w-1 h-3 rounded-full bg-emerald-400 ${isPlaying ? 'animate-pulse' : 'opacity-40'}`} />
                          <span className={`w-1 h-5 rounded-full bg-emerald-400 ${isPlaying ? 'animate-pulse delay-75' : 'opacity-40'}`} />
                          <span className={`w-1 h-2 rounded-full bg-emerald-400 ${isPlaying ? 'animate-pulse delay-150' : 'opacity-40'}`} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-500">{audio.license}</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleDownload(
                            `${audio.id}-spec.txt`,
                            `IndiaTools Acoustic IR Specification\nName: ${audio.name}\nFormat: ${audio.format}\nDecay: ${audio.decay}\nLicense: ${audio.license}\n\nCompatible with Convolution Reverb in Ableton, Logic, FL Studio, and Reaper.`
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
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

          {/* TAB 4: TEMPLATES */}
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
                  className="p-6 rounded-2xl bg-[#11131F] border border-white/[0.08] hover:border-amber-500/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                        {tmpl.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{tmpl.format}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mt-1">{tmpl.name}</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{tmpl.description}</p>

                    {/* Template Code Specimen Preview */}
                    <div className="mt-4 p-3 rounded-xl bg-black/60 border border-white/[0.06] font-mono text-[11px] text-slate-300 h-28 overflow-hidden select-none">
                      <div className="text-[9px] text-slate-500 border-b border-white/[0.08] pb-1 mb-1.5 flex justify-between">
                        <span>PREVIEW</span>
                        <span>{tmpl.format}</span>
                      </div>
                      <pre className="whitespace-pre-wrap leading-tight text-slate-400">
                        {tmpl.templateContent}
                      </pre>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500">{tmpl.license}</span>
                    <button
                      type="button"
                      onClick={() => handleDownload(`${tmpl.id}.txt`, tmpl.templateContent)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
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
