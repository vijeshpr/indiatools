import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  Users,
  GraduationCap,
  Globe,
  Briefcase,
  IndianRupee,
  Clock,
  Calendar,
  Gift,
  Coffee,
  Plane,
  Smartphone,
  Fuel,
  Sparkles,
  Download,
  Share2,
  Copy,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Info,
  Flame,
  PieChart as PieChartIcon,
} from 'lucide-react'
import {
  calculateFriendshipCost,
  FriendshipCostInputs,
  RelationshipType,
  Frequency,
  CustomOccasion,
  PRESET_PROFILES,
} from '../lib/friendshipCostCalc'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'
import { useToast } from '../components/common/Toast'
import {
  FRIENDSHIP_LOCALES,
  ALL_FRIENDSHIP_LANG_CODES,
  FriendshipLangCode,
  isFriendshipLocale,
  getFriendshipToolTranslation,
} from '../i18n/friendshipCostI18n'

export const FriendshipRelationshipCostTool: React.FC = () => {
  const tool = getToolBySlug('friendship-relationship-cost')!
  const { langCode } = useParams<{ langCode?: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { showToast } = useToast()

  // 1. Determine active locale
  const activeLocale: FriendshipLangCode = useMemo(() => {
    if (langCode && isFriendshipLocale(langCode)) {
      return langCode as FriendshipLangCode
    }
    const pathSegments = location.pathname.split('/').filter(Boolean)
    if (pathSegments.length > 0 && isFriendshipLocale(pathSegments[0])) {
      return pathSegments[0] as FriendshipLangCode
    }
    return 'en'
  }, [langCode, location.pathname])

  const t = useMemo(() => getFriendshipToolTranslation(activeLocale), [activeLocale])
  const isRtl = t.dir === 'rtl'

  // Canonical & hreflangs
  const canonicalPath =
    activeLocale === 'en'
      ? '/calculators/friendship-relationship-cost'
      : `/${activeLocale}/calculators/friendship-relationship-cost`

  const hreflangs = useMemo(() => {
    const list = ALL_FRIENDSHIP_LANG_CODES.map((code) => ({
      lang: FRIENDSHIP_LOCALES[code].bcp47,
      href:
        code === 'en'
          ? 'https://indiatools-rho.vercel.app/calculators/friendship-relationship-cost'
          : `https://indiatools-rho.vercel.app/${code}/calculators/friendship-relationship-cost`,
    }))
    list.push({
      lang: 'x-default',
      href: 'https://indiatools-rho.vercel.app/calculators/friendship-relationship-cost',
    })
    return list
  }, [])

  // 2. State initialized with college_besties preset
  const [inputs, setInputs] = useState<FriendshipCostInputs>(
    PRESET_PROFILES.college_besties.inputs
  )
  const [activePreset, setActivePreset] = useState<string>('college_besties')
  const [customOccasionName, setCustomOccasionName] = useState<string>('')
  const [customOccasionAmount, setCustomOccasionAmount] = useState<number | ''>('')
  const [isGeneratingPng, setIsGeneratingPng] = useState<boolean>(false)

  // Recalculate results in real time
  const results = useMemo(() => calculateFriendshipCost(inputs), [inputs])

  // Language switch handler
  const handleLanguageChange = (targetLocale: FriendshipLangCode) => {
    const targetPath =
      targetLocale === 'en'
        ? '/calculators/friendship-relationship-cost'
        : `/${targetLocale}/calculators/friendship-relationship-cost`
    navigate(targetPath)
  }

  // Preset switch handler
  const handleApplyPreset = (presetId: string) => {
    const preset = PRESET_PROFILES[presetId]
    if (preset) {
      setInputs(preset.inputs)
      setActivePreset(presetId)
      showToast(`${t.presets[presetId] || preset.name} applied`, 'info')
    }
  }

  // Reset handler
  const handleReset = () => {
    setInputs(PRESET_PROFILES.college_besties.inputs)
    setActivePreset('college_besties')
    setCustomOccasionName('')
    setCustomOccasionAmount('')
    showToast(t.labels.resetAll, 'info')
  }

  // Add custom occasion
  const handleAddCustomOccasion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customOccasionName.trim() || !customOccasionAmount || Number(customOccasionAmount) <= 0) {
      return
    }
    const newOccasion: CustomOccasion = {
      id: `custom_${Date.now()}`,
      name: customOccasionName.trim(),
      amount: Number(customOccasionAmount),
    }
    setInputs((prev) => ({
      ...prev,
      customOccasions: [...prev.customOccasions, newOccasion],
    }))
    setCustomOccasionName('')
    setCustomOccasionAmount('')
    showToast(`Added "${newOccasion.name}"`, 'success')
  }

  // Remove custom occasion
  const handleRemoveCustomOccasion = (id: string) => {
    setInputs((prev) => ({
      ...prev,
      customOccasions: prev.customOccasions.filter((o) => o.id !== id),
    }))
  }

  // Text summary generator for clipboard / share
  const getSummaryText = (): string => {
    const typeLabel = t.relationshipTypeLabels[inputs.relationshipType] || inputs.relationshipType
    return [
      `🤝 ${t.h1} (${t.title.split('–')[0].trim()})`,
      `• Relationship: ${typeLabel} (${inputs.relationshipDurationYears} yrs)`,
      `• Annual Cash Invested: ₹${results.annualCashTotal.toLocaleString('en-IN')}`,
      `• Monthly Average: ₹${results.monthlyCashAvg.toLocaleString('en-IN')}/mo`,
      `• Annual Time Invested: ${results.timeBreakdown.totalHoursAnnual} Hours (~${results.timeBreakdown.totalDaysAnnual} Days)`,
      `• Category Breakdown:`,
      `   - Food & Hangouts: ₹${results.categoryBreakdown.meetupsAndDining.toLocaleString('en-IN')} (${results.categoryPercentages.meetups}%)`,
      `   - Gifts & Celebrations: ₹${results.categoryBreakdown.giftsAndCelebrations.toLocaleString('en-IN')} (${results.categoryPercentages.gifts}%)`,
      `   - Trips & Travel: ₹${results.categoryBreakdown.travelAndTrips.toLocaleString('en-IN')} (${results.categoryPercentages.trips}%)`,
      `   - Digital & Subscriptions: ₹${results.categoryBreakdown.digitalAndShared.toLocaleString('en-IN')} (${results.categoryPercentages.digital}%)`,
      results.opportunityCost > 0
        ? `• Time Opportunity Value: ₹${results.opportunityCost.toLocaleString('en-IN')} (at ₹${inputs.hourlyRate}/hr)`
        : '',
      `\nCalculate yours at https://indiatools-rho.vercel.app/calculators/friendship-relationship-cost`,
    ]
      .filter(Boolean)
      .join('\n')
  }

  // Copy summary to clipboard
  const handleCopySummary = async () => {
    const summary = getSummaryText()
    try {
      await navigator.clipboard.writeText(summary)
      showToast('Summary copied to clipboard!', 'success')
    } catch {
      showToast('Failed to copy to clipboard', 'error')
    }
  }

  // Web Share API
  const handleShare = async () => {
    const summary = getSummaryText()
    if (navigator.share) {
      try {
        await navigator.share({
          title: t.title,
          text: summary,
          url: window.location.href,
        })
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopySummary()
        }
      }
    } else {
      handleCopySummary()
    }
  }

  // Client-Side Canvas PNG Generation
  const handleDownloadPng = () => {
    setIsGeneratingPng(true)
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dpr = 2
      const width = 800
      const height = 960

      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)

      // Background Gradient
      const grad = ctx.createLinearGradient(0, 0, width, height)
      grad.addColorStop(0, '#06130D')
      grad.addColorStop(0.5, '#0A1E15')
      grad.addColorStop(1, '#081710')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      // Card Border Glow
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)'
      ctx.lineWidth = 2
      ctx.strokeRect(20, 20, width - 40, height - 40)

      // Inner Accent Glow Ring
      ctx.strokeStyle = 'rgba(216, 184, 121, 0.25)'
      ctx.lineWidth = 1
      ctx.strokeRect(28, 28, width - 56, height - 56)

      // Brand Header
      ctx.fillStyle = '#10B981'
      ctx.font = 'bold 13px system-ui, -apple-system, sans-serif'
      ctx.fillText('INDIATOOLS • FINANCIAL MINDFULNESS', 50, 65)

      ctx.fillStyle = '#FFFFFF'
      ctx.font = '900 24px system-ui, -apple-system, sans-serif'
      ctx.fillText('Friendship & Relationship Cost Summary', 50, 100)

      // Relationship Subtitle
      const typeLabel = t.relationshipTypeLabels[inputs.relationshipType] || inputs.relationshipType
      ctx.fillStyle = '#D8B879'
      ctx.font = '600 15px system-ui, -apple-system, sans-serif'
      ctx.fillText(
        `${typeLabel} • ${inputs.relationshipDurationYears} Years Tenure`,
        50,
        130
      )

      // Divider
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.beginPath()
      ctx.moveTo(50, 150)
      ctx.lineTo(width - 50, 150)
      ctx.stroke()

      // 4 Key Metric Boxes
      const metrics = [
        {
          label: 'TOTAL ANNUAL CASH',
          val: `₹${results.annualCashTotal.toLocaleString('en-IN')}`,
          color: '#10B981',
        },
        {
          label: 'AVERAGE MONTHLY',
          val: `₹${results.monthlyCashAvg.toLocaleString('en-IN')}`,
          color: '#34D399',
        },
        {
          label: 'HOURS INVESTED',
          val: `${results.timeBreakdown.totalHoursAnnual} hrs`,
          color: '#FBBF24',
        },
        {
          label: 'EQUIVALENT FULL DAYS',
          val: `${results.timeBreakdown.totalDaysAnnual} days`,
          color: '#A78BFA',
        },
      ]

      metrics.forEach((m, idx) => {
        const col = idx % 2
        const row = Math.floor(idx / 2)
        const bx = 50 + col * 360
        const by = 180 + row * 110

        // Box background
        ctx.fillStyle = 'rgba(14, 38, 27, 0.85)'
        ctx.fillRect(bx, by, 340, 90)
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)'
        ctx.strokeRect(bx, by, 340, 90)

        ctx.fillStyle = '#94A3B8'
        ctx.font = 'bold 11px system-ui, -apple-system, sans-serif'
        ctx.fillText(m.label, bx + 18, by + 30)

        ctx.fillStyle = m.color
        ctx.font = 'bold 28px system-ui, -apple-system, sans-serif'
        ctx.fillText(m.val, bx + 18, by + 68)
      })

      // Section: Expense Breakdown
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 16px system-ui, -apple-system, sans-serif'
      ctx.fillText('Expense Distribution by Category', 50, 440)

      const categories = [
        {
          name: 'Hangouts, Food & Dining',
          amount: results.categoryBreakdown.meetupsAndDining,
          pct: results.categoryPercentages.meetups,
          color: '#10B981',
        },
        {
          name: 'Gifts, Festivals & Celebrations',
          amount: results.categoryBreakdown.giftsAndCelebrations,
          pct: results.categoryPercentages.gifts,
          color: '#F59E0B',
        },
        {
          name: 'Getaways, Trips & Travel',
          amount: results.categoryBreakdown.travelAndTrips,
          pct: results.categoryPercentages.trips,
          color: '#38BDF8',
        },
        {
          name: 'Digital Communication & Treats',
          amount: results.categoryBreakdown.digitalAndShared,
          pct: results.categoryPercentages.digital,
          color: '#A855F7',
        },
      ]

      categories.forEach((cat, idx) => {
        const cy = 480 + idx * 70
        ctx.fillStyle = '#CBD5E1'
        ctx.font = '14px system-ui, -apple-system, sans-serif'
        ctx.fillText(cat.name, 50, cy)

        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 14px system-ui, -apple-system, sans-serif'
        const valText = `₹${cat.amount.toLocaleString('en-IN')} (${cat.pct}%)`
        ctx.fillText(valText, width - 50 - ctx.measureText(valText).width, cy)

        // Progress track
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
        ctx.fillRect(50, cy + 10, width - 100, 12)

        // Progress bar fill
        ctx.fillStyle = cat.color
        const fillW = Math.max(4, Math.round(((width - 100) * cat.pct) / 100))
        ctx.fillRect(50, cy + 10, fillW, 12)
      })

      // Opportunity Cost Callout (if active)
      if (results.opportunityCost > 0) {
        ctx.fillStyle = 'rgba(168, 85, 247, 0.12)'
        ctx.fillRect(50, 770, width - 100, 56)
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)'
        ctx.strokeRect(50, 770, width - 100, 56)

        ctx.fillStyle = '#C084FC'
        ctx.font = 'bold 12px system-ui, -apple-system, sans-serif'
        ctx.fillText(
          `TIME OPPORTUNITY VALUE: ₹${results.opportunityCost.toLocaleString('en-IN')}`,
          70,
          795
        )
        ctx.fillStyle = '#94A3B8'
        ctx.font = '11px system-ui, -apple-system, sans-serif'
        ctx.fillText(
          'Theoretical economic value of invested hours (kept separate from cash spent).',
          70,
          813
        )
      }

      // Footer Disclaimer
      ctx.fillStyle = '#64748B'
      ctx.font = 'italic 11px system-ui, -apple-system, sans-serif'
      ctx.fillText(
        'Priceless bonds, mindful budgeting • 100% Client-Side Privacy • https://indiatools-rho.vercel.app',
        50,
        height - 50
      )

      // Date Stamp
      const dateStr = new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
      ctx.fillText(dateStr, width - 50 - ctx.measureText(dateStr).width, height - 50)

      // Trigger download
      canvas.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `friendship-cost-${inputs.relationshipType}-${Date.now()}.png`
        a.click()
        URL.revokeObjectURL(url)
        showToast('PNG Report Card downloaded!', 'success')
      }, 'image/png')
    } catch (err) {
      showToast('Error generating PNG card', 'error')
    } finally {
      setIsGeneratingPng(false)
    }
  }

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
      onCopyResult={getSummaryText}
      maxWidthClass="max-w-6xl"
    >
      <div className={`space-y-8 ${isRtl ? 'rtl' : 'ltr'}`} dir={t.dir}>
        {/* ================= 1. MULTILINGUAL SELECTOR HEADER ================= */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-600/10 border border-emerald-500/20 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                22 Eighth Schedule Indian Languages + English
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Active Language: <strong>{t.localeName}</strong>. Select your native language:
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={activeLocale}
              onChange={(e) => handleLanguageChange(e.target.value as FriendshipLangCode)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-500/30 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {ALL_FRIENDSHIP_LANG_CODES.map((code) => {
                const meta = FRIENDSHIP_LOCALES[code]
                return (
                  <option key={code} value={code}>
                    {meta.nativeName} ({meta.name})
                  </option>
                )
              })}
            </select>
          </div>
        </div>

        {/* ================= 2. INTRO BOX & QUICK PRESETS ================= */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-white/10 shadow-lg text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed space-y-4">
          <p>{t.introText}</p>

          <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-2.5">
              ⚡ {t.presetsTitle}
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.keys(PRESET_PROFILES).map((key) => {
                const isActive = activePreset === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleApplyPreset(key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-600'
                    }`}
                  >
                    {key === 'college_besties' && <GraduationCap className="w-3.5 h-3.5" />}
                    {key === 'romantic_dating' && <Heart className="w-3.5 h-3.5" />}
                    {key === 'long_distance' && <Plane className="w-3.5 h-3.5" />}
                    {key === 'friend_group' && <Users className="w-3.5 h-3.5" />}
                    {key === 'colleague' && <Briefcase className="w-3.5 h-3.5" />}
                    <span>{t.presets[key] || PRESET_PROFILES[key].name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ================= 3. MAIN FORM INPUTS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN: Profile + Hangouts & Dining + Trips */}
          <div className="space-y-6">
            {/* 1. Profile Section */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
                <span>{t.labels.profile}</span>
              </h3>

              {/* Relationship Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {t.labels.relationshipType}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(
                    [
                      'best_friend',
                      'close_friend',
                      'romantic_partner',
                      'friend_group',
                      'long_distance',
                      'colleague',
                    ] as RelationshipType[]
                  ).map((type) => {
                    const isSelected = inputs.relationshipType === type
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setInputs((prev) => ({ ...prev, relationshipType: type }))
                          setActivePreset('')
                        }}
                        className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                            : 'bg-slate-50 dark:bg-zinc-950/60 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-400 hover:border-emerald-500/30'
                        }`}
                      >
                        <span className="block truncate mb-1">
                          {t.relationshipTypeLabels[type] || type}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 self-end" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Known Duration */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.labels.durationYears}
                </label>
                <input
                  type="number"
                  min="0.1"
                  max="70"
                  step="0.5"
                  value={inputs.relationshipDurationYears}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      relationshipDurationYears: Number(e.target.value) || 1,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-semibold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* 2. Hangouts, Dining & Commute Section */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Coffee className="w-4 h-4 text-amber-500" />
                <span>{t.labels.meetupsSection}</span>
              </h3>

              {/* Meetup Frequency */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.labels.meetupFrequency}
                </label>
                <select
                  value={inputs.meetupFrequency}
                  onChange={(e) => {
                    setInputs((prev) => ({
                      ...prev,
                      meetupFrequency: e.target.value as Frequency,
                    }))
                    setActivePreset('')
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-semibold text-slate-900 dark:text-white"
                >
                  {(
                    [
                      'weekly',
                      'biweekly',
                      'monthly',
                      'bimonthly',
                      'quarterly',
                      'biannual',
                      'annual',
                      'never',
                    ] as Frequency[]
                  ).map((freq) => (
                    <option key={freq} value={freq}>
                      {t.frequencyLabels[freq] || freq}
                    </option>
                  ))}
                </select>
              </div>

              {/* Per Meetup Costs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                    {t.labels.foodDining}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={inputs.foodSpendPerMeetup}
                    onChange={(e) => {
                      setInputs((prev) => ({
                        ...prev,
                        foodSpendPerMeetup: Number(e.target.value) || 0,
                      }))
                      setActivePreset('')
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                    {t.labels.entertainmentActivities}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={inputs.activitySpendPerMeetup}
                    onChange={(e) => {
                      setInputs((prev) => ({
                        ...prev,
                        activitySpendPerMeetup: Number(e.target.value) || 0,
                      }))
                      setActivePreset('')
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Commute / Fuel Calculator */}
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inputs.useFuelCalc}
                      onChange={(e) =>
                        setInputs((prev) => ({
                          ...prev,
                          useFuelCalc: e.target.checked,
                        }))
                      }
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span>{t.labels.useFuelCalc}</span>
                  </label>
                </div>

                {inputs.useFuelCalc ? (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950/80 border border-emerald-500/20 space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                          {t.labels.distanceKm}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={inputs.commuteDistanceKm}
                          onChange={(e) =>
                            setInputs((prev) => ({
                              ...prev,
                              commuteDistanceKm: Number(e.target.value) || 0,
                            }))
                          }
                          className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                          {t.labels.mileageKmpl}
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={inputs.vehicleMileageKmpl}
                          onChange={(e) =>
                            setInputs((prev) => ({
                              ...prev,
                              vehicleMileageKmpl: Number(e.target.value) || 1,
                            }))
                          }
                          className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                          {t.labels.fuelPrice}
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={inputs.fuelPricePerLiter}
                          onChange={(e) =>
                            setInputs((prev) => ({
                              ...prev,
                              fuelPricePerLiter: Number(e.target.value) || 100,
                            }))
                          }
                          className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-xs font-semibold"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-between">
                      <span>{t.labels.fuelCostPerTrip}:</span>
                      <span>₹{results.fuelCostPerMeetup}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                      {t.labels.commuteTravel}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="20"
                      value={inputs.commuteSpendPerMeetup}
                      onChange={(e) => {
                        setInputs((prev) => ({
                          ...prev,
                          commuteSpendPerMeetup: Number(e.target.value) || 0,
                        }))
                        setActivePreset('')
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 3. Trips & Vacations */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Plane className="w-4 h-4 text-sky-500" />
                <span>{t.labels.tripsSection}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                    {t.labels.tripsPerYear}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={inputs.tripsPerYear}
                    onChange={(e) => {
                      setInputs((prev) => ({
                        ...prev,
                        tripsPerYear: Number(e.target.value) || 0,
                      }))
                      setActivePreset('')
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                    {t.labels.avgTripCost}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={inputs.avgTripCost}
                    onChange={(e) => {
                      setInputs((prev) => ({
                        ...prev,
                        avgTripCost: Number(e.target.value) || 0,
                      }))
                      setActivePreset('')
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Gifts + Digital + Time Investment */}
          <div className="space-y-6">
            {/* 4. Gifts, Celebrations & Custom Occasions */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Gift className="w-4 h-4 text-pink-500" />
                <span>{t.labels.giftsSection}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                    {t.labels.birthdayGift}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={inputs.birthdayGift}
                    onChange={(e) => {
                      setInputs((prev) => ({
                        ...prev,
                        birthdayGift: Number(e.target.value) || 0,
                      }))
                      setActivePreset('')
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                    {t.labels.festivalsGifts}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={inputs.festivalsGifts}
                    onChange={(e) => {
                      setInputs((prev) => ({
                        ...prev,
                        festivalsGifts: Number(e.target.value) || 0,
                      }))
                      setActivePreset('')
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                    {t.labels.anniversaryMilestone}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={inputs.anniversaryMilestone}
                    onChange={(e) => {
                      setInputs((prev) => ({
                        ...prev,
                        anniversaryMilestone: Number(e.target.value) || 0,
                      }))
                      setActivePreset('')
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                    {t.labels.casualSurprises}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={inputs.casualSurprises}
                    onChange={(e) => {
                      setInputs((prev) => ({
                        ...prev,
                        casualSurprises: Number(e.target.value) || 0,
                      }))
                      setActivePreset('')
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Custom Occasions List */}
              {inputs.customOccasions.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
                  {inputs.customOccasions.map((occ) => (
                    <div
                      key={occ.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-zinc-950/80 border border-slate-200 dark:border-zinc-800 text-xs"
                    >
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {occ.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          ₹{occ.amount}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomOccasion(occ.id)}
                          className="text-red-500 hover:text-red-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Custom Occasion Form */}
              <form
                onSubmit={handleAddCustomOccasion}
                className="pt-2 flex flex-col sm:flex-row items-center gap-2"
              >
                <input
                  type="text"
                  placeholder={t.labels.customOccasionName}
                  value={customOccasionName}
                  onChange={(e) => setCustomOccasionName(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-xs"
                />
                <input
                  type="number"
                  placeholder={t.labels.customOccasionAmount}
                  value={customOccasionAmount}
                  onChange={(e) =>
                    setCustomOccasionAmount(e.target.value ? Number(e.target.value) : '')
                  }
                  className="w-28 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-xs"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.labels.addCustomOccasion}</span>
                </button>
              </form>
            </div>

            {/* 5. Digital Communication & Shared Treats */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-500" />
                <span>{t.labels.digitalSection}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                    {t.labels.sharedSubscriptions}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={inputs.sharedSubscriptionsMonthly}
                    onChange={(e) => {
                      setInputs((prev) => ({
                        ...prev,
                        sharedSubscriptionsMonthly: Number(e.target.value) || 0,
                      }))
                      setActivePreset('')
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                    {t.labels.digitalDeliveries}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={inputs.digitalDeliveriesAnnual}
                    onChange={(e) => {
                      setInputs((prev) => ({
                        ...prev,
                        digitalDeliveriesAnnual: Number(e.target.value) || 0,
                      }))
                      setActivePreset('')
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* 6. Time Investment & Opportunity Cost */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>{t.labels.timeSection}</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                    {t.labels.hoursPerMeetup}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={inputs.hoursPerMeetup}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        hoursPerMeetup: Number(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                    {t.labels.callHoursWeek}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={inputs.callHoursPerWeek}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        callHoursPerWeek: Number(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                    {t.labels.tripDaysYear}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="365"
                    value={inputs.tripDaysPerYear}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        tripDaysPerYear: Number(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Optional Hourly Rate */}
              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t.labels.hourlyRateOptional}
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={inputs.hourlyRate || ''}
                  placeholder="e.g. 500"
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      hourlyRate: Number(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-semibold text-slate-900 dark:text-white"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {t.labels.hourlyRateDesc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 4. REAL-TIME RESULTS DASHBOARD ================= */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0E261B] to-[#07130E] border border-emerald-500/30 shadow-2xl text-white space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-white/10 gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400 block mb-1">
                {t.labels.resultsTitle}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {t.relationshipTypeLabels[inputs.relationshipType]} • {inputs.relationshipDurationYears} Years
              </h2>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={isGeneratingPng}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isGeneratingPng ? 'Generating...' : t.labels.downloadPngCard}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all flex items-center gap-1.5 border border-white/15 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t.labels.shareResults}</span>
              </button>

              <button
                type="button"
                onClick={handleCopySummary}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all flex items-center gap-1.5 border border-white/15 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{t.labels.copySummary}</span>
              </button>
            </div>
          </div>

          {/* 4 Hero Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-emerald-500/30">
              <span className="text-xs font-medium text-emerald-300 block mb-1">
                {t.labels.annualCash}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                ₹{results.annualCashTotal.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Direct out-of-pocket spend
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-teal-500/30">
              <span className="text-xs font-medium text-teal-300 block mb-1">
                {t.labels.monthlyAvg}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-teal-300">
                ₹{results.monthlyCashAvg.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Monthly social allocation
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-amber-500/30">
              <span className="text-xs font-medium text-amber-300 block mb-1">
                {t.labels.totalHours}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-400">
                {results.timeBreakdown.totalHoursAnnual}h
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                ~{results.timeBreakdown.totalDaysAnnual} {t.labels.totalDays}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-purple-500/30">
              <span className="text-xs font-medium text-purple-300 block mb-1">
                {t.labels.fiveYearProjected}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-purple-300">
                ₹{results.fiveYearCashProjected.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                5-year cumulative horizon
              </span>
            </div>
          </div>

          {/* Category Breakdown & Progress Bars */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-emerald-400" />
              <span>{t.labels.categoryBreakdown}</span>
            </h3>

            <div className="space-y-4">
              {/* Category 1: Hangouts & Dining */}
              <div>
                <div className="flex justify-between text-xs sm:text-sm font-semibold mb-1">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    {t.labels.meetupsDiningShare}
                  </span>
                  <span>
                    ₹{results.categoryBreakdown.meetupsAndDining.toLocaleString('en-IN')} (
                    {results.categoryPercentages.meetups}%)
                  </span>
                </div>
                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${results.categoryPercentages.meetups}%` }}
                  />
                </div>
              </div>

              {/* Category 2: Gifts & Celebrations */}
              <div>
                <div className="flex justify-between text-xs sm:text-sm font-semibold mb-1">
                  <span className="text-amber-400 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    {t.labels.giftsShare}
                  </span>
                  <span>
                    ₹{results.categoryBreakdown.giftsAndCelebrations.toLocaleString('en-IN')} (
                    {results.categoryPercentages.gifts}%)
                  </span>
                </div>
                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${results.categoryPercentages.gifts}%` }}
                  />
                </div>
              </div>

              {/* Category 3: Trips & Travel */}
              <div>
                <div className="flex justify-between text-xs sm:text-sm font-semibold mb-1">
                  <span className="text-sky-400 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
                    {t.labels.tripsShare}
                  </span>
                  <span>
                    ₹{results.categoryBreakdown.travelAndTrips.toLocaleString('en-IN')} (
                    {results.categoryPercentages.trips}%)
                  </span>
                </div>
                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${results.categoryPercentages.trips}%` }}
                  />
                </div>
              </div>

              {/* Category 4: Digital Communication */}
              <div>
                <div className="flex justify-between text-xs sm:text-sm font-semibold mb-1">
                  <span className="text-purple-400 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                    {t.labels.digitalShare}
                  </span>
                  <span>
                    ₹{results.categoryBreakdown.digitalAndShared.toLocaleString('en-IN')} (
                    {results.categoryPercentages.digital}%)
                  </span>
                </div>
                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${results.categoryPercentages.digital}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Time Opportunity Cost Callout (when hourly rate is set) */}
          {results.opportunityCost > 0 && (
            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-start gap-3 text-xs sm:text-sm">
              <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-purple-300 block">
                  {t.labels.opportunityCost}: ₹{results.opportunityCost.toLocaleString('en-IN')}
                </span>
                <p className="text-slate-300 text-xs">{t.labels.opportunityCostNotice}</p>
              </div>
            </div>
          )}

          {/* Emotional Perspective & Health Tips */}
          <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs sm:text-sm text-slate-300 space-y-2">
            <p className="font-medium text-emerald-200">
              💡 {t.labels.emotionalPerspective}
            </p>
            <p className="text-slate-400 text-xs">
              {t.labels.relationshipHealthTip}
            </p>
          </div>
        </div>

        {/* ================= 5. FREQUENTLY ASKED QUESTIONS ================= */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-500" />
            <span>Frequently Asked Questions</span>
          </h3>

          <div className="space-y-3">
            {t.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 cursor-pointer"
              >
                <summary className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white list-none flex items-center justify-between">
                  <span>{faq.question}</span>
                  <span className="text-emerald-500 text-sm group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
