export type SupportedLanguage =
  | 'en' // English
  | 'hi' // Hindi (हिन्दी)
  | 'ml' // Malayalam (മലയാളം)
  | 'ta' // Tamil (தமிழ்)
  | 'te' // Telugu (తెలుగు)
  | 'kn' // Kannada (ಕನ್ನಡ)
  | 'bn' // Bengali (বাংলা)
  | 'mr' // Marathi (मराठी)
  | 'gu' // Gujarati (ગુજરાતી)
  | 'pa' // Punjabi (ਪੰਜਾਬੀ)
  | 'or' // Odia (ଓଡ଼ିଆ)
  | 'as' // Assamese (অসমীয়া)
  | 'ur' // Urdu (اردو)

export interface LanguageInfo {
  code: SupportedLanguage
  name: string
  nativeName: string
  script: string
  direction: 'ltr' | 'rtl'
  currencyWord: string
  currencyPlural: string
  paiseWord: string
  onlyWord: string
  sampleGreeting: string
  isFullNumberSupported: boolean
}

export type BankCategory = 'public' | 'private' | 'rrb' | 'cooperative'

export interface BankInfo {
  id: string
  name: string
  shortName: string
  category: BankCategory
  categoryLabel: string
  themeColor: string // primary brand color
  accentColor: string
  branchPlaceholder: string
  ifscPrefix: string
  tagline?: string
  isPopular?: boolean
}

export type PaymentMode = 'account-payee' | 'cash' | 'self' | 'bearer'

export interface PaymentModeInfo {
  id: PaymentMode
  title: string
  badge: string
  safetyLevel: 'high' | 'medium' | 'low'
  description: string
  educationalNote: string
  chequeMarking: string
}

export interface ChequeFormData {
  date: string // YYYY-MM-DD
  payeeName: string
  amountRupees: number | string
  amountPaise: number | string
  accountHolderName: string
  memo: string
}

export interface ChequeErrors {
  date?: string
  payeeName?: string
  amount?: string
}

export interface AmountToWordsResult {
  words: string
  wordsInEnglish: string
  language: SupportedLanguage
  isFallback: boolean
  formattedInr: string
}
