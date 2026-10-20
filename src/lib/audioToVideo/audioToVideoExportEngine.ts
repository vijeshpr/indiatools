/**
 * IndiaTools — Audio to Video Studio
 * Video Export Engine with Synchronized Audio & WebM Seekability
 */

import { makeWebmSeekable } from '../video/webmSeekableEngine.ts'

export interface ExportProgress {
  status: 'idle' | 'preparing' | 'recording' | 'finalizing' | 'completed' | 'error' | 'cancelled'
  progressPercent: number
  elapsedSec: number
  estimatedRemainingSec: number
  fps: number
  errorMessage?: string
  blobUrl?: string
  fileName?: string
  fileSizeBytes?: number
}

export class AudioToVideoExportEngine {
  private mediaRecorder: MediaRecorder | null = null
  private recordedChunks: Blob[] = []
  private isExporting = false
  private cancelled = false

  public static getSupportedMimeType(): string {
    const candidateTypes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=h264,opus',
      'video/webm',
    ]
    for (const type of candidateTypes) {
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
        return type
      }
    }
    return 'video/webm'
  }

  public async startExport(
    canvas: HTMLCanvasElement,
    audioTrack: MediaStreamTrack | null,
    totalDurationSec: number,
    fps: number = 30,
    onProgress: (prog: ExportProgress) => void
  ): Promise<{ blob: Blob; url: string; fileName: string }> {
    if (this.isExporting) {
      throw new Error('An export session is already in progress.')
    }
    this.isExporting = true
    this.cancelled = false
    this.recordedChunks = []

    onProgress({
      status: 'preparing',
      progressPercent: 0,
      elapsedSec: 0,
      estimatedRemainingSec: totalDurationSec,
      fps: 0,
    })

    // Capture video stream from canvas
    const canvasStream = canvas.captureStream(fps)
    const combinedStream = new MediaStream()

    canvasStream.getVideoTracks().forEach((track) => combinedStream.addTrack(track))
    if (audioTrack) {
      combinedStream.addTrack(audioTrack)
    }

    const mimeType = AudioToVideoExportEngine.getSupportedMimeType()
    const options: MediaRecorderOptions = {
      mimeType,
      videoBitsPerSecond: 6_000_000, // 6 Mbps for sharp 1080p rendering
    }

    return new Promise<{ blob: Blob; url: string; fileName: string }>((resolve, reject) => {
      try {
        this.mediaRecorder = new MediaRecorder(combinedStream, options)
      } catch (err) {
        this.isExporting = false
        onProgress({
          status: 'error',
          progressPercent: 0,
          elapsedSec: 0,
          estimatedRemainingSec: 0,
          fps: 0,
          errorMessage: 'MediaRecorder not supported on this device/browser.',
        })
        return reject(err)
      }

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data)
        }
      }

      this.mediaRecorder.onerror = (event: any) => {
        this.isExporting = false
        onProgress({
          status: 'error',
          progressPercent: 0,
          elapsedSec: 0,
          estimatedRemainingSec: 0,
          fps: 0,
          errorMessage: event.error?.message || 'Recording error occurred.',
        })
        reject(event.error)
      }

      this.mediaRecorder.onstop = async () => {
        if (this.cancelled) {
          this.isExporting = false
          onProgress({
            status: 'cancelled',
            progressPercent: 0,
            elapsedSec: 0,
            estimatedRemainingSec: 0,
            fps: 0,
          })
          return reject(new Error('Export cancelled by user.'))
        }

        onProgress({
          status: 'finalizing',
          progressPercent: 99,
          elapsedSec: totalDurationSec,
          estimatedRemainingSec: 0,
          fps,
        })

        try {
          const rawBlob = new Blob(this.recordedChunks, { type: mimeType })
          // Inject WebM Duration & Cues Seek Table for timeline scrubbing
          const seekableBlob = await makeWebmSeekable(rawBlob, totalDurationSec)
          const downloadUrl = URL.createObjectURL(seekableBlob)
          const fileName = `AudioToVideo_Studio_${Date.now()}.webm`

          this.isExporting = false

          onProgress({
            status: 'completed',
            progressPercent: 100,
            elapsedSec: totalDurationSec,
            estimatedRemainingSec: 0,
            fps,
            blobUrl: downloadUrl,
            fileName,
            fileSizeBytes: seekableBlob.size,
          })

          resolve({ blob: seekableBlob, url: downloadUrl, fileName })
        } catch (err: any) {
          this.isExporting = false
          onProgress({
            status: 'error',
            progressPercent: 0,
            elapsedSec: 0,
            estimatedRemainingSec: 0,
            fps: 0,
            errorMessage: err?.message || 'Failed to finalize video.',
          })
          reject(err)
        }
      }

      // Start recording with 500ms chunk timeslice
      this.mediaRecorder.start(500)

      const startTime = performance.now()
      const timer = setInterval(() => {
        if (!this.isExporting || this.cancelled) {
          clearInterval(timer)
          return
        }

        const elapsed = (performance.now() - startTime) / 1000
        const progress = Math.min(98, (elapsed / totalDurationSec) * 100)
        const remaining = Math.max(0, totalDurationSec - elapsed)

        onProgress({
          status: 'recording',
          progressPercent: Math.round(progress),
          elapsedSec: Math.round(elapsed),
          estimatedRemainingSec: Math.round(remaining),
          fps,
        })

        if (elapsed >= totalDurationSec) {
          clearInterval(timer)
          if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop()
          }
        }
      }, 300)
    })
  }

  public cancel(): void {
    if (this.isExporting && this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.cancelled = true
      this.mediaRecorder.stop()
    }
  }

  public isBusy(): boolean {
    return this.isExporting
  }
}
