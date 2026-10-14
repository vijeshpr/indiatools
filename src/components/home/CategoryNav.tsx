import React, { useMemo } from 'react'
import {
  Layers,
  Volume2,
  FileImage,
  Video,
  FileText,
  IndianRupee,
  ShieldCheck,
  Code,
  Wrench,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { TOOLS } from '../../data/tools'

interface CategoryNavProps {
  activeCategory: string
  onSelectCategory: (categoryId: string) => void
  totalFilteredCount?: number
  hasActiveFilters?: boolean
  onResetFilters?: () => void
}

interface CategoryMeta {
  id: string
  title: string
  icon: React.ElementType
  color: string
}

const TAXONOMY: CategoryMeta[] = [
  { id: 'all', title: 'All Tools', icon: Layers, color: '#D8B879' },
  { id: 'audio', title: 'Audio & Studio', icon: Volume2, color: '#A855F7' },
  { id: 'image', title: 'Image & Graphics', icon: FileImage, color: '#10B981' },
  { id: 'video', title: 'Video & Screen', icon: Video, color: '#06B6D4' },
  { id: 'pdf', title: 'PDF & Documents', icon: FileText, color: '#F59E0B' },
  { id: 'money', title: 'Money & Finance', icon: IndianRupee, color: '#D8B879' },
  { id: 'security', title: 'Security & Crypto', icon: ShieldCheck, color: '#16865D' },
  { id: 'developer', title: 'Developer Tools', icon: Code, color: '#3B82F6' },
  { id: 'utilities', title: 'India & Everyday Utilities', icon: Wrench, color: '#F97316' },
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
    }

    TAXONOMY.forEach((cat) => {
      if (cat.id === 'all') return
      map[cat.id] = TOOLS.filter((t) => {
        if (t.category === cat.id) return true
        // Category alias matching
        if (cat.id === 'utilities' && ['drive', 'build', 'power', 'land', 'work'].includes(t.category)) {
          return true
        }
        if (cat.id === 'image' && t.category === 'create' && (t.slug.includes('photo') || t.slug.includes('compressor') || t.slug.includes('watermark') || t.slug.includes('scanner') || t.slug.includes('pixel') || t.slug.includes('clear'))) {
          return true
        }
        if (cat.id === 'audio' && t.category === 'create' && (t.slug.includes('audio') || t.slug.includes('reverb') || t.slug.includes('bass') || t.slug.includes('surround'))) {
          return true
        }
        if (cat.id === 'video' && t.slug.includes('spectrum')) {
          return true
        }
        if (cat.id === 'pdf' && (t.slug.includes('pdf') || t.slug.includes('print') || t.slug.includes('qr'))) {
          return true
        }
        if (cat.id === 'security' && (t.slug.includes('vault') || t.slug.includes('watermark'))) {
          return true
        }
        if (cat.id === 'developer' && t.slug.includes('ai-token')) {
          return true
        }
        return false
      }).length
    })

    return map
  }, [])

  return (
    <div id="category-explorer" className="sticky top-20 sm:top-22 z-30 w-full py-3 bg-[#0A1A12]/95 backdrop-blur-2xl border-y border-emerald-500/20 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
        {/* Section Header Label & Subtitle */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#D8B879]" />
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-[#D8B879]">
              EXPLORE BY CATEGORY
            </span>
            <span className="hidden sm:inline text-xs text-[#A8C5AC]/60">•</span>
            <span className="hidden sm:inline text-xs text-[#A8C5AC]">
              Choose a collection to discover the tools you need.
            </span>
          </div>

          {/* Reset Filters Chip */}
          {hasActiveFilters && onResetFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 text-[11px] font-mono text-[#D8B879] hover:text-[#F3F0E5] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset filter</span>
            </button>
          )}
        </div>

        {/* Horizontally Scrollable Category Chips */}
        <div
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth flex-1 min-w-0"
          role="tablist"
          aria-label="Filter tools by collection"
        >
          {TAXONOMY.map((cat) => {
            const isSelected = activeCategory === cat.id
            const count = counts[cat.id] || 0
            const Icon = cat.icon

            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 select-none ${
                  isSelected
                    ? 'bg-[#16865D] text-[#F3F0E5] border border-[#D8B879]/50 shadow-lg shadow-emerald-950/60'
                    : 'bg-[#10271C]/80 text-[#A8C5AC] hover:text-[#F3F0E5] hover:bg-[#163628] border border-emerald-500/15'
                }`}
              >
                <Icon
                  className="w-3.5 h-3.5 shrink-0 transition-colors"
                  style={{ color: isSelected ? '#D8B879' : cat.color }}
                />
                <span>{cat.title}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    isSelected
                      ? 'bg-black/40 text-[#D8B879] font-bold'
                      : 'bg-black/30 text-[#A8C5AC]/70'
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
