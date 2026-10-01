import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { CATEGORIES, getToolsByCategory } from '../../data/tools'
import { ToolCard } from '../tools/ToolCard'
import { ToolCategory } from '../../types'

export const CategoryShowcase: React.FC = () => {
  const categoryOrder: ToolCategory[] = ['drive', 'build', 'power', 'money', 'land', 'work', 'create']

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28">
        {categoryOrder.map((catKey, catIdx) => {
          const category = CATEGORIES[catKey]
          const tools = getToolsByCategory(catKey)

          return (
            <div key={catKey} className="relative">
              {/* Giant Cinematic Category Backdrop Headline */}
              <div className="relative mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800/80 light:border-slate-200 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: category.accentColor }}
                    />
                    <span
                      className="text-xs font-mono uppercase tracking-widest font-bold"
                      style={{ color: category.accentColor }}
                    >
                      Category {catIdx + 1} of {categoryOrder.length} • {category.subtitle}
                    </span>
                  </div>

                  <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white light:text-slate-900">
                    {category.headline}
                  </h2>

                  <p className="mt-2 text-sm sm:text-base text-neutral-400 light:text-slate-600 max-w-xl">
                    {category.description}
                  </p>
                </div>

                <Link
                  to={`/category/${catKey}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors shrink-0"
                >
                  <span>Explore All {tools.length} Tools</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Tools Grid for this Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
