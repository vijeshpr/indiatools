import { ToolDefinition } from '../../types/index.ts'
import { TOOLS } from '../tools.ts'
import {
  DirectoryLangCode,
  DirectoryLocaleMeta,
  DirectoryPageUi,
  DirectoryToolItem,
} from './types.ts'
import {
  DIRECTORY_LOCALES,
  DIRECTORY_LANG_CODES,
  isDirectoryLangCode,
  DIRECTORY_UI,
} from './locales.ts'

// Import all 23 language translations
import en from './translations/en.ts'
import as from './translations/as.ts'
import bn from './translations/bn.ts'
import brx from './translations/brx.ts'
import doi from './translations/doi.ts'
import gu from './translations/gu.ts'
import hi from './translations/hi.ts'
import kn from './translations/kn.ts'
import kok from './translations/kok.ts'
import ks from './translations/ks.ts'
import mai from './translations/mai.ts'
import ml from './translations/ml.ts'
import mni from './translations/mni.ts'
import mr from './translations/mr.ts'
import ne from './translations/ne.ts'
import or from './translations/or.ts'
import pa from './translations/pa.ts'
import sa from './translations/sa.ts'
import sat from './translations/sat.ts'
import sd from './translations/sd.ts'
import ta from './translations/ta.ts'
import te from './translations/te.ts'
import ur from './translations/ur.ts'

export * from './types.ts'
export * from './locales.ts'

export const DIRECTORY_TRANSLATIONS: Record<DirectoryLangCode, Record<string, DirectoryToolItem>> = {
  en,
  as,
  bn,
  brx,
  doi,
  gu,
  hi,
  kn,
  kok,
  ks,
  mai,
  ml,
  mni,
  mr,
  ne,
  or,
  pa,
  sa,
  sat,
  sd,
  ta,
  te,
  ur,
}

const CHEQUE_STUDIO_LANGS: DirectoryLangCode[] = [
  'hi', 'ml', 'ta', 'te', 'kn', 'bn', 'mr', 'gu', 'pa', 'or', 'as', 'ur'
]

const GOLD_EXCHANGE_LANGS: DirectoryLangCode[] = [
  'ml', 'hi', 'ta', 'te', 'kn', 'bn', 'mr', 'gu', 'pa', 'or'
]

/**
 * Returns the exact destination URL for a tool in the specified directory language.
 *
 * Rules:
 * - When langCode is 'en', returns tool.seo.canonicalPath.
 * - When the tool has genuine localized pages (name-slip-maker, lucky-draw-team-splitter,
 *   repair-vs-replace, friendship-relationship-cost), returns the localized route for that language.
 * - For indian-cheque-studio and gold-exchange-calculator, returns localized route if the language
 *   is supported, else returns canonicalPath.
 * - For all other tools, links to the canonical functional tool page so users never hit 404s.
 */
export function getToolDestinationUrl(tool: ToolDefinition, langCode: DirectoryLangCode): string {
  if (langCode === 'en') {
    return tool.seo.canonicalPath
  }

  // 1. Flagship tools with all 22 Indian language routes
  if (tool.slug === 'name-slip-maker') {
    return `/${langCode}/tools/name-slip-maker`
  }
  if (tool.slug === 'lucky-draw-team-splitter') {
    return `/${langCode}/tools/lucky-draw-team-splitter`
  }
  if (tool.slug === 'repair-vs-replace') {
    return `/${langCode}/calculators/repair-vs-replace`
  }
  if (tool.slug === 'friendship-relationship-cost') {
    return `/${langCode}/calculators/friendship-relationship-cost`
  }

  // 2. Indian Cheque Studio (12 regional languages)
  if (tool.slug === 'indian-cheque-studio' && CHEQUE_STUDIO_LANGS.includes(langCode)) {
    return `/calculators/indian-cheque-studio/${langCode}`
  }

  // 3. Gold Exchange Calculator (10 regional languages)
  if (tool.slug === 'gold-exchange-calculator' && GOLD_EXCHANGE_LANGS.includes(langCode)) {
    return `/${langCode}/tools/gold-exchange-calculator`
  }

  // 4. Default canonical path
  return tool.seo.canonicalPath
}

export interface DirectoryEnhancedTool {
  tool: ToolDefinition
  localizedName: string
  localizedDescription: string
  destinationUrl: string
}

export function getDirectoryToolsForLocale(langCode: DirectoryLangCode): DirectoryEnhancedTool[] {
  const langDict = DIRECTORY_TRANSLATIONS[langCode] || DIRECTORY_TRANSLATIONS.en
  const enDict = DIRECTORY_TRANSLATIONS.en

  return TOOLS.map(tool => {
    const item = langDict[tool.slug] || enDict[tool.slug] || {
      name: tool.title,
      description: tool.description,
    }
    return {
      tool,
      localizedName: item.name,
      localizedDescription: item.description,
      destinationUrl: getToolDestinationUrl(tool, langCode),
    }
  })
}

export function getDirectoryPageCanonical(langCode: DirectoryLangCode): string {
  return langCode === 'en' ? 'https://indiatools-rho.vercel.app/all-tools' : `https://indiatools-rho.vercel.app/all-tools/${langCode}`
}

export function getDirectoryPagePath(langCode: DirectoryLangCode): string {
  return langCode === 'en' ? '/all-tools' : `/all-tools/${langCode}`
}
