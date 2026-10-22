import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  AUTO_EDIT_STYLES,
  recommendStyleForMusic,
  generateAutoEditTimeline,
  type AutoEditStyle,
  type AutoEditGeneratorOptions,
} from '../src/lib/hybridVideo/autoEditGenerator.ts'
import {
  filterAndOrderMedia,
  batchInsertMediaToTimeline,
  type BatchInsertOptions,
} from '../src/lib/hybridVideo/batchMediaOperations.ts'
import type {
  MusicAnalysisResult,
  MusicSection,
} from '../src/lib/hybridVideo/musicIntelligence.ts'
import { createDefaultProject } from '../src/lib/hybridVideo/projectState.ts'
import type { MediaAsset } from '../src/lib/hybridVideo/types.ts'

describe('Music Intelligence & One-Click Auto-Edit Suite', () => {
  const mockAssets: MediaAsset[] = [
    {
      id: 'asset-img-1',
      name: 'Landscape-Mountain.jpg',
      type: 'image',
      url: 'blob:img1',
      durationSec: 5,
      naturalWidth: 1920,
      naturalHeight: 1080,
      sizeBytes: 1024000,
      mimeType: 'image/jpeg',
      createdAt: 1000,
    },
    {
      id: 'asset-img-2',
      name: 'Portrait-Smile.png',
      type: 'image',
      url: 'blob:img2',
      durationSec: 5,
      naturalWidth: 1080,
      naturalHeight: 1920,
      sizeBytes: 1540000,
      mimeType: 'image/png',
      createdAt: 2000,
    },
    {
      id: 'asset-img-3',
      name: 'Sunset-Beach.webp',
      type: 'image',
      url: 'blob:img3',
      durationSec: 5,
      naturalWidth: 1920,
      naturalHeight: 1080,
      sizeBytes: 850000,
      mimeType: 'image/webp',
      createdAt: 3000,
    },
    {
      id: 'asset-vid-1',
      name: 'Drone-Shot.mp4',
      type: 'video',
      url: 'blob:vid1',
      durationSec: 8.5,
      naturalWidth: 1920,
      naturalHeight: 1080,
      sizeBytes: 9500000,
      mimeType: 'video/mp4',
      createdAt: 4000,
    },
    {
      id: 'asset-audio-1',
      name: 'Cinematic-Theme.mp3',
      type: 'audio',
      url: 'blob:audio1',
      durationSec: 32.0,
      naturalWidth: 0,
      naturalHeight: 0,
      sizeBytes: 3200000,
      mimeType: 'audio/mp3',
      createdAt: 5000,
    },
  ]

  const mockAnalysis: MusicAnalysisResult = {
    assetId: 'asset-audio-1',
    assetName: 'Cinematic-Theme.mp3',
    durationSec: 32.0,
    bpm: 118,
    bpmConfidence: 0.88,
    beats: [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 8.0, 12.0, 16.0, 20.0, 24.0, 28.0],
    onsets: [0.5, 1.0, 1.5, 2.0],
    energyEnvelope: [0.2, 0.3, 0.5, 0.7, 0.9, 0.4],
    sections: [
      {
        id: 'sec-intro',
        name: 'Intro / Exposition',
        startSec: 0,
        endSec: 6.0,
        type: 'intro',
        energyLevel: 0.3,
        isMelodyDominant: true,
        melodyProfile: 'piano-strings',
      },
      {
        id: 'sec-melody',
        name: 'Soulful Melody',
        startSec: 6.0,
        endSec: 18.0,
        type: 'melody',
        energyLevel: 0.5,
        isMelodyDominant: true,
        melodyProfile: 'vocal-like',
      },
      {
        id: 'sec-climax',
        name: 'Peak Climax',
        startSec: 18.0,
        endSec: 28.0,
        type: 'climax',
        energyLevel: 0.95,
        isMelodyDominant: false,
        melodyProfile: 'beat-driven',
      },
      {
        id: 'sec-outro',
        name: 'Gentle Outro',
        startSec: 28.0,
        endSec: 32.0,
        type: 'outro',
        energyLevel: 0.25,
        isMelodyDominant: true,
        melodyProfile: 'soft-melody',
      },
    ],
    dominantMood: 'romantic',
    overallMelodyScore: 0.72,
    climaxStartSec: 18.0,
    climaxEndSec: 28.0,
    suggestedCutPoints: [6.0, 18.0, 28.0],
  }

  describe('Batch Media Operations', () => {
    it('filters media assets by type properly', () => {
      const photosOnly = filterAndOrderMedia(mockAssets, 'images-only', 'library')
      assert.strictEqual(photosOnly.length, 3)
      assert.ok(photosOnly.every((a) => a.type === 'image'))

      const videosOnly = filterAndOrderMedia(mockAssets, 'videos-only', 'library')
      assert.strictEqual(videosOnly.length, 1)
      assert.strictEqual(videosOnly[0].type, 'video')

      const allVisual = filterAndOrderMedia(mockAssets, 'all', 'library')
      assert.strictEqual(allVisual.length, 4) // 3 images + 1 video (audio excluded)
    })

    it('shuffles media order without losing items or duplicating', () => {
      const original = filterAndOrderMedia(mockAssets, 'images-only', 'library')
      const shuffled = filterAndOrderMedia(mockAssets, 'images-only', 'shuffle')
      assert.strictEqual(shuffled.length, original.length)
      const origIds = new Set(original.map((a) => a.id))
      const shuffledIds = new Set(shuffled.map((a) => a.id))
      assert.strictEqual(origIds.size, shuffledIds.size)
    })

    it('inserts batch media consecutively with configurable still image duration', () => {
      const project = createDefaultProject()
      project.mediaAssets = [...mockAssets]

      const options: BatchInsertOptions = {
        mediaFilter: 'images-only',
        order: 'library',
        stillImageDurationSec: 4.0,
        placement: 'timeline-start',
        mode: 'replace-primary-track',
      }

      const { updatedProject, insertedCount } = batchInsertMediaToTimeline(project, options, 0)
      assert.strictEqual(insertedCount, 3)

      const videoClips = updatedProject.clips.filter((c) => c.type === 'image')
      assert.strictEqual(videoClips.length, 3)
      assert.strictEqual(videoClips[0].startSec, 0)
      assert.strictEqual(videoClips[0].durationSec, 4.0)
      assert.strictEqual(videoClips[1].startSec, 4.0)
      assert.strictEqual(videoClips[1].durationSec, 4.0)
      assert.strictEqual(videoClips[2].startSec, 8.0)
      assert.strictEqual(videoClips[2].durationSec, 4.0)
      assert.strictEqual(updatedProject.settings.durationSec, Math.max(12.0, project.settings.durationSec))
    })

    it('appends media at current playhead without clearing existing clips', () => {
      const project = createDefaultProject()
      project.mediaAssets = [...mockAssets]

      // Initial batch insert at 0
      const step1 = batchInsertMediaToTimeline(
        project,
        {
          mediaFilter: 'images-only',
          order: 'library',
          stillImageDurationSec: 2.0,
          placement: 'timeline-start',
          mode: 'replace-primary-track',
        },
        0
      )

      assert.strictEqual(step1.insertedCount, 3)

      // Append step at playhead = 6.0
      const step2 = batchInsertMediaToTimeline(
        step1.updatedProject,
        {
          mediaFilter: 'videos-only',
          order: 'library',
          stillImageDurationSec: 2.0,
          placement: 'playhead',
          mode: 'append',
        },
        6.0
      )

      assert.strictEqual(step2.insertedCount, 1)
      assert.strictEqual(step2.updatedProject.clips.length, 4)
      const lastClip = step2.updatedProject.clips[3]
      assert.strictEqual(lastClip.startSec, 6.0)
    })
  })

  describe('Music-Driven Auto-Edit Styles & Recommendation', () => {
    it('defines all 8 required cinematic archetypes with valid pacing parameters', () => {
      const expectedStyles: AutoEditStyle[] = [
        'melody-emotion',
        'cinematic-story',
        'beat-sync',
        'climax-rewind',
        'fast-energetic',
        'travel-film',
        'minimal-clean',
        'custom',
      ]

      for (const styleId of expectedStyles) {
        const style = AUTO_EDIT_STYLES[styleId]
        assert.ok(style, `Style ${styleId} must exist`)
        assert.ok(style.baseShotDurationSec > 0, 'Base duration must be positive')
        assert.ok(style.melodyMultiplier >= 1.0, 'Melody multiplier must be >= 1.0')
        assert.ok(style.climaxMultiplier <= 1.0, 'Climax multiplier must be <= 1.0')
        assert.ok(typeof style.description === 'string' && style.description.length > 10)
      }
    })

    it('recommends melody-emotion for romantic/high-melody music', () => {
      const rec = recommendStyleForMusic(mockAnalysis)
      assert.strictEqual(rec.recommendedStyle, 'melody-emotion')
      assert.ok(rec.reason.includes('high-melody') || rec.reason.includes('romantic'))
    })

    it('recommends fast-energetic for high BPM intense tracks', () => {
      const fastTrack: MusicAnalysisResult = {
        ...mockAnalysis,
        bpm: 142,
        dominantMood: 'intense',
        overallMelodyScore: 0.2,
      }
      const rec = recommendStyleForMusic(fastTrack)
      assert.strictEqual(rec.recommendedStyle, 'fast-energetic')
    })

    it('recommends beat-sync for high confidence rhythmic tracks', () => {
      const rhythmicTrack: MusicAnalysisResult = {
        ...mockAnalysis,
        bpm: 110,
        bpmConfidence: 0.92,
        beats: new Array(30).fill(0).map((_, i) => i * 0.5),
        dominantMood: 'energetic',
        overallMelodyScore: 0.35,
      }
      const rec = recommendStyleForMusic(rhythmicTrack)
      assert.strictEqual(rec.recommendedStyle, 'beat-sync')
    })
  })

  describe('Auto-Edit Timeline Generation Engine', () => {
    it('creates contiguous sequential clips aligned to music sections and durations', () => {
      const project = createDefaultProject()
      project.mediaAssets = [...mockAssets]

      const musicAsset = mockAssets.find((a) => a.type === 'audio')!
      const options: AutoEditGeneratorOptions = {
        style: 'melody-emotion',
        assetOrder: 'original',
        mediaFilter: 'all',
        keepMelodyCalm: true,
        endingHoldFrame: true,
      }

      const { updatedProject, clipCount, summary } = generateAutoEditTimeline(
        project,
        musicAsset,
        mockAnalysis,
        mockAssets,
        options
      )

      assert.ok(clipCount > 0, 'Should generate clips')
      assert.ok(summary.includes('Auto-created'))

      // Primary video clips check
      const videoTrack = updatedProject.tracks.find((t) => t.type === 'video')!
      const visualClips = updatedProject.clips.filter((c) => c.trackId === videoTrack.id)
      assert.ok(visualClips.length >= 4)

      // Audio track should have music asset
      const audioTrack = updatedProject.tracks.find((t) => t.type === 'audio')!
      const musicClip = updatedProject.clips.find((c) => c.trackId === audioTrack.id)
      assert.ok(musicClip, 'Music clip should be added to audio track')
      assert.strictEqual(musicClip?.assetId, musicAsset.id)
      assert.strictEqual(musicClip?.startSec, 0)

      // Check no overlaps in visual clips
      for (let i = 0; i < visualClips.length - 1; i++) {
        const c1 = visualClips[i]
        const c2 = visualClips[i + 1]
        assert.ok(
          c2.startSec >= c1.startSec + c1.durationSec - 0.05,
          `Clip ${i + 1} (${c2.startSec}) must start at or after Clip ${i} end (${c1.startSec + c1.durationSec})`
        )
      }
    })

    it('demonstrates slower holds in melody sections compared to climax acceleration in climax-rewind', () => {
      const project = createDefaultProject()
      project.mediaAssets = [...mockAssets]

      const musicAsset = mockAssets.find((a) => a.type === 'audio')!
      const options: AutoEditGeneratorOptions = {
        style: 'climax-rewind',
        assetOrder: 'original',
        mediaFilter: 'all',
        keepMelodyCalm: true,
        endingHoldFrame: false,
      }

      const { updatedProject } = generateAutoEditTimeline(
        project,
        musicAsset,
        mockAnalysis,
        mockAssets,
        options
      )

      const videoTrack = updatedProject.tracks.find((t) => t.type === 'video')!
      const visualClips = updatedProject.clips.filter((c) => c.trackId === videoTrack.id)

      const melodyClips = visualClips.filter((c) => c.startSec >= 6.0 && c.startSec < 18.0)
      const climaxClips = visualClips.filter((c) => c.startSec >= 18.0 && c.startSec < 28.0)

      const avgMelodyDur =
        melodyClips.reduce((sum, c) => sum + c.durationSec, 0) / Math.max(1, melodyClips.length)
      const avgClimaxDur =
        climaxClips.reduce((sum, c) => sum + c.durationSec, 0) / Math.max(1, climaxClimaxClipsLength(climaxClips))

      function climaxClimaxClipsLength(arr: any[]) {
        return arr.length || 1
      }

      assert.ok(
        avgMelodyDur > avgClimaxDur,
        `Melody clips avg duration (${avgMelodyDur.toFixed(2)}s) must be longer than climax clips (${avgClimaxDur.toFixed(2)}s)`
      )
    })
  })
})
