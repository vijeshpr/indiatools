import { describe, it } from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'

import {
  DIRECTORY_LOCALES,
  DIRECTORY_LANG_CODES,
  DIRECTORY_UI,
  DIRECTORY_TRANSLATIONS,
  getToolDestinationUrl,
  getDirectoryToolsForLocale,
  getDirectoryPageCanonical,
  getDirectoryPagePath,
  isDirectoryLangCode,
} from '../src/data/directory/index.ts'
import { TOOLS, CATEGORIES } from '../src/data/tools.ts'

describe('All IndiaTools Multilingual SEO Directory', () => {
  it('defines exactly 23 languages (22 Scheduled Indian languages + English)', () => {
    assert.strictEqual(DIRECTORY_LANG_CODES.length, 23)
    const expected = [
      'en', 'as', 'bn', 'brx', 'doi', 'gu', 'hi', 'kn', 'ks', 'kok',
      'mai', 'ml', 'mni', 'mr', 'ne', 'or', 'pa', 'sa', 'sat', 'sd',
      'ta', 'te', 'ur'
    ]
    for (const code of expected) {
      assert.ok(DIRECTORY_LANG_CODES.includes(code as any), `Missing code: ${code}`)
      assert.ok(isDirectoryLangCode(code), `isDirectoryLangCode failed for ${code}`)
    }
  })

  it('marks Urdu (ur), Kashmiri (ks), and Sindhi (sd) as RTL', () => {
    assert.strictEqual(DIRECTORY_LOCALES.ur.dir, 'rtl')
    assert.strictEqual(DIRECTORY_LOCALES.ks.dir, 'rtl')
    assert.strictEqual(DIRECTORY_LOCALES.sd.dir, 'rtl')
    assert.strictEqual(DIRECTORY_LOCALES.en.dir, 'ltr')
    assert.strictEqual(DIRECTORY_LOCALES.hi.dir, 'ltr')
    assert.strictEqual(DIRECTORY_LOCALES.ml.dir, 'ltr')
  })

  it('provides complete UI metadata (Title, H1, Meta Description, Search Placeholder) for all 23 languages', () => {
    for (const code of DIRECTORY_LANG_CODES) {
      const ui = DIRECTORY_UI[code]
      assert.ok(ui, `Missing UI for language ${code}`)
      assert.ok(ui.title && ui.title.includes('IndiaTools'), `Title missing IndiaTools for ${code}: ${ui.title}`)
      assert.ok(ui.h1 && ui.h1.length > 5, `H1 too short for ${code}`)
      assert.ok(ui.metaDescription && ui.metaDescription.length > 20, `Meta description too short for ${code}`)
      assert.ok(ui.searchPlaceholder && ui.searchPlaceholder.length > 3, `Search placeholder missing for ${code}`)
      assert.ok(ui.openToolLabel && ui.openToolLabel.length > 0, `Open tool label missing for ${code}`)
      assert.ok(ui.breadcrumbs.home && ui.breadcrumbs.directory, `Breadcrumbs missing for ${code}`)
    }
  })

  it('contains authentic translations for all 70 tools in all 23 languages without dummy text', () => {
    for (const code of DIRECTORY_LANG_CODES) {
      const dict = DIRECTORY_TRANSLATIONS[code]
      assert.ok(dict, `Missing translations dictionary for ${code}`)
      const toolKeys = Object.keys(dict)
      assert.strictEqual(toolKeys.length, 70, `Language ${code} has ${toolKeys.length} tools, expected 70`)

      for (const tool of TOOLS) {
        const item = dict[tool.slug]
        assert.ok(item, `Language ${code} missing translation for ${tool.slug}`)
        assert.ok(item.name && item.name.trim().length > 0, `Empty name for ${tool.slug} in ${code}`)
        assert.ok(item.description && item.description.trim().length > 10, `Description too short for ${tool.slug} in ${code}`)
        // Verify no placeholder strings like lorem ipsum or example
        assert.ok(!item.description.includes('lorem ipsum'), `Placeholder text detected in ${tool.slug} (${code})`)
        assert.ok(!item.description.includes('example.' + 'com'), `Placeholder domain detected in ${tool.slug} (${code})`)
      }
    }
  })

  it('destination URL router correctly directs flagship localized tools and canonical tools', () => {
    const nameSlip = TOOLS.find(t => t.slug === 'name-slip-maker')!
    const luckyDraw = TOOLS.find(t => t.slug === 'lucky-draw-team-splitter')!
    const repair = TOOLS.find(t => t.slug === 'repair-vs-replace')!
    const friendship = TOOLS.find(t => t.slug === 'friendship-relationship-cost')!
    const cheque = TOOLS.find(t => t.slug === 'indian-cheque-studio')!
    const gold = TOOLS.find(t => t.slug === 'gold-exchange-calculator')!
    const mileage = TOOLS.find(t => t.slug === 'vehicle-mileage')!

    // English canonical links
    assert.strictEqual(getToolDestinationUrl(nameSlip, 'en'), '/tools/name-slip-maker')
    assert.strictEqual(getToolDestinationUrl(luckyDraw, 'en'), '/tools/lucky-draw-team-splitter')
    assert.strictEqual(getToolDestinationUrl(repair, 'en'), '/calculators/repair-vs-replace')
    assert.strictEqual(getToolDestinationUrl(friendship, 'en'), '/calculators/friendship-relationship-cost')
    assert.strictEqual(getToolDestinationUrl(cheque, 'en'), '/calculators/indian-cheque-studio')
    assert.strictEqual(getToolDestinationUrl(gold, 'en'), '/calculators/gold-exchange-calculator')
    assert.strictEqual(getToolDestinationUrl(mileage, 'en'), '/calculators/vehicle-mileage')

    // Regional language destinations
    assert.strictEqual(getToolDestinationUrl(nameSlip, 'hi'), '/hi/tools/name-slip-maker')
    assert.strictEqual(getToolDestinationUrl(nameSlip, 'ml'), '/ml/tools/name-slip-maker')
    assert.strictEqual(getToolDestinationUrl(luckyDraw, 'ta'), '/ta/tools/lucky-draw-team-splitter')
    assert.strictEqual(getToolDestinationUrl(repair, 'bn'), '/bn/calculators/repair-vs-replace')
    assert.strictEqual(getToolDestinationUrl(friendship, 'te'), '/te/calculators/friendship-relationship-cost')

    // Cheque Studio 12 regional languages
    assert.strictEqual(getToolDestinationUrl(cheque, 'ml'), '/calculators/indian-cheque-studio/ml')
    assert.strictEqual(getToolDestinationUrl(cheque, 'hi'), '/calculators/indian-cheque-studio/hi')
    assert.strictEqual(getToolDestinationUrl(cheque, 'sat'), '/calculators/indian-cheque-studio') // fallback to canonical

    // Gold Exchange regional languages
    assert.strictEqual(getToolDestinationUrl(gold, 'ml'), '/ml/tools/gold-exchange-calculator')
    assert.strictEqual(getToolDestinationUrl(gold, 'hi'), '/hi/tools/gold-exchange-calculator')
    assert.strictEqual(getToolDestinationUrl(gold, 'ur'), '/calculators/gold-exchange-calculator') // fallback to canonical

    // Standard non-localized tools link to their canonical path safely
    assert.strictEqual(getToolDestinationUrl(mileage, 'hi'), '/calculators/vehicle-mileage')
    assert.strictEqual(getToolDestinationUrl(mileage, 'ml'), '/calculators/vehicle-mileage')
    assert.strictEqual(getToolDestinationUrl(mileage, 'ta'), '/calculators/vehicle-mileage')
  })

  it('generates correct canonical URL and path for all directory languages', () => {
    assert.strictEqual(getDirectoryPageCanonical('en'), 'https://indiatools-rho.vercel.app/all-tools')
    assert.strictEqual(getDirectoryPageCanonical('hi'), 'https://indiatools-rho.vercel.app/all-tools/hi')
    assert.strictEqual(getDirectoryPageCanonical('ml'), 'https://indiatools-rho.vercel.app/all-tools/ml')

    assert.strictEqual(getDirectoryPagePath('en'), '/all-tools')
    assert.strictEqual(getDirectoryPagePath('hi'), '/all-tools/hi')
    assert.strictEqual(getDirectoryPagePath('ml'), '/all-tools/ml')
  })

  it('getDirectoryToolsForLocale returns all 70 tools with localized name, description, and valid destinationUrl', () => {
    const mlTools = getDirectoryToolsForLocale('ml')
    assert.strictEqual(mlTools.length, 70)
    const mileage = mlTools.find(t => t.tool.slug === 'vehicle-mileage')!
    assert.ok(mileage.localizedName.includes('വാഹന മൈലേജ്'))
    assert.ok(mileage.localizedDescription.length > 10)
    assert.strictEqual(mileage.destinationUrl, '/calculators/vehicle-mileage')
  })

  it('routes for /all-tools and /all-tools/:langCode exist in src/App.tsx', () => {
    const appCode = fs.readFileSync('src/App.tsx', 'utf8')
    assert.ok(appCode.includes('path="/all-tools"'))
    assert.ok(appCode.includes('path="/all-tools/:langCode"'))
    assert.ok(appCode.includes('AllToolsDirectoryPage'))
  })

  it('Footer links to /all-tools under Language & Platform', () => {
    const footerCode = fs.readFileSync('src/components/common/Footer.tsx', 'utf8')
    assert.ok(footerCode.includes('to="/all-tools"'))
    assert.ok(footerCode.includes('All Tools in 22 Languages'))
  })

  it('sitemap.xml contains 224 total URLs including all 23 directory URLs with reciprocal hreflangs', () => {
    const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8')
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
    assert.strictEqual(locs.length, 224)

    assert.ok(locs.includes('https://indiatools-rho.vercel.app/all-tools'))
    for (const code of DIRECTORY_LANG_CODES) {
      if (code === 'en') continue
      assert.ok(locs.includes(`https://indiatools-rho.vercel.app/all-tools/${code}`))
    }
  })
})
