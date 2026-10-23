import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  DEFAULT_NEON_ENERGY_CONFIG,
  type NeonTheme,
} from '../src/lib/neonEnergy/neonEnergyTypes.ts'
import {
  NEON_PRESETS,
  applyNeonPreset,
} from '../src/lib/neonEnergy/neonEnergyPresets.ts'
import { neonEnergyEngine } from '../src/lib/neonEnergy/neonEnergyEngine.ts'

describe('Neon Energy / Electric Glow Visualizer Engine Tests', () => {
  it('should initialize with correct safe defaults and disabled state', () => {
    assert.strictEqual(DEFAULT_NEON_ENERGY_CONFIG.enabled, false, 'Neon Energy must start disabled (Safety First)')
    assert.strictEqual(DEFAULT_NEON_ENERGY_CONFIG.mode, 'text')
    assert.strictEqual(DEFAULT_NEON_ENERGY_CONFIG.text.customText, 'INDIA TOOLS')
    assert.strictEqual(DEFAULT_NEON_ENERGY_CONFIG.text.whiteCore, true, 'Default must feature authentic white tube core')
    assert.strictEqual(DEFAULT_NEON_ENERGY_CONFIG.glow.theme, 'cyber-rainbow')
    assert.strictEqual(DEFAULT_NEON_ENERGY_CONFIG.reflection.enabled, true)
    assert.strictEqual(DEFAULT_NEON_ENERGY_CONFIG.audio.midFreqPulseEnabled, true)
  })

  it('should verify all 8 curated neon presets have unique IDs, names and icons', () => {
    assert.strictEqual(NEON_PRESETS.length, 8)
    const ids = new Set(NEON_PRESETS.map((p) => p.id))
    assert.strictEqual(ids.size, 8, 'All preset IDs must be unique')

    for (const preset of NEON_PRESETS) {
      assert.ok(preset.name.length > 0, `Preset ${preset.id} must have a name`)
      assert.ok(preset.icon.length > 0, `Preset ${preset.id} must have an icon`)
      assert.ok(preset.description.length > 0, `Preset ${preset.id} must have a description`)
    }
  })

  it('should apply curated presets correctly without altering unselected properties', () => {
    let cfg = { ...DEFAULT_NEON_ENERGY_CONFIG }
    cfg = applyNeonPreset(cfg, 'electric-cyan')
    assert.strictEqual(cfg.glow.theme, 'electric-cyan')
    assert.strictEqual(cfg.backgroundStyle, 'dark-navy-slate')

    cfg = applyNeonPreset(cfg, 'hot-magenta')
    assert.strictEqual(cfg.glow.theme, 'hot-magenta')
    assert.strictEqual(cfg.backgroundStyle, 'charcoal-abyss')

    cfg = applyNeonPreset(cfg, 'acid-lime')
    assert.strictEqual(cfg.glow.theme, 'acid-lime')
    assert.strictEqual(cfg.backgroundStyle, 'cyber-dark')
  })

  it('should resolve dynamic neon palettes correctly across themes and hue offsets', () => {
    const themes: NeonTheme[] = [
      'cyber-rainbow',
      'electric-cyan',
      'hot-magenta',
      'acid-lime',
      'electric-gold',
      'tokyo-midnight',
    ]

    for (const theme of themes) {
      const palette = neonEnergyEngine.resolvePalette(theme, 45)
      assert.ok(palette.primary.startsWith('hsl('), `Primary color for ${theme} must be HSL`)
      assert.ok(palette.secondary.startsWith('hsl('), `Secondary color for ${theme} must be HSL`)
      assert.ok(palette.tertiary.startsWith('hsl('), `Tertiary color for ${theme} must be HSL`)
      assert.ok(palette.highlight.startsWith('hsl('), `Highlight color for ${theme} must be HSL`)
      assert.strictEqual(palette.core, '#FFFFFF')
    }

    // Custom colors support
    const custom = neonEnergyEngine.resolvePalette('custom', 0, {
      primary: '#123456',
      secondary: '#654321',
      tertiary: '#ABCDEF',
      highlight: '#FEDCBA',
    })
    assert.strictEqual(custom.primary, '#123456')
    assert.strictEqual(custom.secondary, '#654321')
  })

  it('should execute Neon Energy render pipeline on Canvas context without throwing errors', () => {
    const originalImage = (globalThis as any).Image
    ;(globalThis as any).Image = class MockImage {
      complete = true
      naturalWidth = 512
      naturalHeight = 512
      src = ''
    }

    const gradMock = { addColorStop: () => {} }
    const mockCtx = {
      canvas: { width: 1920, height: 1080 },
      save: () => {},
      restore: () => {},
      clearRect: () => {},
      fillRect: () => {},
      beginPath: () => {},
      closePath: () => {},
      rect: () => {},
      arc: () => {},
      moveTo: () => {},
      lineTo: () => {},
      stroke: () => {},
      fill: () => {},
      clip: () => {},
      translate: () => {},
      scale: () => {},
      drawImage: () => {},
      fillText: () => {},
      strokeText: () => {},
      createLinearGradient: () => gradMock,
      createRadialGradient: () => gradMock,
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      lineCap: 'round',
      lineJoin: 'round',
      globalAlpha: 1,
      globalCompositeOperation: 'source-over',
      shadowBlur: 0,
      shadowColor: '',
      font: '',
      textAlign: 'center',
      textBaseline: 'middle',
    } as any

    const mockBands = { bass: 0.85, mid: 0.65, treble: 0.45, subBass: 0.9, overall: 0.68, isBeatHit: true }

    try {
      // 1. Text Mode test
      const textConfig = {
        ...DEFAULT_NEON_ENERGY_CONFIG,
        enabled: true,
        mode: 'text' as const,
        text: {
          ...DEFAULT_NEON_ENERGY_CONFIG.text,
          customText: 'CYBER\nPUNK',
        },
      }
      assert.doesNotThrow(() => {
        neonEnergyEngine.render(mockCtx, 1920, 1080, textConfig, mockBands, 2.5, 30.0)
      }, 'Neon text rendering must execute cleanly')

      // 2. Image Mode test
      const imageConfig = {
        ...DEFAULT_NEON_ENERGY_CONFIG,
        enabled: true,
        mode: 'image' as const,
        image: {
          logoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
          logoScale: 110,
        },
      }
      assert.doesNotThrow(() => {
        neonEnergyEngine.render(mockCtx, 1920, 1080, imageConfig, mockBands, 3.0, 30.0)
      }, 'Neon image logo rendering must execute cleanly')
    } finally {
      ;(globalThis as any).Image = originalImage
    }
  })
})
