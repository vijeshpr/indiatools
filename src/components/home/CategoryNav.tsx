import React, { useMemo } from 'react'
import {
  Layers,
  Volume2,
  FileImage,
  Video,
  FileText,
  IndianRupee,
  ShieldCheck,
  Code2,
  Wrench,
  RotateCcw,
  Sparkles,
  Download,
} from 'lucide-react'
import { TOOLS } from '../../data/tools'

interface CategoryNavProps {
  activeCategory: string
  onSelectCategory: (categoryId: string) => void
  totalFilteredCount?: number
  hasActiveFilters?: boolean
  onResetFilters?: () => void
}

export interface CategoryMeta {
  id: string
  title: string
  icon: React.ElementType
  color: string
  isHub?: boolean
}

export const CATEGORY_TAXONOMY: CategoryMeta[] = [
  { id: 'all', title: 'All Tools', icon: Layers, color: '#FBBF24' },
  { id: 'audio', title: 'Audio & Studio', icon: Volume2, color: '#A855F7' },
  { id: 'image', title: 'Image & Graphics', icon: FileImage, color: '#10B981' },
  { id: 'video', title: 'Video & Screen', icon: Video, color: '#06B6D4' },
  { id: 'pdf', title: 'PDF & Documents', icon: FileText, color: '#F59E0B' },
  { id: 'money', title: 'Money & Finance', icon: IndianRupee, color: '#EAB308' },
  { id: 'security', title: 'Security & Cryptography', icon: ShieldCheck, color: '#10B981' },
  { id: 'developer', title: 'Developer Tools', icon: Code2, color: '#3B82F6' },
  { id: 'utilities', title: 'India & Everyday Utilities', icon: Wrench, color: '#F97316' },
  { id: 'creative', title: 'Creative Download Hub', icon: Download, color: '#EC4899', isHub: true },
]

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  totalFilteredCount,
  hasActiveFilters,
  onResetFilters,
}) => {
  // Dynamically calculate counts directly from TOOLS registry
  const counts = useMemo(() => {
    const map: Record<string, number> = {
      all: TOOLS.length,
      creative: 5, // 5 production creator packs (LUTs, IRs, SFX, Overlays, Templates)
    }

    CATEGORY_TAXONOMY.forEach((cat) => {
      if (cat.id === 'all' || cat.id === 'creative') return
      map[cat.id] = TOOLS.filter((t) => {
        if (t.category === cat.id) return true
        if (cat.id === 'utilities' && ['drive', 'build', 'power', 'land', 'work'].includes(t.category)) {
          return true
        }
        if (cat.id === 'image' && t.category === 'create' && (t.slug.includes('photo') || t.slug.includes('compressor') || t.slug.includes('watermark') || t.slug.includes('scanner') || t.slug.includes('pixel') || t.slug.includes('clear'))) {
          return true
        }
        if (cat.id === 'audio' && (t.category === 'create' || t.category === 'audio') && (t.slug.includes('audio') || t.slug.includes('reverb') || t.slug.includes('bass') || t.slug.includes('surround'))) {
          return true
        }
        if (cat.id === 'video' && t.slug.includes('spectrum')) {
          return true
        }
        if (cat.id === 'pdf' && (t.slug.includes('pdf') || t.slug.includes('print') || t.slug.includes('qr'))) {
          return true
        }
        if (cat.id === 'security' && (t.slug.includes('vault') || t.slug.includes('watermark') || t.slug.includes('tracer'))) {
          return true
        }
        if (cat.id === 'developer' && (t.slug.includes('ai-token') || t.slug.includes('experience'))) {
          return true
        }
        return false
      }).length
    })

    return map
  }, [])

  const handleCategoryClick = (cat: CategoryMeta) => {
    if (cat.isHub) {
      const hubEl = document.getElementById('creative-hub') || document.getElementById('asset-hub')
      if (hubEl) {
        hubEl.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    onSelectCategory(cat.id)
    const catalogEl = document.getElementById('garden-catalogue')
    if (catalogEl && window.scrollY > catalogEl.offsetTop + 200) {
      catalogEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div
      id="category-explorer"
      className="sticky top-20 sm:top-22 z-30 w-full py-3.5 bg-[#071911]/95 backdrop-blur-2xl border-y border-emerald-500/20 shadow-2xl transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2.5">
        {/* Section Header Label & Subtitle */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-amber-300">
              EXPLORE BY CATEGORY
            </span>
            <span className="hidden sm:inline text-xs text-emerald-400/60">•</span>
            <span className="hidden sm:inline text-xs text-slate-300 font-sans">
              Choose a collection to discover the tools you need.
            </span>
          </div>

          {hasActiveFilters && onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-200 text-xs font-mono font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset filter</span>
            </button>
          )}
        </div>

        {/* Scrollable Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar scroll-smooth">
          {CATEGORY_TAXONOMY.map((cat) => {
            const Icon = cat.icon
            const isSelected = activeCategory === cat.id
            const count = counts[cat.id] ?? 0

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className={`group shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-950/60 ring-2 ring-amber-300/60 scale-[1.02]'
                    : 'bg-[#0E261B]/80 hover:bg-[#133526] text-slate-200 hover:text-white border border-emerald-500/20 hover:border-emerald-400/40'
                }`}
              >
                <Icon
                  className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110"
                  style={{ color: isSelected ? '#FFFFFF' : cat.color }}
                />
                <span className="whitespace-nowrap">{cat.title}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-semibold ${
                    isSelected
                      ? 'bg-black/30 text-amber-200'
                      : 'bg-black/40 text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
