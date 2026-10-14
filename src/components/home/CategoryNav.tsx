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
    <div className="sticky top-20 sm:top-22 z-30 w-full py-2 bg-[#090A0F]/85 backdrop-blur-xl border-y border-white/[0.06] transition-all">
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
            const title = isAll ? 'All Tools' : cat?.title || catKey
            const count = counts[catKey] || 0
            const Icon = CATEGORY_ICONS[catKey] || Layers
            const isSelected = activeCategory === catKey
            const accentColor = isAll ? '#06B6D4' : cat?.accentColor || '#06B6D4'

            return (
              <button
                key={catKey}
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectCategory(catKey)}
                className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 select-none ${
                  isSelected
                    ? 'bg-white/15 text-white border border-white/25 shadow-md'
                    : 'bg-white/[0.03] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] border border-white/[0.05]'
                }`}
                style={
                  isSelected
                    ? {
                        boxShadow: `0 0 16px -4px ${accentColor}40`,
                        borderColor: `${accentColor}80`,
                      }
                    : undefined
                }
              >
                <Icon
                  className="w-3.5 h-3.5 shrink-0 transition-colors"
                  style={{ color: isSelected ? accentColor : undefined }}
                />
                <span>{title}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-white/20 text-white font-bold' : 'bg-white/[0.04] text-slate-500'
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
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/20 transition-colors shrink-0 cursor-pointer"
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
