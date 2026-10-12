import React, { createContext, useContext, useState, useEffect } from 'react'
import { SupportedLocale, getLocaleMeta, LocaleMeta, isValidLocale } from './locales'
import { getUITranslation } from './translations'

interface I18nContextType {
  locale: SupportedLocale
  localeMeta: LocaleMeta
  setLocale: (loc: SupportedLocale) => void
  t: (key: string, fallback?: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const STORAGE_KEY = 'indiatools_locale_pref'

export const I18nProvider: React.FC<{ children: React.ReactNode; initialLocale?: SupportedLocale }> = ({
  children,
  initialLocale,
}) => {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    if (initialLocale && isValidLocale(initialLocale)) {
      return initialLocale
    }
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if (saved && isValidLocale(saved)) {
      return saved
    }
    return 'en'
  })

  useEffect(() => {
    if (initialLocale && isValidLocale(initialLocale) && initialLocale !== locale) {
      setLocaleState(initialLocale)
    }
  }, [initialLocale])

  const setLocale = (newLoc: SupportedLocale) => {
    if (isValidLocale(newLoc)) {
      setLocaleState(newLoc)
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, newLoc)
        document.documentElement.lang = newLoc
        document.documentElement.dir = getLocaleMeta(newLoc).dir
      }
    }
  }

  const localeMeta = getLocaleMeta(locale)

  const t = (key: string, fallback?: string): string => {
    return getUITranslation(locale, key, fallback)
  }

  return (
    <I18nContext.Provider value={{ locale, localeMeta, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    // Graceful fallback outside provider
    const meta = getLocaleMeta('en')
    return {
      locale: 'en' as SupportedLocale,
      localeMeta: meta,
      setLocale: () => {},
      t: (key: string, fallback?: string) => getUITranslation('en', key, fallback),
    }
  }
  return ctx
}
