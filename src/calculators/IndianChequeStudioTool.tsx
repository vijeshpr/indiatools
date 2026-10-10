import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  CheckCircle2,
  BookOpen,
  AlertTriangle,
  HelpCircle,
  Languages,
  ChevronDown,
  ShieldCheck,
  Tag,
} from 'lucide-react'
import {
  SupportedLanguage,
  PaymentMode,
  ChequeFormData,
  ChequeErrors,
} from '../lib/cheque/types'
import { getBankById } from '../lib/cheque/banks'
import { getPaymentModeInfo } from '../lib/cheque/paymentModes'
import { convertAmountToWords, formatInr } from '../lib/cheque/amountToWords'
import { getTranslations, getLanguage } from '../lib/cheque/languages'
import { validateChequeForm } from '../lib/cheque/validation'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { StudioStepper } from '../components/cheque/StudioStepper'
import { LanguageSelector } from '../components/cheque/LanguageSelector'
import { BankSelector } from '../components/cheque/BankSelector'
import { PaymentTypeSelector } from '../components/cheque/PaymentTypeSelector'
import { ChequeDetailsForm } from '../components/cheque/ChequeDetailsForm'
import { ChequePreview } from '../components/cheque/ChequePreview'
import { PreviewToolbar } from '../components/cheque/PreviewToolbar'
import { useToast } from '../components/common/Toast'
import {
  getChequeSeoData,
  getAllChequeHreflangs,
  CHEQUE_SEO_LANGUAGES,
} from '../data/chequeSeoData'

export const IndianChequeStudioTool: React.FC = () => {
  const tool = getToolBySlug('indian-cheque-studio')!
  const { showToast } = useToast()
  const { langCode } = useParams<{ langCode?: string }>()
  const navigate = useNavigate()

  // Validate langCode if provided in URL
  const validLangFromUrl: SupportedLanguage | null =
    langCode && (langCode in CHEQUE_SEO_LANGUAGES)
      ? (langCode as SupportedLanguage)
      : null

  // 1. Language state: URL param has highest precedence, then saved preference, fallback 'en'
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(() => {
    if (validLangFromUrl) return validLangFromUrl
    try {
      const saved = localStorage.getItem('india_cheque_lang') as SupportedLanguage
      if (saved && (saved in CHEQUE_SEO_LANGUAGES)) return saved
    } catch {}
    return 'en'
  })

  // Synchronize when route URL changes (e.g. browser back/forward or clicking language links)
  useEffect(() => {
    if (validLangFromUrl) {
      if (validLangFromUrl !== selectedLang) {
        setSelectedLang(validLangFromUrl)
      }
    } else if (!langCode && selectedLang !== 'en') {
      setSelectedLang('en')
    }
  }, [validLangFromUrl, langCode])

  // 2. Step state (1: Language, 2: Bank, 3: Mode, 4: Details, 5: Preview)
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set([1]))

  // 3. Bank & Payment mode
  const [selectedBankId, setSelectedBankId] = useState<string>('sbi')
  const [selectedMode, setSelectedMode] = useState<PaymentMode>('account-payee')

  // 4. Form Data
  const [formData, setFormData] = useState<ChequeFormData>({
    date: new Date().toISOString().split('T')[0],
    payeeName: 'Ramesh Kumar',
    amountRupees: 125750,
    amountPaise: 0,
    accountHolderName: 'Priya Sharma',
    memo: 'Office Renovation',
  })

  const [formErrors, setFormErrors] = useState<ChequeErrors>({})

  // 5. User zoom multiplier for the cheque canvas (1.0 = 100% container fit)
  const [zoomLevel, setZoomLevel] = useState<number>(1)

  // FAQ Accordion interactive state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  // Persist language and navigate to corresponding localized route
  const handleLanguageChange = (lang: SupportedLanguage) => {
    setSelectedLang(lang)
    try {
      localStorage.setItem('india_cheque_lang', lang)
    } catch {
      // Ignore storage errors
    }

    const targetPath =
      lang === 'en'
        ? '/calculators/indian-cheque-studio'
        : `/calculators/indian-cheque-studio/${lang}`

    if (window.location.pathname !== targetPath) {
      navigate(targetPath)
    }
  }

  const markStepComplete = (step: number) => {
    setCompletedSteps((prev) => new Set([...prev, step]))
  }

  // Navigation handlers
  const handleContinueFromLang = () => {
    markStepComplete(1)
    setCurrentStep(2)
  }

  const handleContinueFromBank = () => {
    markStepComplete(2)
    setCurrentStep(3)
  }

  const handleContinueFromMode = () => {
    markStepComplete(3)
    setCurrentStep(4)
  }

  const handleContinueFromDetails = () => {
    const { isValid, errors } = validateChequeForm(formData)
    setFormErrors(errors)
    if (isValid) {
      markStepComplete(4)
      setCurrentStep(5)
    } else {
      showToast('Please correct form errors before proceeding')
    }
  }

  const handleStepJump = (step: number) => {
    if (step <= currentStep || completedSteps.has(step - 1)) {
      setCurrentStep(step)
    }
  }

  const handleReset = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      payeeName: '',
      amountRupees: '',
      amountPaise: 0,
      accountHolderName: '',
      memo: '',
    })
    setFormErrors({})
    setCurrentStep(1)
    setCompletedSteps(new Set([1]))
    showToast('Cheque Studio reset to default state')
  }

  const handlePrint = () => {
    window.print()
  }

  // Summary generation for copy action
  const getResultSummary = (): string => {
    const bank = getBankById(selectedBankId)
    const modeInfo = getPaymentModeInfo(selectedMode, selectedLang)
    const amountWords = convertAmountToWords(formData.amountRupees, formData.amountPaise, selectedLang)

    return `Indian Cheque Educational Summary:
--------------------------------------------------
- Issuing Bank: ${bank.name} (${bank.ifscPrefix})
- Crossing Type: ${modeInfo.title} (${modeInfo.chequeMarking})
- Date of Issue: ${formData.date} (Valid for 3 months)
- Payee Name: ${formData.payeeName || 'Unspecified'}
- Rupee Amount: ${amountWords.formattedInr}
- Amount in Words (${getLanguage(selectedLang).name}): ${amountWords.words}
- Amount in Words (English): ${amountWords.wordsInEnglish}
- Account Holder Reference: ${formData.accountHolderName || 'Educational Specimen'}
- Security Status: CTS-2010 Educational Specimen • Non-Negotiable
--------------------------------------------------
Generated via IndiaTools Indian Cheque Studio:
https://indiatools-rho.vercel.app/calculators/indian-cheque-studio`
  }

  const handleCopySummary = async () => {
    const text = getResultSummary()
    try {
      await navigator.clipboard.writeText(text)
      showToast('Cheque reference summary copied to clipboard!')
    } catch {
      showToast('Unable to copy to clipboard')
    }
  }

  const t = getTranslations(selectedLang)
  const isRtl = selectedLang === 'ur'
  const activeBank = getBankById(selectedBankId)
  const activeMode = getPaymentModeInfo(selectedMode, selectedLang)

  const seoData = getChequeSeoData(selectedLang)
  const allHreflangs = getAllChequeHreflangs()

  // Dynamic JSON-LD structured data for WebApplication, BreadcrumbList, and FAQPage
  const customJsonLd = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: seoData.title,
        description: seoData.description,
        url: seoData.canonicalUrl,
        applicationCategory: 'FinancialApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        inLanguage: seoData.localeCode,
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
            name: 'Calculators',
            item: 'https://indiatools-rho.vercel.app/tools',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Salary & Money',
            item: 'https://indiatools-rho.vercel.app/category/money',
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: seoData.h1,
            item: seoData.canonicalUrl,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: seoData.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  }), [seoData])

  return (
    <ToolPageLayout
      tool={tool}
      onReset={handleReset}
      onCopyResult={getResultSummary}
      compactHeader={true}
      maxWidthClass="max-w-6xl xl:max-w-7xl"
      customTitle={seoData.title}
      customDescription={seoData.description}
      customH1={seoData.h1}
      customSubtitle={seoData.subtitle}
      customCanonicalPath={seoData.slugPath}
      hreflangs={allHreflangs}
      customJsonLd={customJsonLd}
      hideDefaultGuide={true}
      hideDefaultFaqs={true}
    >
      {/* Print-specific style tag */}
      <style>{`
        @page {
          size: A4 portrait;
          margin: 8mm;
        }

        @media print {
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            background: #FFFFFF !important;
            color: #000000 !important;
          }

          /* Hide all screen UI from layout so they take 0 space */
          header,
          nav,
          footer,
          aside,
          .no-print,
          .cheque-screen-ui {
            display: none !important;
          }

          article,
          main {
            margin: 0 !important;
            padding: 0 !important;
            min-height: 0 !important;
            max-width: 100% !important;
            overflow: visible !important;
          }

          .cheque-print-sheet {
            display: block !important;
            visibility: visible !important;
            box-sizing: border-box !important;
            width: 100% !important;
            max-width: 690px !important;
            margin: 0 auto !important;
            padding: 2mm 0 0 0 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .cheque-print-sheet * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* ================= SCREEN INTERACTIVE UI (HIDDEN DURING PRINT) ================= */}
      <div className="cheque-screen-ui no-print space-y-3.5 sm:space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* ================= STEPPER ================= */}
        <div className="no-print">
          <StudioStepper
            currentStep={currentStep}
            onStepClick={handleStepJump}
            lang={selectedLang}
            completedSteps={completedSteps}
          />
        </div>

        {/* ================= MAIN WIZARD STEP CONTAINER ================= */}
        <div className="p-3.5 sm:p-5 lg:p-6 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl no-print relative overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Step 1: Language */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <LanguageSelector
                  selectedLang={selectedLang}
                  onSelectLang={handleLanguageChange}
                  onContinue={handleContinueFromLang}
                />
              </motion.div>
            )}

            {/* Step 2: Bank */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <BankSelector
                  selectedBankId={selectedBankId}
                  onSelectBank={setSelectedBankId}
                  onContinue={handleContinueFromBank}
                  onBack={() => setCurrentStep(1)}
                  lang={selectedLang}
                />
              </motion.div>
            )}

            {/* Step 3: Payment Type */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <PaymentTypeSelector
                  selectedMode={selectedMode}
                  onSelectMode={setSelectedMode}
                  onContinue={handleContinueFromMode}
                  onBack={() => setCurrentStep(2)}
                  lang={selectedLang}
                />
              </motion.div>
            )}

            {/* Step 4: Cheque Details with Synchronized Side-by-Side Preview on Desktop */}
            {currentStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start"
              >
                {/* Left Column: Cheque Details Form */}
                <div className="lg:col-span-6 xl:col-span-5">
                  <ChequeDetailsForm
                    data={formData}
                    errors={formErrors}
                    onChange={(fields) => setFormData((prev) => ({ ...prev, ...fields }))}
                    onContinue={handleContinueFromDetails}
                    onBack={() => setCurrentStep(3)}
                    lang={selectedLang}
                  />
                </div>

                {/* Right Column: Sticky Live Cheque Preview */}
                <div className="lg:col-span-6 xl:col-span-7 lg:sticky lg:top-20 space-y-3">
                  {/* Live Sync Status Pill & Zoom Controls */}
                  <div className="flex items-center justify-between p-2 px-3 rounded-xl bg-neutral-950/70 light:bg-slate-100 border border-neutral-800 light:border-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-xs font-bold text-white light:text-slate-900">
                        Live CTS-2010 Preview
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 hidden sm:inline">
                        • Updates as you type
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-neutral-900 light:bg-white rounded-lg p-0.5 border border-neutral-800 light:border-slate-200">
                      <button
                        type="button"
                        onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
                        className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        title="Zoom Out"
                      >
                        -
                      </button>
                      <span className="text-[11px] font-mono text-neutral-300 light:text-slate-700 px-1 font-bold min-w-[34px] text-center">
                        {Math.round(zoomLevel * 100)}%
                      </span>
                      <button
                        type="button"
                        onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                        className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        title="Zoom In"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Cheque Preview Canvas */}
                  <div className="p-3 sm:p-4 rounded-xl bg-neutral-950/90 light:bg-slate-200/50 border border-neutral-800 light:border-slate-300 shadow-inner flex flex-col items-center justify-center min-h-[180px]">
                    <ChequePreview
                      data={formData}
                      bankId={selectedBankId}
                      paymentMode={selectedMode}
                      lang={selectedLang}
                      zoomLevel={zoomLevel}
                    />
                  </div>

                  {/* Compact Quick Summary Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                    <div className="p-2 rounded-lg bg-neutral-950/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200">
                      <span className="text-[9px] font-mono uppercase text-neutral-500 block">Bank</span>
                      <strong className="text-white light:text-slate-900 block truncate">{activeBank.shortName}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-neutral-950/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200">
                      <span className="text-[9px] font-mono uppercase text-neutral-500 block">Mode</span>
                      <strong className="text-amber-400 block truncate">{activeMode.title}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-neutral-950/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200">
                      <span className="text-[9px] font-mono uppercase text-neutral-500 block">Amount</span>
                      <strong className="text-emerald-400 block truncate font-mono">{formatInr(formData.amountRupees)}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-neutral-950/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200">
                      <span className="text-[9px] font-mono uppercase text-neutral-500 block">Language</span>
                      <strong className="text-white light:text-slate-900 block truncate">{getLanguage(selectedLang).name}</strong>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Final Preview Hub */}
            {currentStep === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="space-y-3.5 sm:space-y-4"
              >
                {/* Step 5 Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 sm:pb-3 border-b border-neutral-800 light:border-slate-200">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-mono font-bold">
                        05
                      </span>
                      <h2 className="text-lg sm:text-xl font-black text-white light:text-slate-900 tracking-tight">
                        {t.previewTitle}
                      </h2>
                    </div>
                    <p className="text-xs text-neutral-400 light:text-slate-600">
                      {t.previewSubtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.readyBadge}</span>
                    </span>
                  </div>
                </div>

                {/* Toolbar */}
                <PreviewToolbar
                  zoomLevel={zoomLevel}
                  onZoomIn={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
                  onZoomOut={() => setZoomLevel((z) => Math.max(0.4, z - 0.1))}
                  onZoomReset={() => setZoomLevel(1)}
                  onEditDetails={() => setCurrentStep(4)}
                  onPrint={handlePrint}
                  onCopySummary={handleCopySummary}
                  lang={selectedLang}
                />

                {/* Live Cheque Preview Canvas */}
                <div className="p-3 sm:p-5 rounded-xl bg-neutral-950/80 light:bg-slate-200/50 border border-neutral-800 light:border-slate-300 shadow-inner flex flex-col items-center justify-center min-h-[220px] overflow-hidden">
                  <ChequePreview
                    data={formData}
                    bankId={selectedBankId}
                    paymentMode={selectedMode}
                    lang={selectedLang}
                    zoomLevel={zoomLevel}
                  />
                </div>

                {/* Educational Metadata Summary Strip */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-neutral-950/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200">
                    <span className="text-[9px] font-mono uppercase text-neutral-500 block mb-0.5">
                      Issuing Bank
                    </span>
                    <strong className="text-white light:text-slate-900 block truncate text-xs">
                      {activeBank.name}
                    </strong>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {activeBank.ifscPrefix}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-neutral-950/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200">
                    <span className="text-[9px] font-mono uppercase text-neutral-500 block mb-0.5">
                      Crossing Mode
                    </span>
                    <strong className="text-amber-400 block truncate text-xs">
                      {activeMode.title}
                    </strong>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {activeMode.chequeMarking}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-neutral-950/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200">
                    <span className="text-[9px] font-mono uppercase text-neutral-500 block mb-0.5">
                      Rupee Amount
                    </span>
                    <strong className="text-emerald-400 block font-mono text-xs sm:text-sm">
                      {formatInr(formData.amountRupees)}
                    </strong>
                    <span className="text-[10px] font-mono text-neutral-400">
                      Indian Numbering
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-neutral-950/60 light:bg-slate-50 border border-neutral-800 light:border-slate-200">
                    <span className="text-[9px] font-mono uppercase text-neutral-500 block mb-0.5">
                      Script Language
                    </span>
                    <strong className="text-white light:text-slate-900 block truncate text-xs">
                      {getLanguage(selectedLang).name} ({getLanguage(selectedLang).nativeName})
                    </strong>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {getLanguage(selectedLang).script}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ================= 1. STEP-BY-STEP CHEQUE GUIDE (CTS-2010 STANDARD) ================= */}
        <section className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-neutral-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {seoData.headings.guideTitle}
                </h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                  CTS-2010 Standard Banking Rules • {seoData.langName} ({seoData.nativeName})
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>RBI CTS-2010 Compliant</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seoData.guideSteps.map((step) => {
              const labelBadge =
                step.stepNumber === 1 ? seoData.headings.dateLabel :
                step.stepNumber === 2 ? seoData.headings.payeeLabel :
                step.stepNumber === 3 ? seoData.headings.amountWordsLabel :
                step.stepNumber === 4 ? seoData.headings.amountNumbersLabel :
                step.stepNumber === 5 ? seoData.headings.crossingLabel :
                seoData.headings.signatureLabel

              return (
                <div
                  key={step.stepNumber}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-950/60 border border-slate-200/80 dark:border-neutral-800/70 flex flex-col justify-between hover:border-amber-500/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        Step 0{step.stepNumber}
                      </span>
                      <span className="text-[10.5px] font-medium text-slate-500 dark:text-neutral-400 truncate max-w-[170px]">
                        {labelBadge}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed mb-3">
                      {step.instruction}
                    </p>
                  </div>
                  {step.tip && (
                    <div className="pt-2 border-t border-slate-200/60 dark:border-neutral-800/60 text-[11px] text-amber-700 dark:text-amber-400/90 italic">
                      💡 {step.tip}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* ================= 2. 5 CRITICAL MISTAKES TO AVOID ================= */}
        <section className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-rose-50/70 via-white to-white dark:from-rose-950/20 dark:via-neutral-900/80 dark:to-neutral-900/80 border border-rose-200 dark:border-rose-500/20 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 dark:text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {seoData.headings.mistakesTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                Avoid cheque bounce penalties, clearing rejection, or fraud risk
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {seoData.commonMistakes.map((mistake, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-white dark:bg-neutral-950/50 border border-rose-100 dark:border-rose-900/20"
              >
                <span className="text-rose-500 dark:text-rose-400 font-bold text-sm shrink-0 mt-0.5">✕</span>
                <p className="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed">
                  {mistake}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= 3. LOCALIZED FAQ ACCORDION ================= */}
        <section className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 shadow-xl space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-neutral-800/80">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {seoData.headings.faqTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                Frequently asked questions verified against Reserve Bank of India clearing guidelines
              </p>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            {seoData.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200/80 dark:border-neutral-800/70 overflow-hidden bg-slate-50/50 dark:bg-neutral-950/40 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left gap-4 hover:bg-slate-100/60 dark:hover:bg-neutral-800/30 transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 dark:text-neutral-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-amber-500 dark:text-amber-400' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-4 pt-1 text-xs text-slate-600 dark:text-neutral-300 leading-relaxed border-t border-slate-200/50 dark:border-neutral-800/50 bg-white dark:bg-neutral-950/60">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </section>

        {/* ================= 4. ALL 13 LANGUAGES CRAWLABLE NAVIGATION ================= */}
        <section className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-neutral-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-neutral-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {seoData.headings.languagesTitle}
                </h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                  Complete bilingual cheque writing formats across 13 Indian languages
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-500 dark:text-neutral-400">
              13 Languages Supported
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {Object.values(CHEQUE_SEO_LANGUAGES).map((item) => {
              const isActive = selectedLang === item.lang
              const linkPath = item.slugPath

              return (
                <Link
                  key={item.lang}
                  to={linkPath}
                  onClick={() => handleLanguageChange(item.lang)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isActive
                      ? 'bg-amber-500/15 border-amber-500 text-slate-900 dark:text-white shadow-sm shadow-amber-500/10 ring-1 ring-amber-500/50'
                      : 'bg-slate-50 dark:bg-neutral-950/40 border-slate-200/80 dark:border-neutral-800/80 text-slate-700 dark:text-neutral-300 hover:border-amber-500/40 hover:bg-slate-100/60 dark:hover:bg-neutral-800/40'
                  }`}
                  hrefLang={item.localeCode}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.nativeName}
                    </span>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1 text-[10.5px] text-slate-500 dark:text-neutral-400">
                    <span>{item.langName}</span>
                    <span className="font-mono text-[9px] uppercase px-1 py-0.5 rounded bg-slate-200 dark:bg-neutral-800">
                      {item.script}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ================= 5. POPULAR SEARCH PHRASES & TRANSLITERATIONS ================= */}
        <section className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-neutral-950/40 border border-slate-200 dark:border-neutral-800/70 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
            <Tag className="w-3.5 h-3.5 text-amber-500" />
            <span>Search Queries & Regional Phrases ({seoData.langName})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {seoData.searchIntents.map((intent, idx) => (
              <span
                key={`intent-${idx}`}
                className="px-2.5 py-1 rounded-lg text-xs bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300"
              >
                {intent}
              </span>
            ))}
            {seoData.keywords.slice(0, 6).map((kw, idx) => (
              <span
                key={`kw-${idx}`}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/80 dark:bg-neutral-900/60 border border-slate-200/60 dark:border-neutral-800/60 text-slate-500 dark:text-neutral-400"
              >
                {kw}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* ================= PRINTABLE SHEET CONTAINER (VISIBLE ONLY IN PRINT) ================= */}
      <div id="cheque-printable-container" className="cheque-print-sheet hidden print:block">
        <div className="text-center pb-2 mb-2 border-b-2 border-slate-300">
          <h1 className="text-base sm:text-lg font-black font-sans uppercase tracking-tight text-slate-900">
            IndiaTools — Educational Cheque Specimen
          </h1>
          <p className="text-[10px] text-slate-600 mt-0.5">
            CTS-2010 Standard Demonstration • For Instructional Training & Educational Purpose Only
          </p>
        </div>

        <div className="flex justify-center my-2">
          <ChequePreview
            data={formData}
            bankId={selectedBankId}
            paymentMode={selectedMode}
            lang={selectedLang}
            isPrint={true}
          />
        </div>

        <div className="mt-3 border-t-2 border-slate-300 pt-2 text-[10.5px] font-sans text-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <h2 className="font-bold text-xs uppercase text-slate-950 tracking-wider">
              CTS-2010 Cheque Writing Guidelines & Security Rules
            </h2>
            <span className="text-[10px] font-mono text-slate-500">
              Verified Specimen • Non-Negotiable
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-slate-700">
            <div className="flex items-start gap-1">
              <span className="font-bold text-slate-900">☑</span>
              <span><strong>Crossing Mode:</strong> Always cross as "A/C PAYEE ONLY" to avoid unauthorized counter cash encashment.</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="font-bold text-slate-900">☑</span>
              <span><strong>Payee Legal Name:</strong> Start directly from "PAY" without blank space to prevent name prefixing.</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="font-bold text-slate-900">☑</span>
              <span><strong>Amount in Words:</strong> Conclude words with "Only" or "मात्र" followed by "//" to block alterations.</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="font-bold text-slate-900">☑</span>
              <span><strong>Validity Period:</strong> Indian cheques are valid for exactly 3 months from the date of issue.</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="font-bold text-slate-900">☑</span>
              <span><strong>CTS-2010 Safeguard:</strong> Never write or sign across the bottom 0.75-inch MICR band or barcode track.</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="font-bold text-slate-900">☑</span>
              <span><strong>Specimen Notice:</strong> This document is a non-negotiable educational training simulation.</span>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
