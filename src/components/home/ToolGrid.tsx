import React from 'react'
import { ToolCard } from './ToolCard'
import type { ToolDefinition } from '../../types'
import { Search, RotateCcw } from 'lucide-react'

interface ToolGridProps {
  tools: ToolDefinition[]
  onResetFilters?: () => void
}

export const ToolGrid: React.FC<ToolGridProps> = ({ tools, onResetFilters }) => {
  if (tools.length === 0) {
    return (
      <div className="py-24 text-center px-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-amber-300 shadow-xl">
          <Search className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">No tools found</h3>
        <p className="mt-2 text-sm text-slate-300">
          Try selecting another category or resetting the search filter.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold shadow-lg shadow-emerald-950/50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  )
}
