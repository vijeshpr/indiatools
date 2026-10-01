import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Upload,
  Download,
  UserCheck,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Printer,
  ZoomIn,
  FileCheck,
} from 'lucide-react'
import { generatePassportPhoto, ImageProcessingResult } from '../lib/imageProcessing'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

const BG_COLORS = [
  { name: 'Studio White', color: '#FFFFFF', desc: 'Standard Indian Passport' },
  { name: 'Light Blue', color: '#B3D4FC', desc: 'Many Overseas Visas' },
  { name: 'Studio Grey', color: '#E2E8F0', desc: 'Official IDs' },
  { name: 'Light Cream', color: '#FDF8F0', desc: 'Neutral Warm' },
]

export const PassportPhotoTool: React.FC = () => {
  const tool = getToolBySlug('passport-photo')!

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [originalSizeKb, setOriginalSizeKb] = useState<number>(0)
  const [bgColor, setBgColor] = useState<string>('#FFFFFF')
  const [zoom, setZoom] = useState<number>(1.0)
  const [singleResult, setSingleResult] = useState<ImageProcessingResult | null>(null)
  const [printableSheetUrl, setPrintableSheetUrl] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setOriginalSizeKb(Number((file.size / 1024).toFixed(1)))
    await runGenerator(file, bgColor, zoom)
  }

  const runGenerator = async (file: File, bg: string, z: number) => {
    setIsProcessing(true)
    try {
      const res = await generatePassportPhoto(file, bg, z)
      setSingleResult(res.single)
      setPrintableSheetUrl(res.printableSheetUrl)
    } catch (err) {
      console.error('Passport photo creation failed', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBgChange = (bg: string) => {
    setBgColor(bg)
    if (selectedFile) runGenerator(selectedFile, bg, zoom)
  }

  const handleZoomChange = (z: number) => {
    setZoom(z)
    if (selectedFile) runGenerator(selectedFile, bgColor, z)
  }

  const handleDownloadSingle = () => {
    if (!singleResult) return
    const a = document.createElement('a')
    a.href = singleResult.dataUrl
    a.download = `passport-photo-35x45mm-${Date.now()}.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleDownloadSheet = () => {
    if (!printableSheetUrl) return
    const a = document.createElement('a')
    a.href = printableSheetUrl
    a.download = `passport-8-photos-4x6-sheet-${Date.now()}.jpg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleReset = () => {
    setSelectedFile(null)
    setOriginalSizeKb(0)
    setSingleResult(null)
    setPrintableSheetUrl('')
    setBgColor('#FFFFFF')
    setZoom(1.0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-pink-500" />
              <span>Studio Alignment & Backdrop</span>
            </h2>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% In-Browser</span>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {!selectedFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-700 hover:border-pink-500/60 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-neutral-950/40 hover:bg-neutral-950/80 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Upload Front-Facing Portrait
              </h3>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Select any clear front portrait or selfie. We crop to official 3.5cm × 4.5cm Indian passport dimensions.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-semibold text-white truncate">{selectedFile.name}</p>
                    <span className="text-xs text-neutral-400">Original: {originalSizeKb} KB</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs rounded-lg bg-neutral-800 text-neutral-300 hover:text-white shrink-0"
                >
                  Change
                </button>
              </div>

              {/* Background Color Picker */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                  Studio Background Color
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {BG_COLORS.map((bg) => (
                    <button
                      key={bg.color}
                      type="button"
                      onClick={() => handleBgChange(bg.color)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-colors ${
                        bgColor === bg.color
                          ? 'bg-neutral-800 border-pink-500 text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:bg-neutral-850'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-neutral-600 shrink-0"
                        style={{ backgroundColor: bg.color }}
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-semibold block truncate">{bg.name}</span>
                        <span className="text-[10px] text-neutral-400 block truncate">{bg.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Face Zoom & Framing Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5 text-pink-400" />
                    <span>Framing & Face Zoom</span>
                  </label>
                  <span className="text-xs text-pink-400 font-mono font-bold">{zoom.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.8"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
                <p className="text-[11px] text-neutral-400 mt-1">
                  Indian passport rule: Face must cover 70% to 80% of the vertical frame.
                </p>
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs text-neutral-400 space-y-1">
            <span className="font-bold text-neutral-300 block">Ministry of External Affairs Standard:</span>
            <p>• Dimensions: <strong>3.5 cm × 4.5 cm (35 mm × 45 mm)</strong></p>
            <p>• Plain white background, neutral face, eyes open, no shadows or head coverings (except religious)</p>
          </div>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-6 space-y-4">
          <motion.div
            layout
            className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-pink-950/30 border border-pink-500/30 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-pink-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>35×45mm Passport Photo</span>
              </span>
              {singleResult && (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ready for Passport & Visa</span>
                </span>
              )}
            </div>

            {isProcessing ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-10 h-10 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-neutral-300">Cropping to 35×45mm & building printable 4×6 sheet...</p>
              </div>
            ) : singleResult ? (
              <div>
                {/* Photo Preview & Sheet Preview */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-5 bg-neutral-950 rounded-xl border border-neutral-800 mb-6">
                  {/* Single Photo */}
                  <div className="text-center">
                    <div className="p-1.5 bg-white rounded-lg shadow-lg border border-neutral-600 inline-block">
                      <img
                        src={singleResult.dataUrl}
                        alt="35x45mm Passport Photo"
                        className="w-32 h-40 object-cover rounded"
                      />
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400 block mt-1.5">
                      Single (35 × 45 mm)
                    </span>
                  </div>

                  {/* 8-Photo 4x6 Sheet Thumbnail */}
                  {printableSheetUrl && (
                    <div className="text-center">
                      <div className="p-1.5 bg-white rounded-lg shadow-lg border border-neutral-600 inline-block">
                        <img
                          src={printableSheetUrl}
                          alt="8-Photo 4x6 Sheet"
                          className="w-44 h-30 object-contain rounded"
                        />
                      </div>
                      <span className="text-[11px] font-mono text-amber-400 block mt-1.5 font-bold">
                        8-Photo 4×6" Print Sheet
                      </span>
                    </div>
                  )}
                </div>

                {/* Download Actions (Two buttons) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadSingle}
                    className="py-3 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-neutral-700 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-pink-400" />
                    <span>Download Single (35×45mm)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadSheet}
                    className="py-3 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Download 8-Photo 4×6" Sheet</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-neutral-400">
                <UserCheck className="w-12 h-12 mx-auto mb-2 text-neutral-600" />
                <p className="text-sm">Upload portrait on the left to generate passport photos</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
