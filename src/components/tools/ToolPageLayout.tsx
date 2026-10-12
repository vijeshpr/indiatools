import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
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
import { useSEO } from '../../hooks/useSEO'
import { useI18n } from '../../i18n/I18nContext'

interface ToolPageLayoutProps {
  tool: ToolDefinition
  children: React.ReactNode
  onReset?: () => void
  onCopyResult?: () => string
  customResultSummary?: string
  compactHeader?: boolean
  maxWidthClass?: string
  customTitle?: string
  customDescription?: string
  customH1?: string
  customSubtitle?: string
  customCanonicalPath?: string
  hreflangs?: Array<{ lang: string; href: string }>
  customJsonLd?: Record<string, any>
  hideDefaultGuide?: boolean
  hideDefaultFaqs?: boolean
  hideHeroHeader?: boolean
  hideHeaderActions?: boolean
}

export const ToolPageLayout: React.FC<ToolPageLayoutProps> = ({
  tool,
  children,
  onReset,
  onCopyResult,
  customResultSummary,
  compactHeader = false,
  maxWidthClass = 'max-w-5xl',
  customTitle,
  customDescription,
  customH1,
  customSubtitle,
  customCanonicalPath,
  hreflangs,
  customJsonLd,
  hideDefaultGuide = false,
  hideDefaultFaqs = false,
  hideHeroHeader = false,
  hideHeaderActions = false,
}) => {
  const { showToast } = useToast()
  const { t } = useI18n()

  // Construct JSON-LD Schema
  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: tool.title,
          description: tool.detailedDescription || tool.description,
          url: `https://indiatools-rho.vercel.app${tool.seo.canonicalPath}`,
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'All',
          browserRequirements: 'Requires JavaScript. Requires HTML5.',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'INR',
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://indiatools-rho.vercel.app/',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Tools',
              item: 'https://indiatools-rho.vercel.app/tools',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: tool.categoryLabel,
              item: `https://indiatools-rho.vercel.app/category/${tool.category}`,
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: tool.shortTitle,
              item: `https://indiatools-rho.vercel.app${tool.seo.canonicalPath}`,
            },
          ],
        },
        ...(tool.faqs && tool.faqs.length > 0
          ? [
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
            ]
          : []),
      ],
    }),
    [tool]
  )

  useSEO({
    title: customTitle || tool.seo.title,
    description: customDescription || tool.seo.metaDescription,
    canonicalPath: customCanonicalPath || tool.seo.canonicalPath,
    jsonLd: customJsonLd || jsonLd,
    hreflangs,
  })

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: tool.title,
          text: tool.description,
          url,
        })
        return
      } catch (err) {
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

  return (
    <article className="min-h-screen pb-20 print:min-h-0 print:pb-0 print:m-0 print:p-0">
      {/* Hero Header */}
      {!hideHeroHeader && (
        <div
          className={`relative border-b border-slate-200/90 bg-white no-print ${
            compactHeader ? 'pt-4 pb-5' : 'pt-6 pb-10 sm:pb-12'
          }`}
        >
          <div className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8`}>
              {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className={`flex items-center gap-1.5 text-xs text-slate-500 ${
                compactHeader ? 'mb-2 sm:mb-2.5' : 'mb-6'
              }`}
            >
              <Link to="/" className="hover:text-indigo-600 transition-colors">
                {t('nav.home', 'Home')}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to="/tools" className="hover:text-indigo-600 transition-colors">
                {t('nav.allTools', 'Tools')}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                to={`/category/${tool.category}`}
                className="hover:text-indigo-600 transition-colors uppercase font-mono tracking-wider"
              >
                {t(`cat.${tool.category}.title`, tool.categoryLabel)}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-900 font-medium truncate">
                {tool.shortTitle}
              </span>
            </nav>

            <div
              className={`flex flex-col md:flex-row md:items-center justify-between ${
                compactHeader ? 'gap-3' : 'gap-6'
              }`}
            >
              <div>
                <div className={`flex items-center gap-2 ${compactHeader ? 'mb-1.5' : 'mb-3'}`}>
                  <span
                    className="text-xs font-mono uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${tool.color}15`,
                      color: tool.color,
                    }}
                  >
                    {t(`cat.${tool.category}.title`, tool.categoryLabel)}
                  </span>

                  {tool.badge && (
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                      {tool.badge}
                    </span>
                  )}

                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{t('tool.clientSideBadge', '100% Client-Side')}</span>
                  </div>
                </div>

                <h1
                  className={`font-black text-slate-900 tracking-tight leading-tight ${
                    compactHeader ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-2xl sm:text-4xl'
                  }`}
                >
                  {customH1 || tool.title}
                </h1>

                <p
                  className={`text-slate-600 max-w-3xl leading-relaxed ${
                    compactHeader
                      ? 'mt-1 text-xs sm:text-sm line-clamp-2 md:line-clamp-none'
                      : 'mt-2.5 text-sm sm:text-base'
                  }`}
                >
                  {customSubtitle || tool.detailedDescription}
                </p>
              </div>

              {/* Quick Actions (Share, Copy Link, Reset) */}
              {!hideHeaderActions && (
                <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                  {onReset && (
                    <button
                      onClick={onReset}
                      type="button"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                      title="Reset to default values"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t('action.reset', 'Reset')}</span>
                    </button>
                  )}

                  <button
                    onClick={handleCopyResult}
                    type="button"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                    title="Copy result summary"
                  >
                    <Copy className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{t('action.copy', 'Copy')}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    type="button"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-600/20 cursor-pointer"
                    title="Share this tool"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{t('action.share', 'Share')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Tool & Calculator Section */}
      <main
        className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 print:p-0 print:m-0 print:max-w-none ${
          compactHeader ? 'mt-4 sm:mt-5' : hideHeroHeader ? 'mt-4 sm:mt-6' : 'mt-8'
        }`}
      >
        {children}

        {!hideDefaultGuide && (
          <>
            {/* How It Works & Indian Formula Context */}
            <section
              className={`rounded-2xl bg-white border border-slate-200/90 shadow-2xs no-print ${
                compactHeader ? 'mt-8 p-4 sm:p-5' : 'mt-14 p-6 sm:p-8'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-4">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {t('tool.howItWorks', 'How It Works & Calculation Logic')}
                </h2>
              </div>

              <p className="text-sm text-slate-800 leading-relaxed font-mono bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {tool.formulaExplanation}
              </p>

              {tool.assumptions.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-slate-500 font-bold mb-2">
                    {t('tool.assumptions', 'Standards & Assumptions:')}
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                    {tool.assumptions.map((assump, idx) => (
                      <li key={idx}>{assump}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Real Example Walkthrough */}
            <section className="mt-6 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-2xs no-print">
              <div className="flex items-center gap-2.5 mb-4">
                <Calculator className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  {t('tool.practicalExample', 'Practical Example')}: {tool.exampleCalculation.title}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-mono uppercase text-slate-500 block mb-2 font-bold">
                    {t('tool.inputs', 'Inputs:')}
                  </span>
                  <div className="space-y-1 text-sm text-slate-700">
                    {Object.entries(tool.exampleCalculation.inputs).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-slate-500">{k}:</span>
                        <span className="font-semibold text-slate-900">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-mono uppercase text-indigo-600 block mb-2 font-bold">
                    {t('tool.outputs', 'Outputs:')}
                  </span>
                  <div className="space-y-1 text-sm text-slate-700">
                    {Object.entries(tool.exampleCalculation.outputs).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-slate-500">{k}:</span>
                        <span className="font-semibold text-emerald-700">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{tool.exampleCalculation.explanation}"
              </p>
            </section>
          </>
        )}

        {/* FAQs */}
        {!hideDefaultFaqs && (
          <div className="no-print">
            <FAQAccordion faqs={tool.faqs} />
          </div>
        )}

        {/* Related Tools Recommendation */}
        {relatedTools.length > 0 && (
          <section className="mt-14 pt-8 border-t border-slate-200 no-print">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {t('tool.relatedTools', 'Related Practical Tools')}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t('tool.relatedSubtitle', 'Frequently paired together for deeper calculations')}
                </p>
              </div>
              <Link
                to="/tools"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>{t('tool.viewAll', 'View all')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedTools.map((relTool, idx) => (
                <ToolCard key={relTool.id} tool={relTool} index={idx} />
              ))}
            </div>
          </section>
        )}
      </main>
    </article>
  )
}
