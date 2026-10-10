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
              {/* Refined Category Header */}
              <div className="relative mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 dark:border-white/10 light:border-slate-200 pb-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: category.accentColor }}
                    />
                    <span
                      className="text-[11px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border"
                      style={{
                        backgroundColor: `${category.accentColor}18`,
                        borderColor: `${category.accentColor}40`,
                        color: category.accentColor,
                      }}
                    >
                      {category.subtitle}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400 light:text-slate-500">
                      Category 0{catIdx + 1} • {tools.length} Tools
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white light:text-slate-900 flex items-center gap-3">
                    <span>{category.title}</span>
                    <span className="text-neutral-600 font-light text-xl sm:text-3xl">/</span>
                    <span className="text-neutral-300 light:text-slate-700 font-semibold text-lg sm:text-2xl">
                      {category.subtitle}
                    </span>
                  </h2>

                  <p className="text-xs sm:text-sm text-neutral-400 light:text-slate-600 max-w-2xl leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <Link
                  to={`/category/${catKey}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors shrink-0 group"
                >
                  <span>Explore All {tools.length} Tools</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
