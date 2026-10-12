import React, { useState, useMemo } from 'react'
import { Search, Wrench } from 'lucide-react'
import { TOOLS, CATEGORIES } from '../data/tools'
import { ToolCard } from '../components/tools/ToolCard'
import { ToolCategory } from '../types'
import { useSEO } from '../hooks/useSEO'
import { useI18n } from '../i18n/I18nContext'

interface ToolsCatalogPageProps {
  popularOnly?: boolean
}

export const ToolsCatalogPage: React.FC<ToolsCatalogPageProps> = ({ popularOnly = false }) => {
  const { t } = useI18n()
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useSEO({
    title: popularOnly
      ? 'Popular Tools & Calculators | IndiaTools'
      : 'All Tools & Calculators – Free Online Toolbox | IndiaTools',
    description: popularOnly
      ? 'Discover the most popular Indian online calculators and image tools for vehicle mileage, JCB fuel, 50KB photos, and electricity bills.'
      : 'Browse all 40+ practical online calculators and tools for vehicle costs, civil construction, power bills, salary tax, and image compression.',
    canonicalPath: popularOnly ? '/popular' : '/tools',
  })

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      if (popularOnly && !['Popular', 'Flagship', 'Govt Exam Special', 'Essential'].includes(tool.badge || '')) {
        return false
      }
      const matchesCat = selectedCategory === 'all' || tool.category === selectedCategory
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags.some((t) => t.toLowerCase().includes(q))
      return matchesCat && matchesSearch
    })
  }, [selectedCategory, searchQuery, popularOnly])

  return (
    <div className="min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-mono font-bold uppercase mb-3">
          <Wrench className="w-3.5 h-3.5" />
          <span>{popularOnly ? 'Top Rated Utilities' : t('hero.eyebrow', 'The Practical Toolbox')}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          {popularOnly ? 'Popular Indian Tools' : t('nav.allTools', 'All Tools & Calculators')}
        </h1>
        <p className="mt-2.5 text-sm sm:text-base text-slate-600">
          {popularOnly
            ? 'The most frequently calculated utilities across automotive, construction, power, and exam documents.'
            : t('hero.description', 'Explore our complete suite of precision utilities crafted for real-life Indian problems.')}
        </p>

        {/* Filter Search Input */}
        <div className="mt-6 relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('hero.searchPlaceholder', 'Search mileage, JCB, 50KB photo, cent, solar...')}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 shadow-sm"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {t('cat.all', 'All Tools')} ({TOOLS.length})
        </button>

        {Object.values(CATEGORIES).map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/20'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.accentColor }} />
            <span>{t(`cat.${cat.id}.title`, cat.title)}</span>
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTools.map((tool, idx) => (
            <ToolCard key={tool.id} tool={tool} index={idx} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-slate-500">
          <p className="text-base font-semibold">No tools found matching "{searchQuery}"</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
            }}
            className="mt-3 text-xs text-indigo-600 underline font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  )
}
