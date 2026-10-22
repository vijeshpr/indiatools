import React, { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Wand2,
  BookOpen,
  HelpCircle,
  Cpu,
  Layers,
  Lock,
  Sparkles,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import {
  InpaintingLocale,
  INPAINTING_LOCALES,
  getInpaintingTranslation,
} from '../lib/inpainting/i18n'
import { INPAINTING_SEO_LANGUAGES } from '../data/inpaintingSeoData'
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

  const seoInfo = useMemo(
    () => INPAINTING_SEO_LANGUAGES[currentLocale] || INPAINTING_SEO_LANGUAGES.en,
    [currentLocale]
  )

  if (!tool) {
    return null
  }

  const canonicalPath =
    currentLocale === 'en'
      ? '/tools/fast-inpainting-watermark-remover'
      : `/${currentLocale}/tools/fast-inpainting-watermark-remover`

  // Reciprocal hreflangs across all 7 supported languages
  const hreflangs = [
    { lang: 'x-default', href: 'https://indiatools-rho.vercel.app/tools/fast-inpainting-watermark-remover' },
    { lang: 'en-IN', href: 'https://indiatools-rho.vercel.app/tools/fast-inpainting-watermark-remover' },
    { lang: 'bn-IN', href: 'https://indiatools-rho.vercel.app/bn/tools/fast-inpainting-watermark-remover' },
    { lang: 'ml-IN', href: 'https://indiatools-rho.vercel.app/ml/tools/fast-inpainting-watermark-remover' },
    { lang: 'hi-IN', href: 'https://indiatools-rho.vercel.app/hi/tools/fast-inpainting-watermark-remover' },
    { lang: 'ta-IN', href: 'https://indiatools-rho.vercel.app/ta/tools/fast-inpainting-watermark-remover' },
    { lang: 'te-IN', href: 'https://indiatools-rho.vercel.app/te/tools/fast-inpainting-watermark-remover' },
    { lang: 'kn-IN', href: 'https://indiatools-rho.vercel.app/kn/tools/fast-inpainting-watermark-remover' },
  ]

  // Structured Data Schema for Search Engines
  const customJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: seoInfo.h1,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All Web Browsers (Mobile & Desktop)',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
        description: seoInfo.metaDescription,
        url: `https://indiatools-rho.vercel.app${canonicalPath}`,
      },
      {
        '@type': 'HowTo',
        name: seoInfo.guideTitle,
        step: seoInfo.guideSteps.map((s) => ({
          '@type': 'HowToStep',
          position: s.step,
          name: s.title,
          text: s.description,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: seoInfo.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      },
    ],
  }

  const handleSelectLocale = (newLoc: InpaintingLocale) => {
    setCurrentLocale(newLoc)
    const targetPath =
      newLoc === 'en'
        ? '/tools/fast-inpainting-watermark-remover'
        : `/${newLoc}/tools/fast-inpainting-watermark-remover`
    window.history.pushState({}, '', targetPath)
  }

  return (
    <ToolPageLayout
      tool={tool}
      customTitle={seoInfo.title}
      customDescription={seoInfo.metaDescription}
      customH1={seoInfo.h1}
      customSubtitle={seoInfo.subtitle}
      customCanonicalPath={canonicalPath}
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
                onSelectLocale={handleSelectLocale}
              />
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center sm:justify-start gap-3">
              <Wand2 className="w-8 h-8 text-rose-400" />
              <span>{seoInfo.h1}</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              {seoInfo.subtitle}
            </p>
          </div>
        </div>

        {/* INTERACTIVE WORKSPACE (CANVAS DRAWING & INPAINTING ENGINE) */}
        <InpaintingWorkspace t={t} />

        {/* STEP-BY-STEP USER GUIDE */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 backdrop-blur-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{seoInfo.guideTitle}</h2>
              <p className="text-xs text-slate-400">
                Easy 5-step workflow for clean, blur-free watermark and object removal
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {seoInfo.guideSteps.map((step) => (
              <div
                key={step.step}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-2">
                    Step {step.step}
                  </span>
                  <h3 className="text-xs font-semibold text-white">{step.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRACTICAL REAL-WORLD USE CASES */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 backdrop-blur-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{seoInfo.useCasesTitle}</h2>
              <p className="text-xs text-slate-400">
                Common scenarios where fast inpainting restores clean, natural photographs
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {seoInfo.useCases.map((uc, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2"
              >
                <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
                  <span>{uc.title}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {uc.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* TECHNICAL SPECS, SUPPORTED FORMATS & LIMITATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-2.5 text-white font-semibold text-sm">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <span>{seoInfo.techSpecsTitle}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {seoInfo.supportedFormats}
            </p>
            <div className="pt-2 border-t border-slate-800/80 flex items-start gap-2 text-xs text-amber-300/90">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {seoInfo.limitations}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-2.5 text-white font-semibold text-sm">
              <ShieldCheck className="w-5 h-5 text-rose-400" />
              <span>{seoInfo.privacyTitle}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {seoInfo.privacyNote}
            </p>
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
              Verified client-side execution via HTML5 Canvas 2D &amp; Alexandru Telea Fast Marching.
            </div>
          </div>
        </div>

        {/* EDUCATIONAL & ALGORITHMIC FOUNDATIONS */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 backdrop-blur-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Computer Vision Architecture &amp; Alexandru Telea Inpainting Foundations
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
                <Sparkles className="w-4 h-4" /> 2. First-Order Color &amp; Texture Gradient Extrapolation
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
                <Lock className="w-4 h-4" /> 4. Ephemeral In-Memory Privacy &amp; Lossless Export
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
            {seoInfo.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-2xl bg-slate-950/60 border border-slate-800 p-4 transition-all open:border-rose-500/40"
              >
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-xs text-slate-200 group-hover:text-rose-300 transition-colors">
                  <span>{faq.question}</span>
                  <span className="text-rose-400 transition-transform duration-200 group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <p className="mt-3 text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* RELATED PRACTICAL TOOLS */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
            Related Private Image Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                title: 'Batch Image Watermarker',
                desc: 'Stamp copyright text, logo badges, and diagonal watermarks across multiple photos.',
                path: '/tools/batch-image-watermarker',
              },
              {
                title: 'Invisible Document Watermarker',
                desc: 'Embed zero-width invisible anti-leak tracking IDs into sensitive PDFs and documents.',
                path: '/tools/invisible-document-watermarker',
              },
              {
                title: 'Smart Document Scanner',
                desc: 'Auto-detect document corners and flatten skewed receipts or book pages with 4-point warp.',
                path: '/tools/smart-document-scanner',
              },
              {
                title: 'Scan-to-Print P2P Studio',
                desc: 'Direct phone-to-computer document transmission without WhatsApp or mobile number sharing.',
                path: '/tools/scan-to-print',
              },
            ].map((rel, idx) => (
              <Link
                key={idx}
                to={rel.path}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-rose-500/40 transition-colors block group"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-white group-hover:text-rose-300">
                  <span>{rel.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-400 transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{rel.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
