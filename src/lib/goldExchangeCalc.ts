// Pure calculation engine for Indian Gold Exchange & Jewellery Bill Estimation
import { safeNum, ensureFinite } from './calculations.ts'

export type GoldRateBasis = '24k' | '22k' | '18k'
export type GoldPurity = '24k' | '22k' | '18k' | '14k' | '916' | '750' | '585'
export type MakingChargeType = 'percent' | 'per_gram'
export type WastageType = 'percent' | 'grams'

export interface OldGoldExchangeInput {
  grossWeightGrams: number
  stoneWeightGrams: number
  purity: GoldPurity
  customDeductionPercent: number // e.g. melting/testing loss 1-3%
}

export interface NewJewelleryQuotationInput {
  name?: string
  grossWeightGrams: number
  stoneWeightGrams: number
  stonePriceInr: number
  purity: GoldPurity
  makingChargeType: MakingChargeType
  makingChargeValue: number // % or Rs/g
  wastageType: WastageType
  wastageValue: number // % or grams
  hallmarkingChargeInr: number
  otherChargesInr: number
  discountInr: number
}

export interface GoldExchangeCalculatorInput {
  ratePerGram: number // In entered rateBasis
  rateBasis: GoldRateBasis // 24k, 22k, or 18k
  gstPercent: number // default 3%
  oldGold?: OldGoldExchangeInput
  quoteA: NewJewelleryQuotationInput
  quoteB?: NewJewelleryQuotationInput
}

export interface OldGoldExchangeResult {
  netWeightGrams: number
  finenessRatio: number // 0.916, 0.750, etc.
  fineGoldEquivalentGrams: number
  deductionPercent: number
  deductionGrams: number
  payableWeightGrams: number
  ratePerGramEffective: number
  totalExchangeValueInr: number
  explanation: string
}

export interface SingleQuotationResult {
  name: string
  netGoldWeightGrams: number
  finenessRatio: number
  goldRatePerGramForPurity: number
  baseGoldValueInr: number
  wastageWeightGrams: number
  wastageValueInr: number
  makingChargeInr: number
  stonePriceInr: number
  hallmarkingChargeInr: number
  otherChargesInr: number
  subtotalBeforeDiscountInr: number
  discountInr: number
  taxableAmountInr: number
  gstPercent: number
  gstAmountInr: number
  totalBillInr: number
  effectiveCostPerGramInr: number
  breakdownSummary: string
}

export interface GoldExchangeCalculatorResult {
  rate24kPerGram: number
  rate22kPerGram: number
  rate18kPerGram: number
  oldGold: OldGoldExchangeResult | null
  quoteA: SingleQuotationResult
  quoteB: SingleQuotationResult | null
  netPayableWithExchangeA: number
  netPayableWithExchangeB: number | null
  savingsComparedBtoA: number | null // positive if A is cheaper than B
  warnings: string[]
}

// Convert purity string to mathematical fineness factor
export function getPurityFineness(purity: GoldPurity): number {
  switch (purity) {
    case '24k':
      return 1.0 // 99.9%
    case '22k':
    case '916':
      return 22 / 24 // 0.91666...
    case '18k':
    case '750':
      return 18 / 24 // 0.750
    case '14k':
    case '585':
      return 14 / 24 // 0.58333...
    default:
      return 22 / 24
  }
}

export function getPurityLabel(purity: GoldPurity): string {
  switch (purity) {
    case '24k':
      return '24K (999 Fine Gold)'
    case '22k':
      return '22K (916 Hallmarked)'
    case '916':
      return '916 Hallmark (22K)'
    case '18k':
      return '18K (750 Hallmark)'
    case '750':
      return '750 Hallmark (18K)'
    case '14k':
      return '14K (585 Hallmark)'
    case '585':
      return '585 Hallmark (14K)'
    default:
      return '22K (916)'
  }
}

// Normalize entered market rate to 24K, 22K, 18K benchmark
export function normalizeGoldRates(enteredRate: number, basis: GoldRateBasis): {
  rate24k: number
  rate22k: number
  rate18k: number
} {
  const safeRate = safeNum(enteredRate, 0, 1e7, 7200)
  let rate24k = 0

  if (basis === '24k') {
    rate24k = safeRate
  } else if (basis === '22k') {
    rate24k = safeRate / (22 / 24)
  } else if (basis === '18k') {
    rate24k = safeRate / (18 / 24)
  }

  const rate22k = rate24k * (22 / 24)
  const rate18k = rate24k * (18 / 24)

  return {
    rate24k: Math.round(rate24k * 100) / 100,
    rate22k: Math.round(rate22k * 100) / 100,
    rate18k: Math.round(rate18k * 100) / 100,
  }
}

export function calculateOldGoldExchange(
  oldGold: OldGoldExchangeInput,
  rate24kPerGram: number
): OldGoldExchangeResult {
  const gross = safeNum(oldGold.grossWeightGrams, 0, 1e5, 0)
  const stones = safeNum(oldGold.stoneWeightGrams, 0, gross, 0)
  const netWeight = Math.max(0, gross - stones)

  const fineness = getPurityFineness(oldGold.purity)
  const deductionPct = safeNum(oldGold.customDeductionPercent, 0, 50, 0) / 100

  // 1. Calculate pure 24K gold content
  const pureGoldGrams = netWeight * fineness
  // 2. Apply melting / testing deduction on net weight or pure content
  const deductionGrams = Number((pureGoldGrams * deductionPct).toFixed(3))
  const payableFineGrams = Math.max(0, pureGoldGrams - deductionGrams)

  // Total cash value based on 24K pure rate
  const totalValue = Math.round(payableFineGrams * rate24kPerGram)
  const rateEffective = netWeight > 0 ? Math.round(totalValue / netWeight) : 0

  return {
    netWeightGrams: Number(netWeight.toFixed(3)),
    finenessRatio: fineness,
    fineGoldEquivalentGrams: Number(pureGoldGrams.toFixed(3)),
    deductionPercent: deductionPct * 100,
    deductionGrams,
    payableWeightGrams: Number(payableFineGrams.toFixed(3)),
    ratePerGramEffective: rateEffective,
    totalExchangeValueInr: totalValue,
    explanation: `Net weight ${netWeight.toFixed(2)}g at ${getPurityLabel(oldGold.purity)} = ${pureGoldGrams.toFixed(2)}g pure gold. After ${(deductionPct * 100)}% deduction (${deductionGrams.toFixed(2)}g), payable equivalent is ${payableFineGrams.toFixed(2)}g @ ₹${rate24kPerGram}/g 24K.`,
  }
}

export function calculateSingleJewelleryQuote(
  quote: NewJewelleryQuotationInput,
  rates: { rate24k: number; rate22k: number; rate18k: number },
  gstPercent: number
): SingleQuotationResult {
  const gross = safeNum(quote.grossWeightGrams, 0, 1e5, 0)
  const stones = safeNum(quote.stoneWeightGrams, 0, gross, 0)
  const netWeight = Math.max(0, gross - stones)

  const fineness = getPurityFineness(quote.purity)
  const rateForPurity = Math.round(rates.rate24k * fineness * 100) / 100

  // 1. Base Gold Metal Value
  const baseGoldValue = Math.round(netWeight * rateForPurity)

  // 2. Wastage (VA - Value Addition)
  let wastageWeight = 0
  let wastageValue = 0
  if (quote.wastageType === 'grams') {
    wastageWeight = safeNum(quote.wastageValue, 0, 1000, 0)
    wastageValue = Math.round(wastageWeight * rateForPurity)
  } else {
    const wastagePct = safeNum(quote.wastageValue, 0, 50, 0) / 100
    wastageValue = Math.round(baseGoldValue * wastagePct)
    wastageWeight = rateForPurity > 0 ? Number((wastageValue / rateForPurity).toFixed(3)) : 0
  }

  // 3. Making Charges
  let makingCharge = 0
  if (quote.makingChargeType === 'per_gram') {
    const perGramRate = safeNum(quote.makingChargeValue, 0, 100000, 0)
    makingCharge = Math.round(netWeight * perGramRate)
  } else {
    const makingPct = safeNum(quote.makingChargeValue, 0, 100, 0) / 100
    makingCharge = Math.round(baseGoldValue * makingPct)
  }

  // 4. Other itemized additions
  const stonePrice = Math.round(safeNum(quote.stonePriceInr, 0, 1e8, 0))
  const hallmarking = Math.round(safeNum(quote.hallmarkingChargeInr, 0, 5000, 45)) // BIS hallmark ~₹45+GST per piece
  const otherCharges = Math.round(safeNum(quote.otherChargesInr, 0, 1e7, 0))
  const discount = Math.round(safeNum(quote.discountInr, 0, 1e8, 0))

  // 5. Taxable Amount before GST
  const subtotalBeforeDiscount =
    baseGoldValue + wastageValue + makingCharge + stonePrice + hallmarking + otherCharges
  const taxableAmount = Math.max(0, subtotalBeforeDiscount - discount)

  // 6. GST Calculation (default 3% on jewellery in India)
  const safeGstPct = safeNum(gstPercent, 0, 28, 3)
  const gstAmount = Math.round(taxableAmount * (safeGstPct / 100))
  const totalBill = taxableAmount + gstAmount

  const effectiveCostPerGram = netWeight > 0 ? Math.round(totalBill / netWeight) : 0

  return {
    name: quote.name || 'Quotation',
    netGoldWeightGrams: Number(netWeight.toFixed(3)),
    finenessRatio: fineness,
    goldRatePerGramForPurity: rateForPurity,
    baseGoldValueInr: baseGoldValue,
    wastageWeightGrams: Number(wastageWeight.toFixed(3)),
    wastageValueInr: wastageValue,
    makingChargeInr: makingCharge,
    stonePriceInr: stonePrice,
    hallmarkingChargeInr: hallmarking,
    otherChargesInr: otherCharges,
    subtotalBeforeDiscountInr: subtotalBeforeDiscount,
    discountInr: discount,
    taxableAmountInr: taxableAmount,
    gstPercent: safeGstPct,
    gstAmountInr: gstAmount,
    totalBillInr: totalBill,
    effectiveCostPerGramInr: effectiveCostPerGram,
    breakdownSummary: `${netWeight.toFixed(2)}g Gold: ₹${baseGoldValue.toLocaleString('en-IN')} | Wastage: ₹${wastageValue.toLocaleString('en-IN')} | Making: ₹${makingCharge.toLocaleString('en-IN')} | Tax: ₹${gstAmount.toLocaleString('en-IN')} | Total: ₹${totalBill.toLocaleString('en-IN')}`,
  }
}

export function calculateGoldExchange(
  input: GoldExchangeCalculatorInput
): GoldExchangeCalculatorResult {
  const rates = normalizeGoldRates(input.ratePerGram, input.rateBasis)
  const gst = safeNum(input.gstPercent, 0, 28, 3)
  const warnings: string[] = []

  let oldGoldResult: OldGoldExchangeResult | null = null
  if (input.oldGold && input.oldGold.grossWeightGrams > 0) {
    oldGoldResult = calculateOldGoldExchange(input.oldGold, rates.rate24k)
  }

  const quoteAResult = calculateSingleJewelleryQuote(input.quoteA, rates, gst)

  let quoteBResult: SingleQuotationResult | null = null
  if (input.quoteB && input.quoteB.grossWeightGrams > 0) {
    quoteBResult = calculateSingleJewelleryQuote(input.quoteB, rates, gst)
  }

  const exchangeVal = oldGoldResult ? oldGoldResult.totalExchangeValueInr : 0
  const netPayableA = Math.max(0, quoteAResult.totalBillInr - exchangeVal)
  const netPayableB = quoteBResult ? Math.max(0, quoteBResult.totalBillInr - exchangeVal) : null

  let savingsComparedBtoA: number | null = null
  if (quoteBResult) {
    savingsComparedBtoA = quoteBResult.totalBillInr - quoteAResult.totalBillInr
  }

  if (quoteAResult.makingChargeInr + quoteAResult.wastageValueInr > quoteAResult.baseGoldValueInr * 0.35) {
    warnings.push(
      'Combined making charges and wastage in Quotation A exceed 35% of metal value. Consider negotiating or asking for transparent breakdown.'
    )
  }

  if (quoteBResult && quoteBResult.makingChargeInr + quoteBResult.wastageValueInr > quoteBResult.baseGoldValueInr * 0.35) {
    warnings.push(
      'Combined making charges and wastage in Quotation B exceed 35% of metal value.'
    )
  }

  if (input.oldGold && input.oldGold.stoneWeightGrams > input.oldGold.grossWeightGrams * 0.4) {
    warnings.push(
      'Stone weight deduction in old gold is unusually high (>40% of gross weight). Verify stone weights on a precision electronic carat balance.'
    )
  }

  return ensureFinite({
    rate24kPerGram: rates.rate24k,
    rate22kPerGram: rates.rate22k,
    rate18kPerGram: rates.rate18k,
    oldGold: oldGoldResult,
    quoteA: quoteAResult,
    quoteB: quoteBResult,
    netPayableWithExchangeA: netPayableA,
    netPayableWithExchangeB: netPayableB,
    savingsComparedBtoA,
    warnings,
  })
}
