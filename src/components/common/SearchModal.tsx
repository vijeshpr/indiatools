import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  X,
  ArrowRight,
  Car,
  HardHat,
  Zap,
  MapPin,
  Briefcase,
  FileImage,
  ChevronRight,
  Command,
  IndianRupee,
} from 'lucide-react'
import { searchTools } from '../../data/tools'
import { ToolDefinition, ToolCategory } from '../../types'

interface SearchModalProps {
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

const SEARCH_PROMPTS = [
  'JCB fuel cost',
  'How much electricity does my AC use?',
  'Convert cent to square feet',
  'Calculate vehicle mileage',
  'Indian cheque words',
  'Resize photo to 50KB',
  'Inverter battery backup 150Ah',
  'PM Surya Ghar solar subsidy',
  'Salary hike percentage',
]

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Dynamic cycling placeholder text
  useEffect(() => {
    if (!isOpen) return
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PROMPTS.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [isOpen])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setSelectedIndex(0)
    } else {
      setQuery('')
    }
  }, [isOpen])

  const results = searchTools(query)

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex])

  const handleSelect = (tool: ToolDefinition) => {
    onClose()
    const path = tool.type === 'image-tool' ? `/tools/${tool.slug}` : `/calculators/${tool.slug}`
    navigate(path)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9990] flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131B2E]">
              <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3 shrink-0" />
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setSelectedIndex(0)
                  }}
                  placeholder={`e.g. "${SEARCH_PROMPTS[placeholderIndex]}"`}
                  className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none text-base sm:text-lg"
                />
              </div>
              {query ? (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                  <Command className="w-3 h-3" />
                  <span>ESC</span>
                </div>
              )}
            </div>

            {/* Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
              {results.length > 0 ? (
                results.map((tool, idx) => {
                  const Icon = CATEGORY_ICONS[tool.category] || ArrowRight
                  const isSelected = idx === selectedIndex

                  return (
                    <div
                      key={tool.id}
                      onClick={() => handleSelect(tool)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-slate-900 dark:text-white'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                          style={{
                            backgroundColor: `${tool.color}15`,
                            borderColor: `${tool.color}30`,
                            color: tool.color,
                          }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm sm:text-base truncate text-slate-900 dark:text-white">
                              {tool.title}
                            </h4>
                            {tool.badge && (
                              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                                {tool.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {tool.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pl-3 shrink-0">
                        <span className="hidden sm:inline text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
                          {tool.categoryLabel}
                        </span>
                        <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400 translate-x-0.5' : 'text-slate-400 dark:text-slate-600'} transition-transform`} />
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="py-12 text-center text-slate-500 dark:text-slate-400">
                  <p className="text-base font-medium">No tools found matching "{query}"</p>
                  <p className="text-xs mt-1 text-slate-400 dark:text-slate-500">
                    Try searching for mileage, JCB, electricity, cent, photo, or cheque
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer Hints */}
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Open</span>
              </div>
              <span className="font-mono text-slate-500 dark:text-slate-400">{results.length} Tools Ready</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
