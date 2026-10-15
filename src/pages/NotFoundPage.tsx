import React from 'react'
import { Link } from 'react-router-dom'
import {
  Compass,
  Home,
  FileQuestion,
  Search,
  Fuel,
  Maximize2,
  HardHat,
  Image,
  CreditCard,
  ArrowRight,
} from 'lucide-react'
import { useSEO } from '../hooks/useSEO'

export const NotFoundPage: React.FC = () => {
  useSEO({
    title: 'Page Not Found (404) | IndiaTools',
    description:
      'The requested page or calculator could not be found. Explore our complete directory of everyday Indian online calculators and utilities.',
    noindex: true,
  })

  const popularTools = [
    {
      title: 'Vehicle Mileage Calculator',
      desc: 'Calculate actual mileage, fuel cost per km, and monthly petrol/diesel expense.',
      path: '/calculators/vehicle-mileage',
      icon: Fuel,
      color: '#FB923C',
    },
    {
      title: 'Cent to Square Feet Converter',
      desc: 'Convert land measurements between Cent, Sq.ft, Acres, and Guntha across Indian states.',
      path: '/calculators/cent-to-sqft',
      icon: Maximize2,
      color: '#34D399',
    },
    {
      title: 'JCB Fuel Cost Calculator',
      desc: 'Estimate hourly diesel consumption and daily running cost for earthmovers.',
      path: '/calculators/jcb-fuel-cost',
      icon: HardHat,
      color: '#FBBF24',
    },
    {
      title: '50KB Photo Resizer',
      desc: 'Compress and resize photos for UPSC, SSC, state PSC, and government portals.',
      path: '/tools/50kb-photo',
      icon: Image,
      color: '#22D3EE',
    },
    {
      title: 'Indian Cheque Studio',
      desc: 'Interactive cheque slip generator with amount-in-words across 13 Indian languages.',
      path: '/calculators/indian-cheque-studio',
      icon: CreditCard,
      color: '#C084FC',
    },
  ]

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* 404 Badge & Graphic */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider">
            <FileQuestion className="w-4 h-4 text-rose-400" />
            <span>HTTP 404 • Resource Not Found</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            Page Not Found
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            The link you followed may be broken, renamed, or no longer exists.
            Explore our collection of practical everyday calculators below.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/tools"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Browse All 65 Tools</span>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-slate-800 dark:text-white font-semibold text-sm border border-slate-300 dark:border-white/10 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>

        {/* Popular Tools Quick Recovery Links */}
        <div className="pt-8 border-t border-slate-200/60 dark:border-white/10 text-left space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold text-center sm:text-left">
            Popular Indian Calculators & Utilities:
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {popularTools.map((tool) => {
              const Icon = tool.icon
              return (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className="p-4 rounded-2xl bg-white dark:bg-[#10271C]/70 hover:bg-slate-50 dark:hover:bg-[#153628] border border-slate-200 dark:border-emerald-500/20 hover:border-emerald-500/40 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center border"
                        style={{
                          backgroundColor: `${tool.color}15`,
                          borderColor: `${tool.color}30`,
                          color: tool.color,
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {tool.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
