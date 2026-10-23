import { describe, it } from 'node:test'
import assert from 'node:assert'
import { TOOLS } from '../src/data/tools.ts'
import {
  ASPECT_RATIO_PRESETS,
  DEFAULT_TRANSFORM,
  DEFAULT_EFFECTS,
  DEFAULT_TEXT_PROPS,
  DEFAULT_AUDIO_PROPS,
  type TimelineClip,
  type Track,
} from '../src/lib/hybridVideo/types.ts'
import {
  createDefaultProject,
  saveProjectToJson,
  parseProjectJson,
} from '../src/lib/hybridVideo/projectState.ts'
import {
  findSnapTime,
  splitClipAtTime,
  trimClipStart,
  trimClipEnd,
  calculateTotalProjectDuration,
} from '../src/lib/hybridVideo/timelineEngine.ts'
import { interpolateKeyframes } from '../src/lib/hybridVideo/keyframeInterpolator.ts'
import { buildCssFilterString } from '../src/lib/hybridVideo/effectsEngine.ts'
import { computeClipTransition } from '../src/lib/hybridVideo/transitionsEngine.ts'
import { TITLE_STYLE_PRESETS } from '../src/lib/hybridVideo/textOverlayEngine.ts'

describe('Hybrid Video Studio — Core Architecture & Suite Tests', () => {
  it('should be correctly registered as Tool #70 in TOOLS registry', () => {
    assert.strictEqual(TOOLS.length, 71, 'Total tool count should be exactly 71')
    const tool = TOOLS.find((t) => t.slug === 'hybrid-video-studio')
    assert.ok(tool, 'Tool hybrid-video-studio must be registered')
    assert.strictEqual(tool.category, 'create')
    assert.strictEqual(tool.seo.canonicalPath, '/tools/hybrid-video-studio')
    assert.ok(tool.seo.title.endsWith('| IndiaTools'))
    assert.ok(tool.detailedDescription.length > 20)
    assert.ok(tool.faqs.length >= 3)
  })

  it('provides correct dimensions for all standard social and cinematic aspect ratios', () => {
    assert.strictEqual(ASPECT_RATIO_PRESETS['16:9'].width, 1920)
    assert.strictEqual(ASPECT_RATIO_PRESETS['16:9'].height, 1080)

    assert.strictEqual(ASPECT_RATIO_PRESETS['9:16'].width, 1080)
    assert.strictEqual(ASPECT_RATIO_PRESETS['9:16'].height, 1920)

    assert.strictEqual(ASPECT_RATIO_PRESETS['1:1'].width, 1080)
    assert.strictEqual(ASPECT_RATIO_PRESETS['1:1'].height, 1080)

    assert.strictEqual(ASPECT_RATIO_PRESETS['4:5'].width, 1080)
    assert.strictEqual(ASPECT_RATIO_PRESETS['4:5'].height, 1350)
  })

  it('creates valid default project with standard track layout', () => {
    const project = createDefaultProject()
    assert.ok(project.settings.id)
    assert.strictEqual(project.settings.version, 1)
    assert.strictEqual(project.tracks.length, 4)
    assert.strictEqual(project.tracks[0].type, 'text')
    assert.strictEqual(project.tracks[1].type, 'image')
    assert.strictEqual(project.tracks[2].type, 'video')
    assert.strictEqual(project.tracks[3].type, 'audio')
    assert.strictEqual(project.clips.length, 0)
  })

  it('safely serializes and restores project JSON without data loss', () => {
    const project = createDefaultProject()
    project.settings.name = 'Test Cinematic Clip'

    const jsonStr = saveProjectToJson(project)
    assert.ok(typeof jsonStr === 'string')

    const restored = parseProjectJson(jsonStr)
    assert.strictEqual(restored.settings.name, 'Test Cinematic Clip')
    assert.strictEqual(restored.tracks.length, 4)
  })

  it('timeline engine correctly calculates magnetic snapping to clip boundaries and playhead', () => {
    const mockClips: TimelineClip[] = [
      {
        id: 'c1',
        trackId: 't1',
        name: 'Clip 1',
        type: 'video',
        startSec: 2.0,
        durationSec: 4.0,
        trimStartSec: 0,
        trimEndSec: 0,
        speed: 1,
        transform: { ...DEFAULT_TRANSFORM },
        keyframes: [],
        effects: { ...DEFAULT_EFFECTS },
        transitionIn: { type: 'none', durationSec: 0 },
        transitionOut: { type: 'none', durationSec: 0 },
        audioProps: { ...DEFAULT_AUDIO_PROPS },
      },
    ]

    // At 60px/sec, threshold is 12px / 60 = 0.2s
    // Proposed time 2.08s is within 0.2s of clip start at 2.0s -> should snap to 2.0s
    const snapStart = findSnapTime(2.08, 60, mockClips, 10.0, 'other')
    assert.strictEqual(snapStart.didSnap, true)
    assert.strictEqual(snapStart.snappedTimeSec, 2.0)

    // Proposed time 5.92s is within 0.2s of clip end at 6.0s -> should snap to 6.0s
    const snapEnd = findSnapTime(5.92, 60, mockClips, 10.0, 'other')
    assert.strictEqual(snapEnd.didSnap, true)
    assert.strictEqual(snapEnd.snappedTimeSec, 6.0)

    // Far away time 3.5s -> should not snap
    const snapFar = findSnapTime(3.5, 60, mockClips, 10.0, 'other')
    assert.strictEqual(snapFar.didSnap, false)
    assert.strictEqual(snapFar.snappedTimeSec, 3.5)
  })

  it('split clip at playhead produces two valid contiguous clips', () => {
    const clip: TimelineClip = {
      id: 'clip-parent',
      trackId: 't1',
      name: 'Long Shot',
      type: 'video',
      startSec: 1.0,
      durationSec: 6.0, // ends at 7.0s
      trimStartSec: 0,
      trimEndSec: 0,
      speed: 1,
      transform: { ...DEFAULT_TRANSFORM },
      keyframes: [],
      effects: { ...DEFAULT_EFFECTS },
      transitionIn: { type: 'none', durationSec: 0 },
      transitionOut: { type: 'none', durationSec: 0 },
      audioProps: { ...DEFAULT_AUDIO_PROPS },
    }

    const split = splitClipAtTime(clip, 3.5)
    assert.ok(split !== null)
    const [c1, c2] = split

    assert.strictEqual(c1.startSec, 1.0)
    assert.strictEqual(c1.durationSec, 2.5) // 1.0 to 3.5
    assert.strictEqual(c2.startSec, 3.5)
    assert.strictEqual(c2.durationSec, 3.5) // 3.5 to 7.0
    assert.strictEqual(c2.trimStartSec, 2.5) // advanced by 2.5s
  })

  it('trim start and trim end preserve minimum duration constraints', () => {
    const clip: TimelineClip = {
      id: 'clip-trim',
      trackId: 't1',
      name: 'Trim Clip',
      type: 'video',
      startSec: 2.0,
      durationSec: 5.0, // ends at 7.0s
      trimStartSec: 0,
      trimEndSec: 0,
      speed: 1,
      transform: { ...DEFAULT_TRANSFORM },
      keyframes: [],
      effects: { ...DEFAULT_EFFECTS },
      transitionIn: { type: 'none', durationSec: 0 },
      transitionOut: { type: 'none', durationSec: 0 },
      audioProps: { ...DEFAULT_AUDIO_PROPS },
    }

    // Trim start forward by 1s (new start 3.0s)
    const trimmedStart = trimClipStart(clip, 3.0, 0.2)
    assert.strictEqual(trimmedStart.startSec, 3.0)
    assert.strictEqual(trimmedStart.durationSec, 4.0)
    assert.strictEqual(trimmedStart.trimStartSec, 1.0)

    // Trim end back to 5.0s
    const trimmedEnd = trimClipEnd(clip, 5.0, 0.2)
    assert.strictEqual(trimmedEnd.startSec, 2.0)
    assert.strictEqual(trimmedEnd.durationSec, 3.0)
  })

  it('keyframe interpolator smoothly interpolates between keyframes', () => {
    const base = { ...DEFAULT_TRANSFORM, scale: 1.0, opacity: 1.0 }
    const keyframes = [
      { id: 'kf1', timeSec: 0.0, transform: { scale: 1.0, opacity: 0.0 } },
      { id: 'kf2', timeSec: 2.0, transform: { scale: 1.5, opacity: 1.0 } },
    ]

    // At time 0: values match kf1
    const t0 = interpolateKeyframes(base, keyframes, 0.0)
    assert.strictEqual(t0.scale, 1.0)
    assert.strictEqual(t0.opacity, 0.0)

    // At time 1.0 (midway): smooth cosine interpolation
    const t1 = interpolateKeyframes(base, keyframes, 1.0)
    assert.ok(t1.scale > 1.2 && t1.scale < 1.3)
    assert.ok(t1.opacity > 0.45 && t1.opacity < 0.55)

    // At time 2.0: values match kf2
    const t2 = interpolateKeyframes(base, keyframes, 2.0)
    assert.strictEqual(t2.scale, 1.5)
    assert.strictEqual(t2.opacity, 1.0)
  })

  it('cinematic effects engine ensures decorative effects start disabled by default', () => {
    const effects = { ...DEFAULT_EFFECTS }
    assert.strictEqual(effects.enabled, false)
    assert.strictEqual(buildCssFilterString(effects), 'none')

    // Enabled with exposure + contrast + LUT
    const enabledEffects = {
      ...DEFAULT_EFFECTS,
      enabled: true,
      colorGrading: {
        ...DEFAULT_EFFECTS.colorGrading,
        exposure: 20,
        contrast: 15,
        lutPreset: 'teal-orange' as const,
      },
    }
    const filterStr = buildCssFilterString(enabledEffects)
    assert.ok(filterStr.includes('brightness(1.20)'))
    assert.ok(filterStr.includes('contrast(1.18)'))
    assert.ok(filterStr.includes('hue-rotate(-8deg)'))
  })

  it('title presets include 6 complete, editable motion typography styles', () => {
    assert.strictEqual(TITLE_STYLE_PRESETS.length, 6)
    const titles = TITLE_STYLE_PRESETS.map((p) => p.id)
    assert.ok(titles.includes('cinematic-title'))
    assert.ok(titles.includes('minimal-subtitle'))
    assert.ok(titles.includes('bold-social-caption'))
    assert.ok(titles.includes('lower-third'))
    assert.ok(titles.includes('end-card'))
    assert.ok(titles.includes('neon-cyber'))
  })

  it('transitions engine computes scale punch, whip pan, and crossfade transforms', () => {
    const transitionIn = { type: 'scale-punch' as const, durationSec: 1.0 }
    const transitionOut = { type: 'none' as const, durationSec: 0 }

    // Halfway through scale punch (t = 0.5s)
    const state = computeClipTransition(transitionIn, transitionOut, 0.5, 5.0, 1920)
    assert.ok(state.scaleMultiplier > 1.0, 'Scale punch should be enlarged during intro')
    assert.strictEqual(state.opacityMultiplier, 0.5)
  })
})
