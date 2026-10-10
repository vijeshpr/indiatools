import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Layers } from 'lucide-react'
import { CATEGORIES, getToolsByCategory } from '../data/tools'
import { useSEO } from '../hooks/useSEO'

export const CategoriesOverviewPage: React.FC = () => {
  useSEO({
    title: 'Tool Categories – Browse Utilities by Sector | IndiaTools',
    description:
      'Explore practical tools categorized by Drive, Build, Power, Money, Land, Work, and Create. Designed for real-world Indian applications.',
    canonicalPath: '/categories',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Tool Categories | IndiaTools',
      description:
        'Explore practical tools categorized by Drive, Build, Power, Money, Land, Work, and Create.',
      url: 'https://indiatools-rho.vercel.app/categories',
    },
  })

  return (
    <div className="min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-mono font-bold uppercase mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>7 Practical Sectors</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Explore by Category
        </h1>
        <p className="mt-2.5 text-sm sm:text-base text-slate-600">
          Find purpose-built tools organized across vehicles, construction, power, finance, land, career, and documents.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(CATEGORIES).map((cat, idx) => {
          const tools = getToolsByCategory(cat.id)
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.accentColor }} />
                    <span className="text-xs font-mono font-bold uppercase text-slate-500">
                      {cat.subtitle}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                    {tools.length} Tools
                  </span>
                </div>

                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                  {cat.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mb-6 leading-relaxed">
                  {cat.description}
                </p>

                {/* Popular tools preview */}
                <div className="space-y-2 mb-6">
                  {tools.slice(0, 3).map((tool) => (
                    <Link
                      key={tool.id}
                      to={tool.type === 'image-tool' ? `/tools/${tool.slug}` : `/calculators/${tool.slug}`}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 hover:bg-indigo-50/60 hover:text-indigo-700 hover:border-indigo-200 transition-colors"
                    >
                      <span className="truncate font-medium">{tool.title}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to={`/category/${cat.id}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white text-xs font-bold text-slate-800 transition-all cursor-pointer"
              >
                <span>View All {tools.length} {cat.title} Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
