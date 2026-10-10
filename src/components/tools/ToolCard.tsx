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
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      data-interactive="true"
      className="group relative flex flex-col justify-between p-6 rounded-2xl bg-zinc-900/60 dark:bg-zinc-900/70 light:bg-white/95 backdrop-blur-md border border-white/10 dark:border-white/10 light:border-slate-200/90 hover:border-amber-500/40 hover:shadow-[0_16px_36px_-12px_rgba(245,158,11,0.18)] transition-all duration-300 overflow-hidden shadow-lg shadow-black/20"
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
            className="w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-105 shadow-inner"
            style={{
              background: `linear-gradient(135deg, ${tool.color}25, ${tool.color}0a)`,
              borderColor: `${tool.color}40`,
              color: tool.color,
            }}
          >
            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <div className="flex items-center gap-1.5">
            {tool.badge && (
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-sm"
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
        <h3 className="text-base sm:text-lg font-bold text-white light:text-slate-900 group-hover:text-amber-300 transition-colors line-clamp-1 mb-1.5 tracking-tight">
          {tool.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-neutral-400 light:text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {tool.description}
        </p>
      </div>

      {/* Footer / CTA */}
      <div className="pt-3.5 border-t border-white/5 dark:border-white/5 light:border-slate-100 flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 light:text-slate-500 bg-white/5 dark:bg-white/5 light:bg-slate-100 px-2 py-0.5 rounded">
          {tool.categoryLabel}
        </span>

        <Link
          to={path}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:text-amber-300 transition-colors focus:outline-none focus-visible:underline"
        >
          <span>Use Tool</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  )
}
