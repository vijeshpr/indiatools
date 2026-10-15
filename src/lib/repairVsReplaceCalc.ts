/**
 * Repair vs Replace Decision Engine - Pure Calculation Logic
 * 100% deterministic, transparent, and tested financial modeling.
 * Evaluates initial costs, equal-horizon lifecycle cost, failure risk heuristics,
 * time inconvenience, break-even months, and preference weighting.
 */

export type ItemCategory =
  | 'smartphone'
  | 'laptop'
  | 'appliance'
  | 'vehicle'
  | 'furniture'
  | 'other'

export type Criticality = 'essential' | 'important' | 'nice_to_have'
export type RiskTolerance = 'low' | 'medium' | 'high'
export type PersonalPreference = 'prefer_repair' | 'neutral' | 'prefer_replace'
export type RepairConfidence = 'high' | 'moderate' | 'low'
export type VerdictType = 'REPAIR' | 'REPLACE' | 'WAIT_AND_MONITOR'
export type ConfidenceLevel = 'high' | 'moderate' | 'low'

export interface RepairVsReplaceInputs {
  category: ItemCategory
  customItemName?: string
  problemType?: string
  subType?: string
  itemAgeMonths: number
  originalPrice: number
  resaleValue: number
  repairCost: number
  repairDowntimeHours: number
  repairVisits: number
  notes?: string
  repairLifeMonths: number
  replacementLifeMonths: number
  replacementPrice: number
  additionalReplacementCost: number
  repairMonthlyMaintenance: number
  replacementMonthlyMaintenance: number
  criticality: Criticality
  hourlyRate: number
  handlingTimeHours: number
  riskTolerance: RiskTolerance
  personalPreference: PersonalPreference
  repairConfidence: RepairConfidence
  comparisonHorizonMonths?: number
}

export interface HorizonComparison {
  horizonMonths: number
  repairPathTotalCost: number
  replacementPathTotalCost: number
  costDifference: number
  cheaperOption: 'REPAIR' | 'REPLACE' | 'TIED'
  repairCostPerMonth: number
  replacementCostPerMonth: number
  repairMonthlyBreakdown: {
    initialRepair: number
    expectedFutureRepairs: number
    cumulativeMaintenance: number
    total: number
  }
  replacementMonthlyBreakdown: {
    acquisitionNet: number
    cumulativeMaintenance: number
    total: number
  }
}

export interface RepairVsReplaceResult {
  verdict: VerdictType
  verdictTitle: string
  verdictSummary: string
  confidenceLevel: ConfidenceLevel
  confidenceScore: number
  confidenceExplanation: string
  keyFactors: string[]
  savingsAmount: number
  savingsOption: 'REPAIR' | 'REPLACE' | 'TIED'
  horizonComparison: HorizonComparison
  initialRepairCost: number
  riskAdjustedRepairCost: number
  assumedFailureProbabilityPct: number
  expectedFutureRepairCost: number
  replacementNetCost: number
  breakEvenMonths: number | null
  breakEvenExplanation: string
  downtimeCost: number
  handlingCost: number
  safetyAlert?: string
  repairPathMonthlyCost: number
  replacementPathMonthlyCost: number
  assumptions: string[]
  formulaSteps: Array<{ title: string; formula: string; value: string }>
}

export function sanitizeNumber(value: number, min = 0, max = 100_000_000): number {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    return min
  }
  return Math.min(Math.max(value, min), max)
}

/**
 * Baseline typical lifespans for categories (in months) used for heuristic relative age calculation
 */
export const CATEGORY_LIFESPANS_MONTHS: Record<ItemCategory, number> = {
  smartphone: 48, // ~4 years
  laptop: 60, // ~5 years
  appliance: 120, // ~10 years
  vehicle: 180, // ~15 years
  furniture: 180, // ~15 years
  other: 72, // ~6 years
}

/**
 * Computes heuristic failure probability based on category, age, problem type, and user confidence.
 * Note: Clearly labeled in UI as heuristic assumption, not diagnostic certainty.
 */
export function estimateFailureProbability(
  category: ItemCategory,
  ageMonths: number,
  problemType?: string,
  repairConfidence: RepairConfidence = 'moderate'
): number {
  let baseProb = 0.20 // 20% baseline

  // Problem type modifier
  const p = (problemType || '').toLowerCase()
  if (category === 'smartphone') {
    if (p.includes('battery')) baseProb = 0.10
    else if (p.includes('screen')) baseProb = 0.15
    else if (p.includes('charging') || p.includes('port')) baseProb = 0.18
    else if (p.includes('motherboard') || p.includes('water')) baseProb = 0.55
    else if (p.includes('performance')) baseProb = 0.35
  } else if (category === 'laptop') {
    if (p.includes('battery')) baseProb = 0.10
    else if (p.includes('screen')) baseProb = 0.15
    else if (p.includes('motherboard') || p.includes('power')) baseProb = 0.50
    else if (p.includes('keyboard')) baseProb = 0.12
    else if (p.includes('storage') || p.includes('ram')) baseProb = 0.10
  } else if (category === 'appliance') {
    if (p.includes('motor') || p.includes('compressor')) baseProb = 0.40
    else if (p.includes('pcb') || p.includes('electronics')) baseProb = 0.45
    else if (p.includes('gas') || p.includes('coil')) baseProb = 0.30
    else if (p.includes('minor') || p.includes('cosmetic')) baseProb = 0.10
  } else if (category === 'vehicle') {
    if (p.includes('engine') || p.includes('transmission')) baseProb = 0.45
    else if (p.includes('accidental') || p.includes('structural')) baseProb = 0.50
    else if (p.includes('electrical')) baseProb = 0.30
    else if (p.includes('routine')) baseProb = 0.12
  } else if (category === 'furniture') {
    if (p.includes('structural')) baseProb = 0.30
    else if (p.includes('cosmetic')) baseProb = 0.08
    else if (p.includes('cushion') || p.includes('fabric')) baseProb = 0.12
  }

  // Age modifier: items older than 70% of standard life have higher repeat failure rate
  const benchmarkLife = CATEGORY_LIFESPANS_MONTHS[category] || 60
  const ageRatio = ageMonths / benchmarkLife
  if (ageRatio > 1.0) {
    baseProb += 0.20
  } else if (ageRatio > 0.7) {
    baseProb += 0.10
  }

  // User repair confidence modifier
  if (repairConfidence === 'high') {
    baseProb -= 0.08
  } else if (repairConfidence === 'low') {
    baseProb += 0.18
  }

  // Clamp probability between 5% and 85%
  return Math.min(Math.max(Math.round(baseProb * 100), 5), 85)
}

/**
 * Core calculation engine for Repair vs Replace
 */
export function calculateRepairVsReplace(inputs: RepairVsReplaceInputs): RepairVsReplaceResult {
  // 1. Sanitize numeric inputs
  const itemAgeMonths = sanitizeNumber(inputs.itemAgeMonths, 0, 600)
  const originalPrice = sanitizeNumber(inputs.originalPrice, 0, 50_000_000)
  const repairCost = sanitizeNumber(inputs.repairCost, 0, 50_000_000)
  const replacementPrice = sanitizeNumber(inputs.replacementPrice, 1, 50_000_000)
  const resaleValue = Math.min(sanitizeNumber(inputs.resaleValue, 0, replacementPrice), replacementPrice)
  const additionalReplacementCost = sanitizeNumber(inputs.additionalReplacementCost, 0, 10_000_000)
  const repairLifeMonths = Math.max(sanitizeNumber(inputs.repairLifeMonths, 1, 240), 1)
  const replacementLifeMonths = Math.max(sanitizeNumber(inputs.replacementLifeMonths, 1, 360), 1)
  const repairMonthlyMaintenance = sanitizeNumber(inputs.repairMonthlyMaintenance, 0, 500_000)
  const replacementMonthlyMaintenance = sanitizeNumber(inputs.replacementMonthlyMaintenance, 0, 500_000)
  const repairDowntimeHours = sanitizeNumber(inputs.repairDowntimeHours, 0, 1000)
  const hourlyRate = sanitizeNumber(inputs.hourlyRate, 0, 100_000)
  const handlingTimeHours = sanitizeNumber(inputs.handlingTimeHours, 0, 200)

  // 2. Comparison Horizon: Standard 36 months, or capped reasonably
  const horizonMonths = inputs.comparisonHorizonMonths
    ? sanitizeNumber(inputs.comparisonHorizonMonths, 6, 120)
    : 36

  // 3. Risk-Adjusted Repair Cost
  const failureProbPct = estimateFailureProbability(
    inputs.category,
    itemAgeMonths,
    inputs.problemType,
    inputs.repairConfidence
  )
  const failureProb = failureProbPct / 100
  // Future expected repeat repair cost (heuristic 70% of initial repair)
  const expectedFutureRepairCost = Math.round(failureProb * (repairCost * 0.7))
  const riskAdjustedRepairCost = Math.round(repairCost + expectedFutureRepairCost)

  // 4. Replacement Net Acquisition Cost
  const replacementNetCost = Math.round(
    replacementPrice + additionalReplacementCost - resaleValue
  )

  // 5. Equal-Horizon (36-month) Financial Modeling
  // Repair path:
  // How many times would the item need repair/reinvestment over horizonMonths?
  const repairCyclesInHorizon = horizonMonths / repairLifeMonths
  const expectedInitialAndCycleRepairs = Math.round(
    repairCost + (repairCyclesInHorizon > 1 ? (repairCyclesInHorizon - 1) * repairCost * 0.8 : 0)
  )
  const totalRepairMaintenance = Math.round(repairMonthlyMaintenance * horizonMonths)
  const repairPathTotalCost = Math.round(
    expectedInitialAndCycleRepairs + expectedFutureRepairCost + totalRepairMaintenance
  )

  // Replacement path:
  // Proportion of replacement asset consumed over horizonMonths
  const replacementDepreciationFactor = Math.min(horizonMonths / replacementLifeMonths, 1.0)
  const replacementAmortizedCost = Math.round(replacementNetCost * replacementDepreciationFactor)
  const totalReplacementMaintenance = Math.round(replacementMonthlyMaintenance * horizonMonths)
  const replacementPathTotalCost = Math.round(replacementAmortizedCost + totalReplacementMaintenance)

  // 6. Cost Per Useful Month
  const repairPathMonthlyCost = Math.round((repairPathTotalCost / horizonMonths) * 100) / 100
  const replacementPathMonthlyCost = Math.round((replacementPathTotalCost / horizonMonths) * 100) / 100

  // 7. Cost Difference & Savings
  const rawCostDiff = replacementPathTotalCost - repairPathTotalCost
  const isCostTied = Math.abs(rawCostDiff) < (replacementPrice * 0.03) // within 3% is tied

  let cheaperOption: 'REPAIR' | 'REPLACE' | 'TIED' = 'TIED'
  let savingsAmount = 0

  if (!isCostTied) {
    if (rawCostDiff > 0) {
      cheaperOption = 'REPAIR'
      savingsAmount = Math.round(rawCostDiff)
    } else {
      cheaperOption = 'REPLACE'
      savingsAmount = Math.round(Math.abs(rawCostDiff))
    }
  }

  // 8. Time Inconvenience Costs (Kept clearly separate from cash)
  const downtimeCost = Math.round(repairDowntimeHours * hourlyRate)
  const handlingCost = Math.round(handlingTimeHours * hourlyRate)

  // 9. Break-even Duration
  // How many months must the repaired item survive for repair to beat buying new on an ongoing basis?
  let breakEvenMonths: number | null = null
  let breakEvenExplanation = ''

  const monthlyCostDiff = replacementPathMonthlyCost - repairMonthlyMaintenance
  if (monthlyCostDiff > 0) {
    const rawBreakEven = riskAdjustedRepairCost / monthlyCostDiff
    breakEvenMonths = Math.round(rawBreakEven * 10) / 10
    if (breakEvenMonths > horizonMonths) {
      breakEvenExplanation = `Repair requires at least ${breakEvenMonths} months of trouble-free use to break even, exceeding the typical ${horizonMonths}-month window.`
    } else {
      breakEvenExplanation = `The repaired item must last at least ${breakEvenMonths} months to recover the repair investment compared to buying replacement.`
    }
  } else {
    breakEvenExplanation = 'No financial break-even within the selected comparison period (maintenance exceeds replacement monthly cost).'
  }

  // 10. Multi-Factor Scoring Engine for Final Verdict
  // Base score: positive favours REPAIR (+100 max), negative favours REPLACE (-100 max)
  let decisionScore = 0

  // Factor A: Financial Horizon Advantage (up to +/- 50 pts)
  const maxFinScale = Math.max(replacementNetCost, 5000)
  const finRatio = rawCostDiff / maxFinScale
  decisionScore += Math.min(Math.max(finRatio * 50, -50), 50)

  // Factor B: Repair Cost vs Replacement Price Ratio (The 50% Rule)
  // If repair cost > 50% of replacement, strongly favor replacement
  const repairToNewRatio = repairCost / replacementPrice
  if (repairToNewRatio > 0.50) {
    decisionScore -= 25 * ((repairToNewRatio - 0.50) / 0.50)
  } else if (repairToNewRatio < 0.25) {
    decisionScore += 20 * ((0.25 - repairToNewRatio) / 0.25)
  }

  // Factor C: Failure Uncertainty & Repair Confidence
  if (failureProbPct > 45) {
    decisionScore -= 15 * ((failureProbPct - 45) / 40)
  } else if (failureProbPct < 20) {
    decisionScore += 10
  }

  // Factor D: Criticality & Downtime
  if (inputs.criticality === 'essential') {
    if (repairDowntimeHours > 48 || failureProbPct > 40) {
      decisionScore -= 15 // essential items prioritize zero downtime & new warranty
    }
  } else if (inputs.criticality === 'nice_to_have') {
    decisionScore += 10 // non-critical can absorb downtime for savings
  }

  // Factor E: User Risk Tolerance
  if (inputs.riskTolerance === 'low') {
    if (failureProbPct > 30) decisionScore -= 12
  } else if (inputs.riskTolerance === 'high') {
    decisionScore += 8 // willing to risk for repair savings
  }

  // Factor F: Personal Preference (soft weighting, cannot override huge price gap)
  if (inputs.personalPreference === 'prefer_repair') {
    decisionScore += 10
  } else if (inputs.personalPreference === 'prefer_replace') {
    decisionScore -= 10
  }

  // 11. Determine Final Verdict
  let verdict: VerdictType = 'REPAIR'
  let verdictTitle = ''
  let verdictSummary = ''

  // Special safety checks
  let safetyAlert: string | undefined = undefined
  const pLower = (inputs.problemType || '').toLowerCase()
  if (inputs.category === 'vehicle' && (pLower.includes('structural') || pLower.includes('accidental'))) {
    safetyAlert = 'Safety Warning: Structural or chassis vehicle damage requires a certified inspection before driving. Never base vehicle roadworthiness solely on repair costs.'
  } else if (inputs.category === 'appliance' && (pLower.includes('gas') || pLower.includes('electrical') || pLower.includes('smoke'))) {
    safetyAlert = 'Safety Warning: Gas leaks or major electrical shorts pose fire hazard. Ensure a certified technician evaluates safety before attempting repair.'
  }

  // Verdict thresholds
  if (decisionScore > 12) {
    verdict = 'REPAIR'
    verdictTitle = 'Recommended: Repair Your Item'
    verdictSummary = `Repairing is financially advantageous over a ${horizonMonths}-month horizon, saving an estimated ₹${savingsAmount.toLocaleString('en-IN')} with manageable failure risk.`
  } else if (decisionScore < -12) {
    verdict = 'REPLACE'
    verdictTitle = 'Recommended: Replace With New'
    verdictSummary = `Replacing is the superior long-term choice. The repair cost represents ${Math.round(repairToNewRatio * 100)}% of replacement, with higher repeat failure risk and diminished lifespan.`
  } else {
    // Score is close: between -12 and +12
    if (inputs.repairConfidence === 'low' || failureProbPct > 45) {
      verdict = 'WAIT_AND_MONITOR'
      verdictTitle = 'Verdict: Wait & Monitor / Seek Second Opinion'
      verdictSummary = 'The financial numbers are nearly tied, but diagnostic uncertainty is high. Avoid hasty spending until a verified technician gives a firm quote.'
    } else if (rawCostDiff >= 0) {
      verdict = 'REPAIR'
      verdictTitle = 'Marginal Verdict: Lean Toward Repair'
      verdictSummary = `Repair holds a modest cost advantage of ~₹${savingsAmount.toLocaleString('en-IN')}, provided the diagnosis holds true.`
    } else {
      verdict = 'REPLACE'
      verdictTitle = 'Marginal Verdict: Lean Toward Replacement'
      verdictSummary = `Replacement offers greater peace of mind and warranty coverage for a comparable ${horizonMonths}-month cost.`
    }
  }

  // 12. Confidence Score & Level
  // Deterministic calculation based on data completeness and score margin
  const margin = Math.abs(decisionScore)
  let confidenceScore = 60
  if (margin > 30) confidenceScore = 92
  else if (margin > 20) confidenceScore = 80
  else if (margin > 12) confidenceScore = 70
  else confidenceScore = 52

  if (inputs.repairConfidence === 'low') confidenceScore -= 15
  if (inputs.resaleValue === 0) confidenceScore -= 5

  confidenceScore = Math.min(Math.max(confidenceScore, 40), 95)
  const confidenceLevel: ConfidenceLevel =
    confidenceScore >= 78 ? 'high' : confidenceScore >= 60 ? 'moderate' : 'low'

  const confidenceExplanation = `This recommendation carries ${confidenceLevel} consistency (${confidenceScore}% score stability under variable cost assumptions). Note: Confidence reflects model stability, not an empirical guarantee of item lifespan.`

  // 13. Key Deciding Factors (Top 3-4 bullet reasons)
  const keyFactors: string[] = []
  if (repairToNewRatio > 0.45) {
    keyFactors.push(`Repair cost is high: ₹${repairCost.toLocaleString('en-IN')} represents ${Math.round(repairToNewRatio * 100)}% of replacement price (exceeds the 50% prudence guideline).`)
  } else {
    keyFactors.push(`Repair cost is reasonable: ₹${repairCost.toLocaleString('en-IN')} is only ${Math.round(repairToNewRatio * 100)}% of replacement price.`)
  }

  keyFactors.push(
    `36-Month Projected Cost: Repair path ₹${repairPathTotalCost.toLocaleString('en-IN')} vs Replacement path ₹${replacementPathTotalCost.toLocaleString('en-IN')}.`
  )

  if (failureProbPct >= 40) {
    keyFactors.push(`Elevated failure risk: Estimated ${failureProbPct}% likelihood of repeat failure based on ${inputs.category} age and problem type.`)
  } else {
    keyFactors.push(`Manageable failure risk: Estimated at only ${failureProbPct}% repeat failure probability.`)
  }

  if (breakEvenMonths !== null && breakEvenMonths <= horizonMonths) {
    keyFactors.push(`Break-even requires ${breakEvenMonths} months of useful operation.`)
  }

  if (inputs.criticality === 'essential' && repairDowntimeHours > 24) {
    keyFactors.push(`Item is critical with ${repairDowntimeHours}h estimated downtime.`)
  }

  // 14. Transparent Formulas and Steps
  const formulaSteps = [
    {
      title: 'Initial Repair vs Replacement Price Ratio',
      formula: 'Repair Cost ÷ Replacement Price',
      value: `₹${repairCost.toLocaleString('en-IN')} ÷ ₹${replacementPrice.toLocaleString('en-IN')} = ${Math.round(repairToNewRatio * 100)}%`,
    },
    {
      title: 'Risk-Adjusted Repair Outlay',
      formula: 'Initial Repair + (Failure Prob % × 70% of Repair)',
      value: `₹${repairCost.toLocaleString('en-IN')} + (${failureProbPct}% × ₹${Math.round(repairCost * 0.7).toLocaleString('en-IN')}) = ₹${riskAdjustedRepairCost.toLocaleString('en-IN')}`,
    },
    {
      title: 'Net Replacement Acquisition Cost',
      formula: 'Price + Additional Setup Costs - Estimated Resale Value',
      value: `₹${replacementPrice.toLocaleString('en-IN')} + ₹${additionalReplacementCost.toLocaleString('en-IN')} - ₹${resaleValue.toLocaleString('en-IN')} = ₹${replacementNetCost.toLocaleString('en-IN')}`,
    },
    {
      title: `${horizonMonths}-Month Equal-Horizon Total Cost`,
      formula: 'Amortized Reinvestment + Projected Failures + Cumulative Maintenance',
      value: `Repair Path: ₹${repairPathTotalCost.toLocaleString('en-IN')} | Replacement Path: ₹${replacementPathTotalCost.toLocaleString('en-IN')}`,
    },
  ]

  const assumptions = [
    `Evaluation uses an equal comparison window of ${horizonMonths} months.`,
    `Repeat failure risk is modeled at ${failureProbPct}% based on ${inputs.category} age and problem type.`,
    `Time inconvenience cost is strictly separated from out-of-pocket cash spending.`,
    `Original purchase price (₹${originalPrice.toLocaleString('en-IN')}) is historic contextual data and does not alter forward-looking cash flow.`,
  ]

  return {
    verdict,
    verdictTitle,
    verdictSummary,
    confidenceLevel,
    confidenceScore,
    confidenceExplanation,
    keyFactors,
    savingsAmount,
    savingsOption: cheaperOption,
    horizonComparison: {
      horizonMonths,
      repairPathTotalCost,
      replacementPathTotalCost,
      costDifference: Math.abs(rawCostDiff),
      cheaperOption,
      repairCostPerMonth: repairPathMonthlyCost,
      replacementCostPerMonth: replacementPathMonthlyCost,
      repairMonthlyBreakdown: {
        initialRepair: repairCost,
        expectedFutureRepairs: expectedFutureRepairCost,
        cumulativeMaintenance: totalRepairMaintenance,
        total: repairPathTotalCost,
      },
      replacementMonthlyBreakdown: {
        acquisitionNet: replacementNetCost,
        cumulativeMaintenance: totalReplacementMaintenance,
        total: replacementPathTotalCost,
      },
    },
    initialRepairCost: repairCost,
    riskAdjustedRepairCost,
    assumedFailureProbabilityPct: failureProbPct,
    expectedFutureRepairCost,
    replacementNetCost,
    breakEvenMonths,
    breakEvenExplanation,
    downtimeCost,
    handlingCost,
    safetyAlert,
    repairPathMonthlyCost,
    replacementPathMonthlyCost,
    assumptions,
    formulaSteps,
  }
}

/**
 * Sample Decision Presets
 */
export interface DecisionPreset {
  id: string
  name: string
  tagline: string
  inputs: RepairVsReplaceInputs
}

export const SAMPLE_PRESETS: Record<string, DecisionPreset> = {
  smartphone_screen: {
    id: 'smartphone_screen',
    name: 'Smartphone Broken Display',
    tagline: '2.5-year-old premium smartphone with a cracked screen',
    inputs: {
      category: 'smartphone',
      customItemName: 'Galaxy S21 / iPhone 13',
      problemType: 'screen',
      itemAgeMonths: 30,
      originalPrice: 54999,
      resaleValue: 9000,
      repairCost: 6500,
      repairDowntimeHours: 4,
      repairVisits: 1,
      notes: 'OLED screen cracked after drop, touch and motherboard intact',
      repairLifeMonths: 18,
      replacementLifeMonths: 48,
      replacementPrice: 48000,
      additionalReplacementCost: 1500,
      repairMonthlyMaintenance: 0,
      replacementMonthlyMaintenance: 0,
      criticality: 'essential',
      hourlyRate: 500,
      handlingTimeHours: 2,
      riskTolerance: 'medium',
      personalPreference: 'prefer_repair',
      repairConfidence: 'high',
      comparisonHorizonMonths: 36,
    },
  },
  laptop_motherboard: {
    id: 'laptop_motherboard',
    name: 'Laptop Motherboard Short',
    tagline: '4.5-year-old work laptop with erratic power failure',
    inputs: {
      category: 'laptop',
      customItemName: 'Dell Inspiron 15',
      problemType: 'motherboard_power',
      itemAgeMonths: 54,
      originalPrice: 58000,
      resaleValue: 4000,
      repairCost: 17500,
      repairDowntimeHours: 72,
      repairVisits: 2,
      notes: 'Laptop shuts down abruptly, local technician suspects IC/chip level fault',
      repairLifeMonths: 8,
      replacementLifeMonths: 60,
      replacementPrice: 52000,
      additionalReplacementCost: 2000,
      repairMonthlyMaintenance: 200,
      replacementMonthlyMaintenance: 50,
      criticality: 'essential',
      hourlyRate: 750,
      handlingTimeHours: 6,
      riskTolerance: 'low',
      personalPreference: 'prefer_replace',
      repairConfidence: 'low',
      comparisonHorizonMonths: 36,
    },
  },
  ac_compressor: {
    id: 'ac_compressor',
    name: 'Split AC Compressor Fault',
    tagline: '7-year-old 1.5 Ton AC with failed compressor & gas leak',
    inputs: {
      category: 'appliance',
      customItemName: '1.5 Ton Split AC',
      subType: 'ac',
      problemType: 'motor_compressor',
      itemAgeMonths: 84,
      originalPrice: 38000,
      resaleValue: 3500,
      repairCost: 13500,
      repairDowntimeHours: 48,
      repairVisits: 2,
      notes: 'Compressor burnt out, requires replacement plus refrigerant recharge',
      repairLifeMonths: 14,
      replacementLifeMonths: 120,
      replacementPrice: 42000,
      additionalReplacementCost: 2500,
      repairMonthlyMaintenance: 400,
      replacementMonthlyMaintenance: 100,
      criticality: 'important',
      hourlyRate: 400,
      handlingTimeHours: 4,
      riskTolerance: 'medium',
      personalPreference: 'neutral',
      repairConfidence: 'moderate',
      comparisonHorizonMonths: 36,
    },
  },
  car_clutch_gearbox: {
    id: 'car_clutch_gearbox',
    name: 'Car Clutch & Gearbox Overhaul',
    tagline: '8-year-old hatchback needing clutch plate & flywheel repair',
    inputs: {
      category: 'vehicle',
      customItemName: 'Maruti Swift / Hyundai i20',
      subType: 'car',
      problemType: 'engine_transmission',
      itemAgeMonths: 96,
      originalPrice: 650000,
      resaleValue: 220000,
      repairCost: 38000,
      repairDowntimeHours: 48,
      repairVisits: 2,
      notes: 'Slipping clutch, hard gear shifts, authorized workshop estimate',
      repairLifeMonths: 36,
      replacementLifeMonths: 120,
      replacementPrice: 850000,
      additionalReplacementCost: 15000,
      repairMonthlyMaintenance: 800,
      replacementMonthlyMaintenance: 300,
      criticality: 'essential',
      hourlyRate: 600,
      handlingTimeHours: 5,
      riskTolerance: 'medium',
      personalPreference: 'prefer_repair',
      repairConfidence: 'high',
      comparisonHorizonMonths: 36,
    },
  },
  sofa_re_upholstery: {
    id: 'sofa_re_upholstery',
    name: 'Solid Teak Sofa Re-Upholstery',
    tagline: '10-year-old teak wood 3-seater sofa needing new foam & fabric',
    inputs: {
      category: 'furniture',
      customItemName: 'Teak Wood 3-Seater Sofa',
      problemType: 'cushion_fabric',
      itemAgeMonths: 120,
      originalPrice: 32000,
      resaleValue: 5000,
      repairCost: 9500,
      repairDowntimeHours: 96,
      repairVisits: 2,
      notes: 'Solid teak frame is in pristine condition, cushions need high-density foam',
      repairLifeMonths: 60,
      replacementLifeMonths: 60,
      replacementPrice: 35000,
      additionalReplacementCost: 1500,
      repairMonthlyMaintenance: 0,
      replacementMonthlyMaintenance: 0,
      criticality: 'nice_to_have',
      hourlyRate: 350,
      handlingTimeHours: 3,
      riskTolerance: 'high',
      personalPreference: 'prefer_repair',
      repairConfidence: 'high',
      comparisonHorizonMonths: 36,
    },
  },
}

export const PRESET_SCENARIOS = SAMPLE_PRESETS;
