import React from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { CATEGORIES, getToolsByCategory } from '../data/tools'
import { ToolCard } from '../components/tools/ToolCard'
import { ToolCategory } from '../types'
import { useSEO } from '../hooks/useSEO'

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>()
  const validCategory = categoryId as ToolCategory | undefined

  if (!validCategory || !CATEGORIES[validCategory]) {
    return <Navigate to="/tools" replace />
  }

  const category = CATEGORIES[validCategory]
  const tools = getToolsByCategory(validCategory)

  useSEO({
    title: `${category.title} Tools & Calculators (${category.subtitle}) | IndiaTools`,
    description: category.description,
    canonicalPath: `/category/${category.id}`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${category.title} Tools | IndiaTools`,
      description: category.description,
      url: `https://indiatools-rho.vercel.app/category/${category.id}`,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: tools.map((t, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: t.title,
          url: `https://indiatools-rho.vercel.app${t.seo.canonicalPath}`,
        })),
      },
    },
  })

  return (
    <div className="min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <Link
        to="/tools"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 mb-8 transition-colors font-medium cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Tools</span>
      </Link>

      {/* Category Hero Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-sm mb-12 relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ backgroundColor: category.accentColor }}
        />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: category.accentColor }}
            />
            <span
              className="text-xs font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-md"
              style={{
                backgroundColor: `${category.accentColor}15`,
                color: category.accentColor,
              }}
            >
              {category.subtitle}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {category.title} Calculators
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      {/* Tools List */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          Tools in this Category ({tools.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {tools.map((tool, idx) => (
            <ToolCard key={tool.id} tool={tool} index={idx} />
          ))}
        </div>
      </div>
    </div>
  )
}
