import { ModelPricing } from '../data/aiModels'

export interface CostCalculationParams {
  inputTokens: number
  outputTokens: number
  cachedInputPercentage?: number // 0 to 100
  callsPerDay: number
  billingDaysPerMonth?: number // default 30
  usdToInrRate?: number // default 85
}

export interface ModelCostBreakdown {
  model: ModelPricing
  isCustom: boolean
  isPricingAvailable: boolean
  inputTokens: number
  outputTokens: number
  cachedTokens: number
  uncachedTokens: number

  // Cost in USD
  inputCostUsd: number
  outputCostUsd: number
  requestCostUsd: number
  dailyCostUsd: number
  monthlyCostUsd: number
  annualCostUsd: number

  // Cost in INR
  inputCostInr: number
  outputCostInr: number
  requestCostInr: number
  dailyCostInr: number
  monthlyCostInr: number
  annualCostInr: number

  // Unit rates per 1M tokens
  effectiveInputRatePerMillionUsd: number
  outputRatePerMillionUsd: number
}

/**
 * Calculates comprehensive per-request, daily, monthly, and annual costs for a given model.
 */
export function calculateModelCost(
  model: ModelPricing,
  params: CostCalculationParams
): ModelCostBreakdown {
  const {
    inputTokens = 0,
    outputTokens = 0,
    cachedInputPercentage = 0,
    callsPerDay = 100,
    billingDaysPerMonth = 30,
    usdToInrRate = 85,
  } = params

  const safeInput = Math.max(0, inputTokens)
  const safeOutput = Math.max(0, outputTokens)
  const safeCachePercent = Math.min(100, Math.max(0, cachedInputPercentage)) / 100
  const safeCallsPerDay = Math.max(0, callsPerDay)
  const safeDaysPerMonth = Math.max(1, Math.min(31, billingDaysPerMonth))
  const safeRate = Math.max(1, usdToInrRate)

  const isPricingAvailable =
    model.inputPricePerMillion !== null &&
    model.inputPricePerMillion !== undefined &&
    model.outputPricePerMillion !== null &&
    model.outputPricePerMillion !== undefined

  if (!isPricingAvailable) {
    return {
      model,
      isCustom: model.provider === 'custom',
      isPricingAvailable: false,
      inputTokens: safeInput,
      outputTokens: safeOutput,
      cachedTokens: 0,
      uncachedTokens: safeInput,
      inputCostUsd: 0,
      outputCostUsd: 0,
      requestCostUsd: 0,
      dailyCostUsd: 0,
      monthlyCostUsd: 0,
      annualCostUsd: 0,
      inputCostInr: 0,
      outputCostInr: 0,
      requestCostInr: 0,
      dailyCostInr: 0,
      monthlyCostInr: 0,
      annualCostInr: 0,
      effectiveInputRatePerMillionUsd: 0,
      outputRatePerMillionUsd: 0,
    }
  }

  const baseInputPrice = model.inputPricePerMillion!
  const baseOutputPrice = model.outputPricePerMillion!
  const cachedInputPrice =
    model.cachedInputPricePerMillion !== null && model.cachedInputPricePerMillion !== undefined
      ? model.cachedInputPricePerMillion
      : baseInputPrice

  const cachedTokens = Math.round(safeInput * safeCachePercent)
  const uncachedTokens = safeInput - cachedTokens

  const cachedCostUsd = (cachedTokens / 1_000_000) * cachedInputPrice
  const uncachedCostUsd = (uncachedTokens / 1_000_000) * baseInputPrice
  const inputCostUsd = cachedCostUsd + uncachedCostUsd
  const outputCostUsd = (safeOutput / 1_000_000) * baseOutputPrice

  const requestCostUsd = inputCostUsd + outputCostUsd
  const dailyCostUsd = requestCostUsd * safeCallsPerDay
  const monthlyCostUsd = dailyCostUsd * safeDaysPerMonth
  const annualCostUsd = monthlyCostUsd * 12

  const inputCostInr = inputCostUsd * safeRate
  const outputCostInr = outputCostUsd * safeRate
  const requestCostInr = requestCostUsd * safeRate
  const dailyCostInr = dailyCostUsd * safeRate
  const monthlyCostInr = monthlyCostUsd * safeRate
  const annualCostInr = annualCostUsd * safeRate

  const effectiveInputRate = safeInput > 0 ? (inputCostUsd / safeInput) * 1_000_000 : baseInputPrice

  return {
    model,
    isCustom: model.provider === 'custom',
    isPricingAvailable: true,
    inputTokens: safeInput,
    outputTokens: safeOutput,
    cachedTokens,
    uncachedTokens,
    inputCostUsd,
    outputCostUsd,
    requestCostUsd,
    dailyCostUsd,
    monthlyCostUsd,
    annualCostUsd,
    inputCostInr,
    outputCostInr,
    requestCostInr,
    dailyCostInr,
    monthlyCostInr,
    annualCostInr,
    effectiveInputRatePerMillionUsd: effectiveInputRate,
    outputRatePerMillionUsd: baseOutputPrice,
  }
}

/**
 * Format currency with flexible decimal places (useful for micro-transactions < $0.01)
 */
export function formatCurrency(
  amount: number,
  currency: 'USD' | 'INR',
  minimumFractionDigits: number = 2
): string {
  if (amount === 0) {
    return currency === 'USD' ? '$0.00' : '₹0.00'
  }

  // Determine decimals based on magnitude
  let decimals = minimumFractionDigits
  if (amount < 0.001) {
    decimals = 6
  } else if (amount < 0.01) {
    decimals = 4
  } else if (amount < 1) {
    decimals = 3
  }

  if (currency === 'USD') {
    return `$${amount.toLocaleString('en-US', {
      minimumFractionDigits: Math.min(decimals, 6),
      maximumFractionDigits: Math.min(decimals, 6),
    })}`
  } else {
    return `₹${amount.toLocaleString('en-IN', {
      minimumFractionDigits: Math.min(decimals, 6),
      maximumFractionDigits: Math.min(decimals, 6),
    })}`
  }
}
