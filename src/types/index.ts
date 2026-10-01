export type ToolCategory = 'drive' | 'build' | 'power' | 'money' | 'land' | 'work' | 'create'

export interface FAQItem {
  question: string
  answer: string
}

export interface ExampleCalculation {
  title: string
  inputs: Record<string, string>
  outputs: Record<string, string>
  explanation: string
}

export interface ToolSEO {
  title: string
  metaDescription: string
  keywords: string[]
  canonicalPath: string
}

export interface ToolDefinition {
  id: string
  slug: string
  title: string
  shortTitle: string
  category: ToolCategory
  categoryLabel: string
  description: string
  detailedDescription: string
  iconName: string
  badge?: 'Flagship' | 'Popular' | 'Govt Exam Special' | 'Essential' | 'New'
  tags: string[]
  searchKeywords: string[]
  formulaExplanation: string
  assumptions: string[]
  exampleCalculation: ExampleCalculation
  faqs: FAQItem[]
  relatedSlugs: string[]
  seo: ToolSEO
  type: 'calculator' | 'image-tool'
  color: string // Tailwind color accent
}

export interface CategoryInfo {
  id: ToolCategory
  title: string
  subtitle: string
  headline: string
  description: string
  accentColor: string
  gradient: string
  icon: string
  toolCount: number
}
