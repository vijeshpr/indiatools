import { describe, it } from 'node:test'
import assert from 'node:assert'
import { TOOLS, CATEGORIES, getToolBySlug } from '../src/data/tools.ts'
import {
  distance,
  computeTargetDimensions,
  computeBackwardHomographyMatrix,
  warpPerspective,
} from '../src/lib/scanner/homography.ts'
import {
  detectDocumentCorners,
  createDefaultCorners,
} from '../src/lib/scanner/cornerDetector.ts'
import { applyScanFilter } from '../src/lib/scanner/filterEngine.ts'
import {
  SCANNER_LOCALES,
  SCANNER_TRANSLATIONS,
  getScannerTranslation,
} from '../src/lib/scanner/i18n.ts'
import type { DocumentCorners } from '../src/lib/scanner/types.ts'

// Polyfill ImageData for Node environment if missing
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
        this.height = maybeHeight || (dataOrWidth.length / (4 * widthOrHeight))
      }
    }
  }
}

describe('Smart Document Scanner & Perspective Warp Suite', () => {
  it('should be registered in tools registry with complete SEO metadata', () => {
    assert.ok(TOOLS.length >= 61, 'Registry must contain at least 61 tools')
    assert.ok(CATEGORIES.create.toolCount >= 22, 'Create category must have at least 22 tools')

    const tool = getToolBySlug('smart-document-scanner')
    assert.ok(tool, 'Tool must exist in registry')
    assert.strictEqual(tool.slug, 'smart-document-scanner')
    assert.strictEqual(tool.category, 'create')
    assert.strictEqual(tool.seo.canonicalPath, '/tools/smart-document-scanner')
    assert.ok(tool.title.endsWith('| IndiaTools'), 'Title must end with | IndiaTools')
    assert.ok(tool.seo.title.endsWith('| IndiaTools'), 'SEO title must end with | IndiaTools')
    assert.ok(tool.faqs.length >= 4, 'Must have at least 4 FAQs')
    assert.ok(tool.tags.includes('Perspective Warp'), 'Must tag Perspective Warp')
    assert.ok(tool.exampleCalculation, 'Must have example calculation')
  })

  describe('Projective Homography Math Engine', () => {
    it('should compute distance between two points accurately', () => {
      const d = distance({ x: 0, y: 0 }, { x: 30, y: 40 })
      assert.strictEqual(d, 50)
    })

    it('should compute target bounding dimensions from angled quadrilateral corners', () => {
      const corners: DocumentCorners = {
        tl: { x: 50, y: 50 },
        tr: { x: 250, y: 30 },
        br: { x: 260, y: 330 },
        bl: { x: 40, y: 340 },
      }
      const dims = computeTargetDimensions(corners)
      assert.ok(dims.width >= 200)
      assert.ok(dims.height >= 280)
    })

    it('should calculate 8-coefficient backward homography matrix', () => {
      const corners: DocumentCorners = {
        tl: { x: 10, y: 10 },
        tr: { x: 210, y: 10 },
        br: { x: 210, y: 310 },
        bl: { x: 10, y: 310 },
      }
      const m = computeBackwardHomographyMatrix(corners, 200, 300)
      assert.strictEqual(m.length, 8)
      // For a pure rectangle translation of (10, 10):
      // x = 1*u + 0*v + 10, y = 0*u + 1*v + 10, m6=0, m7=0
      assert.ok(Math.abs(m[0] - 1) < 1e-4) // m0 approx 1
      assert.ok(Math.abs(m[2] - 10) < 1e-4) // m2 approx 10
      assert.ok(Math.abs(m[4] - 1) < 1e-4) // m4 approx 1
      assert.ok(Math.abs(m[5] - 10) < 1e-4) // m5 approx 10
      assert.ok(Math.abs(m[6]) < 1e-4) // m6 approx 0
      assert.ok(Math.abs(m[7]) < 1e-4) // m7 approx 0
    })

    it('should warp perspective image data with bilinear interpolation', () => {
      // Create a 100x100 synthetic image with a centered dark square
      // @ts-ignore
      const src = new ImageData(100, 100)
      for (let y = 0; y < 100; y++) {
        for (let x = 0; x < 100; x++) {
          const idx = (y * 100 + x) * 4
          const isDark = x >= 20 && x <= 80 && y >= 20 && y <= 80
          const val = isDark ? 20 : 240
          src.data[idx] = val
          src.data[idx + 1] = val
          src.data[idx + 2] = val
          src.data[idx + 3] = 255
        }
      }

      const corners: DocumentCorners = {
        tl: { x: 20, y: 20 },
        tr: { x: 80, y: 20 },
        br: { x: 80, y: 80 },
        bl: { x: 20, y: 80 },
      }

      const warped = warpPerspective(src, corners, 60, 60)
      assert.strictEqual(warped.width, 60)
      assert.strictEqual(warped.height, 60)

      // Center of warped output should be dark
      const centerIdx = (30 * 60 + 30) * 4
      assert.ok(warped.data[centerIdx] < 50, 'Warped interior pixel should be dark')
    })
  })

  describe('Corner Detector Engine', () => {
    it('should produce valid default corners within image margins', () => {
      const def = createDefaultCorners(1000, 800)
      assert.ok(def.tl.x >= 0 && def.tl.x < def.tr.x)
      assert.ok(def.tr.y >= 0 && def.tr.y < def.br.y)
      assert.strictEqual(def.tl.x, 80)
      assert.strictEqual(def.tl.y, 64)
    })

    it('should detect corners from contrast gradient document image', () => {
      // @ts-ignore
      const img = new ImageData(200, 200)
      // Fill with dark background and white document polygon in the center
      for (let y = 0; y < 200; y++) {
        for (let x = 0; x < 200; x++) {
          const idx = (y * 200 + x) * 4
          const inDoc = x >= 30 && x <= 170 && y >= 30 && y <= 170
          const c = inDoc ? 250 : 20
          img.data[idx] = c
          img.data[idx + 1] = c
          img.data[idx + 2] = c
          img.data[idx + 3] = 255
        }
      }

      const detected = detectDocumentCorners(img, 200)
      assert.ok(detected.tl.x <= 50, 'TL x should be near 30')
      assert.ok(detected.tl.y <= 50, 'TL y should be near 30')
      assert.ok(detected.br.x >= 150, 'BR x should be near 170')
      assert.ok(detected.br.y >= 150, 'BR y should be near 170')
    })
  })

  describe('Scan Enhancement Filter Engine', () => {
    it('should apply B&W Magic Filter bleaching paper background to pure white', () => {
      // @ts-ignore
      const img = new ImageData(50, 50)
      // Fill with paper background (220) and text ink (30)
      for (let i = 0; i < img.data.length; i += 4) {
        const isInk = i % 80 === 0
        const c = isInk ? 30 : 220
        img.data[i] = c
        img.data[i + 1] = c
        img.data[i + 2] = c
        img.data[i + 3] = 255
      }

      const filtered = applyScanFilter(img, 'magic-bw')
      assert.strictEqual(filtered.width, 50)
      assert.strictEqual(filtered.height, 50)

      // Background pixels should be bleached to 255
      let pureWhiteCount = 0
      for (let i = 0; i < filtered.data.length; i += 4) {
        if (filtered.data[i] === 255) pureWhiteCount++
      }
      assert.ok(pureWhiteCount > 1000, 'Paper background should be bleached to pure white')
    })

    it('should apply Grayscale photocopy filter', () => {
      // @ts-ignore
      const img = new ImageData(10, 10)
      img.data[0] = 200
      img.data[1] = 100
      img.data[2] = 50
      img.data[3] = 255

      const gray = applyScanFilter(img, 'grayscale')
      assert.strictEqual(gray.data[0], gray.data[1])
      assert.strictEqual(gray.data[1], gray.data[2])
    })
  })

  describe('Multilingual Localization Suite', () => {
    it('should define all 7 required languages in SCANNER_LOCALES', () => {
      const keys = Object.keys(SCANNER_LOCALES)
      assert.strictEqual(keys.length, 7)
      for (const k of ['en', 'ml', 'hi', 'ta', 'te', 'kn', 'bn'] as const) {
        assert.ok(SCANNER_LOCALES[k])
      }
    })

    it('should have complete translations for all 7 languages', () => {
      for (const k of ['en', 'ml', 'hi', 'ta', 'te', 'kn', 'bn'] as const) {
        const t = getScannerTranslation(k)
        assert.ok(t.title.length > 0, `${k} title is missing`)
        assert.ok(t.subtitle.length > 0, `${k} subtitle is missing`)
        assert.ok(t.autoDetect.length > 0, `${k} autoDetect is missing`)
        assert.ok(t.processWarp.length > 0, `${k} processWarp is missing`)
        assert.ok(t.downloadPdf.length > 0, `${k} downloadPdf is missing`)
        assert.ok(t.faqs.length >= 1, `${k} FAQs missing`)
      }
    })
  })
})
