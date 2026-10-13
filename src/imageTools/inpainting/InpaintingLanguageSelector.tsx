import React, { useState, useRef, useEffect } from 'react'
import { Globe, ChevronDown, Check } from 'lucide-react'
import type { InpaintingLocale } from '../../lib/inpainting/types'
import { INPAINTING_LOCALES } from '../../lib/inpainting/i18n'

interface Props {
  currentLocale: InpaintingLocale
  onSelectLocale: (locale: InpaintingLocale) => void
}

export const InpaintingLanguageSelector: React.FC<Props> = ({
  currentLocale,
  onSelectLocale,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentInfo = INPAINTING_LOCALES[currentLocale] || INPAINTING_LOCALES.en

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 shadow-sm text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-rose-400" />
        <span>{currentInfo.flag}</span>
        <span className="font-semibold text-slate-100">{currentInfo.nativeName}</span>
        <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Select Language
          </div>
          {(Object.keys(INPAINTING_LOCALES) as InpaintingLocale[]).map((loc) => {
            const info = INPAINTING_LOCALES[loc]
            const isSelected = loc === currentLocale
            return (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  onSelectLocale(loc)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-rose-500/15 text-rose-300 font-medium'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{info.flag}</span>
                  <span>{info.nativeName}</span>
                  <span className="text-[10px] text-slate-500 font-normal">({info.name})</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-rose-400" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
