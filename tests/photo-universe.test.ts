import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  DEFAULT_PHOTO_UNIVERSE_CONFIG,
  DEFAULT_UNIVERSE_BACKGROUND,
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
})
