import React from 'react'
import { ToolCard } from './ToolCard'
import type { ToolDefinition } from '../../types'
import { Search } from 'lucide-react'

interface ToolGridProps {
  tools: ToolDefinition[]
  onResetFilters?: () => void
}

const FEATURED_SLUGS = new Set([
  'indian-cheque-studio',
  'jcb-fuel-cost',
  '50kb-photo',
  'fast-inpainting-watermark-remover',
  'orbit-audio-studio',
  'studio-master-spatial-suite',
  'zero-knowledge-file-vault',
  'cent-to-sqft',
])

export const ToolGrid: React.FC<ToolGridProps> = ({ tools, onResetFilters }) => {
  if (tools.length === 0) {
    return (
      <div className="py-20 text-center px-4 max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-slate-400">
          <Search className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">No tools found</h3>
        <p className="mt-1 text-sm text-slate-400">
          Try selecting another category or resetting the search filter.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-semibold hover:bg-cyan-500/30 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {tools.map((tool) => {
        const isFeatured = FEATURED_SLUGS.has(tool.slug) && tools.length > 6
        return <ToolCard key={tool.id} tool={tool} isFeatured={isFeatured} />
      })}
    </div>
  )
}
