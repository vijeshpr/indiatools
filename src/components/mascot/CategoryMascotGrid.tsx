import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, Variants } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import {
  BuildMixerMascot,
  DriveCarMascot,
  JcbExcavatorMascot,
  PowerEnergyMascot,
  MoneyRupeeMascot,
  WorkProfessionalMascot,
  PhotoDocMascot,
} from './CategoryMascots'

interface CategoryMascotItem {
  id: string
  title: string
  categoryName: string
  badge: string
  mascotDesc: string
  description: string
  route: string
  accentColor: string
  borderHover: string
  glowColor: string
  renderMascot: (isHovered: boolean) => React.ReactNode
}

const MASCOT_ITEMS: CategoryMascotItem[] = [
  {
    id: 'build',
    title: 'Build',
    categoryName: 'Construction & Materials',
    badge: '7 Utilities',
    mascotDesc: 'Orange Mixer Truck • Rotating Drum',
    description: 'Cement, concrete, bricks, paint estimators & turnkey civil costs.',
    route: '/category/build',
    accentColor: '#EAB308',
    borderHover: 'hover:border-amber-400 dark:hover:border-amber-500/60',
    glowColor: 'rgba(234, 179, 8, 0.15)',
    renderMascot: (isHovered) => <BuildMixerMascot isHovered={isHovered} size={110} />,
  },
  {
    id: 'drive',
    title: 'Drive',
    categoryName: 'Vehicle & Travel',
    badge: '8 Utilities',
    mascotDesc: 'Indian Compact Car • Spinning Wheels',
    description: 'Mileage analytics, trip splits, EV vs petrol comparisons & running costs.',
    route: '/category/drive',
    accentColor: '#F97316',
    borderHover: 'hover:border-orange-400 dark:hover:border-orange-500/60',
    glowColor: 'rgba(249, 115, 22, 0.15)',
    renderMascot: (isHovered) => <DriveCarMascot isHovered={isHovered} size={110} />,
  },
  {
    id: 'jcb',
    title: 'Heavy JCB',
    categoryName: 'Excavator Fuel Cost',
    badge: 'Flagship Tool',
    mascotDesc: 'Yellow Excavator • Articulated Boom',
    description: 'Hourly, daily, and monthly diesel expenditure for JCB 3DX & excavators.',
    route: '/calculators/jcb-fuel-cost',
    accentColor: '#EAB308',
    borderHover: 'hover:border-yellow-400 dark:hover:border-yellow-500/60',
    glowColor: 'rgba(234, 179, 8, 0.18)',
    renderMascot: (isHovered) => <JcbExcavatorMascot isHovered={isHovered} size={110} />,
  },
  {
    id: 'power',
    title: 'Power',
    categoryName: 'Energy & Home',
    badge: '8 Utilities',
    mascotDesc: 'Electric Symbol • Pulsing Plasma Glow',
    description: 'DISCOM tariff slabs, AC power units, inverter backups & rooftop solar.',
    route: '/category/power',
    accentColor: '#3B82F6',
    borderHover: 'hover:border-blue-400 dark:hover:border-blue-500/60',
    glowColor: 'rgba(59, 130, 246, 0.15)',
    renderMascot: (isHovered) => <PowerEnergyMascot isHovered={isHovered} size={110} />,
  },
  {
    id: 'money',
    title: 'Money',
    categoryName: 'Salary & Finance',
    badge: '8 Utilities',
    mascotDesc: 'Golden Rupee ₹ • Floating Shine Glint',
    description: 'New Tax Regime in-hand take home, appraisal hikes, loans & compounding.',
    route: '/category/money',
    accentColor: '#8B5CF6',
    borderHover: 'hover:border-purple-400 dark:hover:border-purple-500/60',
    glowColor: 'rgba(139, 92, 246, 0.15)',
    renderMascot: (isHovered) => <MoneyRupeeMascot isHovered={isHovered} size={110} />,
  },
  {
    id: 'work',
    title: 'Work',
    categoryName: 'Career & HR',
    badge: '2 Utilities',
    mascotDesc: 'Office Professional • Friendly Wave',
    description: 'Resume experience tenure verification, career gap audits & overtime wages.',
    route: '/category/work',
    accentColor: '#6366F1',
    borderHover: 'hover:border-indigo-400 dark:hover:border-indigo-500/60',
    glowColor: 'rgba(99, 102, 241, 0.15)',
    renderMascot: (isHovered) => <WorkProfessionalMascot isHovered={isHovered} size={110} />,
  },
  {
    id: 'photo',
    title: 'Photo & Docs',
    categoryName: 'Photo & Exam Documents',
    badge: '6 Utilities',
    mascotDesc: 'ID Card & Camera • Flash Sparkle',
    description: '100% private in-browser image optimization for UPSC, SSC & passport photos.',
    route: '/category/create',
    accentColor: '#EC4899',
    borderHover: 'hover:border-pink-400 dark:hover:border-pink-500/60',
    glowColor: 'rgba(236, 72, 153, 0.15)',
    renderMascot: (isHovered) => <PhotoDocMascot isHovered={isHovered} size={110} />,
  },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
}

export const CategoryMascotGrid: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <section className="py-12 sm:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>INTERACTIVE COMPANIONS & CATEGORIES</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Explore Categories with Animated Mascots
          </h2>

          <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Meet our 7 animated companions representing every essential calculation area —
            crafted with responsive physics, custom micro-interactions, and instant routing.
          </p>
        </div>

        {/* 7 Animated Mascots Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {MASCOT_ITEMS.map((item, idx) => {
            const isHovered = hoveredId === item.id
            const isWideOnDesktop = idx === 6 // 7th card spans nicely or fits clean grid

            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`group relative flex flex-col justify-between rounded-3xl bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-slate-800 ${item.borderHover} p-5 sm:p-6 shadow-sm dark:shadow-black/20 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${
                  isWideOnDesktop ? 'sm:col-span-2 lg:col-span-1 xl:col-span-2' : ''
                }`}
              >
                {/* Background Ambient Glow on Hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
                  style={{
                    background: `radial-gradient(circle at 50% 30%, ${item.glowColor}, transparent 70%)`,
                  }}
                />

                <Link
                  to={item.route}
                  className="relative z-10 flex flex-col h-full justify-between focus:outline-none"
                  aria-label={`${item.title} - ${item.categoryName}. ${item.description}`}
                >
                  {/* Top Bar: Title & Badge */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${item.accentColor}18`,
                          color: item.accentColor,
                          border: `1px solid ${item.accentColor}33`,
                        }}
                      >
                        {item.badge}
                      </span>

                      <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                        0{idx + 1}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                      <span>{item.title}</span>
                      <span className="text-slate-300 dark:text-slate-700 text-lg font-light">/</span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                        {item.categoryName}
                      </span>
                    </h3>
                  </div>

                  {/* Center: Animated Mascot Stage */}
                  <div className="py-4 my-2 flex flex-col items-center justify-center min-h-[110px] group-hover:scale-105 transition-transform duration-300">
                    {item.renderMascot(isHovered)}
                    <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-2 text-center">
                      {item.mascotDesc}
                    </span>
                  </div>

                  {/* Bottom: Description & Navigate Action */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-end justify-between gap-3">
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-600 text-slate-600 dark:text-slate-300 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
