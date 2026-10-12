import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Car,
  Fuel,
  Navigation,
  Truck,
  Building2,
  Zap,
  BatteryCharging,
  Sun,
  Compass,
  TrendingUp,
  Clock,
  Image,
  Shrink,
  FileSignature,
  UserCheck,
  ArrowRight,
} from 'lucide-react'
import { ToolDefinition } from '../../types'

const ICON_MAP: Record<string, React.ElementType> = {
  Gauge: Car,
  Fuel: Fuel,
  Navigation: Navigation,
  Truck: Truck,
  Building2: Building2,
  Zap: Zap,
  BatteryCharging: BatteryCharging,
  Sun: Sun,
  Compass: Compass,
  TrendingUp: TrendingUp,
  Clock: Clock,
  Image: Image,
  Shrink: Shrink,
  FileSignature: FileSignature,
  UserCheck: UserCheck,
}

interface ToolCardProps {
  tool: ToolDefinition
  priority?: boolean
  index?: number
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, index = 0 }) => {
  const IconComponent = ICON_MAP[tool.iconName] || ArrowRight
  const path = tool.type === 'image-tool' ? `/tools/${tool.slug}` : `/calculators/${tool.slug}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.25) }}
      className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 hover:border-amber-500/40 dark:hover:border-amber-500/40 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(245,158,11,0.15)] shadow-xs overflow-hidden"
    >
      {/* Top Accent Hover Shine Bar */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div>
        {/* Top Header: Icon & Category Badge */}
        <div className="flex items-center justify-between mb-3.5">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 border border-slate-200/50 dark:border-white/10 shadow-xs"
            style={{
              background: `linear-gradient(135deg, ${tool.color}25, ${tool.color}08)`,
              color: tool.color,
            }}
          >
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.badge && (
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-current/20 shadow-2xs"
                style={{
                  background: `linear-gradient(135deg, ${tool.color}15, ${tool.color}05)`,
                  color: tool.color,
                }}
              >
                {tool.badge}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1 mb-1.5 tracking-tight">
          {tool.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-5">
          {tool.description}
        </p>
      </div>

      {/* Footer / CTA Link */}
      <div className="pt-3.5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
        <span className="text-[10px] font-medium font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md">
          {tool.categoryLabel}
        </span>

        <Link
          to={path}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors focus:outline-none focus-visible:underline"
        >
          <span>Use Tool</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  )
}
