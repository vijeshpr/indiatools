import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  calculateSourceCrop,
  calculatePipCenter,
  drawCircularVideo,
} from '../src/lib/hybridVideo/circularPipEngine.ts'
import { DEFAULT_CIRCULAR_PIP, type TimelineClip } from '../src/lib/hybridVideo/types.ts'

describe('Circular PiP / Reaction Video Engine Suite', () => {
  it('correctly calculates 1:1 center-crop for landscape source video (1920x1080)', () => {
    // 16:9 Landscape source: height is 1080, so square crop should be 1080x1080 centered horizontally
    const crop = calculateSourceCrop(1920, 1080, 'cover')
    assert.strictEqual(crop.sWidth, 1080)
    assert.strictEqual(crop.sHeight, 1080)
    assert.strictEqual(crop.sx, (1920 - 1080) / 2) // 420px offset from left
    assert.strictEqual(crop.sy, 0)
  })

  it('correctly calculates 1:1 center-crop for portrait source video (1080x1920)', () => {
    // 9:16 Portrait source: width is 1080, so square crop should be 1080x1080 centered vertically
    const crop = calculateSourceCrop(1080, 1920, 'cover')
    assert.strictEqual(crop.sWidth, 1080)
    assert.strictEqual(crop.sHeight, 1080)
    assert.strictEqual(crop.sx, 0)
    assert.strictEqual(crop.sy, (1920 - 1080) / 2) // 420px offset from top
  })

  it('correctly calculates 1:1 crop for square source video (1080x1080)', () => {
    const crop = calculateSourceCrop(1080, 1080, 'cover')
    assert.strictEqual(crop.sWidth, 1080)
    assert.strictEqual(crop.sHeight, 1080)
    assert.strictEqual(crop.sx, 0)
    assert.strictEqual(crop.sy, 0)
  })

  it('preserves full source coordinates in contain mode', () => {
    const crop = calculateSourceCrop(1920, 1080, 'contain')
    assert.strictEqual(crop.sWidth, 1920)
    assert.strictEqual(crop.sHeight, 1080)
    assert.strictEqual(crop.sx, 0)
    assert.strictEqual(crop.sy, 0)
  })

  it('accurately computes PiP center for all 5 position presets on a 1920x1080 canvas', () => {
    const canvasW = 1920
    const canvasH = 1080
    const radius = 150
    const margin = 48

    // Top-Left: margin + radius = 48 + 150 = 198
    const tl = calculatePipCenter(canvasW, canvasH, radius, 'top-left', 0, 0, margin)
    assert.strictEqual(tl.x, 198)
    assert.strictEqual(tl.y, 198)

    // Top-Right: 1920 - (48 + 150) = 1722, Y = 198
    const tr = calculatePipCenter(canvasW, canvasH, radius, 'top-right', 0, 0, margin)
    assert.strictEqual(tr.x, 1722)
    assert.strictEqual(tr.y, 198)

    // Bottom-Left: X = 198, Y = 1080 - (48 + 150) = 882
    const bl = calculatePipCenter(canvasW, canvasH, radius, 'bottom-left', 0, 0, margin)
    assert.strictEqual(bl.x, 198)
    assert.strictEqual(bl.y, 882)

    // Bottom-Right: X = 1722, Y = 882
    const br = calculatePipCenter(canvasW, canvasH, radius, 'bottom-right', 0, 0, margin)
    assert.strictEqual(br.x, 1722)
    assert.strictEqual(br.y, 882)

    // Center: X = 960, Y = 540
    const center = calculatePipCenter(canvasW, canvasH, radius, 'center', 0, 0, margin)
    assert.strictEqual(center.x, 960)
    assert.strictEqual(center.y, 540)

    // Custom offsets: Bottom-Right with +10px X and -15px Y
    const brOffset = calculatePipCenter(canvasW, canvasH, radius, 'bottom-right', 10, -15, margin)
    assert.strictEqual(brOffset.x, 1732)
    assert.strictEqual(brOffset.y, 867)
  })

  it('accurately computes PiP center for 9:16 portrait canvas (1080x1920)', () => {
    const canvasW = 1080
    const canvasH = 1920
    const radius = 140
    const margin = 40

    const br = calculatePipCenter(canvasW, canvasH, radius, 'bottom-right', 0, 0, margin)
    assert.strictEqual(br.x, 1080 - 40 - 140) // 900
    assert.strictEqual(br.y, 1920 - 40 - 140) // 1740
  })

  it('renders circular video using mock 2D context with balanced save/restore and clipping', () => {
    let saveCount = 0
    let restoreCount = 0
    let clipCount = 0
    let arcCount = 0
    let strokeCount = 0
    let fillCount = 0
    let drawImageCount = 0

    const mockCtx = {
      save: () => {
        saveCount++
      },
      restore: () => {
        restoreCount++
      },
      beginPath: () => {},
      arc: () => {
        arcCount++
      },
      clip: () => {
        clipCount++
      },
      stroke: () => {
        strokeCount++
      },
      fill: () => {
        fillCount++
      },
      drawImage: () => {
        drawImageCount++
      },
      translate: () => {},
      rotate: () => {},
      globalAlpha: 1.0,
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
    } as unknown as CanvasRenderingContext2D

    const mockVideo = {
      videoWidth: 1920,
      videoHeight: 1080,
      readyState: 4,
    }

    drawCircularVideo(mockCtx, mockVideo as any, 500, 500, 120, {
      borderWidth: 4,
      borderColor: '#FFFFFF',
      shadowIntensity: 0.5,
      shadowBlur: 20,
      fitMode: 'cover',
    })

    // Assert clipping occurred
    assert.strictEqual(clipCount, 1, 'Expected exactly 1 clipping operation')
    // Assert image was drawn
    assert.strictEqual(drawImageCount, 1, 'Expected drawImage to be called')
    // Assert border stroke was performed
    assert.strictEqual(strokeCount, 1, 'Expected border stroke to be called')
    // Assert shadow fill was performed
    assert.strictEqual(fillCount, 1, 'Expected shadow fill to be called')
    // Assert arc was defined for shadow, clip, and border
    assert.strictEqual(arcCount, 3, 'Expected 3 arc paths (shadow, clip, border)')
    // CRITICAL: Assert Canvas state is strictly balanced so styles/clipping NEVER leak!
    assert.strictEqual(saveCount, restoreCount, 'Expected save() and restore() calls to be perfectly balanced')
    assert.ok(saveCount >= 3, 'Expected at least 3 isolated states (base, shadow, clip)')
  })

  it('safely handles unready or invalid video elements without throwing exceptions', () => {
    let drawImageCount = 0
    const mockCtx = {
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      arc: () => {},
      clip: () => {},
      stroke: () => {},
      fill: () => {},
      drawImage: () => {
        drawImageCount++
      },
      globalAlpha: 1.0,
    } as unknown as CanvasRenderingContext2D

    // readyState 0 (HAVE_NOTHING)
    const unreadyVideo = {
      videoWidth: 0,
      videoHeight: 0,
      readyState: 0,
    }

    assert.doesNotThrow(() => {
      drawCircularVideo(mockCtx, unreadyVideo as any, 100, 100, 50)
    })
    // Should not attempt to drawImage on unready zero-dimension media
    assert.strictEqual(drawImageCount, 0)
  })

  it('stores and preserves Circular PiP configuration on TimelineClip without breaking defaults', () => {
    const clip: TimelineClip = {
      id: 'clip-reaction-1',
      trackId: 'track-video-2',
      name: 'Reaction Cam.mp4',
      type: 'video',
      startSec: 2.0,
      durationSec: 10.0,
      trimStartSec: 0,
      trimEndSec: 0,
      speed: 1.0,
      transform: { x: 0, y: 0, scale: 1.0, rotationDeg: 0, opacity: 1.0, fitMode: 'fit' },
      keyframes: [],
      effects: { enabled: false, colorGrading: {} as any, filters: {} as any },
      transitionIn: { type: 'none', durationSec: 0 },
      transitionOut: { type: 'none', durationSec: 0 },
      audioProps: { volume: 1, fadeInSec: 0, fadeOutSec: 0, muted: false },
      circularPip: {
        ...DEFAULT_CIRCULAR_PIP,
        enabled: true,
        positionPreset: 'bottom-right',
        sizePercent: 32,
        borderWidth: 4,
        borderColor: '#00F0FF',
      },
    }

    assert.strictEqual(clip.circularPip?.enabled, true)
    assert.strictEqual(clip.circularPip?.sizePercent, 32)
    assert.strictEqual(clip.circularPip?.borderColor, '#00F0FF')

    // Verify JSON serialization / deserialization roundtrip
    const serialized = JSON.stringify(clip)
    const restored: TimelineClip = JSON.parse(serialized)
    assert.strictEqual(restored.circularPip?.enabled, true)
    assert.strictEqual(restored.circularPip?.positionPreset, 'bottom-right')
    assert.strictEqual(restored.circularPip?.sizePercent, 32)
    assert.strictEqual(restored.circularPip?.borderColor, '#00F0FF')
  })
})
