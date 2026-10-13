import React, { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
  Shield,
  ShieldCheck,
  FileText,
  Image as ImageIcon,
  Key,
  Lock,
  Binary,
  Sparkles,
  Cpu,
  BookOpen,
  HelpCircle,
  Scale,
  AlertTriangle,
  Globe,
} from 'lucide-react'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import {
  WatermarkLocale,
  WATERMARK_LOCALES,
  ALL_WATERMARK_LOCALES,
  getWatermarkLocaleMeta,
} from '../lib/watermarker/i18n/locales'
import {
  getWatermarkTranslation,
  WATERMARK_TRANSLATIONS,
} from '../lib/watermarker/i18n/translations'
import { WatermarkMode } from '../lib/watermarker/types'
import { LanguageSelector } from './watermarker/LanguageSelector'
import { WatermarkModeSwitcher } from './watermarker/WatermarkModeSwitcher'
import { TextWatermarkPanel } from './watermarker/TextWatermarkPanel'
import { ImageWatermarkPanel } from './watermarker/ImageWatermarkPanel'
import { WatermarkSecurityNotice } from './watermarker/WatermarkSecurityNotice'

export const InvisibleDocumentWatermarkerTool: React.FC = () => {
  const { langCode } = useParams<{ langCode?: string }>()
  const tool = getToolBySlug('invisible-document-watermarker')

  // Language selection state
  const [currentLocale, setCurrentLocale] = useState<WatermarkLocale>(() => {
    if (langCode && langCode in WATERMARK_LOCALES) {
      return langCode as WatermarkLocale
    }
    return 'en'
  })

  useEffect(() => {
    if (langCode && langCode in WATERMARK_LOCALES) {
      setCurrentLocale(langCode as WatermarkLocale)
    }
  }, [langCode])

  const [mode, setMode] = useState<WatermarkMode>('image')
  const t = useMemo(() => getWatermarkTranslation(currentLocale), [currentLocale])
  const activeMeta = useMemo(() => getWatermarkLocaleMeta(currentLocale), [currentLocale])

  // Build alternate hreflang entries for SEO
  const hreflangs = useMemo(() => {
    const list = [
      {
        lang: 'x-default',
        href: 'https://indiatools-rho.vercel.app/tools/invisible-document-watermarker',
      },
    ]
    for (const loc of ALL_WATERMARK_LOCALES) {
      const meta = WATERMARK_LOCALES[loc]
      const path =
        loc === 'en'
          ? '/tools/invisible-document-watermarker'
          : `/${loc}/tools/invisible-document-watermarker`
      list.push({
        lang: meta.bcp47,
        href: `https://indiatools-rho.vercel.app${path}`,
      })
    }
    return list
  }, [])

  if (!tool) {
    return null
  }

  const isRtl = activeMeta.dir === 'rtl'

  return (
    <ToolPageLayout
      tool={tool}
      customTitle={`${t.title} | IndiaTools`}
      customDescription={t.subtitle}
      customH1={t.title}
      customSubtitle={t.subtitle}
      maxWidthClass="max-w-6xl"
      hreflangs={hreflangs}
      hideDefaultFaqs={true}
      hideDefaultGuide={true}
    >
      <div className={`space-y-8 ${isRtl ? 'text-right' : 'text-left'}`} dir={activeMeta.dir}>
        {/* HERO BANNER & LANGUAGE SELECTOR */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>{t.badge}</span>
                <span className="h-1 w-1 rounded-full bg-cyan-400" />
                <span className="font-mono text-[10px] text-cyan-200">
                  23 Indian Languages
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                {t.title}
              </h1>
              <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
                {t.subtitle}
              </p>
            </div>

            {/* Language Selector Dropdown */}
            <div className="shrink-0 flex items-center gap-2">
              <LanguageSelector
                currentLocale={currentLocale}
                onLocaleChange={(loc) => setCurrentLocale(loc)}
              />
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-0.5">Privacy Arch</span>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                100% In-Browser
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-0.5">Stego Modulation</span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                LSB + Zero-Width
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-0.5">Checksum Rigor</span>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wide font-mono">
                CRC32 & CRC16
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80">
              <span className="text-[11px] text-slate-400 block mb-0.5">Legal Provenance</span>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wide">
                IT Act §65B
              </span>
            </div>
          </div>
        </div>

        {/* MODE SWITCHER: Image vs Text */}
        <WatermarkModeSwitcher mode={mode} onModeChange={setMode} t={t} />

        {/* MAIN INTERACTIVE WORKSPACE */}
        <div className="rounded-3xl border border-slate-800/90 bg-slate-950/70 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          {mode === 'image' ? (
            <ImageWatermarkPanel t={t} />
          ) : (
            <TextWatermarkPanel t={t} isRtl={isRtl} />
          )}
        </div>

        {/* SECURITY & LEGAL NOTICES */}
        <WatermarkSecurityNotice t={t} />

        {/* DEEP TECHNICAL ARCHITECTURE & FORENSIC GUIDE */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 backdrop-blur-sm space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Technical Specification & Digital Forensics Engineering
              </h2>
              <p className="text-xs text-slate-400">
                Understanding browser-based Unicode steganography and Least Significant Bit raster embedding
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
                <Binary className="w-4 h-4" /> 1. Unicode Zero-Width Quaternary Encoding
              </h3>
              <p>
                Text steganography serializes confidential provenance metadata (Owner ID, Organization, Reference Key, Timestamp, and CRC16 checksum) into a binary stream. Each byte is converted into four 2-bit quaternary symbols mapped to specific non-printing Unicode characters:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400 font-mono text-[11px] pl-2">
                <li><strong className="text-slate-200">00</strong> → U+200B (Zero Width Space)</li>
                <li><strong className="text-slate-200">01</strong> → U+200C (Zero Width Non-Joiner)</li>
                <li><strong className="text-slate-200">10</strong> → U+200D (Zero Width Joiner)</li>
                <li><strong className="text-slate-200">11</strong> → U+FEFF (Zero Width No-Break Space / BOM)</li>
              </ul>
              <p>
                To protect Indian language font rendering (e.g. Devanagari, Malayalam, Tamil conjuncts) and RTL scripts (Urdu, Kashmiri, Sindhi), tokens are injected strictly at word and sentence boundaries, leaving word-internal ligature shaping completely untouched.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-emerald-300 flex items-center gap-2">
                <Cpu className="w-4 h-4" /> 2. Canvas 2D LSB Raster Modulation
              </h3>
              <p>
                Image watermarking modulates the Least Significant Bit (bit 0) of the Blue color channel across pixels in memory. Because the human eye possesses far fewer blue cone photoreceptors compared to green and red, changing the blue luminance by ±1 unit out of 255 produces zero perceptible visual variation under standard monitors and high-resolution Retina displays.
              </p>
              <p>
                Each embedded block contains a 32-bit synchronization preamble (<code>0x574D4B52</code> &quot;WMKR&quot;), version byte, payload length, JSON metadata, and an authenticated 32-bit CRC checksum. Redundant tiling ensures survival even when parts of the image are cropped.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                <Scale className="w-4 h-4" /> 3. Legal Admissibility under IT Act §65B
              </h3>
              <p>
                In Indian corporate and judicial investigations, electronic records submitted without authenticated provenance are vulnerable to admissibility challenges. Documents embedded with verifiable UTC timestamps, cryptographic checksums, and organizational tracking tags provide incontrovertible evidence of electronic custody under Section 65B of the Indian Evidence Act.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> 4. Channel Survival & Forensic Limitations
              </h3>
              <p>
                Digital steganography relies on preserving bit-level integrity. Text fingerprints survive standard copy-pasting across Microsoft Word, Google Docs, Apple Notes, Slack, and PDF generation. However, code formatters, ASCII-only text cleaners, and regex sanitizers will remove zero-width codepoints. Similarly, image watermarks survive lossless formats (PNG, TIFF, BMP), but recompressing images into lossy JPEGs at high compression ratios will discard high-frequency LSB noise.
              </p>
            </div>
          </div>
        </div>

        {/* LOCALIZED FREQUENTLY ASKED QUESTIONS */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800 mb-2">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
              <p className="text-xs text-slate-400">
                Common questions about document tracking, leak attribution, and privacy
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
