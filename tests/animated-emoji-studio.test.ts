import { describe, it } from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import { TOOLS, CATEGORIES } from '../src/data/tools.ts'
import { ANIMATED_EMOJIS, EMOJI_CATEGORIES, AnimatedEmojiItem } from '../src/data/emojisData.ts'
import { DIRECTORY_TRANSLATIONS, DIRECTORY_LANG_CODES } from '../src/data/directory/index.ts'

describe('Animated Emoji Studio — Suite & Integration Tests', () => {
  it('should be registered as Tool #71 in the TOOLS registry', () => {
    assert.strictEqual(TOOLS.length, 71, 'Total tool count should be exactly 71')
    const tool = TOOLS.find(t => t.slug === 'animated-emoji-studio')
    assert.ok(tool, 'Tool animated-emoji-studio must be registered in TOOLS')
    assert.strictEqual(tool.category, 'create')
    assert.strictEqual(tool.seo.canonicalPath, '/tools/animated-emoji-studio')
    assert.ok(tool.title.includes('Animated Emoji Studio'))
    assert.ok(tool.description.length > 50)
    assert.ok(tool.seo.keywords.some(k => k.includes('animated emoji')))
    assert.ok(tool.seo.keywords.some(k => k.includes('whatsapp')))
    assert.strictEqual(CATEGORIES.create.toolCount, 30)
  })

  it('contains at least 32 authentic transparent animated emoji assets', () => {
    assert.ok(ANIMATED_EMOJIS.length >= 32, `Expected at least 32 emojis, got ${ANIMATED_EMOJIS.length}`)
  })

  it('every emoji item has valid metadata, dimensions, and categories', () => {
    const validCategoryIds = EMOJI_CATEGORIES.map(c => c.id).filter(id => id !== 'all')

    for (const item of ANIMATED_EMOJIS) {
      assert.ok(item.id, 'Missing id')
      assert.ok(item.name, `Missing name for ${item.id}`)
      assert.ok(item.codepoint, `Missing codepoint for ${item.id}`)
      assert.ok(validCategoryIds.includes(item.category), `Invalid category ${item.category} for ${item.id}`)
      assert.ok(Array.isArray(item.tags) && item.tags.length > 0, `Missing tags for ${item.id}`)
      assert.strictEqual(item.width, 512, `Width must be 512 for ${item.id}`)
      assert.strictEqual(item.height, 512, `Height must be 512 for ${item.id}`)
      assert.ok(item.webpSizeBytes > 0, `Invalid webpSizeBytes for ${item.id}`)
      assert.ok(item.gifSizeBytes > 0, `Invalid gifSizeBytes for ${item.id}`)
      assert.strictEqual(typeof item.isWhatsAppReady, 'boolean')
      if (item.isWhatsAppReady) {
        assert.ok(item.stickerSizeBytes > 0, `Sticker size must be > 0 when isWhatsAppReady is true for ${item.id}`)
        assert.ok(item.stickerUrl, `Sticker URL must be non-null when isWhatsAppReady is true for ${item.id}`)
      }
    }
  })

  it('all WhatsApp sticker WebP files strictly obey the <= 500 KB WhatsApp sticker limit', () => {
    for (const item of ANIMATED_EMOJIS) {
      if (item.isWhatsAppReady && item.stickerUrl) {
        assert.ok(
          item.stickerSizeBytes <= 500 * 1024,
          `WhatsApp animated sticker for ${item.id} is ${item.stickerSizeBytes} bytes, exceeding 500 KB limit`
        )
      }
    }
  })

  it('all WebP, GIF, and sticker files exist physically in public/emojis/', () => {
    for (const item of ANIMATED_EMOJIS) {
      const webpDisk = path.join(process.cwd(), 'public', item.webpUrl.replace(/^\//, ''))
      const gifDisk = path.join(process.cwd(), 'public', item.gifUrl.replace(/^\//, ''))
      const stickerDisk = item.stickerUrl ? path.join(process.cwd(), 'public', item.stickerUrl.replace(/^\//, '')) : null

      assert.ok(fs.existsSync(webpDisk), `WebP file missing on disk: ${webpDisk}`)
      assert.ok(fs.existsSync(gifDisk), `GIF file missing on disk: ${gifDisk}`)
      if (stickerDisk) {
        assert.ok(fs.existsSync(stickerDisk), `Sticker file missing on disk: ${stickerDisk}`)
      }

      const webpStats = fs.statSync(webpDisk)
      const gifStats = fs.statSync(gifDisk)

      assert.ok(webpStats.size > 1000, `WebP file suspiciously small: ${webpDisk} (${webpStats.size} bytes)`)
      assert.ok(gifStats.size > 1000, `GIF file suspiciously small: ${gifDisk} (${gifStats.size} bytes)`)
      if (stickerDisk) {
        const stickerStats = fs.statSync(stickerDisk)
        assert.ok(stickerStats.size > 1000, `Sticker file suspiciously small: ${stickerDisk} (${stickerStats.size} bytes)`)
        assert.ok(stickerStats.size <= 500 * 1024, `Sticker disk file exceeds 500 KB: ${stickerDisk} (${stickerStats.size} bytes)`)
      }
    }
  })

  it('hero banner image exists with valid non-zero dimensions', () => {
    const heroPath = path.join(process.cwd(), 'public', 'images', 'emoji', 'animated-emoji-studio-hero.jpg')
    assert.ok(fs.existsSync(heroPath), `Hero banner image missing at ${heroPath}`)
    const stat = fs.statSync(heroPath)
    assert.ok(stat.size > 50000, `Hero banner file size unexpectedly small (${stat.size} bytes)`)
  })

  it('has valid localized translations in all 23 language directories', () => {
    for (const lang of DIRECTORY_LANG_CODES) {
      const dict = DIRECTORY_TRANSLATIONS[lang]
      assert.ok(dict, `Missing translations dictionary for ${lang}`)
      const entry = dict['animated-emoji-studio']
      assert.ok(entry, `Missing 'animated-emoji-studio' translation in ${lang}`)
      assert.ok(entry.name && entry.name.trim().length > 0, `Empty name for animated-emoji-studio in ${lang}`)
      assert.ok(entry.description && entry.description.trim().length > 0, `Empty description for animated-emoji-studio in ${lang}`)
    }
  })

  it('public/sitemap.xml contains the animated-emoji-studio production canonical URL', () => {
    const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8')
    assert.ok(
      sitemap.includes('<loc>https://indiatools-rho.vercel.app/tools/animated-emoji-studio</loc>'),
      'Canonical URL not found in public/sitemap.xml'
    )
  })

  it('supports category filtering and multi-word keyword search', () => {
    const emotions = ANIMATED_EMOJIS.filter(e => e.category === 'emotions')
    assert.ok(emotions.length >= 6, 'Expected at least 6 emotions emojis')

    const hearts = ANIMATED_EMOJIS.filter(e => e.category === 'hearts')
    assert.ok(hearts.length >= 3, 'Expected at least 3 hearts emojis')

    const searchLove = ANIMATED_EMOJIS.filter(e =>
      e.name.toLowerCase().includes('love') || e.tags.some(t => t.toLowerCase().includes('love'))
    )
    assert.ok(searchLove.length >= 3, 'Expected at least 3 emojis matching "love"')

    const searchFire = ANIMATED_EMOJIS.filter(e =>
      e.name.toLowerCase().includes('fire') || e.tags.some(t => t.toLowerCase().includes('fire'))
    )
    assert.ok(searchFire.length >= 1, 'Expected at least 1 fire emoji')
  })

  it('no bulk ZIP download functions exist in the studio component', () => {
    const toolComponentPath = path.join(process.cwd(), 'src', 'imageTools', 'AnimatedEmojiStudioTool.tsx')
    const toolCode = fs.readFileSync(toolComponentPath, 'utf8')
    assert.ok(!toolCode.includes('JSZip'), 'Component must not import or use JSZip')
    assert.ok(!toolCode.includes('downloadAll'), 'Component must not provide downloadAll function')
    assert.ok(!toolCode.includes('bulkDownload'), 'Component must not provide bulkDownload function')
    assert.ok(!toolCode.includes('all-emojis.zip'), 'Component must not provide ZIP download')
  })
})
