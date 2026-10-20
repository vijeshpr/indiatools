export type DirectoryLangCode =
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

export interface DirectoryLocaleMeta {
  code: DirectoryLangCode
  bcp47: string
  name: string
  nativeName: string
  script: string
  dir: 'ltr' | 'rtl'
}

export interface DirectoryToolItem {
  name: string
  description: string
}

export interface DirectoryPageUi {
  title: string
  metaDescription: string
  h1: string
  subtitle: string
  searchPlaceholder: string
  allCategoriesLabel: string
  categoryLabels: Record<string, string>
  openToolLabel: string
  noResultsFound: string
  noResultsSuggestion: string
  clearSearchLabel: string
  totalToolsLabel: string
  availableLanguagesBadge: string
  breadcrumbs: {
    home: string
    directory: string
  }
  featuredSectionTitle: string
  multilingualBadge: string
}
