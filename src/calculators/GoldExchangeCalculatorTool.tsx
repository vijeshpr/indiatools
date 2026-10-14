import React, { useState, useMemo, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Coins,
  Scale,
  Sparkles,
  Percent,
  Receipt,
  RotateCcw,
  Copy,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Building2,
  ShieldCheck,
  Gem,
  Calculator,
} from 'lucide-react'
import {
  calculateGoldExchange,
  GoldExchangeCalculatorInput,
  GoldExchangeCalculatorResult,
  GoldPurity,
  GoldRateBasis,
  MakingChargeType,
  WastageType,
  getPurityLabel,
} from '../lib/goldExchangeCalc'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { LanguageSelector } from '../components/common/LanguageSelector'
import { useI18n } from '../i18n/I18nContext'
import { SupportedLocale, isValidLocale } from '../i18n/locales'
import { getGoldToolTranslation } from '../i18n/goldToolI18n'

export const GoldExchangeCalculatorTool: React.FC = () => {
  const tool = getToolBySlug('gold-exchange-calculator')!
  const { langCode } = useParams<{ langCode?: string }>()
  const location = useLocation()
  const { locale: contextLocale, setLocale } = useI18n()

  // Determine active locale: check URL param (/ml/tools/... or /calculators/.../ml)
  const activeLocale: SupportedLocale = useMemo(() => {
    if (langCode && isValidLocale(langCode)) {
      return langCode as SupportedLocale
    }
    // Check if path starts with e.g. /ml/tools/
    const pathSegments = location.pathname.split('/').filter(Boolean)
    if (pathSegments.length > 0 && isValidLocale(pathSegments[0])) {
      return pathSegments[0] as SupportedLocale
    }
    return 'en'
  }, [langCode, location.pathname])

  // Sync with context if route contains language prefix
  useEffect(() => {
    if (activeLocale !== contextLocale) {
      setLocale(activeLocale)
    }
  }, [activeLocale, contextLocale, setLocale])

  const t = useMemo(() => getGoldToolTranslation(activeLocale), [activeLocale])

  // ================= STATE =================
  // Market gold rate standard
  const [ratePerGram, setRatePerGram] = useState<number>(7250)
  const [rateBasis, setRateBasis] = useState<GoldRateBasis>('22k')
  const [gstPercent, setGstPercent] = useState<number>(3)

  // Old Gold Exchange Section
  const [hasOldGold, setHasOldGold] = useState<boolean>(true)
  const [oldGrossWeight, setOldGrossWeight] = useState<number>(16.5)
  const [oldStoneWeight, setOldStoneWeight] = useState<number>(0.5)
  const [oldPurity, setOldPurity] = useState<GoldPurity>('22k')
  const [oldDeductionPct, setOldDeductionPct] = useState<number>(1.0) // 1% melting test loss

  // New Gold Quotation A
  const [newGrossA, setNewGrossA] = useState<number>(24.0)
  const [newStoneA, setNewStoneA] = useState<number>(0.0)
  const [newStonePriceA, setNewStonePriceA] = useState<number>(0)
  const [newPurityA, setNewPurityA] = useState<GoldPurity>('22k')
  const [makingTypeA, setMakingTypeA] = useState<MakingChargeType>('percent')
  const [makingValA, setMakingValA] = useState<number>(12) // 12%
  const [wastageTypeA, setWastageTypeA] = useState<WastageType>('percent')
  const [wastageValA, setWastageValA] = useState<number>(0) // combined with MC or separate
  const [hallmarkA, setHallmarkA] = useState<number>(45)
  const [discountA, setDiscountA] = useState<number>(1000)

  // Quotation B (Comparison)
  const [enableCompare, setEnableCompare] = useState<boolean>(false)
  const [newGrossB, setNewGrossB] = useState<number>(24.0)
  const [newStoneB, setNewStoneB] = useState<number>(0.0)
  const [newStonePriceB, setNewStonePriceB] = useState<number>(0)
  const [newPurityB, setNewPurityB] = useState<GoldPurity>('22k')
  const [makingTypeB, setMakingTypeB] = useState<MakingChargeType>('per_gram')
  const [makingValB, setMakingValB] = useState<number>(650) // ₹650/g
  const [wastageTypeB, setWastageTypeB] = useState<WastageType>('percent')
  const [wastageValB, setWastageValB] = useState<number>(3) // 3%
  const [hallmarkB, setHallmarkB] = useState<number>(45)
  const [discountB, setDiscountB] = useState<number>(500)

  // Calculations
  const calcInputs: GoldExchangeCalculatorInput = useMemo(() => {
    return {
      ratePerGram,
      rateBasis,
      gstPercent,
      oldGold: hasOldGold
        ? {
            grossWeightGrams: oldGrossWeight,
            stoneWeightGrams: oldStoneWeight,
            purity: oldPurity,
            customDeductionPercent: oldDeductionPct,
          }
        : undefined,
      quoteA: {
        name: 'Quotation A',
        grossWeightGrams: newGrossA,
        stoneWeightGrams: newStoneA,
        stonePriceInr: newStonePriceA,
        purity: newPurityA,
        makingChargeType: makingTypeA,
        makingChargeValue: makingValA,
        wastageType: wastageTypeA,
        wastageValue: wastageValA,
        hallmarkingChargeInr: hallmarkA,
        otherChargesInr: 0,
        discountInr: discountA,
      },
      quoteB: enableCompare
        ? {
            name: 'Quotation B',
            grossWeightGrams: newGrossB,
            stoneWeightGrams: newStoneB,
            stonePriceInr: newStonePriceB,
            purity: newPurityB,
            makingChargeType: makingTypeB,
            makingChargeValue: makingValB,
            wastageType: wastageTypeB,
            wastageValue: wastageValB,
            hallmarkingChargeInr: hallmarkB,
            otherChargesInr: 0,
            discountInr: discountB,
          }
        : undefined,
    }
  }, [
    ratePerGram,
    rateBasis,
    gstPercent,
    hasOldGold,
    oldGrossWeight,
    oldStoneWeight,
    oldPurity,
    oldDeductionPct,
    newGrossA,
    newStoneA,
    newStonePriceA,
    newPurityA,
    makingTypeA,
    makingValA,
    wastageTypeA,
    wastageValA,
    hallmarkA,
    discountA,
    enableCompare,
    newGrossB,
    newStoneB,
    newStonePriceB,
    newPurityB,
    makingTypeB,
    makingValB,
    wastageTypeB,
    wastageValB,
    hallmarkB,
    discountB,
  ])

  const result: GoldExchangeCalculatorResult = useMemo(() => {
    return calculateGoldExchange(calcInputs)
  }, [calcInputs])

  const handleReset = () => {
    setRatePerGram(7250)
    setRateBasis('22k')
    setGstPercent(3)
    setHasOldGold(true)
    setOldGrossWeight(16.5)
    setOldStoneWeight(0.5)
    setOldPurity('22k')
    setOldDeductionPct(1.0)
    setNewGrossA(24.0)
    setNewStoneA(0)
    setNewStonePriceA(0)
    setNewPurityA('22k')
    setMakingTypeA('percent')
    setMakingValA(12)
    setWastageValA(0)
    setDiscountA(1000)
    setEnableCompare(false)
  }

  const getResultSummary = () => {
    return `Gold Jewellery & Exchange Bill Assessment (IndiaTools):
- Gold Rate: ₹${ratePerGram}/g (${rateBasis.toUpperCase()}) | GST: ${gstPercent}%
- New Jewellery (Quote A): ${result.quoteA.netGoldWeightGrams}g (${getPurityLabel(newPurityA)})
  - Metal Value: ₹${result.quoteA.baseGoldValueInr.toLocaleString('en-IN')}
  - Making Charges: ₹${result.quoteA.makingChargeInr.toLocaleString('en-IN')}
  - Wastage (VA): ₹${result.quoteA.wastageValueInr.toLocaleString('en-IN')}
  - 3% GST: ₹${result.quoteA.gstAmountInr.toLocaleString('en-IN')}
  - Total Invoice: ₹${result.quoteA.totalBillInr.toLocaleString('en-IN')}
${
  result.oldGold
    ? `- Old Gold Exchange Value: ₹${result.oldGold.totalExchangeValueInr.toLocaleString('en-IN')} (${result.oldGold.netWeightGrams}g net)
- Net Cash Payable: ₹${result.netPayableWithExchangeA.toLocaleString('en-IN')}`
    : ''
}
Calculated via IndiaTools (https://indiatools-rho.vercel.app/calculators/gold-exchange-calculator)`
  }

  // Pre-generate hreflangs for SEO matching sitemap.xml
  const hreflangs = useMemo(() => {
    const list = [
      { lang: 'x-default', href: 'https://indiatools-rho.vercel.app/calculators/gold-exchange-calculator' },
      { lang: 'en', href: 'https://indiatools-rho.vercel.app/calculators/gold-exchange-calculator' },
      { lang: 'en-IN', href: 'https://indiatools-rho.vercel.app/calculators/gold-exchange-calculator' },
      { lang: 'ml', href: 'https://indiatools-rho.vercel.app/ml/tools/gold-exchange-calculator' },
      { lang: 'hi', href: 'https://indiatools-rho.vercel.app/hi/tools/gold-exchange-calculator' },
      { lang: 'ta', href: 'https://indiatools-rho.vercel.app/ta/tools/gold-exchange-calculator' },
      { lang: 'te', href: 'https://indiatools-rho.vercel.app/te/tools/gold-exchange-calculator' },
      { lang: 'kn', href: 'https://indiatools-rho.vercel.app/kn/tools/gold-exchange-calculator' },
      { lang: 'bn', href: 'https://indiatools-rho.vercel.app/bn/tools/gold-exchange-calculator' },
      { lang: 'mr', href: 'https://indiatools-rho.vercel.app/mr/tools/gold-exchange-calculator' },
      { lang: 'gu', href: 'https://indiatools-rho.vercel.app/gu/tools/gold-exchange-calculator' },
      { lang: 'pa', href: 'https://indiatools-rho.vercel.app/pa/tools/gold-exchange-calculator' },
      { lang: 'or', href: 'https://indiatools-rho.vercel.app/or/tools/gold-exchange-calculator' },
    ]
    return list
  }, [])

  const canonicalPath =
    activeLocale === 'en'
      ? '/calculators/gold-exchange-calculator'
      : `/${activeLocale}/tools/gold-exchange-calculator`

  return (
    <ToolPageLayout
      tool={tool}
      customTitle={t.title}
      customDescription={t.metaDescription}
      customH1={t.h1}
      customSubtitle={t.subtitle}
      customCanonicalPath={canonicalPath}
      hreflangs={hreflangs}
      onReset={handleReset}
      onCopyResult={getResultSummary}
      maxWidthClass="max-w-6xl"
    >
      <div className="space-y-8">
        {/* Multilingual Selector Header Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-amber-600/10 border border-amber-500/20 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                Multilingual Bullion Verification • 11 Languages
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Currently displaying in <strong>{t.localeName}</strong>. Select your preferred native language:
              </p>
            </div>
          </div>

          <LanguageSelector currentToolSlug="gold-exchange-calculator" />
        </div>

        {/* Intro Explanatory Box */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-white/10 shadow-lg text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed space-y-2">
          <p>{t.introText}</p>
        </div>

        {/* SECTION 1: Benchmark Gold Rates & Tax */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{t.labels.goldRates}</span>
            </h3>
            <span className="text-xs font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-bold">
              24K: ₹{result.rate24kPerGram} | 22K: ₹{result.rate22kPerGram}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Rate Basis */}
            <div>
              <label className="block text-xs text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                {t.labels.goldRateBasis}
              </label>
              <select
                value={rateBasis}
                onChange={(e) => setRateBasis(e.target.value as GoldRateBasis)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-semibold text-slate-900 dark:text-white"
              >
                <option value="22k">22K / 916 Standard (Most Common)</option>
                <option value="24k">24K (999 Pure Bullion)</option>
                <option value="18k">18K (750 Jewellery Standard)</option>
              </select>
            </div>

            {/* Rate per Gram */}
            <div>
              <label className="block text-xs text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                {t.labels.ratePerGram}
              </label>
              <input
                type="number"
                min="1000"
                max="50000"
                value={ratePerGram || ''}
                onChange={(e) => setRatePerGram(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-mono font-bold text-amber-600 dark:text-amber-400"
              />
            </div>

            {/* GST Percentage */}
            <div>
              <label className="block text-xs text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                {t.labels.gstRate}
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="28"
                value={gstPercent}
                onChange={(e) => setGstPercent(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-mono font-bold text-slate-900 dark:text-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Default 3% standard GST on jewellery in India</span>
            </div>
          </div>
        </div>

        {/* SECTION 2 & 3: Two Columns - Old Gold Exchange (Left) & New Jewellery Quotation (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Old Gold Exchange (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    {t.labels.oldGoldSection}
                  </h3>
                </div>
                <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={hasOldGold}
                    onChange={(e) => setHasOldGold(e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span>Exchange Old Gold</span>
                </label>
              </div>

              {hasOldGold ? (
                <div className="space-y-4">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {t.labels.oldGoldDesc}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-700 dark:text-slate-300 font-medium mb-1">
                        {t.labels.grossWeight}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={oldGrossWeight || ''}
                        onChange={(e) => setOldGrossWeight(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-mono font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-700 dark:text-slate-300 font-medium mb-1">
                        {t.labels.stoneWeight}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={oldStoneWeight || ''}
                        onChange={(e) => setOldStoneWeight(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-mono font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-700 dark:text-slate-300 font-medium mb-1">
                        {t.labels.purity}
                      </label>
                      <select
                        value={oldPurity}
                        onChange={(e) => setOldPurity(e.target.value as GoldPurity)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-xs font-semibold text-slate-900 dark:text-white"
                      >
                        <option value="22k">22K / 916 Hallmark</option>
                        <option value="24k">24K (999 Pure)</option>
                        <option value="18k">18K (750 Hallmark)</option>
                        <option value="14k">14K (585 Hallmark)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-700 dark:text-slate-300 font-medium mb-1">
                        {t.labels.deductionPct}
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="20"
                        value={oldDeductionPct}
                        onChange={(e) => setOldDeductionPct(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-mono font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Calculated Exchange Value Card */}
                  {result.oldGold && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 mt-2">
                      <div className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-300">
                        <span>{t.labels.netWeight}:</span>
                        <strong className="font-mono text-slate-900 dark:text-white">
                          {result.oldGold.netWeightGrams} g
                        </strong>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-300">
                        <span>Pure Gold Equivalent (24K):</span>
                        <strong className="font-mono text-slate-900 dark:text-white">
                          {result.oldGold.payableWeightGrams} g
                        </strong>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-amber-500/20">
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase">
                          {t.labels.exchangeValue}
                        </span>
                        <span className="text-xl font-black font-mono text-amber-600 dark:text-amber-400">
                          ₹{result.oldGold.totalExchangeValueInr.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Old gold exchange disabled. Toggle checkbox above to factor in exchange value.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: New Jewellery Purchase & Comparison (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quotation A Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    {t.labels.quoteA}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableCompare(!enableCompare)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {enableCompare ? 'Remove Comparison' : '+ Compare with Shop B'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-700 dark:text-slate-300 font-medium mb-1">
                    {t.labels.grossWeight}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newGrossA || ''}
                    onChange={(e) => setNewGrossA(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-700 dark:text-slate-300 font-medium mb-1">
                    {t.labels.stoneWeight}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newStoneA}
                    onChange={(e) => setNewStoneA(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-700 dark:text-slate-300 font-medium mb-1">
                    {t.labels.purity}
                  </label>
                  <select
                    value={newPurityA}
                    onChange={(e) => setNewPurityA(e.target.value as GoldPurity)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="22k">22K / 916 Hallmark</option>
                    <option value="18k">18K (750 Hallmark)</option>
                    <option value="24k">24K (999 Pure)</option>
                    <option value="14k">14K (585 Hallmark)</option>
                  </select>
                </div>
              </div>

              {/* Making charges & Wastage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Making charges */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{t.labels.makingCharges}</span>
                    <select
                      value={makingTypeA}
                      onChange={(e) => setMakingTypeA(e.target.value as MakingChargeType)}
                      className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700"
                    >
                      <option value="percent">Percentage (%)</option>
                      <option value="per_gram">Per Gram (₹/g)</option>
                    </select>
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={makingValA || ''}
                    onChange={(e) => setMakingValA(Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-sm font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Calculated charge: ₹{result.quoteA.makingChargeInr.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Wastage */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{t.labels.wastageCharge}</span>
                    <select
                      value={wastageTypeA}
                      onChange={(e) => setWastageTypeA(e.target.value as WastageType)}
                      className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700"
                    >
                      <option value="percent">Percentage (%)</option>
                      <option value="grams">In Grams (g)</option>
                    </select>
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={wastageValA}
                    onChange={(e) => setWastageValA(Number(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-sm font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Calculated wastage: ₹{result.quoteA.wastageValueInr.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Other itemized additions */}
              <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">{t.labels.stoneCost}</label>
                  <input
                    type="number"
                    value={newStonePriceA}
                    onChange={(e) => setNewStonePriceA(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">{t.labels.hallmarking}</label>
                  <input
                    type="number"
                    value={hallmarkA}
                    onChange={(e) => setHallmarkA(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 block mb-1">{t.labels.discount}</label>
                  <input
                    type="number"
                    value={discountA}
                    onChange={(e) => setDiscountA(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                  />
                </div>
              </div>

              {/* Quote A Summary Bill Box */}
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Metal Value ({result.quoteA.netGoldWeightGrams}g):</span>
                  <span className="font-mono font-bold">₹{result.quoteA.baseGoldValueInr.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Total Making & Wastage:</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    ₹{(result.quoteA.makingChargeInr + result.quoteA.wastageValueInr).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 dark:text-slate-400">GST ({gstPercent}%):</span>
                  <span className="font-mono font-bold">₹{result.quoteA.gstAmountInr.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-zinc-800">
                  <span className="text-xs font-bold uppercase">{t.labels.totalBill}</span>
                  <span className="text-xl font-mono font-black text-slate-900 dark:text-white">
                    ₹{result.quoteA.totalBillInr.toLocaleString('en-IN')}
                  </span>
                </div>

                {hasOldGold && result.oldGold && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex justify-between items-center mt-2">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase">
                      {t.labels.netPayable}
                    </span>
                    <span className="text-xl font-mono font-black text-emerald-600 dark:text-emerald-400">
                      ₹{result.netPayableWithExchangeA.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Optional Quotation B Comparison Card */}
            {enableCompare && (
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-indigo-500/30 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>{t.labels.quoteB}</span>
                  </h3>
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                    Side-by-Side Comparison
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">{t.labels.grossWeight}</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newGrossB}
                      onChange={(e) => setNewGrossB(Number(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">{t.labels.makingCharges} (₹/g or %)</label>
                    <input
                      type="number"
                      value={makingValB}
                      onChange={(e) => setMakingValB(Number(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">{t.labels.wastageCharge} (%)</label>
                    <input
                      type="number"
                      value={wastageValB}
                      onChange={(e) => setWastageValB(Number(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 font-mono text-sm"
                    />
                  </div>
                </div>

                {result.quoteB && (
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span>Total Invoice Quote B:</span>
                      <strong className="font-mono text-base">
                        ₹{result.quoteB.totalBillInr.toLocaleString('en-IN')}
                      </strong>
                    </div>

                    {result.savingsComparedBtoA !== null && (
                      <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs flex items-center justify-between">
                        <span>{t.labels.savingsDiff}:</span>
                        <strong
                          className={`font-mono text-sm ${
                            result.savingsComparedBtoA > 0
                              ? 'text-emerald-500'
                              : result.savingsComparedBtoA < 0
                              ? 'text-rose-500'
                              : 'text-slate-400'
                          }`}
                        >
                          {result.savingsComparedBtoA > 0
                            ? `Quote A is cheaper by ₹${result.savingsComparedBtoA.toLocaleString('en-IN')}`
                            : result.savingsComparedBtoA < 0
                            ? `Quote B is cheaper by ₹${Math.abs(result.savingsComparedBtoA).toLocaleString('en-IN')}`
                            : 'Both quotations are identical'}
                        </strong>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Warnings Section */}
        {result.warnings.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-500">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Bill Verification Advisories</span>
            </div>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc pl-5">
              {result.warnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* FAQs & Tips Accordion in Active Language */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-amber-500" />
              <span>Frequently Asked Questions & Consumer Buying Tips</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Language: {t.localeName}</span>
          </div>

          <div className="space-y-4">
            {t.faqs.map((faq, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1.5"
              >
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{faq.question}</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Consumer Protection Tips */}
          <div className="pt-4 border-t border-slate-100 dark:border-zinc-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
              Key Indian Jewellery Buying Checklist
            </h4>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-5">
              {t.tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>

          {/* Legal Disclaimer */}
          <p className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-100 dark:border-zinc-800">
            {t.labels.disclaimer}
          </p>
        </div>
      </div>
    </ToolPageLayout>
  )
}
