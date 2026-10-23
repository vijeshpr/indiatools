import { describe, it } from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'
import { TOOLS, CATEGORIES, getToolBySlug } from '../src/data/tools.ts'
import { runTeleaInpainting } from '../src/lib/inpainting/teleaInpainter.ts'
import { MaskHistoryManager } from '../src/lib/inpainting/historyStack.ts'
import {
  INPAINTING_LOCALES,
  INPAINTING_TRANSLATIONS,
  getInpaintingTranslation,
} from '../src/lib/inpainting/i18n.ts'
import type { InpaintingLocale } from '../src/lib/inpainting/types.ts'
import { INPAINTING_SEO_LANGUAGES, INPAINTING_SEO_LANG_CODES } from '../src/data/inpaintingSeoData.ts'

// Polyfill ImageData for headless test environment if missing
if (typeof globalThis.ImageData === 'undefined') {
  // @ts-ignore
  globalThis.ImageData = class ImageData {
    data: Uint8ClampedArray
    width: number
    height: number
    constructor(
      dataOrWidth: Uint8ClampedArray | number,
      widthOrHeight: number,
      maybeHeight?: number
    ) {
      if (typeof dataOrWidth === 'number') {
        this.width = dataOrWidth
        this.height = widthOrHeight
        this.data = new Uint8ClampedArray(this.width * this.height * 4)
      } else {
        this.data = dataOrWidth
        this.width = widthOrHeight
        this.height = maybeHeight || dataOrWidth.length / (4 * widthOrHeight)
      }
    }
  }
}

describe('Fast Inpainting Watermark Remover & Object Eraser Test Suite', () => {
  it('should be registered in tools registry with complete SEO metadata', () => {
    const tool = getToolBySlug('fast-inpainting-watermark-remover')
    assert.ok(tool, 'Tool fast-inpainting-watermark-remover must exist in registry')
    assert.strictEqual(tool.slug, 'fast-inpainting-watermark-remover')
    assert.strictEqual(tool.category, 'create')
    assert.strictEqual(tool.type, 'image-tool')
    assert.strictEqual(tool.seo.canonicalPath, '/tools/fast-inpainting-watermark-remover')
    assert.ok(tool.seo.title.endsWith('| IndiaTools'), 'Title must end with | IndiaTools')
    assert.ok(tool.seo.metaDescription.length > 50, 'Description should be descriptive')
    assert.ok(tool.searchKeywords.length >= 10, 'Search keywords should include regional phrases')
    assert.ok(tool.faqs.length >= 5, 'Must provide at least 5 FAQs')
    assert.strictEqual(CATEGORIES.create.toolCount, 30, 'Category create tool count must be 30')
    assert.strictEqual(TOOLS.length, 71, 'Total tools in registry must be 71')
  })

  describe('Alexandru Telea Fast Marching Inpainting Algorithm', () => {
    it('should return original image when mask is completely empty', async () => {
      const width = 16
      const height = 16
      const sourceData = new Uint8ClampedArray(width * height * 4)
      const maskData = new Uint8ClampedArray(width * height * 4)

      // Fill with blue background
      for (let i = 0; i < width * height; i++) {
        sourceData[i * 4] = 30
        sourceData[i * 4 + 1] = 144
        sourceData[i * 4 + 2] = 255
        sourceData[i * 4 + 3] = 255
      }

      const srcImg = new ImageData(sourceData, width, height)
      const maskImg = new ImageData(maskData, width, height)

      const result = await runTeleaInpainting(srcImg, maskImg, 3)
      assert.strictEqual(result.width, width)
      assert.strictEqual(result.height, height)
      // First pixel blue check
      assert.strictEqual(result.data[0], 30)
      assert.strictEqual(result.data[1], 144)
      assert.strictEqual(result.data[2], 255)
    })

    it('should inpaint masked central region from surrounding background pixels', async () => {
      const width = 20
      const height = 20
      const sourceData = new Uint8ClampedArray(width * height * 4)
      const maskData = new Uint8ClampedArray(width * height * 4)

      // Solid emerald background: rgb(16, 185, 129)
      for (let i = 0; i < width * height; i++) {
        sourceData[i * 4] = 16
        sourceData[i * 4 + 1] = 185
        sourceData[i * 4 + 2] = 129
        sourceData[i * 4 + 3] = 255
      }

      // Mark a 6x6 square in center as black watermark
      for (let y = 7; y <= 12; y++) {
        for (let x = 7; x <= 12; x++) {
          const idx = (y * width + x) * 4
          sourceData[idx] = 0 // corrupted black watermark
          sourceData[idx + 1] = 0
          sourceData[idx + 2] = 0

          maskData[idx] = 255 // mask red channel active
          maskData[idx + 3] = 255
        }
      }

      const srcImg = new ImageData(sourceData, width, height)
      const maskImg = new ImageData(maskData, width, height)

      let progressCalled = false
      const result = await runTeleaInpainting(srcImg, maskImg, 4, (p) => {
        if (p.percent > 0) progressCalled = true
      })

      assert.ok(progressCalled, 'Progress callback should be invoked during inpainting')

      // Check center pixel (10, 10) - it was black (0,0,0) before, now it should be close to emerald (16, 185, 129)
      const centerIdx = (10 * width + 10) * 4
      const r = result.data[centerIdx]
      const g = result.data[centerIdx + 1]
      const b = result.data[centerIdx + 2]

      assert.ok(g >= 130, `Green channel should be reconstructed near background (got ${g})`)
      assert.strictEqual(result.data[centerIdx + 3], 255, 'Alpha must remain fully opaque')
    })
  })

  describe('Mask History Stack Manager (Undo / Redo)', () => {
    it('should manage undo and redo stacks correctly', () => {
      const history = new MaskHistoryManager(5)
      assert.strictEqual(history.canUndo, false)
      assert.strictEqual(history.canRedo, false)

      const state1 = new ImageData(new Uint8ClampedArray(16), 2, 2)
      state1.data[0] = 100

      const state2 = new ImageData(new Uint8ClampedArray(16), 2, 2)
      state2.data[0] = 200

      history.push(state1)
      assert.strictEqual(history.canUndo, true)
      assert.strictEqual(history.undoCount, 1)

      const undone = history.undo(state2)
      assert.ok(undone)
      assert.strictEqual(undone.data[0], 100)
      assert.strictEqual(history.canRedo, true)

      const redone = history.redo(undone)
      assert.ok(redone)
      assert.strictEqual(redone.data[0], 200)
    })

    it('should respect maximum stack depth bound', () => {
      const history = new MaskHistoryManager(3)
      for (let i = 0; i < 6; i++) {
        const s = new ImageData(new Uint8ClampedArray(16), 2, 2)
        s.data[0] = i
        history.push(s)
      }
      assert.strictEqual(history.undoCount, 3)
    })
  })

  describe('Multilingual Indian Localization Suite (All 7 Regional Languages)', () => {
    const requiredLocales: InpaintingLocale[] = ['en', 'ml', 'hi', 'ta', 'te', 'kn', 'bn']

    it('should define all 7 regional languages in INPAINTING_LOCALES', () => {
      for (const loc of requiredLocales) {
        assert.ok(INPAINTING_LOCALES[loc], `Locale ${loc} must be defined in INPAINTING_LOCALES`)
        assert.ok(INPAINTING_LOCALES[loc].name, `Locale ${loc} must have name`)
        assert.ok(INPAINTING_LOCALES[loc].nativeName, `Locale ${loc} must have nativeName`)
      }
    })

    it('should have complete translations for all 7 languages without missing keys', () => {
      for (const loc of requiredLocales) {
        const trans = INPAINTING_TRANSLATIONS[loc]
        assert.ok(trans, `Translations must exist for ${loc}`)
        assert.ok(trans.title, `Title must exist for ${loc}`)
        assert.ok(trans.subtitle, `Subtitle must exist for ${loc}`)
        assert.ok(trans.badgeFree, `BadgeFree must exist for ${loc}`)
        assert.ok(trans.badgePrivacy, `BadgePrivacy must exist for ${loc}`)
        assert.ok(trans.badgeEngine, `BadgeEngine must exist for ${loc}`)
        assert.ok(trans.brushTool, `BrushTool must exist for ${loc}`)
        assert.ok(trans.eraserTool, `EraserTool must exist for ${loc}`)
        assert.ok(trans.inpaintAction, `InpaintAction must exist for ${loc}`)
        assert.ok(trans.downloadImage, `DownloadImage must exist for ${loc}`)
        assert.strictEqual(trans.faqs.length, 5, `Must have exactly 5 FAQs for ${loc}`)
      }
    })

    it('should fallback to English when invalid locale is requested', () => {
      // @ts-ignore
      const fallback = getInpaintingTranslation('unknown-lang' as InpaintingLocale)
      assert.strictEqual(fallback.title, INPAINTING_TRANSLATIONS.en.title)
    })
  })

  describe('Sitemap, Prerender & Multilingual SEO Compliance Suite', () => {
    it('sitemap.xml contains English and all 6 localized inpainting URLs with 225 total URLs', () => {
      const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8')
      const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
      assert.strictEqual(locs.length, 225, 'Sitemap should contain exactly 225 production URLs')

      // Main English URL
      assert.ok(locs.includes('https://indiatools-rho.vercel.app/tools/fast-inpainting-watermark-remover'))

      // All 6 regional languages
      const regionalCodes = ['bn', 'ml', 'hi', 'ta', 'te', 'kn']
      for (const code of regionalCodes) {
        const regionalUrl = `https://indiatools-rho.vercel.app/${code}/tools/fast-inpainting-watermark-remover`
        assert.ok(locs.includes(regionalUrl), `Sitemap must contain <loc> for ${regionalUrl}`)
      }
    })

    it('INPAINTING_SEO_LANGUAGES defines comprehensive metadata for all 7 languages', () => {
      assert.strictEqual(INPAINTING_SEO_LANG_CODES.length, 7)
      for (const code of INPAINTING_SEO_LANG_CODES) {
        const data = INPAINTING_SEO_LANGUAGES[code]
        assert.ok(data, `SEO data must exist for ${code}`)
        assert.ok(data.title.includes('IndiaTools') || data.title.length > 20, `Title must be descriptive for ${code}`)
        assert.ok(data.metaDescription.length > 50, `Description must be descriptive for ${code}`)
        assert.ok(data.h1.length > 10, `H1 must be present for ${code}`)
        assert.ok(data.guideSteps.length >= 5, `Guide steps must be at least 5 for ${code}`)
        assert.ok(data.useCases.length >= 4, `Use cases must be at least 4 for ${code}`)
        assert.ok(data.faqs.length >= 5, `FAQs must be at least 5 for ${code}`)
        assert.ok(data.canonicalUrl.startsWith('https://indiatools-rho.vercel.app'), `Canonical URL must be production URL for ${code}`)
      }
    })

    it('prerender.cjs contains dedicated multilingual inpainting handler', () => {
      const prerenderCode = fs.readFileSync('scripts/prerender.cjs', 'utf8')
      assert.ok(prerenderCode.includes("urlPath.includes('fast-inpainting-watermark-remover')"), 'prerender.cjs must handle inpainting URL')
      assert.ok(prerenderCode.includes('INPAINTING_SEO_LANGUAGES'), 'prerender.cjs must use INPAINTING_SEO_LANGUAGES')
    })
  })
})
