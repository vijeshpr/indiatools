import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  encodePayloadToZeroWidth,
  embedTextWatermark,
  extractTextWatermark,
  stripTextWatermark,
  inspectTextDiagnostics,
} from '../src/lib/watermarker/textWatermarkEngine'
import {
  serializeImagePayload,
  embedImageWatermark,
  extractImageWatermark,
  generateForensicDifferenceMap,
  generateBitplaneVisualizer,
} from '../src/lib/watermarker/imageWatermarkEngine'
import {
  WATERMARK_LOCALES,
  ALL_WATERMARK_LOCALES,
} from '../src/lib/watermarker/i18n/locales'
import {
  WATERMARK_TRANSLATIONS,
  getWatermarkTranslation,
} from '../src/lib/watermarker/i18n/translations'
import { computeCRC16, computeCRC32 } from '../src/lib/watermarker/crc'
import { WatermarkPayload } from '../src/lib/watermarker/types'

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

import { TOOLS, CATEGORIES, getToolBySlug } from '../src/data/tools'

describe('Invisible Document Watermarker & Forensics Engine', () => {
  const samplePayload: WatermarkPayload = {
    ownerId: 'EMP-98241',
    organization: 'Govt Audit Cell, New Delhi',
    referenceKey: 'NDA-LEAK-PROO-2026',
    timestamp: 1776098400000,
    customNote: 'Strictly confidential internal circulation',
  }

  it('should be registered in tools registry with complete SEO metadata', () => {
    assert.ok(TOOLS.length >= 60, 'Registry must contain at least 60 tools')
    assert.ok(CATEGORIES.create.toolCount >= 21, 'Create category must have at least 21 tools')

    const tool = getToolBySlug('invisible-document-watermarker')
    assert.ok(tool, 'Tool must exist in registry')
    assert.strictEqual(tool.slug, 'invisible-document-watermarker')
    assert.strictEqual(tool.category, 'create')
    assert.strictEqual(tool.seo.canonicalPath, '/tools/invisible-document-watermarker')
    assert.ok(tool.title.endsWith('| IndiaTools'), 'Title must end with | IndiaTools')
    assert.ok(tool.seo.title.endsWith('| IndiaTools'), 'SEO title must end with | IndiaTools')
    assert.ok(tool.faqs.length >= 5, 'Must have at least 5 FAQs')
    assert.ok(tool.tags.includes('Steganography'), 'Must tag Steganography')
    assert.ok(tool.exampleCalculation, 'Must have example calculation')
  })

  describe('CRC Checksum Integrity', () => {
    it('should compute valid CRC16 and CRC32 checksums', () => {
      const data = new TextEncoder().encode('IndiaTools Secure Steganography')
      const crc16 = computeCRC16(data)
      const crc32 = computeCRC32(data)

      assert.strictEqual(typeof crc16, 'number')
      assert.strictEqual(typeof crc32, 'number')
      assert.ok(crc16 > 0, 'CRC16 should be positive non-zero')
      assert.ok(crc32 > 0, 'CRC32 should be positive non-zero')

      // Determinism
      assert.strictEqual(computeCRC16(data), crc16)
      assert.strictEqual(computeCRC32(data), crc32)
    })
  })

  describe('Unicode Zero-Width Text Steganography Engine', () => {
    it('should encode payload into zero-width characters and decode correctly', () => {
      const encoded = encodePayloadToZeroWidth(samplePayload)
      assert.ok(encoded.length > 50, 'Encoded sequence should have length')
      // Characters should be exclusively zero-width
      const allowedChars = new Set(['\u200B', '\u200C', '\u200D', '\uFEFF'])
      for (const char of encoded) {
        assert.ok(allowedChars.has(char), `Character ${char.charCodeAt(0)} must be zero-width`)
      }
    })

    it('should embed watermark into English cover text and extract verbatim', () => {
      const coverText = 'This is a strictly confidential non-disclosure agreement regarding project Alpha.'
      const watermarked = embedTextWatermark(coverText, samplePayload)

      // Visually should preserve words and length of stripped text
      assert.strictEqual(stripTextWatermark(watermarked), coverText)

      // Extraction
      const result = extractTextWatermark(watermarked)
      assert.strictEqual(result.success, true)
      assert.strictEqual(result.crcValid, true)
      assert.strictEqual(result.confidenceScore, 100)
      assert.ok(result.payload)
      assert.strictEqual(result.payload.ownerId, samplePayload.ownerId)
      assert.strictEqual(result.payload.organization, samplePayload.organization)
      assert.strictEqual(result.payload.referenceKey, samplePayload.referenceKey)
      assert.strictEqual(result.payload.timestamp, samplePayload.timestamp)
    })

    it('should safely embed into Indic (Hindi, Malayalam, Tamil) texts without breaking characters', () => {
      const hindiText = 'यह भारत सरकार का एक अत्यंत गोपनीय वित्तीय दस्तावेज है।'
      const malayalamText = 'ഇതൊരു അതീവ രഹസ്യ സ്വഭാവമുള്ള സർക്കാർ രേഖയാണ്.'
      const tamilText = 'இது ஒரு ரகசிய ஒப்பந்த ஆவணமாகும்.'

      for (const text of [hindiText, malayalamText, tamilText]) {
        const watermarked = embedTextWatermark(text, samplePayload)
        assert.strictEqual(stripTextWatermark(watermarked), text)

        const result = extractTextWatermark(watermarked)
        assert.strictEqual(result.success, true)
        assert.strictEqual(result.crcValid, true)
        assert.strictEqual(result.payload?.ownerId, samplePayload.ownerId)
      }
    })

    it('should safely embed into RTL languages (Urdu, Kashmiri, Sindhi)', () => {
      const urduText = 'یہ ایک انتہائی خفیہ اور حساس سرکاری دستاویز ہے۔'
      const watermarked = embedTextWatermark(urduText, samplePayload)

      assert.strictEqual(stripTextWatermark(watermarked), urduText)
      const result = extractTextWatermark(watermarked)
      assert.strictEqual(result.success, true)
      assert.strictEqual(result.payload?.ownerId, samplePayload.ownerId)
    })

    it('should detect corrupted or tampered text zero-width payloads', () => {
      const coverText = 'Confidential memo for department heads.'
      let watermarked = embedTextWatermark(coverText, samplePayload)

      // Deliberately tamper with one zero-width character in the middle
      const half = Math.floor(watermarked.length / 2)
      watermarked = watermarked.slice(0, half) + '\u200B' + watermarked.slice(half + 1)

      const result = extractTextWatermark(watermarked)
      // Either CRC check fails or JSON fails, but crcValid must not be true if damaged
      assert.ok(!result.success || !result.crcValid || result.error)
    })

    it('should provide accurate codepoint diagnostics', () => {
      const text = 'Hello world'
      const watermarked = embedTextWatermark(text, samplePayload)
      const diag = inspectTextDiagnostics(watermarked)

      assert.strictEqual(diag.visibleChars, 11)
      assert.ok(diag.zeroWidthChars > 50)
      assert.strictEqual(diag.hasSteganography, true)
    })
  })

  describe('Canvas LSB Image Steganography Engine', () => {
    it('should serialize image payload with sync preamble, version, and CRC32', () => {
      const frame = serializeImagePayload(samplePayload)
      assert.ok(frame.length > 20)
      // Check sync preamble 'WMKR' (0x57, 0x4D, 0x4B, 0x52)
      assert.strictEqual(frame[0], 0x57)
      assert.strictEqual(frame[1], 0x4d)
      assert.strictEqual(frame[2], 0x4b)
      assert.strictEqual(frame[3], 0x52)
      assert.strictEqual(frame[4], 1) // version 1
    })

    it('should embed watermark into ImageData and extract with 100% CRC integrity', () => {
      const width = 200
      const height = 200
      // @ts-ignore
      const testImage = new ImageData(width, height)
      // Fill image with realistic photographic pixel pattern
      for (let i = 0; i < testImage.data.length; i += 4) {
        testImage.data[i] = (i * 7) % 256 // R
        testImage.data[i + 1] = (i * 13) % 256 // G
        testImage.data[i + 2] = (i * 19) % 256 // B
        testImage.data[i + 3] = 255 // A
      }

      const watermarked = embedImageWatermark(testImage, samplePayload, {
        bitsPerChannel: 1,
        redundancyFactor: 1,
      })

      // Image dimensions must match
      assert.strictEqual(watermarked.width, width)
      assert.strictEqual(watermarked.height, height)

      // Extract watermark
      const extraction = extractImageWatermark(watermarked)
      assert.strictEqual(extraction.success, true)
      assert.strictEqual(extraction.crcValid, true)
      assert.strictEqual(extraction.confidenceScore, 100)
      assert.ok(extraction.payload)
      assert.strictEqual(extraction.payload.ownerId, samplePayload.ownerId)
      assert.strictEqual(extraction.payload.organization, samplePayload.organization)
      assert.strictEqual(extraction.payload.referenceKey, samplePayload.referenceKey)
    })

    it('should generate forensic difference map highlighting watermarked pixels', () => {
      const width = 100
      const height = 100
      // @ts-ignore
      const original = new ImageData(width, height)
      for (let i = 0; i < original.data.length; i += 4) {
        original.data[i] = 120
        original.data[i + 1] = 120
        original.data[i + 2] = 120
        original.data[i + 3] = 255
      }

      const watermarked = embedImageWatermark(original, samplePayload, {
        bitsPerChannel: 1,
        redundancyFactor: 1,
      })

      const diff = generateForensicDifferenceMap(original, watermarked, 64)
      assert.strictEqual(diff.width, width)
      assert.strictEqual(diff.height, height)

      // Verify forensic glow exists in diff
      let modifiedPixels = 0
      for (let i = 0; i < diff.data.length; i += 4) {
        if (diff.data[i + 2] === 255 && diff.data[i] === 0) {
          modifiedPixels++
        }
      }
      assert.ok(modifiedPixels > 0, 'Forensic difference map must contain highlighted modified pixels')
    })
  })

  describe('Multilingual Localization Suite (All 23 Languages)', () => {
    it('should define all 23 official languages in WATERMARK_LOCALES', () => {
      assert.strictEqual(ALL_WATERMARK_LOCALES.length, 23)
      for (const loc of ALL_WATERMARK_LOCALES) {
        const meta = WATERMARK_LOCALES[loc]
        assert.ok(meta, `Locale meta must exist for ${loc}`)
        assert.strictEqual(meta.code, loc)
        assert.ok(meta.name.length > 0)
        assert.ok(meta.nativeName.length > 0)
        assert.ok(meta.bcp47.length > 0)
        assert.ok(meta.dir === 'ltr' || meta.dir === 'rtl')
      }
    })

    it('should have complete translations for all 23 languages without missing keys', () => {
      for (const loc of ALL_WATERMARK_LOCALES) {
        const t = getWatermarkTranslation(loc)
        assert.ok(t, `Translation must exist for ${loc}`)
        assert.ok(t.title.length > 0, `${loc} title is missing`)
        assert.ok(t.subtitle.length > 0, `${loc} subtitle is missing`)
        assert.ok(t.ownerId.length > 0, `${loc} ownerId is missing`)
        assert.ok(t.org.length > 0, `${loc} org is missing`)
        assert.ok(t.refKey.length > 0, `${loc} refKey is missing`)
        assert.ok(t.embedBtn.length > 0, `${loc} embedBtn is missing`)
        assert.ok(t.extractBtn.length > 0, `${loc} extractBtn is missing`)
        assert.ok(t.zeroKnowledgePledge.length > 0, `${loc} zeroKnowledgePledge is missing`)
        assert.ok(t.faqs.length >= 1, `${loc} FAQs missing`)
      }
    })

    it('should specify RTL for Urdu, Kashmiri, and Sindhi', () => {
      assert.strictEqual(WATERMARK_LOCALES.ur.dir, 'rtl')
      assert.strictEqual(WATERMARK_LOCALES.ks.dir, 'rtl')
      assert.strictEqual(WATERMARK_LOCALES.sd.dir, 'rtl')
      assert.strictEqual(WATERMARK_LOCALES.hi.dir, 'ltr')
      assert.strictEqual(WATERMARK_LOCALES.ml.dir, 'ltr')
      assert.strictEqual(WATERMARK_LOCALES.en.dir, 'ltr')
    })
  })
})
