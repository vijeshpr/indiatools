import { describe, it } from 'node:test'
import assert from 'node:assert'
import fs from 'fs'
import path from 'path'
import {
  calculateFriendshipCost,
  calculateCommuteFuelCost,
  sanitizeNumber,
  PRESET_PROFILES,
} from '../src/lib/friendshipCostCalc.ts'
import type { FriendshipCostInputs } from '../src/lib/friendshipCostCalc.ts'
import {
  FRIENDSHIP_TOOL_I18N,
  FRIENDSHIP_LOCALES,
  ALL_FRIENDSHIP_LANG_CODES,
  getFriendshipToolTranslation,
} from '../src/i18n/friendshipCostI18n.ts'
import { TOOLS, CATEGORIES, getToolBySlug } from '../src/data/tools.ts'

describe('Friendship & Relationship Cost Calculator Suite', () => {
  // 1. MATHEMATICAL ENGINE & ACCURACY
  describe('Mathematical Calculations & Presets', () => {
    it('calculates college_besties preset accurately', () => {
      const p = PRESET_PROFILES.college_besties.inputs
      const r = calculateFriendshipCost(p)

      // Weekly meetups = 52
      // Per meetup: food 250 + activity 100 + commute 60 = 410. 410 * 52 = 21,320
      assert.strictEqual(r.categoryBreakdown.meetupsAndDining, 21320)

      // Gifts: birthday 1200 + festivals 500 + surprises 500 = 2200
      assert.strictEqual(r.categoryBreakdown.giftsAndCelebrations, 2200)

      // Trips: 1 trip * 4500 = 4500
      assert.strictEqual(r.categoryBreakdown.travelAndTrips, 4500)

      // Digital: 80 * 12 + 1000 = 1960
      assert.strictEqual(r.categoryBreakdown.digitalAndShared, 1960)

      // Total: 21320 + 2200 + 4500 + 1960 = 29980
      assert.strictEqual(r.annualCashTotal, 29980)
      assert.strictEqual(r.monthlyCashAvg, Math.round(29980 / 12))
      assert.strictEqual(r.fiveYearCashProjected, 29980 * 5)

      // Percentages sum to 100
      const sumPct =
        r.categoryPercentages.meetups +
        r.categoryPercentages.gifts +
        r.categoryPercentages.trips +
        r.categoryPercentages.digital
      assert.strictEqual(sumPct, 100)

      // Time breakdown
      // Meetup hours: 52 * 3.5 = 182
      // Commute hours: 52 * 1.0 = 52
      // Call hours: 52 * 1.5 = 78
      // Messaging hours: 365 * 0.5 = 182.5
      // Trip hours: 3 days * 8h = 24
      // Total hours: 182 + 52 + 78 + 182.5 + 24 = 518.5
      assert.strictEqual(r.timeBreakdown.meetupHoursAnnual, 182)
      assert.strictEqual(r.timeBreakdown.commuteHoursAnnual, 52)
      assert.strictEqual(r.timeBreakdown.callHoursAnnual, 78)
      assert.strictEqual(r.timeBreakdown.messagingHoursAnnual, 182.5)
      assert.strictEqual(r.timeBreakdown.tripHoursAnnual, 24)
      assert.strictEqual(r.timeBreakdown.totalHoursAnnual, 518.5)
      assert.strictEqual(r.timeBreakdown.totalDaysAnnual, Math.round((518.5 / 24) * 10) / 10)
    })

    it('calculates fuel sub-calculator correctly', () => {
      // 30 km round trip, 15 km/L mileage, ₹100/L fuel price -> 2 L * 100 = 200
      const fuelCost = calculateCommuteFuelCost(30, 15, 100)
      assert.strictEqual(fuelCost, 200)

      // Zero or negative distance
      assert.strictEqual(calculateCommuteFuelCost(0, 15, 100), 0)
      assert.strictEqual(calculateCommuteFuelCost(-20, 15, 100), 0)
      assert.strictEqual(calculateCommuteFuelCost(30, 0, 100), 0)
      assert.strictEqual(calculateCommuteFuelCost(30, 15, 0), 0)
    })

    it('incorporates custom occasions dynamically', () => {
      const customInputs: FriendshipCostInputs = {
        ...PRESET_PROFILES.college_besties.inputs,
        customOccasions: [
          { id: '1', name: 'Graduation Party', amount: 3000 },
          { id: '2', name: 'Secret Santa', amount: 1500 },
        ],
      }
      const r = calculateFriendshipCost(customInputs)
      const baseResult = calculateFriendshipCost(PRESET_PROFILES.college_besties.inputs)
      assert.strictEqual(
        r.categoryBreakdown.giftsAndCelebrations,
        baseResult.categoryBreakdown.giftsAndCelebrations + 4500
      )
    })

    it('calculates opportunity cost of time without polluting cash totals', () => {
      const inputs: FriendshipCostInputs = {
        ...PRESET_PROFILES.romantic_dating.inputs,
        hourlyRate: 600,
      }
      const r = calculateFriendshipCost(inputs)
      assert(r.opportunityCost > 0)
      assert.strictEqual(r.opportunityCost, Math.round(r.timeBreakdown.totalHoursAnnual * 600))
      // Out-of-pocket cash total MUST NOT include opportunity cost!
      const cashSum =
        r.categoryBreakdown.meetupsAndDining +
        r.categoryBreakdown.giftsAndCelebrations +
        r.categoryBreakdown.travelAndTrips +
        r.categoryBreakdown.digitalAndShared
      assert.strictEqual(r.annualCashTotal, cashSum)
      assert.strictEqual(r.totalValueWithTime, r.annualCashTotal + r.opportunityCost)
    })
  })

  // 2. EDGE CASES & SAFETY
  describe('Edge Cases & Sanitization', () => {
    it('handles all zeros safely without NaN or division by zero', () => {
      const zeroInputs: FriendshipCostInputs = {
        relationshipType: 'best_friend',
        relationshipDurationYears: 0,
        meetupFrequency: 'never',
        foodSpendPerMeetup: 0,
        activitySpendPerMeetup: 0,
        commuteSpendPerMeetup: 0,
        useFuelCalc: false,
        commuteDistanceKm: 0,
        vehicleMileageKmpl: 0,
        fuelPricePerLiter: 0,
        birthdayGift: 0,
        festivalsGifts: 0,
        anniversaryMilestone: 0,
        weddingGifts: 0,
        casualSurprises: 0,
        customOccasions: [],
        sharedSubscriptionsMonthly: 0,
        digitalDeliveriesAnnual: 0,
        tripsPerYear: 0,
        avgTripCost: 0,
        hoursPerMeetup: 0,
        travelHoursPerMeetup: 0,
        callHoursPerWeek: 0,
        messagingHoursPerDay: 0,
        tripDaysPerYear: 0,
        hourlyRate: 0,
      }

      const r = calculateFriendshipCost(zeroInputs)
      assert.strictEqual(r.annualCashTotal, 0)
      assert.strictEqual(r.monthlyCashAvg, 0)
      assert.strictEqual(r.fiveYearCashProjected, 0)
      assert.strictEqual(r.timeBreakdown.totalHoursAnnual, 0)
      assert.strictEqual(r.timeBreakdown.totalDaysAnnual, 0)
      assert.strictEqual(r.categoryPercentages.meetups, 0)
      assert.strictEqual(r.categoryPercentages.gifts, 0)
      assert.strictEqual(r.categoryPercentages.trips, 0)
      assert.strictEqual(r.categoryPercentages.digital, 0)
      assert(!Number.isNaN(r.annualCashTotal))
      assert(Number.isFinite(r.annualCashTotal))
    })

    it('sanitizes negative values to zero', () => {
      assert.strictEqual(sanitizeNumber(-500), 0)
      assert.strictEqual(sanitizeNumber(NaN), 0)
      assert.strictEqual(sanitizeNumber(Infinity), 0)
      assert.strictEqual(sanitizeNumber(1500), 1500)
    })
  })

  // 3. 22 EIGHTH SCHEDULE LANGUAGES LOCALIZATION COMPLETENESS
  describe('22 Eighth Schedule Indian Languages Localization', () => {
    const expected22Languages = [
      'as',
      'bn',
      'brx',
      'doi',
      'gu',
      'hi',
      'kn',
      'ks',
      'kok',
      'mai',
      'ml',
      'mni',
      'mr',
      'ne',
      'or',
      'pa',
      'sa',
      'sat',
      'sd',
      'ta',
      'te',
      'ur',
    ]

    it('contains all 22 official Eighth Schedule languages + English (23 total)', () => {
      assert.strictEqual(ALL_FRIENDSHIP_LANG_CODES.length, 23)
      expected22Languages.forEach((code) => {
        assert(
          ALL_FRIENDSHIP_LANG_CODES.includes(code as any),
          `Missing language code: ${code}`
        )
      })
      assert(ALL_FRIENDSHIP_LANG_CODES.includes('en'))
    })

    it('correctly sets RTL text direction for Urdu, Kashmiri, and Sindhi', () => {
      const rtlCodes = ['ur', 'ks', 'sd']
      rtlCodes.forEach((code) => {
        const t = getFriendshipToolTranslation(code)
        assert.strictEqual(t.dir, 'rtl', `Expected RTL for language ${code}`)
        assert.strictEqual(FRIENDSHIP_LOCALES[code as any].dir, 'rtl')
      })

      const ltrCodes = ['en', 'hi', 'ml', 'ta', 'te', 'kn', 'bn', 'mr', 'gu', 'pa', 'or']
      ltrCodes.forEach((code) => {
        const t = getFriendshipToolTranslation(code)
        assert.strictEqual(t.dir, 'ltr', `Expected LTR for language ${code}`)
      })
    })

    it('validates complete translation schema for every single language', () => {
      ALL_FRIENDSHIP_LANG_CODES.forEach((code) => {
        const item = FRIENDSHIP_TOOL_I18N[code]
        assert(item, `Language content missing for: ${code}`)
        assert(item.title.length > 5, `Missing title in: ${code}`)
        assert(item.metaDescription.length > 20, `Missing metaDescription in: ${code}`)
        assert(item.h1.length > 5, `Missing h1 in: ${code}`)
        assert(item.subtitle.length > 5, `Missing subtitle in: ${code}`)
        assert(item.introText.length > 20, `Missing introText in: ${code}`)

        // Labels
        assert(item.labels.annualCash.length > 0, `Missing annualCash label in: ${code}`)
        assert(item.labels.monthlyAvg.length > 0, `Missing monthlyAvg label in: ${code}`)
        assert(item.labels.downloadPngCard.length > 0, `Missing downloadPngCard label in: ${code}`)
        assert(item.labels.shareResults.length > 0, `Missing shareResults label in: ${code}`)
        assert(item.labels.copySummary.length > 0, `Missing copySummary label in: ${code}`)

        // Presets
        assert(Object.keys(item.presets).length >= 5, `Missing presets in: ${code}`)

        // Relationship type labels
        const types = [
          'best_friend',
          'close_friend',
          'romantic_partner',
          'friend_group',
          'long_distance',
          'colleague',
        ] as const
        types.forEach((typ) => {
          assert(item.relationshipTypeLabels[typ], `Missing label for ${typ} in ${code}`)
        })

        // FAQs
        assert(Array.isArray(item.faqs) && item.faqs.length > 0, `Missing FAQs in: ${code}`)
        item.faqs.forEach((faq) => {
          assert(faq.question.length > 3, `Empty FAQ question in ${code}`)
          assert(faq.answer.length > 5, `Empty FAQ answer in ${code}`)
        })
      })
    })
  })

  // 4. REGISTRY & ROUTING INTEGRITY
  describe('Tool Registry & Sitemap Integration', () => {
    it('is registered in TOOLS array as tool #65', () => {
      assert.strictEqual(TOOLS.length, 65)
      const tool = getToolBySlug('friendship-relationship-cost')
      assert(tool, 'Tool friendship-relationship-cost must exist in TOOLS')
      assert.strictEqual(tool.category, 'money')
      assert.strictEqual(tool.seo.canonicalPath, '/calculators/friendship-relationship-cost')
      assert(tool.seo.title.endsWith('| IndiaTools'))
      assert.strictEqual(CATEGORIES.money.toolCount, 10)
    })

    it('has all 23 language URLs in public/sitemap.xml', () => {
      const sitemapPath = path.resolve('public/sitemap.xml')
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf8')

      // Canonical
      assert(
        sitemapContent.includes(
          'https://indiatools-rho.vercel.app/calculators/friendship-relationship-cost'
        )
      )

      // 22 Localized URLs
      const langCodes = [
        'as',
        'bn',
        'brx',
        'doi',
        'gu',
        'hi',
        'kn',
        'ks',
        'kok',
        'mai',
        'ml',
        'mni',
        'mr',
        'ne',
        'or',
        'pa',
        'sa',
        'sat',
        'sd',
        'ta',
        'te',
        'ur',
      ]
      langCodes.forEach((code) => {
        const expected = `https://indiatools-rho.vercel.app/${code}/calculators/friendship-relationship-cost`
        assert(
          sitemapContent.includes(expected),
          `Missing localized URL in sitemap: ${expected}`
        )
      })

      // Reciprocal hreflangs
      assert(sitemapContent.includes('hreflang="x-default"'))
      assert(sitemapContent.includes('hreflang="en-IN"'))
      assert(sitemapContent.includes('hreflang="hi-IN"'))
      assert(sitemapContent.includes('hreflang="ur-IN"'))
    })
  })
})
