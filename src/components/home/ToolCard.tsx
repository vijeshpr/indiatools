import React, { useRef, useState } from 'react'
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
  Code,
  Wrench,
  Sparkles,
} from 'lucide-react'
import type { ToolDefinition, ToolCategory } from '../../types'
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
  developer: Code,
  utilities: Wrench,
  drive: Car,
  build: HardHat,
  power: Zap,
  land: MapPin,
  work: Briefcase,
  create: Sparkles,
}

const CATEGORY_ACCENTS: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  audio: { text: '#A855F7', bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.3)', glow: 'rgba(168, 85, 247, 0.2)' },
  image: { text: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)', glow: 'rgba(16, 185, 129, 0.2)' },
  video: { text: '#06B6D4', bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.3)', glow: 'rgba(6, 182, 212, 0.2)' },
  pdf: { text: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)', glow: 'rgba(245, 158, 11, 0.2)' },
  money: { text: '#D8B879', bg: 'rgba(216, 184, 121, 0.12)', border: 'rgba(216, 184, 121, 0.3)', glow: 'rgba(216, 184, 121, 0.2)' },
  security: { text: '#16865D', bg: 'rgba(22, 134, 93, 0.15)', border: 'rgba(22, 134, 93, 0.35)', glow: 'rgba(22, 134, 93, 0.2)' },
  developer: { text: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.3)', glow: 'rgba(59, 130, 246, 0.2)' },
  utilities: { text: '#F97316', bg: 'rgba(249, 115, 22, 0.12)', border: 'rgba(249, 115, 22, 0.3)', glow: 'rgba(249, 115, 22, 0.2)' },
  drive: { text: '#F97316', bg: 'rgba(249, 115, 22, 0.12)', border: 'rgba(249, 115, 22, 0.3)', glow: 'rgba(249, 115, 22, 0.15)' },
  build: { text: '#EAB308', bg: 'rgba(234, 179, 8, 0.12)', border: 'rgba(234, 179, 8, 0.3)', glow: 'rgba(234, 179, 8, 0.15)' },
  power: { text: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.3)', glow: 'rgba(59, 130, 246, 0.15)' },
  land: { text: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)', glow: 'rgba(16, 185, 129, 0.15)' },
  work: { text: '#06B6D4', bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.3)', glow: 'rgba(6, 182, 212, 0.15)' },
  create: { text: '#EC4899', bg: 'rgba(236, 72, 153, 0.12)', border: 'rgba(236, 72, 153, 0.3)', glow: 'rgba(236, 72, 153, 0.15)' },
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, isFeatured = false }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const Icon = CATEGORY_ICONS[tool.category] || ArrowRight
  const accents = CATEGORY_ACCENTS[tool.category] || {
    text: '#16865D',
    bg: 'rgba(22, 134, 93, 0.12)',
    border: 'rgba(22, 134, 93, 0.3)',
    glow: 'rgba(22, 134, 93, 0.15)',
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

  const previewCategory = React.useMemo(() => {
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

  const targetPath = tool.type === 'image-tool' ? `/tools/${tool.slug}` : `/calculators/${tool.slug}`

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
      className={`botanical-card group rounded-2xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden relative transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B879] ${
        isFeatured ? 'md:col-span-2 bg-[#10271C]' : 'bg-[#0C1E16]'
      }`}
    >
      {/* Category-Reactive Hover Animation Layer */}
      <CategoryAnimationPreview
        category={previewCategory}
        isHovered={isHovered}
        accentColor={accents.text}
      />

      {/* Mouse Reflection Spotlight Element */}
      <div className="reflection-spotlight" />

      {/* Top Header: Category Icon & Badges */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105"
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
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#10271C] text-[#D8B879] border border-[#D8B879]/30">
                {tool.badge}
              </span>
            )}
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md text-[#A8C5AC] bg-[#07130E]/60 border border-emerald-500/15">
              {tool.categoryLabel}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-[#F3F0E5] group-hover:text-[#D8B879] transition-colors tracking-tight leading-snug">
          {tool.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-xs sm:text-sm text-[#A8C5AC] leading-relaxed font-sans line-clamp-3">
          {tool.description}
        </p>

        {/* Micro Category Metadata Footer */}
        <div className="mt-4 pt-3 border-t border-emerald-500/15">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#D8B879]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate">{tool.tags.slice(0, 3).join(' • ')}</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="relative z-10 mt-5 pt-3 border-t border-emerald-500/15 flex items-center justify-between">
        <span className="text-[11px] font-mono text-[#A8C5AC]/70">
          Client-Side Zero-Install
        </span>

        <Link
          to={targetPath}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D8B879] group-hover:text-[#F3F0E5] focus:outline-none focus-visible:underline cursor-pointer"
          aria-label={`Launch ${tool.title}`}
        >
          <span>Launch Tool</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
        </Link>
      </div>
    </div>
  )
}
