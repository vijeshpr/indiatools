import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { satisfyingRelaxGameTranslations } from '../src/i18n/tools/satisfyingRelaxGameI18n.ts'
import { ZenAudioEngine } from '../src/lib/zenAudio.ts'
import { TOOLS, CATEGORIES, getToolBySlug } from '../src/data/tools.ts'

describe('Satisfying Relax Game Suite', () => {
  it('should be registered in tools.ts with correct properties', () => {
    const tool = getToolBySlug('satisfying-relax-game')
    assert.ok(tool, 'Tool must be defined in tools registry')
    assert.equal(tool.slug, 'satisfying-relax-game')
    assert.equal(tool.category, 'create')
    assert.equal(tool.seo.canonicalPath, '/calculators/satisfying-relax-game')
    assert.ok(tool.title.endsWith('| IndiaTools'), 'Title should end with | IndiaTools')
    assert.equal(tool.faqs.length, 3, 'Should have 3 FAQ items')
    assert.equal(CATEGORIES.create.toolCount, 27, 'Create category toolCount must be 25')
  })

  it('should have complete translations for en, ml, hi, ta, te, kn', () => {
    const supportedLocales = ['en', 'ml', 'hi', 'ta', 'te', 'kn'] as const
    for (const loc of supportedLocales) {
      const t = satisfyingRelaxGameTranslations[loc]
      assert.ok(t, `Translations must exist for ${loc}`)
      assert.ok(t.meta.title && t.meta.title.length > 5, `Title missing for ${loc}`)
      assert.ok(t.meta.subtitle && t.meta.subtitle.length > 5, `Subtitle missing for ${loc}`)
      assert.ok(t.ui.modeBubble && t.ui.modeSand && t.ui.modeFluid, `Modes missing for ${loc}`)
      assert.ok(t.ui.themeNeon && t.ui.themePastel && t.ui.themeGold && t.ui.themeEmerald, `Themes missing for ${loc}`)
      assert.equal(t.faqs.length, 3, `Must have exactly 3 FAQs for ${loc}`)
      for (const faq of t.faqs) {
        assert.ok(faq.question && faq.question.length > 5, `FAQ question empty in ${loc}`)
        assert.ok(faq.answer && faq.answer.length > 10, `FAQ answer empty in ${loc}`)
      }
    }
  })

  it('should instantiate ZenAudioEngine interface without error', () => {
    const engine = new ZenAudioEngine()
    assert.equal(engine.getMuted(), false)
    engine.setMuted(true)
    assert.equal(engine.getMuted(), true)
    engine.setVolume(0.5)
    assert.equal(engine.getVolume(), 0.5)
  })
})
