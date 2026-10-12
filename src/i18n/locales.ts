export type SupportedLocale =
  | 'en'
  | 'ml'
  | 'hi'
  | 'ta'
  | 'te'
  | 'kn'
  | 'bn'
  | 'mr'
  | 'gu'
  | 'pa'
  | 'or'

export interface LocaleMeta {
  code: SupportedLocale
  bcp47: string
  name: string
  nativeName: string
  script: string
  dir: 'ltr' | 'rtl'
  currencySymbol: string
}

export const SUPPORTED_LOCALES: Record<SupportedLocale, LocaleMeta> = {
  en: {
    code: 'en',
    bcp47: 'en-IN',
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
    dir: 'ltr',
    currencySymbol: '₹',
  },
  ml: {
    code: 'ml',
    bcp47: 'ml-IN',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    dir: 'ltr',
    currencySymbol: '₹',
  },
  hi: {
    code: 'hi',
    bcp47: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    dir: 'ltr',
    currencySymbol: '₹',
  },
  ta: {
    code: 'ta',
    bcp47: 'ta-IN',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    dir: 'ltr',
    currencySymbol: '₹',
  },
  te: {
    code: 'te',
    bcp47: 'te-IN',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    dir: 'ltr',
    currencySymbol: '₹',
  },
  kn: {
    code: 'kn',
    bcp47: 'kn-IN',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    dir: 'ltr',
    currencySymbol: '₹',
  },
  bn: {
    code: 'bn',
    bcp47: 'bn-IN',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    dir: 'ltr',
    currencySymbol: '₹',
  },
  mr: {
    code: 'mr',
    bcp47: 'mr-IN',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    dir: 'ltr',
    currencySymbol: '₹',
  },
  gu: {
    code: 'gu',
    bcp47: 'gu-IN',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    dir: 'ltr',
    currencySymbol: '₹',
  },
  pa: {
    code: 'pa',
    bcp47: 'pa-IN',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    dir: 'ltr',
    currencySymbol: '₹',
  },
  or: {
    code: 'or',
    bcp47: 'or-IN',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    script: 'Odia',
    dir: 'ltr',
    currencySymbol: '₹',
  },
}

export const ALL_LOCALE_CODES = Object.keys(SUPPORTED_LOCALES) as SupportedLocale[]

export function isValidLocale(code: string): code is SupportedLocale {
  return code in SUPPORTED_LOCALES
}

export function getLocaleMeta(code: string): LocaleMeta {
  if (isValidLocale(code)) {
    return SUPPORTED_LOCALES[code]
  }
  return SUPPORTED_LOCALES.en
}
