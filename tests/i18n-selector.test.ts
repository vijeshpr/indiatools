import { ALL_LOCALE_CODES, SUPPORTED_LOCALES, isValidLocale, getLocaleMeta } from '../src/i18n/locales.ts'
import { UI_TRANSLATIONS, getUITranslation } from '../src/i18n/translations.ts'

interface TestResult {
  name: string
  passed: boolean
  details?: string
}

const tests: TestResult[] = []

function assert(condition: boolean, name: string, details?: string) {
  if (condition) {
    tests.push({ name, passed: true })
    console.log(`✅ [PASS] ${name}`)
  } else {
    tests.push({ name, passed: false, details })
    console.error(`❌ [FAIL] ${name}: ${details || 'Assertion failed'}`)
  }
}

console.log('=== STARTING I18N LANGUAGE SELECTOR & TRANSLATIONS TEST SUITE ===\n')

// 1. Verify all 11 supported locales are registered with proper metadata
assert(ALL_LOCALE_CODES.length === 11, 'Exactly 11 locales configured in ALL_LOCALE_CODES')
const expectedLocales = ['en', 'ml', 'hi', 'ta', 'te', 'kn', 'bn', 'mr', 'gu', 'pa', 'or']

for (const code of expectedLocales) {
  assert(isValidLocale(code), `isValidLocale('${code}') returns true`)
  const meta = getLocaleMeta(code)
  assert(meta.nativeName.length > 0, `Locale '${code}' has non-empty nativeName (${meta.nativeName})`)
  assert(meta.dir === 'ltr', `Locale '${code}' direction is 'ltr'`)
}

// 2. Verify UI_TRANSLATIONS completeness for all 11 languages
const requiredKeys = [
  'nav.home',
  'nav.allTools',
  'nav.categories',
  'nav.chequeStudio',
  'nav.about',
  'nav.search',
  'nav.exploreTools',
  'hero.featured',
  'hero.eyebrow',
  'hero.titleLine1',
  'hero.titleLine2',
  'hero.description',
  'hero.searchPlaceholder',
  'hero.exploreButton',
  'cat.drive.title',
  'cat.build.title',
  'cat.power.title',
  'cat.money.title',
  'cat.land.title',
  'cat.work.title',
  'cat.create.title',
  'action.reset',
  'action.copy',
  'action.share',
  'tool.clientSideBadge',
  'tool.howItWorks',
  'footer.privacyTitle',
  'footer.copyright',
]

for (const code of ALL_LOCALE_CODES) {
  const dict = UI_TRANSLATIONS[code]
  assert(!!dict, `Translation dictionary exists for locale '${code}'`)

  for (const key of requiredKeys) {
    const val = dict[key]
    assert(typeof val === 'string' && val.trim().length > 0, `Locale '${code}' has valid translation for key '${key}'`)
  }
}

// 3. Test getUITranslation function and fallback logic
assert(getUITranslation('ml', 'nav.home') === 'ഹോം', "getUITranslation('ml', 'nav.home') returns Malayalam 'ഹോം'")
assert(getUITranslation('hi', 'nav.home') === 'होम', "getUITranslation('hi', 'nav.home') returns Hindi 'होम'")
assert(getUITranslation('ta', 'nav.home') === 'முகப்பு', "getUITranslation('ta', 'nav.home') returns Tamil 'முகப்பு'")
assert(getUITranslation('te', 'nav.home') === 'హోమ్', "getUITranslation('te', 'nav.home') returns Telugu 'హోమ్'")
assert(getUITranslation('kn', 'nav.home') === 'ಮುಖಪುಟ', "getUITranslation('kn', 'nav.home') returns Kannada 'ಮುಖಪುಟ'")

// Fallback to English when key missing in specific locale
assert(
  getUITranslation('ml', 'non_existent_custom_key', 'FallbackText') === 'FallbackText',
  'Graceful fallback returned when key does not exist'
)

// Fallback to English dictionary when key present in English
assert(
  getUITranslation('en', 'nav.allTools') === 'All Tools',
  "getUITranslation('en', 'nav.allTools') returns 'All Tools'"
)

console.log('\n=== SUMMARY ===')
const passedCount = tests.filter((t) => t.passed).length
console.log(`Passed: ${passedCount}/${tests.length}`)

if (passedCount !== tests.length) {
  process.exit(1)
} else {
  console.log('All I18n translation tests passed successfully!')
}
