import {
  calculateGoldExchange,
  normalizeGoldRates,
  getPurityFineness,
  calculateOldGoldExchange,
  calculateSingleJewelleryQuote,
} from '../src/lib/goldExchangeCalc.ts'
import type { GoldExchangeCalculatorInput } from '../src/lib/goldExchangeCalc.ts'
import { SUPPORTED_LOCALES, ALL_LOCALE_CODES, isValidLocale } from '../src/i18n/locales.ts'
import { GOLD_TOOL_I18N, getGoldToolTranslation } from '../src/i18n/goldToolI18n.ts'

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

console.log('=== STARTING GOLD EXCHANGE & MULTILINGUAL I18N TEST SUITE ===\n')

// 1. Purity Fineness Ratios
assert(getPurityFineness('24k') === 1.0, '24K fineness is 1.0')
assert(Math.abs(getPurityFineness('22k') - 22 / 24) < 1e-6, '22K fineness is 22/24 (~0.9167)')
assert(Math.abs(getPurityFineness('916') - 22 / 24) < 1e-6, '916 fineness is identical to 22K')
assert(Math.abs(getPurityFineness('18k') - 0.75) < 1e-6, '18K fineness is 0.75 (750 hallmark)')
assert(Math.abs(getPurityFineness('14k') - 14 / 24) < 1e-6, '14K fineness is 14/24 (~0.5833)')

// 2. Gold Rate Normalization
const ratesFrom22k = normalizeGoldRates(7250, '22k')
assert(ratesFrom22k.rate22k === 7250, '22K rate preserved when basis is 22k')
assert(ratesFrom22k.rate24k > 7250, '24K pure rate is correctly calculated higher than 22K')
assert(ratesFrom22k.rate18k < 7250, '18K rate is correctly calculated lower than 22K')

const ratesFrom24k = normalizeGoldRates(7909.09, '24k')
assert(Math.round(ratesFrom24k.rate22k) === 7250, '24K rate back-converts accurately to 22K')

// 3. Old Gold Exchange Value
const oldGoldRes = calculateOldGoldExchange(
  {
    grossWeightGrams: 16.5,
    stoneWeightGrams: 0.5, // net 16.0g
    purity: '22k',
    customDeductionPercent: 1.0, // 1% melting test loss
  },
  ratesFrom22k.rate24k
)

assert(oldGoldRes.netWeightGrams === 16.0, 'Old gold stone weight deducted (16.5 - 0.5 = 16.0g net)')
assert(oldGoldRes.fineGoldEquivalentGrams > 14.5 && oldGoldRes.fineGoldEquivalentGrams < 14.7, 'Fine 24K equivalent is ~14.667g')
assert(oldGoldRes.totalExchangeValueInr > 110000 && oldGoldRes.totalExchangeValueInr < 120000, 'Exchange value is realistic (~₹1,14,800)')

// 4. New Jewellery Billing (Quotation A)
const newQuoteRes = calculateSingleJewelleryQuote(
  {
    grossWeightGrams: 24.0,
    stoneWeightGrams: 0.0,
    stonePriceInr: 0,
    purity: '22k',
    makingChargeType: 'percent',
    makingChargeValue: 12, // 12%
    wastageType: 'percent',
    wastageValue: 0,
    hallmarkingChargeInr: 45,
    otherChargesInr: 0,
    discountInr: 1000,
  },
  ratesFrom22k,
  3.0 // 3% GST
)

assert(newQuoteRes.netGoldWeightGrams === 24.0, 'New ornament net weight is 24.0g')
assert(newQuoteRes.baseGoldValueInr === 24.0 * 7250, 'Base gold metal value matches 24g * ₹7,250 = ₹1,74,000')
assert(newQuoteRes.makingChargeInr === Math.round(174000 * 0.12), 'Making charge is 12% of metal value = ₹20,880')
assert(newQuoteRes.gstPercent === 3, 'GST rate is 3%')
assert(newQuoteRes.totalBillInr > 195000 && newQuoteRes.totalBillInr < 205000, 'Total bill with GST is ~₹2,00,996')

// 5. Full Exchange & Two Quotations Comparison
const fullExchangeRes = calculateGoldExchange({
  ratePerGram: 7250,
  rateBasis: '22k',
  gstPercent: 3,
  oldGold: {
    grossWeightGrams: 16.5,
    stoneWeightGrams: 0.5,
    purity: '22k',
    customDeductionPercent: 1.0,
  },
  quoteA: {
    grossWeightGrams: 24.0,
    stoneWeightGrams: 0.0,
    stonePriceInr: 0,
    purity: '22k',
    makingChargeType: 'percent',
    makingChargeValue: 12,
    wastageType: 'percent',
    wastageValue: 0,
    hallmarkingChargeInr: 45,
    otherChargesInr: 0,
    discountInr: 1000,
  },
  quoteB: {
    grossWeightGrams: 24.0,
    stoneWeightGrams: 0.0,
    stonePriceInr: 0,
    purity: '22k',
    makingChargeType: 'per_gram',
    makingChargeValue: 650, // ₹650/g
    wastageType: 'percent',
    wastageValue: 3, // 3%
    hallmarkingChargeInr: 45,
    otherChargesInr: 0,
    discountInr: 500,
  },
})

assert(fullExchangeRes.netPayableWithExchangeA < fullExchangeRes.quoteA.totalBillInr, 'Net cash payable correctly discounts old gold value')
assert(fullExchangeRes.savingsComparedBtoA !== null, 'Side-by-side comparison generates savings delta')
assert(typeof fullExchangeRes.savingsComparedBtoA === 'number', 'Savings delta is a valid number')

// 6. Multilingual I18n Coverage Tests (All 11 Languages)
assert(ALL_LOCALE_CODES.length === 11, 'All 11 requested Indian languages registered in SUPPORTED_LOCALES')

ALL_LOCALE_CODES.forEach((loc) => {
  const trans = getGoldToolTranslation(loc)
  assert(trans.locale === loc, `Translation exists for locale: ${loc}`)
  assert(trans.title.length > 5 && trans.title.includes('IndiaTools'), `Title valid for locale: ${loc}`)
  assert(trans.metaDescription.length > 15, `Meta description valid for locale: ${loc}`)
  assert(trans.h1.length > 3, `H1 heading valid for locale: ${loc}`)
  assert(trans.subtitle.length > 5, `Subtitle valid for locale: ${loc}`)
  assert(trans.introText.length > 20, `Intro text valid for locale: ${loc}`)
  assert(trans.faqs.length >= 3, `At least 3 complete FAQs present for locale: ${loc}`)
  assert(trans.tips.length >= 3, `At least 3 buying tips present for locale: ${loc}`)
})

// 7. Edge Cases & Zero Input Safety
const zeroExchangeRes = calculateGoldExchange({
  ratePerGram: 0,
  rateBasis: '22k',
  gstPercent: 0,
  quoteA: {
    grossWeightGrams: 0,
    stoneWeightGrams: 0,
    stonePriceInr: 0,
    purity: '22k',
    makingChargeType: 'percent',
    makingChargeValue: 0,
    wastageType: 'percent',
    wastageValue: 0,
    hallmarkingChargeInr: 0,
    otherChargesInr: 0,
    discountInr: 0,
  },
})

assert(zeroExchangeRes.quoteA.totalBillInr === 0, 'Zero weights and rates produce zero bill without NaN')
assert(Number.isFinite(zeroExchangeRes.quoteA.effectiveCostPerGramInr), 'Zero weight handled safely for effective cost per gram')

console.log(`\n=== TEST SUITE COMPLETE: ${tests.filter((t) => t.passed).length} / ${tests.length} PASSED ===`)
if (tests.some((t) => !t.passed)) {
  process.exit(1)
}
