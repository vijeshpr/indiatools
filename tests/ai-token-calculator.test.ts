import { estimateTokens } from '../src/lib/tokenEstimator.ts'
import { calculateModelCost, formatCurrency } from '../src/lib/aiCostCalculator.ts'
import { AI_MODELS, getModelById } from '../src/data/aiModels.ts'

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

console.log('=== STARTING AI TOKEN & API COST CALCULATOR TEST SUITE ===\n')

// 1. Empty & Whitespace
const emptyEst = estimateTokens('')
assert(emptyEst.charCount === 0 && emptyEst.estimatedTokens === 0, 'Empty string yields 0 tokens')

const wsEst = estimateTokens('   \n\t  ')
assert(wsEst.wordCount === 0 && wsEst.estimatedTokens >= 1, 'Whitespace string handled gracefully')

// 2. English text
const engText = 'Hello world, this is a test prompt for AI token estimation.'
const engEst = estimateTokens(engText)
assert(engEst.charCount === engText.length && engEst.estimatedTokens > 0, 'English text token estimation works')
assert(engEst.estimatedTokens >= 10 && engEst.estimatedTokens <= 20, 'English token estimation within expected ~4 chars/token heuristic')

// 3. Indian Language text
const malayalamText = 'ഇന്ത്യൻ പ്രാക്ടിക്കൽ ടൂളുകൾ'
const mlEst = estimateTokens(malayalamText)
assert(mlEst.scriptBreakdown.indic > 0, 'Malayalam Unicode recognized as Indic script')
assert(mlEst.estimatedTokens > 5, 'Malayalam text yields higher token density as expected')

const hindiText = 'कृत्रिम बुद्धिमत्ता और टोकन कैलकुलेटर'
const hiEst = estimateTokens(hindiText)
assert(hiEst.scriptBreakdown.indic > 0, 'Hindi Devanagari recognized as Indic script')

const tamilText = 'செயற்கை நுண்ணறிவு கணக்கீடு'
const taEst = estimateTokens(tamilText)
assert(taEst.scriptBreakdown.indic > 0, 'Tamil recognized as Indic script')

const teluguText = 'ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ కాలిక్యులేటర్'
const teEst = estimateTokens(teluguText)
assert(teEst.scriptBreakdown.indic > 0, 'Telugu recognized as Indic script')

const kannadaText = 'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಲೆಕ್ಕಾಚಾರ'
const knEst = estimateTokens(kannadaText)
assert(knEst.scriptBreakdown.indic > 0, 'Kannada recognized as Indic script')

// 4. Emoji and Unicode
const emojiText = '🚀 Artificial Intelligence 🧠 is evolving fast! 🔥✨'
const emojiEst = estimateTokens(emojiText)
assert(emojiEst.estimatedTokens > 10, 'Emoji text tokenized with multi-byte weightings')

// 5. Code, JSON and Markdown
const codeText = `import React from 'react';
export const UserCard = ({ name, email }: { name: string; email: string }) => {
  return <div className="card"><h3>{name}</h3><p>{email}</p></div>;
};`
const codeEst = estimateTokens(codeText)
assert(codeEst.estimatedTokens > 20, 'TypeScript React code tokenized with syntax weighting')

const jsonText = `{"status": 200, "message": "Success", "items": [{"id": 1, "sku": "IND-99"}]}`
const jsonEst = estimateTokens(jsonText)
assert(jsonEst.estimatedTokens > 15, 'JSON structured data tokenized with key/symbol density')

// 6. Cost formula testing: GPT-4o mini
const gpt4oMini = getModelById('openai-gpt-4o-mini')!
assert(!!gpt4oMini, 'gpt-4o-mini found in model catalog')
assert(gpt4oMini.inputPricePerMillion === 0.15 && gpt4oMini.outputPricePerMillion === 0.60, 'gpt-4o-mini rates match official documentation')

const cost1 = calculateModelCost(gpt4oMini, {
  inputTokens: 1000,
  outputTokens: 500,
  cachedInputPercentage: 0,
  callsPerDay: 1000,
  billingDaysPerMonth: 30,
  usdToInrRate: 85,
})
// input: 1000 / 1M * 0.15 = 0.00015
// output: 500 / 1M * 0.60 = 0.00030
// request: 0.00045
assert(Math.abs(cost1.requestCostUsd - 0.00045) < 0.000001, 'Request cost formula accurate without caching')
assert(Math.abs(cost1.dailyCostUsd - 0.45) < 0.001, 'Daily cost accurate (0.00045 * 1000 = $0.45)')
assert(Math.abs(cost1.monthlyCostUsd - 13.50) < 0.01, 'Monthly cost accurate ($0.45 * 30 = $13.50)')
assert(Math.abs(cost1.monthlyCostInr - 1147.50) < 0.1, 'USD to INR accurate ($13.50 * 85 = ₹1147.50)')

// 7. Cached input calculation: 50% cached
const costCached = calculateModelCost(gpt4oMini, {
  inputTokens: 1000,
  outputTokens: 500,
  cachedInputPercentage: 50,
  callsPerDay: 1000,
  billingDaysPerMonth: 30,
  usdToInrRate: 85,
})
// cached: 500 / 1M * 0.075 = 0.0000375
// uncached: 500 / 1M * 0.15 = 0.000075
// input: 0.0001125
// output: 0.00030
// request: 0.0004125
assert(costCached.inputCostUsd < cost1.inputCostUsd, 'Cached input cost is cheaper than uncached input')
assert(costCached.cachedTokens === 500 && costCached.uncachedTokens === 500, 'Cache tokens split correctly')

// 8. Custom model prices
const customModel = {
  id: 'custom',
  provider: 'custom' as const,
  providerDisplayName: 'Custom',
  name: 'Custom LLM',
  modelId: 'custom-1',
  category: 'specialized' as const,
  inputPricePerMillion: 1.00,
  outputPricePerMillion: 2.00,
  contextWindowTokens: null,
  maxOutputTokens: null,
  officialDocUrl: '',
  officialPricingUrl: '',
  lastVerifiedDate: '2026-03-15',
  isPricingVerified: true,
  description: 'Custom model test',
}
const customCost = calculateModelCost(customModel, {
  inputTokens: 1_000_000,
  outputTokens: 1_000_000,
  callsPerDay: 1,
  billingDaysPerMonth: 1,
  usdToInrRate: 85,
})
assert(customCost.requestCostUsd === 3.00, 'Custom model calculation exact: $1 + $2 = $3')

// 9. Currency formatting
assert(formatCurrency(1250.50, 'USD') === '$1,250.50', 'USD formatting standard')
assert(formatCurrency(0.00045, 'USD').startsWith('$0.00045'), 'Micro-dollar formatting shows sufficient precision')
assert(formatCurrency(1250.50, 'INR') === '₹1,250.50', 'INR formatting standard')

// 10. Catalog completeness
assert(AI_MODELS.length >= 10, 'Catalog contains at least 10 official models across OpenAI, Gemini, Claude, DeepSeek')
for (const m of AI_MODELS) {
  assert(m.inputPricePerMillion !== null, `${m.name} has verified input price`)
  assert(m.outputPricePerMillion !== null, `${m.name} has verified output price`)
  assert(m.officialPricingUrl.startsWith('https://'), `${m.name} has official HTTPS pricing URL`)
  assert(m.lastVerifiedDate.length > 5, `${m.name} has last verified date`)
}

const failed = tests.filter(t => !t.passed)
console.log(`\n========================================`)
console.log(`TOTAL CHECKS: ${tests.length}`)
console.log(`PASSED: ${tests.length - failed.length}`)
console.log(`FAILED: ${failed.length}`)
if (failed.length > 0) {
  process.exit(1)
} else {
  console.log(`🌟 AI TOKEN & API COST CALCULATOR TEST SUITE PASSED 100%!`)
}
