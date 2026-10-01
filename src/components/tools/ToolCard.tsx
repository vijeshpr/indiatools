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
  Sparkles,
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
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const IconComponent = ICON_MAP[tool.iconName] || ArrowRight
  const path = tool.type === 'image-tool' ? `/tools/${tool.slug}` : `/calculators/${tool.slug}`

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      data-interactive="true"
      className="group relative flex flex-col justify-between p-6 rounded-2xl bg-neutral-900/60 dark:bg-neutral-900/80 light:bg-white border border-neutral-800/80 light:border-slate-200/80 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 overflow-hidden"
    >
      {/* Subtle top border gradient highlight on hover */}
      <div
        className="absolute top-0 inset-x-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${tool.color}, transparent)`,
        }}
      />

      <div>
        {/* Top Header: Icon & Badge */}
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundColor: `${tool.color}15`,
              borderColor: `${tool.color}35`,
              color: tool.color,
            }}
          >
            <IconComponent className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.badge && (
              <span
                className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                style={{
                  backgroundColor: `${tool.color}18`,
                  borderColor: `${tool.color}40`,
                  color: tool.color,
                }}
              >
                {tool.badge}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white light:text-slate-900 group-hover:text-amber-400 transition-colors line-clamp-1 mb-2">
          {tool.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-neutral-400 light:text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {tool.description}
        </p>
      </div>

      {/* Footer / CTA */}
      <div className="pt-4 border-t border-neutral-800/60 light:border-slate-100 flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-400">
          {tool.categoryLabel}
        </span>

        <Link
          to={path}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:text-amber-300 transition-colors focus:outline-none focus-visible:underline"
        >
          <span>Use Tool</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  )
}
