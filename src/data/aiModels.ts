export type AIProvider = 'openai' | 'google' | 'anthropic' | 'deepseek' | 'custom'

export interface ModelPricing {
  id: string
  provider: AIProvider
  providerDisplayName: string
  name: string
  modelId: string
  category: 'flagship' | 'fast' | 'reasoning' | 'specialized'
  inputPricePerMillion: number | null // USD per 1M tokens
  outputPricePerMillion: number | null // USD per 1M tokens
  cachedInputPricePerMillion?: number | null // USD per 1M tokens
  contextWindowTokens: number | null
  maxOutputTokens: number | null
  reasoningNotes?: string
  cachingNotes?: string
  officialDocUrl: string
  officialPricingUrl: string
  lastVerifiedDate: string // YYYY-MM-DD
  isPricingVerified: boolean
  isDeprecated?: boolean
  description: string
}

export const AI_MODELS: ModelPricing[] = [
  // ===================== OPENAI =====================
  {
    id: 'openai-gpt-4o',
    provider: 'openai',
    providerDisplayName: 'OpenAI',
    name: 'GPT-4o',
    modelId: 'gpt-4o',
    category: 'flagship',
    inputPricePerMillion: 2.50,
    outputPricePerMillion: 10.00,
    cachedInputPricePerMillion: 1.25,
    contextWindowTokens: 128000,
    maxOutputTokens: 16384,
    cachingNotes: 'Automatic prompt caching applies a 50% discount on cached input tokens (>1024 tokens).',
    officialDocUrl: 'https://platform.openai.com/docs/models/gpt-4o',
    officialPricingUrl: 'https://openai.com/api/pricing/',
    lastVerifiedDate: '2026-03-15',
    isPricingVerified: true,
    description: 'Flagship multimodal workhorse for high-intelligence text, vision, and tool calling.',
  },
  {
    id: 'openai-gpt-4o-mini',
    provider: 'openai',
    providerDisplayName: 'OpenAI',
    name: 'GPT-4o mini',
    modelId: 'gpt-4o-mini',
    category: 'fast',
    inputPricePerMillion: 0.15,
    outputPricePerMillion: 0.60,
    cachedInputPricePerMillion: 0.075,
    contextWindowTokens: 128000,
    maxOutputTokens: 16384,
    cachingNotes: 'Automatic prompt caching at 50% off standard input token pricing ($0.075 / 1M tokens).',
    officialDocUrl: 'https://platform.openai.com/docs/models/gpt-4o-mini',
    officialPricingUrl: 'https://openai.com/api/pricing/',
    lastVerifiedDate: '2026-03-15',
    isPricingVerified: true,
    description: 'Ultra-fast, cost-effective small model ideal for lightweight tasks, parsing, and chatbots.',
  },
  {
    id: 'openai-o1',
    provider: 'openai',
    providerDisplayName: 'OpenAI',
    name: 'o1',
    modelId: 'o1',
    category: 'reasoning',
    inputPricePerMillion: 15.00,
    outputPricePerMillion: 60.00,
    cachedInputPricePerMillion: 7.50,
    contextWindowTokens: 200000,
    maxOutputTokens: 100000,
    reasoningNotes: 'Reasoning tokens are generated internally during chain-of-thought and billed as output tokens.',
    cachingNotes: 'Cached input billed at 50% discount ($7.50 / 1M tokens).',
    officialDocUrl: 'https://platform.openai.com/docs/models/o1',
    officialPricingUrl: 'https://openai.com/api/pricing/',
    lastVerifiedDate: '2026-03-15',
    isPricingVerified: true,
    description: 'Deep reasoning model for math, complex scientific logic, and multi-step programming.',
  },
  {
    id: 'openai-o3-mini',
    provider: 'openai',
    providerDisplayName: 'OpenAI',
    name: 'o3-mini',
    modelId: 'o3-mini',
    category: 'reasoning',
    inputPricePerMillion: 1.10,
    outputPricePerMillion: 4.40,
    cachedInputPricePerMillion: 0.55,
    contextWindowTokens: 200000,
    maxOutputTokens: 100000,
    reasoningNotes: 'Reasoning tokens consumed during internal thinking are billed at the standard output rate ($4.40/1M).',
    cachingNotes: 'Cached inputs receive a 50% discount ($0.55 / 1M tokens).',
    officialDocUrl: 'https://platform.openai.com/docs/models/o3-mini',
    officialPricingUrl: 'https://openai.com/api/pricing/',
    lastVerifiedDate: '2026-03-15',
    isPricingVerified: true,
    description: 'High-speed reasoning model specialized for coding, math, and structured data with adjustable effort.',
  },

  // ===================== GOOGLE GEMINI =====================
  {
    id: 'google-gemini-2-0-flash',
    provider: 'google',
    providerDisplayName: 'Google Gemini',
    name: 'Gemini 2.0 Flash',
    modelId: 'gemini-2.0-flash',
    category: 'fast',
    inputPricePerMillion: 0.15,
    outputPricePerMillion: 0.60,
    cachedInputPricePerMillion: 0.0375,
    contextWindowTokens: 1048576,
    maxOutputTokens: 8192,
    cachingNotes: 'Context Caching offers up to 75% discount ($0.0375 / 1M tokens) on cached input prefixes.',
    officialDocUrl: 'https://ai.google.dev/gemini-api/docs/models/gemini-2.0-flash',
    officialPricingUrl: 'https://ai.google.dev/pricing',
    lastVerifiedDate: '2026-03-15',
    isPricingVerified: true,
    description: 'Next-gen multimodal flash model featuring 1M token context, agentic speed, and audio/video handling.',
  },
  {
    id: 'google-gemini-1-5-flash',
    provider: 'google',
    providerDisplayName: 'Google Gemini',
    name: 'Gemini 1.5 Flash',
    modelId: 'gemini-1.5-flash',
    category: 'fast',
    inputPricePerMillion: 0.075,
    outputPricePerMillion: 0.30,
    cachedInputPricePerMillion: 0.01875,
    contextWindowTokens: 1048576,
    maxOutputTokens: 8192,
    cachingNotes: 'Context Caching at $0.01875 / 1M tokens for prompts over 32k tokens.',
    officialDocUrl: 'https://ai.google.dev/gemini-api/docs/models/gemini-1.5-flash',
    officialPricingUrl: 'https://ai.google.dev/pricing',
    lastVerifiedDate: '2026-03-15',
    isPricingVerified: true,
    description: 'Ultra-low cost high-throughput multimodal model with a 1M token context window.',
  },
  {
    id: 'google-gemini-1-5-pro',
    provider: 'google',
    providerDisplayName: 'Google Gemini',
    name: 'Gemini 1.5 Pro',
    modelId: 'gemini-1.5-pro',
    category: 'flagship',
    inputPricePerMillion: 1.25,
    outputPricePerMillion: 5.00,
    cachedInputPricePerMillion: 0.3125,
    contextWindowTokens: 2097152,
    maxOutputTokens: 8192,
    cachingNotes: 'Context Caching at $0.3125 / 1M tokens (<128k prompt). Note: Prompts >128k billed at higher tier ($2.50/$10.00).',
    officialDocUrl: 'https://ai.google.dev/gemini-api/docs/models/gemini-1.5-pro',
    officialPricingUrl: 'https://ai.google.dev/pricing',
    lastVerifiedDate: '2026-03-15',
    isPricingVerified: true,
    description: '2M token breakthrough context window for analyzing hours of audio, whole codebases, and full books.',
  },

  // ===================== ANTHROPIC CLAUDE =====================
  {
    id: 'anthropic-claude-3-5-sonnet',
    provider: 'anthropic',
    providerDisplayName: 'Anthropic Claude',
    name: 'Claude 3.5 Sonnet',
    modelId: 'claude-3-5-sonnet-20241022',
    category: 'flagship',
    inputPricePerMillion: 3.00,
    outputPricePerMillion: 15.00,
    cachedInputPricePerMillion: 0.30,
    contextWindowTokens: 200000,
    maxOutputTokens: 8192,
    cachingNotes: 'Prompt Cache Read discount is 90% ($0.30 / 1M tokens). Cache Write is billed at $3.75 / 1M tokens.',
    officialDocUrl: 'https://docs.anthropic.com/en/docs/models-overview',
    officialPricingUrl: 'https://www.anthropic.com/pricing#anthropic-api',
    lastVerifiedDate: '2026-03-15',
    isPricingVerified: true,
    description: 'Industry-leading intelligence and nuanced writing, excels at complex coding, architecture, and agent workflows.',
  },
  {
    id: 'anthropic-claude-3-5-haiku',
    provider: 'anthropic',
    providerDisplayName: 'Anthropic Claude',
    name: 'Claude 3.5 Haiku',
    modelId: 'claude-3-5-haiku-20241022',
    category: 'fast',
    inputPricePerMillion: 0.80,
    outputPricePerMillion: 4.00,
    cachedInputPricePerMillion: 0.08,
    contextWindowTokens: 200000,
    maxOutputTokens: 8192,
    cachingNotes: 'Prompt Cache Read is 90% off base input ($0.08 / 1M tokens). Cache Write is $1.00 / 1M.',
    officialDocUrl: 'https://docs.anthropic.com/en/docs/models-overview',
    officialPricingUrl: 'https://www.anthropic.com/pricing#anthropic-api',
    lastVerifiedDate: '2026-03-15',
    isPricingVerified: true,
    description: 'Ultra-fast sub-second responses with near-Sonnet coding benchmarks at a fraction of the cost.',
  },
  {
    id: 'anthropic-claude-3-opus',
    provider: 'anthropic',
    providerDisplayName: 'Anthropic Claude',
    name: 'Claude 3 Opus',
    modelId: 'claude-3-opus-20240229',
    category: 'specialized',
    inputPricePerMillion: 15.00,
    outputPricePerMillion: 75.00,
    cachedInputPricePerMillion: 1.50,
    contextWindowTokens: 200000,
    maxOutputTokens: 4096,
    cachingNotes: 'Prompt Cache Read is $1.50 / 1M tokens. Cache Write is $18.75 / 1M tokens.',
    officialDocUrl: 'https://docs.anthropic.com/en/docs/models-overview',
    officialPricingUrl: 'https://www.anthropic.com/pricing#anthropic-api',
    lastVerifiedDate: '2026-03-15',
    isPricingVerified: true,
    description: 'High-capability model for deeply open-ended research, nuanced philosophy, and executive writing.',
  },

  // ===================== DEEPSEEK =====================
  {
    id: 'deepseek-chat',
    provider: 'deepseek',
    providerDisplayName: 'DeepSeek',
    name: 'DeepSeek-V3 (Chat)',
    modelId: 'deepseek-chat',
    category: 'fast',
    inputPricePerMillion: 0.14,
    outputPricePerMillion: 0.28,
    cachedInputPricePerMillion: 0.014,
    contextWindowTokens: 64000,
    maxOutputTokens: 8192,
    cachingNotes: 'Disk context caching yields 90% discount on cache hit ($0.014 / 1M input tokens). Standard input is $0.14 / 1M.',
    officialDocUrl: 'https://api-docs.deepseek.com/',
    officialPricingUrl: 'https://api-docs.deepseek.com/quick_start/pricing',
    lastVerifiedDate: '2026-03-15',
    isPricingVerified: true,
    description: 'Extremely economical Mixture-of-Experts (MoE) flagship model with state-of-the-art general intelligence.',
  },
  {
    id: 'deepseek-reasoner',
    provider: 'deepseek',
    providerDisplayName: 'DeepSeek',
    name: 'DeepSeek-R1 (Reasoner)',
    modelId: 'deepseek-reasoner',
    category: 'reasoning',
    inputPricePerMillion: 0.55,
    outputPricePerMillion: 2.19,
    cachedInputPricePerMillion: 0.14,
    contextWindowTokens: 64000,
    maxOutputTokens: 8192,
    reasoningNotes: 'Internal Chain-of-Thought (reasoning content) tokens are billed at standard output token rate ($2.19/1M).',
    cachingNotes: 'Context cache hit rate is $0.14 / 1M tokens.',
    officialDocUrl: 'https://api-docs.deepseek.com/guides/reasoning_model',
    officialPricingUrl: 'https://api-docs.deepseek.com/quick_start/pricing',
    lastVerifiedDate: '2026-03-15',
    isPricingVerified: true,
    description: 'Open-weights reasoning model matching o1 performance on mathematical proofs, competitive coding, and logic.',
  },
]

export const DEFAULT_MODEL_ID = 'openai-gpt-4o-mini'

export function getModelById(id: string): ModelPricing | undefined {
  return AI_MODELS.find((m) => m.id === id)
}

export function getModelsByProvider(provider: AIProvider): ModelPricing[] {
  return AI_MODELS.filter((m) => m.provider === provider)
}
