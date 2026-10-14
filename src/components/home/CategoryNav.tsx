import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Car,
  HardHat,
  Zap,
  IndianRupee,
  MapPin,
  Briefcase,
  FileImage,
  Layers,
  RotateCcw,
} from 'lucide-react'
import { CATEGORIES, TOOLS } from '../../data/tools'
import type { ToolCategory } from '../../types'

interface CategoryNavProps {
  activeCategory: string
  onSelectCategory: (categoryId: string) => void
  totalFilteredCount?: number
  hasActiveFilters?: boolean
  onResetFilters?: () => void
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  all: Layers,
  create: FileImage,
  power: Zap,
  money: IndianRupee,
  drive: Car,
  build: HardHat,
  land: MapPin,
  work: Briefcase,
}

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
    Object.keys(CATEGORIES).forEach((key) => {
      map[key] = TOOLS.filter((t) => t.category === key).length
    })
    return map
  }, [])

  // Order categories logically: all, create (largest), power, money, drive, build, land, work
  const orderedCategoryKeys = ['all', 'create', 'power', 'money', 'drive', 'build', 'land', 'work']

  return (
    <div className="sticky top-20 sm:top-22 z-30 w-full py-2.5 bg-[#07130E]/90 backdrop-blur-2xl border-y border-emerald-500/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Horizontal Scrollable Chips Row */}
        <div
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth flex-1 min-w-0"
          role="tablist"
          aria-label="Filter tools by category"
        >
          {orderedCategoryKeys.map((catKey) => {
            const isAll = catKey === 'all'
            const cat = isAll ? null : CATEGORIES[catKey as ToolCategory]
            const title = isAll ? 'All Garden Tools' : cat?.title || catKey
            const count = counts[catKey] || 0
            const Icon = CATEGORY_ICONS[catKey] || Layers
            const isSelected = activeCategory === catKey
            const accentColor = isAll ? '#D8B879' : cat?.accentColor || '#16865D'

            return (
              <button
                key={catKey}
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectCategory(catKey)}
                className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 select-none ${
                  isSelected
                    ? 'bg-[#16865D] text-[#F3F0E5] border border-[#D8B879]/50 shadow-lg shadow-emerald-950/60'
                    : 'bg-[#10271C]/80 text-[#A8C5AC] hover:text-[#F3F0E5] hover:bg-[#163628] border border-emerald-500/15'
                }`}
              >
                <Icon
                  className="w-3.5 h-3.5 shrink-0 transition-colors"
                  style={{ color: isSelected ? '#D8B879' : undefined }}
                />
                <span>{title}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-black/40 text-[#D8B879] font-bold' : 'bg-black/30 text-[#A8C5AC]/70'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Reset Filter Button if active */}
        {hasActiveFilters && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono text-[#D8B879] hover:text-[#F3F0E5] hover:bg-[#16865D]/20 border border-[#D8B879]/30 transition-colors shrink-0 cursor-pointer"
            aria-label="Reset category and search filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>
    </div>
  )
}
