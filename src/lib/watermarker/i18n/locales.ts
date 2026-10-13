export type WatermarkLocale =
  | 'en'
  | 'as'
  | 'bn'
  | 'brx'
  | 'doi'
  | 'gu'
  | 'hi'
  | 'kn'
  | 'ks'
  | 'kok'
  | 'mai'
  | 'ml'
  | 'mni'
  | 'mr'
  | 'ne'
  | 'or'
  | 'pa'
  | 'sa'
  | 'sat'
  | 'sd'
  | 'ta'
  | 'te'
  | 'ur'

export interface WatermarkLocaleMeta {
  code: WatermarkLocale
  bcp47: string
  name: string
  nativeName: string
  script: string
  dir: 'ltr' | 'rtl'
}

export const WATERMARK_LOCALES: Record<WatermarkLocale, WatermarkLocaleMeta> = {
  en: {
    code: 'en',
    bcp47: 'en-IN',
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
    dir: 'ltr',
  },
  hi: {
    code: 'hi',
    bcp47: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    dir: 'ltr',
  },
  ml: {
    code: 'ml',
    bcp47: 'ml-IN',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    dir: 'ltr',
  },
  ta: {
    code: 'ta',
    bcp47: 'ta-IN',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    dir: 'ltr',
  },
  te: {
    code: 'te',
    bcp47: 'te-IN',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    dir: 'ltr',
  },
  kn: {
    code: 'kn',
    bcp47: 'kn-IN',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    dir: 'ltr',
  },
  bn: {
    code: 'bn',
    bcp47: 'bn-IN',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    dir: 'ltr',
  },
  mr: {
    code: 'mr',
    bcp47: 'mr-IN',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    dir: 'ltr',
  },
  gu: {
    code: 'gu',
    bcp47: 'gu-IN',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    dir: 'ltr',
  },
  pa: {
    code: 'pa',
    bcp47: 'pa-IN',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    dir: 'ltr',
  },
  or: {
    code: 'or',
    bcp47: 'or-IN',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    script: 'Odia',
    dir: 'ltr',
  },
  as: {
    code: 'as',
    bcp47: 'as-IN',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    script: 'Bengali-Assamese',
    dir: 'ltr',
  },
  ur: {
    code: 'ur',
    bcp47: 'ur-IN',
    name: 'Urdu',
    nativeName: 'اردو',
    script: 'Arabic-Nasta’liq',
    dir: 'rtl',
  },
  ks: {
    code: 'ks',
    bcp47: 'ks-IN',
    name: 'Kashmiri',
    nativeName: 'کٲشُر',
    script: 'Arabic',
    dir: 'rtl',
  },
  sd: {
    code: 'sd',
    bcp47: 'sd-IN',
    name: 'Sindhi',
    nativeName: 'سنڌي',
    script: 'Arabic',
    dir: 'rtl',
  },
  sa: {
    code: 'sa',
    bcp47: 'sa-IN',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    script: 'Devanagari',
    dir: 'ltr',
  },
  ne: {
    code: 'ne',
    bcp47: 'ne-IN',
    name: 'Nepali',
    nativeName: 'नेपाली',
    script: 'Devanagari',
    dir: 'ltr',
  },
  kok: {
    code: 'kok',
    bcp47: 'kok-IN',
    name: 'Konkani',
    nativeName: 'कोंकणी',
    script: 'Devanagari',
    dir: 'ltr',
  },
  mai: {
    code: 'mai',
    bcp47: 'mai-IN',
    name: 'Maithili',
    nativeName: 'मैथिली',
    script: 'Devanagari',
    dir: 'ltr',
  },
  doi: {
    code: 'doi',
    bcp47: 'doi-IN',
    name: 'Dogri',
    nativeName: 'डोगरी',
    script: 'Devanagari',
    dir: 'ltr',
  },
  brx: {
    code: 'brx',
    bcp47: 'brx-IN',
    name: 'Bodo',
    nativeName: 'बर\'',
    script: 'Devanagari',
    dir: 'ltr',
  },
  mni: {
    code: 'mni',
    bcp47: 'mni-IN',
    name: 'Manipuri',
    nativeName: 'মৈতৈলোন্',
    script: 'Bengali / Meitei Mayek',
    dir: 'ltr',
  },
  sat: {
    code: 'sat',
    bcp47: 'sat-IN',
    name: 'Santali',
    nativeName: 'संताली / ᱚᱞ ᱪᱤᱠᱤ',
    script: 'Ol Chiki / Devanagari',
    dir: 'ltr',
  },
}

export const ALL_WATERMARK_LOCALES = Object.keys(WATERMARK_LOCALES) as WatermarkLocale[]

export function getWatermarkLocaleMeta(code: string): WatermarkLocaleMeta {
  if (code in WATERMARK_LOCALES) {
    return WATERMARK_LOCALES[code as WatermarkLocale]
  }
  return WATERMARK_LOCALES.en
}
