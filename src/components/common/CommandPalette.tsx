import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  ArrowRight,
  Car,
  HardHat,
  Zap,
  IndianRupee,
  MapPin,
  Briefcase,
  FileImage,
  CornerDownLeft,
  Sparkles,
  Command,
  SlidersHorizontal,
} from 'lucide-react'
import { TOOLS, CATEGORIES } from '../../data/tools'
import type { ToolDefinition, ToolCategory } from '../../types'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

const CATEGORY_ICONS: Record<ToolCategory, React.ElementType> = {
  drive: Car,
  build: HardHat,
  power: Zap,
  money: IndianRupee,
  land: MapPin,
  work: Briefcase,
  create: FileImage,
}

const CATEGORY_COLORS: Record<ToolCategory, { text: string; bg: string; border: string }> = {
  drive: { text: '#F97316', bg: 'rgba(249, 115, 22, 0.1)', border: 'rgba(249, 115, 22, 0.25)' },
  build: { text: '#EAB308', bg: 'rgba(234, 179, 8, 0.1)', border: 'rgba(234, 179, 8, 0.25)' },
  power: { text: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.25)' },
  money: { text: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.25)' },
  land: { text: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.25)' },
  work: { text: '#06B6D4', bg: 'rgba(6, 182, 212, 0.1)', border: 'rgba(6, 182, 212, 0.25)' },
  create: { text: '#EC4899', bg: 'rgba(236, 72, 153, 0.1)', border: 'rgba(236, 72, 153, 0.25)' },
}

const QUICK_SUGGESTIONS = [
  'Indian Cheque Studio',
  'JCB Diesel Fuel',
  '50KB Photo Resizer',
  'Cent to Sq.Ft',
  'Fast Watermark Remover',
  'Orbit Audio Studio',
  'PM Surya Ghar Solar',
  'Military File Encrypter',
]

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const previouslyFocusedElement = useRef<HTMLElement | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Capture previously focused element when opened & restore on close
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement
      setTimeout(() => inputRef.current?.focus(), 40)
      setSelectedIndex(0)
    } else {
      setQuery('')
      setSelectedCategory('all')
      if (previouslyFocusedElement.current && typeof previouslyFocusedElement.current.focus === 'function') {
        previouslyFocusedElement.current.focus()
      }
    }
  }, [isOpen])

  // Filtered tools computed directly from TOOLS registry
  const filteredTools = useMemo(() => {
    let list = TOOLS

    if (selectedCategory !== 'all') {
      list = list.filter((t) => t.category === selectedCategory)
    }

    if (!query.trim()) {
      return list
    }

    const q = query.toLowerCase().trim()
    const tokens = q.split(/\s+/).filter(Boolean)

    return list.filter((tool) => {
      const searchTarget = [
        tool.title,
        tool.shortTitle,
        tool.description,
        tool.categoryLabel,
        tool.category,
        ...(tool.tags || []),
        ...(tool.searchKeywords || []),
        ...(tool.seo?.keywords || []),
      ]
        .join(' ')
        .toLowerCase()

      if (searchTarget.includes(q)) return true
      return tokens.every((token) => searchTarget.includes(token))
    })
  }, [query, selectedCategory])

  // Reset selected index when filtered results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [filteredTools.length, selectedCategory])

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector<HTMLElement>('[data-active="true"]')
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [selectedIndex])

  // Keyboard navigation & Shortcuts
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < filteredTools.length - 1 ? prev + 1 : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, filteredTools.length - 1)))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredTools[selectedIndex]) {
          handleSelect(filteredTools[selectedIndex])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredTools, selectedIndex])

  const handleSelect = (tool: ToolDefinition) => {
    onClose()
    const targetPath = tool.type === 'image-tool' ? `/tools/${tool.slug}` : `/calculators/${tool.slug}`
    navigate(targetPath)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Raycast Command Palette"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-[#090A0F] border border-white/[0.12] rounded-2xl shadow-2xl shadow-cyan-500/5 overflow-hidden z-10 flex flex-col max-h-[85vh]"
          >
            {/* Top Search Input */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08] bg-[#11131F]/90 backdrop-blur-xl">
              <Search className="w-5 h-5 text-cyan-400 mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search 63 tools..."
                className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-base sm:text-lg font-medium selection:bg-cyan-500 selection:text-black"
                aria-label="Search tools"
              />
              {query ? (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-white/[0.06] border border-white/[0.08] px-2 py-0.5 rounded">
                  <span>ESC</span>
                </div>
              )}
            </div>

            {/* Quick Category Filter Bar */}
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06] bg-[#090A0F] overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors shrink-0 cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                All ({TOOLS.length})
              </button>
              {Object.values(CATEGORIES).map((cat) => {
                const count = TOOLS.filter((t) => t.category === cat.id).length
                const isSelected = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-white/15 text-white border border-white/25'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                    }`}
                  >
                    {cat.title} ({count})
                  </button>
                )
              })}
            </div>

            {/* Results / Catalogue List */}
            <div
              ref={listRef}
              className="overflow-y-auto flex-1 p-2 divide-y divide-white/[0.03] max-h-[55vh]"
            >
              {filteredTools.length > 0 ? (
                filteredTools.map((tool, idx) => {
                  const Icon = CATEGORY_ICONS[tool.category] || ArrowRight
                  const isSelected = idx === selectedIndex
                  const colorScheme = CATEGORY_COLORS[tool.category] || {
                    text: '#06B6D4',
                    bg: 'rgba(6, 182, 212, 0.1)',
                    border: 'rgba(6, 182, 212, 0.25)',
                  }

                  return (
                    <div
                      key={tool.id}
                      data-active={isSelected}
                      onClick={() => handleSelect(tool)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#171A28] border border-cyan-500/40 text-white shadow-lg'
                          : 'hover:bg-white/[0.03] text-slate-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Category icon with color border */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform"
                          style={{
                            backgroundColor: colorScheme.bg,
                            borderColor: colorScheme.border,
                            color: colorScheme.text,
                          }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-sm sm:text-base truncate text-white">
                              {tool.title}
                            </h4>
                            {tool.badge && (
                              <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                                {tool.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 font-sans">
                            {tool.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pl-3 shrink-0">
                        <span className="hidden sm:inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.06]">
                          {tool.categoryLabel}
                        </span>
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-cyan-500 text-black' : 'text-slate-500'
                          }`}
                        >
                          <CornerDownLeft className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="py-12 px-4 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <p className="text-base font-semibold text-white">No tools found matching "{query}"</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Try searching for common terms like "cheque", "jcb", "mileage", "photo", "solar", or "watermark".
                  </p>

                  {/* Suggestions Chips */}
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
                    {QUICK_SUGGESTIONS.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setQuery(sug)}
                        className="px-2.5 py-1 rounded-lg text-xs bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.06] transition-colors cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Keyboard Navigation Bar */}
            <div className="px-4 py-2.5 bg-[#11131F] border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] border border-white/[0.1] text-white">↑</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] border border-white/[0.1] text-white">↓</kbd>
                  <span className="ml-1 text-slate-400">Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] border border-white/[0.1] text-white">↵</kbd>
                  <span className="ml-1 text-slate-400">Open</span>
                </span>
                <span className="hidden sm:flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] border border-white/[0.1] text-white">esc</kbd>
                  <span className="ml-1 text-slate-400">Close</span>
                </span>
              </div>
              <div className="flex items-center gap-1 text-cyan-400">
                <Sparkles className="w-3 h-3" />
                <span>{filteredTools.length} / 63 Tools Ready</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
