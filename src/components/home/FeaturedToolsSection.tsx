import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Volume2,
  FileImage,
  Scan,
  Printer,
  FileCheck,
  IndianRupee,
  Layers,
  CheckCircle2,
} from 'lucide-react'
import { getToolBySlug } from '../../data/tools'

interface FeaturedItem {
  slug: string
  headline: string
  tagline: string
  categoryBadge: string
  categoryColor: string
  icon: React.ElementType
  targetPath: string
  visualHighlight: string
  stats: string[]
}

const FEATURED_ITEMS: FeaturedItem[] = [
  {
    slug: 'indian-cheque-studio',
    headline: 'Indian Cheque Studio',
    tagline: 'Interactive CTS-2010 cheque simulation and numeric rupee conversion into words across 13 Indian regional languages.',
    categoryBadge: 'Fintech Flagship',
    categoryColor: '#EAB308',
    icon: IndianRupee,
    targetPath: '/calculators/indian-cheque-studio',
    visualHighlight: '13 Languages • CTS-2010 Specimen',
    stats: ['13 Indian Scripts', 'A/C Payee Crossing', 'Instant A4 Printout'],
  },
  {
    slug: 'zero-knowledge-file-vault',
    headline: 'Zero-Knowledge File Vault',
    tagline: 'Military-grade AES-256-GCM file encryption and authenticated streaming decryption running 100% inside your browser RAM.',
    categoryBadge: 'Security Flagship',
    categoryColor: '#10B981',
    icon: ShieldCheck,
    targetPath: '/tools/zero-knowledge-file-vault',
    visualHighlight: 'Zero Cloud Storage • Authenticated .vault',
    stats: ['AES-256-GCM', 'Web Crypto API', 'Zero Server Logs'],
  },
  {
    slug: 'orbit-audio-studio',
    headline: 'Orbit 8D Spatial Audio Studio',
    tagline: 'Binaural 3D soundfield spatializer, rotating orbital head tracking, harmonic bass enhancement, and studio reverberation.',
    categoryBadge: 'Audio Flagship',
    categoryColor: '#A855F7',
    icon: Volume2,
    targetPath: '/tools/orbit-audio-studio',
    visualHighlight: '360° Binaural Soundfield • WAV/MP3 Export',
    stats: ['8D Spatialization', 'Real-Time Web Audio', 'Lossless 48kHz WAV'],
  },
  {
    slug: 'fast-inpainting-watermark-remover',
    headline: 'Fast Inpainting Object Eraser',
    tagline: 'Client-side photo restoration engine using Alexandru Telea fast marching inpainting to erase watermarks and unwanted objects.',
    categoryBadge: 'Graphics Flagship',
    categoryColor: '#06B6D4',
    icon: FileImage,
    targetPath: '/tools/fast-inpainting-watermark-remover',
    visualHighlight: 'Fast Marching Algorithm • 100% Private',
    stats: ['Brush Masking', 'Client CPU Marching', 'Lossless PNG Export'],
  },
  {
    slug: 'scan-to-print',
    headline: 'Scan-to-Print P2P QR Drop Studio',
    tagline: 'Instant zero-upload phone-to-computer print drop over WebRTC peer-to-peer data channels for photocopy centres and print shops.',
    categoryBadge: 'Utility Flagship',
    categoryColor: '#F97316',
    icon: Printer,
    targetPath: '/tools/scan-to-print',
    visualHighlight: 'WebRTC P2P • Direct Mobile-to-Printer',
    stats: ['Zero WhatsApp Leak', 'RAM-Only Buffer', 'Instant Print Dialog'],
  },
  {
    slug: 'smart-document-scanner',
    headline: 'Smart Document Scanner & Warp',
    tagline: 'Automatic edge corner detection and 4-point homography perspective warp for scanning receipts, identity cards, and bills.',
    categoryBadge: 'Document Flagship',
    categoryColor: '#F59E0B',
    icon: Scan,
    targetPath: '/tools/smart-document-scanner',
    visualHighlight: 'Quad Corner Warp • Contrast Filters',
    stats: ['Perspective Correction', 'Black & White Filter', 'High-Res PDF Export'],
  },
]

export const FeaturedToolsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0D2418] border border-amber-400/30 text-amber-300 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>CURATED FLAGSHIPS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Featured & Popular Tools
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl font-sans">
            Our most powerful browser-native applications — engineered for heavy daily productivity with zero logins or cloud tracking.
          </p>
        </div>

        <Link
          to="/popular"
          className="inline-flex items-center gap-2 text-sm font-bold text-amber-300 hover:text-white transition-colors group self-start md:self-end"
        >
          <span>View all popular utilities</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Featured Grid — 2 Large Feature Cards on top + 4 Compact cards below */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {FEATURED_ITEMS.map((item, idx) => {
          const Icon = item.icon
          const isPrimary = idx < 2

          return (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden transition-all duration-300 group hover:-translate-y-1.5 shadow-xl ${
                isPrimary
                  ? 'bg-gradient-to-br from-[#0F281E] via-[#0A1F16] to-[#07160F] border border-emerald-500/30 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-emerald-950/60'
                  : 'bg-[#0B1E16] border border-emerald-500/20 hover:border-amber-400/40 hover:shadow-2xl hover:shadow-emerald-950/40'
              }`}
            >
              {/* Soft Radial Ambient Glow */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20 transition-opacity group-hover:opacity-35"
                style={{ backgroundColor: item.categoryColor }}
              />

              <div className="relative z-10">
                {/* Header: Icon + Category Badge */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: 'rgba(15, 35, 25, 0.9)',
                      borderColor: `${item.categoryColor}40`,
                      color: item.categoryColor,
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <span
                    className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border"
                    style={{
                      backgroundColor: 'rgba(10, 25, 18, 0.8)',
                      borderColor: `${item.categoryColor}35`,
                      color: item.categoryColor,
                    }}
                  >
                    {item.categoryBadge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-200 transition-colors tracking-tight leading-snug">
                  {item.headline}
                </h3>

                {/* Tagline */}
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {item.tagline}
                </p>

                {/* Micro Feature Badges */}
                <div className="mt-4 pt-3 border-t border-emerald-500/15 flex flex-wrap gap-1.5">
                  {item.stats.map((stat) => (
                    <span
                      key={stat}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#071710] border border-emerald-500/20 text-slate-300"
                    >
                      {stat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="relative z-10 mt-6 pt-3.5 border-t border-emerald-500/15 flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400/80 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Client-Side</span>
                </span>

                <Link
                  to={item.targetPath}
                  className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 group-hover:text-white transition-colors cursor-pointer"
                >
                  <span>Launch Tool</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                </Link>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
