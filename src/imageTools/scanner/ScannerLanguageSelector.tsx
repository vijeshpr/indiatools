import React, { useState, useRef, useEffect } from 'react'
import {
  ScannerLocale,
  SCANNER_LOCALES,
} from '../../lib/scanner/i18n'
import { Globe, ChevronDown, Check } from 'lucide-react'

interface ScannerLanguageSelectorProps {
  currentLocale: ScannerLocale
  onLocaleChange: (loc: ScannerLocale) => void
}

export const ScannerLanguageSelector: React.FC<ScannerLanguageSelectorProps> = ({
  currentLocale,
  onLocaleChange,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentMeta = SCANNER_LOCALES[currentLocale]

  const localeList = Object.keys(SCANNER_LOCALES) as ScannerLocale[]

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 text-slate-200 transition-all shadow-sm text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
      >
        <Globe className="w-3.5 h-3.5 text-emerald-400" />
        <span>{currentMeta.nativeName}</span>
        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-emerald-300 font-mono uppercase">
          {currentMeta.code}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-slate-800 shadow-2xl p-1.5 z-50">
          <div className="space-y-0.5">
            {localeList.map((code) => {
              const meta = SCANNER_LOCALES[code]
              const isSelected = code === currentLocale
              return (
                <button
                  key={code}
                  onClick={() => {
                    onLocaleChange(code)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-emerald-500/15 text-emerald-300 font-medium'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{meta.nativeName}</span>
                    <span className="text-[11px] text-slate-500">({meta.name})</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
