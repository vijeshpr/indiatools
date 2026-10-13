import React from 'react'
import { ScanFilter } from '../../lib/scanner/types'
import { ScannerTranslation } from '../../lib/scanner/i18n'
import { Palette, Sparkles, Sliders, Image as ImageIcon } from 'lucide-react'

interface FilterSelectorProps {
  activeFilter: ScanFilter
  onFilterChange: (filter: ScanFilter) => void
  t: ScannerTranslation
}

export const FilterSelector: React.FC<FilterSelectorProps> = ({
  activeFilter,
  onFilterChange,
  t,
}) => {
  const filters: { key: ScanFilter; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      key: 'magic-bw',
      label: t.filterMagic,
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      desc: 'Removes shadows & bleaches paper white',
    },
    {
      key: 'color',
      label: t.filterColor,
      icon: <Palette className="w-4 h-4 text-cyan-400" />,
      desc: 'Sharp text with original stamp/signature colors',
    },
    {
      key: 'grayscale',
      label: t.filterGray,
      icon: <Sliders className="w-4 h-4 text-slate-300" />,
      desc: 'Clean archival photocopy contrast',
    },
    {
      key: 'original',
      label: t.filterOriginal,
      icon: <ImageIcon className="w-4 h-4 text-slate-400" />,
      desc: 'Unfiltered un-skewed document',
    },
  ]

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-300">
        Enhancement Filter
      </label>
      <div className="grid grid-cols-2 gap-2">
        {filters.map((f) => {
          const isSelected = activeFilter === f.key
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => onFilterChange(f.key)}
              className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {f.icon}
                <span
                  className={`text-xs font-bold transition-colors ${
                    isSelected ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  {f.label}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                {f.desc}
              </p>
              {isSelected && (
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
