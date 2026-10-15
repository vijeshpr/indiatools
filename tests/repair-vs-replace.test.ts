import { describe, it } from 'node:test'
import assert from 'node:assert'
import fs from 'fs'
import path from 'path'
import {
  calculateRepairVsReplace,
  estimateFailureProbability,
  sanitizeNumber,
  PRESET_SCENARIOS,
  CATEGORY_LIFESPANS_MONTHS
} from '../src/lib/repairVsReplaceCalc.ts'
import type {
  RepairVsReplaceInputs,
  ItemCategory,
  Criticality,
  RiskTolerance,
  PersonalPreference,
  RepairConfidence
} from '../src/lib/repairVsReplaceCalc.ts'
import {
  REPAIR_TOOL_I18N,
  REPAIR_LOCALES,
  ALL_REPAIR_LANG_CODES,
  getRepairToolTranslation
} from '../src/i18n/repairVsReplaceI18n.ts'
import { TOOLS, CATEGORIES, getToolBySlug } from '../src/data/tools.ts'

describe('Repair vs Replace Decision Engine Test Suite', () => {
  // 1. MATHEMATICAL ENGINE & PRESET VERIFICATION
  describe('Mathematical Model & Presets', () => {
    it('calculates smartphone_screen preset accurately (favors REPAIR)', () => {
      const p = PRESET_SCENARIOS.smartphone_screen.inputs
      const r = calculateRepairVsReplace(p)

      assert.strictEqual(r.initialRepairCost, p.repairCost)
      assert.strictEqual(r.verdict, 'REPAIR')
      assert.strictEqual(r.savingsOption, 'REPAIR')
      assert.ok(r.savingsAmount > 0)
      assert.ok(r.breakEvenMonths !== null && r.breakEvenMonths > 0)
      assert.strictEqual(r.horizonComparison.horizonMonths, 36)
      assert.ok(r.horizonComparison.repairPathTotalCost < r.horizonComparison.replacementPathTotalCost)
    })

    it('calculates laptop_motherboard preset accurately (high cost/failure risk favors REPLACE)', () => {
      const p = PRESET_SCENARIOS.laptop_motherboard.inputs
      const r = calculateRepairVsReplace(p)

      // Repair is 17500 vs 52000, 54 months old (past typical 60 mo life), high failure risk (50%+)
      assert.ok(r.assumedFailureProbabilityPct >= 40)
      assert.ok(r.verdict === 'REPLACE' || r.verdict === 'WAIT_AND_MONITOR')
      assert.ok(r.horizonComparison.replacementPathTotalCost > 0)
    })

    it('triggers structural / mechanical vehicle safety alert for vehicle accidents', () => {
      const p: RepairVsReplaceInputs = {
        ...PRESET_SCENARIOS.car_clutch_gearbox.inputs,
        problemType: 'accidental structural chassis damage'
      }
      const r = calculateRepairVsReplace(p)

      assert.ok(r.safetyAlert !== undefined && r.safetyAlert.length > 0)
      assert.ok(r.safetyAlert.toLowerCase().includes('vehicle'))
    })

    it('calculates sofa_re_upholstery preset accurately', () => {
      const p = PRESET_SCENARIOS.sofa_re_upholstery.inputs
      const r = calculateRepairVsReplace(p)

      assert.strictEqual(r.verdict, 'REPAIR')
      assert.strictEqual(r.savingsOption, 'REPAIR')
      assert.ok(r.savingsAmount > 5000)
    })

    it('evaluates The 50% Rule threshold accurately', () => {
      const inputs: RepairVsReplaceInputs = {
        category: 'appliance',
        itemAgeMonths: 90, // 90 / 120 = 75% of lifespan (> 50%)
        originalPrice: 35000,
        resaleValue: 2000,
        repairCost: 24000, // 24000 / 40000 = 60% of replacement (> 50%)
        repairDowntimeHours: 48,
        repairVisits: 2,
        repairLifeMonths: 12,
        replacementLifeMonths: 120,
        replacementPrice: 40000,
        additionalReplacementCost: 1000,
        repairMonthlyMaintenance: 200,
        replacementMonthlyMaintenance: 50,
        criticality: 'important',
        hourlyRate: 500,
        handlingTimeHours: 4,
        riskTolerance: 'low',
        personalPreference: 'neutral',
        repairConfidence: 'moderate'
      }

      const r = calculateRepairVsReplace(inputs)
      assert.strictEqual(r.verdict, 'REPLACE')
      assert.ok(r.keyFactors.some(f => f.includes('50%')))
    })

    it('strictly separates downtime opportunity cost from out-of-pocket cash', () => {
      const inputs: RepairVsReplaceInputs = {
        ...PRESET_SCENARIOS.smartphone_screen.inputs,
        hourlyRate: 500,
        repairVisits: 3,
        repairDowntimeHours: 48,
      }
      const r = calculateRepairVsReplace(inputs)

      // Cash costs should not have hourlyRate added
      assert.strictEqual(r.initialRepairCost, inputs.repairCost)
      // Downtime cost should be calculated separately
      assert.ok(r.downtimeCost > 0)
    })
  })

  // 2. INPUT SANITIZATION & EDGE CASES
  describe('Input Sanitization & Edge Cases', () => {
    it('handles negative or invalid number inputs gracefully', () => {
      assert.strictEqual(sanitizeNumber(-500), 0)
      assert.strictEqual(sanitizeNumber(NaN), 0)
      assert.strictEqual(sanitizeNumber(Infinity), 0)
      assert.strictEqual(sanitizeNumber(5000, 0, 10000), 5000)
    })

    it('handles zero repair cost safely', () => {
      const inputs: RepairVsReplaceInputs = {
        ...PRESET_SCENARIOS.smartphone_screen.inputs,
        repairCost: 0
      }
      const r = calculateRepairVsReplace(inputs)
      assert.strictEqual(r.verdict, 'REPAIR')
      assert.strictEqual(r.initialRepairCost, 0)
      assert.strictEqual(r.breakEvenMonths, 0)
    })

    it('handles zero replacement price safely', () => {
      const inputs: RepairVsReplaceInputs = {
        ...PRESET_SCENARIOS.smartphone_screen.inputs,
        replacementPrice: 0,
        repairCost: 5000
      }
      const r = calculateRepairVsReplace(inputs)
      // If replacement is free (0 cost), replacing is mathematically cheaper
      assert.strictEqual(r.verdict, 'REPLACE')
    })
  })

  // 3. I18N COMPLETENESS & 23 LANGUAGES
  describe('Multilingual I18n Completeness (23 Languages)', () => {
    it('has exactly 23 languages configured in REPAIR_LOCALES and REPAIR_TOOL_I18N', () => {
      assert.strictEqual(Object.keys(REPAIR_LOCALES).length, 23)
      assert.strictEqual(Object.keys(REPAIR_TOOL_I18N).length, 23)
      assert.strictEqual(ALL_REPAIR_LANG_CODES.length, 23)
    })

    it('sets RTL direction strictly for Urdu (ur), Kashmiri (ks), and Sindhi (sd)', () => {
      assert.strictEqual(REPAIR_LOCALES.ur.dir, 'rtl')
      assert.strictEqual(REPAIR_LOCALES.ks.dir, 'rtl')
      assert.strictEqual(REPAIR_LOCALES.sd.dir, 'rtl')

      assert.strictEqual(REPAIR_TOOL_I18N.ur.dir, 'rtl')
      assert.strictEqual(REPAIR_TOOL_I18N.ks.dir, 'rtl')
      assert.strictEqual(REPAIR_TOOL_I18N.sd.dir, 'rtl')

      // Other languages are LTR
      assert.strictEqual(REPAIR_LOCALES.en.dir, 'ltr')
      assert.strictEqual(REPAIR_LOCALES.hi.dir, 'ltr')
      assert.strictEqual(REPAIR_LOCALES.ml.dir, 'ltr')
      assert.strictEqual(REPAIR_LOCALES.ta.dir, 'ltr')
    })

    it('contains all required UI keys across every language dictionary', () => {
      const requiredKeys = ['title', 'metaDescription', 'h1', 'subtitle', 'steps', 'categories', 'labels', 'verdicts', 'faqs']

      for (const lang of ALL_REPAIR_LANG_CODES) {
        const trans = getRepairToolTranslation(lang)
        for (const k of requiredKeys) {
          assert.ok(trans[k as keyof typeof trans] !== undefined, `Language "${lang}" missing key "${k}"`)
        }
        assert.ok(trans.faqs.length >= 1, `Language "${lang}" missing FAQs`)
      }
    })
  })

  // 4. REGISTRY, ROUTING & SITEMAP INTEGRATION
  describe('Registry & Production Architecture', () => {
    it('is registered in TOOLS array as tool #66', () => {
      assert.strictEqual(TOOLS.length, 66)
      const tool = getToolBySlug('repair-vs-replace')
      assert.ok(tool !== undefined, 'repair-vs-replace not found in TOOLS')
      assert.strictEqual(tool.category, 'money')
      assert.strictEqual(tool.type, 'calculator')
      assert.strictEqual(tool.seo.canonicalPath, '/calculators/repair-vs-replace')
      assert.ok(tool.seo.title.endsWith('| IndiaTools'), 'Title must end with | IndiaTools')
    })

    it('has CATEGORIES.money.toolCount set to 11', () => {
      assert.strictEqual(CATEGORIES.money.toolCount, 11)
    })

    it('is mapped in ToolDetailPage.tsx TOOL_COMPONENTS', () => {
      const pageCode = fs.readFileSync('src/pages/ToolDetailPage.tsx', 'utf8')
      assert.ok(pageCode.includes("'repair-vs-replace': RepairVsReplaceTool"))
    })

    it('has redirect route registered in App.tsx', () => {
      const appCode = fs.readFileSync('src/App.tsx', 'utf8')
      assert.ok(appCode.includes('/tools/repair-vs-replace'))
    })

    it('sitemap.xml contains 147 URLs including all 23 Repair vs Replace URLs', () => {
      const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8')
      const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
      assert.strictEqual(locs.length, 147)

      // Canonical URL
      assert.ok(locs.includes('https://indiatools-rho.vercel.app/calculators/repair-vs-replace'))

      // All 22 regional language URLs
      for (const code of ALL_REPAIR_LANG_CODES) {
        if (code === 'en') continue
        const regionalUrl = `https://indiatools-rho.vercel.app/${code}/calculators/repair-vs-replace`
        assert.ok(locs.includes(regionalUrl), `Missing regional URL in sitemap: ${regionalUrl}`)
      }
    })

    it('prerender.cjs handles repair-vs-replace localized routes', () => {
      const prerenderCode = fs.readFileSync('scripts/prerender.cjs', 'utf8')
      assert.ok(prerenderCode.includes("urlPath.includes('repair-vs-replace')"))
    })
  })
})
