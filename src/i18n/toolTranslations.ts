import { SupportedLocale } from './locales'

export interface ToolTranslations<T = Record<string, string>> {
  meta: {
    title: string
    metaDescription: string
    h1: string
    subtitle: string
  }
  ui: T
  formulaExplanation?: string
  assumptions?: string[]
  example?: {
    title: string
    inputs: Record<string, string>
    outputs: Record<string, string>
    explanation: string
  }
  faqs?: Array<{
    question: string
    answer: string
  }>
}

export type ToolLocaleMap<T = Record<string, string>> = Partial<Record<SupportedLocale, ToolTranslations<T>>> & {
  en: ToolTranslations<T>
}

// Global registry of tool-specific translation packages
const TOOL_REGISTRY: Record<string, ToolLocaleMap<any>> = {}

/**
 * Register a namespace/tool translation bundle
 */
export function registerToolTranslations<T = Record<string, string>>(
  toolSlug: string,
  bundle: ToolLocaleMap<T>
): void {
  TOOL_REGISTRY[toolSlug] = bundle
}

/**
 * Get tool translations for an active locale with safe fallback to English
 */
export function getToolTranslations<T = Record<string, string>>(
  toolSlug: string,
  locale: SupportedLocale
): ToolTranslations<T> {
  const bundle = TOOL_REGISTRY[toolSlug]
  if (!bundle) {
    // Defensive fallback: prevent app-level white screen if a tool's dictionary hasn't loaded yet
    console.warn(`[i18n] Translations for tool "${toolSlug}" have not been registered yet. Using fallback.`)
    const safeUiProxy = new Proxy({} as any, {
      get: (_target, prop) => (typeof prop === 'string' ? prop : ''),
    })
    return {
      meta: {
        title: toolSlug,
        metaDescription: '',
        h1: toolSlug,
        subtitle: '',
      },
      ui: safeUiProxy as T,
      formulaExplanation: undefined,
      assumptions: [],
      example: undefined,
      faqs: [],
    }
  }

  const localized = bundle[locale] as ToolTranslations<T> | undefined
  const english = bundle.en as ToolTranslations<T>

  if (!localized) {
    return english
  }

  // Deep fallback merge: localized content with fallback to english for missing keys
  return {
    meta: {
      title: localized.meta?.title || english.meta.title,
      metaDescription: localized.meta?.metaDescription || english.meta.metaDescription,
      h1: localized.meta?.h1 || english.meta.h1,
      subtitle: localized.meta?.subtitle || english.meta.subtitle,
    },
    ui: {
      ...english.ui,
      ...localized.ui,
    },
    formulaExplanation: localized.formulaExplanation || english.formulaExplanation,
    assumptions: localized.assumptions || english.assumptions,
    example: localized.example || english.example,
    faqs: localized.faqs || english.faqs,
  }
}

/**
 * Hook helper to get reactive tool translations for the current context locale
 */
export function useToolTranslations<T = Record<string, string>>(
  toolSlug: string,
  currentLocale: SupportedLocale
): ToolTranslations<T> {
  return getToolTranslations<T>(toolSlug, currentLocale)
}
