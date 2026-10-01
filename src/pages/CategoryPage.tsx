import React from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { CATEGORIES, getToolsByCategory } from '../data/tools'
import { ToolCard } from '../components/tools/ToolCard'
import { ToolCategory } from '../types'

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>()
  const validCategory = categoryId as ToolCategory | undefined

  if (!validCategory || !CATEGORIES[validCategory]) {
    return <Navigate to="/tools" replace />
  }

  const category = CATEGORIES[validCategory]
  const tools = getToolsByCategory(validCategory)

  return (
    <div className="min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <Link
        to="/tools"
        className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white mb-8 transition-colors font-mono"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Tools</span>
      </Link>

      {/* Category Hero Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900/60 light:bg-white border border-neutral-800 light:border-slate-200 mb-12 relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: category.accentColor }}
        />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: category.accentColor }}
            />
            <span
              className="text-xs font-mono uppercase font-bold tracking-wider"
              style={{ color: category.accentColor }}
            >
              {category.subtitle}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white light:text-slate-900 tracking-tight">
            {category.headline}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-neutral-400 light:text-slate-600 leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      {/* Tools List */}
      <div>
        <h2 className="text-xl font-bold text-white light:text-slate-900 mb-6">
          Tools in this Category ({tools.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  )
}
