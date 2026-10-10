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
      className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-200 shadow-2xs overflow-hidden"
    >
      <div>
        {/* Top Header: Icon & Category Badge */}
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
            style={{
              backgroundColor: `${tool.color}15`,
              color: tool.color,
            }}
          >
            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.badge && (
              <span
                className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                style={{
                  backgroundColor: `${tool.color}15`,
                  color: tool.color,
                }}
              >
                {tool.badge}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2 tracking-tight">
          {tool.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-6">
          {tool.description}
        </p>
      </div>

      {/* Footer / CTA Link */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
          {tool.categoryLabel}
        </span>

        <Link
          to={path}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 group-hover:text-indigo-700 transition-colors focus:outline-none focus-visible:underline"
        >
          <span>Use Tool</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  )
}
