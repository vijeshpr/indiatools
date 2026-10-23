import { describe, it } from 'node:test'
import assert from 'node:assert'
import fs from 'fs'
import {
  SLIP_TEMPLATES,
  SLIP_SIZE_SPECS,
  calculateA4Layout,
  generateFlattenedSlips,
  generateSvgKidAvatar,
  performClientBgRemoval,
  StudentProfile
} from '../src/lib/nameSlipEngine.ts'
import {
  NAME_SLIP_TOOL_I18N,
  NAME_SLIP_LOCALES,
  ALL_NAME_SLIP_LANG_CODES,
  getNameSlipTranslation
} from '../src/i18n/nameSlipI18n.ts'
import { TOOLS, CATEGORIES, getToolBySlug } from '../src/data/tools.ts'

describe('Name Slip Maker for Kids Test Suite', () => {
  // 1. TEMPLATES & DESIGN SPECS
  describe('Templates and Presets', () => {
    it('defines exactly 12 premium kid-friendly templates', () => {
      assert.strictEqual(SLIP_TEMPLATES.length, 12)
    })

    it('all templates have unique IDs and required color properties', () => {
      const ids = new Set<string>()
      for (const t of SLIP_TEMPLATES) {
        assert.ok(t.id, 'Template must have an id')
        assert.ok(!ids.has(t.id), `Duplicate template id: ${t.id}`)
        ids.add(t.id)

        assert.ok(t.name, `Template ${t.id} must have a name`)
        assert.ok(t.defaultPrimary.startsWith('#'), `Template ${t.id} must have hex defaultPrimary`)
        assert.ok(t.defaultSecondary.startsWith('#'), `Template ${t.id} must have hex defaultSecondary`)
        assert.ok(t.defaultText.startsWith('#'), `Template ${t.id} must have hex defaultText`)
        assert.ok(t.defaultBorderColor.startsWith('#'), `Template ${t.id} must have hex defaultBorderColor`)
        assert.ok(t.headerBg.length > 5, `Template ${t.id} must have headerBg gradient`)
      }
    })

    it('supports required themes: space, dino, unicorn, superhero, ocean, minimal, floral, robot, sports, teddy, crayon, heritage', () => {
      const templateIds = SLIP_TEMPLATES.map(t => t.id)
      const expectedThemes = [
        'space_astronaut',
        'safari_dino',
        'rainbow_unicorn',
        'superhero_action',
        'ocean_marine',
        'modern_minimal',
        'floral_sweet',
        'tech_robot',
        'sports_allstar',
        'woodland_teddy',
        'crayon_doodle',
        'heritage_scholar'
      ]
      for (const theme of expectedThemes) {
        assert.ok(templateIds.includes(theme), `Missing expected template: ${theme}`)
      }
    })
  })

  // 2. A4 PRINT & PACKING ENGINE
  describe('A4 Layout Packing Engine', () => {
    it('defines correct specifications for small, medium, and large labels', () => {
      assert.strictEqual(SLIP_SIZE_SPECS.small.slipsPerPage, 21)
      assert.strictEqual(SLIP_SIZE_SPECS.small.cols, 3)
      assert.strictEqual(SLIP_SIZE_SPECS.small.rows, 7)

      assert.strictEqual(SLIP_SIZE_SPECS.medium.slipsPerPage, 10)
      assert.strictEqual(SLIP_SIZE_SPECS.medium.cols, 2)
      assert.strictEqual(SLIP_SIZE_SPECS.medium.rows, 5)

      assert.strictEqual(SLIP_SIZE_SPECS.large.slipsPerPage, 8)
      assert.strictEqual(SLIP_SIZE_SPECS.large.cols, 2)
      assert.strictEqual(SLIP_SIZE_SPECS.large.rows, 4)
    })

    it('calculates page count correctly across different slip quantities', () => {
      const makeStudents = (totalCount: number): StudentProfile[] => [
        {
          id: 'test-1',
          fullName: 'Test Student',
          className: 'IV',
          section: 'A',
          schoolName: 'Public School',
          rollNumber: '1',
          bloodGroup: 'B+',
          parentPhone: '9876543210',
          subject: 'Maths',
          customLabel: '',
          customValue: '',
          copiesCount: totalCount
        }
      ]

      // Small: 21 per page
      const layoutSmall1 = calculateA4Layout(makeStudents(10), 'small')
      assert.strictEqual(layoutSmall1.totalPages, 1)

      const layoutSmall2 = calculateA4Layout(makeStudents(21), 'small')
      assert.strictEqual(layoutSmall2.totalPages, 1)

      const layoutSmall3 = calculateA4Layout(makeStudents(22), 'small')
      assert.strictEqual(layoutSmall3.totalPages, 2)

      const layoutSmall4 = calculateA4Layout(makeStudents(45), 'small')
      assert.strictEqual(layoutSmall4.totalPages, 3)

      // Medium: 10 per page
      const layoutMed1 = calculateA4Layout(makeStudents(10), 'medium')
      assert.strictEqual(layoutMed1.totalPages, 1)

      const layoutMed2 = calculateA4Layout(makeStudents(15), 'medium')
      assert.strictEqual(layoutMed2.totalPages, 2)

      // Large: 8 per page
      const layoutLarge1 = calculateA4Layout(makeStudents(8), 'large')
      assert.strictEqual(layoutLarge1.totalPages, 1)

      const layoutLarge2 = calculateA4Layout(makeStudents(9), 'large')
      assert.strictEqual(layoutLarge2.totalPages, 2)
    })

    it('generates flattened slips correctly for multi-student jobs', () => {
      const student1: StudentProfile = {
        id: 's1',
        fullName: 'Aarav Sharma',
        className: 'IV',
        section: 'B',
        rollNumber: '14',
        schoolName: 'Delhi Public School',
        subject: 'Mathematics',
        parentPhone: '9876543210',
        bloodGroup: 'O+',
        customLabel: '',
        customValue: '',
        copiesCount: 5
      }

      const student2: StudentProfile = {
        id: 's2',
        fullName: 'Diya Patel',
        className: 'II',
        section: 'A',
        rollNumber: '08',
        schoolName: 'Kendriya Vidyalaya',
        subject: 'Environmental Studies',
        parentPhone: '9123456780',
        bloodGroup: 'B+',
        customLabel: '',
        customValue: '',
        copiesCount: 3
      }

      const flattened = generateFlattenedSlips([student1, student2])
      assert.strictEqual(flattened.length, 8)

      // First 5 should be student1
      for (let i = 0; i < 5; i++) {
        assert.strictEqual(flattened[i].student.fullName, 'Aarav Sharma')
        assert.strictEqual(flattened[i].copyNumber, i + 1)
        assert.strictEqual(flattened[i].globalIndex, i)
      }

      // Next 3 should be student2
      for (let i = 5; i < 8; i++) {
        assert.strictEqual(flattened[i].student.fullName, 'Diya Patel')
        assert.strictEqual(flattened[i].copyNumber, i - 4)
        assert.strictEqual(flattened[i].globalIndex, i)
      }
    })
  })

  // 3. AVATAR GENERATOR & FALLBACK
  describe('Avatar & Image Fallbacks', () => {
    it('generates a valid SVG kid avatar with student name initials', () => {
      const avatarUri = generateSvgKidAvatar('Aditi Nair', '#EC4899', 'circle')
      assert.ok(avatarUri.startsWith('data:image/svg+xml;utf8,'))
      const decoded = decodeURIComponent(avatarUri)
      assert.ok(decoded.includes('<svg'))
      assert.ok(decoded.includes('A')) // Initial of Aditi Nair
    })

    it('generates SVG kid avatar with single name initial', () => {
      const avatarUri = generateSvgKidAvatar('Rohan', '#3B82F6', 'square')
      const decoded = decodeURIComponent(avatarUri)
      assert.ok(decoded.includes('<svg'))
      assert.ok(decoded.includes('R'))
    })

    it('handles client-side background removal graceful fallback', async () => {
      const res = await performClientBgRemoval('')
      assert.strictEqual(res.success, false)
      assert.strictEqual(res.dataUrl, '')
    })
  })

  // 4. MULTILINGUAL 23-LANGUAGE I18N
  describe('Multilingual 23-Language Localization', () => {
    it('defines translations for all 23 languages (English + 22 8th Schedule languages)', () => {
      assert.strictEqual(ALL_NAME_SLIP_LANG_CODES.length, 23)
      assert.strictEqual(Object.keys(NAME_SLIP_TOOL_I18N).length, 23)
      assert.strictEqual(Object.keys(NAME_SLIP_LOCALES).length, 23)
    })

    it('all languages have complete required metadata and structure', () => {
      for (const code of ALL_NAME_SLIP_LANG_CODES) {
        const trans = NAME_SLIP_TOOL_I18N[code]
        assert.ok(trans, `Missing translation entry for: ${code}`)
        assert.ok(trans.title.endsWith('| IndiaTools'), `Title for ${code} must end with "| IndiaTools"`)
        assert.ok(trans.metaDescription.length > 50, `Meta description too short for: ${code}`)
        assert.ok(trans.h1.length > 5, `H1 missing or too short for: ${code}`)
        assert.ok(trans.subtitle.length > 10, `Subtitle too short for: ${code}`)

        // Labels
        assert.ok(trans.labels.studentName, `Missing studentName label for: ${code}`)
        assert.ok(trans.labels.classSection, `Missing classSection label for: ${code}`)
        assert.ok(trans.labels.schoolName, `Missing schoolName label for: ${code}`)
        assert.ok(trans.labels.rollNo, `Missing rollNo label for: ${code}`)
        assert.ok(trans.labels.copies, `Missing copies label for: ${code}`)
        assert.ok(trans.labels.printButton, `Missing printButton label for: ${code}`)
        assert.ok(trans.labels.downloadPdf, `Missing downloadPdf label for: ${code}`)
        assert.ok(trans.labels.privacyBadge, `Missing privacyBadge label for: ${code}`)

        // Steps
        assert.ok(trans.steps.details, `Missing steps.details for: ${code}`)
        assert.ok(trans.steps.template, `Missing steps.template for: ${code}`)
        assert.ok(trans.steps.arrange, `Missing steps.arrange for: ${code}`)
        assert.ok(trans.steps.print, `Missing steps.print for: ${code}`)

        // FAQs
        assert.ok(Array.isArray(trans.faqs) && trans.faqs.length >= 1, `Expected at least 1 FAQ for: ${code}`)
      }
    })

    it('correctly configures RTL text direction for Urdu, Kashmiri, and Sindhi', () => {
      assert.strictEqual(NAME_SLIP_TOOL_I18N['ur'].dir, 'rtl')
      assert.strictEqual(NAME_SLIP_TOOL_I18N['ks'].dir, 'rtl')
      assert.strictEqual(NAME_SLIP_TOOL_I18N['sd'].dir, 'rtl')

      // Other Indian languages should be LTR
      assert.strictEqual(NAME_SLIP_TOOL_I18N['hi'].dir, 'ltr')
      assert.strictEqual(NAME_SLIP_TOOL_I18N['ml'].dir, 'ltr')
      assert.strictEqual(NAME_SLIP_TOOL_I18N['ta'].dir, 'ltr')
      assert.strictEqual(NAME_SLIP_TOOL_I18N['en'].dir, 'ltr')
    })

    it('getNameSlipTranslation falls back gracefully to English', () => {
      const fallback = getNameSlipTranslation('xyz')
      assert.strictEqual(fallback.h1, NAME_SLIP_TOOL_I18N['en'].h1)
    })
  })

  // 5. REGISTRY & ROUTING INTEGRATION
  describe('IndiaTools Registry Integration', () => {
    it('registers name-slip-maker as Tool #68 in TOOLS registry', () => {
      assert.strictEqual(TOOLS.length, 71)
      const tool = getToolBySlug('name-slip-maker')
      assert.ok(tool, 'Tool name-slip-maker must be registered')
      assert.strictEqual(tool.slug, 'name-slip-maker')
      assert.strictEqual(tool.type, 'image-tool')
      assert.strictEqual(tool.category, 'create')
      assert.strictEqual(tool.seo.canonicalPath, '/tools/name-slip-maker')
      assert.ok(tool.seo.title.endsWith('| IndiaTools'))
    })

    it('updates create category toolCount to 30', () => {
      assert.strictEqual(CATEGORIES.create.toolCount, 30)
    })

    it('sitemap.xml contains 225 production URLs including all 23 localized name-slip-maker entries', () => {
      const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8')
      const matches = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
      assert.strictEqual(matches.length, 225)

      assert.ok(sitemap.includes('https://indiatools-rho.vercel.app/tools/name-slip-maker'))
      for (const code of ALL_NAME_SLIP_LANG_CODES) {
        if (code === 'en') continue
        assert.ok(sitemap.includes(`https://indiatools-rho.vercel.app/${code}/tools/name-slip-maker`))
      }
    })
  })
})
