import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES, getToolsByCategory } from '../../data/tools'
import { ToolCard } from '../tools/ToolCard'
import { ToolCategory } from '../../types'

export const CategoryShowcase: React.FC = () => {
  const categoryOrder: ToolCategory[] = ['drive', 'build', 'power', 'money', 'land', 'work', 'create']

  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {categoryOrder.map((catKey, catIdx) => {
          const category = CATEGORIES[catKey]
          const tools = getToolsByCategory(catKey)

          return (
            <motion.div
              key={catKey}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              {/* Category Header */}
              <div className="relative mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200/80">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: category.accentColor }}
                    />
                    <span
                      className="text-[11px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md"
                      style={{
                        backgroundColor: `${category.accentColor}15`,
                        color: category.accentColor,
                      }}
                    >
                      {category.subtitle}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      CATEGORY 0{catIdx + 1} • {tools.length} UTILITIES
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                    <span>{category.title}</span>
                    <span className="text-slate-300 font-light">/</span>
                    <span className="text-slate-500 font-semibold text-lg sm:text-2xl">
                      {category.subtitle}
                    </span>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <Link
                  to={`/category/${catKey}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-indigo-600 border border-slate-200 text-xs font-semibold shadow-2xs hover:border-indigo-300 transition-all shrink-0"
                >
                  <span>Explore All {tools.length} Tools</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Tools Grid for this Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {tools.map((tool, toolIdx) => (
                  <ToolCard key={tool.id} tool={tool} index={toolIdx} />
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
