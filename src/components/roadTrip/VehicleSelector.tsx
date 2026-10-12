import React from 'react'
import { motion } from 'framer-motion'
import { Check, Info, Fuel, Gauge, ShieldCheck } from 'lucide-react'
import { VehicleType, VEHICLE_CONFIGS } from './RoadTripTypes'

interface VehicleSelectorProps {
  selectedVehicle: VehicleType
  onSelectVehicle: (type: VehicleType) => void
}

// Crisp, dedicated vector illustrations for Indian vehicle categories
const VehicleArtwork: React.FC<{ type: VehicleType; isSelected: boolean }> = ({ type, isSelected }) => {
  const accentColor = isSelected ? '#38BDF8' : '#64748B'
  const bodyGradient = isSelected ? 'url(#carBodyActive)' : 'url(#carBodyIdle)'
  const glowFilter = isSelected ? 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.45))' : 'none'

  switch (type) {
    case 'hatchback':
      return (
        <svg viewBox="0 0 170 85" className="w-full h-16 sm:h-20 select-none transition-transform duration-300" style={{ filter: glowFilter }} fill="none">
          <defs>
            <linearGradient id="carBodyActive" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="60%" stopColor="#0369A1" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>
            <linearGradient id="carBodyIdle" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          {/* Ground shadow */}
          <ellipse cx="85" cy="76" rx="68" ry="5.5" fill="#000000" fillOpacity={isSelected ? 0.4 : 0.22} />
          {/* Main Hatchback Body */}
          <path
            d="M22 55 L28 41 L46 29 L98 29 L118 39 L146 47 L148 59 L138 61 L126 61 L124 51 L102 51 L100 61 L48 61 L46 51 L24 51 L22 61 Z"
            fill={bodyGradient}
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Roof Spoiler */}
          <path d="M22 41 L18 39 L26 38 Z" fill="#0F172A" />
          {/* Cabin Roof & Window Frames */}
          <path d="M48 31 L68 19 L106 19 L120 31 Z" fill="#0F172A" stroke={accentColor} strokeWidth="1.2" />
          {/* Windows */}
          <path d="M52 30 L69 21 L86 21 L86 30 Z" fill="url(#glassGrad)" />
          <path d="M90 21 L104 21 L116 30 L90 30 Z" fill="url(#glassGrad)" />
          {/* Projector Headlamp with beam */}
          <path d="M142 49 L147 55 L140 55 Z" fill="#38BDF8" />
          {isSelected && <path d="M147 52 L166 48 L166 58 Z" fill="#38BDF8" fillOpacity="0.2" />}
          {/* Taillamp */}
          <path d="M23 45 L27 49 L24 53 Z" fill="#EF4444" />
          {/* Alloy Wheels */}
          <circle cx="36" cy="57" r="12" fill="#0F172A" stroke="#94A3B8" strokeWidth="2.5" />
          <circle cx="36" cy="57" r="6" fill="#475569" stroke={accentColor} strokeWidth="1.5" />
          <circle cx="114" cy="57" r="12" fill="#0F172A" stroke="#94A3B8" strokeWidth="2.5" />
          <circle cx="114" cy="57" r="6" fill="#475569" stroke={accentColor} strokeWidth="1.5" />
        </svg>
      )

    case 'sedan':
      return (
        <svg viewBox="0 0 175 85" className="w-full h-16 sm:h-20 select-none transition-transform duration-300" style={{ filter: glowFilter }} fill="none">
          {/* Ground shadow */}
          <ellipse cx="88" cy="76" rx="74" ry="5.5" fill="#000000" fillOpacity={isSelected ? 0.4 : 0.22} />
          {/* Aerodynamic Sedan Body */}
          <path
            d="M16 55 L28 43 L54 33 L80 21 L116 21 L140 35 L162 45 L164 57 L152 59 L142 51 L118 51 L114 59 L54 59 L50 51 L26 51 L22 59 Z"
            fill={bodyGradient}
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Fastback Cabin & Glass */}
          <path d="M58 33 L78 23 L96 23 L96 33 Z" fill="url(#glassGrad)" />
          <path d="M100 23 L114 23 L134 33 L100 33 Z" fill="url(#glassGrad)" />
          {/* Headlamp with Sleek DRL */}
          <path d="M158 45 L163 51 L154 51 Z" fill="#38BDF8" />
          {isSelected && <path d="M163 48 L174 44 L174 54 Z" fill="#38BDF8" fillOpacity="0.25" />}
          {/* Red LED Taillight Strip */}
          <path d="M17 47 L22 51 L19 53 Z" fill="#EF4444" />
          {/* Multi-spoke Wheels */}
          <circle cx="38" cy="57" r="12" fill="#0F172A" stroke="#CBD5E1" strokeWidth="2.5" />
          <circle cx="38" cy="57" r="6" fill="#475569" stroke={accentColor} strokeWidth="1.5" />
          <circle cx="130" cy="57" r="12" fill="#0F172A" stroke="#CBD5E1" strokeWidth="2.5" />
          <circle cx="130" cy="57" r="6" fill="#475569" stroke={accentColor} strokeWidth="1.5" />
        </svg>
      )

    case 'suv':
      return (
        <svg viewBox="0 0 175 85" className="w-full h-16 sm:h-20 select-none transition-transform duration-300" style={{ filter: glowFilter }} fill="none">
          {/* Ground shadow */}
          <ellipse cx="88" cy="77" rx="72" ry="6" fill="#000000" fillOpacity={isSelected ? 0.45 : 0.25} />
          {/* Roof Rails & High Stance */}
          <line x1="48" y1="13" x2="124" y2="13" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M54 13 L54 17 M118 13 L118 17" stroke={accentColor} strokeWidth="2" />
          {/* SUV Upright Body */}
          <path
            d="M18 55 L20 35 L48 22 L126 22 L144 36 L160 41 L162 57 L150 59 L144 49 L116 49 L110 59 L54 59 L48 49 L26 49 L20 59 Z"
            fill={bodyGradient}
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Chunky Boxy Windows */}
          <path d="M52 24 L70 24 L70 36 L50 36 Z" fill="url(#glassGrad)" />
          <path d="M74 24 L100 24 L100 36 L74 36 Z" fill="url(#glassGrad)" />
          <path d="M104 24 L124 24 L138 36 L104 36 Z" fill="url(#glassGrad)" />
          {/* Silver Bash Plate */}
          <rect x="74" y="55" width="22" height="3" fill="#E2E8F0" rx="1" />
          {/* Large All-Terrain Wheels */}
          <circle cx="37" cy="55" r="14" fill="#090E17" stroke="#F59E0B" strokeWidth="2.5" />
          <circle cx="37" cy="55" r="7" fill="#334155" stroke={accentColor} strokeWidth="1.5" />
          <circle cx="130" cy="55" r="14" fill="#090E17" stroke="#F59E0B" strokeWidth="2.5" />
          <circle cx="130" cy="55" r="7" fill="#334155" stroke={accentColor} strokeWidth="1.5" />
          {/* Twin Projector Headlights */}
          <path d="M158 43 L162 49 L156 49 Z" fill="#38BDF8" />
          {isSelected && <path d="M162 46 L174 41 L174 53 Z" fill="#38BDF8" fillOpacity="0.25" />}
        </svg>
      )

    case 'motorcycle':
      return (
        <svg viewBox="0 0 170 85" className="w-full h-16 sm:h-20 select-none transition-transform duration-300" style={{ filter: glowFilter }} fill="none">
          {/* Ground shadow */}
          <ellipse cx="85" cy="76" rx="58" ry="4.5" fill="#000000" fillOpacity={isSelected ? 0.4 : 0.22} />
          {/* Touring Windscreen & Handlebars */}
          <path d="M106 24 L120 17 M112 17 L118 17" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M114 20 L122 36" stroke="#38BDF8" strokeWidth="2" strokeOpacity="0.7" />
          {/* Fuel Tank */}
          <path d="M74 29 C74 21, 104 21, 106 31 C106 37, 88 39, 74 29 Z" fill={bodyGradient} stroke={accentColor} strokeWidth="1.5" />
          {/* Engine & Crankcase */}
          <path d="M62 39 L92 39 L86 57 L56 55 Z" fill="#0F172A" stroke="#64748B" strokeWidth="1.5" />
          {/* Touring Pannier Luggage Box */}
          <rect x="38" y="31" width="18" height="15" rx="2" fill="#1E293B" stroke={accentColor} strokeWidth="1.2" />
          {/* Upswept Chrome Exhaust */}
          <path d="M70 55 L36 57 L28 53" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
          {/* Rider Touring Seat */}
          <path d="M54 29 C58 27, 74 29, 78 35 L56 37 Z" fill="#090E17" stroke={accentColor} strokeWidth="1" />
          {/* Front Fork & Headlamp */}
          <path d="M112 21 L130 57" stroke="#94A3B8" strokeWidth="2.5" />
          <circle cx="124" cy="25" r="4.5" fill="#38BDF8" />
          {/* Spoked Off-road Wheels */}
          <circle cx="34" cy="55" r="16" fill="#090E17" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="34" cy="55" r="6" fill="#475569" stroke="#94A3B8" strokeWidth="1.5" />
          <circle cx="130" cy="55" r="16" fill="#090E17" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="130" cy="55" r="6" fill="#475569" stroke="#94A3B8" strokeWidth="1.5" />
        </svg>
      )

    case 'bus':
      return (
        <svg viewBox="0 0 175 85" className="w-full h-16 sm:h-20 select-none transition-transform duration-300" style={{ filter: glowFilter }} fill="none">
          {/* Ground shadow */}
          <ellipse cx="88" cy="76" rx="74" ry="5.5" fill="#000000" fillOpacity={isSelected ? 0.4 : 0.22} />
          {/* Heavy Coach Body */}
          <path
            d="M16 55 L16 19 C16 15, 20 13, 26 13 L150 13 C158 13, 164 19, 164 27 L164 57 L154 57 L148 49 L126 49 L120 57 L58 57 L52 49 L30 49 L24 57 L16 57 Z"
            fill={bodyGradient}
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Panoramic Windows Band */}
          <rect x="24" y="19" width="134" height="15" rx="2" fill="#090E17" />
          <rect x="28" y="21" width="18" height="11" rx="1" fill="url(#glassGrad)" />
          <rect x="50" y="21" width="18" height="11" rx="1" fill="url(#glassGrad)" />
          <rect x="72" y="21" width="18" height="11" rx="1" fill="url(#glassGrad)" />
          <rect x="94" y="21" width="18" height="11" rx="1" fill="url(#glassGrad)" />
          <rect x="116" y="21" width="18" height="11" rx="1" fill="url(#glassGrad)" />
          <rect x="138" y="21" width="16" height="11" rx="1" fill="url(#glassGrad)" />
          {/* Heavy Wheels */}
          <circle cx="41" cy="55" r="13" fill="#090E17" stroke="#64748B" strokeWidth="2.5" />
          <circle cx="41" cy="55" r="5" fill="#475569" />
          <circle cx="137" cy="55" r="13" fill="#090E17" stroke="#64748B" strokeWidth="2.5" />
          <circle cx="137" cy="55" r="5" fill="#475569" />
        </svg>
      )

    case 'truck':
      return (
        <svg viewBox="0 0 175 85" className="w-full h-16 sm:h-20 select-none transition-transform duration-300" style={{ filter: glowFilter }} fill="none">
          {/* Ground shadow */}
          <ellipse cx="88" cy="76" rx="74" ry="5.5" fill="#000000" fillOpacity={isSelected ? 0.4 : 0.22} />
          {/* Freight Trailer Container */}
          <rect x="14" y="23" width="96" height="28" rx="2" fill={bodyGradient} stroke={accentColor} strokeWidth="1.5" />
          {/* Commercial Cab Unit */}
          <path
            d="M114 51 L114 17 L146 17 C152 17, 158 23, 160 31 L162 53 L150 55 L144 47 L122 47 L116 55 Z"
            fill="#0F172A"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Truck Windshield */}
          <path d="M140 21 L152 21 L156 31 L140 31 Z" fill="url(#glassGrad)" />
          {/* Vertical Exhaust Stack */}
          <rect x="114" y="9" width="3" height="14" fill="#CBD5E1" />
          {/* Dual Rear Axle Wheels */}
          <circle cx="34" cy="55" r="12" fill="#090E17" stroke="#64748B" strokeWidth="2" />
          <circle cx="56" cy="55" r="12" fill="#090E17" stroke="#64748B" strokeWidth="2" />
          {/* Front Steering Wheel */}
          <circle cx="134" cy="55" r="12" fill="#090E17" stroke="#64748B" strokeWidth="2" />
          <circle cx="134" cy="55" r="5" fill="#475569" />
        </svg>
      )
  }
}

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({ selectedVehicle, onSelectVehicle }) => {
  const vehicleList: VehicleType[] = ['hatchback', 'sedan', 'suv', 'motorcycle', 'bus', 'truck']
  const activeCfg = VEHICLE_CONFIGS[selectedVehicle]
  const fullTankRangeKm = Math.round(activeCfg.tankSizeLitres * activeCfg.defaultMileage)

  return (
    <div className="space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <label className="text-xs font-semibold tracking-wide uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <span>Choose Vehicle Category</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/20">
            Vehicle Garage
          </span>
        </label>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Auto-sets highway mileage, tank capacity & FASTag toll rates
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {vehicleList.map((type) => {
          const config = VEHICLE_CONFIGS[type]
          const isSelected = selectedVehicle === type

          return (
            <motion.button
              key={type}
              type="button"
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectVehicle(type)}
              className={`relative text-left p-3 rounded-2xl transition-all duration-200 flex flex-col justify-between cursor-pointer border ${
                isSelected
                  ? 'bg-gradient-to-b from-sky-950/50 via-slate-900/95 to-slate-950 border-cyan-500/90 shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-500/40'
                  : 'bg-white/80 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-slate-200/90 dark:border-slate-800/80 shadow-xs'
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              {/* Artwork */}
              <div className="my-1 flex items-center justify-center">
                <VehicleArtwork type={type} isSelected={isSelected} />
              </div>

              {/* Text Info */}
              <div className="mt-2 space-y-1">
                <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                  {config.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  ~{config.defaultMileage} km/L • {config.tankSizeLitres}L Tank
                </div>
                <div className="pt-1 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[9.5px]">
                  <span className="text-slate-500 dark:text-slate-400 font-mono">Toll:</span>
                  <span className={`font-mono font-semibold ${config.tollMultiplier === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {config.tollMultiplier === 0 ? 'Free (₹0)' : `₹${config.tollMultiplier}/km`}
                  </span>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Selected Vehicle Context & Telemetry Callout */}
      <div className="p-3.5 rounded-2xl bg-slate-100/90 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span className="font-bold text-slate-900 dark:text-white">
              {activeCfg.name}: {activeCfg.subtitle}
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {activeCfg.tollClassLabel}
          </span>
        </div>

        <p className="text-[11.5px] leading-relaxed text-slate-600 dark:text-slate-400">
          {activeCfg.description}
        </p>

        {/* Dynamic Telemetry Specs Pill Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/80 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <Gauge className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <span>Mileage: <strong>{activeCfg.defaultMileage} km/L</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <Fuel className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Fuel Tank: <strong>{activeCfg.tankSizeLitres} Litres</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Tank Range: <strong>~{fullTankRangeKm} km</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <span className="text-cyan-500">₹</span>
            <span>Toll Multiplier: <strong>{activeCfg.tollMultiplier === 0 ? 'Free' : `₹${activeCfg.tollMultiplier}/km`}</strong></span>
          </div>
        </div>
      </div>
    </div>
  )
}

