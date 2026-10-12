import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Cpu,
  Sparkles,
  Zap,
  RotateCcw,
  Copy,
  Download,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  Info,
  DollarSign,
  Layers,
  ArrowUpDown,
  BookOpen,
  Filter,
} from 'lucide-react'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { AI_MODELS, ModelPricing, AIProvider } from '../data/aiModels'
import { estimateTokens } from '../lib/tokenEstimator'
import { calculateModelCost, formatCurrency } from '../lib/aiCostCalculator'

const SAMPLE_PROMPTS = [
  {
    name: 'Customer Support Bot',
    system: 'You are an empathetic, concise customer support agent for an Indian e-commerce platform. Assist customers with delivery status, returns, and refunds in clear English or Hinglish.',
    prompt: 'Hi, I ordered a boAt headphone yesterday (Order #IND-98421). The delivery tracker shows delayed by 2 days due to heavy rain in Bangalore. Can I cancel the order or get an expedited shipment update?',
    expectedOutput: 250,
  },
  {
    name: 'Code Review & Refactor',
    system: 'You are a principal software engineer. Review TypeScript code for security vulnerabilities, memory leaks, and performance anti-patterns.',
    prompt: `Review the following Node.js authentication middleware:
async function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await db.users.findOne({ id: user.id });
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}
Identify potential database bottleneck issues and recommend Redis caching and error handling best practices.`,
    expectedOutput: 600,
  },
  {
    name: 'Indian Multilingual Translation',
    system: 'You are an expert linguist specializing in Indian languages. Translate text naturally preserving cultural context and formal tone.',
    prompt: 'Translate the following government notification into Malayalam, Hindi, and Tamil: "All applicants must submit their Aadhaar card, proof of permanent residence, and passport size photograph before the 25th of next month to verify eligibility for the rooftop solar subsidy."',
    expectedOutput: 800,
  },
  {
    name: 'JSON Data Extraction',
    system: 'You are an accurate structured JSON extractor. Output valid RFC 8259 JSON only without markdown code blocks.',
    prompt: 'Extract financial line items from this invoice: "Vendor: Acme Electronics Pvt Ltd, GSTIN: 29AAAAA0000A1Z5. Items: 10 units Dell OptiPlex Desktop @ ₹45,000 each (18% GST ₹81,000), 5 units 27-inch monitors @ ₹18,000 each (18% GST ₹16,200). Shipping charges: ₹2,500. Total invoice amount payable: ₹6,39,700."',
    expectedOutput: 350,
  },
]

export const AiTokenCalculatorTool: React.FC = () => {
  const tool = getToolBySlug('ai-token-calculator')!

  // Workspace Inputs
  const [systemPrompt, setSystemPrompt] = useState<string>('')
  const [userPrompt, setUserPrompt] = useState<string>(
    'Explain the difference between LLM prompt caching, fine-tuning, and RAG (Retrieval-Augmented Generation) in terms of API cost efficiency for an Indian startup building a legal assistant.'
  )
  const [exampleResponse, setExampleResponse] = useState<string>('')
  const [outputTokenCount, setOutputTokenCount] = useState<number>(500)
  const [cachedInputPercentage, setCachedInputPercentage] = useState<number>(0)
  const [callsPerDay, setCallsPerDay] = useState<number>(1000)
  const [billingDaysPerMonth, setBillingDaysPerMonth] = useState<number>(30)

  // Currency & Rate
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD')
  const [usdToInrRate, setUsdToInrRate] = useState<number>(85)

  // Selected Model & Custom Model
  const [selectedModelId, setSelectedModelId] = useState<string>('openai-gpt-4o-mini')
  const [customInputPrice, setCustomInputPrice] = useState<number>(0.20)
  const [customOutputPrice, setCustomOutputPrice] = useState<number>(0.80)
  const [customModelName, setCustomModelName] = useState<string>('My Custom Model')

  // Model comparison filters
  const [providerFilter, setProviderFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<'monthlyCost' | 'inputPrice' | 'outputPrice' | 'name'>('monthlyCost')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [showAdvancedInputs, setShowAdvancedInputs] = useState<boolean>(false)

  // Live Token Estimation
  const combinedInputText = useMemo(() => {
    return [systemPrompt, userPrompt].filter(Boolean).join('\n\n')
  }, [systemPrompt, userPrompt])

  const inputTokenEstimate = useMemo(() => {
    return estimateTokens(combinedInputText)
  }, [combinedInputText])

  const responseTokenEstimate = useMemo(() => {
    if (exampleResponse.trim().length > 0) {
      return estimateTokens(exampleResponse).estimatedTokens
    }
    return outputTokenCount
  }, [exampleResponse, outputTokenCount])

  // Custom Model instance
  const customModel: ModelPricing = useMemo(() => {
    return {
      id: 'custom-model',
      provider: 'custom',
      providerDisplayName: 'Custom',
      name: customModelName || 'Custom Model',
      modelId: 'custom',
      category: 'specialized',
      inputPricePerMillion: customInputPrice,
      outputPricePerMillion: customOutputPrice,
      cachedInputPricePerMillion: customInputPrice * 0.5,
      contextWindowTokens: null,
      maxOutputTokens: null,
      officialDocUrl: '',
      officialPricingUrl: '',
      lastVerifiedDate: 'User Defined',
      isPricingVerified: true,
      description: 'User-configured custom model pricing.',
    }
  }, [customInputPrice, customOutputPrice, customModelName])

  // All active models including custom
  const allModelsWithCustom = useMemo(() => {
    return [...AI_MODELS, customModel]
  }, [customModel])

  // Selected Model Object
  const currentModel = useMemo(() => {
    if (selectedModelId === 'custom-model') return customModel
    return AI_MODELS.find((m) => m.id === selectedModelId) || AI_MODELS[0]
  }, [selectedModelId, customModel])

  // Primary Selected Model Calculation
  const selectedModelCalculation = useMemo(() => {
    return calculateModelCost(currentModel, {
      inputTokens: inputTokenEstimate.estimatedTokens,
      outputTokens: responseTokenEstimate,
      cachedInputPercentage,
      callsPerDay,
      billingDaysPerMonth,
      usdToInrRate,
    })
  }, [
    currentModel,
    inputTokenEstimate.estimatedTokens,
    responseTokenEstimate,
    cachedInputPercentage,
    callsPerDay,
    billingDaysPerMonth,
    usdToInrRate,
  ])

  // Multi-model Comparison Calculations
  const comparisonList = useMemo(() => {
    const list = allModelsWithCustom.map((m) => {
      const breakdown = calculateModelCost(m, {
        inputTokens: inputTokenEstimate.estimatedTokens,
        outputTokens: responseTokenEstimate,
        cachedInputPercentage,
        callsPerDay,
        billingDaysPerMonth,
        usdToInrRate,
      })
      return breakdown
    })

    // Filter by provider and search query
    let filtered = list.filter((item) => {
      if (providerFilter !== 'all' && item.model.provider !== providerFilter) return false
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase()
        const matchesName = item.model.name.toLowerCase().includes(q)
        const matchesProvider = item.model.providerDisplayName.toLowerCase().includes(q)
        const matchesId = item.model.modelId.toLowerCase().includes(q)
        if (!matchesName && !matchesProvider && !matchesId) return false
      }
      return true
    })

    // Sort
    filtered.sort((a, b) => {
      let valA = 0
      let valB = 0
      if (sortBy === 'monthlyCost') {
        valA = a.monthlyCostUsd
        valB = b.monthlyCostUsd
      } else if (sortBy === 'inputPrice') {
        valA = a.model.inputPricePerMillion ?? 9999
        valB = b.model.inputPricePerMillion ?? 9999
      } else if (sortBy === 'outputPrice') {
        valA = a.model.outputPricePerMillion ?? 9999
        valB = b.model.outputPricePerMillion ?? 9999
      } else if (sortBy === 'name') {
        return sortDirection === 'asc'
          ? a.model.name.localeCompare(b.model.name)
          : b.model.name.localeCompare(a.model.name)
      }

      return sortDirection === 'asc' ? valA - valB : valB - valA
    })

    return filtered
  }, [
    allModelsWithCustom,
    inputTokenEstimate.estimatedTokens,
    responseTokenEstimate,
    cachedInputPercentage,
    callsPerDay,
    billingDaysPerMonth,
    usdToInrRate,
    providerFilter,
    searchQuery,
    sortBy,
    sortDirection,
  ])

  // Lowest cost model amongst verified models
  const lowestCostModel = useMemo(() => {
    const valid = comparisonList.filter((c) => c.isPricingAvailable && c.model.provider !== 'custom')
    if (valid.length === 0) return null
    return [...valid].sort((a, b) => a.monthlyCostUsd - b.monthlyCostUsd)[0]
  }, [comparisonList])

  // Reset Handlers
  const handleReset = () => {
    setSystemPrompt('')
    setUserPrompt(SAMPLE_PROMPTS[0].prompt)
    setExampleResponse('')
    setOutputTokenCount(500)
    setCachedInputPercentage(0)
    setCallsPerDay(1000)
    setBillingDaysPerMonth(30)
    setSelectedModelId('openai-gpt-4o-mini')
    setCurrency('USD')
    setUsdToInrRate(85)
  }

  const handleClearText = () => {
    setUserPrompt('')
    setSystemPrompt('')
    setExampleResponse('')
  }

  const handleLoadSample = (sample: (typeof SAMPLE_PROMPTS)[0]) => {
    setSystemPrompt(sample.system)
    setUserPrompt(sample.prompt)
    setOutputTokenCount(sample.expectedOutput)
  }

  // Copy Summary
  const getResultSummary = () => {
    const currSign = currency === 'USD' ? '$' : '₹'
    const reqCost = currency === 'USD' ? selectedModelCalculation.requestCostUsd : selectedModelCalculation.requestCostInr
    const monCost = currency === 'USD' ? selectedModelCalculation.monthlyCostUsd : selectedModelCalculation.monthlyCostInr
    const annCost = currency === 'USD' ? selectedModelCalculation.annualCostUsd : selectedModelCalculation.annualCostInr

    return `AI Token & API Cost Projection:
Model: ${currentModel.providerDisplayName} - ${currentModel.name} (${currentModel.modelId})
Estimated Tokens:
- Input Tokens: ${selectedModelCalculation.inputTokens.toLocaleString()} (${cachedInputPercentage}% cached)
- Output Tokens: ${selectedModelCalculation.outputTokens.toLocaleString()}
- Total Tokens / Call: ${(selectedModelCalculation.inputTokens + selectedModelCalculation.outputTokens).toLocaleString()}

Cost Projections (${currency}):
- Cost per Request: ${formatCurrency(reqCost, currency)}
- Daily Expense (${callsPerDay} calls/day): ${formatCurrency(reqCost * callsPerDay, currency)}
- Monthly Expense (${billingDaysPerMonth} days): ${formatCurrency(monCost, currency)}
- Annual Expense (12 mo): ${formatCurrency(annCost, currency)}

Official Rates: $${currentModel.inputPricePerMillion}/1M in | $${currentModel.outputPricePerMillion}/1M out
Calculated via IndiaTools AI Token Calculator (https://indiatools-rho.vercel.app/calculators/ai-token-calculator)`
  }

  // Export Comparison CSV
  const handleExportCsv = () => {
    const headers = [
      'Provider',
      'Model Name',
      'Model ID',
      'Input Price / 1M ($)',
      'Output Price / 1M ($)',
      'Cached Input Price / 1M ($)',
      'Cost Per Request ($)',
      'Monthly Cost ($)',
      'Monthly Cost (₹)',
      'Annual Cost ($)',
      'Pricing Source',
      'Last Verified',
    ]

    const rows = comparisonList.map((item) => [
      `"${item.model.providerDisplayName}"`,
      `"${item.model.name}"`,
      `"${item.model.modelId}"`,
      item.model.inputPricePerMillion ?? 'N/A',
      item.model.outputPricePerMillion ?? 'N/A',
      item.model.cachedInputPricePerMillion ?? 'N/A',
      item.requestCostUsd.toFixed(6),
      item.monthlyCostUsd.toFixed(2),
      item.monthlyCostInr.toFixed(2),
      item.annualCostUsd.toFixed(2),
      `"${item.model.officialPricingUrl || 'Custom'}"`,
      `"${item.model.lastVerifiedDate}"`,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `indiatools-ai-api-costs-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <ToolPageLayout
      tool={tool}
      onReset={handleReset}
      onCopyResult={getResultSummary}
      maxWidthClass="max-w-7xl"
    >
      <div className="space-y-8">
        {/* Top Control Bar: Currency Toggle & Reference Forex */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0B132B]/80 border border-cyan-500/20 backdrop-blur-md shadow-lg shadow-cyan-950/20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-cyan-400" />
              <span>Currency Display:</span>
            </span>
            <div className="inline-flex rounded-xl p-1 bg-neutral-900 border border-neutral-800">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  currency === 'USD'
                    ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  currency === 'INR'
                    ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                INR (₹)
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="text-neutral-400 font-mono">Reference Rate:</span>
            <div className="flex items-center gap-1.5 bg-neutral-950 px-2.5 py-1 rounded-lg border border-neutral-800">
              <span className="text-neutral-400 font-mono">1 USD = ₹</span>
              <input
                type="number"
                min="50"
                max="150"
                step="0.5"
                value={usdToInrRate}
                onChange={(e) => setUsdToInrRate(parseFloat(e.target.value) || 85)}
                className="w-14 bg-transparent font-mono text-cyan-400 font-bold text-right focus:outline-none"
              />
            </div>
            <span className="text-[11px] text-neutral-500 hidden sm:inline">
              (Editable reference assumption)
            </span>
          </div>
        </div>

        {/* Main Grid: Left Playground + Right Dynamic Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Playground (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-[#0d1527]/90 border border-cyan-500/20 shadow-2xl space-y-5 relative overflow-hidden backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                    <Cpu className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      Prompt & Token Workspace
                    </h2>
                    <p className="text-xs text-neutral-400">
                      Live local estimation • 100% in-browser privacy
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClearText}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-neutral-400 hover:text-red-400 rounded-lg hover:bg-neutral-800/60 transition-colors"
                  title="Clear all text fields"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>

              {/* Sample Prompt Loaders */}
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  Load Realistic Sample Workload
                </label>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_PROMPTS.map((sample) => (
                    <button
                      key={sample.name}
                      type="button"
                      onClick={() => handleLoadSample(sample)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors"
                    >
                      {sample.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* User Prompt Text Area */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold">
                    User Prompt / Document Text
                  </label>
                  <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-2">
                    <span>{userPrompt.length} chars</span>
                    <span>•</span>
                    <span>{userPrompt.trim().split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                </div>
                <textarea
                  rows={6}
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="Paste or type your prompt, system instructions, document excerpt, or code here..."
                  className="w-full bg-[#070b14] border border-neutral-800 rounded-2xl p-4 text-sm font-mono text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all resize-y"
                />
              </div>

              {/* Collapsible System Instructions & Sample Response */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setShowAdvancedInputs(!showAdvancedInputs)}
                  className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-cyan-400 transition-colors"
                >
                  {showAdvancedInputs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  <span>{showAdvancedInputs ? 'Hide' : 'Add'} System Instructions & Custom Example Response</span>
                </button>

                <AnimatePresence>
                  {showAdvancedInputs && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-2 overflow-hidden"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-mono text-neutral-400">
                            System Instructions (Prepended to input)
                          </label>
                          <span className="text-[11px] font-mono text-neutral-500">
                            {systemPrompt.length} chars
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          value={systemPrompt}
                          onChange={(e) => setSystemPrompt(e.target.value)}
                          placeholder="Optional system prompt or developer persona instructions..."
                          className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-3 text-xs font-mono text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-cyan-500 transition-all"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-mono text-neutral-400">
                            Sample Model Response (Auto-calculates output tokens)
                          </label>
                          <span className="text-[11px] font-mono text-neutral-500">
                            {exampleResponse.length} chars
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          value={exampleResponse}
                          onChange={(e) => setExampleResponse(e.target.value)}
                          placeholder="Paste an expected response to automatically calculate output token length instead of slider..."
                          className="w-full bg-[#070b14] border border-neutral-800 rounded-xl p-3 text-xs font-mono text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-cyan-500 transition-all"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Output Token Length Controls */}
              <div className="pt-3 border-t border-neutral-800/80">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold">
                    Estimated Output Tokens / Call
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="1"
                      max="100000"
                      value={responseTokenEstimate}
                      onChange={(e) => {
                        setExampleResponse('')
                        setOutputTokenCount(parseInt(e.target.value) || 0)
                      }}
                      className="w-24 bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1 text-sm font-mono text-right text-cyan-400 font-bold focus:outline-none focus:border-cyan-500"
                    />
                    <span className="text-xs text-neutral-500 font-mono">tokens</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="50"
                  max="4000"
                  step="50"
                  value={responseTokenEstimate}
                  onChange={(e) => {
                    setExampleResponse('')
                    setOutputTokenCount(parseInt(e.target.value) || 0)
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />

                <div className="flex gap-2 mt-2">
                  {[250, 500, 1000, 2000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setExampleResponse('')
                        setOutputTokenCount(preset)
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                        responseTokenEstimate === preset
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {preset} tokens
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Caching % Slider */}
              <div className="pt-3 border-t border-neutral-800/80">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                    <span>Prompt Caching Ratio</span>
                    <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/20">
                      50% - 90% discount on cache hit
                    </span>
                  </label>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {cachedInputPercentage}% cached
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={cachedInputPercentage}
                  onChange={(e) => setCachedInputPercentage(parseInt(e.target.value) || 0)}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  Specifies what portion of your prompt is cached prefix (e.g. system instructions, tool definitions, recurring context).
                </p>
              </div>

              {/* Traffic Scale: Calls per day & days per month */}
              <div className="pt-3 border-t border-neutral-800/80 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-bold">
                    Daily Workload Volume (Calls / Day)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="1"
                      max="10000000"
                      value={callsPerDay}
                      onChange={(e) => setCallsPerDay(parseInt(e.target.value) || 0)}
                      className="w-28 bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1 text-sm font-mono text-right text-cyan-400 font-bold focus:outline-none focus:border-cyan-500"
                    />
                    <span className="text-xs text-neutral-500 font-mono">calls/day</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[100, 500, 1000, 5000, 10000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCallsPerDay(preset)}
                      className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                        callsPerDay === preset
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {preset.toLocaleString()} / day
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tokenizer Transparency & Disclaimer Note */}
            <div className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-800 text-xs text-neutral-400 flex items-start gap-3">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p>
                  <strong>Estimated tokens:</strong> Token counts are estimated using Unicode-aware heuristics calibrated for Byte-Pair Encoding (BPE / tiktoken / SentencePiece).
                </p>
                <p className="text-neutral-500 text-[11px]">
                  English averages ~4 chars/token; Indic scripts (Malayalam, Hindi, Tamil, Telugu, Kannada) average ~1.6 chars/token. Official tokenizer counts vary slightly per model architecture. Excludes taxes and any provider-specific platform minimums.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Model Selection & Financial Projection Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Model Selector Box */}
            <div className="p-6 rounded-3xl bg-[#0d1527]/90 border border-cyan-500/30 shadow-2xl space-y-4 backdrop-blur-md">
              <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Selected Model</span>
                </span>
                <span className="text-[11px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                  {currentModel.providerDisplayName}
                </span>
              </div>

              {/* Model Dropdown */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Choose LLM Model
                </label>
                <select
                  value={selectedModelId}
                  onChange={(e) => setSelectedModelId(e.target.value)}
                  className="w-full bg-[#070b14] border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <optgroup label="OpenAI">
                    {AI_MODELS.filter((m) => m.provider === 'openai').map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} (${m.inputPricePerMillion}/$ {m.outputPricePerMillion})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Google Gemini">
                    {AI_MODELS.filter((m) => m.provider === 'google').map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} (${m.inputPricePerMillion}/$ {m.outputPricePerMillion})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Anthropic Claude">
                    {AI_MODELS.filter((m) => m.provider === 'anthropic').map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} (${m.inputPricePerMillion}/$ {m.outputPricePerMillion})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="DeepSeek">
                    {AI_MODELS.filter((m) => m.provider === 'deepseek').map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} (${m.inputPricePerMillion}/$ {m.outputPricePerMillion})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Custom Model">
                    <option value="custom-model">Custom Model (User-defined pricing)</option>
                  </optgroup>
                </select>
                <p className="mt-1 text-xs text-neutral-400">{currentModel.description}</p>
              </div>

              {/* Custom Model Inputs if selected */}
              {selectedModelId === 'custom-model' && (
                <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-3">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                    Configure Custom Rates ($ / 1M tokens)
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Input Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={customInputPrice}
                        onChange={(e) => setCustomInputPrice(parseFloat(e.target.value) || 0)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Output Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={customOutputPrice}
                        onChange={(e) => setCustomOutputPrice(parseFloat(e.target.value) || 0)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Live Token Count Card */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-center">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block">Input Tokens</span>
                  <span className="text-base sm:text-lg font-bold font-mono text-cyan-400">
                    {selectedModelCalculation.inputTokens.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block">Output Tokens</span>
                  <span className="text-base sm:text-lg font-bold font-mono text-purple-400">
                    {selectedModelCalculation.outputTokens.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block">Total / Call</span>
                  <span className="text-base sm:text-lg font-bold font-mono text-white">
                    {(selectedModelCalculation.inputTokens + selectedModelCalculation.outputTokens).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Headline Monthly Budget */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c1c38] to-[#081226] border border-cyan-500/40 relative overflow-hidden">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-cyan-300 font-semibold uppercase">
                    Monthly API Budget ({billingDaysPerMonth} days)
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {callsPerDay.toLocaleString()} calls/day
                  </span>
                </div>

                <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white my-2">
                  {formatCurrency(
                    currency === 'USD'
                      ? selectedModelCalculation.monthlyCostUsd
                      : selectedModelCalculation.monthlyCostInr,
                    currency
                  )}
                  <span className="text-xs text-neutral-400 font-normal"> / month</span>
                </div>

                {currency === 'USD' && (
                  <p className="text-xs text-cyan-300 font-mono">
                    ≈ {formatCurrency(selectedModelCalculation.monthlyCostInr, 'INR')} (at ₹{usdToInrRate}/USD)
                  </p>
                )}
                {currency === 'INR' && (
                  <p className="text-xs text-cyan-300 font-mono">
                    ≈ {formatCurrency(selectedModelCalculation.monthlyCostUsd, 'USD')} USD
                  </p>
                )}

                {/* Sub-metrics */}
                <div className="grid grid-cols-2 gap-3 pt-4 mt-4 border-t border-neutral-800 text-xs">
                  <div>
                    <span className="text-neutral-400 block mb-0.5">Per Request Cost:</span>
                    <span className="font-mono font-bold text-white">
                      {formatCurrency(
                        currency === 'USD'
                          ? selectedModelCalculation.requestCostUsd
                          : selectedModelCalculation.requestCostInr,
                        currency,
                        4
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block mb-0.5">Annual Total:</span>
                    <span className="font-mono font-bold text-white">
                      {formatCurrency(
                        currency === 'USD'
                          ? selectedModelCalculation.annualCostUsd
                          : selectedModelCalculation.annualCostInr,
                        currency
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rate Breakdown Details */}
              <div className="space-y-2 text-xs pt-2">
                <div className="flex justify-between text-neutral-400">
                  <span>Input Token Cost (1M tokens):</span>
                  <span className="font-mono text-white">
                    ${currentModel.inputPricePerMillion ?? 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Output Token Cost (1M tokens):</span>
                  <span className="font-mono text-white">
                    ${currentModel.outputPricePerMillion ?? 'N/A'}
                  </span>
                </div>
                {currentModel.cachedInputPricePerMillion !== undefined && (
                  <div className="flex justify-between text-neutral-400">
                    <span>Cached Input Price (1M tokens):</span>
                    <span className="font-mono text-emerald-400">
                      ${currentModel.cachedInputPricePerMillion}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-400">
                  <span>Context Window Limit:</span>
                  <span className="font-mono text-white">
                    {currentModel.contextWindowTokens
                      ? `${(currentModel.contextWindowTokens / 1000).toFixed(0)}K tokens`
                      : 'N/A'}
                  </span>
                </div>
                {currentModel.officialPricingUrl && (
                  <div className="pt-2 flex justify-between items-center text-[11px] border-t border-neutral-800">
                    <span className="text-neutral-500">Verified: {currentModel.lastVerifiedDate}</span>
                    <a
                      href={currentModel.officialPricingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Official Pricing Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Section 2: Comprehensive Multi-Model Comparison Dashboard */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#091020]/90 border border-cyan-500/20 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>Model Pricing Matrix & Comparison</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Calculated on {selectedModelCalculation.inputTokens.toLocaleString()} input tokens & {selectedModelCalculation.outputTokens.toLocaleString()} output tokens ({callsPerDay.toLocaleString()} calls/day)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs font-mono text-cyan-300 hover:bg-neutral-800 transition-colors"
                title="Export this comparison to CSV"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search models (e.g. gpt-4o, flash, sonnet, r1)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#070b14] border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Provider Filter Tabs */}
            <div className="sm:col-span-4 flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All' },
                { id: 'openai', label: 'OpenAI' },
                { id: 'google', label: 'Gemini' },
                { id: 'anthropic', label: 'Claude' },
                { id: 'deepseek', label: 'DeepSeek' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProviderFilter(p.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                    providerFilter === p.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="sm:col-span-3 flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-[#070b14] border border-neutral-800 rounded-xl px-2.5 py-2 text-xs font-mono text-neutral-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="monthlyCost">Sort by Monthly Cost</option>
                <option value="inputPrice">Sort by Input Price</option>
                <option value="outputPrice">Sort by Output Price</option>
                <option value="name">Sort by Name</option>
              </select>
              <button
                type="button"
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                title="Toggle sort direction"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Model Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comparisonList.map((item) => {
              const isSelected = item.model.id === currentModel.id
              const isCheapest = lowestCostModel?.model.id === item.model.id

              const reqCost = currency === 'USD' ? item.requestCostUsd : item.requestCostInr
              const monCost = currency === 'USD' ? item.monthlyCostUsd : item.monthlyCostInr

              return (
                <motion.div
                  key={item.model.id}
                  layout
                  onClick={() => setSelectedModelId(item.model.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#0f1d38] border-cyan-400 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-400/50'
                      : 'bg-[#0b1325]/70 border-neutral-800/80 hover:border-neutral-700 hover:bg-[#0d162a]'
                  }`}
                >
                  {/* Top Badges */}
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                        {item.model.providerDisplayName}
                      </span>
                      <h3 className="text-base font-bold text-white leading-tight">
                        {item.model.name}
                      </h3>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {isCheapest && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Lowest Cost
                        </span>
                      )}
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Monthly Cost Headline */}
                  <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-900 mb-3">
                    <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-0.5">
                      Monthly Total ({currency})
                    </span>
                    <span className="text-xl font-black font-mono text-cyan-300">
                      {formatCurrency(monCost, currency)}
                    </span>
                    <span className="text-[11px] text-neutral-500 block">
                      {formatCurrency(reqCost, currency, 4)} / call
                    </span>
                  </div>

                  {/* Unit Rates */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span>Input / 1M:</span>
                      <span className="font-mono text-white">
                        ${item.model.inputPricePerMillion ?? 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Output / 1M:</span>
                      <span className="font-mono text-white">
                        ${item.model.outputPricePerMillion ?? 'N/A'}
                      </span>
                    </div>
                    {item.model.cachedInputPricePerMillion !== undefined && (
                      <div className="flex justify-between text-neutral-400">
                        <span>Cached Input:</span>
                        <span className="font-mono text-emerald-400">
                          ${item.model.cachedInputPricePerMillion}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-neutral-900 flex justify-between items-center text-[11px] text-neutral-500">
                    <span className="font-mono">{item.model.modelId}</span>
                    <span className="text-cyan-400 text-xs">Select →</span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Lowest Cost Highlight Note */}
          {lowestCostModel && (
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-neutral-300 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p>
                  <strong>Cost-efficiency leader:</strong> For this exact prompt & response workload,{' '}
                  <span className="text-emerald-300 font-bold">
                    {lowestCostModel.model.name} ({lowestCostModel.model.providerDisplayName})
                  </span>{' '}
                  yields the lowest projected monthly expenditure at{' '}
                  <span className="font-mono font-bold text-white">
                    {formatCurrency(
                      currency === 'USD' ? lowestCostModel.monthlyCostUsd : lowestCostModel.monthlyCostInr,
                      currency
                    )}
                  </span>
                  .
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Note: While price is important, consider model latency, code quality, reasoning depth, and context window requirements before deciding.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolPageLayout>
  )
}
