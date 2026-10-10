import { convertAmountToWords, convertToEnglishWords, formatInr } from '../src/lib/cheque/amountToWords.ts'
import { LANGUAGES, getLanguage, getTranslations } from '../src/lib/cheque/languages.ts'
import { BANKS, getBankById, filterBanks } from '../src/lib/cheque/banks.ts'
import { getPaymentModes, getPaymentModeInfo } from '../src/lib/cheque/paymentModes.ts'
import { validateChequeForm } from '../src/lib/cheque/validation.ts'
import type { SupportedLanguage } from '../src/lib/cheque/types.ts'

console.log('=== STARTING INDIAN CHEQUE STUDIO TEST SUITE ===\n')

let passCount = 0
let failCount = 0

function assert(condition: boolean, desc: string, details: string = '') {
  if (condition) {
    passCount++
    console.log(`✅ [PASS] ${desc}`)
  } else {
    failCount++
    console.error(`❌ [FAIL] ${desc} - ${details}`)
  }
}

// ==========================================
// 1. AMOUNT IN WORDS TESTS (ENGLISH BASELINE)
// ==========================================
console.log('\n1. Testing English Amount-to-Words Engine...')

assert(
  convertToEnglishWords(0) === 'Zero Rupees Only',
  'Zero rupees conversion',
  `Got: ${convertToEnglishWords(0)}`
)

assert(
  convertToEnglishWords(1) === 'One Rupee Only',
  'Singular Rupee for 1',
  `Got: ${convertToEnglishWords(1)}`
)

assert(
  convertToEnglishWords(50) === 'Fifty Rupees Only',
  'Two-digit amount (50)',
  `Got: ${convertToEnglishWords(50)}`
)

assert(
  convertToEnglishWords(1000) === 'One Thousand Rupees Only',
  'One Thousand',
  `Got: ${convertToEnglishWords(1000)}`
)

assert(
  convertToEnglishWords(125750) === 'One Lakh Twenty-Five Thousand Seven Hundred Fifty Rupees Only',
  'Indian Lakhs grouping (1,25,750)',
  `Got: ${convertToEnglishWords(125750)}`
)

assert(
  convertToEnglishWords(2500000) === 'Twenty-Five Lakhs Rupees Only',
  'Multiple Lakhs (25,00,000)',
  `Got: ${convertToEnglishWords(2500000)}`
)

assert(
  convertToEnglishWords(10000000) === 'One Crore Rupees Only',
  'One Crore (1,00,00,000)',
  `Got: ${convertToEnglishWords(10000000)}`
)

assert(
  convertToEnglishWords(50000000) === 'Five Crores Rupees Only',
  'Multiple Crores (5,00,00,000)',
  `Got: ${convertToEnglishWords(50000000)}`
)

assert(
  convertToEnglishWords(125750, 50) === 'One Lakh Twenty-Five Thousand Seven Hundred Fifty Rupees and Fifty Paise Only',
  'Rupees and Paise combination',
  `Got: ${convertToEnglishWords(125750, 50)}`
)

assert(
  convertToEnglishWords(0, 75) === 'Seventy-Five Paise Only',
  'Only Paise without Rupees',
  `Got: ${convertToEnglishWords(0, 75)}`
)

// ==========================================
// 2. MULTI-LANGUAGE CONVERSION TESTS
// ==========================================
console.log('\n2. Testing All 13 Supported Indian Languages...')

assert(LANGUAGES.length === 13, 'Total 13 Indian languages registered', `Found ${LANGUAGES.length}`)

const testLangs: SupportedLanguage[] = [
  'en', 'hi', 'ml', 'ta', 'te', 'kn', 'bn', 'mr', 'gu', 'pa', 'or', 'as', 'ur'
]

testLangs.forEach(lang => {
  const langInfo = getLanguage(lang)
  assert(langInfo.code === lang, `Language info resolves: ${lang} (${langInfo.name})`)

  const res = convertAmountToWords(125750, 0, lang)
  assert(res.words.length > 5, `Words generated for ${langInfo.name}`, res.words)
  assert(res.words.includes(langInfo.onlyWord), `Contains "${langInfo.onlyWord}" in ${langInfo.name}`, res.words)
  assert(res.wordsInEnglish === 'One Lakh Twenty-Five Thousand Seven Hundred Fifty Rupees Only', `English mirror present for ${lang}`)
})

// Specific Hindi Verification
const hiRes = convertAmountToWords(125750, 0, 'hi')
assert(
  hiRes.words.includes('लाख') && hiRes.words.includes('रुपये') && hiRes.words.includes('मात्र'),
  'Hindi output includes लाख, रुपये, and मात्र',
  hiRes.words
)

// Specific Urdu RTL verification
const urLang = getLanguage('ur')
assert(urLang.direction === 'rtl', 'Urdu direction is RTL')

// ==========================================
// 3. INR CURRENCY FORMATTING
// ==========================================
console.log('\n3. Testing Indian Comma Grouping (formatInr)...')

assert(formatInr(125750) === '₹ 1,25,750.00', 'Standard Indian comma formatting', `Got: ${formatInr(125750)}`)
assert(formatInr(10000000) === '₹ 1,00,00,000.00', '1 Crore formatting', `Got: ${formatInr(10000000)}`)
assert(formatInr(500) === '₹ 500.00', 'Hundreds formatting', `Got: ${formatInr(500)}`)
assert(formatInr('invalid') === '₹ 0.00', 'Graceful NaN handling', `Got: ${formatInr('invalid')}`)

// ==========================================
// 4. BANK REGISTRY & FILTERING
// ==========================================
console.log('\n4. Testing Indian Bank Registry...')

assert(BANKS.length >= 25, `Extensive bank registry (at least 25 banks, found ${BANKS.length})`)

const sbi = getBankById('sbi')
assert(sbi.name === 'State Bank of India', 'SBI resolved properly')
assert(sbi.category === 'public', 'SBI is Public sector')
assert(sbi.ifscPrefix.startsWith('SBIN'), 'SBI IFSC prefix is valid')

const hdfc = getBankById('hdfc')
assert(hdfc.category === 'private', 'HDFC is Private sector')

const pnb = getBankById('pnb')
assert(pnb.category === 'public', 'PNB is Public sector')

const publicBanks = filterBanks('', 'public')
assert(publicBanks.length >= 8, `Public banks count >= 8 (found ${publicBanks.length})`)

const privateBanks = filterBanks('', 'private')
assert(privateBanks.length >= 8, `Private banks count >= 8 (found ${privateBanks.length})`)

const rrbBanks = filterBanks('', 'rrb')
assert(rrbBanks.length >= 4, `RRB banks count >= 4 (found ${rrbBanks.length})`)

const coopBanks = filterBanks('', 'cooperative')
assert(coopBanks.length >= 2, `Cooperative banks count >= 2 (found ${coopBanks.length})`)

const searchResults = filterBanks('Canara', 'all')
assert(searchResults.some(b => b.name.includes('Canara')), 'Bank search matches Canara')

// ==========================================
// 5. PAYMENT MODES & EDUCATIONAL LABELS
// ==========================================
console.log('\n5. Testing Payment Modes & Crossings...')

const modes = getPaymentModes('en')
assert(modes.length === 4, '4 payment modes defined')

const acPayee = getPaymentModeInfo('account-payee', 'en')
assert(acPayee.chequeMarking === 'A/C PAYEE ONLY', 'A/C Payee marking')
assert(acPayee.safetyLevel === 'high', 'A/C Payee has high safety')

const cashMode = getPaymentModeInfo('cash', 'en')
assert(cashMode.safetyLevel === 'medium', 'Cash has medium safety')

const bearerMode = getPaymentModeInfo('bearer', 'en')
assert(bearerMode.safetyLevel === 'low', 'Bearer has low safety (high risk)')

// ==========================================
// 6. FORM VALIDATION
// ==========================================
console.log('\n6. Testing Form Validation...')

// Valid form
const validForm = validateChequeForm({
  date: '2026-10-10',
  payeeName: 'Ramesh Kumar',
  amountRupees: 50000,
  amountPaise: 0,
  accountHolderName: 'Priya Sharma',
  memo: 'Office Rent'
})
assert(validForm.isValid, 'Valid form passes validation')
assert(Object.keys(validForm.errors).length === 0, 'No errors in valid form')

// Invalid: Empty payee
const emptyPayee = validateChequeForm({
  date: '2026-10-10',
  payeeName: '',
  amountRupees: 50000,
  amountPaise: 0,
  accountHolderName: '',
  memo: ''
})
assert(!emptyPayee.isValid && !!emptyPayee.errors.payeeName, 'Empty payee triggers error')

// Invalid: Zero amount
const zeroAmount = validateChequeForm({
  date: '2026-10-10',
  payeeName: 'ABC Ltd',
  amountRupees: 0,
  amountPaise: 0,
  accountHolderName: '',
  memo: ''
})
assert(!zeroAmount.isValid && !!zeroAmount.errors.amount, 'Zero amount triggers error')

// Invalid: Excessive amount (> 100 Crores)
const excessiveAmount = validateChequeForm({
  date: '2026-10-10',
  payeeName: 'ABC Ltd',
  amountRupees: 2000000000,
  amountPaise: 0,
  accountHolderName: '',
  memo: ''
})
assert(!excessiveAmount.isValid && !!excessiveAmount.errors.amount, 'Excessive amount triggers error')

// Invalid: Missing date
const missingDate = validateChequeForm({
  date: '',
  payeeName: 'ABC Ltd',
  amountRupees: 5000,
  amountPaise: 0,
  accountHolderName: '',
  memo: ''
})
assert(!missingDate.isValid && !!missingDate.errors.date, 'Missing date triggers error')

// ==========================================
// SUMMARY
// ==========================================
console.log('\n=== TEST SUITE COMPLETE ===')
console.log(`TOTAL TESTS: ${passCount + failCount}`)
console.log(`PASSED: ${passCount}`)
console.log(`FAILED: ${failCount}`)

if (failCount > 0) {
  process.exit(1)
} else {
  console.log('\n🎉 ALL INDIAN CHEQUE STUDIO TESTS PASSED!')
}
