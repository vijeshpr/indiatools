import React, { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
  Stamp,
  BookOpen,
  HelpCircle,
  Cpu,
  Layers,
  Lock,
  Grid,
} from 'lucide-react'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import type { BatchWatermarkLocale } from '../lib/watermarkEngine/types'
import {
  BATCH_LOCALES,
  getBatchWatermarkTranslation,
} from '../lib/watermarkEngine/i18n'
import { BatchTrustBadges } from './watermarkBatch/BatchTrustBadges'
import { BatchLanguageSelector } from './watermarkBatch/BatchLanguageSelector'
import { BatchWatermarkWorkspace } from './watermarkBatch/BatchWatermarkWorkspace'

export const BatchImageWatermarkerTool: React.FC = () => {
  const { langCode } = useParams<{ langCode?: string }>()
  const tool = getToolBySlug('batch-image-watermarker')

  const [currentLocale, setCurrentLocale] = useState<BatchWatermarkLocale>(() => {
    if (langCode && langCode in BATCH_LOCALES) {
      return langCode as BatchWatermarkLocale
    }
    return 'en'
  })

  const t = useMemo(
    () => getBatchWatermarkTranslation(currentLocale),
    [currentLocale]
  )

  if (!tool) {
    return null
  }

  // Canonical hreflangs for multilingual SEO
  const hreflangs = [
    { lang: 'x-default', href: 'https://indiatools-rho.vercel.app/tools/batch-image-watermarker' },
    { lang: 'en-IN', href: 'https://indiatools-rho.vercel.app/tools/batch-image-watermarker' },
    { lang: 'ml-IN', href: 'https://indiatools-rho.vercel.app/ml/tools/batch-image-watermarker' },
    { lang: 'hi-IN', href: 'https://indiatools-rho.vercel.app/hi/tools/batch-image-watermarker' },
    { lang: 'ta-IN', href: 'https://indiatools-rho.vercel.app/ta/tools/batch-image-watermarker' },
    { lang: 'te-IN', href: 'https://indiatools-rho.vercel.app/te/tools/batch-image-watermarker' },
    { lang: 'kn-IN', href: 'https://indiatools-rho.vercel.app/kn/tools/batch-image-watermarker' },
    { lang: 'bn-IN', href: 'https://indiatools-rho.vercel.app/bn/tools/batch-image-watermarker' },
  ]

  // Structured Data Schema for Search Engines
  const customJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Batch Image Watermarker & Multi-Stamp Engine',
    operatingSystem: 'All Web Browsers (Mobile & Desktop)',
    applicationCategory: 'MultimediaApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description:
      'Free high-speed batch image watermarker with zero server uploads. Stamp custom text, PNG logos, and diagonal anti-theft tiling patterns on 100+ photos at once with instant in-browser ZIP download.',
  }

  return (
    <ToolPageLayout
      tool={tool}
      customTitle={`${t.title} | IndiaTools`}
      customDescription={t.subtitle}
      customH1={t.title}
      customSubtitle={t.subtitle}
      maxWidthClass="max-w-7xl"
      customJsonLd={customJsonLd}
      hideDefaultFaqs={true}
      hideDefaultGuide={true}
    >
      <div className="space-y-8">
        {/* HERO BANNER & TRUST BADGES */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <BatchTrustBadges t={t} />

            <div className="shrink-0">
              <BatchLanguageSelector
                currentLocale={currentLocale}
                onSelectLocale={setCurrentLocale}
              />
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center sm:justify-start gap-3">
              <Stamp className="w-8 h-8 text-cyan-400" />
              <span>{t.title}</span>
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* Metric Highlight Badges */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-0.5">Batch Pipeline</span>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                Concurrent Multi-Threaded
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-0.5">Anti-Theft Protection</span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                Diagonal Tiling Grid
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-0.5">Multi-Stamp Modes</span>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wide">
                Dual Text & Logo
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

        {/* MAIN BATCH WORKSPACE INTERFACE */}
        <div className="rounded-3xl border border-slate-800/90 bg-slate-950/70 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <BatchWatermarkWorkspace t={t} />
        </div>

        {/* TECHNICAL ARCHITECTURE GUIDE */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 backdrop-blur-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Photography Batch Processing & Engineering Architecture
              </h2>
              <p className="text-xs text-slate-400">
                How IndiaTools renders high-precision stamps across 100+ images without server latency
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
            <div className="space-y-2.5">
              <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
                <Cpu className="w-4 h-4" /> 1. Concurrent Batch Queue Pipeline
              </h3>
              <p>
                Processing hundreds of 24-megapixel or 48-megapixel RAW exports in a single synchronous loop would freeze the browser UI and trigger Out-Of-Memory exceptions.
              </p>
              <p>
                IndiaTools employs a parallel asynchronous dispatch queue throttled by <code className="text-cyan-300">navigator.hardwareConcurrency</code>. Offscreen canvas buffers process image batches concurrently, periodically yielding to the event loop so progress indicators, rendering rings, and CSS transitions remain fluid at 60 FPS.
              </p>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                <Grid className="w-4 h-4" /> 2. Diagonal Anti-Theft Tiling Geometry
              </h3>
              <p>
                Traditional single-corner watermarks are easily cropped out or masked with content-aware fill. Our Anti-Theft engine projects an infinite diagonal repetition across the diagonal dimension D = &radic;(W&sup2; + H&sup2;).
              </p>
              <p>
                The canvas transformation matrix translates to the center, rotates by user angle $\theta$, and iterates horizontally and vertically with staggered row offsets. This embeds an indelible protective pattern over faces and details while preserving underlying visibility.
              </p>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                <Layers className="w-4 h-4" /> 3. 9-Point Magnetic Vector Positioning
              </h3>
              <p>
                Images in batch collections frequently have mixed orientations (portrait, landscape, square) and disparate resolutions (e.g., 4000×3000 alongside 1920×1080).
              </p>
              <p>
                Instead of rigid pixel coordinates, typography sizes and padding margins are computed dynamically as fractional percentages of the image&apos;s bounding box. The 9-point anchor matrix mathematically anchors stamps to exact proportional margins regardless of individual photo dimensions.
              </p>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                <Lock className="w-4 h-4" /> 4. Zero-Upload In-Memory Privacy & Fast ZIP Packaging
              </h3>
              <p>
                Photographers and businesses cannot risk exposing unpublished photos, client wedding galleries, or confidential proof sheets to third-party cloud services.
              </p>
              <p>
                IndiaTools executes 100% within your client-side browser runtime. Processed image blobs are stored in ephemeral memory and packaged into a standard compressed ZIP archive via JSZip, with all Object URLs immediately revoked to safeguard device RAM.
              </p>
            </div>
          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS ACCORDION */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800 mb-2">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
              <p className="text-xs text-slate-400">
                Common questions regarding bulk watermarking, logo stamps, speed, and privacy
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {t.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-2xl bg-slate-950/60 border border-slate-800 p-4 transition-all open:border-cyan-500/40"
              >
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-xs text-slate-200 group-hover:text-cyan-300 transition-colors">
                  <span>{faq.q}</span>
                  <span className="text-cyan-400 transition-transform duration-200 group-open:rotate-180">
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
