import React, { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
  Scan,
  Sparkles,
  ShieldCheck,
  Cpu,
  BookOpen,
  HelpCircle,
  Crop,
  Layers,
  Lock,
} from 'lucide-react'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import {
  ScannerLocale,
  SCANNER_LOCALES,
  getScannerTranslation,
} from '../lib/scanner/i18n'
import { ScannerTrustBadges } from './scanner/ScannerTrustBadges'
import { ScannerLanguageSelector } from './scanner/ScannerLanguageSelector'
import { ScannerWorkspace } from './scanner/ScannerWorkspace'

export const SmartDocumentScannerTool: React.FC = () => {
  const { langCode } = useParams<{ langCode?: string }>()
  const tool = getToolBySlug('smart-document-scanner')

  const [currentLocale, setCurrentLocale] = useState<ScannerLocale>(() => {
    if (langCode && langCode in SCANNER_LOCALES) {
      return langCode as ScannerLocale
    }
    return 'en'
  })

  const t = useMemo(() => getScannerTranslation(currentLocale), [currentLocale])

  if (!tool) {
    return null
  }

  // Canonical hreflangs for multilingual SEO
  const hreflangs = [
    { lang: 'x-default', href: 'https://indiatools-rho.vercel.app/tools/smart-document-scanner' },
    { lang: 'en-IN', href: 'https://indiatools-rho.vercel.app/tools/smart-document-scanner' },
    { lang: 'ml-IN', href: 'https://indiatools-rho.vercel.app/ml/tools/smart-document-scanner' },
    { lang: 'hi-IN', href: 'https://indiatools-rho.vercel.app/hi/tools/smart-document-scanner' },
    { lang: 'ta-IN', href: 'https://indiatools-rho.vercel.app/ta/tools/smart-document-scanner' },
    { lang: 'te-IN', href: 'https://indiatools-rho.vercel.app/te/tools/smart-document-scanner' },
    { lang: 'kn-IN', href: 'https://indiatools-rho.vercel.app/kn/tools/smart-document-scanner' },
    { lang: 'bn-IN', href: 'https://indiatools-rho.vercel.app/bn/tools/smart-document-scanner' },
  ]

  // Structured Data Schema for Search Engines
  const customJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Smart Document Scanner & Perspective Warp',
    operatingSystem: 'All Web Browsers (Mobile & Desktop)',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description:
      'Free in-browser smart document scanner. Auto-detects paper edges, straightens skewed photos with 4-point projective homography, and enhances text with CamScanner-style filters without cloud uploads.',
  }

  return (
    <ToolPageLayout
      tool={tool}
      customTitle={`${t.title} | IndiaTools`}
      customDescription={t.subtitle}
      customH1={t.title}
      customSubtitle={t.subtitle}
      maxWidthClass="max-w-6xl"
      hreflangs={hreflangs}
      customJsonLd={customJsonLd}
      hideDefaultFaqs={true}
      hideDefaultGuide={true}
    >
      <div className="space-y-8">
        {/* HERO BANNER & TRUST BADGES */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <ScannerTrustBadges t={t} />

            <div className="shrink-0">
              <ScannerLanguageSelector
                currentLocale={currentLocale}
                onLocaleChange={setCurrentLocale}
              />
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center sm:justify-start gap-3">
              <Scan className="w-8 h-8 text-emerald-400" />
              <span>{t.title}</span>
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* Feature Highlight Metrics */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-0.5">Perspective Engine</span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                4-Point Homography
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-0.5">Filter Technology</span>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                B&W Magic Shadow-Eraser
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-0.5">Pixel Precision</span>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wide">
                Magnified Loupe Reticle
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-0.5">Data Privacy</span>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                100% In-Browser Memory
              </span>
            </div>
          </div>
        </div>

        {/* MAIN SCANNER INTERACTIVE WORKSPACE */}
        <div className="rounded-3xl border border-slate-800/90 bg-slate-950/70 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <ScannerWorkspace t={t} />
        </div>

        {/* TECHNICAL ARCHITECTURE & MATHEMATICS GUIDE */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 backdrop-blur-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Computer Vision Architecture & Mathematical Foundations
              </h2>
              <p className="text-xs text-slate-400">
                How IndiaTools straightens distorted document photos and removes shadows client-side
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
            <div className="space-y-2.5">
              <h3 className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                <Crop className="w-4 h-4" /> 1. Projective Homography & Bilinear Backward Mapping
              </h3>
              <p>
                When taking photos of documents at an angle, parallel lines converge due to perspective distortion. An affine transform (rotation, translation, scale) cannot correct this skew because depth perspective non-linearly compresses distant edges.
              </p>
              <p>
                Our engine establishes an 8-degree-of-freedom projective homography matrix by solving an 8×8 linear system (A · m = b) using Gaussian elimination with partial pivoting. To prevent aliasing artifacts or pixel holes, we map destination coordinates (u, v) backwards into continuous source subpixel space (x, y) using 4-point bilinear interpolation:
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-emerald-300">
                I(u, v) = (1-dx)(1-dy)I₀₀ + dx(1-dy)I₁₀ + (1-dx)dyI₀₁ + dx dy I₁₁
              </div>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
                <Layers className="w-4 h-4" /> 2. Integral-Image Adaptive Shadow Erasure (B&W Magic)
              </h3>
              <p>
                Mobile cameras capture uneven ceiling lighting, hand shadows, and warm ambient casts. Global thresholding (Otsu) fails because dark shadows in bright regions are darker than ink in well-lit regions.
              </p>
              <p>
                We compute an $O(1)$ Integral Image across the grayscale luminance buffer:
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[10px] text-cyan-300">
                Integral(x, y) = I(x, y) + Integral(x-1, y) + Integral(x, y-1) - Integral(x-1, y-1)
              </div>
              <p>
                This allows calculating the dynamic local neighborhood background in constant time regardless of window radius. Pixels darker than the local mean by threshold constant $C$ are boosted to high-contrast ink, while paper textures are bleached to pure white.
              </p>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                <Cpu className="w-4 h-4" /> 3. Sobel Gradient & Convex Quad Optimization
              </h3>
              <p>
                To automatically locate document boundaries, the image is passed through a 2D Gaussian blur kernel to suppress high-frequency paper grain, followed by horizontal and vertical Sobel convolution kernels to extract gradient magnitudes. Extreme convex hull projections locate optimal candidate corners (Top-Left, Top-Right, Bottom-Right, Bottom-Left) within 50 milliseconds.
              </p>
            </div>

            <div className="space-y-2.5">
              <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                <Lock className="w-4 h-4" /> 4. 100% In-Browser Privacy & Zero Server Transmissions
              </h3>
              <p>
                Unlike proprietary mobile scanning apps that transmit your personal bank statements, salary slips, and Aadhaar/PAN cards to foreign cloud servers, IndiaTools executes all computer vision algorithms, image manipulation, and PDF generation strictly within your browser&apos;s WebAssembly and Canvas runtime. Zero bytes leave your device.
              </p>
            </div>
          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS ACCORDION */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800 mb-2">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
              <p className="text-xs text-slate-400">
                Answers regarding document perspective correction, filters, and mobile usage
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {t.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-2xl bg-slate-950/60 border border-slate-800 p-4 transition-all open:border-emerald-500/40"
              >
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-xs text-slate-200 group-hover:text-emerald-300 transition-colors">
                  <span>{faq.q}</span>
                  <span className="text-emerald-400 transition-transform duration-200 group-open:rotate-180">
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
