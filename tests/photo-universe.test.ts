import { describe, it } from 'node:test'
import assert from 'node:assert'
import * as THREE from 'three'
import {
  DEFAULT_PHOTO_UNIVERSE_CONFIG,
  DEFAULT_UNIVERSE_BACKGROUND,
  DEFAULT_UNIVERSE_SUPERNOVA,
  DEFAULT_UNIVERSE_HOLOGRAPHIC_CONFIG,
  DEFAULT_UNIVERSE_LIQUID_LIGHT_CONFIG,
  UniverseLiquidLightConfig,
  LiquidLightMaterial,
  PhotoUniverseStudioConfig,
  UniversePhoto,
} from '../src/lib/photoUniverse/photoUniverseTypes.ts'
import {
  UNIVERSE_PRESETS,
  applyUniversePreset,
} from '../src/lib/photoUniverse/photoUniversePresets.ts'
import {
  generateUniverseSpatialNodes,
  PhotoSpatialNode,
} from '../src/lib/photoUniverse/universeLayout.ts'
import {
  UniverseCameraDirector,
  universeCameraDirector,
} from '../src/lib/photoUniverse/universeCameraDirector.ts'
import {
  UniverseBeatDetector,
  universeBeatDetector,
} from '../src/lib/photoUniverse/universeBeatDetector.ts'
import { universeAudioAnalyzer } from '../src/lib/photoUniverse/universeAudioAnalyzer.ts'
import { universeCameraScoreGenerator } from '../src/lib/photoUniverse/universeCameraScore.ts'
import { universeBackgroundRenderer } from '../src/lib/photoUniverse/universeBackground.ts'
import { universeEngine } from '../src/lib/photoUniverse/universeEngine.ts'
import { universeSupernovaManager } from '../src/lib/photoUniverse/universeSupernova.ts'
import {
  universeHolographicCards,
  createRoundedRectShape,
  calculateHoloSpectralColor,
} from '../src/lib/photoUniverse/universeHolographicCards.ts'
import {
  universeLiquidLight,
  createLiquidRibbonGeometry,
} from '../src/lib/photoUniverse/universeLiquidLight.ts'
import {
  DEFAULT_STUDIO_COMPOSITION,
  NormalizedAudioBands,
} from '../src/lib/audioToVideo/types.ts'

describe('Floating Photo Universe Studio — 3D Music-Driven Cinematic Suite', () => {
  const samplePhotos: UniversePhoto[] = [
    { id: 'p1', url: 'blob:p1', name: 'landscape_16_9.jpg', aspectRatio: 16 / 9 },
    { id: 'p2', url: 'blob:p2', name: 'portrait_9_16.jpg', aspectRatio: 9 / 16 },
    { id: 'p3', url: 'blob:p3', name: 'square_1_1.jpg', aspectRatio: 1.0 },
    { id: 'p4', url: 'blob:p4', name: 'classic_4_3.jpg', aspectRatio: 4 / 3 },
  ]

  describe('1. Default Safety & Architectural Standards', () => {
    it('should be disabled by default on initial tool load (Safety First Rule)', () => {
      assert.strictEqual(
        DEFAULT_PHOTO_UNIVERSE_CONFIG.enabled,
        false,
        'Photo universe must be off by default'
      )
      assert.strictEqual(
        DEFAULT_PHOTO_UNIVERSE_CONFIG.photos.length,
        0,
        'Photos collection must start empty'
      )
    })

    it('should be integrated into DEFAULT_STUDIO_COMPOSITION', () => {
      assert.ok(DEFAULT_STUDIO_COMPOSITION.photoUniverse)
      assert.strictEqual(DEFAULT_STUDIO_COMPOSITION.photoUniverse.enabled, false)
    })
  })

  describe('2. Curated Presets Integrity', () => {
    it('defines all 5 signature presets with complete visual configs', () => {
      assert.strictEqual(UNIVERSE_PRESETS.length, 5)
      const ids = UNIVERSE_PRESETS.map((p) => p.id)
      assert.ok(ids.includes('cosmic-gallery'))
      assert.ok(ids.includes('rhythmic-beat-odyssey'))
      assert.ok(ids.includes('dreamy-memory-drift'))
      assert.ok(ids.includes('kinetic-helix-orbit'))
      assert.ok(ids.includes('clean-minimalist-showcase'))
    })

    it('applyUniversePreset preserves user photos and manual orders while applying styles', () => {
      const initial: PhotoUniverseStudioConfig = {
        ...DEFAULT_PHOTO_UNIVERSE_CONFIG,
        enabled: true,
        photos: samplePhotos,
        manualOrder: ['p3', 'p1', 'p2', 'p4'],
      }

      const updated = applyUniversePreset(initial, 'rhythmic-beat-odyssey')
      assert.strictEqual(updated.cameraStyle, 'rhythmic-flight')
      assert.strictEqual(updated.photos.length, 4)
      assert.strictEqual(updated.manualOrder[0], 'p3')
      assert.strictEqual(updated.enabled, true)
    })
  })

  describe('3. 3D Spatial Universe Layout Generator', () => {
    it('generates spatial nodes for photos with preserved aspect ratios', () => {
      const nodes = generateUniverseSpatialNodes(samplePhotos, 100, 1600, 1.0)
      assert.strictEqual(nodes.length, 4)

      // Node 0: Landscape 16:9
      const aspect0 = nodes[0].worldWidth / nodes[0].worldHeight
      assert.ok(Math.abs(aspect0 - 16 / 9) < 0.05, '16:9 aspect ratio must be preserved')

      // Node 1: Portrait 9:16
      const aspect1 = nodes[1].worldWidth / nodes[1].worldHeight
      assert.ok(Math.abs(aspect1 - 9 / 16) < 0.05, '9:16 aspect ratio must be preserved')

      // Node 2: Square 1:1
      const aspect2 = nodes[2].worldWidth / nodes[2].worldHeight
      assert.ok(Math.abs(aspect2 - 1.0) < 0.05, '1:1 aspect ratio must be preserved')
    })

    it('distributes photos in depth corridor without collapsing on same coordinates', () => {
      const nodes = generateUniverseSpatialNodes(samplePhotos, 120, 2000, 1.0)

      for (let i = 0; i < nodes.length - 1; i++) {
        const n1 = nodes[i]
        const n2 = nodes[i + 1]
        // Depths must progress into space (z is negative)
        assert.ok(n2.position.z < n1.position.z, 'Subsequent photos must progress in depth')

        // Must maintain minimum distance
        const dx = n2.position.x - n1.position.x
        const dy = n2.position.y - n1.position.y
        const dz = n2.position.z - n1.position.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        assert.ok(dist > 100, 'Distance between adjacent photo centers must exceed 100 units')
      }
    })

    it('calculates distinct approach, focus, and fly-by camera positions for each photo', () => {
      const nodes = generateUniverseSpatialNodes(samplePhotos)
      nodes.forEach((node) => {
        assert.ok(node.cameraApproachPos)
        assert.ok(node.cameraFocusPos)
        assert.ok(node.cameraFlyByPos)

        // Approach position must be further back than focus position
        const distApproach = Math.sqrt(
          Math.pow(node.cameraApproachPos.x - node.position.x, 2) +
            Math.pow(node.cameraApproachPos.y - node.position.y, 2) +
            Math.pow(node.cameraApproachPos.z - node.position.z, 2)
        )
        const distFocus = Math.sqrt(
          Math.pow(node.cameraFocusPos.x - node.position.x, 2) +
            Math.pow(node.cameraFocusPos.y - node.position.y, 2) +
            Math.pow(node.cameraFocusPos.z - node.position.z, 2)
        )
        assert.ok(distApproach > distFocus, 'Approach distance must be greater than focus distance')
      })
    })

    it('handles empty photo array gracefully without throwing', () => {
      const nodes = generateUniverseSpatialNodes([])
      assert.strictEqual(nodes.length, 0)
    })
  })

  describe('4. Signature Camera Director & Flight Path Interpolator', () => {
    it('smoothly transitions camera across phases (approach, focus, fly-by, transition)', () => {
      const nodes = generateUniverseSpatialNodes(samplePhotos)
      const director = new UniverseCameraDirector()

      // Evaluate at different time intervals within a 4-second stop
      const stateEarly = director.evaluateCamera(nodes, 0.4, 'smooth-cinematic', 1.0, 4.0)
      assert.strictEqual(stateEarly.travelPhase, 'approach')

      const stateMid = director.evaluateCamera(nodes, 2.0, 'smooth-cinematic', 1.0, 4.0)
      assert.strictEqual(stateMid.travelPhase, 'focus')
      assert.strictEqual(stateMid.focusWeight, 1.0)

      const stateLate = director.evaluateCamera(nodes, 3.1, 'smooth-cinematic', 1.0, 4.0)
      assert.strictEqual(stateLate.travelPhase, 'fly-by')

      const stateTransition = director.evaluateCamera(nodes, 3.7, 'smooth-cinematic', 1.0, 4.0)
      assert.strictEqual(stateTransition.travelPhase, 'transition')
    })

    it('produces distinct camera positions for different camera movement styles', () => {
      const nodes = generateUniverseSpatialNodes(samplePhotos)
      const director = new UniverseCameraDirector()

      const cinematicState = director.evaluateCamera(nodes, 2.0, 'smooth-cinematic', 1.0, 4.0)
      const orbitState = director.evaluateCamera(nodes, 2.0, 'energetic-orbit', 1.0, 4.0)
      const dreamState = director.evaluateCamera(nodes, 2.0, 'slow-dream', 1.0, 4.0)

      assert.notDeepStrictEqual(cinematicState.position, orbitState.position)
      assert.notDeepStrictEqual(orbitState.position, dreamState.position)
    })

    it('respects manual path sequence order when directorMode is manual', () => {
      const nodes = generateUniverseSpatialNodes(samplePhotos)
      const director = new UniverseCameraDirector()
      const manualOrder = ['p4', 'p2', 'p1', 'p3']

      const orderIndices = director.getTargetOrder(nodes, 'manual', manualOrder)
      assert.strictEqual(nodes[orderIndices[0]].photo.id, 'p4')
      assert.strictEqual(nodes[orderIndices[1]].photo.id, 'p2')
      assert.strictEqual(nodes[orderIndices[2]].photo.id, 'p1')
      assert.strictEqual(nodes[orderIndices[3]].photo.id, 'p3')
    })
  })

  describe('5. Web Audio Beat & Transient Impulse Detector', () => {
    it('detects strong bass transient impulses and produces bounded shake offsets', () => {
      const detector = new UniverseBeatDetector()

      const heavyBassBands: NormalizedAudioBands = {
        subBass: 0.95,
        bass: 0.90,
        mid: 0.30,
        treble: 0.15,
        overall: 0.70,
        isBeatHit: true,
      }

      const state = detector.process(
        heavyBassBands,
        1.0,
        65, // sensitivity
        50, // shake intensity
        0.2, // duration
        15, // max displacement
        true
      )

      assert.strictEqual(state.isBassImpact, true)
      assert.ok(state.bassImpactStrength > 0)
      assert.ok(Math.abs(state.shakeOffset.x) <= 15)
      assert.ok(Math.abs(state.shakeOffset.y) <= 15)
      assert.ok(Math.abs(state.shakeOffset.z) <= 15)
    })

    it('returns zero shake displacement when audio is silent or uninitialized', () => {
      const detector = new UniverseBeatDetector()
      const silentState = detector.process(undefined, 2.0)

      assert.strictEqual(silentState.isBassImpact, false)
      assert.strictEqual(silentState.shakeOffset.x, 0)
      assert.strictEqual(silentState.shakeOffset.y, 0)
      assert.strictEqual(silentState.shakeOffset.z, 0)
    })

    it('scales travel velocity dynamically based on musical energy', () => {
      const detector = new UniverseBeatDetector()

      const quietBands: NormalizedAudioBands = {
        subBass: 0.05,
        bass: 0.05,
        mid: 0.05,
        treble: 0.05,
        overall: 0.05,
        isBeatHit: false,
      }

      const highEnergyBands: NormalizedAudioBands = {
        subBass: 0.9,
        bass: 0.85,
        mid: 0.75,
        treble: 0.65,
        overall: 0.85,
        isBeatHit: true,
      }

      // Warm up detector
      detector.process(quietBands, 0.1)
      const quietState = detector.process(quietBands, 0.2)

      detector.reset()
      detector.process(highEnergyBands, 0.1)
      const energeticState = detector.process(highEnergyBands, 0.2)

      assert.ok(
        energeticState.speedMultiplier > quietState.speedMultiplier,
        'High musical energy must increase camera flight speed relative to quiet passages'
      )
    })
  })

  describe('6. Universe 2.0 Local Audio Analysis & Movement Profiles', () => {
    it('generates deterministic fallback analysis with complete energy timeline', () => {
      const fallback = universeAudioAnalyzer.generateFallbackAnalysis(30, 'steady-rhythm')
      assert.strictEqual(fallback.detectedProfile, 'steady-rhythm')
      assert.strictEqual(fallback.durationSec, 30)
      assert.ok(fallback.timelinePoints.length > 50, 'Timeline points should be generated')
      assert.ok(fallback.recommendedHoldDuration > 2.0)
      assert.ok(fallback.recommendedBaseSpeed > 0.5)
    })

    it('classifies profiles and assigns appropriate hold durations', () => {
      const ambient = universeAudioAnalyzer.generateFallbackAnalysis(40, 'melody-ambient')
      const rhythm = universeAudioAnalyzer.generateFallbackAnalysis(40, 'steady-rhythm')

      assert.ok(
        ambient.recommendedHoldDuration >= rhythm.recommendedHoldDuration,
        'Ambient profile should provide longer or equal hold durations than rhythm profile'
      )
    })
  })

  describe('7. Universe 2.0 Timestamped Camera Score Generator', () => {
    it('builds deterministic camera score covering full duration without time gaps', () => {
      const analysis = universeAudioAnalyzer.generateFallbackAnalysis(25, 'balanced-cinematic')
      const score = universeCameraScoreGenerator.generateScore(
        samplePhotos,
        DEFAULT_PHOTO_UNIVERSE_CONFIG,
        analysis,
        25
      )

      assert.ok(score.segments.length > 0)
      assert.strictEqual(score.totalDuration, 25)

      // Verify continuity across segments
      for (let i = 0; i < score.segments.length - 1; i++) {
        const curr = score.segments[i]
        const next = score.segments[i + 1]
        assert.ok(
          Math.abs(curr.endTime - next.startTime) < 0.001,
          'Segment timestamps must be contiguous'
        )
      }

      // Verify sub-phase breakdowns sum to segment duration
      score.segments.forEach((seg) => {
        const subTotal =
          seg.approachDuration +
          seg.settleDuration +
          seg.holdDuration +
          seg.departureDuration +
          seg.transitionDuration
        assert.ok(
          Math.abs(subTotal - seg.duration) < 0.01,
          'Sub-phases must sum exactly to segment duration'
        )
      })
    })

    it('accurately resolves active segment and sub-phase at any given timestamp', () => {
      const analysis = universeAudioAnalyzer.generateFallbackAnalysis(20, 'dream-cinema' as any)
      const score = universeCameraScoreGenerator.generateScore(
        samplePhotos,
        DEFAULT_PHOTO_UNIVERSE_CONFIG,
        analysis,
        20
      )

      const active = universeCameraScoreGenerator.getSegmentAtTime(score, 5.0)
      assert.ok(active, 'Must find active segment at t=5.0s')
      assert.ok(
        ['approach', 'settle', 'hold', 'departure', 'transition'].includes(active.subPhase)
      )
      assert.ok(active.subProgress >= 0 && active.subProgress <= 1.0)
    })
  })

  describe('8. Universe 2.0 Static Photo Orientation & Focus Protection', () => {
    it('sets static orientation by default (no continuous spin)', () => {
      assert.strictEqual(
        DEFAULT_PHOTO_UNIVERSE_CONFIG.photoMotion,
        'static',
        'Photo motion must default to static'
      )
      assert.strictEqual(
        DEFAULT_PHOTO_UNIVERSE_CONFIG.enableRotation,
        false,
        'Rotation must default to false'
      )
    })

    it('suppresses bass shake during focus hold sub-phase for readability', () => {
      const analysis = universeAudioAnalyzer.generateFallbackAnalysis(20, 'balanced-cinematic')
      const score = universeCameraScoreGenerator.generateScore(
        samplePhotos,
        DEFAULT_PHOTO_UNIVERSE_CONFIG,
        analysis,
        20
      )

      const nodes = generateUniverseSpatialNodes(samplePhotos)
      const director = new UniverseCameraDirector()

      // Find a timestamp that falls in the hold sub-phase
      let holdTime = -1
      for (let t = 0; t < 15; t += 0.2) {
        const res = universeCameraScoreGenerator.getSegmentAtTime(score, t)
        if (res && res.subPhase === 'hold') {
          holdTime = t
          break
        }
      }

      assert.ok(holdTime > 0, 'Should find a hold sub-phase time window')
      const stateDuringHold = director.evaluateCamera(nodes, holdTime, score)
      assert.strictEqual(
        stateDuringHold.shakeAllowed,
        false,
        'Camera shake must be strictly prohibited during focus hold'
      )
    })
  })

  describe('9. Universe 2.0 Background Renderer Models', () => {
    it('configures default Deep Space with multi-layered starfield', () => {
      assert.strictEqual(DEFAULT_UNIVERSE_BACKGROUND.type, 'deep-space')
      assert.strictEqual(DEFAULT_UNIVERSE_BACKGROUND.starCount, 2200)
      assert.strictEqual(DEFAULT_UNIVERSE_BACKGROUND.galaxyTint, 'cosmic-blue')
    })

    it('supports custom user-imported background configuration', () => {
      const customConfig: PhotoUniverseStudioConfig = {
        ...DEFAULT_PHOTO_UNIVERSE_CONFIG,
        background: {
          type: 'custom-image',
          customImage: {
            url: 'blob:test-custom-bg',
            name: 'my-nebula.png',
            fitMode: 'cover',
            brightness: 110,
            blur: 4,
            parallaxEnabled: true,
          },
          starCount: 1500,
          galaxyTint: 'mystic-violet',
          nebulaGlow: 40,
        },
      }

      assert.strictEqual(customConfig.background.type, 'custom-image')
      assert.ok(customConfig.background.customImage)
      assert.strictEqual(customConfig.background.customImage.brightness, 110)
    })

    it('renders non-black celestial space environment directly to 2D canvas', () => {
      const recordedDraws: string[] = []
      const mockGradient = {
        addColorStop: (offset: number, color: string) => {
          recordedDraws.push(`grad_stop:${color}`)
        },
      }
      const mockCtx = {
        save: () => recordedDraws.push('save'),
        restore: () => recordedDraws.push('restore'),
        fillRect: (x: number, y: number, w: number, h: number) => recordedDraws.push(`fillRect:${w}x${h}`),
        beginPath: () => recordedDraws.push('beginPath'),
        arc: () => recordedDraws.push('arc'),
        fill: () => recordedDraws.push('fill'),
        stroke: () => recordedDraws.push('stroke'),
        moveTo: () => {},
        lineTo: () => {},
        createRadialGradient: () => mockGradient,
        createLinearGradient: () => mockGradient,
        drawImage: () => recordedDraws.push('drawImage'),
        globalCompositeOperation: 'source-over',
        globalAlpha: 1.0,
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
      } as unknown as CanvasRenderingContext2D

      universeBackgroundRenderer.renderToCanvas(
        mockCtx,
        1280,
        720,
        DEFAULT_UNIVERSE_BACKGROUND,
        0,
        0,
        1.5
      )

      assert.ok(recordedDraws.length > 20, 'Should execute multiple canvas draw operations for stars and nebulae')
      const filledCanvas = recordedDraws.some((d) => d.startsWith('fillRect:1280x720'))
      assert.ok(filledCanvas, 'Should fill entire canvas with space gradient')
    })

    it('safely handles missing or uninitialized custom image without throwing or clearing to black', () => {
      const mockGradient = { addColorStop: () => {} }
      let fillRectCount = 0
      const mockCtx = {
        save: () => {},
        restore: () => {},
        fillRect: () => { fillRectCount++ },
        beginPath: () => {},
        arc: () => {},
        fill: () => {},
        stroke: () => {},
        moveTo: () => {},
        lineTo: () => {},
        createRadialGradient: () => mockGradient,
        createLinearGradient: () => mockGradient,
        drawImage: () => {},
        globalCompositeOperation: 'source-over',
        globalAlpha: 1.0,
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
      } as unknown as CanvasRenderingContext2D

      // Test with null custom image url
      universeBackgroundRenderer.renderToCanvas(
        mockCtx,
        1280,
        720,
        {
          type: 'custom-image',
          customImage: null,
          starCount: 2000,
          galaxyTint: 'cosmic-blue',
          nebulaGlow: 50,
        },
        0,
        0,
        2.0
      )

      assert.ok(fillRectCount > 0, 'Must fallback to default space and render fillRect')
    })
  })

  describe('10. Universe Engine Integration & Score Caching', () => {
    it('regenerates score when requested and exposes planned segments', () => {
      const score = universeEngine.regenerateScore(
        {
          ...DEFAULT_PHOTO_UNIVERSE_CONFIG,
          photos: samplePhotos,
        },
        30
      )

      assert.ok(score)
      assert.ok(score.segments.length > 0)
      assert.strictEqual(universeEngine.getCurrentScore(), score)
    })
  })

  describe('11. Light Trails Deprecation & Clean Removal', () => {
    it('confirms lightTrails configuration is completely removed from studio defaults', () => {
      // @ts-expect-error verifying property is deleted
      assert.strictEqual(DEFAULT_PHOTO_UNIVERSE_CONFIG.lightTrails, undefined)
    })
  })

  describe('12. Supernova Shockwave: Cinematic Music Climax Suite', () => {
    const testPhotos = [
      { id: 'p1', x: 200, y: 100, z: -400 },
      { id: 'p2', x: -220, y: 150, z: -500 },
      { id: 'p3', x: 0, y: -200, z: -350 },
    ]

    it('validates default Supernova configuration values and boundaries', () => {
      assert.strictEqual(DEFAULT_UNIVERSE_SUPERNOVA.enabled, true)
      assert.strictEqual(DEFAULT_UNIVERSE_SUPERNOVA.triggerSensitivity, 'balanced')
      assert.strictEqual(DEFAULT_UNIVERSE_SUPERNOVA.explosionIntensity, 75)
      assert.strictEqual(DEFAULT_UNIVERSE_SUPERNOVA.attractionStrength, 60)
      assert.strictEqual(DEFAULT_UNIVERSE_SUPERNOVA.shockwaveRadius, 750)
      assert.strictEqual(DEFAULT_UNIVERSE_SUPERNOVA.flashBrightness, 80)
      assert.strictEqual(DEFAULT_UNIVERSE_SUPERNOVA.cameraImpact, 65)
      assert.strictEqual(DEFAULT_UNIVERSE_SUPERNOVA.recoveryDuration, 2.5)
      assert.strictEqual(DEFAULT_UNIVERSE_SUPERNOVA.cooldownDuration, 12)
      assert.strictEqual(DEFAULT_UNIVERSE_SUPERNOVA.maxEventsPerTrack, 3)
    })

    it('generates deterministic climax timestamps in audio fallback analysis', () => {
      const analysis = universeAudioAnalyzer.generateFallbackAnalysis(30, 'steady-rhythm')
      assert.ok(analysis.climaxTimestamps)
      assert.ok(analysis.climaxTimestamps.length > 0)
      assert.ok(analysis.climaxTimestamps[0] >= 5.0, 'First climax must not happen immediately in intro')
    })

    it('executes the full state machine from trigger to attraction, supernova, expansion, recovery, and idle', () => {
      universeSupernovaManager.reset()

      // Trigger manual supernova at t=10.0s
      universeSupernovaManager.triggerManual(10.0, DEFAULT_UNIVERSE_SUPERNOVA)

      // 1. Attraction Phase (at t=10.5s)
      const stateAttract = universeSupernovaManager.evaluate(10.5, testPhotos, DEFAULT_UNIVERSE_SUPERNOVA)
      assert.strictEqual(stateAttract.phase, 'attraction')
      assert.ok(stateAttract.progress > 0 && stateAttract.progress < 1.0)
      assert.ok(stateAttract.photoDisplacements.has('p1'))
      // p1 at x=200 should have a negative displacement towards center (x=0)
      const p1Disp = stateAttract.photoDisplacements.get('p1')!
      assert.ok(p1Disp.x < 0, 'Photo must experience attraction force toward center x=0')

      // 2. Supernova Flash Phase (at t=11.45s, around climaxTime 11.35s)
      const stateFlash = universeSupernovaManager.evaluate(11.45, testPhotos, DEFAULT_UNIVERSE_SUPERNOVA)
      assert.strictEqual(stateFlash.phase, 'supernova')
      assert.ok(stateFlash.flashAlpha > 0, 'Flash alpha must peak during supernova')
      assert.ok(stateFlash.shockwaveRadius > 0, 'Shockwave radius must initiate')
      assert.ok(Math.abs(stateFlash.cameraImpulse.z) > 0, 'Camera must experience shockwave impulse kick')

      // 3. Radial Expansion Phase (at t=12.0s)
      const stateExpand = universeSupernovaManager.evaluate(12.0, testPhotos, DEFAULT_UNIVERSE_SUPERNOVA)
      assert.strictEqual(stateExpand.phase, 'expansion')
      assert.ok(stateExpand.shockwaveRadius > stateFlash.shockwaveRadius, 'Shockwave radius must expand outward')
      assert.ok(stateExpand.photoDisplacements.size === 3)

      // 4. Recovery Phase (at t=13.5s)
      const stateRecovery = universeSupernovaManager.evaluate(13.5, testPhotos, DEFAULT_UNIVERSE_SUPERNOVA)
      assert.strictEqual(stateRecovery.phase, 'recovery')
      assert.ok(stateRecovery.progress >= 0 && stateRecovery.progress <= 1.0)

      // 5. Idle Phase (at t=17.0s after complete recovery duration)
      const stateIdle = universeSupernovaManager.evaluate(17.0, testPhotos, DEFAULT_UNIVERSE_SUPERNOVA)
      assert.strictEqual(stateIdle.phase, 'idle')
      assert.strictEqual(stateIdle.flashAlpha, 0)
      assert.strictEqual(stateIdle.shockwaveRadius, 0)
    })

    it('renders 2D Canvas shockwave and core flash effects without throwing', () => {
      const state = universeSupernovaManager.evaluate(11.45, testPhotos, DEFAULT_UNIVERSE_SUPERNOVA)
      const mockGradient = { addColorStop: () => {} }
      const mockCtx = {
        save: () => {},
        restore: () => {},
        beginPath: () => {},
        arc: () => {},
        stroke: () => {},
        fill: () => {},
        fillRect: () => {},
        createRadialGradient: () => mockGradient,
        globalCompositeOperation: 'source-over',
        strokeStyle: '',
        fillStyle: '',
        lineWidth: 1,
      } as unknown as CanvasRenderingContext2D

      assert.doesNotThrow(() => {
        universeSupernovaManager.renderCanvasEffects(mockCtx, 1280, 720, state, DEFAULT_UNIVERSE_SUPERNOVA)
      })
    })

    it('preserves supernova configuration when applying universe presets', () => {
      const customConfig: PhotoUniverseStudioConfig = {
        ...DEFAULT_PHOTO_UNIVERSE_CONFIG,
        supernova: {
          ...DEFAULT_UNIVERSE_SUPERNOVA,
          explosionIntensity: 90,
          shockwaveRadius: 900,
          triggerSensitivity: 'high',
        },
      }

      const presetApplied = applyUniversePreset(customConfig, 'rhythmic-beat-odyssey')
      assert.strictEqual(presetApplied.supernova.explosionIntensity, 90)
      assert.strictEqual(presetApplied.supernova.shockwaveRadius, 900)
      assert.strictEqual(presetApplied.supernova.triggerSensitivity, 'high')
    })
  })

  describe('13. Cinematic Music Experience Choreography & Reverse Side Integrity', () => {
    it('defaults transitionFrequency to balanced and rotation to disabled', () => {
      assert.strictEqual(DEFAULT_PHOTO_UNIVERSE_CONFIG.transitionFrequency, 'balanced')
      assert.strictEqual(DEFAULT_PHOTO_UNIVERSE_CONFIG.enableRotation, false)
      assert.strictEqual(DEFAULT_PHOTO_UNIVERSE_CONFIG.photoMotion, 'static')
    })

    it('assigns deliberate cinematic shot types and musical motivations to score segments', () => {
      const analysis = universeAudioAnalyzer.generateFallbackAnalysis(32, 'balanced-cinematic')
      const score = universeCameraScoreGenerator.generateScore(
        samplePhotos,
        DEFAULT_PHOTO_UNIVERSE_CONFIG,
        analysis,
        32
      )

      const validShotTypes = [
        'cinematic-approach',
        'hero-reveal',
        'emotional-hold',
        'focus-handoff',
        'orbital-drift',
        'deep-space-journey',
        'climax-reveal',
        'outro-linger',
      ]
      const validMotivations = [
        'intro-emergence',
        'phrase-boundary',
        'melody-swell',
        'rhythm-cadence',
        'drop-climax',
        'energy-transition',
        'outro-linger',
      ]

      assert.ok(score.segments.length > 0)
      score.segments.forEach((seg, idx) => {
        assert.ok(
          validShotTypes.includes(seg.shotType),
          `Segment ${idx} shotType "${seg.shotType}" must be valid`
        )
        assert.ok(
          validMotivations.includes(seg.motivation),
          `Segment ${idx} motivation "${seg.motivation}" must be valid`
        )
        assert.ok(seg.visualEntrance, `Segment ${idx} must have visualEntrance configuration`)
        assert.ok(seg.visualEntrance.targetOpacity === 1.0)
        assert.ok(seg.approachDuration > 0)
      })

      // The first segment should be intro-emergence or hero-reveal
      assert.ok(
        score.segments[0].shotType === 'hero-reveal' ||
          score.segments[0].motivation === 'intro-emergence'
      )
    })

    it('ensures camera fly-by stay strictly in front of the photo corridor (never behind into blackness)', () => {
      const nodes = generateUniverseSpatialNodes(samplePhotos)
      nodes.forEach((node, idx) => {
        assert.ok(
          node.cameraFlyByPos.z > node.position.z,
          `Node ${idx}: camera fly-by z (${node.cameraFlyByPos.z}) must stay in front of photo z (${node.position.z})`
        )
      })
    })

    it('modulates shot duration based on transitionFrequency setting', () => {
      const analysis = universeAudioAnalyzer.generateFallbackAnalysis(40, 'balanced-cinematic')

      const relaxedScore = universeCameraScoreGenerator.generateScore(
        samplePhotos,
        { ...DEFAULT_PHOTO_UNIVERSE_CONFIG, transitionFrequency: 'relaxed' },
        analysis,
        40
      )

      const dynamicScore = universeCameraScoreGenerator.generateScore(
        samplePhotos,
        { ...DEFAULT_PHOTO_UNIVERSE_CONFIG, transitionFrequency: 'dynamic' },
        analysis,
        40
      )

      const avgRelaxed =
        relaxedScore.segments.reduce((acc, s) => acc + s.duration, 0) /
        relaxedScore.segments.length
      const avgDynamic =
        dynamicScore.segments.reduce((acc, s) => acc + s.duration, 0) /
        dynamicScore.segments.length

      assert.ok(
        avgRelaxed > avgDynamic,
        `Relaxed pacing (avg ${avgRelaxed.toFixed(2)}s) must provide longer shot durations than dynamic pacing (avg ${avgDynamic.toFixed(2)}s)`
      )
    })

    it('cycles shot types for small collections so repeated visits feel fresh and intentional', () => {
      const twoPhotos = [samplePhotos[0], samplePhotos[1]]
      const analysis = universeAudioAnalyzer.generateFallbackAnalysis(30, 'steady-rhythm')

      const score = universeCameraScoreGenerator.generateScore(
        twoPhotos,
        DEFAULT_PHOTO_UNIVERSE_CONFIG,
        analysis,
        30
      )

      // Get all segments for photo 0
      const p0Segments = score.segments.filter((s) => s.targetPhotoId === 'p1')
      if (p0Segments.length >= 2) {
        // Repeated visits to the same photo should cycle shot types
        const shotTypes = new Set(p0Segments.map((s) => s.shotType))
        assert.ok(
          shotTypes.size >= 2,
          'Multiple visits to the same photo should utilize distinct shot types'
        )
      }
    })
  })

  describe('14. Holographic Memory Cards: 3D Crystal-Glass Photo Frames', () => {
    it('initializes with default crystal glass holographic configuration', () => {
      assert.strictEqual(DEFAULT_UNIVERSE_HOLOGRAPHIC_CONFIG.enabled, true)
      assert.strictEqual(DEFAULT_UNIVERSE_HOLOGRAPHIC_CONFIG.cardStyle, 'crystal-glass')
      assert.strictEqual(DEFAULT_UNIVERSE_HOLOGRAPHIC_CONFIG.edgeReflectionIntensity, 65)
      assert.strictEqual(DEFAULT_UNIVERSE_HOLOGRAPHIC_CONFIG.rainbowSpectrumIntensity, 50)
      assert.strictEqual(DEFAULT_UNIVERSE_HOLOGRAPHIC_CONFIG.glassTransparency, 75)
      assert.strictEqual(DEFAULT_UNIVERSE_HOLOGRAPHIC_CONFIG.cornerRadius, 16)
      assert.strictEqual(DEFAULT_UNIVERSE_HOLOGRAPHIC_CONFIG.angleResponsive, true)
      assert.strictEqual(DEFAULT_UNIVERSE_HOLOGRAPHIC_CONFIG.musicReactivity, 'subtle')
      assert.strictEqual(DEFAULT_UNIVERSE_HOLOGRAPHIC_CONFIG.photoFit, 'cover')
    })

    it('creates smooth rounded rectangular geometry without degenerating when radius is 0 or positive', () => {
      const roundedShape = createRoundedRectShape(200, 150, 16)
      assert.ok(roundedShape)
      const points = roundedShape.getPoints(12)
      assert.ok(points.length > 10, 'Rounded shape must have multiple contour points')

      const squareShape = createRoundedRectShape(200, 150, 0)
      assert.ok(squareShape)
      const sqPoints = squareShape.getPoints(4)
      assert.ok(sqPoints.length >= 4, 'Zero radius shape must form valid polygon')
    })

    it('calculates spectral rainbow edge reflections responding to camera viewing angle', () => {
      const headOn = calculateHoloSpectralColor('crystal-glass', 0, 0, 50)
      const obliqueAngle = calculateHoloSpectralColor('crystal-glass', Math.PI * 0.45, 0, 50)

      assert.ok(headOn.outerBevelColor)
      assert.ok(obliqueAngle.outerBevelColor)
      // Different viewing angles must produce distinct spectral refraction colors
      assert.notDeepStrictEqual(headOn.outerBevelColor.getHex(), obliqueAngle.outerBevelColor.getHex())

      // Aurora glass style check
      const aurora = calculateHoloSpectralColor('aurora-glass', 0, 0, 60)
      assert.strictEqual(aurora.glassBaseColor, 0x120822)
      assert.ok(aurora.sheenTint)

      // Silver prism style check
      const silver = calculateHoloSpectralColor('silver-prism', 0, 0, 60)
      assert.strictEqual(silver.glassBaseColor, 0x0f172a)

      // Minimal glass style check
      const minimal = calculateHoloSpectralColor('minimal-glass', 0, 0, 20)
      assert.strictEqual(minimal.glassBaseColor, 0x090d16)
    })

    it('builds complete 3D card assembly with transparent chassis, photo, bevels & specular sheen', () => {
      const nodes = generateUniverseSpatialNodes(samplePhotos)
      const group = new THREE.Group()

      universeHolographicCards.buildCardHierarchy(
        group,
        nodes[0],
        DEFAULT_UNIVERSE_HOLOGRAPHIC_CONFIG,
        null
      )

      const glassChassis = group.getObjectByName('glassChassisMesh') as THREE.Mesh
      const outerBevel = group.getObjectByName('outerBevelLine') as THREE.LineLoop
      const photoMesh = group.getObjectByName('photoMesh') as THREE.Mesh
      const innerBevel = group.getObjectByName('innerBevelLine') as THREE.LineLoop
      const glassSheen = group.getObjectByName('glassSheenMesh') as THREE.Mesh
      const rimMesh = group.getObjectByName('rimMesh') as THREE.Mesh

      assert.ok(glassChassis, 'Must contain transparent glass chassis backing')
      assert.ok(outerBevel, 'Must contain outer holographic bevel line')
      assert.ok(photoMesh, 'Must contain central photo mesh')
      assert.ok(innerBevel, 'Must contain inner aperture bevel line')
      assert.ok(glassSheen, 'Must contain view-angle specular sheen overlay')
      assert.ok(rimMesh, 'Must contain hero focus rim mesh')

      // Check double-sided transparency to guarantee no black reverse side
      const chassisMat = glassChassis.material as THREE.MeshBasicMaterial
      assert.strictEqual(chassisMat.transparent, true)
      assert.strictEqual(chassisMat.side, THREE.DoubleSide)
      assert.strictEqual(chassisMat.depthWrite, false)

      const photoMat = photoMesh.material as THREE.MeshBasicMaterial
      assert.strictEqual(photoMat.transparent, true)
      assert.strictEqual(photoMat.side, THREE.DoubleSide)
    })

    it('respects photoFit contain mode by fitting within aperture without stretching', () => {
      const nodes = generateUniverseSpatialNodes([samplePhotos[1]]) // Portrait 9:16
      const group = new THREE.Group()

      universeHolographicCards.buildCardHierarchy(
        group,
        nodes[0],
        { ...DEFAULT_UNIVERSE_HOLOGRAPHIC_CONFIG, photoFit: 'contain' },
        null
      )

      const photoMesh = group.getObjectByName('photoMesh') as THREE.Mesh
      assert.ok(photoMesh)
      // Geometry bounding box should match portrait aspect ratio
      photoMesh.geometry.computeBoundingBox()
      const box = photoMesh.geometry.boundingBox!
      const width = box.max.x - box.min.x
      const height = box.max.y - box.min.y
      const measuredAspect = width / height

      assert.ok(
        Math.abs(measuredAspect - 9 / 16) < 0.05,
        `Contained portrait photo aspect (${measuredAspect.toFixed(2)}) must preserve 9:16 (~0.56)`
      )
    })

    it('updates card reflections, view-angle specular sheen, and subtle music reactivity per frame', () => {
      const nodes = generateUniverseSpatialNodes(samplePhotos)
      const group = new THREE.Group()

      universeHolographicCards.buildCardHierarchy(
        group,
        nodes[0],
        DEFAULT_UNIVERSE_HOLOGRAPHIC_CONFIG,
        null
      )

      const camera = new THREE.PerspectiveCamera(50, 16 / 9, 10, 5000)
      camera.position.set(300, 50, 500) // Positioned to the right of the card

      const bands: NormalizedAudioBands = {
        bass: 0.8,
        mid: 0.5,
        treble: 0.9,
        subBass: 0.7,
        overall: 0.75,
        isBeatHit: true,
      }

      universeHolographicCards.updateCard(
        group,
        nodes[0],
        DEFAULT_UNIVERSE_HOLOGRAPHIC_CONFIG,
        camera,
        bands,
        2.5,
        true,
        1.0
      )

      const glassSheen = group.getObjectByName('glassSheenMesh') as THREE.Mesh
      assert.ok(glassSheen)
      // Angle-responsive sheen should be physically shifted along X
      assert.notStrictEqual(glassSheen.position.x, 0)

      const outerBevel = group.getObjectByName('outerBevelLine') as THREE.LineLoop
      const bevelMat = outerBevel.material as THREE.LineBasicMaterial
      assert.ok(bevelMat.opacity > 0.5, 'Audio treble boost should elevate bevel opacity')
    })

    it('applies curated holographic card styles across universe presets', () => {
      const initial: PhotoUniverseStudioConfig = {
        ...DEFAULT_PHOTO_UNIVERSE_CONFIG,
        enabled: true,
        photos: samplePhotos,
      }

      const auroraPreset = applyUniversePreset(initial, 'dreamy-memory-drift')
      assert.strictEqual(auroraPreset.holographicCards.cardStyle, 'aurora-glass')

      const silverPreset = applyUniversePreset(initial, 'rhythmic-beat-odyssey')
      assert.strictEqual(silverPreset.holographicCards.cardStyle, 'silver-prism')

      const minimalPreset = applyUniversePreset(initial, 'clean-minimalist-showcase')
      assert.strictEqual(minimalPreset.holographicCards.cardStyle, 'minimal-glass')
    })
  })

  describe('15. Liquid Light Transformation: Molten Metal Edge Ribbon & Camera-Responsive Sweep', () => {
    it('should be disabled by default (Safety First Rule)', () => {
      assert.strictEqual(
        DEFAULT_UNIVERSE_LIQUID_LIGHT_CONFIG.enabled,
        false,
        'Liquid Light must start disabled by default'
      )
      assert.strictEqual(
        DEFAULT_PHOTO_UNIVERSE_CONFIG.liquidLight.enabled,
        false,
        'Global photo universe config must have liquidLight disabled initially'
      )
      assert.strictEqual(DEFAULT_UNIVERSE_LIQUID_LIGHT_CONFIG.material, 'liquid-gold')
      assert.strictEqual(DEFAULT_UNIVERSE_LIQUID_LIGHT_CONFIG.intensity, 75)
      assert.strictEqual(DEFAULT_UNIVERSE_LIQUID_LIGHT_CONFIG.flowSpeed, 50)
      assert.strictEqual(DEFAULT_UNIVERSE_LIQUID_LIGHT_CONFIG.edgeWidth, 14)
      assert.strictEqual(DEFAULT_UNIVERSE_LIQUID_LIGHT_CONFIG.musicReactivity, true)
      assert.strictEqual(DEFAULT_UNIVERSE_LIQUID_LIGHT_CONFIG.cinematicTransition, true)
    })

    it('generates seamless closed quad-strip ribbon geometry around rounded photo boundaries', () => {
      const geo = createLiquidRibbonGeometry(320, 180, 14, 16, 120)
      assert.ok(geo instanceof THREE.BufferGeometry)

      const pos = geo.getAttribute('position')
      const uv = geo.getAttribute('uv')
      const norm = geo.getAttribute('normal')
      const index = geo.getIndex()

      assert.ok(pos && pos.count > 0, 'Geometry must contain position attribute')
      assert.ok(uv && uv.count > 0, 'Geometry must contain UV attribute')
      assert.ok(norm && norm.count > 0, 'Geometry must contain normal attribute')
      assert.ok(index && index.count === 120 * 6, 'Index count must match 120 quads * 6 = 720 indices')

      // Check UV bounds
      const uvs = uv.array as Float32Array
      let minU = 1, maxU = 0, minV = 1, maxV = 0
      for (let i = 0; i < uvs.length; i += 2) {
        minU = Math.min(minU, uvs[i])
        maxU = Math.max(maxU, uvs[i])
        minV = Math.min(minV, uvs[i + 1])
        maxV = Math.max(maxV, uvs[i + 1])
      }
      assert.strictEqual(minU, 0.0)
      assert.strictEqual(maxU, 1.0)
      assert.strictEqual(minV, 0.0)
      assert.strictEqual(maxV, 1.0)
    })

    it('builds liquid ribbon mesh inside photo group without covering inner photo area', () => {
      const nodes = generateUniverseSpatialNodes(samplePhotos)
      const group = new THREE.Group()

      // Add a base photo mesh
      const photoGeo = new THREE.PlaneGeometry(nodes[0].worldWidth, nodes[0].worldHeight)
      const photoMesh = new THREE.Mesh(photoGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }))
      photoMesh.name = 'photoMesh'
      group.add(photoMesh)

      const config: UniverseLiquidLightConfig = {
        ...DEFAULT_UNIVERSE_LIQUID_LIGHT_CONFIG,
        enabled: true,
        material: 'liquid-gold',
        edgeWidth: 16,
      }

      const ribbon = universeLiquidLight.buildOrUpdateLiquidRibbon(group, nodes[0], config, 16)
      assert.ok(ribbon)
      assert.strictEqual(ribbon.name, 'liquidRibbonMesh')

      // Inner photo dimensions must remain sharp and untouched
      const foundPhoto = group.getObjectByName('photoMesh') as THREE.Mesh
      assert.ok(foundPhoto)
      assert.strictEqual(
        (foundPhoto.geometry as THREE.PlaneGeometry).parameters.width,
        nodes[0].worldWidth
      )
    })

    it('supports all 3 liquid materials: Liquid Gold, Liquid Silver, and Subtle Iridescent', () => {
      const matGold = universeLiquidLight.createMaterial({
        ...DEFAULT_UNIVERSE_LIQUID_LIGHT_CONFIG,
        material: 'liquid-gold',
      })
      assert.strictEqual(matGold.uniforms.uMaterial.value, 0)

      const matSilver = universeLiquidLight.createMaterial({
        ...DEFAULT_UNIVERSE_LIQUID_LIGHT_CONFIG,
        material: 'liquid-silver',
      })
      assert.strictEqual(matSilver.uniforms.uMaterial.value, 1)

      const matIrid = universeLiquidLight.createMaterial({
        ...DEFAULT_UNIVERSE_LIQUID_LIGHT_CONFIG,
        material: 'iridescent',
      })
      assert.strictEqual(matIrid.uniforms.uMaterial.value, 2)
    })

    it('intensifies highlight sweep and approach factor as camera draws near', () => {
      const nodes = generateUniverseSpatialNodes(samplePhotos)
      const group = new THREE.Group()
      group.position.set(nodes[0].position.x, nodes[0].position.y, nodes[0].position.z)

      const config: UniverseLiquidLightConfig = {
        ...DEFAULT_UNIVERSE_LIQUID_LIGHT_CONFIG,
        enabled: true,
        intensity: 85,
      }

      const ribbon = universeLiquidLight.buildOrUpdateLiquidRibbon(group, nodes[0], config, 16)
      const mat = ribbon.material as THREE.ShaderMaterial

      const camera = new THREE.PerspectiveCamera(50, 16 / 9, 10, 5000)
      camera.position.set(nodes[0].position.x, nodes[0].position.y, nodes[0].position.z + 400)

      const cameraState = {
        position: camera.position,
        lookAt: nodes[0].lookAtPoint,
        targetNodeIndex: 0,
        focusDistance: 400,
        focusWeight: 1.0,
        travelPhase: 'approach' as const,
        phaseProgress: 0.65,
        shakeAllowed: true,
      }

      universeLiquidLight.updatePhoto(
        group,
        nodes[0],
        config,
        camera,
        undefined,
        1.5,
        true,
        cameraState,
        undefined,
        0,
        nodes.length
      )

      assert.strictEqual(mat.uniforms.uApproachFactor.value, 1.0)
      assert.ok(mat.uniforms.uSweepProgress.value > 0)
    })

    it('activates luminous transition bridge during photo departure and handover', () => {
      const nodes = generateUniverseSpatialNodes(samplePhotos)
      const outgoingGroup = new THREE.Group()
      const incomingGroup = new THREE.Group()

      const config: UniverseLiquidLightConfig = {
        ...DEFAULT_UNIVERSE_LIQUID_LIGHT_CONFIG,
        enabled: true,
        cinematicTransition: true,
      }

      const outRibbon = universeLiquidLight.buildOrUpdateLiquidRibbon(outgoingGroup, nodes[0], config, 16)
      const inRibbon = universeLiquidLight.buildOrUpdateLiquidRibbon(incomingGroup, nodes[1], config, 16)

      const camera = new THREE.PerspectiveCamera(50, 16 / 9, 10, 5000)
      const cameraState = {
        position: camera.position,
        lookAt: nodes[0].lookAtPoint,
        targetNodeIndex: 0,
        focusDistance: 500,
        focusWeight: 0.4,
        travelPhase: 'transition' as const,
        phaseProgress: 0.5,
        shakeAllowed: true,
      }

      // Update outgoing photo
      universeLiquidLight.updatePhoto(
        outgoingGroup,
        nodes[0],
        config,
        camera,
        undefined,
        4.0,
        true,
        cameraState,
        undefined,
        0,
        nodes.length
      )

      // Update incoming photo (index 1)
      universeLiquidLight.updatePhoto(
        incomingGroup,
        nodes[1],
        config,
        camera,
        undefined,
        4.0,
        false,
        cameraState,
        undefined,
        1,
        nodes.length
      )

      const outMat = outRibbon.material as THREE.ShaderMaterial
      const inMat = inRibbon.material as THREE.ShaderMaterial

      assert.ok(
        outMat.uniforms.uTransitionBridge.value > 0.7,
        'Outgoing photo should have elevated transition bridge'
      )
      assert.ok(
        inMat.uniforms.uTransitionBridge.value > 0.8,
        'Incoming photo should have elevated transition bridge'
      )
    })

    it('reacts to music presence and climax events while preserving neutral flow when reactivity is off', () => {
      const nodes = generateUniverseSpatialNodes(samplePhotos)
      const group = new THREE.Group()

      const config: UniverseLiquidLightConfig = {
        ...DEFAULT_UNIVERSE_LIQUID_LIGHT_CONFIG,
        enabled: true,
        musicReactivity: true,
      }

      const ribbon = universeLiquidLight.buildOrUpdateLiquidRibbon(group, nodes[0], config, 16)
      const mat = ribbon.material as THREE.ShaderMaterial
      const camera = new THREE.PerspectiveCamera(50, 16 / 9, 10, 5000)

      const activeBands: NormalizedAudioBands = {
        bass: 0.95,
        mid: 0.7,
        treble: 0.8,
        subBass: 0.9,
        overall: 0.85,
        isBeatHit: true,
      }

      const cameraState = {
        position: camera.position,
        lookAt: nodes[0].lookAtPoint,
        targetNodeIndex: 0,
        focusDistance: 400,
        focusWeight: 1.0,
        travelPhase: 'hold' as const,
        phaseProgress: 0.5,
        shakeAllowed: false,
      }

      // Music reactive mode on
      universeLiquidLight.updatePhoto(
        group,
        nodes[0],
        config,
        camera,
        activeBands,
        3.0,
        true,
        cameraState,
        { phase: 'supernova', flashOpacity: 0.9 },
        0,
        nodes.length
      )

      assert.ok(mat.uniforms.uAudioEnergy.value > 0.7)
      assert.ok(mat.uniforms.uClimaxBoost.value >= 0.6)

      // When musicReactivity is disabled, falls back to neutral flow
      const neutralConfig: UniverseLiquidLightConfig = {
        ...config,
        musicReactivity: false,
      }
      universeLiquidLight.updatePhoto(
        group,
        nodes[0],
        neutralConfig,
        camera,
        activeBands,
        3.0,
        true,
        cameraState,
        undefined,
        0,
        nodes.length
      )

      assert.strictEqual(mat.uniforms.uAudioEnergy.value, 0)
      assert.strictEqual(mat.uniforms.uClimaxBoost.value, 0)
    })

    it('disposes GPU geometry and material caches safely without memory leaks', () => {
      universeLiquidLight.dispose()
      // Calling dispose again should execute without throwing
      assert.doesNotThrow(() => {
        universeLiquidLight.dispose()
      })
    })
  })
})
