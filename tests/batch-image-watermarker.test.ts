import { describe, it } from 'node:test'
import assert from 'node:assert'
import { TOOLS, CATEGORIES, getToolBySlug } from '../src/data/tools.ts'
import {
  calculateAnchorPosition,
  DEFAULT_TEXT_CONFIG,
  DEFAULT_LOGO_CONFIG,
  DEFAULT_EXPORT_CONFIG,
} from '../src/lib/watermarkEngine/stampRenderer.ts'
import {
  getBaseFileName,
  getExportExtension,
} from '../src/lib/watermarkEngine/zipExporter.ts'
import {
  BATCH_LOCALES,
  BATCH_TRANSLATIONS,
  getBatchWatermarkTranslation,
} from '../src/lib/watermarkEngine/i18n.ts'
import type { BatchWatermarkLocale } from '../src/lib/watermarkEngine/types.ts'

describe('Batch Image Watermarker & Multi-Stamp Engine Test Suite', () => {
  it('should be registered in tools registry with complete SEO metadata', () => {
    const tool = getToolBySlug('batch-image-watermarker')
    assert.ok(tool, 'Tool batch-image-watermarker should exist in registry')
    assert.strictEqual(tool.slug, 'batch-image-watermarker')
    assert.strictEqual(tool.category, 'create')
    assert.strictEqual(tool.type, 'image-tool')
    assert.strictEqual(tool.seo.canonicalPath, '/tools/batch-image-watermarker')
    assert.ok(tool.seo.title.endsWith('| IndiaTools'), 'Title must end with | IndiaTools')
    assert.ok(tool.seo.metaDescription.length > 50, 'Description should be descriptive')
    assert.ok(tool.searchKeywords.length >= 10, 'Search keywords should include regional phrases')
    assert.ok(tool.faqs.length >= 5, 'Must provide at least 5 FAQs')
    assert.strictEqual(CATEGORIES.create.toolCount, 23, 'Category create tool count must be 23')
    assert.strictEqual(TOOLS.length, 62, 'Total tools in registry must be 62')
  })

  describe('9-Point Magnetic Position Anchor Math', () => {
    const canvasW = 1920
    const canvasH = 1080
    const contentW = 300
    const contentH = 100
    const padX = 50
    const padY = 40

    it('should calculate top-left correctly', () => {
      const pos = calculateAnchorPosition(
        canvasW,
        canvasH,
        contentW,
        contentH,
        'top-left',
        padX,
        padY
      )
      assert.strictEqual(pos.x, 50)
      assert.strictEqual(pos.y, 40)
    })

    it('should calculate top-center correctly', () => {
      const pos = calculateAnchorPosition(
        canvasW,
        canvasH,
        contentW,
        contentH,
        'top-center',
        padX,
        padY
      )
      assert.strictEqual(pos.x, (1920 - 300) / 2) // 810
      assert.strictEqual(pos.y, 40)
    })

    it('should calculate top-right correctly', () => {
      const pos = calculateAnchorPosition(
        canvasW,
        canvasH,
        contentW,
        contentH,
        'top-right',
        padX,
        padY
      )
      assert.strictEqual(pos.x, 1920 - 300 - 50) // 1570
      assert.strictEqual(pos.y, 40)
    })

    it('should calculate middle-left correctly', () => {
      const pos = calculateAnchorPosition(
        canvasW,
        canvasH,
        contentW,
        contentH,
        'middle-left',
        padX,
        padY
      )
      assert.strictEqual(pos.x, 50)
      assert.strictEqual(pos.y, (1080 - 100) / 2) // 490
    })

    it('should calculate center correctly', () => {
      const pos = calculateAnchorPosition(
        canvasW,
        canvasH,
        contentW,
        contentH,
        'center',
        padX,
        padY
      )
      assert.strictEqual(pos.x, (1920 - 300) / 2) // 810
      assert.strictEqual(pos.y, (1080 - 100) / 2) // 490
    })

    it('should calculate bottom-right correctly', () => {
      const pos = calculateAnchorPosition(
        canvasW,
        canvasH,
        contentW,
        contentH,
        'bottom-right',
        padX,
        padY
      )
      assert.strictEqual(pos.x, 1920 - 300 - 50) // 1570
      assert.strictEqual(pos.y, 1080 - 100 - 40) // 940
    })

    it('should calculate bottom-center correctly', () => {
      const pos = calculateAnchorPosition(
        canvasW,
        canvasH,
        contentW,
        contentH,
        'bottom-center',
        padX,
        padY
      )
      assert.strictEqual(pos.x, (1920 - 300) / 2) // 810
      assert.strictEqual(pos.y, 1080 - 100 - 40) // 940
    })

    it('should calculate bottom-left correctly', () => {
      const pos = calculateAnchorPosition(
        canvasW,
        canvasH,
        contentW,
        contentH,
        'bottom-left',
        padX,
        padY
      )
      assert.strictEqual(pos.x, 50)
      assert.strictEqual(pos.y, 1080 - 100 - 40) // 940
    })
  })

  describe('Filename & Export Configuration Utilities', () => {
    it('should extract base filename correctly without extension', () => {
      assert.strictEqual(getBaseFileName('wedding_photo_01.JPG'), 'wedding_photo_01')
      assert.strictEqual(getBaseFileName('sample.name.with.dots.png'), 'sample.name.with.dots')
      assert.strictEqual(getBaseFileName('noextension'), 'noextension')
    })

    it('should determine correct export extension based on format', () => {
      assert.strictEqual(
        getExportExtension('wedding.tiff', { ...DEFAULT_EXPORT_CONFIG, format: 'original' }),
        'tiff'
      )
      assert.strictEqual(
        getExportExtension('wedding.png', { ...DEFAULT_EXPORT_CONFIG, format: 'image/jpeg' }),
        'jpg'
      )
      assert.strictEqual(
        getExportExtension('wedding.jpg', { ...DEFAULT_EXPORT_CONFIG, format: 'image/png' }),
        'png'
      )
      assert.strictEqual(
        getExportExtension('wedding.jpg', { ...DEFAULT_EXPORT_CONFIG, format: 'image/webp' }),
        'webp'
      )
    })

    it('should have valid default configurations for text, logo, and export', () => {
      assert.ok(DEFAULT_TEXT_CONFIG.text.length > 0)
      assert.strictEqual(DEFAULT_TEXT_CONFIG.anchor, 'bottom-right')
      assert.strictEqual(DEFAULT_LOGO_CONFIG.anchor, 'bottom-right')
      assert.strictEqual(DEFAULT_EXPORT_CONFIG.filenameSuffix, '_watermarked')
      assert.strictEqual(DEFAULT_EXPORT_CONFIG.quality, 0.92)
    })
  })

  describe('Multilingual Indian Localization Suite (All 7 Regional Languages)', () => {
    const requiredLocales: BatchWatermarkLocale[] = ['en', 'ml', 'hi', 'ta', 'te', 'kn', 'bn']

    it('should define all 7 regional languages in BATCH_LOCALES', () => {
      for (const loc of requiredLocales) {
        assert.ok(BATCH_LOCALES[loc], `Locale ${loc} must be defined in BATCH_LOCALES`)
        assert.ok(BATCH_LOCALES[loc].name, `Locale ${loc} must have a name`)
        assert.ok(BATCH_LOCALES[loc].nativeName, `Locale ${loc} must have a nativeName`)
      }
    })

    it('should have complete translations for all 7 languages without missing keys', () => {
      for (const loc of requiredLocales) {
        const trans = BATCH_TRANSLATIONS[loc]
        assert.ok(trans, `Translations must exist for ${loc}`)
        assert.ok(trans.title, `Title must exist for ${loc}`)
        assert.ok(trans.subtitle, `Subtitle must exist for ${loc}`)
        assert.ok(trans.badgeFree, `BadgeFree must exist for ${loc}`)
        assert.ok(trans.badgePrivacy, `BadgePrivacy must exist for ${loc}`)
        assert.ok(trans.badgeSpeed, `BadgeSpeed must exist for ${loc}`)
        assert.ok(trans.dropTitle, `DropTitle must exist for ${loc}`)
        assert.ok(trans.tabText, `TabText must exist for ${loc}`)
        assert.ok(trans.tabLogo, `TabLogo must exist for ${loc}`)
        assert.ok(trans.tabDual, `TabDual must exist for ${loc}`)
        assert.ok(trans.processBatch, `ProcessBatch must exist for ${loc}`)
        assert.ok(trans.downloadZip, `DownloadZip must exist for ${loc}`)
        assert.ok(trans.anchors.botRight, `Anchor botRight must exist for ${loc}`)
        assert.strictEqual(trans.faqs.length, 5, `Must have exactly 5 FAQs for ${loc}`)
      }
    })

    it('should fallback to English when invalid locale is requested', () => {
      // @ts-ignore
      const fallback = getBatchWatermarkTranslation('unknown-lang' as BatchWatermarkLocale)
      assert.strictEqual(fallback.title, BATCH_TRANSLATIONS.en.title)
    })
  })
})
