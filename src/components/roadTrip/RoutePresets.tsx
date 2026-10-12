import React from 'react'
import { Compass, Check } from 'lucide-react'
import { RoutePreset, POPULAR_ROUTES } from './RoadTripTypes'

interface RoutePresetsProps {
  activePresetId?: string
  onSelectPreset: (preset: RoutePreset) => void
}

const ROUTE_ICONS: Record<string, string> = {
  'delhi-jaipur': '🏰',
  'mumbai-goa': '🏖️',
  'blr-wayanad': '🌲',
  'chennai-pondicherry': '🌊',
  'delhi-manali': '🏔️',
  'pune-mahabaleshwar': '🍓',
  'blr-ooty': '⛰️',
  'hyd-hampi': '🏛️',
}

export const RoutePresets: React.FC<RoutePresetsProps> = ({ activePresetId, onSelectPreset }) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold tracking-wide uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>Popular Indian Road Trip Presets</span>
        </label>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Click any route to auto-fill
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {POPULAR_ROUTES.map((route) => {
          const isActive = activePresetId === route.id
          const emoji = ROUTE_ICONS[route.id] || '🚗'

          return (
            <button
              key={route.id}
              type="button"
              onClick={() => onSelectPreset(route)}
              className={`p-2.5 sm:p-3 rounded-2xl text-left transition-all duration-200 border cursor-pointer flex flex-col justify-between group relative ${
                isActive
                  ? 'bg-gradient-to-b from-sky-950/40 via-cyan-950/30 to-slate-900/90 border-cyan-500 shadow-md shadow-cyan-500/15 ring-2 ring-cyan-500/40'
                  : 'bg-white/80 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/70 border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {isActive && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}

              <div className="flex items-start gap-1.5 mb-1.5">
                <span className="text-base select-none shrink-0" role="img" aria-hidden="true">
                  {emoji}
                </span>
                <div className="min-w-0 pr-3">
                  <span className="font-bold text-xs truncate block text-slate-900 dark:text-white">
                    {route.name}
                  </span>
                  <span className="text-[10px] text-cyan-700 dark:text-cyan-400 font-mono truncate block">
                    {route.tag}
                  </span>
                </div>
              </div>

              <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-500 dark:text-slate-400 truncate">
                  {route.highwayName.split('/')[0].trim()}
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">
                  {route.distanceKm} km
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

