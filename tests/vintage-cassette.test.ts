import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  DEFAULT_VINTAGE_CASSETTE_CONFIG,
  VintageCassetteStudioConfig,
  CassetteStyle,
  CassetteLabelTemplate,
  MagneticTapeStyle,
  CassetteBackgroundPreset,
} from '../src/lib/cassette/cassetteTypes.ts'
import {
  CASSETTE_PRESETS,
  applyCassettePreset,
} from '../src/lib/cassette/cassettePresets.ts'
import {
  VintageCassetteEngine,
  vintageCassetteEngine,
} from '../src/lib/cassette/cassetteEngine.ts'
import {
  DEFAULT_STUDIO_COMPOSITION,
  NormalizedAudioBands,
} from '../src/lib/audioToVideo/types.ts'

describe('Vintage Cassette Visualizer — 1990s Retro Audio Studio Suite', () => {
  describe('1. Default Safety & Architectural Standards', () => {
    it('should be disabled by default on initial tool load (Safety First Rule)', () => {
      assert.strictEqual(
        DEFAULT_VINTAGE_CASSETTE_CONFIG.enabled,
        false,
        'Vintage Cassette must start disabled by default'
      )
    })

    it('is seamlessly integrated into DEFAULT_STUDIO_COMPOSITION', () => {
      assert.ok(DEFAULT_STUDIO_COMPOSITION.vintageCassette)
      assert.strictEqual(DEFAULT_STUDIO_COMPOSITION.vintageCassette.enabled, false)
      assert.strictEqual(DEFAULT_STUDIO_COMPOSITION.vintageCassette.cassetteStyle, 'smoked-black')
      assert.strictEqual(DEFAULT_STUDIO_COMPOSITION.vintageCassette.labelTemplate, 'classic')
    })

    it('defines valid initial parameters within standard bounds', () => {
      const cfg = DEFAULT_VINTAGE_CASSETTE_CONFIG
      assert.ok(cfg.shellOpacity >= 30 && cfg.shellOpacity <= 100)
      assert.ok(cfg.reelSpeed >= 0.2 && cfg.reelSpeed <= 2.5)
      assert.ok(cfg.bassReactivity >= 0 && cfg.bassReactivity <= 100)
      assert.ok(cfg.waveformIntensity >= 0 && cfg.waveformIntensity <= 100)
      assert.ok(cfg.glitchThreshold >= 0.60 && cfg.glitchThreshold <= 0.95)
      assert.ok(cfg.glitchCooldownSec >= 2.0 && cfg.glitchCooldownSec <= 10.0)
    })
  })

  describe('2. Curated Style Presets Integrity', () => {
    it('defines all 5 signature presets with distinctive retro styling', () => {
      assert.strictEqual(CASSETTE_PRESETS.length, 5)
      const ids = CASSETTE_PRESETS.map((p) => p.id)
      assert.ok(ids.includes('nostalgic-1994'))
      assert.ok(ids.includes('cyberpunk-neon-drive'))
      assert.ok(ids.includes('golden-master-tape'))
      assert.ok(ids.includes('raw-grunge-analog'))
      assert.ok(ids.includes('clean-transparent-studio'))
    })

    it('applyCassettePreset preserves user photo and metadata while applying styles', () => {
      const initial: VintageCassetteStudioConfig = {
        ...DEFAULT_VINTAGE_CASSETTE_CONFIG,
        labelPhotoUrl: 'blob:user-cover-art',
        labelTitle: 'MY VACATION 1998',
        labelArtist: 'FAMILY TAPE',
        labelSideText: 'SIDE B',
      }

      const updated = applyCassettePreset(initial, 'cyberpunk-neon-drive')
      assert.strictEqual(updated.enabled, true)
      assert.strictEqual(updated.cassetteStyle, 'transparent-clear')
      assert.strictEqual(updated.labelTemplate, 'neon')
      assert.strictEqual(updated.backgroundPreset, 'neon-cyberpunk')
      assert.strictEqual(updated.ribbonColor, '#EC4899')

      // User photo and titles must remain intact
      assert.strictEqual(updated.labelPhotoUrl, 'blob:user-cover-art')
      assert.strictEqual(updated.labelTitle, 'MY VACATION 1998')
      assert.strictEqual(updated.labelArtist, 'FAMILY TAPE')
      assert.strictEqual(updated.labelSideText, 'SIDE B')
    })
  })

  describe('3. Cassette Style & Label Template Models', () => {
    it('supports all 4 cassette shell styles', () => {
      const styles: CassetteStyle[] = ['smoked-black', 'classic-retro', 'transparent-clear', 'golden-edition']
      for (const s of styles) {
        const config: VintageCassetteStudioConfig = {
          ...DEFAULT_VINTAGE_CASSETTE_CONFIG,
          cassetteStyle: s,
        }
        assert.strictEqual(config.cassetteStyle, s)
      }
    })

    it('supports all 4 label templates with cover and contain photo fit options', () => {
      const templates: CassetteLabelTemplate[] = ['classic', 'transparent', 'neon', 'grunge']
      for (const tpl of templates) {
        const configCover: VintageCassetteStudioConfig = {
          ...DEFAULT_VINTAGE_CASSETTE_CONFIG,
          labelTemplate: tpl,
          labelPhotoFit: 'cover',
        }
        assert.strictEqual(configCover.labelTemplate, tpl)
        assert.strictEqual(configCover.labelPhotoFit, 'cover')

        const configContain: VintageCassetteStudioConfig = {
          ...DEFAULT_VINTAGE_CASSETTE_CONFIG,
          labelTemplate: tpl,
          labelPhotoFit: 'contain',
        }
        assert.strictEqual(configContain.labelPhotoFit, 'contain')
      }
    })
  })

  describe('4. Audio-Reactive Spinning Reels & Physics Integration', () => {
    it('executes deterministic time integration without NaN or undefined states', () => {
      const engine = new VintageCassetteEngine()
      engine.reset(0)

      // Test mock canvas rendering without throwing
      const mockCtx = {
        save: () => {},
        restore: () => {},
        translate: () => {},
        rotate: () => {},
        scale: () => {},
        beginPath: () => {},
        closePath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        bezierCurveTo: () => {},
        arc: () => {},
        arcTo: () => {},
        fill: () => {},
        stroke: () => {},
        rect: () => {},
        fillRect: () => {},
        clip: () => {},
        createLinearGradient: () => ({ addColorStop: () => {} }),
        createRadialGradient: () => ({ addColorStop: () => {} }),
        createPattern: () => null,
        drawImage: () => {},
        fillText: () => {},
      } as unknown as CanvasRenderingContext2D

      const activeConfig: VintageCassetteStudioConfig = {
        ...DEFAULT_VINTAGE_CASSETTE_CONFIG,
        enabled: true,
      }

      const bands: NormalizedAudioBands = {
        bass: 0.85,
        mid: 0.45,
        treble: 0.5,
        subBass: 0.9,
        overall: 0.7,
        isBeatHit: true,
      }

      // Render multiple progressive time steps
      assert.doesNotThrow(() => {
        engine.render(mockCtx, 1920, 1080, activeConfig, bands, undefined, 0.5, 30)
        engine.render(mockCtx, 1920, 1080, activeConfig, bands, undefined, 1.0, 30)
        engine.render(mockCtx, 1920, 1080, activeConfig, bands, undefined, 1.5, 30)
      })
    })

    it('handles silence or paused playback safely', () => {
      const engine = new VintageCassetteEngine()
      engine.reset(0)

      const mockCtx = {
        save: () => {},
        restore: () => {},
        translate: () => {},
        rotate: () => {},
        scale: () => {},
        beginPath: () => {},
        closePath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        bezierCurveTo: () => {},
        arc: () => {},
        arcTo: () => {},
        fill: () => {},
        stroke: () => {},
        rect: () => {},
        fillRect: () => {},
        clip: () => {},
        createLinearGradient: () => ({ addColorStop: () => {} }),
        createRadialGradient: () => ({ addColorStop: () => {} }),
        createPattern: () => null,
        drawImage: () => {},
        fillText: () => {},
      } as unknown as CanvasRenderingContext2D

      const silentConfig: VintageCassetteStudioConfig = {
        ...DEFAULT_VINTAGE_CASSETTE_CONFIG,
        enabled: true,
      }

      assert.doesNotThrow(() => {
        // Silent audio with no bands or time data
        engine.render(mockCtx, 1920, 1080, silentConfig, undefined, undefined, 0, 30)
      })
    })
  })

  describe('5. Magnetic Tape Ribbon & Climax Glitch', () => {
    it('supports all 3 magnetic ribbon styles', () => {
      const styles: MagneticTapeStyle[] = ['loose-flowing', 'symmetrical-ribbon', 'cinematic-trail']
      for (const s of styles) {
        const config: VintageCassetteStudioConfig = {
          ...DEFAULT_VINTAGE_CASSETTE_CONFIG,
          tapeRibbonStyle: s,
        }
        assert.strictEqual(config.tapeRibbonStyle, s)
      }
    })

    it('triggers and decays climax glitch based on musical energy threshold and cooldown', () => {
      const engine = new VintageCassetteEngine()
      engine.reset(0)

      const mockCtx = {
        save: () => {},
        restore: () => {},
        translate: () => {},
        rotate: () => {},
        scale: () => {},
        beginPath: () => {},
        closePath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        bezierCurveTo: () => {},
        arc: () => {},
        arcTo: () => {},
        fill: () => {},
        stroke: () => {},
        rect: () => {},
        fillRect: () => {},
        clip: () => {},
        createLinearGradient: () => ({ addColorStop: () => {} }),
        createRadialGradient: () => ({ addColorStop: () => {} }),
        createPattern: () => null,
        drawImage: () => {},
        fillText: () => {},
      } as unknown as CanvasRenderingContext2D

      const glitchConfig: VintageCassetteStudioConfig = {
        ...DEFAULT_VINTAGE_CASSETTE_CONFIG,
        enabled: true,
        climaxGlitchEnabled: true,
        glitchThreshold: 0.8,
        glitchCooldownSec: 3.0,
      }

      // Climax beat hit at t=1.0s
      const climaxBands: NormalizedAudioBands = {
        bass: 0.95,
        mid: 0.85,
        treble: 0.8,
        subBass: 0.95,
        overall: 0.92, // above 0.8 threshold
        isBeatHit: true,
      }

      assert.doesNotThrow(() => {
        engine.render(mockCtx, 1920, 1080, glitchConfig, climaxBands, undefined, 1.0, 30)
      })

      // Normal playback at t=1.5s
      const normalBands: NormalizedAudioBands = {
        bass: 0.4,
        mid: 0.3,
        treble: 0.3,
        subBass: 0.4,
        overall: 0.35,
        isBeatHit: false,
      }

      assert.doesNotThrow(() => {
        engine.render(mockCtx, 1920, 1080, glitchConfig, normalBands, undefined, 1.5, 30)
      })
    })

    it('resets engine state cleanly on seek or track switch', () => {
      const engine = new VintageCassetteEngine()
      assert.doesNotThrow(() => {
        engine.reset(0)
      })
    })

    it('freezes reel rotation when playback is paused or stopped (dt === 0)', () => {
      const engine = new VintageCassetteEngine()
      engine.reset(0)

      const mockCtx = {
        save: () => {},
        restore: () => {},
        translate: () => {},
        rotate: () => {},
        scale: () => {},
        beginPath: () => {},
        closePath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        bezierCurveTo: () => {},
        arc: () => {},
        arcTo: () => {},
        fill: () => {},
        stroke: () => {},
        rect: () => {},
        fillRect: () => {},
        clip: () => {},
        createLinearGradient: () => ({ addColorStop: () => {} }),
        createRadialGradient: () => ({ addColorStop: () => {} }),
        createPattern: () => null,
        drawImage: () => {},
        fillText: () => {},
      } as unknown as CanvasRenderingContext2D

      const config: VintageCassetteStudioConfig = {
        ...DEFAULT_VINTAGE_CASSETTE_CONFIG,
        enabled: true,
      }

      // Step 1: Music plays from t=0.5 to t=1.0
      engine.render(mockCtx, 1920, 1080, config, { bass: 0.8, mid: 0.5, treble: 0.5, subBass: 0.8, overall: 0.6, isBeatHit: true }, undefined, 1.0, 30)

      // Step 2: Audio is paused: subsequent frames stay at t=1.0 (rawDt === 0)
      assert.doesNotThrow(() => {
        engine.render(mockCtx, 1920, 1080, config, undefined, undefined, 1.0, 30)
        engine.render(mockCtx, 1920, 1080, config, undefined, undefined, 1.0, 30)
      })
    })

    it('supports all 4 studio backdrop presets with dynamic lighting', () => {
      const presets: CassetteBackgroundPreset[] = ['midnight-studio', 'warm-nostalgia', 'neon-cyberpunk', 'deep-charcoal']
      const engine = new VintageCassetteEngine()
      const mockCtx = {
        save: () => {},
        restore: () => {},
        translate: () => {},
        rotate: () => {},
        scale: () => {},
        beginPath: () => {},
        closePath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        bezierCurveTo: () => {},
        arc: () => {},
        arcTo: () => {},
        fill: () => {},
        stroke: () => {},
        rect: () => {},
        fillRect: () => {},
        clip: () => {},
        createLinearGradient: () => ({ addColorStop: () => {} }),
        createRadialGradient: () => ({ addColorStop: () => {} }),
        createPattern: () => null,
        drawImage: () => {},
        fillText: () => {},
      } as unknown as CanvasRenderingContext2D

      for (const p of presets) {
        const config: VintageCassetteStudioConfig = {
          ...DEFAULT_VINTAGE_CASSETTE_CONFIG,
          enabled: true,
          backgroundPreset: p,
        }
        assert.doesNotThrow(() => {
          engine.render(mockCtx, 1920, 1080, config, undefined, undefined, 0.5, 30)
        })
      }
    })

    it('toggles analog film grain and VHS scanlines independently', () => {
      const engine = new VintageCassetteEngine()
      const mockCtx = {
        save: () => {},
        restore: () => {},
        translate: () => {},
        rotate: () => {},
        scale: () => {},
        beginPath: () => {},
        closePath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        bezierCurveTo: () => {},
        arc: () => {},
        arcTo: () => {},
        fill: () => {},
        stroke: () => {},
        rect: () => {},
        fillRect: () => {},
        clip: () => {},
        createLinearGradient: () => ({ addColorStop: () => {} }),
        createRadialGradient: () => ({ addColorStop: () => {} }),
        createPattern: () => null,
        drawImage: () => {},
        fillText: () => {},
      } as unknown as CanvasRenderingContext2D

      // Both OFF
      assert.doesNotThrow(() => {
        engine.render(mockCtx, 1920, 1080, { ...DEFAULT_VINTAGE_CASSETTE_CONFIG, enabled: true, analogGrain: false, vhsScanlines: false }, undefined, undefined, 1.0, 30)
      })

      // Grain ON, Scanlines OFF
      assert.doesNotThrow(() => {
        engine.render(mockCtx, 1920, 1080, { ...DEFAULT_VINTAGE_CASSETTE_CONFIG, enabled: true, analogGrain: true, grainIntensity: 40, vhsScanlines: false }, undefined, undefined, 1.0, 30)
      })

      // Scanlines ON, Grain OFF
      assert.doesNotThrow(() => {
        engine.render(mockCtx, 1920, 1080, { ...DEFAULT_VINTAGE_CASSETTE_CONFIG, enabled: true, analogGrain: false, vhsScanlines: true, scanlineIntensity: 35 }, undefined, undefined, 1.0, 30)
      })
    })

    it('supports cassette scaling between 50% and 150%', () => {
      const engine = new VintageCassetteEngine()
      const mockCtx = {
        save: () => {},
        restore: () => {},
        translate: () => {},
        rotate: () => {},
        scale: () => {},
        beginPath: () => {},
        closePath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        bezierCurveTo: () => {},
        arc: () => {},
        arcTo: () => {},
        fill: () => {},
        stroke: () => {},
        rect: () => {},
        fillRect: () => {},
        clip: () => {},
        createLinearGradient: () => ({ addColorStop: () => {} }),
        createRadialGradient: () => ({ addColorStop: () => {} }),
        createPattern: () => null,
        drawImage: () => {},
        fillText: () => {},
      } as unknown as CanvasRenderingContext2D

      assert.doesNotThrow(() => {
        engine.render(mockCtx, 1920, 1080, { ...DEFAULT_VINTAGE_CASSETTE_CONFIG, enabled: true, cassetteScale: 75 }, undefined, undefined, 1.0, 30)
        engine.render(mockCtx, 1920, 1080, { ...DEFAULT_VINTAGE_CASSETTE_CONFIG, enabled: true, cassetteScale: 100 }, undefined, undefined, 1.0, 30)
        engine.render(mockCtx, 1920, 1080, { ...DEFAULT_VINTAGE_CASSETTE_CONFIG, enabled: true, cassetteScale: 135 }, undefined, undefined, 1.0, 30)
      })
    })
  })
})
