import React, { useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Car,
  HardHat,
  Zap,
  IndianRupee,
  MapPin,
  Briefcase,
  FileImage,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  Video,
  FileText,
  Code2,
  Wrench,
  Sparkles,
} from 'lucide-react'
import type { ToolDefinition } from '../../types'
import { CategoryAnimationPreview } from './CategoryAnimationPreview'

interface ToolCardProps {
  tool: ToolDefinition
  isFeatured?: boolean
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  audio: Volume2,
  image: FileImage,
  video: Video,
  pdf: FileText,
  money: IndianRupee,
  security: ShieldCheck,
  developer: Code2,
  utilities: Wrench,
  drive: Car,
  build: HardHat,
  power: Zap,
  land: MapPin,
  work: Briefcase,
  create: Sparkles,
}

const CATEGORY_ACCENTS: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  audio: { text: '#C084FC', bg: 'rgba(192, 132, 252, 0.15)', border: 'rgba(192, 132, 252, 0.4)', glow: 'rgba(192, 132, 252, 0.25)' },
  image: { text: '#34D399', bg: 'rgba(52, 211, 153, 0.15)', border: 'rgba(52, 211, 153, 0.4)', glow: 'rgba(52, 211, 153, 0.25)' },
  video: { text: '#22D3EE', bg: 'rgba(34, 211, 238, 0.15)', border: 'rgba(34, 211, 238, 0.4)', glow: 'rgba(34, 211, 238, 0.25)' },
  pdf: { text: '#FBBF24', bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.4)', glow: 'rgba(251, 191, 36, 0.25)' },
  money: { text: '#FDE047', bg: 'rgba(253, 224, 71, 0.15)', border: 'rgba(253, 224, 71, 0.4)', glow: 'rgba(253, 224, 71, 0.25)' },
  security: { text: '#10B981', bg: 'rgba(16, 185, 129, 0.18)', border: 'rgba(16, 185, 129, 0.45)', glow: 'rgba(16, 185, 129, 0.3)' },
  developer: { text: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)', border: 'rgba(96, 165, 250, 0.4)', glow: 'rgba(96, 165, 250, 0.25)' },
  utilities: { text: '#FB923C', bg: 'rgba(251, 146, 60, 0.15)', border: 'rgba(251, 146, 60, 0.4)', glow: 'rgba(251, 146, 60, 0.25)' },
  drive: { text: '#FB923C', bg: 'rgba(251, 146, 60, 0.15)', border: 'rgba(251, 146, 60, 0.4)', glow: 'rgba(251, 146, 60, 0.2)' },
  build: { text: '#FBBF24', bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.4)', glow: 'rgba(251, 191, 36, 0.2)' },
  power: { text: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)', border: 'rgba(96, 165, 250, 0.4)', glow: 'rgba(96, 165, 250, 0.2)' },
  land: { text: '#34D399', bg: 'rgba(52, 211, 153, 0.15)', border: 'rgba(52, 211, 153, 0.4)', glow: 'rgba(52, 211, 153, 0.2)' },
  work: { text: '#22D3EE', bg: 'rgba(34, 211, 238, 0.15)', border: 'rgba(34, 211, 238, 0.4)', glow: 'rgba(34, 211, 238, 0.2)' },
  create: { text: '#F472B6', bg: 'rgba(244, 114, 182, 0.15)', border: 'rgba(244, 114, 182, 0.4)', glow: 'rgba(244, 114, 182, 0.2)' },
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, isFeatured = false }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const Icon = CATEGORY_ICONS[tool.category] || ArrowRight
  const accents = CATEGORY_ACCENTS[tool.category] || {
    text: '#10B981',
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.35)',
    glow: 'rgba(16, 185, 129, 0.2)',
  }

  // Mouse-following reflection coordinates
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)
  }

  // Determine specific animation category
  const previewCategory = useMemo(() => {
    if (tool.category === 'money') return 'money'
    if (tool.category === 'create') {
      if (tool.slug.includes('vault') || tool.slug.includes('watermark') || tool.slug.includes('tracer')) return 'security'
      if (tool.slug.includes('audio') || tool.slug.includes('reverb') || tool.slug.includes('bass') || tool.slug.includes('surround')) return 'audio'
      if (tool.slug.includes('video') || tool.slug.includes('spectrum')) return 'video'
      if (tool.slug.includes('pdf') || tool.slug.includes('scanner') || tool.slug.includes('print')) return 'pdf'
      if (tool.slug.includes('ai-token') || tool.slug.includes('experience')) return 'developer'
      return 'image'
    }
    return tool.category
  }, [tool.category, tool.slug])

  const targetPath = tool.seo.canonicalPath || (tool.type === 'image-tool' ? `/tools/${tool.slug}` : `/calculators/${tool.slug}`)

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
      className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden relative transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 group hover:-translate-y-1 shadow-lg ${
        isFeatured
          ? 'md:col-span-2 bg-[#0E261B] border border-emerald-500/35 hover:border-amber-400/60 hover:shadow-2xl hover:shadow-emerald-950/60'
          : 'bg-[#0A1E15] border border-emerald-500/20 hover:border-amber-400/40 hover:shadow-2xl hover:shadow-emerald-950/40'
      }`}
    >
      {/* Category-Reactive Hover Motion Layer */}
      <CategoryAnimationPreview
        category={previewCategory}
        isHovered={isHovered}
        accentColor={accents.text}
      />

      {/* Mouse Reflection Spotlight Element */}
      <div className="reflection-spotlight" />

      {/* Top Header: Category Icon & Badges */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2.5 mb-4">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105 shadow-inner"
            style={{
              backgroundColor: accents.bg,
              borderColor: accents.border,
              color: accents.text,
            }}
          >
            <Icon className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {tool.badge && (
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#122F22] text-amber-300 border border-amber-400/30">
                {tool.badge}
              </span>
            )}
            <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-md text-emerald-300 bg-[#06150F]/80 border border-emerald-500/25">
              {tool.categoryLabel}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-200 transition-colors tracking-tight leading-snug">
          <Link to={targetPath} className="hover:underline focus:outline-none">
            {tool.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="mt-2.5 text-sm sm:text-[15px] text-slate-300 leading-relaxed font-sans line-clamp-3">
          {tool.description}
        </p>

        {/* Micro Category Metadata Footer */}
        <div className="mt-4 pt-3 border-t border-emerald-500/15">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-300/90">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate">{tool.tags.slice(0, 3).join(' • ')}</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="relative z-10 mt-6 pt-3.5 border-t border-emerald-500/15 flex items-center justify-between">
        <span className="text-xs font-mono text-emerald-400/70">
          Client-Side Zero-Install
        </span>

        <Link
          to={targetPath}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-300 group-hover:text-white focus:outline-none focus-visible:underline cursor-pointer transition-colors"
          aria-label={`Launch ${tool.title}`}
        >
          <span>Launch Tool</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
        </Link>
      </div>
    </div>
  )
}
