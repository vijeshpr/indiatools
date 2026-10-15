import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wrench,
  ShoppingBag,
  Clock,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Share2,
  Copy,
  Download,
  RotateCcw,
  Bookmark,
  Smartphone,
  Laptop,
  Refrigerator,
  Car,
  Armchair,
  Layers,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Trash2,
  ExternalLink,
  Info,
  Calendar,
  Sparkles,
  BarChart3
} from 'lucide-react'
import {
  calculateRepairVsReplace,
  RepairVsReplaceInputs,
  ItemCategory,
  Criticality,
  RiskTolerance,
  PersonalPreference,
  RepairConfidence,
  RepairVsReplaceResult,
  PRESET_SCENARIOS
} from '../lib/repairVsReplaceCalc'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useToast } from '../components/common/Toast'
import {
  REPAIR_LOCALES,
  ALL_REPAIR_LANG_CODES,
  RepairLangCode,
  isRepairLocale,
  getRepairToolTranslation
} from '../i18n/repairVsReplaceI18n'

interface SavedDecision {
  id: string
  timestamp: number
  dateStr: string
  name: string
  category: ItemCategory
  verdict: 'REPAIR' | 'REPLACE' | 'WAIT_AND_MONITOR'
  savingsAmount: number
  repairCost: number
  replacementCost: number
  inputs: RepairVsReplaceInputs
}

const STORAGE_KEY = 'indiatools_repair_replace_history'

export const RepairVsReplaceTool: React.FC = () => {
  const tool = getToolBySlug('repair-vs-replace')!
  const { langCode } = useParams<{ langCode?: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { showToast } = useToast()

  // 1. Determine active locale
  const activeLocale: RepairLangCode = useMemo(() => {
    if (langCode && isRepairLocale(langCode)) {
      return langCode as RepairLangCode
    }
    const pathSegments = location.pathname.split('/').filter(Boolean)
    if (pathSegments.length > 0 && isRepairLocale(pathSegments[0])) {
      return pathSegments[0] as RepairLangCode
    }
    return 'en'
  }, [langCode, location.pathname])

  const t = useMemo(() => getRepairToolTranslation(activeLocale), [activeLocale])
  const isRtl = t.dir === 'rtl'

  // Canonical & hreflangs
  const canonicalPath =
    activeLocale === 'en'
      ? '/calculators/repair-vs-replace'
      : `/${activeLocale}/calculators/repair-vs-replace`

  const hreflangs = useMemo(() => {
    const list = ALL_REPAIR_LANG_CODES.map((code) => ({
      lang: REPAIR_LOCALES[code].bcp47,
      href:
        code === 'en'
          ? 'https://indiatools-rho.vercel.app/calculators/repair-vs-replace'
          : `https://indiatools-rho.vercel.app/${code}/calculators/repair-vs-replace`,
    }))
    list.push({
      lang: 'x-default',
      href: 'https://indiatools-rho.vercel.app/calculators/repair-vs-replace',
    })
    return list
  }, [])

  // 2. Input state initialized with smartphone preset
  const [inputs, setInputs] = useState<RepairVsReplaceInputs>(PRESET_SCENARIOS.smartphone_screen.inputs)
  const [activePreset, setActivePreset] = useState<string>('smartphone_screen')
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [isGeneratingPng, setIsGeneratingPng] = useState<boolean>(false)
  const [showSavedModal, setShowSavedModal] = useState<boolean>(false)
  const [savedDecisions, setSavedDecisions] = useState<SavedDecision[]>([])
  const [saveTitleInput, setSaveTitleInput] = useState<string>('')
  const [showSavePrompt, setShowSavePrompt] = useState<boolean>(false)

  // Load saved decisions from localStorage
  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        setSavedDecisions(JSON.parse(data))
      }
    } catch {
      // ignore
    }
  }, [])

  // Calculate results reactively
  const results: RepairVsReplaceResult = useMemo(() => {
    return calculateRepairVsReplace(inputs)
  }, [inputs])

  // Language switch
  const handleLanguageChange = (targetLocale: RepairLangCode) => {
    const targetPath =
      targetLocale === 'en'
        ? '/calculators/repair-vs-replace'
        : `/${targetLocale}/calculators/repair-vs-replace`
    navigate(targetPath)
  }

  // Apply Preset
  const handleApplyPreset = (presetKey: string) => {
    const p = PRESET_SCENARIOS[presetKey]
    if (p) {
      setInputs(p.inputs)
      setActivePreset(presetKey)
      showToast(`${p.name} loaded`, 'info')
    }
  }

  // Reset form
  const handleReset = () => {
    setInputs(PRESET_SCENARIOS.smartphone_screen.inputs)
    setActivePreset('smartphone_screen')
    setCurrentStep(1)
    showToast(t.labels.resetAll, 'info')
  }

  // Field change helpers
  const updateInput = <K extends keyof RepairVsReplaceInputs>(field: K, value: RepairVsReplaceInputs[K]) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const handleNumberChange = (field: keyof RepairVsReplaceInputs, val: string) => {
    const num = parseFloat(val)
    updateInput(field, (isNaN(num) ? 0 : Math.max(0, num)) as never)
  }

  // Save current decision
  const handleSaveDecision = () => {
    const title = saveTitleInput.trim() || inputs.customItemName || t.categories[inputs.category]
    const newDecision: SavedDecision = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      name: title,
      category: inputs.category,
      verdict: results.verdict,
      savingsAmount: results.savingsAmount,
      repairCost: inputs.repairCost,
      replacementCost: inputs.replacementPrice,
      inputs: { ...inputs },
    }
    const updated = [newDecision, ...savedDecisions.filter(d => d.name !== title)].slice(0, 30)
    setSavedDecisions(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // ignore
    }
    setShowSavePrompt(false)
    setSaveTitleInput('')
    showToast('Decision saved successfully!', 'success')
  }

  // Delete saved decision
  const handleDeleteSaved = (id: string) => {
    const updated = savedDecisions.filter(d => d.id !== id)
    setSavedDecisions(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // ignore
    }
    showToast('Decision removed', 'info')
  }

  // Clear all saved
  const handleClearAllSaved = () => {
    if (window.confirm('Are you sure you want to delete all saved decisions?')) {
      setSavedDecisions([])
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore
      }
      showToast('All saved decisions cleared', 'info')
    }
  }

  // Load a saved decision back into state
  const handleLoadSaved = (item: SavedDecision) => {
    setInputs(item.inputs)
    setShowSavedModal(false)
    setCurrentStep(5)
    showToast(`Loaded: ${item.name}`, 'info')
  }

  // Copy Summary
  const handleCopySummary = async () => {
    const summary = `🛠️ IndiaTools Repair vs Replace Decision
Item: ${inputs.customItemName || t.categories[inputs.category]}
Verdict: ${results.verdictTitle}
Savings: ₹${results.savingsAmount.toLocaleString('en-IN')} (${results.savingsOption})
Break-Even Horizon: ${results.breakEvenMonths ? `${results.breakEvenMonths} Months` : 'N/A'}
Initial Repair: ₹${inputs.repairCost.toLocaleString('en-IN')}
New Replacement: ₹${inputs.replacementPrice.toLocaleString('en-IN')}
36-Month Repair Cost: ₹${results.horizonComparison.repairPathTotalCost.toLocaleString('en-IN')}
36-Month Replace Cost: ₹${results.horizonComparison.replacementPathTotalCost.toLocaleString('en-IN')}
Calculated at: https://indiatools-rho.vercel.app${canonicalPath}`

    try {
      await navigator.clipboard.writeText(summary)
      showToast(t.labels.copied, 'success')
    } catch {
      showToast('Could not copy to clipboard', 'info')
    }
  }

  // Web Share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t.title,
          text: `Repair vs Replace decision for ${inputs.customItemName || t.categories[inputs.category]}: ${results.verdictTitle}`,
          url: window.location.href,
        })
      } catch {
        // User cancelled or not supported
      }
    } else {
      handleCopySummary()
    }
  }

  // High-Resolution 2x Canvas PNG Generator
  const handleExportPng = () => {
    setIsGeneratingPng(true)
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const width = 800
      const height = 900
      const dpr = 2 // Retina crispness

      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)

      // Background Gradient
      const grad = ctx.createLinearGradient(0, 0, width, height)
      grad.addColorStop(0, '#090D14')
      grad.addColorStop(0.5, '#0E1726')
      grad.addColorStop(1, '#070A0F')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      // Outer Border
      ctx.strokeStyle = results.verdict === 'REPAIR' ? '#10B981' : results.verdict === 'REPLACE' ? '#F59E0B' : '#6366F1'
      ctx.lineWidth = 2
      ctx.strokeRect(16, 16, width - 32, height - 32)

      // Header Tag
      ctx.fillStyle = '#10B981'
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif'
      ctx.fillText('INDIATOOLS • DECISION ENGINE', 44, 52)

      // Title & Subtitle
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '900 24px system-ui, -apple-system, sans-serif'
      const itemName = inputs.customItemName || t.categories[inputs.category]
      ctx.fillText(`Repair vs Replace: ${itemName}`, 44, 88)

      ctx.fillStyle = '#94A3B8'
      ctx.font = '500 13px system-ui, -apple-system, sans-serif'
      ctx.fillText(`Age: ${inputs.itemAgeMonths} Months • Problem: ${inputs.problemType || 'Wear & Tear'}`, 44, 112)

      // Verdict Banner Box
      const vBg = results.verdict === 'REPAIR' ? 'rgba(16, 185, 129, 0.15)' : results.verdict === 'REPLACE' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(99, 102, 241, 0.15)'
      ctx.fillStyle = vBg
      ctx.fillRect(44, 136, width - 88, 90)
      ctx.strokeStyle = results.verdict === 'REPAIR' ? 'rgba(16, 185, 129, 0.4)' : results.verdict === 'REPLACE' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(99, 102, 241, 0.4)'
      ctx.strokeRect(44, 136, width - 88, 90)

      ctx.fillStyle = results.verdict === 'REPAIR' ? '#34D399' : results.verdict === 'REPLACE' ? '#FBBF24' : '#818CF8'
      ctx.font = '900 20px system-ui, -apple-system, sans-serif'
      ctx.fillText(results.verdictTitle, 64, 172)

      ctx.fillStyle = '#CBD5E1'
      ctx.font = '500 13px system-ui, -apple-system, sans-serif'
      ctx.fillText(`Confidence: ${results.confidenceLevel.toUpperCase()} (${results.confidenceScore}%) • Est. Savings: ₹${results.savingsAmount.toLocaleString('en-IN')}`, 64, 202)

      // 4 Metric Comparison Boxes
      const metrics = [
        {
          label: 'INITIAL OUT-OF-POCKET REPAIR',
          val: `₹${inputs.repairCost.toLocaleString('en-IN')}`,
          sub: `Failure Risk: ${results.assumedFailureProbabilityPct}%`,
          color: '#34D399',
        },
        {
          label: 'NEW REPLACEMENT COST',
          val: `₹${inputs.replacementPrice.toLocaleString('en-IN')}`,
          sub: `Less Resale: ₹${inputs.resaleValue.toLocaleString('en-IN')}`,
          color: '#FBBF24',
        },
        {
          label: '36-MONTH REPAIR LIFECYCLE',
          val: `₹${results.horizonComparison.repairPathTotalCost.toLocaleString('en-IN')}`,
          sub: `₹${results.horizonComparison.repairCostPerMonth}/mo`,
          color: '#93C5FD',
        },
        {
          label: '36-MONTH REPLACE LIFECYCLE',
          val: `₹${results.horizonComparison.replacementPathTotalCost.toLocaleString('en-IN')}`,
          sub: `₹${results.horizonComparison.replacementCostPerMonth}/mo`,
          color: '#A78BFA',
        },
      ]

      metrics.forEach((m, idx) => {
        const col = idx % 2
        const row = Math.floor(idx / 2)
        const bx = 44 + col * 364
        const by = 246 + row * 105

        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)'
        ctx.fillRect(bx, by, 348, 90)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
        ctx.strokeRect(bx, by, 348, 90)

        ctx.fillStyle = '#94A3B8'
        ctx.font = 'bold 10px system-ui, -apple-system, sans-serif'
        ctx.fillText(m.label, bx + 16, by + 26)

        ctx.fillStyle = m.color
        ctx.font = 'bold 22px system-ui, -apple-system, sans-serif'
        ctx.fillText(m.val, bx + 16, by + 56)

        ctx.fillStyle = '#64748B'
        ctx.font = '500 11px system-ui, -apple-system, sans-serif'
        ctx.fillText(m.sub, bx + 16, by + 76)
      })

      // Break-Even Section
      ctx.fillStyle = 'rgba(30, 41, 59, 0.5)'
      ctx.fillRect(44, 476, width - 88, 70)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.strokeRect(44, 476, width - 88, 70)

      ctx.fillStyle = '#F8FAFC'
      ctx.font = 'bold 14px system-ui, -apple-system, sans-serif'
      ctx.fillText(`Break-Even Period: ${results.breakEvenMonths ? `${results.breakEvenMonths} Months` : 'Immediate'}`, 64, 506)

      ctx.fillStyle = '#94A3B8'
      ctx.font = '400 12px system-ui, -apple-system, sans-serif'
      ctx.fillText(results.breakEvenExplanation, 64, 528)

      // Key Factors List
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 14px system-ui, -apple-system, sans-serif'
      ctx.fillText('Evaluation Highlights & Factors', 44, 576)

      results.keyFactors.slice(0, 4).forEach((factor, fIdx) => {
        const fy = 604 + fIdx * 28
        ctx.fillStyle = '#10B981'
        ctx.beginPath()
        ctx.arc(52, fy - 4, 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#CBD5E1'
        ctx.font = '400 12px system-ui, -apple-system, sans-serif'
        ctx.fillText(factor, 68, fy)
      })

      // Footer
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.beginPath()
      ctx.moveTo(44, 730)
      ctx.lineTo(width - 44, 730)
      ctx.stroke()

      ctx.fillStyle = '#64748B'
      ctx.font = '500 11px system-ui, -apple-system, sans-serif'
      ctx.fillText('100% Client-Side In-Browser Computation • Zero Data Tracking', 44, 755)

      ctx.fillStyle = '#D8B879'
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif'
      ctx.fillText('indiatools-rho.vercel.app', width - 200, 755)

      // Download Trigger
      const link = document.createElement('a')
      link.download = `repair-vs-replace-${inputs.category}-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      showToast('PNG Decision Card downloaded!', 'success')
    } catch (e) {
      console.error(e)
      showToast('Failed to export PNG', 'info')
    } finally {
      setIsGeneratingPng(false)
    }
  }

  // Categories list with Icons
  const categoryList: Array<{ id: ItemCategory; label: string; icon: React.ReactNode }> = [
    { id: 'smartphone', label: t.categories.smartphone, icon: <Smartphone className="w-5 h-5" /> },
    { id: 'laptop', label: t.categories.laptop, icon: <Laptop className="w-5 h-5" /> },
    { id: 'appliance', label: t.categories.appliance, icon: <Refrigerator className="w-5 h-5" /> },
    { id: 'vehicle', label: t.categories.vehicle, icon: <Car className="w-5 h-5" /> },
    { id: 'furniture', label: t.categories.furniture, icon: <Armchair className="w-5 h-5" /> },
    { id: 'other', label: t.categories.other, icon: <Layers className="w-5 h-5" /> },
  ]

  return (
    <ToolPageLayout tool={tool}>
      <div className="max-w-6xl mx-auto px-4 py-6" dir={isRtl ? 'rtl' : 'ltr'}>
        {/* Top Bar: Language Selector & Saved Decisions Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              {t.localeName} ({REPAIR_LOCALES[activeLocale]?.nativeName})
            </span>
            <span className="text-xs text-slate-500">• 23 Indian Languages</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <select
              value={activeLocale}
              onChange={(e) => handleLanguageChange(e.target.value as RepairLangCode)}
              aria-label="Select language"
              className="bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {ALL_REPAIR_LANG_CODES.map((code) => (
                <option key={code} value={code}>
                  {REPAIR_LOCALES[code].nativeName} ({REPAIR_LOCALES[code].name})
                </option>
              ))}
            </select>

            {/* Saved Decisions Button */}
            <button
              onClick={() => setShowSavedModal(true)}
              className="inline-flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
            >
              <Bookmark className="w-3.5 h-3.5 text-purple-400" />
              <span>{t.labels.savedDecisions}</span>
              {savedDecisions.length > 0 && (
                <span className="bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                  {savedDecisions.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
            {t.h1}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Preset Selector Bar */}
        <div className="mb-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
              {t.presetsTitle}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(PRESET_SCENARIOS).map(([key, p]) => (
              <button
                key={key}
                onClick={() => handleApplyPreset(key)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                  activePreset === key
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200 font-semibold'
                    : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{t.presets[key] || p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Wizard Step Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
          {[
            { num: 1, label: t.steps.step1 },
            { num: 2, label: t.steps.step2 },
            { num: 3, label: t.steps.step3 },
            { num: 4, label: t.steps.step4 },
            { num: 5, label: t.steps.results },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`text-left p-3 rounded-xl border transition text-xs ${
                currentStep === s.num
                  ? 'bg-purple-600/20 border-purple-500 text-white font-bold shadow-sm'
                  : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">
                Step 0{s.num}
              </div>
              <div className="truncate">{s.label}</div>
            </button>
          ))}
        </div>

        {/* Safety Warning Banner if Applicable */}
        {results.safetyAlert && (
          <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong className="block text-amber-300 font-semibold mb-1">SAFETY PRECAUTION:</strong>
              {results.safetyAlert}
            </div>
          </div>
        )}

        {/* STEP 1: ITEM & PROBLEM */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 mb-8"
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-purple-400" />
              {t.steps.step1}
            </h2>

            {/* Category Cards */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                {t.labels.itemCategory}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categoryList.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateInput('category', cat.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition ${
                      inputs.category === cat.id
                        ? 'bg-purple-600/20 border-purple-500 text-white font-semibold'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className={inputs.category === cat.id ? 'text-purple-400' : 'text-slate-400'}>
                      {cat.icon}
                    </div>
                    <span className="text-xs truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.labels.customItemName}
                </label>
                <input
                  type="text"
                  value={inputs.customItemName || ''}
                  onChange={(e) => updateInput('customItemName', e.target.value)}
                  placeholder="e.g. iPhone 12, LG 1.5T AC, Honda City"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.labels.problemType}
                </label>
                <input
                  type="text"
                  value={inputs.problemType || ''}
                  onChange={(e) => updateInput('problemType', e.target.value)}
                  placeholder="e.g. Broken screen, Compressor dead, Gearbox noise"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.labels.itemAgeMonths}
                </label>
                <input
                  type="number"
                  min="0"
                  max="480"
                  value={inputs.itemAgeMonths}
                  onChange={(e) => handleNumberChange('itemAgeMonths', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  ~{(inputs.itemAgeMonths / 12).toFixed(1)} years in service
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.labels.originalPrice}
                </label>
                <input
                  type="number"
                  min="0"
                  value={inputs.originalPrice}
                  onChange={(e) => handleNumberChange('originalPrice', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition"
              >
                <span>Continue to Financials</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: COSTS & FINANCIALS */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 mb-8"
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              {t.steps.step2}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide block mb-3">
                  Option A: Repair Path Outlay
                </span>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {t.labels.repairCost}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={inputs.repairCost}
                      onChange={(e) => handleNumberChange('repairCost', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        {t.labels.repairVisits}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={inputs.repairVisits}
                        onChange={(e) => handleNumberChange('repairVisits', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        {t.labels.repairDowntimeHours}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={inputs.repairDowntimeHours}
                        onChange={(e) => handleNumberChange('repairDowntimeHours', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wide block mb-3">
                  Option B: Replacement Purchase
                </span>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {t.labels.replacementPrice}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={inputs.replacementPrice}
                      onChange={(e) => handleNumberChange('replacementPrice', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        {t.labels.resaleValue}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={inputs.resaleValue}
                        onChange={(e) => handleNumberChange('resaleValue', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        {t.labels.additionalReplacementCost}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={inputs.additionalReplacementCost}
                        onChange={(e) => handleNumberChange('additionalReplacementCost', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {t.labels.hourlyRate}
              </label>
              <input
                type="number"
                min="0"
                value={inputs.hourlyRate}
                onChange={(e) => handleNumberChange('hourlyRate', e.target.value)}
                placeholder="0"
                className="w-full sm:w-1/2 bg-slate-950 border border-slate-700 focus:border-slate-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Quantifies the inconvenience of workshop trips & days without product. Kept completely separate from cash expenses.
              </span>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-slate-400 hover:text-white text-xs font-medium px-4 py-2"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition"
              >
                <span>Continue to Outlook</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: USEFUL LIFE & FUTURE OUTLOOK */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 mb-8"
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              {t.steps.step3}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl space-y-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide block">
                  Repaired Product Lifespan
                </span>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.labels.repairLifeMonths}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={inputs.repairLifeMonths}
                    onChange={(e) => handleNumberChange('repairLifeMonths', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    ~{(inputs.repairLifeMonths / 12).toFixed(1)} years expected life post-repair
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.labels.repairMonthlyMaintenance}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.repairMonthlyMaintenance}
                    onChange={(e) => handleNumberChange('repairMonthlyMaintenance', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-xl space-y-4">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wide block">
                  New Product Lifespan
                </span>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.labels.replacementLifeMonths}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="360"
                    value={inputs.replacementLifeMonths}
                    onChange={(e) => handleNumberChange('replacementLifeMonths', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    ~{(inputs.replacementLifeMonths / 12).toFixed(1)} years warranty & useful life
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.labels.replacementMonthlyMaintenance}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inputs.replacementMonthlyMaintenance}
                    onChange={(e) => handleNumberChange('replacementMonthlyMaintenance', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="text-slate-400 hover:text-white text-xs font-medium px-4 py-2"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition"
              >
                <span>Continue to Risk & Preferences</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: RISK & PREFERENCES */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 mb-8"
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              {t.steps.step4}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {t.labels.criticality}
                </label>
                <div className="space-y-2">
                  {(['essential', 'important', 'nice_to_have'] as Criticality[]).map((crit) => (
                    <button
                      key={crit}
                      onClick={() => updateInput('criticality', crit)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition ${
                        inputs.criticality === crit
                          ? 'bg-purple-600/20 border-purple-500 text-white font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {t.criticalityLevels[crit]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {t.labels.riskTolerance}
                </label>
                <div className="space-y-2">
                  {(['low', 'medium', 'high'] as RiskTolerance[]).map((risk) => (
                    <button
                      key={risk}
                      onClick={() => updateInput('riskTolerance', risk)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition ${
                        inputs.riskTolerance === risk
                          ? 'bg-purple-600/20 border-purple-500 text-white font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {t.riskToleranceLevels[risk]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {t.labels.personalPreference}
                </label>
                <div className="space-y-2">
                  {(['prefer_repair', 'neutral', 'prefer_replace'] as PersonalPreference[]).map((pref) => (
                    <button
                      key={pref}
                      onClick={() => updateInput('personalPreference', pref)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition ${
                        inputs.personalPreference === pref
                          ? 'bg-purple-600/20 border-purple-500 text-white font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {t.preferenceOptions[pref]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {t.labels.repairConfidence}
                </label>
                <div className="space-y-2">
                  {(['high', 'moderate', 'low'] as RepairConfidence[]).map((conf) => (
                    <button
                      key={conf}
                      onClick={() => updateInput('repairConfidence', conf)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition ${
                        inputs.repairConfidence === conf
                          ? 'bg-purple-600/20 border-purple-500 text-white font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {t.confidenceLevels[conf]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="text-slate-400 hover:text-white text-xs font-medium px-4 py-2"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition shadow-lg shadow-emerald-950"
              >
                <span>{t.labels.calculateButton}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 5 / RESULTS DASHBOARD */}
        {currentStep === 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 mb-12"
          >
            {/* Primary Verdict Card */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border ${
                results.verdict === 'REPAIR'
                  ? 'bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border-emerald-500/40 shadow-xl shadow-emerald-950/30'
                  : results.verdict === 'REPLACE'
                  ? 'bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-950 border-amber-500/40 shadow-xl shadow-amber-950/30'
                  : 'bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border-indigo-500/40 shadow-xl shadow-indigo-950/30'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    results.verdict === 'REPAIR'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : results.verdict === 'REPLACE'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {results.verdictTitle}
                </span>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-medium">Confidence Score</span>
                  <span className="text-sm font-bold text-white">
                    {results.confidenceScore}% ({results.confidenceLevel.toUpperCase()})
                  </span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
                {results.verdict === 'REPAIR'
                  ? t.verdicts.repairTitle
                  : results.verdict === 'REPLACE'
                  ? t.verdicts.replaceTitle
                  : t.verdicts.waitTitle}
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed max-w-3xl mb-6">
                {results.verdictSummary}
              </p>

              {/* High-level savings pill */}
              <div className="inline-flex items-center gap-2 bg-slate-950/60 border border-white/10 px-4 py-2 rounded-2xl">
                <span className="text-xs text-slate-400">Projected Advantage:</span>
                <span className="text-base font-extrabold text-emerald-400">
                  ₹{results.savingsAmount.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-400">favoring {results.savingsOption}</span>
              </div>
            </div>

            {/* Direct Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Repair Option Card */}
              <div
                className={`p-6 rounded-2xl border ${
                  results.verdict === 'REPAIR'
                    ? 'bg-slate-900/90 border-emerald-500/40 ring-1 ring-emerald-500/20'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-emerald-400" />
                    Option A: Repair Current Item
                  </h3>
                  {results.verdict === 'REPAIR' && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                      RECOMMENDED
                    </span>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                    <span className="text-xs text-slate-400">Immediate Out-of-Pocket</span>
                    <span className="text-sm font-bold text-emerald-400">
                      ₹{inputs.repairCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                    <span className="text-xs text-slate-400">Assumed Failure Risk</span>
                    <span className="text-xs font-semibold text-amber-400">
                      {results.assumedFailureProbabilityPct}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                    <span className="text-xs text-slate-400">36-Month Equalized Total</span>
                    <span className="text-sm font-extrabold text-white">
                      ₹{results.horizonComparison.repairPathTotalCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs text-slate-400">Effective Monthly Cost</span>
                    <span className="text-xs font-medium text-slate-300">
                      ₹{results.horizonComparison.repairCostPerMonth}/month
                    </span>
                  </div>
                </div>
              </div>

              {/* Replace Option Card */}
              <div
                className={`p-6 rounded-2xl border ${
                  results.verdict === 'REPLACE'
                    ? 'bg-slate-900/90 border-amber-500/40 ring-1 ring-amber-500/20'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-purple-400" />
                    Option B: Buy New Replacement
                  </h3>
                  {results.verdict === 'REPLACE' && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                      RECOMMENDED
                    </span>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                    <span className="text-xs text-slate-400">New Purchase Price</span>
                    <span className="text-sm font-bold text-purple-400">
                      ₹{inputs.replacementPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                    <span className="text-xs text-slate-400">Less Old Resale / Scrap</span>
                    <span className="text-xs font-semibold text-emerald-400">
                      -₹{inputs.resaleValue.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800/80">
                    <span className="text-xs text-slate-400">36-Month Equalized Total</span>
                    <span className="text-sm font-extrabold text-white">
                      ₹{results.horizonComparison.replacementPathTotalCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs text-slate-400">Effective Monthly Cost</span>
                    <span className="text-xs font-medium text-slate-300">
                      ₹{results.horizonComparison.replacementCostPerMonth}/month
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Break-Even Timeline & Downtime Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Break-Even Box */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">{t.labels.breakEven}</h3>
                </div>
                <div className="text-2xl font-black text-emerald-400 mb-2">
                  {results.breakEvenMonths !== null ? `${results.breakEvenMonths} Months` : 'Immediate'}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {results.breakEvenExplanation}
                </p>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        results.breakEvenMonths
                          ? (results.breakEvenMonths / Math.max(1, inputs.repairLifeMonths)) * 100
                          : 0
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>0 mos</span>
                  <span>Break-Even Target</span>
                  <span>Expected Life: {inputs.repairLifeMonths} mos</span>
                </div>
              </div>

              {/* Time Loss & Downtime Hassle Box */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white">{t.labels.timeLossTitle}</h3>
                </div>
                <div className="text-2xl font-black text-purple-400 mb-2">
                  {inputs.repairDowntimeHours} Days / Hours
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Service visits: {inputs.repairVisits} trips.
                  {inputs.hourlyRate > 0
                    ? ` Estimated personal time opportunity value: ₹${results.downtimeCost.toLocaleString('en-IN')} (kept separate from direct cash expenditure).`
                    : ' Add an optional hourly rate in Step 2 to quantify the economic value of lost time.'}
                </p>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400">
                  💡 High criticality items cause severe disruption during multi-day repairs.
                </div>
              </div>
            </div>

            {/* 36-Month Cost Comparison Bar Chart */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-bold text-white">{t.labels.horizonAnalysis}</h3>
                </div>
                <span className="text-xs text-slate-400">Equal 36-Month Timeline</span>
              </div>

              <div className="space-y-4">
                {/* Repair Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Repair Path Total</span>
                    <span className="font-bold text-emerald-400">
                      ₹{results.horizonComparison.repairPathTotalCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-lg h-5 overflow-hidden border border-slate-800 flex">
                    <div
                      className="bg-emerald-600 h-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (inputs.repairCost / Math.max(1, results.horizonComparison.repairPathTotalCost)) * 100
                        )}%`,
                      }}
                      title="Initial Repair"
                    />
                    <div
                      className="bg-amber-600/80 h-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (results.horizonComparison.repairMonthlyBreakdown.expectedFutureRepairs /
                            Math.max(1, results.horizonComparison.repairPathTotalCost)) *
                            100
                        )}%`,
                      }}
                      title="Risk-adjusted Future Repairs"
                    />
                    <div
                      className="bg-blue-600/70 h-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (results.horizonComparison.repairMonthlyBreakdown.cumulativeMaintenance /
                            Math.max(1, results.horizonComparison.repairPathTotalCost)) *
                            100
                        )}%`,
                      }}
                      title="Cumulative Maintenance"
                    />
                  </div>
                </div>

                {/* Replace Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Replacement Path Total</span>
                    <span className="font-bold text-purple-400">
                      ₹{results.horizonComparison.replacementPathTotalCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-lg h-5 overflow-hidden border border-slate-800 flex">
                    <div
                      className="bg-purple-600 h-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (results.horizonComparison.replacementMonthlyBreakdown.acquisitionNet /
                            Math.max(1, results.horizonComparison.replacementPathTotalCost)) *
                            100
                        )}%`,
                      }}
                      title="Net Acquisition"
                    />
                    <div
                      className="bg-blue-600/70 h-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (results.horizonComparison.replacementMonthlyBreakdown.cumulativeMaintenance /
                            Math.max(1, results.horizonComparison.replacementPathTotalCost)) *
                            100
                        )}%`,
                      }}
                      title="Cumulative Maintenance"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  Initial Repair
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600/80" />
                  Future Failure Risk
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                  New Acquisition (Net)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600/70" />
                  36-mo Maintenance
                </span>
              </div>
            </div>

            {/* Decision Factors & Explanation */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-3">Key Influencing Factors</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {results.keyFactors.map((kf, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-300 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{kf}</span>
                  </div>
                ))}
              </div>

              {/* 50% Rule Explanation */}
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200">
                <strong className="block text-purple-300 font-semibold mb-1">
                  {t.labels.rule50Percent}:
                </strong>
                {t.labels.rule50PercentDesc}
              </div>
            </div>

            {/* Action Bar: Export PNG, Save, Share, Reset */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportPng}
                  disabled={isGeneratingPng}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGeneratingPng ? 'Generating PNG...' : t.labels.exportPng}</span>
                </button>

                <button
                  onClick={() => setShowSavePrompt(true)}
                  className="inline-flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-semibold text-xs px-4 py-2.5 rounded-xl transition"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>{t.labels.saveDecision}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{t.labels.share}</span>
                </button>

                <button
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl transition"
                >
                  <Copy className="w-4 h-4" />
                  <span>{t.labels.copySummary}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-slate-400 hover:text-white text-xs px-3 py-2 transition"
                >
                  Modify Inputs
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 text-xs px-3 py-2 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.labels.resetAll}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Modal: Save Decision Prompt */}
        <AnimatePresence>
          {showSavePrompt && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl"
              >
                <h3 className="text-base font-bold text-white mb-2">Save This Decision</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Add a memorable title to store this decision locally on your device for future reference.
                </p>

                <input
                  type="text"
                  value={saveTitleInput}
                  onChange={(e) => setSaveTitleInput(e.target.value)}
                  placeholder={inputs.customItemName || t.categories[inputs.category]}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none mb-4"
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowSavePrompt(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDecision}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white"
                  >
                    Save to Device
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal: Saved Decisions History */}
        <AnimatePresence>
          {showSavedModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[85vh] flex flex-col"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-purple-400" />
                    <h3 className="text-base font-bold text-white">
                      {t.labels.savedDecisions} ({savedDecisions.length})
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowSavedModal(false)}
                    className="text-slate-400 hover:text-white text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="overflow-y-auto py-4 space-y-3 flex-1">
                  {savedDecisions.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 text-xs">
                      No decisions saved yet. Run a calculation and click &quot;Save This Decision&quot;.
                    </div>
                  ) : (
                    savedDecisions.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-white">{item.name}</span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                item.verdict === 'REPAIR'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : item.verdict === 'REPLACE'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-indigo-500/20 text-indigo-300'
                              }`}
                            >
                              {item.verdict}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Saved on {item.dateStr} • Repair ₹{item.repairCost.toLocaleString('en-IN')} vs Replace ₹{item.replacementCost.toLocaleString('en-IN')}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleLoadSaved(item)}
                            className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-medium border border-purple-500/30"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => handleDeleteSaved(item.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {savedDecisions.length > 0 && (
                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                    <button
                      onClick={handleClearAllSaved}
                      className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                    >
                      Clear All History
                    </button>
                    <button
                      onClick={() => setShowSavedModal(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                    >
                      Close
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Informational SEO Content & FAQs */}
        <div className="mt-12 space-y-8 border-t border-slate-800 pt-8">
          {/* How It Works Explainer */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-400" />
              {t.labels.howItWorks}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
              When deciding whether to repair or replace an item in India, upfront estimates often mask hidden secondary costs. IndiaTools employs a multi-factor mathematical decision model:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <strong className="block text-emerald-400 font-semibold mb-1">1. The 50% Rule</strong>
                If repair cost exceeds 50% of the replacement price AND item has surpassed 50% of typical category life, replacement is flagged.
              </div>
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <strong className="block text-purple-400 font-semibold mb-1">2. 36-Month Lifecycle</strong>
                Normalizes both paths across a 3-year baseline, accounting for future failure probabilities and ongoing monthly upkeep.
              </div>
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <strong className="block text-amber-400 font-semibold mb-1">3. Inconvenience Separation</strong>
                Workshop trips and downtime days are evaluated through an optional time opportunity cost, keeping your pure cash outlays transparent.
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {t.faqs.map((faq, i) => (
                <div key={i} className="border-b border-slate-800/80 pb-3 last:border-b-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-200 mb-1">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Privacy & Disclaimer Notice */}
          <div className="text-center text-[11px] text-slate-500 py-4">
            <p className="mb-1">{t.labels.privacyNotice}</p>
            <p>{t.labels.disclaimer}</p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
export default RepairVsReplaceTool
