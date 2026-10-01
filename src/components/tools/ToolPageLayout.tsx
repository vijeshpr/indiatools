import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Share2,
  Copy,
  ChevronRight,
  BookOpen,
  Calculator,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react'
import { ToolDefinition } from '../../types'
import { FAQAccordion } from './FAQAccordion'
import { useToast } from '../common/Toast'
import { getToolBySlug } from '../../data/tools'
import { ToolCard } from './ToolCard'

interface ToolPageLayoutProps {
  tool: ToolDefinition
  children: React.ReactNode
  onReset?: () => void
  onCopyResult?: () => string
  customResultSummary?: string
}

export const ToolPageLayout: React.FC<ToolPageLayoutProps> = ({
  tool,
  children,
  onReset,
  onCopyResult,
  customResultSummary,
}) => {
  const { showToast } = useToast()

  // SEO document title, canonical and metadata updates
  useEffect(() => {
    document.title = tool.seo.title
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', tool.seo.metaDescription)
    }

    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', `https://indiapracticaltools.com${tool.seo.canonicalPath}`)

    // Scroll to top upon navigation
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [tool])

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: tool.title,
          text: tool.description,
          url,
        })
        showToast('Shared successfully!')
        return
      } catch {
        // Fallback to copy
      }
    }
    await navigator.clipboard.writeText(url)
    showToast('Tool link copied to clipboard!')
  }

  const handleCopyResult = async () => {
    let textToCopy = customResultSummary || ''
    if (onCopyResult) {
      textToCopy = onCopyResult()
    }
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy)
      showToast('Calculation results copied to clipboard!')
    } else {
      showToast('Tool link copied to clipboard!')
    }
  }

  const relatedTools = tool.relatedSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is ToolDefinition => !!t)

  // Construct JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: tool.title,
        description: tool.detailedDescription,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: tool.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  }

  return (
    <article className="min-h-screen pb-20">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <div className="relative pt-6 pb-10 sm:pb-12 border-b border-neutral-800/80 light:border-slate-200/80 bg-neutral-900/30 light:bg-slate-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-neutral-400 mb-6">
            <Link to="/" className="hover:text-amber-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/tools" className="hover:text-amber-400 transition-colors">
              Tools
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              to={`/category/${tool.category}`}
              className="hover:text-amber-400 transition-colors uppercase font-mono tracking-wider"
            >
              {tool.categoryLabel}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white light:text-slate-900 font-medium truncate">
              {tool.shortTitle}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: `${tool.color}15`,
                    borderColor: `${tool.color}40`,
                    color: tool.color,
                  }}
                >
                  {tool.categoryLabel}
                </span>

                {tool.badge && (
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    {tool.badge}
                  </span>
                )}

                <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  <span>100% Client-Side</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white light:text-slate-900 tracking-tight leading-tight">
                {tool.title}
              </h1>

              <p className="mt-2.5 text-sm sm:text-base text-neutral-400 light:text-slate-600 max-w-3xl leading-relaxed">
                {tool.detailedDescription}
              </p>
            </div>

            {/* Quick Actions (Share, Copy Link, Reset) */}
            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              {onReset && (
                <button
                  onClick={onReset}
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700 transition-colors"
                  title="Reset to default values"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}

              <button
                onClick={handleCopyResult}
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-white bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700 hover:border-amber-500/50 transition-colors"
                title="Copy result summary"
              >
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>Copy</span>
              </button>

              <button
                onClick={handleShare}
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all shadow-md shadow-amber-500/20"
                title="Share this tool"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tool & Calculator Section */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {children}

        {/* How It Works & Indian Formula Context */}
        <section className="mt-14 p-6 sm:p-8 rounded-2xl bg-neutral-900/60 light:bg-slate-50 border border-neutral-800/90 light:border-slate-200">
          <div className="flex items-center gap-2.5 mb-4">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white light:text-slate-900 tracking-tight">
              How It Works & Calculation Logic
            </h2>
          </div>

          <p className="text-sm text-neutral-300 light:text-slate-700 leading-relaxed font-mono bg-neutral-950/70 light:bg-white p-3.5 rounded-xl border border-neutral-800 light:border-slate-200">
            {tool.formulaExplanation}
          </p>

          {tool.assumptions.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs uppercase font-mono tracking-wider text-neutral-400 font-semibold mb-2">
                Standards & Assumptions:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-neutral-400 light:text-slate-600">
                {tool.assumptions.map((assump, idx) => (
                  <li key={idx}>{assump}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Real Example Walkthrough */}
        <section className="mt-6 p-6 sm:p-8 rounded-2xl bg-neutral-900/40 light:bg-slate-50/70 border border-neutral-800/80 light:border-slate-200">
          <div className="flex items-center gap-2.5 mb-4">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white light:text-slate-900">
              Practical Example: {tool.exampleCalculation.title}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div className="p-4 rounded-xl bg-neutral-950/60 light:bg-white border border-neutral-800/80 light:border-slate-200">
              <span className="text-xs font-mono uppercase text-neutral-400 block mb-2 font-semibold">
                Inputs:
              </span>
              <div className="space-y-1 text-sm text-neutral-300 light:text-slate-700">
                {Object.entries(tool.exampleCalculation.inputs).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-neutral-400">{k}:</span>
                    <span className="font-semibold text-white light:text-slate-900">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950/60 light:bg-white border border-neutral-800/80 light:border-slate-200">
              <span className="text-xs font-mono uppercase text-amber-400 block mb-2 font-semibold">
                Outputs:
              </span>
              <div className="space-y-1 text-sm text-neutral-300 light:text-slate-700">
                {Object.entries(tool.exampleCalculation.outputs).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-neutral-400">{k}:</span>
                    <span className="font-semibold text-emerald-400">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-neutral-400 light:text-slate-600 leading-relaxed italic">
            "{tool.exampleCalculation.explanation}"
          </p>
        </section>

        {/* FAQs */}
        <FAQAccordion faqs={tool.faqs} />

        {/* Related Tools Recommendation */}
        {relatedTools.length > 0 && (
          <section className="mt-14 pt-8 border-t border-neutral-800/80 light:border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white light:text-slate-900">
                  Related Practical Tools
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Frequently paired together for deeper calculations
                </p>
              </div>
              <Link
                to="/tools"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedTools.map((relTool) => (
                <ToolCard key={relTool.id} tool={relTool} />
              ))}
            </div>
          </section>
        )}
      </main>
    </article>
  )
}
