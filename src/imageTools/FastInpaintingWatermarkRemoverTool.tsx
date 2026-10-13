import React, { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
  Wand2,
  BookOpen,
  HelpCircle,
  Cpu,
  Layers,
  Lock,
  Sparkles,
} from 'lucide-react'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import {
  InpaintingLocale,
  INPAINTING_LOCALES,
  getInpaintingTranslation,
} from '../lib/inpainting/i18n'
import { InpaintingTrustBadges } from './inpainting/InpaintingTrustBadges'
import { InpaintingLanguageSelector } from './inpainting/InpaintingLanguageSelector'
import { InpaintingWorkspace } from './inpainting/InpaintingWorkspace'

export const FastInpaintingWatermarkRemoverTool: React.FC = () => {
  const { langCode } = useParams<{ langCode?: string }>()
  const tool = getToolBySlug('fast-inpainting-watermark-remover')

  const [currentLocale, setCurrentLocale] = useState<InpaintingLocale>(() => {
    if (langCode && langCode in INPAINTING_LOCALES) {
      return langCode as InpaintingLocale
    }
    return 'en'
  })

  const t = useMemo(
    () => getInpaintingTranslation(currentLocale),
    [currentLocale]
  )

  if (!tool) {
    return null
  }

  // Canonical hreflangs for multilingual SEO
  const hreflangs = [
    { lang: 'x-default', href: 'https://indiatools-rho.vercel.app/tools/fast-inpainting-watermark-remover' },
    { lang: 'en-IN', href: 'https://indiatools-rho.vercel.app/tools/fast-inpainting-watermark-remover' },
    { lang: 'ml-IN', href: 'https://indiatools-rho.vercel.app/ml/tools/fast-inpainting-watermark-remover' },
    { lang: 'hi-IN', href: 'https://indiatools-rho.vercel.app/hi/tools/fast-inpainting-watermark-remover' },
    { lang: 'ta-IN', href: 'https://indiatools-rho.vercel.app/ta/tools/fast-inpainting-watermark-remover' },
    { lang: 'te-IN', href: 'https://indiatools-rho.vercel.app/te/tools/fast-inpainting-watermark-remover' },
    { lang: 'kn-IN', href: 'https://indiatools-rho.vercel.app/kn/tools/fast-inpainting-watermark-remover' },
    { lang: 'bn-IN', href: 'https://indiatools-rho.vercel.app/bn/tools/fast-inpainting-watermark-remover' },
  ]

  // Structured Data Schema for Search Engines
  const customJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Fast Inpainting Watermark Remover & Object Eraser',
    operatingSystem: 'All Web Browsers (Mobile & Desktop)',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description:
      'Free client-side photo inpainting tool to erase watermarks, date stamps, phone logos, and unwanted objects using the Alexandru Telea Fast Marching algorithm with zero server uploads.',
  }

  return (
    <ToolPageLayout
      tool={tool}
      customTitle={`${t.title} | IndiaTools`}
      customDescription={t.subtitle}
      customH1={t.title}
      customSubtitle={t.subtitle}
      maxWidthClass="max-w-7xl"
      hreflangs={hreflangs}
      customJsonLd={customJsonLd}
      hideDefaultFaqs={true}
      hideDefaultGuide={true}
    >
      <div className="space-y-8">
        {/* HERO BANNER & TRUST BADGES */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <InpaintingTrustBadges t={t} />

            <div className="shrink-0">
              <InpaintingLanguageSelector
                currentLocale={currentLocale}
                onSelectLocale={setCurrentLocale}
              />
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center sm:justify-start gap-3">
              <Wand2 className="w-8 h-8 text-rose-400" />
              <span>{t.title}</span>
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* Metric Highlight Badges */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-0.5">Inpainting Method</span>
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">
                Alexandru Telea (FMM)
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-0.5">Boundary Accuracy</span>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                Gradient Extrapolation
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-0.5">Brush System</span>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wide">
                Dual-Layer Undo / Redo
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-0.5">Privacy Architecture</span>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                100% In-Browser Memory
              </span>
            </div>
          </div>
        </div>

        {/* MAIN INPAINTING WORKSPACE INTERFACE */}
        <div className="rounded-3xl border border-slate-800/90 bg-slate-950/70 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <InpaintingWorkspace t={t} />
        </div>

        {/* TECHNICAL ARCHITECTURE GUIDE */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 backdrop-blur-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Computer Vision Architecture & Alexandru Telea Inpainting Foundations
              </h2>
              <p className="text-xs text-slate-400">
                How IndiaTools reconstructs seamless background textures and erases watermarks without blur
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
            <div className="space-y-2.5">
              <h3 className="text-sm font-semibold text-rose-300 flex items-center gap-2">
                <Cpu className="w-4 h-4" /> 1. Fast Marching Level-Set Boundary Propagation
              </h3>
              <p>
                Propagating colors into an arbitrary masked hole without creating artificial seams requires strict geometric marching order. Telea&apos;s algorithm categorizes pixels into three dynamic states: Known, Band (narrow boundary), and Inside.
              </p>
              <p>
                Using a Fast Min-Heap priority queue, the narrow-band marches progressively inward from the outside contours. Pixels closest to known clean areas are synthesized first, ensuring natural continuity along image edges and textural transitions.
              </p>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> 2. First-Order Color & Texture Gradient Extrapolation
              </h3>
              <p>
                Simple nearest-neighbor blur or average interpolation destroys image sharpness, leaving obvious smudges where watermarks used to be.
              </p>
              <p>
                Our engine computes central difference gradients across color channels for neighboring pixels:
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-cyan-300">
                I(p) = &Sigma; w(p, q) &middot; [I(q) + &nabla;I(q) &middot; (p - q)] / &Sigma; w(p, q)
              </div>
              <p>
                This first-order Taylor series approximation projects color ramps and structural contours inward, retaining high-frequency fidelity.
              </p>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                <Layers className="w-4 h-4" /> 3. Dual-Canvas Interactive Mask Compositing
              </h3>
              <p>
                To provide buttery 60 FPS drawing with glowing ruby-red strokes, the editor decouples the base photographic image from the mask layer into separate hardware-accelerated HTML5 Canvas contexts.
              </p>
              <p>
                Subpixel pointer interpolation links rapid mouse movements into continuous geometric arcs, while the snapshot history manager maintains deep undo/redo states with bounded RAM usage.
              </p>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                <Lock className="w-4 h-4" /> 4. Ephemeral In-Memory Privacy & Lossless Export
              </h3>
              <p>
                Unlike web apps that transmit personal photos, family portraits, and ID cards to remote cloud servers for heavy processing, IndiaTools executes every step inside your browser&apos;s WebAssembly and JavaScript engine.
              </p>
              <p>
                Zero bytes leave your machine. When finished, export directly to lossless PNG or high-bitrate JPEG with full metadata preservation and instant Object URL disposal.
              </p>
            </div>
          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS ACCORDION */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800 mb-2">
            <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
              <p className="text-xs text-slate-400">
                Common questions regarding watermark removal, object erasing, quality, and privacy
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {t.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-2xl bg-slate-950/60 border border-slate-800 p-4 transition-all open:border-rose-500/40"
              >
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-xs text-slate-200 group-hover:text-rose-300 transition-colors">
                  <span>{faq.q}</span>
                  <span className="text-rose-400 transition-transform duration-200 group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <p className="mt-3 text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
