import React, { useState, useMemo, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Search,
  X,
  Languages,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Home,
  SlidersHorizontal,
  Compass,
  Check,
  Globe2,
} from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import {
  DirectoryLangCode,
  DIRECTORY_LOCALES,
  DIRECTORY_LANG_CODES,
  isDirectoryLangCode,
  DIRECTORY_UI,
  getDirectoryToolsForLocale,
  getDirectoryPageCanonical,
  getDirectoryPagePath,
} from '../data/directory'

const CATEGORY_KEYS = [
  'drive',
  'build',
  'power',
  'money',
  'land',
  'work',
  'create',
] as const

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  drive: { bg: 'bg-orange-500/10 dark:bg-orange-500/20', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/30' },
  build: { bg: 'bg-amber-500/10 dark:bg-amber-500/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30' },
  power: { bg: 'bg-blue-500/10 dark:bg-blue-500/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/30' },
  money: { bg: 'bg-purple-500/10 dark:bg-purple-500/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/30' },
  land: { bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30' },
  work: { bg: 'bg-indigo-500/10 dark:bg-indigo-500/20', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/30' },
  create: { bg: 'bg-pink-500/10 dark:bg-pink-500/20', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-500/30' },
}

export const AllToolsDirectoryPage: React.FC = () => {
  const { langCode: rawLangCode } = useParams<{ langCode?: string }>()

  // Validate language parameter; fallback to 'en'
  const langCode: DirectoryLangCode = useMemo(() => {
    if (!rawLangCode) return 'en'
    if (isDirectoryLangCode(rawLangCode)) return rawLangCode
    return 'en'
  }, [rawLangCode])

  const currentLocale = DIRECTORY_LOCALES[langCode]
  const ui = DIRECTORY_UI[langCode] || DIRECTORY_UI.en
  const isRtl = currentLocale.dir === 'rtl'

  // Search & Category state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isLangSwitcherOpen, setIsLangSwitcherOpen] = useState(false)

  // Sync document lang and dir attribute
  useEffect(() => {
    document.documentElement.lang = currentLocale.bcp47
    document.documentElement.dir = currentLocale.dir
    return () => {
      document.documentElement.lang = 'en-IN'
      document.documentElement.dir = 'ltr'
    }
  }, [currentLocale])

  // Fetch all 68 tools with translations for the current language
  const allEnhancedTools = useMemo(() => {
    return getDirectoryToolsForLocale(langCode)
  }, [langCode])

  // Count tools per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allEnhancedTools.length }
    for (const item of allEnhancedTools) {
      const cat = item.tool.category
      counts[cat] = (counts[cat] || 0) + 1
    }
    return counts
  }, [allEnhancedTools])

  // Filter tools based on search and category
  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return allEnhancedTools.filter((item) => {
      // Category match
      if (selectedCategory !== 'all' && item.tool.category !== selectedCategory) {
        return false
      }

      // Query match
      if (!q) return true

      const nameMatch = item.localizedName.toLowerCase().includes(q)
      const descMatch = item.localizedDescription.toLowerCase().includes(q)
      const enTitleMatch = item.tool.title.toLowerCase().includes(q)
      const slugMatch = item.tool.slug.toLowerCase().includes(q)
      const keywordMatch = item.tool.searchKeywords?.some((kw) => kw.toLowerCase().includes(q))
      const tagMatch = item.tool.tags?.some((tag) => tag.toLowerCase().includes(q))

      return nameMatch || descMatch || enTitleMatch || slugMatch || keywordMatch || tagMatch
    })
  }, [allEnhancedTools, selectedCategory, searchQuery])

  // Build full reciprocal hreflang alternate links
  const hreflangs = useMemo(() => {
    const list = [
      { lang: 'x-default', href: 'https://indiatools-rho.vercel.app/all-tools' },
      { lang: 'en-IN', href: 'https://indiatools-rho.vercel.app/all-tools' },
    ]
    for (const code of DIRECTORY_LANG_CODES) {
      if (code === 'en') continue
      const meta = DIRECTORY_LOCALES[code]
      list.push({
        lang: meta.bcp47,
        href: `https://indiatools-rho.vercel.app/all-tools/${code}`,
      })
    }
    return list
  }, [])

  // Structured Data (BreadcrumbList + CollectionPage / ItemList)
  const canonicalUrl = getDirectoryPageCanonical(langCode)
  const canonicalPath = getDirectoryPagePath(langCode)

  const jsonLd = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: ui.breadcrumbs.home,
              item: 'https://indiatools-rho.vercel.app/',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: ui.breadcrumbs.directory,
              item: canonicalUrl,
            },
          ],
        },
        {
          '@type': 'CollectionPage',
          '@id': canonicalUrl,
          url: canonicalUrl,
          name: ui.h1,
          description: ui.metaDescription,
          inLanguage: currentLocale.bcp47,
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: allEnhancedTools.length,
            itemListElement: allEnhancedTools.map((t, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: t.localizedName,
              description: t.localizedDescription,
              url: `https://indiatools-rho.vercel.app${t.destinationUrl}`,
            })),
          },
        },
      ],
    }
  }, [canonicalUrl, currentLocale, ui, allEnhancedTools])

  useSEO({
    title: ui.title,
    description: ui.metaDescription,
    canonicalPath,
    hreflangs,
    jsonLd,
  })

  return (
    <div
      dir={currentLocale.dir}
      className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors ${
        isRtl ? 'rtl text-right' : 'ltr text-left'
      }`}
    >
      {/* Hero Header Section */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-slate-50 dark:from-slate-900/80 dark:via-slate-900/50 dark:to-slate-950 py-10 md:py-14">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-white/[0.03] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className={`flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 ${
              isRtl ? 'flex-row-reverse' : ''
            }`}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{ui.breadcrumbs.home}</span>
            </Link>
            <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {ui.breadcrumbs.directory}
            </span>
            {langCode !== 'en' && (
              <>
                <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-mono text-[11px]">
                  {currentLocale.nativeName}
                </span>
              </>
            )}
          </nav>

          {/* Badges & Meta */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white shadow-sm shadow-blue-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{ui.totalToolsLabel}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
              <Languages className="w-3.5 h-3.5" />
              <span>{ui.availableLanguagesBadge}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Globe2 className="w-3.5 h-3.5" />
              <span>{currentLocale.nativeName} ({currentLocale.name})</span>
            </span>
          </div>

          {/* Main Title & Subtitle */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
            {ui.h1}
          </h1>
          <p className="max-w-3xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
            {ui.subtitle}
          </p>

          {/* Language Selector Bar */}
          <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-950/5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {ui.multilingualBadge}:
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  (22 Scheduled Indian Languages + English)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsLangSwitcherOpen((prev) => !prev)}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline md:hidden"
              >
                {isLangSwitcherOpen ? 'Collapse Languages' : 'Show All Languages'}
              </button>
            </div>

            {/* Language Pills Grid */}
            <div
              className={`grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 transition-all duration-300 ${
                isLangSwitcherOpen ? 'block' : 'max-md:hidden'
              }`}
            >
              {DIRECTORY_LANG_CODES.map((code) => {
                const meta = DIRECTORY_LOCALES[code]
                const isActive = code === langCode
                const targetUrl = code === 'en' ? '/all-tools' : `/all-tools/${code}`

                return (
                  <Link
                    key={code}
                    to={targetUrl}
                    className={`group relative flex flex-col items-center justify-center py-2 px-2.5 rounded-xl text-center transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
                        : 'bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/50'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-medium leading-snug">
                      {meta.nativeName}
                    </span>
                    <span
                      className={`text-[10px] tracking-tight leading-none mt-0.5 ${
                        isActive ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {meta.name}
                    </span>
                    {isActive && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] shadow">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Search & Category Filter Section */}
        <div className="space-y-5 mb-8">
          {/* Search Box */}
          <div className="relative max-w-2xl">
            <div
              className={`absolute top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none ${
                isRtl ? 'right-4' : 'left-4'
              }`}
            >
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={ui.searchPlaceholder}
              className={`w-full py-3.5 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm sm:text-base transition-all ${
                isRtl ? 'pr-12 pl-12' : 'pl-12 pr-12'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label={ui.clearSearchLabel}
                className={`absolute top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  isRtl ? 'left-3' : 'right-3'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`flex-shrink-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{ui.allCategoriesLabel}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === 'all'
                    ? 'bg-slate-800 text-slate-300 dark:bg-slate-200 dark:text-slate-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {categoryCounts.all}
              </span>
            </button>

            {CATEGORY_KEYS.map((catKey) => {
              const isSelected = selectedCategory === catKey
              const count = categoryCounts[catKey] || 0
              const label = ui.categoryLabels[catKey] || catKey

              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setSelectedCategory(catKey)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Results Count & Current Filter Bar */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60 pt-3">
            <span>
              Showing <strong className="text-slate-900 dark:text-slate-100">{filteredTools.length}</strong> of {allEnhancedTools.length} tools
              {selectedCategory !== 'all' && (
                <span> in <em>{ui.categoryLabels[selectedCategory] || selectedCategory}</em></span>
              )}
              {searchQuery && (
                <span> matching &ldquo;<span className="text-blue-600 dark:text-blue-400">{searchQuery}</span>&rdquo;</span>
              )}
            </span>

            {(searchQuery || selectedCategory !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                {ui.clearSearchLabel}
              </button>
            )}
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((item) => {
              const catColor = CATEGORY_COLORS[item.tool.category] || CATEGORY_COLORS.create
              const catLabel = ui.categoryLabels[item.tool.category] || item.tool.categoryLabel

              return (
                <div
                  key={item.tool.slug}
                  className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/50 shadow-sm hover:shadow-xl transition-all duration-200"
                >
                  <div>
                    {/* Header: Category Badge & Flags */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${catColor.bg} ${catColor.text} ${catColor.border}`}
                      >
                        {catLabel}
                      </span>
                      {item.tool.badge && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {item.tool.badge}
                        </span>
                      )}
                    </div>

                    {/* Tool Localized Title */}
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-2">
                      <Link to={item.destinationUrl} className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {item.localizedName}
                      </Link>
                    </h2>

                    {/* Natural Localized Description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4">
                      {item.localizedDescription}
                    </p>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>{ui.openToolLabel}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                    </span>
                    <span className="text-[10px] font-mono font-normal text-slate-400 dark:text-slate-500">
                      {item.tool.slug}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-xl mx-auto">
            <Compass className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-500 mb-3 stroke-[1.5]" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              {ui.noResultsFound}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              {ui.noResultsSuggestion}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <span>{ui.clearSearchLabel}</span>
            </button>
          </div>
        )}

        {/* Bottom Internal Linking / Regional Language Discovery Section */}
        <section className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {ui.featuredSectionTitle}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              IndiaTools is engineered to empower Indian citizens, students, builders, and vehicle owners in their native mother tongue with zero tracking and full in-browser privacy.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
            {DIRECTORY_LANG_CODES.map((code) => {
              const meta = DIRECTORY_LOCALES[code]
              const targetUrl = code === 'en' ? '/all-tools' : `/all-tools/${code}`
              const isCurrent = code === langCode

              return (
                <Link
                  key={`footer-lang-${code}`}
                  to={targetUrl}
                  className={`p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700 font-semibold text-blue-700 dark:text-blue-300'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className="font-medium text-slate-900 dark:text-white">
                    {meta.nativeName}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {meta.name} ({meta.script})
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}

export default AllToolsDirectoryPage
