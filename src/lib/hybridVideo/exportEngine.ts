/**
 * IndiaTools — Hybrid Video Studio Real-Time Render & Export Engine
 * Canvas 2D + Web Audio API + MediaRecorder + Seekable WebM/MP4 container finalization
 */

import type {
  HybridVideoProject,
  ExportConfig,
  MediaAsset,
} from './types.ts'
import { drawCompositionFrame, type RenderContext } from './previewEngine.ts'
import { hybridAudio } from './audioTimelineEngine.ts'
import fixWebmDuration from 'fix-webm-duration'

export interface ExportProgress {
  state: 'rendering' | 'finalizing' | 'completed' | 'cancelled' | 'error'
  percent: number // 0 to 100
  elapsedSec: number
  remainingSec: number
  currentSec: number
  totalSec: number
  fps: number
  phaseText: string
  fileSizeEstimate?: string
}

export interface ExportResult {
  blob: Blob
  fileName: string
  mimeType: string
  extension: 'webm' | 'mp4'
  sizeBytes: number
  formattedSize: string
  durationSec: number
}

export class HybridVideoExporter {
  private isCancelled = false
  private mediaRecorder: MediaRecorder | null = null

  public cancel(): void {
    this.isCancelled = true
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      try {
        this.mediaRecorder.stop()
      } catch {
        // Ignore
      }
    }
  }

  public async renderAndExport(
    project: HybridVideoProject,
    config: ExportConfig,
    mediaAssets: Map<string, MediaAsset>,
    videoElements: Map<string, HTMLVideoElement>,
    imageElements: Map<string, HTMLImageElement>,
    onProgress: (p: ExportProgress) => void
  ): Promise<ExportResult> {
    this.isCancelled = false
    const totalDurationSec = Math.max(1, project.settings.durationSec)
    const exportWidth = config.width
    const exportHeight = config.height
    const targetFps = config.fps || 30
    const bitrate = config.bitrateBps || 8000000

    // Create offscreen rendering canvas
    const canvas = document.createElement('canvas')
    canvas.width = exportWidth
    canvas.height = exportHeight
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) {
      throw new Error('Unable to initialize export 2D canvas context')
    }

    const renderCtx: RenderContext = {
      canvas,
      ctx,
      settings: {
        ...project.settings,
        dimensions: {
          width: exportWidth,
          height: exportHeight,
          label: 'Export Target',
          aspectRatioId: project.settings.dimensions.aspectRatioId,
        },
      },
      tracks: project.tracks,
      clips: project.clips,
      mediaAssets,
      videoElements,
      imageElements,
    }

    // Determine supported MIME type honestly
    let mimeType = 'video/webm;codecs=vp9,opus'
    let extension: 'webm' | 'mp4' = 'webm'

    if (config.format === 'mp4' && MediaRecorder.isTypeSupported('video/mp4;codecs=avc1.42E01E,mp4a.40.2')) {
      mimeType = 'video/mp4;codecs=avc1.42E01E,mp4a.40.2'
      extension = 'mp4'
    } else if (config.format === 'mp4' && MediaRecorder.isTypeSupported('video/mp4')) {
      mimeType = 'video/mp4'
      extension = 'mp4'
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
      mimeType = 'video/webm;codecs=vp9,opus'
      extension = 'webm'
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
      mimeType = 'video/webm;codecs=vp8,opus'
      extension = 'webm'
    } else {
      mimeType = 'video/webm'
      extension = 'webm'
    }

    // Build combined MediaStream from canvas stream + audio destination stream
    const canvasStream = canvas.captureStream(targetFps)
    const audioDestination = hybridAudio.getStreamDestination()

    const combinedTracks: MediaStreamTrack[] = [...canvasStream.getVideoTracks()]
    if (config.includeAudio && audioDestination && audioDestination.stream.getAudioTracks().length > 0) {
      combinedTracks.push(...audioDestination.stream.getAudioTracks())
    }

    const combinedStream = new MediaStream(combinedTracks)

    const chunks: Blob[] = []
    const recorder = new MediaRecorder(combinedStream, {
      mimeType,
      videoBitsPerSecond: bitrate,
    })
    this.mediaRecorder = recorder

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunks.push(e.data)
      }
    }

    // Start audio playback synchronized to 0s
    if (config.includeAudio) {
      hybridAudio.playAt(0, project.clips, project.tracks, mediaAssets)
    }

    recorder.start(250) // collect chunks every 250ms

    const startTime = performance.now()
    const frameIntervalMs = 1000 / targetFps
    let currentPlayheadSec = 0

    return new Promise((resolve, reject) => {
      const renderLoop = () => {
        if (this.isCancelled) {
          hybridAudio.stopAll()
          onProgress({
            state: 'cancelled',
            percent: 0,
            elapsedSec: 0,
            remainingSec: 0,
            currentSec: 0,
            totalSec: totalDurationSec,
            fps: 0,
            phaseText: 'Export cancelled by user',
          })
          reject(new Error('Export cancelled by user'))
          return
        }

        const elapsedMs = performance.now() - startTime
        currentPlayheadSec = elapsedMs / 1000

        // Draw frame at current playhead
        drawCompositionFrame(renderCtx, currentPlayheadSec)

        const percent = Math.min(99, Math.round((currentPlayheadSec / totalDurationSec) * 100))
        const remainingSec = Math.max(0, Math.round(totalDurationSec - currentPlayheadSec))
        const elapsedSec = Math.round(currentPlayheadSec)

        onProgress({
          state: 'rendering',
          percent,
          elapsedSec,
          remainingSec,
          currentSec: currentPlayheadSec,
          totalSec: totalDurationSec,
          fps: targetFps,
          phaseText: `Rendering composition frames (${percent}%)`,
        })

        if (currentPlayheadSec < totalDurationSec) {
          setTimeout(renderLoop, frameIntervalMs)
        } else {
          // Finished rendering timeline
          finishExport()
        }
      }

      const finishExport = () => {
        onProgress({
          state: 'finalizing',
          percent: 99,
          elapsedSec: Math.round(totalDurationSec),
          remainingSec: 0,
          currentSec: totalDurationSec,
          totalSec: totalDurationSec,
          fps: targetFps,
          phaseText: 'Finalizing seekable video container and metadata...',
        })

        hybridAudio.stopAll()

        recorder.onstop = async () => {
          try {
            const rawBlob = new Blob(chunks, { type: mimeType })
            let finalBlob = rawBlob

            // If WebM, fix duration header using fixWebmDuration so players can scrub properly
            if (extension === 'webm') {
              try {
                finalBlob = await new Promise<Blob>((res) => {
                  fixWebmDuration(rawBlob, totalDurationSec * 1000, (seekable) => {
                    res(seekable)
                  })
                })
              } catch {
                finalBlob = rawBlob
              }
            }

            const formattedSize = (finalBlob.size / (1024 * 1024)).toFixed(2) + ' MB'
            const cleanName = project.settings.name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()
            const fileName = `${cleanName}_${config.resolution}_${Date.now()}.${extension}`

            onProgress({
              state: 'completed',
              percent: 100,
              elapsedSec: Math.round((performance.now() - startTime) / 1000),
              remainingSec: 0,
              currentSec: totalDurationSec,
              totalSec: totalDurationSec,
              fps: targetFps,
              phaseText: 'Export completed successfully!',
              fileSizeEstimate: formattedSize,
            })

            resolve({
              blob: finalBlob,
              fileName,
              mimeType,
              extension,
              sizeBytes: finalBlob.size,
              formattedSize,
              durationSec: totalDurationSec,
            })
          } catch (err) {
            reject(err)
          }
        }

        recorder.stop()
      }

      // Kick off render loop
      renderLoop()
    })
  }
}
