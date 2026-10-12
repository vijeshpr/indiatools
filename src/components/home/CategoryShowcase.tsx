import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES, getToolsByCategory } from '../../data/tools'
import { ToolCard } from '../tools/ToolCard'
import { ToolCategory } from '../../types'
import {
  BuildMixerMascot,
  DriveCarMascot,
  PowerEnergyMascot,
  MoneyRupeeMascot,
  WorkProfessionalMascot,
  LandSurveyMascot,
  PhotoDocMascot,
} from '../mascot/CategoryMascots'
import { useI18n } from '../../i18n/I18nContext'

export const CategoryShowcase: React.FC = () => {
  const { t } = useI18n()
  const categoryOrder: ToolCategory[] = ['drive', 'build', 'power', 'money', 'land', 'work', 'create']

  const renderHeaderMascot = (catKey: ToolCategory) => {
    switch (catKey) {
      case 'build':
        return <BuildMixerMascot size={74} />
      case 'drive':
        return <DriveCarMascot size={74} />
      case 'power':
        return <PowerEnergyMascot size={74} />
      case 'money':
        return <MoneyRupeeMascot size={74} />
      case 'work':
        return <WorkProfessionalMascot size={74} />
      case 'land':
        return <LandSurveyMascot size={74} />
      case 'create':
      default:
        return <PhotoDocMascot size={74} />
    }
  }

  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {categoryOrder.map((catKey, catIdx) => {
          const category = CATEGORIES[catKey]
          const tools = getToolsByCategory(catKey)
          const catTitle = t(`cat.${catKey}.title`, category.title)
          const catSubtitle = t(`cat.${catKey}.subtitle`, category.subtitle)
          const catDesc = t(`cat.${catKey}.desc`, category.description)

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
              <div className="relative mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
                {/* Luminous Accent Border Line */}
                <div
                  className="absolute -bottom-px left-0 h-[2px] w-32 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${category.accentColor}, transparent)`,
                  }}
                />

                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Category Animated Mascot Icon Badge */}
                  <div className="hidden sm:flex items-center justify-center p-2 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-slate-200/90 dark:border-white/10 shadow-xs shrink-0">
                    {renderHeaderMascot(catKey)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="text-[10px] font-mono uppercase tracking-widest font-black px-2.5 py-0.5 rounded-full border shadow-2xs"
                        style={{
                          background: `linear-gradient(135deg, ${category.accentColor}25, ${category.accentColor}08)`,
                          color: category.accentColor,
                          borderColor: `${category.accentColor}40`,
                        }}
                      >
                        {catTitle.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 font-semibold">
                        CATEGORY 0{catIdx + 1} • {tools.length} UTILITIES
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                      <span>{catTitle}</span>
                      <span className="text-slate-300 dark:text-zinc-700 font-light">/</span>
                      <span className="bg-gradient-to-r from-slate-700 to-slate-500 dark:from-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent font-extrabold text-lg sm:text-2xl">
                        {catSubtitle}
                      </span>
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                      {catDesc}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/category/${catKey}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#131B2E] hover:bg-slate-50 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-800 text-xs font-semibold shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all shrink-0 cursor-pointer"
                >
                  <span>{t('cat.exploreAll', `Explore All ${tools.length} Tools`)}</span>
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
