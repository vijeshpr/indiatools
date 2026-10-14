import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Car, HardHat, Zap, IndianRupee, MapPin, Briefcase, FileImage, ShieldCheck, CheckCircle2 } from 'lucide-react'
import type { ToolDefinition, ToolCategory } from '../../types'

interface ToolCardProps {
  tool: ToolDefinition
  isFeatured?: boolean
}

const CATEGORY_ICONS: Record<ToolCategory, React.ElementType> = {
  drive: Car,
  build: HardHat,
  power: Zap,
  money: IndianRupee,
  land: MapPin,
  work: Briefcase,
  create: FileImage,
}

const CATEGORY_ACCENTS: Record<ToolCategory, { text: string; bg: string; border: string; glow: string }> = {
  drive: { text: '#F97316', bg: 'rgba(249, 115, 22, 0.12)', border: 'rgba(249, 115, 22, 0.3)', glow: 'rgba(249, 115, 22, 0.15)' },
  build: { text: '#EAB308', bg: 'rgba(234, 179, 8, 0.12)', border: 'rgba(234, 179, 8, 0.3)', glow: 'rgba(234, 179, 8, 0.15)' },
  power: { text: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.3)', glow: 'rgba(59, 130, 246, 0.15)' },
  money: { text: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.12)', border: 'rgba(139, 92, 246, 0.3)', glow: 'rgba(139, 92, 246, 0.15)' },
  land: { text: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)', glow: 'rgba(16, 185, 129, 0.15)' },
  work: { text: '#06B6D4', bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.3)', glow: 'rgba(6, 182, 212, 0.15)' },
  create: { text: '#EC4899', bg: 'rgba(236, 72, 153, 0.12)', border: 'rgba(236, 72, 153, 0.3)', glow: 'rgba(236, 72, 153, 0.15)' },
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, isFeatured = false }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const Icon = CATEGORY_ICONS[tool.category] || ArrowRight
  const accents = CATEGORY_ACCENTS[tool.category] || {
    text: '#06B6D4',
    bg: 'rgba(6, 182, 212, 0.12)',
    border: 'rgba(6, 182, 212, 0.3)',
    glow: 'rgba(6, 182, 212, 0.15)',
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

  const targetPath = tool.type === 'image-tool' ? `/tools/${tool.slug}` : `/calculators/${tool.slug}`

  // Check if tool is audio, image/graphics, or security for micro-visualizer
  const isAudio = tool.slug.includes('audio') || tool.slug.includes('reverb') || tool.slug.includes('bass') || tool.slug.includes('surround') || tool.slug.includes('spectrum')
  const isSecurity = tool.slug.includes('vault') || tool.slug.includes('password') || tool.slug.includes('watermark')
  const isVisual = tool.type === 'image-tool' || tool.slug.includes('photo') || tool.slug.includes('scanner') || tool.slug.includes('qr')

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`bento-card group rounded-2xl p-5 sm:p-6 flex flex-col justify-between overflow-hidden relative ${
        isFeatured ? 'md:col-span-2 bg-[#141726]' : 'bg-[#11131F]'
      }`}
    >
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
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/[0.08] text-white border border-white/[0.12]">
                {tool.badge}
              </span>
            )}
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md text-slate-400 bg-white/[0.03] border border-white/[0.06]">
              {tool.categoryLabel}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight leading-snug">
          {tool.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed font-sans line-clamp-3">
          {tool.description}
        </p>

        {/* Micro Visualizer */}
        <div className="mt-4 pt-3 border-t border-white/[0.04]">
          {isAudio ? (
            <div className="flex items-center gap-1 h-3 opacity-60 group-hover:opacity-100 transition-opacity">
              <div className="w-1 bg-violet-400 rounded-full h-2 group-hover:h-3 transition-all duration-300 animate-pulse" />
              <div className="w-1 bg-violet-400 rounded-full h-3 group-hover:h-2 transition-all duration-300" />
              <div className="w-1 bg-violet-400 rounded-full h-1.5 group-hover:h-3 transition-all duration-300 animate-pulse delay-75" />
              <div className="w-1 bg-violet-400 rounded-full h-2.5 group-hover:h-1.5 transition-all duration-300" />
              <div className="w-1 bg-violet-400 rounded-full h-1 group-hover:h-3 transition-all duration-300 animate-pulse delay-150" />
              <span className="text-[10px] font-mono text-violet-300/80 ml-2">DSP Real-Time Node</span>
            </div>
          ) : isSecurity ? (
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400/80">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>AES-256-GCM • Zero-Cloud</span>
            </div>
          ) : isVisual ? (
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400/80">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>Canvas2D & Offscreen Engine</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
              <CheckCircle2 className="w-3 h-3 text-slate-400" />
              <span>Standard Indian Calculation</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="relative z-10 mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-500">
          Client-Side
        </span>

        <Link
          to={targetPath}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:text-cyan-300 focus:outline-none focus-visible:underline cursor-pointer"
          aria-label={`Launch ${tool.title}`}
        >
          <span>Launch Tool</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-200" />
        </Link>
      </div>
    </div>
  )
}
